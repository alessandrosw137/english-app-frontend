const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '..', 'server', 'server.js');
let code = fs.readFileSync(serverPath, 'utf8');

if (code.includes('/api/pets/co-parent')) {
  console.log('Endpoints already exist in server/server.js');
  process.exit(0);
}

// 1. Add inMemoryPets and inMemoryProfiles near top
const memDeclaration = `
// Almacenamiento volátil de respaldo para MasterPet y Perfil Social
const inMemoryPets = new Map();
const inMemoryProfiles = new Map();
`;

const anchorTop = "const { pool, initializeDatabase, getDatabaseUrl, RENDER_INTERNAL_URL, RENDER_EXTERNAL_URL } = require('./db');";
if (!code.includes(anchorTop)) {
  console.error('Top anchor not found');
  process.exit(1);
}
code = code.replace(anchorTop, anchorTop + '\n' + memDeclaration);

// 2. Add endpoints before admin router
const anchorEndpoints = "// MÓDULO DE ADMINISTRACIÓN (/api/admin)";
if (!code.includes(anchorEndpoints)) {
  console.error('Admin anchor not found');
  process.exit(1);
}

const endpointsCode = `
// ========================================================
// MASTERPET SANCTUARY & CRIANZA COMPARTIDA (/api/pets, /api/pets/co-parent)
// ========================================================

// 1. GET /api/pets: Obtiene mascotas del usuario o criadas en co-parenting
app.get('/api/pets', async (req, res) => {
  try {
    const username = (req.query.username || req.headers['x-user-username'] || '').trim();
    const userId = req.query.userId || req.headers['x-user-id'] || null;

    if (!username && !userId) {
      const allMem = Array.from(inMemoryPets.values());
      return res.json({ success: true, pets: allMem });
    }

    let client;
    try {
      client = await pool.connect();
      const query = \`
        SELECT id, user_id, username, species, name, data, co_parent_user_id, co_parent_username, updated_at
        FROM user_pets
        WHERE username = $1 OR co_parent_username = $1
        ORDER BY updated_at DESC
      \`;
      const result = await client.query(query, [username]);
      client.release();

      const pets = result.rows.map(r => {
        let petData = typeof r.data === 'string' ? JSON.parse(r.data) : (r.data || {});
        return {
          id: r.id,
          name: r.name,
          species: r.species,
          userId: r.user_id,
          username: r.username,
          coParentUsername: r.co_parent_username,
          ...petData
        };
      });

      return res.json({ success: true, pets });
    } catch (dbErr) {
      if (client) client.release();
      console.warn('⚠️ [PETS-DB] Fallback a memoria en GET /api/pets:', dbErr.message);
      const userPets = Array.from(inMemoryPets.values()).filter(p =>
        p.username === username || p.coParentUsername === username
      );
      return res.json({ success: true, pets: userPets, fallback: true });
    }
  } catch (err) {
    console.error('❌ [PETS] Error en GET /api/pets:', err.message);
    res.status(500).json({ error: 'Error al recuperar mascotas' });
  }
});

// 2. POST /api/pets: Crea o actualiza mascotas del usuario
app.post('/api/pets', async (req, res) => {
  try {
    const body = req.body || {};
    let petsToSave = [];
    if (Array.isArray(body.pets)) {
      petsToSave = body.pets;
    } else if (body.pet && typeof body.pet === 'object') {
      petsToSave = [body.pet];
    } else if (body.id && body.species) {
      petsToSave = [body];
    }

    if (!petsToSave.length) {
      return res.status(400).json({ error: 'No se enviaron datos válidos de mascotas.' });
    }

    const username = (body.username || req.headers['x-user-username'] || 'user').trim();
    const userId = body.userId || null;

    // Actualizar siempre memoria volátil
    petsToSave.forEach(p => {
      const petId = p.id || ('pet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));
      p.id = petId;
      p.username = p.username || username;
      inMemoryPets.set(petId, p);
    });

    let client;
    try {
      client = await pool.connect();
      for (const p of petsToSave) {
        const petId = p.id;
        const species = p.species || 'casimerito';
        const name = p.name || 'Mascota';
        const coParent = p.coParentUsername || (p.coParent && p.coParent.username) || null;

        await client.query(\`
          INSERT INTO user_pets (id, username, species, name, data, co_parent_username, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
          ON CONFLICT (id) DO UPDATE SET
            username = EXCLUDED.username,
            species = EXCLUDED.species,
            name = EXCLUDED.name,
            data = EXCLUDED.data,
            co_parent_username = COALESCE(EXCLUDED.co_parent_username, user_pets.co_parent_username),
            updated_at = NOW()
        \`, [petId, username, species, name, JSON.stringify(p), coParent]);
      }
      client.release();

      return res.json({
        success: true,
        message: 'Mascotas guardadas correctamente en la base de datos.',
        count: petsToSave.length,
        pets: petsToSave
      });
    } catch (dbErr) {
      if (client) client.release();
      console.warn('⚠️ [PETS-DB] Fallback a memoria en POST /api/pets:', dbErr.message);
      return res.json({
        success: true,
        message: 'Mascotas registradas en almacenamiento local/fallback.',
        count: petsToSave.length,
        pets: petsToSave,
        fallback: true
      });
    }
  } catch (err) {
    console.error('❌ [PETS] Error en POST /api/pets:', err.message);
    res.status(500).json({ error: 'Error al guardar mascotas' });
  }
});

// 3. POST /api/pets/co-parent: Asocia crianza compartida para una mascota
app.post('/api/pets/co-parent', async (req, res) => {
  try {
    const { petId, ownerUsername, coParentUsername, relationship } = req.body || {};
    if (!petId || !coParentUsername) {
      return res.status(400).json({ error: 'petId y coParentUsername son requeridos.' });
    }

    const coParent = coParentUsername.trim();
    const owner = (ownerUsername || '').trim();

    // Actualizar en memoria
    if (inMemoryPets.has(petId)) {
      const p = inMemoryPets.get(petId);
      p.coParentUsername = coParent;
      p.relationship = relationship || 'Co-Parent';
      inMemoryPets.set(petId, p);
    }

    let client;
    try {
      client = await pool.connect();
      const updateRes = await client.query(\`
        UPDATE user_pets
        SET co_parent_username = $1,
            data = jsonb_set(COALESCE(data, '{}'::jsonb), '{coParentUsername}', to_jsonb($1::text)),
            updated_at = NOW()
        WHERE id = $2
        RETURNING id, name, species, username, co_parent_username
      \`, [coParent, petId]);
      client.release();

      if (updateRes.rowCount === 0) {
        return res.json({
          success: true,
          message: \`Crianza compartida vinculada con @\${coParent} (Memoria/Local).\`,
          petId,
          coParentUsername: coParent
        });
      }

      return res.json({
        success: true,
        message: \`¡Crianza compartida con @\${coParent} vinculada con éxito!\`,
        pet: updateRes.rows[0]
      });
    } catch (dbErr) {
      if (client) client.release();
      console.warn('⚠️ [PETS-COPARENT-DB] Fallback por error de BD:', dbErr.message);
      return res.json({
        success: true,
        message: \`Crianza compartida vinculada con @\${coParent} (Modo Fallback).\`,
        petId,
        coParentUsername: coParent,
        fallback: true
      });
    }
  } catch (err) {
    console.error('❌ [PETS-COPARENT] Error:', err.message);
    res.status(500).json({ error: 'Error al vincular crianza compartida' });
  }
});

// ========================================================
// PERFIL SOCIAL ESTILO FACEBOOK / DISCORD (/api/profile/update)
// ========================================================

// 4. POST /api/profile/update: Actualiza biografía, avatar, portada, enlaces y hobbies
app.post('/api/profile/update', async (req, res) => {
  try {
    const {
      username,
      userId,
      bio,
      location,
      relationship,
      coverPhoto,
      avatarType,
      avatarEmoji,
      avatarCustomUrl,
      hobbies,
      socialLinks
    } = req.body || {};

    const uname = (username || req.headers['x-user-username'] || '').trim();
    if (!uname) {
      return res.status(400).json({ error: 'El nombre de usuario es obligatorio para actualizar el perfil.' });
    }

    const profileData = {
      username: uname,
      bio: bio !== undefined ? String(bio).trim() : '',
      location: location !== undefined ? String(location).trim() : '',
      relationship: relationship !== undefined ? String(relationship).trim() : '',
      coverPhoto: coverPhoto || 'linear-gradient(135deg, #0284c7 0%, #6366f1 50%, #a855f7 100%)',
      avatarType: avatarType || 'emoji',
      avatarEmoji: avatarEmoji || '🦊',
      avatarCustomUrl: avatarCustomUrl || '',
      hobbies: Array.isArray(hobbies) ? hobbies : [],
      socialLinks: (socialLinks && typeof socialLinks === 'object') ? socialLinks : {},
      updatedAt: new Date().toISOString()
    };

    // Actualizar siempre en memoria
    inMemoryProfiles.set(uname.toLowerCase(), profileData);

    let client;
    try {
      client = await pool.connect();
      let uid = userId;
      if (!uid) {
        const uRes = await client.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [uname]);
        if (uRes.rows.length > 0) {
          uid = uRes.rows[0].id;
        }
      }

      await client.query(\`
        INSERT INTO user_social_profiles (
          user_id, username, bio, location, relationship, cover_photo,
          avatar_type, avatar_emoji, avatar_custom_url, hobbies, social_links, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()
        )
        ON CONFLICT (username) DO UPDATE SET
          bio = EXCLUDED.bio,
          location = EXCLUDED.location,
          relationship = EXCLUDED.relationship,
          cover_photo = EXCLUDED.cover_photo,
          avatar_type = EXCLUDED.avatar_type,
          avatar_emoji = EXCLUDED.avatar_emoji,
          avatar_custom_url = EXCLUDED.avatar_custom_url,
          hobbies = EXCLUDED.hobbies,
          social_links = EXCLUDED.social_links,
          updated_at = NOW()
      \`, [
        uid || null,
        uname,
        profileData.bio,
        profileData.location,
        profileData.relationship,
        profileData.coverPhoto,
        profileData.avatarType,
        profileData.avatarEmoji,
        profileData.avatarCustomUrl,
        JSON.stringify(profileData.hobbies),
        JSON.stringify(profileData.socialLinks)
      ]);
      client.release();

      return res.json({
        success: true,
        message: 'Perfil social actualizado exitosamente en PostgreSQL.',
        profile: profileData
      });
    } catch (dbErr) {
      if (client) client.release();
      console.warn('⚠️ [PROFILE-UPDATE-DB] Fallback a memoria:', dbErr.message);
      return res.json({
        success: true,
        message: 'Perfil social actualizado (Modo Fallback en memoria).',
        profile: profileData,
        fallback: true
      });
    }
  } catch (err) {
    console.error('❌ [PROFILE-UPDATE] Error:', err.message);
    res.status(500).json({ error: 'Error al actualizar el perfil social' });
  }
});

// 5. GET /api/profile/:username: Recupera perfil social
app.get('/api/profile/:username', async (req, res) => {
  try {
    const uname = (req.params.username || '').trim();
    if (!uname) return res.status(400).json({ error: 'Username requerido' });

    let client;
    try {
      client = await pool.connect();
      const result = await client.query(\`
        SELECT username, bio, location, relationship, cover_photo,
               avatar_type, avatar_emoji, avatar_custom_url, hobbies, social_links, updated_at
        FROM user_social_profiles
        WHERE LOWER(username) = LOWER($1)
      \`, [uname]);
      client.release();

      if (result.rows.length > 0) {
        const row = result.rows[0];
        return res.json({
          success: true,
          profile: {
            username: row.username,
            bio: row.bio,
            location: row.location,
            relationship: row.relationship,
            coverPhoto: row.cover_photo,
            avatarType: row.avatar_type,
            avatarEmoji: row.avatar_emoji,
            avatarCustomUrl: row.avatar_custom_url,
            hobbies: typeof row.hobbies === 'string' ? JSON.parse(row.hobbies) : (row.hobbies || []),
            socialLinks: typeof row.social_links === 'string' ? JSON.parse(row.social_links) : (row.social_links || {}),
            updatedAt: row.updated_at
          }
        });
      }
    } catch (dbErr) {
      if (client) client.release();
      console.warn('⚠️ [PROFILE-GET-DB] Fallback a memoria:', dbErr.message);
    }

    const mem = inMemoryProfiles.get(uname.toLowerCase());
    if (mem) {
      return res.json({ success: true, profile: mem });
    }

    return res.json({
      success: true,
      profile: {
        username: uname,
        bio: 'Estudiante apasionado de inglés en MasterENG 🚀',
        location: '',
        relationship: 'Soltero',
        coverPhoto: 'linear-gradient(135deg, #0284c7 0%, #6366f1 50%, #a855f7 100%)',
        avatarType: 'emoji',
        avatarEmoji: '🦊',
        avatarCustomUrl: '',
        hobbies: ['Lectura en inglés', 'Música', 'Pronunciación'],
        socialLinks: {}
      }
    });
  } catch (err) {
    console.error('❌ [PROFILE-GET] Error:', err.message);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});
`;

code = code.replace(anchorEndpoints, endpointsCode + '\n' + anchorEndpoints);
fs.writeFileSync(serverPath, code, 'utf8');
console.log('Successfully inserted /api/pets, /api/pets/co-parent, and /api/profile/update in server/server.js');

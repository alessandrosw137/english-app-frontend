const http = require('http');
const { app, pool } = require('./server');

const TEST_PORT = 3124;
let server;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      ...headers,
      ...(payload ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      } : {})
    };

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path,
        method,
        headers: reqHeaders
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Iniciando batería de pruebas para Autenticación Estricta & PostgreSQL...');

  server = app.listen(TEST_PORT, '127.0.0.1');
  await new Promise((resolve) => server.on('listening', resolve));
  console.log(`📡 Servidor de pruebas escuchando en http://127.0.0.1:${TEST_PORT}`);

  const testUser = `test_auth_${Date.now()}`;
  const testEmail = `${testUser}@dominio.com`;
  const testPassword = 'SecurePassword2026!';
  let jwtToken = null;

  try {
    // 1. Health check
    console.log('\n--- 1. Probando GET /api/health ---');
    const healthRes = await request('GET', '/api/health');
    console.log('Status:', healthRes.status, '- Online:', healthRes.data.online);
    if (healthRes.status !== 200 || !healthRes.data.online) {
      throw new Error('Falló el endpoint /api/health');
    }
    console.log('✅ /api/health OK');

    // 2. Register con correo inválido (debe rechazar con 400)
    console.log('\n--- 2. Probando /api/auth/register con formatos de email inválidos ---');
    const invalidEmails = ['correo-invalido', 'usuario@', '@dominio.com', 'usuario@dominio', ''];
    for (const badEmail of invalidEmails) {
      const badEmailRes = await request('POST', '/api/auth/register', {
        username: `user_${Date.now()}`,
        email: badEmail,
        password: testPassword
      });
      console.log(`Email '${badEmail}' -> Status ${badEmailRes.status}:`, badEmailRes.data.error);
      if (badEmailRes.status !== 400) {
        throw new Error(`Falló la validación estricta de email para '${badEmail}': esperado 400, obtenido ${badEmailRes.status}`);
      }
    }
    console.log('✅ Rechazo estricto con código 400 para emails inválidos OK');

    // 3. Register con datos válidos y email real (201)
    console.log('\n--- 3. Probando /api/auth/register con datos válidos ---');
    const regRes = await request('POST', '/api/auth/register', {
      username: testUser,
      email: testEmail,
      password: testPassword
    });
    console.log('Status:', regRes.status);
    console.log('Usuario registrado:', regRes.data.user?.username, '- Email:', regRes.data.user?.email);
    console.log('Token presente:', !!regRes.data.token);
    if (regRes.status !== 201 || !regRes.data.token || regRes.data.user?.email !== testEmail) {
      throw new Error('Falló el registro válido en /api/auth/register');
    }
    console.log('✅ /api/auth/register con encriptación bcrypt y token JWT OK');

    // 4. Register duplicado (debe rechazar obligatoriamente con código 400)
    console.log('\n--- 4. Probando /api/auth/register con usuario o correo ya existente ---');
    const dupUserRes = await request('POST', '/api/auth/register', {
      username: testUser,
      email: `other_${Date.now()}@dominio.com`,
      password: testPassword
    });
    console.log('Reintento con mismo username -> Status:', dupUserRes.status, '- Error:', dupUserRes.data.error);
    if (dupUserRes.status !== 400) {
      throw new Error(`Reintento de usuario duplicado debe responder 400, respondió ${dupUserRes.status}`);
    }

    const dupEmailRes = await request('POST', '/api/auth/register', {
      username: `new_user_${Date.now()}`,
      email: testEmail,
      password: testPassword
    });
    console.log('Reintento con mismo email -> Status:', dupEmailRes.status, '- Error:', dupEmailRes.data.error);
    if (dupEmailRes.status !== 400) {
      throw new Error(`Reintento de email duplicado debe responder 400, respondió ${dupEmailRes.status}`);
    }
    console.log('✅ Rechazo con código 400 por duplicidad verificado con éxito');

    // 5. Login con cadenas vacías o sin credenciales (debe rechazar con 401)
    console.log('\n--- 5. Probando /api/auth/login con cadenas vacías o incompletas ---');
    const emptyLogins = [
      { username: '', password: '' },
      { username: testUser, password: '' },
      { username: '', password: testPassword },
      { identifier: '   ', password: '   ' }
    ];
    for (const emptyAttempt of emptyLogins) {
      const emptyRes = await request('POST', '/api/auth/login', emptyAttempt);
      console.log(`Intento ${JSON.stringify(emptyAttempt)} -> Status ${emptyRes.status}:`, emptyRes.data.error);
      if (emptyRes.status !== 401) {
        throw new Error(`Login con credenciales vacías debe responder 401, respondió ${emptyRes.status}`);
      }
    }
    console.log('✅ Rechazo con código 401 para credenciales vacías OK');

    // 6. Login con credenciales inventadas o correos no registrados (debe rechazar con 401)
    console.log('\n--- 6. Probando /api/auth/login con usuario/correo no registrado ---');
    const fakeRes = await request('POST', '/api/auth/login', {
      username: 'usuario_completamente_inexistente_9999',
      password: testPassword
    });
    console.log('Status usuario inexistente:', fakeRes.status, '- Error:', fakeRes.data.error);
    if (fakeRes.status !== 401) {
      throw new Error(`Login de usuario inexistente debe responder 401, respondió ${fakeRes.status}`);
    }

    const fakeEmailRes = await request('POST', '/api/auth/login', {
      email: 'no_existe_tampoco@dominio.com',
      password: testPassword
    });
    console.log('Status correo inexistente:', fakeEmailRes.status, '- Error:', fakeEmailRes.data.error);
    if (fakeEmailRes.status !== 401) {
      throw new Error(`Login de correo inexistente debe responder 401, respondió ${fakeEmailRes.status}`);
    }
    console.log('✅ Rechazo con código 401 para cuentas no registradas OK');

    // 7. Login con contraseña incorrecta (debe rechazar con 401)
    console.log('\n--- 7. Probando /api/auth/login con contraseña incorrecta ---');
    const wrongPassRes = await request('POST', '/api/auth/login', {
      username: testUser,
      password: 'PasswordCompletamenteErroneo999!'
    });
    console.log('Status contraseña incorrecta:', wrongPassRes.status, '- Error:', wrongPassRes.data.error);
    if (wrongPassRes.status !== 401) {
      throw new Error(`Login con contraseña errónea debe responder 401, respondió ${wrongPassRes.status}`);
    }
    console.log('✅ Validación estricta con bcrypt.compare (401 ante no coincidencia) OK');

    // 8. Login legítimo exitoso con username (200 + token + exp + rank)
    console.log('\n--- 8. Probando /api/auth/login exitoso con username ---');
    const loginUserRes = await request('POST', '/api/auth/login', {
      username: testUser,
      password: testPassword
    });
    console.log('Status:', loginUserRes.status);
    console.log('Token presente:', !!loginUserRes.data.token);
    console.log('Stats:', loginUserRes.data.stats);
    if (loginUserRes.status !== 200 || !loginUserRes.data.token || loginUserRes.data.stats.exp === undefined || !loginUserRes.data.stats.rank) {
      throw new Error('Falló el login legítimo con username');
    }
    jwtToken = loginUserRes.data.token;
    console.log('✅ Login con username OK');

    // 9. Login legítimo exitoso con email (200 + token + exp + rank)
    console.log('\n--- 9. Probando /api/auth/login exitoso con email ---');
    const loginEmailRes = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: testPassword
    });
    console.log('Status:', loginEmailRes.status);
    console.log('Token presente:', !!loginEmailRes.data.token);
    if (loginEmailRes.status !== 200 || !loginEmailRes.data.token) {
      throw new Error('Falló el login legítimo con email');
    }
    console.log('✅ Login con email OK');

    // 10. Sincronización de progreso con token JWT autenticado (vía /api/progress/sync y /api/progress)
    console.log('\n--- 10a. Probando POST /api/progress/sync autenticado ---');
    const syncRes = await request(
      'POST',
      '/api/progress/sync',
      {
        username: testUser,
        exp: 750,
        streak_days: 2,
        modules: [{ module_id: 'phrasal_verbs', current_level: 2, completed_nodes: ['pv_1'] }]
      },
      { Authorization: `Bearer ${jwtToken}` }
    );
    console.log('Status sync:', syncRes.status, '- Stats:', syncRes.data.stats);
    if (syncRes.status !== 200 || syncRes.data.stats.exp !== 750) {
      throw new Error('Falló la sincronización de progreso en /api/progress/sync');
    }
    console.log('✅ Sincronización en /api/progress/sync OK');

    console.log('\n--- 10b. Probando POST /api/progress autenticado con CORS ---');
    const progressPostRes = await request(
      'POST',
      '/api/progress',
      {
        username: testUser,
        exp_gained: 50,
        reason: 'speaking_coach'
      },
      {
        Authorization: `Bearer ${jwtToken}`,
        Origin: 'https://english-app-frontend-3j9w.onrender.com'
      }
    );
    console.log('Status POST /api/progress:', progressPostRes.status, '- EXP:', progressPostRes.data.stats?.exp);
    console.log('CORS Allow-Origin:', progressPostRes.headers['access-control-allow-origin']);
    if (progressPostRes.status !== 200 || progressPostRes.data.stats?.exp !== 800) {
      throw new Error('Falló la actualización en POST /api/progress');
    }
    if (progressPostRes.headers['access-control-allow-origin'] !== 'https://english-app-frontend-3j9w.onrender.com') {
      throw new Error('Falló la cabecera CORS para https://english-app-frontend-3j9w.onrender.com');
    }
    console.log('✅ POST /api/progress con cabeceras CORS de producción OK');

    console.log('\n--- 10c. Probando GET /api/progress no autenticado (401 esperado) ---');
    const unauthProgressRes = await request('GET', '/api/progress');
    console.log('Status GET /api/progress sin auth:', unauthProgressRes.status);
    if (unauthProgressRes.status !== 401) {
      throw new Error(`Esperado 401 para GET /api/progress sin credenciales, obtenido ${unauthProgressRes.status}`);
    }
    console.log('✅ GET /api/progress sin auth rechaza con 401 OK');

    console.log('\n--- 10d. Probando GET /api/progress autenticado (200 esperado) ---');
    const getProgressRes = await request('GET', '/api/progress', null, {
      Authorization: `Bearer ${jwtToken}`,
      Origin: 'https://english-app-frontend-3j9w.onrender.com'
    });
    console.log('Status GET /api/progress con auth:', getProgressRes.status, '- Stats:', getProgressRes.data.stats);
    if (getProgressRes.status !== 200 || !getProgressRes.data.stats || getProgressRes.data.stats.exp !== 800) {
      throw new Error('Falló la consulta en GET /api/progress autenticado');
    }
    console.log('✅ GET /api/progress autenticado OK');

    // 11. Búsqueda real en YouTube / YouTube Music (/api/music/search)
    console.log('\n--- 11. Probando GET /api/music/search ---');
    const searchRes = await request('GET', '/api/music/search?q=' + encodeURIComponent('Coldplay Yellow'));
    console.log('Status:', searchRes.status);
    console.log('Total resultados encontrados:', Array.isArray(searchRes.data) ? searchRes.data.length : 0);
    if (searchRes.status !== 200 || !Array.isArray(searchRes.data) || searchRes.data.length === 0) {
      throw new Error('Falló el endpoint /api/music/search');
    }
    const firstTrack = searchRes.data[0];
    console.log('Primer resultado:', {
      id: firstTrack.id,
      title: firstTrack.title,
      artist: firstTrack.artist,
      thumbnail: firstTrack.thumbnail,
      duration: firstTrack.duration
    });
    if (!firstTrack.id || !firstTrack.title || !firstTrack.artist || !firstTrack.thumbnail || !firstTrack.duration) {
      throw new Error('El resultado de /api/music/search no contiene todos los campos requeridos (id, title, artist, thumbnail, duration)');
    }
    console.log('✅ /api/music/search con catálogo real de YouTube OK');

    // 12. Letras sincronizadas con marcas de tiempo (Timestamps) y traducción al español
    console.log('\n--- 12. Probando GET /api/music/lyrics con canción conocida ---');
    const lyricsRes = await request('GET', `/api/music/lyrics?id=${firstTrack.id}&title=${encodeURIComponent(firstTrack.title)}&artist=${encodeURIComponent(firstTrack.artist)}`);
    console.log('Status:', lyricsRes.status);
    console.log('Total estrofas/líneas:', Array.isArray(lyricsRes.data) ? lyricsRes.data.length : 0);
    if (lyricsRes.status !== 200 || !Array.isArray(lyricsRes.data) || lyricsRes.data.length === 0) {
      throw new Error('Falló el endpoint /api/music/lyrics');
    }
    const firstLine = lyricsRes.data[0];
    console.log('Muestra primera línea:', firstLine);
    if (typeof firstLine.time !== 'number' || !firstLine.text || !firstLine.es) {
      throw new Error('La estructura de letra sincronizada debe contener { time, text, es }');
    }
    console.log('✅ /api/music/lyrics con timestamps y traducción al español OK');

    // 13. Canción personalizada externa sin letra oficial -> Generador contextual con intervalos
    console.log('\n--- 13. Probando GET /api/music/lyrics con canción personalizada externa (Fallback Contextual) ---');
    const customLyricsRes = await request('GET', '/api/music/lyrics?id=external_custom_999&title=Acoustic%20English%20Lesson&artist=Independent%20Tutor');
    console.log('Status:', customLyricsRes.status);
    console.log('Estrofas contextuales generadas:', customLyricsRes.data.length);
    if (customLyricsRes.status !== 200 || !Array.isArray(customLyricsRes.data) || customLyricsRes.data.length === 0) {
      throw new Error('Falló el fallback contextual de /api/music/lyrics');
    }
    const customSample = customLyricsRes.data[0];
    console.log('Muestra estrofa contextual:', customSample);
    if (typeof customSample.time !== 'number' || !customSample.text || !customSample.es) {
      throw new Error('El fallback contextual debe cumplir con { time, text, es }');
    }
    console.log('✅ Extractor contextual con intervalos y traducción al español OK');

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE MÚSICA, BÚSQUEDA Y LETRAS PASARON EXITOSAMENTE!');
  } catch (err) {
    console.error('❌ Error durante la ejecución de pruebas:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await pool.end();
    console.log('🛑 Servidor de pruebas y pool de conexiones cerrados.');
  }
}

runTests();

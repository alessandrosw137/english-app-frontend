const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

// URLs oficiales de la base de datos Render
const RENDER_INTERNAL_URL =
  'postgresql://english_app_r0ka_user:gpIJ8uplBBX4BoFTg7kjJ6fcMIdoOxfS@dpg-db8rh2ss728c73aqmsc0-a/english_app_r0ka';
const RENDER_EXTERNAL_URL =
  'postgresql://english_app_r0ka_user:gpIJ8uplBBX4BoFTg7kjJ6fcMIdoOxfS@dpg-db8rh2ss728c73aqmsc0-a.oregon-postgres.render.com/english_app_r0ka';

/**
 * Determina dinámicamente la URL de conexión según el entorno:
 * - Render (Producción): Internal Database URL
 * - Desarrollo Local: External Database URL
 */
function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  const isProduction = Boolean(
    process.env.RENDER ||
    process.env.NODE_ENV === 'production' ||
    process.env.IS_PRODUCTION
  );
  if (isProduction && process.env.INTERNAL_DATABASE_URL) {
    return process.env.INTERNAL_DATABASE_URL;
  }
  return isProduction ? RENDER_INTERNAL_URL : RENDER_EXTERNAL_URL;
}

const isRenderEnvironment = Boolean(
  process.env.RENDER ||
  process.env.NODE_ENV === 'production' ||
  process.env.IS_PRODUCTION
);
const connectionString = getDatabaseUrl();

console.log(`🔌 [PostgreSQL Render] Modo detectado: ${isRenderEnvironment ? 'Producción (Render Internal)' : 'Desarrollo Local (Render External)'}`);

// Configuración del Pool con SSL obligatorio
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on('error', (err) => {
  console.error('❌ [PostgreSQL Render] Error inesperado en el pool:', err.message);
});

/**
 * Inicializa automáticamente el esquema y las tablas en PostgreSQL Render
 */
async function initializeDatabase() {
  console.log('🔄 [PostgreSQL Render] Iniciando verificación y creación de tablas...');
  const client = await pool.connect();

  try {
    // 1. Consulta de prueba inicial
    const testRes = await client.query('SELECT NOW() as now, current_database() as db');
    const currentDb = testRes.rows[0].db || 'english_app_r0ka';
    console.log(`[PostgreSQL Render] Conexión establecida con éxito a ${currentDb}`);

    // 2. DDL: Creación y verificación de tablas requeridas
    const ddl = `
      -- 1. Tabla de Usuarios
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
      );

      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
      ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

      -- 2. Tabla de Estadísticas de Usuario
      CREATE TABLE IF NOT EXISTS user_stats (
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          exp INT DEFAULT 0,
          rank VARCHAR(50) DEFAULT 'Bronce',
          streak_days INT DEFAULT 1,
          updated_at TIMESTAMP DEFAULT NOW()
      );

      ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS level INT DEFAULT 1;
      ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS last_login TIMESTAMP DEFAULT NOW();

      -- 3. Tabla de Progreso por Módulos
      CREATE TABLE IF NOT EXISTS module_progress (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          module_key VARCHAR(100),
          level INT DEFAULT 1,
          completed BOOLEAN DEFAULT FALSE
      );

      ALTER TABLE module_progress ADD COLUMN IF NOT EXISTS module_id VARCHAR(100);
      ALTER TABLE module_progress ADD COLUMN IF NOT EXISTS current_level INT DEFAULT 1;
      ALTER TABLE module_progress ADD COLUMN IF NOT EXISTS completed_nodes JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE module_progress ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

      -- 4. Tabla de Historial TOEFL
      CREATE TABLE IF NOT EXISTS toefl_history (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          score INT NOT NULL,
          total_questions INT NOT NULL,
          exam_type VARCHAR(100) DEFAULT 'Sentence Completion',
          completed_at TIMESTAMP DEFAULT NOW()
      );

      -- 5. Tabla de Feedbacks / Comentarios Anti-Spam
      CREATE TABLE IF NOT EXISTS feedbacks (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE SET NULL,
          user_email VARCHAR(150),
          username VARCHAR(100),
          feedback_text TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
      );

      -- Sincronizar campos si module_key o module_id están vacíos
      UPDATE module_progress
      SET module_id = COALESCE(module_id, module_key),
          module_key = COALESCE(module_key, module_id),
          current_level = COALESCE(current_level, level),
          level = COALESCE(level, current_level);

      -- Garantizar restricciones y llaves primarias consistentes
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conrelid = 'users'::regclass AND contype = 'p'
        ) THEN
          ALTER TABLE users ADD PRIMARY KEY (id);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conrelid = 'user_stats'::regclass AND contype = 'p'
        ) THEN
          ALTER TABLE user_stats ADD PRIMARY KEY (user_id);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conrelid = 'module_progress'::regclass AND contype = 'p'
        ) THEN
          ALTER TABLE module_progress ADD PRIMARY KEY (id);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conrelid = 'module_progress'::regclass AND conname = 'uq_user_module'
        ) THEN
          BEGIN
            ALTER TABLE module_progress ADD CONSTRAINT uq_user_module UNIQUE (user_id, module_id);
          EXCEPTION WHEN OTHERS THEN
            NULL;
          END;
        END IF;
      END
      $$;

      -- Índices para optimizar rendimiento de consultas
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
      CREATE INDEX IF NOT EXISTS idx_module_progress_user_mod ON module_progress(user_id, module_id);
      CREATE INDEX IF NOT EXISTS idx_module_progress_updated ON module_progress(updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_toefl_history_user_id ON toefl_history(user_id);
      CREATE INDEX IF NOT EXISTS idx_toefl_history_completed ON toefl_history(completed_at DESC);
    `;

    await client.query(ddl);

    const bcrypt = require('bcryptjs');

    // 3. Crear o verificar usuario administrador principal ('admin' / 'admin@antigravity.com' / 'Admin2026!Master')
    const checkMainAdmin = await client.query(
      'SELECT id, role, password_hash FROM users WHERE username = $1 OR email = $2',
      ['admin', 'admin@antigravity.com']
    );

    if (checkMainAdmin.rows.length === 0) {
      const mainHash = await bcrypt.hash('Admin2026!Master', 10);
      const insertAdminRes = await client.query(
        `INSERT INTO users (username, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ['admin', 'admin@antigravity.com', mainHash, 'admin']
      );
      const adminId = insertAdminRes.rows[0].id;
      await client.query(
        `INSERT INTO user_stats (user_id, exp, level, rank, streak_days, last_login)
         VALUES ($1, 1000, 5, 'Platino', 10, NOW())
         ON CONFLICT (user_id) DO UPDATE SET exp = GREATEST(user_stats.exp, 1000), rank = 'Platino'`,
        [adminId]
      );
      console.log('👑 [PostgreSQL Render] Usuario administrador principal creado: "admin" (admin@antigravity.com).');
    } else {
      const existingAdmin = checkMainAdmin.rows[0];
      const matchPass = await bcrypt.compare('Admin2026!Master', existingAdmin.password_hash || '');
      if (existingAdmin.role !== 'admin' || !matchPass) {
        const newHash = await bcrypt.hash('Admin2026!Master', 10);
        await client.query(
          "UPDATE users SET role = 'admin', password_hash = $1 WHERE id = $2",
          [newHash, existingAdmin.id]
        );
      }
    }

    // 3.1 Crear o verificar usuario administrador desarrollador
    const devUser = 'Wilberth Alessandro Molina Cutz';
    const checkDev = await client.query('SELECT id, role FROM users WHERE username = $1', [devUser]);
    if (checkDev.rows.length === 0) {
      const hash = await bcrypt.hash('master-admin-2026', 10);
      const devEmail = 'wilberth.admin@englishapp.com';
      const insertDevRes = await client.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [devUser, devEmail, hash, 'admin']
      );
      const devId = insertDevRes.rows[0].id;
      await client.query(
        "INSERT INTO user_stats (user_id, exp, level, rank, streak_days, last_login) VALUES ($1, 500, 2, 'Plata', 7, NOW()) ON CONFLICT (user_id) DO NOTHING",
        [devId]
      );
      console.log(`👑 [PostgreSQL Render] Usuario desarrollador creado: "${devUser}".`);
    } else if (checkDev.rows[0].role !== 'admin') {
      await client.query("UPDATE users SET role = 'admin' WHERE id = $1", [checkDev.rows[0].id]);
    }

    console.log('✅ [PostgreSQL Render] Tablas e índices inicializados correctamente.');
    return true;
  } catch (err) {
    console.error('❌ [PostgreSQL Render] Error durante la inicialización:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// Ejecución directa si se invoca con `node db.js`
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🚀 [PostgreSQL Render] Proceso de inicialización finalizado.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ [PostgreSQL Render] Fallo en la inicialización:', err.message);
      process.exit(1);
    });
}

module.exports = {
  pool,
  initializeDatabase,
  getDatabaseUrl,
  RENDER_INTERNAL_URL,
  RENDER_EXTERNAL_URL
};

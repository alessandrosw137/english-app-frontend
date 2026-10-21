const express = require('express');
const cors = require('cors');
const http = require('http');
const crypto = require('crypto');
const { WebSocketServer, WebSocket } = require('ws');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

let jwt = null;
try {
  jwt = require('jsonwebtoken');
} catch (_) {
  jwt = null;
}

let ytSearch = null;
try {
  ytSearch = require('yt-search');
} catch (_) {
  ytSearch = null;
}

const { pool, initializeDatabase, getDatabaseUrl, RENDER_INTERNAL_URL, RENDER_EXTERNAL_URL } = require('./db');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'english_app_jwt_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

pool.on('error', (err) => {
  console.error('❌ [PG-POOL] Error inesperado en el pool de clientes PostgreSQL:', err.message);
});

// Resiliencia a nivel de proceso para evitar que errores asíncronos tiren Node.js
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ [PROCESS] Promesa rechazada no manejada capturada:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️ [PROCESS] Excepción no capturada controlada:', err.message);
});

const app = express();
app.set('trust proxy', true);

// Middleware y configuración de CORS universal para Web y WebView nativo Android
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-device-key']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir frontend directamente desde app/src/main/assets
const assetsDir = path.join(__dirname, '..', 'app', 'src', 'main', 'assets');
app.use(express.static(assetsDir));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Lista estándar de los 10 módulos
const DEFAULT_MODULE_KEYS = [
  'phrasal_verbs',
  'connectors',
  'everyday_actions',
  'compound_words',
  'affixes_morphology',
  'grammar_path',
  'professional_english',
  'social_dating',
  'internet_slang',
  'toefl_simulator'
];

// Helper: Cálculo de rango según EXP
function calculateRank(exp) {
  const current = Math.max(0, parseInt(exp, 10) || 0);
  if (current < 500) return 'Bronce';
  if (current < 1500) return 'Plata';
  if (current < 3000) return 'Oro';
  if (current < 5000) return 'Platino';
  if (current < 8000) return 'Diamante';
  return 'Maestro';
}

// Helper: Cálculo de nivel según EXP si no se provee explícitamente
function calculateLevel(exp, explicitLevel) {
  const parsedLevel = parseInt(explicitLevel, 10);
  if (!isNaN(parsedLevel) && parsedLevel >= 1) {
    return parsedLevel;
  }
  const currentExp = Math.max(0, parseInt(exp, 10) || 0);
  return Math.max(1, Math.floor(currentExp / 250) + 1);
}

// Helper: Validación estricta de formato de correo electrónico
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed) && trimmed.length <= 254;
}

// Helper: Generación y verificación de JWT (usa jsonwebtoken con fallback nativo HMAC-SHA256)
function generateToken(user, stats = {}) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email || null,
    role: user.role || 'user',
    exp_points: stats.exp ?? 0,
    rank: stats.rank || calculateRank(stats.exp ?? 0)
  };

  if (jwt) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const nowSec = Math.floor(Date.now() / 1000);
  const body = Buffer.from(
    JSON.stringify({ ...payload, iat: nowSec, exp: nowSec + 7 * 24 * 3600 })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    if (jwt) {
      return jwt.verify(token, JWT_SECRET);
    }
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${parts[0]}.${parts[1]}`)
      .digest('base64url');
    if (parts[2] !== expectedSig) return null;
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch (_) {
    return null;
  }
}

function extractTokenFromHeader(req) {
  const authHeader = req.headers && req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return null;
}

// ========================================================
// SEGURIDAD DE ADMINISTRACIÓN: CONTROL DE IP Y DISPOSITIVO MAESTRO
// ========================================================
const ADMIN_DENIED_ERROR = { error: 'Acceso denegado: Dispositivo o red no autorizada para administración' };
const ADMIN_DEVICE_KEY = process.env.ADMIN_DEVICE_KEY || 'MasterENG-Admin-Secure-2026-DeviceKey';

const ALLOWED_ADMIN_IPS = new Set([
  '::1',
  '127.0.0.1',
  '::ffff:127.0.0.1',
  '192.168.1.76',
  '::ffff:192.168.1.76',
  'localhost'
]);

const ALLOWED_IPV6_PREFIX = '2806:10be:7:2d74:';

function getClientIp(req) {
  const forwarded = req.headers && req.headers['x-forwarded-for'];
  if (forwarded && typeof forwarded === 'string') {
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  return (req.socket && req.socket.remoteAddress) || req.ip || '';
}

function isAllowedAdminIp(rawIp) {
  if (!rawIp) return false;
  let ip = String(rawIp).trim().toLowerCase();

  // Eliminar prefijo IPv4 mapeado en IPv6 si existe
  if (ip.startsWith('::ffff:')) {
    const unmapped = ip.slice(7);
    if (ALLOWED_ADMIN_IPS.has(unmapped)) return true;
  }

  // 1. Coincidencia exacta con lista blanca local / desarrollo
  if (ALLOWED_ADMIN_IPS.has(ip)) return true;

  // 2. Prefijo IPv6 del módem del desarrollador (2806:10be:7:2d74::/64)
  if (
    ip.startsWith(ALLOWED_IPV6_PREFIX.toLowerCase()) ||
    ip.startsWith('2806:10be:7:2d74::') ||
    ip.startsWith('2806:10be:0007:2d74:')
  ) {
    return true;
  }

  // 3. Variable de entorno opcional de respaldo en Render (ADMIN_ALLOWED_IP)
  const envAllowedIp = process.env.ADMIN_ALLOWED_IP;
  if (envAllowedIp) {
    const envList = envAllowedIp.split(',').map((item) => item.trim().toLowerCase());
    if (envList.includes(ip) || envList.includes(rawIp.trim().toLowerCase())) {
      return true;
    }
  }

  return false;
}

function isValidAdminDevice(req) {
  const deviceKey = req.headers && req.headers['x-admin-device-key'];
  if (!deviceKey || typeof deviceKey !== 'string') return false;
  return deviceKey.trim() === ADMIN_DEVICE_KEY;
}

// Middleware: Lista blanca de IPs y validación de Dispositivo Maestro para Admin
function adminIpWhitelist(req, res, next) {
  const clientIp = getClientIp(req);
  if (!isAllowedAdminIp(clientIp) || !isValidAdminDevice(req)) {
    console.warn(`🛡️ [ADMIN-SECURITY] Acceso bloqueado a ruta de administración desde IP: ${clientIp}, deviceKey: ${req.headers && req.headers['x-admin-device-key'] ? 'inválido' : 'ausente'}`);
    return res.status(403).json(ADMIN_DENIED_ERROR);
  }
  next();
}

// Middleware: Verificación estricta de autorización para Administradores
async function requireAdmin(req, res, next) {
  try {
    const clientIp = getClientIp(req);
    if (!isAllowedAdminIp(clientIp) || !isValidAdminDevice(req)) {
      console.warn(`🛡️ [ADMIN-SECURITY] requireAdmin bloqueó acceso desde IP: ${clientIp}`);
      return res.status(403).json(ADMIN_DENIED_ERROR);
    }

    const token = extractTokenFromHeader(req);
    if (!token) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    // Consulta en PostgreSQL para validar existencia y rol en tiempo real
    const userRes = await pool.query(
      'SELECT id, username, email, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    const user = userRes.rows[0];
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    req.user = user;
    req.adminUser = user;
    next();
  } catch (err) {
    console.error('❌ [AUTH-ADMIN] Error en requireAdmin:', err.message);
    return res.status(403).json({ error: 'Acceso no autorizado' });
  }
}

// Helper: Clasificación y respuesta limpia de errores de base de datos
function isDatabaseUnavailableError(err) {
  if (!err) return false;
  const unavailableCodes = new Set([
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNRESET',
    'EPIPE',
    '57P01', // admin_shutdown
    '57P02', // crash_shutdown
    '57P03', // cannot_connect_now
    '08000', // connection_exception
    '08003', // connection_does_not_exist
    '08006', // connection_failure
    '08001', // sqlclient_unable_to_establish_sqlconnection
    '08004', // sqlserver_rejected_establishment_of_sqlconnection
    '3D000', // invalid_catalog_name (db does not exist)
    '28P01'  // invalid_password
  ]);
  if (err.code && unavailableCodes.has(err.code)) return true;
  const msg = (err.message || '').toLowerCase();
  return (
    msg.includes('connect econnrefused') ||
    msg.includes('connection terminated') ||
    msg.includes('timeout expired') ||
    msg.includes('the database system is starting up') ||
    msg.includes('no pg_hba.conf entry')
  );
}

function handleDatabaseError(res, err, contextMessage = 'Error interno en el servidor.') {
  if (isDatabaseUnavailableError(err)) {
    return res.status(503).json({
      success: false,
      online: false,
      error: 'El servidor de base de datos PostgreSQL no responde o no está disponible temporalmente.',
      code: err.code || 'DB_UNAVAILABLE',
      details: err.message
    });
  }

  if (err && err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: 'Conflicto de duplicidad en los datos enviados.',
      code: err.code,
      details: err.message
    });
  }

  if (err && (err.code === '55P03' || err.code === '40P01' || err.code === '57014')) {
    return res.status(503).json({
      success: false,
      error: 'La operación excedió el tiempo de espera por concurrencia. Reintente en unos instantes.',
      code: err.code,
      details: err.message
    });
  }

  return res.status(500).json({
    success: false,
    error: contextMessage,
    code: (err && err.code) || 'INTERNAL_ERROR',
    details: err ? err.message : 'Error desconocido'
  });
}

async function safeRollback(client) {
  if (!client) return;
  try {
    await client.query('ROLLBACK');
  } catch (rollbackErr) {
    console.warn('⚠️ [PG-ROLLBACK] No se pudo hacer rollback:', rollbackErr.message);
  }
}

// ========================================================
// ENDPOINTS REST
// ========================================================

// 1. Health & Estado del Backend (/api/health)
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbTimestamp = null;
  let dbOnline = false;

  try {
    const queryPromise = pool.query('SELECT NOW() as now, current_database() as db');
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB health check timeout')), 2000)
    );
    const result = await Promise.race([queryPromise, timeoutPromise]);
    dbStatus = 'connected';
    dbOnline = true;
    dbTimestamp = result.rows[0].now;
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  return res.status(200).json({
    status: 'ok',
    online: true,
    dbConnected: dbOnline,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    postgres: {
      status: dbStatus,
      database: 'english_app_r0ka',
      mode: process.env.RENDER ? 'Render Internal' : 'Render External (Local)',
      serverTime: dbTimestamp
    },
    websocket: {
      connectedClients: wss ? wss.clients.size : 0
    }
  });
});

// 1.1. Control de Versiones de la Aplicación y Actualización Forzada (/api/app/version)
app.get('/api/app/version', (req, res) => {
  const force = req.query.force === 'true';
  return res.status(200).json({
    minRequiredVersion: 1,
    latestVersion: 2,
    forceUpdate: force || false,
    updateUrl: 'https://english-app-frontend-3j9w.onrender.com',
    releaseNotes: 'Optimizaciones de rendimiento, modulos de academia interactivos y soporte de audio.',
    // Campos de compatibilidad adicional para clientes existentes
    minVersion: 1,
    downloadUrl: 'https://english-app-frontend-3j9w.onrender.com',
    message: 'Se requiere actualizar la aplicación para continuar sincronizando con PostgreSQL y Three.js.'
  });
});

// 2. POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  let client = null;
  try {
    const { username, email, password, role } = req.body || {};
    const cleanUser = String(username || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPass = password !== undefined && password !== null ? String(password) : '';

    if (!cleanUser) {
      return res.status(400).json({
        success: false,
        error: 'El nombre de usuario es requerido y no puede estar vacío.'
      });
    }

    if (!cleanPass || !cleanPass.trim()) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña es requerida y no puede estar vacía.'
      });
    }

    // Validación estricta de formato de correo electrónico
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'El correo electrónico debe tener un formato válido (ej. nombre@dominio.com).'
      });
    }

    const userRole =
      role ||
      (cleanUser.toLowerCase() === 'admin' ||
       cleanEmail === 'admin@antigravity.com' ||
       cleanUser.toLowerCase().includes('wilberth') ||
       cleanUser.toLowerCase().includes('molina')
        ? 'admin'
        : 'user');

    client = await pool.connect();
    await client.query('BEGIN');

    // Comprobar existencia por username - Rechazo estricto con código 400
    const existingUser = await client.query('SELECT id FROM users WHERE username = $1', [cleanUser]);
    if (existingUser.rows.length > 0) {
      await safeRollback(client);
      return res.status(400).json({
        success: false,
        error: 'El nombre de usuario ya está registrado.'
      });
    }

    // Comprobar existencia por email - Rechazo estricto con código 400
    const existingEmail = await client.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
    if (existingEmail.rows.length > 0) {
      await safeRollback(client);
      return res.status(400).json({
        success: false,
        error: 'El correo electrónico ya está registrado.'
      });
    }

    // Encriptar contraseña de forma segura con bcryptjs
    const passwordHash = await bcrypt.hash(cleanPass, 10);

    // Insertar usuario
    const userRes = await client.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role, created_at`,
      [cleanUser, cleanEmail, passwordHash, userRole]
    );
    const newUser = userRes.rows[0];

    // Insertar estadísticas iniciales (EXP empieza en 0, nivel 1, Bronce)
    const statsRes = await client.query(
      `INSERT INTO user_stats (user_id, exp, level, rank, streak_days, last_login)
       VALUES ($1, 0, 1, 'Bronce', 1, NOW())
       ON CONFLICT (user_id) DO UPDATE SET last_login = NOW()
       RETURNING exp, level, rank, streak_days, last_login`,
      [newUser.id]
    );
    const stats = statsRes.rows[0];

    // Inicializar módulos de aprendizaje por defecto
    const modulesInit = [];
    for (const modKey of DEFAULT_MODULE_KEYS) {
      const modRes = await client.query(
        `INSERT INTO module_progress (user_id, module_id, current_level, completed_nodes, updated_at)
         VALUES ($1, $2, 1, '[]'::jsonb, NOW())
         ON CONFLICT (user_id, module_id) DO UPDATE SET updated_at = NOW()
         RETURNING module_id, current_level, completed_nodes`,
        [newUser.id, modKey]
      );
      modulesInit.push(modRes.rows[0]);
    }

    await client.query('COMMIT');

    const token = generateToken(newUser, stats);

    broadcastWebSocketMessage({
      type: 'user_registered',
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      timestamp: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente en PostgreSQL.',
      token,
      role: newUser.role,
      exp: stats.exp,
      rank: stats.rank,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        exp: stats.exp,
        level: stats.level,
        rank: stats.rank,
        streak_days: stats.streak_days,
        created_at: newUser.created_at
      },
      stats,
      modules: modulesInit
    });
  } catch (err) {
    await safeRollback(client);
    console.error('❌ [AUTH-REGISTER] Error registrando usuario:', err.message);
    if (err && err.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'El usuario o correo electrónico ya existe en la base de datos.',
        code: err.code
      });
    }
    return handleDatabaseError(res, err, 'Error interno al registrar el usuario.');
  } finally {
    if (client) client.release();
  }
});

// 3. POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, identifier, email, password } = req.body || {};
    const userIdent = String(identifier || username || email || '').trim();
    const rawPass = password !== undefined && password !== null ? String(password) : '';

    // Queda terminantemente prohibido autorizar cadenas vacías
    if (!userIdent || !rawPass || !rawPass.trim()) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas: el usuario/correo y la contraseña son obligatorios y no pueden estar vacíos.'
      });
    }

    // Comprobar obligatoriamente que el usuario o correo exista en la base de datos
    const userRes = await pool.query(
      `SELECT id, username, email, password_hash, role, avatar_url, created_at
       FROM users
       WHERE username = $1 OR (email IS NOT NULL AND LOWER(email) = LOWER($1))`,
      [userIdent]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas: el usuario o correo no está registrado en la base de datos.'
      });
    }

    const user = userRes.rows[0];

    // Seguridad Estricta para Administrador: Validación de IP Whitelist y Dispositivo Maestro
    if (user.role === 'admin') {
      const clientIp = getClientIp(req);
      if (!isAllowedAdminIp(clientIp) || !isValidAdminDevice(req)) {
        console.warn(`🛡️ [ADMIN-SECURITY] Intento de login de administrador bloqueado desde IP: ${clientIp}, deviceKey: ${req.headers && req.headers['x-admin-device-key'] ? 'inválido' : 'ausente'}`);
        return res.status(403).json(ADMIN_DENIED_ERROR);
      }
    }

    if (!user.password_hash) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas.'
      });
    }

    // Comprobar estrictamente la contraseña mediante bcrypt.compare
    const passwordMatch = await bcrypt.compare(rawPass, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas: la contraseña no coincide.'
      });
    }

    // Garantizar y actualizar estadísticas del usuario (exp, level, rank, streak_days, last_login)
    const statsRes = await pool.query(
      `INSERT INTO user_stats (user_id, exp, level, rank, streak_days, last_login)
       VALUES ($1, 0, 1, 'Bronce', 1, NOW())
       ON CONFLICT (user_id) DO UPDATE
       SET last_login = NOW()
       RETURNING exp, level, rank, streak_days, last_login`,
      [user.id]
    );

    const stats = statsRes.rows[0] || {
      exp: 0,
      level: 1,
      rank: 'Bronce',
      streak_days: 1,
      last_login: new Date()
    };

    // Obtener progreso de módulos
    const modulesRes = await pool.query(
      `SELECT module_id, current_level, completed_nodes, updated_at
       FROM module_progress
       WHERE user_id = $1
       ORDER BY module_id ASC`,
      [user.id]
    );

    // Obtener historial TOEFL reciente
    const toeflRes = await pool.query(
      `SELECT id, score, total_questions, exam_type, completed_at
       FROM toefl_history
       WHERE user_id = $1
       ORDER BY completed_at DESC
       LIMIT 10`,
      [user.id]
    );

    // Generar token JWT con datos del usuario y estadísticas
    const token = generateToken(user, stats);

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      token,
      role: user.role,
      exp: stats.exp,
      rank: stats.rank,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        exp: stats.exp,
        level: stats.level,
        rank: stats.rank,
        streak_days: stats.streak_days,
        created_at: user.created_at
      },
      stats,
      modules: modulesRes.rows,
      toeflHistory: toeflRes.rows
    });
  } catch (err) {
    console.error('❌ [AUTH-LOGIN] Error en login:', err.message);
    return handleDatabaseError(res, err, 'Error al procesar el inicio de sesión.');
  }
});

// 3.1. POST /api/auth/google
// Maneja autenticación real con Google Identity Services (GIS)
app.post('/api/auth/google', async (req, res) => {
  let client = null;
  try {
    const { credential, profile } = req.body || {};
    let googleData = profile || {};

    // Si se envió el token JWT de Google, decodificar payload
    if (credential && typeof credential === 'string') {
      try {
        const parts = credential.split('.');
        if (parts.length >= 2) {
          const payloadJson = Buffer.from(
            parts[1].replace(/-/g, '+').replace(/_/g, '/'),
            'base64'
          ).toString('utf8');
          const decoded = JSON.parse(payloadJson);
          googleData = {
            sub: decoded.sub,
            email: decoded.email,
            name: decoded.name || decoded.given_name || 'Google User',
            picture: decoded.picture
          };
        }
      } catch (jwtErr) {
        console.warn('⚠️ [AUTH-GOOGLE] Advertencia decodificando JWT de Google:', jwtErr.message);
      }
    }

    const googleEmail = (googleData.email || '').trim().toLowerCase();
    const googleName = (googleData.name || 'Google User').trim();
    const googleId = googleData.sub || null;
    const avatarUrl = googleData.picture || null;

    if (!googleEmail && !googleName) {
      return res.status(400).json({
        success: false,
        error: 'Datos de Google incompletos o inválidos.'
      });
    }

    client = await pool.connect();
    await client.query('BEGIN');

    // Buscar si ya existe el usuario por google_id, email o username
    const userRes = await client.query(
      `SELECT id, username, email, role, avatar_url, created_at
       FROM users
       WHERE (google_id IS NOT NULL AND google_id = $1)
          OR (email IS NOT NULL AND LOWER(email) = LOWER($2))
          OR username = $3`,
      [googleId, googleEmail || '', googleName]
    );

    let user;
    let isNewUser = false;

    if (userRes.rows.length === 0) {
      isNewUser = true;
      const isAdmin =
        googleName.toLowerCase().includes('wilberth') ||
        googleName.toLowerCase().includes('molina') ||
        googleEmail.includes('wilberth') ||
        googleEmail.includes('molina') ||
        googleEmail === 'admin@antigravity.com' ||
        googleEmail.includes('alessandro');
      const defaultHash = await bcrypt.hash('google-oauth-managed-pass', 10);

      const insertRes = await client.query(
        `INSERT INTO users (username, email, google_id, avatar_url, password_hash, role)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, username, email, role, avatar_url, created_at`,
        [googleName, googleEmail || null, googleId, avatarUrl, defaultHash, isAdmin ? 'admin' : 'user']
      );
      user = insertRes.rows[0];

      // Inicializar estadísticas con 0 EXP
      await client.query(
        `INSERT INTO user_stats (user_id, exp, level, rank, streak_days, last_login)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (user_id) DO NOTHING`,
        [user.id, 0, 1, 'Bronce', 1]
      );

      // Inicializar módulos por defecto
      for (const modKey of DEFAULT_MODULE_KEYS) {
        await client.query(
          `INSERT INTO module_progress (user_id, module_id, current_level, completed_nodes, updated_at)
           VALUES ($1, $2, 1, '[]'::jsonb, NOW())
           ON CONFLICT (user_id, module_id) DO NOTHING`,
          [user.id, modKey]
        );
      }
    } else {
      user = userRes.rows[0];
      await client.query(
        `UPDATE users
         SET google_id = COALESCE(users.google_id, $1),
             email = COALESCE(users.email, $2),
             avatar_url = COALESCE($3, users.avatar_url)
         WHERE id = $4`,
        [googleId, googleEmail || null, avatarUrl, user.id]
      );
      await client.query(
        `INSERT INTO user_stats (user_id, exp, level, rank, streak_days, last_login)
         VALUES ($1, 0, 1, 'Bronce', 1, NOW())
         ON CONFLICT (user_id) DO UPDATE SET last_login = NOW()`,
        [user.id]
      );
    }

    // Seguridad Estricta para Administrador en Google Auth
    if (user.role === 'admin') {
      const clientIp = getClientIp(req);
      if (!isAllowedAdminIp(clientIp) || !isValidAdminDevice(req)) {
        await safeRollback(client);
        console.warn(`🛡️ [ADMIN-SECURITY] Google login de administrador bloqueado desde IP: ${clientIp}`);
        return res.status(403).json(ADMIN_DENIED_ERROR);
      }
    }

    await client.query('COMMIT');

    // Obtener estadísticas y módulos
    const statsRes = await pool.query(
      `SELECT exp, level, rank, streak_days, last_login FROM user_stats WHERE user_id = $1`,
      [user.id]
    );
    const modulesRes = await pool.query(
      `SELECT module_id, current_level, completed_nodes, updated_at FROM module_progress WHERE user_id = $1 ORDER BY module_id ASC`,
      [user.id]
    );

    const stats = statsRes.rows[0] || {
      exp: 0,
      level: 1,
      rank: 'Bronce',
      streak_days: 1,
      last_login: new Date()
    };
    const token = generateToken(user, stats);

    broadcastWebSocketMessage({
      type: 'google_login',
      username: user.username,
      email: user.email,
      role: user.role,
      isNewUser,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: isNewUser
        ? 'Usuario de Google registrado y conectado.'
        : 'Sesión de Google iniciada con éxito.',
      token,
      role: user.role,
      exp: stats.exp,
      rank: stats.rank,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_url: avatarUrl || user.avatar_url,
        exp: stats.exp,
        level: stats.level,
        rank: stats.rank,
        streak_days: stats.streak_days,
        created_at: user.created_at
      },
      stats,
      modules: modulesRes.rows
    });
  } catch (err) {
    await safeRollback(client);
    console.error('❌ [AUTH-GOOGLE] Error en login de Google:', err.message);
    return handleDatabaseError(res, err, 'Error procesando autenticación con Google.');
  } finally {
    if (client) client.release();
  }
});

// 4. POST /api/progress & POST /api/progress/sync
// Actualización periódica de puntos de EXP, nivel y rachas sin bloqueos de concurrencia.
const handleProgressSync = async (req, res) => {
  const body = req.body || {};
  const tokenPayload = verifyToken(extractTokenFromHeader(req));

  const rawUsername = body.username || (tokenPayload && tokenPayload.username) || '';
  const cleanUser = String(rawUsername).trim();
  const explicitUserId = parseInt(body.user_id || (tokenPayload && tokenPayload.id), 10);

  if (!cleanUser && isNaN(explicitUserId)) {
    return res.status(400).json({
      success: false,
      error: 'El nombre de usuario o token de sesión es obligatorio para sincronizar.'
    });
  }

  const {
    exp,
    exp_gained,
    level,
    current_level,
    rank,
    streak_days,
    streak,
    modules,
    module_id,
    completed_nodes,
    toefl_record,
    reason
  } = body;

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let client = null;
    try {
      client = await pool.connect();
      await client.query('BEGIN');
      // Evitar bloqueos prolongados de concurrencia en filas disputadas
      await client.query("SET LOCAL lock_timeout = '3000ms'");
      await client.query("SET LOCAL statement_timeout = '10000ms'");

      // 1. Resolver o crear usuario de manera atómica sin condición de carrera
      let userId = !isNaN(explicitUserId) ? explicitUserId : null;
      let resolvedUsername = cleanUser;

      if (cleanUser) {
        const userCheck = await client.query(
          'SELECT id, username FROM users WHERE username = $1',
          [cleanUser]
        );
        if (userCheck.rows.length > 0) {
          userId = userCheck.rows[0].id;
          resolvedUsername = userCheck.rows[0].username;
        } else {
          const defaultHash = await bcrypt.hash('offline-session-pass', 10);
          const isAdmin =
            cleanUser.toLowerCase().includes('wilberth') ||
            cleanUser.toLowerCase().includes('molina');
          const upsertUserRes = await client.query(
            `INSERT INTO users (username, password_hash, role)
             VALUES ($1, $2, $3)
             ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
             RETURNING id, username`,
            [cleanUser, defaultHash, isAdmin ? 'admin' : 'user']
          );
          userId = upsertUserRes.rows[0].id;
          resolvedUsername = upsertUserRes.rows[0].username;
        }
      } else if (userId) {
        const userById = await client.query('SELECT id, username FROM users WHERE id = $1', [userId]);
        if (userById.rows.length === 0) {
          await safeRollback(client);
          return res.status(404).json({
            success: false,
            error: 'Usuario no encontrado para sincronización.'
          });
        }
        resolvedUsername = userById.rows[0].username;
      }

      // 2. Actualizar user_stats (EXP, nivel, rango, racha) de forma atómica con UPSERT
      const parsedExp = exp !== undefined && exp !== null ? parseInt(exp, 10) : null;
      const parsedExpDelta = exp_gained !== undefined && exp_gained !== null ? parseInt(exp_gained, 10) : 0;
      const parsedLevel =
        level !== undefined || current_level !== undefined
          ? parseInt(level ?? current_level, 10)
          : null;
      const parsedStreak =
        streak_days !== undefined || streak !== undefined
          ? parseInt(streak_days ?? streak, 10)
          : null;

      const initialExp = !isNaN(parsedExp) && parsedExp !== null
        ? Math.max(0, parsedExp)
        : Math.max(0, isNaN(parsedExpDelta) ? 0 : parsedExpDelta);
      const initialLevel = calculateLevel(initialExp, parsedLevel);
      const initialStreak = !isNaN(parsedStreak) && parsedStreak !== null ? Math.max(0, parsedStreak) : 1;
      const initialRank = rank || calculateRank(initialExp);

      const updatedStatsRes = await client.query(
        `INSERT INTO user_stats (user_id, exp, level, rank, streak_days, last_login)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (user_id) DO UPDATE SET
           exp = CASE
             WHEN $6::int IS NOT NULL THEN GREATEST(user_stats.exp, $6::int)
             WHEN $7::int > 0 THEN user_stats.exp + $7::int
             ELSE user_stats.exp
           END,
           level = CASE
             WHEN $8::int IS NOT NULL THEN GREATEST(COALESCE(user_stats.level, 1), $8::int)
             ELSE GREATEST(
               COALESCE(user_stats.level, 1),
               FLOOR(
                 (CASE
                   WHEN $6::int IS NOT NULL THEN GREATEST(user_stats.exp, $6::int)
                   WHEN $7::int > 0 THEN user_stats.exp + $7::int
                   ELSE user_stats.exp
                 END) / 250.0
               )::int + 1
             )
           END,
           streak_days = CASE
             WHEN $9::int IS NOT NULL THEN GREATEST(user_stats.streak_days, $9::int)
             ELSE user_stats.streak_days
           END,
           last_login = NOW()
         RETURNING exp, level, rank, streak_days, last_login`,
        [
          userId,
          initialExp,
          initialLevel,
          initialRank,
          initialStreak,
          !isNaN(parsedExp) && parsedExp !== null ? Math.max(0, parsedExp) : null,
          !isNaN(parsedExpDelta) ? Math.max(0, parsedExpDelta) : 0,
          !isNaN(parsedLevel) && parsedLevel !== null ? Math.max(1, parsedLevel) : null,
          !isNaN(parsedStreak) && parsedStreak !== null ? Math.max(0, parsedStreak) : null
        ]
      );

      let updatedStats = updatedStatsRes.rows[0];
      const computedRank = rank || calculateRank(updatedStats.exp);
      if (updatedStats.rank !== computedRank) {
        const rankRes = await client.query(
          `UPDATE user_stats SET rank = $1 WHERE user_id = $2 RETURNING exp, level, rank, streak_days, last_login`,
          [computedRank, userId]
        );
        if (rankRes.rows.length > 0) {
          updatedStats = rankRes.rows[0];
        }
      }

      // 3. Sincronizar módulos (module_progress) ordenados por module_id para evitar deadlocks
      const modulesToSync = Array.isArray(modules) ? [...modules] : [];
      if (module_id && !modulesToSync.some((m) => m && m.module_id === module_id)) {
        modulesToSync.push({
          module_id,
          current_level: parsedLevel || 1,
          completed_nodes: completed_nodes || []
        });
      }

      modulesToSync.sort((a, b) =>
        String((a && a.module_id) || '').localeCompare(String((b && b.module_id) || ''))
      );

      const syncedModules = [];
      for (const mod of modulesToSync) {
        if (!mod || !mod.module_id) continue;
        const modLevel = Math.max(1, parseInt(mod.current_level ?? mod.level, 10) || 1);
        const nodesJson = JSON.stringify(Array.isArray(mod.completed_nodes) ? mod.completed_nodes : []);

        const modRes = await client.query(
          `INSERT INTO module_progress (user_id, module_id, current_level, completed_nodes, updated_at)
           VALUES ($1, $2, $3, $4::jsonb, NOW())
           ON CONFLICT (user_id, module_id) DO UPDATE SET
             current_level = GREATEST(module_progress.current_level, EXCLUDED.current_level),
             completed_nodes = CASE
               WHEN jsonb_array_length(EXCLUDED.completed_nodes) > 0 THEN EXCLUDED.completed_nodes
               ELSE module_progress.completed_nodes
             END,
             updated_at = NOW()
           RETURNING module_id, current_level, completed_nodes, updated_at`,
          [userId, String(mod.module_id).trim(), modLevel, nodesJson]
        );
        syncedModules.push(modRes.rows[0]);
      }

      // 4. Registrar examen TOEFL si fue enviado
      let toeflSaved = null;
      if (toefl_record && typeof toefl_record.score === 'number') {
        const toeflRes = await client.query(
          `INSERT INTO toefl_history (user_id, score, total_questions, exam_type, completed_at)
           VALUES ($1, $2, $3, $4, NOW())
           RETURNING id, score, total_questions, exam_type, completed_at`,
          [
            userId,
            toefl_record.score,
            toefl_record.total_questions || 10,
            toefl_record.exam_type || 'TOEFL Practice'
          ]
        );
        toeflSaved = toeflRes.rows[0];
      }

      await client.query('COMMIT');

      // 5. Notificar en tiempo real mediante WebSockets
      broadcastWebSocketMessage({
        type: 'progress_synced',
        username: resolvedUsername,
        exp: updatedStats.exp,
        level: updatedStats.level,
        rank: updatedStats.rank,
        streak_days: updatedStats.streak_days,
        reason: reason || 'general_sync',
        syncedModulesCount: syncedModules.length,
        toeflSaved: !!toeflSaved,
        timestamp: new Date().toISOString()
      });

      return res.status(200).json({
        success: true,
        message: 'Progreso sincronizado atómicamente en PostgreSQL con éxito.',
        synced_at: new Date().toISOString(),
        stats: updatedStats,
        modules: syncedModules,
        toefl: toeflSaved
      });
    } catch (err) {
      await safeRollback(client);
      const isTransientConcurrencyError =
        err && (err.code === '40P01' || err.code === '40001' || err.code === '55P03');

      if (isTransientConcurrencyError && attempt < maxAttempts) {
        console.warn(
          `⚠️ [PROGRESS-SYNC] Reintento ${attempt}/${maxAttempts} por concurrencia (${err.code})...`
        );
        await new Promise((r) => setTimeout(r, 50 * attempt));
        continue;
      }

      console.error('❌ [PROGRESS-SYNC] Error en la sincronización:', err.message);
      return handleDatabaseError(res, err, 'Error durante la sincronización de progreso.');
    } finally {
      if (client) client.release();
    }
  }
};

app.post('/api/progress', handleProgressSync);
app.post('/api/progress/sync', handleProgressSync);

// GET /api/progress
// Consulta del progreso del usuario autenticado o especificado por query
app.get('/api/progress', async (req, res) => {
  try {
    const tokenPayload = verifyToken(extractTokenFromHeader(req));
    const rawUsername = req.query.username || (tokenPayload && tokenPayload.username) || '';
    const cleanUser = String(rawUsername).trim();
    const explicitUserId = parseInt(req.query.user_id || (tokenPayload && tokenPayload.id), 10);

    if (!cleanUser && isNaN(explicitUserId)) {
      return res.status(401).json({
        success: false,
        error: 'Token de autorización o nombre de usuario requerido para consultar el progreso.'
      });
    }

    let userRes;
    if (cleanUser) {
      userRes = await pool.query(
        `SELECT id, username, email, role, avatar_url, created_at
         FROM users
         WHERE username = $1`,
        [cleanUser]
      );
    } else {
      userRes = await pool.query(
        `SELECT id, username, email, role, avatar_url, created_at
         FROM users
         WHERE id = $1`,
        [explicitUserId]
      );
    }

    if (userRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado en la base de datos.'
      });
    }

    const user = userRes.rows[0];

    const statsRes = await pool.query(
      `SELECT exp, level, rank, streak_days, last_login
       FROM user_stats
       WHERE user_id = $1`,
      [user.id]
    );

    const modulesRes = await pool.query(
      `SELECT module_id, current_level, completed_nodes, updated_at
       FROM module_progress
       WHERE user_id = $1
       ORDER BY module_id ASC`,
      [user.id]
    );

    const toeflRes = await pool.query(
      `SELECT id, score, total_questions, exam_type, completed_at
       FROM toefl_history
       WHERE user_id = $1
       ORDER BY completed_at DESC
       LIMIT 10`,
      [user.id]
    );

    return res.status(200).json({
      success: true,
      user,
      stats: statsRes.rows[0] || { exp: 0, level: 1, rank: 'Bronce', streak_days: 1 },
      modules: modulesRes.rows,
      toefl: toeflRes.rows
    });
  } catch (err) {
    console.error('❌ [PROGRESS-GET] Error consultando progreso:', err.message);
    return handleDatabaseError(res, err, 'Error al consultar el progreso del usuario.');
  }
});

// 5. GET /api/user/profile/:username
app.get('/api/user/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'El nombre de usuario es requerido.'
      });
    }

    const cleanUser = username.trim();

    const userRes = await pool.query(
      `SELECT id, username, email, role, avatar_url, created_at
       FROM users
       WHERE username = $1`,
      [cleanUser]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado en la base de datos.'
      });
    }

    const user = userRes.rows[0];

    const statsRes = await pool.query(
      `SELECT exp, level, rank, streak_days, last_login
       FROM user_stats
       WHERE user_id = $1`,
      [user.id]
    );

    const modulesRes = await pool.query(
      `SELECT module_id, current_level, completed_nodes, updated_at
       FROM module_progress
       WHERE user_id = $1
       ORDER BY module_id ASC`,
      [user.id]
    );

    const toeflRes = await pool.query(
      `SELECT id, score, total_questions, exam_type, completed_at
       FROM toefl_history
       WHERE user_id = $1
       ORDER BY completed_at DESC
       LIMIT 20`,
      [user.id]
    );

    return res.status(200).json({
      success: true,
      user,
      stats: statsRes.rows[0] || { exp: 0, level: 1, rank: 'Bronce', streak_days: 0 },
      modules: modulesRes.rows,
      toeflHistory: toeflRes.rows
    });
  } catch (err) {
    console.error('❌ [GET-PROFILE] Error al consultar perfil:', err.message);
    return handleDatabaseError(res, err, 'Error al consultar perfil del usuario.');
  }
});



// ========================================================
// SERVICIO DE MÚSICA & LETRAS SINCRONIZADAS (YOUTUBE / LRCLIB)
// ========================================================
const lyricsCache = new Map();

// Helper: Generador de estrofas contextuales con intervalos si no hay letra oficial
function generateContextualStanzas(title, artist) {
  const songName = (title || 'Canción en Inglés').trim();
  const songArtist = (artist || 'Artista').trim();

  return [
    {
      time: 6,
      text: `Now listening to "${songName}" by ${songArtist}`,
      es: `Ahora escuchando "${songName}" de ${songArtist}`
    },
    {
      time: 14,
      text: 'Feel the rhythm and tune your ear to the English flow',
      es: 'Siente el ritmo y afina tu oído a la fluidez del inglés'
    },
    {
      time: 22,
      text: 'Every lyric carries meaningful vocabulary and expressions',
      es: 'Cada verso lleva vocabulario y expresiones significativas'
    },
    {
      time: 30,
      text: 'Listen carefully to how native words connect with each other',
      es: 'Escucha con atención cómo las palabras nativas se conectan entre sí'
    },
    {
      time: 38,
      text: 'Sing along to train your natural pronunciation and accent',
      es: 'Canta para entrenar tu pronunciación natural y tu acento'
    },
    {
      time: 46,
      text: 'Music makes language learning intuitive and enjoyable',
      es: 'La música hace que el aprendizaje del idioma sea intuitivo y placentero'
    },
    {
      time: 54,
      text: 'Notice the melody and repeat key phrases in your mind',
      es: 'Presta atención a la melodía y repite las frases clave en tu mente'
    },
    {
      time: 64,
      text: 'Great job practicing your listening skills through music',
      es: 'Gran trabajo practicando tus habilidades de comprensión a través de la música'
    }
  ];
}

// Helper: Limpieza de títulos de YouTube para búsqueda de letras
function cleanMusicTitle(rawTitle) {
  if (!rawTitle || typeof rawTitle !== 'string') return '';
  return rawTitle
    .replace(
      /\s*[\(\[]\s*(official\s*(music)?\s*video|lyric\s*video|official\s*audio|visualizer|audio|4k|hd|remastered|video\s*clip|clip\s*officiel)\s*[\)\]]/gi,
      ''
    )
    .replace(/\s*[\(\[]\s*(feat\.|ft\.)[^\)\]]+[\)\]]/gi, '')
    .replace(/\s+-\s+Topic$/i, '')
    .trim();
}

// Helper: Traducción en lote de textos al español
async function translateLyricsBatch(lines, targetLang = 'es') {
  if (!Array.isArray(lines) || lines.length === 0) return [];
  const results = new Array(lines.length).fill('');
  const batchSize = 25;

  for (let i = 0; i < lines.length; i += batchSize) {
    const chunk = lines.slice(i, i + batchSize);
    const joined = chunk.map((c) => c.replace(/\n/g, ' ')).join('\n');
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        joined
      )}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const json = await resp.json();
        const translatedJoined = (json[0] || []).map((item) => item[0]).join('');
        const translatedLines = translatedJoined.split('\n');
        for (let j = 0; j < chunk.length; j++) {
          results[i + j] = (translatedLines[j] || '').trim();
        }
      }
    } catch (e) {
      for (let j = 0; j < chunk.length; j++) {
        if (!results[i + j]) {
          results[i + j] = chunk[j];
        }
      }
    }
  }

  return results;
}

// Helper: Parseo de letras sincronizadas en formato LRC [mm:ss.xx]
function parseLrcLyrics(lrcText) {
  if (!lrcText || typeof lrcText !== 'string') return [];
  const lines = lrcText.split('\n');
  const parsed = [];
  const lrcRegex = /^\[(\d{1,2}):(\d{2}(?:\.\d{1,3})?)\](.*)$/;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = line.match(lrcRegex);
    if (match) {
      const minutes = parseFloat(match[1]);
      const seconds = parseFloat(match[2]);
      const text = match[3].trim();
      if (text && !text.startsWith('[') && !text.endsWith(']')) {
        const totalSeconds = Math.round(minutes * 60 + seconds);
        parsed.push({ time: totalSeconds, text });
      }
    }
  }

  return parsed;
}

// 6. GET /api/music/search?q=termino
// Proxy de búsqueda de música hacia iTunes Search API con respaldo CORS y normalización
app.get('/api/music/search', async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) {
      return res.status(200).json([]);
    }

    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`;
    const response = await fetch(itunesUrl, {
      signal: AbortSignal.timeout(6000),
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      console.warn(`⚠️ [MUSIC-SEARCH] iTunes Search API respondió con status ${response.status}`);
      return res.status(200).json([]);
    }

    const data = await response.json();
    const items = Array.isArray(data.results) ? data.results : [];

    // Normaliza y mapea la respuesta para que el frontend y el móvil reciban:
    // [{ id: trackId, title: trackName, artist: artistName, previewUrl, artwork: artworkUrl100 }]
    const formattedList = items.map((item) => {
      const durationSec = Math.round((item.trackTimeMillis || 30000) / 1000);
      const durationStr = `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, '0')}`;
      const trackId = item.trackId ? String(item.trackId) : (item.id ? String(item.id) : '');
      const trackTitle = item.trackName || item.title || 'Untitled Track';
      const artistName = item.artistName || item.artist || 'Unknown Artist';
      const preview = item.previewUrl || '';
      const art = item.artworkUrl100 || item.artworkUrl60 || item.artwork || '';

      return {
        id: trackId,
        title: trackTitle,
        artist: artistName,
        previewUrl: preview,
        artwork: art,
        // Compatibilidad adicional para clientes existentes
        trackName: trackTitle,
        artistName: artistName,
        artworkUrl100: art,
        thumbnail: art,
        duration: durationStr
      };
    });

    return res.status(200).json(formattedList);
  } catch (err) {
    console.error('❌ [MUSIC-SEARCH] Error o fallo de red consultando iTunes Search API:', err.message);
    // En caso de fallos de red o términos sin coincidencias responde con array vacío y status 200
    return res.status(200).json([]);
  }
});

// 7. GET /api/music/lyrics?id=&title=&artist=
app.get('/api/music/lyrics', async (req, res) => {
  try {
    const rawId = String(req.query.id || '').trim();
    let rawTitle = String(req.query.title || '').trim();
    let rawArtist = String(req.query.artist || '').trim();

    // Si solo viene el ID o el título está vacío, consultar detalles con ytSearch
    if ((!rawTitle || !rawArtist) && rawId && ytSearch) {
      try {
        const videoInfo = await ytSearch({ videoId: rawId });
        if (videoInfo) {
          if (!rawTitle) rawTitle = videoInfo.title || '';
          if (!rawArtist && videoInfo.author) rawArtist = videoInfo.author.name || '';
        }
      } catch (_) {}
    }

    const cacheKey = `${rawId}::${rawTitle}::${rawArtist}`.toLowerCase();
    if (lyricsCache.has(cacheKey)) {
      return res.status(200).json(lyricsCache.get(cacheKey));
    }

    let trackName = rawTitle;
    let artistName = rawArtist;

    // Normalizar si el título contiene "Artista - Canción"
    const cleanedTitle = cleanMusicTitle(rawTitle);
    if (cleanedTitle.includes(' - ')) {
      const parts = cleanedTitle.split(' - ');
      if (!artistName || artistName.toLowerCase().includes('topic')) {
        artistName = parts[0].trim();
      }
      trackName = parts.slice(1).join(' - ').trim();
    } else if (cleanedTitle) {
      trackName = cleanedTitle;
    }

    let syncedFound = null;
    let plainFound = null;

    // 1. Intentar consulta directa a LRCLIB por track_name y artist_name
    if (trackName) {
      try {
        const queryParams = new URLSearchParams();
        queryParams.set('track_name', trackName);
        if (artistName && !artistName.toLowerCase().includes('topic')) {
          queryParams.set('artist_name', artistName);
        }

        const lrcResp = await fetch(`https://lrclib.net/api/get?${queryParams.toString()}`, {
          signal: AbortSignal.timeout(3500)
        });

        if (lrcResp.ok) {
          const lrcData = await lrcResp.json();
          if (lrcData.syncedLyrics) syncedFound = lrcData.syncedLyrics;
          if (lrcData.plainLyrics) plainFound = lrcData.plainLyrics;
        }
      } catch (_) {}
    }

    // 2. Si no se encontró sincronizada, intentar búsqueda general en LRCLIB
    if (!syncedFound && (trackName || artistName)) {
      try {
        const searchQuery = `${artistName || ''} ${trackName || ''}`.trim();
        const searchResp = await fetch(
          `https://lrclib.net/api/search?q=${encodeURIComponent(searchQuery)}`,
          { signal: AbortSignal.timeout(3500) }
        );

        if (searchResp.ok) {
          const searchData = await searchResp.json();
          if (Array.isArray(searchData) && searchData.length > 0) {
            const withSynced = searchData.find((item) => item.syncedLyrics);
            if (withSynced) {
              syncedFound = withSynced.syncedLyrics;
            } else if (searchData[0].plainLyrics) {
              plainFound = searchData[0].plainLyrics;
            }
          }
        }
      } catch (_) {}
    }

    let structuredLyrics = [];

    // 3. Estructurar letras encontradas con sincronización oficial
    if (syncedFound) {
      const parsedLrc = parseLrcLyrics(syncedFound);
      if (parsedLrc.length > 0) {
        const englishTexts = parsedLrc.map((p) => p.text);
        const spanishTexts = await translateLyricsBatch(englishTexts, 'es');
        structuredLyrics = parsedLrc.map((item, idx) => ({
          time: item.time,
          text: item.text,
          es: spanishTexts[idx] || item.text
        }));
      }
    }

    // 4. Si solo hay letra plana, estructurar por intervalos
    if (structuredLyrics.length === 0 && plainFound) {
      const plainLines = plainFound
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith('[') && !l.endsWith(']'));

      if (plainLines.length > 0) {
        const spanishTexts = await translateLyricsBatch(plainLines, 'es');
        let currentTime = 8;
        structuredLyrics = plainLines.map((line, idx) => {
          const item = {
            time: currentTime,
            text: line,
            es: spanishTexts[idx] || line
          };
          currentTime += Math.max(4, Math.min(8, Math.round(line.split(' ').length * 0.8)));
          return item;
        });
      }
    }

    // 5. Si no se encuentra letra oficial para canciones personalizadas externas:
    // Generar extractor contextual con estrofas estructuradas por intervalos y traducción al español
    if (structuredLyrics.length === 0) {
      structuredLyrics = generateContextualStanzas(trackName || rawTitle, artistName || rawArtist);
    }

    // Guardar en caché LRU básica
    if (lyricsCache.size > 300) {
      const firstKey = lyricsCache.keys().next().value;
      lyricsCache.delete(firstKey);
    }
    lyricsCache.set(cacheKey, structuredLyrics);

    return res.status(200).json(structuredLyrics);
  } catch (err) {
    console.error('❌ [MUSIC-LYRICS] Error procesando letras:', err.message);
    // En caso de cualquier error imprevisto, devolver set contextual válido sin tirar el proceso
    const fallbackStanzas = generateContextualStanzas(req.query.title, req.query.artist);
    return res.status(200).json(fallbackStanzas);
  }
});
// ========================================================
// ========================================================
// PORTAL 04: TUTOR IA CONVERSACIONAL (/api/ai-tutor)
// ========================================================
app.post('/api/ai-tutor', async (req, res) => {
  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    const systemPrompt = `You are a friendly, native English tutor for students learning English.
Strict rules you must follow:
1. Act as a friendly and native English tutor for students.
2. ALWAYS and ONLY respond in English. If the user speaks to you in Spanish or any other language, or makes grammatical mistakes, gently correct them in English and encourage them to keep practicing.
3. If the user asks you to solve math homework, write computer code, discuss politics, or asks questions unrelated to learning English, politely decline the request by stating that you are an exclusive English language tutor and steer the conversation back to practicing English.`;

    if (apiKey) {
      try {
        const contents = [];
        if (Array.isArray(history)) {
          history.slice(-8).forEach(h => {
            if (h && h.text) {
              contents.push({
                role: h.role === 'model' ? 'model' : 'user',
                parts: [{ text: String(h.text) }]
              });
            }
          });
        }
        contents.push({
          role: 'user',
          parts: [{ text: message.trim() }]
        });

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents
            })
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return res.json({ reply: reply.trim() });
          }
        } else {
          console.warn('⚠️ [AI-TUTOR] Gemini API respondió con status:', geminiRes.status);
        }
      } catch (geminiErr) {
        console.warn('⚠️ [AI-TUTOR] Error llamando a Gemini API:', geminiErr.message);
      }
    }

    // Fallback inteligente en servidor si la API externa no está disponible
    const cleanMsg = message.trim().toLowerCase();
    let fallbackReply = '';
    if (cleanMsg.includes('hola') || cleanMsg.includes('buenos') || cleanMsg.includes('buenas')) {
      fallbackReply = "Hello there! 👋 Great to meet you! Remember to practice greeting in English, like: 'Hello, how are you today?' How is your English study going?";
    } else if (cleanMsg.includes('suma') || cleanMsg.includes('resta') || cleanMsg.includes('multiplica') || cleanMsg.includes('codigo') || cleanMsg.includes('program') || cleanMsg.includes('politica')) {
      fallbackReply = "I am exclusively your English language tutor, so I cannot help with math, programming code, or politics. But I would love to help you practice English! What English topics would you like to explore today?";
    } else {
      fallbackReply = `That is very interesting! In English, we could express that clearly as: "${message.trim()}". Keep practicing every day, you are making wonderful progress! What else would you like to talk about?`;
    }
    return res.json({ reply: fallbackReply });
  } catch (err) {
    console.error('❌ [AI-TUTOR] Error:', err.message);
    res.status(500).json({ error: 'Internal AI Tutor error' });
  }
});

// ========================================================
// SISTEMA DE COMENTARIOS ANTI-SPAM (/api/feedback)
// ========================================================
app.post('/api/feedback', async (req, res) => {
  try {
    const { email, username, text } = req.body || {};
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'El contenido del comentario es obligatorio.' });
    }

    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length > 100) {
      return res.status(400).json({ error: 'El comentario supera el límite de 100 palabras permitidas.' });
    }

    const userEmail = (email || '').trim().toLowerCase();
    const uname = (username || '').trim() || 'Estudiante MasterENG';

    let client;
    try {
      client = await pool.connect();
      // Validar límite diario de 5 comentarios
      const checkRes = await client.query(
        `SELECT COUNT(*) as count FROM feedbacks WHERE (user_email = $1 OR username = $2) AND created_at >= CURRENT_DATE`,
        [userEmail, uname]
      );
      const todayCount = parseInt(checkRes.rows[0]?.count || 0, 10);
      if (todayCount >= 5) {
        client.release();
        return res.status(429).json({
          error: 'Has alcanzado el límite diario de 5 comentarios. ¡Gracias por tu participación, vuelve mañana!'
        });
      }

      await client.query(
        `INSERT INTO feedbacks (user_email, username, feedback_text) VALUES ($1, $2, $3)`,
        [userEmail, uname, text.trim()]
      );
      client.release();
      return res.json({
        success: true,
        message: '¡Gracias! Tu comentario ha sido guardado exitosamente en la base de datos.',
        dailyCount: todayCount + 1
      });
    } catch (dbErr) {
      if (client) client.release();
      console.warn('⚠️ [FEEDBACK-DB] Fallback por error de BD:', dbErr.message);
      return res.json({
        success: true,
        message: '¡Gracias! Tu comentario ha sido recibido y registrado.',
        dailyCount: 1
      });
    }
  } catch (err) {
    console.error('❌ [FEEDBACK] Error:', err.message);
    res.status(500).json({ error: 'Error al procesar el comentario.' });
  }
});

// MÓDULO DE ADMINISTRACIÓN (/api/admin)
// ========================================================
app.use('/api/admin', adminIpWhitelist);

// 1. GET /api/admin/users: Lista todos los usuarios con estadísticas consolidadas
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.created_at,
        COALESCE(s.exp, 0)::int AS exp,
        COALESCE(s.rank, 'Bronce') AS rank,
        COALESCE(s.streak_days, 1)::int AS streak_days
      FROM users u
      LEFT JOIN user_stats s ON u.id = s.user_id
      ORDER BY u.id ASC
    `;
    const result = await pool.query(query);

    if (req.query.format === 'object' || req.query.wrap === 'true') {
      return res.status(200).json({
        success: true,
        users: result.rows,
        total: result.rows.length
      });
    }

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ [ADMIN-USERS] Error obteniendo usuarios:', err.message);
    return handleDatabaseError(res, err, 'Error al obtener la lista de usuarios.');
  }
});

// 2. DELETE /api/admin/users/:id: Eliminación en cascada con protecciones estrictas
app.delete('/api/admin/users/:id', requireAdmin, async (req, res) => {
  let client = null;
  try {
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId)) {
      return res.status(400).json({ success: false, error: 'ID de usuario inválido.' });
    }

    // Protección contra auto-eliminación
    if (req.adminUser && req.adminUser.id === targetId) {
      return res.status(400).json({
        success: false,
        error: 'Acción no permitida: no puedes auto-eliminar tu propia cuenta de administrador.'
      });
    }

    client = await pool.connect();
    await client.query('BEGIN');

    // Verificar existencia del usuario
    const checkUser = await client.query(
      'SELECT id, username, email, role FROM users WHERE id = $1',
      [targetId]
    );

    if (checkUser.rows.length === 0) {
      await safeRollback(client);
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado.'
      });
    }

    const targetUser = checkUser.rows[0];

    // Protección contra eliminación del admin principal
    if (
      targetUser.username.toLowerCase() === 'admin' ||
      (targetUser.email && targetUser.email.toLowerCase() === 'admin@antigravity.com')
    ) {
      await safeRollback(client);
      return res.status(403).json({
        success: false,
        error: 'Acción protegida: no se puede eliminar al administrador principal del sistema.'
      });
    }

    // Eliminación en cascada
    await client.query('DELETE FROM toefl_history WHERE user_id = $1', [targetId]);
    await client.query('DELETE FROM module_progress WHERE user_id = $1', [targetId]);
    await client.query('DELETE FROM user_stats WHERE user_id = $1', [targetId]);
    await client.query('DELETE FROM users WHERE id = $1', [targetId]);

    await client.query('COMMIT');

    broadcastWebSocketMessage({
      type: 'user_deleted',
      userId: targetId,
      username: targetUser.username,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: `Usuario '${targetUser.username}' (ID: ${targetId}) eliminado en cascada exitosamente.`,
      deletedUser: {
        id: targetUser.id,
        username: targetUser.username,
        email: targetUser.email
      }
    });
  } catch (err) {
    await safeRollback(client);
    console.error('❌ [ADMIN-DELETE] Error eliminando usuario:', err.message);
    return handleDatabaseError(res, err, 'Error al eliminar el usuario.');
  } finally {
    if (client) client.release();
  }
});

// 3. PATCH /api/admin/users/:id/role: Ascenso o degradación de roles ('admin' / 'user')
app.patch('/api/admin/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId)) {
      return res.status(400).json({ success: false, error: 'ID de usuario inválido.' });
    }

    const { role } = req.body || {};
    const cleanRole = String(role || '').trim().toLowerCase();

    if (cleanRole !== 'admin' && cleanRole !== 'user') {
      return res.status(400).json({
        success: false,
        error: 'Rol inválido. Los roles permitidos son: admin, user.'
      });
    }

    // Verificar si el usuario existe
    const checkUser = await pool.query(
      'SELECT id, username, email, role FROM users WHERE id = $1',
      [targetId]
    );

    if (checkUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado.'
      });
    }

    const targetUser = checkUser.rows[0];

    // Protección: no degradar al administrador principal
    if (
      cleanRole !== 'admin' &&
      (targetUser.username.toLowerCase() === 'admin' ||
       (targetUser.email && targetUser.email.toLowerCase() === 'admin@antigravity.com'))
    ) {
      return res.status(403).json({
        success: false,
        error: 'Acción protegida: no se puede degradar al administrador principal del sistema.'
      });
    }

    const updateRes = await pool.query(
      `UPDATE users
       SET role = $1
       WHERE id = $2
       RETURNING id, username, email, role, created_at`,
      [cleanRole, targetId]
    );

    const updatedUser = updateRes.rows[0];

    broadcastWebSocketMessage({
      type: 'user_role_updated',
      userId: updatedUser.id,
      username: updatedUser.username,
      newRole: updatedUser.role,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: `Rol del usuario '${updatedUser.username}' actualizado a '${updatedUser.role}' exitosamente.`,
      user: updatedUser
    });
  } catch (err) {
    console.error('❌ [ADMIN-ROLE] Error actualizando rol:', err.message);
    return handleDatabaseError(res, err, 'Error al actualizar el rol del usuario.');
  }
});

// 4. GET /api/admin/stats: Métricas globales del sistema
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const statsQuery = `
      SELECT
        (SELECT COUNT(*)::int FROM users) AS total_users,
        (SELECT COUNT(DISTINCT user_id)::int FROM user_stats WHERE last_login >= CURRENT_DATE) AS active_today,
        (SELECT COALESCE(ROUND(AVG(exp)::numeric, 1), 0)::float FROM user_stats) AS avg_exp
    `;
    const result = await pool.query(statsQuery);
    const row = result.rows[0] || { total_users: 0, active_today: 0, avg_exp: 0 };

    return res.status(200).json({
      success: true,
      totalUsers: row.total_users,
      activeUsersToday: row.active_today,
      averageExp: row.avg_exp,
      // Compatibilidad con formato snake_case
      total_users: row.total_users,
      active_today: row.active_today,
      avg_exp: row.avg_exp
    });
  } catch (err) {
    console.error('❌ [ADMIN-STATS] Error consultando métricas globales:', err.message);
    return handleDatabaseError(res, err, 'Error al consultar estadísticas de administración.');
  }
});

// Middleware 404 JSON para rutas /api/* no existentes
app.use('/api', (req, res) => {
  return res.status(404).json({
    success: false,
    error: `Endpoint no encontrado: ${req.method} ${req.originalUrl}`
  });
});

// Middleware global de manejo de errores Express (JSON malformado, errores inesperados)
app.use((err, req, res, next) => {
  console.error('❌ [EXPRESS-ERROR] Error capturado por middleware global:', err.message);
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'El cuerpo de la petición contiene JSON inválido.',
      details: err.message
    });
  }
  return res.status(err.status || 500).json({
    success: false,
    error: 'Error interno del servidor.',
    details: err.message
  });
});

// ========================================================
// SERVIDOR HTTP & WEBSOCKETS EN TIEMPO REAL
// ========================================================
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function broadcastWebSocketMessage(data, senderWs = null) {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      try {
        client.send(payload);
      } catch (e) {
        console.error('Error enviando a cliente WebSocket:', e.message);
      }
    }
  });
}

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`🔌 [WS] Nueva conexión WebSocket desde ${clientIp}. Total clientes: ${wss.clients.size}`);

  // Enviar mensaje de bienvenida
  try {
    ws.send(
      JSON.stringify({
        type: 'connected',
        message: 'Conectado al servidor WebSocket en tiempo real de English App.',
        serverTime: new Date().toISOString()
      })
    );
  } catch (_) {}

  ws.on('message', async (rawMessage) => {
    try {
      const data = JSON.parse(rawMessage.toString());
      console.log(`📩 [WS] Mensaje recibido [${data.type}]:`, data);

      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;

        case 'level_up': {
          const { username, module_id, new_level, exp_gained } = data;
          if (username) {
            try {
              const uRes = await pool.query('SELECT id FROM users WHERE username = $1', [username.trim()]);
              if (uRes.rows.length > 0) {
                const uId = uRes.rows[0].id;
                if (exp_gained) {
                  await pool.query(
                    `UPDATE user_stats
                     SET exp = exp + $1,
                         level = GREATEST(COALESCE(level, 1), FLOOR((exp + $1) / 250.0)::int + 1),
                         rank = $2,
                         last_login = NOW()
                     WHERE user_id = $3`,
                    [exp_gained, calculateRank(exp_gained), uId]
                  );
                }
                if (module_id && new_level) {
                  await pool.query(
                    `INSERT INTO module_progress (user_id, module_id, current_level, updated_at)
                     VALUES ($1, $2, $3, NOW())
                     ON CONFLICT (user_id, module_id) DO UPDATE
                     SET current_level = GREATEST(module_progress.current_level, EXCLUDED.current_level),
                         updated_at = NOW()`,
                    [uId, module_id, new_level]
                  );
                }
              }
            } catch (dbErr) {
              console.error('❌ [WS:level_up] Error actualizando BD:', dbErr.message);
            }
          }

          broadcastWebSocketMessage({
            type: 'user_level_up',
            username: data.username,
            module_id: data.module_id,
            new_level: data.new_level,
            exp_gained: data.exp_gained,
            timestamp: new Date().toISOString()
          });
          break;
        }

        case 'exp_gained': {
          const { username, exp_gained, total_exp, reason } = data;
          if (username && (exp_gained || total_exp !== undefined)) {
            try {
              const uRes = await pool.query('SELECT id FROM users WHERE username = $1', [username.trim()]);
              if (uRes.rows.length > 0) {
                const uId = uRes.rows[0].id;
                const newExpVal = total_exp !== undefined ? parseInt(total_exp, 10) : null;
                if (newExpVal !== null && !isNaN(newExpVal)) {
                  await pool.query(
                    `UPDATE user_stats
                     SET exp = $1,
                         level = GREATEST(COALESCE(level, 1), FLOOR($1 / 250.0)::int + 1),
                         rank = $2,
                         last_login = NOW()
                     WHERE user_id = $3`,
                    [newExpVal, calculateRank(newExpVal), uId]
                  );
                } else if (exp_gained) {
                  await pool.query(
                    `UPDATE user_stats
                     SET exp = exp + $1,
                         level = GREATEST(COALESCE(level, 1), FLOOR((exp + $1) / 250.0)::int + 1),
                         last_login = NOW()
                     WHERE user_id = $2`,
                    [exp_gained, uId]
                  );
                }
              }
            } catch (dbErr) {
              console.error('❌ [WS:exp_gained] Error actualizando BD:', dbErr.message);
            }
          }

          broadcastWebSocketMessage({
            type: 'user_exp_updated',
            username: data.username,
            exp_gained: data.exp_gained,
            total_exp: data.total_exp,
            reason: reason || 'gameplay',
            timestamp: new Date().toISOString()
          });
          break;
        }

        default:
          console.log(`ℹ️ [WS] Tipo no manejado: ${data.type}`);
          break;
      }
    } catch (e) {
      console.error('❌ [WS] Error procesando mensaje WebSocket:', e.message);
    }
  });

  ws.on('close', () => {
    console.log(`🔌 [WS] Cliente desconectado. Clientes restantes: ${wss.clients.size}`);
  });

  ws.on('error', (err) => {
    console.error('❌ [WS] Error en socket del cliente:', err.message);
  });
});

// Iniciar servidor tras inicializar la base de datos
async function startServer() {
  try {
    console.log('🚀 [STARTUP] Inicializando base de datos PostgreSQL...');
    await initializeDatabase();
  } catch (err) {
    console.warn(
      '⚠️ [STARTUP] Advertencia al inicializar la base de datos (se continuará levantando el servidor en modo resiliente):',
      err.message
    );
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log('====================================================');
    console.log(`🚀 [BACKEND] Servidor Express + WebSocket ACTIVO`);
    console.log(`📡 [HTTP] http://localhost:${PORT}`);
    console.log(`📡 [HTTP-LAN] http://0.0.0.0:${PORT} (Accesible desde red local)`);
    console.log(`⚡ [WS] ws://localhost:${PORT}`);
    console.log(`🐘 [PG] Pool configurado hacia PostgreSQL Render (${process.env.RENDER ? 'Internal' : 'External'})`);
    console.log('====================================================');
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, server, pool };

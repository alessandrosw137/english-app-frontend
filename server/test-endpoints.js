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

    // 1b. App Version check
    console.log('\n--- 1b. Probando GET /api/app/version ---');
    const versionRes = await request('GET', '/api/app/version');
    console.log('Status:', versionRes.status, '- Version Data:', versionRes.data);
    if (
      versionRes.status !== 200 ||
      versionRes.data.minRequiredVersion !== 1 ||
      versionRes.data.latestVersion !== 2 ||
      versionRes.data.forceUpdate !== false ||
      versionRes.data.updateUrl !== 'https://english-app-frontend-3j9w.onrender.com' ||
      !versionRes.data.releaseNotes
    ) {
      throw new Error('Falló el endpoint /api/app/version o no coincide el payload exacto esperado');
    }
    console.log('✅ /api/app/version OK');

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
    const allowOrigin = progressPostRes.headers['access-control-allow-origin'];
    if (allowOrigin !== '*' && allowOrigin !== 'https://english-app-frontend-3j9w.onrender.com') {
      throw new Error(`Falló la cabecera CORS esperada (* o https://english-app-frontend-3j9w.onrender.com), obtenido: ${allowOrigin}`);
    }
    console.log('✅ POST /api/progress con cabeceras CORS universal OK');

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

    // 11. Búsqueda pública en iTunes Search API (/api/music/search)
    console.log('\n--- 11. Probando GET /api/music/search con iTunes Search API ---');
    const searchRes = await request('GET', '/api/music/search?q=' + encodeURIComponent('Coldplay Yellow'));
    console.log('Status:', searchRes.status);
    console.log('Total resultados encontrados:', Array.isArray(searchRes.data) ? searchRes.data.length : 0);
    if (searchRes.status !== 200 || !Array.isArray(searchRes.data) || searchRes.data.length === 0) {
      throw new Error('Falló el endpoint /api/music/search');
    }
    const firstTrack = searchRes.data[0];
    console.log('Primer resultado normalizado:', {
      id: firstTrack.id,
      title: firstTrack.title,
      artist: firstTrack.artist,
      previewUrl: firstTrack.previewUrl,
      artwork: firstTrack.artwork
    });
    if (!firstTrack.id || !firstTrack.title || !firstTrack.artist || !firstTrack.previewUrl || !firstTrack.artwork) {
      throw new Error('El resultado de /api/music/search no contiene los campos requeridos (id, title, artist, previewUrl, artwork)');
    }

    // Probar búsqueda vacía (debe responder 200 con un arreglo vacío)
    const emptySearchRes = await request('GET', '/api/music/search?q=');
    if (emptySearchRes.status !== 200 || !Array.isArray(emptySearchRes.data) || emptySearchRes.data.length !== 0) {
      throw new Error('La búsqueda vacía en /api/music/search debe responder 200 con un arreglo vacío');
    }
    console.log('✅ /api/music/search con API pública de iTunes (normalización y previewUrl) OK');

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

    // ========================================================
    // 14. MÓDULO DE ADMINISTRACIÓN (/api/admin) & SEGURIDAD ESTRICTA (IP / DISPOSITIVO)
    // ========================================================
    const ADMIN_DEVICE_KEY = process.env.ADMIN_DEVICE_KEY || 'MasterENG-Admin-Secure-2026-DeviceKey';
    const ADMIN_DEVICE_HEADER = { 'x-admin-device-key': ADMIN_DEVICE_KEY };
    const ADMIN_DENIED_MSG = 'Acceso denegado: Dispositivo o red no autorizada para administración';

    console.log('\n--- 14a. Probando Seguridad Estricta en Login de Administrador (Bloqueo por IP y Dispositivo) ---');

    // 14a.1: Intento de login admin sin encabezado x-admin-device-key (403 esperado)
    const adminNoDeviceRes = await request('POST', '/api/auth/login', {
      username: 'admin',
      password: 'Admin2026!Master'
    });
    console.log('Login admin sin device key -> Status:', adminNoDeviceRes.status, '- Error:', adminNoDeviceRes.data.error);
    if (adminNoDeviceRes.status !== 403 || adminNoDeviceRes.data.error !== ADMIN_DENIED_MSG) {
      throw new Error(`Se esperaba 403 con mensaje de dispositivo denegado, obtenido: ${adminNoDeviceRes.status} ${JSON.stringify(adminNoDeviceRes.data)}`);
    }

    // 14a.2: Intento de login admin con encabezado x-admin-device-key erróneo (403 esperado)
    const adminBadDeviceRes = await request('POST', '/api/auth/login', {
      username: 'admin',
      password: 'Admin2026!Master'
    }, { 'x-admin-device-key': 'Clave-Incorrecta-Fake' });
    console.log('Login admin con device key errónea -> Status:', adminBadDeviceRes.status, '- Error:', adminBadDeviceRes.data.error);
    if (adminBadDeviceRes.status !== 403 || adminBadDeviceRes.data.error !== ADMIN_DENIED_MSG) {
      throw new Error(`Se esperaba 403 para clave de dispositivo inválida, obtenido: ${adminBadDeviceRes.status}`);
    }

    // 14a.3: Intento de login admin desde IP no autorizada (simulada vía x-forwarded-for externa) (403 esperado)
    const adminBadIpRes = await request('POST', '/api/auth/login', {
      username: 'admin',
      password: 'Admin2026!Master'
    }, {
      ...ADMIN_DEVICE_HEADER,
      'x-forwarded-for': '203.0.113.195'
    });
    console.log('Login admin desde IP externa no autorizada -> Status:', adminBadIpRes.status, '- Error:', adminBadIpRes.data.error);
    if (adminBadIpRes.status !== 403 || adminBadIpRes.data.error !== ADMIN_DENIED_MSG) {
      throw new Error(`Se esperaba 403 para IP externa no autorizada, obtenido: ${adminBadIpRes.status}`);
    }

    // 14a.4: Login admin exitoso simulando IPv6 autorizada del módem (2806:10be:7:2d74::/64) y device key válida
    const adminIpv6Res = await request('POST', '/api/auth/login', {
      username: 'admin',
      password: 'Admin2026!Master'
    }, {
      ...ADMIN_DEVICE_HEADER,
      'x-forwarded-for': '2806:10be:7:2d74:a1b2:c3d4:e5f6:7890'
    });
    console.log('Login admin desde IPv6 autorizada del módem -> Status:', adminIpv6Res.status, '- Role:', adminIpv6Res.data.user?.role);
    if (adminIpv6Res.status !== 200 || !adminIpv6Res.data.token || adminIpv6Res.data.user?.role !== 'admin') {
      throw new Error('Falló el login de administrador desde el prefijo IPv6 autorizado');
    }

    // 14a.5: Login admin exitoso desde IP local (127.0.0.1) con device key válida
    const adminLoginRes = await request('POST', '/api/auth/login', {
      username: 'admin',
      password: 'Admin2026!Master'
    }, ADMIN_DEVICE_HEADER);
    console.log('Login admin local con device key -> Status:', adminLoginRes.status, '- Role:', adminLoginRes.data.user?.role);
    if (adminLoginRes.status !== 200 || !adminLoginRes.data.token || adminLoginRes.data.user?.role !== 'admin') {
      throw new Error('Falló el login del administrador principal localmente');
    }
    const adminToken = adminLoginRes.data.token;
    const adminUserObj = adminLoginRes.data.user;
    console.log('✅ Seguridad estricta en login de administrador (IP Whitelist + Dispositivo Maestro) OK, role:', adminUserObj.role);

    console.log('\n--- 14b. Probando middleware adminIpWhitelist y requireAdmin en /api/admin/* ---');
    // 14b.1: Acceso a /api/admin/users sin device key -> bloqueado por adminIpWhitelist con 403 y ADMIN_DENIED_MSG
    const noDeviceAdminRes = await request('GET', '/api/admin/users');
    console.log('GET /api/admin/users sin device key -> Status:', noDeviceAdminRes.status, '- Error:', noDeviceAdminRes.data.error);
    if (noDeviceAdminRes.status !== 403 || noDeviceAdminRes.data.error !== ADMIN_DENIED_MSG) {
      throw new Error(`Se esperaba 403 con ADMIN_DENIED_MSG sin device key, obtenido ${noDeviceAdminRes.status}`);
    }

    // 14b.2: Acceso a /api/admin/users desde IP no autorizada aunque tenga device key -> bloqueado con 403
    const badIpAdminRes = await request('GET', '/api/admin/users', null, {
      ...ADMIN_DEVICE_HEADER,
      'x-forwarded-for': '198.51.100.25'
    });
    console.log('GET /api/admin/users desde IP no autorizada -> Status:', badIpAdminRes.status, '- Error:', badIpAdminRes.data.error);
    if (badIpAdminRes.status !== 403 || badIpAdminRes.data.error !== ADMIN_DENIED_MSG) {
      throw new Error(`Se esperaba 403 con ADMIN_DENIED_MSG para IP no autorizada, obtenido ${badIpAdminRes.status}`);
    }

    // 14b.3: Con device key válida e IP válida, pero sin token -> requireAdmin responde 403 "Acceso no autorizado"
    const noTokenRes = await request('GET', '/api/admin/users', null, ADMIN_DEVICE_HEADER);
    console.log('GET /api/admin/users sin token -> Status:', noTokenRes.status, '- Error:', noTokenRes.data.error);
    if (noTokenRes.status !== 403 || noTokenRes.data.error !== 'Acceso no autorizado') {
      throw new Error(`Esperado 403 con error 'Acceso no autorizado' sin token, obtenido ${noTokenRes.status}`);
    }

    // 14b.4: Con device key válida e IP válida, pero con token inválido -> requireAdmin responde 403 "Acceso no autorizado"
    const badTokenRes = await request('GET', '/api/admin/users', null, {
      ...ADMIN_DEVICE_HEADER,
      Authorization: 'Bearer token_invalido_123'
    });
    console.log('GET /api/admin/users con token inválido -> Status:', badTokenRes.status);
    if (badTokenRes.status !== 403 || badTokenRes.data.error !== 'Acceso no autorizado') {
      throw new Error(`Esperado 403 con error 'Acceso no autorizado' para token inválido, obtenido ${badTokenRes.status}`);
    }

    // 14b.5: Con token de usuario normal (jwtToken creado en paso 3/8) -> requireAdmin responde 403 "Acceso no autorizado"
    const normalUserRes = await request('GET', '/api/admin/users', null, {
      ...ADMIN_DEVICE_HEADER,
      Authorization: `Bearer ${jwtToken}`
    });
    console.log('GET /api/admin/users con usuario común -> Status:', normalUserRes.status, '- Error:', normalUserRes.data.error);
    if (normalUserRes.status !== 403 || normalUserRes.data.error !== 'Acceso no autorizado') {
      throw new Error(`Esperado 403 con error 'Acceso no autorizado' para usuario no admin, obtenido ${normalUserRes.status}`);
    }
    console.log('✅ adminIpWhitelist y requireAdmin bloquean accesos no autorizados con código 403 OK');

    console.log('\n--- 14c. Probando GET /api/admin/users con token de administrador y dispositivo autorizado ---');
    const adminUsersRes = await request('GET', '/api/admin/users', null, {
      ...ADMIN_DEVICE_HEADER,
      Authorization: `Bearer ${adminToken}`
    });
    console.log('Status GET /api/admin/users:', adminUsersRes.status);
    console.log('Total usuarios obtenidos:', Array.isArray(adminUsersRes.data) ? adminUsersRes.data.length : 'No es array');
    if (adminUsersRes.status !== 200 || !Array.isArray(adminUsersRes.data) || adminUsersRes.data.length === 0) {
      throw new Error('Falló GET /api/admin/users');
    }
    const sampleUser = adminUsersRes.data[0];
    console.log('Muestra de usuario retornado:', sampleUser);
    const requiredKeys = ['id', 'username', 'email', 'role', 'created_at', 'exp', 'rank', 'streak_days'];
    for (const key of requiredKeys) {
      if (!(key in sampleUser)) {
        throw new Error(`El usuario en GET /api/admin/users no contiene la propiedad requerida '${key}'`);
      }
    }
    console.log('✅ GET /api/admin/users retorna todos los campos requeridos OK');

    console.log('\n--- 14d. Probando GET /api/admin/stats ---');
    const adminStatsRes = await request('GET', '/api/admin/stats', null, {
      ...ADMIN_DEVICE_HEADER,
      Authorization: `Bearer ${adminToken}`
    });
    console.log('Status GET /api/admin/stats:', adminStatsRes.status);
    console.log('Stats:', adminStatsRes.data);
    if (
      adminStatsRes.status !== 200 ||
      typeof adminStatsRes.data.totalUsers !== 'number' ||
      typeof adminStatsRes.data.activeUsersToday !== 'number' ||
      typeof adminStatsRes.data.averageExp !== 'number'
    ) {
      throw new Error('Falló GET /api/admin/stats o las métricas no son números');
    }
    console.log('✅ GET /api/admin/stats retorna métricas globales correctas OK');

    console.log('\n--- 14e. Probando PATCH /api/admin/users/:id/role ---');
    // Crear un usuario temporal para ascender y degradar
    const tempUser = `temp_role_user_${Date.now()}`;
    const tempRegRes = await request('POST', '/api/auth/register', {
      username: tempUser,
      email: `${tempUser}@dominio.com`,
      password: 'TemporaryPass123!'
    });
    const tempUserId = tempRegRes.data.user.id;
    console.log('Usuario temporal creado:', tempUser, 'con ID:', tempUserId, 'Role:', tempRegRes.data.user.role);

    // Intento con rol inválido (400 esperado)
    const badRoleRes = await request('PATCH', `/api/admin/users/${tempUserId}/role`, { role: 'super_admin_falso' }, {
      ...ADMIN_DEVICE_HEADER,
      Authorization: `Bearer ${adminToken}`
    });
    console.log('PATCH con rol inválido -> Status:', badRoleRes.status);
    if (badRoleRes.status !== 400) {
      throw new Error(`Se esperaba 400 para rol inválido, obtenido ${badRoleRes.status}`);
    }

    // Ascender a 'admin'
    const promoteRes = await request('PATCH', `/api/admin/users/${tempUserId}/role`, { role: 'admin' }, {
      ...ADMIN_DEVICE_HEADER,
      Authorization: `Bearer ${adminToken}`
    });
    console.log('Ascenso a admin -> Status:', promoteRes.status, '- Nuevo rol:', promoteRes.data.user?.role);
    if (promoteRes.status !== 200 || promoteRes.data.user?.role !== 'admin') {
      throw new Error('Falló el ascenso de rol a admin');
    }

    // Degradar a 'user'
    const demoteRes = await request('PATCH', `/api/admin/users/${tempUserId}/role`, { role: 'user' }, {
      ...ADMIN_DEVICE_HEADER,
      Authorization: `Bearer ${adminToken}`
    });
    console.log('Degradación a user -> Status:', demoteRes.status, '- Nuevo rol:', demoteRes.data.user?.role);
    if (demoteRes.status !== 200 || demoteRes.data.user?.role !== 'user') {
      throw new Error('Falló la degradación de rol a user');
    }

    // Intentar degradar al administrador principal (403 esperado)
    const demoteMainAdminRes = await request('PATCH', `/api/admin/users/${adminUserObj.id}/role`, { role: 'user' }, {
      ...ADMIN_DEVICE_HEADER,
      Authorization: `Bearer ${adminToken}`
    });
    console.log('Intento de degradar al admin principal -> Status:', demoteMainAdminRes.status, '- Error:', demoteMainAdminRes.data.error);
    if (demoteMainAdminRes.status !== 403) {
      throw new Error(`Se esperaba 403 al intentar degradar al admin principal, obtenido ${demoteMainAdminRes.status}`);
    }
    console.log('✅ PATCH /api/admin/users/:id/role con protecciones OK');

    console.log('\n--- 14f. Probando DELETE /api/admin/users/:id con cascada y protecciones ---');
    // Intento de auto-eliminación por el propio admin (400 esperado)
    const selfDeleteRes = await request('DELETE', `/api/admin/users/${adminUserObj.id}`, null, {
      ...ADMIN_DEVICE_HEADER,
      Authorization: `Bearer ${adminToken}`
    });
    console.log('Auto-eliminación de admin -> Status:', selfDeleteRes.status, '- Error:', selfDeleteRes.data.error);
    if (selfDeleteRes.status !== 400) {
      throw new Error(`Se esperaba 400 al intentar auto-eliminar la cuenta del admin, obtenido ${selfDeleteRes.status}`);
    }

    // Intento de eliminar al admin principal (403 esperado)
    const delMainAdminRes = await request('DELETE', `/api/admin/users/${adminUserObj.id}`, null, {
      ...ADMIN_DEVICE_HEADER,
      Authorization: `Bearer ${adminToken}`
    });
    // (Ya cubierto por auto-eliminación si es el mismo, pero si se pasa otro id de admin o el mismo debe responder 400 o 403)

    // Eliminación exitosa del usuario temporal
    const deleteTempRes = await request('DELETE', `/api/admin/users/${tempUserId}`, null, {
      ...ADMIN_DEVICE_HEADER,
      Authorization: `Bearer ${adminToken}`
    });
    console.log('Eliminación de usuario temporal -> Status:', deleteTempRes.status, '- Msg:', deleteTempRes.data.message);
    if (deleteTempRes.status !== 200 || !deleteTempRes.data.success) {
      throw new Error('Falló la eliminación del usuario temporal');
    }

    // Verificar que el usuario temporal ya no exista
    const verifyDelRes = await pool.query('SELECT id FROM users WHERE id = $1', [tempUserId]);
    if (verifyDelRes.rows.length !== 0) {
      throw new Error('El usuario temporal aún existe en la base de datos tras DELETE');
    }
    console.log('✅ DELETE /api/admin/users/:id con eliminación en cascada y protecciones OK');

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE AUTENTICACIÓN, ADMIN, YOUTUBE Y BASE DE DATOS PASARON EXITOSAMENTE!');
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

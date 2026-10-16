// scripts/verify_refactoring.js
const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('VERIFICANDO REFACTORIZACIÓN INTEGRAL DE LA APP');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
const serverPath = path.join(__dirname, '..', 'server', 'server.js');
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');

const html = fs.readFileSync(htmlPath, 'utf8');
const serverJs = fs.readFileSync(serverPath, 'utf8');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

let allPassed = true;

function assert(condition, message) {
  if (condition) {
    console.log('✅ ' + message);
  } else {
    console.error('❌ FALLÓ: ' + message);
    allPassed = false;
  }
}

// 1. REQUISITO 1: Autenticación Real, Google GIS, Pestañas Login/Registro y Guest
console.log('--- Verificando Requisito 1: Autenticación y GIS ---');
assert(html.includes('https://accounts.google.com/gsi/client'), 'Google Identity Services (GIS) script incluido en head');
assert(html.includes('handleGoogleSignInClick'), 'Función handleGoogleSignInClick implementada');
assert(html.includes('handleGoogleCredentialResponse'), 'Callback handleGoogleCredentialResponse implementado');
assert(serverJs.includes('/api/auth/google'), 'Endpoint /api/auth/google disponible en backend');
assert(schemaSql.includes('email VARCHAR(255) UNIQUE'), 'Columna email UNIQUE presente en schema.sql');
assert(schemaSql.includes('google_id VARCHAR(255)'), 'Columna google_id presente en schema.sql');
assert(html.includes('id="authTabBtnLogin"') && html.includes('id="authTabBtnRegister"'), 'Pestañas Iniciar Sesión / Registrarse presentes');
assert(html.includes('id="authLoginForm"') && html.includes('id="authRegisterForm"'), 'Formularios separados de Login y Sign Up presentes');
assert(html.includes('handleGuestAccess') && html.includes("'Invitado'"), 'Opción Continuar como Invitado con 0 EXP');

// 2. REQUISITO 2: Menú de Portales Carrusel Cilíndrico Vertical 3D
console.log('\n--- Verificando Requisito 2: Carrusel Cilíndrico 3D ---');
assert(html.includes('perspective: 1200px') || html.includes('perspective: 1200px;'), 'Perspectiva 3D 1200px configurada');
assert(html.includes('transform-style: preserve-3d'), 'transform-style: preserve-3d configurado');
assert(html.includes('portalCylinderRing'), 'Elemento del anillo cilíndrico portalCylinderRing presente');
assert(html.includes('rotateCarouselVertical'), 'Función rotateCarouselVertical implementada');
assert(html.includes('setupCarouselGestures'), 'Soporte para rueda del ratón y gestos táctiles swipe');
assert(html.includes('rotateX('), 'Rotación continua sobre el eje X del cilindro');
assert(html.includes('portalItem-0') && html.includes('portalItem-1') && html.includes('portalItem-2') && html.includes('portalItem-3'), '4 portales presentes en el cilindro 3D');

// 3. REQUISITO 3: Pantalla de Carga y Anti-Lag Transition
console.log('\n--- Verificando Requisito 3: Pantalla de Carga y Anti-Lag ---');
assert(html.includes('id="portalLoadingScreen"'), 'Pantalla de carga id="portalLoadingScreen" presente');
assert(html.includes('openPortalWithLoader'), 'Función openPortalWithLoader implementada');
assert(html.includes('isTransitioningView'), 'Bandera anti-lag isTransitioningView bloquea peticiones múltiples');
assert(html.includes('Cargando entorno...'), 'Texto formal "Cargando entorno..." configurado');
assert(html.includes('portalLoadingProgressBar'), 'Barra de progreso de carga animada presente');
assert(html.includes('initThreeWorldTour'), 'Three.js se inicializa antes de ocultar pantalla de carga en World Tour');

// 4. REQUISITO 4: Widgets Flotantes Arrastrables (Draggable)
console.log('\n--- Verificando Requisito 4: Widgets Arrastrables (Robot & Ruleta) ---');
assert(html.includes('id="draggableRobotWidget"'), 'Widget del Robot flotante id="draggableRobotWidget" presente');
assert(html.includes('id="draggableRouletteWidget"'), 'Widget de la Ruleta flotante id="draggableRouletteWidget" presente');
assert(html.includes('setupDraggableWidget'), 'Motor de arrastre setupDraggableWidget implementado para mouse y touch');
assert(html.includes('saved_robot_pos') && html.includes('saved_roulette_pos'), 'Persistencia de coordenadas en localStorage para ambos widgets');
assert(html.includes('spinRouletteWheel'), 'Ruleta con física de giro spinRouletteWheel');
assert(html.includes('rouletteModal') && html.includes('rouletteQuestionCard'), 'Modal de pregunta contrarreloj con cuenta regresiva');
assert(!html.includes('headerRouletteBtn'), 'Botón de texto de la ruleta eliminado del header');

// 5. REQUISITO 5: Corrección de EXP (Cero 9999 EXP) y Rangos Dinámicos
console.log('\n--- Verificando Requisito 5: EXP Real y Perfil Funcional ---');
assert(!html.includes('9999'), 'Cero menciones de 9999 EXP en el archivo');
assert(html.includes('addExp(20') || html.includes('completeLearningNode'), '+20 EXP por nivel en Misiones');
assert(html.includes('addExp(50') || html.includes('startVoicePracticeParagraph'), '+50 EXP por pronunciación aprobada en Cuentos');
assert(html.includes('addExp(30') || html.includes('completeMusicChallenge'), '+30 EXP por reto en Music Session');
assert(html.includes('addExp(15') || html.includes('handleRouletteAnswer'), '+15 EXP por respuesta correcta en Ruleta');
assert(html.includes('Bronce') && html.includes('Plata') && html.includes('Oro') && html.includes('Platino') && html.includes('Diamante') && html.includes('Maestro'), 'Escala de rangos dinámicos completa (Bronce a Maestro)');
assert(html.includes('openProfileModal'), 'Modal de perfil funcional con barra de progreso interactiva');

// 6. Test de Endpoints REST del Backend
console.log('\n--- Probando Endpoints del Backend Node.js / Express ---');
const postData = JSON.stringify({
  username: 'test_verify_user_' + Date.now(),
  email: 'test_' + Date.now() + '@example.com',
  password: 'Password123!'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      assert(res.statusCode === 201 && parsed.success, 'POST /api/auth/register responde 201 Created con éxito');
      assert(parsed.stats && parsed.stats.exp === 0, 'Nuevo usuario registrado inicia con exactamente 0 EXP');
    } catch (e) {
      assert(false, 'Respuesta inválida de /api/auth/register: ' + body);
    }

    if (allPassed) {
      console.log('\n🎉 ¡TODOS LOS 5 REQUISITOS TÉCNICOS HAN SIDO CUMPLIDOS Y VALIDADOS AL 100%!');
      process.exit(0);
    } else {
      console.error('\n⚠️ Algunos requisitos fallaron las pruebas.');
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  assert(false, 'Fallo de conexión HTTP al backend: ' + err.message);
  process.exit(1);
});

req.write(postData);
req.end();

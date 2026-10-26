const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO CONTENIDO DINÁMICO DEL MODAL DE PERFIL DE USUARIO ===\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
    passed++;
  } else {
    console.error(`❌ FALLÓ: ${message}`);
    failed++;
  }
}

// 1. Objetivo 1: Renderizado Dinámico del Perfil (renderUserProfile)
console.log('--- Objetivo 1: Renderizado Dinámico del Perfil ---');
const appJs = fs.readFileSync('js/app.js', 'utf8');

assert(
  appJs.includes('function renderUserProfile()') &&
  appJs.includes("localStorage.getItem('mastereng_user') || '{\"role\":\"guest\",\"username\":\"Invitado\"}'"),
  'renderUserProfile() lee la sesión desde localStorage con fallback a invitado'
);

assert(
  appJs.includes('window.renderUserProfile = renderUserProfile'),
  'window.renderUserProfile expuesta globalmente'
);

// 2. Objetivo 2: Vista para Modo Invitado
console.log('\n--- Objetivo 2: Vista para Modo Invitado (role === "guest") ---');
assert(
  appJs.includes('Modo Invitado') &&
  appJs.includes('Invitado') &&
  appJs.includes('Estás explorando en modo de prueba. Tu progreso no se guardará de forma permanente.'),
  'Modo Invitado incluye avatar con badge "Modo Invitado", nombre "Invitado" y mensaje informativo'
);

assert(
  appJs.includes('Iniciar Sesión') &&
  appJs.includes("openLoginFromProfile('login')") &&
  appJs.includes('Crear Cuenta / Registrarse') &&
  appJs.includes("openLoginFromProfile('register')"),
  'Modo Invitado incluye botones destacados "Iniciar Sesión" y "Crear Cuenta / Registrarse" con redirección'
);

// 3. Objetivo 3: Vista para Usuario Registrado o Admin
console.log('\n--- Objetivo 3: Vista para Usuario Registrado o Admin ---');
assert(
  appJs.includes('user.username') &&
  appJs.includes('user.email') &&
  appJs.includes('rankInfo.medal') &&
  appJs.includes('rankInfo.rank'),
  'Muestra nombre de usuario, correo electrónico, insignia de rango y nivel de EXP'
);

assert(
  appJs.includes('user.role === \'admin\'') &&
  appJs.includes('Administrador') &&
  appJs.includes('openAdminDashboardModal'),
  'Badge de Administrador y botón de acceso a "⚙️ Panel Admin" presentes para usuarios admin'
);

assert(
  appJs.includes('handleProfileLogout') &&
  appJs.includes('Cerrar Sesión') &&
  appJs.includes("localStorage.removeItem('mastereng_user')"),
  'Botón "Cerrar Sesión" limpia localStorage, restaura estado invitado y muestra login'
);

// 4. Objetivo 4: Estilos y Conexión en index.html
console.log('\n--- Objetivo 4: Estilos y Conexión en index.html ---');
const html = fs.readFileSync('index.html', 'utf8');

assert(
  html.includes('id="profile-content"') &&
  html.includes('class="profile-body'),
  'index.html contiene el contenedor <div class="profile-body" id="profile-content">'
);

assert(
  html.includes('id="headerProfileBtn"') &&
  html.includes("onclick=\"window.renderUserProfile(); toggleModal('profile-modal');\""),
  'Botón de perfil en el header vinculado con onclick="window.renderUserProfile(); toggleModal(\'profile-modal\');"'
);

const styleCss = fs.readFileSync('css/style.css', 'utf8');
assert(
  styleCss.includes('.profile-body'),
  'css/style.css contiene estilos dedicados para .profile-body'
);

// 5. Sincronización Tri-Directorio
console.log('\n--- Sincronización entre Directorios ---');
const rootDir = process.cwd();
const androidAssets = path.join(rootDir, 'app', 'src', 'main', 'assets');
const parentDir = path.resolve(rootDir, '..');

const htmlRoot = fs.readFileSync('index.html', 'utf8');
const htmlAndroid = fs.readFileSync(path.join(androidAssets, 'index.html'), 'utf8');
const htmlParent = fs.readFileSync(path.join(parentDir, 'index.html'), 'utf8');

assert(
  htmlRoot === htmlAndroid && htmlRoot === htmlParent,
  'index.html 100% sincronizado en raíz, app/src/main/assets e index superior'
);

const cssRoot = fs.readFileSync('css/style.css', 'utf8');
const cssAndroid = fs.readFileSync(path.join(androidAssets, 'css', 'style.css'), 'utf8');

assert(
  cssRoot === cssAndroid,
  'css/style.css 100% sincronizado en raíz y app/src/main/assets'
);

const jsRoot = fs.readFileSync('js/app.js', 'utf8');
const jsAndroid = fs.readFileSync(path.join(androidAssets, 'js', 'app.js'), 'utf8');

assert(
  jsRoot === jsAndroid,
  'js/app.js 100% sincronizado en raíz y app/src/main/assets'
);

console.log('\n--- RESUMEN FINAL ---');
console.log(`Pruebas totales: ${passed + failed} | Aprobadas: ${passed} | Fallidas: ${failed}`);

if (failed === 0) {
  console.log('🎉 TODOS LOS REQUISITOS DEL MODAL DE PERFIL PASARON AL 100%!');
  process.exit(0);
} else {
  console.error('❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN.');
  process.exit(1);
}

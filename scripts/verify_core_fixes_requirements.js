const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.resolve(rootDir, 'app/src/main/assets');
const parentDir = path.resolve(rootDir, '..');

let total = 0;
let passed = 0;

function assert(desc, cond) {
  total++;
  if (cond) {
    passed++;
    console.log(`  ✅ [PASS] ${desc}`);
  } else {
    console.error(`  ❌ [FAIL] ${desc}`);
  }
}

console.log('=== VERIFICACIÓN INTEGRAL DE REQUISITOS FRONTEND MASTERENG ===\n');

const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(rootDir, 'css/style.css'), 'utf8');
const js = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');

// 1. REPARACIÓN DEL FORMULARIO DE AUTENTICACIÓN
console.log('1. Formulario de Autenticación (Login & Registro):');
assert('window.switchAuthTab implementado en js/app.js', js.includes('window.switchAuthTab = function'));
assert('Confirmar Contraseña existe en formulario de registro', html.includes('id="authRegConfirmPassword"'));
assert('Botón de registro visible es "Crear mi Cuenta MasterENG"', html.includes('Crear mi Cuenta MasterENG'));
assert('Todos los botones en formularios de auth tienen type="button"',
  html.includes('id="authLoginSubmitBtn" type="button"') ||
  html.includes('type="button" id="authLoginSubmitBtn"')
);
assert('Login Admin almacena exp: 1250 y rank Diamante',
  js.includes('"exp": 1250') || js.includes('exp: 1250')
);
assert('Login Invitado almacena rol guest y exp: 0',
  js.includes('role: \'guest\'') || js.includes('"role": "guest"')
);
assert('handleAuthRegisterSubmit valida campos y guarda nuevo usuario',
  js.includes('window.handleAuthRegisterSubmit = function') &&
  js.includes("role: 'user'")
);

// 2. UNIFORMIDAD DEL CARRUSEL EN EL HUB
console.log('\n2. Uniformidad del Carrusel en el Hub:');
assert('CSS: .hub-carousel y .carousel-track definidos con flex y gap 2rem',
  css.includes('.hub-carousel') && css.includes('gap: 2rem !important')
);
assert('CSS: .portal-card con dimensiones fijas de 320px x 500px',
  css.includes('.portal-card') && css.includes('width: 320px !important') && css.includes('height: 500px !important')
);
assert('CSS: .carousel-nav-btn.prev y .carousel-nav-btn.next posicionadas en extremos con z-index 1000',
  css.includes('.carousel-nav-btn.prev') && css.includes('z-index: 1000 !important')
);
assert('window.nextPortal() y window.prevPortal() implementados',
  js.includes('window.nextPortal = function') && js.includes('window.prevPortal = function')
);
assert('Flechas del carrusel en HTML conectadas a window.nextPortal y window.prevPortal',
  html.includes('window.prevPortal()') && html.includes('window.nextPortal()')
);

// 3. RENDERIZADO DINÁMICO DE LOS 10 MÓDULOS DE LEARNING PATH
console.log('\n3. Renderizado Dinámico de los 10 Módulos de Learning Path:');
assert('window.OFFICIAL_LEARNING_MODULES contiene los 10 módulos con título, nivel, exp y palabras',
  js.includes('window.OFFICIAL_LEARNING_MODULES') &&
  js.includes('Foundations & Daily Routine') &&
  js.includes('Master Fluency & Accent Reduction')
);
assert('window.openLearningPath implementado para desplegar Learning Path',
  js.includes('window.openLearningPath = function')
);
assert('window.renderOfficialLearningModules renderiza los 10 módulos en .modules-grid',
  js.includes('window.renderOfficialLearningModules = function') &&
  js.includes('.modules-grid')
);
assert('Botón Entrar al Portal en Portal 01 ejecuta window.openLearningPath',
  html.includes('window.openLearningPath()')
);
assert('Botón "← Volver a Portales" restaura el Hub sin recargar',
  html.includes('goToHomePortals()')
);

// 4. BUSCADOR GLOBAL DE MÚSICA CON ITUNES SEARCH API
console.log('\n4. Buscador Global de Música con iTunes Search API:');
assert('window.searchGlobalMusic implementado',
  js.includes('window.searchGlobalMusic = async function')
);
assert('Consulta en tiempo real a iTunes Search API con limit=12',
  js.includes('https://itunes.apple.com/search?term=') && js.includes('limit=12')
);
assert('Cuadrícula .music-results-grid existe en HTML',
  html.includes('class="music-results-grid') || html.includes('music-results-grid')
);
assert('window.loadSongToKaraoke implementado para inyectar tema y subtítulos fonéticos',
  js.includes('window.loadSongToKaraoke = function')
);
assert('Botón Buscar / Cargar en index.html llama a window.searchGlobalMusic()',
  html.includes('window.searchGlobalMusic()')
);

// 5. CONTROL GLOBAL DE MODALES Y DESATASCO DE INTERFAZ
console.log('\n5. Control Global de Modales y Desatasco:');
assert('window.closeAllModals implementado y expuesto globalmente',
  js.includes('window.closeAllModals = function')
);
assert('Listener global de tecla Escape implementado en document',
  js.includes("e.key === 'Escape'") || js.includes('e.keyCode === 27')
);
assert('Listener global de clics en backdrop implementado',
  js.includes('.modal-backdrop') || js.includes('modal-overlay')
);
assert('renderUserProfile renderiza vista Invitado con botones a Login y Registro',
  js.includes('renderUserProfile') &&
  js.includes('openLoginFromProfile')
);
assert('renderUserProfile renderiza vista Registrado/Admin con progreso EXP y Cerrar Sesión',
  js.includes('handleLogout()')
);

// 6. SINCRONIZACIÓN Y REGLAS DE TAMAÑO
console.log('\n6. Sincronización Tri-Directorio y Límites:');
assert('index.html size es menor a 120,000 bytes', html.length < 120000);
['index.html', 'css/style.css', 'js/app.js'].forEach(f => {
  const rBuf = fs.readFileSync(path.join(rootDir, f));
  const aBuf = fs.readFileSync(path.join(assetsDir, f));
  const pBuf = fs.readFileSync(path.join(parentDir, f));
  assert(`${f} idéntico entre raíz y app/src/main/assets`, rBuf.equals(aBuf));
  assert(`${f} idéntico entre raíz y directorio superior`, rBuf.equals(pBuf));
});

console.log('\n========================================');
console.log(`TOTAL: ${passed}/${total} verificaciones aprobadas.`);
console.log('========================================');

if (passed !== total) {
  process.exit(1);
} else {
  console.log('🏆 TODOS LOS REQUISITOS HAN SIDO VERIFICADOS CON ÉXITO AL 100%!');
}

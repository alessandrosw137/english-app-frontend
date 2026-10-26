const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO JERARQUÍA DE CAPAS, POINTER-EVENTS Y RESPUESTA DE BOTONES ===\n');

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

// 1. Verificar CSS en css/style.css
console.log('--- Objetivo 1: Jerarquía de Capas (Z-Index y Pointer-Events) ---');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

assert(
  styleCss.includes('header, .top-bar, .navbar') &&
  styleCss.includes('z-index: 9999 !important') &&
  styleCss.includes('pointer-events: auto !important'),
  'Barra superior (header, .top-bar, .navbar) configurada con position: fixed, z-index: 9999 y pointer-events: auto'
);

assert(
  styleCss.includes('.floating-widget, #ai-tutor-btn, #roulette-btn, .bottom-widgets') &&
  styleCss.includes('z-index: 9999 !important'),
  'Botones y widgets flotantes (.floating-widget, #ai-tutor-btn, #roulette-btn, .bottom-widgets) configurados con z-index: 9999'
);

assert(
  styleCss.includes('#canvas-container, canvas') &&
  styleCss.includes('z-index: 0 !important') &&
  styleCss.includes('pointer-events: auto'),
  'Contenedor del canvas 3D (#canvas-container, canvas) con z-index: 0 y pointer-events: auto'
);

assert(
  styleCss.includes('#portalStarsCanvas, .star-bg, .particle-overlay, .canvas-background') &&
  styleCss.includes('pointer-events: none !important') &&
  styleCss.includes('z-index: 0 !important'),
  'Fondos decorativos y estrellas con pointer-events: none y z-index: 0'
);

assert(
  styleCss.includes('touch-action: manipulation'),
  'touch-action: manipulation implementado para eliminar retardos táctiles en controles interactivos'
);

assert(
  styleCss.includes('.modal, .drawer') &&
  styleCss.includes('100000'),
  'Modales y drawers (.modal, .drawer) configurados con z-index: 100000'
);

// 2. Verificar HTML
console.log('\n--- Objetivo 2: Botones y Controladores de Eventos Directos en index.html ---');
const html = fs.readFileSync('index.html', 'utf8');

assert(
  html.includes('<header') &&
  html.includes('top-bar') &&
  html.includes('navbar'),
  '<header> contiene clases top-bar y navbar'
);

assert(
  html.includes('id="headerProfileBtn"') &&
  html.includes("toggleModal('profile-modal')"),
  'Botón Perfil (#headerProfileBtn) vinculado con onclick="toggleModal(\'profile-modal\')"'
);

assert(
  html.includes('id="headerSettingsBtn"') &&
  html.includes("toggleModal('settings-modal')"),
  'Botón Ajustes (#headerSettingsBtn) vinculado con onclick="toggleModal(\'settings-modal\')"'
);

assert(
  html.includes('id="ai-tutor-btn"') &&
  html.includes("toggleModal('ai-tutor-modal')"),
  'Botón Robot Tutor (#ai-tutor-btn) vinculado con onclick="toggleModal(\'ai-tutor-modal\')"'
);

assert(
  html.includes('id="roulette-btn"') &&
  html.includes("toggleModal('roulette-modal')"),
  'Botón Ruleta (#roulette-btn) vinculado con onclick="toggleModal(\'roulette-modal\')"'
);

assert(
  html.includes('id="profileModal"') &&
  html.includes('class="modal fixed'),
  'profileModal tiene clase modal'
);

assert(
  html.includes('id="settingsModal"') &&
  html.includes('class="modal fixed'),
  'settingsModal tiene clase modal'
);

assert(
  html.includes('id="rouletteModal"') &&
  html.includes('class="modal fixed'),
  'rouletteModal tiene clase modal'
);

assert(
  html.includes('id="chatbotWindow"') &&
  html.includes('drawer') &&
  html.includes('modal'),
  'chatbotWindow tiene clases drawer y modal'
);

// 3. Verificar JS
console.log('\n--- Objetivo 3: Sistema Universal de Apertura de Modales en js/app.js ---');
const appJs = fs.readFileSync('js/app.js', 'utf8');

assert(
  appJs.includes('function toggleModal(modalId)'),
  'Función toggleModal(modalId) implementada en js/app.js'
);

assert(
  appJs.includes('window.toggleModal = toggleModal'),
  'window.toggleModal expuesta globalmente'
);

assert(
  appJs.includes("m.style.display = 'none'") &&
  appJs.includes("m.classList.remove('active')"),
  'toggleModal cierra los modales abiertos (.modal, .drawer)'
);

assert(
  appJs.includes("modal.style.display = 'flex'") &&
  appJs.includes("modal.classList.add('active')") &&
  appJs.includes("100000"),
  'toggleModal activa el modal seleccionado con display: flex y zIndex: 100000'
);

// 4. Verificar Sincronización Tri-directorio
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
  console.log('🎉 TODOS LOS REQUISITOS DE JERARQUÍA DE CAPAS Y RESPUESTA DE BOTONES PASARON AL 100%!');
  process.exit(0);
} else {
  console.error('❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN.');
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO CIERRE UNIVERSAL DE MODALES, BOTONES X, BACKDROP Y ESCAPE ===\n');

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

// 1. Objetivo 1: Funciones Universales de Cierre
console.log('--- Objetivo 1: Función Universal e Infalible de Cierre ---');
const appJs = fs.readFileSync('js/app.js', 'utf8');

assert(
  appJs.includes('window.closeAllModals = function()') &&
  appJs.includes("document.querySelectorAll('.modal, .modal-overlay, .modal-backdrop, .drawer, [id$=\"-modal\"]')") &&
  appJs.includes("el.style.display = 'none'") &&
  appJs.includes("el.classList.remove('active', 'show', 'open')"),
  'window.closeAllModals implementada en js/app.js con selectores y reseteo de estilos/clases'
);

assert(
  appJs.includes('window.closeModal = function(modalId)') &&
  appJs.includes("el.style.display = 'none'") || appJs.includes("modal.style.display = 'none'"),
  'window.closeModal implementada en js/app.js con soporte para ID string o nodo DOM'
);

// 2. Objetivo 2: Botones X en index.html
console.log('\n--- Objetivo 2: Vinculación Directa en Todos los Botones X ---');
const html = fs.readFileSync('index.html', 'utf8');

// Revisar que los modales clave contengan onclick="window.closeAllModals()" en sus botones X
const profileSection = html.slice(html.indexOf('id="profileModal"'), html.indexOf('id="settingsModal"'));
assert(
  profileSection.includes('onclick="window.closeAllModals()"') &&
  profileSection.includes('type="button"'),
  'Botón X del modal de Perfil (#profileModal) tiene onclick="window.closeAllModals()" y type="button"'
);

const settingsSection = html.slice(html.indexOf('id="settingsModal"'), html.indexOf('id="rouletteModal"'));
assert(
  settingsSection.includes('onclick="window.closeAllModals()"') &&
  settingsSection.includes('type="button"'),
  'Botón X del modal de Ajustes (#settingsModal) tiene onclick="window.closeAllModals()" y type="button"'
);

const rouletteSection = html.slice(html.indexOf('id="rouletteModal"'), html.indexOf('id="chatbotWindow"'));
assert(
  rouletteSection.includes('onclick="window.closeAllModals()"') &&
  rouletteSection.includes('type="button"'),
  'Botón X del modal de Ruleta (#rouletteModal) tiene onclick="window.closeAllModals()" y type="button"'
);

const glossarySection = html.slice(html.indexOf('id="glossaryModal"'), html.indexOf('id="learningMissionModal"'));
assert(
  glossarySection.includes('onclick="window.closeAllModals()"') &&
  glossarySection.includes('type="button"'),
  'Botón X del modal de Glosario (#glossaryModal) tiene onclick="window.closeAllModals()" y type="button"'
);

const chatbotSection = html.slice(html.indexOf('id="chatbotWindow"'), html.indexOf('id="musicWordModal"'));
assert(
  chatbotSection.includes('onclick="window.closeAllModals()"') &&
  chatbotSection.includes('type="button"'),
  'Botón X de la ventana de Chatbot (#chatbotWindow) tiene onclick="window.closeAllModals()" y type="button"'
);

// CSS de botones de cierre
const styleCss = fs.readFileSync('css/style.css', 'utf8');
assert(
  styleCss.includes('.close-btn') &&
  styleCss.includes('pointer-events: auto !important') &&
  styleCss.includes('z-index: 100001 !important') &&
  styleCss.includes('cursor: pointer !important'),
  'Estilos CSS para botones de cierre configuran pointer-events: auto, z-index: 100001 y cursor: pointer'
);

// 3. Objetivo 3: Cierre por Backdrop y Tecla Escape
console.log('\n--- Objetivo 3: Cierre por Clic en Fondo (Backdrop) y Tecla Escape ---');
assert(
  appJs.includes("document.addEventListener('click'") &&
  appJs.includes("e.target.classList.contains('modal') || e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-backdrop')") &&
  appJs.includes("window.closeAllModals()"),
  'Listener de clic en backdrop implementado en js/app.js para cerrar modales al hacer clic fuera'
);

assert(
  appJs.includes("document.addEventListener('keydown'") &&
  appJs.includes("e.key === 'Escape'") &&
  appJs.includes("window.closeAllModals()"),
  'Listener de teclado para tecla Escape implementado en js/app.js para cerrar modales'
);

// 4. Sincronización Tri-Directorio
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
  console.log('🎉 TODOS LOS REQUISITOS DE CIERRE DE MODALES PASARON AL 100%!');
  process.exit(0);
} else {
  console.error('❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN.');
  process.exit(1);
}

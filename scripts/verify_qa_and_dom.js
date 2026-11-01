const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=============================================================');
console.log('🔍 INICIANDO AUDITORÍA DE QA Y DOM - MASTERENG');
console.log('=============================================================\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function report(condition, message, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`✅ [PASS] ${message}`);
  } else {
    failedChecks++;
    console.error(`❌ [FAIL] ${message} ${details ? '-> ' + details : ''}`);
  }
}

// -------------------------------------------------------------
// 1. AUDITORÍA DE SINTAXIS EN TODOS LOS ARCHIVOS JS
// -------------------------------------------------------------
console.log('--- 1. AUDITORÍA DE SINTAXIS (node --check) ---');
const jsDir = path.join(__dirname, '..', 'js');
const targetFiles = [
  'app.js',
  'world3d.js',
  'world3d_market_rest.js',
  'world3d_dating_hotel.js',
  'world3d_nature_space.js',
  'soccer_tactics_3d.js',
  'pet_minigames_2d.js',
  'culinary_databank.js',
  'culinary_studio_2d.js',
  'asset_download_manager.js',
  'karaoke.js',
  'profile_social.js'
];

// Check explicit target files plus any other .js in js/
const allJsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
for (const file of allJsFiles) {
  const filePath = path.join(jsDir, file);
  try {
    execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
    report(true, `Sintaxis JS válida: js/${file}`);
  } catch (err) {
    report(false, `Sintaxis JS con error: js/${file}`, err.stderr ? err.stderr.toString() : err.message);
  }
}

// -------------------------------------------------------------
// 2. AUDITORÍA DE INTEGRACIÓN DOM
// -------------------------------------------------------------
console.log('\n--- 2. AUDITORÍA DE INTEGRACIÓN DOM ---');

// a) Verificar enlaces en index.html
const indexHtmlPath = path.join(__dirname, '..', 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const hasCssCulinary = indexHtml.includes('css/culinary_studio.css');
report(hasCssCulinary, 'index.html carga css/culinary_studio.css');

const hasJsDatabank = indexHtml.includes('js/culinary_databank.js');
report(hasJsDatabank, 'index.html carga js/culinary_databank.js');

const hasJsStudio = indexHtml.includes('js/culinary_studio_2d.js');
report(hasJsStudio, 'index.html carga js/culinary_studio_2d.js');

// b) Verificar exposición global de funciones requeridas
// window.openWorld3DLobby, window.openWorld3DScenario, window.openHedbanz3DPortal,
// window.openCulinaryStudioPortal, window.openSoccerTacticsPortal

const appJs = fs.readFileSync(path.join(jsDir, 'app.js'), 'utf8');
const world3dJs = fs.readFileSync(path.join(jsDir, 'world3d.js'), 'utf8');
const petMinigamesJs = fs.readFileSync(path.join(jsDir, 'pet_minigames_2d.js'), 'utf8');
const culinaryStudioJs = fs.readFileSync(path.join(jsDir, 'culinary_studio_2d.js'), 'utf8');
const soccerTacticsJs = fs.readFileSync(path.join(jsDir, 'soccer_tactics_3d.js'), 'utf8');

const hasOpenWorld3DLobby = (
  appJs.includes('window.openWorld3DLobby') ||
  world3dJs.includes('window.openWorld3DLobby') ||
  world3dJs.includes('global.openWorld3DLobby')
);
report(hasOpenWorld3DLobby, 'window.openWorld3DLobby definido y expuesto globalmente');

const hasOpenWorld3DScenario = (
  appJs.includes('window.openWorld3DScenario') ||
  world3dJs.includes('window.openWorld3DScenario') ||
  world3dJs.includes('global.openWorld3DScenario')
);
report(hasOpenWorld3DScenario, 'window.openWorld3DScenario definido y expuesto globalmente');

const hasOpenHedbanz3DPortal = (
  petMinigamesJs.includes('openHedbanz3DPortal') &&
  (petMinigamesJs.includes('window.openHedbanz3DPortal') || petMinigamesJs.includes('global.openHedbanz3DPortal'))
);
report(hasOpenHedbanz3DPortal, 'window.openHedbanz3DPortal definido y expuesto globalmente');

const hasOpenCulinaryStudioPortal = (
  culinaryStudioJs.includes('openCulinaryStudioPortal') ||
  appJs.includes('openCulinaryStudioPortal')
);
report(hasOpenCulinaryStudioPortal, 'window.openCulinaryStudioPortal definido y expuesto globalmente');

const hasOpenSoccerTacticsPortal = (
  soccerTacticsJs.includes('openSoccerTacticsPortal') &&
  (soccerTacticsJs.includes('window.openSoccerTacticsPortal') || soccerTacticsJs.includes('global.openSoccerTacticsPortal'))
);
report(hasOpenSoccerTacticsPortal, 'window.openSoccerTacticsPortal definido y expuesto globalmente');

// -------------------------------------------------------------
// RESUMEN
// -------------------------------------------------------------
console.log('\n=============================================================');
console.log(`TOTAL: ${totalChecks} | PASARON: ${passedChecks} | FALLARON: ${failedChecks}`);
console.log('=============================================================');

if (failedChecks > 0) {
  process.exit(1);
} else {
  console.log('🎉 AUDITORÍA COMPLETADA CON 100% DE ÉXITO');
  process.exit(0);
}

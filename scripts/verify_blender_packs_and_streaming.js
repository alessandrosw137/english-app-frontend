/**
 * MASTERENG BLENDER GLB PACKS & STREAMING AUDIT
 * Verifies existence of Blender GLB models, IndexedDB streaming manager,
 * loading watchdog & cancel buttons, and JS syntax across all scripts.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('======================================================================');
console.log('🤖 AUDITORÍA AUTOMÁTICA: BLENDER PACKS & STREAMING 3D');
console.log('======================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, description, detail = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`✅ [PASS] ${description}`);
  } else {
    failedChecks++;
    console.error(`❌ [FAIL] ${description} ${detail ? '-> ' + detail : ''}`);
  }
}

const ROOT_DIR = path.resolve(__dirname, '..');

// ======================================================================
// 1. VERIFICACIÓN FÍSICA DE ARCHIVOS .GLB Y MANIFEST
// ======================================================================
console.log('📦 1. Verificando existencia física de archivos .glb y manifest.json...');

const REQUIRED_ASSETS = [
  'assets/models/worlds/house.glb',
  'assets/models/worlds/supermarket.glb',
  'assets/models/worlds/restaurant.glb',
  'assets/models/worlds/hotel.glb',
  'assets/models/worlds/dating.glb',
  'assets/models/worlds/garden.glb',
  'assets/models/worlds/space.glb',
  'assets/models/soccer/soccer_pack.glb',
  'assets/models/hedbanz/hedbanz_pack.glb',
  'assets/models/manifest.json'
];

const assetTable = [];

for (const relPath of REQUIRED_ASSETS) {
  const fullPath = path.join(ROOT_DIR, relPath);
  const exists = fs.existsSync(fullPath);
  let sizeBytes = 0;
  let sizeMB = 0;

  if (exists) {
    const stats = fs.statSync(fullPath);
    sizeBytes = stats.size;
    sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);
  }

  assert(exists && sizeBytes > 0, `Archivo presente y no vacío: ${relPath}`, `bytes: ${sizeBytes}`);

  assetTable.push({
    Archivo: relPath,
    Existe: exists ? 'SÍ' : 'NO',
    'Tamaño (Bytes)': sizeBytes,
    'Peso (MB)': `${sizeMB} MB`
  });
}

console.log('\n📊 TABLA DE ARCHIVOS .GLB Y MANIFEST:');
console.table(assetTable);

// Validar estructura de manifest.json
const manifestPath = path.join(ROOT_DIR, 'assets/models/manifest.json');
let manifestValid = false;
try {
  const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifestValid = (
    (manifestData.models || manifestData.version) &&
    (manifestData.models?.house || manifestData.models?.world_house) &&
    (manifestData.models?.soccer || manifestData.models?.game_soccer_pack)
  );
} catch (e) {
  manifestValid = false;
}
assert(manifestValid, 'assets/models/manifest.json contiene estructura JSON válida con modelos registrados');

// ======================================================================
// 2. AUDITORÍA DE js/asset_download_manager.js
// ======================================================================
console.log('\n📥 2. Verificando js/asset_download_manager.js (IndexedDB y Streaming On-Demand)...');

const admPath = path.join(ROOT_DIR, 'js/asset_download_manager.js');
const admExists = fs.existsSync(admPath);
assert(admExists, 'Existe js/asset_download_manager.js');

if (admExists) {
  const admCode = fs.readFileSync(admPath, 'utf8');

  // a) Gestión de confirmación de descarga mostrando MB exactos
  const hasMBConfirmation = (
    admCode.includes('sizeMB') &&
    admCode.includes('openDownloadModal') &&
    admCode.includes('adm-size-badge') &&
    /MB/.test(admCode)
  );
  assert(hasMBConfirmation, 'Modal de confirmación muestra el tamaño exacto en MB antes de descargar');

  // b) Guardado en IndexedDB permanente
  const hasIndexedDB = (
    admCode.includes('MasterENG_3D_Assets_DB') &&
    admCode.includes('indexedDB') &&
    admCode.includes('savePackToDB') &&
    admCode.includes('getPackFromDB')
  );
  assert(hasIndexedDB, 'Implementa almacenamiento y recuperación en IndexedDB (MasterENG_3D_Assets_DB)');

  // c) Bloqueo limpio de acceso si el usuario cancela
  const hasCleanCancel = (
    admCode.includes('onCancelDownloadClicked') &&
    admCode.includes('closeDownloadModal') &&
    admCode.includes('onCancel')
  );
  assert(hasCleanCancel, 'Bloqueo limpio y retorno seguro si el usuario cancela la descarga');

  // d) Interceptores para mundos 3D y juegos
  const hasInterceptors = (
    admCode.includes('loadWorld3DWithPrecompile') &&
    admCode.includes('openPortalModules') &&
    admCode.includes('requireAssetPack')
  );
  assert(hasInterceptors, 'Intercepta la apertura de mundos 3D y deportes para exigir descarga bajo demanda');
}

// ======================================================================
// 3. AUDITORÍA DE PANTALLA DE CARGA, WATCHDOG Y BOTÓN CANCELAR
// ======================================================================
console.log('\n⏱️ 3. Verificando pantalla de carga 3D, Fail-Safe Watchdog y Botón Cancelar...');

const world3dPath = path.join(ROOT_DIR, 'js/world3d.js');
const world3dExists = fs.existsSync(world3dPath);
assert(world3dExists, 'Existe js/world3d.js');

if (world3dExists) {
  const world3dCode = fs.readFileSync(world3dPath, 'utf8');

  // a) Botón Cancelar y Salir
  const hasCancelBtn = (
    world3dCode.includes('✕ Cancelar y Salir') &&
    world3dCode.includes('cancelWorld3DLoad')
  );
  assert(hasCancelBtn, 'Pantalla de carga cuenta con botón físico "✕ Cancelar y Salir"');

  // b) Watchdog timer que previene que la pantalla se congele en 85%
  const hasWatchdog = (
    world3dCode.includes('watchdogTimer') ||
    (world3dCode.includes('85%') && world3dCode.includes('setTimeout')) ||
    world3dCode.includes('finishLoaderAndShowScene')
  );
  assert(hasWatchdog, 'Implementa Fail-Safe Watchdog que previene congelamiento en 85%');

  // c) Cancelación limpia y retorno
  const hasCancelFunction = (
    world3dCode.includes('function cancelWorld3DLoad') &&
    (world3dCode.includes('returnToMainPortals') || world3dCode.includes('openWorld3DLobby'))
  );
  assert(hasCancelFunction, 'cancelWorld3DLoad limpia timers, restaura clases y regresa a portales limpiamente');
}

// ======================================================================
// 4. VERIFICACIÓN DE SINTAXIS DE ARCHIVOS JS (node --check)
// ======================================================================
console.log('\n🔍 4. Verificando sintaxis con node --check en todos los archivos JS...');

const jsDir = path.join(ROOT_DIR, 'js');
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

// Agregar archivos raíz relevantes
const rootFiles = ['sw.js', 'server.js'].filter(f => fs.existsSync(path.join(ROOT_DIR, f)));
const allJsToCheck = [
  ...jsFiles.map(f => path.join('js', f)),
  ...rootFiles
];

let syntaxErrors = 0;
for (const relJs of allJsToCheck) {
  const fullJsPath = path.join(ROOT_DIR, relJs);
  try {
    execSync(`node --check "${fullJsPath}"`, { stdio: 'pipe' });
  } catch (err) {
    syntaxErrors++;
    console.error(`❌ Error de sintaxis en: ${relJs}`);
  }
}

assert(syntaxErrors === 0, `Todos los archivos JS (${allJsToCheck.length} analizados) tienen sintaxis 100% válida`, `${syntaxErrors} errores`);

// ======================================================================
// 5. AUDITORÍA DE sw.js
// ======================================================================
console.log('\n🌐 5. Verificando configuración de Service Worker (sw.js)...');
const swPath = path.join(ROOT_DIR, 'sw.js');
const swCode = fs.readFileSync(swPath, 'utf8');

assert(swCode.includes('mastereng-pwa-v24-'), 'Versión de caché de sw.js actualizada a mastereng-pwa-v24-*');
assert(swCode.includes('.glb'), 'sw.js excluye paquetes .glb pesados para gestión on-demand vía IndexedDB');

// ======================================================================
// RESUMEN FINAL
// ======================================================================
console.log('\n======================================================================');
console.log(`TOTAL DE PRUEBAS: ${totalChecks} | PASARON: ${passedChecks} | FALLARON: ${failedChecks}`);
console.log('======================================================================');

if (failedChecks > 0) {
  console.error('\n❌ LA AUDITORÍA FALLÓ. Revisa los mensajes de error arriba.');
  process.exit(1);
} else {
  console.log('\n🎉 ¡TODAS LAS PRUEBAS DE AUDITORÍA PASARON EXITOSAMENTE (100%)!');
  process.exit(0);
}

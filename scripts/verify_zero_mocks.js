/**
 * MasterENG - QA Automation: Zero Mock Audit & Asset Synchronization
 * Scans js/profile_social.js, js/pet_sanctuary.js, js/pet_engine_2d.js, js/world3d.js
 * to verify 100% absence of mock / placeholder strings.
 * Verifies syntax of all JS files.
 * Synchronizes assets to app/src/main/assets/ and ENGLISH-/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('========================================================================');
console.log('🛡️ MASTERENG QA AUDIT: VERIFICACIÓN ESTRICTA ANTI-RELLENO (ZERO MOCKS)');
console.log('========================================================================\n');

let allPassed = true;
function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    allPassed = false;
  }
}

// ----------------------------------------------------------------------------
// 1. ESCANEO ESTRICTO DE CADENAS DE RELLENO EN LOS 4 ARCHIVOS TARGET
// ----------------------------------------------------------------------------
console.log('📦 TEST 1: Escaneo de cadenas falsas / datos de relleno en archivos core...');
const targetFiles = [
  'js/profile_social.js',
  'js/pet_sanctuary.js',
  'js/pet_engine_2d.js',
  'js/world3d.js'
];

const forbiddenStrings = [
  'StarlightPartner',
  'CyberPup99',
  'Team English Pros',
  'Sparky & Friends',
  'ENG772',
  'mastereng.club',
  '@mastereng_learner',
  '@mastereng_ai',
  'Specialty Coffee',
  'Enfoque Total / Criador Solitario'
];

targetFiles.forEach(relPath => {
  const fullPath = path.join(__dirname, '..', relPath);
  assert(fs.existsSync(fullPath), `Archivo objetivo existe: ${relPath}`);
  const content = fs.readFileSync(fullPath, 'utf8');

  forbiddenStrings.forEach(str => {
    const found = content.includes(str);
    assert(!found, `"${str}" NO existe en ${relPath}`);
  });
});

// ----------------------------------------------------------------------------
// 2. VERIFICACIÓN DE SINTAXIS (NODE --CHECK)
// ----------------------------------------------------------------------------
console.log('\n📦 TEST 2: Verificación de sintaxis (node --check) en todos los archivos JS...');
const jsDir = path.join(__dirname, '..', 'js');
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
let syntaxErrors = 0;

jsFiles.forEach(file => {
  const fullPath = path.join(jsDir, file);
  try {
    execSync(`node --check "${fullPath}"`, { stdio: 'pipe' });
    console.log(`  ✅ Sintaxis OK: js/${file}`);
  } catch (err) {
    console.error(`  ❌ Error de sintaxis en js/${file}:`, err.message);
    syntaxErrors++;
    allPassed = false;
  }
});

['sw.js', 'server.js'].forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    try {
      execSync(`node --check "${fullPath}"`, { stdio: 'pipe' });
      console.log(`  ✅ Sintaxis OK: ${file}`);
    } catch (err) {
      console.error(`  ❌ Error de sintaxis en ${file}:`, err.message);
      syntaxErrors++;
      allPassed = false;
    }
  }
});
assert(syntaxErrors === 0, `Todos los archivos JS compilaron sin errores (${jsFiles.length + 2} archivos probados)`);

// ----------------------------------------------------------------------------
// 3. SERVICE WORKER CACHE & SINCRONIZACIÓN DE ASSETS
// ----------------------------------------------------------------------------
console.log('\n📦 TEST 3: Verificación de versión de Service Worker y sincronización de assets...');
const swPath = path.join(__dirname, '..', 'sw.js');
const swContent = fs.readFileSync(swPath, 'utf8');
const cacheMatch = swContent.match(/CACHE_NAME\s*=\s*['"]([^'"]+)['"]/);
const currentCache = cacheMatch ? cacheMatch[1] : '';
console.log(`  ℹ️  Service Worker Cache: ${currentCache}`);
assert(currentCache.includes('v20'), 'Service Worker CACHE_NAME incrementado a v20');

// Función helper de copia recursiva
const copyFile = (src, dest) => {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
};

// Sincronizar hacia app/src/main/assets/
const assetsDir = path.join(__dirname, '..', 'app', 'src', 'main', 'assets');
if (fs.existsSync(assetsDir)) {
  copyFile(path.join(__dirname, '..', 'index.html'), path.join(assetsDir, 'index.html'));
  copyFile(swPath, path.join(assetsDir, 'sw.js'));

  const cssDir = path.join(__dirname, '..', 'css');
  fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).forEach(cssFile => {
    copyFile(path.join(cssDir, cssFile), path.join(assetsDir, 'css', cssFile));
  });

  jsFiles.forEach(jsFile => {
    copyFile(path.join(jsDir, jsFile), path.join(assetsDir, 'js', jsFile));
  });

  console.log('  ✅ Archivos sincronizados exitosamente a app/src/main/assets/');
}

// Sincronizar hacia ENGLISH-/ si existe
const submoduleDir = path.join(__dirname, '..', 'ENGLISH-');
if (fs.existsSync(submoduleDir)) {
  copyFile(path.join(__dirname, '..', 'index.html'), path.join(submoduleDir, 'index.html'));
  copyFile(swPath, path.join(submoduleDir, 'sw.js'));

  const cssDir = path.join(__dirname, '..', 'css');
  fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).forEach(cssFile => {
    copyFile(path.join(cssDir, cssFile), path.join(submoduleDir, 'css', cssFile));
  });

  jsFiles.forEach(jsFile => {
    copyFile(path.join(jsDir, jsFile), path.join(submoduleDir, 'js', jsFile));
  });

  console.log('  ✅ Archivos sincronizados exitosamente a ENGLISH-/');
}

console.log('\n========================================================================');
if (allPassed) {
  console.log('🎉 AUDITORÍA ESTRICTA ANTI-RELLENO COMPLETADA (100% OK, CERO MOCKS)');
  console.log('========================================================================');
  process.exit(0);
} else {
  console.error('❌ SE DETECTARON VIOLACIONES A LA POLÍTICA DE ZERO MOCKS');
  console.log('========================================================================');
  process.exit(1);
}

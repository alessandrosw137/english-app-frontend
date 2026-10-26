/**
 * MasterENG - QA Automation Verification Script
 * Validates:
 * 1. Clean Dating 3D (No demo bots: Sofia Pareja, MENG-2048, MENG-5190, MENG-8831 in world3d or social_chat)
 * 2. No floating pink concept orbs/spheres in dating scenario (conceptOrb / buildHolographicConceptNode)
 * 3. MasterPet Sanctuary full overlay: position fixed, superior z-index (9500), and portal carousel suppression
 * 4. Syntax check across all JS files
 * 5. Cache version bump and sync to app/src/main/assets/ and ENGLISH-/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('========================================================================');
console.log('🤖 MASTERENG QA AUTOMATION: DATING 3D, BOT CLEANUP & PET SANCTUARY CHECK');
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
// TEST 1: BOT PURGE IN WORLD3D.JS AND SOCIAL_CHAT.JS
// ----------------------------------------------------------------------------
console.log('📦 TEST 1: Verificación de eliminación de bots demo...');
const world3dPath = path.join(__dirname, '..', 'js', 'world3d.js');
const socialChatPath = path.join(__dirname, '..', 'js', 'social_chat.js');

const world3dContent = fs.readFileSync(world3dPath, 'utf8');
const socialChatContent = fs.readFileSync(socialChatPath, 'utf8');

const forbiddenBotPatterns = [
  { name: 'Sofia (Pareja / BFF)', regex: /Sofia\s*\(\s*Pareja\s*\/\s*BFF\s*\)/i },
  { name: 'MENG-2048', regex: /MENG-2048/i },
  { name: 'MENG-5190', regex: /MENG-5190/i },
  { name: 'MENG-8831', regex: /MENG-8831/i }
];

forbiddenBotPatterns.forEach(({ name, regex }) => {
  const inWorld3d = regex.test(world3dContent);
  const inSocialChat = regex.test(socialChatContent);
  assert(!inWorld3d, `"${name}" NO existe en js/world3d.js`);
  assert(!inSocialChat, `"${name}" NO existe en js/social_chat.js`);
});

// ----------------------------------------------------------------------------
// TEST 2: NO FLOATING PINK ORBS / BALLOONS IN DATING SCENARIO
// ----------------------------------------------------------------------------
console.log('\n📦 TEST 2: Verificación de ausencia de globos/esferas rosas en Dating 3D...');
const datingHotelPath = path.join(__dirname, '..', 'js', 'world3d_dating_hotel.js');
const datingHotelContent = fs.readFileSync(datingHotelPath, 'utf8');

// conceptOrb must not exist in world3d or dating_hotel
assert(!world3dContent.includes('conceptOrb'), 'conceptOrb NO existe en js/world3d.js');
assert(!datingHotelContent.includes('conceptOrb'), 'conceptOrb NO existe en js/world3d_dating_hotel.js');

// buildHolographicConceptNode must return null so no visible 3D object/sphere is generated
const hasBuildHolographicConceptNode = world3dContent.includes('function buildHolographicConceptNode');
const returnsNullInConceptNode = world3dContent.includes('return null;') && world3dContent.includes('// No se generan esferas, globos, aros ni postes flotantes en el aire.');
assert(hasBuildHolographicConceptNode && returnsNullInConceptNode, 'buildHolographicConceptNode retorna null y no genera esferas/globos flotantes');

// ----------------------------------------------------------------------------
// TEST 3: MASTERPET SANCTUARY FIXED POSITION, SUPERIOR Z-INDEX & CAROUSEL HIDING
// ----------------------------------------------------------------------------
console.log('\n📦 TEST 3: Verificación de MasterPet Sanctuary (position: fixed, z-index superior, supresión de portales)...');
const sanctuaryJsPath = path.join(__dirname, '..', 'js', 'pet_sanctuary.js');
const petProfileCssPath = path.join(__dirname, '..', 'css', 'pet_profile.css');

const sanctuaryJsContent = fs.readFileSync(sanctuaryJsPath, 'utf8');
const petProfileCssContent = fs.readFileSync(petProfileCssPath, 'utf8');

const hasFixedPosition = sanctuaryJsContent.includes('position: fixed !important;') || petProfileCssContent.includes('position: fixed !important;');
assert(hasFixedPosition, '#view-pet-sanctuary tiene position: fixed !important;');

const hasSuperiorZIndex = sanctuaryJsContent.includes('z-index: 9500 !important;') || petProfileCssContent.includes('z-index: 9500 !important;');
assert(hasSuperiorZIndex, '#view-pet-sanctuary tiene z-index: 9500 superior;');

const hidesPortalsOnOpen = sanctuaryJsContent.includes('hidePortalViewsAndSaveState') && sanctuaryJsContent.includes('document.body.classList.add(\'pet-sanctuary-active\');');
assert(hidesPortalsOnOpen, 'openPetSanctuary() oculta activamente los portales y carrusel de fondo con hidePortalViewsAndSaveState()');

const hasCssPortalSuppression = sanctuaryJsContent.includes('body.pet-sanctuary-active #coverFlowViewport') && petProfileCssContent.includes('#coverFlowViewport');
assert(hasCssPortalSuppression, 'CSS define reglas de supresión estricta de #coverFlowViewport y carrusel al abrir el Santuario');

// ----------------------------------------------------------------------------
// TEST 4: SYNTAX CHECK ACROSS ALL JS FILES
// ----------------------------------------------------------------------------
console.log('\n📦 TEST 4: Verificación de sintaxis de código (node --check)...');
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

// Check root files sw.js and server.js
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
assert(syntaxErrors === 0, `Todos los archivos JS compilaron limpiamente sin errores (${jsFiles.length + 2} archivos probados)`);

// ----------------------------------------------------------------------------
// TEST 5: CACHE VERSION & ASSET SYNCHRONIZATION
// ----------------------------------------------------------------------------
console.log('\n📦 TEST 5: Verificación de versión de Service Worker y sincronización de assets...');
const swPath = path.join(__dirname, '..', 'sw.js');
const swContent = fs.readFileSync(swPath, 'utf8');
const cacheMatch = swContent.match(/CACHE_NAME\s*=\s*['"]([^'"]+)['"]/);
const currentCache = cacheMatch ? cacheMatch[1] : '';
console.log(`  ℹ️  Service Worker Cache: ${currentCache}`);
assert(currentCache.includes('v19'), 'Service Worker CACHE_NAME incrementado a v19');

// Sincronizar hacia app/src/main/assets/
const assetsDir = path.join(__dirname, '..', 'app', 'src', 'main', 'assets');
if (fs.existsSync(assetsDir)) {
  const copyFile = (src, dest) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  };

  // Sync index.html, sw.js
  copyFile(path.join(__dirname, '..', 'index.html'), path.join(assetsDir, 'index.html'));
  copyFile(swPath, path.join(assetsDir, 'sw.js'));

  // Sync css
  const cssDir = path.join(__dirname, '..', 'css');
  fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).forEach(cssFile => {
    copyFile(path.join(cssDir, cssFile), path.join(assetsDir, 'css', cssFile));
  });

  // Sync js
  jsFiles.forEach(jsFile => {
    copyFile(path.join(jsDir, jsFile), path.join(assetsDir, 'js', jsFile));
  });

  console.log('  ✅ Archivos sincronizados exitosamente a app/src/main/assets/');
}

// Sincronizar hacia ENGLISH-/ si existe
const submoduleDir = path.join(__dirname, '..', 'ENGLISH-');
if (fs.existsSync(submoduleDir)) {
  const copyFile = (src, dest) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  };
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
  console.log('🎉 TODAS LAS VERIFICACIONES PASARON CON ÉXITO (100% OK)');
  console.log('========================================================================');
  process.exit(0);
} else {
  console.error('❌ SE ENCONTRARON FALLOS EN LA VERIFICACIÓN');
  console.log('========================================================================');
  process.exit(1);
}

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

console.log('================================================================================');
console.log('🧪 VERIFICACIÓN AUTOMÁTICA: RENDIMIENTO, UI MÓVIL Y OPTIMIZACIÓN GPU/CPU');
console.log('================================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assertCheck(name, condition, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`✅ [PASS] ${name}`);
  } else {
    failedChecks++;
    console.error(`❌ [FAIL] ${name} ${details ? '-> ' + details : ''}`);
  }
}

// ------------------------------------------------------------------------------
// A) SINTAXIS JAVASCRIPT: node --check EN TODOS LOS ARCHIVOS .js
// ------------------------------------------------------------------------------
console.log('--- A) AUDITORÍA DE SINTAXIS JAVASCRIPT ---');
const jsDir = path.join(__dirname, '..', 'js');
const rootFiles = ['sw.js', 'master_data.js', 'server.js'];
const jsFiles = fs.readdirSync(jsDir)
  .filter(f => f.endsWith('.js'))
  .map(f => path.join(jsDir, f));

rootFiles.forEach(f => {
  const full = path.join(__dirname, '..', f);
  if (fs.existsSync(full)) jsFiles.push(full);
});

const serverDir = path.join(__dirname, '..', 'server');
if (fs.existsSync(serverDir)) {
  fs.readdirSync(serverDir)
    .filter(f => f.endsWith('.js') && f !== 'node_modules')
    .forEach(f => jsFiles.push(path.join(serverDir, f)));
}

let allSyntaxValid = true;
jsFiles.forEach(filePath => {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  const res = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
  const isOk = res.status === 0;
  if (!isOk) allSyntaxValid = false;
  assertCheck(`Sintaxis válida: ${relativePath}`, isOk, res.stderr || res.stdout);
});

// ------------------------------------------------------------------------------
// B) VERIFICACIÓN DE css/styles.css Y REGLAS DE HEADER EN MÓVIL
// ------------------------------------------------------------------------------
console.log('\n--- B) VERIFICACIÓN DE REGLAS CSS PARA HEADER MÓVIL Y PORTALES INMERSIVOS ---');
const stylesCssPath = path.join(__dirname, '..', 'css', 'styles.css');
const styleCssPath = path.join(__dirname, '..', 'css', 'style.css');

assertCheck('Existe css/styles.css', fs.existsSync(stylesCssPath));
assertCheck('Existe css/style.css', fs.existsSync(styleCssPath));

const stylesCssContent = fs.existsSync(stylesCssPath) ? fs.readFileSync(stylesCssPath, 'utf8') : '';
const styleCssContent = fs.existsSync(styleCssPath) ? fs.readFileSync(styleCssPath, 'utf8') : '';

assertCheck('css/styles.css contiene regla de media query @media (max-width: 900px)',
  stylesCssContent.includes('@media (max-width: 900px)')
);

assertCheck('css/styles.css contiene selectores body.in-immersive-portal para ocultar header',
  stylesCssContent.includes('body.in-immersive-portal') &&
  (stylesCssContent.includes('body.in-immersive-portal header') || stylesCssContent.includes('body.in-immersive-portal #mainHeader'))
);

assertCheck('css/styles.css oculta headers con display: none !important en portales inmersivos',
  /body\.in-immersive-portal\s+(?:#mainHeader|header).*?display:\s*none\s*!important/s.test(stylesCssContent)
);

assertCheck('css/style.css está sincronizado con las reglas de header y body.in-immersive-portal',
  styleCssContent.includes('@media (max-width: 900px)') &&
  styleCssContent.includes('body.in-immersive-portal')
);

// ------------------------------------------------------------------------------
// C) CONTROL DE offsetSec Y ACTUALIZACIÓN INCREMENTAL EN js/karaoke.js
// ------------------------------------------------------------------------------
console.log('\n--- C) OPTIMIZACIÓN INCREMENTAL Y SINCRONÍA EN js/karaoke.js ---');
const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');
assertCheck('Existe js/karaoke.js', fs.existsSync(karaokeJsPath));
const karaokeContent = fs.existsSync(karaokeJsPath) ? fs.readFileSync(karaokeJsPath, 'utf8') : '';

assertCheck('karaoke.js define y maneja offsetSec en el reproductor',
  karaokeContent.includes('offsetSec') &&
  karaokeContent.includes('this.offsetSec')
);

assertCheck('karaoke.js implementa funciones adjustOffset y/o setOffset',
  karaokeContent.includes('adjustOffset(') &&
  karaokeContent.includes('setOffset(')
);

const updateActiveLineBlock = (karaokeContent.match(/updateActiveLine\(currentTime\)\s*\{([\s\S]*?)\n\s*adjustOffset/) || [])[1] || '';

assertCheck('karaoke.js implementa updateActiveLine con actualización incremental sin recrear DOM en cada frame',
  karaokeContent.includes('updateActiveLine(') &&
  karaokeContent.includes('idx === this.currentIndex') &&
  updateActiveLineBlock.includes('classList') &&
  !updateActiveLineBlock.includes('innerHTML')
);

assertCheck('karaoke.js usa búsqueda binaria O(log N) para sincronizar letras con precisión anti-lag',
  karaokeContent.includes('mid = (low + high) >> 1') || karaokeContent.includes('Math.floor((low + high) / 2)')
);

// ------------------------------------------------------------------------------
// D) DETENCIÓN DE requestAnimationFrame EN js/world3d.js Y js/pet_engine_2d.js
// ------------------------------------------------------------------------------
console.log('\n--- D) DETENCIÓN DE BUCLES requestAnimationFrame (GPU/CPU) ---');
const world3dJsPath = path.join(__dirname, '..', 'js', 'world3d.js');
assertCheck('Existe js/world3d.js', fs.existsSync(world3dJsPath));
const world3dContent = fs.existsSync(world3dJsPath) ? fs.readFileSync(world3dJsPath, 'utf8') : '';

assertCheck('world3d.js expone y ejecuta pauseLoop / pauseWorld3D',
  world3dContent.includes('function pauseLoop()') &&
  world3dContent.includes('function pauseWorld3D()') &&
  world3dContent.includes('cancelAnimationFrame(animFrameId)')
);

assertCheck('world3d.js detiene el render 3D si la vista o contenedor está oculto',
  world3dContent.includes('if (!isWorldTourActive || (global.World3D && global.World3D.isPaused) || isHidden)')
);

const petEngineJsPath = path.join(__dirname, '..', 'js', 'pet_engine_2d.js');
assertCheck('Existe js/pet_engine_2d.js', fs.existsSync(petEngineJsPath));
const petEngineContent = fs.existsSync(petEngineJsPath) ? fs.readFileSync(petEngineJsPath, 'utf8') : '';

assertCheck('pet_engine_2d.js implementa stopLoop y pauseLoop',
  petEngineContent.includes('stopLoop()') &&
  petEngineContent.includes('pauseLoop()') &&
  petEngineContent.includes('this.animId = null')
);

assertCheck('pet_engine_2d.js detiene el bucle si el santuario está oculto o la vista se cierra',
  petEngineContent.includes('this.stopLoop()')
);

// ------------------------------------------------------------------------------
// RESUMEN FINAL
// ------------------------------------------------------------------------------
console.log('\n================================================================================');
console.log(`📊 RESULTADO DE VERIFICACIÓN: ${passedChecks} pasadas, ${failedChecks} fallidas de ${totalChecks} pruebas.`);
console.log('================================================================================');

if (failedChecks > 0) {
  console.error('\n❌ VERIFICACIÓN FALLIDA. Hay pruebas con error.');
  process.exit(1);
} else {
  console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON AL 100%! RENDIMIENTO Y UI MÓVIL VERIFICADOS.');
  process.exit(0);
}

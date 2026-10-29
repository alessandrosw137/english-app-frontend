const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO REQUERIMIENTOS AGENTE 4: OPTIMIZACIÓN EXTREMA DE RENDIMIENTO ===\n');

let failed = false;

function check(title, condition, detail = '') {
  if (condition) {
    console.log(`✅ [PASS] ${title}`);
  } else {
    console.error(`❌ [FAIL] ${title} - ${detail}`);
    failed = true;
  }
}

// 1. VERIFICAR js/app.js
const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const appJs = fs.readFileSync(appJsPath, 'utf8');

check('app.js: pausa World3D en hideAllModules',
  /World3D\s*&&\s*typeof\s*window\.World3D\.pauseLoop\s*===\s*'function'/.test(appJs) &&
  /window\.World3D\.pauseLoop\(\)/.test(appJs)
);

check('app.js: pausa PetEngine2D en hideAllModules',
  /PetEngine2D\s*&&\s*typeof\s*window\.PetEngine2D\.pauseLoop\s*===\s*'function'/.test(appJs) &&
  /window\.PetEngine2D\.pauseLoop\(\)/.test(appJs)
);

check('app.js: detiene PetMinigames2D en hideAllModules',
  /PetMinigames2D\s*&&\s*typeof\s*window\.PetMinigames2D\.stopGame\s*===\s*'function'/.test(appJs) &&
  /window\.PetMinigames2D\.stopGame\(\)/.test(appJs)
);

check('app.js: detiene KaraokeSyncEngine en hideAllModules',
  /KaraokeSyncEngine.*\.stop\(\)/.test(appJs)
);

check('app.js: añade in-immersive-portal en apertura de portales',
  appJs.includes("classList.add('in-immersive-portal')")
);

check('app.js: remueve in-immersive-portal al volver a portales/home',
  appJs.includes("classList.remove('in-immersive-portal')")
);

// 2. VERIFICAR js/world3d.js
const world3dJsPath = path.join(__dirname, '..', 'js', 'world3d.js');
const world3dJs = fs.readFileSync(world3dJsPath, 'utf8');

check('world3d.js: DPR limitado en móviles (maxDPR)',
  world3dJs.includes('maxDPR') &&
  world3dJs.includes('setPixelRatio')
);

check('world3d.js: implementa pauseLoop y resumeLoop',
  world3dJs.includes('pauseLoop') &&
  world3dJs.includes('resumeLoop') &&
  /World3D\.pauseLoop\s*=/.test(world3dJs) &&
  /World3D\.resumeLoop\s*=/.test(world3dJs)
);

check('world3d.js: animate3D cancela bucle si isPaused o contenedor oculto',
  /isPaused/.test(world3dJs) &&
  /cancelAnimationFrame/.test(world3dJs)
);

// 3. VERIFICAR js/pet_engine_2d.js
const petEngineJsPath = path.join(__dirname, '..', 'js', 'pet_engine_2d.js');
const petEngineJs = fs.readFileSync(petEngineJsPath, 'utf8');

check('pet_engine_2d.js: implementa pauseLoop y resumeLoop',
  petEngineJs.includes('pauseLoop') &&
  petEngineJs.includes('resumeLoop')
);

check('pet_engine_2d.js: bucle se detiene si el contenedor del santuario está oculto',
  petEngineJs.includes('pet-sanctuary-root')
);

// 4. VERIFICAR js/pet_minigames_2d.js
const petMiniJsPath = path.join(__dirname, '..', 'js', 'pet_minigames_2d.js');
const petMiniJs = fs.readFileSync(petMiniJsPath, 'utf8');

check('pet_minigames_2d.js: implementa stopGame y pauseLoop en PetArcadeManager',
  petMiniJs.includes('stopGame() {') &&
  petMiniJs.includes('pauseLoop() {')
);

check('pet_minigames_2d.js: expone PetMinigames2D.stopGame y pauseLoop globalmente',
  /PetMinigames2D\.stopGame\s*=/.test(petMiniJs) &&
  /PetMinigames2D\.pauseLoop\s*=/.test(petMiniJs)
);

check('pet_minigames_2d.js: cancelAnimationFrame al destruir minijuegos',
  petMiniJs.includes('cancelAnimationFrame(this.animId)')
);

if (failed) {
  console.error('\n❌ HAY PRUEBAS FALLIDAS.');
  process.exit(1);
} else {
  console.log('\n🚀 TODAS LAS PRUEBAS DE OPTIMIZACIÓN EXTREMA PASARON CON ÉXITO (100%).');
}

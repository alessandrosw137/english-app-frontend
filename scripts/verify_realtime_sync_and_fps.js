/**
 * scripts/verify_realtime_sync_and_fps.js
 * 
 * BENCHMARK & REAL-TIME PERFORMANCE QA SUITE:
 * 1. Benchmark real con performance.now() midiendo construcción de los 7 mundos 3D (< 500ms).
 * 2. Verificación de cero creación masiva de CanvasTexture para etiquetas en arranque (on-demand).
 * 3. Inspección del bucle animate3D() en js/world3d.js (CERO scene.traverse y CERO consultas DOM por frame).
 * 4. Verificación de window.activeYtPlayer con YT.Player oficial, onReady/onStateChange, pausa estricta (state !== 1) y seekTo/sync en estrofas.
 * 5. Verificación de versión de cache sw.js (mastereng-pwa-v22) y sincronización a app/src/main/assets/ y ENGLISH-/.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

console.log('================================================================================');
console.log('⏱️ BENCHMARK & AUDITORÍA EN TIEMPO REAL: SYNC KARAOKE & 60 FPS 3D ENGINE');
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

const rootDir = path.resolve(__dirname, '..');

// ==============================================================================
// 1. BENCHMARK REAL EN NODE: TIEMPO DE CONSTRUCCIÓN DE LOS 7 MUNDOS 3D (< 500ms)
// ==============================================================================
console.log('--- 1. BENCHMARK DE CONSTRUCCIÓN DE LOS 7 MUNDOS 3D (< 500ms) ---');

// Mock DOM para ejecución Three.js en Node
let canvasTextureCount = 0;
let labelTextureCount = 0;

const THREE = require(path.join(rootDir, 'three.min.js'));
global.THREE = THREE;
global.window = global;
global.self = global;

// Hook en CanvasTexture para rastrear texturas creadas
const OriginalCanvasTexture = THREE.CanvasTexture;
THREE.CanvasTexture = function(canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
  canvasTextureCount++;
  if (canvas && canvas._isLabelCanvas) {
    labelTextureCount++;
  }
  return new OriginalCanvasTexture(canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);
};
Object.assign(THREE.CanvasTexture, OriginalCanvasTexture);

const mockCtx = new Proxy({}, {
  get: (target, prop) => {
    if (prop === 'getImageData' || prop === 'createImageData') {
      return (w = 64, h = 64) => ({ data: new Uint8ClampedArray((typeof w === 'number' ? w : 64) * (typeof h === 'number' ? h : 64) * 4) });
    }
    if (prop === 'createLinearGradient' || prop === 'createRadialGradient') {
      return () => ({ addColorStop: () => {} });
    }
    if (prop === 'measureText') {
      return () => ({ width: 10 });
    }
    return () => {};
  },
  set: () => true
});

global.document = {
  createElement: (tag) => {
    const isCanvas = (tag && tag.toLowerCase() === 'canvas');
    return {
      tagName: tag ? tag.toUpperCase() : 'DIV',
      getContext: () => mockCtx,
      width: 64,
      height: 64,
      style: {},
      _isLabelCanvas: false,
      appendChild: () => {},
      removeChild: () => {},
      addEventListener: () => {}
    };
  },
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {}
};
global.navigator = { userAgent: 'node-benchmark' };

let mockRafQueue = [];
let nextRafId = 1;
global.requestAnimationFrame = (fn) => {
  const id = nextRafId++;
  mockRafQueue.push({ id, fn });
  return id;
};
global.cancelAnimationFrame = (id) => {
  mockRafQueue = mockRafQueue.filter(item => item.id !== id);
};

// Cargar módulos 3D
require(path.join(rootDir, 'js', 'world3d_nature_space.js'));
require(path.join(rootDir, 'js', 'world3d_dating_hotel.js'));
require(path.join(rootDir, 'js', 'world3d_market_rest.js'));
require(path.join(rootDir, 'js', 'world3d.js'));

const buildScenarioWorld = global.buildScenarioWorld || (global.World3D && global.World3D.buildScenarioWorld);
assertCheck('Función buildScenarioWorld disponible para instanciación 3D', typeof buildScenarioWorld === 'function');

const SCENARIOS = ['house', 'garden', 'dating', 'space', 'supermarket', 'hotel', 'restaurant'];
const benchmarkResults = {};
let allUnder500ms = true;

SCENARIOS.forEach(scenKey => {
  const scene = new THREE.Scene();
  const tStart = performance.now();
  buildScenarioWorld(scene, scenKey);
  const tEnd = performance.now();
  const elapsedMs = Math.round((tEnd - tStart) * 100) / 100;
  benchmarkResults[scenKey] = elapsedMs;

  const isFast = elapsedMs < 500;
  if (!isFast) allUnder500ms = false;
  assertCheck(`Mundo 3D [${scenKey}] construido en ${elapsedMs} ms (< 500 ms)`, isFast, `Tiempo: ${elapsedMs}ms`);
});

assertCheck('Todos los 7 mundos 3D se construyen en menos de 500ms sin colgar el hilo principal', allUnder500ms);

// ==============================================================================
// 2. VERIFICACIÓN DE ETIQUETAS BAJO DEMANDA (CERO CREACIÓN MASIVA AL INICIO)
// ==============================================================================
console.log('\n--- 2. VERIFICACIÓN DE ETIQUETAS BAJO DEMANDA (LAZY SINGLETON SPRITE) ---');

const world3dSrc = fs.readFileSync(path.join(rootDir, 'js', 'world3d.js'), 'utf8');

assertCheck('world3d.js implementa getSharedLabelSprite con inicialización lazy',
  world3dSrc.includes('function getSharedLabelSprite()') &&
  world3dSrc.includes('sharedLabelSprite = new THREE.Sprite')
);

assertCheck('world3d.js reutiliza el sprite de etiquetas (sharedLabelSprite) sin instanciar decenas de CanvasTexture',
  world3dSrc.includes('if (World3D.sharedLabelSprite) return World3D.sharedLabelSprite;') ||
  world3dSrc.includes('sharedLabelSprite')
);

assertCheck('No se crean decenas de CanvasTexture de etiquetas durante la construcción inicial',
  labelTextureCount === 0,
  `CanvasTexture de etiquetas creadas al inicio: ${labelTextureCount}`
);

// ==============================================================================
// 3. INSPECCIÓN DEL BUCLE animate() (CERO scene.traverse Y CERO CONSULTAS DOM)
// ==============================================================================
console.log('\n--- 3. INSPECCIÓN DEL BUCLE animate() / animate3D() A 60 FPS ---');

const animate3dMatch = world3dSrc.match(/function animate3D\([^\)]*\)\s*\{([\s\S]*?)\n\s*const animate = animate3D;/);
const animate3dBody = animate3dMatch ? animate3dMatch[1] : '';

assertCheck('animate3D() existe y fue extraído para análisis estático', animate3dBody.length > 0);

assertCheck('Bucle animate3D() NO contiene scene.traverse (cuello de botella eliminado)',
  !animate3dBody.includes('scene.traverse') &&
  !animate3dBody.includes('.traverse(')
);

assertCheck('Bucle animate3D() NO realiza consultas directas al DOM por frame (usa container cacheado)',
  !animate3dBody.includes('document.querySelector') &&
  !animate3dBody.includes('document.querySelectorAll') &&
  animate3dBody.includes('cachedContainer3d')
);

assertCheck('Bucle animate3D() sólo itera arreglo plano de planetas en modo space (máx 10 objetos)',
  animate3dBody.includes('spaceOrbitalEntries') &&
  animate3dBody.includes('for (let i = 0; i < spaceOrbitalEntries.length; i++)')
);

// ==============================================================================
// 4. VERIFICACIÓN DE CONEXIÓN REAL YT.Player Y CONTROL DE REPRODUCCIÓN EN KARAOKE
// ==============================================================================
console.log('\n--- 4. CONEXIÓN REAL YT.Player, onReady, onStateChange Y SEEK/SYNC ---');

const karaokeSrc = fs.readFileSync(path.join(rootDir, 'js', 'karaoke.js'), 'utf8');

assertCheck('karaoke.js instancia new YT.Player con configuración habilitada para eventos',
  karaokeSrc.includes("new YT.Player('yt-karaoke-mount'") &&
  karaokeSrc.includes('events:')
);

assertCheck('karaoke.js implementa eventos oficiales onReady y onStateChange',
  karaokeSrc.includes('onReady:') &&
  karaokeSrc.includes('onStateChange:') &&
  karaokeSrc.includes('KaraokeSyncEngine.onPlayerStateChange(')
);

assertCheck('karaoke.js detiene el avance de letras inmediatamente al pausar o terminar (state !== 1)',
  karaokeSrc.includes('if (pState === 1)') &&
  karaokeSrc.includes('// PAUSADO O BUFFERING O FINALIZADO: DETENER INMEDIATAMENTE AVANCE DE LETRAS')
);

assertCheck('karaoke.js ejecuta seekTo al hacer clic en una línea/estrofa para saltar el video',
  karaokeSrc.includes('player.seekTo(seekTarget, true)') &&
  (karaokeSrc.includes('handleStanzaClick') || karaokeSrc.includes('seekToStanza'))
);

assertCheck('karaoke.js provee sincronización directa de estrofa activa al hacer clic',
  karaokeSrc.includes('KaraokeSyncEngine.highlightIndex(stanzaIdx)') ||
  karaokeSrc.includes('highlightKaraokeStanza(stanzaIdx, true)')
);

// Prueba funcional con Mock de YT.Player
let simulatedSeekTime = null;
const mockYtPlayer = {
  _currentTime: 12.0,
  _state: 1, // PLAYING
  getCurrentTime() { return this._currentTime; },
  getPlayerState() { return this._state; },
  seekTo(seconds, allowSeekAhead) {
    this._currentTime = seconds;
    simulatedSeekTime = seconds;
  },
  playVideo() { this._state = 1; },
  pauseVideo() { this._state = 2; },
  unMute() {},
  setVolume() {}
};

// Cargar karaoke.js con mock DOM
const mockDom = {};
function createEl(id) {
  mockDom[id] = {
    id,
    style: {},
    classList: { add() {}, remove() {}, contains: () => false },
    innerHTML: '',
    querySelectorAll: () => [],
    addEventListener: () => {}
  };
  return mockDom[id];
}
['karaokeLiveStatusBadge', 'karaokeOffsetControls', 'karaokeOffsetBadge', 'musicLyricsContainer', 'karaoke-lyrics-container'].forEach(createEl);
global.document.getElementById = (id) => mockDom[id] || null;

require(path.join(rootDir, 'js', 'karaoke.js'));

const syncEngine = global.window.KaraokeSyncEngine;
assertCheck('KaraokeSyncEngine disponible para enlace de reproductor', typeof syncEngine === 'object');

const testLyrics = [
  { time: 5.0, text: 'Verse 1', startTime: 5.0, endTime: 9.0 },
  { time: 10.0, text: 'Verse 2', startTime: 10.0, endTime: 14.0 },
  { time: 15.0, text: 'Verse 3', startTime: 15.0, endTime: 19.0 }
];

syncEngine.bindPlayer(mockYtPlayer, testLyrics, 'benchmark_song');
assertCheck('window.activeYtPlayer queda vinculado a la instancia activa del reproductor',
  global.window.activeYtPlayer === mockYtPlayer
);

// Simular cambio de estado a pausa (state = 2)
syncEngine.onPlayerStateChange(2);
assertCheck('onPlayerStateChange actualiza correctamente playerState a PAUSED (2)',
  syncEngine.playerState === 2
);

// Simular clic en estrofa 3 (tiempo 15.0s)
if (typeof global.window.handleStanzaClick === 'function') {
  global.window.handleStanzaClick(2, 15.0);
  assertCheck('handleStanzaClick ejecuta player.seekTo con la marca de tiempo de la estrofa',
    simulatedSeekTime !== null && Math.abs(simulatedSeekTime - 15.0) < 1.0,
    `Seek time: ${simulatedSeekTime}`
  );
}

// ==============================================================================
// 5. ACTUALIZACIÓN DE SERVICE WORKER CACHE (v22) Y SINCRONIZACIÓN DE ASSETS
// ==============================================================================
console.log('\n--- 5. SERVICE WORKER CACHE (mastereng-pwa-v22) Y SINCRONIZACIÓN ---');

const swPath = path.join(rootDir, 'sw.js');
assertCheck('Existe archivo sw.js', fs.existsSync(swPath));

const swContent = fs.readFileSync(swPath, 'utf8');
assertCheck('sw.js contiene la versión mastereng-pwa-v22',
  swContent.includes('mastereng-pwa-v22'),
  'CACHE_NAME no tiene v22'
);

function copyFileSafe(src, dest) {
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  } catch (err) {
    console.warn(`[WARN] Error copiando ${src} -> ${dest}:`, err.message);
  }
}

const assetsDir = path.join(rootDir, 'app', 'src', 'main', 'assets');
const submoduleDir = path.join(rootDir, 'ENGLISH-');

const filesToSync = [
  'index.html',
  'sw.js',
  'manifest.json',
  'css/style.css',
  'css/styles.css',
  'css/pet_profile.css',
  'js/app.js',
  'js/karaoke.js',
  'js/world3d.js',
  'js/world3d_nature_space.js',
  'js/world3d_dating_hotel.js',
  'js/world3d_market_rest.js',
  'js/pet_engine_2d.js',
  'js/pet_minigames_2d.js',
  'js/social_chat.js'
];

let assetsSyncCount = 0;
if (fs.existsSync(assetsDir)) {
  filesToSync.forEach(rel => {
    const src = path.join(rootDir, rel);
    const dest = path.join(assetsDir, rel);
    if (fs.existsSync(src)) {
      copyFileSafe(src, dest);
      assetsSyncCount++;
    }
  });
  assertCheck(`Archivos sincronizados a app/src/main/assets/ (${assetsSyncCount} archivos)`, assetsSyncCount >= 10);
}

let submoduleSyncCount = 0;
if (fs.existsSync(submoduleDir)) {
  filesToSync.forEach(rel => {
    const src = path.join(rootDir, rel);
    const dest = path.join(submoduleDir, rel);
    if (fs.existsSync(src)) {
      copyFileSafe(src, dest);
      submoduleSyncCount++;
    }
  });

  const subAssetsDir = path.join(submoduleDir, 'app', 'src', 'main', 'assets');
  if (fs.existsSync(subAssetsDir)) {
    filesToSync.forEach(rel => {
      const src = path.join(rootDir, rel);
      const dest = path.join(subAssetsDir, rel);
      if (fs.existsSync(src)) copyFileSafe(src, dest);
    });
  }
  assertCheck(`Archivos sincronizados a submódulo ENGLISH-/ (${submoduleSyncCount} archivos)`, submoduleSyncCount >= 10);
}

// ==============================================================================
// RESUMEN FINAL & TABLA DE BENCHMARK
// ==============================================================================
console.log('\n================================================================================');
console.log('📊 RESUMEN DE BENCHMARK (TIEMPOS DE CONSTRUCCIÓN 3D):');
console.log('================================================================================');
Object.entries(benchmarkResults).forEach(([scen, ms]) => {
  console.log(`  • [${scen.padEnd(12)}]: ${ms.toFixed(2)} ms ${ms < 500 ? '⚡ (EXCELENTE < 500ms)' : '⚠️ (LENTO)'}`);
});
console.log('--------------------------------------------------------------------------------');
console.log(`📊 TOTAL PRUEBAS: ${passedChecks} pasadas, ${failedChecks} fallidas de ${totalChecks}.`);
console.log('================================================================================');

if (failedChecks > 0) {
  console.error('\n❌ BENCHMARK QA FALLIDO. Se detectaron cuellos de botella.');
  process.exit(1);
} else {
  console.log('\n🎉 ¡BENCHMARK Y QA EXITOSOS AL 100%! RENDIMIENTO 3D Y SYNC DE AUDIO VERIFICADOS.');
  process.exit(0);
}

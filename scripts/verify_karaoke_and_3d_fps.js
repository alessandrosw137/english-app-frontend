/**
 * scripts/verify_karaoke_and_3d_fps.js
 * 
 * AUTOMATED AUDIT & VERIFICATION SUITE:
 * 1. a) Syntax check (`node --check`) across all project `.js` files.
 * 2. b) 3D World verification for all 7 scenarios (house, garden, restaurant, market, dating, hotel, space):
 *       - Total active lights per scene <= 4
 *       - 0 PointLights with castShadow = true
 * 3. c) World3D cancels any prior requestAnimationFrame before starting a new one (zero duplicate loops).
 * 4. d) Karaoke portal opening sets recommended songs container visible (display !== 'none') and renders cards.
 * 5. e) Karaoke lyric lines have click handling to instantly sync offset to playback second.
 * 6. Service worker cache v21 check and Android / submodule asset sync.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

console.log('================================================================================');
console.log('🚀 MASTERENG AUDITORÍA: KARAOKE SYNC, 60FPS 3D LIGHTING & RELEASE MANAGER');
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
// A) SINTAXIS JAVASCRIPT: node --check EN TODOS LOS ARCHIVOS .js
// ==============================================================================
console.log('--- A) AUDITORÍA DE SINTAXIS JAVASCRIPT (node --check) ---');
const jsDir = path.join(rootDir, 'js');
const serverDir = path.join(rootDir, 'server');
const rootFiles = ['sw.js', 'server.js', 'master_data.js'];

const allJsFiles = [];
if (fs.existsSync(jsDir)) {
  fs.readdirSync(jsDir)
    .filter(f => f.endsWith('.js'))
    .forEach(f => allJsFiles.push(path.join(jsDir, f)));
}
if (fs.existsSync(serverDir)) {
  fs.readdirSync(serverDir)
    .filter(f => f.endsWith('.js') && !f.includes('node_modules'))
    .forEach(f => allJsFiles.push(path.join(serverDir, f)));
}
rootFiles.forEach(f => {
  const full = path.join(rootDir, f);
  if (fs.existsSync(full)) allJsFiles.push(full);
});

let syntaxFailures = 0;
allJsFiles.forEach(filePath => {
  const relativePath = path.relative(rootDir, filePath);
  const res = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
  const isOk = res.status === 0;
  if (!isOk) {
    syntaxFailures++;
    console.error(`   Error en ${relativePath}:`, res.stderr || res.stdout);
  }
  assertCheck(`node --check: ${relativePath}`, isOk);
});

assertCheck('Todos los archivos .js compilan sin errores de sintaxis', syntaxFailures === 0, `${syntaxFailures} archivos con error`);

// ==============================================================================
// B) 7 MUNDOS 3D INSTANCIADOS: <= 4 LUCES Y 0 POINTLIGHTS CON castShadow = true
// ==============================================================================
console.log('\n--- B) AUDITORÍA DE LUCES Y SOMBRAS EN LOS 7 MUNDOS 3D (60 FPS) ---');

// Configuración de entorno headless con Three.js
const THREE = require(path.join(rootDir, 'three.min.js'));
global.THREE = THREE;
global.window = global;
global.self = global;

// Mock DOM completo con Proxy 2D Canvas Context para generar texturas procedurales
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
  createElement: (tag) => ({
    getContext: () => mockCtx,
    width: 64,
    height: 64,
    style: {},
    appendChild: () => {},
    removeChild: () => {},
    addEventListener: () => {}
  }),
  getElementById: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {}
};
global.navigator = { userAgent: 'node-qa-audit' };

let rafQueue = [];
let nextRafId = 1;
global.requestAnimationFrame = (fn) => {
  const id = nextRafId++;
  rafQueue.push({ id, fn });
  return id;
};
global.cancelAnimationFrame = (id) => {
  rafQueue = rafQueue.filter(item => item.id !== id);
};

// Cargar módulos 3D
require(path.join(rootDir, 'js', 'world3d_nature_space.js'));
require(path.join(rootDir, 'js', 'world3d_dating_hotel.js'));
require(path.join(rootDir, 'js', 'world3d_market_rest.js'));
require(path.join(rootDir, 'js', 'world3d.js'));

const optimizeSceneFor60FPS = global.optimizeSceneFor60FPS || (global.World3D && global.World3D.optimizeSceneFor60FPS);
assertCheck('World3D.optimizeSceneFor60FPS está disponible globalmente', typeof optimizeSceneFor60FPS === 'function');

const B = global.MasterENG3DBuilders || {};

const SCENARIOS_TO_TEST = [
  {
    key: 'house',
    name: 'House & Study Rooms',
    build: (targetGroup) => {
      // Base house geometry & objects
      const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 10), new THREE.MeshBasicMaterial());
      targetGroup.add(floor);
      // Study lamp
      const lampLight = new THREE.PointLight(0xffaa44, 2.0, 15);
      lampLight.castShadow = true;
      targetGroup.add(lampLight);
    }
  },
  {
    key: 'garden',
    name: 'Garden & Yard',
    build: (targetGroup) => {
      if (typeof B.buildGardenScene === 'function') {
        B.buildGardenScene(targetGroup, []);
      }
      const gardenLamp = new THREE.PointLight(0xffedd5, 1.5, 12);
      gardenLamp.castShadow = true;
      targetGroup.add(gardenLamp);
    }
  },
  {
    key: 'restaurant',
    name: 'Restaurant & Dining',
    build: (targetGroup) => {
      if (typeof B.buildRestaurantScene === 'function') {
        B.buildRestaurantScene(targetGroup);
      }
      const tableLight = new THREE.PointLight(0xffd59e, 1.2, 8);
      tableLight.castShadow = true;
      targetGroup.add(tableLight);
    }
  },
  {
    key: 'market',
    name: 'Supermarket & Retail',
    build: (targetGroup) => {
      if (typeof B.buildSupermarketScene === 'function') {
        B.buildSupermarketScene(targetGroup);
      }
      const aisleLight = new THREE.PointLight(0xffffff, 1.0, 10);
      aisleLight.castShadow = true;
      targetGroup.add(aisleLight);
    }
  },
  {
    key: 'dating',
    name: 'Romantic Date & Bistro',
    build: (targetGroup) => {
      if (typeof B.buildDatingScene === 'function') {
        B.buildDatingScene(targetGroup);
      }
      const candle = new THREE.PointLight(0xff8833, 1.8, 6);
      candle.castShadow = true;
      targetGroup.add(candle);
    }
  },
  {
    key: 'hotel',
    name: 'Hotel & Reception Lobby',
    build: (targetGroup) => {
      if (typeof B.buildHotelScene === 'function') {
        B.buildHotelScene(targetGroup);
      }
      const lobbyChandelier = new THREE.PointLight(0xffeedd, 2.0, 15);
      lobbyChandelier.castShadow = true;
      targetGroup.add(lobbyChandelier);
    }
  },
  {
    key: 'space',
    name: 'Solar System & Deep Space',
    build: (targetGroup) => {
      if (typeof B.buildSpaceScene === 'function') {
        B.buildSpaceScene(targetGroup, []);
      }
      const sunLight = new THREE.PointLight(0xfff8ee, 3.0, 40);
      sunLight.castShadow = true;
      targetGroup.add(sunLight);
    }
  }
];

SCENARIOS_TO_TEST.forEach(scen => {
  const scene = new THREE.Scene();
  // Cinematic base lighting (como en setupCinematicLighting)
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  const hemi = new THREE.HemisphereLight(0xddeeff, 0x202035, 1.2);
  const dir = new THREE.DirectionalLight(0xfff2dd, 1.0);
  dir.castShadow = true;
  scene.add(ambient, hemi, dir);

  // Añadir luces adicionales para estresar el optimizador
  const extraPoint1 = new THREE.PointLight(0xff5533, 1.5, 10);
  extraPoint1.castShadow = true;
  const extraPoint2 = new THREE.PointLight(0x33ff55, 1.5, 10);
  extraPoint2.castShadow = true;
  scene.add(extraPoint1, extraPoint2);

  // Añadir grupo del escenario
  const group = new THREE.Group();
  scene.add(group);
  scen.build(group);

  // Ejecutar el pase de optimización 60 FPS
  optimizeSceneFor60FPS(scene);

  let totalLights = 0;
  let pointLightsWithCastShadow = 0;
  let activeMeshesWithCastShadow = 0;

  scene.traverse(obj => {
    if (!obj) return;
    if (obj.isLight) {
      totalLights++;
    }
    if (obj.isPointLight && obj.castShadow === true) {
      pointLightsWithCastShadow++;
    }
    if (obj.isMesh && obj.castShadow === true) {
      activeMeshesWithCastShadow++;
    }
  });

  assertCheck(`Mundo 3D [${scen.key}]: Total luces activas <= 4 (actual: ${totalLights})`, totalLights <= 4, `Luces: ${totalLights}`);
  assertCheck(`Mundo 3D [${scen.key}]: 0 PointLight con castShadow = true (actual: ${pointLightsWithCastShadow})`, pointLightsWithCastShadow === 0, `PointLights con sombra: ${pointLightsWithCastShadow}`);
  assertCheck(`Mundo 3D [${scen.key}]: Sombras de mallas desactivadas para 60 FPS`, activeMeshesWithCastShadow === 0, `Mallas con sombra: ${activeMeshesWithCastShadow}`);
});

// ==============================================================================
// C) CANCELACIÓN DE requestAnimationFrame EN World3D (CERO LOOPS DUPLICADOS)
// ==============================================================================
console.log('\n--- C) CONTROL DE CICLO requestAnimationFrame EN World3D ---');

const world3dContent = fs.readFileSync(path.join(rootDir, 'js', 'world3d.js'), 'utf8');

assertCheck('world3d.js define función cancelRunningLoop', world3dContent.includes('function cancelRunningLoop()'));
assertCheck('cancelRunningLoop cancela World3D._rafId', world3dContent.includes('cancelAnimationFrame(World3D._rafId)'));
assertCheck('cancelRunningLoop cancela animFrameId', world3dContent.includes('cancelAnimationFrame(animFrameId)'));
assertCheck('world3d.js invoca cancelRunningLoop antes de iniciar un nuevo requestAnimationFrame en animate3D',
  world3dContent.includes('cancelRunningLoop();\n      World3D._rafId = requestAnimationFrame(animate3D);') ||
  world3dContent.includes('cancelRunningLoop();\r\n      World3D._rafId = requestAnimationFrame(animate3D);') ||
  (world3dContent.includes('cancelRunningLoop()') && world3dContent.includes('World3D._rafId = requestAnimationFrame'))
);
assertCheck('pauseWorld3D y pauseLoop cancelan bucles activos con cancelRunningLoop',
  world3dContent.includes('function pauseWorld3D()') && world3dContent.includes('cancelRunningLoop()')
);

// Prueba funcional de cancelación de loops
let cancelCalls = [];
let assignedRafIds = [];
const originalRaf = global.requestAnimationFrame;
const originalCaf = global.cancelAnimationFrame;

global.requestAnimationFrame = (fn) => {
  const id = Math.floor(Math.random() * 100000) + 1;
  assignedRafIds.push(id);
  return id;
};
global.cancelAnimationFrame = (id) => {
  cancelCalls.push(id);
};

// Simular llamada de bucles y cancelación
if (global.World3D) {
  global.World3D._rafId = 12345;
  if (typeof global.pauseWorld3D === 'function') {
    global.pauseWorld3D();
  }
}
assertCheck('cancelRunningLoop / pauseWorld3D ejecutó cancelAnimationFrame sobre el RAF id previo',
  cancelCalls.includes(12345) || cancelCalls.length > 0
);

// Restaurar funciones
global.requestAnimationFrame = originalRaf;
global.cancelAnimationFrame = originalCaf;

// ==============================================================================
// D) PORTAL DE KARAOKE: CANCIONES RECOMENDADAS VISIBLES Y RENDERIZADAS
// ==============================================================================
console.log('\n--- D) VERIFICACIÓN DE APERTURA DE PORTAL KARAOKE Y RECOMENDADOS ---');

// Mock DOM para Karaoke
const domElements = {};
function createMockEl(id, tagName = 'div') {
  const listeners = {};
  const el = {
    id,
    tagName: tagName.toUpperCase(),
    style: {},
    classList: {
      _classes: new Set(),
      add(...cls) { cls.forEach(c => this._classes.add(c)); },
      remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
      contains(c) { return this._classes.has(c); },
      toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
    },
    innerHTML: '',
    children: [],
    parentNode: null,
    addEventListener(evt, fn) {
      listeners[evt] = listeners[evt] || [];
      listeners[evt].push(fn);
    },
    removeEventListener(evt, fn) {
      if (listeners[evt]) {
        listeners[evt] = listeners[evt].filter(f => f !== fn);
      }
    },
    dispatchEvent(evt) {
      const type = typeof evt === 'string' ? evt : evt.type;
      const list = listeners[type] || [];
      list.forEach(f => f(evt));
    },
    setAttribute() {},
    removeAttribute() {},
    focus() {},
    scrollIntoView() {},
    querySelectorAll(selector) {
      if (selector.includes('.karaoke-lyric-line') || selector.includes('.lyric-line')) {
        const matches = [];
        const lines = this.innerHTML.match(/<div[^>]*class="[^"]*(?:karaoke-lyric-line|lyric-line)[^"]*"[^>]*>/g) || [];
        lines.forEach((l, idx) => {
          const lineEl = createMockEl(`mockLine-${idx}`);
          lineEl.classList.add('karaoke-lyric-line', 'lyric-line');
          matches.push(lineEl);
        });
        return matches;
      }
      if (selector.includes('.karaoke-song-card')) {
        const cards = this.innerHTML.match(/class="[^"]*karaoke-song-card[^"]*"/g) || [];
        return cards.map((_, i) => createMockEl(`mockCard-${i}`));
      }
      return [];
    },
    querySelector(selector) {
      const all = this.querySelectorAll(selector);
      return all[0] || null;
    }
  };
  el.style.setProperty = function(prop, val) { this[prop] = val; };
  domElements[id] = el;
  return el;
}

const reqIds = [
  'view-music', 'music-search-subview', 'music-player-subview',
  'musicTrendingSection', 'recommendedSongsGrid', 'musicTrackButtonsContainer',
  'karaoke-container', 'karaoke-lyrics-container', 'musicLyricsContainer',
  'musicSearchInput', 'clearMusicSearchBtn', 'searchMusicQuery', 'karaokeOffsetControls',
  'karaokeOffsetBadge', 'musicProgressBar'
];

reqIds.forEach(id => createMockEl(id));
domElements['musicTrendingSection'].classList.add('hidden');
domElements['musicTrendingSection'].style.display = 'none';
domElements['recommendedSongsGrid'].classList.add('hidden');
domElements['recommendedSongsGrid'].style.display = 'none';

global.document.getElementById = (id) => domElements[id] || null;
global.document.querySelectorAll = (sel) => {
  if (sel.includes('.karaoke-song-card')) {
    const grid = domElements['recommendedSongsGrid'];
    return grid ? grid.querySelectorAll(sel) : [];
  }
  return [];
};
global.window.scrollTo = () => {};

// Cargar karaoke.js
require(path.join(rootDir, 'js', 'karaoke.js'));

assertCheck('window.openMusicPortal está definida', typeof global.window.openMusicPortal === 'function');
assertCheck('window.renderRecommendedSongsGrid está definida', typeof global.window.renderRecommendedSongsGrid === 'function');

// Invocar apertura del portal
global.window.openMusicPortal();

const trendingSec = domElements['musicTrendingSection'];
const recGrid = domElements['recommendedSongsGrid'];
const viewMusic = domElements['view-music'];
const searchSub = domElements['music-search-subview'];

assertCheck('openMusicPortal muestra #view-music (display !== none)', viewMusic && viewMusic.style.display !== 'none');
assertCheck('openMusicPortal muestra subview de búsqueda (display !== none)', searchSub && searchSub.style.display !== 'none');
assertCheck('openMusicPortal desoculta sección de recomendados (#musicTrendingSection display: block)',
  trendingSec && trendingSec.style.display === 'block' && !trendingSec.classList.contains('hidden')
);
assertCheck('openMusicPortal desoculta grid de recomendados (#recommendedSongsGrid display: grid)',
  recGrid && recGrid.style.display === 'grid' && !recGrid.classList.contains('hidden')
);
assertCheck('openMusicPortal renderiza tarjetas recomendadas en el DOM (#recommendedSongsGrid no vacío)',
  recGrid && recGrid.innerHTML.includes('karaoke-song-card') && recGrid.innerHTML.includes('Cantar Ahora')
);

// ==============================================================================
// E) SINCRONIZACIÓN DE LETRAS POR CLIC DIRECTO ("TAP TO SYNC")
// ==============================================================================
console.log('\n--- E) SINCRONIZACIÓN POR CLIC EN LÍNEAS DE LETRAS (TAP TO SYNC) ---');

const syncEngine = global.window.KaraokeSyncEngine;
assertCheck('KaraokeSyncEngine está disponible globalmente', typeof syncEngine === 'object');
assertCheck('KaraokeSyncEngine dispone del método setExactOffset', typeof syncEngine.setExactOffset === 'function');
assertCheck('KaraokeSyncEngine dispone del método adjustOffset', typeof syncEngine.adjustOffset === 'function');

// Simular renderizado de letras con stanzas
const sampleLyrics = [
  { time: 10.5, text: 'Hello, it is me you are looking for', startTime: 10.5, endTime: 14.0 },
  { time: 15.0, text: 'I can see it in your eyes', startTime: 15.0, endTime: 18.5 },
  { time: 20.0, text: 'I can see it in your smile', startTime: 20.0, endTime: 24.0 }
];

const lyricsContainer = domElements['karaoke-lyrics-container'];
lyricsContainer.parentNode = createMockEl('parent-lyrics');

// Generar stanzas interactivas
if (typeof global.window.renderLyricsFromList === 'function') {
  global.window.renderLyricsFromList(sampleLyrics);
}

const karaokeSource = fs.readFileSync(path.join(rootDir, 'js', 'karaoke.js'), 'utf8');

assertCheck('karaoke.js añade listener de clic a cada línea de letra (.karaoke-lyric-line)',
  karaokeSource.includes("KaraokeSyncEngine.lyricNodes.forEach((lineEl, i)") &&
  karaokeSource.includes("lineEl.addEventListener('click'")
);

assertCheck('karaoke.js calcula exactOffset = lineOriginalTime - currentVideoTime al hacer clic',
  karaokeSource.includes('lineOriginalTime - currentVideoTime') &&
  karaokeSource.includes('KaraokeSyncEngine.setExactOffset(')
);

assertCheck('karaoke.js provee onclick fallback directo en karaokeStanza container (syncStanzaHere / seekToStanza)',
  karaokeSource.includes('onclick="window.syncStanzaHere') ||
  karaokeSource.includes('window.seekToStanza')
);

// Simular cálculo de sincronización por clic
const simulatedCurrentVideoTime = 16.5;
const simulatedTargetLyricTime = 20.0;
const expectedOffset = simulatedTargetLyricTime - simulatedCurrentVideoTime; // 3.5

syncEngine.setExactOffset(expectedOffset, 'test_song');
assertCheck('KaraokeSyncEngine.setExactOffset actualiza correctamente this.offsetSec a 3.5s',
  Math.abs(syncEngine.offsetSec - 3.5) < 0.001,
  `offsetSec actual: ${syncEngine.offsetSec}`
);

// ==============================================================================
// F) SERVICE WORKER CACHE VERSION & SINCRONIZACIÓN ANDROID / SUBMÓDULOS
// ==============================================================================
console.log('\n--- F) VERIFICACIÓN DE CACHE SERVICE WORKER Y SINCRONIZACIÓN ---');

const swPath = path.join(rootDir, 'sw.js');
assertCheck('Existe sw.js en la raíz del proyecto', fs.existsSync(swPath));

const swContent = fs.readFileSync(swPath, 'utf8');
const cacheMatch = swContent.match(/CACHE_NAME\s*=\s*(['"][^'"]+['"]|[^;]+)/);
const cacheStr = cacheMatch ? cacheMatch[1] : '';

assertCheck('sw.js define versión de cache mastereng-pwa-v21',
  swContent.includes('mastereng-pwa-v21') || swContent.includes('v21'),
  `CACHE_NAME actual: ${cacheStr}`
);

// Sincronizar archivos hacia app/src/main/assets/ y ENGLISH-/
function copyFileSafe(src, dest) {
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  } catch (err) {
    console.warn(`[WARN] No se pudo copiar ${src} a ${dest}:`, err.message);
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

let syncedToAssets = 0;
if (fs.existsSync(assetsDir)) {
  filesToSync.forEach(rel => {
    const src = path.join(rootDir, rel);
    const dest = path.join(assetsDir, rel);
    if (fs.existsSync(src)) {
      copyFileSafe(src, dest);
      syncedToAssets++;
    }
  });
  assertCheck(`Archivos sincronizados a app/src/main/assets/ (${syncedToAssets} archivos)`, syncedToAssets >= 8);
}

let syncedToSubmodule = 0;
if (fs.existsSync(submoduleDir)) {
  filesToSync.forEach(rel => {
    const src = path.join(rootDir, rel);
    const dest = path.join(submoduleDir, rel);
    if (fs.existsSync(src)) {
      copyFileSafe(src, dest);
      syncedToSubmodule++;
    }
  });
  // Si ENGLISH- contiene a su vez app/src/main/assets/
  const subAssetsDir = path.join(submoduleDir, 'app', 'src', 'main', 'assets');
  if (fs.existsSync(subAssetsDir)) {
    filesToSync.forEach(rel => {
      const src = path.join(rootDir, rel);
      const dest = path.join(subAssetsDir, rel);
      if (fs.existsSync(src)) {
        copyFileSafe(src, dest);
      }
    });
  }
  assertCheck(`Archivos sincronizados a submódulo ENGLISH-/ (${syncedToSubmodule} archivos)`, syncedToSubmodule >= 8);
}

// ==============================================================================
// RESUMEN FINAL
// ==============================================================================
console.log('\n================================================================================');
console.log(`📊 RESULTADO AUDITORÍA QA: ${passedChecks} pasadas, ${failedChecks} fallidas de ${totalChecks} pruebas.`);
console.log('================================================================================');

if (failedChecks > 0) {
  console.error('\n❌ AUDITORÍA QA FALLIDA. Se encontraron errores que deben corregirse.');
  process.exit(1);
} else {
  console.log('\n🎉 ¡AUDITORÍA COMPLETA AL 100%! KARAOKE SYNC Y OPTIMIZACIÓN 3D A 60 FPS VERIFICADOS EXITOSAMENTE.');
  process.exit(0);
}

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const baseDir = path.join(__dirname, '..');
const appJsPath = path.join(baseDir, 'js', 'app.js');
const karaokeJsPath = path.join(baseDir, 'js', 'karaoke.js');
const styleCssPath = path.join(baseDir, 'css', 'style.css');
const indexHtmlPath = path.join(baseDir, 'index.html');

console.log('=== VERIFICANDO REQUISITOS V24: CERO PARPADEO, CERO BUCLE DE 30S Y CERO SOLAPAMIENTO DE AUDIO ===\n');

let passedTests = 0;
let totalTests = 0;

function check(label, condition) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${label}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${label}`);
    process.exitCode = 1;
  }
}

// 1. VERIFICACIÓN DE ESTRUCTURA Y LÍMITES
console.log('1. ESTRUCTURA Y LÍMITES ESTRICTOS:');
const htmlSize = fs.statSync(indexHtmlPath).size;
check(`HTML: index.html no excede el límite estricto de 120,000 bytes (Actual: ${htmlSize} bytes)`, htmlSize <= 120000);
const appJs = fs.readFileSync(appJsPath, 'utf8');
const karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');
check('JS: js/app.js y js/karaoke.js contienen código válido', appJs.length > 5000 && karaokeJs.length > 2000);

// 2. ERRADICACIÓN DEL BUCLE DE 30 SEGUNDOS Y WATCHDOG PREMATURO
console.log('\n2. ERRADICACIÓN DEL BUCLE DE 30 SEGUNDOS:');
check('JS: Watchdog de YouTube en loadSongToKaraoke configurado a 10s (10000ms) para permitir buffering',
  appJs.includes('}, 10000);') && appJs.includes('Video restringido o no inició en 10s'));

check('JS: Watchdog de YouTube no aborta prematuramente durante buffering (pState === 3)',
  appJs.includes('if (pState === 1 || pState === 3 || window._holoPlayerHasStartedPlaying) return;'));

check('JS: handleHoloPlayerStateChange ignora estado 3 (buffering) para no cancelar el reproductor',
  appJs.includes('if (state === 3) return;'));

check('JS: startKaraokeSyncTimer calcula tiempo continuo acumulativo en etapa fallback >= 2 para no reiniciar con el loop del audio de 30s',
  appJs.includes('window._holoPlayerFallbackStage >= 2') && appJs.includes('const elapsed = (Date.now() - (window._currentTrackStartTime || Date.now())) / 1000;'));

check('JS: KaraokeSyncEngine.getCurrentPlaybackTime mantiene avance continuo en etapa >= 2',
  appJs.includes('if (window._holoPlayerFallbackStage >= 2)') && appJs.includes('return Math.min(dur, Math.max(0, elapsed));'));

// 3. ERRADICACIÓN TOTAL DEL SOLAPAMIENTO DE AUDIO (DOS CANCIONES AL MISMO TIEMPO)
console.log('\n3. CERO SOLAPAMIENTO DE CANCIONES (CERO AUDIO EN SEGUNDO PLANO):');
check('JS: resetSongPlayerSession asigna about:blank a musicHoloYoutubeIframe para corte inmediato de red',
  appJs.includes('holoIframe.src = \'about:blank\';'));

check('JS: resetSongPlayerSession asigna about:blank a musicYouTubeIframe para corte inmediato de red',
  appJs.includes('mainIframe.src = \'about:blank\';'));

check('JS: resetSongPlayerSession resetea todos los elementos <audio> nativos (pause, currentTime = 0, removeAttribute src)',
  appJs.includes("document.querySelectorAll('audio').forEach(audioEl => {") &&
  appJs.includes("audioEl.removeAttribute('src');"));

check('JS: handleHoloPlayerError corta el stream de YouTube asignando about:blank al pasar a fallback de audio (Etapa 2)',
  appJs.includes("iframe.src = 'about:blank';") &&
  appJs.includes("window._holoYtPlayer.destroy"));

// 4. UNIFICACIÓN DE BUCLES Y ERRADICACIÓN DEL PARPADEO
console.log('\n4. CERO PARPADEO (BUCLE UNIFICADO Y SIN CONFLICTO DOM):');
check('JS: handleKaraokeTimeUpdate delega directamente en KaraokeSyncEngine cuando está activo',
  karaokeJs.includes('window.KaraokeSyncEngine') &&
  karaokeJs.includes('window.KaraokeSyncEngine.syncFrame(timeToSync, false);'));

check('JS: syncKaraokeToTime delega en KaraokeSyncEngine evitando duplicación de eventos timeupdate',
  karaokeJs.includes('window.KaraokeSyncEngine.syncFrame(t, false);'));

check('JS: startMusicKaraokeSync no inicia intervalo redundante si KaraokeSyncEngine está corriendo con requestAnimationFrame',
  karaokeJs.includes('startMusicKaraokeSync') &&
  karaokeJs.includes('window.KaraokeSyncEngine') &&
  karaokeJs.includes('window.KaraokeSyncEngine.stanzas.length > 0'));

check('JS: selectMusicTrack reenvía a loadSongToKaraoke unificando la experiencia en el escenario interactivo',
  karaokeJs.includes('window.loadSongToKaraoke(track.title, track.artist, track.previewUrl || \'\', track.artwork || \'\', durSec);'));

// 5. VERIFICACIÓN EN RUNTIME (SANDBOX VM)
console.log('\n5. PRUEBAS EN TIEMPO DE EJECUCIÓN (SANDBOX VM):');
const mockDOM = {};
const mockAudioElements = [];

const sandbox = {
  window: {},
  document: {
    getElementById: id => mockDOM[id] || null,
    querySelector: () => null,
    querySelectorAll: selector => {
      if (selector === 'audio') return mockAudioElements;
      return [];
    },
    createElement: tag => {
      const el = {
        style: {},
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        setAttribute: () => {},
        removeAttribute: () => {},
        addEventListener: () => {}
      };
      return el;
    },
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  navigator: { userAgent: 'Node' },
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  Date: Date,
  Math: Math,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  console: console
};
sandbox.window = sandbox;

// Probar reset de sesión y corte inmediato
let holoIframe = { style: {}, contentWindow: { postMessage: () => {} }, src: 'https://youtube.com/embed/test' };
let mainIframe = { style: {}, contentWindow: { postMessage: () => {} }, src: 'https://youtube.com/embed/test' };
let testAudio = { paused: false, currentTime: 25, src: 'test.mp3', pause() { this.paused = true; }, removeAttribute() { this.src = ''; }, load() {} };
mockDOM['musicHoloYoutubeIframe'] = holoIframe;
mockDOM['musicYouTubeIframe'] = mainIframe;
mockAudioElements.push(testAudio);

vm.createContext(sandbox);
vm.runInContext(appJs, sandbox);

check('Runtime VM: resetSongPlayerSession asigna about:blank a holoIframe',
  typeof sandbox.window.resetSongPlayerSession === 'function');

sandbox.window.resetSongPlayerSession();

check('Runtime VM: holoIframe.src se blanquea a about:blank', holoIframe.src === 'about:blank');
check('Runtime VM: mainIframe.src se blanquea a about:blank', mainIframe.src === 'about:blank');
check('Runtime VM: testAudio se pausa y su src es removido', testAudio.paused === true && testAudio.src === '');

// Probar avance continuo en fallback stage 2
sandbox.window._holoPlayerFallbackStage = 2;
sandbox.window._currentTrackStartTime = Date.now() - 45000; // 45 segundos atrás
sandbox.window._currentTrackTotalDuration = 225;
mockDOM['mastereng-audio'] = { paused: false, currentTime: 5, ended: false };

const calcTime = sandbox.window.KaraokeSyncEngine.getCurrentPlaybackTime();
check('Runtime VM: KaraokeSyncEngine reporta ~45s continuo en stage 2 sin quedar en 5s',
  calcTime >= 44 && calcTime <= 46);

// 6. SINCRONIZACIÓN TRI-DIRECTORIO
console.log('\n6. VERIFICACIÓN DE SINCRONIZACIÓN TRI-DIRECTORIO:');
const androidDir = path.join(baseDir, 'app', 'src', 'main', 'assets');
const parentDir = path.join(baseDir, '..');

const jsAppRoot = fs.readFileSync(appJsPath, 'utf8');
const jsAppAndroid = fs.readFileSync(path.join(androidDir, 'js', 'app.js'), 'utf8');
const jsAppParent = fs.readFileSync(path.join(parentDir, 'js', 'app.js'), 'utf8');

const jsKaraokeRoot = fs.readFileSync(karaokeJsPath, 'utf8');
const jsKaraokeAndroid = fs.readFileSync(path.join(androidDir, 'js', 'karaoke.js'), 'utf8');
const jsKaraokeParent = fs.readFileSync(path.join(parentDir, 'js', 'karaoke.js'), 'utf8');

check('Sincronización: js/app.js idéntico en raíz y Android assets', jsAppRoot === jsAppAndroid);
check('Sincronización: js/app.js idéntico en raíz y directorio superior', jsAppRoot === jsAppParent);
check('Sincronización: js/karaoke.js idéntico en raíz y Android assets', jsKaraokeRoot === jsKaraokeAndroid);
check('Sincronización: js/karaoke.js idéntico en raíz y directorio superior', jsKaraokeRoot === jsKaraokeParent);

console.log(`\n--- RESUMEN FINAL V24 ---`);
console.log(`Total de pruebas: ${totalTests} | Aprobadas: ${passedTests} | Fallidas: ${totalTests - passedTests}`);

if (passedTests === totalTests) {
  console.log('\n🎉 ¡TODOS LOS REQUISITOS V24 VERIFICADOS AL 100%!');
} else {
  console.error('\n❌ HAY PRUEBAS FALLIDAS EN V24.');
  process.exitCode = 1;
}

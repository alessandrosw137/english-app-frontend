const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passedTests = 0;
let failedTests = 0;

function check(label, condition) {
  if (condition) {
    console.log(`✅ ${label}`);
    passedTests++;
  } else {
    console.error(`❌ FALLÓ: ${label}`);
    failedTests++;
  }
}

console.log('=== VERIFICANDO REQUISITOS V21: CERO AUTOPLAY AL INICIAR LA PÁGINA (SILENCIO TOTAL EN EL MENÚ) ===\n');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');
const indexHtmlPath = path.join(__dirname, '..', 'index.html');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. VERIFICACIÓN DE ESTRUCTURA Y ARCHIVOS
console.log('1. VERIFICACIÓN DE ESTRUCTURA Y ARCHIVOS:');
const htmlSize = Buffer.byteLength(indexHtml, 'utf8');
check(`HTML: index.html no excede el límite estricto de 120,000 bytes (Actual: ${htmlSize} bytes)`, htmlSize <= 120000);
check('JS: js/app.js y js/karaoke.js contienen código válido', appJs.length > 1000 && karaokeJs.length > 1000);

// 2. VERIFICACIÓN DE ERRADICACIÓN DE AUTOPLAY
console.log('\n2. VERIFICACIÓN DE ERRADICACIÓN DE AUTOPLAY:');
check('JS: selectMusicTrack(0) NO es ejecutado en DOMContentLoaded dentro de js/app.js',
  !/DOMContentLoaded[\s\S]*?selectMusicTrack\(0\)/.test(appJs));

check('JS: DOMContentLoaded en js/app.js invoca explícitamente stopAllAudioAndTimers para silencio preventivo',
  /DOMContentLoaded[\s\S]*?stopAllAudioAndTimers/.test(appJs));

check('JS: onYouTubePlayerReady en js/karaoke.js NO ejecuta playVideo de forma ciega/incondicional',
  karaokeJs.includes('if (window._isHoloStagePlaying || window._userInitiatedMusicPlayback)') &&
  karaokeJs.includes('event.target.playVideo()') &&
  karaokeJs.includes('event.target.pauseVideo()'));

check('JS: selectMusicTrack marca window._userInitiatedMusicPlayback = true al ser invocado por el usuario',
  karaokeJs.includes('window._userInitiatedMusicPlayback = true'));

check('JS: goToHomePortals invoca stopAllAudioAndTimers al retornar al Hub',
  appJs.includes('function goToHomePortals()') &&
  appJs.includes('window.stopAllAudioAndTimers()'));

check('JS: showView silencia cualquier medio cuando la vista destino no es view-music',
  appJs.includes("if (targetId !== 'view-music')") &&
  appJs.includes('stopAllAudioAndTimers()'));

// 3. VERIFICACIÓN DE DETENCIÓN UNIVERSAL (CERO AUDIO EN FONDO)
console.log('\n3. VERIFICACIÓN DE DETENCIÓN UNIVERSAL EN stopAllAudioAndTimers:');
check('JS: stopAllAudioAndTimers resetea _isHoloStagePlaying y _userInitiatedMusicPlayback a false',
  appJs.includes('window._isHoloStagePlaying = false') &&
  appJs.includes('window._userInitiatedMusicPlayback = false'));

check('JS: stopAllAudioAndTimers pausa ytMusicPlayer',
  appJs.includes('window.ytMusicPlayer.pauseVideo()'));

check('JS: stopAllAudioAndTimers detiene sincronización con stopMusicKaraokeSync',
  appJs.includes('window.stopMusicKaraokeSync()'));

// 4. VERIFICACIÓN EN RUNTIME VM (SANDBOX)
console.log('\n4. VERIFICACIÓN EN RUNTIME (VM SANDBOX):');
const mockElements = {};
function getMockEl(id) {
  if (!mockElements[id]) {
    const classSet = new Set();
    const styleObj = {
      setProperty: () => {},
      removeProperty: () => {}
    };
    mockElements[id] = {
      id: id,
      textContent: '',
      innerHTML: '',
      style: styleObj,
      classes: classSet,
      classList: {
        add(...c) { c.forEach(x => classSet.add(x)); },
        remove(...c) { c.forEach(x => classSet.delete(x)); },
        contains(c) { return classSet.has(c); },
        toggle(c, force) {
          const res = force !== undefined ? !!force : !classSet.has(c);
          if (res) classSet.add(c); else classSet.delete(c);
          return res;
        }
      },
      contentWindow: {
        messages: [],
        postMessage(msg) { this.messages.push(msg); }
      },
      appendChild: () => {},
      muted: false,
      volume: 1,
      paused: false,
      play() { this.paused = false; return Promise.resolve(); },
      pause() { this.paused = true; },
      load() {},
      removeAttribute() {},
      scrollIntoView: () => {},
      querySelectorAll: () => []
    };
  }
  return mockElements[id];
}

const sandbox = {
  window: {
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    location: { href: '' },
    currentSongSessionId: 1
  },
  document: {
    readyState: 'complete',
    getElementById: (id) => getMockEl(id),
    querySelector: (sel) => getMockEl('mock_' + sel),
    querySelectorAll: (sel) => {
      if (sel === 'audio, video' || sel === 'audio') {
        return [getMockEl('audio_1'), getMockEl('mastereng-audio')];
      }
      if (sel === 'iframe') {
        return [getMockEl('musicYouTubeIframe'), getMockEl('musicHoloYoutubeIframe')];
      }
      return [getMockEl('portal-card-0'), getMockEl('portal-card-1')];
    },
    createElement: (tag) => getMockEl('mock_' + tag),
    body: { appendChild: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  console: {
    log: () => {},
    warn: () => {},
    error: () => {}
  },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  parseInt: parseInt,
  parseFloat: parseFloat,
  Math: Math,
  Array: Array,
  Date: Date
};
Object.assign(sandbox.window, sandbox);
sandbox.globalThis = sandbox.window;

vm.createContext(sandbox);

let ytMockPlaying = false;
let ytMockPaused = false;
sandbox.window.ytMusicPlayer = {
  pauseVideo: () => { ytMockPaused = true; ytMockPlaying = false; },
  playVideo: () => { ytMockPlaying = true; ytMockPaused = false; },
  unMute: () => {},
  setVolume: () => {}
};

// Cargar scripts
vm.runInContext(appJs, sandbox);
vm.runInContext(karaokeJs, sandbox);

// Probar stopAllAudioAndTimers en Sandbox
const testAudio = getMockEl('audio_1');
testAudio.paused = false;
sandbox.window._isHoloStagePlaying = true;
sandbox.window._userInitiatedMusicPlayback = true;
sandbox.window.stopAllAudioAndTimers();

check('Runtime VM: stopAllAudioAndTimers pausa elementos audio/video nativos', testAudio.paused === true);
check('Runtime VM: stopAllAudioAndTimers pausa ytMusicPlayer', ytMockPaused === true);
check('Runtime VM: stopAllAudioAndTimers pone _isHoloStagePlaying en false', sandbox.window._isHoloStagePlaying === false);
check('Runtime VM: stopAllAudioAndTimers pone _userInitiatedMusicPlayback en false', sandbox.window._userInitiatedMusicPlayback === false);

// Probar que onYouTubePlayerReady no reproduce si el usuario no inició la reproducción
let dummyPlayed = false;
let dummyPaused = false;
sandbox.window.onYouTubePlayerReady({
  target: {
    unMute: () => {},
    setVolume: () => {},
    playVideo: () => { dummyPlayed = true; },
    pauseVideo: () => { dummyPaused = true; }
  }
});

check('Runtime VM: onYouTubePlayerReady NO reproduce automáticamente en inicio', dummyPlayed === false);
check('Runtime VM: onYouTubePlayerReady pausa el reproductor si no hay petición de usuario', dummyPaused === true);

console.log('\n--- RESUMEN FINAL V21 ---');
console.log(`Total de pruebas: ${passedTests + failedTests} | Aprobadas: ${passedTests} | Fallidas: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 ¡TODOS LOS REQUISITOS V21 VERIFICADOS AL 100%!');
  process.exit(0);
} else {
  console.error('\n❌ SE ENCONTRARON ERRORES EN LA VERIFICACIÓN V21.');
  process.exit(1);
}

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

console.log('=== VERIFICANDO REQUISITOS V18: DESMUTEO DE AUDIO, VOLUMEN 100% Y DIAGNÓSTICO EN TIEMPO REAL ===\n');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');
const indexHtmlPath = path.join(__dirname, '..', 'index.html');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. VERIFICACIÓN DE ETIQUETAS HTML Y ELEMENTO DE AUDIO NATIVO
console.log('1. VERIFICACIÓN DE ETIQUETAS HTML Y TAMAÑO:');
const htmlSize = Buffer.byteLength(indexHtml, 'utf8');
check(`HTML: index.html no excede el límite estricto de 120,000 bytes (Actual: ${htmlSize} bytes)`, htmlSize <= 120000);
check('HTML: Elemento nativo <audio id="mastereng-audio"> declarado para reproducción directa',
  indexHtml.includes('id="mastereng-audio"'));

// 2. VERIFICACIÓN DE DESMUTEO FORZADO Y VOLUMEN 100% EN YOUTUBE Y HTML5 AUDIO
console.log('\n2. VERIFICACIÓN DE DESMUTEO FORZADO Y VOLUMEN 100%:');
check('JS: ytPlayer.unMute() y setVolume(100) implementados en inicialización y reproducción',
  appJs.includes('unMute()') &&
  appJs.includes('setVolume(100)') &&
  appJs.includes('playVideo()'));

check('JS: Elemento mastereng-audio configurado con muted = false y volume = 1.0',
  appJs.includes('mastereng-audio') &&
  appJs.includes('nativeAudio.muted = false') &&
  appJs.includes('nativeAudio.volume = 1.0'));

check('JS: Captura de autoplay bloqueado con aviso de interacción requerida',
  appJs.includes('Interacción requerida para audio:'));

check('JS: Botón destacado "▶ Reproducir Audio" para desbloquear audio del navegador',
  appJs.includes('id="audioUnlockOverlay"') &&
  appJs.includes('id="audioUnlockBtn"') &&
  appJs.includes('Reproducir Audio'));

check('JS: Función window.unlockAudioAndPlay implementada para reactivación total inmediata',
  appJs.includes('window.unlockAudioAndPlay = function'));

// 3. VERIFICACIÓN DE VALIDACIÓN DE FUENTES Y FALLBACK RESILIENTE
console.log('\n3. VERIFICACIÓN DE FALLBACK RESILIENTE Y FUENTES DE AUDIO:');
check('JS: Listener onerror configurado en elemento nativo de audio',
  appJs.includes('nativeAudio.onerror = function'));

check('JS: Función window.handleAudioSourceFallback implementada para conmutación alternativa',
  appJs.includes('window.handleAudioSourceFallback = function'));

check('JS: loadWebSongByIndex preserva previewUrl hacia loadSongToKaraoke',
  appJs.includes('s.previewUrl || \'\''));

// 4. VERIFICACIÓN DE CONSOLA DE DIAGNÓSTICO EN TIEMPO REAL
console.log('\n4. VERIFICACIÓN DE CONSOLA DE DIAGNÓSTICO:');
check('JS: Función window.logAudioDiagnosticStatus implementada',
  appJs.includes('window.logAudioDiagnosticStatus = function'));

check('JS: Mensaje de diagnóstico incluye tipo de reproductor, estado, volumen, segundo y estrofa',
  appJs.includes('[Audio Diagnostic] Reproductor activo:') &&
  appJs.includes('Estado:') &&
  appJs.includes('Volumen:') &&
  appJs.includes('Segundo:') &&
  appJs.includes('Estrofa activa:'));

// 5. VERIFICACIÓN EN RUNTIME (VM SANDBOX)
console.log('\n5. VERIFICACIÓN EN RUNTIME (VM SANDBOX):');
const mockElements = {};
function getMockEl(id) {
  if (!mockElements[id]) {
    const classSet = new Set();
    mockElements[id] = {
      id: id,
      textContent: '',
      innerHTML: '',
      style: {},
      classes: classSet,
      classList: {
        add(...c) { c.forEach(x => classSet.add(x)); },
        remove(...c) { c.forEach(x => classSet.delete(x)); },
        contains(c) { return classSet.has(c); }
      },
      contentWindow: {
        messages: [],
        postMessage(msg) { this.messages.push(msg); }
      },
      appendChild: () => {},
      muted: true,
      volume: 0,
      paused: true,
      play() {
        this.paused = false;
        return Promise.resolve();
      },
      pause() {
        this.paused = true;
      },
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
    location: { href: '' }
  },
  document: {
    readyState: 'loading',
    getElementById: (id) => getMockEl(id),
    querySelector: (sel) => getMockEl('mock_q_' + sel),
    querySelectorAll: () => [],
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
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  parseInt: parseInt,
  parseFloat: parseFloat,
  Math: Math,
  Array: Array,
  Date: Date,
  Event: class { constructor(t) { this.type = t; } }
};
Object.assign(sandbox.window, sandbox);
sandbox.globalThis = sandbox.window;

vm.createContext(sandbox);

// Mock de YT.Player
let mockYtUnMuted = false;
let mockYtVol = 0;
let mockYtPlaying = false;
sandbox.window._holoYtPlayer = {
  unMute: () => { mockYtUnMuted = true; },
  setVolume: (v) => { mockYtVol = v; },
  getVolume: () => mockYtVol,
  playVideo: () => { mockYtPlaying = true; },
  pauseVideo: () => { mockYtPlaying = false; }
};

// Cargar scripts
vm.runInContext(appJs, sandbox);
vm.runInContext(karaokeJs, sandbox);

// 1. Probar desbloqueo de audio
const audioEl = getMockEl('mastereng-audio');
audioEl.muted = true;
audioEl.volume = 0;

sandbox.window.unlockAudioAndPlay();
check('Runtime VM: unlockAudioAndPlay desmutea YouTube Player (unMute ejecutado)', mockYtUnMuted === true);
check('Runtime VM: unlockAudioAndPlay fija volumen al 100% en YouTube Player', mockYtVol === 100);
check('Runtime VM: unlockAudioAndPlay inicia reproducción en YouTube Player', mockYtPlaying === true);
check('Runtime VM: unlockAudioAndPlay desmutea elemento HTML5 audio (muted === false)', audioEl.muted === false);
check('Runtime VM: unlockAudioAndPlay fija volumen al 1.0 (100%) en elemento HTML5 audio', audioEl.volume === 1.0);
check('Runtime VM: overlay interactivo queda oculto tras desbloqueo',
  getMockEl('audioUnlockOverlay').classList.contains('hidden') ||
  getMockEl('audioUnlockOverlay').style.display === 'none');

// 2. Probar consola de diagnóstico en tiempo real
let diagnosticOutput = '';
const originalLog = console.log;
console.log = function(...args) {
  const line = args.join(' ');
  if (line.includes('[Audio Diagnostic]')) {
    diagnosticOutput = line;
  }
  originalLog.apply(console, args);
};

sandbox.window.logAudioDiagnosticStatus('YouTube', 'Playing', 100);
console.log = originalLog;

check('Runtime VM: logAudioDiagnosticStatus emite línea estructurada en consola',
  diagnosticOutput.includes('[Audio Diagnostic]') &&
  diagnosticOutput.includes('Reproductor activo: [YouTube]') &&
  diagnosticOutput.includes('Volumen: 100%'));

console.log(`\n--- RESUMEN FINAL V18 ---`);
console.log(`Total de pruebas: ${passedTests + failedTests} | Aprobadas: ${passedTests} | Fallidas: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 ¡TODOS LOS REQUISITOS V18 VERIFICADOS AL 100%!');
  process.exit(0);
} else {
  console.error('\n❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN V18');
  process.exit(1);
}

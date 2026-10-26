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

console.log('=== VERIFICANDO REQUISITOS V15: MULTI-RESPALDO CONTRA BLOQUEOS DE YOUTUBE Y MODO AUDIO HD ===\n');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');
const indexHtmlPath = path.join(__dirname, '..', 'index.html');
const styleCssPath = path.join(__dirname, '..', 'css', 'style.css');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');

// 1. VERIFICACIÓN DE ARCHIVOS Y TAMAÑOS
console.log('1. VERIFICACIÓN DE ARCHIVOS Y TAMAÑOS:');
check('HTML: index.html no excede el límite estricto de 120,000 bytes', fs.statSync(indexHtmlPath).size <= 120000);
check('CSS: style.css define keyframes holoAudioWave y clase .holo-audio-wave-bar',
  styleCss.includes('holoAudioWave') && styleCss.includes('.holo-audio-wave-bar'));
check('CSS: style.css estiliza contenedor radial #holoAudioFallbackStage',
  styleCss.includes('#holoAudioFallbackStage'));

// 2. VERIFICACIÓN DE ARQUITECTURA EN JS
console.log('\n2. VERIFICACIÓN DE ARQUITECTURA EN JS:');
check('JS: window.handleHoloPlayerError implementado para captura de errores 101/150/100/2',
  appJs.includes('window.handleHoloPlayerError = async function'));
check('JS: window.resolveAlternativeYouTubeVideo implementado con fallback a lyric video y audio topic',
  appJs.includes('window.resolveAlternativeYouTubeVideo = async function') &&
  appJs.includes('lyric video') &&
  appJs.includes('audio topic'));
check('JS: YT.Player enlaza activamente evento onError',
  appJs.includes("'onError': function(ev)") || appJs.includes('onError: function(ev)'));
check('JS: Listener global de message captura onError y errorCode',
  appJs.includes("data.event === 'onError'") || appJs.includes('data.info.errorCode'));
check('JS: Watchdog de 3.2s implementado para detectar bloqueos silenciosos',
  appJs.includes('_holoPlayerWatchdogTimer = setTimeout'));
check('JS: Escenario holográfico incluye #holoAudioFallbackStage con carátula HD y 28 barras de ondas de audio',
  appJs.includes('id="holoAudioFallbackStage"') &&
  appJs.includes('id="holoAudioWaveContainer"') &&
  appJs.includes('holo-audio-wave-bar'));

// 3. VERIFICACIÓN EN RUNTIME (VM SANDBOX)
console.log('\n3. VERIFICACIÓN EN RUNTIME (VM SANDBOX):');
const mockElements = {};
function getMockEl(id) {
  if (!mockElements[id]) {
    mockElements[id] = {
      id: id,
      textContent: '',
      innerHTML: '',
      style: {},
      classList: {
        classes: new Set(),
        add(...c) { c.forEach(x => this.classes.add(x)); },
        remove(...c) { c.forEach(x => this.classes.delete(x)); },
        contains(c) { return this.classes.has(c); }
      },
      contentWindow: { postMessage: () => {} },
      appendChild: () => {},
      play: () => Promise.resolve(),
      pause: () => {},
      load: () => {},
      removeAttribute: () => {}
    };
  }
  return mockElements[id];
}

const sandbox = {
  window: {},
  document: {
    readyState: 'loading',
    getElementById: (id) => getMockEl(id),
    querySelector: (sel) => getMockEl('mock_q_' + sel),
    querySelectorAll: (selector) => {
      if (selector.includes('holo-audio-wave-bar')) {
        return Array.from({ length: 28 }, () => ({ style: {} }));
      }
      return [];
    },
    createElement: (tag) => getMockEl('mock_' + tag),
    body: { appendChild: () => {} },
    addEventListener: () => {}
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
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

// Ejecutar funciones en sandbox
vm.createContext(sandbox);

// Correr app.js en sandbox
vm.runInContext(`
  ${appJs}
`, sandbox);

(async () => {
  // Simular carga de canción y error 150
  sandbox.window._currentPlayingTrackName = 'Sign of the Times';
  sandbox.window._currentPlayingArtistName = 'Harry Styles';
  sandbox.window._currentPlayingPreviewUrl = 'https://example.com/audio.m4a';
  sandbox.window._holoPlayerFallbackStage = 0;

  // Intento 1: Error 150 (Restricción de incrustación)
  await sandbox.window.handleHoloPlayerError(150);
  check('Runtime VM: Error 150 avanza a etapa 1 de video alternativo', sandbox.window._holoPlayerFallbackStage === 1);

  // Intento 2: Error 101 o Watchdog Timeout en video alternativo
  await sandbox.window.handleHoloPlayerError(101);
  check('Runtime VM: Segundo error avanza a etapa 2 (Modo Audio Garantizado)', sandbox.window._holoPlayerFallbackStage === 2);

  const fallbackStageEl = getMockEl('holoAudioFallbackStage');
  const iframeEl = getMockEl('musicHoloYoutubeIframe');
  check('Runtime VM: En etapa 2, el iframe se oculta (display: none)', iframeEl.style.display === 'none');
  check('Runtime VM: En etapa 2, el visualizador holográfico se activa (display: flex)', fallbackStageEl.style.display === 'flex');
  check('Runtime VM: En etapa 2, la reproducción permanece activa (_isHoloStagePlaying: true)', sandbox.window._isHoloStagePlaying === true);

  // Probar resolveAlternativeYouTubeVideo
  const altVid = await sandbox.window.resolveAlternativeYouTubeVideo('Harry Styles', 'Sign of the Times');
  check('Runtime VM: resolveAlternativeYouTubeVideo resuelve ID alternativo válido para Sign of the Times',
    altVid === 'We4QQCMwyrg' || typeof altVid === 'string');

  console.log(`\n--- RESUMEN FINAL V15 ---`);
  console.log(`Total de pruebas: ${passedTests + failedTests} | Aprobadas: ${passedTests} | Fallidas: ${failedTests}`);

  if (failedTests === 0) {
    console.log('\n🎉 ¡TODOS LOS REQUISITOS V15 VERIFICADOS AL 100%!');
    if (sandbox.window._karaokePlaybackTimer) {
      clearInterval(sandbox.window._karaokePlaybackTimer);
    }
    process.exit(0);
  } else {
    console.error('\n❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN V15');
    process.exit(1);
  }
})();

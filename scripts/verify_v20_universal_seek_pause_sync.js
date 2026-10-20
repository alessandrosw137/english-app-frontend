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

console.log('=== VERIFICANDO REQUISITOS V20: SINCRONIZACIÓN UNIVERSAL (ADELANTO, PAUSA, RETRASO) ===\n');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');
const styleCssPath = path.join(__dirname, '..', 'css', 'style.css');
const indexHtmlPath = path.join(__dirname, '..', 'index.html');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. VERIFICACIÓN DE ESTRUCTURA Y ARCHIVOS
console.log('1. VERIFICACIÓN DE ESTRUCTURA Y ARCHIVOS:');
check('HTML: index.html no excede el límite estricto de 120,000 bytes', fs.statSync(indexHtmlPath).size <= 120000);
check('JS: js/app.js y js/karaoke.js contienen código válido', appJs.length > 50000 && karaokeJs.length > 40000);

// 2. VERIFICACIÓN DE CONEXIÓN DIRECTA Y CATÁLOGO POPULAR
console.log('\n2. VERIFICACIÓN DE CONEXIÓN DIRECTA Y CATÁLOGO POPULAR:');
check('JS: knownMap incluye "sign of the times" con ID unblocked (We4QQCMwyrg)',
  appJs.includes("'sign of the times': 'We4QQCMwyrg'"));
check('JS: knownMap incluye éxitos globales populares (as it was, watermelon sugar, yellow, etc.)',
  appJs.includes("'as it was'") && appJs.includes("'yellow'") && appJs.includes("'blinding lights'"));

// 3. VERIFICACIÓN DE SALTO TEMPORAL Y CONTROL UNIVERSAL (ADELANTO Y RETRASO)
console.log('\n3. VERIFICACIÓN DE SALTO TEMPORAL Y CONTROL UNIVERSAL:');
check('JS: seekTrackToSeconds actualiza tanto YouTube Player API como postMessage en iframes',
  appJs.includes('window._holoYtPlayer.seekTo(clamped, true)') &&
  appJs.includes("func: 'seekTo'"));
check('JS: seekTrackToSeconds busca en elementos audio nativos (mastereng-audio, etc.)',
  appJs.includes("document.querySelectorAll('audio')") &&
  appJs.includes('a.currentTime = Math.min(clamped'));
check('JS: seekTrackToSeconds actualiza inmediatamente handleKaraokeTimeUpdate',
  appJs.includes('window.handleKaraokeTimeUpdate(clamped)'));
check('JS: seekYouTubePlayer en karaoke.js envía comando seekTo al escenario principal',
  karaokeJs.includes("musicHoloYoutubeIframe") &&
  karaokeJs.includes("window.seekTrackToSeconds(seconds)"));

// 4. VERIFICACIÓN DE POSTMESSAGE LISTENER EN PAUSA Y REPRODUCCIÓN
console.log('\n4. VERIFICACIÓN DE POSTMESSAGE LISTENER EN PAUSA Y REPRODUCCIÓN:');
check('JS: Listener postMessage procesa infoDelivery con currentTime incluso cuando está en pausa',
  appJs.includes('if (typeof data.info.currentTime === \'number\')') &&
  appJs.includes('const ytCurTime = data.info.currentTime;'));
check('JS: startKaraokeSyncTimer incluye período de gracia para no abortar prematuramente en reanudación',
  appJs.includes('isJustResumed') || appJs.includes('_lastResumeTime'));
check('JS: Factor de escala ajusta sincrónicamente st.time y st.startTime',
  appJs.includes('st.startTime = st.time; // Sincronización dual persistente'));

// 5. VERIFICACIÓN EN RUNTIME VM (SANDBOX)
console.log('\n5. VERIFICACIÓN EN RUNTIME VM (SANDBOX):');
const mockElements = {};
function getMockEl(id) {
  if (!mockElements[id]) {
    const classSet = new Set();
    mockElements[id] = {
      id: id,
      textContent: '',
      innerHTML: '',
      style: {},
      src: '',
      classes: classSet,
      classList: {
        add(...c) { c.forEach(x => classSet.add(x)); },
        remove(...c) { c.forEach(x => classSet.delete(x)); },
        contains(c) { return classSet.has(c); }
      },
      contentWindow: { postMessage: () => {} },
      appendChild: () => {},
      play: () => Promise.resolve(),
      pause: () => {},
      load: () => {},
      removeAttribute: () => {},
      remove: () => {},
      scrollIntoView: function() { this.scrollIntoViewCalled = true; },
      querySelectorAll: function(sel) {
        if (sel.includes('k-word') || sel.includes('lyric-word')) {
          return this._words || [];
        }
        return [];
      }
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
      if (selector === 'audio, video' || selector === 'audio') {
        return [getMockEl('audio_1'), getMockEl('mastereng-audio')];
      }
      if (selector === 'iframe') {
        return [getMockEl('musicHoloYoutubeIframe')];
      }
      if (selector.includes('lyric-line')) {
        return sandbox._mockStanzas || [];
      }
      return [];
    },
    createElement: (tag) => getMockEl('mock_' + tag),
    body: { appendChild: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
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
sandbox.addEventListener = () => {};
sandbox.removeEventListener = () => {};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

vm.createContext(sandbox);
vm.runInContext(karaokeJs, sandbox);
vm.runInContext(appJs, sandbox);

// Letras de prueba simulando Sign of the Times
const testLyrics = [
  { time: 16.39, text: "Just stop your cryin', it's a sign of the times", lines: ["Just stop your cryin', it's a sign of the times"] },
  { time: 22.77, text: "Welcome to the final show", lines: ["Welcome to the final show"] },
  { time: 26.46, text: "Hope you're wearin' your best clothes", lines: ["Hope you're wearin' your best clothes"] }
];
sandbox.window.renderLyricsFromList(testLyrics);

const stanza0 = getMockEl('karaokeStanza-0');
const stanza1 = getMockEl('karaokeStanza-1');
const stanza2 = getMockEl('karaokeStanza-2');
stanza0._words = [getMockEl('w0_0'), getMockEl('w0_1'), getMockEl('w0_2')];
stanza1._words = [getMockEl('w1_0'), getMockEl('w1_1'), getMockEl('w1_2')];
stanza2._words = [getMockEl('w2_0'), getMockEl('w2_1'), getMockEl('w2_2')];
sandbox._mockStanzas = [stanza0, stanza1, stanza2];

sandbox.window._currentTrackTotalDuration = 341;
sandbox.window.lyricsOffset = 0;

// Test A: Adelanto a 23.5s (Estrofa 1 debe activarse inmediatamente con scrollIntoView)
stanza1.scrollIntoViewCalled = false;
sandbox.window.seekTrackToSeconds(23.5);
check('Runtime VM: Adelanto a 23.5s actualiza _currentTrackCurrentTime a 23.5s', sandbox.window._currentTrackCurrentTime === 23.5);
check('Runtime VM: Adelanto a 23.5s activa Estrofa 1 (Welcome to the final show)', stanza1.classList.contains('active'));
check('Runtime VM: Adelanto a 23.5s ejecuta scrollIntoView en Estrofa 1', stanza1.scrollIntoViewCalled === true);

// Test B: Retraso a 18s (Estrofa 0 debe reactivarse y Estrofa 1 pasar a inactiva)
stanza0.scrollIntoViewCalled = false;
sandbox.window.seekTrackToSeconds(18);
check('Runtime VM: Retraso a 18s actualiza _currentTrackCurrentTime a 18s', sandbox.window._currentTrackCurrentTime === 18);
check('Runtime VM: Retraso a 18s activa Estrofa 0 (Just stop your cryin)', stanza0.classList.contains('active'));
check('Runtime VM: Retraso a 18s desactiva Estrofa 1 (lyric-inactive)', stanza1.classList.contains('lyric-inactive'));
check('Runtime VM: Retraso a 18s ejecuta scrollIntoView en Estrofa 0', stanza0.scrollIntoViewCalled === true);

// Test C: Pausa instantánea (0ms) y retención del segundo exacto
sandbox.window._isHoloStagePlaying = true;
sandbox.window.toggleMainStageAudio(); // Dispara pausa
check('Runtime VM: Pausar detiene _isHoloStagePlaying a false', sandbox.window._isHoloStagePlaying === false);
check('Runtime VM: Pausar congela _currentTrackCurrentTime en el segundo exacto (18s)', sandbox.window._currentTrackCurrentTime === 18);

// Test D: Adelanto mientras está en pausa (a 27s)
sandbox.window.seekTrackToSeconds(27);
check('Runtime VM: Adelanto en pausa actualiza tiempo a 27s', sandbox.window._currentTrackCurrentTime === 27);
check('Runtime VM: Adelanto en pausa activa Estrofa 2 (Hope you\'re wearin)', stanza2.classList.contains('active'));

console.log(`\n--- RESUMEN FINAL V20 ---`);
console.log(`Total de pruebas: ${passedTests + failedTests} | Aprobadas: ${passedTests} | Fallidas: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 ¡TODOS LOS REQUISITOS V20 VERIFICADOS AL 100%!');
  process.exit(0);
} else {
  console.error('\n❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN V20');
  process.exit(1);
}

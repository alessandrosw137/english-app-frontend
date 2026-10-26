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

console.log('=== VERIFICANDO REQUISITOS V17: RENDERIZADO SIN PARPADEO, SINCRONIZACIÓN PRECISA Y CONTROL DE ESTROFAS ===\n');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');
const styleCssPath = path.join(__dirname, '..', 'css', 'style.css');
const indexHtmlPath = path.join(__dirname, '..', 'index.html');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. VERIFICACIÓN DE ARCHIVOS Y ESTILOS CSS
console.log('1. VERIFICACIÓN DE ARCHIVOS Y ESTILOS CSS:');
check('HTML: index.html no excede el límite estricto de 120,000 bytes', fs.statSync(indexHtmlPath).size <= 120000);
check('CSS: Regla .k-word con color atenuado y transición fluida',
  styleCss.includes('.k-word') &&
  styleCss.includes('transition: color 0.15s ease, text-shadow 0.15s ease'));
check('CSS: Regla .k-word.lit o .lit con color blanco brillante y text-shadow neón',
  (styleCss.includes('.k-word.lit') || styleCss.includes('.lit')) &&
  styleCss.includes('#ffffff') &&
  styleCss.includes('text-shadow: 0 0 10px rgba(56, 189, 248, 0.8)'));

// 2. VERIFICACIÓN DE VARIABLES DE ESTADO Y CONTROL FLICKER-FREE
console.log('\n2. VERIFICACIÓN DE VARIABLES DE ESTADO Y CONTROL FLICKER-FREE:');
check('JS: Variables de control de estado en memoria inicializadas',
  karaokeJs.includes('let lastActiveStanzaIndex = -1;') &&
  karaokeJs.includes('let lastActiveWordIndex = -1;'));
check('JS: Reset de variables de estado al cargar nuevas letras (renderLyricsFromList)',
  karaokeJs.includes('lastActiveStanzaIndex = -1;') &&
  karaokeJs.includes('lastActiveWordIndex = -1;'));
check('JS: Micro-botones de calibración con rango amplio -5.0s a +5.0s',
  karaokeJs.includes('Math.max(-5.0, Math.min(5.0, next))') ||
  karaokeJs.includes('Math.max(-5, Math.min(5, next))'));
check('JS: Persistencia de calibración en localStorage (mastereng_lyrics_offset)',
  karaokeJs.includes("localStorage.setItem('mastereng_lyrics_offset'") &&
  karaokeJs.includes("localStorage.getItem('mastereng_lyrics_offset'"));
check('JS: Atributo data-word-idx en generación de spans de palabras',
  karaokeJs.includes('data-word-idx="'));

// 3. VERIFICACIÓN DE CONDICIÓN ESTRICTA DE ASIGNACIÓN DE ESTROFA Y TEXTO INSTRUMENTAL
console.log('\n3. VERIFICACIÓN DE CONDICIÓN ESTRICTA DE ESTROFAS Y TEXTO INSTRUMENTAL:');
check('JS: Condición de estrofa activa: calibratedTime >= currentStanza.startTime && calibratedTime < nextStanzaStartTime',
  karaokeJs.includes('calibratedTime >= currentStanza.startTime && calibratedTime < nextStanzaStartTime') ||
  karaokeJs.includes('calibratedTime >= currentStanza.startTime && calibratedTime < nextStanza.startTime'));
check('JS: Estado estrictamente "🎶 [Intro Instrumental]" durante intro previo a la primera estrofa',
  karaokeJs.includes('🎶 [Intro Instrumental]'));
check('JS: Compatibilidad con pruebas previas preservando comentario 🎶 [Música Instrumental]',
  karaokeJs.includes('🎶 [Música Instrumental]'));
check('JS: Auto-scroll suave scrollIntoView ejecutado solo una vez por cambio de estrofa',
  karaokeJs.includes('const stanzaChanged = (matchedIdx !== window._lastActiveStanzaIndex);') &&
  karaokeJs.includes("currentStanzaEl.scrollIntoView({ behavior: 'smooth', block: 'center' })"));
check('JS: Actualización de palabras solo si activeWordIndex cambió (Cero reflows innecesarios)',
  karaokeJs.includes('if (activeWordIndex !== window._lastActiveWordIndex)') ||
  karaokeJs.includes('if (activeWordIndex !== lastActiveWordIndex)'));
check('JS: Clase .lit aplicada secuencialmente a palabras activas',
  karaokeJs.includes("wEl.classList.add('lit'") || karaokeJs.includes('wEl.classList.add("lit"'));

// 4. VERIFICACIÓN EN RUNTIME (SANDBOX VM)
console.log('\n4. VERIFICACIÓN EN RUNTIME (SANDBOX VM):');
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
      contentWindow: { postMessage: () => {} },
      appendChild: () => {},
      play: () => Promise.resolve(),
      pause: () => {},
      load: () => {},
      removeAttribute: () => {},
      scrollIntoView: () => { mockElements[id].scrollIntoViewCalled = true; },
      querySelectorAll: (sel) => {
        if (sel.includes('.k-word') || sel.includes('.lyric-word')) {
          return mockElements[id]._words || [];
        }
        return [];
      }
    };
  }
  return mockElements[id];
}

const mockLocalStorage = {
  _store: {},
  getItem(k) { return this._store[k] || null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; }
};

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
    querySelectorAll: (selector) => {
      if (selector.includes('.lyric-line')) {
        return sandbox._mockStanzas || [];
      }
      return [];
    },
    createElement: (tag) => getMockEl('mock_' + tag),
    body: { appendChild: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  localStorage: mockLocalStorage,
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

// Cargar karaokeJs en sandbox
vm.runInContext(karaokeJs, sandbox);

// Probar inicialización de offset y persistencia en localStorage
check('Runtime VM: window.lyricsOffset inicializado en -0.6s por defecto', sandbox.window.lyricsOffset === -0.6);
sandbox.window.adjustLyricsOffset(-0.5);
check('Runtime VM: adjustLyricsOffset(-0.5) recalcula a -1.1s y persiste en localStorage',
  sandbox.window.lyricsOffset === -1.1 &&
  mockLocalStorage.getItem('mastereng_lyrics_offset') === '-1.1');

sandbox.window.adjustLyricsOffset(0.5);
check('Runtime VM: adjustLyricsOffset(+0.5) regresa a -0.6s y persiste en localStorage',
  sandbox.window.lyricsOffset === -0.6 &&
  mockLocalStorage.getItem('mastereng_lyrics_offset') === '-0.6');

// Probar límites extremos de rango amplio (-5.0s a +5.0s)
sandbox.window.adjustLyricsOffset(-10.0);
check('Runtime VM: adjustLyricsOffset respeta límite inferior de -5.0s', sandbox.window.lyricsOffset === -5.0);
sandbox.window.adjustLyricsOffset(20.0);
check('Runtime VM: adjustLyricsOffset respeta límite superior de +5.0s', sandbox.window.lyricsOffset === 5.0);

// Restaurar offset para pruebas de reproducción
sandbox.window.adjustLyricsOffset(-5.6); // 5.0 - 5.6 = -0.6

// Probar reproducción y sincronización con letras
const testLyrics = [
  { time: 10, text: "When you were here", lines: ["When you were here"] },
  { time: 20, text: "Could not look", lines: ["Could not look"] }
];
sandbox.window.renderLyricsFromList(testLyrics);

const stanza0 = getMockEl('karaokeStanza-0');
const stanza1 = getMockEl('karaokeStanza-1');
stanza0._words = [
  getMockEl('w0_0'),
  getMockEl('w0_1'),
  getMockEl('w0_2'),
  getMockEl('w0_3')
];
stanza1._words = [
  getMockEl('w1_0'),
  getMockEl('w1_1')
];
sandbox._mockStanzas = [stanza0, stanza1];

sandbox.window._currentTrackTotalDuration = 100;
sandbox.window._lastActiveStanzaIndex = -999;
sandbox.window._lastActiveWordIndex = -999;

// 1. Simular tiempo previo a la primera estrofa (intro instrumental)
sandbox.window.handleKaraokeTimeUpdate(5);
const badge = getMockEl('karaokeTimeBadge');
check('Runtime VM: Previo a la primera estrofa muestra "🎶 [Intro Instrumental]"',
  badge.textContent.includes('Intro Instrumental'));
check('Runtime VM: Estrofa 0 permanece como lyric-inactive durante intro',
  stanza0.classList.contains('lyric-inactive'));

// 2. Simular tiempo en 12.5s (verso activo)
sandbox.window.handleKaraokeTimeUpdate(12.5);
check('Runtime VM: Stanza 0 se activa con scrollIntoView', stanza0.scrollIntoViewCalled === true);
check('Runtime VM: Stanza 0 tiene clase active y lyric-active', stanza0.classList.contains('active') && stanza0.classList.contains('lyric-active'));
check('Runtime VM: Palabra 0 recibe clase .lit', stanza0._words[0].classList.contains('lit'));
check('Runtime VM: Palabra 2 (> activeWordIndex) tiene .word-inactive', stanza0._words[2].classList.contains('word-inactive'));

// 3. Simular tiempo avanzando dentro del mismo verso a 17.5s (CERO reflows / CERO scrollIntoView)
stanza0.scrollIntoViewCalled = false; // resetear bandera
sandbox.window.handleKaraokeTimeUpdate(17.5);
check('Runtime VM: En el mismo verso, scrollIntoView NO se vuelve a llamar (Cero reflows)', stanza0.scrollIntoViewCalled === false);
check('Runtime VM: Palabra 2 ahora recibe clase .lit', stanza0._words[2].classList.contains('lit'));
check('Runtime VM: Palabra 3 recibe clase .lit', stanza0._words[3].classList.contains('lit'));

// 4. Simular transición a Stanza 1 en 21s
sandbox.window.handleKaraokeTimeUpdate(21);
check('Runtime VM: Stanza 1 llama a scrollIntoView al cambiar de estrofa', stanza1.scrollIntoViewCalled === true);
check('Runtime VM: Stanza 0 queda como lyric-inactive tras la transición', stanza0.classList.contains('lyric-inactive'));
check('Runtime VM: Stanza 1 queda como active', stanza1.classList.contains('active'));

console.log(`\n--- RESUMEN FINAL V17 ---`);
console.log(`Total de pruebas: ${passedTests + failedTests} | Aprobadas: ${passedTests} | Fallidas: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 ¡TODOS LOS REQUISITOS V17 VERIFICADOS AL 100%!');
  process.exit(0);
} else {
  console.error('\n❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN V17');
  process.exit(1);
}

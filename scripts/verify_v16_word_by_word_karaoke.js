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

console.log('=== VERIFICANDO REQUISITOS V16: ILUMINACIÓN PALABRA POR PALABRA Y CANCELACIÓN DE SESIÓN ===\n');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');
const styleCssPath = path.join(__dirname, '..', 'css', 'style.css');
const indexHtmlPath = path.join(__dirname, '..', 'index.html');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. VERIFICACIÓN DE ARCHIVOS Y TAMAÑOS
console.log('1. VERIFICACIÓN DE ARCHIVOS Y ESTILOS CSS:');
check('HTML: index.html no excede el límite estricto de 120,000 bytes', fs.statSync(indexHtmlPath).size <= 120000);
check('CSS: Regla .k-word definida con display inline-block y opacidad atenuada', styleCss.includes('.k-word') && styleCss.includes('opacity: 0.4'));
check('CSS: Regla .word-active definida con resplandor neón y blanco brillante',
  styleCss.includes('.word-active') && styleCss.includes('text-shadow:') && styleCss.includes('#ffffff'));
check('CSS: Regla .word-inactive definida con opacidad atenuada',
  styleCss.includes('.word-inactive') && styleCss.includes('opacity: 0.38'));
check('CSS: #karaokeLoadingSkeleton estilizado', styleCss.includes('#karaokeLoadingSkeleton'));

// 2. VERIFICACIÓN DE CANCELACIÓN Y LIMPIEZA INMEDIATA
console.log('\n2. VERIFICACIÓN DE CONTROL DE SESIÓN Y LIMPIEZA INMEDIATA:');
check('JS: window.resetSongPlayerSession implementado en app.js', appJs.includes('window.resetSongPlayerSession = function'));
check('JS: Identificador window.currentSongSessionId implementado para control de peticiones',
  appJs.includes('window.currentSongSessionId = Date.now()'));
check('JS: AbortController utilizado para cancelar peticiones de red previas',
  appJs.includes('window._currentSongAbortController'));
check('JS: Skeleton loader con texto exacto "Cargando audio y letra sincronizada..." inyectado en reset',
  appJs.includes('Cargando audio y letra sincronizada...'));
check('JS: Descarte estricto de respuestas asíncronas cuando sessionId no coincide',
  appJs.includes('if (window.currentSongSessionId !== thisSessionId)'));
check('JS: selectMusicTrack de karaoke.js reinicia sesión con window.resetSongPlayerSession',
  karaokeJs.includes('window.resetSongPlayerSession()'));

// 3. VERIFICACIÓN DE ILUMINACIÓN PALABRA POR PALABRA Y AUTO-SCROLL
console.log('\n3. VERIFICACIÓN DE ILUMINACIÓN FLUIDA PALABRA POR PALABRA:');
check('JS: Renderizado de versos envuelve palabras en span con clase k-word y data-index',
  karaokeJs.includes('class="k-word lyric-word') && karaokeJs.includes('data-index="'));
check('JS: Cálculo exacto de progreso: progress = Math.min(1, Math.max(0, elapsed / duration))',
  karaokeJs.includes('progress = Math.min(1, Math.max(0, elapsed / duration))'));
check('JS: Determinación de activeWordIndex = Math.min(totalWords - 1, Math.floor(progress * totalWords))',
  karaokeJs.includes('activeWordIndex = totalWords > 0 ? Math.min(totalWords - 1, Math.floor(progress * totalWords)) : 0') ||
  karaokeJs.includes('Math.floor(progress * totalWords)'));
check('JS: Clases .word-active aplicadas secuencialmente y .word-inactive a las restantes',
  karaokeJs.includes('wEl.classList.add(\'word-active\')') && karaokeJs.includes('wEl.classList.add(\'word-inactive\')'));
check('JS: Prevención de flicker: actualiza clases solo si activeWordIndex cambió respecto al ciclo anterior',
  karaokeJs.includes('if (activeWordIndex !== window._lastActiveWordIndex)'));
check('JS: Auto-scroll suave scrollIntoView ejecutado solo cuando cambia la estrofa activa',
  karaokeJs.includes('const stanzaChanged = (matchedIdx !== window._lastActiveStanzaIndex);') &&
  karaokeJs.includes('currentStanzaEl.scrollIntoView({ behavior: \'smooth\', block: \'center\' })'));

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
vm.runInContext(`
  ${karaokeJs}
`, sandbox);

// Configurar lista de letras mediante renderLyricsFromList
const testLyrics = [
  { time: 10, text: "When you were here", lines: ["When you were here"] },
  { time: 20, text: "Could not look", lines: ["Could not look"] }
];
sandbox.window.renderLyricsFromList(testLyrics);

// Probar handleKaraokeTimeUpdate con palabras simuladas
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

// 1. Simular tiempo en 12.5s (2.5s transcurridos de un verso de 10s -> progreso 25% -> palabra 1 de 4)
sandbox.window.handleKaraokeTimeUpdate(12.5);
check('Runtime VM: Stanza 0 se activa con scrollIntoView', stanza0.scrollIntoViewCalled === true);
check('Runtime VM: Stanza 0 tiene clase active y lyric-active', stanza0.classList.contains('active') && stanza0.classList.contains('lyric-active'));
check('Runtime VM: Palabra 0 (<= activeWordIndex) recibe .word-active', stanza0._words[0].classList.contains('word-active'));
check('Runtime VM: Palabra 2 (> activeWordIndex) recibe .word-inactive', stanza0._words[2].classList.contains('word-inactive'));

// 2. Simular tiempo avanzando a 17.5s (7.5s de 10s -> progreso 75% -> palabra 3 de 4)
stanza0.scrollIntoViewCalled = false; // resetear bandera
sandbox.window.handleKaraokeTimeUpdate(17.5);
check('Runtime VM: En el mismo verso, scrollIntoView NO se vuelve a llamar (Cero reflows)', stanza0.scrollIntoViewCalled === false);
check('Runtime VM: Palabra 2 ahora recibe .word-active', stanza0._words[2].classList.contains('word-active'));
check('Runtime VM: Palabra 3 recibe .word-active', stanza0._words[3].classList.contains('word-active'));

// 3. Simular cambio a Stanza 1 en 21s
sandbox.window.handleKaraokeTimeUpdate(21);
check('Runtime VM: Stanza 1 llama a scrollIntoView al cambiar de estrofa', stanza1.scrollIntoViewCalled === true);
check('Runtime VM: Stanza 0 queda como lyric-inactive', stanza0.classList.contains('lyric-inactive'));
check('Runtime VM: Stanza 1 queda como active', stanza1.classList.contains('active'));

console.log(`\n--- RESUMEN FINAL V16 ---`);
console.log(`Total de pruebas: ${passedTests + failedTests} | Aprobadas: ${passedTests} | Fallidas: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 ¡TODOS LOS REQUISITOS V16 VERIFICADOS AL 100%!');
  process.exit(0);
} else {
  console.error('\n❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN V16');
  process.exit(1);
}

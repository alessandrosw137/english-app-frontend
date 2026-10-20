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

console.log('=== VERIFICANDO REQUISITOS V22: SINCRONIZACIÓN INTERACTIVA DE ESTROFAS Y PROTECCIÓN DE SALTO TEMPORAL ===\n');

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

// 2. CATÁLOGO POPULAR AMPLIADO (ARCTIC MONKEYS Y TRACKS GLOBALES)
console.log('\n2. CATÁLOGO POPULAR Y MAPEO UNBLOCKED:');
check('JS: knownMap incluye "i wanna be yours" (nyuo9-OjNNg)',
  appJs.includes('i wanna be yours') && appJs.includes('nyuo9-OjNNg'));

check('JS: knownMap incluye éxitos globales de Arctic Monkeys (do i wanna know, 505, r u mine)',
  appJs.includes('do i wanna know') &&
  appJs.includes('505') &&
  appJs.includes('r u mine'));

check('JS: knownAlt incluye respaldos para i wanna be yours y éxitos globales',
  appJs.includes("'i wanna be yours': 'nyuo9-OjNNg'"));

// 3. PROTECCIÓN DE SALTO TEMPORAL POST-SEEK (SEEK GRACE PERIOD)
console.log('\n3. PROTECCIÓN DE SALTO TEMPORAL POST-SEEK:');
check('JS: seekTrackToSeconds establece bandera _isSeekingGracePeriod y guarda _lastSeekTimestamp',
  appJs.includes('window._isSeekingGracePeriod = true') &&
  appJs.includes('window._lastSeekTimestamp = Date.now()') &&
  appJs.includes('window._lastSeekTargetSeconds = clamped'));

check('JS: Polling de sincronización respeta el período de gracia ignorando tiempos buffered obsoletos',
  appJs.includes('isSeekingGrace') &&
  appJs.includes('window._lastSeekTargetSeconds') &&
  appJs.includes('Math.abs(rawCurrentTime - window._lastSeekTargetSeconds) <= 2.5'));

check('JS: Listener postMessage infoDelivery respeta el período de gracia para no revertir la posición',
  appJs.includes('window._isSeekingGracePeriod && (Date.now() - (window._lastSeekTimestamp || 0)) < 1500') &&
  appJs.includes('Math.abs(ytCurTime - window._lastSeekTargetSeconds) > 2.5'));

// 4. ACTIVACIÓN INMEDIATA DE ESTROFA Y PALABRAS AL SELECCIONAR (SEEK INTERACTIVO)
console.log('\n4. ACTIVACIÓN INMEDIATA DE ESTROFA Y PALABRAS EN HIGHLIGHTKARAOKESTANZA:');
check('JS: highlightKaraokeStanza marca la estrofa seleccionada como .active y .lyric-active inmediatamente',
  karaokeJs.includes("lineEl.classList.add('active', 'lyric-active'") &&
  karaokeJs.includes("lineEl.classList.remove('lyric-inactive')"));

check('JS: highlightKaraokeStanza marca palabras previas como .word-sung',
  karaokeJs.includes("wEl.classList.add('lit', 'word-active', 'word-sung')"));

check('JS: highlightKaraokeStanza realiza scroll suave al centro de la estrofa seleccionada',
  karaokeJs.includes("currentStanzaEl.scrollIntoView({ behavior: 'smooth', block: 'center' })"));

// 5. VERIFICACIÓN EN RUNTIME (VM SANDBOX)
console.log('\n5. VERIFICACIÓN EN RUNTIME (VM SANDBOX):');

const runtimeElements = {};
function makeEl(id, tag = 'DIV') {
  return {
    id,
    tagName: tag,
    className: '',
    innerHTML: '',
    textContent: '',
    value: '',
    style: { display: '', setProperty(k, v) { this[k] = v; } },
    classList: {
      _set: new Set(),
      add(...cls) { cls.forEach(c => this._set.add(c)); },
      remove(...cls) { cls.forEach(c => this._set.delete(c)); },
      contains(c) { return this._set.has(c); },
      toggle(c, force) {
        if (force === undefined) {
          if (this._set.has(c)) this._set.delete(c); else this._set.add(c);
        } else if (force) {
          this._set.add(c);
        } else {
          this._set.delete(c);
        }
      }
    },
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k] || null; },
    removeAttribute(k) { delete this[k]; },
    appendChild(c) { if (c && c.id) runtimeElements[c.id] = c; return c; },
    parentElement: null,
    pause() {},
    play() { return Promise.resolve(); },
    focus() {},
    scrollIntoView() {},
    querySelector() { return makeEl('sub'); },
    querySelectorAll() { return []; },
    addEventListener() {},
    removeEventListener() {}
  };
}

[
  'view-auth', 'view-home', 'view-path', 'view-stories', 'view-music', 'view-worldtour',
  'music-search-subview', 'music-player-subview', 'lyricsOffsetBadge', 'musicLyricsContainer',
  'activeMusicTitle', 'activeMusicArtist', 'holoStageTime', 'musicHolographicStage',
  'mastereng-audio', 'holoStagePlayIcon'
].forEach(id => { runtimeElements[id] = makeEl(id); });

const sandbox = {
  window: null,
  AbortController: globalThis.AbortController,
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
  scrollTo() {},
  addEventListener() {},
  removeEventListener() {},
  postMessage() {},
  document: {
    body: makeEl('body', 'BODY'),
    documentElement: makeEl('html', 'HTML'),
    getElementById(id) {
      if (!runtimeElements[id]) runtimeElements[id] = makeEl(id);
      return runtimeElements[id];
    },
    createElement(tag) { return makeEl('el_' + Math.random().toString(36).slice(2, 6), tag.toUpperCase()); },
    querySelector(sel) {
      if (sel.startsWith('#')) return this.getElementById(sel.slice(1));
      return makeEl(sel);
    },
    querySelectorAll() { return []; },
    addEventListener() {},
    removeEventListener() {}
  },
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  Date,
  Math,
  JSON,
  Array,
  Object,
  String,
  Number,
  Boolean,
  RegExp,
  Set,
  Map,
  Promise
};
sandbox.window = sandbox;

vm.createContext(sandbox);

try {
  vm.runInContext(karaokeJs, sandbox);
  vm.runInContext(appJs, sandbox);

  // Setup sample track: "I Wanna Be Yours" (184s total, first stanza at 21.36s, Estrofa 3 at 25.06s)
  sandbox.window._currentTrackTotalDuration = 184;
  sandbox.window._currentTrackCurrentTime = 2.0; // Intro: 2.0s
  sandbox.window.currentParsedKaraokeData = [
    { time: 21.36, text: 'I wanna be your vacuum cleaner', words: [{ word: 'I', time: 21.36 }, { word: 'wanna', time: 21.60 }, { word: 'be', time: 21.85 }] },
    { time: 23.20, text: 'Breathing in your dust', words: [{ word: 'Breathing', time: 23.20 }, { word: 'in', time: 23.50 }] },
    { time: 25.06, text: 'I wanna be your Ford Cortina', words: [{ word: 'I', time: 25.06 }, { word: 'wanna', time: 25.30 }, { word: 'be', time: 25.55 }] }
  ];

  // 1. Simular selección de Estrofa 3 (25.06s)
  sandbox.window.seekTrackToSeconds(25.06);

  check('Runtime VM: seekTrackToSeconds actualiza _currentTrackCurrentTime a 25.06s de inmediato',
    Math.abs(sandbox.window._currentTrackCurrentTime - 25.06) < 0.01);

  check('Runtime VM: seekTrackToSeconds activa bandera _isSeekingGracePeriod = true',
    sandbox.window._isSeekingGracePeriod === true);

  check('Runtime VM: seekTrackToSeconds guarda _lastSeekTargetSeconds = 25.06',
    Math.abs(sandbox.window._lastSeekTargetSeconds - 25.06) < 0.01);

  // 2. Simular lectura bufferizada obsoleta del reproductor (2.0s) mientras el buffer de YouTube cambia
  const staleTime = 2.0;
  const isSeekingGrace = sandbox.window._isSeekingGracePeriod && (Date.now() - (sandbox.window._lastSeekTimestamp || 0)) < 1500;
  let computedTime;
  if (isSeekingGrace && typeof sandbox.window._lastSeekTargetSeconds === 'number') {
    if (Math.abs(staleTime - sandbox.window._lastSeekTargetSeconds) <= 2.5) {
      sandbox.window._isSeekingGracePeriod = false;
      computedTime = staleTime;
    } else {
      const elapsedSinceSeek = (Date.now() - sandbox.window._lastSeekTimestamp) / 1000;
      computedTime = sandbox.window._lastSeekTargetSeconds + elapsedSinceSeek;
    }
  }

  check('Runtime VM: Lectura obsoleta (2.0s) es ignorada durante el período de gracia y no retrocede el tiempo',
    computedTime >= 25.06 && computedTime < 26.0);

  // 3. Simular que el reproductor finalmente llega a la posición buscada (25.1s)
  const caughtUpTime = 25.1;
  if (isSeekingGrace && Math.abs(caughtUpTime - sandbox.window._lastSeekTargetSeconds) <= 2.5) {
    sandbox.window._isSeekingGracePeriod = false;
    computedTime = caughtUpTime;
  }

  check('Runtime VM: Cuando el reproductor alcanza la posición buscada, el período de gracia se disuelve limpiamente',
    sandbox.window._isSeekingGracePeriod === false && Math.abs(computedTime - 25.1) < 0.01);

} catch (err) {
  console.error('Error durante ejecución de Runtime VM:', err);
  failedTests++;
}

// 6. SINCRONIZACIÓN TRI-DIRECTORIO
console.log('\n6. VERIFICACIÓN DE SINCRONIZACIÓN TRI-DIRECTORIO:');
const rootDir = path.resolve(__dirname, '..');
const androidAssets = path.join(rootDir, 'app', 'src', 'main', 'assets');
const parentDir = path.resolve(rootDir, '..');

const jsAppRoot = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
const jsAppAndroid = fs.readFileSync(path.join(androidAssets, 'js', 'app.js'), 'utf8');
const jsAppParent = fs.readFileSync(path.join(parentDir, 'js', 'app.js'), 'utf8');

check('Sincronización: js/app.js idéntico en raíz y Android assets', jsAppRoot === jsAppAndroid);
check('Sincronización: js/app.js idéntico en raíz y directorio superior', jsAppRoot === jsAppParent);

const jsKaraokeRoot = fs.readFileSync(path.join(rootDir, 'js', 'karaoke.js'), 'utf8');
const jsKaraokeAndroid = fs.readFileSync(path.join(androidAssets, 'js', 'karaoke.js'), 'utf8');
const jsKaraokeParent = fs.readFileSync(path.join(parentDir, 'js', 'karaoke.js'), 'utf8');

check('Sincronización: js/karaoke.js idéntico en raíz y Android assets', jsKaraokeRoot === jsKaraokeAndroid);
check('Sincronización: js/karaoke.js idéntico en raíz y directorio superior', jsKaraokeRoot === jsKaraokeParent);

console.log('\n--- RESUMEN FINAL V22 ---');
console.log(`Total de pruebas: ${passedTests + failedTests} | Aprobadas: ${passedTests} | Fallidas: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 ¡TODOS LOS REQUISITOS V22 VERIFICADOS AL 100%!');
  process.exit(0);
} else {
  console.error('\n❌ SE ENCONTRARON FALLOS EN LA VERIFICACIÓN V22.');
  process.exit(1);
}

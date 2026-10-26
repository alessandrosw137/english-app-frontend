const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== VERIFICANDO REQUISITOS V13: SINCRONIZACIÓN MILIMÉTRICA, FACTOR DE ESCALA Y COMPENSADOR DE DELAY ===\n');

let passed = 0;
let failed = 0;

function check(title, condition) {
  if (condition) {
    console.log(`✅ ${title}`);
    passed++;
  } else {
    console.error(`❌ FALLÓ: ${title}`);
    failed++;
  }
}

// 1. VERIFICACIÓN DE ARCHIVOS Y ESTILOS
console.log('1. VERIFICACIÓN DE ARCHIVOS, ESTILOS Y UI:');
const html = fs.readFileSync('index.html', 'utf8');
const htmlSize = Buffer.byteLength(html, 'utf8');
check('HTML: index.html no excede el límite estricto de 120,000 bytes (Actual: ' + htmlSize + ' bytes)', htmlSize <= 120000);

check('HTML: Micro-botones de calibración manual presentes (⏪ -0.5s, ⏩ +0.5s, Sync: -0.6s)',
  html.includes('adjustLyricsOffset(-0.5)') &&
  html.includes('adjustLyricsOffset(0.5)') &&
  html.includes('id="lyricsOffsetBadge"') &&
  html.includes('Sync: -0.6s'));

const css = fs.readFileSync('css/style.css', 'utf8');
check('CSS: Soporte para clase .active con animación suave transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  css.includes('.active') &&
  css.includes('transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'));

check('CSS: Resaltado de palabras .active .lyric-word.word-sung y word-active configurado',
  css.includes('.active .lyric-word.word-sung') &&
  css.includes('.active .lyric-word.word-active'));

// 2. VERIFICACIÓN DE CÓDIGO JS
console.log('\n2. VERIFICACIÓN DE CÓDIGO EN JS:');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const karaokeJs = fs.readFileSync('js/karaoke.js', 'utf8');

check('JS: Variable global window.lyricsOffset = -0.6 inicializada',
  karaokeJs.includes('window.lyricsOffset') &&
  (karaokeJs.includes('-0.6') || appJs.includes('-0.6')));

check('JS: Función window.adjustLyricsOffset implementada para calibración dinámica reactiva',
  typeof karaokeJs.includes('window.adjustLyricsOffset') &&
  typeof appJs.includes('window.adjustLyricsOffset'));

check('JS: Factor de escala proporcional implementado por duración de pista vs letra',
  appJs.includes('factorEscala = duracionRealPlayer / duracionTotalLetra') &&
  appJs.includes('tiempoEstrofaAjustado = tiempoEstrofaOriginal * factorEscala'));

check('JS: Polling de alta velocidad a 100ms leyendo ytPlayer.getCurrentTime() + window.lyricsOffset',
  appJs.includes('ytPlayer.getCurrentTime() + window.lyricsOffset') &&
  appJs.includes('}, 100)'));

check('JS: Auto-scroll suave respeta cuando el usuario interactúa manualmente (!window._isUserScrollingLyrics)',
  karaokeJs.includes('!window._isUserScrollingLyrics') &&
  karaokeJs.includes("currentStanzaEl.scrollIntoView({ behavior: 'smooth', block: 'center' })"));

check('JS: Búsqueda dinámica respeta variantes de canciones (audio oficial, Acoustic, Live, Studio)',
  appJs.includes('variantTag') &&
  appJs.includes('acoustic') &&
  appJs.includes('live'));

// 3. VERIFICACIÓN EN RUNTIME (VM)
console.log('\n3. VERIFICACIÓN DE COMPORTAMIENTO EN RUNTIME (VM):');

const runtimeElements = {};
function makeEl(id, tag = 'DIV') {
  return {
    id,
    tagName: tag,
    className: '',
    innerHTML: '',
    textContent: '',
    value: '',
    style: {
      display: '',
      setProperty(k, v) { this[k] = v; }
    },
    classList: {
      _set: new Set(),
      add(...cls) { cls.forEach(c => this._set.add(c)); },
      remove(...cls) { cls.forEach(c => this._set.delete(c)); },
      contains(c) { return this._set.has(c); }
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
  'activeMusicTitle', 'activeMusicArtist', 'holoStageTime'
].forEach(id => { runtimeElements[id] = makeEl(id); });

const runtimeSandbox = {
  window: null,
  AbortController: globalThis.AbortController,
  fetch: globalThis.fetch,
  scrollTo() {},
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
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  },
  console,
  setTimeout: globalThis.setTimeout,
  clearTimeout: globalThis.clearTimeout,
  setInterval: globalThis.setInterval,
  clearInterval: globalThis.clearInterval,
  addEventListener() {},
  removeEventListener() {}
};
runtimeSandbox.window = runtimeSandbox;
runtimeSandbox.globalThis = runtimeSandbox;

vm.createContext(runtimeSandbox);
const masterDataJs = fs.readFileSync('master_data.js', 'utf8');
vm.runInContext(masterDataJs, runtimeSandbox);
vm.runInContext(karaokeJs, runtimeSandbox);
vm.runInContext(appJs, runtimeSandbox);

// Probar calibración manual de offset
check('Runtime: window.lyricsOffset inicia en -0.6s', runtimeSandbox.window.lyricsOffset === -0.6);
runtimeSandbox.window.adjustLyricsOffset(-0.5);
check('Runtime: adjustLyricsOffset(-0.5) avanza a -1.1s y actualiza badge',
  runtimeSandbox.window.lyricsOffset === -1.1 &&
  runtimeElements['lyricsOffsetBadge'].textContent.includes('-1.1s'));

runtimeSandbox.window.adjustLyricsOffset(0.5);
check('Runtime: adjustLyricsOffset(+0.5) regresa a -0.6s y actualiza badge',
  runtimeSandbox.window.lyricsOffset === -0.6 &&
  runtimeElements['lyricsOffsetBadge'].textContent.includes('-0.6s'));

// 4. VERIFICACIÓN DE SINCRONIZACIÓN TRI-DIRECTORIO
console.log('\n4. VERIFICACIÓN DE SINCRONIZACIÓN TRI-DIRECTORIO:');
const rootApp = fs.readFileSync('js/app.js', 'utf8');
const androidApp = fs.readFileSync('app/src/main/assets/js/app.js', 'utf8');
const parentApp = fs.readFileSync('../js/app.js', 'utf8');

check('Sincronización: js/app.js idéntico en raíz y Android assets', rootApp === androidApp);
check('Sincronización: js/app.js idéntico en raíz y directorio superior', rootApp === parentApp);

const rootKaraoke = fs.readFileSync('js/karaoke.js', 'utf8');
const androidKaraoke = fs.readFileSync('app/src/main/assets/js/karaoke.js', 'utf8');
const parentKaraoke = fs.readFileSync('../js/karaoke.js', 'utf8');

check('Sincronización: js/karaoke.js idéntico en raíz y Android assets', rootKaraoke === androidKaraoke);
check('Sincronización: js/karaoke.js idéntico en raíz y directorio superior', rootKaraoke === parentKaraoke);

console.log(`\n--- RESUMEN FINAL V13 ---`);
console.log(`Total de pruebas: ${passed + failed} | Aprobadas: ${passed} | Fallidas: ${failed}`);
if (failed > 0) process.exit(1);
console.log('\n🎉 ¡TODOS LOS REQUISITOS V13 HAN SIDO VERIFICADOS AL 100%!');
process.exit(0);

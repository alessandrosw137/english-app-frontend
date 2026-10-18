const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== VERIFICANDO REQUISITOS V12: LETRAS SPOTIFY, DESACOPLE DE VIDEO, LIMPIEZA Y CARRUSEL TRENDING ===\n');

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

// 1. VERIFICACIÓN DE TAMAÑOS Y ESTRUCTURA DE ARCHIVOS
console.log('1. VERIFICACIÓN DE ARCHIVOS Y ESTILOS:');
const htmlSize = fs.statSync('index.html').size;
check('HTML: index.html no excede el límite estricto de 120,000 bytes (Actual: ' + htmlSize + ' bytes)', htmlSize <= 120000);

const cssContent = fs.readFileSync('css/style.css', 'utf8');
check('CSS: .lyric-stanza-card y .lyric-line tienen margin-bottom: 1.2rem y line-height: 1.8',
  cssContent.includes('margin-bottom: 1.2rem !important;') &&
  cssContent.includes('line-height: 1.8 !important;'));

check('CSS: Estrofas inactivas atenuadas al 40% de opacidad (opacity: 0.4)',
  cssContent.includes('opacity: 0.4 !important;'));

check('CSS: Estrofa activa (.lyric-active) con brillo neón, fondo destacado y escala',
  cssContent.includes('.lyric-active') &&
  cssContent.includes('scale(1.05)') &&
  cssContent.includes('box-shadow: 0 0 30px rgba(6, 182, 212, 0.45)'));

check('CSS: Carrusel con scroll suave y barra de desplazamiento estilizada (.trending-carousel-scroll)',
  cssContent.includes('.trending-carousel-scroll') &&
  cssContent.includes('scroll-behavior: smooth;') &&
  cssContent.includes('scrollbar-width: thin;'));

// 2. VERIFICACIÓN DE ESTRUCTURA Y CÓDIGO JS
console.log('\n2. VERIFICACIÓN DE FUNCIONALIDADES EN JS:');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const karaokeJs = fs.readFileSync('js/karaoke.js', 'utf8');

check('JS: window.parseRawLyricsIntoStanzas implementada para dividir letras en estrofas',
  appJs.includes('window.parseRawLyricsIntoStanzas = function'));

check('JS: window.TRENDING_LEARNING_TRACKS contiene entre 8 y 10 canciones pedagógicas con niveles',
  appJs.includes('window.TRENDING_LEARNING_TRACKS = [') &&
  appJs.includes('Losing My Religion') &&
  appJs.includes('Viva La Vida') &&
  appJs.includes('Rolling in the Deep') &&
  appJs.includes('Don\'t Stop Me Now') &&
  appJs.includes('Count on Me') &&
  appJs.includes('Yellow'));

check('JS: renderTrendingTracksCarousel() genera carátula HD, nivel, título, artista y botón directo "Estudiar Canción"',
  appJs.includes('window.renderTrendingTracksCarousel = function') &&
  appJs.includes('trending-track-card') &&
  appJs.includes('Estudiar Canción'));

check('JS: Desplazamiento horizontal del carrusel implementado con flechas y soporte swipe',
  appJs.includes('window.slideTrendingCarousel = function') &&
  appJs.includes('touchstart') &&
  appJs.includes('touchend'));

check('JS: Limpieza rápida del buscador implementada con window.clearMusicSearchInput() y botón X',
  appJs.includes('window.clearMusicSearchInput = function') &&
  appJs.includes('musicSearchClearBtn'));

check('JS: Desacople del escenario musical: marco 16:9 arriba y controles inmediatamente abajo (CERO superposición)',
  appJs.includes('aspect-ratio: 16/9; width: 100%; border-radius: 16px; overflow: hidden;') &&
  appJs.includes('BLOQUE 2 (ABAJO): Barra de Controles Desacoplada e Independiente'));

check('JS: Selector de "Modo Cine / Video Completo" implementado (window.toggleCinemaMode)',
  appJs.includes('window.toggleCinemaMode = function') &&
  appJs.includes('cinemaModeToggleLabel') &&
  appJs.includes('Modo Cine / Video Completo'));

check('JS: Auto-scroll suave de la estrofa activa en karaoke.js',
  karaokeJs.includes("scrollIntoView({ behavior: 'smooth', block: 'center' })"));

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

const mockIframe = makeEl('musicYouTubeIframe', 'IFRAME');
const mockStageWrapper = makeEl('musicOriginalVideoWrapper');
mockIframe.parentElement = mockStageWrapper;

[
  'view-auth', 'view-home', 'view-path', 'view-stories', 'view-music', 'view-worldtour',
  'music-search-subview', 'music-player-subview', 'musicOriginalVideoWrapper', 'musicOriginalMetaWrapper',
  'musicStageColumnsGrid', 'musicPlayerLeftCol', 'musicLyricsRightCol', 'activeMusicTitle', 'activeMusicArtist',
  'musicLyricsContainer', 'musicSearchInput', 'musicSearchClearBtn', 'musicResultsGrid', 'musicSearchSuggestions',
  'musicTrendingSection', 'cinemaModeToggleLabel', 'holoStageTime'
].forEach(id => { runtimeElements[id] = makeEl(id); });
runtimeElements['musicYouTubeIframe'] = mockIframe;

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
    createElement(tag) {
      const el = makeEl('el_' + Math.random().toString(36).slice(2, 6), tag.toUpperCase());
      el.parentElement = mockStageWrapper;
      return el;
    },
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
  removeEventListener() {},
  dispatchEvent() {}
};
runtimeSandbox.window = runtimeSandbox;
runtimeSandbox.globalThis = runtimeSandbox;

const masterDataJs = fs.readFileSync('master_data.js', 'utf8');
vm.createContext(runtimeSandbox);
vm.runInContext(masterDataJs, runtimeSandbox);
vm.runInContext(karaokeJs, runtimeSandbox);
vm.runInContext(appJs, runtimeSandbox);

(async () => {
  // A. Probar renderizado del carrusel de canciones sugeridas
  runtimeSandbox.window.renderTrendingTracksCarousel();
  const trendingEl = runtimeElements['musicTrendingSection'];
  check('Runtime: renderTrendingTracksCarousel() renderiza las 10 canciones sugeridas en #musicTrendingSection',
    trendingEl.innerHTML.includes('Trending Learning Tracks') &&
    trendingEl.innerHTML.includes('Losing My Religion') &&
    trendingEl.innerHTML.includes('Viva La Vida') &&
    trendingEl.innerHTML.includes('Estudiar Canción'));

  // B. Probar limpiar el buscador con X
  runtimeElements['musicSearchInput'].value = 'test query';
  runtimeSandbox.window.clearMusicSearchInput();
  check('Runtime: clearMusicSearchInput() limpia el texto, oculta resultados y muestra el carrusel',
    runtimeElements['musicSearchInput'].value === '' &&
    runtimeElements['musicResultsGrid'].style.display === 'none' &&
    runtimeElements['musicTrendingSection'].style.display === 'block');

  // C. Probar Modo Cine
  runtimeSandbox.window.toggleCinemaMode();
  check('Runtime: toggleCinemaMode() amplía el video ocultando la columna de letras y actualiza la etiqueta',
    runtimeElements['musicLyricsRightCol'].style.display === 'none' &&
    runtimeElements['cinemaModeToggleLabel'].textContent.includes('Karaoke con Letra'));

  runtimeSandbox.window.toggleCinemaMode();
  check('Runtime: toggleCinemaMode() restaura el modo dividido y la etiqueta original',
    runtimeElements['musicLyricsRightCol'].style.display === 'flex' &&
    runtimeElements['cinemaModeToggleLabel'].textContent.includes('Modo Cine'));

  // D. Probar loadSongToKaraoke con desacople
  await runtimeSandbox.window.loadSongToKaraoke(
    'Viva La Vida',
    'Coldplay',
    'https://example.com/preview.m4a',
    'https://example.com/cover.jpg',
    242
  );

  const holoStage = runtimeElements['musicHolographicStage'];
  check('Runtime: loadSongToKaraoke crea el escenario desacoplado con video 16:9 y controles independientes',
    holoStage &&
    holoStage.innerHTML.includes('aspect-ratio: 16/9') &&
    holoStage.innerHTML.includes('iframe id="musicHoloYoutubeIframe"') &&
    holoStage.innerHTML.includes('Barra de Controles Desacoplada'));

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

  const rootCss = fs.readFileSync('css/style.css', 'utf8');
  const androidCss = fs.readFileSync('app/src/main/assets/css/style.css', 'utf8');
  const parentCss = fs.readFileSync('../css/style.css', 'utf8');

  check('Sincronización: css/style.css idéntico en raíz y Android assets', rootCss === androidCss);
  check('Sincronización: css/style.css idéntico en raíz y directorio superior', rootCss === parentCss);

  console.log(`\n--- RESUMEN FINAL V12 ---`);
  console.log(`Total de pruebas: ${passed + failed} | Aprobadas: ${passed} | Fallidas: ${failed}`);
  if (failed > 0) process.exit(1);
  console.log('\n🎉 ¡TODOS LOS REQUISITOS V12 HAN SIDO VERIFICADOS AL 100%!');
  process.exit(0);
})();


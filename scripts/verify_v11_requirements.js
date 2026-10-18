const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== VERIFICANDO REQUISITOS V11: CANCIÓN COMPLETA (SIN LÍMITE 30S) Y GLOSARIOS ORDENADOS A-Z ===\n');

let passed = 0;
let failed = 0;

function check(label, condition) {
  if (condition) {
    console.log(`✅ ${label}`);
    passed++;
  } else {
    console.error(`❌ FALLÓ: ${label}`);
    failed++;
  }
}

const indexHtml = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const masterDataJs = fs.readFileSync('master_data.js', 'utf8');

// 1. VERIFICACIÓN DE REQUISITO 1: REPRODUCCIÓN DE CANCIÓN COMPLETA
console.log('1. VERIFICACIÓN DE REPRODUCTOR DE CANCIÓN COMPLETA:');

check('HTML: index.html no excede el límite estricto de 120,000 bytes',
  Buffer.byteLength(indexHtml, 'utf8') <= 120000);

check('JS: window.resolveYouTubeVideoId implementado con sistema multi-respaldo',
  appJs.includes('window.resolveYouTubeVideoId = async function') &&
  appJs.includes('allorigins.win') &&
  appJs.includes('codetabs.com') &&
  appJs.includes('pipedapi') &&
  appJs.includes('listType=search'));

check('JS: Eliminado límite de 30 segundos (audioTracker no carga previewUrl de iTunes)',
  !appJs.includes('audioTracker.src = previewUrl') &&
  appJs.includes('audioTracker.pause()') &&
  appJs.includes("audioTracker.removeAttribute('src')"));

check('JS: Duración completa real calculada a partir de trackTimeMillis o metadatos completos',
  appJs.includes('Math.round(s.trackTimeMillis / 1000)') &&
  appJs.includes('totalDurationSec') &&
  appJs.includes('holoStageTime'));

check('JS: Controlador holográfico personalizado expuesto (Play/Pause, Seek, Mute, ViewMode, Timer)',
  appJs.includes('window.toggleMainStageAudio = function') &&
  appJs.includes('window.seekHoloStageTrack = function') &&
  appJs.includes('window.seekTrackToSeconds = function') &&
  appJs.includes('window.toggleHoloStageMute = function') &&
  appJs.includes('window.toggleHoloStageViewMode = function') &&
  appJs.includes('window.startKaraokeSyncTimer = function'));

check('JS: Letras sincronizadas distribuidas a lo largo de toda la canción (3 a 5 minutos)',
  appJs.includes('totalDurationSec / Math.max(maxLines.length, 1)'));

// 2. VERIFICACIÓN DE REQUISITO 2: ORDEN ALFABÉTICO ESTRICTO (A - Z) EN LOS 10 MÓDULOS
console.log('\n2. VERIFICACIÓN DE ORDEN ALFABÉTICO ESTRICTO (A - Z) EN LOS 10 MÓDULOS:');

const sandbox = {
  window: {},
  document: { readyState: 'complete', addEventListener() {}, querySelectorAll() { return []; } }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(masterDataJs, sandbox);

const masterData = sandbox.window.MASTER_MODULES_DATA;
const pureModuleKeys = [
  'phrasal_verbs',
  'difficult_verbs',
  'power_adjectives',
  'native_idioms',
  'connectors_linking',
  'false_friends',
  'collocations',
  'business_tech',
  'travel_survival',
  'toefl_academic'
];

let allModulesSorted = true;
let allModulesHave100 = true;

pureModuleKeys.forEach(k => {
  const mod = masterData[k];
  if (!mod || !Array.isArray(mod.items)) {
    allModulesSorted = false;
    allModulesHave100 = false;
    return;
  }
  if (mod.items.length !== 100) {
    allModulesHave100 = false;
  }
  for (let i = 1; i < mod.items.length; i++) {
    const prev = mod.items[i - 1].term || mod.items[i - 1].word || '';
    const curr = mod.items[i].term || mod.items[i].word || '';
    if (prev.localeCompare(curr, 'en', { sensitivity: 'base' }) > 0) {
      console.error(`Desorden detectado en ${k} en posición ${i}: "${prev}" vs "${curr}"`);
      allModulesSorted = false;
      break;
    }
  }
});

check('Diccionario Maestro: Los 10 módulos tienen exactamente 100 términos cada uno (1,000 en total)',
  allModulesHave100);

check('Diccionario Maestro: Los 10 módulos están estrictamente ordenados de la A a la Z en master_data.js',
  allModulesSorted);

check('Glosario Modal: renderGlossaryItems ordena estrictamente A-Z antes de asignar #01..#100',
  appJs.includes('const sortedItems = [...items].sort((a, b) =>') &&
  appJs.includes("localeCompare((b.term || b.word || ''), 'en', { sensitivity: 'base' })") &&
  appJs.includes("String(idx + 1).padStart(2, '0')"));

check('Learning Path Cards: renderOfficialLearningModules muestra los primeros 3 términos ordenados A-Z con #01, #02, #03',
  appJs.includes('sortedItems.slice(0, 3)') &&
  appJs.includes("String(sIdx + 1).padStart(2, '0')"));

check('PDF Editorial: downloadActiveGlossaryPdf ordena estrictamente A-Z y numera de 01 a 100 secuencialmente',
  appJs.includes('const items = [...rawItems].sort((a, b) =>') &&
  appJs.includes("String(i + 1).padStart(2, '0') + '. ' + sanitizeTextForPdf(item.term || '')"));

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
    style: { setProperty(k, v) { this[k] = v; } },
    classList: {
      _set: new Set(),
      add(...cls) { cls.forEach(c => this._set.add(c)); },
      remove(...cls) { cls.forEach(c => this._set.delete(c)); },
      contains(c) { return this._set.has(c); },
      toggle(c, f) { if (f === true) this._set.add(c); else if (f === false) this._set.delete(c); else if (this._set.has(c)) this._set.delete(c); else this._set.add(c); }
    },
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k] || null; },
    removeAttribute(k) { delete this[k]; },
    appendChild(c) { if (c && c.id) runtimeElements[c.id] = c; return c; },
    parentElement: null,
    pause() {},
    play() { return Promise.resolve(); },
    querySelector() { return makeEl('sub'); },
    querySelectorAll() { return []; }
  };
}

const mockIframe = makeEl('musicYouTubeIframe', 'IFRAME');
const mockStageWrapper = makeEl('stageWrapper');
mockIframe.parentElement = mockStageWrapper;

[
  'view-auth', 'view-home', 'view-path', 'view-stories', 'view-music', 'view-worldtour',
  'music-search-subview', 'music-player-subview', 'activeMusicTitle', 'activeMusicArtist',
  'musicLyricsContainer', 'glossaryTermsContainer', 'learning-modules-grid'
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
  clearInterval: globalThis.clearInterval
};
runtimeSandbox.window = runtimeSandbox;
runtimeSandbox.globalThis = runtimeSandbox;

vm.createContext(runtimeSandbox);
vm.runInContext(masterDataJs, runtimeSandbox);
vm.runInContext(appJs, runtimeSandbox);

(async () => {
  // Probar loadSongToKaraoke con canción completa (Creep = 238 segundos)
  await runtimeSandbox.window.loadSongToKaraoke(
    'Creep',
    'Radiohead',
    'https://audio-ssl.itunes.apple.com/preview.m4a',
    'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/100x100bb.jpg',
    238
  );

  const holoStage = runtimeElements['musicHolographicStage'];
  check('Runtime: loadSongToKaraoke muestra el tiempo total completo (3:58) en #holoStageTime',
    runtimeElements['holoStageTime'] && runtimeElements['holoStageTime'].textContent.includes('3:58'));

  check('Runtime: loadSongToKaraoke incrusta el reproductor oficial YouTube en #musicHolographicStage',
    holoStage && holoStage.innerHTML.includes('iframe id="musicHoloYoutubeIframe"') &&
    holoStage.innerHTML.includes('youtube-nocookie.com/embed'));

  check('Runtime: loadSongToKaraoke incluye carátula HD 600x600',
    holoStage && holoStage.innerHTML.includes('600x600bb.jpg'));

  // Probar orden alfabético en renderGlossaryItems
  const unsortedSample = [
    { term: 'Zenith', meaning: 'Cenit' },
    { term: 'Apple', meaning: 'Manzana' },
    { term: 'Banana', meaning: 'Plátano' }
  ];
  runtimeSandbox.window.renderGlossaryItems(unsortedSample);
  const glossaryHtml = runtimeElements['glossaryTermsContainer'].innerHTML;
  const appleIdx = glossaryHtml.indexOf('Apple');
  const bananaIdx = glossaryHtml.indexOf('Banana');
  const zenithIdx = glossaryHtml.indexOf('Zenith');

  check('Runtime: renderGlossaryItems renderiza estrictamente en orden A-Z (#01 Apple, #02 Banana, #03 Zenith)',
    appleIdx !== -1 && bananaIdx !== -1 && zenithIdx !== -1 &&
    appleIdx < bananaIdx && bananaIdx < zenithIdx &&
    glossaryHtml.includes('#01</span>') && glossaryHtml.includes('Apple'));

  // 4. VERIFICACIÓN DE SINCRONIZACIÓN TRI-DIRECTORIO
  console.log('\n4. VERIFICACIÓN DE SINCRONIZACIÓN TRI-DIRECTORIO:');

  const rootAppJs = fs.readFileSync('js/app.js', 'utf8');
  const androidAppJs = fs.readFileSync('app/src/main/assets/js/app.js', 'utf8');
  const parentAppJs = fs.readFileSync('../js/app.js', 'utf8');

  check('Sincronización: js/app.js idéntico en raíz y Android assets',
    rootAppJs === androidAppJs);

  check('Sincronización: js/app.js idéntico en raíz y directorio superior',
    rootAppJs === parentAppJs);

  const rootMasterData = fs.readFileSync('master_data.js', 'utf8');
  const androidMasterData = fs.readFileSync('app/src/main/assets/master_data.js', 'utf8');
  const parentMasterData = fs.readFileSync('../master_data.js', 'utf8');

  check('Sincronización: master_data.js idéntico en raíz y Android assets',
    rootMasterData === androidMasterData);

  check('Sincronización: master_data.js idéntico en raíz y directorio superior',
    rootMasterData === parentMasterData);

  console.log('\n--- RESUMEN FINAL V11 ---');
  console.log(`Total de pruebas: ${passed + failed} | Aprobadas: ${passed} | Fallidas: ${failed}`);

  if (failed === 0) {
    console.log('\n🎉 ¡TODOS LOS REQUISITOS V11 HAN SIDO VERIFICADOS AL 100%!');
    process.exit(0);
  } else {
    console.error('\n❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN V11');
    process.exit(1);
  }
})();

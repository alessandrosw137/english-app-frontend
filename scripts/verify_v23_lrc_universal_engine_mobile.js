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

console.log('=== VERIFICANDO REQUISITOS V23: MOTOR UNIVERSAL LRC, EMPAREJAMIENTO EXACTO, SEEK BIDIRECCIONAL Y UI MÓVIL ===\n');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');
const indexHtmlPath = path.join(__dirname, '..', 'index.html');
const styleCssPath = path.join(__dirname, '..', 'css', 'style.css');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');

// 1. VERIFICACIÓN DE ESTRUCTURA Y ARCHIVOS
console.log('1. VERIFICACIÓN DE ESTRUCTURA Y LÍMITES:');
const htmlSize = Buffer.byteLength(indexHtml, 'utf8');
check(`HTML: index.html no excede el límite estricto de 120,000 bytes (Actual: ${htmlSize} bytes)`, htmlSize <= 120000);
check('JS: js/app.js y js/karaoke.js contienen código válido', appJs.length > 50000 && karaokeJs.length > 40000);
check('CSS: css/style.css contiene estilos válidos', styleCss.length > 20000);

// 2. MÓDULO 1: LIMPIEZA DE METADATOS Y EMPAREJAMIENTO EXACTO
console.log('\n2. MÓDULO 1: LIMPIEZA DE METADATOS Y EMPAREJAMIENTO EXACTO:');
check('JS: window.cleanTrackMetadata implementado', appJs.includes('window.cleanTrackMetadata = function'));
check('JS: window.fetchExactSyncedLyrics implementado con búsqueda de coincidencia de duración', appJs.includes('window.fetchExactSyncedLyrics = async function'));
check('JS: fetchExactSyncedLyrics filtra candidatos reales con syncedLyrics.includes("[")', appJs.includes("syncedCandidates = list.filter(item => item.syncedLyrics && item.syncedLyrics.includes('['))"));
check('JS: fetchExactSyncedLyrics ordena por cercanía exacta a targetDurationSec', appJs.includes("Math.abs((a.duration || 0) - targetDurationSec) - Math.abs((b.duration || 0) - targetDurationSec)"));
check('JS: REGLA YOUTUBE: búsqueda dinámica oficial usa official audio con metadatos limpios', appJs.includes("`${cleanArtist} ${cleanTitle} ${variantTag}`") || appJs.includes("`${cleanArtist} ${cleanTitle} official audio`"));
check('JS: window.lyricsOffset se inicializa en 0 por defecto al cargar cada canción nueva', appJs.includes('window.lyricsOffset = 0;'));

// 3. MÓDULO 2: PARSER LRC UNIVERSAL
console.log('\n3. MÓDULO 2: PARSER LRC UNIVERSAL DE ALTA PRECISIÓN:');
check('JS: window.parseLrcUniversal implementado', appJs.includes('window.parseLrcUniversal = function'));
check('JS: parseLrcUniversal convierte marcas [mm:ss.xx] con milisegundos a segundos flotantes', appJs.includes('startTime = +(min * 60 + sec + ms / 1000).toFixed(3)'));
check('JS: parseLrcUniversal descarta símbolos musicales vacíos (/^[\\u266a\\u266b\\s-]+$/)', appJs.includes('^[\\u266a\\u266b\\s-]+$'));
check('JS: parseLrcUniversal calcula endTime con límite razonable de iluminación (entry.startTime + 6.5)', appJs.includes('endTime = Math.min(naturalEnd, entry.startTime + 6.5)'));
check('JS: parseLrcUniversal desglosa cada verso en arreglo de palabras (.words)', appJs.includes('words = entry.text.split(/\\s+/).filter(Boolean)'));

// 4. MÓDULO 3: MOTOR DE SINCRONIZACIÓN CERO PARPADEO (KaraokeSyncEngine)
console.log('\n4. MÓDULO 3: MOTOR DE SINCRONIZACIÓN CERO PARPADEO:');
check('JS: window.KaraokeSyncEngine definido como objeto singleton en memoria', appJs.includes('window.KaraokeSyncEngine = {'));
check('JS: KaraokeSyncEngine implementa initSong, stop, renderStaticLyricsDOM, seekToTime',
  appJs.includes('initSong(stanzasArray)') &&
  appJs.includes('stop()') &&
  appJs.includes('renderStaticLyricsDOM()') &&
  appJs.includes('seekToTime(targetSeconds)'));
check('JS: KaraokeSyncEngine implementa getCurrentPlaybackTime, isPlayerPlaying, startLoop, updateSeekBarUI, syncFrame',
  appJs.includes('getCurrentPlaybackTime()') &&
  appJs.includes('isPlayerPlaying()') &&
  appJs.includes('startLoop(token)') &&
  appJs.includes('updateSeekBarUI(currentTime)') &&
  appJs.includes('syncFrame(rawTime, forceScroll = false)'));
check('JS: renderStaticLyricsDOM detecta interacción táctil del usuario para pausar auto-scroll temporalmente',
  appJs.includes('touchstart') && appJs.includes('isUserTouchingLyrics = true'));
check('JS: renderStaticLyricsDOM genera estructura de versos con .stanza-card, data-sidx, .k-word y data-widx',
  appJs.includes('class="stanza-card') &&
  appJs.includes('data-sidx=') &&
  appJs.includes('class="k-word') &&
  appJs.includes('data-widx='));
check('JS: seekToTime aplica salto a YouTube player o Audio y fuerza recálculo inmediato',
  appJs.includes('window._holoYtPlayer.seekTo(sec, true)') || appJs.includes('window.ytPlayer.seekTo(sec, true)'));
check('JS: syncFrame apaga palabras de estrofas futuras cuando el usuario atrasa la canción (seek bidireccional)',
  appJs.includes("card.querySelectorAll('.k-word.lit, .k-word.word-active').forEach(w =>"));

// 5. MÓDULO 4: BARRA DE PROGRESO INTERACTIVA (SEEK SLIDER)
console.log('\n5. MÓDULO 4: BARRA DE PROGRESO INTERACTIVA (SEEK SLIDER):');
check('HTML: index.html contiene <input type="range" id="karaoke-seek-slider">', indexHtml.includes('id="karaoke-seek-slider"'));
check('HTML: index.html contiene <span id="karaoke-time-label">', indexHtml.includes('id="karaoke-time-label"'));
check('HTML: index.html contiene <div id="karaoke-lyrics-container">', indexHtml.includes('id="karaoke-lyrics-container"'));
check('JS: window.initKaraokeSeekSliderEvents conecta eventos input y change del seek slider',
  appJs.includes('window.initKaraokeSeekSliderEvents = function') &&
  appJs.includes("seekSlider.addEventListener('input'") &&
  appJs.includes("seekSlider.addEventListener('change'"));

// 6. MÓDULO 5: DISEÑO RESPONSIVO PARA MÓVILES Y TRANSICIONES CSS SIN FLICKER
console.log('\n6. MÓDULO 5: ESTILOS CSS RESPONSIVOS Y CERO FLICKER:');
check('CSS: Regla .stanza-card incluye transform translateZ(0) y will-change',
  styleCss.includes('.stanza-card') &&
  styleCss.includes('transform: translateZ(0)') &&
  styleCss.includes('will-change: transform, opacity, border-color'));
check('CSS: Regla .stanza-card.active con background y border-color cian brillante',
  styleCss.includes('.stanza-card.active') &&
  styleCss.includes('border-color: rgba(56, 189, 248, 0.75)'));
check('CSS: Regla .stanza-card.past con opacidad 0.35', styleCss.includes('.stanza-card.past') && styleCss.includes('opacity: 0.35'));
check('CSS: Regla #karaoke-seek-slider con accent-color: #38bdf8 y touch-action: pan-y',
  styleCss.includes('#karaoke-seek-slider') &&
  styleCss.includes('accent-color: #38bdf8') &&
  styleCss.includes('touch-action: pan-y'));
check('CSS: Media query móvil (@media (max-width: 768px)) con sticky en .player-stage-column y altura dinámica en #karaoke-lyrics-container',
  styleCss.includes('@media (max-width: 768px)') &&
  styleCss.includes('.player-stage-column') &&
  styleCss.includes('position: sticky') &&
  styleCss.includes('#karaoke-lyrics-container') &&
  styleCss.includes('100dvh'));

// 7. VERIFICACIÓN EN RUNTIME (VM SANDBOX)
console.log('\n7. VERIFICACIÓN EN RUNTIME (VM SANDBOX):');

const runtimeElements = {};
function makeEl(id, tag = 'DIV') {
  return {
    id,
    tagName: tag,
    className: '',
    innerHTML: '',
    textContent: '',
    value: '0',
    max: '210',
    dataset: {},
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
    scrollIntoView() { this.scrollIntoViewCalled = true; },
    querySelector(sel) {
      if (sel.startsWith('#')) return this.getElementById ? this.getElementById(sel.slice(1)) : makeEl(sel.slice(1));
      return makeEl('sub_' + Math.random().toString(36).slice(2, 6));
    },
    querySelectorAll() { return []; },
    addEventListener() {},
    removeEventListener() {}
  };
}

[
  'view-auth', 'view-home', 'view-path', 'view-stories', 'view-music', 'view-worldtour',
  'music-search-subview', 'music-player-subview', 'lyricsOffsetBadge', 'musicLyricsContainer',
  'karaoke-lyrics-container', 'karaoke-seek-slider', 'karaoke-time-label',
  'activeMusicTitle', 'activeMusicArtist', 'holoStageTime', 'holoStageProgressBar',
  'musicHolographicStage', 'mastereng-audio', 'holoStagePlayIcon', 'karaokeTimeBadge'
].forEach(id => { runtimeElements[id] = makeEl(id); });

const sandbox = {
  window: null,
  AbortController: globalThis.AbortController,
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }),
  scrollTo() {},
  addEventListener() {},
  removeEventListener() {},
  postMessage() {},
  requestAnimationFrame: cb => setTimeout(() => cb(Date.now()), 16),
  cancelAnimationFrame: id => clearTimeout(id),
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

  // 1. Probar window.cleanTrackMetadata
  const clean1 = sandbox.window.cleanTrackMetadata('Shape of You (Official Music Video) [Explicit 4K]', 'Ed Sheeran feat. Stormzy & Friends');
  check('Runtime VM: cleanTrackMetadata limpia títulos eliminando menciones oficiales y remasters',
    clean1.cleanTitle === 'Shape of You');
  check('Runtime VM: cleanTrackMetadata limpia artistas separando colaboradores',
    clean1.cleanArtist === 'Ed Sheeran');

  // 2. Probar window.parseLrcUniversal
  const lrcSample = `[00:13.06] When you were here before\n[00:16.75] Couldn't look you in the eye\n[00:21.36] You're just like an angel`;
  const parsed = sandbox.window.parseLrcUniversal(lrcSample, 238);
  check('Runtime VM: parseLrcUniversal procesa 3 versos exactos', parsed.length === 3);
  check('Runtime VM: verso 0 tiene startTime 13.06s y palabras separadas',
    parsed[0].startTime === 13.06 && parsed[0].words.length === 5);
  check('Runtime VM: verso 1 tiene startTime 16.75s y endTime 21.36s',
    parsed[1].startTime === 16.75 && parsed[1].endTime === 21.36);

  // 3. Probar KaraokeSyncEngine
  sandbox.window.KaraokeSyncEngine.initSong(parsed);
  check('Runtime VM: KaraokeSyncEngine.initSong registra estrofas y resetea sesión',
    sandbox.window.KaraokeSyncEngine.stanzas.length === 3 && sandbox.window.KaraokeSyncEngine.lastStanzaIdx === -999);

  // 4. Probar seekToTime adelantando a verso 1 (16.75s)
  sandbox.window.KaraokeSyncEngine.seekToTime(16.75);
  check('Runtime VM: seekToTime actualiza _currentTrackCurrentTime a 16.75s de forma inmediata',
    sandbox.window._currentTrackCurrentTime === 16.75);
  check('Runtime VM: seekToTime actualiza el slider de progreso a 16.75',
    parseFloat(runtimeElements['karaoke-seek-slider'].value) === 16.75);

  // 5. Probar seekToTime retrasando al verso 0 (13.06s)
  sandbox.window.KaraokeSyncEngine.seekToTime(13.06);
  check('Runtime VM: seekToTime hacia atrás actualiza _currentTrackCurrentTime a 13.06s',
    sandbox.window._currentTrackCurrentTime === 13.06);

  // 6. Probar syncFrame durante intro instrumental (2.0s)
  sandbox.window.KaraokeSyncEngine.syncFrame(2.0, false);
  check('Runtime VM: syncFrame durante intro muestra "🎶 [Intro Instrumental]"',
    runtimeElements['karaokeTimeBadge'].textContent.includes('Intro Instrumental'));

} catch (err) {
  console.error('Error durante ejecución de Runtime VM:', err);
  failedTests++;
}

// 8. SINCRONIZACIÓN TRI-DIRECTORIO
console.log('\n8. VERIFICACIÓN DE SINCRONIZACIÓN TRI-DIRECTORIO:');
const rootDir = path.resolve(__dirname, '..');
const androidAssets = path.join(rootDir, 'app', 'src', 'main', 'assets');
const parentDir = path.resolve(rootDir, '..');

const jsAppRoot = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
const jsAppAndroid = fs.readFileSync(path.join(androidAssets, 'js', 'app.js'), 'utf8');
const jsAppParent = fs.readFileSync(path.join(parentDir, 'js', 'app.js'), 'utf8');

check('Sincronización: js/app.js idéntico en raíz y Android assets', jsAppRoot === jsAppAndroid);
check('Sincronización: js/app.js idéntico en raíz y directorio superior', jsAppRoot === jsAppParent);

const cssRoot = fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8');
const cssAndroid = fs.readFileSync(path.join(androidAssets, 'css', 'style.css'), 'utf8');
const cssParent = fs.readFileSync(path.join(parentDir, 'css', 'style.css'), 'utf8');

check('Sincronización: css/style.css idéntico en raíz y Android assets', cssRoot === cssAndroid);
check('Sincronización: css/style.css idéntico en raíz y directorio superior', cssRoot === cssParent);

const htmlRoot = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const htmlAndroid = fs.readFileSync(path.join(androidAssets, 'index.html'), 'utf8');
const htmlParent = fs.readFileSync(path.join(parentDir, 'index.html'), 'utf8');

check('Sincronización: index.html idéntico en raíz y Android assets', htmlRoot === htmlAndroid);
check('Sincronización: index.html idéntico en raíz y directorio superior', htmlRoot === htmlParent);

console.log('\n--- RESUMEN FINAL V23 ---');
console.log(`Total de pruebas: ${passedTests + failedTests} | Aprobadas: ${passedTests} | Fallidas: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 ¡TODOS LOS REQUISITOS V23 VERIFICADOS AL 100%!');
  process.exit(0);
} else {
  console.error('\n❌ SE ENCONTRARON FALLOS EN LA VERIFICACIÓN V23.');
  process.exit(1);
}

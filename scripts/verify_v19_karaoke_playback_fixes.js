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

console.log('=== VERIFICANDO REQUISITOS V19: PLAYBACK FIXES, CERO PARPADEO, 0MS PAUSA Y SIN BANNER INTRO ===\n');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');
const styleCssPath = path.join(__dirname, '..', 'css', 'style.css');
const indexHtmlPath = path.join(__dirname, '..', 'index.html');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. PASO 1: ELIMINACIÓN DE "PREPÁRATE PARA CANTAR" Y BANNER DE INTRO
console.log('1. PASO 1: ELIMINACIÓN DE "PREPÁRATE PARA CANTAR" Y BANNER DE INTRO:');
check('HTML: index.html no contiene "Prepárate para cantar"', !/prep[aá]rate\s+para\s+cantar/i.test(indexHtml));
check('JS: js/app.js no contiene "Prepárate para cantar"', !/prep[aá]rate\s+para\s+cantar/i.test(appJs));
check('JS: js/karaoke.js no contiene "Prepárate para cantar"', !/prep[aá]rate\s+para\s+cantar/i.test(karaokeJs));
check('HTML: index.html no excede el límite de 120,000 bytes', fs.statSync(indexHtmlPath).size <= 120000);
check('JS: Intro instrumental muestra únicamente "🎶 [Intro Instrumental]"', karaokeJs.includes('🎶 [Intro Instrumental]'));

// 2. PASO 2: PAUSA INSTANTÁNEA (0 MS) Y CERO AUDIO EN SEGUNDO PLANO
console.log('\n2. PASO 2: PAUSA INSTANTÁNEA (0 MS) Y CERO AUDIO EN SEGUNDO PLANO:');
check('JS: window.stopAllAudioAndTimers implementado en js/app.js', appJs.includes('window.stopAllAudioAndTimers = function() {'));
check('JS: stopAllAudioAndTimers limpia window.karaokeInterval y window._karaokePlaybackTimer',
  appJs.includes('clearInterval(window.karaokeInterval)') && appJs.includes('clearInterval(window._karaokePlaybackTimer)'));
check('JS: stopAllAudioAndTimers pausa todos los elementos audio y video',
  appJs.includes("document.querySelectorAll('audio, video')"));
check('JS: stopAllAudioAndTimers pausa ytPlayer y _holoYtPlayer',
  appJs.includes('window.ytPlayer.pauseVideo()') && appJs.includes('window._holoYtPlayer.pauseVideo()'));
check('JS: stopAllAudioAndTimers envía postMessage pauseVideo a todos los iframes',
  appJs.includes('postMessage(\'{"event":"command","func":"pauseVideo","args":""}\', \'*\')'));
check('JS: Botón de pausa invoca sincrónicamente window.stopAllAudioAndTimers() y cambia icono a ▶️ en 0ms',
  appJs.includes('window.stopAllAudioAndTimers()') && appJs.includes("playIcon.textContent = '▶️'"));
check('JS: Tag <audio> silenciado cuando YouTube está activo (Cero reproducción simultánea)',
  appJs.includes('a.pause(); a.src = ""; a.removeAttribute(\'src\');'));

// 3. PASO 3: PANTALLA NEGRA DE VIDEO Y CONSERVACIÓN DEL ARTE REAL DEL ÁLBUM
console.log('\n3. PASO 3: PANTALLA NEGRA DE VIDEO Y CONSERVACIÓN DEL ARTE REAL DEL ÁLBUM:');
check('JS: Conversión a carátula HD 600x600bb implementada',
  appJs.includes("replace('100x100bb', '600x600bb')") || appJs.includes("replace(/100x100bb|300x300bb/g, '600x600bb')"));
check('JS: Carátula asignada a thumbnail de controles y círculo central del holograma',
  appJs.includes('holoStageControlsArtwork') && appJs.includes('holoAudioFallbackArtwork'));
check('JS: Watchdog de 2.5s para detectar pantallas negras / bloqueos',
  appJs.includes('setTimeout') && appJs.includes('2500'));
check('JS: En caso de error o fallback, el iframe de YouTube se oculta (display: none)',
  appJs.includes("iframe.style.display = 'none'"));
check('JS: En caso de error o fallback, el holograma HD se muestra (display: flex)',
  appJs.includes("fallbackVisualizer.style.display = 'flex'"));

// 4. PASO 4: SINCRONIZACIÓN EXACTA LRCLIB Y CERO PARPADEO (FLICKER-FREE)
console.log('\n4. PASO 4: SINCRONIZACIÓN EXACTA LRCLIB Y CERO PARPADEO (FLICKER-FREE):');
check('JS: Selección de letra en LRCLIB por duración más cercana con reduce y Math.abs',
  appJs.includes('Math.abs(curr.duration - songDurationSec) < Math.abs(prev.duration - songDurationSec)'));
check('JS: Contenedor de estrofa incluye .stanza-card y data-sidx',
  karaokeJs.includes('stanza-card') && karaokeJs.includes('data-sidx="${lIdx}"'));
check('JS: Palabras envueltas en .k-word con data-widx',
  karaokeJs.includes('k-word') && karaokeJs.includes('data-widx="${currentWordIdx}"'));
check('JS: Variables de control window.lastActiveStanzaIdx y window.lastActiveWordIdx inicializadas en -1',
  karaokeJs.includes('window.lastActiveStanzaIdx = -1') && karaokeJs.includes('window.lastActiveWordIdx = -1'));
check('JS: Bucle de sincronización ultraliviano a 80 ms',
  appJs.includes('}, 80);'));
check('JS: Control flicker-free: no toca DOM si los índices no han cambiado',
  karaokeJs.includes('const stanzaChanged = (matchedIdx !== window._lastActiveStanzaIndex);') &&
  karaokeJs.includes('if (activeWordIndex !== window._lastActiveWordIndex)'));
check('CSS: Regla .k-word con color atenuado y transición fluida (0.12s ease)',
  styleCss.includes('.k-word') && styleCss.includes('transition: color 0.12s ease, text-shadow 0.12s ease'));
check('CSS: Regla .k-word.lit con color #ffffff y text-shadow neón',
  styleCss.includes('.k-word.lit') && styleCss.includes('text-shadow: 0 0 10px rgba(56, 189, 248, 0.85)'));

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
      remove: () => {}
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
        return [getMockEl('audio_1'), getMockEl('audio_2')];
      }
      if (selector === 'iframe') {
        return [getMockEl('iframe_1')];
      }
      if (selector.includes('holo-audio-wave-bar')) {
        return Array.from({ length: 28 }, () => ({ style: {} }));
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

// Cargar karaokeJs y appJs en sandbox
vm.runInContext(karaokeJs, sandbox);
vm.runInContext(appJs, sandbox);

// Probar window.stopAllAudioAndTimers en runtime
sandbox.window.karaokeInterval = setInterval(() => {}, 1000);
sandbox.window._karaokePlaybackTimer = setInterval(() => {}, 1000);
check('Runtime VM: window.stopAllAudioAndTimers está definida como función', typeof sandbox.window.stopAllAudioAndTimers === 'function');
sandbox.window.stopAllAudioAndTimers();
check('Runtime VM: stopAllAudioAndTimers limpia karaokeInterval a null', sandbox.window.karaokeInterval === null);
check('Runtime VM: stopAllAudioAndTimers limpia _karaokePlaybackTimer a null', sandbox.window._karaokePlaybackTimer === null);

// Probar toggleMainStageAudio para pausa instantánea
sandbox.window._isHoloStagePlaying = true;
sandbox.window.toggleMainStageAudio();
const playIconEl = getMockEl('holoStagePlayIcon');
check('Runtime VM: Al pausar, _isHoloStagePlaying pasa a false', sandbox.window._isHoloStagePlaying === false);
check('Runtime VM: Al pausar, holoStagePlayIcon muestra ▶️ inmediatamente', playIconEl.textContent === '▶️');

// Probar renderizado de estrofas y spans con nuevos selectores
const testLyrics = [
  { time: 5, text: "Look into my eyes", lines: ["Look into my eyes"] },
  { time: 15, text: "You will see what you mean to me", lines: ["You will see what you mean to me"] }
];
sandbox.window.renderLyricsFromList(testLyrics);
const renderedHtml = getMockEl('musicLyricsContainer').innerHTML;
check('Runtime VM: renderLyricsFromList incluye clase stanza-card', renderedHtml.includes('stanza-card'));
check('Runtime VM: renderLyricsFromList incluye data-sidx="0"', renderedHtml.includes('data-sidx="0"'));
check('Runtime VM: renderLyricsFromList incluye clase k-word', renderedHtml.includes('k-word'));
check('Runtime VM: renderLyricsFromList incluye data-widx="0"', renderedHtml.includes('data-widx="0"'));
check('Runtime VM: Variables de control de estrofa y palabra reseteadas a -1',
  sandbox.window.lastActiveStanzaIdx === -1 && sandbox.window.lastActiveWordIdx === -1);

console.log(`\n--- RESUMEN FINAL V19 ---`);
console.log(`Total de pruebas: ${passedTests + failedTests} | Aprobadas: ${passedTests} | Fallidas: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 ¡TODOS LOS REQUISITOS V19 VERIFICADOS AL 100%!');
  process.exit(0);
} else {
  console.error('\n❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN V19');
  process.exit(1);
}

const fs = require('fs');
const vm = require('vm');

console.log('=== VERIFICANDO REQUISITOS DE MASTER_DATA.JS, AUDIO SYNC, TOOLTIPS Y EXP ===\n');

let passes = [];
let errors = [];

function assert(condition, message) {
  if (condition) {
    passes.push('✅ ' + message);
  } else {
    errors.push('❌ ' + message);
  }
}

// 1. Cargar master_data.js en un contexto virtual
console.log('1. Verificando carga y ejecución de master_data.js...');
const code = fs.readFileSync('app/src/main/assets/master_data.js', 'utf8');

const mockWindow = {
  dispatchEvent: function() {},
  CustomEvent: function(name, opts) { this.name = name; this.detail = opts ? opts.detail : {}; },
  localStorage: {
    _data: {},
    getItem: function(k) { return this._data[k] || null; },
    setItem: function(k, v) { this._data[k] = String(v); },
    removeItem: function(k) { delete this._data[k]; }
  },
  innerWidth: 1024,
  innerHeight: 768,
  addExp: null
};

const mockDocument = {
  body: {
    appendChild: function(el) { this._children.push(el); },
    contains: function(el) { return true; },
    _children: []
  },
  documentElement: { clientWidth: 1024, clientHeight: 768 },
  createElement: function(tag) {
    return {
      tagName: tag.toUpperCase(),
      id: '',
      className: '',
      style: {},
      innerHTML: '',
      classList: {
        add: function() {},
        remove: function() {},
        contains: function() { return false; }
      },
      querySelector: function() { return { textContent: '', classList: { add: function(){}, remove: function(){} } }; },
      querySelectorAll: function() { return []; },
      contains: function() { return false; }
    };
  },
  getElementById: function(id) { return null; },
  querySelectorAll: function() { return []; },
  addEventListener: function() {},
  removeEventListener: function() {},
  readyState: 'complete'
};

const context = {
  window: mockWindow,
  document: mockDocument,
  localStorage: mockWindow.localStorage,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  requestAnimationFrame: function(cb) { cb(); }
};

try {
  vm.createContext(context);
  vm.runInContext(code, context);
  assert(true, 'master_data.js compila y ejecuta limpiamente en VM');
} catch (err) {
  assert(false, 'Error ejecutando master_data.js: ' + err.message);
}

// ----------------------------------------------------
// 2. DATASETS ESTRUCTURADOS CON TIMESTAMPS Y KEYWORDS
// ----------------------------------------------------
console.log('\n2. Verificando datasets de Karaoke y Lecturas Interactivas...');
const karaokeData = context.window.KARAOKE_MASTER_DATA;
assert(Array.isArray(karaokeData) && karaokeData.length >= 10, 'KARAOKE_MASTER_DATA contiene 10 canciones con metadatos completos');

const sampleTrack = karaokeData && karaokeData.find(t => t.id === 'losing-my-religion');
assert(sampleTrack && sampleTrack.lyrics && sampleTrack.lyrics.length > 5, 'Canción muestra contiene lírica estructurada');

const sampleLine = sampleTrack && sampleTrack.lyrics[0];
assert(sampleLine && typeof sampleLine.time === 'number' && typeof sampleLine.endTime === 'number', 'Línea lírica incluye marcas de tiempo (time y endTime)');
assert(sampleLine && sampleLine.text && sampleLine.es, 'Línea lírica incluye texto en inglés y traducción al español');
assert(sampleLine && Array.isArray(sampleLine.keywords) && sampleLine.keywords.length > 0, 'Línea lírica contiene palabras clave anotadas');

const sampleKeyword = sampleLine && sampleLine.keywords[0];
assert(sampleKeyword && sampleKeyword.term && sampleKeyword.ipa && sampleKeyword.meaning && sampleKeyword.example, 'Palabra clave incluye término, IPA, significado y ejemplo');

const storiesData = context.window.STORIES_SYNC_DATA;
assert(Array.isArray(storiesData) && storiesData.length >= 1, 'STORIES_SYNC_DATA contiene lecturas interactivas sincronizadas');
const sampleStory = storiesData && storiesData[0];
assert(sampleStory && sampleStory.paragraphs && sampleStory.paragraphs[0].keywords, 'Párrafos de historias incluyen timestamps y vocabulario clave');

// ----------------------------------------------------
// 3. MOTOR DE SINCRONIZACIÓN DE AUDIO Y SCROLL SUAVE
// ----------------------------------------------------
console.log('\n3. Verificando KARAOKE_SYNC_ENGINE (timeupdate y scroll al centro)...');
const syncEngine = context.window.KARAOKE_SYNC_ENGINE;
assert(typeof syncEngine === 'object' && syncEngine !== null, 'KARAOKE_SYNC_ENGINE instanciado globalmente');
assert(typeof syncEngine.attachAudioPlayer === 'function', 'Método attachAudioPlayer implementado para escuchar eventos timeupdate');
assert(typeof syncEngine.dispatchTimeUpdate === 'function', 'Método dispatchTimeUpdate implementado para fuentes de audio/YouTube');
assert(typeof syncEngine.scrollToCenter === 'function', 'Método scrollToCenter implementado');

// Probar dispatch de timeupdate
let receivedLineChange = false;
syncEngine.setTrackData(sampleTrack);
syncEngine.subscribe(function(event, data) {
  if (event === 'linechange') {
    receivedLineChange = true;
  }
});
syncEngine.dispatchTimeUpdate(20.0, 268);
assert(receivedLineChange, 'El motor detecta y cambia la línea activa en el segundo correspondiente');

// ----------------------------------------------------
// 4. MOTOR DE TOOLTIP DE VOCABULARIO INTERACTIVO
// ----------------------------------------------------
console.log('\n4. Verificando VOCAB_TOOLTIP_ENGINE (significado, IPA y ejemplo)...');
const tooltipEngine = context.window.VOCAB_TOOLTIP_ENGINE;
assert(typeof tooltipEngine === 'object' && tooltipEngine !== null, 'VOCAB_TOOLTIP_ENGINE instanciado globalmente');
assert(typeof tooltipEngine.show === 'function', 'Método show implementado');
assert(typeof tooltipEngine.hide === 'function', 'Método hide implementado');
assert(typeof tooltipEngine.lookup === 'function', 'Método lookup implementado');

const vocabInfo = tooltipEngine.lookup('religion');
assert(vocabInfo && vocabInfo.term && vocabInfo.ipa && vocabInfo.meaning && vocabInfo.example, 'Lookup retorna término con IPA, significado y ejemplo contextual');

// ----------------------------------------------------
// 5. VINCULACIÓN DE EJERCICIOS Y ACUMULACIÓN DE EXP
// ----------------------------------------------------
console.log('\n5. Verificando EXERCISE_EXP_ENGINE (acumulación de +EXP en estado global)...');
const expEngine = context.window.EXERCISE_EXP_ENGINE;
assert(typeof expEngine === 'object' && expEngine !== null, 'EXERCISE_EXP_ENGINE instanciado globalmente');
assert(typeof expEngine.awardExerciseExp === 'function', 'Método awardExerciseExp implementado');
assert(typeof expEngine.checkAndAward === 'function', 'Método checkAndAward implementado');

// Probar acumulación de EXP con respuesta correcta
let expAddedAmount = 0;
let expReason = '';
context.window.addExp = function(amount, reason) {
  expAddedAmount = amount;
  expReason = reason;
};

const resultCorrect = expEngine.awardExerciseExp('roulette', true, { expAmount: 15, reason: 'Ruleta del Saber' });
assert(resultCorrect.isCorrect === true && expAddedAmount === 15, 'Respuesta correcta acumula +EXP en estado global');
assert(resultCorrect.streak === 1, 'Racha se incrementa al responder correctamente');

// Probar respuesta incorrecta
const resultIncorrect = expEngine.awardExerciseExp('roulette', false, {});
assert(resultIncorrect.isCorrect === false && resultIncorrect.streak === 0, 'Respuesta incorrecta reinicia la racha sin otorgar EXP');

// ----------------------------------------------------
// 6. REGLA DE AISLAMIENTO
// ----------------------------------------------------
console.log('\n6. Verificando Aislamiento...');
assert(!code.includes('threeScene') && !code.includes('threeRenderer'), 'master_data.js no altera Three.js');

console.log('\n--- RESUMEN DE PRUEBAS ---');
passes.forEach(p => console.log(p));

if (errors.length > 0) {
  console.log('\n❌ ERRORES DETECTADOS:');
  errors.forEach(e => console.log(e));
  process.exit(1);
} else {
  console.log(`\n🎉 TODOS LOS ${passes.length} REQUISITOS HAN SIDO VERIFICADOS CON ÉXITO AL 100%!`);
  process.exit(0);
}

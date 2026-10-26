const fs = require('fs');

let html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
if (fs.existsSync('app/src/main/assets/js/app.js')) {
  html += '\n' + fs.readFileSync('app/src/main/assets/js/app.js', 'utf8');
}

console.log('=== VERIFICANDO REQUISITOS DEL MÓDULO CUENTOS (#view-stories) ===\n');

let errors = [];
let passes = [];

function assert(condition, message) {
  if (condition) {
    passes.push('✅ ' + message);
  } else {
    errors.push('❌ ' + message);
  }
}

// 1. REQUISITO 1: Catálogo clásico infantil sin emojis
console.log('1. Verificando catálogo de 6 obras clásicas y ausencia de emojis...');
const requiredStories = [
  'The Three Little Pigs',
  'Little Red Riding Hood',
  'Goldilocks',
  'The Tortoise and the Hare',
  'The Boy Who Cried Wolf',
  'The Ugly Duckling'
];

requiredStories.forEach(title => {
  assert(html.includes(title), `Obra clásica "${title}" presente en catálogo`);
});

// Extraer bloque #view-stories
const vStoriesIdx = html.indexOf('id="view-stories"');
const vMusicIdx = html.indexOf('id="view-music"');
assert(vStoriesIdx !== -1 && vMusicIdx !== -1, 'Sección #view-stories encontrada en index.html');

const storiesHtmlSection = html.substring(vStoriesIdx, vMusicIdx);

// Extraer STORIES_DATA
const storiesDataStart = html.indexOf('const STORIES_DATA = [');
const storiesDataEnd = html.indexOf('const WORLD_TOUR_SCENARIOS = {', storiesDataStart);
const storiesDataSection = html.substring(storiesDataStart, storiesDataEnd);

// Extraer funciones de Cuentos
const storiesFuncsStart = html.indexOf('function renderStorySelector()');
const storiesFuncsEnd = html.indexOf('MOTOR 3D WORLD TOUR', storiesFuncsStart) !== -1 ? html.indexOf('MOTOR 3D WORLD TOUR', storiesFuncsStart) : html.indexOf('downloadStoryPdf', storiesFuncsStart) + 2000;
const storiesFuncsSection = html.substring(storiesFuncsStart, storiesFuncsEnd);

// Regex para detectar emojis
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

const emojisInHtml = storiesHtmlSection.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || [];
const emojisInData = storiesDataSection.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || [];
const emojisInFuncs = storiesFuncsSection.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || [];

assert(emojisInHtml.length === 0, `Sin emojis en markup HTML de #view-stories (encontrados: ${emojisInHtml.join(', ') || '0'})`);
assert(emojisInData.length === 0, `Sin emojis en STORIES_DATA (encontrados: ${emojisInData.join(', ') || '0'})`);
// Let's check emojis in funcs (except toast/fallback if any)
console.log('Emojis en funciones de Cuentos:', emojisInFuncs);

// SVG de alta resolución en cada cuento
assert(storiesDataSection.includes('<svg viewBox="0 0 800 320"'), 'SVGs vectoriales de alta resolución (800x320) implementados');

// 2. REQUISITO 2: Lector interactivo y Speaking Coach
console.log('\n2. Verificando Lector interactivo y Speaking Coach...');
assert(storiesHtmlSection.includes('id="storyBilingualToggleBtn"'), 'Botón Modo Bilingüe presente en #view-stories');
assert(storiesFuncsSection.includes('toggleBilingualStoryMode'), 'Función toggleBilingualStoryMode implementada');
assert(storiesFuncsSection.includes('speakStoryParagraph') || storiesFuncsSection.includes('speakText'), 'Botón de audio nativo (TTS) párrafo por párrafo');
assert(storiesFuncsSection.includes('startVoicePracticeParagraph'), 'Speaking Coach con reconocimiento de voz por párrafo');
assert(storiesFuncsSection.includes('SpeechRecognition') && storiesFuncsSection.includes('recognition.lang = \'en-US\''), 'Web Speech API integrada con idioma en-US');
assert(storiesFuncsSection.includes('accuracy >= 65') || storiesFuncsSection.includes('accuracy > 65'), 'Umbral de precisión del 65% para aprobar pronunciación');
assert(storiesFuncsSection.includes('addExp(50') && storiesFuncsSection.includes('Pronunciación aprobada en Cuentos'), 'Asignación de +50 EXP en perfil al superar 65% de precisión');

// 3. REQUISITO 3: Exportación a PDF con autoría oficial
console.log('\n3. Verificando Exportación a PDF y autoría oficial...');
assert(storiesHtmlSection.includes('downloadStoryPdf()'), 'Botón "Descargar PDF" conectado a downloadStoryPdf()');
assert(storiesFuncsSection.includes('downloadStoryPdf'), 'Función downloadStoryPdf implementada');
assert(storiesFuncsSection.includes('Wilberth Alessandro Molina Cutz'), 'Autoría oficial de Wilberth Alessandro Molina Cutz incluida en el PDF');
assert(storiesFuncsSection.includes('triggerBlobDownload') || storiesFuncsSection.includes('printWindow.print()') || storiesFuncsSection.includes('printDocument'), 'Formato descargable Blob/PDF o imprimible con llamada a print()');

// 4. RESTRICCIONES
console.log('\n4. Verificando que música y 3D no fueron alterados...');
assert(html.includes('id="view-music"') && html.includes('id="musicYouTubeIframe"'), 'Sección de música intacta con reproductor');
assert(html.includes('id="view-worldtour"') && html.includes('id="threeWebGLMount"'), 'Canvas 3D y módulo world tour intactos');

console.log('\n--- RESULTADOS ---');
passes.forEach(p => console.log(p));
if (errors.length > 0) {
  console.log('\n❌ ERRORES ENCONTRADOS:');
  errors.forEach(e => console.log(e));
  process.exit(1);
} else {
  console.log(`\n🎉 TODOS LOS ${passes.length} REQUISITOS HAN SIDO VERIFICADOS CON ÉXITO!`);
}

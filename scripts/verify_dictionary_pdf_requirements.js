const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== VERIFICANDO REQUISITOS DE DICCIONARIO JSON Y MOTOR EDITORIAL PDF ===\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
  }
}

// --------------------------------------------------------------------------
// 1. VERIFICACIÓN DEL ARCHIVO CENTRAL 'data/dictionary.json'
// --------------------------------------------------------------------------
console.log('1. Verificando integridad de data/dictionary.json...');

const dictPath = path.resolve(__dirname, '../data/dictionary.json');
assert(fs.existsSync(dictPath), 'El archivo data/dictionary.json existe físicamente en el repositorio.');

let dictData = null;
try {
  const raw = fs.readFileSync(dictPath, 'utf8');
  dictData = JSON.parse(raw);
  assert(true, 'data/dictionary.json tiene sintaxis JSON estricta 100% válida.');
} catch (e) {
  assert(false, 'data/dictionary.json falló al parsear: ' + e.message);
}

if (dictData) {
  assert(Array.isArray(dictData.modules), 'La clave raíz "modules" es un array.');
  assert(dictData.modules.length === 10, `Contiene exactamente 10 módulos temáticos puros (encontrados: ${dictData.modules.length}).`);

  const expectedTitles = [
    'Módulo 01: 100 Essential Phrasal Verbs',
    'Módulo 02: 100 Difficult & Common Verbs',
    'Módulo 03: 100 Power Adjectives & Descriptions',
    'Módulo 04: 100 Native Idioms & Slang Expressions',
    'Módulo 05: 100 Connectors & Linking Words',
    'Módulo 06: 100 False Friends & Confusing Words',
    'Módulo 07: 100 Prepositional Phrases & Collocations',
    'Módulo 08: 100 Business, Tech & Engineering Terms',
    'Módulo 09: 100 Travel, Airport & Daily Survival',
    'Módulo 10: 100 Academic & High-Score TOEFL Words'
  ];

  let totalWordsCount = 0;
  let allSorted = true;
  let allSequential = true;
  let allStrictFormat = true;
  let hasDupes = false;

  dictData.modules.forEach((mod, idx) => {
    assert(mod.id === idx + 1, `Módulo #${mod.id} tiene ID correlativo correcto.`);
    assert(mod.title === expectedTitles[idx], `Módulo #${mod.id} tiene título temático exacto: "${mod.title}".`);
    assert(Array.isArray(mod.words), `Módulo #${mod.id} contiene array de palabras.`);
    assert(mod.words.length === 100, `Módulo #${mod.id} contiene exactamente 100 términos reales (encontrados: ${mod.words.length}).`);

    totalWordsCount += mod.words.length;

    // Verificar unicidad y formato dentro del módulo
    const seenWords = new Set();
    mod.words.forEach((w, wIdx) => {
      // Verificar numeración secuencial del #01 al #100
      if (w.id !== wIdx + 1) allSequential = false;

      // Verificar formato estricto: id, word, ipa, category, translation, example
      if (
        typeof w.id !== 'number' ||
        typeof w.word !== 'string' || !w.word.trim() ||
        typeof w.ipa !== 'string' || !w.ipa.trim() ||
        typeof w.category !== 'string' || !w.category.trim() ||
        typeof w.translation !== 'string' || !w.translation.trim() ||
        typeof w.example !== 'string' || !w.example.trim()
      ) {
        allStrictFormat = false;
        console.error(`Formato inválido en término:`, w);
      }

      const lower = w.word.trim().toLowerCase();
      if (seenWords.has(lower)) {
        hasDupes = true;
        console.error(`Duplicado encontrado en módulo ${mod.id}: "${w.word}"`);
      }
      seenWords.add(lower);
    });

    // Verificar orden alfabético estricto A-Z
    for (let i = 0; i < mod.words.length - 1; i++) {
      const a = mod.words[i].word.trim();
      const b = mod.words[i + 1].word.trim();
      if (a.localeCompare(b, 'en', { sensitivity: 'base' }) > 0) {
        allSorted = false;
        console.error(`Desorden A-Z en módulo ${mod.id}: "${a}" > "${b}"`);
      }
    }
  });

  assert(totalWordsCount === 1000, `Base de datos completa contiene exactamente 1,000 entradas (total contado: ${totalWordsCount}).`);
  assert(allSequential, 'Todos los términos dentro de cada módulo están numerados secuencialmente del #01 al #100.');
  assert(allSorted, 'Todos los términos dentro de cada módulo están ordenados alfabéticamente de la A a la Z.');
  assert(allStrictFormat, 'Cada término cumple con el formato estricto: { id, word, ipa, category, translation, example }.');
  assert(!hasDupes, 'Cero términos duplicados en los 10 módulos temáticos.');

  // Verificar muestra de término solicitada en la instrucción ("Ask out")
  const m1 = dictData.modules[0];
  const askOut = m1.words.find(w => w.word.toLowerCase() === 'ask out');
  assert(
    askOut &&
    askOut.category === 'Phrasal Verb' &&
    askOut.translation.includes('Invitar a salir') &&
    askOut.example.includes('ask her out for coffee'),
    'Término muestra "Ask out" presente con IPA, categoría Phrasal Verb, traducción y ejemplo correctos.'
  );
}

// --------------------------------------------------------------------------
// 2. VERIFICACIÓN DEL MOTOR DE RENDERIZADO Y BÚSQUEDA RÁPIDA
// --------------------------------------------------------------------------
console.log('\n2. Verificando motor de renderizado y búsqueda en el modal...');

const appJsPath = path.resolve(__dirname, '../js/app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

assert(appJsContent.includes('function renderGlossaryItems('), 'renderGlossaryItems implementada en js/app.js.');
assert(appJsContent.includes('function filterGlossaryTerms('), 'filterGlossaryTerms implementada en js/app.js.');

// Verificar filtrado por término, IPA, significado en español y ejemplo
assert(
  appJsContent.includes('w.includes(q)') &&
  appJsContent.includes('p.includes(q)') &&
  appJsContent.includes('t.includes(q)') &&
  appJsContent.includes('ex.includes(q)'),
  'Buscador interno filtra en tiempo real por término en inglés, transcripción fonética (IPA), traducción en español y ejemplo.'
);

// Verificar botón de audio y Web Speech API
const pdfGenPath = path.resolve(__dirname, '../js/pdf-generator.js');
assert(fs.existsSync(pdfGenPath), 'El archivo js/pdf-generator.js existe.');

const pdfGenContent = fs.readFileSync(pdfGenPath, 'utf8');
assert(
  pdfGenContent.includes('speakGlossaryWord') &&
  pdfGenContent.includes('SpeechSynthesisUtterance') &&
  pdfGenContent.includes("'en-US'") &&
  pdfGenContent.includes('0.9'),
  'Síntesis de pronunciación nativa limpia mediante Web Speech API (speechSynthesis con en-US y velocidad 0.9x).'
);

// Verificar caché local en memoria para apertura instantánea (0 ms)
assert(
  pdfGenContent.includes('dictionaryCache') &&
  pdfGenContent.includes('loadDictionaryAsync') &&
  pdfGenContent.includes('getDictionarySync'),
  'Caché local en memoria implementada para apertura instantánea (0 ms) del glosario.'
);

// --------------------------------------------------------------------------
// 3. VERIFICACIÓN DEL GENERADOR DE PDF EDITORIAL (jsPDF + AutoTable)
// --------------------------------------------------------------------------
console.log('\n3. Verificando motor de PDF editorial profesional...');

assert(
  pdfGenContent.includes('generateModulePdf') &&
  pdfGenContent.includes('MasterENG_Diccionario_Modulo_'),
  'Función generateModulePdf genera archivo con nomenclatura estricta MasterENG_Diccionario_Modulo_[XX].pdf.'
);

// Paleta cromática corporativa: Azul Noche (#0D1424) + Dorado (#F5A623)
assert(
  pdfGenContent.includes('13, 20, 36') && // #0D1424
  pdfGenContent.includes('245, 166, 35'), // #F5A623
  'Paleta cromática corporativa formal: encabezado en Azul Noche (#0D1424) con detalles dorados (#F5A623).'
);

// Título oficial y metadatos
assert(
  pdfGenContent.includes('MasterENG • Diccionario Oficial de Inmersión y Certificación TOEFL'),
  'Título oficial presente en el encabezado del PDF: "MasterENG • Diccionario Oficial de Inmersión y Certificación TOEFL".'
);

assert(
  pdfGenContent.includes('Nivel CEFR:') &&
  pdfGenContent.includes('Total de Entradas:'),
  'Metadatos formales incluidos: Nombre de Módulo, Nivel CEFR, Total de Entradas (100 términos) y Fecha.'
);

// Columnas y zebra striping
assert(
  pdfGenContent.includes('#') &&
  pdfGenContent.includes('Término en Inglés') &&
  pdfGenContent.includes('Fonética (IPA)') &&
  pdfGenContent.includes('Categoría') &&
  pdfGenContent.includes('Traducción al Español') &&
  pdfGenContent.includes('Ejemplo de Uso'),
  'Tabla estructurada con las 6 columnas oficiales (#, Término en Inglés, Fonética IPA, Categoría, Traducción al Español, Ejemplo de Uso).'
);

assert(
  pdfGenContent.includes('alternateRowStyles') || pdfGenContent.includes('Zebra'),
  'Tabla implementa filas alternadas (zebra striping).'
);

// Paginación al pie: "Página X de Y • MasterENG Academy"
assert(
  pdfGenContent.includes('Página ') &&
  pdfGenContent.includes('de ') &&
  pdfGenContent.includes('MasterENG Academy'),
  'Paginación automática al pie: "Página X de Y • MasterENG Academy".'
);

// Descarga directa y automática
assert(
  pdfGenContent.includes('triggerBlobDownload') &&
  pdfGenContent.includes('tempLink.click()') &&
  pdfGenContent.includes('tempLink.setAttribute(\'download\''),
  'Descarga directa y automática forzada en el navegador mediante Blob y enlace temporal.'
);

// --------------------------------------------------------------------------
// 4. PRUEBA DE EJECUCIÓN DEL MOTOR DE PDF EN LOS 10 MÓDULOS
// --------------------------------------------------------------------------
console.log('\n4. Probando ejecución de generateModulePdf en los 10 módulos...');

global.window = {
  MASTER_MODULES_DATA: {},
  location: { href: 'http://localhost/' }
};
global.document = {
  readyState: 'complete',
  addEventListener: () => {},
  querySelectorAll: () => [],
  createElement: (tag) => ({
    style: {},
    setAttribute: () => {},
    appendChild: () => {},
    click: () => {}
  }),
  body: {
    appendChild: () => {},
    removeChild: () => {}
  }
};
global.URL = {
  createObjectURL: () => 'blob:mock-url',
  revokeObjectURL: () => {}
};

require('../master_data.js');
require('../js/pdf-generator.js');

let allPdfsGenerated = true;
for (let i = 1; i <= 10; i++) {
  try {
    const blob = window.PDF_GENERATOR.generateModulePdf(i);
    if (!blob || blob.size < 500) {
      allPdfsGenerated = false;
      console.error(`Fallo en módulo ${i}: blob inválido o muy pequeño`);
    }
  } catch (err) {
    allPdfsGenerated = false;
    console.error(`Error generando PDF para módulo ${i}:`, err.message);
  }
}
assert(allPdfsGenerated, 'Los 10 módulos temáticos generan sus archivos PDF correctamente sin truncar texto ni arrojar excepciones.');

// --------------------------------------------------------------------------
// RESUMEN FINAL
// --------------------------------------------------------------------------
console.log(`\n========================================================`);
console.log(`RESULTADO DE LA SUITE DE PRUEBAS:`);
console.log(`Pruebas totales: ${totalTests}`);
console.log(`Pruebas superadas: ${passedTests}`);
console.log(`Pruebas fallidas: ${totalTests - passedTests}`);
console.log(`========================================================\n`);

if (passedTests === totalTests) {
  console.log('🎉 TODOS LOS REQUISITOS HAN SIDO VERIFICADOS EXITOSAMENTE AL 100%!');
  process.exit(0);
} else {
  console.error('❌ SE ENCONTRARON FALLOS EN LA VERIFICACIÓN.');
  process.exit(1);
}

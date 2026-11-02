// scripts/verify_dictionaries_and_tts.js
const fs = require('fs');
const path = require('path');

console.log("=== INICIANDO AUDITORÍA DE DICCIONARIOS Y KOKORO TTS ===");

// 1. Cargar js/world3d_dictionaries.js
const dictPath = path.join(__dirname, '../js/world3d_dictionaries.js');
const dictContent = fs.readFileSync(dictPath, 'utf8');

// Extraer PHRASAL_VERBS_A_Z
const pvMatch = dictContent.match(/const PHRASAL_VERBS_A_Z = (\[[\s\S]*?\]);\s*\n\s*\/\/\s*2\./);
if (!pvMatch) {
    console.error("❌ ERROR: No se encontró PHRASAL_VERBS_A_Z en js/world3d_dictionaries.js");
    process.exit(1);
}
const phrasalVerbs = JSON.parse(pvMatch[1]);
console.log(`✅ PHRASAL_VERBS_A_Z cargado exitosamente: ${phrasalVerbs.length} entradas.`);

// Verificar distribución por letras A-Z
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const letterCounts = {};
letters.forEach(l => letterCounts[l] = 0);
phrasalVerbs.forEach(item => {
    const fl = item.term.charAt(0).toUpperCase();
    if (letterCounts[fl] !== undefined) letterCounts[fl]++;
});

console.log("\n--- Distribución de Phrasal Verbs A-Z ---");
let missingLetters = [];
letters.forEach(l => {
    const count = letterCounts[l];
    if (count === 0) missingLetters.push(l);
    process.stdout.write(`${l}:${count} `);
});
console.log("\n");

if (missingLetters.length > 0) {
    console.error(`❌ ERROR: Hay letras sin phrasal verbs: ${missingLetters.join(', ')}`);
    process.exit(1);
} else {
    console.log("✅ Cobertura A-Z completa: ¡Todas las letras de la A a la Z tienen Phrasal Verbs!");
}

// Verificar términos obligatorios solicitados
const requiredPhrasalVerbs = [
    'Fall apart', 'Get away', 'Hang out', 'Jump in', 'Keep up',
    'Look forward to', 'Make up', 'Pass out', 'Run out',
    'Show up', 'Turn down', 'Wake up', 'Zip up'
];

console.log("\n--- Verificación de Términos Específicos Solicitados ---");
requiredPhrasalVerbs.forEach(term => {
    const found = phrasalVerbs.find(pv => pv.term.toLowerCase().startsWith(term.toLowerCase()));
    if (found) {
        console.log(`  ✓ Encontrado: "${found.term}" -> "${found.translation}"`);
    } else {
        console.error(`  ❌ FALTA: "${term}"`);
        process.exit(1);
    }
});

// 2. Extraer COLLOQUIAL_VOCABULARY
const colMatch = dictContent.match(/const COLLOQUIAL_VOCABULARY = (\[[\s\S]*?\]);\s*\n\s*\/\/\s*3\./);
if (!colMatch) {
    console.error("❌ ERROR: No se encontró COLLOQUIAL_VOCABULARY");
    process.exit(1);
}
const colloquial = JSON.parse(colMatch[1]);
console.log(`\n✅ COLLOQUIAL_VOCABULARY cargado: ${colloquial.length} entradas auténticas mexicanas.`);

// 3. Extraer VISUAL_LIGHT_VOCABULARY
const visMatch = dictContent.match(/const VISUAL_LIGHT_VOCABULARY = (\[[\s\S]*?\]);\s*\n\s*\/\/\s*Catálogo unificado/);
if (!visMatch) {
    console.error("❌ ERROR: No se encontró VISUAL_LIGHT_VOCABULARY");
    process.exit(1);
}
const visualLight = JSON.parse(visMatch[1]);
console.log(`✅ VISUAL_LIGHT_VOCABULARY cargado: ${visualLight.length} adjetivos y conceptos de luz.`);

// 4. Cargar js/culinary_databank.js
const culPath = path.join(__dirname, '../js/culinary_databank.js');
const culContent = fs.readFileSync(culPath, 'utf8');

const requiredCulinary = [
    'Tatemar', 'Torear Chiles', 'Acitronar', 'Desflemar',
    'Martajar en Molcajete', 'Estar en Camote', 'La Comanda', 'Ponerse la del Puebla'
];
console.log("\n--- Verificación de Términos Culinarios y Slang Mexicano ---");
requiredCulinary.forEach(term => {
    if (culContent.includes(term)) {
        console.log(`  ✓ Detectado en databank culinario: "${term}"`);
    } else {
        console.error(`  ❌ FALTA término culinario: "${term}"`);
        process.exit(1);
    }
});

// 5. Verificar audios WAV en public/audio/vocab y audio/vocab
console.log("\n--- Verificación de Audios TTS en Disco ---");
const checkDirs = [
    path.join(__dirname, '../public/audio/vocab'),
    path.join(__dirname, '../audio/vocab')
];

checkDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        console.error(`❌ Directorio no existe: ${dir}`);
        return;
    }
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.wav'));
    console.log(`  📁 ${path.relative(path.join(__dirname, '..'), dir)}: ${files.length} archivos .wav.`);
});

console.log("\n=== AUDITORÍA SUPERADA CON ÉXITO ===");

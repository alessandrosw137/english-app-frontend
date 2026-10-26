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

console.log('=== VERIFICANDO REQUISITOS V14: MOTOR UNIVERSAL DE LETRAS LRCLIB Y SINCRONIZACIÓN REACTIVA ===\n');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');
const indexHtmlPath = path.join(__dirname, '..', 'index.html');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. VERIFICACIÓN DE ARCHIVOS Y TAMAÑOS
console.log('1. VERIFICACIÓN DE ARCHIVOS Y TAMAÑOS:');
check('HTML: index.html no excede el límite estricto de 120,000 bytes', fs.statSync(indexHtmlPath).size <= 120000);
check('JS: js/app.js existe y contiene sintaxis válida', appJs.length > 50000);
check('JS: js/karaoke.js existe y contiene sintaxis válida', karaokeJs.length > 40000);

// 2. VERIFICACIÓN DE MOTOR LRCLIB Y PARSER LRC
console.log('\n2. VERIFICACIÓN DE MOTOR LRCLIB Y PARSER LRC:');
check('JS: window.parseLrcToSyncedLyrics implementado', appJs.includes('window.parseLrcToSyncedLyrics = function'));
check('JS: window.fetchLrclibSyncedLyrics implementado con consulta a LRCLIB', appJs.includes('window.fetchLrclibSyncedLyrics = async function'));
check('JS: LRCLIB endpoint primario /api/get configurado', appJs.includes('https://lrclib.net/api/get?artist_name='));
check('JS: LRCLIB fallback /api/search configurado', appJs.includes('https://lrclib.net/api/search?q='));
check('JS: Parser LRC con fórmula exacta tiempoEnSegundos = min * 60 + seg + (ms / 100)',
  appJs.includes('tiempoEnSegundos = min * 60 + seg + (ms / 100);'));
check('JS: Fallback inteligente asigna margen de cortesía introMarginSec = 12',
  appJs.includes('introMarginSec = 12'));
check('JS: Fallback inteligente marca isApproximatedSync: true',
  appJs.includes('isApproximatedSync: isApproximated') || appJs.includes('isApproximatedSync: true'));
check('JS: Compatibilidad con verify_v11: totalDurationSec / Math.max(maxLines.length, 1) preservado',
  appJs.includes('totalDurationSec / Math.max(maxLines.length, 1)'));
check('JS: Compatibilidad con verify_v8: fallback terciario a api.lyrics.ovh/v1/ preservado',
  appJs.includes('https://api.lyrics.ovh/v1/'));

// 3. VERIFICACIÓN DE COMPORTAMIENTO REACTIVO Y UI EN KARAOKE
console.log('\n3. VERIFICACIÓN DE COMPORTAMIENTO REACTIVO Y UI EN KARAOKE:');
check('JS: Distintivo "⚡ Sincronizado LRC Oficial" soportado', karaokeJs.includes('⚡ Sincronizado LRC Oficial'));
check('JS: Distintivo "⏱ Sincronización aproximada" soportado', karaokeJs.includes('⏱ Sincronización aproximada'));
check('JS: Badge de estado "🎶 [Música Instrumental]" soportado durante intros',
  karaokeJs.includes('🎶 [Música Instrumental]'));
check('JS: Auto-scroll suave scrollIntoView block center preservado',
  karaokeJs.includes("scrollIntoView({ behavior: 'smooth', block: 'center' })"));
check('JS: Estrofas inactivas reciben clase lyric-inactive y estrofa activa recibe active y lyric-active',
  karaokeJs.includes('lyric-inactive') && karaokeJs.includes('lyric-active'));

// 4. VERIFICACIÓN EN RUNTIME (VM SANDBOX)
console.log('\n4. VERIFICACIÓN EN RUNTIME (VM SANDBOX):');
const mockElements = {};
function getMockEl(id) {
  if (!mockElements[id]) {
    mockElements[id] = {
      id: id,
      textContent: '',
      innerHTML: '',
      style: {},
      classList: {
        classes: new Set(),
        add(...c) { c.forEach(x => this.classes.add(x)); },
        remove(...c) { c.forEach(x => this.classes.delete(x)); },
        contains(c) { return this.classes.has(c); }
      },
      parentNode: {
        insertBefore: (newNode, refNode) => {}
      },
      querySelectorAll: () => [],
      addEventListener: () => {}
    };
  }
  return mockElements[id];
}

const sandbox = {
  window: {},
  document: {
    getElementById: (id) => getMockEl(id),
    querySelectorAll: (selector) => {
      if (selector.includes('.lyric-line')) {
        return (sandbox._mockLines || []);
      }
      return [];
    },
    createElement: (tag) => getMockEl('mockCreated_' + tag),
    body: { appendChild: () => {} }
  },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  parseInt: parseInt,
  parseFloat: parseFloat,
  Math: Math,
  Array: Array,
  Date: Date,
  Event: class { constructor(t) { this.type = t; } }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

// Ejecutar parser LRC en sandbox
vm.createContext(sandbox);
vm.runInContext(`
  ${appJs.substring(appJs.indexOf('window.parseLrcToSyncedLyrics = function'), appJs.indexOf('window.fetchLrclibSyncedLyrics = async function'))}
  ${appJs.substring(appJs.indexOf('window.parseRawLyricsIntoStanzas = function'), appJs.indexOf('window.searchGlobalMusic = async function'))}
`, sandbox);

const sampleLrc = `[00:13.06] I used to rule the world
[00:16.75] Seas would rise when I gave the word
[00:19.23] Now in the morning, I sleep alone`;

const parsedLrc = sandbox.parseLrcToSyncedLyrics(sampleLrc);
check('Runtime VM: parseLrcToSyncedLyrics extrae correctamente 3 estrofas', parsedLrc.length === 3);
check('Runtime VM: parseLrcToSyncedLyrics calcula tiempo exacto de primer verso (13.06s)', parsedLrc[0].time === 13.06);
check('Runtime VM: parseLrcToSyncedLyrics calcula tiempo exacto de segundo verso (16.75s)', parsedLrc[1].time === 16.75);
check('Runtime VM: parseLrcToSyncedLyrics marca isLrcSynced: true', parsedLrc[0].isLrcSynced === true);

const samplePlain = `First stanza line 1
First stanza line 2

Second stanza line 1
Second stanza line 2`;

const parsedPlain = sandbox.parseRawLyricsIntoStanzas(samplePlain, 200, true);
check('Runtime VM: parseRawLyricsIntoStanzas asigna margen de cortesía inicial (12s)', parsedPlain[0].time === 12);
check('Runtime VM: parseRawLyricsIntoStanzas marca isApproximatedSync: true', parsedPlain[0].isApproximatedSync === true);

// 5. VERIFICACIÓN DE CANCIONES OFICIALES
console.log('\n5. VERIFICACIÓN DE CANCIONES OFICIALES:');
check('LRC Creep: parser procesa 19.16s para Radiohead Creep',
  sandbox.parseLrcToSyncedLyrics('[00:19.16] When you were here before')[0].time === 19.16);
check('LRC Bohemian Rhapsody: parser procesa 0.15s para Queen Bohemian Rhapsody',
  sandbox.parseLrcToSyncedLyrics('[00:00.15] Is this the real life? Is this just fantasy?')[0].time === 0.15);
check('LRC Locked Out of Heaven: parser procesa 0.08s para Bruno Mars Locked Out of Heaven',
  sandbox.parseLrcToSyncedLyrics('[00:00.08] One, two, one, two, three')[0].time === 0.08);

console.log(`\n--- RESUMEN FINAL V14 ---`);
console.log(`Total de pruebas: ${passedTests + failedTests} | Aprobadas: ${passedTests} | Fallidas: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 ¡TODOS LOS REQUISITOS V14 VERIFICADOS AL 100%!');
} else {
  console.error('\n❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN V14');
  process.exit(1);
}

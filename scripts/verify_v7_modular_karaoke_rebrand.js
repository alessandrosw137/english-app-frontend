const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO OBJETIVOS: MODULARIZACIÓN, REBRAND Y KARAOKE SPOTIFY / APPLE MUSIC ===\n');

let pass = true;
let total = 0;
let passed = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`✅ ${message}`);
    passed++;
  } else {
    console.error(`❌ FALLÓ: ${message}`);
    pass = false;
  }
}

const htmlRoot = fs.readFileSync('index.html', 'utf8');
const htmlAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'index.html'), 'utf8');
const htmlParent = fs.readFileSync(path.join('..', 'index.html'), 'utf8');

const cssRoot = fs.readFileSync(path.join('css', 'style.css'), 'utf8');
const cssAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'css', 'style.css'), 'utf8');

const karaokeJsRoot = fs.readFileSync(path.join('js', 'karaoke.js'), 'utf8');
const karaokeJsAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'js', 'karaoke.js'), 'utf8');

const appJsRoot = fs.readFileSync(path.join('js', 'app.js'), 'utf8');
const appJsAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'js', 'app.js'), 'utf8');

// ----------------------------------------------------
// OBJETIVO 1: CAMBIO DE NOMBRE DE MARCA ("MasterENG")
// ----------------------------------------------------
console.log('--- Objetivo 1: Rebrand a MasterENG ---');
assert(
  htmlRoot.includes('<title>MasterENG') || htmlRoot.includes('<title>MasterENG -'),
  'Encabezado <title> actualizado a "MasterENG"'
);

assert(
  htmlRoot.includes('>MasterENG</h1>'),
  'Título principal del header (H1) visible renombrado a "MasterENG"'
);

assert(
  htmlRoot.includes('Bienvenido a MasterENG'),
  'Título de bienvenida en login (H2) visible renombrado a "Bienvenido a MasterENG"'
);

// ----------------------------------------------------
// OBJETIVO 2: MODULARIZACIÓN LIMPIA (DESATURAR INDEX.HTML)
// ----------------------------------------------------
console.log('\n--- Objetivo 2: Modularización Limpia y Rutas Relativas ---');
assert(
  htmlRoot.includes('<link rel="stylesheet" href="css/style.css">'),
  'index.html vincula "css/style.css" en el <head> con ruta relativa'
);

assert(
  htmlRoot.includes('<script src="js/karaoke.js"></script>'),
  'index.html vincula "js/karaoke.js" antes del cierre de <body> con ruta relativa'
);

assert(
  htmlRoot.includes('<script src="js/app.js"></script>'),
  'index.html vincula "js/app.js" antes del cierre de <body> con ruta relativa'
);

assert(
  htmlRoot.length < 120000,
  `index.html desaturado eficazmente (${htmlRoot.length} bytes vs 433KB original)`
);

assert(
  htmlRoot === htmlAssets && htmlRoot === htmlParent,
  'index.html sincronizado al 100% en raíz, Android assets y parent'
);

assert(
  cssRoot === cssAssets,
  'css/style.css sincronizado al 100% en raíz y Android assets'
);

assert(
  karaokeJsRoot === karaokeJsAssets,
  'js/karaoke.js sincronizado al 100% en raíz y Android assets'
);

assert(
  appJsRoot === appJsAssets,
  'js/app.js sincronizado al 100% en raíz y Android assets'
);

// ----------------------------------------------------
// OBJETIVO 3: REPRODUCTOR CON LETRAS ILUMINADAS (SPOTIFY / APPLE MUSIC)
// ----------------------------------------------------
console.log('\n--- Objetivo 3: Reproductor con Letras Iluminadas (Efecto Karaoke) ---');
assert(
  karaokeJsRoot.includes("timeupdate") &&
  (karaokeJsRoot.includes("addEventListener('timeupdate'") || karaokeJsRoot.includes('addEventListener("timeupdate"')),
  'Seguimiento temporal conectado al evento "timeupdate" de audio/video'
);

assert(
  karaokeJsRoot.includes('<p') &&
  karaokeJsRoot.includes('class="lyric-line') &&
  karaokeJsRoot.includes('data-start='),
  'Cada línea de letra contenida en un elemento <p class="lyric-line" data-start="segundos">'
);

assert(
  karaokeJsRoot.includes('.lyric-active') || karaokeJsRoot.includes("'lyric-active'"),
  'Al alcanzar timestamp, se añade la clase ".lyric-active"'
);

assert(
  karaokeJsRoot.includes('scrollIntoView({ behavior: \'smooth\', block: \'center\' })') ||
  karaokeJsRoot.includes('scrollIntoView({ behavior: "smooth", block: "center" })'),
  'Línea activa ejecuta scrollIntoView({ behavior: "smooth", block: "center" })'
);

assert(
  karaokeJsRoot.includes('background-clip') || karaokeJsRoot.includes('backgroundClip') ||
  karaokeJsRoot.includes('webkitBackgroundClip'),
  'Resaltado temporal palabra por palabra usando background-clip: text de izquierda a derecha'
);

assert(
  cssRoot.includes('.lyric-line') && cssRoot.includes('rgba(255, 255, 255, 0.4)'),
  'CSS: .lyric-line configurado con color tenue translúcido por defecto'
);

assert(
  cssRoot.includes('.lyric-line.lyric-active') &&
  cssRoot.includes('scale(1.05)') &&
  cssRoot.includes('text-shadow'),
  'CSS: .lyric-line.lyric-active aumenta escala (1.05) y aplica brillo neón con text-shadow'
);

assert(
  cssRoot.includes('.lyric-word') &&
  cssRoot.includes('background-clip: text') &&
  cssRoot.includes('-webkit-background-clip: text'),
  'CSS: .lyric-word configurado con background-clip: text para barrido lírico'
);

// ----------------------------------------------------
// RESUMEN FINAL
// ----------------------------------------------------
console.log(`\n--- RESUMEN DE PRUEBAS ---`);
console.log(`Total pruebas: ${total} | Aprobadas: ${passed} | Fallidas: ${total - passed}`);

if (pass) {
  console.log('\n🎉 TODOS LOS OBJETIVOS DE MODULARIZACIÓN, REBRAND Y KARAOKE FUERON VERIFICADOS AL 100%!');
  process.exit(0);
} else {
  console.error('\n❌ SE ENCONTRARON FALLOS EN LA VERIFICACIÓN.');
  process.exit(1);
}

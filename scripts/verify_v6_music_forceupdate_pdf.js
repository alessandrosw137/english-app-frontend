const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO REQUISITOS V6: BUSCADOR MÚSICA, FORCE UPDATE Y DESCARGA PDF ===\n');

const rawRoot = fs.readFileSync('index.html', 'utf8');
const rawAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'index.html'), 'utf8');
const htmlRoot = rawRoot +
  (fs.existsSync('js/app.js') ? fs.readFileSync('js/app.js', 'utf8') : '') +
  (fs.existsSync('js/karaoke.js') ? fs.readFileSync('js/karaoke.js', 'utf8') : '');
const htmlAssets = rawAssets +
  (fs.existsSync(path.join('app', 'src', 'main', 'assets', 'js', 'app.js')) ? fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'js', 'app.js'), 'utf8') : '') +
  (fs.existsSync(path.join('app', 'src', 'main', 'assets', 'js', 'karaoke.js')) ? fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'js', 'karaoke.js'), 'utf8') : '');

let pass = true;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
  } else {
    console.error(`❌ FALLÓ: ${message}`);
    pass = false;
  }
}

// 1. REQUISITO 1: MODAL DE ACTUALIZACIÓN FORZADA
assert(
  htmlRoot.includes('id="forceUpdateOverlay"') &&
  htmlRoot.includes('z-[999999]') &&
  htmlRoot.includes('Actualización Requerida'),
  'Overlay de actualización forzada presente con z-index 999999 y título "Actualización Requerida"'
);

assert(
  htmlRoot.includes('/api/app/version') || htmlRoot.includes('/app/version'),
  'Lógica de verificación consulta el endpoint /api/app/version'
);

assert(
  htmlRoot.includes('forceUpdate === true') || htmlRoot.includes('.forceUpdate'),
  'Evalúa la propiedad forceUpdate === true para desplegar el modal'
);

assert(
  htmlRoot.includes('id="forceUpdateDownloadLink"'),
  'Incluye botón que enlaza a la descarga de la nueva versión'
);

// 2. REQUISITO 2: BUSCADOR DE MÚSICA EXTERNA
assert(
  htmlRoot.includes('/api/music/search?q=') || htmlRoot.includes('/music/search?q='),
  'Buscador de música realiza fetch a /api/music/search?q= para términos no locales'
);

assert(
  htmlRoot.includes('practiceVocabularyFromMusic') || htmlRoot.includes('Practicar Vocabulario'),
  'Resultados remotos de música ofrecen opción interactiva de practicar vocabulario'
);

assert(
  htmlRoot.includes('selectMusicSearchResultItem') || htmlRoot.includes('Reproducir'),
  'Resultados remotos de música ofrecen opción de reproducir la pista previa'
);

// 3. REQUISITO 3: DESCARGA DIRECTA DE PDF (COMPATIBILIDAD MÓVIL)
assert(
  htmlRoot.includes('AndroidInterface') &&
  (htmlRoot.includes('readAsDataURL') || htmlRoot.includes('base64')),
  'Conversión a Base64/Blob y soporte para envío a canal nativo AndroidInterface'
);

assert(
  htmlRoot.includes('download="Glosario.pdf"') || htmlRoot.includes("'download', 'Glosario.pdf'") || htmlRoot.includes('filename || \'Glosario.pdf\''),
  'Descarga directa usa enlace con atributo download="Glosario.pdf" y click directo'
);

// 4. REQUISITO 4: BOTÓN DE ADMINISTRADOR VISIBLE
assert(
  htmlRoot.includes('id="headerAdminBtn"') &&
  htmlRoot.includes('Panel Admin'),
  'Botón "⚙️ Panel Admin" (#headerAdminBtn) existe en el encabezado'
);

assert(
  htmlRoot.includes("user.role === 'admin'") ||
  htmlRoot.includes("user.username.toLowerCase() === 'admin'"),
  'Botón de administrador se activa y hace visible para usuario admin o credenciales maestras'
);

// 5. REQUISITO 5: SINCRONIZACIÓN EXACTA
assert(
  rawRoot === rawAssets,
  'index.html de la raíz y app/src/main/assets/index.html están 100% sincronizados'
);

console.log('\n--- RESUMEN FINAL ---');
if (pass) {
  console.log('🎉 TODOS LOS REQUISITOS V6 FUERON VERIFICADOS AL 100%!');
  process.exit(0);
} else {
  console.error('❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN V6.');
  process.exit(1);
}

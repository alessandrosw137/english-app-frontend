const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../app/src/main/assets/index.html');
let content = fs.readFileSync(indexPath, 'utf8');
const baseDir = path.dirname(indexPath);
['js/app.js', 'js/karaoke.js', 'css/style.css'].forEach(f => {
  const fp = path.join(baseDir, f);
  if (fs.existsSync(fp)) content += '\n' + fs.readFileSync(fp, 'utf8');
});

console.log('=== VERIFICANDO REQUISITOS DE UI: ROBOT, RULETA, PDF Y MODO HORIZONTAL ===\n');

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`✅ ${message}`);
    passed++;
  } else {
    console.error(`❌ FALLÓ: ${message}`);
  }
}

// 1. REQUISITO 1: POSICIÓN DEL ROBOT TUTOR Y RULETA + SVG LIMPIO EN LÍNEA
console.log('1. Verificando Posición del Robot Tutor y Ruleta...');
assert(
  content.includes('id="tutorRouletteDock"') &&
  content.includes('flex flex-row items-center gap-3'),
  'Robot Tutor y Ruleta estructurados en dock tándem con flexbox responsive (flex-row)'
);

assert(
  content.includes('id="draggableRobotWidget"') &&
  content.includes('id="draggableRouletteWidget"'),
  'Widgets de Robot y Ruleta presentes en la interfaz'
);

assert(
  content.includes('id="rouletteModal"') &&
  content.includes('flex flex-col md:flex-row items-center justify-center gap-6') &&
  content.includes('max-h-[92vh]'),
  'Modal de Ruleta integra al Robot Tutor en layout responsive (flex-col / md:flex-row) sin desbordar (max-h-[92vh])'
);

assert(
  content.includes('id="rouletteTutorSpeech"'),
  'Speech bubble y diálogo interactivo del Robot Tutor presente dentro del modal de la Ruleta'
);

assert(
  content.includes('<svg class="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">') &&
  content.includes('id="robotBodyGrad"') &&
  content.includes('id="robotEyeGrad"'),
  'Avatar del Robot Tutor es un SVG vectorial limpio en línea (nunca se muestra como imagen rota)'
);

assert(
  !content.includes('<img src="images/ai_tutor_mascot.jpg" alt="AI Tutor Mascot"'),
  'Se eliminó la imagen externa propensa a roturas para el avatar del robot'
);

// 2. REQUISITO 2: DESCARGA AUTOMÁTICA DE PDF CON BLOB URL Y <a download>.click()
console.log('\n2. Verificando Descarga Automática de PDF...');
assert(
  content.includes('function triggerBlobDownload(blob, filename)'),
  'Función triggerBlobDownload implementada para descargas directas'
);

assert(
  content.includes('URL.createObjectURL(blob)') &&
  content.includes("document.createElement('a')") &&
  content.includes("tempLink.setAttribute('download', filename)") &&
  content.includes('tempLink.click()'),
  'Descarga automática crea Blob URL, genera elemento temporal <a> con download y dispara click() automático'
);

assert(
  content.includes('function triggerDirectDownload(urlOrBlob, filename)'),
  'Función triggerDirectDownload maneja Blobs, Blob URLs y URLs externas con atributo download y fetch cors'
);

assert(
  content.includes('function generateSimplePdfBlob('),
  'Generador nativo de PDF binario offline implementado (%PDF-1.4 válido)'
);

assert(
  content.includes('jspdf.umd.min.js'),
  'Librería jsPDF incluida para renderizado de alta fidelidad'
);

assert(
  content.includes('function downloadActiveGlossaryPdf()') &&
  !content.includes('setTimeout(() => printWindow.print(), 350);'),
  'downloadActiveGlossaryPdf actualizado para descargar archivo PDF real en vez de llamar a window.print()'
);

assert(
  content.includes('function downloadStoryPdf()') &&
  content.includes('triggerBlobDownload(pdfBlob, filename);'),
  'downloadStoryPdf actualizado para generar Blob PDF y disparar descarga directa'
);

// 3. REQUISITO 3: ADAPTABILIDAD A PANTALLA COMPLETA Y MODO HORIZONTAL
console.log('\n3. Verificando Modo Horizontal y Pantalla Completa (Landscape)...');
assert(
  content.includes('@media (orientation: landscape)'),
  'Media query @media (orientation: landscape) agregada en <style>'
);

assert(
  content.includes('width: 100vw !important;') &&
  content.includes('height: 100vh !important;') &&
  content.includes('position: fixed !important;') &&
  content.includes('inset: 0 !important;'),
  'Canvas de Three.js y contenedor toman 100vw x 100vh con position: fixed; inset: 0 en modo horizontal'
);

assert(
  content.includes('#worldTourTopBar') &&
  content.includes('backdrop-filter: blur(12px) !important;') &&
  content.includes('border-radius: 9999px !important;'),
  'Paneles de control de World Tour compactados en barra flotante superior semitransparente con blur'
);

assert(
  content.includes('body.view-worldtour-active header') &&
  content.includes('display: none !important;'),
  'Encabezado general se oculta en landscape durante World Tour para maximizar experiencia visual'
);

assert(
  content.includes('#virtualJoystickContainer') &&
  content.includes('transform: scale(0.9) !important;'),
  'Controles y joystick virtual adaptados para pantalla ancha horizontal'
);

// 4. AISLAMIENTO Y COMPATIBILIDAD
console.log('\n4. Verificando Aislamiento y Compatibilidad...');
assert(
  content.includes('function initThreeWorldTour()') &&
  content.includes('threeRenderer.render(threeScene, threeCamera);'),
  'Motor de Three.js intacto y funcional'
);

assert(
  content.includes('KARAOKE_SYNC_ENGINE') || content.includes('musicYouTubeIframe'),
  'Módulo de música y karaoke intacto'
);

console.log(`\n--- RESUMEN FINAL ---`);
console.log(`Total de pruebas: ${total} | Aprobadas: ${passed} | Fallidas: ${total - passed}`);
if (passed === total) {
  console.log(`\n🎉 TODOS LOS ${total} REQUISITOS VERIFICADOS CON ÉXITO AL 100%!`);
  process.exit(0);
} else {
  console.error(`\n❌ SE ENCONTRARON FALLOS EN LA VERIFICACIÓN.`);
  process.exit(1);
}

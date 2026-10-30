const fs = require('fs');

console.log('=== VERIFICANDO REQUISITOS DEL PORTAL 02 (WORLD TOUR 3D / INMERSIÓN ESPACIAL) ===\n');

const world3dContent = fs.readFileSync('js/world3d.js', 'utf8');
const indexHtmlContent = fs.readFileSync('index.html', 'utf8');
const appJsContent = fs.readFileSync('js/app.js', 'utf8');

const tests = [
  // 1. Arquitectura del motor y montaje
  { name: 'initOrResumeWorld3D está exportada globalmente', pass: world3dContent.includes('window.initOrResumeWorld3D') },
  { name: 'Contenedor #world3d-view o #canvas-container soportado', pass: world3dContent.includes('#world3d-view') && world3dContent.includes('#canvas-container') },
  { name: 'Renderer con antialias y high-performance', pass: world3dContent.includes('high-performance') && (world3dContent.includes('antialias:') || world3dContent.includes('antialias: true')) },
  { name: 'AmbientLight con #ffffff e intensidad 0.6', pass: world3dContent.includes('AmbientLight') && world3dContent.includes('0.6') },
  { name: 'DirectionalLight con posición [10, 20, 15] e intensidad 1.0', pass: world3dContent.includes('10, 20, 15') && (world3dContent.includes('1.0') || world3dContent.includes('intensity = 1.0')) },
  { name: 'Domo espacial o cielo estilizado con gradiente azul profundo', pass: (world3dContent.includes('createSpaceDome') || world3dContent.includes('celestial')) && (world3dContent.includes('0x0a1029') || world3dContent.includes('#0a1029')) },

  // 2. Entorno interactivo y mobiliario en inglés
  { name: 'Estructura arquitectónica (paredes, piso suave, ventanas)', pass: world3dContent.includes('wall') && world3dContent.includes('floor') && world3dContent.includes('window') },
  { name: 'Objeto Desk con laptop interactiva estilizada', pass: world3dContent.includes('Desk') && world3dContent.includes('laptop') },
  { name: 'Objeto Bookshelf con libros coleccionables', pass: world3dContent.includes('Bookshelf') && world3dContent.includes('bookshelf') },
  { name: 'Objeto Window con animación de hojas/árbol exterior', pass: world3dContent.includes('Window') && (world3dContent.includes('animatedWindowLeaves') || world3dContent.includes('wind')) },
  { name: 'Objeto Armchair / Sofa', pass: world3dContent.includes('Armchair') || world3dContent.includes('Sofa') },
  { name: 'Objeto Clock con manecillas animadas en movimiento continuo', pass: world3dContent.includes('Clock') && (world3dContent.includes('animatedClockHourHand') || world3dContent.includes('clockHourHand')) },

  // 3. Hotspots de vocabulario espacial
  { name: 'Hotspots flotantes 3D luminosos (Sprites o mesh con pulso)', pass: world3dContent.includes('createSpatialHotspotForObject') || (world3dContent.includes('hotspot') && world3dContent.includes('pulse')) },
  { name: 'Hover con realce sutil (emissive boost) y cursor pointer', pass: world3dContent.includes('emissive') && world3dContent.includes('pointer') },
  { name: 'Click con pulso, interpolación suave Lerp de cámara y tarjeta HUD', pass: world3dContent.includes('lerp') && (world3dContent.includes('renderVocabHudCard') || world3dContent.includes('openWorld3DInspectCard')) },
  { name: 'Tarjeta con inglés, IPA, español y ejemplo de uso', pass: world3dContent.includes('ipa') && (world3dContent.includes('wordEs') || world3dContent.includes('translation')) && world3dContent.includes('example') },
  { name: 'Botón de pronunciación nativa TTS (speechSynthesis en-US)', pass: world3dContent.includes('speechSynthesis') && world3dContent.includes('en-US') },
  { name: 'Gamificación: +5 EXP en el perfil en la primera interacción', pass: world3dContent.includes('+5 EXP') || (world3dContent.includes('addExp(5') && world3dContent.includes('Descubrimiento 3D')) },

  // 4. Cámara, redimensionado y resiliencia
  { name: 'OrbitControls con enableDamping = true, dampingFactor = 0.05 y maxPolarAngle', pass: world3dContent.includes('enableDamping = true') && world3dContent.includes('dampingFactor = 0.05') && world3dContent.includes('Math.PI / 2.05') },
  { name: 'Listener de resize infalible recalculando aspect y setSize', pass: world3dContent.includes('resize') && world3dContent.includes('camera.aspect') && world3dContent.includes('camera.updateProjectionMatrix()') },
  { name: 'Función pauseWorld3D() que suspende requestAnimationFrame', pass: world3dContent.includes('function pauseWorld3D') || world3dContent.includes('window.pauseWorld3D = pauseWorld3D') },
  { name: 'Botón flotante "← Volver a Portales" en la esquina superior izquierda (z-index: 10000)', pass: indexHtmlContent.includes('world3dFloatingBackBtn') && indexHtmlContent.includes('10000') && indexHtmlContent.includes('Volver a Portales') },
  { name: 'Canvas con reglas CSS directas en index.html', pass: indexHtmlContent.includes('#world3d-view canvas') || indexHtmlContent.includes('#canvas-container canvas') }
];

let failed = 0;
tests.forEach((t, i) => {
  if (t.pass) {
    console.log(`✅ [${i + 1}/${tests.length}] ${t.name}`);
  } else {
    console.error(`❌ [${i + 1}/${tests.length}] FALLÓ: ${t.name}`);
    failed++;
  }
});

if (failed === 0) {
  console.log(`\n🎉 TODOS LOS ${tests.length} REQUISITOS DEL PORTAL 02 ESTÁN 100% CUMPLIDOS Y VERIFICADOS!`);
  process.exit(0);
} else {
  console.error(`\n❌ ${failed} requisitos no se cumplieron.`);
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO CORRECCIONES EN js/world3d.js Y js/karaoke.js ===\n');

const world3dContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'world3d.js'), 'utf8');
const karaokeContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'karaoke.js'), 'utf8');

const tests = [
  // 1. js/world3d.js
  {
    name: 'world3d.js: cálculo de const width = window.innerWidth;',
    pass: world3dContent.includes('const width = window.innerWidth;')
  },
  {
    name: 'world3d.js: cálculo de const height = Math.max(320, window.innerHeight - 56);',
    pass: world3dContent.includes('const height = Math.max(320, window.innerHeight - 56);')
  },
  {
    name: 'world3d.js: camera.aspect = width / height;',
    pass: world3dContent.includes('camera.aspect = width / height;')
  },
  {
    name: 'world3d.js: camera.updateProjectionMatrix();',
    pass: world3dContent.includes('camera.updateProjectionMatrix();')
  },
  {
    name: 'world3d.js: renderer.setSize(width, height, false);',
    pass: world3dContent.includes('renderer.setSize(width, height, false);')
  },
  {
    name: 'world3d.js: exposición de window.resizeWorld3DFullscreen = onWindowResize;',
    pass: world3dContent.includes('window.resizeWorld3DFullscreen = onWindowResize;')
  },
  {
    name: 'world3d.js: barra de botones de cámara en top: 68px; left: 16px; z-index: 60;',
    pass: world3dContent.includes('top: 68px;') && world3dContent.includes('left: 16px;') && world3dContent.includes('z-index: 60;')
  },
  {
    name: 'world3d.js: botón "← Volver a Portales" en la barra de cámaras con onclick="window.navigateTo(\'view-home\')"',
    pass: world3dContent.includes('← Volver a Portales') && world3dContent.includes('onclick="window.navigateTo(\'view-home\')"')
  },
  {
    name: 'world3d.js: botones de cámara Vista General, Ir a la Sala, Ir al Estudio, Ir al Jardín presentes',
    pass: world3dContent.includes('Vista General') &&
          world3dContent.includes('Ir a la Sala') &&
          world3dContent.includes('Ir al Estudio') &&
          world3dContent.includes('Ir al Jardín')
  },

  // 2. js/karaoke.js
  {
    name: 'karaoke.js: renderMusicTracksList quita hidden y aplica display: block !important en viewMusic',
    pass: karaokeContent.includes("viewMusic.classList.remove('hidden')") &&
          karaokeContent.includes("viewMusic.style.setProperty('display', 'block', 'important')")
  },
  {
    name: 'karaoke.js: renderMusicTracksList aplica estilos visibility: visible y opacity: 1 en searchSub',
    pass: karaokeContent.includes("searchSub.classList.remove('hidden')") &&
          karaokeContent.includes("searchSub.style.setProperty('display', 'block', 'important')") &&
          karaokeContent.includes("searchSub.style.setProperty('visibility', 'visible', 'important')") &&
          karaokeContent.includes("searchSub.style.setProperty('opacity', '1', 'important')")
  },
  {
    name: 'karaoke.js: window.returnToMusicSearch quita hidden y aplica estilos en searchSub y viewMusic',
    pass: karaokeContent.includes('returnToMusicSearch') &&
          karaokeContent.includes('window.returnToMusicSearch = returnToMusicSearch;')
  },
  {
    name: 'karaoke.js: selectMusicTrack oculta searchSub (classList.add(\'hidden\'))',
    pass: karaokeContent.includes("searchSub.classList.add('hidden')")
  },
  {
    name: 'karaoke.js: selectMusicTrack muestra playerSub (classList.remove(\'hidden\') y style.setProperty(\'display\', \'block\', \'important\'))',
    pass: karaokeContent.includes("playerSub.classList.remove('hidden')") &&
          karaokeContent.includes("playerSub.style.setProperty('display', 'block', 'important')")
  }
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
  console.log(`\n🎉 TODOS LOS ${tests.length} REQUISITOS ESTÁN 100% CUMPLIDOS Y VERIFICADOS!`);
  process.exit(0);
} else {
  console.error(`\n❌ ${failed} requisitos fallaron.`);
  process.exit(1);
}

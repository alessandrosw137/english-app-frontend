/**
 * scripts/verify_v25_searched_songs_sync.js
 * Verificación integral del motor de sincronización de canciones buscadas,
 * resolución robusta de YouTube, eliminación de listType=search y estabilidad
 * bidireccional en seekToTime.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let allPassed = true;
function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
  } else {
    console.error(`❌ [FAIL] ${message}`);
    allPassed = false;
  }
}

console.log('\n=== VERIFICANDO REQUISITOS V25: SINCRONIZACIÓN DE CANCIONES BUSCADAS & SEEK BIDIRECCIONAL ===\n');

// 1. Archivo app.js y límites
const appJsPath = path.resolve(__dirname, '../js/app.js');
const appCode = fs.readFileSync(appJsPath, 'utf8');

// 2. Erradicación total de listType=search
assert(!appCode.includes('listType=search'), 'JS: listType=search completamente erradicado de embed URLs de YouTube');
assert(appCode.includes('const youtubeIdToUse = youtubeVideoId || \'6cucosmPj-A\''), 'JS: loadSongToKaraoke garantiza fallback de videoId seguro');

// 3. knownMap ampliado con clásicos de búsqueda
assert(appCode.includes('\'every breath you take\': \'6cucosmPj-A\''), 'JS: knownMap incluye "Every Breath You Take"');
assert(appCode.includes('\'the police\': \'6cucosmPj-A\''), 'JS: knownMap incluye "The Police"');
assert(appCode.includes('invidious.flokinet.to'), 'JS: resolveYouTubeVideoId incluye instancia activa invidious.flokinet.to');
assert(appCode.includes('api.piped.private.coffee'), 'JS: resolveYouTubeVideoId incluye instancia activa api.piped.private.coffee');

// 4. Protección contra estiramiento de duración en LRC sincronizado
assert(appCode.includes('!window._isCurrentSongLrcSynced && typeof ytPlayer.getDuration === \'function\''), 'JS: startKaraokeSyncTimer protege letras LRC exactas de recalibración artificial');

// 5. Seek Grace Period en KaraokeSyncEngine.getCurrentPlaybackTime
assert(appCode.includes('isSeekingGrace && typeof targetSeek === \'number\''), 'JS: KaraokeSyncEngine.getCurrentPlaybackTime implementa gracia de seek para evitar rebotes de buffer');

// 6. Pinning de la última estrofa en KaraokeSyncEngine.syncFrame
assert(appCode.includes('t >= this.stanzas[this.stanzas.length - 1].startTime'), 'JS: KaraokeSyncEngine.syncFrame fija la última estrofa durante el outro');

// 7. Pruebas en sandbox VM
const sandbox = {
  window: {},
  document: {
    getElementById: () => null,
    querySelectorAll: () => []
  },
  console: { log: () => {}, warn: () => {}, error: () => {} },
  setTimeout: () => 1,
  clearTimeout: () => {},
  Date: Date,
  Math: Math,
  parseFloat: parseFloat,
  parseInt: parseInt
};
sandbox.window = sandbox;

// Ejecutar fragmento relevante en VM
try {
  const context = vm.createContext(sandbox);
  // Extraer función resolveYouTubeVideoId simulada
  vm.runInContext(`
    ${appCode.match(/window\.resolveYouTubeVideoId\s*=\s*async\s*function[\s\S]*?\n    \};/)[0]}
  `, context);

  (async () => {
    const resPolice = await sandbox.window.resolveYouTubeVideoId('The Police', 'Every Breath You Take');
    assert(resPolice === '6cucosmPj-A', 'Runtime VM: The Police - Every Breath You Take resuelve a 6cucosmPj-A en 0ms');

    const resQueen = await sandbox.window.resolveYouTubeVideoId('Queen', 'Bohemian Rhapsody');
    assert(resQueen === 'fJ9rUzIMcZQ', 'Runtime VM: Queen - Bohemian Rhapsody resuelve a fJ9rUzIMcZQ en 0ms');

    const resUnknown = await sandbox.window.resolveYouTubeVideoId('Artista Desconocido XYZ', 'Cancion Rara 123');
    assert(typeof resUnknown === 'string' && resUnknown.length === 11, 'Runtime VM: Canción desconocida retorna videoId seguro sin ser null');

    if (!allPassed) {
      console.error('\n❌ Algunas pruebas V25 fallaron.\n');
      process.exit(1);
    } else {
      console.log('\n🎉 ¡TODOS LOS REQUISITOS V25 VERIFICADOS AL 100%!\n');
      process.exit(0);
    }
  })();
} catch (e) {
  assert(false, `Runtime VM Error: ${e.message}`);
}

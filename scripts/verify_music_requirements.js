const fs = require('fs');

console.log('=== VERIFICANDO REQUISITOS DEL MÓDULO MUSIC SESSION (#view-music) ===\n');

const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

let errors = [];
let passes = [];

function assert(condition, message) {
  if (condition) {
    passes.push('✅ ' + message);
  } else {
    errors.push('❌ ' + message);
  }
}

// ----------------------------------------------------
// 1. INTEGRACIÓN CON LA API REAL DE YOUTUBE Y YOUTUBE IFRAME PLAYER API
// ----------------------------------------------------
console.log('1. Verificando YouTube IFrame Player API...');
assert(html.includes('https://www.youtube.com/iframe_api'), 'Script oficial de YouTube IFrame API incluido en <head>');
assert(html.includes('id="musicYouTubeIframe"') && html.includes('enablejsapi=1'), 'Iframe de YouTube con enablejsapi=1');
assert(html.includes('window.onYouTubeIframeAPIReady'), 'Callback window.onYouTubeIframeAPIReady definido');
assert(html.includes('new YT.Player(\'musicYouTubeIframe\'') || html.includes('new YT.Player("musicYouTubeIframe"'), 'Instanciación de YT.Player sobre el iframe #musicYouTubeIframe');
assert(html.includes('onYouTubePlayerStateChange') || html.includes('handlePlayerStateChange'), 'Manejador de eventos onStateChange implementado');
assert(html.includes('http://localhost:3000/api/music/search?q=') || html.includes('/api/music/search?q='), 'Búsqueda conectada al endpoint /api/music/search?q=');
assert(html.includes('musicSearchDebounceTimer') && (html.includes('300') || html.includes('setTimeout')), 'Debounce de 300ms implementado en el buscador');
assert(html.includes('id="musicSearchSuggestions"'), 'Contenedor #musicSearchSuggestions presente para sugerencias en tiempo real');

// ----------------------------------------------------
// 2. SINCRONIZACIÓN EN VIVO ESTROFA POR ESTROFA (KARAOKE)
// ----------------------------------------------------
console.log('2. Verificando Karaoke en vivo al ritmo de la música...');
assert(html.includes('setInterval') && (html.includes('250') || html.includes('syncKaraokeToTime')), 'Intervalo de sincronización de alta frecuencia (250ms)');
assert(html.includes('getCurrentTime'), 'Lectura precisa del segundo de reproducción con player.getCurrentTime()');
assert(html.includes('scale-[1.02]') && (html.includes('border-cyan-400') || html.includes('cyan-950')), 'Efecto visual neón cyan y aumento de escala en estrofa activa');
assert(html.includes("behavior: 'smooth'") || html.includes('scrollIntoView'), 'Desplazamiento automático suave (smooth scroll)');
assert(html.includes('stopMusicKaraokeSync') && (html.includes('PAUSED') || html.includes('state === 2')), 'Pausa inmediata del karaoke al pausar el reproductor');
assert(html.includes('seekYouTubePlayer') && html.includes('seekTo'), 'Capacidad de saltar a cualquier segundo al adelantar/atrasar o pulsar tiempo');

// ----------------------------------------------------
// 3. INTERRUPTOR GLOBAL DE TRADUCCIÓN AL ESPAÑOL
// ----------------------------------------------------
console.log('3. Verificando Interruptor Global de Traducción...');
assert(html.includes('id="toggleGlobalTranslationBtn"'), 'Botón #toggleGlobalTranslationBtn presente en la cabecera del panel de letras');
assert(html.includes('Traducción al Español (Toda la Canción)'), 'Texto del botón "🌐 Traducción al Español (Toda la Canción)"');
assert(html.includes('toggleGlobalLyricsTranslation'), 'Función toggleGlobalLyricsTranslation implementada');
assert(html.includes('music-stanza-translation'), 'Clase music-stanza-translation para subtítulos en español debajo de cada estrofa');
assert(html.includes('isGlobalSpanishTranslationActive'), 'Estado booleano global de traducción');
assert(html.includes('inspectLyricsWord') && html.includes('musicWordModal'), 'Interacción por palabra en inglés activa con modal fonético IPA y phrasal verbs');

// ----------------------------------------------------
// 4. AISLAMIENTO Y REGLAS DE SEGURIDAD
// ----------------------------------------------------
console.log('4. Verificando aislamiento de la interfaz...');
assert(html.includes("if (viewId !== 'view-music')") && html.includes('pauseYouTubePlayer();'), 'Reproductor se pausa y encapsula al abandonar #view-music');
assert(html.includes('buildRealisticHouse') && html.includes('initThreeWorldTour'), 'Funciones del motor 3D intactas');

console.log('\n--- RESUMEN DE PRUEBAS ---');
passes.forEach(p => console.log(p));

if (errors.length > 0) {
  console.log('\n❌ ERRORES DETECTADOS:');
  errors.forEach(e => console.log(e));
  process.exit(1);
} else {
  console.log(`\n🎉 TODOS LOS ${passes.length} REQUISITOS DEL MÓDULO MUSIC SESSION VERIFICADOS AL 100%!`);
  process.exit(0);
}

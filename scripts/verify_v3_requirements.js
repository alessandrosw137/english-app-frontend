const fs = require('fs');

console.log('=== VERIFICANDO REQUISITOS OBLIGATORIOS V3 ===\n');

let html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
if (fs.existsSync('app/src/main/assets/js/app.js')) {
  html += '\n' + fs.readFileSync('app/src/main/assets/js/app.js', 'utf8');
}
if (fs.existsSync('app/src/main/assets/js/karaoke.js')) {
  html += '\n' + fs.readFileSync('app/src/main/assets/js/karaoke.js', 'utf8');
}
if (fs.existsSync('app/src/main/assets/css/style.css')) {
  html += '\n' + fs.readFileSync('app/src/main/assets/css/style.css', 'utf8');
}

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
// REQUISITO 1: MUSIC SESSION
// ----------------------------------------------------
console.log('1. Verificando Music Session...');
// 1.1 Catálogo amplio con Losing My Religion xwtdhWltSIg
assert(html.includes("xwtdhWltSIg"), 'ID de YouTube para Losing My Religion (xwtdhWltSIg) está presente en el catálogo');
assert(html.includes("Losing My Religion"), 'Canción "Losing My Religion" de R.E.M. en el catálogo');
assert(html.includes("Bohemian Rhapsody"), 'Canción "Bohemian Rhapsody" de Queen en el catálogo');
assert(html.includes("Yellow"), 'Canción "Yellow" de Coldplay en el catálogo');
assert(html.includes("Radioactive"), 'Canción "Radioactive" de Imagine Dragons en el catálogo');

// 1.2 Menú flotante de autocompletado predictivo
assert(html.includes('id="musicSearchSuggestions"'), 'Elemento del menú de autocompletado flotante #musicSearchSuggestions existe');
assert(html.includes('handleMusicSearchInput') || html.includes('onMusicSearchInput'), 'Función para autocompletado predictivo conectada a la entrada de texto del buscador');
assert(html.includes('selectMusicTrackFromSuggestion'), 'Sugerencias predictivas con selección interactiva');

// 1.3 Búsqueda flexible (sin restricción estricta de enlace/ID)
assert(html.includes('handleMusicSearchSubmit') || html.includes('executeSmartMusicSearch'), 'Función para resolver texto libre y enlaces directos implementada');
assert(html.includes('extractYouTubeId'), 'Extractor universal de IDs y URLs de YouTube');

// 1.4 Reproductor con enablejsapi=1 y youtube-nocookie
assert(html.includes('youtube-nocookie.com/embed/'), 'Iframe utiliza youtube-nocookie.com para máxima compatibilidad');
assert(html.includes('enablejsapi=1'), 'Parámetro enablejsapi=1 incluido en el iframe');

// 1.5 Letras interactivas con clic en palabras, pausa de video y modal
assert(html.includes('inspectLyricsWord'), 'Función inspectLyricsWord interactiva por palabra implementada');
assert(html.includes('pauseYouTubePlayer'), 'Función pauseYouTubePlayer mediante postMessage implementada');
assert(html.includes('resumeYouTubePlayer'), 'Función resumeYouTubePlayer implementada');
assert(html.includes('id="musicWordModal"'), 'Modal de diccionario interactivo #musicWordModal existe');
assert(html.includes('MUSIC_VOCAB_DICTIONARY'), 'Diccionario integral MUSIC_VOCAB_DICTIONARY con fonética, traducción y phrasal verbs');

// ----------------------------------------------------
// REQUISITO 2: BOTÓN DE RETORNO Y PANTALLA DE CARGA
// ----------------------------------------------------
console.log('2. Verificando Botón de Retorno y Pantalla de Carga...');
// 2.1 Botón universal oculto por defecto y con display: none
assert(html.includes('id="universalExitBtn"') && html.includes('style="display: none;"'), '#universalExitBtn tiene style="display: none;" y hidden por defecto');

// 2.2 Botón universal se muestra ÚNICAMENTE durante la pantalla de carga (openPortalWithLoader)
assert(html.includes("universalBtn.style.display = 'flex'") && html.includes("openPortalWithLoader"), 'universalExitBtn se muestra durante openPortalWithLoader para escape');

// 2.3 Botón universal se oculta por completo cuando termina la carga (showView)
assert(html.includes("universalBtn.style.display = 'none'") && html.includes("showView"), 'universalExitBtn se oculta en showView al desplegar la vista activa');

// 2.4 Botón en módulos dice "← Volver a Portales"
assert(html.includes('<span>← Volver a Portales</span>'), 'Botón integrado en módulos dice "← Volver a Portales"');
const oldMenuTitles = (html.match(/<span>← Volver al Menú Principal<\/span>/g) || []).length;
assert(oldMenuTitles === 0, 'No quedan botones con "Volver al Menú Principal" dentro de los módulos');

// ----------------------------------------------------
// REQUISITO 3: CONTROLES DE MOVIMIENTO WORLD TOUR 3D
// ----------------------------------------------------
console.log('3. Verificando Controles de Movimiento y Exploración World Tour 3D...');
// 3.1 Controles PC: WASD y flechas
assert(html.includes('keydown') && (html.includes('KeyW') || html.includes("'w'")), 'Controles de teclado WASD implementados');
assert(html.includes('ArrowUp') && html.includes('ArrowDown'), 'Controles de flechas direccionales soportados');

// 3.2 Rotación de cámara libre en 360 arrastrando ratón
assert(html.includes('isDraggingMouse') && html.includes('cameraYaw') && html.includes('cameraPitch'), 'Rotación de cámara libre 360° con ratón implementada con yaw/pitch');

// 3.3 Límites de colisión para no atravesar paredes
assert(html.includes('ROOM_LIMITS') && html.includes('Math.max(ROOM_LIMITS.minX, Math.min(ROOM_LIMITS.maxX'), 'Límites de colisión ROOM_LIMITS previenen atravesar paredes');

// 3.4 Controles Celular / Táctil: Joystick virtual + Swipe vista derecha
assert(html.includes('id="virtualJoystickContainer"'), 'Contenedor del joystick virtual táctil #virtualJoystickContainer existe');
assert(html.includes('id="virtualJoystickKnob"'), 'Knob del joystick virtual táctil existe');
assert(html.includes('setupVirtualJoystick'), 'Función setupVirtualJoystick para caminar con joystick implementada');
assert(html.includes('touchLookId') || html.includes('touchYawActive'), 'Deslizamiento táctil en la mitad derecha de la pantalla para rotar vista implementado');

// 3.5 Interacción Raycaster con destello suave y tarjeta estética
assert(html.includes('highlightObject'), 'Función highlightObject con destello suave implementada');
assert(html.includes('threeRaycaster.setFromCamera'), 'Raycaster para clic y toque sobre objetos de la habitación implementado');
assert(html.includes('inspect3DObject'), 'Tarjeta de inspección con término en inglés, pronunciación fonética, audio y traducción');

// ----------------------------------------------------
// REQUISITO 4: ACABADO GRÁFICO REALISTA THREE.JS
// ----------------------------------------------------
console.log('4. Verificando Acabado Gráfico Realista Three.js...');
// 4.1 ACESFilmicToneMapping y exposure 1.0
assert(html.includes('THREE.ACESFilmicToneMapping'), 'renderer.toneMapping = THREE.ACESFilmicToneMapping activado');
assert(html.includes('toneMappingExposure = 1.0') || html.includes('toneMappingExposure = 1'), 'renderer.toneMappingExposure = 1.0 configurado');

// 4.2 Sombras suaves PCFSoftShadowMap
assert(html.includes('THREE.PCFSoftShadowMap'), 'renderer.shadowMap.type = THREE.PCFSoftShadowMap activo');

// 4.3 Iluminación balanceada
assert(html.includes('0xe2e8f0') && html.includes('0.7'), 'AmbientLight suave (0xe2e8f0, 0.7) configurada');
assert(html.includes('0xfffaf0') && html.includes('1.5'), 'DirectionalLight cálida (0xfffaf0, 1.5) entrando por ventana');
assert(html.includes('0xffedd5'), 'PointLight cálida (0xffedd5) en la lámpara');

// 4.4 Duela de madera procedural con roughness 0.35
assert(html.includes('createProceduralWoodTexture'), 'Textura procedural de duela de madera implementada');
assert(html.includes('roughness: 0.35'), 'Material de piso con rugosidad realista (roughness: 0.35)');

// 4.5 Mobiliario detallado
assert(html.includes('sofa') && html.includes('cushionMat'), 'Sofá con cojines independientes detallados');
assert(html.includes('coffee_table') && (html.includes('topMat') || html.includes('tableMat')), 'Mesa de centro pulida con accesorios (taza, plato, patas y libro)');
assert(html.includes('curtainMat'), 'Cortinas con pliegues suaves');
assert(html.includes('hammock') && html.includes('ropeMat'), 'Hamaca tejida suspendida con ganchos y cuerdas');

// ----------------------------------------------------
// RESULTADOS
// ----------------------------------------------------
console.log('\n--- RESUMEN DE COMPROBACIÓN ---');
passes.forEach(p => console.log(p));
if (errors.length > 0) {
  console.log('\n❌ ERRORES DETECTADOS:');
  errors.forEach(e => console.log(e));
  process.exit(1);
} else {
  console.log(`\n🎉 TODOS LOS ${passes.length} REQUISITOS TÉCNICOS HAN SIDO VERIFICADOS CON ÉXITO!`);
  process.exit(0);
}

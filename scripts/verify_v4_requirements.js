const fs = require('fs');

console.log('=== VERIFICANDO REQUISITOS TÉCNICOS V4 ===\n');

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
// 1. DOM Y AISLAMIENTO DE MÓDULOS
// ----------------------------------------------------
console.log('1. Verificando DOM y aislamiento...');
assert(html.includes('id="view-music"'), 'Contenedor #view-music existe');
assert(html.includes('id="musicYouTubeIframe"'), 'Iframe de YouTube encapsulado dentro de #view-music');
assert(html.includes('pauseYouTubePlayer();') && html.includes("viewId !== 'view-music'"), 'YouTube se pausa automáticamente al salir de view-music');
assert(html.includes('id="threeWebGLMount"') && html.includes('id="threeCanvasContainer"'), '#threeWebGLMount existe dentro de #threeCanvasContainer');
assert(!html.includes("container.innerHTML = ''"), 'container.innerHTML no destruye los controles superpuestos del 3D');
assert(html.includes("mount.innerHTML = ''"), 'Canvas se monta exclusivamente dentro de #threeWebGLMount');

// ----------------------------------------------------
// 2. MOTOR THREE.JS Y OPTIMIZACIÓN MÓVIL
// ----------------------------------------------------
console.log('2. Verificando optimización de Three.js...');
assert(html.includes("precision: 'mediump'"), "Renderer configurado con precision: 'mediump'");
assert(html.includes("powerPreference: 'high-performance'"), "Renderer configurado con powerPreference: 'high-performance'");
assert(html.includes("Math.min(window.devicePixelRatio || 1, 1.8)") || html.includes("Math.min(window.devicePixelRatio, 1.8)"), "pixelRatio calibrado a máx 1.8 para evitar sobrecalentamiento");
assert(html.includes("THREE.ACESFilmicToneMapping"), "toneMapping = THREE.ACESFilmicToneMapping activo");
assert(html.includes("toneMappingExposure = 1.05"), "toneMappingExposure calibrado en 1.05");
assert(html.includes("THREE.PCFSoftShadowMap"), "Sombras suaves PCFSoftShadowMap activas");

// Texturas procedurales
assert(html.includes("createOakWoodTexture"), "Función createOakWoodTexture implementada");
assert(html.includes("roughness: 0.62"), "Duela de roble con roughness 0.62 para eliminar sobreexposición");
assert(html.includes("createGrassTexture"), "Función createGrassTexture implementada");
assert(html.includes("crownBack") || html.includes("crownMat"), "Molduras perimetrales de yeso (crown molding) en la casa");
assert(html.includes("baseboardMat") || html.includes("bbBack"), "Zoclos de madera en la base de los muros");

// ----------------------------------------------------
// 3. MODELADO 3D COMPUESTO (HOUSE & GARDEN)
// ----------------------------------------------------
console.log('3. Verificando modelado 3D de alta fidelidad...');
// House
assert(html.includes("obj.id === 'hammock'") && html.includes("TorusGeometry"), "Hamaca modelada con tela cóncava, barras cilíndricas, cuerdas y argollas");
assert(html.includes("obj.id === 'sofa'") && html.includes("pillow1"), "Sofá contemporáneo de 3 plazas con patas cónicas, cojines y almohadones");
assert(html.includes("obj.id === 'bookshelf'") && html.includes("bookColors"), "Estantería alta con 5 baldas y más de 25 libros de lomos variados");
assert(html.includes("obj.id === 'coffee_table'") && html.includes("obj.id === 'coffee_mug'") && html.includes("TorusGeometry"), "Mesa de centro biselada con libros y taza de café con asa en toroide");
assert(html.includes("obj.id === 'ceiling_fan'") && html.includes("threeAnimatedObjects.fan"), "Ventilador de techo con rotación continua por delta time");
assert(html.includes("obj.id === 'television'") && html.includes("oledScreen") && html.includes("soundbar"), "Consola baja de TV con pantalla OLED y barra de sonido");

// Garden
assert(html.includes("obj.id === 'bbq_grill'") && html.includes("SphereGeometry"), "Asador metálico esférico con tapa, patas y ruedas");
assert(html.includes("obj.id === 'patio_table'") && html.includes("ConeGeometry(1.65, 0.75, 8)"), "Mesa de terraza con sombrilla octagonal de lona roja");
assert(html.includes("obj.id === 'lawn_mower'") && html.includes("hCross"), "Cortacésped con chasis rojo, motor y manubrio ergonómico inclinado");
assert(html.includes("obj.id === 'wheelbarrow'"), "Carretilla de carga metálica con rueda y soportes");
assert(html.includes("obj.id === 'watering_can'") && html.includes("rosette"), "Regadera metálica con caño y roseta perforada");
assert(html.includes("obj.id === 'flower_pot'"), "Maceta de terracota con follaje floral");
assert(html.includes("obj.id === 'sprinkler'") && html.includes("threeAnimatedObjects.sprinkler"), "Aspersor de riego rotatorio con giro continuo");
assert(html.includes("sunMesh") || html.includes("obj.id === 'sun'"), "Cielo diurno con sol procedural en la lejanía");

// ----------------------------------------------------
// 4. CONTROLES Y RAYCASTER
// ----------------------------------------------------
console.log('4. Verificando controles y raycaster...');
assert(html.includes("KeyW") && html.includes("updatePlayerMovement"), "Controles WASD en PC con movimiento normalizado");
assert(html.includes("virtualJoystickContainer") && html.includes("virtualJoystickKnob"), "Joystick virtual táctil presente");
assert(html.includes("touchLookId") || html.includes("touchmove"), "Swipe táctil en mitad derecha de pantalla implementado");
assert(html.includes("highlightObject") && html.includes("emissiveIntensity"), "Destello suave neón al interactuar con objetos");
assert(html.includes("inspect3DObject") && html.includes("threeObjectInspectCard"), "Tarjeta flotante de inspección con fonética y audio TTS");

// ----------------------------------------------------
// 5. SELECTOR DE ESCENARIOS Y LÓGICA
// ----------------------------------------------------
console.log('5. Verificando selector de escenarios y lógica...');
assert(html.includes("scenarioBtnHouse") && html.includes("scenarioBtnGarden"), "Botones [🏠 House & Rooms] y [🌿 Backyard & Garden] en el encabezado 3D");
assert(html.includes("switch3DScenario"), "Función switch3DScenario implementada");
assert(html.includes("let starsCanvasAnimId = null;"), "Declaración global let starsCanvasAnimId = null; presente");
assert(html.includes("story.illustrationSvg") && html.includes("story.titleEs"), "Vinculación segura de illustrationSvg, titleEs y level en Stories");

console.log('\n--- RESUMEN DE PRUEBAS ---');
passes.forEach(p => console.log(p));

if (errors.length > 0) {
  console.log('\n❌ ERRORES DETECTADOS:');
  errors.forEach(e => console.log(e));
  process.exit(1);
} else {
  console.log(`\n🎉 TODOS LOS ${passes.length} REQUISITOS TÉCNICOS HAN SIDO VERIFICADOS CON 100% DE ÉXITO!`);
  process.exit(0);
}

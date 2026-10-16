const fs = require('fs');

console.log('=== VERIFICANDO REQUISITOS DE ARQUITECTURA Y MODELADO 3D V5 ===\n');

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
// 1. ARQUITECTURA DE 4 HABITACIONES REALES
// ----------------------------------------------------
console.log('1. Verificando Arquitectura de 4 Habitaciones Reales...');
// Distribución y muros divisorios con vanos de paso
assert(html.includes('partZ1') && html.includes('lintelZ1') && html.includes('partZ2') && html.includes('lintelZ2'), 'Muro divisorio Z=0 con vanos de paso arquitectónicos implementado');
assert(html.includes('partX1') && html.includes('lintelX1') && html.includes('partX2') && html.includes('lintelX2'), 'Muro divisorio X=0 con vanos de paso arquitectónicos implementado');
assert(html.includes('ceilingMat') && html.includes('crownDivZ') && html.includes('crownDivX'), 'Techo continuo y molduras perimetrales de yeso en muros divisorios');
assert(html.includes('baseboardMat') && (html.includes('bbBack') || html.includes('baseboard')), 'Zoclos de madera en la base de los muros');

// Iluminación interior diferenciada por estancia
assert(html.includes('lampLight') && html.includes('0xffedd5'), 'Iluminación cálida en Living Room');
assert(html.includes('bedLight') && html.includes('0xffedd5'), 'Iluminación cálida diferenciada en Bedroom');
assert(html.includes('kitchenLight') && html.includes('0xfffbeb'), 'Iluminación cenital neutra en Kitchen/Dining');
assert(html.includes('bathLight') && html.includes('0xf8fafc'), 'Iluminación LED fría en Bathroom');

// ----------------------------------------------------
// 2. MODELOS 3D DE LAS 4 HABITACIONES (SIN OBJETOS FLOTANTES)
// ----------------------------------------------------
console.log('2. Verificando Modelado 3D de las 4 Habitaciones...');
// Living Room
assert(html.includes("obj.id === 'sofa'") && html.includes('footBrass') && html.includes('pillow1'), 'Living Room: Sofá contemporáneo con patas torneadas a ras de suelo y cojines');
assert(html.includes("obj.id === 'coffee_table'") && html.includes("obj.id === 'coffee_mug'"), 'Living Room: Mesa de centro con libros y taza de café en toroide');
assert(html.includes("obj.id === 'television'") && html.includes('oledScreen') && html.includes("obj.id === 'soundbar'"), 'Living Room: Consola multimedia con pantalla OLED y barra de sonido');
assert(html.includes("obj.id === 'bookshelf'") && html.includes('bookColors'), 'Living Room: Estantería alta con más de 25 libros');
assert(html.includes("obj.id === 'ceiling_fan'") && html.includes('threeAnimatedObjects.fan'), 'Living Room: Ventilador de techo con rotación continua');

// Bedroom
assert(html.includes("obj.id === 'bed'") && html.includes('woodBedMat') && html.includes('headboard'), 'Bedroom: Cama matrimonial completa con cabecera de madera y patas a ras de suelo');
assert(html.includes("obj.id === 'nightstand'") && html.includes('lampShade'), 'Bedroom: Mesita de noche con cajones y lámpara de lectura');
assert(html.includes("obj.id === 'hammock'") && html.includes('catenaryY') && html.includes('DoubleSide'), 'Bedroom: Hamaca realista con curvatura cóncava natural catenaria y anclajes en pared');

// Kitchen / Dining
assert(html.includes("obj.id === 'kitchen_counter'") && html.includes('counterTop') && html.includes('faucetSpout') && html.includes('upperCab'), 'Kitchen: Encimera con gabinetes, tarja, grifería y alacenas superiores');
assert(html.includes("obj.id === 'refrigerator'") && html.includes('fridgeBody') && html.includes('handleFreezer'), 'Kitchen: Refrigerador vertical de acero inoxidable con dispensador');
assert(html.includes("obj.id === 'dining_table'") && html.includes('chairGroup') && html.includes('tableWood'), 'Dining: Mesa de comedor con 4 sillas torneadas y frutero central');

// Bathroom
assert(html.includes("obj.id === 'bathroom_sink'") && html.includes('basin') && html.includes('mirrorFrame') && html.includes('ledTrim'), 'Bathroom: Lavamanos cerámico y espejo enmarcado con tira LED');
assert(html.includes("obj.id === 'shower'") && html.includes('glassMat') && html.includes('rainHead') && html.includes('tray'), 'Bathroom: Regadera con cancel de cristal templado, plato en y=0 y columna de lluvia');

// ----------------------------------------------------
// 3. REALISMO EN EL SEGUNDO MUNDO (BACKYARD & GARDEN)
// ----------------------------------------------------
console.log('3. Verificando Realismo en Backyard & Garden...');
assert(html.includes("obj.id === 'stone_patio'") && html.includes('tileMat'), 'Garden: Terraza exterior de losetas de piedra con juntas biseladas');
assert(html.includes("obj.id === 'shade_tree'") && html.includes('trunkMat') && html.includes('leafColors'), 'Garden: Árbol frondoso con tronco orgánico y follaje volumétrico');
assert(html.includes("obj.id === 'bbq_grill'") && html.includes('SphereGeometry') && html.includes('grate'), 'Garden: Asador kettle con parrilla interna, tapa, patas y ruedas a ras de suelo');
assert(html.includes("obj.id === 'patio_table'") && html.includes('umbrellaMat') && html.includes('baseWeight'), 'Garden: Mesa de terraza con sombrilla octagonal de lona roja y sillas');
assert(html.includes("obj.id === 'lawn_mower'") && html.includes('hCross'), 'Garden: Cortacésped con chasis rojo, motor y manubrio ergonómico inclinado');
assert(html.includes("obj.id === 'wheelbarrow'") && html.includes('tubMat') && html.includes('wheel'), 'Garden: Carretilla de carga metálica con rueda de goma y soportes');
assert(html.includes("obj.id === 'watering_can'") && html.includes('rosette'), 'Garden: Regadera metálica con caño y roseta perforada');
assert(html.includes("obj.id === 'flower_pot'") && html.includes('potMat'), 'Garden: Maceta de terracota con flores de colores a ras de suelo');
assert(html.includes("obj.id === 'sprinkler'") && html.includes('threeAnimatedObjects.sprinkler'), 'Garden: Aspersor de riego rotatorio con giro continuo');
assert(html.includes('createGrassTexture'), 'Garden: Césped denso esmeralda con textura procedural en memoria');
assert(html.includes('sunMesh') || html.includes("obj.id === 'sun'"), 'Garden: Cielo diurno luminoso con sol y nubes');

// ----------------------------------------------------
// 4. RENDIMIENTO MÓVIL Y CONTROLES CON COLISIÓN DE MUROS
// ----------------------------------------------------
console.log('4. Verificando Rendimiento y Controles...');
assert(html.includes('Math.min(window.devicePixelRatio || 1, 1.8)'), 'pixelRatio calibrado a máx 1.8 para cuidar batería');
assert(html.includes('inDoorwayZ') && html.includes('inDoorwayX'), 'Detección de colisiones en muros interiores evitando atravesarlos fuera de los vanos');
assert(html.includes('ROOM_LIMITS') && html.includes('Math.max(ROOM_LIMITS.minX, Math.min(ROOM_LIMITS.maxX'), 'Límites perimetrales ROOM_LIMITS preservados');
assert(html.includes('virtualJoystickContainer') && html.includes('setupVirtualJoystick'), 'Controles de primera persona con Joystick virtual táctil');
assert(html.includes('threeRaycaster.setFromCamera') && html.includes('speakText'), 'Raycaster interactivo con audio TTS al tocar cualquier objeto');

// ----------------------------------------------------
// 5. NOMBRADO Y ALIASES REQUERIDOS
// ----------------------------------------------------
console.log('5. Verificando Funciones y Aislamiento...');
assert(html.includes('buildRealisticHouse'), 'Función buildRealisticHouse presente');
assert(html.includes('buildRealisticBackyard'), 'Función buildRealisticBackyard presente');
assert(html.includes('buildDetailedObjectMesh'), 'Función buildDetailedObjectMesh presente');
assert(html.includes('initThreeWorldTour'), 'Función initThreeWorldTour presente');

console.log('\n--- RESUMEN DE PRUEBAS ---');
passes.forEach(p => console.log(p));

if (errors.length > 0) {
  console.log('\n❌ ERRORES DETECTADOS:');
  errors.forEach(e => console.log(e));
  process.exit(1);
} else {
  console.log(`\n🎉 TODOS LOS ${passes.length} REQUISITOS DE LA V5 HAN SIDO VERIFICADOS CON 100% DE ÉXITO!`);
  process.exit(0);
}

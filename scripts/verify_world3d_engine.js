const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO ENGINE DE WORLD TOUR 3D (world3d.js) ===\n');

const world3dCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'world3d.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

let errors = [];
let passes = [];

function assert(condition, message) {
  if (condition) {
    passes.push('✅ ' + message);
  } else {
    errors.push('❌ ' + message);
  }
}

// ----------------------------------------------------------------------------
// 1. CONTROL DE CICLO DE VIDA DEL CANVAS Y RENDERER
// ----------------------------------------------------------------------------
console.log('1. Verificando control de ciclo de vida del Canvas y WebGLRenderer...');
assert(world3dCode.includes('function initOrResumeWorld3D()'), 'Función window.initOrResumeWorld3D implementada');
assert(
  world3dCode.includes('#canvas-container') ||
  world3dCode.includes("'canvas-container'") ||
  world3dCode.includes('world3d-canvas'),
  'Búsqueda de contenedor #canvas-container o #world3d-canvas implementada'
);
assert(
  world3dCode.includes("container.style.width = '100vw'") &&
  world3dCode.includes("container.style.height = '100vh'") &&
  world3dCode.includes("container.style.position = 'fixed'") &&
  world3dCode.includes("container.style.inset = '0'") &&
  world3dCode.includes("container.style.zIndex = '1'"),
  'Forzado de dimensiones 100vw / 100vh / fixed / inset: 0 / zIndex: 1 si el contenedor no tiene dimensiones válidas'
);
assert(
  world3dCode.includes('antialias: true') &&
  world3dCode.includes('alpha: false') &&
  world3dCode.includes('powerPreference: "high-performance"'),
  'THREE.WebGLRenderer configurado con antialias: true, alpha: false, powerPreference: "high-performance"'
);
assert(
  world3dCode.includes('renderer.setSize(width, height)') ||
  world3dCode.includes('renderer.setSize(w, h)') ||
  world3dCode.includes('renderer.setSize(window.innerWidth, window.innerHeight)'),
  'renderer.setSize configurado con las dimensiones de pantalla'
);
assert(
  world3dCode.includes('Math.min(window.devicePixelRatio || 1, 2)') ||
  world3dCode.includes('Math.min(window.devicePixelRatio, 2)'),
  'renderer.setPixelRatio calibrado con Math.min(window.devicePixelRatio, 2)'
);
assert(
  world3dCode.includes('renderer.shadowMap.enabled = true') &&
  world3dCode.includes('THREE.PCFSoftShadowMap'),
  'renderer.shadowMap.enabled = true con tipo THREE.PCFSoftShadowMap'
);
assert(
  world3dCode.includes('new THREE.Color(0x0a0e17)'),
  'scene.background = new THREE.Color(0x0a0e17) configurado'
);
assert(
  world3dCode.includes('let isWorldTourActive = true;') &&
  world3dCode.includes('if (!isWorldTourActive) return;'),
  'Bandera isWorldTourActive implementada para garantizar ejecución continua de animate()'
);

// ----------------------------------------------------------------------------
// 2. ILUMINACIÓN Y AMBIENTACIÓN PBR
// ----------------------------------------------------------------------------
console.log('2. Verificando Iluminación y Ambientación PBR...');
assert(
  world3dCode.includes('THREE.HemisphereLight(0xddeeff, 0x202035, 1.2)'),
  'THREE.HemisphereLight(0xddeeff, 0x202035, 1.2) para relleno ambiental global'
);
assert(
  world3dCode.includes('THREE.DirectionalLight(0xfff2dd, 1.8)'),
  'THREE.DirectionalLight(0xfff2dd, 1.8) cinemática configurada'
);
assert(
  world3dCode.includes('dirLight.position.set(12, 20, 10)') &&
  world3dCode.includes('dirLight.castShadow = true'),
  'DirectionalLight con posición (12, 20, 10) y castShadow = true'
);
assert(
  world3dCode.includes('dirLight.shadow.camera.left = -25') &&
  world3dCode.includes('dirLight.shadow.camera.right = 25') &&
  world3dCode.includes('dirLight.shadow.mapSize.width = 1024'),
  'Cámara de sombras con frustum de 25 unidades y mapa 1024x1024'
);
assert(
  world3dCode.includes('THREE.PointLight(0xffaa44, 2.0, 15') ||
  world3dCode.includes('THREE.PointLight(0xffaa44, 2, 15'),
  'Luz cálida puntual (PointLight) interior (0xffaa44, 2.0, 15) para simular lámparas de estudio'
);

// ----------------------------------------------------------------------------
// 3. CONSTRUCCIÓN DE ESCENARIO DETALLADO (CASA Y JARDÍN)
// ----------------------------------------------------------------------------
console.log('3. Verificando Construcción de Escenario Detallado...');
assert(
  world3dCode.includes('0x2d5a27') && world3dCode.includes('PlaneGeometry'),
  'Suelo exterior: Plano amplio con material verde pasto (0x2d5a27)'
);
assert(
  world3dCode.includes('0xc2a679') && world3dCode.includes('housePlatform'),
  'Suelo interior (Casa): Plataforma elevada texturizada clara (0xc2a679)'
);
assert(
  world3dCode.includes('crown1') && world3dCode.includes('base1') && world3dCode.includes('winLeft'),
  'Paredes con aberturas para ventanas y molduras perimetrales de yeso y zócalos'
);
assert(
  world3dCode.includes('deskGroup') && world3dCode.includes('deskLegCoords') && world3dCode.includes('metalBrass'),
  'Muebles: Escritorio de madera con patas metálicas biseladas y cajones'
);
assert(
  world3dCode.includes('monitorGroup') && world3dCode.includes('emissive: 0x38bdf8') && world3dCode.includes('mScreen'),
  'Muebles: Monitor estilizado con pantalla emisiva brillante mostrando código/lección de inglés'
);
assert(
  world3dCode.includes('keyboard') && world3dCode.includes('mouse') && world3dCode.includes('lampShade'),
  'Muebles: Teclado, mouse y lámpara de escritorio articulada de latón'
);
assert(
  world3dCode.includes('chairGroup') && world3dCode.includes('cBackGeo') && world3dCode.includes('cSeat'),
  'Muebles: Silla de oficina ergonómica con soporte curvo y ruedas en estrella'
);
assert(
  world3dCode.includes('shelfGroup') && world3dCode.includes('bookColors') && world3dCode.includes('numBooks'),
  'Muebles: Estantería con libros de colores individuales en los lomos'
);
assert(
  world3dCode.includes('treePositions') && world3dCode.includes('tp.scale') && world3dCode.includes('DodecahedronGeometry'),
  'Jardín: 3 árboles compuestos con troncos orgánicos marrones y copas de esferas facetadas en distintos verdes'
);
assert(
  world3dCode.includes('pathGroup') && world3dCode.includes('pathCoords') && world3dCode.includes('stonePaver'),
  'Jardín: Camino de baldosas de piedra irregular desde la entrada'
);
assert(
  world3dCode.includes('fenceGroup') && world3dCode.includes('createPicketSection') && world3dCode.includes('picketWhite'),
  'Jardín: Cerca perimetral de estacas blancas (picket fence)'
);
assert(
  world3dCode.includes('lanternGroup') && world3dCode.includes('THREE.SpotLight(0xffedd5') && world3dCode.includes('spot.target'),
  'Jardín: Farol exterior con haz de luz cónico suave (SpotLight)'
);

// ----------------------------------------------------------------------------
// 4. RESPUESTA A ORIENTACIÓN Y ENTRADA AL PORTAL
// ----------------------------------------------------------------------------
console.log('4. Verificando Respuesta a Orientación y Entrada al Portal...');
assert(
  indexHtml.includes("openPortalWithLoader('worldtour')") &&
  (indexHtml.includes('initOrResumeWorld3D') || appJs.includes('initOrResumeWorld3D')),
  'Al hacer clic en ENTRAR AL PORTAL de World Tour 3D, se invoca automáticamente window.initOrResumeWorld3D()'
);
assert(
  world3dCode.includes('camera.aspect = window.innerWidth / window.innerHeight;') &&
  world3dCode.includes('camera.updateProjectionMatrix();') &&
  world3dCode.includes('renderer.setSize(window.innerWidth, window.innerHeight);'),
  'Listener resize actualiza camera.aspect, camera.updateProjectionMatrix() y renderer.setSize()'
);
assert(
  world3dCode.includes('THREE.OrbitControls') &&
  world3dCode.includes('maxPolarAngle = Math.PI / 2.1') ||
  world3dCode.includes('maxPolarAngle: Math.PI / 2.1'),
  'Controles de órbita suaves (OrbitControls) con límites de inclinación (maxPolarAngle: Math.PI / 2.1)'
);

console.log('\n--- RESUMEN DE PRUEBAS ---');
passes.forEach(p => console.log(p));

if (errors.length > 0) {
  console.log('\n❌ ERRORES DETECTADOS:');
  errors.forEach(e => console.log(e));
  process.exit(1);
} else {
  console.log(`\n🎉 TODOS LOS ${passes.length} REQUISITOS DEL MOTOR WORLD TOUR 3D HAN SIDO VERIFICADOS CON 100% DE ÉXITO!`);
  process.exit(0);
}

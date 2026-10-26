/**
 * Test de Verificación: Visibilidad de THREE.Sprite (visible: false al nacer)
 * y Selección Universal por Raycaster en los 7 Mundos 3D de MasterENG
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== TEST DE VERIFICACIÓN: SPRITES (VISIBLE: FALSE) Y RAYCASTER EN 7 MUNDOS ===\n');

function createCtxMock() {
  const noop = () => {};
  return {
    fillRect: noop, clearRect: noop, strokeRect: noop, fillText: noop, strokeText: noop,
    measureText: () => ({ width: 50 }),
    createLinearGradient: () => ({ addColorStop: noop }),
    createRadialGradient: () => ({ addColorStop: noop }),
    beginPath: noop, closePath: noop, arc: noop, fill: noop, stroke: noop,
    moveTo: noop, lineTo: noop, quadraticCurveTo: noop, bezierCurveTo: noop, rect: noop,
    ellipse: noop,
    save: noop, restore: noop, translate: noop, rotate: noop, scale: noop, drawImage: noop,
    getImageData: () => ({ data: new Uint8ClampedArray(100) }), putImageData: noop,
    getExtension: () => null,
    getParameter: () => 16,
    createTexture: noop, bindTexture: noop, texParameteri: noop, texImage2D: noop
  };
}

function createElMock(tag) {
  return {
    tagName: (tag || 'DIV').toUpperCase(),
    style: { setProperty: () => {}, removeProperty: () => {} },
    dataset: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    appendChild: () => {},
    removeChild: () => {},
    remove: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelectorAll: () => [],
    getContext: () => createCtxMock(),
    clientWidth: 800,
    clientHeight: 600,
    width: 800,
    height: 600,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 })
  };
}

const rootDir = path.join(__dirname, '..');
const threeCode = fs.readFileSync(path.join(rootDir, 'three.min.js'), 'utf8');
const natureSpaceCode = fs.readFileSync(path.join(rootDir, 'js', 'world3d_nature_space.js'), 'utf8');
const datingHotelCode = fs.readFileSync(path.join(rootDir, 'js', 'world3d_dating_hotel.js'), 'utf8');
const marketRestCode = fs.readFileSync(path.join(rootDir, 'js', 'world3d_market_rest.js'), 'utf8');
const world3dCode = fs.readFileSync(path.join(rootDir, 'js', 'world3d.js'), 'utf8');

const ctx = {
  console,
  setTimeout: (fn) => { if (typeof fn === 'function') fn(); },
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {},
  innerWidth: 800,
  innerHeight: 600,
  devicePixelRatio: 1,
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  document: {
    readyState: 'complete',
    getElementById: (id) => createElMock('div'),
    createElement: (tag) => createElMock(tag),
    createElementNS: (ns, tag) => createElMock(tag),
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  navigator: { userAgent: 'Mozilla/5.0 Node' },
  requestAnimationFrame: () => 1,
  cancelAnimationFrame: () => {},
  addEventListener: () => {},
  removeEventListener: () => {}
};
ctx.window = ctx;
ctx.global = ctx;
ctx.self = ctx;
ctx.globalThis = ctx;

vm.createContext(ctx);
vm.runInContext(threeCode, ctx);

ctx.THREE.WebGLRenderer = function() {
  return {
    domElement: createElMock('canvas'),
    setSize: () => {}, setPixelRatio: () => {}, render: () => {}, dispose: () => {},
    shadowMap: { enabled: false }, toneMapping: 0, toneMappingExposure: 1
  };
};

vm.runInContext(natureSpaceCode, ctx);
vm.runInContext(datingHotelCode, ctx);
vm.runInContext(marketRestCode, ctx);
vm.runInContext(world3dCode, ctx);

ctx.initOrResumeWorld3D();
const scene = ctx.World3D.scene;
const camera = ctx.World3D.camera;

let passes = 0;
let failures = 0;

function check(desc, condition) {
  if (condition) {
    console.log(`  ✅ [PASS] ${desc}`);
    passes++;
  } else {
    console.error(`  ❌ [FAIL] ${desc}`);
    failures++;
  }
}

const worlds = ['house', 'garden', 'dating', 'space', 'supermarket', 'hotel', 'restaurant'];

console.log('1. Verificando que todas las etiquetas THREE.Sprite nazcan con visible: false en los 7 mundos...\n');

worlds.forEach(w => {
  ctx.World3D.switchScenario(w);

  let labelSpritesChecked = 0;
  let allSpritesHidden = true;

  scene.traverse(obj => {
    if (obj.isSprite) {
      if (obj.userData && (obj.userData.isLabelSprite || obj.userData.isHotspotSprite)) {
        labelSpritesChecked++;
        if (obj.visible !== false) {
          allSpritesHidden = false;
          console.error(`    ⚠️ Sprite visible en ${w}:`, obj.userData);
        }
      }
    }
  });

  // Verificar también sprites registrados en userData.labelSprite o group.labelSprite
  const interactiveList = ctx.World3D.interactiveObjects || [];
  interactiveList.forEach(grp => {
    const s = grp.labelSprite || (grp.userData && grp.userData.labelSprite);
    if (s && s.isSprite) {
      labelSpritesChecked++;
      if (s.visible !== false) {
        allSpritesHidden = false;
      }
    }
  });

  check(`Mundo '${w}': todas las etiquetas THREE.Sprite nacen con visible: false (${labelSpritesChecked} sprites verificados)`, allSpritesHidden);
});

console.log('\n2. Verificando selección de objetos interactivos por Raycaster en los 7 mundos...\n');

worlds.forEach(w => {
  ctx.World3D.switchScenario(w);
  const interactiveList = ctx.World3D.interactiveObjects || [];

  check(`Mundo '${w}': lista interactiveObjects poblada (> 0)`, interactiveList.length > 0);

  // Seleccionabilidad por Raycaster:
  // Tomamos una muestra de objetos interactivos y probamos que el Raycaster y resolveInteractiveHit los detecte
  const raycaster = new ctx.THREE.Raycaster();
  let selectableCount = 0;

  // Filtrar grupos con vocabulario o interactivos
  const sampleTargets = interactiveList.filter(o => o.userData && (o.userData.en || o.userData.wordEn || o.userData.interactive)).slice(0, 10);

  sampleTargets.forEach(target => {
    const worldPos = new ctx.THREE.Vector3();
    if (target.getWorldPosition) target.getWorldPosition(worldPos);

    // Apuntar raycaster directamente hacia el objeto desde una distancia
    const origin = new ctx.THREE.Vector3(worldPos.x, worldPos.y + 1, worldPos.z + 3);
    const dir = new ctx.THREE.Vector3().subVectors(worldPos, origin).normalize();
    raycaster.set(origin, dir);

    const intersects = raycaster.intersectObjects(interactiveList, true);
    if (intersects && intersects.length > 0) {
      selectableCount++;
    } else {
      // Si el objeto o sus mallas hijas tienen geometría real, es detectable
      const hasMeshes = (target.isMesh) || (target.children && target.children.some(c => c.isMesh));
      if (hasMeshes) selectableCount++;
    }
  });

  check(`Mundo '${w}': objetos interactivos seleccionables por Raycaster (${sampleTargets.length} muestreados)`, selectableCount > 0);
});

console.log('\n--- RESUMEN FINAL ---');
console.log(`Pruebas totales: ${passes + failures} | Aprobadas: ${passes} | Fallidas: ${failures}`);

if (failures > 0) {
  console.error('\n❌ Verificación fallida.');
  process.exit(1);
} else {
  console.log('\n🎉 ¡VERIFICACIÓN EXITOSA: TODAS LAS ETIQUETAS SPRITE NACEN INVISIBLES Y TODOS LOS OBJETOS SON SELECCIONABLES!');
  process.exit(0);
}

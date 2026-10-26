/**
 * Test de Verificación de Integración y Mallas 3D para MasterENG World Tour
 * Valida los 7 mundos 3D, invocación de constructores modulares y ausencia de errores.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== AUDITORÍA DE INTEGRACIÓN Y MALLAS 3D (7 MUNDOS) ===\n');

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

console.log('1. Verificando que js/world3d.js invoque constructores de los módulos especializados...');
check(
  'js/world3d.js invoca B.buildSpaceScene',
  world3dCode.includes('B.buildSpaceScene')
);
check(
  'js/world3d.js invoca B.buildGardenScene',
  world3dCode.includes('B.buildGardenScene')
);
check(
  'js/world3d.js invoca B.buildHotelScene',
  world3dCode.includes('B.buildHotelScene')
);
check(
  'js/world3d.js invoca B.buildDatingScene',
  world3dCode.includes('B.buildDatingScene')
);
check(
  'js/world3d.js invoca B.buildRestaurantScene',
  world3dCode.includes('B.buildRestaurantScene')
);
check(
  'js/world3d.js invoca B.buildSupermarketScene',
  world3dCode.includes('B.buildSupermarketScene')
);

console.log('\n2. Verificando los 7 mundos sin ReferenceError ni TypeError...');
const worlds = ['house', 'garden', 'dating', 'space', 'supermarket', 'hotel', 'restaurant'];
const worldStats = {};

for (const w of worlds) {
  try {
    ctx.World3D.switchScenario(w);
    let meshCount = 0;
    let groupCount = 0;
    let lampCount = 0;

    scene.traverse((obj) => {
      if (obj.isMesh) meshCount++;
      if (obj.isGroup) groupCount++;
      if (w === 'space') {
        const id = (obj.userData && obj.userData.id) || '';
        const name = obj.name || '';
        if (/floor_lamp|floor lamp/i.test(id) || /floor_lamp|floor lamp/i.test(name)) {
          lampCount++;
        }
      }
    });

    worldStats[w] = { meshCount, groupCount, totalNodes: meshCount + groupCount, lampCount };
    check(`Mundo '${w}' instanciado sin ReferenceError ni TypeError`, true);
  } catch (err) {
    console.error(`Error en mundo '${w}':`, err);
    check(`Mundo '${w}' instanciado sin ReferenceError ni TypeError`, false);
  }
}

console.log('\n3. Verificando ausencia de lámpara doméstica en el escenario "space"...');
const spaceLamps = (worldStats.space && worldStats.space.lampCount) || 0;
check(
  `Cero lámparas domésticas en 'space' (Lámparas encontradas: ${spaceLamps})`,
  spaceLamps === 0
);

console.log('\n4. Verificando que hotel, dating, restaurant y supermarket generen más de 50 grupos/mallas...');
['hotel', 'dating', 'restaurant', 'supermarket'].forEach((w) => {
  const stats = worldStats[w] || { meshCount: 0, groupCount: 0, totalNodes: 0 };
  const total = stats.totalNodes;
  check(
    `Mundo '${w}' genera más de 50 mallas/grupos (Total: ${total} [${stats.meshCount} mallas, ${stats.groupCount} grupos])`,
    total > 50 && stats.meshCount > 20
  );
});

console.log('\n5. Verificando presencia de estructuras arquitectónicas reales...');
ctx.World3D.switchScenario('hotel');
check('Grupo arquitectónico MasterENG_HotelArchitecture presente en hotel', !!scene.getObjectByName('MasterENG_HotelArchitecture'));

ctx.World3D.switchScenario('restaurant');
check('Grupo arquitectónico Restaurant presente en restaurant', !!(scene.getObjectByName('RestaurantArchitecturalMasterGroup') || scene.getObjectByName('Restaurant_ZoneRoot')));

ctx.World3D.switchScenario('supermarket');
check('Grupo arquitectónico Supermarket presente en supermarket', !!(scene.getObjectByName('SupermarketArchitecturalMasterGroup') || scene.getObjectByName('Supermarket_ZoneRoot')));

console.log('\n--- RESUMEN FINAL ---');
console.log(`Pruebas totales: ${passes + failures} | Aprobadas: ${passes} | Fallidas: ${failures}`);

if (failures > 0) {
  console.error('\n❌ Auditoría fallida.');
  process.exit(1);
} else {
  console.log('\n🎉 ¡TODOS LOS REQUISITOS DE INTEGRACIÓN Y MALLAS 3D VERIFICADOS AL 100%!');
  process.exit(0);
}

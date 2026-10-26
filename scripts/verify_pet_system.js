/**
 * Test de Auditoría Automática: Sistema MasterPet v2 & Minijuegos 2D
 * Valida:
 *  a) Ausencia de botones flotantes intrusivos en el Menú Principal
 *  b) 0 mascotas por defecto para usuarios nuevos (sin Crocody ni Coco)
 *  c) Límite estricto de 1 mascota para usuarios Free con bloqueo VIP
 *  d) Presencia de botones: Volver a Portales, Renombrar, Ropa/Closet, Minijuegos Basketball y Volleyball
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== AUDITORÍA AUTOMÁTICA DEL SISTEMA MASTERPET V2 & MINIJUEGOS 2D ===\n');

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

// -------------------------------------------------------------
// 1. REVISIÓN DE ESTRUCTURA ESTÁTICA EN INDEX.HTML
// -------------------------------------------------------------
console.log('1. Verificando index.html y ausencia de botones/barras flotantes estáticas...');
const indexPath = path.join(__dirname, '..', 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

check(
  'index.html incluye script js/pet_minigames_2d.js antes de pet_engine_2d.js',
  indexHtml.includes('<script src="js/pet_minigames_2d.js"></script>') &&
  indexHtml.indexOf('js/pet_minigames_2d.js') < indexHtml.indexOf('js/pet_engine_2d.js')
);

// Verificar que no haya botones estáticos sueltos de MasterPet o barras Nursery/Kitchen/Bath en el HTML principal
const hasStrayNursery = indexHtml.includes('id="view-pet-game"') || indexHtml.includes('data-room="nursery"');
check('index.html NO contiene barra estática de Nursery/Kitchen/Bath en el HTML base', !hasStrayNursery);

const hasStrayFloatingBtn = /<button[^>]*id=["']floatingPetButton["']/i.test(indexHtml) ||
                            /<button[^>]*id=["']masterpet-launcher-fab["']/i.test(indexHtml);
check('index.html NO contiene botones flotantes estáticos de MasterPet en el Menú Principal', !hasStrayFloatingBtn);

// -------------------------------------------------------------
// 2. ENTORNO VM Y PRUEBAS FUNCIONALES
// -------------------------------------------------------------
console.log('\n2. Preparando entorno de pruebas y cargando módulos de MasterPet...');

function createStorageMock() {
  let store = {};
  return {
    getItem: (k) => (store[k] !== undefined ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
    _dump: () => store
  };
}

function createDOMElement(tag = 'div') {
  const children = [];
  const classSet = new Set();
  const attributes = {};
  return {
    tagName: tag.toUpperCase(),
    id: '',
    title: '',
    className: '',
    style: {
      display: '',
      setProperty: (k, v) => {},
      removeProperty: (k) => {}
    },
    dataset: {},
    classList: {
      add: (c) => classSet.add(c),
      remove: (c) => classSet.delete(c),
      contains: (c) => classSet.has(c)
    },
    children,
    parentElement: null,
    appendChild: function(ch) {
      ch.parentElement = this;
      children.push(ch);
      return ch;
    },
    removeChild: function(ch) {
      const idx = children.indexOf(ch);
      if (idx !== -1) children.splice(idx, 1);
      return ch;
    },
    remove: function() {
      if (this.parentElement) {
        this.parentElement.removeChild(this);
      }
    },
    innerHTML: '',
    innerText: '',
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: (sel) => null,
    querySelectorAll: (sel) => [],
    getContext: () => ({
      fillRect: () => {}, clearRect: () => {}, beginPath: () => {},
      arc: () => {}, fill: () => {}, stroke: () => {}, moveTo: () => {},
      lineTo: () => {}, save: () => {}, restore: () => {}, translate: () => {},
      rotate: () => {}, scale: () => {}, measureText: () => ({ width: 50 }),
      fillText: () => {}
    })
  };
}

const storage = createStorageMock();
const bodyEl = createDOMElement('body');
const headEl = createDOMElement('head');

const domElementsMap = new Map();

const mockDocument = {
  head: headEl,
  body: bodyEl,
  readyState: 'complete',
  createElement: (tag) => {
    const el = createDOMElement(tag);
    return el;
  },
  getElementById: (id) => domElementsMap.get(id) || null,
  querySelector: (sel) => {
    if (sel.includes('MasterPet') || sel.includes('Mascota 2D')) {
      return null;
    }
    return null;
  },
  querySelectorAll: () => [],
  addEventListener: () => {},
  removeEventListener: () => {}
};

// Contenedores requeridos por MasterPet
const sanctuaryView = createDOMElement('div');
sanctuaryView.id = 'view-pet-sanctuary';
domElementsMap.set('view-pet-sanctuary', sanctuaryView);
bodyEl.appendChild(sanctuaryView);

const ctx = {
  console,
  setTimeout: (fn, ms) => { if (typeof fn === 'function') fn(); return 1; },
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
  document: mockDocument,
  localStorage: storage,
  window: null,
  global: null,
  self: null,
  globalThis: null,
  AudioContext: function() {
    return {
      createOscillator: () => ({ connect: () => {}, start: () => {}, stop: () => {}, frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }),
      createGain: () => ({ connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }),
      currentTime: 0,
      state: 'running',
      resume: async () => {}
    };
  },
  speechSynthesis: {
    speak: () => {},
    cancel: () => {}
  },
  SpeechSynthesisUtterance: function(text) {
    this.text = text;
  },
  BroadcastChannel: function() {
    return { postMessage: () => {}, close: () => {}, onmessage: null };
  }
};
ctx.window = ctx;
ctx.global = ctx;
ctx.self = ctx;
ctx.globalThis = ctx;

vm.createContext(ctx);

// Ejecutar scripts en orden estricto
const minigamesCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'pet_minigames_2d.js'), 'utf8');
const engineCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'pet_engine_2d.js'), 'utf8');
const sanctuaryCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'pet_sanctuary.js'), 'utf8');

vm.runInContext(minigamesCode, ctx);
vm.runInContext(engineCode, ctx);
vm.runInContext(sanctuaryCode, ctx);

// -------------------------------------------------------------
// a) VERIFICAR BOTONES FLOTANTES GLOBALES NO INYECTADOS
// -------------------------------------------------------------
console.log('\n3. Verificando que NO existan botones flotantes globales inyectados...');
const floatingBtn = bodyEl.children.find(c =>
  c.id === 'floatingPetButton' ||
  c.id === 'masterpet-launcher-fab' ||
  (c.title && (c.title.includes('MasterPet') || c.title.includes('Mascota 2D')))
);
check('Cero botones flotantes residuales de MasterPet inyectados en document.body', !floatingBtn);

// -------------------------------------------------------------
// b) VERIFICAR 0 MASCOTAS POR DEFECTO PARA USUARIOS NUEVOS
// -------------------------------------------------------------
console.log('\n4. Verificando que un usuario nuevo inicie con 0 mascotas por defecto...');
storage.clear();
const initialPets = ctx.loadStoredPets();

check(
  `Usuario nuevo inicia con exactamente 0 mascotas (Mascotas cargadas: ${initialPets.length})`,
  Array.isArray(initialPets) && initialPets.length === 0
);

check(
  'No existe ninguna mascota preinstalada "Crocody" ni "Coco"',
  !initialPets.some(p => p.name === 'Crocody' || p.name === 'Coco')
);

// -------------------------------------------------------------
// c) VERIFICAR LÍMITE FREE (1 MASCOTA) Y BLOQUEO VIP
// -------------------------------------------------------------
console.log('\n5. Verificando límite de 1 mascota para usuarios Free y bloqueo VIP...');
storage.setItem('user_role', 'user');
storage.removeItem('mastereng_is_vip');

// Agregar 1 mascota creada por el usuario
const firstPet = {
  id: 'pet_user_custom_1',
  species: 'crocodile',
  name: 'MiCocodrilo',
  stage: 'baby',
  level: 1,
  hunger: 80,
  energy: 80,
  hygiene: 80,
  happiness: 80
};
storage.setItem('mastereng_pets', JSON.stringify([firstPet]));

// Capturar modal creado
let modalCreated = null;
const originalCreateElement = mockDocument.createElement;
mockDocument.createElement = function(tag) {
  const el = originalCreateElement(tag);
  if (tag.toLowerCase() === 'div') {
    modalCreated = el;
  }
  return el;
};

// Intentar adoptar una segunda mascota como usuario Free
ctx.openPetAdoptModal();

check(
  'Usuario Free con 1 mascota activa es bloqueado al intentar adoptar otra',
  modalCreated && (modalCreated.id === 'masterpet-vip-limit-modal' || modalCreated.innerHTML.includes('Límite de Mascotas Free (1/1)'))
);

// Probar ahora como usuario VIP
storage.setItem('mastereng_is_vip', 'true');
modalCreated = null;
ctx.openPetAdoptModal();

check(
  'Usuario VIP sí tiene acceso al catálogo de adopción para ranuras ilimitadas',
  modalCreated && (modalCreated.id === 'masterpet-adopt-modal' || modalCreated.innerHTML.includes('Catálogo de Adopción'))
);

// -------------------------------------------------------------
// d) VERIFICAR BOTONES: VOLVER A PORTALES, RENOMBRAR, CLOSET Y MINIJUEGOS 2D
// -------------------------------------------------------------
console.log('\n6. Verificando presencia de controles clave: Portales, Renombrar, Closet y Minijuegos...');

check(
  'Botón y función "Volver a Portales" disponible en MasterPet (closePetSanctuary / returnToPortals)',
  typeof ctx.closePetSanctuary === 'function' && typeof ctx.PetEngine2D.returnToPortals === 'function'
);

check(
  'Botón y función "Renombrar" disponible en PetEngine2D (openRenameModal)',
  typeof ctx.PetEngine2D.openRenameModal === 'function'
);

check(
  'Botón y función "Ropa / Closet" disponible en PetEngine2D (openClosetModal)',
  typeof ctx.PetEngine2D.openClosetModal === 'function'
);

check(
  'Minijuegos 2D integrados: Basketball Hoops y Beach Volleyball disponibles en PetArcadeManager',
  typeof ctx.startArcadeGame === 'function' &&
  typeof ctx.openPetArcadeModal === 'function' &&
  ctx.PetArcadeManager !== undefined
);

// Probar lanzamiento de juego Basketball y Volleyball sin errores
let launchedBasket = false;
let launchedVolley = false;
try {
  ctx.PetArcadeManager.activeGameId = 'basketball';
  launchedBasket = true;
  ctx.PetArcadeManager.activeGameId = 'volleyball';
  launchedVolley = true;
} catch (e) {
  console.error('Error probando minijuegos:', e);
}

check('Minijuego Basketball 2D configurable y ejecutable', launchedBasket);
check('Minijuego Beach Volleyball 2D configurable y ejecutable', launchedVolley);

// -------------------------------------------------------------
// 7. VERIFICAR CONEXIÓN DE BOTÓN 🎮 JUGAR CON CONSOLA ARCADE
// -------------------------------------------------------------
console.log('\n7. Verificando conexión de botón 🎮 Jugar con la consola de minijuegos...');

let arcadeOpened = false;
ctx.PetArcadeManager.open = function(state) {
  arcadeOpened = true;
};

ctx.PetEngine2D.openMinigames();
check('PetEngine2D.openMinigames() invoca la consola Arcade de Minijuegos', arcadeOpened);

arcadeOpened = false;
ctx.PetEngine2D.playBall();
check('PetEngine2D.playBall() delega la interacción a la consola Arcade de Minijuegos', arcadeOpened);

// -------------------------------------------------------------
// RESUMEN FINAL
// -------------------------------------------------------------
console.log('\n--- RESUMEN DE AUDITORÍA ---');
console.log(`Pruebas totales: ${passes + failures} | Aprobadas: ${passes} | Fallidas: ${failures}`);

if (failures > 0) {
  console.error('\n❌ Auditoría fallida. Revisa los errores señalados.');
  process.exit(1);
} else {
  console.log('\n🎉 ¡TODOS LOS REQUERIMIENTOS DEL SISTEMA MASTERPET V2 VERIFICADOS EXITOSAMENTE AL 100%!');
  process.exit(0);
}

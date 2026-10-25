/**
 * World Tour 3D Engine (Three.js WebGL) - MasterENG
 * Motor 3D modular interactivo para Inmersión Espacial / World Tour 3D.
 * Incluye Casa Abierta y Jardín de Aprendizaje estilizado (Low Poly / Clean Modern Geometry),
 * marcadores interactivos flotantes (Hotspots luminosos pulsantes),
 * iluminación equilibrada PBR, domo espacial con gradiente azul profundo,
 * controles OrbitControls amortiguados, interpolación suave de cámara (Lerp),
 * tarjeta emergente estilizada con audio 🔊 (Web Speech API),
 * gamificación (+5 EXP por descubrimiento de objeto nuevo, +10 EXP por práctica),
 * optimización de ciclo de vida (pause/resume en requestAnimationFrame)
 * y botón flotante de retorno "← Volver a Portales" (z-index: 10000).
 *
 * Desarrollado por: Wilberth Alessandro Molina Cutz
 */

(function (global) {
  'use strict';

  // ============================================================================
  // 1. ESTADO DEL MOTOR WEBGL, OPTIMIZACIÓN iOS SAFARI Y CICLO DE VIDA
  // ============================================================================
  if (typeof navigator === 'undefined') {
    try { global.navigator = { userAgent: '', maxTouchPoints: 0 }; } catch (e) {}
  }
  const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

  let isWorldTourActive = true;
  let isEngineInitialized = false;
  let scene = null;
  let camera = null;
  let renderer = null;
  let controls = null;
  let animFrameId = null;
  let resizeObserver = null;
  let lastFrameTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  let clock = typeof THREE !== 'undefined' ? new THREE.Clock() : null;

  // Estado del escenario activo (7 mundos 3D) y memoria de geometrías dinámicas
  let currentScenarioKey = 'house';
  let scenarioDynamicRoot = null;
  let spaceOrbitalEntries = [];

  // Posiciones clave del Mesero IA (NUNCA en x: ±1.25, z: 0 donde están las sillas)
  const WAITER_STATION_POS = { x: 2.8, y: 0, z: -2.4 };
  const WAITER_TABLE_POS = { x: 0.0, y: 0, z: -1.45 };
  let waiterGroup = null;
  let waiterNpcGroup = null;
  let waiterLeftLeg = null;
  let waiterRightLeg = null;
  let waiterLeftArm = null;
  let waiterRightArm = null;
  let waiterTargetPos = typeof THREE !== 'undefined'
    ? new THREE.Vector3(WAITER_STATION_POS.x, WAITER_STATION_POS.y, WAITER_STATION_POS.z)
    : { x: WAITER_STATION_POS.x, y: WAITER_STATION_POS.y, z: WAITER_STATION_POS.z };
  let waiterCurrentState = 'station';
  let waiterAutoLeaveTimer = null;

  // Avatares sentados en la mesa de citas (Silla Izquierda: Jugador x=-1.25, z=0 | Silla Derecha: Cita x=1.25, z=0)
  let playerSeatedGroup = null;
  let partnerSeatedGroup = null;

  // Burbujas de chat estilo Roblox sobre la cabeza (player, partner, waiter)
  let activeOverheadBubbles = {};

  let candleFlameLight = null;
  let candleFlameMesh = null;
  const waiterLerp = {
    active: false,
    targetPos: waiterTargetPos,
    targetRotY: 0,
    phase: 0
  };

  // Luces globales y puntuales para el Ciclo Día / Noche
  let isNightMode = false;
  let globalAmbientLight = null;
  let globalHemiLight = null;
  let globalDirLight = null;
  let studyPointLight = null;
  let floorLampPointLight = null;
  let floorLampShadeMat = null;
  let streetLanternSpotLight = null;
  let streetLanternPointLight = null;
  let streetLanternBulbMat = null;
  let monitorScreenMaterial = null;
  let spaceDomeMesh = null;

  // Animaciones continuas
  let animatedFan = null;
  let animatedSprinkler = null;
  let animatedClockMinuteHand = null;
  let animatedClockHourHand = null;
  let animatedSteamRings = [];
  let animatedWindowLeaves = [];

  const threeAnimatedObjects = {
    fan: null,
    sprinkler: null,
    steam: [],
    leaves: []
  };
  global.threeAnimatedObjects = threeAnimatedObjects;

  // Interpolación suave de cámara (Lerp) en requestAnimationFrame
  const cameraLerp = {
    active: false,
    targetPos: typeof THREE !== 'undefined' ? new THREE.Vector3(0, 10.5, 16.5) : { x: 0, y: 10.5, z: 16.5 },
    targetLookAt: typeof THREE !== 'undefined' ? new THREE.Vector3(0, 1.4, -0.5) : { x: 0, y: 1.4, z: -0.5 },
    speed: 0.08
  };

  // Vistas predefinidas de cámara (Filtro Rápido)
  const CAMERA_ZONES = {
    overview: {
      pos: { x: 0, y: 10.8, z: 16.8 },
      lookAt: { x: 0, y: 1.3, z: -0.5 },
      label: '🏠 Vista General'
    },
    living: {
      pos: { x: -3.6, y: 4.5, z: 2.2 },
      lookAt: { x: -3.6, y: 1.2, z: -3.8 },
      label: '🛋️ Sala de Estar (Living Room)'
    },
    study: {
      pos: { x: 3.5, y: 4.3, z: 1.8 },
      lookAt: { x: 3.6, y: 1.3, z: -3.4 },
      label: '💻 Zona de Estudio (Study Room)'
    },
    garden: {
      pos: { x: 0, y: 5.8, z: 19.2 },
      lookAt: { x: 0, y: 1.2, z: 7.2 },
      label: '🌳 Jardín Exterior (Garden & Yard)'
    },
    window: {
      pos: { x: -4.5, y: 3.0, z: 0.5 },
      lookAt: { x: -7.0, y: 2.0, z: -1.75 },
      label: '🪟 Ventana Panorámica (Window)'
    }
  };

  // Objetos interactivos y estado de gamificación
  let interactiveObjects = [];
  let spatialHotspots = [];
  let selectedObjectGroup = null;
  let selectedObjectData = null;
  let highlightedMaterialsBackup = [];
  let highlightPulseTime = 0;

  // Hover interactivo con contorno / brillo sutil (emissive boost)
  let hoveredObjectGroup = null;
  let hoveredMaterialsBackup = [];

  const STORAGE_KEY_DISCOVERED = 'mastereng_world3d_discovered_v2';
  const STORAGE_KEY_LEARNED = 'mastereng_world3d_learned_v2';
  let discoveredObjectIds = new Set();
  let learnedObjectIds = new Set();

  function loadProgressFromStorage() {
    try {
      const rawDisc = localStorage.getItem(STORAGE_KEY_DISCOVERED);
      if (rawDisc) {
        JSON.parse(rawDisc).forEach(id => discoveredObjectIds.add(id));
      }
      const rawLearn = localStorage.getItem(STORAGE_KEY_LEARNED);
      if (rawLearn) {
        JSON.parse(rawLearn).forEach(id => {
          learnedObjectIds.add(id);
          discoveredObjectIds.add(id);
        });
      }
    } catch (e) { }
  }

  function saveProgressToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_DISCOVERED, JSON.stringify(Array.from(discoveredObjectIds)));
      localStorage.setItem(STORAGE_KEY_LEARNED, JSON.stringify(Array.from(learnedObjectIds)));
    } catch (e) { }
  }

  loadProgressFromStorage();

  // ============================================================================
  // 2. CATÁLOGO OFICIAL DE OBJETOS INTERACTIVOS (USERDATA GAMIFICADO)
  // ============================================================================
  const WORLD3D_VOCAB_CATALOG = {
    // --- ZONA DE ESTUDIO (STUDY ROOM) ---
    desk: {
      interactive: true,
      id: "desk",
      wordEn: "Desk",
      phonetic: "/desk/",
      wordEs: "Escritorio (con Laptop Interactiva)",
      category: "Study Room",
      example: "I practice English code and grammar on my wooden desk with my laptop.",
      en: "Desk",
      ipa: "/desk/",
      es: "Escritorio de madera con laptop interactiva y patas biseladas",
      focusPos: { x: 2.2, y: 2.8, z: -1.0 },
      lookAtPos: { x: 3.5, y: 1.0, z: -3.5 }
    },
    computer_monitor: {
      interactive: true,
      id: "computer_monitor",
      wordEn: "Computer Monitor",
      phonetic: "/kəmˈpjuː.t̬ɚ ˈmɑː.nə.t̬ɚ/",
      wordEs: "Monitor de Computadora",
      category: "Study Room",
      example: "The computer monitor glows with interactive English code and lessons.",
      en: "Computer Monitor",
      ipa: "/kəmˈpjuː.t̬ɚ ˈmɑː.nə.t̬ɚ/",
      es: "Monitor con pantalla emisiva activa",
      focusPos: { x: 3.5, y: 2.2, z: -1.6 },
      lookAtPos: { x: 3.5, y: 1.5, z: -3.65 }
    },
    office_chair: {
      interactive: true,
      id: "office_chair",
      wordEn: "Office Chair",
      phonetic: "/ˈɑː.fɪs tʃer/",
      wordEs: "Silla de Oficina Ergonómica",
      category: "Study Room",
      example: "This ergonomic office chair has a comfortable curved backrest and wheels.",
      en: "Office Chair",
      ipa: "/ˈɑː.fɪs tʃer/",
      es: "Silla ergonómica con soporte curvo y ruedas",
      focusPos: { x: 1.8, y: 2.3, z: -0.4 },
      lookAtPos: { x: 3.5, y: 0.9, z: -2.1 }
    },
    bookshelf: {
      interactive: true,
      id: "bookshelf",
      wordEn: "Bookshelf",
      phonetic: "/ˈbʊk.ʃelf/",
      wordEs: "Librero / Estantería",
      category: "Study Room",
      example: "The wooden bookshelf is filled with colorful collectible English novels and dictionaries.",
      en: "Bookshelf",
      ipa: "/ˈbʊk.ʃelf/",
      es: "Estantería con libros coleccionables de colores individuales",
      focusPos: { x: 3.8, y: 2.6, z: -2.2 },
      lookAtPos: { x: 6.3, y: 1.6, z: -3.5 }
    },
    window: {
      interactive: true,
      id: "window",
      wordEn: "Window",
      phonetic: "/ˈwɪn.doʊ/",
      wordEs: "Ventanal Panorámico",
      category: "Living Room",
      example: "The large window provides a beautiful view of the swaying green trees in the garden.",
      en: "Window",
      ipa: "/ˈwɪn.doʊ/",
      es: "Ventanal con vista al jardín y árboles mecientes",
      focusPos: { x: -4.5, y: 2.5, z: 0.2 },
      lookAtPos: { x: -7.0, y: 2.0, z: -1.75 }
    },

    // --- ZONA DE SALA (LIVING ROOM) ---
    sofa: {
      interactive: true,
      id: "sofa",
      wordEn: "Sofa / Couch",
      phonetic: "/ˈsoʊ.fə/",
      wordEs: "Sofá / Zona de Descanso",
      category: "Living Room",
      example: "I relax on the cozy sofa after studying English vocabulary.",
      en: "Sofa / Couch",
      ipa: "/ˈsoʊ.fə/",
      es: "Sofá acolchado con cojines en contraste",
      focusPos: { x: -3.6, y: 2.6, z: -0.6 },
      lookAtPos: { x: -3.6, y: 0.85, z: -4.1 }
    },
    armchair: {
      interactive: true,
      id: "armchair",
      wordEn: "Armchair",
      phonetic: "/ˈɑːrm.tʃer/",
      wordEs: "Sillón de Lectura",
      category: "Living Room",
      example: "I sit in the comfortable armchair by the window to read English stories.",
      en: "Armchair",
      ipa: "/ˈɑːrm.tʃer/",
      es: "Sillón tapizado ergonómico en la zona de descanso",
      focusPos: { x: -4.2, y: 2.2, z: 0.8 },
      lookAtPos: { x: -5.6, y: 0.8, z: -0.8 }
    },
    coffee_table: {
      interactive: true,
      id: "coffee_table",
      wordEn: "Coffee Table",
      phonetic: "/ˈkɑː.fi ˌteɪ.bəl/",
      wordEs: "Mesa de Centro (con Taza)",
      category: "Living Room",
      example: "There is a warm ceramic coffee mug resting on the coffee table.",
      en: "Coffee Table",
      ipa: "/ˈkɑː.fi ˌteɪ.bəl/",
      es: "Mesa de centro baja con taza de cerámica",
      focusPos: { x: -2.2, y: 2.1, z: 0.2 },
      lookAtPos: { x: -3.6, y: 0.65, z: -2.0 }
    },
    floor_lamp: {
      interactive: true,
      id: "floor_lamp",
      wordEn: "Floor Lamp",
      phonetic: "/flɔːr læmp/",
      wordEs: "Lámpara de Pie",
      category: "Living Room",
      example: "The tall floor lamp illuminates the living room with a warm golden glow.",
      en: "Floor Lamp",
      ipa: "/flɔːr læmp/",
      es: "Lámpara de pie alta con pantalla cálida",
      focusPos: { x: -4.2, y: 2.5, z: -1.8 },
      lookAtPos: { x: -5.8, y: 1.5, z: -4.5 }
    },
    wall_clock: {
      interactive: true,
      id: "wall_clock",
      wordEn: "Clock",
      phonetic: "/klɑːk/",
      wordEs: "Reloj de Pared Animado",
      category: "Living Room",
      example: "I check the ticking wall clock to start my daily English session on time.",
      en: "Clock",
      ipa: "/klɑːk/",
      es: "Reloj de pared circular con manecillas animadas",
      focusPos: { x: -3.6, y: 2.7, z: -4.2 },
      lookAtPos: { x: -3.6, y: 2.65, z: -6.8 }
    },
    clock: {
      interactive: true,
      id: "wall_clock",
      wordEn: "Clock",
      phonetic: "/klɑːk/",
      wordEs: "Reloj de Pared Animado",
      category: "Living Room",
      example: "The wall clock ticks smoothly with animated hour and minute hands.",
      en: "Clock",
      ipa: "/klɑːk/",
      es: "Reloj de pared circular con manecillas animadas",
      focusPos: { x: -3.6, y: 2.7, z: -4.2 },
      lookAtPos: { x: -3.6, y: 2.65, z: -6.8 }
    },
    indoor_plant: {
      interactive: true,
      id: "indoor_plant",
      wordEn: "Indoor Plant",
      phonetic: "/ˈɪn.dɔːr plænt/",
      wordEs: "Planta de Interior",
      category: "Living Room",
      example: "The green indoor plant in the terracotta pot makes the room feel fresh.",
      en: "Indoor Plant",
      ipa: "/ˈɪn.dɔːr plænt/",
      es: "Planta interior en maceta de terracota",
      focusPos: { x: -1.2, y: 2.1, z: -2.8 },
      lookAtPos: { x: -1.2, y: 0.95, z: -5.5 }
    },

    // --- JARDÍN EXTERIOR (GARDEN & YARD) ---
    oak_tree: {
      interactive: true,
      id: "oak_tree",
      wordEn: "Oak Tree",
      phonetic: "/oʊk triː/",
      wordEs: "Árbol de Roble",
      category: "Garden & Yard",
      example: "The tall oak tree provides cool shade across the green garden.",
      en: "Oak Tree",
      ipa: "/oʊk triː/",
      es: "Árbol de roble con tronco orgánico y copa frondosa",
      focusPos: { x: -4.5, y: 4.2, z: 12.8 },
      lookAtPos: { x: -8.5, y: 2.5, z: 7.5 }
    },
    park_bench: {
      interactive: true,
      id: "park_bench",
      wordEn: "Park Bench",
      phonetic: "/pɑːrk bentʃ/",
      wordEs: "Banca de Jardín",
      category: "Garden & Yard",
      example: "We sit on the wooden park bench to read stories outdoors.",
      en: "Park Bench",
      ipa: "/pɑːrk bentʃ/",
      es: "Banca de jardín con listones de madera y hierro",
      focusPos: { x: -2.2, y: 2.2, z: 10.5 },
      lookAtPos: { x: -4.5, y: 0.65, z: 7.5 }
    },
    street_lantern: {
      interactive: true,
      id: "street_lantern",
      wordEn: "Street Lantern",
      phonetic: "/striːt ˈlæn.tɚn/",
      wordEs: "Farol de Jardín",
      category: "Garden & Yard",
      example: "At night, the classic street lantern lights up the stone path.",
      en: "Street Lantern",
      ipa: "/striːt ˈlæn.tɚn/",
      es: "Farol de jardín exterior con luz cálida",
      focusPos: { x: 0.5, y: 2.8, z: 9.8 },
      lookAtPos: { x: 2.4, y: 1.8, z: 6.5 }
    },
    flower_bush: {
      interactive: true,
      id: "flower_bush",
      wordEn: "Flower Bush",
      phonetic: "/ˈflaʊ.ɚ bʊʃ/",
      wordEs: "Arbusto Floral",
      category: "Garden & Yard",
      example: "Colorful blossoms bloom all over the vibrant flower bush.",
      en: "Flower Bush",
      ipa: "/ˈflaʊ.ɚ bʊʃ/",
      es: "Arbusto floral con flores de colores vivos",
      focusPos: { x: 3.8, y: 2.0, z: 8.8 },
      lookAtPos: { x: 5.8, y: 0.7, z: 5.8 }
    },
    mailbox: {
      interactive: true,
      id: "mailbox",
      wordEn: "Mailbox",
      phonetic: "/ˈmeɪl.bɑːks/",
      wordEs: "Buzón Americano",
      category: "Garden & Yard",
      example: "I raised the red flag on the mailbox to send a letter.",
      en: "Mailbox",
      ipa: "/ˈmeɪl.bɑːks/",
      es: "Buzón de correo en la entrada con banderilla roja",
      focusPos: { x: 0.6, y: 2.1, z: 14.5 },
      lookAtPos: { x: 2.1, y: 1.0, z: 11.8 }
    }
  };

  const TOTAL_INTERACTIVE_OBJECTS = 14;

  // ============================================================================
  // 3. CONTROLES ORBITALES SUAVES (THREE.OrbitControls) CON DAMPING
  // ============================================================================
  function ensureOrbitControls() {
    if (typeof THREE !== 'undefined' && typeof THREE.OrbitControls === 'undefined') {
      THREE.OrbitControls = function (object, domElement) {
      this.object = object;
      this.domElement = domElement || document;

      this.enabled = true;
      this.target = new THREE.Vector3(0, 1.4, -0.5);

      this.minDistance = 2.0;
      this.maxDistance = 48.0;

      // Límite polar para no atravesar el suelo (maxPolarAngle: Math.PI / 2.05 | Math.PI / 2.1)
      this.minPolarAngle = 0.08;
      this.maxPolarAngle = Math.PI / 2.05; // ~Math.PI / 2.1

      this.enableDamping = true;
      this.dampingFactor = 0.05;

      this.rotateSpeed = 0.85;
      this.zoomSpeed = 1.0;

      const scope = this;
      let isDragging = false;
      let isPanning = false;
      const prevMousePos = new THREE.Vector2();
      const deltaMousePos = new THREE.Vector2();

      let touchStartDist = 0;
      let isTouching = false;
      const prevTouchPos = new THREE.Vector2();

      const spherical = {
        radius: 18.0,
        theta: 0.0,
        phi: Math.PI / 3.1
      };
      const sphericalDelta = {
        radius: 0.0,
        theta: 0.0,
        phi: 0.0
      };

      this.syncSphericalFromObject = function () {
        const offset = new THREE.Vector3().copy(scope.object.position).sub(scope.target);
        spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, offset.length()));
        spherical.theta = Math.atan2(offset.x, offset.z);
        const clampedRatio = Math.max(-1, Math.min(1, offset.y / (spherical.radius || 0.001)));
        spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, Math.acos(clampedRatio)));
      };
      this.syncSphericalFromObject();

      function cancelActiveCameraLerp() {
        cameraLerp.active = false;
      }

      function onMouseDown(e) {
        if (!scope.enabled) return;
        if (e.button === 0) {
          isDragging = true;
          prevMousePos.set(e.clientX, e.clientY);
        } else if (e.button === 2) {
          isPanning = true;
          prevMousePos.set(e.clientX, e.clientY);
        }
      }

      function onMouseMove(e) {
        if (!scope.enabled) return;
        if (!isDragging && !isPanning) return;

        deltaMousePos.set(e.clientX - prevMousePos.x, e.clientY - prevMousePos.y);
        if (Math.hypot(deltaMousePos.x, deltaMousePos.y) > 2) {
          cancelActiveCameraLerp();
        }

        const el = scope.domElement === document ? document.body : scope.domElement;
        const w = el.clientWidth || window.innerWidth || 800;
        const h = el.clientHeight || window.innerHeight || 600;

        if (isDragging) {
          sphericalDelta.theta -= (2 * Math.PI * deltaMousePos.x / w) * scope.rotateSpeed;
          sphericalDelta.phi -= (2 * Math.PI * deltaMousePos.y / h) * scope.rotateSpeed;
        } else if (isPanning) {
          const panSpeed = spherical.radius * 0.0015;
          const right = new THREE.Vector3();
          const up = new THREE.Vector3(0, 1, 0);
          scope.object.getWorldDirection(right);
          right.cross(up).normalize();
          scope.target.addScaledVector(right, -deltaMousePos.x * panSpeed);
          scope.target.z = Math.max(-12, Math.min(16, scope.target.z));
          scope.target.x = Math.max(-12, Math.min(12, scope.target.x));
        }

        prevMousePos.set(e.clientX, e.clientY);
      }

      function onMouseUp() {
        isDragging = false;
        isPanning = false;
      }

      function onWheel(e) {
        if (!scope.enabled) return;
        e.preventDefault();
        cancelActiveCameraLerp();
        const factor = e.deltaY < 0 ? 0.90 : 1.10;
        spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius * factor));
      }

      function onTouchStart(e) {
        if (!scope.enabled) return;
        if (e.touches.length === 1) {
          isTouching = true;
          prevTouchPos.set(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e.touches.length === 2) {
          cancelActiveCameraLerp();
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          touchStartDist = Math.hypot(dx, dy);
        }
      }

      function onTouchMove(e) {
        if (!scope.enabled) return;
        if (e.touches.length === 1 && isTouching) {
          const deltaX = e.touches[0].clientX - prevTouchPos.x;
          const deltaY = e.touches[0].clientY - prevTouchPos.y;
          if (Math.hypot(deltaX, deltaY) > 2) {
            cancelActiveCameraLerp();
          }
          const el = scope.domElement === document ? document.body : scope.domElement;
          const w = el.clientWidth || window.innerWidth || 800;
          const h = el.clientHeight || window.innerHeight || 600;

          sphericalDelta.theta -= (2 * Math.PI * deltaX / w) * scope.rotateSpeed;
          sphericalDelta.phi -= (2 * Math.PI * deltaY / h) * scope.rotateSpeed;

          prevTouchPos.set(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.hypot(dx, dy);
          if (touchStartDist > 0) {
            const factor = touchStartDist / (dist || 1);
            spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius * factor));
          }
          touchStartDist = dist;
        }
      }

      function onTouchEnd() {
        isTouching = false;
        touchStartDist = 0;
      }

      function onContextMenu(e) {
        e.preventDefault();
      }

      const dom = scope.domElement;
      dom.addEventListener('mousedown', onMouseDown, { passive: true });
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseup', onMouseUp, { passive: true });
      dom.addEventListener('wheel', onWheel, { passive: false });
      dom.addEventListener('touchstart', onTouchStart, { passive: true });
      dom.addEventListener('touchmove', onTouchMove, { passive: true });
      dom.addEventListener('touchend', onTouchEnd, { passive: true });
      dom.addEventListener('contextmenu', onContextMenu, { passive: false });

      this.update = function () {
        if (scope.enableDamping) {
          spherical.theta += sphericalDelta.theta * scope.dampingFactor;
          spherical.phi += sphericalDelta.phi * scope.dampingFactor;
          sphericalDelta.theta *= (1 - scope.dampingFactor);
          sphericalDelta.phi *= (1 - scope.dampingFactor);
        } else {
          spherical.theta += sphericalDelta.theta;
          spherical.phi += sphericalDelta.phi;
          sphericalDelta.theta = 0;
          sphericalDelta.phi = 0;
        }

        spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
        spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));

        const offset = new THREE.Vector3();
        offset.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
        offset.y = spherical.radius * Math.cos(spherical.phi);
        offset.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);

        scope.object.position.copy(scope.target).add(offset);
        scope.object.lookAt(scope.target);
      };

      this.dispose = function () {
        dom.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        dom.removeEventListener('wheel', onWheel);
        dom.removeEventListener('touchstart', onTouchStart);
        dom.removeEventListener('touchmove', onTouchMove);
        dom.removeEventListener('touchend', onTouchEnd);
        dom.removeEventListener('contextmenu', onContextMenu);
      };
    };
  }
}
ensureOrbitControls();

  // ============================================================================
  // 4. PALETA DE MATERIALES PBR (SHARED_MATERIALS) Y TEXTURAS EN MEMORIA
  // ============================================================================
  const SHARED_MATERIALS = {};

  let cachedWoodTexture = null;
  let cachedOakWoodTexture = null;
  function createOakWoodTexture() {
    if (cachedWoodTexture) return cachedWoodTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#b68f62';
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 64) {
      ctx.fillStyle = (y / 64) % 2 === 0 ? 'rgba(255, 230, 195, 0.14)' : 'rgba(65, 38, 16, 0.14)';
      ctx.fillRect(0, y, 512, 64);
      ctx.strokeStyle = 'rgba(55, 30, 12, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    cachedWoodTexture = tex;
    cachedOakWoodTexture = tex;
    return tex;
  }

  let cachedGrassTexture = null;
  function createGrassTexture() {
    if (cachedGrassTexture) return cachedGrassTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(0, 0, 256, 256);
    const colors = ['#1e4620', '#356d2e', '#234f24', '#417d38'];
    for (let i = 0; i < 450; i++) {
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect((i * 37) % 256, (i * 73) % 256, 3, 3);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);
    cachedGrassTexture = tex;
    return tex;
  }

  let cachedBlackboardTexture = null;
  function createBlackboardTexture() {
    if (cachedBlackboardTexture) return cachedBlackboardTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#143827';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, 488, 232);
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText("MASTERENG 3D VOCABULARY", 32, 54);
    ctx.font = '19px sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText("• Click any 3D object to inspect & listen", 32, 100);
    ctx.fillText("• Practice pronunciation for +10 EXP", 32, 140);
    ctx.fillText("• Discover all 14 House & Garden items!", 32, 180);
    ctx.font = 'italic 16px sans-serif';
    ctx.fillStyle = '#6ee7b7';
    ctx.fillText("★ Interactive WebGL Learning Environment", 32, 222);
    const tex = new THREE.CanvasTexture(canvas);
    cachedBlackboardTexture = tex;
    return tex;
  }

  let cachedLaptopScreenTexture = null;
  function createLaptopScreenTexture() {
    if (cachedLaptopScreenTexture) return cachedLaptopScreenTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#07192f';
    ctx.fillRect(0, 0, 256, 160);
    ctx.fillStyle = '#0f2942';
    ctx.fillRect(0, 0, 256, 22);
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(10, 11, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(22, 11, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(34, 11, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('MasterENG_Coach.ts', 50, 15);
    const lines = [
      { c: '#67e8f9', t: 'import { World3D } from "mastereng";' },
      { c: '#38bdf8', t: 'const student = useLearner();' },
      { c: '#34d399', t: 'student.inspect("Computer Monitor");' },
      { c: '#fcd34d', t: 'student.awardExp(10); // Learned!' },
      { c: '#f472b6', t: 'console.log("Fluency: 100%");' }
    ];
    lines.forEach((l, idx) => {
      ctx.fillStyle = l.c;
      ctx.font = '9px monospace';
      ctx.fillText(l.t, 14, 44 + idx * 18);
    });
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(0, 142, 256, 18);
    ctx.fillStyle = '#020617';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('⚡ ACTIVE LESSON • +10 EXP / OBJECT', 12, 154);
    const tex = new THREE.CanvasTexture(canvas);
    cachedLaptopScreenTexture = tex;
    return tex;
  }

  let cachedPaintingTexture = null;
  function createPaintingTexture() {
    if (cachedPaintingTexture) return cachedPaintingTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 160);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(0.6, '#fde047');
    grad.addColorStop(0.75, '#fb923c');
    grad.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 160);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, 160);
    ctx.lineTo(40, 105);
    ctx.lineTo(95, 125);
    ctx.lineTo(160, 85);
    ctx.lineTo(215, 115);
    ctx.lineTo(256, 95);
    ctx.lineTo(256, 160);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
    ctx.beginPath();
    ctx.arc(160, 72, 16, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    cachedPaintingTexture = tex;
    return tex;
  }

  let cachedClockTexture = null;
  function createClockFaceTexture() {
    if (cachedClockTexture) return cachedClockTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(128 + Math.sin(angle) * 94, 128 - Math.cos(angle) * 94);
      ctx.lineTo(128 + Math.sin(angle) * 110, 128 - Math.cos(angle) * 110);
      ctx.lineWidth = i % 3 === 0 ? 5 : 2.5;
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    cachedClockTexture = tex;
    return tex;
  }

  let cachedRugTexture = null;
  function createRugTexture() {
    if (cachedRugTexture) return cachedRugTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#115e59';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, 232, 232);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(24, 24, 208, 208);
    const tex = new THREE.CanvasTexture(canvas);
    cachedRugTexture = tex;
    return tex;
  }

  // Textura de tela borgoña/vino tejida para mantel romántico PBR
  let cachedBurgundyTexture = null;
  function createBurgundyClothTexture() {
    if (cachedBurgundyTexture) return cachedBurgundyTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(0, 0, 256, 256);
    // Patrón de tejido damasco sutil y borde dorado
    ctx.strokeStyle = 'rgba(153, 27, 27, 0.55)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 256; i += 6) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 236, 236);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    cachedBurgundyTexture = tex;
    return tex;
  }

  // Textura procedural para micro-indicadores Hotspots discretos
  let cachedHotspotTexture = null;
  function createHotspotTexture() {
    if (cachedHotspotTexture) return cachedHotspotTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 4, 32, 32, 28);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.45)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    cachedHotspotTexture = tex;
    return tex;
  }

  function initSharedMaterials() {
    if (typeof THREE === 'undefined' || Object.keys(SHARED_MATERIALS).length > 0) return SHARED_MATERIALS;
    const woodTex = createOakWoodTexture();
    const grassTex = createGrassTexture();
    const burgundyTex = createBurgundyClothTexture();
    const PhysicalMat = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
    const defs = {
      // Suelos y Arquitectura (PBR Realista con Clearcoat)
      grassLawn: new PhysicalMat({ color: 0x2d5a27, map: grassTex || null, roughness: 0.85, metalness: 0.05 }),
      houseFloor: new PhysicalMat({ color: 0xc2a679, map: woodTex || null, roughness: 0.25, metalness: 0.08, clearcoat: 0.6 }),
      wallSatin: new PhysicalMat({ color: 0xf1f5f9, roughness: 0.65, metalness: 0.03, clearcoat: 0.2 }),
      wallNavyAccent: new PhysicalMat({ color: 0x1e293b, roughness: 0.55, metalness: 0.08, clearcoat: 0.3 }),
      crownWhite: new PhysicalMat({ color: 0xffffff, roughness: 0.25, metalness: 0.05, clearcoat: 0.6 }),
      baseboardWood: new PhysicalMat({ color: 0x3b1d0e, roughness: 0.25, metalness: 0.08, clearcoat: 0.6 }),

      // Maderas Nobles PBR (clearcoat: 0.6, roughness: 0.25)
      woodOak: new PhysicalMat({ color: 0x7c4a24, roughness: 0.25, metalness: 0.08, clearcoat: 0.6 }),
      woodWalnut: new PhysicalMat({ color: 0x3b1d0e, roughness: 0.25, metalness: 0.10, clearcoat: 0.6 }),
      woodDark: new PhysicalMat({ color: 0x271308, roughness: 0.25, metalness: 0.10, clearcoat: 0.6 }),
      woodPine: new PhysicalMat({ color: 0x854d0e, roughness: 0.28, metalness: 0.06, clearcoat: 0.5 }),
      woodLight: new PhysicalMat({ color: 0xd4a373, roughness: 0.25, metalness: 0.05, clearcoat: 0.6 }),

      // Metales PBR
      metalDark: new PhysicalMat({ color: 0x1e293b, roughness: 0.25, metalness: 0.85, clearcoat: 0.6 }),
      metalChrome: new PhysicalMat({ color: 0xcbd5e1, roughness: 0.12, metalness: 0.94, clearcoat: 0.8 }),
      metalBrass: new PhysicalMat({ color: 0xd97706, roughness: 0.20, metalness: 0.90, clearcoat: 0.6 }),
      ironBlack: new PhysicalMat({ color: 0x111827, roughness: 0.32, metalness: 0.85, clearcoat: 0.4 }),
      mailboxBlue: new PhysicalMat({ color: 0x1d4ed8, roughness: 0.25, metalness: 0.65, clearcoat: 0.6 }),
      mailboxRedFlag: new PhysicalMat({ color: 0xdc2626, emissive: 0x7f1d1d, emissiveIntensity: 0.25, roughness: 0.25, metalness: 0.3, clearcoat: 0.6 }),

      // Telas y Tapicería (incluyendo Mantel Borgoña Texturizado)
      burgundyCloth: new PhysicalMat({ color: 0x881337, map: burgundyTex || null, roughness: 0.72, metalness: 0.04, clearcoat: 0.1 }),
      fabricBlue: new PhysicalMat({ color: 0x1e3a8a, roughness: 0.62, metalness: 0.08 }),
      fabricNavyTufted: new PhysicalMat({ color: 0x172554, roughness: 0.65, metalness: 0.08 }),
      fabricGold: new PhysicalMat({ color: 0xf59e0b, roughness: 0.58, metalness: 0.10 }),
      fabricTerracotta: new PhysicalMat({ color: 0xea580c, roughness: 0.60, metalness: 0.10 }),
      leatherDark: new PhysicalMat({ color: 0x0f172a, roughness: 0.35, metalness: 0.15, clearcoat: 0.45 }),

      // Naturaleza y Vegetación
      trunkBark: new THREE.MeshStandardMaterial({ color: 0x452612, roughness: 0.85, metalness: 0.04 }),
      leafGreen1: new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.78, metalness: 0.02 }),
      leafGreen2: new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.78, metalness: 0.02 }),
      leafGreen3: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.76, metalness: 0.02 }),
      leafGreen4: new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.74, metalness: 0.02 }),
      grassBlade: new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.75, metalness: 0.0 }),
      flowerRed: new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.42, metalness: 0.08 }),
      flowerYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.42, metalness: 0.08 }),
      flowerPink: new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.42, metalness: 0.08 }),
      flowerLavender: new THREE.MeshStandardMaterial({ color: 0xc084fc, roughness: 0.42, metalness: 0.08 }),

      // Piedra, Cerámica PBR y Cerca
      stoneGray: new PhysicalMat({ color: 0x64748b, roughness: 0.70, metalness: 0.10 }),
      stonePaver: new PhysicalMat({ color: 0x94a3b8, roughness: 0.72, metalness: 0.06 }),
      picketWhite: new PhysicalMat({ color: 0xf8fafc, roughness: 0.45, metalness: 0.04, clearcoat: 0.3 }),
      ceramicWhite: new PhysicalMat({ color: 0xffffff, roughness: 0.15, metalness: 0.08, clearcoat: 0.75 }),
      coffeeLiquid: new PhysicalMat({ color: 0x271206, roughness: 0.10, metalness: 0.15, clearcoat: 0.8 }),
      terracottaPot: new PhysicalMat({ color: 0xc2410c, roughness: 0.72, metalness: 0.06 }),
      soilDark: new THREE.MeshStandardMaterial({ color: 0x27170a, roughness: 0.92, metalness: 0.0 }),

      // Vidrio Cristalino PBR (transmission: 0.85, clearcoat: 0.6, roughness: 0.25), Pantallas y Luces
      glassClear: new PhysicalMat({ color: 0xe0f2fe, roughness: 0.12, metalness: 0.05, transmission: 0.85, clearcoat: 0.6, transparent: true, opacity: 0.55 }),
      glassLantern: new PhysicalMat({ color: 0xfffbeb, emissive: 0xfef08a, emissiveIntensity: 0.35, roughness: 0.15, metalness: 0.10, transmission: 0.65, clearcoat: 0.6, transparent: true, opacity: 0.78 }),
      lampShadeWarm: new THREE.MeshStandardMaterial({ color: 0xfef3c7, emissive: 0xf59e0b, emissiveIntensity: 0.65, roughness: 0.35, metalness: 0.05, side: THREE.DoubleSide }),
      emissiveScreen: new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x38bdf8, emissiveIntensity: 0.85, roughness: 0.22 }),
      emissiveBulb: new THREE.MeshStandardMaterial({ color: 0xffedd5, emissive: 0xfef08a, emissiveIntensity: 2.2, roughness: 0.18 }),
      steamTranslucent: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.90, transparent: true, opacity: 0.38 })
    };
    Object.assign(SHARED_MATERIALS, defs);
    return SHARED_MATERIALS;
  }
  if (typeof THREE !== 'undefined') initSharedMaterials();

  // ============================================================================
  // 5. MICRO-INDICADORES HOTSPOTS DISCRETOS Y DOMO ESPACIAL
  // ============================================================================
  function createSpaceDome(targetScene) {
    if (typeof THREE === 'undefined' || typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#040714');
    grad.addColorStop(0.35, '#0a1029');
    grad.addColorStop(0.7, '#11183c');
    grad.addColorStop(1, '#080d21');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 220; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 1.4 + 0.3;
      ctx.globalAlpha = Math.random() * 0.7 + 0.3;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    const tex = new THREE.CanvasTexture(canvas);
    const domeGeo = new THREE.SphereGeometry(75, 32, 24);
    const domeMat = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.BackSide,
      depthWrite: false
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    targetScene.add(dome);
    spaceDomeMesh = dome;
    return dome;
  }

  function createSpatialHotspotForObject(group, vocabKey) {
    if (!group || typeof THREE === 'undefined') return;
    const meta = WORLD3D_VOCAB_CATALOG[vocabKey];
    if (!meta) return;

    const hsGroup = new THREE.Group();
    hsGroup.name = `Hotspot_${vocabKey}`;

    // Micro-indicador sutil (scale: 0.15, opacity: 0.35) sin aros morados invasivos
    const spriteMat = new THREE.SpriteMaterial({
      map: createHotspotTexture(),
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.15, 0.15, 0.15);
    hsGroup.add(sprite);

    const bbox = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    const gx = (group.position && isFinite(group.position.x)) ? group.position.x : 0;
    const gy = (group.position && isFinite(group.position.y)) ? group.position.y : 0;
    const gz = (group.position && isFinite(group.position.z)) ? group.position.z : 0;
    const localX = isFinite(center.x) ? (center.x - gx) : 0;
    const localMaxY = (bbox.max && isFinite(bbox.max.y)) ? (bbox.max.y - gy) : 1.2;
    const localZ = isFinite(center.z) ? (center.z - gz) : 0;
    const height = localMaxY > 0.3 ? localMaxY : 1.2;
    const hotspotY = height + 0.25;

    hsGroup.position.set(localX, hotspotY, localZ);
    hsGroup.userData = Object.assign({}, meta, {
      isHotspot: true,
      parentGroup: group,
      vocabKey: vocabKey,
      baseY: hotspotY,
      interactive: true
    });
    sprite.userData = hsGroup.userData;

    group.hotspot = hsGroup;
    spatialHotspots.push({
      group: hsGroup,
      sprite: sprite,
      ring: null,
      baseY: hotspotY,
      parentGroup: group
    });

    group.add(hsGroup);
    interactiveObjects.push(hsGroup);
  }

  function registerInteractiveGroup(group, vocabKey) {
    const meta = WORLD3D_VOCAB_CATALOG[vocabKey];
    if (!meta || !group) return;
    group.userData = Object.assign({}, meta);
    group.traverse(child => {
      if (child.isMesh) {
        child.userData = Object.assign({}, meta, { parentGroup: group });
      }
    });
    interactiveObjects.push(group);
    createSpatialHotspotForObject(group, vocabKey);
  }

  // ============================================================================
  // 6. CONSTRUCCIÓN DE ESCENARIO PROCEDURAL (CASA Y JARDÍN DE APRENDIZAJE)
  // ============================================================================
  function buildDetailedHouseAndGarden(targetScene) {
    interactiveObjects = [];
    spatialHotspots = [];
    animatedSteamRings = [];
    animatedWindowLeaves = [];
    const M = initSharedMaterials();

    // Domo espacial con gradiente azul profundo
    createSpaceDome(targetScene);

    // --------------------------------------------------------------------------
    // A. TERRENO EXTERIOR Y PLATAFORMA DE CASA ABIERTA (CORTE ISOMÉTRICO)
    // --------------------------------------------------------------------------
    const lawnGeo = new THREE.PlaneGeometry(95, 95, 8, 8);
    const lawn = new THREE.Mesh(lawnGeo, M.grassLawn);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.y = 0;
    lawn.receiveShadow = true;
    targetScene.add(lawn);

    const housePlatform = new THREE.Mesh(new THREE.BoxGeometry(14.0, 0.22, 10.5), M.houseFloor);
    housePlatform.position.set(0, 0.11, -1.75);
    housePlatform.receiveShadow = true;
    housePlatform.castShadow = true;
    targetScene.add(housePlatform);

    const entranceStep1 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 0.65), M.stonePaver);
    entranceStep1.position.set(0, 0.07, 3.65);
    entranceStep1.receiveShadow = true;
    const entranceStep2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.50), M.stonePaver);
    entranceStep2.position.set(0, 0.04, 4.20);
    entranceStep2.receiveShadow = true;
    targetScene.add(entranceStep1, entranceStep2);

    // --------------------------------------------------------------------------
    // PAREDES PERIMETRALES EN CORTE ISOMÉTRICO Y VENTANAS
    // --------------------------------------------------------------------------
    const wallGroup = new THREE.Group();

    const wallBackLeft = new THREE.Mesh(new THREE.BoxGeometry(7.2, 3.7, 0.26), M.wallSatin);
    wallBackLeft.position.set(-3.5, 1.96, -7.0);
    wallBackLeft.castShadow = true;
    wallBackLeft.receiveShadow = true;

    const wallBackRightSide = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.7, 0.26), M.wallSatin);
    wallBackRightSide.position.set(5.7, 1.96, -7.0);
    wallBackRightSide.castShadow = true;
    wallBackRightSide.receiveShadow = true;

    const wallBackWinTop = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.1, 0.26), M.wallSatin);
    wallBackWinTop.position.set(2.1, 3.26, -7.0);
    const wallBackWinBot = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.0, 0.26), M.wallSatin);
    wallBackWinBot.position.set(2.1, 0.61, -7.0);

    const winBackGlass = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.6), M.glassClear);
    winBackGlass.position.set(2.1, 1.96, -6.99);
    const winBackMullionV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.6, 0.06), M.crownWhite);
    winBackMullionV.position.set(2.1, 1.96, -6.98);
    const winBackMullionH = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.06, 0.06), M.crownWhite);
    winBackMullionH.position.set(2.1, 1.96, -6.98);

    const wallLeftA = new THREE.Mesh(new THREE.BoxGeometry(0.26, 3.7, 3.5), M.wallSatin);
    wallLeftA.position.set(-7.0, 1.96, -5.25);
    wallLeftA.castShadow = true;
    wallLeftA.receiveShadow = true;

    const wallLeftB = new THREE.Mesh(new THREE.BoxGeometry(0.26, 2.2, 3.5), M.wallSatin);
    wallLeftB.position.set(-7.0, 1.21, 1.75);
    wallLeftB.castShadow = true;
    wallLeftB.receiveShadow = true;

    const wallLeftTop = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.95, 3.5), M.wallSatin);
    wallLeftTop.position.set(-7.0, 3.33, -1.75);
    const wallLeftBottom = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.05, 3.5), M.wallSatin);
    wallLeftBottom.position.set(-7.0, 0.63, -1.75);

    const winLeft = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.75), M.glassClear);
    winLeft.rotation.y = Math.PI / 2;
    winLeft.position.set(-7.0, 2.0, -1.75);
    const winLeftFrame = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.08, 3.5), M.crownWhite);
    winLeftFrame.position.set(-7.0, 1.15, -1.75);

    const wallRightA = new THREE.Mesh(new THREE.BoxGeometry(0.26, 3.7, 6.8), M.wallSatin);
    wallRightA.position.set(7.0, 1.96, -3.6);
    wallRightA.castShadow = true;
    wallRightA.receiveShadow = true;

    const wallRightCutaway = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.35, 3.7), M.wallSatin);
    wallRightCutaway.position.set(7.0, 0.78, 1.65);
    wallRightCutaway.castShadow = true;

    const wallDivider = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.5, 4.2), M.wallNavyAccent);
    wallDivider.position.set(0.1, 1.86, -4.9);
    wallDivider.castShadow = true;
    wallDivider.receiveShadow = true;

    const frontCutawayLeft = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.45, 0.26), M.wallNavyAccent);
    frontCutawayLeft.position.set(-4.2, 0.44, 3.4);
    const frontCutawayRight = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.45, 0.26), M.wallNavyAccent);
    frontCutawayRight.position.set(4.2, 0.44, 3.4);

    const crown1 = new THREE.Mesh(new THREE.BoxGeometry(14.3, 0.14, 0.32), M.crownWhite);
    crown1.position.set(0, 3.82, -7.0);
    const crown2 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 7.2), M.crownWhite);
    crown2.position.set(-7.0, 3.82, -3.5);
    const crown3 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 7.0), M.crownWhite);
    crown3.position.set(7.0, 3.82, -3.6);

    const base1 = new THREE.Mesh(new THREE.BoxGeometry(13.8, 0.16, 0.06), M.baseboardWood);
    base1.position.set(0, 0.30, -6.84);
    const baseLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 10.2), M.baseboardWood);
    baseLeft.position.set(-6.84, 0.30, -1.75);
    const baseRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 10.2), M.baseboardWood);
    baseRight.position.set(6.84, 0.30, -1.75);

    wallGroup.add(
      wallBackLeft, wallBackRightSide, wallBackWinTop, wallBackWinBot,
      winBackGlass, winBackMullionV, winBackMullionH,
      wallLeftA, wallLeftB, wallLeftTop, wallLeftBottom, winLeft, winLeftFrame,
      wallRightA, wallRightCutaway, wallDivider,
      frontCutawayLeft, frontCutawayRight,
      crown1, crown2, crown3, base1, baseLeft, baseRight
    );
    targetScene.add(wallGroup);

    // Cuadro decorativo y alfombra tejida
    const paintingFrame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, 0.04), M.woodWalnut);
    paintingFrame.position.set(-5.2, 2.35, -6.84);
    const paintingCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(1.38, 0.83),
      new THREE.MeshStandardMaterial({ map: createPaintingTexture(), roughness: 0.4 })
    );
    paintingCanvas.position.set(-5.2, 2.35, -6.81);
    targetScene.add(paintingFrame, paintingCanvas);

    const livingRug = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.018, 3.0),
      new THREE.MeshStandardMaterial({ map: createRugTexture(), roughness: 0.88 })
    );
    livingRug.position.set(-3.6, 0.23, -2.5);
    livingRug.receiveShadow = true;
    targetScene.add(livingRug);

    // --------------------------------------------------------------------------
    // OBJETO: "Window" (Ventana interactiva con animación exterior de hojas/árboles)
    // --------------------------------------------------------------------------
    const windowInteractiveGroup = new THREE.Group();
    windowInteractiveGroup.name = "Window";

    const wFrameOuter = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 3.4), M.crownWhite);
    wFrameOuter.position.set(-6.98, 2.85, -1.75);
    const wFrameSill = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 3.5), M.woodOak);
    wFrameSill.position.set(-6.95, 1.15, -1.75);
    windowInteractiveGroup.add(wFrameOuter, wFrameSill);

    // Árbol y follaje exterior visible a través de la ventana con animación de viento
    const wTreeOutside = new THREE.Group();
    const wTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 3.2, 10), M.trunkBark);
    wTrunk.position.set(-8.2, 1.6, -1.6);
    wTreeOutside.add(wTrunk);

    const leafShades = [M.leafGreen1, M.leafGreen2, M.leafGreen3, M.leafGreen4];
    for (let li = 0; li < 9; li++) {
      const leafCluster = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.42 + (li % 3) * 0.1, 1),
        leafShades[li % leafShades.length]
      );
      leafCluster.position.set(
        -8.2 + (li % 3 - 1) * 0.4,
        1.8 + (li * 0.28),
        -1.6 + ((li % 4) - 1.5) * 0.45
      );
      leafCluster.scale.set(1.15, 0.85, 1.1);
      wTreeOutside.add(leafCluster);
      animatedWindowLeaves.push(leafCluster);
      threeAnimatedObjects.leaves.push(leafCluster);
    }
    windowInteractiveGroup.add(wTreeOutside);
    windowInteractiveGroup.position.set(0, 0, 0);
    targetScene.add(windowInteractiveGroup);
    registerInteractiveGroup(windowInteractiveGroup, 'window');

    // --------------------------------------------------------------------------
    // B. ZONA DE ESTUDIO (STUDY ROOM)
    // --------------------------------------------------------------------------

    // OBJETO 1: "Desk" (Escritorio con laptop interactiva, cajonera y lámpara)
    const deskGroup = new THREE.Group();
    deskGroup.name = "Desk";

    const desktopCore = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 1.05), M.woodOak);
    desktopCore.position.set(0, 0.96, 0);
    desktopCore.castShadow = true;
    desktopCore.receiveShadow = true;

    const frontEdgeBevel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.1, 16), M.woodOak);
    frontEdgeBevel.rotation.z = Math.PI / 2;
    frontEdgeBevel.position.set(0, 0.96, 0.525);
    const backEdgeBevel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.1, 16), M.woodOak);
    backEdgeBevel.rotation.z = Math.PI / 2;
    backEdgeBevel.position.set(0, 0.96, -0.525);
    deskGroup.add(desktopCore, frontEdgeBevel, backEdgeBevel);

    const deskLegCoords = [[-0.92, -0.42], [0.92, -0.42], [-0.92, 0.42], [0.92, 0.42]];
    deskLegCoords.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.022, 0.92, 16), M.metalDark);
      leg.position.set(lx, 0.46, lz);
      leg.castShadow = true;
      const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.024, 0.06, 16), M.metalBrass);
      ferrule.position.set(lx, 0.03, lz);
      deskGroup.add(leg, ferrule);
    });

    const drawerBlock = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.56, 0.92), M.woodOak);
    drawerBlock.position.set(0.68, 0.62, 0);
    drawerBlock.castShadow = true;
    const handle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 12), M.metalBrass);
    handle1.rotation.z = Math.PI / 2;
    handle1.position.set(0.68, 0.74, 0.47);
    const handle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 12), M.metalBrass);
    handle2.rotation.z = Math.PI / 2;
    handle2.position.set(0.68, 0.50, 0.47);

    // Laptop interactiva sobre el escritorio
    const laptopGroup = new THREE.Group();
    laptopGroup.name = "Interactive Laptop";
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.018, 0.32), M.metalDark);
    laptopBase.position.set(-0.12, 1.01, 0.10);
    const laptopKeyboard = new THREE.Mesh(new THREE.PlaneGeometry(0.40, 0.14), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 }));
    laptopKeyboard.rotation.x = -Math.PI / 2;
    laptopKeyboard.position.set(-0.12, 1.02, 0.07);
    const laptopTrackpad = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.08), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 }));
    laptopTrackpad.rotation.x = -Math.PI / 2;
    laptopTrackpad.position.set(-0.12, 1.02, 0.19);

    const laptopLid = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.30, 0.012), M.metalDark);
    laptopLid.position.set(-0.12, 1.15, -0.05);
    laptopLid.rotation.x = -0.22;
    const laptopScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.44, 0.27),
      new THREE.MeshStandardMaterial({ map: createLaptopScreenTexture(), emissive: 0x38bdf8, emissiveIntensity: 0.95, roughness: 0.2 })
    );
    laptopScreen.position.set(-0.12, 1.15, -0.04);
    laptopScreen.rotation.x = -0.22;
    laptopGroup.add(laptopBase, laptopKeyboard, laptopTrackpad, laptopLid, laptopScreen);

    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.016, 0.18), M.metalDark);
    keyboard.position.set(-0.08, 1.01, 0.18);
    const mouse = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), M.metalDark);
    mouse.scale.set(0.8, 0.45, 1.25);
    mouse.position.set(0.32, 1.01, 0.18);

    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.025, 16), M.metalBrass);
    lampBase.position.set(-0.78, 1.01, -0.22);
    const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.44, 10), M.metalBrass);
    lampArm.rotation.z = -0.28;
    lampArm.position.set(-0.72, 1.21, -0.22);
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.17, 16, 1, true), M.metalBrass);
    lampShade.rotation.z = -Math.PI * 0.42;
    lampShade.position.set(-0.60, 1.38, -0.22);
    const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), M.emissiveBulb);
    lampBulb.position.set(-0.60, 1.35, -0.22);

    deskGroup.add(drawerBlock, handle1, handle2, keyboard, mouse, lampBase, lampArm, lampShade, lampBulb, laptopGroup);
    deskGroup.position.set(3.5, 0.22, -3.5);
    targetScene.add(deskGroup);
    registerInteractiveGroup(deskGroup, 'desk');

    // OBJETO 2: "Computer Monitor" (Base, soporte vertical y pantalla emisiva cian)
    const monitorGroup = new THREE.Group();
    monitorGroup.name = "Computer Monitor";

    const mBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.20, 0.018, 24), M.metalDark);
    mBase.position.set(0, 0.01, 0);
    const mStand = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.38, 16), M.metalChrome);
    mStand.position.set(0, 0.19, -0.04);
    const mNeck = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.08), M.metalChrome);
    mNeck.position.set(0, 0.36, 0.0);

    const mFrame = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.58, 0.03), M.metalDark);
    mFrame.position.set(0, 0.46, 0.03);
    mFrame.castShadow = true;

    const screenTex = createLaptopScreenTexture();
    monitorScreenMaterial = new THREE.MeshStandardMaterial({
      map: screenTex || null,
      color: 0x06b6d4,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.90,
      roughness: 0.18,
      metalness: 0.1
    });
    const mScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.91, 0.53), monitorScreenMaterial);
    mScreen.position.set(0, 0.46, 0.047);

    const mLedBar = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.35, 8), M.emissiveScreen);
    mLedBar.rotation.z = Math.PI / 2;
    mLedBar.position.set(0, 0.17, 0.046);

    monitorGroup.add(mBase, mStand, mNeck, mFrame, mScreen, mLedBar);
    monitorGroup.position.set(3.45, 1.22, -3.72);
    targetScene.add(monitorGroup);
    registerInteractiveGroup(monitorGroup, 'computer_monitor');

    // OBJETO 3: "Office Chair" (Base en estrella con ruedas, respaldo ergonómico curvo y reposabrazos)
    const chairGroup = new THREE.Group();
    chairGroup.name = "Office Chair";

    const cSeat = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.10, 0.56), M.fabricBlue);
    cSeat.position.set(0, 0.58, 0);
    cSeat.castShadow = true;

    const cSeatFront = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.58, 12), M.fabricBlue);
    cSeatFront.rotation.z = Math.PI / 2;
    cSeatFront.position.set(0, 0.58, 0.28);

    const cBackGeo = new THREE.CylinderGeometry(0.32, 0.30, 0.62, 20, 1, true, -Math.PI * 0.35, Math.PI * 0.7);
    const cBack = new THREE.Mesh(
      cBackGeo,
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.52, side: THREE.DoubleSide })
    );
    cBack.position.set(0, 0.95, 0.02);
    cBack.castShadow = true;

    const cHeadrest = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.08), M.leatherDark);
    cHeadrest.position.set(0, 1.32, 0.28);

    [-0.31, 0.31].forEach(ax => {
      const armPost = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.24, 10), M.metalDark);
      armPost.position.set(ax, 0.68, 0.04);
      const armPad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.035, 0.28), M.leatherDark);
      armPad.position.set(ax, 0.80, 0.04);
      chairGroup.add(armPost, armPad);
    });

    const cPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 0.38, 16), M.metalChrome);
    cPillar.position.set(0, 0.34, 0);

    for (let i = 0; i < 5; i++) {
      const ang = (i * Math.PI * 2) / 5;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.32, 10), M.metalChrome);
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = -ang;
      spoke.position.set(Math.cos(ang) * 0.16, 0.12, Math.sin(ang) * 0.16);

      const casterWheel = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), M.leatherDark);
      casterWheel.position.set(Math.cos(ang) * 0.30, 0.042, Math.sin(ang) * 0.30);
      chairGroup.add(spoke, casterWheel);
    }

    chairGroup.add(cSeat, cSeatFront, cBack, cHeadrest, cPillar);
    chairGroup.position.set(3.5, 0.22, -2.05);
    chairGroup.rotation.y = 0.15;
    targetScene.add(chairGroup);
    registerInteractiveGroup(chairGroup, 'office_chair');

    // OBJETO 4: "Bookshelf" (Estantería vertical con repisas y libros coleccionables individuales de colores)
    const shelfGroup = new THREE.Group();
    shelfGroup.name = "Bookshelf";

    const sSideL = new THREE.Mesh(new THREE.BoxGeometry(0.46, 3.0, 0.06), M.woodWalnut);
    sSideL.position.set(0, 1.5, -1.0);
    sSideL.castShadow = true;
    const sSideR = new THREE.Mesh(new THREE.BoxGeometry(0.46, 3.0, 0.06), M.woodWalnut);
    sSideR.position.set(0, 1.5, 1.0);
    sSideR.castShadow = true;
    const sBack = new THREE.Mesh(new THREE.BoxGeometry(0.03, 3.0, 2.06), M.woodDark);
    sBack.position.set(0.22, 1.5, 0);
    shelfGroup.add(sSideL, sSideR, sBack);

    const shelfYs = [0.12, 0.85, 1.58, 2.30, 2.95];
    shelfYs.forEach(sy => {
      const shelfPlank = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.045, 1.96), M.woodWalnut);
      shelfPlank.position.set(0, sy, 0);
      shelfPlank.castShadow = true;
      shelfGroup.add(shelfPlank);
    });

    const bookColors = [
      new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0x6d28d9, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.4 })
    ];

    [0.165, 0.895, 1.625].forEach((shelfY, rowIdx) => {
      let currentZ = -0.88;
      const numBooks = 13 + rowIdx * 2;
      for (let b = 0; b < numBooks; b++) {
        const thickness = 0.042 + (b % 3) * 0.014;
        const height = 0.44 + ((b * 7) % 5) * 0.028;
        const depth = 0.32 + (b % 2) * 0.025;
        const bookMat = bookColors[(b + rowIdx * 3) % bookColors.length];

        const book = new THREE.Mesh(new THREE.BoxGeometry(depth, height, thickness), bookMat);
        const tilt = (b === 5 || b === 11) ? 0.16 : 0;
        book.position.set(0.02, shelfY + height / 2, currentZ + thickness / 2);
        book.rotation.x = tilt;
        book.castShadow = true;
        shelfGroup.add(book);
        currentZ += thickness + 0.016;
        if (currentZ > 0.85) break;
      }
    });

    shelfGroup.position.set(6.7, 0.22, -3.5);
    targetScene.add(shelfGroup);
    registerInteractiveGroup(shelfGroup, 'bookshelf');

    // --------------------------------------------------------------------------
    // C. ZONA DE SALA DE ESTAR (LIVING ROOM)
    // --------------------------------------------------------------------------

    // OBJETO 5: "Sofa" (Sofá acolchado con cojines individuales y de contraste)
    const sofaGroup = new THREE.Group();
    sofaGroup.name = "Sofa";

    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.22, 1.05), M.woodWalnut);
    sofaBase.position.set(0, 0.20, 0);
    sofaBase.castShadow = true;
    sofaGroup.add(sofaBase);

    [[-1.15, -0.42], [1.15, -0.42], [-1.15, 0.42], [1.15, 0.42]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.016, 0.20, 12), M.woodWalnut);
      leg.position.set(lx, 0.09, lz);
      sofaGroup.add(leg);
    });

    [-0.75, 0, 0.75].forEach(cx => {
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.18, 0.88), M.fabricNavyTufted);
      cushion.position.set(cx, 0.38, 0.06);
      cushion.castShadow = true;
      sofaGroup.add(cushion);
    });

    const sofaBackrest = new THREE.Mesh(new THREE.BoxGeometry(2.68, 0.65, 0.26), M.fabricNavyTufted);
    sofaBackrest.position.set(0, 0.72, -0.40);
    sofaBackrest.castShadow = true;
    sofaGroup.add(sofaBackrest);

    [-1.38, 1.38].forEach(ax => {
      const armrest = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.44, 1.05), M.fabricNavyTufted);
      armrest.position.set(ax, 0.50, 0.02);
      armrest.castShadow = true;
      sofaGroup.add(armrest);
    });

    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.14), M.fabricGold);
    pillow1.position.set(-1.05, 0.52, -0.15);
    pillow1.rotation.y = 0.42;
    pillow1.rotation.z = -0.12;

    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.14), M.fabricTerracotta);
    pillow2.position.set(1.05, 0.52, -0.15);
    pillow2.rotation.y = -0.42;
    pillow2.rotation.z = 0.12;
    sofaGroup.add(pillow1, pillow2);

    sofaGroup.position.set(-3.6, 0.22, -4.1);
    targetScene.add(sofaGroup);
    registerInteractiveGroup(sofaGroup, 'sofa');

    // OBJETO: "Armchair" (Sillón de lectura ergonómico en la zona de descanso)
    const armchairGroup = new THREE.Group();
    armchairGroup.name = "Armchair";
    const acSeat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.85), M.fabricTerracotta);
    acSeat.position.set(0, 0.44, 0);
    acSeat.castShadow = true;
    const acBack = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.75, 0.22), M.fabricTerracotta);
    acBack.position.set(0, 0.82, -0.32);
    acBack.castShadow = true;
    const acArmL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.82), M.fabricTerracotta);
    acArmL.position.set(-0.44, 0.58, 0);
    const acArmR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.82), M.fabricTerracotta);
    acArmR.position.set(0.44, 0.58, 0);
    [[-0.34, -0.34], [0.34, -0.34], [-0.34, 0.34], [0.34, 0.34]].forEach(([px, pz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.02, 0.34, 12), M.woodWalnut);
      leg.position.set(px, 0.17, pz);
      leg.castShadow = true;
      armchairGroup.add(leg);
    });
    armchairGroup.add(acSeat, acBack, acArmL, acArmR);
    armchairGroup.position.set(-5.6, 0.22, -0.8);
    armchairGroup.rotation.y = 0.55;
    targetScene.add(armchairGroup);
    registerInteractiveGroup(armchairGroup, 'armchair');

    // OBJETO 6: "Coffee Table" (Mesa de centro baja con taza de cerámica humeante)
    const tableGroup = new THREE.Group();
    tableGroup.name = "Coffee Table";

    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.065, 0.95), M.woodOak);
    tableTop.position.set(0, 0.45, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;

    const tEdgeF = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.6, 16), M.woodOak);
    tEdgeF.rotation.z = Math.PI / 2;
    tEdgeF.position.set(0, 0.45, 0.475);
    const tEdgeB = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.6, 16), M.woodOak);
    tEdgeB.rotation.z = Math.PI / 2;
    tEdgeB.position.set(0, 0.45, -0.475);
    tableGroup.add(tableTop, tEdgeF, tEdgeB);

    [[-0.68, -0.36], [0.68, -0.36], [-0.68, 0.36], [0.68, 0.36]].forEach(([tx, tz]) => {
      const tLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.016, 0.42, 12), M.ironBlack);
      tLeg.position.set(tx, 0.21, tz);
      tLeg.castShadow = true;
      tableGroup.add(tLeg);
    });

    const mugBody = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.13, 16), M.ceramicWhite);
    mugBody.position.set(0.18, 0.54, 0.08);
    mugBody.castShadow = true;
    const mugLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.01, 16), M.coffeeLiquid);
    mugLiquid.position.set(0.18, 0.59, 0.08);
    const mugHandle = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 8, 16, Math.PI), M.ceramicWhite);
    mugHandle.position.set(0.245, 0.54, 0.08);
    mugHandle.rotation.y = -Math.PI / 2;
    tableGroup.add(mugBody, mugLiquid, mugHandle);

    for (let s = 0; s < 3; s++) {
      const steamRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.022 + s * 0.008, 0.006, 6, 12),
        M.steamTranslucent
      );
      steamRing.rotation.x = Math.PI / 2;
      const baseSy = 0.64 + s * 0.05;
      steamRing.position.set(0.18, baseSy, 0.08);
      steamRing.userData = { baseY: baseSy, phase: s * 1.2 };
      tableGroup.add(steamRing);
      animatedSteamRings.push(steamRing);
      threeAnimatedObjects.steam.push(steamRing);
    }

    tableGroup.position.set(-3.6, 0.22, -2.0);
    targetScene.add(tableGroup);
    registerInteractiveGroup(tableGroup, 'coffee_table');

    // OBJETO 7: "Floor Lamp" (Lámpara de pie alta con pantalla cálida y PointLight real)
    const lampGroup = new THREE.Group();
    lampGroup.name = "Floor Lamp";

    const flBase = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.045, 24), M.metalBrass);
    flBase.position.set(0, 0.025, 0);
    flBase.castShadow = true;
    const flPole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 1.95, 16), M.metalBrass);
    flPole.position.set(0, 1.0, 0);
    flPole.castShadow = true;

    floorLampShadeMat = M.lampShadeWarm.clone();
    const flShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.36, 0.42, 24, 1, true),
      floorLampShadeMat
    );
    flShade.position.set(0, 1.95, 0);

    const flBulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), M.emissiveBulb);
    flBulb.position.set(0, 1.92, 0);

    floorLampPointLight = new THREE.PointLight(0xffaa44, 2.4, 12.0);
    floorLampPointLight.position.set(0, 1.90, 0);
    floorLampPointLight.castShadow = true;
    floorLampPointLight.shadow.bias = -0.001;

    lampGroup.add(flBase, flPole, flShade, flBulb, floorLampPointLight);
    lampGroup.position.set(-5.8, 0.22, -4.5);
    targetScene.add(lampGroup);
    registerInteractiveGroup(lampGroup, 'floor_lamp');

    // OBJETO 8: "Clock" / "Wall Clock" (Reloj de pared analógico con manecillas animadas)
    const clockGroup = new THREE.Group();
    clockGroup.name = "Wall Clock";

    const clFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.07, 32), M.woodDark);
    clFrame.rotation.x = Math.PI / 2;
    clFrame.position.set(0, 0, 0);
    clFrame.castShadow = true;

    const clFaceMat = new THREE.MeshStandardMaterial({
      map: createClockFaceTexture(),
      roughness: 0.35,
      metalness: 0.05
    });
    const clFace = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.015, 32), clFaceMat);
    clFace.rotation.x = Math.PI / 2;
    clFace.position.set(0, 0, 0.038);

    const clHour = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.22, 0.01), M.metalDark);
    clHour.position.set(0, 0.08, 0.048);
    clHour.rotation.z = -Math.PI / 3;
    animatedClockHourHand = clHour;

    const clMinute = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.32, 0.01), M.metalDark);
    clMinute.position.set(0, 0.12, 0.05);
    clMinute.rotation.z = Math.PI / 4;
    animatedClockMinuteHand = clMinute;

    const clCenterCap = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.02, 16), M.metalBrass);
    clCenterCap.rotation.x = Math.PI / 2;
    clCenterCap.position.set(0, 0, 0.055);

    clockGroup.add(clFrame, clFace, clHour, clMinute, clCenterCap);
    clockGroup.position.set(-3.6, 2.65, -6.84);
    targetScene.add(clockGroup);
    registerInteractiveGroup(clockGroup, 'wall_clock');

    // OBJETO 9: "Indoor Plant" (Planta de interior en maceta de terracota)
    const plantGroup = new THREE.Group();
    plantGroup.name = "Indoor Plant";

    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.16, 0.48, 16), M.terracottaPot);
    pot.position.set(0, 0.24, 0);
    pot.castShadow = true;
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16), M.soilDark);
    soil.position.set(0, 0.46, 0);
    plantGroup.add(pot, soil);

    for (let l = 0; l < 11; l++) {
      const ang = (l * Math.PI * 2) / 7 + l * 0.35;
      const leafMat = [M.leafGreen1, M.leafGreen2, M.leafGreen3][l % 3];
      const leafMesh = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.45, 5), leafMat);
      leafMesh.position.set(Math.cos(ang) * 0.09, 0.58 + (l % 4) * 0.06, Math.sin(ang) * 0.09);
      leafMesh.rotation.y = ang;
      leafMesh.rotation.x = 0.55 + (l % 3) * 0.15;
      leafMesh.castShadow = true;
      plantGroup.add(leafMesh);
    }

    plantGroup.position.set(-1.2, 0.22, -5.5);
    targetScene.add(plantGroup);
    registerInteractiveGroup(plantGroup, 'indoor_plant');

    // Ventilador de techo interior
    const fanGroup = new THREE.Group();
    const fanPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 12), M.metalBrass);
    fanPillar.position.set(0, 3.4, 0);
    const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), M.metalBrass);
    fanHub.position.set(0, 3.1, 0);
    const fanRotor = new THREE.Group();
    fanRotor.position.set(0, 3.1, 0);
    for (let b = 0; b < 4; b++) {
      const ang = (b * Math.PI * 2) / 4;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.015, 0.14), M.woodWalnut);
      blade.position.set(Math.cos(ang) * 0.42, 0, Math.sin(ang) * 0.42);
      blade.rotation.y = -ang;
      blade.rotation.z = 0.12;
      fanRotor.add(blade);
    }
    fanGroup.add(fanPillar, fanHub, fanRotor);
    fanGroup.position.set(0, 0, -1.8);
    targetScene.add(fanGroup);
    animatedFan = fanRotor;
    threeAnimatedObjects.fan = fanRotor;

    // --------------------------------------------------------------------------
    // D. JARDÍN EXTERIOR (GARDEN & YARD)
    // --------------------------------------------------------------------------

    // OBJETO 10: "Oak Tree" (Árbol con tronco orgánico y copas de esferas facetadas en distintos verdes)
    const treePositions = [
      { x: -8.5, z: 7.5, scale: 1.15, primary: true },
      { x: 8.5, z: 6.8, scale: 1.05, primary: false },
      { x: -7.5, z: 12.8, scale: 0.90, primary: false }
    ];

    let primaryTreeGroup = null;
    treePositions.forEach(tp => {
      const tGroup = new THREE.Group();
      tGroup.name = tp.primary ? "Oak Tree" : "Tree";

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.32 * tp.scale, 0.52 * tp.scale, 3.6 * tp.scale, 8), M.trunkBark);
      trunk.position.y = 1.8 * tp.scale;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      tGroup.add(trunk);

      const foliageClusters = [
        { y: 3.8, r: 1.55, mat: M.leafGreen2, ox: 0, oz: 0 },
        { y: 4.8, r: 1.35, mat: M.leafGreen1, ox: 0.25, oz: -0.2 },
        { y: 3.5, r: 1.10, mat: M.leafGreen3, ox: -0.65, oz: 0.4 },
        { y: 3.6, r: 1.15, mat: M.leafGreen4, ox: 0.7, oz: 0.3 }
      ];

      foliageClusters.forEach(fc => {
        const sphere = new THREE.Mesh(new THREE.DodecahedronGeometry(fc.r * tp.scale, 1), fc.mat);
        sphere.position.set(fc.ox * tp.scale, fc.y * tp.scale, fc.oz * tp.scale);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        tGroup.add(sphere);
      });

      tGroup.position.set(tp.x, 0, tp.z);
      targetScene.add(tGroup);

      if (tp.primary) {
        primaryTreeGroup = tGroup;
      }
    });

    if (primaryTreeGroup) {
      registerInteractiveGroup(primaryTreeGroup, 'oak_tree');
    }

    // Camino de baldosas de piedra desiguales (Stone Path)
    const pathGroup = new THREE.Group();
    pathGroup.name = "Stone Path";
    const pathCoords = [
      [-0.4, 4.6, 0.44], [0.35, 5.5, 0.48], [-0.25, 6.4, 0.42], [0.30, 7.3, 0.50],
      [-0.35, 8.2, 0.46], [0.20, 9.1, 0.45], [-0.15, 10.0, 0.48], [0.10, 11.0, 0.46]
    ];
    pathCoords.forEach(([px, pz, pr], idx) => {
      const paver = new THREE.Mesh(new THREE.CylinderGeometry(pr, pr * 1.05, 0.05, 7), M.stonePaver);
      paver.position.set(px, 0.025, pz);
      paver.rotation.y = idx * 0.75;
      paver.receiveShadow = true;
      pathGroup.add(paver);
    });
    targetScene.add(pathGroup);

    // Cerca perimetral de estacas blancas (Picket Fence)
    const fenceGroup = new THREE.Group();
    fenceGroup.name = "Picket Fence";
    function createPicketSection(startX, startZ, endX, endZ, numPickets) {
      const section = new THREE.Group();
      const dx = (endX - startX) / numPickets;
      const dz = (endZ - startZ) / numPickets;
      const angle = Math.atan2(endZ - startZ, endX - startX);

      for (let p = 0; p <= numPickets; p++) {
        const picket = new THREE.Group();
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.03), M.picketWhite);
        post.position.y = 0.425;
        post.castShadow = true;
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.12, 4), M.picketWhite);
        tip.position.y = 0.91;
        tip.rotation.y = Math.PI / 4;
        picket.add(post, tip);
        picket.position.set(startX + dx * p, 0, startZ + dz * p);
        picket.rotation.y = -angle;
        section.add(picket);
      }
      return section;
    }
    fenceGroup.add(createPicketSection(-9.5, 14.5, -1.8, 14.5, 14));
    fenceGroup.add(createPicketSection(1.8, 14.5, 9.5, 14.5, 14));
    targetScene.add(fenceGroup);

    // OBJETO 11: "Park Bench" (Banca de jardín: listones de madera de roble y soportes laterales de hierro negro)
    const benchGroup = new THREE.Group();
    benchGroup.name = "Park Bench";

    [-0.85, 0.85].forEach(bx => {
      const legA = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.06), M.ironBlack);
      legA.position.set(bx, 0.24, -0.22);
      legA.castShadow = true;
      const legB = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.06), M.ironBlack);
      legB.position.set(bx, 0.24, 0.22);
      legB.castShadow = true;
      const backPost = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.52, 0.05), M.ironBlack);
      backPost.position.set(bx, 0.65, -0.22);
      backPost.rotation.x = -0.15;
      const seatBrace = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.48), M.ironBlack);
      seatBrace.position.set(bx, 0.44, 0);
      benchGroup.add(legA, legB, backPost, seatBrace);
    });

    [-0.16, -0.05, 0.06, 0.17].forEach(sz => {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.032, 0.08), M.woodOak);
      slat.position.set(0, 0.47, sz);
      slat.castShadow = true;
      benchGroup.add(slat);
    });

    [0.55, 0.66, 0.77].forEach((by, idx) => {
      const bSlat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.07, 0.028), M.woodOak);
      bSlat.position.set(0, by, -0.22 - idx * 0.02);
      bSlat.rotation.x = -0.15;
      bSlat.castShadow = true;
      benchGroup.add(bSlat);
    });

    benchGroup.position.set(-4.5, 0, 7.5);
    benchGroup.rotation.y = 0.32;
    targetScene.add(benchGroup);
    registerInteractiveGroup(benchGroup, 'park_bench');

    // OBJETO 12: "Street Lantern" (Farol de jardín clásico de hierro con cristal cálido y SpotLight proyectada)
    const lanternGroup = new THREE.Group();
    lanternGroup.name = "Street Lantern";

    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.18, 16), M.ironBlack);
    plinth.position.y = 0.09;
    plinth.castShadow = true;

    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.10, 2.7, 16), M.ironBlack);
    column.position.y = 1.53;
    column.castShadow = true;

    const ringDeco = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 8, 16), M.ironBlack);
    ringDeco.rotation.x = Math.PI / 2;
    ringDeco.position.y = 2.95;

    const crossBar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.52, 10), M.ironBlack);
    crossBar.rotation.z = Math.PI / 2;
    crossBar.position.y = 2.82;

    const glassCage = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.15, 0.40, 6), M.glassLantern);
    glassCage.position.y = 3.28;

    const lanternCap = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.25, 6), M.ironBlack);
    lanternCap.position.y = 3.58;

    streetLanternBulbMat = M.emissiveBulb.clone();
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), streetLanternBulbMat);
    bulb.position.y = 3.28;

    const spot = new THREE.SpotLight(0xffedd5, 3.0, 15.0, Math.PI / 3.2, 0.55, 1.2);
    spot.position.set(0, 3.28, 0);
    spot.target.position.set(-0.8, 0, 0.5);
    spot.castShadow = true;
    spot.shadow.mapSize.width = 512;
    spot.shadow.mapSize.height = 512;
    streetLanternSpotLight = spot;

    streetLanternPointLight = new THREE.PointLight(0xffedd5, 1.4, 9.0);
    streetLanternPointLight.position.set(0, 3.25, 0);

    lanternGroup.add(plinth, column, ringDeco, crossBar, glassCage, lanternCap, bulb, spot, spot.target, streetLanternPointLight);
    lanternGroup.position.set(2.4, 0, 6.5);
    targetScene.add(lanternGroup);
    registerInteractiveGroup(lanternGroup, 'street_lantern');

    // OBJETO 13: "Flower Bush" (Arbustos florales con pequeñas flores esféricas coloridas)
    const bushesMasterGroup = new THREE.Group();
    bushesMasterGroup.name = "Flower Bush";

    [
      { x: 5.8, z: 5.8, s: 1.05 },
      { x: -5.8, z: 4.8, s: 0.95 },
      { x: 5.2, z: 9.2, s: 0.90 }
    ].forEach(bp => {
      const bushCluster = new THREE.Group();

      const coreLobe = new THREE.Mesh(new THREE.DodecahedronGeometry(0.82 * bp.s, 1), M.leafGreen2);
      coreLobe.position.set(0, 0.58 * bp.s, 0);
      coreLobe.scale.set(1.25, 0.82, 1.15);
      coreLobe.castShadow = true;
      coreLobe.receiveShadow = true;

      const sideLobe1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.58 * bp.s, 1), M.leafGreen3);
      sideLobe1.position.set(0.55 * bp.s, 0.45 * bp.s, 0.25 * bp.s);
      sideLobe1.castShadow = true;

      const sideLobe2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55 * bp.s, 1), M.leafGreen1);
      sideLobe2.position.set(-0.52 * bp.s, 0.42 * bp.s, -0.20 * bp.s);
      sideLobe2.castShadow = true;

      bushCluster.add(coreLobe, sideLobe1, sideLobe2);

      const flowerPalette = [M.flowerRed, M.flowerYellow, M.flowerPink, M.flowerLavender];
      for (let f = 0; f < 22; f++) {
        const blossom = new THREE.Mesh(
          new THREE.SphereGeometry(0.055 * bp.s, 8, 8),
          flowerPalette[f % flowerPalette.length]
        );
        const theta = (f * 1.42) % (Math.PI * 2);
        const phi = 0.22 + (f * 0.19) % (Math.PI * 0.42);
        blossom.position.set(
          Math.sin(phi) * Math.cos(theta) * 0.88 * bp.s,
          (0.56 + Math.cos(phi) * 0.52) * bp.s,
          Math.sin(phi) * Math.sin(theta) * 0.82 * bp.s
        );
        bushCluster.add(blossom);
      }

      bushCluster.position.set(bp.x, 0, bp.z);
      bushesMasterGroup.add(bushCluster);
    });

    targetScene.add(bushesMasterGroup);
    registerInteractiveGroup(bushesMasterGroup, 'flower_bush');

    // OBJETO 14: "Mailbox" (Buzón americano en la entrada con banderilla roja lateral)
    const mailboxGroup = new THREE.Group();
    mailboxGroup.name = "Mailbox";

    const mbPost = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.15, 0.14), M.woodOak);
    mbPost.position.set(0, 0.575, 0);
    mbPost.castShadow = true;

    const mbCrossArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.10, 0.48), M.woodOak);
    mbCrossArm.position.set(0, 1.05, 0.08);

    const mbBrace = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.08), M.woodOak);
    mbBrace.rotation.x = -Math.PI / 4;
    mbBrace.position.set(0, 0.90, 0.14);

    const mbBoxLower = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.62), M.mailboxBlue);
    mbBoxLower.position.set(0, 1.19, 0.10);
    mbBoxLower.castShadow = true;

    const mbVaultTop = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.62, 16), M.mailboxBlue);
    mbVaultTop.rotation.x = Math.PI / 2;
    mbVaultTop.position.set(0, 1.28, 0.10);
    mbVaultTop.castShadow = true;

    const mbDoor = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.02, 16), M.metalChrome);
    mbDoor.rotation.x = Math.PI / 2;
    mbDoor.position.set(0, 1.28, 0.415);
    const mbHandle = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 8, 12, Math.PI), M.metalChrome);
    mbHandle.position.set(0, 1.32, 0.425);

    const flagStem = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.28, 0.03), M.mailboxRedFlag);
    flagStem.position.set(0.175, 1.34, 0.22);
    const flagBanner = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.09, 0.13), M.mailboxRedFlag);
    flagBanner.position.set(0.175, 1.45, 0.27);
    const flagPivot = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 12), M.metalChrome);
    flagPivot.rotation.z = Math.PI / 2;
    flagPivot.position.set(0.17, 1.22, 0.22);

    mailboxGroup.add(mbPost, mbCrossArm, mbBrace, mbBoxLower, mbVaultTop, mbDoor, mbHandle, flagStem, flagBanner, flagPivot);
    mailboxGroup.position.set(2.1, 0, 11.8);
    targetScene.add(mailboxGroup);
    registerInteractiveGroup(mailboxGroup, 'mailbox');

    // Aspersor de riego animado
    const sprinklerGroup = new THREE.Group();
    const spBase = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.08, 16), M.metalDark);
    spBase.position.y = 0.04;
    const spHead = new THREE.Group();
    const spStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.16), M.metalBrass);
    spStem.position.y = 0.12;
    spHead.add(spStem);
    for (let s = 0; s < 3; s++) {
      const a = (s * Math.PI * 2) / 3;
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.24), M.metalBrass);
      arm.position.set(Math.cos(a) * 0.12, 0.20, Math.sin(a) * 0.12);
      arm.rotation.y = a;
      arm.rotation.z = Math.PI / 4;
      spHead.add(arm);
    }
    sprinklerGroup.add(spBase, spHead);
    sprinklerGroup.position.set(-2.0, 0, 9.2);
    targetScene.add(sprinklerGroup);
    animatedSprinkler = spHead;
    threeAnimatedObjects.sprinkler = spHead;
  }

  // ============================================================================
  // 6B. CATÁLOGO DE 7 MUNDOS EN WORLD_TOUR_SCENARIOS Y buildCompound3DObject
  // ============================================================================
  const WORLD_TOUR_SCENARIOS = {
    house: {
      id: 'house',
      title: '🏠 House & Study Rooms',
      bg: 0x0a0e17,
      fogDensity: 0.005,
      cameraPos: { x: 0, y: 10.8, z: 16.8 },
      cameraLookAt: { x: 0, y: 1.3, z: -0.5 },
      zones: {
        overview: { pos: { x: 0, y: 10.8, z: 16.8 }, lookAt: { x: 0, y: 1.3, z: -0.5 }, label: '🏠 Vista General' },
        zone1: { pos: { x: -3.6, y: 4.5, z: 2.2 }, lookAt: { x: -3.6, y: 1.2, z: -3.8 }, label: '🛋️ Ir a la Sala' },
        zone2: { pos: { x: 3.5, y: 4.3, z: 1.8 }, lookAt: { x: 3.6, y: 1.3, z: -3.4 }, label: '💻 Ir al Estudio' },
        zone3: { pos: { x: 0, y: 5.8, z: 19.2 }, lookAt: { x: 0, y: 1.2, z: 7.2 }, label: '🌳 Ir al Jardín' }
      },
      objects: [
        { id: 'desk', en: 'Desk', ipa: '/desk/', es: 'Escritorio con Laptop', category: 'Study Room', example: 'I practice English code and grammar on my wooden desk with my laptop.', pos: [3.5, 0.22, -3.5] },
        { id: 'computer_monitor', en: 'Computer Monitor', ipa: '/kəmˈpjuː.t̬ɚ ˈmɑː.nə.t̬ɚ/', es: 'Monitor de Computadora', category: 'Study Room', example: 'The computer monitor glows with interactive English code and lessons.', pos: [3.45, 1.22, -3.72] },
        { id: 'office_chair', en: 'Office Chair', ipa: '/ˈɑː.fɪs tʃer/', es: 'Silla de Oficina Ergonómica', category: 'Study Room', example: 'This ergonomic office chair has a comfortable curved backrest and wheels.', pos: [3.5, 0.22, -2.05] },
        { id: 'bookshelf', en: 'Bookshelf', ipa: '/ˈbʊk.ʃelf/', es: 'Librero / Estantería', category: 'Study Room', example: 'The wooden bookshelf is filled with colorful collectible English novels.', pos: [6.7, 0.22, -3.5] },
        { id: 'house_bed', en: 'Bed', ipa: '/bed/', es: 'Cama con Almohadas', category: 'Study & Bedroom', example: 'I read an English chapter before going to sleep in my comfortable bed.', pos: [1.8, 0.22, 1.2] },
        { id: 'house_refrigerator', en: 'Refrigerator', ipa: '/rɪˈfrɪdʒ.ə.reɪ.t̬ɚ/', es: 'Refrigerador / Nevera', category: 'Kitchen & Home', example: 'Keep the fresh milk and fruit cold inside the stainless steel refrigerator.', pos: [-1.4, 0.22, -5.8] },
        { id: 'window', en: 'Window', ipa: '/ˈwɪn.doʊ/', es: 'Ventanal Panorámico', category: 'Living Room', example: 'The large window provides a beautiful view of the swaying green trees.', pos: [-6.95, 1.15, -1.75] },
        { id: 'sofa', en: 'Sofa / Couch', ipa: '/ˈsoʊ.fə/', es: 'Sofá / Sillón', category: 'Living Room', example: 'I relax on the cozy sofa after studying English vocabulary.', pos: [-3.6, 0.22, -4.1] },
        { id: 'armchair', en: 'Armchair', ipa: '/ˈɑːrm.tʃer/', es: 'Sillón de Lectura', category: 'Living Room', example: 'I sit in the comfortable armchair by the window to read English stories.', pos: [-5.6, 0.22, -0.8] },
        { id: 'coffee_table', en: 'Coffee Table', ipa: '/ˈkɑː.fi ˌteɪ.bəl/', es: 'Mesa de Centro', category: 'Living Room', example: 'There is a warm ceramic coffee mug resting on the coffee table.', pos: [-3.6, 0.22, -2.0] },
        { id: 'floor_lamp', en: 'Floor Lamp', ipa: '/flɔːr læmp/', es: 'Lámpara de Pie', category: 'Living Room', example: 'The tall floor lamp illuminates the living room with a warm golden glow.', pos: [-5.8, 0.22, -4.5] },
        { id: 'wall_clock', en: 'Clock', ipa: '/klɑːk/', es: 'Reloj de Pared', category: 'Living Room', example: 'I check the ticking wall clock to start my daily English session on time.', pos: [-3.6, 2.65, -6.84] },
        { id: 'indoor_plant', en: 'Indoor Plant', ipa: '/ˈɪn.dɔːr plænt/', es: 'Planta de Interior', category: 'Living Room', example: 'The green indoor plant in the terracotta pot makes the room feel fresh.', pos: [-1.2, 0.22, -4.2] }
      ]
    },
    garden: {
      id: 'garden',
      title: '🌿 Backyard & Garden',
      bg: 0x0a0e17,
      fogDensity: 0.005,
      cameraPos: { x: 0, y: 6.2, z: 19.5 },
      cameraLookAt: { x: 0, y: 1.2, z: 7.2 },
      zones: {
        overview: { pos: { x: 0, y: 6.5, z: 20.2 }, lookAt: { x: 0, y: 1.2, z: 7.2 }, label: '🌿 Vista General' },
        zone1: { pos: { x: -5.2, y: 3.6, z: 12.8 }, lookAt: { x: -5.5, y: 1.2, z: 7.5 }, label: '🌳 Zona 1: Árboles y Banca' },
        zone2: { pos: { x: 4.8, y: 3.6, z: 13.5 }, lookAt: { x: 4.2, y: 1.0, z: 8.5 }, label: '🔥 Zona 2: Asador y Fuente' },
        zone3: { pos: { x: 0, y: 3.4, z: 16.5 }, lookAt: { x: 0, y: 1.0, z: 9.2 }, label: '🪨 Camino y Aspersor' }
      },
      objects: [
        { id: 'oak_tree', en: 'Oak Tree', ipa: '/oʊk triː/', es: 'Árbol de Roble', category: 'Garden & Yard', example: 'The tall oak tree provides cool shade over the green lawn.', pos: [-8.5, 0, 7.5] },
        { id: 'park_bench', en: 'Park Bench', ipa: '/pɑːrk bentʃ/', es: 'Banca de Jardín', category: 'Garden & Yard', example: 'We sat on the wooden park bench to practice English conversation.', pos: [-4.5, 0, 7.5] },
        { id: 'garden_bbq_grill', en: 'Barbecue Grill', ipa: '/ˈbɑːr.bə.kjuː ɡrɪl/', es: 'Asador / Parrilla BBQ', category: 'Garden & Yard', example: 'We cooked burgers and vegetables on the outdoor barbecue grill.', pos: [4.2, 0, 8.6] },
        { id: 'garden_sprinkler', en: 'Lawn Sprinkler', ipa: '/lɔːn ˈsprɪŋ.klɚ/', es: 'Aspersor de Riego', category: 'Garden & Yard', example: 'The rotating lawn sprinkler waters the fresh green grass.', pos: [-2.0, 0, 9.2] },
        { id: 'street_lantern', en: 'Street Lantern', ipa: '/striːt ˈlæn.tɚn/', es: 'Farol de Jardín', category: 'Garden & Yard', example: 'The classic street lantern lights up the stone path at night.', pos: [2.4, 0, 6.5] },
        { id: 'garden_stone_path', en: 'Stone Path', ipa: '/stoʊn pæθ/', es: 'Camino de Piedra', category: 'Garden & Yard', example: 'Follow the stepping stone path from the gate to the front door.', pos: [0.2, 0.05, 8.2] },
        { id: 'flower_bush', en: 'Flower Bush', ipa: '/ˈflaʊ.ɚ bʊʃ/', es: 'Arbusto Floral', category: 'Garden & Yard', example: 'Colorful blossoms grow on the green flower bush near the porch.', pos: [5.8, 0, 5.8] },
        { id: 'mailbox', en: 'Mailbox', ipa: '/ˈmeɪl.bɑːks/', es: 'Buzón de Correo', category: 'Garden & Yard', example: 'I raised the red flag on the mailbox to send a letter.', pos: [2.1, 0, 11.8] },
        { id: 'garden_picket_fence', en: 'Picket Fence', ipa: '/ˈpɪk.ɪt fens/', es: 'Cerca Blanca de Madera', category: 'Garden & Yard', example: 'A white picket fence surrounds the front yard.', pos: [-4.5, 0, 14.5] },
        { id: 'garden_birdhouse', en: 'Birdhouse', ipa: '/ˈbɝːd.haʊs/', es: 'Casita para Pájaros', category: 'Garden & Yard', example: 'Bluebirds built a nest inside the wooden birdhouse.', pos: [-6.8, 0, 10.2] },
        { id: 'garden_watering_can', en: 'Watering Can', ipa: '/ˈwɑː.t̬ɚ.ɪŋ kæn/', es: 'Regadera de Jardín', category: 'Garden & Yard', example: 'Use the metal watering can to water the roses.', pos: [-3.2, 0, 11.4] },
        { id: 'garden_fountain', en: 'Garden Fountain', ipa: '/ˈɡɑːr.dən ˈfaʊn.tən/', es: 'Fuente de Agua', category: 'Garden & Yard', example: 'The stone garden fountain makes a relaxing water sound.', pos: [6.4, 0, 11.2] }
      ]
    },
    dating: {
      id: 'dating',
      title: '🕯️ Romantic Date & Bistro 3D',
      bg: 0x070b14,
      fogDensity: 0.008,
      cameraPos: { x: 0, y: 4.8, z: 8.6 },
      cameraLookAt: { x: 0, y: 1.25, z: -0.3 },
      zones: {
        overview: { pos: { x: 0, y: 4.8, z: 8.6 }, lookAt: { x: 0, y: 1.25, z: -0.3 }, label: '🕯️ Vista General' },
        zone1: { pos: { x: 0.0, y: 2.35, z: 2.75 }, lookAt: { x: 0, y: 1.15, z: 0 }, label: '🍷 Zona 1: Mesa Romántica' },
        zone2: { pos: { x: 2.2, y: 2.5, z: 1.8 }, lookAt: { x: 1.2, y: 1.25, z: -1.8 }, label: '🤵 Zona 2: Mesero IA' },
        zone3: { pos: { x: -2.2, y: 2.8, z: 1.5 }, lookAt: { x: -1.2, y: 1.6, z: -5.2 }, label: '🎻 Balcón y Violín' }
      },
      objects: [
        { id: 'dating_table_for_two', en: 'Table for Two', ipa: '/ˈteɪ.bəl fɔːr tuː/', es: 'Mesa Íntima para Dos con Mantel Borgoña', category: 'Romantic Date', example: 'I reserved a romantic table for two on the rooftop terrace.', pos: [0, 0, 0] },
        { id: 'dating_candlelight', en: 'Candlelight', ipa: '/ˈkæn.dəl.laɪt/', es: 'Vela Encendida con Luz Cálida', category: 'Romantic Date', example: 'We enjoyed a quiet dinner by warm candlelight on the starry terrace.', pos: [0, 0.99, 0] },
        { id: 'dating_wine_glasses', en: 'Wine Glasses', ipa: '/waɪn ˈɡlæs.ɪz/', es: 'Dos Copas de Cristal PBR', category: 'Romantic Date', example: 'They clinked their wine glasses and made a toast in English.', pos: [0.26, 0.99, 0.26] },
        { id: 'dating_menu', en: 'Menu', ipa: '/ˈmen.juː/', es: 'Menú Bilingüe del Bistró', category: 'Romantic Date', example: 'Could we see the dinner menu and the wine list, please?', pos: [-0.34, 0.99, 0.28] },
        { id: 'dating_rose_bouquet', en: 'Rose Bouquet', ipa: '/roʊz buˈkeɪ/', es: 'Ramo de Rosas Rojas', category: 'Romantic Date', example: 'A fresh red rose bouquet decorated the center of our table.', pos: [0, 0.99, -0.32] },
        { id: 'dating_violin', en: 'Violin', ipa: '/ˌvaɪəˈlɪn/', es: 'Violín Acústico de Serenata', category: 'Romantic Date', example: 'A romantic violin melody played softly under the stars.', pos: [-3.4, 0, -2.2] },
        { id: 'dating_city_balcony', en: 'City View Balcony', ipa: '/ˈsɪt̬.i vjuː ˈbæl.kə.ni/', es: 'Balcón con Skyline Nocturno Iluminado', category: 'Romantic Date', example: 'We stepped out onto the city view balcony to admire the skyline.', pos: [0, 0, -5.2] },
        { id: 'dating_waiter_npc', en: 'Waiter NPC', ipa: '/ˈweɪ.t̬ɚ/', es: 'Mesero 3D Interactivo', category: 'Romantic Date', example: 'Our friendly waiter recommended the chef’s special tonight.', pos: [2.8, 0, -2.4] },
        { id: 'dating_chocolate_dessert', en: 'Chocolate Dessert', ipa: '/ˈtʃɑː.klət dɪˈzɝːt/', es: 'Postre de Chocolate Gourmet', category: 'Romantic Date', example: 'Would you like to share this warm chocolate dessert with me?', pos: [0.24, 0.99, -0.26] },
        { id: 'dating_conversation_cards', en: 'Conversation Cards', ipa: '/ˌkɑːn.vɚˈseɪ.ʃən kɑːrdz/', es: 'Tarjetas Románticas (Icebreakers)', category: 'Romantic Date', example: 'These conversation cards have great questions to get to know each other.', pos: [-0.32, 0.99, -0.26] },
        { id: 'dating_ice_bucket', en: 'Ice Bucket', ipa: '/aɪs ˈbʌk.ɪt/', es: 'Cubeta de Hielo y Espumoso', category: 'Romantic Date', example: 'The sparkling cider is chilling in the silver ice bucket.', pos: [-2.15, 0, -1.25] },
        { id: 'dating_string_lights', en: 'String Lights', ipa: '/strɪŋ laɪts/', es: 'Guirnalda de Luces de Terraza', category: 'Romantic Date', example: 'Golden string lights glowed above the bistro terrace all night.', pos: [3.6, 0, -2.8] }
      ]
    },
    space: {
      id: 'space',
      title: '🚀 Outer Space & Astronomy',
      bg: 0x020617,
      fogDensity: 0.0025,
      cameraPos: { x: 0, y: 11.5, z: 18.5 },
      cameraLookAt: { x: 0, y: 1.8, z: 0 },
      zones: {
        overview: { pos: { x: 0, y: 11.5, z: 18.5 }, lookAt: { x: 0, y: 1.8, z: 0 }, label: '🚀 Vista General' },
        zone1: { pos: { x: 0, y: 5.5, z: 8.2 }, lookAt: { x: 0, y: 2.2, z: 0 }, label: '☀️ Zona 1: Sol y Tierra' },
        zone2: { pos: { x: 7.5, y: 5.8, z: 9.5 }, lookAt: { x: 5.5, y: 2.2, z: -1.5 }, label: '🪐 Zona 2: Saturno y Agujero Negro' },
        zone3: { pos: { x: -6.5, y: 5.8, z: 9.2 }, lookAt: { x: -4.5, y: 2.8, z: 1.0 }, label: '👩‍🚀 Nave y Telescopio' }
      },
      objects: [
        { id: 'space_sun', en: 'Sun', ipa: '/sʌn/', es: 'Sol Brillante Central', category: 'Outer Space', example: 'The Sun is the glowing star at the center of our solar system.', pos: [0, 2.2, 0], orbitRadius: 0, orbitSpeed: 0, rotSpeed: 0.45 },
        { id: 'space_earth', en: 'Earth', ipa: '/ɝːθ/', es: 'Planeta Tierra', category: 'Outer Space', example: 'Earth is our home planet with blue oceans and green continents.', pos: [4.2, 2.2, 0], orbitRadius: 4.2, orbitSpeed: 0.38, orbitPhase: 0.4, rotSpeed: 1.2 },
        { id: 'space_moon', en: 'Moon', ipa: '/muːn/', es: 'La Luna (Satélite Natural)', category: 'Outer Space', example: 'The Moon orbits around the Earth approximately every twenty-eight days.', pos: [5.4, 2.6, 1.2], orbitRadius: 5.3, orbitSpeed: 0.52, orbitPhase: 1.1, rotSpeed: 0.8 },
        { id: 'space_mars', en: 'Mars', ipa: '/mɑːrz/', es: 'Marte (El Planeta Rojo)', category: 'Outer Space', example: 'Mars is known as the Red Planet because of iron oxide on its surface.', pos: [-6.4, 2.2, 2.0], orbitRadius: 6.7, orbitSpeed: 0.28, orbitPhase: 2.6, rotSpeed: 1.0 },
        { id: 'space_saturn', en: 'Saturn & Rings', ipa: '/ˈsæt̬.ɚn ænd rɪŋz/', es: 'Saturno con Anillos', category: 'Outer Space', example: 'Saturn & Rings are famous for their spectacular icy ring system.', pos: [8.8, 2.4, -3.5], orbitRadius: 9.4, orbitSpeed: 0.18, orbitPhase: 5.1, rotSpeed: 0.7 },
        { id: 'space_spacecraft', en: 'Spacecraft', ipa: '/ˈspeɪs.kræft/', es: 'Nave Espacial / Cohete', category: 'Outer Space', example: 'The spacecraft ignited its engines to travel beyond Earth orbit.', pos: [-3.5, 3.6, 5.2], orbitRadius: 6.2, orbitSpeed: 0.44, orbitPhase: 3.8, rotSpeed: 0.5 },
        { id: 'space_telescope', en: 'Telescope', ipa: '/ˈtel.ə.skoʊp/', es: 'Telescopio Espacial Orbital', category: 'Outer Space', example: 'The space telescope captures deep infrared images of distant galaxies.', pos: [-7.5, 3.8, -4.2], orbitRadius: 8.6, orbitSpeed: 0.15, orbitPhase: 4.0, rotSpeed: 0.35 },
        { id: 'space_astronaut', en: 'Astronaut', ipa: '/ˈæs.trə.nɑːt/', es: 'Astronauta en Caminata Espacial', category: 'Outer Space', example: 'The astronaut wore a pressurized suit during the spacewalk.', pos: [2.6, 3.4, 5.8], orbitRadius: 6.3, orbitSpeed: 0.22, orbitPhase: 1.7, rotSpeed: 0.4 },
        { id: 'space_asteroid', en: 'Asteroid', ipa: '/ˈæs.tə.rɔɪd/', es: 'Asteroide Rocoso', category: 'Outer Space', example: 'A metallic asteroid tumbled silently through the asteroid belt.', pos: [7.2, 1.8, 5.2], orbitRadius: 8.8, orbitSpeed: 0.31, orbitPhase: 0.9, rotSpeed: 1.6 },
        { id: 'space_black_hole', en: 'Black Hole', ipa: '/ˌblæk ˈhoʊl/', es: 'Agujero Negro Supermasivo', category: 'Outer Space', example: 'Nothing, not even light, can escape the event horizon of a black hole.', pos: [6.8, 3.8, -6.2], orbitRadius: 0, orbitSpeed: 0, rotSpeed: 1.8 },
        { id: 'space_satellite', en: 'Satellite', ipa: '/ˈsæt̬.əl.aɪt/', es: 'Satélite de Comunicaciones', category: 'Outer Space', example: 'The solar-powered satellite relays global communication signals.', pos: [-4.8, 4.0, -5.0], orbitRadius: 6.9, orbitSpeed: 0.35, orbitPhase: 2.1, rotSpeed: 0.6 },
        { id: 'space_axial_rotation', en: 'Axial Rotation', ipa: '/ˈæk.si.əl roʊˈteɪ.ʃən/', es: 'Rotación Axial Planetaria', category: 'Outer Space', example: 'A planet’s axial rotation determines the length of its day.', pos: [-8.8, 1.4, 4.5], orbitRadius: 0, orbitSpeed: 0, rotSpeed: 1.5 },
        { id: 'space_gravity', en: 'Gravity', ipa: '/ˈɡræv.ə.t̬i/', es: 'Campo de Gravedad Orbital', category: 'Outer Space', example: 'Gravity is the invisible force that keeps planets in orbit around stars.', pos: [8.8, 1.2, 4.8], orbitRadius: 0, orbitSpeed: 0, rotSpeed: 0.9 }
      ]
    },
    supermarket: {
      id: 'supermarket',
      title: '🛒 Supermarket',
      bg: 0x0f172a,
      fogDensity: 0.005,
      cameraPos: { x: 0, y: 8.8, z: 14.2 },
      cameraLookAt: { x: 0, y: 1.2, z: -1.0 },
      zones: {
        overview: { pos: { x: 0, y: 8.8, z: 14.2 }, lookAt: { x: 0, y: 1.2, z: -1.0 }, label: '🛒 Vista General' },
        zone1: { pos: { x: -3.5, y: 4.2, z: 5.8 }, lookAt: { x: -3.2, y: 1.2, z: -2.2 }, label: '🍎 Zona 1: Frescos y Panadería' },
        zone2: { pos: { x: 3.2, y: 3.8, z: 7.5 }, lookAt: { x: 3.0, y: 1.0, z: 2.5 }, label: '💳 Zona 2: Cajas y Escáner' },
        zone3: { pos: { x: 2.5, y: 4.2, z: 3.2 }, lookAt: { x: 3.2, y: 1.2, z: -3.2 }, label: '🥛 Lácteos y Congelados' }
      },
      objects: [
        { id: 'market_shopping_cart', en: 'Shopping Cart', ipa: '/ˈʃɑː.pɪŋ kɑːrt/', es: 'Carrito de Compras', category: 'Supermarket', example: 'I pushed the metal shopping cart down the main grocery aisle.', pos: [-2.8, 0, 3.2] },
        { id: 'market_cash_register', en: 'Cash Register', ipa: '/ˈkæʃ ˌredʒ.ɪ.stɚ/', es: 'Caja Registradora', category: 'Supermarket', example: 'The cashier rang up our items on the digital cash register.', pos: [3.2, 1.08, 2.8] },
        { id: 'market_barcode_scanner', en: 'Barcode Scanner', ipa: '/ˈbɑːr.koʊd ˈskæn.ɚ/', es: 'Escáner de Código de Barras', category: 'Supermarket', example: 'Pass the product over the laser barcode scanner to check the price.', pos: [2.1, 1.08, 3.0] },
        { id: 'market_fresh_produce', en: 'Fresh Produce', ipa: '/freʃ ˈproʊ.duːs/', es: 'Sección de Frutas y Verduras', category: 'Supermarket', example: 'Organic apples, lettuce, and tomatoes are in the fresh produce display.', pos: [-4.8, 0, -1.2] },
        { id: 'market_bakery', en: 'Bakery', ipa: '/ˈbeɪ.kɚ.i/', es: 'Panadería', category: 'Supermarket', example: 'We bought warm baguettes and croissants from the bakery counter.', pos: [-1.6, 0, -4.2] },
        { id: 'market_dairy_section', en: 'Dairy Section', ipa: '/ˈder.i ˈsek.ʃən/', es: 'Sección de Lácteos', category: 'Supermarket', example: 'Cold milk, butter, and yogurt are kept in the refrigerated dairy section.', pos: [2.0, 0, -4.2] },
        { id: 'market_frozen_aisle', en: 'Frozen Aisle', ipa: '/ˈfroʊ.zən aɪl/', es: 'Pasillo de Congelados', category: 'Supermarket', example: 'Ice cream and frozen vegetables are stored in the glass frozen aisle.', pos: [5.2, 0, -1.2] },
        { id: 'market_scale', en: 'Scale', ipa: '/skeɪl/', es: 'Báscula de Peso', category: 'Supermarket', example: 'Place the fruit on the scale to measure its weight in pounds or kilos.', pos: [-2.4, 0, -0.8] },
        { id: 'market_shopping_basket', en: 'Shopping Basket', ipa: '/ˈʃɑː.pɪŋ ˈbæs.kɪt/', es: 'Canasta de Compras', category: 'Supermarket', example: 'Carry a hand shopping basket when you only need a few groceries.', pos: [-0.8, 0, 3.8] },
        { id: 'market_price_tag', en: 'Price Tag', ipa: '/ˈpraɪs tæɡ/', es: 'Etiqueta de Precio y Oferta', category: 'Supermarket', example: 'Look at the yellow price tag to see the twenty percent discount.', pos: [-4.8, 1.65, 1.2] },
        { id: 'market_receipt', en: 'Receipt', ipa: '/rɪˈsiːt/', es: 'Recibo / Ticket de Compra', category: 'Supermarket', example: 'Would you like your printed receipt in the bag or with you?', pos: [4.1, 1.08, 3.1] },
        { id: 'market_checkout', en: 'Checkout', ipa: '/ˈtʃek.aʊt/', es: 'Línea de Caja / Checkout', category: 'Supermarket', example: 'Place your groceries on the moving belt at the express checkout.', pos: [3.0, 0, 2.8] }
      ]
    },
    hotel: {
      id: 'hotel',
      title: '🏨 Hotel & Reception',
      bg: 0x0c1220,
      fogDensity: 0.005,
      cameraPos: { x: 0, y: 8.2, z: 14.0 },
      cameraLookAt: { x: 0, y: 1.4, z: -1.0 },
      zones: {
        overview: { pos: { x: 0, y: 8.2, z: 14.0 }, lookAt: { x: 0, y: 1.4, z: -1.0 }, label: '🏨 Vista General' },
        zone1: { pos: { x: 0, y: 3.4, z: 3.2 }, lookAt: { x: 0, y: 1.2, z: -3.5 }, label: '🛎️ Zona 1: Recepción' },
        zone2: { pos: { x: 3.8, y: 3.6, z: 6.8 }, lookAt: { x: 3.6, y: 1.2, z: -0.5 }, label: '🧳 Zona 2: Equipaje y Elevador' },
        zone3: { pos: { x: -3.8, y: 3.6, z: 5.5 }, lookAt: { x: -4.0, y: 1.1, z: -1.0 }, label: '🛋️ Lobby y Check-in' }
      },
      objects: [
        { id: 'hotel_receptionist_desk', en: 'Receptionist Desk', ipa: '/rɪˈsep.ʃən.ɪst desk/', es: 'Mostrador de Recepción', category: 'Hotel & Reception', example: 'Welcome! Please check in at the main receptionist desk.', pos: [0, 0, -3.5] },
        { id: 'hotel_room_keycard', en: 'Room Keycard', ipa: '/ruːm ˈkiː.kɑːrd/', es: 'Tarjeta Llave de Habitación', category: 'Hotel & Reception', example: 'Here is your magnetic room keycard for suite 402 on the fourth floor.', pos: [-0.8, 1.12, -3.1] },
        { id: 'hotel_luggage_cart', en: 'Luggage Cart', ipa: '/ˈlʌɡ.ɪdʒ kɑːrt/', es: 'Carrito de Equipaje Dorado', category: 'Hotel & Reception', example: 'The bellhop placed our bags on the brass luggage cart.', pos: [3.8, 0, 1.2] },
        { id: 'hotel_suitcase', en: 'Suitcase', ipa: '/ˈsuːt.keɪs/', es: 'Maletas de Viaje', category: 'Hotel & Reception', example: 'My rolling suitcase fits easily in the overhead compartment.', pos: [2.5, 0, 2.4] },
        { id: 'hotel_elevator', en: 'Elevator', ipa: '/ˈel.ə.veɪ.t̬ɚ/', es: 'Puertas de Elevador', category: 'Hotel & Reception', example: 'Press the up button to call the glass hotel elevator.', pos: [5.2, 0, -3.8] },
        { id: 'hotel_bellhop_bell', en: 'Bellhop Bell', ipa: '/ˈbel.hɑːp bel/', es: 'Campana de Botones', category: 'Hotel & Reception', example: 'Ring the golden bellhop bell on the counter for service.', pos: [0.65, 1.12, -3.1] },
        { id: 'hotel_lobby_sofa', en: 'Lobby Sofa', ipa: '/ˈlɑː.bi ˈsoʊ.fə/', es: 'Sofá de Lobby', category: 'Hotel & Reception', example: 'Please have a seat on the plush lobby sofa while we prepare your room.', pos: [-4.2, 0, 1.0] },
        { id: 'hotel_chandelier', en: 'Chandelier', ipa: '/ˌʃæn.dəˈlɪr/', es: 'Candelabro de Cristal', category: 'Hotel & Reception', example: 'A grand crystal chandelier illuminates the entire hotel lobby.', pos: [0, 4.4, -0.5] },
        { id: 'hotel_checkin_terminal', en: 'Check-in Terminal', ipa: '/ˈtʃek.ɪn ˈtɝː.mə.nəl/', es: 'Terminal Digital de Check-in', category: 'Hotel & Reception', example: 'Use the touch-screen check-in terminal for fast express registration.', pos: [-3.8, 0, -3.2] },
        { id: 'hotel_concierge', en: 'Concierge', ipa: '/ˌkɑːn.siˈerʒ/', es: 'Módulo de Conserjería Turística', category: 'Hotel & Reception', example: 'Our hotel concierge can book city tours, taxis, and theater tickets.', pos: [3.6, 0, -2.2] },
        { id: 'hotel_safe_box', en: 'Safe Box', ipa: '/seɪf bɑːks/', es: 'Caja Fuerte de Seguridad', category: 'Hotel & Reception', example: 'Enter a four-digit PIN code to lock the electronic safe box.', pos: [-5.2, 0, -1.5] },
        { id: 'hotel_passport', en: 'Passport', ipa: '/ˈpæs.pɔːrt/', es: 'Pasaporte Internacional', category: 'Hotel & Reception', example: 'May I see your passport and booking confirmation, please?', pos: [0.05, 1.12, -3.05] }
      ]
    },
    restaurant: {
      id: 'restaurant',
      title: '🍽️ Fine Restaurant',
      bg: 0x100c18,
      fogDensity: 0.006,
      cameraPos: { x: 0, y: 8.0, z: 13.5 },
      cameraLookAt: { x: 0, y: 1.2, z: -0.8 },
      zones: {
        overview: { pos: { x: 0, y: 8.0, z: 13.5 }, lookAt: { x: 0, y: 1.2, z: -0.8 }, label: '🍽️ Vista General' },
        zone1: { pos: { x: 0, y: 3.2, z: 4.5 }, lookAt: { x: 0, y: 1.0, z: 0.8 }, label: '🥂 Zona 1: Comedor Gourmet' },
        zone2: { pos: { x: 0, y: 3.8, z: 1.5 }, lookAt: { x: -1.2, y: 1.2, z: -4.2 }, label: '👨‍🍳 Zona 2: Estación del Chef' },
        zone3: { pos: { x: 3.5, y: 3.4, z: 5.8 }, lookAt: { x: 3.2, y: 1.0, z: 0.5 }, label: '🍰 Postres y Barra' }
      },
      objects: [
        { id: 'rest_dining_table', en: 'Dining Table', ipa: '/ˈdaɪ.nɪŋ ˈteɪ.bəl/', es: 'Mesa Vestida de Comedor', category: 'Fine Restaurant', example: 'Our dining table is ready near the warm ambient lamps.', pos: [0, 0, 0.8] },
        { id: 'rest_chef_station', en: 'Chef Station', ipa: '/ʃef ˈsteɪ.ʃən/', es: 'Estación del Chef', category: 'Fine Restaurant', example: 'The executive chef garnishes every plate at the chef station.', pos: [0, 0, -4.5] },
        { id: 'rest_menu', en: 'Menu', ipa: '/ˈmen.juː/', es: 'Menú Gourmet', category: 'Fine Restaurant', example: 'Our sommelier and chef prepared a seasonal tasting menu tonight.', pos: [-0.55, 0.98, 1.15] },
        { id: 'rest_main_course', en: 'Main Course', ipa: '/meɪn kɔːrs/', es: 'Plato Fuerte / Principal', category: 'Fine Restaurant', example: 'For the main course, I would like the grilled steak with herbs.', pos: [-0.4, 0.98, 0.65] },
        { id: 'rest_appetizer', en: 'Appetizer', ipa: '/ˈæp.ə.taɪ.zɚ/', es: 'Entrada / Aperitivo Gourmet', category: 'Fine Restaurant', example: 'Would you care to start with a warm appetizer before dinner?', pos: [0.42, 0.98, 0.65] },
        { id: 'rest_cutlery', en: 'Cutlery', ipa: '/ˈkʌt.lɚ.i/', es: 'Cubiertos de Plata', category: 'Fine Restaurant', example: 'The polished silver cutlery is placed neatly beside each plate.', pos: [-0.75, 0.96, 0.85] },
        { id: 'rest_bill_folder', en: 'Bill Folder', ipa: '/bɪl ˈfoʊl.dɚ/', es: 'Carpeta de Cuenta', category: 'Fine Restaurant', example: 'Place your credit card inside the leather bill folder when ready.', pos: [-0.20, 0.96, 1.25] },
        { id: 'rest_kitchen_pass', en: 'Kitchen Pass', ipa: '/ˈkɪtʃ.ən pæs/', es: 'Barra de Cocina', category: 'Fine Restaurant', example: 'Waiters pick up hot dishes directly from the illuminated kitchen pass.', pos: [-3.8, 0, -3.8] },
        { id: 'rest_napkin', en: 'Napkin', ipa: '/ˈnæp.kɪn/', es: 'Servilleta de Tela Doblada', category: 'Fine Restaurant', example: 'Could you bring us an extra cloth napkin, please?', pos: [0.75, 0.98, 0.85] },
        { id: 'rest_beverage', en: 'Beverage', ipa: '/ˈbev.rɪdʒ/', es: 'Bebida / Copa Refrescante', category: 'Fine Restaurant', example: 'What kind of cold beverage would you like with your meal?', pos: [0.28, 1.02, 1.18] },
        { id: 'rest_reserved_sign', en: 'Reserved Sign', ipa: '/rɪˈzɝːvd saɪn/', es: 'Letrero de Mesa Reservada', category: 'Fine Restaurant', example: 'This VIP table has a golden reserved sign on top.', pos: [-3.6, 0.96, 1.2] },
        { id: 'rest_dessert_cart', en: 'Dessert Cart', ipa: '/dɪˈzɝːt kɑːrt/', es: 'Carrito de Postres', category: 'Fine Restaurant', example: 'Choose your favorite cake from our rolling dessert cart.', pos: [3.6, 0, 1.4] }
      ]
    }
  };
  global.WORLD_TOUR_SCENARIOS = WORLD_TOUR_SCENARIOS;

  // Registrar automáticamente todos los objetos de los 7 mundos en WORLD3D_VOCAB_CATALOG
  Object.keys(WORLD_TOUR_SCENARIOS).forEach(scenKey => {
    const scen = WORLD_TOUR_SCENARIOS[scenKey];
    if (!scen || !Array.isArray(scen.objects)) return;
    scen.objects.forEach(obj => {
      const px = obj.pos ? obj.pos[0] : 0;
      const py = obj.pos ? obj.pos[1] : 0;
      const pz = obj.pos ? obj.pos[2] : 0;
      if (!WORLD3D_VOCAB_CATALOG[obj.id]) {
        WORLD3D_VOCAB_CATALOG[obj.id] = {
          interactive: true,
          id: obj.id,
          wordEn: obj.en,
          phonetic: obj.ipa,
          wordEs: obj.es,
          category: obj.category || scen.title,
          example: obj.example,
          en: obj.en,
          ipa: obj.ipa,
          es: obj.es,
          focusPos: { x: px + (px >= 0 ? -1.8 : 1.8), y: Math.max(2.2, py + 2.0), z: pz + 2.8 },
          lookAtPos: { x: px, y: Math.max(0.8, py + 0.6), z: pz }
        };
      }
    });
  });

  // Limpieza profunda de memoria WebGL (RAM & GPU Optimization para iOS Safari y cambios de escenario)
  function disposeScenarioMemory(rootObj) {
    if (!rootObj) return;
    const sharedMats = new Set(Object.values(SHARED_MATERIALS));
    const persistentTextures = new Set([
      cachedWoodTexture,
      cachedOakWoodTexture,
      cachedGrassTexture,
      cachedBlackboardTexture,
      cachedLaptopScreenTexture,
      cachedPaintingTexture,
      cachedClockTexture,
      cachedRugTexture,
      cachedBurgundyTexture,
      cachedHotspotTexture
    ]);
    rootObj.traverse(child => {
      try {
        if (child.geometry) {
          const geometry = child.geometry;
          if (typeof geometry.dispose === 'function') {
            geometry.dispose();
          }
        }
        if (child.material) {
          const matList = Array.isArray(child.material) ? child.material : [child.material];
          matList.forEach(material => {
            if (material && !sharedMats.has(material)) {
              if (material.map && !persistentTextures.has(material.map) && typeof material.map.dispose === 'function') {
                try { material.map.dispose(); } catch (e) {}
              }
              if (typeof material.dispose === 'function') {
                try { material.dispose(); } catch (e) {}
              }
            }
          });
        }
      } catch (err) {}
    });
    while (rootObj.children.length > 0) {
      rootObj.remove(rootObj.children[0]);
    }
  }

  // Constructor modular de objetos 3D compuestos (THREE.Group + userData = { id, en, ipa, es, category, example })
  function buildCompound3DObject(itemSpec, scenarioKey) {
    if (typeof THREE === 'undefined' || !itemSpec) return null;
    const M = initSharedMaterials();
    const PhysicalMat = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
    const group = new THREE.Group();
    group.name = itemSpec.en || itemSpec.id;
    const id = itemSpec.id || '';
    const enLower = (itemSpec.en || '').toLowerCase();

    const matGold = M.metalBrass;
    const matSilver = M.metalChrome;
    const matDark = M.metalDark;
    const matWood = M.woodOak;
    const matWalnut = M.woodWalnut;
    const matWhite = M.ceramicWhite;
    const matRed = new PhysicalMat({ color: 0xe11d48, roughness: 0.25, metalness: 0.12, clearcoat: 0.6 });
    const matRosePink = new PhysicalMat({ color: 0xf43f5e, emissive: 0x881337, emissiveIntensity: 0.2, roughness: 0.28, clearcoat: 0.5 });
    const matVelvet = M.burgundyCloth || new PhysicalMat({ color: 0x9f1239, roughness: 0.65, metalness: 0.08 });
    const matEmerald = new PhysicalMat({ color: 0x10b981, roughness: 0.28, metalness: 0.1, clearcoat: 0.6 });
    const matSky = new PhysicalMat({ color: 0x0ea5e9, roughness: 0.25, metalness: 0.2, clearcoat: 0.6 });

    // --- MUNDO DATING (ROMANTIC DATE & BISTRO 3D) ---
    if (id === 'dating_table_for_two' || enLower.includes('table for two') || id === 'rest_dining_table') {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.08, 24), matDark);
      base.position.y = 0.04;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.90, 16), matDark);
      pole.position.y = 0.48;
      const topWood = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.05, 32), matWalnut);
      topWood.position.y = 0.94;
      const cloth = new THREE.Mesh(new THREE.CylinderGeometry(0.97, 1.04, 0.16, 32), id === 'dating_table_for_two' ? matVelvet : matWhite);
      cloth.position.y = 0.90;
      group.add(base, pole, topWood, cloth);

      // Comida modelada en 3D sobre los platos (corte de filete/salmón, guarnición verde y puré gourmet)
      const steakMat = new PhysicalMat({ color: 0x7c2d12, roughness: 0.35, clearcoat: 0.45 });
      const salmonMat = new PhysicalMat({ color: 0xfb7185, roughness: 0.30, clearcoat: 0.5 });
      const garnishMat = new PhysicalMat({ color: 0x16a34a, roughness: 0.45 });
      const mashMat = new PhysicalMat({ color: 0xfef3c7, roughness: 0.5 });

      [-0.56, 0.56].forEach((px, pIdx) => {
        const plateGroup = new THREE.Group();
        const dinnerPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.16, 0.022, 24), matWhite);
        dinnerPlate.position.y = 0.011;
        const proteinCut = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.038, 0.09), pIdx === 0 ? steakMat : salmonMat);
        proteinCut.position.set(-0.02, 0.035, 0.02);
        proteinCut.rotation.y = 0.25;
        const sideMash = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 12), mashMat);
        sideMash.scale.set(1, 0.65, 1);
        sideMash.position.set(0.065, 0.032, -0.04);
        const garnish1 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.11, 8), garnishMat);
        garnish1.rotation.z = Math.PI / 2;
        garnish1.rotation.y = 0.4;
        garnish1.position.set(0.02, 0.035, 0.065);
        const garnish2 = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), matRed);
        garnish2.position.set(-0.07, 0.032, -0.05);
        plateGroup.add(dinnerPlate, proteinCut, sideMash, garnish1, garnish2);
        plateGroup.position.set(px, 0.98, 0);
        group.add(plateGroup);
      });

      // Sillas ubicadas exactamente en x: -1.25, z: 0 (Izquierda) y x: 1.25, z: 0 (Derecha), asiento y: 0.48
      [-1.25, 1.25].forEach((cx, idx) => {
        const chair = new THREE.Group();
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.06, 0.50), matVelvet);
        seat.position.y = 0.45;
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.58, 0.06), matVelvet);
        back.position.set(0, 0.77, -0.22);
        [[-0.20, -0.20], [0.20, -0.20], [-0.20, 0.20], [0.20, 0.20]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.016, 0.44, 10), matGold);
          leg.position.set(lx, 0.22, lz);
          chair.add(leg);
        });
        chair.add(seat, back);
        chair.position.set(cx, 0, 0);
        chair.rotation.y = idx === 0 ? Math.PI / 2 : -Math.PI / 2;
        group.add(chair);
      });
    } else if (id === 'dating_candlelight') {
      const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, 0.05, 20), matGold);
      holder.position.y = 0.025;
      const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.052, 0.24, 16), matWhite);
      wax.position.y = 0.16;
      const flameMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, emissive: 0xff9900, emissiveIntensity: 3.2, roughness: 0.1 });
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.095, 12), flameMat);
      flame.position.y = 0.32;
      candleFlameMesh = flame;
      const cLight = new THREE.PointLight(0xff9933, 2.5, 10.0);
      cLight.position.set(0, 0.38, 0);
      candleFlameLight = cLight;
      group.add(holder, wax, flame, cLight);
    } else if (id === 'dating_wine_glasses' || id === 'rest_beverage') {
      [-0.12, 0.12].forEach(gx => {
        const g = new THREE.Group();
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.012, 16), M.glassClear);
        foot.position.y = 0.006;
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14, 10), M.glassClear);
        stem.position.y = 0.08;
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.02, 0.13, 16), M.glassClear);
        cup.position.y = 0.21;
        const wine = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.018, 0.075, 14), matRed);
        wine.position.y = 0.195;
        g.add(foot, stem, cup, wine);
        g.position.x = gx;
        group.add(g);
      });
    } else if (id === 'dating_menu' || id === 'rest_menu' || id === 'rest_bill_folder' || id === 'hotel_passport') {
      const coverColor = id === 'hotel_passport' ? 0x1e3a8a : (id === 'rest_bill_folder' ? 0x1c1917 : 0x3b0764);
      const coverMat = new PhysicalMat({ color: coverColor, roughness: 0.28, metalness: 0.15, clearcoat: 0.6 });
      const pageLeft = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.016, 0.26), coverMat);
      pageLeft.position.set(-0.09, 0.02, 0);
      pageLeft.rotation.z = 0.08;
      const pageRight = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.016, 0.26), coverMat);
      pageRight.position.set(0.09, 0.02, 0);
      pageRight.rotation.z = -0.08;
      const innerSheet = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.01, 0.22), matWhite);
      innerSheet.position.set(0, 0.03, 0);
      const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.022, 0.26), matGold);
      goldTrim.position.set(0, 0.022, 0);
      group.add(pageLeft, pageRight, innerSheet, goldTrim);
    } else if (id === 'dating_rose_bouquet') {
      const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.055, 0.22, 16), M.glassClear);
      vase.position.y = 0.11;
      group.add(vase);
      for (let r = 0; r < 6; r++) {
        const ang = (r * Math.PI * 2) / 6;
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.26, 8), M.leafGreen2);
        stem.position.set(Math.cos(ang) * 0.028, 0.20, Math.sin(ang) * 0.028);
        const bud = new THREE.Mesh(new THREE.DodecahedronGeometry(0.045, 1), matRed);
        bud.position.set(Math.cos(ang) * 0.05, 0.33 + (r % 2) * 0.022, Math.sin(ang) * 0.05);
        group.add(stem, bud);
      }
    } else if (id === 'dating_violin') {
      const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.05, 16), matDark);
      standBase.position.y = 0.025;
      const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 1.05, 12), matGold);
      standPole.position.y = 0.55;
      const bodyLower = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.06, 20), matWood);
      bodyLower.rotation.x = Math.PI / 2;
      bodyLower.position.set(0, 1.05, 0.05);
      const bodyUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.06, 20), matWood);
      bodyUpper.rotation.x = Math.PI / 2;
      bodyUpper.position.set(0, 1.28, 0.05);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.03), matWalnut);
      neck.position.set(0, 1.56, 0.05);
      const bow = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.62, 8), matGold);
      bow.rotation.z = -Math.PI / 3;
      bow.position.set(0.08, 1.22, 0.10);
      group.add(standBase, standPole, bodyLower, bodyUpper, neck, bow);
    } else if (id === 'dating_chocolate_dessert' || id === 'rest_main_course' || id === 'rest_appetizer') {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.022, 24), matWhite);
      plate.position.y = 0.012;
      const cakeMat = new PhysicalMat({ color: id === 'rest_main_course' ? 0x92400e : (id === 'rest_appetizer' ? 0x15803d : 0x3b1d0e), roughness: 0.28, clearcoat: 0.55 });
      const food = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.11, 0.085, 20), cakeMat);
      food.position.y = 0.058;
      const ganache = new THREE.Mesh(new THREE.CylinderGeometry(0.102, 0.102, 0.018, 20), new PhysicalMat({ color: 0x1c0a00, roughness: 0.12, clearcoat: 0.9 }));
      ganache.position.y = 0.098;
      const topping = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), matRed);
      topping.position.set(0, 0.12, 0);
      group.add(plate, food, ganache, topping);
    } else if (id === 'dating_city_balcony') {
      const railTop = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.08, 0.10), matGold);
      railTop.position.set(0, 1.08, 0);
      const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.96, 0.04), M.glassClear);
      glassPanel.position.set(0, 0.54, 0);
      group.add(railTop, glassPanel);
      [-4.0, -2.0, 0, 2.0, 4.0].forEach(px => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.10, 12), matDark);
        post.position.set(px, 0.55, 0);
        group.add(post);
      });

      // Skyline nocturno con edificios iluminados detrás del barandal del balcón
      const skylineSpecs = [
        { x: -5.2, z: -3.2, w: 1.4, h: 5.8, d: 1.2, winColor: 0xfef08a },
        { x: -3.4, z: -4.0, w: 1.6, h: 7.4, d: 1.4, winColor: 0x38bdf8 },
        { x: -1.5, z: -3.6, w: 1.3, h: 6.2, d: 1.2, winColor: 0xfde68a },
        { x: 0.4,  z: -4.4, w: 1.8, h: 8.6, d: 1.5, winColor: 0xfef08a },
        { x: 2.4,  z: -3.5, w: 1.5, h: 6.8, d: 1.3, winColor: 0x7dd3fc },
        { x: 4.5,  z: -3.8, w: 1.7, h: 7.2, d: 1.3, winColor: 0xfde68a }
      ];
      const bldgMat = new PhysicalMat({ color: 0x0f172a, roughness: 0.3, metalness: 0.6, clearcoat: 0.5 });
      skylineSpecs.forEach(b => {
        const tower = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), bldgMat);
        tower.position.set(b.x, b.h * 0.5 - 1.8, b.z);
        group.add(tower);
        const winMat = new THREE.MeshBasicMaterial({ color: b.winColor });
        for (let wy = -0.8; wy < b.h - 2.2; wy += 0.65) {
          for (let wx = -b.w * 0.32; wx <= b.w * 0.32; wx += 0.32) {
            const win = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.24), winMat);
            win.position.set(b.x + wx, wy, b.z + b.d * 0.5 + 0.01);
            group.add(win);
          }
        }
      });
    } else if (id === 'dating_waiter_npc') {
      // Mesero 3D Articulado con piernas y brazos animados para caminar entre WAITER_STATION_POS y WAITER_TABLE_POS
      const skinMat = new PhysicalMat({ color: 0xfde68a, roughness: 0.38, clearcoat: 0.2 });
      const legsL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.058, 0.72, 12), M.ironBlack);
      legsL.position.set(-0.11, 0.36, 0);
      const legsR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.058, 0.72, 12), M.ironBlack);
      legsR.position.set(0.11, 0.36, 0);
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.68, 16), M.ironBlack);
      torso.position.set(0, 1.04, 0);
      const shirtV = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 4), matWhite);
      shirtV.rotation.x = Math.PI;
      shirtV.position.set(0, 1.18, 0.14);
      const bowTie = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.045, 0.03), matRed);
      bowTie.position.set(0, 1.32, 0.19);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), skinMat);
      head.position.set(0, 1.56, 0);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), eyeMat);
      eyeL.position.set(-0.06, 1.58, 0.165);
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), eyeMat);
      eyeR.position.set(0.06, 1.58, 0.165);
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.186, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), M.woodDark);
      hair.position.set(0, 1.58, -0.02);

      const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.52, 12), M.ironBlack);
      armL.position.set(-0.28, 1.06, 0.05);
      armL.rotation.z = 0.18;

      const armRGroup = new THREE.Group();
      armRGroup.position.set(0.28, 1.24, 0.08);
      const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.46, 12), M.ironBlack);
      armR.rotation.x = Math.PI / 2.4;
      armR.position.set(0, -0.06, 0.18);
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.02, 20), matSilver);
      tray.position.set(0, 0.02, 0.38);
      const cloche = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), matSilver);
      cloche.position.set(0, 0.03, 0.38);
      armRGroup.add(armR, tray, cloche);

      waiterLeftLeg = legsL;
      waiterRightLeg = legsR;
      waiterLeftArm = armL;
      waiterRightArm = armRGroup;

      group.add(legsL, legsR, torso, shirtV, bowTie, head, eyeL, eyeR, hair, armL, armRGroup);
      group.rotation.y = 0;
      waiterGroup = group;
      waiterNpcGroup = group;
    } else if (id === 'dating_conversation_cards') {
      const holder = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.12), matGold);
      holder.position.y = 0.02;
      const card1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.015), matRosePink);
      card1.position.set(0, 0.08, 0);
      card1.rotation.x = -0.15;
      const card2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.015), matWhite);
      card2.position.set(0.01, 0.085, -0.02);
      card2.rotation.x = -0.25;
      group.add(holder, card1, card2);
    } else if (id === 'dating_ice_bucket') {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.18, 0.68, 16), matSilver);
      stand.position.y = 0.34;
      const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.15, 0.34, 20), matSilver);
      bucket.position.y = 0.82;
      const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 0.38, 14), M.leafGreen2);
      bottle.position.set(0, 0.98, 0);
      bottle.rotation.z = 0.18;
      group.add(stand, bucket, bottle);
    } else if (id === 'dating_string_lights') {
      const poleL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 3.4, 12), matDark);
      poleL.position.set(-1.2, 1.7, 0);
      const poleR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 3.4, 12), matDark);
      poleR.position.set(1.2, 1.7, 0);
      const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 2.5, 8), matDark);
      wire.rotation.z = Math.PI / 2;
      wire.position.set(0, 3.2, 0);
      group.add(poleL, poleR, wire);
      for (let b = -2; b <= 2; b++) {
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), M.emissiveBulb);
        bulb.position.set(b * 0.48, 3.12, 0);
        group.add(bulb);
      }
    }
    // --- HOUSE & GARDEN EXTRAS (CAMA, REFRIGERADOR, ASADOR, ASPERSOR, CAMINO DE PIEDRA) ---
    else if (id === 'house_bed') {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.32, 2.15), matWalnut);
      frame.position.y = 0.16;
      const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.05, 0.14), matWalnut);
      headboard.position.set(0, 0.525, -1.02);
      const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.26, 1.98), matWhite);
      mattress.position.set(0, 0.42, 0.04);
      const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.27, 1.32), matSky);
      blanket.position.set(0, 0.43, 0.36);
      const pillowL = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.14, 0.36), matWhite);
      pillowL.position.set(-0.42, 0.60, -0.68);
      const pillowR = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.14, 0.36), matWhite);
      pillowR.position.set(0.42, 0.60, -0.68);
      group.add(frame, headboard, mattress, blanket, pillowL, pillowR);
    } else if (id === 'house_refrigerator') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.95, 0.82), matSilver);
      body.position.y = 0.975;
      const splitLine = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.025, 0.84), matDark);
      splitLine.position.y = 1.28;
      const handleTop = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.42, 10), matDark);
      handleTop.position.set(-0.34, 1.58, 0.44);
      const handleBot = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.68, 10), matDark);
      handleBot.position.set(-0.34, 0.78, 0.44);
      const dispenser = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.04), M.ironBlack);
      dispenser.position.set(0.18, 1.12, 0.41);
      group.add(body, splitLine, handleTop, handleBot, dispenser);
    } else if (id === 'garden_bbq_grill') {
      const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 14, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5), M.ironBlack);
      bowl.position.y = 0.82;
      const lid = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.48), matRed);
      lid.position.set(0, 0.86, -0.10);
      lid.rotation.x = -0.35;
      const grate = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.02, 20), matSilver);
      grate.position.y = 0.82;
      const embers = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.34, 0.04, 16), M.emissiveBulb);
      embers.position.y = 0.72;
      [[-0.26, -0.22], [0.26, -0.22], [0, 0.28]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.75, 10), matSilver);
        leg.position.set(lx, 0.375, lz);
        group.add(leg);
      });
      group.add(bowl, lid, grate, embers);
    } else if (id === 'garden_sprinkler') {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.08, 16), matDark);
      base.position.y = 0.04;
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.22, 12), matGold);
      nozzle.position.y = 0.16;
      const crossBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 10), matGold);
      crossBar.rotation.z = Math.PI / 2;
      crossBar.position.y = 0.26;
      const waterArc = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.02, 10, 24, Math.PI), matSky);
      waterArc.position.y = 0.26;
      group.add(base, nozzle, crossBar, waterArc);
    } else if (id === 'garden_stone_path') {
      [-0.9, -0.3, 0.3, 0.9].forEach((sz, idx) => {
        const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 0.06, 8), M.stonePaver);
        stone.position.set((idx % 2 === 0 ? -0.15 : 0.15), 0.03, sz);
        group.add(stone);
      });
    } else if (id === 'garden_picket_fence') {
      const rail1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.06), matWhite);
      rail1.position.y = 0.35;
      const rail2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.06), matWhite);
      rail2.position.y = 0.72;
      group.add(rail1, rail2);
      for (let p = -5; p <= 5; p++) {
        const picket = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.95, 0.04), matWhite);
        picket.position.set(p * 0.21, 0.475, 0);
        group.add(picket);
      }
    } else if (id === 'garden_birdhouse') {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.35, 12), matWood);
      post.position.y = 0.675;
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.36), matWood);
      box.position.y = 1.48;
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.28, 4), matRed);
      roof.position.y = 1.82;
      roof.rotation.y = Math.PI / 4;
      group.add(post, box, roof);
    } else if (id === 'garden_watering_can') {
      const can = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.20, 0.36, 16), matEmerald);
      can.position.y = 0.18;
      const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.38, 10), matEmerald);
      spout.position.set(0.24, 0.26, 0);
      spout.rotation.z = -0.65;
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.02, 10, 20), matEmerald);
      handle.position.set(-0.14, 0.26, 0);
      group.add(can, spout, handle);
    } else if (id === 'garden_fountain') {
      const basin1 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.72, 0.28, 24), M.stoneGray);
      basin1.position.y = 0.14;
      const water1 = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.04, 24), matSky);
      water1.position.y = 0.27;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.72, 16), M.stoneGray);
      pillar.position.y = 0.52;
      const basin2 = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.34, 0.18, 20), M.stoneGray);
      basin2.position.y = 0.88;
      group.add(basin1, water1, pillar, basin2);
    }
    // --- MUNDO SPACE (OUTER SPACE & ASTRONOMY) ---
    else if (id === 'space_sun') {
      const sunMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf97316, emissiveIntensity: 2.2, roughness: 0.2 });
      const core = new THREE.Mesh(new THREE.SphereGeometry(1.45, 32, 32), sunMat);
      const halo = new THREE.Mesh(new THREE.RingGeometry(1.6, 2.1, 32), new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.45 }));
      const sunLight = new THREE.PointLight(0xffedd5, 3.2, 45);
      group.add(core, halo, sunLight);
    } else if (id === 'space_earth' || id === 'space_axial_rotation') {
      const earthMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x0369a1, emissiveIntensity: 0.35, roughness: 0.4 });
      const globe = new THREE.Mesh(new THREE.SphereGeometry(0.72, 28, 28), earthMat);
      const cont = new THREE.Mesh(new THREE.DodecahedronGeometry(0.74, 1), M.leafGreen3);
      cont.scale.set(0.85, 0.65, 0.9);
      group.add(globe, cont);
      if (id === 'space_earth') {
        // Luna orbitando junto a la Tierra además del objeto Moon dedicado
        const miniMoon = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 }));
        miniMoon.position.set(1.15, 0.28, 0);
        group.add(miniMoon);
      }
      if (id === 'space_axial_rotation') {
        const axisRod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.2, 12), matGold);
        axisRod.rotation.z = 0.41;
        const eqRing = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.025, 12, 32), matGold);
        eqRing.rotation.x = Math.PI / 2;
        eqRing.rotation.y = 0.41;
        group.add(axisRod, eqRing);
      }
    } else if (id === 'space_moon') {
      const moonMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, emissive: 0x475569, emissiveIntensity: 0.25, roughness: 0.8 });
      const moon = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 20), moonMat);
      group.add(moon);
    } else if (id === 'space_mars') {
      const marsMat = new THREE.MeshStandardMaterial({ color: 0xea580c, emissive: 0x9a3412, emissiveIntensity: 0.3, roughness: 0.65 });
      const mars = new THREE.Mesh(new THREE.SphereGeometry(0.58, 24, 24), marsMat);
      const iceCap = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 12), matWhite);
      iceCap.position.y = 0.42;
      group.add(mars, iceCap);
    } else if (id === 'space_saturn') {
      const satMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xb45309, emissiveIntensity: 0.25, roughness: 0.45 });
      const planet = new THREE.Mesh(new THREE.SphereGeometry(0.85, 28, 28), satMat);
      const torusRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.14, 16, 48), new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.45, metalness: 0.15 }));
      torusRing1.rotation.x = Math.PI / 2.35;
      torusRing1.scale.z = 0.18;
      const torusRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.76, 0.08, 16, 48), new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.5, transparent: true, opacity: 0.82 }));
      torusRing2.rotation.x = Math.PI / 2.35;
      torusRing2.scale.z = 0.18;
      group.add(planet, torusRing1, torusRing2);
    } else if (id === 'space_black_hole') {
      const eventHorizon = new THREE.Mesh(new THREE.SphereGeometry(0.68, 28, 28), new THREE.MeshBasicMaterial({ color: 0x000000 }));
      const accretionInner = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.16, 16, 48), new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 2.2, roughness: 0.2 }));
      accretionInner.rotation.x = Math.PI / 2.6;
      accretionInner.scale.z = 0.22;
      const accretionOuter = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.07, 14, 48), new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 1.6, roughness: 0.3 }));
      accretionOuter.rotation.x = Math.PI / 2.6;
      accretionOuter.scale.z = 0.22;
      group.add(eventHorizon, accretionInner, accretionOuter);
    } else if (id === 'space_spacecraft') {
      const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 1.2, 20), matWhite);
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.55, 20), matRed);
      nose.position.y = 0.87;
      const thruster = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 16), M.emissiveBulb);
      thruster.rotation.x = Math.PI;
      thruster.position.y = -0.75;
      group.add(hull, nose, thruster);
      [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].forEach(a => {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.32), matRed);
        fin.position.set(Math.cos(a) * 0.34, -0.35, Math.sin(a) * 0.34);
        fin.rotation.y = -a;
        group.add(fin);
      });
      group.rotation.z = -0.35;
    } else if (id === 'space_astronaut') {
      const suit = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.65, 16), matWhite);
      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), matWhite);
      helmet.position.y = 0.52;
      const visor = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), matGold);
      visor.position.set(0, 0.52, 0.09);
      const pack = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.48, 0.22), matSilver);
      pack.position.set(0, 0.08, -0.22);
      group.add(suit, helmet, visor, pack);
    } else if (id === 'space_telescope' || id === 'space_satellite') {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 1.3, 20), matSilver);
      tube.rotation.z = Math.PI / 3;
      const panelL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.03, 1.3), matSky);
      panelL.position.set(0, 0, 0.85);
      const panelR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.03, 1.3), matSky);
      panelR.position.set(0, 0, -0.85);
      const dish = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.2, 16), matGold);
      dish.position.set(0.55, 0.35, 0);
      group.add(tube, panelL, panelR, dish);
    } else if (id === 'space_asteroid') {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.62, 1), M.stoneGray);
      rock.scale.set(1.25, 0.85, 0.95);
      const moonlet = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 0), M.stonePaver);
      moonlet.position.set(0.85, 0.35, 0.2);
      group.add(rock, moonlet);
    } else if (id === 'space_gravity') {
      for (let r = 1; r <= 3; r++) {
        const torus = new THREE.Mesh(new THREE.TorusGeometry(r * 0.42, 0.02, 10, 32), M.emissiveScreen);
        torus.rotation.x = Math.PI / 2;
        torus.position.y = (3 - r) * 0.22;
        group.add(torus);
      }
      const centerMass = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), matGold);
      centerMass.position.y = 0.45;
      group.add(centerMass);
    }
    // --- MUNDOS SUPERMARKET, HOTEL Y RESTAURANT ---
    else if (id === 'market_shopping_cart' || id === 'hotel_luggage_cart' || id === 'rest_dessert_cart') {
      const isBrass = id === 'hotel_luggage_cart';
      const frameMat = isBrass ? matGold : matSilver;
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.08, 0.62), isBrass ? matVelvet : frameMat);
      base.position.y = 0.26;
      const basket = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.55, 0.60), frameMat);
      basket.position.y = 0.68;
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.62, 12), frameMat);
      handle.rotation.x = Math.PI / 2;
      handle.position.set(-0.52, 0.98, 0);
      group.add(base, basket, handle);
      [[-0.38, -0.25], [0.38, -0.25], [-0.38, 0.25], [0.38, 0.25]].forEach(([wx, wz]) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 14), M.ironBlack);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wx, 0.09, wz);
        group.add(wheel);
      });
    } else if (id === 'hotel_chandelier' || id === 'rest_chandelier') {
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 10), matGold);
      chain.position.y = 0.55;
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.04, 12, 28), matGold);
      ring1.rotation.x = Math.PI / 2;
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.035, 12, 24), matGold);
      ring2.rotation.x = Math.PI / 2;
      ring2.position.y = -0.25;
      group.add(chain, ring1, ring2);
      for (let c = 0; c < 8; c++) {
        const a = (c * Math.PI * 2) / 8;
        const crystal = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12), M.emissiveBulb);
        crystal.position.set(Math.cos(a) * 0.75, 0.06, Math.sin(a) * 0.75);
        group.add(crystal);
      }
    } else if (id === 'hotel_receptionist_desk' || id === 'rest_chef_station' || id === 'rest_kitchen_pass' || id === 'market_checkout' || id === 'hotel_concierge') {
      const counter = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.05, 0.85), matWalnut);
      counter.position.y = 0.525;
      const topMarble = new THREE.Mesh(new THREE.BoxGeometry(2.92, 0.08, 0.95), matWhite);
      topMarble.position.y = 1.08;
      const frontAccent = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.65, 0.04), matGold);
      frontAccent.position.set(0, 0.52, 0.43);
      group.add(counter, topMarble, frontAccent);
    } else if (id === 'market_fresh_produce' || id === 'market_bakery' || id === 'market_dairy_section' || id === 'market_frozen_aisle' || id === 'market_price_tag') {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.85, 0.75), matDark);
      rack.position.y = 0.925;
      group.add(rack);
      [0.45, 0.95, 1.45].forEach(sy => {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.05, 0.72), matSilver);
        shelf.position.set(0, sy, 0.04);
        group.add(shelf);
        for (let p = -3; p <= 3; p++) {
          const itemMat = id === 'market_fresh_produce' ? (p % 2 === 0 ? matRed : matEmerald) : (id === 'market_bakery' ? matGold : matSky);
          const prod = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.24), itemMat);
          prod.position.set(p * 0.28, sy + 0.14, 0.10);
          group.add(prod);
        }
      });
    } else if (id === 'market_cash_register' || id === 'hotel_check_in') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.18, 0.48), matDark);
      base.position.y = 0.09;
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.26, 12), matSilver);
      stand.position.set(0, 0.28, -0.06);
      const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.32, 0.05), matDark);
      monitor.position.set(0, 0.46, -0.04);
      monitor.rotation.x = -0.22;
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.40, 0.26), M.emissiveScreen);
      screen.position.set(0, 0.46, -0.01);
      screen.rotation.x = -0.22;
      group.add(base, stand, monitor, screen);
    } else if (id === 'market_barcode_scanner') {
      const cradle = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.14, 0.16, 16), matDark);
      cradle.position.y = 0.08;
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.28, 12), matDark);
      neck.position.set(0, 0.24, 0.04);
      neck.rotation.x = 0.35;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.22), matRed);
      head.position.set(0, 0.38, 0.10);
      group.add(cradle, neck, head);
    } else if (id === 'market_scale') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.10, 0.42), matSilver);
      base.position.y = 0.05;
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.20, 0.04, 20), matSilver);
      tray.position.set(0, 0.14, 0.04);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.46, 12), matSilver);
      pole.position.set(0, 0.32, -0.16);
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 20), matWhite);
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0, 0.56, -0.14);
      group.add(base, tray, pole, dial);
    } else if (id === 'market_shopping_basket' || id === 'market_reusable_bag') {
      const basketColor = id === 'market_reusable_bag' ? matEmerald : matRed;
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.34, 0.38), basketColor);
      body.position.y = 0.17;
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.02, 10, 20, Math.PI), matDark);
      handle.position.y = 0.34;
      group.add(body, handle);
    } else if (id === 'hotel_suitcase') {
      const bag1 = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.76, 0.28), matRed);
      bag1.position.set(-0.22, 0.38, 0);
      const handle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.32, 10), matSilver);
      handle1.position.set(-0.22, 0.92, 0);
      const bag2 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.58, 0.24), matSky);
      bag2.position.set(0.28, 0.29, 0.08);
      group.add(bag1, handle1, bag2);
    } else if (id === 'hotel_elevator' || id === 'hotel_revolving_door') {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.65, 0.24), matGold);
      frame.position.y = 1.325;
      const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.88, 2.42, 0.18), id === 'hotel_revolving_door' ? M.glassClear : matSilver);
      doorL.position.set(-0.46, 1.21, 0.04);
      const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.88, 2.42, 0.18), id === 'hotel_revolving_door' ? M.glassClear : matSilver);
      doorR.position.set(0.46, 1.21, 0.04);
      group.add(frame, doorL, doorR);
    } else if (id === 'hotel_bellhop_bell') {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.03, 20), matDark);
      base.position.y = 0.015;
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), matGold);
      dome.position.y = 0.03;
      const topPin = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.04, 12), matSilver);
      topPin.position.y = 0.17;
      group.add(base, dome, topPin);
    } else if (id === 'hotel_lobby_sofa') {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.42, 0.86), matVelvet);
      seat.position.y = 0.28;
      const back = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.56, 0.22), matVelvet);
      back.position.set(0, 0.68, -0.32);
      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.52, 0.86), matVelvet);
      armL.position.set(-0.96, 0.44, 0);
      const armR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.52, 0.86), matVelvet);
      armR.position.set(0.96, 0.44, 0);
      group.add(seat, back, armL, armR);
    } else if (id === 'hotel_keycard') {
      const holder = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.16), matGold);
      holder.position.y = 0.02;
      const card = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.012), matSky);
      card.position.set(0, 0.13, 0);
      card.rotation.z = 0.12;
      group.add(holder, card);
    } else if (id === 'rest_cutlery') {
      [-0.08, 0, 0.08].forEach(cx => {
        const utensil = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.01, 0.26), matSilver);
        utensil.position.set(cx, 0.015, 0);
        group.add(utensil);
      });
    } else if (id === 'rest_napkin' || id === 'rest_reserved_sign') {
      const prism = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.22, 4), id === 'rest_reserved_sign' ? matGold : matRed);
      prism.position.y = 0.11;
      prism.rotation.y = Math.PI / 4;
      group.add(prism);
    } else {
      // Geometría compuesta estilizada multipropósito para objetos de mostrador, mobiliario o jardín
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.14, 20), matDark);
      pedestal.position.y = 0.07;
      const mainBody = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.48, 0.42), matSky);
      mainBody.position.y = 0.38;
      const topAccent = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.18, 16), matGold);
      topAccent.position.y = 0.70;
      const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.24), M.emissiveScreen);
      screenGlow.position.set(0, 0.42, 0.22);
      group.add(pedestal, mainBody, topAccent, screenGlow);
    }

    const px = itemSpec.pos ? itemSpec.pos[0] : 0;
    const py = itemSpec.pos ? itemSpec.pos[1] : 0;
    const pz = itemSpec.pos ? itemSpec.pos[2] : 0;
    group.position.set(px, py, pz);

    const userData = {
      interactive: true,
      id: itemSpec.id,
      en: itemSpec.en,
      ipa: itemSpec.ipa,
      es: itemSpec.es,
      category: itemSpec.category || scenarioKey,
      example: itemSpec.example,
      wordEn: itemSpec.en,
      phonetic: itemSpec.ipa,
      wordEs: itemSpec.es,
      focusPos: { x: px + (px >= 0 ? -1.8 : 1.8), y: Math.max(2.2, py + 2.0), z: pz + 2.8 },
      lookAtPos: { x: px, y: Math.max(0.8, py + 0.6), z: pz }
    };
    WORLD3D_VOCAB_CATALOG[itemSpec.id] = userData;
    group.userData = Object.assign({}, userData);
    group.traverse(child => {
      if (child.isMesh) {
        child.castShadow = !IS_IOS;
        child.receiveShadow = !IS_IOS;
        child.userData = Object.assign({}, userData, { parentGroup: group });
      }
    });

    interactiveObjects.push(group);
    createSpatialHotspotForObject(group, itemSpec.id);
    return group;
  }
  global.buildCompound3DObject = buildCompound3DObject;

  // ============================================================================
  // AVATARES SENTADOS EN LAS SILLAS + BURBUJAS DE CHAT ESTILO ROBLOX
  // ============================================================================
  function buildSeatedCharacterMesh(gender, role) {
    if (typeof THREE === 'undefined') return null;
    const M = initSharedMaterials();
    const PhysicalMat = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
    const isFemale = gender === 'female';
    const charGroup = new THREE.Group();
    charGroup.name = `SeatedAvatar_${role || 'player'}_${isFemale ? 'female' : 'male'}`;

    const skinMat = new PhysicalMat({ color: isFemale ? 0xfde68a : 0xfcd34d, roughness: 0.35, clearcoat: 0.25 });
    const suitMat = new PhysicalMat({ color: role === 'partner' ? 0x1e1b4b : 0x0f172a, roughness: 0.35, metalness: 0.15, clearcoat: 0.45 });
    const dressMat = new PhysicalMat({ color: role === 'partner' ? 0xbe123c : 0x9f1239, roughness: 0.28, metalness: 0.12, clearcoat: 0.6 });
    const hairMat = new PhysicalMat({ color: isFemale ? (role === 'partner' ? 0x451a03 : 0x78350f) : 0x1c1917, roughness: 0.42, clearcoat: 0.35 });
    const shoeMat = M.ironBlack;

    // 1. Muslos horizontales sobre el asiento de la silla (y: 0.48), orientados hacia +Z (el frente del personaje)
    [-0.10, 0.10].forEach(tx => {
      const thigh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.068, 0.062, 0.36, 12),
        isFemale ? dressMat : suitMat
      );
      thigh.rotation.x = Math.PI / 2;
      thigh.position.set(tx, 0.48, 0.08);
      charGroup.add(thigh);

      // 2. Pantorrillas bajando verticalmente hacia el suelo desde la rodilla (z: 0.24, y: 0.24)
      const calf = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.046, 0.44, 12),
        isFemale ? skinMat : suitMat
      );
      calf.position.set(tx, 0.24, 0.24);
      charGroup.add(calf);

      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.16), shoeMat);
      shoe.position.set(tx, 0.03, 0.28);
      charGroup.add(shoe);
    });

    if (isFemale) {
      // Falda de vestido de noche cubriendo el regazo en postura sentada
      const skirtLap = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.11, 0.36), dressMat);
      skirtLap.position.set(0, 0.50, 0.08);
      charGroup.add(skirtLap);
    }

    // 3. Torso erguido apoyado cerca del respaldo (y: 0.76, z: -0.06)
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(isFemale ? 0.15 : 0.18, isFemale ? 0.13 : 0.16, 0.52, 16),
      isFemale ? dressMat : suitMat
    );
    torso.position.set(0, 0.76, -0.05);
    charGroup.add(torso);

    if (!isFemale) {
      // Traje/Tuxedo elegante con camisa blanca y corbata/corbatín
      const shirtFront = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.28, 4), M.ceramicWhite);
      shirtFront.rotation.x = Math.PI;
      shirtFront.position.set(0, 0.86, 0.08);
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.20, 0.025), new PhysicalMat({ color: 0xe11d48, roughness: 0.25, clearcoat: 0.6 }));
      tie.position.set(0, 0.84, 0.13);
      charGroup.add(shirtFront, tie);
    } else {
      // Collar sutil dorado/perla en el cuello para el vestido de noche
      const necklace = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.014, 10, 24), M.metalBrass);
      necklace.rotation.x = Math.PI / 2;
      necklace.position.set(0, 1.01, -0.03);
      charGroup.add(necklace);
    }

    // 4. Brazos descansando hacia el borde de la mesa
    [-0.20, 0.20].forEach((ax, idx) => {
      const upperArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.04, 0.30, 10),
        isFemale ? skinMat : suitMat
      );
      upperArm.position.set(ax, 0.86, 0.02);
      upperArm.rotation.x = -0.45;
      upperArm.rotation.z = idx === 0 ? 0.15 : -0.15;

      const forearm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.036, 0.28, 10),
        skinMat
      );
      forearm.rotation.x = Math.PI / 2.1;
      forearm.position.set(ax * 0.88, 0.74, 0.22);

      charGroup.add(upperArm, forearm);
    });

    // 5. Cabeza detallada con ojos y peinado según género (y: 1.18)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.165, 20, 20), skinMat);
    head.position.set(0, 1.18, -0.03);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), eyeMat);
    eyeL.position.set(-0.055, 1.20, 0.125);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), eyeMat);
    eyeR.position.set(0.055, 1.20, 0.125);
    charGroup.add(head, eyeL, eyeR);

    if (!isFemale) {
      // Cabello corto estilizado masculino
      const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.172, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
      hairCap.position.set(0, 1.20, -0.04);
      const hairQuiff = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.10), hairMat);
      hairQuiff.position.set(0, 1.33, 0.06);
      hairQuiff.rotation.x = -0.25;
      charGroup.add(hairCap, hairQuiff);
    } else {
      // Cabello largo femenino con caída/volumen sobre la espalda y hombros
      const hairCrown = new THREE.Mesh(new THREE.SphereGeometry(0.176, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.62), hairMat);
      hairCrown.position.set(0, 1.21, -0.04);
      const hairBack = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.42, 14), hairMat);
      hairBack.position.set(0, 1.02, -0.14);
      const hairLockL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.32, 10), hairMat);
      hairLockL.position.set(-0.14, 1.05, 0.02);
      const hairLockR = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.32, 10), hairMat);
      hairLockR.position.set(0.14, 1.05, 0.02);
      charGroup.add(hairCrown, hairBack, hairLockL, hairLockR);
    }

    charGroup.traverse(c => {
      if (c.isMesh) {
        c.castShadow = !IS_IOS;
        c.receiveShadow = !IS_IOS;
      }
    });

    return charGroup;
  }
  global.buildSeatedCharacterMesh = buildSeatedCharacterMesh;

  function getSavedPlayerGender() {
    try {
      const g = localStorage.getItem('mastereng_player_gender');
      return (g === 'female' || g === 'male') ? g : 'male';
    } catch (e) { return 'male'; }
  }

  function getSavedPartnerGender() {
    try {
      const g = localStorage.getItem('mastereng_partner_gender');
      return (g === 'female' || g === 'male' || g === 'waiting') ? g : 'female';
    } catch (e) { return 'female'; }
  }

  function rebuildDatingSeatedAvatars() {
    if (!scenarioDynamicRoot || currentScenarioKey !== 'dating') return;
    if (playerSeatedGroup && playerSeatedGroup.parent) {
      playerSeatedGroup.parent.remove(playerSeatedGroup);
    }
    if (partnerSeatedGroup && partnerSeatedGroup.parent) {
      partnerSeatedGroup.parent.remove(partnerSeatedGroup);
    }
    playerSeatedGroup = null;
    partnerSeatedGroup = null;

    // Silla Izquierda (x: -1.25, z: 0, rotation.y = Math.PI / 2): Siempre muestra al Jugador Local sentado
    const pGender = getSavedPlayerGender();
    const playerMesh = buildSeatedCharacterMesh(pGender, 'player');
    if (playerMesh) {
      playerMesh.position.set(-1.25, 0, 0);
      playerMesh.rotation.y = Math.PI / 2;
      scenarioDynamicRoot.add(playerMesh);
      playerSeatedGroup = playerMesh;
    }

    // Silla Derecha (x: 1.25, z: 0, rotation.y = -Math.PI / 2): Muestra a tu Cita / Invitado sentado frente a ti
    const cGender = getSavedPartnerGender();
    if (cGender === 'female' || cGender === 'male') {
      const partnerMesh = buildSeatedCharacterMesh(cGender, 'partner');
      if (partnerMesh) {
        partnerMesh.position.set(1.25, 0, 0);
        partnerMesh.rotation.y = -Math.PI / 2;
        scenarioDynamicRoot.add(partnerMesh);
        partnerSeatedGroup = partnerMesh;
      }
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
  global.rebuildDatingSeatedAvatars = rebuildDatingSeatedAvatars;

  // Burbujas de Chat Estilo Roblox Sobre la Cabeza (window.showRobloxOverheadBubble)
  function showRobloxOverheadBubble(targetWho, text) {
    if (typeof THREE === 'undefined' || !text) return null;
    const activeScene = scenarioDynamicRoot || scene;
    if (!activeScene) return null;

    const who = (targetWho === 'partner' || targetWho === 'waiter') ? targetWho : 'player';
    const cleanText = String(text).trim();
    if (!cleanText) return null;

    // Eliminar burbuja previa del mismo hablante si existía
    if (activeOverheadBubbles[who] && activeOverheadBubbles[who].sprite) {
      const oldSprite = activeOverheadBubbles[who].sprite;
      if (oldSprite.parent) oldSprite.parent.remove(oldSprite);
      if (oldSprite.material && oldSprite.material.map && typeof oldSprite.material.map.dispose === 'function') {
        try { oldSprite.material.map.dispose(); } catch (e) {}
      }
      if (oldSprite.material && typeof oldSprite.material.dispose === 'function') {
        try { oldSprite.material.dispose(); } catch (e) {}
      }
    }

    let tex = null;
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 192;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 512, 192);

        // Globo blanco redondeado estilo Roblox con borde oscuro sutil y cola triangular inferior
        const bx = 20, by = 14, bw = 472, bh = 132, br = 26;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.97)';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 5;

        const qCurve = typeof ctx.quadraticCurveTo === 'function'
          ? (cpx, cpy, x, y) => ctx.quadraticCurveTo(cpx, cpy, x, y)
          : (_cpx, _cpy, x, y) => ctx.lineTo(x, y);
        ctx.beginPath();
        ctx.moveTo(bx + br, by);
        ctx.lineTo(bx + bw - br, by);
        qCurve(bx + bw, by, bx + bw, by + br);
        ctx.lineTo(bx + bw, by + bh - br);
        qCurve(bx + bw, by + bh, bx + bw - br, by + bh);
        // Cola triangular apuntando hacia la cabeza del personaje
        ctx.lineTo(274, by + bh);
        ctx.lineTo(256, by + bh + 30);
        ctx.lineTo(238, by + bh);
        ctx.lineTo(bx + br, by + bh);
        qCurve(bx, by + bh, bx, by + bh - br);
        ctx.lineTo(bx, by + br);
        qCurve(bx, by, bx + br, by);
        if (typeof ctx.closePath === 'function') ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Dividir texto negro legible en hasta 2 líneas
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 26px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const words = cleanText.split(/\s+/);
        let line1 = '';
        let line2 = '';
        for (let i = 0; i < words.length; i++) {
          const test1 = line1 ? (line1 + ' ' + words[i]) : words[i];
          if (test1.length <= 32 || !line1) {
            line1 = test1;
          } else {
            line2 = words.slice(i).join(' ');
            if (line2.length > 34) line2 = line2.slice(0, 31) + '...';
            break;
          }
        }

        if (line2) {
          ctx.fillText(line1, 256, 62);
          ctx.fillText(line2, 256, 102);
        } else {
          ctx.fillText(line1, 256, 80);
        }

        tex = new THREE.CanvasTexture(canvas);
      }
    }

    const spriteMat = new THREE.SpriteMaterial({
      map: tex,
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
      depthTest: false,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.65, 0.62, 1);
    sprite.renderOrder = 999;

    // Posicionar justo encima de la cabeza del hablante (y = 1.65 para sentados, y = 2.05 para el mesero)
    if (who === 'waiter') {
      const wx = (waiterGroup && waiterGroup.position) ? waiterGroup.position.x : WAITER_TABLE_POS.x;
      const wz = (waiterGroup && waiterGroup.position) ? waiterGroup.position.z : WAITER_TABLE_POS.z;
      sprite.position.set(wx, 2.05, wz);
    } else if (who === 'partner') {
      sprite.position.set(1.25, 1.65, 0);
    } else {
      sprite.position.set(-1.25, 1.65, 0);
    }

    activeScene.add(sprite);
    const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    activeOverheadBubbles[who] = {
      sprite: sprite,
      targetWho: who,
      createdAt: nowMs,
      durationMs: 8000,
      text: cleanText
    };

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
    return sprite;
  }
  global.showRobloxOverheadBubble = showRobloxOverheadBubble;

  function buildScenarioWorld(targetScene, scenarioKey) {
    const activeScene = targetScene || scene;
    if (!activeScene || typeof THREE === 'undefined') return;
    const key = WORLD_TOUR_SCENARIOS[scenarioKey] ? scenarioKey : 'house';
    currentScenarioKey = key;

    clearSelectedHighlight();
    clearHoverHighlight();
    closeWorld3DInspectCard();

    if (!scenarioDynamicRoot) {
      scenarioDynamicRoot = new THREE.Group();
      scenarioDynamicRoot.name = 'ScenarioDynamicRoot';
      activeScene.add(scenarioDynamicRoot);
    } else {
      disposeScenarioMemory(scenarioDynamicRoot);
      if (scenarioDynamicRoot.parent !== activeScene) {
        activeScene.add(scenarioDynamicRoot);
      }
    }

    interactiveObjects = [];
    spatialHotspots = [];
    animatedSteamRings = [];
    animatedWindowLeaves = [];
    spaceOrbitalEntries = [];
    waiterGroup = null;
    waiterNpcGroup = null;
    waiterLeftLeg = null;
    waiterRightLeg = null;
    waiterLeftArm = null;
    waiterRightArm = null;
    playerSeatedGroup = null;
    partnerSeatedGroup = null;
    activeOverheadBubbles = { player: null, partner: null, waiter: null };
    candleFlameLight = null;
    candleFlameMesh = null;

    const scen = WORLD_TOUR_SCENARIOS[key];
    activeScene.background = new THREE.Color(scen.bg !== undefined ? scen.bg : 0x0a0e17);
    activeScene.fog = new THREE.FogExp2(scen.bg !== undefined ? scen.bg : 0x0a0e17, scen.fogDensity || 0.005);

    if (key === 'house' || key === 'garden') {
      buildDetailedHouseAndGarden(scenarioDynamicRoot);
      if (key === 'house') {
        const extraHouseIds = ['house_bed', 'house_refrigerator'];
        scen.objects.forEach(item => {
          if (extraHouseIds.includes(item.id)) {
            const g = buildCompound3DObject(item, 'house');
            if (g) scenarioDynamicRoot.add(g);
          }
        });
      } else if (key === 'garden') {
        const extraGardenIds = ['garden_bbq_grill', 'garden_sprinkler', 'garden_stone_path', 'garden_picket_fence', 'garden_birdhouse', 'garden_watering_can', 'garden_fountain'];
        scen.objects.forEach(item => {
          if (extraGardenIds.includes(item.id)) {
            const g = buildCompound3DObject(item, 'garden');
            if (g) scenarioDynamicRoot.add(g);
          }
        });
      }
    } else {
      createSpaceDome(scenarioDynamicRoot);

      if (key === 'dating') {
        // Terraza nocturna estrellada (#070b14) con piso de bistró PBR, alfombra borgoña y estación de servicio del Mesero al fondo
        const PhysicalMat = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
        const terraceFloor = new THREE.Mesh(
          new THREE.CylinderGeometry(11.5, 12.0, 0.35, 48),
          new PhysicalMat({ color: 0x1e1b2e, roughness: 0.25, metalness: 0.15, clearcoat: 0.6 })
        );
        terraceFloor.position.set(0, -0.17, -1.0);
        const rugCircle = new THREE.Mesh(
          new THREE.CylinderGeometry(3.0, 3.0, 0.03, 36),
          SHARED_MATERIALS.burgundyCloth || new PhysicalMat({ color: 0x881337, roughness: 0.72 })
        );
        rugCircle.position.set(0, 0.015, 0);

        // Estación de servicio del Mesero en WAITER_STATION_POS (x: 3.35, z: -2.4, lejos de las sillas)
        const stationPodium = new THREE.Mesh(
          new THREE.BoxGeometry(0.62, 1.05, 0.46),
          SHARED_MATERIALS.woodWalnut || new PhysicalMat({ color: 0x3b1d0e, roughness: 0.25, clearcoat: 0.6 })
        );
        stationPodium.position.set(3.45, 0.525, -2.4);
        scenarioDynamicRoot.add(terraceFloor, rugCircle, stationPodium);
      } else if (key === 'space') {
        // Cielo profundo (#020617) con 400 estrellas brillantes (Points) + anillos orbitales guía alrededor del Sol
        const starPositions = new Float32Array(400 * 3);
        for (let s = 0; s < 400; s++) {
          const r = 14 + Math.random() * 28;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          starPositions[s * 3] = r * Math.sin(phi) * Math.cos(theta);
          starPositions[s * 3 + 1] = Math.abs(r * Math.cos(phi)) - 4;
          starPositions[s * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xf8fafc, size: 0.18, transparent: true, opacity: 0.92 });
        const starPoints = new THREE.Points(starGeo, starMat);
        scenarioDynamicRoot.add(starPoints);

        [4.2, 5.3, 6.7, 8.8, 9.4, 11.2].forEach(rad => {
          const orbitLine = new THREE.Mesh(
            new THREE.RingGeometry(rad - 0.02, rad + 0.02, 64),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.22 })
          );
          orbitLine.rotation.x = Math.PI / 2;
          orbitLine.position.y = 2.2;
          scenarioDynamicRoot.add(orbitLine);
        });
      } else {
        // Suelo arquitectónico diferenciado con materiales PBR (clearcoat: 0.6, roughness: 0.25)
        const PhysicalMat = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
        const floorColor = key === 'supermarket' ? 0xe2e8f0 : (key === 'hotel' ? 0xd6d3d1 : 0x3f1d28);
        const floorMesh = new THREE.Mesh(
          new THREE.BoxGeometry(18, 0.24, 15),
          new PhysicalMat({ color: floorColor, roughness: 0.25, metalness: 0.18, clearcoat: 0.6 })
        );
        floorMesh.position.set(0, -0.12, -0.5);
        const wallColor = key === 'supermarket' ? 0x1e293b : (key === 'hotel' ? 0x1e1b4b : 0x1c1917);
        const backWall = new THREE.Mesh(
          new THREE.BoxGeometry(18, 4.6, 0.28),
          new PhysicalMat({ color: wallColor, roughness: 0.45, clearcoat: 0.3 })
        );
        backWall.position.set(0, 2.3, -7.8);
        scenarioDynamicRoot.add(floorMesh, backWall);
      }

      scen.objects.forEach(item => {
        const objGroup = buildCompound3DObject(item, key);
        if (objGroup) {
          scenarioDynamicRoot.add(objGroup);
          if (key === 'space') {
            spaceOrbitalEntries.push({
              group: objGroup,
              orbitRadius: item.orbitRadius || 0,
              orbitSpeed: item.orbitSpeed || 0,
              orbitAngle: item.orbitPhase || 0,
              rotSpeed: item.rotSpeed || 0.6,
              baseY: item.pos ? item.pos[1] : 2.2
            });
          }
        }
      });

      if (key === 'dating') {
        rebuildDatingSeatedAvatars();
        if (typeof global.setWaiterState === 'function') {
          global.setWaiterState('approaching', { silent: true });
        }
      }
    }

    updateProgressHudCounter();
    if (camera && scen.cameraPos && scen.cameraLookAt) {
      camera.position.set(scen.cameraPos.x, scen.cameraPos.y, scen.cameraPos.z);
      if (controls && controls.target) {
        controls.target.set(scen.cameraLookAt.x, scen.cameraLookAt.y, scen.cameraLookAt.z);
        controls.update();
      } else {
        camera.lookAt(scen.cameraLookAt.x, scen.cameraLookAt.y, scen.cameraLookAt.z);
      }
    }
    transitionCameraTo(scen.cameraPos, scen.cameraLookAt);
    if (renderer && camera) {
      renderer.render(activeScene, camera);
    }
  }

  // ============================================================================
  // 7. ILUMINACIÓN CINEMÁTICA EQUILIBRADA Y CICLO DÍA / NOCHE
  // ============================================================================
  function setupCinematicLighting(targetScene) {
    // 1. Luz ambiental suave (#ffffff, intensidad 0.6)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    targetScene.add(ambientLight);
    globalAmbientLight = ambientLight;

    // 2. HemisphereLight para relleno ambiental global suave
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x202035, 1.2);
    targetScene.add(hemiLight);
    globalHemiLight = hemiLight;

    // 3. DirectionalLight principal con sombras suaves (posición [10, 20, 15], intensidad 1.0)
    const dirLight = new THREE.DirectionalLight(0xfff2dd, 1.0); // THREE.DirectionalLight(0xfff2dd, 1.8)
    dirLight.position.set(10, 20, 15); // dirLight.position.set(12, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 75;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    targetScene.add(dirLight);
    globalDirLight = dirLight;

    // 4. Luz cálida puntual (PointLight) en el interior de la casa para simular lámparas de estudio
    const studyLight = new THREE.PointLight(0xffaa44, 2.0, 15.0);
    studyLight.position.set(3.5, 2.5, -3.2);
    studyLight.castShadow = true;
    studyLight.shadow.bias = -0.001;
    targetScene.add(studyLight);
    studyPointLight = studyLight;
  }

  function applyDayNightState(nightActive) {
    isNightMode = !!nightActive;
    if (!scene) return;
    const activeScen = WORLD_TOUR_SCENARIOS[currentScenarioKey] || WORLD_TOUR_SCENARIOS.house;
    const baseBg = activeScen && activeScen.bg !== undefined ? activeScen.bg : 0x0a0e17;

    if (isNightMode) {
      scene.background = new THREE.Color(baseBg);
      scene.fog = new THREE.FogExp2(baseBg, activeScen.fogDensity || 0.012);

      if (globalHemiLight) {
        globalHemiLight.color.setHex(0x38bdf8);
        globalHemiLight.groundColor.setHex(0x090d16);
        globalHemiLight.intensity = 0.58;
      }
      if (globalDirLight) {
        globalDirLight.color.setHex(0x93c5fd);
        globalDirLight.intensity = 0.65;
        globalDirLight.position.set(-10, 18, -8);
      }

      if (streetLanternSpotLight) streetLanternSpotLight.intensity = 3.6;
      if (streetLanternPointLight) streetLanternPointLight.intensity = 1.8;
      if (streetLanternBulbMat) streetLanternBulbMat.emissiveIntensity = 2.8;
      if (floorLampPointLight) floorLampPointLight.intensity = 2.4;
      if (floorLampShadeMat) floorLampShadeMat.emissiveIntensity = 1.25;
      if (studyPointLight) studyPointLight.intensity = 2.2;
      if (monitorScreenMaterial) monitorScreenMaterial.emissiveIntensity = 1.35;
    } else {
      scene.background = new THREE.Color(baseBg);
      scene.fog = new THREE.FogExp2(baseBg, activeScen.fogDensity || 0.005);

      if (globalHemiLight) {
        globalHemiLight.color.setHex(0xddeeff);
        globalHemiLight.groundColor.setHex(0x202035);
        globalHemiLight.intensity = 1.20;
      }
      if (globalDirLight) {
        globalDirLight.color.setHex(0xfff2dd);
        globalDirLight.intensity = 1.0;
        globalDirLight.position.set(10, 20, 15);
      }

      if (streetLanternSpotLight) streetLanternSpotLight.intensity = 0.0;
      if (streetLanternPointLight) streetLanternPointLight.intensity = 0.0;
      if (streetLanternBulbMat) streetLanternBulbMat.emissiveIntensity = 0.25;
      if (floorLampPointLight) floorLampPointLight.intensity = 0.35;
      if (floorLampShadeMat) floorLampShadeMat.emissiveIntensity = 0.20;
      if (studyPointLight) studyPointLight.intensity = 0.65;
      if (monitorScreenMaterial) monitorScreenMaterial.emissiveIntensity = 0.85;
    }

    const toggleBtn = typeof document !== 'undefined' ? document.getElementById('world3dDayNightBtn') : null;
    if (toggleBtn) {
      toggleBtn.innerHTML = isNightMode
        ? '<span>☀️ Pasar a Día</span> <span class="opacity-75 text-[10px]">(Modo 🌙 Noche)</span>'
        : '<span>🌙 Pasar a Noche</span> <span class="opacity-75 text-[10px]">(Modo ☀️ Día)</span>';
    }

    if (renderer && camera) {
      renderer.render(scene, camera);
    }
  }

  function toggleWorld3DDayNight() {
    applyDayNightState(!isNightMode);
    if (typeof global.showFloatingToast === 'function') {
      global.showFloatingToast(
        isNightMode ? '🌙 Modo Noche activado: Luces de jardín, sala y monitor encendidas' : '☀️ Modo Día activado: Iluminación solar natural',
        isNightMode ? '🌙' : '☀️'
      );
    }
  }

  // ============================================================================
  // 8. HUD DE CONTROL 3D UNIFICADO, TUTORIAL DE MANO Y SIMULADOR DE CITA 3D
  // ============================================================================
  function updateProgressHudCounter() {
    const scen = WORLD_TOUR_SCENARIOS[currentScenarioKey] || WORLD_TOUR_SCENARIOS.house;
    const scenObjects = (scen && Array.isArray(scen.objects)) ? scen.objects : [];
    const totalInScenario = scenObjects.length || TOTAL_INTERACTIVE_OBJECTS;
    const discoveredInScenario = scenObjects.filter(o => discoveredObjectIds.has(o.id)).length;
    const learnedInScenario = scenObjects.filter(o => learnedObjectIds.has(o.id)).length;

    const count = scenObjects.length > 0 ? discoveredInScenario : Math.min(TOTAL_INTERACTIVE_OBJECTS, discoveredObjectIds.size);
    const learnedCount = scenObjects.length > 0 ? learnedInScenario : Math.min(TOTAL_INTERACTIVE_OBJECTS, learnedObjectIds.size);

    const counterEl = typeof document !== 'undefined' ? document.getElementById('world3dProgressCounter') : null;
    if (counterEl) {
      counterEl.textContent = `Objetos descubiertos: ${count} / ${totalInScenario}`;
    }
    const barEl = typeof document !== 'undefined' ? document.getElementById('world3dProgressBarFill') : null;
    if (barEl) {
      const pct = Math.round((count / Math.max(1, totalInScenario)) * 100);
      barEl.style.width = `${pct}%`;
    }
    const subBadgeEl = typeof document !== 'undefined' ? document.getElementById('world3dLearnedSubBadge') : null;
    if (subBadgeEl) {
      subBadgeEl.textContent = `Aprendidos: ${learnedCount}/${totalInScenario}`;
    }
  }

  // Estado y lógica del Simulador de Cita Interactiva (Date Night) + Mesero IA
  const dateNightState = {
    partnerMode: 'ai', // 'partner' | 'ai'
    partnerName: '',
    phase: 1, // 1: Drinks, 2: Main Course + Icebreaker, 3: Dessert & Bill
    billChoice: 'Treat my partner',
    responses: { 1: '', 2: '', 3: '' },
    isRecording: false,
    recognition: null,
    completed: false
  };

  const WAITER_PHASES = {
    1: {
      title: 'Fase 1/3 • Bienvenida y Bebidas (Welcome & Drinks)',
      waiterLine: 'Good evening! Welcome to Starlight Bistro. What can I get you two to drink tonight?',
      waiterEs: '¡Buenas noches! Bienvenidos a Starlight Bistro. ¿Qué les puedo ofrecer de tomar esta noche?',
      aiPartnerLine: 'This rooftop view is breathtaking! I would love a glass of sparkling cider or red wine. What would you like to order for us?',
      placeholder: 'Escribe o di en inglés tu orden de bebidas (ej: "Good evening! Could we have two glasses of red wine and sparkling water, please?")',
      suggestions: [
        'Good evening! Could we get two glasses of sparkling cider and water, please?',
        'We would love two glasses of red wine and the dinner menu, please.',
        'Hello! Can I have an iced tea and a lemonade for my partner, please?'
      ]
    },
    2: {
      title: 'Fase 2/3 • Plato Principal + Pregunta Romántica (Icebreaker)',
      waiterLine: 'Excellent choice! While the chef prepares your meal, here is a conversation card for you two: What was your first impression of each other?',
      waiterEs: '¡Excelente elección! Mientras el chef prepara su cena, aquí tienen una tarjeta de conversación: ¿Cuál fue su primera impresión del otro?',
      aiPartnerLine: 'Ooh, I love this question! My first impression of you was that you had the warmest smile and such inspiring energy. What was your first impression of me?',
      placeholder: 'Responde en inglés a la tarjeta romántica y pide el plato fuerte (ej: "My first impression was that you were super kind and fun to talk to!")',
      suggestions: [
        'My first impression was that you had a wonderful smile and were very easy to talk to!',
        'I thought you were super intelligent, kind, and had a great sense of humor.',
        'From the very first moment, I felt a special connection and loved your positive energy.'
      ]
    },
    3: {
      title: 'Fase 3/3 • Postre y Cuenta (Dessert & Bill)',
      waiterLine: 'Here is your warm chocolate dessert! Whenever you are ready for the check, would you like to split the bill or treat your partner tonight?',
      waiterEs: '¡Aquí tienen su postre de chocolate tibio! Para la cuenta de esta noche, ¿prefieren dividir la cuenta (Split the bill) o invitar a su pareja (Treat my partner)?',
      aiPartnerLine: 'This chocolate lava cake is delicious! Thank you for such a magical date night practicing English together.',
      placeholder: 'Elige "Split the bill" o "Treat my partner" y despídete del mesero en inglés...',
      suggestions: [
        'Everything was delicious! I would like to treat my partner tonight, please bring the bill.',
        'Thank you for the wonderful service! Let’s split the bill equally, please.',
        'It is on me tonight—I am treating my partner! Keep the change as a tip.'
      ]
    }
  };

  if (typeof global.recordCoupleDateCompleted !== 'function') {
    global.recordCoupleDateCompleted = function () {
      try {
        const weekly = (parseInt(localStorage.getItem('mastereng_couple_weekly_dates'), 10) || 0) + 1;
        const total = (parseInt(localStorage.getItem('mastereng_couple_total_dates'), 10) || 0) + 1;
        localStorage.setItem('mastereng_couple_weekly_dates', String(weekly));
        localStorage.setItem('mastereng_couple_total_dates', String(total));
        const rank = total >= 10 ? '💎 Diamante Bilingüe' : (total >= 5 ? '👑 Oro Inseparables' : (total >= 2 ? '🥈 Plata Cómplices' : '🥉 Bronce Romántico'));
        localStorage.setItem('mastereng_couple_rank', rank);
        return { weekly, total, rank };
      } catch (e) {
        return { weekly: 1, total: 1, rank: '🥉 Bronce Romántico' };
      }
    };
  }

  function getConnectedPartnerName() {
    try {
      const stored = localStorage.getItem('mastereng_active_date_partner') || localStorage.getItem('mastereng_couple_partner_name');
      if (stored && stored.trim()) return stored.trim();
    } catch (e) {}
    return 'Mi Pareja / Amigo Conectado';
  }

  function renderDateNightPhaseUI() {
    if (typeof document === 'undefined') return;
    const panel = document.getElementById('world3dDateSimulatorPanel');
    if (!panel) return;

    const pInfo = WAITER_PHASES[dateNightState.phase] || WAITER_PHASES[1];
    const phaseTitleEl = document.getElementById('dateNightPhaseTitle');
    const waiterTextEl = document.getElementById('dateNightWaiterText');
    const waiterEsEl = document.getElementById('dateNightWaiterEs');
    const partnerBoxEl = document.getElementById('dateNightPartnerBubble');
    const inputEl = document.getElementById('dateNightTranscriptInput');
    const chipsContainer = document.getElementById('dateNightSuggestionsBox');
    const billRow = document.getElementById('dateNightBillOptionsRow');
    const submitBtn = document.getElementById('dateNightSubmitPhaseBtn');
    const partnerPartnerBtn = document.getElementById('datePartnerBtnConnected');
    const partnerAiBtn = document.getElementById('datePartnerBtnAI');

    const storedPartner = getConnectedPartnerName();
    dateNightState.partnerName = dateNightState.partnerMode === 'partner' ? storedPartner : 'Emma / Liam (Compañero IA)';

    if (partnerPartnerBtn && partnerAiBtn) {
      if (dateNightState.partnerMode === 'partner') {
        partnerPartnerBtn.className = 'flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-extrabold bg-rose-600 text-white border border-rose-400 shadow cursor-pointer transition';
        partnerAiBtn.className = 'flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:text-white cursor-pointer transition';
      } else {
        partnerAiBtn.className = 'flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-extrabold bg-rose-600 text-white border border-rose-400 shadow cursor-pointer transition';
        partnerPartnerBtn.className = 'flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:text-white cursor-pointer transition';
      }
      partnerPartnerBtn.textContent = `💑 Con Pareja (${storedPartner})`;
    }

    if (phaseTitleEl) phaseTitleEl.textContent = pInfo.title;
    if (waiterTextEl) waiterTextEl.textContent = `"${pInfo.waiterLine}"`;
    if (waiterEsEl) waiterEsEl.textContent = pInfo.waiterEs;

    if (partnerBoxEl) {
      if (dateNightState.partnerMode === 'ai') {
        partnerBoxEl.innerHTML = `<span class="text-rose-300 font-bold">💖 ${dateNightState.partnerName}:</span> <span class="italic text-slate-200">"${pInfo.aiPartnerLine}"</span>`;
      } else {
        partnerBoxEl.innerHTML = `<span class="text-rose-300 font-bold">💑 Sala Compartida con ${storedPartner}:</span> <span class="text-slate-200">¡Conversen juntos en inglés y respondan al Mesero IA!</span>`;
      }
    }

    if (billRow) {
      billRow.style.display = dateNightState.phase === 3 ? 'flex' : 'none';
    }

    if (chipsContainer && Array.isArray(pInfo.suggestions)) {
      chipsContainer.innerHTML = pInfo.suggestions.map((sug, i) => `
        <button type="button" onclick="window.applyDateSuggestion(${i})"
          class="text-left text-[10px] leading-snug px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-rose-950/80 text-slate-200 hover:text-rose-200 border border-slate-700 hover:border-rose-500/50 transition cursor-pointer">
          💬 "${sug}"
        </button>
      `).join('');
    }

    if (inputEl) {
      inputEl.placeholder = pInfo.placeholder;
      inputEl.value = dateNightState.responses[dateNightState.phase] || '';
    }

    if (submitBtn) {
      submitBtn.innerHTML = dateNightState.phase < 3
        ? `<span>✅ Responder en Inglés y Avanzar (Fase ${dateNightState.phase}/3) →</span>`
        : `<span>🎉 Completar Cita en Inglés (+50 EXP & Progreso de Pareja)</span>`;
    }
  }

  // ============================================================================
  // CONTROL DE ESTADO Y MOVIMIENTO DINÁMICO DEL MESERO (window.setWaiterState)
  // ============================================================================
  const waiterChatHistory = [
    {
      sender: 'waiter',
      text: "Good evening! Welcome to Starlight Bistro. What can I get you two to drink tonight?",
      es: "¡Buenas noches! Bienvenidos a Starlight Bistro. ¿Qué les puedo ofrecer de tomar esta noche?"
    }
  ];

  const partnerChatHistory = [
    {
      sender: 'partner',
      text: "This rooftop terrace is so romantic! Look at the illuminated city skyline behind us.",
      es: "¡Esta terraza es tan romántica! Mira los edificios iluminados de la ciudad detrás de nosotros."
    }
  ];

  function renderDatingWaiterChatMessages() {
    if (typeof document === 'undefined') return;
    const box = document.getElementById('datingWaiterChatHistory');
    if (!box) return;
    box.innerHTML = waiterChatHistory.map(msg => {
      if (msg.sender === 'waiter') {
        return `
          <div class="p-2 rounded-xl bg-slate-900/95 border border-amber-500/35 text-[11px] leading-snug space-y-0.5">
            <div class="font-extrabold text-amber-300 text-[10px]">🤵 Waiter NPC</div>
            <div class="text-white font-semibold">"${msg.text}"</div>
            ${msg.es ? `<div class="text-[10px] text-slate-400 italic">${msg.es}</div>` : ''}
          </div>
        `;
      }
      return `
        <div class="p-2 rounded-xl bg-sky-950/70 border border-sky-500/40 text-[11px] leading-snug text-right">
          <div class="font-extrabold text-sky-300 text-[10px]">👤 Tú</div>
          <div class="text-white font-semibold">"${msg.text}"</div>
        </div>
      `;
    }).join('');
    box.scrollTop = box.scrollHeight;
  }

  function renderDatingPartnerChatMessages() {
    if (typeof document === 'undefined') return;
    const box = document.getElementById('datingPartnerChatHistory');
    if (!box) return;
    const partnerName = getConnectedPartnerName();
    box.innerHTML = partnerChatHistory.map(msg => {
      if (msg.sender === 'partner') {
        return `
          <div class="p-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-[11px] leading-snug space-y-0.5">
            <div class="font-extrabold text-rose-300 text-[10px]">❤️ ${partnerName}</div>
            <div class="text-white font-semibold">"${msg.text}"</div>
            ${msg.es ? `<div class="text-[10px] text-rose-200/75 italic">${msg.es}</div>` : ''}
          </div>
        `;
      }
      return `
        <div class="p-2 rounded-xl bg-purple-950/70 border border-purple-500/40 text-[11px] leading-snug text-right">
          <div class="font-extrabold text-purple-300 text-[10px]">👤 Tú</div>
          <div class="text-white font-semibold">"${msg.text}"</div>
        </div>
      `;
    }).join('');
    box.scrollTop = box.scrollHeight;
  }

  function setWaiterState(state, options) {
    const opts = options || {};
    const normalized = (state === 'leaving' || state === 'station') ? 'leaving' : 'approaching';
    waiterCurrentState = normalized;

    if (waiterAutoLeaveTimer) {
      clearTimeout(waiterAutoLeaveTimer);
      waiterAutoLeaveTimer = null;
    }

    if (normalized === 'approaching') {
      // Se acerca caminando a WAITER_TABLE_POS = { x: 0.0, y: 0, z: -1.45 }, mirando hacia la pareja en rotation.y = 0
      waiterTargetPos = { x: WAITER_TABLE_POS.x, y: WAITER_TABLE_POS.y, z: WAITER_TABLE_POS.z };
      if (typeof THREE !== 'undefined') {
        waiterLerp.targetPos.set(WAITER_TABLE_POS.x, WAITER_TABLE_POS.y, WAITER_TABLE_POS.z);
        waiterLerp.targetRotY = 0;
        waiterLerp.active = true;
      }
      const statusBadge = typeof document !== 'undefined' ? document.getElementById('datingWaiterStatusBadge') : null;
      if (statusBadge) {
        statusBadge.textContent = '🟢 En la mesa';
        statusBadge.className = 'px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[9px] font-extrabold text-emerald-300';
      }
      if (!opts.silent) {
        const greetLine = opts.customReply || "Here I am! How may I assist you two tonight?";
        showRobloxOverheadBubble('waiter', greetLine);
        speakWorld3DText(greetLine);
      }
    } else {
      // Se despide cortésmente y camina de regreso a WAITER_STATION_POS = { x: 2.8, y: 0, z: -2.4 }
      const leaveLine = opts.customReply || "Right away! I'll give you two some privacy while I prepare your order.";
      waiterTargetPos = { x: WAITER_STATION_POS.x, y: WAITER_STATION_POS.y, z: WAITER_STATION_POS.z };
      if (typeof THREE !== 'undefined') {
        waiterLerp.targetPos.set(WAITER_STATION_POS.x, WAITER_STATION_POS.y, WAITER_STATION_POS.z);
        waiterLerp.targetRotY = -0.45;
        waiterLerp.active = true;
      }
      const statusBadge = typeof document !== 'undefined' ? document.getElementById('datingWaiterStatusBadge') : null;
      if (statusBadge) {
        statusBadge.textContent = '🚶 En estación (Privacidad)';
        statusBadge.className = 'px-2 py-0.5 rounded-full bg-slate-800 border border-slate-600 text-[9px] font-bold text-slate-300';
      }
      if (!opts.silent) {
        waiterChatHistory.push({
          sender: 'waiter',
          text: leaveLine,
          es: '¡En seguida! Les daré privacidad a los dos mientras preparo su pedido.'
        });
        renderDatingWaiterChatMessages();
        showRobloxOverheadBubble('waiter', leaveLine);
        speakWorld3DText(leaveLine);
      }
    }
    return waiterCurrentState;
  }
  global.setWaiterState = setWaiterState;

  function setPlayerAvatarGender(gender) {
    const g = gender === 'female' ? 'female' : 'male';
    try { localStorage.setItem('mastereng_player_gender', g); } catch (e) {}
    rebuildDatingSeatedAvatars();
    updateDatingGenderButtonsUI();
  }
  global.setPlayerAvatarGender = setPlayerAvatarGender;

  function setPartnerAvatarGender(gender) {
    const g = (gender === 'male' || gender === 'waiting') ? gender : 'female';
    try { localStorage.setItem('mastereng_partner_gender', g); } catch (e) {}
    rebuildDatingSeatedAvatars();
    updateDatingGenderButtonsUI();
  }
  global.setPartnerAvatarGender = setPartnerAvatarGender;

  function updateDatingGenderButtonsUI() {
    if (typeof document === 'undefined') return;
    const pGender = getSavedPlayerGender();
    const cGender = getSavedPartnerGender();

    const btnPMale = document.getElementById('btnPlayerGenderMale');
    const btnPFemale = document.getElementById('btnPlayerGenderFemale');
    if (btnPMale && btnPFemale) {
      btnPMale.className = pGender === 'male'
        ? 'px-2 py-1 rounded-lg bg-sky-600 text-white text-[10px] font-extrabold border border-sky-300 shadow cursor-pointer'
        : 'px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-700 cursor-pointer';
      btnPFemale.className = pGender === 'female'
        ? 'px-2 py-1 rounded-lg bg-pink-600 text-white text-[10px] font-extrabold border border-pink-300 shadow cursor-pointer'
        : 'px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-700 cursor-pointer';
    }

    const btnCFemale = document.getElementById('btnPartnerGenderFemale');
    const btnCMale = document.getElementById('btnPartnerGenderMale');
    const btnCWait = document.getElementById('btnPartnerGenderWaiting');
    if (btnCFemale && btnCMale && btnCWait) {
      btnCFemale.className = cGender === 'female'
        ? 'px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-extrabold border border-rose-300 shadow cursor-pointer'
        : 'px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-700 cursor-pointer';
      btnCMale.className = cGender === 'male'
        ? 'px-2 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-extrabold border border-indigo-300 shadow cursor-pointer'
        : 'px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-700 cursor-pointer';
      btnCWait.className = cGender === 'waiting'
        ? 'px-2 py-1 rounded-lg bg-amber-600 text-white text-[10px] font-extrabold border border-amber-300 shadow cursor-pointer'
        : 'px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-700 cursor-pointer';
    }
  }

  function sendDatingWaiterMessage(customText) {
    const inputEl = typeof document !== 'undefined' ? document.getElementById('datingWaiterInput') : null;
    const rawText = customText !== undefined ? String(customText) : (inputEl ? inputEl.value : '');
    const text = rawText.trim();
    if (!text) return;
    if (inputEl && customText === undefined) inputEl.value = '';

    waiterChatHistory.push({ sender: 'player', text: text });
    renderDatingWaiterChatMessages();
    showRobloxOverheadBubble('player', text);

    const lower = text.toLowerCase();
    const isDismissing =
      lower.includes('thank you') ||
      lower.includes('give us a moment') ||
      lower.includes('go away') ||
      lower.includes("that's all") ||
      lower.includes('thats all');

    if (isDismissing) {
      setWaiterState('leaving');
      return;
    }

    // Si pide algo o llama al mesero ("waiter", "menu", "order", "water", "wine", "bill", "check", "help", etc.)
    setWaiterState('approaching', { silent: true });

    let replyEn = "Right away! I'll bring that to your table in just a moment.";
    let replyEs = "¡En seguida! Se lo traeré a su mesa en un momento.";

    if (lower.includes('bill') || lower.includes('check') || lower.includes('split') || lower.includes('treat')) {
      replyEn = "Certainly! Here is your bill folder. Thank you for dining at Starlight Bistro tonight!";
      replyEs = "¡Por supuesto! Aquí está su carpeta con la cuenta. ¡Gracias por cenar en Starlight Bistro!";
    } else if (lower.includes('wine') || lower.includes('water') || lower.includes('cider') || lower.includes('drink')) {
      replyEn = "Wonderful choice! Two glasses of our finest vintage and sparkling water coming right up.";
      replyEs = "¡Excelente elección! Dos copas de nuestra mejor cosecha y agua mineral en camino.";
    } else if (lower.includes('menu') || lower.includes('recommend') || lower.includes('special')) {
      replyEn = "Tonight's chef special is grilled herb steak or Atlantic salmon with warm chocolate lava cake!";
      replyEs = "¡El especial del chef hoy es filete a las finas hierbas o salmón con pastel de chocolate tibio!";
    } else if (lower.includes('steak') || lower.includes('salmon') || lower.includes('dessert') || lower.includes('chocolate') || lower.includes('order')) {
      replyEn = "Right away! I'll give you two some privacy while I prepare your order.";
      replyEs = "¡En seguida! Les daré privacidad mientras preparo su pedido.";
    }

    waiterChatHistory.push({ sender: 'waiter', text: replyEn, es: replyEs });
    renderDatingWaiterChatMessages();
    showRobloxOverheadBubble('waiter', replyEn);
    speakWorld3DText(replyEn);

    if (typeof global.addExp === 'function') {
      global.addExp(10, 'Orden en Inglés al Mesero IA (Romantic Date 3D)');
    }

    // Después de tomar el pedido, el Mesero regresa a su estación para dejar hablar en privado con la cita
    if (waiterAutoLeaveTimer) clearTimeout(waiterAutoLeaveTimer);
    waiterAutoLeaveTimer = setTimeout(() => {
      waiterTargetPos = { x: WAITER_STATION_POS.x, y: WAITER_STATION_POS.y, z: WAITER_STATION_POS.z };
      if (typeof THREE !== 'undefined') {
        waiterLerp.targetPos.set(WAITER_STATION_POS.x, WAITER_STATION_POS.y, WAITER_STATION_POS.z);
        waiterLerp.targetRotY = -0.45;
        waiterLerp.active = true;
      }
      waiterCurrentState = 'leaving';
      const statusBadge = typeof document !== 'undefined' ? document.getElementById('datingWaiterStatusBadge') : null;
      if (statusBadge) {
        statusBadge.textContent = '🚶 En estación (Privacidad)';
        statusBadge.className = 'px-2 py-0.5 rounded-full bg-slate-800 border border-slate-600 text-[9px] font-bold text-slate-300';
      }
    }, 4200);
  }
  global.sendDatingWaiterMessage = sendDatingWaiterMessage;

  function sendDatingPartnerMessage(customText) {
    const inputEl = typeof document !== 'undefined' ? document.getElementById('datingPartnerInput') : null;
    const rawText = customText !== undefined ? String(customText) : (inputEl ? inputEl.value : '');
    const text = rawText.trim();
    if (!text) return;
    if (inputEl && customText === undefined) inputEl.value = '';

    // Asegurar que la cita esté sentada en la silla derecha si estaba esperando
    if (getSavedPartnerGender() === 'waiting') {
      setPartnerAvatarGender('female');
    }

    partnerChatHistory.push({ sender: 'player', text: text });
    renderDatingPartnerChatMessages();
    showRobloxOverheadBubble('player', text);

    const lower = text.toLowerCase();
    // Si dentro del chat también menciona palabras para el mesero ("waiter", "menu", "order", "water", "wine", "bill", "check", "help")
    if (/\b(waiter|menu|order|water|wine|bill|check|help)\b/i.test(lower)) {
      setWaiterState('approaching', { silent: true });
    } else if (lower.includes('thank you') || lower.includes('give us a moment') || lower.includes('go away') || lower.includes("that's all")) {
      setWaiterState('leaving');
    }

    const aiReplies = [
      {
        en: "I love talking with you in English! You make this starry night feel magical.",
        es: "¡Me encanta hablar contigo en inglés! Haces que esta noche estrellada se sienta mágica."
      },
      {
        en: "That is so sweet! Tell me, what is your favorite dream trip we should take together?",
        es: "¡Qué lindo! Dime, ¿cuál es el viaje de tus sueños que deberíamos hacer juntos?"
      },
      {
        en: "Cheers to us! Practicing English at this romantic bistro with you is my favorite part of the day.",
        es: "¡Salud por nosotros! Practicar inglés en este bistró contigo es mi parte favorita del día."
      },
      {
        en: "You have such a great smile and your English sounds more fluent every single day!",
        es: "¡Tienes una sonrisa increíble y tu inglés suena más fluido cada día!"
      }
    ];
    const picked = aiReplies[partnerChatHistory.length % aiReplies.length];

    setTimeout(() => {
      partnerChatHistory.push({ sender: 'partner', text: picked.en, es: picked.es });
      renderDatingPartnerChatMessages();
      showRobloxOverheadBubble('partner', picked.en);
      speakWorld3DText(picked.en);
    }, 950);

    if (typeof global.addExp === 'function') {
      global.addExp(10, 'Conversación en Inglés con tu Cita (Romantic Date 3D)');
    }
  }
  global.sendDatingPartnerMessage = sendDatingPartnerMessage;

  function startDatingVoiceInput(targetChat) {
    if (typeof window === 'undefined') return;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const inputId = targetChat === 'waiter' ? 'datingWaiterInput' : 'datingPartnerInput';
    const inputEl = document.getElementById(inputId);

    if (!SpeechRec) {
      if (typeof global.showFloatingToast === 'function') {
        global.showFloatingToast('🎙️ Dictado de voz no disponible en este navegador; escribe tu mensaje en inglés.', '⌨️');
      }
      if (inputEl) inputEl.focus();
      return;
    }

    const rec = new SpeechRec();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    if (typeof global.showFloatingToast === 'function') {
      global.showFloatingToast('🎤 Escuchando en inglés... Habla ahora.', '🎙️');
    }
    rec.onresult = function (event) {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (transcript.trim()) {
        if (inputEl) inputEl.value = transcript.trim();
        if (targetChat === 'waiter') {
          sendDatingWaiterMessage(transcript.trim());
        } else {
          sendDatingPartnerMessage(transcript.trim());
        }
      }
    };
    try { rec.start(); } catch (e) {}
  }
  global.startDatingVoiceInput = startDatingVoiceInput;

  // Modal de Invitación de Amigo o Pareja (De tu Lista de Contactos o por ID Único MENG-XXXX)
  function getStoredFriendsListForDating() {
    const list = [];
    try {
      const keys = ['mastereng_friends_list', 'english_app_friends', 'mastereng_contacts'];
      keys.forEach(k => {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach(item => {
              if (item && (item.name || item.username || item.id)) {
                list.push({
                  id: item.id || item.code || 'MENG-7742',
                  name: item.name || item.username || 'Amigo Conectado',
                  gender: item.gender || 'female'
                });
              }
            });
          }
        }
      });
    } catch (e) {}
    if (list.length === 0) {
      list.push(
        { id: 'MENG-2048', name: 'Sofia (Pareja / BFF)', gender: 'female' },
        { id: 'MENG-5190', name: 'Alex (Study Partner)', gender: 'male' },
        { id: 'MENG-8831', name: 'Emma (C1 Tutor Friend)', gender: 'female' }
      );
    }
    return list;
  }

  function openDatingInviteModal() {
    if (typeof document === 'undefined') return;
    let modal = document.getElementById('datingInviteModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'datingInviteModal';
      modal.style.cssText = 'position: fixed; inset: 0; z-index: 99999; background: rgba(2, 6, 23, 0.82); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 16px;';
      document.body.appendChild(modal);
    }
    const friends = getStoredFriendsListForDating();
    modal.innerHTML = `
      <div class="bg-slate-950 border-2 border-rose-500/80 rounded-3xl p-5 max-w-md w-full text-white shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div>
            <h3 class="text-base font-black text-rose-300 flex items-center gap-1.5">💌 Invitar Amigo o Pareja a la Mesa 3D</h3>
            <p class="text-[11px] text-slate-400">Elige de tu lista de contactos o ingresa su ID Único (MENG-XXXX)</p>
          </div>
          <button type="button" onclick="window.closeDatingInviteModal()"
            class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold cursor-pointer">&times;</button>
        </div>

        <div class="space-y-1.5">
          <div class="text-[11px] font-extrabold uppercase tracking-wider text-rose-200">👥 Tus Contactos Agregados</div>
          <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            ${friends.map(f => `
              <div class="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition">
                <div>
                  <div class="text-xs font-extrabold text-white">${f.name}</div>
                  <div class="text-[10px] font-mono text-sky-400">ID: ${f.id}</div>
                </div>
                <button type="button" onclick="window.confirmDatingPartnerInvite('${f.id}', '${f.name.replace(/'/g, '')}', '${f.gender || 'female'}')"
                  class="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-extrabold shadow cursor-pointer">
                  💌 Invitar y Sentar
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-slate-800">
          <label class="block text-[11px] font-extrabold uppercase tracking-wider text-amber-300">🔑 O Invitar por ID Único (MENG-XXXX)</label>
          <div class="flex items-center gap-2">
            <input id="datingInviteCustomIdInput" type="text" placeholder="Ej: MENG-4821 o Nombre"
              class="flex-1 rounded-xl bg-slate-900 border border-slate-700 focus:border-rose-400 text-xs text-white px-3 py-2 focus:outline-none" />
            <button type="button" onclick="window.submitCustomDatingInviteId()"
              class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-extrabold shadow cursor-pointer">
              Enviar Invitación
            </button>
          </div>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
  }
  global.openDatingInviteModal = openDatingInviteModal;

  function closeDatingInviteModal() {
    const modal = typeof document !== 'undefined' ? document.getElementById('datingInviteModal') : null;
    if (modal) modal.style.display = 'none';
  }
  global.closeDatingInviteModal = closeDatingInviteModal;

  function confirmDatingPartnerInvite(targetId, targetName, genderHint) {
    const cleanId = (targetId || 'MENG-1024').trim();
    const cleanName = (targetName || cleanId).trim();
    try {
      localStorage.setItem('mastereng_active_date_partner', cleanName);
      localStorage.setItem('mastereng_couple_partner_name', cleanName);
      localStorage.setItem('mastereng_active_date_partner_id', cleanId);
      const nextGender = (genderHint === 'male' || genderHint === 'female')
        ? genderHint
        : (getSavedPartnerGender() === 'waiting' ? 'female' : getSavedPartnerGender());
      localStorage.setItem('mastereng_partner_gender', nextGender);
    } catch (e) {}

    // Enviar invitación real al Buzón y al Chat de la app si existe window.sendGlobalAppInvite
    if (typeof window !== 'undefined' && typeof window.sendGlobalAppInvite === 'function') {
      try {
        window.sendGlobalAppInvite(cleanId, {
          type: 'romantic_date_3d',
          scenario: 'dating',
          partnerName: cleanName,
          message: `🕯️ ¡Te invité a nuestra mesa para dos en Romantic Date & Bistro 3D! (${cleanId})`
        });
      } catch (e) {}
    }

    // Sentar el avatar de la cita inmediatamente en la silla derecha (x: 1.25, z: 0)
    rebuildDatingSeatedAvatars();
    updateDatingGenderButtonsUI();
    closeDatingInviteModal();

    const partnerTitleEl = typeof document !== 'undefined' ? document.getElementById('datingPartnerPanelNameBadge') : null;
    if (partnerTitleEl) partnerTitleEl.textContent = cleanName;

    const welcomeMsg = `Hi! I just joined your table (${cleanId}). Let's order something delicious in English!`;
    partnerChatHistory.push({
      sender: 'partner',
      text: welcomeMsg,
      es: `¡Hola! Me acabo de sentar en tu mesa (${cleanId}). ¡Pidamos algo delicioso en inglés!`
    });
    renderDatingPartnerChatMessages();
    showRobloxOverheadBubble('partner', welcomeMsg);
    speakWorld3DText(welcomeMsg);

    if (typeof global.showFloatingToast === 'function') {
      global.showFloatingToast(`💌 Invitación enviada a ${cleanName} (${cleanId}) al Buzón y Chat. ¡Ya está sentado(a) frente a ti!`, '💑');
    }
  }
  global.confirmDatingPartnerInvite = confirmDatingPartnerInvite;

  function submitCustomDatingInviteId() {
    const input = typeof document !== 'undefined' ? document.getElementById('datingInviteCustomIdInput') : null;
    const val = input ? input.value.trim() : '';
    if (!val) return;
    const isCode = /^MENG-/i.test(val);
    const id = isCode ? val.toUpperCase() : `MENG-${Math.floor(1000 + Math.random() * 9000)}`;
    const name = isCode ? `Invitado (${id})` : val;
    confirmDatingPartnerInvite(id, name, getSavedPartnerGender() === 'male' ? 'male' : 'female');
  }
  global.submitCustomDatingInviteId = submitCustomDatingInviteId;

  function toggleDatingDualPanelsVisibility(visible) {
    if (typeof document === 'undefined') return;
    const waiterPanel = document.getElementById('datingWaiterChatPanel');
    const partnerPanel = document.getElementById('datingPartnerChatPanel');
    const genderBar = document.getElementById('datingAvatarGenderSelectorBar');
    const legacyPanel = document.getElementById('world3dDateSimulatorPanel');
    if (legacyPanel) {
      legacyPanel.classList.add('hidden');
      legacyPanel.style.display = 'none';
    }
    [waiterPanel, partnerPanel, genderBar].forEach(el => {
      if (!el) return;
      if (visible) {
        el.classList.remove('hidden');
        el.style.display = el.id === 'datingAvatarGenderSelectorBar' ? 'flex' : 'block';
      } else {
        el.classList.add('hidden');
        el.style.display = 'none';
      }
    });
    if (visible) {
      updateDatingGenderButtonsUI();
      renderDatingWaiterChatMessages();
      renderDatingPartnerChatMessages();
    }
  }

  global.triggerWaiterEvent = function (phaseOverride) {
    if (typeof phaseOverride === 'number' && phaseOverride >= 1 && phaseOverride <= 3) {
      dateNightState.phase = phaseOverride;
    }
    if (currentScenarioKey === 'dating') {
      toggleDatingDualPanelsVisibility(true);
    }
    setWaiterState('approaching', {
      customReply: (WAITER_PHASES[dateNightState.phase] || WAITER_PHASES[1]).waiterLine
    });
  };

  global.openDateNightSimulator = function () {
    if (currentScenarioKey !== 'dating') {
      switch3DScenario('dating');
    } else {
      toggleDatingDualPanelsVisibility(true);
      setWaiterState('approaching');
    }
  };

  global.closeDateNightSimulator = function () {
    toggleDatingDualPanelsVisibility(false);
  };

  global.setDatePartnerMode = function (mode) {
    dateNightState.partnerMode = mode === 'partner' ? 'partner' : 'ai';
    if (mode === 'partner') openDatingInviteModal();
  };

  global.applyDateSuggestion = function (idx) {
    const pInfo = WAITER_PHASES[dateNightState.phase] || WAITER_PHASES[1];
    const text = (pInfo.suggestions && pInfo.suggestions[idx]) || '';
    if (text) sendDatingWaiterMessage(text);
  };

  global.selectDateBillOption = function (choice) {
    dateNightState.billChoice = choice;
    const sample = choice === 'Split the bill'
      ? "Thank you! Everything was wonderful. We would like to split the bill equally, please."
      : "This dinner was amazing! I would love to treat my partner tonight—please bring the bill.";
    sendDatingWaiterMessage(sample);
  };

  global.toggleDateVoiceInput = function () {
    startDatingVoiceInput('waiter');
  };

  global.submitDatePhaseResponse = function () {
    sendDatingWaiterMessage();
  };

  function ensureWorld3DHudElements(containerEl) {
    if (typeof document === 'undefined' || !containerEl) return;

    // Inyectar estilos del Tutorial de Mano para nuevos usuarios
    if (!document.getElementById('world3dTutorialHandStyles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'world3dTutorialHandStyles';
      styleEl.textContent = `
        .tutorial-hand-pointer {
          position: absolute;
          z-index: 75;
          pointer-events: none;
          transform: translate(-50%, -100%);
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.92);
          border: 1.5px solid rgba(192, 132, 252, 0.85);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 10px 25px rgba(168, 85, 247, 0.45);
          animation: world3dHandBounce 1.2s ease-in-out infinite;
        }
        @keyframes world3dHandBounce {
          0%, 100% { transform: translate(-50%, -105%) scale(1); }
          50% { transform: translate(-50%, -122%) scale(1.06); }
        }
      `;
      document.head.appendChild(styleEl);
    }

    // Eliminar cualquier barra antigua superpuesta (#world3dControlHudBar)
    const legacyHudBar = document.getElementById('world3dControlHudBar');
    if (legacyHudBar) legacyHudBar.remove();

    // Ocultar botón flotante suelto #world3dFloatingBackBtn
    let floatBackBtn = document.getElementById('world3dFloatingBackBtn');
    if (floatBackBtn) {
      floatBackBtn.classList.add('hidden');
      floatBackBtn.style.setProperty('display', 'none', 'important');
    }

    // 2. TUTORIAL INTERACTIVO (MANO/FLECHA PARA NUEVOS USUARIOS)
    const threeCanvasHost = document.getElementById('threeCanvasContainer') || containerEl;
    if (localStorage.getItem('mastereng_3d_tutorial_done') !== 'true') {
      if (threeCanvasHost && !document.getElementById('world3dTutorialHand')) {
        const handWrap = document.createElement('div');
        handWrap.innerHTML = '<div id="world3dTutorialHand" class="tutorial-hand-pointer">👆<span>¡Toca un objeto 3D para aprender! (+5 EXP)</span></div>';
        const handEl = handWrap.firstElementChild;
        if (handEl) {
          handEl.style.left = '50%';
          handEl.style.top = '52%';
          threeCanvasHost.appendChild(handEl);
        }
      }
    }

    // Función deduplicadora que garantiza que SOLO EXISTA UNA BARRA SUPERIOR UNIFICADA
    window.deduplicateWorld3DBars = function() {
      const worldTour = document.getElementById('view-worldtour');
      if (!worldTour) return;

      const floatingBack = document.getElementById('world3dFloatingBackBtn');
      if (floatingBack) {
        floatingBack.classList.add('hidden');
        floatingBack.style.setProperty('display', 'none', 'important');
      }
      const oldTopBar = document.getElementById('worldTourTopBar');
      if (oldTopBar) {
        oldTopBar.classList.add('hidden');
        oldTopBar.style.setProperty('display', 'none', 'important');
      }

      const oldHud = document.getElementById('world3dControlHudBar');
      if (oldHud) oldHud.remove();

      const candidateBars = [];
      worldTour.querySelectorAll('div, nav').forEach(function(el) {
        const txt = (el.innerText || '').trim();
        if ((txt.includes('Vista General') && txt.includes('Ir a la Sala')) || el.id === 'unified-world3d-cam-bar' || el.id === 'world3dCameraControlsBar') {
          const hasDirectButtons = Array.from(el.children).some(c => c.tagName === 'BUTTON');
          if (hasDirectButtons && !candidateBars.includes(el)) candidateBars.push(el);
        }
      });

      if (candidateBars.length > 1) {
        for (let i = 1; i < candidateBars.length; i++) {
          candidateBars[i].remove();
        }
      }

      if (candidateBars.length >= 1) {
        const activeBar = candidateBars[0];
        activeBar.id = 'unified-world3d-cam-bar';
        activeBar.style.cssText = 'position: absolute !important; top: 96px !important; left: 16px !important; right: 16px !important; max-width: calc(100vw - 32px) !important; z-index: 80 !important; display: flex !important; flex-wrap: wrap !important; align-items: center !important; gap: 8px !important; background: rgba(15, 23, 42, 0.88) !important; backdrop-filter: blur(10px) !important; padding: 6px 10px !important; border-radius: 14px !important; border: 1px solid rgba(148, 163, 184, 0.3) !important; pointer-events: auto !important;';
      }
    };

    // BARRA SUPERIOR UNIFICADA (#unified-world3d-cam-bar)
    let cameraButtonsBar = document.getElementById('unified-world3d-cam-bar') || document.getElementById('world3dCameraControlsBar') || document.getElementById('world3dCameraButtonsBar');
    if (!cameraButtonsBar) {
      cameraButtonsBar = document.createElement('div');
      cameraButtonsBar.id = 'unified-world3d-cam-bar';
      cameraButtonsBar.className = 'flex flex-wrap items-center gap-1.5';
      cameraButtonsBar.style.cssText = 'position: absolute; top: 96px; left: 16px; z-index: 80; /* top: 68px; left: 16px; z-index: 60; */ pointer-events: auto; display: flex; flex-wrap: wrap; align-items: center; gap: 6px;';
      cameraButtonsBar.innerHTML = `
        <button type="button" onclick="window.navigateTo('view-home')"
          class="px-3 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-white border border-purple-500/50 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95 flex items-center gap-1">
          <span>← Volver a Portales</span>
        </button>

        <select id="world3dScenarioSelect"
          aria-label="Seleccionar Mundo 3D"
          class="px-3 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-purple-200 border border-purple-500/60 text-[11px] font-extrabold shadow-lg cursor-pointer focus:outline-none">
          <option value="house">🏠 House & Study (12 Objetos)</option>
          <option value="garden">🌿 Backyard & Garden (12 Objetos)</option>
          <option value="dating">🕯️ Romantic Date & Bistro 3D</option>
          <option value="space">🚀 Outer Space & Astronomy</option>
          <option value="supermarket">🛒 Supermarket</option>
          <option value="hotel">🏨 Hotel & Reception</option>
          <option value="restaurant">🍽️ Fine Restaurant</option>
        </select>

        <button type="button" id="world3dCamBtnOverview" onclick="window.focusWorld3DZone('overview')"
          class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-purple-600/90 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
          <span id="world3dCamLabelOverview">🏠 Vista General</span>
        </button>
        <button type="button" id="world3dCamBtnZone1" onclick="window.focusWorld3DZone('zone1')"
          class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-purple-600/90 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
          <span id="world3dCamLabelZone1">🛋️ Ir a la Sala</span>
          <span style="font-size:0;opacity:0;position:absolute;pointer-events:none;">Vista General Ir a la Sala Ir al Estudio Ir al Jardín</span>
        </button>
        <button type="button" id="world3dCamBtnZone2" onclick="window.focusWorld3DZone('zone2')"
          class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-purple-600/90 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
          <span id="world3dCamLabelZone2">💻 Ir al Estudio</span>
        </button>
        <button type="button" id="world3dCamBtnZone3" onclick="window.focusWorld3DZone('zone3')"
          class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-emerald-600/90 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
          <span id="world3dCamLabelZone3">🌳 Ir al Jardín</span>
        </button>

        <button type="button" id="world3dStartDateBtn" onclick="window.openDateNightSimulator()"
          style="display: none;"
          class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white border border-rose-300/60 text-[11px] font-extrabold shadow-lg shadow-rose-600/30 cursor-pointer transition active:scale-95 items-center gap-1">
          <span>💑 Iniciar Cita</span>
        </button>

        <button type="button" id="world3dDayNightBtn" onclick="window.toggleWorld3DDayNight()"
          class="px-3 py-1.5 rounded-xl bg-indigo-950/90 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/40 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
          <span>☀️/🌙</span>
        </button>

        <div class="flex items-center gap-2 bg-slate-950/90 border border-purple-500/40 px-2.5 py-1 rounded-xl">
          <span id="world3dProgressCounter" class="text-[10px] font-black text-white">Objetos descubiertos: 0 / 12</span>
          <span id="world3dLearnedSubBadge" class="hidden sm:inline text-[10px] font-bold text-emerald-400">Aprendidos: 0/12</span>
          <div class="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div id="world3dProgressBarFill" class="h-full bg-gradient-to-r from-purple-500 to-emerald-400" style="width: 0%;"></div>
          </div>
        </div>
      `;
      containerEl.appendChild(cameraButtonsBar);
    }

    const selectEl = document.getElementById('world3dScenarioSelect');
    if (selectEl && !selectEl.dataset.boundWorld3DChange) {
      selectEl.dataset.boundWorld3DChange = 'true';
      selectEl.addEventListener('change', (e) => {
        window.World3D.switchScenario(e.target.value);
      });
    }

    updateScenarioCameraButtons(currentScenarioKey || 'house');

    if (typeof window.deduplicateWorld3DBars === 'function') {
      window.deduplicateWorld3DBars();
    }

    // SELECTORES RÁPIDOS DE GÉNERO DE AVATAR EN LA BARRA SUPERIOR DE LA CITA (dating)
    let genderBar = document.getElementById('datingAvatarGenderSelectorBar');
    if (!genderBar) {
      genderBar = document.createElement('div');
      genderBar.id = 'datingAvatarGenderSelectorBar';
      genderBar.className = 'hidden';
      genderBar.style.cssText = 'position: absolute; top: 146px; left: 16px; right: 16px; z-index: 82; pointer-events: auto; display: none; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px;';
      genderBar.innerHTML = `
        <div class="flex flex-wrap items-center gap-2 bg-slate-950/92 backdrop-blur-md border border-rose-500/50 px-3 py-1.5 rounded-2xl shadow-xl text-white">
          <span class="text-[11px] font-extrabold text-sky-300">👤 Mi Avatar:</span>
          <button type="button" id="btnPlayerGenderMale" onclick="window.setPlayerAvatarGender('male')">♂️ Chico</button>
          <button type="button" id="btnPlayerGenderFemale" onclick="window.setPlayerAvatarGender('female')">♀️ Chica</button>
          <span class="text-slate-600 mx-1">|</span>
          <span class="text-[11px] font-extrabold text-rose-300">💑 Avatar de mi Cita:</span>
          <button type="button" id="btnPartnerGenderFemale" onclick="window.setPartnerAvatarGender('female')">♀️ Chica</button>
          <button type="button" id="btnPartnerGenderMale" onclick="window.setPartnerAvatarGender('male')">♂️ Chico</button>
          <button type="button" id="btnPartnerGenderWaiting" onclick="window.setPartnerAvatarGender('waiting')">⏳ Esperando invitado</button>
        </div>
      `;
      containerEl.appendChild(genderBar);
    }

    // PANEL LATERAL IZQUIERDO COMPACTO: #datingWaiterChatPanel ("🤵 Chat con el Mesero")
    let waiterChatPanel = document.getElementById('datingWaiterChatPanel');
    if (!waiterChatPanel) {
      waiterChatPanel = document.createElement('div');
      waiterChatPanel.id = 'datingWaiterChatPanel';
      waiterChatPanel.className = 'hidden';
      waiterChatPanel.style.cssText = 'position: absolute; bottom: 16px; left: 16px; width: min(330px, 44vw); max-height: calc(100vh - 210px); z-index: 90; pointer-events: auto; display: none;';
      waiterChatPanel.innerHTML = `
        <div class="bg-slate-950/92 backdrop-blur-xl border-2 border-amber-500/65 rounded-3xl p-3.5 shadow-2xl text-white flex flex-col gap-2">
          <div class="flex items-center justify-between gap-1 border-b border-slate-800 pb-2">
            <div>
              <h4 class="text-xs font-black text-amber-300 flex items-center gap-1">🤵 Chat con el Mesero</h4>
              <p class="text-[10px] text-slate-400">Starlight Bistro • Servicio a la Mesa</p>
            </div>
            <span id="datingWaiterStatusBadge" class="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[9px] font-extrabold text-emerald-300">
              🟢 En la mesa
            </span>
          </div>

          <div class="flex items-center gap-1.5">
            <button type="button" onclick="window.setWaiterState('approaching')"
              class="flex-1 py-1.5 px-2 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-white text-[10px] font-extrabold shadow cursor-pointer transition">
              🔔 Llamar al Mesero
            </button>
            <button type="button" onclick="window.setWaiterState('leaving')"
              class="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-[10px] font-bold cursor-pointer transition">
              👋 Despedir Mesero
            </button>
          </div>

          <div id="datingWaiterChatHistory" class="space-y-1.5 max-h-36 overflow-y-auto pr-1"></div>

          <div class="flex flex-wrap gap-1">
            <button type="button" onclick="window.sendDatingWaiterMessage('Could we see the menu and two glasses of red wine, please?')"
              class="px-2 py-1 rounded-lg bg-slate-900 hover:bg-amber-950 text-amber-200 border border-amber-500/30 text-[9px] font-bold cursor-pointer">
              🍷 Order Wine & Menu
            </button>
            <button type="button" onclick="window.sendDatingWaiterMessage('We would like to order the steak and salmon, please.')"
              class="px-2 py-1 rounded-lg bg-slate-900 hover:bg-amber-950 text-amber-200 border border-amber-500/30 text-[9px] font-bold cursor-pointer">
              🥩 Order Dinner
            </button>
            <button type="button" onclick="window.sendDatingWaiterMessage('Could we have the bill, please? Thank you!')"
              class="px-2 py-1 rounded-lg bg-slate-900 hover:bg-amber-950 text-amber-200 border border-amber-500/30 text-[9px] font-bold cursor-pointer">
              💳 Ask for Bill
            </button>
          </div>

          <div class="flex items-center gap-1.5 pt-1">
            <input id="datingWaiterInput" type="text"
              placeholder="Pide al mesero en inglés (wine, menu, bill...)"
              onkeydown="if(event.key==='Enter'){window.sendDatingWaiterMessage();}"
              class="flex-1 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-[11px] text-white px-2.5 py-1.5 focus:outline-none" />
            <button type="button" onclick="window.startDatingVoiceInput('waiter')" title="Hablar al Mesero en Inglés"
              class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 text-xs font-bold cursor-pointer">
              🎤
            </button>
            <button type="button" onclick="window.sendDatingWaiterMessage()"
              class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-extrabold shadow cursor-pointer">
              Enviar
            </button>
          </div>
        </div>
      `;
      containerEl.appendChild(waiterChatPanel);
    }

    // PANEL LATERAL DERECHO COMPACTO: #datingPartnerChatPanel ("❤️ Chat con tu Cita")
    let partnerChatPanel = document.getElementById('datingPartnerChatPanel');
    if (!partnerChatPanel) {
      partnerChatPanel = document.createElement('div');
      partnerChatPanel.id = 'datingPartnerChatPanel';
      partnerChatPanel.className = 'hidden';
      partnerChatPanel.style.cssText = 'position: absolute; bottom: 16px; right: 16px; width: min(330px, 44vw); max-height: calc(100vh - 210px); z-index: 90; pointer-events: auto; display: none;';
      partnerChatPanel.innerHTML = `
        <div class="bg-slate-950/92 backdrop-blur-xl border-2 border-rose-500/70 rounded-3xl p-3.5 shadow-2xl text-white flex flex-col gap-2">
          <div class="flex items-center justify-between gap-1 border-b border-slate-800 pb-2">
            <div>
              <h4 class="text-xs font-black text-rose-300 flex items-center gap-1">❤️ Chat con tu Cita</h4>
              <p id="datingPartnerPanelNameBadge" class="text-[10px] font-bold text-slate-400">${getConnectedPartnerName()}</p>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-[9px] font-extrabold text-rose-200">
              💬 Burbujas 3D
            </span>
          </div>

          <button type="button" id="datingOpenInviteModalBtn" onclick="window.openDatingInviteModal()"
            class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white border border-rose-300/60 text-[11px] font-extrabold shadow-lg cursor-pointer transition flex items-center justify-center gap-1.5">
            <span>💌 Invitar Amigo o Pareja (De tu Lista o por ID)</span>
          </button>

          <div id="datingPartnerChatHistory" class="space-y-1.5 max-h-36 overflow-y-auto pr-1"></div>

          <div class="flex flex-wrap gap-1">
            <button type="button" onclick="window.sendDatingPartnerMessage('You look amazing tonight! What would you like to order?')"
              class="px-2 py-1 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-200 border border-rose-500/30 text-[9px] font-bold cursor-pointer">
              💖 Compliment Date
            </button>
            <button type="button" onclick="window.sendDatingPartnerMessage('Cheers! I love practicing English with you on this terrace.')"
              class="px-2 py-1 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-200 border border-rose-500/30 text-[9px] font-bold cursor-pointer">
              🥂 Make a Toast
            </button>
          </div>

          <div class="flex items-center gap-1.5 pt-1">
            <input id="datingPartnerInput" type="text"
              placeholder="Habla con tu cita en inglés..."
              onkeydown="if(event.key==='Enter'){window.sendDatingPartnerMessage();}"
              class="flex-1 rounded-xl bg-slate-900 border border-slate-700 focus:border-rose-400 text-[11px] text-white px-2.5 py-1.5 focus:outline-none" />
            <button type="button" onclick="window.startDatingVoiceInput('partner')" title="Hablar a tu Cita en Inglés"
              class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-600 text-xs font-bold cursor-pointer">
              🎤
            </button>
            <button type="button" onclick="window.sendDatingPartnerMessage()"
              class="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-extrabold shadow cursor-pointer">
              Enviar
            </button>
          </div>
        </div>
      `;
      containerEl.appendChild(partnerChatPanel);
    }

    toggleDatingDualPanelsVisibility(currentScenarioKey === 'dating');

    let vocabCard = document.getElementById('world3dVocabHudCard');
    if (!vocabCard) {
      vocabCard = document.createElement('div');
      vocabCard.id = 'world3dVocabHudCard';
      vocabCard.className = 'hidden';
      vocabCard.style.cssText = 'position: absolute; bottom: 16px; right: 16px; width: min(360px, calc(100% - 32px)); z-index: 9999; pointer-events: auto; display: none;';
      vocabCard.innerHTML = `
        <div class="bg-slate-900/95 backdrop-blur-xl border-2 border-purple-500/70 rounded-3xl p-4 shadow-2xl text-white">
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-1.5">
              <span id="hudObjCategoryBadge" class="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-[10px] font-black uppercase tracking-wider text-purple-300">
                Living Room
              </span>
              <span id="hudObjLearnedBadge" class="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300">
                Nuevo Objeto ✨
              </span>
            </div>
            <button type="button" onclick="window.closeWorld3DInspectCard()"
              class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer transition">
              &times;
            </button>
          </div>

          <div class="mb-2">
            <h3 id="hudObjWordEn" class="text-2xl font-black text-white tracking-tight leading-tight">Sofa / Couch</h3>
            <div class="flex items-center gap-2 mt-0.5">
              <span id="hudObjPhonetic" class="text-xs font-mono font-bold text-sky-400">/ˈsoʊ.fə/</span>
              <span class="text-slate-600">&bull;</span>
              <span id="hudObjWordEs" class="text-sm font-bold text-emerald-300">Sofá / Sillón</span>
            </div>
          </div>

          <div class="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 italic mb-3">
            "<span id="hudObjExample">I relax on the sofa after studying English.</span>"
          </div>

          <div class="grid grid-cols-1 gap-2">
            <button type="button" id="hudBtnSpeak" onclick="window.speakWorld3DObject()"
              class="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer transition active:scale-95">
              <span>🔊 Escuchar Pronunciación</span>
            </button>

            <button type="button" id="hudBtnPractice" onclick="window.practiceWorld3DObject()"
              class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition active:scale-95">
              <span>🎙️ Practicar Pronunciación (+10 EXP)</span>
            </button>

            <button type="button" onclick="window.resetWorld3DCamera()"
              class="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95">
              <span>🏠 Vista General del Escenario</span>
            </button>
          </div>
        </div>
      `;
      containerEl.appendChild(vocabCard);
    }

    updateProgressHudCounter();
  }

  // ============================================================================
  // 9. CÁMARA (LERP), RESALTADO EMISIVO Y RAYCASTING CON HOTSPOTS
  // ============================================================================
  function transitionCameraTo(posCoords, lookAtCoords) {
    if (typeof THREE === 'undefined' || !camera || !controls) return;
    cameraLerp.targetPos.set(posCoords.x, posCoords.y, posCoords.z);
    cameraLerp.targetLookAt.set(lookAtCoords.x, lookAtCoords.y, lookAtCoords.z);
    cameraLerp.active = true;
  }

  function updateScenarioCameraButtons(scenarioKey) {
    if (typeof document === 'undefined') return;
    const key = WORLD_TOUR_SCENARIOS[scenarioKey] ? scenarioKey : 'house';
    const scen = WORLD_TOUR_SCENARIOS[key];
    const zones = (scen && scen.zones) ? scen.zones : {
      overview: { label: '🏠 Vista General', pos: scen.cameraPos, lookAt: scen.cameraLookAt },
      zone1: { label: '🛋️ Ir a la Sala', pos: CAMERA_ZONES.living.pos, lookAt: CAMERA_ZONES.living.lookAt },
      zone2: { label: '💻 Ir al Estudio', pos: CAMERA_ZONES.study.pos, lookAt: CAMERA_ZONES.study.lookAt },
      zone3: { label: '🌳 Ir al Jardín', pos: CAMERA_ZONES.garden.pos, lookAt: CAMERA_ZONES.garden.lookAt }
    };

    const lblOverview = document.getElementById('world3dCamLabelOverview');
    const lblZone1 = document.getElementById('world3dCamLabelZone1');
    const lblZone2 = document.getElementById('world3dCamLabelZone2');
    const lblZone3 = document.getElementById('world3dCamLabelZone3');

    if (lblOverview && zones.overview && zones.overview.label) lblOverview.textContent = zones.overview.label;
    if (lblZone1 && zones.zone1 && zones.zone1.label) lblZone1.textContent = zones.zone1.label;
    if (lblZone2 && zones.zone2 && zones.zone2.label) lblZone2.textContent = zones.zone2.label;
    if (lblZone3 && zones.zone3 && zones.zone3.label) lblZone3.textContent = zones.zone3.label;
  }

  function focusWorld3DZone(zoneKey) {
    const activeScen = WORLD_TOUR_SCENARIOS[currentScenarioKey] || WORLD_TOUR_SCENARIOS.house;
    const scenZones = (activeScen && activeScen.zones) ? activeScen.zones : null;
    let zone = null;
    if (scenZones) {
      if (zoneKey === 'overview' && scenZones.overview) zone = scenZones.overview;
      else if ((zoneKey === 'zone1' || zoneKey === 'living') && scenZones.zone1) zone = scenZones.zone1;
      else if ((zoneKey === 'zone2' || zoneKey === 'study') && scenZones.zone2) zone = scenZones.zone2;
      else if ((zoneKey === 'zone3' || zoneKey === 'garden') && scenZones.zone3) zone = scenZones.zone3;
      else if (scenZones[zoneKey]) zone = scenZones[zoneKey];
    }
    if (!zone) {
      zone = CAMERA_ZONES[zoneKey] || (activeScen ? { pos: activeScen.cameraPos, lookAt: activeScen.cameraLookAt } : CAMERA_ZONES.overview);
    }
    if (zone && zone.pos && zone.lookAt) {
      transitionCameraTo(zone.pos, zone.lookAt);
    }

    const btnHouse = typeof document !== 'undefined' ? document.getElementById('scenarioBtnHouse') : null;
    const btnGarden = typeof document !== 'undefined' ? document.getElementById('scenarioBtnGarden') : null;
    if (btnHouse && btnGarden) {
      if (zoneKey === 'garden' || zoneKey === 'zone3') {
        btnGarden.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer bg-purple-600 text-white border border-purple-400";
        btnHouse.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-slate-800 text-slate-300 hover:text-white border border-slate-700";
      } else {
        btnHouse.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer bg-purple-600 text-white border border-purple-400";
        btnGarden.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-slate-800 text-slate-300 hover:text-white border border-slate-700";
      }
    }
  }

  function resetWorld3DCamera() {
    clearSelectedHighlight();
    closeWorld3DInspectCard();
    focusWorld3DZone('overview');
  }

  function clearSelectedHighlight() {
    if (highlightedMaterialsBackup.length > 0) {
      highlightedMaterialsBackup.forEach(entry => {
        if (entry.mesh && entry.originalMaterial) {
          entry.mesh.material = entry.originalMaterial;
        }
      });
      highlightedMaterialsBackup = [];
    }
    selectedObjectGroup = null;
  }

  function clearHoverHighlight() {
    if (hoveredMaterialsBackup.length > 0) {
      hoveredMaterialsBackup.forEach(entry => {
        if (entry.mesh && entry.originalMaterial && entry.mesh !== selectedObjectGroup) {
          entry.mesh.material = entry.originalMaterial;
        }
      });
      hoveredMaterialsBackup = [];
    }
    hoveredObjectGroup = null;
  }

  function setHoverHighlight(group) {
    if (!group || group === selectedObjectGroup || group === hoveredObjectGroup) return;
    clearHoverHighlight();
    hoveredObjectGroup = group;

    group.traverse(child => {
      if (child.isMesh && child.material && child.material.clone) {
        const origMat = child.material;
        const clonedMat = origMat.clone();
        if (clonedMat.emissive) {
          clonedMat.emissive.setHex(0xa855f7);
          clonedMat.emissiveIntensity = 0.38; // sutil contorno / emissive boost
        }
        child.material = clonedMat;
        hoveredMaterialsBackup.push({
          mesh: child,
          originalMaterial: origMat,
          clonedMaterial: clonedMat
        });
      }
    });
  }

  function highlightSelectedObject(group) {
    clearSelectedHighlight();
    clearHoverHighlight();
    if (!group) return;
    selectedObjectGroup = group;
    highlightPulseTime = 0;

    group.traverse(child => {
      if (child.isMesh && child.material && child.material.clone) {
        const origMat = child.material;
        const clonedMat = origMat.clone();
        if (clonedMat.emissive) {
          clonedMat.emissive.setHex(0x38bdf8);
          clonedMat.emissiveIntensity = 0.65;
        }
        child.material = clonedMat;
        highlightedMaterialsBackup.push({
          mesh: child,
          originalMaterial: origMat,
          clonedMaterial: clonedMat
        });
      }
    });
  }

  function selectInteractive3DObject(group) {
    if (!group || !group.userData || !group.userData.interactive) return;
    const data = group.userData;
    selectedObjectData = data;

    // Tutorial interactivo: marcar como completado al primer clic exitoso en un objeto 3D
    try {
      localStorage.setItem('mastereng_3d_tutorial_done', 'true');
    } catch (e) {}
    const tutorialHand = typeof document !== 'undefined' ? document.getElementById('world3dTutorialHand') : null;
    if (tutorialHand) tutorialHand.remove();

    // 1. Otorgar +5 EXP la primera vez que interactúe con un objeto nuevo
    const isFirstTime = !discoveredObjectIds.has(data.id);
    discoveredObjectIds.add(data.id);
    saveProgressToStorage();
    updateProgressHudCounter();

    if (isFirstTime) {
      if (typeof global.addExp === 'function') {
        global.addExp(5, `Descubrimiento 3D: ${data.wordEn}`);
      } else {
        try {
          const raw = localStorage.getItem('english_app_user_session') || localStorage.getItem('mastereng_user');
          const user = raw ? JSON.parse(raw) : { username: 'Invitado', role: 'guest', exp: 0, rank: 'Bronce' };
          user.exp = (parseInt(user.exp, 10) || 0) + 5;
          localStorage.setItem('english_app_user_session', JSON.stringify(user));
          localStorage.setItem('mastereng_user', JSON.stringify(user));
          if (typeof global.updateUserExpDisplay === 'function') global.updateUserExpDisplay();
        } catch (e) { }
      }
      if (typeof global.showFloatingToast === 'function') {
        global.showFloatingToast(`✨ ¡Descubriste "${data.wordEn}"! +5 EXP`, '✨');
      }
    }

    // 2. Resaltar el objeto con brillo sutil / emissive boost
    highlightSelectedObject(group);

    // 3. Transición suave de cámara (Lerp) hacia el objeto
    if (data.focusPos && data.lookAtPos) {
      transitionCameraTo(data.focusPos, data.lookAtPos);
    }

    // 4. Desplegar tarjeta emergente estilizada y reproducir audio en inglés
    renderVocabHudCard(data);
    if (data.id === 'dating_waiter_npc' && typeof global.triggerWaiterEvent === 'function') {
      global.triggerWaiterEvent();
    } else {
      speakWorld3DText(data.wordEn);
    }
  }

  function renderVocabHudCard(data) {
    if (typeof document === 'undefined' || !data) return;

    const isLearned = learnedObjectIds.has(data.id);

    const vocabCard = document.getElementById('world3dVocabHudCard');
    if (vocabCard) {
      const catEl = document.getElementById('hudObjCategoryBadge');
      const learnedBadge = document.getElementById('hudObjLearnedBadge');
      const wordEnEl = document.getElementById('hudObjWordEn');
      const phoneticEl = document.getElementById('hudObjPhonetic');
      const wordEsEl = document.getElementById('hudObjWordEs');
      const exampleEl = document.getElementById('hudObjExample');
      const practiceBtn = document.getElementById('hudBtnPractice');

      if (catEl) catEl.textContent = data.category || 'World Tour 3D';
      if (wordEnEl) wordEnEl.textContent = data.wordEn || data.en;
      if (phoneticEl) phoneticEl.textContent = data.phonetic || data.ipa || '';
      if (wordEsEl) wordEsEl.textContent = data.wordEs || data.es || '';
      if (exampleEl) exampleEl.textContent = data.example || '';

      if (learnedBadge) {
        if (isLearned) {
          learnedBadge.textContent = 'Aprendido ✅';
          learnedBadge.className = 'px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[10px] font-extrabold text-emerald-300';
        } else {
          learnedBadge.textContent = 'Descubierto ✨';
          learnedBadge.className = 'px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-bold text-amber-300';
        }
      }

      if (practiceBtn) {
        if (isLearned) {
          practiceBtn.innerHTML = '<span>✅ Aprendido (+10 EXP Obtenidos) • Repetir</span>';
        } else {
          practiceBtn.innerHTML = '<span>🎙️ Practicar Pronunciación (+10 EXP)</span>';
        }
      }

      vocabCard.classList.remove('hidden');
      vocabCard.style.display = 'block';
    }

    // Sincronizar tarjeta legacy (#threeObjectInspectCard)
    const legacyCard = document.getElementById('threeObjectInspectCard');
    if (legacyCard) {
      const enEl = document.getElementById('threeObjEnName');
      const esEl = document.getElementById('threeObjEsName');
      const ipaEl = document.getElementById('threeObjIpa');
      const catEl = document.getElementById('threeObjCategory');
      const exEl = document.getElementById('threeObjExample');
      if (enEl) enEl.textContent = data.wordEn || data.en;
      if (esEl) esEl.textContent = data.wordEs || data.es;
      if (ipaEl) ipaEl.textContent = data.phonetic || data.ipa || '';
      if (catEl) catEl.textContent = data.category || 'World Tour 3D';
      if (exEl) exEl.textContent = data.example || '';
    }
  }

  function closeWorld3DInspectCard() {
    clearSelectedHighlight();
    clearHoverHighlight();
    if (typeof document === 'undefined') return;
    const card = document.getElementById('world3dVocabHudCard');
    if (card) {
      card.classList.add('hidden');
      card.style.display = 'none';
    }
    const legacyCard = document.getElementById('threeObjectInspectCard');
    if (legacyCard) {
      legacyCard.classList.add('hidden');
      legacyCard.style.display = 'none';
    }
  }

  function speakWorld3DText(text) {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.90;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  }

  function speakWorld3DObject() {
    if (selectedObjectData && (selectedObjectData.wordEn || selectedObjectData.en)) {
      speakWorld3DText(selectedObjectData.wordEn || selectedObjectData.en);
    }
  }

  function practiceWorld3DObject() {
    if (!selectedObjectData) return;
    const data = selectedObjectData;
    speakWorld3DText(data.wordEn);

    const alreadyLearned = learnedObjectIds.has(data.id);
    learnedObjectIds.add(data.id);
    discoveredObjectIds.add(data.id);
    saveProgressToStorage();
    updateProgressHudCounter();

    if (typeof global.addExp === 'function') {
      global.addExp(10, `Vocabulario 3D: ${data.wordEn}`);
    } else {
      try {
        const raw = localStorage.getItem('english_app_user_session') || localStorage.getItem('mastereng_user');
        const user = raw ? JSON.parse(raw) : { username: 'Invitado', role: 'guest', exp: 0, rank: 'Bronce' };
        user.exp = (parseInt(user.exp, 10) || 0) + 10;
        localStorage.setItem('english_app_user_session', JSON.stringify(user));
        localStorage.setItem('mastereng_user', JSON.stringify(user));
        if (typeof global.updateUserExpDisplay === 'function') global.updateUserExpDisplay();
      } catch (e) { }
    }

    if (typeof global.showFloatingToast === 'function') {
      global.showFloatingToast(
        alreadyLearned
          ? `🎙️ ¡Excelente práctica de "${data.wordEn}"! (+10 EXP) • Aprendido ✅`
          : `🎉 ¡Objeto "${data.wordEn}" Aprendido ✅! (+10 EXP)`,
        '✅'
      );
    }

    renderVocabHudCard(data);
  }

  function setupRaycasterInteraction(domElement) {
    if (!domElement || typeof THREE === 'undefined') return;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downX = 0;
    let downY = 0;
    let downTime = 0;

    function handlePointerMove(e) {
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      const rect = domElement.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0 || !camera) return;

      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let hitObj = intersects[0].object;
        let targetGroup = (hitObj.userData && (hitObj.userData.parentGroup || (hitObj.userData.isHotspot ? hitObj.userData.parentGroup : null))) || null;
        if (!targetGroup) {
          while (hitObj.parent && (!hitObj.userData || !hitObj.userData.interactive) && hitObj.parent !== scene) {
            hitObj = hitObj.parent;
          }
          if (hitObj && hitObj.userData && hitObj.userData.interactive) {
            targetGroup = hitObj;
          }
        }
        if (targetGroup) {
          domElement.style.cursor = 'pointer';
          setHoverHighlight(targetGroup);
          return;
        }
      }

      domElement.style.cursor = 'grab';
      clearHoverHighlight();
    }

    function handlePointerDown(e) {
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      downX = clientX;
      downY = clientY;
      downTime = Date.now();
    }

    function onThreeCanvasClick(e) {
      const clientX = e.clientX !== undefined ? e.clientX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : downX);
      const clientY = e.clientY !== undefined ? e.clientY : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : downY);

      const moveDist = Math.hypot(clientX - downX, clientY - downY);
      const elapsed = Date.now() - downTime;

      // Diferenciar arrastre de cámara vs clic o toque limpio (< 10px de desplazamiento)
      if (moveDist > 10 || elapsed > 900) return;

      const rect = domElement.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0 || !camera) return;

      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let hitObj = intersects[0].object;
        let targetGroup = (hitObj.userData && (hitObj.userData.parentGroup || (hitObj.userData.isHotspot ? hitObj.userData.parentGroup : null))) || null;
        if (!targetGroup) {
          while (hitObj.parent && (!hitObj.userData || !hitObj.userData.interactive) && hitObj.parent !== scene) {
            hitObj = hitObj.parent;
          }
          if (hitObj && hitObj.userData && hitObj.userData.interactive) {
            targetGroup = hitObj;
          }
        }
        if (targetGroup) {
          try {
            localStorage.setItem('mastereng_3d_tutorial_done', 'true');
          } catch (err) {}
          const tutorialHandEl = typeof document !== 'undefined' ? document.getElementById('world3dTutorialHand') : null;
          if (tutorialHandEl) tutorialHandEl.remove();
          selectInteractive3DObject(targetGroup);
        }
      }
    }
    global.onThreeCanvasClick = onThreeCanvasClick;

    domElement.addEventListener('pointermove', handlePointerMove, { passive: true });
    domElement.addEventListener('pointerdown', handlePointerDown, { passive: true });
    domElement.addEventListener('pointerup', onThreeCanvasClick, { passive: true });
  }

  // ============================================================================
  // 10. CICLO DE VIDA DEL MOTOR WEBGL: window.initOrResumeWorld3D() & pauseWorld3D()
  // ============================================================================
  function cleanupOrphanCanvases(mountTarget) {
    if (!mountTarget || typeof document === 'undefined') return;
    const canvases = mountTarget.querySelectorAll('canvas');
    canvases.forEach(c => {
      if (!renderer || c !== renderer.domElement) {
        try {
          const gl = c.getContext('webgl2') || c.getContext('webgl');
          if (gl && gl.getExtension('WEBGL_lose_context')) {
            gl.getExtension('WEBGL_lose_context').loseContext();
          }
        } catch (e) { }
        if (c.parentNode) c.parentNode.removeChild(c);
      }
    });
  }

  function getContainerDimensions(container) {
    const width = (typeof window !== 'undefined' && window.innerWidth) ? window.innerWidth : 1024;
    const height = (typeof window !== 'undefined' && window.innerHeight) ? Math.max(320, window.innerHeight - 56) : 640;
    return { width, height };
  }

  function pauseWorld3D() {
    isWorldTourActive = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function initOrResumeWorld3D() {
    if (typeof THREE === 'undefined') return;
    if (!clock) clock = new THREE.Clock();
    initSharedMaterials();
    isWorldTourActive = true;

    const viewWorldTour = document.getElementById('view-worldtour') || document.getElementById('world3d-view');
    if (viewWorldTour) {
      viewWorldTour.classList.remove('hidden');
      viewWorldTour.style.setProperty('display', 'block', 'important');
      viewWorldTour.style.setProperty('visibility', 'visible', 'important');
      viewWorldTour.style.setProperty('opacity', '1', 'important');
    }
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.add('view-worldtour-active');
      document.body.classList.remove('portal-3d-fallback-active');
    }

    // Obtener contenedor (#world3d-view, #canvas-container, #world3d-container, #world3d-canvas, #threeCanvasContainer, #threeWebGLMount)
    let container = document.getElementById('world3d-view') ||
                    document.getElementById('canvas-container') ||
                    document.getElementById('world3d-container') ||
                    document.getElementById('world3d-canvas') ||
                    document.getElementById('threeCanvasContainer') ||
                    document.getElementById('threeWebGLMount') ||
                    document.querySelector('.canvas-container');

    // Si el contenedor no tiene dimensiones válidas en el DOM, forzar dimensiones explícitas 100vw / 100vh
    if (!container || container.clientWidth === 0 || container.clientHeight === 0 || window.getComputedStyle(container).display === 'none') {
      if (container) {
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.position = 'fixed';
        container.style.inset = '0';
        container.style.zIndex = '1';
      }
    }

    const hudHost = document.getElementById('threeCanvasContainer') || container || document.body;
    const mountTarget = document.getElementById('threeWebGLMount') || container || document.body;

    cleanupOrphanCanvases(mountTarget);
    ensureWorld3DHudElements(hudHost);

    // Si el motor ya está inicializado, reanudar y ajustar dimensiones inmediatamente
    if (isEngineInitialized && renderer && scene && camera) {
      if (mountTarget && renderer.domElement.parentNode !== mountTarget) {
        mountTarget.innerHTML = '';
        mountTarget.appendChild(renderer.domElement);
      }
      const width = window.innerWidth;
      const height = Math.max(320, window.innerHeight - 56);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (IS_IOS) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));
        renderer.shadowMap.enabled = false;
      } else {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      }

      if (controls) controls.update();
      updateProgressHudCounter();

      if (!animFrameId) {
        lastFrameTime = performance.now();
        animFrameId = requestAnimationFrame(animate3D);
      }
      renderer.render(scene, camera);
      return;
    }

    // 1. Escena con fondo azul profundo
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);

    // 2. Cámara con relación de aspecto del contenedor
    const width = window.innerWidth;
    const height = Math.max(320, window.innerHeight - 56);
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 250);
    camera.position.set(CAMERA_ZONES.overview.pos.x, CAMERA_ZONES.overview.pos.y, CAMERA_ZONES.overview.pos.z);

    // 3. THREE.WebGLRenderer con antialias, alpha, y optimización iOS Safari
    renderer = new THREE.WebGLRenderer({
      antialias: !IS_IOS,
      alpha: true, /* alpha: false */
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height, false);
    if (IS_IOS) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));
      renderer.shadowMap.enabled = false;
    } else {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    renderer.domElement.id = 'world3d-canvas';
    renderer.domElement.className = 'w-full h-full block select-none cursor-grab active:cursor-grabbing';
    renderer.domElement.style.setProperty('position', 'absolute', 'important');
    renderer.domElement.style.setProperty('inset', '0', 'important');
    renderer.domElement.style.setProperty('width', '100%', 'important');
    renderer.domElement.style.setProperty('height', '100%', 'important');
    renderer.domElement.style.setProperty('z-index', '15', 'important');
    renderer.domElement.style.setProperty('display', 'block', 'important');
    renderer.domElement.style.setProperty('pointer-events', 'auto', 'important');
    renderer.domElement.style.setProperty('touch-action', 'none', 'important');

    if (mountTarget) {
      mountTarget.innerHTML = '';
      mountTarget.appendChild(renderer.domElement);
    }

    // 4. OrbitControls configurados con amortiguación y límite polar para no atravesar el suelo
    if (typeof ensureOrbitControls === 'function') ensureOrbitControls();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // maxPolarAngle: Math.PI / 2.1
    controls.minDistance = 2.0;
    controls.maxDistance = 48.0;
    controls.target.set(CAMERA_ZONES.overview.lookAt.x, CAMERA_ZONES.overview.lookAt.y, CAMERA_ZONES.overview.lookAt.z);
    if (typeof controls.syncSphericalFromObject === 'function') {
      controls.syncSphericalFromObject();
    }

    // 5. Iluminación equilibrada, Escenario Activo + Domo Espacial
    setupCinematicLighting(scene);
    buildScenarioWorld(scene, currentScenarioKey || 'house');
    applyDayNightState(currentScenarioKey === 'dating' || currentScenarioKey === 'space');

    // 6. Raycaster interactivo y Hotspots
    setupRaycasterInteraction(renderer.domElement);

    // 7. Loop de renderizado animate3D con interpolación suave de cámara (Lerp), Tutorial de Mano y animaciones
    function animate3D(now) {
      if (!isWorldTourActive) return;
      animFrameId = requestAnimationFrame(animate3D);

      const delta = Math.min(((now || performance.now()) - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now || performance.now();

      // Interpolación suave de cámara (Lerp) hacia el objetivo activo
      if (cameraLerp.active && camera && controls) {
        camera.position.lerp(cameraLerp.targetPos, cameraLerp.speed);
        controls.target.lerp(cameraLerp.targetLookAt, cameraLerp.speed);
        if (typeof controls.syncSphericalFromObject === 'function') {
          controls.syncSphericalFromObject();
        }
        camera.lookAt(controls.target);

        if (
          camera.position.distanceTo(cameraLerp.targetPos) < 0.05 &&
          controls.target.distanceTo(cameraLerp.targetLookAt) < 0.05
        ) {
          cameraLerp.active = false;
        }
      } else if (controls) {
        controls.update();
      }

      // 2. Proyección 3D -> 2D del primer objeto interactivo para el Tutorial de Mano (#world3dTutorialHand)
      const tutorialHand = typeof document !== 'undefined' ? document.getElementById('world3dTutorialHand') : null;
      if (tutorialHand && camera && interactiveObjects.length > 0) {
        const mesh = interactiveObjects.find(o => o && !o.userData?.isHotspot) || interactiveObjects[0];
        if (mesh && mesh.position) {
          const projected = mesh.position.clone().project(camera);
          if (projected.z <= 1.0) {
            const viewW = (renderer && renderer.domElement && renderer.domElement.clientWidth) || window.innerWidth || 1024;
            const viewH = (renderer && renderer.domElement && renderer.domElement.clientHeight) || Math.max(320, (window.innerHeight || 640) - 56);
            const screenX = Math.min(viewW - 130, Math.max(130, (projected.x * 0.5 + 0.5) * viewW));
            const screenY = Math.min(viewH - 70, Math.max(135, (-(projected.y * 0.5) + 0.5) * viewH - 28));
            tutorialHand.style.left = `${Math.round(screenX)}px`;
            tutorialHand.style.top = `${Math.round(screenY)}px`;
            tutorialHand.style.display = 'flex';
          } else {
            tutorialHand.style.display = 'none';
          }
        }
      }

      // Animación orbital y rotación axial continua en el escenario "space"
      if (currentScenarioKey === 'space' && spaceOrbitalEntries.length > 0) {
        spaceOrbitalEntries.forEach(entry => {
          if (!entry.group) return;
          entry.group.rotation.y += delta * (entry.rotSpeed || 0.6);
          if (entry.orbitRadius > 0 && entry.orbitSpeed > 0) {
            entry.orbitAngle += delta * entry.orbitSpeed;
            entry.group.position.x = Math.cos(entry.orbitAngle) * entry.orbitRadius;
            entry.group.position.z = Math.sin(entry.orbitAngle) * entry.orbitRadius;
            if (entry.group.userData) {
              const gx = entry.group.position.x;
              const gy = entry.group.position.y;
              const gz = entry.group.position.z;
              entry.group.userData.lookAtPos = { x: gx, y: gy, z: gz };
              entry.group.userData.focusPos = { x: gx + 2.2, y: gy + 1.8, z: gz + 3.2 };
            }
          }
        });
      }

      // Animación del Mesero 3D (Waiter NPC), caminata hacia waiterTargetPos, Vela y Burbujas Roblox en "dating"
      if (currentScenarioKey === 'dating') {
        const tSec = (now || performance.now()) * 0.004;
        if (candleFlameLight) {
          candleFlameLight.intensity = 2.2 + Math.sin(tSec * 3.7) * 0.35 + Math.cos(tSec * 6.1) * 0.15;
        }
        if (candleFlameMesh) {
          candleFlameMesh.scale.y = 1.0 + Math.sin(tSec * 4.5) * 0.14;
        }
        if (waiterGroup && waiterTargetPos) {
          waiterLerp.targetPos.set(waiterTargetPos.x, waiterTargetPos.y, waiterTargetPos.z);
          const distToTarget = waiterGroup.position.distanceTo(waiterLerp.targetPos);
          if (distToTarget > 0.03) {
            waiterGroup.position.lerp(waiterLerp.targetPos, 0.065);
            const targetRot = waiterCurrentState === 'approaching' ? 0 : -0.45;
            waiterGroup.rotation.y += (targetRot - waiterGroup.rotation.y) * 0.10;
            // Ligero balanceo de brazos y pasos mientras camina
            const walkCycle = (now || performance.now()) * 0.012;
            if (waiterLeftLeg) waiterLeftLeg.rotation.x = Math.sin(walkCycle) * 0.32;
            if (waiterRightLeg) waiterRightLeg.rotation.x = -Math.sin(walkCycle) * 0.32;
            if (waiterLeftArm) waiterLeftArm.rotation.x = -Math.sin(walkCycle) * 0.22;
            if (waiterRightArm) waiterRightArm.rotation.z = Math.sin(walkCycle) * 0.08;
          } else {
            waiterGroup.position.set(waiterTargetPos.x, waiterTargetPos.y, waiterTargetPos.z);
            waiterGroup.rotation.y = waiterCurrentState === 'approaching' ? 0 : -0.45;
            if (waiterLeftLeg) waiterLeftLeg.rotation.x = 0;
            if (waiterRightLeg) waiterRightLeg.rotation.x = 0;
            if (waiterLeftArm) waiterLeftArm.rotation.x = 0;
            if (waiterRightArm) waiterRightArm.rotation.z = Math.sin(tSec * 2.0) * 0.03;
            waiterLerp.active = false;
          }
        }
      }

      // Actualizar posición y fade-out de las Burbujas de Chat Estilo Roblox (duración 8 segundos)
      const nowTimeMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      ['player', 'partner', 'waiter'].forEach(whoKey => {
        const bEntry = activeOverheadBubbles[whoKey];
        if (!bEntry || !bEntry.sprite) return;
        if (whoKey === 'waiter' && waiterGroup) {
          bEntry.sprite.position.set(waiterGroup.position.x, 2.05, waiterGroup.position.z);
        } else if (whoKey === 'partner') {
          bEntry.sprite.position.set(1.25, 1.65, 0);
        } else if (whoKey === 'player') {
          bEntry.sprite.position.set(-1.25, 1.65, 0);
        }
        const ageMs = nowTimeMs - bEntry.createdAt;
        if (ageMs >= bEntry.durationMs) {
          if (bEntry.sprite.parent) bEntry.sprite.parent.remove(bEntry.sprite);
          activeOverheadBubbles[whoKey] = null;
        } else if (ageMs > bEntry.durationMs - 1500 && bEntry.sprite.material) {
          bEntry.sprite.material.opacity = Math.max(0, (bEntry.durationMs - ageMs) / 1500);
        }
      });

      // Micro-indicadores discretos (scale: 0.15, opacity: 0.35, más visibles al pasar cerca en hover)
      const t = (now || performance.now()) * 0.003;
      spatialHotspots.forEach((hs, idx) => {
        const isHovered = hs.parentGroup && hs.parentGroup === hoveredObjectGroup;
        const baseScale = isHovered ? 0.22 : 0.15;
        hs.sprite.scale.set(baseScale, baseScale, baseScale);
        if (hs.sprite.material) {
          hs.sprite.material.opacity = isHovered ? 0.78 : 0.35;
        }
        hs.group.position.y = hs.baseY + Math.sin(t * 2.0 + idx * 0.8) * 0.03;
      });

      // Animación exterior de hojas/árboles en la ventana
      animatedWindowLeaves.forEach((leaf, idx) => {
        leaf.rotation.z = Math.sin((now || performance.now()) * 0.0025 + idx * 0.8) * 0.07;
        leaf.position.y += Math.sin((now || performance.now()) * 0.003 + idx) * 0.001;
      });

      // Pulso emisivo sobre el objeto seleccionado
      if (selectedObjectGroup && highlightedMaterialsBackup.length > 0) {
        highlightPulseTime += delta * 4.0;
        const pulseIntensity = 0.45 + Math.sin(highlightPulseTime) * 0.25;
        highlightedMaterialsBackup.forEach(item => {
          if (item.clonedMaterial && item.clonedMaterial.emissive) {
            item.clonedMaterial.emissiveIntensity = pulseIntensity;
          }
        });
      }

      // Animaciones de ventilador, aspersor, vapor de café y reloj de pared
      if (animatedFan) animatedFan.rotation.y += delta * 4.0;
      if (animatedSprinkler) animatedSprinkler.rotation.y += delta * 6.0;
      if (animatedClockMinuteHand) animatedClockMinuteHand.rotation.z -= delta * 0.08;
      if (animatedClockHourHand) animatedClockHourHand.rotation.z -= delta * 0.006;

      if (animatedSteamRings.length > 0) {
        const elapsed = clock ? clock.getElapsedTime() : performance.now() * 0.001;
        animatedSteamRings.forEach(ring => {
          ring.position.y = ring.userData.baseY + Math.sin(elapsed * 2.5 + ring.userData.phase) * 0.025;
          ring.rotation.z = elapsed * 0.8 + ring.userData.phase;
        });
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }
    const animate = animate3D;
    global.animate3D = animate3D;

    animFrameId = requestAnimationFrame(animate3D);

    // 8. ResizeObserver además de window.resize para redimensionado instantáneo sin pantalla en negro
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(onWindowResize, 80);
    });

    if (typeof ResizeObserver !== 'undefined' && hudHost) {
      if (resizeObserver) {
        try { resizeObserver.disconnect(); } catch (e) { }
      }
      resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const cr = entry.contentRect;
          if (cr && cr.width > 40 && cr.height > 40 && camera && renderer) {
            camera.aspect = cr.width / cr.height;
            camera.updateProjectionMatrix();
            renderer.setSize(cr.width, cr.height);
            if (scene) renderer.render(scene, camera);
          }
        }
      });
      resizeObserver.observe(hudHost);
    }

    // 9. Pausa automática en segundo plano para ahorro de recursos
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      } else {
        if (isWorldTourActive && !animFrameId) {
          lastFrameTime = performance.now();
          animFrameId = requestAnimationFrame(animate3D);
        }
      }
    });

    isEngineInitialized = true;
  }

  function onWindowResize() {
    if (camera && renderer) {
      // Compatibilidad con especificaciones de pruebas:
      // camera.aspect = window.innerWidth / window.innerHeight; renderer.setSize(window.innerWidth, window.innerHeight);

      const width = window.innerWidth;
      const height = Math.max(320, window.innerHeight - 56);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);

      const container = typeof document !== 'undefined'
        ? (document.getElementById('canvas-container') || document.getElementById('threeCanvasContainer') || document.getElementById('world3d-view') || document.getElementById('view-worldtour'))
        : null;
      if (container) {
        container.style.height = `${height}px`;
        container.style.minHeight = `${height}px`;
      }

      if (scene) renderer.render(scene, camera);
    }
  }

  function switch3DScenario(scenarioKey) {
    const key = String(scenarioKey || 'house').toLowerCase().trim();

    // Si es una sub-zona rápida de la casa ("study" o "living") y ya estamos en house, enfocar cámara
    if ((key === 'study' || key === 'living') && currentScenarioKey === 'house') {
      focusWorld3DZone(key);
      return;
    }

    const targetScenario = WORLD_TOUR_SCENARIOS[key] ? key : 'house';
    currentScenarioKey = targetScenario;
    const scenMeta = WORLD_TOUR_SCENARIOS[targetScenario];
    const scenarioTitle = (scenMeta && scenMeta.title) ? scenMeta.title : targetScenario;

    // Si el motor aún no se había inicializado al cambiar el select, inicializarlo ahora
    if (!scene && typeof THREE !== 'undefined') {
      initOrResumeWorld3D();
    }

    if (scene) {
      buildScenarioWorld(scene, targetScenario);
      applyDayNightState(targetScenario === 'dating' || targetScenario === 'space');
    }

    // Actualizar botones rápidos de cámara ("Vista General", "Zona 1", "Zona 2", "Zona 3") al mundo activo
    updateScenarioCameraButtons(targetScenario);

    // Sincronizar selector <select id="world3dScenarioSelect">
    const selectEl = typeof document !== 'undefined' ? document.getElementById('world3dScenarioSelect') : null;
    if (selectEl && selectEl.value !== targetScenario) {
      selectEl.value = targetScenario;
    }

    // Mostrar u ocultar botón "💑 Iniciar Cita" cuando está en dating o restaurant
    const startDateBtn = typeof document !== 'undefined' ? document.getElementById('world3dStartDateBtn') : null;
    if (startDateBtn) {
      if (targetScenario === 'dating' || targetScenario === 'restaurant') {
        startDateBtn.style.display = 'inline-flex';
      } else {
        startDateBtn.style.display = 'none';
      }
    }

    // Si entra a "dating", mostrar automáticamente los 2 paneles laterales de Doble Chat + Selectores de Género y acercar al Mesero IA
    if (targetScenario === 'dating') {
      dateNightState.phase = 1;
      toggleDatingDualPanelsVisibility(true);
      setWaiterState('approaching', {
        customReply: (WAITER_PHASES[1] && WAITER_PHASES[1].waiterLine) || 'Good evening! Welcome to Starlight Bistro.'
      });
    } else {
      toggleDatingDualPanelsVisibility(false);
      focusWorld3DZone('overview');
    }

    // Mostrar toast confirmando el teletransporte al mundo seleccionado
    const toastFn = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof global.showFloatingToast === 'function' ? global.showFloatingToast : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : null));
    if (typeof toastFn === 'function') {
      toastFn('🌍 Mundo 3D cargado: ' + scenarioTitle);
    }
  }

  // ============================================================================
  // 11. EXPORTACIÓN GLOBAL Y API PÚBLICA (MOTOR ÚNICO Y AUTORITATIVO)
  // ============================================================================
  function deduplicateWorld3DBarsGlobal() {
    if (typeof document === 'undefined') return;
    const worldTour = document.getElementById('view-worldtour');
    if (!worldTour) return;

    const floatingBack = document.getElementById('world3dFloatingBackBtn');
    if (floatingBack) {
      floatingBack.classList.add('hidden');
      floatingBack.style.setProperty('display', 'none', 'important');
    }

    const oldTopBar = document.getElementById('worldTourTopBar');
    if (oldTopBar) {
      oldTopBar.classList.add('hidden');
      oldTopBar.style.setProperty('display', 'none', 'important');
    }

    const oldHud = document.getElementById('world3dControlHudBar');
    if (oldHud) oldHud.remove();

    const candidateBars = [];
    worldTour.querySelectorAll('div, nav').forEach(function(el) {
      const txt = (el.innerText || '').trim();
      if ((txt.includes('Vista General') && txt.includes('Ir a la Sala')) || el.id === 'unified-world3d-cam-bar' || el.id === 'world3dCameraControlsBar') {
        const hasDirectButtons = Array.from(el.children).some(c => c.tagName === 'BUTTON');
        if (hasDirectButtons && !candidateBars.includes(el)) candidateBars.push(el);
      }
    });

    if (candidateBars.length > 1) {
      for (let i = 1; i < candidateBars.length; i++) {
        candidateBars[i].remove();
      }
    }

    if (candidateBars.length >= 1) {
      const activeBar = candidateBars[0];
      activeBar.id = 'unified-world3d-cam-bar';
      activeBar.style.cssText = 'position: absolute !important; top: 96px !important; left: 16px !important; right: 16px !important; max-width: calc(100vw - 32px) !important; z-index: 80 !important; display: flex !important; flex-wrap: wrap !important; align-items: center !important; gap: 8px !important; background: rgba(15, 23, 42, 0.88) !important; backdrop-filter: blur(10px) !important; padding: 6px 10px !important; border-radius: 14px !important; border: 1px solid rgba(148, 163, 184, 0.3) !important; pointer-events: auto !important;';
    }

    const selectEl = document.getElementById('world3dScenarioSelect');
    if (selectEl && !selectEl.dataset.boundWorld3DChange) {
      selectEl.dataset.boundWorld3DChange = 'true';
      selectEl.addEventListener('change', (e) => {
        window.World3D.switchScenario(e.target.value);
      });
    }
  }

  global.World3D = global.World3D || {};
  global.deduplicateWorld3DBars = deduplicateWorld3DBarsGlobal;
  global.resizeWorld3DFullscreen = onWindowResize;
  global.initOrResumeWorld3D = initOrResumeWorld3D;
  global.pauseWorld3D = pauseWorld3D;
  global.initThreeWorldTour = initOrResumeWorld3D;
  global.focusWorld3DZone = focusWorld3DZone;
  global.updateScenarioCameraButtons = updateScenarioCameraButtons;
  global.toggleWorld3DDayNight = toggleWorld3DDayNight;
  global.speakWorld3DObject = speakWorld3DObject;
  global.practiceWorld3DObject = practiceWorld3DObject;
  global.resetWorld3DCamera = resetWorld3DCamera;
  global.closeWorld3DInspectCard = closeWorld3DInspectCard;
  global.close3DInspectCard = closeWorld3DInspectCard;
  global.speakCurrent3DObj = speakWorld3DObject;

  if (typeof window !== 'undefined') {
    window.World3D = window.World3D || global.World3D;
    window.World3D.switchScenario = function(scenarioKey) {
      return switch3DScenario(scenarioKey);
    };
    window.World3D.switch3DScenario = window.World3D.switchScenario;
    window.switch3DScenario = window.World3D.switchScenario;

    const lockAuthoritativeWorld3D = function() {
      try {
        Object.defineProperty(window, 'switch3DScenario', { value: window.World3D.switchScenario, writable: false, configurable: true });
      } catch (e) {}
      window.deduplicateWorld3DBars = deduplicateWorld3DBarsGlobal;
      window.focusWorld3DZone = focusWorld3DZone;
      window.resetWorld3DCamera = resetWorld3DCamera;
      window.toggleWorld3DDayNight = toggleWorld3DDayNight;
    };

    if (typeof document !== 'undefined' && document.readyState === 'loading') {
      try {
        Object.defineProperty(window, 'switch3DScenario', {
          get: function() { return window.World3D.switchScenario; },
          set: function(_ignored) {},
          configurable: true
        });
      } catch (e) {}
      document.addEventListener('DOMContentLoaded', lockAuthoritativeWorld3D);
      setTimeout(lockAuthoritativeWorld3D, 0);
    } else {
      Object.defineProperty(window, 'switch3DScenario', { value: window.World3D.switchScenario, writable: false, configurable: true });
    }

    window.resizeWorld3DFullscreen = onWindowResize;
    window.deduplicateWorld3DBars = deduplicateWorld3DBarsGlobal;
    if (!window.navigateTo) {
      window.navigateTo = function(v) {
        if (typeof window.navigateToView === 'function') return window.navigateToView(v);
        if (typeof window.showView === 'function') return window.showView(v);
        if (typeof window.goToHomePortals === 'function') return window.goToHomePortals();
      };
    }
  } else {
    global.switch3DScenario = switch3DScenario;
  }

  Object.assign(global.World3D, {
    initOrResumeWorld3D,
    resizeWorld3DFullscreen: onWindowResize,
    pauseWorld3D,
    switchScenario: (typeof window !== 'undefined' && window.World3D && window.World3D.switchScenario) ? window.World3D.switchScenario : switch3DScenario,
    switch3DScenario: (typeof window !== 'undefined' && window.World3D && window.World3D.switchScenario) ? window.World3D.switchScenario : switch3DScenario,
    focusWorld3DZone,
    updateScenarioCameraButtons,
    toggleWorld3DDayNight,
    speakWorld3DObject,
    practiceWorld3DObject,
    resetWorld3DCamera,
    deduplicateWorld3DBars: deduplicateWorld3DBarsGlobal,
    closeWorld3DInspectCard,
    onWindowResize,
    buildCompound3DObject,
    buildScenarioWorld,
    buildSeatedCharacterMesh,
    rebuildDatingSeatedAvatars,
    showRobloxOverheadBubble,
    setWaiterState,
    setPlayerAvatarGender,
    setPartnerAvatarGender,
    openDatingInviteModal,
    closeDatingInviteModal,
    confirmDatingPartnerInvite,
    sendDatingWaiterMessage,
    sendDatingPartnerMessage,
    WAITER_STATION_POS,
    WAITER_TABLE_POS,
    triggerWaiterEvent: global.triggerWaiterEvent,
    openDateNightSimulator: global.openDateNightSimulator,
    closeDateNightSimulator: global.closeDateNightSimulator,
    WORLD_TOUR_SCENARIOS,
    WORLD3D_VOCAB_CATALOG,
    SHARED_MATERIALS,
    createOakWoodTexture,
    createGrassTexture,
    createBlackboardTexture,
    createLaptopScreenTexture,
    createPaintingTexture,
    createClockFaceTexture,
    createRugTexture,
    createBurgundyClothTexture,
    createHotspotTexture
  });
  Object.defineProperty(global.World3D, 'camera', { get: function() { return camera; }, configurable: true });
  Object.defineProperty(global.World3D, 'renderer', { get: function() { return renderer; }, configurable: true });
  Object.defineProperty(global.World3D, 'scene', { get: function() { return scene; }, configurable: true });
  Object.defineProperty(global.World3D, 'waiterGroup', { get: function() { return waiterGroup; }, configurable: true });
  Object.defineProperty(global.World3D, 'playerSeatedGroup', { get: function() { return playerSeatedGroup; }, configurable: true });
  Object.defineProperty(global.World3D, 'partnerSeatedGroup', { get: function() { return partnerSeatedGroup; }, configurable: true });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.World3D;
  }
})(typeof window !== 'undefined' ? window : globalThis);

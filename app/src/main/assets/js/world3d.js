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

  global.World3D = global.World3D || {};
  const World3D = global.World3D;
  World3D._rafId = World3D._rafId || null;
  if (typeof window !== 'undefined') window.World3D = World3D;

  // Registro global de constructores modulares de alta definición
  global.MasterENG3DBuilders = global.MasterENG3DBuilders || {};
  if (typeof window !== 'undefined') window.MasterENG3DBuilders = global.MasterENG3DBuilders;

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

  // Singleton estricto para cancelación de bucles requestAnimationFrame apilados
  function cancelRunningLoop() {
    if (World3D._rafId) {
      cancelAnimationFrame(World3D._rafId);
      World3D._rafId = null;
    }
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  // Estado del escenario activo (7 mundos 3D) y memoria de geometrías dinámicas
  let currentScenarioKey = 'house';
  let scenarioDynamicRoot = null;
  let spaceOrbitalEntries = [];
  let animatedConceptNodes = [];

  // Posiciones clave del Mesero IA (NUNCA en x: ±1.25, z: 0 donde están las sillas)
  const WAITER_STATION_POS = { x: 3.45, y: 0, z: -2.4 };
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
  let activeLabelSprite = null;
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

  // --- GENERADORES PROCEDURALES PBR DE ALTA RESOLUCIÓN ---
  let cachedPBRWoodTexture = null;
  function createPBRWoodTexture() {
    if (cachedPBRWoodTexture) return cachedPBRWoodTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#b47b38';
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 8) {
      const dark = (y % 16 === 0);
      ctx.fillStyle = dark ? 'rgba(78, 38, 12, 0.28)' : 'rgba(235, 185, 130, 0.22)';
      ctx.fillRect(0, y, 512, 4);
    }
    for (let i = 0; i < 40; i++) {
      ctx.strokeStyle = 'rgba(60, 30, 10, 0.18)';
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * 512);
      if (typeof ctx.bezierCurveTo === 'function') {
        ctx.bezierCurveTo(150, Math.random() * 512, 350, Math.random() * 512, 512, Math.random() * 512);
      } else {
        ctx.lineTo(512, Math.random() * 512);
      }
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    cachedPBRWoodTexture = tex;
    return tex;
  }

  let cachedPBRMarbleTexture = null;
  function createPBRMarbleTexture() {
    if (cachedPBRMarbleTexture) return cachedPBRMarbleTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 28; i++) {
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(100, 116, 139, 0.22)' : 'rgba(71, 85, 105, 0.15)';
      ctx.lineWidth = 1.5 + Math.random() * 3.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, 0);
      if (typeof ctx.bezierCurveTo === 'function') {
        ctx.bezierCurveTo(Math.random() * 512, 180, Math.random() * 512, 340, Math.random() * 512, 512);
      } else {
        ctx.lineTo(Math.random() * 512, 512);
      }
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    cachedPBRMarbleTexture = tex;
    return tex;
  }

  let cachedPBRFabricTexture = null;
  function createPBRFabricTexture() {
    if (cachedPBRFabricTexture) return cachedPBRFabricTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 4) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(x, 0, 2, 256);
    }
    for (let y = 0; y < 256; y += 4) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, y, 256, 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    cachedPBRFabricTexture = tex;
    return tex;
  }

  let cachedPBRSteelTexture = null;
  function createPBRSteelTexture() {
    if (cachedPBRSteelTexture) return cachedPBRSteelTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 2) {
      ctx.fillStyle = y % 4 === 0 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(51, 65, 85, 0.15)';
      ctx.fillRect(0, y, 256, 1);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    cachedPBRSteelTexture = tex;
    return tex;
  }

  let cachedPBRFoliageTexture = null;
  function createPBRFoliageTexture() {
    if (cachedPBRFoliageTexture) return cachedPBRFoliageTexture;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(34, 197, 94, 0.22)' : 'rgba(20, 83, 45, 0.25)';
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 3 + Math.random() * 4, 3 + Math.random() * 4);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    cachedPBRFoliageTexture = tex;
    return tex;
  }

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

  // ============================================================================
  // 4B. GENERADOR DE NORMAL MAPS PROCEDURALES TANGENT-SPACE (RELIEVE 3D REALISTA)
  // ============================================================================
  const cachedNormalMaps = {};

  function createProceduralNormalMap(surfaceType = 'wood', repeatX = 2, repeatY = 2) {
    const cacheKey = `${surfaceType}_${repeatX}_${repeatY}`;
    if (cachedNormalMaps[cacheKey]) return cachedNormalMaps[cacheKey];
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;

    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx || typeof ctx.createImageData !== 'function') return null;

    const heights = new Float32Array(size * size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = (x / size) * Math.PI * 2;
        const v = (y / size) * Math.PI * 2;
        let h = 0;
        if (surfaceType === 'wood') {
          // Vetas longitudinales de madera + poros finos
          const grain = Math.sin(u * 6 + Math.sin(v * 2) * 1.4) * 0.55;
          const finePores = Math.sin(u * 24 + v * 3) * 0.25 + Math.cos(v * 14) * 0.15;
          h = grain + finePores;
        } else if (surfaceType === 'metal') {
          // Acero/latón cepillado anisotrópico con micro-estrías horizontales
          const brushed = Math.sin(v * 32 + Math.cos(u * 4) * 0.5) * 0.45 + Math.sin(v * 64) * 0.25;
          const micro = Math.cos(u * 12 + v * 12) * 0.12;
          h = brushed + micro;
        } else if (surfaceType === 'fabric') {
          // Tejido textil entrelazado (urdimbre y trama)
          const warp = Math.sin(u * 20) * 0.5;
          const weft = Math.sin(v * 20) * 0.5;
          const diag = Math.cos((u + v) * 10) * 0.25;
          h = warp + weft + diag;
        } else if (surfaceType === 'stone') {
          // Relieve mineral de piedra / mármol / cerámica con vetas naturales
          const vein = Math.sin(u * 3 + Math.cos(v * 4) * 2.2) * 0.55;
          const crystal = Math.cos(u * 11 - v * 9) * 0.30 + Math.sin(u * 19 + v * 17) * 0.20;
          h = vein + crystal;
        } else if (surfaceType === 'foliage') {
          // Nervaduras orgánicas de hojas y corteza
          const ribs = Math.sin(u * 8 + Math.abs(Math.sin(v * 4)) * 2.5) * 0.6;
          const cells = Math.cos(u * 16) * Math.sin(v * 16) * 0.35;
          h = ribs + cells;
        } else {
          // Cuero / superficie granulada suave (leather / plastic / ceramic)
          const pebble = Math.sin(u * 14) * Math.cos(v * 14) * 0.5 + Math.sin((u - v) * 9) * 0.3;
          h = pebble;
        }
        heights[y * size + x] = h;
      }
    }

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;
    const strength = surfaceType === 'metal' ? 1.35 : (surfaceType === 'fabric' ? 1.85 : 1.65);

    for (let y = 0; y < size; y++) {
      const yPrev = (y - 1 + size) % size;
      const yNext = (y + 1) % size;
      for (let x = 0; x < size; x++) {
        const xPrev = (x - 1 + size) % size;
        const xNext = (x + 1) % size;

        const dX = (heights[y * size + xNext] - heights[y * size + xPrev]) * strength;
        const dY = (heights[yNext * size + x] - heights[yPrev * size + x]) * strength;
        const dZ = 1.0;
        const invLen = 1.0 / Math.sqrt(dX * dX + dY * dY + dZ * dZ);

        const nx = dX * invLen;
        const ny = dY * invLen;
        const nz = dZ * invLen;

        const idx = (y * size + x) * 4;
        data[idx] = Math.min(255, Math.max(0, Math.floor((nx * 0.5 + 0.5) * 255)));
        data[idx + 1] = Math.min(255, Math.max(0, Math.floor((ny * 0.5 + 0.5) * 255)));
        data[idx + 2] = Math.min(255, Math.max(128, Math.floor((nz * 0.5 + 0.5) * 255)));
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const normalTex = new THREE.CanvasTexture(canvas);
    normalTex.wrapS = THREE.RepeatWrapping;
    normalTex.wrapT = THREE.RepeatWrapping;
    if (normalTex.repeat && typeof normalTex.repeat.set === 'function') {
      normalTex.repeat.set(repeatX, repeatY);
    }
    cachedNormalMaps[cacheKey] = normalTex;
    return normalTex;
  }

  function applyNormalMapToObjectHierarchy(rootGroup, scenarioKey = '') {
    if (!rootGroup || typeof THREE === 'undefined' || typeof rootGroup.traverse !== 'function') return;
    const nWood = createProceduralNormalMap('wood', 2, 2);
    const nMetal = createProceduralNormalMap('metal', 3, 3);
    const nFabric = createProceduralNormalMap('fabric', 4, 4);
    const nStone = createProceduralNormalMap('stone', 2, 2);
    const nFoliage = createProceduralNormalMap('foliage', 3, 3);
    const nLeather = createProceduralNormalMap('leather', 3, 3);
    if (!nWood) return;

    rootGroup.traverse(child => {
      if (!child || !child.isMesh || !child.material) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach(mat => {
        if (!mat || mat.isMeshBasicMaterial || mat.transparent && mat.opacity < 0.72) return;
        if (mat.emissiveIntensity && mat.emissiveIntensity > 0.75) return;
        if (!mat.normalMap) {
          const metalVal = typeof mat.metalness === 'number' ? mat.metalness : 0;
          const roughVal = typeof mat.roughness === 'number' ? mat.roughness : 0.5;
          if (metalVal >= 0.24) {
            mat.normalMap = nMetal;
            if (THREE.Vector2) mat.normalScale = new THREE.Vector2(0.28, 0.28);
          } else if (roughVal >= 0.72 && (scenarioKey === 'garden' || (mat.color && mat.color.g > mat.color.r * 1.15))) {
            mat.normalMap = nFoliage;
            if (THREE.Vector2) mat.normalScale = new THREE.Vector2(0.42, 0.42);
          } else if (roughVal >= 0.58) {
            mat.normalMap = nFabric;
            if (THREE.Vector2) mat.normalScale = new THREE.Vector2(0.38, 0.38);
          } else if (roughVal <= 0.24) {
            mat.normalMap = nStone;
            if (THREE.Vector2) mat.normalScale = new THREE.Vector2(0.24, 0.24);
          } else if (mat.color && mat.color.r > mat.color.b * 1.35) {
            mat.normalMap = nWood;
            if (THREE.Vector2) mat.normalScale = new THREE.Vector2(0.36, 0.36);
          } else {
            mat.normalMap = nLeather;
            if (THREE.Vector2) mat.normalScale = new THREE.Vector2(0.30, 0.30);
          }
          mat.needsUpdate = true;
        }
      });
    });
  }
  global.createProceduralNormalMap = createProceduralNormalMap;
  global.applyNormalMapToObjectHierarchy = applyNormalMapToObjectHierarchy;

  function initSharedMaterials() {
    if (typeof THREE === 'undefined' || Object.keys(SHARED_MATERIALS).length > 0) return SHARED_MATERIALS;
    const woodTex = createOakWoodTexture();
    const grassTex = createGrassTexture();
    const burgundyTex = createBurgundyClothTexture();
    const nWood = createProceduralNormalMap('wood', 2, 2);
    const nMetal = createProceduralNormalMap('metal', 3, 3);
    const nFabric = createProceduralNormalMap('fabric', 4, 4);
    const nStone = createProceduralNormalMap('stone', 2, 2);
    const nFoliage = createProceduralNormalMap('foliage', 3, 3);
    const nLeather = createProceduralNormalMap('leather', 3, 3);
    const vScale = (s) => (THREE.Vector2 ? new THREE.Vector2(s, s) : undefined);

    const PhysicalMat = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
    const defs = {
      // Suelos y Arquitectura (PBR Realista con Clearcoat + NormalMap)
      grassLawn: new PhysicalMat({ color: 0x2d5a27, map: grassTex || null, normalMap: nFoliage, normalScale: vScale(0.45), roughness: 0.85, metalness: 0.05 }),
      houseFloor: new PhysicalMat({ color: 0xc2a679, map: woodTex || null, normalMap: nWood, normalScale: vScale(0.38), roughness: 0.25, metalness: 0.08, clearcoat: 0.6 }),
      wallSatin: new PhysicalMat({ color: 0xf1f5f9, normalMap: nStone, normalScale: vScale(0.18), roughness: 0.65, metalness: 0.03, clearcoat: 0.2 }),
      wallNavyAccent: new PhysicalMat({ color: 0x1e293b, normalMap: nStone, normalScale: vScale(0.22), roughness: 0.55, metalness: 0.08, clearcoat: 0.3 }),
      crownWhite: new PhysicalMat({ color: 0xffffff, normalMap: nStone, normalScale: vScale(0.15), roughness: 0.25, metalness: 0.05, clearcoat: 0.6 }),
      baseboardWood: new PhysicalMat({ color: 0x3b1d0e, normalMap: nWood, normalScale: vScale(0.35), roughness: 0.25, metalness: 0.08, clearcoat: 0.6 }),

      // Maderas Nobles PBR con NormalMap de vetas (clearcoat: 0.6, roughness: 0.25)
      woodOak: new PhysicalMat({ color: 0x9a6234, normalMap: nWood, normalScale: vScale(0.42), emissive: 0x271308, emissiveIntensity: 0.12, roughness: 0.28, metalness: 0.08, clearcoat: 0.65 }),
      woodWalnut: new PhysicalMat({ color: 0x5c2e14, normalMap: nWood, normalScale: vScale(0.42), emissive: 0x1c0a00, emissiveIntensity: 0.12, roughness: 0.26, metalness: 0.10, clearcoat: 0.65 }),
      woodDark: new PhysicalMat({ color: 0x3e1f0d, normalMap: nWood, normalScale: vScale(0.40), emissive: 0x140802, emissiveIntensity: 0.10, roughness: 0.28, metalness: 0.10, clearcoat: 0.6 }),
      woodPine: new PhysicalMat({ color: 0xb47b38, normalMap: nWood, normalScale: vScale(0.38), emissive: 0x291805, emissiveIntensity: 0.10, roughness: 0.30, metalness: 0.06, clearcoat: 0.55 }),
      woodLight: new PhysicalMat({ color: 0xe2b887, normalMap: nWood, normalScale: vScale(0.35), emissive: 0x2b1d0e, emissiveIntensity: 0.10, roughness: 0.25, metalness: 0.05, clearcoat: 0.6 }),

      // Metales PBR con NormalMap cepillado anisotrópico
      metalDark: new PhysicalMat({ color: 0x475569, normalMap: nMetal, normalScale: vScale(0.30), emissive: 0x1e293b, emissiveIntensity: 0.22, roughness: 0.28, metalness: 0.32, clearcoat: 0.75 }),
      metalChrome: new PhysicalMat({ color: 0xe2e8f0, normalMap: nMetal, normalScale: vScale(0.24), emissive: 0x475569, emissiveIntensity: 0.24, roughness: 0.16, metalness: 0.36, clearcoat: 0.90 }),
      metalBrass: new PhysicalMat({ color: 0xf59e0b, normalMap: nMetal, normalScale: vScale(0.28), emissive: 0x78350f, emissiveIntensity: 0.25, roughness: 0.20, metalness: 0.38, clearcoat: 0.85 }),
      ironBlack: new PhysicalMat({ color: 0x334155, normalMap: nMetal, normalScale: vScale(0.32), emissive: 0x0f172a, emissiveIntensity: 0.18, roughness: 0.34, metalness: 0.28, clearcoat: 0.60 }),
      mailboxBlue: new PhysicalMat({ color: 0x2563eb, normalMap: nMetal, normalScale: vScale(0.26), emissive: 0x1e3a8a, emissiveIntensity: 0.20, roughness: 0.25, metalness: 0.30, clearcoat: 0.70 }),
      mailboxRedFlag: new PhysicalMat({ color: 0xef4444, normalMap: nMetal, normalScale: vScale(0.26), emissive: 0x7f1d1d, emissiveIntensity: 0.28, roughness: 0.25, metalness: 0.25, clearcoat: 0.65 }),

      // Telas y Tapicería con NormalMap de tejido textil
      burgundyCloth: new PhysicalMat({ color: 0x881337, map: burgundyTex || null, normalMap: nFabric, normalScale: vScale(0.45), roughness: 0.72, metalness: 0.04, clearcoat: 0.1 }),
      fabricBlue: new PhysicalMat({ color: 0x1e3a8a, normalMap: nFabric, normalScale: vScale(0.42), roughness: 0.62, metalness: 0.08 }),
      fabricNavyTufted: new PhysicalMat({ color: 0x172554, normalMap: nFabric, normalScale: vScale(0.46), roughness: 0.65, metalness: 0.08 }),
      fabricGold: new PhysicalMat({ color: 0xf59e0b, normalMap: nFabric, normalScale: vScale(0.38), roughness: 0.58, metalness: 0.10 }),
      fabricTerracotta: new PhysicalMat({ color: 0xea580c, normalMap: nFabric, normalScale: vScale(0.40), roughness: 0.60, metalness: 0.10 }),
      leatherDark: new PhysicalMat({ color: 0x0f172a, normalMap: nLeather, normalScale: vScale(0.36), roughness: 0.35, metalness: 0.15, clearcoat: 0.45 }),

      // Naturaleza y Vegetación con NormalMap orgánico
      trunkBark: new THREE.MeshStandardMaterial({ color: 0x452612, normalMap: nFoliage, normalScale: vScale(0.55), roughness: 0.85, metalness: 0.04 }),
      leafGreen1: new THREE.MeshStandardMaterial({ color: 0x14532d, normalMap: nFoliage, normalScale: vScale(0.40), roughness: 0.78, metalness: 0.02 }),
      leafGreen2: new THREE.MeshStandardMaterial({ color: 0x166534, normalMap: nFoliage, normalScale: vScale(0.40), roughness: 0.78, metalness: 0.02 }),
      leafGreen3: new THREE.MeshStandardMaterial({ color: 0x15803d, normalMap: nFoliage, normalScale: vScale(0.40), roughness: 0.76, metalness: 0.02 }),
      leafGreen4: new THREE.MeshStandardMaterial({ color: 0x22c55e, normalMap: nFoliage, normalScale: vScale(0.38), roughness: 0.74, metalness: 0.02 }),
      grassBlade: new THREE.MeshStandardMaterial({ color: 0x22c55e, normalMap: nFoliage, normalScale: vScale(0.35), roughness: 0.75, metalness: 0.0 }),
      flowerRed: new THREE.MeshStandardMaterial({ color: 0xef4444, normalMap: nFoliage, normalScale: vScale(0.30), roughness: 0.42, metalness: 0.08 }),
      flowerYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, normalMap: nFoliage, normalScale: vScale(0.30), roughness: 0.42, metalness: 0.08 }),
      flowerPink: new THREE.MeshStandardMaterial({ color: 0xf472b6, normalMap: nFoliage, normalScale: vScale(0.30), roughness: 0.42, metalness: 0.08 }),
      flowerLavender: new THREE.MeshStandardMaterial({ color: 0xc084fc, normalMap: nFoliage, normalScale: vScale(0.30), roughness: 0.42, metalness: 0.08 }),

      // Piedra, Cerámica PBR y Cerca con NormalMap mineral
      stoneGray: new PhysicalMat({ color: 0x64748b, normalMap: nStone, normalScale: vScale(0.45), roughness: 0.70, metalness: 0.10 }),
      stonePaver: new PhysicalMat({ color: 0x94a3b8, normalMap: nStone, normalScale: vScale(0.48), roughness: 0.72, metalness: 0.06 }),
      picketWhite: new PhysicalMat({ color: 0xf8fafc, normalMap: nWood, normalScale: vScale(0.28), roughness: 0.45, metalness: 0.04, clearcoat: 0.3 }),
      ceramicWhite: new PhysicalMat({ color: 0xffffff, normalMap: nStone, normalScale: vScale(0.16), roughness: 0.15, metalness: 0.08, clearcoat: 0.75 }),
      coffeeLiquid: new PhysicalMat({ color: 0x271206, roughness: 0.10, metalness: 0.15, clearcoat: 0.8 }),
      terracottaPot: new PhysicalMat({ color: 0xc2410c, normalMap: nStone, normalScale: vScale(0.42), roughness: 0.72, metalness: 0.06 }),
      soilDark: new THREE.MeshStandardMaterial({ color: 0x27170a, normalMap: nFoliage, normalScale: vScale(0.55), roughness: 0.92, metalness: 0.0 }),

      // Materiales PBR Procedurales Adicionales (Alta Resolución y Realismo)
      marbleVeined: new PhysicalMat({ color: 0xf8fafc, map: createPBRMarbleTexture(), normalMap: nStone, normalScale: vScale(0.25), roughness: 0.15, metalness: 0.04, clearcoat: 0.95 }),
      fabricWoven: new PhysicalMat({ color: 0x334155, map: createPBRFabricTexture(), normalMap: nFabric, normalScale: vScale(0.40), roughness: 0.82, metalness: 0.02 }),
      brushedSteel: new PhysicalMat({ color: 0x94a3b8, map: createPBRSteelTexture(), normalMap: nMetal, normalScale: vScale(0.35), roughness: 0.25, metalness: 0.85, clearcoat: 0.5 }),
      foliageOrganic: new THREE.MeshStandardMaterial({ color: 0x15803d, map: createPBRFoliageTexture(), normalMap: nFoliage, normalScale: vScale(0.45), roughness: 0.75, metalness: 0.02 }),
      ceramicGlazed: new PhysicalMat({ color: 0xffffff, normalMap: nStone, normalScale: vScale(0.12), roughness: 0.10, metalness: 0.04, clearcoat: 0.95 }),

      // Vidrio Cristalino PBR (transmission: 0.9, clearcoat: 1.0, roughness: 0.05), Pantallas y Luces
      glassClear: new PhysicalMat({ color: 0xe0f2fe, roughness: 0.05, metalness: 0.02, transmission: 0.90, clearcoat: 1.0, transparent: true, opacity: 0.45, ior: 1.5 }),
      glassLantern: new PhysicalMat({ color: 0xfffbeb, emissive: 0xfef08a, emissiveIntensity: 0.35, roughness: 0.15, metalness: 0.10, transmission: 0.65, clearcoat: 0.6, transparent: true, opacity: 0.78 }),
      lampShadeWarm: new THREE.MeshStandardMaterial({ color: 0xfef3c7, normalMap: nFabric, normalScale: vScale(0.28), emissive: 0xf59e0b, emissiveIntensity: 0.65, roughness: 0.35, metalness: 0.05, side: THREE.DoubleSide }),
      emissiveScreen: new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x38bdf8, emissiveIntensity: 0.85, roughness: 0.22 }),
      emissiveBulb: new THREE.MeshStandardMaterial({ color: 0xffedd5, emissive: 0xfef08a, emissiveIntensity: 2.2, roughness: 0.18 }),
      steamTranslucent: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.90, transparent: true, opacity: 0.38 })
    };
    Object.assign(SHARED_MATERIALS, defs);
    global.PBRLib = SHARED_MATERIALS;
    if (typeof window !== 'undefined') window.PBRLib = SHARED_MATERIALS;
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
    const domeGeo = new THREE.SphereGeometry(75, 24, 16);
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
    sprite.visible = false;
    sprite.raycast = () => {};
    sprite.userData = { isHotspotSprite: true, ignoreRaycast: true };
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
    applyNormalMapToObjectHierarchy(group, currentScenarioKey || 'house');
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
    floorLampPointLight.castShadow = false;
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
    spot.castShadow = false;
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
        {"id":"desk","en":"Desk","ipa":"/desk/","es":"Escritorio con Laptop","category":"Study Room","type":"object","example":"I practice English code and grammar on my wooden desk with my laptop.","pos":[3.5,0.22,-3.5]},
        {"id":"computer_monitor","en":"Computer Monitor","ipa":"/kəmˈpjuː.t̬ɚ ˈmɑː.nə.t̬ɚ/","es":"Monitor de Computadora","category":"Study Room","type":"object","example":"The computer monitor glows with interactive English code and lessons.","pos":[3.45,1.22,-3.72]},
        {"id":"office_chair","en":"Office Chair","ipa":"/ˈɑː.fɪs tʃer/","es":"Silla de Oficina Ergonómica","category":"Study Room","type":"object","example":"This ergonomic office chair has a comfortable curved backrest and wheels.","pos":[3.5,0.22,-2.05]},
        {"id":"bookshelf","en":"Bookshelf","ipa":"/ˈbʊk.ʃelf/","es":"Librero / Estantería","category":"Study Room","type":"object","example":"The wooden bookshelf is filled with colorful collectible English novels.","pos":[6.7,0.22,-3.5]},
        {"id":"house_bed","en":"Double Bed","ipa":"/ˈdʌb.əl bed/","es":"Cama Doble con Almohadas","category":"Bedroom","type":"object","example":"I read an English chapter before going to sleep in my comfortable double bed.","pos":[1.8,0.22,1.2]},
        {"id":"house_refrigerator","en":"Refrigerator","ipa":"/rɪˈfrɪdʒ.ə.reɪ.t̬ɚ/","es":"Refrigerador / Nevera","category":"Kitchen","type":"object","example":"Keep the fresh milk and fruit cold inside the stainless steel refrigerator.","pos":[-1.4,0.22,-5.8]},
        {"id":"window","en":"Panoramic Window","ipa":"/ˌpæn.əˈræm.ɪk ˈwɪn.doʊ/","es":"Ventanal Panorámico","category":"Living Room","type":"object","example":"The large window provides a beautiful view of the swaying green trees.","pos":[-6.95,1.15,-1.75]},
        {"id":"sofa","en":"Sofa / Couch","ipa":"/ˈsoʊ.fə/","es":"Sofá / Sillón","category":"Living Room","type":"object","example":"I relax on the cozy sofa after studying English vocabulary.","pos":[-3.6,0.22,-4.1]},
        {"id":"armchair","en":"Reading Armchair","ipa":"/ˈriː.dɪŋ ˈɑːrm.tʃer/","es":"Sillón de Lectura","category":"Living Room","type":"object","example":"I sit in the comfortable armchair by the window to read English stories.","pos":[-5.6,0.22,-0.8]},
        {"id":"coffee_table","en":"Coffee Table","ipa":"/ˈkɑː.fi ˌteɪ.bəl/","es":"Mesa de Centro","category":"Living Room","type":"object","example":"There is a warm ceramic coffee mug resting on the coffee table.","pos":[-3.6,0.22,-2]},
        {"id":"floor_lamp","en":"Floor Lamp","ipa":"/flɔːr læmp/","es":"Lámpara de Pie","category":"Living Room","type":"object","example":"The tall floor lamp illuminates the living room with a warm golden glow.","pos":[-5.8,0.22,-4.5]},
        {"id":"wall_clock","en":"Wall Clock","ipa":"/wɑːl klɑːk/","es":"Reloj de Pared","category":"Living Room","type":"object","example":"I check the ticking wall clock to start my daily English session on time.","pos":[-3.6,2.65,-6.84]},
        {"id":"indoor_plant","en":"Indoor Plant","ipa":"/ˈɪn.dɔːr plænt/","es":"Planta de Interior","category":"Living Room","type":"object","example":"The green indoor plant in the terracotta pot makes the room feel fresh.","pos":[-1.2,0.22,-4.2]},
        {"id":"house_coffee_maker","en":"Coffee Maker","ipa":"/ˈkɑː.fi ˌmeɪ.kɚ/","es":"Cafetera Eléctrica","category":"Kitchen","type":"object","example":"I brewed a fresh pot of espresso with the digital coffee maker.","pos":[-0.6,0.95,-5.5]},
        {"id":"house_microwave","en":"Microwave Oven","ipa":"/ˈmaɪ.kroʊ.weɪv ˈʌv.ən/","es":"Horno Microondas","category":"Kitchen","type":"object","example":"Heat up your breakfast in the stainless steel microwave oven.","pos":[-2.2,0.95,-5.5]},
        {"id":"house_toaster","en":"Bread Toaster","ipa":"/bred ˈtoʊ.stɚ/","es":"Tostadora de Pan","category":"Kitchen","type":"object","example":"Two golden slices of toast popped out of the kitchen toaster.","pos":[-0.2,0.95,-5.5]},
        {"id":"house_blender","en":"Blender","ipa":"/ˈblen.dɚ/","es":"Licuadora de Cocina","category":"Kitchen","type":"object","example":"She made a fresh berry smoothie in the electric glass blender.","pos":[-2.6,0.95,-5.2]},
        {"id":"house_dishwasher","en":"Dishwasher","ipa":"/ˈdɪʃˌwɑː.ʃɚ/","es":"Lavavajillas Automático","category":"Kitchen","type":"object","example":"Load the dirty plates and mugs directly into the dishwasher.","pos":[-1.4,0.22,-4.2]},
        {"id":"house_kitchen_counter","en":"Kitchen Counter","ipa":"/ˈkɪtʃ.ən ˈkaʊn.tɚ/","es":"Mostrador de Cocina","category":"Kitchen","type":"object","example":"Granite kitchen counters offer plenty of space for preparing food.","pos":[-1.4,0.22,-5.2]},
        {"id":"house_dining_table","en":"Dining Table","ipa":"/ˈdaɪ.nɪŋ ˈteɪ.bəl/","es":"Mesa del Comedor","category":"Dining Room","type":"object","example":"The family gathers around the wooden dining table every evening.","pos":[1.2,0.22,-1.5]},
        {"id":"house_dining_chair","en":"Dining Chair","ipa":"/ˈdaɪ.nɪŋ tʃer/","es":"Silla del Comedor","category":"Dining Room","type":"object","example":"Pull up a comfortable dining chair and practice speaking English.","pos":[1.2,0.22,-0.6]},
        {"id":"house_ceiling_fan","en":"Ceiling Fan","ipa":"/ˈsiː.lɪŋ fæn/","es":"Ventilador de Techo","category":"Living Room","type":"object","example":"The ceiling fan circulates cool air throughout the entire apartment.","pos":[-3.5,3.4,-3.5]},
        {"id":"house_oled_tv","en":"OLED Smart TV","ipa":"/ˌoʊ.el.iːˈdiː smɑːrt ˌtiːˈviː/","es":"Televisor OLED Inteligente","category":"Living Room","type":"object","example":"We watch English movies with subtitles on the wall-mounted OLED TV.","pos":[-6.8,1.6,-4.5]},
        {"id":"house_soundbar","en":"Soundbar","ipa":"/ˈsaʊnd.bɑːr/","es":"Barra de Sonido Envolvente","category":"Living Room","type":"object","example":"The soundbar delivers crisp audio for our English listening practice.","pos":[-6.8,1,-4.5]},
        {"id":"house_wardrobe","en":"Wardrobe Closet","ipa":"/ˈwɔːr.droʊb ˈklɑː.zɪt/","es":"Ropero / Clóset","category":"Bedroom","type":"object","example":"Hang your coats, shirts, and suits neatly inside the wooden wardrobe.","pos":[5.2,0.22,1.2]},
        {"id":"house_full_mirror","en":"Full-length Mirror","ipa":"/fʊl leŋθ ˈmɪr.ɚ/","es":"Espejo de Cuerpo Entero","category":"Bedroom","type":"object","example":"She checked her elegant outfit in the tall full-length mirror.","pos":[6.6,0.22,0.5]},
        {"id":"house_nightstand","en":"Bedside Nightstand","ipa":"/ˈbed.saɪd ˈnaɪt.stænd/","es":"Mesa de Noche","category":"Bedroom","type":"object","example":"I keep my notebook and phone charger on the bedside nightstand.","pos":[3.2,0.22,1.2]},
        {"id":"house_bedside_lamp","en":"Bedside Lamp","ipa":"/ˈbed.saɪd læmp/","es":"Lámpara de Noche","category":"Bedroom","type":"object","example":"Turn off the bedside lamp before turning in for the night.","pos":[3.2,0.72,1.2]},
        {"id":"house_washing_machine","en":"Washing Machine","ipa":"/ˈwɑː.ʃɪŋ məˌʃiːn/","es":"Lavadora Automática","category":"Laundry","type":"object","example":"Put the laundry detergent inside the high-efficiency washing machine.","pos":[-6.2,0.22,1.2]},
        {"id":"house_clothes_dryer","en":"Clothes Dryer","ipa":"/kloʊðz ˈdraɪ.ɚ/","es":"Secadora de Ropa","category":"Laundry","type":"object","example":"The clothes dryer tumbled warm towels until they were completely dry.","pos":[-5,0.22,1.2]},
        {"id":"house_curtains","en":"Velvet Curtains","ipa":"/ˈvel.vɪt ˈkɝː.tənz/","es":"Cortinas de Terciopelo","category":"Living Room","type":"object","example":"Close the velvet curtains to block out direct sunlight and keep cool.","pos":[-6.9,2,-1.75]},
        {"id":"house_area_rug","en":"Area Rug","ipa":"/ˈer.i.ə rʌɡ/","es":"Tapete de Sala Tejido","category":"Living Room","type":"object","example":"A plush geometric area rug anchors the furniture in the living room.","pos":[-3.6,0.23,-3]},
        {"id":"house_household_chores","en":"Household chores","ipa":"/ˈhaʊs.hoʊld tʃɔːrz/","es":"Tareas del Hogar","category":"Home Concept","type":"concept","example":"Sharing household chores keeps the living space clean and harmonious.","pos":[-2,1.8,-2.8]},
        {"id":"house_tidy_up","en":"Tidy up the room","ipa":"/ˈtaɪ.di ʌp ðə ruːm/","es":"Ordenar la Habitación","category":"Home Concept","type":"phrase","example":"Let’s spend ten minutes to tidy up the living room before guests arrive.","pos":[-4.2,1.8,-1.5]},
        {"id":"house_make_the_bed","en":"Make the bed","ipa":"/meɪk ðə bed/","es":"Tender la Cama","category":"Home Concept","type":"phrase","example":"Making the bed every morning builds discipline and starts the day right.","pos":[2.2,1.6,2]},
        {"id":"house_do_the_laundry","en":"Do the laundry","ipa":"/duː ðə ˈlɔːn.dri/","es":"Lavar la Ropa","category":"Home Concept","type":"phrase","example":"I usually do the laundry on Sunday mornings while listening to podcasts.","pos":[-5.6,1.8,1.8]},
        {"id":"house_wash_the_dishes","en":"Wash the dishes","ipa":"/wɑːʃ ðə ˈdɪʃ.ɪz/","es":"Lavar los Platos","category":"Home Concept","type":"phrase","example":"Wash the dishes right after dinner so they don’t pile up in the sink.","pos":[-1.8,1.8,-4.8]},
        {"id":"house_vacuum_the_rug","en":"Vacuum the rug","ipa":"/ˈvæk.juːm ðə rʌɡ/","es":"Aspirar la Alfombra","category":"Home Concept","type":"phrase","example":"Use the vacuum cleaner once a week to remove dust from the rug.","pos":[-3.2,1.6,-2.5]},
        {"id":"house_preheat_oven","en":"Pre-heat the oven","ipa":"/priːˈhiːt ðə ˈʌv.ən/","es":"Precalentar el Horno","category":"Home Concept","type":"phrase","example":"Pre-heat the oven to three hundred and fifty degrees before baking.","pos":[-0.8,1.8,-6]},
        {"id":"house_take_a_nap","en":"Take a power nap","ipa":"/teɪk ə ˈpaʊ.ɚ næp/","es":"Tomar una Siesta","category":"Home Concept","type":"phrase","example":"A twenty-minute power nap recharges your mental focus for studying.","pos":[1.2,1.6,1.8]},
        {"id":"house_set_alarm","en":"Set the alarm","ipa":"/set ðə əˈlɑːrm/","es":"Poner la Alarma","category":"Home Concept","type":"phrase","example":"Set the alarm for six-thirty AM so you have time for your lesson.","pos":[3.8,1.6,1.5]},
        {"id":"house_air_conditioning","en":"Air conditioning","ipa":"/ˈer kənˌdɪʃ.ən.ɪŋ/","es":"Aire Acondicionado","category":"Home Concept","type":"concept","example":"Turn on the air conditioning when the summer temperature peaks.","pos":[-5,2.2,-5.2]},
        {"id":"house_drafty","en":"Drafty corridor","ipa":"/ˈdræf.ti ˈkɔːr.ə.dɔːr/","es":"Corriente de Aire Frío","category":"Home Concept","type":"concept","example":"Seal the old window frame because the room feels drafty in winter.","pos":[-6.4,2,-0.2]},
        {"id":"house_cozy","en":"Cozy atmosphere","ipa":"/ˈkoʊ.zi ˈæt.məs.fɪr/","es":"Ambiente Acogedor","category":"Home Concept","type":"concept","example":"The warm fireplace and soft blankets create an incredibly cozy space.","pos":[-4.6,1.8,-3.2]},
        {"id":"house_cluttered","en":"Cluttered desk","ipa":"/ˈklʌt.ɚd desk/","es":"Escritorio Desordenado","category":"Home Concept","type":"concept","example":"A cluttered workspace distracts your attention while studying English.","pos":[4.4,1.8,-2.5]},
        {"id":"house_spotless","en":"Spotless kitchen","ipa":"/ˈspɑːt.ləs ˈkɪtʃ.ən/","es":"Cocina Impecable","category":"Home Concept","type":"concept","example":"After deep cleaning, every kitchen surface was completely spotless.","pos":[-1.2,1.8,-3.8]},
        {"id":"house_power_outlet","en":"Power outlet","ipa":"/ˈpaʊ.ɚ ˌaʊt.let/","es":"Tomacorriente Eléctrico","category":"Home Concept","type":"object","example":"Plug the laptop charger into the wall power outlet near the desk.","pos":[5.2,0.6,-3.8]},
        {"id":"house_wifi_router","en":"Wi-Fi router","ipa":"/ˈwaɪ.faɪ ˈruː.t̬ɚ/","es":"Enrutador Wi-Fi","category":"Home Concept","type":"object","example":"The high-speed Wi-Fi router provides smooth streaming across the home.","pos":[4.8,1.1,-3.6]},
        {"id":"house_light_switch","en":"Light switch","ipa":"/ˈlaɪt ˌswɪtʃ/","es":"Interruptor de Luz","category":"Home Concept","type":"object","example":"Flick the light switch by the entryway to turn on the overhead lights.","pos":[0.3,1.4,3.2]},
        {"id":"house_doorknob","en":"Brass doorknob","ipa":"/bræs ˈdɔːr.nɑːb/","es":"Pomo de la Puerta","category":"Home Concept","type":"object","example":"Turn the polished brass doorknob to open the study room door.","pos":[-0.2,1.2,3.2]},
        {"id":"house_mortgage_rent","en":"Mortgage / Monthly Rent","ipa":"/ˈmɔːr.ɡɪdʒ / rent/","es":"Hipoteca o Renta Mensual","category":"Home Concept","type":"concept","example":"Paying your rent or mortgage on time maintains a good credit score.","pos":[2.5,1.8,-0.5]},
        {"id":"house_roommate","en":"Friendly Roommate","ipa":"/ˈruːm.meɪt/","es":"Compañero de Habitación","category":"Home Concept","type":"concept","example":"Having a bilingual roommate gives you daily opportunities to practice.","pos":[4.2,1.8,0.8]}
      ]
    },
    garden: {
      id: 'garden',
      title: '🌿 Backyard & Garden',
      bg: 0x091410,
      fogDensity: 0.006,
      cameraPos: { x: 0, y: 6.2, z: 19.5 },
      cameraLookAt: { x: 0, y: 1.2, z: 7.2 },
      zones: {
        overview: { pos: { x: 0, y: 6.5, z: 20.2 }, lookAt: { x: 0, y: 1.2, z: 7.2 }, label: '🌿 Vista General' },
        zone1: { pos: { x: -5.2, y: 3.6, z: 12.8 }, lookAt: { x: -5.5, y: 1.2, z: 7.5 }, label: '🌳 Zona 1: Árboles y Banca' },
        zone2: { pos: { x: 4.8, y: 3.6, z: 13.5 }, lookAt: { x: 4.2, y: 1, z: 8.5 }, label: '🔥 Zona 2: Asador y Fuente' },
        zone3: { pos: { x: 0, y: 3.4, z: 16.5 }, lookAt: { x: 0, y: 1, z: 9.2 }, label: '🪨 Camino y Aspersor' }
      },
      objects: [
        {"id":"oak_tree","en":"Oak Tree","ipa":"/oʊk triː/","es":"Árbol de Roble","category":"Garden & Yard","type":"object","example":"The tall oak tree provides cool shade over the green lawn.","pos":[-8.5,0,7.5]},
        {"id":"park_bench","en":"Park Bench","ipa":"/pɑːrk bentʃ/","es":"Banca de Jardín","category":"Garden & Yard","type":"object","example":"We sat on the wooden park bench to practice English conversation.","pos":[-4.5,0,7.5]},
        {"id":"garden_bbq_grill","en":"Barbecue Grill","ipa":"/ˈbɑːr.bə.kjuː ɡrɪl/","es":"Asador / Parrilla BBQ","category":"Garden & Yard","type":"object","example":"We cooked burgers and vegetables on the outdoor barbecue grill.","pos":[4.2,0,8.6]},
        {"id":"garden_sprinkler","en":"Lawn Sprinkler","ipa":"/lɔːn ˈsprɪŋ.klɚ/","es":"Aspersor de Riego","category":"Garden & Yard","type":"object","example":"The rotating lawn sprinkler waters the fresh green grass.","pos":[-2,0,9.2]},
        {"id":"street_lantern","en":"Street Lantern","ipa":"/striːt ˈlæn.tɚn/","es":"Farol de Jardín","category":"Garden & Yard","type":"object","example":"The classic street lantern lights up the stone path at night.","pos":[2.4,0,6.5]},
        {"id":"garden_stone_path","en":"Stone Path","ipa":"/stoʊn pæθ/","es":"Camino de Piedra","category":"Garden & Yard","type":"object","example":"Follow the stepping stone path from the gate to the front door.","pos":[0.2,0.05,8.2]},
        {"id":"flower_bush","en":"Flower Bush","ipa":"/ˈflaʊ.ɚ bʊʃ/","es":"Arbusto Floral","category":"Garden & Yard","type":"object","example":"Colorful blossoms grow on the green flower bush near the porch.","pos":[5.8,0,5.8]},
        {"id":"mailbox","en":"Mailbox","ipa":"/ˈmeɪl.bɑːks/","es":"Buzón de Correo","category":"Garden & Yard","type":"object","example":"I raised the red flag on the mailbox to send a letter.","pos":[2.1,0,11.8]},
        {"id":"garden_picket_fence","en":"Picket Fence","ipa":"/ˈpɪk.ɪt fens/","es":"Cerca Blanca de Madera","category":"Garden & Yard","type":"object","example":"A white picket fence surrounds the front yard.","pos":[-4.5,0,14.5]},
        {"id":"garden_birdhouse","en":"Birdhouse","ipa":"/ˈbɝːd.haʊs/","es":"Casita para Pájaros","category":"Garden & Yard","type":"object","example":"Bluebirds built a nest inside the wooden birdhouse.","pos":[-6.8,0,10.2]},
        {"id":"garden_watering_can","en":"Watering Can","ipa":"/ˈwɑː.t̬ɚ.ɪŋ kæn/","es":"Regadera de Jardín","category":"Garden & Yard","type":"object","example":"Use the metal watering can to water the roses.","pos":[-3.2,0,11.4]},
        {"id":"garden_fountain","en":"Garden Fountain","ipa":"/ˈɡɑːr.dən ˈfaʊn.tən/","es":"Fuente de Agua","category":"Garden & Yard","type":"object","example":"The stone garden fountain makes a relaxing water sound.","pos":[6.4,0,11.2]},
        {"id":"garden_lawn_mower","en":"Lawn Mower","ipa":"/ˈlɔːn ˌmoʊ.ɚ/","es":"Cortadora de Césped","category":"Garden & Yard","type":"object","example":"Mow the front lawn with the electric green lawn mower.","pos":[-1.2,0,13.2]},
        {"id":"garden_wheelbarrow","en":"Wheelbarrow","ipa":"/ˈwiːlˌber.oʊ/","es":"Carretilla de Jardinería","category":"Garden & Yard","type":"object","example":"Load the rich potting soil into the steel wheelbarrow.","pos":[3.2,0,13.6]},
        {"id":"garden_patio_umbrella","en":"Patio Umbrella","ipa":"/ˈpæt̬.i.oʊ ʌmˈbrel.ə/","es":"Sombrilla de Terraza","category":"Garden & Yard","type":"object","example":"Open the large patio umbrella to stay cool during sunny afternoons.","pos":[4.6,0,6.2]},
        {"id":"garden_terracotta_pot","en":"Terracotta Pot","ipa":"/ˌter.əˈkɑː.t̬ə pɑːt/","es":"Maceta de Barro","category":"Garden & Yard","type":"object","example":"Plant purple lavender inside the handmade terracotta pot.","pos":[1.2,0,6.8]},
        {"id":"garden_hose","en":"Garden Hose","ipa":"/ˈɡɑːr.dən hoʊz/","es":"Manguera de Riego","category":"Garden & Yard","type":"object","example":"Uncoil the flexible garden hose to wash the flagstone patio.","pos":[-5.2,0,11.6]},
        {"id":"garden_shovel","en":"Garden Shovel","ipa":"/ˈʃʌv.əl/","es":"Pala de Jardinería","category":"Garden & Yard","type":"object","example":"Dig a small hole for the new rose bush with the steel shovel.","pos":[-7.2,0,8.8]},
        {"id":"garden_rake","en":"Leaf Rake","ipa":"/liːf reɪk/","es":"Rastrillo de Hojas","category":"Garden & Yard","type":"object","example":"Rake the fallen autumn leaves into a tidy compost pile.","pos":[-7.8,0,9.6]},
        {"id":"garden_hedge_trimmer","en":"Hedge Trimmer","ipa":"/ˈhedʒ ˌtrɪm.ɚ/","es":"Cortasetos de Jardín","category":"Garden & Yard","type":"object","example":"Trim the perimeter bushes evenly using the electric hedge trimmer.","pos":[7.2,0,7.8]},
        {"id":"garden_birdbath","en":"Stone Birdbath","ipa":"/stoʊn ˈbɝːd.bæθ/","es":"Bebedero de Aves de Piedra","category":"Garden & Yard","type":"object","example":"Cardinals splash playfully inside the carved stone birdbath.","pos":[-3.6,0,6]},
        {"id":"garden_hammock","en":"Garden Hammock","ipa":"/ˈɡɑːr.dən ˈhæm.ək/","es":"Hamaca entre Árboles","category":"Garden & Yard","type":"object","example":"She read a novel while swaying gently in the cotton garden hammock.","pos":[-7.5,0,12.5]},
        {"id":"garden_greenhouse","en":"Mini Greenhouse","ipa":"/ˈmɪn.i ˈɡriːn.haʊs/","es":"Invernadero de Cristal","category":"Garden & Yard","type":"object","example":"Heirloom tomatoes thrive in the humid warmth of the mini greenhouse.","pos":[7.5,0,13.8]},
        {"id":"garden_compost_bin","en":"Compost Bin","ipa":"/ˈkɑːm.poʊst bɪn/","es":"Contenedor de Composta","category":"Garden & Yard","type":"object","example":"Throw vegetable scraps into the compost bin to enrich your soil.","pos":[6.8,0,15.2]},
        {"id":"garden_stepping_stones","en":"Stepping Stones","ipa":"/ˈstep.ɪŋ stoʊnz/","es":"Huellas de Piedra","category":"Garden & Yard","type":"object","example":"Walk along the round stepping stones to keep your shoes dry.","pos":[-1.5,0.04,10.5]},
        {"id":"garden_patio_heater","en":"Patio Heater","ipa":"/ˈpæt̬.i.oʊ ˈhiː.t̬ɚ/","es":"Calefactor de Exterior","category":"Garden & Yard","type":"object","example":"The propane patio heater radiates cozy warmth on chilly evenings.","pos":[5.2,0,9.8]},
        {"id":"garden_fire_pit","en":"Stone Fire Pit","ipa":"/stoʊn ˈfaɪr ˌpɪt/","es":"Brasero de Piedra Exterior","category":"Garden & Yard","type":"object","example":"We roasted marshmallows over the glowing embers of the stone fire pit.","pos":[3.2,0,10.4]},
        {"id":"garden_storage_shed","en":"Storage Shed","ipa":"/ˈstɔːr.ɪdʒ ʃed/","es":"Cobertizo de Jardín","category":"Garden & Yard","type":"object","example":"Store the lawnmower, fertilizer, and rakes safely inside the shed.","pos":[-7.8,0,15.2]},
        {"id":"garden_wind_chime","en":"Bamboo Wind Chime","ipa":"/bæmˈbuː ˈwɪnd ˌtʃaɪm/","es":"Campana de Viento de Bambú","category":"Garden & Yard","type":"object","example":"The bamboo wind chime produces gentle melodies when the breeze blows.","pos":[-4.2,2.2,7.5]},
        {"id":"garden_sunbed","en":"Patio Sunbed","ipa":"/ˈpæt̬.i.oʊ ˈsʌn.bed/","es":"Camastro de Bronceado","category":"Garden & Yard","type":"object","example":"Relax on the cushioned sunbed while enjoying the afternoon sunshine.","pos":[5.8,0,7.2]},
        {"id":"garden_pergola","en":"Cedar Pergola","ipa":"/ˈsiː.dɚ ˈpɝː.ɡə.lə/","es":"Pérgola de Cedro","category":"Garden & Yard","type":"object","example":"Flowering wisteria vines climb up the wooden beams of the pergola.","pos":[4,0,7.5]},
        {"id":"garden_beehive_box","en":"Beehive Box","ipa":"/ˈbiː.haɪv bɑːks/","es":"Colmena de Abejas Melíferas","category":"Garden & Yard","type":"object","example":"Honeybees enter the wooden beehive box with pollen from the garden.","pos":[7.8,0,9.2]},
        {"id":"garden_photosynthesis","en":"Photosynthesis process","ipa":"/ˌfoʊ.t̬oʊˈsɪn.θə.sɪs/","es":"Proceso de Fotosíntesis","category":"Nature Concept","type":"concept","example":"Green leaves absorb sunlight to produce oxygen through photosynthesis.","pos":[-6.5,1.8,6.8]},
        {"id":"garden_mow_lawn","en":"Mow the front lawn","ipa":"/moʊ ðə frʌnt lɔːn/","es":"Podar el Césped","category":"Nature Concept","type":"phrase","example":"I like to mow the front lawn early before the midday heat sets in.","pos":[-1.8,1.6,12.2]},
        {"id":"garden_pull_weeds","en":"Pull out garden weeds","ipa":"/pʊl aʊt ˈɡɑːr.dən wiːdz/","es":"Arrancar las Malas Hierbas","category":"Nature Concept","type":"phrase","example":"Pull out garden weeds by the roots so they do not choke the flowers.","pos":[1.5,1.5,9.8]},
        {"id":"garden_plant_seeds","en":"Plant flower seeds","ipa":"/plænt ˈflaʊ.ɚ siːdz/","es":"Sembrar Semillas","category":"Nature Concept","type":"phrase","example":"Plant sunflower seeds two inches deep in rich organic soil.","pos":[4.5,1.6,11.8]},
        {"id":"garden_bloom_blossom","en":"Bloom into full blossom","ipa":"/bluːm ˈɪn.tuː fʊl ˈblɑːs.əm/","es":"Florecer en Todo su Esplendor","category":"Nature Concept","type":"phrase","example":"Cherry trees bloom into spectacular pink blossom every single spring.","pos":[6.2,1.8,6.5]},
        {"id":"garden_damp_soil","en":"Rich damp soil","ipa":"/rɪtʃ dæmp sɔɪl/","es":"Tierra Fértil y Húmeda","category":"Nature Concept","type":"concept","example":"Earthworms tunnel through the rich damp soil beneath the flower beds.","pos":[-2.5,1.4,7.8]},
        {"id":"garden_soaked","en":"Soaked after the storm","ipa":"/soʊkt ˈæf.tɚ ðə stɔːrm/","es":"Empapado tras la Tormenta","category":"Nature Concept","type":"concept","example":"The grass was completely soaked after three hours of heavy rain.","pos":[0.5,1.5,12.5]},
        {"id":"garden_muggy_heat","en":"Muggy summer afternoon","ipa":"/ˈmʌɡ.i ˈsʌm.ɚ ˌæf.tɚˈnuːn/","es":"Calor Húmedo y Bochorno","category":"Nature Concept","type":"concept","example":"The air felt very muggy before the cooling thunderstorm rolled in.","pos":[2.8,1.8,8.2]},
        {"id":"garden_breeze","en":"Refreshing breeze","ipa":"/rɪˈfreʃ.ɪŋ briːz/","es":"Brisa Fresca y Reconfortante","category":"Nature Concept","type":"concept","example":"A refreshing breeze stirred the tall branches on the oak tree.","pos":[-5.2,2.2,8.8]},
        {"id":"garden_shade","en":"Rest in the shade","ipa":"/rest ɪn ðə ʃeɪd/","es":"Descansar a la Sombra","category":"Nature Concept","type":"phrase","example":"Find a cool spot to rest in the shade during peak sun hours.","pos":[-7,1.8,8.2]},
        {"id":"garden_sunlight","en":"Direct sunlight exposure","ipa":"/dəˈrekt ˈsʌn.laɪt ɪkˈspoʊ.ʒɚ/","es":"Exposición a Plena Luz Solar","category":"Nature Concept","type":"concept","example":"These vibrant roses require at least six hours of direct sunlight.","pos":[5.2,1.8,8.8]},
        {"id":"garden_squirrel","en":"Playful squirrel","ipa":"/ˈpleɪ.fəl ˈskwɝː.əl/","es":"Ardilla Juguetona","category":"Nature Concept","type":"concept","example":"A gray squirrel dashed up the tree trunk carrying an acorn.","pos":[-6.2,1.6,9.8]},
        {"id":"garden_butterfly","en":"Monarch butterfly","ipa":"/ˈmɑː.nɚk ˈbʌt̬.ɚ.flaɪ/","es":"Mariposa Monarca","category":"Nature Concept","type":"concept","example":"A bright monarch butterfly fluttered gently between the blossoms.","pos":[4.8,1.8,7.8]},
        {"id":"garden_fertilizer","en":"Organic plant fertilizer","ipa":"/ɔːrˈɡæn.ɪk plænt ˈfɝː.t̬əl.aɪ.zɚ/","es":"Fertilizante Orgánico para Plantas","category":"Nature Concept","type":"concept","example":"Apply organic fertilizer every four weeks to promote healthy growth.","pos":[6,1.5,14.2]},
        {"id":"garden_prune_bushes","en":"Prune the rose bushes","ipa":"/pruːn ðə roʊz ˈbʊʃ.ɪz/","es":"Podar los Rosales","category":"Nature Concept","type":"phrase","example":"Prune the rose bushes carefully in early spring to encourage buds.","pos":[5.2,1.6,6.2]},
        {"id":"garden_outdoor_lighting","en":"Warm outdoor lighting","ipa":"/wɔːrm ˈaʊtˌdɔːr ˈlaɪ.t̬ɪŋ/","es":"Iluminación Cálida de Exteriores","category":"Nature Concept","type":"concept","example":"Warm outdoor lighting transforms the stone patio at dusk.","pos":[1.8,2,7.2]},
        {"id":"garden_harvest","en":"Harvest fresh vegetables","ipa":"/ˈhɑːr.vəst freʃ ˈvedʒ.tə.bəlz/","es":"Cosechar Verduras Frescas","category":"Nature Concept","type":"phrase","example":"We harvest crisp lettuce, cucumbers, and tomatoes for our salads.","pos":[7,1.6,12.5]},
        {"id":"garden_dew","en":"Glistening morning dew","ipa":"/ˈɡlɪs.ən.ɪŋ ˈmɔːr.nɪŋ duː/","es":"Rocío Matutino Brillante","category":"Nature Concept","type":"concept","example":"Tiny droplets of morning dew sparkled on every blade of grass.","pos":[-0.5,1.4,9.5]},
        {"id":"garden_perennial","en":"Perennial flowering plant","ipa":"/pəˈren.i.əl ˈflaʊ.ɚ.ɪŋ plænt/","es":"Planta Perenne Floral","category":"Nature Concept","type":"concept","example":"Perennial plants return year after year without needing replanting.","pos":[3.8,1.6,6.8]},
        {"id":"garden_biodiversity","en":"Backyard biodiversity","ipa":"/ˌbækˈjɑːrd ˌbaɪ.oʊ.daɪˈvɝː.sə.t̬i/","es":"Biodiversidad del Jardín","category":"Nature Concept","type":"concept","example":"Planting native species encourages bird and pollinator biodiversity.","pos":[-3.8,1.8,13.5]}
      ]
    },
    dating: {
      id: 'dating',
      title: '🕯️ Romantic Date & Bistro 3D',
      bg: 0x070b14,
      fogDensity: 0.004,
      cameraPos: { x: 0, y: 4.8, z: 8.6 },
      cameraLookAt: { x: 0, y: 1.05, z: 0 },
      zones: {
        overview: { pos: { x: 0, y: 4.8, z: 8.6 }, lookAt: { x: 0, y: 1.25, z: -0.3 }, label: '🕯️ Vista General' },
        zone1: { pos: { x: 0, y: 2.35, z: 2.75 }, lookAt: { x: 0, y: 1.15, z: 0 }, label: '🍷 Zona 1: Mesa Romántica' },
        zone2: { pos: { x: 2.2, y: 2.5, z: 1.8 }, lookAt: { x: 1.2, y: 1.25, z: -1.8 }, label: '🤵 Zona 2: Mesero IA' },
        zone3: { pos: { x: -2.2, y: 2.8, z: 1.5 }, lookAt: { x: -1.2, y: 1.6, z: -5.2 }, label: '🎻 Balcón y Violín' }
      },
      objects: [
        {"id":"dating_table_for_two","en":"Table for Two","ipa":"/ˈteɪ.bəl fɔːr tuː/","es":"Mesa Íntima para Dos con Mantel Borgoña","category":"Romantic Date","type":"object","example":"I reserved a romantic table for two on the rooftop terrace.","pos":[0,0,0]},
        {"id":"dating_candlelight","en":"Candlelight","ipa":"/ˈkæn.dəl.laɪt/","es":"Vela Encendida con Luz Cálida","category":"Romantic Date","type":"object","example":"We enjoyed a quiet dinner by warm candlelight on the starry terrace.","pos":[0,0.99,0]},
        {"id":"dating_wine_glasses","en":"Wine Glasses","ipa":"/waɪn ˈɡlæs.ɪz/","es":"Dos Copas de Cristal PBR","category":"Romantic Date","type":"object","example":"They clinked their wine glasses and made a toast in English.","pos":[0.26,0.99,0.26]},
        {"id":"dating_menu","en":"Menu","ipa":"/ˈmen.juː/","es":"Menú Bilingüe del Bistró","category":"Romantic Date","type":"object","example":"Could we see the dinner menu and the wine list, please?","pos":[-0.34,0.99,0.28]},
        {"id":"dating_rose_bouquet","en":"Rose Bouquet","ipa":"/roʊz buˈkeɪ/","es":"Ramo de Rosas Rojas","category":"Romantic Date","type":"object","example":"A fresh red rose bouquet decorated the center of our table.","pos":[0,0.99,-0.32]},
        {"id":"dating_violin","en":"Violin","ipa":"/ˌvaɪəˈlɪn/","es":"Violín Acústico de Serenata","category":"Romantic Date","type":"object","example":"A romantic violin melody played softly under the stars.","pos":[-3.4,0,-2.2]},
        {"id":"dating_city_balcony","en":"City View Balcony","ipa":"/ˈsɪt̬.i vjuː ˈbæl.kə.ni/","es":"Balcón con Skyline Nocturno Iluminado","category":"Romantic Date","type":"object","example":"We stepped out onto the city view balcony to admire the skyline.","pos":[0,0,-5.2]},
        {"id":"dating_waiter_npc","en":"Waiter NPC","ipa":"/ˈweɪ.t̬ɚ/","es":"Mesero 3D Interactivo","category":"Romantic Date","type":"object","example":"Our friendly waiter recommended the chef’s special tonight.","pos":[2.8,0,-2.4]},
        {"id":"dating_chocolate_dessert","en":"Chocolate Dessert","ipa":"/ˈtʃɑː.klət dɪˈzɝːt/","es":"Postre de Chocolate Gourmet","category":"Romantic Date","type":"object","example":"Would you like to share this warm chocolate dessert with me?","pos":[0.24,0.99,-0.26]},
        {"id":"dating_conversation_cards","en":"Conversation Cards","ipa":"/ˌkɑːn.vɚˈseɪ.ʃən kɑːrdz/","es":"Tarjetas Románticas (Icebreakers)","category":"Romantic Date","type":"object","example":"These conversation cards have great questions to get to know each other.","pos":[-0.32,0.99,-0.26]},
        {"id":"dating_ice_bucket","en":"Ice Bucket","ipa":"/aɪs ˈbʌk.ɪt/","es":"Cubeta de Hielo y Espumoso","category":"Romantic Date","type":"object","example":"The sparkling cider is chilling in the silver ice bucket.","pos":[-2.15,0,-1.25]},
        {"id":"dating_string_lights","en":"String Lights","ipa":"/strɪŋ laɪts/","es":"Guirnalda de Luces de Terraza","category":"Romantic Date","type":"object","example":"Golden string lights glowed above the bistro terrace all night.","pos":[3.6,0,-2.8]},
        {"id":"dating_chandelier","en":"Crystal Chandelier","ipa":"/ˈkrɪs.təl ˌʃæn.dəˈlɪr/","es":"Candelabro de Cristal","category":"Bistro Decor","type":"object","example":"The antique crystal chandelier cast romantic refractions across the floor.","pos":[0,3.8,-0.5]},
        {"id":"dating_cloth_napkin","en":"Linen Cloth Napkin","ipa":"/ˈlɪn.ɪn klɑːθ ˈnæp.kɪn/","es":"Servilleta de Lino Fino","category":"Romantic Date","type":"object","example":"Unfold your linen cloth napkin and place it gently on your lap.","pos":[0.45,0.99,0.12]},
        {"id":"dating_silver_cutlery","en":"Polished Silver Cutlery","ipa":"/ˈpɑː.lɪʃt ˈsɪl.vɚ ˈkʌt.lɚ.i/","es":"Cubiertos de Plata Pulida","category":"Romantic Date","type":"object","example":"The polished silver cutlery gleamed under the flickering candlelight.","pos":[-0.45,0.99,0.12]},
        {"id":"dating_champagne_flute","en":"Champagne Flute","ipa":"/ʃæmˈpeɪn fluːt/","es":"Copa Flauta de Champaña","category":"Romantic Date","type":"object","example":"Tiny bubbles rose in the tall crystal champagne flute.","pos":[0.18,0.99,-0.18]},
        {"id":"dating_reserved_sign","en":"Brass Reserved Sign","ipa":"/bræs rɪˈzɝːvd saɪn/","es":"Letrero Dorado de Reservado","category":"Romantic Date","type":"object","example":"A gleaming brass reserved sign held our table under the city stars.","pos":[-0.18,0.99,0.22]},
        {"id":"dating_cocktail_shaker","en":"Cocktail Shaker","ipa":"/ˈkɑːk.teɪl ˌʃeɪ.kɚ/","es":"Coctelera de Acero","category":"Bistro Decor","type":"object","example":"The bartender mixed passionfruit martinis in the stainless cocktail shaker.","pos":[3.4,0.95,-2.2]},
        {"id":"dating_dessert_spoon","en":"Silver Dessert Spoon","ipa":"/ˈsɪl.vɚ dɪˈzɝːt spuːn/","es":"Cuchara de Postre","category":"Romantic Date","type":"object","example":"Use the silver dessert spoon to taste the molten chocolate lava cake.","pos":[0.38,0.99,-0.22]},
        {"id":"dating_bread_basket","en":"Warm Bread Basket","ipa":"/wɔːrm bred ˈbæs.kɪt/","es":"Cesta de Pan Caliente","category":"Romantic Date","type":"object","example":"The waiter brought a warm bread basket with rosemary and olive butter.","pos":[-0.18,0.99,-0.16]},
        {"id":"dating_olive_oil_cruet","en":"Olive Oil Cruet","ipa":"/ˈɑː.lɪv ɔɪl ˈkruː.ɪt/","es":"Aceitera Gourmet de Cristal","category":"Romantic Date","type":"object","example":"Drizzle extra-virgin olive oil from the glass cruet onto the focaccia.","pos":[0.18,0.99,0.16]},
        {"id":"dating_coat_rack","en":"Bistro Coat Rack","ipa":"/ˈbiː.stroʊ koʊt ræk/","es":"Perchero de Abrigos del Bistró","category":"Bistro Decor","type":"object","example":"The host hung our trench coats on the mahogany bistro coat rack.","pos":[4.2,0,-0.5]},
        {"id":"dating_acoustic_guitar","en":"Spanish Acoustic Guitar","ipa":"/ˈspæn.ɪʃ əˈkuː.stɪk ɡɪˈtɑːr/","es":"Guitarra Acústica Española","category":"Bistro Decor","type":"object","example":"A guitarist played soft flamenco melodies on the acoustic guitar nearby.","pos":[-3.8,0,-3.2]},
        {"id":"dating_velvet_drapes","en":"Velvet Terrace Drapes","ipa":"/ˈvel.vɪt ˈter.əs dreɪps/","es":"Cortinajes de Terciopelo","category":"Bistro Decor","type":"object","example":"Crimson velvet terrace drapes framed the magnificent skyline vista.","pos":[-4.2,1.8,-4.8]},
        {"id":"dating_maitre_podium","en":"Maître D' Podium","ipa":"/ˌmeɪ.trə ˈdiː ˈpoʊ.di.əm/","es":"Podio de Bienvenida del Bistró","category":"Bistro Decor","type":"object","example":"The maître d’ welcomed us at the entrance podium with our reservation.","pos":[3.45,0,-2.4]},
        {"id":"dating_pick_up_line","en":"Cheesy pick-up line","ipa":"/ˈtʃiː.zi ˈpɪk.ʌp laɪn/","es":"Frase Graciosa para Coquetear","category":"Dating Phrase","type":"phrase","example":"He told a cheesy pick-up line that made her laugh and broke the tension.","pos":[-1.8,1.8,0.8]},
        {"id":"dating_break_the_ice","en":"Break the ice with a smile","ipa":"/breɪk ðə aɪs/","es":"Romper el Hielo","category":"Dating Phrase","type":"phrase","example":"Asking about someone’s favorite travel destination is great to break the ice.","pos":[-1.2,1.8,1.4]},
        {"id":"dating_first_impression","en":"Unforgettable first impression","ipa":"/ˌfɝːst ɪmˈpreʃ.ən/","es":"Primera Impresión Inolvidable","category":"Dating Concept","type":"concept","example":"Her confident smile and warm greeting left an unforgettable first impression.","pos":[1.2,1.8,1.4]},
        {"id":"dating_give_compliment","en":"Give a sincere compliment","ipa":"/ɡɪv ə sɪnˈsɪr ˈkɑːm.plə.mənt/","es":"Hacer un Cumplido Sincero","category":"Dating Phrase","type":"phrase","example":"Give a sincere compliment: You look absolutely stunning in that evening dress.","pos":[1.8,1.8,0.8]},
        {"id":"dating_split_the_bill","en":"Split the bill equally","ipa":"/splɪt ðə bɪl ˈiː.kwə.li/","es":"Dividir la Cuenta en Partes Iguales","category":"Dating Phrase","type":"phrase","example":"Shall we split the bill equally, or would you prefer I take care of it?","pos":[0.6,1.8,-1.8]},
        {"id":"dating_treat_someone","en":"It is on me! / Treat someone","ipa":"/ɪts ɑːn miː/","es":"Invitar la Cuenta / Yo Invito","category":"Dating Phrase","type":"phrase","example":"Please put your wallet away—tonight dinner is on me!","pos":[-0.6,1.8,-1.8]},
        {"id":"dating_make_reservation","en":"Make an advance reservation","ipa":"/meɪk ən ədˈvæns ˌrez.ɚˈveɪ.ʃən/","es":"Reservar con Anticipación","category":"Dating Phrase","type":"phrase","example":"Make an advance reservation two weeks ahead for prime rooftop seating.","pos":[2.2,1.8,-1.2]},
        {"id":"dating_candlelit_dinner","en":"Intimate candlelit dinner","ipa":"/ˈɪn.t̬ə.mət ˈkæn.dəl.lɪt ˈdɪn.ɚ/","es":"Cena Íntima a la Luz de las Velas","category":"Dating Concept","type":"concept","example":"An intimate candlelit dinner allows for deep, distraction-free conversation.","pos":[-0.2,1.8,0.5]},
        {"id":"dating_dress_up","en":"Dress up for date night","ipa":"/dres ʌp fɔːr deɪt naɪt/","es":"Vestirse de Gala para la Cita","category":"Dating Phrase","type":"phrase","example":"It feels special to dress up in elegant evening wear for a romantic date night.","pos":[-2.2,1.8,-0.6]},
        {"id":"dating_great_chemistry","en":"Electric chemistry","ipa":"/iˈlek.trɪk ˈkem.ə.stri/","es":"Química Especial y Conexión","category":"Dating Concept","type":"concept","example":"From their very first words, they shared an unmistakable electric chemistry.","pos":[0,1.8,1.8]},
        {"id":"dating_blind_date","en":"Exciting blind date","ipa":"/ɪkˈsaɪ.t̬ɪŋ ˌblaɪnd ˈdeɪt/","es":"Cita a Ciegas Emocionante","category":"Dating Concept","type":"concept","example":"Her best friend set them up on an exciting blind date at Starlight Bistro.","pos":[-2.5,1.8,1.2]},
        {"id":"dating_ask_someone_out","en":"Ask someone out on a date","ipa":"/æsk ˈsʌm.wʌn aʊt/","es":"Invitar a Salir a Alguien","category":"Dating Phrase","type":"phrase","example":"He gathered his courage to ask her out for coffee after the English seminar.","pos":[2.5,1.8,1.2]},
        {"id":"dating_into_you","en":"I am so into you!","ipa":"/aɪ æm soʊ ˈɪn.tuː juː/","es":"¡Me Gustas Demasiado!","category":"Dating Phrase","type":"phrase","example":"I have to admit—I am so into you and love how passionate you are.","pos":[0.8,1.8,0.4]},
        {"id":"dating_make_toast","en":"Raise our glasses for a toast","ipa":"/reɪz ˈaʊ.ɚ ˈɡlæs.ɪz/","es":"Levantar las Copas para Brindar","category":"Dating Phrase","type":"phrase","example":"Let’s raise our glasses for a toast to new adventures and learning English!","pos":[0.4,1.8,-0.8]},
        {"id":"dating_romantic_ambiance","en":"Warm romantic ambiance","ipa":"/roʊˈmæn.tɪk ˈæm.bi.əns/","es":"Atmósfera Romántica Cálida","category":"Dating Concept","type":"concept","example":"Soft jazz music, candlelight, and glowing city towers create romantic ambiance.","pos":[-1.5,2.2,-3.5]},
        {"id":"dating_appetizer_concept","en":"Share a delicious appetizer","ipa":"/ʃer ə dɪˈlɪʃ.əs ˈæp.ə.taɪ.zɚ/","es":"Compartir una Entrada Gourmet","category":"Dating Phrase","type":"phrase","example":"Shall we share a delicious appetizer of bruschetta and artisanal cheeses?","pos":[-0.8,1.8,0.2]},
        {"id":"dating_main_course_concept","en":"Savory main course","ipa":"/ˈseɪ.vɚ.i meɪn kɔːrs/","es":"Plato Principal Suculento","category":"Dating Concept","type":"concept","example":"For our main course, we chose pan-seared sea bass and grilled filet mignon.","pos":[0.8,1.8,-0.2]},
        {"id":"dating_sommelier_concept","en":"Knowledgeable sommelier","ipa":"/ˌsɑːm.əlˈjeɪ/","es":"Sumiller Experto en Vinos","category":"Dating Concept","type":"concept","example":"The sommelier recommended a velvety Pinot Noir that paired impeccably.","pos":[2.2,1.8,-2.8]},
        {"id":"dating_tip_the_waiter","en":"Leave a generous tip","ipa":"/liːv ə ˈdʒen.ɚ.əs tɪp/","es":"Dejar una Propina Generosa","category":"Dating Phrase","type":"phrase","example":"The service was outstanding, so we made sure to leave a generous tip.","pos":[1.8,1.8,-1.8]},
        {"id":"dating_check_please","en":"Could we have the check, please?","ipa":"/kʊd wiː hæv ðə tʃek pliːz/","es":"¿Nos Trae la Cuenta, por Favor?","category":"Dating Phrase","type":"phrase","example":"Excuse me, waiter—whenever you are ready, could we have the check, please?","pos":[1.2,1.8,-2.2]},
        {"id":"dating_soulmates","en":"True soulmates","ipa":"/truː ˈsoʊl.meɪts/","es":"Almas Gemelas Verdaderas","category":"Dating Concept","type":"concept","example":"They finish each other’s sentences as though they were true soulmates.","pos":[-0.6,2,1.6]},
        {"id":"dating_fiance","en":"Loving fiancé / fiancée","ipa":"/fiˌɑːnˈseɪ/","es":"Prometido / Prometida","category":"Dating Concept","type":"concept","example":"He proposed under the starry sky, and now she is his radiant fiancée.","pos":[0.6,2,1.6]},
        {"id":"dating_butterflies","en":"Butterflies in my stomach","ipa":"/ˈbʌt̬.ɚ.flaɪz ɪn maɪ ˈstʌm.ək/","es":"Mariposas en el Estómago","category":"Dating Phrase","type":"phrase","example":"Even after months together, I still get butterflies in my stomach seeing you.","pos":[-1.2,1.8,0.4]},
        {"id":"dating_fall_in_love","en":"Fall head over heels in love","ipa":"/fɑːl hed ˈoʊ.vɚ hiːlz ɪn lʌv/","es":"Enamorarse Perdidamente","category":"Dating Phrase","type":"phrase","example":"It did not take long for both of them to fall head over heels in love.","pos":[1.5,2.2,0]},
        {"id":"dating_see_again","en":"I would love to see you again!","ipa":"/aɪ wʊd lʌv tuː siː juː əˈɡen/","es":"¡Me Encantaría Volverte a Ver!","category":"Dating Phrase","type":"phrase","example":"Tonight was magical—I would love to see you again this coming weekend.","pos":[-1.5,2.2,0]},
        {"id":"dating_love_first_sight","en":"Love at first sight","ipa":"/lʌv æt fɝːst saɪt/","es":"Amor a Primera Vista","category":"Dating Concept","type":"concept","example":"Some people doubt love at first sight until they experience it themselves.","pos":[0,2.4,1.2]},
        {"id":"dating_holding_hands","en":"Holding hands across the table","ipa":"/ˈhoʊl.dɪŋ hændz/","es":"Tomarse de las Manos en la Mesa","category":"Dating Phrase","type":"phrase","example":"They sat holding hands across the table as the violin melody ended.","pos":[0,1.8,-0.1]}
      ]
    },
    space: {
      id: 'space',
      title: '🚀 Outer Space & Astronomy',
      bg: 0x020617,
      fogDensity: 0.001,
      cameraPos: { x: 0, y: 11.5, z: 18.5 },
      cameraLookAt: { x: 0, y: 2.2, z: 0 },
      zones: {
        overview: { pos: { x: 0, y: 11.5, z: 18.5 }, lookAt: { x: 0, y: 1.8, z: 0 }, label: '🚀 Vista General' },
        zone1: { pos: { x: 0, y: 5.5, z: 8.2 }, lookAt: { x: 0, y: 2.2, z: 0 }, label: '☀️ Zona 1: Sol y Tierra' },
        zone2: { pos: { x: 7.5, y: 5.8, z: 9.5 }, lookAt: { x: 5.5, y: 2.2, z: -1.5 }, label: '🪐 Zona 2: Saturno y Agujero Negro' },
        zone3: { pos: { x: -6.5, y: 5.8, z: 9.2 }, lookAt: { x: -4.5, y: 2.8, z: 1 }, label: '👩‍🚀 Nave y Telescopio' }
      },
      objects: [
        {"id":"space_sun","en":"Sun","ipa":"/sʌn/","es":"Sol Brillante Central","category":"Outer Space","type":"object","example":"The Sun is the glowing star at the center of our solar system.","pos":[0,2.2,0],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":0.45},
        {"id":"space_earth","en":"Earth","ipa":"/ɝːθ/","es":"Planeta Tierra","category":"Outer Space","type":"object","example":"Earth is our home planet with blue oceans and green continents.","pos":[4.2,2.2,0],"orbitRadius":4.2,"orbitSpeed":0.38,"orbitPhase":0.4,"rotSpeed":1.2},
        {"id":"space_moon","en":"Moon","ipa":"/muːn/","es":"La Luna (Satélite Natural)","category":"Outer Space","type":"object","example":"The Moon orbits around the Earth approximately every twenty-eight days.","pos":[5.4,2.6,1.2],"orbitRadius":5.3,"orbitSpeed":0.52,"orbitPhase":1.1,"rotSpeed":0.8},
        {"id":"space_mars","en":"Mars","ipa":"/mɑːrz/","es":"Marte (El Planeta Rojo)","category":"Outer Space","type":"object","example":"Mars is known as the Red Planet because of iron oxide on its surface.","pos":[-6.4,2.2,2],"orbitRadius":6.7,"orbitSpeed":0.28,"orbitPhase":2.6,"rotSpeed":1},
        {"id":"space_saturn","en":"Saturn & Rings","ipa":"/ˈsæt̬.ɚn ænd rɪŋz/","es":"Saturno con Anillos","category":"Outer Space","type":"object","example":"Saturn & Rings are famous for their spectacular icy ring system.","pos":[8.8,2.4,-3.5],"orbitRadius":9.4,"orbitSpeed":0.18,"orbitPhase":5.1,"rotSpeed":0.7},
        {"id":"space_spacecraft","en":"Spacecraft","ipa":"/ˈspeɪs.kræft/","es":"Nave Espacial / Cohete","category":"Outer Space","type":"object","example":"The spacecraft ignited its engines to travel beyond Earth orbit.","pos":[-3.5,3.6,5.2],"orbitRadius":6.2,"orbitSpeed":0.44,"orbitPhase":3.8,"rotSpeed":0.5},
        {"id":"space_telescope","en":"Telescope","ipa":"/ˈtel.ə.skoʊp/","es":"Telescopio Espacial Orbital","category":"Outer Space","type":"object","example":"The space telescope captures deep infrared images of distant galaxies.","pos":[-7.5,3.8,-4.2],"orbitRadius":8.6,"orbitSpeed":0.15,"orbitPhase":4,"rotSpeed":0.35},
        {"id":"space_astronaut","en":"Astronaut","ipa":"/ˈæs.trə.nɑːt/","es":"Astronauta en Caminata Espacial","category":"Outer Space","type":"object","example":"The astronaut wore a pressurized suit during the spacewalk.","pos":[2.6,3.4,5.8],"orbitRadius":6.3,"orbitSpeed":0.22,"orbitPhase":1.7,"rotSpeed":0.4},
        {"id":"space_asteroid","en":"Asteroid","ipa":"/ˈæs.tə.rɔɪd/","es":"Asteroide Rocoso","category":"Outer Space","type":"object","example":"A metallic asteroid tumbled silently through the asteroid belt.","pos":[7.2,1.8,5.2],"orbitRadius":8.8,"orbitSpeed":0.31,"orbitPhase":0.9,"rotSpeed":1.6},
        {"id":"space_black_hole","en":"Black Hole","ipa":"/ˌblæk ˈhoʊl/","es":"Agujero Negro Supermasivo","category":"Outer Space","type":"object","example":"Nothing, not even light, can escape the event horizon of a black hole.","pos":[6.8,3.8,-6.2],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":1.8},
        {"id":"space_satellite","en":"Satellite","ipa":"/ˈsæt̬.əl.aɪt/","es":"Satélite de Comunicaciones","category":"Outer Space","type":"object","example":"The solar-powered satellite relays global communication signals.","pos":[-4.8,4,-5],"orbitRadius":6.9,"orbitSpeed":0.35,"orbitPhase":2.1,"rotSpeed":0.6},
        {"id":"space_axial_rotation","en":"Axial Rotation","ipa":"/ˈæk.si.əl roʊˈteɪ.ʃən/","es":"Rotación Axial Planetaria","category":"Outer Space","type":"concept","example":"A planet’s axial rotation determines the length of its day.","pos":[-8.8,1.4,4.5],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":1.5},
        {"id":"space_gravity","en":"Gravity","ipa":"/ˈɡræv.ə.t̬i/","es":"Campo de Gravedad Orbital","category":"Outer Space","type":"concept","example":"Gravity is the invisible force that keeps planets in orbit around stars.","pos":[8.8,1.2,4.8],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":0.9},
        {"id":"space_mercury","en":"Mercury","ipa":"/ˈmɝː.kjʊ.ri/","es":"Planeta Mercurio","category":"Outer Space","type":"object","example":"Mercury is the smallest planet and closest to the scorching Sun.","pos":[2.2,2.2,0.8],"orbitRadius":2.4,"orbitSpeed":0.65,"orbitPhase":0.2,"rotSpeed":0.6},
        {"id":"space_venus","en":"Venus","ipa":"/ˈviː.nəs/","es":"Planeta Venus","category":"Outer Space","type":"object","example":"Venus has a dense, greenhouse atmosphere shrouded in golden clouds.","pos":[-3.2,2.2,-1.2],"orbitRadius":3.4,"orbitSpeed":0.48,"orbitPhase":1.8,"rotSpeed":-0.4},
        {"id":"space_jupiter","en":"Jupiter & Great Red Spot","ipa":"/ˈdʒuː.pə.t̬ɚ/","es":"Júpiter y Gran Mancha Roja","category":"Outer Space","type":"object","example":"Jupiter is the massive gas giant with a raging Great Red Spot storm.","pos":[10.5,2.5,2.5],"orbitRadius":11.2,"orbitSpeed":0.14,"orbitPhase":3.4,"rotSpeed":2.1},
        {"id":"space_uranus","en":"Uranus","ipa":"/ˈjʊr.ə.nəs/","es":"Planeta Urano","category":"Outer Space","type":"object","example":"Uranus is an ice giant that rotates on its side with a pale cyan hue.","pos":[-11,2.8,-4.5],"orbitRadius":12.5,"orbitSpeed":0.1,"orbitPhase":4.8,"rotSpeed":1.1},
        {"id":"space_neptune","en":"Neptune","ipa":"/ˈnep.tuːn/","es":"Planeta Neptuno","category":"Outer Space","type":"object","example":"Neptune is a dark blue world with the fastest supersonic winds in our solar system.","pos":[12.8,2.6,-6],"orbitRadius":14.2,"orbitSpeed":0.08,"orbitPhase":0.8,"rotSpeed":1.2},
        {"id":"space_neutron_star","en":"Pulsing Neutron Star","ipa":"/ˈnuː.trɑːn stɑːr/","es":"Estrella de Neutrones Pulsante","category":"Outer Space","type":"object","example":"A super-dense neutron star spins hundreds of times per second.","pos":[-9.5,4.5,7.5],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":4.5},
        {"id":"space_supernova","en":"Supernova Explosion","ipa":"/ˌsuː.pɚˈnoʊ.və/","es":"Explosión de Supernova","category":"Outer Space","type":"object","example":"A dying massive star ends its life in a brilliant supernova explosion.","pos":[11.5,5.2,8.5],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":0.3},
        {"id":"space_launch_rocket","en":"Heavy Launch Rocket","ipa":"/ˈhevi lɑːntʃ ˈrɑː.kɪt/","es":"Cohete de Lanzamiento Pesado","category":"Outer Space","type":"object","example":"The multi-stage heavy launch rocket generates millions of pounds of thrust.","pos":[-1.8,4.2,8.5],"orbitRadius":8.5,"orbitSpeed":0.25,"orbitPhase":5.2,"rotSpeed":0.5},
        {"id":"space_space_station","en":"International Space Station","ipa":"/ˌspeɪs ˈsteɪ.ʃən/","es":"Estación Espacial Internacional (ISS)","category":"Outer Space","type":"object","example":"Astronauts conduct microgravity science aboard the International Space Station.","pos":[5.2,4,3.8],"orbitRadius":6.8,"orbitSpeed":0.42,"orbitPhase":2.8,"rotSpeed":0.4},
        {"id":"space_lunar_rover","en":"Lunar Exploration Rover","ipa":"/ˈluː.nɚ ˈroʊ.vɚ/","es":"Vehículo Explorador Lunar","category":"Outer Space","type":"object","example":"The four-wheeled lunar rover drove across dusty craters on the Moon.","pos":[5.6,2.9,1.5],"orbitRadius":5.5,"orbitSpeed":0.52,"orbitPhase":1.2,"rotSpeed":0.2},
        {"id":"space_spacesuit","en":"Extravehicular Spacesuit","ipa":"/ˈspeɪs.suːt/","es":"Traje Espacial con Soporte Vital","category":"Outer Space","type":"object","example":"An astronaut’s spacesuit shields against extreme vacuum and temperatures.","pos":[2.9,3.6,6],"orbitRadius":6.4,"orbitSpeed":0.22,"orbitPhase":1.8,"rotSpeed":0.4},
        {"id":"space_asteroid_belt","en":"Asteroid Belt Region","ipa":"/ˈæs.tə.rɔɪd belt/","es":"Región del Cinturón de Asteroides","category":"Outer Space","type":"object","example":"Millions of rocky fragments orbit between the orbits of Mars and Jupiter.","pos":[-7.8,2,5.5],"orbitRadius":8.8,"orbitSpeed":0.2,"orbitPhase":4.1,"rotSpeed":0.8},
        {"id":"space_halley_comet","en":"Halley's Icy Comet","ipa":"/ˈhæl.iz ˈkɑː.mɪt/","es":"Cometa con Cola de Hielo y Gas","category":"Outer Space","type":"object","example":"The glowing tail of the comet points directly away from the solar wind.","pos":[-6.8,5.2,-8.5],"orbitRadius":11.5,"orbitSpeed":0.16,"orbitPhase":1.5,"rotSpeed":0.6},
        {"id":"space_meteorite","en":"Metallic Meteorite","ipa":"/ˈmiː.t̬i.ə.raɪt/","es":"Meteorito de Hierro y Níquel","category":"Outer Space","type":"object","example":"A metallic iron meteorite burned brightly as it entered the atmosphere.","pos":[8.5,3.2,4],"orbitRadius":9.2,"orbitSpeed":0.28,"orbitPhase":0.6,"rotSpeed":1.4},
        {"id":"space_orion_nebula","en":"Luminous Nebula Cloud","ipa":"/ˈluː.mə.nəs ˈneb.jə.lə/","es":"Nebulosa Estelar Luminosa","category":"Outer Space","type":"object","example":"Newborn stars ignite inside the dense hydrogen gas of the nebula.","pos":[-12.5,6,0],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":0.1},
        {"id":"space_milky_way","en":"Spiral Milky Way Galaxy","ipa":"/ˈspaɪ.rəl ˈmɪl.ki weɪ/","es":"Brazos Espirales de la Vía Láctea","category":"Outer Space","type":"object","example":"Our solar system resides on the Orion Arm of the barred spiral Milky Way.","pos":[0,8.5,-12],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":0.05},
        {"id":"space_solar_array","en":"Photovoltaic Solar Array","ipa":"/ˌfoʊ.t̬oʊ.vɑːlˈteɪ.ɪk əˈreɪ/","es":"Arreglo de Paneles Solares","category":"Outer Space","type":"object","example":"Photovoltaic solar arrays convert raw sunlight into electrical energy.","pos":[4.8,4.2,3.6],"orbitRadius":6.8,"orbitSpeed":0.42,"orbitPhase":2.8,"rotSpeed":0.4},
        {"id":"space_launchpad_tower","en":"Launchpad Service Tower","ipa":"/ˈlɑːntʃ.pæd ˈtaʊ.ɚ/","es":"Torre de Lanzamiento Espacial","category":"Outer Space","type":"object","example":"Umbilical arms disconnect from the spacecraft as launch engines ignite.","pos":[-3.8,0.5,10.5],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":0},
        {"id":"space_deep_probe","en":"Deep Space Robotic Probe","ipa":"/diːp speɪs proʊb/","es":"Sonda Robótica de Espacio Profundo","category":"Outer Space","type":"object","example":"The robotic probe transmits telemetry data across billions of miles.","pos":[11.2,3.8,-10.5],"orbitRadius":15.5,"orbitSpeed":0.06,"orbitPhase":3.1,"rotSpeed":0.3},
        {"id":"space_orbital_translation","en":"Orbital translation speed","ipa":"/ˈɔːr.bɪ.təl trænzˈleɪ.ʃən/","es":"Velocidad de Traslación Orbital","category":"Astrophysics","type":"concept","example":"Earth travels around the Sun at an orbital translation speed of thirty km/s.","pos":[3.8,3.2,0]},
        {"id":"space_zero_gravity","en":"Zero gravity (Weightlessness)","ipa":"/ˈzɪr.oʊ ˈɡræv.ə.t̬i/","es":"Gravedad Cero / Ingrávidez","category":"Astrophysics","type":"concept","example":"Water drops float as perfect spheres in the zero gravity environment.","pos":[1.8,3.8,5]},
        {"id":"space_event_horizon","en":"Black hole event horizon","ipa":"/ɪˈvent həˈraɪ.zən/","es":"Horizonte de Sucesos del Agujero Negro","category":"Astrophysics","type":"concept","example":"Once matter crosses the event horizon, escape becomes mathematically impossible.","pos":[6.2,4.5,-5.8]},
        {"id":"space_light_year","en":"Interstellar light-year distance","ipa":"/ˈlaɪtˌjɪr ˈdɪs.təns/","es":"Distancia en Años Luz","category":"Astrophysics","type":"concept","example":"Proxima Centauri is located over four light-years away from our planet.","pos":[-5.2,4.8,6.2]},
        {"id":"space_solar_eclipse","en":"Total solar eclipse","ipa":"/ˈtoʊ.təl ˈsoʊ.lɚ ɪˈklɪps/","es":"Eclipse Solar Total","category":"Astrophysics","type":"concept","example":"Day turns to twilight during the breathtaking totality of a solar eclipse.","pos":[2,3.2,0.5]},
        {"id":"space_lunar_phase","en":"Waxing crescent lunar phase","ipa":"/ˈluː.nɚ feɪz/","es":"Fases de la Luna","category":"Astrophysics","type":"concept","example":"The changing illumination angle produces the cycle of lunar phases.","pos":[4.8,3.5,1.8]},
        {"id":"space_atmosphere_concept","en":"Protective planetary atmosphere","ipa":"/ˈplæn.ə.ter.i ˈæt.məs.fɪr/","es":"Atmósfera Protectora del Planeta","category":"Astrophysics","type":"concept","example":"The ozone layer within the atmosphere shields surface life from ultraviolet rays.","pos":[4.6,2.8,-0.6]},
        {"id":"space_cosmic_radiation","en":"Shielding from cosmic radiation","ipa":"/ˈkɑːz.mɪk ˌreɪ.diˈeɪ.ʃən/","es":"Protección contra Radiación Cósmica","category":"Astrophysics","type":"concept","example":"Deep-space habitats require heavy water shielding against cosmic radiation.","pos":[-2.5,4.5,4.2]},
        {"id":"space_spacewalk_eva","en":"Extravehicular spacewalk (EVA)","ipa":"/ˈspeɪs.wɑːk/","es":"Caminata Espacial (EVA)","category":"Astrophysics","type":"phrase","example":"During an eight-hour spacewalk, the crew replaced the main battery modules.","pos":[3.2,4.2,6.2]},
        {"id":"space_countdown_concept","en":"Final launch countdown","ipa":"/ˈfaɪ.nəl lɑːntʃ ˈkaʊnt.daʊn/","es":"Cuenta Regresiva Final de Lanzamiento","category":"Astrophysics","type":"phrase","example":"Ten, nine, eight... Main engine start... Zero, and we have liftoff!","pos":[-2.2,3.2,9.2]},
        {"id":"space_docking_concept","en":"Autonomous docking procedure","ipa":"/ɔːˈtɑː.nə.məs ˈdɑːk.ɪŋ/","es":"Maniobra de Acoplamiento Automático","category":"Astrophysics","type":"concept","example":"Thrusters fired gently to align the hatch for the autonomous docking procedure.","pos":[4.5,4.8,4.2]},
        {"id":"space_reentry_concept","en":"Blazing atmospheric re-entry","ipa":"/ˌæt.məsˈfer.ɪk riːˈen.tri/","es":"Reentrada a la Atmósfera","category":"Astrophysics","type":"concept","example":"The ceramic thermal heat shield glows white-hot during atmospheric re-entry.","pos":[3.5,1.8,-1.2]},
        {"id":"space_exoplanet_concept","en":"Habitable zone exoplanet","ipa":"/ˈhæb.ə.t̬ə.bəl ˈek.soʊˌplæn.ɪt/","es":"Exoplaneta en Zona Habitable","category":"Astrophysics","type":"concept","example":"Astronomers scan for liquid water vapor in the atmosphere of the exoplanet.","pos":[-8.2,3.8,-2.5]},
        {"id":"space_constellation_concept","en":"Zodiac constellation","ipa":"/ˈzoʊ.di.æk ˌkɑːn.stəˈleɪ.ʃən/","es":"Constelación Zodiacal","category":"Astrophysics","type":"concept","example":"Ancient sailors navigated open seas guided by the stars of Orion and Ursa Major.","pos":[-4.2,6.2,-6.8]},
        {"id":"space_gravitational_pull","en":"Gravitational attraction force","ipa":"/ˌɡræv.əˈteɪ.ʃən.əl pʊl/","es":"Fuerza de Atracción Gravitacional","category":"Astrophysics","type":"concept","example":"The immense gravitational pull of the Sun keeps eight planets locked in orbit.","pos":[0,4,0]},
        {"id":"space_vacuum_concept","en":"Absolute vacuum of outer space","ipa":"/ˈvæk.juːm əv speɪs/","es":"Vacío Absoluto del Espacio Exterior","category":"Astrophysics","type":"concept","example":"Sound waves cannot propagate through the silence of the vacuum of space.","pos":[6.5,3,1.5]},
        {"id":"space_redshift_concept","en":"Cosmological redshift","ipa":"/ˈkɑːz.mə.lɑː.dʒɪkəl ˈred.ʃɪft/","es":"Corrimiento al Rojo Cosmológico","category":"Astrophysics","type":"concept","example":"The expansion of the universe stretches light wavelengths toward cosmological redshift.","pos":[-10.5,4.2,3.5]},
        {"id":"space_dark_matter","en":"Mysterious dark matter halo","ipa":"/dɑːrk ˈmæt̬.ɚ ˈheɪ.loʊ/","es":"Halo Invisible de Materia Oscura","category":"Astrophysics","type":"concept","example":"Dark matter does not interact with light but holds galaxies together gravitationally.","pos":[9.5,5.5,-4.5]},
        {"id":"space_ancient_starlight","en":"Ancient starlight from distant epochs","ipa":"/ˈeɪn.ʃənt ˈstɑːr.laɪt/","es":"Luz Estelar de Épocas Remotas","category":"Astrophysics","type":"concept","example":"Looking at distant galaxies means viewing ancient starlight that traveled billions of years.","pos":[-7.5,5.5,-5.2]},
        {"id":"space_escape_velocity","en":"Planetary escape velocity","ipa":"/ɪˈskeɪp vəˈlɑː.sə.t̬i/","es":"Velocidad de Escape Planetaria","category":"Astrophysics","type":"concept","example":"A spacecraft must exceed eleven kilometers per second to escape Earth’s gravity.","pos":[2.5,4.2,2.2]},
        {"id":"space_interstellar_medium","en":"Thin interstellar medium","ipa":"/ˌɪn.t̬ɚˈstel.ɚ ˈmiː.di.əm/","es":"Medio Interestelar Difuso","category":"Astrophysics","type":"concept","example":"The Voyager probes crossed the heliopause and entered the interstellar medium.","pos":[-12,2.8,-8]}
      ]
    },
    supermarket: {
      id: 'supermarket',
      title: '🛒 Supermarket',
      bg: 0x0b1120,
      fogDensity: 0.005,
      cameraPos: { x: 0, y: 8.8, z: 14.2 },
      cameraLookAt: { x: 0, y: 1.2, z: 0 },
      zones: {
        overview: { pos: { x: 0, y: 8.8, z: 14.2 }, lookAt: { x: 0, y: 1.2, z: -1 }, label: '🛒 Vista General' },
        zone1: { pos: { x: -3.5, y: 4.2, z: 5.8 }, lookAt: { x: -3.2, y: 1.2, z: -2.2 }, label: '🍎 Zona 1: Frescos y Panadería' },
        zone2: { pos: { x: 3.2, y: 3.8, z: 7.5 }, lookAt: { x: 3, y: 1, z: 2.5 }, label: '💳 Zona 2: Cajas y Escáner' },
        zone3: { pos: { x: 2.5, y: 4.2, z: 3.2 }, lookAt: { x: 3.2, y: 1.2, z: -3.2 }, label: '🥛 Lácteos y Congelados' }
      },
      objects: [
        {"id":"market_shopping_cart","en":"Shopping Cart","ipa":"/ˈʃɑː.pɪŋ kɑːrt/","es":"Carrito de Compras","category":"Supermarket","type":"object","example":"I pushed the metal shopping cart down the main grocery aisle.","pos":[-2.8,0,3.2]},
        {"id":"market_cash_register","en":"Cash Register","ipa":"/ˈkæʃ ˌredʒ.ɪ.stɚ/","es":"Caja Registradora","category":"Supermarket","type":"object","example":"The cashier rang up our items on the digital cash register.","pos":[3.2,1.08,2.8]},
        {"id":"market_barcode_scanner","en":"Barcode Scanner","ipa":"/ˈbɑːr.koʊd ˈskæn.ɚ/","es":"Escáner de Código de Barras","category":"Supermarket","type":"object","example":"Pass the product over the laser barcode scanner to check the price.","pos":[2.1,1.08,3]},
        {"id":"market_fresh_produce","en":"Fresh Produce Section","ipa":"/freʃ ˈproʊ.duːs ˈsek.ʃən/","es":"Sección de Frutas y Verduras Frescas","category":"Supermarket","type":"object","example":"Organic apples, lettuce, and tomatoes are in the fresh produce display.","pos":[-4.8,0,-1.2]},
        {"id":"market_bakery","en":"Bakery Counter","ipa":"/ˈbeɪ.kɚ.i ˈkaʊn.tɚ/","es":"Mostrador de Panadería","category":"Supermarket","type":"object","example":"We bought warm baguettes and croissants from the bakery counter.","pos":[-1.6,0,-4.2]},
        {"id":"market_dairy_section","en":"Dairy Section","ipa":"/ˈder.i ˈsek.ʃən/","es":"Sección de Lácteos","category":"Supermarket","type":"object","example":"Cold milk, butter, and yogurt are kept in the refrigerated dairy section.","pos":[2,0,-4.2]},
        {"id":"market_frozen_aisle","en":"Frozen Foods Aisle","ipa":"/ˈfroʊ.zən aɪl/","es":"Pasillo de Congelados","category":"Supermarket","type":"object","example":"Ice cream and frozen vegetables are stored in the glass frozen aisle.","pos":[5.2,0,-1.2]},
        {"id":"market_scale","en":"Produce Scale","ipa":"/ˈproʊ.duːs skeɪl/","es":"Báscula Digital de Peso","category":"Supermarket","type":"object","example":"Place the fruit on the scale to measure its weight in pounds or kilos.","pos":[-2.4,0,-0.8]},
        {"id":"market_shopping_basket","en":"Hand Shopping Basket","ipa":"/ˈʃɑː.pɪŋ ˈbæs.kɪt/","es":"Canasta de Mano","category":"Supermarket","type":"object","example":"Carry a hand shopping basket when you only need a few groceries.","pos":[-0.8,0,3.8]},
        {"id":"market_price_tag","en":"Yellow Price Tag","ipa":"/ˈpraɪs tæɡ/","es":"Etiqueta de Precio en Oferta","category":"Supermarket","type":"object","example":"Look at the yellow price tag to see the twenty percent discount.","pos":[-4.8,1.65,1.2]},
        {"id":"market_receipt","en":"Printed Receipt","ipa":"/rɪˈsiːt/","es":"Recibo / Ticket de Compra","category":"Supermarket","type":"object","example":"Would you like your printed receipt in the bag or with you?","pos":[4.1,1.08,3.1]},
        {"id":"market_checkout","en":"Checkout Belt Lane","ipa":"/ˈtʃek.aʊt leɪn/","es":"Línea de Caja / Checkout","category":"Supermarket","type":"object","example":"Place your groceries on the moving belt at the express checkout.","pos":[3,0,2.8]},
        {"id":"market_conveyor_belt","en":"Motorized Conveyor Belt","ipa":"/kənˈveɪ.ɚ belt/","es":"Cinta Transportadora de Caja","category":"Supermarket","type":"object","example":"The motorized conveyor belt glided the groceries toward the cashier.","pos":[2.5,0.95,2.2]},
        {"id":"market_deli_counter","en":"Gourmet Deli Counter","ipa":"/ˈdel.i ˈkaʊn.tɚ/","es":"Mostrador de Fiambrería y Quesos","category":"Supermarket","type":"object","example":"Ask the butcher to slice half a pound of smoked turkey at the deli counter.","pos":[-5.2,0,-4.2]},
        {"id":"market_beverage_aisle","en":"Beverage & Juice Aisle","ipa":"/ˈbev.rɪdʒ aɪl/","es":"Pasillo de Bebidas y Jugos","category":"Supermarket","type":"object","example":"Sparkling waters and cold pressed juices line the beverage aisle.","pos":[4.8,0,-3.8]},
        {"id":"market_canned_goods","en":"Canned Goods Shelf","ipa":"/kænd ɡʊdz ʃelf/","es":"Estantería de Alimentos Enlatados","category":"Supermarket","type":"object","example":"Stock up on canned tomatoes, tuna, and black beans for your pantry.","pos":[-0.5,0,-2.5]},
        {"id":"market_cereal_aisle","en":"Breakfast Cereal Aisle","ipa":"/ˈsɪr.i.əl aɪl/","es":"Pasillo de Cereales y Granola","category":"Supermarket","type":"object","example":"Whole grain oats and crunchy granolas fill the cereal aisle.","pos":[1.8,0,-2.2]},
        {"id":"market_reusable_bag","en":"Eco Reusable Grocery Bag","ipa":"/riːˈjuː.zə.bəl ˈɡroʊ.sɚ.i bæɡ/","es":"Bolsa Ecológica Reutilizable","category":"Supermarket","type":"object","example":"Bring your own canvas reusable bag to reduce plastic waste.","pos":[3.8,0.8,2.5]},
        {"id":"market_card_terminal","en":"Contactless POS Terminal","ipa":"/ˌpiː.oʊˈes ˈtɝː.mə.nəl/","es":"Terminal de Tarjeta sin Contacto","category":"Supermarket","type":"object","example":"Tap your smartphone or contactless debit card against the POS terminal.","pos":[3.4,1.15,2.4]},
        {"id":"market_cooler_display","en":"Refrigerated Glass Cooler","ipa":"/rɪˈfrɪdʒ.ə.reɪ.t̬ɪd ˈkuː.lɚ/","es":"Vitrina Enfriadora con Puertas de Vidrio","category":"Supermarket","type":"object","example":"Open the misted glass door of the cooler to select your almond milk.","pos":[5.4,0,1.5]},
        {"id":"market_produce_crate","en":"Rustic Produce Crate","ipa":"/ˈrʌs.tɪk ˈproʊ.duːs kreɪt/","es":"Huacal de Frutas Frescas","category":"Supermarket","type":"object","example":"Crisp Fuji apples are arranged neatly in the wooden produce crate.","pos":[-3.8,0.4,-0.8]},
        {"id":"market_trolley_bay","en":"Supermarket Trolley Bay","ipa":"/ˈtrɑː.li beɪ/","es":"Bahía de Carritos de Compra","category":"Supermarket","type":"object","example":"Return your empty shopping cart to the designated trolley bay.","pos":[-4.5,0,4.5]},
        {"id":"market_aisle_sign","en":"Hanging Aisle Sign","ipa":"/ˈhæŋ.ɪŋ aɪl saɪn/","es":"Señalética Colgante de Pasillo","category":"Supermarket","type":"object","example":"The blue hanging aisle sign indicates pasta, sauces, and condiments.","pos":[0,3.2,-1.5]},
        {"id":"market_scanner_gun","en":"Handheld Barcode Gun","ipa":"/ˈhænd.held ˈbɑːr.koʊd ɡʌn/","es":"Pistola Escáner Inalámbrica","category":"Supermarket","type":"object","example":"The inventory clerk scanned the barcodes using the handheld scanner gun.","pos":[2.4,1.12,3.2]},
        {"id":"market_bread_rack","en":"Artisanal Bread Rack","ipa":"/ɑːrˌtɪz.ən.əl bred ræk/","es":"Estantería de Pan Artesanal","category":"Supermarket","type":"object","example":"Fresh sourdough loaves sit cooling on the artisanal wooden bread rack.","pos":[-1.2,0.5,-4.8]},
        {"id":"market_dairy_fridge","en":"Glass Dairy Refrigerator","ipa":"/ˈder.i rɪˈfrɪdʒ.ə.reɪ.t̬ɚ/","es":"Refrigerador de Leche y Quesos","category":"Supermarket","type":"object","example":"Organic Greek yogurts are kept ice-cold in the dairy refrigerator.","pos":[2.5,0,-4.8]},
        {"id":"market_bulk_dispenser","en":"Bulk Food Dispenser","ipa":"/bʌlk fuːd dɪˈspen.sɚ/","es":"Dispensador de Alimentos a Granel","category":"Supermarket","type":"object","example":"Pull the lever on the bulk dispenser to fill your bag with raw almonds.","pos":[-3.4,0.8,-3.2]},
        {"id":"market_plastic_divider","en":"Cashier Customer Divider","ipa":"/kæˈʃɪr dɪˈvaɪ.dɚ/","es":"Separador de Compras en Caja","category":"Supermarket","type":"object","example":"Place the plastic divider between your items and the next customer.","pos":[2.6,1,2]},
        {"id":"market_shelf_tag","en":"Electronic Shelf Tag","ipa":"/ɪˌlekˈtrɑː.nɪk ʃelf tæɡ/","es":"Etiqueta Digital de Precio","category":"Supermarket","type":"object","example":"The electronic shelf tag updates promotional prices in real time.","pos":[-4.2,1.2,-1.8]},
        {"id":"market_meat_counter","en":"Fresh Butcher Counter","ipa":"/ˈbʊtʃ.ɚ ˈkaʊn.tɚ/","es":"Mostrador de Carnicería","category":"Supermarket","type":"object","example":"Ask the butcher for prime cut sirloin steaks at the fresh meat counter.","pos":[-3.8,0,-4.5]},
        {"id":"market_seafood_ice","en":"Seafood Display on Ice","ipa":"/ˈsiː.fuːd dɪˈspleɪ ɑːn aɪs/","es":"Pescadería sobre Hielo Picado","category":"Supermarket","type":"object","example":"Wild salmon fillets rest over crushed ice on the seafood display.","pos":[0.8,0,-4.8]},
        {"id":"market_cleaning_aisle","en":"Cleaning Supplies Shelf","ipa":"/ˈkliː.nɪŋ səˈplaɪz ʃelf/","es":"Estante de Productos de Limpieza","category":"Supermarket","type":"object","example":"Biodegradable detergents and paper towels are in the cleaning aisle.","pos":[4.2,0,0.2]},
        {"id":"market_groceries_concept","en":"Weekly grocery haul","ipa":"/ˈwiːk.li ˈɡroʊ.sɚ.i hɑːl/","es":"Compras Semanales de Abarrotes","category":"Shopping Concept","type":"concept","example":"We bought fresh fruits, vegetables, and pantry staples in our weekly grocery haul.","pos":[-2,1.8,2.8]},
        {"id":"market_out_of_stock","en":"Temporarily out of stock","ipa":"/ˈtem.pə.rer.əl.i aʊt əv stɑːk/","es":"Agotado Temporalmente","category":"Shopping Concept","type":"phrase","example":"I wanted to buy almond milk, but it was temporarily out of stock.","pos":[4.2,1.8,-4.2]},
        {"id":"market_on_sale","en":"Fifty percent off / On sale","ipa":"/ɑːn seɪl/","es":"En Oferta / Descuento","category":"Shopping Concept","type":"phrase","example":"Check the endcaps—premium olive oil is currently fifty percent on sale.","pos":[-3.5,1.8,0.5]},
        {"id":"market_bogo_deal","en":"Buy one get one free (BOGO)","ipa":"/baɪ wʌn ɡet wʌn friː/","es":"Promoción 2x1 (BOGO)","category":"Shopping Concept","type":"phrase","example":"These organic snack bars are on a buy one get one free promotion today.","pos":[1.2,1.8,-1.8]},
        {"id":"market_expiration_date","en":"Check the expiration date","ipa":"/ˈtʃek ðə ˌek.spəˈreɪ.ʃən deɪt/","es":"Verificar la Fecha de Vencimiento","category":"Shopping Concept","type":"phrase","example":"Always check the expiration date on dairy products before buying them.","pos":[2.8,1.8,-4]},
        {"id":"market_nutrition_facts","en":"Read the nutrition facts panel","ipa":"/nuːˈtrɪʃ.ən fækts ˈpæn.əl/","es":"Revisar la Tabla Nutricional","category":"Shopping Concept","type":"phrase","example":"Read the nutrition facts panel to check for added sugar and fiber grams.","pos":[-0.2,1.8,-2.8]},
        {"id":"market_organic_produce","en":"Certified organic vegetables","ipa":"/ˈsɝː.t̬ə.faɪd ɔːrˈɡæn.ɪk/","es":"Verduras Orgánicas Certificadas","category":"Shopping Concept","type":"concept","example":"Certified organic vegetables are grown without synthetic chemical pesticides.","pos":[-4.2,1.8,-1.5]},
        {"id":"market_ripe_produce","en":"Perfect balance of ripe fruit","ipa":"/ˈpɝː.fekt ˈbæl.əns əv raɪp fruːt/","es":"Fruta Madura en su Punto","category":"Shopping Concept","type":"concept","example":"Select avocados that yield to gentle pressure—they are perfectly ripe.","pos":[-3.2,1.8,-0.5]},
        {"id":"market_spoiled_food","en":"Spoiled or moldy food","ipa":"/spɔɪld ɔːr ˈmoʊl.di fuːd/","es":"Alimento Estropeado o Vencido","category":"Shopping Concept","type":"concept","example":"Notify supermarket staff if you ever see spoiled or broken packages.","pos":[-5.2,1.8,-0.8]},
        {"id":"market_freshly_baked","en":"Warm freshly baked bread","ipa":"/ˈfreʃ.li beɪkt bred/","es":"Pan Recién Horneado","category":"Shopping Concept","type":"phrase","example":"The irresistible aroma of warm freshly baked baguettes filled the front entrance.","pos":[-1.4,1.8,-3.8]},
        {"id":"market_aisle_number","en":"Down aisle number four","ipa":"/daʊn aɪl ˈnʌm.bɚ fɔːr/","es":"Por el Pasillo Número Cuatro","category":"Shopping Concept","type":"phrase","example":"You will find pasta and marinara sauces halfway down aisle number four.","pos":[0.8,2.2,-1.2]},
        {"id":"market_pay_in_cash","en":"Pay in cash at checkout","ipa":"/peɪ ɪn kæʃ æt ˈtʃek.aʊt/","es":"Pagar en Efectivo en Caja","category":"Shopping Concept","type":"phrase","example":"Would you prefer to pay in cash or with your contactless debit card?","pos":[2.4,1.8,3.2]},
        {"id":"market_pay_by_card","en":"Insert or swipe your card","ipa":"/ɪnˈsɝːt ɔːr swaɪp jʊr kɑːrd/","es":"Pagar con Tarjeta Bancaria","category":"Shopping Concept","type":"phrase","example":"Insert your chip card or tap the screen to complete the transaction.","pos":[3.2,1.8,2.2]},
        {"id":"market_contactless_pay","en":"Tap for contactless payment","ipa":"/tæp fɔːr ˈkɑːn.tæk.ləs ˈpeɪ.mənt/","es":"Pago con Tarjeta sin Contacto","category":"Shopping Concept","type":"phrase","example":"Tap your digital wallet on the glowing terminal for quick contactless payment.","pos":[3.6,1.8,2.8]},
        {"id":"market_keep_change","en":"Keep the change as a tip","ipa":"/kiːp ðə tʃeɪndʒ/","es":"Quédese con el Cambio","category":"Shopping Concept","type":"phrase","example":"Thank you for your cheerful service! You can keep the change.","pos":[4.2,1.8,3.2]},
        {"id":"market_request_refund","en":"Request a store refund","ipa":"/rɪˈkwest ə stɔːr ˈriː.fʌnd/","es":"Solicitar un Reembolso en Tienda","category":"Shopping Concept","type":"phrase","example":"Bring your receipt to customer service to request a store refund.","pos":[4.8,1.8,2]},
        {"id":"market_shopping_list","en":"Follow your shopping list","ipa":"/ˈfɑː.loʊ jʊr ˈʃɑː.pɪŋ lɪst/","es":"Seguir la Lista de Compras","category":"Shopping Concept","type":"phrase","example":"Stick to your handwritten shopping list to prevent unnecessary impulse buying.","pos":[-1.2,1.8,3]},
        {"id":"market_impulse_buying","en":"Avoid cashier impulse buys","ipa":"/əˈvɔɪd ˈɪm.pʌls baɪz/","es":"Evitar Compras por Impulso","category":"Shopping Concept","type":"concept","example":"Candy bars and magazines placed by checkout lanes encourage impulse buys.","pos":[1.8,1.8,2.5]},
        {"id":"market_buy_in_bulk","en":"Buy staples in bulk to save","ipa":"/baɪ ɪn bʌlk tuː seɪv/","es":"Comprar a Granel para Ahorrar","category":"Shopping Concept","type":"phrase","example":"Buying brown rice, oats, and nuts in bulk saves packaging and money.","pos":[-2.8,1.8,-2.8]},
        {"id":"market_price_check","en":"Can I get a price check on this?","ipa":"/praɪs tʃek ɑːn ðɪs/","es":"¿Me Puede Verificar el Precio?","category":"Shopping Concept","type":"phrase","example":"Excuse me, the shelf tag was missing—can I get a quick price check on this?","pos":[-4.2,1.8,1.8]}
      ]
    },
    hotel: {
      id: 'hotel',
      title: '🏨 Hotel & Reception',
      bg: 0x0f172a,
      fogDensity: 0.005,
      cameraPos: { x: 0, y: 8.2, z: 14 },
      cameraLookAt: { x: 0, y: 1.2, z: -0.5 },
      zones: {
        overview: { pos: { x: 0, y: 8.2, z: 14 }, lookAt: { x: 0, y: 1.4, z: -1 }, label: '🏨 Vista General' },
        zone1: { pos: { x: 0, y: 3.4, z: 3.2 }, lookAt: { x: 0, y: 1.2, z: -3.5 }, label: '🛎️ Zona 1: Recepción' },
        zone2: { pos: { x: 3.8, y: 3.6, z: 6.8 }, lookAt: { x: 3.6, y: 1.2, z: -0.5 }, label: '🧳 Zona 2: Equipaje y Elevador' },
        zone3: { pos: { x: -3.8, y: 3.6, z: 5.5 }, lookAt: { x: -4, y: 1.1, z: -1 }, label: '🛋️ Lobby y Check-in' }
      },
      objects: [
        {"id":"hotel_receptionist_desk","en":"Receptionist Desk","ipa":"/rɪˈsep.ʃən.ɪst desk/","es":"Mostrador de Recepción","category":"Hotel & Reception","type":"object","example":"Welcome! Please check in at the main receptionist desk.","pos":[0,0,-3.5]},
        {"id":"hotel_room_keycard","en":"Magnetic Room Keycard","ipa":"/ruːm ˈkiː.kɑːrd/","es":"Tarjeta Llave de Habitación","category":"Hotel & Reception","type":"object","example":"Here is your magnetic room keycard for suite 402 on the fourth floor.","pos":[-0.8,1.12,-3.1]},
        {"id":"hotel_luggage_cart","en":"Brass Luggage Cart","ipa":"/ˈlʌɡ.ɪdʒ kɑːrt/","es":"Carrito de Equipaje Dorado","category":"Hotel & Reception","type":"object","example":"The bellhop placed our bags on the brass luggage cart.","pos":[3.8,0,1.2]},
        {"id":"hotel_suitcase","en":"Rolling Suitcase","ipa":"/ˈsuːt.keɪs/","es":"Maletas de Viaje con Ruedas","category":"Hotel & Reception","type":"object","example":"My rolling suitcase fits easily in the overhead compartment.","pos":[2.5,0,2.4]},
        {"id":"hotel_elevator","en":"Glass Elevator","ipa":"/ˈel.ə.veɪ.t̬ɚ/","es":"Elevador Panorámico","category":"Hotel & Reception","type":"object","example":"Press the up button to call the glass hotel elevator.","pos":[5.2,0,-3.8]},
        {"id":"hotel_bellhop_bell","en":"Golden Bellhop Bell","ipa":"/ˈbel.hɑːp bel/","es":"Campana Dorada de Servicio","category":"Hotel & Reception","type":"object","example":"Ring the golden bellhop bell on the counter for service.","pos":[0.65,1.12,-3.1]},
        {"id":"hotel_lobby_sofa","en":"Plush Lobby Sofa","ipa":"/ˈlɑː.bi ˈsoʊ.fə/","es":"Sofá Acolchado del Lobby","category":"Hotel & Reception","type":"object","example":"Please have a seat on the plush lobby sofa while we prepare your room.","pos":[-4.2,0,1]},
        {"id":"hotel_chandelier","en":"Crystal Chandelier","ipa":"/ˌʃæn.dəˈlɪr/","es":"Candelabro Imperial de Cristal","category":"Hotel & Reception","type":"object","example":"A grand crystal chandelier illuminates the entire hotel lobby.","pos":[0,4.4,-0.5]},
        {"id":"hotel_checkin_terminal","en":"Express Check-in Terminal","ipa":"/ˈtʃek.ɪn ˈtɝː.mə.nəl/","es":"Terminal Digital de Check-in","category":"Hotel & Reception","type":"object","example":"Use the touch-screen check-in terminal for fast express registration.","pos":[-3.8,0,-3.2]},
        {"id":"hotel_concierge","en":"Concierge Desk","ipa":"/ˌkɑːn.siˈerʒ/","es":"Módulo de Conserjería Turística","category":"Hotel & Reception","type":"object","example":"Our hotel concierge can book city tours, taxis, and theater tickets.","pos":[3.6,0,-2.2]},
        {"id":"hotel_safe_box","en":"In-Room Safe Box","ipa":"/seɪf bɑːks/","es":"Caja Fuerte Electrónica","category":"Hotel & Reception","type":"object","example":"Enter a four-digit PIN code to lock the electronic safe box.","pos":[-5.2,0,-1.5]},
        {"id":"hotel_passport","en":"Passport & Credentials","ipa":"/ˈpæs.pɔːrt/","es":"Pasaporte Internacional","category":"Hotel & Reception","type":"object","example":"May I see your passport and booking confirmation, please?","pos":[0.05,1.12,-3.05]},
        {"id":"hotel_minibar","en":"Stocked Minibar Fridge","ipa":"/ˈmɪn.i.bɑːr frɪdʒ/","es":"Minibar de Habitación","category":"Hotel Amenities","type":"object","example":"Chilled sparkling water and artisan chocolates are stocked in the minibar.","pos":[-5,0,-3.8]},
        {"id":"hotel_king_bed","en":"King-size Luxury Bed","ipa":"/kɪŋ saɪz bed/","es":"Cama King Size de Lujo","category":"Hotel Room","type":"object","example":"The executive suite features a king-size luxury bed with Egyptian cotton sheets.","pos":[-4.8,0,3.5]},
        {"id":"hotel_room_service_tray","en":"Silver Room Service Tray","ipa":"/ruːm ˈsɝː.vɪs treɪ/","es":"Bandeja de Servicio a la Habitación","category":"Hotel Amenities","type":"object","example":"Fresh orange juice and croissants arrived on a polished silver room service tray.","pos":[-1.2,1.1,-3.1]},
        {"id":"hotel_do_not_disturb","en":"Do Not Disturb Door Sign","ipa":"/duː nɑːt dɪˈstɝːb/","es":"Letrero de No Molestar","category":"Hotel Amenities","type":"object","example":"Hang the Do Not Disturb door sign outside when taking an afternoon nap.","pos":[-3.2,1.2,-3.8]},
        {"id":"hotel_bathrobe","en":"Plush Cotton Bathrobe","ipa":"/plʌʃ ˈbæθ.roʊb/","es":"Bata de Baño Afelpada","category":"Hotel Amenities","type":"object","example":"Slip into the plush cotton bathrobe after relaxing in the heated jacuzzi.","pos":[-4,1.1,3.2]},
        {"id":"hotel_towel_rack","en":"Heated Towel Rack","ipa":"/ˈhiː.t̬ɪd ˈtaʊ.əl ræk/","es":"Toallero Eléctrico Climatizado","category":"Hotel Amenities","type":"object","example":"Fluffy white towels were warm and dry thanks to the heated towel rack.","pos":[-5.8,1.2,3]},
        {"id":"hotel_thermostat","en":"Digital Room Thermostat","ipa":"/ˈdɪdʒ.ə.t̬əl ˈθɝː.mə.stæt/","es":"Termostato Digital de Habitación","category":"Hotel Amenities","type":"object","example":"Adjust the room temperature to sixty-eight degrees using the thermostat.","pos":[1.8,1.4,-3.8]},
        {"id":"hotel_emergency_exit","en":"Illuminated Emergency Exit","ipa":"/ɪˈmɝː.dʒən.si ˈek.sɪt/","es":"Salida de Emergencia Iluminada","category":"Hotel Safety","type":"object","example":"Locate the green illuminated emergency exit stairwell nearest your room.","pos":[6.4,0,-2.5]},
        {"id":"hotel_valet_podium","en":"Valet Parking Podium","ipa":"/vælˈeɪ ˈpɑːr.kɪŋ ˈpoʊ.di.əm/","es":"Podio de Valet Parking","category":"Hotel Services","type":"object","example":"Hand your car keys to the attendant at the valet parking podium.","pos":[4.5,0,3.8]},
        {"id":"hotel_pillow_menu","en":"Memory Foam Pillow Menu","ipa":"/ˈpɪl.oʊ ˈmen.juː/","es":"Menú de Almohadas Personalizadas","category":"Hotel Amenities","type":"object","example":"Select feather down or ergonomic memory foam from the luxury pillow menu.","pos":[-4.2,0.8,3.8]},
        {"id":"hotel_slippers","en":"Velvet Hotel Slippers","ipa":"/hoʊˈtel ˈslɪp.ɚz/","es":"Pantuflas Suaves de Hotel","category":"Hotel Amenities","type":"object","example":"Complimentary velvet hotel slippers are provided beside the wardrobe.","pos":[-4.2,0.1,2.8]},
        {"id":"hotel_key_drop","en":"Express Key Drop Box","ipa":"/kiː drɑːp bɑːks/","es":"Buzón de Devolución de Llaves Express","category":"Hotel Services","type":"object","example":"Drop your card into the express key drop box for frictionless checkout.","pos":[-1.4,0.9,-3.2]},
        {"id":"hotel_coffee_station","en":"Nespresso Coffee Station","ipa":"/ˈkɑː.fi ˈsteɪ.ʃən/","es":"Estación de Café en Habitación","category":"Hotel Amenities","type":"object","example":"Brew complimentary morning espresso at the in-room coffee station.","pos":[-5.2,0.9,-2.5]},
        {"id":"hotel_ironing_board","en":"Steam Iron & Board","ipa":"/ˈaɪrn ænd bɔːrd/","es":"Plancha de Vapor y Tabla","category":"Hotel Amenities","type":"object","example":"Press business shirts neatly with the steam iron and collapsible board.","pos":[-5.5,0,0.5]},
        {"id":"hotel_suit_hangers","en":"Polished Wooden Hangers","ipa":"/ˈwʊd.ən ˈhæŋ.ɚz/","es":"Ganchos de Madera para Trajes","category":"Hotel Amenities","type":"object","example":"Hang dresses and tailored jackets on the polished wooden hangers.","pos":[-4.8,1.4,-1.2]},
        {"id":"hotel_swimming_pool","en":"Infinity Swimming Pool","ipa":"/ɪnˈfɪn.ə.t̬i ˈswɪm.ɪŋ puːl/","es":"Piscina Infinita Climatizada","category":"Hotel Amenities","type":"object","example":"Enjoy panoramic city views from the rooftop heated infinity swimming pool.","pos":[5.8,0,4.5]},
        {"id":"hotel_fitness_treadmill","en":"Gym Treadmill Station","ipa":"/ˈtred.mɪl ˈsteɪ.ʃən/","es":"Caminadora del Gimnasio","category":"Hotel Amenities","type":"object","example":"The twenty-four hour fitness center is equipped with high-tech treadmills.","pos":[6.2,0,1.5]},
        {"id":"hotel_shuttle_van","en":"Airport Shuttle Bus","ipa":"/ˈer.pɔːrt ˈʃʌt̬.əl bʌs/","es":"Transporte al Aeropuerto","category":"Hotel Services","type":"object","example":"Reserve a seat on the complimentary hotel airport shuttle bus.","pos":[5.8,0,6.2]},
        {"id":"hotel_revolving_door","en":"Brass Revolving Door","ipa":"/rɪˈvɑːl.vɪŋ dɔːr/","es":"Puerta Giratoria de Cristal y Latón","category":"Hotel & Reception","type":"object","example":"Guests enter the grand lobby through the polished brass revolving door.","pos":[0,0,6.8]},
        {"id":"hotel_smoke_detector","en":"Ceiling Smoke Detector","ipa":"/smoʊk dɪˈtek.tɚ/","es":"Detector de Humo en Techo","category":"Hotel Safety","type":"object","example":"High-sensitivity optical smoke detectors ensure guest safety across all suites.","pos":[0,4.2,-2.5]},
        {"id":"hotel_check_in_concept","en":"Check in at the front desk","ipa":"/tʃek ɪn æt ðə frʌnt desk/","es":"Registrarse en Recepción","category":"Hospitality Concept","type":"phrase","example":"Check-in time begins at three PM; our room keys are already prepared.","pos":[-0.5,1.8,-2.2]},
        {"id":"hotel_check_out_concept","en":"Check out before noon","ipa":"/tʃek aʊt bɪˈfɔːr nuːn/","es":"Entregar la Habitación al Mediodía","category":"Hospitality Concept","type":"phrase","example":"Standard hotel policy asks guests to check out before twelve noon.","pos":[0.8,1.8,-2.2]},
        {"id":"hotel_booking_number","en":"Booking confirmation code","ipa":"/ˈbʊk.ɪŋ ˌkɑːn.fɚˈmeɪ.ʃən/","es":"Código de Confirmación de Reserva","category":"Hospitality Concept","type":"concept","example":"Please present your seven-digit booking confirmation code upon arrival.","pos":[-1.8,1.8,-3.2]},
        {"id":"hotel_single_double_concept","en":"Single vs. Double occupancy","ipa":"/ˈsɪŋ.ɡəl / ˈdʌb.əl ˌɑː.kjə.pən.si/","es":"Habitación Sencilla o Doble","category":"Hospitality Concept","type":"concept","example":"We booked a double occupancy room with two queen beds for our trip.","pos":[-3.2,1.8,1.8]},
        {"id":"hotel_executive_suite","en":"Penthouse Executive Suite","ipa":"/ɪɡˈzek.jə.t̬ɪv swiːt/","es":"Suite Ejecutiva de Lujo","category":"Hospitality Concept","type":"concept","example":"The penthouse executive suite includes a private balcony and concierge service.","pos":[-4.2,1.8,-2]},
        {"id":"hotel_complimentary_breakfast","en":"Complimentary buffet breakfast","ipa":"/ˌkɑːm.pləˈmen.t̬ɚ.i ˈbrek.fəst/","es":"Desayuno Buffet de Cortesía","category":"Hospitality Concept","type":"concept","example":"A complimentary buffet breakfast is served daily from seven until ten AM.","pos":[2,1.8,-1.5]},
        {"id":"hotel_wake_up_call","en":"Schedule a morning wake-up call","ipa":"/ˈweɪk.ʌp kɑːl/","es":"Pedir Llamada de Despertador","category":"Hospitality Concept","type":"phrase","example":"I asked the front desk operator for a sharp six-thirty AM wake-up call.","pos":[-2.2,1.8,-1.8]},
        {"id":"hotel_late_checkout_concept","en":"Request late check-out","ipa":"/rɪˈkwest leɪt tʃek aʊt/","es":"Solicitar Salida Tardía","category":"Hospitality Concept","type":"phrase","example":"As a loyalty club member, you can request late check-out until two PM.","pos":[0.2,1.8,-1.8]},
        {"id":"hotel_vacancy_concept","en":"Rooms available / Vacancy","ipa":"/ˈveɪ.kən.si/","es":"Habitaciones Libres / Disponibles","category":"Hospitality Concept","type":"concept","example":"The neon vacancy sign confirmed the boutique hotel had empty suites.","pos":[1.2,2,4.2]},
        {"id":"hotel_fully_booked","en":"No vacancy / Fully booked","ipa":"/noʊ ˈveɪ.kən.si / ˈfʊl.i bʊkt/","es":"Totalmente Agotado / Lleno","category":"Hospitality Concept","type":"concept","example":"During holiday festival weekends, downtown hotels are often fully booked.","pos":[2.4,2,4.2]},
        {"id":"hotel_amenities_concept","en":"World-class hotel amenities","ipa":"/ˈwɝːld klæs əˈmen.ə.t̬iz/","es":"Amenidades de Clase Mundial","category":"Hospitality Concept","type":"concept","example":"Spa access, rooftop pools, and valet service are part of the luxury amenities.","pos":[3.8,1.8,-1.2]},
        {"id":"hotel_housekeeping_concept","en":"Daily housekeeping service","ipa":"/ˈhaʊsˌkiː.pɪŋ ˈsɝː.vɪs/","es":"Servicio Diario de Limpieza","category":"Hospitality Concept","type":"concept","example":"Housekeeping replaced the towels and restocked fresh mineral water.","pos":[-3.5,1.8,2.5]},
        {"id":"hotel_porter_bellhop","en":"Attentive bellhop assistance","ipa":"/ˈbel.hɑːp əˈsɪs.təns/","es":"Asistencia Atenta del Botones","category":"Hospitality Concept","type":"concept","example":"The courteous bellhop transported our heavy luggage directly to room 305.","pos":[2.8,1.8,1.2]},
        {"id":"hotel_front_desk_247","en":"24/7 Front desk support","ipa":"/frʌnt desk səˈpɔːrt/","es":"Recepción 24 Horas al Día","category":"Hospitality Concept","type":"concept","example":"Whatever you need, our professional front desk is open twenty-four seven.","pos":[0,2,-2.8]},
        {"id":"hotel_security_deposit_concept","en":"Refundable security deposit","ipa":"/rɪˈfʌn.də.bəl səˈkjʊr.ə.t̬i dɪˈpɑː.zɪt/","es":"Depósito de Garantía Reembolsable","category":"Hospitality Concept","type":"concept","example":"The hotel places a temporary pre-authorization hold for incidentals.","pos":[-1.2,1.8,-2.5]},
        {"id":"hotel_photo_id","en":"Government-issued photo ID","ipa":"/ˈfoʊ.t̬oʊ aɪˈdiː/","es":"Identificación Oficial con Foto","category":"Hospitality Concept","type":"concept","example":"Guests must present a government-issued photo ID or passport to register.","pos":[-0.2,1.8,-2.5]},
        {"id":"hotel_luggage_storage_concept","en":"Secure luggage storage room","ipa":"/ˈlʌɡ.ɪdʒ ˈstɔːr.ɪdʒ ruːm/","es":"Custodia Segura de Equipaje","category":"Hospitality Concept","type":"concept","example":"Leave your backpacks in the secure luggage storage room while exploring the city.","pos":[3.2,1.8,0.5]},
        {"id":"hotel_warm_hospitality","en":"Exceptional warm hospitality","ipa":"/ɪkˈsep.ʃən.əl ˌhɑː.spɪˈtæl.ə.t̬i/","es":"Hospitalidad Cálida y Excepcional","category":"Hospitality Concept","type":"concept","example":"The staff treated every traveler with warmth, respect, and attentive hospitality.","pos":[-2.5,1.8,0.5]},
        {"id":"hotel_all_inclusive_concept","en":"All-inclusive resort package","ipa":"/ˌɑːl ɪnˈkluː.sɪv rɪˈzɔːrt/","es":"Plan Vacacional Todo Incluido","category":"Hospitality Concept","type":"concept","example":"Meals, drinks, and watersports are bundled in our all-inclusive package.","pos":[4.5,1.8,2.5]},
        {"id":"hotel_ocean_view_concept","en":"Private ocean view balcony","ipa":"/ˈoʊ.ʃən vjuː ˈbæl.kə.ni/","es":"Balcón Privado con Vista al Mar","category":"Hospitality Concept","type":"concept","example":"Sip morning coffee on your private ocean view balcony as the sun rises.","pos":[1.8,2.2,5.5]}
      ]
    },
    restaurant: {
      id: 'restaurant',
      title: '🍽️ Fine Restaurant',
      bg: 0x140c14,
      fogDensity: 0.005,
      cameraPos: { x: 0, y: 8, z: 13.5 },
      cameraLookAt: { x: 0, y: 1.1, z: 0.5 },
      zones: {
        overview: { pos: { x: 0, y: 8, z: 13.5 }, lookAt: { x: 0, y: 1.2, z: -0.8 }, label: '🍽️ Vista General' },
        zone1: { pos: { x: 0, y: 3.2, z: 4.5 }, lookAt: { x: 0, y: 1, z: 0.8 }, label: '🥂 Zona 1: Comedor Gourmet' },
        zone2: { pos: { x: 0, y: 3.8, z: 1.5 }, lookAt: { x: -1.2, y: 1.2, z: -4.2 }, label: '👨‍🍳 Zona 2: Estación del Chef' },
        zone3: { pos: { x: 3.5, y: 3.4, z: 5.8 }, lookAt: { x: 3.2, y: 1, z: 0.5 }, label: '🍰 Postres y Barra' }
      },
      objects: [
        {"id":"rest_dining_table","en":"Dining Table","ipa":"/ˈdaɪ.nɪŋ ˈteɪ.bəl/","es":"Mesa Vestida de Comedor","category":"Fine Restaurant","type":"object","example":"Our dining table is ready near the warm ambient lamps.","pos":[0,0,0.8]},
        {"id":"rest_chef_station","en":"Chef Station","ipa":"/ʃef ˈsteɪ.ʃən/","es":"Estación del Chef","category":"Fine Restaurant","type":"object","example":"The executive chef garnishes every plate at the chef station.","pos":[0,0,-4.5]},
        {"id":"rest_menu","en":"Menu","ipa":"/ˈmen.juː/","es":"Menú Gourmet","category":"Fine Restaurant","type":"object","example":"Our sommelier and chef prepared a seasonal tasting menu tonight.","pos":[-0.55,0.98,1.15]},
        {"id":"rest_main_course","en":"Main Course","ipa":"/meɪn kɔːrs/","es":"Plato Fuerte / Principal","category":"Fine Restaurant","type":"object","example":"For the main course, I would like the grilled steak with herbs.","pos":[-0.4,0.98,0.65]},
        {"id":"rest_appetizer","en":"Appetizer","ipa":"/ˈæp.ə.taɪ.zɚ/","es":"Entrada / Aperitivo Gourmet","category":"Fine Restaurant","type":"object","example":"Would you care to start with a warm appetizer before dinner?","pos":[0.42,0.98,0.65]},
        {"id":"rest_cutlery","en":"Cutlery","ipa":"/ˈkʌt.lɚ.i/","es":"Cubiertos de Plata","category":"Fine Restaurant","type":"object","example":"The polished silver cutlery is placed neatly beside each plate.","pos":[-0.75,0.96,0.85]},
        {"id":"rest_bill_folder","en":"Bill Folder","ipa":"/bɪl ˈfoʊl.dɚ/","es":"Carpeta de Cuenta","category":"Fine Restaurant","type":"object","example":"Place your credit card inside the leather bill folder when ready.","pos":[-0.2,0.96,1.25]},
        {"id":"rest_kitchen_pass","en":"Kitchen Pass","ipa":"/ˈkɪtʃ.ən pæs/","es":"Barra de Cocina","category":"Fine Restaurant","type":"object","example":"Waiters pick up hot dishes directly from the illuminated kitchen pass.","pos":[-3.8,0,-3.8]},
        {"id":"rest_napkin","en":"Napkin","ipa":"/ˈnæp.kɪn/","es":"Servilleta de Tela Doblada","category":"Fine Restaurant","type":"object","example":"Could you bring us an extra cloth napkin, please?","pos":[0.75,0.98,0.85]},
        {"id":"rest_beverage","en":"Beverage","ipa":"/ˈbev.rɪdʒ/","es":"Bebida / Copa Refrescante","category":"Fine Restaurant","type":"object","example":"What kind of cold beverage would you like with your meal?","pos":[0.28,1.02,1.18]},
        {"id":"rest_reserved_sign","en":"Reserved Sign","ipa":"/rɪˈzɝːvd saɪn/","es":"Letrero de Mesa Reservada","category":"Fine Restaurant","type":"object","example":"This VIP table has a golden reserved sign on top.","pos":[-3.6,0.96,1.2]},
        {"id":"rest_dessert_cart","en":"Dessert Cart","ipa":"/dɪˈzɝːt kɑːrt/","es":"Carrito de Postres","category":"Fine Restaurant","type":"object","example":"Choose your favorite cake from our rolling dessert cart.","pos":[3.6,0,1.4]},
        {"id":"rest_padded_booth","en":"Padded Leather Booth","ipa":"/ˈpæd.ɪd ˈleð.ɚ buːð/","es":"Cabina Privada de Cuero Acolchado","category":"Fine Restaurant","type":"object","example":"Our party enjoyed dinner inside the cozy padded leather booth.","pos":[-4.2,0,1]},
        {"id":"rest_high_chair","en":"Toddler High Chair","ipa":"/ˈtɑːd.lɚ ˈhɑɪ ˌtʃer/","es":"Silla Alta para Niños Pequeños","category":"Restaurant Furniture","type":"object","example":"The server provided a clean wooden high chair for the toddler.","pos":[-2.2,0,1.8]},
        {"id":"rest_executive_chef","en":"Executive Head Chef","ipa":"/ɪɡˈzek.jə.t̬ɪv hed ʃef/","es":"Chef Ejecutivo del Restaurante","category":"Kitchen Team","type":"object","example":"The executive head chef personally inspected every culinary dish.","pos":[0,0,-3.8]},
        {"id":"rest_gas_stove","en":"Commercial Gas Stove","ipa":"/kəˈmɝː.ʃəl ɡæs stoʊv/","es":"Estufa Industrial a Gas","category":"Kitchen Equipment","type":"object","example":"Blue gas flames roared beneath heavy copper pans on the commercial stove.","pos":[-1.8,0,-4.8]},
        {"id":"rest_frying_pan","en":"Copper Sauté Frying Pan","ipa":"/ˈkɑː.pɚ soʊˈteɪ ˈfraɪ.ɪŋ pæn/","es":"Sartén de Cobre para Saltear","category":"Kitchen Equipment","type":"object","example":"The sous-chef seared sea scallops in a glowing copper sauté pan.","pos":[-1.8,0.95,-4.8]},
        {"id":"rest_cutting_board","en":"Hardwood Cutting Board","ipa":"/ˈhɑːrd.wʊd ˈkʌt.ɪŋ bɔːrd/","es":"Tabla de Picar de Madera Noble","category":"Kitchen Equipment","type":"object","example":"Chopped rosemary and thyme rested on the thick hardwood cutting board.","pos":[1.8,0.95,-4.8]},
        {"id":"rest_wine_list_leather","en":"Sommelier Wine List","ipa":"/ˌsɑːm.əlˈjeɪ waɪn lɪst/","es":"Carta de Vinos Encuadernada en Cuero","category":"Fine Restaurant","type":"object","example":"Browse the vintage Bordeaux selections in the leather sommelier wine list.","pos":[-0.65,0.98,0.95]},
        {"id":"rest_water_pitcher","en":"Chilled Water Pitcher","ipa":"/tʃɪld ˈwɑː.t̬ɚ ˈpɪtʃ.ɚ/","es":"Jarra de Agua Fría","category":"Fine Restaurant","type":"object","example":"The busser refilled our glasses from the chilled glass water pitcher.","pos":[0.65,0.98,1.1]},
        {"id":"rest_salt_pepper","en":"Ceramic Salt & Pepper Shakers","ipa":"/sɑːlt ænd ˈpep.ɚ ˈʃeɪ.kɚz/","es":"Salero y Pimentero de Cerámica","category":"Fine Restaurant","type":"object","example":"Pass the sea salt and freshly cracked black pepper shakers, please.","pos":[0,0.98,0.95]},
        {"id":"rest_toothpick_holder","en":"Bamboo Toothpick Dispenser","ipa":"/ˈtuːθ.pɪk dɪˈspen.sɚ/","es":"Dispensador de Palillos de Bambú","category":"Fine Restaurant","type":"object","example":"Take a sealed bamboo toothpick from the wooden table dispenser.","pos":[-0.15,0.98,0.75]},
        {"id":"rest_pos_terminal","en":"Handheld POS Terminal","ipa":"/ˈhænd.held ˌpiː.oʊˈes ˈtɝː.mə.nəl/","es":"Terminal Portátil de Cobro con Tarjeta","category":"Fine Restaurant","type":"object","example":"The server brought the handheld wireless POS terminal right to our table.","pos":[0.15,0.98,0.75]},
        {"id":"rest_service_tray","en":"Heavy Oval Service Tray","ipa":"/ˈoʊ.vəl ˈsɝː.vɪs treɪ/","es":"Bandeja Ovalada de Mesero","category":"Fine Restaurant","type":"object","example":"The waiter balanced four hot dinner entrées on the large oval service tray.","pos":[-2.8,0.95,-3.8]},
        {"id":"rest_chef_uniform","en":"White Chef Jacket & Apron","ipa":"/waɪt ʃef ˈdʒæk.ɪt ænd ˈeɪ.prən/","es":"Filipina y Mandil Blanco de Chef","category":"Kitchen Team","type":"object","example":"Every line cook wears a spotless double-breasted white chef jacket.","pos":[0.8,0.95,-4]},
        {"id":"rest_steak_knife","en":"Serrated Steak Knife","ipa":"/səˈreɪ.t̬ɪd steɪk naɪf/","es":"Cuchillo Sierra para Carnes","category":"Fine Restaurant","type":"object","example":"Cut through the prime ribeye steak with the razor-sharp serrated knife.","pos":[-0.6,0.98,0.75]},
        {"id":"rest_soup_tureen","en":"Porcelain Soup Tureen","ipa":"/ˈpɔːr.səl.ɪn suːp tʊˈriːn/","es":"Sopera de Porcelana","category":"Fine Restaurant","type":"object","example":"Creamy lobster bisque was ladled out of the lidded porcelain soup tureen.","pos":[2.2,0.95,-4.5]},
        {"id":"rest_bread_plate","en":"Butter & Sourdough Plate","ipa":"/ˈbʌt̬.ɚ ænd bred pleɪt/","es":"Platillo de Mantequilla y Pan","category":"Fine Restaurant","type":"object","example":"Spread cultured French butter over the warm sourdough slice.","pos":[-0.65,0.98,0.65]},
        {"id":"rest_sauce_boat","en":"Silver Gravy Sauce Boat","ipa":"/ˈsɪl.vɚ ˈɡreɪ.vi sɑːs boʊt/","es":"Salsera de Plata para Gravy","category":"Fine Restaurant","type":"object","example":"Pour rich peppercorn reduction from the silver sauce boat over your steak.","pos":[0.65,0.98,0.65]},
        {"id":"rest_espresso_demitasse","en":"Porcelain Espresso Demitasse","ipa":"/esˈpres.oʊ ˈdem.i.tæs/","es":"Taza Pequeña de Café Expreso","category":"Fine Restaurant","type":"object","example":"Finish your multi-course tasting meal with a double espresso demitasse.","pos":[0.45,0.98,1.25]},
        {"id":"rest_condiment_caddy","en":"Table Condiment Caddy","ipa":"/ˈkɑːn.də.mənt ˈkæd.i/","es":"Organizador de Condimentos de Mesa","category":"Fine Restaurant","type":"object","example":"Balsamic vinegar, Dijon mustard, and hot chili oil sit in the wire caddy.","pos":[-0.45,0.98,1.25]},
        {"id":"rest_coat_check_tag","en":"Brass Coat Check Tag","ipa":"/bræs koʊt tʃek tæɡ/","es":"Ficha de Bronce de Guardarropa","category":"Fine Restaurant","type":"object","example":"Hand your numbered brass coat check tag to the attendant after dining.","pos":[3.2,0.95,2.5]},
        {"id":"rest_book_a_table","en":"Book a table for four","ipa":"/bʊk ə ˈteɪ.bəl fɔːr fɔːr/","es":"Reservar Mesa para Cuatro","category":"Dining Phrase","type":"phrase","example":"I would like to book a table for four on Saturday evening at eight PM.","pos":[-1.2,1.8,1.8]},
        {"id":"rest_waitlist_concept","en":"Fifteen-minute waitlist","ipa":"/ˌfɪfˈtiːn ˈmɪn.ɪt ˈweɪt.lɪst/","es":"Lista de Espera de Quince Minutos","category":"Dining Concept","type":"concept","example":"There is currently a fifteen-minute waitlist for outdoor dining booths.","pos":[-2.5,1.8,2.2]},
        {"id":"rest_todays_specials","en":"Today's chef specials","ipa":"/təˈdeɪz ʃef ˈspeʃ.əlz/","es":"Especialidades Culinarias del Día","category":"Dining Phrase","type":"phrase","example":"Our server passionately walked us through today’s chef specials on the board.","pos":[-0.5,1.8,-3.2]},
        {"id":"rest_starters_concept","en":"Cold & warm appetizers","ipa":"/koʊld ænd wɔːrm ˈæp.ə.taɪ.zɚz/","es":"Entradas Frías y Calientes","category":"Dining Concept","type":"concept","example":"Let us order three different appetizers to share across the entire table.","pos":[0.8,1.8,1.8]},
        {"id":"rest_entree_concept","en":"Signature entrée course","ipa":"/ˈsɪɡ.nə.tʃɚ ˈɑːn.treɪ kɔːrs/","es":"Plato Fuerte Insignia","category":"Dining Concept","type":"concept","example":"The duck confit with caramelized shallots is the restaurant’s signature entrée.","pos":[-0.8,1.8,0.2]},
        {"id":"rest_side_dish_concept","en":"Complementary side dish","ipa":"/ˌkɑːm.pləˈmen.t̬ɚ.i saɪd dɪʃ/","es":"Guarnición o Acompañamiento","category":"Dining Concept","type":"concept","example":"Would you prefer garlic mashed potatoes or roasted asparagus as your side dish?","pos":[0.8,1.8,0.2]},
        {"id":"rest_dessert_concept","en":"Decadent dessert selection","ipa":"/ˈdek.ə.dənt dɪˈzɝːt/","es":"Selección Decadente de Postres","category":"Dining Concept","type":"concept","example":"Save room for our decadent dessert selection—the tiramisu is legendary.","pos":[3.2,1.8,0.8]},
        {"id":"rest_meat_temperatures","en":"Rare, medium-rare, or well-done?","ipa":"/rer /ˈmiː.di.əm rer/ ˌwel ˈdʌn/","es":"¿Término Medio o Bien Cocido?","category":"Dining Phrase","type":"phrase","example":"How would you like your steak prepared tonight: rare, medium-rare, or well-done?","pos":[-1.2,1.8,-0.2]},
        {"id":"rest_seasoning_concept","en":"Exquisite herbal seasoning","ipa":"/ɪkˈskwɪz.ɪt ˈhɝː.bəl ˈsiː.zən.ɪŋ/","es":"Sazón y Especias Aromáticas","category":"Dining Concept","type":"concept","example":"The chef balanced the herbal seasoning with coarse sea salt and cracked pepper.","pos":[0.5,1.8,-4.2]},
        {"id":"rest_savory_profile","en":"Rich savory flavor profile","ipa":"/rɪtʃ ˈseɪ.vɚ.i ˈfleɪ.vɚ/","es":"Perfil de Sabor Salado y Sabroso (Umami)","category":"Dining Concept","type":"concept","example":"Truffle butter infuses the risotto with a deep, rich savory flavor profile.","pos":[-1.5,1.8,-2.5]},
        {"id":"rest_sweet_notes","en":"Delicate sweet undertones","ipa":"/ˈdel.ə.kət swiːt ˈʌn.dɚˌtoʊnz/","es":"Notas Dulces Sutiles","category":"Dining Concept","type":"concept","example":"The port wine reduction adds delicate sweet undertones to the roasted duck.","pos":[1.5,1.8,-2.5]},
        {"id":"rest_spicy_kick","en":"Subtle spicy kick","ipa":"/ˈsʌt̬.əl ˈspaɪ.si kɪk/","es":"Toque Picante Agradable","category":"Dining Concept","type":"concept","example":"Fresh jalapeño aioli gives the crispy calamari a subtle spicy kick.","pos":[2.2,1.8,-0.5]},
        {"id":"rest_bland_food","en":"Lacks seasoning / Bland","ipa":"/læks ˈsiː.zən.ɪŋ / blænd/","es":"Falto de Sazón / Desabrido","category":"Dining Concept","type":"concept","example":"Without proper salt and fresh herbs, the broth tasted disappointingly bland.","pos":[-2.2,1.8,-0.5]},
        {"id":"rest_mouth_watering","en":"Mouth-watering presentation","ipa":"/ˈmɑʊθˌwɔ·t̬ər·ɪŋ/","es":"Presentación que Hace Agua la Boca","category":"Dining Phrase","type":"phrase","example":"The steaming rack of lamb arrived with a mouth-watering roasted aroma.","pos":[0,2,1.5]},
        {"id":"rest_food_allergy_alert","en":"Severe food allergy alert","ipa":"/səˈvɪr fuːd ˈæl.ɚ.dʒi əˈlɝːt/","es":"Aviso de Alergia Alimentaria Severa","category":"Dining Phrase","type":"phrase","example":"Please alert the kitchen that our guest has a severe shellfish food allergy.","pos":[-3,1.8,-1.8]},
        {"id":"rest_gluten_free_option","en":"Certified gluten-free options","ipa":"/ˈsɝː.t̬ə.faɪd ˈɡluː.tən friː/","es":"Opciones Libres de Gluten (Celíacos)","category":"Dining Concept","type":"concept","example":"Our bistro pasta dishes can be prepared with certified gluten-free penne.","pos":[-3,1.8,0]},
        {"id":"rest_vegetarian_choice","en":"Wholesome vegetarian choice","ipa":"/ˈhoʊl.səm ˌvedʒ.əˈter.i.ən tʃɔɪs/","es":"Opción Vegetariana y Saludable","category":"Dining Concept","type":"concept","example":"The wild mushroom tart is a popular, wholesome vegetarian choice.","pos":[3,1.8,0]},
        {"id":"rest_takeout_order","en":"Order takeout / To-go meals","ipa":"/ˈteɪk.aʊt / tuː ɡoʊ/","es":"Comida para Llevar","category":"Dining Phrase","type":"phrase","example":"You can order takeout online and pick up fresh sushi in twenty minutes.","pos":[2.5,1.8,2.8]},
        {"id":"rest_doggy_bag_leftovers","en":"Doggy bag for delicious leftovers","ipa":"/ˈdɑː.ɡi bæɡ fɔːr ˈleftˌoʊ.vɚz/","es":"Caja para Llevar las Sobras a Casa","category":"Dining Phrase","type":"phrase","example":"Could we please have a doggy bag to take home these delicious leftovers?","pos":[1.2,1.8,2.2]},
        {"id":"rest_tip_gratuity","en":"Add an eighteen percent tip","ipa":"/æd ən ˈeɪ.tiːn pɚˈsent tɪp/","es":"Agregar 18% de Propina","category":"Dining Phrase","type":"phrase","example":"For parties of six or more, an eighteen percent gratuity is included on the bill.","pos":[-1.8,1.8,2.8]},
        {"id":"rest_compliments_to_chef","en":"My compliments to the chef!","ipa":"/maɪ ˈkɑːm.plə.mənts tuː ðə ʃef/","es":"¡Mis Felicitaciones al Chef!","category":"Dining Phrase","type":"phrase","example":"That steak was cooked to perfection—please pass my compliments to the chef!","pos":[0,2,-2.5]}
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
    const px = itemSpec.pos ? itemSpec.pos[0] : 0;
    const rawPy = itemSpec.pos ? itemSpec.pos[1] : 0;
    const pz = itemSpec.pos ? itemSpec.pos[2] : 0;
    const id = itemSpec.id || '';
    const isConceptOrPhrase = itemSpec.type === 'concept' || itemSpec.type === 'phrase';

    // 1. Conceptos abstractos y frases interactivas usan el Pin Flotante AAA
    if (isConceptOrPhrase) {
      return buildHolographicConceptNode(itemSpec, scenarioKey);
    }

    const M = initSharedMaterials();
    const PhysicalMat = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
    const group = new THREE.Group();
    group.name = itemSpec.en || itemSpec.id;
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
    const matBrass = M.metalBrass || matGold;
    const matStone = M.stoneGray || matDark;

    // 2. Comprobar catálogo modular de alta definición (MasterENG3DBuilders)
    const builder = (typeof window !== 'undefined' && window.MasterENG3DBuilders && window.MasterENG3DBuilders[id]) ||
                    (global.MasterENG3DBuilders && global.MasterENG3DBuilders[id]);
    if (typeof builder === 'function') {
      try {
        const built = builder(itemSpec, scenarioKey, M);
        if (built) {
          group.add(built);
        }
      } catch (errBuilder) {
        console.warn('[World3D] Error in modular builder for', id, errBuilder);
      }
    }

    // 3. Constructores hiper-detallados locales (si no se cargó un módulo externo)
    if (group.children.length === 0) {
    if (id === 'desk' || enLower.includes('desk')) {
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.065, 0.85), M.woodOak);
      top.position.y = 0.74;
      [[-0.72, -0.34], [0.72, -0.34], [-0.72, 0.34], [0.72, 0.34]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.74, 12), M.woodWalnut);
        leg.position.set(lx, 0.37, lz);
        group.add(leg);
      });
      const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.48, 0.76), M.woodWalnut);
      cabinet.position.set(0.54, 0.48, 0);
      const pull = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.02), M.metalBrass);
      pull.position.set(0.54, 0.58, 0.39);
      const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.015, 0.24), M.metalDark);
      lapBase.position.set(-0.15, 0.78, 0.05);
      const lapScreen = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.012), M.metalDark);
      lapScreen.position.set(-0.15, 0.88, -0.06);
      lapScreen.rotation.x = -0.25;
      const glowDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.19), M.emissiveScreen);
      glowDisplay.position.set(-0.15, 0.88, -0.05);
      glowDisplay.rotation.x = -0.25;
      group.add(top, cabinet, pull, lapBase, lapScreen, glowDisplay);
    } else if (id === 'computer_monitor' || enLower.includes('computer monitor')) {
      const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.20, 0.025, 20), M.metalDark);
      standBase.position.y = 0.0125;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.38, 0.04), M.metalDark);
      arm.position.set(0, 0.20, -0.06);
      const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.54, 0.03), M.ironBlack);
      bezel.position.set(0, 0.44, 0);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.50), M.emissiveScreen);
      screen.position.set(0, 0.44, 0.018);
      group.add(standBase, arm, bezel, screen);
    } else if (id === 'office_chair' || enLower.includes('office chair')) {
      for (let w = 0; w < 5; w++) {
        const ang = (w / 5) * Math.PI * 2;
        const starArm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.28), M.metalChrome);
        starArm.position.set(Math.cos(ang) * 0.14, 0.07, Math.sin(ang) * 0.14);
        starArm.rotation.y = -ang;
        const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), M.ironBlack);
        wheel.position.set(Math.cos(ang) * 0.28, 0.035, Math.sin(ang) * 0.28);
        group.add(starArm, wheel);
      }
      const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.36, 12), M.metalChrome);
      piston.position.y = 0.25;
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.09, 0.52), M.leatherBlack || M.metalDark);
      seat.position.y = 0.46;
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.62, 0.06), M.leatherBlack || M.metalDark);
      back.position.set(0, 0.78, -0.22);
      back.rotation.x = 0.08;
      [-0.29, 0.29].forEach(ax => {
        const armPost = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8), M.metalDark);
        armPost.position.set(ax, 0.55, -0.02);
        const armRest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.26), M.ironBlack);
        armRest.position.set(ax, 0.66, -0.02);
        group.add(armPost, armRest);
      });
      group.add(piston, seat, back);
    } else if (id === 'bookshelf' || enLower.includes('bookshelf')) {
      const sidesMat = M.woodWalnut;
      const shelfWidth = 1.35, shelfHeight = 2.1, shelfDepth = 0.38;
      [-shelfWidth / 2, shelfWidth / 2].forEach(sx => {
        const sidePanel = new THREE.Mesh(new THREE.BoxGeometry(0.05, shelfHeight, shelfDepth), sidesMat);
        sidePanel.position.set(sx, shelfHeight / 2, 0);
        group.add(sidePanel);
      });
      const topPanel = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth, 0.05, shelfDepth), sidesMat);
      topPanel.position.set(0, shelfHeight - 0.025, 0);
      const backPanel = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth, shelfHeight, 0.02), M.woodDark);
      backPanel.position.set(0, shelfHeight / 2, -shelfDepth / 2 + 0.01);
      group.add(topPanel, backPanel);
      const bookColors = [0x991b1b, 0x1e3a8a, 0x166534, 0x854d0e, 0x581c87, 0x0f766e];
      [0.05, 0.55, 1.05, 1.55].forEach((sy, sIdx) => {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth - 0.05, 0.04, shelfDepth - 0.02), sidesMat);
        shelf.position.set(0, sy, 0);
        group.add(shelf);
        for (let b = 0; b < 6; b++) {
          const bMat = new PhysicalMat({ color: bookColors[(sIdx + b) % bookColors.length], roughness: 0.4 });
          const book = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.24 + (b % 3) * 0.04, 0.20), bMat);
          book.position.set(-0.45 + b * 0.075, sy + 0.14, 0.02);
          group.add(book);
        }
      });
    } else if (id === 'window' || enLower.includes('panoramic window')) {
      const frameMat = M.woodWalnut || matDark;
      const fTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.12), frameMat);
      fTop.position.set(0, 1.15, 0);
      const fBot = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.12), frameMat);
      fBot.position.set(0, -1.15, 0);
      const fLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.38, 0.12), frameMat);
      fLeft.position.set(-1.16, 0, 0);
      const fRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.38, 0.12), frameMat);
      fRight.position.set(1.16, 0, 0);
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.24, 2.22), M.glassClear);
      glass.position.set(0, 0, 0);
      const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.22, 0.06), frameMat);
      const mullionH = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.04, 0.06), frameMat);
      group.add(fTop, fBot, fLeft, fRight, glass, mullionV, mullionH);
    } else if (id === 'sofa' || enLower.includes('sofa') || enLower.includes('couch')) {
      const fabricMat = M.fabricWoven || M.fabricNavyTufted || new PhysicalMat({ color: 0x1e293b, roughness: 0.8 });
      const mainSeat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.38, 0.95), fabricMat);
      mainSeat.position.set(0, 0.28, 0);
      const lSeat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.38, 1.1), fabricMat);
      lSeat.position.set(-0.68, 0.28, 0.65);
      const mainBack = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.65, 0.25), fabricMat);
      mainBack.position.set(0, 0.68, -0.42);
      [-1.15, 1.15].forEach(ax => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.48, 1.05), fabricMat);
        arm.position.set(ax, 0.48, 0.05);
        group.add(arm);
      });
      [[-1.0, -0.4], [1.0, -0.4], [-1.0, 1.1], [1.0, 0.4]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.18, 12), M.woodWalnut);
        leg.position.set(lx, 0.09, lz);
        group.add(leg);
      });
      const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.14), M.fabricGold || matGold);
      pillow1.position.set(0.85, 0.58, -0.22);
      pillow1.rotation.y = -0.35;
      const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.14), matRosePink);
      pillow2.position.set(-0.85, 0.58, -0.22);
      pillow2.rotation.y = 0.35;
      group.add(mainSeat, lSeat, mainBack, pillow1, pillow2);
    } else if (id === 'armchair' || enLower.includes('armchair')) {
      const acMat = M.fabricTerracotta || new PhysicalMat({ color: 0xc2410c, roughness: 0.75 });
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.22, 0.82), acMat);
      seat.position.y = 0.38;
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.72, 0.22), acMat);
      back.position.set(0, 0.74, -0.32);
      [-0.42, 0.42].forEach(ax => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.78), acMat);
        arm.position.set(ax, 0.52, 0);
        group.add(arm);
      });
      [[-0.32, -0.32], [0.32, -0.32], [-0.32, 0.32], [0.32, 0.32]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.018, 0.28, 12), M.woodWalnut);
        leg.position.set(lx, 0.14, lz);
        group.add(leg);
      });
      group.add(seat, back);
    } else if (id === 'coffee_table' || enLower.includes('coffee table')) {
      const top = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.045, 32), M.woodOak);
      top.position.y = 0.42;
      for (let l = 0; l < 3; l++) {
        const ang = (l / 3) * Math.PI * 2;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.015, 0.42, 12), M.metalBrass);
        leg.position.set(Math.cos(ang) * 0.42, 0.21, Math.sin(ang) * 0.42);
        group.add(leg);
      }
      const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.09, 16), M.ceramicWhite);
      mug.position.set(0.08, 0.485, 0.06);
      const coffee = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.01, 14), matWalnut);
      coffee.position.set(0.08, 0.52, 0.06);
      group.add(top, mug, coffee);
    } else if (id === 'floor_lamp' || enLower.includes('floor lamp')) {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.05, 24), M.marbleVeined || matDark);
      base.position.y = 0.025;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.85, 14), M.metalBrass);
      pole.position.y = 0.95;
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.38, 24, 1, true), M.lampShadeWarm || matWhite);
      shade.position.y = 1.95;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), M.emissiveBulb);
      bulb.position.y = 1.88;
      group.add(base, pole, shade, bulb);
    } else if (id === 'wall_clock' || enLower.includes('wall clock')) {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.025, 12, 32), M.metalBrass);
      const dial = new THREE.Mesh(new THREE.CircleGeometry(0.28, 32), M.ceramicWhite);
      dial.position.z = -0.01;
      const centerPin = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.02, 12), M.metalDark);
      centerPin.rotation.x = Math.PI / 2;
      const hHand = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.11, 0.005), M.ironBlack);
      hHand.position.set(0.03, 0.04, 0.005);
      hHand.rotation.z = -0.55;
      const mHand = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.18, 0.005), M.ironBlack);
      mHand.position.set(0, 0.08, 0.005);
      group.add(rim, dial, centerPin, hHand, mHand);
    } else if (id === 'indoor_plant' || enLower.includes('indoor plant')) {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.42, 18), M.terracottaPot);
      pot.position.y = 0.21;
      const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 18), M.soilDark);
      soil.position.y = 0.41;
      group.add(pot, soil);
      for (let f = 0; f < 7; f++) {
        const ang = (f / 7) * Math.PI * 2;
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.45, 8), M.trunkBark);
        stem.position.set(Math.cos(ang) * 0.08, 0.55, Math.sin(ang) * 0.08);
        stem.rotation.z = Math.sin(ang) * 0.45;
        stem.rotation.x = Math.cos(ang) * 0.45;
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), M.leafGreen3);
        leaf.scale.set(1.1, 0.12, 0.65);
        leaf.position.set(Math.cos(ang) * 0.28, 0.75, Math.sin(ang) * 0.28);
        leaf.rotation.y = ang;
        group.add(stem, leaf);
      }
    } else if (id === 'dating_table_for_two' || enLower.includes('table for two') || id === 'rest_dining_table') {
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
      const core = new THREE.Mesh(new THREE.SphereGeometry(1.45, 16, 16), sunMat);
      const halo = new THREE.Mesh(new THREE.RingGeometry(1.6, 2.1, 32), new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.45 }));
      const sunLight = new THREE.PointLight(0xffedd5, 3.2, 45);
      group.add(core, halo, sunLight);
    } else if (id === 'space_earth' || id === 'space_axial_rotation') {
      const earthMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x0369a1, emissiveIntensity: 0.35, roughness: 0.4 });
      const globe = new THREE.Mesh(new THREE.SphereGeometry(0.72, 16, 16), earthMat);
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
      const planet = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), satMat);
      const torusRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.14, 16, 48), new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.45, metalness: 0.15 }));
      torusRing1.rotation.x = Math.PI / 2.35;
      torusRing1.scale.z = 0.18;
      const torusRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.76, 0.08, 16, 48), new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.5, transparent: true, opacity: 0.82 }));
      torusRing2.rotation.x = Math.PI / 2.35;
      torusRing2.scale.z = 0.18;
      group.add(planet, torusRing1, torusRing2);
    } else if (id === 'space_black_hole') {
      const eventHorizon = new THREE.Mesh(new THREE.SphereGeometry(0.68, 16, 16), new THREE.MeshBasicMaterial({ color: 0x000000 }));
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
    // --- MUNDOS SUPERMARKET, HOTEL Y RESTAURANT (ULTRA-DETALLADOS Y REALISTAS) ---
    else if (id === 'market_shopping_cart') {
      // Carrito de supermercado metálico de rejilla abierta con ruedas giratorias, asiento infantil rojo y víveres dentro
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.04, 0.54), matSilver);
      chassis.position.y = 0.22;
      group.add(chassis);
      // 4 Ruedas con horquilla cromada
      [[-0.36, -0.22], [0.36, -0.22], [-0.36, 0.22], [0.36, 0.22]].forEach(([wx, wz]) => {
        const fork = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.10, 0.04), matSilver);
        fork.position.set(wx, 0.15, wz);
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16), M.ironBlack);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wx, 0.08, wz);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.045, 12), matSilver);
        hub.rotation.x = Math.PI / 2;
        hub.position.set(wx, 0.08, wz);
        group.add(fork, wheel, hub);
      });
      // Piso de la canasta y barrotes abiertos de alambre cromado
      const basketFloor = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.025, 0.54), matSilver);
      basketFloor.position.y = 0.42;
      group.add(basketFloor);
      // Postes esquineros de la canasta
      [[-0.42, -0.26], [0.42, -0.26], [-0.42, 0.26], [0.42, 0.26]].forEach(([cx, cz]) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.52, 10), matSilver);
        post.position.set(cx, 0.68, cz);
        group.add(post);
      });
      // Aros horizontales de alambre (3 niveles) para que se vea el interior
      [0.54, 0.70, 0.88].forEach(ry => {
        const barFront = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.018, 0.018), matSilver);
        barFront.position.set(0, ry, 0.26);
        const barBack = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.018, 0.018), matSilver);
        barBack.position.set(0, ry, -0.26);
        const barLeft = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.018, 0.54), matSilver);
        barLeft.position.set(-0.42, ry, 0);
        const barRight = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.018, 0.54), matSilver);
        barRight.position.set(0.42, ry, 0);
        group.add(barFront, barBack, barLeft, barRight);
      });
      // Costillas verticales de alambre
      [-0.28, -0.14, 0, 0.14, 0.28].forEach(vx => {
        const ribF = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.46, 8), matSilver);
        ribF.position.set(vx, 0.65, 0.26);
        const ribB = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.46, 8), matSilver);
        ribB.position.set(vx, 0.65, -0.26);
        group.add(ribF, ribB);
      });
      // Asiento infantil abatible rojo y manubrio ergonómico rojo
      const childSeat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 0.46), matRed);
      childSeat.position.set(-0.34, 0.72, 0);
      childSeat.rotation.z = -0.22;
      const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.56, 14), matRed);
      handleBar.rotation.x = Math.PI / 2;
      handleBar.position.set(-0.52, 0.96, 0);
      const bracketL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.025), matSilver);
      bracketL.position.set(-0.46, 0.92, -0.25);
      const bracketR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.025), matSilver);
      bracketR.position.set(-0.46, 0.92, 0.25);
      // Víveres visibles dentro del carrito (caja de cereal, leche, baguette, manzanas)
      const cerealBox = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.09), matGold);
      cerealBox.position.set(0.12, 0.58, -0.10);
      const milkCarton = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.12), matSky);
      milkCarton.position.set(-0.08, 0.56, 0.10);
      const baguette = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.44, 12), M.woodLight);
      baguette.position.set(0.22, 0.66, 0.08);
      baguette.rotation.z = -0.35;
      const apple1 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), matRed);
      apple1.position.set(0.02, 0.49, -0.02);
      const apple2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), matEmerald);
      apple2.position.set(0.14, 0.49, 0.12);
      group.add(childSeat, handleBar, bracketL, bracketR, cerealBox, milkCarton, baguette, apple1, apple2);
    } else if (id === 'hotel_luggage_cart') {
      // Carrito de equipaje dorado estilo Bellhop Birdcage con alfombra borgoña y maletas de viaje
      const deck = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.09, 0.66), matVelvet);
      deck.position.y = 0.22;
      const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(1.09, 0.06, 0.70), matGold);
      goldTrim.position.y = 0.20;
      const arch1 = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.025, 12, 28, Math.PI), matGold);
      arch1.position.set(0, 1.15, -0.26);
      const arch2 = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.025, 12, 28, Math.PI), matGold);
      arch2.position.set(0, 1.15, 0.26);
      const topFinial = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 14), matGold);
      topFinial.position.set(0, 1.68, 0);
      [[-0.48, -0.26], [0.48, -0.26], [-0.48, 0.26], [0.48, 0.26]].forEach(([px, pz]) => {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.92, 12), matGold);
        pole.position.set(px, 0.70, pz);
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 14), M.ironBlack);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(px * 0.85, 0.09, pz);
        group.add(pole, wheel);
      });
      // Maletas detalladas sobre el carrito
      const case1 = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.52), matWalnut);
      case1.position.set(-0.18, 0.43, 0);
      const strap1 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.35, 0.05), matGold);
      strap1.position.set(-0.18, 0.43, 0);
      const case2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.48, 0.26), matRed);
      case2.position.set(0.24, 0.50, 0);
      group.add(deck, goldTrim, arch1, arch2, topFinial, case1, strap1, case2);
    } else if (id === 'rest_dessert_cart') {
      // Carrito gourmet de postres de 2 niveles con domo de cristal, pastel de fresas y tartaletas
      const tier1 = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.04, 0.58), matWalnut);
      tier1.position.y = 0.34;
      const tier2 = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.04, 0.58), matWhite);
      tier2.position.y = 0.78;
      const goldRail = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.02, 0.60), matGold);
      goldRail.position.y = 0.82;
      const pushHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.56, 12), matGold);
      pushHandle.rotation.x = Math.PI / 2;
      pushHandle.position.set(-0.52, 0.86, 0);
      [[-0.42, -0.25], [0.42, -0.25], [-0.42, 0.25], [0.42, 0.25]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.68, 10), matGold);
        leg.position.set(lx, 0.46, lz);
        const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 14), M.ironBlack);
        wh.rotation.x = Math.PI / 2;
        wh.position.set(lx, 0.08, lz);
        group.add(leg, wh);
      });
      // Pastel de 2 pisos y domo de cristal en el nivel superior
      const cakePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.16, 0.03, 20), matSilver);
      cakePlate.position.set(-0.18, 0.82, 0);
      const cakeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 20), matRosePink);
      cakeBase.position.set(-0.18, 0.89, 0);
      const cakeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.09, 18), matWhite);
      cakeTop.position.set(-0.18, 0.99, 0);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.19, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), M.glassClear);
      dome.position.set(-0.18, 0.83, 0);
      // Tartaletas de chocolate a la derecha
      [[-0.12], [0.12]].forEach(([tz], idx) => {
        const tart = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.06, 16), matWalnut);
        tart.position.set(0.22, 0.83, tz);
        const berry = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), idx === 0 ? matRed : matGold);
        berry.position.set(0.22, 0.87, tz);
        group.add(tart, berry);
      });
      group.add(tier1, tier2, goldRail, pushHandle, cakePlate, cakeBase, cakeTop, dome);
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
      const counter = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.02, 0.85), id === 'market_checkout' ? matSilver : matWalnut);
      counter.position.y = 0.51;
      const topMarble = new THREE.Mesh(new THREE.BoxGeometry(2.92, 0.08, 0.95), matWhite);
      topMarble.position.y = 1.06;
      const frontAccent = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.65, 0.04), id === 'market_checkout' ? matSky : matGold);
      frontAccent.position.set(0, 0.52, 0.43);
      group.add(counter, topMarble, frontAccent);
      if (id === 'market_checkout') {
        // Cinta transportadora negra con franjas amarillas, poste de caja #1 y víveres en banda
        const belt = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.03, 0.56), M.ironBlack);
        belt.position.set(-0.45, 1.11, 0);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.15, 12), matSilver);
        pole.position.set(-1.2, 1.65, -0.25);
        const laneBox = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), M.emissiveBulb);
        laneBox.position.set(-1.2, 2.25, -0.25);
        group.add(belt, pole, laneBox);
      } else if (id === 'rest_chef_station' || id === 'rest_kitchen_pass') {
        // Barra de pase de cocina con lámparas de calor infrarrojas y platos listos
        const shelfPass = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.05, 0.42), matSilver);
        shelfPass.position.set(0, 1.62, 0);
        const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 10), matSilver);
        postL.position.set(-1.2, 1.35, 0);
        const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 10), matSilver);
        postR.position.set(1.2, 1.35, 0);
        [-0.65, 0, 0.65].forEach(lx => {
          const heatLamp = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.14, 14), matGold);
          heatLamp.position.set(lx, 1.54, 0);
          const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.025, 18), matWhite);
          plate.position.set(lx, 1.12, 0.1);
          const domeFood = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), matRed);
          domeFood.position.set(lx, 1.13, 0.1);
          group.add(heatLamp, plate, domeFood);
        });
        group.add(shelfPass, postL, postR);
      }
    } else if (id === 'market_fresh_produce' || id === 'market_organic_produce' || id === 'market_ripe_produce' || id === 'market_produce_crate') {
      // Puesto de Frutas y Verduras Frescas con toldo verde/blanco, cajones de madera inclinados y frutas 3D visibles
      const baseStand = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.68, 0.88), matWood);
      baseStand.position.y = 0.34;
      // Toldo superior tipo mercado orgánico
      const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.45, 10), matWood);
      postL.position.set(-1.02, 1.35, -0.32);
      const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.45, 10), matWood);
      postR.position.set(1.02, 1.35, -0.32);
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.12, 0.96), matEmerald);
      canopy.position.set(0, 2.08, -0.05);
      canopy.rotation.x = 0.22;
      group.add(baseStand, postL, postR, canopy);
      // 4 Huacales de madera abiertos en el frente llenos de manzanas rojas, naranjas, lechugas y plátanos
      const crateColors = [matRed, matEmerald, matGold, new PhysicalMat({ color: 0xf97316, roughness: 0.3, clearcoat: 0.5 })];
      [-0.75, -0.25, 0.25, 0.75].forEach((cx, cIdx) => {
        const crate = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.16, 0.72), M.woodLight);
        crate.position.set(cx, 0.76, 0.04);
        crate.rotation.x = 0.25;
        group.add(crate);
        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {
            const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 12), crateColors[cIdx]);
            fruit.position.set(cx + c * 0.12, 0.86 - r * 0.04, 0.04 + r * 0.16);
            group.add(fruit);
          }
        }
      });
    } else if (id === 'market_bakery' || id === 'market_bread_rack' || id === 'market_freshly_baked') {
      // Mostrador y Vitrina de Panadería Artesanal con cristal transparente, baguettes, croissants y pasteles visibles
      const woodBase = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.72, 0.82), matWood);
      woodBase.position.y = 0.36;
      const marbleCounter = new THREE.Mesh(new THREE.BoxGeometry(2.16, 0.05, 0.86), matWhite);
      marbleCounter.position.y = 0.74;
      const glassCase = new THREE.Mesh(new THREE.BoxGeometry(2.04, 0.78, 0.74), M.glassClear);
      glassCase.position.set(0, 1.15, 0);
      const topFrame = new THREE.Mesh(new THREE.BoxGeometry(2.10, 0.06, 0.78), matGold);
      topFrame.position.set(0, 1.56, 0);
      group.add(woodBase, marbleCounter, glassCase, topFrame);
      // Repisas internas con baguettes doradas, hogazas y pasteles
      [0.86, 1.22].forEach((sy, sIdx) => {
        const tray = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.025, 0.62), matGold);
        tray.position.set(0, sy, 0);
        group.add(tray);
        for (let b = -3; b <= 3; b++) {
          if (sIdx === 0) {
            const loaf = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.42, 12), M.woodLight);
            loaf.rotation.x = Math.PI / 2;
            loaf.rotation.z = 0.15;
            loaf.position.set(b * 0.25, sy + 0.06, 0);
            group.add(loaf);
          } else {
            const pastry = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 12), b % 2 === 0 ? matRosePink : matGold);
            pastry.scale.set(1, 0.65, 1);
            pastry.position.set(b * 0.25, sy + 0.06, 0);
            group.add(pastry);
          }
        }
      });
    } else if (id === 'market_dairy_section' || id === 'market_frozen_aisle' || id === 'market_cooler_display' || id === 'market_dairy_fridge') {
      // Vitrina Refrigerada Abierta con marco blanco/azul, panel posterior delgado y botellas/cartones de leche visibles
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(2.15, 1.92, 0.08), matWhite);
      backWall.position.set(0, 0.96, -0.34);
      const baseCooler = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.32, 0.78), matSky);
      baseCooler.position.set(0, 0.16, 0);
      const topHeader = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.22, 0.80), matSky);
      topHeader.position.set(0, 1.84, 0);
      const ledBanner = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.14), M.emissiveScreen);
      ledBanner.position.set(0, 1.84, 0.41);
      const sideGlassL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.50, 0.74), M.glassClear);
      sideGlassL.position.set(-1.05, 1.0, 0);
      const sideGlassR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.50, 0.74), M.glassClear);
      sideGlassR.position.set(1.05, 1.0, 0);
      group.add(backWall, baseCooler, topHeader, ledBanner, sideGlassL, sideGlassR);
      // 3 Repisas abiertas con cartones de leche, quesos y yogures al frente
      [0.48, 0.94, 1.38].forEach((sy, rIdx) => {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.04, 0.035, 0.64), matWhite);
        shelf.position.set(0, sy, -0.02);
        group.add(shelf);
        for (let p = -3; p <= 3; p++) {
          const cartonMat = rIdx === 0 ? matWhite : (rIdx === 1 ? matSky : (p % 2 === 0 ? matGold : matRosePink));
          const carton = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.18), cartonMat);
          carton.position.set(p * 0.27, sy + 0.16, 0.08);
          const cap = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.08, 4), matSky);
          cap.position.set(p * 0.27, sy + 0.33, 0.08);
          cap.rotation.y = Math.PI / 4;
          group.add(carton, cap);
        }
      });
    } else if (id === 'market_price_tag' || id === 'market_on_sale' || id === 'market_bogo_deal' || id === 'market_shelf_tag' || id === 'market_price_check') {
      // Pedestal Promocional de Oferta con letrero amarillo/rojo "50% SALE" y etiqueta de precio
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.30, 0.06, 20), matSilver);
      base.position.y = 0.03;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.15, 12), matSilver);
      pole.position.y = 0.60;
      const signBoard = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.46, 0.05), matGold);
      signBoard.position.set(0, 1.25, 0);
      const redBadge = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.34, 0.06), matRed);
      redBadge.position.set(0, 1.25, 0);
      const starBurst = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.07, 12), M.emissiveBulb);
      starBurst.rotation.x = Math.PI / 2;
      starBurst.position.set(0, 1.25, 0);
      group.add(base, pole, signBoard, redBadge, starBurst);
    } else if (id === 'market_cash_register' || id === 'hotel_check_in') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.18, 0.48), matSilver);
      base.position.y = 0.09;
      const drawerSlot = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.02), M.ironBlack);
      drawerSlot.position.set(0, 0.08, 0.245);
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.26, 12), matSilver);
      stand.position.set(0, 0.28, -0.06);
      const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.32, 0.05), matDark);
      monitor.position.set(0, 0.46, -0.04);
      monitor.rotation.x = -0.22;
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.40, 0.26), M.emissiveScreen);
      screen.position.set(0, 0.46, -0.01);
      screen.rotation.x = -0.22;
      group.add(base, drawerSlot, stand, monitor, screen);
    } else if (id === 'market_barcode_scanner' || id === 'market_scanner_gun') {
      const cradle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.08, 16), matDark);
      cradle.position.y = 0.04;
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.035, 0.32, 12), matSilver);
      neck.position.set(0, 0.20, -0.04);
      neck.rotation.x = 0.32;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.24), matRed);
      head.position.set(0, 0.36, 0.06);
      const laserBeam = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.32, 12), new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.55 }));
      laserBeam.position.set(0, 0.18, 0.14);
      group.add(cradle, neck, head, laserBeam);
    } else if (id === 'market_scale') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.44), matSilver);
      base.position.y = 0.06;
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.18, 0.09, 20), matSilver);
      bowl.position.set(0, 0.18, 0.06);
      const appleA = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), matRed);
      appleA.position.set(-0.06, 0.24, 0.06);
      const appleB = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), matEmerald);
      appleB.position.set(0.07, 0.24, 0.06);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.52, 12), matSilver);
      pole.position.set(0, 0.36, -0.15);
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24), matWhite);
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0, 0.62, -0.14);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.02, 10, 24), matGold);
      rim.position.set(0, 0.62, -0.11);
      const needle = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.13, 0.015), matRed);
      needle.position.set(0.03, 0.64, -0.105);
      needle.rotation.z = -0.45;
      group.add(base, bowl, appleA, appleB, pole, dial, rim, needle);
    } else if (id === 'market_shopping_basket' || id === 'market_reusable_bag' || id === 'market_groceries_concept') {
      // Canasta de compras abierta con paredes acanaladas, doble asa y víveres visibles dentro
      const isBag = id === 'market_reusable_bag' || id === 'market_groceries_concept';
      const basketColor = isBag ? matEmerald : matRed;
      const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.04, 0.38), basketColor);
      bottom.position.y = 0.02;
      const wallF = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.32, 0.035), basketColor);
      wallF.position.set(0, 0.18, 0.18);
      wallF.rotation.x = 0.08;
      const wallB = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.32, 0.035), basketColor);
      wallB.position.set(0, 0.18, -0.18);
      wallB.rotation.x = -0.08;
      const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.32, 0.38), basketColor);
      wallL.position.set(-0.28, 0.18, 0);
      const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.32, 0.38), basketColor);
      wallR.position.set(0.28, 0.18, 0);
      const topRim = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.035, 0.42), M.ironBlack);
      topRim.position.set(0, 0.34, 0);
      const handle1 = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.02, 10, 20, Math.PI), isBag ? matWhite : M.ironBlack);
      handle1.position.set(0, 0.35, 0.06);
      const handle2 = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.02, 10, 20, Math.PI), isBag ? matWhite : M.ironBlack);
      handle2.position.set(0, 0.35, -0.06);
      // Víveres asomando por encima de la canasta
      const baguette = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.42, 12), M.woodLight);
      baguette.position.set(-0.12, 0.32, 0);
      baguette.rotation.z = 0.28;
      const juiceBottle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.32, 14), matGold);
      juiceBottle.position.set(0.10, 0.28, -0.04);
      const lettuce = new THREE.Mesh(new THREE.DodecahedronGeometry(0.095, 1), M.leafGreen3);
      lettuce.position.set(0.04, 0.28, 0.08);
      group.add(bottom, wallF, wallB, wallL, wallR, topRim, handle1, handle2, baguette, juiceBottle, lettuce);
    } else if (id === 'hotel_suitcase') {
      const bag1 = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.74, 0.28), matRed);
      bag1.position.set(-0.22, 0.42, 0);
      const rodL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.34, 10), matSilver);
      rodL.position.set(-0.30, 0.94, 0);
      const rodR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.34, 10), matSilver);
      rodR.position.set(-0.14, 0.94, 0);
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.03, 0.04), M.ironBlack);
      grip.position.set(-0.22, 1.11, 0);
      const bag2 = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.56, 0.24), matSky);
      bag2.position.set(0.28, 0.32, 0.08);
      [[-0.38, -0.10], [-0.06, -0.10], [-0.38, 0.10], [-0.06, 0.10]].forEach(([wx, wz]) => {
        const wh = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), M.ironBlack);
        wh.position.set(wx, 0.04, wz);
        group.add(wh);
      });
      group.add(bag1, rodL, rodR, grip, bag2);
    } else if (id === 'hotel_elevator' || id === 'hotel_revolving_door') {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.65, 0.24), matGold);
      frame.position.y = 1.325;
      const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.88, 2.42, 0.18), id === 'hotel_revolving_door' ? M.glassClear : matSilver);
      doorL.position.set(-0.46, 1.21, 0.04);
      const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.88, 2.42, 0.18), id === 'hotel_revolving_door' ? M.glassClear : matSilver);
      doorR.position.set(0.46, 1.21, 0.04);
      const floorIndicator = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.14), M.emissiveScreen);
      floorIndicator.position.set(0, 2.52, 0.14);
      group.add(frame, doorL, doorR, floorIndicator);
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
      const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 0.12), matGold);
      pillow1.position.set(-0.62, 0.62, -0.14);
      pillow1.rotation.z = 0.15;
      const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 0.12), matGold);
      pillow2.position.set(0.62, 0.62, -0.14);
      pillow2.rotation.z = -0.15;
      group.add(seat, back, armL, armR, pillow1, pillow2);
    } else if (id === 'hotel_keycard' || id === 'hotel_room_keycard') {
      const holder = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.05, 0.20), matGold);
      holder.position.y = 0.025;
      const card = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.30, 0.016), matSky);
      card.position.set(0, 0.16, 0);
      card.rotation.z = 0.12;
      const chip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.02), matGold);
      chip.position.set(-0.04, 0.18, 0.01);
      group.add(holder, card, chip);
    } else if (id === 'rest_cutlery') {
      [-0.08, 0, 0.08].forEach(cx => {
        const utensil = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.01, 0.26), matSilver);
        utensil.position.set(cx, 0.015, 0);
        group.add(utensil);
      });
    } else if (id === 'rest_napkin' || id === 'rest_reserved_sign' || id === 'dating_cloth_napkin' || id === 'dating_reserved_sign') {
      const isSign = id.includes('reserved_sign');
      const prism = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.22, 4), isSign ? matGold : matRed);
      prism.position.y = 0.11;
      prism.rotation.y = Math.PI / 4;
      group.add(prism);
      if (isSign) {
        const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.02), matDark);
        plaque.position.set(0, 0.10, 0.09);
        plaque.rotation.x = -0.35;
        group.add(plaque);
      }
    }
    // --- MODELOS 3D DETALLADOS ADICIONALES: HOUSE ---
    else if (id === 'house_coffee_maker' || id === 'hotel_coffee_station') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.04, 0.34), matDark);
      base.position.y = 0.02;
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.38, 0.16), matDark);
      tower.position.set(0, 0.21, -0.08);
      const topCap = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.06, 0.34), matSilver);
      topCap.position.set(0, 0.38, 0);
      const carafe = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.20, 16), M.glassClear);
      carafe.position.set(0, 0.14, 0.06);
      const coffeeLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.10, 0.12, 14), matWalnut);
      coffeeLiquid.position.set(0, 0.10, 0.06);
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 8, 16, Math.PI), matDark);
      handle.position.set(0.10, 0.15, 0.06);
      handle.rotation.z = -Math.PI / 2;
      group.add(base, tower, topCap, carafe, coffeeLiquid, handle);
    } else if (id === 'house_microwave') {
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.34, 0.38), matSilver);
      chassis.position.y = 0.17;
      const windowGlass = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.24, 0.02), M.ironBlack);
      windowGlass.position.set(-0.07, 0.17, 0.19);
      const keypad = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.24), M.emissiveScreen);
      keypad.position.set(0.20, 0.17, 0.195);
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22, 10), matSilver);
      handle.position.set(0.11, 0.17, 0.21);
      group.add(chassis, windowGlass, keypad, handle);
    } else if (id === 'house_toaster') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.22, 0.20), matSilver);
      body.position.y = 0.11;
      const slot1 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.035), M.ironBlack);
      slot1.position.set(0, 0.22, -0.035);
      const slot2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.035), M.ironBlack);
      slot2.position.set(0, 0.22, 0.035);
      const toast1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.024), matWood);
      toast1.position.set(0, 0.25, -0.035);
      const toast2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.024), matWood);
      toast2.position.set(0, 0.25, 0.035);
      const lever = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.04), matDark);
      lever.position.set(0.16, 0.14, 0);
      group.add(body, slot1, slot2, toast1, toast2, lever);
    } else if (id === 'house_blender') {
      const motorBase = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.18, 18), matDark);
      motorBase.position.y = 0.09;
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 12), matSilver);
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0, 0.09, 0.12);
      const pitcher = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.085, 0.30, 18), M.glassClear);
      pitcher.position.y = 0.33;
      const smoothie = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.08, 0.18, 16), matRosePink);
      smoothie.position.y = 0.29;
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.035, 18), matDark);
      lid.position.y = 0.49;
      group.add(motorBase, dial, pitcher, smoothie, lid);
    } else if (id === 'house_dishwasher' || id === 'house_washing_machine' || id === 'house_clothes_dryer') {
      const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.92, 0.72), id === 'house_dishwasher' ? matSilver : matWhite);
      cabinet.position.y = 0.46;
      const topPanel = new THREE.Mesh(new THREE.BoxGeometry(0.79, 0.12, 0.73), matDark);
      topPanel.position.y = 0.86;
      const display = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.06), M.emissiveScreen);
      display.position.set(0.18, 0.86, 0.37);
      group.add(cabinet, topPanel, display);
      if (id === 'house_dishwasher') {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.58, 12), matDark);
        bar.rotation.z = Math.PI / 2;
        bar.position.set(0, 0.72, 0.38);
        group.add(bar);
      } else {
        const drumRim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 14, 28), matSilver);
        drumRim.position.set(0, 0.42, 0.36);
        const drumGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.04, 24), M.glassClear);
        drumGlass.rotation.x = Math.PI / 2;
        drumGlass.position.set(0, 0.42, 0.36);
        group.add(drumRim, drumGlass);
      }
    } else if (id === 'house_kitchen_counter') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.88, 0.78), matWalnut);
      base.position.y = 0.44;
      const marbleTop = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.06, 0.84), matWhite);
      marbleTop.position.y = 0.91;
      const sinkBasin = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.04, 0.44), matSilver);
      sinkBasin.position.set(-0.4, 0.93, 0);
      const faucetArc = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 10, 20, Math.PI), matSilver);
      faucetArc.position.set(-0.4, 1.06, -0.14);
      group.add(base, marbleTop, sinkBasin, faucetArc);
    } else if (id === 'house_dining_table') {
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.08, 1.05), matWalnut);
      top.position.y = 0.78;
      const runner = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.015, 0.32), matVelvet);
      runner.position.y = 0.825;
      group.add(top, runner);
      [[-0.82, -0.42], [0.82, -0.42], [-0.82, 0.42], [0.82, 0.42]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.76, 12), matWalnut);
        leg.position.set(lx, 0.38, lz);
        group.add(leg);
      });
    } else if (id === 'house_dining_chair') {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.48), matVelvet);
      seat.position.y = 0.46;
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.54, 0.05), matWalnut);
      back.position.set(0, 0.75, -0.22);
      group.add(seat, back);
      [[-0.20, -0.20], [0.20, -0.20], [-0.20, 0.20], [0.20, 0.20]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.018, 0.45, 10), matWalnut);
        leg.position.set(lx, 0.225, lz);
        group.add(leg);
      });
    } else if (id === 'house_ceiling_fan') {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 12), matDark);
      rod.position.y = 0.22;
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.10, 20), matDark);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), M.emissiveBulb);
      lamp.position.y = -0.08;
      group.add(rod, motor, lamp);
      for (let b = 0; b < 4; b++) {
        const ang = (b * Math.PI) / 2;
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.018, 0.14), matWalnut);
        blade.position.set(Math.cos(ang) * 0.48, 0, Math.sin(ang) * 0.48);
        blade.rotation.y = -ang;
        group.add(blade);
      }
    } else if (id === 'house_oled_tv') {
      const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.03, 0.28), matSilver);
      standBase.position.y = 0.015;
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.06), matDark);
      neck.position.y = 0.10;
      const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.02, 0.04), M.ironBlack);
      bezel.position.y = 0.65;
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.68, 0.95), M.emissiveScreen);
      screen.position.set(0, 0.65, 0.025);
      group.add(standBase, neck, bezel, screen);
    } else if (id === 'house_soundbar') {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.09, 0.12), M.ironBlack);
      bar.position.y = 0.045;
      const grille = new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.07, 0.02), matDark);
      grille.position.set(0, 0.045, 0.06);
      const led = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.025), M.emissiveScreen);
      led.position.set(0, 0.045, 0.072);
      group.add(bar, grille, led);
    } else if (id === 'house_wardrobe') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.25, 2.05, 0.62), matWalnut);
      body.position.y = 1.025;
      const seam = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.95, 0.64), matDark);
      seam.position.y = 1.025;
      const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28, 10), matGold);
      handleL.position.set(-0.08, 1.05, 0.33);
      const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28, 10), matGold);
      handleR.position.set(0.08, 1.05, 0.33);
      group.add(body, seam, handleL, handleR);
    } else if (id === 'house_full_mirror') {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.68, 0.06), matGold);
      frame.position.y = 0.84;
      frame.rotation.x = -0.08;
      const glass = new THREE.Mesh(new THREE.BoxGeometry(0.58, 1.58, 0.07), M.glassClear);
      glass.position.y = 0.84;
      glass.rotation.x = -0.08;
      group.add(frame, glass);
    } else if (id === 'house_nightstand') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.56, 0.44), matWalnut);
      body.position.y = 0.28;
      const drawer1 = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.18, 0.03), matWood);
      drawer1.position.set(0, 0.40, 0.22);
      const drawer2 = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.18, 0.03), matWood);
      drawer2.position.set(0, 0.18, 0.22);
      const knob1 = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), matGold);
      knob1.position.set(0, 0.40, 0.25);
      const knob2 = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), matGold);
      knob2.position.set(0, 0.18, 0.25);
      group.add(body, drawer1, drawer2, knob1, knob2);
    } else if (id === 'house_bedside_lamp') {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.13, 0.04, 16), matGold);
      base.position.y = 0.02;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.26, 12), matGold);
      stem.position.y = 0.15;
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.22, 20, 1, true), matWhite);
      shade.position.y = 0.32;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), M.emissiveBulb);
      bulb.position.y = 0.28;
      group.add(base, stem, shade, bulb);
    } else if (id === 'house_curtains' || id === 'dating_velvet_drapes') {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.2, 12), matGold);
      rod.rotation.z = Math.PI / 2;
      rod.position.y = 1.95;
      const drapeMat = id === 'dating_velvet_drapes' ? matVelvet : matSky;
      const drapeL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.90, 0.08), drapeMat);
      drapeL.position.set(-0.72, 0.98, 0);
      const drapeR = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.90, 0.08), drapeMat);
      drapeR.position.set(0.72, 0.98, 0);
      group.add(rod, drapeL, drapeR);
    } else if (id === 'house_area_rug') {
      const outer = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.025, 1.8), matVelvet);
      outer.position.y = 0.012;
      const inner = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.03, 1.3), matGold);
      inner.position.y = 0.015;
      const center = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.034, 0.95), matWhite);
      center.position.y = 0.018;
      group.add(outer, inner, center);
    } else if (id === 'house_wifi_router') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.05, 0.18), M.ironBlack);
      body.position.y = 0.025;
      const leds = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.015), M.emissiveScreen);
      leds.position.set(0, 0.03, 0.092);
      [-0.10, 0, 0.10].forEach(ax => {
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.22, 8), M.ironBlack);
        ant.position.set(ax, 0.14, -0.07);
        ant.rotation.x = -0.15;
        group.add(ant);
      });
      group.add(body, leds);
    } else if (id === 'house_power_outlet' || id === 'house_light_switch' || id === 'hotel_thermostat') {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 0.04), matWhite);
      plate.position.y = 0.16;
      const inner = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.05), id === 'hotel_thermostat' ? M.emissiveScreen : matDark);
      inner.position.y = 0.16;
      group.add(plate, inner);
    } else if (id === 'house_doorknob') {
      const escutcheon = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 20), matGold);
      escutcheon.rotation.x = Math.PI / 2;
      escutcheon.position.y = 0.12;
      const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.10, 12), matGold);
      spindle.rotation.x = Math.PI / 2;
      spindle.position.set(0, 0.12, 0.05);
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.065, 18, 18), matGold);
      knob.position.set(0, 0.12, 0.11);
      group.add(escutcheon, spindle, knob);
    }
    // --- MODELOS 3D DETALLADOS ADICIONALES: GARDEN ---
    else if (id === 'garden_lawn_mower') {
      const deck = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.14, 0.78), matRed);
      deck.position.y = 0.16;
      const engine = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.20, 0.20, 16), M.ironBlack);
      engine.position.set(0, 0.30, 0);
      const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.95, 10), matDark);
      handleL.position.set(-0.22, 0.56, -0.45);
      handleL.rotation.x = -0.58;
      const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.95, 10), matDark);
      handleR.position.set(0.22, 0.56, -0.45);
      handleR.rotation.x = -0.58;
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.46, 10), M.ironBlack);
      grip.rotation.z = Math.PI / 2;
      grip.position.set(0, 0.94, -0.72);
      [[-0.31, -0.28], [0.31, -0.28], [-0.31, 0.28], [0.31, 0.28]].forEach(([wx, wz]) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 14), M.ironBlack);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.11, wz);
        group.add(wheel);
      });
      group.add(deck, engine, handleL, handleR, grip);
    } else if (id === 'garden_wheelbarrow') {
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.28, 0.34, 4), matEmerald);
      tray.rotation.y = Math.PI / 4;
      tray.position.set(0, 0.42, 0.08);
      const soilMound = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10), M.soilDark);
      soilMound.scale.set(1.1, 0.45, 1.2);
      soilMound.position.set(0, 0.56, 0.08);
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16), M.ironBlack);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(0, 0.18, 0.56);
      const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.25, 10), matWood);
      armL.rotation.x = Math.PI / 2 - 0.18;
      armL.position.set(-0.22, 0.28, -0.05);
      const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.25, 10), matWood);
      armR.rotation.x = Math.PI / 2 - 0.18;
      armR.position.set(0.22, 0.28, -0.05);
      group.add(tray, soilMound, wheel, armL, armR);
    } else if (id === 'garden_patio_umbrella') {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.08, 20), matDark);
      base.position.y = 0.04;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.35, 14), matWood);
      pole.position.y = 1.18;
      const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.45, 0.55, 8), matRed);
      canopy.position.y = 2.25;
      group.add(base, pole, canopy);
    } else if (id === 'garden_terracotta_pot') {
      const potMat = new PhysicalMat({ color: 0xc2410c, roughness: 0.55 });
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.18, 0.38, 20), potMat);
      pot.position.y = 0.19;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.028, 12, 24), potMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.37;
      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 1), M.leafGreen2);
      foliage.position.y = 0.52;
      group.add(pot, rim, foliage);
    } else if (id === 'garden_hose') {
      for (let c = 0; c < 4; c++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28 - c * 0.02, 0.032, 12, 28), matEmerald);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.04 + c * 0.055;
        group.add(ring);
      }
      const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 12), matGold);
      nozzle.rotation.z = -Math.PI / 3;
      nozzle.position.set(0.28, 0.24, 0);
      group.add(nozzle);
    } else if (id === 'garden_shovel' || id === 'garden_rake' || id === 'garden_hedge_trimmer') {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.15, 10), matWood);
      shaft.position.y = 0.62;
      shaft.rotation.z = 0.18;
      group.add(shaft);
      if (id === 'garden_shovel') {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.30, 0.03), matSilver);
        blade.position.set(-0.10, 0.15, 0);
        blade.rotation.z = 0.18;
        group.add(blade);
      } else if (id === 'garden_rake') {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.04, 0.04), matRed);
        bar.position.set(-0.10, 0.08, 0);
        group.add(bar);
        for (let t = -4; t <= 4; t++) {
          const tine = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.004, 0.10, 6), matRed);
          tine.position.set(-0.10 + t * 0.05, 0.03, 0);
          group.add(tine);
        }
      } else {
        const motor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.20, 0.18), matRed);
        motor.position.set(0, 0.25, 0);
        const cutter = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.58, 0.02), matSilver);
        cutter.position.set(0, 0.62, 0);
        group.add(motor, cutter);
      }
    } else if (id === 'garden_birdbath') {
      const pedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.10, 20), M.stoneGray);
      pedBase.position.y = 0.05;
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.14, 0.68, 16), M.stoneGray);
      column.position.y = 0.42;
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.22, 0.12, 24), M.stoneGray);
      bowl.position.y = 0.78;
      const water = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.02, 24), matSky);
      water.position.y = 0.83;
      group.add(pedBase, column, bowl, water);
    } else if (id === 'garden_hammock' || id === 'garden_sunbed') {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.12, 0.78), matWood);
      frame.position.y = 0.34;
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.10, 0.72), id === 'garden_hammock' ? matSky : matWhite);
      cushion.position.y = 0.44;
      const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.68), matRed);
      headrest.position.set(-0.62, 0.58, 0);
      headrest.rotation.z = -0.38;
      group.add(frame, cushion, headrest);
    } else if (id === 'garden_greenhouse' || id === 'garden_storage_shed' || id === 'garden_pergola') {
      const isGlass = id === 'garden_greenhouse';
      const wallMat = isGlass ? M.glassClear : matWood;
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.85, 1.65), wallMat);
      body.position.y = 0.925;
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.55, 0.75, 4), isGlass ? M.glassClear : matWalnut);
      roof.position.y = 2.22;
      roof.rotation.y = Math.PI / 4;
      group.add(body, roof);
    } else if (id === 'garden_fire_pit' || id === 'garden_patio_heater') {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.62, 0.36, 24), M.stoneGray);
      ring.position.y = 0.18;
      const coalBed = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.08, 20), M.ironBlack);
      coalBed.position.y = 0.34;
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 12), M.emissiveBulb);
      flame.position.y = 0.54;
      group.add(ring, coalBed, flame);
    } else if (id === 'garden_compost_bin' || id === 'garden_beehive_box') {
      const boxMat = id === 'garden_beehive_box' ? matWhite : matWalnut;
      [0.22, 0.54, 0.86].forEach(by => {
        const tier = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.28, 0.64), boxMat);
        tier.position.y = by;
        group.add(tier);
      });
      const lid = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.08, 0.70), matDark);
      lid.position.y = 1.04;
      group.add(lid);
    } else if (id === 'garden_stepping_stones') {
      [-0.6, 0, 0.6].forEach((sz, idx) => {
        const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.35, 0.06, 7), M.stonePaver);
        stone.position.set(idx % 2 === 0 ? -0.12 : 0.12, 0.03, sz);
        group.add(stone);
      });
    } else if (id === 'garden_wind_chime') {
      const topDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 16), matWood);
      topDisk.position.y = 0.55;
      group.add(topDisk);
      for (let t = 0; t < 5; t++) {
        const a = (t * Math.PI * 2) / 5;
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.36 + t * 0.04, 10), matSilver);
        tube.position.set(Math.cos(a) * 0.12, 0.30, Math.sin(a) * 0.12);
        group.add(tube);
      }
    }
    // --- MODELOS 3D DETALLADOS ADICIONALES: DATING & RESTAURANT ---
    else if (id === 'dating_chandelier') {
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.75, 10), matGold);
      chain.position.y = 0.45;
      const wheel1 = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.035, 12, 28), matGold);
      wheel1.rotation.x = Math.PI / 2;
      const wheel2 = new THREE.Mesh(new THREE.TorusGeometry(0.40, 0.03, 12, 24), matGold);
      wheel2.rotation.x = Math.PI / 2;
      wheel2.position.y = -0.22;
      group.add(chain, wheel1, wheel2);
      for (let c = 0; c < 8; c++) {
        const a = (c * Math.PI * 2) / 8;
        const candle = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), M.emissiveBulb);
        candle.position.set(Math.cos(a) * 0.68, 0.06, Math.sin(a) * 0.68);
        group.add(candle);
      }
    } else if (id === 'dating_silver_cutlery' || id === 'dating_dessert_spoon' || id === 'rest_steak_knife') {
      [-0.07, 0, 0.07].forEach((cx, i) => {
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.012, 0.14), i === 2 ? matWalnut : matSilver);
        handle.position.set(cx, 0.015, 0.06);
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.008, 0.14), matSilver);
        blade.position.set(cx, 0.015, -0.07);
        group.add(handle, blade);
      });
    } else if (id === 'dating_champagne_flute') {
      [-0.09, 0.09].forEach(fx => {
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.052, 0.01, 16), M.glassClear);
        foot.position.set(fx, 0.005, 0);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.15, 10), M.glassClear);
        stem.position.set(fx, 0.08, 0);
        const flute = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.018, 0.18, 16), M.glassClear);
        flute.position.set(fx, 0.24, 0);
        const champagne = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.016, 0.12, 14), matGold);
        champagne.position.set(fx, 0.22, 0);
        group.add(foot, stem, flute, champagne);
      });
    } else if (id === 'dating_cocktail_shaker' || id === 'dating_olive_oil_cruet' || id === 'rest_water_pitcher' || id === 'rest_sauce_boat') {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.065, 0.24, 18), id === 'dating_cocktail_shaker' ? matSilver : M.glassClear);
      body.position.y = 0.12;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.09, 18), matGold);
      cap.position.y = 0.28;
      group.add(body, cap);
    } else if (id === 'dating_bread_basket' || id === 'rest_bread_plate' || id === 'rest_soup_tureen') {
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.14, 0.10, 20), id === 'rest_soup_tureen' ? matWhite : matWood);
      bowl.position.y = 0.05;
      const roll1 = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), matGold);
      roll1.position.set(-0.05, 0.10, 0);
      const roll2 = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), matGold);
      roll2.position.set(0.06, 0.10, 0.03);
      group.add(bowl, roll1, roll2);
    } else if (id === 'dating_coat_rack' || id === 'hotel_suit_hangers') {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.30, 0.05, 18), matWalnut);
      base.position.y = 0.025;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 1.78, 12), matWalnut);
      pole.position.y = 0.90;
      group.add(base, pole);
      for (let h = 0; h < 4; h++) {
        const a = (h * Math.PI) / 2;
        const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8), matGold);
        hook.position.set(Math.cos(a) * 0.09, 1.68, Math.sin(a) * 0.09);
        hook.rotation.z = Math.cos(a) * -0.6;
        hook.rotation.x = Math.sin(a) * 0.6;
        group.add(hook);
      }
    } else if (id === 'dating_acoustic_guitar') {
      const bodyBot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.09, 24), matWood);
      bodyBot.rotation.x = Math.PI / 2;
      bodyBot.position.set(0, 0.32, 0);
      const bodyTop = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.09, 24), matWood);
      bodyTop.rotation.x = Math.PI / 2;
      bodyTop.position.set(0, 0.56, 0);
      const soundHole = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.10, 16), M.ironBlack);
      soundHole.rotation.x = Math.PI / 2;
      soundHole.position.set(0, 0.52, 0.01);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.56, 0.03), matWalnut);
      neck.position.set(0, 0.94, 0);
      group.add(bodyBot, bodyTop, soundHole, neck);
    } else if (id === 'dating_maitre_podium' || id === 'hotel_valet_podium') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.08, 0.48), matGold);
      base.position.y = 0.04;
      const column = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.02, 0.38), matWalnut);
      column.position.y = 0.55;
      const deskTop = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.06, 0.52), matWalnut);
      deskTop.position.set(0, 1.08, 0);
      deskTop.rotation.x = 0.24;
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.03, 0.28), matWhite);
      book.position.set(0, 1.12, 0);
      book.rotation.x = 0.24;
      group.add(base, column, deskTop, book);
    }
    // --- MODELOS 3D DETALLADOS ADICIONALES: SPACE ---
    else if (id === 'space_mercury' || id === 'space_venus' || id === 'space_jupiter' || id === 'space_uranus' || id === 'space_neptune') {
      const pMap = {
        space_mercury: { r: 0.38, col: 0x94a3b8, em: 0x334155 },
        space_venus:   { r: 0.56, col: 0xf59e0b, em: 0xb45309 },
        space_jupiter: { r: 1.08, col: 0xd97706, em: 0x92400e },
        space_uranus:  { r: 0.72, col: 0x38bdf8, em: 0x0284c7 },
        space_neptune: { r: 0.68, col: 0x2563eb, em: 0x1d4ed8 }
      }[id];
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(pMap.r, 16, 16),
        new THREE.MeshStandardMaterial({ color: pMap.col, emissive: pMap.em, emissiveIntensity: 0.32, roughness: 0.45 })
      );
      group.add(sphere);
      if (id === 'space_jupiter' || id === 'space_uranus') {
        const band = new THREE.Mesh(
          new THREE.TorusGeometry(pMap.r * 1.32, 0.035, 12, 40),
          new THREE.MeshBasicMaterial({ color: id === 'space_uranus' ? 0x7dd3fc : 0xfde68a, transparent: true, opacity: 0.65 })
        );
        band.rotation.x = id === 'space_uranus' ? 0.25 : Math.PI / 2.2;
        group.add(band);
      }
    } else if (id === 'space_neutron_star' || id === 'space_supernova' || id === 'space_orion_nebula' || id === 'space_milky_way') {
      const coreColor = id === 'space_neutron_star' ? 0x38bdf8 : (id === 'space_supernova' ? 0xf43f5e : 0xa855f7);
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 24, 24),
        new THREE.MeshStandardMaterial({ color: coreColor, emissive: coreColor, emissiveIntensity: 2.4, roughness: 0.15 })
      );
      const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.06, 14, 40), new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 }));
      ringA.rotation.x = Math.PI / 3;
      const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.04, 14, 40), new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.65 }));
      ringB.rotation.y = Math.PI / 3;
      group.add(core, ringA, ringB);
    } else if (id === 'space_launch_rocket' || id === 'space_launchpad_tower') {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 1.65, 20), matWhite);
      body.position.y = 0.825;
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.48, 20), matRed);
      nose.position.y = 1.88;
      const boosterL = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 1.05, 14), matWhite);
      boosterL.position.set(-0.34, 0.525, 0);
      const boosterR = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 1.05, 14), matWhite);
      boosterR.position.set(0.34, 0.525, 0);
      group.add(body, nose, boosterL, boosterR);
    } else if (id === 'space_space_station' || id === 'space_solar_array' || id === 'space_deep_probe') {
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.35, 16), matSilver);
      hub.rotation.z = Math.PI / 2;
      group.add(hub);
      [-0.75, 0.75].forEach(px => {
        const wing1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 1.45), matSky);
        wing1.position.set(px, 0, 0.92);
        const wing2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 1.45), matSky);
        wing2.position.set(px, 0, -0.92);
        group.add(wing1, wing2);
      });
    } else if (id === 'space_lunar_rover') {
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.16, 0.58), matGold);
      chassis.position.y = 0.26;
      const dish = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.14, 16), matSilver);
      dish.position.set(0.22, 0.52, 0);
      dish.rotation.z = -0.45;
      [[-0.36, -0.32], [0.36, -0.32], [-0.36, 0.32], [0.36, 0.32]].forEach(([wx, wz]) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16), M.ironBlack);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wx, 0.14, wz);
        group.add(wheel);
      });
      group.add(chassis, dish);
    } else if (id === 'space_spacesuit') {
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.58, 0.30), matWhite);
      torso.position.y = 0.55;
      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), matWhite);
      helmet.position.y = 1.02;
      const visor = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), matGold);
      visor.position.set(0, 1.02, 0.08);
      group.add(torso, helmet, visor);
    } else if (id === 'space_asteroid_belt' || id === 'space_halley_comet' || id === 'space_meteorite') {
      const core = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42, 1), M.stoneGray);
      group.add(core);
      if (id === 'space_halley_comet') {
        const tail = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.35, 16), new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 }));
        tail.rotation.z = Math.PI / 2.2;
        tail.position.set(0.75, 0.12, 0);
        group.add(tail);
      }
    }
    // --- MODELOS 3D DETALLADOS ADICIONALES: SUPERMARKET, HOTEL, RESTAURANT ---
    else if (id === 'market_conveyor_belt' || id === 'market_deli_counter' || id === 'market_meat_counter' || id === 'market_seafood_ice') {
      // Mostrador de Carnicería / Pescadería / Fiambrería con vitrina de cristal y alimentos detallados dentro
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.62, 0.84), matWhite);
      base.position.y = 0.31;
      const frontStripe = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.12, 0.04), id.includes('seafood') ? matSky : matRed);
      frontStripe.position.set(0, 0.45, 0.42);
      const displayBed = new THREE.Mesh(
        new THREE.BoxGeometry(1.94, 0.06, 0.72),
        id === 'market_conveyor_belt' ? M.ironBlack : (id.includes('seafood') ? new PhysicalMat({ color: 0xe0f2fe, roughness: 0.2 }) : matSilver)
      );
      displayBed.position.set(0, 0.65, 0);
      const glassHood = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.44, 0.76), M.glassClear);
      glassHood.position.set(0, 0.88, 0);
      group.add(base, frontStripe, displayBed, glassHood);
      // Cortes de carne / filetes de salmón / quesos visibles sobre la cama de hielo o acero
      [-0.65, -0.22, 0.22, 0.65].forEach((fx, fIdx) => {
        const cutColor = id.includes('seafood') ? (fIdx % 2 === 0 ? matRosePink : matSilver) : (id.includes('deli') ? matGold : matRed);
        const cutMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.38), cutColor);
        cutMesh.position.set(fx, 0.71, 0);
        group.add(cutMesh);
      });
    } else if (
      id === 'market_beverage_aisle' || id === 'market_canned_goods' || id === 'market_cereal_aisle' ||
      id === 'market_cleaning_aisle' || id === 'market_bulk_dispenser' || id === 'market_buy_in_bulk'
    ) {
      // Góndola de Supermercado Abierta (respaldo delgado para que las repisas y productos sean 100% visibles)
      const backboard = new THREE.Mesh(new THREE.BoxGeometry(1.72, 1.68, 0.06), matWhite);
      backboard.position.set(0, 0.84, -0.28);
      const baseDeck = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.14, 0.64), matDark);
      baseDeck.position.set(0, 0.07, 0);
      const topSign = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.14, 0.12), id.includes('cereal') ? matGold : (id.includes('beverage') ? matRed : matEmerald));
      topSign.position.set(0, 1.66, -0.22);
      group.add(backboard, baseDeck, topSign);
      [0.16, 0.62, 1.08].forEach((sy) => {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.04, 0.56), matSilver);
        shelf.position.set(0, sy, 0);
        const priceRail = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.035, 0.02), matGold);
        priceRail.position.set(0, sy, 0.28);
        group.add(shelf, priceRail);
        for (let b = -3; b <= 3; b++) {
          const itemMat = id.includes('cereal')
            ? (b % 2 === 0 ? matGold : matRed)
            : (id.includes('beverage') ? (b % 2 === 0 ? matRed : matSky) : (b % 2 === 0 ? matEmerald : matGold));
          if (id.includes('cereal') || id.includes('cleaning')) {
            const boxProd = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.30, 0.12), itemMat);
            boxProd.position.set(b * 0.22, sy + 0.17, 0.06);
            const labelPatch = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.14), matWhite);
            labelPatch.position.set(b * 0.22, sy + 0.18, 0.125);
            group.add(boxProd, labelPatch);
          } else {
            const cylProd = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.28, 14), itemMat);
            cylProd.position.set(b * 0.22, sy + 0.16, 0.06);
            const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 10), matWhite);
            capTop.position.set(b * 0.22, sy + 0.31, 0.06);
            group.add(cylProd, capTop);
          }
        }
      });
    } else if (id === 'market_trolley_bay') {
      // Bahía de Retorno de Carritos con barandales tubulares cromados y letrero azul
      const railL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.85, 1.35), matSilver);
      railL.position.set(-0.55, 0.42, 0);
      const railR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.85, 1.35), matSilver);
      railR.position.set(0.55, 0.42, 0);
      const signArch = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.28, 0.06), matSky);
      signArch.position.set(0, 1.35, -0.58);
      const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.35, 10), matSilver);
      postL.position.set(-0.55, 0.68, -0.58);
      const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.35, 10), matSilver);
      postR.position.set(0.55, 0.68, -0.58);
      const nestedCart = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.48, 0.85), matSilver);
      nestedCart.position.set(0, 0.46, 0);
      const cartHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.72, 12), matRed);
      cartHandle.rotation.z = Math.PI / 2;
      cartHandle.position.set(0, 0.76, 0.44);
      group.add(railL, railR, signArch, postL, postR, nestedCart, cartHandle);
    } else if (id === 'market_aisle_sign' || id === 'market_aisle_number') {
      // Letrero de Pasillo Colgante o de Pedestal con número e indicadores de categoría
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.05, 18), matSilver);
      base.position.y = 0.025;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.65, 12), matSilver);
      pole.position.y = 0.825;
      const board = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.38, 0.06), matSky);
      board.position.set(0, 1.65, 0);
      const numBadge = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 0.08), matGold);
      numBadge.position.set(-0.44, 1.65, 0);
      group.add(base, pole, board, numBadge);
    } else if (
      id === 'market_receipt' || id === 'market_card_terminal' || id === 'market_plastic_divider' ||
      id === 'rest_pos_terminal' || id === 'hotel_checkin_terminal' || id === 'market_pay_by_card' ||
      id === 'market_contactless_pay'
    ) {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.18, 16), matSilver);
      stand.position.y = 0.09;
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.26, 0.22), matDark);
      body.position.y = 0.26;
      body.rotation.x = -0.25;
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.16), M.emissiveScreen);
      screen.position.set(0, 0.28, 0.115);
      screen.rotation.x = -0.25;
      const receiptPaper = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.015), matWhite);
      receiptPaper.position.set(0, 0.44, -0.02);
      receiptPaper.rotation.x = 0.18;
      group.add(stand, body, screen, receiptPaper);
    } else if (id === 'hotel_king_bed') {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.34, 2.25), matWalnut);
      frame.position.y = 0.17;
      const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.20, 1.25, 0.16), matVelvet);
      headboard.position.set(0, 0.625, -1.06);
      const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.28, 2.08), matWhite);
      mattress.position.set(0, 0.44, 0.04);
      const runner = new THREE.Mesh(new THREE.BoxGeometry(2.04, 0.30, 0.58), matGold);
      runner.position.set(0, 0.45, 0.68);
      const pillowL = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.16, 0.42), matWhite);
      pillowL.position.set(-0.52, 0.64, -0.72);
      const pillowR = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.16, 0.42), matWhite);
      pillowR.position.set(0.52, 0.64, -0.72);
      group.add(frame, headboard, mattress, runner, pillowL, pillowR);
    } else if (id === 'hotel_swimming_pool') {
      const coping = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.18, 1.65), matWhite);
      coping.position.y = 0.09;
      const water = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.20, 1.35), matSky);
      water.position.y = 0.10;
      const ladderL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 10), matSilver);
      ladderL.position.set(-1.05, 0.35, 0.68);
      const ladderR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 10), matSilver);
      ladderR.position.set(-0.82, 0.35, 0.68);
      group.add(coping, water, ladderL, ladderR);
    } else if (id === 'hotel_shuttle_van') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.85, 0.96), matWhite);
      body.position.y = 0.56;
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.17, 0.12, 0.98), matGold);
      stripe.position.set(0, 0.46, 0);
      const cabinGlass = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.36, 0.98), M.glassClear);
      cabinGlass.position.set(0.05, 0.72, 0);
      [[-0.68, -0.48], [0.68, -0.48], [-0.68, 0.48], [0.68, 0.48]].forEach(([wx, wz]) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.10, 16), M.ironBlack);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wx, 0.18, wz);
        group.add(wheel);
      });
      group.add(body, stripe, cabinGlass);
    } else if (id === 'hotel_safe_box') {
      // Caja fuerte electrónica de acero con teclado numérico iluminado y manija en L
      const safeBody = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.52, 0.48), matDark);
      safeBody.position.y = 0.26;
      const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.44, 0.04), matSilver);
      doorPanel.position.set(0, 0.26, 0.24);
      const screenPad = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.08), M.emissiveScreen);
      screenPad.position.set(0.10, 0.34, 0.265);
      const handleHub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16), matGold);
      handleHub.rotation.x = Math.PI / 2;
      handleHub.position.set(-0.12, 0.26, 0.265);
      group.add(safeBody, doorPanel, screenPad, handleHub);
    } else if (id === 'hotel_minibar') {
      // Minibar con puerta de cristal y botellas/latas refrigeradas visibles en el interior
      const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.78, 0.54), matWalnut);
      cabinet.position.y = 0.39;
      const glassDoor = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.68, 0.04), M.glassClear);
      glassDoor.position.set(0, 0.39, 0.27);
      const bottle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.24, 12), matEmerald);
      bottle1.position.set(-0.12, 0.52, 0.12);
      const can1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.14, 12), matRed);
      can1.position.set(0.10, 0.48, 0.12);
      group.add(cabinet, glassDoor, bottle1, can1);
    } else if (id === 'hotel_room_service_tray' || id === 'rest_service_tray') {
      // Bandeja plateada de Room Service con campana cloche, tetera y taza de porcelana
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.36, 0.03, 24), matSilver);
      tray.position.y = 0.015;
      const cloche = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), matSilver);
      cloche.position.set(-0.08, 0.03, 0);
      const handleTop = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 12), matGold);
      handleTop.position.set(-0.08, 0.22, 0);
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.045, 0.10, 16), matWhite);
      cup.position.set(0.18, 0.07, 0.06);
      group.add(tray, cloche, handleTop, cup);
    } else if (id === 'hotel_bathrobe') {
      // Bata de baño blanca afelpada en perchero con cinturón anudado
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.24, 0.05, 16), matGold);
      stand.position.y = 0.025;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.35, 10), matGold);
      pole.position.y = 0.68;
      const torsoRobe = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.95, 16), matWhite);
      torsoRobe.position.set(0, 0.82, 0);
      const belt = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.025, 10, 20), matGold);
      belt.rotation.x = Math.PI / 2;
      belt.position.set(0, 0.80, 0);
      const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.45, 12), matWhite);
      sleeveL.position.set(-0.24, 0.96, 0);
      sleeveL.rotation.z = 0.38;
      const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.45, 12), matWhite);
      sleeveR.position.set(0.24, 0.96, 0);
      sleeveR.rotation.z = -0.38;
      group.add(stand, pole, torsoRobe, belt, sleeveL, sleeveR);
    } else if (id === 'hotel_towel_rack') {
      // Toallero climatizado cromado con toallas blancas y azules dobladas
      const railL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.95, 10), matSilver);
      railL.position.set(-0.32, 0.48, 0);
      const railR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.95, 10), matSilver);
      railR.position.set(0.32, 0.48, 0);
      const towel1 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.36, 0.08), matWhite);
      towel1.position.set(0, 0.68, 0.03);
      const towel2 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 0.08), matSky);
      towel2.position.set(0, 0.32, 0.03);
      group.add(railL, railR, towel1, towel2);
    } else if (id === 'hotel_fitness_treadmill') {
      // Caminadora de gimnasio con banda de correr, pasamanos y consola LED
      const deck = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.12, 1.55), matDark);
      deck.position.y = 0.08;
      const belt = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.02, 1.38), M.ironBlack);
      belt.position.set(0, 0.145, 0.04);
      const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 1.15, 12), matSilver);
      postL.position.set(-0.34, 0.62, -0.58);
      const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 1.15, 12), matSilver);
      postR.position.set(0.34, 0.62, -0.58);
      const consoleBox = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.28, 0.32), matDark);
      consoleBox.position.set(0, 1.22, -0.54);
      consoleBox.rotation.x = 0.35;
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.18), M.emissiveScreen);
      screen.position.set(0, 1.24, -0.37);
      screen.rotation.x = -0.35;
      group.add(deck, belt, postL, postR, consoleBox, screen);
    } else if (id === 'hotel_ironing_board') {
      // Tabla de planchar plegable con plancha de vapor encima
      const board = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.05, 0.38), matSky);
      board.position.y = 0.78;
      const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.92, 10), matSilver);
      leg1.rotation.z = 0.45;
      leg1.position.set(0, 0.39, 0);
      const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.92, 10), matSilver);
      leg2.rotation.z = -0.45;
      leg2.position.set(0, 0.39, 0);
      const iron = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.22, 4), matWhite);
      iron.rotation.z = Math.PI / 2;
      iron.position.set(0.28, 0.85, 0);
      group.add(board, leg1, leg2, iron);
    } else if (id === 'hotel_emergency_exit') {
      // Puerta y Señal de Salida de Emergencia iluminada en verde
      const door = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.05, 0.08), matWhite);
      door.position.y = 1.025;
      const panicBar = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.06, 0.08), matSilver);
      panicBar.position.set(0, 1.0, 0.06);
      const exitSign = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.22, 0.08), matEmerald);
      exitSign.position.set(0, 2.22, 0.04);
      group.add(door, panicBar, exitSign);
    } else if (id === 'hotel_slippers') {
      const matPad = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.02, 0.42), matGold);
      matPad.position.y = 0.01;
      [-0.12, 0.12].forEach(sx => {
        const sole = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.28), matWhite);
        sole.position.set(sx, 0.03, 0);
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.12), matWhite);
        strap.position.set(sx, 0.06, -0.02);
        group.add(sole, strap);
      });
      group.add(matPad);
    } else if (id === 'hotel_do_not_disturb' || id === 'hotel_pillow_menu' || id === 'hotel_key_drop' || id === 'hotel_smoke_detector') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.62, 0.36), matWalnut);
      base.position.y = 0.31;
      const trim = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.48, 0.04), matGold);
      trim.position.set(0, 0.32, 0.18);
      const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.16), M.emissiveScreen);
      badge.position.set(0, 0.40, 0.205);
      group.add(base, trim, badge);
    } else if (id === 'rest_padded_booth' || id === 'rest_high_chair') {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.44, 0.68), matVelvet);
      seat.position.y = 0.22;
      const back = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.68, 0.20), matVelvet);
      back.position.set(0, 0.68, -0.24);
      const goldCap = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.06, 0.22), matGold);
      goldCap.position.set(0, 1.04, -0.24);
      group.add(seat, back, goldCap);
    } else if (id === 'rest_executive_chef' || id === 'rest_chef_uniform') {
      const legsL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.58, 12), M.ironBlack);
      legsL.position.set(-0.10, 0.29, 0);
      const legsR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.58, 12), M.ironBlack);
      legsR.position.set(0.10, 0.29, 0);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.20, 0.68, 16), matWhite);
      body.position.y = 0.88;
      const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 10, 20), matRed);
      scarf.rotation.x = Math.PI / 2;
      scarf.position.y = 1.20;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 18), new PhysicalMat({ color: 0xfde68a, roughness: 0.38 }));
      head.position.y = 1.38;
      const toque = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.15, 0.32, 16), matWhite);
      toque.position.y = 1.66;
      group.add(legsL, legsR, body, scarf, head, toque);
    } else if (id === 'rest_gas_stove' || id === 'rest_frying_pan' || id === 'rest_cutting_board') {
      const range = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.86, 0.78), matSilver);
      range.position.y = 0.43;
      const burnerGlow = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 10, 24), M.emissiveScreen);
      burnerGlow.rotation.x = Math.PI / 2;
      burnerGlow.position.set(-0.24, 0.87, 0);
      const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.06, 20), M.ironBlack);
      pan.position.set(-0.24, 0.90, 0);
      const panHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.28, 10), matGold);
      panHandle.rotation.x = Math.PI / 2;
      panHandle.position.set(-0.24, 0.91, 0.30);
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.30), matWood);
      board.position.set(0.26, 0.88, 0);
      group.add(range, burnerGlow, pan, panHandle, board);
    } else if (/dating_pick_up_line|dating_first_impression|dating_give_compliment|dating_into_you|dating_see_again|dating_love_first_sight/i.test(id)) {
      // Carta romántica doblada en sobre de pergamino vintage con sello de lacre burdeos y pluma estilográfica de latón
      const envelope = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.015, 0.20), matWhite);
      envelope.position.y = 0.01;
      const flap = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.02, 3), matWhite);
      flap.rotation.x = Math.PI / 2;
      flap.position.set(0, 0.016, -0.04);
      const waxSeal = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.01, 16), matRed);
      waxSeal.position.set(0, 0.022, 0.01);
      const penBody = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.006, 0.24, 10), matGold);
      penBody.rotation.z = Math.PI / 2.8;
      penBody.rotation.y = 0.35;
      penBody.position.set(0.14, 0.018, 0.06);
      group.add(envelope, flap, waxSeal, penBody);
    } else if (/dating_break_the_ice/i.test(id)) {
      // Hielera de cristal tallado con cubos de hielo traslúcidos y cuello de botella de espumoso
      const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.22, 18), matSilver);
      bucket.position.y = 0.11;
      const iceTop = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 16), M.glassClear);
      iceTop.position.y = 0.20;
      const bottleNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.035, 0.20, 14), matEmerald);
      bottleNeck.position.set(0.02, 0.28, -0.01);
      const bottleCap = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.04, 12), matGold);
      bottleCap.position.set(0.02, 0.38, -0.01);
      group.add(bucket, iceTop, bottleNeck, bottleCap);
    } else if (/dating_split_the_bill|dating_treat_someone|dating_check_please|dating_tip_the_waiter/i.test(id)) {
      // Carpeta porta-cuenta de cuero italiano con recibo impreso, pluma dorada y monedas de propina en bandeja
      const billFolder = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.32), matWalnut);
      billFolder.position.y = 0.015;
      const billSlip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.030, 0.24), matWhite);
      billSlip.position.set(-0.02, 0.022, 0);
      const tipDish = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.018, 18), matSilver);
      tipDish.position.set(0.16, 0.012, 0.06);
      const goldCoin1 = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.012, 14), matGold);
      goldCoin1.position.set(0.16, 0.026, 0.06);
      const goldCoin2 = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.010, 14), matGold);
      goldCoin2.position.set(0.18, 0.032, 0.04);
      group.add(billFolder, billSlip, tipDish, goldCoin1, goldCoin2);
    } else if (/dating_make_reservation/i.test(id)) {
      // Libro de reservaciones de gala abierto con cubierta de piel y cinta marcapáginas
      const ledgerStand = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.04, 0.28), matWalnut);
      ledgerStand.position.y = 0.02;
      ledgerStand.rotation.x = 0.25;
      const ledgerPages = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.24), matWhite);
      ledgerPages.position.set(0, 0.045, 0);
      ledgerPages.rotation.x = 0.25;
      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.055, 0.26), matRed);
      ribbon.position.set(0, 0.046, 0);
      ribbon.rotation.x = 0.25;
      group.add(ledgerStand, ledgerPages, ribbon);
    } else if (/dating_candlelit_dinner/i.test(id)) {
      // Candelabro triple de plata con tres velas largas y llamas cálidas
      const cBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.03, 18), matSilver);
      cBase.position.y = 0.015;
      const cStem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.24, 12), matSilver);
      cStem.position.y = 0.14;
      const cArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.016, 0.016), matSilver);
      cArm.position.y = 0.22;
      group.add(cBase, cStem, cArm);
      [-0.12, 0, 0.12].forEach(vx => {
        const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.14, 12), matWhite);
        wax.position.set(vx, 0.29, 0);
        const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.02, 6), matDark);
        wick.position.set(vx, 0.37, 0);
        const flameMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, emissive: 0xff9900, emissiveIntensity: 2.8 });
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.04, 10), flameMat);
        flame.position.set(vx, 0.39, 0);
        group.add(wax, wick, flame);
      });
    } else if (/dating_dress_up/i.test(id)) {
      // Moño de esmoquin de seda negra con mancuernillas de oro y reloj en charola de nogal
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 24), matWalnut);
      tray.position.y = 0.01;
      const bowKnot = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.035, 0.03), matDark);
      bowKnot.position.set(-0.04, 0.03, 0);
      const bowWing1 = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.09, 3), matDark);
      bowWing1.rotation.z = Math.PI / 2;
      bowWing1.position.set(-0.09, 0.03, 0);
      const bowWing2 = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.09, 3), matDark);
      bowWing2.rotation.z = -Math.PI / 2;
      bowWing2.position.set(0.01, 0.03, 0);
      const cufflink1 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.015, 12), matGold);
      cufflink1.position.set(0.09, 0.025, 0.04);
      const cufflink2 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.015, 12), matGold);
      cufflink2.position.set(0.09, 0.025, -0.04);
      group.add(tray, bowKnot, bowWing1, bowWing2, cufflink1, cufflink2);
    } else if (/dating_great_chemistry|dating_soulmates|dating_holding_hands|dating_fall_in_love/i.test(id)) {
      // Escultura de nudo de amor infinito en oro rosado entrelazado sobre mármol
      const marbleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.03, 20), matWhite);
      marbleBase.position.y = 0.015;
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.022, 14, 32), matRosePink);
      ring1.position.set(-0.04, 0.13, 0);
      ring1.rotation.y = 0.45;
      ring1.rotation.x = 0.35;
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.022, 14, 32), matGold);
      ring2.position.set(0.04, 0.13, 0);
      ring2.rotation.y = -0.45;
      ring2.rotation.x = -0.35;
      group.add(marbleBase, ring1, ring2);
    } else if (/dating_fiance/i.test(id)) {
      // Estuche de anillo de compromiso abierto de terciopelo azul con solitario de diamante brillante
      const boxLower = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.12), matVelvet);
      boxLower.position.y = 0.03;
      const boxUpper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.12), matVelvet);
      boxUpper.position.set(0, 0.09, -0.05);
      boxUpper.rotation.x = -1.2;
      const ringBand = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.006, 12, 24), matGold);
      ringBand.rotation.x = Math.PI / 2;
      ringBand.position.set(0, 0.065, 0);
      const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.016, 0), matWhite);
      diamond.position.set(0, 0.095, 0);
      group.add(boxLower, boxUpper, ringBand, diamond);
    } else if (/dating_blind_date/i.test(id)) {
      // Máscara veneciana de gala dorada sobre base de ébano
      const maskStand = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.22, 10), matDark);
      maskStand.position.y = 0.11;
      const maskBase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.02, 16), matDark);
      maskBase.position.y = 0.01;
      const maskFace = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.03, 10, 24, Math.PI), matGold);
      maskFace.rotation.z = Math.PI;
      maskFace.position.set(0, 0.22, 0);
      group.add(maskStand, maskBase, maskFace);
    } else if (/dating_ask_someone_out/i.test(id)) {
      // Taza de café capuchino con espuma y diseño de corazón en platillo de porcelana
      const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.018, 20), matWhite);
      saucer.position.y = 0.009;
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.055, 0.09, 18), matWhite);
      cup.position.y = 0.055;
      const coffee = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.01, 16), M.coffeeLiquid);
      coffee.position.y = 0.095;
      const heartDeco = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), matRosePink);
      heartDeco.scale.set(1.2, 0.3, 1.2);
      heartDeco.position.set(0, 0.10, 0);
      group.add(saucer, cup, coffee, heartDeco);
    } else if (/dating_butterflies/i.test(id)) {
      // Campana de cristal victoriana con mariposa dorada iluminada
      const bellBase = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.025, 20), matWalnut);
      bellBase.position.y = 0.012;
      const glassDome = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.26, 18, 1, true), M.glassClear);
      glassDome.position.y = 0.14;
      const glassTop = new THREE.Mesh(new THREE.SphereGeometry(0.10, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), M.glassClear);
      glassTop.position.y = 0.27;
      const butterflyWing1 = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.07, 3), matGold);
      butterflyWing1.rotation.z = Math.PI / 3;
      butterflyWing1.position.set(-0.025, 0.16, 0);
      const butterflyWing2 = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.07, 3), matGold);
      butterflyWing2.rotation.z = -Math.PI / 3;
      butterflyWing2.position.set(0.025, 0.16, 0);
      group.add(bellBase, glassDome, glassTop, butterflyWing1, butterflyWing2);
    } else if (/dating_make_toast/i.test(id)) {
      // Dos copas de champaña brindando con burbujas doradas
      [-0.06, 0.06].forEach((cx, cIdx) => {
        const fluteBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.008, 14), M.glassClear);
        fluteBase.position.set(cx, 0.004, 0);
        const fluteStem = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.12, 10), M.glassClear);
        fluteStem.position.set(cx, 0.064, 0);
        const fluteBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.018, 0.14, 14), M.glassClear);
        fluteBowl.position.set(cx, 0.19, 0);
        fluteBowl.rotation.z = cIdx === 0 ? -0.15 : 0.15;
        const champagne = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.014, 0.09, 12), matGold);
        champagne.position.set(cx, 0.18, 0);
        champagne.rotation.z = cIdx === 0 ? -0.15 : 0.15;
        group.add(fluteBase, fluteStem, fluteBowl, champagne);
      });
    } else if (/dating_romantic_ambiance/i.test(id)) {
      // Farol de latón vintage con cristal y vela cálida interior
      const lanternBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.18), matBrass);
      lanternBase.position.y = 0.02;
      const glassCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.24, 16), M.glassClear);
      glassCylinder.position.y = 0.16;
      const lanternTop = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.10, 4), matBrass);
      lanternTop.position.y = 0.33;
      const innerFlame = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.06, 8), M.emissiveScreen);
      innerFlame.position.y = 0.15;
      group.add(lanternBase, glassCylinder, lanternTop, innerFlame);
    } else if (/dating_appetizer_concept|rest_starters_concept/i.test(id)) {
      // Tabla rústica de pizarra con jamón serrano, quesos finos y uvas
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.02, 0.22), matDark);
      board.position.y = 0.01;
      const cheese = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.04, 3), matGold);
      cheese.position.set(-0.08, 0.035, 0);
      const meatRosette = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.015, 8, 16), matRed);
      meatRosette.rotation.x = Math.PI / 2;
      meatRosette.position.set(0.06, 0.03, 0.02);
      const grape1 = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), matRosePink);
      grape1.position.set(0.02, 0.03, -0.05);
      group.add(board, cheese, meatRosette, grape1);
    } else if (/dating_main_course_concept|rest_entree_concept/i.test(id)) {
      // Campana cloche plateada de servicio de alta cocina con pomo esférico
      const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 24), matSilver);
      platter.position.y = 0.01;
      const cloche = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), matSilver);
      cloche.position.y = 0.02;
      const clocheHandle = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), matGold);
      clocheHandle.position.y = 0.21;
      group.add(platter, cloche, clocheHandle);
    } else if (/dating_sommelier_concept/i.test(id)) {
      // Tastevin de plata de sumiller francés con corcho de cosecha y cortacápsulas
      const tastevin = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.03, 18), matSilver);
      tastevin.position.set(-0.04, 0.015, 0);
      const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.06, 12), matWood);
      cork.rotation.z = Math.PI / 2;
      cork.position.set(0.08, 0.018, 0.02);
      group.add(tastevin, cork);
    } else if (/garden_photosynthesis/i.test(id)) {
      // Terrario de vidrio botánico con brote verde y lupa de latón enfocando luz solar
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.08, 16), M.terracottaPot);
      pot.position.y = 0.04;
      const sprout = new THREE.Mesh(new THREE.DodecahedronGeometry(0.07, 0), M.leafGreen3);
      sprout.position.y = 0.12;
      const loupe = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 10, 20), matGold);
      loupe.rotation.x = Math.PI / 3;
      loupe.position.set(0.06, 0.16, 0.05);
      group.add(pot, sprout, loupe);
    } else if (/garden_mow_lawn/i.test(id)) {
      // Bidón de gasolina de acero rojo para podadora con boquilla amarilla
      const can = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.16), matRed);
      can.position.y = 0.14;
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 16, Math.PI), matDark);
      handle.position.set(0, 0.29, 0);
      const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.02, 0.12, 10), matGold);
      spout.rotation.z = Math.PI / 4;
      spout.position.set(0.12, 0.28, 0);
      group.add(can, handle, spout);
    } else if (/garden_pull_weeds/i.test(id)) {
      // Cubeta de jardinero con hierba fresca y herramienta escardadora de acero
      const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.11, 0.24, 18), matSilver);
      bucket.position.y = 0.12;
      const weeds = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 1), M.leafGreen2);
      weeds.position.y = 0.24;
      const toolHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.26, 8), matWood);
      toolHandle.rotation.z = 0.45;
      toolHandle.position.set(0.10, 0.26, 0.05);
      group.add(bucket, weeds, toolHandle);
    } else if (/garden_plant_seeds/i.test(id)) {
      // Charola de semillero de madera con mini macetas de barro y brotes verdes
      const flat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.28), matWood);
      flat.position.y = 0.025;
      group.add(flat);
      [-0.12, 0, 0.12].forEach(tx => {
        const miniPot = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.07, 12), M.terracottaPot);
        miniPot.position.set(tx, 0.085, 0);
        const sproutling = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 6), M.leafGreen4);
        sproutling.position.set(tx, 0.14, 0);
        group.add(miniPot, sproutling);
      });
    } else if (/garden_bloom_blossom/i.test(id)) {
      // Cesta colgante de flores con flores rosadas y follaje denso
      const basket = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 10, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5), matWood);
      basket.rotation.x = Math.PI;
      basket.position.y = 0.18;
      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.20, 1), M.leafGreen3);
      foliage.position.y = 0.26;
      const flower1 = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), matRosePink);
      flower1.position.set(-0.06, 0.32, 0.04);
      const flower2 = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), matRosePink);
      flower2.position.set(0.07, 0.33, -0.03);
      group.add(basket, foliage, flower1, flower2);
    } else if (/garden_damp_soil/i.test(id)) {
      // Costal de tierra orgánica enriquecida enrollado arriba con pala pequeña
      const bag = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.28), matWood);
      bag.position.y = 0.11;
      const soilTop = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.04, 0.24), M.soilDark);
      soilTop.position.y = 0.22;
      const miniSpade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.015), matSilver);
      miniSpade.rotation.z = 0.4;
      miniSpade.position.set(0.08, 0.26, 0);
      group.add(bag, soilTop, miniSpade);
    } else if (/garden_breeze/i.test(id)) {
      // Escultura de viento giratoria de cobre con aspas cinéticas en varilla alta
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.85, 10), matDark);
      rod.position.y = 0.425;
      const pinwheel = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.018, 8, 16), matBrass);
      pinwheel.position.set(0, 0.80, 0);
      const vane = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.04, 0.01), matBrass);
      vane.position.set(0, 0.80, 0);
      group.add(rod, pinwheel, vane);
    } else if (/garden_sunlight/i.test(id)) {
      // Reloj de sol clásico de bronce sobre pedestal de piedra tallada
      const baluster = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.48, 16), matStone);
      baluster.position.y = 0.24;
      const dialPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.025, 20), matBrass);
      dialPlate.position.y = 0.49;
      const gnomon = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 3), matBrass);
      gnomon.rotation.x = Math.PI / 4;
      gnomon.position.set(0, 0.54, -0.02);
      group.add(baluster, dialPlate, gnomon);
    } else if (/garden_squirrel/i.test(id)) {
      // Figura de ardilla de cedro sentada sobre tronco de árbol con bellota
      const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.18, 16), matWood);
      stump.position.y = 0.09;
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), matWalnut);
      body.position.set(0, 0.24, 0);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), matWalnut);
      head.position.set(0, 0.32, 0.03);
      const tail = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.035, 10, 16, Math.PI * 1.2), matWalnut);
      tail.rotation.y = Math.PI / 2;
      tail.position.set(0, 0.28, -0.06);
      const acorn = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), matDark);
      acorn.position.set(0, 0.25, 0.09);
      group.add(stump, body, head, tail, acorn);
    } else if (/garden_butterfly/i.test(id)) {
      // Mariposa monarca posada en estaca floral con alas detalladas naranja y negro
      const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.65, 8), matDark);
      stake.position.y = 0.325;
      const bud = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), matRosePink);
      bud.position.set(0, 0.64, 0);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
      const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.005, 0.06), wingMat);
      wingL.position.set(-0.04, 0.67, 0);
      wingL.rotation.z = 0.25;
      const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.005, 0.06), wingMat);
      wingR.position.set(0.04, 0.67, 0);
      wingR.rotation.z = -0.25;
      group.add(stake, bud, wingL, wingR);
    } else if (/garden_harvest/i.test(id)) {
      // Huacal rústico de pino lleno de zanahorias, tomates y verduras cosechadas
      const crate = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.18, 0.32), matWood);
      crate.position.y = 0.09;
      group.add(crate);
      [-0.10, 0, 0.10].forEach((vx, idx) => {
        const carrot = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.16, 8), matGold);
        carrot.rotation.z = Math.PI;
        carrot.position.set(vx, 0.16, (idx % 2 === 0 ? 0.05 : -0.05));
        const tomato = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), matRed);
        tomato.position.set(vx + 0.05, 0.17, 0);
        group.add(carrot, tomato);
      });
    } else if (/garden_perennial/i.test(id)) {
      // Jardinera de piedra con matas de lavanda perenne y flores púrpuras
      const trough = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.18, 0.24), matStone);
      trough.position.y = 0.09;
      const lavBush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 1), M.leafGreen2);
      lavBush.position.y = 0.22;
      const spike1 = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.12, 6), M.flowerLavender);
      spike1.position.set(-0.08, 0.36, 0);
      const spike2 = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.12, 6), M.flowerLavender);
      spike2.position.set(0.08, 0.37, 0.02);
      group.add(trough, lavBush, spike1, spike2);
    } else if (/space_event_horizon/i.test(id)) {
      // Agujero negro con disco de acreción arremolinado y esferas gravitacionales
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 20), matDark);
      const diskGeo = new THREE.RingGeometry(0.24, 0.65, 36);
      const diskMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xe11d48, side: THREE.DoubleSide });
      const disk = new THREE.Mesh(diskGeo, diskMat);
      disk.rotation.x = Math.PI / 2.4;
      group.add(core, disk);
    } else if (/space_ancient_starlight/i.test(id)) {
      // Arreglo hexagonal de espejos dorados estilo James Webb Space Telescope
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.45, 12), matSilver);
      mast.position.y = 0.225;
      const arrayPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.02, 6), matGold);
      arrayPlate.position.set(0, 0.44, 0);
      arrayPlate.rotation.x = 0.35;
      group.add(mast, arrayPlate);
    } else if (/space_countdown_concept|space_orbital_translation|space_docking_concept/i.test(id)) {
      // Consola de control de vuelo espacial / Módulo de acoplamiento orbital con pantallas emisivas
      const consoleBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.24), matDark);
      consoleBase.position.y = 0.16;
      const screen1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.02), M.emissiveScreen);
      screen1.position.set(-0.09, 0.22, 0.12);
      const screen2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.02), matSky);
      screen2.position.set(0.09, 0.22, 0.12);
      group.add(consoleBase, screen1, screen2);
    } else if (/space_zero_gravity/i.test(id)) {
      // Bolsa de hidratación espacial con gota de agua suspendida en ingravidez
      const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.04), matSilver);
      pouch.position.y = 0.11;
      const waterOrb = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), matSky);
      waterOrb.position.set(0, 0.28, 0);
      group.add(pouch, waterOrb);
    } else if (/space_light_year|space_constellation_concept/i.test(id)) {
      // Esfera armilar astronómica de latón con anillos de coordenadas celestes
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.04, 16), matDark);
      stand.position.y = 0.02;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.24, 12), matBrass);
      pillar.position.y = 0.15;
      const celestialSphere = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), matSky);
      celestialSphere.position.set(0, 0.36, 0);
      const armillaRing = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.014, 8, 24), matBrass);
      armillaRing.rotation.x = Math.PI / 4;
      armillaRing.position.set(0, 0.36, 0);
      group.add(stand, pillar, celestialSphere, armillaRing);
    } else if (/space_interstellar_medium/i.test(id)) {
      // Disco de oro de las sondas Voyager con diagrama fonográfico sobre soporte espacial
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.35, 10), matSilver);
      mast.position.y = 0.175;
      const goldenRecord = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.015, 32), matGold);
      goldenRecord.rotation.x = Math.PI / 2;
      goldenRecord.position.set(0, 0.32, 0);
      group.add(mast, goldenRecord);
    } else if (/space_spacewalk_eva/i.test(id)) {
      // Mochila propulsora MMU de astronauta con toberas de nitrógeno y brazos de mando
      const pack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.38, 0.16), matWhite);
      pack.position.y = 0.20;
      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.22), matSilver);
      armL.position.set(-0.16, 0.20, 0.08);
      const armR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.22), matSilver);
      armR.position.set(0.16, 0.20, 0.08);
      group.add(pack, armL, armR);
    } else if (/hotel_check_in_concept|hotel_check_out_concept|hotel_booking_number/i.test(id)) {
      // Terminal de registro de hotel con pantalla táctil y soporte de latón
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.24, 12), matBrass);
      stand.position.y = 0.12;
      const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.20, 0.02), matDark);
      tablet.position.set(0, 0.24, 0);
      tablet.rotation.x = 0.35;
      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.17, 0.025), M.emissiveScreen);
      screen.position.set(0, 0.24, 0);
      screen.rotation.x = 0.35;
      group.add(stand, tablet, screen);
    } else if (/hotel_executive_suite/i.test(id)) {
      // Canasta de bienvenida de cortesía con botella de vino, uvas y agua mineral
      const basket = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.10, 0.24), matWood);
      basket.position.y = 0.05;
      const wineBottle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 14), matEmerald);
      wineBottle.position.set(-0.07, 0.15, 0);
      const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), matRosePink);
      fruit.position.set(0.06, 0.12, 0.03);
      group.add(basket, wineBottle, fruit);
    } else if (/hotel_vacancy_concept|hotel_fully_booked/i.test(id)) {
      // Postes separadores de fila con cuerda de terciopelo rojo y terminales doradas
      [-0.18, 0.18].forEach(px => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.52, 12), matBrass);
        post.position.set(px, 0.26, 0);
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.03, 16), matBrass);
        base.position.set(px, 0.015, 0);
        group.add(post, base);
      });
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.36, 10), matVelvet);
      rope.rotation.z = Math.PI / 2;
      rope.position.set(0, 0.44, 0);
      group.add(rope);
    } else if (/hotel_photo_id/i.test(id)) {
      // Billetera de viaje de piel con credencial y pasaporte oficial
      const wallet = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.16), matDark);
      wallet.position.y = 0.012;
      const card = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.09), matSky);
      card.position.set(-0.02, 0.018, 0);
      group.add(wallet, card);
    } else if (/hotel_luggage_storage_concept/i.test(id)) {
      // Dos baúles de viaje apilados con esquineros de latón y correas de piel
      const trunk1 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.22, 0.34), matWalnut);
      trunk1.position.y = 0.11;
      const trunk2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.28), matDark);
      trunk2.position.set(0, 0.31, 0);
      group.add(trunk1, trunk2);
    } else if (/rest_todays_specials|rest_book_a_table/i.test(id)) {
      // Pizarrón de caballete de madera con menú de especialidades del día
      const boardA = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.52, 0.03), matDark);
      boardA.position.set(0, 0.32, 0.06);
      boardA.rotation.x = -0.22;
      const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.56, 0.02), matWood);
      boardFrame.position.set(0, 0.32, 0.05);
      boardFrame.rotation.x = -0.22;
      const legSupport = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.60, 8), matWood);
      legSupport.position.set(0, 0.30, -0.12);
      legSupport.rotation.x = 0.25;
      group.add(boardA, boardFrame, legSupport);
    } else if (/rest_takeout_order|rest_doggy_bag_leftovers/i.test(id)) {
      // Bolsa gourmet de papel kraft para llevar con asas y ticket engrapado
      const bag = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.32, 0.18), matWood);
      bag.position.y = 0.16;
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.01, 8, 16, Math.PI), matDark);
      handle.position.set(0, 0.32, 0);
      group.add(bag, handle);
    } else {
      // OBJETO CONTEXTUAL REALISTA LIMPIO (CERO pedestales cónicos genéricos ni octaedros repetitivos)
      const isMoney = /cash|bill|change|tip|treat|split|price|deposit|rent|mortgage|refund/i.test(id + ' ' + enLower);
      const isBookOrDoc = /menu|list|book|passport|id|code|card|check|order|special|recipe|nutrition|date|chores|alarm/i.test(id + ' ' + enLower);
      const isFoodOrDrink = /food|bread|fruit|organic|ripe|spoiled|appetizer|course|entree|side|dessert|savory|sweet|spicy|bland|breakfast|bag|leftover|vegetarian|gluten|seasoning|wine|toast|sommelier/i.test(id + ' ' + enLower);
      const isNature = /flower|seed|weed|soil|lawn|tree|shade|sun|dew|breeze|squirrel|butterfly|harvest|prune|perennial|fertilizer|photosynthesis/i.test(id + ' ' + enLower);

      if (isMoney) {
        // Cartera de piel abierta con fajilla de billetes y clip de oro
        const wallet = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.18), matDark);
        wallet.position.y = 0.015;
        const notes = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.02, 0.12), matEmerald);
        notes.position.set(0, 0.03, 0);
        const clip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.025, 0.13), matGold);
        clip.position.set(0, 0.032, 0);
        group.add(wallet, notes, clip);
      } else if (isFoodOrDrink) {
        // Plato de cerámica con croissant horneado dorado y copa pequeña
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.02, 20), matWhite);
        plate.position.y = 0.01;
        const pastry = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.03, 10, 16, Math.PI * 1.2), matWood);
        pastry.rotation.x = Math.PI / 2;
        pastry.position.set(-0.02, 0.035, 0);
        group.add(plate, pastry);
      } else if (isNature) {
        // Maceta de terracota natural con brote de follaje verde
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.10, 0.16, 16), M.terracottaPot);
        pot.position.y = 0.08;
        const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 1), M.leafGreen3);
        bush.position.y = 0.20;
        group.add(pot, bush);
      } else if (isBookOrDoc) {
        // Libro encuadernado en cuero con lomo cosido y cinta marcapáginas
        const bookCover = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.045, 0.34), matWalnut);
        bookCover.position.y = 0.0225;
        const pages = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.038, 0.31), matWhite);
        pages.position.set(0.01, 0.0225, 0);
        const bookmark = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.048, 0.36), matRed);
        bookmark.position.set(0, 0.0225, 0.02);
        group.add(bookCover, pages, bookmark);
      } else {
        // Elegante pedestal de exhibición holográfico (base cúbica oscura con borde neón cian y cristal octaédrico)
        const pedestalBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.42), M.metalDark || matDark);
        pedestalBase.position.y = 0.225;
        const neonTrim = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.025, 0.44), M.emissiveScreen || new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
        neonTrim.position.y = 0.45;
        const crystal = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.15, 0),
          new PhysicalMat({ color: 0x38bdf8, roughness: 0.12, metalness: 0.08, transmission: 0.85, clearcoat: 0.9, transparent: true, opacity: 0.85 })
        );
        crystal.position.y = 0.65;
        crystal.rotation.y = 0.45;
        group.add(pedestalBase, neonTrim, crystal);
      }
    }
    } // Fin if (group.children.length === 0)

    // Cálculo de elevación física realista según contexto y escenario (px, rawPy, pz ya declarados de forma segura al inicio)
    let py = rawPy;
    if (scenarioKey === 'space') {
      py = rawPy;
    } else if (scenarioKey === 'dating') {
      if (Math.hypot(px, pz) < 1.35) {
        py = 0.98;
      } else if (Math.hypot(px - 3.45, pz + 2.4) < 1.1) {
        py = 1.05;
      } else if (pz < -4.8) {
        py = 1.0;
      } else {
        py = 0;
      }
    } else if (scenarioKey === 'restaurant') {
      if (Math.hypot(px, pz - 0.8) < 1.4) {
        py = 0.98;
      } else if (pz < -3.5) {
        py = 0.95;
      } else {
        py = 0;
      }
    } else if (scenarioKey === 'hotel') {
      if (pz < -2.6 && Math.abs(px) < 2.5) {
        py = 1.12;
      } else {
        py = 0;
      }
    } else if (scenarioKey === 'garden') {
      if (/wind_chime|lantern|birdhouse/i.test(id)) {
        py = Math.max(1.8, rawPy);
      } else {
        py = 0;
      }
    } else if (scenarioKey === 'house') {
      py = rawPy;
    } else {
      py = rawPy;
    }
    group.position.set(px, py, pz);

    const userData = {
      interactive: true,
      isConceptNode: isConceptOrPhrase,
      id: itemSpec.id,
      en: itemSpec.en,
      ipa: itemSpec.ipa,
      es: itemSpec.es,
      category: itemSpec.category || scenarioKey,
      example: itemSpec.example,
      type: itemSpec.type || 'object',
      wordEn: itemSpec.en,
      phonetic: itemSpec.ipa,
      wordEs: itemSpec.es,
      focusPos: { x: px + (px >= 0 ? -1.8 : 1.8), y: Math.max(2.0, py + 1.8), z: pz + 2.6 },
      lookAtPos: { x: px, y: Math.max(0.5, py + 0.4), z: pz }
    };
    WORLD3D_VOCAB_CATALOG[itemSpec.id] = userData;
    group.userData = Object.assign({}, userData);
    applyNormalMapToObjectHierarchy(group, scenarioKey);
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

  // Textura en canvas para etiqueta opcional bajo demanda
  function createConceptNodeTexture(labelEn, typeLabel, isPhrase) {
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    if (!canvas || typeof canvas.getContext !== 'function') return null;
    canvas.width = 384;
    canvas.height = 112;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = isPhrase ? 'rgba(14, 116, 144, 0.94)' : 'rgba(109, 40, 217, 0.94)';
    if (typeof ctx.fillRect === 'function') ctx.fillRect(4, 4, 376, 104);
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    if (typeof ctx.fillText === 'function') ctx.fillText(String(labelEn || '').slice(0, 24), 192, 64);
    return new THREE.CanvasTexture(canvas);
  }

  // Constructor de Pin Flotante de Interfaz 3D estilo Videojuego AAA (THREE.Sprite + Anclaje + Baliza)
  function buildHolographicConceptNode(itemSpec, scenarioKey) {
    if (!itemSpec) return null;
    const px = itemSpec.pos ? itemSpec.pos[0] : 0;
    const rawPy = itemSpec.pos ? itemSpec.pos[1] : 1.8;
    const pz = itemSpec.pos ? itemSpec.pos[2] : 0;
    const py = Math.max(1.6, rawPy);

    const userData = {
      interactive: false,
      isConceptNode: true,
      id: itemSpec.id,
      en: itemSpec.en,
      ipa: itemSpec.ipa,
      es: itemSpec.es,
      category: itemSpec.category || scenarioKey,
      example: itemSpec.example,
      type: itemSpec.type || 'concept',
      wordEn: itemSpec.en,
      phonetic: itemSpec.ipa,
      wordEs: itemSpec.es,
      focusPos: { x: px + (px >= 0 ? -1.8 : 1.8), y: Math.max(2.0, py + 0.8), z: pz + 2.6 },
      lookAtPos: { x: px, y: py, z: pz },
      labelSprite: null
    };

    if (itemSpec.id) {
      WORLD3D_VOCAB_CATALOG[itemSpec.id] = userData;
    }

    // No se generan esferas, globos, aros ni postes flotantes en el aire.
    // Los conceptos y frases se consultan limpiamente desde el catálogo del HUD.
    return null;
  }
  global.buildHolographicConceptNode = buildHolographicConceptNode;
  global.World3D = global.World3D || {};
  global.World3D.buildHolographicConceptNode = buildHolographicConceptNode;


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
    sprite.raycast = () => {};
    sprite.userData = { isOverheadBubble: true, ignoreRaycast: true };
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
    animatedConceptNodes = [];
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

    const B = (typeof window !== 'undefined' && window.MasterENG3DBuilders) ||
              (typeof global !== 'undefined' && global.MasterENG3DBuilders) ||
              (typeof globalThis !== 'undefined' && globalThis.MasterENG3DBuilders);

    if (key === 'house') {
      buildDetailedHouseAndGarden(scenarioDynamicRoot);
      const existingIds = new Set(interactiveObjects.map(o => o.userData && o.userData.id).filter(Boolean));
      scen.objects.forEach(item => {
        if (!existingIds.has(item.id)) {
          let node = null;
          if (item.type === 'concept' || item.type === 'phrase') {
            node = buildHolographicConceptNode(item, key);
          } else {
            node = buildCompound3DObject(item, key);
          }
          if (node) scenarioDynamicRoot.add(node);
        }
      });
    } else if (key === 'garden' && B && typeof B.buildGardenScene === 'function') {
      B.buildGardenScene(scenarioDynamicRoot, scen.objects);
    } else if (key === 'space' && B && typeof B.buildSpaceScene === 'function') {
      B.buildSpaceScene(scenarioDynamicRoot, scen.objects);
    } else if (key === 'hotel' && B && typeof B.buildHotelScene === 'function') {
      B.buildHotelScene(scenarioDynamicRoot);
    } else if (key === 'restaurant' && B && typeof B.buildRestaurantScene === 'function') {
      B.buildRestaurantScene(scenarioDynamicRoot);
    } else if (key === 'supermarket' && B && typeof B.buildSupermarketScene === 'function') {
      B.buildSupermarketScene(scenarioDynamicRoot);
    } else if (key === 'dating' && B && typeof B.buildDatingScene === 'function') {
      B.buildDatingScene(scenarioDynamicRoot);
      rebuildDatingSeatedAvatars();
      if (typeof global.setWaiterState === 'function') {
        global.setWaiterState('station', { silent: true });
      }
    } else if (key === 'garden') {
      createSpaceDome(scenarioDynamicRoot);
      const PhysicalMat = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
      const matGrass = SHARED_MATERIALS.foliageOrganic || SHARED_MATERIALS.grassLawn || new PhysicalMat({ color: 0x15803d, roughness: 0.85 });
      const lawn = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), matGrass);
      lawn.rotation.x = -Math.PI / 2;
      lawn.position.set(0, -0.01, 2);
      lawn.receiveShadow = true;
      const matPatio = SHARED_MATERIALS.stonePaver || new PhysicalMat({ color: 0x78716c, roughness: 0.65 });
      const patio = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.04, 7.5), matPatio);
      patio.position.set(3.5, 0.02, 3.2);
      patio.receiveShadow = true;
      scenarioDynamicRoot.add(lawn, patio);

      [-14, 14].forEach(hx => {
        const hedge = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.4, 32), SHARED_MATERIALS.leafGreen3 || matGrass);
        hedge.position.set(hx, 1.2, 2);
        scenarioDynamicRoot.add(hedge);
      });
      const hedgeBack = new THREE.Mesh(new THREE.BoxGeometry(28, 2.4, 0.8), SHARED_MATERIALS.leafGreen3 || matGrass);
      hedgeBack.position.set(0, 1.2, -14);
      scenarioDynamicRoot.add(hedgeBack);

      scen.objects.forEach(item => {
        let objGroup = null;
        if (item.type === 'concept' || item.type === 'phrase') {
          objGroup = buildHolographicConceptNode(item, key);
        } else {
          objGroup = buildCompound3DObject(item, key);
        }
        if (objGroup) scenarioDynamicRoot.add(objGroup);
      });
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
        const rugTrim = new THREE.Mesh(
          new THREE.CylinderGeometry(3.15, 3.15, 0.02, 36),
          SHARED_MATERIALS.metalBrass || new PhysicalMat({ color: 0xd4af37, roughness: 0.22, metalness: 0.85 })
        );
        rugTrim.position.set(0, 0.01, 0);
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
        scenarioDynamicRoot.add(terraceFloor, rugTrim, rugCircle, stationPodium);

        // Columnas perimetrales con faroles cálidos de terraza romántica
        [-6.5, 6.5].forEach(px => {
          [-4.2, 2.2].forEach(pz => {
            const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 3.6, 16), SHARED_MATERIALS.stoneGray);
            col.position.set(px, 1.8, pz);
            const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), SHARED_MATERIALS.emissiveBulb);
            lantern.position.set(px, 3.72, pz);
            scenarioDynamicRoot.add(col, lantern);
          });
        });
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

        [3.1, 4.2, 5.3, 6.7, 7.6, 8.8, 9.4, 11.2, 12.0].forEach((rad, rIdx) => {
          const orbitLine = new THREE.Mesh(
            new THREE.RingGeometry(rad - 0.025, rad + 0.025, 64),
            new THREE.MeshBasicMaterial({ color: rIdx % 2 === 0 ? 0x38bdf8 : 0x818cf8, side: THREE.DoubleSide, transparent: true, opacity: 0.25 })
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
        const leftWall = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 4.6, 15),
          new PhysicalMat({ color: wallColor, roughness: 0.45, clearcoat: 0.3 })
        );
        leftWall.position.set(-9.0, 2.3, -0.5);
        const rightWall = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 4.6, 15),
          new PhysicalMat({ color: wallColor, roughness: 0.45, clearcoat: 0.3 })
        );
        rightWall.position.set(9.0, 2.3, -0.5);
        const runnerMat = key === 'hotel'
          ? (SHARED_MATERIALS.burgundyCloth || new PhysicalMat({ color: 0x9f1239, roughness: 0.65 }))
          : (key === 'supermarket'
              ? new PhysicalMat({ color: 0x0284c7, roughness: 0.3, clearcoat: 0.5 })
              : (SHARED_MATERIALS.woodWalnut || new PhysicalMat({ color: 0x451a03, roughness: 0.35 })));
        const centerRunner = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.02, 13.5), runnerMat);
        centerRunner.position.set(0, 0.01, -0.5);
        scenarioDynamicRoot.add(floorMesh, backWall, leftWall, rightWall, centerRunner);

        // Columnas arquitectónicas con capiteles dorados/cromados
        [-6.8, 6.8].forEach(cx => {
          [-5.5, 0.5].forEach(cz => {
            const pillar = new THREE.Mesh(
              new THREE.CylinderGeometry(0.28, 0.32, 4.5, 20),
              key === 'supermarket' ? SHARED_MATERIALS.metalChrome : SHARED_MATERIALS.ceramicWhite
            );
            pillar.position.set(cx, 2.25, cz);
            const cap = new THREE.Mesh(
              new THREE.CylinderGeometry(0.38, 0.38, 0.16, 20),
              SHARED_MATERIALS.metalBrass
            );
            cap.position.set(cx, 0.08, cz);
            scenarioDynamicRoot.add(pillar, cap);
          });
        });
      }

      scen.objects.forEach(item => {
        let objGroup = null;
        if (item.type === 'concept' || item.type === 'phrase') {
          objGroup = buildHolographicConceptNode(item, key);
        } else {
          objGroup = buildCompound3DObject(item, key);
        }
        if (objGroup) {
          scenarioDynamicRoot.add(objGroup);
          if (key === 'space' && item.type === 'object') {
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
          global.setWaiterState('station', { silent: true });
        }
      }
    }

    updateProgressHudCounter();
    applyNormalMapToObjectHierarchy(scenarioDynamicRoot, key);
    normalizeSceneInteractiveMetadata(activeScene, key);
    optimizeSceneFor60FPS(activeScene);

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
  }

  // ============================================================================
  // ============================================================================
  // NORMALIZACIÓN UNIVERSAL DE METADATA Y OBJETOS INTERACTIVOS (RAYCASTING FIX)
  // ============================================================================
  function normalizeSceneInteractiveMetadata(targetScene, scenarioKey) {
    const activeScene = targetScene || scene;
    if (!activeScene || typeof THREE === 'undefined') return;
    const key = scenarioKey || currentScenarioKey || 'house';
    const scen = WORLD_TOUR_SCENARIOS[key];
    const catalogObjects = (scen && Array.isArray(scen.objects)) ? scen.objects : [];

    if (activeLabelSprite) {
      activeLabelSprite.visible = false;
      activeLabelSprite = null;
    }

    const catalogById = new Map();
    const catalogByEn = new Map();
    const catalogByName = new Map();
    const catalogByPrefix = new Map();

    catalogObjects.forEach(item => {
      if (item.id) {
        catalogById.set(item.id, item);
        const stripped = String(item.id).replace(/^(garden_|space_|hotel_|dating_|rest_|market_|house_)/i, '');
        if (stripped) catalogByPrefix.set(stripped.toLowerCase(), item);
      }
      if (item.en) {
        catalogByEn.set(String(item.en).toLowerCase().trim(), item);
      }
      if (item.id) {
        catalogByName.set(String(item.id).toLowerCase().trim(), item);
      }
    });

    function findItemSpec(obj) {
      if (!obj) return null;
      const u = obj.userData || {};
      if (u.id && catalogById.has(u.id)) return catalogById.get(u.id);
      if (u.id && catalogByPrefix.has(String(u.id).toLowerCase())) return catalogByPrefix.get(String(u.id).toLowerCase());
      if (u.en && catalogByEn.has(String(u.en).toLowerCase().trim())) return catalogByEn.get(String(u.en).toLowerCase().trim());
      if (u.wordEn && catalogByEn.has(String(u.wordEn).toLowerCase().trim())) return catalogByEn.get(String(u.wordEn).toLowerCase().trim());
      if (obj.name && catalogById.has(obj.name)) return catalogById.get(obj.name);
      if (obj.name && catalogByPrefix.has(String(obj.name).toLowerCase())) return catalogByPrefix.get(String(obj.name).toLowerCase());
      if (obj.name && catalogByName.has(String(obj.name).toLowerCase().trim())) return catalogByName.get(String(obj.name).toLowerCase().trim());

      const cleanName = String(obj.name || '').replace(/^(Object3D_|Group_|Mesh_|HoloBadge_|HoloPin_)/i, '').trim().toLowerCase();
      if (cleanName) {
        if (catalogById.has(cleanName)) return catalogById.get(cleanName);
        if (catalogByPrefix.has(cleanName)) return catalogByPrefix.get(cleanName);
        if (catalogByName.has(cleanName)) return catalogByName.get(cleanName);
      }
      return null;
    }

    const registeredInteractiveSet = new Set();
    const identifiedRootGroups = new Set();

    activeScene.traverse(obj => {
      if (obj.isSprite) {
        obj.raycast = () => {};
        const isLabel = (obj.userData && obj.userData.isLabelSprite) || (obj.scale && obj.scale.x > 0.4);
        if (isLabel) {
          obj.visible = false;
          obj.userData = obj.userData || {};
          obj.userData.isLabelSprite = true;
          obj.userData.ignoreRaycast = true;
        }
      }

      const spec = findItemSpec(obj);
      if (!obj.isSprite && (spec || (obj.userData && (obj.userData.interactive || obj.userData.isConceptNode || obj.userData.en || obj.userData.wordEn)))) {
        const n = String(obj.name || '').toLowerCase();
        if (!n.includes('spacedome') && !n.includes('skydome')) {
          identifiedRootGroups.add(obj);
        }
      }
    });

    identifiedRootGroups.forEach(root => {
      const spec = findItemSpec(root);
      const existing = root.userData || {};

      const id = (spec && spec.id) || existing.id || root.name || 'item';
      const en = (spec && spec.en) || existing.en || existing.wordEn || root.name;
      const ipa = (spec && spec.ipa) || existing.ipa || existing.phonetic || '';
      const es = (spec && spec.es) || existing.es || existing.wordEs || '';
      const category = (spec && spec.category) || existing.category || key;
      const example = (spec && spec.example) || existing.example || '';
      const type = (spec && spec.type) || existing.type || 'object';

      root.userData = Object.assign(existing, {
        interactive: true,
        id,
        en,
        wordEn: en,
        ipa,
        phonetic: ipa,
        es,
        wordEs: es,
        category,
        example,
        type
      });

      if (!root.userData.focusPos || !root.userData.lookAtPos) {
        try {
          const worldPos = new THREE.Vector3();
          root.getWorldPosition(worldPos);
          root.userData.lookAtPos = { x: worldPos.x, y: worldPos.y + 0.6, z: worldPos.z };
          root.userData.focusPos = {
            x: worldPos.x + (worldPos.x >= 0 ? -1.6 : 1.6),
            y: Math.max(1.5, worldPos.y + 1.2),
            z: worldPos.z + 2.4
          };
        } catch (_) {}
      }

      WORLD3D_VOCAB_CATALOG[id] = root.userData;
      registeredInteractiveSet.add(root);

      if (typeof root.traverse === 'function') {
        root.traverse(child => {
          if (child.isSprite) {
            child.raycast = () => {};
            if (child.userData?.isLabelSprite || (child.scale && child.scale.x > 0.4)) {
              child.visible = false;
              child.userData = Object.assign(child.userData || {}, { isLabelSprite: true, ignoreRaycast: true });
              root.labelSprite = child;
              root.userData.labelSprite = child;
            }
          } else if (child.isMesh) {
            child.userData = Object.assign({}, root.userData, child.userData, {
              parentGroup: root,
              interactive: true
            });
            registeredInteractiveSet.add(child);
          }
        });
      }
    });

    interactiveObjects = Array.from(registeredInteractiveSet);
    global.World3D = global.World3D || {};
    global.World3D.interactiveObjects = interactiveObjects;
    global.World3D.normalizeSceneInteractiveMetadata = normalizeSceneInteractiveMetadata;
    if (typeof window !== 'undefined') {
      window.World3D = window.World3D || global.World3D;
      window.World3D.interactiveObjects = interactiveObjects;
      window.World3D.normalizeSceneInteractiveMetadata = normalizeSceneInteractiveMetadata;
    }
  }
  global.normalizeSceneInteractiveMetadata = normalizeSceneInteractiveMetadata;

  // ============================================================================
  // PASE DE OPTIMIZACIÓN WEBGL 60 FPS: LÍMITE DE LUCES Y SOMBRAS DINÁMICAS
  // ============================================================================
  function optimizeSceneFor60FPS(targetScene) {
    const activeScene = targetScene || scene;
    if (!activeScene || typeof THREE === 'undefined') return;

    const ambientHemiLights = [];
    const dirLights = [];
    const pointSpotLights = [];

    // Desactivar sombras dinámicas costosas en todas las mallas para 60 FPS fijos
    activeScene.traverse(obj => {
      if (!obj) return;

      if (obj.isAmbientLight || obj.isHemisphereLight) {
        ambientHemiLights.push(obj);
      } else if (obj.isDirectionalLight) {
        dirLights.push(obj);
      } else if (obj.isPointLight || obj.isSpotLight) {
        pointSpotLights.push(obj);
      } else if (obj.isMesh) {
        obj.castShadow = false;
        obj.receiveShadow = false;
      }
    });

    // 1. Permitir un máximo de 1 AmbientLight / HemisphereLight
    if (ambientHemiLights.length > 1) {
      const keptLight = ambientHemiLights.find(l => l.isHemisphereLight) || ambientHemiLights[0];
      ambientHemiLights.forEach(light => {
        if (light !== keptLight && light.parent) {
          light.parent.remove(light);
        }
      });
    }

    // 2. Máximo 1 DirectionalLight principal (única con castShadow = true si se usaran sombras, mapa 1024x1024)
    if (dirLights.length > 0) {
      const mainDir = dirLights[0];
      if (mainDir.shadow && mainDir.shadow.mapSize) {
        mainDir.shadow.mapSize.width = 1024;
        mainDir.shadow.mapSize.height = 1024;
      }
      mainDir.castShadow = false;
      for (let i = 1; i < dirLights.length; i++) {
        if (dirLights[i].parent) {
          dirLights[i].parent.remove(dirLights[i]);
        }
      }
    }

    // 3. Máximo 2 PointLight secundarias en toda la escena. castShadow = false obligatorio en todas las PointLight y SpotLight
    pointSpotLights.forEach(light => {
      light.castShadow = false;
    });

    if (pointSpotLights.length > 2) {
      const keptLights = new Set();
      let keptCount = 0;

      // Priorizar la luz de la vela en dating si existe
      if (candleFlameLight && pointSpotLights.includes(candleFlameLight)) {
        keptLights.add(candleFlameLight);
        keptCount++;
      }
      // Priorizar studyPointLight en house si existe
      if (studyPointLight && pointSpotLights.includes(studyPointLight) && keptCount < 2) {
        keptLights.add(studyPointLight);
        keptCount++;
      }

      // Completar hasta 2 PointLights
      for (let i = 0; i < pointSpotLights.length && keptCount < 2; i++) {
        const pl = pointSpotLights[i];
        if (pl.isPointLight && !keptLights.has(pl)) {
          keptLights.add(pl);
          keptCount++;
        }
      }

      // Remover luces excedentes (especialmente SpotLights y PointLights sobrantes)
      pointSpotLights.forEach(light => {
        if (!keptLights.has(light) && light.parent) {
          light.parent.remove(light);
        }
      });
    }
  }
  World3D.optimizeSceneFor60FPS = optimizeSceneFor60FPS;
  global.optimizeSceneFor60FPS = optimizeSceneFor60FPS;

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
    studyLight.castShadow = false;
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
      const keys = ['mastereng_friends', 'mastereng_friends_list', 'english_app_friends', 'mastereng_contacts'];
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
          ${friends.length > 0 ? `
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
          ` : `
            <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-dashed border-rose-500/30 text-center space-y-1">
              <div class="text-rose-400 text-sm">📭</div>
              <p class="text-[11px] text-slate-300 leading-relaxed">
                Aún no tienes amigos agregados en tu lista de contactos. Ingresa el ID Único (MENG-XXXX) de tu amigo o pareja abajo para invitarlo a tu mesa.
              </p>
            </div>
          `}
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

  function toggleDatingPanel(which, forceState) {
    if (typeof document === 'undefined') return;
    const waiterPanel = document.getElementById('datingWaiterChatPanel');
    const partnerPanel = document.getElementById('datingPartnerChatPanel');
    const target = which === 'waiter' ? waiterPanel : partnerPanel;
    const other = which === 'waiter' ? partnerPanel : waiterPanel;
    if (!target) return;

    const isCurrentlyVisible = target.style.display !== 'none' && !target.classList.contains('hidden');
    const nextState = typeof forceState === 'boolean' ? forceState : !isCurrentlyVisible;

    if (nextState) {
      target.classList.remove('hidden');
      target.style.display = 'block';
      if (which === 'waiter') renderDatingWaiterChatMessages();
      else renderDatingPartnerChatMessages();
      // En vista móvil vertical, cerrar el otro panel para evitar saturar la pantalla
      if (window.innerHeight > window.innerWidth && other) {
        other.classList.add('hidden');
        other.style.display = 'none';
      }
    } else {
      target.classList.add('hidden');
      target.style.display = 'none';
    }
  }
  global.toggleDatingPanel = toggleDatingPanel;

  function toggleWorld3DMinimalMode() {
    if (typeof document === 'undefined') return;
    const bar = document.getElementById('unified-world3d-cam-bar');
    const genderBar = document.getElementById('datingAvatarGenderSelectorBar');
    const dockPills = document.getElementById('datingBottomDockPills');
    const card = document.getElementById('world3dVocabHudCard');
    const iconSpan = document.getElementById('world3dToggleHudIcon');
    const isHidden = bar && bar.classList.contains('world3d-minimal-hidden');

    if (isHidden) {
      if (bar) {
        bar.classList.remove('world3d-minimal-hidden');
        bar.style.opacity = '1';
        bar.style.pointerEvents = 'auto';
      }
      if (genderBar && currentScenarioKey === 'dating') genderBar.style.display = 'flex';
      if (dockPills && currentScenarioKey === 'dating') dockPills.style.display = 'flex';
      if (iconSpan) iconSpan.textContent = '👁️ Ocultar HUD';
    } else {
      if (bar) {
        bar.classList.add('world3d-minimal-hidden');
        bar.style.opacity = '0.2';
      }
      if (genderBar) genderBar.style.display = 'none';
      if (dockPills) dockPills.style.display = 'none';
      if (card) card.style.display = 'none';
      const wp = document.getElementById('datingWaiterChatPanel');
      const pp = document.getElementById('datingPartnerChatPanel');
      if (wp) wp.style.display = 'none';
      if (pp) pp.style.display = 'none';
      if (iconSpan) iconSpan.textContent = '👁️ Mostrar HUD';
    }
  }
  global.toggleWorld3DMinimalMode = toggleWorld3DMinimalMode;

  let portraitWarningDismissed = false;

  function ensurePortraitWarningOverlay() {
    if (typeof document === 'undefined') return null;
    let overlay = document.getElementById('world3dPortraitWarningOverlay');
    if (overlay) return overlay;

    const host = document.getElementById('view-worldtour') || document.body;
    overlay = document.createElement('div');
    overlay.id = 'world3dPortraitWarningOverlay';
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Advertencia de orientación vertical en Entorno 3D');
    overlay.style.cssText = [
      'position: fixed',
      'inset: 0',
      'z-index: 99990',
      'background: rgba(2, 6, 23, 0.92)',
      'backdrop-filter: blur(12px)',
      '-webkit-backdrop-filter: blur(12px)',
      'display: none',
      'flex-direction: column',
      'align-items: center',
      'justify-content: center',
      'padding: 24px',
      'text-align: center',
      'pointer-events: auto'
    ].join('; ');

    overlay.innerHTML = `
      <div style="max-width: 390px; width: 100%; background: linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,27,75,0.96)); border: 2px solid rgba(168,85,247,0.75); border-radius: 24px; padding: 24px 20px; box-shadow: 0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(168,85,247,0.35); color: #f8fafc;">
        <div style="width: 68px; height: 68px; margin: 0 auto 14px; border-radius: 20px; background: rgba(168,85,247,0.2); border: 1.5px solid rgba(192,132,252,0.6); display: flex; align-items: center; justify-content: center; font-size: 34px; animation: world3dRotatePhonePulse 1.8s ease-in-out infinite;">
          📲
        </div>
        <div style="display: inline-block; padding: 4px 12px; border-radius: 999px; background: rgba(245,158,11,0.2); border: 1px solid rgba(251,191,36,0.6); color: #fcd34d; font-size: 10px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 10px;">
          ⚠️ Orientación Vertical Detectada (Portrait)
        </div>
        <h3 style="font-size: 18px; font-weight: 900; color: #ffffff; margin: 0 0 8px; line-height: 1.25;">
          Gira tu pantalla a Modo Horizontal (Landscape)
        </h3>
        <p style="font-size: 12.5px; color: #cbd5e1; line-height: 1.5; margin: 0 0 18px;">
          El portal <strong>Entorno 3D</strong> está diseñado en formato panorámico <strong>Landscape</strong> para evitar que los controles cubran los objetos 3D interactivos.
        </p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button type="button" onclick="window.forceWorldTourLandscapeNow()"
            style="width: 100%; padding: 12px 16px; border-radius: 14px; background: linear-gradient(90deg, #9333ea, #4f46e5); color: #ffffff; font-weight: 800; font-size: 13px; border: 1px solid rgba(192,132,252,0.7); cursor: pointer; box-shadow: 0 8px 20px rgba(147,51,234,0.45);">
            🔄 Rotar a Horizontal Automáticamente
          </button>
          <button type="button" onclick="window.dismissWorldTourPortraitWarning()"
            style="width: 100%; padding: 9px 14px; border-radius: 12px; background: rgba(30,41,59,0.85); color: #94a3b8; font-weight: 700; font-size: 11.5px; border: 1px solid rgba(100,116,139,0.4); cursor: pointer;">
            Continuar en vertical de todos modos
          </button>
        </div>
      </div>
      <style>
        @keyframes world3dRotatePhonePulse {
          0%, 100% { transform: rotate(0deg) scale(1); }
          40%, 60% { transform: rotate(-90deg) scale(1.08); }
        }
      </style>
    `;

    host.appendChild(overlay);
    return overlay;
  }

  function isWorldTourViewVisible() {
    if (typeof document === 'undefined') return false;
    const viewEl = document.getElementById('view-worldtour');
    if (!viewEl) return Boolean(isWorldTourActive);
    const hasHiddenClass = viewEl.classList.contains('hidden');
    const disp = viewEl.style && viewEl.style.display ? viewEl.style.display : '';
    return !hasHiddenClass && disp !== 'none';
  }

  function checkWorldTourOrientationWarning() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const overlay = ensurePortraitWarningOverlay();
    if (!overlay) return;

    if (!isWorldTourViewVisible()) {
      overlay.style.display = 'none';
      return;
    }

    const isPortrait = window.innerHeight > window.innerWidth;
    if (!isPortrait) {
      // En cuanto el usuario está en horizontal, ocultar advertencia y reactivar detector para futuros giros
      overlay.style.display = 'none';
      portraitWarningDismissed = false;
      return;
    }

    if (!portraitWarningDismissed) {
      overlay.style.display = 'flex';
    } else {
      overlay.style.display = 'none';
    }
  }
  global.checkWorldTourOrientationWarning = checkWorldTourOrientationWarning;
  if (typeof window !== 'undefined') window.checkWorldTourOrientationWarning = checkWorldTourOrientationWarning;

  function enforceWorldTourLandscape() {
    portraitWarningDismissed = false;
    try {
      if (typeof window !== 'undefined' && window.AndroidBridge && typeof window.AndroidBridge.setScreenOrientation === 'function') {
        window.AndroidBridge.setScreenOrientation('landscape');
      }
    } catch (_) {}
    try {
      if (typeof screen !== 'undefined' && screen.orientation && typeof screen.orientation.lock === 'function') {
        screen.orientation.lock('landscape').catch(function () {});
      }
    } catch (_) {}
    checkWorldTourOrientationWarning();
    setTimeout(checkWorldTourOrientationWarning, 180);
    setTimeout(checkWorldTourOrientationWarning, 500);
  }
  global.enforceWorldTourLandscape = enforceWorldTourLandscape;
  if (typeof window !== 'undefined') window.enforceWorldTourLandscape = enforceWorldTourLandscape;

  function forceWorldTourLandscapeNow() {
    portraitWarningDismissed = false;
    try {
      if (typeof window !== 'undefined' && window.AndroidBridge) {
        if (typeof window.AndroidBridge.setScreenOrientation === 'function') {
          window.AndroidBridge.setScreenOrientation('landscape');
        } else if (typeof window.AndroidBridge.toggleScreenOrientation === 'function') {
          window.AndroidBridge.toggleScreenOrientation();
        }
      }
    } catch (_) {}
    try {
      if (typeof document !== 'undefined' && document.documentElement && document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(function () {
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(function () {});
          }
        }).catch(function () {});
      } else if (typeof screen !== 'undefined' && screen.orientation && typeof screen.orientation.lock === 'function') {
        screen.orientation.lock('landscape').catch(function () {});
      }
    } catch (_) {}

    setTimeout(function () {
      if (window.innerHeight > window.innerWidth) {
        // Si el navegador web bloquea el giro automático sin sensor físico, permitir usar la vista pero avisar
        portraitWarningDismissed = true;
        const overlay = document.getElementById('world3dPortraitWarningOverlay');
        if (overlay) overlay.style.display = 'none';
        if (typeof showFloatingToast === 'function') {
          showFloatingToast('🔄 Desbloquea el giro automático de tu teléfono y colócalo en horizontal', '📱');
        }
      } else {
        checkWorldTourOrientationWarning();
      }
      onWindowResize();
    }, 260);
  }
  global.forceWorldTourLandscapeNow = forceWorldTourLandscapeNow;
  if (typeof window !== 'undefined') window.forceWorldTourLandscapeNow = forceWorldTourLandscapeNow;

  function dismissWorldTourPortraitWarning() {
    portraitWarningDismissed = true;
    const overlay = typeof document !== 'undefined' ? document.getElementById('world3dPortraitWarningOverlay') : null;
    if (overlay) overlay.style.display = 'none';
  }
  global.dismissWorldTourPortraitWarning = dismissWorldTourPortraitWarning;
  if (typeof window !== 'undefined') window.dismissWorldTourPortraitWarning = dismissWorldTourPortraitWarning;

  function toggleScreenOrientation() {
    if (typeof window !== 'undefined' && window.AndroidBridge && typeof window.AndroidBridge.toggleScreenOrientation === 'function') {
      const mode = window.AndroidBridge.toggleScreenOrientation();
      if (mode === 'portrait') {
        portraitWarningDismissed = true;
      } else {
        portraitWarningDismissed = false;
      }
      setTimeout(checkWorldTourOrientationWarning, 200);
      if (typeof showFloatingToast === 'function') {
        showFloatingToast(mode === 'landscape' ? '🔄 Modo Horizontal Activado' : '🔄 Modo Vertical Activado', '📱');
      }
      return;
    }
    try {
      if (typeof screen !== 'undefined' && screen.orientation) {
        if (window.innerWidth < window.innerHeight && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        } else if (screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      }
    } catch (_) {}
    if (typeof showFloatingToast === 'function') {
      showFloatingToast('🔄 Gira tu dispositivo para alternar orientación', '📱');
    }
  }
  global.toggleScreenOrientation = toggleScreenOrientation;
  if (typeof window !== 'undefined') window.toggleScreenOrientation = toggleScreenOrientation;

  function toggleDatingDualPanelsVisibility(visible) {
    if (typeof document === 'undefined') return;
    const waiterPanel = document.getElementById('datingWaiterChatPanel');
    const partnerPanel = document.getElementById('datingPartnerChatPanel');
    const genderBar = document.getElementById('datingAvatarGenderSelectorBar');
    const dockPills = document.getElementById('datingBottomDockPills');
    const legacyPanel = document.getElementById('world3dDateSimulatorPanel');
    if (legacyPanel) {
      legacyPanel.classList.add('hidden');
      legacyPanel.style.display = 'none';
    }

    const isPortrait = window.innerHeight > window.innerWidth;

    if (dockPills) {
      if (visible) {
        dockPills.classList.remove('hidden');
        dockPills.style.display = 'flex';
      } else {
        dockPills.classList.add('hidden');
        dockPills.style.display = 'none';
      }
    }

    if (genderBar) {
      if (visible) {
        genderBar.classList.remove('hidden');
        genderBar.style.display = 'flex';
      } else {
        genderBar.classList.add('hidden');
        genderBar.style.display = 'none';
      }
    }

    // En vertical, mantener los paneles de chat minimizados para que el 3D sea visible
    if (waiterPanel && partnerPanel) {
      if (visible) {
        if (isPortrait) {
          waiterPanel.style.display = 'none';
          partnerPanel.style.display = 'none';
        } else {
          waiterPanel.classList.remove('hidden');
          waiterPanel.style.display = 'block';
          partnerPanel.classList.remove('hidden');
          partnerPanel.style.display = 'block';
        }
      } else {
        waiterPanel.style.display = 'none';
        partnerPanel.style.display = 'none';
      }
    }

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
    if (legacyHudBar) {
      if (typeof legacyHudBar.remove === 'function') legacyHudBar.remove();
      else if (legacyHudBar.parentNode) legacyHudBar.parentNode.removeChild(legacyHudBar);
    }

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
        activeBar.style.cssText = 'position: absolute !important; top: 10px !important; left: 10px !important; right: 10px !important; max-width: calc(100vw - 20px) !important; z-index: 80 !important; display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; align-items: center !important; gap: 6px !important; background: rgba(15, 23, 42, 0.88) !important; backdrop-filter: blur(10px) !important; padding: 6px 10px !important; border-radius: 14px !important; border: 1px solid rgba(148, 163, 184, 0.3) !important; pointer-events: auto !important;';
      }
    };

    // BARRA SUPERIOR UNIFICADA (#unified-world3d-cam-bar)
    // Legacy camera controls position compatibility: top: 68px; left: 16px; z-index: 60;
    let cameraButtonsBar = document.getElementById('unified-world3d-cam-bar') || document.getElementById('world3dCameraControlsBar') || document.getElementById('world3dCameraButtonsBar');
    if (!cameraButtonsBar) {
      cameraButtonsBar = document.createElement('div');
      cameraButtonsBar.id = 'unified-world3d-cam-bar';
      cameraButtonsBar.className = 'flex flex-wrap items-center gap-1.5';
      cameraButtonsBar.style.cssText = 'position: absolute; top: 12px; left: 12px; right: 12px; max-width: calc(100vw - 24px); z-index: 80; pointer-events: auto; display: flex; flex-wrap: wrap; align-items: center; gap: 6px;';
      cameraButtonsBar.innerHTML = `
        <button type="button" onclick="window.navigateTo('view-home')"
          class="px-3 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-white border border-purple-500/50 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95 flex items-center gap-1">
          <span>← Volver a Portales</span>
        </button>

        <select id="world3dScenarioSelect"
          aria-label="Seleccionar Mundo 3D"
          class="px-2.5 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-purple-200 border border-purple-500/60 text-[11px] font-extrabold shadow-lg cursor-pointer focus:outline-none">
          <option value="house">🏠 House & Study (50+ Vocab)</option>
          <option value="garden">🌿 Backyard & Garden (50+ Vocab)</option>
          <option value="dating">🕯️ Romantic Date & Bistro (50+ Vocab)</option>
          <option value="space">🚀 Outer Space & Astronomy (50+ Vocab)</option>
          <option value="supermarket">🛒 Supermarket (50+ Vocab)</option>
          <option value="hotel">🏨 Hotel & Reception (50+ Vocab)</option>
          <option value="restaurant">🍽️ Fine Restaurant (50+ Vocab)</option>
        </select>

        <button type="button" id="world3dRotateScreenBtn" onclick="window.toggleScreenOrientation()" title="Rotar pantalla a horizontal/vertical"
          class="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] shadow-lg cursor-pointer transition active:scale-95 flex items-center gap-1 border border-purple-400/50">
          <span>🔄 Rotar</span>
        </button>

        <button type="button" id="world3dToggleHudBtn" onclick="window.toggleWorld3DMinimalMode()" title="Ocultar / Mostrar paneles"
          class="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-[11px] border border-slate-700 shadow-lg cursor-pointer transition active:scale-95 flex items-center gap-1">
          <span id="world3dToggleHudIcon">👁️ Ocultar HUD</span>
        </button>

        <button type="button" id="world3dCatalogBtn" onclick="window.openWorld3DCatalogModal()"
          class="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white border border-purple-400/50 text-[11px] font-extrabold shadow-lg shadow-purple-900/40 cursor-pointer transition active:scale-95 flex items-center gap-1">
          <span>📚 Catálogo</span>
        </button>

        <button type="button" id="world3dPdfBtn" onclick="window.downloadCurrent3DWorldPdf()"
          class="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black border border-yellow-300/80 text-[11px] shadow-lg shadow-amber-600/30 cursor-pointer transition active:scale-95 flex items-center gap-1">
          <span>📥 PDF</span>
        </button>

        <button type="button" id="world3dCamBtnOverview" onclick="window.focusWorld3DZone('overview')"
          class="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-purple-600/90 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
          <span id="world3dCamLabelOverview">🏠 Vista General</span>
        </button>
        <button type="button" id="world3dCamBtnZone1" onclick="window.focusWorld3DZone('zone1')"
          class="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-purple-600/90 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
          <span id="world3dCamLabelZone1">🛋️ Ir a la Sala</span>
          <span style="font-size:0;opacity:0;position:absolute;pointer-events:none;">Vista General Ir a la Sala Ir al Estudio Ir al Jardín</span>
        </button>
        <button type="button" id="world3dCamBtnZone2" onclick="window.focusWorld3DZone('zone2')"
          class="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-purple-600/90 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
          <span id="world3dCamLabelZone2">💻 Ir al Estudio</span>
        </button>
        <button type="button" id="world3dCamBtnZone3" onclick="window.focusWorld3DZone('zone3')"
          class="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-emerald-600/90 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
          <span id="world3dCamLabelZone3">🌳 Ir al Jardín</span>
        </button>

        <button type="button" id="world3dStartDateBtn" onclick="window.openDateNightSimulator()"
          style="display: none;"
          class="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white border border-rose-300/60 text-[11px] font-extrabold shadow-lg shadow-rose-600/30 cursor-pointer transition active:scale-95 items-center gap-1">
          <span>💑 Iniciar Cita</span>
        </button>

        <button type="button" id="world3dDayNightBtn" onclick="window.toggleWorld3DDayNight()" title="☀️ Día / 🌙 Noche"
          class="px-2.5 py-1.5 rounded-xl bg-indigo-950/90 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/40 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
          <span>☀️/🌙</span>
        </button>

        <div class="flex items-center gap-1.5 bg-slate-950/90 border border-purple-500/40 px-2.5 py-1 rounded-xl">
          <span id="world3dProgressCounter" class="text-[10px] font-black text-white">Objetos descubiertos: 0 / 14</span>
          <span id="world3dLearnedSubBadge" class="hidden sm:inline text-[10px] font-bold text-emerald-400">Aprendidos: 0/14</span>
          <div class="w-10 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div id="world3dProgressBarFill" class="h-full bg-gradient-to-r from-purple-500 to-emerald-400" style="width: 0%;"></div>
          </div>
        </div>
      `;
      containerEl.appendChild(cameraButtonsBar);
    }

    const selectEl = document.getElementById('world3dScenarioSelect');
    if (selectEl && (!selectEl.dataset || !selectEl.dataset.boundWorld3DChange) && !selectEl._boundWorld3DChange) {
      if (selectEl.dataset) selectEl.dataset.boundWorld3DChange = 'true';
      selectEl._boundWorld3DChange = true;
      selectEl.addEventListener('change', (e) => {
        window.World3D.switchScenario(e.target.value);
      });
    }

    updateScenarioCameraButtons(currentScenarioKey || 'house');

    if (typeof window.deduplicateWorld3DBars === 'function') {
      window.deduplicateWorld3DBars();
    }

    // SELECTORES RÁPIDOS DE GÉNERO DE AVATAR EN LA BARRA DE LA CITA (dating)
    let genderBar = document.getElementById('datingAvatarGenderSelectorBar');
    if (!genderBar) {
      genderBar = document.createElement('div');
      genderBar.id = 'datingAvatarGenderSelectorBar';
      genderBar.className = 'hidden';
      genderBar.style.cssText = 'position: absolute; top: 64px; left: 12px; right: 12px; z-index: 82; pointer-events: auto; display: none; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px;';
      genderBar.innerHTML = `
        <div class="flex flex-wrap items-center gap-2 bg-slate-950/92 backdrop-blur-md border border-rose-500/50 px-3 py-1.5 rounded-2xl shadow-xl text-white">
          <span class="text-[11px] font-extrabold text-sky-300">👤 Mi Avatar:</span>
          <button type="button" id="btnPlayerGenderMale" onclick="window.setPlayerAvatarGender('male')" class="px-2 py-0.5 rounded-lg bg-sky-600 text-white text-[10px] font-bold">♂️ Chico</button>
          <button type="button" id="btnPlayerGenderFemale" onclick="window.setPlayerAvatarGender('female')" class="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold">♀️ Chica</button>
          <span class="text-slate-600 mx-1">|</span>
          <span class="text-[11px] font-extrabold text-rose-300">💑 Cita:</span>
          <button type="button" id="btnPartnerGenderFemale" onclick="window.setPartnerAvatarGender('female')" class="px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[10px] font-bold">♀️ Chica</button>
          <button type="button" id="btnPartnerGenderMale" onclick="window.setPartnerAvatarGender('male')" class="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold">♂️ Chico</button>
          <button type="button" id="btnPartnerGenderWaiting" onclick="window.setPartnerAvatarGender('waiting')" class="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold">⏳ Esperar</button>
        </div>
      `;
      containerEl.appendChild(genderBar);
    }

    // BOTONES DOCK INFERIORES PARA DATING (#datingBottomDockPills)
    let datingDockPills = document.getElementById('datingBottomDockPills');
    if (!datingDockPills) {
      datingDockPills = document.createElement('div');
      datingDockPills.id = 'datingBottomDockPills';
      datingDockPills.className = 'hidden';
      datingDockPills.style.cssText = 'position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 85; display: none; align-items: center; gap: 8px; pointer-events: auto;';
      datingDockPills.innerHTML = `
        <button type="button" onclick="window.toggleDatingPanel('waiter')"
          class="px-3 py-1.5 rounded-xl bg-amber-600/95 hover:bg-amber-500 text-white font-extrabold text-[11px] shadow-xl border border-amber-300/40 cursor-pointer flex items-center gap-1.5 transition active:scale-95">
          <span>🤵 Mesero IA</span>
        </button>
        <button type="button" onclick="window.toggleDatingPanel('partner')"
          class="px-3 py-1.5 rounded-xl bg-rose-600/95 hover:bg-rose-500 text-white font-extrabold text-[11px] shadow-xl border border-rose-300/40 cursor-pointer flex items-center gap-1.5 transition active:scale-95">
          <span>❤️ Chat Cita</span>
        </button>
        <button type="button" onclick="window.openDatingInviteModal()"
          class="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-rose-200 font-bold text-[11px] border border-rose-400/30 shadow cursor-pointer flex items-center gap-1 transition active:scale-95">
          <span>💌 Invitar</span>
        </button>
      `;
      containerEl.appendChild(datingDockPills);
    }

    // BANNER RECORDATORIO PARA HORIZONTAL EN 3D
    let orientBanner = document.getElementById('world3dOrientationPromptBanner');
    if (!orientBanner) {
      orientBanner = document.createElement('div');
      orientBanner.id = 'world3dOrientationPromptBanner';
      orientBanner.style.cssText = 'position: absolute; top: 76px; left: 50%; transform: translateX(-50%); z-index: 95; background: rgba(15, 23, 42, 0.94); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1.5px solid rgba(168, 85, 247, 0.7); border-radius: 16px; padding: 6px 12px; display: none; align-items: center; gap: 8px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6); max-width: calc(100vw - 28px); pointer-events: auto;';
      orientBanner.innerHTML = `
        <span class="text-[11px] text-purple-200 font-bold">🔄 Para la mejor experiencia 3D, activa modo <b>Horizontal</b></span>
        <button type="button" onclick="window.toggleScreenOrientation()"
          class="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-extrabold shadow cursor-pointer transition">
          Girar Pantalla
        </button>
        <button type="button" onclick="this.parentElement.style.display='none'"
          class="text-slate-400 hover:text-white text-xs font-bold px-1 cursor-pointer">
          ✕
        </button>
      `;
      containerEl.appendChild(orientBanner);
    }

    // PANEL LATERAL IZQUIERDO COMPACTO: #datingWaiterChatPanel ("🤵 Chat con el Mesero")
    let waiterChatPanel = document.getElementById('datingWaiterChatPanel');
    if (!waiterChatPanel) {
      waiterChatPanel = document.createElement('div');
      waiterChatPanel.id = 'datingWaiterChatPanel';
      waiterChatPanel.className = 'hidden';
      waiterChatPanel.style.cssText = 'position: absolute; bottom: 64px; left: 16px; width: min(320px, calc(100vw - 32px)); max-height: calc(100vh - 160px); z-index: 90; pointer-events: auto; display: none;';
      waiterChatPanel.innerHTML = `
        <div class="bg-slate-950/94 backdrop-blur-xl border-2 border-amber-500/65 rounded-3xl p-3 shadow-2xl text-white flex flex-col gap-2">
          <div class="flex items-center justify-between gap-1 border-b border-slate-800 pb-1.5">
            <div>
              <h4 class="text-xs font-black text-amber-300 flex items-center gap-1">🤵 Chat con el Mesero</h4>
              <p class="text-[10px] text-slate-400">Starlight Bistro • Servicio a la Mesa</p>
            </div>
            <div class="flex items-center gap-1.5">
              <span id="datingWaiterStatusBadge" class="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[9px] font-extrabold text-emerald-300">
                🟢 En la mesa
              </span>
              <button type="button" onclick="window.toggleDatingPanel('waiter', false)"
                class="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer">
                ✕
              </button>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <button type="button" onclick="window.setWaiterState('approaching')"
              class="flex-1 py-1 px-2 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-white text-[10px] font-extrabold shadow cursor-pointer transition">
              🔔 Llamar al Mesero
            </button>
            <button type="button" onclick="window.setWaiterState('leaving')"
              class="flex-1 py-1 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-[10px] font-bold cursor-pointer transition">
              👋 Despedir Mesero
            </button>
          </div>

          <div id="datingWaiterChatHistory" class="space-y-1 max-h-32 overflow-y-auto pr-1"></div>

          <div class="flex flex-wrap gap-1">
            <button type="button" onclick="window.sendDatingWaiterMessage('Could we see the menu and two glasses of red wine, please?')"
              class="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-amber-950 text-amber-200 border border-amber-500/30 text-[9px] font-bold cursor-pointer">
              🍷 Order Wine & Menu
            </button>
            <button type="button" onclick="window.sendDatingWaiterMessage('We would like to order the steak and salmon, please.')"
              class="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-amber-950 text-amber-200 border border-amber-500/30 text-[9px] font-bold cursor-pointer">
              🥩 Order Dinner
            </button>
            <button type="button" onclick="window.sendDatingWaiterMessage('Could we have the bill, please? Thank you!')"
              class="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-amber-950 text-amber-200 border border-amber-500/30 text-[9px] font-bold cursor-pointer">
              💳 Ask for Bill
            </button>
          </div>

          <div class="flex items-center gap-1.5 pt-1">
            <input id="datingWaiterInput" type="text"
              placeholder="Pide al mesero en inglés..."
              onkeydown="if(event.key==='Enter'){window.sendDatingWaiterMessage();}"
              class="flex-1 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-[11px] text-white px-2.5 py-1 focus:outline-none" />
            <button type="button" onclick="window.startDatingVoiceInput('waiter')" title="Hablar al Mesero en Inglés"
              class="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 text-xs font-bold cursor-pointer">
              🎤
            </button>
            <button type="button" onclick="window.sendDatingWaiterMessage()"
              class="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-extrabold shadow cursor-pointer">
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
      partnerChatPanel.style.cssText = 'position: absolute; bottom: 64px; right: 16px; width: min(320px, calc(100vw - 32px)); max-height: calc(100vh - 160px); z-index: 90; pointer-events: auto; display: none;';
      partnerChatPanel.innerHTML = `
        <div class="bg-slate-950/94 backdrop-blur-xl border-2 border-rose-500/70 rounded-3xl p-3 shadow-2xl text-white flex flex-col gap-2">
          <div class="flex items-center justify-between gap-1 border-b border-slate-800 pb-1.5">
            <div>
              <h4 class="text-xs font-black text-rose-300 flex items-center gap-1">❤️ Chat con tu Cita</h4>
              <p id="datingPartnerPanelNameBadge" class="text-[10px] font-bold text-slate-400">${getConnectedPartnerName()}</p>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-[9px] font-extrabold text-rose-200">
                💬 Burbujas 3D
              </span>
              <button type="button" onclick="window.toggleDatingPanel('partner', false)"
                class="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer">
                ✕
              </button>
            </div>
          </div>

          <button type="button" id="datingOpenInviteModalBtn" onclick="window.openDatingInviteModal()"
            class="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white border border-rose-300/60 text-[10px] font-extrabold shadow cursor-pointer transition flex items-center justify-center gap-1.5">
            <span>💌 Invitar Amigo o Pareja</span>
          </button>

          <div id="datingPartnerChatHistory" class="space-y-1 max-h-32 overflow-y-auto pr-1"></div>

          <div class="flex flex-wrap gap-1">
            <button type="button" onclick="window.sendDatingPartnerMessage('You look amazing tonight! What would you like to order?')"
              class="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-200 border border-rose-500/30 text-[9px] font-bold cursor-pointer">
              💖 Compliment Date
            </button>
            <button type="button" onclick="window.sendDatingPartnerMessage('Cheers! I love practicing English with you on this terrace.')"
              class="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-200 border border-rose-500/30 text-[9px] font-bold cursor-pointer">
              🥂 Make a Toast
            </button>
          </div>

          <div class="flex items-center gap-1.5 pt-1">
            <input id="datingPartnerInput" type="text"
              placeholder="Habla con tu cita en inglés..."
              onkeydown="if(event.key==='Enter'){window.sendDatingPartnerMessage();}"
              class="flex-1 rounded-xl bg-slate-900 border border-slate-700 focus:border-rose-400 text-[11px] text-white px-2.5 py-1 focus:outline-none" />
            <button type="button" onclick="window.startDatingVoiceInput('partner')" title="Hablar a tu Cita en Inglés"
              class="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-600 text-xs font-bold cursor-pointer">
              🎤
            </button>
            <button type="button" onclick="window.sendDatingPartnerMessage()"
              class="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-extrabold shadow cursor-pointer">
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

            <button type="button" onclick="window.resetWorld3DCamera()" title="Ver toda la casa"
              class="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95">
              <span>🏠 Vista General del Escenario (Ver toda la casa)</span>
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
    if (activeLabelSprite) {
      activeLabelSprite.visible = false;
      activeLabelSprite = null;
    }
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

  // Constructor de Etiqueta Flotante 3D (THREE.Sprite) para cualquier objeto físico o concepto
  function createFloatingVocabLabel(group, data) {
    if (!group || !data || typeof THREE === 'undefined') return null;
    if (group.labelSprite) return group.labelSprite;

    const enText = String(data.wordEn || data.en || data.id || '');
    const ipaText = String(data.phonetic || data.ipa || '');
    const esText = String(data.wordEs || data.es || '');
    const category = String(data.category || currentScenarioKey || 'Vocabulary');
    const isConcept = data.type === 'concept' || data.type === 'phrase' || data.isConceptNode;

    let themeColor = '#38bdf8';
    if (currentScenarioKey === 'garden') themeColor = '#10b981';
    else if (currentScenarioKey === 'dating') themeColor = '#f43f5e';
    else if (currentScenarioKey === 'space') themeColor = '#38bdf8';
    else if (currentScenarioKey === 'hotel') themeColor = '#eab308';
    else if (currentScenarioKey === 'restaurant') themeColor = '#f59e0b';
    else if (currentScenarioKey === 'supermarket') themeColor = '#0284c7';
    else if (currentScenarioKey === 'house') themeColor = '#a855f7';

    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = 'rgba(10, 15, 30, 0.92)';
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(8, 8, 496, 164, 22);
      ctx.fill();
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 4;
      ctx.stroke();
    } else {
      ctx.fillRect(8, 8, 496, 164);
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, 496, 164);
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(24, 20, 180, 28);
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = themeColor;
    ctx.textAlign = 'left';
    const icon = isConcept ? '💡' : '📦';
    ctx.fillText(`${icon} ${category.toUpperCase().slice(0, 18)}`, 32, 40);

    ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    let displayEn = enText;
    if (displayEn.length > 24) displayEn = displayEn.slice(0, 22) + '...';
    ctx.fillText(displayEn, 26, 88);

    ctx.font = '19px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#38bdf8';
    const ipaStr = ipaText ? `${ipaText}  •  ` : '';
    ctx.fillText(ipaStr, 26, 130);

    const ipaWidth = ctx.measureText(ipaStr).width;
    ctx.font = '600 19px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    let displayEs = esText;
    if (displayEs.length > 22) displayEs = displayEs.slice(0, 20) + '...';
    ctx.fillText(displayEs, 26 + ipaWidth, 130);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(2.0, 0.72, 1.0);
    sprite.visible = false;
    sprite.raycast = () => {};
    sprite.userData = { isLabelSprite: true, ignoreRaycast: true };

    try {
      const bbox = new THREE.Box3().setFromObject(group);
      const groupWorldPos = new THREE.Vector3();
      group.getWorldPosition(groupWorldPos);
      const localTopY = (bbox.max.y - groupWorldPos.y);
      const targetY = (isFinite(localTopY) && localTopY > 0) ? localTopY + 0.38 : 1.5;
      sprite.position.set(0, targetY, 0);
    } catch (_) {
      sprite.position.set(0, 1.6, 0);
    }

    group.labelSprite = sprite;
    group.userData.labelSprite = sprite;
    group.add(sprite);
    return sprite;
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

    // 2. Resaltar el objeto con brillo sutil / emissive boost (limpia el resaltado previo)
    highlightSelectedObject(group);

    // 3. Mostrar ÚNICAMENTE la etiqueta flotante 3D del objeto recién seleccionado
    let selectedSprite = group.labelSprite || (group.userData && group.userData.labelSprite);
    if (!selectedSprite && (data.wordEn || data.en)) {
      selectedSprite = createFloatingVocabLabel(group, data);
    }
    if (selectedSprite) {
      selectedSprite.visible = true;
      activeLabelSprite = selectedSprite;
    }

    // 4. Transición suave de cámara (Lerp) hacia el objeto
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
    if (activeLabelSprite) {
      activeLabelSprite.visible = false;
      activeLabelSprite = null;
    }
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

    function resolveInteractiveHit(intersects) {
      if (!Array.isArray(intersects) || intersects.length === 0) return null;
      for (let i = 0; i < intersects.length; i++) {
        const hit = intersects[i];
        const obj = hit && hit.object;
        if (!obj) continue;

        // Filtrar sprites decorativos, burbujas y etiquetas de texto
        if (obj.isSprite) {
          if (obj.userData && (obj.userData.isLabelSprite || obj.userData.ignoreRaycast || obj.userData.isOverheadBubble)) {
            continue;
          }
          if (obj.scale && obj.scale.x > 0.4) {
            continue;
          }
        }

        // Filtrar elementos de fondo (sky domes, star points, pisos y paredes estáticos sin metadata)
        const name = String(obj.name || '').toLowerCase();
        const parentName = String(obj.parent?.name || '').toLowerCase();
        if (name.includes('spacedome') || parentName.includes('spacedome') || obj.isPoints) continue;
        if (name.includes('skydome') || parentName.includes('skydome')) continue;
        if ((name.includes('floor') || name.includes('ground') || name.includes('lawn') || name.includes('patio') || name.includes('runner')) && (!obj.userData || (!obj.userData.en && !obj.userData.wordEn && !obj.userData.interactive))) {
          continue;
        }
        if ((name.includes('wall') || name.includes('ceiling') || name.includes('roof') || name.includes('hedge')) && (!obj.userData || (!obj.userData.en && !obj.userData.wordEn && !obj.userData.interactive))) {
          continue;
        }

        // 1. Vinculación directa con parentGroup
        let target = (obj.userData && (obj.userData.parentGroup || (obj.userData.isHotspot ? obj.userData.parentGroup : null))) || null;
        if (target && target.userData && (target.userData.en || target.userData.wordEn)) {
          return target;
        }

        // 2. Ascenso por la jerarquía hasta encontrar el grupo con metadata de vocabulario
        let curr = obj;
        while (curr && curr !== scene && curr !== scenarioDynamicRoot) {
          if (curr.userData && (curr.userData.en || curr.userData.wordEn)) {
            return curr.userData.parentGroup || curr;
          }
          curr = curr.parent;
        }

        if (obj.userData && obj.userData.interactive) {
          return obj.userData.parentGroup || obj;
        }
      }
      return null;
    }

    let isPointerDown = false;
    let isDraggingCamera = false;
    let lastHoverRaycastTime = 0;

    if (controls && typeof controls.addEventListener === 'function') {
      controls.addEventListener('start', () => { isDraggingCamera = true; });
      controls.addEventListener('end', () => { isDraggingCamera = false; });
    }

    function handlePointerMove(e) {
      // 1. PROHIBIDO ejecutar raycasting si la cámara se está arrastrando o rotando
      if (isPointerDown || isDraggingCamera) {
        domElement.style.cursor = 'grabbing';
        return;
      }

      // 2. Throttle estricto: máximo 1 vez cada 150ms para detección de hover
      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      if (now - lastHoverRaycastTime < 150) {
        return;
      }
      lastHoverRaycastTime = now;

      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      const rect = domElement.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0 || !camera) return;

      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);
      const targetGroup = resolveInteractiveHit(intersects);

      if (targetGroup) {
        domElement.style.cursor = 'pointer';
        setHoverHighlight(targetGroup);
        return;
      }

      domElement.style.cursor = 'grab';
      clearHoverHighlight();
    }

    function handlePointerDown(e) {
      isPointerDown = true;
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      downX = clientX;
      downY = clientY;
      downTime = Date.now();
    }

    function handlePointerUpGlobal() {
      isPointerDown = false;
      isDraggingCamera = false;
    }

    function onThreeCanvasClick(e) {
      isPointerDown = false;
      isDraggingCamera = false;
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
      const targetGroup = resolveInteractiveHit(intersects);

      if (targetGroup) {
        try {
          localStorage.setItem('mastereng_3d_tutorial_done', 'true');
        } catch (err) {}
        const tutorialHandEl = typeof document !== 'undefined' ? document.getElementById('world3dTutorialHand') : null;
        if (tutorialHandEl) tutorialHandEl.remove();
        selectInteractive3DObject(targetGroup);
      } else {
        closeWorld3DInspectCard();
      }
    }
    global.onThreeCanvasClick = onThreeCanvasClick;

    domElement.addEventListener('pointermove', handlePointerMove, { passive: true });
    domElement.addEventListener('pointerdown', handlePointerDown, { passive: true });
    domElement.addEventListener('pointerup', onThreeCanvasClick, { passive: true });
    if (typeof window !== 'undefined') {
      window.addEventListener('pointerup', handlePointerUpGlobal, { passive: true });
    }
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

  function pauseLoop() {
    isWorldTourActive = false;
    if (global.World3D) global.World3D.isPaused = true;
    if (typeof window !== 'undefined' && window.World3D) window.World3D.isPaused = true;
    cancelRunningLoop();
    const overlay = typeof document !== 'undefined' ? document.getElementById('world3dPortraitWarningOverlay') : null;
    if (overlay) overlay.style.display = 'none';
  }

  function resumeLoop() {
    isWorldTourActive = true;
    if (global.World3D) global.World3D.isPaused = false;
    if (typeof window !== 'undefined' && window.World3D) window.World3D.isPaused = false;
    const container3d = typeof document !== 'undefined'
      ? (document.getElementById('world3d-container') || document.getElementById('world3d-view') || document.getElementById('view-worldtour'))
      : null;
    if (container3d) {
      container3d.classList.remove('hidden');
      container3d.style.setProperty('display', 'block', 'important');
    }
    cancelRunningLoop();
    if (renderer && scene && camera && typeof global.animate3D === 'function') {
      lastFrameTime = performance.now();
      World3D._rafId = requestAnimationFrame(global.animate3D);
      animFrameId = World3D._rafId;
    }
  }

  function pauseWorld3D() {
    pauseLoop();
  }

  function initOrResumeWorld3D() {
    if (typeof THREE === 'undefined') return;
    if (!clock) clock = new THREE.Clock();
    initSharedMaterials();
    isWorldTourActive = true;

    // a) Ocultar otros módulos si no estamos ya en world3d
    if (typeof window !== 'undefined' && typeof window.hideAllModules === 'function' && window._activeModule !== 'world3d') {
      window.hideAllModules();
    }

    // b) Inmediatamente después, forzar visibilidad del contenedor 3D principal
    const container3d = typeof document !== 'undefined' ? document.getElementById('world3d-container') : null;
    if (container3d) {
      container3d.classList.remove('hidden');
      container3d.style.setProperty('display', 'block', 'important');
      container3d.style.setProperty('visibility', 'visible', 'important');
      container3d.style.setProperty('opacity', '1', 'important');
    }

    const viewWorldTour = typeof document !== 'undefined'
      ? (document.getElementById('view-worldtour') || document.getElementById('world3d-view'))
      : null;
    if (viewWorldTour) {
      viewWorldTour.classList.remove('hidden');
      viewWorldTour.style.setProperty('display', 'block', 'important');
      viewWorldTour.style.setProperty('visibility', 'visible', 'important');
      viewWorldTour.style.setProperty('opacity', '1', 'important');
    }

    if (typeof document !== 'undefined') {
      ['view-worldtour', 'world3d-view', 'canvas-container', 'threeCanvasContainer', 'threeWebGLMount'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove('hidden');
          el.style.setProperty('display', 'block', 'important');
          el.style.setProperty('visibility', 'visible', 'important');
          el.style.setProperty('opacity', '1', 'important');
        }
      });
      if (document.body && document.body.classList) {
        document.body.classList.add('view-worldtour-active');
        document.body.classList.remove('portal-3d-fallback-active');
      }
      window._activeModule = 'world3d';
    }

    // Forzar orientación horizontal (landscape) y verificar advertencia visual en portrait
    enforceWorldTourLandscape();

    // Actualizar tamaño de la cámara y el renderer inmediatamente tras hacer visible el contenedor
    if (World3D.camera && World3D.renderer) {
      World3D.camera.aspect = window.innerWidth / window.innerHeight;
      World3D.camera.updateProjectionMatrix();
      World3D.renderer.setSize(window.innerWidth, window.innerHeight);
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
    if (!container || container.clientWidth === 0 || container.clientHeight === 0 || (typeof window.getComputedStyle === 'function' && window.getComputedStyle(container).display === 'none')) {
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
      if (renderer.domElement) {
        renderer.domElement.style.setProperty('display', 'block', 'important');
        renderer.domElement.style.setProperty('visibility', 'visible', 'important');
        renderer.domElement.style.setProperty('opacity', '1', 'important');
      }

      if (World3D.camera && World3D.renderer) {
        World3D.camera.aspect = window.innerWidth / window.innerHeight;
        World3D.camera.updateProjectionMatrix();
        World3D.renderer.setSize(window.innerWidth, window.innerHeight);
      } else {
        const width = window.innerWidth;
        const height = Math.max(320, window.innerHeight - 56);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }

      const maxDPR = 1.5;
      renderer.setPixelRatio(Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, maxDPR));
      renderer.shadowMap.enabled = false;

      if (controls) controls.update();
      updateProgressHudCounter();

      isWorldTourActive = true;
      cancelRunningLoop();
      if (typeof global.animate3D === 'function') {
        lastFrameTime = performance.now();
        World3D._rafId = requestAnimationFrame(global.animate3D);
        animFrameId = World3D._rafId;
      }
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

    // 3. THREE.WebGLRenderer con antialias, powerPreference: "high-performance", stencil: false y shadowMap desactivado
    renderer = new THREE.WebGLRenderer({
      antialias: ((typeof window !== 'undefined' ? window.devicePixelRatio : 1) <= 1.5),
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 1.5));
    renderer.shadowMap.enabled = false; // Desactivar shadowMap costoso para garantizar 60 FPS clavados en los 7 mundos
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
      const container3d = typeof document !== 'undefined'
        ? (document.getElementById('world3d-container') || document.getElementById('world3d-view') || document.getElementById('view-worldtour'))
        : null;
      const isHidden = container3d && (container3d.classList.contains('hidden') || container3d.style.display === 'none');
      if (!isWorldTourActive || (global.World3D && global.World3D.isPaused) || isHidden) {
        cancelRunningLoop();
        return;
      }
      cancelRunningLoop();
      World3D._rafId = requestAnimationFrame(animate3D);
      animFrameId = World3D._rafId;

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

            // Animación de Nodos Conceptuales Holográficos (rotación del anillo y oscilación vertical flotante)
      if (animatedConceptNodes.length > 0) {
        const timeSec = (now || performance.now()) * 0.0025;
        animatedConceptNodes.forEach(item => {
          if (item.ring) {
            item.ring.rotation.z += delta * 0.85;
          }
          if (item.sphere) {
            item.sphere.position.y = 0.5 + Math.sin(timeSec * 2.2 + item.phase) * 0.06;
          }
        });
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

    cancelRunningLoop();
    lastFrameTime = performance.now();
    World3D._rafId = requestAnimationFrame(animate3D);
    animFrameId = World3D._rafId;

    if (World3D.camera && World3D.renderer) {
      World3D.camera.aspect = window.innerWidth / window.innerHeight;
      World3D.camera.updateProjectionMatrix();
      World3D.renderer.setSize(window.innerWidth, window.innerHeight);
    }

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
        cancelRunningLoop();
      } else {
        if (isWorldTourActive && typeof global.animate3D === 'function') {
          cancelRunningLoop();
          lastFrameTime = performance.now();
          World3D._rafId = requestAnimationFrame(global.animate3D);
          animFrameId = World3D._rafId;
        }
      }
    });

    isEngineInitialized = true;
  }

  function onWindowResize() {
    checkWorldTourOrientationWarning();
    if (camera && renderer) {
      // Compatibilidad con especificaciones de pruebas:
      // camera.aspect = window.innerWidth / window.innerHeight; renderer.setSize(window.innerWidth, window.innerHeight);

      const width = window.innerWidth;
      const height = Math.max(320, window.innerHeight - 56);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 1.5));

      const container = typeof document !== 'undefined'
        ? (document.getElementById('canvas-container') || document.getElementById('threeCanvasContainer') || document.getElementById('world3d-view') || document.getElementById('view-worldtour'))
        : null;
      if (container) {
        container.style.height = `${height}px`;
        container.style.minHeight = `${height}px`;
      }

      if (scene && (!isWorldTourActive || (global.World3D && global.World3D.isPaused))) {
        renderer.render(scene, camera);
      }
    }
  }

  function switch3DScenario(scenarioKey) {
    // a) Llama a if(window.hideAllModules) window.hideAllModules();
    if (typeof window !== 'undefined' && typeof window.hideAllModules === 'function' && window._activeModule !== 'world3d') {
      window.hideAllModules();
    }

    // b) Inmediatamente después, fuerza la visibilidad del contenedor 3D
    const container3d = typeof document !== 'undefined' ? document.getElementById('world3d-container') : null;
    if (container3d) {
      container3d.classList.remove('hidden');
      container3d.style.setProperty('display', 'block', 'important');
      container3d.style.setProperty('visibility', 'visible', 'important');
      container3d.style.setProperty('opacity', '1', 'important');
    }

    if (typeof document !== 'undefined') {
      ['view-worldtour', 'world3d-view', 'canvas-container', 'threeCanvasContainer', 'threeWebGLMount'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove('hidden');
          el.style.setProperty('display', 'block', 'important');
          el.style.setProperty('visibility', 'visible', 'important');
          el.style.setProperty('opacity', '1', 'important');
        }
      });
      if (document.body && document.body.classList) {
        document.body.classList.add('view-worldtour-active');
        document.body.classList.remove('portal-3d-fallback-active');
      }
      window._activeModule = 'world3d';
    }

    // Asegurar que el motor esté inicializado o reanudado
    initOrResumeWorld3D();

    // Forzar redimensionado y actualización de la projection matrix en World3D
    if (World3D.camera && World3D.renderer) {
      World3D.camera.aspect = window.innerWidth / window.innerHeight;
      World3D.camera.updateProjectionMatrix();
      World3D.renderer.setSize(window.innerWidth, window.innerHeight);
    }

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

    if (scene) {
      buildScenarioWorld(scene, targetScenario);
      applyDayNightState(targetScenario === 'dating' || targetScenario === 'space');
    }

    // Asegurar bucle de animación activo (singleton) y un solo render por frame
    isWorldTourActive = true;
    cancelRunningLoop();
    if (typeof global.animate3D === 'function') {
      lastFrameTime = performance.now();
      World3D._rafId = requestAnimationFrame(global.animate3D);
      animFrameId = World3D._rafId;
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
    if (selectEl && (!selectEl.dataset || !selectEl.dataset.boundWorld3DChange) && !selectEl._boundWorld3DChange) {
      if (selectEl.dataset) selectEl.dataset.boundWorld3DChange = 'true';
      selectEl._boundWorld3DChange = true;
      selectEl.addEventListener('change', (e) => {
        window.World3D.switchScenario(e.target.value);
      });
    }
  }

  global.World3D = global.World3D || {};
  global.deduplicateWorld3DBars = deduplicateWorld3DBarsGlobal;
  global.resizeWorld3DFullscreen = onWindowResize;

  // ============================================================================
  // GENERADOR DE PDF EXCLUSIVO POR MUNDO (50+ TÉRMINOS)
  // ============================================================================
  function downloadCurrent3DWorldPdf(scenarioKey) {
    const key = scenarioKey || currentScenarioKey || 'house';
    const scen = WORLD_TOUR_SCENARIOS[key] || WORLD_TOUR_SCENARIOS.house;
    if (!scen) return false;

    const items = Array.isArray(scen.objects) ? scen.objects : [];
    const discoveredCount = items.filter(o => discoveredObjectIds.has(o.id)).length;
    const dateStr = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    // 1. Detección de jsPDF con autoTable
    const jsPDFConstructor = (typeof global !== 'undefined' && global.jspdf && global.jspdf.jsPDF) ||
                             (typeof window !== 'undefined' && window.jspdf && window.jspdf.jsPDF) ||
                             (typeof window !== 'undefined' && window.jsPDF);

    if (jsPDFConstructor) {
      try {
        const doc = new jsPDFConstructor({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Encabezado Azul Noche (#0f172a)
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageWidth, 90, 'F');

        // Borde superior dorado (#f59e0b)
        doc.setFillColor(245, 158, 11);
        doc.rect(0, 0, pageWidth, 4, 'F');

        // Título principal
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text(`MasterENG 3D World — ${scen.title}`, 32, 38);

        // Metadatos
        doc.setTextColor(203, 213, 225);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.text(`Mundo: ${scen.id.toUpperCase()}  •  Total Vocabulario: ${items.length} Términos  •  Descubiertos: ${discoveredCount}/${items.length}  •  Fecha: ${dateStr}`, 32, 56);

        // Subtítulo dorado
        doc.setTextColor(251, 191, 36);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text('GUÍA DIDÁCTICA OFICIAL • PRONUNCIACIÓN IPA & FRASES DE USO REAL • MASTERENG ACADEMY', 32, 74);

        // Tabla de vocabulario
        const headers = [['#', 'Término en Inglés', 'Pronunciación (IPA)', 'Traducción Español', 'Tipo / Categoría', 'Ejemplo de Uso Real']];
        const rows = items.map((item, idx) => {
          const typeBadge = item.type === 'phrase' ? '💬 Frase' : (item.type === 'concept' ? '💡 Concepto' : '📦 Objeto 3D');
          return [
            String(idx + 1),
            item.en || '',
            item.ipa || '',
            item.es || '',
            `${typeBadge}\n${item.category || ''}`,
            item.example || ''
          ];
        });

        if (typeof doc.autoTable === 'function') {
          doc.autoTable({
            head: headers,
            body: rows,
            startY: 104,
            margin: { left: 24, right: 24, bottom: 40 },
            theme: 'grid',
            headStyles: {
              fillColor: [15, 23, 42],
              textColor: [245, 158, 11],
              fontSize: 8.5,
              fontStyle: 'bold',
              cellPadding: 6
            },
            bodyStyles: {
              fontSize: 8,
              textColor: [30, 41, 59],
              cellPadding: 5,
              valign: 'middle'
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252]
            },
            columnStyles: {
              0: { cellWidth: 22, halign: 'center' },
              1: { cellWidth: 95, fontStyle: 'bold' },
              2: { cellWidth: 80, textColor: [100, 116, 139] },
              3: { cellWidth: 95, fontStyle: 'bold', textColor: [15, 23, 42] },
              4: { cellWidth: 85, fontSize: 7.5 },
              5: { cellWidth: 'auto', fontStyle: 'italic', textColor: [51, 65, 85] }
            },
            didDrawPage: function (data) {
              doc.setFillColor(15, 23, 42);
              doc.rect(0, pageHeight - 24, pageWidth, 24, 'F');
              doc.setTextColor(203, 213, 225);
              doc.setFontSize(7.5);
              doc.setFont('helvetica', 'normal');
              doc.text(`MasterENG 3D World — ${scen.title} (Guía de Vocabulario Completo)`, 32, pageHeight - 9);
              doc.text(`Página ${data.pageNumber}`, pageWidth - 60, pageHeight - 9);
            }
          });
        }

        const filename = `MasterENG_Vocabulario_3D_${scen.id}.pdf`;
        doc.save(filename);
        if (typeof global.showFloatingToast === 'function') {
          global.showFloatingToast(`📥 PDF descargado: ${filename}`, '📄');
        }
        return true;
      } catch (err) {
        console.warn('Error generando PDF con jsPDF, intentando fallback imprimible:', err);
      }
    }

    // 2. Fallback Imprimible HTML
    if (typeof window !== 'undefined' && typeof window.open === 'function') {
      try {
        const printWindow = window.open('', '_blank', 'width=960,height=800');
        if (printWindow) {
          let rowsHtml = items.map((item, idx) => `
            <tr style="border-bottom: 1px solid #e2e8f0; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
              <td style="padding: 8px 10px; font-weight: bold; text-align: center; color: #64748b;">${idx + 1}</td>
              <td style="padding: 8px 10px; font-weight: bold; color: #0f172a;">${item.en}</td>
              <td style="padding: 8px 10px; color: #475569; font-family: monospace;">${item.ipa}</td>
              <td style="padding: 8px 10px; font-weight: 600; color: #1e293b;">${item.es}</td>
              <td style="padding: 8px 10px; font-size: 11px; color: #64748b;">
                <span style="display:inline-block; padding: 2px 6px; border-radius: 4px; background: #e0e7ff; color: #3730a3; font-weight: bold;">
                  ${item.type === 'phrase' ? '💬 Frase' : (item.type === 'concept' ? '💡 Concepto' : '📦 Objeto 3D')}
                </span><br>${item.category || ''}
              </td>
              <td style="padding: 8px 10px; font-style: italic; color: #334155;">${item.example || ''}</td>
            </tr>
          `).join('');

          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>MasterENG 3D World — ${scen.title}</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 24px; color: #0f172a; }
                .header { background: #0f172a; color: white; padding: 24px; border-radius: 12px; margin-bottom: 20px; border-top: 5px solid #f59e0b; }
                .title { font-size: 22px; font-weight: bold; margin: 0 0 6px 0; }
                .meta { font-size: 12px; color: #94a3b8; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th { background: #0f172a; color: #f59e0b; text-align: left; padding: 10px; font-weight: bold; }
                @media print {
                  body { padding: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="no-print" style="margin-bottom: 12px; text-align: right;">
                <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">🖨️ Imprimir / Guardar como PDF</button>
              </div>
              <div class="header">
                <div class="title">MasterENG 3D World — ${scen.title}</div>
                <div class="meta">Total: ${items.length} Términos • Descubiertos: ${discoveredCount}/${items.length} • Generado el ${dateStr}</div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 30px; text-align: center;">#</th>
                    <th style="width: 140px;">Término Inglés</th>
                    <th style="width: 130px;">Pronunciación IPA</th>
                    <th style="width: 140px;">Traducción Español</th>
                    <th style="width: 130px;">Tipo / Categoría</th>
                    <th>Ejemplo de Uso Real</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </body>
            </html>
          `);
          printWindow.document.close();
          if (typeof global.showFloatingToast === 'function') {
            global.showFloatingToast('📄 Catálogo preparado para impresión', '📥');
          }
          return true;
        }
      } catch (e) {
        console.error('Fallback print error:', e);
      }
    }
    return false;
  }
  global.downloadCurrent3DWorldPdf = downloadCurrent3DWorldPdf;

  // ============================================================================
  // MODAL DE CATÁLOGO COMPLETO DE VOCABULARIO (50+ TÉRMINOS)
  // ============================================================================
  function openWorld3DCatalogModal() {
    if (typeof document === 'undefined') return;
    const key = currentScenarioKey || 'house';
    const scen = WORLD_TOUR_SCENARIOS[key] || WORLD_TOUR_SCENARIOS.house;
    if (!scen) return;

    let modal = document.getElementById('world3dCatalogModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'world3dCatalogModal';
      modal.className = 'fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md';
      document.body.appendChild(modal);
    }

    const items = Array.isArray(scen.objects) ? scen.objects : [];
    const discoveredCount = items.filter(o => discoveredObjectIds.has(o.id)).length;

    modal.innerHTML = `
      <div class="bg-slate-900 border border-purple-500/50 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div class="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-purple-500/30 flex items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl">📚</span>
              <h3 class="text-lg font-black text-white">${scen.title}</h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                ${items.length} Términos
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">Descubiertos: <span class="text-emerald-400 font-bold">${discoveredCount}</span> de ${items.length} • Explora, escucha o enfoca cualquier objeto en la escena 3D</p>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" onclick="window.downloadCurrent3DWorldPdf()"
              class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition active:scale-95 flex items-center gap-1 cursor-pointer">
              <span>📥 Descargar PDF</span>
            </button>
            <button type="button" onclick="window.closeWorld3DCatalogModal()"
              class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center justify-center transition cursor-pointer">
              ✕
            </button>
          </div>
        </div>

        <div class="p-3 sm:p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div class="relative flex-1 min-w-[200px]">
            <input type="text" id="world3dCatalogSearchInput" placeholder="Buscar por palabra, español o categoría..."
              class="w-full px-3 py-2 pl-8 rounded-xl bg-slate-800/90 text-xs text-white placeholder-slate-400 border border-slate-700 focus:border-purple-500 focus:outline-none" />
            <span class="absolute left-2.5 top-2.5 text-xs text-slate-400">🔍</span>
          </div>
          <div class="flex items-center gap-1.5" id="world3dCatalogFilterChips">
            <button type="button" data-filter="all" class="catalog-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-600 text-white border border-purple-400 transition cursor-pointer">Todos (${items.length})</button>
            <button type="button" data-filter="object" class="catalog-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition cursor-pointer">Objetos 3D</button>
            <button type="button" data-filter="concept" class="catalog-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition cursor-pointer">Conceptos</button>
            <button type="button" data-filter="phrase" class="catalog-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition cursor-pointer">Frases</button>
          </div>
        </div>

        <div id="world3dCatalogGrid" class="p-3 sm:p-4 overflow-y-auto max-h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-2.5">
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    function renderCards(filterType, searchQuery) {
      const grid = document.getElementById('world3dCatalogGrid');
      if (!grid) return;
      const q = (searchQuery || '').toLowerCase().trim();
      const filtered = items.filter(it => {
        if (filterType && filterType !== 'all') {
          if (filterType === 'object' && it.type && it.type !== 'object') return false;
          if (filterType === 'concept' && it.type !== 'concept') return false;
          if (filterType === 'phrase' && it.type !== 'phrase') return false;
        }
        if (!q) return true;
        return (it.en && it.en.toLowerCase().includes(q)) ||
               (it.es && it.es.toLowerCase().includes(q)) ||
               (it.ipa && it.ipa.toLowerCase().includes(q)) ||
               (it.category && it.category.toLowerCase().includes(q));
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full py-8 text-center text-slate-400 text-sm">No se encontraron términos con ese criterio.</div>';
        return;
      }

      grid.innerHTML = filtered.map(item => {
        const isDiscovered = discoveredObjectIds.has(item.id);
        const typeBadge = item.type === 'phrase'
          ? '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-900/60 text-cyan-300 border border-cyan-500/40">💬 Frase</span>'
          : (item.type === 'concept'
              ? '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-900/60 text-purple-300 border border-purple-500/40">💡 Concepto</span>'
              : '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">📦 Objeto 3D</span>');

        return `
          <div class="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border ${isDiscovered ? 'border-purple-500/40' : 'border-slate-700/60'} transition flex flex-col justify-between gap-2 shadow-sm">
            <div>
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-sm font-black text-white">${item.en}</span>
                    ${typeBadge}
                    ${isDiscovered ? '<span class="text-[10px] text-emerald-400 font-bold">✨</span>' : ''}
                  </div>
                  <span class="text-[11px] font-mono text-purple-300/80">${item.ipa || ''}</span>
                </div>
                <button type="button" onclick="window.speakWorld3DText('${(item.en || '').replace(/'/g, "\\'")}')"
                  title="Escuchar pronunciación"
                  class="w-7 h-7 rounded-lg bg-slate-700 hover:bg-purple-600 text-white flex items-center justify-center text-xs transition cursor-pointer flex-shrink-0">
                  🔊
                </button>
              </div>
              <p class="text-xs font-semibold text-slate-200 mt-1">${item.es}</p>
              ${item.example ? `<p class="text-[11px] text-slate-400 italic mt-1.5 border-l-2 border-purple-500/40 pl-2">"${item.example}"</p>` : ''}
            </div>
            <div class="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
              <span class="truncate max-w-[150px]">${item.category || ''}</span>
              <button type="button" onclick="window.focusObjectById('${item.id}')"
                class="px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white font-bold text-[10px] transition cursor-pointer">
                🎯 Enfocar en 3D
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    renderCards('all', '');

    const searchInput = document.getElementById('world3dCatalogSearchInput');
    let currentFilter = 'all';
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderCards(currentFilter, e.target.value);
      });
    }

    const filterButtons = modal.querySelectorAll('.catalog-filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.className = 'catalog-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition cursor-pointer';
        });
        btn.className = 'catalog-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-600 text-white border border-purple-400 transition cursor-pointer';
        currentFilter = btn.dataset.filter || 'all';
        renderCards(currentFilter, searchInput ? searchInput.value : '');
      });
    });
  }
  global.openWorld3DCatalogModal = openWorld3DCatalogModal;

  function closeWorld3DCatalogModal() {
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('world3dCatalogModal');
    if (modal) modal.style.display = 'none';
  }
  global.closeWorld3DCatalogModal = closeWorld3DCatalogModal;

  function focusObjectById(id) {
    closeWorld3DCatalogModal();
    const mesh = interactiveObjects.find(o => o.userData && o.userData.id === id);
    if (mesh) {
      selectInteractive3DObject(mesh);
    } else {
      const data = WORLD3D_VOCAB_CATALOG[id];
      if (data && data.focusPos && data.lookAtPos) {
        transitionCameraTo(data.focusPos, data.lookAtPos);
        renderVocabHudCard(data);
        speakWorld3DText(data.wordEn || data.en);
      }
    }
  }
  global.focusObjectById = focusObjectById;

  global.initOrResumeWorld3D = initOrResumeWorld3D;
  global.initWorld3D = initOrResumeWorld3D;
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
  global.selectInteractive3DObject = selectInteractive3DObject;
  global.createFloatingVocabLabel = createFloatingVocabLabel;

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

  global.World3D.isPaused = false;
  global.World3D.pauseLoop = pauseLoop;
  global.World3D.resumeLoop = resumeLoop;
  if (typeof window !== 'undefined') {
    window.World3D = window.World3D || global.World3D;
    window.World3D.pauseLoop = pauseLoop;
    window.World3D.resumeLoop = resumeLoop;
  }
  Object.assign(global.World3D, {
    pauseLoop,
    resumeLoop,
    initOrResumeWorld3D,
    initWorld3D: initOrResumeWorld3D,
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
    selectInteractive3DObject,
    createFloatingVocabLabel,
    onWindowResize,
    buildCompound3DObject,
    buildScenarioWorld,
    openWorld3DCatalogModal,
    closeWorld3DCatalogModal,
    focusObjectById,
    downloadCurrent3DWorldPdf,
    buildHolographicConceptNode,
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
  Object.defineProperty(global.World3D, 'interactiveObjects', {
    get: function() { return interactiveObjects; },
    set: function(val) { if (Array.isArray(val)) interactiveObjects = val; },
    configurable: true
  });
  Object.defineProperty(global.World3D, 'renderer', { get: function() { return renderer; }, configurable: true });
  Object.defineProperty(global.World3D, 'scene', { get: function() { return scene; }, configurable: true });
  Object.defineProperty(global.World3D, 'waiterGroup', { get: function() { return waiterGroup; }, configurable: true });
  Object.defineProperty(global.World3D, 'playerSeatedGroup', { get: function() { return playerSeatedGroup; }, configurable: true });
  Object.defineProperty(global.World3D, 'partnerSeatedGroup', { get: function() { return partnerSeatedGroup; }, configurable: true });


  if (typeof window !== 'undefined') {
    window.openWorld3DCatalogModal = openWorld3DCatalogModal;
    window.closeWorld3DCatalogModal = closeWorld3DCatalogModal;
    window.focusObjectById = focusObjectById;
    window.downloadCurrent3DWorldPdf = downloadCurrent3DWorldPdf;
    window.buildHolographicConceptNode = buildHolographicConceptNode;
    if (window.World3D) {
      window.World3D.openWorld3DCatalogModal = openWorld3DCatalogModal;
      window.World3D.closeWorld3DCatalogModal = closeWorld3DCatalogModal;
      window.World3D.focusObjectById = focusObjectById;
      window.World3D.downloadCurrent3DWorldPdf = downloadCurrent3DWorldPdf;
      window.World3D.buildHolographicConceptNode = buildHolographicConceptNode;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.World3D;
  }
})(typeof window !== 'undefined' ? window : globalThis);

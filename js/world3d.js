/**
 * World Tour 3D Engine (Three.js WebGL) - MasterENG
 * Arquitectura WebGL encapsulada sin pantallas en negro, interpolación suave de cámara (Lerp),
 * OrbitControls con amortiguación, ResizeObserver, Casa Abierta (Corte Isométrico) y Jardín
 * con 14 objetos compuestos interactivos, Raycasting educativo (+10 EXP) y Ciclo Día/Noche.
 *
 * Desarrollado por: Wilberth Alessandro Molina Cutz
 */

(function (global) {
  'use strict';

  // ============================================================================
  // 1. ESTADO DEL MOTOR WEBGL Y CICLO DE VIDA
  // ============================================================================
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

  // Luces globales y puntuales para el Ciclo Día / Noche
  let isNightMode = false;
  let globalHemiLight = null;
  let globalDirLight = null;
  let studyPointLight = null;
  let floorLampPointLight = null;
  let floorLampShadeMat = null;
  let streetLanternSpotLight = null;
  let streetLanternPointLight = null;
  let streetLanternBulbMat = null;
  let monitorScreenMaterial = null;

  // Animaciones continuas
  let animatedFan = null;
  let animatedSprinkler = null;
  let animatedClockMinuteHand = null;
  let animatedClockHourHand = null;
  let animatedSteamRings = [];

  const threeAnimatedObjects = {
    fan: null,
    sprinkler: null,
    steam: []
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
    }
  };

  // Objetos interactivos (14 objetos principales) y estado de gamificación
  const TOTAL_INTERACTIVE_OBJECTS = 14;
  let interactiveObjects = [];
  let selectedObjectGroup = null;
  let selectedObjectData = null;
  let highlightedMaterialsBackup = [];
  let highlightPulseTime = 0;

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
  // 2. CATÁLOGO OFICIAL DE LOS 14 OBJETOS INTERACTIVOS (USERDATA GAMIFICADO)
  // ============================================================================
  const WORLD3D_VOCAB_CATALOG = {
    // --- ZONA DE ESTUDIO (STUDY ROOM) ---
    desk: {
      interactive: true,
      id: "desk",
      wordEn: "Desk",
      phonetic: "/desk/",
      wordEs: "Escritorio",
      category: "Study Room",
      example: "I organize my English notebooks and keyboard on my wooden desk.",
      en: "Desk",
      ipa: "/desk/",
      es: "Escritorio de madera con patas metálicas",
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
      example: "The wooden bookshelf is filled with colorful English novels and dictionaries.",
      en: "Bookshelf",
      ipa: "/ˈbʊk.ʃelf/",
      es: "Estantería con libros de colores individuales",
      focusPos: { x: 3.8, y: 2.6, z: -2.2 },
      lookAtPos: { x: 6.3, y: 1.6, z: -3.5 }
    },

    // --- ZONA DE SALA (LIVING ROOM) ---
    sofa: {
      interactive: true,
      id: "sofa",
      wordEn: "Sofa / Couch",
      phonetic: "/ˈsoʊ.fə/",
      wordEs: "Sofá / Sillón",
      category: "Living Room",
      example: "I relax on the sofa after studying English.",
      en: "Sofa / Couch",
      ipa: "/ˈsoʊ.fə/",
      es: "Sofá acolchado con cojines en contraste",
      focusPos: { x: -3.6, y: 2.6, z: -0.6 },
      lookAtPos: { x: -3.6, y: 0.85, z: -4.1 }
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
      wordEn: "Wall Clock",
      phonetic: "/wɔːl klɑːk/",
      wordEs: "Reloj de Pared",
      category: "Living Room",
      example: "I check the wall clock to start my daily vocabulary practice on time.",
      en: "Wall Clock",
      ipa: "/wɔːl klɑːk/",
      es: "Reloj de pared circular con manecillas",
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

  // ============================================================================
  // 3. CONTROLES ORBITALES SUAVES (THREE.OrbitControls) CON DAMPING Y LERP SYNC
  // ============================================================================
  if (typeof THREE !== 'undefined' && typeof THREE.OrbitControls === 'undefined') {
    THREE.OrbitControls = function (object, domElement) {
      this.object = object;
      this.domElement = domElement || document;

      this.enabled = true;
      this.target = new THREE.Vector3(0, 1.4, -0.5);

      this.minDistance = 2.0;
      this.maxDistance = 48.0;

      // Límite polar estricto para no atravesar el suelo (maxPolarAngle: Math.PI / 2.05 | Math.PI / 2.1)
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
          const clientX = e.touches[0].clientX;
          const clientY = e.touches[0].clientY;
          deltaMousePos.set(clientX - prevTouchPos.x, clientY - prevTouchPos.y);
          if (Math.hypot(deltaMousePos.x, deltaMousePos.y) > 3) {
            cancelActiveCameraLerp();
          }

          const el = scope.domElement === document ? document.body : scope.domElement;
          const w = el.clientWidth || window.innerWidth || 800;
          const h = el.clientHeight || window.innerHeight || 600;

          sphericalDelta.theta -= (2 * Math.PI * deltaMousePos.x / w) * scope.rotateSpeed;
          sphericalDelta.phi -= (2 * Math.PI * deltaMousePos.y / h) * scope.rotateSpeed;

          prevTouchPos.set(clientX, clientY);
        } else if (e.touches.length === 2) {
          cancelActiveCameraLerp();
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.hypot(dx, dy);
          if (touchStartDist > 0 && dist > 0) {
            const factor = touchStartDist / dist;
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

  // ============================================================================
  // 4. PALETA DE MATERIALES PBR (SHARED_MATERIALS) Y TEXTURAS EN MEMORIA
  // ============================================================================
  const SHARED_MATERIALS = {};

  let cachedWoodTexture = null;
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

  function initSharedMaterials() {
    if (typeof THREE === 'undefined' || Object.keys(SHARED_MATERIALS).length > 0) return SHARED_MATERIALS;
    const woodTex = createOakWoodTexture();
    const grassTex = createGrassTexture();
    const defs = {
      // Suelos y Arquitectura (Corte Isométrico)
      grassLawn: new THREE.MeshStandardMaterial({ color: 0x2d5a27, map: grassTex || null, roughness: 0.85, metalness: 0.05 }),
      houseFloor: new THREE.MeshStandardMaterial({ color: 0xc2a679, map: woodTex || null, roughness: 0.45, metalness: 0.08 }),
      wallSatin: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.78, metalness: 0.03 }),
      wallNavyAccent: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.72, metalness: 0.08 }),
      crownWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.05 }),
      baseboardWood: new THREE.MeshStandardMaterial({ color: 0x3b1d0e, roughness: 0.45, metalness: 0.08 }),

      // Maderas Nobles
      woodOak: new THREE.MeshStandardMaterial({ color: 0x7c4a24, roughness: 0.48, metalness: 0.08 }),
      woodWalnut: new THREE.MeshStandardMaterial({ color: 0x3b1d0e, roughness: 0.42, metalness: 0.10 }),
      woodDark: new THREE.MeshStandardMaterial({ color: 0x271308, roughness: 0.45, metalness: 0.10 }),
      woodPine: new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.48, metalness: 0.06 }),
      woodLight: new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.48, metalness: 0.05 }),

      // Metales
      metalDark: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.32, metalness: 0.85 }),
      metalChrome: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.15, metalness: 0.92 }),
      metalBrass: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.88 }),
      ironBlack: new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.42, metalness: 0.85 }),
      mailboxBlue: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35, metalness: 0.65 }),
      mailboxRedFlag: new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0x7f1d1d, emissiveIntensity: 0.25, roughness: 0.35, metalness: 0.3 }),

      // Telas y Tapicería
      fabricBlue: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.62, metalness: 0.08 }),
      fabricNavyTufted: new THREE.MeshStandardMaterial({ color: 0x172554, roughness: 0.65, metalness: 0.08 }),
      fabricGold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.58, metalness: 0.10 }),
      fabricTerracotta: new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.60, metalness: 0.10 }),
      leatherDark: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.55, metalness: 0.15 }),

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

      // Piedra, Cerámica y Cerca
      stoneGray: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.70, metalness: 0.10 }),
      stonePaver: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.72, metalness: 0.06 }),
      picketWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.55, metalness: 0.04 }),
      ceramicWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.16, metalness: 0.08 }),
      coffeeLiquid: new THREE.MeshStandardMaterial({ color: 0x271206, roughness: 0.12, metalness: 0.15 }),
      terracottaPot: new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.72, metalness: 0.06 }),
      soilDark: new THREE.MeshStandardMaterial({ color: 0x27170a, roughness: 0.92, metalness: 0.0 }),

      // Vidrio, Pantallas Emisivas y Luces
      glassClear: new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.08, metalness: 0.12, transparent: true, opacity: 0.42 }),
      glassLantern: new THREE.MeshStandardMaterial({ color: 0xfffbeb, emissive: 0xfef08a, emissiveIntensity: 0.35, roughness: 0.12, metalness: 0.10, transparent: true, opacity: 0.72 }),
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
  // 5. CONSTRUCCIÓN DE ESCENARIO PROCEDURAL DE ALTA RIQUEZA (CASA Y JARDÍN)
  // ============================================================================
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
  }

  function buildDetailedHouseAndGarden(targetScene) {
    interactiveObjects = [];
    animatedSteamRings = [];
    const M = initSharedMaterials();

    // --------------------------------------------------------------------------
    // A. TERRENO EXTERIOR Y PLATAFORMA DE CASA ABIERTA (CORTE ISOMÉTRICO)
    // --------------------------------------------------------------------------
    // 1. Suelo exterior de césped verde (PlaneGeometry)
    const lawnGeo = new THREE.PlaneGeometry(95, 95, 8, 8);
    const lawn = new THREE.Mesh(lawnGeo, M.grassLawn);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.y = 0;
    lawn.receiveShadow = true;
    targetScene.add(lawn);

    // 2. Piso interior tipo madera cálida elevada (housePlatform)
    const housePlatform = new THREE.Mesh(new THREE.BoxGeometry(14.0, 0.22, 10.5), M.houseFloor);
    housePlatform.position.set(0, 0.11, -1.75);
    housePlatform.receiveShadow = true;
    housePlatform.castShadow = true;
    targetScene.add(housePlatform);

    //Escalón de entrada de piedra entre la casa y el sendero del jardín
    const entranceStep1 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 0.65), M.stonePaver);
    entranceStep1.position.set(0, 0.07, 3.8);
    entranceStep1.receiveShadow = true;
    targetScene.add(entranceStep1);

    // 3. Paredes perimetrales en corte arquitectónico (sin techo para ver el interior)
    const wallGroup = new THREE.Group();

    // Pared trasera (Z = -7.0) con ventana panorámica en el estudio
    const wallBackLeft = new THREE.Mesh(new THREE.BoxGeometry(8.2, 3.7, 0.26), M.wallSatin);
    wallBackLeft.position.set(-2.9, 1.96, -7.0);
    wallBackLeft.castShadow = true;
    wallBackLeft.receiveShadow = true;

    const wallBackRightSide = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.7, 0.26), M.wallSatin);
    wallBackRightSide.position.set(6.0, 1.96, -7.0);
    wallBackRightSide.castShadow = true;
    wallBackRightSide.receiveShadow = true;

    const wallBackWinTop = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.0, 0.26), M.wallSatin);
    wallBackWinTop.position.set(3.1, 3.31, -7.0);
    const wallBackWinBot = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.1, 0.26), M.wallSatin);
    wallBackWinBot.position.set(3.1, 0.66, -7.0);

    // Marco y cristal transparente de ventana trasera (Estudio)
    const winBackGlass = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.6), M.glassClear);
    winBackGlass.position.set(3.1, 2.01, -7.0);
    const winBackMullionV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.6, 0.28), M.crownWhite);
    winBackMullionV.position.set(3.1, 2.01, -7.0);
    const winBackMullionH = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.06, 0.28), M.crownWhite);
    winBackMullionH.position.set(3.1, 2.01, -7.0);

    // Pared lateral izquierda (X = -7.0) con marco de ventana transparente hacia el jardín
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

    // Pared lateral derecha (X = 7.0) en corte escalonado isométrico
    const wallRightA = new THREE.Mesh(new THREE.BoxGeometry(0.26, 3.7, 6.8), M.wallSatin);
    wallRightA.position.set(7.0, 1.96, -3.6);
    wallRightA.castShadow = true;
    wallRightA.receiveShadow = true;

    const wallRightCutaway = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.35, 3.7), M.wallSatin);
    wallRightCutaway.position.set(7.0, 0.78, 1.65);
    wallRightCutaway.castShadow = true;

    // Muro divisorio interior parcial (separa Sala de Estar y Zona de Estudio)
    const wallDivider = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.5, 4.2), M.wallNavyAccent);
    wallDivider.position.set(0.1, 1.86, -4.9);
    wallDivider.castShadow = true;
    wallDivider.receiveShadow = true;

    // Bordillo frontal bajo de corte arquitectónico (permite ver todo el interior sin obstrucción)
    const frontCutawayLeft = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.45, 0.26), M.wallNavyAccent);
    frontCutawayLeft.position.set(-4.2, 0.44, 3.4);
    const frontCutawayRight = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.45, 0.26), M.wallNavyAccent);
    frontCutawayRight.position.set(4.2, 0.44, 3.4);

    // Molduras superiores (crown1, crown2, crown3) y zócalos de madera (base1)
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

    // Cuadro decorativo y pizarra de estudio en paredes interiores
    const paintingFrame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, 0.04), M.woodWalnut);
    paintingFrame.position.set(-5.2, 2.35, -6.84);
    const paintingCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(1.38, 0.83),
      new THREE.MeshStandardMaterial({ map: createPaintingTexture(), roughness: 0.4 })
    );
    paintingCanvas.position.set(-5.2, 2.35, -6.81);
    targetScene.add(paintingFrame, paintingCanvas);

    // Alfombra tejida bajo la sala de estar
    const livingRug = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.018, 3.0),
      new THREE.MeshStandardMaterial({ map: createRugTexture(), roughness: 0.88 })
    );
    livingRug.position.set(-3.6, 0.23, -2.5);
    livingRug.receiveShadow = true;
    targetScene.add(livingRug);

    // --------------------------------------------------------------------------
    // B. ZONA DE ESTUDIO (STUDY ROOM - OBJETOS 1 A 4)
    // --------------------------------------------------------------------------

    // OBJETO 1: "Desk" (Escritorio: tablero de madera con bordes redondeados y 4 patas metálicas cilíndricas)
    const deskGroup = new THREE.Group();
    deskGroup.name = "Desk";

    const desktopCore = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 1.05), M.woodOak);
    desktopCore.position.set(0, 0.96, 0);
    desktopCore.castShadow = true;
    desktopCore.receiveShadow = true;

    // Bordes redondeados cilíndricos en el frente y laterales del tablero
    const frontEdgeBevel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.1, 16), M.woodOak);
    frontEdgeBevel.rotation.z = Math.PI / 2;
    frontEdgeBevel.position.set(0, 0.96, 0.525);
    const backEdgeBevel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.1, 16), M.woodOak);
    backEdgeBevel.rotation.z = Math.PI / 2;
    backEdgeBevel.position.set(0, 0.96, -0.525);
    deskGroup.add(desktopCore, frontEdgeBevel, backEdgeBevel);

    // 4 Patas metálicas cilíndricas con casquillos de latón
    const deskLegCoords = [[-0.92, -0.42], [0.92, -0.42], [-0.92, 0.42], [0.92, 0.42]];
    deskLegCoords.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.022, 0.92, 16), M.metalDark);
      leg.position.set(lx, 0.46, lz);
      leg.castShadow = true;
      const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.024, 0.06, 16), M.metalBrass);
      ferrule.position.set(lx, 0.03, lz);
      deskGroup.add(leg, ferrule);
    });

    // Cajonera lateral integrada con tiradores metálicos
    const drawerBlock = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.56, 0.92), M.woodOak);
    drawerBlock.position.set(0.68, 0.62, 0);
    drawerBlock.castShadow = true;
    const handle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 12), M.metalBrass);
    handle1.rotation.z = Math.PI / 2;
    handle1.position.set(0.68, 0.74, 0.47);
    const handle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 12), M.metalBrass);
    handle2.rotation.z = Math.PI / 2;
    handle2.position.set(0.68, 0.50, 0.47);

    // Teclado, mouse y lámpara de escritorio articulada sobre el escritorio
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

    deskGroup.add(drawerBlock, handle1, handle2, keyboard, mouse, lampBase, lampArm, lampShade, lampBulb);
    deskGroup.position.set(3.5, 0.22, -3.5);
    targetScene.add(deskGroup);
    registerInteractiveGroup(deskGroup, 'desk');

    // OBJETO 2: "Computer Monitor" (Base, soporte vertical y pantalla con material emisivo cian)
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

    // Barra LED cian inferior del monitor
    const mLedBar = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.35, 8), M.emissiveScreen);
    mLedBar.rotation.z = Math.PI / 2;
    mLedBar.position.set(0, 0.17, 0.046);

    monitorGroup.add(mBase, mStand, mNeck, mFrame, mScreen, mLedBar);
    monitorGroup.position.set(3.45, 1.22, -3.72);
    targetScene.add(monitorGroup);
    registerInteractiveGroup(monitorGroup, 'computer_monitor');

    // OBJETO 3: "Office Chair" (Base de ruedas en estrella, pistón central, asiento acolchado, respaldo curvo y reposabrazos)
    const chairGroup = new THREE.Group();
    chairGroup.name = "Office Chair";

    const cSeat = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.10, 0.56), M.fabricBlue);
    cSeat.position.set(0, 0.58, 0);
    cSeat.castShadow = true;

    // Cojín redondeado frontal del asiento
    const cSeatFront = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.58, 12), M.fabricBlue);
    cSeatFront.rotation.z = Math.PI / 2;
    cSeatFront.position.set(0, 0.58, 0.28);

    // Respaldo curvo ergonómico (cBackGeo)
    const cBackGeo = new THREE.CylinderGeometry(0.32, 0.30, 0.62, 20, 1, true, -Math.PI * 0.35, Math.PI * 0.7);
    const cBack = new THREE.Mesh(
      cBackGeo,
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.52, side: THREE.DoubleSide })
    );
    cBack.position.set(0, 0.95, 0.02);
    cBack.castShadow = true;

    // Cabecero ergonómico superior
    const cHeadrest = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.08), M.leatherDark);
    cHeadrest.position.set(0, 1.32, 0.28);

    // 2 Reposabrazos curvos
    [-0.31, 0.31].forEach(ax => {
      const armPost = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.24, 10), M.metalDark);
      armPost.position.set(ax, 0.68, 0.04);
      const armPad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.035, 0.28), M.leatherDark);
      armPad.position.set(ax, 0.80, 0.04);
      chairGroup.add(armPost, armPad);
    });

    // Pistón neumático central
    const cPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 0.38, 16), M.metalChrome);
    cPillar.position.set(0, 0.34, 0);

    // Base de 5 patas en estrella con ruedas giratorias
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

    // OBJETO 4: "Bookshelf" (Estructura vertical con repisas llenas de libros individuales de colores e inclinaciones)
    const shelfGroup = new THREE.Group();
    shelfGroup.name = "Bookshelf";

    const sSideL = new THREE.Mesh(new THREE.BoxGeometry(0.46, 3.0, 0.06), M.woodWalnut);
    sSideL.position.set(0, 1.5, -1.0);
    sSideL.castShadow = true;
    const sSideR = new THREE.Mesh(new THREE.BoxGeometry(0.46, 3.0, 0.06), M.woodWalnut);
    sSideR.position.set(0, 1.5, 1.0);
    sSideR.castShadow = true;
    const sBack = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.0, 2.06), M.woodDark);
    sBack.position.set(0.22, 1.5, 0);
    sBack.castShadow = true;
    const sTopCrown = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 2.12), M.woodWalnut);
    sTopCrown.position.set(0, 3.02, 0);
    shelfGroup.add(sSideL, sSideR, sBack, sTopCrown);

    const bookColors = [0xdc2626, 0x2563eb, 0x059669, 0xd97706, 0x7c3aed, 0xdb2777, 0x0891b2, 0xeab308, 0x4f46e5, 0x0f766e];
    for (let s = 0; s < 4; s++) {
      const sy = 0.22 + s * 0.72;
      const shelfBoard = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.05, 1.96), M.woodWalnut);
      shelfBoard.position.set(0, sy, 0);
      shelfGroup.add(shelfBoard);

      const numBooks = 8;
      for (let b = 0; b < numBooks; b++) {
        const bColor = bookColors[(s * 5 + b) % bookColors.length];
        const bMat = new THREE.MeshStandardMaterial({ color: bColor, roughness: 0.42, metalness: 0.05 });
        const bH = 0.38 + ((b * 3 + s) % 4) * 0.045;
        const bThick = 0.052 + (b % 3) * 0.014;
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.32, bH, bThick), bMat);
        const bz = -0.80 + b * 0.22;
        book.position.set(-0.02, sy + 0.025 + bH / 2, bz);
        if (b === numBooks - 1) {
          book.rotation.x = 0.22;
          book.position.z += 0.04;
        } else if (b === 3 && s % 2 === 1) {
          book.rotation.x = -0.12;
        }
        book.castShadow = true;
        shelfGroup.add(book);
      }
    }

    shelfGroup.position.set(6.55, 0.22, -3.5);
    targetScene.add(shelfGroup);
    registerInteractiveGroup(shelfGroup, 'bookshelf');

    // --------------------------------------------------------------------------
    // C. ZONA DE SALA (LIVING ROOM - OBJETOS 5 A 9)
    // --------------------------------------------------------------------------

    // OBJETO 5: "Sofa" (Base, cojines de asiento individuales, respaldo capitoneado, brazos laterales y 2 cojines en contraste)
    const sofaGroup = new THREE.Group();
    sofaGroup.name = "Sofa";

    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.28, 1.08), M.fabricNavyTufted);
    sofaBase.position.y = 0.34;
    sofaBase.castShadow = true;
    sofaBase.receiveShadow = true;

    // 4 Patas cónicas de madera y casquillos de latón
    [[-1.30, -0.44], [1.30, -0.44], [-1.30, 0.44], [1.30, 0.44]].forEach(([sx, sz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.022, 0.20, 12), M.woodDark);
      leg.position.set(sx, 0.10, sz);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.022, 0.04, 12), M.metalBrass);
      cap.position.set(sx, 0.02, sz);
      sofaGroup.add(leg, cap);
    });

    // 3 Cojines de asiento individuales + respaldo capitoneado con botones
    for (let c = 0; c < 3; c++) {
      const cx = -0.88 + c * 0.88;
      const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.18, 0.90), M.fabricBlue);
      seatCushion.position.set(cx, 0.55, 0.06);
      seatCushion.castShadow = true;

      const backCushion = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.56, 0.24), M.fabricBlue);
      backCushion.position.set(cx, 0.88, -0.38);
      backCushion.rotation.x = -0.10;
      backCushion.castShadow = true;

      // Botones de capitoneado en el respaldo
      [-0.20, 0.20].forEach(bx => {
        const tuftBtn = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), M.fabricGold);
        tuftBtn.position.set(cx + bx, 0.88, -0.25);
        sofaGroup.add(tuftBtn);
      });

      sofaGroup.add(seatCushion, backCushion);
    }

    // Brazos laterales redondeados
    [-1.42, 1.42].forEach(ax => {
      const armBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.52, 1.08), M.fabricNavyTufted);
      armBox.position.set(ax, 0.56, 0);
      armBox.castShadow = true;
      const armRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.08, 16), M.fabricBlue);
      armRoll.rotation.x = Math.PI / 2;
      armRoll.position.set(ax, 0.82, 0);
      sofaGroup.add(armBox, armRoll);
    });

    // 2 Cojines decorativos en contraste (Dorado y Terracota)
    const throwPillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.38, 0.15), M.fabricGold);
    throwPillow1.position.set(-1.10, 0.72, 0.10);
    throwPillow1.rotation.set(0.12, 0.28, -0.10);
    throwPillow1.castShadow = true;

    const throwPillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.38, 0.15), M.fabricTerracotta);
    throwPillow2.position.set(1.10, 0.72, 0.10);
    throwPillow2.rotation.set(0.12, -0.28, 0.10);
    throwPillow2.castShadow = true;

    sofaGroup.add(sofaBase, throwPillow1, throwPillow2);
    sofaGroup.position.set(-3.6, 0.22, -4.1);
    targetScene.add(sofaGroup);
    registerInteractiveGroup(sofaGroup, 'sofa');

    // OBJETO 6: "Coffee Table" (Mesa de centro baja con taza de cerámica "Coffee Mug" encima)
    const tableGroup = new THREE.Group();
    tableGroup.name = "Coffee Table";

    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.88, 0.06, 32), M.woodWalnut);
    tableTop.position.y = 0.48;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;

    const tableRim = new THREE.Mesh(new THREE.TorusGeometry(0.90, 0.025, 12, 32), M.metalBrass);
    tableRim.rotation.x = Math.PI / 2;
    tableRim.position.y = 0.48;
    tableGroup.add(tableTop, tableRim);

    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2 + Math.PI / 4;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.016, 0.46, 12), M.metalDark);
      leg.position.set(Math.cos(ang) * 0.62, 0.23, Math.sin(ang) * 0.62);
      leg.castShadow = true;
      tableGroup.add(leg);
    }

    // Taza de cerámica ("Coffee Mug") sobre la mesa de centro
    const mugGroup = new THREE.Group();
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.018, 20), M.ceramicWhite);
    saucer.position.y = 0.52;
    const mugBody = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.068, 0.13, 20), M.ceramicWhite);
    mugBody.position.y = 0.59;
    mugBody.castShadow = true;
    const coffeeSurface = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.01, 16), M.coffeeLiquid);
    coffeeSurface.position.y = 0.652;
    const mugHandle = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.012, 10, 20), M.ceramicWhite);
    mugHandle.position.set(0.082, 0.59, 0);
    mugHandle.rotation.y = Math.PI / 2;

    // Vapor humeante animado sobre la taza
    [0.06, 0.13, 0.20].forEach((sy, idx) => {
      const steamRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.024 + idx * 0.008, 0.006, 8, 16, Math.PI * 1.3),
        M.steamTranslucent
      );
      steamRing.rotation.x = Math.PI / 2;
      steamRing.position.set(0, 0.67 + sy, 0);
      steamRing.userData.baseY = 0.67 + sy;
      steamRing.userData.phase = idx * 1.4;
      mugGroup.add(steamRing);
      animatedSteamRings.push(steamRing);
    });

    mugGroup.add(saucer, mugBody, coffeeSurface, mugHandle);
    mugGroup.position.set(0.18, 0, 0.08);

    // Libro decorativo junto a la taza
    const artBook = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.045, 0.26), M.fabricGold);
    artBook.position.set(-0.24, 0.53, -0.08);
    artBook.rotation.y = 0.25;

    tableGroup.add(mugGroup, artBook);
    tableGroup.position.set(-3.6, 0.22, -2.0);
    targetScene.add(tableGroup);
    registerInteractiveGroup(tableGroup, 'coffee_table');

    // OBJETO 7: "Floor Lamp" (Base circular, poste alto delgado, pantalla cónica translúcida y PointLight cálida)
    const floorLampGroup = new THREE.Group();
    floorLampGroup.name = "Floor Lamp";

    const flBase = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.34, 0.05, 24), M.metalBrass);
    flBase.position.y = 0.025;
    flBase.castShadow = true;

    const flPole = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 2.05, 16), M.metalBrass);
    flPole.position.y = 1.05;
    flPole.castShadow = true;

    const flRing = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.012, 10, 20), M.metalBrass);
    flRing.rotation.x = Math.PI / 2;
    flRing.position.y = 1.65;

    floorLampShadeMat = M.lampShadeWarm.clone();
    const flShade = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.52, 24, 1, true), floorLampShadeMat);
    flShade.position.y = 2.08;
    flShade.castShadow = true;

    const flBulb = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), M.emissiveBulb);
    flBulb.position.y = 1.98;

    floorLampPointLight = new THREE.PointLight(0xffaa44, 1.8, 12.0);
    floorLampPointLight.position.set(0, 1.95, 0);
    floorLampPointLight.castShadow = true;
    floorLampPointLight.shadow.bias = -0.001;

    floorLampGroup.add(flBase, flPole, flRing, flShade, flBulb, floorLampPointLight);
    floorLampGroup.position.set(-5.8, 0.22, -4.5);
    targetScene.add(floorLampGroup);
    registerInteractiveGroup(floorLampGroup, 'floor_lamp');

    // OBJETO 8: "Wall Clock" (Marco circular, carátula blanca y manecillas de hora y minuto)
    const clockGroup = new THREE.Group();
    clockGroup.name = "Wall Clock";

    const clockRim = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.045, 16, 32), M.woodWalnut);
    const clockBrassBezel = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.015, 12, 32), M.metalBrass);
    clockBrassBezel.position.z = 0.02;

    const clockBackPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.04, 32), M.ceramicWhite);
    clockBackPlate.rotation.x = Math.PI / 2;

    const clockDial = new THREE.Mesh(
      new THREE.CircleGeometry(0.35, 32),
      new THREE.MeshStandardMaterial({ map: createClockFaceTexture(), roughness: 0.2 })
    );
    clockDial.position.z = 0.025;

    // Manecillas 3D (Hora y Minuto)
    const hourHandPivot = new THREE.Group();
    hourHandPivot.position.z = 0.035;
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.18, 0.01), M.ironBlack);
    hourHand.position.y = 0.07;
    hourHandPivot.add(hourHand);
    hourHandPivot.rotation.z = -Math.PI / 3;

    const minuteHandPivot = new THREE.Group();
    minuteHandPivot.position.z = 0.042;
    const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.26, 0.01), M.ironBlack);
    minuteHand.position.y = 0.11;
    minuteHandPivot.add(minuteHand);
    minuteHandPivot.rotation.z = Math.PI / 6;

    const centerPin = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), M.metalBrass);
    centerPin.position.z = 0.05;

    animatedClockHourHand = hourHandPivot;
    animatedClockMinuteHand = minuteHandPivot;

    clockGroup.add(clockRim, clockBrassBezel, clockBackPlate, clockDial, hourHandPivot, minuteHandPivot, centerPin);
    clockGroup.position.set(-3.6, 2.65, -6.82);
    targetScene.add(clockGroup);
    registerInteractiveGroup(clockGroup, 'wall_clock');

    // OBJETO 9: "Indoor Plant" (Maceta de terracota con tallos y hojas verdes escalonadas)
    const plantGroup = new THREE.Group();
    plantGroup.name = "Indoor Plant";

    const potSaucer = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.04, 20), M.terracottaPot);
    potSaucer.position.y = 0.02;
    const potBody = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.21, 0.48, 20), M.terracottaPot);
    potBody.position.y = 0.26;
    potBody.castShadow = true;
    const potRim = new THREE.Mesh(new THREE.TorusGeometry(0.30, 0.03, 12, 24), M.terracottaPot);
    potRim.rotation.x = Math.PI / 2;
    potRim.position.y = 0.49;
    const potSoil = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 16), M.soilDark);
    potSoil.position.y = 0.47;

    plantGroup.add(potSaucer, potBody, potRim, potSoil);

    // Tallos y hojas verdes escalonadas
    const leafConfigs = [
      { h: 0.45, ang: 0.0, tilt: 0.35, scale: 1.0, mat: M.leafGreen2 },
      { h: 0.58, ang: 1.1, tilt: 0.42, scale: 1.1, mat: M.leafGreen3 },
      { h: 0.70, ang: 2.2, tilt: 0.38, scale: 0.95, mat: M.leafGreen1 },
      { h: 0.82, ang: 3.3, tilt: 0.45, scale: 1.15, mat: M.leafGreen4 },
      { h: 0.94, ang: 4.4, tilt: 0.30, scale: 1.05, mat: M.leafGreen2 },
      { h: 1.06, ang: 5.5, tilt: 0.22, scale: 0.90, mat: M.leafGreen3 },
      { h: 1.18, ang: 0.6, tilt: 0.15, scale: 0.85, mat: M.leafGreen4 }
    ];

    leafConfigs.forEach(cfg => {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.022, cfg.h, 8), M.leafGreen1);
      stem.position.set(Math.cos(cfg.ang) * 0.06, 0.46 + cfg.h / 2, Math.sin(cfg.ang) * 0.06);
      stem.rotation.z = Math.cos(cfg.ang) * 0.18;
      stem.rotation.x = Math.sin(cfg.ang) * 0.18;

      const leafBlade = new THREE.Mesh(new THREE.SphereGeometry(0.18 * cfg.scale, 12, 10), cfg.mat);
      leafBlade.scale.set(1.35, 0.18, 0.85);
      leafBlade.position.set(
        Math.cos(cfg.ang) * (0.18 + cfg.h * 0.15),
        0.46 + cfg.h,
        Math.sin(cfg.ang) * (0.18 + cfg.h * 0.15)
      );
      leafBlade.rotation.y = -cfg.ang;
      leafBlade.rotation.z = cfg.tilt;
      leafBlade.castShadow = true;

      plantGroup.add(stem, leafBlade);
    });

    plantGroup.position.set(-1.2, 0.22, -5.5);
    targetScene.add(plantGroup);
    registerInteractiveGroup(plantGroup, 'indoor_plant');

    // Ventilador de techo rotatorio decorativo
    const fanGroup = new THREE.Group();
    const fMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.10, 18), M.metalChrome);
    fMotor.position.y = 3.55;
    const rotor = new THREE.Group();
    rotor.position.y = 3.55;
    for (let f = 0; f < 4; f++) {
      const ang = (f * Math.PI) / 2;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.016, 0.16), M.woodWalnut);
      blade.position.set(Math.cos(ang) * 0.54, 0, Math.sin(ang) * 0.54);
      blade.rotation.y = -ang;
      rotor.add(blade);
    }
    fanGroup.add(fMotor, rotor);
    fanGroup.position.set(-3.6, 0, -2.5);
    targetScene.add(fanGroup);
    animatedFan = rotor;
    threeAnimatedObjects.fan = rotor;

    // --------------------------------------------------------------------------
    // D. JARDÍN EXTERIOR DETALLADO (GARDEN & YARD - OBJETOS 10 A 14)
    // --------------------------------------------------------------------------

    // Sendero de losas de piedra irregulares ("Stone Path") desde la entrada hasta la puerta
    const pathGroup = new THREE.Group();
    pathGroup.name = "Stone Path";
    const pathCoords = [
      [0.0, 4.6], [-0.25, 5.7], [0.20, 6.8], [-0.15, 7.9],
      [0.25, 9.0], [-0.10, 10.1], [0.15, 11.2], [0.0, 12.3]
    ];
    pathCoords.forEach(([px, pz], idx) => {
      const paver = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45 + (idx % 3) * 0.08, 0.50, 0.06, 7),
        M.stonePaver
      );
      paver.position.set(px, 0.03, pz);
      paver.rotation.y = idx * 0.85;
      paver.receiveShadow = true;
      pathGroup.add(paver);
    });
    targetScene.add(pathGroup);

    // Cerca perimetral blanca ("Picket Fence") rodeando la propiedad con entrada abierta
    const fenceGroup = new THREE.Group();
    fenceGroup.name = "Picket Fence";

    function createPicketSection(length, startPos, rotY) {
      const section = new THREE.Group();
      const numPickets = Math.floor(length / 0.34);
      for (let p = 0; p < numPickets; p++) {
        const px = -length / 2 + p * 0.34 + 0.17;
        const picket = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.12, 0.028), M.picketWhite);
        picket.position.set(px, 0.56, 0);
        picket.castShadow = true;
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.092, 0.18, 4), M.picketWhite);
        tip.rotation.y = Math.PI / 4;
        tip.position.set(px, 1.21, 0);
        section.add(picket, tip);
      }
      const rail1 = new THREE.Mesh(new THREE.BoxGeometry(length, 0.065, 0.035), M.picketWhite);
      rail1.position.set(0, 0.36, 0);
      const rail2 = new THREE.Mesh(new THREE.BoxGeometry(length, 0.065, 0.035), M.picketWhite);
      rail2.position.set(0, 0.88, 0);
      section.add(rail1, rail2);
      section.position.set(startPos.x, startPos.y, startPos.z);
      section.rotation.y = rotY;
      return section;
    }

    // Tramos frontales con abertura para el sendero de entrada y tramos laterales
    fenceGroup.add(createPicketSection(11.5, { x: -8.2, y: 0, z: 13.5 }, 0));
    fenceGroup.add(createPicketSection(11.5, { x: 8.2, y: 0, z: 13.5 }, 0));
    fenceGroup.add(createPicketSection(22.0, { x: -14.0, y: 0, z: 2.5 }, Math.PI / 2));
    fenceGroup.add(createPicketSection(22.0, { x: 14.0, y: 0, z: 2.5 }, Math.PI / 2));
    targetScene.add(fenceGroup);

    // OBJETO 10: "Oak Tree" (Árbol de roble: tronco orgánico inclinado con ramas y copa frondosa de esferas facetadas)
    const oakTreesMasterGroup = new THREE.Group();
    oakTreesMasterGroup.name = "Oak Tree";

    const treePositions = [
      { x: -8.5, z: 7.5, scale: 1.22, rot: 0.08 },
      { x: 9.8, z: 6.8, scale: 1.12, rot: -0.10 },
      { x: -10.5, z: -4.2, scale: 1.18, rot: 0.06 }
    ];

    treePositions.forEach(tp => {
      const tree = new THREE.Group();

      // Tronco orgánico inclinado
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32 * tp.scale, 0.56 * tp.scale, 3.6 * tp.scale, 12),
        M.trunkBark
      );
      trunk.position.y = 1.8 * tp.scale;
      trunk.rotation.z = tp.rot;
      trunk.castShadow = true;
      trunk.receiveShadow = true;

      // Raíces visibles en la base
      for (let r = 0; r < 4; r++) {
        const rAng = (r * Math.PI) / 2 + 0.35;
        const root = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.20, 0.85 * tp.scale, 8), M.trunkBark);
        root.position.set(Math.cos(rAng) * 0.45 * tp.scale, 0.18, Math.sin(rAng) * 0.45 * tp.scale);
        root.rotation.z = Math.cos(rAng) * 0.65;
        root.rotation.x = Math.sin(rAng) * 0.65;
        tree.add(root);
      }

      // Ramas principales
      const branch1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * tp.scale, 0.24 * tp.scale, 1.7 * tp.scale, 8), M.trunkBark);
      branch1.rotation.z = Math.PI / 4.2;
      branch1.position.set(0.58 * tp.scale, 2.9 * tp.scale, 0);
      const branch2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * tp.scale, 0.24 * tp.scale, 1.7 * tp.scale, 8), M.trunkBark);
      branch2.rotation.z = -Math.PI / 4.2;
      branch2.position.set(-0.58 * tp.scale, 2.8 * tp.scale, 0.25 * tp.scale);
      tree.add(trunk, branch1, branch2);

      // Copa frondosa multifacética en distintos tonos de verde
      const foliageSpheres = [
        [0, 4.1 * tp.scale, 0, 1.68 * tp.scale, M.leafGreen1],
        [0.95 * tp.scale, 3.65 * tp.scale, 0.42 * tp.scale, 1.28 * tp.scale, M.leafGreen2],
        [-0.95 * tp.scale, 3.55 * tp.scale, -0.35 * tp.scale, 1.28 * tp.scale, M.leafGreen3],
        [0.28 * tp.scale, 4.75 * tp.scale, -0.42 * tp.scale, 1.38 * tp.scale, M.leafGreen4],
        [-0.35 * tp.scale, 4.55 * tp.scale, 0.55 * tp.scale, 1.32 * tp.scale, M.leafGreen2],
        [0.0, 3.8 * tp.scale, 0.95 * tp.scale, 1.18 * tp.scale, M.leafGreen3]
      ];
      foliageSpheres.forEach(([fx, fy, fz, fr, fMat]) => {
        const canopyPart = new THREE.Mesh(new THREE.DodecahedronGeometry(fr, 1), fMat);
        canopyPart.position.set(fx, fy, fz);
        canopyPart.castShadow = true;
        canopyPart.receiveShadow = true;
        tree.add(canopyPart);
      });

      tree.position.set(tp.x, 0, tp.z);
      oakTreesMasterGroup.add(tree);
    });

    targetScene.add(oakTreesMasterGroup);
    registerInteractiveGroup(oakTreesMasterGroup, 'oak_tree');

    // OBJETO 11: "Park Bench" (Banca de jardín: listones de madera en asiento y respaldo con soportes de hierro forjado negro)
    const benchGroup = new THREE.Group();
    benchGroup.name = "Park Bench";

    // 5 Listones individuales de madera en el asiento
    for (let s = 0; s < 5; s++) {
      const slatSeat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.045, 0.095), M.woodPine);
      slatSeat.position.set(0, 0.46, -0.20 + s * 0.105);
      slatSeat.castShadow = true;
      slatSeat.receiveShadow = true;
      benchGroup.add(slatSeat);
    }

    // 4 Listones individuales de madera en el respaldo
    for (let b = 0; b < 4; b++) {
      const slatBack = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.09, 0.04), M.woodPine);
      slatBack.position.set(0, 0.62 + b * 0.115, -0.26 - b * 0.015);
      slatBack.rotation.x = -0.14;
      slatBack.castShadow = true;
      benchGroup.add(slatBack);
    }

    // Soportes laterales y reposabrazos curvos de hierro forjado negro
    [-0.92, 0.92].forEach(bx => {
      const legFront = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.028, 0.46, 12), M.ironBlack);
      legFront.position.set(bx, 0.23, 0.20);
      const legBack = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.028, 1.02, 12), M.ironBlack);
      legBack.position.set(bx, 0.51, -0.24);
      legBack.rotation.x = -0.08;
      const seatFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.54), M.ironBlack);
      seatFrame.position.set(bx, 0.43, -0.02);
      const armRest = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.024, 10, 20, Math.PI), M.ironBlack);
      armRest.rotation.y = Math.PI / 2;
      armRest.position.set(bx, 0.52, -0.02);
      benchGroup.add(legFront, legBack, seatFrame, armRest);
    });

    benchGroup.position.set(-4.5, 0, 7.5);
    benchGroup.rotation.y = 0.35;
    targetScene.add(benchGroup);
    registerInteractiveGroup(benchGroup, 'park_bench');

    // OBJETO 12: "Street Lantern" (Farol de jardín: poste clásico negro, cabezal de cristal brillante y SpotLight cálida)
    const lanternGroup = new THREE.Group();
    lanternGroup.name = "Street Lantern";

    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.38, 8), M.ironBlack);
    plinth.position.y = 0.19;
    plinth.castShadow = true;

    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 2.85, 16), M.ironBlack);
    column.position.y = 1.78;
    column.castShadow = true;

    const ringDeco = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 10, 20), M.metalBrass);
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

    // SpotLight cálida que proyecta luz sobre el pasto y el sendero
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

    // OBJETO 13: "Flower Bush" (Arbusto floral: follaje denso salpicado de pequeñas esferas de colores vivos)
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

    // OBJETO 14: "Mailbox" (Buzón americano: poste de madera en la entrada con buzón superior y banderilla roja lateral)
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

    // Cuerpo del buzón americano (base rectangular + bóveda cilíndrica superior)
    const mbBoxLower = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.62), M.mailboxBlue);
    mbBoxLower.position.set(0, 1.19, 0.10);
    mbBoxLower.castShadow = true;

    const mbVaultTop = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.62, 16), M.mailboxBlue);
    mbVaultTop.rotation.x = Math.PI / 2;
    mbVaultTop.position.set(0, 1.28, 0.10);
    mbVaultTop.castShadow = true;

    // Compuerta frontal y tirador cromado
    const mbDoor = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.02, 16), M.metalChrome);
    mbDoor.rotation.x = Math.PI / 2;
    mbDoor.position.set(0, 1.28, 0.415);
    const mbHandle = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 8, 12, Math.PI), M.metalChrome);
    mbHandle.position.set(0, 1.32, 0.425);

    // Banderilla roja lateral ("Red Flag")
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

    // Aspersor de jardín animado complementario
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
  // 6. ILUMINACIÓN CINEMÁTICA PBR Y CICLO DÍA / NOCHE
  // ============================================================================
  function setupCinematicLighting(targetScene) {
    // 1. HemisphereLight para relleno ambiental global
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x202035, 1.2);
    targetScene.add(hemiLight);
    globalHemiLight = hemiLight;

    // 2. DirectionalLight principal con sombras suaves (1024x1024)
    const dirLight = new THREE.DirectionalLight(0xfff2dd, 1.8);
    dirLight.position.set(12, 20, 10);
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

    // 3. Luz cálida puntual (PointLight) en el interior de la casa para simular lámparas de estudio
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

    if (isNightMode) {
      // Modo Noche: Cielo nocturno azul profundo, niebla suave y luces puntuales encendidas
      scene.background = new THREE.Color(0x0a0e17);
      scene.fog = new THREE.FogExp2(0x0a0e17, 0.012);

      if (globalHemiLight) {
        globalHemiLight.color.setHex(0x38bdf8);
        globalHemiLight.groundColor.setHex(0x090d16);
        globalHemiLight.intensity = 0.48;
      }
      if (globalDirLight) {
        globalDirLight.color.setHex(0x93c5fd);
        globalDirLight.intensity = 0.55;
        globalDirLight.position.set(-10, 18, -8);
      }

      // Encender automáticamente el farol del jardín, la lámpara de la sala, el estudio y el monitor
      if (streetLanternSpotLight) streetLanternSpotLight.intensity = 3.6;
      if (streetLanternPointLight) streetLanternPointLight.intensity = 1.8;
      if (streetLanternBulbMat) streetLanternBulbMat.emissiveIntensity = 2.8;
      if (floorLampPointLight) floorLampPointLight.intensity = 2.4;
      if (floorLampShadeMat) floorLampShadeMat.emissiveIntensity = 1.25;
      if (studyPointLight) studyPointLight.intensity = 2.2;
      if (monitorScreenMaterial) monitorScreenMaterial.emissiveIntensity = 1.35;
    } else {
      // Modo Día: Cielo celeste soleado luminoso y luces artificiales atenuadas
      scene.background = new THREE.Color(0x38bdf8);
      scene.fog = new THREE.FogExp2(0x38bdf8, 0.006);

      if (globalHemiLight) {
        globalHemiLight.color.setHex(0xddeeff);
        globalHemiLight.groundColor.setHex(0x2d5a27);
        globalHemiLight.intensity = 1.35;
      }
      if (globalDirLight) {
        globalDirLight.color.setHex(0xfff2dd);
        globalDirLight.intensity = 1.85;
        globalDirLight.position.set(12, 20, 10);
      }

      // Atenuar/apagar luces artificiales durante el día
      if (streetLanternSpotLight) streetLanternSpotLight.intensity = 0.0;
      if (streetLanternPointLight) streetLanternPointLight.intensity = 0.0;
      if (streetLanternBulbMat) streetLanternBulbMat.emissiveIntensity = 0.25;
      if (floorLampPointLight) floorLampPointLight.intensity = 0.35;
      if (floorLampShadeMat) floorLampShadeMat.emissiveIntensity = 0.20;
      if (studyPointLight) studyPointLight.intensity = 0.65;
      if (monitorScreenMaterial) monitorScreenMaterial.emissiveIntensity = 0.80;
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
  // 7. HUD DE CONTROL 3D, PROGRESO (X / 14) Y TARJETA DE VOCABULARIO GAMIFICADA
  // ============================================================================
  function updateProgressHudCounter() {
    const count = Math.min(TOTAL_INTERACTIVE_OBJECTS, discoveredObjectIds.size);
    const learnedCount = Math.min(TOTAL_INTERACTIVE_OBJECTS, learnedObjectIds.size);

    const counterEl = typeof document !== 'undefined' ? document.getElementById('world3dProgressCounter') : null;
    if (counterEl) {
      counterEl.textContent = `Objetos descubiertos: ${count} / ${TOTAL_INTERACTIVE_OBJECTS}`;
    }
    const barEl = typeof document !== 'undefined' ? document.getElementById('world3dProgressBarFill') : null;
    if (barEl) {
      const pct = Math.round((count / TOTAL_INTERACTIVE_OBJECTS) * 100);
      barEl.style.width = `${pct}%`;
    }
    const subBadgeEl = typeof document !== 'undefined' ? document.getElementById('world3dLearnedSubBadge') : null;
    if (subBadgeEl) {
      subBadgeEl.textContent = `Aprendidos: ${learnedCount}/${TOTAL_INTERACTIVE_OBJECTS}`;
    }
  }

  function ensureWorld3DHudElements(containerEl) {
    if (typeof document === 'undefined' || !containerEl) return;

    // 1. Barra de control HUD superior/inferior dentro del visor 3D
    let hudBar = document.getElementById('world3dControlHudBar');
    if (!hudBar) {
      hudBar = document.createElement('div');
      hudBar.id = 'world3dControlHudBar';
      hudBar.style.cssText = 'position: absolute; top: 12px; left: 12px; right: 12px; z-index: 45; pointer-events: none; display: flex; flex-direction: column; gap: 8px;';
      hudBar.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2" style="pointer-events: auto;">
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" onclick="if(typeof goToHomePortals === 'function'){ goToHomePortals(); } else if(typeof showView === 'function'){ showView('view-home'); }"
              class="px-3.5 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700/90 text-xs font-extrabold shadow-xl flex items-center gap-1.5 cursor-pointer transition active:scale-95">
              <span>← Volver a Portales</span>
            </button>

            <button type="button" id="world3dDayNightBtn" onclick="window.toggleWorld3DDayNight()"
              class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border border-purple-400/50 text-xs font-extrabold shadow-xl flex items-center gap-1.5 cursor-pointer transition active:scale-95">
              <span>☀️ Día / 🌙 Noche</span>
            </button>
          </div>

          <div class="flex items-center gap-2.5 bg-slate-900/95 backdrop-blur-md border border-purple-500/50 px-3.5 py-1.5 rounded-xl shadow-xl">
            <div class="flex flex-col">
              <span id="world3dProgressCounter" class="text-xs font-black text-white">Objetos descubiertos: 0 / 14</span>
              <span id="world3dLearnedSubBadge" class="text-[10px] font-bold text-emerald-400">Aprendidos: 0/14 (+10 EXP c/u)</span>
            </div>
            <div class="w-20 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div id="world3dProgressBarFill" class="h-full bg-gradient-to-r from-purple-500 via-sky-400 to-emerald-400 transition-all duration-300" style="width: 0%;"></div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-1.5" style="pointer-events: auto;">
          <button type="button" onclick="window.focusWorld3DZone('overview')"
            class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-purple-600/90 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
            🏠 Vista General
          </button>
          <button type="button" onclick="window.focusWorld3DZone('living')"
            class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-purple-600/90 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
            🛋️ Ir a la Sala
          </button>
          <button type="button" onclick="window.focusWorld3DZone('study')"
            class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-purple-600/90 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
            💻 Ir al Estudio
          </button>
          <button type="button" onclick="window.focusWorld3DZone('garden')"
            class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-emerald-600/90 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95">
            🌳 Ir al Jardín
          </button>
        </div>
      `;
      containerEl.appendChild(hudBar);
    }

    // 2. Tarjeta flotante HUD de Vocabulario 3D (z-index superior)
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
              <span>🏠 Ver toda la casa</span>
            </button>
          </div>
        </div>
      `;
      containerEl.appendChild(vocabCard);
    }

    updateProgressHudCounter();
  }

  // ============================================================================
  // 8. TRANSICIONES DE CÁMARA (LERP), HIGHLIGHT EMISIVO E INTERACCIÓN RAYCASTER
  // ============================================================================
  function transitionCameraTo(posCoords, lookAtCoords) {
    if (typeof THREE === 'undefined' || !camera || !controls) return;
    cameraLerp.targetPos.set(posCoords.x, posCoords.y, posCoords.z);
    cameraLerp.targetLookAt.set(lookAtCoords.x, lookAtCoords.y, lookAtCoords.z);
    cameraLerp.active = true;
  }

  function focusWorld3DZone(zoneKey) {
    const zone = CAMERA_ZONES[zoneKey] || CAMERA_ZONES.overview;
    transitionCameraTo(zone.pos, zone.lookAt);

    // Actualizar botones legacy si existen
    const btnHouse = typeof document !== 'undefined' ? document.getElementById('scenarioBtnHouse') : null;
    const btnGarden = typeof document !== 'undefined' ? document.getElementById('scenarioBtnGarden') : null;
    if (btnHouse && btnGarden) {
      if (zoneKey === 'garden') {
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

  function highlightSelectedObject(group) {
    clearSelectedHighlight();
    if (!group) return;
    selectedObjectGroup = group;
    highlightPulseTime = 0;

    group.traverse(child => {
      if (child.isMesh && child.material && child.material.clone) {
        const origMat = child.material;
        const clonedMat = origMat.clone();
        if (clonedMat.emissive) {
          clonedMat.emissive.setHex(0x38bdf8);
          clonedMat.emissiveIntensity = 0.55;
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

    // 1. Registrar objeto como descubierto
    discoveredObjectIds.add(data.id);
    saveProgressToStorage();
    updateProgressHudCounter();

    // 2. Iluminar objeto seleccionado (efecto highlight emisivo suave)
    highlightSelectedObject(group);

    // 3. Transición suave de cámara (Lerp) acercando el enfoque hacia el objeto
    if (data.focusPos && data.lookAtPos) {
      transitionCameraTo(data.focusPos, data.lookAtPos);
    }

    // 4. Mostrar tarjeta flotante HUD y pronunciar palabra en inglés
    renderVocabHudCard(data);
    speakWorld3DText(data.wordEn);
  }

  function renderVocabHudCard(data) {
    if (typeof document === 'undefined' || !data) return;

    const isLearned = learnedObjectIds.has(data.id);

    // Actualizar tarjeta HUD dinámica
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

    // Sincronizar también tarjeta legacy (#threeObjectInspectCard) por compatibilidad
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
    if (typeof document === 'undefined') return;
    const vocabCard = document.getElementById('world3dVocabHudCard');
    if (vocabCard) {
      vocabCard.classList.add('hidden');
      vocabCard.style.display = 'none';
    }
    const legacyCard = document.getElementById('threeObjectInspectCard');
    if (legacyCard) {
      legacyCard.classList.add('hidden');
    }
  }

  function speakWorld3DText(text) {
    if (!text) return;
    const cleanWord = String(text).split('/')[0].trim();
    if (typeof global.speakText === 'function') {
      global.speakText(cleanWord);
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(cleanWord);
        u.lang = 'en-US';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      } catch (e) { }
    }
  }

  function speakWorld3DObject() {
    if (!selectedObjectData) return;
    speakWorld3DText(`${selectedObjectData.wordEn}. ${selectedObjectData.example}`);
  }

  function practiceWorld3DObject() {
    if (!selectedObjectData) return;
    const data = selectedObjectData;

    // Pronunciar palabra modelo en voz alta y otorgar +10 EXP marcando como "Aprendido ✅"
    speakWorld3DText(data.wordEn);

    const alreadyLearned = learnedObjectIds.has(data.id);
    learnedObjectIds.add(data.id);
    discoveredObjectIds.add(data.id);
    saveProgressToStorage();
    updateProgressHudCounter();

    // Otorgar +10 EXP al usuario
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

    function handlePointerDown(e) {
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      downX = clientX;
      downY = clientY;
      downTime = Date.now();
    }

    function handlePointerUp(e) {
      const clientX = e.clientX !== undefined ? e.clientX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : downX);
      const clientY = e.clientY !== undefined ? e.clientY : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : downY);

      const moveDist = Math.hypot(clientX - downX, clientY - downY);
      const elapsed = Date.now() - downTime;

      // Diferenciar arrastre de cámara vs clic/toque limpio (< 10px de desplazamiento)
      if (moveDist > 10 || elapsed > 900) return;

      const rect = domElement.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return;

      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let hitObj = intersects[0].object;
        if (hitObj.userData && hitObj.userData.parentGroup) {
          selectInteractive3DObject(hitObj.userData.parentGroup);
          return;
        }
        while (hitObj.parent && (!hitObj.userData || !hitObj.userData.interactive) && hitObj.parent !== scene) {
          hitObj = hitObj.parent;
        }
        if (hitObj && hitObj.userData && hitObj.userData.interactive) {
          selectInteractive3DObject(hitObj);
        }
      }
    }

    domElement.addEventListener('pointerdown', handlePointerDown, { passive: true });
    domElement.addEventListener('pointerup', handlePointerUp, { passive: true });
  }

  // ============================================================================
  // 9. CICLO DE VIDA DEL MOTOR WEBGL: window.initOrResumeWorld3D()
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
    if (container && container.clientWidth > 60 && container.clientHeight > 60) {
      return { width: container.clientWidth, height: container.clientHeight };
    }
    return {
      width: (typeof window !== 'undefined' && window.innerWidth) ? window.innerWidth : 1024,
      height: (typeof window !== 'undefined' && window.innerHeight) ? window.innerHeight : 640
    };
  }

  function initOrResumeWorld3D() {
    if (typeof THREE === 'undefined') return;
    if (!clock) clock = new THREE.Clock();
    initSharedMaterials();
    isWorldTourActive = true;

    const viewWorldTour = document.getElementById('view-worldtour');
    if (viewWorldTour && (viewWorldTour.style.display === 'none' || viewWorldTour.classList.contains('hidden'))) {
      viewWorldTour.style.display = 'block';
      viewWorldTour.classList.remove('hidden');
    }

    // Obtener contenedor (#world3d-container, #canvas-container, #world3d-canvas, #threeWebGLMount, #threeCanvasContainer)
    let container = document.getElementById('world3d-container') ||
                    document.getElementById('canvas-container') ||
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

    // Limpiar cualquier canvas huérfano previo para evitar fugas de memoria WebGL
    cleanupOrphanCanvases(mountTarget);
    ensureWorld3DHudElements(hudHost);

    // Si el motor ya está inicializado, reanudar y ajustar dimensiones inmediatamente
    if (isEngineInitialized && renderer && scene && camera) {
      if (mountTarget && renderer.domElement.parentNode !== mountTarget) {
        mountTarget.innerHTML = '';
        mountTarget.appendChild(renderer.domElement);
      }
      const dims = getContainerDimensions(hudHost);
      camera.aspect = dims.width / dims.height;
      camera.updateProjectionMatrix();
      renderer.setSize(dims.width, dims.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      if (controls) controls.update();
      updateProgressHudCounter();

      if (!animFrameId) {
        lastFrameTime = performance.now();
        animFrameId = requestAnimationFrame(animate);
      }
      renderer.render(scene, camera);
      return;
    }

    // 1. Escena con fondo e iluminación
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);

    // 2. Cámara con relación de aspecto del contenedor
    const dims = getContainerDimensions(hudHost);
    const width = dims.width;
    const height = dims.height;
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 250);
    camera.position.set(CAMERA_ZONES.overview.pos.x, CAMERA_ZONES.overview.pos.y, CAMERA_ZONES.overview.pos.z);

    // 3. THREE.WebGLRenderer de alto rendimiento con sombras suaves y ACESFilmicToneMapping
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    renderer.domElement.id = 'world3d-canvas';
    renderer.domElement.className = 'w-full h-full block select-none cursor-grab active:cursor-grabbing';
    renderer.domElement.style.setProperty('position', 'absolute', 'important');
    renderer.domElement.style.setProperty('inset', '0', 'important');
    renderer.domElement.style.setProperty('width', '100%', 'important');
    renderer.domElement.style.setProperty('height', '100%', 'important');
    renderer.domElement.style.setProperty('z-index', '5', 'important');
    renderer.domElement.style.setProperty('display', 'block', 'important');
    renderer.domElement.style.setProperty('pointer-events', 'auto', 'important');
    renderer.domElement.style.setProperty('touch-action', 'none', 'important');

    if (mountTarget) {
      mountTarget.innerHTML = '';
      mountTarget.appendChild(renderer.domElement);
    }

    // 4. OrbitControls configurados con amortiguación y límite polar para no atravesar el suelo
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

    // 5. Iluminación PBR, Escenario de Casa Abierta + Jardín y Ciclo Día/Noche inicial (Modo Día soleado)
    setupCinematicLighting(scene);
    buildDetailedHouseAndGarden(scene);
    applyDayNightState(false);

    // 6. Raycaster interactivo
    setupRaycasterInteraction(renderer.domElement);

    // 7. Loop de renderizado con interpolación suave de cámara (Lerp) y animaciones
    function animate(now) {
      if (!isWorldTourActive) return;
      animFrameId = requestAnimationFrame(animate);

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

      // Pulso emisivo suave sobre el objeto seleccionado
      if (selectedObjectGroup && highlightedMaterialsBackup.length > 0) {
        highlightPulseTime += delta * 4.0;
        const pulseIntensity = 0.45 + Math.sin(highlightPulseTime) * 0.25;
        highlightedMaterialsBackup.forEach(item => {
          if (item.clonedMaterial && item.clonedMaterial.emissive) {
            item.clonedMaterial.emissiveIntensity = pulseIntensity;
          }
        });
      }

      // Animaciones de ventilador, aspersor, vapor de café y manecillas de reloj
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

    animFrameId = requestAnimationFrame(animate);

    // 8. ResizeObserver además de window.resize para redimensionado instantáneo sin quedar en negro
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

    // 9. Pausa/reanudación en segundo plano para ahorro de recursos
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      } else {
        if (isWorldTourActive && !animFrameId) {
          lastFrameTime = performance.now();
          animFrameId = requestAnimationFrame(animate);
        }
      }
    });

    isEngineInitialized = true;
  }

  function onWindowResize() {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const container = typeof document !== 'undefined'
        ? (document.getElementById('threeCanvasContainer') || document.getElementById('world3d-container') || document.getElementById('canvas-container'))
        : null;
      if (container && container.clientWidth > 60 && container.clientHeight > 60) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }

      if (scene) renderer.render(scene, camera);
    }
  }

  function switch3DScenario(scenarioKey) {
    if (scenarioKey === 'garden') {
      focusWorld3DZone('garden');
    } else if (scenarioKey === 'study') {
      focusWorld3DZone('study');
    } else if (scenarioKey === 'living') {
      focusWorld3DZone('living');
    } else {
      focusWorld3DZone('overview');
    }
  }

  // ============================================================================
  // 10. EXPORTACIÓN GLOBAL Y API PÚBLICA
  // ============================================================================
  global.initOrResumeWorld3D = initOrResumeWorld3D;
  global.initThreeWorldTour = initOrResumeWorld3D;
  global.switch3DScenario = switch3DScenario;
  global.focusWorld3DZone = focusWorld3DZone;
  global.toggleWorld3DDayNight = toggleWorld3DDayNight;
  global.speakWorld3DObject = speakWorld3DObject;
  global.practiceWorld3DObject = practiceWorld3DObject;
  global.resetWorld3DCamera = resetWorld3DCamera;
  global.closeWorld3DInspectCard = closeWorld3DInspectCard;
  global.close3DInspectCard = closeWorld3DInspectCard;
  global.speakCurrent3DObj = speakWorld3DObject;

  global.World3D = {
    initOrResumeWorld3D,
    switch3DScenario,
    focusWorld3DZone,
    toggleWorld3DDayNight,
    speakWorld3DObject,
    practiceWorld3DObject,
    resetWorld3DCamera,
    closeWorld3DInspectCard,
    WORLD3D_VOCAB_CATALOG,
    SHARED_MATERIALS,
    createOakWoodTexture,
    createGrassTexture,
    createBlackboardTexture,
    createLaptopScreenTexture,
    createPaintingTexture,
    createClockFaceTexture,
    createRugTexture
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.World3D;
  }
})(typeof window !== 'undefined' ? window : globalThis);

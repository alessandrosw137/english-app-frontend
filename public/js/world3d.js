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

  // ============================================================================
  // CARGADOR GLTFLoader NATIVO PARA THREE.JS r128 (Soporte GLB / Blender 3D)
  // ============================================================================
  function parseGLB(arrayBuffer) {
    const dataView = new DataView(arrayBuffer);
    const magic = dataView.getUint32(0, true);
    if (magic !== 0x46546c67) throw new Error('[GLTFLoader] Invalid GLB magic header');
    const version = dataView.getUint32(4, true);
    const totalLength = dataView.getUint32(8, true);

    let json = null;
    let binBuffer = null;
    let offset = 12;

    while (offset < totalLength) {
      const chunkLength = dataView.getUint32(offset, true);
      const chunkType = dataView.getUint32(offset + 4, true);
      offset += 8;
      if (chunkType === 0x4e4f534a) { // JSON chunk
        const jsonBytes = new Uint8Array(arrayBuffer, offset, chunkLength);
        let jsonStr = '';
        if (typeof TextDecoder !== 'undefined') {
          jsonStr = new TextDecoder('utf-8').decode(jsonBytes);
        } else {
          for (let i = 0; i < jsonBytes.length; i++) jsonStr += String.fromCharCode(jsonBytes[i]);
        }
        json = JSON.parse(jsonStr);
      } else if (chunkType === 0x004e4942) { // BIN chunk
        binBuffer = arrayBuffer.slice(offset, offset + chunkLength);
      }
      offset += chunkLength;
    }

    if (!json) throw new Error('[GLTFLoader] Missing JSON chunk in GLB');

    const TYPE_SIZES = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 };
    const COMP_ARRAYS = {
      5120: Int8Array,
      5121: Uint8Array,
      5122: Int16Array,
      5123: Uint16Array,
      5125: Uint32Array,
      5126: Float32Array
    };

    function getAccessorArray(accessorIndex) {
      const acc = json.accessors[accessorIndex];
      const bv = json.bufferViews[acc.bufferView];
      const byteOffset = (bv.byteOffset || 0) + (acc.byteOffset || 0);
      const TypedArray = COMP_ARRAYS[acc.componentType] || Float32Array;
      const numComponents = TYPE_SIZES[acc.type] || 1;
      const totalElements = acc.count * numComponents;
      const bytesPerElem = TypedArray.BYTES_PER_ELEMENT || 1;
      const byteLength = totalElements * bytesPerElem;
      const subBuffer = binBuffer.slice(byteOffset, byteOffset + byteLength);
      return new TypedArray(subBuffer);
    }

    const T = (typeof THREE !== 'undefined') ? THREE : (typeof window !== 'undefined' ? window.THREE : null);
    if (!T) throw new Error('[GLTFLoader] THREE is not defined');

    const materials = (json.materials || []).map(m => {
      const pbr = m.pbrMetallicRoughness || {};
      const color = pbr.baseColorFactor ? new T.Color(pbr.baseColorFactor[0], pbr.baseColorFactor[1], pbr.baseColorFactor[2]) : new T.Color(0xffffff);
      const opacity = pbr.baseColorFactor && pbr.baseColorFactor[3] !== undefined ? pbr.baseColorFactor[3] : 1;
      const mat = new T.MeshStandardMaterial({
        color: color,
        roughness: pbr.roughnessFactor !== undefined ? pbr.roughnessFactor : 0.55,
        metalness: pbr.metallicFactor !== undefined ? pbr.metallicFactor : 0.1,
        transparent: opacity < 1,
        opacity: opacity,
        side: m.doubleSided ? T.DoubleSide : T.FrontSide
      });
      mat.name = m.name || '';
      return mat;
    });

    const meshes = (json.meshes || []).map(m => {
      const primitives = m.primitives || [];
      const primObjects = primitives.map(prim => {
        const geom = new T.BufferGeometry();
        if (prim.attributes) {
          if (prim.attributes.POSITION !== undefined) {
            const arr = getAccessorArray(prim.attributes.POSITION);
            geom.setAttribute('position', new T.BufferAttribute(arr, 3));
          }
          if (prim.attributes.NORMAL !== undefined) {
            const arr = getAccessorArray(prim.attributes.NORMAL);
            geom.setAttribute('normal', new T.BufferAttribute(arr, 3));
          }
          if (prim.attributes.TEXCOORD_0 !== undefined) {
            const arr = getAccessorArray(prim.attributes.TEXCOORD_0);
            geom.setAttribute('uv', new T.BufferAttribute(arr, 2));
          }
        }
        if (prim.indices !== undefined) {
          const arr = getAccessorArray(prim.indices);
          geom.setIndex(new T.BufferAttribute(arr, 1));
        }
        const mat = (prim.material !== undefined && materials[prim.material])
          ? materials[prim.material]
          : new T.MeshStandardMaterial({ color: 0xcccccc });
        const mesh = new T.Mesh(geom, mat);
        mesh.name = m.name || '';
        return mesh;
      });

      if (primObjects.length === 1) return primObjects[0];
      const group = new T.Group();
      group.name = m.name || '';
      primObjects.forEach(p => group.add(p));
      return group;
    });

    const rootScene = new T.Group();
    rootScene.name = 'GLTF_Scene_Root';

    const nodes = (json.nodes || []).map(n => {
      let obj;
      if (n.mesh !== undefined && meshes[n.mesh]) {
        obj = meshes[n.mesh].clone();
      } else {
        obj = new T.Group();
      }
      obj.name = n.name || obj.name || '';
      if (n.translation) obj.position.set(n.translation[0], n.translation[1], n.translation[2]);
      if (n.rotation) obj.quaternion.set(n.rotation[0], n.rotation[1], n.rotation[2], n.rotation[3]);
      if (n.scale) obj.scale.set(n.scale[0], n.scale[1], n.scale[2]);
      return obj;
    });

    (json.nodes || []).forEach((n, idx) => {
      if (n.children && n.children.length) {
        n.children.forEach(cIdx => {
          if (nodes[cIdx]) nodes[idx].add(nodes[cIdx]);
        });
      }
    });

    const scenes = json.scenes || [{ nodes: json.nodes ? json.nodes.map((_, i) => i) : [] }];
    const defaultScene = scenes[json.scene || 0] || scenes[0];
    if (defaultScene && defaultScene.nodes) {
      defaultScene.nodes.forEach(nIdx => {
        if (nodes[nIdx]) rootScene.add(nodes[nIdx]);
      });
    } else {
      nodes.forEach(n => rootScene.add(n));
    }

    return { scene: rootScene, scenes: [rootScene], json };
  }

  function StandardGLTFLoader(manager) {
    this.manager = manager || (typeof THREE !== 'undefined' ? THREE.DefaultLoadingManager : null);
  }
  StandardGLTFLoader.prototype = {
    constructor: StandardGLTFLoader,
    load: function(url, onLoad, onProgress, onError) {
      const scope = this;
      if (typeof fetch === 'function') {
        fetch(url)
          .then(res => {
            if (!res.ok) throw new Error('HTTP ' + res.status + ' loading ' + url);
            return res.arrayBuffer();
          })
          .then(buffer => {
            try {
              const gltf = scope.parse(buffer, url);
              if (onLoad) onLoad(gltf);
            } catch (err) {
              if (onError) onError(err);
              else console.error('[GLTFLoader] Parse error:', err);
            }
          })
          .catch(err => {
            if (onError) onError(err);
            else console.error('[GLTFLoader] Load error:', err);
          });
      } else {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          if (xhr.status === 200 || xhr.status === 0) {
            try {
              const gltf = scope.parse(xhr.response, url);
              if (onLoad) onLoad(gltf);
            } catch (e) {
              if (onError) onError(e);
            }
          } else {
            if (onError) onError(new Error('Status ' + xhr.status));
          }
        };
        xhr.onerror = function(e) { if (onError) onError(e); };
        xhr.send(null);
      }
    },
    parse: function(data, path, onLoad, onError) {
      try {
        const gltf = parseGLB(data);
        if (onLoad) onLoad(gltf);
        return gltf;
      } catch (e) {
        if (onError) onError(e);
        else throw e;
      }
    }
  };

  if (typeof THREE !== 'undefined' && !THREE.GLTFLoader) {
    THREE.GLTFLoader = StandardGLTFLoader;
  }
  if (typeof window !== 'undefined') {
    if (window.THREE && !window.THREE.GLTFLoader) {
      window.THREE.GLTFLoader = StandardGLTFLoader;
    }
    window.GLTFLoader = window.GLTFLoader || StandardGLTFLoader;
  }

  function getGLTFLoaderClass() {
    if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader === 'function') {
      return THREE.GLTFLoader;
    }
    if (typeof window !== 'undefined' && typeof window.THREE !== 'undefined' && typeof window.THREE.GLTFLoader === 'function') {
      return window.THREE.GLTFLoader;
    }
    if (typeof window !== 'undefined' && typeof window.GLTFLoader === 'function') {
      return window.GLTFLoader;
    }
    return StandardGLTFLoader;
  }
  global.getGLTFLoaderClass = getGLTFLoaderClass;

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
      pos: { x: 12, y: 14, z: 16 },
      lookAt: { x: 0, y: 1.5, z: 0 },
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

  const STORAGE_KEY_DISCOVERED = 'mastereng_world3d_discovered_v3';
  const STORAGE_KEY_LEARNED = 'mastereng_world3d_learned_v3';
  let discoveredObjectIds = new Set();
  let learnedObjectIds = new Set();

  function loadProgressFromStorage() {
    try {
      localStorage.removeItem('mastereng_world3d_discovered_v2');
      localStorage.removeItem('mastereng_world3d_learned_v2');
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
  const GLOBAL_MATERIAL_CACHE = new Map();

  function getSharedMaterial(params = {}) {
    if (typeof THREE === 'undefined') return null;
    const type = params.type || 'MeshStandardMaterial';
    const colorHex = (params.color && typeof params.color.getHexString === 'function')
      ? params.color.getHexString()
      : (typeof params.color === 'number' ? params.color.toString(16) : (params.color || 'cccccc'));
    const roughness = params.roughness !== undefined ? params.roughness : 0.4;
    const metalness = params.metalness !== undefined ? params.metalness : 0.1;
    const transparent = !!params.transparent;
    const opacity = params.opacity !== undefined ? params.opacity : 1.0;
    const emissiveHex = (params.emissive && typeof params.emissive.getHexString === 'function')
      ? params.emissive.getHexString()
      : (typeof params.emissive === 'number' ? params.emissive.toString(16) : (params.emissive || '000000'));
    const key = `${type}_${colorHex}_${roughness}_${metalness}_${transparent}_${opacity}_${emissiveHex}`;

    if (GLOBAL_MATERIAL_CACHE.has(key)) {
      return GLOBAL_MATERIAL_CACHE.get(key);
    }
    const MatClass = THREE[type] || THREE.MeshStandardMaterial;
    const mat = new MatClass(params);
    GLOBAL_MATERIAL_CACHE.set(key, mat);
    return mat;
  }
  World3D.getSharedMaterial = getSharedMaterial;
  global.getSharedMaterial = getSharedMaterial;
  if (typeof window !== 'undefined') window.getSharedMaterial = getSharedMaterial;

  // ============================================================================
  // 4A. CACHÉ CENTRALIZADO DE TEXTURAS PROCEDURALES HD 256x256 (ProceduralMaterialFactory)
  //     Y FACTORÍA DE GEOMETRÍAS COMPUESTAS (LatheGeometry, ExtrudeGeometry, TubeGeometry)
  // ============================================================================
  const textureCache = World3D.textureCache || {};
  World3D.textureCache = textureCache;
  global.textureCache = textureCache;

  const ProceduralMaterialFactory = {
    cache: textureCache,
    matCache: {},

    getCanvasTexture(cacheKey, drawFn, repeatX = 1, repeatY = 1) {
      if (this.cache[cacheKey]) return this.cache[cacheKey];
      if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx && typeof drawFn === 'function') {
        try {
          drawFn(ctx, 256, 256);
        } catch (e) {}
      }
      const tex = new THREE.CanvasTexture(canvas);
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      if (repeatX > 1 || repeatY > 1) {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        if (tex.repeat && typeof tex.repeat.set === 'function') {
          tex.repeat.set(repeatX, repeatY);
        }
      }
      this.cache[cacheKey] = tex;
      return tex;
    },

    drawBarcode(ctx, x, y, w, h) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#0f172a';
      for (let bx = x + 3; bx < x + w - 3; bx += 4) {
        const bw = ((bx * 7) % 3 === 0) ? 2.5 : 1.2;
        ctx.fillRect(bx, y + 2, bw, h - 8);
      }
      ctx.font = 'bold 7px monospace';
      ctx.fillText('7 501055 3624', x + 4, y + h - 1);
    },

    drawNutritionPanel(ctx, x, y, w, h) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('NUTRITION FACTS', x + 3, y + 10);
      ctx.fillRect(x + 2, y + 13, w - 4, 2);
      for (let r = 0; r < 5; r++) {
        const ry = y + 21 + r * 8;
        ctx.fillRect(x + 3, ry, w - 6, 1);
      }
    },

    createProductLabelMaterial(spec = {}) {
      const id = spec.id || spec.key || spec.title || 'generic_label';
      const matKey = 'prod_mat_' + id;
      if (this.matCache[matKey]) return this.matCache[matKey];
      const bg = spec.bg || '#f59e0b';
      const accent = spec.accent || spec.band || '#dc2626';
      const title = spec.title || 'PREMIUM';
      const subtitle = spec.subtitle || 'ORGANIC QUALITY';
      const badge = spec.badge || '100% REAL';
      const roughness = spec.roughness !== undefined ? spec.roughness : 0.32;
      const metalness = spec.metalness !== undefined ? spec.metalness : 0.08;

      const tex = this.getCanvasTexture('label_' + id, (ctx) => {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = accent;
        ctx.fillRect(0, 0, 256, 52);
        ctx.fillRect(0, 208, 256, 48);

        ctx.fillStyle = 'rgba(255,255,255,0.94)';
        ctx.fillRect(14, 60, 156, 140);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 3;
        ctx.strokeRect(14, 60, 156, 140);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(title).slice(0, 16), 128, 34);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 17px sans-serif';
        ctx.fillText(String(subtitle).slice(0, 16), 92, 96);

        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(92, 138, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(String(badge).slice(0, 10), 92, 142);

        ctx.textAlign = 'left';
        this.drawNutritionPanel(ctx, 176, 60, 68, 86);
        this.drawBarcode(ctx, 176, 154, 68, 46);
      });

      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness,
        metalness
      });
      this.matCache[matKey] = mat;
      return mat;
    },

    createProductLabel(title, subtitle, bg, accent) {
      return this.createProductLabelMaterial({
        id: String(title || 'prod').toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        title: title || 'PRODUCT',
        subtitle: subtitle || 'QUALITY',
        bg: bg || '#f59e0b',
        accent: accent || '#dc2626'
      });
    },

    createDigitalScreenMaterial(spec = {}) {
      const id = spec.id || spec.key || spec.header || 'pos_screen';
      const matKey = 'screen_mat_' + id;
      if (this.matCache[matKey]) return this.matCache[matKey];
      const bg = spec.bg || '#061326';
      const primary = spec.primary || '#38bdf8';
      const secondary = spec.secondary || '#22c55e';
      const header = spec.header || 'SYSTEM ONLINE';
      const lines = spec.lines || ['ITEM 1 ......... $4.50', 'ITEM 2 ......... $3.20', 'TOTAL .......... $7.70'];

      const tex = this.getCanvasTexture('screen_' + id, (ctx) => {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = primary;
        ctx.fillRect(0, 0, 256, 36);
        ctx.fillStyle = '#020617';
        ctx.font = 'bold 15px monospace';
        ctx.fillText(String(header).slice(0, 22), 12, 24);

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1;
        for (let y = 44; y < 240; y += 20) {
          ctx.beginPath();
          ctx.moveTo(8, y);
          ctx.lineTo(248, y);
          ctx.stroke();
        }

        ctx.font = 'bold 13px monospace';
        lines.forEach((line, idx) => {
          ctx.fillStyle = idx === lines.length - 1 ? secondary : '#e2e8f0';
          ctx.fillText(String(line).slice(0, 26), 14, 72 + idx * 32);
        });

        ctx.fillStyle = secondary;
        ctx.fillRect(14, 210, 228, 30);
        ctx.fillStyle = '#020617';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('READY • MASTERENG OS', 34, 230);
      });

      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        emissive: new THREE.Color(primary),
        emissiveMap: tex,
        emissiveIntensity: 0.55,
        roughness: 0.18,
        metalness: 0.15
      });
      this.matCache[matKey] = mat;
      return mat;
    },

    createScreenUI(header, lines, primary) {
      return this.createDigitalScreenMaterial({
        id: String(header || 'screen').toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        header: header || 'SYSTEM ONLINE',
        lines: Array.isArray(lines) ? lines : ['STATUS: ONLINE'],
        primary: primary || '#38bdf8'
      });
    },

    createBrickMaterial() {
      if (this.matCache.brickWall) return this.matCache.brickWall;
      const tex = this.getCanvasTexture('brick_hd', (ctx) => {
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(0, 0, 256, 256);
        const rows = 8;
        const bh = 256 / rows;
        const bw = 64;
        for (let r = 0; r < rows; r++) {
          const offset = (r % 2) * (bw / 2);
          for (let c = -1; c < 5; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#9a3412' : '#7c2d12';
            ctx.fillRect(c * bw + offset + 2, r * bh + 2, bw - 4, bh - 4);
          }
        }
      }, 3, 3);
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.78, metalness: 0.04 });
      this.matCache.brickWall = mat;
      return mat;
    },

    createSolarPanelMaterial() {
      if (this.matCache.solarCells) return this.matCache.solarCells;
      const tex = this.getCanvasTexture('solar_cells_hd', (ctx) => {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 256, 256);
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 4; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#1d4ed8' : '#1e3a8a';
            ctx.fillRect(c * 64 + 3, r * 32 + 3, 58, 26);
            ctx.fillStyle = 'rgba(147, 197, 253, 0.35)';
            ctx.fillRect(c * 64 + 30, r * 32 + 3, 2, 26);
          }
        }
      }, 2, 2);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.16,
        metalness: 0.72,
        emissive: new THREE.Color(0x1e3a8a),
        emissiveIntensity: 0.22
      });
      this.matCache.solarCells = mat;
      return mat;
    },

    createSolarCellMaterial() {
      return this.createSolarPanelMaterial();
    },

    getContactShadowMaterial() {
      if (this.matCache.contactShadow) return this.matCache.contactShadow;
      const tex = this.getCanvasTexture('contact_shadow_radial', (ctx) => {
        ctx.clearRect(0, 0, 256, 256);
        if (typeof ctx.createRadialGradient === 'function') {
          const g = ctx.createRadialGradient(128, 128, 12, 128, 128, 122);
          g.addColorStop(0, 'rgba(2, 6, 23, 0.58)');
          g.addColorStop(0.55, 'rgba(2, 6, 23, 0.26)');
          g.addColorStop(1, 'rgba(2, 6, 23, 0.0)');
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = 'rgba(2, 6, 23, 0.35)';
        }
        ctx.beginPath();
        ctx.arc(128, 128, 122, 0, Math.PI * 2);
        ctx.fill();
      });
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      });
      this.matCache.contactShadow = mat;
      return mat;
    }
  };

  World3D.ProceduralMaterialFactory = ProceduralMaterialFactory;
  global.ProceduralMaterialFactory = ProceduralMaterialFactory;
  if (typeof window !== 'undefined') window.ProceduralMaterialFactory = ProceduralMaterialFactory;

  // --- CONSTRUCTORES DE GEOMETRÍAS COMPUESTAS AVANZADAS ---
  function createLatheProfileMesh(pointsArray, material, segments = 24) {
    if (typeof THREE === 'undefined') return null;
    const pts = (pointsArray || []).map(([r, y]) => new THREE.Vector2(Math.max(0.001, r), y));
    const geo = typeof THREE.LatheGeometry === 'function'
      ? new THREE.LatheGeometry(pts, segments)
      : new THREE.CylinderGeometry(pts[pts.length - 1]?.x || 0.1, pts[0]?.x || 0.1, Math.abs((pts[pts.length - 1]?.y || 0.25) - (pts[0]?.y || 0)), segments);
    return new THREE.Mesh(geo, material);
  }

  function createBeveledBoxExtrude(width, height, depth, material, bevelOpts = {}) {
    if (typeof THREE === 'undefined') return null;
    const bThick = bevelOpts.bevelThickness !== undefined ? bevelOpts.bevelThickness : 0.02;
    const bSize = bevelOpts.bevelSize !== undefined ? bevelOpts.bevelSize : 0.015;
    const bSegs = bevelOpts.bevelSegments !== undefined ? bevelOpts.bevelSegments : 3;
    const w = Math.max(0.02, width - bSize * 2);
    const h = Math.max(0.02, height - bSize * 2);
    const d = Math.max(0.01, depth - bThick * 2);

    if (typeof THREE.Shape === 'function' && typeof THREE.ExtrudeGeometry === 'function') {
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2, -h / 2);
      shape.lineTo(w / 2, -h / 2);
      shape.lineTo(w / 2, h / 2);
      shape.lineTo(-w / 2, h / 2);
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: d,
        bevelEnabled: true,
        bevelThickness: bThick,
        bevelSize: bSize,
        bevelSegments: bSegs
      });
      geo.translate(0, 0, -d / 2);
      return new THREE.Mesh(geo, material);
    }
    return new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  }

  function createTubeHandleMesh(points3D, radius, material, tubularSegments = 20, radialSegments = 10, closed = false) {
    if (typeof THREE === 'undefined') return null;
    const vectors = (points3D || []).map(p => (p && p.isVector3) ? p : new THREE.Vector3(p[0], p[1], p[2]));
    if (typeof THREE.CatmullRomCurve3 === 'function' && typeof THREE.TubeGeometry === 'function' && vectors.length >= 2) {
      const curve = new THREE.CatmullRomCurve3(vectors, closed);
      const geo = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, closed);
      return new THREE.Mesh(geo, material);
    }
    return new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.25, radialSegments), material);
  }

  let sharedContactShadowGeo = null;
  function attachContactShadow(targetGroup, radius = 0.45, yOffset = 0.004) {
    if (!targetGroup || typeof THREE === 'undefined') return null;
    if (!sharedContactShadowGeo) {
      sharedContactShadowGeo = new THREE.CircleGeometry(1, 24);
    }
    const shadowMesh = new THREE.Mesh(sharedContactShadowGeo, ProceduralMaterialFactory.getContactShadowMaterial());
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.scale.set(radius, radius, 1);
    shadowMesh.position.y = yOffset;
    shadowMesh.raycast = () => {};
    shadowMesh.userData = { isContactShadow: true, ignoreRaycast: true };
    targetGroup.add(shadowMesh);
    return shadowMesh;
  }

  World3D.createLatheProfileMesh = createLatheProfileMesh;
  World3D.createBeveledBoxExtrude = createBeveledBoxExtrude;
  World3D.createTubeHandleMesh = createTubeHandleMesh;
  World3D.attachContactShadow = attachContactShadow;
  global.createLatheProfileMesh = createLatheProfileMesh;
  global.createBeveledBoxExtrude = createBeveledBoxExtrude;
  global.createTubeHandleMesh = createTubeHandleMesh;
  global.attachContactShadow = attachContactShadow;

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
    // Optimización 60 FPS: Cero sprites creados durante buildScenarioWorld.
    // La interactividad reside directamente en la jerarquía de mallas del objeto.
    return;
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
  // ============================================================================
  // CATÁLOGO AUTORITATIVO DE VOCABULARIO INTERACTIVO (78 OBJETOS BLENDER 3D)
  // ============================================================================
  const MASTER_INTERACTIVE_OBJECTS = {
  "microwave": {
    "id": "microwave",
    "en": "Microwave Oven",
    "ipa": "/ˈmaɪ.kroʊ.weɪv ˈʌv.ən/",
    "es": "Horno Microondas",
    "category": "Kitchen",
    "example": "Heat up your breakfast in the microwave oven."
  },
  "blender": {
    "id": "blender",
    "en": "Kitchen Blender",
    "ipa": "/ˈkɪtʃ.ən ˈblen.dɚ/",
    "es": "Licuadora de Cocina",
    "category": "Kitchen",
    "example": "Blend fresh fruits and milk to make a delicious smoothie."
  },
  "toaster": {
    "id": "toaster",
    "en": "Bread Toaster",
    "ipa": "/bred ˈtoʊ.stɚ/",
    "es": "Tostadora de Pan",
    "category": "Kitchen",
    "example": "Two golden slices of bread pop out of the toaster."
  },
  "coffee_maker": {
    "id": "coffee_maker",
    "en": "Coffee Maker",
    "ipa": "/ˈkɑː.fi ˌmeɪ.kɚ/",
    "es": "Cafetera Eléctrica",
    "category": "Kitchen",
    "example": "Brew a hot cup of coffee with the digital coffee maker."
  },
  "refrigerator": {
    "id": "refrigerator",
    "en": "Refrigerator",
    "ipa": "/rɪˈfrɪdʒ.ə.reɪ.t̬ɚ/",
    "es": "Refrigerador / Nevera",
    "category": "Kitchen",
    "example": "Keep the groceries cool and fresh in the refrigerator."
  },
  "sofa": {
    "id": "sofa",
    "en": "Living Room Sofa",
    "ipa": "/ˈsoʊ.fə/",
    "es": "Sofá de Sala",
    "category": "Living Room",
    "example": "Relax on the comfortable sofa while reading English books."
  },
  "laptop": {
    "id": "laptop",
    "en": "Laptop Computer",
    "ipa": "/ˈlæp.tɑːp kəmˈpjuː.t̬ɚ/",
    "es": "Computadora Portátil",
    "category": "Study Room",
    "example": "Type your English assignments on the lightweight laptop."
  },
  "remote_control": {
    "id": "remote_control",
    "en": "Remote Control",
    "ipa": "/rɪˈmoʊt kənˈtroʊl/",
    "es": "Control Remoto de TV",
    "category": "Living Room",
    "example": "Use the remote control to turn on the English subtitles."
  },
  "toothbrush": {
    "id": "toothbrush",
    "en": "Toothbrush",
    "ipa": "/ˈtuːθ.brʌʃ/",
    "es": "Cepillo de Dientes",
    "category": "Bathroom",
    "example": "Brush your teeth twice a day with fluoride toothpaste."
  },
  "soap_dispenser": {
    "id": "soap_dispenser",
    "en": "Soap Dispenser",
    "ipa": "/soʊp dɪˈspen.sɚ/",
    "es": "Dispensador de Jabón",
    "category": "Bathroom",
    "example": "Press the pump of the soap dispenser to wash your hands."
  },
  "bathroom_vanity": {
    "id": "bathroom_vanity",
    "en": "Bathroom Vanity",
    "ipa": "/ˈbæθ.ruːm ˈvæn.ə.t̬i/",
    "es": "Mueble de Lavamanos",
    "category": "Bathroom",
    "example": "The modern bathroom vanity includes a ceramic sink and mirror."
  },
  "house_bed": {
    "id": "house_bed",
    "en": "Double Bed",
    "ipa": "/ˈdʌb.əl bed/",
    "es": "Cama Doble",
    "category": "Bedroom",
    "example": "Sleep comfortably in the warm double bed after studying."
  },
  "kitchen_counter": {
    "id": "kitchen_counter",
    "en": "Kitchen Counter",
    "ipa": "/ˈkɪtʃ.ən ˈkaʊn.tɚ/",
    "es": "Encimera de Cocina",
    "category": "Kitchen",
    "example": "Chop fresh vegetables on the clean granite kitchen counter."
  },
  "living_table": {
    "id": "living_table",
    "en": "Coffee Table",
    "ipa": "/ˈkɑː.fi ˌteɪ.bəl/",
    "es": "Mesa de Centro",
    "category": "Living Room",
    "example": "Place the tea cup and notebook on the living room table."
  },
  "shampoo_bottle": {
    "id": "shampoo_bottle",
    "en": "Shampoo Bottle",
    "ipa": "/ʃæmˈpuː ˈbɑː.t̬əl/",
    "es": "Botella de Champú",
    "category": "Bathroom",
    "example": "This herbal shampoo bottle contains botanical extracts."
  },
  "study_desk": {
    "id": "study_desk",
    "en": "Study Desk",
    "ipa": "/ˈstʌd.i desk/",
    "es": "Escritorio de Estudio",
    "category": "Study Room",
    "example": "Study vocabulary and practice grammar notes at the desk."
  },
  "cereal_box": {
    "id": "cereal_box",
    "en": "Cereal Box",
    "ipa": "/ˈsɪr.i.əl bɑːks/",
    "es": "Caja de Cereal",
    "category": "Supermarket",
    "example": "Pour crunchy toasted corn flakes into the breakfast bowl."
  },
  "mayonnaise": {
    "id": "mayonnaise",
    "en": "Mayonnaise Jar",
    "ipa": "/ˈmeɪ.ə.neɪz dʒɑːr/",
    "es": "Frasco de Mayonesa",
    "category": "Supermarket",
    "example": "Spread a spoonful of creamy mayonnaise on the sandwich."
  },
  "table_cream": {
    "id": "table_cream",
    "en": "Table Cream",
    "ipa": "/ˈteɪ.bəl kriːm/",
    "es": "Crema de Mesa",
    "category": "Supermarket",
    "example": "Pour rich fresh table cream over ripe strawberries."
  },
  "milk_carton": {
    "id": "milk_carton",
    "en": "Milk Carton",
    "ipa": "/ˈmɪlk ˈkɑːr.tən/",
    "es": "Cartón de Leche",
    "category": "Supermarket",
    "example": "Keep the cold organic milk carton in the refrigerator."
  },
  "egg_carton": {
    "id": "egg_carton",
    "en": "Egg Carton",
    "ipa": "/eɡ ˈkɑːr.tən/",
    "es": "Cartón de Huevos",
    "category": "Supermarket",
    "example": "A carton holds one dozen fresh free-range eggs."
  },
  "canned_tuna": {
    "id": "canned_tuna",
    "en": "Canned Tuna",
    "ipa": "/kænd ˈtuː.nə/",
    "es": "Atún en Lata",
    "category": "Supermarket",
    "example": "Open a tin of canned tuna for a healthy protein salad."
  },
  "sliced_bread": {
    "id": "sliced_bread",
    "en": "Sliced Bread",
    "ipa": "/slaɪst bred/",
    "es": "Pan de Molde Rebanado",
    "category": "Supermarket",
    "example": "Toast two slices of whole wheat bread for breakfast."
  },
  "ketchup": {
    "id": "ketchup",
    "en": "Tomato Ketchup",
    "ipa": "/təˈmeɪ.toʊ ˈketʃ.ʌp/",
    "es": "Salsa de Tomate Kétchup",
    "category": "Supermarket",
    "example": "Squeeze sweet tomato ketchup onto hot french fries."
  },
  "cooking_oil": {
    "id": "cooking_oil",
    "en": "Cooking Oil",
    "ipa": "/ˈkʊk.ɪŋ ɔɪl/",
    "es": "Aceite de Cocina",
    "category": "Supermarket",
    "example": "Pour a tablespoon of vegetable cooking oil into the pan."
  },
  "cash_register": {
    "id": "cash_register",
    "en": "Cash Register",
    "ipa": "/ˈkæʃ ˌredʒ.ə.stɚ/",
    "es": "Caja Registradora",
    "category": "Supermarket",
    "example": "The cashier scans items and calculates change on the register."
  },
  "barcode_scanner": {
    "id": "barcode_scanner",
    "en": "Barcode Scanner",
    "ipa": "/ˈbɑːr.koʊd ˌskæn.ɚ/",
    "es": "Escáner de Código de Barras",
    "category": "Supermarket",
    "example": "The red laser on the barcode scanner beeps for every product."
  },
  "card_reader": {
    "id": "card_reader",
    "en": "Payment Terminal / Card Reader",
    "ipa": "/ˈkɑːrd ˌriː.dɚ/",
    "es": "Lector de Tarjetas / Terminal",
    "category": "Supermarket",
    "example": "Tap your contactless credit card against the payment reader."
  },
  "shopping_cart": {
    "id": "shopping_cart",
    "en": "Shopping Cart",
    "ipa": "/ˈʃɑː.pɪŋ kɑːrt/",
    "es": "Carrito de Compras",
    "category": "Supermarket",
    "example": "Push the metal shopping cart down the supermarket aisle."
  },
  "checkout_counter": {
    "id": "checkout_counter",
    "en": "Checkout Counter",
    "ipa": "/ˈtʃek.aʊt ˌkaʊn.tɚ/",
    "es": "Mostrador de Caja",
    "category": "Supermarket",
    "example": "Place all your selected groceries onto the conveyor belt."
  },
  "gondola_aisle": {
    "id": "gondola_aisle",
    "en": "Supermarket Aisle",
    "ipa": "/ˈsuː.pɚˌmɑːr.kɪt aɪl/",
    "es": "Pasillo de Góndola",
    "category": "Supermarket",
    "example": "Browse the neatly stocked supermarket shelves for dry goods."
  },
  "main_course": {
    "id": "main_course",
    "en": "Main Course Dish",
    "ipa": "/ˌmeɪn ˈkɔːrs dɪʃ/",
    "es": "Plato Fuerte / Principal",
    "category": "Restaurant",
    "example": "The chef served grilled salmon as the delicious main course."
  },
  "fork": {
    "id": "fork",
    "en": "Dinner Fork",
    "ipa": "/ˈdɪn.ɚ fɔːrk/",
    "es": "Tenedor de Mesa",
    "category": "Restaurant",
    "example": "Hold the stainless steel fork in your left hand during dinner."
  },
  "knife": {
    "id": "knife",
    "en": "Steak Knife",
    "ipa": "/steɪk naɪf/",
    "es": "Cuchillo de Mesa",
    "category": "Restaurant",
    "example": "Use the sharp serrated knife to slice the tender steak."
  },
  "spoon": {
    "id": "spoon",
    "en": "Soup Spoon",
    "ipa": "/suːp spuːn/",
    "es": "Cuchara Sopera",
    "category": "Restaurant",
    "example": "Stir and taste the creamy mushroom soup with the silver spoon."
  },
  "wine_glass": {
    "id": "wine_glass",
    "en": "Crystal Wine Glass",
    "ipa": "/ˈwaɪn ˌɡlæs/",
    "es": "Copa de Vino de Cristal",
    "category": "Restaurant",
    "example": "They raised their crystal wine glass for an evening toast."
  },
  "napkin": {
    "id": "napkin",
    "en": "Cloth Napkin",
    "ipa": "/klɑːθ ˈnæp.kɪn/",
    "es": "Servilleta de Tela",
    "category": "Restaurant",
    "example": "Unfold the clean linen napkin and place it on your lap."
  },
  "menu": {
    "id": "menu",
    "en": "Restaurant Menu",
    "ipa": "/ˈres.trɑːnt ˈmen.juː/",
    "es": "Carta del Menú",
    "category": "Restaurant",
    "example": "Examine the menu carefully to choose appetizers and desserts."
  },
  "salt_pepper_shakers": {
    "id": "salt_pepper_shakers",
    "en": "Salt & Pepper Shakers",
    "ipa": "/sɑːlt ənd ˈpep.ɚ ˈʃeɪ.kɚz/",
    "es": "Salero y Pimentero",
    "category": "Restaurant",
    "example": "Season your warm entrée with the salt and pepper shakers."
  },
  "olive_oil": {
    "id": "olive_oil",
    "en": "Extra Virgin Olive Oil",
    "ipa": "/ˌek.strə ˈvɝː.dʒɪn ˈɑː.lɪv ɔɪl/",
    "es": "Aceite de Oliva Extra Virgen",
    "category": "Restaurant",
    "example": "Drizzle golden olive oil over the Italian salad."
  },
  "espresso_machine": {
    "id": "espresso_machine",
    "en": "Espresso Machine",
    "ipa": "/esˈpres.oʊ məˌʃiːn/",
    "es": "Máquina de Café Espresso",
    "category": "Restaurant",
    "example": "The barista brews a rich espresso shot with creamy crema."
  },
  "dining_table": {
    "id": "dining_table",
    "en": "Bistro Dining Table",
    "ipa": "/ˈdaɪ.nɪŋ ˈteɪ.bəl/",
    "es": "Mesa de Restaurante",
    "category": "Restaurant",
    "example": "The round wooden dining table is beautifully set with candles."
  },
  "bar_credenza": {
    "id": "bar_credenza",
    "en": "Bar Credenza / Counter",
    "ipa": "/bɑːr krɪˈden.zə/",
    "es": "Aparador / Barra del Bar",
    "category": "Restaurant",
    "example": "Fine glassware and beverage bottles are stored on the credenza."
  },
  "reception_desk": {
    "id": "reception_desk",
    "en": "Reception Desk",
    "ipa": "/rɪˈsep.ʃən desk/",
    "es": "Mostrador de Recepción",
    "category": "Hotel",
    "example": "Check in with the friendly receptionist at the front desk."
  },
  "bellhop_bell": {
    "id": "bellhop_bell",
    "en": "Bellhop Service Bell",
    "ipa": "/ˈbel.hɑːp bɔːl bel/",
    "es": "Campanilla de Recepción",
    "category": "Hotel",
    "example": "Press the brass bellhop bell to request luggage assistance."
  },
  "room_keycard": {
    "id": "room_keycard",
    "en": "Electronic Room Keycard",
    "ipa": "/ˈruːm ˌkiː.kɑːrd/",
    "es": "Tarjeta Llave Electrónica",
    "category": "Hotel",
    "example": "Tap your RFID keycard on the lock to enter your hotel suite."
  },
  "passport": {
    "id": "passport",
    "en": "Travel Passport",
    "ipa": "/ˈpæs.pɔːrt/",
    "es": "Pasaporte de Viajero",
    "category": "Hotel",
    "example": "Present your biometric passport during international check-in."
  },
  "luggage_cart": {
    "id": "luggage_cart",
    "en": "Brass Luggage Cart",
    "ipa": "/ˈlʌɡ.ɪdʒ kɑːrt/",
    "es": "Carrito de Equipaje",
    "category": "Hotel",
    "example": "The bellhop stacks hard-shell suitcases onto the luggage cart."
  },
  "suitcase": {
    "id": "suitcase",
    "en": "Travel Suitcase",
    "ipa": "/ˈsuːt.keɪs/",
    "es": "Maleta de Viaje",
    "category": "Hotel",
    "example": "Unpack your clothes from the rolling travel suitcase."
  },
  "elevator": {
    "id": "elevator",
    "en": "Hotel Elevator",
    "ipa": "/ˈel.ə.veɪ.t̬ɚ/",
    "es": "Elevador / Ascensor",
    "category": "Hotel",
    "example": "Take the scenic glass elevator up to the penthouse floor."
  },
  "safe_box": {
    "id": "safe_box",
    "en": "In-Room Electronic Safe",
    "ipa": "/seɪf bɑːks/",
    "es": "Caja Fuerte Electrónica",
    "category": "Hotel",
    "example": "Lock your valuables and documents inside the digital room safe."
  },
  "king_bed": {
    "id": "king_bed",
    "en": "King-Size Bed",
    "ipa": "/kɪŋ saɪz bed/",
    "es": "Cama King-Size",
    "category": "Hotel",
    "example": "The luxurious king-size bed has high-thread-count cotton sheets."
  },
  "minibar": {
    "id": "minibar",
    "en": "Hotel Room Minibar",
    "ipa": "/ˈmɪn.i.bɑːr/",
    "es": "Frigobar / Minibar",
    "category": "Hotel",
    "example": "Cold bottled water and refreshments are chilled in the minibar."
  },
  "concierge_counter": {
    "id": "concierge_counter",
    "en": "Concierge Counter",
    "ipa": "/koʊn.siˈerʒ ˈkaʊn.tɚ/",
    "es": "Mostrador del Conserje",
    "category": "Hotel",
    "example": "Ask the knowledgeable concierge to book museum and theatre tickets."
  },
  "hotel_lounge_sofa": {
    "id": "hotel_lounge_sofa",
    "en": "Hotel Lounge Chesterfield Sofa",
    "ipa": "/ˈtʃes.tɚ.fiːld ˈsoʊ.fə/",
    "es": "Sofá de Espera Chesterfield",
    "category": "Hotel",
    "example": "Rest on the tufted leather sofa in the spacious hotel lobby."
  },
  "candle": {
    "id": "candle",
    "en": "Aromatic Candle",
    "ipa": "/ˈkæn.dəl/",
    "es": "Vela Aromática",
    "category": "Romantic Terrace",
    "example": "The warm candle flame creates a calm and romantic atmosphere."
  },
  "wine_glasses": {
    "id": "wine_glasses",
    "en": "Paired Wine Glasses",
    "ipa": "/peəd ˈwaɪn ˌɡlæs.ɪz/",
    "es": "Par de Copas de Vino",
    "category": "Romantic Terrace",
    "example": "Two sparkling wine glasses are set for the romantic dinner toast."
  },
  "rose_bouquet": {
    "id": "rose_bouquet",
    "en": "Crimson Rose Bouquet",
    "ipa": "/roʊz buːˈkeɪ/",
    "es": "Ramillete de Rosas Rojas",
    "category": "Romantic Terrace",
    "example": "A fresh bouquet of deep crimson roses decorates the bistro table."
  },
  "champagne_bucket": {
    "id": "champagne_bucket",
    "en": "Champagne Ice Bucket",
    "ipa": "/ʃæmˈpeɪn aɪs ˈbʌk.ɪt/",
    "es": "Hielera de Champaña",
    "category": "Romantic Terrace",
    "example": "The celebratory champagne bottle chills inside the crushed ice bucket."
  },
  "acoustic_guitar": {
    "id": "acoustic_guitar",
    "en": "Acoustic Guitar",
    "ipa": "/əˈkuː.stɪk ɡɪˈtɑːr/",
    "es": "Guitarra Acústica",
    "category": "Romantic Terrace",
    "example": "The musician strums an acoustic guitar under the evening stars."
  },
  "bistro_table": {
    "id": "bistro_table",
    "en": "Romantic Bistro Table",
    "ipa": "/ˈbiː.stroʊ ˈteɪ.bəl/",
    "es": "Mesa Redonda de Bistro",
    "category": "Romantic Terrace",
    "example": "The round mahogany table is elegantly adorned with fine linen."
  },
  "terrace_railing": {
    "id": "terrace_railing",
    "en": "Terrace Balcony Railing",
    "ipa": "/ˈter.əs ˈreɪ.lɪŋ/",
    "es": "Barandal de la Terraza",
    "category": "Romantic Terrace",
    "example": "Lean gently on the wrought iron railing to admire the city lights."
  },
  "star_lantern": {
    "id": "star_lantern",
    "en": "Wrought-Iron Star Lantern",
    "ipa": "/stɑːr ˈlæn.tɚn/",
    "es": "Farol Colgante de Hierro",
    "category": "Romantic Terrace",
    "example": "The Moroccan-style lantern casts intricate golden patterns."
  },
  "stone_fountain": {
    "id": "stone_fountain",
    "en": "Carved Stone Fountain",
    "ipa": "/stoʊn ˈfaʊn.tən/",
    "es": "Fuente de Cantera",
    "category": "Garden",
    "example": "Clear spring water cascades down the tiered stone fountain."
  },
  "garden_bench": {
    "id": "garden_bench",
    "en": "Teak Garden Bench",
    "ipa": "/ˈɡɑːr.dən bentʃ/",
    "es": "Banca de Jardín de Teca",
    "category": "Garden",
    "example": "Sit peacefully on the wooden bench surrounded by fragrant flowers."
  },
  "gazebo": {
    "id": "gazebo",
    "en": "Garden Pergola / Gazebo",
    "ipa": "/ɡəˈziː.boʊ/",
    "es": "Glorieta / Cenador de Jardín",
    "category": "Garden",
    "example": "The climbing wisteria vines cover the wooden pergola roof."
  },
  "wheelbarrow": {
    "id": "wheelbarrow",
    "en": "Heavy-Duty Wheelbarrow",
    "ipa": "/ˈwiːlˌber.oʊ/",
    "es": "Carretilla de Jardín",
    "category": "Garden",
    "example": "Transport compost and garden tools with the red wheelbarrow."
  },
  "watering_can": {
    "id": "watering_can",
    "en": "Zinc Watering Can",
    "ipa": "/ˈwɑː.t̬ɚ.ɪŋ kæn/",
    "es": "Regadera de Jardín",
    "category": "Garden",
    "example": "Water delicate morning seedlings using the long-spout watering can."
  },
  "flower_pot": {
    "id": "flower_pot",
    "en": "Terracotta Flower Pot",
    "ipa": "/ˈflaʊ.ɚ pɑːt/",
    "es": "Maceta de Terracota",
    "category": "Garden",
    "example": "Vibrant purple lavender blossoms inside the terracotta flower pot."
  },
  "pruning_shears": {
    "id": "pruning_shears",
    "en": "Pruning Shears",
    "ipa": "/ˈpruː.nɪŋ ʃɪrz/",
    "es": "Tijeras de Podar",
    "category": "Garden",
    "example": "Trim dry branches and shape rosebushes with sharp pruning shears."
  },
  "garden_trowel": {
    "id": "garden_trowel",
    "en": "Hand Garden Trowel",
    "ipa": "/ˈɡɑːr.dən ˈtraʊ.əl/",
    "es": "Palita de Jardinería / Trasplantador",
    "category": "Garden",
    "example": "Dig small planting holes for seedling roots with the sturdy trowel."
  },
  "birdhouse": {
    "id": "birdhouse",
    "en": "Wooden Birdhouse",
    "ipa": "/ˈbɝːd.haʊs/",
    "es": "Casita de Pájaros de Madera",
    "category": "Garden",
    "example": "A family of singing bluebirds made their nest in the birdhouse."
  },
  "picnic_basket": {
    "id": "picnic_basket",
    "en": "Woven Picnic Basket",
    "ipa": "/ˈpɪk.nɪk ˌbæs.kɪt/",
    "es": "Canasta de Picnic de Mimbre",
    "category": "Garden",
    "example": "Pack fresh sandwiches, grapes, and fruit juice in the picnic basket."
  },
  "garden_lantern": {
    "id": "garden_lantern",
    "en": "Solar Garden Lantern",
    "ipa": "/ˈɡɑːr.dən ˈlæn.tɚn/",
    "es": "Farol Solar de Jardín",
    "category": "Garden",
    "example": "The outdoor lantern illuminates stone garden walkways at dusk."
  },
  "garden_pergola_table": {
    "id": "garden_pergola_table",
    "en": "Pergola Garden Table",
    "ipa": "/ˈpɝː.ɡə.lə ˈteɪ.bəl/",
    "es": "Mesa de Jardín bajo Pérgola",
    "category": "Garden",
    "example": "Gather with friends under the wisteria pergola for afternoon tea."
  },
  "control_console": {
    "id": "control_console",
    "en": "Mission Control Console",
    "ipa": "/kənˈtroʊl ˈkɑːn.soʊl/",
    "es": "Consola de Control de Misión",
    "category": "Space Station",
    "example": "Telemetry monitors and thruster gauges line the control console."
  },
  "astronaut_helmet": {
    "id": "astronaut_helmet",
    "en": "Astronaut EVA Helmet",
    "ipa": "/ˈæs.trə.nɑːt ˈhel.mət/",
    "es": "Casco de Astronauta con Visor Dorado",
    "category": "Space Station",
    "example": "The reflective gold visor shields the astronaut during spacewalks."
  },
  "oxygen_tank": {
    "id": "oxygen_tank",
    "en": "Pressurized Oxygen Tank",
    "ipa": "/ˈɑːk.sɪ.dʒən tæŋk/",
    "es": "Tanque de Oxígeno Presurizado",
    "category": "Space Station",
    "example": "High-pressure tanks supply life-giving oxygen in the vacuum of space."
  },
  "robotic_arm": {
    "id": "robotic_arm",
    "en": "Orbital Robotic Arm (Canadarm)",
    "ipa": "/roʊˈbɑː.t̬ɪk ɑːrm/",
    "es": "Brazo Robótico Articulado",
    "category": "Space Station",
    "example": "The multi-joint robotic arm docks cargo spacecraft to the station."
  },
  "space_telescope": {
    "id": "space_telescope",
    "en": "Deep Space Telescope",
    "ipa": "/speɪs ˈtel.ə.skoʊp/",
    "es": "Telescopio de Espacio Profundo",
    "category": "Space Station",
    "example": "This infrared telescope captures crisp images of distant nebulae."
  },
  "hydroponic_pod": {
    "id": "hydroponic_pod",
    "en": "Zero-G Hydroponic Plant Pod",
    "ipa": "/ˌhaɪ.drəˈpɑː.nɪk pɑːd/",
    "es": "Módulo Hidropónico de Cultivo",
    "category": "Space Station",
    "example": "Nutrient-rich water mist grows fresh greens in microgravity."
  },
  "airlock_door": {
    "id": "airlock_door",
    "en": "Pressurized Airlock Door",
    "ipa": "/ˈer.lɑːk dɔːr/",
    "es": "Compuerta Hermética de Esclusa",
    "category": "Space Station",
    "example": "Cycle the airlock hatch pressure before initiating extravehicular activity."
  }
};

  function normalizeKey(str) {
    return String(str || '')
      .replace(/(\.|\_)\d+$/, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');
  }

  function isArchitecturalNode(name) {
    const norm = normalizeKey(name);
    return norm.includes('floor') ||
           norm.includes('diorama') ||
           norm.includes('wall') ||
           norm.includes('ceiling') ||
           norm.includes('baseboard') ||
           norm.includes('bounds_anchor') ||
           norm.includes('anchor');
  }

  function bindGlbInteractiveNodes(glbScene, scenarioKey) {
    if (!glbScene) return;
    const scen = (typeof WORLD_TOUR_SCENARIOS !== 'undefined' && WORLD_TOUR_SCENARIOS[scenarioKey]) || {};
    const scenObjects = scen.objects || [];
    glbScene.traverse((child) => {
      const rawName = child.name || '';
      if (!rawName) return;
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = true;
      }
      if (isArchitecturalNode(rawName)) {
        child.userData = Object.assign({}, child.userData || {}, {
          isEnvironment: true,
          interactive: false,
          ignoreRaycast: true
        });
        return;
      }
      const normName = normalizeKey(rawName);
      let meta = MASTER_INTERACTIVE_OBJECTS[normName];
      if (!meta) {
        meta = scenObjects.find(o => {
          const oId = normalizeKey(o.id);
          const oEn = normalizeKey(o.en || o.wordEn);
          return oId === normName || oEn === normName || normName.includes(oId) || oId.includes(normName);
        });
      }
      if (!meta) {
        for (const k in MASTER_INTERACTIVE_OBJECTS) {
          if (normName.includes(k) || k.includes(normName)) {
            meta = MASTER_INTERACTIVE_OBJECTS[k];
            break;
          }
        }
      }
      if (!meta && (child.isMesh || (child.isGroup && child.children && child.children.length > 0))) {
        const cleanWord = rawName.replace(/_/g, ' ');
        meta = {
          id: normName,
          en: cleanWord,
          es: cleanWord,
          ipa: `/${cleanWord.toLowerCase().replace(/\s+/g, '.')}/`,
          category: scenarioKey || 'World Tour 3D',
          example: `Explore the ${cleanWord} in the 3D world.`
        };
      }
      if (meta) {
        const cleanWord = meta.en || meta.wordEn || rawName.replace(/_/g, ' ');
        const cleanEs = meta.es || meta.wordEs || cleanWord;
        const ipaPhon = meta.ipa || meta.phonetic || `/${cleanWord.toLowerCase().replace(/\s+/g, '.')}/`;
        const exText = meta.example || `Explore the ${cleanWord} in the 3D world.`;
        const catText = meta.category || scenarioKey || 'World Tour 3D';
        const worldPos = new THREE.Vector3();
        if (child.getWorldPosition) {
          child.getWorldPosition(worldPos);
        } else if (child.position) {
          if (worldPos.copy) { worldPos.copy(child.position); } else { worldPos.x = child.position.x || 0; worldPos.y = child.position.y || 0; worldPos.z = child.position.z || 0; }
        }
        const interactiveData = Object.assign({}, child.userData || {}, {
          id: meta.id || normName,
          wordEn: cleanWord,
          wordEs: cleanEs,
          en: cleanWord,
          es: cleanEs,
          ipa: ipaPhon,
          phonetic: ipaPhon,
          example: exText,
          category: catText,
          interactive: true,
          isEnvironment: false,
          parentGroup: child,
          focusPos: { x: worldPos.x + (worldPos.x >= 0 ? -1.6 : 1.6), y: Math.max(1.5, worldPos.y + 0.8), z: worldPos.z + 2.2 },
          lookAtPos: { x: worldPos.x, y: Math.max(0.5, worldPos.y), z: worldPos.z }
        });
        child.userData = interactiveData;
        child.traverse((subChild) => {
          if (subChild !== child) {
            subChild.userData = Object.assign({}, subChild.userData || {}, {
              interactive: true,
              isEnvironment: false,
              parentGroup: child,
              id: interactiveData.id,
              en: interactiveData.en,
              wordEn: interactiveData.wordEn
            });
            if (subChild.isMesh) {
              subChild.castShadow = false;
              subChild.receiveShadow = true;
            }
          }
        });
        if (typeof WORLD3D_VOCAB_CATALOG !== 'undefined') {
          WORLD3D_VOCAB_CATALOG[interactiveData.id] = interactiveData;
        }
        if (!interactiveObjects.includes(child)) {
          interactiveObjects.push(child);
        }
      }
    });
  }

  function setupScenarioAtmosphereAndLighting(activeScene, scenarioKey) {
    if (!activeScene || typeof THREE === 'undefined') return;
    const key = String(scenarioKey || 'house').toLowerCase();
    const ATMOSPHERES = {
      house: { bg: 0x0f172a, fogDensity: 0.005, hemiSky: 0xffffff, hemiGround: 0x1e293b, dirColor: 0xfff2dd, dirIntensity: 1.15, dirPos: [8, 16, 10] },
      supermarket: { bg: 0x0284c7, fogDensity: 0.004, hemiSky: 0xf0f9ff, hemiGround: 0x0369a1, dirColor: 0xffffff, dirIntensity: 1.25, dirPos: [6, 18, 8] },
      restaurant: { bg: 0x1e1b2e, fogDensity: 0.005, hemiSky: 0xfde68a, hemiGround: 0x312e81, dirColor: 0xffedd5, dirIntensity: 1.10, dirPos: [8, 14, 10] },
      hotel: { bg: 0x1c1917, fogDensity: 0.005, hemiSky: 0xfef3c7, hemiGround: 0x292524, dirColor: 0xffedd5, dirIntensity: 1.20, dirPos: [10, 16, 12] },
      dating: { bg: 0x070b14, fogDensity: 0.006, hemiSky: 0xf472b6, hemiGround: 0x1e1b4b, dirColor: 0xfce7f3, dirIntensity: 1.05, dirPos: [6, 14, 8] },
      garden: { bg: 0x064e3b, fogDensity: 0.004, hemiSky: 0xdcfce7, hemiGround: 0x064e3b, dirColor: 0xfef08a, dirIntensity: 1.20, dirPos: [8, 18, 12] },
      space: { bg: 0x020617, fogDensity: 0.002, hemiSky: 0x38bdf8, hemiGround: 0x020617, dirColor: 0xbae6fd, dirIntensity: 1.30, dirPos: [12, 16, 14] }
    };
    const atmo = ATMOSPHERES[key] || ATMOSPHERES.house;
    activeScene.background = new THREE.Color(atmo.bg);
    activeScene.fog = new THREE.FogExp2(atmo.bg, atmo.fogDensity);
    let lightsGroup = activeScene.getObjectByName('ScenarioLightsGroup');
    if (!lightsGroup) {
      lightsGroup = new THREE.Group();
      lightsGroup.name = 'ScenarioLightsGroup';
      activeScene.add(lightsGroup);
    } else {
      while (lightsGroup.children.length > 0) {
        lightsGroup.remove(lightsGroup.children[0]);
      }
    }
    const amb = new THREE.AmbientLight(0xffffff, 1.35);
    amb.name = 'ScenarioAmbientLight';
    lightsGroup.add(amb);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x334155, 1.2);
    hemi.position.set(0, 25, 0);
    hemi.name = 'ScenarioHemiLight';
    lightsGroup.add(hemi);

    const mainDir = new THREE.DirectionalLight(0xfffbeb, 1.5);
    mainDir.position.set(12, 22, 16);
    mainDir.castShadow = false;
    mainDir.name = 'ScenarioMainDirLight';
    lightsGroup.add(mainDir);

    const fillDir = new THREE.DirectionalLight(0x94a3b8, 0.4);
    fillDir.position.set(-atmo.dirPos[0], atmo.dirPos[1] * 0.7, -atmo.dirPos[2]);
    fillDir.castShadow = false;
    lightsGroup.add(fillDir);
    let existingStars = activeScene.getObjectByName('SpaceStarfield');
    if (existingStars) {
      activeScene.remove(existingStars);
      if (existingStars.geometry) existingStars.geometry.dispose();
      if (existingStars.material) existingStars.material.dispose();
    }
    if (key === 'space') {
      const starCount = 500;
      const starPositions = new Float32Array(starCount * 3);
      for (let s = 0; s < starCount; s++) {
        const r = 25 + Math.random() * 35;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPositions[s * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPositions[s * 3 + 1] = r * Math.cos(phi);
        starPositions[s * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.22, transparent: true, opacity: 0.88 });
      const starPoints = new THREE.Points(starGeo, starMat);
      starPoints.name = 'SpaceStarfield';
      activeScene.add(starPoints);
    }
    if (renderer) {
      setupPMREMStudioLighting(renderer, activeScene);
    }
    if (camera && controls) {
      camera.position.set(0, 9.5, 13.5);
      controls.target.set(0, 1.0, 0);
      camera.lookAt(0, 1.0, 0);
      if (typeof controls.syncSphericalFromObject === 'function') {
        controls.syncSphericalFromObject();
      }
      controls.update();
    }
  }

  function buildDetailedHouseAndGarden(targetScene) {
    // Pure Blender GLB Mode: Scenarios are loaded exclusively from assets/models/worlds/house.glb
    return targetScene;
  }

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
        {"id":"house_remote_control","en":"Remote Control","ipa":"/rɪˈmoʊt kənˈtroʊl/","es":"Control Remoto de TV","category":"Living Room","type":"object","example":"Pass me the remote control on the coffee table so I can turn on English subtitles.","pos":[-3.35,0.68,-1.95]},
        {"id":"house_laptop","en":"Laptop Computer","ipa":"/ˈlæp.tɑːp kəmˈpjuː.t̬ɚ/","es":"Laptop Abierta con Interfaz","category":"Study Room","type":"object","example":"My open laptop displays the interactive English grammar dashboard.","pos":[3.25,0.98,-3.42]},
        {"id":"house_toothbrush","en":"Toothbrush","ipa":"/ˈtuːθ.brʌʃ/","es":"Cepillo de Dientes","category":"Bathroom","type":"object","example":"Replace your soft-bristle toothbrush every three months for good hygiene.","pos":[-2.1,1.14,-3.85]},
        {"id":"house_soap_dispenser","en":"Soap Dispenser","ipa":"/soʊp dɪˈspen.sɚ/","es":"Dispensador de Jabón Líquido","category":"Bathroom","type":"object","example":"Press the pump on the ceramic soap dispenser to wash your hands.","pos":[-1.8,1.14,-3.85]},
        {"id":"house_shampoo_bottle","en":"Shampoo Bottle","ipa":"/ʃæmˈpuː ˈbɑː.t̬əl/","es":"Botella de Shampoo","category":"Bathroom","type":"object","example":"This herbal shampoo bottle has a flip-top cap and a botanical label.","pos":[-2.4,1.14,-3.85]},
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
        {"id":"garden_terracotta_pot","en":"Flower Pot","ipa":"/ˈflaʊ.ɚ pɑːt/","es":"Maceta de Barro (Terracota)","category":"Garden & Yard","type":"object","example":"Plant purple lavender inside the handmade terracotta flower pot.","pos":[1.2,0,6.8]},
        {"id":"garden_pruning_shears","en":"Pruning Shears","ipa":"/ˈpruː.nɪŋ ʃɪrz/","es":"Tijeras de Podar","category":"Garden & Yard","type":"object","example":"Use sharp steel pruning shears to trim dead stems from the rose bush.","pos":[1.8,0,7.2]},
        {"id":"garden_trowel","en":"Garden Trowel","ipa":"/ˈɡɑːr.dən ˈtraʊ.əl/","es":"Pala de Mano de Jardinería","category":"Garden & Yard","type":"object","example":"Dig small holes for flower bulbs using the hand garden trowel.","pos":[0.6,0,7.2]},
        {"id":"garden_picnic_basket","en":"Picnic Basket","ipa":"/ˈpɪk.nɪk ˈbæs.kɪt/","es":"Cesta de Picnic Tejida","category":"Garden & Yard","type":"object","example":"We packed sandwiches and fruit inside the woven wicker picnic basket.","pos":[-3.8,0,8.2]},
        {"id":"garden_lantern","en":"Garden Lantern","ipa":"/ˈɡɑːr.dən ˈlæn.tɚn/","es":"Farol Solar de Jardín","category":"Garden & Yard","type":"object","example":"The solar garden lantern charges during the day and glows warmly at dusk.","pos":[2.8,0,7.6]},
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
        {"id":"dating_candlelight","en":"Candle","ipa":"/ˈkæn.dəl/","es":"Vela Encendida con Portavelas","category":"Romantic Date","type":"object","example":"We enjoyed a quiet dinner by warm candlelight on the starry terrace.","pos":[0,0.99,0]},
        {"id":"dating_wine_glasses","en":"Wine Glasses","ipa":"/waɪn ˈɡlæs.ɪz/","es":"Dos Copas de Cristal PBR","category":"Romantic Date","type":"object","example":"They clinked their wine glasses and made a toast in English.","pos":[0.26,0.99,0.26]},
        {"id":"dating_menu","en":"Wine List","ipa":"/waɪn lɪst/","es":"Carta de Vinos y Menú del Bistró","category":"Romantic Date","type":"object","example":"Could we see the dinner menu and the wine list, please?","pos":[-0.34,0.99,0.28]},
        {"id":"dating_rose_bouquet","en":"Bouquet of Roses","ipa":"/buˈkeɪ əv ˈroʊ.zɪz/","es":"Ramo de Rosas Rojas en Florero","category":"Romantic Date","type":"object","example":"A fresh bouquet of roses decorated the center of our table.","pos":[0,0.99,-0.32]},
        {"id":"dating_violin","en":"Violin","ipa":"/ˌvaɪəˈlɪn/","es":"Violín Acústico con Arco sobre Soporte","category":"Romantic Date","type":"object","example":"A romantic violin melody played softly under the stars.","pos":[-3.4,0,-2.2]},
        {"id":"dating_city_balcony","en":"City View Balcony","ipa":"/ˈsɪt̬.i vjuː ˈbæl.kə.ni/","es":"Balcón con Skyline Nocturno Iluminado","category":"Romantic Date","type":"object","example":"We stepped out onto the city view balcony to admire the skyline.","pos":[0,0,-5.2]},
        {"id":"dating_waiter_npc","en":"Waiter NPC","ipa":"/ˈweɪ.t̬ɚ/","es":"Mesero 3D Interactivo","category":"Romantic Date","type":"object","example":"Our friendly waiter recommended the chef’s special tonight.","pos":[2.8,0,-2.4]},
        {"id":"dating_chocolate_dessert","en":"Chocolate Fondant","ipa":"/ˈtʃɑː.klət ˈfɑːn.dənt/","es":"Postre Fondant de Chocolate Compartido","category":"Romantic Date","type":"object","example":"Would you like to share this warm chocolate fondant dessert with me?","pos":[0.24,0.99,-0.26]},
        {"id":"dating_ring_box","en":"Ring Box","ipa":"/rɪŋ bɑːks/","es":"Caja de Terciopelo con Anillo","category":"Romantic Date","type":"object","example":"He opened a crimson velvet ring box under the starlight.","pos":[-0.14,0.99,0.12]},
        {"id":"dating_conversation_cards","en":"Conversation Cards","ipa":"/ˌkɑːn.vɚˈseɪ.ʃən kɑːrdz/","es":"Tarjetas Románticas (Icebreakers)","category":"Romantic Date","type":"object","example":"These conversation cards have great questions to get to know each other.","pos":[-0.32,0.99,-0.26]},
        {"id":"dating_ice_bucket","en":"Champagne Bottle & Ice Bucket","ipa":"/ʃæmˈpeɪn ˈbɑː.t̬əl ænd aɪs ˈbʌk.ɪt/","es":"Botella de Champaña en Cubeta con Hielo","category":"Romantic Date","type":"object","example":"The champagne bottle is chilling inside the silver ice bucket.","pos":[-2.15,0,-1.25]},
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
        {"id":"space_telescope","en":"Space Telescope","ipa":"/speɪs ˈtel.ə.skoʊp/","es":"Telescopio Espacial Orbital","category":"Outer Space","type":"object","example":"The space telescope captures deep infrared images of distant galaxies.","pos":[-7.5,3.8,-4.2],"orbitRadius":8.6,"orbitSpeed":0.15,"orbitPhase":4,"rotSpeed":0.35},
        {"id":"space_astronaut","en":"Astronaut","ipa":"/ˈæs.trə.nɑːt/","es":"Astronauta en Caminata Espacial","category":"Outer Space","type":"object","example":"The astronaut wore a pressurized suit during the spacewalk.","pos":[2.6,3.4,5.8],"orbitRadius":6.3,"orbitSpeed":0.22,"orbitPhase":1.7,"rotSpeed":0.4},
        {"id":"space_control_console","en":"Control Console","ipa":"/kənˈtroʊl ˈkɑːn.soʊl/","es":"Consola de Control con Telemetría","category":"Space Station","type":"object","example":"The commander monitored orbital telemetry on the curved control console.","pos":[-1.5,1.2,6.2],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":0},
        {"id":"space_astronaut_helmet","en":"Astronaut Helmet","ipa":"/ˈæs.trə.nɑːt ˈhel.mət/","es":"Casco de Astronauta con Visor Dorado","category":"Space Station","type":"object","example":"The astronaut helmet features a reflective gold visor to block solar radiation.","pos":[1.5,1.4,6.2],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":0.25},
        {"id":"space_oxygen_tank","en":"Oxygen Tank","ipa":"/ˈɑːk.sɪ.dʒən tæŋk/","es":"Tanque de Oxígeno con Manómetros","category":"Space Station","type":"object","example":"Check the pressure gauge on the primary oxygen tank before the spacewalk.","pos":[-3.2,1.2,6.5],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":0},
        {"id":"space_robotic_arm","en":"Robotic Arm","ipa":"/roʊˈbɑː.t̬ɪk ɑːrm/","es":"Brazo Robótico Articulado","category":"Space Station","type":"object","example":"The articulated robotic arm grappled the incoming supply capsule.","pos":[3.6,2.8,4.8],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":0.15},
        {"id":"space_hydroponic_pod","en":"Hydroponic Pod","ipa":"/ˌhaɪ.drəˈpɑː.nɪk pɑːd/","es":"Cápsula Hidropónica con Luz UV","category":"Space Station","type":"object","example":"Fresh greens grow inside the illuminated hydroponic pod aboard the station.","pos":[-4.8,1.5,3.2],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":0},
        {"id":"space_airlock_door","en":"Airlock Door","ipa":"/ˈer.lɑːk dɔːr/","es":"Compuerta Presurizada (Esclusa de Aire)","category":"Space Station","type":"object","example":"Seal the pressurized airlock door before depressurizing the chamber.","pos":[0,1.8,7.8],"orbitRadius":0,"orbitSpeed":0,"rotSpeed":0},
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
        {"id":"market_shopping_basket","en":"Shopping Basket","ipa":"/ˈʃɑː.pɪŋ ˈbæs.kɪt/","es":"Cesta de Mano","category":"Supermarket","type":"object","example":"Carry a hand shopping basket when you only need a few groceries.","pos":[-0.8,0,3.8]},
        {"id":"market_price_tag","en":"Yellow Price Tag","ipa":"/ˈpraɪs tæɡ/","es":"Etiqueta de Precio en Oferta","category":"Supermarket","type":"object","example":"Look at the yellow price tag to see the twenty percent discount.","pos":[-4.8,1.65,1.2]},
        {"id":"market_receipt","en":"Printed Receipt","ipa":"/rɪˈsiːt/","es":"Recibo / Ticket de Compra","category":"Supermarket","type":"object","example":"Would you like your printed receipt in the bag or with you?","pos":[4.1,1.08,3.1]},
        {"id":"market_checkout","en":"Checkout Counter","ipa":"/ˈtʃek.aʊt ˈkaʊn.tɚ/","es":"Mostrador de Caja / Checkout","category":"Supermarket","type":"object","example":"Place your groceries on the moving belt at the checkout counter.","pos":[3,0,2.8]},
        {"id":"market_conveyor_belt","en":"Conveyor Belt","ipa":"/kənˈveɪ.ɚ belt/","es":"Banda Transportadora de Caja","category":"Supermarket","type":"object","example":"The motorized conveyor belt glided the groceries toward the cashier.","pos":[2.5,0.95,2.2]},
        {"id":"market_deli_counter","en":"Gourmet Deli Counter","ipa":"/ˈdel.i ˈkaʊn.tɚ/","es":"Mostrador de Fiambrería y Quesos","category":"Supermarket","type":"object","example":"Ask the butcher to slice half a pound of smoked turkey at the deli counter.","pos":[-5.2,0,-4.2]},
        {"id":"market_beverage_aisle","en":"Beverage & Juice Aisle","ipa":"/ˈbev.rɪdʒ aɪl/","es":"Pasillo de Bebidas y Jugos","category":"Supermarket","type":"object","example":"Sparkling waters and cold pressed juices line the beverage aisle.","pos":[4.8,0,-3.8]},
        {"id":"market_canned_goods","en":"Canned Tuna","ipa":"/kænd ˈtuː.nə/","es":"Latas de Atún y Conservas con Abre-fácil","category":"Supermarket","type":"object","example":"Stock up on canned tuna, tomatoes, and black beans for your pantry.","pos":[-0.5,0,-2.5]},
        {"id":"market_cereal_aisle","en":"Cereal Box","ipa":"/ˈsɪr.i.əl bɑːks/","es":"Cajas de Cereal (Corn Flakes, Choco Rings, Honey Oats)","category":"Supermarket","type":"object","example":"Grab a box of crunchy Corn Flakes or Honey Oats from the cereal aisle.","pos":[1.8,0,-2.2]},
        {"id":"market_mayonnaise","en":"Mayonnaise","ipa":"/ˈmeɪ.ə.neɪz/","es":"Frasco de Mayonesa con Tapa Azul","category":"Supermarket","type":"object","example":"Spread a spoonful of creamy mayonnaise on the turkey sandwich.","pos":[-0.2,1.15,-2.2]},
        {"id":"market_table_cream","en":"Table Cream / Heavy Cream","ipa":"/ˈteɪ.bəl kriːm/","es":"Crema de Mesa / Crema para Batir","category":"Supermarket","type":"object","example":"Pour rich table cream over fresh strawberries for dessert.","pos":[2.2,1.15,-4.1]},
        {"id":"market_milk_carton","en":"Milk Carton","ipa":"/mɪlk ˈkɑːr.tən/","es":"Cartón de Leche con Pico Vertedor","category":"Supermarket","type":"object","example":"Open the top spout of the fresh milk carton to pour a glass.","pos":[1.7,1.15,-4.1]},
        {"id":"market_egg_carton","en":"Egg Carton","ipa":"/eɡ ˈkɑːr.tən/","es":"Cartón de Doce Huevos con Relieve","category":"Supermarket","type":"object","example":"Check inside the molded egg carton to make sure none are cracked.","pos":[2.6,1.15,-4.1]},
        {"id":"market_sliced_bread","en":"Sliced Bread","ipa":"/slaɪst bred/","es":"Pan de Molde en Bolsa con Cierre","category":"Supermarket","type":"object","example":"Pick up a soft loaf of whole-wheat sliced bread for morning toast.","pos":[-1.5,1.08,-3.9]},
        {"id":"market_ketchup","en":"Ketchup","ipa":"/ˈketʃ.ʌp/","es":"Botella de Salsa de Tomate (Ketchup)","category":"Supermarket","type":"object","example":"Squeeze tomato ketchup onto the hot french fries.","pos":[0.3,1.15,-2.2]},
        {"id":"market_mustard","en":"Mustard","ipa":"/ˈmʌs.tɚd/","es":"Botella de Mostaza Amarilla","category":"Supermarket","type":"object","example":"Add a swirl of tangy yellow mustard to your hot dog.","pos":[0.6,1.15,-2.2]},
        {"id":"market_cooking_oil","en":"Cooking Oil","ipa":"/ˈkʊk.ɪŋ ɔɪl/","es":"Botella de Aceite de Cocina","category":"Supermarket","type":"object","example":"Heat a tablespoon of vegetable cooking oil in the frying pan.","pos":[0.9,1.15,-2.2]},
        {"id":"market_strawberry_jam","en":"Strawberry Jam","ipa":"/ˈstrɑː.ber.i dʒæm/","es":"Frasco de Mermelada de Fresa","category":"Supermarket","type":"object","example":"Spread sweet strawberry jam over warm buttered toast.","pos":[-0.8,1.15,-2.2]},
        {"id":"market_peanut_butter","en":"Peanut Butter","ipa":"/ˈpiː.nʌt ˌbʌt̬.ɚ/","es":"Frasco de Mantequilla de Maní","category":"Supermarket","type":"object","example":"Crunchy peanut butter is packed with protein for breakfast.","pos":[-1.1,1.15,-2.2]},
        {"id":"market_bag_of_rice","en":"Bag of Rice","ipa":"/bæɡ əv raɪs/","es":"Bolsa de Arroz Blanco Grano Largo","category":"Supermarket","type":"object","example":"We bought a two-kilogram bag of jasmine rice for dinner.","pos":[1.2,0.65,-2.2]},
        {"id":"market_soda_can","en":"Soda Can","ipa":"/ˈsoʊ.də kæn/","es":"Lata de Refresco con Anillo Metálico","category":"Supermarket","type":"object","example":"Pop the tab on the chilled aluminum soda can.","pos":[4.5,1.15,-3.6]},
        {"id":"market_reusable_bag","en":"Eco Reusable Grocery Bag","ipa":"/riːˈjuː.zə.bəl ˈɡroʊ.sɚ.i bæɡ/","es":"Bolsa Ecológica Reutilizable","category":"Supermarket","type":"object","example":"Bring your own canvas reusable bag to reduce plastic waste.","pos":[3.8,0.8,2.5]},
        {"id":"market_card_terminal","en":"Card Reader","ipa":"/kɑːrd ˈriː.dɚ/","es":"Terminal Lectora de Tarjetas","category":"Supermarket","type":"object","example":"Tap your smartphone or contactless debit card against the card reader.","pos":[3.4,1.15,2.4]},
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
        {"id":"hotel_receptionist_desk","en":"Receptionist Desk","ipa":"/rɪˈsep.ʃən.ɪst desk/","es":"Mostrador de Recepción de Mármol Veteado","category":"Hotel & Reception","type":"object","example":"Welcome! Please check in at the main receptionist desk.","pos":[0,0,-3.5]},
        {"id":"hotel_room_keycard","en":"Room Keycard","ipa":"/ruːm ˈkiː.kɑːrd/","es":"Tarjeta Llave Magnética de Habitación","category":"Hotel & Reception","type":"object","example":"Here is your magnetic room keycard for suite 402 on the fourth floor.","pos":[-0.8,1.12,-3.1]},
        {"id":"hotel_luggage_cart","en":"Luggage Cart","ipa":"/ˈlʌɡ.ɪdʒ kɑːrt/","es":"Carrito Portaequipaje de Latón Dorado","category":"Hotel & Reception","type":"object","example":"The bellhop placed our bags on the brass luggage cart.","pos":[3.8,0,1.2]},
        {"id":"hotel_suitcase","en":"Suitcase","ipa":"/ˈsuːt.keɪs/","es":"Maleta de Viaje con Ruedas y Asa Retráctil","category":"Hotel & Reception","type":"object","example":"My rolling suitcase fits easily in the overhead compartment.","pos":[2.5,0,2.4]},
        {"id":"hotel_elevator","en":"Elevator","ipa":"/ˈel.ə.veɪ.t̬ɚ/","es":"Puertas de Ascensor con Indicador Digital","category":"Hotel & Reception","type":"object","example":"Press the up button to call the glass hotel elevator.","pos":[5.2,0,-3.8]},
        {"id":"hotel_bellhop_bell","en":"Bellhop Bell","ipa":"/ˈbel.hɑːp bel/","es":"Campana de Recepción Dorada","category":"Hotel & Reception","type":"object","example":"Ring the golden bellhop bell on the counter for service.","pos":[0.65,1.12,-3.1]},
        {"id":"hotel_lobby_sofa","en":"Plush Lobby Sofa","ipa":"/ˈlɑː.bi ˈsoʊ.fə/","es":"Sofá Acolchado del Lobby","category":"Hotel & Reception","type":"object","example":"Please have a seat on the plush lobby sofa while we prepare your room.","pos":[-4.2,0,1]},
        {"id":"hotel_chandelier","en":"Crystal Chandelier","ipa":"/ˌʃæn.dəˈlɪr/","es":"Candelabro Imperial de Cristal","category":"Hotel & Reception","type":"object","example":"A grand crystal chandelier illuminates the entire hotel lobby.","pos":[0,4.4,-0.5]},
        {"id":"hotel_checkin_terminal","en":"Express Check-in Terminal","ipa":"/ˈtʃek.ɪn ˈtɝː.mə.nəl/","es":"Terminal Digital de Check-in","category":"Hotel & Reception","type":"object","example":"Use the touch-screen check-in terminal for fast express registration.","pos":[-3.8,0,-3.2]},
        {"id":"hotel_concierge","en":"Concierge Desk","ipa":"/ˌkɑːn.siˈerʒ/","es":"Módulo de Conserjería Turística","category":"Hotel & Reception","type":"object","example":"Our hotel concierge can book city tours, taxis, and theater tickets.","pos":[3.6,0,-2.2]},
        {"id":"hotel_safe_box","en":"Safe Box","ipa":"/seɪf bɑːks/","es":"Caja Fuerte Digital","category":"Hotel & Reception","type":"object","example":"Enter a four-digit PIN code to lock the electronic safe box.","pos":[-5.2,0,-1.5]},
        {"id":"hotel_passport","en":"Passport & Guestbook","ipa":"/ˈpæs.pɔːrt ænd ˈɡest.bʊk/","es":"Pasaporte y Libro de Registro","category":"Hotel & Reception","type":"object","example":"May I see your passport and sign the hotel guestbook, please?","pos":[0.05,1.12,-3.05]},
        {"id":"hotel_minibar","en":"Stocked Minibar Fridge","ipa":"/ˈmɪn.i.bɑːr frɪdʒ/","es":"Minibar de Habitación","category":"Hotel Amenities","type":"object","example":"Chilled sparkling water and artisan chocolates are stocked in the minibar.","pos":[-5,0,-3.8]},
        {"id":"hotel_king_bed","en":"King-size Luxury Bed","ipa":"/kɪŋ saɪz bed/","es":"Cama King con Almohadas Acolchadas","category":"Hotel Room","type":"object","example":"The executive suite features a king-size luxury bed with Egyptian cotton sheets.","pos":[-4.8,0,3.5]},
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
        {"id":"hotel_coffee_station","en":"Nespresso Coffee Station","ipa":"/ˈkɑː.fi ˈsteɪ.ʃən/","es":"Cafetera de Cortesía en Habitación","category":"Hotel Amenities","type":"object","example":"Brew complimentary morning espresso at the in-room coffee station.","pos":[-5.2,0.9,-2.5]},
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
        {"id":"rest_dining_table","en":"Dining Table","ipa":"/ˈdaɪ.nɪŋ ˈteɪ.bəl/","es":"Mesa Vestida de Comedor con Mantelería","category":"Fine Restaurant","type":"object","example":"Our dining table is ready near the warm ambient lamps.","pos":[0,0,0.8]},
        {"id":"rest_chef_station","en":"Chef Station","ipa":"/ʃef ˈsteɪ.ʃən/","es":"Estación del Chef","category":"Fine Restaurant","type":"object","example":"The executive chef garnishes every plate at the chef station.","pos":[0,0,-4.5]},
        {"id":"rest_menu","en":"Menu","ipa":"/ˈmen.juː/","es":"Menú Abierto Encuadernado","category":"Fine Restaurant","type":"object","example":"Our sommelier and chef prepared a seasonal tasting menu tonight.","pos":[-0.55,0.98,1.15]},
        {"id":"rest_main_course","en":"Main Course","ipa":"/meɪn kɔːrs/","es":"Plato Fuerte (Filete con Guarnición / Pasta)","category":"Fine Restaurant","type":"object","example":"For the main course, I would like the grilled steak with herbs.","pos":[-0.4,0.98,0.65]},
        {"id":"rest_appetizer","en":"Appetizer","ipa":"/ˈæp.ə.taɪ.zɚ/","es":"Entrada / Ensalada Gourmet","category":"Fine Restaurant","type":"object","example":"Would you care to start with a warm appetizer before dinner?","pos":[0.42,0.98,0.65]},
        {"id":"rest_cutlery","en":"Fork, Knife & Spoon","ipa":"/fɔːrk, naɪf ænd spuːn/","es":"Tenedor, Cuchillo y Cuchara de Plata","category":"Fine Restaurant","type":"object","example":"The polished silver fork, knife, and spoon are placed neatly beside each plate.","pos":[-0.75,0.96,0.85]},
        {"id":"rest_fork","en":"Fork","ipa":"/fɔːrk/","es":"Tenedor de Mesa con Dientes Metálicos","category":"Fine Restaurant","type":"object","example":"Use the salad fork on the outside left for your starter.","pos":[-0.82,0.98,0.85]},
        {"id":"rest_spoon","en":"Spoon","ipa":"/spuːn/","es":"Cuchara Sopera de Plata","category":"Fine Restaurant","type":"object","example":"Stir your hot bisque gently with the silver soup spoon.","pos":[0.82,0.98,0.85]},
        {"id":"rest_olive_oil","en":"Olive Oil","ipa":"/ˈɑː.lɪv ɔɪl/","es":"Botella de Aceite de Oliva Extra Virgen","category":"Fine Restaurant","type":"object","example":"Drizzle golden extra-virgin olive oil over the warm artisan bread.","pos":[0.22,0.98,0.82]},
        {"id":"rest_espresso_machine","en":"Espresso Machine","ipa":"/esˈpres.oʊ məˈʃiːn/","es":"Máquina de Café Espresso Profesional","category":"Kitchen Equipment","type":"object","example":"The barista steamed velvety milk on the professional espresso machine.","pos":[3.2,0.95,-3.8]},
        {"id":"rest_bill_folder","en":"Bill Folder","ipa":"/bɪl ˈfoʊl.dɚ/","es":"Carpeta de Cuenta","category":"Fine Restaurant","type":"object","example":"Place your credit card inside the leather bill folder when ready.","pos":[-0.2,0.96,1.25]},
        {"id":"rest_kitchen_pass","en":"Kitchen Pass","ipa":"/ˈkɪtʃ.ən pæs/","es":"Barra de Cocina","category":"Fine Restaurant","type":"object","example":"Waiters pick up hot dishes directly from the illuminated kitchen pass.","pos":[-3.8,0,-3.8]},
        {"id":"rest_napkin","en":"Napkin","ipa":"/ˈnæp.kɪn/","es":"Servilleta de Tela Doblada","category":"Fine Restaurant","type":"object","example":"Could you bring us an extra cloth napkin, please?","pos":[0.75,0.98,0.85]},
        {"id":"rest_beverage","en":"Wine Glass","ipa":"/waɪn ɡlæs/","es":"Copa de Vino de Cristal Traslúcido","category":"Fine Restaurant","type":"object","example":"The sommelier poured a Cabernet into the crystal wine glass.","pos":[0.28,1.02,1.18]},
        {"id":"rest_reserved_sign","en":"Reserved Sign","ipa":"/rɪˈzɝːvd saɪn/","es":"Letrero de Mesa Reservada","category":"Fine Restaurant","type":"object","example":"This VIP table has a golden reserved sign on top.","pos":[-3.6,0.96,1.2]},
        {"id":"rest_dessert_cart","en":"Dessert Cart","ipa":"/dɪˈzɝːt kɑːrt/","es":"Carrito de Postres","category":"Fine Restaurant","type":"object","example":"Choose your favorite cake from our rolling dessert cart.","pos":[3.6,0,1.4]},
        {"id":"rest_padded_booth","en":"Padded Leather Booth","ipa":"/ˈpæd.ɪd ˈleð.ɚ buːð/","es":"Cabina Privada de Cuero Acolchado","category":"Fine Restaurant","type":"object","example":"Our party enjoyed dinner inside the cozy padded leather booth.","pos":[-4.2,0,1]},
        {"id":"rest_high_chair","en":"Toddler High Chair","ipa":"/ˈtɑːd.lɚ ˈhɑɪ ˌtʃer/","es":"Silla Alta para Niños Pequeños","category":"Restaurant Furniture","type":"object","example":"The server provided a clean wooden high chair for the toddler.","pos":[-2.2,0,1.8]},
        {"id":"rest_executive_chef","en":"Executive Head Chef","ipa":"/ɪɡˈzek.jə.t̬ɪv hed ʃef/","es":"Chef Ejecutivo del Restaurante","category":"Kitchen Team","type":"object","example":"The executive head chef personally inspected every culinary dish.","pos":[0,0,-3.8]},
        {"id":"rest_gas_stove","en":"Commercial Gas Stove","ipa":"/kəˈmɝː.ʃəl ɡæs stoʊv/","es":"Estufa Industrial con Campana Extractora","category":"Kitchen Equipment","type":"object","example":"Blue gas flames roared beneath heavy copper pans on the commercial stove.","pos":[-1.8,0,-4.8]},
        {"id":"rest_frying_pan","en":"Copper Sauté Frying Pan","ipa":"/ˈkɑː.pɚ soʊˈteɪ ˈfraɪ.ɪŋ pæn/","es":"Sartén de Cobre para Saltear","category":"Kitchen Equipment","type":"object","example":"The sous-chef seared sea scallops in a glowing copper sauté pan.","pos":[-1.8,0.95,-4.8]},
        {"id":"rest_cutting_board","en":"Hardwood Cutting Board","ipa":"/ˈhɑːrd.wʊd ˈkʌt.ɪŋ bɔːrd/","es":"Tabla de Picar de Madera Noble","category":"Kitchen Equipment","type":"object","example":"Chopped rosemary and thyme rested on the thick hardwood cutting board.","pos":[1.8,0.95,-4.8]},
        {"id":"rest_wine_list_leather","en":"Sommelier Wine List","ipa":"/ˌsɑːm.əlˈjeɪ waɪn lɪst/","es":"Carta de Vinos Encuadernada en Cuero","category":"Fine Restaurant","type":"object","example":"Browse the vintage Bordeaux selections in the leather sommelier wine list.","pos":[-0.65,0.98,0.95]},
        {"id":"rest_water_pitcher","en":"Chilled Water Pitcher","ipa":"/tʃɪld ˈwɑː.t̬ɚ ˈpɪtʃ.ɚ/","es":"Jarra de Agua Fría","category":"Fine Restaurant","type":"object","example":"The busser refilled our glasses from the chilled glass water pitcher.","pos":[0.65,0.98,1.1]},
        {"id":"rest_salt_pepper","en":"Salt & Pepper Shakers","ipa":"/sɑːlt ænd ˈpep.ɚ ˈʃeɪ.kɚz/","es":"Salero y Pimentero de Vidrio","category":"Fine Restaurant","type":"object","example":"Pass the sea salt and freshly cracked black pepper shakers, please.","pos":[0,0.98,0.95]},
        {"id":"rest_toothpick_holder","en":"Bamboo Toothpick Dispenser","ipa":"/ˈtuːθ.pɪk dɪˈspen.sɚ/","es":"Dispensador de Palillos de Bambú","category":"Fine Restaurant","type":"object","example":"Take a sealed bamboo toothpick from the wooden table dispenser.","pos":[-0.15,0.98,0.75]},
        {"id":"rest_pos_terminal","en":"Handheld POS Terminal","ipa":"/ˈhænd.held ˌpiː.oʊˈes ˈtɝː.mə.nəl/","es":"Terminal Portátil de Cobro con Tarjeta","category":"Fine Restaurant","type":"object","example":"The server brought the handheld wireless POS terminal right to our table.","pos":[0.15,0.98,0.75]},
        {"id":"rest_service_tray","en":"Serving Tray","ipa":"/ˈsɝː.vɪŋ treɪ/","es":"Bandeja de Mesero Cromada","category":"Fine Restaurant","type":"object","example":"The waiter balanced four hot dinner entrées on the large oval serving tray.","pos":[-2.8,0.95,-3.8]},
        {"id":"rest_chef_uniform","en":"White Chef Jacket & Apron","ipa":"/waɪt ʃef ˈdʒæk.ɪt ænd ˈeɪ.prən/","es":"Filipina y Mandil Blanco de Chef","category":"Kitchen Team","type":"object","example":"Every line cook wears a spotless double-breasted white chef jacket.","pos":[0.8,0.95,-4]},
        {"id":"rest_steak_knife","en":"Knife","ipa":"/naɪf/","es":"Cuchillo de Mesa / Cuchillo para Carnes","category":"Fine Restaurant","type":"object","example":"Cut through the prime ribeye steak with the razor-sharp serrated knife.","pos":[-0.6,0.98,0.75]},
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
    // Pure Blender GLB Mode: Objects are contained within the master Blender GLB models
    return null;
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

  function buildScenarioWorld(targetScene, scenarioKey, blobOrGlbUrl) {
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
    playerSeatedGroup = null;
    partnerSeatedGroup = null;
    activeOverheadBubbles = { player: null, partner: null, waiter: null };
    candleFlameLight = null;
    candleFlameMesh = null;

    setupScenarioAtmosphereAndLighting(activeScene, key);

    if (blobOrGlbUrl || !_isPrecompilingWorld) {
      const finalGlbUrl = blobOrGlbUrl || ('assets/models/worlds/' + (key === 'garden' ? 'garden' : key) + '.glb');
      loadScenarioGLBWithFallback(key, finalGlbUrl);
    }

    updateProgressHudCounter();
  }

  function normalizeSceneInteractiveMetadata(targetScene, scenarioKey) {
    const activeScene = targetScene || scene;
    if (!activeScene || typeof THREE === 'undefined') return;
    const key = scenarioKey || currentScenarioKey || 'house';
    const scen = WORLD_TOUR_SCENARIOS[key];
    const catalogObjects = (scen && Array.isArray(scen.objects)) ? scen.objects : [];

    if (World3D.sharedLabelSprite) {
      World3D.sharedLabelSprite.visible = false;
      if (World3D.sharedLabelSprite.parent) {
        World3D.sharedLabelSprite.parent.remove(World3D.sharedLabelSprite);
      }
    }
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

    // Deduplicación / fusión de materiales idénticos sin textura para reducir draw calls
    const matCache = new Map();
    activeScene.traverse((obj) => {
      if (obj.isMesh && obj.material && !obj.material.map) {
        const m = obj.material;
        const colorHex = m.color?.getHexString ? m.color.getHexString() : '';
        const emissiveHex = m.emissive?.getHexString ? m.emissive.getHexString() : '';
        const key = `${m.type}_${colorHex}_${m.roughness}_${m.metalness}_${m.transparent}_${m.opacity}_${emissiveHex}`;
        if (matCache.has(key)) {
          obj.material = matCache.get(key);
        } else {
          matCache.set(key, m);
        }
      }
    });

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

  // 6.5. ILUMINACIÓN DE ESTUDIO PMREM PARA REFLEXIONES METÁLICAS Y TRANSMISIÓN PBR
  function setupPMREMStudioLighting(targetRenderer, targetScene) {
    if (!targetRenderer || !targetScene || typeof THREE === 'undefined' || !THREE.PMREMGenerator) return;
    try {
      const pmremGenerator = new THREE.PMREMGenerator(targetRenderer);
      if (typeof pmremGenerator.compileEquirectangularShader === 'function') {
        pmremGenerator.compileEquirectangularShader();
      }
      const studioScene = new THREE.Scene();
      studioScene.background = new THREE.Color(0x181c24);

      // Cúpula suave envolvente
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(20, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x222836, side: THREE.BackSide })
      );
      studioScene.add(dome);

      // Panel 1: Key light cálida principal
      const keyLight = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshBasicMaterial({ color: 0xfff5ea })
      );
      keyLight.position.set(12, 14, 12);
      keyLight.lookAt(0, 0, 0);
      studioScene.add(keyLight);

      // Panel 2: Fill light fría de relleno
      const fillLight = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshBasicMaterial({ color: 0xc8e0ff })
      );
      fillLight.position.set(-12, 10, -8);
      fillLight.lookAt(0, 0, 0);
      studioScene.add(fillLight);

      // Panel 3: Rim / kicker light cenital suave
      const rimLight = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      rimLight.position.set(0, 16, -10);
      rimLight.lookAt(0, 0, 0);
      studioScene.add(rimLight);

      if (typeof pmremGenerator.fromScene === 'function') {
        const renderTarget = pmremGenerator.fromScene(studioScene);
        if (renderTarget && renderTarget.texture) {
          targetScene.environment = renderTarget.texture;
        }
      }
      if (typeof pmremGenerator.dispose === 'function') {
        pmremGenerator.dispose();
      }
    } catch (err) {
      console.warn('[World3D] PMREM studio generation fallback:', err);
    }
  }

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
      modal.style.cssText = 'position: fixed; inset: 0; z-index: 99999; background: rgba(15, 18, 26, 0.94); backdrop-filter: none !important; -webkit-backdrop-filter: none !important; display: flex; align-items: center; justify-content: center; padding: 16px;';
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
      'background: rgba(15, 18, 26, 0.94)',
      'backdrop-filter: none !important',
      '-webkit-backdrop-filter: none !important',
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
        const lobbyEl = document.getElementById('world3d-selection-hub');
        const loaderEl = document.getElementById('world3d-loading-screen');
        const isOverlayActive = Boolean(
          _isPrecompilingWorld ||
          (lobbyEl && !lobbyEl.classList.contains('hidden') && lobbyEl.style.display !== 'none') ||
          (loaderEl && !loaderEl.classList.contains('hidden') && loaderEl.style.display !== 'none')
        );
        if (isOverlayActive) {
          activeBar.style.setProperty('display', 'none', 'important');
          activeBar.style.setProperty('visibility', 'hidden', 'important');
        } else {
          activeBar.style.cssText = 'position: absolute !important; top: 10px !important; left: 10px !important; right: 10px !important; max-width: calc(100vw - 20px) !important; z-index: 80 !important; display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; align-items: center !important; gap: 6px !important; background: rgba(15, 18, 26, 0.92) !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; padding: 6px 10px !important; border-radius: 14px !important; border: 1px solid rgba(148, 163, 184, 0.3) !important; pointer-events: auto !important;';
        }
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
        <button type="button" onclick="if(typeof window.returnToMainPortals==='function') window.returnToMainPortals(event); else window.navigateTo('view-home');"
          class="px-3 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-white border border-purple-500/50 text-[11px] font-bold shadow-lg cursor-pointer transition active:scale-95 flex items-center gap-1">
          <span>← Salir a Portales</span>
          <span style="font-size:0;opacity:0;position:absolute;pointer-events:none;">← Volver a Portales</span>
        </button>

        <button type="button" id="world3dLobbySwitchBtn" onclick="window.openWorld3DLobby()"
          class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white border border-purple-300/60 text-[11px] font-black shadow-lg shadow-purple-700/40 cursor-pointer transition active:scale-95 flex items-center gap-1.5">
          <span>🗺️ Cambiar de Mundo (Lobby)</span>
        </button>

        <select id="world3dScenarioSelect"
          aria-label="Seleccionar Mundo 3D"
          style="display: none;"
          class="hidden px-2.5 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-purple-200 border border-purple-500/60 text-[11px] font-extrabold shadow-lg cursor-pointer focus:outline-none">
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
        <div class="flex flex-wrap items-center gap-2 bg-slate-950/92 border border-rose-500/50 px-3 py-1.5 rounded-2xl shadow-xl text-white">
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
      orientBanner.style.cssText = 'position: absolute; top: 76px; left: 50%; transform: translateX(-50%); z-index: 95; background: rgba(15, 18, 26, 0.92); backdrop-filter: none !important; -webkit-backdrop-filter: none !important; border: 1.5px solid rgba(168, 85, 247, 0.7); border-radius: 16px; padding: 6px 12px; display: none; align-items: center; gap: 8px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6); max-width: calc(100vw - 28px); pointer-events: auto;';
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
        <div class="bg-slate-950/94 border-2 border-amber-500/65 rounded-3xl p-3 shadow-2xl text-white flex flex-col gap-2">
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
        <div class="bg-slate-950/94 border-2 border-rose-500/70 rounded-3xl p-3 shadow-2xl text-white flex flex-col gap-2">
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
        <div class="bg-slate-900/95 border-2 border-purple-500/70 rounded-3xl p-4 shadow-2xl text-white">
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

  // ============================================================================
  // UN SOLO SPRITE DE ETIQUETA BAJO DEMANDA (LAZY SINGLETON SPRITE)
  // ============================================================================
  let sharedLabelCanvas = null;
  let sharedLabelContext = null;
  let sharedLabelTexture = null;
  let sharedLabelSprite = null;

  function getSharedLabelSprite() {
    if (World3D.sharedLabelSprite) return World3D.sharedLabelSprite;
    if (typeof document === 'undefined' || typeof THREE === 'undefined') return null;

    sharedLabelCanvas = document.createElement('canvas');
    sharedLabelCanvas.width = 512;
    sharedLabelCanvas.height = 180;
    sharedLabelContext = sharedLabelCanvas.getContext('2d');
    if (!sharedLabelContext) return null;

    sharedLabelTexture = new THREE.CanvasTexture(sharedLabelCanvas);
    const mat = new THREE.SpriteMaterial({
      map: sharedLabelTexture,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });
    sharedLabelSprite = new THREE.Sprite(mat);
    sharedLabelSprite.scale.set(2.0, 0.72, 1.0);
    sharedLabelSprite.visible = false;
    sharedLabelSprite.renderOrder = 999;
    sharedLabelSprite.raycast = () => {};
    sharedLabelSprite.userData = { isLabelSprite: true, ignoreRaycast: true };

    World3D.sharedLabelSprite = sharedLabelSprite;
    global.sharedLabelSprite = sharedLabelSprite;
    return sharedLabelSprite;
  }

  function updateAndPositionSharedLabelSprite(group, data) {
    if (!group || !data || typeof THREE === 'undefined') return null;
    const sprite = getSharedLabelSprite();
    if (!sprite || !sharedLabelContext) return null;

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

    const ctx = sharedLabelContext;
    ctx.clearRect(0, 0, 512, 180);

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

    sharedLabelTexture.needsUpdate = true;

    // Calcular posición Y sobre el objeto
    let targetY = 1.6;
    try {
      const bbox = new THREE.Box3().setFromObject(group);
      const groupWorldPos = new THREE.Vector3();
      group.getWorldPosition(groupWorldPos);
      const localTopY = (bbox.max.y - groupWorldPos.y);
      if (isFinite(localTopY) && localTopY > 0) {
        targetY = localTopY + 0.38;
      }
    } catch (_) {}

    if (sprite.parent && sprite.parent !== group) {
      sprite.parent.remove(sprite);
    }
    sprite.position.set(0, targetY, 0);
    group.add(sprite);
    sprite.visible = true;
    activeLabelSprite = sprite;
    return sprite;
  }

  function createFloatingVocabLabel(group, data) {
    return updateAndPositionSharedLabelSprite(group, data);
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

    // 3. Mostrar ÚNICAMENTE el sprite global reutilizable sobre el objeto seleccionado
    updateAndPositionSharedLabelSprite(group, data);

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
        if (obj.userData && (obj.userData.isEnvironment || obj.userData.interactive === false || obj.userData.ignoreRaycast)) continue;

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

  function enforceWorld3DContainerStyle() {
    if (typeof document === 'undefined') return;
    const ids = ['world3d-container', 'world3d-view', 'canvas-container', 'threeCanvasContainer', 'threeWebGLMount', 'view-worldtour'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('hidden');
        el.style.setProperty('display', 'block', 'important');
        el.style.setProperty('visibility', 'visible', 'important');
        el.style.setProperty('opacity', '1', 'important');
      }
    });

    const c3d = document.getElementById('world3d-container');
    if (c3d) {
      c3d.style.setProperty('display', 'block', 'important');
      c3d.style.setProperty('position', 'fixed', 'important');
      c3d.style.setProperty('inset', '0', 'important');
      c3d.style.setProperty('width', '100vw', 'important');
      c3d.style.setProperty('height', '100vh', 'important');
      c3d.style.setProperty('z-index', '9000', 'important');
    }

    const cMount = document.getElementById('threeWebGLMount');
    if (cMount) {
      cMount.style.setProperty('display', 'block', 'important');
      cMount.style.setProperty('position', 'fixed', 'important');
      cMount.style.setProperty('inset', '0', 'important');
      cMount.style.setProperty('width', '100vw', 'important');
      cMount.style.setProperty('height', '100vh', 'important');
      cMount.style.setProperty('z-index', '9000', 'important');
    }

    const r = (typeof World3D !== 'undefined' && World3D.renderer) ? World3D.renderer : renderer;
    const c = (typeof World3D !== 'undefined' && World3D.camera) ? World3D.camera : camera;

    if (r && r.domElement) {
      r.domElement.style.setProperty('display', 'block', 'important');
      r.domElement.style.setProperty('position', 'fixed', 'important');
      r.domElement.style.setProperty('inset', '0', 'important');
      r.domElement.style.setProperty('width', '100vw', 'important');
      r.domElement.style.setProperty('height', '100vh', 'important');
      r.domElement.style.setProperty('z-index', '9000', 'important');
      r.domElement.style.setProperty('visibility', 'visible', 'important');
      r.domElement.style.setProperty('opacity', '1', 'important');
    }

    if (r && c && typeof window !== 'undefined') {
      r.setSize(window.innerWidth, window.innerHeight);
      c.aspect = window.innerWidth / window.innerHeight;
      c.updateProjectionMatrix();
    }
  }
  global.enforceWorld3DContainerStyle = enforceWorld3DContainerStyle;
  if (typeof window !== 'undefined') window.enforceWorld3DContainerStyle = enforceWorld3DContainerStyle;

  function initOrResumeWorld3D() {
    if (typeof THREE === 'undefined') return;
    if (!clock) clock = new THREE.Clock();
    initSharedMaterials();
    isWorldTourActive = true;

    // a) Ocultar otros módulos si no estamos ya en world3d
    if (typeof window !== 'undefined' && typeof window.hideAllModules === 'function' && window._activeModule !== 'world3d') {
      window.hideAllModules();
    }

    // b) Inmediatamente después, forzar visibilidad y dimensiones del contenedor 3D principal
    enforceWorld3DContainerStyle();

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
    renderer.toneMappingExposure = 1.15;
    if (THREE.SRGBColorSpace) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

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

    // 5. Iluminación equilibrada, Escenario Activo + Domo Espacial + PMREM Studio
    setupCinematicLighting(scene);
    setupPMREMStudioLighting(renderer, scene);
    buildScenarioWorld(scene, currentScenarioKey || 'house');
    applyDayNightState(currentScenarioKey === 'dating' || currentScenarioKey === 'space');

    // 6. Raycaster interactivo y Hotspots
    setupRaycasterInteraction(renderer.domElement);

    // Pre-alocación fuera del loop para CERO Garbage Collection
    let cachedContainer3d = null;

    // 7. Loop de renderizado animate3D ultraliviano (60 FPS puros, CERO DOM / CERO Layout Thrashing)
    function animate3D(now) {
      if (!cachedContainer3d && typeof document !== 'undefined') {
        cachedContainer3d = document.getElementById('world3d-container') || document.getElementById('world3d-view') || document.getElementById('view-worldtour');
      }
      const isHidden = cachedContainer3d && (cachedContainer3d.classList.contains('hidden') || cachedContainer3d.style.display === 'none');
      if (!isWorldTourActive || (global.World3D && global.World3D.isPaused) || isHidden) {
        cancelRunningLoop();
        return;
      }
      cancelRunningLoop();
      World3D._rafId = requestAnimationFrame(animate3D);
      animFrameId = World3D._rafId;

      const delta = Math.min(((now || performance.now()) - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now || performance.now();

      // 1. Actualizar OrbitControls con amortiguación suave o interpolación de cámara Lerp
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

      // 2. Si estamos en el escenario "space", rotar únicamente el arreglo pre-guardado de planetas (máx 10 objetos)
      if (currentScenarioKey === 'space' && spaceOrbitalEntries.length > 0) {
        for (let i = 0; i < spaceOrbitalEntries.length; i++) {
          const entry = spaceOrbitalEntries[i];
          if (entry && entry.group) {
            entry.group.rotation.y += delta * (entry.rotSpeed || 0.6);
            if (entry.orbitRadius > 0 && entry.orbitSpeed > 0) {
              entry.orbitAngle += delta * entry.orbitSpeed;
              entry.group.position.x = Math.cos(entry.orbitAngle) * entry.orbitRadius;
              entry.group.position.z = Math.sin(entry.orbitAngle) * entry.orbitRadius;
            }
          }
        }
      }

      // 3. Llamar una sola vez a renderer.render(scene, camera)
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
    const key = String(scenarioKey || 'house').toLowerCase().trim();
    const targetScenario = (typeof WORLD_TOUR_SCENARIOS !== 'undefined' && WORLD_TOUR_SCENARIOS[key]) ? key : 'house';
    openWorld3DScenario(targetScenario);
  }

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
      const lobbyEl = document.getElementById('world3d-selection-hub');
      const loaderEl = document.getElementById('world3d-loading-screen');
      const isOverlayActive = Boolean(
        _isPrecompilingWorld ||
        (lobbyEl && !lobbyEl.classList.contains('hidden') && lobbyEl.style.display !== 'none') ||
        (loaderEl && !loaderEl.classList.contains('hidden') && loaderEl.style.display !== 'none')
      );
      if (isOverlayActive) {
        activeBar.style.setProperty('display', 'none', 'important');
        activeBar.style.setProperty('visibility', 'hidden', 'important');
      } else {
        activeBar.style.cssText = 'position: absolute !important; top: 10px !important; left: 12px !important; right: 12px !important; max-width: calc(100vw - 24px) !important; z-index: 80 !important; display: flex !important; flex-wrap: wrap !important; align-items: center !important; gap: 8px !important; background: rgba(15, 23, 42, 0.88) !important; backdrop-filter: none !important; padding: 6px 10px !important; border-radius: 14px !important; border: 1px solid rgba(148, 163, 184, 0.3) !important; pointer-events: auto !important;';
      }
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
      modal.className = 'fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-950/95';
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

  // ============================================================================
  // 12. GALERÍA DE PORTALES DIMENSIONALES (#world3d-selection-hub) Y PANTALLA DE
  //     CARGA 100% OPACA CON BOTÓN DE CANCELAR/SALIR (#world3d-loading-screen)
  // ============================================================================
  const WORLD3D_LOBBY_META = [
    {
      id: 'house',
      icon: '🏠',
      titleEs: 'Casa y Jardín',
      nameEn: 'House & Garden',
      nameEs: 'Casa y Jardín',
      level: 'A1 - B1',
      zoneTag: 'Sala • Cocina • Estudio',
      accentHex: '#a855f7',
      glowRgba: 'rgba(168, 85, 247, 0.42)',
      gradientBg: 'radial-gradient(circle at 50% 24%, rgba(168,85,247,0.34) 0%, rgba(17,24,39,0.96) 65%, #070b14 100%)',
      loadingThemeBg: 'radial-gradient(circle at center, #111827 0%, #06080f 100%)'
    },
    {
      id: 'supermarket',
      icon: '🛒',
      titleEs: 'Supermercado',
      nameEn: 'Supermarket',
      nameEs: 'Supermercado',
      level: 'A1 - B1',
      zoneTag: 'Pasillos • Frutas • Caja',
      accentHex: '#0ea5e9',
      glowRgba: 'rgba(14, 165, 233, 0.42)',
      gradientBg: 'radial-gradient(circle at 50% 24%, rgba(14,165,233,0.34) 0%, rgba(17,24,39,0.96) 65%, #070b14 100%)',
      loadingThemeBg: 'radial-gradient(circle at center, #111827 0%, #06080f 100%)'
    },
    {
      id: 'restaurant',
      icon: '🍽️',
      titleEs: 'Restaurante',
      nameEn: 'Restaurant',
      nameEs: 'Restaurante',
      level: 'A2 - B2',
      zoneTag: 'Mesas • Menú • Cocina',
      accentHex: '#f59e0b',
      glowRgba: 'rgba(245, 158, 11, 0.42)',
      gradientBg: 'radial-gradient(circle at 50% 24%, rgba(245,158,11,0.34) 0%, rgba(17,24,39,0.96) 65%, #070b14 100%)',
      loadingThemeBg: 'radial-gradient(circle at center, #111827 0%, #06080f 100%)'
    },
    {
      id: 'hotel',
      icon: '🏨',
      titleEs: 'Hotel',
      nameEn: 'Grand Hotel',
      nameEs: 'Hotel',
      level: 'A2 - B2',
      zoneTag: 'Recepción • Lobby • Suite',
      accentHex: '#eab308',
      glowRgba: 'rgba(234, 179, 8, 0.42)',
      gradientBg: 'radial-gradient(circle at 50% 24%, rgba(234,179,8,0.34) 0%, rgba(17,24,39,0.96) 65%, #070b14 100%)',
      loadingThemeBg: 'radial-gradient(circle at center, #111827 0%, #06080f 100%)'
    },
    {
      id: 'dating',
      icon: '🕯️',
      titleEs: 'Cita Romántica',
      nameEn: 'Romantic Date',
      nameEs: 'Cita Romántica',
      level: 'B1 - B2',
      zoneTag: 'Terraza • Conversación • Mesero',
      accentHex: '#f43f5e',
      glowRgba: 'rgba(244, 63, 94, 0.42)',
      gradientBg: 'radial-gradient(circle at 50% 24%, rgba(244,63,94,0.34) 0%, rgba(17,24,39,0.96) 65%, #070b14 100%)',
      loadingThemeBg: 'radial-gradient(circle at center, #111827 0%, #06080f 100%)'
    },
    {
      id: 'garden',
      icon: '🌿',
      titleEs: 'Jardín Botánico',
      nameEn: 'Botanical Garden',
      nameEs: 'Jardín Botánico',
      level: 'A1 - B1',
      zoneTag: 'Flora • Invernadero • Fuente',
      accentHex: '#10b981',
      glowRgba: 'rgba(16, 185, 129, 0.42)',
      gradientBg: 'radial-gradient(circle at 50% 24%, rgba(16,185,129,0.34) 0%, rgba(17,24,39,0.96) 65%, #070b14 100%)',
      loadingThemeBg: 'radial-gradient(circle at center, #111827 0%, #06080f 100%)'
    },
    {
      id: 'space',
      icon: '🚀',
      titleEs: 'Estación Espacial',
      nameEn: 'Space Station',
      nameEs: 'Estación Espacial',
      level: 'B1 - B2',
      zoneTag: 'Laboratorio • Esclusa • Órbita',
      accentHex: '#38bdf8',
      glowRgba: 'rgba(56, 189, 248, 0.45)',
      gradientBg: 'radial-gradient(circle at 50% 24%, rgba(56,189,248,0.36) 0%, rgba(17,24,39,0.96) 65%, #070b14 100%)',
      loadingThemeBg: 'radial-gradient(circle at center, #111827 0%, #06080f 100%)'
    }
  ];

  const FREE_FIRE_STYLE_TIPS = [
    '💡 CONSEJO: Toca cualquier objeto dentro del escenario para escuchar su pronunciación nativa y ver su fonética.',
    '💡 CONSEJO: Arrastra con un dedo o clic izquierdo para girar la cámara 360° y acércate con pellizco o rueda.',
    '💡 CONSEJO: En el Supermercado y Restaurante, explora cada estante y mesa para descubrir vocabulario real.',
    '💡 CONSEJO: Repite en voz alta cada palabra que selecciones para ganar puntos de experiencia.',
    '💡 CONSEJO: Usa las vistas rápidas de la barra superior para moverte al instante entre zonas del mapa.',
    '💡 CONSEJO: Abre el Catálogo en cualquier mundo para repasar todos los objetos y frases aprendidas.'
  ];

  let _loadingTipIntervalId = null;
  let _isPrecompilingWorld = false;
  let _activeLoadToken = 0;
  let _activeLoadTimers = [];

  function clearActiveLoadTimers() {
    while (_activeLoadTimers.length > 0) {
      const id = _activeLoadTimers.pop();
      try { clearTimeout(id); } catch (_) {}
    }
    if (_loadingTipIntervalId) {
      clearInterval(_loadingTipIntervalId);
      _loadingTipIntervalId = null;
    }
  }

  function setWorld3DTopCamBarVisibility(visible) {
    if (typeof document === 'undefined') return;
    const camBar = document.getElementById('unified-world3d-cam-bar');
    if (camBar) {
      camBar.style.setProperty('display', visible ? 'flex' : 'none', 'important');
      camBar.style.setProperty('visibility', visible ? 'visible' : 'hidden', 'important');
    }
  }

  function cancelWorld3DLoad(event) {
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    _activeLoadToken++;
    _isPrecompilingWorld = false;
    clearActiveLoadTimers();
    pauseLoop();

    if (typeof document !== 'undefined') {
      const loaderEl = document.getElementById('world3d-loading-screen');
      if (loaderEl) {
        loaderEl.classList.add('hidden');
        loaderEl.style.setProperty('display', 'none', 'important');
        loaderEl.style.opacity = '0';
        loaderEl.style.pointerEvents = 'none';
      }
      openWorld3DLobby();
    }
  }

  function handlePortalCardParallax(event, cardEl) {
    if (!event || !cardEl || typeof cardEl.getBoundingClientRect !== 'function') return;
    const rect = cardEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const relX = ((event.clientX - rect.left) / rect.width) - 0.5;
    const relY = ((event.clientY - rect.top) / rect.height) - 0.5;
    cardEl.style.setProperty('--parallax-x', `${(relX * 14).toFixed(1)}px`);
    cardEl.style.setProperty('--parallax-y', `${(relY * 14).toFixed(1)}px`);
    cardEl.style.setProperty('--tilt-x', `${(-relY * 7).toFixed(2)}deg`);
    cardEl.style.setProperty('--tilt-y', `${(relX * 7).toFixed(2)}deg`);
  }

  function resetPortalCardParallax(cardEl) {
    if (!cardEl || !cardEl.style) return;
    cardEl.style.setProperty('--parallax-x', '0px');
    cardEl.style.setProperty('--parallax-y', '0px');
    cardEl.style.setProperty('--tilt-x', '0deg');
    cardEl.style.setProperty('--tilt-y', '0deg');
  }

  function ensureWorld3DLobbyAndLoaderDOM() {
    if (typeof document === 'undefined') return;
    const host = document.getElementById('view-worldtour') || document.body;
    if (!host) return;

    let lobbyEl = document.getElementById('world3d-selection-hub');
    if (!lobbyEl) {
      lobbyEl = document.createElement('div');
      lobbyEl.id = 'world3d-selection-hub';
      lobbyEl.className = 'world3d-lobby-overlay hidden';
      host.appendChild(lobbyEl);
    }

    let loaderEl = document.getElementById('world3d-loading-screen');
    if (!loaderEl) {
      loaderEl = document.createElement('div');
      loaderEl.id = 'world3d-loading-screen';
      loaderEl.className = 'world3d-loading-overlay hidden';
      host.appendChild(loaderEl);
    }

    loaderEl.innerHTML = `
      <div class="world3d-loader-backdrop" id="world3dLoaderBackdrop"></div>

      <div class="world3d-loader-top-bar">
        <button type="button" onclick="window.cancelWorld3DLoad(event)"
          class="world3d-loader-cancel-btn" data-testid="btn-loader-back-portals">
          <span>✕ Cancelar y Salir</span>
        </button>
        <button type="button" onclick="if(typeof window.returnToMainPortals==='function') window.returnToMainPortals(event); else window.navigateTo('view-home');"
          class="world3d-loader-close-btn" data-testid="btn-loader-cancel">
          <span>🏠 Volver a Portales</span>
        </button>
      </div>

      <div class="world3d-loader-content">
        <div class="world3d-loader-orbital-stage" id="world3dLoaderIconRing">
          <div class="world3d-loader-orbital-ring ring-outer"></div>
          <div class="world3d-loader-orbital-ring ring-middle"></div>
          <div class="world3d-loader-orbital-ring ring-inner"></div>
          <div class="world3d-loader-portal-core">
            <span id="world3dLoaderIcon" class="world3d-loader-icon-3d">🌍</span>
          </div>
        </div>

        <span class="world3d-loader-badge" id="world3dLoaderLevelBadge">Nivel A1 - B1</span>
        <h2 id="world3dLoaderTitleEs" class="world3d-loader-title">Casa y Jardín</h2>
        <p id="world3dLoaderTitleEn" class="world3d-loader-subtitle">House & Garden</p>

        <div class="world3d-loader-progress-card">
          <div class="flex items-center justify-between text-xs font-bold mb-2">
            <span id="world3dLoaderStepLabel" class="text-sky-300 tracking-wide">Abriendo portal dimensional...</span>
            <span id="world3dLoaderPercent" class="font-mono text-amber-300 text-sm font-black">0%</span>
          </div>
          <div class="world3d-loader-bar-track">
            <div id="world3dLoaderBarFill" class="world3d-loader-bar-fill" style="width: 0%;"></div>
          </div>
          <div class="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
            <button type="button" onclick="window.cancelWorld3DLoad(event)"
              class="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600/70 text-[11px] font-extrabold cursor-pointer transition flex items-center gap-1.5">
              <span>✕ Cancelar y Salir</span>
            </button>
            <button type="button" onclick="if(typeof window.returnToMainPortals==='function') window.returnToMainPortals(event); else window.navigateTo('view-home');"
              class="px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 text-rose-200 border border-rose-500/40 text-[11px] font-extrabold cursor-pointer transition flex items-center gap-1.5">
              <span>🏠 Salir a Portales</span>
            </button>
          </div>
        </div>
      </div>

      <div class="world3d-loader-tip-bar">
        <span id="world3dLoaderTipText" class="world3d-loader-tip-text">
          💡 CONSEJO: Toca cualquier objeto dentro del escenario para escuchar su pronunciación nativa y ver su fonética.
        </span>
      </div>
    `;
  }

  function renderWorld3DLobbyCards() {
    ensureWorld3DLobbyAndLoaderDOM();
    const lobbyEl = document.getElementById('world3d-selection-hub');
    if (!lobbyEl) return;

    const cardsHtml = WORLD3D_LOBBY_META.map(meta => {
      const scen = WORLD_TOUR_SCENARIOS[meta.id];
      const totalItems = (scen && Array.isArray(scen.objects)) ? scen.objects.length : 50;
      const discoveredInWorld = (scen && Array.isArray(scen.objects))
        ? scen.objects.filter(o => discoveredObjectIds.has(o.id)).length
        : 0;
      const pct = Math.min(100, Math.round((discoveredInWorld / Math.max(1, totalItems)) * 100));
      const isCurrent = (currentScenarioKey === meta.id && isEngineInitialized);

      return `
        <article class="world3d-lobby-card world3d-hub-card group"
          style="--world-accent: ${meta.accentHex}; --world-glow: ${meta.glowRgba}; background: ${meta.gradientBg};"
          onmousemove="window.handlePortalCardParallax && window.handlePortalCardParallax(event, this)"
          onmouseleave="window.resetPortalCardParallax && window.resetPortalCardParallax(this)"
          onclick="window.openWorld3DScenario('${meta.id}')">

          <div class="portal-arch-header">
            <span class="portal-level-pill" style="border-color: ${meta.accentHex}88;">
              ${meta.level}
            </span>
            ${isCurrent ? '<span class="portal-active-pill">Activo</span>' : ''}
          </div>

          <div class="portal-dimensional-stage">
            <div class="portal-energy-ring portal-energy-ring-outer" style="border-color: ${meta.accentHex}88; box-shadow: 0 0 28px ${meta.glowRgba};"></div>
            <div class="portal-energy-ring portal-energy-ring-inner" style="border-color: ${meta.accentHex}cc;"></div>
            <div class="portal-scene-parallax">
              <span class="portal-world-icon">${meta.icon}</span>
            </div>
          </div>

          <div class="portal-card-identity">
            <h3 class="portal-title-es">${meta.titleEs}</h3>
            <p class="portal-title-en">${meta.nameEn} • ${meta.zoneTag}</p>
          </div>

          <div class="portal-card-footer">
            <div class="portal-progress-row">
              <span>Descubiertos</span>
              <span class="font-mono" style="color: ${meta.accentHex};">${discoveredInWorld}/${totalItems} (${pct}%)</span>
            </div>
            <div class="portal-progress-track">
              <div class="portal-progress-fill" style="width: ${pct}%; background: ${meta.accentHex};"></div>
            </div>

            <button type="button" onclick="event.stopPropagation(); window.openWorld3DScenario('${meta.id}')"
              class="world3d-lobby-explore-btn portal-enter-btn"
              style="background: linear-gradient(135deg, ${meta.accentHex}, #4f46e5);">
              <span>Entrar al Portal</span>
              <span>→</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    lobbyEl.innerHTML = `
      <div class="world3d-lobby-container">
        <div role="banner" class="world3d-lobby-header">
          <div class="flex items-center gap-3 flex-wrap">
            <button type="button" onclick="if(typeof window.returnToMainPortals==='function') window.returnToMainPortals(event); else window.navigateTo('view-home');"
              class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-sky-500/50 text-xs font-black flex items-center gap-2 cursor-pointer transition active:scale-95 shadow-lg">
              <span>← Volver a Portales</span>
            </button>
            <div>
              <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight">
                Portales Dimensionales 3D
              </h1>
              <p class="text-xs font-semibold text-slate-400">
                Elige un escenario interactivo para explorar y practicar vocabulario en contexto
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            ${isEngineInitialized ? `
              <button type="button" onclick="window.closeWorld3DLobbyAndResume()"
                class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg cursor-pointer transition active:scale-95 flex items-center gap-1.5">
                <span>▶ Volver al Escenario Activo</span>
              </button>
            ` : ''}
            <button type="button" onclick="if(typeof window.returnToMainPortals==='function') window.returnToMainPortals(event); else window.navigateTo('view-home');"
              class="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/40 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow-lg">
              <span>🏠 Menú Principal</span>
            </button>
          </div>
        </div>

        <div class="world3d-lobby-grid">
          ${cardsHtml}
        </div>

        <div class="flex items-center justify-center pt-2 pb-4">
          <button type="button" onclick="if(typeof window.returnToMainPortals==='function') window.returnToMainPortals(event); else window.navigateTo('view-home');"
            class="px-5 py-2.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-black flex items-center gap-2 cursor-pointer transition active:scale-95 shadow-xl">
            <span>← Regresar al Menú de Portales</span>
          </button>
        </div>
      </div>
    `;
  }

  function openWorld3DLobby() {
    if (typeof document === 'undefined') return;
    if (typeof window !== 'undefined' && typeof window.hideAllModules === 'function' && window._activeModule !== 'world3d') {
      window.hideAllModules();
    }

    const viewWorldTour = document.getElementById('view-worldtour');
    if (viewWorldTour) {
      viewWorldTour.classList.remove('hidden');
      viewWorldTour.style.setProperty('display', 'block', 'important');
      viewWorldTour.style.setProperty('visibility', 'visible', 'important');
      viewWorldTour.style.setProperty('opacity', '1', 'important');
    }

    if (document.body && document.body.classList) {
      document.body.classList.add('view-worldtour-active', 'in-immersive-portal');
    }
    window._activeModule = 'world3d';

    // Ocultar la barra de cámaras mientras el usuario está en la Galería de Portales
    setWorld3DTopCamBarVisibility(false);

    // Pausar loop 3D mientras el usuario está eligiendo en el Lobby para 0% consumo GPU
    pauseLoop();

    renderWorld3DLobbyCards();
    const lobbyEl = document.getElementById('world3d-selection-hub');
    if (lobbyEl) {
      lobbyEl.classList.remove('hidden');
      lobbyEl.style.setProperty('display', 'flex', 'important');
      lobbyEl.style.opacity = '1';
    }
  }

  function closeWorld3DLobbyAndResume() {
    const lobbyEl = typeof document !== 'undefined' ? document.getElementById('world3d-selection-hub') : null;
    if (lobbyEl) {
      lobbyEl.classList.add('hidden');
      lobbyEl.style.setProperty('display', 'none', 'important');
    }
    setWorld3DTopCamBarVisibility(true);
    initOrResumeWorld3D();
  }

  function disposePreviousScenarioGPU() {
    if (!scenarioDynamicRoot) return;
    try {
      scenarioDynamicRoot.traverse(obj => {
        if (obj.isMesh) {
          if (obj.geometry && typeof obj.geometry.dispose === 'function') {
            obj.geometry.dispose();
          }
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach(m => { if (m && typeof m.dispose === 'function') m.dispose(); });
            } else if (typeof obj.material.dispose === 'function') {
              obj.material.dispose();
            }
          }
        }
      });
    } catch (_) {}
  }

  function prewarmScenarioTextures(scenarioKey) {
    if (!ProceduralMaterialFactory) return;
    try {
      if (scenarioKey === 'supermarket') {
        ProceduralMaterialFactory.createProductLabel('CORN FLAKES', 'CRUNCHY GOLDEN CEREAL', '#d97706', '#fef08a');
        ProceduralMaterialFactory.createProductLabel('CHOCO RINGS', 'COCOA OAT RINGS', '#451a03', '#f59e0b');
        ProceduralMaterialFactory.createProductLabel('HONEY OATS', '100% WHOLE GRAIN', '#0284c7', '#fde047');
        ProceduralMaterialFactory.createProductLabel('MAYONNAISE', 'REAL CREAMY MAYO', '#1e3a8a', '#fef08a');
        ProceduralMaterialFactory.createProductLabel('FRESH MILK', 'PAST. WHOLE MILK 1L', '#0284c7', '#ffffff');
      } else if (scenarioKey === 'restaurant' || scenarioKey === 'dating') {
        ProceduralMaterialFactory.createProductLabel('GRAND CRU', 'RESERVE CABERNET', '#4c0519', '#fde047');
        ProceduralMaterialFactory.createScreenUI('MENU & WINE LIST', ['1. Filet Mignon', '2. Pan-Seared Salmon', '3. Chocolate Fondant'], '#f59e0b');
      } else if (scenarioKey === 'space') {
        ProceduralMaterialFactory.createSolarCellMaterial();
        ProceduralMaterialFactory.createScreenUI('ORBITAL TELEMETRY', ['O2 PRESSURE: 101.3 kPa', 'ALTITUDE: 408 KM ISS', 'SOLAR ARRAY: 99.4%'], '#38bdf8');
      } else if (scenarioKey === 'hotel') {
        ProceduralMaterialFactory.createScreenUI('VIP RECEPTION', ['SUITE 501 - READY', 'CHECK-IN: ACTIVE', 'CONCIERGE: ONLINE'], '#eab308');
      } else if (scenarioKey === 'house') {
        ProceduralMaterialFactory.createScreenUI('MASTERENG OS', ['Grammar Module: 98%', 'Speaking Practice: Ready', '3D House Active'], '#a855f7');
      }
    } catch (_) {}
  }

  // =========================================================================
  // HIDRATACIÓN DE MESHES BLENDER GLB CON VOCABULARIO INTERACTIVO Y FONÉTICA
  // =========================================================================
  function hydrateAndAttachBlenderWorldGLB(glbScene, scenarioKey) {
    if (!glbScene) return;
    const activeTargetScene = (typeof World3D !== 'undefined' && World3D.scene) ? World3D.scene : scene;
    if (!scenarioDynamicRoot) {
      scenarioDynamicRoot = new THREE.Group();
      scenarioDynamicRoot.name = 'ScenarioDynamicRoot';
      if (activeTargetScene) activeTargetScene.add(scenarioDynamicRoot);
    } else if (activeTargetScene && scenarioDynamicRoot.parent !== activeTargetScene) {
      activeTargetScene.add(scenarioDynamicRoot);
    }
    glbScene.name = 'Blender_GLB_' + scenarioKey;

    // 1. Auto-Centrado y Encuadre con Box3 (Base en y = 0 exacto, centrado en X y Z)
    if (typeof THREE !== 'undefined' && THREE.Box3 && THREE.Vector3) {
      glbScene.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(glbScene);
      if (!box.isEmpty()) {
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);
        glbScene.position.x = -center.x;
        glbScene.position.z = -center.z;
        glbScene.position.y = -box.min.y;
        glbScene.updateMatrixWorld(true);

        // Colocar la cámara en (0, Math.max(8, size.y * 1.6), Math.max(12, size.z * 1.4)) mirando a (0, size.y * 0.35, 0)
        const camY = Math.max(8, size.y * 1.6);
        const camZ = Math.max(12, size.z * 1.4);
        const lookY = size.y * 0.35;
        if (camera) {
          camera.position.set(0, camY, camZ);
          camera.lookAt(0, lookY, 0);
        }
        if (controls) {
          controls.target.set(0, lookY, 0);
          if (typeof controls.syncSphericalFromObject === 'function') {
            controls.syncSphericalFromObject();
          }
          controls.update();
        }
      }
    }

    // 3. Vincular nodos interactivos con vocabulario oficial y filtrar arquitectura
    bindGlbInteractiveNodes(glbScene, scenarioKey);

    // 4. Agregar a la escena dinámica
    scenarioDynamicRoot.add(glbScene);

    // 5. Iniciar bucle requestAnimationFrame inmediatamente
    resumeLoop();
  }

  function buildProceduralFallbackWorld(scenarioKey) {
    const activeTargetScene = (typeof World3D !== 'undefined' && World3D.scene) ? World3D.scene : scene;
    if (!activeTargetScene || typeof THREE === 'undefined') return;
    if (!scenarioDynamicRoot) {
      scenarioDynamicRoot = new THREE.Group();
      scenarioDynamicRoot.name = 'ScenarioDynamicRoot';
      activeTargetScene.add(scenarioDynamicRoot);
    }
    const floorGeo = new THREE.PlaneGeometry(16, 14);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.name = 'Fallback_Floor';
    scenarioDynamicRoot.add(floor);

    const wallGeo = new THREE.BoxGeometry(16, 3.6, 0.25);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 1.8, -6);
    wall.name = 'Fallback_Wall';
    scenarioDynamicRoot.add(wall);

    if (camera) {
      camera.position.set(0, 8, 12);
      camera.lookAt(0, 1, 0);
    }
    if (controls) {
      controls.target.set(0, 1, 0);
      controls.update();
    }
  }
  global.buildProceduralFallbackWorld = buildProceduralFallbackWorld;

  function loadScenarioGLBWithFallback(scenarioKey, initialUrl, onComplete) {
    const LoaderClass = getGLTFLoaderClass();
    const loader = new LoaderClass();
    const directPath = 'assets/models/worlds/' + (scenarioKey === 'garden' ? 'garden' : scenarioKey) + '.glb';

    function tryAttachGLTF(gltf) {
      if (!gltf || !gltf.scene) return false;
      let meshCount = 0;
      gltf.scene.traverse(o => { if (o.isMesh) meshCount++; });
      if (meshCount === 0) return false;
      hydrateAndAttachBlenderWorldGLB(gltf.scene, scenarioKey);
      return true;
    }

    function runProceduralFallback() {
      console.warn('[World3D] Fallback procedimental anti-pantalla-negra para:', scenarioKey);
      buildProceduralFallbackWorld(scenarioKey);
      resumeLoop();
      if (typeof onComplete === 'function') onComplete();
    }

    function tryFetchDirectPath() {
      console.warn('[World3D] Descargando directamente vía fetch:', directPath);
      if (typeof window !== 'undefined' && window.AssetDownloadManager && typeof window.AssetDownloadManager.deletePack === 'function') {
        try { window.AssetDownloadManager.deletePack('world_' + scenarioKey); } catch (_) {}
      }
      fetch(directPath)
        .then(res => {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.arrayBuffer();
        })
        .then(buf => {
          try {
            const parsed = (typeof loader.parse === 'function') ? loader.parse(buf, directPath) : parseGLB(buf);
            if (tryAttachGLTF(parsed)) {
              if (typeof onComplete === 'function') onComplete();
              return;
            }
          } catch (err) {
            console.warn('[World3D] Error parseando fetch directo:', err);
          }
          runProceduralFallback();
        })
        .catch(err => {
          console.warn('[World3D] Fetch directo falló:', err);
          runProceduralFallback();
        });
    }

    loader.load(initialUrl, (gltf) => {
      if (tryAttachGLTF(gltf)) {
        if (typeof onComplete === 'function') onComplete();
      } else {
        tryFetchDirectPath();
      }
    }, undefined, (err) => {
      console.warn('[World3D] Error cargando URL inicial:', initialUrl, err);
      tryFetchDirectPath();
    });
  }
  global.loadScenarioGLBWithFallback = loadScenarioGLBWithFallback;

  function openWorld3DScenario(scenarioKey) {
    const targetKey = WORLD_TOUR_SCENARIOS[scenarioKey] ? scenarioKey : 'house';
    const meta = WORLD3D_LOBBY_META.find(m => m.id === targetKey) || WORLD3D_LOBBY_META[0];
    const glbUrl = 'assets/models/worlds/' + (targetKey === 'garden' ? 'garden' : targetKey) + '.glb';

    enforceWorld3DContainerStyle();

    if (typeof window !== 'undefined' && window.AssetDownloadManager && typeof window.AssetDownloadManager.requireAssetPack === 'function') {
      window.AssetDownloadManager.requireAssetPack({
        packId: 'world_' + targetKey,
        title: meta ? meta.titleEs : targetKey,
        category: 'world3d',
        glbUrl: glbUrl,
        estimatedMB: meta ? (meta.estimatedMB || 0.5) : 0.5,
        onReady: function(blobUrl) {
          loadWorld3DWithPrecompile(targetKey, blobUrl || glbUrl);
        },
        onCancel: function() {
          console.log('[World3D] Descarga cancelada. Permaneciendo en Lobby de Mundos 3D.');
          openWorld3DLobby();
        }
      });
    } else {
      loadWorld3DWithPrecompile(targetKey, glbUrl);
    }
  }

  function loadWorld3DWithPrecompile(scenarioKey, blobOrGlbUrl) {
    if (typeof document === 'undefined') {
      return switch3DScenario(scenarioKey);
    }
    if (_isPrecompilingWorld) return;
    _isPrecompilingWorld = true;
    const loadToken = ++_activeLoadToken;
    clearActiveLoadTimers();

    ensureWorld3DLobbyAndLoaderDOM();
    const targetKey = WORLD_TOUR_SCENARIOS[scenarioKey] ? scenarioKey : 'house';
    const meta = WORLD3D_LOBBY_META.find(m => m.id === targetKey) || WORLD3D_LOBBY_META[0];

    // Ocultar Lobby y barra superior de cámaras para que NADA se trasluzca detrás de la pantalla de carga
    const lobbyEl = document.getElementById('world3d-selection-hub');
    if (lobbyEl) {
      lobbyEl.classList.add('hidden');
      lobbyEl.style.setProperty('display', 'none', 'important');
    }
    setWorld3DTopCamBarVisibility(false);

    const loaderEl = document.getElementById('world3d-loading-screen');
    const backdropEl = document.getElementById('world3dLoaderBackdrop');
    const iconEl = document.getElementById('world3dLoaderIcon');
    const iconRingEl = document.getElementById('world3dLoaderIconRing');
    const titleEnEl = document.getElementById('world3dLoaderTitleEn');
    const titleEsEl = document.getElementById('world3dLoaderTitleEs');
    const badgeEl = document.getElementById('world3dLoaderLevelBadge');
    const stepLabelEl = document.getElementById('world3dLoaderStepLabel');
    const pctEl = document.getElementById('world3dLoaderPercent');
    const fillEl = document.getElementById('world3dLoaderBarFill');
    const tipTextEl = document.getElementById('world3dLoaderTipText');

    if (backdropEl) backdropEl.style.background = meta.loadingThemeBg;
    if (iconEl) iconEl.textContent = meta.icon;
    if (iconRingEl) iconRingEl.style.setProperty('--loader-accent', meta.accentHex);
    if (titleEsEl) titleEsEl.textContent = meta.titleEs || meta.nameEs;
    if (titleEnEl) titleEnEl.textContent = `${meta.nameEn} • ${meta.zoneTag}`;
    if (badgeEl) {
      badgeEl.textContent = `Nivel ${meta.level}`;
      badgeEl.style.borderColor = `${meta.accentHex}88`;
      badgeEl.style.color = meta.accentHex;
    }

    const setLoaderProgress = (pct, label) => {
      if (pctEl) pctEl.textContent = `${pct}%`;
      if (fillEl) {
        fillEl.style.width = `${pct}%`;
        fillEl.style.background = `linear-gradient(90deg, ${meta.accentHex}, #38bdf8, #34d399)`;
      }
      if (stepLabelEl) stepLabelEl.textContent = label;
    };

    setLoaderProgress(10, 'Abriendo portal dimensional...');

    let tipIdx = Math.floor(Math.random() * FREE_FIRE_STYLE_TIPS.length);
    if (tipTextEl) tipTextEl.textContent = FREE_FIRE_STYLE_TIPS[tipIdx];
    _loadingTipIntervalId = setInterval(() => {
      tipIdx = (tipIdx + 1) % FREE_FIRE_STYLE_TIPS.length;
      if (tipTextEl) tipTextEl.textContent = FREE_FIRE_STYLE_TIPS[tipIdx];
    }, 2500);

    if (loaderEl) {
      loaderEl.classList.remove('hidden');
      loaderEl.style.setProperty('display', 'flex', 'important');
      loaderEl.style.opacity = '1';
      loaderEl.style.pointerEvents = 'auto';
    }

    const finishLoaderAndShowScene = () => {
      if (loadToken !== _activeLoadToken) return;
      clearActiveLoadTimers();
      setLoaderProgress(100, '¡Escenario listo!');
      try {
        if (renderer && scene && camera) {
          if (typeof renderer.compile === 'function') {
            renderer.compile(scene, camera);
          }
          renderer.render(scene, camera);
        }
      } catch (_) {}

      const tFade = setTimeout(() => {
        if (loadToken !== _activeLoadToken) return;
        setWorld3DTopCamBarVisibility(true);
        if (loaderEl) {
          loaderEl.style.transition = 'opacity 180ms ease-out';
          loaderEl.style.opacity = '0';
          loaderEl.style.pointerEvents = 'none';
          const tHide = setTimeout(() => {
            if (loadToken !== _activeLoadToken) return;
            loaderEl.classList.add('hidden');
            loaderEl.style.setProperty('display', 'none', 'important');
            _isPrecompilingWorld = false;
          }, 180);
          _activeLoadTimers.push(tHide);
        } else {
          _isPrecompilingWorld = false;
        }
        resumeLoop();
      }, 90);
      _activeLoadTimers.push(tFade);
    };

    // Fail-safe watchdog: garantiza que la pantalla de carga NUNCA se quede congelada en 85%
    const watchdogTimer = setTimeout(() => {
      if (loadToken === _activeLoadToken && _isPrecompilingWorld) {
        finishLoaderAndShowScene();
      }
    }, 1800);
    _activeLoadTimers.push(watchdogTimer);

    // PASO 1 (30% - "Liberando memoria gráfica...")
    const t1 = setTimeout(() => {
      if (loadToken !== _activeLoadToken) return;
      setLoaderProgress(30, 'Liberando memoria gráfica...');
      try {
        pauseLoop();
        disposePreviousScenarioGPU();
      } catch (err) {
        console.warn('[World3D] Dispose warning:', err);
      }

      // PASO 2 (60% - "Preparando iluminación y materiales...")
      const t2 = setTimeout(() => {
        if (loadToken !== _activeLoadToken) return;
        setLoaderProgress(60, 'Preparando iluminación y materiales...');
        try {
          prewarmScenarioTextures(targetKey);
        } catch (err) {
          console.warn('[World3D] Prewarm warning:', err);
        }

        // PASO 3 (85% - "Construyendo objetos del escenario...")
        // Envuelve la compilación y carga en Promise.race con timeout de seguridad de 1000ms
        const t3 = setTimeout(() => {
          if (loadToken !== _activeLoadToken) return;
          setLoaderProgress(85, 'Construyendo objetos del escenario...');

          const loadPromise = new Promise((resolve) => {
            try {
              enforceWorld3DContainerStyle();
              switch3DScenario(targetKey);
              const finalGlbUrl = blobOrGlbUrl || ('assets/models/worlds/' + (targetKey === 'garden' ? 'garden' : targetKey) + '.glb');
              loadScenarioGLBWithFallback(targetKey, finalGlbUrl, resolve);
            } catch (err) {
              console.error('[World3D] Error building scenario:', err);
              buildProceduralFallbackWorld(targetKey);
              resolve();
            }
          });

          const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1000));

          Promise.race([loadPromise, timeoutPromise]).then(() => {
            if (loadToken !== _activeLoadToken) return;
            // PASO 4 (100% - Pre-compilación y apertura inmediata)
            setLoaderProgress(100, '¡Escenario listo!');
            const t4 = setTimeout(() => {
              finishLoaderAndShowScene();
            }, 30);
            _activeLoadTimers.push(t4);
          });
        }, 20);
        _activeLoadTimers.push(t3);
      }, 20);
      _activeLoadTimers.push(t2);
    }, 16);
    _activeLoadTimers.push(t1);
  }

  global.hydrateAndAttachBlenderWorldGLB = hydrateAndAttachBlenderWorldGLB;
  global.bindGlbInteractiveNodes = bindGlbInteractiveNodes;
  global.World3D.hydrateAndAttachBlenderWorldGLB = hydrateAndAttachBlenderWorldGLB;
  global.World3D.bindGlbInteractiveNodes = bindGlbInteractiveNodes;
  global.openWorld3DScenario = openWorld3DScenario;
  global.openWorld3DLobby = openWorld3DLobby;
  global.closeWorld3DLobbyAndResume = closeWorld3DLobbyAndResume;
  global.loadWorld3DWithPrecompile = loadWorld3DWithPrecompile;
  global.cancelWorld3DLoad = cancelWorld3DLoad;
  global.handlePortalCardParallax = handlePortalCardParallax;
  global.resetPortalCardParallax = resetPortalCardParallax;
  global.World3D.openWorld3DScenario = openWorld3DScenario;
  global.World3D.openWorld3DLobby = openWorld3DLobby;
  global.World3D.closeWorld3DLobbyAndResume = closeWorld3DLobbyAndResume;
  global.World3D.loadWorld3DWithPrecompile = loadWorld3DWithPrecompile;
  global.World3D.cancelWorld3DLoad = cancelWorld3DLoad;
  if (typeof window !== 'undefined') {
    window.openWorld3DScenario = openWorld3DScenario;
    window.openWorld3DLobby = openWorld3DLobby;
    window.closeWorld3DLobbyAndResume = closeWorld3DLobbyAndResume;
    window.loadWorld3DWithPrecompile = loadWorld3DWithPrecompile;
    window.cancelWorld3DLoad = cancelWorld3DLoad;
    window.handlePortalCardParallax = handlePortalCardParallax;
    window.resetPortalCardParallax = resetPortalCardParallax;
    if (window.World3D) {
      window.World3D.openWorld3DScenario = openWorld3DScenario;
      window.World3D.openWorld3DLobby = openWorld3DLobby;
      window.World3D.closeWorld3DLobbyAndResume = closeWorld3DLobbyAndResume;
      window.World3D.loadWorld3DWithPrecompile = loadWorld3DWithPrecompile;
      window.World3D.cancelWorld3DLoad = cancelWorld3DLoad;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.World3D;
  }
})(typeof window !== 'undefined' ? window : globalThis);

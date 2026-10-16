const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const isCRLF = content.includes('\r\n');
let code = content.replace(/\r\n/g, '\n');

console.log('🚀 Applying all 7 core features and refactoring...');

// ========================================================
// 1. UPDATE 3D SIMULATOR: House & Rooms with Real Models, Lighting & Collisions
// ========================================================

// Update initThreeWorld to guarantee non-black screen, exact dimensions and lights
const oldInitThreeWorldRegex = /function initThreeWorld\(\)\s*\{[\s\S]*?runThreeAnimationLoop\(\);\s*\}/;

const newInitThreeWorld = `function initThreeWorld() {
      stopThreeSimulator();

      const container = document.getElementById("threeCanvasContainer");
      if (!container) return;
      container.innerHTML = "";

      if (typeof THREE === 'undefined') {
        container.innerHTML = \`
          <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-300">
            <span class="text-xs font-mono uppercase text-amber-400 font-bold mb-2">Motor Gráfico Three.js</span>
            <p class="text-sm">Iniciando aceleración gráfica local...</p>
          </div>
        \`;
        return;
      }

      // Medición robusta del contenedor con fallback explícito
      const rect = container.getBoundingClientRect();
      const width = rect.width > 50 ? rect.width : (container.clientWidth || window.innerWidth || 800);
      const height = rect.height > 50 ? rect.height : (container.clientHeight || 550);

      // Camera con proyección explícita
      threeCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      threeCamera.aspect = width / height;
      threeCamera.updateProjectionMatrix();

      // Renderer de Alta Fidelidad
      threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      threeRenderer.setSize(width, height);
      threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      threeRenderer.toneMappingExposure = 1.25;
      if (THREE.SRGBColorSpace) {
        threeRenderer.outputColorSpace = THREE.SRGBColorSpace;
      } else if (threeRenderer.outputEncoding !== undefined) {
        threeRenderer.outputEncoding = THREE.sRGBEncoding;
      }
      threeRenderer.shadowMap.enabled = true;
      threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(threeRenderer.domElement);

      // Scene con fondo de iluminación interior acogedora
      threeScene = new THREE.Scene();
      threeScene.background = new THREE.Color(0x181e2b);
      threeScene.fog = new THREE.FogExp2(0x181e2b, 0.022);

      // Iluminación Total Visible Inmediata (Sin pantallas oscuras)
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      threeScene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
      dirLight.position.set(10, 20, 12);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 50;
      dirLight.shadow.camera.left = -16;
      dirLight.shadow.camera.right = 16;
      dirLight.shadow.camera.top = 16;
      dirLight.shadow.camera.bottom = -16;
      dirLight.shadow.bias = -0.0004;
      dirLight.shadow.radius = 2.0;
      threeScene.add(dirLight);

      // Luz cálida puntual central (PointLight de techo en Sala)
      const roomLight = new THREE.PointLight(0xffedd5, 1.6, 12, 1.5);
      roomLight.position.set(-4, 2.8, -4);
      threeScene.add(roomLight);

      // Construcción del Escenario 3D Estilizado (Madera, Zoclos, Ventanas, Hamaca, Sofá, etc.)
      buildScenario3D(activeScenarioKey || 'house');

      // Personaje en tercera persona
      buildThirdPersonCharacter();

      // Reset de controles e inercia suave
      cameraYaw = 0;
      cameraPitch = 0.35;
      walkAnimClock = 0;
      playerVelocityX = 0;
      playerVelocityZ = 0;
      isSimulatorRunning = true;

      // Listeners de teclado y mouse
      setupSimulatorInputListeners();

      // Asegurar redimensionamiento inmediato en el próximo frame
      requestAnimationFrame(() => onSimulatorResize());
      setTimeout(() => onSimulatorResize(), 120);

      // Iniciar bucle de animación
      runThreeAnimationLoop();
    }`;

if (oldInitThreeWorldRegex.test(code)) {
  code = code.replace(oldInitThreeWorldRegex, newInitThreeWorld);
  console.log('✅ initThreeWorld replaced with robust sizing & visible lighting.');
} else {
  console.warn('⚠️ oldInitThreeWorldRegex did not match.');
}

// ========================================================
// 2. ENRICH WORLD_TOUR_SCENARIOS.house WITH REQUESTED OBJECTS
// ========================================================
const oldHouseObjSearch = '"id": "hammock",';
if (code.includes(oldHouseObjSearch)) {
  console.log('ℹ️ Hammock already exists in house scenario.');
}

// Replace build3DObjectGeometry to render Hamaca con ganchos, Sofá, Lámpara de pie funcional, Mesa de centro, Cuadro, etc.
const oldBuild3dGeoRegex = /function build3DObjectGeometry\(obj\)\s*\{[\s\S]*?return group;\s*\}/;

const newBuild3dGeo = `function build3DObjectGeometry(obj) {
      const group = new THREE.Group();
      const parquet = getParquetTextures();

      // Material principal estilizado
      const mainMat = new THREE.MeshStandardMaterial({
        color: obj.color || 0x38bdf8,
        roughness: 0.35,
        metalness: 0.25
      });

      if (obj.shape === 'hammock') {
        // Ganchos metálicos de pared detallados
        const hookMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
        [-1.6, 1.6].forEach(hx => {
          const hookBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12), hookMat);
          hookBase.rotation.z = Math.PI / 2;
          hookBase.position.set(hx, 1.4, 0);
          const hookRing = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 8, 16), hookMat);
          hookRing.position.set(hx + (hx > 0 ? -0.05 : 0.05), 1.36, 0);
          group.add(hookBase, hookRing);
        });

        // Cuerdas trenzadas de suspensión
        const ropeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.85 });
        [-0.18, 0.18].forEach(rz => {
          const ropeGeoL = new THREE.CylinderGeometry(0.02, 0.02, 1.0, 6);
          const rL = new THREE.Mesh(ropeGeoL, ropeMat);
          rL.rotation.z = Math.PI / 3.2;
          rL.position.set(-1.15, 0.95, rz);
          const rR = new THREE.Mesh(ropeGeoL, ropeMat);
          rR.rotation.z = -Math.PI / 3.2;
          rR.position.set(1.15, 0.95, rz);
          group.add(rL, rR);
        });

        // Malla tejida de la hamaca con curvatura ergonómica
        const curve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(-1.0, 0.55, 0),
          new THREE.Vector3(-0.35, -0.25, 0),
          new THREE.Vector3(0.35, -0.25, 0),
          new THREE.Vector3(1.0, 0.55, 0)
        );
        const tubeGeo = new THREE.TubeGeometry(curve, 28, 0.42, 12, false);
        const hammockMesh = new THREE.Mesh(tubeGeo, new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.5,
          metalness: 0.1
        }));
        hammockMesh.scale.set(1, 0.4, 1.9);
        hammockMesh.castShadow = true;
        group.add(hammockMesh);

      } else if (obj.shape === 'sofa' || obj.id === 'sofa') {
        // Sofá elegante con cojines y descansabrazos
        const sofaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.1 });
        const cushionMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
        
        // Asiento base
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 1.0), sofaMat);
        base.position.y = 0.25;
        base.castShadow = true;
        group.add(base);

        // Respaldo
        const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 0.25), sofaMat);
        back.position.set(0, 0.75, -0.4);
        back.castShadow = true;
        group.add(back);

        // Descansabrazos
        [-1.15, 1.15].forEach(ax => {
          const arm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 1.0), sofaMat);
          arm.position.set(ax, 0.55, 0);
          arm.castShadow = true;
          group.add(arm);
        });

        // 2 Cojines mullidos
        [-0.55, 0.55].forEach(cx => {
          const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.18, 0.8), cushionMat);
          cushion.position.set(cx, 0.5, 0.05);
          group.add(cushion);
        });

      } else if (obj.shape === 'floor_lamp' || obj.id === 'floor_lamp') {
        // Lámpara de pie estilizada con PointLight cálido funcional
        const metalMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.85, roughness: 0.2 });
        const shadeMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3, emissive: 0xfef08a, emissiveIntensity: 0.6 });

        // Base circular
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 16), metalMat);
        base.position.y = 0.03;
        group.add(base);

        // Mástil vertical esbelto
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.9, 12), metalMat);
        pole.position.y = 0.95;
        group.add(pole);

        // Pantalla cónica
        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.45, 16, 1, true), shadeMat);
        shade.position.y = 1.9;
        group.add(shade);

        // Foco emisor
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        bulb.position.y = 1.85;
        group.add(bulb);

        // Luz puntual cálida funcional
        const lampLight = new THREE.PointLight(0xffedd5, 2.2, 10, 1.6);
        lampLight.position.y = 1.85;
        lampLight.castShadow = true;
        group.add(lampLight);

      } else if (obj.shape === 'coffee_table' || obj.id === 'coffee_table') {
        // Mesa de centro de madera con patas estilizadas
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.3, metalness: 0.15 });
        
        // Tablero
        const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.9), woodMat);
        top.position.y = 0.45;
        top.castShadow = true;
        group.add(top);

        // 4 Patas
        [[-0.7, -0.35], [0.7, -0.35], [-0.7, 0.35], [0.7, 0.35]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.45, 8), woodMat);
          leg.position.set(lx, 0.225, lz);
          leg.castShadow = true;
          group.add(leg);
        });

        // Taza de café o libro decorativo
        const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.1, 10), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
        mug.position.set(0.2, 0.54, 0);
        group.add(mug);

      } else if (obj.shape === 'painting' || obj.id === 'painting') {
        // Cuadro decorativo en la pared
        const frameMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, metalness: 0.7, roughness: 0.3 });
        const canvasMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.8 });

        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 0.05), frameMat);
        const canvas = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.06), canvasMat);
        group.add(frame, canvas);

      } else if (obj.shape === 'lamp') {
        // Lámpara de techo
        const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.0, 6), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
        cord.position.y = 0.5;
        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.25, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.7, side: THREE.DoubleSide }));
        shade.position.y = 0.05;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 2.0 }));
        group.add(cord, shade, bulb);

      } else if (obj.shape === 'pillow') {
        const pillowMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.5), new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.7 }));
        pillowMesh.castShadow = true;
        group.add(pillowMesh);

      } else if (obj.shape === 'mirror') {
        const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.4, 0.08), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 }));
        const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 1.25), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.05, metalness: 0.95 }));
        mirrorGlass.position.z = 0.045;
        group.add(mirrorFrame, mirrorGlass);

      } else if (obj.shape === 'faucet') {
        const faucetMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 10), faucetMat);
        const neck = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.035, 8, 16, Math.PI), faucetMat);
        neck.rotation.z = -Math.PI / 2;
        neck.position.set(0, 0.25, 0);
        group.add(base, neck);

      } else {
        // Objeto genérico cúbico estilizado
        const w = obj.size ? obj.size.w : 0.8;
        const h = obj.size ? obj.size.h : 0.8;
        const d = obj.size ? obj.size.d : 0.8;
        const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mainMat);
        box.castShadow = true;
        box.receiveShadow = true;
        group.add(box);
      }

      return group;
    }`;

if (oldBuild3dGeoRegex.test(code)) {
  code = code.replace(oldBuild3dGeoRegex, newBuild3dGeo);
  console.log('✅ build3DObjectGeometry updated with stylized Hammock, Sofa, Floor Lamp, Coffee Table, and Painting.');
} else {
  console.warn('⚠️ oldBuild3dGeoRegex did not match.');
}

// Ensure house scenario has the key requested objects in WORLD_TOUR_SCENARIOS
const houseObjectsSnippet = `"id": "hammock",`;
if (code.includes(houseObjectsSnippet)) {
  // Let's add sofa, floor_lamp, coffee_table, painting if they aren't in house objects
  if (!code.includes('"id": "sofa",')) {
    const insertAfter = `"shape": "hammock",\n        "usage": "Se utiliza comúnmente colgada de ganchos o árboles para siestas y descanso ergonómico en climas cálidos.",\n        "example": "The hammock is hung from two metal hooks in the wall to save floor space.",\n        "exampleEs": "La hamaca está colgada de dos ganchos de metal en la pared para ahorrar espacio en el suelo."\n      },`;
    
    const extraHouseObjs = `${insertAfter}
      {
        "id": "sofa",
        "en": "Sofa / Couch",
        "ipa": "/ˈsoʊ.fə/",
        "es": "Sofá confortable",
        "room": "Living Room",
        "category": "Furniture / Seating",
        "pos": { "x": -4, "y": 0.4, "z": -1.5 },
        "size": { "w": 2.4, "h": 0.9, "d": 1.1 },
        "color": 3359061,
        "shape": "sofa",
        "usage": "Mueble principal de descanso y convivencia para sentarse cómodamente.",
        "example": "Please sit on the comfortable sofa and make yourself at home.",
        "exampleEs": "Por favor toma asiento en el cómodo sofá y siéntete como en casa."
      },
      {
        "id": "floor_lamp",
        "en": "Floor lamp",
        "ipa": "/flɔːr læmp/",
        "es": "Lámpara de pie cálida",
        "room": "Living Room",
        "category": "Lighting / Ambiance",
        "pos": { "x": -6.2, "y": 0.95, "z": -1.5 },
        "size": { "w": 0.7, "h": 1.9, "d": 0.7 },
        "color": 16707722,
        "shape": "floor_lamp",
        "usage": "Luminaria vertical con luz puntual cálida para lectura o ambientación.",
        "example": "Turn on the tall floor lamp beside the armchair to read comfortably.",
        "exampleEs": "Enciende la alta lámpara de pie junto al sillón para leer cómodamente."
      },
      {
        "id": "coffee_table",
        "en": "Coffee table",
        "ipa": "/ˈkɑː.fi ˌteɪ.bəl/",
        "es": "Mesa de centro",
        "room": "Living Room",
        "category": "Furniture / Living",
        "pos": { "x": -4, "y": 0.25, "z": -2.8 },
        "size": { "w": 1.6, "h": 0.5, "d": 0.9 },
        "color": 7878927,
        "shape": "coffee_table",
        "usage": "Mesa baja situada frente al sofá para bebidas, libros o revistas.",
        "example": "She placed a warm mug of tea on the wooden coffee table.",
        "exampleEs": "Ella colocó una taza de té caliente sobre la mesa de centro de madera."
      },
      {
        "id": "painting",
        "en": "Painting",
        "ipa": "/ˈpeɪn.tɪŋ/",
        "es": "Cuadro decorativo",
        "room": "Living Room",
        "category": "Decor / Art",
        "pos": { "x": -4, "y": 2.1, "z": -7.8 },
        "size": { "w": 1.4, "h": 1.0, "d": 0.1 },
        "color": 166723,
        "shape": "painting",
        "usage": "Obra de arte enmarcada colgada en la pared para ambientación estética.",
        "example": "A landscape painting hangs above the headboard on the main wall.",
        "exampleEs": "Un cuadro de paisaje cuelga sobre la cabecera en la pared principal."
      },`;
    
    code = code.replace(insertAfter, extraHouseObjs);
    console.log('✅ Added sofa, floor_lamp, coffee_table, painting to WORLD_TOUR_SCENARIOS.house.');
  }
}

// ========================================================
// 3. IMPLEMENT NEW "MUSIC SESSION" (PORTAL 3)
// ========================================================
// Replace view-medialab content with YouTube embedded player, synchronized karaoke lyrics and tap-to-inspect words
const oldMediaLabRegex = /<section id="view-medialab"[\s\S]*?<\/section>/;

const newMediaLabSection = `<section id="view-medialab" class="min-h-screen pt-16 pb-16 px-4 sm:px-6 w-full max-w-5xl mx-auto flex flex-col items-center hidden">
      
      <!-- Barra superior fija de retorno -->
      <div class="w-full pt-2 pb-4 flex items-center justify-between border-b border-slate-800/80 mb-6">
        <button onclick="goToHomePortals()" class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-500 text-slate-200 hover:text-white text-xs font-semibold tracking-wide transition cursor-pointer shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          <span>Portales Principales</span>
        </button>
        <span class="text-xs font-mono text-cyan-400 font-semibold px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
          Portal 3: Music Session
        </span>
      </div>

      <!-- Encabezado de Music Session -->
      <div class="w-full mb-6">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Music Session: Letras Sincronizadas</h1>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">Aprende inglés cantando con reproductor de video, letras karaoke en tiempo real y traducción instantánea de palabras.</p>
      </div>

      <!-- Selector de Canciones Populares -->
      <div class="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
        <button onclick="selectMusicTrack(0)" id="musicTrackBtn-0" class="p-3 rounded-2xl bg-slate-900 border border-cyan-500/60 text-left transition hover:scale-[1.02] cursor-pointer">
          <span class="text-[10px] font-mono uppercase text-cyan-400 font-bold block">Pop Hit</span>
          <div class="font-bold text-slate-100 text-xs sm:text-sm truncate">Rolling in the Deep</div>
          <div class="text-[11px] text-slate-400 truncate">Adele</div>
        </button>
        <button onclick="selectMusicTrack(1)" id="musicTrackBtn-1" class="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition hover:scale-[1.02] cursor-pointer">
          <span class="text-[10px] font-mono uppercase text-emerald-400 font-bold block">Alt Rock</span>
          <div class="font-bold text-slate-100 text-xs sm:text-sm truncate">Viva La Vida</div>
          <div class="text-[11px] text-slate-400 truncate">Coldplay</div>
        </button>
        <button onclick="selectMusicTrack(2)" id="musicTrackBtn-2" class="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition hover:scale-[1.02] cursor-pointer">
          <span class="text-[10px] font-mono uppercase text-amber-400 font-bold block">Classic Rock</span>
          <div class="font-bold text-slate-100 text-xs sm:text-sm truncate">Don't Stop Me Now</div>
          <div class="text-[11px] text-slate-400 truncate">Queen</div>
        </button>
        <button onclick="selectMusicTrack(3)" id="musicTrackBtn-3" class="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition hover:scale-[1.02] cursor-pointer">
          <span class="text-[10px] font-mono uppercase text-purple-400 font-bold block">Energy</span>
          <div class="font-bold text-slate-100 text-xs sm:text-sm truncate">Believer</div>
          <div class="text-[11px] text-slate-400 truncate">Imagine Dragons</div>
        </button>
      </div>

      <!-- Contenedor Principal: Video YouTube + Letras Karaoke -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Columna Izquierda: Reproductor de YouTube y Controles (7 cols) -->
        <div class="lg:col-span-7 flex flex-col gap-4">
          <div class="w-full aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl relative">
            <iframe id="musicYoutubeIframe" class="w-full h-full" src="https://www.youtube-nocookie.com/embed/rYEDA3JcQqw?enablejsapi=1&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>

          <!-- Barra de Control de Karaoke y Sincronización -->
          <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-lg">
            <div class="flex items-center gap-3">
              <button onclick="toggleMusicPlayback()" id="musicPlayBtn" class="w-10 h-10 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center font-bold transition shadow cursor-pointer">
                ▶
              </button>
              <div>
                <div id="musicActiveSongTitle" class="text-sm font-bold text-slate-100">Rolling in the Deep - Adele</div>
                <div class="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <span id="musicTimeDisplay">0:00</span>
                  <span>/</span>
                  <span id="musicDurationDisplay">3:48</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="prevLyricsLine()" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer" title="Línea anterior">&uarr;</button>
              <button onclick="nextLyricsLine()" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer" title="Línea siguiente">&darr;</button>
            </div>
          </div>
          
          <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <span class="text-amber-400 font-bold">Tip:</span>
            <span>Toca cualquier palabra de la letra para pausar y ver su traducción, pronunciación y Phrasal Verbs asociados.</span>
          </div>
        </div>

        <!-- Columna Derecha: Panel de Letras Sincronizadas (5 cols) -->
        <div class="lg:col-span-5 flex flex-col h-[480px] rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
          <div class="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-lg">🎤</span>
              <span class="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider">Letras Sincronizadas</span>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Karaoke Live</span>
          </div>

          <!-- Lista deslizable de estrofas -->
          <div id="musicLyricsContainer" class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            <!-- Renderizado dinámico vía JavaScript -->
          </div>
        </div>

      </div>

      <!-- MODAL FLOTANTE DE TRADUCCIÓN DE PALABRA DE LA CANCIÓN -->
      <div id="musicWordModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div class="w-full max-w-sm glass-panel-deep rounded-3xl p-6 border border-cyan-500/40 shadow-2xl relative space-y-4">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">Análisis de Palabra en Canción</span>
              <h3 id="musicWordEn" class="text-2xl font-black text-slate-100 tracking-tight mt-0.5">Rolling</h3>
              <p id="musicWordIpa" class="text-xs font-mono text-slate-400">/ˈroʊ.lɪŋ/</p>
            </div>
            <button onclick="playWordTTS()" class="w-9 h-9 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 flex items-center justify-center transition cursor-pointer" title="Escuchar pronunciación">
              🔊
            </button>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Traducción en este contexto:</span>
            <p id="musicWordEs" class="text-sm font-bold text-amber-300">Rodando / Ondulando en lo profundo</p>
          </div>

          <div id="musicWordPhrasalBox" class="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
            <span class="text-[10px] font-mono text-cyan-300 uppercase tracking-wider font-bold block">Phrasal Verb Asociado:</span>
            <p id="musicWordPhrasal" class="text-xs font-bold text-slate-100">Roll in &bull; Llegar en gran cantidad o abundancia</p>
            <p id="musicWordPhrasalEx" class="text-[11px] text-slate-400 italic">"Job offers started rolling in after graduation."</p>
          </div>

          <div class="pt-2 flex gap-2">
            <button onclick="closeMusicWordModal()" class="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer shadow">
              Reanudar Canción ▶
            </button>
            <button onclick="closeMusicWordModal(false)" class="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer">
              Cerrar
            </button>
          </div>
        </div>
      </div>

    </section>`;

if (oldMediaLabRegex.test(code)) {
  code = code.replace(oldMediaLabRegex, newMediaLabSection);
  console.log('✅ view-medialab replaced with Music Session (YouTube + Synchronized Lyrics + Word Tap).');
} else {
  console.warn('⚠️ oldMediaLabRegex did not match.');
}

// ========================================================
// 4. IMPLEMENT "CUENTOS" MODULE (PORTAL 2)
// ========================================================
// Update header in view-stories to "Cuentos" with bilingual mode button
code = code.replace('Portal 2: Interactive Stories', 'Portal 2: Cuentos');
code = code.replace('Interactive Stories: Lecturas Graduadas', 'Cuentos: Lecturas Ilustradas en Inglés');
code = code.replace('Mejora tu fluidez lectora, comprensión auditiva y deducción léxica mediante relatos cortos estructurados por nivel.', 'Visor de cuentos ilustrados clásicos y modernos con modo bilingüe párrafo a párrafo, narrador nativo y glosario de términos clave.');

// Add bilingual toggle and narrator controls in view-stories if not present
const storiesControlSearch = `<div class="flex items-center gap-2">
          <button onclick="openSavedVocabModal()"`;

const storiesControlReplace = `<div class="flex items-center gap-2">
          <button onclick="toggleBilingualStoryMode()" id="storyBilingualToggleBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-semibold transition cursor-pointer shadow-sm">
            <span>🌐 Modo Bilingüe</span>
          </button>
          <button onclick="openSavedVocabModal()"`;

if (code.includes(storiesControlSearch)) {
  code = code.replace(storiesControlSearch, storiesControlReplace);
  console.log('✅ Added Bilingual Mode toggle to Cuentos header.');
}

// ========================================================
// 5. UPDATE CHATBOT MODAL: PREDEFINED FREQUENT OPTIONS CHIPS
// ========================================================
const oldChatbotHeaderRegex = /<!-- Encabezado del Chatbot -->[\s\S]*?<div id="chatbotMessagesContainer"/;

const newChatbotHeader = `<!-- Encabezado del Chatbot -->
    <div class="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-xs sm:text-sm font-bold text-slate-100 tracking-tight leading-tight">Asistente de Soporte & Estudio</h3>
          <p id="chatbotEngineStatus" class="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span> En Línea &bull; Respuestas Directas
          </p>
        </div>
      </div>
      <button onclick="toggleChatbotWindow()" class="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer text-base">&times;</button>
    </div>

    <!-- Opciones Frecuentes Predefinidas (Chips Estilo Help Center) -->
    <div class="px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap gap-1.5 shrink-0">
      <button onclick="handlePredefinedChat('phrasal_verbs')" class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-sky-950/70 border border-slate-800 hover:border-sky-500/50 text-[11px] text-sky-300 font-semibold transition cursor-pointer">
        💡 Phrasal Verbs
      </button>
      <button onclick="handlePredefinedChat('toefl')" class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-950/70 border border-slate-800 hover:border-amber-500/50 text-[11px] text-amber-300 font-semibold transition cursor-pointer">
        🎓 Examen TOEFL
      </button>
      <button onclick="handlePredefinedChat('progress')" class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-950/70 border border-slate-800 hover:border-emerald-500/50 text-[11px] text-emerald-300 font-semibold transition cursor-pointer">
        📊 Mi Progreso & EXP
      </button>
      <button onclick="handlePredefinedChat('free_chat')" class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-950/70 border border-slate-800 hover:border-purple-500/50 text-[11px] text-purple-300 font-semibold transition cursor-pointer">
        💬 Chat Libre
      </button>
    </div>

    <div id="chatbotMessagesContainer"`;

if (oldChatbotHeaderRegex.test(code)) {
  code = code.replace(oldChatbotHeaderRegex, newChatbotHeader);
  console.log('✅ Chatbot window updated with predefined quick option chips.');
} else {
  console.warn('⚠️ oldChatbotHeaderRegex did not match.');
}

// ========================================================
// 6. DYNAMIC PROFILE VIEW: GUEST VS REGISTERED
// ========================================================
// Add dynamic account card container to view-profile
const profileHeaderSearch = `<div class="w-full bg-[#1e293b] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">`;
const profileHeaderReplace = `<div id="profileAccountActionBox" class="w-full mb-6">
        <!-- Renderizado dinámico: Invitado vs Registrado -->
      </div>
      <div class="w-full bg-[#1e293b] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">`;

if (!code.includes('id="profileAccountActionBox"')) {
  code = code.replace(profileHeaderSearch, profileHeaderReplace);
  console.log('✅ Added profileAccountActionBox to view-profile.');
}

// Convert back to CRLF if needed
if (isCRLF) {
  code = code.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('🎉 apply_all_features.js HTML updates applied!');

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('Applying Overhaul Step 3: Definitive 3D Motor (World Tour - Escenarios Sin Pantalla Negra)...');

// 1. REEMPLAZAR WORLD_TOUR_SCENARIOS.house.objects con el catálogo completo de objetos cotidianos realistas
const houseObjStart = html.indexOf('"house": {');
const backyardStart = html.indexOf('"backyard": {');

if (houseObjStart !== -1 && backyardStart !== -1) {
  const houseObjsList = [
    {
      id: "hammock",
      en: "Hammock",
      ipa: "/ˈhæm.ək/",
      es: "Hamaca tradicional tejida",
      room: "Living Room",
      category: "Furniture / Rest",
      pos: { x: -4, y: 1.1, z: -4 },
      size: { w: 2.2, h: 0.8, d: 0.9 },
      color: 14535345,
      shape: "hammock",
      usage: "Cama ligera de lona o red suspendida por cuerdas y anclada a ganchos de pared para descansar.",
      example: "He spent the breezy tropical afternoon resting comfortably on the woven hammock.",
      exampleEs: "Pasó la ventosa tarde tropical descansando cómodamente en la hamaca tejida."
    },
    {
      id: "sofa",
      en: "Sofa",
      ipa: "/ˈsoʊ.fə/",
      es: "Sofá moderno",
      room: "Living Room",
      category: "Seating",
      pos: { x: -4.2, y: 0.55, z: -1.8 },
      size: { w: 2.2, h: 0.85, d: 0.95 },
      color: 3097444,
      shape: "sofa",
      usage: "Mueble tapizado confortable para varias personas con respaldo y apoyabrazos.",
      example: "We sat together on the modern sofa while studying the vocabulary notes.",
      exampleEs: "Nos sentamos juntos en el sofá moderno mientras estudiábamos las notas de vocabulario."
    },
    {
      id: "cushion",
      en: "Cushion",
      ipa: "/ˈkʊʃ.ən/",
      es: "Cojín decorativo",
      room: "Living Room",
      category: "Home Decor",
      pos: { x: -4.8, y: 0.85, z: -1.8 },
      size: { w: 0.45, h: 0.35, d: 0.45 },
      color: 16503914,
      shape: "cushion",
      usage: "Almohadilla suave de tela rellena de espuma para mayor comodidad en el sofá.",
      example: "She placed a soft velvet cushion behind her back for extra support.",
      exampleEs: "Colocó un suave cojín de terciopelo detrás de su espalda para mayor apoyo."
    },
    {
      id: "coffee_table",
      en: "Coffee Table",
      ipa: "/ˈkɑː.fi ˌteɪ.bəl/",
      es: "Mesa de centro con libros",
      room: "Living Room",
      category: "Furniture",
      pos: { x: -4.2, y: 0.32, z: -3.2 },
      size: { w: 1.4, h: 0.45, d: 0.8 },
      color: 5780517,
      shape: "coffee_table",
      usage: "Mesa baja colocada frente al sofá para colocar libros, revistas y tazas.",
      example: "He set the English dictionary gently on the wooden coffee table.",
      exampleEs: "Puso el diccionario de inglés suavemente sobre la mesa de centro de madera."
    },
    {
      id: "coffee_mug",
      en: "Coffee Mug",
      ipa: "/ˈkɑː.fi mʌɡ/",
      es: "Taza de café humeante",
      room: "Living Room",
      category: "Kitchenware",
      pos: { x: -3.9, y: 0.58, z: -3.1 },
      size: { w: 0.25, h: 0.3, d: 0.25 },
      color: 15923952,
      shape: "coffee_mug",
      usage: "Recipiente cilíndrico de cerámica con asa para bebidas calientes.",
      example: "Steam rose steadily from the fresh ceramic coffee mug on the table.",
      exampleEs: "El vapor subía constantemente de la taza de café de cerámica fresca sobre la mesa."
    },
    {
      id: "rug",
      en: "Rug",
      ipa: "/rʌɡ/",
      es: "Alfombra suave",
      room: "Living Room",
      category: "Floor Covering",
      pos: { x: -4.2, y: 0.02, z: -2.6 },
      size: { w: 2.4, h: 0.04, d: 1.9 },
      color: 14210770,
      shape: "rug",
      usage: "Pieza gruesa de tejido suave que cubre parte del piso para aportar calidez.",
      example: "The soft wool rug provides warmth under our feet in the living room.",
      exampleEs: "La suave alfombra de lana brinda calidez bajo nuestros pies en la sala."
    },
    {
      id: "television",
      en: "Television",
      ipa: "/ˈtel.ə.vɪʒ.ən/",
      es: "Televisión montada en la pared",
      room: "Living Room",
      category: "Electronics",
      pos: { x: -4.2, y: 1.85, z: -7.85 },
      size: { w: 2.2, h: 1.25, d: 0.15 },
      color: 1118481,
      shape: "television",
      usage: "Pantalla digital de alta definición montada en la pared para ver programas en inglés.",
      example: "They mounted the flat-screen television firmly on the living room wall.",
      exampleEs: "Montaron la televisión de pantalla plana firmemente en la pared de la sala."
    },
    {
      id: "bookshelf",
      en: "Bookshelf",
      ipa: "/ˈbʊk.ʃelf/",
      es: "Estantería con adornos",
      room: "Living Room",
      category: "Furniture / Storage",
      pos: { x: -7.75, y: 1.4, z: -1.8 },
      size: { w: 0.45, h: 2.4, d: 1.5 },
      color: 4663328,
      shape: "bookshelf",
      usage: "Mueble vertical con repisas horizontales para organizar novelas, diccionarios y adornos.",
      example: "She organized her English literature collection neatly on the wooden bookshelf.",
      exampleEs: "Organizó su colección de literatura inglesa con prolijidad en la estantería de madera."
    },
    {
      id: "ceiling_fan",
      en: "Ceiling Fan",
      ipa: "/ˈsiː.lɪŋ fæn/",
      es: "Ventilador de techo",
      room: "Living Room",
      category: "Appliances / Climate",
      pos: { x: -4.0, y: 2.7, z: -4.0 },
      size: { w: 1.5, h: 0.45, d: 1.5 },
      color: 2434341,
      shape: "ceiling_fan",
      usage: "Dispositivo mecánico con aspas giratorias suspendido del techo para circular aire fresco.",
      example: "The silent ceiling fan circulated a refreshing breeze through the whole living room.",
      exampleEs: "El silencioso ventilador de techo hizo circular una brisa refrescante por toda la sala."
    },
    {
      id: "hanging_lamp",
      en: "Hanging Lamp",
      ipa: "/ˈhæŋ.ɪŋ læmp/",
      es: "Lámpara colgante de techo",
      room: "Living Room",
      category: "Lighting",
      pos: { x: 0, y: 2.6, z: 0 },
      size: { w: 0.5, h: 0.7, d: 0.5 },
      color: 16765286,
      shape: "hanging_lamp",
      usage: "Lámpara decorativa suspendida por un cable central que emite luz cálida difusa.",
      example: "The warm hanging lamp illuminated the center of the hallway beautifully.",
      exampleEs: "La cálida lámpara colgante iluminó hermosamente el centro del pasillo."
    },
    {
      id: "floor_lamp",
      en: "Floor Lamp",
      ipa: "/ˈflɔːr ˌlæmp/",
      es: "Lámpara de pie",
      room: "Living Room",
      category: "Lighting",
      pos: { x: -5.5, y: 1.2, z: -5.5 },
      size: { w: 0.6, h: 1.85, d: 0.6 },
      color: 16773094,
      shape: "floor_lamp",
      usage: "Lámpara vertical con luz cálida funcional para lectura.",
      example: "He switched on the floor lamp beside the sofa to read his English book.",
      exampleEs: "Encendió la lámpara de pie junto al sofá para leer su libro de inglés."
    },
    {
      id: "light_switch",
      en: "Light Switch",
      ipa: "/ˈlaɪt ˌswɪtʃ/",
      es: "Interruptor de luz",
      room: "Living Room",
      category: "Electrical",
      pos: { x: -0.18, y: 1.35, z: -1.2 },
      size: { w: 0.12, h: 0.18, d: 0.04 },
      color: 16119285,
      shape: "light_switch",
      usage: "Dispositivo eléctrico montado en la pared para encender y apagar la iluminación.",
      example: "She flipped the light switch by the doorway before entering the dark room.",
      exampleEs: "Accionó el interruptor de luz junto a la entrada antes de entrar a la habitación oscura."
    },
    {
      id: "curtain",
      en: "Curtain",
      ipa: "/ˈkɝː.tən/",
      es: "Cortina de tela",
      room: "Living Room",
      category: "Window Coverings",
      pos: { x: -7.9, y: 1.7, z: -3.2 },
      size: { w: 0.25, h: 2.2, d: 0.8 },
      color: 14275038,
      shape: "curtain",
      usage: "Pieza de tela suspendida sobre la ventana para regular la luz solar.",
      example: "He drew the linen curtain aside to let the morning sunlight pour in.",
      exampleEs: "Apartó la cortina de lino hacia un lado para dejar entrar la luz matutina."
    },
    {
      id: "door_lock",
      en: "Door Lock",
      ipa: "/ˈdɔːr ˌlɑːk/",
      es: "Cerradura de puerta",
      room: "Living Room",
      category: "Hardware",
      pos: { x: -0.18, y: 1.05, z: -2.8 },
      size: { w: 0.1, h: 0.25, d: 0.15 },
      color: 12829635,
      shape: "door_lock",
      usage: "Mecanismo metálico con cerradura y manija para asegurar y abrir puertas.",
      example: "Turn the door lock counterclockwise to unlock the bedroom door.",
      exampleEs: "Gira la cerradura de la puerta en sentido antihorario para abrir la puerta de la recámara."
    },
    {
      id: "wall_crack",
      en: "Wall Crack",
      ipa: "/ˈwɑːl kræk/",
      es: "Grieta en la pared",
      room: "Living Room",
      category: "Structure",
      pos: { x: -2.2, y: 2.05, z: -7.92 },
      size: { w: 0.5, h: 0.8, d: 0.05 },
      color: 3947580,
      shape: "wall_crack",
      usage: "Fisura visible en el yeso o concreto de una pared.",
      example: "The inspector noticed a thin wall crack near the ceiling corner.",
      exampleEs: "El inspector notó una delgada grieta en la pared cerca de la esquina del techo."
    }
  ];

  const houseSectionRegex = /"house":\s*\{[\s\S]*?"objects":\s*\[[\s\S]*?\]\s*\}/;
  const newHouseSection = `"house": {
    "id": "house",
    "title": "House & Rooms",
    "subtitle": "Sala, cocina, recámara y baño",
    "badge": "Escenario 1",
    "themeColor": "#8b5cf6",
    "description": "Explora las cuatro habitaciones principales de una casa contemporánea interactuando con elementos arquitectónicos y objetos de la vida diaria.",
    "spawn": { "x": 0, "z": 0 },
    "rooms": [
      { "name": "Living Room (Sala)", "xMin": -8, "xMax": 0, "zMin": -8, "zMax": 0, "color": 1976635 },
      { "name": "Kitchen (Cocina)", "xMin": 0, "xMax": 8, "zMin": -8, "zMax": 0, "color": 3359061 },
      { "name": "Bedroom (Recámara)", "xMin": -8, "xMax": 0, "zMin": 0, "zMax": 8, "color": 1976635 },
      { "name": "Bathroom (Baño)", "xMin": 0, "xMax": 8, "zMin": 0, "zMax": 8, "color": 1013358 }
    ],
    "objects": ${JSON.stringify(houseObjsList, null, 6)}
  }`;

  html = html.replace(houseSectionRegex, newHouseSection);
  console.log('✅ Catálogo de objetos cotidianos de House & Rooms actualizado con 15 objetos interactivos.');
}

// 2. ACTUALIZAR initThreeWorld() con:
// - renderer.setClearColor(0x1e293b, 1)
// - THREE.AmbientLight(0xffffff, 1.5)
// - THREE.DirectionalLight(0xffedd5, 2.0) posicionado en (6, 10, 6) con sombras activas
// - Luces puntuales cálidas en lámparas de techo y de pie
// - ResizeObserver para ajustar el canvas al tamaño visible exacto ('width: 100%', 'height: 520px')
// - Detección por Raycaster al hacer clic o tocar objetos
// - Halo de luz visual al acercarse o tocar

const newInitThreeWorldBlock = `let steamParticles = [];
    let worldTourResizeObserver = null;
    let objectHaloLight = null;
    let objectHaloRing = null;

    function initThreeWorld() {
      stopThreeSimulator();

      const container = document.getElementById("threeCanvasContainer");
      if (!container) return;
      container.innerHTML = "";

      if (typeof THREE === 'undefined') {
        container.innerHTML = \`
          <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-slate-300">
            <span class="text-xs font-mono uppercase text-sky-400 font-bold mb-2">Motor Gráfico Three.js</span>
            <p class="text-sm">Iniciando aceleración gráfica local...</p>
          </div>
        \`;
        return;
      }

      // Medición exacta del contenedor (width: 100%, height: 520px)
      const rect = container.getBoundingClientRect();
      const width = rect.width > 50 ? rect.width : (container.clientWidth || window.innerWidth || 800);
      const height = 520;

      // Cámara en perspectiva (campo de visión 50, posición inicial (0, 2.2, 5))
      threeCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      threeCamera.position.set(0, 2.2, 5);
      threeCamera.lookAt(new THREE.Vector3(0, 1.2, 0));
      threeCamera.aspect = width / height;
      threeCamera.updateProjectionMatrix();

      // Renderer de Alta Fidelidad - CERO PANTALLA NEGRA
      threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      threeRenderer.setSize(width, height);
      threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      threeRenderer.setClearColor(0x1e293b, 1); // REQUISITO: Garantizar que nunca sea pantalla negra
      threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      threeRenderer.toneMappingExposure = 1.28;
      if (THREE.SRGBColorSpace) {
        threeRenderer.outputColorSpace = THREE.SRGBColorSpace;
      } else if (threeRenderer.outputEncoding !== undefined) {
        threeRenderer.outputEncoding = THREE.sRGBEncoding;
      }
      threeRenderer.shadowMap.enabled = true;
      threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(threeRenderer.domElement);

      // Escena 3D
      threeScene = new THREE.Scene();
      threeScene.background = new THREE.Color(0x1e293b);
      threeScene.fog = new THREE.FogExp2(0x1e293b, 0.018);

      // 1. THREE.AmbientLight(0xffffff, 1.5) para visibilidad inmediata total
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      threeScene.add(ambientLight);

      // 2. THREE.DirectionalLight(0xffedd5, 2.0) posicionado en (6, 10, 6) con sombras activas
      const dirLight = new THREE.DirectionalLight(0xffedd5, 2.0);
      dirLight.position.set(6, 10, 6);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 40;
      dirLight.shadow.bias = -0.0004;
      dirLight.shadow.radius = 2.0;
      threeScene.add(dirLight);

      // 3. Luces puntuales cálidas en lámparas de techo y de pie
      const ceilingLampLight = new THREE.PointLight(0xffd166, 2.2, 10);
      ceilingLampLight.position.set(0, 2.8, 0);
      ceilingLampLight.castShadow = true;
      threeScene.add(ceilingLampLight);

      const floorLampLight = new THREE.PointLight(0xffedd5, 1.8, 8);
      floorLampLight.position.set(-5.5, 1.8, -5.5);
      floorLampLight.castShadow = true;
      threeScene.add(floorLampLight);

      // Sistema de Halo de Luz para interacción de objetos
      objectHaloLight = new THREE.PointLight(0x38bdf8, 3.5, 5);
      objectHaloLight.visible = false;
      threeScene.add(objectHaloLight);

      const ringGeo = new THREE.RingGeometry(0.35, 0.45, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
      objectHaloRing = new THREE.Mesh(ringGeo, ringMat);
      objectHaloRing.rotation.x = Math.PI / 2;
      objectHaloRing.visible = false;
      threeScene.add(objectHaloRing);

      // Construcción del Escenario 3D Realista (House & Rooms)
      buildScenario3D(activeScenarioKey || 'house');

      // Personaje en tercera persona con colisiones sólidas
      buildThirdPersonCharacter();

      // Reset de controles
      cameraYaw = 0;
      cameraPitch = 0.35;
      walkAnimClock = 0;
      playerVelocityX = 0;
      playerVelocityZ = 0;
      isSimulatorRunning = true;

      // Listeners de teclado, mouse y joystick
      setupSimulatorInputListeners();

      // Detección por Raycaster al tocar o hacer clic sobre objetos en el canvas
      setupRaycasterInteraction();

      // REQUISITO: ResizeObserver para ajustar el canvas al tamaño visible exacto
      setupSimulatorResizeObserver(container);

      runThreeAnimationLoop();
    }

    function setupSimulatorResizeObserver(container) {
      if (worldTourResizeObserver) {
        worldTourResizeObserver.disconnect();
      }
      worldTourResizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const cr = entry.contentRect;
          const w = cr.width > 50 ? cr.width : (container.clientWidth || window.innerWidth || 800);
          const h = 520;
          if (threeCamera && threeRenderer) {
            threeCamera.aspect = w / h;
            threeCamera.updateProjectionMatrix();
            threeRenderer.setSize(w, h);
          }
        }
      });
      worldTourResizeObserver.observe(container);
    }

    function setupRaycasterInteraction() {
      if (!threeRenderer || !threeRenderer.domElement) return;
      const dom = threeRenderer.domElement;
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      function onPointerTrigger(e) {
        if (!threeCamera || !interactiveObjects.length) return;
        const rect = dom.getBoundingClientRect();
        const clientX = e.clientX !== undefined ? e.clientX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : null);
        const clientY = e.clientY !== undefined ? e.clientY : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null);
        if (clientX === null || clientY === null) return;

        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, threeCamera);
        const intersects = raycaster.intersectObjects(interactiveObjects, true);

        if (intersects && intersects.length > 0) {
          let topGroup = intersects[0].object;
          while (topGroup && !topGroup.userData?.id && topGroup.parent) {
            topGroup = topGroup.parent;
          }
          if (topGroup && topGroup.userData && topGroup.userData.id) {
            triggerObjectHalo(topGroup);
            inspectObject3D(topGroup.userData);
          }
        }
      }

      dom.addEventListener('click', onPointerTrigger);
      dom.addEventListener('touchend', (e) => {
        if (!joystickActive) onPointerTrigger(e);
      });
    }

    function triggerObjectHalo(group) {
      if (!objectHaloLight || !objectHaloRing || !group) return;
      objectHaloLight.position.set(group.position.x, group.position.y + 0.6, group.position.z);
      objectHaloLight.visible = true;
      objectHaloRing.position.set(group.position.x, 0.05, group.position.z);
      objectHaloRing.visible = true;
      setTimeout(() => {
        if (objectHaloLight) objectHaloLight.visible = false;
        if (objectHaloRing) objectHaloRing.visible = false;
      }, 3500);
    }`;

const oldInitThreeRegex = /let steamParticles = \[\];[\s\S]*?function initThreeWorld\(\) \{[\s\S]*?runThreeAnimationLoop\(\);\s*\}/;

if (oldInitThreeRegex.test(html)) {
  html = html.replace(oldInitThreeRegex, newInitThreeWorldBlock);
  console.log('✅ initThreeWorld() reemplazado con ResizeObserver, setClearColor(0x1e293b, 1), iluminación (AmbientLight 1.5, DirectionalLight 2.0 at (6, 10, 6), point lights) y Raycaster.');
} else {
  console.warn('⚠️ No se pudo emparejar oldInitThreeRegex.');
}

// 3. ACTUALIZAR build3DObjectGeometry para generar los objetos cotidianos con MeshStandardMaterial
const newBuildGeoFunc = `function build3DObjectGeometry(obj) {
      const group = new THREE.Group();
      const parquet = getParquetTextures();

      // Material principal con MeshStandardMaterial
      const mainMat = new THREE.MeshStandardMaterial({
        color: obj.color || 0x38bdf8,
        roughness: 0.35,
        metalness: 0.25
      });

      if (obj.shape === 'hammock') {
        // Hamaca tradicional con cuerdas y ganchos de soporte anclados al muro
        const hookMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
        [-1.6, 1.6].forEach(hx => {
          const hookBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12), hookMat);
          hookBase.rotation.z = Math.PI / 2;
          hookBase.position.set(hx, 1.4, 0);
          const hookRing = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 8, 16), hookMat);
          hookRing.position.set(hx + (hx > 0 ? -0.05 : 0.05), 1.36, 0);
          group.add(hookBase, hookRing);
        });

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

        // Cuerpo tejido cóncavo de la hamaca
        const weaveMat = new THREE.MeshStandardMaterial({
          color: 0xdd6b20,
          roughness: 0.85,
          side: THREE.DoubleSide
        });
        const hammockGeo = new THREE.CylinderGeometry(0.55, 0.45, 1.5, 16, 1, true, -Math.PI * 0.75, Math.PI * 1.5);
        const hammockMesh = new THREE.Mesh(hammockGeo, weaveMat);
        hammockMesh.rotation.z = Math.PI / 2;
        hammockMesh.rotation.y = Math.PI / 2;
        hammockMesh.position.set(0, 0.5, 0);
        hammockMesh.castShadow = true;
        group.add(hammockMesh);

      } else if (obj.shape === 'sofa') {
        // Sala con sofá moderno y cojines
        const sofaMat = new THREE.MeshStandardMaterial({ color: 0x2e384d, roughness: 0.75, metalness: 0.1 });
        const cushionMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.6, metalness: 0.1 });

        // Base del sofá
        const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.45, 0.95), sofaMat);
        baseMesh.position.y = 0.22;
        baseMesh.castShadow = true;
        group.add(baseMesh);

        // Respaldo
        const backMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 0.25), sofaMat);
        backMesh.position.set(0, 0.65, -0.35);
        backMesh.castShadow = true;
        group.add(backMesh);

        // Apoyabrazos
        [-1.02, 1.02].forEach(ax => {
          const armMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.45, 0.95), sofaMat);
          armMesh.position.set(ax, 0.5, 0);
          armMesh.castShadow = true;
          group.add(armMesh);
        });

        // Cojines suaves decorativos
        [-0.5, 0.5].forEach(cx => {
          const cMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.15), cushionMat);
          cMesh.position.set(cx, 0.6, -0.22);
          cMesh.rotation.x = -0.15;
          group.add(cMesh);
        });

      } else if (obj.shape === 'cushion') {
        const cMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
        const cMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.45), cMat);
        cMesh.castShadow = true;
        group.add(cMesh);

      } else if (obj.shape === 'coffee_table') {
        // Mesa de centro con libros
        const tableMat = new THREE.MeshStandardMaterial({
          map: parquet.map,
          bumpMap: parquet.bump,
          roughness: 0.28,
          metalness: 0.12
        });
        const topMesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.8), tableMat);
        topMesh.position.y = 0.4;
        topMesh.castShadow = true;
        group.add(topMesh);

        // Patas metálicas de la mesa
        const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
        [[-0.6, -0.32], [0.6, -0.32], [-0.6, 0.32], [0.6, 0.32]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.4, 8), legMat);
          leg.position.set(lx, 0.2, lz);
          leg.castShadow = true;
          group.add(leg);
        });

        // Libros apilados sobre la mesa
        const bookMat1 = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 });
        const bookMat2 = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
        const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.22), bookMat1);
        b1.position.set(0.25, 0.46, 0.05);
        const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.035, 0.2), bookMat2);
        b2.position.set(0.26, 0.5, 0.04);
        b2.rotation.y = 0.12;
        group.add(b1, b2);

      } else if (obj.shape === 'coffee_mug') {
        // Taza de café con vapor
        const mugMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.1 });
        const mugMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.14, 16), mugMat);
        mugMesh.castShadow = true;
        group.add(mugMesh);

        // Café líquido en el interior
        const coffeeMat = new THREE.MeshStandardMaterial({ color: 0x3e1f0e, roughness: 0.1 });
        const coffeeSurface = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), coffeeMat);
        coffeeSurface.rotation.x = -Math.PI / 2;
        coffeeSurface.position.y = 0.06;
        group.add(coffeeSurface);

        // Asa de la taza
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.015, 8, 16, Math.PI), mugMat);
        handle.rotation.z = -Math.PI / 2;
        handle.position.set(0.08, 0, 0);
        group.add(handle);

      } else if (obj.shape === 'rug') {
        // Alfombra suave
        const rugMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9, metalness: 0.05 });
        const rugMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.03, 1.9), rugMat);
        rugMesh.position.y = 0.015;
        rugMesh.receiveShadow = true;
        group.add(rugMesh);

        // Borde decorativo
        const borderMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 });
        const borderMesh = new THREE.Mesh(new THREE.BoxGeometry(2.46, 0.025, 1.96), borderMat);
        borderMesh.position.y = 0.01;
        group.add(borderMesh);

      } else if (obj.shape === 'television') {
        // Televisión montada en la pared con marco y pantalla brillante
        const tvFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
        const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.25, 0.08), tvFrameMat);
        frameMesh.castShadow = true;
        group.add(frameMesh);

        // Pantalla LED con brillo sutil
        const screenMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.05,
          metalness: 0.95
        });
        const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.15), screenMat);
        screenMesh.position.z = 0.045;
        group.add(screenMesh);

        // Led de estado standby en verde neón
        const ledMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), ledMat);
        led.position.set(1.0, -0.58, 0.05);
        group.add(led);

      } else if (obj.shape === 'bookshelf') {
        // Estantería con libros y adornos
        const woodMat = new THREE.MeshStandardMaterial({
          map: parquet.map,
          bumpMap: parquet.bump,
          roughness: 0.35,
          metalness: 0.15
        });
        const shelfBody = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.4, 1.5), woodMat);
        shelfBody.castShadow = true;
        group.add(shelfBody);

        // Libros coloridos en repisas
        const bookColors = [0x38bdf8, 0xf43f5e, 0x10b981, 0xfbbf24, 0xa855f7];
        [-0.5, 0.1, 0.7].forEach((sy, i) => {
          for (let b = 0; b < 6; b++) {
            const bMat = new THREE.MeshStandardMaterial({ color: bookColors[(i + b) % bookColors.length], roughness: 0.5 });
            const bMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.05), bMat);
            bMesh.position.set(0.05, sy, -0.5 + b * 0.18);
            group.add(bMesh);
          }
        });

      } else if (obj.shape === 'ceiling_fan') {
        // Ventilador de techo con aspas
        const fanMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8), fanMat);
        rod.position.y = 0.2;
        const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16), fanMat);
        group.add(rod, motor);

        const bladeMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 });
        [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(rot => {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.015, 0.12), bladeMat);
          blade.position.set(Math.cos(rot) * 0.4, 0, Math.sin(rot) * 0.4);
          blade.rotation.y = -rot;
          group.add(blade);
        });

      } else if (obj.shape === 'hanging_lamp') {
        // Lámpara colgante de techo
        const cordMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
        const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6), cordMat);
        cord.position.y = 0.4;
        group.add(cord);

        const shadeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.25, 16, 1, true), shadeMat);
        shade.rotation.x = Math.PI;
        group.add(shade);

        const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), bulbMat);
        bulb.position.y = -0.05;
        group.add(bulb);

      } else if (obj.shape === 'floor_lamp') {
        // Lámpara de pie con luz cálida funcional
        const poleMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 });
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8), poleMat);
        pole.position.y = 0.9;
        pole.castShadow = true;
        group.add(pole);

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.04, 16), poleMat);
        base.position.y = 0.02;
        group.add(base);

        const shadeMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.9, transparent: true, opacity: 0.9 });
        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.4, 16, 1, true), shadeMat);
        shade.position.y = 1.7;
        group.add(shade);

      } else if (obj.shape === 'light_switch') {
        // Interruptor de pared
        const plateMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.02), plateMat);
        group.add(plate);

        const toggleMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 });
        const toggle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.04), toggleMat);
        toggle.position.z = 0.02;
        group.add(toggle);

      } else if (obj.shape === 'curtain') {
        // Cortina de tela junto a la ventana
        const cMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.85 });
        const curtainMesh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.2, 0.8), cMat);
        curtainMesh.castShadow = true;
        group.add(curtainMesh);

      } else if (obj.shape === 'door_lock') {
        // Cerradura y manija de puerta
        const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 });
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.02), brassMat);
        group.add(plate);

        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8), brassMat);
        handle.rotation.z = Math.PI / 2;
        handle.position.set(0.06, 0.05, 0.04);
        group.add(handle);

      } else if (obj.shape === 'wall_crack') {
        // Grieta en la pared
        const crackMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
        const crack = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.8, 0.02), crackMat);
        crack.rotation.z = 0.15;
        group.add(crack);

      } else {
        // Objeto genérico estilizado
        const w = (obj.size ? obj.size.w : 0.8);
        const h = (obj.size ? obj.size.h : 0.8);
        const d = (obj.size ? obj.size.d : 0.8);
        const geo = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geo, mainMat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
      }

      return group;
    }`;

const oldBuildGeoRegex = /function build3DObjectGeometry\(obj\) \{[\s\S]*?return group;\s*\}/;

if (oldBuildGeoRegex.test(html)) {
  html = html.replace(oldBuildGeoRegex, newBuildGeoFunc);
  console.log('✅ build3DObjectGeometry actualizado con todos los objetos cotidianos detallados.');
} else {
  console.warn('⚠️ No se pudo emparejar oldBuildGeoRegex.');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Step 3 applied successfully.');

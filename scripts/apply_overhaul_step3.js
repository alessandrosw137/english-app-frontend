const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. UPDATE THREE CONTAINER IN HTML: Set height to 520px and update glowing proximity HUD
const old3dMarkupRegex = /<!-- Contenedor WebGL de Three\.js -->[\s\S]*?<!-- HUD Indicador de Proximidad a Objeto -->[\s\S]*?<\/div>[\s\S]*?<!-- Instrucciones breves/;

const new3dMarkup = `<!-- Contenedor WebGL de Three.js -->
          <div id="threeCanvasContainer" style="position: relative; width: 100%; height: 520px; min-height: 520px; display: block;" class="w-full cursor-grab active:cursor-grabbing rounded-3xl overflow-hidden bg-slate-950"></div>

          <!-- Toast Flotante de EXP / Notificación -->
          <div id="worldTourToast" class="hidden absolute top-4 inset-x-0 mx-auto w-fit px-4 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/70 text-emerald-300 text-xs font-bold font-mono shadow-2xl backdrop-blur-md z-30 transition-all">
            +15 EXP: Objeto descubierto
          </div>

          <!-- Etiqueta Brillante de Proximidad a Objeto (HUD Flotante con Audio, Fonética y Traducción) -->
          <div id="simProximityPrompt" class="hidden absolute top-5 inset-x-0 mx-auto w-fit max-w-md px-4 py-2.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-sky-400/60 shadow-[0_0_25px_rgba(56,189,248,0.4)] text-center z-30 transition-all flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </div>
            <div class="text-left">
              <div class="flex items-center gap-2">
                <span id="simProximityObjectName" class="text-sm font-bold text-white tracking-wide">Hammock</span>
                <span id="simProximityObjectIpa" class="text-[11px] font-mono text-sky-300 font-semibold">/ˈhæm.ək/</span>
              </div>
              <span id="simProximityObjectEs" class="text-xs text-slate-300 block">Hamaca tradicional tejida</span>
            </div>
            <button id="simProximityAudioBtn" onclick="speakNearestObject()" class="p-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-white border border-sky-500/40 transition cursor-pointer shrink-0" title="Escuchar pronunciación nativa">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
            </button>
            <button id="simInspectActionBtn" class="px-2.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition cursor-pointer shrink-0 shadow-sm">
              Detalles
            </button>
          </div>

          <!-- Instrucciones breves`;

if (old3dMarkupRegex.test(html)) {
  html = html.replace(old3dMarkupRegex, new3dMarkup);
  console.log('Successfully updated 3D container markup and glowing HUD!');
} else {
  console.warn('Could not match old3dMarkupRegex');
}

// 2. REFACTOR initThreeWorld() with exact camera position (0, 2.2, 5), lookAt (0, 1.2, 0), and complete lighting:
// - AmbientLight(0xffffff, 1.4)
// - DirectionalLight(0xfff1e6, 1.8) at (5, 8, 5) with soft shadows
// - PointLight(0xffd166, 2, 8) at (0, 2.8, 0)
const oldInitThreeRegex = /function initThreeWorld\(\) \{[\s\S]*?runThreeAnimationLoop\(\);\s*\}/;

const newInitThree = `let steamParticles = [];

    function initThreeWorld() {
      stopThreeSimulator();

      const container = document.getElementById("threeCanvasContainer");
      if (!container) return;
      container.innerHTML = "";

      if (typeof THREE === 'undefined') {
        container.innerHTML = \`
          <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-300">
            <span class="text-xs font-mono uppercase text-sky-400 font-bold mb-2">Motor Gráfico Three.js</span>
            <p class="text-sm">Iniciando aceleración gráfica local...</p>
          </div>
        \`;
        return;
      }

      // Medición precisa del contenedor (width: 100%, height: 520px)
      const rect = container.getBoundingClientRect();
      const width = rect.width > 50 ? rect.width : (container.clientWidth || window.innerWidth || 800);
      const height = 520;

      // Cámara en posición exacta (0, 2.2, 5) mirando hacia (0, 1.2, 0)
      threeCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      threeCamera.position.set(0, 2.2, 5);
      threeCamera.lookAt(new THREE.Vector3(0, 1.2, 0));
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

      // Escena con fondo interior acogedor
      threeScene = new THREE.Scene();
      threeScene.background = new THREE.Color(0x181e2b);
      threeScene.fog = new THREE.FogExp2(0x181e2b, 0.02);

      // 1. THREE.AmbientLight(0xffffff, 1.4) para iluminación total inmediata
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      threeScene.add(ambientLight);

      // 2. THREE.DirectionalLight(0xfff1e6, 1.8) con posición (5, 8, 5) y sombras suaves
      const dirLight = new THREE.DirectionalLight(0xfff1e6, 1.8);
      dirLight.position.set(5, 8, 5);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 40;
      dirLight.shadow.bias = -0.0004;
      dirLight.shadow.radius = 2.0;
      threeScene.add(dirLight);

      // 3. THREE.PointLight(0xffd166, 2, 8) cálida en la lámpara central
      const centerLampLight = new THREE.PointLight(0xffd166, 2, 8);
      centerLampLight.position.set(0, 2.8, 0);
      centerLampLight.castShadow = true;
      threeScene.add(centerLampLight);

      // Construcción del Escenario 3D Realista (Madera, Zoclos, Molduras, Hamaca, Sofá, Taza humeante, etc.)
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

      requestAnimationFrame(() => onSimulatorResize());
      setTimeout(() => onSimulatorResize(), 120);

      runThreeAnimationLoop();
    }`;

if (oldInitThreeRegex.test(html)) {
  html = html.replace(oldInitThreeRegex, newInitThree);
  console.log('Successfully updated initThreeWorld() with lights, camera, and sizing!');
} else {
  console.warn('Could not match oldInitThreeRegex');
}

// 3. REFACTOR buildScenario3D & build3DObjectGeometry for realistic interior:
// - Wood floor with subtle gloss: roughness 0.3, metalness 0.1
// - Walls with zoclos (baseboards) and molduras
// - Contemporary sofa with cushions
// - Coffee table with steaming cup
// - Textured rug under sofa and table
// - Wooden-framed window with daytime sky view
// - Traditional woven hammock hung from metallic wall hooks with diagonal ropes

const oldBuildScenarioRegex = /function buildScenario3D\(key\) \{[\s\S]*?function build3DObjectGeometry\(obj\) \{/;

const newBuildScenario = `function buildScenario3D(key) {
      scenarioMeshes = [];
      interactiveObjects = [];
      sceneColliders = [];
      steamParticles = [];

      const scenario = WORLD_TOUR_SCENARIOS[key];
      if (!scenario) return;

      const parquet = getParquetTextures();
      const tiles = getTileTextures();
      const plaster = getPlasterTextures();
      const curtainTex = getCurtainTexture();

      // 1. Suelo con textura procedural de madera pulida con brillo sutil (roughness: 0.3, metalness: 0.1)
      scenario.rooms.forEach((room, idx) => {
        const w = room.xMax - room.xMin;
        const d = room.zMax - room.zMin;
        const cx = (room.xMin + room.xMax) / 2;
        const cz = (room.zMin + room.zMax) / 2;

        const isTileRoom = room.name.includes("Baño") || idx === 3;
        const floorMat = new THREE.MeshStandardMaterial({
          map: isTileRoom ? tiles.map : parquet.map,
          bumpMap: isTileRoom ? tiles.bump : parquet.bump,
          bumpScale: isTileRoom ? 0.04 : 0.05,
          roughness: 0.3,
          metalness: 0.1
        });

        const floorGeo = new THREE.PlaneGeometry(w, d);
        const floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.set(cx, 0, cz);
        floorMesh.receiveShadow = true;
        threeScene.add(floorMesh);
        scenarioMeshes.push(floorMesh);
      });

      // Alfombra texturizada bajo el sofá y la mesa de centro en la sala
      const rugTex = parquet.bump;
      const rugMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.85,
        metalness: 0.05,
        bumpMap: rugTex,
        bumpScale: 0.04
      });
      const rugMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), rugMat);
      rugMesh.rotation.x = -Math.PI / 2;
      rugMesh.position.set(-4, 0.015, -2.2);
      rugMesh.receiveShadow = true;
      threeScene.add(rugMesh);
      scenarioMeshes.push(rugMesh);

      // 2. Muros perimetrales con zoclos y molduras
      const wallMat = new THREE.MeshStandardMaterial({
        color: key === 'house' ? 0x334155 : 0x1e293b,
        map: plaster.map,
        bumpMap: plaster.bump,
        bumpScale: 0.06,
        roughness: 0.85,
        metalness: 0.08
      });

      // Material de zoclos y molduras (Madera oscura noble)
      const trimMat = new THREE.MeshStandardMaterial({
        color: 0x271c19,
        roughness: 0.35,
        metalness: 0.15
      });

      const wallHeight = key === 'house' ? 3.2 : 1.6;
      const wallThickness = 0.4;

      const wallConfigs = [
        { w: 16.8, d: wallThickness, x: 0, z: -8.1, name: 'North Wall' },
        { w: 16.8, d: wallThickness, x: 0, z: 8.1, name: 'South Wall' },
        { w: wallThickness, d: 16.8, x: -8.1, z: 0, name: 'West Wall' },
        { w: wallThickness, d: 16.8, x: 8.1, z: 0, name: 'East Wall' }
      ];

      wallConfigs.forEach(cfg => {
        // Pared principal
        const geo = new THREE.BoxGeometry(cfg.w, wallHeight, cfg.d);
        const mesh = new THREE.Mesh(geo, wallMat);
        mesh.position.set(cfg.x, wallHeight / 2, cfg.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        threeScene.add(mesh);
        scenarioMeshes.push(mesh);

        // Zoclo inferior
        const zocloGeo = new THREE.BoxGeometry(cfg.w, 0.16, cfg.d + 0.04);
        const zocloMesh = new THREE.Mesh(zocloGeo, trimMat);
        zocloMesh.position.set(cfg.x, 0.08, cfg.z);
        threeScene.add(zocloMesh);
        scenarioMeshes.push(zocloMesh);

        // Moldura superior
        const molduraGeo = new THREE.BoxGeometry(cfg.w, 0.12, cfg.d + 0.04);
        const molduraMesh = new THREE.Mesh(molduraGeo, trimMat);
        molduraMesh.position.set(cfg.x, wallHeight - 0.06, cfg.z);
        threeScene.add(molduraMesh);
        scenarioMeshes.push(molduraMesh);

        sceneColliders.push({
          minX: cfg.x - cfg.w / 2,
          maxX: cfg.x + cfg.w / 2,
          minZ: cfg.z - cfg.d / 2,
          maxZ: cfg.z + cfg.d / 2,
          name: cfg.name
        });
      });

      // 3. Muros Interiores con Molduras
      if (key === 'house') {
        const intWallMat = new THREE.MeshStandardMaterial({
          color: 0x475569,
          map: plaster.map,
          bumpMap: plaster.bump,
          bumpScale: 0.05,
          roughness: 0.88,
          metalness: 0.08
        });

        const dividerSegments = [
          { w: 0.3, d: 2.8, x: 0, z: -6.6, name: 'Div-C-N1' },
          { w: 0.3, d: 2.8, x: 0, z: -1.4, name: 'Div-C-N2' },
          { w: 0.3, d: 2.8, x: 0, z: 1.4,  name: 'Div-C-S1' },
          { w: 0.3, d: 2.8, x: 0, z: 6.6,  name: 'Div-C-S2' },
          { w: 2.8, d: 0.3, x: -6.6, z: 0, name: 'Div-H-W1' },
          { w: 2.8, d: 0.3, x: -1.4, z: 0, name: 'Div-H-W2' },
          { w: 2.8, d: 0.3, x: 1.4,  z: 0, name: 'Div-H-E1' },
          { w: 2.8, d: 0.3, x: 6.6,  z: 0, name: 'Div-H-E2' }
        ];

        dividerSegments.forEach(seg => {
          const geo = new THREE.BoxGeometry(seg.w, wallHeight, seg.d);
          const mesh = new THREE.Mesh(geo, intWallMat);
          mesh.position.set(seg.x, wallHeight / 2, seg.z);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          threeScene.add(mesh);
          scenarioMeshes.push(mesh);

          // Zoclo interior
          const zocloMesh = new THREE.Mesh(new THREE.BoxGeometry(seg.w + 0.03, 0.16, seg.d + 0.03), trimMat);
          zocloMesh.position.set(seg.x, 0.08, seg.z);
          threeScene.add(zocloMesh);
          scenarioMeshes.push(zocloMesh);

          sceneColliders.push({
            minX: seg.x - seg.w / 2,
            maxX: seg.x + seg.w / 2,
            minZ: seg.z - seg.d / 2,
            maxZ: seg.z + seg.d / 2,
            name: seg.name
          });
        });

        // Ventana con marco de madera con vista a cielo diurno
        const windowFrames = [
          { x: -8.0, y: 1.7, z: -4, rotY: Math.PI / 2 },
          { x: 8.0,  y: 1.7, z: -4, rotY: -Math.PI / 2 },
          { x: -4,   y: 1.7, z: -8.0, rotY: 0 },
          { x: 4,    y: 1.7, z: 8.0,  rotY: Math.PI }
        ];

        windowFrames.forEach(wf => {
          const winGroup = new THREE.Group();

          // Marco de madera pulida exterior
          const frameMat = new THREE.MeshStandardMaterial({ color: 0x5c2b0c, roughness: 0.3, metalness: 0.15 });
          const frameGeo = new THREE.BoxGeometry(2.4, 1.8, 0.1);
          const frameMesh = new THREE.Mesh(frameGeo, frameMat);
          winGroup.add(frameMesh);

          // Vista a cielo diurno (plano luminoso azul cielo diurno con nubes estilizadas)
          const skyMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });
          const skyPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.5), skyMat);
          skyPlane.position.z = -0.06;
          winGroup.add(skyPlane);

          // Nube suave decorativa en el cielo
          const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
          const cloud = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.01), cloudMat);
          cloud.position.set(-0.3, 0.2, -0.05);
          winGroup.add(cloud);

          // Vidrio con brillo sutil
          const glassMat = new THREE.MeshStandardMaterial({
            color: 0xbae6fd,
            roughness: 0.05,
            metalness: 0.9,
            transparent: true,
            opacity: 0.35
          });
          const glassMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.5), glassMat);
          glassMesh.position.z = 0.02;
          winGroup.add(glassMesh);

          // Moldura de 4 cuadrantes de madera
          const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.5, 0.04), frameMat);
          crossV.position.z = 0.03;
          const crossH = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.06, 0.04), frameMat);
          crossH.position.z = 0.03;
          winGroup.add(crossV, crossH);

          winGroup.position.set(wf.x, wf.y, wf.z);
          winGroup.rotation.y = wf.rotY;
          threeScene.add(winGroup);
          scenarioMeshes.push(winGroup);
        });
      }

      // 4. Objetos Interactivos del Escenario
      scenario.objects.forEach(obj => {
        const objGroup = build3DObjectGeometry(obj);
        objGroup.position.set(obj.pos.x, obj.pos.y, obj.pos.z);
        objGroup.userData = obj;
        threeScene.add(objGroup);
        interactiveObjects.push(objGroup);

        const w = (obj.size ? obj.size.w : 0.8);
        const d = (obj.size ? obj.size.d : 0.8);
        sceneColliders.push({
          minX: obj.pos.x - w / 2,
          maxX: obj.pos.x + w / 2,
          minZ: obj.pos.z - d / 2,
          maxZ: obj.pos.z + d / 2,
          name: obj.id
        });
      });
    }

    function build3DObjectGeometry(obj) {`;

if (oldBuildScenarioRegex.test(html)) {
  html = html.replace(oldBuildScenarioRegex, newBuildScenario);
  console.log('Successfully updated buildScenario3D() with moldings, zoclos, rug, window sky!');
} else {
  console.warn('Could not match oldBuildScenarioRegex');
}

// 4. UPDATE PROXIMITY DETECTION TO UPDATE GLOWING HUD
const oldProximityRegex = /function updateProximityDetection\(\) \{[\s\S]*?nearestInteractiveObject = closestObj;[\s\S]*?if \(closestObj\) \{[\s\S]*?\} else \{[\s\S]*?\}\s*\}/;

const newProximity = `function updateProximityDetection() {
      if (!threeCharacter) return;

      const charPos = threeCharacter.position;
      let minDistance = 999;
      let closestObj = null;
      const time = Date.now() * 0.003;

      interactiveObjects.forEach(objGroup => {
        const dist = charPos.distanceTo(objGroup.position);
        const ring = objGroup.getObjectByName("indicatorRing");

        if (dist < 2.3) {
          if (ring) {
            ring.visible = true;
            ring.rotation.z += 0.04;
            ring.material.color.setHex(0x38bdf8);
            ring.material.emissive.setHex(0x38bdf8);
            ring.scale.setScalar(1.0 + 0.12 * Math.sin(time * 5));
          }
          if (dist < minDistance) {
            minDistance = dist;
            closestObj = objGroup;
          }
        } else {
          if (ring) {
            ring.visible = true;
            ring.rotation.z += 0.015;
            ring.material.color.setHex(0x0284c7);
            ring.material.emissive.setHex(0x0284c7);
            ring.scale.setScalar(1.0);
          }
        }
      });

      nearestInteractiveObject = closestObj;
      const hudPrompt = document.getElementById("simProximityPrompt");
      const inspectBtn = document.getElementById("simInspectActionBtn");
      const promptEn = document.getElementById("simProximityObjectName");
      const promptIpa = document.getElementById("simProximityObjectIpa");
      const promptEs = document.getElementById("simProximityObjectEs");

      if (closestObj) {
        const data = closestObj.userData;
        if (promptEn) promptEn.textContent = data.en;
        if (promptIpa) promptIpa.textContent = data.ipa || data.pron || "/ˈwɜːd/";
        if (promptEs) promptEs.textContent = data.es || "Objeto interactivo";
        if (hudPrompt) hudPrompt.classList.remove("hidden");
        if (inspectBtn) {
          inspectBtn.onclick = () => inspectObject3D(data);
        }
      } else {
        if (hudPrompt) hudPrompt.classList.add("hidden");
      }
    }

    function speakNearestObject() {
      if (nearestInteractiveObject && nearestInteractiveObject.userData) {
        speakText(nearestInteractiveObject.userData.en);
      }
    }`;

if (oldProximityRegex.test(html)) {
  html = html.replace(oldProximityRegex, newProximity);
  console.log('Successfully updated updateProximityDetection() and speakNearestObject()!');
} else {
  console.warn('Could not match oldProximityRegex');
}

// 5. UPDATE animateScenarioElements for steaming cup particles on coffee table
const oldAnimateScenarioRegex = /function animateScenarioElements\(\) \{\s*\/\/ Animación suave de luz ambiental\s*\}/;
const newAnimateScenario = `function animateScenarioElements() {
      // Animación de vapor ascendente en la taza de café
      if (steamParticles && steamParticles.length > 0) {
        steamParticles.forEach(p => {
          p.position.y += 0.005;
          p.material.opacity = Math.max(0, 0.6 - (p.position.y - 0.55) * 1.5);
          if (p.position.y > 0.95) {
            p.position.y = 0.55 + Math.random() * 0.05;
            p.position.x = 0.2 + (Math.random() - 0.5) * 0.06;
            p.position.z = (Math.random() - 0.5) * 0.06;
            p.material.opacity = 0.6;
          }
        });
      }
    }`;

if (oldAnimateScenarioRegex.test(html)) {
  html = html.replace(oldAnimateScenarioRegex, newAnimateScenario);
  console.log('Successfully updated animateScenarioElements() with steaming particles!');
} else {
  console.warn('Could not match oldAnimateScenarioRegex');
}

// 6. ENHANCE Coffee table in build3DObjectGeometry to add steam particles
const oldCoffeeTableRegex = /\/\/ Taza de café o libro decorativo[\s\S]*?group\.add\(mug\);/;
const newCoffeeTable = `// Taza de café de cerámica sobre platillo
        const saucerMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2 });
        const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.02, 16), saucerMat);
        saucer.position.set(0.2, 0.495, 0);
        group.add(saucer);

        const mugMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
        const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.1, 16), mugMat);
        mug.position.set(0.2, 0.55, 0);
        group.add(mug);

        // Café caliente oscuro dentro de la taza
        const coffee = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 16), new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.1 }));
        coffee.position.set(0.2, 0.59, 0);
        group.add(coffee);

        // Partículas de vapor ascendente humeante
        const steamGeo = new THREE.SphereGeometry(0.025, 8, 8);
        for (let i = 0; i < 4; i++) {
          const steamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 - i * 0.1 });
          const steamParticle = new THREE.Mesh(steamGeo, steamMat);
          steamParticle.position.set(0.2 + (Math.random() - 0.5) * 0.04, 0.6 + i * 0.08, (Math.random() - 0.5) * 0.04);
          group.add(steamParticle);
          steamParticles.push(steamParticle);
        }`;

if (oldCoffeeTableRegex.test(html)) {
  html = html.replace(oldCoffeeTableRegex, newCoffeeTable);
  console.log('Successfully updated coffee table geometry with steaming cup!');
} else {
  console.warn('Could not match oldCoffeeTableRegex');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Step 3 applied successfully.');

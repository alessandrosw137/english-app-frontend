const fs = require('fs');

console.log('=== CREATING NEW THREE.JS ENGINE SCRIPT ===');
let html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const threeEngineCode = `    // ========================================================
    // MOTOR 3D WORLD TOUR DE ALTA FIDELIDAD (PBR, 60 FPS, HOUSE & GARDEN)
    // ========================================================
    let threeScene, threeCamera, threeRenderer;
    let threeRaycaster, threePointer;
    let threeInteractiveMeshes = [];
    let threeCurrentInspectedObj = null;
    let threeResizeObserver = null;
    let isThreeInitialized = false;
    let currentScenarioKey = 'house';

    // Objetos animados continuos
    const threeAnimatedObjects = {
      fan: null,
      sprinkler: null
    };

    // Variables de navegación en primera persona
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let cameraYaw = -Math.PI / 2;
    let cameraPitch = -0.06;
    let isDraggingMouse = false;
    let previousMousePosition = { x: 0, y: 0 };
    let mouseDownPos = { x: 0, y: 0 };
    let joystickMove = { x: 0, y: 0 };

    let ROOM_LIMITS = {
      minX: -7.5,
      maxX: 7.5,
      minZ: -7.5,
      maxZ: 7.5,
      eyeHeight: 1.7
    };

    function initThreeWorldTour() {
      const container = document.getElementById('threeCanvasContainer');
      const mount = document.getElementById('threeWebGLMount');
      if (!container || !mount) return;

      const width = container.clientWidth || 800;
      const height = container.clientHeight || 520;

      if (isThreeInitialized && threeRenderer) {
        threeCamera.aspect = width / height;
        threeCamera.updateProjectionMatrix();
        threeRenderer.setSize(width, height);
        threeRenderer.render(threeScene, threeCamera);
        return;
      }

      // 1. Escena
      threeScene = new THREE.Scene();
      threeScene.background = new THREE.Color(0x0f172a);

      // 2. Cámara en primera persona
      threeCamera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
      threeCamera.position.set(-2.5, ROOM_LIMITS.eyeHeight, 2.5);

      // 3. Renderer optimizado para GPUs móviles (PBR, 60 FPS, ACESFilmic, Soft Shadows)
      threeRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        precision: 'mediump',
        powerPreference: 'high-performance'
      });
      threeRenderer.setClearColor(0x0f172a, 1);
      threeRenderer.setSize(width, height);
      threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
      threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      threeRenderer.toneMappingExposure = 1.05;
      threeRenderer.shadowMap.enabled = true;
      threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Inyectamos el canvas EXCLUSIVAMENTE en #threeWebGLMount
      mount.innerHTML = '';
      mount.appendChild(threeRenderer.domElement);

      // 4. Raycaster & Pointer
      threeRaycaster = new THREE.Raycaster();
      threePointer = new THREE.Vector2();

      // 5. Controles PC y Móvil
      setupFirstPersonControls(threeRenderer.domElement);
      setupVirtualJoystick();

      // 6. Construir Escenario Inicial (House)
      buildCurrentScenario();

      // 7. Resize Observer
      if (window.ResizeObserver) {
        threeResizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            const cr = entry.contentRect;
            if (cr.width > 0 && cr.height > 0) {
              threeCamera.aspect = cr.width / cr.height;
              threeCamera.updateProjectionMatrix();
              threeRenderer.setSize(cr.width, cr.height);
              threeRenderer.render(threeScene, threeCamera);
            }
          }
        });
        threeResizeObserver.observe(container);
      }

      // 8. Bucle de Animación a 60 FPS con delta time
      let lastTime = performance.now();
      function animate3D(now) {
        requestAnimationFrame(animate3D);
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        if (threeRenderer && threeScene && threeCamera && currentActiveView === 'view-worldtour') {
          // Rotación continua del ventilador de techo (House)
          if (threeAnimatedObjects.fan) {
            threeAnimatedObjects.fan.rotation.y += delta * 4.5;
          }

          // Giro continuo del aspersor de riego (Garden)
          if (threeAnimatedObjects.sprinkler) {
            threeAnimatedObjects.sprinkler.rotation.y += delta * 6.5;
          }

          updatePlayerMovement(delta);
          threeRenderer.render(threeScene, threeCamera);
        }
      }
      requestAnimationFrame(animate3D);
      isThreeInitialized = true;
    }

    // ========================================================
    // TEXTURAS PROCEDURALES LIGERAS EN MEMORIA (CANVAS HTML5)
    // ========================================================

    // Duela de madera de roble con líneas divisorias y vetas (roughness: 0.62)
    function createOakWoodTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#654321';
      ctx.fillRect(0, 0, 512, 512);

      const plankHeight = 64;
      for (let y = 0; y < 512; y += plankHeight) {
        const shade = (y / plankHeight) % 2 === 0 ? 'rgba(215, 175, 130, 0.09)' : 'rgba(30, 18, 10, 0.14)';
        ctx.fillStyle = shade;
        ctx.fillRect(0, y, 512, plankHeight);

        for (let i = 0; i < 4; i++) {
          ctx.strokeStyle = 'rgba(75, 45, 20, 0.25)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          const vy = y + 8 + i * 14;
          ctx.moveTo(0, vy);
          ctx.bezierCurveTo(150, vy + Math.sin(i) * 5, 350, vy - Math.cos(i) * 5, 512, vy);
          ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(25, 12, 5, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    }

    // Césped exterior con micro-variaciones esmeralda y oliva
    function createGrassTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#2d6a4f';
      ctx.fillRect(0, 0, 512, 512);

      const colors = ['#1b4332', '#40916c', '#52b788', '#386641', '#2d6a4f'];
      for (let i = 0; i < 1800; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const w = Math.random() * 5 + 2;
        const h = Math.random() * 5 + 2;
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(x, y, w, h);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(8, 8);
      return texture;
    }

    // ========================================================
    // GESTIÓN Y CONSTRUCCIÓN DE ESCENARIOS (HOUSE & GARDEN)
    // ========================================================

    function switch3DScenario(scenarioKey) {
      if (!WORLD_TOUR_SCENARIOS[scenarioKey]) return;
      currentScenarioKey = scenarioKey;

      const btnHouse = document.getElementById('scenarioBtnHouse');
      const btnGarden = document.getElementById('scenarioBtnGarden');

      if (btnHouse && btnGarden) {
        if (scenarioKey === 'house') {
          btnHouse.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer bg-purple-600 text-white border border-purple-400';
          btnGarden.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-slate-800 text-slate-300 hover:text-white border border-slate-700';
        } else {
          btnGarden.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer bg-emerald-600 text-white border border-emerald-400';
          btnHouse.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-slate-800 text-slate-300 hover:text-white border border-slate-700';
        }
      }

      close3DInspectCard();
      buildCurrentScenario();
      showFloatingToast(\`Cargando escenario: \${WORLD_TOUR_SCENARIOS[scenarioKey].title}\`, '🪐');
    }

    function buildCurrentScenario() {
      if (!threeScene) return;

      // Limpiar objetos y luces previas
      while (threeScene.children.length > 0) {
        const obj = threeScene.children[0];
        threeScene.remove(obj);
      }

      threeInteractiveMeshes = [];
      threeAnimatedObjects.fan = null;
      threeAnimatedObjects.sprinkler = null;

      const scen = WORLD_TOUR_SCENARIOS[currentScenarioKey];
      ROOM_LIMITS = scen.roomLimits;

      // Restablecer posición y rotación de cámara
      threeCamera.position.set(scen.spawnPos.x, scen.spawnPos.y, scen.spawnPos.z);
      cameraYaw = currentScenarioKey === 'house' ? -Math.PI / 2 : -Math.PI / 2;
      cameraPitch = -0.06;

      if (currentScenarioKey === 'house') {
        buildHouseEnvironment();
      } else {
        buildGardenEnvironment();
      }

      // Instanciar objetos interactivos del escenario
      const objects = scen.objects || [];
      objects.forEach(objData => {
        try {
          const mesh = buildCompound3DObject(objData, currentScenarioKey);
          if (mesh) {
            mesh.userData = objData;
            threeScene.add(mesh);
            threeInteractiveMeshes.push(mesh);
          }
        } catch (e) {
          console.error('Error instanciando objeto 3D', objData.id, e);
        }
      });

      if (threeRenderer) {
        threeRenderer.render(threeScene, threeCamera);
      }
    }

    // ENTORNO 1: HOUSE & ROOMS (Piso roble, techo plano, molduras de yeso, zoclos y luces cálidas)
    function buildHouseEnvironment() {
      threeScene.background = new THREE.Color(0x0f172a);

      // 1. Iluminación Interior Balanceada
      const ambientLight = new THREE.AmbientLight(0xf1f5f9, 1.0);
      threeScene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
      dirLight.position.set(-6.5, 5.5, -4.0);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.0004;
      threeScene.add(dirLight);

      const lampLight = new THREE.PointLight(0xffedd5, 1.3, 9);
      lampLight.position.set(-6.2, 2.2, -5.5);
      threeScene.add(lampLight);

      // 2. Piso de duela de roble (roughness: 0.62)
      const woodTex = createOakWoodTexture();
      const floorMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.62, metalness: 0.04 });
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      threeScene.add(floor);

      // 3. Muros interiores con pintura suave (#e2e8f0)
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.85 });

      // Muro Trasero
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(18, 4.5, 0.3), wallMat);
      backWall.position.set(0, 2.25, -8.5);
      backWall.receiveShadow = true;
      threeScene.add(backWall);

      // Muro Delantero
      const frontWall = new THREE.Mesh(new THREE.BoxGeometry(18, 4.5, 0.3), wallMat);
      frontWall.position.set(0, 2.25, 8.5);
      frontWall.receiveShadow = true;
      threeScene.add(frontWall);

      // Muro Izquierdo
      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.5, 18), wallMat);
      leftWall.position.set(-8.5, 2.25, 0);
      leftWall.receiveShadow = true;
      threeScene.add(leftWall);

      // Muro Derecho
      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.5, 18), wallMat);
      rightWall.position.set(8.5, 2.25, 0);
      rightWall.receiveShadow = true;
      threeScene.add(rightWall);

      // 4. Techo plano superior (#f8fafc)
      const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });
      const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), ceilingMat);
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.y = 4.5;
      threeScene.add(ceiling);

      // 5. Molduras perimetrales de yeso (crown molding) en la unión con el techo
      const crownMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
      const crownBack = new THREE.Mesh(new THREE.BoxGeometry(18, 0.16, 0.12), crownMat);
      crownBack.position.set(0, 4.42, -8.38);
      const crownLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 18), crownMat);
      crownLeft.position.set(-8.38, 4.42, 0);
      const crownRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 18), crownMat);
      crownRight.position.set(8.38, 4.42, 0);
      threeScene.add(crownBack, crownLeft, crownRight);

      // 6. Zoclos de madera de roble oscuro en la base de todos los muros
      const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x3b1d0e, roughness: 0.45 });
      const bbBack = new THREE.Mesh(new THREE.BoxGeometry(18, 0.18, 0.06), baseboardMat);
      bbBack.position.set(0, 0.09, -8.32);
      const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 18), baseboardMat);
      bbLeft.position.set(-8.32, 0.09, 0);
      const bbRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 18), baseboardMat);
      bbRight.position.set(8.32, 0.09, 0);
      threeScene.add(bbBack, bbLeft, bbRight);
    }

    // ENTORNO 2: BACKYARD & GARDEN (Césped esmeralda, cielo diurno, sol procedural, cerca perimetral)
    function buildGardenEnvironment() {
      threeScene.background = new THREE.Color(0x7dd3fc); // Cielo azul brillante

      // 1. Iluminación Solar Exterior con Sombras Suaves
      const skyLight = new THREE.AmbientLight(0xe0f2fe, 1.1);
      threeScene.add(skyLight);

      const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
      sunLight.position.set(8.0, 14.0, -12.0);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.bias = -0.0003;
      threeScene.add(sunLight);

      // 2. Suelo de césped esmeralda y oliva (24x24)
      const grassTex = createGrassTexture();
      const grassMat = new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.88, metalness: 0.0 });
      const lawn = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), grassMat);
      lawn.rotation.x = -Math.PI / 2;
      lawn.receiveShadow = true;
      threeScene.add(lawn);

      // 3. Sol procedural en la lejanía
      const sunGeo = new THREE.SphereGeometry(1.8, 16, 16);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const sunMesh = new THREE.Mesh(sunGeo, sunMat);
      sunMesh.position.set(8.0, 12.0, -18.0);
      threeScene.add(sunMesh);

      // 4. Cerca perimetral de estacas de madera (Picket Fence)
      const fenceMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 });
      const railMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });

      function createFenceSegment(length, rotY, posX, posZ) {
        const fenceGroup = new THREE.Group();
        const postCount = Math.floor(length / 0.7);

        // Rieles horizontales
        const topRail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.06, 0.04), railMat);
        topRail.position.y = 0.95;
        const botRail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.06, 0.04), railMat);
        botRail.position.y = 0.35;
        fenceGroup.add(topRail, botRail);

        // Estacas con punta
        for (let i = 0; i < postCount; i++) {
          const x = -length / 2 + (i + 0.5) * (length / postCount);
          const picket = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 0.025), fenceMat);
          picket.position.set(x, 0.55, 0);
          picket.castShadow = true;
          fenceGroup.add(picket);
        }

        fenceGroup.rotation.y = rotY;
        fenceGroup.position.set(posX, 0, posZ);
        threeScene.add(fenceGroup);
      }

      createFenceSegment(23, 0, 0, -11.5);
      createFenceSegment(23, Math.PI / 2, -11.5, 0);
      createFenceSegment(23, -Math.PI / 2, 11.5, 0);
    }

    // ========================================================
    // MODELADO 3D COMPUESTO DE ALTA FIDELIDAD (ESTILO BLENDER)
    // ========================================================
    function buildCompound3DObject(obj, scenarioKey) {
      const group = new THREE.Group();

      if (scenarioKey === 'house') {
        if (obj.id === 'hammock') {
          // Hamaca: curvatura cóncava natural hacia abajo, barras separadoras, cuerdas y anclajes
          const fabricMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, side: THREE.DoubleSide, roughness: 0.65 });
          
          // Malla curvada cóncava (catenaria suave)
          const fabricGeo = new THREE.CylinderGeometry(0.65, 0.55, 3.2, 24, 1, true, 0, Math.PI);
          const fabric = new THREE.Mesh(fabricGeo, fabricMat);
          fabric.rotation.z = Math.PI / 2;
          fabric.position.set(0, 0.15, 0);
          fabric.castShadow = true;
          group.add(fabric);

          // Barras separadoras de madera cilíndricas en los extremos
          const barMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });
          const bar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.85, 12), barMat);
          bar1.position.set(-1.6, 0.35, 0);
          const bar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.85, 12), barMat);
          bar2.position.set(1.6, 0.35, 0);
          group.add(bar1, bar2);

          // Cuerdas tensadas diagonales hacia arriba
          const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
          const ropeL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.8), ropeMat);
          ropeL.rotation.z = -Math.PI / 4.2;
          ropeL.position.set(-2.2, 0.95, 0);
          const ropeR = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.8), ropeMat);
          ropeR.rotation.z = Math.PI / 4.2;
          ropeR.position.set(2.2, 0.95, 0);
          group.add(ropeL, ropeR);

          // Soportes / argollas metálicas ancladas
          const ringMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
          const ringL = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 8, 16), ringMat);
          ringL.position.set(-2.9, 1.55, 0);
          const ringR = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 8, 16), ringMat);
          ringR.position.set(2.9, 1.55, 0);
          group.add(ringL, ringR);

        } else if (obj.id === 'sofa') {
          // Sofá contemporáneo: estructura 3 plazas, 4 patas cónicas torneadas, 3 cojines de asiento y respaldo, reposabrazos y cojines decorativos
          const sofaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.82 });
          const cushionMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.78 });

          // 4 Patas cónicas de madera torneada
          const legMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.4 });
          const legOffsets = [[-1.3, -0.4], [1.3, -0.4], [-1.3, 0.4], [1.3, 0.4]];
          legOffsets.forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.02, 0.22, 12), legMat);
            leg.position.set(lx, 0.11, lz);
            leg.castShadow = true;
            group.add(leg);
          });

          // Base tapizada
          const base = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.26, 1.05), sofaMat);
          base.position.y = 0.28;
          base.castShadow = true;
          group.add(base);

          // 3 Cojines de asiento independientes
          for (let i = 0; i < 3; i++) {
            const cx = -0.9 + i * 0.9;
            const seat = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.2, 0.92), cushionMat);
            seat.position.set(cx, 0.48, 0.04);
            seat.castShadow = true;
            group.add(seat);

            const back = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.52, 0.22), cushionMat);
            back.position.set(cx, 0.82, -0.38);
            back.rotation.x = -0.12;
            back.castShadow = true;
            group.add(back);
          }

          // Reposabrazos acolchados
          const armL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.52, 1.05), sofaMat);
          armL.position.set(-1.42, 0.55, 0);
          armL.castShadow = true;
          const armR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.52, 1.05), sofaMat);
          armR.position.set(1.42, 0.55, 0);
          armR.castShadow = true;
          group.add(armL, armR);

          // 2 Cojines decorativos de acento
          const pillowMat1 = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
          const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.35, 0.14), pillowMat1);
          pillow1.position.set(-1.18, 0.62, 0.08);
          pillow1.rotation.y = 0.25;
          const pillowMat2 = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.6 });
          const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.35, 0.14), pillowMat2);
          pillow2.position.set(1.18, 0.62, 0.08);
          pillow2.rotation.y = -0.25;
          group.add(pillow1, pillow2);

        } else if (obj.id === 'cushion') {
          const mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.65 });
          const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.16), mat);
          pillow.rotation.set(0.1, 0.2, 0.15);
          pillow.castShadow = true;
          group.add(pillow);

        } else if (obj.id === 'bookshelf') {
          // Estantería alta de madera oscura con 5 baldas y más de 25 libros individuales
          const woodMat = new THREE.MeshStandardMaterial({ color: 0x2b1406, roughness: 0.5 });
          const frame = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.6, 1.85), woodMat);
          frame.castShadow = true;
          group.add(frame);

          // 5 Baldas horizontales con libros
          const bookColors = [0xdc2626, 0x1e3a8a, 0x059669, 0xd97706, 0x7c3aed, 0x831843, 0xfef3c7, 0x0284c7];
          for (let shelf = 0; shelf < 5; shelf++) {
            const shelfY = -1.0 + shelf * 0.5;
            for (let b = 0; b < 6; b++) {
              const bookMat = new THREE.MeshStandardMaterial({ color: bookColors[(shelf * 6 + b) % bookColors.length], roughness: 0.4 });
              const bookH = 0.32 + Math.random() * 0.08;
              const bookThick = 0.045 + Math.random() * 0.03;
              const book = new THREE.Mesh(new THREE.BoxGeometry(0.32, bookH, bookThick), bookMat);
              book.position.set(0.06, shelfY + bookH / 2, -0.7 + b * 0.25);
              if (b === 5) book.rotation.x = 0.18; // Inclinación natural
              group.add(book);
            }
          }

        } else if (obj.id === 'coffee_table') {
          // Mesa de centro biselada, 4 patas metálicas estilizadas y libros apilados
          const topMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.28, metalness: 0.08 });
          const top = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.82, 0.06, 32), topMat);
          top.position.y = 0.44;
          top.castShadow = true;
          group.add(top);

          const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2 + Math.PI / 4;
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.02, 0.44, 16), legMat);
            leg.position.set(Math.cos(angle) * 0.62, 0.22, Math.sin(angle) * 0.62);
            leg.castShadow = true;
            group.add(leg);
          }

          // Libros de arte apilados sobre la mesa
          const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.24), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 }));
          b1.position.set(-0.18, 0.49, 0.08);
          const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.035, 0.22), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 }));
          b2.position.set(-0.18, 0.53, 0.08);
          b2.rotation.y = 0.15;
          group.add(b1, b2);

        } else if (obj.id === 'coffee_mug') {
          // Taza de cerámica con plato base y asa en toroide (TorusGeometry)
          const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.18 });
          const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.015, 16), ceramicMat);
          plate.position.y = 0.01;
          const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.14, 16), ceramicMat);
          cup.position.y = 0.08;
          const handle = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 8, 16), ceramicMat);
          handle.position.set(0.08, 0.08, 0);
          handle.rotation.y = Math.PI / 2;
          group.add(plate, cup, handle);

        } else if (obj.id === 'ceiling_fan') {
          // Ventilador de techo con rotación continua calculada por delta time
          const rodMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
          const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.55), rodMat);
          rod.position.y = 0.28;
          group.add(rod);

          const fanBladesGroup = new THREE.Group();
          const hubMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16), hubMat);
          fanBladesGroup.add(hub);

          const lightDome = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.6 }));
          lightDome.position.y = -0.06;
          fanBladesGroup.add(lightDome);

          const bladeMat = new THREE.MeshStandardMaterial({ color: 0x5a2d0c, roughness: 0.4 });
          for (let i = 0; i < 4; i++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.018, 0.18), bladeMat);
            const ang = (i * Math.PI) / 2;
            blade.position.set(Math.cos(ang) * 0.62, 0, Math.sin(ang) * 0.62);
            blade.rotation.y = ang;
            blade.rotation.x = 0.08; // Inclinación aerodinámica
            fanBladesGroup.add(blade);
          }

          group.add(fanBladesGroup);
          threeAnimatedObjects.fan = fanBladesGroup; // Registrado para rotar en animate3D

        } else if (obj.id === 'television') {
          // Consola baja de TV y pantalla OLED de borde fino
          const standMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
          const stand = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.55, 0.6), standMat);
          stand.position.y = -0.7;
          stand.castShadow = true;

          const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.4, 0.04), new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.9, roughness: 0.2 }));
          const oledScreen = new THREE.Mesh(new THREE.BoxGeometry(2.44, 1.34, 0.05), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.1 }));
          oledScreen.position.z = 0.01;
          group.add(stand, tvFrame, oledScreen);

        } else if (obj.id === 'soundbar') {
          const barMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 });
          const bar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.09, 0.09), barMat);
          bar.castShadow = true;
          group.add(bar);

        } else if (obj.id === 'rug') {
          const rugMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.95 });
          const rug = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.03, 2.5), rugMat);
          group.add(rug);

        } else if (obj.id === 'floor_lamp') {
          const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 }));
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.9, 12), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 }));
          pole.position.y = 0.95;
          const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.44, 0.48, 20), new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.4 }));
          shade.position.y = 1.85;
          group.add(base, pole, shade);

        } else if (obj.id === 'curtain') {
          const cMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.8 });
          const cLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 2.6, 16), cMat);
          cLeft.position.x = -1.6;
          const cRight = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 2.6, 16), cMat);
          cRight.position.x = 1.6;
          group.add(cLeft, cRight);

        } else if (obj.id === 'window') {
          const winFrame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.3, 0.1), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }));
          const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 2.1), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
          glass.position.z = 0.06;
          group.add(winFrame, glass);

        } else if (obj.id === 'potted_plant') {
          const potMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
          const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.5, 16), potMat);
          const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 }));
          leaves.position.y = 0.42;
          group.add(pot, leaves);

        } else if (obj.id === 'door_lock') {
          const lockPlate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.04), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
          const handle = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.04), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
          handle.position.set(0.08, 0.05, 0.03);
          group.add(lockPlate, handle);
        } else {
          const box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0xa855f7 }));
          group.add(box);
        }
      } else {
        // SCENARIO: BACKYARD & GARDEN
        if (obj.id === 'bbq_grill') {
          // Asador esférico metálico con tapa, rejilla, patas y ruedas
          const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.35, metalness: 0.85 });
          const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.46, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), blackMat);
          bowl.castShadow = true;

          const lid = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), blackMat);
          lid.position.y = 0.04;
          const handle = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.018, 8, 16), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
          handle.position.y = 0.54;
          handle.rotation.x = Math.PI / 2;

          const legMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
          for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.85), legMat);
            leg.position.set(Math.cos(angle) * 0.28, -0.42, Math.sin(angle) * 0.28);
            leg.rotation.z = Math.cos(angle) * 0.15;
            leg.rotation.x = Math.sin(angle) * 0.15;
            group.add(leg);
          }

          // 2 Ruedas de goma en la base
          const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
          const w1 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16), wheelMat);
          w1.rotation.z = Math.PI / 2;
          w1.position.set(-0.35, -0.78, 0.22);
          const w2 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16), wheelMat);
          w2.rotation.z = Math.PI / 2;
          w2.position.set(-0.35, -0.78, -0.22);

          group.add(bowl, lid, handle, w1, w2);

        } else if (obj.id === 'patio_table') {
          // Mesa de terraza con sombrilla octagonal de lona roja y poste central
          const tableMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 });
          const table = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.06, 24), tableMat);
          table.position.y = 0.55;
          table.castShadow = true;

          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.8, 12), new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.7 }));
          pole.position.y = 1.4;

          // Sombrilla octagonal de lona roja
          const umbrellaMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.65 });
          const umbrella = new THREE.Mesh(new THREE.ConeGeometry(1.65, 0.75, 8), umbrellaMat);
          umbrella.position.y = 2.45;
          umbrella.castShadow = true;

          const finial = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
          finial.position.y = 2.85;

          group.add(table, pole, umbrella, finial);

        } else if (obj.id === 'lawn_mower') {
          // Cortacésped con chasis rojo, motor y manubrio ergonómico inclinado
          const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35, metalness: 0.4 });
          const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.24, 0.55), redMat);
          chassis.position.y = 0.2;
          chassis.castShadow = true;

          const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.22, 16), new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8 }));
          motor.position.set(-0.05, 0.38, 0);

          // 4 Ruedas con tapacubos
          const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 });
          const wheelPos = [[-0.35, -0.26], [0.35, -0.26], [-0.35, 0.26], [0.35, 0.26]];
          wheelPos.forEach(([wx, wz]) => {
            const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 16), wheelMat);
            wh.rotation.x = Math.PI / 2;
            wh.position.set(wx, 0.12, wz);
            group.add(wh);
          });

          // Manubrio ergonómico inclinado hacia atrás
          const handleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
          const hArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1), handleMat);
          hArm1.rotation.z = -Math.PI / 3.8;
          hArm1.position.set(0.48, 0.65, -0.22);
          const hArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1), handleMat);
          hArm2.rotation.z = -Math.PI / 3.8;
          hArm2.position.set(0.48, 0.65, 0.22);
          const hCross = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.48), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
          hCross.position.set(0.88, 1.05, 0);
          hCross.rotation.x = Math.PI / 2;

          group.add(chassis, motor, hArm1, hArm2, hCross);

        } else if (obj.id === 'wheelbarrow') {
          // Carretilla de carga metálica con tolva inclinada, rueda delantera y soportes
          const tubMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.5 });
          const tub = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.32, 0.38, 4), tubMat);
          tub.rotation.y = Math.PI / 4;
          tub.position.set(0, 0.45, 0);
          tub.castShadow = true;

          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 }));
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(-0.55, 0.18, 0);

          const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
          const f1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4), frameMat);
          f1.rotation.z = Math.PI / 6;
          f1.position.set(0.2, 0.4, -0.25);
          const f2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4), frameMat);
          f2.rotation.z = Math.PI / 6;
          f2.position.set(0.2, 0.4, 0.25);

          group.add(tub, wheel, f1, f2);

        } else if (obj.id === 'watering_can') {
          // Regadera metálica con roseta perforada y asa arqueada
          const canMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.3 });
          const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.38, 16), canMat);
          body.position.y = 0.2;
          body.castShadow = true;

          const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.45, 12), canMat);
          spout.rotation.z = -Math.PI / 3.5;
          spout.position.set(0.25, 0.32, 0);

          const rosette = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
          rosette.position.set(0.44, 0.48, 0);

          const archHandle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.018, 8, 16, Math.PI), canMat);
          archHandle.position.set(0, 0.42, 0);

          group.add(body, spout, rosette, archHandle);

        } else if (obj.id === 'flower_pot') {
          // Maceta de terracota con follaje floral
          const potMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.7 });
          const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.22, 0.48, 16), potMat);
          pot.position.y = 0.24;
          pot.castShadow = true;

          const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.34), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 }));
          bush.position.y = 0.58;

          // Flores de colores variados
          const flowerMat1 = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
          const fl1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), flowerMat1);
          fl1.position.set(0.15, 0.75, 0.1);
          const flowerMat2 = new THREE.MeshStandardMaterial({ color: 0xfbbf24 });
          const fl2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), flowerMat2);
          fl2.position.set(-0.15, 0.72, -0.1);

          group.add(pot, bush, fl1, fl2);

        } else if (obj.id === 'sprinkler') {
          // Aspersor de riego rotatorio con giro continuo
          const baseMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 });
          const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.08, 16), baseMat);
          base.position.y = 0.04;

          const sprinklerHead = new THREE.Group();
          const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.18), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
          stem.position.y = 0.13;
          sprinklerHead.add(stem);

          for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.24), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
            arm.position.set(Math.cos(angle) * 0.12, 0.22, Math.sin(angle) * 0.12);
            arm.rotation.y = angle;
            arm.rotation.z = Math.PI / 4;
            sprinklerHead.add(arm);
          }

          group.add(base, sprinklerHead);
          threeAnimatedObjects.sprinkler = sprinklerHead; // Registrado para giro continuo

        } else if (obj.id === 'wooden_fence') {
          const fenceSection = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.1, 0.08), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 }));
          fenceSection.position.y = 0.55;
          group.add(fenceSection);

        } else if (obj.id === 'garden_bench') {
          const benchWood = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });
          const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.55), benchWood);
          seat.position.y = 0.45;
          const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.06), benchWood);
          back.position.set(0, 0.8, -0.24);

          const ironMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.85 });
          const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.55), ironMat);
          l1.position.set(-0.85, 0.22, 0);
          const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.55), ironMat);
          l2.position.set(0.85, 0.22, 0);

          group.add(seat, back, l1, l2);

        } else if (obj.id === 'garden_hose') {
          const hoseMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });
          const coil = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.06, 12, 24), hoseMat);
          coil.rotation.x = Math.PI / 2;
          coil.position.y = 0.06;
          const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.18), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
          nozzle.position.set(0.38, 0.1, 0);
          nozzle.rotation.z = Math.PI / 4;
          group.add(coil, nozzle);

        } else if (obj.id === 'shovel') {
          const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.1), new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 }));
          handle.rotation.z = 0.2;
          handle.position.set(0, 0.55, 0);

          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.02), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 }));
          blade.rotation.z = 0.2;
          blade.position.set(-0.11, 0.12, 0);

          group.add(handle, blade);

        } else if (obj.id === 'sun') {
          const sunSphere = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
          group.add(sunSphere);
        } else {
          const box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
          group.add(box);
        }
      }

      group.position.set(obj.pos.x, obj.pos.y, obj.pos.z);
      return group;
    }

    // ========================================================
    // SISTEMA DE CONTROLES (PC WASD/RATÓN Y MÓVIL JOYSTICK/SWIPE)
    // ========================================================
    function setupFirstPersonControls(canvas) {
      if (!canvas) return;

      window.addEventListener('keydown', (e) => {
        if (currentActiveView !== 'view-worldtour') return;
        const k = e.key.toLowerCase();
        if (k === 'w' || e.code === 'KeyW' || e.key === 'ArrowUp') moveForward = true;
        if (k === 's' || e.code === 'KeyS' || e.key === 'ArrowDown') moveBackward = true;
        if (k === 'a' || e.code === 'KeyA' || e.key === 'ArrowLeft') moveLeft = true;
        if (k === 'd' || e.code === 'KeyD' || e.key === 'ArrowRight') moveRight = true;
      });

      window.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        if (k === 'w' || e.code === 'KeyW' || e.key === 'ArrowUp') moveForward = false;
        if (k === 's' || e.code === 'KeyS' || e.key === 'ArrowDown') moveBackward = false;
        if (k === 'a' || e.code === 'KeyA' || e.key === 'ArrowLeft') moveLeft = false;
        if (k === 'd' || e.code === 'KeyD' || e.key === 'ArrowRight') moveRight = false;
      });

      // Arrastre con ratón en PC
      canvas.addEventListener('mousedown', (e) => {
        isDraggingMouse = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        mouseDownPos = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDraggingMouse || currentActiveView !== 'view-worldtour') return;
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        cameraYaw += deltaX * 0.0038;
        cameraPitch = Math.max(-1.0, Math.min(1.0, cameraPitch - deltaY * 0.0038));
        previousMousePosition = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mouseup', (e) => {
        if (isDraggingMouse) {
          isDraggingMouse = false;
          const dist = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
          if (dist < 8) {
            onThreeCanvasClick(e);
          }
        }
      });

      // Swipe táctil en mitad derecha de pantalla en móvil para girar vista libre en 360°
      let touchLookId = null;
      let prevTouch = { x: 0, y: 0 };
      canvas.addEventListener('touchstart', (e) => {
        for (let t of e.changedTouches) {
          const rect = canvas.getBoundingClientRect();
          if ((t.clientX - rect.left) > rect.width * 0.35 && touchLookId === null) {
            touchLookId = t.identifier;
            prevTouch = { x: t.clientX, y: t.clientY };
          }
        }
      }, { passive: true });

      canvas.addEventListener('touchmove', (e) => {
        for (let t of e.changedTouches) {
          if (t.identifier === touchLookId) {
            const deltaX = t.clientX - prevTouch.x;
            const deltaY = t.clientY - prevTouch.y;
            cameraYaw += deltaX * 0.0045;
            cameraPitch = Math.max(-1.0, Math.min(1.0, cameraPitch - deltaY * 0.0045));
            prevTouch = { x: t.clientX, y: t.clientY };
          }
        }
      }, { passive: true });

      canvas.addEventListener('touchend', (e) => {
        for (let t of e.changedTouches) {
          if (t.identifier === touchLookId) {
            touchLookId = null;
          }
        }
      });
    }

    function setupVirtualJoystick() {
      const container = document.getElementById('virtualJoystickContainer');
      const knob = document.getElementById('virtualJoystickKnob');
      if (!container || !knob) return;

      let active = false;
      const radius = 38;

      function updateKnob(clientX, clientY) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let dx = clientX - centerX;
        let dy = clientY - centerY;
        const dist = Math.hypot(dx, dy);
        if (dist > radius) {
          dx = (dx / dist) * radius;
          dy = (dy / dist) * radius;
        }
        knob.style.transform = \`translate(\${dx}px, \${dy}px)\`;
        joystickMove.x = dx / radius;
        joystickMove.y = dy / radius;
      }

      container.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        active = true;
        updateKnob(e.clientX, e.clientY);
      });
      window.addEventListener('mousemove', (e) => {
        if (active) updateKnob(e.clientX, e.clientY);
      });
      window.addEventListener('mouseup', () => {
        if (active) {
          active = false;
          knob.style.transform = 'translate(0px, 0px)';
          joystickMove.x = 0;
          joystickMove.y = 0;
        }
      });

      container.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        active = true;
        if (e.changedTouches.length > 0) {
          updateKnob(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      }, { passive: false });

      window.addEventListener('touchmove', (e) => {
        if (active && e.changedTouches.length > 0) {
          updateKnob(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      }, { passive: false });

      window.addEventListener('touchend', () => {
        if (active) {
          active = false;
          knob.style.transform = 'translate(0px, 0px)';
          joystickMove.x = 0;
          joystickMove.y = 0;
        }
      });
    }

    // Movimiento fluido normalizado en primera persona con límites de colisión
    function updatePlayerMovement(delta = 0.016) {
      if (currentActiveView !== 'view-worldtour') return;

      const moveSpeed = 4.2 * delta;
      const forwardX = Math.cos(cameraYaw);
      const forwardZ = Math.sin(cameraYaw);
      const rightX = -Math.sin(cameraYaw);
      const rightZ = Math.cos(cameraYaw);

      let dirX = 0;
      let dirZ = 0;

      if (moveForward) { dirX += forwardX; dirZ += forwardZ; }
      if (moveBackward) { dirX -= forwardX; dirZ -= forwardZ; }
      if (moveLeft) { dirX -= rightX; dirZ -= rightZ; }
      if (moveRight) { dirX += rightX; dirZ += rightZ; }

      if (joystickMove.x !== 0 || joystickMove.y !== 0) {
        dirX += forwardX * (-joystickMove.y) + rightX * joystickMove.x;
        dirZ += forwardZ * (-joystickMove.y) + rightZ * joystickMove.x;
      }

      const length = Math.hypot(dirX, dirZ);
      if (length > 0.001) {
        dirX /= length;
        dirZ /= length;

        threeCamera.position.x = Math.max(ROOM_LIMITS.minX, Math.min(ROOM_LIMITS.maxX, threeCamera.position.x + dirX * moveSpeed));
        threeCamera.position.z = Math.max(ROOM_LIMITS.minZ, Math.min(ROOM_LIMITS.maxZ, threeCamera.position.z + dirZ * moveSpeed));
      }

      threeCamera.position.y = ROOM_LIMITS.eyeHeight;

      const targetX = threeCamera.position.x + Math.cos(cameraPitch) * Math.cos(cameraYaw);
      const targetY = threeCamera.position.y + Math.sin(cameraPitch);
      const targetZ = threeCamera.position.z + Math.cos(cameraPitch) * Math.sin(cameraYaw);
      threeCamera.lookAt(targetX, targetY, targetZ);
    }

    // Realce con destello de luz suave neón al interactuar
    function highlightObject(mesh) {
      if (!mesh) return;
      const originalColors = [];
      mesh.traverse(child => {
        if (child.isMesh && child.material && child.material.emissive) {
          originalColors.push({
            child,
            color: child.material.emissive.getHex(),
            intensity: child.material.emissiveIntensity || 0
          });
          child.material.emissive.setHex(0xa855f7);
          child.material.emissiveIntensity = 0.85;
        }
      });

      setTimeout(() => {
        originalColors.forEach(item => {
          if (item.child && item.child.material && item.child.material.emissive) {
            item.child.material.emissive.setHex(item.color);
            item.child.material.emissiveIntensity = item.intensity;
          }
        });
      }, 450);
    }

    function onThreeCanvasClick(event) {
      const container = document.getElementById('threeCanvasContainer');
      if (!container || !threeRaycaster || !threeCamera) return;

      const rect = container.getBoundingClientRect();
      const clientX = event.clientX || (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientX : 0);
      const clientY = event.clientY || (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientY : 0);

      threePointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      threePointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      threeRaycaster.setFromCamera(threePointer, threeCamera);
      const intersects = threeRaycaster.intersectObjects(threeInteractiveMeshes, true);

      if (intersects.length > 0) {
        let target = intersects[0].object;
        while (target.parent && (!target.userData || !target.userData.id) && target.parent !== threeScene) {
          target = target.parent;
        }
        if (target && target.userData && target.userData.id) {
          highlightObject(target);
          inspect3DObject(target.userData);
          speakText(target.userData.en);
        }
      }
    }

    function inspect3DObject(objData) {
      threeCurrentInspectedObj = objData;
      const card = document.getElementById('threeObjectInspectCard');
      const enEl = document.getElementById('threeObjEnName');
      const esEl = document.getElementById('threeObjEsName');
      const ipaEl = document.getElementById('threeObjIpa');
      const catEl = document.getElementById('threeObjCategory');
      const exEl = document.getElementById('threeObjExample');

      if (enEl) enEl.textContent = objData.en;
      if (esEl) esEl.textContent = objData.es;
      if (ipaEl) ipaEl.textContent = objData.ipa || '';
      if (catEl) catEl.textContent = objData.category || 'Objeto 3D';
      if (exEl) exEl.textContent = objData.example || \`I can see the \${objData.en.toLowerCase()} clearly.\`;

      if (card) card.classList.remove('hidden');
    }

    function speakCurrent3DObj() {
      if (threeCurrentInspectedObj && threeCurrentInspectedObj.en) {
        speakText(threeCurrentInspectedObj.en);
      }
    }

    function close3DInspectCard() {
      const card = document.getElementById('threeObjectInspectCard');
      if (card) card.classList.add('hidden');
    }

    // Aliases para compatibilidad
    window.switch3DScenario = switch3DScenario;
    window.inspect3DObject = inspect3DObject;
    window.highlightObject = highlightObject;
    window.close3DInspectCard = close3DInspectCard;
    window.speakCurrent3DObj = speakCurrent3DObj;
`;

const s = html.indexOf('MOTOR 3D WORLD TOUR');
const sIdx = html.lastIndexOf('// ========================================================', s);
const eIdx = html.indexOf('function startPortalStars()');

if (sIdx !== -1 && eIdx !== -1) {
  html = html.substring(0, sIdx) + threeEngineCode.trim() + '\n\n    ' + html.substring(eIdx);
  fs.writeFileSync('app/src/main/assets/index.html', html, 'utf8');
  console.log('✅ Motor Three.js reemplazado con éxito!');
} else {
  console.error('❌ No se encontraron los límites de Three.js');
}

const fs = require('fs');

let code = fs.readFileSync('scripts/build_unified_app_v2.js', 'utf8');

console.log('--- PATCH 1: UNIVERSAL EXIT BUTTON ---');
const target1 = '<!-- ========================================================\n       PANTALLA DE CARGA Y ANTI-LAG (LOADING SCREEN)';
const replacement1 = `<!-- ========================================================
       BOTÓN UNIVERSAL DE RETORNO / CANCELAR CARGA (Z-INDEX: 9999)
       SIEMPRE VISIBLE PARA NUNCA QUEDAR ATRAPADO
       ======================================================== -->
  <button id="universalExitBtn" onclick="forceReturnToHome()" 
    class="fixed top-3 left-3 z-[9999] flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 border-2 border-sky-500/70 hover:border-sky-400 text-white font-bold text-xs shadow-2xl shadow-sky-950/80 backdrop-blur-md transition-all cursor-pointer group active:scale-95"
    title="Volver al Menú Principal">
    <span class="text-sky-400 text-sm group-hover:-translate-x-1 transition-transform">←</span>
    <span>Volver al Menú Principal</span>
  </button>

  ${target1}`;

if (!code.includes('id="universalExitBtn"')) {
  code = code.replace(target1, replacement1);
  console.log('✅ Added universalExitBtn');
} else {
  console.log('universalExitBtn already present');
}

console.log('--- PATCH 2: CANCEL BUTTON IN LOADING SCREEN ---');
const target2 = '<span id="portalLoadingPercent" class="text-[10px] font-mono text-slate-400 mt-2">25%</span>\n    </div>\n  </div>';
const replacement2 = `<span id="portalLoadingPercent" class="text-[10px] font-mono text-slate-400 mt-2">25%</span>

      <!-- Botón directo de cancelación dentro de la tarjeta de carga -->
      <button onclick="forceReturnToHome()" class="mt-5 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-2 shadow-lg">
        <span class="text-amber-400">←</span>
        <span>Cancelar Carga y Volver al Menú</span>
      </button>
    </div>
  </div>`;

if (!code.includes('Cancelar Carga y Volver al Menú')) {
  code = code.replace(target2, replacement2);
  console.log('✅ Added cancel button in loading screen');
} else {
  console.log('Cancel button already present');
}

console.log('--- PATCH 3: MODAL HEADERS BACK BUTTONS ---');
// In glossaryModal
const glossaryTarget = '<div class="flex items-center gap-2">\n          <button onclick="downloadActiveGlossaryPdf()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-amber-600/30">\n            📄 Descargar PDF\n          </button>\n          <button onclick="closeGlossaryModal()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base">\n            &times;\n          </button>\n        </div>';
const glossaryReplacement = `<div class="flex items-center gap-2">
          <button onclick="downloadActiveGlossaryPdf()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-amber-600/30">
            📄 Descargar PDF
          </button>
          <button onclick="closeGlossaryModal()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer" title="Cerrar y Volver">
            <span class="text-amber-400 font-bold">←</span>
            <span>Volver</span>
          </button>
          <button onclick="closeGlossaryModal()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base">
            &times;
          </button>
        </div>`;
if (code.includes(glossaryTarget)) {
  code = code.replace(glossaryTarget, glossaryReplacement);
  console.log('✅ Added "← Volver" button to glossaryModal header');
}

// In learningMissionModal
const missionTarget = '<button onclick="closeMissionModal()" class="text-slate-400 hover:text-white text-base cursor-pointer">&times;</button>';
const missionReplacement = `<div class="flex items-center gap-2">
        <button onclick="closeMissionModal()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer" title="Cerrar y Volver">
          <span class="text-amber-400 font-bold">←</span>
          <span>Volver</span>
        </button>
        <button onclick="closeMissionModal()" class="text-slate-400 hover:text-white text-base cursor-pointer">&times;</button>
      </div>`;
if (code.includes(missionTarget)) {
  code = code.replace(missionTarget, missionReplacement);
  console.log('✅ Added "← Volver" button to learningMissionModal header');
}

console.log('--- PATCH 4: forceReturnToHome AND showView FUNCTION ---');
const forceReturnFn = `
    // BOTÓN UNIVERSAL DE RETORNO / CANCELACIÓN INMEDIATA (Z-INDEX 9999)
    function forceReturnToHome() {
      console.log('[UniversalExit] Forzando regreso al Menú Principal');
      window.isTransitioningView = false;
      if (window.portalLoadingTimeout) {
        clearTimeout(window.portalLoadingTimeout);
        window.portalLoadingTimeout = null;
      }
      if (window.portalSafetyTimeout) {
        clearTimeout(window.portalSafetyTimeout);
        window.portalSafetyTimeout = null;
      }

      const loader = document.getElementById('portalLoadingScreen');
      if (loader) {
        loader.classList.add('opacity-0', 'pointer-events-none');
        loader.classList.remove('opacity-100');
        loader.style.display = 'none';
      }

      if (typeof closeGlossaryModal === 'function') closeGlossaryModal();
      if (typeof closeMissionModal === 'function') closeMissionModal();
      if (typeof closeRouletteModal === 'function') closeRouletteModal();
      if (typeof closeProfileModal === 'function') closeProfileModal();

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      showView('view-home');
      updateUserExpDisplay();
      updateCoverFlowVisuals();
      showToast('Regresaste al Menú Principal', 'info');
    }
`;

if (!code.includes('function forceReturnToHome')) {
  const showViewIdx = code.indexOf('function showView(viewId)');
  code = code.substring(0, showViewIdx) + forceReturnFn + '\n    ' + code.substring(showViewIdx);
  console.log('✅ Added forceReturnToHome function');
}

// Update showView to toggle universalExitBtn
const showViewTarget = `      // Estrellas del portal sólo en view-home
      if (viewId === 'view-home') {
        startPortalStars();
      } else {
        stopPortalStars();
      }`;

const showViewReplacement = `      // Botón universal: se oculta sólo cuando ya estamos en el Menú Principal
      const universalBtn = document.getElementById('universalExitBtn');
      if (universalBtn) {
        if (viewId === 'view-home') {
          universalBtn.classList.add('hidden');
        } else {
          universalBtn.classList.remove('hidden');
        }
      }

      // Estrellas del portal sólo en view-home
      if (viewId === 'view-home') {
        startPortalStars();
      } else {
        stopPortalStars();
      }`;

if (code.includes(showViewTarget)) {
  code = code.replace(showViewTarget, showViewReplacement);
  console.log('✅ Updated showView for universalExitBtn visibility');
}

console.log('--- PATCH 5: openPortalWithLoader WITH 2-SECOND TIMEOUT FALLBACK ---');
const oldOpenPortalIdx = code.indexOf('function openPortalWithLoader(targetModule)');
const nextFunctionIdx = code.indexOf('function renderCoverFlowPortals()');

const newOpenPortalFn = `function openPortalWithLoader(targetModule) {
      if (window.isTransitioningView) {
        window.isTransitioningView = false;
      }
      window.isTransitioningView = true;

      const loader = document.getElementById('portalLoadingScreen');
      const progressBar = document.getElementById('portalLoadingProgressBar');
      const percentEl = document.getElementById('portalLoadingPercent');
      const subtitleEl = document.getElementById('portalLoadingSubtitle');
      const glowEl = document.getElementById('portalLoadingGlow');
      const iconEl = document.getElementById('portalLoadingIcon');
      const universalBtn = document.getElementById('universalExitBtn');

      // Botón universal siempre visible durante la carga (z-index 9999)
      if (universalBtn) universalBtn.classList.remove('hidden');

      const meta = {
        path: { title: 'Learning Path', sub: 'Cargando módulos de vocabulario y misiones...', glow: 'rgba(245, 158, 11, 0.4)', icon: '🌌', view: 'view-path' },
        stories: { title: 'Cuentos Clásicos', sub: 'Sincronizando 6 obras ilustradas y Speaking Coach...', glow: 'rgba(16, 185, 129, 0.4)', icon: '🌲', view: 'view-stories' },
        music: { title: 'Music Session', sub: 'Conectando reproductor interactivo y karaoke...', glow: 'rgba(6, 182, 212, 0.4)', icon: '⚡', view: 'view-music' },
        worldtour: { title: 'World Tour 3D', sub: 'Instanciando escena 3D procedural y objetos nativos...', glow: 'rgba(168, 85, 247, 0.4)', icon: '🪐', view: 'view-worldtour' }
      }[targetModule] || { title: 'Módulo', sub: 'Cargando...', glow: 'rgba(56, 189, 248, 0.4)', icon: '🚀', view: 'view-path' };

      if (subtitleEl) subtitleEl.textContent = meta.sub;
      if (glowEl) glowEl.style.backgroundColor = meta.glow;
      if (iconEl) iconEl.textContent = meta.icon;

      if (loader) {
        loader.style.display = 'flex';
        loader.classList.remove('opacity-0', 'pointer-events-none');
        loader.classList.add('opacity-100');
      }

      if (progressBar) progressBar.style.width = '35%';
      if (percentEl) percentEl.textContent = '35%';

      // TEMPORIZADOR DE SEGURIDAD (TIMEOUT FALLBACK DE 2 SEGUNDOS)
      if (window.portalSafetyTimeout) clearTimeout(window.portalSafetyTimeout);
      window.portalSafetyTimeout = setTimeout(() => {
        console.warn('[Timeout Fallback 2s] Ocultando pantalla de carga automáticamente y mostrando módulo.');
        if (loader) {
          loader.classList.add('opacity-0', 'pointer-events-none');
          loader.classList.remove('opacity-100');
          loader.style.display = 'none';
        }
        window.isTransitioningView = false;
        showView(meta.view);
        if (targetModule === 'worldtour') {
          try { initThreeWorldTour(); } catch (err) { console.error('Fallback initThreeWorldTour:', err); }
        }
      }, 2000);

      if (targetModule === 'worldtour') {
        // Carga procedural síncrona en memoria (<300ms) sin loaders pesados ni URLs remotas
        showView('view-worldtour');
        setTimeout(() => {
          if (progressBar) progressBar.style.width = '75%';
          if (percentEl) percentEl.textContent = '75%';

          try {
            initThreeWorldTour();
          } catch (e) {
            console.error('Error inicializando Three.js procedural:', e);
          }

          if (progressBar) progressBar.style.width = '100%';
          if (percentEl) percentEl.textContent = '100%';

          setTimeout(() => {
            if (loader) {
              loader.classList.add('opacity-0', 'pointer-events-none');
              loader.classList.remove('opacity-100');
              loader.style.display = 'none';
            }
            if (window.portalSafetyTimeout) {
              clearTimeout(window.portalSafetyTimeout);
              window.portalSafetyTimeout = null;
            }
            window.isTransitioningView = false;
          }, 120);
        }, 50);
      } else {
        setTimeout(() => {
          if (progressBar) progressBar.style.width = '75%';
          if (percentEl) percentEl.textContent = '75%';

          showView(meta.view);
          if (targetModule === 'stories') renderStorySelector();
          if (targetModule === 'music') renderMusicTracksList();
          if (targetModule === 'path') renderLearningModules();

          if (progressBar) progressBar.style.width = '100%';
          if (percentEl) percentEl.textContent = '100%';

          setTimeout(() => {
            if (loader) {
              loader.classList.add('opacity-0', 'pointer-events-none');
              loader.classList.remove('opacity-100');
              loader.style.display = 'none';
            }
            if (window.portalSafetyTimeout) {
              clearTimeout(window.portalSafetyTimeout);
              window.portalSafetyTimeout = null;
            }
            window.isTransitioningView = false;
          }, 150);
        }, 120);
      }
    }

    `;

code = code.substring(0, oldOpenPortalIdx) + newOpenPortalFn + code.substring(nextFunctionIdx);
console.log('✅ Updated openPortalWithLoader with safe 2-second timeout and procedural flow');

console.log('--- PATCH 6: 3D SCENE PROCEDURAL CONSTRUCTION ---');
const oldInitThreeIdx = code.indexOf('function initThreeWorldTour()');
const nextAfterThreeIdx = code.indexOf('function onThreeCanvasClick(event)');

const newThreeProcedural = `function initThreeWorldTour() {
      const container = document.getElementById('threeCanvasContainer');
      if (!container) return;

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

      // 2. Cámara (frente a la sala donde están el sofá, la mesa y la TV)
      threeCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      threeCamera.position.set(-3.8, 2.2, 1.8);
      threeCamera.lookAt(-4.0, 1.3, -3.8);

      // 3. Renderer con WebGL nativo
      threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      threeRenderer.setClearColor(0x0f172a, 1);
      threeRenderer.setSize(width, height);
      threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      threeRenderer.shadowMap.enabled = true;
      threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = '';
      container.appendChild(threeRenderer.domElement);

      // 4. Iluminación Visible Inmediata
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      threeScene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffedd5, 1.8);
      dirLight.position.set(5, 10, 5);
      dirLight.castShadow = true;
      threeScene.add(dirLight);

      const ceilingLight = new THREE.PointLight(0xfef08a, 1.6, 14);
      ceilingLight.position.set(-4, 3.2, -4);
      threeScene.add(ceilingLight);

      const lampLight = new THREE.PointLight(0xffedd5, 1.4, 8);
      lampLight.position.set(-5.5, 1.8, -5.5);
      threeScene.add(lampLight);

      // 5. Construcción de la Casa Realista
      buildRealisticHouse();

      // 6. Raycaster
      threeRaycaster = new THREE.Raycaster();
      threePointer = new THREE.Vector2();

      container.addEventListener('click', onThreeCanvasClick);

      // 7. ResizeObserver
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

      // Render inicial inmediato
      threeRenderer.render(threeScene, threeCamera);

      // 8. Bucle de Render
      function animate3D() {
        requestAnimationFrame(animate3D);
        if (threeRenderer && threeScene && threeCamera && currentActiveView === 'view-worldtour') {
          threeRenderer.render(threeScene, threeCamera);
        }
      }
      animate3D();
      isThreeInitialized = true;
    }

    function buildRealisticHouse() {
      // Piso amplio de madera duela brillante
      const floorGeo = new THREE.PlaneGeometry(20, 20);
      const floorMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.35, metalness: 0.1 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      threeScene.add(floor);

      // Pared trasera
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
      const backWallGeo = new THREE.BoxGeometry(20, 5.0, 0.3);
      const backWall = new THREE.Mesh(backWallGeo, wallMat);
      backWall.position.set(0, 2.5, -8.5);
      threeScene.add(backWall);

      // Pared izquierda
      const leftWallGeo = new THREE.BoxGeometry(0.3, 5.0, 20);
      const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
      leftWall.position.set(-8.5, 2.5, 0);
      threeScene.add(leftWall);

      // Pared derecha
      const rightWall = new THREE.Mesh(leftWallGeo, wallMat);
      rightWall.position.set(8.5, 2.5, 0);
      threeScene.add(rightWall);

      // Ventana con exterior iluminado
      const winGeo = new THREE.PlaneGeometry(3.5, 2.2);
      const winMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const windowMesh = new THREE.Mesh(winGeo, winMat);
      windowMesh.position.set(-7.0, 2.5, -8.3);
      threeScene.add(windowMesh);

      // Zoclos de madera en la base de la pared trasera
      const baseboardGeo = new THREE.BoxGeometry(20, 0.2, 0.08);
      const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
      const baseboard = new THREE.Mesh(baseboardGeo, baseboardMat);
      baseboard.position.set(0, 0.1, -8.32);
      threeScene.add(baseboard);

      // Instanciar los 15 Objetos Interactivos procedurally sin llamadas remotas
      threeInteractiveMeshes = [];
      const objects = (WORLD_TOUR_SCENARIOS && WORLD_TOUR_SCENARIOS.house && WORLD_TOUR_SCENARIOS.house.objects) || [];

      objects.forEach(objData => {
        try {
          const mesh = build3DObjectGeometry(objData);
          if (mesh) {
            mesh.userData = objData;
            threeScene.add(mesh);
            threeInteractiveMeshes.push(mesh);
          }
        } catch (err) {
          console.error('Error instanciando objeto 3D ' + objData.id, err);
        }
      });
    }

    function safeGetPosition(pos) {
      if (!pos) return { x: 0, y: 0, z: 0 };
      const x = typeof pos.x === 'number' ? pos.x : (Array.isArray(pos) && typeof pos[0] === 'number' ? pos[0] : 0);
      const y = typeof pos.y === 'number' ? pos.y : (Array.isArray(pos) && typeof pos[1] === 'number' ? pos[1] : 0);
      const z = typeof pos.z === 'number' ? pos.z : (Array.isArray(pos) && typeof pos[2] === 'number' ? pos[2] : 0);
      return { x, y, z };
    }

    function safeGetScale(scale) {
      if (!scale) return { x: 0.6, y: 0.6, z: 0.6 };
      const x = typeof scale.x === 'number' ? scale.x : (Array.isArray(scale) && typeof scale[0] === 'number' ? scale[0] : 0.6);
      const y = typeof scale.y === 'number' ? scale.y : (Array.isArray(scale) && typeof scale[1] === 'number' ? scale[1] : 0.6);
      const z = typeof scale.z === 'number' ? scale.z : (Array.isArray(scale) && typeof scale[2] === 'number' ? scale[2] : 0.6);
      return { x, y, z };
    }

    function build3DObjectGeometry(obj) {
      const group = new THREE.Group();

      if (obj.id === 'hammock') {
        const fabricGeo = new THREE.CylinderGeometry(0.55, 0.45, 3.2, 16, 1, true, 0, Math.PI);
        const fabricMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, side: THREE.DoubleSide, roughness: 0.6 });
        const fabric = new THREE.Mesh(fabricGeo, fabricMat);
        fabric.rotation.z = Math.PI / 2;
        fabric.position.set(0, 0.3, 0);
        group.add(fabric);

        const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
        const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8), ropeMat);
        r1.rotation.z = -Math.PI / 4;
        r1.position.set(-1.8, 0.7, 0);
        group.add(r1);

        const r2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8), ropeMat);
        r2.rotation.z = Math.PI / 4;
        r2.position.set(1.8, 0.7, 0);
        group.add(r2);
      } else if (obj.id === 'sofa') {
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 1.1), new THREE.MeshStandardMaterial({ color: 0x475569 }));
        base.position.y = 0.25;
        const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 0.3), new THREE.MeshStandardMaterial({ color: 0x334155 }));
        back.position.set(0, 0.65, -0.4);
        const armL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.5, 1.1), new THREE.MeshStandardMaterial({ color: 0x334155 }));
        armL.position.set(-1.2, 0.45, 0);
        const armR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.5, 1.1), new THREE.MeshStandardMaterial({ color: 0x334155 }));
        armR.position.set(1.2, 0.45, 0);
        group.add(base, back, armL, armR);
      } else if (obj.id === 'cushion') {
        const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.15), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 }));
        group.add(cushion);
      } else if (obj.id === 'coffee_table') {
        const top = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.06, 24), new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.4 }));
        top.position.y = 0.3;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        leg.position.y = 0.15;
        group.add(top, leg);
      } else if (obj.id === 'coffee_mug') {
        const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.12, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
        group.add(mug);
      } else if (obj.id === 'television') {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.3, 0.06), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 }));
        const screen = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.07), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.5 }));
        group.add(frame, screen);
      } else if (obj.id === 'bookshelf') {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 0.35), new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 }));
        group.add(frame);
      } else if (obj.id === 'rug') {
        const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.2), new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.9 }));
        rug.rotation.x = -Math.PI / 2;
        group.add(rug);
      } else if (obj.id === 'ceiling_fan') {
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        for (let i = 0; i < 4; i++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 0.18), new THREE.MeshStandardMaterial({ color: 0x78350f }));
          blade.rotation.y = (i * Math.PI) / 2;
          blade.position.x = Math.cos((i * Math.PI) / 2) * 0.5;
          blade.position.z = Math.sin((i * Math.PI) / 2) * 0.5;
          hub.add(blade);
        }
        group.add(hub);
      } else if (obj.id === 'hanging_lamp') {
        const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        wire.position.y = 0.4;
        const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.35, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 }));
        group.add(wire, shade);
      } else if (obj.id === 'floor_lamp') {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        pole.position.y = 0.9;
        const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.4), new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.5 }));
        shade.position.y = 1.7;
        group.add(base, pole, shade);
      } else if (obj.id === 'light_switch') {
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.02), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
        const toggle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.03), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
        group.add(plate, toggle);
      } else if (obj.id === 'curtain') {
        const drape = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.2, 0.15), new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.7 }));
        group.add(drape);
      } else if (obj.id === 'door_lock') {
        const escutcheon = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.03), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 }));
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.04), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 }));
        handle.position.set(0.06, 0.04, 0.02);
        group.add(escutcheon, handle);
      } else if (obj.id === 'wall_crack') {
        const crack = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 0.02), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
        group.add(crack);
      } else {
        const s = safeGetScale(obj.scale);
        const geo = new THREE.BoxGeometry(s.x, s.y, s.z);
        const mat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });
        group.add(new THREE.Mesh(geo, mat));
      }

      const p = safeGetPosition(obj.pos);
      group.position.set(p.x, p.y, p.z);
      return group;
    }

    `;

code = code.substring(0, oldInitThreeIdx) + newThreeProcedural + code.substring(nextAfterThreeIdx);
console.log('✅ Updated initThreeWorldTour & build3DObjectGeometry with 100% procedural safe meshes');

fs.writeFileSync('scripts/build_unified_app_v2.js', code, 'utf8');
console.log('🎉 scripts/build_unified_app_v2.js successfully patched with all requirements!');

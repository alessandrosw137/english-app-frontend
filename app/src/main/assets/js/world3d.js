/**
 * World Tour 3D Engine (Three.js WebGL) - MasterENG
 * Sistema integral de renderizado 3D, ciclo de vida WebGL, iluminación PBR,
 * controles de órbita suaves (OrbitControls) y modelado procedural de Casa & Jardín.
 * 
 * Desarrollado por: Wilberth Alessandro Molina Cutz
 */

(function (global) {
  'use strict';

  // ============================================================================
  // 1. ESTADO GLOBAL Y BANDERA DE CICLO DE VIDA
  // ============================================================================
  let isWorldTourActive = true;
  let isEngineInitialized = false;
  let scene = null;
  let camera = null;
  let renderer = null;
  let controls = null;
  let animFrameId = null;
  let lastFrameTime = performance.now();
  let clock = typeof THREE !== 'undefined' ? new THREE.Clock() : null;

  let animatedFan = null;
  let animatedSprinkler = null;
  let interactiveObjects = [];
  let currentScenario = 'house';

  const threeAnimatedObjects = {
    fan: null,
    sprinkler: null,
    steam: []
  };
  global.threeAnimatedObjects = threeAnimatedObjects;

  // ============================================================================
  // 2. ORBIT CONTROLS SUAVES (THREE.OrbitControls) CON LÍMITES POLARES
  // ============================================================================
  if (typeof THREE !== 'undefined' && typeof THREE.OrbitControls === 'undefined') {
    THREE.OrbitControls = function (object, domElement) {
      this.object = object;
      this.domElement = domElement || document;

      this.enabled = true;
      this.target = new THREE.Vector3(0, 1.5, 0);

      this.minDistance = 2.0;
      this.maxDistance = 55.0;

      // Límite de inclinación para que el usuario no traspase el suelo
      this.minPolarAngle = 0.05;
      this.maxPolarAngle = Math.PI / 2.1; // ~1.496 rad (< 90 grados)

      this.enableDamping = true;
      this.dampingFactor = 0.05;

      this.rotateSpeed = 0.85;
      this.zoomSpeed = 1.0;

      const scope = this;
      let isDragging = false;
      const prevMousePos = new THREE.Vector2();
      const deltaMousePos = new THREE.Vector2();

      let touchStartDist = 0;
      let isTouching = false;
      const prevTouchPos = new THREE.Vector2();

      const spherical = {
        radius: 14.0,
        theta: 0.0,
        phi: Math.PI / 3.2
      };
      const sphericalDelta = {
        radius: 0.0,
        theta: 0.0,
        phi: 0.0
      };

      function syncSphericalFromObject() {
        const offset = new THREE.Vector3().copy(scope.object.position).sub(scope.target);
        spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, offset.length()));
        spherical.theta = Math.atan2(offset.x, offset.z);
        spherical.phi = Math.acos(Math.max(-1, Math.min(1, offset.y / (spherical.radius || 0.001))));
      }
      syncSphericalFromObject();

      function onMouseDown(e) {
        if (!scope.enabled) return;
        if (e.button !== 0 && e.button !== 2) return;
        isDragging = true;
        prevMousePos.set(e.clientX, e.clientY);
      }

      function onMouseMove(e) {
        if (!scope.enabled || !isDragging) return;
        deltaMousePos.set(e.clientX - prevMousePos.x, e.clientY - prevMousePos.y);

        const el = scope.domElement === document ? document.body : scope.domElement;
        const w = el.clientWidth || window.innerWidth || 800;
        const h = el.clientHeight || window.innerHeight || 600;

        sphericalDelta.theta -= (2 * Math.PI * deltaMousePos.x / w) * scope.rotateSpeed;
        sphericalDelta.phi -= (2 * Math.PI * deltaMousePos.y / h) * scope.rotateSpeed;

        prevMousePos.set(e.clientX, e.clientY);
      }

      function onMouseUp() {
        isDragging = false;
      }

      function onWheel(e) {
        if (!scope.enabled) return;
        e.preventDefault();
        const factor = e.deltaY < 0 ? 0.90 : 1.10;
        spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius * factor));
      }

      function onTouchStart(e) {
        if (!scope.enabled) return;
        if (e.touches.length === 1) {
          isTouching = true;
          prevTouchPos.set(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e.touches.length === 2) {
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

          const el = scope.domElement === document ? document.body : scope.domElement;
          const w = el.clientWidth || window.innerWidth || 800;
          const h = el.clientHeight || window.innerHeight || 600;

          sphericalDelta.theta -= (2 * Math.PI * deltaMousePos.x / w) * scope.rotateSpeed;
          sphericalDelta.phi -= (2 * Math.PI * deltaMousePos.y / h) * scope.rotateSpeed;

          prevTouchPos.set(clientX, clientY);
        } else if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.hypot(dx, dy);
          if (touchStartDist > 0) {
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

      const dom = scope.domElement;
      dom.addEventListener('mousedown', onMouseDown, { passive: true });
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseup', onMouseUp, { passive: true });
      dom.addEventListener('wheel', onWheel, { passive: false });
      dom.addEventListener('touchstart', onTouchStart, { passive: true });
      dom.addEventListener('touchmove', onTouchMove, { passive: true });
      dom.addEventListener('touchend', onTouchEnd, { passive: true });

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
      };
    };
  }

  // ============================================================================
  // 3. PALETA DE MATERIALES PBR REUTILIZADOS (SHARED_MATERIALS)
  // ============================================================================
  const SHARED_MATERIALS = {};
  function initSharedMaterials() {
    if (typeof THREE === 'undefined' || Object.keys(SHARED_MATERIALS).length > 0) return SHARED_MATERIALS;
    const defs = {
      // Suelos y Arquitectura
    grassLawn: new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.85, metalness: 0.05 }),
    houseFloor: new THREE.MeshStandardMaterial({ color: 0xc2a679, roughness: 0.45, metalness: 0.1 }),
    wallSatin: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.85, metalness: 0.02 }),
    crownWhite: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.40, metalness: 0.05 }),
    baseboardWood: new THREE.MeshStandardMaterial({ color: 0x3b1d0e, roughness: 0.45, metalness: 0.08 }),

    // Maderas Nobiliarias
    woodOak: new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.52, metalness: 0.08 }),
    woodWalnut: new THREE.MeshStandardMaterial({ color: 0x3b1d0e, roughness: 0.45, metalness: 0.10 }),
    woodDark: new THREE.MeshStandardMaterial({ color: 0x241206, roughness: 0.48, metalness: 0.10 }),
    woodPine: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.50, metalness: 0.06 }),
    woodLight: new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.50, metalness: 0.05 }),

    // Metales y Estructuras
    metalDark: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.85 }),
    metalChrome: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.15, metalness: 0.95 }),
    metalBrass: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.28, metalness: 0.88 }),
    ironBlack: new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.45, metalness: 0.85 }),

    // Telas y Tapicería
    fabricBlue: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.60, metalness: 0.10 }),
    fabricGold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.60, metalness: 0.12 }),
    fabricTerracotta: new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.62, metalness: 0.10 }),
    leatherDark: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.68, metalness: 0.15 }),

    // Naturaleza y Vegetación
    trunkBark: new THREE.MeshStandardMaterial({ color: 0x3e2312, roughness: 0.85, metalness: 0.05 }),
    leafGreen1: new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.80, metalness: 0.0 }),
    leafGreen2: new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.80, metalness: 0.0 }),
    leafGreen3: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.80, metalness: 0.0 }),
    leafGreen4: new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.82, metalness: 0.0 }),
    grassBlade: new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.75, metalness: 0.0 }),
    flowerRed: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45, metalness: 0.1 }),
    flowerYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.45, metalness: 0.1 }),
    flowerPink: new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.45, metalness: 0.1 }),
    flowerLavender: new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.45, metalness: 0.1 }),

    // Albañilería, Piedra y Cerámica
    stoneGray: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.70, metalness: 0.10 }),
    stonePaver: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75, metalness: 0.05 }),
    picketWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.60, metalness: 0.02 }),
    ceramicWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.18, metalness: 0.05 }),
    terracottaPot: new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.75, metalness: 0.05 }),

    // Vidrio, Vapor y Emisión
    glassClear: new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.10, metalness: 0.10, transparent: true, opacity: 0.55 }),
    glassLantern: new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.12, metalness: 0.10, transparent: true, opacity: 0.65 }),
    emissiveScreen: new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x38bdf8, emissiveIntensity: 0.85, roughness: 0.25 }),
    emissiveBulb: new THREE.MeshStandardMaterial({ color: 0xffedd5, emissive: 0xfef08a, emissiveIntensity: 2.2, roughness: 0.2 }),
    steamTranslucent: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.90, transparent: true, opacity: 0.35 })
    };
    Object.assign(SHARED_MATERIALS, defs);
    return SHARED_MATERIALS;
  }
  if (typeof THREE !== 'undefined') initSharedMaterials();

  // ============================================================================
  // 4. TEXTURAS PROCEDURALES EN MEMORIA (CANVAS 2D)
  // ============================================================================
  let cachedWoodTexture = null;
  function createOakWoodTexture() {
    if (cachedWoodTexture) return cachedWoodTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#5c3a21'; ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 64) {
      ctx.fillStyle = (y / 64) % 2 === 0 ? 'rgba(215, 175, 130, 0.12)' : 'rgba(30, 18, 10, 0.16)';
      ctx.fillRect(0, y, 512, 64);
      ctx.strokeStyle = 'rgba(20, 10, 5, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    cachedWoodTexture = tex;
    return tex;
  }

  let cachedGrassTexture = null;
  function createGrassTexture() {
    if (cachedGrassTexture) return cachedGrassTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2d5a27'; ctx.fillRect(0, 0, 256, 256);
    const colors = ['#1e4620', '#356d2e', '#234f24', '#417d38'];
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    cachedGrassTexture = tex;
    return tex;
  }

  let cachedBlackboardTexture = null;
  function createBlackboardTexture() {
    if (cachedBlackboardTexture) return cachedBlackboardTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#143827'; ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, 488, 232);
    ctx.font = 'bold 24px sans-serif'; ctx.fillStyle = '#fef08a';
    ctx.fillText("TODAY'S ENGLISH LESSON", 32, 54);
    ctx.font = '19px sans-serif'; ctx.fillStyle = '#f8fafc';
    ctx.fillText("1. House & Garden 3D Exploration", 32, 98);
    ctx.fillText("2. Desk, Chair, Monitor & Lamp", 32, 136);
    ctx.fillText("3. Speaking Practice (+50 EXP)", 32, 174);
    ctx.font = 'italic 16px sans-serif'; ctx.fillStyle = '#6ee7b7';
    ctx.fillText("★ Fluency Goal: 100% Pronunciation Accuracy", 32, 218);
    const tex = new THREE.CanvasTexture(canvas);
    cachedBlackboardTexture = tex;
    return tex;
  }

  let cachedLaptopScreenTexture = null;
  function createLaptopScreenTexture() {
    if (cachedLaptopScreenTexture) return cachedLaptopScreenTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 160;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, 256, 160);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, 256, 22);
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(10, 11, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(22, 11, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(34, 11, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 11px monospace';
    ctx.fillText('EnglishLesson.ts', 50, 15);
    const lines = [
      { c: '#818cf8', t: 'import { speak } from "coach";' },
      { c: '#38bdf8', t: 'const student = new EnglishLearner();' },
      { c: '#34d399', t: 'student.practiceVocabulary({ world: "3D" });' },
      { c: '#fcd34d', t: 'student.addExp(50); // Level Up!' },
      { c: '#f472b6', t: 'console.log("Pronunciation: 100%");' }
    ];
    lines.forEach((l, idx) => {
      ctx.fillStyle = l.c;
      ctx.font = '9px monospace';
      ctx.fillText(l.t, 16, 44 + idx * 18);
    });
    ctx.fillStyle = '#0284c7'; ctx.fillRect(0, 144, 256, 16);
    ctx.fillStyle = '#f8fafc'; ctx.font = '8px sans-serif';
    ctx.fillText('⚡ English Code: Fluency 100% ★ (+50 EXP)', 10, 155);
    const tex = new THREE.CanvasTexture(canvas);
    cachedLaptopScreenTexture = tex;
    return tex;
  }

  let cachedPaintingTexture = null;
  function createPaintingTexture() {
    if (cachedPaintingTexture) return cachedPaintingTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 160;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 160);
    grad.addColorStop(0, '#38bdf8'); grad.addColorStop(0.6, '#fde047');
    grad.addColorStop(0.75, '#fb923c'); grad.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 256, 160);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, 160); ctx.lineTo(40, 105); ctx.lineTo(95, 125); ctx.lineTo(160, 85); ctx.lineTo(215, 115); ctx.lineTo(256, 95); ctx.lineTo(256, 160);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.beginPath(); ctx.arc(160, 75, 16, 0, Math.PI * 2); ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    cachedPaintingTexture = tex;
    return tex;
  }

  let cachedClockTexture = null;
  function createClockFaceTexture() {
    if (cachedClockTexture) return cachedClockTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(128, 128, 120, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 6; ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(128 + Math.sin(angle) * 96, 128 - Math.cos(angle) * 96);
      ctx.lineTo(128 + Math.sin(angle) * 110, 128 - Math.cos(angle) * 110);
      ctx.lineWidth = i % 3 === 0 ? 5 : 2;
      ctx.stroke();
    }
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(128, 128); ctx.lineTo(82, 82); ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(128, 128); ctx.lineTo(174, 82); ctx.stroke();
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(128, 128); ctx.lineTo(128, 48); ctx.stroke();
    const tex = new THREE.CanvasTexture(canvas);
    cachedClockTexture = tex;
    return tex;
  }

  let cachedRugTexture = null;
  function createRugTexture() {
    if (cachedRugTexture) return cachedRugTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f766e'; ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#2dd4bf'; ctx.lineWidth = 6; ctx.strokeRect(12, 12, 232, 232);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3; ctx.strokeRect(24, 24, 208, 208);
    const tex = new THREE.CanvasTexture(canvas);
    cachedRugTexture = tex;
    return tex;
  }

  // ============================================================================
  // 5. CONSTRUCCIÓN DE ESCENARIO DETALLADO (CASA Y JARDÍN)
  // ============================================================================
  function buildDetailedHouseAndGarden(targetScene) {
    interactiveObjects = [];
    const M = initSharedMaterials();

    // ----------------------------------------------------
    // A. SUELO EXTERIOR: Plano amplio verde pasto (0x2d5a27)
    // ----------------------------------------------------
    const lawnGeo = new THREE.PlaneGeometry(90, 90, 8, 8);
    const lawn = new THREE.Mesh(lawnGeo, M.grassLawn);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.y = 0;
    lawn.receiveShadow = true;
    targetScene.add(lawn);

    // ----------------------------------------------------
    // B. SUELO INTERIOR (CASA): Plataforma elevada texturizada clara (0xc2a679)
    // ----------------------------------------------------
    const housePlatform = new THREE.Mesh(new THREE.BoxGeometry(14.0, 0.22, 12.0), M.houseFloor);
    housePlatform.position.set(0, 0.11, -1.0);
    housePlatform.receiveShadow = true;
    targetScene.add(housePlatform);

    // ----------------------------------------------------
    // C. PAREDES Y ESTRUCTURA CON ABERTURAS Y MOLDURAS
    // ----------------------------------------------------
    const wallGroup = new THREE.Group();

    // Pared trasera (Z = -7.0)
    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(14.0, 3.8, 0.25), M.wallSatin);
    wallBack.position.set(0, 2.01, -7.0);
    wallBack.castShadow = true; wallBack.receiveShadow = true;

    // Pared lateral izquierda (X = -7.0) con abertura para ventana
    const wallLeftA = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.8, 4.0), M.wallSatin);
    wallLeftA.position.set(-7.0, 2.01, -5.0);
    const wallLeftB = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.8, 4.0), M.wallSatin);
    wallLeftB.position.set(-7.0, 2.01, 3.0);
    const wallLeftTop = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.2, 4.0), M.wallSatin);
    wallLeftTop.position.set(-7.0, 3.31, -1.0);
    const wallLeftBottom = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 4.0), M.wallSatin);
    wallLeftBottom.position.set(-7.0, 0.61, -1.0);

    // Cristal de ventana izquierda
    const winLeft = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 1.6), M.glassClear);
    winLeft.rotation.y = Math.PI / 2;
    winLeft.position.set(-7.0, 1.91, -1.0);

    // Pared lateral derecha (X = 7.0)
    const wallRightA = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.8, 5.0), M.wallSatin);
    wallRightA.position.set(7.0, 2.01, -4.5);
    const wallRightB = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.8, 5.0), M.wallSatin);
    wallRightB.position.set(7.0, 2.01, 2.5);
    const wallRightTop = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.2, 2.0), M.wallSatin);
    wallRightTop.position.set(7.0, 3.31, -1.0);

    // Pared frontal (Z = 5.0) con vano amplio de entrada hacia el jardín
    const wallFrontA = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.8, 0.25), M.wallSatin);
    wallFrontA.position.set(-4.6, 2.01, 5.0);
    const wallFrontB = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.8, 0.25), M.wallSatin);
    wallFrontB.position.set(4.6, 2.01, 5.0);
    const wallFrontTop = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.0, 0.25), M.wallSatin);
    wallFrontTop.position.set(0, 3.41, 5.0);

    // Molduras perimetrales de yeso (Crown molding)
    const crown1 = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.12, 0.18), M.crownWhite);
    crown1.position.set(0, 3.85, -6.9);
    const crown2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 12.2), M.crownWhite);
    crown2.position.set(-6.9, 3.85, -1.0);
    const crown3 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 12.2), M.crownWhite);
    crown3.position.set(6.9, 3.85, -1.0);

    // Zócalos de madera (Baseboards)
    const base1 = new THREE.Mesh(new THREE.BoxGeometry(13.8, 0.16, 0.05), M.baseboardWood);
    base1.position.set(0, 0.30, -6.85);

    wallGroup.add(
      wallBack, wallLeftA, wallLeftB, wallLeftTop, wallLeftBottom, winLeft,
      wallRightA, wallRightB, wallRightTop,
      wallFrontA, wallFrontB, wallFrontTop,
      crown1, crown2, crown3, base1
    );
    targetScene.add(wallGroup);

    // ----------------------------------------------------
    // D. MUEBLES INTERIORES (ESTUDIO Y SALA)
    // ----------------------------------------------------

    // 1. ESCRITORIO DE MADERA CON PATAS METÁLICAS BISELADAS
    const deskGroup = new THREE.Group();
    deskGroup.name = "Study Desk";
    deskGroup.userData = { id: 'desk', en: 'Study Desk', ipa: '/ˈstʌd.i desk/', es: 'Escritorio de madera con patas metálicas biseladas' };

    const desktop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 1.0), M.woodOak);
    desktop.position.set(0, 0.96, 0);
    desktop.castShadow = true; desktop.receiveShadow = true;

    // 4 Patas biseladas cónicas de metal con regatones de latón
    const deskLegCoords = [[-0.88, -0.4], [0.88, -0.4], [-0.88, 0.4], [0.88, 0.4]];
    deskLegCoords.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.016, 0.92, 12), M.metalDark);
      leg.position.set(lx, 0.46, lz);
      leg.castShadow = true;
      const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.06, 12), M.metalBrass);
      ferrule.position.set(lx, 0.03, lz);
      deskGroup.add(leg, ferrule);
    });

    // Cajonera lateral de madera maciza
    const drawerBlock = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.58, 0.88), M.woodOak);
    drawerBlock.position.set(0.68, 0.60, 0);
    drawerBlock.castShadow = true;
    const h1 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 8), M.metalBrass);
    h1.rotation.z = Math.PI / 2; h1.position.set(0.68, 0.72, 0.45);
    const h2 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 8), M.metalBrass);
    h2.rotation.z = Math.PI / 2; h2.position.set(0.68, 0.48, 0.45);
    deskGroup.add(desktop, drawerBlock, h1, h2);

    // 2. MONITOR ESTILIZADO CON PANTALLA EMISIVA BRILLANTE (CÓDIGO/LECCIÓN)
    const monitorGroup = new THREE.Group();
    monitorGroup.name = "Computer Monitor";
    monitorGroup.userData = { id: 'monitor', en: 'Computer Monitor', ipa: '/kəmˈpjuː.t̬ɚ ˈmɑː.nə.t̬ɚ/', es: 'Monitor estilizado con pantalla emisiva brillante' };

    const mBase = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.014, 20), M.metalDark);
    mBase.position.set(0, 1.01, -0.15);
    const mStand = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.36, 12), M.metalChrome);
    mStand.position.set(0, 1.18, -0.15);
    const mFrame = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.52, 0.024), M.metalDark);
    mFrame.position.set(0, 1.42, -0.14);
    mFrame.castShadow = true;

    const screenTex = createLaptopScreenTexture();
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTex,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.85,
      roughness: 0.2
    });
    const mScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.48), screenMat);
    mScreen.position.set(0, 1.42, -0.125);
    monitorGroup.add(mBase, mStand, mFrame, mScreen);
    deskGroup.add(monitorGroup);

    // 3. TECLADO, MOUSE Y LÁMPARA DE ESCRITORIO
    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.012, 0.16), M.metalDark);
    keyboard.position.set(0, 1.01, 0.15);
    const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.018, 0.11), M.metalDark);
    mouse.position.set(0.36, 1.01, 0.15);

    // Lámpara de escritorio articulada de latón
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.02, 16), M.metalBrass);
    lampBase.position.set(-0.75, 1.01, -0.15);
    const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.42, 8), M.metalBrass);
    lampArm.rotation.z = -0.3; lampArm.position.set(-0.70, 1.20, -0.15);
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.16, 16, 1, true), M.metalBrass);
    lampShade.rotation.z = -Math.PI * 0.45; lampShade.position.set(-0.60, 1.36, -0.15);
    const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), M.emissiveBulb);
    lampBulb.position.set(-0.60, 1.34, -0.15);
    deskGroup.add(keyboard, mouse, lampBase, lampArm, lampShade, lampBulb);

    deskGroup.position.set(3.5, 0.11, -3.2);
    targetScene.add(deskGroup);
    interactiveObjects.push(deskGroup);

    // 4. SILLA DE OFICINA ERGONÓMICA CON SOPORTE CURVO
    const chairGroup = new THREE.Group();
    chairGroup.name = "Ergonomic Office Chair";
    chairGroup.userData = { id: 'chair', en: 'Ergonomic Office Chair', ipa: '/ˌɝː.ɡəˈnɑː.mɪk tʃer/', es: 'Silla de oficina ergonómica con respaldo curvo' };

    const cSeat = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.10, 0.54), M.fabricBlue);
    cSeat.position.set(0, 0.60, 0); cSeat.castShadow = true;

    const cBackGeo = new THREE.CylinderGeometry(0.30, 0.30, 0.52, 18, 1, true, -Math.PI * 0.35, Math.PI * 0.7);
    const cBack = new THREE.Mesh(cBackGeo, new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.55, side: THREE.DoubleSide }));
    cBack.position.set(0, 0.90, -0.06); cBack.castShadow = true;

    const cPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.36, 12), M.metalChrome);
    cPillar.position.set(0, 0.38, 0);

    // Base estrella de 5 radios con ruedas a nivel de suelo
    for (let i = 0; i < 5; i++) {
      const ang = (i * Math.PI * 2) / 5;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.04), M.metalChrome);
      arm.position.set(Math.cos(ang) * 0.13, 0.14, Math.sin(ang) * 0.13);
      arm.rotation.y = -ang;
      const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), M.metalDark);
      wheel.position.set(Math.cos(ang) * 0.26, 0.05, Math.sin(ang) * 0.26);
      chairGroup.add(arm, wheel);
    }
    chairGroup.add(cSeat, cBack, cPillar);
    chairGroup.position.set(3.5, 0.11, -2.0);
    targetScene.add(chairGroup);
    interactiveObjects.push(chairGroup);

    // 5. ESTANTERÍA CON LIBROS DE COLORES INDIVIDUALES EN LOS LOMOS
    const shelfGroup = new THREE.Group();
    shelfGroup.name = "Bookshelf";
    shelfGroup.userData = { id: 'bookshelf', en: 'Bookshelf', ipa: '/ˈbʊk.ʃelf/', es: 'Estantería con libros de colores individuales en los lomos' };

    const sFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.48, 3.2, 0.06), M.woodDark);
    sFrameL.position.set(0, 1.6, -1.0); sFrameL.castShadow = true;
    const sFrameR = new THREE.Mesh(new THREE.BoxGeometry(0.48, 3.2, 0.06), M.woodDark);
    sFrameR.position.set(0, 1.6, 1.0); sFrameR.castShadow = true;
    const sBack = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.2, 2.06), M.woodDark);
    sBack.position.set(-0.24, 1.6, 0); sBack.castShadow = true;
    shelfGroup.add(sFrameL, sFrameR, sBack);

    // 5 baldas horizontales con libros independientes
    const bookColors = [0xdc2626, 0x1e3a8a, 0x059669, 0xd97706, 0x7c3aed, 0x831843, 0xfef3c7, 0x0284c7, 0x0f766e, 0x475569];
    for (let s = 0; s < 5; s++) {
      const sy = 0.25 + s * 0.65;
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 1.96), M.woodDark);
      board.position.set(0, sy, 0);
      shelfGroup.add(board);

      const numBooks = 8;
      for (let b = 0; b < numBooks; b++) {
        const bColor = bookColors[(s * 5 + b) % bookColors.length];
        const bMat = new THREE.MeshStandardMaterial({ color: bColor, roughness: 0.45 });
        const bH = 0.38 + Math.sin(b * 1.8 + s) * 0.08;
        const bThick = 0.048 + (b % 3) * 0.012;
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.34, bH, bThick), bMat);
        const bz = -0.80 + b * 0.23;
        book.position.set(0.04, sy + 0.025 + bH / 2, bz);
        if (b === numBooks - 1 && s % 2 === 1) book.rotation.x = 0.16;
        book.castShadow = true;
        shelfGroup.add(book);
      }
    }
    shelfGroup.position.set(6.7, 0.11, -3.5);
    targetScene.add(shelfGroup);
    interactiveObjects.push(shelfGroup);

    // 6. PIZARRA ESCOLAR CON APUNTES
    const boardGroup = new THREE.Group();
    boardGroup.name = "Chalkboard";
    boardGroup.userData = { id: 'blackboard', en: 'Chalkboard', ipa: '/ˈtʃɑːk.bɔːrd/', es: 'Pizarra con apuntes legibles de inglés' };
    const bFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.45, 0.05), M.woodWalnut);
    bFrame.castShadow = true;
    const bSlate = new THREE.Mesh(new THREE.PlaneGeometry(2.38, 1.33), new THREE.MeshStandardMaterial({ map: createBlackboardTexture(), roughness: 0.65 }));
    bSlate.position.z = 0.028;
    boardGroup.add(bFrame, bSlate);
    boardGroup.position.set(0, 2.3, -6.85);
    targetScene.add(boardGroup);
    interactiveObjects.push(boardGroup);

    // 7. SALA DE ESTAR: Sofá contemporáneo con cojines de contraste
    const sofaGroup = new THREE.Group();
    sofaGroup.name = "Living Room Sofa";
    sofaGroup.userData = { id: 'sofa', en: 'Sofa', ipa: '/ˈsoʊ.fə/', es: 'Sofá acolchado con cojines de contraste' };

    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.34, 1.05), M.fabricBlue);
    sofaBase.position.y = 0.36; sofaBase.castShadow = true;

    // Patas torneadas con casquillos de latón
    [[-1.25, -0.42], [1.25, -0.42], [-1.25, 0.42], [1.25, 0.42]].forEach(([sx, sz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.020, 0.22, 12), M.woodDark);
      leg.position.set(sx, 0.11, sz);
      const brass = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.020, 0.04, 12), M.metalBrass);
      brass.position.set(sx, 0.02, sz);
      sofaGroup.add(leg, brass);
    });

    // Cojines de asiento y respaldo
    for (let c = 0; c < 3; c++) {
      const cx = -0.85 + c * 0.85;
      const seatC = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.18, 0.88), M.fabricBlue);
      seatC.position.set(cx, 0.54, 0.05); seatC.castShadow = true;
      const backC = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.50, 0.22), M.fabricBlue);
      backC.position.set(cx, 0.84, -0.36); backC.rotation.x = -0.10; backC.castShadow = true;
      sofaGroup.add(seatC, backC);
    }
    // Cojines de acento de contraste (amarillo y terracota)
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.36, 0.14), M.fabricGold);
    p1.position.set(-1.05, 0.65, 0.08); p1.rotation.y = 0.25;
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.36, 0.14), M.fabricTerracotta);
    p2.position.set(1.05, 0.65, 0.08); p2.rotation.y = -0.25;
    sofaGroup.add(sofaBase, p1, p2);
    sofaGroup.position.set(-3.5, 0.11, -3.0);
    targetScene.add(sofaGroup);
    interactiveObjects.push(sofaGroup);

    // 8. MESA DE CENTRO CON TAZA DE CAFÉ HUMEANTE
    const tableGroup = new THREE.Group();
    tableGroup.name = "Coffee Table with Steaming Mug";
    tableGroup.userData = { id: 'coffee_table', en: 'Coffee Table', ipa: '/ˈkɑː.fi ˌteɪ.bəl/', es: 'Mesa de centro con taza de café humeante' };
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.80, 0.06, 28), M.woodWalnut);
    tableTop.position.y = 0.45; tableTop.castShadow = true;
    for (let i = 0; i < 3; i++) {
      const ang = (i * Math.PI * 2) / 3;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.016, 0.44, 12), M.metalDark);
      leg.position.set(Math.cos(ang) * 0.56, 0.22, Math.sin(ang) * 0.56);
      tableGroup.add(leg);
    }
    // Taza humeante
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.015, 16), M.ceramicWhite);
    saucer.position.set(0, 0.49, 0);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.11, 16), M.ceramicWhite);
    cup.position.set(0, 0.55, 0);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 8, 16), M.ceramicWhite);
    handle.position.set(0.07, 0.55, 0); handle.rotation.y = Math.PI / 2;
    // Volutas de vapor (steam)
    [0.05, 0.11, 0.17].forEach((sy, idx) => {
      const steam = new THREE.Mesh(new THREE.TorusGeometry(0.020 + idx * 0.008, 0.005, 6, 12, Math.PI * 1.2), M.steamTranslucent);
      steam.rotation.x = Math.PI / 2 + (idx % 2 === 0 ? 0.35 : -0.35);
      steam.position.set((idx % 2 === 0 ? 0.01 : -0.01), 0.62 + sy, 0);
      tableGroup.add(steam);
    });
    tableGroup.add(tableTop, saucer, cup, handle);
    tableGroup.position.set(-3.5, 0.11, -1.2);
    targetScene.add(tableGroup);
    interactiveObjects.push(tableGroup);

    // 9. ALFOMBRA TEXTURIZADA
    const rug = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.012, 2.5), new THREE.MeshStandardMaterial({ map: createRugTexture(), roughness: 0.85 }));
    rug.position.set(-3.5, 0.12, -1.8);
    rug.receiveShadow = true;
    targetScene.add(rug);

    // 10. VENTILADOR DE TECHO ROTATORIO
    const fanGroup = new THREE.Group();
    const fRod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.52, 12), M.metalChrome);
    fRod.position.y = 3.65;
    const fMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.12, 18), M.metalChrome);
    fMotor.position.y = 3.36;
    const rotor = new THREE.Group();
    rotor.position.y = 3.36;
    for (let f = 0; f < 4; f++) {
      const ang = (f * Math.PI) / 2;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.015, 0.15), M.woodWalnut);
      blade.position.set(Math.cos(ang) * 0.54, 0, Math.sin(ang) * 0.54);
      blade.rotation.y = -ang;
      rotor.add(blade);
    }
    fanGroup.add(fRod, fMotor, rotor);
    fanGroup.position.set(-3.5, 0, -2.0);
    targetScene.add(fanGroup);
    animatedFan = rotor;
    threeAnimatedObjects.fan = rotor;

    // 11. DECORACIÓN: CUADRO ENMARCADO Y RELOJ DE PARED
    const painting = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.95, 0.04), M.woodWalnut);
    painting.position.set(-3.5, 2.4, -6.85);
    const canvasArt = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.85), new THREE.MeshStandardMaterial({ map: createPaintingTexture(), roughness: 0.4 }));
    canvasArt.position.set(-3.5, 2.4, -6.82);
    targetScene.add(painting, canvasArt);

    const clockM = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 24), M.woodWalnut);
    clockM.rotation.x = Math.PI / 2;
    clockM.position.set(3.5, 2.6, -6.85);
    const clockFace = new THREE.Mesh(new THREE.CircleGeometry(0.26, 24), new THREE.MeshStandardMaterial({ map: createClockFaceTexture(), roughness: 0.2 }));
    clockFace.position.set(3.5, 2.6, -6.82);
    targetScene.add(clockM, clockFace);

    // ----------------------------------------------------
    // E. JARDÍN EXTERIOR DETALLADO
    // ----------------------------------------------------

    // 1. 3 ÁRBOLES COMPUESTOS CON TRONCOS ORGÁNICOS Y COPAS FACETADAS
    const treePositions = [
      { x: -10.5, z: -4.5, scale: 1.15, rot: 0.1 },
      { x: 10.5, z: -3.8, scale: 1.25, rot: -0.15 },
      { x: -8.5, z: 9.5, scale: 1.05, rot: 0.05 }
    ];

    treePositions.forEach((tp, tIdx) => {
      const tree = new THREE.Group();
      tree.name = `Shade Tree ${tIdx + 1}`;
      tree.userData = { id: 'shade_tree', en: 'Shade Tree', ipa: '/ʃeɪd triː/', es: 'Árbol compuesto con tronco orgánico y copa facetada' };

      // Tronco orgánico cónico con inclinación suave
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.32 * tp.scale, 0.54 * tp.scale, 3.6 * tp.scale, 12), M.trunkBark);
      trunk.position.y = (1.8 * tp.scale);
      trunk.rotation.z = tp.rot;
      trunk.castShadow = true;

      // Raíces visibles a ras de suelo
      for (let r = 0; r < 4; r++) {
        const rAng = (r * Math.PI) / 2 + 0.3;
        const root = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 0.8 * tp.scale, 8), M.trunkBark);
        root.position.set(Math.cos(rAng) * 0.45 * tp.scale, 0.16, Math.sin(rAng) * 0.45 * tp.scale);
        root.rotation.z = Math.cos(rAng) * 0.65;
        root.rotation.x = Math.sin(rAng) * 0.65;
        tree.add(root);
      }

      // Ramas principales
      const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * tp.scale, 0.24 * tp.scale, 1.6 * tp.scale, 8), M.trunkBark);
      b1.rotation.z = Math.PI / 4.5;
      b1.position.set(0.55 * tp.scale, 2.9 * tp.scale, 0);
      const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * tp.scale, 0.24 * tp.scale, 1.6 * tp.scale, 8), M.trunkBark);
      b2.rotation.z = -Math.PI / 4.5;
      b2.position.set(-0.55 * tp.scale, 2.8 * tp.scale, 0.25 * tp.scale);
      tree.add(trunk, b1, b2);

      // Copa formada por múltiples esferas facetadas (DodecahedronGeometry) en distintos verdes
      const folPos = [
        [0, 4.0 * tp.scale, 0, 1.65 * tp.scale, M.leafGreen1],
        [0.9 * tp.scale, 3.6 * tp.scale, 0.4 * tp.scale, 1.25 * tp.scale, M.leafGreen2],
        [-0.9 * tp.scale, 3.5 * tp.scale, -0.3 * tp.scale, 1.25 * tp.scale, M.leafGreen3],
        [0.25 * tp.scale, 4.6 * tp.scale, -0.4 * tp.scale, 1.35 * tp.scale, M.leafGreen4],
        [-0.3 * tp.scale, 4.5 * tp.scale, 0.5 * tp.scale, 1.30 * tp.scale, M.leafGreen2]
      ];
      folPos.forEach(([fx, fy, fz, fr, fMat]) => {
        const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(fr), fMat);
        leaves.position.set(fx, fy, fz);
        leaves.castShadow = true;
        tree.add(leaves);
      });

      tree.position.set(tp.x, 0, tp.z);
      targetScene.add(tree);
      interactiveObjects.push(tree);
    });

    // 2. CAMINO DE BALDOSAS DE PIEDRA IRREGULAR DESDE LA ENTRADA
    const pathGroup = new THREE.Group();
    pathGroup.name = "Stone Pathway";
    pathGroup.userData = { id: 'stone_path', en: 'Stone Pathway', ipa: '/stoʊn ˈpæθ.weɪ/', es: 'Camino de baldosas de piedra irregular desde la entrada' };

    const pathCoords = [
      [0.0, 5.2], [-0.3, 6.2], [0.2, 7.3], [-0.1, 8.4], [0.3, 9.6], [-0.2, 10.8], [0.1, 12.0]
    ];
    pathCoords.forEach(([px, pz], idx) => {
      const paver = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38 + (idx % 2) * 0.08, 0.44, 0.05, 7),
        M.stonePaver
      );
      paver.position.set(px, 0.025, pz);
      paver.rotation.y = idx * 0.95;
      paver.receiveShadow = true;
      pathGroup.add(paver);
    });
    targetScene.add(pathGroup);
    interactiveObjects.push(pathGroup);

    // 3. CERCA PERIMETRAL DE ESTACAS BLANCAS (PICKET FENCE)
    const fenceGroup = new THREE.Group();
    fenceGroup.name = "White Picket Fence";
    fenceGroup.userData = { id: 'wooden_fence', en: 'Wooden Fence', ipa: '/ˈwʊd.ən fens/', es: 'Cerca perimetral de estacas blancas' };

    function createPicketSection(length, startPos, rotY) {
      const section = new THREE.Group();
      const numPickets = Math.floor(length / 0.32);
      for (let p = 0; p < numPickets; p++) {
        const px = -length / 2 + p * 0.32 + 0.16;
        const picket = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.024), M.picketWhite);
        picket.position.set(px, 0.55, 0);
        // Punta triangular superior
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.16, 4), M.picketWhite);
        tip.rotation.y = Math.PI / 4;
        tip.position.set(px, 1.18, 0);
        section.add(picket, tip);
      }
      // Rieles horizontales
      const rail1 = new THREE.Mesh(new THREE.BoxGeometry(length, 0.06, 0.03), M.picketWhite);
      rail1.position.set(0, 0.35, 0);
      const rail2 = new THREE.Mesh(new THREE.BoxGeometry(length, 0.06, 0.03), M.picketWhite);
      rail2.position.set(0, 0.85, 0);
      section.add(rail1, rail2);
      section.position.set(startPos.x, startPos.y, startPos.z);
      section.rotation.y = rotY;
      return section;
    }

    fenceGroup.add(createPicketSection(18.0, { x: 0, y: 0, z: 14.5 }, 0));
    fenceGroup.add(createPicketSection(14.0, { x: -14.0, y: 0, z: 7.5 }, Math.PI / 2));
    fenceGroup.add(createPicketSection(14.0, { x: 14.0, y: 0, z: 7.5 }, Math.PI / 2));
    targetScene.add(fenceGroup);
    interactiveObjects.push(fenceGroup);

    // 4. FAROL DE JARDÍN EXTERIOR CON CONO DE LUZ SUAVE (SPOTLIGHT)
    const lanternGroup = new THREE.Group();
    lanternGroup.name = "Garden Lamp Post";
    lanternGroup.userData = { id: 'lamp_post', en: 'Garden Lamp Post', ipa: '/læmp poʊst/', es: 'Farol de jardín exterior que proyecta un cono de luz suave' };

    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.36, 8), M.ironBlack);
    plinth.position.y = 0.18; plinth.castShadow = true;

    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 2.8, 12), M.ironBlack);
    column.position.y = 1.74; column.castShadow = true;

    const lanternCap = new THREE.Mesh(new THREE.ConeGeometry(0.30, 0.22, 6), M.ironBlack);
    lanternCap.position.y = 3.48;

    const glassCage = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.14, 0.36, 6, 1, true), M.glassLantern);
    glassCage.position.y = 3.22;

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), M.emissiveBulb);
    bulb.position.y = 3.22;

    // Haz de luz focalizado (SpotLight) suave hacia abajo
    const spot = new THREE.SpotLight(0xffedd5, 2.8, 14.0, Math.PI / 3.5, 0.5, 1.2);
    spot.position.set(0, 3.22, 0);
    spot.target.position.set(0, 0, 0);
    spot.castShadow = true;
    spot.shadow.mapSize.width = 512;
    spot.shadow.mapSize.height = 512;
    lanternGroup.add(spot, spot.target);

    // Luz ambiental puntual tenue
    const lanternPoint = new THREE.PointLight(0xffedd5, 1.2, 8.0);
    lanternPoint.position.y = 3.22;

    lanternGroup.add(plinth, column, lanternCap, glassCage, bulb, lanternPoint);
    lanternGroup.position.set(2.2, 0, 6.5);
    targetScene.add(lanternGroup);
    interactiveObjects.push(lanternGroup);

    // 5. BANCA DE PARQUE DE LISTONES DE MADERA Y HIERRO
    const benchGroup = new THREE.Group();
    benchGroup.name = "Garden Bench";
    benchGroup.userData = { id: 'garden_bench', en: 'Garden Bench', ipa: '/ˈɡɑːr.dən bentʃ/', es: 'Banca de parque de listones de madera' };
    const bSeat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.06, 0.55), M.woodPine);
    bSeat.position.y = 0.45; bSeat.castShadow = true;
    const bBack = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.44, 0.06), M.woodPine);
    bBack.position.set(0, 0.78, -0.24); bBack.castShadow = true;
    const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.55), M.ironBlack);
    l1.position.set(-0.9, 0.22, 0);
    const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.55), M.ironBlack);
    l2.position.set(0.9, 0.22, 0);
    benchGroup.add(bSeat, bBack, l1, l2);
    benchGroup.position.set(-4.5, 0, 7.5);
    targetScene.add(benchGroup);
    interactiveObjects.push(benchGroup);

    // 6. ARBUSTOS FLORALES VIBRANTES
    [-6.5, 6.5].forEach((bx, idx) => {
      const bushGroup = new THREE.Group();
      bushGroup.name = `Flower Bush ${idx + 1}`;
      bushGroup.userData = { id: 'flower_bush', en: 'Flower Bush', ipa: '/ˈflaʊ.ɚ bʊʃ/', es: 'Arbusto floral con flores de colores vivos' };
      const bushMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85), M.leafGreen2);
      bushMesh.position.y = 0.65;
      bushMesh.scale.set(1.2, 0.85, 1.1);
      bushMesh.castShadow = true;
      bushGroup.add(bushMesh);

      const fColors = [M.flowerRed, M.flowerYellow, M.flowerPink, M.flowerLavender];
      for (let f = 0; f < 18; f++) {
        const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), fColors[f % fColors.length]);
        const theta = (f * 1.35) % (Math.PI * 2);
        const phi = 0.25 + (f * 0.18) % (Math.PI * 0.4);
        blossom.position.set(
          Math.sin(phi) * Math.cos(theta) * 0.88,
          0.65 + Math.cos(phi) * 0.55,
          Math.sin(phi) * Math.sin(theta) * 0.88
        );
        bushGroup.add(blossom);
      }
      bushGroup.position.set(bx, 0, 5.5);
      targetScene.add(bushGroup);
      interactiveObjects.push(bushGroup);
    });

    // 7. ASPERSOR ROTATORIO
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
      arm.rotation.y = a; arm.rotation.z = Math.PI / 4;
      spHead.add(arm);
    }
    sprinklerGroup.add(spBase, spHead);
    sprinklerGroup.position.set(-2.0, 0, 8.5);
    targetScene.add(sprinklerGroup);
    animatedSprinkler = spHead;
    threeAnimatedObjects.sprinkler = spHead;
  }

  // ============================================================================
  // 6. ILUMINACIÓN CINEMÁTICA Y AMBIENTACIÓN PBR
  // ============================================================================
  function setupCinematicLighting(targetScene) {
    // 1. HemisphereLight para relleno ambiental global (evita escenas oscuras)
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x202035, 1.2);
    targetScene.add(hemiLight);

    // 2. DirectionalLight cinemática con sombras suaves y mapa 1024x1024
    const dirLight = new THREE.DirectionalLight(0xfff2dd, 1.8);
    dirLight.position.set(12, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 70;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    targetScene.add(dirLight);

    // 3. Luz cálida puntual (PointLight) en el interior de la casa para lámpara de estudio
    const studyLight = new THREE.PointLight(0xffaa44, 2.0, 15.0);
    studyLight.position.set(3.5, 2.4, -3.0);
    studyLight.castShadow = true;
    studyLight.shadow.bias = -0.001;
    targetScene.add(studyLight);

    // Luz secundaria para la sala de estar
    const livingLight = new THREE.PointLight(0xffedd5, 1.4, 12.0);
    livingLight.position.set(-3.5, 2.6, -2.5);
    targetScene.add(livingLight);
  }

  // ============================================================================
  // 7. CONTROL DEL CICLO DE VIDA: window.initOrResumeWorld3D()
  // ============================================================================
  function initOrResumeWorld3D() {
    if (typeof THREE === 'undefined') return;
    if (!clock) clock = new THREE.Clock();
    initSharedMaterials();
    isWorldTourActive = true;

    // Obtener el contenedor (#canvas-container o #world3d-canvas o #threeWebGLMount)
    let container = document.getElementById('canvas-container') ||
                    document.getElementById('world3d-canvas') ||
                    document.getElementById('threeWebGLMount') ||
                    document.getElementById('threeCanvasContainer') ||
                    document.querySelector('.canvas-container');

    const viewWorldTour = document.getElementById('view-worldtour');
    if (viewWorldTour && (viewWorldTour.style.display === 'none' || viewWorldTour.classList.contains('hidden'))) {
      viewWorldTour.style.display = 'block';
      viewWorldTour.classList.remove('hidden');
    }

    // Si el contenedor no tiene dimensiones válidas en el DOM, forzar tamaño visible
    if (!container || container.clientWidth === 0 || container.clientHeight === 0 || window.getComputedStyle(container).display === 'none') {
      if (container) {
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.position = 'fixed';
        container.style.inset = '0';
        container.style.zIndex = '1';
      }
    }

    // Determinar elemento donde inyectar el canvas WebGL
    const mountTarget = document.getElementById('threeWebGLMount') || container || document.body;

    // Si ya está inicializado, reanudar y redimensionar
    if (isEngineInitialized && renderer && scene && camera) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      if (controls) controls.update();

      if (!animFrameId) {
        lastFrameTime = performance.now();
        animFrameId = requestAnimationFrame(animate);
      }
      renderer.render(scene, camera);
      return;
    }

    // 1. Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);

    // 2. Cámara
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 250);
    camera.position.set(0, 5.0, 14.0);

    // 3. Renderer optimizado WebGL
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
    renderer.toneMappingExposure = 1.05;

    // Configurar Canvas
    renderer.domElement.id = 'world3d-canvas';
    renderer.domElement.className = 'w-full h-full block select-none';

    if (mountTarget) {
      mountTarget.innerHTML = '';
      mountTarget.appendChild(renderer.domElement);
    }

    // 4. Controles de órbita suaves (OrbitControls)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1; // Límite para no traspasar el suelo
    controls.minDistance = 2.0;
    controls.maxDistance = 55.0;
    controls.target.set(0, 1.5, 0);

    // 5. Iluminación PBR y Escenario
    setupCinematicLighting(scene);
    buildDetailedHouseAndGarden(scene);

    // 6. Raycaster interactivo para selección y audio TTS
    setupRaycasterInteraction(renderer.domElement);

    // 7. Bucle de animación continuo a 60 FPS
    function animate(now) {
      if (!isWorldTourActive) return;
      animFrameId = requestAnimationFrame(animate);

      const delta = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

      if (controls) controls.update();

      if (animatedFan) animatedFan.rotation.y += delta * 4.5;
      if (animatedSprinkler) animatedSprinkler.rotation.y += delta * 6.5;

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }

    animFrameId = requestAnimationFrame(animate);

    // 8. Respuesta al cambio de orientación (Landscape/Portrait) y Resize
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(onWindowResize, 100);
    });

    // 9. Pausa / reanudación automática en segundo plano para ahorro de batería
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
      if (scene) renderer.render(scene, camera);
    }
  }

  // ============================================================================
  // 8. INTERACCIÓN POR RAYCASTER, PRONUNCIACIÓN TTS Y ESCENARIOS
  // ============================================================================
  function setupRaycasterInteraction(domElement) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onPointerDown(e) {
      const rect = domElement.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (clientX === undefined || clientY === undefined) return;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let topObj = intersects[0].object;
        while (topObj.parent && !topObj.userData.id && topObj.parent !== scene) {
          topObj = topObj.parent;
        }
        if (topObj && topObj.userData && topObj.userData.en) {
          showObjectInspection(topObj.userData);
        }
      }
    }

    domElement.addEventListener('click', onPointerDown);
  }

  function showObjectInspection(data) {
    if (typeof global.speakText === 'function') {
      global.speakText(data.en);
    } else if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(data.en);
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }

    const card = document.getElementById('objectInspectCard');
    if (card) {
      const enEl = document.getElementById('inspectEn');
      const ipaEl = document.getElementById('inspectIpa');
      const esEl = document.getElementById('inspectEs');
      if (enEl) enEl.textContent = data.en;
      if (ipaEl) ipaEl.textContent = data.ipa || '';
      if (esEl) esEl.textContent = data.es || '';
      card.classList.remove('hidden');
      card.style.display = 'block';
    }
  }

  function switch3DScenario(scenarioKey) {
    currentScenario = scenarioKey;
    if (!controls) return;

    if (scenarioKey === 'house') {
      controls.target.set(0, 1.5, -1.5);
      camera.position.set(0, 4.5, 5.5);
    } else {
      controls.target.set(0, 1.5, 6.5);
      camera.position.set(0, 5.0, 16.0);
    }

    const btnHouse = document.getElementById('scenarioBtnHouse');
    const btnGarden = document.getElementById('scenarioBtnGarden');
    if (btnHouse && btnGarden) {
      if (scenarioKey === 'house') {
        btnHouse.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer bg-purple-600 text-white border border-purple-400";
        btnGarden.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-slate-800 text-slate-300 hover:text-white border border-slate-700";
      } else {
        btnGarden.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer bg-purple-600 text-white border border-purple-400";
        btnHouse.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-slate-800 text-slate-300 hover:text-white border border-slate-700";
      }
    }
  }

  // ============================================================================
  // 9. EXPORTACIÓN MODULAR Y ALIASES GLOBALES
  // ============================================================================
  global.initOrResumeWorld3D = initOrResumeWorld3D;
  global.initThreeWorldTour = initOrResumeWorld3D;
  global.switch3DScenario = switch3DScenario;

  global.World3D = {
    initOrResumeWorld3D,
    switch3DScenario,
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

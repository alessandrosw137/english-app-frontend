/**
 * MasterENG 3D - Nature & Space Modular Builders & Scene Architects
 * Módulo especializado para mundos "space" (Outer Space & Astrophysics) y "garden" (Backyard & Nature).
 * 
 * CARACTERÍSTICAS TÉCNICAS:
 * 1. MUNDO SPACE:
 *    - Texturas procedurales CanvasTexture (1024x512) para Sol, Tierra, Marte, Júpiter, Saturno, Anillos y Agujero Negro.
 *    - Modelos aeroespaciales de ingeniería: Cohete multietapa (Saturn V / Falcon 9), Estación Espacial ISS, Rover Lunar, Traje de Astronauta EMU con visera dorada.
 *    - CERO lámparas domésticas: Conceptos abstractos espaciales modelados como insignias holográficas con anillos de cardán (gimbal rings).
 * 2. MUNDO GARDEN:
 *    - Herramientas y estructuras reales: Cortacésped, Carretilla, Asador BBQ con brasas incandescentes, Invernadero de cristal con tomateras, Pala, Rastrillo, Regadera, Fuente de 2 niveles, Baño de pájaros con ave posada, Banco de parque en hierro y roble, Cerca de estacas blancas.
 *    - Entorno exterior completo (césped, setos, patio empedrado, iluminación natural) reemplazando cualquier mueble de casa.
 */
(function() {
  'use strict';

  const globalScope = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : {});
  const B = globalScope.MasterENG3DBuilders = globalScope.MasterENG3DBuilders || {};

  // ============================================================================
  // GESTIÓN DE MATERIALES SEGUROS PBR
  // ============================================================================
  const _spaceMatCache = new Map();
  function getMat(P, name, fallbackColor, roughness, metalness) {
    if (P && P[name]) return P[name];
    if (typeof THREE !== 'undefined') {
      const c = fallbackColor !== undefined ? fallbackColor : 0x64748b;
      const r = roughness !== undefined ? roughness : 0.35;
      const m = metalness !== undefined ? metalness : 0.1;
      const key = `${c}_${r}_${m}`;
      if (_spaceMatCache.has(key)) return _spaceMatCache.get(key);
      const M = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
      const mat = new M({
        color: c,
        roughness: r,
        metalness: m
      });
      _spaceMatCache.set(key, mat);
      return mat;
    }
    return null;
  }

  // ============================================================================
  // GENERADORES PROCEDURALES DE TEXTURAS CANVAS (1024x512)
  // ============================================================================
  function createProceduralCanvas(width, height) {
    if (typeof document === 'undefined') return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width || 1024;
      canvas.height = height || 512;
      return canvas;
    } catch (_) {
      return null;
    }
  }

  // 1. Textura Solar: Plasma solar granulado amarillo/naranja con fulguraciones y manchas
  function generateSunTexture() {
    if (typeof THREE === 'undefined') return null;
    const canvas = createProceduralCanvas(1024, 512);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Fondo degradado de plasma
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0.0, '#fffbeb');
    grad.addColorStop(0.25, '#fef08a');
    grad.addColorStop(0.55, '#f59e0b');
    grad.addColorStop(0.85, '#ea580c');
    grad.addColorStop(1.0, '#b91c1c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Células de convección y granulación solar
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = 8 + Math.random() * 22;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(234, 88, 12, 0.45)';
    for (let i = 0; i < 350; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = 12 + Math.random() * 30;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Manchas solares (sunspots) con umbra y penumbra
    const sunspots = [
      { x: 320, y: 190, r: 18 }, { x: 350, y: 210, r: 11 },
      { x: 680, y: 310, r: 24 }, { x: 720, y: 330, r: 14 },
      { x: 510, y: 250, r: 16 }
    ];
    sunspots.forEach(s => {
      // Penumbra
      ctx.fillStyle = 'rgba(120, 53, 15, 0.7)';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 1.6, 0, Math.PI * 2);
      ctx.fill();
      // Umbra oscura
      ctx.fillStyle = '#290e03';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 0.8, 0, Math.PI * 2);
      ctx.fill();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // 2. Textura de la Tierra: Océano azul profundo, continentes verdes/ocres y casquetes polares
  function generateEarthTexture() {
    if (typeof THREE === 'undefined') return null;
    const canvas = createProceduralCanvas(1024, 512);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Océano azul profundo con gradiente batimétrico
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0.0, '#0a2540');
    oceanGrad.addColorStop(0.5, '#004385');
    oceanGrad.addColorStop(1.0, '#0a2540');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Plataformas continentales turquesa suave
    ctx.fillStyle = 'rgba(14, 165, 233, 0.35)';
    const continentalShelves = [
      { x: 190, y: 140, w: 180, h: 140 }, // Norteamérica
      { x: 280, y: 320, w: 130, h: 150 }, // Sudamérica
      { x: 530, y: 140, w: 320, h: 150 }, // Eurasia
      { x: 540, y: 270, w: 150, h: 170 }, // África
      { x: 840, y: 350, w: 110, h: 90 }   // Australia
    ];
    continentalShelves.forEach(c => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.w * 0.58, c.h * 0.58, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Continentes verdes y ocres
    function drawLandmass(cx, cy, rx, ry, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    // América del Norte y Central
    drawLandmass(200, 130, 95, 65, '#2d6a4f');
    drawLandmass(230, 160, 65, 45, '#52b788');
    drawLandmass(180, 150, 45, 40, '#d4a373'); // Desierto oeste

    // América del Sur
    drawLandmass(290, 310, 55, 95, '#1b4332'); // Amazonía
    drawLandmass(280, 370, 35, 65, '#74c69d');
    drawLandmass(265, 330, 18, 90, '#c2a649'); // Andes

    // Eurasia
    drawLandmass(580, 110, 85, 45, '#2d6a4f'); // Europa
    drawLandmass(720, 120, 150, 75, '#1b4332'); // Siberia / Rusia
    drawLandmass(760, 190, 95, 65, '#40916c'); // Asia oriental
    drawLandmass(630, 190, 75, 45, '#d4a373'); // Oriente Medio desierto
    drawLandmass(710, 210, 55, 55, '#2d6a4f'); // India

    // África
    drawLandmass(550, 240, 75, 45, '#d4a373'); // Sahara
    drawLandmass(560, 310, 65, 75, '#1b4332'); // Cuenca del Congo
    drawLandmass(580, 370, 45, 45, '#52b788'); // Sudáfrica

    // Australia
    drawLandmass(860, 360, 65, 45, '#c2a649'); // Outback ocre
    drawLandmass(895, 360, 25, 40, '#2d6a4f'); // Costa este verde

    // Casquetes Polares (Ártico y Antártida)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(512, 18, 512, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(512, 495, 512, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // Capa de nubes para la Tierra (semitransparente con vórtices)
  function generateEarthCloudsTexture() {
    if (typeof THREE === 'undefined') return null;
    const canvas = createProceduralCanvas(1024, 512);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, 1024, 512);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.48)';

    for (let i = 0; i < 70; i++) {
      const cx = Math.random() * 1024;
      const cy = 60 + Math.random() * 392;
      const rw = 40 + Math.random() * 95;
      const rh = 12 + Math.random() * 32;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rw, rh, Math.random() * 0.4 - 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Espirales de ciclones
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    [ { x: 310, y: 160 }, { x: 740, y: 170 }, { x: 420, y: 360 } ].forEach(storm => {
      ctx.beginPath();
      ctx.arc(storm.x, storm.y, 28, 0, Math.PI * 1.7);
      ctx.lineWidth = 14;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.stroke();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // 3. Textura de Marte: Terracota rojizo, cuencas oscuras, Olympus Mons y Valles Marineris
  function generateMarsTexture() {
    if (typeof THREE === 'undefined') return null;
    const canvas = createProceduralCanvas(1024, 512);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Base terracota marciana
    const marsGrad = ctx.createLinearGradient(0, 0, 1024, 512);
    marsGrad.addColorStop(0.0, '#b93b1d');
    marsGrad.addColorStop(0.4, '#c2410c');
    marsGrad.addColorStop(0.7, '#9a3412');
    marsGrad.addColorStop(1.0, '#7c2d12');
    ctx.fillStyle = marsGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Cuencas y mesetas basálticas oscuras
    ctx.fillStyle = 'rgba(67, 20, 7, 0.58)';
    const darkRegions = [
      { x: 340, y: 220, w: 160, h: 70 }, // Syrtis Major
      { x: 590, y: 280, w: 210, h: 80 }, // Acidalia Planitia
      { x: 180, y: 310, w: 140, h: 65 }  // Terra Sirenum
    ];
    darkRegions.forEach(d => {
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, d.w * 0.5, d.h * 0.5, 0.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Valles Marineris (el gran cañón marciano)
    ctx.strokeStyle = '#270802';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(330, 260);
    ctx.bezierCurveTo(410, 275, 480, 255, 540, 270);
    ctx.stroke();

    // Olympus Mons (volcán gigante con caldera)
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(240, 210, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#431407';
    ctx.beginPath();
    ctx.arc(240, 210, 12, 0, Math.PI * 2);
    ctx.fill();

    // Casquetes polares de hielo seco
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.ellipse(512, 14, 280, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(512, 498, 220, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // 4. Textura de Júpiter: Bandas horizontales turbulentas y Gran Mancha Roja
  function generateJupiterTexture() {
    if (typeof THREE === 'undefined') return null;
    const canvas = createProceduralCanvas(1024, 512);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Bandas horizontales en tonos crema, ocre y terracota
    const bandColors = [
      '#fef3c7', '#d97706', '#fde68a', '#b45309',
      '#fed7aa', '#78350f', '#fde68a', '#9a3412',
      '#fed7aa', '#b45309', '#fef3c7', '#c2410c'
    ];
    const bandHeight = 512 / bandColors.length;

    bandColors.forEach((col, idx) => {
      ctx.fillStyle = col;
      const y = idx * bandHeight;
      ctx.fillRect(0, y, 1024, bandHeight + 1);

      // Turbulencias y ondas sinusoidales en los límites de banda
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      for (let x = 0; x <= 1024; x += 16) {
        const wave = Math.sin(x * 0.04 + idx) * 4;
        ctx.lineTo(x, y + wave);
      }
      ctx.lineTo(1024, y + bandHeight * 0.4);
      ctx.lineTo(0, y + bandHeight * 0.4);
      ctx.closePath();
      ctx.fill();
    });

    // Gran Mancha Roja (Great Red Spot)
    const grsX = 640;
    const grsY = 325;
    ctx.save();
    ctx.translate(grsX, grsY);
    ctx.rotate(-0.08);

    // Borde exterior rojizo oscuro
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.ellipse(0, 0, 68, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Centro brillante terracota
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(0, 0, 52, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Núcleo espiral crema
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.ellipse(-6, 2, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // 5. Textura de Saturno: Esfera dorada en bandas suaves
  function generateSaturnTexture() {
    if (typeof THREE === 'undefined') return null;
    const canvas = createProceduralCanvas(1024, 512);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const saturnTones = [
      '#fef3c7', '#fde68a', '#f59e0b', '#fde68a',
      '#fcd34d', '#d97706', '#fde68a', '#b45309',
      '#fcd34d', '#fef3c7', '#f59e0b'
    ];
    const step = 512 / saturnTones.length;
    saturnTones.forEach((tone, i) => {
      ctx.fillStyle = tone;
      ctx.fillRect(0, i * step, 1024, step + 1);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // Anillos concéntricos de Saturno con División de Cassini translúcida
  function generateSaturnRingsTexture() {
    if (typeof THREE === 'undefined') return null;
    const canvas = createProceduralCanvas(1024, 64);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, 1024, 64);
    const ringGrad = ctx.createLinearGradient(0, 0, 1024, 0);
    ringGrad.addColorStop(0.0, 'rgba(217, 119, 6, 0.15)'); // Borde interno
    ringGrad.addColorStop(0.25, 'rgba(252, 211, 77, 0.85)'); // Anillo B denso
    ringGrad.addColorStop(0.58, 'rgba(245, 158, 11, 0.90)');
    ringGrad.addColorStop(0.68, 'rgba(15, 23, 42, 0.02)');  // División de Cassini (transparente)
    ringGrad.addColorStop(0.74, 'rgba(15, 23, 42, 0.02)');  // División de Cassini
    ringGrad.addColorStop(0.78, 'rgba(251, 191, 36, 0.75)'); // Anillo A
    ringGrad.addColorStop(0.96, 'rgba(217, 119, 6, 0.45)');
    ringGrad.addColorStop(1.0, 'rgba(217, 119, 6, 0.0)');   // Borde externo
    ctx.fillStyle = ringGrad;
    ctx.fillRect(0, 0, 1024, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // 6. Textura del Disco de Acreción del Agujero Negro (Plasma Doppler naranja y violeta)
  function generateBlackHoleAccretionTexture() {
    if (typeof THREE === 'undefined') return null;
    const canvas = createProceduralCanvas(1024, 128);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const diskGrad = ctx.createLinearGradient(0, 0, 1024, 0);
    diskGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)'); // Horizonte incandescente
    diskGrad.addColorStop(0.18, 'rgba(249, 115, 22, 0.92)'); // Plasma naranja
    diskGrad.addColorStop(0.50, 'rgba(217, 70, 239, 0.80)'); // Radiación violeta Doppler
    diskGrad.addColorStop(0.85, 'rgba(99, 102, 241, 0.45)'); // Borde relativista
    diskGrad.addColorStop(1.0, 'rgba(15, 23, 42, 0.0)');
    ctx.fillStyle = diskGrad;
    ctx.fillRect(0, 0, 1024, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // ============================================================================
  // MODELOS DE INGENIERÍA AEROESPACIAL 3D (ESPACIO)
  // ============================================================================

  // Cohete Multietapa de Lanzamiento Pesado (Saturn V / Falcon 9)
  function buildHeavyRocketMesh(P) {
    const g = new THREE.Group();
    const matWhite = getMat(P, 'crownWhite', 0xf8fafc, 0.25, 0.15);
    const matBlack = getMat(P, 'metalDark', 0x0f172a, 0.35, 0.5);
    const matTitanium = getMat(P, 'metalChrome', 0x94a3b8, 0.2, 0.85);
    const matEngineGlow = getMat(P, 'emissiveOrange', 0xf97316);

    // Etapa 1: Booster principal con aletas en delta y franjas de balanceo
    const stage1 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.35, 2.4, 20), matWhite);
    stage1.position.y = 1.2;

    const rollDecal = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.55, 20), matBlack);
    rollDecal.position.y = 1.8;

    // Anillo inter-etapas de separación ventilado
    const interstage = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.18, 20), matBlack);
    interstage.position.y = 2.49;

    // Etapa 2: Motor orbital
    const stage2 = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.32, 1.4, 20), matWhite);
    stage2.position.y = 3.28;

    // Cono de ojiva aerodinámica / cofia de carga útil (Payload Fairing)
    const fairing = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.30, 0.95, 20), matWhite);
    fairing.position.y = 4.45;

    const escapeTower = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.45, 12), matBlack);
    escapeTower.position.y = 5.15;

    // 4 Aletas estabilizadoras en delta en la base
    const finGeo = new THREE.BoxGeometry(0.28, 0.45, 0.04);
    [-1, 1].forEach(side => {
      const finX = new THREE.Mesh(finGeo, matBlack);
      finX.position.set(side * 0.46, 0.35, 0);
      const finZ = new THREE.Mesh(finGeo, matBlack);
      finZ.position.set(0, 0.35, side * 0.46);
      finZ.rotation.y = Math.PI / 2;
      g.add(finX, finZ);
    });

    // 3 Toberas de campana de titanio para escape de gases
    [-0.14, 0.14, 0].forEach((ox, idx) => {
      const oz = idx === 2 ? 0.14 : -0.07;
      const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 0.28, 14, 1, true), matTitanium);
      bell.position.set(ox, 0.08, oz);

      // Pluma de fuego supersónica activa
      const plume = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.85, 12), matEngineGlow);
      plume.rotation.x = Math.PI;
      plume.position.set(ox, -0.42, oz);
      g.add(bell, plume);
    });

    g.add(stage1, rollDecal, interstage, stage2, fairing, escapeTower);
    return g;
  }

  // Estación Espacial Internacional (ISS)
  function buildSpaceStationMesh(P) {
    const g = new THREE.Group();
    const matTruss = getMat(P, 'metalDark', 0x334155, 0.3, 0.7);
    const matModule = getMat(P, 'metalChrome', 0xf1f5f9, 0.2, 0.85);
    const matSolar = getMat(P, 'emissiveScreen', 0x0284c7, 0.15, 0.9);
    const matGoldGrid = getMat(P, 'metalBrass', 0xf59e0b, 0.2, 0.8);

    // Viga central integrada en celosía (Integrated Truss Structure)
    const truss = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.12, 0.12), matTruss);
    truss.position.y = 0;

    // Módulos cilíndricos presurizados cruzados (Destiny, Unity, Zvezda)
    const moduleMain = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.8, 16), matModule);
    moduleMain.rotation.x = Math.PI / 2;

    const moduleCross = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 1.2, 16), matModule);
    moduleCross.rotation.z = Math.PI / 2;

    // Cúpula de observación con ventanas
    const cupola = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), matSolar);
    cupola.position.set(0, -0.22, 0.4);

    // 8 Paneles solares gigantes (4 en cada extremo de la celosía)
    [-1.8, -1.2, 1.2, 1.8].forEach(tx => {
      [-0.55, 0.55].forEach(tz => {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.02, 1.15), matSolar);
        panel.position.set(tx, 0, tz);
        const rim = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.025, 0.04), matGoldGrid);
        rim.position.set(tx, 0, tz);
        g.add(panel, rim);
      });
    });

    g.add(truss, moduleMain, moduleCross, cupola);
    return g;
  }

  // Rover Lunar con 4 Ruedas de Malla Metálica y Antena Parabólica
  function buildLunarRoverMesh(P) {
    const g = new THREE.Group();
    const matChassis = getMat(P, 'metalBrass', 0xd97706, 0.3, 0.7);
    const matWheel = getMat(P, 'metalDark', 0x1e293b, 0.5, 0.6);
    const matFender = getMat(P, 'crownWhite', 0xf8fafc, 0.3, 0.2);
    const matDish = getMat(P, 'metalChrome', 0xe2e8f0, 0.15, 0.85);

    // Chasis tubular abierto
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.14, 1.4), matChassis);
    chassis.position.y = 0.32;

    // Asientos gemelos de los astronautas
    [-0.20, 0.20].forEach(sx => {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.35, 0.35), matFender);
      seat.position.set(sx, 0.55, 0);
      g.add(seat);
    });

    // 4 Ruedas de malla metálica con guardabarros curvos
    [-0.52, 0.52].forEach(wx => {
      [-0.45, 0.45].forEach(wz => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.11, 16), matWheel);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.22, wz);

        const fender = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.13, 14, 1, false, 0, Math.PI), matFender);
        fender.rotation.z = Math.PI / 2;
        fender.position.set(wx, 0.30, wz);
        g.add(wheel, fender);
      });
    });

    // Mástil de cámara frontal y antena parabólica de alta ganancia
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.75, 8), matDish);
    mast.position.set(0.26, 0.75, 0.55);

    const dish = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.4), matDish);
    dish.rotation.x = -Math.PI / 3;
    dish.position.set(0.26, 1.15, 0.55);

    g.add(chassis, mast, dish);
    return g;
  }

  // Astronauta con Traje Presurizado EMU y Visera Dorada Reflectante
  function buildAstronautMesh(P) {
    const g = new THREE.Group();
    const matSuit = getMat(P, 'crownWhite', 0xffffff, 0.32, 0.05);
    const matVisor = getMat(P, 'metalBrass', 0xf59e0b, 0.08, 0.98); // Oro reflectante
    const matPLSS = getMat(P, 'metalDark', 0x334155, 0.35, 0.35);
    const matGlove = getMat(P, 'metalDark', 0x475569, 0.4, 0.2);

    // Torso presurizado con módulo DCM pectoral
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.62, 0.32), matSuit);
    torso.position.y = 0.92;

    const dcmBox = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.08), matPLSS);
    dcmBox.position.set(0, 0.98, 0.19);

    // Casco esférico con visera dorada curva reflectante
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), matSuit);
    helmet.position.y = 1.38;

    const goldVisor = new THREE.Mesh(new THREE.SphereGeometry(0.19, 18, 14, 0, Math.PI * 1.05), matVisor);
    goldVisor.position.set(0, 1.38, 0.09);

    // Mochila de soporte vital PLSS (Primary Life Support Subsystem)
    const plss = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.58, 0.22), matPLSS);
    plss.position.set(0, 0.95, -0.25);

    // Extremidades articuladas: brazos y piernas presurizadas
    [-0.32, 0.32].forEach(side => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.52, 12), matSuit);
      arm.position.set(side, 0.88, 0.05);
      arm.rotation.z = side * -0.25;

      const glove = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), matGlove);
      glove.position.set(side * 1.15, 0.62, 0.08);

      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.085, 0.65, 12), matSuit);
      leg.position.set(side * 0.48, 0.36, 0);

      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.24), matGlove);
      boot.position.set(side * 0.48, 0.06, 0.04);

      g.add(arm, glove, leg, boot);
    });

    g.add(torso, dcmBox, helmet, goldVisor, plss);
    return g;
  }

  // Insignia Holográfica Espacial para Conceptos Abstractos (CERO LÁMPARAS DE MESA)
  function buildSpatialHologramNode(item, P) {
    const g = new THREE.Group();
    g.name = 'HoloBadge_' + (item.id || 'concept');

    const matRingCyan = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const matRingViolet = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true });
    const PhysicalMat = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
    const matCore = PhysicalMat ? new PhysicalMat({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
      clearcoat: 0.8
    }) : new THREE.MeshBasicMaterial({ color: 0x67e8f9 });

    // Anillos de Cardán concéntricos miniatura
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.012, 8, 28), matRingCyan);
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.010, 8, 24), matRingViolet);
    innerRing.rotation.x = Math.PI / 2.4;

    // Núcleo talismán luminoso (orbe discreto de radio 0.18)
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), matCore);
    core.name = 'ConceptOrb_' + (item.id || item.en);

    // Haz láser vertical guía fino
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1.8, 8), beamMat);
    beam.position.y = -0.55;

    // Optimización 60 FPS: Cero sprites creados durante buildScenarioWorld.
    // La etiqueta se muestra bajo demanda mediante el singleton World3D.sharedLabelSprite
    g.labelSprite = null;
    g.userData = {
      interactive: true,
      isConceptNode: true,
      id: item.id,
      en: item.en,
      ipa: item.ipa,
      es: item.es,
      category: item.category || 'space',
      example: item.example,
      type: item.type || 'concept',
      wordEn: item.en,
      phonetic: item.ipa,
      wordEs: item.es,
      labelSprite: null
    };

    core.userData = Object.assign({}, g.userData, { parentGroup: g, interactive: true });
    outerRing.userData = Object.assign({}, g.userData, { parentGroup: g, interactive: true });
    innerRing.userData = Object.assign({}, g.userData, { parentGroup: g, interactive: true });

    g.add(outerRing, innerRing, core, beam);
    return g;
  }

  // ============================================================================
  // MODELOS REALES DE JARDÍN EXTERIOR (GARDEN)
  // ============================================================================

  // Cortacésped Real (Lawn Mower)
  function buildLawnMowerMesh(P) {
    const g = new THREE.Group();
    const matRedDeck = getMat(P, 'flowerRed', 0xdc2626, 0.25, 0.4);
    const matEngineBlack = getMat(P, 'metalDark', 0x18181b, 0.45, 0.3);
    const matRubber = getMat(P, 'metalDark', 0x27272a, 0.85, 0.05);
    const matChrome = getMat(P, 'metalChrome', 0xe2e8f0, 0.15, 0.85);

    // Chasis / cubierta estampada de acero rojo
    const deck = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.18, 0.88), matRedDeck);
    deck.position.y = 0.20;

    // Motor vertical de 4 tiempos con tirador de arranque
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.20, 0.28, 16), matEngineBlack);
    motor.position.set(0, 0.40, -0.06);

    const pullCord = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 12), matChrome);
    pullCord.position.set(0, 0.56, -0.06);

    // 4 Ruedas de goma con tapacubos
    [-0.36, 0.36].forEach(x => {
      [-0.32, 0.32].forEach(z => {
        const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.07, 16), matRubber);
        tire.rotation.z = Math.PI / 2;
        tire.position.set(x, 0.13, z);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12), matChrome);
        hub.rotation.z = Math.PI / 2;
        hub.position.set(x, 0.13, z);
        g.add(tire, hub);
      });
    });

    // Bolsa recolectora trasera de hierba (Catcher Bag)
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.28, 0.52), matEngineBlack);
    bag.position.set(0, 0.26, -0.65);

    // Manillar en U ergonómico alto inclinado a 45 grados
    const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.25, 8), matChrome);
    handleL.rotation.x = -Math.PI / 3.8;
    handleL.position.set(-0.25, 0.72, -0.62);

    const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.25, 8), matChrome);
    handleR.rotation.x = -Math.PI / 3.8;
    handleR.position.set(0.25, 0.72, -0.62);

    const handleCross = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.52, 8), matEngineBlack);
    handleCross.rotation.z = Math.PI / 2;
    handleCross.position.set(0, 1.15, -1.02);

    g.add(deck, motor, pullCord, bag, handleL, handleR, handleCross);
    return g;
  }

  // Carretilla de Jardinería (Wheelbarrow)
  function buildWheelbarrowMesh(P) {
    const g = new THREE.Group();
    const matGreenTub = getMat(P, 'leafGreen1', 0x166534, 0.35, 0.3);
    const matWoodHandle = getMat(P, 'woodOak', 0x9a6234, 0.45, 0.05);
    const matTire = getMat(P, 'metalDark', 0x18181b, 0.8, 0.05);
    const matSoil = getMat(P, 'soilDark', 0x29180d, 0.85, 0.0);

    // Batea trapezoidal inclinada profunda
    const tub = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.34, 0.98), matGreenTub);
    tub.position.set(0, 0.44, 0.05);

    // Montón de tierra negra fértil dentro de la carretilla
    const soilMound = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35, 1), matSoil);
    soilMound.scale.set(1.4, 0.5, 1.8);
    soilMound.position.set(0, 0.54, 0.05);

    // Rueda neumática frontal con eje
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.08, 16), matTire);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(0, 0.19, 0.65);

    // Dos brazos de madera y empuñaduras traseras
    [-0.24, 0.24].forEach(x => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 1.45), matWoodHandle);
      arm.position.set(x, 0.33, -0.18);
      arm.rotation.x = 0.14;

      // Pata de apoyo vertical
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.28, 0.035), matWoodHandle);
      leg.position.set(x, 0.14, -0.32);
      g.add(arm, leg);
    });

    g.add(tub, soilMound, wheel);
    return g;
  }

  // Asador / Parrilla BBQ de Tambor con Brasas Incandescentes
  function buildBBQGrillMesh(P) {
    const g = new THREE.Group();
    const matSmokerBlack = getMat(P, 'metalDark', 0x18181b, 0.35, 0.4);
    const matChrome = getMat(P, 'metalChrome', 0xe2e8f0, 0.15, 0.85);
    const matEmbers = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 1.8,
      roughness: 0.6
    });
    const matWoodShelf = getMat(P, 'woodPine', 0xb47b38, 0.45, 0.05);

    // Tambor horizontal ahumador
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.1, 16), matSmokerBlack);
    drum.rotation.z = Math.PI / 2;
    drum.position.y = 0.88;

    // Tapa superior abatible abierta
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 1.08, 20, 1, false, 0, Math.PI), matSmokerBlack);
    lid.rotation.z = Math.PI / 2;
    lid.rotation.x = -0.55;
    lid.position.set(0, 1.05, -0.15);

    // Brasas ardientes al rojo vivo en el fondo
    const coals = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.06, 0.55), matEmbers);
    coals.position.set(0, 0.76, 0);

    // Rejilla de cocción cromada
    const grate = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.02, 0.58), matChrome);
    grate.position.set(0, 0.87, 0);

    // Chimenea vertical lateral con sombrerete
    const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.55, 12), matSmokerBlack);
    chimney.position.set(0.42, 1.35, -0.18);
    const chimneyCap = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.08, 12), matSmokerBlack);
    chimneyCap.position.set(0.42, 1.64, -0.18);

    // Estante frontal de madera para utensilios
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.03, 0.28), matWoodShelf);
    shelf.position.set(0, 0.82, 0.45);

    // Patas tubulares del carrito
    [-0.44, 0.44].forEach(x => {
      [-0.24, 0.24].forEach(z => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.82, 8), matSmokerBlack);
        leg.position.set(x, 0.41, z);
        g.add(leg);
      });
    });

    g.add(drum, lid, coals, grate, chimney, chimneyCap, shelf);
    return g;
  }

  // Invernadero de Jardín de Cristal a Dos Aguas con Tomateras Interiores
  function buildGreenhouseMesh(P) {
    const g = new THREE.Group();
    const matFrame = getMat(P, 'metalChrome', 0xf8fafc, 0.3, 0.3); // Aluminio blanco
    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.35,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.75,
      ior: 1.45
    });
    const matPlantGreen = getMat(P, 'leafGreen1', 0x15803d, 0.6, 0.05);
    const matTomatoRed = getMat(P, 'flowerRed', 0xef4444, 0.3, 0.05);
    const matBench = getMat(P, 'woodPine', 0xb47b38, 0.5, 0.05);

    // Paredes transparentes de cristal
    const glassWalls = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 1.8), matGlass);
    glassWalls.position.y = 0.70;

    // Tejado a dos aguas transparente
    const roofP1 = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.03, 1.15), matGlass);
    roofP1.position.set(0, 1.72, 0.44);
    roofP1.rotation.x = Math.PI / 5;

    const roofP2 = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.03, 1.15), matGlass);
    roofP2.position.set(0, 1.72, -0.44);
    roofP2.rotation.x = -Math.PI / 5;

    // Marcos esquineros de aluminio blanco
    [-1.08, 1.08].forEach(x => {
      [-0.88, 0.88].forEach(z => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.42, 0.06), matFrame);
        pillar.position.set(x, 0.71, z);
        g.add(pillar);
      });
    });

    // Bancos de cultivo interiores y tomateras
    [-0.55, 0.55].forEach(z => {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.45), matBench);
      bench.position.set(0, 0.55, z);
      g.add(bench);

      // 3 Macetas con tomateras y frutos rojos
      [-0.6, 0, 0.6].forEach(x => {
        const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 1), matPlantGreen);
        bush.position.set(x, 0.75, z);
        const tom = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), matTomatoRed);
        tom.position.set(x + 0.08, 0.72, z + 0.10);
        g.add(bush, tom);
      });
    });

    g.add(glassWalls, roofP1, roofP2);
    return g;
  }

  // Pala de Jardinería con Mango en D
  function buildShovelMesh(P) {
    const g = new THREE.Group();
    const matSteel = getMat(P, 'metalChrome', 0x94a3b8, 0.25, 0.7);
    const matAshWood = getMat(P, 'woodPine', 0xd4a373, 0.4, 0.05);

    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.02), matSteel);
    blade.position.y = 0.14;

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.85, 10), matAshWood);
    shaft.position.y = 0.68;

    const dHandle = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.016, 8, 16), matSteel);
    dHandle.position.y = 1.12;

    g.add(blade, shaft, dHandle);
    return g;
  }

  // Rastrillo de Hojas con Varillas Metálicas
  function buildRakeMesh(P) {
    const g = new THREE.Group();
    const matTines = getMat(P, 'metalDark', 0x334155, 0.3, 0.7);
    const matWood = getMat(P, 'woodOak', 0xa16207, 0.4, 0.05);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.35, 8), matWood);
    shaft.position.y = 0.70;

    const crossHead = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.03, 0.03), matTines);
    crossHead.position.y = 0.06;
    g.add(shaft, crossHead);

    for (let i = -7; i <= 7; i++) {
      const tine = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.12, 6), matTines);
      tine.position.set(i * 0.035, 0.01, 0);
      g.add(tine);
    }
    return g;
  }

  // Regadera Clásica Británica con Pitorro de Latón y Asa TubeGeometry
  function buildWateringCanMesh(P) {
    const g = new THREE.Group();
    const matGreenBody = getMat(P, 'leafGreen2', 0x15803d, 0.32, 0.35);
    const matBrass = getMat(P, 'metalBrass', 0xf59e0b, 0.18, 0.88);

    const canBody = typeof globalScope.createLatheProfileMesh === 'function'
      ? globalScope.createLatheProfileMesh([
          [0.0, 0.0], [0.18, 0.0], [0.17, 0.28], [0.14, 0.32], [0.09, 0.33]
        ], matGreenBody, 22)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.32, 18), matGreenBody);

    const spout = typeof globalScope.createTubeHandleMesh === 'function'
      ? globalScope.createTubeHandleMesh([[0.15, 0.12, 0], [0.24, 0.24, 0], [0.34, 0.40, 0]], 0.022, matBrass)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.032, 0.42, 12), matBrass);

    const roseHead = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.028, 0.045, 18), matBrass);
    roseHead.position.set(0.35, 0.42, 0);
    roseHead.rotation.z = -Math.PI / 3.6;

    const handle = typeof globalScope.createTubeHandleMesh === 'function'
      ? globalScope.createTubeHandleMesh([[0.04, 0.32, 0], [-0.08, 0.44, 0], [-0.24, 0.30, 0], [-0.22, 0.12, 0], [-0.15, 0.08, 0]], 0.016, matGreenBody)
      : new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.018, 8, 20, Math.PI * 1.1), matGreenBody);

    g.add(canBody, spout, roseHead, handle);
    return g;
  }

  // Fuente de Jardín de 2 Niveles con Cascadas de Agua
  function buildFountainMesh(P) {
    const g = new THREE.Group();
    const matStone = getMat(P, 'stonePaver', 0x94a3b8, 0.6, 0.08);
    const matWater = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      roughness: 0.05,
      transmission: 0.8
    });

    // Cuenca inferior amplia
    const baseBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.80, 0.35, 16), matStone);
    baseBowl.position.y = 0.22;
    const baseWater = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 0.05, 16), matWater);
    baseWater.position.y = 0.36;

    // Pedestal central
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.75, 16), matStone);
    pillar.position.y = 0.72;

    // Cuenca superior más pequeña
    const topBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.42, 0.25, 16), matStone);
    topBowl.position.y = 1.18;
    const topWater = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.04, 16), matWater);
    topWater.position.y = 1.28;

    // Cascada de agua translúcida cayendo entre niveles
    const cascade = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.75, 0.65, 18, 1, true), matWater);
    cascade.position.y = 0.78;

    g.add(baseBowl, baseWater, pillar, topBowl, topWater, cascade);
    return g;
  }

  // Baño de Pájaros de Piedra con Ave Posada en el Borde
  function buildBirdbathMesh(P) {
    const g = new THREE.Group();
    const matStone = getMat(P, 'stonePaver', 0xa8a29e, 0.7, 0.05);
    const matWater = getMat(P, 'glassClear', 0x38bdf8, 0.1, 0.0);
    const matBirdBlue = getMat(P, 'emissiveScreen', 0x0284c7, 0.4, 0.1);
    const matBirdBeak = getMat(P, 'metalBrass', 0xf59e0b, 0.3, 0.2);

    const baseCol = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.82, 16), matStone);
    baseCol.position.y = 0.41;

    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.32, 0.16, 16), matStone);
    dish.position.y = 0.88;

    const water = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.03, 16), matWater);
    water.position.y = 0.94;

    // Pájaro posado en el borde
    const birdBody = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), matBirdBlue);
    birdBody.position.set(0.36, 1.02, 0);

    const birdBeak = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.04, 6), matBirdBeak);
    birdBeak.rotation.z = -Math.PI / 2;
    birdBeak.position.set(0.43, 1.02, 0);

    g.add(baseCol, dish, water, birdBody, birdBeak);
    return g;
  }

  // Banco de Parque en Hierro Forjado y Listones de Roble
  function buildParkBenchMesh(P) {
    const g = new THREE.Group();
    const matIron = getMat(P, 'metalDark', 0x1e293b, 0.4, 0.6);
    const matOak = getMat(P, 'woodOak', 0xa16207, 0.35, 0.05);

    // Laterales de hierro forjado con volutas curvas
    [-0.95, 0.95].forEach(x => {
      const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.06), matIron);
      leg1.position.set(x, 0.24, -0.22);
      const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.06), matIron);
      leg2.position.set(x, 0.24, 0.22);
      const backPost = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.88, 0.06), matIron);
      backPost.position.set(x, 0.48, -0.25);
      g.add(leg1, leg2, backPost);
    });

    // 4 Listones de roble en el asiento
    [-0.15, -0.05, 0.05, 0.15].forEach(z => {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.035, 0.08), matOak);
      slat.position.set(0, 0.48, z);
      g.add(slat);
    });

    // 3 Listones de roble en el respaldo
    [0.65, 0.75, 0.85].forEach(y => {
      const backSlat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.075, 0.03), matOak);
      backSlat.position.set(0, y, -0.25);
      g.add(backSlat);
    });

    return g;
  }

  // Cerca de Madera Blanca con Piquetes Góticos Puntiagudos
  function buildPicketFenceMesh(P) {
    const g = new THREE.Group();
    const matWhite = getMat(P, 'crownWhite', 0xf8fafc, 0.35, 0.05);

    // Rieles horizontales
    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 0.04), matWhite);
    rail1.position.set(0, 0.35, 0);
    const rail2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 0.04), matWhite);
    rail2.position.set(0, 0.72, 0);
    g.add(rail1, rail2);

    // 9 Piquetes verticales con punta gótica en flecha
    for (let i = -4; i <= 4; i++) {
      const picket = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.82, 0.025), matWhite);
      picket.position.set(i * 0.24, 0.45, 0.02);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.16, 4), matWhite);
      tip.rotation.y = Math.PI / 4;
      tip.position.set(i * 0.24, 0.94, 0.02);
      g.add(picket, tip);
    }
    return g;
  }

  // Roble Volumétrico Majestuoso (Oak Tree)
  function buildOakTreeMesh(P) {
    const g = new THREE.Group();
    const matBark = getMat(P, 'trunkBark', 0x3e1f0d, 0.85, 0.05);
    const matLeaves = getMat(P, 'leafGreen1', 0x15803d, 0.75, 0.05);

    // Tronco robusto con ensanchamiento en raíces
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.65, 3.2, 16), matBark);
    trunk.position.y = 1.6;

    // Ramas principales
    [-0.5, 0.5].forEach(rx => {
      const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.4, 10), matBark);
      branch.rotation.z = rx * 0.75;
      branch.position.set(rx * 0.6, 2.7, 0);
      g.add(branch);
    });

    // 4 Cúmulos volumétricos de follaje frondoso
    const foliageCluster1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), matLeaves);
    foliageCluster1.position.set(0, 4.4, 0);

    const foliageCluster2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), matLeaves);
    foliageCluster2.position.set(-1.1, 3.8, 0.4);

    const foliageCluster3 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), matLeaves);
    foliageCluster3.position.set(1.1, 3.8, -0.4);

    g.add(trunk, foliageCluster1, foliageCluster2, foliageCluster3);
    return g;
  }

  // Arbusto Floral con Rosas Florecidas (Flower Bush)
  function buildFlowerBushMesh(P) {
    const g = new THREE.Group();
    const matGreen = getMat(P, 'leafGreen2', 0x166534, 0.65, 0.05);
    const matRoseRed = getMat(P, 'flowerRed', 0xe11d48, 0.3, 0.05);
    const matRosePink = getMat(P, 'flowerRed', 0xf43f5e, 0.3, 0.05);

    const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), matGreen);
    bush.position.y = 0.65;
    g.add(bush);

    // Decenas de pequeñas rosas salpicadas en la copa
    for (let r = 0; r < 14; r++) {
      const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), r % 2 === 0 ? matRoseRed : matRosePink);
      const angle = (r / 14) * Math.PI * 2;
      blossom.position.set(Math.cos(angle) * 0.65, 0.55 + (r % 3) * 0.18, Math.sin(angle) * 0.65);
      g.add(blossom);
    }
    return g;
  }

  // Farol Victoriano de Jardín (Street Lantern)
  function buildStreetLanternMesh(P) {
    const g = new THREE.Group();
    const matIron = getMat(P, 'metalDark', 0x0f172a, 0.35, 0.6);
    const matBulb = getMat(P, 'emissiveOrange', 0xfef08a);
    const matGlass = getMat(P, 'glassClear', 0xe0f2fe, 0.1, 0.05);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 2.8, 12), matIron);
    pole.position.y = 1.4;

    const lanternCage = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.42), matGlass);
    lanternCage.position.y = 2.85;

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), matBulb);
    bulb.position.y = 2.85;

    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.22, 4), matIron);
    cap.position.y = 3.22;
    cap.rotation.y = Math.PI / 4;

    g.add(pole, lanternCage, bulb, cap);
    return g;
  }

  // Buzón de Correo Rural Americano con Bandera Roja (Mailbox)
  function buildMailboxMesh(P) {
    const g = new THREE.Group();
    const matWoodPost = getMat(P, 'woodPine', 0x9a6234, 0.5, 0.05);
    const matSteel = getMat(P, 'metalChrome', 0xe2e8f0, 0.2, 0.7);
    const matFlag = getMat(P, 'flowerRed', 0xef4444, 0.3, 0.1);

    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.25, 0.12), matWoodPost);
    post.position.y = 0.625;

    // Caja semicilíndrica abovedada
    const boxBody = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.25, 0.65), matSteel);
    boxBody.position.set(0, 1.25, 0.12);

    const dome = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.65, 16, 1, false, 0, Math.PI), matSteel);
    dome.rotation.x = Math.PI / 2;
    dome.position.set(0, 1.375, 0.12);

    // Banderita roja levantada
    const flag = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.18, 0.08), matFlag);
    flag.position.set(0.18, 1.35, -0.15);

    g.add(post, boxBody, dome, flag);
    return g;
  }

  // Sombrilla de Terraza Abierta (Patio Umbrella)
  function buildPatioUmbrellaMesh(P) {
    const g = new THREE.Group();
    const matFabric = getMat(P, 'fabricTerracotta', 0xea580c, 0.7, 0.05);
    const matPole = getMat(P, 'woodOak', 0x9a6234, 0.35, 0.05);
    const matBase = getMat(P, 'metalDark', 0x1e293b, 0.4, 0.4);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.08, 16), matBase);
    base.position.y = 0.04;

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.6, 12), matPole);
    pole.position.y = 1.3;

    const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.65, 0.55, 8), matFabric);
    canopy.position.y = 2.45;

    g.add(base, pole, canopy);
    return g;
  }

  // ============================================================================
  // ARQUITECTO PRINCIPAL DE ESCENA 1: ESPACIO (buildSpaceScene)
  // ============================================================================
  function buildSpaceScene(targetRoot, objects) {
    if (typeof THREE === 'undefined') return;
    const w3d = globalScope.World3D || {};
    const root = targetRoot || (w3d.scene ? (w3d.scene.getObjectByName('ScenarioDynamicRoot') || w3d.scene) : null);
    if (!root) return;

    // 1. Limpieza profunda del escenario anterior (remover cualquier mueble o lámpara residual)
    while (root.children.length > 0) {
      const child = root.children[0];
      root.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    }

    // 2. Fondo cósmico azul profundo y niebla astronómica
    const activeScene = w3d.scene || root;
    if (activeScene.isScene) {
      activeScene.background = new THREE.Color(0x020617);
      activeScene.fog = new THREE.FogExp2(0x020617, 0.001);
    }

    // 3. Campo de Estrellas Profundo (Points)
    const starCount = 650;
    const starPositions = new Float32Array(starCount * 3);
    for (let s = 0; s < starCount; s++) {
      const r = 22 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[s * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[s * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[s * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xf8fafc, size: 0.16, transparent: true, opacity: 0.95 });
    root.add(new THREE.Points(starGeo, starMat));

    // 4. Anillos Orbitales Planetarios
    [3.2, 4.4, 5.8, 7.2, 9.6, 11.8, 14.2].forEach((radius, idx) => {
      const orbit = new THREE.Mesh(
        new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64),
        new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? 0x38bdf8 : 0x818cf8, side: THREE.DoubleSide, transparent: true, opacity: 0.22 })
      );
      orbit.rotation.x = Math.PI / 2;
      orbit.position.y = 2.2;
      root.add(orbit);
    });

    // 5. Lista de objetos del catálogo espacial
    const scenObjects = objects || (w3d.WORLD_TOUR_SCENARIOS && w3d.WORLD_TOUR_SCENARIOS.space ? w3d.WORLD_TOUR_SCENARIOS.space.objects : []);
    const P = w3d.SHARED_MATERIALS || {};

    // Texturas procedurales cacheadas
    const sunTex = generateSunTexture();
    const earthTex = generateEarthTexture();
    const cloudTex = generateEarthCloudsTexture();
    const marsTex = generateMarsTexture();
    const jupiterTex = generateJupiterTexture();
    const saturnTex = generateSaturnTexture();
    const saturnRingTex = generateSaturnRingsTexture();
    const blackHoleAccretionTex = generateBlackHoleAccretionTexture();

    scenObjects.forEach(item => {
      let g = new THREE.Group();
      g.name = item.en || item.id;
      const id = item.id || '';
      const en = (item.en || '').toLowerCase();

      // Despacho por objeto espacial específico
      if (id === 'space_sun' || en === 'sun') {
        const matSun = new THREE.MeshStandardMaterial({
          map: sunTex,
          emissive: 0xff7700,
          emissiveMap: sunTex,
          emissiveIntensity: 1.5,
          roughness: 0.3
        });
        const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(1.65, 16, 16), matSun);
        // Corona volumétrica
        const coronaMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.30, side: THREE.BackSide });
        const corona = new THREE.Mesh(new THREE.SphereGeometry(2.15, 16, 16), coronaMat);
        const sunLight = new THREE.PointLight(0xfff7ed, 2.5, 60);
        sunLight.castShadow = false;
        g.add(sunMesh, corona, sunLight);
      } else if (id === 'space_earth' || en === 'earth') {
        const matEarth = new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.45, metalness: 0.1 });
        const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), matEarth);
        const matCloud = new THREE.MeshStandardMaterial({ map: cloudTex, transparent: true, opacity: 0.42, roughness: 0.6 });
        const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(0.88, 16, 16), matCloud);
        g.add(earthMesh, cloudMesh);
      } else if (id === 'space_mars' || en === 'mars') {
        const matMars = new THREE.MeshStandardMaterial({ map: marsTex, roughness: 0.72, metalness: 0.05 });
        const marsMesh = new THREE.Mesh(new THREE.SphereGeometry(0.58, 14, 14), matMars);
        g.add(marsMesh);
      } else if (id === 'space_jupiter' || en.includes('jupiter')) {
        const matJup = new THREE.MeshStandardMaterial({ map: jupiterTex, roughness: 0.45 });
        const jupMesh = new THREE.Mesh(new THREE.SphereGeometry(1.35, 16, 16), matJup);
        g.add(jupMesh);
      } else if (id === 'space_saturn' || en.includes('saturn')) {
        const matSat = new THREE.MeshStandardMaterial({ map: saturnTex, roughness: 0.4 });
        const satMesh = new THREE.Mesh(new THREE.SphereGeometry(0.95, 16, 16), matSat);
        const ringMat = new THREE.MeshStandardMaterial({
          map: saturnRingTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.88,
          roughness: 0.45
        });
        const rings = new THREE.Mesh(new THREE.RingGeometry(1.28, 2.35, 48), ringMat);
        rings.rotation.x = Math.PI / 2.3;
        g.add(satMesh, rings);
      } else if (id === 'space_black_hole' || en.includes('black hole')) {
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const core = new THREE.Mesh(new THREE.SphereGeometry(0.68, 16, 16), coreMat);
        const diskMat = new THREE.MeshBasicMaterial({
          map: blackHoleAccretionTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85
        });
        const disk = new THREE.Mesh(new THREE.RingGeometry(0.72, 1.85, 48), diskMat);
        disk.rotation.x = Math.PI / 2.3;
        // Halo de lente gravitacional (gravitational lensing halo)
        const halo = new THREE.Mesh(new THREE.RingGeometry(1.9, 2.15, 36), new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.35 }));
        halo.rotation.x = Math.PI / 2.3;
        g.add(core, disk, halo);
      } else if (id === 'space_spacecraft' || id === 'space_launch_rocket' || en.includes('rocket') || en.includes('spacecraft')) {
        g = buildHeavyRocketMesh(P);
      } else if (id === 'space_space_station' || en.includes('station')) {
        g = buildSpaceStationMesh(P);
      } else if (id === 'space_lunar_rover' || en.includes('rover')) {
        g = buildLunarRoverMesh(P);
      } else if (id === 'space_astronaut' || id === 'space_spacesuit' || en.includes('astronaut')) {
        g = buildAstronautMesh(P);
      } else if (item.type === 'concept' || item.type === 'phrase' || id.includes('concept') || en.includes('light-year') || en.includes('gravity') || en.includes('vacuum') || en.includes('horizon')) {
        // Conceptos abstractos espaciales: Insignias holográficas limpias (CERO lámparas)
        g = buildSpatialHologramNode(item, P);
      } else if (B[id]) {
        g = B[id](item, 'space', P) || g;
      } else {
        // Objeto espacial genérico modelado limpiamente
        g = buildSpatialHologramNode(item, P);
      }

      // Posicionamiento físico en el espacio
      if (item.pos) {
        g.position.set(item.pos[0], item.pos[1] !== undefined ? item.pos[1] : 2.2, item.pos[2]);
      }

      // Registro de metadatos educativos e interactividad para raycasting
      const px = item.pos ? item.pos[0] : 0;
      const py = item.pos ? item.pos[1] : 2.2;
      const pz = item.pos ? item.pos[2] : 0;
      const meta = {
        id: item.id,
        en: item.en,
        ipa: item.ipa,
        es: item.es,
        category: item.category || 'Outer Space',
        example: item.example,
        type: item.type || 'object',
        wordEn: item.en,
        phonetic: item.ipa,
        wordEs: item.es,
        focusPos: { x: px + (px >= 0 ? -1.8 : 1.8), y: Math.max(2.0, py + 1.6), z: pz + 2.5 },
        lookAtPos: { x: px, y: py, z: pz }
      };
      g.userData = Object.assign({}, meta);
      g.traverse(ch => {
        if (ch.isMesh) {
          ch.userData = Object.assign({}, meta, { parentGroup: g });
        }
      });

      root.add(g);
      if (w3d.interactiveObjects && Array.isArray(w3d.interactiveObjects)) {
        w3d.interactiveObjects.push(g);
      }
    });

    console.log('[MasterENG3D] Mundo SPACE renderizado con éxito (Texturas 1024x512 + Modelos de Ingeniería + CERO Lámparas).');
  }

  // ============================================================================
  // ARQUITECTO PRINCIPAL DE ESCENA 2: JARDÍN (buildGardenScene)
  // ============================================================================
  function buildGardenScene(targetRoot, objects) {
    if (typeof THREE === 'undefined') return;
    const w3d = globalScope.World3D || {};
    const root = targetRoot || (w3d.scene ? (w3d.scene.getObjectByName('ScenarioDynamicRoot') || w3d.scene) : null);
    if (!root) return;

    // 1. Limpieza profunda: Despejar casa, muebles y sofás
    while (root.children.length > 0) {
      const child = root.children[0];
      root.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    }

    const activeScene = w3d.scene || root;
    if (activeScene.isScene) {
      activeScene.background = new THREE.Color(0x091410);
      activeScene.fog = new THREE.FogExp2(0x091410, 0.005);
    }

    const P = w3d.SHARED_MATERIALS || {};

    // 2. Césped exterior amplio y patio de piedra
    const matGrass = getMat(P, 'organicFoliage', 0x15803d, 0.85, 0.05);
    const lawn = new THREE.Mesh(new THREE.PlaneGeometry(32, 32), matGrass);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(0, -0.01, 10);
    lawn.receiveShadow = false;
    root.add(lawn);

    // Terraza de losetas de piedra bajo la zona de asador y banca
    const matPatio = getMat(P, 'stonePaver', 0x78716c, 0.65, 0.05);
    const patio = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.04, 6.5), matPatio);
    patio.position.set(3.5, 0.02, 9.2);
    patio.receiveShadow = false;
    root.add(patio);

    // Setos perimetrales altos
    const matHedge = getMat(P, 'leafGreen3', 0x14532d, 0.85, 0.05);
    [-12, 12].forEach(hx => {
      const hedgeSide = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 28), matHedge);
      hedgeSide.position.set(hx, 1.1, 10);
      root.add(hedgeSide);
    });
    const hedgeBack = new THREE.Mesh(new THREE.BoxGeometry(25, 2.2, 0.8), matHedge);
    hedgeBack.position.set(0, 1.1, -3.5);
    root.add(hedgeBack);

    // 3. Luces ambientales y luz solar directa
    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.6);
    sunLight.position.set(8, 14, 12);
    root.add(sunLight);

    // 4. Objetos del jardín
    const scenObjects = objects || (w3d.WORLD_TOUR_SCENARIOS && w3d.WORLD_TOUR_SCENARIOS.garden ? w3d.WORLD_TOUR_SCENARIOS.garden.objects : []);

    scenObjects.forEach(item => {
      let g = new THREE.Group();
      g.name = item.en || item.id;
      const id = item.id || '';
      const en = (item.en || '').toLowerCase();

      if (id === 'garden_lawn_mower' || en.includes('mower')) {
        g = buildLawnMowerMesh(P);
      } else if (id === 'garden_wheelbarrow' || en.includes('wheelbarrow')) {
        g = buildWheelbarrowMesh(P);
      } else if (id === 'garden_bbq_grill' || en.includes('grill') || en.includes('barbecue')) {
        g = buildBBQGrillMesh(P);
      } else if (id === 'garden_greenhouse' || en.includes('greenhouse')) {
        g = buildGreenhouseMesh(P);
      } else if (id === 'garden_shovel' || en.includes('shovel')) {
        g = buildShovelMesh(P);
      } else if (id === 'garden_rake' || en.includes('rake')) {
        g = buildRakeMesh(P);
      } else if (id === 'garden_watering_can' || en.includes('watering can')) {
        g = buildWateringCanMesh(P);
      } else if (id === 'garden_fountain' || en.includes('fountain')) {
        g = buildFountainMesh(P);
      } else if (id === 'garden_birdbath' || en.includes('birdbath')) {
        g = buildBirdbathMesh(P);
      } else if (id === 'park_bench' || en.includes('bench')) {
        g = buildParkBenchMesh(P);
      } else if (id === 'garden_picket_fence' || en.includes('picket fence')) {
        g = buildPicketFenceMesh(P);
      } else if (id === 'oak_tree' || en.includes('oak tree')) {
        g = buildOakTreeMesh(P);
      } else if (id === 'flower_bush' || en.includes('flower bush')) {
        g = buildFlowerBushMesh(P);
      } else if (id === 'street_lantern' || en.includes('lantern')) {
        g = buildStreetLanternMesh(P);
      } else if (id === 'garden_patio_umbrella' || en.includes('umbrella')) {
        g = buildPatioUmbrellaMesh(P);
      } else if (id === 'mailbox' || en.includes('mailbox')) {
        g = buildMailboxMesh(P);
      } else if (B[id]) {
        g = B[id](item, 'garden', P) || g;
      } else if (item.type === 'concept' || item.type === 'phrase') {
        // Concepto natural: pedestal orgánico con insignia
        g = buildSpatialHologramNode(item, P);
      } else {
        g = buildFlowerBushMesh(P);
      }

      if (item.pos) {
        g.position.set(item.pos[0], item.pos[1] !== undefined ? item.pos[1] : 0, item.pos[2]);
      }

      const px = item.pos ? item.pos[0] : 0;
      const py = item.pos ? item.pos[1] : 0;
      const pz = item.pos ? item.pos[2] : 8;
      const meta = {
        id: item.id,
        en: item.en,
        ipa: item.ipa,
        es: item.es,
        category: item.category || 'Garden & Yard',
        example: item.example,
        type: item.type || 'object',
        wordEn: item.en,
        phonetic: item.ipa,
        wordEs: item.es,
        focusPos: { x: px + (px >= 0 ? -1.6 : 1.6), y: Math.max(1.5, py + 1.4), z: pz + 2.2 },
        lookAtPos: { x: px, y: py + 0.5, z: pz }
      };
      g.userData = Object.assign({}, meta);
      if (typeof globalScope.attachContactShadow === 'function') {
        globalScope.attachContactShadow(g, 0.38);
      }
      g.traverse(ch => {
        if (ch.isMesh) {
          ch.castShadow = false;
          ch.receiveShadow = false;
          ch.userData = Object.assign({}, meta, { parentGroup: g });
        }
      });

      root.add(g);
      if (w3d.interactiveObjects && Array.isArray(w3d.interactiveObjects)) {
        w3d.interactiveObjects.push(g);
      }
    });

    console.log('[MasterENG3D] Mundo GARDEN renderizado con éxito (Entorno exterior real + Herramientas físicas).');
  }

  // Exportar constructores principales
  B.buildSpaceScene = buildSpaceScene;
  B.buildGardenScene = buildGardenScene;

  // Registrar constructores de elementos individuales para compatibilidad
  B['space_sun'] = function(item, scen, P) { return buildSpaceScene(null, [item]); };
  B['space_earth'] = function(item, scen, P) { return buildSpaceScene(null, [item]); };
  B['space_mars'] = function(item, scen, P) { return buildSpaceScene(null, [item]); };
  B['space_jupiter'] = function(item, scen, P) { return buildSpaceScene(null, [item]); };
  B['space_saturn'] = function(item, scen, P) { return buildSpaceScene(null, [item]); };
  B['space_spacecraft'] = function(item, scen, P) { return buildHeavyRocketMesh(P); };
  B['space_launch_rocket'] = function(item, scen, P) { return buildHeavyRocketMesh(P); };
  B['space_space_station'] = function(item, scen, P) { return buildSpaceStationMesh(P); };
  B['space_lunar_rover'] = function(item, scen, P) { return buildLunarRoverMesh(P); };
  B['space_astronaut'] = function(item, scen, P) { return buildAstronautMesh(P); };
  B['garden_lawn_mower'] = function(item, scen, P) { return buildLawnMowerMesh(P); };
  B['garden_wheelbarrow'] = function(item, scen, P) { return buildWheelbarrowMesh(P); };
  B['garden_bbq_grill'] = function(item, scen, P) { return buildBBQGrillMesh(P); };
  B['garden_greenhouse'] = function(item, scen, P) { return buildGreenhouseMesh(P); };
  B['garden_shovel'] = function(item, scen, P) { return buildShovelMesh(P); };
  B['garden_rake'] = function(item, scen, P) { return buildRakeMesh(P); };
  B['garden_watering_can'] = function(item, scen, P) { return buildWateringCanMesh(P); };
  B['garden_fountain'] = function(item, scen, P) { return buildFountainMesh(P); };
  B['garden_birdbath'] = function(item, scen, P) { return buildBirdbathMesh(P); };
  B['park_bench'] = function(item, scen, P) { return buildParkBenchMesh(P); };
  B['garden_picket_fence'] = function(item, scen, P) { return buildPicketFenceMesh(P); };
  B['oak_tree'] = function(item, scen, P) { return buildOakTreeMesh(P); };
  B['flower_bush'] = function(item, scen, P) { return buildFlowerBushMesh(P); };
  B['street_lantern'] = function(item, scen, P) { return buildStreetLanternMesh(P); };
  B['garden_patio_umbrella'] = function(item, scen, P) { return buildPatioUmbrellaMesh(P); };
  B['mailbox'] = function(item, scen, P) { return buildMailboxMesh(P); };
  B['garden_sprinkler'] = function(item, scen, P) {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.06, 16), getMat(P, 'leafGreen2', 0x166534));
    base.position.y = 0.03;
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.16, 12), getMat(P, 'metalBrass', 0xf59e0b));
    nozzle.position.y = 0.12;
    g.add(base, nozzle);
    return g;
  };
  B['garden_stone_path'] = function(item, scen, P) {
    const g = new THREE.Group();
    [-0.4, 0, 0.4].forEach((z, i) => {
      const paver = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.04, 8), getMat(P, 'stonePaver', 0x94a3b8));
      paver.position.set(i % 2 === 0 ? 0.06 : -0.06, 0.02, z);
      g.add(paver);
    });
    return g;
  };
  B['garden_stepping_stones'] = B['garden_stone_path'];
  B['garden_birdhouse'] = function(item, scen, P) {
    const g = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), getMat(P, 'woodOak', 0x9a6234));
    post.position.y = 0.6;
    const house = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 0.22), getMat(P, 'woodOak', 0x9a6234));
    house.position.y = 1.35;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.18, 4), getMat(P, 'woodWalnut', 0x5c2e14));
    roof.position.y = 1.58;
    roof.rotation.y = Math.PI / 4;
    g.add(post, house, roof);
    return g;
  };
  B['garden_terracotta_pot'] = function(item, scen, P) {
    const g = new THREE.Group();
    const terraMat = getMat(P, 'terracottaPot', 0xc2410c, 0.65, 0.04);
    const pot = typeof globalScope.createLatheProfileMesh === 'function'
      ? globalScope.createLatheProfileMesh([
          [0.0, 0.0], [0.14, 0.0], [0.21, 0.28], [0.24, 0.29], [0.24, 0.35], [0.20, 0.35], [0.19, 0.30]
        ], terraMat, 24)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.15, 0.34, 18), terraMat);
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.18, 0.03, 18), getMat(P, 'woodDark', 0x3e1f0d, 0.9));
    soil.position.y = 0.30;
    const plant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 1), getMat(P, 'leafGreen3', 0x15803d, 0.6));
    plant.position.y = 0.44;
    const bloom1 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), getMat(P, 'flowerRed', 0xe11d48));
    bloom1.position.set(0.08, 0.56, 0.04);
    const bloom2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), getMat(P, 'metalBrass', 0xfacc15));
    bloom2.position.set(-0.07, 0.54, -0.05);
    g.add(pot, soil, plant, bloom1, bloom2);
    return g;
  };
  B['garden_hose'] = function(item, scen, P) {
    const g = new THREE.Group();
    const hoseMat = getMat(P, 'leafGreen1', 0x14532d, 0.45, 0.1);
    const coil1 = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.035, 12, 24), hoseMat);
    coil1.rotation.x = Math.PI / 2;
    coil1.position.y = 0.035;
    const coil2 = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.035, 12, 24), hoseMat);
    coil2.rotation.x = Math.PI / 2;
    coil2.position.y = 0.085;
    if (typeof globalScope.createTubeHandleMesh === 'function') {
      const lead = globalScope.createTubeHandleMesh([[0.21, 0.09, 0], [0.32, 0.14, 0.12], [0.38, 0.18, 0.22]], 0.028, hoseMat);
      g.add(lead);
    }
    const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.09, 12), getMat(P, 'metalBrass', 0xf59e0b, 0.2, 0.85));
    nozzle.rotation.x = Math.PI / 2;
    nozzle.position.set(0.39, 0.19, 0.26);
    g.add(coil1, coil2, nozzle);
    return g;
  };
  B['garden_pruning_shears'] = function(item, scen, P) {
    const g = new THREE.Group();
    const steelMat = getMat(P, 'metalChrome', 0xe2e8f0, 0.18, 0.92);
    const gripMat = getMat(P, 'flowerRed', 0xdc2626, 0.45, 0.1);
    const bladeL = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.008, 0.16), steelMat);
    bladeL.position.set(-0.015, 0.02, -0.07);
    bladeL.rotation.y = 0.18;
    const bladeR = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.008, 0.16), steelMat);
    bladeR.position.set(0.015, 0.024, -0.07);
    bladeR.rotation.y = -0.18;
    const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.018, 12), getMat(P, 'metalBrass', 0xf59e0b));
    pivot.position.set(0, 0.022, 0);
    if (typeof globalScope.createTubeHandleMesh === 'function') {
      const hL = globalScope.createTubeHandleMesh([[-0.012, 0.02, 0.01], [-0.045, 0.02, 0.10], [-0.055, 0.02, 0.19]], 0.014, gripMat);
      const hR = globalScope.createTubeHandleMesh([[0.012, 0.02, 0.01], [0.045, 0.02, 0.10], [0.055, 0.02, 0.19]], 0.014, gripMat);
      g.add(hL, hR);
    }
    g.add(bladeL, bladeR, pivot);
    return g;
  };
  B['garden_trowel'] = function(item, scen, P) {
    const g = new THREE.Group();
    const steelMat = getMat(P, 'metalChrome', 0xe2e8f0, 0.18, 0.9);
    const woodMat = getMat(P, 'woodOak', 0x9a6234, 0.42, 0.05);
    const handle = typeof globalScope.createLatheProfileMesh === 'function'
      ? globalScope.createLatheProfileMesh([[0.0, 0.0], [0.022, 0.0], [0.026, 0.08], [0.018, 0.15], [0.0, 0.15]], woodMat, 16)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.15, 14), woodMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(0, 0.03, 0.06);
    const scoop = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.012, 0.18, 14, 1, false, 0, Math.PI), steelMat);
    scoop.rotation.x = Math.PI / 2;
    scoop.position.set(0, 0.025, -0.06);
    g.add(handle, scoop);
    return g;
  };
  B['garden_picnic_basket'] = function(item, scen, P) {
    const g = new THREE.Group();
    const wickerMat = getMat(P, 'woodPine', 0xb47b38, 0.65, 0.04);
    const clothMat = getMat(P, 'flowerRed', 0xdc2626, 0.72, 0.02);
    const body = typeof globalScope.createBeveledBoxExtrude === 'function'
      ? globalScope.createBeveledBoxExtrude(0.46, 0.24, 0.32, wickerMat, 0.016, 0.012)
      : new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.24, 0.32), wickerMat);
    body.position.y = 0.12;
    const clothTrim = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.04, 0.34), clothMat);
    clothTrim.position.y = 0.23;
    const flapL = typeof globalScope.createBeveledBoxExtrude === 'function'
      ? globalScope.createBeveledBoxExtrude(0.22, 0.02, 0.31, wickerMat, 0.008, 0.006)
      : new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.31), wickerMat);
    flapL.position.set(-0.11, 0.26, 0);
    flapL.rotation.z = 0.18;
    const flapR = typeof globalScope.createBeveledBoxExtrude === 'function'
      ? globalScope.createBeveledBoxExtrude(0.22, 0.02, 0.31, wickerMat, 0.008, 0.006)
      : new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.31), wickerMat);
    flapR.position.set(0.11, 0.26, 0);
    flapR.rotation.z = -0.18;
    if (typeof globalScope.createTubeHandleMesh === 'function') {
      const arch = globalScope.createTubeHandleMesh([[0, 0.24, -0.15], [0, 0.42, 0], [0, 0.24, 0.15]], 0.015, wickerMat);
      g.add(arch);
    }
    g.add(body, clothTrim, flapL, flapR);
    return g;
  };
  B['garden_lantern'] = function(item, scen, P) {
    const g = new THREE.Group();
    const ironMat = getMat(P, 'metalDark', 0x1e293b, 0.35, 0.75);
    const glassMat = getMat(P, 'glassClear', 0xe0f2fe, 0.1, 0.05);
    const bulbMat = getMat(P, 'emissiveOrange', 0xfef08a);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.03, 6), ironMat);
    base.position.y = 0.015;
    const glassBody = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.22, 6), glassMat);
    glassBody.position.y = 0.14;
    const glowCore = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.12, 12), bulbMat);
    glowCore.position.y = 0.13;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.09, 6), ironMat);
    roof.position.y = 0.295;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.006, 8, 16), ironMat);
    ring.position.y = 0.36;
    g.add(base, glassBody, glowCore, roof, ring);
    return g;
  };
  B['garden_hedge_trimmer'] = function(item, scen, P) {
    const g = new THREE.Group();
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.38, 0.01), getMat(P, 'metalChrome', 0xe2e8f0));
    b1.position.y = 0.25;
    const h1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8), getMat(P, 'flowerRed', 0xef4444));
    h1.position.y = 0.05;
    g.add(b1, h1);
    return g;
  };
  B['garden_hammock'] = function(item, scen, P) {
    const g = new THREE.Group();
    const net = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.4, 12, 1, true, 0, Math.PI), getMat(P, 'fabricGold', 0xf59e0b));
    net.rotation.z = Math.PI / 2;
    net.rotation.x = Math.PI;
    net.position.y = 0.55;
    g.add(net);
    return g;
  };
  B['garden_compost_bin'] = function(item, scen, P) {
    const g = new THREE.Group();
    const bin = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.6, 0.65), getMat(P, 'woodDark', 0x3e1f0d));
    bin.position.y = 0.3;
    g.add(bin);
    return g;
  };
  B['garden_patio_heater'] = function(item, scen, P) {
    const g = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.9, 10), getMat(P, 'metalChrome', 0xe2e8f0));
    pole.position.y = 0.95;
    const hood = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.12, 16), getMat(P, 'metalChrome', 0xe2e8f0));
    hood.position.y = 1.92;
    g.add(pole, hood);
    return g;
  };
  B['garden_fire_pit'] = function(item, scen, P) {
    const g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 0.25, 16), getMat(P, 'stoneGray', 0x64748b));
    ring.position.y = 0.125;
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.35, 8), getMat(P, 'emissiveOrange', 0xf97316));
    flame.position.y = 0.32;
    g.add(ring, flame);
    return g;
  };
  B['garden_storage_shed'] = function(item, scen, P) {
    const g = new THREE.Group();
    const shed = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.2), getMat(P, 'woodPine', 0xb47b38));
    shed.position.y = 0.7;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.5, 4), getMat(P, 'woodWalnut', 0x5c2e14));
    roof.position.y = 1.65;
    roof.rotation.y = Math.PI / 4;
    g.add(shed, roof);
    return g;
  };
  B['garden_wind_chime'] = function(item, scen, P) {
    const g = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 12), getMat(P, 'woodWalnut', 0x5c2e14));
    top.position.y = 1.6;
    g.add(top);
    [-0.04, 0.04].forEach((x, i) => {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.4 - i * 0.08, 8), getMat(P, 'metalChrome', 0xe2e8f0));
      rod.position.set(x, 1.35, 0);
      g.add(rod);
    });
    return g;
  };
  B['garden_sunbed'] = function(item, scen, P) {
    const g = new THREE.Group();
    const bed = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.14, 1.6), getMat(P, 'woodOak', 0x9a6234));
    bed.position.y = 0.18;
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.08, 1.55), getMat(P, 'fabricTerracotta', 0xea580c));
    cushion.position.y = 0.28;
    g.add(bed, cushion);
    return g;
  };
  B['garden_pergola'] = function(item, scen, P) {
    const g = new THREE.Group();
    [-0.7, 0.7].forEach(x => {
      [-0.7, 0.7].forEach(z => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.0, 0.08), getMat(P, 'woodDark', 0x3e1f0d));
        post.position.set(x, 1.0, z);
        g.add(post);
      });
    });
    const roofBeam = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 1.6), getMat(P, 'woodDark', 0x3e1f0d));
    roofBeam.position.y = 2.03;
    g.add(roofBeam);
    return g;
  };
  B['garden_beehive_box'] = function(item, scen, P) {
    const g = new THREE.Group();
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.55, 0.44), getMat(P, 'woodPine', 0xb47b38));
    box.position.y = 0.35;
    g.add(box);
    return g;
  };

  // --- Space extra builders ---
  B['space_moon'] = function(item, scen, P) {
    const g = new THREE.Group();
    const moon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 14, 14), getMat(P, 'stoneGray', 0x94a3b8));
    g.add(moon);
    return g;
  };
  B['space_telescope'] = function(item, scen, P) {
    const g = new THREE.Group();
    const tube = typeof globalScope.createLatheProfileMesh === 'function'
      ? globalScope.createLatheProfileMesh([[0.0, 0.0], [0.18, 0.0], [0.19, 0.45], [0.24, 0.72]], getMat(P, 'metalChrome', 0xe2e8f0, 0.2, 0.9), 20)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.7, 16), getMat(P, 'metalChrome', 0xe2e8f0));
    tube.rotation.x = Math.PI / 3;
    const shield = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.04, 0.9), getMat(P, 'metalDark', 0x1e293b));
    shield.rotation.x = 0.45;
    const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 6), getMat(P, 'metalBrass', 0xf59e0b, 0.12, 0.95));
    mirror.position.set(0, 0.22, 0.08);
    g.add(tube, shield, mirror);
    return g;
  };
  B['space_control_console'] = function(item, scen, P) {
    const g = new THREE.Group();
    const PMF = globalScope.ProceduralMaterialFactory;
    const deskMat = getMat(P, 'metalDark', 0x1e293b, 0.3, 0.75);
    const base = typeof globalScope.createBeveledBoxExtrude === 'function'
      ? globalScope.createBeveledBoxExtrude(1.35, 0.82, 0.62, deskMat, 0.02, 0.015)
      : new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.82, 0.62), deskMat);
    base.position.y = 0.41;
    const scrMat = PMF ? PMF.createDigitalScreenMaterial({
      key: 'space_telemetry_hud', bg: '#020617', accent: '#38bdf8', title: 'ORBITAL TELEMETRY', lines: ['ALT: 408.2 KM | VEL: 7.66 KM/S', 'O2: 99.4% | CABIN: 101.3 KPA', 'SOLAR ARRAY: 142.8 KW ONLINE']
    }) : getMat(P, 'emissiveScreen', 0x38bdf8);
    [-0.42, 0, 0.42].forEach((sx, idx) => {
      const mon = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.26), scrMat);
      mon.position.set(sx, 1.02, -0.08 + Math.abs(sx) * 0.18);
      mon.rotation.y = -sx * 0.55;
      mon.rotation.x = -0.22;
      g.add(mon);
    });
    g.add(base);
    return g;
  };
  B['space_astronaut_helmet'] = function(item, scen, P) {
    const g = new THREE.Group();
    const shellMat = getMat(P, 'crownWhite', 0xf8fafc, 0.22, 0.15);
    const goldVisorMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.08, metalness: 0.96 });
    const neckRing = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.032, 12, 24), getMat(P, 'metalChrome', 0x94a3b8, 0.25, 0.85));
    neckRing.rotation.x = Math.PI / 2;
    neckRing.position.y = 0.04;
    const dome = typeof globalScope.createLatheProfileMesh === 'function'
      ? globalScope.createLatheProfileMesh([
          [0.19, 0.04], [0.24, 0.18], [0.23, 0.36], [0.14, 0.46], [0.0, 0.49]
        ], shellMat, 26)
      : new THREE.Mesh(new THREE.SphereGeometry(0.24, 22, 20), shellMat);
    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.225, 22, 18, 0, Math.PI * 0.85, Math.PI * 0.18, Math.PI * 0.52), goldVisorMat);
    visor.position.set(0, 0.24, 0.03);
    visor.rotation.y = Math.PI * 0.08;
    g.add(neckRing, dome, visor);
    return g;
  };
  B['space_oxygen_tank'] = function(item, scen, P) {
    const g = new THREE.Group();
    const tankMat = getMat(P, 'crownWhite', 0xe2e8f0, 0.28, 0.55);
    const brassMat = getMat(P, 'metalBrass', 0xf59e0b, 0.22, 0.88);
    [-0.12, 0.12].forEach(tx => {
      const cyl = typeof globalScope.createLatheProfileMesh === 'function'
        ? globalScope.createLatheProfileMesh([
            [0.0, 0.0], [0.085, 0.02], [0.095, 0.08], [0.095, 0.48], [0.035, 0.56], [0.025, 0.62], [0.0, 0.62]
          ], tankMat, 22)
        : new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.56, 18), tankMat);
      cyl.position.x = tx;
      const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.04, 12), brassMat);
      valve.position.set(tx, 0.64, 0);
      g.add(cyl, valve);
    });
    if (typeof globalScope.createTubeHandleMesh === 'function') {
      const manifold = globalScope.createTubeHandleMesh([[-0.12, 0.58, 0], [0, 0.62, 0.05], [0.12, 0.58, 0]], 0.014, brassMat);
      g.add(manifold);
    }
    const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16), getMat(P, 'emissiveScreen', 0x38bdf8));
    gauge.rotation.x = Math.PI / 2;
    gauge.position.set(0, 0.42, 0.11);
    g.add(gauge);
    return g;
  };
  B['space_robotic_arm'] = function(item, scen, P) {
    const g = new THREE.Group();
    const whiteMat = getMat(P, 'crownWhite', 0xf8fafc, 0.3, 0.4);
    const jointMat = getMat(P, 'metalDark', 0x1e293b, 0.3, 0.8);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.12, 18), jointMat);
    base.position.y = 0.06;
    if (typeof globalScope.createTubeHandleMesh === 'function') {
      const boom1 = globalScope.createTubeHandleMesh([[0, 0.12, 0], [0.18, 0.55, 0.08], [0.42, 0.85, 0.15]], 0.048, whiteMat);
      const boom2 = globalScope.createTubeHandleMesh([[0.42, 0.85, 0.15], [0.72, 0.65, 0.25], [0.92, 0.48, 0.32]], 0.038, whiteMat);
      g.add(boom1, boom2);
    }
    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 14), jointMat);
    elbowJoint.position.set(0.42, 0.85, 0.15);
    const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 14), jointMat);
    wrist.position.set(0.92, 0.48, 0.32);
    g.add(base, elbowJoint, wrist);
    return g;
  };
  B['space_hydroponic_pod'] = function(item, scen, P) {
    const g = new THREE.Group();
    const frameMat = getMat(P, 'metalChrome', 0xe2e8f0, 0.22, 0.85);
    const glassMat = getMat(P, 'glassClear', 0xe0f2fe, 0.1, 0.1);
    const uvMat = new THREE.MeshStandardMaterial({ color: 0xd946ef, emissive: 0xa855f7, emissiveIntensity: 1.8 });
    const base = typeof globalScope.createBeveledBoxExtrude === 'function'
      ? globalScope.createBeveledBoxExtrude(0.86, 0.14, 0.48, frameMat, 0.015, 0.012)
      : new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.14, 0.48), frameMat);
    base.position.y = 0.07;
    const dome = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.82, 18, 1, false, 0, Math.PI), glassMat);
    dome.rotation.z = Math.PI / 2;
    dome.position.y = 0.14;
    const uvBar = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.025, 0.06), uvMat);
    uvBar.position.y = 0.34;
    [-0.26, -0.08, 0.08, 0.26].forEach(px => {
      const crop = new THREE.Mesh(new THREE.DodecahedronGeometry(0.075, 1), getMat(P, 'leafGreen3', 0x22c55e));
      crop.position.set(px, 0.19, 0);
      g.add(crop);
    });
    g.add(base, dome, uvBar);
    return g;
  };
  B['space_airlock_door'] = function(item, scen, P) {
    const g = new THREE.Group();
    const bulkheadMat = getMat(P, 'metalChrome', 0xcbd5e1, 0.28, 0.82);
    const darkMat = getMat(P, 'metalDark', 0x1e293b, 0.35, 0.75);
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.08, 16, 32), darkMat);
    outerRing.position.y = 0.65;
    const hatchDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 0.10, 28), bulkheadMat);
    hatchDisc.rotation.x = Math.PI / 2;
    hatchDisc.position.y = 0.65;
    const viewport = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 20), getMat(P, 'emissiveScreen', 0x38bdf8));
    viewport.rotation.x = Math.PI / 2;
    viewport.position.set(0, 0.82, 0);
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.018, 10, 20), getMat(P, 'flowerRed', 0xef4444));
    wheel.position.set(0, 0.52, 0.07);
    g.add(outerRing, hatchDisc, viewport, wheel);
    return g;
  };
  B['space_asteroid'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.4, 1), getMat(P, 'stoneGray', 0x475569)));
    return g;
  };
  B['space_black_hole'] = function(item, scen, P) {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    const disk = new THREE.Mesh(new THREE.RingGeometry(0.7, 1.5, 32), new THREE.MeshBasicMaterial({ color: 0xec4899, side: THREE.DoubleSide, transparent: true, opacity: 0.75 }));
    disk.rotation.x = Math.PI / 2.3;
    g.add(core, disk);
    return g;
  };
  B['space_satellite'] = function(item, scen, P) {
    const g = new THREE.Group();
    const PMF = globalScope.ProceduralMaterialFactory;
    const solarMat = PMF ? PMF.createSolarCellMaterial() : getMat(P, 'emissiveScreen', 0x0284c7);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.48, 16), getMat(P, 'metalBrass', 0xf59e0b, 0.2, 0.9));
    body.rotation.z = Math.PI / 2;
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.34, 0.88), solarMat);
    p1.position.z = 0.62;
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.34, 0.88), solarMat);
    p2.position.z = -0.62;
    g.add(body, p1, p2);
    return g;
  };
  B['space_mercury'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 14), getMat(P, 'stonePaver', 0x64748b)));
    return g;
  };
  B['space_venus'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.72, 16, 16), getMat(P, 'fabricGold', 0xf59e0b)));
    return g;
  };
  B['space_uranus'] = function(item, scen, P) {
    const g = new THREE.Group();
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), getMat(P, 'emissiveScreen', 0x38bdf8));
    g.add(p);
    return g;
  };
  B['space_neptune'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.68, 16, 16), getMat(P, 'fabricBlue', 0x1d4ed8)));
    return g;
  };
  B['space_neutron_star'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), new THREE.MeshBasicMaterial({ color: 0x38bdf8 })));
    return g;
  };
  B['space_supernova'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 1), new THREE.MeshBasicMaterial({ color: 0xf43f5e, wireframe: true })));
    return g;
  };
  B['space_spacesuit'] = function(item, scen, P) {
    return buildAstronautMesh(P);
  };
  B['space_asteroid_belt'] = function(item, scen, P) {
    const g = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const a = new THREE.Mesh(new THREE.DodecahedronGeometry(0.1, 0), getMat(P, 'stoneGray', 0x64748b));
      a.position.set(Math.sin(i * 1.0) * 0.5, (i % 2) * 0.1, Math.cos(i * 1.0) * 0.5);
      g.add(a);
    }
    return g;
  };
  B['space_halley_comet'] = function(item, scen, P) {
    const g = new THREE.Group();
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    const t = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.2, 10), new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.45 }));
    t.rotation.x = Math.PI / 2;
    t.position.z = -0.6;
    g.add(c, t);
    return g;
  };
  B['space_meteorite'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 1), getMat(P, 'metalDark', 0x1e293b)));
    return g;
  };
  B['space_orion_nebula'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.TorusKnotGeometry(0.42, 0.16, 36, 8), new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true })));
    return g;
  };
  B['space_milky_way'] = function(item, scen, P) {
    const g = new THREE.Group();
    const sp = new THREE.Mesh(new THREE.RingGeometry(0.25, 1.3, 24), new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.6 }));
    sp.rotation.x = Math.PI / 2.5;
    g.add(sp);
    return g;
  };
  B['space_solar_array'] = function(item, scen, P) {
    const g = new THREE.Group();
    const PMF = globalScope.ProceduralMaterialFactory;
    const solarMat = PMF ? PMF.createSolarCellMaterial() : getMat(P, 'emissiveScreen', 0x0284c7);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 10), getMat(P, 'metalDark', 0x1e293b));
    mast.position.y = 0.35;
    const array = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.03, 0.58), solarMat);
    array.position.y = 0.7;
    g.add(mast, array);
    return g;
  };
  B['space_launchpad_tower'] = function(item, scen, P) {
    const g = new THREE.Group();
    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.0, 0.3), getMat(P, 'flowerRed', 0xef4444));
    tower.position.y = 1.0;
    g.add(tower);
    return g;
  };
  B['space_deep_probe'] = function(item, scen, P) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), getMat(P, 'metalBrass', 0xf59e0b));
    const dish = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.4), getMat(P, 'crownWhite', 0xffffff));
    dish.rotation.x = -Math.PI / 2;
    dish.position.y = 0.24;
    g.add(b, dish);
    return g;
  };

  // ============================================================================
  // INTEGRACIÓN AUTOMÁTICA CON EL SELECTOR DE ESCENARIOS WORLD3D
  // ============================================================================
  function hookIntoWorld3D() {
    const w3d = globalScope.World3D || (typeof window !== 'undefined' ? window.World3D : null);
    if (!w3d) return;
    w3d._hasMasterENGNatureSpaceHook = true;
  }

  console.log('[MasterENG3D] Nature & Space module loaded successfully.');
})();

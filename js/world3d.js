/**
 * World 3D Interactive Engine (Three.js) - English App
 * Escenario expandido con casa amueblada y jardín interactivo detallado
 *
 * Características:
 * - Materiales PBR reutilizados (SHARED_MATERIALS) para minimizar draw calls.
 * - Modelos procedurales detallados con proporciones, biselado y acabados realistas.
 * - Interior: Sofá acolchado con cojines de contraste, mesa de centro con taza humeante,
 *   alfombra texturizada, escritorio con gavetas, monitor estilizado con luz emisiva,
 *   teclado, silla ergonómica, librero con tomos de colores, cuadros, reloj de pared y macetas.
 * - Jardín: Árbol con tronco curvo y copa facetada, arbustos florales de colores vivos,
 *   parches de pasto 3D, cerca perimetral (picket fence), camino de baldosas desiguales,
 *   farol de jardín con SpotLight puntual y banca de parque de listones.
 * - Sombras suaves PCFSoftShadowMap y adaptación dinámica a orientación horizontal (landscape).
 */

(function (global) {
  'use strict';

  // ========================================================
  // 1. CATÁLOGO DE MATERIALES COMPARTIDOS (SHARED_MATERIALS)
  // Minimiza cambios de estado WebGL y optimiza draw calls
  // ========================================================
  const SHARED_MATERIALS = {
    // Maderas
    woodOak: new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.55, metalness: 0.08 }),
    woodWalnut: new THREE.MeshStandardMaterial({ color: 0x3b1d0e, roughness: 0.45, metalness: 0.1 }),
    woodLight: new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.5, metalness: 0.05 }),
    woodPine: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5, metalness: 0.06 }),
    woodDark: new THREE.MeshStandardMaterial({ color: 0x241206, roughness: 0.48, metalness: 0.1 }),

    // Metales
    metalDark: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.38, metalness: 0.85 }),
    metalChrome: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.15, metalness: 0.95 }),
    metalBrass: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.28, metalness: 0.88 }),
    ironBlack: new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.45, metalness: 0.85 }),

    // Telas, Cuero y Cojines
    fabricBlue: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.65, metalness: 0.1 }),
    fabricGold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6, metalness: 0.12 }),
    fabricTerracotta: new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.62, metalness: 0.1 }),
    leatherDark: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.68, metalness: 0.15 }),
    fabricCushion: new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.6, metalness: 0.08 }),

    // Naturaleza y Follaje
    leafGreen1: new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8, metalness: 0.0 }),
    leafGreen2: new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8, metalness: 0.0 }),
    leafGreen3: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8, metalness: 0.0 }),
    leafGreen4: new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.82, metalness: 0.0 }),
    trunkBark: new THREE.MeshStandardMaterial({ color: 0x3e2312, roughness: 0.85, metalness: 0.05 }),
    flowerRed: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45, metalness: 0.1 }),
    flowerYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.45, metalness: 0.1 }),
    flowerPink: new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.45, metalness: 0.1 }),
    flowerLavender: new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.45, metalness: 0.1 }),
    grassBlade: new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.75, metalness: 0.0 }),

    // Piedra, Cerámica y Albañilería
    stoneGray: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7, metalness: 0.1 }),
    stoneTile: new THREE.MeshStandardMaterial({ color: 0x718096, roughness: 0.65, metalness: 0.08 }),
    stonePaver: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75, metalness: 0.05 }),
    ceramicWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.18, metalness: 0.05 }),
    terracottaPot: new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.75, metalness: 0.05 }),

    // Elementos Arquitectónicos
    picketWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6, metalness: 0.02 }),
    picketRail: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.65, metalness: 0.02 }),
    wallSatin: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.85, metalness: 0.02 }),
    crownWhite: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4, metalness: 0.05 }),
    baseboardWood: new THREE.MeshStandardMaterial({ color: 0x3b1d0e, roughness: 0.45, metalness: 0.08 }),

    // Vidrio, Vapor y Emisión
    glassClear: new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.6 }),
    glassLantern: new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.65 }),
    glassMirror: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.05, metalness: 0.95 }),
    steamTranslucent: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9, transparent: true, opacity: 0.32 }),
    emissiveScreen: new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x38bdf8, emissiveIntensity: 0.65, roughness: 0.25 }),
    emissiveBulb: new THREE.MeshStandardMaterial({ color: 0xffedd5, emissive: 0xfef08a, emissiveIntensity: 2.0, roughness: 0.2 })
  };

  // ========================================================
  // 2. TEXTURAS PROCEDURALES LIGERAS EN MEMORIA (CANVAS)
  // ========================================================
  let cachedWoodTexture = null;
  function createOakWoodTexture() {
    if (cachedWoodTexture) return cachedWoodTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(0, 0, 512, 512);

    const plankHeight = 64;
    for (let y = 0; y < 512; y += plankHeight) {
      const rowIdx = Math.floor(y / plankHeight);
      const shade = rowIdx % 2 === 0 ? 'rgba(215, 175, 130, 0.12)' : 'rgba(30, 18, 10, 0.16)';
      ctx.fillStyle = shade;
      ctx.fillRect(0, y, 512, plankHeight);

      const xOffset = (rowIdx % 2) * 128;
      for (let x = xOffset; x < 512; x += 256) {
        ctx.strokeStyle = 'rgba(20, 10, 5, 0.9)';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + plankHeight);
        ctx.stroke();
      }

      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(75, 45, 20, 0.28)' : 'rgba(235, 195, 145, 0.15)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        const vy = y + 6 + i * 11;
        ctx.moveTo(0, vy);
        ctx.bezierCurveTo(130, vy + Math.sin(i * 1.5) * 6, 360, vy - Math.cos(i * 1.5) * 6, 512, vy);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(20, 10, 5, 0.95)';
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
    cachedWoodTexture = texture;
    return texture;
  }

  let cachedGrassTexture = null;
  function createGrassTexture() {
    if (cachedGrassTexture) return cachedGrassTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1b4332';
    ctx.fillRect(0, 0, 512, 512);

    const colors = ['#14532d', '#15803d', '#2d6a4f', '#40916c', '#52b788', '#386641'];
    for (let i = 0; i < 3200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const w = Math.random() * 4.5 + 2.0;
      const h = Math.random() * 5.0 + 2.5;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(x, y, w, h);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);
    cachedGrassTexture = texture;
    return texture;
  }

  let cachedBlackboardTexture = null;
  function createBlackboardTexture() {
    if (cachedBlackboardTexture) return cachedBlackboardTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#143827';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, 488, 232);

    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText("TODAY'S ENGLISH LESSON", 32, 54);

    ctx.font = '19px sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText("1. Classroom & Study Vocabulary", 32, 98);
    ctx.fillText("2. Desk, Chair, Lamp & Books", 32, 136);
    ctx.fillText("3. Speaking Practice (+50 EXP)", 32, 174);

    ctx.font = 'italic 16px sans-serif';
    ctx.fillStyle = '#6ee7b7';
    ctx.fillText("★ Fluency Goal: 100% Pronunciation Accuracy", 32, 218);

    const tex = new THREE.CanvasTexture(canvas);
    cachedBlackboardTexture = tex;
    return tex;
  }

  let cachedLaptopScreenTexture = null;
  function createLaptopScreenTexture() {
    if (cachedLaptopScreenTexture) return cachedLaptopScreenTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 256, 160);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 256, 22);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(10, 11, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#eab308';
    ctx.beginPath(); ctx.arc(22, 11, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.arc(34, 11, 4, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.fillRect(48, 4, 80, 18);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('EnglishApp.js', 54, 16);

    const codeLines = [
      { color: '#818cf8', text: 'import { speak } from "coach";' },
      { color: '#38bdf8', text: 'const user = new Student();' },
      { color: '#34d399', text: 'function practiceVocabulary() {' },
      { color: '#fcd34d', text: '  user.gainExp(50);' },
      { color: '#f472b6', text: '  user.pronounce("fluent");' },
      { color: '#34d399', text: '}' }
    ];

    codeLines.forEach((line, idx) => {
      const y = 42 + idx * 18;
      ctx.fillStyle = '#475569';
      ctx.font = '9px monospace';
      ctx.fillText(String(idx + 1), 10, y);
      ctx.fillStyle = line.color;
      ctx.font = 'bold 9px monospace';
      ctx.fillText(line.text, 26, y);
    });

    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 146, 256, 14);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '8px sans-serif';
    ctx.fillText('⚡ Ready • UTF-8 • JavaScript • 60 FPS', 10, 156);

    const tex = new THREE.CanvasTexture(canvas);
    cachedLaptopScreenTexture = tex;
    return tex;
  }

  let cachedPaintingTexture = null;
  function createPaintingTexture() {
    if (cachedPaintingTexture) return cachedPaintingTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    // Lienzo paisajístico degradado suave
    const grad = ctx.createLinearGradient(0, 0, 0, 160);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(0.55, '#fde047');
    grad.addColorStop(0.7, '#fb923c');
    grad.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 160);

    // Siluetas de montañas en el horizonte
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

    // Sol tenue
    ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.beginPath();
    ctx.arc(160, 75, 16, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    cachedPaintingTexture = tex;
    return tex;
  }

  let cachedClockTexture = null;
  function createClockFaceTexture() {
    if (cachedClockTexture) return cachedClockTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f8fafc';
    ctx.beginPath(); ctx.arc(128, 128, 120, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Marcas horarias
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const x1 = 128 + Math.sin(angle) * 96;
      const y1 = 128 - Math.cos(angle) * 96;
      const x2 = 128 + Math.sin(angle) * 110;
      const y2 = 128 - Math.cos(angle) * 110;
      ctx.lineWidth = i % 3 === 0 ? 5 : 2;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }

    // Manecillas a las 10:10
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(128, 128); ctx.lineTo(82, 82); ctx.stroke(); // Horario

    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(128, 128); ctx.lineTo(174, 82); ctx.stroke(); // Minutero

    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(128, 128); ctx.lineTo(128, 48); ctx.stroke(); // Segundero

    ctx.fillStyle = '#d97706';
    ctx.beginPath(); ctx.arc(128, 128, 6, 0, Math.PI * 2); ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    cachedClockTexture = tex;
    return tex;
  }

  let cachedRugTexture = null;
  function createRugTexture() {
    if (cachedRugTexture) return cachedRugTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, 232, 232);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(24, 24, 208, 208);

    // Patrón geométrico central
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(128, 40); ctx.lineTo(216, 128); ctx.lineTo(128, 216); ctx.lineTo(40, 128);
    ctx.closePath();
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    cachedRugTexture = tex;
    return tex;
  }

  // ========================================================
  // 3. GESTIÓN DE MEMORIA Y PREVENCIÓN DE LEAKS
  // ========================================================
  function disposeThreeMaterial(mat) {
    if (!mat) return;
    if (mat.map &&
        mat.map !== cachedWoodTexture &&
        mat.map !== cachedGrassTexture &&
        mat.map !== cachedBlackboardTexture &&
        mat.map !== cachedLaptopScreenTexture &&
        mat.map !== cachedPaintingTexture &&
        mat.map !== cachedClockTexture &&
        mat.map !== cachedRugTexture) {
      try { mat.map.dispose(); } catch (e) {}
    }
    try { mat.dispose(); } catch (e) {}
  }

  function disposeThreeNode(node) {
    if (!node) return;
    if (node.children) {
      while (node.children.length > 0) {
        disposeThreeNode(node.children[0]);
        node.remove(node.children[0]);
      }
    }
    if (node.geometry) {
      try { node.geometry.dispose(); } catch (e) {}
    }
    if (node.material) {
      if (Array.isArray(node.material)) {
        node.material.forEach(m => disposeThreeMaterial(m));
      } else {
        disposeThreeMaterial(node.material);
      }
    }
  }

  function safeGetPosition(pos) {
    if (Array.isArray(pos)) return { x: pos[0] || 0, y: pos[1] || 0, z: pos[2] || 0 };
    if (pos && typeof pos === 'object') return { x: pos.x || 0, y: pos.y || 0, z: pos.z || 0 };
    return { x: 0, y: 0, z: 0 };
  }

  // ========================================================
  // 4. MODELADO 3D PROCEDURAL DE ALTA FIDELIDAD
  // ========================================================
  function buildCompound3DObject(obj, scenarioKey) {
    const group = new THREE.Group();
    const M = SHARED_MATERIALS;

    if (scenarioKey === 'house') {
      if (obj.id === 'hammock') {
        const fabricMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, side: THREE.DoubleSide, roughness: 0.65 });
        const fabricGeo = new THREE.PlaneGeometry(3.3, 1.0, 24, 8);
        const fPos = fabricGeo.attributes.position;
        for (let i = 0; i < fPos.count; i++) {
          const px = fPos.getX(i);
          const pz = fPos.getY(i);
          const normX = px / 1.65;
          const catenaryY = 0.53 * (Math.cosh(normX * 1.35) - 1) / (Math.cosh(1.35) - 1);
          const cradleZ = (pz / 0.5) * (pz / 0.5) * 0.12 * (1 - normX * normX);
          fPos.setX(i, px);
          fPos.setY(i, 0.62 + catenaryY + cradleZ);
          fPos.setZ(i, pz);
        }
        fabricGeo.computeVertexNormals();
        const fabric = new THREE.Mesh(fabricGeo, fabricMat);
        fabric.castShadow = true;
        fabric.receiveShadow = true;
        group.add(fabric);

        const bar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.04, 16), M.woodWalnut);
        bar1.rotation.x = Math.PI / 2;
        bar1.position.set(-1.65, 1.15, 0);
        bar1.castShadow = true;
        const bar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.04, 16), M.woodWalnut);
        bar2.rotation.x = Math.PI / 2;
        bar2.position.set(1.65, 1.15, 0);
        bar2.castShadow = true;
        group.add(bar1, bar2);

        [-0.42, -0.21, 0, 0.21, 0.42].forEach(offsetZ => {
          const lenL = Math.hypot(2.95 - 1.65, 1.62 - 1.15);
          const ropeL = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, lenL), M.metalBrass);
          ropeL.position.set(-2.30, 1.38, offsetZ * 0.5);
          ropeL.rotation.z = -Math.atan2(1.62 - 1.15, 2.95 - 1.65);
          const ropeR = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, lenL), M.metalBrass);
          ropeR.position.set(2.30, 1.38, offsetZ * 0.5);
          ropeR.rotation.z = Math.atan2(1.62 - 1.15, 2.95 - 1.65);
          group.add(ropeL, ropeR);
        });

        const ringL = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.018, 8, 16), M.metalChrome);
        ringL.position.set(-2.95, 1.62, 0);
        const ringR = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.018, 8, 16), M.metalChrome);
        ringR.position.set(2.95, 1.62, 0);
        group.add(ringL, ringR);

      } else if (obj.id === 'sofa') {
        // Sofá contemporáneo acolchado con cojines de contraste en dorado y terracota
        const baseFrame = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.16, 0.96), M.woodWalnut);
        baseFrame.position.set(0, 0.16, 0);
        baseFrame.castShadow = true;
        group.add(baseFrame);

        // Patas cónicas torneadas tocando el piso en y = 0 con remates de latón
        [[-0.98, -0.38], [0.98, -0.38], [-0.98, 0.38], [0.98, 0.38]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.018, 0.16, 12), M.woodWalnut);
          leg.position.set(lx, 0.08, lz);
          leg.castShadow = true;
          const footBrass = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.020, 0.03, 12), M.metalBrass);
          footBrass.position.set(lx, 0.015, lz);
          group.add(leg, footBrass);
        });

        // 3 Cojines de asiento acolchados
        [-0.68, 0, 0.68].forEach(cx => {
          const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.22, 0.78), M.fabricBlue);
          seatCushion.position.set(cx, 0.35, 0.04);
          seatCushion.castShadow = true;
          group.add(seatCushion);
        });

        // Respaldo ergonómico inclinado
        const backRest = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.52, 0.22), M.fabricBlue);
        backRest.position.set(0, 0.62, -0.36);
        backRest.rotation.x = 0.06;
        backRest.castShadow = true;
        group.add(backRest);

        // Apoyabrazos acolchados
        [-1.12, 1.12].forEach(ax => {
          const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.38, 0.94), M.fabricBlue);
          arm.position.set(ax, 0.45, 0);
          arm.castShadow = true;
          group.add(arm);
        });

        // Cojines de contraste (amarillo dorado y terracota)
        const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.12), M.fabricGold);
        pillow1.position.set(-0.78, 0.48, -0.22);
        pillow1.rotation.y = 0.25;
        pillow1.rotation.z = -0.15;
        pillow1.castShadow = true;

        const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.12), M.fabricTerracotta);
        pillow2.position.set(0.78, 0.48, -0.22);
        pillow2.rotation.y = -0.25;
        pillow2.rotation.z = 0.15;
        pillow2.castShadow = true;

        group.add(pillow1, pillow2);

      } else if (obj.id === 'cushion') {
        const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.40, 0.14), M.fabricGold);
        c1.castShadow = true;
        group.add(c1);

      } else if (obj.id === 'bookshelf') {
        // Estantería alta de 5 repisas con más de 25 libros de lomos variados
        const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.48, 2.7, 0.05), M.woodDark);
        frameL.position.set(0, 1.35, -0.92);
        const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.48, 2.7, 0.05), M.woodDark);
        frameR.position.set(0, 1.35, 0.92);
        const backBoard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.7, 1.88), M.woodDark);
        backBoard.position.set(-0.22, 1.35, 0);
        group.add(frameL, frameR, backBoard);

        const bookColors = [0xdc2626, 0x1e3a8a, 0x059669, 0xd97706, 0x7c3aed, 0x831843, 0xfef3c7, 0x0284c7, 0x0f766e, 0x475569];
        for (let shelf = 0; shelf < 5; shelf++) {
          const shelfY = 0.12 + shelf * 0.52;
          const shelfBoard = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 1.82), M.woodDark);
          shelfBoard.position.set(0, shelfY, 0);
          group.add(shelfBoard);

          const booksOnShelf = 6 + (shelf % 2);
          for (let b = 0; b < booksOnShelf; b++) {
            const colorIdx = (shelf * 7 + b) % bookColors.length;
            const bookMat = new THREE.MeshStandardMaterial({ color: bookColors[colorIdx], roughness: 0.4 });
            const bookH = 0.32 + Math.sin(b * 1.5 + shelf) * 0.06;
            const bookThick = 0.042 + Math.cos(b * 2) * 0.015;
            const book = new THREE.Mesh(new THREE.BoxGeometry(0.32, bookH, bookThick), bookMat);
            const zPos = -0.74 + b * 0.23;
            book.position.set(0.04, shelfY + 0.02 + bookH / 2, zPos);
            if (b === booksOnShelf - 1 && shelf % 2 === 1) {
              book.rotation.x = 0.18;
            }
            book.castShadow = true;
            group.add(book);
          }
        }

      } else if (obj.id === 'coffee_table') {
        // Mesa de centro biselada, revistas apiladas y taza de café
        const top = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.82, 0.06, 32), M.woodWalnut);
        top.position.y = 0.47;
        top.castShadow = true;
        group.add(top);

        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3;
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.016, 0.47, 8), M.metalDark);
          leg.position.set(Math.cos(angle) * 0.58, 0.235, Math.sin(angle) * 0.58);
          leg.rotation.z = Math.cos(angle) * 0.12;
          leg.rotation.x = Math.sin(angle) * 0.12;
          leg.castShadow = true;
          group.add(leg);
        }

        // Revistas en la mesa
        const mag1 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.015, 0.24), M.fabricGold);
        mag1.position.set(0.18, 0.51, 0.08);
        mag1.rotation.y = 0.25;
        group.add(mag1);

      } else if (obj.id === 'coffee_mug') {
        // Taza de café humeante con plato y asa en toroide
        const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.016, 16), M.ceramicWhite);
        saucer.position.y = 0.008;
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.09, 16), M.ceramicWhite);
        cup.position.y = 0.055;
        const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 16), M.woodWalnut);
        liquid.position.y = 0.095;
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 8, 16), M.ceramicWhite);
        handle.position.set(0.075, 0.055, 0);
        handle.rotation.y = Math.PI / 2;

        // Partículas estilizadas de vapor humeante (steam)
        [0.05, 0.11, 0.17].forEach((sy, idx) => {
          const steam = new THREE.Mesh(new THREE.TorusGeometry(0.018 + idx * 0.008, 0.005, 6, 12, Math.PI * 1.2), M.steamTranslucent);
          steam.rotation.x = Math.PI / 2 + (idx % 2 === 0 ? 0.35 : -0.35);
          steam.position.set((idx % 2 === 0 ? 0.01 : -0.01), 0.10 + sy, 0);
          group.add(steam);
        });

        group.add(saucer, cup, liquid, handle);

      } else if (obj.id === 'rug') {
        // Alfombra tejida texturizada con ribete
        const rugTex = createRugTexture();
        const rugMat = new THREE.MeshStandardMaterial({ map: rugTex, roughness: 0.85, metalness: 0.02 });
        const rug = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.012, 2.4), rugMat);
        rug.position.y = 0.006;
        rug.receiveShadow = true;
        group.add(rug);

      } else if (obj.id === 'desk') {
        // Escritorio de madera maciza con gavetas y monitor estilizado
        const desktop = new THREE.Mesh(new THREE.BoxGeometry(1.40, 0.05, 0.70), M.woodOak);
        desktop.position.set(0, 0.745, 0);
        desktop.castShadow = true;
        desktop.receiveShadow = true;
        group.add(desktop);

        // Patas con casquillos de latón
        [[-0.62, -0.28], [0.62, -0.28], [-0.62, 0.28], [0.62, 0.28]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.016, 0.72, 12), M.metalDark);
          leg.position.set(lx, 0.36, lz);
          leg.castShadow = true;
          const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.06, 12), M.metalBrass);
          ferrule.position.set(lx, 0.03, lz);
          group.add(leg, ferrule);
        });

        // Gavetas laterales con tiradores metálicos
        const drawerCab = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.58), M.woodOak);
        drawerCab.position.set(0.42, 0.48, 0);
        drawerCab.castShadow = true;
        group.add(drawerCab);

        [-0.10, 0.10].forEach(dy => {
          const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14, 8), M.metalBrass);
          handle.rotation.z = Math.PI / 2;
          handle.position.set(0.42, 0.48 + dy, 0.30);
          group.add(handle);
        });

        // Monitor delgado con soporte fino y luz emisiva suave
        const monitorBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.01, 16), M.metalDark);
        monitorBase.position.set(0, 0.775, -0.15);
        const monitorStand = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.26, 12), M.metalChrome);
        monitorStand.position.set(0, 0.90, -0.15);

        const screenTex = createLaptopScreenTexture();
        const screenMat = new THREE.MeshStandardMaterial({
          map: screenTex,
          emissive: 0xffffff,
          emissiveMap: screenTex,
          emissiveIntensity: 0.65,
          roughness: 0.25
        });
        const monitorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.36, 0.018), M.metalDark);
        monitorFrame.position.set(0, 1.05, -0.14);
        const monitorDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.33), screenMat);
        monitorDisplay.position.set(0, 1.05, -0.13);
        group.add(monitorBase, monitorStand, monitorFrame, monitorDisplay);

        // Teclado y ratón ergonómicos
        const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.008, 0.13), M.metalDark);
        keyboard.position.set(0, 0.774, 0.08);
        const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.018, 0.10), M.metalDark);
        mouse.position.set(0.26, 0.779, 0.08);
        group.add(keyboard, mouse);

      } else if (obj.id === 'chair') {
        // Silla ergonómica con respaldo curvo, cojín lumbar y ruedas
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.46), M.fabricBlue);
        seat.position.set(0, 0.46, 0);
        seat.castShadow = true;
        group.add(seat);

        const backGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.44, 18, 1, true, -Math.PI * 0.35, Math.PI * 0.7);
        const backMesh = new THREE.Mesh(backGeo, new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.55, metalness: 0.15, side: THREE.DoubleSide }));
        backMesh.position.set(0, 0.72, -0.05);
        backMesh.castShadow = true;
        group.add(backMesh);

        const column = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.24, 12), M.metalChrome);
        column.position.set(0, 0.26, 0);
        column.castShadow = true;
        group.add(column);

        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          const arm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.035), M.metalChrome);
          arm.position.set(Math.cos(angle) * 0.12, 0.07, Math.sin(angle) * 0.12);
          arm.rotation.y = -angle;
          const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), M.metalDark);
          wheel.position.set(Math.cos(angle) * 0.24, 0.035, Math.sin(angle) * 0.24);
          group.add(arm, wheel);
        }

      } else if (obj.id === 'blackboard') {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(2.44, 1.44, 0.06), M.woodWalnut);
        frame.castShadow = true;
        const slateMat = new THREE.MeshStandardMaterial({ map: createBlackboardTexture(), roughness: 0.65, metalness: 0.05 });
        const slate = new THREE.Mesh(new THREE.PlaneGeometry(2.32, 1.32), slateMat);
        slate.position.set(0, 0, 0.032);
        const tray = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.03, 0.12), M.woodWalnut);
        tray.position.set(0, -0.72, 0.06);
        group.add(frame, slate, tray);

      } else if (obj.id === 'lamp') {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.024, 24), M.metalBrass);
        base.position.y = 0.012;
        const armLower = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.34, 12), M.metalBrass);
        armLower.position.set(0.04, 0.16, 0);
        armLower.rotation.z = -0.35;
        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.14, 18, 1, true), M.metalBrass);
        shade.position.set(-0.08, 0.48, 0);
        shade.rotation.z = -Math.PI * 0.40;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), M.emissiveBulb);
        bulb.position.set(-0.08, 0.46, 0);
        const deskLight = new THREE.PointLight(0xfef08a, 1.25, 4.8);
        deskLight.position.set(-0.08, 0.45, 0);
        deskLight.castShadow = true;
        group.add(base, armLower, shade, bulb, deskLight);

      } else if (obj.id === 'wall_painting') {
        // Cuadro decorativo enmarcado con arte abstracto
        const pFrame = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.88, 0.04), M.woodWalnut);
        pFrame.castShadow = true;
        const pCanvasMat = new THREE.MeshStandardMaterial({ map: createPaintingTexture(), roughness: 0.4 });
        const pCanvas = new THREE.Mesh(new THREE.PlaneGeometry(1.18, 0.78), pCanvasMat);
        pCanvas.position.set(0, 0, 0.022);
        group.add(pFrame, pCanvas);

      } else if (obj.id === 'wall_clock') {
        // Reloj de pared circular con manecillas
        const clockBody = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 24), M.woodWalnut);
        clockBody.rotation.x = Math.PI / 2;
        const clockFaceMat = new THREE.MeshStandardMaterial({ map: createClockFaceTexture(), roughness: 0.2 });
        const clockFace = new THREE.Mesh(new THREE.CircleGeometry(0.24, 24), clockFaceMat);
        clockFace.position.set(0, 0, 0.022);
        group.add(clockBody, clockFace);

      } else if (obj.id === 'potted_plant' || obj.id === 'indoor_plant') {
        // Maceta interior con planta verde y hojas volumétricas
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.16, 0.38, 16), M.terracottaPot);
        pot.position.y = 0.19;
        pot.castShadow = true;
        const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 16), M.woodDark);
        soil.position.y = 0.36;

        // Follaje verde exuberante (Monstera / Ficus)
        [0, 1, 2, 3, 4].forEach(i => {
          const angle = (i * Math.PI * 2) / 5;
          const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.35), M.leafGreen2);
          stem.position.set(Math.cos(angle) * 0.08, 0.48, Math.sin(angle) * 0.08);
          stem.rotation.z = Math.cos(angle) * 0.35;
          stem.rotation.x = Math.sin(angle) * 0.35;
          const leaf = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12), M.leafGreen3);
          leaf.scale.set(1.4, 0.3, 1.0);
          leaf.position.set(Math.cos(angle) * 0.18, 0.62, Math.sin(angle) * 0.18);
          leaf.castShadow = true;
          group.add(stem, leaf);
        });

        group.add(pot, soil);

      } else if (obj.id === 'ceiling_fan') {
        const mountRod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55), M.metalChrome);
        mountRod.position.y = -0.27;
        const fanMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 16), M.metalChrome);
        fanMotor.position.y = -0.55;
        const rotor = new THREE.Group();
        rotor.position.y = -0.55;
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.015, 0.14), M.woodWalnut);
          blade.position.set(Math.cos(angle) * 0.48, 0, Math.sin(angle) * 0.48);
          blade.rotation.y = -angle;
          rotor.add(blade);
        }
        group.add(mountRod, fanMotor, rotor);
        if (global.threeAnimatedObjects) global.threeAnimatedObjects.fan = rotor;

      } else if (obj.id === 'television') {
        const consoleStand = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.48, 0.45), M.woodWalnut);
        consoleStand.position.y = 0.24;
        consoleStand.castShadow = true;
        const oledScreen = new THREE.Mesh(new THREE.BoxGeometry(1.82, 1.04, 0.04), M.metalDark);
        oledScreen.position.set(0, 1.08, 0);
        oledScreen.castShadow = true;
        const display = new THREE.Mesh(new THREE.PlaneGeometry(1.76, 0.98), M.emissiveScreen);
        display.position.set(0, 1.08, 0.022);
        const soundbar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.07, 0.09), M.metalDark);
        soundbar.position.set(0, 0.52, 0.12);
        group.add(consoleStand, oledScreen, display, soundbar);

      } else {
        // Fallback elegante (pedestal con jarrón)
        const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.65, 16), M.stoneGray);
        ped.position.y = 0.325;
        const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.08, 0.42, 16), M.ceramicWhite);
        vase.position.y = 0.86;
        group.add(ped, vase);
      }

    } else {
      // SCENARIO: BACKYARD & GARDEN
      if (obj.id === 'shade_tree') {
        // Árbol con tronco curvo orgánico y copa facetada de esferas (DodecahedronGeometry)
        const trunkMat = M.trunkBark;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.52, 3.4, 12), trunkMat);
        trunk.position.y = 1.7;
        trunk.rotation.z = 0.06; // Sutil inclinación orgánica
        trunk.castShadow = true;
        group.add(trunk);

        // Raíces visibles en la base
        for (let r = 0; r < 4; r++) {
          const rAng = (r * Math.PI) / 2 + 0.3;
          const root = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 0.75, 8), trunkMat);
          root.position.set(Math.cos(rAng) * 0.42, 0.18, Math.sin(rAng) * 0.42);
          root.rotation.z = Math.cos(rAng) * 0.65;
          root.rotation.x = Math.sin(rAng) * 0.65;
          group.add(root);
        }

        // Ramas principales
        const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 1.6, 8), trunkMat);
        b1.rotation.z = Math.PI / 4.5;
        b1.position.set(0.48, 2.8, 0);
        const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 1.6, 8), trunkMat);
        b2.rotation.z = -Math.PI / 4.5;
        b2.position.set(-0.48, 2.7, 0.2);
        group.add(b1, b2);

        // Follaje orgánico multicapa con esferas facetadas
        const leafColors = [0x14532d, 0x166534, 0x15803d, 0x1b4332];
        const foliagePos = [
          [0, 3.8, 0, 1.55, 0],
          [0.85, 3.4, 0.4, 1.15, 1],
          [-0.85, 3.3, -0.3, 1.15, 2],
          [0.2, 4.3, -0.4, 1.25, 0],
          [-0.3, 4.2, 0.5, 1.20, 3]
        ];
        foliagePos.forEach(([fx, fy, fz, fr, cIdx]) => {
          const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(fr), new THREE.MeshStandardMaterial({ color: leafColors[cIdx], roughness: 0.8 }));
          leaves.position.set(fx, fy, fz);
          leaves.castShadow = true;
          group.add(leaves);
        });

      } else if (obj.id === 'flower_bush') {
        // Arbusto floral con flores de colores vivos
        const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.72), M.leafGreen2);
        bush.position.y = 0.55;
        bush.scale.set(1.2, 0.85, 1.1);
        bush.castShadow = true;
        group.add(bush);

        const flowerColors = [M.flowerRed, M.flowerYellow, M.flowerPink, M.flowerLavender];
        for (let f = 0; f < 18; f++) {
          const fMat = flowerColors[f % flowerColors.length];
          const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), fMat);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI * 0.5;
          blossom.position.set(
            Math.sin(phi) * Math.cos(theta) * 0.74,
            0.55 + Math.cos(phi) * 0.45,
            Math.sin(phi) * Math.sin(theta) * 0.74
          );
          group.add(blossom);
        }

      } else if (obj.id === 'grass_patch') {
        // Parches de pasto procedural tridimensional
        for (let g = 0; g < 14; g++) {
          const blade = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.28, 4), M.grassBlade);
          blade.position.set((Math.random() - 0.5) * 0.6, 0.14, (Math.random() - 0.5) * 0.6);
          blade.rotation.x = (Math.random() - 0.5) * 0.35;
          blade.rotation.z = (Math.random() - 0.5) * 0.35;
          group.add(blade);
        }

      } else if (obj.id === 'stone_path') {
        // Camino de baldosas de piedra desiguales
        [[-0.4, 0], [0.3, 0.6], [-0.2, 1.3], [0.4, 2.0], [0.0, 2.7]].forEach(([px, pz], idx) => {
          const paver = new THREE.Mesh(new THREE.CylinderGeometry(0.28 + (idx % 2) * 0.06, 0.32, 0.04, 7), M.stonePaver);
          paver.position.set(px, 0.02, pz);
          paver.rotation.y = idx * 0.8;
          paver.receiveShadow = true;
          group.add(paver);
        });

      } else if (obj.id === 'lamp_post') {
        // Farol de jardín con haz de luz puntual (SpotLight)
        const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.38, 8), M.metalDark);
        plinth.position.y = 0.19;
        plinth.castShadow = true;

        const column = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.12, 2.7, 12), M.metalDark);
        column.position.y = 1.65;
        column.castShadow = true;

        const lanternCap = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.22, 6), M.metalDark);
        lanternCap.position.y = 3.45;

        const glassCage = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.14, 0.34, 6, 1, true), M.glassLantern);
        glassCage.position.y = 3.20;

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), M.emissiveBulb);
        bulb.position.y = 3.20;

        // SpotLight focalizado hacia el suelo y el camino
        const spot = new THREE.SpotLight(0xffedd5, 2.8, 12, Math.PI / 3.5, 0.5, 1.2);
        spot.position.set(0, 3.20, 0);
        spot.target.position.set(0, 0, 0);
        spot.castShadow = true;
        group.add(spot, spot.target);

        const warmLight = new THREE.PointLight(0xffedd5, 1.5, 10.0);
        warmLight.position.y = 3.20;
        group.add(plinth, column, lanternCap, glassCage, bulb, warmLight);

      } else if (obj.id === 'garden_bench') {
        // Banca de parque de listones de madera biselados y apoyabrazos de hierro forjado
        const benchWood = M.woodPine;
        const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.55), benchWood);
        seat.position.y = 0.45;
        const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.06), benchWood);
        back.position.set(0, 0.8, -0.24);

        const ironMat = M.ironBlack;
        const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.55), ironMat);
        l1.position.set(-0.85, 0.22, 0);
        const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.55), ironMat);
        l2.position.set(0.85, 0.22, 0);

        // Reposabrazos curvos de hierro fundido
        const armL = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 16), ironMat);
        armL.position.set(-0.85, 0.62, 0);
        const armR = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 16), ironMat);
        armR.position.set(0.85, 0.62, 0);

        group.add(seat, back, l1, l2, armL, armR);

      } else if (obj.id === 'wooden_fence') {
        // Cerca perimetral de madera blanca (Picket Fence)
        const fenceSection = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.1, 0.08), M.picketWhite);
        fenceSection.position.y = 0.55;
        group.add(fenceSection);

      } else if (obj.id === 'stone_patio') {
        const terrace = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.16, 6.2), M.stoneTile);
        terrace.position.set(0, 0.08, 0);
        const tileMat = M.stoneTile;
        for (let tx = -3.8; tx <= 3.8; tx += 1.9) {
          for (let tz = -2.8; tz <= 2.8; tz += 1.9) {
            const tile = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.01, 1.82), tileMat);
            tile.position.set(tx, 0.085, tz);
            group.add(tile);
          }
        }
        group.add(terrace);

      } else if (obj.id === 'bbq_grill') {
        const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.ironBlack);
        bowl.position.y = 0.89;
        bowl.castShadow = true;
        const lid = new THREE.Mesh(new THREE.SphereGeometry(0.50, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2), M.ironBlack);
        lid.position.y = 0.94;
        const grate = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.01, 24), M.metalChrome);
        grate.position.y = 0.90;
        group.add(bowl, lid, grate);

      } else if (obj.id === 'patio_table') {
        const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.05, 24), M.woodPine);
        tableTop.position.y = 0.74;
        const umbrellaPole = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 2.5), M.metalDark);
        umbrellaPole.position.y = 1.25;
        const umbrellaMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 });
        const umbrellaCanopy = new THREE.Mesh(new THREE.ConeGeometry(1.65, 0.75, 8), umbrellaMat);
        umbrellaCanopy.position.y = 2.45;
        const baseWeight = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.12, 16), M.metalDark);
        baseWeight.position.y = 0.06;
        group.add(tableTop, umbrellaPole, umbrellaCanopy, baseWeight);

      } else if (obj.id === 'lawn_mower') {
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.22, 0.48), M.flowerRed);
        chassis.position.y = 0.18;
        const hCross = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.44), M.metalDark);
        hCross.position.set(-0.48, 0.92, 0);
        hCross.rotation.z = Math.PI / 2;
        group.add(chassis, hCross);

      } else if (obj.id === 'wheelbarrow') {
        const tubMat = M.metalDark;
        const tub = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.28, 0.58), tubMat);
        tub.position.y = 0.38;
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16), M.metalDark);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(0.48, 0.14, 0);
        group.add(tub, wheel);

      } else if (obj.id === 'watering_can') {
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.26, 16), M.metalChrome);
        body.position.y = 0.13;
        const rosette = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.03, 0.03, 12), M.metalBrass);
        rosette.position.set(0.32, 0.28, 0);
        group.add(body, rosette);

      } else if (obj.id === 'flower_pot') {
        const potMat = M.terracottaPot;
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.18, 0.38, 16), potMat);
        pot.position.y = 0.19;
        group.add(pot);

      } else if (obj.id === 'sprinkler') {
        const sBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.06, 16), M.metalDark);
        sBase.position.y = 0.03;
        const spinArms = new THREE.Group();
        spinArms.position.y = 0.08;
        const armBar = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.018, 0.018), M.metalBrass);
        spinArms.add(armBar);
        group.add(sBase, spinArms);
        if (global.threeAnimatedObjects) global.threeAnimatedObjects.sprinkler = spinArms;

      } else if (obj.id === 'sun') {
        const sunSphere = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        group.add(sunSphere);

      } else {
        // Fallback elegante (fuente de baño de aves en piedra esculpida)
        const column = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 0.72, 16), M.stoneGray);
        column.position.y = 0.36;
        const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.18, 0.16, 20), M.stoneGray);
        basin.position.y = 0.78;
        const water = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.02, 20), M.glassMirror);
        water.position.y = 0.84;
        group.add(column, basin, water);
      }
    }

    const safePos = safeGetPosition(obj.pos);
    group.position.set(safePos.x, safePos.y, safePos.z);
    return group;
  }

  // Exportar funciones y módulos para uso modular
  global.World3D = {
    SHARED_MATERIALS,
    buildCompound3DObject,
    buildDetailedObjectMesh: buildCompound3DObject,
    createOakWoodTexture,
    createGrassTexture,
    createBlackboardTexture,
    createLaptopScreenTexture,
    createPaintingTexture,
    createClockFaceTexture,
    createRugTexture,
    disposeThreeNode,
    disposeThreeMaterial
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.World3D;
  }
})(typeof window !== 'undefined' ? window : globalThis);

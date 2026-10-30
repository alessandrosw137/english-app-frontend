/**
 * ============================================================================
 * MasterENG - World Tour 3D: Hotel Lobby & 5-Star Suite + Parisian Dating Bistro
 * Archivo: js/world3d_dating_hotel.js
 *
 * Arquitectura 3D de alta fidelidad para los escenarios 'hotel' y 'dating'.
 * Reconstruye por completo el mobiliario, iluminación PBR, decoraciones y
 * objetos interactivos para aprendizaje inmersivo de inglés.
 * ============================================================================
 */

(function (global) {
  'use strict';

  // Espacio de nombres global para constructores arquitectónicos de MasterENG 3D
  const B = global.MasterENG3DBuilders = global.MasterENG3DBuilders || {};

  const _datingMatCache = new Map();
  function getMat(P, name, fallbackColor, roughness, metalness) {
    if (P && P[name]) return P[name];
    if (typeof THREE === 'undefined') return null;
    const c = fallbackColor !== undefined ? fallbackColor : 0x94a3b8;
    const r = roughness !== undefined ? roughness : 0.35;
    const m = metalness !== undefined ? metalness : 0.15;
    const key = `${c}_${r}_${m}`;
    if (_datingMatCache.has(key)) return _datingMatCache.get(key);
    const PhysicalMat = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
    const mat = new PhysicalMat({
      color: c,
      roughness: r,
      metalness: m
    });
    _datingMatCache.set(key, mat);
    return mat;
  }

  // Estado interno de animación para luces y efectos
  const localAnimationState = {
    candleLights: [],
    candleMeshes: [],
    stringLightBulbs: [],
    lastTime: 0,
    animFrameId: null
  };

  // ============================================================================
  // 1. GENERADORES DE TEXTURAS PROCEDURALES EN CANVAS 2D (SIN DEPENDENCIAS EXTERNAS)
  // ============================================================================

  function createMarbleTexture(isDark, width = 512, height = 512) {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = isDark ? '#141419' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const numVeins = isDark ? 16 : 12;
    for (let i = 0; i < numVeins; i++) {
      ctx.beginPath();
      let startX = Math.random() * width;
      let startY = 0;
      ctx.moveTo(startX, startY);

      let curX = startX;
      let curY = startY;
      while (curY < height) {
        curX += (Math.random() - 0.5) * 36;
        curY += Math.random() * 28 + 12;
        ctx.lineTo(curX, curY);
      }

      ctx.strokeStyle = isDark
        ? (i % 3 === 0 ? 'rgba(212, 175, 55, 0.32)' : 'rgba(255, 255, 255, 0.14)')
        : (i % 3 === 0 ? 'rgba(202, 138, 4, 0.28)' : 'rgba(100, 116, 139, 0.24)');
      ctx.lineWidth = Math.random() * 2.5 + 0.8;
      ctx.stroke();
    }

    if (typeof THREE !== 'undefined') {
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    }
    return null;
  }

  function createPersianRugTexture(width = 512, height = 512) {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#6b1124';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 14;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 8;
    ctx.strokeRect(26, 26, width - 52, height - 52);

    const cx = width / 2;
    const cy = height / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 110, 0, Math.PI * 2);
    ctx.fillStyle = '#1e1b4b';
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 85, 0, Math.PI * 2);
    ctx.fillStyle = '#831843';
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 4;
    ctx.stroke();

    for (let r = 0; r < 12; r++) {
      const angle = (r * Math.PI * 2) / 12;
      const fx = cx + Math.cos(angle) * 60;
      const fy = cy + Math.sin(angle) * 60;
      ctx.beginPath();
      ctx.arc(fx, fy, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.fill();
    }

    if (typeof THREE !== 'undefined') {
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    }
    return null;
  }

  function createNightCityBackdropTexture(width = 1024, height = 512) {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.65, '#070f26');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Cielo nocturno estrellado limpio y romántico
    const numStars = 180;
    for (let s = 0; s < numStars; s++) {
      const sx = Math.random() * width;
      const sy = Math.random() * (height * 0.62);
      const sRadius = Math.random() * 1.3 + 0.4;
      const sAlpha = Math.random() * 0.7 + 0.3;
      const sColor = Math.random() > 0.82 ? '#fef08a' : (Math.random() > 0.5 ? '#e0f2fe' : '#ffffff');
      ctx.save();
      ctx.beginPath();
      ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
      ctx.fillStyle = sColor;
      ctx.globalAlpha = sAlpha;
      if (sRadius > 1.1) {
        ctx.shadowColor = sColor;
        ctx.shadowBlur = 4;
      }
      ctx.fill();
      ctx.restore();
    }

    const numBuildings = 38;
    const bWidth = width / numBuildings;
    for (let i = 0; i < numBuildings; i++) {
      const bHeight = Math.random() * 220 + 90;
      const bx = i * bWidth;
      const by = height - bHeight;

      ctx.fillStyle = i % 2 === 0 ? '#0b1120' : '#070b14';
      ctx.fillRect(bx, by, bWidth + 2, bHeight);

      const winCols = Math.floor(bWidth / 10);
      const winRows = Math.floor(bHeight / 14);
      for (let r = 0; r < winRows; r++) {
        for (let c = 0; c < winCols; c++) {
          if (Math.random() > 0.42) {
            const wx = bx + 3 + c * 9;
            const wy = by + 6 + r * 13;
            ctx.fillStyle = Math.random() > 0.85 ? '#38bdf8' : (Math.random() > 0.4 ? '#fef08a' : '#fed7aa');
            ctx.fillRect(wx, wy, 5, 7);
          }
        }
      }
    }

    if (typeof THREE !== 'undefined') {
      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    }
    return null;
  }

  function createReceptionSignTexture(text = 'RECEPTION') {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 128);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 116);

    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 14;
    ctx.font = 'bold 54px "Cinzel", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    if (typeof THREE !== 'undefined') {
      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    }
    return null;
  }

  function createElevatorDisplayTexture(floorText = '▲ 12') {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, 256, 128);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 120);

    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 16;
    ctx.font = 'bold 58px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(floorText, 128, 64);

    if (typeof THREE !== 'undefined') {
      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    }
    return null;
  }

  // ============================================================================
  // 2. PALETA DE MATERIALES PBR REALISTAS
  // ============================================================================

  function createSharedPBRMaterials(THREE) {
    const PhysicalMat = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;

    const darkMarbleTex = createMarbleTexture(true);
    const whiteMarbleTex = createMarbleTexture(false);
    const persianRugTex = createPersianRugTexture();

    return {
      marbleBlack: new PhysicalMat({
        color: 0x18181b,
        map: darkMarbleTex || null,
        roughness: 0.12,
        metalness: 0.15,
        clearcoat: 0.85,
        clearcoatRoughness: 0.08
      }),
      marbleWhite: new PhysicalMat({
        color: 0xf1f5f9,
        map: whiteMarbleTex || null,
        roughness: 0.18,
        metalness: 0.08,
        clearcoat: 0.75,
        clearcoatRoughness: 0.1
      }),
      metalBrass: new PhysicalMat({
        color: 0xd4af37,
        roughness: 0.18,
        metalness: 0.88,
        clearcoat: 0.55
      }),
      metalChrome: new PhysicalMat({
        color: 0xf8fafc,
        roughness: 0.08,
        metalness: 0.95,
        clearcoat: 0.9
      }),
      metalBronze: new PhysicalMat({
        color: 0x5c4033,
        roughness: 0.32,
        metalness: 0.82
      }),
      wroughtIron: new PhysicalMat({
        color: 0x111827,
        roughness: 0.48,
        metalness: 0.75
      }),
      woodWalnut: new PhysicalMat({
        color: 0x27140a,
        roughness: 0.35,
        metalness: 0.05,
        clearcoat: 0.35
      }),
      woodMahogany: new PhysicalMat({
        color: 0x3d1410,
        roughness: 0.3,
        metalness: 0.05,
        clearcoat: 0.45
      }),
      woodOak: new PhysicalMat({
        color: 0x854d0e,
        roughness: 0.42,
        metalness: 0.02
      }),
      leatherChesterfield: new PhysicalMat({
        color: 0x542914,
        roughness: 0.42,
        metalness: 0.06,
        clearcoat: 0.38
      }),
      velvetBurgundy: new PhysicalMat({
        color: 0x881337,
        roughness: 0.75,
        metalness: 0.04
      }),
      velvetNavy: new PhysicalMat({
        color: 0x1e3a8a,
        roughness: 0.72,
        metalness: 0.04
      }),
      linenWhite: new PhysicalMat({
        color: 0xf8fafc,
        roughness: 0.68,
        metalness: 0.02
      }),
      terryCloth: new PhysicalMat({
        color: 0xf1f5f9,
        roughness: 0.85,
        metalness: 0.0
      }),
      rugPersian: new PhysicalMat({
        color: 0xffffff,
        map: persianRugTex || null,
        roughness: 0.8,
        metalness: 0.02
      }),
      glassClear: new PhysicalMat({
        color: 0xffffff,
        roughness: 0.05,
        metalness: 0.05,
        transmission: 0.92,
        transparent: true,
        opacity: 0.55
      }),
      glassWine: new PhysicalMat({
        color: 0xffffff,
        roughness: 0.04,
        metalness: 0.08,
        transmission: 0.94,
        transparent: true,
        opacity: 0.65
      }),
      wineRed: new PhysicalMat({
        color: 0x831843,
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88
      }),
      candleWax: new PhysicalMat({
        color: 0xfffbeb,
        roughness: 0.35,
        metalness: 0.02
      }),
      candleFlame: new THREE.MeshBasicMaterial({
        color: 0xfff066
      }),
      bulbEmissive: new THREE.MeshBasicMaterial({
        color: 0xfffbeb
      }),
      rosePetalRed: new PhysicalMat({
        color: 0xbe123c,
        roughness: 0.32,
        clearcoat: 0.45
      }),
      plantLeafGreen: new PhysicalMat({
        color: 0x15803d,
        roughness: 0.45
      }),
      chocolateGlaze: new PhysicalMat({
        color: 0x221108,
        roughness: 0.18,
        metalness: 0.08,
        clearcoat: 0.85
      })
    };
  }

  // ============================================================================
  // 3. UTILIDADES DE INTEGRACIÓN Y METADATOS INTERACTIVOS
  // ============================================================================

  function attachInteractiveData(group, meta, fallbackCategory) {
    if (!group || !meta) return;
    const userData = {
      interactive: true,
      id: meta.id || '',
      en: meta.en || meta.wordEn || '',
      ipa: meta.ipa || meta.phonetic || '',
      es: meta.es || meta.wordEs || '',
      category: meta.category || fallbackCategory || 'General',
      example: meta.example || '',
      type: meta.type || 'object',
      wordEn: meta.en || meta.wordEn || '',
      phonetic: meta.ipa || meta.phonetic || '',
      wordEs: meta.es || meta.wordEs || '',
      focusPos: meta.focusPos || (meta.pos ? { x: meta.pos[0], y: meta.pos[1] + 1.2, z: meta.pos[2] + 2.0 } : null),
      lookAtPos: meta.lookAtPos || (meta.pos ? { x: meta.pos[0], y: meta.pos[1] + 0.4, z: meta.pos[2] } : null)
    };

    group.userData = Object.assign({}, userData);
    group.traverse((child) => {
      if (child.isMesh) {
        child.userData = Object.assign({}, userData, { parentGroup: group });
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });

    if (global.World3D && global.World3D.WORLD3D_VOCAB_CATALOG && meta.id) {
      global.World3D.WORLD3D_VOCAB_CATALOG[meta.id] = userData;
    }

    if (global.World3D && Array.isArray(global.World3D.interactiveObjects)) {
      if (!global.World3D.interactiveObjects.includes(group)) {
        global.World3D.interactiveObjects.push(group);
      }
    }

    if (typeof global.attachContactShadow === 'function') {
      global.attachContactShadow(group, 0.36);
    }
  }

  // ============================================================================
  // 4. MODELADO DETALLADO: HOTEL LOBBY & 5-STAR SUITE
  // ============================================================================

  function buildHotelScene(targetGroup, options = {}) {
    // Pure Blender GLB Mode: Scenarios are loaded exclusively from assets/models/worlds/hotel.glb
    return targetGroup;
  }

  function createWineGlassGeometry(THREE) {
    const points = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.12, 0.005));
    points.push(new THREE.Vector2(0.11, 0.018));
    points.push(new THREE.Vector2(0.024, 0.035));
    points.push(new THREE.Vector2(0.014, 0.12));
    points.push(new THREE.Vector2(0.014, 0.38));
    points.push(new THREE.Vector2(0.03, 0.42));
    points.push(new THREE.Vector2(0.14, 0.49));
    points.push(new THREE.Vector2(0.165, 0.58));
    points.push(new THREE.Vector2(0.168, 0.65));
    points.push(new THREE.Vector2(0.13, 0.78));
    points.push(new THREE.Vector2(0.124, 0.81));
    return new THREE.LatheGeometry(points, 24);
  }

  function buildDatingScene(targetGroup, options = {}) {
    // Pure Blender GLB Mode: Scenarios are loaded exclusively from assets/models/worlds/dating.glb
    return targetGroup;
  }

  // 6. BUILDERS INDIVIDUALES EN MASTERENG3DBUILDERS (COMPATIBILIDAD POR ID)
  // ============================================================================

  B['hotel_receptionist_desk'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const counter = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.15, 0.95), M.woodWalnut);
    counter.position.y = 0.575;
    const top = new THREE.Mesh(new THREE.BoxGeometry(3.75, 0.08, 1.05), M.marbleBlack);
    top.position.y = 1.18;
    g.add(counter, top);
    return g;
  };

  B['hotel_bellhop_bell'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.02, 22), M.metalBrass);
    base.position.y = 0.01;
    const dome = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([
          [0.072, 0.02], [0.068, 0.045], [0.052, 0.072], [0.022, 0.088], [0.0, 0.09]
        ], M.metalBrass, 24)
      : new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), M.metalBrass);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.035, 12), M.metalChrome);
    pin.position.y = 0.095;
    g.add(base, dome, pin);
    return g;
  };

  B['hotel_luggage_cart'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const platform = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(1.65, 0.12, 0.95, M.velvetBurgundy, 0.015, 0.012)
      : new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.12, 0.95), M.velvetBurgundy);
    platform.position.y = 0.22;
    if (typeof global.createTubeHandleMesh === 'function') {
      const arch = global.createTubeHandleMesh([[-0.72, 0.28, 0], [-0.72, 1.55, 0], [0, 1.85, 0], [0.72, 1.55, 0], [0.72, 0.28, 0]], 0.026, M.metalBrass);
      g.add(arch);
    }
    g.add(platform);
    return g;
  };

  B['hotel_elevator'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const frame = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(3.4, 3.8, 0.25, M.metalBronze, 0.02, 0.015)
      : new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.8, 0.25), M.metalBronze);
    frame.position.y = 1.9;
    const indMat = PMF ? PMF.createDigitalScreenMaterial({
      key: 'elevator_floor_ind', bg: '#090d16', accent: '#f59e0b', title: '▲ FLOOR 12', lines: ['PENTHOUSE SUITE', 'EXPRESS ELEVATOR']
    }) : M.metalBrass;
    const ind = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.22), indMat);
    ind.position.set(0, 3.55, 0.14);
    g.add(frame, ind);
    return g;
  };

  B['hotel_lobby_sofa'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const seat = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(2.1, 0.28, 0.85, M.leatherChesterfield, 0.02, 0.015)
      : new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.28, 0.85), M.leatherChesterfield);
    seat.position.y = 0.38;
    const back = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(2.1, 0.62, 0.28, M.leatherChesterfield, 0.02, 0.015)
      : new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.62, 0.28), M.leatherChesterfield);
    back.position.set(0, 0.72, -0.32);
    g.add(seat, back);
    return g;
  };

  B['hotel_chandelier'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.018, 10, 32), M.metalBrass);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 2.4;
    g.add(ring);
    return g;
  };
  B['dating_chandelier'] = B['hotel_chandelier'];

  B['hotel_king_bed'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const headboard = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(2.7, 1.8, 0.18, M.woodWalnut, 0.02, 0.015)
      : new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.8, 0.18), M.woodWalnut);
    headboard.position.set(0, 0.9, -1.25);
    const mattress = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(2.1, 0.32, 2.2, M.linenWhite, 0.025, 0.02)
      : new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.32, 2.2), M.linenWhite);
    mattress.position.set(0, 0.51, 0);
    g.add(headboard, mattress);
    return g;
  };

  B['hotel_minibar'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const body = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.75, 0.95, 0.65, M.wroughtIron, 0.018, 0.014)
      : new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.95, 0.65), M.wroughtIron);
    body.position.y = 0.475;
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.88, 0.04), M.glassClear);
    door.position.set(0, 0.475, 0.33);
    g.add(body, door);
    return g;
  };

  B['hotel_safe_box'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const body = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.55, 0.45, 0.48, M.wroughtIron, 0.018, 0.014)
      : new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.48), M.wroughtIron);
    body.position.y = 0.225;
    const keypadMat = PMF ? PMF.createDigitalScreenMaterial({
      key: 'hotel_safe_keypad', bg: '#090d16', accent: '#22c55e', title: 'LOCKED [----]', lines: ['[1] [2] [3]', '[4] [5] [6]', '[7] [8] [9]', '[CLEAR] [0] [OK]']
    }) : M.metalBrass;
    const keypad = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.24), keypadMat);
    keypad.position.set(0.12, 0.24, 0.248);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 14), M.metalBrass);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(-0.12, 0.24, 0.25);
    g.add(body, keypad, handle);
    return g;
  };

  B['hotel_bathrobe'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.95, 14), M.terryCloth);
    robe.position.y = 0.52;
    g.add(robe);
    return g;
  };

  B['dating_table_for_two'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.04, 16), M.velvetBurgundy);
    top.position.y = 0.93;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.08, 16), M.wroughtIron);
    base.position.y = 0.04;
    g.add(top, base);
    return g;
  };

  B['dating_candlelight'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.16, 16), M.candleWax);
    candle.position.y = 0.15;
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.065, 12), M.candleFlame);
    flame.position.y = 0.26;
    g.add(candle, flame);
    return g;
  };

  B['dating_wine_glasses'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const glassGeo = createWineGlassGeometry(THREE);
    [-0.15, 0.15].forEach((gx) => {
      const gMesh = new THREE.Mesh(glassGeo, M.glassWine);
      gMesh.scale.set(0.38, 0.38, 0.38);
      gMesh.position.set(gx, 0, 0);
      g.add(gMesh);
    });
    return g;
  };

  B['dating_violin'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const vLower = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.045, 18), M.woodMahogany);
    vLower.rotation.x = Math.PI / 2;
    vLower.position.set(0, 0.85, 0.22);
    const vUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.045, 18), M.woodMahogany);
    vUpper.rotation.x = Math.PI / 2;
    vUpper.position.set(0, 1.05, 0.22);
    g.add(vLower, vUpper);
    return g;
  };

  B['dating_city_balcony'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const rail = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 0.08), M.wroughtIron);
    rail.position.set(0, 1.25, -2.5);
    g.add(rail);
    return g;
  };

  B['dating_menu'] = function(item, scen, P) {
    const g = new THREE.Group();
    const folderL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.01), getMat(P, 'woodWalnut', 0x5c2e14));
    folderL.position.set(-0.09, 0.14, 0);
    folderL.rotation.y = 0.25;
    const folderR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.01), getMat(P, 'woodWalnut', 0x5c2e14));
    folderR.position.set(0.09, 0.14, 0);
    folderR.rotation.y = -0.25;
    const paper = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.25, 0.015), getMat(P, 'crownWhite', 0xf8fafc));
    paper.position.set(0, 0.14, 0.01);
    g.add(folderL, folderR, paper);
    return g;
  };

  B['dating_rose_bouquet'] = function(item, scen, P) {
    const g = new THREE.Group();
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.24, 16), getMat(P, 'glassClear', 0xe0f2fe));
    vase.position.y = 0.12;
    g.add(vase);
    for (let i = 0; i < 5; i++) {
      const rose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), getMat(P, 'flowerRed', 0xef4444));
      rose.position.set(Math.sin(i * 1.2) * 0.05, 0.3, Math.cos(i * 1.2) * 0.05);
      g.add(rose);
    }
    return g;
  };

  B['dating_waiter_npc'] = function(item, scen, P) {
    const g = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.55, 0.22), getMat(P, 'ironBlack', 0x0f172a));
    torso.position.y = 1.0;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 12), getMat(P, 'woodPine', 0xfcd34d));
    head.position.y = 1.42;
    const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.015, 16), getMat(P, 'metalChrome', 0xe2e8f0));
    tray.position.set(0.24, 0.98, 0.18);
    g.add(torso, head, tray);
    return g;
  };

  B['dating_chocolate_dessert'] = function(item, scen, P) {
    const g = new THREE.Group();
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.02, 16), getMat(P, 'ceramicWhite', 0xffffff));
    plate.position.y = 0.01;
    const cake = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.06, 14), getMat(P, 'woodDark', 0x271206));
    cake.position.y = 0.04;
    g.add(plate, cake);
    return g;
  };

  B['dating_conversation_cards'] = function(item, scen, P) {
    const g = new THREE.Group();
    const deck = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.18), getMat(P, 'fabricGold', 0xd97706));
    deck.position.y = 0.025;
    g.add(deck);
    return g;
  };

  B['dating_ice_bucket'] = function(item, scen, P) {
    const g = new THREE.Group();
    const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.22, 16), getMat(P, 'metalChrome', 0xe2e8f0));
    bucket.position.y = 0.11;
    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.3, 12), getMat(P, 'leafGreen1', 0x064e3b));
    bottle.position.set(0.02, 0.2, 0);
    g.add(bucket, bottle);
    return g;
  };

  B['dating_string_lights'] = function(item, scen, P) {
    const g = new THREE.Group();
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 2.2, 8), getMat(P, 'metalDark', 0x334155));
    wire.rotation.z = Math.PI / 2;
    wire.position.y = 2.4;
    g.add(wire);
    [-0.8, -0.4, 0, 0.4, 0.8].forEach(x => {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), getMat(P, 'emissiveBulb', 0xfef08a));
      bulb.position.set(x, 2.34, 0);
      g.add(bulb);
    });
    return g;
  };

  B['dating_cloth_napkin'] = function(item, scen, P) {
    const g = new THREE.Group();
    const nap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 10), getMat(P, 'burgundyCloth', 0x881337));
    nap.rotation.z = Math.PI / 2;
    nap.position.y = 0.03;
    g.add(nap);
    return g;
  };

  B['dating_silver_cutlery'] = function(item, scen, P) {
    const g = new THREE.Group();
    const matS = getMat(P, 'metalChrome', 0xe2e8f0);
    const k = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.005, 0.2), matS);
    k.position.x = 0.05;
    const f = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.005, 0.2), matS);
    f.position.x = -0.05;
    g.add(k, f);
    return g;
  };
  B['dating_champagne_flute'] = B['dating_wine_glasses'];
  B['dating_dessert_spoon'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.005, 0.14), getMat(P, 'metalChrome', 0xe2e8f0)));
    return g;
  };

  B['dating_reserved_sign'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.03), getMat(P, 'metalBrass', 0xf59e0b)));
    return g;
  };

  B['dating_cocktail_shaker'] = function(item, scen, P) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.2, 16), getMat(P, 'metalChrome', 0xe2e8f0));
    body.position.y = 0.1;
    g.add(body);
    return g;
  };

  B['dating_bread_basket'] = function(item, scen, P) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.07, 14), getMat(P, 'woodPine', 0xb47b38));
    b.position.y = 0.035;
    g.add(b);
    return g;
  };

  B['dating_olive_oil_cruet'] = function(item, scen, P) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.16, 12), getMat(P, 'glassClear', 0x84cc16));
    b.position.y = 0.08;
    g.add(b);
    return g;
  };

  B['dating_coat_rack'] = function(item, scen, P) {
    const g = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, 1.8, 10), getMat(P, 'woodWalnut', 0x5c2e14));
    pole.position.y = 0.9;
    g.add(pole);
    return g;
  };

  B['dating_acoustic_guitar'] = function(item, scen, P) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.5), getMat(P, 'woodPine', 0xd4a373));
    body.position.y = 0.4;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.5, 8), getMat(P, 'woodWalnut', 0x5c2e14));
    neck.position.set(0, 0.75, 0);
    g.add(body, neck);
    return g;
  };

  B['dating_velvet_drapes'] = function(item, scen, P) {
    const g = new THREE.Group();
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.0, 10), getMat(P, 'metalBrass', 0xf59e0b));
    rod.rotation.z = Math.PI / 2;
    rod.position.y = 2.4;
    const drape = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.2, 0.05), getMat(P, 'burgundyCloth', 0x881337));
    drape.position.set(-0.8, 1.2, 0);
    g.add(rod, drape);
    return g;
  };

  B['dating_maitre_podium'] = function(item, scen, P) {
    const g = new THREE.Group();
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.0, 0.35), getMat(P, 'woodWalnut', 0x5c2e14));
    p.position.y = 0.5;
    g.add(p);
    return g;
  };

  // --- HOTEL BUILDERS COMPLEMENTARIOS ---
  B['hotel_room_keycard'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.01, 0.2), getMat(P, 'emissiveScreen', 0x0284c7)));
    return g;
  };
  B['hotel_suitcase'] = function(item, scen, P) {
    const g = new THREE.Group();
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.24), getMat(P, 'woodWalnut', 0x854d0e));
    bag.position.y = 0.32;
    g.add(bag);
    return g;
  };
  B['hotel_checkin_terminal'] = function(item, scen, P) {
    const g = new THREE.Group();
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.0, 10), getMat(P, 'metalDark', 0x1e293b));
    stand.position.y = 0.5;
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.02), getMat(P, 'emissiveScreen', 0x38bdf8));
    screen.position.set(0, 1.05, 0.02);
    g.add(stand, screen);
    return g;
  };
  B['hotel_concierge'] = function(item, scen, P) {
    const g = new THREE.Group();
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 0.55), getMat(P, 'woodWalnut', 0x5c2e14));
    desk.position.y = 0.45;
    g.add(desk);
    return g;
  };
  B['hotel_passport'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.18), getMat(P, 'fabricNavyTufted', 0x1e3a8a)));
    return g;
  };
  B['hotel_room_service_tray'] = function(item, scen, P) {
    const g = new THREE.Group();
    const tray = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.02, 0.32), getMat(P, 'metalChrome', 0xe2e8f0));
    tray.position.y = 0.01;
    const cloche = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), getMat(P, 'metalChrome', 0xf8fafc));
    cloche.position.y = 0.02;
    g.add(tray, cloche);
    return g;
  };
  B['hotel_do_not_disturb'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.22, 0.01), getMat(P, 'flowerRed', 0xef4444)));
    return g;
  };
  B['hotel_towel_rack'] = function(item, scen, P) {
    const g = new THREE.Group();
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8), getMat(P, 'metalChrome', 0xe2e8f0));
    bar.rotation.z = Math.PI / 2;
    bar.position.y = 1.0;
    g.add(bar);
    return g;
  };
  B['hotel_thermostat'] = function(item, scen, P) {
    const g = new THREE.Group();
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 14), getMat(P, 'metalDark', 0x1e293b));
    d.rotation.x = Math.PI / 2;
    g.add(d);
    return g;
  };
  B['hotel_emergency_exit'] = function(item, scen, P) {
    const g = new THREE.Group();
    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.16, 0.03), getMat(P, 'leafGreen3', 0x22c55e));
    sign.position.y = 2.0;
    g.add(sign);
    return g;
  };
  B['hotel_valet_podium'] = function(item, scen, P) {
    const g = new THREE.Group();
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.05, 0.4), getMat(P, 'woodWalnut', 0x3e1f0d));
    p.position.y = 0.52;
    g.add(p);
    return g;
  };
  B['hotel_pillow_menu'] = function(item, scen, P) {
    const g = new THREE.Group();
    for (let i = 0; i < 2; i++) {
      const pil = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.2), getMat(P, 'crownWhite', 0xffffff));
      pil.position.y = 0.05 + i * 0.1;
      g.add(pil);
    }
    return g;
  };
  B['hotel_slippers'] = function(item, scen, P) {
    const g = new THREE.Group();
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.24), getMat(P, 'crownWhite', 0xffffff));
    s.position.y = 0.015;
    g.add(s);
    return g;
  };
  B['hotel_key_drop'] = function(item, scen, P) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.32, 0.2), getMat(P, 'metalBrass', 0xf59e0b)));
    return g;
  };
  B['hotel_coffee_station'] = function(item, scen, P) {
    const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.26), getMat(P, 'metalDark', 0x1e293b));
    m.position.y = 0.18;
    g.add(m);
    return g;
  };
  B['hotel_ironing_board'] = function(item, scen, P) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.04, 0.3), getMat(P, 'stonePaver', 0x94a3b8));
    b.position.y = 0.8;
    g.add(b);
    return g;
  };
  B['hotel_suit_hangers'] = function(item, scen, P) {
    const g = new THREE.Group();
    const h = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.38, 8), getMat(P, 'woodOak', 0x9a6234));
    h.rotation.z = Math.PI / 2;
    h.position.y = 1.3;
    g.add(h);
    return g;
  };
  B['hotel_swimming_pool'] = function(item, scen, P) {
    const g = new THREE.Group();
    const pool = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.2, 1.5), getMat(P, 'stonePaver', 0x38bdf8));
    pool.position.y = 0.1;
    const water = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.04, 1.3), getMat(P, 'glassClear', 0x0284c7));
    water.position.y = 0.19;
    g.add(pool, water);
    return g;
  };
  B['hotel_fitness_treadmill'] = function(item, scen, P) {
    const g = new THREE.Group();
    const deck = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 1.4), getMat(P, 'ironBlack', 0x0f172a));
    deck.position.y = 0.08;
    g.add(deck);
    return g;
  };
  B['hotel_shuttle_van'] = function(item, scen, P) {
    const g = new THREE.Group();
    const van = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 2.0), getMat(P, 'crownWhite', 0xf8fafc));
    van.position.y = 0.5;
    g.add(van);
    return g;
  };
  B['hotel_revolving_door'] = function(item, scen, P) {
    const g = new THREE.Group();
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.1, 14, 1, true), getMat(P, 'glassClear', 0xe0f2fe));
    cyl.position.y = 1.05;
    g.add(cyl);
    return g;
  };
  B['hotel_smoke_detector'] = function(item, scen, P) {
    const g = new THREE.Group();
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 14), getMat(P, 'crownWhite', 0xffffff));
    d.position.y = 2.4;
    g.add(d);
    return g;
  };

  B['dating_ring_box'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const base = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.11, 0.055, 0.11, M.velvetBurgundy, 0.008, 0.006)
      : new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.055, 0.11), M.velvetBurgundy);
    base.position.y = 0.028;
    const lid = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.11, 0.035, 0.11, M.velvetBurgundy, 0.008, 0.006)
      : new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.035, 0.11), M.velvetBurgundy);
    lid.position.set(0, 0.072, -0.048);
    lid.rotation.x = -0.95;
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.004, 12, 24), M.metalBrass);
    band.position.set(0, 0.068, 0.005);
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.012, 0), M.glassClear);
    gem.position.set(0, 0.09, 0.005);
    g.add(base, lid, band, gem);
    return g;
  };

  // ============================================================================
  // 7. BUCLE DE ANIMACIÓN INTERNO DESACTIVADO (UNIFICADO EN WORLD3D._rafId)
  // ============================================================================

  function startLocalAnimationLoop() {
    // Unificado con el bucle principal World3D._rafId para garantizar 60 FPS sin doble RAF.
  }

  // ============================================================================
  // 8. SISTEMA DE ENGANCHE AUTOMÁTICO (SMART HOOKS PARA WORLD3D)
  // ============================================================================

  function hookIntoWorld3D() {
    if (!global.World3D) return;
    if (!global.World3D._datingHotelHooked) {
      global.World3D._datingHotelHooked = true;
    }
  }

  function bindSelectListener() {
    if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return;
    const selectEl = document.getElementById('world3dScenarioSelect');
    if (selectEl && selectEl.dataset && !selectEl.dataset.masterengDatingHotelBound) {
      selectEl.dataset.masterengDatingHotelBound = 'true';
      selectEl.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'hotel' || val === 'dating') {
          setTimeout(() => {
            const sc = global.World3D && global.World3D.scene;
            if (sc) {
              // hotel pure glb
              // dating pure glb
              if (global.World3D && typeof global.World3D.normalizeSceneInteractiveMetadata === 'function') {
                global.World3D.normalizeSceneInteractiveMetadata(sc, val);
              }
            }
          }, 60);
        }
      });
    }
  }

  hookIntoWorld3D();
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        hookIntoWorld3D();
        bindSelectListener();
      });
    } else {
      bindSelectListener();
    }
    [300, 800, 1500, 3000].forEach((delay) => {
      setTimeout(() => {
        hookIntoWorld3D();
        bindSelectListener();
      }, delay);
    });
  }

  // ============================================================================
  // 9. EXPORTACIONES PÚBLICAS
  // ============================================================================

  B.buildHotelScene = buildHotelScene;
  B.buildDatingScene = buildDatingScene;
  B.createWineGlassGeometry = createWineGlassGeometry;
  B.createSharedPBRMaterials = createSharedPBRMaterials;

  global.rebuildWorld3DHotel = function () {
    const sc = global.World3D && global.World3D.scene;
    if (sc) return buildHotelScene(sc);
  };
  global.rebuildWorld3DDating = function () {
    const sc = global.World3D && global.World3D.scene;
    if (sc) return buildDatingScene(sc);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.MasterENG3DBuilders;
  }
})(typeof window !== 'undefined' ? window : globalThis);

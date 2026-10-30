/**
 * MasterENG - 3D Retail & Culinary Environment Builder
 * World Tour High-Fidelity 3D Architecture for Fine Restaurant & Modern Supermarket
 *
 * Exposes:
 *  - window.MasterENG3DBuilders.buildRestaurantScene(targetGroup, options)
 *  - window.MasterENG3DBuilders.buildSupermarketScene(targetGroup, options)
 *  - window.MasterENG3DBuilders['market_*'] & window.MasterENG3DBuilders['rest_*']
 *
 * Compatible with Three.js (WebGL) and MasterENG World Tour Engine.
 */
(function (global) {
  'use strict';

  // Namespace initialization
  const B = global.MasterENG3DBuilders = global.MasterENG3DBuilders || {};

  // Resolve THREE instance
  function getThree() {
    if (typeof global.THREE !== 'undefined') return global.THREE;
    if (typeof window !== 'undefined' && typeof window.THREE !== 'undefined') return window.THREE;
    if (typeof require !== 'undefined') {
      try { return require('three'); } catch (_) {}
    }
    return null;
  }

  // Material fallback helper for individual modular builders
  const _marketMatCache = new Map();
  function getMat(P, name, fallbackColor, roughness, metalness) {
    if (P && P[name]) return P[name];
    const THREE = getThree();
    if (THREE) {
      const c = fallbackColor || 0x64748b;
      const r = roughness !== undefined ? roughness : 0.35;
      const m = metalness !== undefined ? metalness : 0.1;
      const key = `${c}_${r}_${m}`;
      if (_marketMatCache.has(key)) return _marketMatCache.get(key);
      const M = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
      const mat = new M({
        color: c,
        roughness: r,
        metalness: m
      });
      _marketMatCache.set(key, mat);
      return mat;
    }
    return null;
  }

  // ============================================================================
  // PROCEDURAL CANVAS TEXTURE GENERATORS (PBR COMPATIBLE)
  // ============================================================================
  const TextureCache = {};

  function createParquetTexture(THREE) {
    if (TextureCache.parquet) return TextureCache.parquet;
    if (typeof document === 'undefined') return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Dark luxury walnut parquet herringbone
      ctx.fillStyle = '#2b1408';
      ctx.fillRect(0, 0, 512, 512);

      const tileW = 64;
      const tileH = 32;
      for (let y = 0; y < 512; y += tileH) {
        for (let x = 0; x < 512; x += tileW) {
          const tone = ((x / tileW) + (y / tileH)) % 2 === 0 ? '#381c0d' : '#261106';
          ctx.fillStyle = tone;
          ctx.fillRect(x + 1, y + 1, tileW - 2, tileH - 2);

          // Wood grain lines
          ctx.fillStyle = 'rgba(255,255,255,0.04)';
          ctx.fillRect(x + 2, y + 6, tileW - 4, 2);
          ctx.fillRect(x + 4, y + 18, tileW - 8, 2);
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(6, 6);
      TextureCache.parquet = tex;
      return tex;
    } catch (_) {
      return null;
    }
  }

  function createRestaurantWallTexture(THREE) {
    if (TextureCache.restWall) return TextureCache.restWall;
    if (typeof document === 'undefined') return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Deep Burgundy & Dark Walnut Boiserie
      ctx.fillStyle = '#1c0c14';
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = '#d4af37'; // Antique Gold Trim
      ctx.lineWidth = 4;
      ctx.strokeRect(32, 32, 208, 448);
      ctx.strokeRect(272, 32, 208, 448);

      ctx.fillStyle = '#2d1220';
      ctx.fillRect(40, 40, 192, 432);
      ctx.fillRect(280, 40, 192, 432);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 1);
      TextureCache.restWall = tex;
      return tex;
    } catch (_) {
      return null;
    }
  }

  function createTerrazzoTexture(THREE) {
    if (TextureCache.terrazzo) return TextureCache.terrazzo;
    if (typeof document === 'undefined') return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Light commercial supermarket floor tile
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      for (let i = 0; i <= 512; i += 64) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, 512);
        ctx.moveTo(0, i); ctx.lineTo(512, i);
        ctx.stroke();
      }

      // Specks
      const colors = ['#94a3b8', '#64748b', '#cbd5e1', '#e2e8f0'];
      for (let s = 0; s < 400; s++) {
        ctx.fillStyle = colors[s % colors.length];
        const rx = Math.random() * 512;
        const ry = Math.random() * 512;
        ctx.fillRect(rx, ry, 2, 2);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(8, 8);
      TextureCache.terrazzo = tex;
      return tex;
    } catch (_) {
      return null;
    }
  }

  function createAisleSignTexture(THREE, text) {
    const key = 'aisle_' + text;
    if (TextureCache[key]) return TextureCache[key];
    if (typeof document === 'undefined') return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#0284c7'; // Supermarket Cyan Blue
      ctx.fillRect(0, 0, 512, 160);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.strokeRect(8, 8, 496, 144);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 80);

      const tex = new THREE.CanvasTexture(canvas);
      TextureCache[key] = tex;
      return tex;
    } catch (_) {
      return null;
    }
  }

  // ============================================================================
  // PBR MATERIAL PALETTE GENERATOR
  // ============================================================================
  function createMaterialPalette(THREE) {
    const M = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;

    return {
      // Wood
      walnutDark: new M({ color: 0x3d1f11, roughness: 0.32, metalness: 0.08, clearcoat: 0.4 }),
      lightPine: new M({ color: 0xd4a373, roughness: 0.55, metalness: 0.02 }),
      oakMedium: new M({ color: 0x854d0e, roughness: 0.45, metalness: 0.05 }),

      // Metals
      stainlessSteel: new M({ color: 0xe2e8f0, roughness: 0.18, metalness: 0.92, clearcoat: 0.7 }),
      chromeHighPolish: new M({ color: 0xf8fafc, roughness: 0.08, metalness: 0.98, clearcoat: 1.0 }),
      brassGold: new M({ color: 0xd4af37, roughness: 0.22, metalness: 0.88, clearcoat: 0.5 }),
      castIronBlack: new M({ color: 0x1e293b, roughness: 0.65, metalness: 0.45 }),
      copperPolished: new M({ color: 0xb45309, roughness: 0.22, metalness: 0.85, clearcoat: 0.6 }),

      // Ceramics & Glass
      ceramicWhite: new M({ color: 0xffffff, roughness: 0.15, metalness: 0.04, clearcoat: 0.9 }),
      glassClear: new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.45,
        roughness: 0.08,
        metalness: 0.1,
        transmission: 0.85,
        ior: 1.5
      }),

      // Fabrics & Leather
      velvetBurgundy: new M({ color: 0x881337, roughness: 0.78, metalness: 0.05 }),
      clothWhite: new M({ color: 0xf8fafc, roughness: 0.85, metalness: 0.02 }),
      leatherCognac: new M({ color: 0x78350f, roughness: 0.45, metalness: 0.15 }),
      clothRed: new M({ color: 0xef4444, roughness: 0.6, metalness: 0.05 }),

      // Supermarket Merchandise
      cerealRed: new M({ color: 0xef4444, roughness: 0.5 }),
      cerealBlue: new M({ color: 0x2563eb, roughness: 0.5 }),
      cerealGreen: new M({ color: 0x16a34a, roughness: 0.5 }),
      cerealYellow: new M({ color: 0xeab308, roughness: 0.5 }),
      canLabel1: new M({ color: 0xb91c1c, roughness: 0.35, metalness: 0.2 }),
      canLabel2: new M({ color: 0x047857, roughness: 0.35, metalness: 0.2 }),
      canMetal: new M({ color: 0xd1d5db, roughness: 0.15, metalness: 0.9 }),
      appleRed: new M({ color: 0xdc2626, roughness: 0.25, metalness: 0.05, clearcoat: 0.6 }),
      bananaYellow: new M({ color: 0xfacc15, roughness: 0.4, metalness: 0.05 }),
      orangeFruit: new M({ color: 0xf97316, roughness: 0.5, metalness: 0.05 }),
      lettuceGreen: new M({ color: 0x22c55e, roughness: 0.55, metalness: 0.02 }),

      // Emissives & Lights
      heatLampAmber: new THREE.MeshStandardMaterial({
        color: 0xffedd5,
        emissive: 0xff7700,
        emissiveIntensity: 2.8,
        roughness: 0.1
      }),
      gasFlameBlue: new THREE.MeshStandardMaterial({
        color: 0xbae6fd,
        emissive: 0x0284c7,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.85
      }),
      gasFlameOrange: new THREE.MeshStandardMaterial({
        color: 0xffedd5,
        emissive: 0xf97316,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9
      }),
      ledStripWhite: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2.2,
        roughness: 0.2
      }),
      laserRed: new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.85 })
    };
  }

  // ============================================================================
  // INTERACTIVE USERDATA & RAYCASTER BINDING HELPER
  // ============================================================================
  function makeInteractive(group, spec) {
    if (!group || !spec) return group;
    const px = group.position.x || 0;
    const py = group.position.y || 0;
    const pz = group.position.z || 0;

    const data = {
      interactive: true,
      id: spec.id,
      en: spec.en,
      ipa: spec.ipa || '',
      es: spec.es || '',
      category: spec.category || 'Retail & Culinary',
      example: spec.example || '',
      type: spec.type || 'object',
      wordEn: spec.en,
      phonetic: spec.ipa || '',
      wordEs: spec.es || '',
      focusPos: { x: px + (px >= 0 ? -1.8 : 1.8), y: Math.max(1.8, py + 1.6), z: pz + 2.4 },
      lookAtPos: { x: px, y: Math.max(0.4, py + 0.4), z: pz }
    };

    group.name = spec.id;
    group.userData = Object.assign({}, data);

    group.traverse(child => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.userData = Object.assign({}, data, { parentGroup: group });
      }
    });

    if (typeof window !== 'undefined' && window.WORLD3D_VOCAB_CATALOG) {
      window.WORLD3D_VOCAB_CATALOG[spec.id] = data;
    }

    if (typeof global.attachContactShadow === 'function') {
      global.attachContactShadow(group, 0.38);
    }

    return group;
  }

  // Helper to safely register an object into World3D interactive array
  function registerInteractive(obj) {
    if (!obj) return;
    if (typeof window !== 'undefined' && window.World3D) {
      const arr = window.World3D.interactiveObjects;
      if (Array.isArray(arr) && !arr.includes(obj)) {
        arr.push(obj);
      }
    }
  }

  // ============================================================================
  // RECONSTRUCCIÓN 1: RESTAURANT (FINE DINING & GOURMET OPEN KITCHEN)
  // ============================================================================
  function buildRestaurantScene(targetGroup, options) {
    const THREE = getThree();
    if (!THREE) return null;

    const root = targetGroup || new THREE.Group();
    root.name = 'RestaurantArchitecturalMasterGroup';

    // Limpieza de objetos placeholder anteriores si existen
    const existing = root.getObjectByName('Restaurant_ZoneRoot');
    if (existing) root.remove(existing);

    const zoneRoot = new THREE.Group();
    zoneRoot.name = 'Restaurant_ZoneRoot';
    root.add(zoneRoot);

    const M = createMaterialPalette(THREE);

    // --------------------------------------------------------------------------
    // ARQUITECTURA BASE: PISO DE NOGAL, PAREDES BOISERIE Y TECHO CÁLIDO
    // --------------------------------------------------------------------------
    const floorGeo = new THREE.BoxGeometry(20, 0.24, 18);
    const parquetTex = createParquetTexture(THREE);
    const floorMat = parquetTex
      ? new THREE.MeshStandardMaterial({ map: parquetTex, roughness: 0.35, metalness: 0.1 })
      : M.walnutDark;
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.12, -0.5);
    floor.receiveShadow = false;
    zoneRoot.add(floor);

    // Alfombra persa borgoña bajo el comedor central
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(11, 0.02, 8.5),
      M.velvetBurgundy
    );
    rug.position.set(0, 0.01, 1.2);
    rug.receiveShadow = false;
    zoneRoot.add(rug);

    // Pared trasera decorativa con boiserie
    const wallTex = createRestaurantWallTexture(THREE);
    const backWallMat = wallTex
      ? new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.5 })
      : new THREE.MeshStandardMaterial({ color: 0x1f0e17, roughness: 0.5 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(20, 5.2, 0.3), backWallMat);
    backWall.position.set(0, 2.6, -9.0);
    backWall.receiveShadow = false;
    zoneRoot.add(backWall);

    // Paredes laterales
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.2, 18), backWallMat);
    leftWall.position.set(-10, 2.6, -0.5);
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.2, 18), backWallMat);
    rightWall.position.set(10, 2.6, -0.5);
    zoneRoot.add(leftWall, rightWall);

    // Lámparas de araña cálidas (Pendant Chandeliers)
    [-2.8, 2.8].forEach(lx => {
      [1.5, -2.5].forEach(lz => {
        const chandelier = new THREE.Group();
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 12), M.brassGold);
        rod.position.y = 4.3;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.04, 12, 32), M.brassGold);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 3.6;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), M.heatLampAmber);
        bulb.position.y = 3.6;
        chandelier.add(rod, ring, bulb);

        const pointLight = new THREE.PointLight(0xffb74d, 1.2, 8);
        pointLight.castShadow = false;
        pointLight.position.set(lx, 3.5, lz);
        chandelier.add(pointLight);

        chandelier.position.set(lx, 0, lz);
        zoneRoot.add(chandelier);
      });
    });

    // --------------------------------------------------------------------------
    // ZONA 1: COMEDOR PRINCIPAL, 4 MESAS SERVIDAS, BOOTHS, HIGH CHAIR, DESSERT CART
    // --------------------------------------------------------------------------
    function buildFullyServedTable(posX, posZ, isVIP, tableId) {
      const tableGroup = new THREE.Group();
      tableGroup.position.set(posX, 0, posZ);

      // Base pedestal de latón y columna
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.52, 0.06, 16), M.brassGold);
      base.position.y = 0.03;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.92, 16), M.brassGold);
      pole.position.y = 0.49;
      const topWood = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.04, 16), M.walnutDark);
      topWood.position.y = 0.95;

      // Mantel drapeado blanco
      const cloth = new THREE.Mesh(
        new THREE.CylinderGeometry(1.04, 1.10, 0.22, 16),
        isVIP ? M.velvetBurgundy : M.clothWhite
      );
      cloth.position.y = 0.88;
      tableGroup.add(base, pole, topWood, cloth);

      // 4 Sillas acolchadas alrededor de la mesa
      const chairAngles = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
      chairAngles.forEach((ang, idx) => {
        const chair = new THREE.Group();
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.46), M.leatherCognac);
        seat.position.y = 0.46;
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.52, 0.05), M.leatherCognac);
        back.position.set(0, 0.72, -0.21);

        [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.014, 0.46, 8), M.brassGold);
          leg.position.set(lx, 0.23, lz);
          chair.add(leg);
        });

        chair.add(seat, back);
        chair.rotation.y = ang + Math.PI;
        const dist = 1.25;
        chair.position.set(Math.sin(ang) * dist, 0, Math.cos(ang) * dist);
        tableGroup.add(chair);
      });

      // 2 Servicios completos (Platos de cerámica con comida 3D)
      [-0.45, 0.45].forEach((offset, idx) => {
        const placeSetting = new THREE.Group();

        // Plato de cerámica
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.02, 14), M.ceramicWhite);
        plate.position.y = 0.96;

        // Comida 3D: Corte de filete o salmón + puré + guarnición
        const proteinMat = idx === 0 ? M.walnutDark : M.clothRed;
        const meat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.035, 0.08), proteinMat);
        meat.position.set(-0.02, 0.98, 0);
        meat.rotation.y = 0.3;

        const mash = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 10), M.lightPine);
        mash.scale.set(1, 0.6, 1);
        mash.position.set(0.05, 0.98, -0.03);

        const herb = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.09, 8), M.lettuceGreen);
        herb.rotation.z = Math.PI / 2;
        herb.position.set(0.02, 0.985, 0.04);

        // Cubiertos de plata (Tenedor y cuchillo de carne)
        const fork = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.006, 0.16), M.stainlessSteel);
        fork.position.set(-0.25, 0.96, 0);
        const knife = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.006, 0.16), M.stainlessSteel);
        knife.position.set(0.25, 0.96, 0);

        // Vaso de agua de cristal
        const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.11, 14), M.glassClear);
        glass.position.set(0.24, 1.01, -0.16);

        placeSetting.add(plate, meat, mash, herb, fork, knife, glass);
        placeSetting.position.set(0, 0, offset);
        tableGroup.add(placeSetting);
      });

      // Jarra de agua fría de cristal con hielo y manija
      const pitcher = new THREE.Group();
      const pBody = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.28, 16), M.glassClear);
      pBody.position.y = 1.09;
      const pHandle = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 8, 16, Math.PI), M.glassClear);
      pHandle.rotation.y = Math.PI / 2;
      pHandle.position.set(-0.08, 1.10, 0);
      pitcher.add(pBody, pHandle);
      pitcher.position.set(0.38, 0, 0.15);
      tableGroup.add(pitcher);

      // Salero y Pimentero de cerámica
      const shakers = new THREE.Group();
      const salt = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 12), M.ceramicWhite);
      salt.position.set(-0.04, 0.99, 0);
      const pepper = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 12), M.castIronBlack);
      pepper.position.set(0.04, 0.99, 0);
      shakers.add(salt, pepper);
      shakers.position.set(0, 0, -0.22);
      tableGroup.add(shakers);

      // Carpeta de la cuenta de cuero (Bill Folder)
      const billFolder = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.018, 0.22), M.walnutDark);
      billFolder.position.set(-0.35, 0.96, -0.12);
      billFolder.rotation.y = 0.2;
      tableGroup.add(billFolder);

      // Elemento VIP: Letrero de mesa reservada dorado y vela
      if (isVIP) {
        const reservedSign = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.04), M.brassGold);
        reservedSign.position.set(-0.15, 0.98, 0.25);
        const candleWax = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 12), M.ceramicWhite);
        candleWax.position.set(0, 1.04, 0);
        const candleFlame = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.05, 10), M.heatLampAmber);
        candleFlame.position.set(0, 1.15, 0);
        tableGroup.add(reservedSign, candleWax, candleFlame);
      }

      makeInteractive(tableGroup, {
        id: tableId || 'rest_dining_table',
        en: 'Dining Table',
        ipa: "/ˈdaɪ.nɪŋ ˈteɪ.bəl/",
        es: 'Mesa de Comedor Servida con Platos, Cubiertos y Carpeta',
        category: 'Fine Dining Area',
        example: 'Our served dining table has porcelain dinner plates and silver cutlery.'
      });

      return tableGroup;
    }

    // 4 Mesas Servidas Principales
    const t1 = buildFullyServedTable(-2.2, 0.8, false, 'rest_dining_table');
    const t2 = buildFullyServedTable(2.2, 0.8, false, 'rest_dining_table_2');
    const t3 = buildFullyServedTable(-2.2, 3.8, true, 'rest_dining_table_vip1');
    const t4 = buildFullyServedTable(2.2, 3.8, false, 'rest_dining_table_vip2');
    zoneRoot.add(t1, t2, t3, t4);
    registerInteractive(t1);
    registerInteractive(t2);
    registerInteractive(t3);
    registerInteractive(t4);

    // Cabinas Acolchadas a los Lados (Booths)
    function buildPaddedBooth(posX, posZ, rotY, boothId) {
      const booth = new THREE.Group();
      booth.position.set(posX, 0, posZ);
      booth.rotation.y = rotY;

      // Respaldo alto acolchado en U con capitoné
      const backRest = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 0.28), M.leatherCognac);
      backRest.position.set(0, 0.70, -0.65);

      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.44, 0.55), M.leatherCognac);
      seat.position.set(0, 0.22, -0.28);

      // Mesa fija rectangular de nogal
      const tableBooth = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.75), M.walnutDark);
      tableBooth.position.set(0, 0.92, 0.35);

      const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.88, 14), M.brassGold);
      tableLeg.position.set(0, 0.45, 0.35);

      booth.add(backRest, seat, tableBooth, tableLeg);

      makeInteractive(booth, {
        id: boothId || 'rest_padded_booth',
        en: 'Padded Leather Booth',
        ipa: "/ˈpæd.ɪd ˈleð.ər buːθ/",
        es: 'Cabina Privada de Cuero Acolchado',
        category: 'Restaurant Seating',
        example: 'Our party enjoyed dinner inside the cozy padded leather booth.'
      });

      return booth;
    }

    const bLeft = buildPaddedBooth(-6.2, 1.5, Math.PI / 2, 'rest_padded_booth');
    const bRight = buildPaddedBooth(6.2, 1.5, -Math.PI / 2, 'rest_padded_booth_right');
    zoneRoot.add(bLeft, bRight);
    registerInteractive(bLeft);
    registerInteractive(bRight);

    // Silla Alta para Bebé (Toddler High Chair)
    function buildHighChair(posX, posZ) {
      const chair = new THREE.Group();
      chair.position.set(posX, 0, posZ);

      // 4 Patas largas de madera de pino inclinadas
      [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.016, 0.88, 8), M.lightPine);
        leg.position.set(lx, 0.44, lz);
        leg.rotation.z = lx > 0 ? -0.1 : 0.1;
        chair.add(leg);
      });

      // Asiento y respaldo elevado
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.38), M.lightPine);
      seat.position.y = 0.88;

      const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.03), M.lightPine);
      back.position.set(0, 1.12, -0.18);

      // Bandeja frontal plástica blanca
      const tray = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.03, 0.26), M.ceramicWhite);
      tray.position.set(0, 1.02, 0.16);

      // Reposapiés
      const footrest = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.02, 0.08), M.lightPine);
      footrest.position.set(0, 0.45, 0.12);

      chair.add(seat, back, tray, footrest);

      makeInteractive(chair, {
        id: 'rest_high_chair',
        en: 'Toddler High Chair',
        ipa: "/ˈtɒd.lər ˈhaɪ ˌtʃeər/",
        es: 'Silla Alta de Madera para Niños Pequeños',
        category: 'Restaurant Equipment',
        example: 'The server provided a clean wooden high chair for the toddler.'
      });

      return chair;
    }

    const highChair = buildHighChair(-4.0, 2.8);
    zoneRoot.add(highChair);
    registerInteractive(highChair);

    // Carrito Móvil de Postres Gourmet (Dessert Cart)
    function buildDessertCart(posX, posZ) {
      const cart = new THREE.Group();
      cart.position.set(posX, 0, posZ);

      // Estructura de latón dorado con 2 niveles
      const frameMat = M.brassGold;
      const topGlass = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.03, 0.65), M.glassClear);
      topGlass.position.y = 0.86;
      const botGlass = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.03, 0.65), M.glassClear);
      botGlass.position.y = 0.28;

      [[-0.52, -0.3], [0.52, -0.3], [-0.52, 0.3], [0.52, 0.3]].forEach(([lx, lz]) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 12), frameMat);
        pillar.position.set(lx, 0.45, lz);
        cart.add(pillar);
      });

      // Manillar de empuje curvado
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.02, 8, 16, Math.PI), frameMat);
      handle.rotation.z = Math.PI / 2;
      handle.position.set(0.55, 0.95, 0);

      // 4 Ruedas de radio grande clásicas
      [[-0.45, -0.32], [0.45, -0.32], [-0.45, 0.32], [0.45, 0.32]].forEach(([wx, wz]) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.025, 16), frameMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.09, wz);
        cart.add(wheel);
      });

      // Postres 3D: Pastel de capas de chocolate + Campana plateada + Bandeja de macarons
      const cloche = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), M.chromeHighPolish);
      cloche.position.set(-0.25, 0.87, 0);

      const cake = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 14), M.walnutDark);
      cake.position.set(0.22, 0.93, 0);

      // Macarons de colores en el estante inferior
      [-0.15, 0, 0.15].forEach((mx, mi) => {
        const macaronMat = mi === 0 ? M.cerealRed : (mi === 1 ? M.bananaYellow : M.cerealGreen);
        const mac = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 12), macaronMat);
        mac.position.set(mx, 0.31, 0);
        cart.add(mac);
      });

      cart.add(topGlass, botGlass, handle, cloche, cake);

      makeInteractive(cart, {
        id: 'rest_dessert_cart',
        en: 'Gourmet Dessert Cart',
        ipa: "/ˈɡʊə.meɪ dɪˈzɜːt kɑːt/",
        es: 'Carrito Móvil de Postres y Repostería Fina',
        category: 'Dessert Presentation',
        example: 'Choose your favorite chocolate gateau from our rolling dessert cart.'
      });

      return cart;
    }

    const dessertCart = buildDessertCart(4.8, 3.2);
    zoneRoot.add(dessertCart);
    registerInteractive(dessertCart);

    // --------------------------------------------------------------------------
    // ZONA 2: COCINA ABIERTA GOURMET, KITCHEN PASS, STOVE, CUTTING BOARD, CHEF
    // --------------------------------------------------------------------------

    // Barra de Pase de Cocina con Lámparas Térmicas (Kitchen Pass)
    function buildKitchenPass(posX, posZ) {
      const pass = new THREE.Group();
      pass.position.set(posX, 0, posZ);

      // Mostrador largo con cubierta de granito negro y repisa inox
      const counterBase = new THREE.Mesh(new THREE.BoxGeometry(6.4, 1.05, 0.95), M.castIronBlack);
      counterBase.position.y = 0.525;

      const graniteTop = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.06, 1.05), M.walnutDark);
      graniteTop.position.y = 1.08;

      // Repisa superior suspendida de acero inoxidable
      const upperShelf = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.04, 0.45), M.stainlessSteel);
      upperShelf.position.set(0, 1.75, 0);

      // 3 Lámparas térmicas infrarrojas colgantes
      [-1.8, 0, 1.8].forEach(lx => {
        const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 8), M.brassGold);
        hanger.position.set(lx, 1.95, 0);
        const lampCone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.22, 16), M.copperPolished);
        lampCone.position.set(lx, 1.70, 0);
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), M.heatLampAmber);
        bulb.position.set(lx, 1.62, 0);

        const heatLight = new THREE.PointLight(0xff6600, 1.4, 3.5);
        heatLight.castShadow = false;
        heatLight.position.set(lx, 1.5, 0);

        pass.add(hanger, lampCone, bulb, heatLight);
      });

      // Bandejas ovaladas de mesero (Oval Service Trays)
      const tray1 = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.015, 14), M.stainlessSteel);
      tray1.scale.set(1.4, 1, 0.9);
      tray1.position.set(-2.2, 1.12, 0);

      const tray2 = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.015, 14), M.stainlessSteel);
      tray2.scale.set(1.4, 1, 0.9);
      tray2.position.set(-2.2, 1.14, 0);

      // Terminal POS inalámbrica de cobro con tarjeta
      const posDock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.16), M.castIronBlack);
      posDock.position.set(2.4, 1.13, 0);
      const posTerminal = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.03, 0.18), M.castIronBlack);
      posTerminal.rotation.x = -0.25;
      posTerminal.position.set(2.4, 1.16, 0.02);
      const posScreen = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, 0.08), M.ledStripWhite);
      posScreen.rotation.x = -0.25;
      posScreen.position.set(2.4, 1.17, 0.04);

      pass.add(counterBase, graniteTop, upperShelf, tray1, tray2, posDock, posTerminal, posScreen);

      makeInteractive(pass, {
        id: 'rest_kitchen_pass',
        en: 'Kitchen Pass Counter',
        ipa: "/ˈkɪtʃ.ɪn pɑːs ˈkaʊn.tər/",
        es: 'Mostrador de Pase de Cocina con Lámparas Térmicas y Terminal POS',
        category: 'Kitchen Pass',
        example: 'Waiters pick up hot garnished dishes directly from the heated kitchen pass.'
      });

      return pass;
    }

    const kitchenPass = buildKitchenPass(0, -3.8);
    zoneRoot.add(kitchenPass);
    registerInteractive(kitchenPass);

    // Estufa Industrial a Gas de 6 Quemadores (Commercial Gas Stove)
    function buildGourmetStove(posX, posZ) {
      const stove = new THREE.Group();
      stove.position.set(posX, 0, posZ);

      // Cuerpo macizo de acero inoxidable con 2 hornos inferiores
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.95, 1.1), M.stainlessSteel);
      body.position.y = 0.475;

      const backsplash = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.65, 0.08), M.stainlessSteel);
      backsplash.position.set(0, 1.25, -0.51);

      // Campana extractora cromada industrial suspendida arriba
      const rangeHood = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.55, 1.2), M.stainlessSteel);
      rangeHood.position.set(0, 3.2, 0);
      const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.6, 16), M.chromeHighPolish);
      duct.position.set(0, 4.2, 0);
      stove.add(rangeHood, duct);

      // 6 Quemadores industriales con llamas azules y naranjas vivas
      const burnerCoords = [
        [-0.7, -0.25], [0, -0.25], [0.7, -0.25],
        [-0.7, 0.25], [0, 0.25], [0.7, 0.25]
      ];

      burnerCoords.forEach(([bx, bz], bIdx) => {
        // Parrilla de hierro fundido
        const grate = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.38), M.castIronBlack);
        grate.position.set(bx, 0.965, bz);

        // Anillo de fuego de gas (Llama azul exterior + naranja interior)
        const blueFlame = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 8, 16), M.gasFlameBlue);
        blueFlame.rotation.x = Math.PI / 2;
        blueFlame.position.set(bx, 0.975, bz);

        const innerFlame = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), M.gasFlameOrange);
        innerFlame.position.set(bx, 0.985, bz);

        stove.add(grate, blueFlame, innerFlame);
      });

      // Sartén de cobre para saltear con vieiras (Frying Pan) en el quemador izquierdo
      const pan = new THREE.Group();
      const panBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.06, 20), M.copperPolished);
      panBody.position.y = 0.03;
      const panHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, 0.28, 8), M.castIronBlack);
      panHandle.rotation.z = Math.PI / 2;
      panHandle.position.set(0.26, 0.05, 0);
      pan.add(panBody, panHandle);
      pan.position.set(-0.7, 0.98, -0.25);

      // Olla de caldo grande de acero inox (Stockpot) en el quemador derecho
      const stockpot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.35, 20), M.stainlessSteel);
      stockpot.position.set(0.7, 1.15, -0.25);

      stove.add(body, backsplash, pan, stockpot);

      makeInteractive(stove, {
        id: 'rest_gas_stove',
        en: 'Commercial Gas Stove & Sauté Pan',
        ipa: "/kəˈmɜː.ʃəl ɡæs stəʊv/",
        es: 'Estufa Industrial de 6 Quemadores a Gas con Sartenes y Campana',
        category: 'Gourmet Kitchen',
        example: 'Blue gas flames roar beneath heavy copper sauté pans on the commercial range.'
      });

      return stove;
    }

    const stove = buildGourmetStove(-1.8, -5.8);
    zoneRoot.add(stove);
    registerInteractive(stove);

    // Tabla de Picar de Madera Noble e Ingredientes (Cutting Board & Prep Table)
    function buildPrepStation(posX, posZ) {
      const prep = new THREE.Group();
      prep.position.set(posX, 0, posZ);

      // Mesa de trabajo de acero inoxidable
      const prepTable = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.95, 1.0), M.stainlessSteel);
      prepTable.position.y = 0.475;

      // Gruesa tabla de picar de nogal / carnicero
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.42), M.walnutDark);
      board.position.set(0, 0.98, 0);

      // Cuchillo de chef de acero al carbono
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.005, 0.28), M.stainlessSteel);
      blade.position.set(-0.18, 1.015, 0);
      const knifeHandle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.015, 0.12), M.castIronBlack);
      knifeHandle.position.set(-0.18, 1.015, 0.20);

      // Ingredientes picados: Romero fresco, cebolla morada picada y ajo
      const herbSprig = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14, 8), M.lettuceGreen);
      herbSprig.rotation.z = Math.PI / 2;
      herbSprig.position.set(0.08, 1.02, -0.06);

      const onion = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.06), M.velvetBurgundy);
      onion.position.set(0.08, 1.02, 0.06);

      prep.add(prepTable, board, blade, knifeHandle, herbSprig, onion);

      makeInteractive(prep, {
        id: 'rest_cutting_board',
        en: 'Hardwood Cutting Board & Chef Knife',
        ipa: "/ˈhɑːd.wʊd ˈkʌt.ɪŋ bɔːd/",
        es: 'Tabla de Picar de Madera Noble con Cuchillo de Chef e Ingredientes',
        category: 'Food Preparation',
        example: 'Chopped rosemary and diced shallots rest on the thick hardwood cutting board.'
      });

      return prep;
    }

    const prepStation = buildPrepStation(1.8, -5.8);
    zoneRoot.add(prepStation);
    registerInteractive(prepStation);

    // Figura del Chef Ejecutivo (Chef Hat & White Apron)
    function buildExecutiveChef(posX, posZ) {
      const chef = new THREE.Group();
      chef.position.set(posX, 0, posZ);

      // Piernas con pantalón negro de cocina
      const legs = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.85, 0.25), M.castIronBlack);
      legs.position.y = 0.425;

      // Chaqueta blanca de doble botonadura
      const jacket = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.72, 0.32), M.ceramicWhite);
      jacket.position.y = 1.15;

      // Delantal blanco de pechera (Apron)
      const apron = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.95, 0.03), M.clothWhite);
      apron.position.set(0, 0.95, 0.17);

      // Brazos en posición de servicio
      const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.14), M.ceramicWhite);
      leftArm.position.set(-0.30, 1.15, 0.08);
      leftArm.rotation.x = -0.3;

      const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.14), M.ceramicWhite);
      rightArm.position.set(0.30, 1.15, 0.08);
      rightArm.rotation.x = -0.3;

      // Cabeza
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), M.lightPine);
      head.position.y = 1.62;

      // Gorro alto blanco plisado de Chef (Toque Blanche / Chef Hat)
      const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 20), M.ceramicWhite);
      hatBand.position.y = 1.76;
      const hatPuff = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.35, 20), M.ceramicWhite);
      hatPuff.position.y = 1.95;

      chef.add(legs, jacket, apron, leftArm, rightArm, head, hatBand, hatPuff);

      makeInteractive(chef, {
        id: 'rest_executive_chef',
        en: 'Executive Head Chef',
        ipa: "/ɪɡˈzek.jə.tɪv hed ʃef/",
        es: 'Chef Ejecutivo con Filipina, Delantal y Gorro Alto de Chef',
        category: 'Culinary Team',
        example: 'The executive head chef in a pleated white hat inspects every plate at the pass.'
      });

      return chef;
    }

    const chefFigure = buildExecutiveChef(0, -4.8);
    zoneRoot.add(chefFigure);
    registerInteractive(chefFigure);

    return root;
  }

  // ============================================================================
  // RECONSTRUCCIÓN 2: SUPERMARKET (MODERN AISLES, PRODUCE & CHECKOUT)
  // ============================================================================
  function buildSupermarketScene(targetGroup, options) {
    const THREE = getThree();
    if (!THREE) return null;

    const root = targetGroup || new THREE.Group();
    root.name = 'SupermarketArchitecturalMasterGroup';

    // Limpieza de objetos anteriores
    const existing = root.getObjectByName('Supermarket_ZoneRoot');
    if (existing) root.remove(existing);

    const zoneRoot = new THREE.Group();
    zoneRoot.name = 'Supermarket_ZoneRoot';
    root.add(zoneRoot);

    const M = createMaterialPalette(THREE);

    // --------------------------------------------------------------------------
    // ARQUITECTURA BASE: PISO TERRAZZO COMERCIAL, PAREDES SLATE Y LUCES LINEALES
    // --------------------------------------------------------------------------
    const floorGeo = new THREE.BoxGeometry(20, 0.24, 18);
    const terrazzoTex = createTerrazzoTexture(THREE);
    const floorMat = terrazzoTex
      ? new THREE.MeshStandardMaterial({ map: terrazzoTex, roughness: 0.28, metalness: 0.1 })
      : new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.28 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.12, -0.5);
    floor.receiveShadow = true;
    zoneRoot.add(floor);

    // Pared trasera y laterales estilo retail moderno
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(20, 5.0, 0.3), wallMat);
    backWall.position.set(0, 2.5, -9.0);
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.0, 18), wallMat);
    leftWall.position.set(-10, 2.5, -0.5);
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.0, 18), wallMat);
    rightWall.position.set(10, 2.5, -0.5);
    zoneRoot.add(backWall, leftWall, rightWall);

    // Luminarias lineales LED en el techo
    [-4, 0, 4].forEach(lx => {
      const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 14), M.stainlessSteel);
      fixture.position.set(lx, 4.4, -0.5);
      const tube = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 13.8), M.ledStripWhite);
      tube.position.set(lx, 4.35, -0.5);
      const light = new THREE.PointLight(0xffffff, 1.6, 12);
      light.castShadow = false;
      light.position.set(lx, 4.1, -0.5);
      zoneRoot.add(fixture, tube, light);
    });

    // --------------------------------------------------------------------------
    // 1. TRES GÓNDOLAS CENTRALES DE DOBLE CARA REPLETS DE PRODUCTOS
    // --------------------------------------------------------------------------
    function buildGondolaUnit(posX, posZ, aisleNumber, aisleCategory, productType) {
      const gondola = new THREE.Group();
      gondola.position.set(posX, 0, posZ);

      // Marco metálico central y 4 estantes a cada lado
      const gondolaLength = 6.2;
      const gondolaHeight = 2.4;
      const shelfDepth = 0.55;

      const centralWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, gondolaHeight, gondolaLength), M.stainlessSteel);
      centralWall.position.y = gondolaHeight / 2;
      gondola.add(centralWall);

      // Letrero colgante de pasillo (Aisle Sign)
      const signTex = createAisleSignTexture(THREE, `Aisle ${aisleNumber} - ${aisleCategory}`);
      const signMat = signTex
        ? new THREE.MeshStandardMaterial({ map: signTex })
        : M.cerealBlue;
      const aisleSign = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 1.8), signMat);
      aisleSign.position.set(0, gondolaHeight + 0.45, 0);
      gondola.add(aisleSign);

      const PMF = global.ProceduralMaterialFactory;
      const cerealLabel1 = PMF ? PMF.createProductLabelMaterial({ key: 'cereal_corn_flakes', bg: '#fef08a', band: '#dc2626', title: 'CORN FLAKES', subtitle: 'CRUNCHY GOLDEN CEREAL', badge: '500g', sideNutrition: true }) : M.cerealYellow;
      const cerealLabel2 = PMF ? PMF.createProductLabelMaterial({ key: 'cereal_choco_rings', bg: '#fed7aa', band: '#78350f', title: 'CHOCO RINGS', subtitle: 'COCOA OAT HOOPS', badge: '450g', sideNutrition: true }) : M.cerealRed;
      const cerealLabel3 = PMF ? PMF.createProductLabelMaterial({ key: 'cereal_honey_oats', bg: '#dcfce7', band: '#15803d', title: 'HONEY OATS', subtitle: 'WHOLE GRAIN CLUSTERS', badge: '520g', sideNutrition: true }) : M.cerealGreen;
      const mayoLabel = PMF ? PMF.createProductLabelMaterial({ key: 'mayo_jar_label', bg: '#fef9c3', band: '#1d4ed8', title: 'MAYONNAISE', subtitle: 'REAL EGGS & OIL', badge: '400g' }) : M.cerealBlue;
      const tunaLabel = PMF ? PMF.createProductLabelMaterial({ key: 'tuna_can_label', bg: '#e0f2fe', band: '#0369a1', title: 'TUNA STEAK', subtitle: 'IN OLIVE OIL', badge: '140g', metalness: 0.35 }) : M.canLabel1;

      const shelfLevels = [0.45, 0.95, 1.45, 1.95];
      shelfLevels.forEach((sy, levelIdx) => {
        // Estante lado A (+x) y lado B (-x)
        [-1, 1].forEach(side => {
          const shelfMesh = new THREE.Mesh(new THREE.BoxGeometry(shelfDepth, 0.04, gondolaLength), M.stainlessSteel);
          shelfMesh.position.set(side * (shelfDepth / 2 + 0.06), sy, 0);
          gondola.add(shelfMesh);

          const itemsCount = 12;
          const spacing = (gondolaLength - 0.4) / itemsCount;
          for (let i = 0; i < itemsCount; i++) {
            const iz = -gondolaLength / 2 + 0.3 + i * spacing;
            const ix = side * (shelfDepth / 2 + 0.06);

            if (productType === 'cereals') {
              const cMats = [cerealLabel1, cerealLabel2, cerealLabel3];
              const cMat = cMats[(i + levelIdx) % cMats.length];
              const box = typeof global.createBeveledBoxExtrude === 'function'
                ? global.createBeveledBoxExtrude(0.18, 0.34, 0.12, cMat, 0.015, 0.012)
                : new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.34, 0.12), cMat);
              box.position.set(ix, sy + 0.17, iz);
              gondola.add(box);
            } else if (productType === 'canned') {
              const lMat = i % 2 === 0 ? tunaLabel : mayoLabel;
              const can = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.16, 16), lMat);
              can.position.set(ix, sy + 0.08, iz);
              gondola.add(can);
            } else {
              const bottle = typeof global.createLatheProfileMesh === 'function'
                ? global.createLatheProfileMesh([[0.0, 0.0], [0.05, 0.0], [0.055, 0.14], [0.022, 0.21], [0.024, 0.25], [0.0, 0.25]], M.copperPolished, 14)
                : new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.26, 12), M.copperPolished);
              bottle.position.set(ix, sy + 0.02, iz);
              gondola.add(bottle);
            }
          }
        });
      });

      makeInteractive(gondola, {
        id: aisleNumber === 1 ? 'market_cereal_aisle' : (aisleNumber === 2 ? 'market_canned_goods' : 'market_beverage_aisle'),
        en: `Aisle ${aisleNumber}: ${aisleCategory}`,
        ipa: `/aɪl ${aisleNumber}/`,
        es: `Pasillo ${aisleNumber}: Góndola Completa de ${aisleCategory}`,
        category: 'Supermarket Aisles',
        example: `Browse the stacked boxes and cans in the ${aisleCategory} double-sided gondola.`
      });

      return gondola;
    }

    const g1 = buildGondolaUnit(-3.4, -1.0, 1, 'Cereals & Breakfast', 'cereals');
    const g2 = buildGondolaUnit(-0.8, -1.0, 2, 'Canned Goods & Pantry', 'canned');
    const g3 = buildGondolaUnit(1.8, -1.0, 3, 'Beverages & Oils', 'bottles');
    zoneRoot.add(g1, g2, g3);
    registerInteractive(g1);
    registerInteractive(g2);
    registerInteractive(g3);

    // --------------------------------------------------------------------------
    // 2. SECCIÓN DE FRUTAS Y VERDURAS (PRODUCE SECTION & SCALE)
    // --------------------------------------------------------------------------
    function buildProduceStand(posX, posZ) {
      const stand = new THREE.Group();
      stand.position.set(posX, 0, posZ);

      // 3 Mostradores de madera inclinados para frutas
      const standWidth = 4.2;
      const baseWood = new THREE.Mesh(new THREE.BoxGeometry(standWidth, 0.75, 1.4), M.lightPine);
      baseWood.position.y = 0.375;

      const displayTray = new THREE.Mesh(new THREE.BoxGeometry(standWidth, 0.15, 1.3), M.oakMedium);
      displayTray.rotation.x = 0.25;
      displayTray.position.set(0, 0.95, 0);
      stand.add(baseWood, displayTray);

      // Llenar compartimentos con manzanas rojas, plátanos, naranjas y lechugas
      // Compartimento 1: Manzanas Rojas
      for (let mx = -1.6; mx <= -0.7; mx += 0.22) {
        for (let mz = -0.3; mz <= 0.3; mz += 0.22) {
          const apple = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), M.appleRed);
          apple.position.set(mx, 1.05 + (mz * -0.25), mz);
          stand.add(apple);
        }
      }

      // Compartimento 2: Plátanos Curvos Amarillos
      for (let bx = -0.4; bx <= 0.4; bx += 0.25) {
        const banana = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.28, 10), M.bananaYellow);
        banana.rotation.z = Math.PI / 3;
        banana.rotation.y = bx * 2;
        banana.position.set(bx, 1.05, 0);
        stand.add(banana);
      }

      // Compartimento 3: Naranjas
      for (let ox = 0.6; ox <= 1.2; ox += 0.24) {
        for (let oz = -0.3; oz <= 0.3; oz += 0.24) {
          const orange = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), M.orangeFruit);
          orange.position.set(ox, 1.05 + (oz * -0.25), oz);
          stand.add(orange);
        }
      }

      // Compartimento 4: Cabezas de Lechuga Verde
      for (let lx = 1.4; lx <= 1.8; lx += 0.26) {
        for (let lz = -0.2; lz <= 0.2; lz += 0.26) {
          const lettuce = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), M.lettuceGreen);
          lettuce.position.set(lx, 1.08 + (lz * -0.25), lz);
          stand.add(lettuce);
        }
      }

      // Balanza colgante clásica (Produce Scale)
      const scaleHanger = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.75, 8), M.brassGold);
      scaleHanger.position.set(0, 2.25, 0.2);

      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 20), M.ceramicWhite);
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0, 1.85, 0.2);

      const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.04, 20), M.stainlessSteel);
      pan.position.set(0, 1.35, 0.2);

      stand.add(scaleHanger, dial, pan);

      makeInteractive(stand, {
        id: 'market_fresh_produce',
        en: 'Fresh Produce Section & Hanging Scale',
        ipa: "/freʃ ˈprɒd.juːs ˈsek.ʃən/",
        es: 'Sección de Frutas y Verduras Frescas con Balanza de Peso',
        category: 'Fresh Produce',
        example: 'Weigh organic apples and fresh crisp lettuce on the hanging produce scale.'
      });

      return stand;
    }

    const produceStand = buildProduceStand(-6.8, -1.2);
    zoneRoot.add(produceStand);
    registerInteractive(produceStand);

    // --------------------------------------------------------------------------
    // 3. REFRIGERADORES DE PARED CON PUERTAS DE CRISTAL E ILUMINACIÓN LED
    // --------------------------------------------------------------------------
    function buildRefrigeratedWall(posX, posZ) {
      const fridge = new THREE.Group();
      fridge.position.set(posX, 0, posZ);

      const width = 8.8;
      const height = 3.2;
      const depth = 1.1;

      // Gabinete modular de refrigeración
      const cabinet = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), M.stainlessSteel);
      cabinet.position.y = height / 2;

      // Interior oscuro con 4 repisas
      const interior = new THREE.Mesh(new THREE.BoxGeometry(width - 0.4, height - 0.4, depth - 0.2), M.castIronBlack);
      interior.position.set(0, height / 2, 0.1);
      fridge.add(cabinet, interior);

      // Puertas de cristal transparente con manijas cromadas y tiras LED
      const doorCount = 6;
      const doorW = (width - 0.4) / doorCount;
      for (let d = 0; d < doorCount; d++) {
        const dx = -width / 2 + 0.2 + (d + 0.5) * doorW;

        const glassDoor = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.04, height - 0.45, 0.03), M.glassClear);
        glassDoor.position.set(dx, height / 2, depth / 2 + 0.02);

        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.55, 10), M.chromeHighPolish);
        handle.position.set(dx + doorW * 0.35, height / 2, depth / 2 + 0.06);

        // Tiras LED blancas internas para iluminar los lácteos
        const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.08, 0.03, 0.03), M.ledStripWhite);
        ledStrip.position.set(dx, height - 0.35, depth / 2 - 0.1);

        fridge.add(glassDoor, handle, ledStrip);

        // Galones de leche (Dairy Milk Jugs) y alimentos congelados en estantes
        [-0.8, 0, 0.8].forEach(sy => {
          const milkJug = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.28, 0.16), M.ceramicWhite);
          milkJug.position.set(dx, height / 2 + sy, 0.1);
          const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 10), d % 2 === 0 ? M.cerealBlue : M.cerealRed);
          cap.position.set(dx, height / 2 + sy + 0.15, 0.1);
          fridge.add(milkJug, cap);
        });
      }

      makeInteractive(fridge, {
        id: 'market_dairy_section',
        en: 'Refrigerated Dairy & Frozen Foods Aisle',
        ipa: "/rɪˈfrɪdʒ.ər.eɪ.tɪd ˈdeə.ri/",
        es: 'Refrigeradores con Puertas de Cristal e Iluminación LED',
        category: 'Dairy & Frozen Foods',
        example: 'Cold milk jugs and frozen meals are kept fresh inside the LED illuminated glass fridges.'
      });

      return fridge;
    }

    const fridgeWall = buildRefrigeratedWall(0, -7.8);
    zoneRoot.add(fridgeWall);
    registerInteractive(fridgeWall);

    // --------------------------------------------------------------------------
    // 4. ZONA DE CAJAS (CHECKOUT LANE & CARTS)
    // --------------------------------------------------------------------------
    function buildCheckoutLane(posX, posZ) {
      const checkout = new THREE.Group();
      checkout.position.set(posX, 0, posZ);

      // Mostrador principal de caja
      const counterBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.95, 3.4), M.castIronBlack);
      counterBase.position.y = 0.475;

      // Cinta transportadora negra de avance de víveres (Conveyor Belt)
      const belt = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.03, 2.4), M.castIronBlack);
      belt.position.set(-0.25, 0.965, 0.2);

      // Barandillas de acero inoxidable
      const railL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 2.4), M.stainlessSteel);
      railL.position.set(-0.64, 1.02, 0.2);
      const railR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 2.4), M.stainlessSteel);
      railR.position.set(0.14, 1.02, 0.2);

      // Caja registradora táctil (Cash Register)
      const registerBase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.42), M.stainlessSteel);
      registerBase.position.set(0.45, 1.02, -1.0);
      const screenArm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.25, 10), M.castIronBlack);
      screenArm.position.set(0.45, 1.18, -1.0);
      const touchScreen = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.24, 0.03), M.ledStripWhite);
      touchScreen.rotation.x = -0.3;
      touchScreen.position.set(0.45, 1.32, -0.95);

      // Escáner láser de código de barras (Barcode Scanner)
      const scannerBed = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.32), M.glassClear);
      scannerBed.position.set(-0.25, 0.97, -1.0);
      const laserBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.28, 6), M.laserRed);
      laserBeam.rotation.z = Math.PI / 2;
      laserBeam.position.set(-0.25, 0.985, -1.0);

      // Terminal de pago con tarjeta (Card Terminal)
      const pinPad = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.18), M.castIronBlack);
      pinPad.rotation.x = -0.35;
      pinPad.position.set(0.55, 1.15, -0.4);

      checkout.add(counterBase, belt, railL, railR, registerBase, screenArm, touchScreen, scannerBed, laserBeam, pinPad);

      makeInteractive(checkout, {
        id: 'market_checkout',
        en: 'Checkout Counter & Conveyor Belt',
        ipa: "/ˈtʃek.aʊt ˈkaʊn.tər/",
        es: 'Línea de Caja con Cinta Transportadora, Caja Registradora y Lector Láser',
        category: 'Checkout Area',
        example: 'Place your grocery items on the motorized conveyor belt at the checkout register.'
      });

      return checkout;
    }

    const checkoutLane = buildCheckoutLane(5.2, 2.0);
    zoneRoot.add(checkoutLane);
    registerInteractive(checkoutLane);

    // Carrito de Supermercado Metálico con Ruedas y Manubrio (Shopping Cart)
    function buildMetallicShoppingCart(posX, posZ, rotY) {
      const cart = new THREE.Group();
      cart.position.set(posX, 0, posZ);
      cart.rotation.y = rotY || 0;

      // Chasis inferior tubular de acero
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.05, 0.82), M.stainlessSteel);
      chassis.position.y = 0.22;

      // 4 Ruedas giratorias
      [[-0.26, -0.36], [0.26, -0.36], [-0.26, 0.36], [0.26, 0.36]].forEach(([wx, wz]) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.025, 12), M.castIronBlack);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.05, wz);
        cart.add(wheel);
      });

      // Canasta de rejilla metálica
      const basketBottom = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.02, 0.72), M.chromeHighPolish);
      basketBottom.position.y = 0.48;

      const basketWallF = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.42, 0.02), M.chromeHighPolish);
      basketWallF.position.set(0, 0.69, -0.35);
      const basketWallB = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.48, 0.02), M.chromeHighPolish);
      basketWallB.position.set(0, 0.72, 0.35);

      const basketWallL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.45, 0.72), M.chromeHighPolish);
      basketWallL.position.set(-0.26, 0.705, 0);
      const basketWallR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.45, 0.72), M.chromeHighPolish);
      basketWallR.position.set(0.26, 0.705, 0);

      // Manubrio de empuje con protector rojo
      const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.58, 14), M.clothRed);
      handleBar.rotation.z = Math.PI / 2;
      handleBar.position.set(0, 0.98, 0.44);

      // Asiento abatible infantil rojo
      const babySeat = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.24, 0.02), M.clothRed);
      babySeat.position.set(0, 0.78, 0.28);

      // Víveres dentro del carrito (Pan baguette y caja de cereal)
      const baguette = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.54, 12), M.lightPine);
      baguette.rotation.x = Math.PI / 4;
      baguette.position.set(0.12, 0.72, -0.05);

      const cartCereal = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, 0.16), M.bananaYellow);
      cartCereal.position.set(-0.12, 0.62, 0.05);

      cart.add(chassis, basketBottom, basketWallF, basketWallB, basketWallL, basketWallR, handleBar, babySeat, baguette, cartCereal);

      makeInteractive(cart, {
        id: 'market_shopping_cart',
        en: 'Shopping Cart',
        ipa: "/ˈʃɒp.ɪŋ kɑːt/",
        es: 'Carrito de Supermercado con Rejilla y Ruedas',
        category: 'Shopping Equipment',
        example: 'Push the four-wheeled metal shopping cart through the grocery aisles.'
      });

      return cart;
    }

    const cart1 = buildMetallicShoppingCart(2.2, 3.8, Math.PI / 6);
    const cart2 = buildMetallicShoppingCart(1.2, 4.4, Math.PI / 8);
    zoneRoot.add(cart1, cart2);
    registerInteractive(cart1);
    registerInteractive(cart2);

    return root;
  }

  // ============================================================================
  // PRESERVE MODULAR BUILDERS ON MasterENG3DBuilders (FOR COMPATIBILITY)
  // ============================================================================
  B['market_shopping_cart'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return new (THREE ? THREE.Group : Object)();
    const M = createMaterialPalette(THREE);
    const g = new THREE.Group();
    const basket = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.75), M.chromeHighPolish);
    basket.position.set(0, 0.62, 0);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.52, 8), M.clothRed);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0, 0.88, -0.42);
    g.add(basket, handle);
    return g;
  };

  B['market_cash_register'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.35), M.castIronBlack);
    body.position.y = 0.23;
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.03), M.ledStripWhite);
    screen.rotation.x = -0.35;
    screen.position.set(0, 0.38, 0.08);
    g.add(body, screen);
    return g;
  };

  B['market_barcode_scanner'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.12), M.castIronBlack);
    body.position.y = 0.09;
    const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.04, 0.15, 8), M.laserRed);
    laser.rotation.x = Math.PI / 2;
    laser.position.set(0, 0.12, 0.08);
    g.add(body, laser);
    return g;
  };
  B['market_scanner_gun'] = B['market_barcode_scanner'];

  B['market_fresh_produce'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const g = new THREE.Group();
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.25, 0.45), M.lightPine);
    crate.position.y = 0.125;
    const apple = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), M.appleRed);
    apple.position.set(-0.15, 0.28, 0);
    const orange = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), M.orangeFruit);
    orange.position.set(0.15, 0.28, 0);
    g.add(crate, apple, orange);
    return g;
  };
  B['market_produce_crate'] = B['market_fresh_produce'];

  B['market_dairy_section'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const g = new THREE.Group();
    const caseFrame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.4, 0.55), M.stainlessSteel);
    caseFrame.position.y = 0.7;
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.78, 1.3, 0.03), M.glassClear);
    door.position.set(0, 0.7, 0.28);
    g.add(caseFrame, door);
    return g;
  };
  B['market_dairy_fridge'] = B['market_dairy_section'];

  B['market_frozen_aisle'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const g = new THREE.Group();
    const tub = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.85, 0.85), M.stainlessSteel);
    tub.position.y = 0.425;
    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.03, 0.80), M.glassClear);
    lid.position.set(0, 0.86, 0);
    g.add(tub, lid);
    return g;
  };
  B['market_cooler_display'] = B['market_frozen_aisle'];

  B['market_scale'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.35), M.castIronBlack);
    base.position.y = 0.07;
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.02, 16), M.stainlessSteel);
    pan.position.y = 0.15;
    g.add(base, pan);
    return g;
  };

  B['market_checkout'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const g = new THREE.Group();
    const counter = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.95, 0.75), M.castIronBlack);
    counter.position.y = 0.475;
    const belt = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.02, 0.55), M.castIronBlack);
    belt.position.set(-0.2, 0.96, 0);
    g.add(counter, belt);
    return g;
  };
  B['market_conveyor_belt'] = B['market_checkout'];

  B['market_beverage_aisle'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const g = new THREE.Group();
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.4, 0.45), M.stainlessSteel);
    shelf.position.y = 0.7;
    g.add(shelf);
    return g;
  };
  B['market_cleaning_aisle'] = B['market_beverage_aisle'];
  B['market_cereal_aisle'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const specs = [
      { key: 'cereal_cf', bg: '#fef08a', band: '#dc2626', title: 'CORN FLAKES', sub: 'GOLDEN CRISPY FLAKES', x: -0.22 },
      { key: 'cereal_cr', bg: '#fed7aa', band: '#78350f', title: 'CHOCO RINGS', sub: 'CRUNCHY COCOA OATS', x: 0 },
      { key: 'cereal_ho', bg: '#dcfce7', band: '#15803d', title: 'HONEY OATS', sub: 'ORGANIC OAT CLUSTERS', x: 0.22 }
    ];
    specs.forEach(sp => {
      const mat = PMF ? PMF.createProductLabelMaterial({
        key: sp.key, bg: sp.bg, band: sp.band, title: sp.title, subtitle: sp.sub, badge: '500g', sideNutrition: true
      }) : M.cerealYellow;
      const box = typeof global.createBeveledBoxExtrude === 'function'
        ? global.createBeveledBoxExtrude(0.18, 0.36, 0.09, mat, 0.015, 0.012)
        : new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.36, 0.09), mat);
      box.position.set(sp.x, 0.18, 0);
      g.add(box);
    });
    return g;
  };

  B['market_mayonnaise'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.32, metalness: 0.04 });
    const blueCapMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.28, metalness: 0.15 });
    const jarBody = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([
          [0.0, 0.0], [0.095, 0.0], [0.115, 0.05], [0.115, 0.22], [0.082, 0.27], [0.085, 0.30], [0.0, 0.30]
        ], creamMat, 24)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.28, 20), creamMat);
    const screwCap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.048, 22), blueCapMat);
    screwCap.position.y = 0.31;
    const labelMat = PMF ? PMF.createProductLabelMaterial({
      key: 'mayonnaise_jar_hd',
      bg: '#fef08a',
      band: '#1e40af',
      title: 'MAYONNAISE',
      subtitle: 'CLASSIC CREAMY RECIPE',
      badge: 'REAL EGGS'
    }) : blueCapMat;
    const wrapLabel = new THREE.Mesh(new THREE.CylinderGeometry(0.117, 0.117, 0.14, 24, 1, true), labelMat);
    wrapLabel.position.y = 0.14;
    g.add(jarBody, screwCap, wrapLabel);
    return g;
  };

  B['market_table_cream'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const labelMat = PMF ? PMF.createProductLabelMaterial({
      key: 'table_cream_hd',
      bg: '#ffffff',
      band: '#dc2626',
      title: 'TABLE CREAM',
      subtitle: 'HEAVY WHIPPING CREAM',
      badge: '250ml',
      sideNutrition: true
    }) : new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pack = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.18, 0.26, 0.12, labelMat, 0.015, 0.012)
      : new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.26, 0.12), labelMat);
    pack.position.y = 0.13;
    const redCap = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.03, 0.025, 16), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 }));
    redCap.position.set(0.04, 0.27, 0);
    g.add(pack, redCap);
    return g;
  };

  B['market_milk_carton'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const labelMat = PMF ? PMF.createProductLabelMaterial({
      key: 'milk_carton_hd',
      bg: '#f0f9ff',
      band: '#0284c7',
      title: 'FRESH MILK',
      subtitle: 'GRADE A PASTEURIZED',
      badge: '1 LITER',
      sideNutrition: true
    }) : new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
    const body = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.18, 0.32, 0.18, labelMat, 0.014, 0.01)
      : new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, 0.18), labelMat);
    body.position.y = 0.16;
    const gableRoof = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.09, 4), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 }));
    gableRoof.position.y = 0.365;
    gableRoof.rotation.y = Math.PI / 4;
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.025, 14), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    spout.position.set(0.04, 0.37, 0.04);
    spout.rotation.x = 0.45;
    g.add(body, gableRoof, spout);
    return g;
  };

  B['market_egg_carton'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const g = new THREE.Group();
    const pulpMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.85 });
    const eggMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.35 });
    const tray = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.32, 0.06, 0.22, pulpMat, 0.012, 0.01)
      : new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.22), pulpMat);
    tray.position.y = 0.03;
    const openLid = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.32, 0.035, 0.21, pulpMat, 0.01, 0.008)
      : new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.035, 0.21), pulpMat);
    openLid.position.set(0, 0.11, -0.14);
    openLid.rotation.x = -0.85;
    [-0.10, 0, 0.10].forEach(ex => {
      [-0.05, 0.05].forEach(ez => {
        const egg = new THREE.Mesh(new THREE.SphereGeometry(0.036, 14, 14), eggMat);
        egg.scale.set(1, 1.32, 1);
        egg.position.set(ex, 0.075, ez);
        g.add(egg);
      });
    });
    g.add(tray, openLid);
    return g;
  };

  B['market_canned_goods'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const tunaMat = PMF ? PMF.createProductLabelMaterial({
      key: 'canned_tuna_hd',
      bg: '#e0f2fe',
      band: '#0369a1',
      title: 'CANNED TUNA',
      subtitle: 'SOLID WHITE ALBACORE',
      badge: '160g',
      metalness: 0.4
    }) : M.canLabel1;
    [-0.14, 0, 0.14].forEach((x, idx) => {
      const canGroup = new THREE.Group();
      const h = idx === 1 ? 0.11 : 0.09;
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, h, 20), tunaMat);
      body.position.y = h / 2;
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.01, 20), M.canMetal);
      lid.position.y = h + 0.005;
      const pullRing = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.0035, 8, 16), M.chromeHighPolish);
      pullRing.rotation.x = Math.PI / 2;
      pullRing.position.set(0.012, h + 0.012, 0);
      canGroup.add(body, lid, pullRing);
      canGroup.position.set(x, 0, 0);
      g.add(canGroup);
    });
    return g;
  };

  B['market_sliced_bread'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const g = new THREE.Group();
    const crustMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.65 });
    const crumbMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.72 });
    for (let s = -4; s <= 4; s++) {
      const slice = typeof global.createBeveledBoxExtrude === 'function'
        ? global.createBeveledBoxExtrude(0.14, 0.15, 0.024, s === -4 || s === 4 ? crustMat : crumbMat, 0.008, 0.006)
        : new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.15, 0.024), crumbMat);
      slice.position.set(0, 0.08, s * 0.028);
      g.add(slice);
    }
    const bagWrap = new THREE.Mesh(new THREE.BoxGeometry(0.165, 0.17, 0.30), M.glassClear);
    bagWrap.position.set(0, 0.085, 0);
    const tie = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.006, 8, 14), M.cerealRed);
    tie.position.set(0, 0.085, 0.165);
    g.add(bagWrap, tie);
    return g;
  };

  B['market_ketchup'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const redMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.25, metalness: 0.08 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const body = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([
          [0.0, 0.0], [0.065, 0.0], [0.072, 0.15], [0.032, 0.23], [0.026, 0.31], [0.0, 0.31]
        ], redMat, 22)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.30, 18), redMat);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.036, 16), capMat);
    cap.position.y = 0.325;
    const labelMat = PMF ? PMF.createProductLabelMaterial({
      key: 'ketchup_bottle_hd',
      bg: '#ffffff',
      band: '#dc2626',
      title: 'KETCHUP',
      subtitle: 'SUN RIPENED TOMATO',
      badge: '570g'
    }) : capMat;
    const label = new THREE.Mesh(new THREE.CylinderGeometry(0.073, 0.073, 0.11, 20, 1, true), labelMat);
    label.position.y = 0.09;
    g.add(body, cap, label);
    return g;
  };

  B['market_mustard'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3, metalness: 0.05 });
    const body = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([
          [0.0, 0.0], [0.062, 0.0], [0.068, 0.14], [0.035, 0.20], [0.012, 0.26], [0.0, 0.26]
        ], yellowMat, 20)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.24, 16), yellowMat);
    const labelMat = PMF ? PMF.createProductLabelMaterial({
      key: 'mustard_bottle_hd',
      bg: '#fef9c3',
      band: '#ca8a04',
      title: 'MUSTARD',
      subtitle: 'CLASSIC TANGY YELLOW',
      badge: '400g'
    }) : yellowMat;
    const label = new THREE.Mesh(new THREE.CylinderGeometry(0.069, 0.069, 0.095, 18, 1, true), labelMat);
    label.position.y = 0.085;
    g.add(body, label);
    return g;
  };

  B['market_cooking_oil'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const oilMat = new THREE.MeshPhysicalMaterial({ color: 0xfacc15, roughness: 0.15, transmission: 0.65, transparent: true, opacity: 0.85 });
    const body = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([
          [0.0, 0.0], [0.075, 0.0], [0.082, 0.18], [0.036, 0.26], [0.028, 0.32], [0.0, 0.32]
        ], oilMat, 22)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.32, 18), oilMat);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.032, 16), new THREE.MeshStandardMaterial({ color: 0x16a34a }));
    cap.position.y = 0.335;
    if (typeof global.createTubeHandleMesh === 'function') {
      const handle = global.createTubeHandleMesh([[0.055, 0.24, 0], [0.105, 0.22, 0], [0.105, 0.13, 0], [0.072, 0.11, 0]], 0.011, oilMat);
      g.add(handle);
    }
    const labelMat = PMF ? PMF.createProductLabelMaterial({
      key: 'cooking_oil_hd',
      bg: '#fefce8',
      band: '#15803d',
      title: 'COOKING OIL',
      subtitle: '100% PURE SUNFLOWER',
      badge: '1.5L'
    }) : oilMat;
    const label = new THREE.Mesh(new THREE.CylinderGeometry(0.083, 0.083, 0.11, 20, 1, true), labelMat);
    label.position.y = 0.095;
    g.add(body, cap, label);
    return g;
  };

  B['market_strawberry_jam'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const jamMat = new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.22, metalness: 0.08 });
    const lidMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35, metalness: 0.3 });
    const jar = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([
          [0.0, 0.0], [0.078, 0.0], [0.088, 0.04], [0.088, 0.17], [0.072, 0.20], [0.076, 0.22], [0.0, 0.22]
        ], jamMat, 22)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.22, 18), jamMat);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.028, 20), lidMat);
    lid.position.y = 0.228;
    const labelMat = PMF ? PMF.createProductLabelMaterial({
      key: 'strawberry_jam_hd',
      bg: '#fff1f2',
      band: '#be123c',
      title: 'STRAWBERRY JAM',
      subtitle: 'ORCHARD FRUIT PRESERVE',
      badge: '350g'
    }) : lidMat;
    const label = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.10, 20, 1, true), labelMat);
    label.position.y = 0.10;
    g.add(jar, lid, label);
    return g;
  };

  B['market_peanut_butter'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const pbMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.42 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.32 });
    const jar = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([
          [0.0, 0.0], [0.082, 0.0], [0.092, 0.04], [0.092, 0.19], [0.078, 0.22], [0.08, 0.24], [0.0, 0.24]
        ], pbMat, 22)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.24, 18), pbMat);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.084, 0.084, 0.036, 20), capMat);
    cap.position.y = 0.248;
    const labelMat = PMF ? PMF.createProductLabelMaterial({
      key: 'peanut_butter_hd',
      bg: '#fef3c7',
      band: '#b91c1c',
      title: 'PEANUT BUTTER',
      subtitle: 'CREAMY ROASTED PEANUTS',
      badge: '500g'
    }) : capMat;
    const label = new THREE.Mesh(new THREE.CylinderGeometry(0.094, 0.094, 0.11, 20, 1, true), labelMat);
    label.position.y = 0.11;
    g.add(jar, cap, label);
    return g;
  };

  B['market_bag_of_rice'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const labelMat = PMF ? PMF.createProductLabelMaterial({
      key: 'jasmine_rice_hd',
      bg: '#fffbeb',
      band: '#047857',
      title: 'JASMINE RICE',
      subtitle: 'PREMIUM LONG GRAIN',
      badge: '2 KG',
      sideNutrition: true
    }) : new THREE.MeshStandardMaterial({ color: 0xfef3c7 });
    const bag = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.24, 0.34, 0.12, labelMat, 0.025, 0.02)
      : new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, 0.12), labelMat);
    bag.position.y = 0.17;
    g.add(bag);
    return g;
  };

  B['market_soda_can'] = function(item, scen, P) {
    const THREE = getThree();
    if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const colaMat = PMF ? PMF.createProductLabelMaterial({
      key: 'cola_can_hd',
      bg: '#dc2626',
      band: '#991b1b',
      title: 'SPARK COLA',
      subtitle: 'ICE COLD REFRESHMENT',
      badge: '355ml',
      metalness: 0.65,
      roughness: 0.22
    }) : M.cerealRed;
    [-0.09, 0.09].forEach(cx => {
      const can = typeof global.createLatheProfileMesh === 'function'
        ? global.createLatheProfileMesh([
            [0.0, 0.0], [0.048, 0.0], [0.056, 0.02], [0.056, 0.16], [0.046, 0.185], [0.0, 0.185]
          ], colaMat, 20)
        : new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.18, 18), colaMat);
      can.position.x = cx;
      const topRim = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.008, 18), M.chromeHighPolish);
      topRim.position.set(cx, 0.186, 0);
      const tab = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.0025, 6, 12), M.chromeHighPolish);
      tab.rotation.x = Math.PI / 2;
      tab.position.set(cx, 0.192, 0);
      g.add(can, topRim, tab);
    });
    return g;
  };

  // Additional Supermarket builders
  B['market_bakery'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const rack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.4), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 }));
    rack.position.y = 0.55;
    g.add(rack);
    return g;
  };
  B['market_bread_rack'] = B['market_bakery'];
  B['market_shopping_basket'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const b = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.44, 0.24, 0.32, redMat, 0.015, 0.012)
      : new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.24, 0.32), redMat);
    b.position.y = 0.12;
    if (typeof global.createTubeHandleMesh === 'function') {
      const h1 = global.createTubeHandleMesh([[-0.18, 0.24, 0.05], [0, 0.38, 0.05], [0.18, 0.24, 0.05]], 0.012, darkMat);
      const h2 = global.createTubeHandleMesh([[-0.18, 0.24, -0.05], [0, 0.38, -0.05], [0.18, 0.24, -0.05]], 0.012, darkMat);
      g.add(h1, h2);
    }
    g.add(b);
    return g;
  };
  B['market_price_tag'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.01), new THREE.MeshStandardMaterial({ color: 0xfacc15 })));
    return g;
  };
  B['market_shelf_tag'] = B['market_price_tag'];
  B['market_receipt'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.01, 0.24), new THREE.MeshStandardMaterial({ color: 0xffffff })));
    return g;
  };
  B['market_deli_counter'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const counter = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.65), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7 }));
    counter.position.y = 0.45;
    g.add(counter);
    return g;
  };
  B['market_meat_counter'] = B['market_deli_counter'];
  B['market_reusable_bag'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.36, 0.16), new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 }));
    bag.position.y = 0.18;
    g.add(bag);
    return g;
  };
  B['market_card_terminal'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const body = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.14, 0.05, 0.22, new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35 }), 0.008, 0.006)
      : new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.22), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    body.position.y = 0.025;
    const scrMat = PMF ? PMF.createDigitalScreenMaterial({
      key: 'pos_card_reader', bg: '#064e3b', accent: '#34d399', title: 'TAP OR INSERT', lines: ['TOTAL: $42.80', 'NFC CONTACTLESS', '[1] [2] [3] [OK]']
    }) : new THREE.MeshStandardMaterial({ color: 0x10b981 });
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.14), scrMat);
    scr.rotation.x = -Math.PI / 2;
    scr.position.set(0, 0.052, 0);
    g.add(body, scr);
    return g;
  };
  B['market_trolley_bay'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.6, 8), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 }));
    rail.position.set(0, 0.4, 0);
    rail.rotation.x = Math.PI / 2;
    g.add(rail);
    return g;
  };
  B['market_aisle_sign'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.28, 0.03), new THREE.MeshStandardMaterial({ color: 0x1d4ed8 }));
    sign.position.y = 2.2;
    g.add(sign);
    return g;
  };
  B['market_bulk_dispenser'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 12), new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transmission: 0.9, transparent: true, opacity: 0.5 }));
    t.position.y = 0.4;
    g.add(t);
    return g;
  };
  B['market_plastic_divider'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.025, 0.025), new THREE.MeshStandardMaterial({ color: 0x1e293b })));
    return g;
  };
  B['market_seafood_ice'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const tub = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 0.75), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 }));
    tub.position.y = 0.3;
    g.add(tub);
    return g;
  };

  // Additional Restaurant builders
  B['rest_menu'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const coverMat = new THREE.MeshStandardMaterial({ color: 0x450a0a, roughness: 0.42 });
    const leftCover = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.16, 0.012, 0.26, coverMat, 0.004, 0.003)
      : new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.26), coverMat);
    leftCover.position.set(-0.082, 0.012, 0);
    leftCover.rotation.z = 0.08;
    const rightCover = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.16, 0.012, 0.26, coverMat, 0.004, 0.003)
      : new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.26), coverMat);
    rightCover.position.set(0.082, 0.012, 0);
    rightCover.rotation.z = -0.08;
    const pageMat = PMF ? PMF.createProductLabelMaterial({
      key: 'gourmet_menu_page', bg: '#fffbeb', band: '#b45309', title: 'LA CARTE', subtitle: 'STEAK • PASTA • WINE', badge: 'CHEF'
    }) : new THREE.MeshStandardMaterial({ color: 0xfef3c7 });
    const page = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.23), pageMat);
    page.rotation.x = -Math.PI / 2;
    page.position.set(0.08, 0.022, 0);
    g.add(leftCover, rightCover, page);
    return g;
  };
  B['rest_wine_list_leather'] = B['rest_menu'];
  B['rest_main_course'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const porcelainMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.14, metalness: 0.05 });
    const pl = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([[0.0, 0.0], [0.12, 0.0], [0.16, 0.018], [0.21, 0.028], [0.20, 0.032], [0.12, 0.012], [0.0, 0.012]], porcelainMat, 26)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.14, 0.025, 22), porcelainMat);
    const steakMat = new THREE.MeshStandardMaterial({ color: 0x5c240e, roughness: 0.48 });
    const steak = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.13, 0.038, 0.09, steakMat, 0.012, 0.01)
      : new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.038, 0.09), steakMat);
    steak.position.set(-0.03, 0.03, 0.01);
    const mash = new THREE.Mesh(new THREE.SphereGeometry(0.044, 14, 12), new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 }));
    mash.scale.set(1, 0.62, 1);
    mash.position.set(0.06, 0.028, -0.03);
    const asparagus = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.12, 10), new THREE.MeshStandardMaterial({ color: 0x15803d }));
    asparagus.rotation.z = Math.PI / 2;
    asparagus.position.set(0.02, 0.034, 0.06);
    g.add(pl, steak, mash, asparagus);
    return g;
  };
  B['rest_appetizer'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const porcelainMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 });
    const bowl = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([[0.0, 0.0], [0.08, 0.0], [0.14, 0.055], [0.15, 0.065], [0.13, 0.065], [0.07, 0.015], [0.0, 0.015]], porcelainMat, 24)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.09, 0.05, 18), porcelainMat);
    const soup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.11, 0.015, 20), new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.25 }));
    soup.position.y = 0.042;
    g.add(bowl, soup);
    return g;
  };
  B['rest_fork'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const matS = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.94, roughness: 0.14 });
    const handle = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.018, 0.008, 0.14, matS, 0.003, 0.002)
      : new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.008, 0.14), matS);
    handle.position.set(0, 0.01, 0.04);
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.006, 0.02), matS);
    neck.position.set(0, 0.01, -0.035);
    [-0.012, -0.004, 0.004, 0.012].forEach(tx => {
      const tine = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.005, 0.06), matS);
      tine.position.set(tx, 0.01, -0.072);
      g.add(tine);
    });
    g.add(handle, neck);
    return g;
  };
  B['rest_spoon'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const matS = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.94, roughness: 0.14 });
    const handle = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.018, 0.008, 0.14, matS, 0.003, 0.002)
      : new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.008, 0.14), matS);
    handle.position.set(0, 0.01, 0.04);
    const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.024, 14, 10, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5), matS);
    bowl.scale.set(0.85, 0.45, 1.35);
    bowl.position.set(0, 0.014, -0.055);
    g.add(handle, bowl);
    return g;
  };
  B['rest_cutlery'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const matS = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.94, roughness: 0.14 });
    const matDark = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4 });
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.004, 0.13), matS);
    blade.position.set(0, 0.01, -0.045);
    const handle = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.022, 0.014, 0.11, matDark, 0.004, 0.003)
      : new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.014, 0.11), matDark);
    handle.position.set(0, 0.01, 0.065);
    g.add(blade, handle);
    return g;
  };
  B['rest_steak_knife'] = B['rest_cutlery'];
  B['rest_napkin'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const clothMat = new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.72 });
    const fold = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.16, 4), clothMat);
    fold.position.y = 0.08;
    fold.rotation.y = Math.PI / 4;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.007, 10, 18), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 }));
    ring.position.set(0, 0.03, 0.06);
    g.add(fold, ring);
    return g;
  };
  B['rest_beverage'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transmission: 0.9, transparent: true, opacity: 0.48, roughness: 0.08 });
    const wineMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.18 });
    const goblet = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([
          [0.0, 0.0], [0.048, 0.0], [0.008, 0.015], [0.007, 0.11], [0.055, 0.14], [0.062, 0.19], [0.052, 0.24]
        ], glassMat, 24)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.22, 16), glassMat);
    const wine = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([[0.0, 0.12], [0.048, 0.14], [0.056, 0.18], [0.0, 0.18]], wineMat, 20)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.035, 0.06, 16), wineMat);
    g.add(goblet, wine);
    return g;
  };
  B['rest_olive_oil'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const PMF = global.ProceduralMaterialFactory;
    const g = new THREE.Group();
    const greenGlass = new THREE.MeshPhysicalMaterial({ color: 0x14532d, roughness: 0.15, transmission: 0.55, transparent: true, opacity: 0.85 });
    const bottle = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([
          [0.0, 0.0], [0.048, 0.0], [0.052, 0.16], [0.022, 0.22], [0.018, 0.29], [0.0, 0.29]
        ], greenGlass, 22)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.28, 16), greenGlass);
    const pourer = typeof global.createTubeHandleMesh === 'function'
      ? global.createTubeHandleMesh([[0, 0.29, 0], [0, 0.32, 0.005], [0, 0.335, 0.025]], 0.005, new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 }))
      : new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.04, 8), greenGlass);
    const labelMat = PMF ? PMF.createProductLabelMaterial({
      key: 'olive_oil_cruet_hd', bg: '#fefce8', band: '#15803d', title: 'OLIVE OIL', subtitle: 'EXTRA VIRGIN COLD PRESS', badge: '500ml'
    }) : greenGlass;
    const label = new THREE.Mesh(new THREE.CylinderGeometry(0.053, 0.053, 0.09, 18, 1, true), labelMat);
    label.position.y = 0.09;
    g.add(bottle, pourer, label);
    return g;
  };
  B['rest_espresso_machine'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const M = createMaterialPalette(THREE);
    const g = new THREE.Group();
    const chassis = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.68, 0.48, 0.44, M.stainlessSteel, 0.02, 0.015)
      : new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.48, 0.44), M.stainlessSteel);
    chassis.position.y = 0.24;
    const redSidePanels = typeof global.createBeveledBoxExtrude === 'function'
      ? global.createBeveledBoxExtrude(0.70, 0.36, 0.36, M.cerealRed, 0.015, 0.012)
      : new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.36, 0.36), M.cerealRed);
    redSidePanels.position.set(0, 0.24, -0.02);
    const dripTray = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.04, 0.18), M.castIronBlack);
    dripTray.position.set(0, 0.04, 0.16);
    [-0.16, 0.16].forEach(gx => {
      const groupHead = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.07, 16), M.chromeHighPolish);
      groupHead.position.set(gx, 0.28, 0.16);
      if (typeof global.createTubeHandleMesh === 'function') {
        const pfHandle = global.createTubeHandleMesh([[gx, 0.26, 0.18], [gx + 0.04, 0.24, 0.28], [gx + 0.07, 0.23, 0.34]], 0.012, M.castIronBlack);
        g.add(pfHandle);
      }
      g.add(groupHead);
    });
    const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16), M.brassGold);
    gauge.rotation.x = Math.PI / 2;
    gauge.position.set(0, 0.38, 0.225);
    g.add(chassis, redSidePanels, dripTray, gauge);
    return g;
  };
  B['rest_reserved_sign'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.03), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 })));
    return g;
  };
  B['rest_toothpick_holder'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const h = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.025, 0.06, 10), new THREE.MeshStandardMaterial({ color: 0x9a6234 }));
    h.position.y = 0.03;
    g.add(h);
    return g;
  };
  B['rest_pos_terminal'] = B['market_card_terminal'];
  B['rest_service_tray'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.015, 22), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.15 }));
    t.position.y = 0.01;
    const cloche = typeof global.createLatheProfileMesh === 'function'
      ? global.createLatheProfileMesh([[0.0, 0.14], [0.025, 0.14], [0.01, 0.12], [0.14, 0.10], [0.18, 0.015]], new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.1 }), 24)
      : new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 }));
    g.add(t, cloche);
    return g;
  };
  B['rest_soup_tureen'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.6), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    b.position.y = 0.09;
    g.add(b);
    return g;
  };
  B['rest_bread_plate'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.01, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    p.position.y = 0.005;
    g.add(p);
    return g;
  };
  B['rest_sauce_boat'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.08), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85 }));
    b.position.y = 0.03;
    g.add(b);
    return g;
  };
  B['rest_espresso_demitasse'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.045, 10), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    c.position.y = 0.025;
    g.add(c);
    return g;
  };
  B['rest_condiment_caddy'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.12), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 }));
    c.position.y = 0.035;
    g.add(c);
    return g;
  };
  B['rest_coat_check_tag'] = function(item, scen, P) {
    const THREE = getThree(); if (!THREE) return null;
    const g = new THREE.Group();
    const t = new THREE.Mesh(new THREE.CircleGeometry(0.035, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 }));
    t.rotation.x = -Math.PI / 2;
    g.add(t);
    return g;
  };

  // Register Public API
  global.MasterENG3DBuilders.buildRestaurantScene = buildRestaurantScene;
  global.MasterENG3DBuilders.buildSupermarketScene = buildSupermarketScene;

  // ============================================================================
  // BULLETPROOF ENGINE HOOK & SCENARIO INTERCEPTOR
  // ============================================================================
  function cleanConflictingFallbackObjects(dynamicRoot) {
    if (!dynamicRoot || !dynamicRoot.children) return;

    // Remove or hide the default purple floor, center runner, and the 4 bare stone pillars
    const toRemove = [];
    dynamicRoot.children.forEach(child => {
      // Don't remove our custom roots
      if (child.name === 'Restaurant_ZoneRoot' || child.name === 'Supermarket_ZoneRoot' ||
          child.name === 'RestaurantArchitecturalMasterGroup' || child.name === 'SupermarketArchitecturalMasterGroup') {
        return;
      }

      // Check if it's the default box floor or walls or runner
      if (child.isMesh && child.geometry) {
        const geo = child.geometry;
        if (geo.type === 'BoxGeometry') {
          // Default room floor: 18 x 0.24 x 15, runner: 3.2 x 0.02 x 13.5, walls: 18 x 4.6 x 0.28
          toRemove.push(child);
        } else if (geo.type === 'CylinderGeometry') {
          // Default pillars: CylinderGeometry(0.28, 0.32, 4.5) and caps
          toRemove.push(child);
        }
      }
    });

    toRemove.forEach(obj => {
      try {
        dynamicRoot.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
      } catch (_) {}
    });
  }

  function applyCustomRetailCulinaryWorld(scenarioKey) {
    const key = String(scenarioKey || '').toLowerCase().trim();
    if (key !== 'restaurant' && key !== 'supermarket') return;

    const THREE = getThree();
    if (!THREE) return;

    const w3d = global.World3D || (typeof window !== 'undefined' ? window.World3D : null);
    let dynamicRoot = null;
    let activeScene = (w3d && w3d.scene) || null;

    // Locate ScenarioDynamicRoot through interactiveObjects or active scene
    const interactive = (w3d && w3d.interactiveObjects) || (typeof window !== 'undefined' && window.interactiveObjects);
    if (Array.isArray(interactive) && interactive.length > 0) {
      for (let i = 0; i < interactive.length; i++) {
        const candidate = interactive[i];
        if (candidate && candidate.parent) {
          if (candidate.parent.name === 'ScenarioDynamicRoot' || candidate.parent.isGroup) {
            dynamicRoot = candidate.parent;
            if (dynamicRoot.parent && (dynamicRoot.parent.isScene || dynamicRoot.parent.type === 'Scene')) {
              activeScene = dynamicRoot.parent;
            }
            break;
          }
        }
      }
    }

    if (!dynamicRoot && activeScene) {
      dynamicRoot = activeScene.getObjectByName('ScenarioDynamicRoot') || activeScene;
    }

    if (!dynamicRoot) return;

    // 1. Clean default purple floor, runner and 4 bare pillars
    cleanConflictingFallbackObjects(dynamicRoot);

    // 2. Inject rich architectural environments
    if (key === 'restaurant') {
      buildRestaurantScene(dynamicRoot);
    } else if (key === 'supermarket') {
      buildSupermarketScene(dynamicRoot);
    }

    if (w3d && typeof w3d.normalizeSceneInteractiveMetadata === 'function') {
      w3d.normalizeSceneInteractiveMetadata(activeScene || dynamicRoot, key);
    }

    // 3. Trigger render update if available
    if (w3d && w3d.renderer && w3d.camera && activeScene) {
      try {
        w3d.renderer.render(activeScene, w3d.camera);
      } catch (_) {}
    }
  }

  function setupWorld3DInterceptor() {
    return true;
  }

  console.log('[MasterENG3D] Retail & Culinary High-Fidelity 3D Builders active (Restaurant & Supermarket).');

})(typeof window !== 'undefined' ? window : globalThis);

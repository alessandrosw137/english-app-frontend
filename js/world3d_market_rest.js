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
    // Pure Blender GLB Mode: Scenarios are loaded exclusively from assets/models/worlds/restaurant.glb
    return targetGroup;
  }

  // ============================================================================
  // RECONSTRUCCIÓN 2: SUPERMARKET (MODERN AISLES, PRODUCE & CHECKOUT)
  // ============================================================================
  function buildSupermarketScene(targetGroup, options) {
    // Pure Blender GLB Mode: Scenarios are loaded exclusively from assets/models/worlds/supermarket.glb
    return targetGroup;
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

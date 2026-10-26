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

  function getMat(P, name, fallbackColor, roughness, metalness) {
    if (P && P[name]) return P[name];
    if (typeof THREE === 'undefined') return null;
    const PhysicalMat = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
    return new PhysicalMat({
      color: fallbackColor !== undefined ? fallbackColor : 0x94a3b8,
      roughness: roughness !== undefined ? roughness : 0.35,
      metalness: metalness !== undefined ? metalness : 0.15
    });
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
        child.castShadow = true;
        child.receiveShadow = true;
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
  }

  // ============================================================================
  // 4. MODELADO DETALLADO: HOTEL LOBBY & 5-STAR SUITE
  // ============================================================================

  function buildHotelScene(targetGroup, options = {}) {
    if (!targetGroup || typeof THREE === 'undefined') return null;

    let root = targetGroup;
    if (targetGroup.getObjectByName && targetGroup.getObjectByName('ScenarioDynamicRoot')) {
      root = targetGroup.getObjectByName('ScenarioDynamicRoot');
    }

    const oldContainer = root.getObjectByName('MasterENG_HotelArchitecture');
    if (oldContainer) {
      root.remove(oldContainer);
    }

    if (global.World3D && Array.isArray(global.World3D.interactiveObjects)) {
      global.World3D.interactiveObjects = global.World3D.interactiveObjects.filter(
        (obj) => !(obj.userData && obj.userData.id && obj.userData.id.startsWith('hotel_'))
      );
    }

    const sceneContainer = new THREE.Group();
    sceneContainer.name = 'MasterENG_HotelArchitecture';
    root.add(sceneContainer);

    const M = createSharedPBRMaterials(THREE);
    const scenObjects = (global.WORLD_TOUR_SCENARIOS && global.WORLD_TOUR_SCENARIOS.hotel && global.WORLD_TOUR_SCENARIOS.hotel.objects) || [];
    const getMeta = (id) => scenObjects.find((o) => o.id === id) || { id };

    // A. Suelo de mármol y pasillo central
    const floorGeo = new THREE.BoxGeometry(22, 0.3, 18);
    const floorMesh = new THREE.Mesh(floorGeo, M.marbleBlack);
    floorMesh.position.set(0, -0.15, -0.5);
    floorMesh.receiveShadow = true;
    sceneContainer.add(floorMesh);

    const runnerGeo = new THREE.BoxGeometry(3.6, 0.02, 13.5);
    const runnerMesh = new THREE.Mesh(runnerGeo, M.velvetBurgundy);
    runnerMesh.position.set(0, 0.01, -0.5);
    runnerMesh.receiveShadow = true;
    sceneContainer.add(runnerMesh);

    [-1.85, 1.85].forEach((rx) => {
      const trimGeo = new THREE.BoxGeometry(0.08, 0.024, 13.5);
      const trimMesh = new THREE.Mesh(trimGeo, M.metalBrass);
      trimMesh.position.set(rx, 0.012, -0.5);
      sceneContainer.add(trimMesh);
    });

    const wallColor = 0x0f172a;
    const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.45, metalness: 0.1 });

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(22, 5.2, 0.35), wallMat);
    backWall.position.set(0, 2.6, -9.2);
    backWall.receiveShadow = true;

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.2, 18), wallMat);
    leftWall.position.set(-11.0, 2.6, -0.5);
    leftWall.receiveShadow = true;

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.2, 18), wallMat);
    rightWall.position.set(11.0, 2.6, -0.5);
    rightWall.receiveShadow = true;

    const corniceBack = new THREE.Mesh(new THREE.BoxGeometry(22, 0.18, 0.22), M.metalBrass);
    corniceBack.position.set(0, 5.1, -9.05);

    sceneContainer.add(backWall, leftWall, rightWall, corniceBack);

    // Columnas clásicas
    [
      [-7.5, -6.5],
      [7.5, -6.5],
      [-7.5, 3.5],
      [7.5, 3.5]
    ].forEach(([cx, cz]) => {
      const colGroup = new THREE.Group();
      const colShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 4.8, 24), M.marbleWhite);
      colShaft.position.y = 2.4;
      colShaft.castShadow = true;
      colShaft.receiveShadow = true;

      const colBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 0.9), M.metalBrass);
      colBase.position.y = 0.125;

      const colCap = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.28, 0.95), M.metalBrass);
      colCap.position.y = 4.85;

      colGroup.add(colShaft, colBase, colCap);
      colGroup.position.set(cx, 0, cz);
      sceneContainer.add(colGroup);
    });

    // B. Reception Desk & Equipment
    const deskMeta = getMeta('hotel_receptionist_desk');
    const deskGroup = new THREE.Group();
    deskGroup.name = 'HotelReceptionDesk';

    const deskBody = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.5, 1.15, 32, 1, false, Math.PI * 0.15, Math.PI * 0.7), M.woodWalnut);
    deskBody.position.set(0, 0.575, -4.2);
    deskBody.rotation.y = Math.PI;

    const deskTop = new THREE.Mesh(new THREE.CylinderGeometry(2.55, 2.55, 0.09, 32, 1, false, Math.PI * 0.12, Math.PI * 0.76), M.marbleBlack);
    deskTop.position.set(0, 1.18, -4.2);
    deskTop.rotation.y = Math.PI;

    const signTex = createReceptionSignTexture('RECEPTION');
    const signMat = new THREE.MeshBasicMaterial({ map: signTex || null, transparent: true });
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.35), signMat);
    signMesh.position.set(0, 0.65, -1.78);

    deskGroup.add(deskBody, deskTop, signMesh);

    [-0.85, 0.85].forEach((imacX) => {
      const imac = new THREE.Group();
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.26, 0.16), M.metalChrome);
      stand.position.set(0, 0.13, 0);

      const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.36, 0.024), M.metalChrome);
      monitor.position.set(0, 0.35, 0);

      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.51, 0.32), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
      screen.position.set(0, 0.35, 0.014);

      const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.012, 0.12), M.metalChrome);
      keyboard.position.set(0, 0.01, 0.16);

      imac.add(stand, monitor, screen, keyboard);
      imac.position.set(imacX, 1.22, -3.1);
      deskGroup.add(imac);
    });

    deskGroup.position.set(0, 0, 0);
    attachInteractiveData(deskGroup, deskMeta, 'Hotel & Reception');
    sceneContainer.add(deskGroup);

    // Bellhop Bell
    const bellMeta = getMeta('hotel_bellhop_bell');
    const bellGroup = new THREE.Group();
    bellGroup.name = 'BellhopBell';

    const bellBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.02, 20), M.metalBrass);
    bellBase.position.y = 0.01;
    const bellDome = new THREE.Mesh(new THREE.SphereGeometry(0.065, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), M.metalBrass);
    bellDome.position.y = 0.03;
    const bellPin = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.035, 10), M.metalChrome);
    bellPin.position.y = 0.085;
    const bellKnob = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 12), M.metalBrass);
    bellKnob.position.y = 0.105;

    bellGroup.add(bellBase, bellDome, bellPin, bellKnob);
    bellGroup.position.set(0.65, 1.22, -3.1);
    attachInteractiveData(bellGroup, bellMeta, 'Hotel & Reception');
    sceneContainer.add(bellGroup);

    // Keycard
    const keycardMeta = getMeta('hotel_room_keycard');
    const keycardGroup = new THREE.Group();
    keycardGroup.name = 'RoomKeycard';

    const cardHolder = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.18), M.woodWalnut);
    cardHolder.position.y = 0.015;
    const card1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.005, 0.075), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.4, roughness: 0.2 }));
    card1.position.set(-0.04, 0.035, 0.02);
    card1.rotation.y = 0.15;
    const card2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.005, 0.075), M.metalBrass);
    card2.position.set(0.04, 0.036, -0.01);
    card2.rotation.y = -0.2;

    keycardGroup.add(cardHolder, card1, card2);
    keycardGroup.position.set(-0.65, 1.22, -3.1);
    attachInteractiveData(keycardGroup, keycardMeta, 'Hotel & Reception');
    sceneContainer.add(keycardGroup);

    // Passport
    const passportMeta = getMeta('hotel_passport');
    const passGroup = new THREE.Group();
    passGroup.name = 'PassportCredentials';

    const passBook = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.012, 0.15), new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 }));
    passBook.position.y = 0.006;
    const passEmblem = new THREE.Mesh(new THREE.CircleGeometry(0.02, 16), M.metalBrass);
    passEmblem.rotation.x = -Math.PI / 2;
    passEmblem.position.set(0, 0.013, -0.015);

    passGroup.add(passBook, passEmblem);
    passGroup.position.set(0.05, 1.22, -3.05);
    attachInteractiveData(passGroup, passportMeta, 'Hotel & Reception');
    sceneContainer.add(passGroup);

    // C. Luggage Cart & Rolling Suitcases
    const cartMeta = getMeta('hotel_luggage_cart');
    const cartGroup = new THREE.Group();
    cartGroup.name = 'BrassLuggageCart';

    const platform = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.12, 0.95), M.velvetBurgundy);
    platform.position.y = 0.22;
    const platTrim = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.08, 1.02), M.metalBrass);
    platTrim.position.y = 0.22;

    [
      [-0.68, -0.38],
      [0.68, -0.38],
      [-0.68, 0.38],
      [0.68, 0.38]
    ].forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 16), M.wroughtIron);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, 0.09, wz);
      cartGroup.add(wheel);
    });

    const tubeRadius = 0.025;
    [
      [-0.72, -0.38],
      [-0.72, 0.38],
      [0.72, -0.38],
      [0.72, 0.38]
    ].forEach(([px, pz]) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(tubeRadius, tubeRadius, 1.45, 14), M.metalBrass);
      post.position.set(px, 0.95, pz);
      cartGroup.add(post);
    });

    [-0.72, 0.72].forEach((ax) => {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(0.38, tubeRadius, 12, 24, Math.PI), M.metalBrass);
      arch.position.set(ax, 1.68, 0);
      arch.rotation.y = Math.PI / 2;
      cartGroup.add(arch);
    });

    const topBar = new THREE.Mesh(new THREE.CylinderGeometry(tubeRadius, tubeRadius, 1.45, 14), M.metalBrass);
    topBar.rotation.z = Math.PI / 2;
    topBar.position.set(0, 2.06, 0);

    cartGroup.add(platform, platTrim, topBar);
    cartGroup.position.set(3.8, 0, 1.2);
    attachInteractiveData(cartGroup, cartMeta, 'Hotel & Reception');
    sceneContainer.add(cartGroup);

    // Suitcases
    const suitMeta = getMeta('hotel_suitcase');
    const suitGroup = new THREE.Group();
    suitGroup.name = 'LuggageSuitcases';

    const suit1 = new THREE.Group();
    const case1Body = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.32, 0.48), M.leatherChesterfield);
    case1Body.position.y = 0.16;

    [-0.2, 0.2].forEach((bx) => {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.33, 0.49), new THREE.MeshStandardMaterial({ color: 0x2b1509 }));
      strap.position.set(bx, 0.16, 0);
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.05, 0.5), M.metalBrass);
      buckle.position.set(bx, 0.31, 0);
      suit1.add(strap, buckle);
    });

    const handle1 = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.014, 10, 16, Math.PI), M.metalBrass);
    handle1.position.set(0, 0.33, 0.24);
    handle1.rotation.x = Math.PI / 2;
    suit1.add(case1Body, handle1);
    suit1.position.set(3.65, 0.3, 1.1);

    const suit2 = new THREE.Group();
    const case2Body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.28, 0.42), new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.25, metalness: 0.4 }));
    case2Body.position.y = 0.14;
    const handleRod = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.03), M.metalChrome);
    handleRod.position.set(0, 0.29, 0);
    suit2.add(case2Body, handleRod);
    suit2.position.set(3.85, 0.62, 1.15);
    suit2.rotation.y = 0.12;

    const suit3 = new THREE.Group();
    const case3Body = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.68, 0.28), M.velvetBurgundy);
    case3Body.position.y = 0.34;
    const handle3 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.04), M.wroughtIron);
    handle3.position.set(0, 0.7, 0);
    suit3.add(case3Body, handle3);
    suit3.position.set(2.5, 0, 2.4);

    suitGroup.add(suit1, suit2, suit3);
    attachInteractiveData(suitGroup, suitMeta, 'Hotel & Reception');
    sceneContainer.add(suitGroup);

    // D. Elevator
    const elevMeta = getMeta('hotel_elevator');
    const elevGroup = new THREE.Group();
    elevGroup.name = 'HotelElevator';

    const archFrame = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.8, 0.25), M.metalBronze);
    archFrame.position.set(0, 1.9, 0);

    const doorL = new THREE.Mesh(new THREE.BoxGeometry(1.25, 3.2, 0.08), M.metalBrass);
    doorL.position.set(-0.64, 1.6, 0.06);

    const doorR = new THREE.Mesh(new THREE.BoxGeometry(1.25, 3.2, 0.08), M.metalBrass);
    doorR.position.set(0.64, 1.6, 0.06);

    const gapReveal = new THREE.Mesh(new THREE.BoxGeometry(0.03, 3.2, 0.1), M.wroughtIron);
    gapReveal.position.set(0, 1.6, 0.06);

    const dispTex = createElevatorDisplayTexture('▲ 12');
    const dispMat = new THREE.MeshBasicMaterial({ map: dispTex || null });
    const dispMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.38), dispMat);
    dispMesh.position.set(0, 3.42, 0.14);

    const callPanel = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.36, 0.04), M.metalBrass);
    callPanel.position.set(1.9, 1.45, 0.1);

    const btnUp = new THREE.Mesh(new THREE.CircleGeometry(0.024, 14), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    btnUp.position.set(1.9, 1.52, 0.125);

    const btnDown = new THREE.Mesh(new THREE.CircleGeometry(0.024, 14), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    btnDown.position.set(1.9, 1.38, 0.125);

    elevGroup.add(archFrame, doorL, doorR, gapReveal, dispMesh, callPanel, btnUp, btnDown);
    elevGroup.position.set(5.5, 0, -8.9);
    attachInteractiveData(elevGroup, elevMeta, 'Hotel & Reception');
    sceneContainer.add(elevGroup);

    // E. Lobby Lounge & Chandelier
    const sofaMeta = getMeta('hotel_lobby_sofa');
    const loungeGroup = new THREE.Group();
    loungeGroup.name = 'LobbyChesterfieldLounge';

    const rugMesh = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.02, 3.8), M.rugPersian);
    rugMesh.position.set(-3.8, 0.015, 1.0);
    rugMesh.receiveShadow = true;
    loungeGroup.add(rugMesh);

    function buildChesterfield() {
      const sofa = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.28, 0.85), M.leatherChesterfield);
      seat.position.set(0, 0.38, 0);

      const back = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.62, 0.28), M.leatherChesterfield);
      back.position.set(0, 0.72, -0.32);

      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 7; c++) {
          const btn = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), new THREE.MeshStandardMaterial({ color: 0x241006 }));
          btn.position.set(-0.85 + c * 0.28, 0.62 + r * 0.2, -0.17);
          sofa.add(btn);
        }
      }

      [-1.12, 1.12].forEach((ax) => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.95, 16), M.leatherChesterfield);
        arm.rotation.x = Math.PI / 2;
        arm.position.set(ax, 0.62, 0.02);

        for (let n = 0; n < 8; n++) {
          const angle = (n * Math.PI) / 7;
          const nail = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8), M.metalBrass);
          nail.position.set(ax + Math.sin(angle) * 0.16, 0.62 + Math.cos(angle) * 0.16, 0.5);
          sofa.add(nail);
        }
        sofa.add(arm);
      });

      [
        [-0.95, -0.32],
        [0.95, -0.32],
        [-0.95, 0.32],
        [0.95, 0.32]
      ].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.025, 0.24, 12), M.woodWalnut);
        leg.position.set(lx, 0.12, lz);
        sofa.add(leg);
      });

      sofa.add(seat, back);
      return sofa;
    }

    const sofa1 = buildChesterfield();
    sofa1.position.set(-3.8, 0, 2.2);
    sofa1.rotation.y = Math.PI;

    const sofa2 = buildChesterfield();
    sofa2.position.set(-3.8, 0, -0.2);

    const coffeeTable = new THREE.Group();
    const glassTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.035, 0.75), M.glassClear);
    glassTop.position.y = 0.42;

    const tableFrame = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.03, 0.77), M.metalBrass);
    tableFrame.position.y = 0.39;

    [
      [-0.65, -0.32],
      [0.65, -0.32],
      [-0.65, 0.32],
      [0.65, 0.32]
    ].forEach(([tx, tz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.016, 0.38, 12), M.metalBrass);
      leg.position.set(tx, 0.19, tz);
      coffeeTable.add(leg);
    });

    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.18, 14), M.glassClear);
    vase.position.y = 0.52;
    const flower = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    flower.position.y = 0.62;
    coffeeTable.add(glassTop, tableFrame, vase, flower);
    coffeeTable.position.set(-3.8, 0, 1.0);

    loungeGroup.add(sofa1, sofa2, coffeeTable);
    attachInteractiveData(loungeGroup, sofaMeta, 'Hotel & Reception');
    sceneContainer.add(loungeGroup);

    // Chandelier
    const chandMeta = getMeta('hotel_chandelier');
    const chandGroup = new THREE.Group();
    chandGroup.name = 'ImperialChandelier';

    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 12), M.metalBrass);
    rod.position.y = 0.55;

    [
      { rad: 0.95, y: 0.0, count: 24 },
      { rad: 0.65, y: -0.25, count: 18 },
      { rad: 0.35, y: -0.5, count: 12 }
    ].forEach((tier) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(tier.rad, 0.018, 10, 32), M.metalBrass);
      ring.position.y = tier.y;
      ring.rotation.x = Math.PI / 2;
      chandGroup.add(ring);

      for (let i = 0; i < tier.count; i++) {
        const angle = (i * Math.PI * 2) / tier.count;
        const prism = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.18, 6), M.glassClear);
        prism.position.set(Math.cos(angle) * tier.rad, tier.y - 0.09, Math.sin(angle) * tier.rad);
        chandGroup.add(prism);
      }
    });

    const chandLight = new THREE.PointLight(0xffedd5, 2.2, 18, 1.2);
    chandLight.position.set(0, -0.3, 0);
    chandGroup.add(rod, chandLight);

    chandGroup.position.set(0, 4.4, -0.5);
    attachInteractiveData(chandGroup, chandMeta, 'Hotel & Reception');
    sceneContainer.add(chandGroup);

    // F. Suite Integrada: Cama, Minibar, Safe Box, Bathrobe, Room Service
    const suiteScreen = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.6, 3.2), M.woodWalnut);
    suiteScreen.position.set(-6.8, 1.8, -0.5);
    sceneContainer.add(suiteScreen);

    // King Bed
    const bedMeta = getMeta('hotel_king_bed');
    const bedGroup = new THREE.Group();
    bedGroup.name = 'KingLuxuryBed';

    const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.8, 0.18), M.woodWalnut);
    headboard.position.set(0, 0.9, -1.25);
    const headPad = new THREE.Mesh(new THREE.BoxGeometry(2.45, 1.55, 0.1), M.velvetNavy);
    headPad.position.set(0, 0.9, -1.18);

    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 2.3), M.woodWalnut);
    bedBase.position.set(0, 0.175, 0);
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.32, 2.2), M.linenWhite);
    mattress.position.set(0, 0.51, 0);

    const duvet = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.18, 1.55), M.linenWhite);
    duvet.position.set(0, 0.65, 0.3);
    const bedRunner = new THREE.Mesh(new THREE.BoxGeometry(2.16, 0.04, 0.45), M.velvetNavy);
    bedRunner.position.set(0, 0.74, 0.82);

    [-0.55, 0.55].forEach((px) => {
      const pBack = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.22, 0.32), M.linenWhite);
      pBack.position.set(px, 0.78, -0.85);
      pBack.rotation.x = 0.25;

      const pFront = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.28), M.linenWhite);
      pFront.position.set(px, 0.76, -0.55);
      pFront.rotation.x = 0.15;

      bedGroup.add(pBack, pFront);
    });

    bedGroup.add(headboard, headPad, bedBase, mattress, duvet, bedRunner);
    bedGroup.position.set(-4.8, 0, 3.5);
    attachInteractiveData(bedGroup, bedMeta, 'Hotel Room');
    sceneContainer.add(bedGroup);

    // Minibar
    const barMeta = getMeta('hotel_minibar');
    const barGroup = new THREE.Group();
    barGroup.name = 'StockedMinibar';

    const barBody = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.95, 0.65), new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.3 }));
    barBody.position.y = 0.475;
    const barDoor = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.88, 0.04), M.glassClear);
    barDoor.position.set(0, 0.475, 0.33);

    [-0.18, 0, 0.18].forEach((bx, bIdx) => {
      const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.22, 12), bIdx === 0 ? M.wineRed : M.glassWine);
      bottle.position.set(bx, 0.42, 0.15);
      barGroup.add(bottle);
    });

    const barLight = new THREE.PointLight(0x38bdf8, 1.2, 2.5);
    barLight.position.set(0, 0.65, 0.1);

    barGroup.add(barBody, barDoor, barLight);
    barGroup.position.set(-5.0, 0, -3.8);
    attachInteractiveData(barGroup, barMeta, 'Hotel Amenities');
    sceneContainer.add(barGroup);

    // Safe Box
    const safeMeta = getMeta('hotel_safe_box');
    const safeGroup = new THREE.Group();
    safeGroup.name = 'InRoomSafeBox';

    const safeBody = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.48), new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.7, roughness: 0.35 }));
    safeBody.position.y = 0.225;
    const safeDoor = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.38, 0.02), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 }));
    safeDoor.position.set(0, 0.225, 0.25);
    const safeKeypad = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.015), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    safeKeypad.position.set(0.1, 0.225, 0.265);
    const safeHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.06, 16), M.metalChrome);
    safeHandle.rotation.x = Math.PI / 2;
    safeHandle.position.set(-0.1, 0.225, 0.27);

    safeGroup.add(safeBody, safeDoor, safeKeypad, safeHandle);
    safeGroup.position.set(-5.2, 0, -1.5);
    attachInteractiveData(safeGroup, safeMeta, 'Hotel & Reception');
    sceneContainer.add(safeGroup);

    // Bathrobe
    const robeMeta = getMeta('hotel_bathrobe');
    const robeGroup = new THREE.Group();
    robeGroup.name = 'PlushCottonBathrobe';

    const hanger = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.02), M.woodOak);
    hanger.position.y = 1.05;
    const robeTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.95, 14), M.terryCloth);
    robeTorso.position.y = 0.52;
    const robeBelt = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.08, 14), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
    robeBelt.position.y = 0.52;

    robeGroup.add(hanger, robeTorso, robeBelt);
    robeGroup.position.set(-4.0, 1.1, 3.2);
    attachInteractiveData(robeGroup, robeMeta, 'Hotel Amenities');
    sceneContainer.add(robeGroup);

    // Room Service Cart
    const cartSvcMeta = getMeta('hotel_room_service_tray');
    const cartSvcGroup = new THREE.Group();
    cartSvcGroup.name = 'RoomServiceCart';

    const trolleyTop = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.58), M.linenWhite);
    trolleyTop.position.y = 0.88;
    const trolleyBottom = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.03, 0.58), M.woodWalnut);
    trolleyBottom.position.y = 0.22;

    [
      [-0.38, -0.24],
      [0.38, -0.24],
      [-0.38, 0.24],
      [0.38, 0.24]
    ].forEach(([tx, tz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.86, 10), M.metalChrome);
      leg.position.set(tx, 0.45, tz);
      cartSvcGroup.add(leg);
    });

    const clochePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.015, 20), M.metalChrome);
    clochePlate.position.set(0, 0.91, 0);
    const clocheDome = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), M.metalChrome);
    clocheDome.position.set(0, 0.92, 0);
    const clocheKnob = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), M.metalChrome);
    clocheKnob.position.set(0, 1.07, 0);

    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.06, 14), M.marbleWhite);
    cup.position.set(-0.25, 0.93, 0.1);

    cartSvcGroup.add(trolleyTop, trolleyBottom, clochePlate, clocheDome, clocheKnob, cup);
    cartSvcGroup.position.set(-1.2, 0, -3.1);
    attachInteractiveData(cartSvcGroup, cartSvcMeta, 'Hotel Amenities');
    sceneContainer.add(cartSvcGroup);

    // Do Not Disturb Sign
    const dndMeta = getMeta('hotel_do_not_disturb');
    const dndGroup = new THREE.Group();
    dndGroup.name = 'DoNotDisturbSign';

    const dndCard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.006), new THREE.MeshStandardMaterial({ color: 0xbe123c }));
    dndCard.position.y = 0.11;
    const dndHole = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.005, 8, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    dndHole.position.set(0, 0.18, 0);

    dndGroup.add(dndCard, dndHole);
    dndGroup.position.set(-3.2, 1.2, -3.8);
    attachInteractiveData(dndGroup, dndMeta, 'Hotel Amenities');
    sceneContainer.add(dndGroup);

    // Heated Towel Rack
    const towelMeta = getMeta('hotel_towel_rack');
    const towelGroup = new THREE.Group();
    towelGroup.name = 'HeatedTowelRack';

    [-0.24, 0.24].forEach((rx) => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.2, 12), M.metalChrome);
      rail.position.set(rx, 0.6, 0);
      towelGroup.add(rail);
    });

    [0.2, 0.5, 0.8, 1.05].forEach((ry, idx) => {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.48, 12), M.metalChrome);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(0, ry, 0);
      towelGroup.add(bar);

      if (idx === 1) {
        const towel = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.05), M.terryCloth);
        towel.position.set(0, ry - 0.1, 0.02);
        towelGroup.add(towel);
      }
    });

    towelGroup.position.set(-5.8, 1.0, 3.0);
    attachInteractiveData(towelGroup, towelMeta, 'Hotel Amenities');
    sceneContainer.add(towelGroup);

    // Checkin Terminal Kiosk
    const kioskMeta = getMeta('hotel_checkin_terminal');
    const kioskGroup = new THREE.Group();
    kioskGroup.name = 'ExpressCheckinTerminal';

    const kBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.08, 20), M.wroughtIron);
    kBase.position.y = 0.04;
    const kPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.15, 16), M.metalChrome);
    kPillar.position.y = 0.62;
    const kHead = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.42, 0.08), M.wroughtIron);
    kHead.position.set(0, 1.25, 0);
    kHead.rotation.x = -0.28;
    const kScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.35), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
    kScreen.position.set(0, 1.25, 0.045);
    kScreen.rotation.x = -0.28;

    kioskGroup.add(kBase, kPillar, kHead, kScreen);
    kioskGroup.position.set(-3.8, 0, -3.2);
    attachInteractiveData(kioskGroup, kioskMeta, 'Hotel & Reception');
    sceneContainer.add(kioskGroup);

    // Concierge Desk
    const concMeta = getMeta('hotel_concierge');
    const concGroup = new THREE.Group();
    concGroup.name = 'ConciergeDesk';

    const concDesk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.05, 0.75), M.woodWalnut);
    concDesk.position.y = 0.525;
    const concTop = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.85), M.marbleWhite);
    concTop.position.y = 1.08;

    concGroup.add(concDesk, concTop);
    concGroup.position.set(3.6, 0, -2.2);
    attachInteractiveData(concGroup, concMeta, 'Hotel & Reception');
    sceneContainer.add(concGroup);

    // Conceptos holográficos de hotel
    if (global.World3D && typeof global.World3D.buildHolographicConceptNode === 'function') {
      scenObjects.forEach((item) => {
        if ((item.type === 'concept' || item.type === 'phrase') && item.pos) {
          const hNode = global.World3D.buildHolographicConceptNode(item, 'hotel');
          if (hNode) sceneContainer.add(hNode);
        }
      });
    }

    return sceneContainer;
  }

  // ============================================================================
  // 5. MODELADO DETALLADO: PARISIAN DATING BISTRO NIGHT TERRACE
  // ============================================================================

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
    if (!targetGroup || typeof THREE === 'undefined') return null;

    let root = targetGroup;
    if (targetGroup.getObjectByName && targetGroup.getObjectByName('ScenarioDynamicRoot')) {
      root = targetGroup.getObjectByName('ScenarioDynamicRoot');
    }

    const oldContainer = root.getObjectByName('MasterENG_DatingArchitecture');
    if (oldContainer) {
      root.remove(oldContainer);
    }

    if (global.World3D && Array.isArray(global.World3D.interactiveObjects)) {
      global.World3D.interactiveObjects = global.World3D.interactiveObjects.filter(
        (obj) => !(obj.userData && obj.userData.id && obj.userData.id.startsWith('dating_'))
      );
    }

    const sceneContainer = new THREE.Group();
    sceneContainer.name = 'MasterENG_DatingArchitecture';
    root.add(sceneContainer);

    const M = createSharedPBRMaterials(THREE);
    const scenObjects = (global.WORLD_TOUR_SCENARIOS && global.WORLD_TOUR_SCENARIOS.dating && global.WORLD_TOUR_SCENARIOS.dating.objects) || [];
    const getMeta = (id) => scenObjects.find((o) => o.id === id) || { id };

    localAnimationState.candleLights = [];
    localAnimationState.candleMeshes = [];
    localAnimationState.stringLightBulbs = [];

    // A. Terraza de granito oscuro y alfombra circular
    const terraceGeo = new THREE.CylinderGeometry(11.5, 12.0, 0.35, 48);
    const terraceMesh = new THREE.Mesh(
      terraceGeo,
      new THREE.MeshStandardMaterial({ color: 0x181824, roughness: 0.35, metalness: 0.15 })
    );
    terraceMesh.position.set(0, -0.175, -0.5);
    terraceMesh.receiveShadow = true;
    sceneContainer.add(terraceMesh);

    const rugTrim = new THREE.Mesh(new THREE.CylinderGeometry(3.18, 3.18, 0.02, 40), M.metalBrass);
    rugTrim.position.set(0, 0.01, 0);

    const rugCenter = new THREE.Mesh(new THREE.CylinderGeometry(3.05, 3.05, 0.03, 40), M.velvetBurgundy);
    rugCenter.position.set(0, 0.015, 0);
    rugCenter.receiveShadow = true;
    sceneContainer.add(rugTrim, rugCenter);

    // Cielo nocturno estrellado sobre la terraza (THREE.Points sutiles)
    const starGeo = new THREE.BufferGeometry();
    const starCount3D = 240;
    const starPos = new Float32Array(starCount3D * 3);
    for (let i = 0; i < starCount3D; i++) {
      const radius = 15 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = 0.15 + Math.random() * 0.72;
      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = radius * Math.cos(phi) + 2.5;
      starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.85
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    starPoints.name = 'DatingTerraceStars';
    sceneContainer.add(starPoints);

    // Barandilla de balcón con volutas
    const balconyMeta = getMeta('dating_city_balcony');
    const balconyGroup = new THREE.Group();
    balconyGroup.name = 'CityViewBalcony';

    const railRadius = 10.8;
    const railSegs = 28;
    const startAngle = Math.PI * 0.15;
    const arcAngle = Math.PI * 0.7;

    for (let s = 0; s < railSegs; s++) {
      const a1 = startAngle + (s * arcAngle) / railSegs;
      const a2 = startAngle + ((s + 1) * arcAngle) / railSegs;

      const x1 = Math.cos(a1) * railRadius;
      const z1 = -Math.sin(a1) * railRadius;
      const x2 = Math.cos(a2) * railRadius;
      const z2 = -Math.sin(a2) * railRadius;

      const segLen = Math.hypot(x2 - x1, z2 - z1);
      const segAngle = Math.atan2(x2 - x1, z2 - z1);

      const topRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, segLen), M.metalBrass);
      topRail.position.set((x1 + x2) / 2, 1.25, (z1 + z2) / 2);
      topRail.rotation.y = segAngle;

      const botRail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, segLen), M.wroughtIron);
      botRail.position.set((x1 + x2) / 2, 0.15, (z1 + z2) / 2);
      botRail.rotation.y = segAngle;

      const numSpindles = 3;
      for (let p = 0; p < numSpindles; p++) {
        const factor = (p + 0.5) / numSpindles;
        const px = x1 + (x2 - x1) * factor;
        const pz = z1 + (z2 - z1) * factor;

        const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.05, 8), M.wroughtIron);
        spindle.position.set(px, 0.7, pz);
        balconyGroup.add(spindle);

        if (p === 1) {
          const scroll = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 8, 16), M.wroughtIron);
          scroll.position.set(px, 0.7, pz);
          scroll.rotation.y = segAngle;
          balconyGroup.add(scroll);
        }
      }

      balconyGroup.add(topRail, botRail);
    }

    [-7.8, -3.8, 3.8, 7.8].forEach((px) => {
      const pz = -Math.sqrt(Math.max(0, railRadius * railRadius - px * px));
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.45, 0.24), M.wroughtIron);
      post.position.set(px, 0.725, pz);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 14), M.bulbEmissive);
      finial.position.set(px, 1.55, pz);

      balconyGroup.add(post, finial);
    });

    balconyGroup.position.set(0, 0, 0);
    attachInteractiveData(balconyGroup, balconyMeta, 'Romantic Date');
    sceneContainer.add(balconyGroup);

    // Fondo silueta nocturna
    const skylineTex = createNightCityBackdropTexture();
    const skylineMat = new THREE.MeshBasicMaterial({ map: skylineTex || null, side: THREE.DoubleSide });
    const skylineMesh = new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 14, 32, 1, true, Math.PI * 0.2, Math.PI * 0.6), skylineMat);
    skylineMesh.position.set(0, 5.5, -2.5);
    skylineMesh.rotation.y = Math.PI;
    sceneContainer.add(skylineMesh);

    // Arco floral nupcial
    const archGroup = new THREE.Group();
    archGroup.name = 'FloralRoseArch';

    const archLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 3.6, 12), M.wroughtIron);
    archLeft.position.set(-2.2, 1.8, -5.5);
    const archRight = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 3.6, 12), M.wroughtIron);
    archRight.position.set(2.2, 1.8, -5.5);
    const archTop = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.05, 10, 24, Math.PI), M.wroughtIron);
    archTop.position.set(0, 3.6, -5.5);

    for (let f = 0; f < 22; f++) {
      const angle = (f * Math.PI) / 21;
      const rx = Math.cos(angle) * 2.2;
      const ry = 3.6 + Math.sin(angle) * 2.2;
      const flower = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12), f % 2 === 0 ? M.rosePetalRed : new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
      flower.position.set(rx + (Math.random() - 0.5) * 0.15, ry, -5.5 + (Math.random() - 0.5) * 0.15);
      archGroup.add(flower);
    }
    archGroup.add(archLeft, archRight, archTop);
    sceneContainer.add(archGroup);

    // Guirnaldas de luces
    const stringMeta = getMeta('dating_string_lights');
    const stringGroup = new THREE.Group();
    stringGroup.name = 'RomanticStringLights';

    const cableEndpoints = [
      [[-7.8, 3.2, -4.5], [0, 4.2, -5.5]],
      [[0, 4.2, -5.5], [7.8, 3.2, -4.5]],
      [[-5.5, 3.2, -2.5], [5.5, 3.2, -2.5]]
    ];

    cableEndpoints.forEach(([start, end]) => {
      const numBulbs = 9;
      for (let b = 0; b <= numBulbs; b++) {
        const factor = b / numBulbs;
        const bx = start[0] + (end[0] - start[0]) * factor;
        const bz = start[2] + (end[2] - start[2]) * factor;
        const sag = Math.sin(factor * Math.PI) * 0.45;
        const by = start[1] + (end[1] - start[1]) * factor - sag;

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), M.bulbEmissive);
        bulb.position.set(bx, by, bz);
        stringGroup.add(bulb);
        localAnimationState.stringLightBulbs.push(bulb);
      }
    });

    attachInteractiveData(stringGroup, stringMeta, 'Romantic Date');
    sceneContainer.add(stringGroup);

    // B. Mesa íntima para dos
    const tableMeta = getMeta('dating_table_for_two');
    const tableGroup = new THREE.Group();
    tableGroup.name = 'IntimateTableForTwo';

    const tableBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.08, 24), M.wroughtIron);
    tableBase.position.y = 0.04;
    const tablePole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.9, 16), M.wroughtIron);
    tablePole.position.y = 0.48;

    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.04, 32), M.woodMahogany);
    tableTop.position.y = 0.93;

    const clothWhite = new THREE.Mesh(new THREE.CylinderGeometry(0.96, 1.08, 0.62, 32), M.linenWhite);
    clothWhite.position.y = 0.62;

    const topCloth = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 1.04, 0.12, 32), M.velvetBurgundy);
    topCloth.position.y = 0.92;

    tableGroup.add(tableBase, tablePole, tableTop, clothWhite, topCloth);

    function buildBistroChair() {
      const chair = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 24), M.velvetBurgundy);
      seat.position.y = 0.48;

      const backCurve = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.02, 10, 20, Math.PI), M.wroughtIron);
      backCurve.position.set(0, 0.74, -0.24);

      const backPillarL = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.38, 10), M.wroughtIron);
      backPillarL.position.set(-0.25, 0.58, -0.24);

      const backPillarR = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.38, 10), M.wroughtIron);
      backPillarR.position.set(0.25, 0.58, -0.24);

      [
        [-0.18, -0.18],
        [0.18, -0.18],
        [-0.18, 0.18],
        [0.18, 0.18]
      ].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.014, 0.48, 10), M.metalBrass);
        leg.position.set(lx, 0.24, lz);
        chair.add(leg);
      });

      chair.add(seat, backCurve, backPillarL, backPillarR);
      return chair;
    }

    const chairL = buildBistroChair();
    chairL.position.set(-1.25, 0, 0);
    chairL.rotation.y = Math.PI / 2;

    const chairR = buildBistroChair();
    chairR.position.set(1.25, 0, 0);
    chairR.rotation.y = -Math.PI / 2;

    tableGroup.add(chairL, chairR);

    [-0.45, 0.45].forEach((px, idx) => {
      const plateGroup = new THREE.Group();
      const dinnerPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.02, 24), M.marbleWhite);
      dinnerPlate.position.y = 0.01;

      const protein = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.035, 0.08),
        idx === 0
          ? new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.35 })
          : new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.28 })
      );
      protein.position.set(0, 0.03, 0);

      const mash = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), new THREE.MeshStandardMaterial({ color: 0xfef3c7 }));
      mash.position.set(0.06, 0.03, -0.04);

      plateGroup.add(dinnerPlate, protein, mash);
      plateGroup.position.set(px, 0.98, 0);
      tableGroup.add(plateGroup);
    });

    tableGroup.position.set(0, 0, 0);
    attachInteractiveData(tableGroup, tableMeta, 'Romantic Date');
    sceneContainer.add(tableGroup);

    // C. Candelabro y vela con luz parpadeante
    const candleMeta = getMeta('dating_candlelight');
    const candleGroup = new THREE.Group();
    candleGroup.name = 'RomanticCandlelight';

    const candBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.025, 20), M.metalBrass);
    candBase.position.y = 0.0125;
    const candStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.18, 14), M.metalBrass);
    candStem.position.y = 0.11;

    const waxCandle = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.16, 16), M.candleWax);
    waxCandle.position.y = 0.26;

    const flameGeo = new THREE.ConeGeometry(0.022, 0.065, 12);
    const flameMesh = new THREE.Mesh(flameGeo, M.candleFlame);
    flameMesh.position.set(0, 0.37, 0);

    // Luz cálida puntual (PointLight dorada suave) saliendo de la vela central de la mesa
    const flameLight = new THREE.PointLight(0xffb84d, 2.7, 7.8, 1.2);
    flameLight.position.set(0, 0.42, 0);
    flameLight.castShadow = true;
    if (flameLight.shadow) {
      flameLight.shadow.bias = -0.001;
      flameLight.shadow.mapSize.width = 512;
      flameLight.shadow.mapSize.height = 512;
    }

    // Luz suave de relleno cálido para iluminar nítidamente las copas, platos y rostros de la pareja
    const tableFillLight = new THREE.PointLight(0xffedd5, 0.85, 4.5, 1.5);
    tableFillLight.position.set(0, 0.65, 0);

    candleGroup.add(candBase, candStem, waxCandle, flameMesh, flameLight, tableFillLight);
    candleGroup.position.set(0, 0.98, 0);

    localAnimationState.candleMeshes.push(flameMesh);
    localAnimationState.candleLights.push(flameLight);

    attachInteractiveData(candleGroup, candleMeta, 'Romantic Date');
    sceneContainer.add(candleGroup);

    // D. 2 Copas de Vino Torneadas (LatheGeometry)
    const wineMeta = getMeta('dating_wine_glasses');
    const wineGroup = new THREE.Group();
    wineGroup.name = 'CrystalWineGlasses';

    const glassGeo = createWineGlassGeometry(THREE);

    [-0.24, 0.24].forEach((gx) => {
      const gMesh = new THREE.Mesh(glassGeo, M.glassWine);
      gMesh.scale.set(0.38, 0.38, 0.38);
      gMesh.position.set(gx, 0.98, 0.24);

      const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.035, 0.08, 16), M.wineRed);
      liquid.position.set(gx, 1.15, 0.24);

      wineGroup.add(gMesh, liquid);
    });

    attachInteractiveData(wineGroup, wineMeta, 'Romantic Date');
    sceneContainer.add(wineGroup);

    // E. Cubeta de champán cromada con botella en hielo
    const iceMeta = getMeta('dating_ice_bucket');
    const iceGroup = new THREE.Group();
    iceGroup.name = 'ChampagneIceBucket';

    const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.04, 16), M.metalBrass);
    standBase.position.y = 0.02;
    const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.82, 14), M.metalBrass);
    standPole.position.y = 0.44;

    const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.24, 20), M.metalChrome);
    bucket.position.y = 0.96;

    const iceLayer = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.165, 0.04, 16), M.glassClear);
    iceLayer.position.y = 1.04;

    const bottleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.05, 0.22, 16), new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.15 }));
    bottleBody.position.set(0.02, 1.14, 0);
    bottleBody.rotation.z = -0.22;

    const bottleFoil = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.032, 0.08, 14), M.metalBrass);
    bottleFoil.position.set(0.04, 1.25, 0);
    bottleFoil.rotation.z = -0.22;

    iceGroup.add(standBase, standPole, bucket, iceLayer, bottleBody, bottleFoil);
    iceGroup.position.set(-0.85, 0, -0.65);
    attachInteractiveData(iceGroup, iceMeta, 'Romantic Date');
    sceneContainer.add(iceGroup);

    // F. Ramo de rosas rojas en florero
    const roseMeta = getMeta('dating_rose_bouquet');
    const roseGroup = new THREE.Group();
    roseGroup.name = 'RoseBouquet';

    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.06, 0.22, 18), M.glassClear);
    vase.position.y = 0.11;

    [
      [0, 0.24, 0],
      [-0.04, 0.22, -0.03],
      [0.04, 0.22, -0.03],
      [-0.03, 0.21, 0.04],
      [0.03, 0.21, 0.04]
    ].forEach(([rx, ry, rz]) => {
      const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 12), M.rosePetalRed);
      bloom.position.set(rx, ry, rz);
      roseGroup.add(bloom);
    });

    roseGroup.add(vase);
    roseGroup.position.set(-0.25, 0.98, -0.25);
    attachInteractiveData(roseGroup, roseMeta, 'Romantic Date');
    sceneContainer.add(roseGroup);

    // G. Postre de chocolate & Menú
    const dessertMeta = getMeta('dating_chocolate_dessert');
    const dessertGroup = new THREE.Group();
    dessertGroup.name = 'ChocolateDessert';

    const dPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.015, 20), M.marbleWhite);
    dPlate.position.y = 0.0075;
    const cake = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 0.05, 16), M.chocolateGlaze);
    cake.position.y = 0.038;
    const strawberry = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.035, 10), M.rosePetalRed);
    strawberry.position.set(0, 0.075, 0);

    dessertGroup.add(dPlate, cake, strawberry);
    dessertGroup.position.set(0.24, 0.98, -0.26);
    attachInteractiveData(dessertGroup, dessertMeta, 'Romantic Date');
    sceneContainer.add(dessertGroup);

    const menuMeta = getMeta('dating_menu');
    const menuGroup = new THREE.Group();
    menuGroup.name = 'BistroMenu';

    const menuCover = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.26), M.velvetBurgundy);
    menuCover.position.y = 0.006;
    const menuPage = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.005, 0.24), M.linenWhite);
    menuPage.position.set(0, 0.012, 0);

    menuGroup.add(menuCover, menuPage);
    menuGroup.position.set(-0.34, 0.98, 0.28);
    attachInteractiveData(menuGroup, menuMeta, 'Romantic Date');
    sceneContainer.add(menuGroup);

    // H. Violín acústico detallado con arco y atril
    const violinMeta = getMeta('dating_violin');
    const violinGroup = new THREE.Group();
    violinGroup.name = 'AcousticViolin';

    const standBaseM = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.03, 14), M.wroughtIron);
    standBaseM.position.y = 0.015;
    const standPoleM = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 1.2, 12), M.wroughtIron);
    standPoleM.position.y = 0.62;
    const musicDesk = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.34, 0.02), M.wroughtIron);
    musicDesk.position.set(0, 1.25, 0);
    musicDesk.rotation.x = -0.35;

    const sheetMusic = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.3), M.linenWhite);
    sheetMusic.position.set(0, 1.25, 0.012);
    sheetMusic.rotation.x = -0.35;

    const vLowerBout = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.045, 18), M.woodMahogany);
    vLowerBout.position.set(0, 0.85, 0.22);
    vLowerBout.rotation.x = Math.PI / 2;

    const vUpperBout = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.045, 18), M.woodMahogany);
    vUpperBout.position.set(0, 1.05, 0.22);
    vUpperBout.rotation.x = Math.PI / 2;

    const vNeck = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.32, 0.028), M.wroughtIron);
    vNeck.position.set(0, 1.26, 0.23);

    const vScroll = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.014, 8, 16), M.woodMahogany);
    vScroll.position.set(0, 1.44, 0.24);

    const vBow = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.68, 8), M.woodMahogany);
    vBow.rotation.z = 0.65;
    vBow.position.set(0.18, 1.05, 0.28);

    violinGroup.add(standBaseM, standPoleM, musicDesk, sheetMusic, vLowerBout, vUpperBout, vNeck, vScroll, vBow);
    violinGroup.position.set(-3.4, 0, -2.2);
    attachInteractiveData(violinGroup, violinMeta, 'Romantic Date');
    sceneContainer.add(violinGroup);

    // I. Estación del Mesero
    const waiterMeta = getMeta('dating_waiter_npc');
    const waiterGroup = new THREE.Group();
    waiterGroup.name = 'WaiterCredenzaStation';

    const credenzaBody = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.05, 0.52), M.woodMahogany);
    credenzaBody.position.y = 0.525;
    const credenzaTop = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.05, 0.58), M.marbleWhite);
    credenzaTop.position.y = 1.075;

    const shaker = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.16, 14), M.metalChrome);
    shaker.position.set(0.18, 1.18, 0);

    waiterGroup.add(credenzaBody, credenzaTop, shaker);
    waiterGroup.position.set(3.45, 0, -2.4);
    attachInteractiveData(waiterGroup, waiterMeta, 'Romantic Date');
    sceneContainer.add(waiterGroup);

    // J. Candelabros altos de pie
    [-4.8, 4.8].forEach((cx) => {
      const floorCandle = new THREE.Group();
      const fBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.06, 16), M.wroughtIron);
      fBase.position.y = 0.03;
      const fPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 1.85, 14), M.wroughtIron);
      fPole.position.y = 0.95;

      [-0.22, 0, 0.22].forEach((bx) => {
        const vMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.18, 12), M.candleWax);
        vMesh.position.set(bx, 1.95, 0);
        const fFlame = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.05, 10), M.candleFlame);
        fFlame.position.set(bx, 2.06, 0);
        floorCandle.add(vMesh, fFlame);
      });

      floorCandle.add(fBase, fPole);
      floorCandle.position.set(cx, 0, 1.2);
      sceneContainer.add(floorCandle);
    });

    if (global.World3D && typeof global.World3D.rebuildDatingSeatedAvatars === 'function') {
      try {
        global.World3D.rebuildDatingSeatedAvatars();
      } catch (e) {
        console.warn('Error reconstruyendo avatares de dating:', e);
      }
    }

    if (global.World3D && typeof global.World3D.buildHolographicConceptNode === 'function') {
      scenObjects.forEach((item) => {
        if ((item.type === 'concept' || item.type === 'phrase') && item.pos) {
          const hNode = global.World3D.buildHolographicConceptNode(item, 'dating');
          if (hNode) sceneContainer.add(hNode);
        }
      });
    }

    return sceneContainer;
  }

  // ============================================================================
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
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.02, 20), M.metalBrass);
    base.position.y = 0.01;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.065, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), M.metalBrass);
    dome.position.y = 0.03;
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.035, 10), M.metalChrome);
    pin.position.y = 0.085;
    g.add(base, dome, pin);
    return g;
  };

  B['hotel_luggage_cart'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const platform = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.12, 0.95), M.velvetBurgundy);
    platform.position.y = 0.22;
    g.add(platform);
    return g;
  };

  B['hotel_elevator'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const frame = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.8, 0.25), M.metalBronze);
    frame.position.y = 1.9;
    g.add(frame);
    return g;
  };

  B['hotel_lobby_sofa'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.28, 0.85), M.leatherChesterfield);
    seat.position.y = 0.38;
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.62, 0.28), M.leatherChesterfield);
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
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.8, 0.18), M.woodWalnut);
    headboard.position.set(0, 0.9, -1.25);
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.32, 2.2), M.linenWhite);
    mattress.position.set(0, 0.51, 0);
    g.add(headboard, mattress);
    return g;
  };

  B['hotel_minibar'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.95, 0.65), M.wroughtIron);
    body.position.y = 0.475;
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.88, 0.04), M.glassClear);
    door.position.set(0, 0.475, 0.33);
    g.add(body, door);
    return g;
  };

  B['hotel_safe_box'] = function(item, scen, P) {
    const M = createSharedPBRMaterials(THREE);
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.48), M.wroughtIron);
    body.position.y = 0.225;
    g.add(body);
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
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.04, 32), M.velvetBurgundy);
    top.position.y = 0.93;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.08, 24), M.wroughtIron);
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

  // ============================================================================
  // 7. BUCLE DE ANIMACIÓN INTERNO (PARPADEO REALISTA DE VELAS Y LUCES)
  // ============================================================================

  function startLocalAnimationLoop() {
    if (localAnimationState.animFrameId) return;

    function tick(now) {
      localAnimationState.animFrameId = requestAnimationFrame(tick);
      const t = now * 0.001;

      if (localAnimationState.candleLights.length > 0) {
        const flicker = 2.6 + Math.sin(t * 11.2) * 0.22 + Math.cos(t * 19.5) * 0.15;
        localAnimationState.candleLights.forEach((light) => {
          if (light && light.parent) light.intensity = flicker;
        });
      }

      if (localAnimationState.candleMeshes.length > 0) {
        const scaleY = 1.0 + Math.sin(t * 14.0) * 0.14;
        localAnimationState.candleMeshes.forEach((mesh) => {
          if (mesh && mesh.parent) mesh.scale.y = scaleY;
        });
      }

      if (localAnimationState.stringLightBulbs.length > 0 && Math.floor(t * 10) % 4 === 0) {
        const pulse = 0.95 + Math.sin(t * 3.5) * 0.08;
        localAnimationState.stringLightBulbs.forEach((bulb) => {
          if (bulb && bulb.parent) bulb.scale.set(pulse, pulse, pulse);
        });
      }
    }

    if (typeof requestAnimationFrame !== 'undefined') {
      localAnimationState.animFrameId = requestAnimationFrame(tick);
    }
  }

  if (typeof requestAnimationFrame !== 'undefined') {
    startLocalAnimationLoop();
  }

  // ============================================================================
  // 8. SISTEMA DE ENGANCHE AUTOMÁTICO (SMART HOOKS PARA WORLD3D)
  // ============================================================================

  function hookIntoWorld3D() {
    if (!global.World3D) return;

    // Hook switchScenario
    if (!global.World3D._datingHotelHooked) {
      global.World3D._datingHotelHooked = true;

      const origSwitch = global.World3D.switchScenario;
      global.World3D.switchScenario = function (scenarioKey) {
        const res = typeof origSwitch === 'function' ? origSwitch.apply(this, arguments) : undefined;
        const key = String(scenarioKey || '').toLowerCase().trim();

        setTimeout(() => {
          const sc = global.World3D.scene;
          if (!sc) return;
          if (key === 'hotel') {
            buildHotelScene(sc);
          } else if (key === 'dating') {
            buildDatingScene(sc);
          }
          if (global.World3D && typeof global.World3D.normalizeSceneInteractiveMetadata === 'function') {
            global.World3D.normalizeSceneInteractiveMetadata(sc, key);
          }
        }, 50);

        return res;
      };
      global.World3D.switch3DScenario = global.World3D.switchScenario;

      // Hook buildScenarioWorld
      const origBuild = global.World3D.buildScenarioWorld;
      if (typeof origBuild === 'function') {
        global.World3D.buildScenarioWorld = function (targetScene, scenarioKey) {
          const res = origBuild.apply(this, arguments);
          const key = String(scenarioKey || '').toLowerCase().trim();
          const sc = targetScene || global.World3D.scene;
          if (sc) {
            if (key === 'hotel') {
              buildHotelScene(sc);
            } else if (key === 'dating') {
              buildDatingScene(sc);
            }
            if (global.World3D && typeof global.World3D.normalizeSceneInteractiveMetadata === 'function') {
              global.World3D.normalizeSceneInteractiveMetadata(sc, key);
            }
          }
          return res;
        };
      }

      // Hook buildCompound3DObject
      const origCompound = global.World3D.buildCompound3DObject;
      if (typeof origCompound === 'function') {
        global.World3D.buildCompound3DObject = function (itemSpec, scenarioKey) {
          if ((scenarioKey === 'hotel' || scenarioKey === 'dating') && itemSpec && itemSpec.id && typeof B[itemSpec.id] === 'function') {
            const custom = B[itemSpec.id](itemSpec, scenarioKey);
            if (custom) {
              attachInteractiveData(custom, itemSpec, scenarioKey === 'hotel' ? 'Hotel & Reception' : 'Romantic Date');
              return custom;
            }
          }
          return origCompound.apply(this, arguments);
        };
        global.buildCompound3DObject = global.World3D.buildCompound3DObject;
      }
    }

    // Auto-construir si ya está en hotel o dating
    const selectEl = typeof document !== 'undefined' ? document.getElementById('world3dScenarioSelect') : null;
    const currentKey = (selectEl && selectEl.value) || (global.currentScenarioKey) || '';
    if (currentKey === 'hotel' || currentKey === 'dating') {
      const sc = global.World3D.scene;
      if (sc) {
        if (currentKey === 'hotel') buildHotelScene(sc);
        if (currentKey === 'dating') buildDatingScene(sc);
        if (global.World3D && typeof global.World3D.normalizeSceneInteractiveMetadata === 'function') {
          global.World3D.normalizeSceneInteractiveMetadata(sc, currentKey);
        }
      }
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
              if (val === 'hotel') buildHotelScene(sc);
              if (val === 'dating') buildDatingScene(sc);
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

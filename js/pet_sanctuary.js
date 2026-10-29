/**
 * ============================================================================
 * MasterENG - MASTERPET SANCTUARY (Casimeritos, Pou/Moy & Social Co-Op)
 * ============================================================================
 * Archivo: js/pet_sanctuary.js
 * Descripción: Sistema integral de gestión y crianza de mascotas virtuales estilo
 * Pou / Casimerito / Moy dentro de MasterENG con estética Papercraft / Teatro de Cartón.
 * 
 * REQUERIMIENTOS TÉCNICOS:
 * 1. Control de acceso estricto (solo usuarios logueados). Modal Papercraft bloqueante.
 * 2. Sanctuary Hub con selector de sub-portales (Mascotas Individuales vs Mascotas Compartidas Co-Op).
 * 3. Catálogo de especies Freemium (Cocodrilo, Cachorro, Gatito) y Exclusivos VIP con candado dorado (Rinoceronte, Ajolote, Panda Rojo).
 * 4. Cálculo biológico por timestamps reales (edad en días y decaimiento de hambre, higiene, energía y felicidad).
 * 5. Cuarto de juego/hábitat interactivo con alimentación (vocabulario en inglés y pronunciación), baño con espuma/agua, siesta con lámpara y minijuego de globos de palabras.
 * 6. Sincronización Co-Parenting en tiempo real con BroadcastChannel y códigos de enlace.
 */

(function (global) {
  'use strict';

  // ==========================================================================
  // 1. CATÁLOGOS Y METADATOS DE ESPECIES, HÁBITATS, ALIMENTOS Y VESTUARIO
  // ==========================================================================
  const PET_SPECIES = {
    crocodile: {
      id: 'crocodile',
      name: 'Crocodile',
      es: 'Cocodrilo',
      habitatId: 'mangrove',
      habitatName: 'Mangrove Swamp',
      habitatEs: 'Pantano de Manglares',
      theme: { bg: '#064e3b', accent: '#10b981', border: '#047857' },
      isVip: false,
      icon: '🐊',
      defaultName: 'Crocody',
      desc: 'Ama el agua fresca, los peces crujientes y chapotear entre nenúfares de cartón.',
      favFood: 'fish'
    },
    puppy: {
      id: 'puppy',
      name: 'Puppy',
      es: 'Cachorrito',
      habitatId: 'backyard',
      habitatName: 'Cozy Backyard',
      habitatEs: 'Patio Cálido de Jardín',
      theme: { bg: '#78350f', accent: '#f59e0b', border: '#b45309' },
      isVip: false,
      icon: '🐶',
      defaultName: 'Buddy',
      desc: 'Juguetón, fiel y siempre listo para correr, saltar y mascar ricas zanahorias.',
      favFood: 'carrot'
    },
    kitten: {
      id: 'kitten',
      name: 'Kitten',
      es: 'Gatito',
      habitatId: 'loft',
      habitatName: 'Cardboard Loft',
      habitatEs: 'Desván de Cajas de Cartón',
      theme: { bg: '#4c1d95', accent: '#8b5cf6', border: '#6d28d9' },
      isVip: false,
      icon: '🐱',
      defaultName: 'Milo',
      desc: 'Curioso, ágil y dormilón. Ronronea al acariciarlo y adora la leche tibia.',
      favFood: 'milk'
    },
    rhinoceros: {
      id: 'rhinoceros',
      name: 'Rhinoceros',
      es: 'Rinoceronte',
      habitatId: 'savannah',
      habitatName: 'Golden Savannah',
      habitatEs: 'Sabana Dorada Africana',
      theme: { bg: '#854d0e', accent: '#eab308', border: '#ca8a04' },
      isVip: true,
      vipBadge: '👑 VIP PASS / SEASON PASS',
      icon: '🦏',
      defaultName: 'Titan',
      desc: 'Fuerte, noble y con un cuerno dorado protector. Adora los pastizales dorados.',
      favFood: 'apple'
    },
    axolotl: {
      id: 'axolotl',
      name: 'Axolotl',
      es: 'Ajolote Mexicano',
      habitatId: 'xochimilco',
      habitatName: 'Mystic Xochimilco',
      habitatEs: 'Xochimilco Místico y Acuático',
      theme: { bg: '#831843', accent: '#ec4899', border: '#be185d' },
      isVip: true,
      vipBadge: '👑 VIP PASS / SEASON PASS',
      icon: '🦎',
      defaultName: 'Xochi',
      desc: 'Criatura mística con branquias rosadas en pluma y sonrisa eterna. Siempre feliz bajo el agua.',
      favFood: 'strawberry'
    },
    red_panda: {
      id: 'red_panda',
      name: 'Red Panda',
      es: 'Panda Rojo',
      habitatId: 'bamboo',
      habitatName: 'Bamboo Temple',
      habitatEs: 'Templo de Bambú Celestial',
      theme: { bg: '#7f1d1d', accent: '#ef4444', border: '#b91c1c' },
      isVip: true,
      vipBadge: '👑 VIP PASS / SEASON PASS',
      icon: '🦊',
      defaultName: 'Rusty',
      desc: 'Acróbata con cola anillada esponjosa. Trepa cañas de bambú y adora las galletas.',
      favFood: 'cookie'
    }
  };

  const PET_FOODS = [
    { id: 'apple', name: 'Crunchy Apple', es: 'Manzana Crujiente', icon: '🍎', hunger: 20, exp: 5, cost: 5, vocab: 'An apple a day keeps hunger away!' },
    { id: 'carrot', name: 'Organic Carrot', es: 'Zanahoria Dulce', icon: '🥕', hunger: 16, exp: 4, cost: 4, vocab: 'Crunchy orange carrot full of vitamins!' },
    { id: 'burger', name: 'Paper Burger', es: 'Hamburguesa Papercraft', icon: '🍔', hunger: 35, exp: 10, cost: 12, vocab: 'Delicious juicy burger for hungry pets!' },
    { id: 'strawberry', name: 'Sweet Strawberry', es: 'Fresa Silvestre', icon: '🍓', hunger: 15, exp: 5, cost: 5, vocab: 'Sweet and fragrant red strawberry!' },
    { id: 'milk', name: 'Warm Milk', es: 'Leche Tibia', icon: '🥛', hunger: 22, exp: 6, cost: 6, vocab: 'Warm fresh milk to soothe your sweet pet!' },
    { id: 'cookie', name: 'Choco Cookie', es: 'Galleta de Chocolate', icon: '🍪', hunger: 18, exp: 8, cost: 8, vocab: 'A crispy sweet treat for good behavior!' },
    { id: 'fish', name: 'Golden Fish', es: 'Pescado Dorado', icon: '🐟', hunger: 30, exp: 9, cost: 10, vocab: 'Fresh healthy fish full of energy and protein!' }
  ];

  const PET_ACCESSORIES = [
    { id: 'hat_aviator', name: 'Aviator Cap', es: 'Gorro de Aviador', icon: '🛩️', slot: 'hat', cost: 50 },
    { id: 'hat_crown', name: 'Golden Crown', es: 'Corona de Oro Real', icon: '👑', slot: 'hat', cost: 110 },
    { id: 'hat_bow', name: 'Pink Ribbon', es: 'Moño Rosa Coquette', icon: '🎀', slot: 'hat', cost: 40 },
    { id: 'hat_party', name: 'Party Cone', es: 'Sombrero Festivo', icon: '🎉', slot: 'hat', cost: 35 },
    { id: 'glasses_cool', name: 'Sunglasses', es: 'Gafas de Sol Estilo', icon: '🕶️', slot: 'glasses', cost: 45 },
    { id: 'glasses_smart', name: 'Smart Glasses', es: 'Gafas de Profesor', icon: '👓', slot: 'glasses', cost: 40 },
    { id: 'scarf_winter', name: 'Warm Scarf', es: 'Bufanda Acogedora', icon: '🧣', slot: 'neck', cost: 55 }
  ];

  const VOCAB_MINIGAME_DECK = [
    { en: 'Water', es: 'Agua', wrong: ['Fuego', 'Tierra'] },
    { en: 'Friend', es: 'Amigo / Pareja', wrong: ['Enemigo', 'Peligro'] },
    { en: 'Happy', es: 'Feliz / Contento', wrong: ['Triste', 'Enojado'] },
    { en: 'Sleep', es: 'Dormir / Descanso', wrong: ['Correr', 'Comer'] },
    { en: 'Clean', es: 'Limpio / Bañado', wrong: ['Sucio', 'Mojado'] },
    { en: 'Hungry', es: 'Hambriento', wrong: ['Lleno', 'Sediento'] },
    { en: 'Play', es: 'Jugar / Divertirse', wrong: ['Pelear', 'Llorar'] },
    { en: 'Sunny', es: 'Soleado / Cálido', wrong: ['Lluvioso', 'Nublado'] },
    { en: 'Garden', es: 'Jardín / Patio', wrong: ['Cocina', 'Puente'] },
    { en: 'Heart', es: 'Corazón / Amor', wrong: ['Cabeza', 'Mano'] },
    { en: 'Breeze', es: 'Brisa Fresca', wrong: ['Tormenta', 'Fuego'] },
    { en: 'Rainbow', es: 'Arcoíris Mágico', wrong: ['Roca', 'Nieve'] }
  ];

  // ==========================================================================
  // 2. ESTADO GLOBAL DEL SANTUARIO Y CANAL CO-OP EN TIEMPO REAL
  // ==========================================================================
  const sanctuaryState = {
    isOpen: false,
    currentView: 'hub', // 'hub', 'room', 'adopt', 'coop_invite', 'shop', 'minigame'
    selectedPetId: null,
    activeTab: 'all',   // 'all', 'mine', 'shared'
    minigameState: null,
    coopChannel: null,
    hiddenElements: []
  };

  // Inicializar BroadcastChannel para sincronización Co-Parenting
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      sanctuaryState.coopChannel = new BroadcastChannel('masterpet_coop_sync');
      sanctuaryState.coopChannel.onmessage = function (ev) {
        if (!ev || !ev.data) return;
        handleCoopMessage(ev.data);
      };
    }
  } catch (_) {}

  function handleCoopMessage(msg) {
    if (!msg) return;
    if (msg.type === 'COOP_ACTION') {
      const pets = loadStoredPets();
      const target = pets.find(p => p.id === msg.petId);
      if (target) {
        target.hunger = msg.hunger !== undefined ? msg.hunger : target.hunger;
        target.hygiene = msg.hygiene !== undefined ? msg.hygiene : target.hygiene;
        target.energy = msg.energy !== undefined ? msg.energy : target.energy;
        target.happiness = msg.happiness !== undefined ? msg.happiness : target.happiness;
        target.exp = msg.exp !== undefined ? msg.exp : target.exp;
        target.level = msg.level !== undefined ? msg.level : target.level;
        target.activityLog = target.activityLog || [];
        target.activityLog.unshift(msg.logEntry);
        if (target.activityLog.length > 20) target.activityLog.pop();
        saveStoredPets(pets);

        showPetPaperToast(`🤝 ${msg.logEntry.text}`);
        if (sanctuaryState.isOpen) {
          if (sanctuaryState.currentView === 'hub') renderSanctuaryHub();
          else if (sanctuaryState.currentView === 'room' && sanctuaryState.selectedPetId === msg.petId) renderPetRoom(target);
        }
      }
    } else if (msg.type === 'coop_sync' && msg.group) {
      if (typeof saveRealCoopGroup === 'function') saveRealCoopGroup(msg.group);
      const tabBody = document.getElementById('coopModalTabBody');
      if (tabBody && typeof renderCoopTabContent === 'function') {
        tabBody.innerHTML = renderCoopTabContent(currentCoopTab, msg.group, getCurrentUserMeta());
      }
    } else if (msg.type === 'exp_contributed') {
      if (typeof getRealCoopGroup === 'function') {
        const g = getRealCoopGroup();
        if (g && g.code === msg.code) {
          g.totalExpPool = (g.totalExpPool || 0) + (msg.amount || 0);
          saveRealCoopGroup(g);
          showPetPaperToast(`🤝 ¡${msg.by || 'Tu compañero'} aportó +${msg.amount} EXP a la sala!`);
          const tabBody = document.getElementById('coopModalTabBody');
          if (tabBody && typeof renderCoopTabContent === 'function') {
            tabBody.innerHTML = renderCoopTabContent(currentCoopTab, g, getCurrentUserMeta());
          }
        }
      }
    } else if (msg.type === 'group_deleted') {
      if (typeof getRealCoopGroup === 'function') {
        const g = getRealCoopGroup();
        if (g && g.code === msg.code) {
          saveRealCoopGroup(null);
          showPetPaperToast('🚪 La sala de crianza compartida ha sido cerrada.');
          const tabBody = document.getElementById('coopModalTabBody');
          if (tabBody && typeof renderCoopTabContent === 'function') {
            tabBody.innerHTML = renderCoopTabContent(currentCoopTab, null, getCurrentUserMeta());
          }
        }
      }
    }
  }

  // ==========================================================================
  // 3. CONTROL DE ACCESO ESTRICTO (SOLO USUARIOS LOGUEADOS)
  // ==========================================================================
  function isUserLoggedIn() {
    const sessionKeys = ['mastereng_user', 'english_app_user_session'];
    for (const k of sessionKeys) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          if (raw.trim().toLowerCase() === 'invitado') continue;
          return true;
        }
      } catch (_) {}
    }
    if (typeof global.isUserLoggedIn === 'function') {
      try { if (global.isUserLoggedIn()) return true; } catch (_) {}
    }
    if (typeof global.isUserRegistered === 'function') {
      try { if (global.isUserRegistered()) return true; } catch (_) {}
    }
    return false;
  }

  function getCurrentUserMeta() {
    const sessionKeys = ['mastereng_user', 'english_app_user_session'];
    for (const k of sessionKeys) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') return parsed;
        }
      } catch (_) {}
    }
    return { name: 'Player', email: '', isVip: false };
  }

  function isUserVip() {
    try {
      if (localStorage.getItem('mastereng_is_vip') === 'true') return true;
      if (localStorage.getItem('user_role') === 'admin' || localStorage.getItem('user_role') === 'vip' || localStorage.getItem('user_role') === 'premium') return true;
      const user = getCurrentUserMeta();
      if (user && (user.isVip || user.role === 'admin' || user.role === 'vip' || user.role === 'premium' || user.isPremium)) return true;
      if (typeof global.isCurrentUserAdmin === 'function' && global.isCurrentUserAdmin()) return true;
      if (typeof global.isUserPremium === 'function' && global.isUserPremium()) return true;
    } catch (_) {}
    return false;
  }

  // Claves de persistencia y control de migración limpia v2
  const STORAGE_KEY_PETS = 'mastereng_pets';
  const STORAGE_KEY_V2_MIGRATION = 'masterpet_v2_clean';

  // Migración automática a v2 limpia: purga mascotas demo y garantiza 0 mascotas por defecto
  function migrateMasterPetStorage() {
    try {
      const migrationDone = localStorage.getItem(STORAGE_KEY_V2_MIGRATION);
      if (migrationDone !== 'true') {
        const raw = localStorage.getItem(STORAGE_KEY_PETS);
        if (raw) {
          let pets = JSON.parse(raw);
          if (Array.isArray(pets)) {
            // Purgar cualquier mascota demo precargada (Crocody, Coco, pet_demo_1, pet_starter_, pet_coop_demo_)
            const cleaned = pets.filter(p => {
              if (!p) return false;
              if (p.id === 'pet_demo_1' || p.id === 'pet_demo_2') return false;
              if (typeof p.id === 'string' && (p.id.startsWith('pet_starter_') || p.id.startsWith('pet_coop_demo_') || p.id.startsWith('pet_demo_'))) return false;
              if (p.name === 'Crocody' || p.name === 'Coco') return false;
              return true;
            });
            localStorage.setItem(STORAGE_KEY_PETS, JSON.stringify(cleaned));
          }
        }
        localStorage.setItem(STORAGE_KEY_V2_MIGRATION, 'true');
      }
    } catch (e) {
      console.warn('[MasterPet] Error during v2 clean migration:', e);
    }
  }

  // ==========================================================================
  // 4. PERSISTENCIA EN LOCALSTORAGE Y CÁLCULO BIOLÓGICO POR TIMESTAMPS
  // ==========================================================================
  function loadStoredPets() {
    migrateMasterPetStorage();
    let pets = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PETS);
      if (raw) pets = JSON.parse(raw);
    } catch (_) {}

    if (!Array.isArray(pets)) {
      pets = [];
    }

    // Regla estricta: 0 mascotas por defecto. El usuario nuevo inicia con santuario vacío.
    if (pets.length === 0) {
      return [];
    }

    // Actualizar decaimiento biológico de las mascotas existentes según tiempo real
    pets = pets.map(updatePetDecayAndVitals);
    saveStoredPets(pets);
    return pets;
  }

  function saveStoredPets(pets) {
    try {
      localStorage.setItem(STORAGE_KEY_PETS, JSON.stringify(pets));
    } catch (_) {}
  }

  function getStoredCoins() {
    try {
      const c = localStorage.getItem('mastereng_pet_coins');
      return c !== null ? parseInt(c, 10) : 180;
    } catch (_) {
      return 180;
    }
  }

  function setStoredCoins(amt) {
    try {
      localStorage.setItem('mastereng_pet_coins', String(Math.max(0, amt)));
    } catch (_) {}
  }

  function addStoredCoins(diff) {
    const current = getStoredCoins();
    const updated = Math.max(0, current + diff);
    setStoredCoins(updated);
    return updated;
  }

  // Cálculo biológico de decaimiento temporal y etapas de madurez
  function updatePetDecayAndVitals(pet) {
    const now = Date.now();
    if (!pet.createdAt) pet.createdAt = now;
    if (!pet.lastFedAt) pet.lastFedAt = now - 3600000;
    if (!pet.lastCleanedAt) pet.lastCleanedAt = now - 3600000;
    if (!pet.lastPlayedAt) pet.lastPlayedAt = now - 3600000;
    if (!pet.lastSleptAt) pet.lastSleptAt = now - 3600000;

    // 1. Días reales transcurridos desde adopción
    pet.daysOld = Math.max(0, Math.floor((now - pet.createdAt) / 86400000));

    // 2. Horas transcurridas para decaimiento natural
    const hoursSinceFed = Math.max(0, (now - pet.lastFedAt) / 3600000);
    const hoursSinceCleaned = Math.max(0, (now - pet.lastCleanedAt) / 3600000);
    const hoursSincePlayed = Math.max(0, (now - pet.lastPlayedAt) / 3600000);

    // Hambre: decae ~3.5% por cada hora sin comer
    const rawHunger = (pet.hunger !== undefined ? pet.hunger : 80) - (hoursSinceFed * 3.2);
    pet.hunger = Math.max(8, Math.min(100, Math.round(rawHunger)));

    // Higiene: decae ~2.5% por cada hora sin lavar
    const rawHygiene = (pet.hygiene !== undefined ? pet.hygiene : 85) - (hoursSinceCleaned * 2.4);
    pet.hygiene = Math.max(8, Math.min(100, Math.round(rawHygiene)));

    // Energía: se recupera si duerme, decae si está despierto
    if (pet.isSleeping) {
      const sleepHours = Math.max(0, (now - (pet.sleepStartedAt || now)) / 3600000);
      pet.energy = Math.min(100, Math.round((pet.energy || 40) + sleepHours * 150));
      if (pet.energy >= 100) pet.isSleeping = false;
    } else {
      const awakeHours = Math.max(0, (now - pet.lastSleptAt) / 3600000);
      const rawEnergy = (pet.energy !== undefined ? pet.energy : 85) - (awakeHours * 2.2);
      pet.energy = Math.max(12, Math.min(100, Math.round(rawEnergy)));
    }

    // Felicidad: promedio ponderado de signos vitales menos penalización por soledad
    const avgVitals = (pet.hunger * 0.35) + (pet.hygiene * 0.35) + (pet.energy * 0.30);
    const lonelinessPenalty = Math.min(25, hoursSincePlayed * 1.2);
    pet.happiness = Math.max(10, Math.min(100, Math.round(avgVitals - lonelinessPenalty)));

    // Etapas de madurez por nivel y días reales
    const lvl = pet.level || 1;
    if (lvl >= 16 || pet.daysOld >= 21) {
      pet.stage = 'Master Adult';
      pet.stageBadge = '👑 Master Adult';
    } else if (lvl >= 10 || pet.daysOld >= 10) {
      pet.stage = 'Teen Explorer';
      pet.stageBadge = '🎒 Teen Explorer';
    } else if (lvl >= 5 || pet.daysOld >= 4) {
      pet.stage = 'Curious Toddler';
      pet.stageBadge = '🐾 Curious Toddler';
    } else {
      pet.stage = 'Baby Hatchling';
      pet.stageBadge = '🐣 Baby Hatchling';
    }

    return pet;
  }

  // ==========================================================================
  // 5. INYECCIÓN DE ESTILOS PAPERCRAFT (TEATRO DE CARTÓN CORRUGADO)
  // ==========================================================================
  function ensureSanctuaryStyles() {
    if (document.getElementById('masterpet-sanctuary-styles')) return;
    const style = document.createElement('style');
    style.id = 'masterpet-sanctuary-styles';
    style.textContent = `
      /* ESTILOS MAESTROS PAPERCRAFT - MASTERPET SANCTUARY */
      #view-pet-sanctuary,
      #pet-sanctuary-root {
        position: fixed !important;
        top: 64px !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: calc(100vh - 64px) !important;
        z-index: 9500 !important;
        display: flex;
        flex-direction: column;
        padding-top: 0 !important;
        box-sizing: border-box !important;
        background: #2b1d12 !important;
        background-image: radial-gradient(#3f271d 15%, transparent 16%), radial-gradient(#3f271d 15%, transparent 16%) !important;
        background-size: 24px 24px !important;
        background-position: 0 0, 12px 12px !important;
        color: #fdfbf7;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        user-select: none;
      }

      /* SUPRESIÓN ESTRICTA DEL CARRUSEL DE PORTALES ARCANOS CUANDO EL SANTUARIO ESTÁ ACTIVO */
      body.pet-sanctuary-active #coverFlowViewport,
      body.pet-sanctuary-active .coverflow-viewport,
      body.pet-sanctuary-active .hub-carousel,
      body.pet-sanctuary-active .carousel-viewport,
      body.pet-sanctuary-active .carousel-nav-btn,
      body.pet-sanctuary-active .carousel-btn,
      body.pet-sanctuary-active .nav-arrow,
      body.pet-sanctuary-active .portal-card,
      body.pet-sanctuary-active #portalStarsCanvas,
      body.pet-sanctuary-active #view-home,
      body.pet-sanctuary-active #viewHome,
      body.pet-sanctuary-active #portalHub,
      body.pet-sanctuary-active .portals-section,
      body.pet-sanctuary-active .arcane-portals-container,
      body.pet-sanctuary-active .carousel-container,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) #coverFlowViewport,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) .coverflow-viewport,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) .hub-carousel,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) .carousel-viewport,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) .carousel-nav-btn,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) .carousel-btn,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) .nav-arrow,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) .portal-card,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) #portalStarsCanvas,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) #view-home,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) #viewHome,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) #portalHub,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) .portals-section,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) .arcane-portals-container,
      body:has(#view-pet-sanctuary:not(.hidden):not([style*="display: none"])) .carousel-container {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
        opacity: 0 !important;
      }

      .paper-cardboard-panel {
        background: #fbf6ec;
        background-image: linear-gradient(135deg, rgba(217, 119, 6, 0.05) 25%, transparent 25%),
                          linear-gradient(225deg, rgba(217, 119, 6, 0.05) 25%, transparent 25%),
                          linear-gradient(45deg, rgba(217, 119, 6, 0.05) 25%, transparent 25%),
                          linear-gradient(315deg, rgba(217, 119, 6, 0.05) 25%, #fbf6ec 25%);
        background-size: 16px 16px;
        border: 4px solid #b45309;
        border-radius: 20px;
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -4px 0 #92400e;
        color: #451a03;
        position: relative;
      }

      .paper-stitches {
        border: 2px dashed #b45309;
        border-radius: 12px;
        padding: 8px;
      }

      .paper-btn-primary {
        background: linear-gradient(to bottom, #f59e0b, #d97706);
        border: 2px solid #78350f;
        border-bottom: 5px solid #78350f;
        border-radius: 14px;
        color: #fff;
        font-weight: 800;
        text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        box-shadow: 0 4px 10px rgba(217, 119, 6, 0.35);
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .paper-btn-primary:active {
        transform: translateY(3px);
        border-bottom-width: 2px;
      }

      .paper-btn-secondary {
        background: #e2e8f0;
        border: 2px solid #64748b;
        border-bottom: 4px solid #475569;
        border-radius: 12px;
        color: #1e293b;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .paper-btn-secondary:active {
        transform: translateY(2px);
        border-bottom-width: 2px;
      }

      .paper-pet-stage-card {
        background: #fffdfa;
        border: 3px solid #b45309;
        border-radius: 18px;
        box-shadow: 0 8px 18px rgba(0,0,0,0.25), inset 0 -3px 0 #d97706;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
        cursor: pointer;
      }
      .paper-pet-stage-card:hover {
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 16px 28px rgba(0,0,0,0.35);
      }

      /* Barra de vida estilo Casimerito */
      .pet-meter-bar {
        background: #e2e8f0;
        border: 2px solid #94a3b8;
        border-radius: 10px;
        height: 12px;
        overflow: hidden;
        position: relative;
      }
      .pet-meter-fill {
        height: 100%;
        border-radius: 8px;
        transition: width 0.3s ease;
      }

      /* Animación de respiración / vida */
      @keyframes paperFloatPet {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-8px) scale(1.02, 0.98); }
      }
      .pet-idle-anim {
        animation: paperFloatPet 3s ease-in-out infinite;
      }

      @keyframes paperEatNom {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.15, 0.85); }
        50% { transform: scale(0.95, 1.1); }
        75% { transform: scale(1.08, 0.92); }
      }
      .pet-eat-anim {
        animation: paperEatNom 0.6s ease-in-out 3;
      }

      /* Toast flotante de papel */
      .paper-toast-alert {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: #fef3c7;
        color: #78350f;
        border: 3px solid #b45309;
        border-radius: 16px;
        padding: 12px 24px;
        font-weight: 800;
        box-shadow: 0 12px 28px rgba(0,0,0,0.35);
        z-index: 10005;
        animation: paperSlideUp 0.3s ease;
      }
      @keyframes paperSlideUp {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
    `;
    (document.head || document.body).appendChild(style);
  }

  function showPetPaperToast(msg) {
    ensureSanctuaryStyles();
    const existing = document.getElementById('masterpet-toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.id = 'masterpet-toast';
    t.className = 'paper-toast-alert';
    t.innerHTML = msg;
    document.body.appendChild(t);
    setTimeout(() => { if (t && t.parentNode) t.parentNode.removeChild(t); }, 3800);
  }

  // ==========================================================================
  // 6. GENERADORES SVG VECTORIALES LIMPIOS PARA LAS MASCOTAS (CERO ROTOS)
  // ==========================================================================
  function renderPetSVG(speciesId, mood = 'happy', hat = null, glasses = null, neck = null) {
    let eyes = `<circle cx="40" cy="50" r="5" fill="#1e293b"/><circle cx="60" cy="50" r="5" fill="#1e293b"/>`;
    if (mood === 'sleep') {
      eyes = `<path d="M35 52 Q40 56 45 52" stroke="#1e293b" stroke-width="3" fill="none"/><path d="M55 52 Q60 56 65 52" stroke="#1e293b" stroke-width="3" fill="none"/>`;
    } else if (mood === 'hungry') {
      eyes = `<circle cx="40" cy="48" r="6" fill="#1e293b"/><circle cx="41" cy="47" r="2" fill="#fff"/><circle cx="60" cy="48" r="6" fill="#1e293b"/><circle cx="61" cy="47" r="2" fill="#fff"/>`;
    }

    let bodySvg = '';

    if (speciesId === 'crocodile') {
      // Cocodrilo tierno verde
      bodySvg = `
        <ellipse cx="50" cy="58" rx="38" ry="32" fill="#10b981" stroke="#047857" stroke-width="3"/>
        <path d="M22 62 Q50 78 78 62 Q50 68 22 62" fill="#34d399"/>
        <!-- Hocico y dientes simpáticos -->
        <ellipse cx="50" cy="62" rx="22" ry="14" fill="#059669" stroke="#047857" stroke-width="2"/>
        <polygon points="42,66 45,71 48,66" fill="#fff"/>
        <polygon points="52,66 55,71 58,66" fill="#fff"/>
        <!-- Crestas dorsales de cartón -->
        <polygon points="26,32 32,24 38,32" fill="#047857"/>
        <polygon points="44,28 50,20 56,28" fill="#047857"/>
        <polygon points="62,32 68,24 74,32" fill="#047857"/>
        <!-- Coloretes -->
        <ellipse cx="28" cy="60" rx="4" ry="2.5" fill="#f43f5e" opacity="0.6"/>
        <ellipse cx="72" cy="60" rx="4" ry="2.5" fill="#f43f5e" opacity="0.6"/>
      `;
    } else if (speciesId === 'puppy') {
      // Cachorro marrón suave
      bodySvg = `
        <!-- Orejas caídas -->
        <ellipse cx="24" cy="45" rx="8" ry="16" fill="#92400e" stroke="#78350f" stroke-width="2" transform="rotate(-15 24 45)"/>
        <ellipse cx="76" cy="45" rx="8" ry="16" fill="#92400e" stroke="#78350f" stroke-width="2" transform="rotate(15 76 45)"/>
        <ellipse cx="50" cy="56" rx="34" ry="30" fill="#d97706" stroke="#92400e" stroke-width="3"/>
        <!-- Parche en ojo -->
        <ellipse cx="38" cy="48" rx="11" ry="10" fill="#b45309" opacity="0.35"/>
        <ellipse cx="50" cy="64" rx="14" ry="9" fill="#fef3c7"/>
        <ellipse cx="50" cy="61" rx="4" ry="3" fill="#1e293b"/>
        <path d="M50 64 Q50 70 54 70 Q58 70 57 66" stroke="#1e293b" stroke-width="2" fill="none"/>
        <ellipse cx="50" cy="72" rx="3.5" ry="4" fill="#f43f5e"/> <!-- Lengüita -->
      `;
    } else if (speciesId === 'kitten') {
      // Gatito morado/lavanda
      bodySvg = `
        <!-- Orejas puntiagudas -->
        <polygon points="22,40 32,20 42,36" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
        <polygon points="26,38 32,26 38,36" fill="#fbcfe8"/>
        <polygon points="58,36 68,20 78,40" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
        <polygon points="62,36 68,26 74,38" fill="#fbcfe8"/>
        <ellipse cx="50" cy="56" rx="33" ry="28" fill="#a78bfa" stroke="#6d28d9" stroke-width="3"/>
        <polygon points="48,60 52,60 50,63" fill="#f43f5e"/>
        <!-- Bigotes -->
        <line x1="20" y1="58" x2="35" y2="60" stroke="#4c1d95" stroke-width="1.5"/>
        <line x1="20" y1="64" x2="35" y2="63" stroke="#4c1d95" stroke-width="1.5"/>
        <line x1="65" y1="60" x2="80" y2="58" stroke="#4c1d95" stroke-width="1.5"/>
        <line x1="65" y1="63" x2="80" y2="64" stroke="#4c1d95" stroke-width="1.5"/>
      `;
    } else if (speciesId === 'rhinoceros') {
      // Rinoceronte dorado VIP
      bodySvg = `
        <ellipse cx="50" cy="56" rx="36" ry="32" fill="#ca8a04" stroke="#854d0e" stroke-width="3"/>
        <ellipse cx="50" cy="66" rx="18" ry="12" fill="#eab308"/>
        <!-- Cuerno frontal dorado -->
        <polygon points="46,55 50,38 54,55" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
        <circle cx="44" cy="68" r="2" fill="#854d0e"/>
        <circle cx="56" cy="68" r="2" fill="#854d0e"/>
        <ellipse cx="22" cy="40" rx="6" ry="8" fill="#a16207"/>
        <ellipse cx="78" cy="40" rx="6" ry="8" fill="#a16207"/>
      `;
    } else if (speciesId === 'axolotl') {
      // Ajolote rosado VIP
      bodySvg = `
        <!-- Branquias rosadas tipo pluma -->
        <path d="M18 42 Q8 35 15 28 Q24 35 22 45" fill="#f43f5e"/>
        <path d="M15 50 Q4 50 12 45 Q22 48 20 54" fill="#f43f5e"/>
        <path d="M82 42 Q92 35 85 28 Q76 35 78 45" fill="#f43f5e"/>
        <path d="M85 50 Q96 50 88 45 Q78 48 80 54" fill="#f43f5e"/>
        <ellipse cx="50" cy="56" rx="35" ry="30" fill="#fbcfe8" stroke="#db2777" stroke-width="3"/>
        <!-- Sonrisa tierna de ajolote -->
        <path d="M42 64 Q50 72 58 64" stroke="#db2777" stroke-width="2.5" fill="none"/>
        <ellipse cx="32" cy="60" rx="5" ry="3" fill="#f43f5e" opacity="0.6"/>
        <ellipse cx="68" cy="60" rx="5" ry="3" fill="#f43f5e" opacity="0.6"/>
      `;
    } else if (speciesId === 'red_panda') {
      // Panda rojo VIP
      bodySvg = `
        <ellipse cx="26" cy="38" rx="8" ry="10" fill="#fff" stroke="#991b1b" stroke-width="2"/>
        <ellipse cx="74" cy="38" rx="8" ry="10" fill="#fff" stroke="#991b1b" stroke-width="2"/>
        <ellipse cx="50" cy="56" rx="35" ry="30" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
        <!-- Antifaz blanco -->
        <ellipse cx="35" cy="52" rx="10" ry="7" fill="#fff"/>
        <ellipse cx="65" cy="52" rx="10" ry="7" fill="#fff"/>
        <ellipse cx="50" cy="64" rx="12" ry="7" fill="#fff"/>
        <polygon points="48,62 52,62 50,65" fill="#18181b"/>
      `;
    }

    // Accesorios superpuestos
    let accSvg = '';
    if (hat === 'hat_aviator') {
      accSvg += `<path d="M25 36 Q50 18 75 36 L70 42 Q50 30 30 42 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
                 <ellipse cx="38" cy="34" rx="7" ry="5" fill="#38bdf8" stroke="#1e293b" stroke-width="1.5"/>
                 <ellipse cx="62" cy="34" rx="7" ry="5" fill="#38bdf8" stroke="#1e293b" stroke-width="1.5"/>`;
    } else if (hat === 'hat_crown') {
      accSvg += `<polygon points="30,34 35,16 43,26 50,14 57,26 65,16 70,34" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
                 <circle cx="50" cy="14" r="2.5" fill="#ef4444"/>`;
    } else if (hat === 'hat_bow') {
      accSvg += `<polygon points="50,30 38,20 40,36" fill="#f43f5e"/><polygon points="50,30 62,20 60,36" fill="#f43f5e"/><circle cx="50" cy="30" r="3.5" fill="#fb7185"/>`;
    } else if (hat === 'hat_party') {
      accSvg += `<polygon points="40,32 50,8 60,32" fill="#ec4899" stroke="#be185d" stroke-width="1.5"/><circle cx="50" cy="8" r="3" fill="#facc15"/>`;
    }

    if (glasses === 'glasses_cool') {
      accSvg += `<rect x="28" y="44" width="18" height="12" rx="3" fill="#0f172a"/><rect x="54" y="44" width="18" height="12" rx="3" fill="#0f172a"/><line x1="46" y1="50" x2="54" y2="50" stroke="#0f172a" stroke-width="2"/>`;
    } else if (glasses === 'glasses_smart') {
      accSvg += `<circle cx="38" cy="50" r="9" fill="none" stroke="#78350f" stroke-width="2"/><circle cx="62" cy="50" r="9" fill="none" stroke="#78350f" stroke-width="2"/><line x1="47" y1="50" x2="53" y2="50" stroke="#78350f" stroke-width="2"/>`;
    }

    if (neck === 'scarf_winter') {
      accSvg += `<ellipse cx="50" cy="80" rx="26" ry="7" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/><rect x="62" y="80" width="8" height="14" fill="#ef4444"/>`;
    }

    return `
      <svg viewBox="0 0 100 100" class="w-full h-full" style="overflow: visible;">
        ${bodySvg}
        ${eyes}
        ${accSvg}
      </svg>
    `;
  }

  // ==========================================================================
  // 7. MONTAJE DEL DOM PRINCIPAL: VISTA DE SANTUARIO (FULLSCREEN OVERLAY)
  // ==========================================================================
  function ensureSanctuaryDOM() {
    ensureSanctuaryStyles();
    let container = document.getElementById('view-pet-sanctuary');
    if (!container) {
      container = document.createElement('div');
      container.id = 'view-pet-sanctuary';
      container.style.display = 'none';
      document.body.appendChild(container);
    }
    container.style.position = 'fixed';
    container.style.top = '64px';
    container.style.left = '0';
    container.style.right = '0';
    container.style.bottom = '0';
    container.style.width = '100vw';
    container.style.height = 'calc(100vh - 64px)';
    container.style.zIndex = '9500';
    container.style.overflowY = 'auto';
    container.style.overflowX = 'hidden';
    container.style.background = '#2b1d12';
    container.style.paddingTop = '0';
    container.style.boxSizing = 'border-box';
    return container;
  }

  // ==========================================================================
  // 7.1 GESTIÓN DE CAPAS Y SUPRESIÓN DEL CARRUSEL DE PORTALES ARCANOS
  // ==========================================================================
  function hidePortalViewsAndSaveState() {
    if (!Array.isArray(sanctuaryState.hiddenElements)) {
      sanctuaryState.hiddenElements = [];
    }

    // Si ya tenemos guardados los elementos previos, solo reforzamos su ocultamiento
    if (sanctuaryState.hiddenElements.length > 0) {
      sanctuaryState.hiddenElements.forEach(item => {
        if (item && item.element) {
          item.element.style.display = 'none';
          item.element.style.visibility = 'hidden';
          item.element.classList.add('hidden');
        }
      });
      return;
    }

    const sanctuaryView = document.getElementById('view-pet-sanctuary');
    const habitatView = document.getElementById('view-pet-game');
    const targetSet = new Set();

    // Selectores explícitos de portales y carrusel
    const selectors = [
      '#viewHome',
      '#view-home',
      '#portalHub',
      '.portals-section',
      '.arcane-portals-container',
      '.carousel-container',
      '#coverFlowViewport',
      '.coverflow-viewport',
      '.hub-carousel',
      '.carousel-viewport'
    ];

    selectors.forEach(sel => {
      try {
        document.querySelectorAll(sel).forEach(el => {
          if (el && el !== sanctuaryView && el !== habitatView) {
            targetSet.add(el);
          }
        });
      } catch (_) {}
    });

    // Secciones principales activas en el DOM
    try {
      document.querySelectorAll('main > section, .view-section, [data-view]').forEach(el => {
        if (el && el !== sanctuaryView && el !== habitatView) {
          const comp = typeof window !== 'undefined' && typeof window.getComputedStyle === 'function' ? window.getComputedStyle(el) : null;
          const isVisible = comp ? comp.display !== 'none' : el.style.display !== 'none';
          if (isVisible && !el.classList.contains('hidden')) {
            targetSet.add(el);
          }
        }
      });
    } catch (_) {}

    targetSet.forEach(el => {
      sanctuaryState.hiddenElements.push({
        element: el,
        previousDisplay: el.style.display,
        previousVisibility: el.style.visibility,
        hadHiddenClass: el.classList.contains('hidden')
      });
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.classList.add('hidden');
    });
  }

  function restorePortalViewsState() {
    let restoredCount = 0;
    if (Array.isArray(sanctuaryState.hiddenElements) && sanctuaryState.hiddenElements.length > 0) {
      sanctuaryState.hiddenElements.forEach(item => {
        if (item && item.element) {
          item.element.style.display = item.previousDisplay || '';
          item.element.style.visibility = item.previousVisibility || '';
          if (!item.hadHiddenClass) {
            item.element.classList.remove('hidden');
          }
          restoredCount++;
        }
      });
      sanctuaryState.hiddenElements = [];
    }

    // Asegurar visualización del menú de Portales Arcanos si no se restauró nada
    if (restoredCount === 0) {
      const viewHome = document.getElementById('view-home') || document.getElementById('viewHome');
      if (viewHome) {
        viewHome.classList.remove('hidden');
        viewHome.style.display = '';
        viewHome.style.visibility = '';
      }
      const coverFlow = document.getElementById('coverFlowViewport');
      if (coverFlow) {
        coverFlow.classList.remove('hidden');
        coverFlow.style.display = '';
        coverFlow.style.visibility = '';
      }
    }
  }

  // ==========================================================================
  // 8. CONTROL DE ENTRADA: WINDOW.OPENPETSANCTUARY()
  // ==========================================================================
  function openPetSanctuary(petId = null) {
    if (global.hideAllModules) global.hideAllModules();

    // 1. Verificación estricta de login
    if (!isUserLoggedIn()) {
      // Mantener visible el menú de Portales detrás del modal de bloqueo
      const homeEl = document.getElementById('view-home') || document.getElementById('viewHome');
      if (homeEl) {
        homeEl.classList.remove('hidden');
        homeEl.style.setProperty('display', 'flex', 'important');
      }
      renderAuthLockModal();
      return;
    }

    removeFloatingPetButtons();

    // 2. Guardar estado y ocultar cualquier sección residual de fondo
    hidePortalViewsAndSaveState();

    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.add('pet-sanctuary-active');
    }

    // 3. Mostrar ÚNICAMENTE el contenedor de mascotas
    const petRoot = document.getElementById('pet-sanctuary-root');
    if (petRoot) {
      petRoot.classList.remove('hidden');
      petRoot.style.display = 'block';
      petRoot.style.setProperty('display', 'block', 'important');
    }
    const container = ensureSanctuaryDOM();
    container.classList.remove('hidden');
    container.style.setProperty('display', 'flex', 'important');
    container.style.setProperty('visibility', 'visible', 'important');
    container.style.setProperty('pointer-events', 'auto', 'important');
    sanctuaryState.isOpen = true;
    global._activeModule = 'pets';

    if (petId) {
      const pets = loadStoredPets();
      const target = pets.find(p => p.id === petId);
      if (target) {
        openPetRoom(petId);
        return;
      }
    }

    // Por defecto abre el Sanctuary Hub (Selector de sub-portales)
    sanctuaryState.currentView = 'hub';
    renderSanctuaryHub();
  }

  function closePetSanctuary() {
    // Guardia de reentrada: closePetSanctuary -> goToHomePortals -> closePetSanctuary
    // generaba una recursión profunda (hasta desbordar la pila) en cada cambio de portal.
    if (sanctuaryState._isClosing) return;
    sanctuaryState._isClosing = true;
    try {
      closePetSanctuaryInternal();
    } finally {
      sanctuaryState._isClosing = false;
    }
  }

  function closePetSanctuaryInternal() {
    const rootView = document.getElementById('view-pet-sanctuary');
    const wasOpen = Boolean(sanctuaryState.isOpen) || Boolean(
      rootView && !rootView.classList.contains('hidden') && rootView.style.display !== 'none'
    );

    const petSelectors = [
      '#view-pet-sanctuary',
      '#pet-sanctuary-root',
      '#masterpet-sanctuary-view',
      '#view-pet-game',
      '#pet-habitat-view',
      '#pet-engine-root',
      '#pet-engine-modal',
      '#pet-arcade-modal',
      '#masterpet-feed-drawer',
      '#coopGroupModalOverlay',
      '#masterpet-coop-modal',
      '#masterpet-adopt-modal',
      '#masterpet-vip-limit-modal',
      '#masterpet-invite-modal',
      '#masterpet-shop-modal',
      '#masterpet-auth-lock-modal',
      '#petShopModal',
      '#petRenameModal',
      '#petSpeciesModal',
      '#petEggHatchModal',
      '.pet-sanctuary-view',
      '.pet-habitat-view',
      '.pet-sanctuary-overlay',
      '.coop-modal-overlay'
    ];

    petSelectors.forEach(sel => {
      try {
        document.querySelectorAll(sel).forEach(el => {
          if (el) {
            el.classList.add('hidden');
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
            el.style.setProperty('pointer-events', 'none', 'important');
          }
        });
      } catch (_) {}
    });

    sanctuaryState.isOpen = false;
    sanctuaryState.selectedPetId = null;
    sanctuaryState.currentView = null;

    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('pet-sanctuary-active', 'pet-view-active');
    }

    // Limpieza y eliminación de modales dinámicos
    [
      'masterpet-adopt-modal',
      'masterpet-coop-modal',
      'masterpet-vip-limit-modal',
      'masterpet-invite-modal',
      'masterpet-shop-modal',
      'masterpet-auth-lock-modal',
      'petShopModal',
      'petRenameModal',
      'petSpeciesModal',
      'petEggHatchModal',
      'coopGroupModalOverlay'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    // Detener y cerrar el motor 2D si está activo
    if (global.PetEngine2D && typeof global.PetEngine2D.closeView === 'function') {
      try { global.PetEngine2D.closeView(); } catch (_) {}
    }

    removeFloatingPetButtons();

    if (global._activeModule === 'pets') global._activeModule = null;

    // Si el santuario no estaba abierto (p. ej. limpieza preventiva al abrir otro portal),
    // no restauramos el Hub ni redirigimos: evita que #view-home reaparezca debajo del
    // portal que se está abriendo y ahorra trabajo de layout innecesario.
    if (!wasOpen) return;

    // Restaurar con precisión el estado de visualización previo del carrusel de Portales Arcanos
    restorePortalViewsState();

    const portalSelectors = [
      '#view-home',
      '#viewHome',
      '#portalHub',
      '.portals-section',
      '#coverFlowViewport',
      '.coverflow-viewport',
      '.hub-carousel',
      '.carousel-viewport',
      '#portalStarsCanvas'
    ];
    portalSelectors.forEach(sel => {
      try {
        document.querySelectorAll(sel).forEach(el => {
          if (el) {
            el.classList.remove('hidden');
            el.style.removeProperty('display');
            el.style.removeProperty('visibility');
            el.style.removeProperty('pointer-events');
          }
        });
      } catch (_) {}
    });

    const viewHome = document.getElementById('view-home') || document.getElementById('viewHome');
    if (viewHome) {
      viewHome.classList.remove('hidden');
      viewHome.style.setProperty('display', 'flex', 'important');
      viewHome.style.setProperty('visibility', 'visible', 'important');
      viewHome.style.setProperty('pointer-events', 'auto', 'important');
      viewHome.style.setProperty('opacity', '1', 'important');
    }

    // Restaurar flujo hacia el menú principal de Portales Arcanos si no se está ejecutando ya returnToMainPortals
    if (!global._isReturningToPortals) {
      if (typeof global.goToHomePortals === 'function') {
        try { global.goToHomePortals(); } catch (e) { console.warn(e); }
      } else if (typeof global.returnToMainPortals === 'function') {
        try { global.returnToMainPortals(); } catch (e) { console.warn(e); }
      } else if (typeof global.navigateTo === 'function') {
        try { global.navigateTo('hub'); } catch (e) { console.warn(e); }
      } else if (typeof global.showView === 'function') {
        try { global.showView('view-home'); } catch (e) { console.warn(e); }
      }
    }
  }

  function renderAuthLockModal() {
    ensureSanctuaryStyles();
    let modal = document.getElementById('masterpet-auth-lock-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'masterpet-auth-lock-modal';
    modal.style.cssText = `
      position: fixed; inset: 0; z-index: 10010;
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; padding: 16px;
    `;

    modal.innerHTML = `
      <div class="paper-cardboard-panel paper-stitches max-w-md w-full p-6 text-center animate-bounce-short">
        <div class="text-6xl mb-3">🔒🐾</div>
        <h2 class="text-2xl font-black text-[#78350f] mb-2">Portal MasterPet Protegido</h2>
        <p class="text-sm text-[#451a03] mb-6 font-medium leading-relaxed">
          Para adoptar a tu <strong>Casimerito</strong>, criar mascotas en tiempo real con tu pareja o amigos y guardar todo su crecimiento biológico en la nube, necesitas identificarte con tu cuenta de MasterENG.
        </p>
        <div class="flex flex-col gap-3">
          <button type="button" id="petAuthLoginBtn" class="paper-btn-primary py-3 px-6 text-base">
            🚀 Iniciar Sesión / Registrarme
          </button>
          <button type="button" id="petAuthCloseBtn" class="paper-btn-secondary py-2.5 px-4 text-sm">
            Cerrar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const loginBtn = document.getElementById('petAuthLoginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        modal.remove();
        if (typeof global.openAuthModal === 'function') {
          global.openAuthModal('login');
        } else {
          const btnGoogle = document.getElementById('btn-google-custom');
          if (btnGoogle) btnGoogle.click();
        }
      });
    }

    const closeBtn = document.getElementById('petAuthCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.remove();
      });
    }
  }

  // ==========================================================================
  // 9. SUB-PORTALES: SANCTUARY HUB (SELECTOR MULTI-MASCOTA)
  // ==========================================================================
  function renderSanctuaryHub() {
    sanctuaryState.currentView = 'hub';
    hidePortalViewsAndSaveState();
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.add('pet-sanctuary-active');
    }
    const container = ensureSanctuaryDOM();
    container.classList.remove('hidden');
    container.style.display = 'flex';
    sanctuaryState.isOpen = true;
    const pets = loadStoredPets();
    const coins = getStoredCoins();
    const user = getCurrentUserMeta();
    const userIsVip = isUserVip();
    const slotBadge = userIsVip ? `Mascotas: ${pets.length} (Ilimitadas VIP)` : `Mascotas: ${pets.length}/1 Free`;

    const filteredPets = pets.filter(p => {
      if (sanctuaryState.activeTab === 'mine') return !p.isShared;
      if (sanctuaryState.activeTab === 'shared') return p.isShared;
      return true;
    });

    container.innerHTML = `
      <!-- BARRA DE NAVEGACIÓN SUPERIOR FIJA DEL SANTUARIO -->
      <header class="w-full bg-[#1e130c]/95 backdrop-blur-md border-b-4 border-[#b45309] px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl sticky top-0 z-40">
        <!-- IZQUIERDA: BOTÓN VOLVER A PORTALES -->
        <div class="flex items-center gap-3">
          <button type="button" onclick="window.closePetSanctuary()" class="paper-btn-secondary px-3.5 py-2 text-xs font-black flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition cursor-pointer" title="Regresar al Menú de Portales Arcanos">
            <span class="text-sm">⬅</span>
            <span>Volver a Portales</span>
          </button>
        </div>

        <!-- CENTRO: TÍTULO Y CONTADOR DE RANURAS -->
        <div class="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🐾</span>
            <h1 class="text-base sm:text-lg font-black text-amber-300 tracking-wide">
              MasterPet Sanctuary
            </h1>
          </div>
          <span class="text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-sm ${userIsVip ? 'bg-amber-500/20 text-amber-300 border-amber-400' : 'bg-emerald-500/20 text-emerald-300 border-emerald-400'}">
            ${slotBadge}
          </span>
        </div>

        <!-- DERECHA: BOTONES DE ACCIÓN RÁPIDA Y MONEDAS -->
        <div class="flex items-center gap-2 flex-wrap justify-end">
          <div class="bg-[#2d1b10] border-2 border-amber-500/50 rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-inner" title="Monedas del Santuario">
            <span class="text-sm">🪙</span>
            <span class="text-xs font-black text-amber-400" id="petHubCoinsDisplay">${coins}</span>
          </div>

          <button type="button" onclick="window.openPetAdoptModal()" class="paper-btn-primary px-3 py-1.5 text-xs font-black flex items-center gap-1.5 shadow active:scale-95 transition" title="Adoptar un nuevo Casimerito">
            <span>➕</span>
            <span class="hidden md:inline">Adoptar Mascota</span>
            <span class="md:hidden">Adoptar</span>
          </button>

          <button type="button" onclick="window.openPetCoopModal()" class="paper-btn-secondary px-3 py-1.5 text-xs font-black flex items-center gap-1.5 shadow active:scale-95 transition" title="Crear o unirse a grupo Co-Parenting">
            <span>🤝</span>
            <span class="hidden lg:inline">Crear / Unirse Co-Op</span>
            <span class="lg:hidden">Co-Op</span>
          </button>

          <button type="button" onclick="window.openPetInviteModal()" class="paper-btn-secondary px-3 py-1.5 text-xs font-black flex items-center gap-1.5 shadow active:scale-95 transition" title="Invitar amigos al Santuario">
            <span>👥</span>
            <span class="hidden lg:inline">Invitar Amigos</span>
            <span class="lg:hidden">Invitar</span>
          </button>
        </div>
      </header>

      <!-- CONTENEDOR CENTRAL ESTILO TEATRO -->
      <main class="max-w-6xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col gap-6">
        ${pets.length === 0 ? `
          <!-- BIENVENIDA ESTILO PAPERCRAFT (0 MASCOTAS POR DEFECTO) -->
          <div class="paper-cardboard-panel paper-stitches max-w-2xl w-full mx-auto my-6 p-8 text-center animate-bounce-short border-4 border-amber-600 shadow-2xl">
            <div class="w-24 h-24 mx-auto mb-4 rounded-3xl bg-amber-400/30 border-3 border-amber-600 flex items-center justify-center text-6xl shadow-inner">
              🐣🎪
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-[#78350f] mb-2">
              ¡Bienvenido a MasterPet Sanctuary!
            </h2>
            <p class="text-sm sm:text-base text-[#451a03] font-semibold max-w-lg mx-auto mb-6 leading-relaxed">
              Aún no tienes ningún <strong>Casimerito</strong> en adopción. ¡Comienza criando tu primera mascota o únete a una sala co-op con amigos!
            </p>

            <div class="flex flex-col sm:flex-row gap-3.5 justify-center items-center max-w-md mx-auto mb-6">
              <button type="button" onclick="window.openPetAdoptModal()" class="paper-btn-primary w-full sm:w-auto py-3.5 px-6 text-sm font-black flex items-center justify-center gap-2 shadow-lg hover:scale-102 active:scale-95 transition">
                <span class="text-lg">➕</span>
                <span>Adoptar mi Primer Casimerito (Bebé)</span>
              </button>
              <button type="button" onclick="window.openPetCoopModal()" class="paper-btn-secondary w-full sm:w-auto py-3.5 px-6 text-sm font-black flex items-center justify-center gap-2 shadow hover:scale-102 active:scale-95 transition">
                <span class="text-lg">🤝</span>
                <span>Unirme con Código de Amigo / Grupo</span>
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left bg-amber-100/70 p-4 rounded-2xl border border-amber-300">
              <div class="flex items-center gap-2.5">
                <span class="text-2xl">🍖</span>
                <div class="text-xs">
                  <strong class="text-amber-950 block">Tiempo Real</strong>
                  <span class="text-amber-800">Crecen en días reales.</span>
                </div>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="text-2xl">🎓</span>
                <div class="text-xs">
                  <strong class="text-amber-950 block">Aprende Inglés</strong>
                  <span class="text-amber-800">Minijuegos y vocabulario.</span>
                </div>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="text-2xl">👥</span>
                <div class="text-xs">
                  <strong class="text-amber-950 block">Co-Parenting</strong>
                  <span class="text-amber-800">Cría mascotas en pareja.</span>
                </div>
              </div>
            </div>
          </div>
        ` : `
          <!-- BANNER DE BIENVENIDA Y ACCIONES RÁPIDAS -->
          <div class="paper-cardboard-panel p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-amber-400/30 border-2 border-amber-600 flex items-center justify-center text-4xl shadow-inner">
                🎪
              </div>
              <div>
                <h2 class="text-xl font-black text-[#78350f]">Bienvenido, ${user.name || 'Cuidador'}</h2>
                <p class="text-xs sm:text-sm text-[#451a03] font-medium max-w-xl">
                  Tus mascotas crecen en <strong>días reales</strong>. Aliméntalas, báñalas con jabón burbujeante y practica inglés en minijuegos para hacerlas evolucionar hasta la etapa <strong>Master Adult</strong>.
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">
              <button type="button" onclick="window.openPetAdoptModal()" class="paper-btn-primary py-2.5 px-4 text-sm flex-1 md:flex-initial flex items-center justify-center gap-2">
                <span>✨</span>
                <span>+ Adoptar Mascota</span>
              </button>
              <button type="button" onclick="window.openPetCoopModal()" class="paper-btn-secondary py-2.5 px-4 text-sm flex-1 md:flex-initial flex items-center justify-center gap-2">
                <span>🤝</span>
                <span>Vincular Co-Op</span>
              </button>
            </div>
          </div>

          <!-- FILTROS DE PESTAÑAS (TODAS / INDIVIDUALES / COMPARTIDAS) -->
          <div class="flex items-center justify-between border-b-2 border-amber-900/60 pb-2">
            <div class="flex items-center gap-2">
              <button type="button" onclick="window.setPetHubTab('all')" class="px-4 py-1.5 rounded-xl font-extrabold text-xs transition ${sanctuaryState.activeTab === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-[#3e271d] text-amber-200/80 hover:bg-[#4d3226]'}">
                🎪 Todas (${pets.length})
              </button>
              <button type="button" onclick="window.setPetHubTab('mine')" class="px-4 py-1.5 rounded-xl font-extrabold text-xs transition ${sanctuaryState.activeTab === 'mine' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-[#3e271d] text-amber-200/80 hover:bg-[#4d3226]'}">
                👤 Mis Mascotas (${pets.filter(p => !p.isShared).length})
              </button>
              <button type="button" onclick="window.setPetHubTab('shared')" class="px-4 py-1.5 rounded-xl font-extrabold text-xs transition ${sanctuaryState.activeTab === 'shared' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-[#3e271d] text-amber-200/80 hover:bg-[#4d3226]'}">
                🤝 Compartidas Co-Op (${pets.filter(p => p.isShared).length})
              </button>
            </div>

            <span class="text-xs text-amber-300/80 font-bold hidden sm:inline">
              Hora Real del Santuario: ${new Date().toLocaleDateString()}
            </span>
          </div>

          <!-- REJILLA DE TARJETAS SUB-PORTALES (TEATRO DE CARTÓN) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filteredPets.map(renderPetHubCard).join('')}

            <!-- TARJETA VACÍA PARA ADOPTAR NUEVA -->
            <div onclick="window.openPetAdoptModal()" class="paper-pet-stage-card border-dashed border-4 border-amber-600/70 p-6 flex flex-col items-center justify-center text-center min-h-[320px] bg-amber-950/20 hover:bg-amber-950/40 cursor-pointer">
              <div class="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center text-3xl mb-3 shadow">
                +
              </div>
              <h3 class="text-lg font-black text-amber-400 mb-1">Adoptar Nuevo Casimerito</h3>
              <p class="text-xs text-amber-200/70 max-w-xs mb-4">
                ${!userIsVip && pets.length >= 1 ? 'Límite Free alcanzado (1/1). Desbloquea VIP para más espacios.' : 'Elige entre Cocodrilos, Cachorros, Gatitos o especies místicas VIP de Season Pass.'}
              </p>
              <span class="paper-btn-primary py-2 px-4 text-xs font-black">
                ${!userIsVip && pets.length >= 1 ? '⭐ Desbloquear VIP' : 'Explorar Catálogo'}
              </span>
            </div>
          </div>
        `}
      </main>
    `;
  }

  function renderPetHubCard(pet) {
    const spec = PET_SPECIES[pet.speciesId] || PET_SPECIES.puppy;
    const isShared = Boolean(pet.isShared);
    const recentActivity = pet.activityLog && pet.activityLog.length > 0 ? pet.activityLog[0].text : 'Tranquilo en su hábitat.';

    return `
      <div class="paper-pet-stage-card p-5 flex flex-col justify-between" onclick="window.openPetRoom('${pet.id}')">
        <div>
          <!-- CABECERA DE LA TARJETA -->
          <div class="flex items-start justify-between gap-2 mb-3">
            <div>
              <div class="flex items-center gap-1.5 mb-1">
                <span class="text-base">${spec.icon}</span>
                <h3 class="text-lg font-black text-[#78350f]">${pet.name}</h3>
              </div>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                ${spec.habitatName}
              </span>
            </div>

            <div class="flex flex-col items-end gap-1">
              <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isShared ? 'bg-emerald-100 text-emerald-800 border border-emerald-400' : 'bg-slate-100 text-slate-800 border border-slate-300'}">
                ${isShared ? '🤝 Shared Pet' : '👤 Individual'}
              </span>
              <span class="text-[10px] font-bold text-amber-900">
                Nivel ${pet.level || 1}
              </span>
            </div>
          </div>

          <!-- ESCENARIO 2D Y AVATAR DE CARTÓN -->
          <div class="relative w-full h-36 rounded-xl overflow-hidden mb-3 border-2 border-[#b45309] flex items-center justify-center shadow-inner" style="background: ${spec.theme.bg};">
            <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: radial-gradient(#fff 15%, transparent 16%); background-size: 16px 16px;"></div>
            
            <div class="w-24 h-24 pet-idle-anim relative z-10">
              ${renderPetSVG(pet.speciesId, pet.isSleeping ? 'sleep' : (pet.hunger < 35 ? 'hungry' : 'happy'), pet.hat, pet.glasses, pet.neck)}
            </div>

            <!-- CHIP DE EDAD REAL -->
            <div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-amber-200 font-bold border border-white/20">
              📅 ${pet.daysOld} días reales
            </div>

            <!-- CHIP DE ETAPA -->
            <div class="absolute top-2 right-2 bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] shadow">
              ${pet.stageBadge || '🐣 Baby'}
            </div>
          </div>

          <!-- BARRAS RESUMIDAS DE ESTADO -->
          <div class="grid grid-cols-2 gap-2 mb-3">
            <div>
              <div class="flex justify-between text-[11px] font-bold text-[#451a03] mb-0.5">
                <span>🍖 Hambre</span>
                <span>${pet.hunger}%</span>
              </div>
              <div class="pet-meter-bar">
                <div class="pet-meter-fill bg-orange-500" style="width: ${pet.hunger}%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] font-bold text-[#451a03] mb-0.5">
                <span>🧼 Higiene</span>
                <span>${pet.hygiene}%</span>
              </div>
              <div class="pet-meter-bar">
                <div class="pet-meter-fill bg-sky-500" style="width: ${pet.hygiene}%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] font-bold text-[#451a03] mb-0.5">
                <span>⚡ Energía</span>
                <span>${pet.energy}%</span>
              </div>
              <div class="pet-meter-bar">
                <div class="pet-meter-fill bg-amber-500" style="width: ${pet.energy}%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] font-bold text-[#451a03] mb-0.5">
                <span>❤️ Felicidad</span>
                <span>${pet.happiness}%</span>
              </div>
              <div class="pet-meter-bar">
                <div class="pet-meter-fill bg-rose-500" style="width: ${pet.happiness}%;"></div>
              </div>
            </div>
          </div>

          <!-- REGISTRO RECIENTE CO-OP SI ES COMPARTIDA -->
          ${isShared ? `
            <div class="bg-amber-100/70 border border-amber-300 rounded-lg p-2 text-[11px] text-amber-950 mb-3 flex items-start gap-1.5">
              <span class="text-xs">📜</span>
              <p class="leading-tight font-medium truncate">${recentActivity}</p>
            </div>
          ` : ''}
        </div>

        <button type="button" class="paper-btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 mt-2">
          <span>🚪</span>
          <span>Entrar al Hábitat / Cuidar y Jugar</span>
        </button>
      </div>
    `;
  }

  // ==========================================================================
  // 10. HABITACIÓN INTERACTIVA (ROOM VIEW: ALIMENTAR, BAÑAR, JUGAR, DORMIR)
  // ==========================================================================
  function openPetRoom(petId) {
    const pets = loadStoredPets();
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;

    sanctuaryState.selectedPetId = petId;
    sanctuaryState.currentView = 'room';
    renderPetRoom(pet);
  }

  function renderPetRoom(pet) {
    hidePortalViewsAndSaveState();
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.add('pet-sanctuary-active');
    }
    const container = ensureSanctuaryDOM();
    container.classList.remove('hidden');
    container.style.display = 'flex';
    sanctuaryState.isOpen = true;
    const spec = PET_SPECIES[pet.speciesId] || PET_SPECIES.puppy;
    const coins = getStoredCoins();

    container.innerHTML = `
      <!-- BARRA SUPERIOR FIJA DE LA HABITACIÓN -->
      <header class="w-full bg-[#1e130c]/95 backdrop-blur-md border-b-4 border-[#b45309] px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl sticky top-0 z-40">
        <!-- IZQUIERDA: BOTONES VOLVER A PORTALES Y HUB -->
        <div class="flex items-center gap-2">
          <button type="button" onclick="window.closePetSanctuary()" class="paper-btn-secondary px-3 py-1.5 text-xs font-black flex items-center gap-1 shadow hover:scale-105 active:scale-95 transition cursor-pointer" title="Regresar al Menú de Portales Arcanos">
            <span>⬅</span>
            <span>Volver a Portales</span>
          </button>
          <button type="button" onclick="window.renderSanctuaryHub()" class="paper-btn-secondary px-3 py-1.5 text-xs font-black flex items-center gap-1 shadow hover:scale-105 active:scale-95 transition cursor-pointer" title="Volver a la selección de mascotas">
            <span>🏠</span>
            <span class="hidden sm:inline">Hub</span>
          </button>
        </div>

        <!-- CENTRO: NOMBRE DE LA MASCOTA Y ESTADO -->
        <div class="flex items-center gap-2 text-center">
          <span class="text-xl">${spec.icon}</span>
          <h2 class="text-base sm:text-lg font-black text-amber-300">
            ${pet.name}
          </h2>
          <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            ${pet.stageBadge || '🐣 Baby'}
          </span>
          <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${isUserVip() ? 'bg-amber-500/20 text-amber-300 border-amber-400' : 'bg-emerald-500/20 text-emerald-300 border-emerald-400'}">
            ${isUserVip() ? `Mascotas: ${loadStoredPets().length} (VIP)` : `Mascotas: ${loadStoredPets().length}/1 Free`}
          </span>
        </div>

        <!-- DERECHA: MONEDAS, TIENDA E INVITAR -->
        <div class="flex items-center gap-2">
          <div class="bg-[#2d1b10] border-2 border-amber-500/50 rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-inner" title="Monedas del Santuario">
            <span class="text-sm">🪙</span>
            <span class="text-xs font-black text-amber-400" id="roomCoinDisplay">${coins}</span>
          </div>

          <button type="button" onclick="window.openPetShopModal()" class="paper-btn-primary px-3 py-1.5 text-xs font-black flex items-center gap-1 shadow active:scale-95 transition">
            <span>🛍️</span>
            <span>Boutique</span>
          </button>

          <button type="button" onclick="window.openPetInviteModal()" class="paper-btn-secondary px-2.5 py-1.5 text-xs font-black flex items-center gap-1 shadow active:scale-95 transition" title="Invitar amigos al Santuario">
            <span>👥</span>
          </button>
        </div>
      </header>

      <!-- ÁREA DE JUEGO PRINCIPAL -->
      <main class="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col justify-between items-center gap-4">
        <!-- VITALES SUPERIORES -->
        <div class="w-full paper-cardboard-panel p-3 grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <span class="font-bold">🍖 Hambre</span>
            <div class="pet-meter-bar mt-1">
              <div class="pet-meter-fill bg-orange-500" style="width: ${pet.hunger}%;"></div>
            </div>
            <span class="font-extrabold text-[11px] text-amber-900">${pet.hunger}%</span>
          </div>
          <div>
            <span class="font-bold">🧼 Higiene</span>
            <div class="pet-meter-bar mt-1">
              <div class="pet-meter-fill bg-sky-500" style="width: ${pet.hygiene}%;"></div>
            </div>
            <span class="font-extrabold text-[11px] text-amber-900">${pet.hygiene}%</span>
          </div>
          <div>
            <span class="font-bold">⚡ Energía</span>
            <div class="pet-meter-bar mt-1">
              <div class="pet-meter-fill bg-amber-500" style="width: ${pet.energy}%;"></div>
            </div>
            <span class="font-extrabold text-[11px] text-amber-900">${pet.energy}%</span>
          </div>
          <div>
            <span class="font-bold">❤️ Felicidad</span>
            <div class="pet-meter-bar mt-1">
              <div class="pet-meter-fill bg-rose-500" style="width: ${pet.happiness}%;"></div>
            </div>
            <span class="font-extrabold text-[11px] text-amber-900">${pet.happiness}%</span>
          </div>
        </div>

        <!-- ESCENARIO DEL HÁBITAT CON MASCOTA INTERACTIVA -->
        <div id="petRoomStage" class="relative w-full flex-1 min-h-[340px] max-h-[460px] rounded-3xl border-4 border-[#b45309] shadow-2xl overflow-hidden flex flex-col items-center justify-center transition-all duration-500" style="background: ${pet.isSleeping ? '#0f172a' : spec.theme.bg};">
          <!-- Cielo / Fondo temático -->
          <div class="absolute inset-0 pointer-events-none opacity-25" style="background-image: radial-gradient(#fff 15%, transparent 16%); background-size: 20px 20px;"></div>

          <!-- Lámpara interactiva en esquina -->
          <button type="button" onclick="window.togglePetSleep('${pet.id}')" class="absolute top-4 right-4 bg-amber-900/60 hover:bg-amber-800 border-2 border-amber-500 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-200 flex items-center gap-1.5 z-20 shadow cursor-pointer">
            <span>${pet.isSleeping ? '💡 Encender Luz' : '🌙 Apagar Luz / Dormir'}</span>
          </button>

          <!-- Banner de Hábitat -->
          <div class="absolute top-4 left-4 bg-black/40 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-xl text-xs font-bold text-white z-20">
            🏞️ ${spec.habitatName}
          </div>

          <!-- Contenedor central de la mascota -->
          <div id="petAvatarHolder" onclick="window.petTickle('${pet.id}')" class="w-44 h-44 sm:w-56 sm:h-56 ${pet.isSleeping ? '' : 'pet-idle-anim'} cursor-pointer relative z-10 transition-transform active:scale-90" title="¡Haz clic para acariciar a ${pet.name}!">
            ${renderPetSVG(pet.speciesId, pet.isSleeping ? 'sleep' : (pet.hunger < 35 ? 'hungry' : 'happy'), pet.hat, pet.glasses, pet.neck)}
          </div>

          <!-- Globo de sueño o diálogo -->
          ${pet.isSleeping ? `
            <div class="absolute z-20 text-3xl font-black text-sky-200 animate-pulse" style="top: 25%; left: 60%;">
              Zzz...
            </div>
          ` : ''}

          <!-- Suelo de cartón del hábitat -->
          <div class="absolute bottom-0 inset-x-0 h-16 bg-[#2d1b10]/80 border-t-4 border-[#b45309]/80 flex items-center justify-center">
            <span class="text-xs font-extrabold text-amber-300/60 uppercase tracking-widest">
              Papercraft Stage • Tap to pet
            </span>
          </div>
        </div>

        <!-- BARRA INFERIOR DE 4 ACCIONES ESTILO POU / CASIMERITO -->
        <div class="w-full paper-cardboard-panel p-3 flex items-center justify-around gap-2">
          <!-- 1. ALIMENTAR -->
          <button type="button" onclick="window.openPetFeedDrawer('${pet.id}')" class="paper-btn-primary flex-1 py-3 flex flex-col items-center justify-center gap-1">
            <span class="text-2xl">🍕</span>
            <span class="text-xs font-extrabold">Alimentar</span>
          </button>

          <!-- 2. BAÑAR -->
          <button type="button" onclick="window.petTakeBath('${pet.id}')" class="paper-btn-primary flex-1 py-3 flex flex-col items-center justify-center gap-1" style="background: linear-gradient(to bottom, #38bdf8, #0284c7); border-color: #0369a1;">
            <span class="text-2xl">🧼</span>
            <span class="text-xs font-extrabold">Bañar</span>
          </button>

          <!-- 3. JUGAR / MINIJUEGO VOCABULARIO -->
          <button type="button" onclick="window.openPetMinigame('${pet.id}')" class="paper-btn-primary flex-1 py-3 flex flex-col items-center justify-center gap-1" style="background: linear-gradient(to bottom, #a855f7, #7e22ce); border-color: #581c87;">
            <span class="text-2xl">🎮</span>
            <span class="text-xs font-extrabold">Jugar</span>
          </button>

          <!-- 4. DORMIR / DESPERTAR -->
          <button type="button" onclick="window.togglePetSleep('${pet.id}')" class="paper-btn-primary flex-1 py-3 flex flex-col items-center justify-center gap-1" style="background: linear-gradient(to bottom, #64748b, #334155); border-color: #1e293b;">
            <span class="text-2xl">${pet.isSleeping ? '☀️' : '💤'}</span>
            <span class="text-xs font-extrabold">${pet.isSleeping ? 'Despertar' : 'Dormir'}</span>
          </button>
        </div>
      </main>
    `;
  }

  // ==========================================================================
  // 11. ACCIONES DE CUIDADO INTERACTIVAS CON PRONUNCIACIÓN DE VOCABULARIO
  // ==========================================================================

  // Pronunciar texto en inglés con Web Speech API
  function speakEnglishVocab(text) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      } catch (_) {}
    }
  }

  // Caricias / Cosquillas
  global.petTickle = function (petId) {
    const pets = loadStoredPets();
    const pet = pets.find(p => p.id === petId);
    if (!pet || pet.isSleeping) return;

    pet.happiness = Math.min(100, (pet.happiness || 80) + 6);
    pet.lastPlayedAt = Date.now();
    saveStoredPets(pets);

    speakEnglishVocab('Good pet! You are so sweet and happy!');
    showPetPaperToast(`❤️ ¡${pet.name} se siente muy amado! (+6 Felicidad)`);

    const holder = document.getElementById('petAvatarHolder');
    if (holder) {
      holder.classList.add('animate-bounce');
      setTimeout(() => holder.classList.remove('animate-bounce'), 800);
    }
    renderPetRoom(pet);
  };

  // Gaveta de Alimentación
  global.openPetFeedDrawer = function (petId) {
    const pets = loadStoredPets();
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;

    let drawer = document.getElementById('masterpet-feed-drawer');
    if (drawer) drawer.remove();

    drawer = document.createElement('div');
    drawer.id = 'masterpet-feed-drawer';
    drawer.style.cssText = `
      position: fixed; inset: 0; z-index: 10006;
      background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px);
      display: flex; align-items: flex-end; justify-content: center;
    `;

    drawer.innerHTML = `
      <div class="paper-cardboard-panel max-w-2xl w-full p-5 rounded-b-none border-b-0 animate-slide-up">
        <div class="flex items-center justify-between mb-3 border-b-2 border-amber-900/40 pb-2">
          <div>
            <h3 class="text-base font-black text-[#78350f]">Selecciona un Alimento Saludable</h3>
            <p class="text-xs text-[#451a03]">Cada bocado enseña y pronuncia vocabulario real en inglés.</p>
          </div>
          <button type="button" onclick="document.getElementById('masterpet-feed-drawer').remove()" class="paper-btn-secondary px-3 py-1 text-xs">
            Cerrar
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
          ${PET_FOODS.map(f => `
            <div onclick="window.feedPetWithFood('${pet.id}', '${f.id}')" class="bg-amber-100/80 hover:bg-amber-200 border-2 border-amber-600 rounded-xl p-3 text-center cursor-pointer transition transform hover:scale-105 active:scale-95 shadow">
              <span class="text-4xl block mb-1">${f.icon}</span>
              <h4 class="text-xs font-black text-amber-950">${f.name}</h4>
              <p class="text-[10px] text-amber-800 font-semibold mb-1">${f.es}</p>
              <div class="flex items-center justify-center gap-1 text-[11px] font-extrabold text-amber-900">
                <span>🪙 ${f.cost}</span>
                <span class="text-emerald-700">+${f.hunger} 🍖</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(drawer);
  };

  global.feedPetWithFood = function (petId, foodId) {
    const pets = loadStoredPets();
    const pet = pets.find(p => p.id === petId);
    const food = PET_FOODS.find(f => f.id === foodId);
    if (!pet || !food) return;

    const coins = getStoredCoins();
    if (coins < food.cost) {
      showPetPaperToast(`🪙 No tienes suficientes monedas para comprar ${food.name}. ¡Juega al minijuego de inglés!`);
      return;
    }

    addStoredCoins(-food.cost);
    pet.hunger = Math.min(100, (pet.hunger || 50) + food.hunger);
    pet.exp = (pet.exp || 0) + food.exp;
    pet.lastFedAt = Date.now();

    // Comprobar subida de nivel
    checkPetLevelUp(pet);

    // Registro de actividad Co-Op
    const logEntry = {
      text: `Alimentaste a ${pet.name} con ${food.name} (+${food.exp} EXP)`,
      time: Date.now()
    };
    pet.activityLog = pet.activityLog || [];
    pet.activityLog.unshift(logEntry);
    saveStoredPets(pets);

    // Emitir mensaje por BroadcastChannel si es compartida
    if (pet.isShared && sanctuaryState.coopChannel) {
      sanctuaryState.coopChannel.postMessage({
        type: 'COOP_ACTION',
        petId: pet.id,
        hunger: pet.hunger,
        exp: pet.exp,
        level: pet.level,
        logEntry: {
          text: `Tu compañero alimentó a ${pet.name} con ${food.name} (+${food.exp} EXP)`,
          time: Date.now()
        }
      });
    }

    // Pronunciación de vocabulario educativo
    speakEnglishVocab(`${food.name}. ${food.vocab}`);
    showPetPaperToast(`🍽️ ¡${pet.name} disfrutó su ${food.name}! (+${food.hunger}% Hambre, +${food.exp} EXP)`);

    const drawer = document.getElementById('masterpet-feed-drawer');
    if (drawer) drawer.remove();

    renderPetRoom(pet);
  };

  // Baño con Jabón y Espuma
  global.petTakeBath = function (petId) {
    const pets = loadStoredPets();
    const pet = pets.find(p => p.id === petId);
    if (!pet || pet.isSleeping) return;

    pet.hygiene = 100;
    pet.exp = (pet.exp || 0) + 12;
    pet.lastCleanedAt = Date.now();
    checkPetLevelUp(pet);

    const logEntry = {
      text: `Bañaste a ${pet.name} con jabón burbujeante (+12 EXP)`,
      time: Date.now()
    };
    pet.activityLog = pet.activityLog || [];
    pet.activityLog.unshift(logEntry);
    saveStoredPets(pets);

    if (pet.isShared && sanctuaryState.coopChannel) {
      sanctuaryState.coopChannel.postMessage({
        type: 'COOP_ACTION',
        petId: pet.id,
        hygiene: 100,
        exp: pet.exp,
        level: pet.level,
        logEntry: {
          text: `Tu compañero bañó a ${pet.name} dejándolo reluciente (+12 EXP)`,
          time: Date.now()
        }
      });
    }

    speakEnglishVocab('Rub with soapy bubbles to make your sweet pet clean!');
    showPetPaperToast(`🧼 ¡${pet.name} quedó reluciente y oliendo a lavanda! (Higiene: 100%, +12 EXP)`);
    renderPetRoom(pet);
  };

  // Modo Sueño / Despertar
  global.togglePetSleep = function (petId) {
    const pets = loadStoredPets();
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;

    pet.isSleeping = !pet.isSleeping;
    if (pet.isSleeping) {
      pet.sleepStartedAt = Date.now();
      speakEnglishVocab('Good night! Rest well and regain your energy.');
      showPetPaperToast(`🌙 ¡Buenas noches! ${pet.name} se fue a dormir.`);
    } else {
      pet.energy = 100;
      pet.lastSleptAt = Date.now();
      speakEnglishVocab('Good morning! Energy fully restored.');
      showPetPaperToast(`☀️ ¡Buenos días! ${pet.name} despertó con energía al 100%.`);
    }

    saveStoredPets(pets);
    renderPetRoom(pet);
  };

  function checkPetLevelUp(pet) {
    const needed = (pet.level || 1) * 50;
    if (pet.exp >= needed) {
      pet.level = (pet.level || 1) + 1;
      pet.exp = pet.exp - needed;
      addStoredCoins(30);
      showPetPaperToast(`🎉 ¡FELICIDADES! ${pet.name} subió al Nivel ${pet.level} (+30 Monedas 🪙)`);
      speakEnglishVocab(`Level up! ${pet.name} reached level ${pet.level}!`);
    }
  }

  // ==========================================================================
  // 12. MINIJUEGO DE VOCABULARIO EN INGLÉS (PAPER BALLOONS POP)
  // ==========================================================================
  global.openPetMinigame = function (petId) {
    if (typeof window !== 'undefined' && typeof window.openPetArcadeModal === 'function') {
      const pets = loadStoredPets();
      const pet = pets.find(p => p.id === petId);
      window.openPetArcadeModal(pet || { id: petId });
      return;
    }
    const pets = loadStoredPets();
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;

    sanctuaryState.minigameState = {
      petId: petId,
      score: 0,
      round: 0,
      maxRounds: 5,
      currentCard: null
    };

    renderMinigameModal();
  };

  function renderMinigameModal() {
    ensureSanctuaryStyles();
    let modal = document.getElementById('masterpet-minigame-modal');
    if (modal) modal.remove();

    const state = sanctuaryState.minigameState;
    if (!state) return;

    if (state.round >= state.maxRounds) {
      // Fin del juego
      const rewardCoins = 25 + (state.score * 10);
      const rewardExp = 15 + (state.score * 8);
      addStoredCoins(rewardCoins);

      const pets = loadStoredPets();
      const pet = pets.find(p => p.id === state.petId);
      if (pet) {
        pet.happiness = 100;
        pet.exp = (pet.exp || 0) + rewardExp;
        checkPetLevelUp(pet);
        saveStoredPets(pets);
      }

      modal = document.createElement('div');
      modal.id = 'masterpet-minigame-modal';
      modal.style.cssText = `position: fixed; inset: 0; z-index: 10010; background: rgba(15, 23, 42, 0.85); display: flex; align-items: center; justify-content: center; padding: 16px;`;
      modal.innerHTML = `
        <div class="paper-cardboard-panel paper-stitches max-w-md w-full p-6 text-center animate-bounce-short">
          <div class="text-6xl mb-2">🎈🏆</div>
          <h2 class="text-2xl font-black text-[#78350f] mb-1">¡Ronda Completada!</h2>
          <p class="text-sm text-[#451a03] mb-4">Acertaste <strong>${state.score} de ${state.maxRounds}</strong> palabras en inglés.</p>
          <div class="bg-amber-100 border border-amber-300 rounded-xl p-3 mb-5 flex justify-around font-extrabold text-sm text-amber-900">
            <span>🪙 +${rewardCoins} Monedas</span>
            <span>⭐ +${rewardExp} EXP</span>
            <span>❤️ 100% Felicidad</span>
          </div>
          <button type="button" onclick="document.getElementById('masterpet-minigame-modal').remove(); window.renderPetRoom(window.loadStoredPets().find(p=>p.id==='${state.petId}'))" class="paper-btn-primary w-full py-3 text-sm">
            Volver a la Habitación
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      return;
    }

    // Elegir tarjeta aleatoria
    const card = VOCAB_MINIGAME_DECK[Math.floor(Math.random() * VOCAB_MINIGAME_DECK.length)];
    state.currentCard = card;

    const options = [card.es, ...card.wrong].sort(() => Math.random() - 0.5);

    modal = document.createElement('div');
    modal.id = 'masterpet-minigame-modal';
    modal.style.cssText = `position: fixed; inset: 0; z-index: 10010; background: rgba(15, 23, 42, 0.85); display: flex; align-items: center; justify-content: center; padding: 16px;`;
    modal.innerHTML = `
      <div class="paper-cardboard-panel paper-stitches max-w-md w-full p-6 text-center">
        <div class="flex items-center justify-between mb-3 border-b-2 border-amber-900/40 pb-2">
          <span class="text-xs font-black text-amber-900">Ronda ${state.round + 1} de ${state.maxRounds}</span>
          <span class="text-xs font-black text-amber-900">Aciertos: ${state.score}</span>
        </div>

        <div class="my-4">
          <span class="text-xs font-bold text-amber-800 uppercase tracking-widest block mb-1">¿Qué significa en español?</span>
          <div class="inline-block bg-amber-400 text-slate-950 font-black text-3xl px-6 py-3 rounded-2xl shadow border-2 border-amber-600 mb-2">
            "${card.en}"
          </div>
          <button type="button" onclick="window.speakEnglishVocab('${card.en}')" class="text-xs text-amber-700 font-bold underline block mx-auto">
            🔊 Escuchar pronunciación
          </button>
        </div>

        <div class="flex flex-col gap-2.5 my-4">
          ${options.map(opt => `
            <button type="button" onclick="window.answerMinigameOption('${opt === card.es}')" class="paper-btn-secondary py-3 px-4 text-sm font-black hover:bg-amber-100 transition">
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    speakEnglishVocab(card.en);
  }

  global.answerMinigameOption = function (isCorrectStr) {
    const isCorrect = isCorrectStr === 'true' || isCorrectStr === true;
    const state = sanctuaryState.minigameState;
    if (!state) return;

    if (isCorrect) {
      state.score++;
      showPetPaperToast(`✨ ¡Correcto! "${state.currentCard.en}" = ${state.currentCard.es}`);
    } else {
      showPetPaperToast(`❌ Casi. "${state.currentCard.en}" significa ${state.currentCard.es}`);
    }

    state.round++;
    renderMinigameModal();
  };

  // ==========================================================================
  // 13. BOUTIQUE Y VESTUARIO PAPERCRAFT
  // ==========================================================================
  global.openPetShopModal = function () {
    const petId = sanctuaryState.selectedPetId;
    const pets = loadStoredPets();
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;

    let modal = document.getElementById('masterpet-shop-modal');
    if (modal) modal.remove();

    const coins = getStoredCoins();

    modal = document.createElement('div');
    modal.id = 'masterpet-shop-modal';
    modal.style.cssText = `position: fixed; inset: 0; z-index: 10010; background: rgba(15, 23, 42, 0.85); display: flex; align-items: center; justify-content: center; padding: 16px;`;
    modal.innerHTML = `
      <div class="paper-cardboard-panel max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b-2 border-amber-900/40 pb-2 mb-4">
          <div>
            <h2 class="text-xl font-black text-[#78350f]">Boutique Papercraft</h2>
            <p class="text-xs text-[#451a03]">Viste a ${pet.name} con sombreros y gafas de papel.</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="bg-amber-100 border border-amber-400 px-3 py-1 rounded-xl font-black text-amber-950 text-xs">
              🪙 ${coins} Monedas
            </div>
            <button type="button" onclick="document.getElementById('masterpet-shop-modal').remove()" class="paper-btn-secondary px-3 py-1 text-xs">
              Cerrar
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          ${PET_ACCESSORIES.map(acc => {
            const isEquipped = pet[acc.slot] === acc.id;
            return `
              <div class="bg-white/80 border-2 ${isEquipped ? 'border-emerald-600 bg-emerald-50' : 'border-amber-600'} rounded-2xl p-3 text-center shadow flex flex-col justify-between">
                <div>
                  <span class="text-4xl block mb-1">${acc.icon}</span>
                  <h4 class="text-xs font-black text-amber-950">${acc.name}</h4>
                  <p class="text-[10px] text-amber-800 mb-2">${acc.es}</p>
                </div>
                <button type="button" onclick="window.equipOrBuyAccessory('${pet.id}', '${acc.id}')" class="${isEquipped ? 'bg-emerald-600 text-white' : 'paper-btn-primary'} w-full py-1.5 text-xs font-black rounded-lg">
                  ${isEquipped ? '✓ Equipado' : `Equipar (🪙 ${acc.cost})`}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  };

  global.equipOrBuyAccessory = function (petId, accId) {
    const pets = loadStoredPets();
    const pet = pets.find(p => p.id === petId);
    const acc = PET_ACCESSORIES.find(a => a.id === accId);
    if (!pet || !acc) return;

    if (pet[acc.slot] === acc.id) {
      // Desequipar
      pet[acc.slot] = null;
      showPetPaperToast(`Desequipaste ${acc.name}.`);
    } else {
      const coins = getStoredCoins();
      if (coins < acc.cost) {
        showPetPaperToast(`🪙 Necesitas ${acc.cost} monedas para este accesorio.`);
        return;
      }
      addStoredCoins(-acc.cost);
      pet[acc.slot] = acc.id;
      showPetPaperToast(`🎩 ¡${pet.name} luce genial con su ${acc.name}!`);
    }

    saveStoredPets(pets);
    openPetShopModal();
    if (sanctuaryState.currentView === 'room') renderPetRoom(pet);
  };

  // ==========================================================================
  // 14. MODAL DE ADOPCIÓN DE NUEVAS MASCOTAS (FREEMIUM + VIP CON CANDADO)
  // ==========================================================================
  global.openPetAdoptModal = function () {
    ensureSanctuaryStyles();
    const pets = loadStoredPets();
    if (!isUserVip() && pets.length >= 1) {
      renderVipPetLimitModal();
      return;
    }

    let modal = document.getElementById('masterpet-adopt-modal');
    if (modal) modal.remove();

    const userIsVip = isUserVip();

    modal = document.createElement('div');
    modal.id = 'masterpet-adopt-modal';
    modal.style.cssText = `position: fixed; inset: 0; z-index: 10010; background: rgba(15, 23, 42, 0.85); display: flex; align-items: center; justify-content: center; padding: 16px;`;

    modal.innerHTML = `
      <div class="paper-cardboard-panel max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b-2 border-amber-900/40 pb-2 mb-4">
          <div>
            <h2 class="text-xl font-black text-[#78350f]">Ceremonia de Adopción de Casimeritos</h2>
            <p class="text-xs text-[#451a03]">Elige la especie y ponle un nombre único.</p>
          </div>
          <button type="button" onclick="document.getElementById('masterpet-adopt-modal').remove()" class="paper-btn-secondary px-3 py-1 text-xs">
            Cerrar
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-5">
          ${Object.values(PET_SPECIES).map(spec => {
            const isLocked = spec.isVip && !userIsVip;
            return `
              <div onclick="${isLocked ? `window.showVipLockAlert('${spec.name}')` : `window.selectAdoptSpecies('${spec.id}')`}" class="relative bg-white/90 border-2 ${isLocked ? 'border-amber-400/60 opacity-85' : 'border-amber-600'} rounded-2xl p-3 text-center cursor-pointer transition transform hover:scale-102 shadow">
                ${isLocked ? `
                  <div class="absolute top-2 right-2 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                    🔒 VIP
                  </div>
                ` : `
                  <div class="absolute top-2 right-2 bg-emerald-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow">
                    GRATIS
                  </div>
                `}
                <span class="text-4xl block mb-1">${spec.icon}</span>
                <h4 class="text-sm font-black text-amber-950">${spec.name}</h4>
                <p class="text-[11px] font-bold text-amber-800 mb-1">${spec.es}</p>
                <span class="text-[10px] text-[#78350f] block mb-2 font-medium">${spec.habitatName}</span>
                <p class="text-[10px] text-slate-600 leading-tight mb-2">${spec.desc}</p>
                <button type="button" class="paper-btn-primary w-full py-1 text-xs font-black ${isLocked ? 'opacity-50' : ''}">
                  ${isLocked ? '🔒 Bloqueado' : 'Adoptar'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  };

  global.showVipLockAlert = function (speciesName) {
    ensureSanctuaryStyles();
    showPetPaperToast(`👑 ¡${speciesName} es una Especie Legendaria de Season Pass! Activa MasterENG VIP para desbloquearla.`);
  };

  global.selectAdoptSpecies = function (speciesId) {
    const spec = PET_SPECIES[speciesId];
    if (!spec) return;

    const modal = document.getElementById('masterpet-adopt-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="paper-cardboard-panel paper-stitches max-w-md w-full p-6 text-center animate-bounce-short">
        <span class="text-6xl block mb-2">${spec.icon}</span>
        <h3 class="text-xl font-black text-[#78350f] mb-1">¡Adoptando a tu ${spec.name}!</h3>
        <p class="text-xs text-[#451a03] mb-4">Hábitat natural: <strong>${spec.habitatName}</strong></p>

        <div class="mb-4 text-left">
          <label class="block text-xs font-bold text-amber-950 mb-1">Nombre de la Mascota:</label>
          <input type="text" id="newPetNameInput" value="${spec.defaultName}" class="w-full bg-white border-2 border-amber-600 rounded-xl px-3 py-2 text-sm font-bold text-amber-950 outline-none focus:ring-2 focus:ring-amber-500" placeholder="Ej: Crocody, Buddy, Luna..." maxlength="20" />
        </div>

        <div class="mb-5 text-left">
          <label class="block text-xs font-bold text-amber-950 mb-1">Modo de Crianza:</label>
          <div class="flex items-center gap-2">
            <label class="flex-1 bg-amber-100 border border-amber-400 p-2.5 rounded-xl text-xs font-bold cursor-pointer">
              <input type="radio" name="petAdoptMode" value="solo" checked class="mr-1.5"/>
              👤 Solo Mía
            </label>
            <label class="flex-1 bg-amber-100 border border-amber-400 p-2.5 rounded-xl text-xs font-bold cursor-pointer">
              <input type="radio" name="petAdoptMode" value="coop" class="mr-1.5"/>
              🤝 Co-Parenting
            </label>
          </div>
        </div>

        <div class="flex gap-2">
          <button type="button" onclick="window.confirmPetAdoption('${speciesId}')" class="paper-btn-primary flex-1 py-3 text-sm">
            🐣 ¡Eclosionar Huevo!
          </button>
          <button type="button" onclick="window.openPetAdoptModal()" class="paper-btn-secondary px-4 text-sm">
            Atrás
          </button>
        </div>
      </div>
    `;
  };

  global.confirmPetAdoption = function (speciesId) {
    const spec = PET_SPECIES[speciesId];
    if (!spec) return;

    const pets = loadStoredPets();
    if (!isUserVip() && pets.length >= 1) {
      const modal = document.getElementById('masterpet-adopt-modal');
      if (modal) modal.remove();
      renderVipPetLimitModal();
      return;
    }

    const nameInput = document.getElementById('newPetNameInput');
    const petName = (nameInput && nameInput.value.trim()) || spec.defaultName;
    const modeEl = document.querySelector('input[name="petAdoptMode"]:checked');
    const isShared = modeEl && modeEl.value === 'coop';

    const now = Date.now();
    const newPet = {
      id: 'pet_' + now + '_' + Math.floor(Math.random() * 1000),
      speciesId: speciesId,
      name: petName,
      createdAt: now,
      lastFedAt: now,
      lastCleanedAt: now,
      lastPlayedAt: now,
      lastSleptAt: now,
      hunger: 90,
      hygiene: 95,
      energy: 100,
      happiness: 100,
      exp: 0,
      level: 1,
      isShared: isShared,
      coopCode: isShared ? ('COOP-' + spec.name.toUpperCase().slice(0, 4) + '-' + Math.floor(1000 + Math.random() * 9000)) : null,
      coParents: isShared ? ['Tú', 'Esperando compañero...'] : ['Tú'],
      hat: null,
      glasses: null,
      neck: null,
      activityLog: [
        { text: `¡${petName} acaba de nacer de su huevo de papel!`, time: now }
      ]
    };

    pets.unshift(newPet);
    saveStoredPets(pets);

    const modal = document.getElementById('masterpet-adopt-modal');
    if (modal) modal.remove();

    showPetPaperToast(`🐣 ¡Felicidades! Adoptaste a ${petName} el ${spec.name}.`);
    speakEnglishVocab(`Welcome to the sanctuary, ${petName}!`);

    openPetRoom(newPet.id);
  };

  // ==========================================================================
  // 15. SISTEMA DE SALAS CO-OP REAL & ELIMINACIÓN TOTAL DE BOTS
  // ==========================================================================
  const COOP_STORAGE_KEY = 'mastereng_coop_groups';
  let currentCoopTab = 'manage'; // 'manage', 'create', 'join'
  let selectedNewCoopType = 'duo'; // 'duo' (2 miembros) o 'squad' (hasta 4 miembros)

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Purga y migración: elimina de localStorage cualquier grupo o dato demo obsoleto
  function purgeFakeCoopData() {
    try {
      ['mastereng_coop_groups', 'mastereng_pet_coop_group'].forEach(k => {
        const val = localStorage.getItem(k);
        if (val && typeof val === 'string') {
          try {
            const parsed = JSON.parse(val);
            if (parsed && (parsed.id === 'coop_master_group_1' || parsed.id === 'coop_default_group' || parsed.isDemo || parsed.isMock)) {
              localStorage.removeItem(k);
            }
          } catch (_) {}
        }
      });
    } catch (_) {}
  }
  purgeFakeCoopData();

  function getRealCoopGroup() {
    try {
      const raw = localStorage.getItem(COOP_STORAGE_KEY);
      if (!raw) return null;
      const g = JSON.parse(raw);
      if (!g || !g.id || !g.name || !g.code) return null;
      if (g.id === 'coop_master_group_1' || g.id === 'coop_default_group' || g.isDemo || g.isMock) {
        localStorage.removeItem(COOP_STORAGE_KEY);
        return null;
      }
      return g;
    } catch (_) {
      return null;
    }
  }

  function saveRealCoopGroup(group) {
    try {
      if (!group) {
        localStorage.removeItem(COOP_STORAGE_KEY);
        localStorage.removeItem('mastereng_pet_coop_group');
      } else {
        localStorage.setItem(COOP_STORAGE_KEY, JSON.stringify(group));
        localStorage.setItem('mastereng_pet_coop_group', JSON.stringify(group));
      }
    } catch (_) {}
  }

  function getCurrentUserExp() {
    try {
      const raw = localStorage.getItem('mastereng_user') || localStorage.getItem('english_app_user_session');
      if (raw) {
        const u = JSON.parse(raw);
        if (u && typeof u.exp === 'number') return Math.max(0, u.exp);
        if (u && u.exp) return Math.max(0, parseInt(u.exp, 10) || 0);
      }
    } catch (_) {}
    return 0;
  }

  function deductUserExp(amount) {
    try {
      const raw = localStorage.getItem('mastereng_user');
      if (raw) {
        const u = JSON.parse(raw);
        u.exp = Math.max(0, (parseInt(u.exp, 10) || 0) - amount);
        localStorage.setItem('mastereng_user', JSON.stringify(u));
      }
      const raw2 = localStorage.getItem('english_app_user_session');
      if (raw2) {
        const u2 = JSON.parse(raw2);
        u2.exp = Math.max(0, (parseInt(u2.exp, 10) || 0) - amount);
        localStorage.setItem('english_app_user_session', JSON.stringify(u2));
      }
      if (typeof window.updateUserExpDisplay === 'function') {
        window.updateUserExpDisplay();
      }
    } catch (_) {}
  }

  function generateCleanCoopCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function openCleanCoopGroupModal(initialTab) {
    ensureSanctuaryStyles();
    currentCoopTab = initialTab || 'manage';

    const oldModal = document.getElementById('coopGroupModalOverlay') || document.getElementById('masterpet-coop-modal');
    if (oldModal) oldModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'coopGroupModalOverlay';
    overlay.className = 'coop-modal-overlay';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(4, 7, 13, 0.88); backdrop-filter: blur(16px); z-index: 100020; display: flex; align-items: center; justify-content: center; padding: 16px;';

    const group = getRealCoopGroup();
    const user = getCurrentUserMeta();

    overlay.innerHTML = `
      <div class="coop-modal-card" onclick="event.stopPropagation();">
        <!-- Encabezado Cartón / Papercraft -->
        <div class="coop-modal-header">
          <h3>
            <span>🤝</span>
            <span>Crear Grupo / Invitar Amigos a Crianza</span>
          </h3>
          <button type="button" onclick="window.closeCoopGroupModal()" class="text-amber-900 hover:text-amber-700 text-2xl font-black p-1 cursor-pointer leading-none" title="Cerrar">&times;</button>
        </div>

        <!-- Selector de Tabs -->
        <div class="coop-tabs-nav">
          <button type="button" onclick="window.switchCoopModalTab('manage')" id="tabBtnManage" class="coop-tab-btn ${currentCoopTab === 'manage' ? 'active' : ''}">
            <span>👥</span>
            <span>Mi Grupo & Invitación</span>
          </button>
          <button type="button" onclick="window.switchCoopModalTab('create')" id="tabBtnCreate" class="coop-tab-btn ${currentCoopTab === 'create' ? 'active' : ''}">
            <span>➕</span>
            <span>Crear Nueva Sala</span>
          </button>
          <button type="button" onclick="window.switchCoopModalTab('join')" id="tabBtnJoin" class="coop-tab-btn ${currentCoopTab === 'join' ? 'active' : ''}">
            <span>🎟️</span>
            <span>Unirse con Código</span>
          </button>
        </div>

        <!-- Contenedor Dinámico del Tab -->
        <div id="coopModalTabBody">
          ${renderCoopTabContent(currentCoopTab, group, user)}
        </div>
      </div>
    `;

    overlay.onclick = function (e) {
      if (e.target === overlay) window.closeCoopGroupModal();
    };

    document.body.appendChild(overlay);
  }

  function closeCleanCoopGroupModal() {
    ['coopGroupModalOverlay', 'masterpet-coop-modal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  function switchCoopModalTab(tab) {
    currentCoopTab = tab || 'manage';
    ['tabBtnManage', 'tabBtnCreate', 'tabBtnJoin'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.classList.remove('active');
    });

    const activeBtnId = tab === 'create' ? 'tabBtnCreate' : (tab === 'join' ? 'tabBtnJoin' : 'tabBtnManage');
    const activeBtn = document.getElementById(activeBtnId);
    if (activeBtn) activeBtn.classList.add('active');

    const body = document.getElementById('coopModalTabBody');
    if (body) {
      const group = getRealCoopGroup();
      const user = getCurrentUserMeta();
      body.innerHTML = renderCoopTabContent(currentCoopTab, group, user);
    }
  }

  function selectCoopType(type) {
    selectedNewCoopType = type;
    const cardDuo = document.getElementById('typeCardDuo');
    const cardSquad = document.getElementById('typeCardSquad');
    if (cardDuo) cardDuo.classList.toggle('active', type === 'duo');
    if (cardSquad) cardSquad.classList.toggle('active', type === 'squad');
  }

  function renderCoopTabContent(tab, group, user) {
    // ------------------------------------------------------------------------
    // TAB: MANAGE (MI GRUPO & INVITACIÓN)
    // ------------------------------------------------------------------------
    if (tab === 'manage') {
      if (!group) {
        // Caso A: Estado vacío real sin bots
        return `
          <div class="paper-cardboard-panel paper-stitches p-6 text-center my-2 bg-[#fffdfa]">
            <div class="text-4xl mb-3">🏡🐾</div>
            <h4 class="text-base font-black text-[#78350f] mb-2">Sin Grupo de Crianza Activo</h4>
            <p class="text-xs text-[#451a03] mb-6 max-w-sm mx-auto leading-relaxed font-semibold">
              Aún no perteneces a ningún grupo de crianza compartida. Crea una nueva sala con tu mascota o únete al grupo de un amigo con su código.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button type="button" onclick="window.switchCoopModalTab('create')" class="btn-coop-primary py-2.5 px-4 text-xs font-black flex items-center justify-center gap-2 shadow hover:scale-105 active:scale-95 transition cursor-pointer">
                <span>➕</span>
                <span>Crear Nueva Sala</span>
              </button>
              <button type="button" onclick="window.switchCoopModalTab('join')" class="btn-coop-secondary py-2.5 px-4 text-xs font-black flex items-center justify-center gap-2 shadow hover:scale-105 active:scale-95 transition cursor-pointer">
                <span>🎟️</span>
                <span>Unirse con Código</span>
              </button>
            </div>
          </div>
        `;
      }

      // Caso A.2: El usuario sí tiene grupo real
      const typeLabel = group.type === 'duo' ? '💕 En Pareja (2 max)' : '👨‍👩‍👧‍👦 Familia / Cuadrilla (4 max)';
      const isFull = (group.members || []).length >= (group.maxMembers || 2);
      const shareUrl = window.location.origin + '/?coop=' + group.code;
      const userExp = getCurrentUserExp();

      return `
        <div class="flex flex-col gap-3 py-1">
          <!-- 1. Ficha Resumen del Grupo -->
          <div class="flex items-center justify-between bg-[#fffdfa] border-2 border-amber-600/60 rounded-xl p-3 shadow-sm">
            <div>
              <h4 class="text-base font-black text-[#78350f] m-0 flex items-center gap-2">
                <span>${escapeHtml(group.name)}</span>
                <span class="text-xs">🏡</span>
              </h4>
              <p class="text-xs text-amber-900 m-0 mt-0.5">
                Mascota: <strong>${escapeHtml(group.petName || 'Mascota')}</strong> • Tipo: <span class="font-bold text-[#b45309]">${typeLabel}</span>
              </p>
            </div>
            <div class="text-right">
              <span class="text-xs font-black px-2.5 py-1 rounded-lg ${isFull ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}">
                ${(group.members || []).length} / ${group.maxMembers || 2} miembros
              </span>
            </div>
          </div>

          <!-- 2. Banner de Invitación de 6 Caracteres -->
          <div class="coop-invite-banner">
            <span class="text-[11px] font-black text-[#78350f] uppercase tracking-wider">
              🎟️ Código Único de Invitación (6 Caracteres)
            </span>
            <div class="coop-code-pill">
              <span id="coopActiveCodeDisplay">${group.code}</span>
            </div>
            
            <button type="button" onclick="window.copyCoopInviteCode()" class="btn-copy-code cursor-pointer shadow" title="Copiar código para enviar por chat">
              <span>📋</span>
              <span>Copiar Código de Invitación</span>
            </button>

            <div class="coop-link-input-group mt-1 flex gap-2 w-full">
              <input type="text" id="coopShareLinkInput" readonly value="${shareUrl}" class="coop-input-field flex-1 text-xs font-mono" />
              <button type="button" onclick="window.copyCoopInviteLink()" class="btn-coop-secondary text-xs px-3 whitespace-nowrap cursor-pointer shadow">
                <span>🔗</span>
                <span>Copiar Enlace</span>
              </button>
            </div>

            <p class="text-[10px] text-amber-900 m-0">
              💡 Tus amigos o pareja solo deben ingresar este código de 6 caracteres en su pestaña <em>"Unirse con Código"</em> para vincularse de inmediato.
            </p>
          </div>

          <!-- 3. Lista de Miembros y Aporte de EXP -->
          <div class="flex items-center justify-between mt-1">
            <span class="text-xs font-black text-[#78350f] flex items-center gap-1.5">
              <span>🏆</span>
              <span>Miembros del Grupo y Aporte de EXP a la Mascota:</span>
            </span>
            <span class="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              ${(group.members || []).length} de ${group.maxMembers || 2} plazas
            </span>
          </div>

          <div class="coop-members-wrapper">
            ${(group.members || []).map(m => `
              <div class="coop-member-row">
                <div class="coop-member-info">
                  <div class="coop-member-avatar">
                    <span>${m.avatar || '🐾'}</span>
                  </div>
                  <div class="coop-member-details">
                    <h6>${escapeHtml(m.username)} ${m.isOwner ? '👑' : ''}</h6>
                    <span class="role">${escapeHtml(m.role || 'Criador')}</span>
                  </div>
                </div>
                <div class="coop-member-exp">
                  <span class="val">+${m.expContributed || 0} EXP</span>
                  <span class="sub">🔥 Racha: ${m.streakDays || 1}d</span>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- 4. Resumen del Fondo Común y Acción de Aporte -->
          <div class="coop-pool-summary mt-1 flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-300">
            <div>
              <span class="block text-xs font-black text-amber-950">⭐ Fondo de EXP Compartida:</span>
              <span class="text-[10px] text-amber-800">
                <strong>${group.totalExpPool || 0} EXP</strong> acumulados por el equipo
                <span class="text-[9px] text-slate-500 block">Tu EXP disponible: ${userExp} EXP</span>
              </span>
            </div>
            <button type="button" onclick="window.handleContributeCoopExp()" class="btn-coop-primary text-xs py-2 px-3.5 cursor-pointer shadow hover:scale-105 active:scale-95 transition">
              <span>⭐ Aportar EXP</span>
            </button>
          </div>

          <!-- 5. Botón de Abandonar o Eliminar Sala -->
          <div class="text-center pt-2">
            <button type="button" onclick="window.leaveOrDeleteCoopGroup()" class="text-xs text-rose-700 hover:text-rose-900 font-bold underline cursor-pointer p-1">
              🚪 Abandonar / Eliminar Sala
            </button>
          </div>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // TAB: CREATE (CREAR NUEVA SALA)
    // ------------------------------------------------------------------------
    if (tab === 'create') {
      const pets = loadStoredPets();
      return `
        <div class="flex flex-col gap-3 py-1">
          <p class="text-xs text-[#78350f] m-0">
            Funda una sala de crianza compartida en tiempo real para cuidar a una mascota junto a tu pareja o amigos.
          </p>

          <!-- 1. Tipo de Sala -->
          <div>
            <label class="block text-xs font-black text-amber-950 mb-1.5">
              1. Selecciona la modalidad de la Sala:
            </label>
            <div class="coop-type-grid">
              <div onclick="window.selectCoopType('duo')" id="typeCardDuo" class="coop-type-card ${selectedNewCoopType === 'duo' ? 'active' : ''}">
                <h5><span>💕</span> <span>En Pareja (2 miembros)</span></h5>
                <p>Ideal para citas románticas o mejores amigos. Crianza 1 a 1 de una mascota.</p>
              </div>
              <div onclick="window.selectCoopType('squad')" id="typeCardSquad" class="coop-type-card ${selectedNewCoopType === 'squad' ? 'active' : ''}">
                <h5><span>👨‍👩‍👧‍👦</span> <span>Familia / Amigos (hasta 4)</span></h5>
                <p>Cuadrilla de hasta 4 miembros para cuidar y aportar EXP juntos.</p>
              </div>
            </div>
          </div>

          <!-- 2. Nombre del Grupo -->
          <div>
            <label class="block text-xs font-black text-amber-950 mb-1">
              2. Nombre de tu Sala / Grupo:
            </label>
            <input type="text" id="newCoopGroupNameInput" placeholder="Ej: Familia y Pelusa" class="coop-input-field text-xs font-bold" />
          </div>

          <!-- 3. Seleccionar Mascota Adoptada -->
          <div>
            <label class="block text-xs font-black text-amber-950 mb-1">
              3. Mascota del Santuario que liderará la Sala:
            </label>
            ${pets.length === 0 ? `
              <div class="bg-amber-100 border border-amber-400 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between gap-2">
                <span>⚠️ Aún no tienes mascotas adoptadas.</span>
                <button type="button" onclick="window.closeCoopGroupModal(); window.openAdoptModal();" class="paper-btn-primary px-3 py-1 text-xs font-black cursor-pointer shadow">
                  <span>🐾 Adoptar Mascota</span>
                </button>
              </div>
            ` : `
              <select id="newCoopPetSelect" class="coop-input-field text-xs font-bold cursor-pointer">
                ${pets.map(p => {
                  const spec = PET_SPECIES[p.speciesId] || { name: p.speciesId };
                  return `<option value="${p.id}">${escapeHtml(p.name)} (${escapeHtml(spec.name)}) - Nivel ${p.level || 1}</option>`;
                }).join('')}
              </select>
            `}
          </div>

          <!-- Botón de Creación -->
          <button type="button" onclick="window.createCoopGroupAction()" class="btn-coop-primary w-full py-3 text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-102 active:scale-95 transition mt-2">
            <span>✨</span>
            <span>Crear Sala Co-Op</span>
          </button>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // TAB: JOIN (UNIRSE CON CÓDIGO)
    // ------------------------------------------------------------------------
    if (tab === 'join') {
      return `
        <div class="flex flex-col gap-3 py-1">
          <p class="text-xs text-[#78350f] m-0">
            Ingresa el código único de 6 caracteres que te dio tu amigo o pareja (ejemplo: <code>K8P3X9</code>) para unirte a su sala.
          </p>

          <div class="my-2">
            <label class="block text-xs font-black text-amber-950 mb-1.5 text-center">
              Código de Invitación (6 Caracteres):
            </label>
            <input type="text" id="coopJoinCodeInput" maxlength="6" placeholder="EJ: K8P3X9" class="coop-input-field text-center font-mono text-2xl tracking-[6px] uppercase font-black" autocomplete="off" />
          </div>

          <button type="button" onclick="window.joinCoopWithCodeAction()" class="btn-coop-primary w-full py-3 text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-102 active:scale-95 transition">
            <span>🤝</span>
            <span>Vincularme al Grupo</span>
          </button>
        </div>
      `;
    }

    return '';
  }

  function createCoopGroupAction() {
    const nameInput = document.getElementById('newCoopGroupNameInput');
    const groupName = nameInput && nameInput.value ? nameInput.value.trim() : '';
    if (!groupName || groupName.length < 2) {
      showPetPaperToast('⚠️ Por favor escribe un nombre para tu grupo (mínimo 2 caracteres).');
      return;
    }

    const pets = loadStoredPets();
    const petSelect = document.getElementById('newCoopPetSelect');
    const selectedPetId = petSelect ? petSelect.value : (pets[0] ? pets[0].id : null);
    const selectedPet = pets.find(p => p.id === selectedPetId) || pets[0];

    if (!selectedPet) {
      showPetPaperToast('⚠️ Primero debes adoptar una mascota en tu Santuario para asignarla a la sala.');
      return;
    }

    const user = getCurrentUserMeta();
    const code = generateCleanCoopCode();
    const maxMembers = selectedNewCoopType === 'duo' ? 2 : 4;

    const newGroup = {
      id: 'coop_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      code: code,
      name: groupName,
      type: selectedNewCoopType,
      maxMembers: maxMembers,
      petId: selectedPet.id,
      petName: selectedPet.name,
      petSpecies: selectedPet.speciesId,
      petLevel: selectedPet.level || 1,
      totalExpPool: 0,
      createdAt: new Date().toISOString(),
      members: [
        {
          id: user.id || 'mem_' + Date.now(),
          username: user.username || user.name || 'Mi Usuario',
          avatar: user.avatar || '🐾',
          role: 'Líder de Crianza',
          isOwner: true,
          expContributed: 0,
          streakDays: typeof user.streak === 'number' ? user.streak : 1,
          joinedAt: 'Hoy'
        }
      ]
    };

    saveRealCoopGroup(newGroup);

    if (sanctuaryState.coopChannel) {
      sanctuaryState.coopChannel.postMessage({
        type: 'group_created',
        group: newGroup
      });
    }

    showPetPaperToast(`🎉 ¡Sala Co-Op creada exitosamente! Código: ${code}`);
    switchCoopModalTab('manage');
  }

  function joinCoopWithCodeAction() {
    const input = document.getElementById('coopJoinCodeInput');
    const code = input && input.value ? input.value.trim().toUpperCase() : '';
    if (!code || code.length !== 6) {
      showPetPaperToast('⚠️ Por favor ingresa un código de 6 caracteres válido (ej: K8P3X9).');
      return;
    }

    const user = getCurrentUserMeta();

    // Sincronización con backend /api/pets/co-parent
    try {
      fetch('/api/pets/co-parent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          code: code,
          user: {
            id: user.id || 'mem_' + Date.now(),
            username: user.username || user.name || 'Invitado',
            avatar: user.avatar || '🐾',
            streak: user.streak || 1
          }
        })
      })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.group) {
          saveRealCoopGroup(data.group);
          if (sanctuaryState.coopChannel) {
            sanctuaryState.coopChannel.postMessage({ type: 'coop_sync', group: data.group });
          }
          showPetPaperToast(`🤝 ¡Te has vinculado exitosamente a "${data.group.name}"!`);
          switchCoopModalTab('manage');
          return;
        }
        handleLocalCoopJoin(code, user);
      })
      .catch(() => {
        handleLocalCoopJoin(code, user);
      });
    } catch (_) {
      handleLocalCoopJoin(code, user);
    }
  }

  function handleLocalCoopJoin(code, user) {
    let group = getRealCoopGroup();
    if (group && group.code === code) {
      showPetPaperToast(`🤝 Ya perteneces a la sala "${group.name}".`);
      switchCoopModalTab('manage');
      return;
    }

    const pets = loadStoredPets();
    const activePet = pets[0] || { id: 'shared_' + Date.now(), name: 'Casimerito Co-Op', speciesId: 'puppy', level: 1 };

    group = {
      id: 'coop_' + Date.now(),
      code: code,
      name: 'Sala Co-Op ' + code,
      type: 'duo',
      maxMembers: 2,
      petId: activePet.id,
      petName: activePet.name,
      petSpecies: activePet.speciesId || 'puppy',
      petLevel: activePet.level || 1,
      totalExpPool: 0,
      createdAt: new Date().toISOString(),
      members: [
        {
          id: user.id || 'mem_self',
          username: user.username || user.name || 'Mi Usuario',
          avatar: user.avatar || '🐾',
          role: 'Co-Parent',
          isOwner: false,
          expContributed: 0,
          streakDays: typeof user.streak === 'number' ? user.streak : 1,
          joinedAt: 'Hoy'
        }
      ]
    };

    saveRealCoopGroup(group);

    if (sanctuaryState.coopChannel) {
      sanctuaryState.coopChannel.postMessage({
        type: 'coop_joined',
        code: code,
        member: group.members[0]
      });
    }

    showPetPaperToast(`🤝 ¡Código ${code} vinculado correctamente!`);
    switchCoopModalTab('manage');
  }

  function handleContributeCoopExp() {
    const group = getRealCoopGroup();
    if (!group) return;

    const currentExp = getCurrentUserExp();
    if (currentExp <= 0) {
      showPetPaperToast('⚠️ No tienes EXP disponible para aportar. ¡Completa lecciones en los Portales o cuida a tu mascota para ganar EXP!');
      return;
    }

    const amount = Math.min(25, currentExp);
    deductUserExp(amount);

    group.totalExpPool = (group.totalExpPool || 0) + amount;

    const user = getCurrentUserMeta();
    const myName = user.username || user.name || 'Mi Usuario';
    let member = (group.members || []).find(m => m.username === myName || m.isOwner);
    if (!member && group.members && group.members.length > 0) {
      member = group.members[0];
    }
    if (member) {
      member.expContributed = (member.expContributed || 0) + amount;
    }

    saveRealCoopGroup(group);

    if (sanctuaryState.coopChannel) {
      sanctuaryState.coopChannel.postMessage({
        type: 'exp_contributed',
        code: group.code,
        amount: amount,
        by: myName
      });
    }

    showPetPaperToast(`⭐ ¡Aportaste +${amount} EXP a la sala de crianza! (Te restan ${currentExp - amount} EXP)`);
    switchCoopModalTab('manage');
  }

  function leaveOrDeleteCoopGroup() {
    const group = getRealCoopGroup();
    if (!group) return;

    if (confirm(`¿Estás seguro de que deseas abandonar o eliminar la sala "${group.name}"? Esta acción reiniciará tu grupo.`)) {
      if (sanctuaryState.coopChannel) {
        sanctuaryState.coopChannel.postMessage({
          type: 'group_deleted',
          code: group.code
        });
      }
      saveRealCoopGroup(null);
      showPetPaperToast('🚪 Has abandonado la sala de crianza exitosamente.');
      switchCoopModalTab('manage');
    }
  }

  function copyCoopInviteCode() {
    const group = getRealCoopGroup();
    if (!group || !group.code) return;
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(group.code).then(() => {
        showPetPaperToast(`📋 ¡Código de Invitación (${group.code}) copiado al portapapeles!`);
      }).catch(() => {
        fallbackCopyText(group.code);
      });
    } else {
      fallbackCopyText(group.code);
    }
  }

  function copyCoopInviteLink() {
    const group = getRealCoopGroup();
    if (!group || !group.code) return;
    const link = window.location.origin + '/?coop=' + group.code;
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        showPetPaperToast('🔗 ¡Enlace copiado al portapapeles!');
      }).catch(() => {
        fallbackCopyText(link);
      });
    } else {
      fallbackCopyText(link);
    }
  }

  function fallbackCopyText(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showPetPaperToast('¡Copiado al portapapeles!');
    } catch (_) {
      showPetPaperToast('Texto: ' + text);
    }
  }

  // Exportaciones y protección estricta en el ámbito global
  global.openPetCoopModal = openCleanCoopGroupModal;
  global.openCoopGroupModal = openCleanCoopGroupModal;
  global.closeCoopGroupModal = closeCleanCoopGroupModal;
  global.switchCoopModalTab = switchCoopModalTab;
  global.selectCoopType = selectCoopType;
  global.createCoopGroupAction = createCoopGroupAction;
  global.joinCoopWithCodeAction = joinCoopWithCodeAction;
  global.copyCoopInviteCode = copyCoopInviteCode;
  global.copyCoopInviteLink = copyCoopInviteLink;
  global.handleContributeCoopExp = handleContributeCoopExp;
  global.leaveOrDeleteCoopGroup = leaveOrDeleteCoopGroup;
  global.getRealCoopGroup = getRealCoopGroup;
  global.saveRealCoopGroup = saveRealCoopGroup;

  try {
    Object.defineProperty(global, 'openPetCoopModal', {
      get: () => openCleanCoopGroupModal,
      set: () => {},
      configurable: true
    });
    Object.defineProperty(global, 'openCoopGroupModal', {
      get: () => openCleanCoopGroupModal,
      set: () => {},
      configurable: true
    });
  } catch (_) {}

  global.setPetHubTab = function (tab) {
    sanctuaryState.activeTab = tab;
    renderSanctuaryHub();
  };

  // ==========================================================================
  // 16. MODAL DE BENEFICIOS VIP / LÍMITE DE MASCOTAS FREE (1/1)
  // ==========================================================================
  function renderVipPetLimitModal() {
    ensureSanctuaryStyles();
    let modal = document.getElementById('masterpet-vip-limit-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'masterpet-vip-limit-modal';
    modal.style.cssText = `position: fixed; inset: 0; z-index: 10020; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 16px;`;

    modal.innerHTML = `
      <div class="paper-cardboard-panel paper-stitches max-w-md w-full p-6 text-center animate-bounce-short border-4 border-amber-500 shadow-2xl">
        <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-4xl shadow-inner">
          ⭐👑
        </div>
        <span class="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-slate-950 inline-block mb-2 shadow">
          Límite de Mascotas Free (1/1)
        </span>
        <h2 class="text-xl sm:text-2xl font-black text-[#78350f] mb-2 leading-tight">
          ¡Ranura de Mascota Activa Ocupada!
        </h2>
        <p class="text-xs sm:text-sm text-[#451a03] font-medium mb-4 leading-relaxed text-left bg-amber-100/90 p-3.5 rounded-xl border border-amber-300">
          Como usuario <strong>Gratuito (Free)</strong> puedes cuidar y criar <strong>1 Casimerito activo</strong> en tu santuario con ciclo biológico en tiempo real.<br><br>
          ✨ <strong>Beneficios Exclusivos MasterENG VIP / Premium:</strong><br>
          • 🐾 <strong>Mascotas Simultáneas Ilimitadas</strong> en tu santuario.<br>
          • 🦄 Especies Legendarias (Ajolote de Xochimilco, Panda Rojo Celestial, Rinoceronte Dorado).<br>
          • 🤝 Salas Co-Parenting Ilimitadas con tus amigos y pareja.<br>
          • 🎨 Boutique de Accesorios y Pociones Mágicas exclusivas.
        </p>
        <div class="flex flex-col gap-2.5">
          <button type="button" onclick="window.unlockPetVipDemo()" class="paper-btn-primary py-3 px-4 text-sm font-black flex items-center justify-center gap-2 shadow">
            <span>💎</span>
            <span>Conocer Beneficios VIP / Activar</span>
          </button>
          <button type="button" onclick="document.getElementById('masterpet-vip-limit-modal').remove()" class="paper-btn-secondary py-2.5 px-4 text-xs font-bold">
            Entendido, volver a mi Mascota
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }
  global.renderVipPetLimitModal = renderVipPetLimitModal;

  global.unlockPetVipDemo = function () {
    const modal = document.getElementById('masterpet-vip-limit-modal');
    if (modal) modal.remove();
    if (typeof global.openPricingModal === 'function') {
      global.openPricingModal();
    } else if (typeof global.openSubscriptionModal === 'function') {
      global.openSubscriptionModal();
    } else {
      localStorage.setItem('mastereng_is_vip', 'true');
      showPetPaperToast('⭐ ¡Has activado el Pase VIP de Demostración! Ya tienes ranuras ilimitadas.');
      renderSanctuaryHub();
    }
  };

  // ==========================================================================
  // 17. MODAL DE INVITAR AMIGOS AL SANTUARIO
  // ==========================================================================
  global.openPetInviteModal = function () {
    ensureSanctuaryStyles();
    let modal = document.getElementById('masterpet-invite-modal');
    if (modal) modal.remove();

    const inviteUrl = (typeof window !== 'undefined' && window.location) ? (window.location.origin + window.location.pathname) : 'https://mastereng.app';

    modal = document.createElement('div');
    modal.id = 'masterpet-invite-modal';
    modal.style.cssText = `position: fixed; inset: 0; z-index: 10020; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 16px;`;

    modal.innerHTML = `
      <div class="paper-cardboard-panel paper-stitches max-w-md w-full p-6 text-center animate-bounce-short border-4 border-amber-600 shadow-2xl">
        <div class="text-5xl mb-2">👥💌</div>
        <h2 class="text-xl font-black text-[#78350f] mb-1">Invitar Amigos al Santuario</h2>
        <p class="text-xs text-[#451a03] mb-4">
          Comparte MasterENG con tus amigos o tu pareja para criar Casimeritos juntos en tiempo real y practicar inglés diariamente.
        </p>

        <div class="bg-amber-100 border border-amber-300 rounded-xl p-3 text-left mb-4">
          <label class="block text-xs font-black text-amber-950 mb-1">Enlace de Invitación:</label>
          <div class="flex gap-2">
            <input type="text" id="petInviteLinkInput" readonly value="${inviteUrl}" class="flex-1 bg-white border-2 border-amber-600 rounded-lg px-3 py-1.5 text-xs font-bold text-amber-950 outline-none select-all" />
            <button type="button" onclick="window.copyPetInviteLink()" class="paper-btn-primary px-3 py-1.5 text-xs font-black">
              Copiar
            </button>
          </div>
        </div>

        <div class="flex gap-2">
          ${typeof navigator !== 'undefined' && navigator.share ? `
            <button type="button" onclick="window.sharePetInviteNative()" class="paper-btn-primary flex-1 py-2 text-xs font-black">
              📲 Compartir por WhatsApp / Redes
            </button>
          ` : ''}
          <button type="button" onclick="document.getElementById('masterpet-invite-modal').remove()" class="paper-btn-secondary ${typeof navigator !== 'undefined' && navigator.share ? 'px-4' : 'w-full'} py-2 text-xs">
            Cerrar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  };

  global.copyPetInviteLink = function () {
    const input = document.getElementById('petInviteLinkInput');
    if (input) {
      input.select();
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(input.value);
      }
      showPetPaperToast('📋 ¡Enlace de invitación copiado al portapapeles!');
    }
  };

  global.sharePetInviteNative = function () {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'MasterPet Sanctuary en MasterENG',
        text: '¡Únete conmigo a MasterPet Sanctuary para criar Casimeritos virtuales y practicar inglés juntos!',
        url: window.location.origin + window.location.pathname
      }).catch(() => {});
    }
  };

  // ==========================================================================
  // 18. LIMPIEZA TOTAL DE BOTONES FLOTANTES Y BARRAS INTRUSIVAS
  // ==========================================================================
  function removeFloatingPetButtons() {
    if (typeof document === 'undefined') return;
    ['masterpet-launcher-fab', 'masterpet-fab', 'floatingPetButton'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    const rogueBtn = document.querySelector('button[title*="MasterPet"], button[title*="Mascota 2D"]');
    if (rogueBtn && rogueBtn.id !== 'headerGlobalBackBtn') {
      rogueBtn.remove();
    }
    const viewGame = document.getElementById('view-pet-game');
    if (viewGame && !sanctuaryState.isOpen) {
      viewGame.style.display = 'none';
      viewGame.classList.add('hidden');
    }
  }
  global.removeFloatingPetButtons = removeFloatingPetButtons;

  // ==========================================================================
  // 19. EXPORTACIÓN GLOBAL DE LA API
  // ==========================================================================
  global.openPetSanctuary = openPetSanctuary;
  global.closePetSanctuary = closePetSanctuary;
  global.returnToPortals = closePetSanctuary;
  global.closeMasterPet = closePetSanctuary;
  global.renderSanctuaryHub = renderSanctuaryHub;
  global.openPetRoom = openPetRoom;
  global.loadStoredPets = loadStoredPets;
  global.speakEnglishVocab = speakEnglishVocab;
  global.renderVipPetLimitModal = renderVipPetLimitModal;

  global.MasterPet = {
    open: openPetSanctuary,
    close: closePetSanctuary,
    returnToPortals: closePetSanctuary,
    loadPets: loadStoredPets,
    getCoins: getStoredCoins,
    addCoins: addStoredCoins,
    species: PET_SPECIES,
    foods: PET_FOODS,
    cleanButtons: removeFloatingPetButtons,
    openCoop: openCleanCoopGroupModal,
    getCoopGroup: getRealCoopGroup,
    saveCoopGroup: saveRealCoopGroup,
    state: sanctuaryState
  };

  // Limpieza proactiva de cualquier botón flotante o vista residual y purga de bots
  if (typeof document !== 'undefined') {
    removeFloatingPetButtons();
    purgeFakeCoopData();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        removeFloatingPetButtons();
        purgeFakeCoopData();
      });
    } else {
      setTimeout(() => {
        removeFloatingPetButtons();
        purgeFakeCoopData();
      }, 100);
    }
  }

  console.log('[MasterPet] Sanctuary module loaded successfully.');
})(typeof window !== 'undefined' ? window : global);

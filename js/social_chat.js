/**
 * MasterENG - Social Chat & Relationship Gamification Hub (WhatsApp Web / Mobile Style)
 * Rol: Lead Realtime Social & Gamification Architect
 *
 * Características:
 * - Interfaz Split-View estilo WhatsApp (.wa-chat-layout, .wa-sidebar, .wa-chat-window)
 * - Buscador y botones: ➕ Agregar Amigo (sincronizado con localStorage y /api/users) + 👥 Crear Grupo
 * - Pestañas de filtrado: Todos, ❤️ Pareja, ⚡ Amigos, 🏠 Familia, 👥 Grupos
 * - Insignias de Rango Personal (🥉 Bronce, 🥇 Oro, 💎 Diamante), Rol de Relación y Racha activa (🔥 X días)
 * - 5 Temas Visuales por Chat (.theme-love, .theme-nature, .theme-work, .theme-space, .theme-classic)
 * - Evolución automática de Rango de Pareja / Amistad / Familia en localStorage ('mastereng_social_bonds')
 * - Panel desplegable de Misiones Semanales en Pareja / Vínculo (+1 día de racha 🔥 y +15 EXP)
 * - Acciones en Chat: 🎤 Dictado / Nota de Voz en Inglés, 🌐 Traducir mensaje recibido,
 *   🃏 Invitar a Jest (Jarz) y 🕯️ Invitar a Cita 3D (guardando 'mastereng_active_date_partner')
 * - Motor de Respuesta Inteligente en Inglés adaptado al Rol de Relación
 */

(function (global) {
  'use strict';

  const STORAGE_KEYS = {
    BONDS: 'mastereng_social_bonds',
    CONTACTS: 'mastereng_social_contacts',
    MESSAGES: 'mastereng_social_messages',
    ACTIVE_DATE_PARTNER: 'mastereng_active_date_partner',
    MY_FRIEND_CODE: 'mastereng_my_friend_code'
  };

  // ============================================================================
  // 1. CATÁLOGO DE ROLES, TEMAS Y RANGOS EVOLUTIVOS
  // ============================================================================
  const RELATIONSHIP_ROLES = {
    partner: {
      id: 'partner',
      label: '❤️ Pareja',
      shortLabel: '❤️ Pareja',
      tabKey: 'partner',
      defaultTheme: 'love'
    },
    friends: {
      id: 'friends',
      label: '⚡ Mejor Amigo / Compañero',
      shortLabel: '⚡ Amigos',
      tabKey: 'friends',
      defaultTheme: 'space'
    },
    family: {
      id: 'family',
      label: '🏠 Familia',
      shortLabel: '🏠 Familia',
      tabKey: 'family',
      defaultTheme: 'nature'
    },
    colleague: {
      id: 'colleague',
      label: '💼 Colega',
      shortLabel: '💼 Colega',
      tabKey: 'friends',
      defaultTheme: 'work'
    },
    acquaintance: {
      id: 'acquaintance',
      label: '👋 Conocido',
      shortLabel: '👋 Conocido',
      tabKey: 'friends',
      defaultTheme: 'classic'
    },
    group: {
      id: 'group',
      label: '👥 Grupo de Estudio',
      shortLabel: '👥 Grupo',
      tabKey: 'groups',
      defaultTheme: 'space'
    }
  };

  const CHAT_THEMES = {
    love: {
      id: 'love',
      cssClass: 'theme-love',
      label: '❤️ Amor (Love & Romance)',
      badgeBg: 'rgba(244, 63, 94, 0.22)',
      accent: '#fb7185'
    },
    nature: {
      id: 'nature',
      cssClass: 'theme-nature',
      label: '🌿 Naturaleza (Nature & Forest)',
      badgeBg: 'rgba(16, 185, 129, 0.22)',
      accent: '#34d399'
    },
    work: {
      id: 'work',
      cssClass: 'theme-work',
      label: '💼 Trabajo (Executive & Work)',
      badgeBg: 'rgba(56, 189, 248, 0.22)',
      accent: '#38bdf8'
    },
    space: {
      id: 'space',
      cssClass: 'theme-space',
      label: '🌌 Espacio (Cosmic Neon)',
      badgeBg: 'rgba(168, 85, 247, 0.22)',
      accent: '#c084fc'
    },
    classic: {
      id: 'classic',
      cssClass: 'theme-classic',
      label: '🌙 Clásico (WhatsApp Dark)',
      badgeBg: 'rgba(20, 184, 166, 0.22)',
      accent: '#2dd4bf'
    }
  };

  const PERSONAL_RANKS = {
    bronze: { id: 'bronze', label: '🥉 Bronce', cefr: 'A1-A2' },
    gold: { id: 'gold', label: '🥇 Oro', cefr: 'B1-B2' },
    diamond: { id: 'diamond', label: '💎 Diamante', cefr: 'C1-C2' }
  };

  // Contactos iniciales predeterminados para experiencia inmediata
  const DEFAULT_CONTACTS = [
    {
      id: 'contact_sophia',
      name: 'Sophia Valentine',
      username: 'sophia_val',
      email: 'sophia@mastereng.academy',
      friendCode: 'MENG-7742',
      avatar: '💖',
      personalRank: '💎 Diamante',
      cefr: 'C1 Advanced',
      statusText: 'Online • Ready for our 3D Date 🕯️',
      isOnline: true,
      isGroup: false
    },
    {
      id: 'contact_liam',
      name: 'Liam Carter',
      username: 'liam_bro',
      email: 'liam@mastereng.academy',
      friendCode: 'MENG-3319',
      avatar: '⚡',
      personalRank: '🥇 Oro',
      cefr: 'B2 Upper-Int',
      statusText: 'Online • Down for a 1v1 Jest match 🃏',
      isOnline: true,
      isGroup: false
    },
    {
      id: 'contact_emma',
      name: 'Emma Rodriguez',
      username: 'emma_fam',
      email: 'emma@mastereng.academy',
      friendCode: 'MENG-9012',
      avatar: '🏡',
      personalRank: '💎 Diamante',
      cefr: 'C2 Mastery',
      statusText: 'Online • Practicing TOEFL idioms 📚',
      isOnline: true,
      isGroup: false
    },
    {
      id: 'contact_noah',
      name: 'Noah Sterling',
      username: 'noah_exec',
      email: 'noah@mastereng.academy',
      friendCode: 'MENG-5120',
      avatar: '💼',
      personalRank: '🥉 Bronce',
      cefr: 'A2 Elementary',
      statusText: 'In a meeting • Reviewing English deck',
      isOnline: true,
      isGroup: false
    },
    {
      id: 'group_legends',
      name: 'English Legends Club 🏆',
      username: 'group_legends',
      email: '',
      friendCode: 'GRP-1001',
      avatar: '👥',
      personalRank: '💎 Diamante',
      cefr: 'Multi-Level',
      statusText: 'Sophia, Liam, Emma, Tú • 4 miembros activos',
      isOnline: true,
      isGroup: true,
      members: ['Sophia Valentine', 'Liam Carter', 'Emma Rodriguez', 'Tú']
    }
  ];

  const DEFAULT_BONDS = {
    contact_sophia: {
      role: 'partner',
      theme: 'love',
      streakDays: 14,
      lastInteractionDate: getTodayIso(),
      coupleExp: 340,
      weeklyDatesCount: 2,
      weeklyGamesCount: 1,
      messagesToday: 4
    },
    contact_liam: {
      role: 'friends',
      theme: 'space',
      streakDays: 11,
      lastInteractionDate: getTodayIso(),
      coupleExp: 210,
      weeklyDatesCount: 1,
      weeklyGamesCount: 1,
      messagesToday: 3
    },
    contact_emma: {
      role: 'family',
      theme: 'nature',
      streakDays: 18,
      lastInteractionDate: getTodayIso(),
      coupleExp: 420,
      weeklyDatesCount: 1,
      weeklyGamesCount: 2,
      messagesToday: 5
    },
    contact_noah: {
      role: 'colleague',
      theme: 'work',
      streakDays: 4,
      lastInteractionDate: getTodayIso(),
      coupleExp: 85,
      weeklyDatesCount: 0,
      weeklyGamesCount: 0,
      messagesToday: 1
    },
    group_legends: {
      role: 'group',
      theme: 'classic',
      streakDays: 9,
      lastInteractionDate: getTodayIso(),
      coupleExp: 190,
      weeklyDatesCount: 1,
      weeklyGamesCount: 2,
      messagesToday: 2
    }
  };

  const DEFAULT_MESSAGES = {
    contact_sophia: [
      {
        id: 'm_sophia_1',
        sender: 'them',
        senderName: 'Sophia Valentine',
        text: "Hey sweetheart! ❤️ We have a 14-day English streak together! Are you taking me to the 3D Restaurant tonight?",
        translation: "¡Hola cariño! ❤️ ¡Llevamos una racha de 14 días practicando inglés juntos! ¿Me llevarás al Restaurante 3D esta noche?",
        timestamp: '19:40',
        type: 'text'
      },
      {
        id: 'm_sophia_2',
        sender: 'me',
        senderName: 'Tú',
        text: "Of course! Let's send one more message to complete today's chat mission and head to our 3D date!",
        translation: "¡Por supuesto! ¡Enviemos un mensaje más para completar la misión de chat de hoy y vayamos a nuestra cita 3D!",
        timestamp: '19:42',
        type: 'text'
      }
    ],
    contact_liam: [
      {
        id: 'm_liam_1',
        sender: 'them',
        senderName: 'Liam Carter',
        text: "Yo bestie! ⚡ No cap, my vocabulary is leveling up fast. Ready for a 1v1 Jest (Jarz) duel?",
        translation: "¡Qué onda mejor amigo! ⚡ Sin mentir, mi vocabulario está subiendo de nivel rápido. ¿Listo para un duelo 1vs1 de Jest (Jarz)?",
        timestamp: '18:15',
        type: 'text'
      }
    ],
    contact_emma: [
      {
        id: 'm_emma_1',
        sender: 'them',
        senderName: 'Emma Rodriguez',
        text: "Hey fam! 🏡 So proud of our 18-day family streak. Let's keep practicing our English idioms!",
        translation: "¡Hola familia! 🏡 Qué orgullo nuestra racha familiar de 18 días. ¡Sigamos practicando nuestros modismos en inglés!",
        timestamp: '17:05',
        type: 'text'
      }
    ],
    contact_noah: [
      {
        id: 'm_noah_1',
        sender: 'them',
        senderName: 'Noah Sterling',
        text: "Good evening colleague! 💼 Let's practice a few business English expressions before tomorrow's presentation.",
        translation: "¡Buenas noches colega! 💼 Practiquemos algunas expresiones de inglés de negocios antes de la presentación de mañana.",
        timestamp: '16:20',
        type: 'text'
      }
    ],
    group_legends: [
      {
        id: 'm_grp_1',
        sender: 'them',
        senderName: 'Sophia Valentine',
        text: "Welcome to the English Legends Club! 🏆 Drop a message in English or challenge someone to Jest!",
        translation: "¡Bienvenidos al Club de Leyendas del Inglés! 🏆 ¡Dejen un mensaje en inglés o reten a alguien a Jest!",
        timestamp: '15:00',
        type: 'text'
      }
    ]
  };

  // ============================================================================
  // 2. ESTADO INTERNO DEL MÓDULO SOCIAL
  // ============================================================================
  let state = {
    contacts: [],
    bonds: {},
    messages: {},
    activeContactId: 'contact_sophia',
    activeTab: 'all',
    searchQuery: '',
    showMissionsDrawer: false,
    showTranslationsGlobal: false,
    translatedMsgIds: {},
    isRecordingVoice: false,
    mobileShowChatPane: false,
    typingByContact: {}
  };

  function getTodayIso() {
    try {
      return new Date().toISOString().slice(0, 10);
    } catch (e) {
      return '2026-10-24';
    }
  }

  function getCurrentTimeStr() {
    try {
      const now = new Date();
      return now.toTimeString().slice(0, 5);
    } catch (e) {
      return '20:00';
    }
  }

  // ============================================================================
  // 3. EVOLUCIÓN AUTOMÁTICA DE RANGO SEGÚN ROL Y DÍAS DE RACHA
  // ============================================================================
  function calculateBondRank(bond) {
    if (!bond) return '👋 Conocido';
    const role = bond.role || 'friends';
    const days = Number(bond.streakDays) || 0;
    const missionsActive = (Number(bond.weeklyDatesCount) || 0) + (Number(bond.weeklyGamesCount) || 0) + (Number(bond.messagesToday) || 0) >= 0;

    if (role === 'partner') {
      if (days >= 100) return '✨ Almas Gemelas / Soulmates';
      if (days >= 50 && missionsActive) return '👑 Esposos / Married';
      if (days >= 25 && missionsActive) return '💍 Prometidos / Fiancés';
      if (days >= 10 && missionsActive) return '👩❤️👨 Novios / Boyfriends';
      if (days >= 3) return '🌹 Salientes / Dating';
      return '💌 Crush';
    }

    if (role === 'friends') {
      if (days >= 25) return '🔥 Inseparables (Partners in Crime)';
      if (days >= 10) return '⚡ Mejores Amigos (Besties)';
      if (days >= 3) return '🤝 Compas (Buddies)';
      return '👋 Conocidos';
    }

    if (role === 'family') {
      if (days >= 25) return '👑 Dinastía Familiar';
      if (days >= 10) return '🛡️ Hermanos (Siblings)';
      if (days >= 3) return '🧬 Primos';
      return '🏠 Roomies';
    }

    if (role === 'colleague') {
      if (days >= 20) return '🏆 Socios Ejecutivos';
      if (days >= 7) return '🚀 Aliados de Proyecto';
      return '💼 Colegas (Coworkers)';
    }

    if (role === 'group') {
      if (days >= 15) return '👑 Escuadrón Bilingüe Élite';
      if (days >= 5) return '🔥 Comunidad Activa';
      return '👥 Grupo de Estudio';
    }

    // acquaintance
    if (days >= 7) return '🤝 Compas (Buddies)';
    return '👋 Conocidos';
  }

  // ============================================================================
  // 4. PERSISTENCIA EN LOCALSTORAGE Y SINCRONIZACIÓN DE USUARIOS
  // ============================================================================
  function loadSocialState() {
    try {
      const rawContacts = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      state.contacts = rawContacts ? JSON.parse(rawContacts) : JSON.parse(JSON.stringify(DEFAULT_CONTACTS));
      if (!Array.isArray(state.contacts) || state.contacts.length === 0) {
        state.contacts = JSON.parse(JSON.stringify(DEFAULT_CONTACTS));
      }
    } catch (e) {
      state.contacts = JSON.parse(JSON.stringify(DEFAULT_CONTACTS));
    }

    try {
      const rawBonds = localStorage.getItem(STORAGE_KEYS.BONDS);
      const parsedBonds = rawBonds ? JSON.parse(rawBonds) : {};
      state.bonds = Object.assign({}, JSON.parse(JSON.stringify(DEFAULT_BONDS)), parsedBonds);
    } catch (e) {
      state.bonds = JSON.parse(JSON.stringify(DEFAULT_BONDS));
    }

    // Garantizar que cada contacto tenga estructura completa en mastereng_social_bonds
    state.contacts.forEach(c => {
      if (!state.bonds[c.id]) {
        const defRole = c.isGroup ? 'group' : 'friends';
        state.bonds[c.id] = {
          role: defRole,
          theme: RELATIONSHIP_ROLES[defRole] ? RELATIONSHIP_ROLES[defRole].defaultTheme : 'classic',
          streakDays: 1,
          lastInteractionDate: getTodayIso(),
          coupleExp: 20,
          weeklyDatesCount: 0,
          weeklyGamesCount: 0,
          messagesToday: 0
        };
      } else {
        const b = state.bonds[c.id];
        if (!b.role) b.role = c.isGroup ? 'group' : 'friends';
        if (!b.theme) b.theme = (RELATIONSHIP_ROLES[b.role] && RELATIONSHIP_ROLES[b.role].defaultTheme) || 'classic';
        if (typeof b.streakDays !== 'number') b.streakDays = Number(b.streakDays) || 1;
        if (!b.lastInteractionDate) b.lastInteractionDate = getTodayIso();
        if (typeof b.coupleExp !== 'number') b.coupleExp = Number(b.coupleExp) || 0;
        if (typeof b.weeklyDatesCount !== 'number') b.weeklyDatesCount = Number(b.weeklyDatesCount) || 0;
        if (typeof b.weeklyGamesCount !== 'number') b.weeklyGamesCount = Number(b.weeklyGamesCount) || 0;
        if (typeof b.messagesToday !== 'number') b.messagesToday = Number(b.messagesToday) || 0;
      }
    });

    try {
      const rawMsgs = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      const parsedMsgs = rawMsgs ? JSON.parse(rawMsgs) : {};
      state.messages = Object.assign({}, JSON.parse(JSON.stringify(DEFAULT_MESSAGES)), parsedMsgs);
    } catch (e) {
      state.messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));
    }

    saveSocialState();
  }

  function saveSocialState() {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(state.contacts));
      localStorage.setItem(STORAGE_KEYS.BONDS, JSON.stringify(state.bonds));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(state.messages));
    } catch (e) {
      console.warn('[SocialChat] No se pudo guardar en localStorage:', e);
    }
  }

  function getMyFriendCode() {
    try {
      let code = localStorage.getItem(STORAGE_KEYS.MY_FRIEND_CODE);
      if (!code) {
        code = 'MENG-' + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem(STORAGE_KEYS.MY_FRIEND_CODE, code);
      }
      return code;
    } catch (e) {
      return 'MENG-2026';
    }
  }

  // Sincronización con usuarios locales registrados y /api/users
  async function discoverRegisteredUsers() {
    const discovered = [];
    const seen = new Set();

    function addCandidate(u) {
      if (!u || typeof u !== 'object') return;
      const username = (u.username || u.name || u.displayName || '').trim();
      const email = (u.email || '').trim();
      const code = (u.friendCode || u.code || '').trim();
      if (!username && !email) return;
      const key = (username || email).toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);

      const exp = Number(u.exp || u.xp || 0);
      let personalRank = '🥉 Bronce';
      if (exp >= 1500) personalRank = '💎 Diamante';
      else if (exp >= 500) personalRank = '🥇 Oro';

      discovered.push({
        username: username || email.split('@')[0],
        email: email || `${username.toLowerCase().replace(/\s+/g, '')}@mastereng.academy`,
        friendCode: code || ('MENG-' + Math.abs(hashCode(key)).toString().slice(0, 4).padEnd(4, '7')),
        personalRank,
        avatar: u.avatar || '🧑‍🎓'
      });
    }

    // 1. Revisar llaves de usuarios en localStorage
    const localKeys = ['mastereng_users', 'registered_users', 'english_app_users', 'users_db', 'mastereng_registered_users'];
    localKeys.forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) parsed.forEach(addCandidate);
        else if (parsed && typeof parsed === 'object') Object.values(parsed).forEach(addCandidate);
      } catch (e) {}
    });

    // 2. Consultar /api/users si está disponible
    try {
      const apiBase = (global.BackendSync && global.BackendSync.apiBaseUrl)
        ? global.BackendSync.apiBaseUrl
        : '/api';
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), 2500) : null;
      const res = await fetch(`${apiBase.replace(/\/$/, '')}/users`, controller ? { signal: controller.signal } : {});
      if (timer) clearTimeout(timer);
      if (res && res.ok) {
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (Array.isArray(data.users) ? data.users : []);
        arr.forEach(addCandidate);
      }
    } catch (e) {
      // Fallback silencioso a usuarios locales + sugeridos de la academia
    }

    // 3. Usuarios sugeridos adicionales de la comunidad MasterENG
    const communityDirectory = [
      { username: 'Olivia Bennett', email: 'olivia@mastereng.academy', friendCode: 'MENG-8821', personalRank: '💎 Diamante', avatar: '🌸' },
      { username: 'Ethan Huntley', email: 'ethan@mastereng.academy', friendCode: 'MENG-4410', personalRank: '🥇 Oro', avatar: '🎸' },
      { username: 'Chloe Takahashi', email: 'chloe@mastereng.academy', friendCode: 'MENG-6193', personalRank: '💎 Diamante', avatar: '🚀' },
      { username: 'Mateo Silva', email: 'mateo@mastereng.academy', friendCode: 'MENG-2094', personalRank: '🥉 Bronce', avatar: '⚽' }
    ];
    communityDirectory.forEach(addCandidate);

    return discovered;
  }

  function hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return h;
  }

  // ============================================================================
  // 5. MOTOR DE RESPUESTA INTELIGENTE EN INGLÉS ADAPTADO AL ROL
  // ============================================================================
  const SMART_REPLIES_BY_ROLE = {
    partner: [
      {
        en: "Aw, I love chatting in English with you, my love! ❤️ Every message brings us closer to Soulmates rank. Shall we go to the 3D Restaurant for a romantic date?",
        es: "¡Ay, me encanta chatear en inglés contigo, mi amor! ❤️ Cada mensaje nos acerca más al rango Almas Gemelas. ¿Vamos al Restaurante 3D a una cita romántica?"
      },
      {
        en: "You're doing amazing with your English, sweetheart! 🌹 Keep messaging me so our 🔥 streak never dies!",
        es: "¡Lo estás haciendo increíble con tu inglés, cariño! 🌹 ¡Sigue escribiéndome para que nuestra racha 🔥 nunca se apague!"
      },
      {
        en: "Missing you, honey! 💌 Let's play a quick 1v1 match of Jest (Jarz) or grab a candlelit table in the 3D World!",
        es: "¡Te extraño, cielo! 💌 ¡Juguemos una partida rápida 1vs1 de Jest (Jarz) o tomemos una mesa con velas en el Mundo 3D!"
      },
      {
        en: "Your English grammar is looking so sharp today, darling! ✨ Tell me more about your favorite dream trip together.",
        es: "¡Tu gramática en inglés se ve impecable hoy, amor! ✨ Cuéntame más sobre nuestro viaje soñado juntos."
      }
    ],
    friends: [
      {
        en: "Yo bestie! ⚡ That English sentence was fire, no cap! Let's keep our streak alive and crush a Jest 1v1 duel!",
        es: "¡Qué onda mejor amigo! ⚡ ¡Esa oración en inglés estuvo brutal, sin mentir! ¡Mantengamos viva nuestra racha y rompámosla en un duelo 1vs1 de Jest!"
      },
      {
        en: "Bro, high key proud of our streak! 🔥 Hit the '🃏 Invitar a Jest' button whenever you're ready to get schooled!",
        es: "¡Hermano, súper orgulloso de nuestra racha! 🔥 ¡Presiona el botón '🃏 Invitar a Jest' cuando estés listo para el reto!"
      },
      {
        en: "Awesome point, buddy! 🤝 Practicing daily in this chat is the fastest way to reach Diamond rank!",
        es: "¡Excelente punto, compa! 🤝 ¡Practicar a diario en este chat es la forma más rápida de llegar a rango Diamante!"
      }
    ],
    family: [
      {
        en: "So proud of you, fam! 🏡 Our family English streak is unstoppable. Are you coming over to the 3D lounge later?",
        es: "¡Qué orgullo de ti, familia! 🏡 Nuestra racha familiar de inglés es imparable. ¿Vienes a la sala 3D más tarde?"
      },
      {
        en: "That's the spirit, sibling! 🛡️ Let's finish today's 5-message mission together so our family bond levels up!",
        es: "¡Ese es el espíritu, hermano! 🛡️ ¡Terminemos juntos la misión de 5 mensajes de hoy para subir nuestro vínculo familiar!"
      }
    ],
    colleague: [
      {
        en: "Great point, colleague! 💼 Your professional English communication is improving remarkably. Let's touch base on the next module.",
        es: "¡Excelente punto, colega! 💼 Tu comunicación profesional en inglés está mejorando notablemente. Revisemos el siguiente módulo."
      },
      {
        en: "Well articulated! 🚀 Consistent daily practice is key for executive fluency and TOEFL certification.",
        es: "¡Muy bien articulado! 🚀 La práctica diaria constante es clave para la fluidez ejecutiva y la certificación TOEFL."
      }
    ],
    acquaintance: [
      {
        en: "Nice chatting with you! 👋 Keep sending messages in English so we can level up our friendship bond!",
        es: "¡Qué gusto charlar contigo! 👋 ¡Sigue enviando mensajes en inglés para que subamos nuestro vínculo de amistad!"
      }
    ],
    group: [
      {
        en: "Awesome energy in the club today! 🏆 Keep the English conversation flowing or launch a group Jest challenge!",
        es: "¡Increíble energía en el club hoy! 🏆 ¡Mantengan viva la conversación en inglés o lancen un reto grupal de Jest!"
      }
    ]
  };

  function generateContextualSmartReply(userText, role, contactName) {
    const clean = (userText || '').toLowerCase();
    if (clean.includes('date') || clean.includes('cita') || clean.includes('restaurant') || clean.includes('dinner')) {
      if (role === 'partner') {
        return {
          en: "Yes, my love! 🕯️❤️ I'm ready for our romantic 3D date! Click '🕯️ Invitar a Cita 3D' and let's go right now!",
          es: "¡Sí, mi amor! 🕯️❤️ ¡Estoy lista para nuestra cita romántica 3D! ¡Haz clic en '🕯️ Invitar a Cita 3D' y vamos ahora mismo!"
        };
      }
      return {
        en: "Sounds great! 🕯️ Let's head over to the 3D Restaurant hangout! Tap '🕯️ Invitar a Cita 3D'!",
        es: "¡Suena genial! 🕯️ ¡Vamos al punto de encuentro en el Restaurante 3D! ¡Toca '🕯️ Invitar a Cita 3D'!"
      };
    }

    if (clean.includes('jest') || clean.includes('jarz') || clean.includes('game') || clean.includes('duel') || clean.includes('play')) {
      return {
        en: "Challenge accepted! 🃏🔥 Send the Jest (Jarz) 1v1 invite card and let's see who guesses the English words faster!",
        es: "¡Reto aceptado! 🃏🔥 ¡Envía la tarjeta de invitación 1vs1 de Jest (Jarz) y veamos quién adivina las palabras en inglés más rápido!"
      };
    }

    const pool = SMART_REPLIES_BY_ROLE[role] || SMART_REPLIES_BY_ROLE.friends;
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }

  // ============================================================================
  // 6. MONTAJE DEL CONTENEDOR #view-community Y NAVEGACIÓN
  // ============================================================================
  function ensureCommunityViewContainer() {
    let viewEl = document.getElementById('view-community');
    if (!viewEl) {
      viewEl = document.createElement('div');
      viewEl.id = 'view-community';
      viewEl.className = 'w-full flex-1 hidden';
      const parent = document.getElementById('app-main') ||
                     document.getElementById('main-content') ||
                     (document.getElementById('view-home') && document.getElementById('view-home').parentNode) ||
                     document.body;
      parent.appendChild(viewEl);
    }
    return viewEl;
  }

  function openCommunityHubView(options = {}) {
    loadSocialState();
    const viewEl = ensureCommunityViewContainer();

    // Ocultar otras vistas principales si están visibles
    ['view-auth', 'view-home', 'view-path', 'view-stories', 'view-music', 'view-worldtour', 'view-jest'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('hidden');
        el.style.setProperty('display', 'none', 'important');
      }
    });

    if (typeof global.pauseWorld3D === 'function') {
      try { global.pauseWorld3D(); } catch (e) {}
    }
    if (typeof global.pauseYouTubePlayer === 'function') {
      try { global.pauseYouTubePlayer(); } catch (e) {}
    }

    viewEl.classList.remove('hidden');
    viewEl.style.setProperty('display', 'block', 'important');
    viewEl.style.setProperty('visibility', 'visible', 'important');
    viewEl.style.setProperty('opacity', '1', 'important');
    viewEl.style.setProperty('pointer-events', 'auto', 'important');

    if (options && options.contactId && state.bonds[options.contactId]) {
      state.activeContactId = options.contactId;
    }

    renderCommunityHub();
    scrollToBottomMessages();
  }

  // ============================================================================
  // 7. RENDERIZADO PRINCIPAL SPLIT-VIEW (WHATSAPP WEB / MOBILE)
  // ============================================================================
  function getActiveContact() {
    let c = state.contacts.find(x => x.id === state.activeContactId);
    if (!c && state.contacts.length > 0) {
      c = state.contacts[0];
      state.activeContactId = c.id;
    }
    return c;
  }

  function getFilteredContacts() {
    const q = (state.searchQuery || '').toLowerCase().trim();
    return state.contacts.filter(c => {
      const bond = state.bonds[c.id] || {};
      const role = bond.role || (c.isGroup ? 'group' : 'friends');

      // Filtrado por pestaña
      if (state.activeTab === 'partner' && role !== 'partner') return false;
      if (state.activeTab === 'friends' && !['friends', 'colleague', 'acquaintance'].includes(role)) return false;
      if (state.activeTab === 'family' && role !== 'family') return false;
      if (state.activeTab === 'groups' && !c.isGroup && role !== 'group') return false;

      // Filtrado por texto
      if (q) {
        const hay = `${c.name} ${c.username || ''} ${c.email || ''} ${c.friendCode || ''} ${calculateBondRank(bond)}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function renderCommunityHub() {
    const viewEl = ensureCommunityViewContainer();
    const activeContact = getActiveContact();
    const activeBond = activeContact ? (state.bonds[activeContact.id] || DEFAULT_BONDS.contact_sophia) : DEFAULT_BONDS.contact_sophia;
    const activeThemeObj = CHAT_THEMES[activeBond.theme] || CHAT_THEMES.classic;
    const bondRankLabel = calculateBondRank(activeBond);
    const filteredContacts = getFilteredContacts();
    const myCode = getMyFriendCode();

    const m1Progress = Math.min(5, Number(activeBond.messagesToday) || 0);
    const m2Progress = Math.min(3, Number(activeBond.weeklyDatesCount) || 0);
    const m3Progress = Math.min(2, Number(activeBond.weeklyGamesCount) || 0);

    viewEl.innerHTML = `
      <div class="wa-chat-wrapper">
        <!-- Barra Superior de Navegación Social -->
        <div class="wa-top-SystemBar">
          <div class="flex items-center gap-2.5">
            <button type="button" onclick="window.SocialChat.returnToHub()"
              class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition">
              <span>← Volver a Portales</span>
            </button>
            <div class="flex items-center gap-2">
              <span class="text-lg">💬</span>
              <div>
                <h2 class="text-sm font-black text-white leading-tight">MasterENG Social & Couples Hub</h2>
                <p class="text-[11px] text-emerald-400 font-semibold">Tu Código de Amigo: <span class="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300">${escapeHtml(myCode)}</span></p>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" onclick="window.SocialChat.openAddFriendModal()"
              class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg flex items-center gap-1 cursor-pointer transition">
              <span>➕ Agregar Amigo</span>
            </button>
            <button type="button" onclick="window.SocialChat.openCreateGroupModal()"
              class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg flex items-center gap-1 cursor-pointer transition">
              <span>👥 Crear Grupo</span>
            </button>
          </div>
        </div>

        <!-- Contenedor Split-View Estilo WhatsApp Web / Mobile -->
        <div class="wa-chat-layout ${state.mobileShowChatPane ? 'wa-mobile-chat-active' : ''}">
          
          <!-- ============================================================
               PANEL IZQUIERDO (SIDEBAR DE CONTACTOS, RACHAS Y GRUPOS)
               ============================================================ -->
          <aside class="wa-sidebar">
            <!-- Buscador + Acciones Rápidas -->
            <div class="wa-sidebar-header">
              <div class="wa-search-box">
                <span class="text-slate-400 text-xs">🔍</span>
                <input
                  id="waSidebarSearchInput"
                  type="text"
                  value="${escapeHtml(state.searchQuery)}"
                  placeholder="Buscar amigo, pareja, rango o código..."
                  oninput="window.SocialChat.handleSearch(this.value)"
                />
              </div>
              <div class="flex items-center gap-1.5 mt-2">
                <button type="button" onclick="window.SocialChat.openAddFriendModal()"
                  class="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600/25 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold cursor-pointer transition">
                  ➕ Agregar Amigo
                </button>
                <button type="button" onclick="window.SocialChat.openCreateGroupModal()"
                  class="flex-1 py-1.5 px-2.5 rounded-lg bg-purple-600/25 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 text-[11px] font-bold cursor-pointer transition">
                  👥 Crear Grupo
                </button>
              </div>
            </div>

            <!-- Pestañas de Categoría: Todos, ❤️ Pareja, ⚡ Amigos, 🏠 Familia, 👥 Grupos -->
            <div class="wa-tabs-bar" role="tablist">
              ${renderTabButton('all', 'Todos')}
              ${renderTabButton('partner', '❤️ Pareja')}
              ${renderTabButton('friends', '⚡ Amigos')}
              ${renderTabButton('family', '🏠 Familia')}
              ${renderTabButton('groups', '👥 Grupos')}
            </div>

            <!-- Lista de Chats -->
            <div class="wa-contacts-list" id="waContactsList">
              ${filteredContacts.length === 0 ? `
                <div class="p-6 text-center text-slate-400 text-xs">
                  <p class="text-2xl mb-2">💬</p>
                  <p class="font-bold text-slate-300">No hay conversaciones en esta pestaña</p>
                  <p class="mt-1">Usa el botón <b>➕ Agregar Amigo</b> o cambia el Rol de Relación en cualquier chat.</p>
                </div>
              ` : filteredContacts.map(c => renderSidebarContactItem(c)).join('')}
            </div>
          </aside>

          <!-- ============================================================
               PANEL DERECHO (VENTANA DE CHAT ACTIVA + TEMA + MISIONES)
               ============================================================ -->
          <section class="wa-chat-window ${activeThemeObj.cssClass}" id="waActiveChatWindow">
            <!-- Header del Chat Activo -->
            <header class="wa-chat-header">
              <div class="flex items-center gap-2.5 min-w-0">
                <button type="button" class="wa-mobile-back-btn" onclick="window.SocialChat.backToSidebarMobile()" title="Volver a lista de chats">
                  ←
                </button>
                <div class="wa-avatar-circle">
                  <span>${activeContact ? activeContact.avatar : '💬'}</span>
                  <span class="wa-online-dot"></span>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <h3 class="text-sm font-black text-white truncate">${escapeHtml(activeContact ? activeContact.name : 'Chat')}</h3>
                    <span class="wa-rank-pill" title="Insignia de Rango Personal">
                      ${escapeHtml(activeContact ? activeContact.personalRank : '💎 Diamante')}
                    </span>
                    <span class="wa-streak-pill" title="Racha activa de días seguidos practicando inglés">
                      🔥 ${Number(activeBond.streakDays) || 0} días
                    </span>
                  </div>
                  <div class="flex items-center gap-2 flex-wrap mt-0.5">
                    <span class="wa-bond-rank-badge" id="waHeaderBondRankBadge">
                      ${escapeHtml(bondRankLabel)}
                    </span>
                    <span class="text-[11px] text-slate-300/90 truncate">
                      ${state.typingByContact[activeContact.id]
                        ? '✍️ typing in English...'
                        : escapeHtml(activeContact ? activeContact.statusText : '')}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Controles de Cabecera: Selector de Rol de Relación, Selector de Tema Visual y Botón de Misiones -->
              <div class="wa-header-controls">
                <!-- Selector de Rol de Relación -->
                <label class="wa-select-wrapper" title="Cambiar Rol de Relación">
                  <span class="wa-select-label">Vínculo:</span>
                  <select id="waRoleSelector" onchange="window.SocialChat.changeRelationshipRole('${activeContact.id}', this.value)">
                    <option value="partner" ${activeBond.role === 'partner' ? 'selected' : ''}>❤️ Pareja</option>
                    <option value="friends" ${activeBond.role === 'friends' ? 'selected' : ''}>⚡ Mejor Amigo / Compañero</option>
                    <option value="family" ${activeBond.role === 'family' ? 'selected' : ''}>🏠 Familia</option>
                    <option value="colleague" ${activeBond.role === 'colleague' ? 'selected' : ''}>💼 Colega</option>
                    <option value="acquaintance" ${activeBond.role === 'acquaintance' ? 'selected' : ''}>👋 Conocido</option>
                    ${activeContact && activeContact.isGroup ? `<option value="group" ${activeBond.role === 'group' ? 'selected' : ''}>👥 Grupo</option>` : ''}
                  </select>
                </label>

                <!-- Selector de Tema Visual del Chat (Change Chat Theme) -->
                <label class="wa-select-wrapper" title="Cambiar Tema Visual del Chat (Change Chat Theme)">
                  <span class="wa-select-label">Tema:</span>
                  <select id="waThemeSelector" onchange="window.SocialChat.changeChatTheme('${activeContact.id}', this.value)">
                    <option value="love" ${activeBond.theme === 'love' ? 'selected' : ''}>❤️ Amor (Love & Romance)</option>
                    <option value="nature" ${activeBond.theme === 'nature' ? 'selected' : ''}>🌿 Naturaleza (Nature & Forest)</option>
                    <option value="work" ${activeBond.theme === 'work' ? 'selected' : ''}>💼 Trabajo (Executive & Work)</option>
                    <option value="space" ${activeBond.theme === 'space' ? 'selected' : ''}>🌌 Espacio (Cosmic Neon)</option>
                    <option value="classic" ${activeBond.theme === 'classic' ? 'selected' : ''}>🌙 Clásico (WhatsApp Dark)</option>
                  </select>
                </label>

                <!-- Botón Desplegable de Misiones Semanales en Pareja / Vínculo -->
                <button type="button" onclick="window.SocialChat.toggleMissionsDrawer()"
                  class="wa-missions-toggle-btn ${state.showMissionsDrawer ? 'active' : ''}">
                  <span>🎯 Misiones (${ (m1Progress >= 5 ? 1 : 0) + (m2Progress >= 3 ? 1 : 0) + (m3Progress >= 2 ? 1 : 0) }/3)</span>
                  <span class="tutorial-hand-pointer">👆</span>
                </button>
              </div>
            </header>

            <!-- Panel Desplegable de "Misiones de Vínculo / Pareja" dentro del Chat -->
            <div id="waMissionsDrawer" class="wa-missions-drawer ${state.showMissionsDrawer ? 'open' : ''}">
              <div class="wa-missions-header">
                <div>
                  <h4 class="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    <span>🔥 Misiones Semanales de Vínculo & Pareja</span>
                    <span class="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-extrabold">${escapeHtml(bondRankLabel)}</span>
                  </h4>
                  <p class="text-[11px] text-slate-200/90 mt-0.5">
                    Completa misiones con <b>${escapeHtml(activeContact.name)}</b> para subir su racha 🔥 y evolucionar de rango automáticamente.
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-extrabold text-amber-300">✨ ${Number(activeBond.coupleExp) || 0} EXP de Vínculo</span>
                  <button type="button" onclick="window.SocialChat.toggleMissionsDrawer()" class="text-slate-300 hover:text-white text-sm font-bold px-2 py-0.5 rounded bg-black/20 cursor-pointer">✕</button>
                </div>
              </div>

              <!-- Escalera de Evolución del Rol actual -->
              <div class="wa-evolution-track">
                ${renderRoleEvolutionSteps(activeBond)}
              </div>

              <!-- Las 3 Misiones Interactivas -->
              <div class="wa-missions-grid">
                <!-- Misión 1 -->
                <div class="wa-mission-card ${m1Progress >= 5 ? 'completed' : ''}">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-extrabold text-white">💬 Chatear en inglés hoy (5 mensajes)</span>
                    <span class="wa-mission-badge">${m1Progress}/5</span>
                  </div>
                  <p class="text-[11px] text-slate-300 mt-1">Recompensa: <b>+1 día de racha 🔥</b> y <b>+15 EXP de vínculo</b></p>
                  <div class="wa-progress-bar mt-2">
                    <div class="wa-progress-fill" style="width: ${(m1Progress / 5) * 100}%"></div>
                  </div>
                </div>

                <!-- Misión 2 -->
                <div class="wa-mission-card ${m2Progress >= 3 ? 'completed' : ''}">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-extrabold text-white">🕯️ Ir a 3 Citas en el Restaurante 3D esta semana (Progreso: ${m2Progress}/3)</span>
                  </div>
                  <div class="wa-progress-bar mt-1.5 mb-2">
                    <div class="wa-progress-fill" style="width: ${(m2Progress / 3) * 100}%"></div>
                  </div>
                  <button type="button" onclick="window.SocialChat.goTo3DDateNow('${activeContact.id}')"
                    class="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-[11px] font-black shadow-md cursor-pointer transition">
                    🕯️ Ir a Cita 3D Ahora
                  </button>
                </div>

                <!-- Misión 3 -->
                <div class="wa-mission-card ${m3Progress >= 2 ? 'completed' : ''}">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-extrabold text-white">🃏 Jugar 2 partidas de Jest/Jarz (Headbanz) juntos (Progreso: ${m3Progress}/2)</span>
                  </div>
                  <div class="wa-progress-bar mt-1.5 mb-2">
                    <div class="wa-progress-fill" style="width: ${(m3Progress / 2) * 100}%"></div>
                  </div>
                  <button type="button" onclick="window.SocialChat.sendJestInvite('${activeContact.id}', true)"
                    class="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-[11px] font-black shadow-md cursor-pointer transition">
                    🃏 Invitar a Duelo Jest
                  </button>
                </div>
              </div>
            </div>

            <!-- Área de Mensajes del Chat -->
            <div class="wa-messages-container" id="waMessagesContainer">
              <div class="wa-encryption-banner">
                🔒 English Immersion Chat • Rango actual con <b>${escapeHtml(activeContact.name)}</b>: <b>${escapeHtml(bondRankLabel)}</b> (🔥 ${Number(activeBond.streakDays) || 0} días seguidos)
              </div>
              ${renderMessagesForContact(activeContact.id)}
            </div>

            <!-- Barra Rápida de Acciones Especiales: Dictado, Traducción, Invitar a Jest, Invitar a Cita 3D -->
            <div class="wa-quick-actions-strip">
              <button type="button" onclick="window.SocialChat.toggleVoiceDictation()"
                id="waVoiceDictateBtn"
                class="wa-action-chip ${state.isRecordingVoice ? 'recording' : ''}">
                <span>🎤 Nota de Voz / Dictado en Inglés</span>
              </button>

              <button type="button" onclick="window.SocialChat.toggleTranslateReceived()"
                class="wa-action-chip ${state.showTranslationsGlobal ? 'active' : ''}">
                <span>🌐 Traducir mensaje recibido</span>
              </button>

              <button type="button" onclick="window.SocialChat.sendJestInvite('${activeContact.id}', false)"
                class="wa-action-chip chip-jest">
                <span>🃏 Invitar a Jest (Jarz)</span>
              </button>

              <button type="button" onclick="window.SocialChat.send3DDateInvite('${activeContact.id}')"
                class="wa-action-chip chip-date3d">
                <span>🕯️ Invitar a Cita 3D</span>
              </button>
            </div>

            <!-- Barra Inferior de Entrada de Mensaje -->
            <div class="wa-input-bar">
              <button type="button" onclick="window.SocialChat.toggleVoiceDictation()"
                class="wa-icon-btn ${state.isRecordingVoice ? 'recording' : ''}"
                title="Dictar mensaje o grabar nota de voz en inglés">
                🎤
              </button>
              <input
                id="socialChatMessageInput"
                type="text"
                placeholder="Write a message in English to ${escapeHtml(activeContact.name)}..."
                onkeydown="if(event.key==='Enter'){ event.preventDefault(); window.SocialChat.sendMessageFromInput(); }"
              />
              <button type="button" onclick="window.SocialChat.sendMessageFromInput()"
                class="wa-send-btn">
                <span>Enviar ➤</span>
              </button>
            </div>
          </section>
        </div>

        <!-- Modal para ➕ Agregar Amigo -->
        <div id="waAddFriendModal" class="wa-modal-backdrop hidden"></div>

        <!-- Modal para 👥 Crear Grupo -->
        <div id="waCreateGroupModal" class="wa-modal-backdrop hidden"></div>
      </div>
    `;
  }

  function renderTabButton(tabKey, label) {
    const isActive = state.activeTab === tabKey;
    return `
      <button type="button"
        onclick="window.SocialChat.selectTab('${tabKey}')"
        class="wa-tab-btn ${isActive ? 'active' : ''}">
        ${label}
      </button>
    `;
  }

  function renderSidebarContactItem(contact) {
    const bond = state.bonds[contact.id] || {};
    const isSelected = contact.id === state.activeContactId;
    const bondRank = calculateBondRank(bond);
    const roleMeta = RELATIONSHIP_ROLES[bond.role] || RELATIONSHIP_ROLES.friends;
    const msgs = state.messages[contact.id] || [];
    const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
    const lastText = lastMsg ? lastMsg.text : 'Tap to start practicing English!';
    const lastTime = lastMsg ? lastMsg.timestamp : ' Ahora';

    return `
      <div class="wa-contact-item ${isSelected ? 'active' : ''}"
           onclick="window.SocialChat.selectContact('${contact.id}')">
        <div class="wa-avatar-circle">
          <span>${contact.avatar || '💬'}</span>
          ${contact.isOnline ? '<span class="wa-online-dot"></span>' : ''}
        </div>
        <div class="wa-contact-info">
          <div class="flex items-center justify-between gap-1">
            <span class="wa-contact-name truncate">${escapeHtml(contact.name)}</span>
            <span class="wa-contact-time">${escapeHtml(lastTime)}</span>
          </div>
          <div class="flex items-center gap-1 flex-wrap my-0.5">
            <span class="wa-mini-badge rank">${escapeHtml(contact.personalRank || '🥉 Bronce')}</span>
            <span class="wa-mini-badge role">${escapeHtml(roleMeta.shortLabel)}</span>
            <span class="wa-mini-badge bond">${escapeHtml(bondRank)}</span>
            <span class="wa-mini-badge streak">🔥 ${Number(bond.streakDays) || 0} días</span>
          </div>
          <p class="wa-contact-preview truncate">${escapeHtml(lastText)}</p>
        </div>
      </div>
    `;
  }

  function renderRoleEvolutionSteps(bond) {
    const role = bond.role || 'friends';
    const days = Number(bond.streakDays) || 0;
    let steps = [];

    if (role === 'partner') {
      steps = [
        { label: '💌 Crush', min: 0 },
        { label: '🌹 Salientes / Dating', min: 3 },
        { label: '👩❤️👨 Novios / Boyfriends', min: 10 },
        { label: '💍 Prometidos / Fiancés', min: 25 },
        { label: '👑 Esposos / Married', min: 50 },
        { label: '✨ Almas Gemelas / Soulmates', min: 100 }
      ];
    } else if (role === 'family') {
      steps = [
        { label: '🏠 Roomies', min: 0 },
        { label: '🧬 Primos', min: 3 },
        { label: '🛡️ Hermanos (Siblings)', min: 10 },
        { label: '👑 Dinastía Familiar', min: 25 }
      ];
    } else {
      steps = [
        { label: '👋 Conocidos', min: 0 },
        { label: '🤝 Compas (Buddies)', min: 3 },
        { label: '⚡ Mejores Amigos (Besties)', min: 10 },
        { label: '🔥 Inseparables (Partners in Crime)', min: 25 }
      ];
    }

    return steps.map(s => {
      const unlocked = days >= s.min;
      return `
        <div class="wa-evo-step ${unlocked ? 'unlocked' : ''}">
          <span>${s.label}</span>
          <span class="text-[9px] opacity-75">(${s.min}+ d)</span>
        </div>
      `;
    }).join('<span class="text-slate-400 text-xs">➔</span>');
  }

  function renderMessagesForContact(contactId) {
    const list = state.messages[contactId] || [];
    const contact = state.contacts.find(c => c.id === contactId);
    const friendName = contact ? contact.name : 'Friend';

    return list.map(m => {
      const isMe = m.sender === 'me';
      const showTrans = state.showTranslationsGlobal || !!state.translatedMsgIds[m.id];

      if (m.type === 'jest_invite') {
        return `
          <div class="wa-bubble-row ${isMe ? 'sent' : 'received'}">
            <div class="wa-invite-card wa-invite-card-jest jest-invite-card">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-2xl">🃏</span>
                <div>
                  <div class="text-xs font-black uppercase tracking-wider text-amber-300">Reto Oficial • Jest / Jarz (Headbanz)</div>
                  <div class="text-sm font-extrabold text-white">Duelo de Adivinanza en Inglés 1vs1</div>
                </div>
              </div>
              <p class="text-xs text-slate-200 mb-2.5">${escapeHtml(m.text)}</p>
              <button type="button"
                onclick="window.SocialChat.acceptJestDuel('${escapeHtml(contactId)}', '${escapeHtml(friendName)}')"
                class="wa-invite-cta-btn jest-cta">
                ⚔️ Aceptar Duelo 1vs1
              </button>
              <span class="wa-bubble-time">${escapeHtml(m.timestamp || '')}</span>
            </div>
          </div>
        `;
      }

      if (m.type === 'date3d_invite') {
        return `
          <div class="wa-bubble-row ${isMe ? 'sent' : 'received'}">
            <div class="wa-invite-card wa-invite-card-date3d date3d-invite-card">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-2xl">🕯️</span>
                <div>
                  <div class="text-xs font-black uppercase tracking-wider text-rose-300">Invitación Especial • Mundo de Citas 3D</div>
                  <div class="text-sm font-extrabold text-white">Cena Interactiva en el Restaurante 3D</div>
                </div>
              </div>
              <p class="text-xs text-slate-200 mb-2.5">${escapeHtml(m.text)}</p>
              <button type="button"
                onclick="window.SocialChat.goTo3DDateNow('${escapeHtml(contactId)}')"
                class="wa-invite-cta-btn date3d-cta">
                🕯️ Entrar a Cita 3D con ${escapeHtml(friendName)}
              </button>
              <span class="wa-bubble-time">${escapeHtml(m.timestamp || '')}</span>
            </div>
          </div>
        `;
      }

      return `
        <div class="wa-bubble-row ${isMe ? 'sent' : 'received'}">
          <div class="wa-bubble ${isMe ? 'wa-bubble-sent' : 'wa-bubble-received'}">
            ${!isMe && m.senderName ? `<div class="wa-bubble-sender">${escapeHtml(m.senderName)}</div>` : ''}
            <div class="wa-bubble-text">
              ${m.isVoiceNote ? '<span class="inline-block mr-1 text-amber-300">🎤 [Voice Note]</span>' : ''}
              ${escapeHtml(m.text)}
            </div>
            ${showTrans && m.translation ? `
              <div class="wa-bubble-translation">
                🌐 ES: ${escapeHtml(m.translation)}
              </div>
            ` : ''}
            <div class="wa-bubble-footer">
              <button type="button" onclick="window.SocialChat.speakMessage('${escapeJsStr(m.text)}')" class="wa-mini-icon-btn" title="Escuchar pronunciación en inglés">🔊</button>
              ${m.translation ? `<button type="button" onclick="window.SocialChat.toggleSingleTranslation('${m.id}')" class="wa-mini-icon-btn" title="Traducir mensaje">🌐</button>` : ''}
              <span class="wa-bubble-time">${escapeHtml(m.timestamp || '')} ${isMe ? '✓✓' : ''}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ============================================================================
  // 8. ACCIONES INTERACTIVAS: ROLES, TEMAS, MENSAJES, VOZ, JEST Y CITAS 3D
  // ============================================================================
  function selectContact(contactId) {
    state.activeContactId = contactId;
    state.mobileShowChatPane = true;
    renderCommunityHub();
    scrollToBottomMessages();
  }

  function backToSidebarMobile() {
    state.mobileShowChatPane = false;
    renderCommunityHub();
  }

  function selectTab(tabKey) {
    state.activeTab = tabKey;
    renderCommunityHub();
  }

  function handleSearch(val) {
    state.searchQuery = val || '';
    const listEl = document.getElementById('waContactsList');
    if (listEl) {
      const filtered = getFilteredContacts();
      listEl.innerHTML = filtered.map(c => renderSidebarContactItem(c)).join('');
    }
  }

  function changeRelationshipRole(contactId, newRole) {
    if (!state.bonds[contactId]) return;
    state.bonds[contactId].role = newRole;
    if (RELATIONSHIP_ROLES[newRole] && RELATIONSHIP_ROLES[newRole].defaultTheme) {
      state.bonds[contactId].theme = RELATIONSHIP_ROLES[newRole].defaultTheme;
    }
    saveSocialState();
    const newRank = calculateBondRank(state.bonds[contactId]);
    showSocialToast(`Vínculo actualizado: ${RELATIONSHIP_ROLES[newRole].label} (${newRank})`);
    renderCommunityHub();
  }

  function changeChatTheme(contactId, newTheme) {
    if (!state.bonds[contactId] || !CHAT_THEMES[newTheme]) return;
    state.bonds[contactId].theme = newTheme;
    saveSocialState();

    const chatWin = document.getElementById('waActiveChatWindow');
    if (chatWin) {
      Object.values(CHAT_THEMES).forEach(t => chatWin.classList.remove(t.cssClass));
      chatWin.classList.add(CHAT_THEMES[newTheme].cssClass);
    }
    showSocialToast(`Tema aplicado: ${CHAT_THEMES[newTheme].label}`);
  }

  function toggleMissionsDrawer() {
    state.showMissionsDrawer = !state.showMissionsDrawer;
    renderCommunityHub();
  }

  function recordMessageAndCheckMissions(contactId) {
    const bond = state.bonds[contactId];
    if (!bond) return;

    const prevCount = Number(bond.messagesToday) || 0;
    bond.messagesToday = prevCount + 1;
    bond.lastInteractionDate = getTodayIso();
    bond.coupleExp = (Number(bond.coupleExp) || 0) + 5;

    // Misión 1: 💬 Chatear en inglés hoy (5 mensajes) -> Sube +1 día de racha 🔥 y +15 EXP de vínculo
    if (prevCount < 5 && bond.messagesToday >= 5) {
      bond.streakDays = (Number(bond.streakDays) || 0) + 1;
      bond.coupleExp += 15;
      if (typeof global.addExp === 'function') {
        try { global.addExp(15, 'Misión Diaria de Chat Social en Inglés'); } catch (e) {}
      }
      const newRank = calculateBondRank(bond);
      showSocialToast(`🔥 ¡Misión de 5 mensajes completada! +1 día de racha (${bond.streakDays} días) y +15 EXP • Rango: ${newRank}`);
    }

    saveSocialState();
  }

  function sendMessageFromInput(customText, isVoiceNote = false) {
    const input = document.getElementById('socialChatMessageInput');
    const text = (typeof customText === 'string' ? customText : (input ? input.value : '')).trim();
    if (!text) return;
    if (input && typeof customText !== 'string') input.value = '';

    const contact = getActiveContact();
    if (!contact) return;

    if (!Array.isArray(state.messages[contact.id])) {
      state.messages[contact.id] = [];
    }

    const msgObj = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      sender: 'me',
      senderName: 'Tú',
      text,
      translation: translateCommonEnglishToSpanish(text),
      timestamp: getCurrentTimeStr(),
      type: 'text',
      isVoiceNote: !!isVoiceNote
    };

    state.messages[contact.id].push(msgObj);
    recordMessageAndCheckMissions(contact.id);

    state.typingByContact[contact.id] = true;
    renderCommunityHub();
    scrollToBottomMessages();

    // Respuesta automática inteligente en inglés adaptada al rol
    const targetId = contact.id;
    const bond = state.bonds[targetId] || {};
    const role = bond.role || 'friends';

    setTimeout(() => {
      state.typingByContact[targetId] = false;
      const reply = generateContextualSmartReply(text, role, contact.name);
      state.messages[targetId].push({
        id: 'msg_reply_' + Date.now(),
        sender: 'them',
        senderName: contact.isGroup ? 'Sophia Valentine' : contact.name,
        text: reply.en,
        translation: reply.es,
        timestamp: getCurrentTimeStr(),
        type: 'text'
      });
      saveSocialState();
      renderCommunityHub();
      scrollToBottomMessages();
    }, 950);
  }

  function translateCommonEnglishToSpanish(text) {
    const lower = text.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi ')) return '¡Hola! Practiquemos nuestro inglés hoy.';
    if (lower.includes('love')) return '¡Me encanta practicar inglés contigo!';
    if (lower.includes('date')) return '¿Vamos a nuestra cita en el Restaurante 3D?';
    if (lower.includes('game') || lower.includes('jest')) return '¡Juguemos una partida de Jest 1vs1!';
    return `Mensaje en inglés: "${text}"`;
  }

  // Botón 🌐 Traducir mensaje recibido
  function toggleTranslateReceived() {
    state.showTranslationsGlobal = !state.showTranslationsGlobal;
    renderCommunityHub();
    showSocialToast(state.showTranslationsGlobal
      ? '🌐 Traducción bilingüe activada en todos los mensajes'
      : '🌐 Mostrando únicamente inglés original');
  }

  function toggleSingleTranslation(msgId) {
    state.translatedMsgIds[msgId] = !state.translatedMsgIds[msgId];
    renderCommunityHub();
  }

  // Botón 🎤 Nota de Voz / Dictado en Inglés
  function toggleVoiceDictation() {
    const SpeechRec = global.SpeechRecognition || global.webkitSpeechRecognition;
    if (SpeechRec) {
      if (state.isRecordingVoice) {
        state.isRecordingVoice = false;
        renderCommunityHub();
        return;
      }
      try {
        const rec = new SpeechRec();
        rec.lang = 'en-US';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        state.isRecordingVoice = true;
        renderCommunityHub();
        showSocialToast('🎤 Escuchando en inglés (en-US)... Habla ahora');

        rec.onresult = function (event) {
          state.isRecordingVoice = false;
          const transcript = event.results && event.results[0] && event.results[0][0]
            ? event.results[0][0].transcript
            : '';
          if (transcript) {
            sendMessageFromInput(transcript, true);
          } else {
            renderCommunityHub();
          }
        };
        rec.onerror = function () {
          state.isRecordingVoice = false;
          sendMessageFromInput("Hey! I'm practicing my English pronunciation with a voice note! 🎤", true);
        };
        rec.onend = function () {
          if (state.isRecordingVoice) {
            state.isRecordingVoice = false;
            renderCommunityHub();
          }
        };
        rec.start();
        return;
      } catch (e) {
        state.isRecordingVoice = false;
      }
    }

    // Fallback instantáneo si el navegador no soporta micrófono directo
    sendMessageFromInput("Hey! Listen to my English voice note: Let's keep our daily streak strong! 🎤🔥", true);
  }

  function speakMessage(text) {
    if (!text || typeof global.speechSynthesis === 'undefined') return;
    try {
      global.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.95;
      global.speechSynthesis.speak(u);
    } catch (e) {}
  }

  // Botón 🃏 Invitar a Jest (Jarz)
  function sendJestInvite(contactId, autoLaunch = false) {
    const contact = state.contacts.find(c => c.id === contactId) || getActiveContact();
    if (!contact) return;

    if (!Array.isArray(state.messages[contact.id])) {
      state.messages[contact.id] = [];
    }

    state.messages[contact.id].push({
      id: 'jest_inv_' + Date.now(),
      sender: 'me',
      senderName: 'Tú',
      text: `¡Te desafío a una partida 1vs1 de Jest / Jarz (Headbanz) en inglés, ${contact.name}! ¿Podrás adivinar la carta en tu frente antes de que se acabe el tiempo?`,
      timestamp: getCurrentTimeStr(),
      type: 'jest_invite'
    });

    const bond = state.bonds[contact.id];
    if (bond) {
      bond.weeklyGamesCount = (Number(bond.weeklyGamesCount) || 0) + 1;
      bond.coupleExp = (Number(bond.coupleExp) || 0) + 20;
      if (bond.weeklyGamesCount === 2) {
        bond.streakDays = (Number(bond.streakDays) || 0) + 1;
        showSocialToast('🃏 ¡Misión semanal de 2 partidas de Jest completada! +1 día de racha 🔥');
      }
    }

    saveSocialState();
    renderCommunityHub();
    scrollToBottomMessages();

    if (autoLaunch) {
      acceptJestDuel(contact.id, contact.name);
    }
  }

  function acceptJestDuel(friendId, friendName) {
    const bond = state.bonds[friendId];
    if (bond) {
      bond.weeklyGamesCount = Math.max(1, Number(bond.weeklyGamesCount) || 0);
      saveSocialState();
    }

    if (typeof global.openJestGameView === 'function') {
      global.openJestGameView({ friendId, friendName });
      return;
    }

    if (typeof global.navigateTo === 'function') {
      try { global.navigateTo('view-jest'); } catch (e) {}
    }
    showSocialToast(`🃏 Iniciando Duelo 1vs1 de Jest (Jarz) contra ${friendName}...`);
  }

  // Botón 🕯️ Invitar a Cita 3D
  function send3DDateInvite(contactId) {
    const contact = state.contacts.find(c => c.id === contactId) || getActiveContact();
    if (!contact) return;

    if (!Array.isArray(state.messages[contact.id])) {
      state.messages[contact.id] = [];
    }

    state.messages[contact.id].push({
      id: 'date3d_inv_' + Date.now(),
      sender: 'me',
      senderName: 'Tú',
      text: `🕯️ He reservado una mesa especial para los dos en el Restaurante 3D de MasterENG, ${contact.name}. ¡Vamos a nuestra Cita 3D en inglés!`,
      timestamp: getCurrentTimeStr(),
      type: 'date3d_invite'
    });

    saveSocialState();
    renderCommunityHub();
    scrollToBottomMessages();
    goTo3DDateNow(contact.id);
  }

  function goTo3DDateNow(contactId) {
    const contact = state.contacts.find(c => c.id === contactId) || getActiveContact();
    if (!contact) return;

    const bond = state.bonds[contact.id] || {};
    bond.weeklyDatesCount = (Number(bond.weeklyDatesCount) || 0) + 1;
    bond.coupleExp = (Number(bond.coupleExp) || 0) + 25;
    if (bond.weeklyDatesCount === 3) {
      bond.streakDays = (Number(bond.streakDays) || 0) + 1;
    }

    const partnerPayload = {
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar,
      personalRank: contact.personalRank,
      role: bond.role || 'partner',
      bondRank: calculateBondRank(bond),
      streakDays: bond.streakDays || 1,
      startedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_DATE_PARTNER, JSON.stringify(partnerPayload));
    } catch (e) {}

    saveSocialState();
    showSocialToast(`🕯️ Iniciando Cita 3D con ${contact.name} (${partnerPayload.bondRank})...`);

    const viewEl = document.getElementById('view-community');
    if (viewEl) {
      viewEl.classList.add('hidden');
      viewEl.style.setProperty('display', 'none', 'important');
    }

    if (typeof global.navigateTo === 'function') {
      global.navigateTo('world3d');
    } else if (typeof global.showView === 'function') {
      global.showView('view-worldtour');
    }

    if (typeof global.initOrResumeWorld3D === 'function') {
      try { global.initOrResumeWorld3D(); } catch (e) {}
    }
    if (typeof global.switch3DScenario === 'function') {
      try { global.switch3DScenario('dating'); } catch (e) {}
    }
  }

  // ============================================================================
  // 9. MODALES PARA ➕ AGREGAR AMIGO Y 👥 CREAR GRUPO
  // ============================================================================
  async function openAddFriendModal() {
    const modal = document.getElementById('waAddFriendModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const registeredUsers = await discoverRegisteredUsers();

    modal.innerHTML = `
      <div class="wa-modal-card">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>➕ Agregar Amigo o Pareja</span>
          </h3>
          <button type="button" onclick="window.SocialChat.closeModals()" class="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
        </div>
        <p class="text-xs text-slate-300 mb-3">
          Busca por <b>nombre de usuario</b>, <b>correo electrónico</b> o <b>código de amigo</b> (ej. <code class="text-cyan-300">MENG-8821</code>) y elige su vínculo contigo:
        </p>

        <div class="space-y-2.5">
          <input id="waNewFriendIdentifier" type="text" placeholder="Nombre de usuario, correo o código MENG-XXXX..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white" />

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">Rol de Relación:</label>
              <select id="waNewFriendRole" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white">
                <option value="partner">❤️ Pareja</option>
                <option value="friends" selected>⚡ Mejor Amigo / Compañero</option>
                <option value="family">🏠 Familia</option>
                <option value="colleague">💼 Colega</option>
                <option value="acquaintance">👋 Conocido</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">Tema Visual del Chat:</label>
              <select id="waNewFriendTheme" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white">
                <option value="love">❤️ Amor (Love & Romance)</option>
                <option value="space" selected>🌌 Espacio (Cosmic Neon)</option>
                <option value="nature">🌿 Naturaleza (Nature & Forest)</option>
                <option value="work">💼 Trabajo (Executive & Work)</option>
                <option value="classic">🌙 Clásico (WhatsApp Dark)</option>
              </select>
            </div>
          </div>

          <button type="button" onclick="window.SocialChat.confirmAddFriend()"
            class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg cursor-pointer transition">
            ➕ Vincular Contacto Ahora
          </button>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-800">
          <div class="text-[11px] font-bold text-slate-400 mb-2">Usuarios registrados disponibles para conectar:</div>
          <div class="max-h-40 overflow-y-auto space-y-1.5">
            ${registeredUsers.map(u => `
              <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="text-base">${u.avatar || '🧑‍🎓'}</span>
                  <div class="min-w-0">
                    <div class="text-xs font-bold text-white truncate">${escapeHtml(u.username)} <span class="text-[10px] text-amber-300">${escapeHtml(u.personalRank)}</span></div>
                    <div class="text-[10px] text-slate-400 truncate">${escapeHtml(u.email)} • <span class="font-mono text-cyan-300">${escapeHtml(u.friendCode)}</span></div>
                  </div>
                </div>
                <button type="button"
                  onclick="document.getElementById('waNewFriendIdentifier').value='${escapeJsStr(u.username)}'; window.SocialChat.confirmAddFriend();"
                  class="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-[11px] font-bold cursor-pointer">
                  + Agregar
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  async function confirmAddFriend() {
    const inp = document.getElementById('waNewFriendIdentifier');
    const roleSel = document.getElementById('waNewFriendRole');
    const themeSel = document.getElementById('waNewFriendTheme');
    const raw = (inp ? inp.value : '').trim();
    if (!raw) {
      showSocialToast('⚠️ Escribe un nombre de usuario, correo o código de amigo.');
      return;
    }

    const role = roleSel ? roleSel.value : 'friends';
    const theme = themeSel ? themeSel.value : (RELATIONSHIP_ROLES[role] ? RELATIONSHIP_ROLES[role].defaultTheme : 'classic');

    const discovered = await discoverRegisteredUsers();
    const match = discovered.find(u =>
      u.username.toLowerCase() === raw.toLowerCase() ||
      u.email.toLowerCase() === raw.toLowerCase() ||
      u.friendCode.toLowerCase() === raw.toLowerCase()
    );

    const newId = 'contact_' + Date.now();
    const displayName = match ? match.username : raw.split('@')[0];
    const newContact = {
      id: newId,
      name: displayName,
      username: displayName.toLowerCase().replace(/\s+/g, '_'),
      email: match ? match.email : (raw.includes('@') ? raw : `${displayName.toLowerCase().replace(/\s+/g, '')}@mastereng.academy`),
      friendCode: match ? match.friendCode : ('MENG-' + Math.floor(1000 + Math.random() * 9000)),
      avatar: role === 'partner' ? '💖' : (match ? match.avatar : '🌟'),
      personalRank: match ? match.personalRank : '🥇 Oro',
      cefr: 'B2 Upper-Int',
      statusText: 'Online • Connected on MasterENG',
      isOnline: true,
      isGroup: false
    };

    state.contacts.unshift(newContact);
    state.bonds[newId] = {
      role,
      theme,
      streakDays: 1,
      lastInteractionDate: getTodayIso(),
      coupleExp: 25,
      weeklyDatesCount: 0,
      weeklyGamesCount: 0,
      messagesToday: 1
    };
    state.messages[newId] = [
      {
        id: 'm_welcome_' + Date.now(),
        sender: 'them',
        senderName: displayName,
        text: `Hey! So happy we connected on MasterENG! Let's build our daily English streak 🔥 and play Jest or visit the 3D World!`,
        translation: `¡Hola! ¡Qué alegría conectar en MasterENG! ¡Construyamos nuestra racha diaria de inglés 🔥 y juguemos Jest o visitemos el Mundo 3D!`,
        timestamp: getCurrentTimeStr(),
        type: 'text'
      }
    ];

    state.activeContactId = newId;
    saveSocialState();
    closeModals();
    renderCommunityHub();
    showSocialToast(`✅ ${displayName} agregado como ${RELATIONSHIP_ROLES[role].label}`);
  }

  function openCreateGroupModal() {
    const modal = document.getElementById('waCreateGroupModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const indivContacts = state.contacts.filter(c => !c.isGroup);

    modal.innerHTML = `
      <div class="wa-modal-card">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>👥 Crear Nuevo Grupo de Práctica</span>
          </h3>
          <button type="button" onclick="window.SocialChat.closeModals()" class="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
        </div>
        <div class="space-y-2.5">
          <input id="waNewGroupName" type="text" placeholder="Nombre del grupo (ej. TOEFL Speaking Squad 🔥)..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white" />

          <div class="text-[11px] font-bold text-slate-400">Selecciona miembros del grupo:</div>
          <div class="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800">
            ${indivContacts.map(c => `
              <label class="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                <input type="checkbox" class="wa-group-member-check" value="${escapeHtml(c.name)}" checked />
                <span>${c.avatar} ${escapeHtml(c.name)} (${escapeHtml(c.personalRank)})</span>
              </label>
            `).join('')}
          </div>

          <button type="button" onclick="window.SocialChat.confirmCreateGroup()"
            class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg cursor-pointer transition">
            👥 Crear Grupo Ahora
          </button>
        </div>
      </div>
    `;
  }

  function confirmCreateGroup() {
    const inp = document.getElementById('waNewGroupName');
    const name = (inp ? inp.value : '').trim() || 'English Study Squad 👥';
    const checks = document.querySelectorAll('.wa-group-member-check:checked');
    const members = Array.from(checks).map(c => c.value);
    members.push('Tú');

    const newId = 'group_' + Date.now();
    const newGrp = {
      id: newId,
      name,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      email: '',
      friendCode: 'GRP-' + Math.floor(1000 + Math.random() * 9000),
      avatar: '👥',
      personalRank: '💎 Diamante',
      cefr: 'Multi-Level',
      statusText: `${members.join(', ')} • ${members.length} miembros`,
      isOnline: true,
      isGroup: true,
      members
    };

    state.contacts.unshift(newGrp);
    state.bonds[newId] = {
      role: 'group',
      theme: 'space',
      streakDays: 1,
      lastInteractionDate: getTodayIso(),
      coupleExp: 30,
      weeklyDatesCount: 0,
      weeklyGamesCount: 0,
      messagesToday: 1
    };
    state.messages[newId] = [
      {
        id: 'm_grp_init_' + Date.now(),
        sender: 'them',
        senderName: members[0] || 'Sophia Valentine',
        text: `Welcome everyone to "${name}"! Let's practice English together and challenge each other in Jest! 🏆`,
        translation: `¡Bienvenidos todos a "${name}"! ¡Practiquemos inglés juntos y retémonos en Jest! 🏆`,
        timestamp: getCurrentTimeStr(),
        type: 'text'
      }
    ];

    state.activeContactId = newId;
    saveSocialState();
    closeModals();
    renderCommunityHub();
    showSocialToast(`👥 Grupo "${name}" creado con éxito`);
  }

  function closeModals() {
    ['waAddFriendModal', 'waCreateGroupModal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  }

  function returnToHub() {
    const viewEl = document.getElementById('view-community');
    if (viewEl) {
      viewEl.classList.add('hidden');
      viewEl.style.setProperty('display', 'none', 'important');
    }
    if (typeof global.goToHomePortals === 'function') {
      global.goToHomePortals();
    } else if (typeof global.navigateTo === 'function') {
      global.navigateTo('view-home');
    } else if (typeof global.showView === 'function') {
      global.showView('view-home');
    }
  }

  function scrollToBottomMessages() {
    setTimeout(() => {
      const container = document.getElementById('waMessagesContainer');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 30);
  }

  function showSocialToast(message) {
    if (typeof global.showToast === 'function') {
      try { global.showToast(message); return; } catch (e) {}
    }
    let toast = document.getElementById('waSocialFloatingToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'waSocialFloatingToast';
      toast.style.cssText = 'position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 100020; background: rgba(15, 23, 42, 0.96); color: #fff; border: 1px solid rgba(56, 189, 248, 0.5); padding: 10px 18px; border-radius: 9999px; font-size: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.6); pointer-events: none; transition: opacity 0.25s ease;';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
      toast.style.opacity = '0';
    }, 3200);
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeJsStr(str) {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, ' ');
  }

  // ============================================================================
  // 10. AUTO-INICIALIZACIÓN Y EXPORTACIÓN GLOBAL
  // ============================================================================
  function initSocialChat() {
    loadSocialState();
    const existingView = document.getElementById('view-community');
    if (existingView && !existingView.classList.contains('hidden')) {
      renderCommunityHub();
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSocialChat);
    } else {
      setTimeout(initSocialChat, 0);
    }
  }

  const SocialChatAPI = {
    initSocialChat,
    openCommunityHubView,
    renderCommunityHub,
    selectContact,
    backToSidebarMobile,
    selectTab,
    handleSearch,
    changeRelationshipRole,
    changeChatTheme,
    toggleMissionsDrawer,
    sendMessageFromInput,
    toggleTranslateReceived,
    toggleSingleTranslation,
    toggleVoiceDictation,
    speakMessage,
    sendJestInvite,
    acceptJestDuel,
    send3DDateInvite,
    goTo3DDateNow,
    openAddFriendModal,
    confirmAddFriend,
    openCreateGroupModal,
    confirmCreateGroup,
    closeModals,
    returnToHub,
    calculateBondRank,
    getSocialBonds: () => state.bonds
  };

  global.SocialChat = SocialChatAPI;
  global.openCommunityHubView = openCommunityHubView;
  global.initSocialChat = initSocialChat;
  global.renderCommunityHub = renderCommunityHub;
  global.calculateBondRank = calculateBondRank;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialChatAPI;
  }
})(typeof window !== 'undefined' ? window : globalThis);

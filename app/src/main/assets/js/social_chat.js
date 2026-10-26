/**
 * MasterENG - Social Chat & Realtime Relationship Gamification Hub (WhatsApp Web / Mobile Style)
 * Rol: Lead Realtime Social & Database Architect
 *
 * Características:
 * - CERO bots falsos por defecto: Purga automática de bots de prueba (Sophia Valentine, Liam Carter,
 *   Emma Rodriguez, Noah Sterling, English Legends Club) y estado vacío limpio para personas reales.
 * - Sistema de ID Único de Jugador (MENG-XXXX) con window.ensureUserUniqueGameId() sincronizado
 *   en sesión, localStorage ('mastereng_registered_users') y backend (/api/users/register-code y /api/users).
 * - Buscador de Amigos en vivo estilo videojuego (por ID Único MENG-XXXX, Nombre de usuario o Correo)
 *   consultando GET /api/users, /api/admin/users y localStorage.
 * - Elección de Rol de Relación en Conjunto con descripción de cada vínculo y Solicitud de Vínculo
 *   interactiva en el chat con botón "Aceptar Rol en Conjunto".
 * - Modal de "Guía de Rangos y Rachas" en la cabecera detallando niveles, días de racha (🔥) y
 *   citas 3D / partidas de Jest requeridas para ascender.
 */

(function (global) {
  'use strict';

  const STORAGE_KEYS = {
    BONDS: 'mastereng_social_bonds',
    CONTACTS: 'mastereng_social_contacts',
    MESSAGES: 'mastereng_social_messages',
    ACTIVE_DATE_PARTNER: 'mastereng_active_date_partner',
    MY_FRIEND_CODE: 'mastereng_my_friend_code',
    INBOX_INVITES: 'mastereng_inbox_invites',
    CHAT_MESSAGES: 'mastereng_chat_messages'
  };

  // Lista negra estricta de bots de prueba que jamás deben aparecer
  const BANNED_BOT_IDS = new Set([
    'contact_sophia',
    'contact_liam',
    'contact_emma',
    'contact_noah',
    'group_legends'
  ]);

  const BANNED_BOT_NAMES = [
    'sophia valentine',
    'liam carter',
    'emma rodriguez',
    'noah sterling',
    'english legends club'
  ];

  function isBannedFakeBot(contactOrUser) {
    if (!contactOrUser || typeof contactOrUser !== 'object') return true;
    const id = String(contactOrUser.id || '').trim().toLowerCase();
    const name = String(contactOrUser.name || contactOrUser.username || '').trim().toLowerCase();
    const email = String(contactOrUser.email || '').trim().toLowerCase();
    if (BANNED_BOT_IDS.has(id)) return true;
    for (const botName of BANNED_BOT_NAMES) {
      if (name.includes(botName)) return true;
    }
    if (
      email === 'sophia@mastereng.academy' ||
      email === 'liam@mastereng.academy' ||
      email === 'emma@mastereng.academy' ||
      email === 'noah@mastereng.academy'
    ) {
      return true;
    }
    return false;
  }

  // ============================================================================
  // 1. CATÁLOGO DE ROLES CON DESCRIPCIÓN OFICIAL, TEMAS Y GUÍA DE RANGOS
  // ============================================================================
  const RELATIONSHIP_ROLES = {
    partner: {
      id: 'partner',
      title: 'Pareja (Couple)',
      label: '❤️ Pareja',
      shortLabel: '❤️ Pareja',
      tabKey: 'partner',
      defaultTheme: 'love',
      description: 'Vínculo romántico para practicar citas en el Bistro 3D y misiones semanales en pareja.',
      ranks: [
        { level: 1, name: '💌 Crush', minDays: 0, req: 'Inicio del vínculo romántico', desc: 'Primeros mensajes e interés mutuo practicando inglés.' },
        { level: 2, name: '🌹 Salientes', minDays: 3, req: '3+ días de racha 🔥', desc: 'Citas casuales en el Bistro 3D y conversaciones diarias.' },
        { level: 3, name: '👩‍❤️‍👨 Novios', minDays: 10, req: '10+ días de racha 🔥 + Citas 3D', desc: 'Relación formal en MasterENG con bonificación de EXP en citas.' },
        { level: 4, name: '💍 Prometidos', minDays: 25, req: '25+ días de racha 🔥 + Misiones semanales', desc: 'Compromiso bilingüe de alto nivel y rachas inquebrantables.' },
        { level: 5, name: '👑 Esposos', minDays: 50, req: '50+ días de racha 🔥 + Citas y Jest', desc: 'Matrimonio oficial dentro de la comunidad con insignia real.' },
        { level: 6, name: '✨ Almas Gemelas', minDays: 100, req: '100+ días de racha 🔥', desc: 'Nivel legendario máximo de conexión y dominio conjunto del inglés.' }
      ]
    },
    friends: {
      id: 'friends',
      title: 'Compañeros / Amigos (Besties)',
      label: '⚡ Mejor Amigo / Compañero',
      shortLabel: '⚡ Amigos',
      tabKey: 'friends',
      defaultTheme: 'space',
      description: 'Duelos competitivos en Jest 3D, slang callejero y rachas de estudio diario.',
      ranks: [
        { level: 1, name: '👋 Conocidos', minDays: 0, req: 'Inicio de amistad', desc: 'Primeros saludos y práctica casual en el chat.' },
        { level: 2, name: '🤝 Compas (Buddies)', minDays: 3, req: '3+ días de racha 🔥', desc: 'Compañeros frecuentes de práctica y vocabulario.' },
        { level: 3, name: '⚡ Mejores Amigos (Besties)', minDays: 10, req: '10+ días de racha 🔥 + Duelos Jest 3D', desc: 'Rivales y aliados inseparables en partidas 1vs1 de Jest.' },
        { level: 4, name: '🔥 Inseparables (Partners in Crime)', minDays: 25, req: '25+ días de racha 🔥 + Misiones', desc: 'Dúo legendario de fluidez y competencia en inglés.' }
      ]
    },
    family: {
      id: 'family',
      title: 'Familia (Family)',
      label: '🏠 Familia',
      shortLabel: '🏠 Familia',
      tabKey: 'family',
      defaultTheme: 'nature',
      description: 'Práctica de vocabulario cotidiano, hogar, supermercado y apoyo mutuo.',
      ranks: [
        { level: 1, name: '🏠 Roomies', minDays: 0, req: 'Inicio del vínculo familiar', desc: 'Convivencia diaria practicando expresiones cotidianas del hogar.' },
        { level: 2, name: '🧬 Primos', minDays: 3, req: '3+ días de racha 🔥', desc: 'Apoyo constante en módulos de supervivencia y viajes.' },
        { level: 3, name: '🛡️ Hermanos (Siblings)', minDays: 10, req: '10+ días de racha 🔥 + Juegos', desc: 'Confianza total y estudio colaborativo todas las semanas.' },
        { level: 4, name: '👑 Dinastía Familiar', minDays: 25, req: '25+ días de racha 🔥', desc: 'Familia bilingüe de élite con racha histórica.' }
      ]
    },
    colleague: {
      id: 'colleague',
      title: 'Colegas (Coworkers)',
      label: '💼 Colega',
      shortLabel: '💼 Colega',
      tabKey: 'friends',
      defaultTheme: 'work',
      description: 'Inglés profesional, entrevistas, hotel y negocios.',
      ranks: [
        { level: 1, name: '💼 Colegas (Coworkers)', minDays: 0, req: 'Inicio profesional', desc: 'Networking y práctica de vocabulario de oficina y tecnología.' },
        { level: 2, name: '🚀 Aliados de Proyecto', minDays: 7, req: '7+ días de racha 🔥', desc: 'Colaboración activa en inglés de negocios y entrevistas.' },
        { level: 3, name: '🏆 Socios Ejecutivos', minDays: 20, req: '20+ días de racha 🔥 + Misiones', desc: 'Dominio corporativo y preparación certificada TOEFL.' }
      ]
    },
    group: {
      id: 'group',
      title: 'Grupo de Estudio',
      label: '👥 Grupo de Estudio',
      shortLabel: '👥 Grupo',
      tabKey: 'groups',
      defaultTheme: 'space',
      description: 'Sala grupal para practicar conversación en equipo y lanzar retos.',
      ranks: [
        { level: 1, name: '👥 Grupo de Estudio', minDays: 0, req: 'Creación del grupo', desc: 'Equipo de práctica colaborativa.' },
        { level: 2, name: '🔥 Comunidad Activa', minDays: 5, req: '5+ días de racha 🔥', desc: 'Grupo constante con participación diaria.' },
        { level: 3, name: '👑 Escuadrón Bilingüe Élite', minDays: 15, req: '15+ días de racha 🔥', desc: 'Comunidad de alto rendimiento en inglés.' }
      ]
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

  // ============================================================================
  // 2. ESTADO INTERNO DEL MÓDULO SOCIAL (VACÍO POR DEFECTO, SIN BOTS)
  // ============================================================================
  let state = {
    contacts: [],
    bonds: {},
    messages: {},
    activeContactId: null,
    activeTab: 'all',
    searchQuery: '',
    showMissionsDrawer: false,
    showTranslationsGlobal: false,
    translatedMsgIds: {},
    isRecordingVoice: false,
    mobileShowChatPane: false,
    typingByContact: {},
    cachedDiscoveredUsers: []
  };

  function getTodayIso() {
    try {
      return new Date().toISOString().slice(0, 10);
    } catch (e) {
      return '2026-10-25';
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

  function hashCode(str) {
    let h = 0;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function deriveDeterministicCode(seedStr) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let h = hashCode(seedStr || ('user_' + Date.now()));
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars[h % chars.length];
      h = Math.floor(h / chars.length) + (i * 17);
    }
    return 'MENG-' + suffix;
  }

  // ============================================================================
  // 3. ID ÚNICO DE JUGADOR (MENG-XXXX) SINCRONIZADO EN BASE DE DATOS
  // ============================================================================
  function getCurrentSessionUser() {
    const sessionKeys = ['mastereng_user', 'english_app_user_session'];
    for (const k of sessionKeys) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') return parsed;
        }
      } catch (e) {}
    }
    if (typeof global.getStoredUser === 'function') {
      try {
        const u = global.getStoredUser();
        if (u && typeof u === 'object') return u;
      } catch (e) {}
    }
    return null;
  }

  function saveCurrentSessionUser(userObj) {
    if (!userObj || typeof userObj !== 'object') return;
    try {
      localStorage.setItem('mastereng_user', JSON.stringify(userObj));
      localStorage.setItem('english_app_user_session', JSON.stringify(userObj));
    } catch (e) {}
  }

  function ensureUserUniqueGameId() {
    let user = getCurrentSessionUser();
    let existingCode = '';

    if (user && (user.gameId || user.friendCode)) {
      const candidate = String(user.gameId || user.friendCode).trim().toUpperCase();
      if (/^MENG-[A-Z0-9]{4}$/.test(candidate)) {
        existingCode = candidate;
      }
    }

    if (!existingCode) {
      try {
        const savedCode = String(localStorage.getItem(STORAGE_KEYS.MY_FRIEND_CODE) || '').trim().toUpperCase();
        if (/^MENG-[A-Z0-9]{4}$/.test(savedCode)) {
          existingCode = savedCode;
        }
      } catch (e) {}
    }

    if (!existingCode) {
      const seed = user && (user.email || user.username || user.id)
        ? `${user.email || ''}_${user.username || ''}_${user.id || ''}`
        : `guest_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      existingCode = deriveDeterministicCode(seed);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.MY_FRIEND_CODE, existingCode);
    } catch (e) {}

    if (user) {
      user.gameId = existingCode;
      user.friendCode = existingCode;
      saveCurrentSessionUser(user);
    }

    // Sincronizar en mastereng_registered_users y english_app_registered_users
    ['mastereng_registered_users', 'english_app_registered_users'].forEach(listKey => {
      try {
        const raw = localStorage.getItem(listKey);
        const list = raw ? JSON.parse(raw) : [];
        if (Array.isArray(list)) {
          let found = false;
          list.forEach(item => {
            if (!item || typeof item !== 'object') return;
            if (
              user &&
              ((user.email && item.email && String(item.email).toLowerCase() === String(user.email).toLowerCase()) ||
               (user.username && item.username && String(item.username).toLowerCase() === String(user.username).toLowerCase()))
            ) {
              item.gameId = existingCode;
              item.friendCode = existingCode;
              found = true;
            }
          });
          if (!found && user && (user.username || user.email)) {
            list.push({
              id: user.id || Date.now(),
              username: user.username || user.email.split('@')[0],
              email: user.email || `${String(user.username).toLowerCase().replace(/\s+/g, '')}@mastereng.com`,
              rank: user.rank || 'Bronce',
              exp: Number(user.exp) || 0,
              gameId: existingCode,
              friendCode: existingCode
            });
          }
          localStorage.setItem(listKey, JSON.stringify(list));
        }
      } catch (e) {}
    });

    // Sincronizar en segundo plano con el backend (/api/users/register-code y /api/users)
    if (typeof fetch === 'function' && user && (user.username || user.email)) {
      const syncPayload = {
        userId: user.id || null,
        username: user.username || '',
        email: user.email || '',
        gameId: existingCode,
        friendCode: existingCode,
        rank: user.rank || 'Bronce',
        exp: Number(user.exp) || 0
      };
      try {
        fetch('/api/users/register-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(syncPayload)
        }).catch(() => {});
        fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(syncPayload)
        }).catch(() => {});
      } catch (e) {}
    }

    return existingCode;
  }

  function copyMyUniqueId() {
    const code = ensureUserUniqueGameId();
    try {
      if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(code);
      }
    } catch (e) {}
    showSocialToast(`📋 Tu ID Único (${code}) ha sido copiado al portapapeles`);
    return code;
  }

  // ============================================================================
  // 4. EVOLUCIÓN AUTOMÁTICA DE RANGO SEGÚN ROL Y DÍAS DE RACHA
  // ============================================================================
  function calculateBondRank(bond) {
    if (!bond) return '👋 Conocidos';
    const role = bond.role || 'friends';
    const days = Number(bond.streakDays) || 0;

    if (role === 'partner') {
      if (days >= 100) return '✨ Almas Gemelas';
      if (days >= 50) return '👑 Esposos';
      if (days >= 25) return '💍 Prometidos';
      if (days >= 10) return '👩‍❤️‍👨 Novios';
      if (days >= 3) return '🌹 Salientes';
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

    return '👋 Conocidos';
  }

  // ============================================================================
  // 5. PERSISTENCIA EN LOCALSTORAGE Y PURGA AUTOMÁTICA DE BOTS FALSOS
  // ============================================================================
  function purgeFakeBotsFromState() {
    if (!Array.isArray(state.contacts)) {
      state.contacts = [];
    }

    const removedIds = [];
    state.contacts = state.contacts.filter(c => {
      if (isBannedFakeBot(c)) {
        if (c && c.id) removedIds.push(c.id);
        return false;
      }
      return true;
    });

    // Purgar cualquier llave de bot en bonds y messages
    const allBanIds = Array.from(BANNED_BOT_IDS).concat(removedIds);
    allBanIds.forEach(botId => {
      if (state.bonds && state.bonds[botId]) delete state.bonds[botId];
      if (state.messages && state.messages[botId]) delete state.messages[botId];
    });
  }

  function loadSocialState() {
    ensureUserUniqueGameId();

    try {
      const rawContacts = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      state.contacts = rawContacts ? JSON.parse(rawContacts) : [];
      if (!Array.isArray(state.contacts)) state.contacts = [];
    } catch (e) {
      state.contacts = [];
    }

    try {
      const rawBonds = localStorage.getItem(STORAGE_KEYS.BONDS);
      state.bonds = rawBonds ? JSON.parse(rawBonds) : {};
      if (!state.bonds || typeof state.bonds !== 'object') state.bonds = {};
    } catch (e) {
      state.bonds = {};
    }

    try {
      const rawMsgs = localStorage.getItem(STORAGE_KEYS.MESSAGES) || localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      state.messages = rawMsgs ? JSON.parse(rawMsgs) : {};
      if (!state.messages || typeof state.messages !== 'object') state.messages = {};
    } catch (e) {
      state.messages = {};
    }

    // Purga estricta de los bots falsos (Sophia Valentine, Liam Carter, Emma Rodriguez, Noah Sterling, English Legends Club)
    purgeFakeBotsFromState();

    // Garantizar integridad de bonds para los amigos reales agregados por el usuario
    state.contacts.forEach(c => {
      if (!c.friendCode && !c.gameId) {
        c.friendCode = deriveDeterministicCode(c.email || c.username || c.name);
        c.gameId = c.friendCode;
      } else {
        c.friendCode = c.friendCode || c.gameId;
        c.gameId = c.gameId || c.friendCode;
      }

      if (!state.bonds[c.id]) {
        const defRole = c.isGroup ? 'group' : 'friends';
        state.bonds[c.id] = {
          role: defRole,
          roleConfirmed: true,
          pendingRole: null,
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
        if (typeof b.roleConfirmed !== 'boolean') b.roleConfirmed = true;
        if (!b.theme) b.theme = (RELATIONSHIP_ROLES[b.role] && RELATIONSHIP_ROLES[b.role].defaultTheme) || 'classic';
        if (typeof b.streakDays !== 'number') b.streakDays = Number(b.streakDays) || 1;
        if (!b.lastInteractionDate) b.lastInteractionDate = getTodayIso();
        if (typeof b.coupleExp !== 'number') b.coupleExp = Number(b.coupleExp) || 0;
        if (typeof b.weeklyDatesCount !== 'number') b.weeklyDatesCount = Number(b.weeklyDatesCount) || 0;
        if (typeof b.weeklyGamesCount !== 'number') b.weeklyGamesCount = Number(b.weeklyGamesCount) || 0;
        if (typeof b.messagesToday !== 'number') b.messagesToday = Number(b.messagesToday) || 0;
      }
    });

    if (state.contacts.length === 0) {
      state.activeContactId = null;
    } else if (!state.activeContactId || !state.contacts.some(c => c.id === state.activeContactId)) {
      state.activeContactId = state.contacts[0].id;
    }

    saveSocialState();
  }

  function saveSocialState() {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(state.contacts));
      localStorage.setItem(STORAGE_KEYS.BONDS, JSON.stringify(state.bonds));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(state.messages));
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(state.messages));
    } catch (e) {
      console.warn('[SocialChat] No se pudo guardar en localStorage:', e);
    }
  }

  // ============================================================================
  // 6. DESCUBRIMIENTO DE USUARIOS REALES (GET /api/users, /api/admin/users y LocalStorage)
  // ============================================================================
  async function discoverRegisteredUsers() {
    const discovered = [];
    const seen = new Set();
    const myUser = getCurrentSessionUser();
    const myEmail = myUser && myUser.email ? String(myUser.email).toLowerCase().trim() : '';
    const myUsername = myUser && myUser.username ? String(myUser.username).toLowerCase().trim() : '';
    const myCode = ensureUserUniqueGameId();

    function addCandidate(u) {
      if (!u || typeof u !== 'object') return;
      if (isBannedFakeBot(u)) return;

      const username = String(u.username || u.name || u.displayName || '').trim();
      const email = String(u.email || '').trim();
      if (!username && !email) return;

      // Omitir al propio usuario actual
      if (myEmail && email.toLowerCase() === myEmail) return;
      if (myUsername && username.toLowerCase() === myUsername) return;

      const rawCode = String(u.gameId || u.friendCode || u.code || '').trim().toUpperCase();
      const friendCode = /^MENG-[A-Z0-9]{4}$/.test(rawCode)
        ? rawCode
        : deriveDeterministicCode(email || username);

      if (friendCode === myCode) return;

      const dedupKey = (email || username).toLowerCase();
      if (seen.has(dedupKey)) return;
      seen.add(dedupKey);

      const exp = Number(u.exp || u.xp || 0);
      let personalRank = u.personalRank || u.rank || '🥉 Bronce';
      if (!personalRank.includes('🥉') && !personalRank.includes('🥈') && !personalRank.includes('🥇') && !personalRank.includes('💎')) {
        if (exp >= 1000 || String(personalRank).toLowerCase().includes('diamante')) personalRank = '💎 Diamante';
        else if (exp >= 500 || String(personalRank).toLowerCase().includes('oro')) personalRank = '🥇 Oro';
        else if (exp >= 200 || String(personalRank).toLowerCase().includes('plata')) personalRank = '🥈 Plata';
        else personalRank = '🥉 Bronce';
      }

      discovered.push({
        id: u.id || ('user_' + hashCode(dedupKey)),
        username: username || email.split('@')[0],
        email: email || `${username.toLowerCase().replace(/\s+/g, '')}@mastereng.com`,
        friendCode,
        gameId: friendCode,
        personalRank,
        exp,
        avatar: u.avatar || '🧑‍🎓'
      });
    }

    // 1. Revisar usuarios registrados en localStorage
    const localKeys = [
      'mastereng_registered_users',
      'english_app_registered_users',
      'mastereng_users',
      'registered_users',
      'english_app_users',
      'users_db'
    ];
    localKeys.forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) parsed.forEach(addCandidate);
        else if (parsed && typeof parsed === 'object') Object.values(parsed).forEach(addCandidate);
      } catch (e) {}
    });

    // 2. Revisar lista global en memoria si existe (ej. allAdminUsersList)
    if (Array.isArray(global.allAdminUsersList)) {
      global.allAdminUsersList.forEach(addCandidate);
    }

    // 3. Consultar endpoints reales del backend: GET /api/users y GET /api/admin/users
    if (typeof fetch === 'function') {
      const apiBase = (global.BackendSync && global.BackendSync.apiBaseUrl)
        ? global.BackendSync.apiBaseUrl.replace(/\/$/, '')
        : '/api';
      const endpoints = [`${apiBase}/users`, `${apiBase}/admin/users`];

      for (const ep of endpoints) {
        try {
          const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
          const timer = controller ? setTimeout(() => controller.abort(), 2200) : null;
          const res = await fetch(ep, controller ? { signal: controller.signal } : {});
          if (timer) clearTimeout(timer);
          if (res && res.ok) {
            const data = await res.json();
            const arr = Array.isArray(data)
              ? data
              : (Array.isArray(data.users) ? data.users : (Array.isArray(data.data) ? data.data : []));
            arr.forEach(addCandidate);
          }
        } catch (e) {}
      }
    }

    state.cachedDiscoveredUsers = discovered;
    return discovered;
  }

  // ============================================================================
  // 7. MOTOR DE RESPUESTA CONTEXTUAL EN INGLÉS PARA PRÁCTICA CON CONTACTOS REALES
  // ============================================================================
  const SMART_REPLIES_BY_ROLE = {
    partner: [
      {
        en: "I love practicing English with you! ❤️ Shall we visit the 3D Bistro for a date and complete our couple mission?",
        es: "¡Me encanta practicar inglés contigo! ❤️ ¿Vamos al Bistro 3D a una cita y completamos nuestra misión en pareja?"
      },
      {
        en: "You're doing amazing with your English! 🌹 Let's keep our daily streak 🔥 alive!",
        es: "¡Lo estás haciendo increíble con tu inglés! 🌹 ¡Mantengamos viva nuestra racha diaria 🔥!"
      }
    ],
    friends: [
      {
        en: "Awesome sentence, bestie! ⚡ Ready for a 1v1 Jest 3D duel to test our vocabulary?",
        es: "¡Excelente oración, mejor amigo! ⚡ ¿Listo para un duelo 1vs1 en Jest 3D para probar nuestro vocabulario?"
      },
      {
        en: "High key proud of our daily study streak! 🔥 Let's keep leveling up together!",
        es: "¡Súper orgulloso de nuestra racha de estudio diario! 🔥 ¡Sigamos subiendo de nivel juntos!"
      }
    ],
    family: [
      {
        en: "Great job practicing everyday English! 🏠 Let's review household and supermarket vocabulary together.",
        es: "¡Gran trabajo practicando inglés cotidiano! 🏠 Repasemos juntos vocabulario del hogar y supermercado."
      }
    ],
    colleague: [
      {
        en: "Well articulated, colleague! 💼 Consistent practice is key for business interviews and professional fluency.",
        es: "¡Muy bien articulado, colega! 💼 La práctica constante es clave para entrevistas de negocios y fluidez profesional."
      }
    ],
    group: [
      {
        en: "Great team energy! 👥 Let's keep the English conversation going!",
        es: "¡Gran energía de equipo! 👥 ¡Mantengamos activa la conversación en inglés!"
      }
    ]
  };

  function generateContextualSmartReply(userText, role) {
    const clean = (userText || '').toLowerCase();
    if (clean.includes('date') || clean.includes('cita') || clean.includes('bistro') || clean.includes('restaurant')) {
      return {
        en: "Sounds wonderful! 🕯️ Tap '🕯️ Invitar a Cita 3D' and let's practice at the 3D Bistro!",
        es: "¡Suena maravilloso! 🕯️ ¡Toca '🕯️ Invitar a Cita 3D' y practiquemos en el Bistro 3D!"
      };
    }
    if (clean.includes('jest') || clean.includes('jarz') || clean.includes('game') || clean.includes('duel')) {
      return {
        en: "Challenge accepted! 🃏 Send the Jest 3D invite and let's play 1v1!",
        es: "¡Reto aceptado! 🃏 ¡Envía la invitación de Jest 3D y juguemos 1vs1!"
      };
    }
    const pool = SMART_REPLIES_BY_ROLE[role] || SMART_REPLIES_BY_ROLE.friends;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ============================================================================
  // 8. MONTAJE DEL CONTENEDOR #view-community Y NAVEGACIÓN
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

    ['view-auth', 'view-home', 'view-path', 'view-stories', 'view-music', 'view-worldtour', 'view-jest', 'view-jest-game'].forEach(id => {
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
  // 9. RENDERIZADO PRINCIPAL SPLIT-VIEW (CON ESTADO VACÍO PARA CERO BOTS)
  // ============================================================================
  function getActiveContact() {
    if (!Array.isArray(state.contacts) || state.contacts.length === 0) {
      state.activeContactId = null;
      return null;
    }
    let c = state.contacts.find(x => x.id === state.activeContactId);
    if (!c) {
      c = state.contacts[0];
      state.activeContactId = c.id;
    }
    return c;
  }

  function getFilteredContacts() {
    const q = (state.searchQuery || '').toLowerCase().trim();
    return state.contacts.filter(c => {
      if (isBannedFakeBot(c)) return false;
      const bond = state.bonds[c.id] || {};
      const role = bond.role || (c.isGroup ? 'group' : 'friends');

      if (state.activeTab === 'partner' && role !== 'partner') return false;
      if (state.activeTab === 'friends' && !['friends', 'colleague'].includes(role)) return false;
      if (state.activeTab === 'family' && role !== 'family') return false;
      if (state.activeTab === 'groups' && !c.isGroup && role !== 'group') return false;

      if (q) {
        const hay = `${c.name} ${c.username || ''} ${c.email || ''} ${c.friendCode || ''} ${c.gameId || ''} ${calculateBondRank(bond)}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function renderCommunityHub() {
    if (typeof document === 'undefined' || !document.body) return;
    const viewEl = ensureCommunityViewContainer();
    const activeContact = getActiveContact();
    const activeBond = activeContact ? (state.bonds[activeContact.id] || {
      role: 'friends',
      roleConfirmed: true,
      theme: 'classic',
      streakDays: 1,
      coupleExp: 20,
      weeklyDatesCount: 0,
      weeklyGamesCount: 0,
      messagesToday: 0
    }) : null;
    const activeThemeObj = activeBond ? (CHAT_THEMES[activeBond.theme] || CHAT_THEMES.classic) : CHAT_THEMES.classic;
    const bondRankLabel = activeBond ? calculateBondRank(activeBond) : '';
    const filteredContacts = getFilteredContacts();
    const myCode = ensureUserUniqueGameId();

    let inboxPendingCount = 0;
    try {
      const rawInb = localStorage.getItem(STORAGE_KEYS.INBOX_INVITES);
      if (rawInb) {
        const arr = JSON.parse(rawInb);
        if (Array.isArray(arr)) inboxPendingCount = arr.filter(i => i && i.status === 'pending').length;
      }
    } catch (_) { inboxPendingCount = 0; }

    const m1Progress = activeBond ? Math.min(5, Number(activeBond.messagesToday) || 0) : 0;
    const m2Progress = activeBond ? Math.min(3, Number(activeBond.weeklyDatesCount) || 0) : 0;
    const m3Progress = activeBond ? Math.min(2, Number(activeBond.weeklyGamesCount) || 0) : 0;

    viewEl.innerHTML = `
      <div class="wa-chat-wrapper">
        <!-- Barra Superior de Navegación Social con ID Único y Guía de Rangos -->
        <div class="wa-top-SystemBar">
          <div class="flex items-center gap-2.5 flex-wrap">
            <button type="button" onclick="window.SocialChat.returnToHub()"
              class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition">
              <span>← Volver a Portales</span>
            </button>
            <div class="flex items-center gap-2">
              <span class="text-lg">💬</span>
              <div>
                <h2 class="text-sm font-black text-white leading-tight">MasterENG Social & Couples Hub</h2>
                <div class="flex items-center gap-1.5 flex-wrap mt-0.5">
                  <span class="text-[11px] text-emerald-400 font-semibold">
                    Tu ID Único de Jugador:
                    <span id="waHeaderMyUniqueId" class="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-500/30">${escapeHtml(myCode)}</span>
                  </span>
                  <button type="button" onclick="window.SocialChat.copyMyUniqueId()"
                    class="px-2 py-0.5 rounded-md bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/40 text-cyan-200 text-[10px] font-bold cursor-pointer transition">
                    📋 Copiar mi ID
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <button type="button" onclick="window.openInboxInvitesModal ? window.openInboxInvitesModal() : window.SocialChat.openInboxInvitesModal()"
              class="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/45 border border-purple-400/40 text-purple-200 text-xs font-extrabold shadow-lg flex items-center gap-1.5 cursor-pointer transition relative" title="Bandeja de Entrada e Invitaciones">
              <span>📥 Bandeja</span>
              <span id="waInboxBadge" class="inbox-badge inline-flex items-center justify-center px-1.5 py-0.2 min-w-[18px] text-[10px] font-black rounded-full bg-rose-500 text-white ${inboxPendingCount > 0 ? '' : 'hidden'}">${inboxPendingCount}</span>
            </button>
            <button type="button" onclick="window.SocialChat.openRanksGuideModal()"
              class="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/40 text-amber-300 text-xs font-extrabold shadow-lg flex items-center gap-1 cursor-pointer transition">
              <span>📖 Guía de Rangos y Rachas</span>
            </button>
            <button type="button" onclick="window.SocialChat.openAddFriendModal()"
              class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg flex items-center gap-1 cursor-pointer transition">
              <span>🔍 Buscar / Agregar Amigo</span>
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
               PANEL IZQUIERDO (SIDEBAR DE CONTACTOS REALES)
               ============================================================ -->
          <aside class="wa-sidebar">
            <div class="wa-sidebar-header">
              <div class="wa-search-box">
                <span class="text-slate-400 text-xs">🔍</span>
                <input
                  id="waSidebarSearchInput"
                  type="text"
                  value="${escapeHtml(state.searchQuery)}"
                  placeholder="Filtrar tus chats por nombre o ID MENG-XXXX..."
                  oninput="window.SocialChat.handleSearch(this.value)"
                />
              </div>
              <div class="flex items-center gap-1.5 mt-2">
                <button type="button" onclick="window.SocialChat.openAddFriendModal()"
                  class="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600/25 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold cursor-pointer transition">
                  🔍 Buscar / Agregar Amigo
                </button>
                <button type="button" onclick="window.SocialChat.openRanksGuideModal()"
                  class="py-1.5 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-amber-300 text-[11px] font-bold cursor-pointer transition"
                  title="Ver Guía de Rangos y Rachas">
                  📖 Guía
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

            <!-- Lista de Chats o Estado Vacío Sin Bots -->
            <div class="wa-contacts-list" id="waContactsList">
              ${filteredContacts.length === 0 ? `
                <div class="p-6 text-center text-slate-300 text-xs space-y-3">
                  <div class="text-3xl">🧑‍🤝‍🧑</div>
                  <p class="font-bold text-slate-200 leading-relaxed">
                    Aún no tienes conversaciones activas. Usa el botón 'Buscar / Agregar Amigo' o comparte tu ID Único para empezar a chatear con personas reales.
                  </p>
                  <div class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px]">
                    <div class="text-slate-400">Tu ID Único para compartir:</div>
                    <div class="font-mono font-black text-cyan-300 text-sm mt-0.5">${escapeHtml(myCode)}</div>
                  </div>
                  <button type="button" onclick="window.SocialChat.openAddFriendModal()"
                    class="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer transition">
                    🔍 Buscar / Agregar Amigo
                  </button>
                </div>
              ` : filteredContacts.map(c => renderSidebarContactItem(c)).join('')}
            </div>
          </aside>

          <!-- ============================================================
               PANEL DERECHO (VENTANA DE CHAT ACTIVA O ESTADO VACÍO)
               ============================================================ -->
          <section class="wa-chat-window ${activeThemeObj.cssClass}" id="waActiveChatWindow">
            ${!activeContact ? `
              <div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div class="max-w-md p-6 rounded-2xl bg-slate-900/85 border border-slate-800 shadow-2xl space-y-4">
                  <div class="text-4xl">💬✨</div>
                  <h3 class="text-base font-black text-white">Chat Social en Tiempo Real (Solo Personas Reales)</h3>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    Aún no tienes conversaciones activas. Usa el botón 'Buscar / Agregar Amigo' o comparte tu ID Único para empezar a chatear con personas reales.
                  </p>
                  <div class="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between gap-2">
                    <div class="text-left">
                      <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Tu ID Único de Jugador</div>
                      <div class="text-sm font-mono font-black text-cyan-300">${escapeHtml(myCode)}</div>
                    </div>
                    <button type="button" onclick="window.SocialChat.copyMyUniqueId()"
                      class="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/40 text-cyan-200 text-xs font-bold cursor-pointer transition">
                      📋 Copiar mi ID
                    </button>
                  </div>
                  <div class="flex items-center justify-center gap-2.5 flex-wrap pt-1">
                    <button type="button" onclick="window.SocialChat.openAddFriendModal()"
                      class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg cursor-pointer transition">
                      🔍 Buscar / Agregar Amigo
                    </button>
                    <button type="button" onclick="window.SocialChat.openRanksGuideModal()"
                      class="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/40 text-amber-300 text-xs font-black cursor-pointer transition">
                      📖 Guía de Rangos y Rachas
                    </button>
                  </div>
                </div>
              </div>
            ` : `
              <!-- Header del Chat Activo -->
              <header class="wa-chat-header">
                <div class="flex items-center gap-2.5 min-w-0">
                  <button type="button" class="wa-mobile-back-btn" onclick="window.SocialChat.backToSidebarMobile()" title="Volver a lista de chats">
                    ←
                  </button>
                  <div class="wa-avatar-circle">
                    <span>${activeContact.avatar || '🧑‍🎓'}</span>
                    <span class="wa-online-dot"></span>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <h3 class="text-sm font-black text-white truncate">${escapeHtml(activeContact.name)}</h3>
                      <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700" title="ID Único del Amigo">
                        ${escapeHtml(activeContact.friendCode || activeContact.gameId || '')}
                      </span>
                      <span class="wa-rank-pill" title="Insignia de Rango de Inglés">
                        ${escapeHtml(activeContact.personalRank || '🥉 Bronce')}
                      </span>
                      <span class="wa-streak-pill" title="Racha activa de días seguidos practicando inglés">
                        🔥 ${Number(activeBond.streakDays) || 0} días
                      </span>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap mt-0.5">
                      <span class="wa-bond-rank-badge" id="waHeaderBondRankBadge">
                        ${escapeHtml(bondRankLabel)}
                        ${activeBond.roleConfirmed === false ? ' (⏳ Pendiente de confirmación)' : ''}
                      </span>
                      <span class="text-[11px] text-slate-300/90 truncate">
                        ${state.typingByContact[activeContact.id]
                          ? '✍️ typing in English...'
                          : escapeHtml((RELATIONSHIP_ROLES[activeBond.role] && RELATIONSHIP_ROLES[activeBond.role].description) || activeContact.statusText || '')}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Controles de Cabecera: Selector de Rol en Conjunto, Tema, Guía y Misiones -->
                <div class="wa-header-controls">
                  <label class="wa-select-wrapper" title="Proponer o cambiar Rol de Relación en Conjunto">
                    <span class="wa-select-label">Vínculo:</span>
                    <select id="waRoleSelector" onchange="window.SocialChat.openRoleProposalModal('${activeContact.id}', this.value)">
                      <option value="partner" ${activeBond.role === 'partner' ? 'selected' : ''}>❤️ Pareja (Couple)</option>
                      <option value="friends" ${activeBond.role === 'friends' ? 'selected' : ''}>⚡ Mejor Amigo / Compañero</option>
                      <option value="family" ${activeBond.role === 'family' ? 'selected' : ''}>🏠 Familia (Family)</option>
                      <option value="colleague" ${activeBond.role === 'colleague' ? 'selected' : ''}>💼 Colega (Coworkers)</option>
                      ${activeContact.isGroup ? `<option value="group" ${activeBond.role === 'group' ? 'selected' : ''}>👥 Grupo</option>` : ''}
                    </select>
                  </label>

                  <label class="wa-select-wrapper" title="Cambiar Tema Visual del Chat">
                    <span class="wa-select-label">Tema:</span>
                    <select id="waThemeSelector" onchange="window.SocialChat.changeChatTheme('${activeContact.id}', this.value)">
                      <option value="love" ${activeBond.theme === 'love' ? 'selected' : ''}>❤️ Amor (Love & Romance)</option>
                      <option value="nature" ${activeBond.theme === 'nature' ? 'selected' : ''}>🌿 Naturaleza (Nature & Forest)</option>
                      <option value="work" ${activeBond.theme === 'work' ? 'selected' : ''}>💼 Trabajo (Executive & Work)</option>
                      <option value="space" ${activeBond.theme === 'space' ? 'selected' : ''}>🌌 Espacio (Cosmic Neon)</option>
                      <option value="classic" ${activeBond.theme === 'classic' ? 'selected' : ''}>🌙 Clásico (WhatsApp Dark)</option>
                    </select>
                  </label>

                  <button type="button" onclick="window.SocialChat.openRanksGuideModal()"
                    class="wa-missions-toggle-btn" title="Abrir Guía de Rangos y Rachas">
                    <span>📖 Guía de Rangos</span>
                  </button>

                  <button type="button" onclick="window.SocialChat.toggleMissionsDrawer()"
                    class="wa-missions-toggle-btn ${state.showMissionsDrawer ? 'active' : ''}">
                    <span>🎯 Misiones (${(m1Progress >= 5 ? 1 : 0) + (m2Progress >= 3 ? 1 : 0) + (m3Progress >= 2 ? 1 : 0)}/3)</span>
                  </button>
                </div>
              </header>

              <!-- Panel Desplegable de "Misiones de Vínculo / Pareja" -->
              <div id="waMissionsDrawer" class="wa-missions-drawer ${state.showMissionsDrawer ? 'open' : ''}">
                <div class="wa-missions-header">
                  <div>
                    <h4 class="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                      <span>🔥 Misiones Semanales de Vínculo & Racha</span>
                      <span class="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-extrabold">${escapeHtml(bondRankLabel)}</span>
                    </h4>
                    <p class="text-[11px] text-slate-200/90 mt-0.5">
                      ${escapeHtml((RELATIONSHIP_ROLES[activeBond.role] && RELATIONSHIP_ROLES[activeBond.role].description) || '')}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-extrabold text-amber-300">✨ ${Number(activeBond.coupleExp) || 0} EXP de Vínculo</span>
                    <button type="button" onclick="window.SocialChat.toggleMissionsDrawer()" class="text-slate-300 hover:text-white text-sm font-bold px-2 py-0.5 rounded bg-black/20 cursor-pointer">✕</button>
                  </div>
                </div>

                <div class="wa-evolution-track">
                  ${renderRoleEvolutionSteps(activeBond)}
                </div>

                <div class="wa-missions-grid">
                  <div class="wa-mission-card ${m1Progress >= 5 ? 'completed' : ''}">
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-xs font-extrabold text-white">💬 Chatear en inglés hoy (5 mensajes)</span>
                      <span class="wa-mission-badge">${m1Progress}/5</span>
                    </div>
                    <p class="text-[11px] text-slate-300 mt-1">Recompensa: <b>+1 día de racha 🔥</b> y <b>+15 EXP</b></p>
                    <div class="wa-progress-bar mt-2">
                      <div class="wa-progress-fill" style="width: ${(m1Progress / 5) * 100}%"></div>
                    </div>
                  </div>

                  <div class="wa-mission-card ${m2Progress >= 3 ? 'completed' : ''}">
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-xs font-extrabold text-white">🕯️ Ir a 3 Citas en el Bistro 3D (${m2Progress}/3)</span>
                    </div>
                    <div class="wa-progress-bar mt-1.5 mb-2">
                      <div class="wa-progress-fill" style="width: ${(m2Progress / 3) * 100}%"></div>
                    </div>
                    <button type="button" onclick="window.SocialChat.goTo3DDateNow('${activeContact.id}')"
                      class="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-[11px] font-black shadow-md cursor-pointer transition">
                      🕯️ Ir a Cita 3D Ahora
                    </button>
                  </div>

                  <div class="wa-mission-card ${m3Progress >= 2 ? 'completed' : ''}">
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-xs font-extrabold text-white">🃏 Jugar 2 partidas de Jest 3D (${m3Progress}/2)</span>
                    </div>
                    <div class="wa-progress-bar mt-1.5 mb-2">
                      <div class="wa-progress-fill" style="width: ${(m3Progress / 2) * 100}%"></div>
                    </div>
                    <button type="button" onclick="window.SocialChat.sendJestInvite('${activeContact.id}', true)"
                      class="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-[11px] font-black shadow-md cursor-pointer transition">
                      🃏 Invitar a Duelo Jest 3D
                    </button>
                  </div>
                </div>
              </div>

              <!-- Área de Mensajes del Chat -->
              <div class="wa-messages-container" id="waMessagesContainer">
                <div class="wa-encryption-banner">
                  🔒 Chat con <b>${escapeHtml(activeContact.name)}</b> (${escapeHtml(activeContact.friendCode || '')}) • Vínculo: <b>${escapeHtml((RELATIONSHIP_ROLES[activeBond.role] && RELATIONSHIP_ROLES[activeBond.role].label) || '⚡ Amigos')}</b> • Rango: <b>${escapeHtml(bondRankLabel)}</b> (🔥 ${Number(activeBond.streakDays) || 0} días)
                </div>
                ${renderMessagesForContact(activeContact.id)}
              </div>

              <!-- Barra Rápida de Acciones -->
              <div class="wa-quick-actions-strip">
                <button type="button" onclick="window.SocialChat.toggleVoiceDictation()"
                  id="waVoiceDictateBtn"
                  class="wa-action-chip ${state.isRecordingVoice ? 'recording' : ''}">
                  <span>🎤 Nota de Voz / Dictado</span>
                </button>

                <button type="button" onclick="window.SocialChat.toggleTranslateReceived()"
                  class="wa-action-chip ${state.showTranslationsGlobal ? 'active' : ''}">
                  <span>🌐 Traducir mensajes</span>
                </button>

                <button type="button" onclick="window.SocialChat.openRoleProposalModal('${activeContact.id}', '${activeBond.role}')"
                  class="wa-action-chip">
                  <span>🤝 Elegir Rol en Conjunto</span>
                </button>

                <button type="button" onclick="window.SocialChat.sendJestInvite('${activeContact.id}', false)"
                  class="wa-action-chip chip-jest">
                  <span>🃏 Invitar a Jest 3D</span>
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
                  title="Dictar mensaje en inglés">
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
            `}
          </section>
        </div>

        <!-- Modal para 🔍 Buscar / Agregar Amigo (Por ID Único MENG-XXXX o Nombre) -->
        <div id="waAddFriendModal" class="wa-modal-backdrop hidden"></div>

        <!-- Modal para 🤝 Propuesta de Rol de Relación en Conjunto -->
        <div id="waRoleProposalModal" class="wa-modal-backdrop hidden"></div>

        <!-- Modal para 📖 Guía de Rangos y Rachas -->
        <div id="waRanksGuideModal" class="wa-modal-backdrop hidden"></div>

        <!-- Modal para 👥 Crear Grupo -->
        <div id="waCreateGroupModal" class="wa-modal-backdrop hidden"></div>

        <!-- Modal para 📥 Bandeja de Entrada e Invitaciones Globales -->
        <div id="waInboxInvitesModal" class="wa-modal-backdrop hidden"></div>
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
    const lastText = lastMsg ? lastMsg.text : '¡Inicia la conversación en inglés!';
    const lastTime = lastMsg ? lastMsg.timestamp : 'Ahora';

    return `
      <div class="wa-contact-item ${isSelected ? 'active' : ''}"
           onclick="window.SocialChat.selectContact('${contact.id}')">
        <div class="wa-avatar-circle">
          <span>${contact.avatar || '🧑‍🎓'}</span>
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
            <span class="wa-mini-badge streak">🔥 ${Number(bond.streakDays) || 0}d</span>
          </div>
          <p class="wa-contact-preview truncate">${escapeHtml(lastText)}</p>
        </div>
      </div>
    `;
  }

  function renderRoleEvolutionSteps(bond) {
    const role = (bond && bond.role) || 'friends';
    const days = Number(bond && bond.streakDays) || 0;
    const roleObj = RELATIONSHIP_ROLES[role] || RELATIONSHIP_ROLES.friends;
    const steps = roleObj.ranks || [];

    return steps.map(s => {
      const unlocked = days >= s.minDays;
      return `
        <div class="wa-evo-step ${unlocked ? 'unlocked' : ''}" title="${escapeHtml(s.desc)}">
          <span>${escapeHtml(s.name)}</span>
          <span class="text-[9px] opacity-75">(${s.minDays}d 🔥)</span>
        </div>
      `;
    }).join('<span class="text-slate-400 text-xs">➔</span>');
  }

  function renderMessagesForContact(contactId) {
    const list = state.messages[contactId] || [];
    const contact = state.contacts.find(c => c.id === contactId);
    const friendName = contact ? contact.name : 'Amigo';

    if (list.length === 0) {
      return `
        <div class="p-6 text-center text-slate-300 text-xs">
          Envía tu primer mensaje en inglés o propón un Rol de Relación en Conjunto con <b>${escapeHtml(friendName)}</b>.
        </div>
      `;
    }

    return list.map(m => {
      const isMe = m.sender === 'me';
      const showTrans = state.showTranslationsGlobal || !!state.translatedMsgIds[m.id];

      // Tarjeta interactiva de Solicitud de Vínculo en Conjunto
      if (m.type === 'role_proposal') {
        const roleObj = RELATIONSHIP_ROLES[m.proposedRole] || RELATIONSHIP_ROLES.friends;
        const isConfirmed = !!m.accepted;
        return `
          <div class="wa-bubble-row ${isMe ? 'sent' : 'received'}">
            <div class="wa-invite-card" style="border: 1.5px solid rgba(244, 114, 182, 0.55); background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(49,16,47,0.88)); border-radius: 14px; padding: 12px 14px; max-width: 380px;">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-2xl">🤝</span>
                <div>
                  <div class="text-[11px] font-black uppercase tracking-wider text-pink-300">Solicitud de Vínculo en Conjunto</div>
                  <div class="text-sm font-extrabold text-white">${escapeHtml(roleObj.title)}</div>
                </div>
              </div>
              <p class="text-xs text-slate-100 font-semibold mb-1.5">${escapeHtml(m.text)}</p>
              <p class="text-[11px] text-slate-300 italic mb-2.5">"${escapeHtml(roleObj.description)}"</p>
              ${isConfirmed ? `
                <div class="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold text-center">
                  ✅ Rol Confirmado en Conjunto: ${escapeHtml(roleObj.label)}
                </div>
              ` : `
                <button type="button"
                  onclick="window.SocialChat.acceptJointRoleProposal('${escapeHtml(contactId)}', '${escapeHtml(m.id)}', '${escapeHtml(m.proposedRole)}')"
                  class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black shadow-md cursor-pointer transition">
                  ✅ Aceptar Rol en Conjunto
                </button>
              `}
              <span class="wa-bubble-time block text-right mt-1 text-[10px] text-slate-400">${escapeHtml(m.timestamp || '')}</span>
            </div>
          </div>
        `;
      }

      if (m.type === 'jest_invite') {
        return `
          <div class="wa-bubble-row ${isMe ? 'sent' : 'received'}">
            <div class="wa-invite-card wa-invite-card-jest jest-invite-card">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-2xl">🃏</span>
                <div>
                  <div class="text-xs font-black uppercase tracking-wider text-amber-300">Reto Oficial • Jest / Jarz 3D</div>
                  <div class="text-sm font-extrabold text-white">Duelo de Adivinanza en Mesa 3D (1vs1)</div>
                </div>
              </div>
              <p class="text-xs text-slate-200 mb-2.5">${escapeHtml(m.text)}</p>
              <button type="button"
                onclick="window.SocialChat.acceptJestDuel('${escapeHtml(contactId)}', '${escapeHtml(friendName)}', '${escapeHtml(m.roomCode || '')}')"
                class="wa-invite-cta-btn jest-cta">
                ✅ Aceptar Invitación e Ir Ahora
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
                  <div class="text-xs font-black uppercase tracking-wider text-rose-300">Invitación Especial • Bistro 3D</div>
                  <div class="text-sm font-extrabold text-white">Cita Interactiva en el Restaurante 3D</div>
                </div>
              </div>
              <p class="text-xs text-slate-200 mb-2.5">${escapeHtml(m.text)}</p>
              <button type="button"
                onclick="window.SocialChat.goTo3DDateNow('${escapeHtml(contactId)}', '${escapeHtml(m.roomCode || '')}')"
                class="wa-invite-cta-btn date3d-cta">
                ✅ Aceptar Invitación e Ir Ahora
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
              <button type="button" onclick="window.SocialChat.speakMessage('${escapeJsStr(m.text)}')" class="wa-mini-icon-btn" title="Escuchar pronunciación">🔊</button>
              ${m.translation ? `<button type="button" onclick="window.SocialChat.toggleSingleTranslation('${m.id}')" class="wa-mini-icon-btn" title="Traducir mensaje">🌐</button>` : ''}
              <span class="wa-bubble-time">${escapeHtml(m.timestamp || '')} ${isMe ? '✓✓' : ''}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ============================================================================
  // 10. ELECCIÓN DE ROL DE RELACIÓN EN CONJUNTO + SOLICITUD EN EL CHAT
  // ============================================================================
  function openRoleProposalModal(contactId, preselectedRole = 'friends') {
    const contact = state.contacts.find(c => c.id === contactId) || getActiveContact();
    if (!contact) return;

    const modal = document.getElementById('waRoleProposalModal');
    if (!modal) {
      sendJointRoleProposal(contact.id, preselectedRole);
      return;
    }

    modal.classList.remove('hidden');
    const currentBond = state.bonds[contact.id] || {};
    const selectedRole = RELATIONSHIP_ROLES[preselectedRole] ? preselectedRole : (currentBond.role || 'friends');

    const selectableRoles = ['partner', 'friends', 'family', 'colleague'];

    modal.innerHTML = `
      <div class="wa-modal-card" style="max-width: 520px;">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>🤝 Elegir Rol de Relación en Conjunto</span>
          </h3>
          <button type="button" onclick="window.SocialChat.closeModals()" class="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
        </div>
        <p class="text-xs text-slate-300 mb-3">
          Selecciona el vínculo que deseas establecer con <b>${escapeHtml(contact.name)}</b>. Se enviará una <b>Propuesta de Vínculo</b> al chat para confirmarlo en conjunto:
        </p>

        <div class="space-y-2 mb-4" id="waRoleCardsContainer">
          ${selectableRoles.map(rKey => {
            const r = RELATIONSHIP_ROLES[rKey];
            const isChosen = rKey === selectedRole;
            return `
              <label class="block p-3 rounded-xl border cursor-pointer transition ${isChosen ? 'bg-slate-800/95 border-cyan-400' : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'}">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <input type="radio" name="waJointRoleChoice" value="${r.id}" ${isChosen ? 'checked' : ''} />
                    <span class="text-xs font-black text-white">${escapeHtml(r.title)}</span>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-bold">${escapeHtml(r.shortLabel)}</span>
                </div>
                <p class="text-[11px] text-slate-300 mt-1 pl-5">${escapeHtml(r.description)}</p>
              </label>
            `;
          }).join('')}
        </div>

        <div class="flex items-center justify-end gap-2">
          <button type="button" onclick="window.SocialChat.closeModals()"
            class="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer">
            Cancelar
          </button>
          <button type="button" onclick="window.SocialChat.confirmSendRoleProposal('${escapeHtml(contact.id)}')"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black shadow-lg cursor-pointer transition">
            📨 Enviar Solicitud de Vínculo al Chat
          </button>
        </div>
      </div>
    `;
  }

  function confirmSendRoleProposal(contactId) {
    const checked = document.querySelector('input[name="waJointRoleChoice"]:checked');
    const chosenRole = checked ? checked.value : 'friends';
    closeModals();
    sendJointRoleProposal(contactId, chosenRole);
  }

  function sendJointRoleProposal(contactId, newRole) {
    const contact = state.contacts.find(c => c.id === contactId) || getActiveContact();
    if (!contact) return;

    const roleObj = RELATIONSHIP_ROLES[newRole] || RELATIONSHIP_ROLES.friends;
    if (!state.bonds[contact.id]) {
      state.bonds[contact.id] = {
        role: newRole,
        roleConfirmed: false,
        pendingRole: newRole,
        theme: roleObj.defaultTheme,
        streakDays: 1,
        lastInteractionDate: getTodayIso(),
        coupleExp: 20,
        weeklyDatesCount: 0,
        weeklyGamesCount: 0,
        messagesToday: 0
      };
    } else {
      state.bonds[contact.id].pendingRole = newRole;
      state.bonds[contact.id].roleConfirmed = false;
    }

    if (!Array.isArray(state.messages[contact.id])) {
      state.messages[contact.id] = [];
    }

    const proposalMsgId = 'role_prop_' + Date.now();
    const proposalText = `Propuesta de Vínculo: ¿Aceptas establecer nuestro rol como ${roleObj.label.replace(/^[^\s]+\s/, '')}?`;

    state.messages[contact.id].push({
      id: proposalMsgId,
      sender: 'me',
      senderName: 'Tú',
      text: proposalText,
      proposedRole: newRole,
      accepted: false,
      timestamp: getCurrentTimeStr(),
      type: 'role_proposal'
    });

    saveSocialState();
    renderCommunityHub();
    scrollToBottomMessages();
    showSocialToast(`📨 Solicitud enviada: ${proposalText}`);
  }

  function acceptJointRoleProposal(contactId, messageId, proposedRole) {
    const roleObj = RELATIONSHIP_ROLES[proposedRole] || RELATIONSHIP_ROLES.friends;
    if (!state.bonds[contactId]) {
      state.bonds[contactId] = {
        role: proposedRole,
        roleConfirmed: true,
        pendingRole: null,
        theme: roleObj.defaultTheme,
        streakDays: 1,
        lastInteractionDate: getTodayIso(),
        coupleExp: 30,
        weeklyDatesCount: 0,
        weeklyGamesCount: 0,
        messagesToday: 1
      };
    } else {
      state.bonds[contactId].role = proposedRole;
      state.bonds[contactId].roleConfirmed = true;
      state.bonds[contactId].pendingRole = null;
      state.bonds[contactId].theme = roleObj.defaultTheme || state.bonds[contactId].theme;
      state.bonds[contactId].coupleExp = (Number(state.bonds[contactId].coupleExp) || 0) + 15;
    }

    const msgs = state.messages[contactId] || [];
    msgs.forEach(m => {
      if (m.id === messageId || m.type === 'role_proposal') {
        m.accepted = true;
      }
    });

    const contact = state.contacts.find(c => c.id === contactId);
    msgs.push({
      id: 'role_ack_' + Date.now(),
      sender: 'them',
      senderName: contact ? contact.name : 'Amigo',
      text: `✅ Joint Role Confirmed! We are now officially "${roleObj.title}" (${calculateBondRank(state.bonds[contactId])})!`,
      translation: `✅ ¡Rol en Conjunto Confirmado! ¡Ahora somos oficialmente "${roleObj.title}" (${calculateBondRank(state.bonds[contactId])})!`,
      timestamp: getCurrentTimeStr(),
      type: 'text'
    });

    saveSocialState();
    renderCommunityHub();
    scrollToBottomMessages();
    showSocialToast(`✅ Rol confirmado en conjunto: ${roleObj.title}`);
  }

  function changeRelationshipRole(contactId, newRole) {
    openRoleProposalModal(contactId, newRole);
  }

  // ============================================================================
  // 11. MODAL DE GUÍA DE RANGOS Y RACHAS
  // ============================================================================
  function openRanksGuideModal() {
    const modal = document.getElementById('waRanksGuideModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const guideRoles = ['partner', 'friends', 'family', 'colleague'];

    modal.innerHTML = `
      <div class="wa-modal-card" style="max-width: 640px; max-height: 85vh; overflow-y: auto;">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>📖 Guía Oficial de Rangos, Vínculos y Rachas (🔥)</span>
          </h3>
          <button type="button" onclick="window.SocialChat.closeModals()" class="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
        </div>

        <div class="p-3 rounded-xl bg-slate-900/95 border border-amber-500/30 text-xs text-slate-200 mb-4 space-y-1.5">
          <div class="font-black text-amber-300">⚡ ¿Cómo suben los días de racha (🔥) y los rangos con tus amigos reales?</div>
          <p>• <b>💬 Misión Diaria de Chat:</b> Envía 5 mensajes en inglés en el día para ganar <b>+1 día de racha 🔥</b> y <b>+15 EXP</b>.</p>
          <p>• <b>🕯️ Citas en el Bistro 3D:</b> Completa 3 citas interactivas en la semana para sumar racha extra y desbloquear rangos románticos o sociales.</p>
          <p>• <b>🃏 Duelos en Jest / Jarz 3D:</b> Juega 2 partidas 1vs1 en la mesa 3D con tu amigo para ganar <b>+40 EXP</b> y puntos de afinidad.</p>
        </div>

        <div class="space-y-4">
          ${guideRoles.map(rKey => {
            const role = RELATIONSHIP_ROLES[rKey];
            return `
              <div class="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
                <div class="flex items-center justify-between flex-wrap gap-1 mb-1">
                  <h4 class="text-sm font-black text-cyan-300">${escapeHtml(role.title)}</h4>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">${escapeHtml(role.label)}</span>
                </div>
                <p class="text-xs text-slate-300 italic mb-2.5">"${escapeHtml(role.description)}"</p>
                <div class="space-y-1.5">
                  ${role.ranks.map(rk => `
                    <div class="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs">
                      <div>
                        <div class="font-extrabold text-white">${escapeHtml(rk.name)}</div>
                        <div class="text-[11px] text-slate-400">${escapeHtml(rk.desc)}</div>
                      </div>
                      <span class="shrink-0 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] font-bold">
                        ${escapeHtml(rk.req)}
                      </span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="mt-4 flex justify-end">
          <button type="button" onclick="window.SocialChat.closeModals()"
            class="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black cursor-pointer">
            ¡Entendido!
          </button>
        </div>
      </div>
    `;
  }

  // ============================================================================
  // 12. BUSCADOR DE AMIGOS ESTILO VIDEOJUEGO (POR ID ÚNICO MENG-XXXX O NOMBRE)
  // ============================================================================
  async function openAddFriendModal() {
    const modal = document.getElementById('waAddFriendModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const myCode = ensureUserUniqueGameId();
    const registeredUsers = await discoverRegisteredUsers();

    modal.innerHTML = `
      <div class="wa-modal-card" style="max-width: 560px;">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>🔍 Buscar / Agregar Amigo (ID Único o Nombre)</span>
          </h3>
          <button type="button" onclick="window.SocialChat.closeModals()" class="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
        </div>

        <div class="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between gap-2 mb-3">
          <div class="text-xs text-slate-300">
            Tu ID Único de Jugador: <span class="font-mono font-black text-cyan-300">${escapeHtml(myCode)}</span>
          </div>
          <button type="button" onclick="window.SocialChat.copyMyUniqueId()"
            class="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/40 text-cyan-200 text-[11px] font-bold cursor-pointer">
            📋 Copiar mi ID
          </button>
        </div>

        <div class="space-y-2.5">
          <div>
            <label class="block text-[11px] font-bold text-slate-300 mb-1">
              Buscar jugador en vivo por ID Único (<code class="text-cyan-300">MENG-XXXX</code>), Nombre de usuario o Correo:
            </label>
            <input
              id="waNewFriendIdentifier"
              type="text"
              placeholder="Ej: MENG-7492, Sofia Morales, carlos@mastereng.com..."
              oninput="window.SocialChat.filterFriendSearchResults(this.value)"
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">Proponer Rol de Relación:</label>
              <select id="waNewFriendRole" onchange="window.SocialChat.updateRolePreviewDesc(this.value)"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white">
                <option value="partner">❤️ Pareja (Couple)</option>
                <option value="friends" selected>⚡ Mejor Amigo / Compañero (Besties)</option>
                <option value="family">🏠 Familia (Family)</option>
                <option value="colleague">💼 Colega (Coworkers)</option>
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

          <div id="waRolePreviewDescBox" class="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-amber-300 italic">
            ${escapeHtml(RELATIONSHIP_ROLES.friends.description)}
          </div>

          <button type="button" onclick="window.SocialChat.confirmAddFriend()"
            class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg cursor-pointer transition">
            ➕ Agregar por ID / Nombre y Enviar Solicitud de Vínculo
          </button>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-800">
          <div class="text-[11px] font-bold text-slate-400 mb-2">
            Jugadores reales encontrados en la base de datos:
          </div>
          <div id="waDiscoveredUsersContainer" class="max-h-48 overflow-y-auto space-y-2">
            ${renderDiscoveredUserCards(registeredUsers, '')}
          </div>
        </div>
      </div>
    `;
  }

  function updateRolePreviewDesc(roleKey) {
    const box = document.getElementById('waRolePreviewDescBox');
    const roleObj = RELATIONSHIP_ROLES[roleKey] || RELATIONSHIP_ROLES.friends;
    if (box) {
      box.textContent = roleObj.description;
    }
  }

  function renderDiscoveredUserCards(usersList, queryText) {
    const q = String(queryText || '').toLowerCase().trim();
    const filtered = (usersList || []).filter(u => {
      if (!q) return true;
      const hay = `${u.username || ''} ${u.email || ''} ${u.friendCode || ''} ${u.gameId || ''} ${u.personalRank || ''}`.toLowerCase();
      return hay.includes(q);
    });

    if (filtered.length === 0) {
      return `
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center text-xs text-slate-400">
          No se encontraron coincidencias exactas en la lista local. Escribe el ID Único (<b>MENG-XXXX</b>) o el nombre arriba y pulsa <b>"Agregar por ID / Nombre"</b> para conectar directamente.
        </div>
      `;
    }

    return filtered.map(u => `
      <div class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/95 border border-slate-800 hover:border-cyan-500/40 transition">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="text-lg">${u.avatar || '🧑‍🎓'}</span>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-xs font-extrabold text-white truncate">${escapeHtml(u.username)}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">${escapeHtml(u.personalRank || '🥉 Bronce')}</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-bold">${escapeHtml(u.friendCode)}</span>
            </div>
            <div class="text-[10px] text-slate-400 truncate">${escapeHtml(u.email)}</div>
          </div>
        </div>
        <button type="button"
          onclick="window.SocialChat.addRealUserAndChat('${escapeJsStr(u.username)}', '${escapeJsStr(u.email)}', '${escapeJsStr(u.friendCode)}', '${escapeJsStr(u.personalRank)}')"
          class="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black shadow cursor-pointer transition">
          Agregar y Chatear
        </button>
      </div>
    `).join('');
  }

  function filterFriendSearchResults(queryText) {
    const container = document.getElementById('waDiscoveredUsersContainer');
    if (!container) return;
    container.innerHTML = renderDiscoveredUserCards(state.cachedDiscoveredUsers, queryText);
  }

  function addRealUserAndChat(username, email, friendCode, personalRank) {
    const roleSel = document.getElementById('waNewFriendRole');
    const themeSel = document.getElementById('waNewFriendTheme');
    const chosenRole = roleSel ? roleSel.value : 'friends';
    const roleObj = RELATIONSHIP_ROLES[chosenRole] || RELATIONSHIP_ROLES.friends;
    const chosenTheme = themeSel ? themeSel.value : roleObj.defaultTheme;

    const cleanName = String(username || '').trim();
    const cleanCode = String(friendCode || '').trim().toUpperCase() || deriveDeterministicCode(cleanName);

    // Verificar si ya existe este contacto real
    let existing = state.contacts.find(c =>
      (c.friendCode && c.friendCode.toUpperCase() === cleanCode) ||
      (c.name && c.name.toLowerCase() === cleanName.toLowerCase())
    );

    if (!existing) {
      const newId = 'contact_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5);
      existing = {
        id: newId,
        name: cleanName,
        username: cleanName.toLowerCase().replace(/\s+/g, '_'),
        email: email || `${cleanName.toLowerCase().replace(/\s+/g, '')}@mastereng.com`,
        friendCode: cleanCode,
        gameId: cleanCode,
        avatar: chosenRole === 'partner' ? '💖' : '🧑‍🎓',
        personalRank: personalRank || '🥉 Bronce',
        cefr: 'B1-B2',
        statusText: `ID: ${cleanCode} • Jugador Real en MasterENG`,
        isOnline: true,
        isGroup: false
      };
      state.contacts.unshift(existing);
    }

    state.bonds[existing.id] = {
      role: chosenRole,
      roleConfirmed: false,
      pendingRole: chosenRole,
      theme: chosenTheme,
      streakDays: 1,
      lastInteractionDate: getTodayIso(),
      coupleExp: 25,
      weeklyDatesCount: 0,
      weeklyGamesCount: 0,
      messagesToday: 1
    };

    if (!Array.isArray(state.messages[existing.id])) {
      state.messages[existing.id] = [];
    }

    // Enviar automáticamente la Solicitud de Vínculo en Conjunto al iniciar el chat
    state.messages[existing.id].push({
      id: 'role_prop_init_' + Date.now(),
      sender: 'me',
      senderName: 'Tú',
      text: `Propuesta de Vínculo: ¿Aceptas establecer nuestro rol como ${roleObj.label.replace(/^[^\s]+\s/, '')}?`,
      proposedRole: chosenRole,
      accepted: false,
      timestamp: getCurrentTimeStr(),
      type: 'role_proposal'
    });

    state.activeContactId = existing.id;
    state.mobileShowChatPane = true;
    saveSocialState();
    closeModals();
    renderCommunityHub();
    scrollToBottomMessages();
    showSocialToast(`✅ Conectado con ${cleanName} (${cleanCode}). Solicitud de vínculo enviada.`);
  }

  async function confirmAddFriend() {
    const inp = document.getElementById('waNewFriendIdentifier');
    const raw = (inp ? inp.value : '').trim();
    if (!raw) {
      showSocialToast('⚠️ Escribe un ID Único (MENG-XXXX), nombre de usuario o correo.');
      return;
    }

    const discovered = state.cachedDiscoveredUsers.length > 0
      ? state.cachedDiscoveredUsers
      : await discoverRegisteredUsers();

    const match = discovered.find(u =>
      String(u.friendCode || '').toLowerCase() === raw.toLowerCase() ||
      String(u.username || '').toLowerCase() === raw.toLowerCase() ||
      String(u.email || '').toLowerCase() === raw.toLowerCase()
    );

    if (match) {
      addRealUserAndChat(match.username, match.email, match.friendCode, match.personalRank);
      return;
    }

    // Si el usuario ingresó un código MENG-XXXX o nombre de un amigo externo
    const isCode = /^MENG-[A-Z0-9]{4}$/i.test(raw);
    const displayName = isCode ? `Jugador ${raw.toUpperCase()}` : raw.split('@')[0];
    const code = isCode ? raw.toUpperCase() : deriveDeterministicCode(raw);
    const email = raw.includes('@') ? raw : `${displayName.toLowerCase().replace(/\s+/g, '')}@mastereng.com`;

    addRealUserAndChat(displayName, email, code, '🥇 Oro');
  }

  // ============================================================================
  // 13. ACCIONES DE MENSAJERÍA, VOZ, JEST 3D, CITAS 3D Y GRUPOS
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
      listEl.innerHTML = filtered.length === 0
        ? `<div class="p-6 text-center text-slate-400 text-xs">No se encontraron chats con "${escapeHtml(state.searchQuery)}".</div>`
        : filtered.map(c => renderSidebarContactItem(c)).join('');
    }
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
    showSocialToast(`🎨 Tema aplicado: ${CHAT_THEMES[newTheme].label}`);
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

    const targetId = contact.id;
    const bond = state.bonds[targetId] || {};
    const role = bond.role || 'friends';

    setTimeout(() => {
      state.typingByContact[targetId] = false;
      const reply = generateContextualSmartReply(text, role);
      if (!Array.isArray(state.messages[targetId])) state.messages[targetId] = [];
      state.messages[targetId].push({
        id: 'msg_reply_' + Date.now(),
        sender: 'them',
        senderName: contact.name,
        text: reply.en,
        translation: reply.es,
        timestamp: getCurrentTimeStr(),
        type: 'text'
      });
      saveSocialState();
      renderCommunityHub();
      scrollToBottomMessages();
    }, 900);
  }

  function translateCommonEnglishToSpanish(text) {
    const lower = text.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi')) return '¡Hola! Practiquemos nuestro inglés hoy.';
    if (lower.includes('love')) return '¡Me encanta practicar inglés contigo!';
    if (lower.includes('date')) return '¿Vamos a nuestra cita en el Bistro 3D?';
    if (lower.includes('game') || lower.includes('jest')) return '¡Juguemos una partida de Jest 3D 1vs1!';
    return `Traducción: "${text}"`;
  }

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
          renderCommunityHub();
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
    sendMessageFromInput("Hey! Let's practice our English pronunciation together! 🎤", true);
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
      text: `¡Te desafío a una partida 1vs1 de Jest / Jarz 3D en inglés, ${contact.name}! ¿Podrás adivinar la carta en tu frente?`,
      timestamp: getCurrentTimeStr(),
      type: 'jest_invite'
    });

    registerRelationshipGamePlayed(contact.id, 'jest');
    saveSocialState();
    renderCommunityHub();
    scrollToBottomMessages();

    if (autoLaunch) {
      acceptJestDuel(contact.id, contact.name);
    }
  }

  function registerRelationshipGamePlayed(friendId, gameType = 'jest') {
    if (!friendId || !state.bonds[friendId]) return;
    const bond = state.bonds[friendId];
    if (gameType === 'jest') {
      bond.weeklyGamesCount = (Number(bond.weeklyGamesCount) || 0) + 1;
      bond.coupleExp = (Number(bond.coupleExp) || 0) + 20;
      if (bond.weeklyGamesCount === 2) {
        bond.streakDays = (Number(bond.streakDays) || 0) + 1;
        showSocialToast('🃏 ¡Misión de 2 partidas de Jest 3D completada! +1 día de racha 🔥');
      }
    } else if (gameType === 'date3d') {
      bond.weeklyDatesCount = (Number(bond.weeklyDatesCount) || 0) + 1;
      bond.coupleExp = (Number(bond.coupleExp) || 0) + 25;
      if (bond.weeklyDatesCount === 3) {
        bond.streakDays = (Number(bond.streakDays) || 0) + 1;
      }
    }
    saveSocialState();
  }

  function acceptJestDuel(friendId, friendName, roomCode = null) {
    const contact = state.contacts.find(c => c.id === friendId);
    const code = roomCode || ((contact && contact.friendCode) ? `JEST-${contact.friendCode}` : 'JEST-101');

    if (typeof global.openJestGameView === 'function') {
      global.openJestGameView({
        friendId,
        friendName: friendName || (contact ? contact.name : 'Amigo'),
        roomCode: code,
        topic: ( state.bonds[friendId] && state.bonds[friendId].role === 'partner' )
          ? 'Romantic & Couple Items'
          : 'Animals & Creatures'
      });
      return;
    }

    showSocialToast(`🃏 Iniciando Duelo 1vs1 de Jest 3D con ${friendName}...`);
  }

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
      text: `🕯️ He reservado una mesa para los dos en el Bistro 3D de MasterENG, ${contact.name}. ¡Vamos a nuestra Cita 3D en inglés!`,
      timestamp: getCurrentTimeStr(),
      type: 'date3d_invite'
    });

    saveSocialState();
    renderCommunityHub();
    scrollToBottomMessages();
    goTo3DDateNow(contact.id);
  }

  function goTo3DDateNow(contactId, roomCode = null) {
    const contact = state.contacts.find(c => c.id === contactId) || getActiveContact();
    if (!contact) return;

    registerRelationshipGamePlayed(contact.id, 'date3d');
    const bond = state.bonds[contact.id] || {};

    const partnerPayload = {
      id: contact.id,
      name: contact.name,
      friendCode: contact.friendCode || contact.gameId,
      avatar: contact.avatar,
      personalRank: contact.personalRank,
      role: bond.role || 'partner',
      bondRank: calculateBondRank(bond),
      streakDays: bond.streakDays || 1,
      roomCode: roomCode || 'DATE-BISTRO-3D',
      startedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_DATE_PARTNER, contact.name);
      localStorage.setItem('mastereng_couple_partner_name', contact.name);
      localStorage.setItem('mastereng_active_date_partner_payload', JSON.stringify(partnerPayload));
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
    if (typeof global.setDatePartnerMode === 'function') {
      try { global.setDatePartnerMode('partner'); } catch (e) {}
    }
    if (typeof global.sitAvatarsAtDatingTable === 'function') {
      try { global.sitAvatarsAtDatingTable(partnerPayload); } catch (e) {}
    }
    if (typeof global.openDatingTableChat === 'function') {
      try { global.openDatingTableChat(partnerPayload); } catch (e) {}
    }
  }

  function openCreateGroupModal() {
    const modal = document.getElementById('waCreateGroupModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const indivContacts = state.contacts.filter(c => !c.isGroup && !isBannedFakeBot(c));

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

          <div class="text-[11px] font-bold text-slate-400">Selecciona amigos reales para el grupo:</div>
          <div class="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800">
            ${indivContacts.length === 0 ? `
              <div class="text-xs text-slate-400 p-2">Agrega amigos reales primero con su ID Único (MENG-XXXX) para incluirlos en grupos.</div>
            ` : indivContacts.map(c => `
              <label class="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                <input type="checkbox" class="wa-group-member-check" value="${escapeHtml(c.name)}" checked />
                <span>${c.avatar} ${escapeHtml(c.name)} (${escapeHtml(c.friendCode || '')})</span>
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
    const grpCode = 'MENG-' + Math.floor(1000 + Math.random() * 9000);
    const newGrp = {
      id: newId,
      name,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      email: '',
      friendCode: grpCode,
      gameId: grpCode,
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
      roleConfirmed: true,
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
        sender: 'me',
        senderName: 'Tú',
        text: `Welcome everyone to "${name}"! Let's practice English together! 🏆`,
        translation: `¡Bienvenidos todos a "${name}"! ¡Practiquemos inglés juntos! 🏆`,
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

  // ============================================================================
  // 13.5 SISTEMA DE INVITACIONES GLOBALES Y BANDEJA DE ENTRADA (INBOX)
  // ============================================================================
  function setupGlobalInvitesChannel() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        if (!state._invitesChannel) {
          state._invitesChannel = new BroadcastChannel('mastereng_global_invites');
          state._invitesChannel.onmessage = function () {
            updateInboxBadgeCount();
            const modal = document.getElementById('waInboxInvitesModal');
            if (modal && !modal.classList.contains('hidden') && modal.style.display !== 'none') {
              openInboxInvitesModal();
            }
          };
        }
      } catch (_) {}
    }
  }

  function updateInboxBadgeCount() {
    let count = 0;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INBOX_INVITES);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          count = list.filter(i => i && i.status === 'pending').length;
        }
      }
    } catch (_) { count = 0; }

    if (typeof document !== 'undefined') {
      const badges = document.querySelectorAll('#inboxBadgeCount, #waInboxBadge, .inbox-badge, .wa-inbox-badge');
      badges.forEach(b => {
        b.textContent = count;
        if (count > 0) {
          b.classList.remove('hidden');
          b.style.display = 'inline-flex';
        } else {
          b.classList.add('hidden');
          b.style.display = 'none';
        }
      });
    }
    return count;
  }

  function sendGlobalAppInvite(payload) {
    if (!payload || typeof payload !== 'object') return null;
    const toIdOrName = String(payload.toIdOrName || '').trim();
    if (!toIdOrName) return null;

    const inviteType = payload.type === 'dating_3d' ? 'dating_3d' : 'jest_duel';
    const partnerGender = payload.partnerGender || 'unspecified';
    const cleanTo = toIdOrName.toLowerCase();

    // 1. Verificar si existe la conversación en mastereng_social_contacts
    let contact = state.contacts.find(c => {
      if (isBannedFakeBot(c)) return false;
      const cId = String(c.id || '').toLowerCase();
      const cName = String(c.name || '').toLowerCase();
      const cUsername = String(c.username || '').toLowerCase();
      const cCode = String(c.friendCode || c.gameId || '').toLowerCase();
      return cId === cleanTo || cName === cleanTo || cUsername === cleanTo || cCode === cleanTo;
    });

    // 2. Si es la primera vez que se interactúa con ese amigo, crearlo automáticamente (sin bots falsos)
    if (!contact) {
      const isCode = toIdOrName.toUpperCase().startsWith('MENG-');
      const friendCode = isCode ? toIdOrName.toUpperCase() : ('MENG-' + Math.floor(1000 + Math.random() * 9000));
      const displayName = isCode ? `Compañero (${friendCode})` : toIdOrName;
      const contactId = 'friend_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

      let avatar = '🧑‍🎓';
      if (partnerGender === 'female') avatar = '👩';
      else if (partnerGender === 'male') avatar = '👨';

      contact = {
        id: contactId,
        name: displayName,
        username: displayName.toLowerCase().replace(/\s+/g, '_'),
        email: '',
        friendCode: friendCode,
        gameId: friendCode,
        avatar: avatar,
        gender: partnerGender,
        personalRank: '🥈 Plata',
        cefr: 'B1 Intermediate',
        statusText: inviteType === 'dating_3d' ? 'Listo para practicar en el Bistro 3D' : 'Listo para duelo 1vs1 de Jest 3D',
        isOnline: true,
        lastSeen: 'En línea'
      };

      state.contacts.unshift(contact);

      const initialRole = inviteType === 'dating_3d' ? 'partner' : 'friends';
      state.bonds[contact.id] = {
        role: initialRole,
        roleConfirmed: true,
        pendingRole: null,
        theme: RELATIONSHIP_ROLES[initialRole] ? RELATIONSHIP_ROLES[initialRole].defaultTheme : 'classic',
        streakDays: 1,
        lastInteractionDate: getTodayIso(),
        coupleExp: 20,
        weeklyDatesCount: 0,
        weeklyGamesCount: 0,
        messagesToday: 0
      };
    }

    // 3. Crear la sala y el mensaje estructurado con botón interactivo ("✅ Aceptar Invitación e Ir Ahora")
    if (!Array.isArray(state.messages[contact.id])) {
      state.messages[contact.id] = [];
    }

    const roomCode = payload.roomCode || (inviteType === 'dating_3d' ? 'DATE-BISTRO-3D' : `JEST-${contact.friendCode || '101'}`);
    const inviteId = 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

    let inviteTitle = '';
    let inviteText = '';

    if (inviteType === 'dating_3d') {
      inviteTitle = '🕯️ Cita Especial en el Bistro 3D';
      inviteText = `¡He reservado una mesa íntima para nosotros dos en el Bistro 3D de MasterENG! Practiquemos inglés juntos frente a frente. (Mesa: ${roomCode})`;
    } else {
      inviteTitle = '🃏 Duelo Oficial 1vs1 • Jest / Jarz 3D';
      inviteText = `¡Te desafío a una partida 1vs1 en la mesa 3D de Jest / Jarz! Adivina la palabra en tu frente haciendo preguntas en inglés. (Sala: ${roomCode})`;
    }

    const newMsg = {
      id: inviteId,
      sender: 'friend', // Como mensaje recibido para que el usuario pueda presionar el botón interactivo
      senderName: contact.name,
      text: inviteText,
      type: inviteType === 'dating_3d' ? 'date3d_invite' : 'jest_invite',
      roomCode: roomCode,
      inviteType: inviteType,
      contactId: contact.id,
      partnerGender: partnerGender,
      title: inviteTitle,
      timestamp: getCurrentTimeStr()
    };

    state.messages[contact.id].push(newMsg);
    saveSocialState(); // Guarda en STORAGE_KEYS.CONTACTS, STORAGE_KEYS.BONDS, STORAGE_KEYS.MESSAGES y mastereng_chat_messages

    // 4. Guardar la invitación en mastereng_inbox_invites
    const inboxItem = {
      id: inviteId,
      fromId: contact.id,
      fromName: contact.name,
      avatar: contact.avatar || '🧑‍🎓',
      friendCode: contact.friendCode || contact.gameId || '',
      type: inviteType,
      roomCode: roomCode,
      partnerGender: partnerGender,
      title: inviteTitle,
      description: inviteText,
      status: 'pending',
      createdAt: new Date().toISOString(),
      timeStr: getCurrentTimeStr()
    };

    let inboxList = [];
    try {
      const rawInbox = localStorage.getItem(STORAGE_KEYS.INBOX_INVITES);
      inboxList = rawInbox ? JSON.parse(rawInbox) : [];
      if (!Array.isArray(inboxList)) inboxList = [];
    } catch (_) { inboxList = []; }

    inboxList.unshift(inboxItem);
    try {
      localStorage.setItem(STORAGE_KEYS.INBOX_INVITES, JSON.stringify(inboxList));
    } catch (_) {}

    // 5. Emitir evento BroadcastChannel('mastereng_global_invites')
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('mastereng_global_invites');
        bc.postMessage({ type: 'NEW_INVITE', invite: inboxItem });
        bc.close();
      }
    } catch (_) {}

    // 6. Actualizar contador de badge de bandeja de entrada
    updateInboxBadgeCount();

    if (state.activeContactId === contact.id) {
      renderCommunityHub();
      scrollToBottomMessages();
    }

    return inboxItem;
  }

  function openInboxInvitesModal() {
    let modal = document.getElementById('waInboxInvitesModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'waInboxInvitesModal';
      modal.className = 'wa-modal-backdrop';
      document.body.appendChild(modal);
    }
    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    let invites = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INBOX_INVITES);
      invites = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(invites)) invites = [];
    } catch (_) { invites = []; }

    // Recopilar también propuestas de roles pendientes
    const pendingRoles = [];
    Object.keys(state.bonds).forEach(cId => {
      const b = state.bonds[cId];
      if (b && b.pendingRole) {
        const contact = state.contacts.find(c => c.id === cId);
        if (contact) {
          pendingRoles.push({
            id: 'role_' + cId,
            fromId: cId,
            fromName: contact.name,
            avatar: contact.avatar || '🧑‍🎓',
            friendCode: contact.friendCode || '',
            type: 'role_proposal',
            role: b.pendingRole,
            title: '🤝 Propuesta de Vínculo Conjunto',
            description: `Te ha propuesto elegir el rol: ${escapeHtml((RELATIONSHIP_ROLES[b.pendingRole] && RELATIONSHIP_ROLES[b.pendingRole].title) || b.pendingRole)}`,
            status: 'pending',
            timeStr: 'Pendiente'
          });
        }
      }
    });

    const allInvites = [...pendingRoles, ...invites];
    const pendingCount = allInvites.filter(i => i.status === 'pending').length;

    modal.innerHTML = `
      <div class="wa-modal-card" style="max-width: 600px; max-height: 85vh; overflow-y: auto;">
        <div class="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📥</span>
            <div>
              <h3 class="text-base font-black text-white leading-tight">Bandeja de Entrada e Invitaciones</h3>
              <p class="text-[11px] text-slate-400">Citas 3D, Duelos de Jest 1vs1 y Vínculos de Amigos</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] font-black">
              ${pendingCount} pendientes
            </span>
            <button type="button" onclick="window.SocialChat.closeModals()" class="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
          </div>
        </div>

        ${allInvites.length === 0 ? `
          <div class="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 my-2">
            <span class="text-4xl block mb-2">📭</span>
            <div class="text-sm font-black text-white mb-1">Tu bandeja está limpia</div>
            <p class="text-xs text-slate-400 max-w-sm mx-auto">
              Cuando tus amigos reales te inviten a una Cita 3D en el Bistro, a un Duelo de Jest 1vs1 o propongan un rol, aparecerán aquí.
            </p>
          </div>
        ` : `
          <div class="space-y-2.5 my-2">
            ${allInvites.map(inv => {
              const isPending = inv.status === 'pending';
              const isDate = inv.type === 'dating_3d';
              const isJest = inv.type === 'jest_duel';
              const isRole = inv.type === 'role_proposal';

              let badgeBg = 'bg-slate-800 text-slate-300 border-slate-700';
              let badgeLabel = 'Invitación';
              if (isDate) {
                badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                badgeLabel = '🕯️ Cita 3D Bistro';
              } else if (isJest) {
                badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                badgeLabel = '🃏 Duelo Jest 3D';
              } else if (isRole) {
                badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                badgeLabel = '🤝 Vínculo Conjunto';
              }

              return `
                <div class="p-3.5 rounded-2xl bg-slate-950/90 border ${isPending ? 'border-purple-500/40 shadow-lg shadow-purple-950/20' : 'border-slate-800 opacity-75'} transition">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <span class="text-2xl">${escapeHtml(inv.avatar || '🧑‍🎓')}</span>
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <span class="text-xs font-black text-white truncate">${escapeHtml(inv.fromName)}</span>
                          ${inv.friendCode ? `<span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">${escapeHtml(inv.friendCode)}</span>` : ''}
                        </div>
                        <span class="text-[10px] text-slate-400 block">${escapeHtml(inv.timeStr || '')}</span>
                      </div>
                    </div>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}">
                      ${badgeLabel}
                    </span>
                  </div>

                  <div class="text-xs text-slate-200 mb-3 px-1 leading-relaxed">
                    ${escapeHtml(inv.description || inv.title || '')}
                  </div>

                  <div class="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    ${isPending ? `
                      ${isDate ? `
                        <button type="button"
                          onclick="window.SocialChat.accept3DDateFromInbox('${escapeHtml(inv.id)}', '${escapeHtml(inv.fromId)}', '${escapeHtml(inv.roomCode || '')}')"
                          class="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black shadow-md cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-95">
                          <span>✅ Aceptar Cita 3D</span>
                        </button>
                      ` : ''}
                      ${isJest ? `
                        <button type="button"
                          onclick="window.SocialChat.acceptJestDuelFromInbox('${escapeHtml(inv.id)}', '${escapeHtml(inv.fromId)}', '${escapeHtml(inv.fromName)}', '${escapeHtml(inv.roomCode || '')}')"
                          class="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-black shadow-md cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-95">
                          <span>⚔️ Aceptar Duelo 1vs1</span>
                        </button>
                      ` : ''}
                      ${isRole ? `
                        <button type="button"
                          onclick="window.SocialChat.acceptJointRoleProposal('${escapeHtml(inv.fromId)}', '${escapeHtml(inv.id)}', '${escapeHtml(inv.role)}')"
                          class="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-95">
                          <span>🤝 Aceptar Rol en Conjunto</span>
                        </button>
                      ` : ''}
                    ` : `
                      <span class="text-xs text-emerald-400 font-extrabold flex items-center gap-1">
                        <span>✅ Invitación Aceptada</span>
                      </span>
                    `}

                    <button type="button"
                      onclick="window.SocialChat.dismissInboxInvite('${escapeHtml(inv.id)}')"
                      class="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold cursor-pointer transition"
                      title="Eliminar de la bandeja">
                      🗑️
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}

        <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          ${invites.length > 0 ? `
            <button type="button" onclick="window.SocialChat.clearAllInboxInvites()"
              class="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/30 text-rose-300 text-xs font-bold cursor-pointer transition">
              Vaciar Bandeja
            </button>
          ` : '<div></div>'}
          <button type="button" onclick="window.SocialChat.closeModals()"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold cursor-pointer transition">
            Cerrar
          </button>
        </div>
      </div>
    `;
  }

  function accept3DDateFromInbox(inviteId, contactId, roomCode = null) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INBOX_INVITES);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const inv = list.find(i => i.id === inviteId);
          if (inv) inv.status = 'accepted';
          localStorage.setItem(STORAGE_KEYS.INBOX_INVITES, JSON.stringify(list));
        }
      }
    } catch (_) {}

    updateInboxBadgeCount();
    closeModals();
    goTo3DDateNow(contactId, roomCode);
  }

  function acceptJestDuelFromInbox(inviteId, contactId, friendName, roomCode = null) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INBOX_INVITES);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const inv = list.find(i => i.id === inviteId);
          if (inv) inv.status = 'accepted';
          localStorage.setItem(STORAGE_KEYS.INBOX_INVITES, JSON.stringify(list));
        }
      }
    } catch (_) {}

    updateInboxBadgeCount();
    closeModals();
    acceptJestDuel(contactId, friendName, roomCode);
  }

  function dismissInboxInvite(inviteId) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INBOX_INVITES);
      if (raw) {
        let list = JSON.parse(raw);
        if (Array.isArray(list)) {
          list = list.filter(i => i.id !== inviteId);
          localStorage.setItem(STORAGE_KEYS.INBOX_INVITES, JSON.stringify(list));
        }
      }
    } catch (_) {}
    updateInboxBadgeCount();
    openInboxInvitesModal();
  }

  function clearAllInboxInvites() {
    try {
      localStorage.setItem(STORAGE_KEYS.INBOX_INVITES, JSON.stringify([]));
    } catch (_) {}
    updateInboxBadgeCount();
    openInboxInvitesModal();
  }

  function closeModals() {
    ['waAddFriendModal', 'waCreateGroupModal', 'waRoleProposalModal', 'waRanksGuideModal', 'waInboxInvitesModal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('hidden');
        el.style.display = 'none';
      }
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
    if (typeof document === 'undefined' || !document.body) return;
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
    if (typeof document === 'undefined' || !document.body) return;
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
  // 14. AUTO-INICIALIZACIÓN Y EXPORTACIÓN GLOBAL
  // ============================================================================
  function initSocialChat() {
    loadSocialState();
    updateInboxBadgeCount();
    setupGlobalInvitesChannel();
    if (typeof document !== 'undefined') {
      const existingView = document.getElementById('view-community');
      if (existingView && !existingView.classList.contains('hidden')) {
        renderCommunityHub();
      }
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
    ensureUserUniqueGameId,
    copyMyUniqueId,
    selectContact,
    backToSidebarMobile,
    selectTab,
    handleSearch,
    openRoleProposalModal,
    confirmSendRoleProposal,
    sendJointRoleProposal,
    acceptJointRoleProposal,
    changeRelationshipRole,
    changeChatTheme,
    openRanksGuideModal,
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
    filterFriendSearchResults,
    updateRolePreviewDesc,
    addRealUserAndChat,
    confirmAddFriend,
    openCreateGroupModal,
    confirmCreateGroup,
    closeModals,
    returnToHub,
    calculateBondRank,
    registerRelationshipGamePlayed,
    discoverRegisteredUsers,
    sendGlobalAppInvite,
    openInboxInvitesModal,
    updateInboxBadgeCount,
    accept3DDateFromInbox,
    acceptJestDuelFromInbox,
    dismissInboxInvite,
    clearAllInboxInvites,
    getSocialBonds: () => state.bonds,
    getSocialContacts: () => state.contacts,
    RELATIONSHIP_ROLES
  };

  global.SocialChat = SocialChatAPI;
  global.ensureUserUniqueGameId = ensureUserUniqueGameId;
  global.registerRelationshipGamePlayed = registerRelationshipGamePlayed;
  global.openCommunityHubView = openCommunityHubView;
  global.initSocialChat = initSocialChat;
  global.renderCommunityHub = renderCommunityHub;
  global.calculateBondRank = calculateBondRank;
  global.sendGlobalAppInvite = sendGlobalAppInvite;
  global.openInboxInvitesModal = openInboxInvitesModal;
  global.updateInboxBadgeCount = updateInboxBadgeCount;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialChatAPI;
  }
})(typeof window !== 'undefined' ? window : globalThis);

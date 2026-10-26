/**
 * MasterENG - Social Profile & Pet Sanctuary Engine
 * Estilo Facebook / Discord Educativo con Insignias de Rango e Interacción de Mascotas en Vivo
 * 
 * Exposes:
 *  - window.MasterENGSocialProfile
 *  - window.renderUserProfile (Hooks into core modal renderer)
 *  - window.openEditProfileModal
 *  - window.interactWithPet
 */
(function (global) {
  'use strict';

  // ============================================================================
  // 1. AUTO-INJECT CSS STYLESHEET IF MISSING
  // ============================================================================
  function ensurePetProfileStylesheet() {
    if (typeof document === 'undefined') return;
    if (!document.querySelector('link[href*="pet_profile.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'css/pet_profile.css';
      document.head.appendChild(link);
    }
  }
  ensurePetProfileStylesheet();

  // ============================================================================
  // 2. CONSTANTS & PRESETS (AVATARS, COVERS, HOBBIES)
  // ============================================================================
  const STORAGE_KEY_SOCIAL = 'mastereng_profile_social_data';

  const DEFAULT_AVATARS = [
    { id: 'fox', emoji: '🦊', label: 'Papercraft Fox' },
    { id: 'owl', emoji: '🦉', label: 'Craft Owl' },
    { id: 'shiba', emoji: '🐕', label: 'Cardboard Shiba' },
    { id: 'robot', emoji: '🤖', label: 'AI Tutor Bot' },
    { id: 'astronaut', emoji: '👨‍🚀', label: 'Space Voyager' },
    { id: 'cat', emoji: '🐱', label: 'Origami Cat' },
    { id: 'dragon', emoji: '🐲', label: 'Mythic Dragon' },
    { id: 'scholar', emoji: '🎓', label: 'Grammar Scholar' }
  ];

  const DEFAULT_COVERS = [
    { id: 'cosmic', name: 'Cosmic Nebula', bg: 'linear-gradient(135deg, #090d16 0%, #311042 50%, #0369a1 100%)' },
    { id: 'papercraft', name: 'Kraft Studio', bg: 'linear-gradient(135deg, #78350f 0%, #b45309 45%, #d97706 100%)' },
    { id: 'cyberpunk', name: 'Neon Cyber', bg: 'linear-gradient(135deg, #0f172a 0%, #701a75 50%, #0284c7 100%)' },
    { id: 'emerald', name: 'Runic Forest', bg: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #065f46 100%)' },
    { id: 'sunset', name: 'Golden Sunset', bg: 'linear-gradient(135deg, #831843 0%, #c2410c 50%, #f59e0b 100%)' },
    { id: 'royal', name: 'Royal Velvet', bg: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%)' }
  ];

  const COMMON_HOBBIES = [
    '🎮 Gaming', '🏋️ Gym & Fitness', '🎵 Music & Guitar', '💻 Coding',
    '📚 Reading', '✈️ Travel', '☕ Specialty Coffee', '🎬 Cinema',
    '🍕 Foodie', '🎨 Digital Art', '🗣️ Language Exchange', '🐾 Pet Lover'
  ];

  // ============================================================================
  // 3. DATA PERSISTENCE & MERGE
  // ============================================================================
  function getStoredUser() {
    try {
      const raw = localStorage.getItem('mastereng_user') || localStorage.getItem('english_app_user_session');
      return raw ? JSON.parse(raw) : { role: 'guest', username: 'Invitado' };
    } catch (_) {
      return { role: 'guest', username: 'Invitado' };
    }
  }

  function getSocialProfileData(user) {
    let data = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SOCIAL);
      if (raw) data = JSON.parse(raw);
    } catch (_) {}

    const isGuest = user.role === 'guest' || user.username === 'Invitado';
    const fallbackName = user.username || 'Master Learner';

    // Recuperar posible pareja/compañero de citas 3D de world3d.js / social_chat.js
    const couplePartner = localStorage.getItem('mastereng_active_date_partner') ||
                          localStorage.getItem('mastereng_couple_partner_name') ||
                          null;

    const defaultState = {
      coverPhoto: DEFAULT_COVERS[0].bg,
      coverId: 'cosmic',
      avatarType: 'emoji',
      avatarEmoji: isGuest ? '👤' : '🦊',
      avatarCustomUrl: '',
      bio: isGuest
        ? 'Explorando MasterENG en modo invitado.'
        : 'Dominando el inglés con IA y cuidando de mis mascotas 🚀 ¡Practiquemos juntos!',
      location: 'Ciudad de México, México',
      relationship: couplePartner ? `Compañero de Crianza con @${couplePartner}` : 'Enfoque Total / Criador Solitario',
      hobbies: ['🎮 Gaming', '🎵 Music & Guitar', '💻 Coding', '☕ Specialty Coffee'],
      socialLinks: {
        instagram: 'mastereng_learner',
        tiktok: 'english.fluent',
        facebook: 'mastereng.club',
        twitter: 'mastereng_ai',
        github: 'english-developer',
        linkedin: 'mastereng-pro'
      },
      pet: {
        name: 'Sparky',
        species: 'Papercraft Cyber-Fox',
        level: 8,
        exp: 720,
        stage: 'Teen (Joven Ágil)',
        streakDays: 14,
        hunger: 85,
        happiness: 92,
        energy: 78,
        englishIQ: 145,
        favoriteWord: 'Resilience'
      },
      sharedPets: [
        {
          name: 'Luna',
          species: 'Origami Owl',
          coParent: couplePartner || '@StarlightPartner',
          level: 6,
          stage: 'Baby (Cachorro)',
          streak: 11
        }
      ]
    };

    if (!data) {
      data = defaultState;
      saveSocialProfileData(data);
    } else {
      // Garantizar campos completos
      data = Object.assign({}, defaultState, data);
      data.socialLinks = Object.assign({}, defaultState.socialLinks, data.socialLinks);
      data.pet = Object.assign({}, defaultState.pet, data.pet);
    }

    return data;
  }

  function saveSocialProfileData(data) {
    try {
      localStorage.setItem(STORAGE_KEY_SOCIAL, JSON.stringify(data));
    } catch (err) {
      console.warn('[ProfileSocial] Error saving social profile:', err);
    }
  }

  // ============================================================================
  // 4. RANK ALGORITHMS (ENGLISH CEFR + PET PARENT RANK)
  // ============================================================================
  function calculateEnglishRank(user) {
    const exp = parseInt(user.exp, 10) || 0;
    
    // Contar palabras dominadas de localStorage si existen
    let learnedCount = 0;
    try {
      const rawWords = localStorage.getItem('mastereng_world3d_learned_v2') || localStorage.getItem('mastereng_learned_words');
      if (rawWords) {
        const parsed = JSON.parse(rawWords);
        learnedCount = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
      }
    } catch (_) {}

    let tierCode = 'A1';
    let title = 'A1 Rookie';
    let medal = '🥉';
    let tierClass = 'tier-a1';
    let minExp = 0;
    let maxExp = 300;
    let nextTitle = 'A2 Explorer';

    if (exp >= 5000) {
      tierCode = 'C2';
      title = 'C2 Native Master';
      medal = '👑';
      tierClass = 'tier-c2';
      minExp = 5000;
      maxExp = 10000;
      nextTitle = 'Cosmic Apex';
    } else if (exp >= 2500) {
      tierCode = 'C1';
      title = 'C1 Advanced Master';
      medal = '💎';
      tierClass = 'tier-c1';
      minExp = 2500;
      maxExp = 5000;
      nextTitle = 'C2 Native Master';
    } else if (exp >= 1300) {
      tierCode = 'B2';
      title = 'B2 Fluent Scholar';
      medal = '💠';
      tierClass = 'tier-b2';
      minExp = 1300;
      maxExp = 2500;
      nextTitle = 'C1 Advanced Master';
    } else if (exp >= 700) {
      tierCode = 'B1';
      title = 'B1 Challenger';
      medal = '🥇';
      tierClass = 'tier-b1';
      minExp = 700;
      maxExp = 1300;
      nextTitle = 'B2 Fluent Scholar';
    } else if (exp >= 300) {
      tierCode = 'A2';
      title = 'A2 Explorer';
      medal = '🥈';
      tierClass = 'tier-a2';
      minExp = 300;
      maxExp = 700;
      nextTitle = 'B1 Challenger';
    }

    const progressInRange = Math.max(0, exp - minExp);
    const rangeSpan = Math.max(1, maxExp - minExp);
    const percent = Math.min(100, Math.round((progressInRange / rangeSpan) * 100));

    return {
      tierCode,
      title,
      medal,
      tierClass,
      currentExp: exp,
      minExp,
      maxExp,
      neededForNext: Math.max(0, maxExp - exp),
      percent,
      nextTitle,
      wordsMastered: Math.max(learnedCount, Math.floor(exp / 15))
    };
  }

  function calculatePetParentRank(pet) {
    const lvl = pet.level || 1;
    let title = 'Cuidador Novato (Egg Watcher)';
    let badgeEmoji = '🥚';
    let rankTier = 'Novice';

    if (lvl >= 20) {
      title = 'Criador Legendario (Mythic Pet Master)';
      badgeEmoji = '👑';
      rankTier = 'Mythic';
    } else if (lvl >= 10) {
      title = 'Guardián del Santuario (Sanctuary Guardian)';
      badgeEmoji = '🌿';
      rankTier = 'Guardian';
    } else if (lvl >= 4) {
      title = 'Cuidador Dedicado (Dedicated Pet Parent)';
      badgeEmoji = '🐾';
      rankTier = 'Dedicated';
    }

    return {
      title,
      badgeEmoji,
      rankTier,
      streak: pet.streakDays || 1
    };
  }

  // ============================================================================
  // 5. RENDERER PRINCIPAL: PERFIL SOCIAL ESTILO FACEBOOK / DISCORD
  // ============================================================================
  function renderSocialProfileView() {
    ensurePetProfileStylesheet();

    const container = document.getElementById('profile-content') || document.getElementById('profileModalBody');
    if (!container) return;

    const user = getStoredUser();
    const social = getSocialProfileData(user);
    const coopGroup = getCoopGroupData(user);
    const engRank = calculateEnglishRank(user);
    const petRank = calculatePetParentRank(social.pet);
    const isGuest = user.role === 'guest' || user.username === 'Invitado';
    const isAdmin = Boolean(
      user && (
        user.role === 'admin' ||
        ['admin'].includes(String(user.username || '').toLowerCase()) ||
        String(user.email || '').toLowerCase().includes('admin')
      )
    );

    // Identificador de jugador
    const gameId = user.gameId || (window.generateOrGetGameId ? window.generateOrGetGameId(user) : 'MENG-8842');

    // Avatar visual
    let avatarHtml = `<span class="select-none">${social.avatarEmoji || '🦊'}</span>`;
    if (social.avatarType === 'custom' && social.avatarCustomUrl) {
      avatarHtml = `<img src="${social.avatarCustomUrl}" alt="Avatar" class="w-full h-full object-cover rounded-[20px]" />`;
    }

    // Cover visual
    const coverStyle = social.coverPhoto.startsWith('data:') || social.coverPhoto.startsWith('http')
      ? `background-image: url('${social.coverPhoto}');`
      : `background: ${social.coverPhoto};`;

    // Renderizado HTML
    container.innerHTML = `
      <div class="profile-social-container">
        
        <!-- 1. FOTO DE PORTADA PERSONALIZABLE -->
        <div class="profile-cover-wrapper" style="${coverStyle}">
          <div class="profile-cover-overlay"></div>
          <button type="button" onclick="window.openEditProfileModal('cover')" class="cover-edit-btn" title="Personalizar portada">
            <span>📷</span>
            <span>Editar Portada</span>
          </button>
        </div>

        <!-- 2. CABECERA DE PERFIL: AVATAR, IDENTIDAD Y ACCIONES -->
        <div class="profile-header-main">
          <div class="profile-avatar-row">
            <div class="profile-avatar-wrapper ${engRank.tierClass}">
              <div class="profile-avatar-img">
                ${avatarHtml}
              </div>
              <div class="profile-avatar-badge" onclick="window.openEditProfileModal('avatar')" title="Cambiar foto de perfil">
                <span>📸</span>
              </div>
            </div>

            <div class="profile-action-buttons">
              <button type="button" onclick="window.openEditProfileModal('general')" class="btn-profile-primary">
                <span>✏️</span>
                <span>Editar Perfil</span>
              </button>

              ${isAdmin ? `
                <button type="button" onclick="event.stopPropagation(); window.closeAllModals(); if(typeof window.openAdminDashboardModal==='function') window.openAdminDashboardModal(event);" class="btn-profile-secondary border-amber-500/40 text-amber-300">
                  <span>🛠️</span>
                  <span>Panel Admin</span>
                </button>
              ` : ''}

              <button type="button" onclick="window.handleProfileLogout()" class="btn-profile-secondary border-rose-500/40 text-rose-300">
                <span>🚪</span>
                <span>Salir</span>
              </button>
            </div>
          </div>

          <!-- Nombres, Handle y Estado -->
          <div class="profile-names-group">
            <h3>
              <span>${user.username || 'Master Learner'}</span>
              <span class="profile-tag-badge">${gameId}</span>
              ${isGuest ? '<span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">Modo Invitado</span>' : ''}
            </h3>
            <p class="profile-bio-text">"${social.bio}"</p>
          </div>

          <!-- Detalles de Origen, Relación / Compañero y Fecha -->
          <div class="profile-details-grid">
            <div class="profile-detail-item">
              <span class="profile-detail-icon">📍</span>
              <span>De: <strong>${social.location}</strong></span>
            </div>
            <div class="profile-detail-item">
              <span class="profile-detail-icon">💖</span>
              <span><strong>${social.relationship}</strong></span>
            </div>
            <div class="profile-detail-item">
              <span class="profile-detail-icon">📅</span>
              <span>Miembro desde: <strong>Octubre 2026</strong></span>
            </div>
          </div>

          <!-- Hobbies e Intereses -->
          <div class="profile-hobbies-section">
            <span class="text-[11px] font-bold text-slate-400 mr-1">Intereses:</span>
            ${(social.hobbies || []).map(h => `<span class="hobby-pill">${h}</span>`).join('')}
            <button type="button" onclick="window.openEditProfileModal('hobbies')" class="hobby-pill border-dashed border-sky-400/40 text-sky-300 hover:border-sky-400 cursor-pointer">
              <span>➕ Agregar</span>
            </button>
          </div>
        </div>

        <!-- 3. ENLACES A REDES SOCIALES -->
        <div class="profile-social-links-bar">
          <span class="text-[11px] font-bold text-slate-400 mr-2 flex items-center gap-1.5">
            <span>🌐</span>
            <span>Social:</span>
          </span>

          ${social.socialLinks.instagram ? `
            <a href="https://instagram.com/${social.socialLinks.instagram}" target="_blank" rel="noopener noreferrer" class="social-pill-link social-instagram">
              <span>📸</span>
              <span>@${social.socialLinks.instagram}</span>
            </a>
          ` : ''}

          ${social.socialLinks.tiktok ? `
            <a href="https://tiktok.com/@${social.socialLinks.tiktok}" target="_blank" rel="noopener noreferrer" class="social-pill-link social-tiktok">
              <span>🎵</span>
              <span>TikTok</span>
            </a>
          ` : ''}

          ${social.socialLinks.facebook ? `
            <a href="https://facebook.com/${social.socialLinks.facebook}" target="_blank" rel="noopener noreferrer" class="social-pill-link social-facebook">
              <span>📘</span>
              <span>Facebook</span>
            </a>
          ` : ''}

          ${social.socialLinks.twitter ? `
            <a href="https://x.com/${social.socialLinks.twitter}" target="_blank" rel="noopener noreferrer" class="social-pill-link social-twitter">
              <span>🐦</span>
              <span>@${social.socialLinks.twitter}</span>
            </a>
          ` : ''}

          ${social.socialLinks.github ? `
            <a href="https://github.com/${social.socialLinks.github}" target="_blank" rel="noopener noreferrer" class="social-pill-link social-github">
              <span>💻</span>
              <span>GitHub</span>
            </a>
          ` : ''}

          ${social.socialLinks.linkedin ? `
            <a href="https://linkedin.com/in/${social.socialLinks.linkedin}" target="_blank" rel="noopener noreferrer" class="social-pill-link social-linkedin">
              <span>💼</span>
              <span>LinkedIn</span>
            </a>
          ` : ''}

          <button type="button" onclick="window.openEditProfileModal('social')" class="ml-auto text-[11px] font-bold text-sky-400 hover:text-sky-300 transition cursor-pointer">
            ⚙️ Editar Redes
          </button>
        </div>

        <!-- 4. INSIGNIAS OFICIALES: RANGO DE INGLÉS CEFR + SANTUARIO DE MASCOTAS -->
        <div class="profile-badges-container">
          
          <!-- TARJETA 1: INSIGNIA METÁLICA DE RANGO DE INGLÉS (CEFR) -->
          <div class="rank-card-metallic ${engRank.tierClass}">
            <div class="rank-card-header">
              <span class="rank-card-title">
                <span>🏅</span>
                <span>Rango Oficial de Inglés</span>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-slate-900/80 border border-sky-400/30 text-sky-300 font-mono text-[11px] font-extrabold">
                ${engRank.currentExp} EXP
              </span>
            </div>

            <div class="rank-shield-display">
              <div class="rank-shield-icon">
                ${engRank.tierCode}
              </div>
              <div class="rank-info-text">
                <h4>${engRank.medal} ${engRank.title}</h4>
                <p>Nivel de fluidez auditiva, gramática y vocabulario</p>
              </div>
            </div>

            <!-- Barra de Progreso a siguiente nivel CEFR -->
            <div class="rank-progress-wrapper">
              <div class="rank-progress-labels">
                <span>Progreso hacia ${engRank.nextTitle}</span>
                <span class="text-sky-300 font-bold">${engRank.percent}%</span>
              </div>
              <div class="rank-progress-bar-bg">
                <div class="rank-progress-bar-fill" style="width: ${engRank.percent}%;"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>${engRank.currentExp} EXP</span>
                <span>Faltan ${engRank.neededForNext} EXP</span>
              </div>
            </div>

            <!-- Métricas de estudio -->
            <div class="rank-stats-pills">
              <div class="stat-metric-pill">
                <span class="num">${engRank.wordsMastered}</span>
                <span class="lbl">Palabras</span>
              </div>
              <div class="stat-metric-pill">
                <span class="num">🔥 ${user.streak_days || 1}</span>
                <span class="lbl">Días Racha</span>
              </div>
              <div class="stat-metric-pill">
                <span class="num">96%</span>
                <span class="lbl">Precisión</span>
              </div>
            </div>
          </div>

          <!-- TARJETA 2: SANTUARIO DE MASCOTAS (ESTÉTICA CARTÓN / PAPERCRAFT) -->
          <div class="craft-sanctuary-card">
            <div class="craft-stitch-border"></div>
            <div class="craft-washi-tape"></div>

            <div class="craft-card-header">
              <span class="craft-tag-label">
                <span>📦</span>
                <span>Santuario de Mascotas</span>
              </span>
              <span class="text-[10px] font-bold text-[#5c2e14]">
                ${petRank.badgeEmoji} ${petRank.rankTier}
              </span>
            </div>

            <!-- Mascota Principal en Vivo -->
            <div class="craft-pet-main-row">
              <div class="craft-pet-avatar-cutout">
                <span>🦊</span>
                <div class="craft-pet-level-badge">Lv.${social.pet.level}</div>
              </div>
              <div class="craft-pet-details">
                <h4>
                  <span>${social.pet.name}</span>
                  <span class="text-xs">✨</span>
                </h4>
                <p>${social.pet.species} • ${social.pet.stage}</p>
                <div class="craft-streak-indicator">
                  <span>❤️ Racha de Cuidado:</span>
                  <span>${social.pet.streakDays} días</span>
                </div>
              </div>
            </div>

            <!-- Barras de Estado en Vivo (Hambre, Felicidad, Energía) -->
            <div class="craft-pet-meters-grid">
              <div class="craft-meter-box">
                <span class="title">🍖 Hambre: ${social.pet.hunger}%</span>
                <div class="craft-meter-bar-track">
                  <div class="craft-meter-bar-fill fill-hunger" style="width: ${social.pet.hunger}%;"></div>
                </div>
              </div>
              <div class="craft-meter-box">
                <span class="title">💖 Ánimo: ${social.pet.happiness}%</span>
                <div class="craft-meter-bar-track">
                  <div class="craft-meter-bar-fill fill-happy" style="width: ${social.pet.happiness}%;"></div>
                </div>
              </div>
              <div class="craft-meter-box">
                <span class="title">⚡ Energía: ${social.pet.energy}%</span>
                <div class="craft-meter-bar-track">
                  <div class="craft-meter-bar-fill fill-energy" style="width: ${social.pet.energy}%;"></div>
                </div>
              </div>
            </div>

            <!-- Botones Interactivos de Cuidado -->
            <div class="craft-pet-actions-row">
              <button type="button" onclick="window.interactWithPet('feed')" class="btn-craft-action" title="Alimentar con Vocabulario">
                <span>🍎</span>
                <span>Alimentar</span>
              </button>
              <button type="button" onclick="window.interactWithPet('pet')" class="btn-craft-action" title="Acariciar">
                <span>✋</span>
                <span>Acariciar</span>
              </button>
              <button type="button" onclick="window.interactWithPet('learn')" class="btn-craft-action" title="Enseñar Palabra en Inglés">
                <span>💡</span>
                <span>Enseñar (+IQ)</span>
              </button>
            </div>

            <!-- Vitrina de Mascotas Compartidas con Pareja o Amigos & Grupo Co-Op -->
            <div class="craft-shared-showcase">
              <div class="craft-shared-title flex items-center justify-between">
                <span>🤝 Mascotas Co-Criadas con Amigos / Pareja:</span>
                <span class="text-[10px] bg-amber-100 text-[#78350f] font-mono font-black px-1.5 py-0.5 rounded border border-amber-300">
                  Código: ${coopGroup.code}
                </span>
              </div>
              <div class="craft-shared-grid">
                ${(social.sharedPets || []).map(p => `
                  <div class="craft-mini-pet-pill">
                    <span>🦉</span>
                    <span><strong>${p.name}</strong> (Lv.${p.level}) con ${p.coParent}</span>
                  </div>
                `).join('')}
              </div>

              <!-- Botón Crear Grupo / Invitar Amigos a Crianza -->
              <button type="button" onclick="window.openCoopGroupModal('manage')" class="w-full mt-2.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs shadow-md border-2 border-amber-800 border-b-4 flex items-center justify-center gap-2 cursor-pointer transition active:translate-y-0.5">
                <span>🤝</span>
                <span>Crear Grupo / Invitar Amigos a Crianza</span>
                <span class="text-[10px] bg-amber-900/40 px-1.5 py-0.5 rounded font-mono">${coopGroup.code}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    `;
  }

  // ============================================================================
  // 6. INTERACCIÓN CON MASCOTAS EN VIVO (ALIMENTAR, ACARICIAR, ENSEÑAR)
  // ============================================================================
  function interactWithPet(action) {
    const user = getStoredUser();
    const social = getSocialProfileData(user);
    const pet = social.pet;

    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : (typeof alert === 'function' ? alert : console.log));

    if (action === 'feed') {
      pet.hunger = Math.min(100, pet.hunger + 15);
      pet.exp += 15;
      if (pet.exp >= pet.level * 100) {
        pet.level += 1;
        pet.exp = 0;
        toast(`🎉 ¡${pet.name} subió al Nivel ${pet.level}!`);
      } else {
        toast(`🍎 Has alimentado a ${pet.name}. +15 Hambre, +15 EXP de Crianza`);
      }
    } else if (action === 'pet') {
      pet.happiness = Math.min(100, pet.happiness + 12);
      pet.streakDays = (pet.streakDays || 1) + 1;
      toast(`💖 ¡${pet.name} ronronea feliz! Racha de cuidado: ${pet.streakDays} días`);
    } else if (action === 'learn') {
      pet.englishIQ = (pet.englishIQ || 100) + 5;
      pet.energy = Math.max(10, pet.energy - 8);
      user.exp = (parseInt(user.exp, 10) || 0) + 10;
      localStorage.setItem('mastereng_user', JSON.stringify(user));
      toast(`💡 ¡${pet.name} aprendió una palabra nueva! +5 IQ, +10 EXP para ti`);
    }

    saveSocialProfileData(social);
    renderSocialProfileView();
  }
  global.interactWithPet = interactWithPet;

  // ============================================================================
  // 7. MODAL DE EDICIÓN COMPLETA DEL PERFIL SOCIAL
  // ============================================================================
  function openEditProfileModal(initialTab) {
    const user = getStoredUser();
    const social = getSocialProfileData(user);

    // Eliminar modal anterior si existía
    const oldModal = document.getElementById('editSocialProfileModalOverlay');
    if (oldModal) oldModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'editSocialProfileModalOverlay';
    overlay.className = 'profile-edit-modal-overlay';

    overlay.innerHTML = `
      <div class="profile-edit-card" onclick="event.stopPropagation();">
        <div class="flex items-center justify-between pb-3 border-b border-slate-700">
          <h3>
            <span>✏️ Editar Perfil Social & Mascotas</span>
          </h3>
          <button type="button" onclick="document.getElementById('editSocialProfileModalOverlay').remove()" class="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer">&times;</button>
        </div>

        <div class="space-y-4 py-2">
          <!-- 1. Bio y Estado -->
          <div class="edit-input-group">
            <label>Bio / Frase de Estado:</label>
            <input type="text" id="editSocialBio" class="edit-input-field" value="${escapeHtml(social.bio)}" placeholder="Ej: Dominando el inglés para conquistar Silicon Valley 🚀" />
          </div>

          <!-- 2. Ubicación y Situación -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="edit-input-group">
              <label>Ciudad / País de Origen:</label>
              <input type="text" id="editSocialLocation" class="edit-input-field" value="${escapeHtml(social.location)}" placeholder="Ej: Bogotá, Colombia" />
            </div>
            <div class="edit-input-group">
              <label>Situación / Compañero:</label>
              <input type="text" id="editSocialRelationship" class="edit-input-field" value="${escapeHtml(social.relationship)}" placeholder="Ej: Criando con @Starlight" />
            </div>
          </div>

          <!-- 3. Selector de Avatar -->
          <div class="edit-input-group">
            <label>Elige tu Avatar o Icono 3D/Cartón:</label>
            <div class="avatar-presets-grid">
              ${DEFAULT_AVATARS.map(a => `
                <button type="button" onclick="window.selectSocialAvatarPreset('${a.emoji}')" class="avatar-preset-btn ${social.avatarEmoji === a.emoji ? 'active' : ''}">
                  <span>${a.emoji}</span>
                </button>
              `).join('')}
            </div>
            <div class="mt-2 flex items-center gap-2">
              <input type="text" id="editSocialCustomAvatarUrl" class="edit-input-field text-xs" value="${social.avatarCustomUrl || ''}" placeholder="O pega la URL de una foto personalizada..." />
            </div>
          </div>

          <!-- 4. Selector de Portada (Cover) -->
          <div class="edit-input-group">
            <label>Fondo de Portada (Cover Banner):</label>
            <div class="cover-presets-grid">
              ${DEFAULT_COVERS.map(c => `
                <div onclick="window.selectSocialCoverPreset('${c.bg}', '${c.id}')" class="cover-preset-thumb ${social.coverId === c.id ? 'active' : ''}" style="background: ${c.bg};" title="${c.name}"></div>
              `).join('')}
            </div>
          </div>

          <!-- 5. Enlaces a Redes Sociales -->
          <div class="edit-input-group">
            <label>Redes Sociales Oficiales:</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-slate-400 block mb-1">📸 Instagram:</span>
                <input type="text" id="editSocialInsta" class="edit-input-field py-1.5" value="${escapeHtml(social.socialLinks.instagram || '')}" placeholder="usuario" />
              </div>
              <div>
                <span class="text-slate-400 block mb-1">🎵 TikTok:</span>
                <input type="text" id="editSocialTikTok" class="edit-input-field py-1.5" value="${escapeHtml(social.socialLinks.tiktok || '')}" placeholder="usuario" />
              </div>
              <div>
                <span class="text-slate-400 block mb-1">🐦 X / Twitter:</span>
                <input type="text" id="editSocialTwitter" class="edit-input-field py-1.5" value="${escapeHtml(social.socialLinks.twitter || '')}" placeholder="usuario" />
              </div>
              <div>
                <span class="text-slate-400 block mb-1">💻 GitHub:</span>
                <input type="text" id="editSocialGithub" class="edit-input-field py-1.5" value="${escapeHtml(social.socialLinks.github || '')}" placeholder="usuario" />
              </div>
            </div>
          </div>

          <!-- 6. Nombre de tu Mascota -->
          <div class="edit-input-group">
            <label>Nombre de tu Mascota Principal:</label>
            <input type="text" id="editSocialPetName" class="edit-input-field" value="${escapeHtml(social.pet.name)}" placeholder="Nombre de tu compañero..." />
          </div>
        </div>

        <div class="pt-3 border-t border-slate-700 flex justify-end gap-3">
          <button type="button" onclick="document.getElementById('editSocialProfileModalOverlay').remove()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer">
            Cancelar
          </button>
          <button type="button" onclick="window.saveSocialProfileEdits()" class="btn-profile-primary px-5 py-2">
            <span>💾 Guardar Cambios</span>
          </button>
        </div>
      </div>
    `;

    overlay.onclick = function (e) {
      if (e.target === overlay) overlay.remove();
    };

    document.body.appendChild(overlay);
  }
  global.openEditProfileModal = openEditProfileModal;

  function selectSocialAvatarPreset(emoji) {
    const user = getStoredUser();
    const social = getSocialProfileData(user);
    social.avatarType = 'emoji';
    social.avatarEmoji = emoji;
    social.avatarCustomUrl = '';
    saveSocialProfileData(social);

    document.querySelectorAll('.avatar-preset-btn').forEach(b => {
      b.classList.toggle('active', b.innerText.includes(emoji));
    });
  }
  global.selectSocialAvatarPreset = selectSocialAvatarPreset;

  function selectSocialCoverPreset(bg, id) {
    const user = getStoredUser();
    const social = getSocialProfileData(user);
    social.coverPhoto = bg;
    social.coverId = id;
    saveSocialProfileData(social);

    document.querySelectorAll('.cover-preset-thumb').forEach(t => {
      t.classList.toggle('active', t.getAttribute('title') === id);
    });
  }
  global.selectSocialCoverPreset = selectSocialCoverPreset;

  function saveSocialProfileEdits() {
    const user = getStoredUser();
    const social = getSocialProfileData(user);

    const bioInput = document.getElementById('editSocialBio');
    if (bioInput) social.bio = bioInput.value.trim() || social.bio;

    const locInput = document.getElementById('editSocialLocation');
    if (locInput) social.location = locInput.value.trim() || social.location;

    const relInput = document.getElementById('editSocialRelationship');
    if (relInput) social.relationship = relInput.value.trim() || social.relationship;

    const avatarUrlInput = document.getElementById('editSocialCustomAvatarUrl');
    if (avatarUrlInput && avatarUrlInput.value.trim()) {
      social.avatarType = 'custom';
      social.avatarCustomUrl = avatarUrlInput.value.trim();
    }

    const instaInput = document.getElementById('editSocialInsta');
    if (instaInput) social.socialLinks.instagram = instaInput.value.trim();

    const tiktokInput = document.getElementById('editSocialTikTok');
    if (tiktokInput) social.socialLinks.tiktok = tiktokInput.value.trim();

    const twitterInput = document.getElementById('editSocialTwitter');
    if (twitterInput) social.socialLinks.twitter = twitterInput.value.trim();

    const githubInput = document.getElementById('editSocialGithub');
    if (githubInput) social.socialLinks.github = githubInput.value.trim();

    const petNameInput = document.getElementById('editSocialPetName');
    if (petNameInput && petNameInput.value.trim()) {
      social.pet.name = petNameInput.value.trim();
    }

    saveSocialProfileData(social);

    const modal = document.getElementById('editSocialProfileModalOverlay');
    if (modal) modal.remove();

    renderSocialProfileView();

    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : (typeof alert === 'function' ? alert : console.log));
    toast('✅ Perfil Social y Mascota actualizados con éxito.');
  }
  global.saveSocialProfileEdits = saveSocialProfileEdits;

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ============================================================================
  // 8. SISTEMA DE INVITAR AMIGOS, SALAS Y GRUPOS DE CRIANZA COMPARTIDA (CO-OP)
  // ============================================================================
  const STORAGE_KEY_COOP = 'mastereng_coop_groups';
  let currentCoopTab = 'manage';
  let selectedNewCoopType = 'squad';

  function generateCoopInviteCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function getCoopGroupData(user) {
    let group = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_COOP);
      if (raw) group = JSON.parse(raw);
    } catch (_) {}

    const couplePartner = localStorage.getItem('mastereng_active_date_partner') ||
                          localStorage.getItem('mastereng_couple_partner_name') ||
                          'StarlightPartner';

    const defaultGroup = {
      id: 'coop_master_group_1',
      code: 'ENG772',
      name: 'Team English Pros',
      type: 'squad', // 'duo' (2 miembros) o 'squad' (hasta 4 miembros)
      maxMembers: 4,
      petName: 'Sparky & Friends',
      petSpecies: 'Papercraft Cyber-Fox',
      petLevel: 8,
      totalExpPool: 990,
      createdAt: '2026-10-20',
      members: [
        {
          id: 'mem_self',
          username: (user && user.username) || 'Master Learner',
          avatar: '🦊',
          role: 'Líder de Crianza',
          isOwner: true,
          expContributed: 420,
          streakDays: 14,
          joinedAt: 'Hoy'
        },
        {
          id: 'mem_coparent',
          username: couplePartner,
          avatar: '🦉',
          role: 'Co-Parent',
          isOwner: false,
          expContributed: 360,
          streakDays: 12,
          joinedAt: 'Ayer'
        },
        {
          id: 'mem_friend1',
          username: 'CyberPup99',
          avatar: '🐕',
          role: 'Guardián',
          isOwner: false,
          expContributed: 210,
          streakDays: 8,
          joinedAt: 'Hace 3 días'
        }
      ]
    };

    if (!group) {
      group = defaultGroup;
      saveCoopGroupData(group);
    } else {
      if (!group.code) group.code = generateCoopInviteCode();
      if (!Array.isArray(group.members) || group.members.length === 0) {
        group.members = defaultGroup.members;
      }
      if (!group.maxMembers) {
        group.maxMembers = group.type === 'duo' ? 2 : 4;
      }
      if (typeof group.totalExpPool !== 'number') {
        group.totalExpPool = group.members.reduce((acc, m) => acc + (m.expContributed || 0), 0);
      }
    }

    return group;
  }

  function saveCoopGroupData(group) {
    try {
      localStorage.setItem(STORAGE_KEY_COOP, JSON.stringify(group));
    } catch (err) {
      console.warn('[ProfileSocial] Error saving coop group:', err);
    }
  }

  function copyToClipboard(text, successMessage) {
    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : (typeof alert === 'function' ? alert : console.log));

    if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(() => {
        toast(successMessage || '📋 ¡Copiado al portapapeles!');
      }).catch(() => {
        fallbackCopy(text, successMessage, toast);
      });
    } else {
      fallbackCopy(text, successMessage, toast);
    }
  }

  function fallbackCopy(val, msg, toast) {
    try {
      const ta = document.createElement('textarea');
      ta.value = val;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      toast(msg || '📋 ¡Copiado al portapapeles!');
    } catch (_) {
      toast('Código: ' + val);
    }
  }

  function openCoopGroupModal(initialTab) {
    ensurePetProfileStylesheet();
    const user = getStoredUser();
    const group = getCoopGroupData(user);
    currentCoopTab = initialTab || 'manage';

    const oldModal = document.getElementById('coopGroupModalOverlay');
    if (oldModal) oldModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'coopGroupModalOverlay';
    overlay.className = 'coop-modal-overlay';

    overlay.innerHTML = `
      <div class="coop-modal-card" onclick="event.stopPropagation();">
        <!-- Encabezado Cartón con Bordes Cosidos -->
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
          <button type="button" onclick="window.switchCoopModalTab('join')" id="tabBtnJoin" class="coop-tab-btn ${currentCoopTab === 'join' ? 'active' : ''}">
            <span>🎟️</span>
            <span>Unirse con Código</span>
          </button>
          <button type="button" onclick="window.switchCoopModalTab('create')" id="tabBtnCreate" class="coop-tab-btn ${currentCoopTab === 'create' ? 'active' : ''}">
            <span>➕</span>
            <span>Crear Nueva Sala</span>
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
  global.openCoopGroupModal = openCoopGroupModal;
  global.openPetCoopModal = openCoopGroupModal;

  function renderCoopTabContent(tab, group, user) {
    if (tab === 'manage') {
      const typeLabel = group.type === 'duo' ? '💕 En Pareja (2 max)' : '👨‍👩‍👧‍👦 Familia / Cuadrilla (4 max)';
      const isFull = group.members.length >= group.maxMembers;
      const shareUrl = `https://mastereng.club/join?code=${group.code}`;

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
                Mascota: <strong>${escapeHtml(group.petName || 'Sparky & Friends')}</strong> • Tipo: <span class="font-bold text-[#b45309]">${typeLabel}</span>
              </p>
            </div>
            <div class="text-right">
              <span class="text-xs font-black px-2.5 py-1 rounded-lg ${isFull ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}">
                ${group.members.length} / ${group.maxMembers} miembros
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
            
            <button type="button" onclick="window.copyCoopInviteCode()" class="btn-copy-code" title="Copiar código para enviar por chat">
              <span>📋</span>
              <span>Copiar Código de Invitación</span>
            </button>

            <div class="coop-link-input-group mt-1">
              <input type="text" id="coopShareLinkInput" readonly value="${shareUrl}" />
              <button type="button" onclick="window.copyCoopInviteLink()" class="btn-coop-secondary text-xs">
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
              ${group.members.length} de ${group.maxMembers} plazas
            </span>
          </div>

          <div class="coop-members-wrapper">
            ${group.members.map(m => `
              <div class="coop-member-row">
                <div class="coop-member-info">
                  <div class="coop-member-avatar">
                    <span>${m.avatar || '🦊'}</span>
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
          <div class="coop-pool-summary mt-1">
            <div>
              <span class="block text-xs font-black text-amber-950">⭐ Fondo de EXP Compartida:</span>
              <span class="text-[10px] text-amber-800">
                <strong>${group.totalExpPool || 990} EXP</strong> acumulados por el equipo
              </span>
            </div>
            <button type="button" onclick="window.handleContributeCoopExp()" class="btn-coop-primary text-xs py-2 px-3.5">
              <span>🍕 Aportar +50 EXP</span>
            </button>
          </div>
        </div>
      `;
    }

    if (tab === 'join') {
      return `
        <div class="flex flex-col gap-3 py-2">
          <div class="bg-[#fffdfa] border-2 border-amber-500 rounded-xl p-4 shadow-sm">
            <h4 class="text-sm font-black text-[#78350f] mb-1 flex items-center gap-2">
              <span>🎟️</span>
              <span>Vincularte a una Familia o Pareja Existente</span>
            </h4>
            <p class="text-xs text-amber-900 mb-3">
              Ingresa el código único de 6 caracteres que te dio tu amigo o pareja (ejemplo: <code>ENG772</code>).
            </p>

            <label class="block text-[11px] font-black text-[#78350f] uppercase mb-1">
              Código de Invitación (6 letras/números):
            </label>
            <input type="text" id="coopJoinCodeInput" maxlength="6" placeholder="EJ: ENG772" class="coop-input-field text-center font-mono text-2xl tracking-[6px] uppercase font-black" autocomplete="off" />

            <div class="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              ✨ <strong>Beneficios al unirte:</strong>
              <ul class="list-disc list-inside mt-1 space-y-0.5">
                <li>Crianza simultánea en vivo (alimentar, bañar y jugar).</li>
                <li>Tus sesiones de inglés y vocabulario sumarán EXP al grupo.</li>
                <li>Racha de días compartida para multiplicar recompensas.</li>
              </ul>
            </div>
          </div>

          <button type="button" onclick="window.handleJoinCoopGroupByCode()" class="btn-coop-primary w-full py-3 text-sm">
            <span>🚀 Unirse al Grupo de Crianza</span>
          </button>
        </div>
      `;
    }

    if (tab === 'create') {
      return `
        <div class="flex flex-col gap-3 py-1">
          <div>
            <label class="block text-xs font-black text-[#78350f] mb-1.5 uppercase">
              1. Selecciona el Tipo de Crianza Compartida:
            </label>
            <div class="coop-type-grid">
              <div onclick="window.selectCoopTypeOption('duo')" id="coopCardDuo" class="coop-type-card ${selectedNewCoopType === 'duo' ? 'active' : ''}">
                <h5><span>💕</span><span>En Pareja (2 miembros)</span></h5>
                <p>Crianza íntima de a 2. Vínculo directo con tu pareja o mejor amigo y racha compartida.</p>
              </div>
              <div onclick="window.selectCoopTypeOption('squad')" id="coopCardSquad" class="coop-type-card ${selectedNewCoopType === 'squad' ? 'active' : ''}">
                <h5><span>👨‍👩‍👧‍👦</span><span>Familia / Amigos (hasta 4)</span></h5>
                <p>Cuadrilla de hasta 4 miembros. Multiplica la EXP y desbloquea misiones colaborativas.</p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-[#78350f] mb-1 uppercase">
              2. Nombre del Grupo o Familia:
            </label>
            <input type="text" id="newCoopGroupNameInput" value="Team English Pros" placeholder="Ej: Team English Pros" class="coop-input-field" />
          </div>

          <div>
            <label class="block text-xs font-black text-[#78350f] mb-1 uppercase">
              3. Nombre de la Mascota Compartida:
            </label>
            <input type="text" id="newCoopPetNameInput" value="${escapeHtml(group.petName || 'Sparky & Friends')}" placeholder="Ej: Sparky & Friends" class="coop-input-field" />
          </div>

          <button type="button" onclick="window.handleCreateNewCoopGroup()" class="btn-coop-primary w-full py-3 text-sm mt-1">
            <span>✨ Crear Sala & Generar Código de 6 Caracteres</span>
          </button>
        </div>
      `;
    }

    return '';
  }

  window.switchCoopModalTab = function (tab) {
    currentCoopTab = tab;
    const body = document.getElementById('coopModalTabBody');
    const user = getStoredUser();
    const group = getCoopGroupData(user);
    if (body) {
      body.innerHTML = renderCoopTabContent(tab, group, user);
    }
    document.querySelectorAll('.coop-tab-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(tab === 'manage' ? 'tabBtnManage' : (tab === 'join' ? 'tabBtnJoin' : 'tabBtnCreate'));
    if (activeBtn) activeBtn.classList.add('active');
  };

  window.selectCoopTypeOption = function (type) {
    selectedNewCoopType = type;
    const duoCard = document.getElementById('coopCardDuo');
    const squadCard = document.getElementById('coopCardSquad');
    if (duoCard) duoCard.classList.toggle('active', type === 'duo');
    if (squadCard) squadCard.classList.toggle('active', type === 'squad');
  };

  window.copyCoopInviteCode = function () {
    const user = getStoredUser();
    const group = getCoopGroupData(user);
    copyToClipboard(group.code, `📋 ¡Código de Invitación (${group.code}) copiado con éxito!`);
  };

  window.copyCoopInviteLink = function () {
    const user = getStoredUser();
    const group = getCoopGroupData(user);
    const link = `https://mastereng.club/join?code=${group.code}`;
    copyToClipboard(link, `🔗 ¡Enlace de invitación (${group.code}) copiado al portapapeles!`);
  };

  window.handleCreateNewCoopGroup = function () {
    const nameInput = document.getElementById('newCoopGroupNameInput');
    const petInput = document.getElementById('newCoopPetNameInput');
    const groupName = (nameInput && nameInput.value.trim()) || 'Team English Pros';
    const petName = (petInput && petInput.value.trim()) || 'Sparky & Friends';

    const user = getStoredUser();
    const social = getSocialProfileData(user);
    const newCode = generateCoopInviteCode();
    const maxMembers = selectedNewCoopType === 'duo' ? 2 : 4;

    const newGroup = {
      id: 'coop_group_' + Date.now(),
      code: newCode,
      name: groupName,
      type: selectedNewCoopType,
      maxMembers,
      petName,
      petSpecies: (social.pet && social.pet.species) || 'Papercraft Companion',
      petLevel: (social.pet && social.pet.level) || 1,
      totalExpPool: 0,
      createdAt: new Date().toISOString(),
      members: [
        {
          id: 'mem_' + Date.now(),
          username: user.username || 'Master Learner',
          avatar: social.avatarEmoji || '🦊',
          role: 'Líder de Crianza',
          isOwner: true,
          expContributed: 0,
          streakDays: 1,
          joinedAt: 'Hoy'
        }
      ]
    };

    saveCoopGroupData(newGroup);

    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : (typeof alert === 'function' ? alert : console.log));
    toast(`🎉 ¡Grupo "${groupName}" creado con éxito! Código: ${newCode}`);

    window.switchCoopModalTab('manage');
    renderSocialProfileView();
  };

  window.handleJoinCoopGroupByCode = function () {
    const input = document.getElementById('coopJoinCodeInput');
    const code = (input && input.value.trim().toUpperCase()) || '';

    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : (typeof alert === 'function' ? alert : console.log));

    if (!code || code.length !== 6) {
      toast('⚠️ Por favor ingresa un código de 6 caracteres válido (ej: ENG772).');
      return;
    }

    const user = getStoredUser();
    const social = getSocialProfileData(user);
    let group = getCoopGroupData(user);

    // Si el código coincide o es nuevo, asociarlo
    if (group.code !== code) {
      group.code = code;
      group.name = 'Familia Co-Op ' + code;
    }

    // Verificar si ya está como miembro
    const myUsername = user.username || 'Master Learner';
    const alreadyMember = group.members.some(m => m.username === myUsername);

    if (!alreadyMember) {
      if (group.members.length >= group.maxMembers) {
        toast(`⚠️ El grupo ${code} ya alcanzó su capacidad máxima de ${group.maxMembers} miembros.`);
        return;
      }

      group.members.push({
        id: 'mem_' + Date.now(),
        username: myUsername,
        avatar: social.avatarEmoji || '🦊',
        role: group.type === 'duo' ? 'Co-Parent' : 'Guardián',
        isOwner: false,
        expContributed: 50,
        streakDays: 1,
        joinedAt: 'Hoy'
      });
      group.totalExpPool = (group.totalExpPool || 0) + 50;
    }

    saveCoopGroupData(group);
    toast(`🎉 ¡Te has unido exitosamente al grupo de crianza [${code}]!`);

    window.switchCoopModalTab('manage');
    renderSocialProfileView();
  };

  window.handleContributeCoopExp = function () {
    const user = getStoredUser();
    const social = getSocialProfileData(user);
    let group = getCoopGroupData(user);
    const myUsername = user.username || 'Master Learner';

    let member = group.members.find(m => m.username === myUsername);
    if (!member) {
      member = group.members[0];
    }

    if (member) {
      member.expContributed = (member.expContributed || 0) + 50;
    }
    group.totalExpPool = (group.totalExpPool || 0) + 50;

    // Sumar también a la mascota local
    if (social.pet) {
      social.pet.exp = (social.pet.exp || 0) + 50;
      if (social.pet.exp >= social.pet.level * 100) {
        social.pet.level += 1;
        social.pet.exp = 0;
      }
      saveSocialProfileData(social);
    }

    saveCoopGroupData(group);

    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : (typeof alert === 'function' ? alert : console.log));
    toast('⭐ ¡Has aportado +50 EXP al fondo de crianza compartida!');

    window.switchCoopModalTab('manage');
    renderSocialProfileView();
  };

  window.closeCoopGroupModal = function () {
    const modal = document.getElementById('coopGroupModalOverlay');
    if (modal) modal.remove();
  };

  // ============================================================================
  // 9. OBSERVADOR DE VISIBILIDAD DE VISTAS DE MASCOTAS (BODY.PET-VIEW-ACTIVE)
  // ============================================================================
  function initPetViewWatcher() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    function checkPetVisibility() {
      const sanctuary = document.getElementById('view-pet-sanctuary');
      const habitat = document.getElementById('view-pet-game');
      const isSanctuaryOpen = sanctuary && !sanctuary.classList.contains('hidden') && sanctuary.style.display !== 'none';
      const isHabitatOpen = habitat && !habitat.classList.contains('hidden') && habitat.style.display !== 'none';
      const shouldBeActive = Boolean(isSanctuaryOpen || isHabitatOpen);

      if (document.body.classList.contains('pet-view-active') !== shouldBeActive) {
        document.body.classList.toggle('pet-view-active', shouldBeActive);
      }
    }

    const timer = setInterval(checkPetVisibility, 250);
    if (timer && typeof timer.unref === 'function') {
      timer.unref();
    }

    if (window.MutationObserver) {
      try {
        const observer = new MutationObserver(checkPetVisibility);
        observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class', 'style'] });
      } catch (_) {}
    }
  }

  // ============================================================================
  // 10. HOOK AND OVERRIDE ENGINE RENDERER (window.renderUserProfile)
  // ============================================================================
  function hookProfileRenderer() {
    // Preserve any existing logout function
    if (!window.handleProfileLogout) {
      window.handleProfileLogout = function () {
        localStorage.removeItem('mastereng_user');
        localStorage.removeItem('english_app_user_session');
        window.closeAllModals();
        if (typeof window.showFloatingToast === 'function') {
          window.showFloatingToast('👋 Sesión cerrada correctamente.');
        }
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('login');
        } else {
          location.reload();
        }
      };
    }

    // Bind public renderers
    window.renderUserProfile = renderSocialProfileView;
    window.renderProfileModalContent = renderSocialProfileView;
    global.renderSocialProfileView = renderSocialProfileView;
    window.openCoopGroupModal = openCoopGroupModal;
    window.openPetCoopModal = openCoopGroupModal;
    global.openPetCoopModal = openCoopGroupModal;

    // Start background watcher for hiding floating buttons in pet view
    initPetViewWatcher();
  }

  // Hook immediately and on DOM Ready
  hookProfileRenderer();
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hookProfileRenderer);
    } else {
      setTimeout(hookProfileRenderer, 20);
    }
  }

  console.log('[MasterENG] Social Profile & Pet Sanctuary Engine loaded successfully.');

})(typeof window !== 'undefined' ? window : globalThis);

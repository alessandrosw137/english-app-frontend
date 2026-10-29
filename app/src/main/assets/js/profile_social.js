/**
 * MasterENG - Social Profile & Pet Sanctuary Engine
 * Estilo Facebook / Discord Educativo con Insignias de Rango e Interacción de Mascotas en Vivo
 * 
 * Exposes:
 *  - window.MasterENGSocialProfile
 *  - window.renderUserProfile (Hooks into core modal renderer)
 *  - window.openEditProfileModal
 *  - window.openAddHobbyModal
 *  - window.openEditSocialLinksModal
 *  - window.triggerAvatarUpload
 *  - window.closeProfileModal
 *  - window.confirmProfileLogout
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
  const STORAGE_KEY_PETS = 'mastereng_pets';
  const STORAGE_KEY_COOP = 'mastereng_coop_groups';
  const MIGRATION_FLAG_V3 = 'mastereng_profile_clean_v3';

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
    '📚 Reading', '✈️ Travel', '☕ Coffee Enthusiast', '🎬 Cinema',
    '🍕 Foodie', '🎨 Digital Art', '🗣️ Language Exchange', '🐾 Pet Lover',
    '🌱 Gardening', '⚽ Football', '🧘 Yoga & Wellness'
  ];

  // ============================================================================
  // 3. MIGRATION V3 (LIMPIEZA DE MOCK DATA / VALORES POR DEFECTO HARDCODEADOS)
  // ============================================================================
  function runProfileMigrationV3() {
    try {
      const cleaned = localStorage.getItem(MIGRATION_FLAG_V3);
      if (cleaned === 'true') return;

      const raw = localStorage.getItem(STORAGE_KEY_SOCIAL);
      if (raw) {
        let parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          // Detectar y purgar datos de relleno demo
          if (parsed.location && parsed.location.includes('Ciudad de México')) {
            parsed.location = 'Sin especificar';
          }
          if (parsed.relationship && parsed.relationship.includes('Criador Solitario')) {
            parsed.relationship = 'Sin compañero de crianza';
          }
          if (parsed.bio && (
            parsed.bio.includes('Explorando MasterENG en modo invitado') ||
            parsed.bio.includes('Dominando el inglés con IA y cuidando de mis mascotas')
          )) {
            parsed.bio = "Sin biografía aún. Haz clic en 'Editar Perfil' para presentarte.";
          }
          if (parsed.socialLinks && (
            parsed.socialLinks.instagram === 'mastereng_learner' ||
            parsed.socialLinks.twitter === 'mastereng_ai' ||
            parsed.socialLinks.tiktok === 'english.fluent' ||
            (parsed.socialLinks.facebook && parsed.socialLinks.facebook.includes('mastereng'))
          )) {
            parsed.socialLinks = {};
          }
          if (Array.isArray(parsed.hobbies) && (
            parsed.hobbies.includes('☕ Coffee Enthusiast') &&
            parsed.hobbies.includes('🎵 Music & Guitar') &&
            parsed.hobbies.includes('💻 Coding')
          )) {
            parsed.hobbies = [];
          }
          // Eliminar mascota de relleno si no está en mastereng_pets
          delete parsed.pet;
          delete parsed.sharedPets;

          localStorage.setItem(STORAGE_KEY_SOCIAL, JSON.stringify(parsed));
        }
      }

      // Limpiar también grupo Co-Op demo pre-cargado si era un placeholder
      const rawCoop = localStorage.getItem(STORAGE_KEY_COOP);
      if (rawCoop) {
        try {
          const parsedCoop = JSON.parse(rawCoop);
          if (parsedCoop && parsedCoop.id === 'coop_master_group_1' && Array.isArray(parsedCoop.members)) {
            if (parsedCoop.id === 'coop_master_group_1' || parsedCoop.isDemo) {
              localStorage.removeItem(STORAGE_KEY_COOP);
            }
          }
        } catch (_) {}
      }

      localStorage.setItem(MIGRATION_FLAG_V3, 'true');
    } catch (err) {
      console.warn('[ProfileSocial] Error in migration v3:', err);
    }
  }

  // Ejecutar migración de forma inmediata
  runProfileMigrationV3();

  // ============================================================================
  // 4. DATA PERSISTENCE & MERGE
  // ============================================================================
  function getStoredUser() {
    try {
      const raw = localStorage.getItem('mastereng_user') || localStorage.getItem('english_app_user_session');
      if (raw) {
        const u = JSON.parse(raw);
        if (u && typeof u === 'object') {
          u.username = u.username || u.name || (u.email ? u.email.split('@')[0] : 'Master Learner');
          return u;
        }
      }
      return { role: 'guest', username: 'Invitado' };
    } catch (_) {
      return { role: 'guest', username: 'Invitado' };
    }
  }

  function getSocialProfileData(user) {
    runProfileMigrationV3();
    let data = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SOCIAL);
      if (raw) data = JSON.parse(raw);
    } catch (_) {}

    const isGuest = user.role === 'guest' || user.username === 'Invitado';

    // Recuperar posible pareja/compañero real de citas 3D de world3d.js
    const couplePartner = localStorage.getItem('mastereng_active_date_partner') ||
                          localStorage.getItem('mastereng_couple_partner_name') ||
                          null;

    const defaultState = {
      coverPhoto: DEFAULT_COVERS[0].bg,
      coverId: 'cosmic',
      avatarType: 'emoji',
      avatarEmoji: isGuest ? '👤' : '🦊',
      avatarCustomUrl: (user && user.avatar && user.avatar.startsWith('data:')) ? user.avatar : '',
      bio: "Sin biografía aún. Haz clic en 'Editar Perfil' para presentarte.",
      location: 'Sin especificar',
      relationship: couplePartner ? `Compañero de Crianza con @${couplePartner}` : 'Sin compañero de crianza',
      hobbies: [],
      socialLinks: {}
    };

    if (!data) {
      data = Object.assign({}, defaultState);
      saveSocialProfileData(data);
    } else {
      // Garantizar campos sin mezclar con mocks
      data = Object.assign({}, defaultState, data);
      if (!Array.isArray(data.hobbies)) data.hobbies = [];
      if (!data.socialLinks || typeof data.socialLinks !== 'object') data.socialLinks = {};
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
  // 5. RECUPERAR MASCOTAS REALES DEL USUARIO (localStorage: mastereng_pets)
  // ============================================================================
  function getUserPetsData() {
    let pets = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PETS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) pets = parsed;
      }
    } catch (_) {}
    const hasPet = pets.length > 0;
    const activePet = hasPet ? (pets.find(p => p.active) || pets[0]) : null;
    return { pets, hasPet, activePet };
  }

  function saveUserPetsData(pets) {
    try {
      localStorage.setItem(STORAGE_KEY_PETS, JSON.stringify(pets));
    } catch (err) {
      console.warn('[ProfileSocial] Error saving pets:', err);
    }
  }

  // ============================================================================
  // 6. RANK ALGORITHMS (ENGLISH CEFR + PET PARENT RANK)
  // ============================================================================
  function calculateEnglishRank(user) {
    let exp = parseInt(user.exp, 10);
    if (isNaN(exp)) {
      try {
        exp = parseInt(localStorage.getItem('mastereng_user_exp'), 10) || 0;
      } catch (_) {
        exp = 0;
      }
    }
    exp = Math.max(0, exp);

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

    let streak = parseInt(user.streak_days || user.streak, 10);
    if (isNaN(streak)) {
      try {
        streak = parseInt(localStorage.getItem('mastereng_streak_days'), 10) || 0;
      } catch (_) {
        streak = 0;
      }
    }

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
      wordsMastered: learnedCount,
      streak: Math.max(0, streak)
    };
  }

  function calculatePetParentRank(activePet, petCount) {
    if (!activePet || petCount === 0) {
      return {
        title: 'Sin Mascotas (0 Adoptadas)',
        badgeEmoji: '🥚',
        rankTier: 'Sin Mascotas',
        streak: 0
      };
    }

    const lvl = activePet.level || 1;
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
      streak: activePet.streakDays || activePet.streak || 1
    };
  }

  // ============================================================================
  // 7. GESTIÓN Y SUBIDA DE AVATAR (CANVAS COMPRESS 256x256 -> BASE64)
  // ============================================================================
  function triggerAvatarUpload(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    let fileInput = document.getElementById('profileAvatarFileInput');
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.id = 'profileAvatarFileInput';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
    }

    fileInput.onchange = function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          canvas.width = 256;
          canvas.height = 256;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Recorte centrado proporcional (object-fit: cover en canvas)
          const size = Math.min(img.width, img.height);
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;
          ctx.drawImage(img, sx, sy, size, size, 0, 0, 256, 256);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);

          const user = getStoredUser();
          const social = getSocialProfileData(user);
          social.avatarType = 'custom';
          social.avatarCustomUrl = compressedBase64;
          saveSocialProfileData(social);

          user.avatar = compressedBase64;
          try {
            localStorage.setItem('mastereng_user', JSON.stringify(user));
          } catch (_) {}

          // Notificar al backend si existe /api/profile/update
          if (typeof fetch === 'function') {
            fetch('/api/profile/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                avatar: compressedBase64,
                username: user.username
              })
            }).catch(() => {});
          }

          renderSocialProfileView();

          const toast = (typeof showFloatingToast === 'function')
            ? showFloatingToast
            : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : console.log);
          toast('📸 Foto de perfil actualizada con éxito.');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    };

    fileInput.click();
  }
  global.triggerAvatarUpload = triggerAvatarUpload;

  // ============================================================================
  // 8. RENDERER PRINCIPAL: PERFIL SOCIAL ESTILO FACEBOOK / DISCORD
  // ============================================================================
  function renderSocialProfileView() {
    ensurePetProfileStylesheet();

    const container = document.getElementById('profile-content') || document.getElementById('profileModalBody');
    if (!container) return;

    const user = getStoredUser();
    const social = getSocialProfileData(user);
    const { pets, hasPet, activePet } = getUserPetsData();
    const coopGroup = getCoopGroupData(user);
    const engRank = calculateEnglishRank(user);
    const petRank = calculatePetParentRank(activePet, pets.length);
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

    // Redes sociales configuradas
    const socialLinks = social.socialLinks || {};
    const validSocialKeys = Object.keys(socialLinks).filter(k => Boolean(socialLinks[k] && String(socialLinks[k]).trim()));
    const hasAnySocial = validSocialKeys.length > 0;

    // Hobbies
    const hobbies = Array.isArray(social.hobbies) ? social.hobbies : [];

    // Renderizado HTML
    container.innerHTML = `
      <div class="profile-social-container">
        
        <!-- 1. FOTO DE PORTADA PERSONALIZABLE -->
        <div class="profile-cover-wrapper" style="${coverStyle}">
          <div class="profile-cover-overlay"></div>
          <button type="button" onclick="event.stopPropagation(); window.openEditCoverModal(event)" class="cover-edit-btn" title="Personalizar portada">
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
              <div class="profile-avatar-badge" onclick="event.stopPropagation(); window.triggerAvatarUpload(event)" title="Subir foto de perfil desde tu dispositivo">
                <span>📸</span>
              </div>
            </div>

            <div class="profile-action-buttons">
              <button type="button" onclick="event.stopPropagation(); window.openEditProfileModal('general', event)" class="btn-profile-primary">
                <span>✏️</span>
                <span>Editar Perfil</span>
              </button>

              ${isAdmin ? `
                <button type="button" onclick="event.stopPropagation(); window.closeAllModals(); if(typeof window.openAdminDashboardModal==='function') window.openAdminDashboardModal(event);" class="btn-profile-secondary border-amber-500/40 text-amber-300">
                  <span>🛠️</span>
                  <span>Panel Admin</span>
                </button>
              ` : ''}

              <!-- BOTÓN SALIR: Cierra el modal limpiamente sin cerrar sesión -->
              <button type="button" onclick="event.stopPropagation(); window.closeProfileModal(event)" class="btn-profile-secondary border-slate-700 text-slate-300 hover:text-white" title="Cerrar perfil y regresar">
                <span>🚪</span>
                <span>Salir</span>
              </button>

              <!-- BOTÓN CERRAR SESIÓN SEPARADO CON CONFIRMACIÓN -->
              <button type="button" onclick="event.stopPropagation(); window.confirmProfileLogout(event)" class="btn-profile-secondary border-rose-500/40 text-rose-300 hover:bg-rose-950/40" title="Cerrar sesión de la cuenta">
                <span>🔒</span>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>

          <!-- Nombres, Handle y Estado -->
          <div class="profile-names-group">
            <h3>
              <span>${escapeHtml(user.username || 'Master Learner')}</span>
              <span class="profile-tag-badge">${gameId}</span>
              ${isGuest ? '<span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">Modo Invitado</span>' : ''}
            </h3>
            <p class="profile-bio-text">"${escapeHtml(social.bio)}"</p>
          </div>

          <!-- Detalles de Origen, Relación / Compañero y Fecha -->
          <div class="profile-details-grid">
            <div class="profile-detail-item">
              <span class="profile-detail-icon">📍</span>
              <span>De: <strong>${escapeHtml(social.location)}</strong></span>
            </div>
            <div class="profile-detail-item">
              <span class="profile-detail-icon">💖</span>
              <span><strong>${escapeHtml(social.relationship)}</strong></span>
            </div>
            <div class="profile-detail-item">
              <span class="profile-detail-icon">📅</span>
              <span>Miembro desde: <strong>Octubre 2026</strong></span>
            </div>
          </div>

          <!-- Hobbies e Intereses con botón de eliminar individual (×) -->
          <div class="profile-hobbies-section">
            <span class="text-[11px] font-bold text-slate-400 mr-1">Intereses:</span>
            ${hobbies.length > 0 ? hobbies.map(h => `
              <span class="hobby-pill">
                <span>${escapeHtml(h)}</span>
                <button type="button" onclick="event.stopPropagation(); window.removeSocialHobby('${escapeHtml(h).replace(/'/g, "\\'")}')" class="ml-1 text-slate-400 hover:text-rose-400 font-black cursor-pointer text-xs leading-none" title="Eliminar este interés">&times;</button>
              </span>
            `).join('') : `
              <span class="text-xs text-slate-500 italic mr-2">Sin intereses agregados</span>
            `}
            <button type="button" onclick="event.stopPropagation(); window.openAddHobbyModal(event)" class="hobby-pill border-dashed border-sky-400/40 text-sky-300 hover:border-sky-400 cursor-pointer">
              <span>➕ Agregar</span>
            </button>
          </div>
        </div>

        <!-- 3. ENLACES A REDES SOCIALES (CERO BOTONES FALSOS SI ESTÁ VACÍO) -->
        <div class="profile-social-links-bar">
          <span class="text-[11px] font-bold text-slate-400 mr-2 flex items-center gap-1.5">
            <span>🌐</span>
            <span>Social:</span>
          </span>

          ${hasAnySocial ? `
            ${socialLinks.instagram ? `
              <a href="${getSocialUrl(socialLinks.instagram, 'instagram')}" target="_blank" rel="noopener noreferrer" class="social-pill-link social-instagram" title="Abrir Instagram">
                <span>📸</span>
                <span>${escapeHtml(getSocialDisplay(socialLinks.instagram, 'instagram'))}</span>
              </a>
            ` : ''}

            ${socialLinks.tiktok ? `
              <a href="${getSocialUrl(socialLinks.tiktok, 'tiktok')}" target="_blank" rel="noopener noreferrer" class="social-pill-link social-tiktok" title="Abrir TikTok">
                <span>🎵</span>
                <span>${escapeHtml(getSocialDisplay(socialLinks.tiktok, 'tiktok'))}</span>
              </a>
            ` : ''}

            ${socialLinks.facebook ? `
              <a href="${getSocialUrl(socialLinks.facebook, 'facebook')}" target="_blank" rel="noopener noreferrer" class="social-pill-link social-facebook" title="Abrir Facebook">
                <span>📘</span>
                <span>${escapeHtml(getSocialDisplay(socialLinks.facebook, 'facebook'))}</span>
              </a>
            ` : ''}

            ${socialLinks.twitter ? `
              <a href="${getSocialUrl(socialLinks.twitter, 'twitter')}" target="_blank" rel="noopener noreferrer" class="social-pill-link social-twitter" title="Abrir X / Twitter">
                <span>🐦</span>
                <span>${escapeHtml(getSocialDisplay(socialLinks.twitter, 'twitter'))}</span>
              </a>
            ` : ''}

            ${socialLinks.github ? `
              <a href="${getSocialUrl(socialLinks.github, 'github')}" target="_blank" rel="noopener noreferrer" class="social-pill-link social-github" title="Abrir GitHub">
                <span>💻</span>
                <span>${escapeHtml(getSocialDisplay(socialLinks.github, 'github'))}</span>
              </a>
            ` : ''}

            ${socialLinks.linkedin ? `
              <a href="${getSocialUrl(socialLinks.linkedin, 'linkedin')}" target="_blank" rel="noopener noreferrer" class="social-pill-link social-linkedin" title="Abrir LinkedIn">
                <span>💼</span>
                <span>${escapeHtml(getSocialDisplay(socialLinks.linkedin, 'linkedin'))}</span>
              </a>
            ` : ''}
          ` : `
            <span class="text-xs text-slate-500 italic mr-2">Sin redes vinculadas</span>
          `}

          <button type="button" onclick="event.stopPropagation(); window.openEditSocialLinksModal(event)" class="ml-auto text-[11px] font-bold text-sky-400 hover:text-sky-300 transition cursor-pointer">
            ⚙️ Editar Redes
          </button>
        </div>

        <!-- 4. INSIGNIAS OFICIALES: RANGO DE INGLÉS CEFR + SANTUARIO DE MASCOTAS -->
        <div class="profile-badges-container">
          
          <!-- TARJETA 1: INSIGNIA METÁLICA DE RANGO DE INGLÉS (CEFR) CON EXP REAL -->
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

            <!-- Métricas de estudio reales -->
            <div class="rank-stats-pills">
              <div class="stat-metric-pill">
                <span class="num">${engRank.wordsMastered}</span>
                <span class="lbl">Palabras</span>
              </div>
              <div class="stat-metric-pill">
                <span class="num">🔥 ${engRank.streak}</span>
                <span class="lbl">Días Racha</span>
              </div>
              <div class="stat-metric-pill">
                <span class="num">${engRank.currentExp > 0 ? '98%' : '0%'}</span>
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
              <span class="text-[10px] font-bold text-[#5c2e14] bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
                ${petRank.badgeEmoji} ${hasPet ? `Lv.${activePet.level || 1} • ${pets.length} ${pets.length === 1 ? 'Mascota' : 'Mascotas'}` : '0 Mascotas Adoptadas'}
              </span>
            </div>

            ${hasPet && activePet ? `
              <!-- Mascota Principal Real en Vivo -->
              <div class="craft-pet-main-row">
                <div class="craft-pet-avatar-cutout">
                  <span>${activePet.icon || activePet.emoji || '🐾'}</span>
                  <div class="craft-pet-level-badge">Lv.${activePet.level || 1}</div>
                </div>
                <div class="craft-pet-details">
                  <h4>
                    <span>${escapeHtml(activePet.name || 'Mi Mascota')}</span>
                    <span class="text-xs">✨</span>
                  </h4>
                  <p>${escapeHtml(activePet.species || 'Casimerito')} • ${escapeHtml(activePet.stage || 'Bebé')}</p>
                  <div class="craft-streak-indicator">
                    <span>❤️ Racha de Cuidado:</span>
                    <span>${activePet.streakDays || activePet.streak || 1} días</span>
                  </div>
                </div>
              </div>

              <!-- Barras de Estado en Vivo (Hambre, Felicidad, Energía) -->
              <div class="craft-pet-meters-grid">
                <div class="craft-meter-box">
                  <span class="title">🍖 Hambre: ${activePet.hunger || 80}%</span>
                  <div class="craft-meter-bar-track">
                    <div class="craft-meter-bar-fill fill-hunger" style="width: ${activePet.hunger || 80}%;"></div>
                  </div>
                </div>
                <div class="craft-meter-box">
                  <span class="title">💖 Ánimo: ${activePet.happiness || 85}%</span>
                  <div class="craft-meter-bar-track">
                    <div class="craft-meter-bar-fill fill-happy" style="width: ${activePet.happiness || 85}%;"></div>
                  </div>
                </div>
                <div class="craft-meter-box">
                  <span class="title">⚡ Energía: ${activePet.energy || 75}%</span>
                  <div class="craft-meter-bar-track">
                    <div class="craft-meter-bar-fill fill-energy" style="width: ${activePet.energy || 75}%;"></div>
                  </div>
                </div>
              </div>

              <!-- Botones Interactivos de Cuidado -->
              <div class="craft-pet-actions-row">
                <button type="button" onclick="event.stopPropagation(); window.interactWithPet('feed', event)" class="btn-craft-action" title="Alimentar con Vocabulario">
                  <span>🍎</span>
                  <span>Alimentar</span>
                </button>
                <button type="button" onclick="event.stopPropagation(); window.interactWithPet('pet', event)" class="btn-craft-action" title="Acariciar">
                  <span>✋</span>
                  <span>Acariciar</span>
                </button>
                <button type="button" onclick="event.stopPropagation(); window.interactWithPet('learn', event)" class="btn-craft-action" title="Enseñar Palabra en Inglés">
                  <span>💡</span>
                  <span>Enseñar (+IQ)</span>
                </button>
              </div>
            ` : `
              <!-- Estado Vacío Limpio: Cero Mascotas -->
              <div class="p-4 my-2.5 bg-[#fffdfa] border-2 border-dashed border-amber-600/40 rounded-2xl text-center space-y-2">
                <div class="text-3xl">📦✨</div>
                <h4 class="text-xs font-black text-[#78350f] m-0">Sin mascotas activas en tu Santuario</h4>
                <p class="text-[11px] text-amber-900/80 m-0 leading-relaxed max-w-xs mx-auto">
                  Aún no has adoptado a tu primer Casimerito. ¡Explora el Santuario para incubar un huevo o adoptar tu primera mascota!
                </p>
                <button type="button" onclick="event.stopPropagation(); window.navigateToMasterPetSanctuary(event)" class="mt-1 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-black shadow-md border-b-2 border-amber-900 cursor-pointer transition active:scale-95 inline-flex items-center gap-1.5">
                  <span>🐾</span>
                  <span>Ir a MasterPet Sanctuary</span>
                </button>
              </div>
            `}

            <!-- Vitrina de Crianza Compartida (Co-Op) -->
            <div class="craft-shared-showcase">
              <div class="craft-shared-title flex items-center justify-between">
                <span>🤝 Crianza Compartida (Co-Op):</span>
                ${coopGroup ? `
                  <span class="text-[10px] bg-amber-100 text-[#78350f] font-mono font-black px-1.5 py-0.5 rounded border border-amber-300">
                    Código: ${coopGroup.code}
                  </span>
                ` : `
                  <span class="text-[10px] text-amber-900/70 italic">Sin grupo activo</span>
                `}
              </div>

              ${coopGroup ? `
                <div class="craft-shared-grid">
                  <div class="craft-mini-pet-pill">
                    <span>🏡</span>
                    <span><strong>${escapeHtml(coopGroup.name)}</strong> (${coopGroup.members ? coopGroup.members.length : 1} miembros)</span>
                  </div>
                </div>
                <button type="button" onclick="event.stopPropagation(); window.openCoopGroupModal('manage', event)" class="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs shadow-md border-2 border-amber-800 border-b-4 flex items-center justify-center gap-2 cursor-pointer transition active:translate-y-0.5">
                  <span>👥</span>
                  <span>Gestionar Grupo & Invitar Amigos</span>
                </button>
              ` : `
                <p class="text-[11px] text-amber-900/80 my-1 leading-relaxed">
                  Cría mascotas en vivo junto a tu pareja o amigos compartiendo un código de 6 caracteres.
                </p>
                <button type="button" onclick="event.stopPropagation(); window.openCoopGroupModal('create', event)" class="w-full mt-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs shadow-md border-2 border-amber-800 border-b-4 flex items-center justify-center gap-2 cursor-pointer transition active:translate-y-0.5">
                  <span>🤝</span>
                  <span>Crear o Unirme a Grupo Co-Op</span>
                </button>
              `}
            </div>

          </div>

        </div>

      </div>
    `;
  }

  // ============================================================================
  // 9. NAVEGACIÓN Y CIERRE DE MODAL LIMPIO
  // ============================================================================
  function closeProfileModal(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof window.closeAllModals === 'function') {
      window.closeAllModals();
    }
    const modal = document.getElementById('profileModal') || document.getElementById('profile-modal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.add('hidden');
      modal.classList.remove('active');
    }
  }
  global.closeProfileModal = closeProfileModal;

  function confirmProfileLogout(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const ok = window.confirm('¿Seguro que deseas cerrar sesión de tu cuenta en este dispositivo?');
    if (ok && typeof window.handleProfileLogout === 'function') {
      window.handleProfileLogout();
    }
  }
  global.confirmProfileLogout = confirmProfileLogout;

  function closeSocialProfile(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    try {
      if (typeof window.closeProfileModal === 'function') window.closeProfileModal();
    } catch (_) {}
    try {
      if (typeof window.closeAllModals === 'function') window.closeAllModals();
    } catch (_) {}
    const targets = ['profileModal', 'profile-modal', 'user-profile-modal', 'social-profile-modal'];
    targets.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = 'none';
        el.classList.add('hidden');
        el.classList.remove('active');
      }
    });
  }
  global.closeSocialProfile = closeSocialProfile;
  window.closeSocialProfile = closeSocialProfile;

  function navigateToMasterPetSanctuary(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    // Requerimiento 2: Cierra primero automáticamente el modal del Perfil de Usuario y luego abre openPetSanctuary
    closeSocialProfile(e);
    if (typeof window.openPetSanctuary === 'function') {
      window.openPetSanctuary();
    } else if (typeof window.navigateTo === 'function') {
      window.navigateTo('pet_sanctuary');
    }
  }
  global.navigateToMasterPetSanctuary = navigateToMasterPetSanctuary;
  window.navigateToMasterPetSanctuary = navigateToMasterPetSanctuary;

  // ============================================================================
  // 10. INTERACCIÓN CON MASCOTAS EN VIVO (ALIMENTAR, ACARICIAR, ENSEÑAR)
  // ============================================================================
  function interactWithPet(action, e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const { pets, hasPet, activePet } = getUserPetsData();
    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : console.log);

    if (!hasPet || !activePet) {
      toast('🐾 Aún no has adoptado una mascota. ¡Visita el Santuario para adoptar una!');
      return;
    }

    const petName = activePet.name || 'Tu mascota';

    if (action === 'feed') {
      activePet.hunger = Math.min(100, (activePet.hunger || 80) + 15);
      activePet.exp = (activePet.exp || 0) + 15;
      const needed = (activePet.level || 1) * 100;
      if (activePet.exp >= needed) {
        activePet.level = (activePet.level || 1) + 1;
        activePet.exp = 0;
        toast(`🎉 ¡${petName} subió al Nivel ${activePet.level}!`);
      } else {
        toast(`🍎 Has alimentado a ${petName}. +15 Hambre, +15 EXP de Crianza`);
      }
    } else if (action === 'pet') {
      activePet.happiness = Math.min(100, (activePet.happiness || 85) + 12);
      activePet.streakDays = (activePet.streakDays || activePet.streak || 1) + 1;
      toast(`💖 ¡${petName} ronronea feliz! Racha de cuidado: ${activePet.streakDays} días`);
    } else if (action === 'learn') {
      activePet.energy = Math.max(10, (activePet.energy || 75) - 8);
      const user = getStoredUser();
      user.exp = (parseInt(user.exp, 10) || 0) + 10;
      try {
        localStorage.setItem('mastereng_user', JSON.stringify(user));
      } catch (_) {}
      toast(`💡 ¡${petName} aprendió una palabra nueva! +10 EXP de inglés`);
    }

    saveUserPetsData(pets);
    renderSocialProfileView();
  }
  global.interactWithPet = interactWithPet;

  // ============================================================================
  // 11. GESTIÓN DE INTERESES & HOBBIES (AGREGAR Y ELIMINAR CON ×)
  // ============================================================================
  function openAddHobbyModal(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const oldModal = document.getElementById('addHobbyModalOverlay');
    if (oldModal) oldModal.remove();

    const user = getStoredUser();
    const social = getSocialProfileData(user);
    const currentHobbies = Array.isArray(social.hobbies) ? social.hobbies : [];

    const overlay = document.createElement('div');
    overlay.id = 'addHobbyModalOverlay';
    overlay.className = 'profile-edit-modal-overlay';

    overlay.innerHTML = `
      <div class="profile-edit-card" onclick="event.stopPropagation();" style="max-width: 480px; position: relative !important; z-index: 25001 !important;">
        <div class="flex items-center justify-between pb-3 border-b border-slate-700">
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>➕</span>
            <span>Gestionar Intereses & Hobbies</span>
          </h3>
          <button type="button" onclick="document.getElementById('addHobbyModalOverlay').remove()" class="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer">&times;</button>
        </div>

        <div class="space-y-4 py-3">
          <!-- Input personalizado -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">Escribe un nuevo interés:</label>
            <div class="flex items-center gap-2">
              <input type="text" id="customHobbyInput" class="edit-input-field flex-1" placeholder="Ej: Fotografía, Ajedrez, Skate..." maxlength="30" />
              <button type="button" onclick="window.submitCustomHobby()" class="btn-profile-primary px-4 py-2 text-xs">
                <span>➕ Agregar</span>
              </button>
            </div>
          </div>

          <!-- Sugerencias Populares -->
          <div>
            <label class="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Sugerencias (haz clic para agregar):</label>
            <div class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              ${COMMON_HOBBIES.map(ch => `
                <button type="button" onclick="window.addSocialHobby('${escapeHtml(ch)}')" class="hobby-pill text-xs border border-slate-700 hover:border-sky-400 bg-slate-900/80 cursor-pointer transition">
                  <span>${ch}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Intereses Actuales con botón × para eliminar -->
          <div class="pt-2 border-t border-slate-800">
            <label class="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Tus intereses actuales (${currentHobbies.length}):</label>
            <div id="modalCurrentHobbiesList" class="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-slate-900/60 rounded-xl border border-slate-800">
              ${currentHobbies.length > 0 ? currentHobbies.map(h => `
                <span class="hobby-pill">
                  <span>${escapeHtml(h)}</span>
                  <button type="button" onclick="window.removeSocialHobby('${escapeHtml(h).replace(/'/g, "\\'")}', true)" class="ml-1 text-slate-400 hover:text-rose-400 font-black cursor-pointer text-xs">&times;</button>
                </span>
              `).join('') : '<span class="text-xs text-slate-500 italic">Sin intereses agregados aún.</span>'}
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-700 flex justify-end">
          <button type="button" onclick="document.getElementById('addHobbyModalOverlay').remove()" class="btn-profile-primary px-5 py-2 text-xs">
            <span>Listo</span>
          </button>
        </div>
      </div>
    `;

    overlay.onclick = function (e) {
      if (e.target === overlay) overlay.remove();
    };

    document.body.appendChild(overlay);
    setTimeout(() => {
      const inp = document.getElementById('customHobbyInput');
      if (inp) {
        inp.focus();
        inp.onkeydown = function (ev) {
          if (ev.key === 'Enter') {
            ev.preventDefault();
            submitCustomHobby();
          }
        };
      }
    }, 50);
  }
  global.openAddHobbyModal = openAddHobbyModal;

  function addSocialHobby(hobbyText, e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const clean = String(hobbyText || '').trim();
    if (!clean) return;

    const user = getStoredUser();
    const social = getSocialProfileData(user);
    if (!Array.isArray(social.hobbies)) social.hobbies = [];

    if (social.hobbies.includes(clean)) {
      const toast = (typeof showFloatingToast === 'function')
        ? showFloatingToast
        : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : console.log);
      toast('⚠️ Ese interés ya está en tu lista.');
      return;
    }

    social.hobbies.push(clean);
    saveSocialProfileData(social);

    renderSocialProfileView();

    const listEl = document.getElementById('modalCurrentHobbiesList');
    if (listEl) {
      listEl.innerHTML = social.hobbies.map(h => `
        <span class="hobby-pill">
          <span>${escapeHtml(h)}</span>
          <button type="button" onclick="window.removeSocialHobby('${escapeHtml(h).replace(/'/g, "\\'")}', true)" class="ml-1 text-slate-400 hover:text-rose-400 font-black cursor-pointer text-xs">&times;</button>
        </span>
      `).join('');
    }

    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : console.log);
    toast(`✨ Interés agregado: ${clean}`);
  }
  global.addSocialHobby = addSocialHobby;

  function submitCustomHobby(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const inp = document.getElementById('customHobbyInput');
    if (!inp) return;
    const val = inp.value.trim();
    if (!val) return;
    addSocialHobby(val);
    inp.value = '';
    inp.focus();
  }
  global.submitCustomHobby = submitCustomHobby;

  function removeSocialHobby(hobbyText, keepModalOpen, e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const clean = String(hobbyText || '').trim();
    if (!clean) return;

    const user = getStoredUser();
    const social = getSocialProfileData(user);
    if (!Array.isArray(social.hobbies)) social.hobbies = [];

    social.hobbies = social.hobbies.filter(h => h !== clean);
    saveSocialProfileData(social);

    renderSocialProfileView();

    if (keepModalOpen) {
      const listEl = document.getElementById('modalCurrentHobbiesList');
      if (listEl) {
        listEl.innerHTML = social.hobbies.length > 0 ? social.hobbies.map(h => `
          <span class="hobby-pill">
            <span>${escapeHtml(h)}</span>
            <button type="button" onclick="window.removeSocialHobby('${escapeHtml(h).replace(/'/g, "\\'")}', true)" class="ml-1 text-slate-400 hover:text-rose-400 font-black cursor-pointer text-xs">&times;</button>
          </span>
        `).join('') : '<span class="text-xs text-slate-500 italic">Sin intereses agregados aún.</span>';
      }
    }

    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : console.log);
    toast(`🗑️ Interés eliminado: ${clean}`);
  }
  global.removeSocialHobby = removeSocialHobby;

  // ============================================================================
  // 12. GESTIÓN DE REDES SOCIALES REALES (CONFIGURAR / BORRAR)
  // ============================================================================
  function cleanSocialInput(raw) {
    if (!raw) return '';
    let str = String(raw).trim();
    if (!str) return '';
    if (str.startsWith('http://') || str.startsWith('https://')) return str;
    str = str.replace(/^@+/, '').trim();
    str = str.replace(/\/+$/, '').trim();
    return str;
  }

  function getSocialUrl(val, platform) {
    if (!val) return '#';
    if (val.startsWith('http://') || val.startsWith('https://')) return val;
    const clean = val.replace(/^@/, '');
    if (platform === 'instagram') return `https://instagram.com/${clean}`;
    if (platform === 'tiktok') return `https://tiktok.com/@${clean}`;
    if (platform === 'facebook') return `https://facebook.com/${clean}`;
    if (platform === 'twitter') return `https://x.com/${clean}`;
    if (platform === 'github') return `https://github.com/${clean}`;
    if (platform === 'linkedin') return clean.startsWith('in/') ? `https://linkedin.com/${clean}` : `https://linkedin.com/in/${clean}`;
    return `https://${val}`;
  }

  function getSocialDisplay(val, platform) {
    if (!val) return '';
    if (val.startsWith('http://') || val.startsWith('https://')) {
      try {
        const u = new URL(val);
        const path = u.pathname.replace(/^\/+|\/+$/g, '');
        return path ? `@${path.split('/').pop()}` : u.hostname;
      } catch (_) {
        return platform;
      }
    }
    const clean = val.replace(/^@/, '');
    if (platform === 'facebook' || platform === 'github' || platform === 'linkedin') {
      return clean;
    }
    return `@${clean}`;
  }

  function openEditSocialLinksModal(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const oldModal = document.getElementById('editSocialLinksModalOverlay');
    if (oldModal) oldModal.remove();

    const user = getStoredUser();
    const social = getSocialProfileData(user);
    const links = social.socialLinks || {};

    const overlay = document.createElement('div');
    overlay.id = 'editSocialLinksModalOverlay';
    overlay.className = 'profile-edit-modal-overlay';

    overlay.innerHTML = `
      <div class="profile-edit-card" onclick="event.stopPropagation();" style="max-width: 520px; position: relative !important; z-index: 25001 !important;">
        <div class="flex items-center justify-between pb-3 border-b border-slate-700">
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>🌐</span>
            <span>Vincular Redes Sociales</span>
          </h3>
          <button type="button" onclick="document.getElementById('editSocialLinksModalOverlay').remove()" class="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer">&times;</button>
        </div>

        <p class="text-xs text-slate-400 pt-2 pb-1 leading-relaxed">
          Pega tu nombre de usuario o enlace completo. Deja el campo vacío para eliminar o no mostrar esa red.
        </p>

        <div class="space-y-3 py-2 text-xs">
          <div>
            <label class="text-slate-300 font-bold block mb-1">📸 Instagram:</label>
            <input type="text" id="linkInputInsta" class="edit-input-field py-1.5" value="${escapeHtml(links.instagram || '')}" placeholder="Ej: @tu_usuario o https://instagram.com/..." />
          </div>
          <div>
            <label class="text-slate-300 font-bold block mb-1">🎵 TikTok:</label>
            <input type="text" id="linkInputTikTok" class="edit-input-field py-1.5" value="${escapeHtml(links.tiktok || '')}" placeholder="Ej: @tu_usuario o https://tiktok.com/@..." />
          </div>
          <div>
            <label class="text-slate-300 font-bold block mb-1">📘 Facebook:</label>
            <input type="text" id="linkInputFacebook" class="edit-input-field py-1.5" value="${escapeHtml(links.facebook || '')}" placeholder="Ej: tu_usuario o https://facebook.com/..." />
          </div>
          <div>
            <label class="text-slate-300 font-bold block mb-1">🐦 X / Twitter:</label>
            <input type="text" id="linkInputTwitter" class="edit-input-field py-1.5" value="${escapeHtml(links.twitter || '')}" placeholder="Ej: @tu_usuario o https://x.com/..." />
          </div>
          <div>
            <label class="text-slate-300 font-bold block mb-1">💻 GitHub:</label>
            <input type="text" id="linkInputGithub" class="edit-input-field py-1.5" value="${escapeHtml(links.github || '')}" placeholder="Ej: tu_usuario o https://github.com/..." />
          </div>
          <div>
            <label class="text-slate-300 font-bold block mb-1">💼 LinkedIn:</label>
            <input type="text" id="linkInputLinkedin" class="edit-input-field py-1.5" value="${escapeHtml(links.linkedin || '')}" placeholder="Ej: in/tu_usuario o https://linkedin.com/in/..." />
          </div>
        </div>

        <div class="pt-3 border-t border-slate-700 flex justify-end gap-3">
          <button type="button" onclick="document.getElementById('editSocialLinksModalOverlay').remove()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer">
            Cancelar
          </button>
          <button type="button" onclick="window.saveSocialLinksEdits()" class="btn-profile-primary px-5 py-2 text-xs">
            <span>💾 Guardar Redes</span>
          </button>
        </div>
      </div>
    `;

    overlay.onclick = function (e) {
      if (e.target === overlay) overlay.remove();
    };

    document.body.appendChild(overlay);
  }
  global.openEditSocialLinksModal = openEditSocialLinksModal;

  function saveSocialLinksEdits(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const user = getStoredUser();
    const social = getSocialProfileData(user);
    const newLinks = {};

    const insta = cleanSocialInput(document.getElementById('linkInputInsta')?.value);
    const tiktok = cleanSocialInput(document.getElementById('linkInputTikTok')?.value);
    const fb = cleanSocialInput(document.getElementById('linkInputFacebook')?.value);
    const twitter = cleanSocialInput(document.getElementById('linkInputTwitter')?.value);
    const gh = cleanSocialInput(document.getElementById('linkInputGithub')?.value);
    const linkedin = cleanSocialInput(document.getElementById('linkInputLinkedin')?.value);

    if (insta) newLinks.instagram = insta;
    if (tiktok) newLinks.tiktok = tiktok;
    if (fb) newLinks.facebook = fb;
    if (twitter) newLinks.twitter = twitter;
    if (gh) newLinks.github = gh;
    if (linkedin) newLinks.linkedin = linkedin;

    social.socialLinks = newLinks;
    saveSocialProfileData(social);

    const modal = document.getElementById('editSocialLinksModalOverlay');
    if (modal) modal.remove();

    renderSocialProfileView();

    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : console.log);
    toast('🌐 Redes sociales guardadas correctamente.');
  }
  global.saveSocialLinksEdits = saveSocialLinksEdits;

  // ============================================================================
  // 13. MODAL DE EDICIÓN GENERAL DEL PERFIL (NOMBRE, BIO, CIUDAD, SITUACIÓN)
  // ============================================================================
  
  // ============================================================================
  // GESTIÓN DE PORTADA CON SUB-MODAL DEDICADO (Z-INDEX 25000)
  // ============================================================================
  function openEditCoverModal(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const oldModal = document.getElementById('editSocialCoverModalOverlay');
    if (oldModal) oldModal.remove();

    const user = getStoredUser();
    const social = getSocialProfileData(user);

    const overlay = document.createElement('div');
    overlay.id = 'editSocialCoverModalOverlay';
    overlay.className = 'profile-edit-modal-overlay profile-submodal-overlay';
    overlay.style.cssText = 'position: fixed !important; inset: 0 !important; z-index: 25000 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 16px !important; background: rgba(4, 7, 13, 0.88) !important; backdrop-filter: blur(16px) !important; -webkit-backdrop-filter: blur(16px) !important;';

    overlay.innerHTML = `
      <div class="profile-edit-card" onclick="event.stopPropagation();" style="max-width: 520px; position: relative !important; z-index: 25001 !important;">
        <div class="flex items-center justify-between pb-3 border-b border-slate-700">
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>🖼️</span>
            <span>Editar Portada del Perfil</span>
          </h3>
          <button type="button" onclick="document.getElementById('editSocialCoverModalOverlay').remove()" class="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer">&times;</button>
        </div>

        <div class="space-y-4 py-3 text-xs">
          <div>
            <label class="text-slate-300 font-bold block mb-2">Selecciona un fondo temático:</label>
            <div class="cover-presets-grid">
              ${DEFAULT_COVERS.map(c => `
                <div onclick="window.selectSocialCoverPreset('${c.bg}', '${c.id}')" class="cover-preset-thumb ${social.coverId === c.id ? 'active' : ''}" style="background: ${c.bg}; cursor: pointer;" title="${c.name}">
                  <span class="sr-only">${c.name}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-2 border-t border-slate-800">
            <label class="text-slate-300 font-bold block mb-1">O sube una imagen personalizada:</label>
            <button type="button" onclick="window.triggerCoverUpload(event)" class="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sky-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition">
              <span>📷</span>
              <span>Seleccionar imagen de mi dispositivo</span>
            </button>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-700 flex justify-end">
          <button type="button" onclick="document.getElementById('editSocialCoverModalOverlay').remove()" class="btn-profile-primary px-5 py-2 text-xs">
            <span>Listo</span>
          </button>
        </div>
      </div>
    `;

    overlay.onclick = function (ev) {
      if (ev.target === overlay) overlay.remove();
    };

    document.body.appendChild(overlay);
  }
  global.openEditCoverModal = openEditCoverModal;
  window.openEditCoverModal = openEditCoverModal;

  function triggerCoverUpload(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    let fileInput = document.getElementById('profileCoverFileInput');
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.id = 'profileCoverFileInput';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
    }

    fileInput.onchange = function (ev) {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          canvas.width = 1024;
          canvas.height = 340;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const targetAspect = 1024 / 340;
          const imgAspect = img.width / img.height;
          let sWidth = img.width;
          let sHeight = img.height;
          let sx = 0;
          let sy = 0;

          if (imgAspect > targetAspect) {
            sWidth = img.height * targetAspect;
            sx = (img.width - sWidth) / 2;
          } else {
            sHeight = img.width / targetAspect;
            sy = (img.height - sHeight) / 2;
          }

          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 1024, 340);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);

          const user = getStoredUser();
          const social = getSocialProfileData(user);
          social.coverPhoto = compressedBase64;
          social.coverId = 'custom';
          saveSocialProfileData(social);

          renderSocialProfileView();

          const coverModal = document.getElementById('editSocialCoverModalOverlay');
          if (coverModal) coverModal.remove();

          const toast = (typeof showFloatingToast === 'function')
            ? showFloatingToast
            : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : console.log);
          toast('🖼️ Portada personalizada actualizada con éxito.');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    };

    fileInput.click();
  }
  global.triggerCoverUpload = triggerCoverUpload;
  window.triggerCoverUpload = triggerCoverUpload;

  function openEditProfileModal(initialTab) {
    if (initialTab === 'social') {
      openEditSocialLinksModal();
      return;
    }
    if (initialTab === 'hobbies') {
      openAddHobbyModal();
      return;
    }
    if (initialTab === 'avatar') {
      triggerAvatarUpload();
      return;
    }

    const user = getStoredUser();
    const social = getSocialProfileData(user);

    const oldModal = document.getElementById('editSocialProfileModalOverlay');
    if (oldModal) oldModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'editSocialProfileModalOverlay';
    overlay.className = 'profile-edit-modal-overlay';

    overlay.innerHTML = `
      <div class="profile-edit-card" onclick="event.stopPropagation();" style="position: relative !important; z-index: 25001 !important;">
        <div class="flex items-center justify-between pb-3 border-b border-slate-700">
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>✏️</span>
            <span>Editar Perfil</span>
          </h3>
          <button type="button" onclick="document.getElementById('editSocialProfileModalOverlay').remove()" class="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer">&times;</button>
        </div>

        <div class="space-y-3.5 py-3 text-xs">
          <!-- 1. Nombre de Usuario Real -->
          <div class="edit-input-group">
            <label class="text-slate-300 font-bold block mb-1">Nombre de Usuario / Alias:</label>
            <input type="text" id="editSocialUsername" class="edit-input-field" value="${escapeHtml(user.username || '')}" placeholder="Tu nombre o username" maxlength="30" />
          </div>

          <!-- 2. Bio y Presentación -->
          <div class="edit-input-group">
            <label class="text-slate-300 font-bold block mb-1">Bio / Frase de Presentación:</label>
            <input type="text" id="editSocialBio" class="edit-input-field" value="${escapeHtml(social.bio === "Sin biografía aún. Haz clic en 'Editar Perfil' para presentarte." ? '' : social.bio)}" placeholder="Escribe una breve presentación sobre ti..." maxlength="120" />
          </div>

          <!-- 3. Ubicación y Situación de Crianza -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="edit-input-group">
              <label class="text-slate-300 font-bold block mb-1">Ciudad / País de Origen (De:):</label>
              <input type="text" id="editSocialLocation" class="edit-input-field" value="${escapeHtml(social.location === 'Sin especificar' ? '' : social.location)}" placeholder="Ej: Bogotá, Colombia" maxlength="50" />
            </div>
            <div class="edit-input-group">
              <label class="text-slate-300 font-bold block mb-1">Situación / Compañero de Crianza:</label>
              <input type="text" id="editSocialRelationship" class="edit-input-field" value="${escapeHtml(social.relationship === 'Sin compañero de crianza' ? '' : social.relationship)}" placeholder="Ej: Criando con @Starlight" maxlength="60" />
            </div>
          </div>

          <!-- 4. Selector de Avatar o Subir Imagen -->
          <div class="edit-input-group pt-1">
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-slate-300 font-bold">Avatar:</label>
              <button type="button" onclick="window.triggerAvatarUpload()" class="text-xs text-sky-400 font-bold hover:underline cursor-pointer">
                📷 Subir Foto Personalizada
              </button>
            </div>
            <div class="avatar-presets-grid">
              ${DEFAULT_AVATARS.map(a => `
                <button type="button" onclick="window.selectSocialAvatarPreset('${a.emoji}')" class="avatar-preset-btn ${social.avatarEmoji === a.emoji && social.avatarType !== 'custom' ? 'active' : ''}">
                  <span>${a.emoji}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 5. Selector de Portada (Cover) -->
          <div class="edit-input-group">
            <label class="text-slate-300 font-bold block mb-1.5">Fondo de Portada:</label>
            <div class="cover-presets-grid">
              ${DEFAULT_COVERS.map(c => `
                <div onclick="window.selectSocialCoverPreset('${c.bg}', '${c.id}')" class="cover-preset-thumb ${social.coverId === c.id ? 'active' : ''}" style="background: ${c.bg};" title="${c.name}"></div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-700 flex justify-end gap-3">
          <button type="button" onclick="document.getElementById('editSocialProfileModalOverlay').remove()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer">
            Cancelar
          </button>
          <button type="button" onclick="window.saveSocialProfileEdits()" class="btn-profile-primary px-5 py-2 text-xs">
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

  function saveSocialProfileEdits(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const user = getStoredUser();
    const social = getSocialProfileData(user);

    const nameInput = document.getElementById('editSocialUsername');
    if (nameInput && nameInput.value.trim()) {
      user.username = nameInput.value.trim();
      try {
        localStorage.setItem('mastereng_user', JSON.stringify(user));
      } catch (_) {}
    }

    const bioInput = document.getElementById('editSocialBio');
    if (bioInput) {
      const val = bioInput.value.trim();
      social.bio = val || "Sin biografía aún. Haz clic en 'Editar Perfil' para presentarte.";
    }

    const locInput = document.getElementById('editSocialLocation');
    if (locInput) {
      const val = locInput.value.trim();
      social.location = val || 'Sin especificar';
    }

    const relInput = document.getElementById('editSocialRelationship');
    if (relInput) {
      const val = relInput.value.trim();
      social.relationship = val || 'Sin compañero de crianza';
    }

    saveSocialProfileData(social);

    if (typeof fetch === 'function') {
      fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          bio: social.bio,
          location: social.location,
          relationship: social.relationship
        })
      }).catch(() => {});
    }

    const modal = document.getElementById('editSocialProfileModalOverlay');
    if (modal) modal.remove();

    renderSocialProfileView();

    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : console.log);
    toast('✅ Perfil actualizado correctamente.');
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
  // 14. SISTEMA DE SALAS Y GRUPOS DE CRIANZA COMPARTIDA (CO-OP) REALES
  // ============================================================================
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
      if (raw) {
        const parsed = JSON.parse(raw);
        // Descartar si era el demo hardcodeado anterior
        if (parsed && parsed.id !== 'coop_master_group_1' && Array.isArray(parsed.members) && parsed.members.length > 0) {
          group = parsed;
        }
      }
    } catch (_) {}
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
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : console.log);

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
    currentCoopTab = initialTab || (group ? 'manage' : 'create');

    const oldModal = document.getElementById('coopGroupModalOverlay');
    if (oldModal) oldModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'coopGroupModalOverlay';
    overlay.className = 'coop-modal-overlay';

    overlay.innerHTML = `
      <div class="coop-modal-card" onclick="event.stopPropagation();" style="position: relative !important; z-index: 25001 !important;">
        <div class="coop-modal-header">
          <h3>
            <span>🤝</span>
            <span>Crianza Compartida (Co-Op)</span>
          </h3>
          <button type="button" onclick="window.closeCoopGroupModal()" class="text-amber-900 hover:text-amber-700 text-2xl font-black p-1 cursor-pointer leading-none" title="Cerrar">&times;</button>
        </div>

        <div class="coop-tabs-nav">
          <button type="button" onclick="window.switchCoopModalTab('manage')" id="tabBtnManage" class="coop-tab-btn ${currentCoopTab === 'manage' ? 'active' : ''}">
            <span>👥</span>
            <span>Mi Grupo</span>
          </button>
          <button type="button" onclick="window.switchCoopModalTab('join')" id="tabBtnJoin" class="coop-tab-btn ${currentCoopTab === 'join' ? 'active' : ''}">
            <span>🎟️</span>
            <span>Unirse con Código</span>
          </button>
          <button type="button" onclick="window.switchCoopModalTab('create')" id="tabBtnCreate" class="coop-tab-btn ${currentCoopTab === 'create' ? 'active' : ''}">
            <span>➕</span>
            <span>Crear Sala</span>
          </button>
        </div>

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
      if (!group) {
        return `
          <div class="p-6 text-center space-y-3 bg-[#fffdfa] border-2 border-dashed border-amber-600/40 rounded-xl my-2">
            <div class="text-4xl">🏡✨</div>
            <h4 class="text-sm font-black text-[#78350f] m-0">Aún no tienes un grupo de crianza activo</h4>
            <p class="text-xs text-amber-900/80 max-w-sm mx-auto leading-relaxed">
              Crea una sala para criar mascotas junto a tu pareja o amigos, o únete a una existente con su código de 6 caracteres.
            </p>
            <div class="flex justify-center gap-2 pt-1">
              <button type="button" onclick="window.switchCoopModalTab('create')" class="btn-coop-primary text-xs py-2 px-4">
                <span>➕ Crear Grupo</span>
              </button>
              <button type="button" onclick="window.switchCoopModalTab('join')" class="btn-coop-secondary text-xs py-2 px-4">
                <span>🎟️ Unirse con Código</span>
              </button>
            </div>
          </div>
        `;
      }

      const typeLabel = group.type === 'duo' ? '💕 En Pareja (2 max)' : '👨‍👩‍👧‍👦 Familia / Cuadrilla (4 max)';
      const isFull = group.members.length >= group.maxMembers;
      const shareUrl = (typeof window !== 'undefined' && window.location && window.location.origin ? window.location.origin : 'https://mastereng.app') + '/?join=' + group.code;

      return `
        <div class="flex flex-col gap-3 py-1">
          <div class="flex items-center justify-between bg-[#fffdfa] border-2 border-amber-600/60 rounded-xl p-3 shadow-sm">
            <div>
              <h4 class="text-base font-black text-[#78350f] m-0 flex items-center gap-2">
                <span>${escapeHtml(group.name)}</span>
                <span class="text-xs">🏡</span>
              </h4>
              <p class="text-xs text-amber-900 m-0 mt-0.5">
                Mascota: <strong>${escapeHtml(group.petName || 'Nuestra Mascota')}</strong> • Tipo: <span class="font-bold text-[#b45309]">${typeLabel}</span>
              </p>
            </div>
            <div class="text-right">
              <span class="text-xs font-black px-2.5 py-1 rounded-lg ${isFull ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}">
                ${group.members.length} / ${group.maxMembers} miembros
              </span>
            </div>
          </div>

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
          </div>

          <div class="flex items-center justify-between mt-1">
            <span class="text-xs font-black text-[#78350f] flex items-center gap-1.5">
              <span>🏆</span>
              <span>Miembros del Grupo:</span>
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

          <div class="coop-pool-summary mt-1">
            <div>
              <span class="block text-xs font-black text-amber-950">⭐ Fondo de EXP Compartida:</span>
              <span class="text-[10px] text-amber-800">
                <strong>${group.totalExpPool || 0} EXP</strong> acumulados
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
              Ingresa el código único de 6 caracteres que te dio tu amigo o pareja.
            </p>

            <label class="block text-[11px] font-black text-[#78350f] uppercase mb-1">
              Código de Invitación (6 letras/números):
            </label>
            <input type="text" id="coopJoinCodeInput" maxlength="6" placeholder="EJ: MENG01" class="coop-input-field text-center font-mono text-2xl tracking-[6px] uppercase font-black" autocomplete="off" />
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
            <input type="text" id="newCoopGroupNameInput" value="Team English" placeholder="Ej: Team English" class="coop-input-field" maxlength="30" />
          </div>

          <div>
            <label class="block text-xs font-black text-[#78350f] mb-1 uppercase">
              3. Nombre de la Mascota Compartida:
            </label>
            <input type="text" id="newCoopPetNameInput" value="Casimerito Co-Op" placeholder="Ej: Casimerito Co-Op" class="coop-input-field" maxlength="25" />
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
    if (group && group.code) {
      copyToClipboard(group.code, `📋 ¡Código de Invitación (${group.code}) copiado con éxito!`);
    }
  };

  window.copyCoopInviteLink = function () {
    const user = getStoredUser();
    const group = getCoopGroupData(user);
    if (group && group.code) {
      const link = (typeof window !== 'undefined' && window.location && window.location.origin ? window.location.origin : 'https://mastereng.app') + '/?join=' + group.code;
      copyToClipboard(link, `🔗 ¡Enlace de invitación (${group.code}) copiado al portapapeles!`);
    }
  };

  window.handleCreateNewCoopGroup = function () {
    const nameInput = document.getElementById('newCoopGroupNameInput');
    const petInput = document.getElementById('newCoopPetNameInput');
    const groupName = (nameInput && nameInput.value.trim()) || 'Team English';
    const petName = (petInput && petInput.value.trim()) || 'Casimerito Co-Op';

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
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : console.log);
    toast(`🎉 ¡Grupo "${groupName}" creado con éxito! Código: ${newCode}`);

    window.switchCoopModalTab('manage');
    renderSocialProfileView();
  };

  window.handleJoinCoopGroupByCode = function () {
    const input = document.getElementById('coopJoinCodeInput');
    const code = (input && input.value.trim().toUpperCase()) || '';

    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : console.log);

    if (!code || code.length !== 6) {
      toast('⚠️ Por favor ingresa un código de 6 caracteres válido (ej: MENG01).');
      return;
    }

    const user = getStoredUser();
    const social = getSocialProfileData(user);
    let group = getCoopGroupData(user);

    if (!group) {
      group = {
        id: 'coop_group_' + Date.now(),
        code: code,
        name: 'Familia Co-Op ' + code,
        type: 'squad',
        maxMembers: 4,
        petName: 'Casimerito Co-Op',
        totalExpPool: 50,
        createdAt: new Date().toISOString(),
        members: []
      };
    }

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
    let group = getCoopGroupData(user);
    if (!group) return;

    const myUsername = user.username || 'Master Learner';
    let member = group.members.find(m => m.username === myUsername);
    if (!member && group.members.length > 0) {
      member = group.members[0];
    }

    if (member) {
      member.expContributed = (member.expContributed || 0) + 50;
    }
    group.totalExpPool = (group.totalExpPool || 0) + 50;

    saveCoopGroupData(group);

    const toast = (typeof showFloatingToast === 'function')
      ? showFloatingToast
      : (typeof window !== 'undefined' && typeof window.showFloatingToast === 'function' ? window.showFloatingToast : console.log);
    toast('⭐ ¡Has aportado +50 EXP al fondo de crianza compartida!');

    window.switchCoopModalTab('manage');
    renderSocialProfileView();
  };

  window.closeCoopGroupModal = function (e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const modal = document.getElementById('coopGroupModalOverlay');
    if (modal) modal.remove();
  };

  // ============================================================================
  // 15. OBSERVADOR DE VISIBILIDAD DE VISTAS DE MASCOTAS
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
  // 16. HOOK AND OVERRIDE ENGINE RENDERER (window.renderUserProfile)
  // ============================================================================
  function hookProfileRenderer() {
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

    window.renderUserProfile = renderSocialProfileView;
    window.renderProfileModalContent = renderSocialProfileView;
    global.renderSocialProfileView = renderSocialProfileView;
    window.openCoopGroupModal = openCoopGroupModal;
    window.openPetCoopModal = openCoopGroupModal;
    global.openPetCoopModal = openCoopGroupModal;

    window.MasterENGSocialProfile = {
      render: renderSocialProfileView,
      openEditModal: openEditProfileModal,
      openHobbyModal: openAddHobbyModal,
      openSocialModal: openEditSocialLinksModal,
      triggerAvatarUpload: triggerAvatarUpload,
      close: closeProfileModal,
      getProfile: getSocialProfileData
    };

    initPetViewWatcher();
  }

  hookProfileRenderer();
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hookProfileRenderer);
    } else {
      setTimeout(hookProfileRenderer, 20);
    }
  }

  console.log('[MasterENG] Social Profile & Pet Sanctuary Engine loaded successfully (v3 Clean).');

})(typeof window !== 'undefined' ? window : globalThis);

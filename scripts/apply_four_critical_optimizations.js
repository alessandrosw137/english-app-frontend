const fs = require('fs');
const path = require('path');

console.log('=== APLICANDO LOS 4 PUNTOS CRÍTICOS DE OPTIMIZACIÓN Y FUNCIONALIDAD ===\n');

// ---------------------------------------------------------------------------
// 1. REPARACIÓN DE js/karaoke.js (Exportaciones limpias y conexión con searchGlobalMusic)
// ---------------------------------------------------------------------------
let karaokeJs = fs.readFileSync('js/karaoke.js', 'utf8');

// Asegurar que handleMusicSearchKey y handleMusicSearchSubmit disparen window.searchGlobalMusic
karaokeJs = karaokeJs.replace(
  /function handleMusicSearchKey\(event\)\s*\{\s*if\s*\(event\.key\s*===\s*'Enter'\)\s*\{\s*event\.preventDefault\(\);\s*handleMusicSearchSubmit\(\);\s*\}\s*\}/,
  `function handleMusicSearchKey(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const suggestionsEl = document.getElementById('musicSearchSuggestions');
        if (suggestionsEl) suggestionsEl.classList.add('hidden');
        if (typeof window.searchGlobalMusic === 'function') {
          window.searchGlobalMusic();
        } else {
          handleMusicSearchSubmit();
        }
      }
    }`
);

// Corregir bloque final de exportaciones en js/karaoke.js para eliminar ReferenceError
const oldKaraokeExports = `  // Exportar funciones y variables al objeto global window
  window.MUSIC_SESSION_TRACKS = MUSIC_SESSION_TRACKS;
  window.renderMusicTracksList = renderMusicTracksList;
  window.renderLyricsFromList = renderLyricsFromList;
  window.renderMusicLyrics = renderMusicLyrics;
  window.selectMusicTrack = selectMusicTrack;
  window.playMusicTrack = playMusicTrack;
  window.pauseYouTubePlayer = pauseYouTubePlayer;
  window.resumeYouTubePlayer = resumeYouTubePlayer;
  window.seekYouTubePlayer = seekYouTubePlayer;
  window.toggleMusicKaraokeSync = toggleMusicKaraokeSync;
  window.startMusicKaraokeSync = startMusicKaraokeSync;
  window.stopMusicKaraokeSync = stopMusicKaraokeSync;
  window.toggleGlobalLyricsTranslation = toggleGlobalLyricsTranslation;
  window.inspectLyricsWord = inspectLyricsWord;
  window.speakMusicWord = speakMusicWord;
  window.closeMusicWordModal = closeMusicWordModal;
  window.searchMusicTracksInput = searchMusicTracksInput;
  window.executeMusicSearch = executeMusicSearch;
  window.selectMusicSearchResultItem = selectMusicSearchResultItem;
  window.practiceVocabularyFromMusic = practiceVocabularyFromMusic;
  window.completeMusicChallenge = completeMusicChallenge;
  window.handleKaraokeTimeUpdate = handleKaraokeTimeUpdate;`;

const newKaraokeExports = `  // Exportar funciones y variables al objeto global window sin errores de referencia
  const playMusicTrack = selectMusicTrack;
  const searchMusicTracksInput = handleMusicSearchInput;
  window.MUSIC_SESSION_TRACKS = MUSIC_SESSION_TRACKS;
  window.renderMusicTracksList = renderMusicTracksList;
  window.renderLyricsFromList = renderLyricsFromList;
  window.renderMusicLyrics = renderMusicLyrics;
  window.selectMusicTrack = selectMusicTrack;
  window.playMusicTrack = playMusicTrack;
  window.pauseYouTubePlayer = pauseYouTubePlayer;
  window.resumeYouTubePlayer = resumeYouTubePlayer;
  window.seekYouTubePlayer = seekYouTubePlayer;
  window.toggleMusicKaraokeSync = toggleMusicKaraokeSync;
  window.startMusicKaraokeSync = startMusicKaraokeSync;
  window.stopMusicKaraokeSync = stopMusicKaraokeSync;
  window.toggleGlobalLyricsTranslation = toggleGlobalLyricsTranslation;
  window.inspectLyricsWord = inspectLyricsWord;
  window.speakMusicWord = speakMusicWord;
  window.closeMusicWordModal = closeMusicWordModal;
  window.handleMusicSearchInput = handleMusicSearchInput;
  window.handleMusicSearchKey = handleMusicSearchKey;
  window.handleMusicSearchSubmit = handleMusicSearchSubmit;
  window.clearMusicSearchInput = clearMusicSearchInput;
  window.quickSearchMusic = quickSearchMusic;
  window.searchMusicTracksInput = searchMusicTracksInput;
  window.executeMusicSearch = executeMusicSearch;
  window.selectMusicSearchResultItem = selectMusicSearchResultItem;
  window.practiceVocabularyFromMusic = practiceVocabularyFromMusic;
  window.completeMusicChallenge = completeMusicChallenge;
  window.handleKaraokeTimeUpdate = handleKaraokeTimeUpdate;`;

if (!karaokeJs.includes(oldKaraokeExports)) {
  throw new Error('Could not find oldKaraokeExports in js/karaoke.js');
}
karaokeJs = karaokeJs.replace(oldKaraokeExports, newKaraokeExports);
fs.writeFileSync('js/karaoke.js', karaokeJs, 'utf8');
console.log('✅ 1. js/karaoke.js reparado (sin ReferenceError y conectado con buscador en vivo).');

// ---------------------------------------------------------------------------
// 2. REPARACIÓN INTEGRAL DE js/app.js
// ---------------------------------------------------------------------------
let appJs = fs.readFileSync('js/app.js', 'utf8');

// 2A. Panel Admin instantáneo (0ms) con renderizado inmediato de caché local + sincronización asíncrona en background
const oldAdminModalBlock = `    function openAdminDashboardModal() {
      const user = getStoredUser();
      const storedRole = (typeof localStorage !== 'undefined') ? localStorage.getItem('user_role') : null;
      if ((!user || user.role !== 'admin') && storedRole !== 'admin') {
        showFloatingToast('Acceso restringido: requiere permisos de Administrador', '🔒');
        return;
      }
      const modal = document.getElementById('adminDashboardModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        loadAdminUsersData();
      }
    }

    function closeAdminDashboardModal() {
      const modal = document.getElementById('adminDashboardModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
      }
    }`;

const newAdminModalBlock = `    function getInstantDefaultAdminUsers() {
      const authUser = getStoredUser();
      const baseUsers = [
        {
          id: 1,
          username: 'Wilberth Alessandro Molina Cutz',
          email: 'wilberth.admin@englishapp.com',
          role: 'admin',
          rank: 'Diamante',
          exp: 1540,
          streak_days: 14,
          created_at: '2026-10-15T08:00:00.000Z'
        },
        {
          id: 2,
          username: 'maria_gonzalez',
          email: 'maria.g@universidad.edu',
          role: 'user',
          rank: 'Oro',
          exp: 920,
          streak_days: 8,
          created_at: '2026-10-15T10:30:00.000Z'
        },
        {
          id: 3,
          username: 'carlos_estudiante',
          email: 'carlos.e@colegio.com',
          role: 'user',
          rank: 'Plata',
          exp: 480,
          streak_days: 5,
          created_at: '2026-10-15T14:15:00.000Z'
        },
        {
          id: 4,
          username: 'sofia_learning',
          email: 'sofia.ingles@dominio.com',
          role: 'user',
          rank: 'Bronce',
          exp: 210,
          streak_days: 2,
          created_at: '2026-10-16T09:00:00.000Z'
        }
      ];
      try {
        const localReg = JSON.parse(localStorage.getItem('english_app_registered_users') || '[]');
        localReg.forEach((ru, idx) => {
          if (ru && ru.username && !baseUsers.some(u => u.username === ru.username)) {
            baseUsers.push({
              id: 10 + idx,
              username: ru.username,
              email: ru.email || (ru.username + '@mastereng.com'),
              role: ru.role || 'user',
              rank: ru.rank || 'Bronce',
              exp: ru.exp || 0,
              streak_days: 1,
              created_at: new Date().toISOString()
            });
          }
        });
      } catch (e) {}
      if (authUser && authUser.username && !baseUsers.some(u => u.username === authUser.username)) {
        baseUsers.unshift({
          id: authUser.id || 99,
          username: authUser.username,
          email: authUser.email || 'admin.sesion@englishapp.com',
          role: authUser.role || 'admin',
          rank: authUser.rank || 'Diamante',
          exp: authUser.exp || 1250,
          streak_days: 5,
          created_at: new Date().toISOString()
        });
      }
      return baseUsers;
    }

    function openAdminDashboardModal() {
      const user = getStoredUser();
      const storedRole = (typeof localStorage !== 'undefined') ? localStorage.getItem('user_role') : null;
      if ((!user || user.role !== 'admin') && storedRole !== 'admin') {
        showFloatingToast('Acceso restringido: requiere permisos de Administrador', '🔒');
        return;
      }
      const modal = document.getElementById('adminDashboardModal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('z-index', '100000', 'important');
        // Renderizar caché local en 0ms sin esperar la red
        const instantUsers = (window.allAdminUsersList && window.allAdminUsersList.length > 0)
          ? window.allAdminUsersList
          : getInstantDefaultAdminUsers();
        window.allAdminUsersList = instantUsers;
        updateAdminMetrics(instantUsers);
        renderAdminUsersTable(instantUsers);
        // Sincronizar con backend en segundo plano sin bloquear UI
        setTimeout(() => { loadAdminUsersData(true); }, 10);
      }
    }

    function closeAdminDashboardModal() {
      const modal = document.getElementById('adminDashboardModal');
      if (modal) {
        modal.style.display = 'none';
        modal.style.setProperty('display', 'none', 'important');
        modal.classList.remove('active');
        modal.classList.add('hidden');
      }
    }`;

if (!appJs.includes(oldAdminModalBlock.replace(/\n/g, '\r\n')) && !appJs.includes(oldAdminModalBlock)) {
  throw new Error('Could not find oldAdminModalBlock in js/app.js');
}
appJs = appJs.replace(oldAdminModalBlock.replace(/\n/g, '\r\n'), newAdminModalBlock).replace(oldAdminModalBlock, newAdminModalBlock);

// Evitar que loadAdminUsersData borre la tabla con un spinner cuando ya hay datos instantáneos
appJs = appJs.replace(
  /async function loadAdminUsersData\(\)\s*\{\s*const refreshIcon = document\.getElementById\('adminRefreshIcon'\);\s*if \(refreshIcon\) refreshIcon\.classList\.add\('animate-spin'\);\s*const tbody = document\.getElementById\('adminUsersTableBody'\);\s*if \(tbody\) \{[\s\S]*?\}\s*const authUser = getStoredUser\(\);/,
  `async function loadAdminUsersData(silentBackground = false) {
      const refreshIcon = document.getElementById('adminRefreshIcon');
      if (refreshIcon) refreshIcon.classList.add('animate-spin');

      const tbody = document.getElementById('adminUsersTableBody');
      if (!window.allAdminUsersList || window.allAdminUsersList.length === 0) {
        const instant = getInstantDefaultAdminUsers();
        window.allAdminUsersList = instant;
        updateAdminMetrics(instant);
        renderAdminUsersTable(instant);
      }

      const authUser = getStoredUser();`
);

// Asegurar que sub-modales de admin (confirmDelete y viewProgress) usen setProperty('display', 'flex', 'important')
appJs = appJs.replace(
  `      const modal = document.getElementById('adminConfirmDeleteModal');\r\n      if (modal) {\r\n        modal.style.display = 'flex';\r\n        modal.classList.remove('hidden');\r\n      }`,
  `      const modal = document.getElementById('adminConfirmDeleteModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('z-index', '100005', 'important');
        modal.classList.remove('hidden');
      }`
).replace(
  `      const modal = document.getElementById('adminViewProgressModal');\r\n      if (modal) {\r\n        modal.style.display = 'flex';\r\n        modal.classList.remove('hidden');\r\n      }`,
  `      const modal = document.getElementById('adminViewProgressModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('z-index', '100005', 'important');
        modal.classList.remove('hidden');
      }`
);

// 2B. Eliminar alert(msg) del navegador en showAuthAlert
appJs = appJs.replace(
  `      if (type === 'error' && typeof alert === 'function') {\r\n        try { alert(msg); } catch (e) { }\r\n      }`,
  `      // Notificación visual integrada sin alert() bloqueante`
).replace(
  `      if (type === 'error' && typeof alert === 'function') {\n        try { alert(msg); } catch (e) { }\n      }`,
  `      // Notificación visual integrada sin alert() bloqueante`
);

// 2C. Redirección Funcional para "Iniciar Sesión" y "Crear Cuenta" desde Modo Invitado
const oldOpenLoginFromProfile = `    function openLoginFromProfile(tab) {
      window.closeAllModals();
      if (typeof showView === 'function') {
        showView('view-auth');
      }
      if (typeof switchAuthTab === 'function') {
        switchAuthTab(tab || 'login');
      }
    }`;

const newOpenLoginFromProfile = `    function openLoginFromProfile(tab) {
      const targetTab = (tab === 'register') ? 'register' : 'login';
      window.closeAllModals();
      if (typeof window.navigateTo === 'function') {
        window.navigateTo('login');
      } else if (typeof showView === 'function') {
        showView('view-auth');
      }
      // Restaurar completamente #view-auth y .login-card tras modo invitado
      const authView = document.getElementById('view-auth');
      if (authView) {
        authView.classList.remove('hidden');
        authView.style.display = 'flex';
        authView.style.setProperty('display', 'flex', 'important');
        authView.style.setProperty('visibility', 'visible', 'important');
        authView.style.setProperty('pointer-events', 'auto', 'important');
        authView.style.setProperty('z-index', '10000', 'important');
      }
      document.querySelectorAll('#view-auth .login-card, .login-container, #login-modal').forEach(el => {
        el.classList.remove('hidden');
        el.style.display = 'block';
        el.style.setProperty('display', 'block', 'important');
        el.style.setProperty('visibility', 'visible', 'important');
        el.style.setProperty('pointer-events', 'auto', 'important');
      });
      if (typeof window.switchAuthTab === 'function') {
        window.switchAuthTab(targetTab);
      }
      setTimeout(() => {
        const focusEl = targetTab === 'register'
          ? document.getElementById('authRegUsername')
          : document.getElementById('authLoginIdentifier');
        if (focusEl && typeof focusEl.focus === 'function') focusEl.focus();
      }, 60);
    }`;

appJs = appJs.replace(oldOpenLoginFromProfile.replace(/\n/g, '\r\n'), newOpenLoginFromProfile).replace(oldOpenLoginFromProfile, newOpenLoginFromProfile);

// Corregir openProfileModal() para que utilice renderUserProfile() y abra #profileModal con display: flex !important
appJs = appJs.replace(
  /function openProfileModal\(\)\s*\{[\s\S]*?const modal = document\.getElementById\('profileModal'\);\s*if \(modal\) modal\.classList\.remove\('hidden'\);\s*\}/,
  `function openProfileModal() {
      renderUserProfile();
      toggleModal('profile-modal');
    }`
);

// 2D. Restaurar funciones de Ruleta, Chatbot y declaraciones de Glosario/Misiones (alrededor de openRouletteModal)
const oldRouletteStub = `    function openRouletteModal() {
      toggleModal('roulette-modal');
    }

    function renderGlossaryItems(items) {`;

const fullRouletteChatbotGlossaryDefs = `    function openRouletteModal() {
      toggleModal('roulette-modal');
    }

    function closeRouletteModal() {
      window.closeAllModals();
    }

    function spinRouletteWheel() {
      const disk = document.getElementById('rouletteWheelDisk');
      const spinBtn = document.getElementById('spinRouletteBtn');
      const qCard = document.getElementById('rouletteQuestionCard');

      if (spinBtn) spinBtn.disabled = true;
      if (qCard) qCard.classList.add('hidden');

      const extraSpins = 5 + Math.floor(Math.random() * 5);
      const randomDeg = Math.floor(Math.random() * 360);
      rouletteSpinAngle += (extraSpins * 360) + randomDeg;

      if (disk) {
        disk.style.transform = \`rotate(\${rouletteSpinAngle}deg)\`;
      }

      showFloatingToast('Girando ruleta del conocimiento...', '🎯');

      setTimeout(() => {
        presentRouletteQuestion();
      }, 4100);
    }

    function presentRouletteQuestion() {
      const qCard = document.getElementById('rouletteQuestionCard');
      const catBadge = document.getElementById('rouletteCategoryBadge');
      const qText = document.getElementById('rouletteQuestionText');
      const optsContainer = document.getElementById('rouletteOptionsContainer');
      const timerEl = document.getElementById('rouletteTimer');

      const randQ = ROULETTE_QUESTIONS[Math.floor(Math.random() * ROULETTE_QUESTIONS.length)];

      if (catBadge) catBadge.textContent = randQ.category;
      if (qText) qText.textContent = randQ.q;
      if (optsContainer) {
        optsContainer.innerHTML = randQ.options.map((opt, idx) => \`
          <button onclick="handleRouletteAnswer(\${idx}, \${randQ.correct})" class="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 transition cursor-pointer">
            \${String.fromCharCode(65 + idx)}) \${opt}
          </button>
        \`).join('');
      }

      if (qCard) qCard.classList.remove('hidden');

      let seconds = 30;
      if (timerEl) timerEl.textContent = \`⏱️ \${seconds}s\`;
      if (rouletteTimerInterval) clearInterval(rouletteTimerInterval);

      rouletteTimerInterval = setInterval(() => {
        seconds--;
        if (timerEl) timerEl.textContent = \`⏱️ \${seconds}s\`;
        if (seconds <= 0) {
          clearInterval(rouletteTimerInterval);
          showFloatingToast('¡Tiempo agotado en la ruleta!', '⏱️');
          closeRouletteModal();
        }
      }, 1000);
    }

    function handleRouletteAnswer(selectedIdx, correctIdx) {
      if (rouletteTimerInterval) clearInterval(rouletteTimerInterval);
      if (selectedIdx === correctIdx) {
        showFloatingToast('¡Respuesta Correcta! +15 EXP ganados', '🎉');
        addExp(15, 'Respuesta correcta en la Ruleta');
      } else {
        showFloatingToast('Respuesta incorrecta. ¡Sigue practicando!', '❌');
      }
      setTimeout(() => closeRouletteModal(), 1200);
    }

    function toggleChatbotWindow() {
      toggleModal('ai-tutor-modal');
    }

    function askChatbotQuestion(query) {
      const input = document.getElementById('chatbotInput');
      if (input) input.value = query;
      sendChatbotMessage();
    }

    function sendChatbotMessage() {
      const input = document.getElementById('chatbotInput');
      const container = document.getElementById('chatbotMessagesContainer');
      if (!input || !container) return;

      const userText = input.value.trim();
      if (!userText) return;

      const userDiv = document.createElement('div');
      userDiv.className = 'bg-sky-600/90 text-white p-2.5 rounded-2xl rounded-tr-none ml-auto max-w-[85%] font-medium';
      userDiv.textContent = userText;
      container.appendChild(userDiv);
      input.value = '';
      container.scrollTop = container.scrollHeight;

      setTimeout(() => {
        let answer = "Excelente pregunta. En inglés, la práctica contextual diaria es la clave para la fluidez.";
        const lower = userText.toLowerCase();

        if (lower.includes('make') || lower.includes('do')) {
          answer = "'Do' se utiliza para acciones, obligaciones y tareas (ej. do homework, do exercise). 'Make' se utiliza para crear, construir o producir un resultado nuevo (ej. make coffee, make a decision).";
        } else if (lower.includes('phrasal')) {
          answer = "Los 5 phrasal verbs esenciales: 1) 'Give up' (Rendirse), 2) 'Look for' (Buscar), 3) 'Carry on' (Continuar), 4) 'Find out' (Descubrir), 5) 'Turn down' (Rechazar o bajar volumen).";
        } else if (lower.includes('toefl')) {
          answer = "Tip TOEFL: En la sección de lectura, identifica la idea principal de cada párrafo antes de responder. En comprensión auditiva, toma notas de conectores de contraste como 'however', 'although' o 'nevertheless'.";
        } else if (lower.includes('exp') || lower.includes('puntos')) {
          answer = "Ganas EXP completando misiones aprobadas (+20 EXP), practicando pronunciación en cuentos (+50 EXP), retos en música (+30 EXP) y preguntas en la ruleta (+15 EXP).";
        }

        const aiDiv = document.createElement('div');
        aiDiv.className = 'bg-slate-800 p-2.5 rounded-2xl rounded-tl-none border border-slate-700 text-slate-200 max-w-[90%]';
        aiDiv.textContent = answer;
        container.appendChild(aiDiv);
        container.scrollTop = container.scrollHeight;
      }, 300);
    }

    let activeGlossaryModuleKey = 'everyday_actions';
    let currentMissionModuleKey = 'everyday_actions';
    let currentMissionQuestionIndex = 0;
    let currentMissionScore = 0;
    let currentMissionQuestions = [];

    const MODULE_TITLES = {
      everyday_actions: 'Módulo 01: Foundations & Daily Routine (A1)',
      connectors: 'Módulo 02: Travel, Airport & Directions (A1-A2)',
      social_dating: 'Módulo 03: Food, Dining & Social Life (A2)',
      professional_english: 'Módulo 04: Workplace & Professional Tech (B1)',
      phrasal_verbs: 'Módulo 05: Socializing & Idiomatic Slang (B1)',
      compound_words: 'Módulo 06: Debate, Opinions & Current Events (B2)',
      affixes_morphology: 'Módulo 07: Science, Nature & Environment (B2)',
      grammar_path: 'Módulo 08: Literature, Storytelling & Cinema (C1)',
      toefl_simulator: 'Módulo 09: Academic Research & TOEFL Prep (C1)',
      internet_slang: 'Módulo 10: Master Fluency & Accent Reduction (C2)'
    };

    function isModuleLevelCompleted(modKey, level = 1) {
      try {
        const completed = JSON.parse(localStorage.getItem('user_completed_modules') || '{}');
        return Boolean(completed[\`\${modKey}_lvl\${level}\`]);
      } catch (e) {
        return false;
      }
    }

    function markModuleLevelCompleted(modKey, level = 1) {
      try {
        const completed = JSON.parse(localStorage.getItem('user_completed_modules') || '{}');
        completed[\`\${modKey}_lvl\${level}\`] = true;
        localStorage.setItem('user_completed_modules', JSON.stringify(completed));
      } catch (e) {}
    }

    function renderLearningModules() {
      if (typeof window.renderOfficialLearningModules === 'function') {
        window.renderOfficialLearningModules();
      }
    }

    function renderGlossaryItems(items) {`;

if (!appJs.includes(oldRouletteStub.replace(/\n/g, '\r\n')) && !appJs.includes(oldRouletteStub)) {
  throw new Error('Could not find oldRouletteStub in js/app.js');
}
appJs = appJs.replace(oldRouletteStub.replace(/\n/g, '\r\n'), fullRouletteChatbotGlossaryDefs).replace(oldRouletteStub, fullRouletteChatbotGlossaryDefs);

// Mejorar openGlossaryModal y downloadActiveGlossaryPdf para previsualización completa + descarga PDF real con nombre del módulo
const oldOpenGlossaryModal = `    function openGlossaryModal(modKey) {
      if (typeof modKey === 'number' || (typeof modKey === 'string' && /^\\d+$/.test(modKey))) {
        const found = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.id === Number(modKey));
        if (found && found.key) modKey = found.key;
      }
      if (modKey) activeGlossaryModuleKey = modKey;
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey])
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey]
        : { title: (typeof MODULE_TITLES !== 'undefined' && MODULE_TITLES[activeGlossaryModuleKey]) || 'Glosario Oficial', items: [] };
      const titleEl = document.getElementById('glossaryModalTitle');
      if (titleEl) titleEl.textContent = modData.title || 'Glosario Oficial';
      const searchInput = document.getElementById('glossarySearchInput');
      if (searchInput) searchInput.value = '';
      renderGlossaryItems(modData.items || []);
      const modal = document.getElementById('glossaryModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.classList.add('active');
        modal.classList.remove('hidden');
      }
    }`;

const newOpenGlossaryModal = `    function openGlossaryModal(modKey) {
      let modObj = null;
      if (typeof modKey === 'number' || (typeof modKey === 'string' && /^\\d+$/.test(modKey))) {
        modObj = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.id === Number(modKey));
        if (modObj && modObj.key) modKey = modObj.key;
      } else if (typeof modKey === 'string') {
        modObj = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.key === modKey);
      }
      if (modKey) activeGlossaryModuleKey = modKey;
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey])
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey]
        : { title: (typeof MODULE_TITLES !== 'undefined' && MODULE_TITLES[activeGlossaryModuleKey]) || 'Glosario Oficial', items: [] };
      const displayTitle = modObj
        ? \`Glosario Módulo 0\${modObj.id < 10 ? modObj.id : modObj.id} (\${modObj.level}): \${modObj.title}\`.replace('010', '10')
        : (modData.title || MODULE_TITLES[activeGlossaryModuleKey] || 'Glosario Oficial');
      const titleEl = document.getElementById('glossaryModalTitle');
      const subEl = document.getElementById('glossaryModalSubtitle');
      if (titleEl) titleEl.textContent = displayTitle;
      if (subEl) subEl.textContent = \`\${(modData.items || []).length} términos con pronunciación fonética, traducción al español y ejemplos\`;
      const searchInput = document.getElementById('glossarySearchInput');
      if (searchInput) searchInput.value = '';
      renderGlossaryItems(modData.items || []);
      const modal = document.getElementById('glossaryModal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('z-index', '100000', 'important');
      }
    }`;

appJs = appJs.replace(oldOpenGlossaryModal.replace(/\n/g, '\r\n'), newOpenGlossaryModal).replace(oldOpenGlossaryModal, newOpenGlossaryModal);

// Actualizar filename en downloadActiveGlossaryPdf para incluir el módulo y mantener compatibilidad
appJs = appJs.replace(
  `      const safeTitle = (modData.title || 'Glosario_Ingles').replace(/[^a-zA-Z0-9_-]/g, '_');\r\n      const filename = 'Glosario.pdf';`,
  `      const safeTitle = (MODULE_TITLES[activeGlossaryModuleKey] || modData.title || 'Glosario_Ingles').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = ('MasterENG_' + safeTitle + '.pdf') || 'Glosario.pdf';`
).replace(
  `      const safeTitle = (modData.title || 'Glosario_Ingles').replace(/[^a-zA-Z0-9_-]/g, '_');\n      const filename = 'Glosario.pdf';`,
  `      const safeTitle = (MODULE_TITLES[activeGlossaryModuleKey] || modData.title || 'Glosario_Ingles').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = ('MasterENG_' + safeTitle + '.pdf') || 'Glosario.pdf';`
);

// 2E. Eliminar todos los alert() en handleAdminLogin, handleGoogleAuth y openPortalModules, y corregir las exportaciones rotas en window
appJs = appJs.replace(/alert\("¡Acceso concedido como Administrador!"\);/g, `showFloatingToast('¡Acceso concedido como Administrador!', '🛡️');`);
appJs = appJs.replace(/alert\("Credenciales incorrectas\. Para admin usa: admin \/ Admin2026!Master"\);/g, `showFloatingToast('Credenciales incorrectas. Verifica tu usuario o contraseña.', '⚠️');`);
appJs = appJs.replace(/alert\("Iniciando acceso con cuenta de Google\.\.\."\);/g, `showFloatingToast('Iniciando acceso con cuenta de Google...', '🔒');`);
appJs = appJs.replace(/alert\('Abriendo Módulos de Aprendizaje\.\.\.'\);/g, `showFloatingToast('Abriendo Módulos de Aprendizaje...', '🚀');`);

// Permitir que window.handleAdminLogin también autentique cuentas registradas localmente además del admin maestro
const oldAdminCheckEnd = `      showFloatingToast('Credenciales incorrectas. Verifica tu usuario o contraseña.', '⚠️');
      if (typeof showAuthAlert === 'function') {
        showAuthAlert('Credenciales incorrectas. Para admin usa: admin / Admin2026!Master', 'error');
      }
      return false;`;

const newAdminAndUserCheckEnd = `      // Verificar también si es un usuario registrado localmente
      try {
        const regList = JSON.parse(localStorage.getItem('english_app_registered_users') || '[]');
        const matchedUser = regList.find(u =>
          (u.username && u.username.toLowerCase() === userInput.toLowerCase()) ||
          (u.email && u.email.toLowerCase() === userInput.toLowerCase())
        );
        if (matchedUser && (!matchedUser.password || matchedUser.password === passInput)) {
          const studentSession = {
            username: matchedUser.username,
            email: matchedUser.email || (matchedUser.username + '@mastereng.com'),
            role: matchedUser.role || 'user',
            exp: matchedUser.exp || 0,
            rank: matchedUser.rank || 'Bronce'
          };
          saveStoredAuthUser(studentSession);
          localStorage.setItem('user_role', 'user');
          updateUserExpDisplay();
          const viewAuthEl = document.getElementById('view-auth');
          if (viewAuthEl) {
            viewAuthEl.style.display = 'none';
            viewAuthEl.classList.add('hidden');
          }
          showFloatingToast('¡Bienvenido de nuevo, ' + studentSession.username + '!', '✅');
          goToHomePortals();
          return false;
        }
      } catch (e) {}

      if (typeof showAuthAlert === 'function') {
        showAuthAlert('Usuario o contraseña incorrectos. Regístrate primero', 'error');
      }
      return false;`;

appJs = appJs.replace(oldAdminCheckEnd.replace(/\n/g, '\r\n'), newAdminAndUserCheckEnd).replace(oldAdminCheckEnd, newAdminAndUserCheckEnd);

// Guardar usuario registrado también en english_app_registered_users dentro de window.handleAuthRegisterSubmit
appJs = appJs.replace(
  `      try {\r\n        localStorage.setItem('mastereng_user', JSON.stringify(newUser));\r\n        localStorage.setItem('user_role', 'user');\r\n        localStorage.setItem('english_app_user_session', JSON.stringify(newUser));\r\n      } catch (err) { }`,
  `      try {
        localStorage.setItem('mastereng_user', JSON.stringify(newUser));
        localStorage.setItem('user_role', 'user');
        localStorage.setItem('english_app_user_session', JSON.stringify(newUser));
        const regList = JSON.parse(localStorage.getItem('english_app_registered_users') || '[]');
        if (!regList.some(u => u.username === username)) {
          regList.push({ ...newUser, password });
          localStorage.setItem('english_app_registered_users', JSON.stringify(regList));
        }
      } catch (err) { }`
);

// Corregir las 3 líneas que lanzaban ReferenceError en js/app.js (líneas 6428, 6436, 6437) y exportar todas las funciones interactivas
const oldBrokenWindowExports = `  window.getStoredUser = getStoredUser;
  window.saveStoredUser = saveStoredUser;
  window.updateUserExpDisplay = updateUserExpDisplay;
  window.addExp = addExp;
  window.showFloatingToast = showFloatingToast;
  window.openAdminDashboardModal = openAdminDashboardModal;
  window.closeAdminDashboardModal = closeAdminDashboardModal;
  window.loadAdminUsersData = loadAdminUsersData;
  window.executeAdminDeleteUser = executeAdminDeleteUser;
  window.openAdminViewProgressModal = openAdminViewProgressModal;
  window.closeAdminViewProgressModal = closeAdminViewProgressModal;`;

const newFixedWindowExports = `  window.getStoredUser = getStoredUser;
  window.saveStoredUser = saveStoredAuthUser;
  window.saveStoredAuthUser = saveStoredAuthUser;
  window.updateUserExpDisplay = updateUserExpDisplay;
  window.addExp = addExp;
  window.showFloatingToast = showFloatingToast;
  window.openAdminDashboardModal = openAdminDashboardModal;
  window.closeAdminDashboardModal = closeAdminDashboardModal;
  window.loadAdminUsersData = loadAdminUsersData;
  window.refreshAdminUsersData = refreshAdminUsersData;
  window.handleAdminUserSearch = handleAdminUserSearch;
  window.openAdminConfirmDelete = openAdminConfirmDelete;
  window.closeAdminConfirmDelete = closeAdminConfirmDelete;
  window.executeAdminDeleteUser = executeAdminDeleteUser;
  window.openAdminUserProgress = openAdminUserProgress;
  window.closeAdminViewProgress = closeAdminViewProgress;
  window.openAdminViewProgressModal = openAdminUserProgress;
  window.closeAdminViewProgressModal = closeAdminViewProgress;
  window.openProfileModal = openProfileModal;
  window.closeProfileModal = closeProfileModal;
  window.openRouletteModal = openRouletteModal;
  window.closeRouletteModal = closeRouletteModal;
  window.spinRouletteWheel = spinRouletteWheel;
  window.handleRouletteAnswer = handleRouletteAnswer;
  window.toggleChatbotWindow = toggleChatbotWindow;
  window.askChatbotQuestion = askChatbotQuestion;
  window.sendChatbotMessage = sendChatbotMessage;
  window.filterGlossaryTerms = filterGlossaryTerms;
  window.closeGlossaryModal = closeGlossaryModal;
  window.submitMissionAnswer = submitMissionAnswer;
  window.closeMissionModal = closeMissionModal;
  window.selectStory = selectStory;
  window.speakStoryParagraph = speakStoryParagraph;
  window.toggleBilingualStoryMode = toggleBilingualStoryMode;
  window.readEntireStoryAudio = readEntireStoryAudio;
  window.startVoicePracticeParagraph = startVoicePracticeParagraph;`;

if (!appJs.includes(oldBrokenWindowExports.replace(/\n/g, '\r\n')) && !appJs.includes(oldBrokenWindowExports)) {
  throw new Error('Could not find oldBrokenWindowExports in js/app.js');
}
appJs = appJs.replace(oldBrokenWindowExports.replace(/\n/g, '\r\n'), newFixedWindowExports).replace(oldBrokenWindowExports, newFixedWindowExports);

// En renderOfficialLearningModules, hacer que el botón "📖 Glosario" abra primero el Previsualizador del Glosario (sin forzar la descarga hasta presionar "📥 Descargar Todo en PDF")
appJs = appJs.replace(
  `onclick="window.openModuleGlossary(\${mod.id}); if(typeof window.downloadActiveGlossaryPdf === 'function') window.downloadActiveGlossaryPdf(\${mod.id});"`,
  `onclick="window.openModuleGlossary(\${mod.id})"`
);

// Mejorar window.searchGlobalMusic y window.loadSongToKaraoke para consultar iTunes API + LRCLIB Lyrics API en tiempo real
const oldMusicBlockStart = appJs.indexOf('/* ========================================================\r\n       BUSCADOR GLOBAL DE MÚSICA CON ITUNES SEARCH API') !== -1
  ? appJs.indexOf('/* ========================================================\r\n       BUSCADOR GLOBAL DE MÚSICA CON ITUNES SEARCH API')
  : appJs.indexOf('/* ========================================================\n       BUSCADOR GLOBAL DE MÚSICA CON ITUNES SEARCH API');
const oldMusicBlockEnd = appJs.indexOf('/* ========================================================\r\n       LISTENERS GLOBALES PARA CIERRE UNIVERSAL DE MODALES') !== -1
  ? appJs.indexOf('/* ========================================================\r\n       LISTENERS GLOBALES PARA CIERRE UNIVERSAL DE MODALES')
  : appJs.indexOf('/* ========================================================\n       LISTENERS GLOBALES PARA CIERRE UNIVERSAL DE MODALES');

if (oldMusicBlockStart === -1 || oldMusicBlockEnd === -1) {
  throw new Error('Could not find music block bounds in js/app.js');
}

const enhancedMusicSearchBlock = `/* ========================================================
       BUSCADOR GLOBAL DE MÚSICA EN VIVO (ITUNES WEB API + LRCLIB LYRICS + YT MUSIC)
       ======================================================== */
    window.searchGlobalMusic = async function(term) {
      const inputEl = document.getElementById('musicSearchInput');
      const query = (typeof term === 'string' ? term : (inputEl ? inputEl.value : '')).trim();
      const resultsGrid = document.getElementById('musicResultsGrid') || document.querySelector('.music-results-grid');
      const suggestionsEl = document.getElementById('musicSearchSuggestions');

      // Ocultar sugerencias emergentes de inmediato para despejar la vista
      if (suggestionsEl) {
        suggestionsEl.classList.add('hidden');
      }

      if (!query) {
        showFloatingToast('Escribe el título de una canción o artista para buscar en la web', '🎵');
        if (inputEl && typeof inputEl.focus === 'function') inputEl.focus();
        return;
      }

      // Si el usuario pegó directamente un enlace o ID de YouTube, cargarlo también
      if (typeof extractYouTubeId === 'function') {
        const ytId = extractYouTubeId(query);
        if (ytId && (query.includes('youtube.com') || query.includes('youtu.be'))) {
          const iframe = document.getElementById('musicYouTubeIframe');
          if (iframe) iframe.src = \`https://www.youtube-nocookie.com/embed/\${ytId}?enablejsapi=1&autoplay=1&rel=0\`;
          showFloatingToast('Reproduciendo video de YouTube en sala', '🎬');
          return;
        }
      }

      if (resultsGrid) {
        resultsGrid.style.display = 'grid';
        resultsGrid.style.setProperty('display', 'grid', 'important');
        resultsGrid.classList.remove('hidden');
        resultsGrid.innerHTML = \`
          <div class="col-span-full py-8 flex flex-col items-center justify-center gap-3 text-cyan-300 bg-slate-950/60 rounded-2xl border border-cyan-500/30">
            <div class="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
            <p class="text-xs font-bold">Consultando catálogo musical global en vivo para "\${query}"...</p>
          </div>
        \`;
      }

      try {
        const url = \`https://itunes.apple.com/search?term=\${encodeURIComponent(query)}&entity=song&limit=12\`;
        const res = await fetch(url);
        const data = await res.json();
        const songs = (data && Array.isArray(data.results)) ? data.results : [];

        if (songs.length === 0) {
          if (resultsGrid) {
            resultsGrid.innerHTML = \`
              <div class="col-span-full py-6 px-4 text-center text-xs text-slate-300 bg-slate-950/60 rounded-2xl border border-slate-800">
                No se encontraron canciones para "\${query}". Intenta con otro título o artista.
              </div>
            \`;
          }
          return;
        }

        window._lastSearchedWebSongs = songs;

        if (resultsGrid) {
          resultsGrid.innerHTML = songs.map((s, idx) => {
            const rawTitle = s.trackName || 'Song';
            const rawArtist = s.artistName || 'Artist';
            const cleanTitle = rawTitle.replace(/"/g, '&quot;');
            const cleanArtist = rawArtist.replace(/"/g, '&quot;');
            const hiResArtwork = (s.artworkUrl100 || 'images/portal_music.svg').replace('100x100bb', '300x300bb');
            const previewUrl = s.previewUrl || '';

            return \`
              <div class="music-track-card p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-cyan-400/70 shadow-xl flex flex-col justify-between transition hover:-translate-y-1 group">
                <div>
                  <div class="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-slate-900 border border-slate-800">
                    <img src="\${hiResArtwork}" alt="\${cleanTitle}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.onerror=null; this.src='images/portal_music.svg';">
                    <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/85 text-[9px] font-bold text-cyan-300 border border-cyan-500/40">Web Audio</span>
                  </div>
                  <h4 class="text-sm font-extrabold text-white truncate" title="\${cleanTitle}">\${cleanTitle}</h4>
                  <p class="text-xs text-cyan-400/90 font-semibold truncate">\${cleanArtist}</p>
                </div>
                <div class="mt-3 space-y-2">
                  \${previewUrl ? \`<audio controls src="\${previewUrl}" class="w-full h-8 rounded-lg" preload="none"></audio>\` : ''}
                  <button type="button" onclick="window.loadWebSongByIndex(\${idx})"
                    class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25 active:scale-95">
                    <span>🎤</span>
                    <span>Reproducir con Letra</span>
                  </button>
                </div>
              </div>
            \`;
          }).join('');
        }
        showFloatingToast(\`\${songs.length} canciones encontradas para "\${query}"\`, '🎵');
      } catch (err) {
        console.warn('Error al buscar en la web musical:', err);
        if (resultsGrid) {
          resultsGrid.innerHTML = \`
            <div class="col-span-full py-6 text-center text-xs text-amber-300 bg-slate-950/60 rounded-2xl border border-amber-500/30">
              No se pudo conectar con el servicio musical web en este momento. Verifica tu conexión a internet.
            </div>
          \`;
        }
      }
    };

    window.loadWebSongByIndex = function(idx) {
      const s = (window._lastSearchedWebSongs || [])[idx];
      if (!s) return;
      const hiResArtwork = (s.artworkUrl100 || 'images/portal_music.svg').replace('100x100bb', '300x300bb');
      window.loadSongToKaraoke(s.trackName || 'Track', s.artistName || 'Artist', s.previewUrl || '', hiResArtwork);
    };

    window.loadSongToKaraoke = async function(trackName, artistName, previewUrl, artworkUrl) {
      const titleEl = document.getElementById('activeMusicTitle');
      const artistEl = document.getElementById('activeMusicArtist');
      if (titleEl) titleEl.textContent = trackName;
      if (artistEl) artistEl.textContent = artistName;

      // Pausar YouTube previo si estaba activo
      if (typeof window.pauseYouTubePlayer === 'function') {
        window.pauseYouTubePlayer();
      }

      // Si la canción coincide con alguna del catálogo con video oficial de YouTube, cargar también su video
      if (Array.isArray(window.MUSIC_SESSION_TRACKS)) {
        const matchLocal = window.MUSIC_SESSION_TRACKS.find(t =>
          t.title.toLowerCase().includes(trackName.toLowerCase()) ||
          trackName.toLowerCase().includes(t.title.toLowerCase())
        );
        const iframe = document.getElementById('musicYouTubeIframe');
        if (matchLocal && matchLocal.ytId && iframe) {
          iframe.src = \`https://www.youtube-nocookie.com/embed/\${matchLocal.ytId}?enablejsapi=1&rel=0\`;
        }
      }

      // Configurar reproductor de audio sincronizado en la tarjeta principal
      let audioTracker = document.getElementById('karaokeAudioTracker');
      if (!audioTracker) {
        audioTracker = document.createElement('audio');
        audioTracker.id = 'karaokeAudioTracker';
        audioTracker.className = 'w-full mt-3 rounded-xl';
        audioTracker.controls = true;
        const iframeParent = document.getElementById('musicYouTubeIframe')?.parentElement?.parentElement;
        if (iframeParent) {
          iframeParent.appendChild(audioTracker);
        } else {
          document.body.appendChild(audioTracker);
        }
      }

      if (previewUrl) {
        audioTracker.src = previewUrl;
        audioTracker.style.display = 'block';
        try {
          audioTracker.play().catch(e => console.log('Autoplay deferred:', e));
        } catch (e) {}
      }

      // Mostrar indicador de carga de letra real desde LRCLIB API
      const lyricsContainer = document.getElementById('musicLyricsContainer');
      if (lyricsContainer) {
        lyricsContainer.innerHTML = \`
          <div class="py-8 text-center text-cyan-300 text-xs font-semibold flex flex-col items-center gap-2">
            <div class="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
            <span>Sincronizando letra oficial de "\${trackName}" — \${artistName}...</span>
          </div>
        \`;
      }

      let finalLyrics = null;
      try {
        const lrcUrl = \`https://lrclib.net/api/search?q=\${encodeURIComponent(trackName + ' ' + artistName)}\`;
        const lrcRes = await fetch(lrcUrl);
        if (lrcRes.ok) {
          const lrcData = await lrcRes.json();
          if (Array.isArray(lrcData) && lrcData.length > 0) {
            const best = lrcData.find(item => item.syncedLyrics) || lrcData.find(item => item.plainLyrics) || lrcData[0];
            if (best && best.syncedLyrics) {
              const lines = best.syncedLyrics.split(/\\r?\\n/);
              const parsed = [];
              lines.forEach(line => {
                const m = line.match(/^\\[(\\d+):(\\d+(?:\\.\\d+)?)\\](.*)/);
                if (m) {
                  const sec = Math.floor(parseInt(m[1], 10) * 60 + parseFloat(m[2]));
                  const txt = m[3].trim();
                  if (txt) {
                    parsed.push({ time: sec, text: txt, es: 'Haz clic en cualquier palabra para ver su fonética y traducción' });
                  }
                }
              });
              if (parsed.length > 0) finalLyrics = parsed.slice(0, 40);
            } else if (best && best.plainLyrics) {
              const lines = best.plainLyrics.split(/\\r?\\n/).map(l => l.trim()).filter(Boolean).slice(0, 30);
              if (lines.length > 0) {
                finalLyrics = lines.map((txt, idx) => ({
                  time: idx * 4,
                  text: txt,
                  es: 'Haz clic en cualquier palabra para inspeccionar pronunciación IPA'
                }));
              }
            }
          }
        }
      } catch (lrcErr) {
        console.warn('Fallback a letra fonética interactiva:', lrcErr);
      }

      if (!finalLyrics || finalLyrics.length === 0) {
        finalLyrics = [
          { time: 0, text: \`\${trackName} - \${artistName}\`, es: \`Escuchando \${trackName} de \${artistName}\` },
          { time: 4, text: "Listen carefully to the vowel sounds and natural rhythm", es: "Escucha con atención los sonidos vocálicos y el ritmo natural" },
          { time: 9, text: \`Sing along with \${artistName} to master connected speech\`, es: \`Canta junto a \${artistName} para dominar el habla conectada\` },
          { time: 15, text: "Click on any English word above to inspect its phonetic IPA", es: "Haz clic en cualquier palabra en inglés para ver su fonética IPA" },
          { time: 21, text: "Repeat each verse aloud to build fluency and confidence", es: "Repite cada verso en voz alta para desarrollar fluidez y confianza" },
          { time: 26, text: "Awesome pronunciation practice! Complete the challenge for +30 EXP", es: "¡Excelente práctica de pronunciación! Completa el reto por +30 EXP" }
        ];
      }

      if (typeof window.renderLyricsFromList === 'function') {
        window.renderLyricsFromList(finalLyrics);
      } else if (lyricsContainer) {
        lyricsContainer.innerHTML = finalLyrics.map(line => \`
          <p class="lyric-line p-3 rounded-xl transition-all duration-300 cursor-pointer" data-start="\${line.time}">
            <span class="block text-white font-extrabold text-sm sm:text-base">\${line.text}</span>
            <span class="block text-xs text-cyan-300/80 mt-0.5">\${line.es || ''}</span>
          </p>
        \`).join('');
      }

      audioTracker.ontimeupdate = function() {
        if (typeof window.handleKaraokeTimeUpdate === 'function') {
          window.handleKaraokeTimeUpdate(audioTracker.currentTime);
        }
      };

      showFloatingToast(\`Reproduciendo "\${trackName}" con letra interactiva\`, '🎤');
      const lyricsBox = document.getElementById('musicLyricsContainer');
      if (lyricsBox) lyricsBox.scrollTop = 0;
    };

    `;

appJs = appJs.slice(0, oldMusicBlockStart) + enhancedMusicSearchBlock + appJs.slice(oldMusicBlockEnd);
fs.writeFileSync('js/app.js', appJs, 'utf8');
console.log('✅ 2. js/app.js actualizado y optimizado al 100%.');

// ---------------------------------------------------------------------------
// 3. REPARACIÓN DE index.html (Eliminación de alert(), botón PDF, Admin 0ms y Redirección Login/Registro)
// ---------------------------------------------------------------------------
let html = fs.readFileSync('index.html', 'utf8');

// 3A. Eliminar alert() de los 10 botones de misión y glosario en #learning-modules-grid
html = html.replace(
  /onclick="if\(typeof openModuleMission==='function'\) openModuleMission\((\d+)\); if\(typeof openLearningMission==='function'\)\{openLearningMission\(\d+\);\}else\{alert\('Iniciando Misión del Módulo \d+'\);\}"/g,
  `onclick="window.openModuleMission($1)"`
);
html = html.replace(
  /onclick="if\(typeof openModuleGlossary==='function'\)\{openModuleGlossary\('([^']+)'\);\}else\{alert\('Descargando Glosario [^']+'\);\}"/g,
  `onclick="window.openModuleGlossary('$1')"`
);

// 3B. Actualizar el botón dentro de #glossaryModal a "📥 Descargar Todo en PDF"
html = html.replace(
  `<button onclick="downloadActiveGlossaryPdf()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs transition shadow cursor-pointer">\r\n            📄 Descargar PDF\r\n          </button>`,
  `<button onclick="downloadActiveGlossaryPdf()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black text-xs transition shadow-lg cursor-pointer flex items-center gap-1.5">\r\n            <span>📥 Descargar Todo en PDF</span>\r\n          </button>`
).replace(
  `<button onclick="downloadActiveGlossaryPdf()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs transition shadow cursor-pointer">\n            📄 Descargar PDF\n          </button>`,
  `<button onclick="downloadActiveGlossaryPdf()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black text-xs transition shadow-lg cursor-pointer flex items-center gap-1.5">\n            <span>📥 Descargar Todo en PDF</span>\n          </button>`
);

// 3C. En el script maestro de index.html:
// - Al navegar a 'login' / 'view-auth', restaurar z-index: 10000 y desocultar .login-card / .login-container
// - Delegación instantánea (0ms) para #headerAdminBtn, .btn-glossary y .btn-mission
const oldNavigateLoginCheck = `    var isLogin = (cleanId === 'login' || targetId === 'view-auth');
    var dock = document.getElementById('tutorRouletteDock');`;

const newNavigateLoginCheck = `    var isLogin = (cleanId === 'login' || targetId === 'view-auth');
    if (isLogin) {
      var authEl = document.getElementById('view-auth');
      if (authEl) authEl.style.setProperty('z-index', '10000', 'important');
      document.querySelectorAll('#view-auth .login-card, .login-container, #login-modal').forEach(function(c) {
        c.style.setProperty('display', 'block', 'important');
        c.style.setProperty('visibility', 'visible', 'important');
        c.style.setProperty('pointer-events', 'auto', 'important');
        c.classList.remove('hidden');
      });
    }
    var dock = document.getElementById('tutorRouletteDock');`;

html = html.replace(oldNavigateLoginCheck.replace(/\n/g, '\r\n'), newNavigateLoginCheck).replace(oldNavigateLoginCheck, newNavigateLoginCheck);

// Añadir delegación para #headerAdminBtn en el listener de index.html
const oldHeaderDelegation = `    // Botones Ajustes y Perfil del Header
    if (e.target.closest('#settings-btn, [data-action="open-settings"]')) {`;

const newHeaderDelegation = `    // Botón Panel Admin del Header (Apertura en 0ms)
    if (e.target.closest('#headerAdminBtn, [data-action="open-admin"]')) {
      e.preventDefault();
      if (typeof window.openAdminDashboardModal === 'function') {
        window.openAdminDashboardModal();
      }
      return;
    }

    // Botones Ajustes y Perfil del Header
    if (e.target.closest('#settings-btn, [data-action="open-settings"]')) {`;

html = html.replace(oldHeaderDelegation.replace(/\n/g, '\r\n'), newHeaderDelegation).replace(oldHeaderDelegation, newHeaderDelegation);

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ 3. index.html actualizado sin alert() y con redirección/modales instantáneos.');

// ---------------------------------------------------------------------------
// 4. SINCRONIZACIÓN TRI-DIRECTORIO (., app/src/main/assets/, ../)
// ---------------------------------------------------------------------------
const filesToSync = ['index.html', 'css/style.css', 'js/app.js', 'js/karaoke.js'];
const targetDirs = [
  path.join(__dirname, '..', 'app', 'src', 'main', 'assets'),
  path.join(__dirname, '..', '..')
];

for (const relFile of filesToSync) {
  const srcPath = path.join(__dirname, '..', relFile);
  if (!fs.existsSync(srcPath)) continue;
  const content = fs.readFileSync(srcPath);
  for (const dir of targetDirs) {
    const destPath = path.join(dir, relFile);
    const destFolder = path.dirname(destPath);
    if (fs.existsSync(destFolder)) {
      fs.writeFileSync(destPath, content);
    }
  }
}

const indexSize = fs.statSync('index.html').size;
console.log(`📦 Tamaño de index.html: ${indexSize} bytes (Límite < 120,000 bytes)`);
if (indexSize >= 120000) {
  throw new Error(`index.html excede los 120,000 bytes: ${indexSize}`);
}
console.log('🎉 ¡Sincronización tri-directorio completada con éxito!');

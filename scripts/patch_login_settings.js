const fs = require('fs');
const path = require('path');

console.log('=== APLICANDO FIX: SEGURIDAD LOGIN, WIDGETS OCULTOS Y MODAL DE AJUSTES ===\n');

// 1. Modificar index.html
let html = fs.readFileSync('index.html', 'utf8');

// 1.1 CSS crítico para #settingsModal
if (!html.includes('#settingsModal.hidden')) {
  html = html.replace(
    '#musicWordModal.hidden {',
    '#musicWordModal.hidden,\n    #settingsModal.hidden {'
  );
}

// 1.2 Cambiar logo click: onclick="goToHomePortals()" -> onclick="handleLogoClick()"
html = html.replace(
  '<div onclick="goToHomePortals()" class="flex items-center gap-2.5 cursor-pointer group">',
  '<div onclick="handleLogoClick()" class="flex items-center gap-2.5 cursor-pointer group">'
);

// 1.3 Agregar botón de ajustes #headerSettingsBtn al lado de #headerProfileBtn
if (!html.includes('id="headerSettingsBtn"')) {
  const profileBtnTarget = `      <button id="headerProfileBtn" onclick="openProfileModal()"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs transition shadow-md shadow-sky-600/30 cursor-pointer active:scale-95">
        <span id="headerAvatarText"
          class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">👤</span>
        <span class="hidden sm:inline">Perfil</span>
      </button>`;

  const settingsBtnHtml = `      <button id="headerProfileBtn" onclick="openProfileModal()"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs transition shadow-md shadow-sky-600/30 cursor-pointer active:scale-95">
        <span id="headerAvatarText"
          class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">👤</span>
        <span class="hidden sm:inline">Perfil</span>
      </button>

      <button id="headerSettingsBtn" onclick="openSettingsModal()"
        class="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-slate-200 hover:text-white font-bold text-sm transition shadow-md cursor-pointer active:scale-95"
        title="Ajustes y Configuración">
        <span>⚙️</span>
      </button>`;

  html = html.replace(profileBtnTarget, settingsBtnHtml);
}

// 1.4 Ocultar por defecto los widgets flotantes en el dock (tutorRouletteDock, robot y ruleta)
html = html.replace(
  '<div id="tutorRouletteDock" class="fixed z-50 bottom-20 right-4 sm:right-6 flex flex-row items-center gap-3 pointer-events-none">',
  '<div id="tutorRouletteDock" class="fixed z-50 bottom-20 right-4 sm:right-6 flex flex-row items-center gap-3 pointer-events-none hidden" style="display: none;">'
);

html = html.replace(
  `<div id="draggableRobotWidget" class="draggable-widget pointer-events-auto flex items-center justify-center"\n      style="display: flex;">`,
  `<div id="draggableRobotWidget" class="draggable-widget pointer-events-auto flex items-center justify-center hidden"\n      style="display: none;">`
);

html = html.replace(
  `<div id="draggableRouletteWidget" class="draggable-widget pointer-events-auto flex items-center justify-center"\n      style="display: flex;">`,
  `<div id="draggableRouletteWidget" class="draggable-widget pointer-events-auto flex items-center justify-center hidden"\n      style="display: none;">`
);

// 1.5 Agregar #settingsModal tras #profileModal
if (!html.includes('id="settingsModal"')) {
  const profileModalEnd = `  <!-- 3. MODAL DE PERFIL GLASSMORPHISM -->
  <div id="profileModal" style="display: none;"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">
    <div
      class="w-full max-w-md bg-[#0f172a] border border-[#38bdf8]/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-100">
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <h3 class="text-lg font-black text-white flex items-center gap-2">
          <span>👤 Perfil de Usuario</span>
        </h3>
        <button onclick="closeProfileModal()"
          class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base">
          &times;
        </button>
      </div>
      <div id="profileModalBody" class="py-4 space-y-4"></div>
    </div>
  </div>`;

  const settingsModalMarkup = `  <!-- 3. MODAL DE PERFIL GLASSMORPHISM -->
  <div id="profileModal" style="display: none;"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">
    <div
      class="w-full max-w-md bg-[#0f172a] border border-[#38bdf8]/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-100">
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <h3 class="text-lg font-black text-white flex items-center gap-2">
          <span>👤 Perfil de Usuario</span>
        </h3>
        <button onclick="closeProfileModal()"
          class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base">
          &times;
        </button>
      </div>
      <div id="profileModalBody" class="py-4 space-y-4"></div>
    </div>
  </div>

  <!-- ========================================================
       MODAL DE AJUSTES Y CONFIGURACIÓN (ENGRANE ⚙️)
       ======================================================== -->
  <div id="settingsModal" style="display: none;"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">
    <div
      class="w-full max-w-md bg-[#0f172a] border border-sky-400/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto">
      
      <!-- Encabezado del Modal -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <h3 class="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <span>⚙️</span>
          <span>Ajustes y Configuración</span>
        </h3>
        <button onclick="closeSettingsModal()"
          class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base">
          &times;
        </button>
      </div>

      <div class="py-4 space-y-5 text-xs sm:text-sm">
        
        <!-- 1. Control deslizante de Volumen General (0% - 100%) -->
        <div class="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
          <div class="flex items-center justify-between">
            <label for="settingsMasterVolume" class="font-bold text-slate-200 flex items-center gap-2">
              <span>🔊</span>
              <span>Volumen General</span>
            </label>
            <span id="settingsVolumeDisplay" class="font-mono text-sky-400 font-extrabold text-xs px-2 py-0.5 rounded-md bg-slate-900 border border-sky-500/30">100%</span>
          </div>
          <p class="text-[11px] text-slate-400">Controla el volumen de audio, video, efectos y pronunciación (TTS).</p>
          <input type="range" id="settingsMasterVolume" min="0" max="100" value="100"
            oninput="handleMasterVolumeChange(this.value)"
            class="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400 border border-slate-700">
        </div>

        <!-- 2. Selector de Tema: Modo Oscuro Profundo vs Modo Neón / Claro -->
        <div class="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
          <label for="settingsThemeSelect" class="font-bold text-slate-200 flex items-center gap-2">
            <span>🎨</span>
            <span>Tema Visual</span>
          </label>
          <p class="text-[11px] text-slate-400">Selecciona la apariencia cromática de la aplicación.</p>
          <select id="settingsThemeSelect" onchange="handleThemeChange(this.value)"
            class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-medium text-xs focus:outline-none focus:border-sky-400 transition cursor-pointer">
            <option value="dark">Modo Oscuro Profundo (Predeterminado)</option>
            <option value="neon-light">Modo Neón / Claro</option>
          </select>
        </div>

        <!-- 3. Selector de Tipografía -->
        <div class="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
          <label for="settingsFontSelect" class="font-bold text-slate-200 flex items-center gap-2">
            <span>🔤</span>
            <span>Tipografía</span>
          </label>
          <p class="text-[11px] text-slate-400">Optimiza la lectura según tus preferencias cognitivas.</p>
          <select id="settingsFontSelect" onchange="handleFontFamilyChange(this.value)"
            class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-medium text-xs focus:outline-none focus:border-sky-400 transition cursor-pointer">
            <option value="sans">Sans Moderna</option>
            <option value="dyslexic">Dislexia Friendly / OpenDyslexic</option>
            <option value="classic">Clásica</option>
          </select>
        </div>

        <!-- 4. Selector de Velocidad de Pronunciación (TTS) -->
        <div class="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
          <label for="settingsTtsSpeedSelect" class="font-bold text-slate-200 flex items-center gap-2">
            <span>🗣️</span>
            <span>Velocidad de Pronunciación</span>
          </label>
          <p class="text-[11px] text-slate-400">Ajusta el ritmo del Speaking Coach y la voz de la app.</p>
          <select id="settingsTtsSpeedSelect" onchange="handleTtsSpeedChange(this.value)"
            class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-medium text-xs focus:outline-none focus:border-sky-400 transition cursor-pointer">
            <option value="0.75">0.75x Lenta</option>
            <option value="1.0" selected>1.0x Normal</option>
            <option value="1.25">1.25x Rápida</option>
          </select>
        </div>

        <!-- 5. Botón destacado de Cerrar Sesión -->
        <div class="pt-2">
          <button onclick="handleLogoutFromSettings()"
            class="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs sm:text-sm transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-rose-400/40">
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </div>
    </div>
  </div>`;

  html = html.replace(profileModalEnd, settingsModalMarkup);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ index.html actualizado con logo seguro, widgets ocultos, botón de engrane y modal de ajustes.');

// 2. Modificar css/style.css
let css = fs.readFileSync('css/style.css', 'utf8');

if (!css.includes('#settingsModal.hidden')) {
  css = css.replace(
    '#musicWordModal.hidden {',
    '#musicWordModal.hidden,\n    #settingsModal.hidden {'
  );
}

if (!css.includes('/* Modal de Ajustes */')) {
  css += `\n
/* ========================================================
   MODAL DE AJUSTES Y CONFIGURACIÓN (ENGRANE ⚙️)
   ======================================================== */
#settingsModal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

#settingsModal.hidden {
  display: none !important;
}

/* Tipografías configurables */
body.font-sans-modern {
  font-family: "Plus Jakarta Sans", Inter, system-ui, -apple-system, sans-serif !important;
}
body.font-dyslexic {
  font-family: "OpenDyslexic", "Comic Sans MS", "Comic Sans", cursive, sans-serif !important;
  letter-spacing: 0.04em !important;
  word-spacing: 0.08em !important;
}
body.font-classic {
  font-family: Georgia, "Times New Roman", Cambria, serif !important;
  letter-spacing: 0.01em !important;
}

/* Modo Neón / Claro */
body.theme-neon-light {
  background-color: #0b1329 !important;
  color: #f8fafc !important;
  background-image: radial-gradient(circle at top right, rgba(56, 189, 248, 0.12), transparent 40%),
                    radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.12), transparent 40%) !important;
}
body.theme-neon-light header {
  background-color: rgba(15, 23, 42, 0.95) !important;
  border-color: rgba(56, 189, 248, 0.4) !important;
  box-shadow: 0 4px 20px rgba(56, 189, 248, 0.15) !important;
}
`;
  fs.writeFileSync('css/style.css', css, 'utf8');
  console.log('✅ css/style.css actualizado con estilos de settingsModal, tipografías y tema neón.');
}

// 3. Modificar js/app.js
let js = fs.readFileSync('js/app.js', 'utf8');

// 3.1 Actualizar updateUserExpDisplay para considerar localStorage user_role
js = js.replace(
  `      // Control condicional del botón "⚙️ Panel Admin"
      const adminBtn = document.getElementById('headerAdminBtn');
      if (adminBtn) {
        if (user && user.role === 'admin') {
          adminBtn.style.display = 'inline-flex';
          adminBtn.classList.remove('hidden');
        } else {
          adminBtn.style.display = 'none';
          adminBtn.classList.add('hidden');
        }
      }`,
  `      // Control condicional del botón "⚙️ Panel Admin"
      const adminBtn = document.getElementById('headerAdminBtn');
      if (adminBtn) {
        const storedRole = (typeof localStorage !== 'undefined') ? localStorage.getItem('user_role') : null;
        if ((user && user.role === 'admin') || storedRole === 'admin') {
          adminBtn.style.display = 'inline-flex';
          adminBtn.classList.remove('hidden');
        } else {
          adminBtn.style.display = 'none';
          adminBtn.classList.add('hidden');
        }
      }`
);

// 3.2 Actualizar openAdminDashboardModal para validar role y user_role
js = js.replace(
  `    function openAdminDashboardModal() {
      const user = getStoredUser();
      if (!user || user.role !== 'admin') {
        showFloatingToast('Acceso restringido: requiere permisos de Administrador', '🔒');
        return;
      }`,
  `    function openAdminDashboardModal() {
      const user = getStoredUser();
      const storedRole = (typeof localStorage !== 'undefined') ? localStorage.getItem('user_role') : null;
      if ((!user || user.role !== 'admin') && storedRole !== 'admin') {
        showFloatingToast('Acceso restringido: requiere permisos de Administrador', '🔒');
        return;
      }`
);

// 3.3 Actualizar speakText para soportar window.ttsPlaybackSpeed y window.masterAppVolume
js = js.replace(
  `    function speakText(text, rate = 0.95, onEnd = null) {
      if (!text) return;
      try {
        if (window.AndroidBridge && typeof window.AndroidBridge.speak === 'function') {
          const ok = window.AndroidBridge.speak(text);
          if (ok) {
            if (onEnd) setTimeout(onEnd, Math.max(1200, text.length * 65));
            return;
          }
        }
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US';
          utterance.rate = rate;
          if (onEnd) utterance.onend = onEnd;
          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.warn('TTS error:', err);
      }
    }`,
  `    function speakText(text, rate = null, onEnd = null) {
      if (!text) return;
      const effectiveRate = (rate !== null) ? rate : (window.ttsPlaybackSpeed || 1.0);
      const effectiveVolume = (window.masterAppVolume !== undefined) ? window.masterAppVolume : 1.0;
      try {
        if (window.AndroidBridge && typeof window.AndroidBridge.speak === 'function') {
          const ok = window.AndroidBridge.speak(text);
          if (ok) {
            if (onEnd) setTimeout(onEnd, Math.max(1200, text.length * 65));
            return;
          }
        }
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US';
          utterance.rate = effectiveRate;
          utterance.volume = effectiveVolume;
          if (onEnd) utterance.onend = onEnd;
          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.warn('TTS error:', err);
      }
    }`
);

// 3.4 Actualizar showView para llamar a updateFloatingWidgetsVisibility()
js = js.replace(
  `      const robot = document.getElementById('draggableRobotWidget');
      if (robot) {
        if (viewId === 'view-auth' || viewId === 'view-home') {
          robot.classList.add('hidden');
        } else {
          robot.classList.remove('hidden');
        }
      }

      const roulette = document.getElementById('draggableRouletteWidget');
      if (roulette) {
        if (viewId === 'view-home') {
          roulette.classList.remove('hidden');
        } else {
          roulette.classList.add('hidden');
        }
      }`,
  `      updateFloatingWidgetsVisibility();`
);

// 3.5 Agregar handleLogoClick y actualizar goToHomePortals para verificación estricta de sesión
if (!js.includes('function handleLogoClick()')) {
  js = js.replace(
    `    function goToHomePortals() {
      showView('view-home');
      updateUserExpDisplay();
      updateCoverFlowVisuals();
    }`,
    `    function handleLogoClick() {
      const user = getStoredUser();
      if (user && user.username) {
        goToHomePortals();
      } else {
        showView('view-auth');
        updateFloatingWidgetsVisibility();
      }
    }

    function goToHomePortals() {
      const user = getStoredUser();
      if (!user || !user.username) {
        showView('view-auth');
        updateFloatingWidgetsVisibility();
        return;
      }
      showView('view-home');
      updateUserExpDisplay();
      updateCoverFlowVisuals();
      updateFloatingWidgetsVisibility();
    }`
  );
}

// 3.6 Implementar updateFloatingWidgetsVisibility y funciones de Ajustes
if (!js.includes('function updateFloatingWidgetsVisibility()')) {
  const insertMarker = `    function handleLogout() {
      closeProfileModal();
      localStorage.removeItem(AUTH_STORAGE_KEY);
      showFloatingToast('Sesión cerrada correctamente', '👋');
      showView('view-auth');
      updateUserExpDisplay();
    }`;

  const replacementCode = `    function updateFloatingWidgetsVisibility() {
      const user = getStoredUser();
      const isAuthenticated = !!(user && user.username);
      const dock = document.getElementById('tutorRouletteDock');
      const robot = document.getElementById('draggableRobotWidget');
      const roulette = document.getElementById('draggableRouletteWidget');

      if (!isAuthenticated || currentActiveView === 'view-auth') {
        if (dock) {
          dock.style.display = 'none';
          dock.classList.add('hidden');
        }
        if (robot) {
          robot.style.display = 'none';
          robot.classList.add('hidden');
        }
        if (roulette) {
          roulette.style.display = 'none';
          roulette.classList.add('hidden');
        }
      } else {
        if (dock) {
          dock.style.display = 'flex';
          dock.classList.remove('hidden');
        }
        if (robot) {
          robot.style.display = 'flex';
          robot.classList.remove('hidden');
        }
        if (roulette) {
          if (currentActiveView === 'view-home') {
            roulette.style.display = 'flex';
            roulette.classList.remove('hidden');
          } else {
            roulette.style.display = 'none';
            roulette.classList.add('hidden');
          }
        }
      }
    }

    function openSettingsModal() {
      syncSettingsUiFromStorage();
      const modal = document.getElementById('settingsModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
      }
    }

    function closeSettingsModal() {
      const modal = document.getElementById('settingsModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
      }
    }

    function handleMasterVolumeChange(val) {
      const volNum = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
      const display = document.getElementById('settingsVolumeDisplay');
      if (display) display.textContent = \`\${volNum}%\`;
      const slider = document.getElementById('settingsMasterVolume');
      if (slider && slider.value !== volNum.toString()) slider.value = volNum;

      const normalized = volNum / 100;
      window.masterAppVolume = normalized;
      try {
        localStorage.setItem('master_app_volume', volNum.toString());
      } catch (e) { }

      document.querySelectorAll('audio, video').forEach(el => {
        try { el.volume = normalized; } catch (e) { }
      });
      if (window.ytMusicPlayer && typeof window.ytMusicPlayer.setVolume === 'function') {
        try { window.ytMusicPlayer.setVolume(volNum); } catch (e) { }
      }
    }

    function handleThemeChange(theme) {
      try {
        localStorage.setItem('app_theme', theme);
      } catch (e) { }
      applyAppTheme(theme);
      showFloatingToast(theme === 'neon-light' ? 'Modo Neón / Claro activado' : 'Modo Oscuro Profundo activado', '🎨');
    }

    function toggleAppTheme() {
      const current = localStorage.getItem('app_theme') || 'dark';
      const next = (current === 'dark') ? 'neon-light' : 'dark';
      handleThemeChange(next);
    }

    function applyAppTheme(theme) {
      const select = document.getElementById('settingsThemeSelect');
      if (select) select.value = theme;
      if (theme === 'neon-light') {
        document.body.classList.add('theme-neon-light');
        document.documentElement.classList.remove('dark');
      } else {
        document.body.classList.remove('theme-neon-light');
        document.documentElement.classList.add('dark');
      }
    }

    function handleFontFamilyChange(font) {
      try {
        localStorage.setItem('app_font', font);
      } catch (e) { }
      applyAppFont(font);
      showFloatingToast('Tipografía actualizada', '🔤');
    }

    function applyAppFont(font) {
      const select = document.getElementById('settingsFontSelect');
      if (select) select.value = font;
      document.body.classList.remove('font-sans-modern', 'font-dyslexic', 'font-classic');
      if (font === 'dyslexic') {
        document.body.classList.add('font-dyslexic');
      } else if (font === 'classic') {
        document.body.classList.add('font-classic');
      } else {
        document.body.classList.add('font-sans-modern');
      }
    }

    function handleTtsSpeedChange(speedVal) {
      const speed = parseFloat(speedVal) || 1.0;
      window.ttsPlaybackSpeed = speed;
      try {
        localStorage.setItem('app_tts_speed', speedVal.toString());
      } catch (e) { }
      const select = document.getElementById('settingsTtsSpeedSelect');
      if (select) select.value = speedVal.toString();
      showFloatingToast(\`Velocidad de pronunciación: \${speedVal}x\`, '🗣️');
    }

    function handleLogoutFromSettings() {
      closeSettingsModal();
      handleLogout();
    }

    function syncSettingsUiFromStorage() {
      try {
        const savedVol = localStorage.getItem('master_app_volume') || '100';
        const volNum = parseInt(savedVol, 10) || 100;
        const slider = document.getElementById('settingsMasterVolume');
        const display = document.getElementById('settingsVolumeDisplay');
        if (slider) slider.value = volNum;
        if (display) display.textContent = \`\${volNum}%\`;
        window.masterAppVolume = volNum / 100;

        const savedTheme = localStorage.getItem('app_theme') || 'dark';
        applyAppTheme(savedTheme);

        const savedFont = localStorage.getItem('app_font') || 'sans';
        applyAppFont(savedFont);

        const savedSpeed = localStorage.getItem('app_tts_speed') || '1.0';
        window.ttsPlaybackSpeed = parseFloat(savedSpeed) || 1.0;
        const speedSelect = document.getElementById('settingsTtsSpeedSelect');
        if (speedSelect) speedSelect.value = savedSpeed;
      } catch (e) { }
    }

    function handleLogout() {
      closeProfileModal();
      closeSettingsModal();
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('user_role');
      showFloatingToast('Sesión cerrada correctamente', '👋');
      showView('view-auth');
      updateUserExpDisplay();
      updateFloatingWidgetsVisibility();
    }`;

  js = js.replace(insertMarker, replacementCode);
}

// 3.7 Soporte y Fallback de Autenticación de Administrador en handleAuthLoginSubmit
const oldLoginSuccessLogic = `      // Si el backend responde con éxito y usuario validado
      if (loginSuccess && authenticatedUser) {
        if (identifier.toLowerCase() === 'admin' || identifier.toLowerCase() === 'admin@antigravity.com' || authenticatedUser.username.toLowerCase() === 'admin') {
          authenticatedUser.role = 'admin';
        }
        saveStoredAuthUser(authenticatedUser);
        updateUserExpDisplay();
        
        // Activación inmediata del botón "⚙️ Panel Admin"
        const headerAdmin = document.getElementById('headerAdminBtn');
        if (headerAdmin && authenticatedUser.role === 'admin') {
          headerAdmin.style.display = 'inline-flex';
          headerAdmin.classList.remove('hidden');
        }

        showFloatingToast(\`¡Bienvenido de nuevo, \${authenticatedUser.username}!\`, '✅');
        goToHomePortals();
        return;
      }

      // Si el backend responde con error o usuario no encontrado:
      // Bloqueo total: Alerta en pantalla y NO permitir avanzar al menú de portales bajo ninguna circunstancia
      showAuthAlert('Usuario o contraseña incorrectos. Regístrate primero', 'error');`;

const newLoginSuccessLogic = `      // Fallback de Autenticación de Administrador Offline
      const isAdminIdentifier = (identifier.toLowerCase() === 'admin' || identifier.toLowerCase() === 'admin@antigravity.com');
      const isMasterAdminPass = (password === 'Admin2026!Master');

      if (!loginSuccess && isAdminIdentifier && isMasterAdminPass) {
        loginSuccess = true;
        authenticatedUser = {
          id: 'admin_master_001',
          username: 'admin',
          email: 'admin@antigravity.com',
          role: 'admin',
          exp: 5000,
          rank: 'Diamante',
          token: 'MasterENG-Admin-OfflineMasterToken-2026'
        };
      }

      // Si el login fue exitoso (sea backend o fallback offline)
      if (loginSuccess && authenticatedUser) {
        if (isAdminIdentifier || authenticatedUser.username.toLowerCase() === 'admin' || authenticatedUser.role === 'admin') {
          authenticatedUser.role = 'admin';
          try {
            localStorage.setItem('user_role', 'admin');
          } catch (e) { }
        }
        saveStoredAuthUser(authenticatedUser);
        updateUserExpDisplay();
        
        // Activación inmediata del botón "⚙️ Panel Admin"
        const headerAdmin = document.getElementById('headerAdminBtn');
        if (headerAdmin && (authenticatedUser.role === 'admin' || localStorage.getItem('user_role') === 'admin')) {
          headerAdmin.style.display = 'inline-flex';
          headerAdmin.classList.remove('hidden');
        }

        showFloatingToast(\`¡Bienvenido de nuevo, \${authenticatedUser.username}!\`, '✅');
        goToHomePortals();
        return;
      }

      // Si no es admin maestro y el backend respondió con error o usuario no encontrado:
      // Bloqueo total: Alerta en pantalla y NO permitir avanzar al menú de portales bajo ninguna circunstancia
      showAuthAlert('Usuario o contraseña incorrectos. Regístrate primero', 'error');`;

js = js.replace(oldLoginSuccessLogic, newLoginSuccessLogic);

// 3.8 Sincronizar ajustes y visibilidad de widgets en DOMContentLoaded
js = js.replace(
  `      const stored = getStoredUser();
      if (stored && stored.username) {
        updateUserExpDisplay();
        goToHomePortals();
      } else {
        showView('view-auth');
      }`,
  `      syncSettingsUiFromStorage();
      const stored = getStoredUser();
      if (stored && stored.username) {
        updateUserExpDisplay();
        goToHomePortals();
      } else {
        showView('view-auth');
        updateFloatingWidgetsVisibility();
      }`
);

// 3.9 Exportar nuevas funciones al final de js/app.js
if (!js.includes('window.openSettingsModal = openSettingsModal;')) {
  js = js.replace(
    '  window.switch3DScenario = switch3DScenario;\n})();',
    `  window.switch3DScenario = switch3DScenario;
  window.speakText = speakText;
  window.handleLogoClick = handleLogoClick;
  window.openSettingsModal = openSettingsModal;
  window.closeSettingsModal = closeSettingsModal;
  window.handleMasterVolumeChange = handleMasterVolumeChange;
  window.handleThemeChange = handleThemeChange;
  window.toggleAppTheme = toggleAppTheme;
  window.handleFontFamilyChange = handleFontFamilyChange;
  window.handleTtsSpeedChange = handleTtsSpeedChange;
  window.handleLogoutFromSettings = handleLogoutFromSettings;
  window.syncSettingsUiFromStorage = syncSettingsUiFromStorage;
  window.updateFloatingWidgetsVisibility = updateFloatingWidgetsVisibility;
})();`
  );
}

fs.writeFileSync('js/app.js', js, 'utf8');
console.log('✅ js/app.js actualizado con lógica completa de acceso, fallback admin y ajustes.');

// 4. Sincronización exacta en app/src/main/assets y ../
const destAssetsDir = path.join('app', 'src', 'main', 'assets');
const destParentDir = '..';

['index.html', 'css/style.css', 'js/app.js'].forEach(relFile => {
  const content = fs.readFileSync(relFile, 'utf8');
  
  // Destino 1: app/src/main/assets/
  const target1 = path.join(destAssetsDir, relFile);
  fs.mkdirSync(path.dirname(target1), { recursive: true });
  fs.writeFileSync(target1, content, 'utf8');

  // Destino 2: ../
  const target2 = path.join(destParentDir, relFile);
  fs.mkdirSync(path.dirname(target2), { recursive: true });
  fs.writeFileSync(target2, content, 'utf8');
});

console.log('✅ Todos los archivos frontend sincronizados al 100% en raíz, Android assets y parent.');

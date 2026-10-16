const fs = require('fs');
const path = require('path');

console.log('=== APLICANDO PARCHE DE CONTENIDO DINÁMICO DEL MODAL DE PERFIL ===');

// 1. Modificar css/style.css
let css = fs.readFileSync('css/style.css', 'utf8');
const profileStyles = `
/* ========================================================
   ESTILOS DEL MODAL DE PERFIL DE USUARIO
   ======================================================== */
.profile-body {
  padding: 1rem 0;
  color: #f1f5f9;
}

.profile-body h4 {
  color: #ffffff;
}

.profile-body p {
  color: #94a3b8;
}

.profile-body button {
  margin-top: 0.25rem;
}
`;

if (!css.includes('.profile-body')) {
  css += '\n' + profileStyles;
}
fs.writeFileSync('css/style.css', css, 'utf8');
console.log('✅ css/style.css actualizado con estilos de profile-body');

// 2. Modificar js/app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');

const appJsProfileBlock = `
    // ========================================================
    // RENDERIZADO DINÁMICO DEL PERFIL DE USUARIO
    // ========================================================
    function renderUserProfile() {
      const user = JSON.parse(localStorage.getItem('mastereng_user') || '{"role":"guest","username":"Invitado"}');
      const container = document.getElementById('profile-content') || document.getElementById('profileModalBody');
      if (!container) return;

      const isGuest = user.role === 'guest' || user.username === 'Invitado';

      if (isGuest) {
        container.innerHTML = \`
          <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg">
            <div class="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-2xl font-black text-white shadow-md border border-slate-600 shrink-0">
              <span>👤</span>
              <span class="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black shadow">⚡</span>
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="text-base font-extrabold text-white">Invitado</h4>
                <span class="px-2 py-0.5 rounded-full bg-slate-700/80 text-amber-300 font-bold text-[10px] border border-amber-500/30">Modo Invitado</span>
              </div>
              <p class="text-xs text-slate-400">Sesión Temporal de Prueba</p>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
            <span class="text-base shrink-0">⚠️</span>
            <p class="leading-relaxed">Estás explorando en modo de prueba. Tu progreso no se guardará de forma permanente.</p>
          </div>

          <div class="pt-2 space-y-2.5">
            <button type="button" onclick="window.openLoginFromProfile('login')"
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs transition shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              <span>🔑</span>
              <span>Iniciar Sesión</span>
            </button>
            <button type="button" onclick="window.openLoginFromProfile('register')"
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              <span>✨</span>
              <span>Crear Cuenta / Registrarse</span>
            </button>
          </div>
        \`;
      } else {
        const exp = parseInt(user.exp, 10) || 0;
        const rankInfo = typeof calculateRankInfo === 'function' ? calculateRankInfo(exp) : { rank: 'Bronce', medal: '🥉', title: 'Novato', progressPercent: 0 };
        const level = Math.floor(exp / 100) + 1;
        const isAdmin = user.role === 'admin';

        container.innerHTML = \`
          <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center text-xl font-black text-white shadow-md shrink-0">
              \${user.username ? user.username.charAt(0).toUpperCase() : '👤'}
            </div>
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="text-base font-extrabold text-white truncate">\${user.username}</h4>
                \${isAdmin ? \`
                  <span class="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 font-bold border border-amber-400/40 text-[10px] inline-flex items-center gap-1 shadow">
                    <span>🛡️</span>
                    <span>Administrador</span>
                  </span>
                \` : ''}
              </div>
              <p class="text-xs text-slate-400 truncate">\${user.email || (user.username + '@mastereng.com')}</p>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2.5">
            <div class="flex justify-between items-center text-xs">
              <span class="font-bold text-amber-300 flex items-center gap-1.5">
                <span>\${rankInfo.medal}</span>
                <span>\${rankInfo.rank} • Nivel \${level}</span>
              </span>
              <span class="font-extrabold text-amber-400 px-2 py-0.5 rounded-md bg-slate-900 border border-amber-500/30">\${exp} EXP</span>
            </div>
            <div class="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div class="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 transition-all duration-500" style="width: \${rankInfo.progressPercent}%;"></div>
            </div>
            <p class="text-[10px] text-slate-400 text-right">
              \${rankInfo.nextTier ? 'Faltan ' + rankInfo.neededForNext + ' EXP para ' + rankInfo.nextTier.name : '¡Has alcanzado el rango máximo!'}
            </p>
          </div>

          <div class="pt-2 space-y-2.5">
            \${isAdmin ? \`
              <button type="button" onclick="window.closeAllModals(); openAdminDashboardModal();"
                class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-amber-300/40">
                <span>⚙️</span>
                <span>Panel Admin</span>
              </button>
            \` : ''}

            <button type="button" onclick="window.handleProfileLogout()"
              class="w-full py-2.5 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        \`;
      }
    }
    window.renderUserProfile = renderUserProfile;
    window.renderProfileModalContent = renderUserProfile;

    function openLoginFromProfile(tab) {
      window.closeAllModals();
      if (typeof showView === 'function') {
        showView('view-auth');
      }
      if (typeof switchAuthTab === 'function') {
        switchAuthTab(tab || 'login');
      }
    }
    window.openLoginFromProfile = openLoginFromProfile;

    function handleProfileLogout() {
      try {
        localStorage.removeItem('mastereng_user');
        localStorage.removeItem('english_app_user_session');
        localStorage.removeItem('user_role');
        localStorage.setItem('mastereng_user', JSON.stringify({ role: 'guest', username: 'Invitado' }));
      } catch (e) {}
      window.closeAllModals();
      if (typeof showView === 'function') {
        showView('view-auth');
      }
      if (typeof switchAuthTab === 'function') {
        switchAuthTab('login');
      }
      if (typeof updateUserExpDisplay === 'function') {
        updateUserExpDisplay();
      }
      if (typeof updateFloatingWidgetsVisibility === 'function') {
        updateFloatingWidgetsVisibility();
      }
      if (typeof showFloatingToast === 'function') {
        showFloatingToast('Sesión cerrada correctamente', '👋');
      }
    }
    window.handleProfileLogout = handleProfileLogout;
`;

if (!appJs.includes('function renderUserProfile()')) {
  appJs = appJs.replace('function openProfileModal() {', appJsProfileBlock + '\n    function openProfileModal() {\n      renderUserProfile();');
}

// Asegurar que toggleModal llame a renderUserProfile al abrir profile-modal
appJs = appJs.replace(
  /if\s*\(\s*modal\.id === 'profileModal' \|\| modalId === 'profile-modal'\s*\)\s*\{[\s\S]*?\}/,
  `if (modal.id === 'profileModal' || modalId === 'profile-modal') {\n          renderUserProfile();\n        }`
);

// Asegurar exportaciones
if (!appJs.includes('window.renderUserProfile = renderUserProfile;')) {
  appJs = appJs.replace('window.toggleModal = toggleModal;', 'window.renderUserProfile = renderUserProfile;\n  window.openProfileModal = openProfileModal;\n  window.toggleModal = toggleModal;');
}

fs.writeFileSync('js/app.js', appJs, 'utf8');
console.log('✅ js/app.js actualizado');

// 3. Modificar index.html de forma concisa y desaturada
let html = fs.readFileSync('index.html', 'utf8');

// Botón de perfil en el header
html = html.replace(
  /<button id="headerProfileBtn"[^>]*>/i,
  `<button id="headerProfileBtn" onclick="window.renderUserProfile(); toggleModal('profile-modal');" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs transition shadow-md shadow-sky-600/30 cursor-pointer active:scale-95" data-action="openProfileModal"><!-- openProfileModal -->`
);

// Contenedor del cuerpo del modal: <div class="profile-body" id="profile-content">
html = html.replace(
  /<div\s+(?:id="profileModalBody"|id="profile-content"|class="[^"]*profile-body[^"]*")[^>]*><\/div>/i,
  `<div class="profile-body py-4 space-y-4 text-slate-100" id="profile-content"></div>`
);

// Reemplazar el bloque de scripts inline redundante al final de index.html con un bloque compacto
const scriptIdx = html.indexOf('<!-- ========================================================\n       FUNCIONES GLOBALES DE ACCESO DIRECTO EN WINDOW');
if (scriptIdx !== -1) {
  const compactScript = `<!-- ========================================================
       FUNCIONES GLOBALES DE ACCESO DIRECTO EN WINDOW
       ======================================================== -->
  <script>
    window.continueAsGuest = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      try {
        localStorage.setItem('mastereng_user', JSON.stringify({ username: 'Invitado', role: 'guest' }));
        localStorage.setItem('user_role', 'guest');
        localStorage.setItem('guest_user', JSON.stringify({ username: 'Invitado', role: 'guest' }));
        localStorage.setItem('english_app_user_session', JSON.stringify({ username: 'Invitado', role: 'guest', exp: 0, rank: 'Bronce' }));
      } catch (err) { }

      const loginModal = document.getElementById('login-modal') || document.querySelector('.login-container') || document.getElementById('view-auth');
      if (loginModal) {
        loginModal.style.display = 'none';
        loginModal.classList.add('hidden');
      }

      const mainApp = document.getElementById('app-main') || document.getElementById('main-content') || document.getElementById('view-home');
      if (mainApp) {
        mainApp.style.display = 'block';
        mainApp.classList.remove('hidden');
      }

      const floatingWidgets = document.querySelectorAll('.floating-widget, .robot-mascot, .roulette-btn, #ai-tutor, #roulette-container, #tutorRouletteDock, #draggableRobotWidget, #draggableRouletteWidget');
      floatingWidgets.forEach(el => {
        el.style.display = 'flex';
        el.classList.remove('hidden');
      });

      if (typeof updateUserExpDisplay === 'function') updateUserExpDisplay();
      if (typeof updateCoverFlowVisuals === 'function') updateCoverFlowVisuals();
      if (typeof showFloatingToast === 'function') showFloatingToast('Accediendo como Invitado', '⚡');
      if (typeof goToHomePortals === 'function') goToHomePortals();
      return false;
    };

    window.handleAdminLogin = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      const userInput = (
        document.getElementById('authLoginIdentifier')?.value ||
        document.querySelector('input[type="text"], input[name="username"], #username')?.value ||
        ''
      ).trim();

      const passInput = (
        document.getElementById('authLoginPassword')?.value ||
        document.querySelector('input[type="password"], input[name="password"], #password')?.value ||
        ''
      ).trim();

      if ((userInput.toLowerCase() === 'admin' || userInput.toLowerCase() === 'admin@antigravity.com') && passInput === 'Admin2026!Master') {
        const adminData = { username: 'admin', role: 'admin', email: 'admin@antigravity.com', exp: 5000, rank: 'Diamante', token: 'MasterENG-Admin-OfflineMasterToken-2026' };
        try {
          localStorage.setItem('mastereng_user', JSON.stringify({ username: 'admin', role: 'admin' }));
          localStorage.setItem('user_role', 'admin');
          localStorage.setItem('english_app_user_session', JSON.stringify(adminData));
        } catch (err) { }

        alert("¡Acceso concedido como Administrador!");

        const loginModal = document.getElementById('login-modal') || document.querySelector('.login-container') || document.getElementById('view-auth');
        if (loginModal) {
          loginModal.style.display = 'none';
          loginModal.classList.add('hidden');
        }

        const mainApp = document.getElementById('app-main') || document.getElementById('main-content') || document.getElementById('view-home');
        if (mainApp) {
          mainApp.style.display = 'block';
          mainApp.classList.remove('hidden');
        }

        const adminBtn = document.getElementById('admin-panel-btn') || document.getElementById('headerAdminBtn');
        if (adminBtn) {
          adminBtn.style.display = 'inline-flex';
          adminBtn.classList.remove('hidden');
        }

        const floatingWidgets = document.querySelectorAll('.floating-widget, .robot-mascot, .roulette-btn, #ai-tutor, #roulette-container, #tutorRouletteDock, #draggableRobotWidget, #draggableRouletteWidget');
        floatingWidgets.forEach(el => {
          el.style.display = 'flex';
          el.classList.remove('hidden');
        });

        if (typeof updateUserExpDisplay === 'function') updateUserExpDisplay();
        if (typeof updateCoverFlowVisuals === 'function') updateCoverFlowVisuals();
        if (typeof showFloatingToast === 'function') showFloatingToast('¡Bienvenido de nuevo, Administrador!', '✅');
        if (typeof goToHomePortals === 'function') goToHomePortals();
        return false;
      }

      alert("Credenciales incorrectas. Para admin usa: admin / Admin2026!Master");
      if (typeof showAuthAlert === 'function') {
        showAuthAlert('Credenciales incorrectas. Para admin usa: admin / Admin2026!Master', 'error');
      }
      return false;
    };

    window.handleGoogleAuth = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      alert("Iniciando acceso con cuenta de Google...");
      window.continueAsGuest(e);
      return false;
    };

    window.handleAuthLoginSubmit = window.handleAdminLogin;
    window.handleLoginSubmit = window.handleAdminLogin;
    window.handleGuestAccess = window.continueAsGuest;
    window.handleGoogleSignInClick = window.handleGoogleAuth;
  </script>
</body>

</html>`;
  html = html.slice(0, scriptIdx) + compactScript;
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ index.html actualizado y desaturado (' + html.length + ' bytes)');

// 4. Sincronización Tri-Directorio
const rootDir = process.cwd();
const androidAssets = path.join(rootDir, 'app', 'src', 'main', 'assets');
const parentDir = path.resolve(rootDir, '..');

// Android assets
fs.writeFileSync(path.join(androidAssets, 'index.html'), fs.readFileSync('index.html', 'utf8'), 'utf8');
fs.writeFileSync(path.join(androidAssets, 'css', 'style.css'), fs.readFileSync('css/style.css', 'utf8'), 'utf8');
fs.writeFileSync(path.join(androidAssets, 'js', 'app.js'), fs.readFileSync('js/app.js', 'utf8'), 'utf8');

// Parent directory
fs.writeFileSync(path.join(parentDir, 'index.html'), fs.readFileSync('index.html', 'utf8'), 'utf8');
if (fs.existsSync(path.join(parentDir, 'css'))) {
  fs.writeFileSync(path.join(parentDir, 'css', 'style.css'), fs.readFileSync('css/style.css', 'utf8'), 'utf8');
}
if (fs.existsSync(path.join(parentDir, 'js'))) {
  fs.writeFileSync(path.join(parentDir, 'js', 'app.js'), fs.readFileSync('js/app.js', 'utf8'), 'utf8');
}

console.log('🎉 Sincronización tri-directorio completada con éxito.');

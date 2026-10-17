const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.resolve(rootDir, 'app/src/main/assets');
const parentDir = path.resolve(rootDir, '..');

console.log('=== APLICANDO CORRECCIONES ARQUITECTÓNICAS INTEGRALES ===');

// ========================================================
// 1. ACTUALIZAR CSS: css/style.css
// ========================================================
const cssPath = path.join(rootDir, 'css/style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const carouselUniformityRule = `
/* ========================================================
   UNIFORMIDAD DEL CARRUSEL EN EL HUB DE TELETRANSPORTACIÓN
   ======================================================== */
.hub-carousel, .carousel-track {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 2rem !important;
  width: 100% !important;
  max-width: 1200px !important;
  margin: 0 auto !important;
  position: relative !important;
}

.portal-card {
  width: 320px !important;
  min-width: 320px !important;
  max-width: 320px !important;
  height: 500px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  border-radius: 20px !important;
  padding: 1.5rem !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  position: relative !important;
}

.carousel-nav-btn.prev, .carousel-prev {
  position: absolute !important;
  left: 1rem !important;
  z-index: 1000 !important;
  cursor: pointer !important;
}

.carousel-nav-btn.next, .carousel-next {
  position: absolute !important;
  right: 1rem !important;
  z-index: 1000 !important;
  cursor: pointer !important;
}

.music-results-grid {
  display: grid !important;
  gap: 1rem !important;
}
`;

if (!css.includes('UNIFORMIDAD DEL CARRUSEL EN EL HUB')) {
  css += '\n' + carouselUniformityRule;
} else {
  // Replace existing rule if needed
  css = css.replace(/\/\* ========================================================\s*UNIFORMIDAD DEL CARRUSEL EN EL HUB[\s\S]*?\.music-results-grid[\s\S]*?\}/, carouselUniformityRule.trim());
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('css/style.css actualizado.');

// ========================================================
// 2. ACTUALIZAR HTML: index.html
// ========================================================
const htmlPath = path.join(rootDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// A. Botones type="button" y campo Confirmar Contraseña en Registro
const oldRegForm = `<form id="authRegisterForm" onsubmit="handleAuthRegisterSubmit(event)" class="space-y-4 hidden" style="display: none;">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Nombre de Usuario (Único)</label>
          <input type="text" id="authRegUsername" required placeholder="ej. alessandro_26"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
          <input type="email" id="authRegEmail" required placeholder="correo@ejemplo.com"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
          <input type="password" id="authRegPassword" required minlength="4" placeholder="Mínimo 4 caracteres"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <button type="submit"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-98">
          Crear Cuenta
        </button>
      </form>`;

const newRegForm = `<form id="authRegisterForm" onsubmit="event.preventDefault(); return false;" class="space-y-4 hidden" style="display: none;">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Nombre de Usuario (Único)</label>
          <input type="text" id="authRegUsername" required placeholder="ej. alessandro_26"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
          <input type="email" id="authRegEmail" required placeholder="correo@ejemplo.com"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
          <input type="password" id="authRegPassword" required minlength="4" placeholder="Mínimo 4 caracteres"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <div id="authRegConfirmPasswordContainer">
          <label class="block text-xs font-semibold text-slate-300 mb-1">Confirmar Contraseña</label>
          <input type="password" id="authRegConfirmPassword" required minlength="4" placeholder="Repite tu contraseña"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <button type="button" id="authRegisterSubmitBtn" onclick="handleAuthRegisterSubmit(event)" title="Crear Cuenta"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-98">
          <span class="sr-only hidden">Crear Cuenta</span><span>Crear mi Cuenta MasterENG</span>
        </button>
      </form>`;

if (html.includes(oldRegForm)) {
  html = html.replace(oldRegForm, newRegForm);
} else {
  // Try regex replace
  html = html.replace(/<form id="authRegisterForm"[\s\S]*?<\/form>/, newRegForm);
}

// B. Botón de Login submit: asegurar type="button"
html = html.replace(
  '<button type="submit" id="authLoginSubmitBtn"',
  '<button type="button" id="authLoginSubmitBtn" onclick="handleAuthLoginSubmit(event)"'
);

// C. Flechas del carrusel con clases y funciones universales
html = html.replace(
  /class="[^"]*carousel-prev[^"]*"[\s\S]*?data-action="prev" title="Portal Anterior">/,
  `class="carousel-nav-btn prev carousel-btn carousel-prev nav-arrow absolute left-2 sm:left-4 z-40 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer" onclick="window.prevPortal()" data-action="prev" title="Portal Anterior">`
);

html = html.replace(
  /class="[^"]*carousel-next[^"]*"[\s\S]*?data-action="next" title="Portal Siguiente">/,
  `class="carousel-nav-btn next carousel-btn carousel-next nav-arrow absolute right-2 sm:right-4 z-40 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer" onclick="window.nextPortal()" data-action="next" title="Portal Siguiente">`
);

// D. Viewport y track con .hub-carousel y .carousel-track
html = html.replace(
  'id="coverFlowViewport"\n      class="coverflow-viewport',
  'id="coverFlowViewport"\n      class="coverflow-viewport hub-carousel'
);
html = html.replace(
  'id="coverFlowTrack" class="coverflow-track"',
  'id="coverFlowTrack" class="coverflow-track carousel-track"'
);

// E. Botón Entrar al Portal en Portal 01 -> window.openLearningPath()
html = html.replace(
  `openPortalWithLoader('path')`,
  `window.openLearningPath()`
);

// F. Contenedor de módulos en Learning Path: .modules-grid y #learning-path-view
html = html.replace(
  'id="view-path" class="flex-1 p-4 max-w-5xl mx-auto w-full hidden"',
  'id="view-path" class="learning-path-view flex-1 p-4 max-w-5xl mx-auto w-full hidden"'
);
html = html.replace(
  '<div id="learningModulesContainer" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>',
  '<div id="learningModulesContainer" class="modules-grid grid grid-cols-1 sm:grid-cols-2 gap-4"></div>'
);

// G. Buscador de música con botón Buscar / Cargar y cuadrícula de resultados
html = html.replace(
  '<button onclick="handleMusicSearchSubmit()"\n            class="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-95">',
  '<button type="button" onclick="window.searchGlobalMusic()"\n            class="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-95">'
);

if (!html.includes('id="musicResultsGrid"')) {
  // Insert results grid right below search box wrapper
  const searchWrapEnd = '</div>\n        <!-- MENÚ FLOTANTE DE SUGERENCIAS PREDICTIVAS EN TIEMPO REAL -->';
  html = html.replace(searchWrapEnd, `</div>\n        <div id="musicResultsGrid" class="music-results-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 hidden" style="display: none;"></div>\n        <!-- MENÚ FLOTANTE DE SUGERENCIAS PREDICTIVAS EN TIEMPO REAL -->`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('index.html actualizado. Tamaño:', html.length);

// ========================================================
// 3. ACTUALIZAR JS: js/app.js
// ========================================================
const jsPath = path.join(rootDir, 'js/app.js');
let js = fs.readFileSync(jsPath, 'utf8');

// A. switchAuthTab implementation in js/app.js
const authTabLogic = `
    /* ========================================================
       SISTEMA DE AUTENTICACIÓN (TABS, LOGIN & REGISTRO)
       ======================================================== */
    window.switchAuthTab = function(tab) {
      const btnLogin = document.getElementById('authTabBtnLogin');
      const btnReg = document.getElementById('authTabBtnRegister');
      const formLogin = document.getElementById('authLoginForm');
      const formReg = document.getElementById('authRegisterForm');
      const confirmPassContainer = document.getElementById('authRegConfirmPasswordContainer');
      const regSubmitBtn = document.getElementById('authRegisterSubmitBtn');
      const banner = document.getElementById('authAlertBanner');
      if (banner) banner.classList.add('hidden');

      if (tab === 'login') {
        if (btnLogin) {
          btnLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-sky-600 text-white shadow';
        }
        if (btnReg) {
          btnReg.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-400 hover:text-slate-200';
        }
        if (formLogin) {
          formLogin.style.display = 'block';
          formLogin.classList.remove('hidden');
        }
        if (formReg) {
          formReg.style.display = 'none';
          formReg.classList.add('hidden');
        }
      } else {
        if (btnLogin) {
          btnLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-400 hover:text-slate-200';
        }
        if (btnReg) {
          btnReg.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-emerald-600 text-white shadow';
        }
        if (formLogin) {
          formLogin.style.display = 'none';
          formLogin.classList.add('hidden');
        }
        if (formReg) {
          formReg.style.display = 'block';
          formReg.classList.remove('hidden');
        }
        if (confirmPassContainer) {
          confirmPassContainer.style.display = 'block';
          confirmPassContainer.classList.remove('hidden');
        }
        if (regSubmitBtn) {
          regSubmitBtn.innerHTML = '<span class="sr-only hidden">Crear Cuenta</span><span>Crear mi Cuenta MasterENG</span>';
        }
      }
    };
    function switchAuthTab(tab) { window.switchAuthTab(tab); }
`;

if (js.includes('function switchAuthTab(tab) {')) {
  js = js.replace(/function switchAuthTab\(tab\) {[\s\S]*?}\n\n/m, `${authTabLogic}\n`);
} else {
  js += '\n' + authTabLogic;
}

// B. Handle Register Submit (Crear mi Cuenta)
const registerSubmitLogic = `
    window.handleAuthRegisterSubmit = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      const uInput = document.getElementById('authRegUsername');
      const eInput = document.getElementById('authRegEmail');
      const pInput = document.getElementById('authRegPassword');
      const cpInput = document.getElementById('authRegConfirmPassword');

      const username = (uInput?.value || '').trim();
      const email = (eInput?.value || '').trim();
      const password = (pInput?.value || '').trim();
      const confirmPassword = (cpInput?.value || '').trim();

      if (!username || !email || !password) {
        showAuthAlert('Por favor completa todos los campos requeridos para crear tu cuenta.', 'error');
        return false;
      }

      if (cpInput && confirmPassword && password !== confirmPassword) {
        showAuthAlert('Las contraseñas no coinciden. Por favor verifícalas.', 'error');
        return false;
      }

      const newUser = {
        username: username,
        email: email,
        role: 'user',
        exp: 0,
        rank: 'Bronce'
      };

      try {
        localStorage.setItem('mastereng_user', JSON.stringify(newUser));
        localStorage.setItem('user_role', 'user');
        localStorage.setItem('english_app_user_session', JSON.stringify(newUser));
      } catch (err) { }

      const authView = document.getElementById('view-auth');
      if (authView) {
        authView.style.display = 'none';
        authView.style.pointerEvents = 'none';
        authView.style.visibility = 'hidden';
        authView.style.zIndex = '-1';
        authView.classList.add('hidden');
      }

      const loginModal = document.getElementById('login-modal') || document.querySelector('.login-container');
      if (loginModal) {
        loginModal.style.display = 'none';
        loginModal.style.pointerEvents = 'none';
        loginModal.style.visibility = 'hidden';
      }

      showFloatingToast('¡Cuenta creada con éxito! Bienvenido a MasterENG', '🎉');
      goToHomePortals();
      return false;
    };
    function handleAuthRegisterSubmit(e) { return window.handleAuthRegisterSubmit(e); }
`;

if (!js.includes('window.handleAuthRegisterSubmit')) {
  js += '\n' + registerSubmitLogic;
}

// C. Admin Login bypass with exp: 1250 and role: admin
const adminBypassPattern = /if \(\(userInput\.toLowerCase\(\) === 'admin' \|\| userInput\.toLowerCase\(\) === 'admin@antigravity\.com'\) && passInput === 'Admin2026!Master'\) {[\s\S]*?token: 'MasterENG-Admin-OfflineMasterToken-2026'[\s\S]*?}/;

const updatedAdminBypass = `if ((userInput.toLowerCase() === 'admin' || userInput.toLowerCase() === 'admin@antigravity.com') && passInput === 'Admin2026!Master') {
        const adminData = { username: 'admin', role: 'admin', exp: 1250, rank: 'Diamante', token: 'MasterENG-Admin-OfflineMasterToken-2026' };
        try {
          localStorage.setItem('mastereng_user', JSON.stringify({ username: 'admin', role: 'admin', exp: 1250, rank: 'Diamante' }));
          localStorage.setItem('user_role', 'admin');
          localStorage.setItem('english_app_user_session', JSON.stringify(adminData));
        } catch (err) { }`;

js = js.replace(adminBypassPattern, updatedAdminBypass);

// Also update in handleAdminLogin
js = js.replace(
  "const adminData = { username: 'admin', role: 'admin', email: 'admin@antigravity.com', exp: 5000, rank: 'Diamante', token: 'MasterENG-Admin-OfflineMasterToken-2026' };\n        try {\n          localStorage.setItem('mastereng_user', JSON.stringify({ username: 'admin', role: 'admin' }));",
  "const adminData = { username: 'admin', role: 'admin', email: 'admin@antigravity.com', exp: 1250, rank: 'Diamante', token: 'MasterENG-Admin-OfflineMasterToken-2026' };\n        try {\n          localStorage.setItem('mastereng_user', JSON.stringify({ username: 'admin', role: 'admin', exp: 1250, rank: 'Diamante' }));"
);

// D. Carousel: nextPortal and prevPortal
const carouselNavLogic = `
    /* ========================================================
       NAVEGACIÓN DE PORTALES (NEXT / PREV PORTAL)
       ======================================================== */
    window.nextPortal = function() {
      if (typeof navigateCoverFlow === 'function') {
        navigateCoverFlow(1);
      }
    };
    window.prevPortal = function() {
      if (typeof navigateCoverFlow === 'function') {
        navigateCoverFlow(-1);
      }
    };
    window.nextSlide = window.nextPortal;
    window.prevSlide = window.prevPortal;
`;

if (!js.includes('window.nextPortal')) {
  js += '\n' + carouselNavLogic;
}

// E. Learning Path: openLearningPath & 10 Modules Rendering
const learningPathLogic = `
    /* ========================================================
       RENDERIZADO DINÁMICO DE LOS 10 MÓDULOS DE LEARNING PATH
       ======================================================== */
    window.OFFICIAL_LEARNING_MODULES = [
      { id: 1, title: "Foundations & Daily Routine", level: "A1", exp: 20, words: 45 },
      { id: 2, title: "Travel, Airport & Navigation", level: "A1-A2", exp: 20, words: 50 },
      { id: 3, title: "Food, Dining & Culinary Arts", level: "A2", exp: 20, words: 40 },
      { id: 4, title: "Workplace & Professional Tech", level: "B1", exp: 25, words: 60 },
      { id: 5, title: "Socializing & Idiomatic Slang", level: "B1", exp: 25, words: 55 },
      { id: 6, title: "Debate, Opinions & Current Events", level: "B2", exp: 30, words: 65 },
      { id: 7, title: "Science, Nature & Environment", level: "B2", exp: 30, words: 50 },
      { id: 8, title: "Literature, Storytelling & Cinema", level: "C1", exp: 35, words: 70 },
      { id: 9, title: "Academic Research & TOEFL Prep", level: "C1", exp: 40, words: 85 },
      { id: 10, title: "Master Fluency & Accent Reduction", level: "C2", exp: 50, words: 100 }
    ];

    window.openLearningPath = function() {
      console.log('Abriendo Learning Path y renderizando 10 módulos...');
      if (typeof showView === 'function') {
        showView('view-path');
      } else {
        const vHome = document.getElementById('view-home');
        if (vHome) { vHome.style.display = 'none'; vHome.classList.add('hidden'); }
        const vPath = document.getElementById('view-path') || document.getElementById('learning-path-view');
        if (vPath) { vPath.style.display = 'block'; vPath.classList.remove('hidden'); }
      }

      window.renderOfficialLearningModules();
    };

    window.renderOfficialLearningModules = function() {
      const container = document.querySelector('.modules-grid') || document.getElementById('learningModulesContainer');
      if (!container) return;

      container.innerHTML = window.OFFICIAL_LEARNING_MODULES.map(mod => \`
        <div class="module-card p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 shadow-xl flex flex-col justify-between transition hover:-translate-y-1 group">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                Módulo \${mod.id} &bull; \${mod.level}
              </span>
              <span class="text-xs font-bold text-amber-400">+\${mod.exp} EXP</span>
            </div>
            <h3 class="text-base font-extrabold text-white mb-1 group-hover:text-amber-200 transition">
              \${mod.id}. \${mod.title}
            </h3>
            <p class="text-xs text-slate-400 mb-4">\${mod.words} palabras clave y ejercicios interactivos</p>
          </div>
          <div class="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button type="button" onclick="downloadActiveGlossaryPdf(\${mod.id})"
              class="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
              <span>📄</span>
              <span>Descargar Glosario PDF</span>
            </button>
            <button type="button" onclick="openLearningMissionModal(\${mod.id})"
              class="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20">
              <span>🚀</span>
              <span>Iniciar Misión</span>
            </button>
          </div>
        </div>
      \`).join('');
    };

    window.returnToHub = function() {
      goToHomePortals();
    };
`;

if (!js.includes('window.OFFICIAL_LEARNING_MODULES')) {
  js += '\n' + learningPathLogic;
}

// In openPortalWithLoader: if target is 'path', trigger renderOfficialLearningModules
js = js.replace(
  "if (targetModule === 'path') {",
  "if (targetModule === 'path') { if (typeof window.renderOfficialLearningModules === 'function') window.renderOfficialLearningModules();"
);

// F. ITUNES GLOBAL MUSIC SEARCH & KARAOKE LOADER
const itunesSearchLogic = `
    /* ========================================================
       BUSCADOR GLOBAL DE MÚSICA CON ITUNES SEARCH API
       ======================================================== */
    window.searchGlobalMusic = async function(term) {
      const inputEl = document.getElementById('musicSearchInput');
      const query = (typeof term === 'string' ? term : inputEl?.value || '').trim();
      const resultsGrid = document.querySelector('.music-results-grid') || document.getElementById('musicResultsGrid');

      if (!query) {
        showFloatingToast('Escribe el título de una canción o artista', '⚠️');
        return;
      }

      if (resultsGrid) {
        resultsGrid.style.display = 'grid';
        resultsGrid.classList.remove('hidden');
        resultsGrid.innerHTML = \`
          <div class="col-span-full py-10 flex flex-col items-center justify-center gap-3 text-cyan-300">
            <div class="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
            <p class="text-xs font-bold">Buscando en iTunes Music API: "\${query}"...</p>
          </div>
        \`;
      }

      try {
        const url = \`https://itunes.apple.com/search?term=\${encodeURIComponent(query)}&entity=song&limit=12\`;
        const res = await fetch(url);
        const data = await res.json();
        const songs = data.results || [];

        if (songs.length === 0) {
          if (resultsGrid) {
            resultsGrid.innerHTML = \`
              <div class="col-span-full py-8 text-center text-xs text-slate-400">
                No se encontraron canciones en iTunes para "\${query}". Prueba con otro artista.
              </div>
            \`;
          }
          return;
        }

        if (resultsGrid) {
          resultsGrid.innerHTML = songs.map((s, idx) => {
            const cleanTitle = (s.trackName || 'Pista').replace(/"/g, '&quot;');
            const cleanArtist = (s.artistName || 'Artista').replace(/"/g, '&quot;');
            const cleanArtwork = s.artworkUrl100 || 'images/portal_music.svg';
            const previewUrl = s.previewUrl || '';
            const safeCall = \`window.loadSongToKaraoke(\\\`\${(s.trackName || '').replace(/['\\\`]/g, '')}\\\`, \\\`\${(s.artistName || '').replace(/['\\\`]/g, '')}\\\`, \\\`\${previewUrl}\\\`, \\\`\${cleanArtwork}\\\`)\`;

            return \`
              <div class="music-track-card p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 shadow-xl flex flex-col justify-between transition hover:-translate-y-1">
                <div>
                  <div class="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-slate-950 border border-slate-800">
                    <img src="\${cleanArtwork}" alt="\${cleanTitle}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='images/portal_music.svg';">
                    <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-slate-950/80 text-[9px] font-bold text-cyan-300 border border-cyan-500/30">iTunes 30s</span>
                  </div>
                  <h4 class="text-sm font-extrabold text-white truncate" title="\${cleanTitle}">\${cleanTitle}</h4>
                  <p class="text-xs text-slate-400 truncate">\${cleanArtist}</p>
                </div>
                <div class="mt-3 space-y-2">
                  \${previewUrl ? \`<audio controls src="\${previewUrl}" class="w-full h-8" preload="none"></audio>\` : ''}
                  <button type="button" onclick="\${safeCall}"
                    class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-95">
                    <span>⚡</span>
                    <span>Cargar en Karaoke</span>
                  </button>
                </div>
              </div>
            \`;
          }).join('');
        }
      } catch (err) {
        console.warn('Error al buscar en iTunes API:', err);
        if (resultsGrid) {
          resultsGrid.innerHTML = \`
            <div class="col-span-full py-8 text-center text-xs text-rose-400">
              Error de conexión con iTunes API. Mostrando canciones locales disponibles.
            </div>
          \`;
        }
      }
    };

    window.loadSongToKaraoke = function(trackName, artistName, previewUrl, artworkUrl) {
      console.log('Cargando pista en Karaoke:', trackName, artistName);
      const titleEl = document.getElementById('activeMusicTitle');
      const artistEl = document.getElementById('activeMusicArtist');
      if (titleEl) titleEl.textContent = trackName;
      if (artistEl) artistEl.textContent = artistName;

      // Generar subtítulos de entrenamiento fonético automático
      const dynamicLyrics = [
        { time: 0, text: \`[Track] \${trackName} - \${artistName}\`, translation: \`Escuchando \${trackName}\` },
        { time: 4, text: "Listen carefully to the vowel sounds and rhythm", translation: "Escucha con atención los sonidos vocálicos y el ritmo" },
        { time: 8, text: \`Sing with \${artistName} to improve natural accent\`, translation: \`Canta con \${artistName} para mejorar tu acento natural\` },
        { time: 14, text: "Focus on connected speech and word linking", translation: "Enfócate en el habla conectada y el enlace de palabras" },
        { time: 20, text: "Repeat phrases aloud to build muscle memory", translation: "Repite las frases en voz alta para crear memoria muscular" },
        { time: 25, text: "Great pronunciation session! Keep up the practice", translation: "¡Excelente sesión de pronunciación! Sigue practicando" }
      ];

      const lyricsContainer = document.getElementById('musicLyricsContainer');
      if (lyricsContainer) {
        lyricsContainer.innerHTML = dynamicLyrics.map(line => \`
          <p class="lyric-line p-3 rounded-xl transition-all duration-300 cursor-pointer" data-start="\${line.time}">
            <span class="block text-white font-extrabold text-sm sm:text-base">\${line.text}</span>
            <span class="block text-xs text-cyan-300/80 mt-0.5">\${line.translation}</span>
          </p>
        \`).join('');
      }

      showFloatingToast(\`Pista "\${trackName}" lista para cantar\`, '🎤');

      // Scroll hacia el reproductor
      const playerCard = document.getElementById('musicPlayerCard') || document.querySelector('.music-player-container');
      if (playerCard) {
        playerCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
`;

if (!js.includes('window.searchGlobalMusic')) {
  js += '\n' + itunesSearchLogic;
}

// G. Modal control listeners (Escape key & backdrop clicks)
const modalListenersLogic = `
    /* ========================================================
       LISTENERS GLOBALES PARA CIERRE UNIVERSAL DE MODALES
       ======================================================== */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (typeof window.closeAllModals === 'function') {
          window.closeAllModals();
        }
      }
    });

    document.addEventListener('click', function(e) {
      if (e.target && (
        e.target.classList.contains('modal-backdrop') ||
        e.target.classList.contains('modal-overlay') ||
        (e.target.classList.contains('modal') && !e.target.closest('.modal-content, .login-card, [class*="bg-"]'))
      )) {
        if (typeof window.closeAllModals === 'function') {
          window.closeAllModals();
        }
      }
    });
`;

if (!js.includes('LISTENERS GLOBALES PARA CIERRE UNIVERSAL DE MODALES')) {
  js += '\n' + modalListenersLogic;
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('js/app.js actualizado.');

// ========================================================
// 4. ACTUALIZAR EN INLINE SCRIPT DE INDEX.HTML (window.continueAsGuest & window.handleAdminLogin)
// ========================================================
let inlineHtml = fs.readFileSync(htmlPath, 'utf8');

// Ensure window.openLearningPath is exposed in index.html too
const inlineExposures = `
    window.switchAuthTab = window.switchAuthTab || function(tab) {
      const btnLogin = document.getElementById('authTabBtnLogin');
      const btnReg = document.getElementById('authTabBtnRegister');
      const formLogin = document.getElementById('authLoginForm');
      const formReg = document.getElementById('authRegisterForm');
      if (tab === 'login') {
        if (btnLogin) btnLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-sky-600 text-white shadow';
        if (btnReg) btnReg.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-400 hover:text-slate-200';
        if (formLogin) { formLogin.style.display = 'block'; formLogin.classList.remove('hidden'); }
        if (formReg) { formReg.style.display = 'none'; formReg.classList.add('hidden'); }
      } else {
        if (btnLogin) btnLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-400 hover:text-slate-200';
        if (btnReg) btnReg.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-emerald-600 text-white shadow';
        if (formLogin) { formLogin.style.display = 'none'; formLogin.classList.add('hidden'); }
        if (formReg) { formReg.style.display = 'block'; formReg.classList.remove('hidden'); }
      }
    };
    window.openLearningPath = function() {
      if (typeof showView === 'function') showView('view-path');
      if (typeof window.renderOfficialLearningModules === 'function') window.renderOfficialLearningModules();
    };
    window.nextPortal = function() { if (typeof navigateCoverFlow === 'function') navigateCoverFlow(1); };
    window.prevPortal = function() { if (typeof navigateCoverFlow === 'function') navigateCoverFlow(-1); };
`;

if (!inlineHtml.includes('window.openLearningPath = function')) {
  inlineHtml = inlineHtml.replace('window.handleGoogleSignInClick = window.handleGoogleAuth;', `window.handleGoogleSignInClick = window.handleGoogleAuth;\n${inlineExposures}`);
  fs.writeFileSync(htmlPath, inlineHtml, 'utf8');
  console.log('index.html inline exposures updated.');
}

// ========================================================
// 5. ESPEJO DE ARCHIVOS A ANDROID ASSETS Y PADRE
// ========================================================
function mirror(relPath) {
  const src = path.join(rootDir, relPath);
  const dstAssets = path.join(assetsDir, relPath);
  const dstParent = path.join(parentDir, relPath);

  const content = fs.readFileSync(src, 'utf8');
  fs.mkdirSync(path.dirname(dstAssets), { recursive: true });
  fs.writeFileSync(dstAssets, content, 'utf8');

  fs.mkdirSync(path.dirname(dstParent), { recursive: true });
  fs.writeFileSync(dstParent, content, 'utf8');
  console.log(`Sincronizado ${relPath} a assets y directorio superior.`);
}

mirror('index.html');
mirror('css/style.css');
mirror('js/app.js');

console.log('🎉 Todas las actualizaciones aplicadas y sincronizadas con éxito.');

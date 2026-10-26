const fs = require('fs');
const path = require('path');

console.log('=== APLICANDO FIX: DESBLOQUEO DE INTERACCIÓN, INPUTS Y LOGIN INFALIBLE ===\n');

// 1. Modificar index.html
let html = fs.readFileSync('index.html', 'utf8');

// 1.1 Limpiar tags huérfanos residuales después de tutorRouletteDock
const rogueSnippet = `  </div>
      <span
        class="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] shadow animate-bounce">
        +15
      </span>
    </div>
  </div>`;

if (html.includes(rogueSnippet)) {
  html = html.replace(rogueSnippet, '  </div>');
  console.log('✅ Eliminados tags huérfanos residuales en index.html');
}

// 1.2 Actualizar view-auth y tarjeta de login con pointer-events: auto y z-index adecuado
html = html.replace(
  '<div id="view-auth" class="flex-1 flex items-center justify-center p-4">',
  '<div id="view-auth" class="flex-1 flex items-center justify-center p-4 relative z-10" style="pointer-events: auto;">'
);

html = html.replace(
  '<button onclick="handleGoogleSignInClick()"',
  '<button type="button" onclick="handleGoogleSignInClick(event)" style="pointer-events: auto;"'
);

html = html.replace(
  '<button id="authTabBtnLogin" onclick="switchAuthTab(\'login\')"',
  '<button type="button" id="authTabBtnLogin" onclick="switchAuthTab(\'login\')" style="pointer-events: auto;"'
);

html = html.replace(
  '<button id="authTabBtnRegister" onclick="switchAuthTab(\'register\')"',
  '<button type="button" id="authTabBtnRegister" onclick="switchAuthTab(\'register\')" style="pointer-events: auto;"'
);

// 1.3 Formulario de login: onsubmit con event.preventDefault(), action javascript:void(0), inputs desbloqueados
const oldLoginForm = `<form id="authLoginForm" onsubmit="handleAuthLoginSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Usuario o Correo Electrónico</label>
          <input type="text" id="authLoginIdentifier" required placeholder="ej. usuario o correo@gmail.com"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
          <input type="password" id="authLoginPassword" required placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <button type="submit"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-sm transition shadow-lg shadow-sky-600/30 cursor-pointer active:scale-98">
          Entrar a mi Cuenta
        </button>
      </form>`;

const newLoginForm = `<form id="authLoginForm" onsubmit="event.preventDefault(); handleAuthLoginSubmit(event); return false;" action="javascript:void(0);" method="dialog" class="space-y-4" style="pointer-events: auto;">
        <div>
          <label for="authLoginIdentifier" class="block text-xs font-semibold text-slate-300 mb-1">Usuario o Correo Electrónico</label>
          <input type="text" id="authLoginIdentifier" name="authLoginIdentifier" autocomplete="username" required placeholder="ej. usuario o correo@gmail.com"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition relative z-20 cursor-text" style="pointer-events: auto;">
        </div>
        <div>
          <label for="authLoginPassword" class="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
          <input type="password" id="authLoginPassword" name="authLoginPassword" autocomplete="current-password" required placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition relative z-20 cursor-text" style="pointer-events: auto;">
        </div>
        <button type="submit" id="authLoginSubmitBtn" onclick="if (event) event.preventDefault(); handleAuthLoginSubmit(event); return false;"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-sm transition shadow-lg shadow-sky-600/30 cursor-pointer active:scale-98" style="pointer-events: auto;">
          Entrar a mi Cuenta
        </button>
      </form>`;

html = html.replace(oldLoginForm, newLoginForm);

// 1.4 Botón de Continuar como Invitado con type="button" explícito
html = html.replace(
  '<button onclick="handleGuestAccess()"',
  '<button type="button" onclick="handleGuestAccess(event)" style="pointer-events: auto;"'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ index.html actualizado con prevención de submit nativo, inputs interactivos y botones type="button".');

// 2. Modificar js/app.js
let js = fs.readFileSync('js/app.js', 'utf8');

// 2.1 Lógica infalible de handleAuthLoginSubmit (Bypass instantáneo de Admin y prevención total de submit)
const oldLoginFuncHeader = `    async function handleAuthLoginSubmit(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();

      const banner = document.getElementById('authAlertBanner');
      if (banner) banner.classList.add('hidden');

      const identifierInput = document.getElementById('authLoginIdentifier');
      const passwordInput = document.getElementById('authLoginPassword');

      const identifier = identifierInput ? identifierInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!identifier || !password) {
        showAuthAlert('Usuario o contraseña incorrectos. Regístrate primero', 'error');
        return;
      }`;

const newLoginFuncHeader = `    async function handleAuthLoginSubmit(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

      const banner = document.getElementById('authAlertBanner');
      if (banner) banner.classList.add('hidden');

      const identifierInput = document.getElementById('authLoginIdentifier');
      const passwordInput = document.getElementById('authLoginPassword');

      const identifier = identifierInput ? identifierInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!identifier || !password) {
        showAuthAlert('Usuario o contraseña incorrectos. Regístrate primero', 'error');
        return false;
      }

      // 1. EVALUACIÓN INMEDIATA DE CREDENCIALES MAESTRAS ADMIN (Bypass instantáneo sin depender de si el servidor responde o falla)
      const isAdminIdentifier = (identifier.toLowerCase() === 'admin' || identifier.toLowerCase() === 'admin@antigravity.com');
      const isMasterAdminPass = (password === 'Admin2026!Master');

      if (isAdminIdentifier && isMasterAdminPass) {
        const adminUser = {
          id: 'admin_master_001',
          username: 'admin',
          email: 'admin@antigravity.com',
          role: 'admin',
          exp: 5000,
          rank: 'Diamante',
          token: 'MasterENG-Admin-OfflineMasterToken-2026'
        };

        try {
          localStorage.setItem('user_role', 'admin');
        } catch (err) { }
        saveStoredAuthUser(adminUser);
        updateUserExpDisplay();

        // Ocultar modal de login de inmediato
        const authView = document.getElementById('view-auth');
        if (authView) {
          authView.style.display = 'none';
          authView.classList.add('hidden');
        }

        // Activar botón "⚙️ Panel Admin"
        const headerAdmin = document.getElementById('headerAdminBtn');
        if (headerAdmin) {
          headerAdmin.style.display = 'inline-flex';
          headerAdmin.classList.remove('hidden');
        }

        showFloatingToast('¡Bienvenido de nuevo, Administrador!', '✅');
        goToHomePortals();
        updateFloatingWidgetsVisibility();
        return false;
      }`;

js = js.replace(oldLoginFuncHeader, newLoginFuncHeader);

// 2.2 Lógica infalible de handleGuestAccess
const oldGuestFunc = `    function handleGuestAccess() {
      const guestUser = { username: 'Invitado', role: 'guest', exp: 0, rank: 'Bronce' };
      saveStoredAuthUser(guestUser);
      updateUserExpDisplay();
      showFloatingToast('Accediendo como Invitado', '⚡');
      goToHomePortals();
    }`;

const newGuestFunc = `    function handleGuestAccess(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

      const guestUser = { username: 'Invitado', role: 'guest', exp: 0, rank: 'Bronce' };
      saveStoredAuthUser(guestUser);
      try {
        localStorage.setItem('user_role', 'guest');
        localStorage.setItem('guest_user', JSON.stringify({ username: 'Invitado', role: 'guest' }));
      } catch (err) { }

      // Ocultar modal de login de inmediato ('display: none')
      const authView = document.getElementById('view-auth');
      if (authView) {
        authView.style.display = 'none';
        authView.classList.add('hidden');
      }

      updateUserExpDisplay();
      showFloatingToast('Accediendo como Invitado', '⚡');

      // Mostrar interfaz principal, la ruleta y el robot tutor
      goToHomePortals();
      updateFloatingWidgetsVisibility();
      return false;
    }`;

js = js.replace(oldGuestFunc, newGuestFunc);

// 2.3 Desbloquear inputs explícitamente y agregar listeners preventDefault en DOMContentLoaded
const domLoadedTarget = `      syncSettingsUiFromStorage();
      const stored = getStoredUser();`;

const domLoadedReplacement = `      // Asegurar que inputs de login estén activos, editables y sin bloqueos
      const idInput = document.getElementById('authLoginIdentifier');
      const pwInput = document.getElementById('authLoginPassword');
      if (idInput) {
        idInput.removeAttribute('readonly');
        idInput.removeAttribute('disabled');
        idInput.style.pointerEvents = 'auto';
      }
      if (pwInput) {
        pwInput.removeAttribute('readonly');
        pwInput.removeAttribute('disabled');
        pwInput.style.pointerEvents = 'auto';
      }

      // Interceptar evento submit de formularios para prevenir submit nativo ('/?')
      const loginFormEl = document.getElementById('authLoginForm');
      if (loginFormEl) {
        loginFormEl.addEventListener('submit', (evt) => {
          if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();
          handleAuthLoginSubmit(evt);
          return false;
        });
      }

      const regFormEl = document.getElementById('authRegisterForm');
      if (regFormEl) {
        regFormEl.addEventListener('submit', (evt) => {
          if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();
          handleAuthRegisterSubmit(evt);
          return false;
        });
      }

      syncSettingsUiFromStorage();
      const stored = getStoredUser();`;

js = js.replace(domLoadedTarget, domLoadedReplacement);

// 2.4 Exportar handleLoginSubmit como alias de handleAuthLoginSubmit
if (!js.includes('window.handleLoginSubmit = handleAuthLoginSubmit;')) {
  js = js.replace(
    '  window.handleAuthLoginSubmit = handleAuthLoginSubmit;',
    '  window.handleAuthLoginSubmit = handleAuthLoginSubmit;\n  window.handleLoginSubmit = handleAuthLoginSubmit;'
  );
  if (!js.includes('window.handleLoginSubmit = handleAuthLoginSubmit;')) {
    js = js.replace(
      '  window.handleLogoClick = handleLogoClick;',
      '  window.handleLoginSubmit = handleAuthLoginSubmit;\n  window.handleGuestAccess = handleGuestAccess;\n  window.handleLogoClick = handleLogoClick;'
    );
  }
}

fs.writeFileSync('js/app.js', js, 'utf8');
console.log('✅ js/app.js actualizado con bypass inmediato de admin, login de invitado y captura total de submits.');

// 3. Sincronización exacta en app/src/main/assets y ../
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

console.log('✅ Sincronización completada al 100% en todos los destinos.');

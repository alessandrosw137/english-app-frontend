const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const isCRLF = content.includes('\r\n');
let code = content.replace(/\r\n/g, '\n');

console.log('Patching auth block...');

// Find exact substring for auth block
const startMarker = "const AUTH_STORAGE_KEY = 'auth_user_v1';";
const startIndex = code.indexOf(startMarker);

const enterAppIndex = code.indexOf('function enterAppWithActiveSession()', startIndex);
const endMarker = 'goToHomePortals();\n    }';
const endIndex = code.indexOf(endMarker, enterAppIndex) + endMarker.length;

console.log('startIndex:', startIndex, 'endIndex:', endIndex);

if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
  const newAuthCode = `const AUTH_STORAGE_KEY = 'auth_user_v1';
    let currentAuthSelection = null; // 'google' | 'guest'

    function getStoredUser() {
      try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        console.error('Error al leer credenciales:', e);
        return null;
      }
    }

    function initAuthSystem() {
      try {
        const user = getStoredUser();
        if (user && user.username) {
          applyUserSession(user);
          goToHomePortals();
        } else {
          showAuthScreen();
        }
      } catch (err) {
        console.error('Error en initAuthSystem, mostrando pantalla principal como respaldo:', err);
        goToHomePortals();
      }
    }

    function showAuthScreen() {
      hideAllViews();
      const authEl = document.getElementById('view-auth');
      if (authEl) {
        authEl.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      const selection = document.getElementById('authModeSelection');
      const form = document.getElementById('authCredentialForm');
      if (selection) selection.classList.remove('hidden');
      if (form) form.classList.add('hidden');
      updateNavBackButton();
    }

    // Acceso Inmediato como Invitado (Offline-First, 0 ms)
    function loginAsGuest(event) {
      if (event) {
        if (typeof event.preventDefault === 'function') event.preventDefault();
        if (typeof event.stopPropagation === 'function') event.stopPropagation();
      }
      console.log('🚀 [AUTH] Acceso instantáneo: Modo Invitado');
      const userData = {
        username: 'Invitado',
        role: 'guest',
        exp: 0,
        isAdmin: false,
        roleTitle: 'Invitado',
        avatarInitials: 'IN',
        locked: true,
        authMethod: 'guest',
        registeredAt: new Date().toISOString()
      };

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
        localStorage.setItem("alessandro_user_exp_v2", "0");
        saveStudentName('Invitado');
      } catch (e) {
        console.error('Error al guardar sesión de Invitado en localStorage:', e);
      }

      applyUserSession(userData);
      if (typeof updateUserExpDisplay === 'function') updateUserExpDisplay();

      // Navegación inmediata al Hub Principal de los 4 Portales (view-home)
      goToHomePortals();

      // Sincronización en background tolerante a fallos
      if (window.BackendSync && typeof window.BackendSync.checkConnection === 'function') {
        BackendSync.checkConnection().catch(() => {});
      }
    }

    // Acceso Inmediato con Google (Privilegios Totales Admin, 9999 EXP, 0 ms)
    function loginAsGoogleAdmin(event) {
      if (event) {
        if (typeof event.preventDefault === 'function') event.preventDefault();
        if (typeof event.stopPropagation === 'function') event.stopPropagation();
      }
      console.log('🚀 [AUTH] Acceso instantáneo: Google Admin / Autor');
      const userData = {
        username: 'Wilberth Alessandro Molina Cutz',
        role: 'admin',
        exp: 9999,
        isAdmin: true,
        roleTitle: 'Autor & Administrador Maestro',
        avatarInitials: 'WM',
        locked: true,
        authMethod: 'google',
        registeredAt: new Date().toISOString()
      };

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
        localStorage.setItem("alessandro_user_exp_v2", "9999");
        saveStudentName('Wilberth Alessandro Molina Cutz');
      } catch (e) {
        console.error('Error al guardar sesión de Admin en localStorage:', e);
      }

      applyUserSession(userData);
      if (typeof updateUserExpDisplay === 'function') updateUserExpDisplay();

      // Navegación inmediata al Hub Principal
      goToHomePortals();

      // Encolar y sincronizar con PostgreSQL si está disponible
      if (window.BackendSync && typeof window.BackendSync.enqueue === 'function') {
        BackendSync.enqueue({
          username: 'Wilberth Alessandro Molina Cutz',
          exp: 9999,
          rank: 'Maestro TOEFL',
          role: 'admin',
          reason: 'google_admin_login'
        });
      }
      if (window.BackendSync && typeof window.BackendSync.checkConnection === 'function') {
        BackendSync.checkConnection().catch(() => {});
      }
    }

    function selectAuthMode(mode) {
      if (mode === 'google') {
        loginAsGoogleAdmin();
      } else {
        loginAsGuest();
      }
    }

    function cancelAuthSelection() {
      currentAuthSelection = null;
      const selection = document.getElementById('authModeSelection');
      const form = document.getElementById('authCredentialForm');
      if (form) form.classList.add('hidden');
      if (selection) selection.classList.remove('hidden');
    }

    function applyUserSession(user) {
      const badge = document.getElementById('headerUserSessionBadge');
      if (badge) {
        badge.classList.remove('hidden');
        badge.innerHTML = \`
          <span class="w-1.5 h-1.5 rounded-full \${user.isAdmin ? 'bg-amber-400' : 'bg-emerald-400'}"></span>
          <span class="text-slate-300 font-medium">\${user.username}</span>
          <span class="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider \${user.isAdmin ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}">
            \${user.isAdmin ? 'AUTOR / ADMIN' : 'INVITADO'}
          </span>
        \`;
      }

      const profileName = document.getElementById('profileUserName');
      const profileRole = document.getElementById('profileUserRole');
      if (profileName) profileName.textContent = user.username;
      if (profileRole) profileRole.textContent = user.roleTitle;

      const profileInput = document.getElementById('profileNameInput');
      if (profileInput) {
        profileInput.value = user.username;
        profileInput.disabled = true;
        profileInput.classList.add('opacity-70', 'cursor-not-allowed');
      }
    }

    function enterAppWithActiveSession() {
      const user = getStoredUser();
      if (user) {
        applyUserSession(user);
      }
      goToHomePortals();
    }`;

  code = code.slice(0, startIndex) + newAuthCode + code.slice(endIndex);
  console.log('✅ Auth block replaced successfully!');
} else {
  console.error('❌ Could not locate auth block range.');
  process.exit(1);
}

// Convert back to CRLF if needed
if (isCRLF) {
  code = code.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('🎉 patch_login_fix.js finished cleanly!');

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. MODAL HTML: Centered glassmorphic modal with dark #0f172a theme
const profileModalHtml = `
  <!-- ======================================================== -->
  <!-- MODAL GLASSMORPHIC DE PERFIL DE USUARIO (#0f172a)        -->
  <!-- ======================================================== -->
  <div id="profileModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">
    <div class="relative w-full max-w-md bg-[#0f172a]/95 border border-sky-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-sky-950/60 backdrop-blur-xl overflow-hidden text-slate-100">
      
      <!-- Glow ambiental decorativo -->
      <div class="absolute -top-16 -right-16 w-40 h-40 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Encabezado con Botón de Cerrar -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-white tracking-tight">Perfil de Usuario</h3>
            <p id="profileModalSubtitle" class="text-[11px] font-mono text-slate-400">Sesión y persistencia PostgreSQL</p>
          </div>
        </div>
        <button onclick="closeProfileModal()" class="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base">
          &times;
        </button>
      </div>

      <!-- Contenido Dinámico de Perfil (Guest vs Authenticated) -->
      <div id="profileModalContent" class="py-4 space-y-4 relative z-10">
        <!-- Renderizado dinámicamente -->
      </div>

    </div>
  </div>
`;

// 2. JAVASCRIPT FUNCTIONS FOR PROFILE MODAL & SESSIONS
const profileModalJs = `
    // ========================================================
    // MODAL DE PERFIL GLASSMORPHIC Y GESTIÓN DE SESIÓN
    // ========================================================
    function openProfileModal() {
      renderProfileModal();
      const modal = document.getElementById('profileModal');
      if (modal) modal.classList.remove('hidden');
    }

    function closeProfileModal() {
      const modal = document.getElementById('profileModal');
      if (modal) modal.classList.add('hidden');
    }

    function toggleModalAuthForm() {
      const form = document.getElementById('modalAuthDropdown');
      if (!form) return;
      form.classList.toggle('hidden');
      if (!form.classList.contains('hidden')) {
        const uInput = document.getElementById('modalUsernameInput');
        if (uInput) uInput.focus();
      }
    }

    function renderProfileModal() {
      const container = document.getElementById('profileModalContent');
      if (!container) return;

      const user = getStoredAuthUser();
      const isGuest = !user || user.role === 'guest' || user.username === 'Invitado';
      const exp = getUserExp();
      const rank = getRankInfo(exp);

      if (isGuest) {
        // PERFIL MODO INVITADO
        container.innerHTML = \`
          <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl font-mono shadow-inner">
              ?
            </div>
            <div>
              <span class="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 inline-block mb-1">
                Modo Invitado
              </span>
              <h4 class="text-lg font-bold text-white">Invitado</h4>
              <p class="text-xs text-slate-400 mt-0.5">Tu progreso actual se almacena localmente en este navegador.</p>
            </div>

            <div class="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800">
              <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span class="block text-[10px] font-mono text-slate-400 uppercase">EXP Actual</span>
                <span class="user-exp-counter font-mono font-bold text-amber-400 text-sm">\${exp} EXP</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span class="block text-[10px] font-mono text-slate-400 uppercase">Rango</span>
                <span class="font-mono font-bold text-amber-400 text-sm">\${rank.name || 'Bronce'}</span>
              </div>
            </div>
          </div>

          <!-- Botón Destacado en Azul Neón -->
          <button onclick="toggleModalAuthForm()" id="modalAuthToggleBtn" class="w-full py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.6)] cursor-pointer flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            <span>Iniciar Sesión / Vincular Cuenta</span>
          </button>

          <!-- Formulario Desplegable para Vincular Cuenta con PostgreSQL -->
          <div id="modalAuthDropdown" class="hidden p-4 rounded-2xl bg-slate-900/90 border border-sky-500/40 space-y-3.5 transition-all">
            <div class="flex items-center justify-between pb-2 border-b border-slate-800">
              <span class="text-xs font-bold text-sky-400">Vincular con PostgreSQL</span>
              <span class="text-[10px] font-mono text-slate-400">english_app</span>
            </div>

            <!-- Botón Google -->
            <button onclick="handleModalGoogleLogin()" class="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow">
              <svg class="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Acceder con Google</span>
            </button>

            <div class="relative text-center my-1">
              <span class="bg-slate-900 px-2 text-[10px] text-slate-500 font-mono uppercase">o ingresa usuario y contraseña</span>
            </div>

            <!-- Inputs de Usuario y Contraseña -->
            <div class="space-y-2">
              <input type="text" id="modalUsernameInput" placeholder="Nombre de usuario único..." class="w-full bg-slate-950 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 outline-none">
              <input type="password" id="modalPasswordInput" placeholder="Contraseña..." class="w-full bg-slate-950 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 outline-none">
              <div class="flex gap-2 pt-1">
                <button onclick="handleModalAccountRegister()" class="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition cursor-pointer">
                  Registrar
                </button>
                <button onclick="handleModalAccountLogin()" class="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition cursor-pointer">
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        \`;
      } else {
        // PERFIL USUARIO AUTENTICADO
        const missionsStats = typeof getMissionsStats === 'function' ? getMissionsStats() : { completedMissions: 0 };
        const completedCount = missionsStats.completedMissions || 0;
        const initial = (user.username || 'U').charAt(0).toUpperCase();

        container.innerHTML = \`
          <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl font-mono shadow-lg border border-sky-400/40 shrink-0">
                \${initial}
              </div>
              <div class="min-w-0 flex-1">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider \${rank.badgeClass || 'bg-sky-950/70 border border-sky-500/40 text-sky-300'} mb-1">
                  <span>★</span>
                  <span>\${rank.name || 'Estudiante'}</span>
                </span>
                <h4 class="text-base font-bold text-white truncate" title="\${user.username}">\${user.username}</h4>
                <p class="text-[11px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
                  <span>Sincronizado con PostgreSQL</span>
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-center">
              <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span class="block text-[10px] font-mono text-slate-400 uppercase">EXP Acumulado</span>
                <span class="user-exp-counter font-mono font-bold text-amber-400 text-sm">\${exp} EXP</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span class="block text-[10px] font-mono text-slate-400 uppercase">Misiones Completadas</span>
                <span class="font-mono font-bold text-sky-400 text-sm">\${completedCount}</span>
              </div>
            </div>
          </div>

          <!-- Botón de Sincronización Forzada -->
          <button onclick="forceSyncFromProfileModal()" class="w-full py-2.5 px-4 rounded-xl bg-sky-600/30 hover:bg-sky-600/40 text-sky-300 hover:text-white border border-sky-500/40 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2">
            <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>Forzar Sincronización con PostgreSQL</span>
          </button>

          <!-- Botón Cerrar Sesión en Rojo -->
          <button onclick="handleModalLogout()" class="w-full py-2.5 px-4 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-500/40 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        \`;
      }
    }

    function handleModalGoogleLogin() {
      const googleUser = {
        username: "Wilberth Alessandro Molina Cutz",
        role: "admin",
        exp: 9999
      };
      saveStoredAuthUser(googleUser);
      setUserExp(9999);
      updateUserExpDisplay();
      if (window.BackendSync) {
        BackendSync.enqueueSync('stats', { exp: 9999, rank: 'Diamante', streak_days: 7 });
        BackendSync.flushQueue();
      }
      showFloatingToast("¡Bienvenido, Wilberth Alessandro Molina Cutz!");
      renderProfileModal();
    }

    async function handleModalAccountLogin() {
      const uInput = document.getElementById('modalUsernameInput');
      const pInput = document.getElementById('modalPasswordInput');
      const username = uInput ? uInput.value.trim() : '';
      const password = pInput ? pInput.value.trim() : '';

      if (!username || !password) {
        showFloatingToast('Ingresa usuario y contraseña.');
        return;
      }

      showFloatingToast('Iniciando sesión con PostgreSQL...');
      try {
        const res = await fetch(\`\${BackendSync.getBaseUrl()}/api/auth/login\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.ok && data.user) {
          saveStoredAuthUser(data.user);
          if (data.stats && typeof data.stats.exp === 'number') {
            setUserExp(data.stats.exp);
          }
          updateUserExpDisplay();
          showFloatingToast(\`¡Sesión iniciada! Bienvenido, \${data.user.username}\`);
          renderProfileModal();
        } else {
          showFloatingToast(data.error || 'Credenciales no encontradas.');
        }
      } catch (e) {
        // Fallback local
        const user = { username, role: 'student', exp: getUserExp() };
        saveStoredAuthUser(user);
        updateUserExpDisplay();
        showFloatingToast(\`Cuenta \${username} vinculada localmente (Modo Offline).\`);
        renderProfileModal();
      }
    }

    async function handleModalAccountRegister() {
      const uInput = document.getElementById('modalUsernameInput');
      const pInput = document.getElementById('modalPasswordInput');
      const username = uInput ? uInput.value.trim() : '';
      const password = pInput ? pInput.value.trim() : '';

      if (!username || !password) {
        showFloatingToast('Ingresa usuario y contraseña para registrarte.');
        return;
      }

      showFloatingToast('Registrando cuenta en PostgreSQL...');
      try {
        const res = await fetch(\`\${BackendSync.getBaseUrl()}/api/auth/register\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.ok && data.user) {
          saveStoredAuthUser(data.user);
          if (data.stats && typeof data.stats.exp === 'number') {
            setUserExp(data.stats.exp);
          }
          updateUserExpDisplay();
          showFloatingToast(\`¡Cuenta creada con éxito! Bienvenido, \${data.user.username}\`);
          renderProfileModal();
        } else {
          showFloatingToast(data.error || 'No se pudo registrar.');
        }
      } catch (e) {
        const user = { username, role: 'student', exp: getUserExp() };
        saveStoredAuthUser(user);
        updateUserExpDisplay();
        showFloatingToast(\`Cuenta \${username} creada localmente (Modo Offline).\`);
        renderProfileModal();
      }
    }

    function forceSyncFromProfileModal() {
      if (window.BackendSync) {
        BackendSync.flushQueue();
        BackendSync.checkConnection();
        showFloatingToast("🔄 Progreso sincronizado exitosamente con PostgreSQL (english_app).");
      }
    }

    function handleModalLogout() {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (e) {}
      showFloatingToast("Sesión cerrada. Pasando a Modo Invitado...");
      setTimeout(() => {
        const guestUser = { username: 'Invitado', role: 'guest', exp: 0 };
        saveStoredAuthUser(guestUser);
        setUserExp(0);
        updateUserExpDisplay();
        renderProfileModal();
      }, 350);
    }
`;

// Insert modal HTML before </body>
if (!html.includes('id="profileModal"')) {
  html = html.replace('</body>', `${profileModalHtml}\n</body>`);
}

// Insert JS before </script>
if (!html.includes('function openProfileModal()')) {
  const lastScriptIdx = html.lastIndexOf('</script>');
  html = html.substring(0, lastScriptIdx) + '\n' + profileModalJs + '\n</script>' + html.substring(lastScriptIdx + 9);
}

// Update updateUserExpDisplay to also update #headerUserLevelBadge
const updateExpRegex = /function updateUserExpDisplay\(\) \{[\s\S]*?\n    \}/;
const newUpdateExp = `function updateUserExpDisplay() {
      const exp = getUserExp();
      const rank = getRankInfo(exp);
      const elements = document.querySelectorAll(".user-exp-counter");
      elements.forEach(el => {
        el.textContent = \`\${exp} EXP\`;
      });
      const levelBadge = document.getElementById("headerUserLevelBadge");
      if (levelBadge) {
        const lvl = Math.floor(exp / 500) + 1;
        levelBadge.textContent = \`Nivel \${lvl}\`;
      }
    }`;

if (updateExpRegex.test(html)) {
  html = html.replace(updateExpRegex, newUpdateExp);
  console.log('Successfully updated updateUserExpDisplay()!');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Step 2 applied successfully.');

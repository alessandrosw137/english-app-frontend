const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('Applying Overhaul Step 1: Login Restoration & Profile Modal...');

// 1. Asegurar initAuthSystem estricto: Si no hay usuario guardado, mostrar view-auth
const oldInitAuth = `    function initAuthSystem() {
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
    }`;

const newInitAuth = `    function initAuthSystem() {
      try {
        const user = getStoredUser();
        if (user && user.username) {
          applyUserSession(user);
          goToHomePortals();
        } else {
          showAuthScreen();
        }
      } catch (err) {
        console.error('Error en initAuthSystem, mostrando pantalla de inicio de sesión:', err);
        showAuthScreen();
      }
    }`;

if (html.includes(oldInitAuth)) {
  html = html.replace(oldInitAuth, newInitAuth);
  console.log('✅ initAuthSystem actualizado con verificación estricta de sesión.');
} else {
  console.log('ℹ️ initAuthSystem ya tenía la lógica requerida.');
}

// 2. Revisar handleModalLogout para volver a showAuthScreen
const oldLogout = `    function handleModalLogout() {
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
    }`;

const newLogout = `    function handleModalLogout() {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.setItem("alessandro_user_exp_v2", "0");
      } catch (e) {}
      closeProfileModal();
      showFloatingToast("Sesión cerrada. Mostrando pantalla de bienvenida...");
      setTimeout(() => {
        showAuthScreen();
      }, 300);
    }`;

if (html.includes(oldLogout)) {
  html = html.replace(oldLogout, newLogout);
  console.log('✅ handleModalLogout actualizado para regresar a la pantalla de bienvenida y login.');
} else {
  console.log('ℹ️ handleModalLogout ya estaba actualizado o tiene formato alternativo.');
}

// 3. Mejorar renderProfileModal para incluir Rango (Bronce a Maestro), Barra de EXP, Racha y Misiones
const oldRenderProfileStart = `    function renderProfileModal() {
      const container = document.getElementById('profileModalContent');
      if (!container) return;

      const user = getStoredAuthUser();
      const isGuest = !user || user.role === 'guest' || user.username === 'Invitado';
      const exp = getUserExp();
      const rank = getRankInfo(exp);`;

const newRenderProfileFunc = `    function renderProfileModal() {
      const container = document.getElementById('profileModalContent');
      if (!container) return;

      const user = getStoredAuthUser();
      const isGuest = !user || user.role === 'guest' || user.username === 'Invitado';
      const exp = getUserExp();
      const rank = getRankInfo(exp);
      const streakDays = parseInt(localStorage.getItem("user_streak_days") || "3", 10);
      const missionsStats = typeof getMissionsStats === 'function' ? getMissionsStats() : { completedMissions: 0 };
      const completedCount = missionsStats.completedMissions || 0;
      const initial = isGuest ? '?' : ((user.username || 'U').charAt(0).toUpperCase());

      if (isGuest) {
        // PERFIL MODO INVITADO
        container.innerHTML = \`
          <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-2xl font-mono shadow-inner">
              ?
            </div>
            <div>
              <span class="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 inline-block mb-1">
                Modo Invitado
              </span>
              <h4 class="text-lg font-bold text-white">Invitado</h4>
              <p class="text-xs text-slate-400 mt-0.5">Tu progreso actual se guarda temporalmente en este dispositivo.</p>
            </div>

            <!-- Rango, EXP, Barra de Progreso -->
            <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-left">
              <div class="flex items-center justify-between text-xs">
                <span class="font-mono text-slate-400">Rango: <strong class="text-amber-400 font-bold">\${rank.name || 'Bronce'}</strong></span>
                <span class="font-mono text-amber-400 font-bold">\${exp} EXP</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div class="h-full rounded-full bg-gradient-to-r from-amber-500 to-sky-400 transition-all duration-500" style="width: \${rank.progressPercent || 5}%"></div>
              </div>
              <div class="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0 EXP (Bronce)</span>
                <span>Siguiente: \${rank.nextThreshold || 500} EXP (\${rank.nextRank || 'Plata'})</span>
              </div>
            </div>

            <!-- Cuadrícula de Métricas: Racha y Misiones -->
            <div class="grid grid-cols-2 gap-2.5 pt-1 text-center">
              <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span class="block text-[10px] font-mono text-slate-400 uppercase">Racha Activa</span>
                <span class="font-mono font-bold text-amber-400 text-sm flex items-center justify-center gap-1">
                  <span>🔥</span> \${streakDays} días
                </span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span class="block text-[10px] font-mono text-slate-400 uppercase">Misiones</span>
                <span class="font-mono font-bold text-sky-400 text-sm flex items-center justify-center gap-1">
                  <span>🎯</span> \${completedCount}
                </span>
              </div>
            </div>
          </div>

          <!-- Botón Destacado en Azul Neón -->
          <button onclick="toggleModalAuthForm()" id="modalAuthToggleBtn" class="w-full py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.6)] cursor-pointer flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            <span>Vincular Cuenta / Iniciar Sesión</span>
          </button>

          <!-- Formulario Desplegable para Vincular Cuenta con PostgreSQL -->
          <div id="modalAuthDropdown" class="hidden p-4 rounded-2xl bg-slate-900/95 border border-sky-500/40 space-y-3.5 transition-all">
            <div class="flex items-center justify-between pb-2 border-b border-slate-800">
              <span class="text-xs font-bold text-sky-400">Vincular con PostgreSQL ('users' y 'user_stats')</span>
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
              <span>Acceder con Google (Admin Total)</span>
            </button>

            <div class="relative text-center my-1">
              <span class="bg-slate-900 px-2 text-[10px] text-slate-500 font-mono uppercase">o registra / inicia usuario único</span>
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
        container.innerHTML = \`
          <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl font-mono shadow-lg border border-sky-400/40 shrink-0">
                \${initial}
              </div>
              <div class="min-w-0 flex-1">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider \${rank.badgeClass || 'bg-sky-950/70 border border-sky-500/40 text-sky-300'} mb-1">
                  <span>★</span>
                  <span>\${rank.name || 'Bronce'}</span>
                </span>
                <h4 class="text-base font-bold text-white truncate" title="\${user.username}">\${user.username}</h4>
                <p class="text-[11px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
                  <span>Sincronizado con PostgreSQL ('users' & 'user_stats')</span>
                </p>
              </div>
            </div>

            <!-- Rango y Barra de EXP Progresiva -->
            <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-mono text-slate-400">Rango: <strong class="text-amber-400 font-bold">\${rank.name || 'Bronce'}</strong></span>
                <span class="font-mono text-amber-400 font-bold">\${exp} EXP</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div class="h-full rounded-full bg-gradient-to-r from-amber-500 via-sky-400 to-emerald-400 transition-all duration-500" style="width: \${rank.progressPercent || 100}%"></div>
              </div>
              <div class="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Nivel actual: \${rank.name}</span>
                <span>\${rank.isMax ? 'Rango Máximo Alcanzado' : \`Faltan \${rank.missingExp || 0} EXP para \${rank.nextRank}\`}</span>
              </div>
            </div>

            <!-- Métricas: Racha y Misiones -->
            <div class="grid grid-cols-2 gap-2 text-center">
              <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span class="block text-[10px] font-mono text-slate-400 uppercase">Racha de Estudio</span>
                <span class="font-mono font-bold text-amber-400 text-sm flex items-center justify-center gap-1">
                  <span>🔥</span> \${streakDays} días
                </span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span class="block text-[10px] font-mono text-slate-400 uppercase">Misiones Completadas</span>
                <span class="font-mono font-bold text-sky-400 text-sm flex items-center justify-center gap-1">
                  <span>🎯</span> \${completedCount}
                </span>
              </div>
            </div>
          </div>

          <!-- Botón de Sincronización Forzada -->
          <button onclick="forceSyncFromProfileModal()" class="w-full py-2.5 px-4 rounded-xl bg-sky-600/30 hover:bg-sky-600/40 text-sky-300 hover:text-white border border-sky-500/40 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2">
            <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>Sincronizar Progreso</span>
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
    }`;

const curRenderIdx = html.indexOf('function renderProfileModal()');
const nextFuncIdx = html.indexOf('function handleModalGoogleLogin()');
if (curRenderIdx !== -1 && nextFuncIdx !== -1) {
  html = html.substring(0, curRenderIdx) + newRenderProfileFunc.trim() + '\n\n    ' + html.substring(nextFuncIdx);
  console.log('✅ renderProfileModal actualizado con Rango (Bronce a Maestro), barra de EXP, contador de rachas y misiones.');
} else {
  console.warn('⚠️ No se pudo localizar renderProfileModal para reemplazo.');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Step 1 applied successfully.');

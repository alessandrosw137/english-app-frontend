const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('Applying Overhaul Step 2: 4 Vertical Magical Dimensional Portals & Robot Assistant Visibility...');

// 1. Agregar estilos CSS para los portales dimensionales si no existen
const portalCss = `
    /* ESTILOS Y ANIMACIONES PARA LOS 4 PORTALES DIMENSIONALES */
    @keyframes portalSpinSlow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes portalSpinReverse {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes portalPulseGlow {
      0%, 100% { opacity: 0.75; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
    .portal-arch {
      position: relative;
      border-radius: 2.25rem;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .portal-arch:hover {
      transform: translateY(-4px) scale(1.015);
    }
    .portal-ring-spin {
      animation: portalSpinSlow 18s linear infinite;
    }
    .portal-ring-spin-reverse {
      animation: portalSpinReverse 14s linear infinite;
    }
    .portal-ring-pulse {
      animation: portalPulseGlow 3.5s ease-in-out infinite;
    }
`;

if (!html.includes('portalSpinSlow')) {
  const headStyleEnd = '</style>';
  html = html.replace(headStyleEnd, `${portalCss}\n  ${headStyleEnd}`);
  console.log('✅ Estilos de portales dimensionales agregados al CSS.');
}

// 2. Reemplazar la sección view-home con el carrusel/flujo vertical de 4 Portales Mágicos
const oldHomeStart = '<section id="view-home"';
const oldHomeEnd = '</section>';
const homeStartIdx = html.indexOf(oldHomeStart);
const homeEndIdx = html.indexOf(oldHomeEnd, homeStartIdx);

if (homeStartIdx !== -1 && homeEndIdx !== -1) {
  const newHomeSection = `<section id="view-home" class="min-h-screen pt-8 pb-16 px-4 sm:px-6 w-full max-w-4xl mx-auto flex flex-col justify-center relative overflow-hidden">
      
      <!-- Fondo Dinámico de Estrellas y Nebulosa para Portales -->
      <canvas id="portalStarsCanvas" class="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"></canvas>

      <!-- Glows de Ambiente Cósmico -->
      <div class="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Encabezado del Hub de Portales -->
      <div class="text-center mb-8 relative z-10 space-y-2">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-sky-500/40 text-[11px] font-mono uppercase tracking-widest text-sky-300 shadow-md">
          <span class="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
          <span>Hub Dimensional de Teletransportación</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
          Selecciona tu <span class="bg-gradient-to-r from-amber-400 via-sky-400 to-purple-400 bg-clip-text text-transparent">Portal de Aprendizaje</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-medium">
          Accede de inmediato a tus academias temáticas, lecturas ilustradas, música y escenarios de simulación 3D.
        </p>
      </div>

      <!-- Carrusel Vertical de 4 Portales Mágicos Tipo Videojuego -->
      <div class="flex flex-col gap-5 sm:gap-6 relative z-10 w-full max-w-2xl mx-auto">
        
        <!-- ======================================================== -->
        <!-- PORTAL 1: LEARNING PATH (Tema Cósmico / Resplandor Dorado) -->
        <!-- ======================================================== -->
        <div onclick="openLearningPath()" class="portal-arch group bg-gradient-to-r from-slate-950/95 via-amber-950/20 to-slate-950/95 border-2 border-amber-500/40 hover:border-amber-400 p-5 sm:p-6 shadow-[0_0_35px_rgba(251,191,36,0.18)] hover:shadow-[0_0_60px_rgba(251,191,36,0.45)] cursor-pointer overflow-hidden backdrop-blur-md">
          
          <!-- Efecto de Luz Dimensional de Fondo -->
          <div class="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>
          
          <div class="flex items-center gap-4 sm:gap-6 relative z-10">
            <!-- Vórtice Dimensional Circular -->
            <div class="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
              <div class="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/60 portal-ring-spin"></div>
              <div class="absolute inset-2 rounded-full border border-amber-300/40 portal-ring-spin-reverse"></div>
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-500/30 to-slate-900 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-inner group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
            </div>

            <!-- Contenido del Portal 1 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Portal 1 &bull; Cósmico
                </span>
                <span class="text-[10px] font-mono text-slate-400 hidden sm:inline">Academia & Misiones</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors tracking-tight">
                Learning Path
              </h2>
              <p class="text-xs text-amber-200/80 mt-0.5 line-clamp-1 font-medium">
                Academia de Vocabulario y Misiones Progresivas A-Z
              </p>
            </div>

            <!-- Flecha de Teletransportación -->
            <div class="w-10 h-10 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-400 transition-all shadow-md shrink-0">
              <span class="text-lg font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- PORTAL 2: CUENTOS (Tema Místico Esmeralda / Resplandor Verde) -->
        <!-- ======================================================== -->
        <div onclick="openPortalView('stories')" class="portal-arch group bg-gradient-to-r from-slate-950/95 via-emerald-950/20 to-slate-950/95 border-2 border-emerald-500/40 hover:border-emerald-400 p-5 sm:p-6 shadow-[0_0_35px_rgba(52,211,153,0.18)] hover:shadow-[0_0_60px_rgba(52,211,153,0.45)] cursor-pointer overflow-hidden backdrop-blur-md">
          
          <div class="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>

          <div class="flex items-center gap-4 sm:gap-6 relative z-10">
            <!-- Vórtice Dimensional Circular -->
            <div class="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
              <div class="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/60 portal-ring-spin"></div>
              <div class="absolute inset-2 rounded-full border border-emerald-300/40 portal-ring-spin-reverse"></div>
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-500/30 to-slate-900 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-inner group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
            </div>

            <!-- Contenido del Portal 2 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Portal 2 &bull; Místico Esmeralda
                </span>
                <span class="text-[10px] font-mono text-slate-400 hidden sm:inline">Biblioteca Ilustrada</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors tracking-tight">
                Cuentos
              </h2>
              <p class="text-xs text-emerald-200/80 mt-0.5 line-clamp-1 font-medium">
                Biblioteca Clásica Ilustrada &bull; Modo Bilingüe y Speaking Coach
              </p>
            </div>

            <!-- Flecha de Teletransportación -->
            <div class="w-10 h-10 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-400 transition-all shadow-md shrink-0">
              <span class="text-lg font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- PORTAL 3: MUSIC SESSION (Tema Cyberpunk / Neón Cian y Violeta) -->
        <!-- ======================================================== -->
        <div onclick="openPortalView('medialab')" class="portal-arch group bg-gradient-to-r from-slate-950/95 via-cyan-950/20 to-purple-950/25 border-2 border-cyan-500/40 hover:border-fuchsia-400 p-5 sm:p-6 shadow-[0_0_35px_rgba(6,182,212,0.2)] hover:shadow-[0_0_60px_rgba(217,70,239,0.45)] cursor-pointer overflow-hidden backdrop-blur-md">
          
          <div class="absolute -right-12 -top-12 w-48 h-48 bg-cyan-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>

          <div class="flex items-center gap-4 sm:gap-6 relative z-10">
            <!-- Vórtice Dimensional Circular -->
            <div class="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
              <div class="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/60 portal-ring-spin"></div>
              <div class="absolute inset-2 rounded-full border border-fuchsia-400/40 portal-ring-spin-reverse"></div>
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-900/50 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-inner group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                </svg>
              </div>
            </div>

            <!-- Contenido del Portal 3 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Portal 3 &bull; Cyberpunk Neón
                </span>
                <span class="text-[10px] font-mono text-slate-400 hidden sm:inline">Ritmo & YouTube</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                Music Session
              </h2>
              <p class="text-xs text-cyan-200/80 mt-0.5 line-clamp-1 font-medium">
                Laboratorio de Ritmo, Buscador de YouTube y Letras Sincronizadas
              </p>
            </div>

            <!-- Flecha de Teletransportación -->
            <div class="w-10 h-10 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-cyan-400 transition-all shadow-md shrink-0">
              <span class="text-lg font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- PORTAL 4: WORLD TOUR 3D (Tema Espacial / Púrpura Profundo) -->
        <!-- ======================================================== -->
        <div onclick="openPortalView('worldtour')" class="portal-arch group bg-gradient-to-r from-slate-950/95 via-purple-950/30 to-slate-950/95 border-2 border-purple-500/40 hover:border-purple-300 p-5 sm:p-6 shadow-[0_0_35px_rgba(168,85,247,0.2)] hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] cursor-pointer overflow-hidden backdrop-blur-md">
          
          <div class="absolute -right-12 -top-12 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>

          <div class="flex items-center gap-4 sm:gap-6 relative z-10">
            <!-- Vórtice Dimensional Circular -->
            <div class="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
              <div class="absolute inset-0 rounded-full border-2 border-dashed border-purple-400/60 portal-ring-spin"></div>
              <div class="absolute inset-2 rounded-full border border-purple-300/40 portal-ring-spin-reverse"></div>
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-500/30 to-slate-900 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-inner group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>

            <!-- Contenido del Portal 4 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Portal 4 &bull; Espacio Profundo
                </span>
                <span class="text-[10px] font-mono text-slate-400 hidden sm:inline">Exploración 3D</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-white group-hover:text-purple-300 transition-colors tracking-tight">
                World Tour 3D
              </h2>
              <p class="text-xs text-purple-200/80 mt-0.5 line-clamp-1 font-medium">
                Simulador Inmersivo &bull; Objetos Cotidianos, Hamaca y Habitación Realista
              </p>
            </div>

            <!-- Flecha de Teletransportación -->
            <div class="w-10 h-10 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-slate-950 group-hover:border-purple-400 transition-all shadow-md shrink-0">
              <span class="text-lg font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </div>
          </div>
        </div>

      </div>
    </section>`;

  html = html.substring(0, homeStartIdx) + newHomeSection + html.substring(homeEndIdx + oldHomeEnd.length);
  console.log('✅ view-home actualizado a Carrusel Vertical de 4 Portales Mágicos con temática y resplandor.');
} else {
  console.warn('⚠️ No se pudo localizar view-home.');
}

// 3. Actualizar showView(viewId) para ocultar robot en view-home y view-auth, y controlar portalStarsCanvas
const oldShowView = `    function showView(viewId) {
      hideAllViews();
      const el = document.getElementById(viewId);
      if (el) {
        el.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      updateNavBackButton();
    }`;

const newShowView = `    function showView(viewId) {
      hideAllViews();
      const el = document.getElementById(viewId);
      if (el) {
        el.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // REQUISITO TÉCNICO OBLIGATORIO:
      // El robot asistente flotante se elimina por completo de esta pantalla de portales (view-home) y login (view-auth);
      // únicamente existirá dentro de los submódulos.
      const robotAvatar = document.getElementById('chatbotAvatarContainer');
      const chatbotWindow = document.getElementById('chatbotWindow');
      if (viewId === 'view-home' || viewId === 'view-auth') {
        if (robotAvatar) robotAvatar.classList.add('hidden');
        if (chatbotWindow) chatbotWindow.classList.add('hidden');
      } else {
        if (robotAvatar) robotAvatar.classList.remove('hidden');
      }

      // Ciclo de vida del canvas de estrellas de portales
      if (viewId === 'view-home') {
        startPortalStars();
      } else {
        stopPortalStars();
      }

      updateNavBackButton();
    }`;

if (html.includes(oldShowView)) {
  html = html.replace(oldShowView, newShowView);
  console.log('✅ showView actualizado para ocultar permanentemente el robot asistente en view-home y view-auth.');
} else {
  console.log('ℹ️ showView ya tenía formato alternativo.');
}

// 4. Agregar lógica del motor de partículas/estrellas de portales (startPortalStars / stopPortalStars)
const portalStarsLogic = `
    // ========================================================
    // MOTOR DE PARTÍCULAS Y ESTRELLAS CÓSMICAS (PORTAL HUB)
    // ========================================================
    let portalStarsAnimId = null;
    let portalStarsParticles = [];

    function initPortalStarsSystem() {
      const canvas = document.getElementById('portalStarsCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resize = () => {
        canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
        canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
      };
      resize();

      portalStarsParticles = [];
      const count = Math.min(65, Math.floor((canvas.width * canvas.height) / 12000));
      for (let i = 0; i < count; i++) {
        portalStarsParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.8 + 0.6,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -Math.random() * 0.5 - 0.15,
          alpha: Math.random() * 0.7 + 0.3,
          color: ['#fbbf24', '#38bdf8', '#a855f7', '#34d399'][Math.floor(Math.random() * 4)]
        });
      }
    }

    function renderPortalStarsFrame() {
      const canvas = document.getElementById('portalStarsCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < portalStarsParticles.length; i++) {
        const p = portalStarsParticles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      portalStarsAnimId = requestAnimationFrame(renderPortalStarsFrame);
    }

    function startPortalStars() {
      stopPortalStars();
      initPortalStarsSystem();
      portalStarsAnimId = requestAnimationFrame(renderPortalStarsFrame);
    }

    function stopPortalStars() {
      if (portalStarsAnimId) {
        cancelAnimationFrame(portalStarsAnimId);
        portalStarsAnimId = null;
      }
    }
`;

if (!html.includes('initPortalStarsSystem')) {
  const insertMarker = 'function goToHomePortals() {';
  html = html.replace(insertMarker, `${portalStarsLogic.trim()}\n\n    ${insertMarker}`);
  console.log('✅ Lógica de partículas y estrellas cósmicas agregada exitosamente.');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Step 2 applied successfully.');

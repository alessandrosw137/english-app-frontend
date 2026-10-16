const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const isCRLF = content.includes('\r\n');
let code = content.replace(/\r\n/g, '\n');

console.log('🚀 Starting Full Application Refactor...');

// ========================================================
// 1. STYLES: Add Levitation Animation and 3D Canvas styles
// ========================================================
const styleTarget = '</style>';
const extraStyles = `
    @keyframes levitate {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .animate-levitate {
      animation: levitate 3.5s ease-in-out infinite;
    }
    .lyrics-active-line {
      color: #fde047 !important;
      font-weight: 800 !important;
      font-size: 1.15rem !important;
      background: rgba(234, 179, 8, 0.12) !important;
      border-left: 4px solid #eab308 !important;
      padding-left: 0.75rem !important;
      border-radius: 0 0.75rem 0.75rem 0 !important;
      transform: scale(1.02);
      transition: all 0.25s ease;
    }
  </style>`;

if (!code.includes('animate-levitate')) {
  code = code.replace(styleTarget, extraStyles);
  console.log('✅ Added extra CSS animations.');
}

// ========================================================
// 2. HEADER: Clean Status Indicator (Subtle Green/Gray Dot)
// ========================================================
const oldHeaderButtonRegex = /<button onclick="openBackendSettingsModal\(\)"[\s\S]*?<\/button>/;
const newHeaderIndicator = `<div id="headerBackendStatus" class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono select-none" title="Estado de sincronización">
        <span id="backendStatusDot" class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span id="backendStatusLabel" class="text-slate-300 font-medium">Online</span>
      </div>`;

if (oldHeaderButtonRegex.test(code)) {
  code = code.replace(oldHeaderButtonRegex, newHeaderIndicator);
  console.log('✅ Top bar indicator updated to subtle dot.');
}

// ========================================================
// 3. REMOVE TECHNICAL MODAL: backendSettingsModal
// ========================================================
const modalRegex = /<!-- MODAL DE CONFIGURACIÓN POSTGRESQL & WEBSOCKET OFFLINE-FIRST -->[\s\S]*?<div id="backendSettingsModal"[\s\S]*?<\/div>\s*<\/div>/;
if (modalRegex.test(code)) {
  code = code.replace(modalRegex, '<!-- Modal técnico removido permanentemente -->');
  console.log('✅ Technical PostgreSQL modal completely removed from DOM.');
} else {
  // Direct div removal
  const divRegex = /<div id="backendSettingsModal"[\s\S]*?<\/div>\s*<\/div>/;
  if (divRegex.test(code)) {
    code = code.replace(divRegex, '');
    console.log('✅ backendSettingsModal div removed.');
  }
}

// ========================================================
// 4. PORTAL CARDS: Clean, Zero-Relleno, Cuentos & Music Session
// ========================================================
const oldHomeGridRegex = /<!-- Cuadrícula de 4 Portales Principales -->[\s\S]*?<\/section>/;
const newHomeGrid = `<!-- Cuadrícula de 4 Portales Principales -->
      <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        
        <!-- Portal 1: Learning Path -->
        <div onclick="openLearningPath()" class="group bg-[#1e293b] border border-slate-800 hover:border-amber-400/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 cursor-pointer active:scale-[0.99] relative overflow-hidden">
          <div class="flex items-start justify-between mb-4">
            <span class="text-[11px] font-mono uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-lg font-bold">
              Portal 1
            </span>
            <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-inner">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-black text-slate-100 tracking-tight group-hover:text-amber-400 transition-colors">
              Learning Path
            </h2>
            <p class="text-xs font-mono text-amber-400/90 mt-1">
              Rutas Temáticas & Misiones A-Z
            </p>
          </div>
          <div class="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400">
            <span>Iniciar estudio</span>
            <span class="group-hover:translate-x-1 transition-transform font-bold">&rarr;</span>
          </div>
        </div>

        <!-- Portal 2: Cuentos -->
        <div onclick="openPortalView('stories')" class="group bg-[#1e293b] border border-slate-800 hover:border-emerald-400/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 cursor-pointer active:scale-[0.99] relative overflow-hidden">
          <div class="flex items-start justify-between mb-4">
            <span class="text-[11px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-lg font-bold">
              Portal 2
            </span>
            <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-inner">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-black text-slate-100 tracking-tight group-hover:text-emerald-400 transition-colors">
              Cuentos
            </h2>
            <p class="text-xs font-mono text-emerald-400/90 mt-1">
              Lecturas Ilustradas en Inglés
            </p>
          </div>
          <div class="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span>Abrir biblioteca</span>
            <span class="group-hover:translate-x-1 transition-transform font-bold">&rarr;</span>
          </div>
        </div>

        <!-- Portal 3: Music Session -->
        <div onclick="openPortalView('medialab')" class="group bg-[#1e293b] border border-slate-800 hover:border-cyan-400/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 cursor-pointer active:scale-[0.99] relative overflow-hidden">
          <div class="flex items-start justify-between mb-4">
            <span class="text-[11px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-3 py-1 rounded-lg font-bold">
              Portal 3
            </span>
            <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-inner">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-black text-slate-100 tracking-tight group-hover:text-cyan-400 transition-colors">
              Music Session
            </h2>
            <p class="text-xs font-mono text-cyan-400/90 mt-1">
              Canciones y Letras en Tiempo Real
            </p>
          </div>
          <div class="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
            <span>Reproducir canciones</span>
            <span class="group-hover:translate-x-1 transition-transform font-bold">&rarr;</span>
          </div>
        </div>

        <!-- Portal 4: World Tour 3D -->
        <div onclick="openPortalView('worldtour')" class="group bg-[#1e293b] border border-slate-800 hover:border-purple-400/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 cursor-pointer active:scale-[0.99] relative overflow-hidden">
          <div class="flex items-start justify-between mb-4">
            <span class="text-[11px] font-mono uppercase tracking-widest text-purple-400 bg-purple-950/60 border border-purple-500/40 px-3 py-1 rounded-lg font-bold">
              Portal 4
            </span>
            <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shadow-inner">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-black text-slate-100 tracking-tight group-hover:text-purple-400 transition-colors">
              World Tour 3D
            </h2>
            <p class="text-xs font-mono text-purple-400/90 mt-1">
              Simulador de Entornos y Vocabulario
            </p>
          </div>
          <div class="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-purple-400">
            <span>Explorar escenario</span>
            <span class="group-hover:translate-x-1 transition-transform font-bold">&rarr;</span>
          </div>
        </div>

      </div>
    </section>`;

if (oldHomeGridRegex.test(code)) {
  code = code.replace(oldHomeGridRegex, newHomeGrid);
  console.log('✅ view-home 4 portal cards updated (clean, zero-relleno).');
}

// ========================================================
// 5. REUBICACIÓN DEL ROBOT 3D (bottom: 45%, right: 20px)
// ========================================================
const oldRobotRegex = /<div id="chatbotAvatarContainer"[\s\S]*?class="fixed bottom-5 right-5 sm:bottom-6 sm:right-6[^"]*"/;
const newRobotContainer = `<div id="chatbotAvatarContainer" onclick="triggerChatbotAvatarClick()" style="bottom: 45%; right: 20px;" class="fixed z-40 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-sky-400/80 bg-slate-950/90 backdrop-blur-md flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-transform hover:scale-110 active:scale-95 no-print select-none animate-levitate"`;

if (oldRobotRegex.test(code)) {
  code = code.replace(oldRobotRegex, newRobotContainer);
  console.log('✅ Chatbot robot relocated to middle-right (bottom: 45%, right: 20px) with levitation animation.');
}

// ========================================================
// 6. 3D CANVAS CONTAINER DIMENSIONS & ATTRIBUTES
// ========================================================
const oldCanvasContainer = `<div id="threeCanvasContainer" class="w-full h-[62vh] sm:h-[520px] block cursor-grab active:cursor-grabbing"></div>`;
const newCanvasContainer = `<div id="threeCanvasContainer" style="position: relative; width: 100%; height: 550px; min-height: 500px; display: block;" class="w-full cursor-grab active:cursor-grabbing rounded-3xl overflow-hidden bg-slate-950"></div>`;

if (code.includes(oldCanvasContainer)) {
  code = code.replace(oldCanvasContainer, newCanvasContainer);
  console.log('✅ threeCanvasContainer set to position: relative; width: 100%; height: 550px; min-height: 500px; display: block.');
}

if (isCRLF) {
  code = code.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('🎉 apply_full_refactor.js step 1 complete!');

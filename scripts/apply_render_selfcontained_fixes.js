const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const assetsIndexPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// 1. Asegurar la etiqueta meta viewport exacta requerida
const viewportRegex = /<meta\s+name=["']viewport["'][^>]*>/i;
const exactViewport = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">';
if (viewportRegex.test(html)) {
  html = html.replace(viewportRegex, exactViewport);
  console.log('✅ Viewport meta tag asegurado.');
}

// 2. Resiliencia de librerías en <head>: Tailwind CDN + fallback local, Three.js fallback
const oldLibsSnippet = `  <!-- Librerías de soporte -->
  <script src="tailwind.js"></script>
  <script src="three.min.js"></script>
  <script src="master_data.js"></script>`;

const newLibsSnippet = `  <!-- Librerías de soporte con CDN oficial y respaldo local -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    if (!window.tailwind) {
      document.write('<script src="tailwind.js"><\\/script>');
    }
  </script>
  <script src="three.min.js"></script>
  <script>
    if (typeof THREE === 'undefined') {
      document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\\/script>');
    }
  </script>
  <script src="master_data.js"></script>

  <!-- Fallback SVGs de alta resolución en memoria para garantizar cero imágenes rotas -->
  <script>
    window.FALLBACK_LOGO = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%"><defs><linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="100%" stop-color="%231e293b"/></linearGradient><linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2338bdf8"/><stop offset="50%" stop-color="%236366f1"/><stop offset="100%" stop-color="%23ec4899"/></linearGradient><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fde047"/><stop offset="100%" stop-color="%23eab308"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(%23bgGrad)"/><circle cx="60" cy="60" r="44" fill="none" stroke="url(%23glowGrad)" stroke-width="3" opacity="0.4"/><circle cx="60" cy="60" r="36" fill="%231e293b" stroke="url(%23glowGrad)" stroke-width="2.5"/><path d="M60 28 L82 42 L82 66 C82 80 60 92 60 92 C60 92 38 80 38 66 L38 42 Z" fill="url(%23glowGrad)" opacity="0.25"/><path d="M60 32 L78 44 L78 64 C78 76 60 86 60 86 C60 86 42 76 42 64 L42 44 Z" fill="none" stroke="url(%23glowGrad)" stroke-width="2"/><text x="60" y="66" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" fill="%23ffffff" text-anchor="middle" dominant-baseline="central">EN</text><polygon points="60,22 63,29 70,30 65,35 66,42 60,38 54,42 55,35 50,30 57,29" fill="url(%23goldGrad)"/></svg>';

    window.FALLBACK_MASCOT = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%"><defs><linearGradient id="mBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23090d16"/><stop offset="100%" stop-color="%231e293b"/></linearGradient><linearGradient id="mHead" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ffffff"/><stop offset="100%" stop-color="%23cbd5e1"/></linearGradient><linearGradient id="mVisor" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230284c7"/><stop offset="100%" stop-color="%230369a1"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(%23mBg)"/><line x1="60" y1="26" x2="60" y2="14" stroke="%2338bdf8" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="12" r="4.5" fill="%2338bdf8"/><rect x="26" y="26" width="68" height="56" rx="20" fill="url(%23mHead)" stroke="%2338bdf8" stroke-width="2"/><rect x="36" y="38" width="48" height="26" rx="10" fill="%230f172a"/><circle cx="48" cy="51" r="5" fill="%2338bdf8"/><circle cx="72" cy="51" r="5" fill="%2338bdf8"/><circle cx="49.5" cy="49.5" r="1.5" fill="%23ffffff"/><circle cx="73.5" cy="49.5" r="1.5" fill="%23ffffff"/><path d="M54 70 Q60 74 66 70" fill="none" stroke="%2338bdf8" stroke-width="2.5" stroke-linecap="round"/><rect x="18" y="42" width="10" height="24" rx="5" fill="%230284c7"/><rect x="92" y="42" width="10" height="24" rx="5" fill="%230284c7"/><path d="M26 44 C26 24 94 24 94 44" fill="none" stroke="%230284c7" stroke-width="3.5" stroke-linecap="round"/><path d="M23 60 Q23 76 38 78" fill="none" stroke="%2338bdf8" stroke-width="2.5" stroke-linecap="round"/><circle cx="39" cy="78" r="3" fill="%2338bdf8"/><rect x="36" y="88" width="48" height="24" rx="10" fill="%23e2e8f0"/><circle cx="60" cy="98" r="4" fill="%2338bdf8"/></svg>';

    window.FALLBACK_PORTAL_LEARNING = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><defs><linearGradient id="pBg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23090d16"/><stop offset="100%" stop-color="%231e1b4b"/></linearGradient><radialGradient id="pGlow1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23f59e0b" stop-opacity="0.8"/><stop offset="60%" stop-color="%23d97706" stop-opacity="0.3"/><stop offset="100%" stop-color="%23000" stop-opacity="0"/></radialGradient></defs><rect width="400" height="300" fill="url(%23pBg1)"/><circle cx="200" cy="150" r="110" fill="url(%23pGlow1)"/><ellipse cx="200" cy="150" rx="90" ry="90" fill="none" stroke="%23fbbf24" stroke-width="3" stroke-dasharray="10 5" opacity="0.8"/><ellipse cx="200" cy="150" rx="70" ry="70" fill="none" stroke="%23f59e0b" stroke-width="4"/><polygon points="200,80 230,140 200,200 170,140" fill="%23fde68a" opacity="0.3"/><text x="200" y="155" font-size="52" text-anchor="middle" dominant-baseline="central">📚</text><text x="200" y="240" font-family="system-ui, sans-serif" font-weight="800" font-size="16" fill="%23fef3c7" text-anchor="middle">LEARNING PATH</text></svg>';

    window.FALLBACK_PORTAL_STORIES = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><defs><linearGradient id="pBg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23061c16"/><stop offset="100%" stop-color="%230f291e"/></linearGradient><radialGradient id="pGlow2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%2310b981" stop-opacity="0.8"/><stop offset="60%" stop-color="%23059669" stop-opacity="0.3"/><stop offset="100%" stop-color="%23000" stop-opacity="0"/></radialGradient></defs><rect width="400" height="300" fill="url(%23pBg2)"/><circle cx="200" cy="150" r="110" fill="url(%23pGlow2)"/><ellipse cx="200" cy="150" rx="85" ry="85" fill="none" stroke="%2334d399" stroke-width="3" stroke-dasharray="8 6" opacity="0.8"/><ellipse cx="200" cy="150" rx="68" ry="68" fill="none" stroke="%2310b981" stroke-width="4"/><text x="200" y="155" font-size="52" text-anchor="middle" dominant-baseline="central">📖</text><text x="200" y="240" font-family="system-ui, sans-serif" font-weight="800" font-size="16" fill="%23d1fae5" text-anchor="middle">STORIES &amp; VOICE</text></svg>';

    window.FALLBACK_PORTAL_MUSIC = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><defs><linearGradient id="pBg3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23082f49"/><stop offset="100%" stop-color="%230c4a6e"/></linearGradient><radialGradient id="pGlow3" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%2306b6d4" stop-opacity="0.8"/><stop offset="60%" stop-color="%230284c7" stop-opacity="0.3"/><stop offset="100%" stop-color="%23000" stop-opacity="0"/></radialGradient></defs><rect width="400" height="300" fill="url(%23pBg3)"/><circle cx="200" cy="150" r="110" fill="url(%23pGlow3)"/><ellipse cx="200" cy="150" rx="85" ry="85" fill="none" stroke="%2322d3ee" stroke-width="3" stroke-dasharray="6 6" opacity="0.8"/><ellipse cx="200" cy="150" rx="68" ry="68" fill="none" stroke="%2306b6d4" stroke-width="4"/><text x="200" y="155" font-size="52" text-anchor="middle" dominant-baseline="central">🎵</text><text x="200" y="240" font-family="system-ui, sans-serif" font-weight="800" font-size="16" fill="%23cffafe" text-anchor="middle">MUSIC SESSION</text></svg>';

    window.FALLBACK_PORTAL_WORLDTOUR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><defs><linearGradient id="pBg4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="100%" stop-color="%2331104b"/></linearGradient><radialGradient id="pGlow4" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23a855f7" stop-opacity="0.8"/><stop offset="60%" stop-color="%237c3aed" stop-opacity="0.3"/><stop offset="100%" stop-color="%23000" stop-opacity="0"/></radialGradient></defs><rect width="400" height="300" fill="url(%23pBg4)"/><circle cx="200" cy="150" r="110" fill="url(%23pGlow4)"/><ellipse cx="200" cy="150" rx="85" ry="85" fill="none" stroke="%23c084fc" stroke-width="3" stroke-dasharray="10 5" opacity="0.8"/><ellipse cx="200" cy="150" rx="68" ry="68" fill="none" stroke="%239333ea" stroke-width="4"/><text x="200" y="155" font-size="52" text-anchor="middle" dominant-baseline="central">🏛️</text><text x="200" y="240" font-family="system-ui, sans-serif" font-weight="800" font-size="16" fill="%23f3e8ff" text-anchor="middle">WORLD TOUR 3D</text></svg>';
  </script>`;

if (html.includes(oldLibsSnippet)) {
  html = html.replace(oldLibsSnippet, newLibsSnippet);
  console.log('✅ Librerías y scripts de soporte actualizados.');
}

// 3. Embeber CSS Crítico Autosuficiente en <head><style>
const criticalCSS = `
    /* ========================================================
       ESTILOS CRÍTICOS AUTOSUFICIENTES (RESILIENTES PARA RENDER)
       ======================================================== */
    .hidden {
      display: none !important;
    }

    [style*="display: none"] {
      display: none !important;
    }

    /* Vistas principales */
    #view-auth.hidden,
    #view-home.hidden,
    #view-path.hidden,
    #view-stories.hidden,
    #view-music.hidden,
    #view-worldtour.hidden {
      display: none !important;
    }

    #view-auth:not(.hidden) {
      display: flex !important;
    }
    #view-home:not(.hidden) {
      display: flex !important;
    }
    #view-path:not(.hidden) {
      display: block !important;
    }
    #view-stories:not(.hidden) {
      display: block !important;
    }
    #view-music:not(.hidden) {
      display: block !important;
    }
    #view-worldtour:not(.hidden) {
      display: block !important;
    }

    /* Pestañas de Autenticación (Login vs Registro) */
    #authLoginForm.hidden,
    #authRegisterForm.hidden {
      display: none !important;
    }
    #authLoginForm:not(.hidden),
    #authRegisterForm:not(.hidden) {
      display: block !important;
    }

    /* Alerta de autenticación y widgets flotantes */
    #authAlertBanner.hidden,
    #draggableRobotWidget.hidden,
    #draggableRouletteWidget.hidden,
    #threeObjectInspectCard.hidden,
    #floatingToast.hidden {
      display: none !important;
    }

    #authAlertBanner:not(.hidden) {
      display: flex !important;
    }
    #draggableRobotWidget:not(.hidden),
    #draggableRouletteWidget:not(.hidden) {
      display: flex !important;
    }
    #threeObjectInspectCard:not(.hidden) {
      display: block !important;
    }

    /* Contenedores Modales Flotantes con Backdrop (Centrados y Aislados del flujo) */
    #glossaryModal,
    #learningMissionModal,
    #profileModal,
    #rouletteModal,
    #musicWordModal {
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

    #glossaryModal.hidden,
    #learningMissionModal.hidden,
    #profileModal.hidden,
    #rouletteModal.hidden,
    #musicWordModal.hidden {
      display: none !important;
    }

    #glossaryModal:not(.hidden),
    #learningMissionModal:not(.hidden),
    #profileModal:not(.hidden),
    #rouletteModal:not(.hidden),
    #musicWordModal:not(.hidden) {
      display: flex !important;
    }

    /* Utilidades mínimas de interfaz dark slate */
    .bg-slate-900 { background-color: #0f172a; }
    .bg-slate-800 { background-color: #1e293b; }
    .text-slate-100 { color: #f1f5f9; }
    .text-slate-300 { color: #cbd5e1; }
    .text-slate-400 { color: #94a3b8; }
    .border-slate-800 { border-color: #1e293b; }
    .border-slate-700 { border-color: #334155; }
`;

if (!html.includes('ESTILOS CRÍTICOS AUTOSUFICIENTES (RESILIENTES PARA RENDER)')) {
  html = html.replace('<style>', '<style>' + criticalCSS);
  console.log('✅ Estilos críticos embebidos en <head><style>.');
}

// 4. Modales y secciones condicionados por defecto con style="display: none;" en el HTML
const elementDisplayFixes = [
  {
    target: '<div id="view-home" class="flex-1 flex flex-col items-center justify-center p-3 relative overflow-hidden hidden">',
    replacement: '<div id="view-home" class="flex-1 flex flex-col items-center justify-center p-3 relative overflow-hidden hidden" style="display: none;">'
  },
  {
    target: '<div id="view-path" class="flex-1 p-4 max-w-5xl mx-auto w-full hidden">',
    replacement: '<div id="view-path" class="flex-1 p-4 max-w-5xl mx-auto w-full hidden" style="display: none;">'
  },
  {
    target: '<div id="view-stories" class="flex-1 p-4 max-w-5xl mx-auto w-full hidden">',
    replacement: '<div id="view-stories" class="flex-1 p-4 max-w-5xl mx-auto w-full hidden" style="display: none;">'
  },
  {
    target: '<div id="view-worldtour" class="flex-1 p-3 max-w-5xl mx-auto w-full hidden">',
    replacement: '<div id="view-worldtour" class="flex-1 p-3 max-w-5xl mx-auto w-full hidden" style="display: none;">'
  },
  {
    target: '<form id="authRegisterForm" onsubmit="handleAuthRegisterSubmit(event)" class="space-y-4 hidden">',
    replacement: '<form id="authRegisterForm" onsubmit="handleAuthRegisterSubmit(event)" class="space-y-4 hidden" style="display: none;">'
  },
  {
    target: '<div id="authAlertBanner" class="hidden mb-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition">',
    replacement: '<div id="authAlertBanner" class="hidden mb-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition" style="display: none;">'
  },
  {
    target: '<div id="draggableRobotWidget" class="draggable-widget fixed z-50 flex items-center justify-center hidden"\n    style="bottom: 90px; right: 24px;">',
    replacement: '<div id="draggableRobotWidget" class="draggable-widget fixed z-50 flex items-center justify-center hidden"\n    style="bottom: 90px; right: 24px; display: none;">'
  },
  {
    target: '<div id="draggableRobotWidget" class="draggable-widget fixed z-50 flex items-center justify-center hidden"\r\n    style="bottom: 90px; right: 24px;">',
    replacement: '<div id="draggableRobotWidget" class="draggable-widget fixed z-50 flex items-center justify-center hidden"\r\n    style="bottom: 90px; right: 24px; display: none;">'
  },
  {
    target: '<div id="draggableRouletteWidget" class="draggable-widget fixed z-50 flex items-center justify-center hidden"\n    style="bottom: 90px; left: 24px;">',
    replacement: '<div id="draggableRouletteWidget" class="draggable-widget fixed z-50 flex items-center justify-center hidden"\n    style="bottom: 90px; left: 24px; display: none;">'
  },
  {
    target: '<div id="draggableRouletteWidget" class="draggable-widget fixed z-50 flex items-center justify-center hidden"\r\n    style="bottom: 90px; left: 24px;">',
    replacement: '<div id="draggableRouletteWidget" class="draggable-widget fixed z-50 flex items-center justify-center hidden"\r\n    style="bottom: 90px; left: 24px; display: none;">'
  },
  {
    target: '<div id="glossaryModal"\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">',
    replacement: '<div id="glossaryModal" style="display: none;"\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">'
  },
  {
    target: '<div id="glossaryModal"\r\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">',
    replacement: '<div id="glossaryModal" style="display: none;"\r\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">'
  },
  {
    target: '<div id="learningMissionModal"\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">',
    replacement: '<div id="learningMissionModal" style="display: none;"\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">'
  },
  {
    target: '<div id="learningMissionModal"\r\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">',
    replacement: '<div id="learningMissionModal" style="display: none;"\r\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">'
  },
  {
    target: '<div id="profileModal"\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">',
    replacement: '<div id="profileModal" style="display: none;"\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">'
  },
  {
    target: '<div id="profileModal"\r\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">',
    replacement: '<div id="profileModal" style="display: none;"\r\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">'
  },
  {
    target: '<div id="rouletteModal"\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">',
    replacement: '<div id="rouletteModal" style="display: none;"\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">'
  },
  {
    target: '<div id="rouletteModal"\r\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">',
    replacement: '<div id="rouletteModal" style="display: none;"\r\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">'
  },
  {
    target: '<div id="musicWordModal"\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">',
    replacement: '<div id="musicWordModal" style="display: none;"\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">'
  },
  {
    target: '<div id="musicWordModal"\r\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">',
    replacement: '<div id="musicWordModal" style="display: none;"\r\n    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">'
  }
];

elementDisplayFixes.forEach(({ target, replacement }) => {
  if (html.includes(target)) {
    html = html.replace(target, replacement);
    console.log(`✅ Ocultado por defecto aplicado para un elemento modal/vista.`);
  }
});

// 5. Agregar resiliencia visual (onerror) a las 9 etiquetas <img>
const imageFallbacks = [
  {
    target: '<img src="images/app_hero_logo.jpg" alt="English App Logo" class="w-full h-full object-cover">',
    replacement: '<img src="images/app_hero_logo.jpg" alt="English App Logo" class="w-full h-full object-cover" onerror="this.onerror=null; this.src=window.FALLBACK_LOGO || \'images/app_hero_logo.svg\';">'
  },
  {
    target: '<img src="images/ai_tutor_mascot.jpg" alt="AI Tutor Mascot" class="w-full h-full object-cover">',
    replacement: '<img src="images/ai_tutor_mascot.jpg" alt="AI Tutor Mascot" class="w-full h-full object-cover" onerror="this.onerror=null; this.src=window.FALLBACK_MASCOT || \'images/ai_tutor_mascot.svg\';">'
  },
  {
    target: '<img src="images/app_hero_logo.jpg" alt="English App Emblem" class="w-full h-full object-cover rounded-[22px]">',
    replacement: '<img src="images/app_hero_logo.jpg" alt="English App Emblem" class="w-full h-full object-cover rounded-[22px]" onerror="this.onerror=null; this.src=window.FALLBACK_LOGO || \'images/app_hero_logo.svg\';">'
  },
  {
    target: '<img src="images/portal_learning_path.jpg" alt="Portal Learning Path" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">',
    replacement: '<img src="images/portal_learning_path.jpg" alt="Portal Learning Path" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null; this.src=window.FALLBACK_PORTAL_LEARNING || \'images/portal_learning_path.svg\';">'
  },
  {
    target: '<img src="images/portal_stories.jpg" alt="Portal Cuentos" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">',
    replacement: '<img src="images/portal_stories.jpg" alt="Portal Cuentos" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null; this.src=window.FALLBACK_PORTAL_STORIES || \'images/portal_stories.svg\';">'
  },
  {
    target: '<img src="images/portal_music.svg" alt="Portal Music Session" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">',
    replacement: '<img src="images/portal_music.svg" alt="Portal Music Session" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null; this.src=window.FALLBACK_PORTAL_MUSIC || \'images/portal_music.svg\';">'
  },
  {
    target: '<img src="images/portal_worldtour.jpg" alt="Portal World Tour 3D" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">',
    replacement: '<img src="images/portal_worldtour.jpg" alt="Portal World Tour 3D" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null; this.src=window.FALLBACK_PORTAL_WORLDTOUR || \'images/portal_worldtour.svg\';">'
  },
  {
    target: '<img src="images/portal_learning_path.jpg" alt="Academia de Aprendizaje" class="w-full h-36 sm:h-44 object-cover opacity-45">',
    replacement: '<img src="images/portal_learning_path.jpg" alt="Academia de Aprendizaje" class="w-full h-36 sm:h-44 object-cover opacity-45" onerror="this.onerror=null; this.src=window.FALLBACK_PORTAL_LEARNING || \'images/portal_learning_path.svg\';">'
  },
  {
    target: '<img src="images/ai_tutor_mascot.jpg" alt="AI Tutor" class="hidden sm:block w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/60 shadow-xl">',
    replacement: '<img src="images/ai_tutor_mascot.jpg" alt="AI Tutor" class="hidden sm:block w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/60 shadow-xl" onerror="this.onerror=null; this.src=window.FALLBACK_MASCOT || \'images/ai_tutor_mascot.svg\';">'
  }
];

imageFallbacks.forEach(({ target, replacement }) => {
  if (html.includes(target)) {
    html = html.replace(target, replacement);
    console.log(`✅ Fallback visual aplicado para imagen.`);
  }
});

// Guardar en index.html raíz y sincronizar con app/src/main/assets/index.html
fs.writeFileSync(indexPath, html, 'utf8');
fs.writeFileSync(assetsIndexPath, html, 'utf8');
console.log('🎉 index.html raíz y assets/index.html actualizados y sincronizados exitosamente.');

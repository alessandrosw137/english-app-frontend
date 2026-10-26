const fs = require('fs');
const path = require('path');

// ==========================================
// 1. PATCH INDEX.HTML
// ==========================================
const indexPath = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// A. Scripts
if (!indexHtml.includes('js/pet_engine_2d.js')) {
  indexHtml = indexHtml.replace(
    '<script src="js/profile_social.js"></script>',
    '<script src="js/pet_engine_2d.js"></script>\n<script src="js/pet_sanctuary.js"></script>\n<script src="js/profile_social.js"></script>'
  );
  console.log('✅ Added pet scripts to index.html');
}

// B. Card 7
const card7Html = `
<!-- ================= PORTAL 08: MASTERPET SANCTUARY (CRIANZA 2D & CO-OP) ================= -->
<div id="coverCard-7" onclick="handleCoverCardClick(7)" class="coverflow-portal-card portal-card portal-card-7 hidden-back" style="--portal-glow: rgba(16, 185, 129, 0.45);">
<div class="w-full h-full flex flex-col justify-between relative overflow-hidden group">
<div class="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>
<div>
<div class="flex items-center justify-between mb-1.5">
<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
PORTAL 08 &bull; CRIANZA 2D
</span>
<span class="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] font-black text-rose-300 uppercase tracking-wider">
Solo Usuarios Registrados
</span>
</div>
<h3 class="text-lg font-black text-emerald-300 group-hover:text-emerald-200 transition">
🐾 MasterPet Sanctuary (Crianza 2D & Co-Op)
</h3>
<p class="text-[11px] text-slate-300 mt-1 leading-snug">
Adopta, alimenta y entrena a tu compañero de papel interactivo en 2D con físicas reales, minijuegos y crianza compartida.
</p>
</div>
<div class="my-2.5 relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden border border-emerald-500/50 shadow-xl bg-slate-950 flex items-center justify-center shrink-0">
  <svg class="w-full h-full object-cover" viewBox="0 0 340 180" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="petGrad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#064e3b" />
        <stop offset="60%" stop-color="#022c22" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
      <linearGradient id="craftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#b45309" />
      </linearGradient>
      <radialGradient id="eggGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#a7f3d0" stop-opacity="0.9" />
        <stop offset="60%" stop-color="#10b981" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#022c22" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="340" height="180" fill="url(#petGrad-bg)" />
    <path d="M-10,180 Q60,110 140,140 T300,120 Q330,130 350,180 Z" fill="#047857" opacity="0.4" />
    <path d="M-10,180 Q80,125 170,145 T350,135 L350,180 Z" fill="#065f46" opacity="0.6" />
    <path d="M-10,180 Q100,140 200,155 T350,150 L350,180 Z" fill="#022c22" />
    <circle cx="170" cy="95" r="65" fill="url(#eggGlow)" />
    <g transform="translate(170, 95)">
      <ellipse cx="0" cy="42" rx="36" ry="9" fill="#000" opacity="0.45" />
      <rect x="-32" y="-28" width="64" height="64" rx="20" fill="url(#craftGrad)" stroke="#d97706" stroke-width="2.5" />
      <rect x="-28" y="-24" width="56" height="56" rx="16" fill="none" stroke="#fef3c7" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.8" />
      <polygon points="-24,-24 -36,-44 -12,-30" fill="#d97706" stroke="#b45309" stroke-width="2" />
      <polygon points="24,-24 36,-44 12,-30" fill="#d97706" stroke="#b45309" stroke-width="2" />
      <polygon points="-22,-24 -32,-40 -14,-28" fill="#fde68a" />
      <polygon points="22,-24 32,-40 14,-28" fill="#fde68a" />
      <ellipse cx="-13" cy="-4" rx="6" ry="8" fill="#0f172a" />
      <ellipse cx="13" cy="-4" rx="6" ry="8" fill="#0f172a" />
      <circle cx="-11" cy="-7" r="2.5" fill="#ffffff" />
      <circle cx="15" cy="-7" r="2.5" fill="#ffffff" />
      <ellipse cx="-20" cy="6" rx="5" ry="3" fill="#f43f5e" opacity="0.6" />
      <ellipse cx="20" cy="6" rx="5" ry="3" fill="#f43f5e" opacity="0.6" />
      <polygon points="0,1 -3,4 3,4" fill="#78350f" />
      <path d="M-5,7 Q0,12 5,7" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round" />
      <g transform="translate(26, -26) scale(0.8)">
        <circle cx="0" cy="0" r="14" fill="#059669" stroke="#34d399" stroke-width="1.5" />
        <path d="M0,5 A4,4 0 0,0 7,-2 A4,4 0 0,0 0,-6 A4,4 0 0,0 -7,-2 A4,4 0 0,0 0,5 Z" fill="#ec4899" />
      </g>
    </g>
    <text x="75" y="70" font-size="20">✨</text>
    <text x="250" y="65" font-size="20">🐾</text>
    <text x="270" y="125" font-size="16">💖</text>
  </svg>
  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
  <div class="absolute bottom-2 right-2.5 z-10">
    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-emerald-400/50 text-[10px] font-bold text-emerald-300 shadow-md">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
      CRIANZA CO-OP 2D
    </span>
  </div>
</div>
<button type="button" onclick="event.stopPropagation(); window.openPetSanctuary();" class="portal-btn shrink-0 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/30 cursor-pointer" data-action="enter-portal" data-portal="pets">ENTRAR AL SANTUARIO</button>
</div>
</div>
`;

if (!indexHtml.includes('id="coverCard-7"')) {
  // Insert before </button>\n</div>\n<div class="flex items-center gap-2.5 mt-3 z-10">
  const trackEndMarker = 'data-portal="social">ENTRAR AL PORTAL</button>\r\n</div>\r\n</div>';
  const trackEndMarkerLF = 'data-portal="social">ENTRAR AL PORTAL</button>\n</div>\n</div>';

  if (indexHtml.includes(trackEndMarker)) {
    indexHtml = indexHtml.replace(trackEndMarker, trackEndMarker + '\r\n' + card7Html);
    console.log('✅ Added coverCard-7 to index.html (CRLF)');
  } else if (indexHtml.includes(trackEndMarkerLF)) {
    indexHtml = indexHtml.replace(trackEndMarkerLF, trackEndMarkerLF + '\n' + card7Html);
    console.log('✅ Added coverCard-7 to index.html (LF)');
  } else {
    console.warn('⚠️ Could not find coverCard-6 end marker');
  }
}

// C. Dot 7
const dot7Html = '<span id="coverDot-7" onclick="window.goToPortal(7)" class="carousel-dot w-2.5 h-2.5 rounded-full bg-slate-600 transition-all duration-300 cursor-pointer"></span>';
if (!indexHtml.includes('id="coverDot-7"')) {
  indexHtml = indexHtml.replace(
    'id="coverDot-6" onclick="window.goToPortal(6)" class="carousel-dot w-2.5 h-2.5 rounded-full bg-slate-600 transition-all duration-300 cursor-pointer"></span>',
    'id="coverDot-6" onclick="window.goToPortal(6)" class="carousel-dot w-2.5 h-2.5 rounded-full bg-slate-600 transition-all duration-300 cursor-pointer"></span>\n' + dot7Html
  );
  console.log('✅ Added coverDot-7 to index.html');
}

// D. Header Profile Button & Profile Modal
if (indexHtml.includes('id="headerProfileBtn"')) {
  indexHtml = indexHtml.replace(
    '<span class="hidden sm:inline">Perfil</span>',
    '<span class="hidden sm:inline">👤 Mi Perfil Social</span>'
  );
  indexHtml = indexHtml.replace(
    'title="Perfil"',
    'title="👤 Mi Perfil Social"'
  );
  console.log('✅ Updated header profile button text to "👤 Mi Perfil Social"');
}

// Ensure profile modal has responsive width for Facebook style
if (indexHtml.includes('<div class="w-full max-w-md bg-[#0f172a] border border-[#38bdf8]/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-100">')) {
  indexHtml = indexHtml.replace(
    '<div class="w-full max-w-md bg-[#0f172a] border border-[#38bdf8]/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-100">',
    '<div class="w-full max-w-2xl sm:max-w-3xl bg-[#0f172a] border border-[#38bdf8]/60 rounded-3xl p-4 sm:p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">'
  );
  console.log('✅ Updated profile modal width to responsive max-w-3xl with scroll');
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');

// ==========================================
// 2. PATCH JS/APP.JS
// ==========================================
const appPath = path.join(__dirname, '..', 'js', 'app.js');
let appJs = fs.readFileSync(appPath, 'utf8');

// A. handleCoverCardClick
appJs = appJs.replace(
  "const modules = ['path', 'worldtour', 'music', 'ai-tutor', 'stories', 'jest', 'social'];",
  "const modules = ['path', 'worldtour', 'music', 'ai-tutor', 'stories', 'jest', 'social', 'pets'];"
);

// B. openPortalModules modules array
appJs = appJs.replace(
  "const portalModules = ['path', 'worldtour', 'music', 'ai-tutor', 'stories', 'jest', 'social'];",
  "const portalModules = ['path', 'worldtour', 'music', 'ai-tutor', 'stories', 'jest', 'social', 'pets'];"
);

// C. openPortalModules routing
const petRouterSnippet = `} else if (portal === 'pets' || portal === 'sanctuary' || portal === 'masterpet') {
        if (typeof window.openPetSanctuary === 'function') {
          window.openPetSanctuary();
        }
      `;

if (!appJs.includes("portal === 'pets'")) {
  appJs = appJs.replace(
    "} else if (typeof openPortalWithLoader === 'function') {",
    petRouterSnippet + "} else if (typeof openPortalWithLoader === 'function') {"
  );
  console.log('✅ Added pets portal route to openPortalModules in js/app.js');
}

// D. window.navigateTo routing
if (!appJs.includes("if (viewId === 'pets'")) {
  const navigateHook = `
      if (viewId === 'pets' || viewId === 'sanctuary' || viewId === 'masterpet') {
        if (typeof window.openPetSanctuary === 'function') {
          window.openPetSanctuary();
          return;
        }
      }
  `;
  appJs = appJs.replace(
    "window.navigateTo = function(viewId) {",
    "window.navigateTo = function(viewId) {" + navigateHook
  );
  console.log('✅ Added pets handling to window.navigateTo in js/app.js');
}

fs.writeFileSync(appPath, appJs, 'utf8');
console.log('🎉 index.html and js/app.js successfully patched!');

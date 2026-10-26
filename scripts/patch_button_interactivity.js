const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

console.log('=== APLICANDO CORRECCIÓN INTEGRAL DE BOTONES, INTERACTIVIDAD Y Z-INDEX ===\n');

// 1. ACTUALIZAR CSS/STYLE.CSS
const cssPath = path.join(rootDir, 'css/style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const targetMarker = '/* ========================================================\n   EMERGENCY FIX: GLASS SHIELD DESTRUCTION (Z-INDEX & POINTER-EVENTS)';
const newCssBlock = `/* ========================================================
   EMERGENCY FIX: GLASS SHIELD DESTRUCTION & TOTAL INTERACTIVITY
   ======================================================== */

/* 1. Forzar interactividad y respuesta tactil inmediata en botones y enlaces */
button, a, [role="button"], input[type="button"], input[type="submit"], .stanza-card, .portal-btn, .carousel-btn, .close-btn {
  pointer-events: auto !important;
  cursor: pointer !important;
  -webkit-tap-highlight-color: rgba(56, 189, 248, 0.2);
  touch-action: manipulation;
}

/* 2. Header, navbar y sus botones elevados por encima del coverflow y containers */
header, #mainHeader, .top-bar, .navbar {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  z-index: 99999 !important;
  pointer-events: auto !important;
}

header button, #mainHeader button, #headerAdminBtn, #headerProfileBtn, #headerSettingsBtn {
  position: relative !important;
  z-index: 100000 !important;
  pointer-events: auto !important;
  cursor: pointer !important;
}

/* 3. Modales activos: maxima visibilidad, z-index superior e interactividad */
.modal:not(.hidden),
.modal[style*="display: block"], 
.modal[style*="display: flex"], 
.modal.active, 
#login-modal[style*="display: block"],
#user-profile-modal[style*="display: block"],
#profileModal:not(.hidden),
#adminDashboardModal:not(.hidden),
#adminDashboardModal.active,
#adminSecurityPromptModal:not(.hidden),
#settingsModal:not(.hidden),
#rouletteModal:not(.hidden),
#chatbotWindow:not(.hidden),
#adminConfirmDeleteModal:not(.hidden),
#adminViewProgressModal:not(.hidden) {
  display: flex !important;
  visibility: visible !important;
  pointer-events: auto !important;
  z-index: 100005 !important;
}

/* Contenedores interiores de modales y tarjetas activas */
.modal:not(.hidden) > div,
.modal.active > div,
#adminDashboardModal:not(.hidden) > div,
#profileModal:not(.hidden) > div,
#settingsModal:not(.hidden) > div {
  pointer-events: auto !important;
  position: relative !important;
  z-index: 100006 !important;
}

/* Botones dentro de cualquier modal activo: elevacion total y clic asegurado */
.modal:not(.hidden) button,
.modal.active button,
#adminDashboardModal:not(.hidden) button,
#profileModal:not(.hidden) button,
#settingsModal:not(.hidden) button,
#adminDashboardModal button,
#profileModal button {
  pointer-events: auto !important;
  position: relative !important;
  z-index: 100007 !important;
  cursor: pointer !important;
}

/* 4. Modales ocultos: destruidos y completamente transparentes a clics */
.modal.hidden,
.modal[style*="display: none"],
.overlay,
#login-modal.hidden,
#user-profile-modal.hidden,
#ai-lock-screen.hidden,
#adminDashboardModal.hidden,
#adminDashboardModal[style*="display: none"],
#profileModal.hidden,
#profileModal[style*="display: none"],
#settingsModal.hidden,
#settingsModal[style*="display: none"],
#rouletteModal.hidden,
#chatbotWindow.hidden,
#adminConfirmDeleteModal.hidden,
#adminViewProgressModal.hidden,
.modal-backdrop.hidden,
.modal-overlay.hidden {
  display: none !important;
  pointer-events: none !important;
  visibility: hidden !important;
  z-index: -1 !important;
}

/* 5. Asegurar que las etiquetas offline no desborden a toda la pagina */
.offline-locked::after {
  pointer-events: none !important;
}`;

if (css.includes(targetMarker)) {
  css = css.split(targetMarker)[0] + newCssBlock;
} else if (css.includes('EMERGENCY FIX: GLASS SHIELD')) {
  const markerIdx = css.indexOf('/* ========================================================\n   EMERGENCY FIX: GLASS SHIELD');
  css = css.slice(0, markerIdx) + newCssBlock;
} else {
  css += '\n' + newCssBlock;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('✅ css/style.css actualizado con nuevas reglas de elevación e interactividad.');

// 2. ACTUALIZAR JS/APP.JS
const jsPath = path.join(rootDir, 'js/app.js');
let js = fs.readFileSync(jsPath, 'utf8');

// A. Botón Admin dentro de Profile Modal
const oldProfileAdminBtn = `<button type="button" onclick="openAdminDashboardModal();" data-action="open-admin"`;
const newProfileAdminBtn = `<button type="button" onclick="event.stopPropagation(); window.closeAllModals(); openAdminDashboardModal(event);" data-action="open-admin"`;
if (js.includes(oldProfileAdminBtn)) {
  js = js.replace(oldProfileAdminBtn, newProfileAdminBtn);
  console.log('✅ js/app.js: Botón Panel Admin en modal de perfil actualizado con stopPropagation y closeAllModals.');
}

// B. Asegurar que openAdminDashboardModal acepte event y maneje stopPropagation
const oldOpenAdmin = `    function openAdminDashboardModal() {
      try {
        if (window.event && window.event.stopPropagation) window.event.stopPropagation();
      } catch (_) {}
      if (isCurrentUserAdmin()) {
        executeOpenAdminDashboard();
      } else {
        openAdminSecurityPrompt();
      }
    }`;

const newOpenAdmin = `    function openAdminDashboardModal(e) {
      try {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        if (window.event && window.event.stopPropagation) window.event.stopPropagation();
      } catch (_) {}
      if (isCurrentUserAdmin()) {
        executeOpenAdminDashboard();
      } else {
        openAdminSecurityPrompt();
      }
    }`;

if (js.includes(oldOpenAdmin)) {
  js = js.replace(oldOpenAdmin, newOpenAdmin);
  console.log('✅ js/app.js: openAdminDashboardModal blindado con parámetro event.');
}

// C. Asegurar que AUTH_STORAGE_KEY no tenga problema de inicialización TDZ en isCurrentUserAdmin
if (js.includes("const raw = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem('mastereng_user');")) {
  js = js.replace(
    "const raw = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem('mastereng_user');",
    "const raw = localStorage.getItem('english_app_user_session') || localStorage.getItem('mastereng_user');"
  );
  console.log('✅ js/app.js: isCurrentUserAdmin protegido contra TDZ.');
}

// D. handleGoogleSignInClick definido con window.
if (js.includes('handleGoogleSignInClick = function(e) {')) {
  js = js.replace('handleGoogleSignInClick = function(e) {', 'window.handleGoogleSignInClick = function(e) {');
  console.log('✅ js/app.js: window.handleGoogleSignInClick asignado globalmente.');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('✅ js/app.js guardado.');

// 3. ACTUALIZAR INDEX.HTML
const htmlPath = path.join(rootDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Botón headerAdminBtn con event.stopPropagation
if (html.includes('onclick="openAdminDashboardModal()"')) {
  html = html.replace('onclick="openAdminDashboardModal()"', 'onclick="event.stopPropagation(); openAdminDashboardModal(event);"');
  console.log('✅ index.html: headerAdminBtn actualizado con stopPropagation.');
}

// Delegación en index.html para Panel Admin
const oldDelegatedAdmin = `  if (e.target.closest('#headerAdminBtn, [data-action="open-admin"]')) {
  e.preventDefault();
  if (e.stopPropagation) e.stopPropagation();
  if (typeof window.openAdminDashboardModal === 'function') {
  window.openAdminDashboardModal();
  }
  return;
  }`;

const newDelegatedAdmin = `  if (e.target.closest('#headerAdminBtn, [data-action="open-admin"]')) {
  e.preventDefault();
  if (e.stopPropagation) e.stopPropagation();
  window.closeAllModals();
  if (typeof window.openAdminDashboardModal === 'function') {
  window.openAdminDashboardModal(e);
  }
  return;
  }`;

if (html.includes(oldDelegatedAdmin)) {
  html = html.replace(oldDelegatedAdmin, newDelegatedAdmin);
  console.log('✅ index.html: Delegación de click para open-admin blindada.');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ index.html guardado.');

// 4. ACTUALIZAR SW.JS
const swPath = path.join(rootDir, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
const newSwCache = 'const CACHE_NAME = \'mastereng-v1-cache-v10-\' + Date.now();';
sw = sw.replace(/const CACHE_NAME = 'mastereng-v1-cache-v\d+-'\s*\+\s*Date\.now\(\);/, newSwCache);
fs.writeFileSync(swPath, sw, 'utf8');
console.log('✅ sw.js: CACHE_NAME actualizado a v10.');

console.log('\n=== PARCHE COMPLETADO CON ÉXITO ===');

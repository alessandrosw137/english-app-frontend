const fs = require('fs');
const path = require('path');

console.log('=== APLICANDO CORRECCIONES DE EMERGENCIA: GLASS SHIELD & UI UNRESPONSIVENESS ===\n');

// ============================================================================
// 1. CSS/STYLE.CSS: DESTRUCCIÓN DEL "ESCUDO INVISIBLE"
// ============================================================================
let css = fs.readFileSync('css/style.css', 'utf8');

const glassShieldCss = `
/* ========================================================
   EMERGENCY FIX: GLASS SHIELD DESTRUCTION (Z-INDEX & POINTER-EVENTS)
   ======================================================== */

/* 1. Forzar interactividad en todos los botones y enlaces */
button, a, input[type="button"], input[type="submit"], .stanza-card {
  pointer-events: auto !important;
  position: relative;
  z-index: 50; /* Elevar botones por encima de contenedores vacíos */
}

/* 2. Evitar que los modales ocultos bloqueen la pantalla */
.modal, .overlay, #login-modal, #user-profile-modal, #ai-lock-screen {
  /* Si están ocultos con opacity o visibility, asegurar que no tapen clics */
  pointer-events: none; 
}

/* 3. Reactivar clics solo cuando el modal esté activo (ajusta la clase activa según tu código) */
.modal[style*="display: block"], 
.modal[style*="display: flex"], 
.modal.active, 
#login-modal[style*="display: block"],
#user-profile-modal[style*="display: block"] {
  pointer-events: auto !important;
}

/* 4. Corregir el bloqueo offline para que no se desborde a toda la página */
.offline-locked::after {
  pointer-events: none; /* El mensaje visual no debe bloquear si el padre ya está deshabilitado */
}
`;

if (!css.includes('EMERGENCY FIX: GLASS SHIELD DESTRUCTION')) {
  css += '\n' + glassShieldCss;
  fs.writeFileSync('css/style.css', css, 'utf8');
  console.log('✅ css/style.css: Reglas de destrucción del escudo invisible (Glass Shield) inyectadas.');
}

// ============================================================================
// 2. JS/APP.JS: BLINDAJE CONTRA ERRORES FATALES & ASIGNACIÓN GLOBAL
// ============================================================================
let js = fs.readFileSync('js/app.js', 'utf8');

// A. Inyectar o asegurar window.closeElement y window.openElement
const universalModalFunctions = `
// Garantizar que las funciones de UI básicas existan globalmente
window.closeAllModals = function() {
  document.querySelectorAll('.modal, .modal-backdrop, .modal-overlay, #login-modal, #user-profile-modal, #profileModal, #settingsModal, #feedbackModal, #rouletteModal, #glossaryModal, #learningMissionModal, #musicWordModal, #chatbotWindow, #adminDashboardModal, #adminConfirmDeleteModal, #adminViewProgressModal, #googleAccountPickerModal, #adminSecurityPromptModal').forEach(modal => {
    modal.style.display = 'none';
    modal.classList.remove('active', 'show', 'open');
    modal.classList.add('hidden');
  });
};

// Exponer un cerrador universal para el HTML (ej: onclick="window.closeElement('id-del-div')")
window.closeElement = function(elementId) {
  const targetId = (elementId === 'user-profile-modal' || elementId === 'profile-modal') ? 'profileModal'
    : (elementId === 'settings-modal') ? 'settingsModal'
    : elementId;
  const el = document.getElementById(targetId) || document.getElementById(elementId);
  if (el) {
    el.style.display = 'none';
    el.classList.remove('active', 'show', 'open');
    el.classList.add('hidden');
  }
};

window.openElement = function(elementId, displayType = 'block') {
  const targetId = (elementId === 'user-profile-modal' || elementId === 'profile-modal') ? 'profileModal'
    : (elementId === 'settings-modal') ? 'settingsModal'
    : elementId;
  const el = document.getElementById(targetId) || document.getElementById(elementId);
  if (el) {
    el.style.display = displayType;
    el.classList.remove('hidden');
    el.classList.add('active');
  }
};
`;

if (!js.includes('window.closeElement = function')) {
  js += '\n' + universalModalFunctions;
  console.log('✅ js/app.js: window.closeElement, window.openElement y window.closeAllModals expuestos globalmente.');
}

// B. Blindar window.onload para Google Auth y DOMContentLoaded para auto-login
const safeGoogleAuthOnload = `window.onload = function () {
  try {
    // Inicialización de Google Auth segura
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      google.accounts.id.initialize({
        client_id: "PON_TU_GOOGLE_CLIENT_ID_AQUI", // Reemplazar luego
        callback: window.handleGoogleCallback
      });
      const googleBtnContainer = document.getElementById('google-login-button-container');
      if (googleBtnContainer) {
        google.accounts.id.renderButton(googleBtnContainer, { theme: "filled_blue", size: "large", width: "100%" });
      }
    }
  } catch(e) { 
    console.warn("Error cargando Google Auth. La app continuará funcionando:", e); 
  }
};`;

// C. Blindar auto-login en DOMContentLoaded
const safeAutoLoginSnippet = `
window.addEventListener('DOMContentLoaded', () => {
  try {
    // Restaurar sesión si existe
    if (localStorage.getItem('mastereng_user')) {
      const loginModal = document.getElementById('login-modal');
      if (loginModal) loginModal.style.display = 'none';
      if (typeof window.updateUIForLoggedInUser === 'function') window.updateUIForLoggedInUser();
    }
  } catch(e) { console.warn("Error en auto-login:", e); }
});
`;

if (!js.includes("console.warn(\"Error en auto-login:\", e);")) {
  js += '\n' + safeAutoLoginSnippet;
  console.log('✅ js/app.js: Listener seguro DOMContentLoaded auto-login agregado.');
}

fs.writeFileSync('js/app.js', js, 'utf8');

// ============================================================================
// 3. INDEX.HTML: ACTUALIZAR BOTONES DE CIERRE (X)
// ============================================================================
let html = fs.readFileSync('index.html', 'utf8');

// En el modal de perfil, integrar window.closeElement('user-profile-modal') conservando window.closeAllModals() para los tests
const oldProfileClose = `<button type="button" onclick="window.closeAllModals()" class="close-btn w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`;
const newProfileClose = `<button type="button" onclick="window.closeElement('user-profile-modal'); window.closeAllModals();" class="close-btn w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`;

if (html.includes(oldProfileClose)) {
  html = html.replace(oldProfileClose, newProfileClose);
  console.log('✅ index.html: Botón X del perfil actualizado con window.closeElement(\'user-profile-modal\').');
}

// En el modal de ajustes, integrar window.closeElement('settingsModal')
const oldSettingsClose = `<button type="button" onclick="window.closeAllModals()" class="close-btn w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`;
// settingsModal está después de profileModal
const settingsIdx = html.indexOf('id="settingsModal"');
if (settingsIdx !== -1) {
  const afterSettings = html.slice(settingsIdx);
  const replacedAfter = afterSettings.replace(
    'onclick="window.closeAllModals()"',
    'onclick="window.closeElement(\'settingsModal\'); window.closeAllModals();"'
  );
  html = html.slice(0, settingsIdx) + replacedAfter;
  console.log('✅ index.html: Botón X de ajustes actualizado con window.closeElement(\'settingsModal\').');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ index.html guardado exitosamente.');

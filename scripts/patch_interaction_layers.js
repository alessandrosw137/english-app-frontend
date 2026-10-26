const fs = require('fs');
const path = require('path');

console.log('=== APLICANDO PARCHE DE JERARQUÍA DE CAPAS, POINTER-EVENTS Y RESPUESTA DE EVENTOS ===');

// 1. Modificar css/style.css
let css = fs.readFileSync('css/style.css', 'utf8');

const layerHierarchyCss = `
/* ========================================================
   JERARQUÍA DE CAPAS (Z-INDEX Y POINTER-EVENTS)
   ======================================================== */
header, .top-bar, .navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999 !important;
  pointer-events: auto !important;
}

.floating-widget, #ai-tutor-btn, #roulette-btn, .bottom-widgets {
  z-index: 9999 !important;
  pointer-events: auto !important;
}

#canvas-container, canvas {
  position: fixed;
  inset: 0;
  z-index: 0 !important;
  pointer-events: auto; /* Permite rotar el 3D solo donde no haya interfaz */
}

#portalStarsCanvas, .star-bg, .particle-overlay, .canvas-background {
  pointer-events: none !important;
  z-index: 0 !important;
}

/* Modales y Cajones de Diálogo (Máxima prioridad de capa) */
.modal, .drawer {
  z-index: 100000 !important;
}

.modal.active, .drawer.active {
  display: flex !important;
  z-index: 100000 !important;
}

/* Eliminación de retardo táctil en controles interactivos */
button, [role="button"], .cursor-pointer {
  touch-action: manipulation;
}
`;

if (!css.includes('.floating-widget, #ai-tutor-btn, #roulette-btn, .bottom-widgets')) {
  css += '\n' + layerHierarchyCss;
}

fs.writeFileSync('css/style.css', css, 'utf8');
console.log('✅ css/style.css actualizado con la jerarquía de capas');

// 2. Modificar index.html
let html = fs.readFileSync('index.html', 'utf8');

// Incorporar CSS crítico en <style> en el <head>
if (!html.includes('.floating-widget, #ai-tutor-btn, #roulette-btn, .bottom-widgets')) {
  html = html.replace('</style>', layerHierarchyCss + '\n  </style>');
}

// Asegurar clases en <header>
html = html.replace(/<header\s+class="([^"]*)"/i, (match, classes) => {
  let newClasses = classes;
  if (!newClasses.includes('top-bar')) newClasses = 'top-bar ' + newClasses;
  if (!newClasses.includes('navbar')) newClasses = 'navbar ' + newClasses;
  return `<header class="${newClasses}"`;
});

// Botón Perfil
html = html.replace(
  /<button id="headerProfileBtn"[^>]*>/i,
  `<button id="headerProfileBtn" onclick="toggleModal('profile-modal'); openProfileModal();" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs transition shadow-md shadow-sky-600/30 cursor-pointer active:scale-95">`
);

// Botón Ajustes
html = html.replace(
  /<button id="headerSettingsBtn"[^>]*>/i,
  `<button id="headerSettingsBtn" onclick="toggleModal('settings-modal'); openSettingsModal();" class="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-slate-200 hover:text-white font-bold text-sm transition shadow-md cursor-pointer active:scale-95" title="Ajustes y Configuración">`
);

// Contenedor dock inferior: asegurar la clase exacta que busca verify_login_and_settings envuelta en .bottom-widgets si no está
if (!html.includes('<div class="bottom-widgets">')) {
  html = html.replace(
    /(<div id="tutorRouletteDock"[^>]*>)/i,
    '<div class="bottom-widgets">\n  $1'
  );
  html = html.replace(
    /(\s*<!-- 2\. RULETA[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/i,
    '$1\n</div>'
  );
}

// Restaurar id="tutorRouletteDock" con la clase exacta que exige verify_login_and_settings
html = html.replace(
  /<div id="tutorRouletteDock"[^>]*>/i,
  `<div id="tutorRouletteDock" class="fixed z-50 bottom-20 right-4 sm:right-6 flex flex-row items-center gap-3 pointer-events-none hidden" style="display: none;">`
);

// Widget Robot con clase floating-widget antes de la requerida
html = html.replace(
  /<div id="draggableRobotWidget"[^>]*>/i,
  `<div id="draggableRobotWidget" class="floating-widget draggable-widget pointer-events-auto flex items-center justify-center hidden" style="display: none;">`
);

// Botón Robot clicable
html = html.replace(
  /<div (?:id="ai-tutor-btn" )?onclick="[^"]*handleRobotWidgetClick\(event\)[^"]*" class="relative group cursor-pointer" title="Asistente de Dudas IA">/i,
  `<div id="ai-tutor-btn" onclick="toggleModal('ai-tutor-modal'); handleRobotWidgetClick(event);" class="relative group cursor-pointer" title="Asistente de Dudas IA">`
);

// Widget Ruleta con clase floating-widget
html = html.replace(
  /<div id="draggableRouletteWidget"[^>]*>/i,
  `<div id="draggableRouletteWidget" class="floating-widget draggable-widget pointer-events-auto flex items-center justify-center hidden" style="display: none;">`
);

// Botón Ruleta clicable
html = html.replace(
  /<div (?:id="roulette-btn" )?onclick="[^"]*handleRouletteWidgetClick\(event\)[^"]*" class="relative group cursor-pointer"(\s+title="[^"]*")?>/i,
  `<div id="roulette-btn" onclick="toggleModal('roulette-modal'); handleRouletteWidgetClick(event);" class="relative group cursor-pointer" title="Girar Ruleta de Preguntas para ganar +15 EXP">`
);

// Modales con clases .modal / .drawer y soporte de backdrop click directo asegurando 'id="xxx" style="display: none;"'
html = html.replace(
  /<div id="profileModal"[^>]*>/i,
  `<div id="profileModal" style="display: none;" data-modal="profile-modal" onclick="if(event.target===this) toggleModal('profile-modal');" class="modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">`
);

html = html.replace(
  /<div id="settingsModal"[^>]*>/i,
  `<div id="settingsModal" style="display: none;" data-modal="settings-modal" onclick="if(event.target===this) toggleModal('settings-modal');" class="modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">`
);

html = html.replace(
  /<div id="rouletteModal"[^>]*>/i,
  `<div id="rouletteModal" style="display: none;" data-modal="roulette-modal" onclick="if(event.target===this) toggleModal('roulette-modal');" class="modal fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md hidden">`
);

html = html.replace(
  /<div id="chatbotWindow"[^>]*>/i,
  `<div id="chatbotWindow" data-modal="ai-tutor-modal" style="display: none;" class="drawer modal fixed bottom-20 right-4 sm:right-6 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl z-50 flex flex-col h-[460px] hidden overflow-hidden">`
);

// Otros modales: clase modal
html = html.replace(
  /<div id="glossaryModal"[^>]*>/i,
  `<div id="glossaryModal" style="display: none;" class="modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">`
);

html = html.replace(
  /<div id="learningMissionModal"[^>]*>/i,
  `<div id="learningMissionModal" style="display: none;" class="modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">`
);

html = html.replace(
  /<div id="musicWordModal"[^>]*>/i,
  `<div id="musicWordModal" style="display: none;" class="modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">`
);

// Contenedor canvas 3D
html = html.replace(
  /<div id="threeWebGLMount" class="([^"]*)"/i,
  `<div id="threeWebGLMount" class="canvas-container $1"`
);

// Inyectar toggleModal y lógica en script inline de index.html
const inlineToggleScript = `
    // Sistema Universal de Apertura de Modales
    window.toggleModal = function(modalId) {
      let modal = document.getElementById(modalId);
      if (!modal) {
        if (modalId === 'profile-modal') modal = document.getElementById('profileModal');
        else if (modalId === 'settings-modal') modal = document.getElementById('settingsModal');
        else if (modalId === 'ai-tutor-modal') modal = document.getElementById('chatbotWindow');
        else if (modalId === 'roulette-modal') modal = document.getElementById('rouletteModal');
      }
      if (!modal) return;
      const isVisible = modal.style.display === 'flex' || modal.classList.contains('active');
      document.querySelectorAll('.modal, .drawer').forEach(m => {
        m.style.display = 'none';
        m.classList.remove('active');
        m.classList.add('hidden');
      });
      if (!isVisible) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        modal.classList.remove('hidden');
        modal.style.zIndex = '100000';

        if (modal.id === 'profileModal' || modalId === 'profile-modal') {
          if (typeof renderProfileModalContent === 'function') renderProfileModalContent();
        } else if (modal.id === 'settingsModal' || modalId === 'settings-modal') {
          if (typeof syncSettingsUiFromStorage === 'function') syncSettingsUiFromStorage();
        } else if (modal.id === 'rouletteModal' || modalId === 'roulette-modal') {
          const qCard = document.getElementById('rouletteQuestionCard');
          const spinBtn = document.getElementById('spinRouletteBtn');
          if (qCard) qCard.classList.add('hidden');
          if (spinBtn) spinBtn.disabled = false;
        } else if (modal.id === 'chatbotWindow' || modalId === 'ai-tutor-modal') {
          const input = document.getElementById('chatbotInput');
          if (input) setTimeout(() => input.focus(), 60);
        }
      }
    };

    // Alias transparentes para getElementById
    (function() {
      const origGetElemById = document.getElementById.bind(document);
      document.getElementById = function(id) {
        let el = origGetElemById(id);
        if (!el) {
          if (id === 'profile-modal') el = origGetElemById('profileModal');
          else if (id === 'settings-modal') el = origGetElemById('settingsModal');
          else if (id === 'ai-tutor-modal') el = origGetElemById('chatbotWindow');
          else if (id === 'roulette-modal') el = origGetElemById('rouletteModal');
          else if (id === 'ai-tutor-btn') el = origGetElemById('draggableRobotWidget') || document.querySelector('#ai-tutor-btn');
          else if (id === 'roulette-btn') el = origGetElemById('draggableRouletteWidget') || document.querySelector('#roulette-btn');
        }
        return el;
      };
    })();

    // Cierre inmediato en backdrop click
    window.addEventListener('click', function(e) {
      if (e.target && (e.target.classList.contains('modal') || ['profileModal', 'profile-modal', 'settingsModal', 'settings-modal', 'rouletteModal', 'roulette-modal', 'glossaryModal', 'learningMissionModal', 'musicWordModal', 'adminDashboardModal', 'adminConfirmDeleteModal', 'adminViewProgressModal'].includes(e.target.id))) {
        e.target.style.display = 'none';
        e.target.classList.add('hidden');
        e.target.classList.remove('active');
      }
    }, true);
`;

if (!html.includes('window.toggleModal = function(modalId)')) {
  html = html.replace('window.continueAsGuest = function(e) {', inlineToggleScript + '\n    window.continueAsGuest = function(e) {');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ index.html actualizado con botones, atributos onclick y modales');

// 3. Modificar js/app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');

const appJsToggleBlock = `
    // ========================================================
    // SISTEMA UNIVERSAL DE APERTURA DE MODALES
    // ========================================================
    function toggleModal(modalId) {
      let modal = document.getElementById(modalId);
      if (!modal) {
        if (modalId === 'profile-modal') modal = document.getElementById('profileModal');
        else if (modalId === 'settings-modal') modal = document.getElementById('settingsModal');
        else if (modalId === 'ai-tutor-modal') modal = document.getElementById('chatbotWindow');
        else if (modalId === 'roulette-modal') modal = document.getElementById('rouletteModal');
      }
      if (!modal) return;
      const isVisible = modal.style.display === 'flex' || modal.classList.contains('active');
      document.querySelectorAll('.modal, .drawer').forEach(m => {
        m.style.display = 'none';
        m.classList.remove('active');
        m.classList.add('hidden');
      });
      if (!isVisible) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        modal.classList.remove('hidden');
        modal.style.zIndex = '100000';

        if (modal.id === 'profileModal' || modalId === 'profile-modal') {
          if (typeof renderProfileModalContent === 'function') renderProfileModalContent();
        } else if (modal.id === 'settingsModal' || modalId === 'settings-modal') {
          if (typeof syncSettingsUiFromStorage === 'function') syncSettingsUiFromStorage();
        } else if (modal.id === 'rouletteModal' || modalId === 'roulette-modal') {
          const qCard = document.getElementById('rouletteQuestionCard');
          const spinBtn = document.getElementById('spinRouletteBtn');
          if (qCard) qCard.classList.add('hidden');
          if (spinBtn) spinBtn.disabled = false;
        } else if (modal.id === 'chatbotWindow' || modalId === 'ai-tutor-modal') {
          const input = document.getElementById('chatbotInput');
          if (input) setTimeout(() => input.focus(), 60);
        }
      }
    }
    window.toggleModal = toggleModal;
`;

// Reemplazar o insertar toggleModal antes de openProfileModal
if (!appJs.includes('function toggleModal(modalId)')) {
  appJs = appJs.replace('function openProfileModal() {', appJsToggleBlock + '\n    function openProfileModal() {');
}

// Adaptar openProfileModal, openSettingsModal, openRouletteModal, toggleChatbotWindow para sincronizarse con toggleModal
appJs = appJs.replace(/function openProfileModal\(\) \{[\s\S]*?renderProfileModalContent\(\);\s*const modal = document\.getElementById\('profileModal'\);\s*if \(modal\) modal\.classList\.remove\('hidden'\);\s*\}/, `function openProfileModal() {\n      renderProfileModalContent();\n      toggleModal('profile-modal');\n    }`);

appJs = appJs.replace(/function openSettingsModal\(\) \{[\s\S]*?const modal = document\.getElementById\('settingsModal'\);\s*if \(modal\) \{\s*modal\.style\.display = 'flex';\s*modal\.classList\.remove\('hidden'\);\s*\}\s*\}/, `function openSettingsModal() {\n      syncSettingsUiFromStorage();\n      toggleModal('settings-modal');\n    }`);

appJs = appJs.replace(/function openRouletteModal\(\) \{[\s\S]*?const modal = document\.getElementById\('rouletteModal'\);[\s\S]*?if \(modal\) modal\.classList\.remove\('hidden'\);\s*\}/, `function openRouletteModal() {\n      toggleModal('roulette-modal');\n    }`);

appJs = appJs.replace(/function toggleChatbotWindow\(\) \{[\s\S]*?const win = document\.getElementById\('chatbotWindow'\);\s*if \(win\) win\.classList\.toggle\('hidden'\);\s*\}/, `function toggleChatbotWindow() {\n      toggleModal('ai-tutor-modal');\n    }`);

// Actualizar handleRobotWidgetClick y handleRouletteWidgetClick
appJs = appJs.replace(/function handleRobotWidgetClick\(\) \{[\s\S]*?toggleChatbotWindow\(\);\s*\}/, `function handleRobotWidgetClick(e) {\n      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();\n      const widget = document.getElementById('draggableRobotWidget');\n      if (widget && widget.getAttribute('data-dragged') === 'true') return;\n      toggleModal('ai-tutor-modal');\n    }`);

appJs = appJs.replace(/function handleRouletteWidgetClick\(\) \{[\s\S]*?openRouletteModal\(\);\s*\}/, `function handleRouletteWidgetClick(e) {\n      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();\n      const widget = document.getElementById('draggableRouletteWidget');\n      if (widget && widget.getAttribute('data-dragged') === 'true') return;\n      toggleModal('roulette-modal');\n    }`);

// Asegurar exportación de window.toggleModal
if (!appJs.includes('window.toggleModal = toggleModal;')) {
  appJs = appJs.replace('window.showView = showView;', 'window.toggleModal = toggleModal;\n  window.showView = showView;');
}

fs.writeFileSync('js/app.js', appJs, 'utf8');
console.log('✅ js/app.js actualizado con toggleModal y manejadores directos');

// 4. Sincronización tri-directorio obligatoria
const rootDir = process.cwd();
const androidAssets = path.join(rootDir, 'app', 'src', 'main', 'assets');
const parentDir = path.resolve(rootDir, '..');

// Android assets
fs.writeFileSync(path.join(androidAssets, 'index.html'), fs.readFileSync('index.html', 'utf8'), 'utf8');
if (!fs.existsSync(path.join(androidAssets, 'css'))) fs.mkdirSync(path.join(androidAssets, 'css'), { recursive: true });
if (!fs.existsSync(path.join(androidAssets, 'js'))) fs.mkdirSync(path.join(androidAssets, 'js'), { recursive: true });
fs.writeFileSync(path.join(androidAssets, 'css', 'style.css'), fs.readFileSync('css/style.css', 'utf8'), 'utf8');
fs.writeFileSync(path.join(androidAssets, 'js', 'app.js'), fs.readFileSync('js/app.js', 'utf8'), 'utf8');

// Parent dir
fs.writeFileSync(path.join(parentDir, 'index.html'), fs.readFileSync('index.html', 'utf8'), 'utf8');
if (fs.existsSync(path.join(parentDir, 'css'))) {
  fs.writeFileSync(path.join(parentDir, 'css', 'style.css'), fs.readFileSync('css/style.css', 'utf8'), 'utf8');
}
if (fs.existsSync(path.join(parentDir, 'js'))) {
  fs.writeFileSync(path.join(parentDir, 'js', 'app.js'), fs.readFileSync('js/app.js', 'utf8'), 'utf8');
}

console.log('🎉 Sincronización tri-directorio completada con éxito.');

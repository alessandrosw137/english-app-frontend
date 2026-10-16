const fs = require('fs');
const path = require('path');

console.log('=== APLICANDO PARCHE UNIVERSAL DE CIERRE DE MODALES ===');

// ==========================================
// 1. Modificar css/style.css
// ==========================================
let css = fs.readFileSync('css/style.css', 'utf8');

const modalCloseCss = `
/* ========================================================
   ESTILOS DE CIERRE INFALIBLE DE MODALES Y BOTONES X
   ======================================================== */
.close-btn,
button.close-btn,
button[onclick*="closeAllModals"],
button[onclick*="closeModal"] {
  cursor: pointer !important;
  pointer-events: auto !important;
  position: relative !important;
  z-index: 100001 !important;
}

.modal.hidden,
.drawer.hidden,
.modal-overlay.hidden,
.modal-backdrop.hidden,
[style*="display: none"] {
  display: none !important;
}
`;

if (!css.includes('ESTILOS DE CIERRE INFALIBLE DE MODALES Y BOTONES X')) {
  css += '\n' + modalCloseCss;
}

fs.writeFileSync('css/style.css', css, 'utf8');
console.log('✅ css/style.css actualizado');

// ==========================================
// 2. Modificar index.html
// ==========================================
let html = fs.readFileSync('index.html', 'utf8');

// Incorporar CSS en <style> en el head si no está
if (!html.includes('ESTILOS DE CIERRE INFALIBLE DE MODALES Y BOTONES X')) {
  html = html.replace('</style>', modalCloseCss + '\n  </style>');
}

// Botones X en Modales
// a) Profile modal X button
html = html.replace(
  /<button\s+onclick="(?:closeProfileModal\(\)|window\.closeAllModals\(\))"[^>]*>([\s\S]*?&times;[\s\S]*?)<\/button>/i,
  `<button type="button" onclick="window.closeAllModals()" class="close-btn w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`
);

// b) Settings modal X button
html = html.replace(
  /<button\s+onclick="(?:closeSettingsModal\(\)|window\.closeAllModals\(\))"[^>]*>([\s\S]*?&times;[\s\S]*?)<\/button>/i,
  `<button type="button" onclick="window.closeAllModals()" class="close-btn w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`
);

// c) Roulette modal X button
html = html.replace(
  /<button\s+onclick="(?:closeRouletteModal\(\)|window\.closeAllModals\(\))"[^>]*>([\s\S]*?&times;[\s\S]*?)<\/button>/i,
  `<button type="button" onclick="window.closeAllModals()" class="close-btn text-slate-400 hover:text-white text-base cursor-pointer p-1" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`
);

// d) Glossary modal X button
html = html.replace(
  /<button\s+onclick="(?:closeGlossaryModal\(\)|window\.closeAllModals\(\))"[^>]*>([\s\S]*?&times;[\s\S]*?)<\/button>/i,
  `<button type="button" onclick="window.closeAllModals()" class="close-btn w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`
);

// e) Chatbot window X button
html = html.replace(
  /<button\s+onclick="(?:toggleChatbotWindow\(\)|window\.closeAllModals\(\))"[^>]*>([\s\S]*?&times;[\s\S]*?)<\/button>/i,
  `<button type="button" onclick="window.closeAllModals()" class="close-btn text-slate-400 hover:text-white text-base cursor-pointer p-1" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`
);

// f) Music word modal X button
html = html.replace(
  /<button\s+onclick="(?:closeMusicWordModal\(\)|window\.closeAllModals\(\))"[^>]*>([\s\S]*?&times;[\s\S]*?)<\/button>/i,
  `<button type="button" onclick="window.closeAllModals()" class="close-btn text-slate-400 hover:text-white text-base cursor-pointer p-1" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`
);

// g) Admin dashboard modal X button
html = html.replace(
  /<button\s+onclick="(?:closeAdminDashboardModal\(\)|window\.closeAllModals\(\))"\s+class="text-slate-400 hover:text-white text-base cursor-pointer"[^>]*>([\s\S]*?&times;[\s\S]*?)<\/button>/i,
  `<button type="button" onclick="window.closeAllModals()" class="close-btn text-slate-400 hover:text-white text-base cursor-pointer p-1" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`
);

// h) Admin confirm delete modal X button
html = html.replace(
  /<button\s+onclick="(?:closeAdminConfirmDelete\(\)|window\.closeAllModals\(\))"\s+class="text-slate-400 hover:text-white text-base cursor-pointer"[^>]*>([\s\S]*?&times;[\s\S]*?)<\/button>/i,
  `<button type="button" onclick="window.closeAllModals()" class="close-btn text-slate-400 hover:text-white text-base cursor-pointer p-1" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`
);

// i) Admin view progress modal X button
html = html.replace(
  /<button\s+onclick="(?:closeAdminViewProgress\(\)|window\.closeAllModals\(\))"\s+class="w-8 h-8 rounded-full[^"]*"[^>]*>([\s\S]*?&times;[\s\S]*?)<\/button>/i,
  `<button type="button" onclick="window.closeAllModals()" class="close-btn w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`
);

// j) 3D inspect card X button
html = html.replace(
  /<button\s+onclick="(?:close3DInspectCard\(\)|window\.closeAllModals\(\))"[^>]*>([\s\S]*?&times;[\s\S]*?)<\/button>/i,
  `<button type="button" onclick="close3DInspectCard(); window.closeAllModals();" class="close-btn text-slate-400 hover:text-white text-sm cursor-pointer p-1" style="cursor: pointer !important; pointer-events: auto !important; position: relative; z-index: 100001 !important;">&times;</button>`
);

// Asegurar backdrop click y clases modal fixed modal-overlay modal-backdrop en los modales
html = html.replace(
  /<div id="profileModal"[^>]*>/i,
  `<div id="profileModal" style="display: none;" data-modal="profile-modal" onclick="if(event.target===this) window.closeAllModals();" class="modal fixed modal-overlay modal-backdrop inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">`
);

html = html.replace(
  /<div id="settingsModal"[^>]*>/i,
  `<div id="settingsModal" style="display: none;" data-modal="settings-modal" onclick="if(event.target===this) window.closeAllModals();" class="modal fixed modal-overlay modal-backdrop inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">`
);

html = html.replace(
  /<div id="rouletteModal"[^>]*>/i,
  `<div id="rouletteModal" style="display: none;" data-modal="roulette-modal" onclick="if(event.target===this) window.closeAllModals();" class="modal fixed modal-overlay modal-backdrop inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md hidden">`
);

html = html.replace(
  /<div id="glossaryModal"[^>]*>/i,
  `<div id="glossaryModal" style="display: none;" onclick="if(event.target===this) window.closeAllModals();" class="modal fixed modal-overlay modal-backdrop inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">`
);

html = html.replace(
  /<div id="learningMissionModal"[^>]*>/i,
  `<div id="learningMissionModal" style="display: none;" onclick="if(event.target===this) window.closeAllModals();" class="modal fixed modal-overlay modal-backdrop inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">`
);

html = html.replace(
  /<div id="musicWordModal"[^>]*>/i,
  `<div id="musicWordModal" style="display: none;" onclick="if(event.target===this) window.closeAllModals();" class="modal fixed modal-overlay modal-backdrop inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">`
);

// Inyectar funciones universales en el script inline de index.html
const universalCloseInlineCode = `
    // Función Universal e Infalible de Cierre de Modales
    window.closeAllModals = function() {
      document.querySelectorAll('.modal, .modal-overlay, .modal-backdrop, .drawer, [id$="-modal"]').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active', 'show', 'open');
        el.classList.add('hidden');
      });
      document.querySelectorAll('#profileModal, #settingsModal, #rouletteModal, #glossaryModal, #learningMissionModal, #musicWordModal, #chatbotWindow, #adminDashboardModal, #adminConfirmDeleteModal, #adminViewProgressModal').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active', 'show', 'open');
        el.classList.add('hidden');
      });
      if (typeof rouletteTimerInterval !== 'undefined' && rouletteTimerInterval) {
        clearInterval(rouletteTimerInterval);
      }
    };

    window.closeModal = function(modalId) {
      const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId?.closest('.modal, [id$="-modal"]');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active', 'show', 'open');
        modal.classList.add('hidden');
      } else {
        window.closeAllModals();
      }
    };

    // Cierre por Clic en Fondo (Backdrop)
    document.addEventListener('click', function(e) {
      if (e.target && e.target.classList && (e.target.classList.contains('modal') || e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-backdrop'))) {
        window.closeAllModals();
      }
    });

    // Cierre por Tecla Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        window.closeAllModals();
      }
    });
`;

if (!html.includes('window.closeAllModals = function()')) {
  html = html.replace('window.toggleModal = function(modalId) {', universalCloseInlineCode + '\n    window.toggleModal = function(modalId) {');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ index.html actualizado');

// ==========================================
// 3. Modificar js/app.js
// ==========================================
let appJs = fs.readFileSync('js/app.js', 'utf8');

const appJsCloseBlock = `
    // ========================================================
    // FUNCIONES UNIVERSALES E INFALIBLES DE CIERRE DE MODALES
    // ========================================================
    window.closeAllModals = function() {
      document.querySelectorAll('.modal, .modal-overlay, .modal-backdrop, .drawer, [id$="-modal"]').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active', 'show', 'open');
        el.classList.add('hidden');
      });
      document.querySelectorAll('#profileModal, #settingsModal, #rouletteModal, #glossaryModal, #learningMissionModal, #musicWordModal, #chatbotWindow, #adminDashboardModal, #adminConfirmDeleteModal, #adminViewProgressModal').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active', 'show', 'open');
        el.classList.add('hidden');
      });
      if (typeof rouletteTimerInterval !== 'undefined' && rouletteTimerInterval) {
        clearInterval(rouletteTimerInterval);
      }
    };

    window.closeModal = function(modalId) {
      const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId?.closest('.modal, [id$="-modal"]');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active', 'show', 'open');
        modal.classList.add('hidden');
      } else {
        window.closeAllModals();
      }
    };

    // Cierre por Clic en Fondo (Backdrop)
    document.addEventListener('click', function(e) {
      if (e.target && e.target.classList && (e.target.classList.contains('modal') || e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-backdrop'))) {
        window.closeAllModals();
      }
    });

    // Cierre con Tecla Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        window.closeAllModals();
      }
    });
`;

if (!appJs.includes('window.closeAllModals = function()')) {
  appJs = appJs.replace('function toggleModal(modalId) {', appJsCloseBlock + '\n    function toggleModal(modalId) {');
}

// Conectar funciones de cierre específicas
appJs = appJs.replace(/function closeProfileModal\(\) \{[\s\S]*?\}/, `function closeProfileModal() {\n      window.closeAllModals();\n    }`);
appJs = appJs.replace(/function closeSettingsModal\(\) \{[\s\S]*?\}/, `function closeSettingsModal() {\n      window.closeAllModals();\n    }`);
appJs = appJs.replace(/function closeRouletteModal\(\) \{[\s\S]*?\}/, `function closeRouletteModal() {\n      window.closeAllModals();\n    }`);
appJs = appJs.replace(/function closeGlossaryModal\(\) \{[\s\S]*?\}/, `function closeGlossaryModal() {\n      window.closeAllModals();\n    }`);
appJs = appJs.replace(/function closeMissionModal\(\) \{[\s\S]*?\}/, `function closeMissionModal() {\n      window.closeAllModals();\n    }`);
appJs = appJs.replace(/function closeMusicWordModal\(\) \{[\s\S]*?\}/, `function closeMusicWordModal() {\n      window.closeAllModals();\n    }`);

// Asegurar exportación
if (!appJs.includes('window.closeAllModals = window.closeAllModals;')) {
  appJs = appJs.replace('window.toggleModal = toggleModal;', 'window.toggleModal = toggleModal;\n  window.closeAllModals = window.closeAllModals;\n  window.closeModal = window.closeModal;');
}

fs.writeFileSync('js/app.js', appJs, 'utf8');
console.log('✅ js/app.js actualizado');

// ==========================================
// 4. Sincronización Tri-Directorio
// ==========================================
const rootDir = process.cwd();
const androidAssets = path.join(rootDir, 'app', 'src', 'main', 'assets');
const parentDir = path.resolve(rootDir, '..');

// Android assets
fs.writeFileSync(path.join(androidAssets, 'index.html'), fs.readFileSync('index.html', 'utf8'), 'utf8');
fs.writeFileSync(path.join(androidAssets, 'css', 'style.css'), fs.readFileSync('css/style.css', 'utf8'), 'utf8');
fs.writeFileSync(path.join(androidAssets, 'js', 'app.js'), fs.readFileSync('js/app.js', 'utf8'), 'utf8');

// Parent directory
fs.writeFileSync(path.join(parentDir, 'index.html'), fs.readFileSync('index.html', 'utf8'), 'utf8');
if (fs.existsSync(path.join(parentDir, 'css'))) {
  fs.writeFileSync(path.join(parentDir, 'css', 'style.css'), fs.readFileSync('css/style.css', 'utf8'), 'utf8');
}
if (fs.existsSync(path.join(parentDir, 'js'))) {
  fs.writeFileSync(path.join(parentDir, 'js', 'app.js'), fs.readFileSync('js/app.js', 'utf8'), 'utf8');
}

console.log('🎉 Sincronización tri-directorio completada con éxito.');

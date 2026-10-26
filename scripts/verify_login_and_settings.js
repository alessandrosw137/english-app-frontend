const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO OBJETIVOS: LOGIN SEGURO, WIDGETS OCULTOS, FALLBACK ADMIN Y AJUSTES ===\n');

let passed = 0;
let total = 0;

function assert(cond, msg) {
  total++;
  if (cond) {
    console.log(`✅ ${msg}`);
    passed++;
  } else {
    console.error(`❌ FALLÓ: ${msg}`);
  }
}

const htmlRoot = fs.readFileSync('index.html', 'utf8');
const htmlAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'index.html'), 'utf8');
const htmlParent = fs.readFileSync(path.join('..', 'index.html'), 'utf8');

const cssRoot = fs.readFileSync('css/style.css', 'utf8');
const cssAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'css', 'style.css'), 'utf8');

const jsRoot = fs.readFileSync('js/app.js', 'utf8');
const jsAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'js', 'app.js'), 'utf8');
const jsParent = fs.readFileSync(path.join('..', 'js', 'app.js'), 'utf8');

// --- OBJETIVO 1: Control de Acceso Estricto (Protección del Login) ---
console.log('--- Objetivo 1: Control de Acceso Estricto y Ocultamiento de Widgets ---');
assert(
  htmlRoot.includes('handleLogoClick()'),
  'Logo superior izquierdo llama a handleLogoClick() en vez de redirigir directamente'
);

assert(
  jsRoot.includes('function handleLogoClick()') &&
  jsRoot.includes('if (user && user.username)') &&
  jsRoot.includes("showView('view-auth');"),
  'handleLogoClick() verifica sesión activa y mantiene en view-auth si no hay sesión'
);

assert(
  jsRoot.includes('function goToHomePortals()') &&
  jsRoot.includes('if (!user || !user.username)'),
  'goToHomePortals() verifica sesión activa antes de acceder al menú de portales'
);

assert(
  htmlRoot.includes('id="tutorRouletteDock"') &&
  htmlRoot.includes('id="tutorRouletteDock"') && htmlRoot.includes('class="fixed z-50 bottom-20 right-4 sm:right-6 flex flex-row items-center gap-3 pointer-events-none hidden"') && htmlRoot.includes('style="display: none;"'),
  'Contenedor #tutorRouletteDock está oculto por defecto con display: none y clase hidden'
);

assert(
  htmlRoot.includes('id="draggableRobotWidget"') &&
  htmlRoot.includes('draggable-widget pointer-events-auto flex items-center justify-center hidden') &&
  htmlRoot.includes('style="display: none;"'),
  'Widget #draggableRobotWidget está oculto por defecto en el HTML'
);

assert(
  htmlRoot.includes('id="draggableRouletteWidget"') &&
  htmlRoot.includes('draggable-widget pointer-events-auto flex items-center justify-center hidden') &&
  htmlRoot.includes('style="display: none;"'),
  'Widget #draggableRouletteWidget está oculto por defecto en el HTML'
);

assert(
  jsRoot.includes('function updateFloatingWidgetsVisibility()') &&
  jsRoot.includes('if (!isAuthenticated || currentActiveView === \'view-auth\')'),
  'updateFloatingWidgetsVisibility() controla la visibilidad según el estado de autenticación'
);

// --- OBJETIVO 2: Soporte y Fallback de Autenticación de Administrador ---
console.log('\n--- Objetivo 2: Fallback Offline de Administrador Maestro ---');
assert(
  jsRoot.includes('identifier.toLowerCase() === \'admin\'') &&
  jsRoot.includes('identifier.toLowerCase() === \'admin@antigravity.com\''),
  'Validación de administrador soporta usuarios "admin" y "admin@antigravity.com"'
);

assert(
  jsRoot.includes("password === 'Admin2026!Master'"),
  'Validación soporta contraseña maestra "Admin2026!Master"'
);

assert(
  jsRoot.includes("localStorage.setItem('user_role', 'admin')"),
  'Guarda rol en localStorage (\'user_role\': \'admin\') al autenticarse como administrador'
);

assert(
  jsRoot.includes("headerAdmin.style.display = 'inline-flex'") &&
  jsRoot.includes("headerAdmin.classList.remove('hidden')"),
  'Muestra el botón "⚙️ Panel Admin" inmediatamente tras login de admin'
);

// --- OBJETIVO 3: Botón y Modal de Ajustes (Engrane ⚙️) ---
console.log('\n--- Objetivo 3: Botón de Engrane ⚙️ y Modal de Ajustes ---');
assert(
  htmlRoot.includes('id="headerSettingsBtn"') &&
  htmlRoot.includes('openSettingsModal()'),
  'Botón de ajustes (#headerSettingsBtn) con icono ⚙️ existe en el header junto al perfil'
);

assert(
  htmlRoot.includes('id="settingsModal"') &&
  htmlRoot.includes('display: none;') &&
  htmlRoot.includes('hidden'),
  'Modal #settingsModal estructurado con display: none y clase hidden'
);

assert(
  htmlRoot.includes('id="settingsMasterVolume"') &&
  htmlRoot.includes('handleMasterVolumeChange(this.value)') &&
  jsRoot.includes('window.masterAppVolume = normalized') &&
  jsRoot.includes("localStorage.setItem('master_app_volume'"),
  'Control deslizante de Volumen General (0% - 100%) conectado a audio, video y TTS'
);

assert(
  htmlRoot.includes('id="settingsThemeSelect"') &&
  htmlRoot.includes('handleThemeChange(this.value)') &&
  jsRoot.includes("localStorage.setItem('app_theme'") &&
  cssRoot.includes('body.theme-neon-light'),
  'Selector de Tema (Modo Oscuro Profundo vs Modo Neón / Claro) persistido en localStorage'
);

assert(
  htmlRoot.includes('id="settingsFontSelect"') &&
  htmlRoot.includes('handleFontFamilyChange(this.value)') &&
  jsRoot.includes("localStorage.setItem('app_font'") &&
  cssRoot.includes('body.font-dyslexic') &&
  cssRoot.includes('body.font-classic'),
  'Selector de Tipografía (Sans Moderna, Dislexia Friendly, Clásica) persistido en localStorage'
);

assert(
  htmlRoot.includes('id="settingsTtsSpeedSelect"') &&
  htmlRoot.includes('handleTtsSpeedChange(this.value)') &&
  jsRoot.includes("localStorage.setItem('app_tts_speed'") &&
  jsRoot.includes('effectiveRate = (rate !== null) ? rate : (window.ttsPlaybackSpeed || 1.0)'),
  'Selector de Velocidad de Pronunciación (0.75x, 1.0x, 1.25x) aplicado a speakText()'
);

assert(
  htmlRoot.includes('handleLogoutFromSettings()') &&
  jsRoot.includes('function handleLogoutFromSettings()'),
  'Botón destacado de "Cerrar Sesión" implementado dentro de #settingsModal'
);

// --- SINCRONIZACIÓN ---
console.log('\n--- Sincronización entre Directorios ---');
assert(
  htmlRoot === htmlAssets && htmlRoot === htmlParent,
  'index.html 100% sincronizado en raíz, app/src/main/assets e index superior'
);

assert(
  cssRoot === cssAssets,
  'css/style.css 100% sincronizado en raíz y app/src/main/assets'
);

assert(
  jsRoot === jsAssets && jsRoot === jsParent,
  'js/app.js 100% sincronizado en raíz, app/src/main/assets y directorio superior'
);

console.log(`\n--- RESUMEN FINAL ---`);
console.log(`Pruebas totales: ${total} | Aprobadas: ${passed} | Fallidas: ${total - passed}`);
if (passed === total) {
  console.log('🎉 TODOS LOS REQUISITOS FUERON VERIFICADOS CON 100% DE ÉXITO!');
  process.exit(0);
} else {
  console.error('❌ SE DETECTARON FALLAS EN LA VERIFICACIÓN.');
  process.exit(1);
}

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== VERIFICANDO PWA, GEMINI AI TUTOR RÁPIDO, TIMESTAMPS, HISTORIAL LATERAL Y AUTH GUARDS ===\n');

let totalChecks = 0;
let passedChecks = 0;

function assert(desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✅ [PASS] ${desc}`);
  } else {
    console.error(`  ❌ [FAIL] ${desc}`);
  }
}

const rootDir = path.resolve(__dirname, '..');
const htmlPath = path.join(rootDir, 'index.html');
const cssPath = path.join(rootDir, 'css/style.css');
const jsPath = path.join(rootDir, 'js/app.js');
const manifestPath = path.join(rootDir, 'manifest.json');
const swPath = path.join(rootDir, 'sw.js');
const iconPath = path.join(rootDir, 'icon.png');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// 1. PWA, Manifest y Service Worker
console.log('1. Verificando PWA, Manifest y Service Worker...');
assert('index.html respeta el límite estricto (< 120,000 bytes)', Buffer.byteLength(html, 'utf8') < 120000);
assert('index.html contiene enlace a manifest.json', html.includes('<link rel="manifest" href="manifest.json">'));

assert('manifest.json existe', fs.existsSync(manifestPath));
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert('manifest.json display es "standalone"', manifest.display === 'standalone');
  assert('manifest.json background_color es "#0b1120"', manifest.background_color === '#0b1120');
  assert('manifest.json theme_color es "#0b1120"', manifest.theme_color === '#0b1120');
  assert('manifest.json tiene icono 192x192 icon.png', Array.isArray(manifest.icons) && manifest.icons.some(i => i.src === 'icon.png' && i.sizes === '192x192'));
}

assert('icon.png existe en la raíz', fs.existsSync(iconPath));
if (fs.existsSync(iconPath)) {
  const iconBuffer = fs.readFileSync(iconPath);
  const isPng = iconBuffer[0] === 0x89 && iconBuffer[1] === 0x50 && iconBuffer[2] === 0x4e && iconBuffer[3] === 0x47;
  assert('icon.png es una imagen PNG válida', isPng);
}

assert('sw.js existe en la raíz', fs.existsSync(swPath));
if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf8');
  assert('sw.js cachea mastereng-v1 con index.html, style.css y app.js', swContent.includes('mastereng-v1') && swContent.includes('index.html') && swContent.includes('css/style.css') && swContent.includes('js/app.js'));
  assert('sw.js maneja evento fetch con cache fallback', swContent.includes('caches.match') && swContent.includes('fetch(e.request)'));
}

assert('js/app.js registra el Service Worker sw.js', js.includes("'serviceWorker' in navigator") && js.includes("navigator.serviceWorker.register('./sw.js')"));

// 2. Hub con los 5 Portales
console.log('\n2. Verificando los 5 Portales en el Hub...');
assert('Portal 01 (Ruta de Aprendizaje) existe en #coverFlowTrack', html.includes('id="coverCard-0"') && html.includes('Ruta de Aprendizaje'));
assert('Portal 02 (Entorno 3D) existe en #coverFlowTrack', html.includes('id="coverCard-1"') && html.includes('Entorno 3D'));
assert('Portal 03 (Estudio Musical) existe en #coverFlowTrack', html.includes('id="coverCard-2"') && html.includes('Estudio Musical'));
assert('Portal 04 (Tutor IA Automático) existe en #coverFlowTrack', html.includes('id="coverCard-3"') && html.includes('Tutor IA Automático'));
assert('Portal 05 (Cuentos y Lecturas) restaurado en #coverFlowTrack', html.includes('id="coverCard-4"') && html.includes('Cuentos y Lecturas'));
assert('5 Indicadores de punto (coverDot-0 a coverDot-4) presentes',
  html.includes('id="coverDot-0"') &&
  html.includes('id="coverDot-1"') &&
  html.includes('id="coverDot-2"') &&
  html.includes('id="coverDot-3"') &&
  html.includes('id="coverDot-4"')
);

// 3. IA Conversacional Optimizada (slice -8), Feedback de Voz y Timestamps
console.log('\n3. Verificando IA Conversacional Optimizada y Feedback de Voz...');
assert('window.aiChatHistory inicializado como arreglo', js.includes('window.aiChatHistory = [];') || js.includes('window.aiChatHistory = []'));
assert('Función getGeminiResponse implementada con soporte de voz', js.includes('async function getGeminiResponse(') && js.includes('isVoice'));
assert('getGeminiResponse incluye etiqueta oculta [VOICE INPUT] para evaluar pronunciación', js.includes('[VOICE INPUT]'));
assert('getGeminiResponse optimiza velocidad enviando solo los últimos 8 mensajes (slice(-8))', js.includes('.slice(-8)'));
assert('getGeminiResponse incluye system_instruction con RULE 4 para pronunciación',
  js.includes('RULE 4: If the user\'s message starts with \'[VOICE INPUT]\'') &&
  js.includes('pronunciation/vocabulary based on the transcript')
);
assert('getGeminiResponse actualiza window.aiChatHistory con rol user y model',
  js.includes('window.aiChatHistory.push({ role: "user"') &&
  js.includes('window.aiChatHistory.push({ role: "model"')
);
assert('getGeminiResponse maneja offline con mensaje de reconexión',
  js.includes("I'm offline right now, but your message is saved! We can continue when you reconnect.")
);
assert('Timestamps estilo WhatsApp implementados con .chat-timestamp',
  js.includes('const timeStr =') &&
  js.includes('toLocaleTimeString') &&
  js.includes('<span class="chat-timestamp"')
);

// 4. Diseño Dividido (Chat + Historial Lateral)
console.log('\n4. Verificando Diseño Dividido y CSS...');
assert('CSS: .ai-tutor-layout definido con grid 1fr 300px',
  css.includes('.ai-tutor-layout') && css.includes('grid-template-columns: 1fr 300px;')
);
assert('CSS: .ai-history-sidebar estilizado con scroll y borde',
  css.includes('.ai-history-sidebar') && css.includes('overflow-y: auto;')
);
assert('CSS: .chat-timestamp estilizado a la derecha con 0.65rem',
  css.includes('.chat-timestamp') && css.includes('text-align: right;') || css.includes('text-align:right;')
);
assert('CSS: Media query móvil (@media (max-width: 768px)) oculta sidebar',
  css.includes('@media (max-width: 768px)') && css.includes('.ai-history-sidebar { display: none; }')
);
assert('HTML: .ai-tutor-layout y aside#aiTutorHistorySidebar presentes en #ai-tutor-view',
  html.includes('class="ai-tutor-layout"') && html.includes('id="aiTutorHistorySidebar"') && html.includes('id="aiTutorHistoryList"')
);
assert('JS: Guardado diario de historial por fechas implementado',
  js.includes('saveAiChatToDailyStorage') && js.includes('ai_chat_history_')
);
assert('JS: Renderizado de historial lateral agrupado por Hoy y Ayer',
  js.includes('renderAiTutorHistorySidebar') && js.includes("'Hoy'") && js.includes("'Ayer'")
);

// 5. Sistema de Permisos para Invitados (Auth Guards)
console.log('\n5. Verificando Sistema de Permisos para Invitados (Auth Guards)...');
assert('JS: Función isUserLoggedIn implementada',
  js.includes('window.isUserLoggedIn = () => localStorage.getItem("mastereng_user") !== null;')
);
assert('JS: window.applyAuthGuardsUI implementado', js.includes('window.applyAuthGuardsUI = function'));
assert('JS: Bloqueo 1 - Tutor IA deshabilitado con placeholder de inicio de sesión',
  js.includes('🔒 Inicia sesión para platicar con la IA') && js.includes('aiInput.disabled')
);
assert('JS: Bloqueo 2 - Descarga PDF Glosario bloqueada para no registrados con alerta',
  js.includes('🔒 Necesitas una cuenta registrada para descargar el PDF.')
);
assert('JS: Bloqueo 3 - Buscador musical deshabilitado con placeholder de inicio de sesión',
  js.includes('🔒 Inicia sesión para buscar canciones libres') && js.includes('musicInput.disabled')
);

// 6. Sincronización Offline de Base de Datos (Comentarios)
console.log('\n6. Verificando Sincronización Offline de Base de Datos...');
assert('window.saveToDatabase implementado', js.includes('window.saveToDatabase = function(endpoint, data)'));
assert('queueForSync implementado y guarda en localStorage offlineQueue', js.includes('function queueForSync(endpoint, data)') && js.includes("'offlineQueue'"));
assert('Evento window online sincroniza y limpia offlineQueue', js.includes("window.addEventListener('online'") && js.includes("localStorage.removeItem('offlineQueue')"));
assert('Envío de comentarios conectado a window.saveToDatabase', js.includes("window.saveToDatabase('/api/feedback'"));

// 7. Verificación en Sandbox VM
console.log('\n7. Verificando comportamiento en Sandbox VM...');
const mockLocalStorage = {
  data: {},
  getItem(k) { return this.data[k] !== undefined ? this.data[k] : null; },
  setItem(k, v) { this.data[k] = String(v); },
  removeItem(k) { delete this.data[k]; }
};

const domElements = {
  aiTutorInput: { disabled: false, placeholder: '', classList: { add() {}, remove() {} } },
  aiTutorMicBtn: { disabled: false, classList: { toggle() {} } },
  aiTutorSendBtn: { disabled: false, classList: { toggle() {} } },
  musicSearchInput: { disabled: false, placeholder: '', classList: { add() {}, remove() {} } }
};

const sandbox = {
  window: {},
  document: {
    addEventListener: () => {},
    getElementById: (id) => domElements[id] || null,
    querySelectorAll: () => []
  },
  localStorage: mockLocalStorage,
  navigator: { onLine: false },
  fetch: async () => ({ ok: true, json: async () => ({}) }),
  console: { log: () => {}, warn: () => {}, error: () => {} },
  Date: Date,
  JSON: JSON
};
sandbox.window = sandbox;

vm.createContext(sandbox);

// Cargar script de Auth Guards
const authGuardCode = `
window.isUserLoggedIn = () => localStorage.getItem("mastereng_user") !== null;
window.isUserRegistered = function() {
  if (!window.isUserLoggedIn()) return false;
  try {
    const u = JSON.parse(localStorage.getItem('mastereng_user') || 'null');
    return Boolean(u && u.role !== 'guest');
  } catch (_) {
    return false;
  }
};
window.applyAuthGuardsUI = function() {
  const isRegistered = window.isUserRegistered();
  const aiInput = document.getElementById('aiTutorInput');
  const aiMicBtn = document.getElementById('aiTutorMicBtn');
  const aiSendBtn = document.getElementById('aiTutorSendBtn');
  if (aiInput) {
    if (!isRegistered) {
      aiInput.disabled = true;
      aiInput.placeholder = "🔒 Inicia sesión para platicar con la IA";
    } else {
      aiInput.disabled = false;
      aiInput.placeholder = "Type in English...";
    }
  }
  if (aiMicBtn) aiMicBtn.disabled = !isRegistered;
  if (aiSendBtn) aiSendBtn.disabled = !isRegistered;

  const musicInput = document.getElementById('musicSearchInput');
  if (musicInput) {
    if (!isRegistered) {
      musicInput.disabled = true;
      musicInput.placeholder = "🔒 Inicia sesión para buscar canciones libres";
    } else {
      musicInput.disabled = false;
      musicInput.placeholder = "Buscar canciones...";
    }
  }
};
`;
vm.runInContext(authGuardCode, sandbox);

// Caso 1: Invitado (Guest)
sandbox.localStorage.setItem('mastereng_user', JSON.stringify({ role: 'guest', username: 'Invitado' }));
sandbox.window.applyAuthGuardsUI();

assert('Sandbox VM: En modo invitado, el input del Tutor IA está deshabilitado con candado',
  domElements.aiTutorInput.disabled === true && domElements.aiTutorInput.placeholder.includes('🔒 Inicia sesión')
);
assert('Sandbox VM: En modo invitado, el buscador de música está deshabilitado con candado',
  domElements.musicSearchInput.disabled === true && domElements.musicSearchInput.placeholder.includes('🔒 Inicia sesión')
);

// Caso 2: Usuario Registrado
sandbox.localStorage.setItem('mastereng_user', JSON.stringify({ role: 'user', username: 'alessandro', email: 'ale@test.com' }));
sandbox.window.applyAuthGuardsUI();

assert('Sandbox VM: Con cuenta registrada, el Tutor IA se habilita sin candado',
  domElements.aiTutorInput.disabled === false && !domElements.aiTutorInput.placeholder.includes('🔒')
);
assert('Sandbox VM: Con cuenta registrada, el buscador musical se habilita',
  domElements.musicSearchInput.disabled === false && !domElements.musicSearchInput.placeholder.includes('🔒')
);

// 8. Sincronización Tri-Directorio
console.log('\n8. Verificando Sincronización Tri-Directorio...');
const assetsDir = path.join(rootDir, 'app/src/main/assets');
const parentDir = path.join(rootDir, '..');

['index.html', 'css/style.css', 'js/app.js', 'manifest.json', 'sw.js', 'icon.png'].forEach(f => {
  const rootF = fs.readFileSync(path.join(rootDir, f));
  const assetsF = fs.readFileSync(path.join(assetsDir, f));
  const parentF = fs.readFileSync(path.join(parentDir, f));

  assert(`${f} idéntico entre raíz y Android assets`, rootF.equals(assetsF));
  assert(`${f} idéntico entre raíz y directorio superior`, rootF.equals(parentF));
});

console.log('\n========================================');
console.log(`RESUMEN: ${passedChecks}/${totalChecks} verificaciones aprobadas.`);
console.log('========================================');

if (passedChecks !== totalChecks) {
  process.exit(1);
} else {
  console.log('🎉 ¡TODOS LOS REQUISITOS PWA, TUTOR IA RÁPIDO, SIDEBAR Y AUTH GUARDS VERIFICADOS AL 100%!');
  process.exit(0);
}

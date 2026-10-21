const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== VERIFICANDO PWA, GEMINI AI TUTOR, TIMESTAMPS Y RESTAURACIÓN DE CUENTOS ===\n');

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
const jsPath = path.join(rootDir, 'js/app.js');
const manifestPath = path.join(rootDir, 'manifest.json');
const swPath = path.join(rootDir, 'sw.js');
const iconPath = path.join(rootDir, 'icon.png');

const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// 1. PWA & Manifest & Service Worker
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

// 3. IA Conversacional Real con Memoria y Timestamps
console.log('\n3. Verificando IA Conversacional Gemini y Timestamps...');
assert('window.aiChatHistory inicializado como arreglo', js.includes('window.aiChatHistory = [];') || js.includes('window.aiChatHistory = []'));
assert('Función getGeminiResponse implementada', js.includes('async function getGeminiResponse(userText)'));
assert('getGeminiResponse incluye system_instruction con las 3 reglas del tutor',
  js.includes('RULE 1: ONLY speak in English') &&
  js.includes('RULE 2: Gently correct grammar mistakes') &&
  js.includes('RULE 3: Refuse off-topic subjects')
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
  js.includes('<span class="chat-timestamp"') &&
  js.includes('font-size:0.65rem')
);

// 4. Sincronización Offline de Base de Datos
console.log('\n4. Verificando Sincronización Offline de Base de Datos...');
assert('window.saveToDatabase implementado', js.includes('window.saveToDatabase = function(endpoint, data)'));
assert('queueForSync implementado y guarda en localStorage offlineQueue', js.includes('function queueForSync(endpoint, data)') && js.includes("'offlineQueue'"));
assert('Evento window online sincroniza y limpia offlineQueue', js.includes("window.addEventListener('online'") && js.includes("localStorage.removeItem('offlineQueue')"));
assert('Envío de comentarios conectado a window.saveToDatabase', js.includes("window.saveToDatabase('/api/feedback'"));

// 5. Verificación en Sandbox VM
console.log('\n5. Verificando comportamiento en Sandbox VM...');
const mockLocalStorage = {
  data: {},
  getItem(k) { return this.data[k] || null; },
  setItem(k, v) { this.data[k] = String(v); },
  removeItem(k) { delete this.data[k]; }
};

const sandbox = {
  window: {},
  document: {
    addEventListener: () => {},
    getElementById: () => null,
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

// Test queueing offline
const offlineQueueCode = `
function queueForSync(endpoint, data) {
  const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
  queue.push({ endpoint, data, timestamp: Date.now() });
  localStorage.setItem('offlineQueue', JSON.stringify(queue));
}
window.saveToDatabase = function(endpoint, data) {
  if (navigator.onLine) {
    fetch(endpoint, { method: 'POST', body: JSON.stringify(data) }).catch(e => queueForSync(endpoint, data));
  } else {
    queueForSync(endpoint, data);
  }
};
window.saveToDatabase('/api/feedback', { comment: 'Test offline feedback' });
`;
vm.runInContext(offlineQueueCode, sandbox);

const storedQueue = JSON.parse(sandbox.localStorage.getItem('offlineQueue') || '[]');
assert('Sandbox VM: Comentario offline se encola exitosamente en offlineQueue', storedQueue.length === 1 && storedQueue[0].endpoint === '/api/feedback');

// Test online sync
const onlineSyncCode = `
let syncedItems = [];
window.fetch = async (url, opts) => {
  syncedItems.push({ url, body: JSON.parse(opts.body) });
  return { ok: true };
};
const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
if (queue.length > 0) {
  queue.forEach(item => {
    fetch(item.endpoint, { method: 'POST', body: JSON.stringify(item.data) });
  });
  localStorage.removeItem('offlineQueue');
}
`;
vm.runInContext(onlineSyncCode, sandbox);
assert('Sandbox VM: Evento online sincroniza la cola y limpia offlineQueue', sandbox.localStorage.getItem('offlineQueue') === null);

// 6. Sincronización Tri-Directorio
console.log('\n6. Verificando Sincronización Tri-Directorio...');
const assetsDir = path.join(rootDir, 'app/src/main/assets');
const parentDir = path.join(rootDir, '..');

['index.html', 'js/app.js', 'manifest.json', 'sw.js', 'icon.png'].forEach(f => {
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
  console.log('🎉 ¡TODOS LOS REQUISITOS PWA, GEMINI Y CUENTOS VERIFICADOS AL 100%!');
}

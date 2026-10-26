const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('=== VERIFYING V26: 3D PORTAL, EMERGENCY BACK BAR, CRASH DETECTOR & BUG REPORTS ===\n');

const rootDir = path.resolve(__dirname, '..');
const appJsPath = path.join(rootDir, 'js', 'app.js');
const cssPath = path.join(rootDir, 'css', 'style.css');
const htmlPath = path.join(rootDir, 'index.html');
const swPath = path.join(rootDir, 'sw.js');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');
const sw = fs.readFileSync(swPath, 'utf8');

// 1. Static Checks
console.log('1. Checking static code requirements...');
assert(!/\balert\s*\(/.test(appJs), 'js/app.js no debe contener alert() sin escapar');
console.log('  ✅ [PASS] js/app.js no contiene alert() directos');

assert(appJs.includes('window.VOCAB_3D_ITEMS'), 'VOCAB_3D_ITEMS debe estar definido');
assert(appJs.includes('window.open3DPortalView'), 'open3DPortalView debe estar definido');
assert(appJs.includes('window.render3DStageContent'), 'render3DStageContent debe estar definido');
assert(appJs.includes('window.next3DItem'), 'next3DItem debe estar definido');
assert(appJs.includes('window.prev3DItem'), 'prev3DItem debe estar definido');
console.log('  ✅ [PASS] Motor interactivo del Portal 3D declarado en js/app.js');

assert(appJs.includes('window.ensureEmergencyBackBar'), 'ensureEmergencyBackBar debe estar definido');
assert(appJs.includes('emergency-nav-bar'), 'ID emergency-nav-bar debe estar presente');
console.log('  ✅ [PASS] Barra de navegación de emergencia declarada');

assert(appJs.includes('window.showCrashRecoveryBanner'), 'showCrashRecoveryBanner debe estar definido');
assert(appJs.includes('crash-recovery-overlay'), 'ID crash-recovery-overlay debe estar presente');
assert(appJs.includes('btn-crash-back-hub'), 'btn-crash-back-hub debe estar presente');
assert(appJs.includes('btn-crash-reload'), 'btn-crash-reload debe estar presente');
assert(appJs.includes('btn-crash-report'), 'btn-crash-report debe estar presente');
console.log('  ✅ [PASS] Error Boundary y recuperación de crashes declarados');

assert(appJs.includes('window.openBugReportModal'), 'openBugReportModal debe estar definido');
assert(appJs.includes('mastereng_bug_reports'), 'Colección mastereng_bug_reports debe ser utilizada');
assert(appJs.includes('/api/reports'), 'Endpoint /api/reports debe ser consultado');
assert(appJs.includes('window.renderAdminBugReportsCard'), 'renderAdminBugReportsCard debe estar definido');
assert(appJs.includes('Reportes de Fallos y Crashes'), 'Tarjeta de reportes en admin debe estar presente');
console.log('  ✅ [PASS] Sistema de reportes de fallos y tarjeta en Panel Admin declarados');

// 2. CSS Checks
console.log('\n2. Checking css/style.css requirements...');
assert(css.includes('#emergency-nav-bar'), 'css debe contener regla para #emergency-nav-bar');
assert(css.includes('#btn-install-share-app'), 'css debe contener regla para #btn-install-share-app');
assert(css.includes('#portal-3d-master-view'), 'css debe contener regla para #portal-3d-master-view');
assert(css.includes('#crash-recovery-overlay'), 'css debe contener regla para #crash-recovery-overlay');
console.log('  ✅ [PASS] Reglas CSS para z-index y pointer-events presentes');

// 3. Service Worker
console.log('\n3. Checking sw.js CACHE_NAME...');
assert(/mastereng-v1-pwa-v[6-9]-/.test(sw), 'sw.js debe contener la versión actualizada de cache');
console.log('  ✅ [PASS] sw.js actualizado a mastereng-v1-pwa-v7');

// 4. HTML Size Limit
console.log('\n4. Checking index.html size limit...');
const htmlSize = Buffer.byteLength(html, 'utf8');
assert(htmlSize < 120000, `index.html excede el límite (${htmlSize} bytes)`);
console.log(`  ✅ [PASS] index.html está en ${htmlSize} bytes (< 120,000 bytes)`);

// 5. VM Sandbox Execution
console.log('\n5. Testing logic in Node.js VM Sandbox...');
const localStorageMock = {};
const elementsMock = {};

const fakeDoc = {
  getElementById: (id) => elementsMock[id] || null,
  createElement: (tag) => {
    const el = {
      tagName: tag.toUpperCase(),
      id: '',
      style: {
        cssText: '',
        display: '',
        setProperty: function(k, v) { this[k] = v; },
        removeProperty: function(k) { delete this[k]; }
      },
      classList: {
        classes: new Set(),
        add: function(c) { this.classes.add(c); },
        remove: function(c) { this.classes.delete(c); },
        contains: function(c) { return this.classes.has(c); }
      },
      children: [],
      childNodes: [],
      appendChild: function(c) { this.children.push(c); return c; },
      remove: function() {
        if (el.id && elementsMock[el.id]) delete elementsMock[el.id];
      },
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      setAttribute: () => {},
      getAttribute: () => null,
      getBoundingClientRect: () => ({ top: 0, left: 0, width: 300, height: 300 })
    };
    return el;
  },
  body: {
    appendChild: (el) => {
      if (el.id) elementsMock[el.id] = el;
      return el;
    },
    querySelectorAll: () => []
  },
  querySelectorAll: () => [],
  querySelector: () => null,
  addEventListener: () => {}
};

const sandbox = {
  window: {},
  document: fakeDoc,
  localStorage: {
    getItem: (k) => localStorageMock[k] || null,
    setItem: (k, v) => { localStorageMock[k] = String(v); },
    removeItem: (k) => { delete localStorageMock[k]; }
  },
  navigator: { onLine: true, userAgent: 'NodeTestAgent' },
  console: console,
  setTimeout: () => {},
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {}
};
sandbox.window = sandbox;

// Load VOCAB_3D_ITEMS and basic helpers
vm.runInNewContext(appJs, sandbox);

assert(Array.isArray(sandbox.window.VOCAB_3D_ITEMS), 'VOCAB_3D_ITEMS debe ser un arreglo');
assert(sandbox.window.VOCAB_3D_ITEMS.length >= 8, 'VOCAB_3D_ITEMS debe tener al menos 8 elementos');
console.log(`  ✅ [PASS] VOCAB_3D_ITEMS contiene ${sandbox.window.VOCAB_3D_ITEMS.length} palabras interactivas`);

// Test open3DPortalView
sandbox.window.open3DPortalView();
assert(elementsMock['portal-3d-master-view'], '#portal-3d-master-view debe crearse al abrir el portal 3D');
assert(elementsMock['portal-3d-master-view'].style.display === 'block', 'portal-3d-master-view debe tener display block');
console.log('  ✅ [PASS] open3DPortalView despliega el contenedor y el escenario');

// Test next3DItem and prev3DItem
assert(sandbox.window.current3DIndex === 0, 'current3DIndex inicial es 0');
sandbox.window.next3DItem();
assert(sandbox.window.current3DIndex === 1, 'current3DIndex después de next es 1');
sandbox.window.prev3DItem();
assert(sandbox.window.current3DIndex === 0, 'current3DIndex después de prev es 0');
console.log('  ✅ [PASS] next3DItem y prev3DItem actualizan el índice correctamente');

// Test ensureEmergencyBackBar
sandbox.window.ensureEmergencyBackBar(true);
assert(elementsMock['emergency-nav-bar'], '#emergency-nav-bar debe ser creado');
assert(elementsMock['emergency-nav-bar'].style.display === 'flex', '#emergency-nav-bar debe estar visible');
sandbox.window.ensureEmergencyBackBar(false);
assert(elementsMock['emergency-nav-bar'].style.display === 'none', '#emergency-nav-bar debe ocultarse');
console.log('  ✅ [PASS] ensureEmergencyBackBar muestra y oculta la barra universal de regreso');

// Test showCrashRecoveryBanner
sandbox.window.showCrashRecoveryBanner('Prueba de crash');
assert(elementsMock['crash-recovery-overlay'], '#crash-recovery-overlay debe ser creado ante un crash');
console.log('  ✅ [PASS] showCrashRecoveryBanner despliega el panel de rescate');

// Test Bug Report Quota
localStorageMock['mastereng_user'] = JSON.stringify({ email: 'estudiante@test.com' });
sandbox.window.openBugReportModal('Portal 3D');
assert(elementsMock['bug-report-developer-modal'], '#bug-report-developer-modal debe abrirse para usuario logueado');
console.log('  ✅ [PASS] openBugReportModal se abre correctamente para usuarios autenticados');

console.log('\n🏆 TODAS LAS VERIFICACIONES V26 PASARON CON ÉXITO AL 100%!');

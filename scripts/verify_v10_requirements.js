const fs = require('fs');
const vm = require('vm');

console.log('=== VERIFICANDO REQUISITOS V10: PANTALLA DEDICADA DE MÚSICA, CANCIÓN COMPLETA Y LIMPIEZA TOTAL ADMIN ===\n');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('css/style.css', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');

let passed = 0;
let failed = 0;

function check(label, condition) {
  if (condition) {
    console.log('✅ ' + label);
    passed++;
  } else {
    console.error('❌ FALLÓ: ' + label);
    failed++;
  }
}

// -------------------------------------------------------------
// 1. PANTALLA DEDICADA Y SUB-VISTAS DE MÚSICA
// -------------------------------------------------------------
console.log('1. SUB-VISTAS DEDICADAS DE MÚSICA EN HTML Y CSS:');

check('HTML: #music-search-subview y #music-player-subview existen dentro de #view-music',
  html.includes('id="music-search-subview"') &&
  html.includes('id="music-player-subview"'));

check('HTML: Botón "← Volver al Buscador de Música" con onclick="window.returnToMusicSearch()" presente en #music-player-subview',
  html.includes('onclick="window.returnToMusicSearch()"') &&
  html.includes('Volver al Buscador de Música'));

check('HTML: Tamaño de index.html inferior a 120,000 bytes',
  Buffer.byteLength(html, 'utf8') <= 120000);

check('CSS: Reglas de visualización y animación para #music-search-subview y #music-player-subview',
  css.includes('#music-search-subview') &&
  css.includes('#music-player-subview'));

// -------------------------------------------------------------
// 2. REPRODUCCIÓN COMPLETA Y ELIMINACIÓN DE MINI-PLAYER DE 30s
// -------------------------------------------------------------
console.log('\n2. CANCIÓN COMPLETA Y TARJETAS DE BÚSQUEDA LIMPIAS:');

check('JS: Las tarjetas de búsqueda eliminaron el mini-reproductor de audio de 30s',
  !appJs.includes('<audio controls src="${previewUrl}" class="w-full h-8 rounded-lg"'));

check('JS: Las tarjetas de búsqueda muestran el botón "Abrir Estudio Musical (Canción Completa)"',
  appJs.includes('Abrir Estudio Musical (Canción Completa)'));

check('JS: Búsqueda dinámica con "official audio" conectada para la canción completa',
  appJs.includes('official audio'));

check('JS: window.returnToMusicSearch implementada y expuesta en window',
  appJs.includes('window.returnToMusicSearch = function'));

// -------------------------------------------------------------
// 3. LIMPIEZA DEFINITIVA DE USUARIOS FALSOS Y 1250 EXP EN ADMIN
// -------------------------------------------------------------
console.log('\n3. LIMPIEZA DE USUARIOS FALSOS EN PANEL ADMIN:');

check('Código: CERO apariciones de "maria_gonzalez" en js/app.js e index.html',
  !appJs.includes('maria_gonzalez') && !html.includes('maria_gonzalez'));

check('Código: CERO apariciones de "carlos_estudiante" en js/app.js e index.html',
  !appJs.includes('carlos_estudiante') && !html.includes('carlos_estudiante'));

check('Código: CERO apariciones de "sofia_learning" en js/app.js e index.html',
  !appJs.includes('sofia_learning') && !html.includes('sofia_learning'));

check('JS: executeAdminDeleteUser elimina permanentemente de mastereng_registered_users en localStorage',
  appJs.includes("localStorage.setItem('mastereng_registered_users'") ||
  appJs.includes('localStorage.setItem(storeKey'));

// -------------------------------------------------------------
// 4. VERIFICACIÓN DE RUNTIME EN VM
// -------------------------------------------------------------
console.log('\n4. VERIFICACIÓN DE LÓGICA Y COMPORTAMIENTO EN JS (VM):');

const elements = {};
function makeEl(id, tag = 'DIV') {
  return {
    id,
    tagName: tag,
    className: '',
    innerHTML: '',
    textContent: '',
    value: '',
    style: { setProperty: function(k, v) { this[k] = v; } },
    classList: {
      _set: new Set(),
      add(...cls) { cls.forEach(c => this._set.add(c)); },
      remove(...cls) { cls.forEach(c => this._set.delete(c)); },
      contains(c) { return this._set.has(c); },
      toggle(c, force) {
        if (force === true) this._set.add(c);
        else if (force === false) this._set.delete(c);
        else if (this._set.has(c)) this._set.delete(c);
        else this._set.add(c);
      }
    },
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k] || null; },
    removeAttribute(k) { delete this[k]; },
    appendChild(child) {
      if (child && child.id) elements[child.id] = child;
      return child;
    },
    click() { this._clicked = true; },
    focus() {},
    pause() {},
    play() { return Promise.resolve(); },
    scrollIntoView() {},
    querySelector() { return makeEl('sub'); },
    querySelectorAll() { return []; },
    parentElement: null
  };
}

const mockIframe = makeEl('musicYouTubeIframe', 'IFRAME');
const mockStageWrapper = makeEl('stageWrapper');
mockIframe.parentElement = mockStageWrapper;

[
  'view-auth', 'view-home', 'view-path', 'view-stories', 'view-music', 'view-worldtour',
  'music-search-subview', 'music-player-subview', 'backToMusicSearchBtn',
  'musicSearchInput', 'musicResultsGrid', 'musicSearchSuggestions', 'musicTrackButtonsContainer',
  'activeMusicTitle', 'activeMusicArtist', 'karaokeSyncToggleBtn', 'karaokeTimeBadge',
  'musicLyricsContainer', 'mainHeader', 'headerUserRank', 'headerUserExp', 'headerAdminBtn',
  'adminDashboardModal', 'adminUsersTableBody', 'adminMetricTotalUsers', 'adminMetricActiveUsers',
  'adminMetricGlobalExp', 'adminConfirmDeleteModal', 'adminDeleteUserName', 'adminDeleteUserId'
].forEach(id => { elements[id] = makeEl(id); });
elements['musicYouTubeIframe'] = mockIframe;

let scrolledToTop = false;
const storage = {};
const runtimeSandbox = {
  window: null,
  AbortController: globalThis.AbortController,
  fetch: globalThis.fetch,
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
  scrollTo(opts) { if (opts && opts.top === 0) scrolledToTop = true; },
  document: {
    body: makeEl('body', 'BODY'),
    documentElement: makeEl('html', 'HTML'),
    getElementById(id) {
      if (!elements[id]) elements[id] = makeEl(id);
      return elements[id];
    },
    createElement(tag) {
      const el = makeEl('el_' + Math.random().toString(36).slice(2, 6), tag.toUpperCase());
      el.parentElement = mockStageWrapper;
      return el;
    },
    querySelector(sel) {
      if (sel.startsWith('#')) return this.getElementById(sel.slice(1));
      return makeEl(sel);
    },
    querySelectorAll() { return []; },
    addEventListener() {},
    removeEventListener() {}
  },
  localStorage: {
    getItem(k) { return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null; },
    setItem(k, v) { storage[k] = String(v); },
    removeItem(k) { delete storage[k]; }
  },
  navigator: { userAgent: 'NodeTest', clipboard: { writeText: async () => {} } },
  location: { href: 'http://localhost/', reload() {} },
  history: { pushState() {}, replaceState() {} },
  performance: { now: () => Date.now() },
  requestAnimationFrame: () => 1,
  cancelAnimationFrame: () => {},
  setTimeout: () => 1,
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
  speechSynthesis: { cancel() {}, speak() {}, getVoices: () => [] },
  SpeechSynthesisUtterance: function(t) { this.text = t; },
  console
};
runtimeSandbox.window = runtimeSandbox;
runtimeSandbox.globalThis = runtimeSandbox;

const masterDataJs = fs.readFileSync('master_data.js', 'utf8');
vm.createContext(runtimeSandbox);
vm.runInContext(masterDataJs, runtimeSandbox);
vm.runInContext(appJs, runtimeSandbox);

// A. Prueba de navegación a la canción y sub-vistas
elements['music-search-subview'].style.display = 'block';
elements['music-player-subview'].style.display = 'none';
scrolledToTop = false;

(async () => {
  await runtimeSandbox.window.loadSongToKaraoke('Bohemian Rhapsody', 'Queen', '', 'https://example.com/cover.jpg');

  check('Sub-vistas: loadSongToKaraoke oculta #music-search-subview',
    elements['music-search-subview'].style.display === 'none');

  check('Sub-vistas: loadSongToKaraoke muestra exclusivamente #music-player-subview',
    elements['music-player-subview'].style.display === 'block');

  check('Sub-vistas: loadSongToKaraoke ejecuta scrollTo top: 0 para evitar scroll al usuario',
    scrolledToTop === true);

  // B. Prueba de retorno al buscador
  scrolledToTop = false;
  runtimeSandbox.window.returnToMusicSearch();

  check('Sub-vistas: returnToMusicSearch restaura #music-search-subview visible',
    elements['music-search-subview'].style.display === 'block');

  check('Sub-vistas: returnToMusicSearch oculta #music-player-subview',
    elements['music-player-subview'].style.display === 'none');

  // C. Prueba de usuarios reales en Admin sin relleno
  storage['mastereng_registered_users'] = JSON.stringify([
    { id: 101, username: 'juan_estudiante', email: 'juan@gmail.com', exp: 0, rank: 'Bronce' }
  ]);
  storage['mastereng_user'] = JSON.stringify({ username: 'admin', role: 'admin', exp: 0, rank: 'Bronce' });

  runtimeSandbox.window.refreshAdminUsersData();
  const adminUsers = runtimeSandbox.window.allAdminUsersList || [];

  check('Admin: La lista contiene exclusivamente usuarios reales y NO usuarios de prueba',
    adminUsers.length > 0 &&
    !adminUsers.some(u => u.username === 'maria_gonzalez') &&
    !adminUsers.some(u => u.username === 'carlos_estudiante') &&
    !adminUsers.some(u => u.username === 'sofia_learning') &&
    adminUsers.some(u => u.username === 'juan_estudiante'));

  // D. Prueba de eliminación permanente en Admin
  runtimeSandbox.window.adminPendingDeleteUserId = 101;
  await runtimeSandbox.window.executeAdminDeleteUser();

  const storedAfterDelete = JSON.parse(storage['mastereng_registered_users'] || '[]');
  const adminUsersAfterDelete = runtimeSandbox.window.allAdminUsersList || [];

  check('Admin: executeAdminDeleteUser elimina permanentemente al usuario de localStorage y del estado',
    !storedAfterDelete.some(u => u.id === 101) &&
    !adminUsersAfterDelete.some(u => u.id === 101));

  // -------------------------------------------------------------
  // RESUMEN FINAL
  // -------------------------------------------------------------
  console.log('\n--- RESUMEN FINAL V10 ---');
  console.log(`Total de pruebas: ${passed + failed} | Aprobadas: ${passed} | Fallidas: ${failed}`);

  if (failed === 0) {
    console.log('\n🎉 ¡TODOS LOS REQUISITOS V10 VERIFICADOS AL 100%!');
    process.exit(0);
  } else {
    console.error('\n❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN V10');
    process.exit(1);
  }
})();

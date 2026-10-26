const fs = require('fs');
const vm = require('vm');

console.log('=== VERIFICANDO REQUISITOS V9: PROGRESO Y EXP REALES, 10 MÓDULOS PUROS DE 100 TÉRMINOS, GOOGLE PRIVADO, LOGIN CENTRADO Y PERSISTENCIA ===\n');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('css/style.css', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const masterDataJs = fs.readFileSync('master_data.js', 'utf8');

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
// 1. VERIFICACIÓN ESTÁTICA: CSS Y HTML
// -------------------------------------------------------------
console.log('1. VERIFICACIÓN DE ESTILOS Y ESTRUCTURA DOM:');

check('CSS: #login-view, #view-auth, .login-container centrados con min-height: 100vh, width: 100vw y flex centrado',
  css.includes('#login-view,') &&
  css.includes('#view-auth,') &&
  css.includes('.login-container') &&
  css.includes('justify-content: center !important;') &&
  css.includes('align-items: center !important;') &&
  css.includes('min-height: 100vh !important;') &&
  css.includes('width: 100vw !important;'));

check('CSS: .login-card con margin: 0 auto, max-width: 420px y width: 100%',
  css.includes('.login-card') &&
  css.includes('margin: 0 auto !important;') &&
  css.includes('max-width: 420px !important;') &&
  css.includes('width: 100% !important;'));

check('CSS: Encabezado (header, #mainHeader) se oculta completamente en pantalla de login',
  css.includes('body:has(#view-auth:not(.hidden):not([style*="display: none"])) header') &&
  css.includes('header.auth-hidden') &&
  css.includes('display: none !important;'));

check('HTML: Elemento <header> incluye id="mainHeader" para control reactivo',
  html.includes('id="mainHeader"'));

check('HTML: Tamaño total de index.html inferior a 120,000 bytes',
  Buffer.byteLength(html, 'utf8') <= 120000);

check('HTML: Tarjetas estáticas de los 10 módulos puros presentes en #learning-modules-grid',
  html.includes('100 Essential Phrasal Verbs') &&
  html.includes('100 Difficult & Common Verbs') &&
  html.includes('100 Power Adjectives & Descriptions') &&
  html.includes('100 Native Idioms & Slang Expressions') &&
  html.includes('100 Connectors & Linking Words') &&
  html.includes('100 False Friends & Confusing Words') &&
  html.includes('100 Prepositional Phrases & Collocations') &&
  html.includes('100 Business, Tech & Engineering Terms') &&
  html.includes('100 Travel, Airport & Daily Survival') &&
  html.includes('100 Academic & High-Score TOEFL Words'));

// -------------------------------------------------------------
// 2. VERIFICACIÓN DE LA BASE DE DATOS PURA (1,000 TÉRMINOS)
// -------------------------------------------------------------
console.log('\n2. VERIFICACIÓN DEL DICCIONARIO MAESTRO (1,000 TÉRMINOS PUROS):');

const sandbox = {
  window: null,
  addEventListener() {},
  removeEventListener() {},
  document: { readyState: 'complete', addEventListener: () => {}, querySelectorAll: () => [] }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(masterDataJs, sandbox);

const db = sandbox.window.MASTER_MODULES_DATA;
const expectedModules = [
  { key: 'phrasal_verbs', cat: 'Phrasal Verb' },
  { key: 'difficult_verbs', cat: 'Verbo' },
  { key: 'power_adjectives', cat: 'Adjetivo' },
  { key: 'native_idioms', cat: 'Idiom' },
  { key: 'connectors_linking', cat: 'Conector' },
  { key: 'false_friends', cat: 'Falso Amigo' },
  { key: 'collocations', cat: 'Collocation' },
  { key: 'business_tech', cat: 'Negocios & Tech' },
  { key: 'travel_survival', cat: 'Viajes & Supervivencia' },
  { key: 'toefl_academic', cat: 'Académico TOEFL' }
];

let allModulesHave100 = true;
let allItemsPure = true;
let totalWordCount = 0;

expectedModules.forEach(mod => {
  const data = db[mod.key];
  if (!data || !Array.isArray(data.items) || data.items.length !== 100) {
    allModulesHave100 = false;
  } else {
    totalWordCount += data.items.length;
    data.items.forEach(item => {
      if (item.category !== mod.cat) allItemsPure = false;
      if (!item.term || !item.pron || !item.meaning || !item.example) allItemsPure = false;
    });
  }
});

check(`Diccionario: Los 10 módulos tienen exactamente 100 términos cada uno (Total: ${totalWordCount} = 1,000)`,
  allModulesHave100 && totalWordCount === 1000);

check('Diccionario: Cada módulo contiene ÚNICAMENTE términos de su categoría pura con IPA, significado y ejemplo',
  allItemsPure);

check('Diccionario: Alias heredados configurados y apuntan a los módulos temáticos correspondientes',
  db['everyday_actions'] === db['phrasal_verbs'] &&
  db['connectors'] === db['connectors_linking'] &&
  db['social_dating'] === db['power_adjectives'] &&
  db['professional_english'] === db['business_tech'] &&
  db['toefl_simulator'] === db['toefl_academic']);

// -------------------------------------------------------------
// 3. VERIFICACIÓN DE RUNTIME EN JS (NODE VM)
// -------------------------------------------------------------
console.log('\n3. VERIFICACIÓN DE LÓGICA Y ESTADO EN JS:');

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
    querySelector() { return makeEl('sub'); },
    querySelectorAll() { return []; }
  };
}

[
  'view-auth', 'view-home', 'view-path', 'view-stories', 'view-music', 'view-worldtour',
  'mainHeader', 'headerUserRank', 'headerUserExp', 'userRankMedal', 'headerAdminBtn',
  'learning-modules-grid', 'learningModulesContainer', 'glossaryModal', 'glossaryModalTitle',
  'glossaryModalSubtitle', 'glossaryTermsContainer', 'glossaryCategoryFilters', 'glossarySearchInput',
  'googleAccountPickerModal', 'googleCustomNameInput', 'googleCustomEmailInput', 'googlePickerErrorMsg',
  'authLoginIdentifier', 'authLoginPassword', 'authLoginForm', 'authRegisterForm', 'authAlertBanner'
].forEach(id => { elements[id] = makeEl(id); });

const storage = {};
const runtimeSandbox = {
  window: null,
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
  document: {
    body: makeEl('body', 'BODY'),
    documentElement: makeEl('html', 'HTML'),
    getElementById(id) {
      if (!elements[id]) elements[id] = makeEl(id);
      return elements[id];
    },
    createElement(tag) {
      return makeEl('el_' + Math.random().toString(36).slice(2, 6), tag.toUpperCase());
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

vm.createContext(runtimeSandbox);
vm.runInContext(masterDataJs, runtimeSandbox);
vm.runInContext(appJs, runtimeSandbox);

// A. Cero EXP y Cero Progreso inicial en OFFICIAL_LEARNING_MODULES
const offMods = runtimeSandbox.window.OFFICIAL_LEARNING_MODULES || [];
const allInitialZeroProgress = offMods.every(m => m.progress === 0);
check('Lógica: Todos los 10 módulos en window.OFFICIAL_LEARNING_MODULES inician estrictamente con progress = 0',
  offMods.length === 10 && allInitialZeroProgress);

// B. renderOfficialLearningModules muestra 0% y '0/100 palabras dominadas' sin misiones completadas
runtimeSandbox.window.renderOfficialLearningModules();
const gridHtmlInitial = elements['learning-modules-grid'].innerHTML;
check('UI: renderOfficialLearningModules muestra 0% y "0/100 palabras dominadas" cuando no hay progreso previo',
  gridHtmlInitial.includes('0%') &&
  gridHtmlInitial.includes('0/100 palabras dominadas') &&
  !gridHtmlInitial.includes('65%'));

// C. Al completar misión en localStorage, el módulo muestra 100% y '100/100 palabras dominadas'
storage['user_completed_modules'] = JSON.stringify({ phrasal_verbs_lvl1: true });
runtimeSandbox.window.renderOfficialLearningModules();
const gridHtmlAfter = elements['learning-modules-grid'].innerHTML;
check('UI: renderOfficialLearningModules calcula progreso real dinámico (100% y 100/100 palabras al completar misión)',
  gridHtmlAfter.includes('100%') &&
  gridHtmlAfter.includes('100/100 palabras dominadas'));

// D. Privacidad en Google Auth: Cero tarjetas precargadas de Admin o Wilberth
runtimeSandbox.window.openGoogleAccountSelector();
const googleModalHtml = elements['googleAccountPickerModal'].innerHTML;
check('Privacidad Google Auth: Cero exposición de perfiles o correos de administrador en modal de Google',
  !googleModalHtml.includes('Wilberth Alessandro') &&
  !googleModalHtml.includes('wilberth.molina@gmail.com') &&
  !googleModalHtml.includes('estudiante.mastereng@gmail.com'));

check('Privacidad Google Auth: Input limpio para que el usuario ingrese su propio @gmail.com',
  googleModalHtml.includes('id="googleCustomEmailInput"') &&
  googleModalHtml.includes('id="googleCustomNameInput"'));

// E. Inicio de sesión con Google crea usuario strictly con role 'user', 0 EXP y rango 'Bronce'
runtimeSandbox.window.completeGoogleAccountSignIn('Juan Pérez', 'juan.perez@gmail.com');
const savedGoogleUser = JSON.parse(storage['mastereng_user'] || '{}');
check('Google Auth: Usuario nuevo inicia estrictamente con role: "user", exp: 0 y rank: "Bronce"',
  savedGoogleUser.username === 'Juan Pérez' &&
  savedGoogleUser.role === 'user' &&
  savedGoogleUser.exp === 0 &&
  savedGoogleUser.rank === 'Bronce' &&
  storage['user_role'] === 'user');

// F. Admin login tradicional desbloquea role 'admin' e inicia con 0 EXP (salvo EXP real ganada)
delete storage['mastereng_user'];
elements['authLoginIdentifier'].value = 'admin';
elements['authLoginPassword'].value = 'Admin2026!Master';
runtimeSandbox.window.handleAdminLogin();
const savedAdminUser = JSON.parse(storage['mastereng_user'] || '{}');
check('Admin Auth: Credenciales manuales desbloquean role: "admin" con exp: 0 (progreso real desde cero)',
  savedAdminUser.role === 'admin' &&
  savedAdminUser.exp === 0 &&
  savedAdminUser.rank === 'Bronce' &&
  storage['user_role'] === 'admin');

// G. Control reactivo de Header en navigateTo
runtimeSandbox.window.navigateTo('login');
const isHeaderHiddenInLogin = elements['mainHeader'].classList.contains('auth-hidden');
runtimeSandbox.window.navigateTo('hub');
const isHeaderVisibleInHub = !elements['mainHeader'].classList.contains('auth-hidden');
check('Navegación: Header se oculta automáticamente en vista Login y se restaura visible en el Hub',
  isHeaderHiddenInLogin && isHeaderVisibleInHub);

// H. Logout limpia sesión y redirige a login
runtimeSandbox.window.logout();
check('Sesión: window.logout() elimina credenciales de localStorage y regresa a vista login',
  !storage['mastereng_user'] &&
  !storage['user_role'] &&
  elements['mainHeader'].classList.contains('auth-hidden'));

// -------------------------------------------------------------
// RESUMEN FINAL
// -------------------------------------------------------------
console.log('\n--- RESUMEN FINAL V9 ---');
console.log(`Total de pruebas: ${passed + failed} | Aprobadas: ${passed} | Fallidas: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 ¡TODOS LOS REQUISITOS V9 VERIFICADOS AL 100%!');
  process.exit(0);
} else {
  console.error('\n❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN V9');
  process.exit(1);
}

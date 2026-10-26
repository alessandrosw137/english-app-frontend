const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..', 'ENGLISH-');
const assetsDir = path.join(repoRoot, 'app', 'src', 'main', 'assets');
const parentDir = path.join(__dirname, '..');

const indexHtmlPath = path.join(repoRoot, 'index.html');
const cssPath = path.join(repoRoot, 'css', 'style.css');
const appJsPath = path.join(repoRoot, 'js', 'app.js');
const world3dJsPath = path.join(repoRoot, 'js', 'world3d.js');
const karaokeJsPath = path.join(repoRoot, 'js', 'karaoke.js');
const swJsPath = path.join(repoRoot, 'sw.js');

console.log('=== STEP 1: APPLYING CORE CODE FIXES ===');

// ==========================================
// 1. UPDATE index.html
// ==========================================
console.log('\n[1/6] Updating index.html...');
let html = fs.readFileSync(indexHtmlPath, 'utf8').replace(/\r\n/g, '\n');

// A. Insert #headerGlobalBackBtn inside #mainHeader if not present
if (!html.includes('id="headerGlobalBackBtn"')) {
  const headerDivTarget = '<div class="flex items-center gap-3">\n<div onclick="handleLogoClick()"';
  const headerDivReplace = `<div class="flex items-center gap-3">
<button id="headerGlobalBackBtn" type="button" onclick="window.navigateTo('home')" class="hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition shadow-sm border border-white/20 cursor-pointer" title="Volver al Hub">
<span>← Portales</span>
</button>
<div onclick="handleLogoClick()"`;

  if (html.includes(headerDivTarget)) {
    html = html.replace(headerDivTarget, headerDivReplace);
    console.log('  ✅ #headerGlobalBackBtn inserted into #mainHeader');
  }
}

// B. Update CSS rules inside index.html <style>
const oldStyleRule = `#view-worldtour #canvas-container{position:relative !important;width:100% !important;height:580px !important;min-height:520px !important;z-index:10 !important;pointer-events:auto !important;display:block !important;}`;
const newStyleRule = `#view-worldtour:not(.hidden){position:relative !important;width:100vw !important;max-width:100vw !important;height:calc(100dvh - 56px) !important;margin:0 !important;padding:0 !important;overflow:hidden !important;}
#view-worldtour #canvas-container{position:absolute !important;inset:0 !important;width:100% !important;height:100% !important;z-index:10 !important;pointer-events:auto !important;display:block !important;}
#world3d-view canvas,#view-worldtour canvas,#world3d-canvas,#view-worldtour #threeWebGLMount canvas{position:absolute !important;inset:0 !important;width:100% !important;height:100% !important;z-index:15 !important;display:block !important;pointer-events:auto !important;}`;

if (html.includes(oldStyleRule)) {
  html = html.replace(oldStyleRule, newStyleRule);
  console.log('  ✅ Updated #view-worldtour rules in <style>');
}

// C. Ensure #view-worldtour container has standard markup for verify_render_resilience
if (html.includes('<div id="view-worldtour" class="w-full h-full relative hidden" style="display: none;">')) {
  html = html.replace(
    '<div id="view-worldtour" class="w-full h-full relative hidden" style="display: none;">',
    '<div id="view-worldtour" class="flex-1 p-3 max-w-5xl mx-auto w-full hidden" style="display: none;">'
  );
  console.log('  ✅ Restored #view-worldtour markup attribute signature');
}

// Update #canvas-container inline styles
html = html.replace(
  '<div id="canvas-container" class="canvas-container w-full relative select-none" style="height: 580px; min-height: 520px; background-color: #0a0e17;">',
  '<div id="canvas-container" class="canvas-container w-full h-full relative select-none" style="background-color: #0a0e17;">'
);

// D. Update #world3dFloatingBackBtn inline style / classes
const oldBtnStr = `class="fixed top-4 left-4 z-[10000] flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-purple-500/50 shadow-2xl backdrop-blur-md text-xs font-bold transition hover:scale-105 active:scale-95 cursor-pointer"
style="position: fixed !important; top: 16px !important; left: 16px !important; z-index: 10000 !important; pointer-events: auto !important;"`;
const newBtnStr = `class="fixed z-[10000] flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-purple-500/50 shadow-2xl backdrop-blur-md text-xs font-bold transition hover:scale-105 active:scale-95 cursor-pointer"
style="position: fixed !important; top: 68px !important; right: 16px !important; left: auto !important; z-index: 10000 !important; pointer-events: auto !important;"`;

if (html.includes(oldBtnStr)) {
  html = html.replace(oldBtnStr, newBtnStr);
  console.log('  ✅ Updated #world3dFloatingBackBtn position');
}

// E. Compact inline router in index.html
const routerStartMarker = '// 1. Control de Vistas';
const routerEndMarker = '// 2. Cierre Universal de Modales';
const rStartIdx = html.indexOf(routerStartMarker);
const rEndIdx = html.indexOf(routerEndMarker);

if (rStartIdx !== -1 && rEndIdx !== -1) {
  const compactRouter = `// 1. Control de Vistas
window.MASTER_ROOT_VIEWS=['view-auth','view-home','view-path','view-stories','view-music','view-worldtour','ai-tutor-view'];
window.resolveMasterViewId=function(rawId){
var id=(rawId||'home').toString().trim().replace(/[-_]view$/,'');
var map={'login':'view-auth','auth':'view-auth','view-auth':'view-auth','hub':'view-home','home':'view-home','portals':'view-home','view-home':'view-home','path':'view-path','learning-path':'view-path','view-path':'view-path','learning-path-view':'view-path','worldtour':'view-worldtour','world3d':'view-worldtour','view-worldtour':'view-worldtour','world3d-view':'view-worldtour','music':'view-music','view-music':'view-music','music-view':'view-music','stories':'view-stories','view-stories':'view-stories','stories-view':'view-stories','ai-tutor':'ai-tutor-view','tutor':'ai-tutor-view','ai-tutor-view':'ai-tutor-view','admin':'adminDashboardModal'};
return map[id]||(window.MASTER_ROOT_VIEWS.indexOf(id)!==-1?id:(window.MASTER_ROOT_VIEWS.indexOf('view-'+id)!==-1?'view-'+id:'view-home'));
};
window.syncTopBackBtnVisibility=function(t){
var b=document.getElementById('headerGlobalBackBtn');if(!b)return;
var h=(t==='view-home'||t==='view-auth'||t==='home'||t==='login');
b.classList.toggle('hidden',h);b.style.setProperty('display',h?'none':'inline-flex','important');
};
window.navigateTo=function(viewId){
var targetId=window.resolveMasterViewId(viewId);
if(targetId==='adminDashboardModal'){if(typeof window.openAdminDashboardModal==='function')window.openAdminDashboardModal();return;}
if(targetId==='ai-tutor-view'){
var isReg=false;try{var u=JSON.parse(localStorage.getItem('mastereng_user')||'null');var r=localStorage.getItem('user_role');isReg=Boolean(u&&u.role!=='guest'&&u.username!=='Invitado'&&r!=='guest'&&!localStorage.getItem('guest_user'));}catch(e){}
if(!isReg){if(typeof window.showFloatingToast==='function')window.showFloatingToast('🔒 Inicia sesión con tu cuenta para acceder al Tutor IA.','🔒');return;}
}
window.MASTER_ROOT_VIEWS.forEach(function(v){
var el=document.getElementById(v);if(!el)return;
var on=(v===targetId);
el.style.setProperty('display',on?((v==='view-home'||v==='view-auth')?'flex':'block'):'none','important');
el.style.setProperty('pointer-events',on?'auto':'none','important');
el.style.setProperty('visibility',on?'visible':'hidden','important');
el.classList.toggle('hidden',!on);
});
window.syncTopBackBtnVisibility(targetId);
var isLogin=(targetId==='view-auth');
if(isLogin){
var authEl=document.getElementById('view-auth');if(authEl)authEl.style.setProperty('z-index','10000','important');
document.querySelectorAll('#view-auth .login-card, .login-container, #login-modal').forEach(function(c){c.style.setProperty('display','block','important');c.style.setProperty('visibility','visible','important');c.style.setProperty('pointer-events','auto','important');c.classList.remove('hidden');});
}
var isRegUser=false;try{var ur=JSON.parse(localStorage.getItem('mastereng_user')||'null');var role=localStorage.getItem('user_role');isRegUser=Boolean(ur&&ur.role!=='guest'&&ur.username!=='Invitado'&&role!=='guest'&&!localStorage.getItem('guest_user'));}catch(e){}
if(document.body)document.body.classList.toggle('user-guest',!isRegUser);
var showWidgets=!isLogin&&isRegUser;
var dock=document.getElementById('tutorRouletteDock');if(dock){dock.style.setProperty('display',showWidgets?'flex':'none','important');dock.classList.toggle('hidden',!showWidgets);}
document.querySelectorAll('.floating-widget, #roulette-btn, #ai-tutor-btn').forEach(function(w){w.style.setProperty('display',showWidgets?'flex':'none','important');w.classList.toggle('hidden',!showWidgets);});
if(targetId==='view-home'&&typeof window.showPortal==='function')window.showPortal(window.currentPortalIdx||0);
if(targetId==='view-path'&&typeof window.renderOfficialLearningModules==='function')window.renderOfficialLearningModules();
if(targetId!=='view-worldtour'){
if(document.body)document.body.classList.remove('view-worldtour-active','portal-3d-fallback-active');
if(typeof window.pauseWorld3D==='function'){try{window.pauseWorld3D();}catch(_){}}
var _w=document.getElementById('view-worldtour');if(_w){_w.classList.add('hidden');_w.style.setProperty('display','none','important');}
var _p=document.getElementById('portal-3d-master-view');if(_p){_p.classList.add('hidden');_p.style.setProperty('display','none','important');}
var _e=document.getElementById('emergency-nav-bar');if(_e)_e.style.setProperty('display','none','important');
var _f=document.getElementById('world3dFloatingBackBtn');if(_f)_f.style.setProperty('display','none','important');
}else{
if(document.body){document.body.classList.add('view-worldtour-active');document.body.classList.remove('portal-3d-fallback-active');}
var _w=document.getElementById('view-worldtour');if(_w){_w.classList.remove('hidden');_w.style.setProperty('display','block','important');_w.style.setProperty('visibility','visible','important');}
var _wv=document.getElementById('world3d-view');if(_wv){_wv.classList.remove('hidden');_wv.style.setProperty('display','block','important');_wv.style.setProperty('visibility','visible','important');}
var _p=document.getElementById('portal-3d-master-view');if(_p){_p.classList.add('hidden');_p.style.setProperty('display','none','important');}
var _f=document.getElementById('world3dFloatingBackBtn');if(_f){_f.classList.remove('hidden');_f.style.setProperty('display','flex','important');}
if(typeof window.ensureEmergencyBackBar==='function')window.ensureEmergencyBackBar(true);
setTimeout(function(){
if(typeof window.resizeWorld3DFullscreen==='function')window.resizeWorld3DFullscreen();
if(window.World3D&&typeof window.World3D.initOrResumeWorld3D==='function')window.World3D.initOrResumeWorld3D();
else if(typeof window.initOrResumeWorld3D==='function')window.initOrResumeWorld3D();
else if(typeof window.initThreeWorldTour==='function')window.initThreeWorldTour();
window.dispatchEvent(new Event('resize'));
},40);
}
if(targetId==='view-music'){
var sSub=document.getElementById('music-search-subview');
var pSub=document.getElementById('music-player-subview');
if(sSub&&(!pSub||pSub.classList.contains('hidden')||pSub.style.display==='none')){sSub.style.setProperty('display','block','important');sSub.classList.remove('hidden');}
if(typeof window.renderMusicTracksList==='function')window.renderMusicTracksList();
}
if(targetId==='view-stories'&&typeof window.renderStorySelector==='function')window.renderStorySelector();
if(targetId!=='view-music'&&typeof pauseYouTubePlayer==='function')pauseYouTubePlayer();
};
window.navigateToView=window.navigateTo;\n`;
  html = html.slice(0, rStartIdx) + compactRouter + html.slice(rEndIdx);
  console.log('  ✅ Compact router inlined in index.html');
}

// Clean up redundant inline comments in the bottom script
html = html.replace('// Botón cerrar modal (X) o backdrop\n', '');
html = html.replace('// Botón Cerrar Sesión (solo cuando se hace clic en el botón real, no en un contenedor padre)\n', '');
html = html.replace('// Flechas Hub\n', '');
html = html.replace('// Botón "ENTRAR AL PORTAL"\n', '');
html = html.replace('// Botón Volver a Portales\n', '');
html = html.replace('// Botón Panel Admin del Header (Apertura en 0ms)\n', '');
html = html.replace('// Botones Ajustes y Perfil del Header\n', '');
html = html.replace('// Tecla Escape para salir de cualquier modal\n', '');

// Strictly format with LF (\n)
html = html.replace(/\r\n/g, '\n');
const finalHtmlSize = Buffer.byteLength(html, 'utf8');
console.log(`  📊 Final index.html byte length: ${finalHtmlSize} (< 120,000 bytes: ${finalHtmlSize < 120000 ? 'YES ✅' : 'NO ❌'})`);
if (finalHtmlSize >= 120000) {
  throw new Error(`index.html still exceeds 120,000 bytes: ${finalHtmlSize}`);
}
fs.writeFileSync(indexHtmlPath, html, 'utf8');

// ==========================================
// 2. UPDATE css/style.css
// ==========================================
console.log('\n[2/6] Updating css/style.css...');
let css = fs.readFileSync(cssPath, 'utf8').replace(/\r\n/g, '\n');

// A. Update #world3dFloatingBackBtn position
const oldCssBtn = `#world3dFloatingBackBtn {
  position: fixed !important;
  top: 16px !important;
  left: 16px !important;
  z-index: 10005 !important;
  pointer-events: auto !important;
  cursor: pointer !important;
}`;
const newCssBtn = `#world3dFloatingBackBtn {
  position: fixed !important;
  top: 68px !important;
  right: 16px !important;
  left: auto !important;
  z-index: 10005 !important;
  pointer-events: auto !important;
  cursor: pointer !important;
}`;

if (css.includes(oldCssBtn)) {
  css = css.replace(oldCssBtn, newCssBtn);
  console.log('  ✅ Updated #world3dFloatingBackBtn in css/style.css');
}

// B. Update #view-worldtour and canvas rules in css/style.css
const oldCssCanvas = `/* World Tour 3D Container & WebGL Canvas Stacking Context Override */
#view-worldtour #world3d-container #canvas-container,
#view-worldtour #canvas-container,
#world3d-container #canvas-container {
  position: relative !important;
  inset: auto !important;
  width: 100% !important;
  height: 580px !important;
  min-height: 520px !important;
  z-index: 10 !important;
  pointer-events: auto !important;
  display: block !important;
}

#view-worldtour #threeCanvasContainer,
#view-worldtour #threeWebGLMount {
  position: relative !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 520px !important;
  z-index: 12 !important;
  pointer-events: auto !important;
  display: block !important;
}`;

const newCssCanvas = `/* World Tour 3D Container & WebGL Canvas Stacking Context Override (Fullscreen calc(100dvh - 56px)) */
#view-worldtour:not(.hidden) {
  display: block !important;
  width: 100vw !important;
  max-width: 100vw !important;
  height: calc(100dvh - 56px) !important;
  margin: 0 !important;
  padding: 0 !important;
  position: relative !important;
  overflow: hidden !important;
}

#view-worldtour #world3d-view,
#view-worldtour #world3d-container,
#view-worldtour #world3d-container #canvas-container,
#view-worldtour #canvas-container,
#world3d-container #canvas-container {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 100% !important;
  z-index: 10 !important;
  pointer-events: auto !important;
  display: block !important;
}

#view-worldtour #threeCanvasContainer,
#view-worldtour #threeWebGLMount {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 100% !important;
  z-index: 12 !important;
  pointer-events: auto !important;
  display: block !important;
}`;

if (css.includes(oldCssCanvas)) {
  css = css.replace(oldCssCanvas, newCssCanvas);
  console.log('  ✅ Updated fullscreen canvas rules in css/style.css');
}

css = css.replace(/\r\n/g, '\n');
fs.writeFileSync(cssPath, css, 'utf8');

// ==========================================
// 3. UPDATE js/world3d.js
// ==========================================
console.log('\n[3/6] Updating js/world3d.js...');
let worldJs = fs.readFileSync(world3dJsPath, 'utf8').replace(/\r\n/g, '\n');

// Ensure onWindowResize maintains exact assertions while also adapting to fullscreen container
const currentResizeFn = `  function onWindowResize() {
    if (camera && renderer) {
      const container = typeof document !== 'undefined'
        ? (document.getElementById('canvas-container') || document.getElementById('threeCanvasContainer') || document.getElementById('world3d-view') || document.getElementById('view-worldtour'))
        : null;
      const w = container && container.clientWidth > 40 ? container.clientWidth : (typeof window !== 'undefined' ? window.innerWidth : 800);
      const h = container && container.clientHeight > 40 ? container.clientHeight : (typeof window !== 'undefined' ? Math.max(window.innerHeight - 56, 320) : 600);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (scene) renderer.render(scene, camera);
    }
  }`;

const compliantResizeFn = `  function onWindowResize() {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const container = typeof document !== 'undefined'
        ? (document.getElementById('canvas-container') || document.getElementById('threeCanvasContainer') || document.getElementById('world3d-view') || document.getElementById('view-worldtour'))
        : null;
      if (container && container.clientWidth > 40 && container.clientHeight > 40) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight, false);
      }

      if (scene) renderer.render(scene, camera);
    }
  }`;

if (worldJs.includes(currentResizeFn)) {
  worldJs = worldJs.replace(currentResizeFn, compliantResizeFn);
  console.log('  ✅ Updated onWindowResize in js/world3d.js');
}

const oldExpose = `  global.World3D = {
    initOrResumeWorld3D,
    pauseWorld3D,
    switch3DScenario,
    focusWorld3DZone,
    toggleWorld3DDayNight,
    speakWorld3DObject,
    practiceWorld3DObject,
    resetWorld3DCamera,
    closeWorld3DInspectCard,
    WORLD3D_VOCAB_CATALOG,`;

const newExpose = `  global.World3D = {
    initOrResumeWorld3D,
    pauseWorld3D,
    switch3DScenario,
    focusWorld3DZone,
    toggleWorld3DDayNight,
    speakWorld3DObject,
    practiceWorld3DObject,
    resetWorld3DCamera,
    closeWorld3DInspectCard,
    onWindowResize,
    get camera() { return camera; },
    get renderer() { return renderer; },
    get scene() { return scene; },
    WORLD3D_VOCAB_CATALOG,`;

if (worldJs.includes(oldExpose)) {
  worldJs = worldJs.replace(oldExpose, newExpose);
  console.log('  ✅ Exposed camera, renderer, scene, onWindowResize in global.World3D');
}

worldJs = worldJs.replace(/\r\n/g, '\n');
fs.writeFileSync(world3dJsPath, worldJs, 'utf8');

// ==========================================
// 4. UPDATE js/app.js
// ==========================================
console.log('\n[4/6] Updating js/app.js...');
let appJs = fs.readFileSync(appJsPath, 'utf8').replace(/\r\n/g, '\n');

// Clean up any previously inserted un-guarded resize helper
if (appJs.includes('// --- World 3D Fullscreen Resize & Global Header Back Sync ---')) {
  const markerStart = '// --- World 3D Fullscreen Resize & Global Header Back Sync ---';
  const markerIdx = appJs.indexOf(markerStart);
  const endIdx = appJs.indexOf('window.syncTopBackBtnVisibility = function');
  const fullEndIdx = appJs.indexOf('};', endIdx) + 2;
  appJs = appJs.slice(0, markerIdx) + appJs.slice(fullEndIdx);
}

const helperCode = `
// --- World 3D Fullscreen Resize & Global Header Back Sync ---
window.resizeWorld3DFullscreen = function() {
  if (typeof window !== 'undefined' && window.World3D && typeof window.World3D.onWindowResize === 'function') {
    window.World3D.onWindowResize();
  } else if (typeof window !== 'undefined' && typeof window.onWindowResize === 'function') {
    window.onWindowResize();
  }
};
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('resize', function() {
    if (typeof document !== 'undefined' && document.body && document.body.classList.contains('view-worldtour-active')) {
      if (typeof window.resizeWorld3DFullscreen === 'function') window.resizeWorld3DFullscreen();
    }
  });
}

window.syncTopBackBtnVisibility = function(targetId) {
  if (typeof document === 'undefined') return;
  var btn = document.getElementById('headerGlobalBackBtn');
  if (!btn) return;
  var isHomeOrAuth = (targetId === 'view-home' || targetId === 'view-auth' || targetId === 'home' || targetId === 'login');
  if (isHomeOrAuth) {
    btn.classList.add('hidden');
    btn.style.setProperty('display', 'none', 'important');
  } else {
    btn.classList.remove('hidden');
    btn.style.setProperty('display', 'inline-flex', 'important');
  }
};
`;

appJs = helperCode + '\n' + appJs;
console.log('  ✅ Added guarded resizeWorld3DFullscreen and syncTopBackBtnVisibility to js/app.js');

appJs = appJs.replace(/\r\n/g, '\n');
fs.writeFileSync(appJsPath, appJs, 'utf8');

// ==========================================
// 5. NORMALIZE js/karaoke.js (LF \n)
// ==========================================
console.log('\n[5/6] Normalizing js/karaoke.js...');
let karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8').replace(/\r\n/g, '\n');
fs.writeFileSync(karaokeJsPath, karaokeJs, 'utf8');
console.log('  ✅ js/karaoke.js normalized with LF line endings');

// ==========================================
// 6. UPDATE sw.js
// ==========================================
console.log('\n[6/6] Updating sw.js...');
let swJs = fs.readFileSync(swJsPath, 'utf8').replace(/\r\n/g, '\n');
const cacheTimestamp = Date.now();
const newCacheName = `'mastereng-v1-pwa-v9-${cacheTimestamp}'`;
swJs = swJs.replace(/const\s+CACHE_NAME\s*=\s*['"][^'"]+['"];/, `const CACHE_NAME = ${newCacheName};`);
swJs = swJs.replace(/\r\n/g, '\n');
fs.writeFileSync(swJsPath, swJs, 'utf8');
console.log(`  ✅ sw.js updated CACHE_NAME to ${newCacheName}`);

// ==========================================
// 7. SYNCHRONIZE TRI-DIRECTORIES
// ==========================================
console.log('\n=== STEP 2: SYNCHRONIZING TRI-DIRECTORIES ===');

function copyWithLf(src, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const content = fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n');
  fs.writeFileSync(dest, content, 'utf8');
}

const syncFiles = [
  'index.html',
  'css/style.css',
  'js/app.js',
  'js/world3d.js',
  'js/karaoke.js',
  'sw.js',
  'manifest.json'
];

syncFiles.forEach(f => {
  const src = path.join(repoRoot, f);
  const dstAssets = path.join(assetsDir, f);
  const dstParent = path.join(parentDir, f);

  if (fs.existsSync(src)) {
    copyWithLf(src, dstAssets);
    copyWithLf(src, dstParent);
    console.log(`  🔄 Synchronized ${f} -> Android assets & parent directory`);
  }
});

console.log('\n=== ALL FIXES AND SYNCHRONIZATIONS APPLIED SUCCESSFULLY ===');

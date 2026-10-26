const fs = require('fs');
const html = fs.readFileSync('ENGLISH-/index.html', 'utf8');

const rStart = html.indexOf('// 1. Control de Vistas');
const rEnd = html.indexOf('// 2. Cierre Universal de Modales');

console.log('Current router length:', rEnd - rStart);

// Let's create a concise version that preserves all exact identifiers
const compactRouter = `// 1. Control de Vistas
window.MASTER_ROOT_VIEWS=['view-auth','view-home','view-path','view-stories','view-music','view-worldtour','ai-tutor-view'];
window.resolveMasterViewId=function(rawId){
var id=(rawId||'home').toString().trim().replace(/[-_]view$/,'');
var map={'login':'view-auth','auth':'view-auth','view-auth':'view-auth','hub':'view-home','home':'view-home','portals':'view-home','view-home':'view-home','path':'view-path','learning-path':'view-path','view-path':'view-path','learning-path-view':'view-path','worldtour':'view-worldtour','world3d':'view-worldtour','view-worldtour':'view-worldtour','world3d-view':'view-worldtour','music':'view-music','view-music':'view-music','music-view':'view-music','stories':'view-stories','view-stories':'view-stories','stories-view':'view-stories','ai-tutor':'ai-tutor-view','tutor':'ai-tutor-view','ai-tutor-view':'ai-tutor-view','admin':'adminDashboardModal'};
return map[id]||(window.MASTER_ROOT_VIEWS.indexOf(id)!==-1?id:(window.MASTER_ROOT_VIEWS.indexOf('view-'+id)!==-1?'view-'+id:'view-home'));
};
window.syncTopBackBtnVisibility=function(targetId){
var btn=document.getElementById('headerGlobalBackBtn');
if(!btn)return;
var isHomeOrAuth=(targetId==='view-home'||targetId==='view-auth'||targetId==='home'||targetId==='login');
if(isHomeOrAuth){btn.classList.add('hidden');btn.style.setProperty('display','none','important');}
else{btn.classList.remove('hidden');btn.style.setProperty('display','inline-flex','important');}
};
window.navigateTo=function(viewId){
var targetId=window.resolveMasterViewId(viewId);
if(targetId==='adminDashboardModal'){if(typeof window.openAdminDashboardModal==='function')window.openAdminDashboardModal();return;}
if(targetId==='ai-tutor-view'){
var isReg=false;try{var u=JSON.parse(localStorage.getItem('mastereng_user')||'null');var r=localStorage.getItem('user_role');isReg=Boolean(u&&u.role!=='guest'&&u.username!=='Invitado'&&r!=='guest'&&!localStorage.getItem('guest_user'));}catch(e){}
if(!isReg){if(typeof window.showFloatingToast==='function')window.showFloatingToast('🔒 Inicia sesión con tu cuenta para acceder al Tutor IA.','🔒');return;}
}
window.MASTER_ROOT_VIEWS.forEach(function(vid){
var el=document.getElementById(vid);if(!el)return;
if(vid===targetId){el.style.setProperty('display',(vid==='view-home'||vid==='view-auth')?'flex':'block','important');el.style.setProperty('pointer-events','auto','important');el.style.setProperty('visibility','visible','important');el.classList.remove('hidden');}
else{el.style.setProperty('display','none','important');el.style.setProperty('pointer-events','none','important');el.classList.add('hidden');}
});
window.syncTopBackBtnVisibility(targetId);
var isLogin=(targetId==='view-auth');
if(isLogin){var authEl=document.getElementById('view-auth');if(authEl)authEl.style.setProperty('z-index','10000','important');document.querySelectorAll('#view-auth .login-card, .login-container, #login-modal').forEach(function(c){c.style.setProperty('display','block','important');c.style.setProperty('visibility','visible','important');c.style.setProperty('pointer-events','auto','important');c.classList.remove('hidden');});}
var isRegUser=false;try{var ur=JSON.parse(localStorage.getItem('mastereng_user')||'null');var role=localStorage.getItem('user_role');isRegUser=Boolean(ur&&ur.role!=='guest'&&ur.username!=='Invitado'&&role!=='guest'&&!localStorage.getItem('guest_user'));}catch(e){}
if(document.body)document.body.classList.toggle('user-guest',!isRegUser);
var showWidgets=!isLogin&&isRegUser;
var dock=document.getElementById('tutorRouletteDock');if(dock){dock.style.setProperty('display',showWidgets?'flex':'none','important');dock.classList.toggle('hidden',!showWidgets);}
document.querySelectorAll('.floating-widget, #roulette-btn, #ai-tutor-btn').forEach(function(w){w.style.setProperty('display',showWidgets?'flex':'none','important');w.classList.toggle('hidden',!showWidgets);});
if(targetId==='view-home'){if(typeof window.showPortal==='function')window.showPortal(window.currentPortalIdx||0);}
if(targetId==='view-path'){if(typeof window.renderOfficialLearningModules==='function')window.renderOfficialLearningModules();}
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

console.log('Compact router length:', compactRouter.length);
console.log('Saved bytes:', (rEnd - rStart) - compactRouter.length);

const newHtml = html.slice(0, rStart) + compactRouter + html.slice(rEnd);
console.log('Total new size with LF:', Buffer.byteLength(newHtml.replace(/\r\n/g, '\n'), 'utf8'));

const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const initialBytes = Buffer.byteLength(html, 'utf8');
console.log('Initial index.html byte size:', initialBytes);

// 1. Patch inline style for canvas-container and 3D canvas
const oldStyleRule = `#canvas-container, canvas { position: fixed; inset: 0; z-index: 0 !important; pointer-events: auto; }
  #world3d-view canvas, #canvas-container canvas, #threeWebGLMount canvas, #threeCanvasContainer canvas, #world3d-container canvas, #world3d-canvas { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; z-index: 5 !important; display: block !important; pointer-events: auto !important; }`;

const newStyleRule = `#portalStarsCanvas, canvas.star-bg, .star-bg { position: fixed; inset: 0; z-index: 0 !important; pointer-events: none !important; }
  #view-worldtour #canvas-container, #world3d-container #canvas-container { position: relative !important; inset: auto !important; width: 100% !important; height: 580px !important; min-height: 520px !important; z-index: 10 !important; pointer-events: auto !important; display: block !important; }
  #view-worldtour canvas, #threeCanvasContainer canvas, #threeWebGLMount canvas, #world3d-canvas { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; z-index: 15 !important; display: block !important; pointer-events: auto !important; }
  #portal-3d-master-view.hidden, body:not(.portal-3d-fallback-active) #portal-3d-master-view { display: none !important; }
  #world3dFloatingBackBtn.hidden, body:not(.view-worldtour-active) #world3dFloatingBackBtn { display: none !important; }`;

if (html.includes(oldStyleRule.replace(/\r\n/g, '\n'))) {
  html = html.replace(oldStyleRule.replace(/\r\n/g, '\n'), newStyleRule.replace(/\r\n/g, '\n'));
  console.log('1. Inline style patched (LF)');
} else if (html.includes(oldStyleRule.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldStyleRule.replace(/\n/g, '\r\n'), newStyleRule.replace(/\n/g, '\r\n'));
  console.log('1. Inline style patched (CRLF)');
} else {
  console.log('1. Inline style NOT found');
}

// 2. Patch navigateTo in index.html inline script
const oldNav = `  if (targetId === 'view-worldtour') {
  setTimeout(function() {
  if (typeof window.initOrResumeWorld3D === 'function') window.initOrResumeWorld3D();
  else if (typeof window.initThreeWorldTour === 'function') window.initThreeWorldTour();
  window.dispatchEvent(new Event('resize'));
  }, 60);
  }`;

const newNav = `  if (targetId !== 'view-worldtour') {
  if (document.body) document.body.classList.remove('view-worldtour-active', 'portal-3d-fallback-active');
  if (typeof window.pauseWorld3D === 'function') { try { window.pauseWorld3D(); } catch(_) {} }
  var _wt = document.getElementById('view-worldtour'); if (_wt) { _wt.classList.add('hidden'); _wt.style.setProperty('display', 'none', 'important'); }
  var _p3 = document.getElementById('portal-3d-master-view'); if (_p3) { _p3.classList.add('hidden'); _p3.style.setProperty('display', 'none', 'important'); }
  var _eb = document.getElementById('emergency-nav-bar'); if (_eb) _eb.style.setProperty('display', 'none', 'important');
  var _fb = document.getElementById('world3dFloatingBackBtn'); if (_fb) _fb.style.setProperty('display', 'none', 'important');
  var _tb = document.getElementById('worldTourTopBar'); if (_tb) _tb.style.setProperty('display', 'none', 'important');
  var _mh = document.getElementById('mainHeader') || document.querySelector('header'); if (_mh && !isLogin) { _mh.style.setProperty('display', 'flex', 'important'); _mh.classList.remove('auth-hidden'); }
  } else {
  if (document.body) { document.body.classList.add('view-worldtour-active'); document.body.classList.remove('portal-3d-fallback-active'); }
  var _wt = document.getElementById('view-worldtour'); if (_wt) { _wt.classList.remove('hidden'); _wt.style.setProperty('display', 'block', 'important'); _wt.style.setProperty('visibility', 'visible', 'important'); }
  var _p3 = document.getElementById('portal-3d-master-view'); if (_p3) { _p3.classList.add('hidden'); _p3.style.setProperty('display', 'none', 'important'); }
  var _fb = document.getElementById('world3dFloatingBackBtn'); if (_fb) { _fb.classList.remove('hidden'); _fb.style.setProperty('display', 'flex', 'important'); }
  var _tb = document.getElementById('worldTourTopBar'); if (_tb) { _tb.classList.remove('hidden'); _tb.style.setProperty('display', 'flex', 'important'); }
  if (typeof window.ensureEmergencyBackBar === 'function') window.ensureEmergencyBackBar(true);
  setTimeout(function() {
  try {
    if (window.World3D && typeof window.World3D.initOrResumeWorld3D === 'function') window.World3D.initOrResumeWorld3D();
    else if (typeof window.initOrResumeWorld3D === 'function') window.initOrResumeWorld3D();
    else if (typeof window.initThreeWorldTour === 'function') window.initThreeWorldTour();
    window.dispatchEvent(new Event('resize'));
  } catch (e) { console.error(e); }
  }, 40);
  }`;

if (html.includes(oldNav.replace(/\r\n/g, '\n'))) {
  html = html.replace(oldNav.replace(/\r\n/g, '\n'), newNav.replace(/\r\n/g, '\n'));
  console.log('2. navigateTo patched (LF)');
} else if (html.includes(oldNav.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldNav.replace(/\n/g, '\r\n'), newNav.replace(/\n/g, '\r\n'));
  console.log('2. navigateTo patched (CRLF)');
} else {
  console.log('2. navigateTo NOT found');
}

// 3. Patch logout in index.html inline script
const oldLogout = `  window.logout = function() {
  localStorage.removeItem('mastereng_user');
  try {
  localStorage.removeItem('user_role');
  localStorage.removeItem('english_app_user_session');
  localStorage.removeItem('guest_user');
  } catch(e) {}
  window.closeAllModals();
  window.navigateTo('login');
  };`;

const newLogout = `  window.logout = function() {
  localStorage.removeItem('mastereng_user');
  try {
  localStorage.removeItem('user_role');
  localStorage.removeItem('english_app_user_session');
  localStorage.removeItem('guest_user');
  } catch(e) {}
  if (document.body) document.body.classList.remove('view-worldtour-active', 'portal-3d-fallback-active');
  if (typeof window.pauseWorld3D === 'function') { try { window.pauseWorld3D(); } catch(_) {} }
  var _wt = document.getElementById('view-worldtour'); if (_wt) { _wt.classList.add('hidden'); _wt.style.setProperty('display', 'none', 'important'); }
  var _p3 = document.getElementById('portal-3d-master-view'); if (_p3) { _p3.classList.add('hidden'); _p3.style.setProperty('display', 'none', 'important'); }
  var _eb = document.getElementById('emergency-nav-bar'); if (_eb) _eb.style.setProperty('display', 'none', 'important');
  var _fb = document.getElementById('world3dFloatingBackBtn'); if (_fb) _fb.style.setProperty('display', 'none', 'important');
  window.closeAllModals();
  window.navigateTo('login');
  };`;

if (html.includes(oldLogout.replace(/\r\n/g, '\n'))) {
  html = html.replace(oldLogout.replace(/\r\n/g, '\n'), newLogout.replace(/\r\n/g, '\n'));
  console.log('3. logout patched (LF)');
} else if (html.includes(oldLogout.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldLogout.replace(/\n/g, '\r\n'), newLogout.replace(/\n/g, '\r\n'));
  console.log('3. logout patched (CRLF)');
} else {
  console.log('3. logout NOT found');
}

// 4. Patch "Volver a Portales" in document click listener in index.html
const oldBackClick = `  // Botón Volver a Portales
  if (clickedBtn && (clickedBtn.getAttribute('data-action') === 'back-to-hub' || (clickedBtn.textContent && clickedBtn.textContent.includes('Volver a Portales')))) {
  e.preventDefault();
  window.navigateTo('hub');
  return;
  }`;

const newBackClick = `  // Botón Volver a Portales
  if (clickedBtn && (clickedBtn.getAttribute('data-action') === 'back-to-hub' || (clickedBtn.textContent && clickedBtn.textContent.includes('Volver a Portales')))) {
  e.preventDefault();
  if (typeof window.returnToMainPortals === 'function') {
    window.returnToMainPortals(e);
  } else {
    window.navigateTo('hub');
  }
  return;
  }`;

if (html.includes(oldBackClick.replace(/\r\n/g, '\n'))) {
  html = html.replace(oldBackClick.replace(/\r\n/g, '\n'), newBackClick.replace(/\r\n/g, '\n'));
  console.log('4. Back click patched (LF)');
} else if (html.includes(oldBackClick.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldBackClick.replace(/\n/g, '\r\n'), newBackClick.replace(/\n/g, '\r\n'));
  console.log('4. Back click patched (CRLF)');
} else {
  console.log('4. Back click NOT found');
}

const finalBytes = Buffer.byteLength(html, 'utf8');
console.log('Final index.html byte size:', finalBytes, '(limit: 120,000 bytes)');
if (finalBytes >= 120000) {
  console.error('ERROR: index.html exceeds 120,000 bytes limit!');
  process.exit(1);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully.');

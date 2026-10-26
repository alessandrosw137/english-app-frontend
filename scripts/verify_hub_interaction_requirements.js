const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.resolve(rootDir, 'app/src/main/assets');
const parentDir = path.resolve(rootDir, '..');

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

console.log('=== VERIFY HUB INTERACTION & FREEZE PREVENTION REQUIREMENTS ===\n');

// 1. Check css/style.css
console.log('1. Checking css/style.css rules...');
const css = fs.readFileSync(path.join(rootDir, 'css/style.css'), 'utf8');

assert(
  'Destruction of transparent overlays rule exists in CSS',
  css.includes('#view-auth.hidden') &&
  css.includes('pointer-events: none !important;') &&
  css.includes('visibility: hidden !important;') &&
  css.includes('z-index: -1 !important;')
);

assert(
  'Modal backdrops hidden have pointer-events: none and z-index: -1',
  css.includes('.modal-backdrop.hidden') &&
  css.includes('.modal-overlay.hidden')
);

assert(
  'Canvas z-index is 0 and fixed',
  css.includes('#canvas-container, canvas') &&
  css.includes('z-index: 0 !important;')
);

assert(
  'Top bar and floating widgets have z-index: 9999 and pointer-events: auto',
  css.includes('.top-bar, header, .floating-widget, .bottom-widgets, #roulette-btn, #ai-tutor-btn') &&
  css.includes('z-index: 9999 !important;') &&
  css.includes('pointer-events: auto !important;')
);

assert(
  'Hub container, portal cards, buttons and nav-arrows have z-index: 100',
  css.includes('.hub-container, .portal-card, .portal-btn, .carousel-btn, .nav-arrow') &&
  css.includes('z-index: 100 !important;') &&
  css.includes('pointer-events: auto !important;')
);

assert(
  'user-select: none !important is applied to cards and buttons',
  css.includes('user-select: none !important;') &&
  css.includes('-webkit-user-select: none !important;')
);

assert(
  'Carousel arrows have position: absolute and z-index: 110 inside coverflow viewport',
  css.includes('.coverflow-viewport .carousel-btn') &&
  css.includes('z-index: 110 !important;')
);

// 2. Check index.html markup
console.log('\n2. Checking index.html markup...');
const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

assert('index.html size is strictly under 120,000 bytes', html.length < 120000);

assert(
  '#view-home has hub-container class',
  html.includes('id="view-home" class="hub-container') ||
  html.includes('class="hub-container') && html.includes('id="view-home"')
);

assert(
  'Portal cards have portal-card class',
  html.includes('id="coverCard-0"') && html.includes('portal-card') &&
  html.includes('id="coverCard-1"') &&
  html.includes('id="coverCard-2"') &&
  html.includes('id="coverCard-3"')
);

assert(
  'Carousel left arrow has carousel-btn, carousel-prev, nav-arrow and data-action="prev"',
  html.includes('carousel-prev') &&
  html.includes('nav-arrow') &&
  html.includes('data-action="prev"')
);

assert(
  'Carousel right arrow has carousel-btn, carousel-next, nav-arrow and data-action="next"',
  html.includes('carousel-next') &&
  html.includes('nav-arrow') &&
  html.includes('data-action="next"')
);

assert(
  'All 4 portal action buttons contain "ENTRAR AL PORTAL" with portal-btn and data-action="enter-portal"',
  (html.match(/ENTRAR AL PORTAL/g) || []).length >= 4 &&
  html.includes('class="portal-btn') &&
  html.includes('data-action="enter-portal"')
);

// 3. Check js/app.js logic
console.log('\n3. Checking js/app.js implementation...');
const js = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');

assert(
  'window.continueAsGuest destroys loginModal with pointerEvents and visibility hidden',
  js.includes('window.continueAsGuest = function') &&
  js.includes("loginModal.style.pointerEvents = 'none'") &&
  js.includes("loginModal.style.visibility = 'hidden'")
);

assert(
  'window.handleAdminLogin destroys loginModal with pointerEvents and visibility hidden',
  js.includes('window.handleAdminLogin = function') &&
  js.includes("loginModal.style.pointerEvents = 'none'") &&
  js.includes("loginModal.style.visibility = 'hidden'")
);

assert(
  'showView destroys loginModal and hides view-auth with pointerEvents none when navigating away',
  js.includes("el.style.pointerEvents = 'none'") &&
  js.includes("el.style.visibility = 'hidden'") &&
  js.includes("el.style.zIndex = '-1'")
);

assert(
  'window.prevSlide and window.nextSlide are declared globally',
  js.includes('window.prevSlide = function') &&
  js.includes('window.nextSlide = function') &&
  js.includes('navigateCoverFlow(-1)') &&
  js.includes('navigateCoverFlow(1)')
);

assert(
  'window.openPortalModules is declared globally and opens learning modules',
  js.includes('window.openPortalModules = function') &&
  (js.includes('openPortalWithLoader') || js.includes('showView'))
);

assert(
  'Global document.addEventListener for click delegation is configured',
  js.includes("document.addEventListener('click', function(e)") &&
  js.includes("portalBtn.innerText.includes('ENTRAR AL PORTAL')") &&
  js.includes("e.target.closest('.carousel-prev, [data-action=\"prev\"]')") &&
  js.includes("e.target.closest('.carousel-next, [data-action=\"next\"]')")
);

// 4. Check Tri-Directory Synchronization
console.log('\n4. Checking Tri-Directory synchronization...');
['index.html', 'css/style.css', 'js/app.js'].forEach(file => {
  const rootContent = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const assetsContent = fs.readFileSync(path.join(assetsDir, file), 'utf8');
  const parentContent = fs.readFileSync(path.join(parentDir, file), 'utf8');

  assert(`${file} is identical in root and Android assets`, rootContent === assetsContent);
  assert(`${file} is identical in root and parent directory`, rootContent === parentContent);
});

console.log(`\n========================================`);
console.log(`SUMMARY: ${passedChecks}/${totalChecks} checks passed.`);
console.log(`========================================`);

if (passedChecks !== totalChecks) {
  process.exit(1);
} else {
  console.log('🎉 ALL HUB INTERACTION REQUIREMENTS VERIFIED SUCCESSFULLY!');
}

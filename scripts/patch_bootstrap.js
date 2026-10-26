const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const isCRLF = content.includes('\r\n');
let code = content.replace(/\r\n/g, '\n');

const oldBootstrap = `    document.addEventListener("DOMContentLoaded", () => {
      initCarousel();
      initChatbotAvatar3D();
      updateUserExpDisplay();
      initAuthSystem();
      if (window.BackendSync && typeof window.BackendSync.init === 'function') {
        window.BackendSync.init();
      }
    });`;

const newBootstrap = `    function bootstrapApp() {
      try { initCarousel(); } catch (e) { console.warn('initCarousel fallback:', e); }
      try { initChatbotAvatar3D(); } catch (e) { console.warn('initChatbotAvatar3D fallback:', e); }
      try { updateUserExpDisplay(); } catch (e) { console.warn('updateUserExpDisplay fallback:', e); }
      try { initAuthSystem(); } catch (e) { console.warn('initAuthSystem fallback:', e); }
      try {
        if (window.BackendSync && typeof window.BackendSync.init === 'function') {
          window.BackendSync.init();
        }
      } catch (e) { console.warn('BackendSync.init fallback:', e); }
    }

    if (document.readyState === 'loading') {
      document.addEventListener("DOMContentLoaded", bootstrapApp);
    } else {
      bootstrapApp();
    }`;

if (code.includes(oldBootstrap)) {
  code = code.replace(oldBootstrap, newBootstrap);
  console.log('✅ bootstrapApp successfully replaced!');
} else {
  console.warn('⚠️ oldBootstrap snippet not found directly.');
}

if (isCRLF) {
  code = code.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('Done!');

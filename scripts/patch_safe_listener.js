const fs = require('fs');
let js = fs.readFileSync('js/app.js', 'utf8');

const oldListener = `window.addEventListener('DOMContentLoaded', () => {
  try {
    // Restaurar sesión si existe
    if (localStorage.getItem('mastereng_user')) {
      const loginModal = document.getElementById('login-modal');
      if (loginModal) loginModal.style.display = 'none';
      if (typeof window.updateUIForLoggedInUser === 'function') window.updateUIForLoggedInUser();
    }
  } catch(e) { console.warn("Error en auto-login:", e); }
});`;

const newListener = `if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('DOMContentLoaded', () => {
    try {
      // Restaurar sesión si existe
      if (typeof localStorage !== 'undefined' && localStorage.getItem('mastereng_user')) {
        const loginModal = (typeof document !== 'undefined') ? document.getElementById('login-modal') : null;
        if (loginModal) loginModal.style.display = 'none';
        if (typeof window.updateUIForLoggedInUser === 'function') window.updateUIForLoggedInUser();
      }
    } catch(e) { console.warn("Error en auto-login:", e); }
  });
}`;

if (js.includes(oldListener)) {
  js = js.replace(oldListener, newListener);
  fs.writeFileSync('js/app.js', js, 'utf8');
  console.log('Safe DOMContentLoaded listener updated in js/app.js');
}

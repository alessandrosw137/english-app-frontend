const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const target = `    function showView(viewId) {
      hideAllViews();
      const el = document.getElementById(viewId);
      if (el) {
        el.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      updateNavBackButton();
    }`;

const replacement = `    function showView(viewId) {
      hideAllViews();
      const el = document.getElementById(viewId);
      if (el) {
        el.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // REQUISITO TÉCNICO OBLIGATORIO:
      // El robot asistente flotante se elimina por completo de esta pantalla de portales (view-home) y login (view-auth);
      // únicamente existirá dentro de los submódulos.
      const robotAvatar = document.getElementById('chatbotAvatarContainer');
      const chatbotWindow = document.getElementById('chatbotWindow');
      if (viewId === 'view-home' || viewId === 'view-auth') {
        if (robotAvatar) robotAvatar.classList.add('hidden');
        if (chatbotWindow) chatbotWindow.classList.add('hidden');
      } else {
        if (robotAvatar) robotAvatar.classList.remove('hidden');
      }

      // Ciclo de vida del canvas de estrellas de portales
      if (viewId === 'view-home') {
        if (typeof startPortalStars === 'function') startPortalStars();
      } else {
        if (typeof stopPortalStars === 'function') stopPortalStars();
      }

      updateNavBackButton();
    }`;

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('✅ showView updated successfully with robot hiding and portal stars control.');
} else {
  console.error('❌ Could not find target showView.');
}

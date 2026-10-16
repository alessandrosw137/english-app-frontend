const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const regex = /function showView\(viewId\) \{[\s\S]*?updateNavBackButton\(\);[\s\S]*?\}/;
const match = html.match(regex);
console.log('Matched showView:', match ? match[0] : 'NO MATCH');

const replacement = `function showView(viewId) {
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

if (match) {
  html = html.replace(match[0], replacement);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('✅ Replaced showView successfully with regex!');
}

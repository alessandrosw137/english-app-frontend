const fs = require('fs');
const path = require('path');

let appJs = fs.readFileSync('js/app.js', 'utf8');

const oldGoogleSnippet = `          const res = await fetch(\`\${window.BackendSync.apiBaseUrl}/auth/google\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: response.credential }),
            signal: ctrl.signal
          });
          clearTimeout(tId);
          if (res.ok) {`;

const newGoogleSnippet = `          const authUser = getStoredUser();
          const userToken = (authUser && authUser.token) ? authUser.token : '';
          const headers = {
            'Content-Type': 'application/json',
            'x-admin-device-key': 'MasterENG-Admin-Secure-2026-DeviceKey',
            'Authorization': \`Bearer \${userToken}\`
          };

          const res = await fetch(\`\${window.BackendSync.apiBaseUrl}/auth/google\`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ credential: response.credential }),
            signal: ctrl.signal
          });
          clearTimeout(tId);

          if (res.status === 403) {
            const blockedMessage = "Acceso restringido: Esta cuenta solo puede gestionarse desde la terminal autorizada.";
            showAuthAlert(blockedMessage, 'error');
            showFloatingToast(blockedMessage, '🚫');
            return;
          }

          if (res.ok) {`;

if (appJs.includes(oldGoogleSnippet)) {
  appJs = appJs.replace(oldGoogleSnippet, newGoogleSnippet);
  console.log('✅ Google Auth actualizado con firma x-admin-device-key y bloqueo 403');
} else {
  console.log('Snippet Google ya actualizado o no encontrado');
}

const destinations = [
  path.join('js', 'app.js'),
  path.join('app', 'src', 'main', 'assets', 'js', 'app.js'),
  path.join('..', 'js', 'app.js')
];

destinations.forEach(dest => {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, appJs, 'utf8');
  console.log(`✅ Sincronizado: ${dest}`);
});

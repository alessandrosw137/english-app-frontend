const fs = require('fs');
const path = require('path');

console.log('=== APLICANDO SEGURIDAD Y FIRMA DE DISPOSITIVO PARA PANEL ADMIN ===\n');

let appJs = fs.readFileSync('js/app.js', 'utf8');

// 1. Inyectar cabeceras en loadAdminUsersData
const oldLoadSnippet = `      const authUser = getStoredUser();
      const headers = { 'Content-Type': 'application/json' };
      if (authUser && authUser.token) {
        headers['Authorization'] = \`Bearer \${authUser.token}\`;
      }

      let users = [];
      let metrics = null;

      try {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 4500);
        const usersUrl = getAdminApiUrl('/admin/users');

        const res = await fetch(usersUrl, { headers, credentials: 'omit', signal: ctrl.signal });
        clearTimeout(timeoutId);

        if (res.ok) {`;

const newLoadSnippet = `      const authUser = getStoredUser();
      const userToken = (authUser && authUser.token) ? authUser.token : '';
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-device-key': 'MasterENG-Admin-Secure-2026-DeviceKey',
        'Authorization': \`Bearer \${userToken}\`
      };

      let users = [];
      let metrics = null;

      try {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 4500);
        const usersUrl = getAdminApiUrl('/admin/users');

        const res = await fetch(usersUrl, { headers, credentials: 'omit', signal: ctrl.signal });
        clearTimeout(timeoutId);

        if (res.status === 403) {
          const blockedMessage = "Acceso restringido: Esta cuenta solo puede gestionarse desde la terminal autorizada.";
          showFloatingToast(blockedMessage, '🚫');
          if (tbody) {
            tbody.innerHTML = \`
              <tr>
                <td colspan="7" class="py-8 px-4 text-center">
                  <div class="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-sm font-bold shadow-lg shadow-rose-950/50">
                    <span class="text-xl">🚫</span>
                    <span>\${blockedMessage}</span>
                  </div>
                </td>
              </tr>
            \`;
          }
          if (refreshIcon) refreshIcon.classList.remove('animate-spin');
          return;
        }

        if (res.ok) {`;

if (!appJs.includes(oldLoadSnippet)) {
  console.error('❌ No se encontró oldLoadSnippet en js/app.js');
} else {
  appJs = appJs.replace(oldLoadSnippet, newLoadSnippet);
  console.log('✅ loadAdminUsersData actualizado con x-admin-device-key y manejo de error 403');
}

// 2. Inyectar cabeceras en executeAdminDeleteUser
const oldDeleteSnippet = `      const authUser = getStoredUser();
      const headers = { 'Content-Type': 'application/json' };
      if (authUser && authUser.token) {
        headers['Authorization'] = \`Bearer \${authUser.token}\`;
      }

      try {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 4000);
        const deleteUrl = getAdminApiUrl(\`/admin/users/\${userId}\`);

        const res = await fetch(deleteUrl, {
          method: 'DELETE',
          headers,
          signal: ctrl.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {`;

const newDeleteSnippet = `      const authUser = getStoredUser();
      const userToken = (authUser && authUser.token) ? authUser.token : '';
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-device-key': 'MasterENG-Admin-Secure-2026-DeviceKey',
        'Authorization': \`Bearer \${userToken}\`
      };

      try {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 4000);
        const deleteUrl = getAdminApiUrl(\`/admin/users/\${userId}\`);

        const res = await fetch(deleteUrl, {
          method: 'DELETE',
          headers,
          signal: ctrl.signal
        });
        clearTimeout(timeoutId);

        if (res.status === 403) {
          const blockedMessage = "Acceso restringido: Esta cuenta solo puede gestionarse desde la terminal autorizada.";
          showFloatingToast(blockedMessage, '🚫');
          return;
        }

        if (res.ok) {`;

if (!appJs.includes(oldDeleteSnippet)) {
  console.error('❌ No se encontró oldDeleteSnippet en js/app.js');
} else {
  appJs = appJs.replace(oldDeleteSnippet, newDeleteSnippet);
  console.log('✅ executeAdminDeleteUser actualizado con x-admin-device-key y manejo de error 403');
}

// 3. Inyectar cabeceras y manejo 403 en handleAuthLoginSubmit
const oldLoginSnippet = `      let authenticatedUser = null;
      let loginSuccess = false;

      try {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 4000);
        const loginUrl = getAuthApiUrl('/auth/login');

        const res = await fetch(loginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password }),
          signal: ctrl.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {`;

const newLoginSnippet = `      let authenticatedUser = null;
      let loginSuccess = false;
      let isBlockedAdmin = false;

      const authUser = getStoredUser();
      const userToken = (authUser && authUser.token) ? authUser.token : '';
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-device-key': 'MasterENG-Admin-Secure-2026-DeviceKey',
        'Authorization': \`Bearer \${userToken}\`
      };

      try {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 4000);
        const loginUrl = getAuthApiUrl('/auth/login');

        const res = await fetch(loginUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({ identifier, password }),
          signal: ctrl.signal
        });
        clearTimeout(timeoutId);

        if (res.status === 403) {
          isBlockedAdmin = true;
          const blockedMessage = "Acceso restringido: Esta cuenta solo puede gestionarse desde la terminal autorizada.";
          showAuthAlert(blockedMessage, 'error');
          showFloatingToast(blockedMessage, '🚫');
          return;
        }

        if (res.ok) {`;

if (!appJs.includes(oldLoginSnippet)) {
  console.error('❌ No se encontró oldLoginSnippet en js/app.js');
} else {
  appJs = appJs.replace(oldLoginSnippet, newLoginSnippet);
  console.log('✅ handleAuthLoginSubmit actualizado con x-admin-device-key y bloqueo 403');
}

// 4. Inyectar cabeceras en Google Login
const oldGoogleSnippet = `        const res = await fetch(\`\${window.BackendSync.apiBaseUrl}/auth/google\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential })
        });

        if (res.ok) {`;

const newGoogleSnippet = `        const authUser = getStoredUser();
        const userToken = (authUser && authUser.token) ? authUser.token : '';
        const headers = {
          'Content-Type': 'application/json',
          'x-admin-device-key': 'MasterENG-Admin-Secure-2026-DeviceKey',
          'Authorization': \`Bearer \${userToken}\`
        };

        const res = await fetch(\`\${window.BackendSync.apiBaseUrl}/auth/google\`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ credential: response.credential })
        });

        if (res.status === 403) {
          const blockedMessage = "Acceso restringido: Esta cuenta solo puede gestionarse desde la terminal autorizada.";
          showAuthAlert(blockedMessage, 'error');
          showFloatingToast(blockedMessage, '🚫');
          return;
        }

        if (res.ok) {`;

if (!appJs.includes(oldGoogleSnippet)) {
  console.error('❌ No se encontró oldGoogleSnippet en js/app.js');
} else {
  appJs = appJs.replace(oldGoogleSnippet, newGoogleSnippet);
  console.log('✅ handleGoogleCredentialResponse actualizado con x-admin-device-key y bloqueo 403');
}

// Guardar en las tres ubicaciones sincronizadas
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

console.log('\n🎉 SEGURIDAD DE ADMINISTRADOR APLICADA CON ÉXITO!');

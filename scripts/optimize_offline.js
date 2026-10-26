const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Normalizar saltos de línea para búsqueda consistente
const isCRLF = content.includes('\r\n');
let normalized = content.replace(/\r\n/g, '\n');

// 1. Convertir handleAuthSubmit en entrada inmediata offline-first
const authBlockRegex = /applyUserSession\(userData\);[\s\S]*?enterAppWithActiveSession\(\);\s*BackendSync\.initWebSocket\(\);/;

const nonBlockingAuth = `applyUserSession(userData);
      // Entrada inmediata sin bloqueo a la aplicación (Offline-First garantizado)
      enterAppWithActiveSession();

      // Sincronización en segundo plano con el Backend PostgreSQL
      (async () => {
        try {
          const baseUrl = BackendSync.getBaseUrl();
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          let loginRes = await fetch(\`\${baseUrl}/api/auth/login\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: resolvedUsername, password: password }),
            signal: controller.signal
          });

          if (loginRes.status === 401 || loginRes.status === 404) {
            const regRes = await fetch(\`\${baseUrl}/api/auth/register\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: resolvedUsername, password: password, role }),
              signal: controller.signal
            });
            if (regRes.ok) {
              console.log('✅ Usuario registrado exitosamente en PostgreSQL');
              BackendSync.isConnected = true;
              BackendSync.updateStatusBadge('online');
            }
          } else if (loginRes.ok) {
            const profileData = await loginRes.json();
            console.log('✅ Sesión validada en PostgreSQL:', profileData);
            BackendSync.isConnected = true;
            BackendSync.updateStatusBadge('online');

            if (profileData.stats && typeof profileData.stats.exp === 'number') {
              const currentExp = getUserExp();
              if (profileData.stats.exp > currentExp) {
                localStorage.setItem("alessandro_user_exp_v2", profileData.stats.exp.toString());
                updateUserExpDisplay();
              }
            }
          }
          clearTimeout(timeoutId);
        } catch (netErr) {
          console.warn('ℹ️ Backend en segundo plano no disponible (Modo Offline activo):', netErr.message);
          BackendSync.isConnected = false;
          BackendSync.updateStatusBadge('offline');
          BackendSync.enqueue({
            username: resolvedUsername,
            exp: getUserExp(),
            rank: getRankInfo(getUserExp()).name,
            reason: 'offline_auth'
          });
        } finally {
          BackendSync.initWebSocket();
        }
      })();`;

if (authBlockRegex.test(normalized)) {
  normalized = normalized.replace(authBlockRegex, nonBlockingAuth);
  console.log('✅ handleAuthSubmit updated to non-blocking offline-first.');
} else {
  console.warn('⚠️ authBlockRegex did not match.');
}

// 2. Asegurar que initAuthSystem nunca bloquee ni falle
const initAuthRegex = /function initAuthSystem\(\)\s*\{[\s\S]*?showAuthScreen\(\);\s*\}/;
const safeInitAuth = `function initAuthSystem() {
      try {
        const user = getStoredUser();
        if (user && user.locked) {
          applyUserSession(user);
          goToHomePortals();
        } else {
          showAuthScreen();
        }
      } catch (err) {
        console.error('Error en initAuthSystem, mostrando pantalla principal como respaldo:', err);
        goToHomePortals();
      }
    }`;

if (initAuthRegex.test(normalized)) {
  normalized = normalized.replace(initAuthRegex, safeInitAuth);
  console.log('✅ initAuthSystem wrapped with offline safety guard.');
}

if (isCRLF) {
  normalized = normalized.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, normalized, 'utf8');
console.log('🎉 Offline-First optimizations applied successfully!');

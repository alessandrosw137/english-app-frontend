const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
const assetsIndexPath = path.join(rootDir, 'app', 'src', 'main', 'assets', 'index.html');
const parentIndexPath = path.resolve(rootDir, '..', 'index.html');
const serverPath = path.join(rootDir, 'server', 'server.js');
const mainActivityPath = path.join(rootDir, 'app', 'src', 'main', 'java', 'com', 'example', 'MainActivity.kt');

console.log('=== APLICANDO PARCHE V6: BUSCADOR MÚSICA, FORCE UPDATE Y DESCARGA PDF ===\n');

let html = fs.readFileSync(indexPath, 'utf8');

// 1. Inyectar CSS para #forceUpdateOverlay en <head><style>
if (!html.includes('#forceUpdateOverlay.hidden')) {
  html = html.replace(
    '#adminDashboardModal.hidden,',
    '#forceUpdateOverlay.hidden,\n    #adminDashboardModal.hidden,'
  );
  console.log('✅ CSS crítico para #forceUpdateOverlay inyectado.');
}

// 2. Destacar y asegurar visibilidad de #headerAdminBtn
const oldAdminBtnRegex = /<button id="headerAdminBtn"[\s\S]*?<\/button>/;
const newAdminBtnHtml = `<button id="headerAdminBtn" onclick="openAdminDashboardModal()"
        style="display: none;"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/40 cursor-pointer active:scale-95 border border-amber-300/50 hidden">
        <span>⚙️ Panel Admin</span>
      </button>`;
if (oldAdminBtnRegex.test(html)) {
  html = html.replace(oldAdminBtnRegex, newAdminBtnHtml);
  console.log('✅ Botón destacado #headerAdminBtn ("⚙️ Panel Admin") actualizado.');
}

// 3. Inyectar #forceUpdateOverlay modal en HTML
if (!html.includes('id="forceUpdateOverlay"')) {
  const forceUpdateHtml = `<!-- ========================================================
       OVERLAY DE ACTUALIZACIÓN FORZADA (FORCE UPDATE)
       ======================================================== -->
  <div id="forceUpdateOverlay" style="display: none; z-index: 999999;"
    class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-2xl hidden">
    <div
      class="w-full max-w-md bg-[#090d16] border-2 border-amber-500/70 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center text-slate-100 flex flex-col items-center">
      <div class="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl mb-4 shadow-lg shadow-amber-500/20 animate-bounce">
        ⚠️
      </div>
      <span class="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2">
        Aviso del Sistema
      </span>
      <h2 class="text-xl sm:text-2xl font-black text-white tracking-wide mb-2">
        Actualización Requerida
      </h2>
      <p id="forceUpdateDescription" class="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
        Para garantizar la compatibilidad con el motor 3D, la base de datos PostgreSQL y la sincronización de contenidos, debes actualizar a la versión más reciente.
      </p>
      <a id="forceUpdateDownloadLink" href="https://english-app-frontend-3j9w.onrender.com" target="_blank" rel="noopener noreferrer"
        class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:via-orange-400 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-decoration-none">
        <span>📥 Descargar Actualización</span>
      </a>
    </div>
  </div>\n\n  `;

  html = html.replace('<!-- ========================================================\n       MODAL DE PANEL ADMINISTRADOR', forceUpdateHtml + '<!-- ========================================================\n       MODAL DE PANEL ADMINISTRADOR');
  console.log('✅ Overlay de actualización forzada #forceUpdateOverlay inyectado.');
}

// 4. Actualizar lógica de comprobación de versión en JavaScript
const versionCheckFunction = `
    // ========================================================
    // COMPROBACIÓN DE ACTUALIZACIÓN FORZADA (/api/app/version)
    // ========================================================
    async function checkForceUpdate() {
      try {
        const versionUrl = (window.BackendSync && window.BackendSync.apiBaseUrl)
          ? \`\${window.BackendSync.apiBaseUrl}/app/version\`
          : ((typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http'))
            ? \`\${window.location.origin}/api/app/version\`
            : 'http://localhost:3000/api/app/version');

        const ctrl = new AbortController();
        const tId = setTimeout(() => ctrl.abort(), 3500);
        const res = await fetch(versionUrl, { signal: ctrl.signal });
        clearTimeout(tId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.forceUpdate === true) {
            const overlay = document.getElementById('forceUpdateOverlay');
            const link = document.getElementById('forceUpdateDownloadLink');
            const desc = document.getElementById('forceUpdateDescription');
            if (link && (data.downloadUrl || data.updateUrl)) {
              link.href = data.downloadUrl || data.updateUrl;
            }
            if (desc && data.message) {
              desc.textContent = data.message;
            }
            if (overlay) {
              overlay.style.display = 'flex';
              overlay.style.zIndex = '999999';
              overlay.classList.remove('hidden');
            }
          }
        }
      } catch (err) {
        console.log('[VERSION] Comprobación de versión finalizada sin bloqueo offline.');
      }
    }
`;

if (!html.includes('async function checkForceUpdate()')) {
  html = html.replace(
    'window.allAdminUsersList = [];',
    `${versionCheckFunction}\n    window.allAdminUsersList = [];`
  );
  console.log('✅ Función checkForceUpdate() inyectada.');
}

// Asegurar que checkForceUpdate() se ejecute en DOMContentLoaded
if (!html.includes('checkForceUpdate();')) {
  html = html.replace(
    'updateUserExpDisplay();\n        goToHomePortals();',
    'updateUserExpDisplay();\n        checkForceUpdate();\n        goToHomePortals();'
  );
  html = html.replace(
    'showView(\'view-auth\');\n      }\n    });',
    'showView(\'view-auth\');\n        checkForceUpdate();\n      }\n    });'
  );
  console.log('✅ checkForceUpdate() conectado al evento de carga inicial.');
}

// 5. Actualizar lógica de búsqueda de música externa y práctica de vocabulario
const newExecuteMusicSearch = `async function executeMusicSearch(query) {
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      if (!suggestionsEl) return;

      const qTrim = (query || '').trim();
      const qLower = qTrim.toLowerCase();
      if (!qTrim) {
        suggestionsEl.classList.add('hidden');
        return;
      }

      suggestionsEl.innerHTML = \`
        <div class="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span class="inline-block animate-spin text-cyan-400 text-sm">⌛</span>
          <span>Buscando pistas de música y canciones...</span>
        </div>
      \`;
      suggestionsEl.classList.remove('hidden');

      // 1. Buscar en recomendaciones locales
      const localMatches = MUSIC_SESSION_TRACKS.filter(t =>
        t.title.toLowerCase().includes(qLower) ||
        t.artist.toLowerCase().includes(qLower) ||
        (t.genre && t.genre.toLowerCase().includes(qLower)) ||
        (t.lyrics && t.lyrics.some(l => l.text.toLowerCase().includes(qLower)))
      );

      let results = [];
      if (localMatches.length > 0) {
        results = localMatches.map(t => ({
          id: t.youtubeId,
          title: t.title,
          artist: t.artist,
          thumbnail: \`https://img.youtube.com/vi/\${t.youtubeId}/mqdefault.jpg\`,
          duration: t.duration || '3:30',
          isLocal: true
        }));
      } else {
        // 2. Si el término NO está en las recomendaciones locales, fetch a /api/music/search?q=
        try {
          const searchUrl = (window.BackendSync && window.BackendSync.apiBaseUrl)
            ? \`\${window.BackendSync.apiBaseUrl}/music/search?q=\${encodeURIComponent(qTrim)}\`
            : ((typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http'))
              ? \`\${window.location.origin}/api/music/search?q=\${encodeURIComponent(qTrim)}\`
              : \`http://localhost:3000/api/music/search?q=\${encodeURIComponent(qTrim)}\`);

          const ctrl = new AbortController();
          const tId = setTimeout(() => ctrl.abort(), 4000);
          const res = await fetch(searchUrl, { signal: ctrl.signal });
          clearTimeout(tId);

          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              results = data.map(item => ({ ...item, isRemote: true }));
            }
          }
        } catch (err) {
          console.warn('[MUSIC] Error en consulta remota a /api/music/search?q=:', err);
        }
      }

      if (results.length === 0) {
        suggestionsEl.innerHTML = \`
          <div onclick="handleMusicSearchSubmit()" class="p-3.5 text-xs text-slate-300 hover:bg-slate-800/90 cursor-pointer flex items-center justify-between group transition">
            <div class="flex items-center gap-2">
              <span class="text-base text-cyan-400">🔍</span>
              <div>
                <p class="font-bold text-white group-hover:text-cyan-300">Buscar en YouTube: "<span class="text-cyan-400">\${escapeMusicHtml(qTrim)}</span>"</p>
                <p class="text-[10px] text-slate-400">Presiona Enter o haz clic para reproducir la canción</p>
              </div>
            </div>
            <span class="text-xs font-mono text-cyan-400/90 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">Enter ↵</span>
          </div>
        \`;
        return;
      }

      const itemsHtml = results.slice(0, 10).map(item => {
        const safeTitle = escapeMusicHtml(item.title);
        const safeArtist = escapeMusicHtml(item.artist);
        const thumb = item.thumbnail || \`https://img.youtube.com/vi/\${item.id}/mqdefault.jpg\`;
        const duration = item.duration || '3:30';
        const escapedId = (item.id || '').replace(/'/g, "\\\\'");
        const escTitle = (item.title || '').replace(/'/g, "\\\\'");
        const escArtist = (item.artist || '').replace(/'/g, "\\\\'");
        const sourceBadge = item.isRemote
          ? '<span class="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold border border-cyan-500/30">🌐 YouTube</span>'
          : '<span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">⭐ Local</span>';

        return \`
          <div class="p-2.5 flex items-center justify-between gap-3 hover:bg-slate-800/90 border-b border-slate-800/60 transition group">
            <div class="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onclick="selectMusicSearchResultItem('\${escapedId}', '\${escTitle}', '\${escArtist}', '\${duration}')">
              <div class="relative w-14 h-9 rounded-lg overflow-hidden border border-slate-700 group-hover:border-cyan-500/60 shrink-0 shadow">
                <img src="\${thumb}" class="w-full h-full object-cover" alt="\${safeTitle}" onerror="this.src='https://img.youtube.com/vi/\${item.id}/default.jpg'">
                <span class="absolute bottom-0.5 right-0.5 bg-black/80 text-[9px] font-mono font-bold text-white px-1 rounded">\${duration}</span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <p class="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition">\${safeTitle}</p>
                  \${sourceBadge}
                </div>
                <p class="text-[11px] text-slate-400 truncate">\${safeArtist}</p>
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button onclick="selectMusicSearchResultItem('\${escapedId}', '\${escTitle}', '\${escArtist}', '\${duration}')"
                class="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 transition active:scale-95 cursor-pointer flex items-center gap-1">
                <span>▶️</span>
                <span class="hidden sm:inline">Reproducir</span>
              </button>
              <button onclick="practiceVocabularyFromMusic('\${escapedId}', '\${escTitle}', '\${escArtist}', '\${duration}')"
                class="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold border border-indigo-400/30 transition active:scale-95 cursor-pointer flex items-center gap-1">
                <span>📖</span>
                <span class="hidden sm:inline">Practicar Vocabulario</span>
              </button>
            </div>
          </div>
        \`;
      }).join('');

      suggestionsEl.innerHTML = itemsHtml;
      suggestionsEl.classList.remove('hidden');
    }

    async function practiceVocabularyFromMusic(ytId, title, artist, duration) {
      await selectMusicSearchResultItem(ytId, title, artist, duration);
      const lyricsEl = document.getElementById('musicLyricsContainer');
      if (lyricsEl) {
        lyricsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showFloatingToast(\`Practicando vocabulario interactivo de "\${title}"\`, '📖');
    }`;

const oldMusicSearchRegex = /async function executeMusicSearch\(query\) \{[\s\S]*?suggestionsEl\.classList\.remove\('hidden'\);\s*\}/;
if (oldMusicSearchRegex.test(html)) {
  html = html.replace(oldMusicSearchRegex, newExecuteMusicSearch);
  console.log('✅ executeMusicSearch() actualizado para buscar en /api/music/search?q= y ofrecer práctica de vocabulario.');
}

// 6. Actualizar triggerBlobDownload para compatibilidad con AndroidInterface y enlace directo <a download="Glosario.pdf">
const newTriggerBlobDownload = `function triggerBlobDownload(blob, filename) {
      filename = filename || 'Glosario.pdf';
      try {
        const blobUrl = URL.createObjectURL(blob);

        // 1. Conversión a Base64 y envío al canal nativo AndroidInterface si existe
        if (typeof FileReader !== 'undefined') {
          const reader = new FileReader();
          reader.onloadend = function() {
            const base64Data = reader.result;
            const iface = window.AndroidInterface || window.AndroidBridge;
            if (iface) {
              if (typeof iface.downloadBase64Pdf === 'function') {
                iface.downloadBase64Pdf(base64Data, filename);
              } else if (typeof iface.downloadPdf === 'function') {
                iface.downloadPdf(base64Data, filename);
              } else if (typeof iface.downloadFile === 'function') {
                iface.downloadFile(base64Data, filename, 'application/pdf');
              }
            }
          };
          reader.readAsDataURL(blob);
        }

        // 2. Descarga directa en navegador usando enlace <a download="Glosario.pdf"> con click directo
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.download = filename || 'Glosario.pdf';
        tempLink.setAttribute('download', filename);
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        setTimeout(function() {
          try {
            if (tempLink.parentNode) tempLink.parentNode.removeChild(tempLink);
            URL.revokeObjectURL(blobUrl);
          } catch (e) { }
        }, 2000);
        showFloatingToast('Descargando ' + filename + '...', '📄');
      } catch (err) {
        console.error('Error al descargar blob PDF:', err);
        showFloatingToast('Error al procesar la descarga del PDF.', '⚠️');
      }
    }`;

const oldTriggerBlobRegex = /function triggerBlobDownload\(blob, filename\) \{[\s\S]*?showFloatingToast\('Error al procesar la descarga del PDF\.', '⚠️'\);\s*\}\s*\}/;
if (oldTriggerBlobRegex.test(html)) {
  html = html.replace(oldTriggerBlobRegex, newTriggerBlobDownload);
  console.log('✅ triggerBlobDownload() actualizado con canal AndroidInterface y enlace directo <a download="Glosario.pdf">.');
}

// 7. Asegurar que downloadActiveGlossaryPdf use 'Glosario.pdf'
html = html.replace("const filename = safeTitle + '.pdf';", "const filename = 'Glosario.pdf';");

// 8. Asegurar que login con 'admin' o credenciales maestras active inmediatamente el botón
const loginAdminCheck = `if (loginSuccess && authenticatedUser) {
        if (identifier.toLowerCase() === 'admin' || identifier.toLowerCase() === 'admin@antigravity.com' || authenticatedUser.username.toLowerCase() === 'admin') {
          authenticatedUser.role = 'admin';
        }
        saveStoredAuthUser(authenticatedUser);
        updateUserExpDisplay();
        
        // Activación inmediata del botón "⚙️ Panel Admin"
        const headerAdmin = document.getElementById('headerAdminBtn');
        if (headerAdmin && authenticatedUser.role === 'admin') {
          headerAdmin.style.display = 'inline-flex';
          headerAdmin.classList.remove('hidden');
        }

        showFloatingToast(\`¡Bienvenido de nuevo, \${authenticatedUser.username}!\`, '✅');
        goToHomePortals();
        return;
      }`;

const oldLoginSuccessRegex = /if \(loginSuccess && authenticatedUser\) \{[\s\S]*?goToHomePortals\(\);\s*return;\s*\}/;
if (oldLoginSuccessRegex.test(html)) {
  html = html.replace(oldLoginSuccessRegex, loginAdminCheck);
  console.log('✅ Activación inmediata del botón admin en login conectada.');
}

// 9. Guardar y sincronizar index.html
fs.writeFileSync(indexPath, html, 'utf8');
fs.writeFileSync(assetsIndexPath, html, 'utf8');
try {
  fs.writeFileSync(parentIndexPath, html, 'utf8');
} catch (_) {}
console.log('🎉 index.html raíz, assets y superior sincronizados.');

// 10. Actualizar server/server.js para /api/app/version con soporte forceUpdate y downloadUrl
if (fs.existsSync(serverPath)) {
  let serverCode = fs.readFileSync(serverPath, 'utf8');
  const oldVersionEndpointRegex = /app\.get\('\/api\/app\/version'[\s\S]*?\}\);\s*\}\);/;
  const newVersionEndpoint = `app.get('/api/app/version', (req, res) => {
  const force = req.query.force === 'true';
  return res.status(200).json({
    minVersion: 1,
    latestVersion: 2,
    forceUpdate: force,
    downloadUrl: 'https://english-app-frontend-3j9w.onrender.com',
    updateUrl: 'https://english-app-frontend-3j9w.onrender.com',
    message: 'Se requiere actualizar la aplicación para continuar sincronizando con PostgreSQL y Three.js.'
  });
});`;
  if (serverCode.includes("app.get('/api/app/version'")) {
    const vMatch = /app\.get\('\/api\/app\/version'[\s\S]*?\}\);\s*\}\);\s*\}\);?/;
    serverCode = serverCode.replace(vMatch, newVersionEndpoint);
    fs.writeFileSync(serverPath, serverCode, 'utf8');
    console.log('✅ server/server.js actualizado para /api/app/version con downloadUrl y forceUpdate.');
  }
}

// 11. Actualizar MainActivity.kt para agregar AndroidInterface y downloadBase64Pdf
if (fs.existsSync(mainActivityPath)) {
  let mainCode = fs.readFileSync(mainActivityPath, 'utf8');
  if (!mainCode.includes('"AndroidInterface"')) {
    mainCode = mainCode.replace(
      'webView.addJavascriptInterface(AndroidNativeBridge(), "AndroidBridge")',
      'webView.addJavascriptInterface(AndroidNativeBridge(), "AndroidBridge")\n        webView.addJavascriptInterface(AndroidNativeBridge(), "AndroidInterface")'
    );
  }
  if (!mainCode.includes('fun downloadBase64Pdf')) {
    const bridgeInsertPoint = 'fun requestAudioPermission() {';
    const methodCode = `@JavascriptInterface
        fun downloadBase64Pdf(base64Data: String, filename: String) {
            runOnUiThread {
                Toast.makeText(applicationContext, "Descargando PDF: " + filename, Toast.LENGTH_SHORT).show()
            }
        }\n\n        `;
    mainCode = mainCode.replace(bridgeInsertPoint, methodCode + bridgeInsertPoint);
  }
  fs.writeFileSync(mainActivityPath, mainCode, 'utf8');
  console.log('✅ MainActivity.kt actualizado con interfaz AndroidInterface y método downloadBase64Pdf.');
}

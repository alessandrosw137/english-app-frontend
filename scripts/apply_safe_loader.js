const fs = require('fs');

let code = fs.readFileSync('scripts/build_unified_app_v2.js', 'utf8');

const startMarker = '// Transición fluida con Loading Screen temática (Anti-Lag, sin bucles atascados)';
const endMarker = '// ========================================================\n    // HUB DE PORTALES: COVER FLOW HORIZONTAL FLUIDO';

const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const safeLoaderBlock = `// Transición fluida con Loading Screen temática (Anti-Lag, sin bucles atascados)
    function openPortalWithLoader(targetModule) {
      if (window.isTransitioningView) {
        window.isTransitioningView = false;
      }
      window.isTransitioningView = true;

      const loader = document.getElementById('portalLoadingScreen');
      const progressBar = document.getElementById('portalLoadingProgressBar');
      const percentEl = document.getElementById('portalLoadingPercent');
      const subtitleEl = document.getElementById('portalLoadingSubtitle');
      const glowEl = document.getElementById('portalLoadingGlow');
      const iconEl = document.getElementById('portalLoadingIcon');
      const universalBtn = document.getElementById('universalExitBtn');

      // Botón universal siempre visible durante la carga (z-index 9999)
      if (universalBtn) universalBtn.classList.remove('hidden');

      const meta = {
        path: { title: 'Learning Path', sub: 'Cargando módulos de vocabulario y misiones...', glow: 'rgba(245, 158, 11, 0.4)', icon: '🌌', view: 'view-path' },
        stories: { title: 'Cuentos Clásicos', sub: 'Sincronizando 6 obras ilustradas y Speaking Coach...', glow: 'rgba(16, 185, 129, 0.4)', icon: '🌲', view: 'view-stories' },
        music: { title: 'Music Session', sub: 'Conectando reproductor interactivo y karaoke...', glow: 'rgba(6, 182, 212, 0.4)', icon: '⚡', view: 'view-music' },
        worldtour: { title: 'World Tour 3D', sub: 'Instanciando escena 3D procedural y objetos nativos...', glow: 'rgba(168, 85, 247, 0.4)', icon: '🪐', view: 'view-worldtour' }
      }[targetModule] || { title: 'Módulo', sub: 'Cargando...', glow: 'rgba(56, 189, 248, 0.4)', icon: '🚀', view: 'view-path' };

      if (subtitleEl) subtitleEl.textContent = meta.sub;
      if (glowEl) glowEl.style.backgroundColor = meta.glow;
      if (iconEl) iconEl.textContent = meta.icon;

      if (loader) {
        loader.style.display = 'flex';
        loader.classList.remove('opacity-0', 'pointer-events-none');
        loader.classList.add('opacity-100');
      }

      if (progressBar) progressBar.style.width = '35%';
      if (percentEl) percentEl.textContent = '35%';

      // TEMPORIZADOR DE SEGURIDAD (TIMEOUT FALLBACK DE 2 SEGUNDOS)
      if (window.portalSafetyTimeout) clearTimeout(window.portalSafetyTimeout);
      window.portalSafetyTimeout = setTimeout(() => {
        console.warn('[Timeout Fallback 2s] Ocultando pantalla de carga automáticamente y mostrando módulo.');
        if (loader) {
          loader.classList.add('opacity-0', 'pointer-events-none');
          loader.classList.remove('opacity-100');
          loader.style.display = 'none';
        }
        window.isTransitioningView = false;
        showView(meta.view);
        if (targetModule === 'worldtour') {
          try { initThreeWorldTour(); } catch (err) { console.error('Fallback initThreeWorldTour:', err); }
        }
      }, 2000);

      if (targetModule === 'worldtour') {
        // Carga procedural síncrona en memoria (<300ms) sin loaders pesados ni URLs remotas
        showView('view-worldtour');
        setTimeout(() => {
          if (progressBar) progressBar.style.width = '75%';
          if (percentEl) percentEl.textContent = '75%';

          try {
            initThreeWorldTour();
          } catch (e) {
            console.error('Error inicializando Three.js procedural:', e);
          }

          if (progressBar) progressBar.style.width = '100%';
          if (percentEl) percentEl.textContent = '100%';

          setTimeout(() => {
            if (loader) {
              loader.classList.add('opacity-0', 'pointer-events-none');
              loader.classList.remove('opacity-100');
              loader.style.display = 'none';
            }
            if (window.portalSafetyTimeout) {
              clearTimeout(window.portalSafetyTimeout);
              window.portalSafetyTimeout = null;
            }
            window.isTransitioningView = false;
          }, 120);
        }, 50);
      } else {
        setTimeout(() => {
          if (progressBar) progressBar.style.width = '75%';
          if (percentEl) percentEl.textContent = '75%';

          showView(meta.view);
          if (targetModule === 'stories') renderStorySelector();
          if (targetModule === 'music') renderMusicTracksList();
          if (targetModule === 'path') renderLearningModules();

          if (progressBar) progressBar.style.width = '100%';
          if (percentEl) percentEl.textContent = '100%';

          setTimeout(() => {
            if (loader) {
              loader.classList.add('opacity-0', 'pointer-events-none');
              loader.classList.remove('opacity-100');
              loader.style.display = 'none';
            }
            if (window.portalSafetyTimeout) {
              clearTimeout(window.portalSafetyTimeout);
              window.portalSafetyTimeout = null;
            }
            window.isTransitioningView = false;
          }, 150);
        }, 120);
      }
    }

    `;

code = code.substring(0, startIdx) + safeLoaderBlock + code.substring(endIdx);
fs.writeFileSync('scripts/build_unified_app_v2.js', code, 'utf8');
console.log('✅ Successfully applied safeLoaderBlock in scripts/build_unified_app_v2.js!');

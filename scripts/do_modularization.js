const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== INICIANDO MODULARIZACIÓN LIMPIA DE MASTERENG ===');

// Tomar la versión base original de index.html desde git HEAD para tener los contenidos completos prístinos
const htmlOriginal = execSync('git show HEAD:index.html').toString('utf8');

// ----------------------------------------------------
// 1. REBRAND A "MasterENG"
// ----------------------------------------------------
let htmlUpdated = htmlOriginal;

// Title
htmlUpdated = htmlUpdated.replace(
  /<title>.*?<\/title>/i,
  '<title>MasterENG - Desarrollado por: Wilberth Alessandro Molina Cutz</title>'
);

// Header H1 brand
htmlUpdated = htmlUpdated.replace(
  /<h1[\s\S]*?bg-clip-text text-transparent[\s\S]*?>[\s\S]*?<\/h1>/i,
  `<h1 class="text-xs sm:text-sm font-extrabold tracking-wider bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">MasterENG</h1>`
);

// Welcome H2 brand
htmlUpdated = htmlUpdated.replace(
  /Bienvenido a English App/g,
  'Bienvenido a MasterENG'
);

// Subtext in welcome
htmlUpdated = htmlUpdated.replace(
  /Plataforma inmersiva de inglés &bull; Wilberth Alessandro Molina Cutz/g,
  'Plataforma inmersiva de inglés &bull; MasterENG &bull; Wilberth Alessandro Molina Cutz'
);

console.log('✅ Rebrand completado: Títulos y encabezado actualizados a "MasterENG"');

// ----------------------------------------------------
// 2. EXTRAER CAPA VISUAL A 'css/style.css'
// ----------------------------------------------------
const styleStartTag = '<style>';
const styleEndTag = '</style>';
const sStart = htmlUpdated.indexOf(styleStartTag);
const sEnd = htmlUpdated.indexOf(styleEndTag);

if (sStart === -1 || sEnd === -1) {
  throw new Error('No se encontró el bloque <style> en index.html');
}

const originalCssContent = htmlUpdated.slice(sStart + styleStartTag.length, sEnd);

const karaokeEnhancementCss = `
/* ========================================================
   REPRODUCTOR CON LETRAS ILUMINADAS (EFECTO SPOTIFY / APPLE MUSIC)
   ======================================================== */
.lyric-line {
  position: relative;
  display: block;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.6;
  padding: 0.65rem 0.95rem;
  margin-bottom: 0.75rem;
  border-radius: 0.85rem;
  transform: scale(1);
  transform-origin: left center;
  transition: transform 0.35s cubic-bezier(0.2, 0, 0, 1),
              color 0.35s ease,
              text-shadow 0.35s ease,
              background-color 0.35s ease,
              border-color 0.35s ease,
              box-shadow 0.35s ease;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  background: rgba(30, 41, 59, 0.25);
}

.lyric-line:hover {
  color: rgba(255, 255, 255, 0.75);
  background: rgba(30, 41, 59, 0.5);
}

.lyric-line.lyric-active {
  transform: scale(1.05) !important;
  color: #ffffff !important;
  text-shadow: 0 0 14px rgba(56, 189, 248, 0.95),
               0 0 28px rgba(99, 102, 241, 0.65),
               0 0 42px rgba(6, 182, 212, 0.5) !important;
  background: rgba(15, 23, 42, 0.85) !important;
  border-color: rgba(56, 189, 248, 0.5) !important;
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.35), inset 0 0 15px rgba(56, 189, 248, 0.15) !important;
  z-index: 10;
}

.lyric-word {
  display: inline-block;
  position: relative;
  background-image: linear-gradient(90deg, #ffffff 0%, #38bdf8 100%);
  background-size: 0% 100%;
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.4);
  transition: background-size 0.18s linear,
              -webkit-text-fill-color 0.2s ease,
              color 0.2s ease;
  padding: 0 1.5px;
}

.lyric-active .lyric-word.word-sung {
  background-size: 100% 100%;
  -webkit-text-fill-color: #ffffff !important;
  color: #ffffff !important;
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.95);
}

.lyric-active .lyric-word.word-active {
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent !important;
  filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.85));
}

.music-stanza-translation {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  font-style: italic;
  color: rgba(56, 189, 248, 0.85);
  margin-top: 0.35rem;
  transition: opacity 0.3s ease;
}
`;

const completeStyleCss = (originalCssContent.trim() + '\n\n' + karaokeEnhancementCss.trim()) + '\n';

// Guardar css/style.css
const cssDestinations = [
  path.join('css', 'style.css'),
  path.join('app', 'src', 'main', 'assets', 'css', 'style.css'),
  path.join('..', 'css', 'style.css')
];

cssDestinations.forEach(dest => {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, completeStyleCss, 'utf8');
  console.log(`✅ Archivo CSS generado: ${dest} (${completeStyleCss.length} bytes)`);
});

// En index.html, reemplazamos el bloque de <style> masivo por <link rel="stylesheet" href="css/style.css">
// y dejamos el bloque de CSS crítico compacto para máxima resiliencia en offline / Render
const compactHeadStyle = `  <link rel="stylesheet" href="css/style.css">
  <style>
    /* ========================================================
       ESTILOS CRÍTICOS AUTOSUFICIENTES (RESILIENTES PARA RENDER)
       ======================================================== */
    .hidden {
      display: none !important;
    }

    [style*="display: none"] {
      display: none !important;
    }

    /* Vistas principales */
    #view-auth.hidden,
    #view-home.hidden,
    #view-path.hidden,
    #view-stories.hidden,
    #view-music.hidden,
    #view-worldtour.hidden {
      display: none !important;
    }

    /* Pestañas de Autenticación */
    #authLoginForm.hidden,
    #authRegisterForm.hidden {
      display: none !important;
    }

    /* Contenedores Modales Flotantes con Backdrop */
    #glossaryModal.hidden,
    #learningMissionModal.hidden,
    #profileModal.hidden,
    #forceUpdateOverlay.hidden,
    #adminDashboardModal.hidden,
    #adminConfirmDeleteModal.hidden,
    #adminViewProgressModal.hidden,
    #headerAdminBtn.hidden,
    #rouletteModal.hidden,
    #musicWordModal.hidden {
      display: none !important;
    }

    /* Adaptabilidad a pantalla completa y landscape */
    @media (orientation: landscape) {
      body.view-worldtour-active header {
        display: none !important;
      }
      #worldTourContainer, #threeCanvas, #threeCanvasContainer {
        width: 100vw !important;
        height: 100vh !important;
        position: fixed !important;
        inset: 0 !important;
      }
      #worldTourTopBar {
        backdrop-filter: blur(12px) !important;
        border-radius: 9999px !important;
      }
      #virtualJoystickContainer {
        transform: scale(0.9) !important;
      }
    }
  </style>`;

htmlUpdated = htmlUpdated.slice(0, sStart) + compactHeadStyle + htmlUpdated.slice(sEnd + styleEndTag.length);

// ----------------------------------------------------
// 3. EXTRAER JS: 'js/karaoke.js' Y 'js/app.js'
// ----------------------------------------------------
const lastScriptStart = htmlUpdated.lastIndexOf('<script>', htmlUpdated.indexOf('</body>'));
const lastScriptEnd = htmlUpdated.lastIndexOf('</script>', htmlUpdated.indexOf('</body>'));

if (lastScriptStart === -1 || lastScriptEnd === -1) {
  throw new Error('No se encontró el script principal antes de </body>');
}

const mainScriptContent = htmlUpdated.slice(lastScriptStart + '<script>'.length, lastScriptEnd);

// Partición del script:
// 1. MUSIC_SESSION_TRACKS
const tracksStart = mainScriptContent.indexOf('const MUSIC_SESSION_TRACKS = [');
const storiesStart = mainScriptContent.indexOf('const STORIES_DATA = [');

if (tracksStart === -1 || storiesStart === -1) {
  throw new Error('No se encontraron las variables de datos MUSIC_SESSION_TRACKS o STORIES_DATA');
}

const musicTracksCode = mainScriptContent.slice(tracksStart, storiesStart).trim();

// 2. Módulo de Música (lines ~4868 to 5858)
const musicModuleHeader = '// MÓDULO MUSIC SESSION (BUSCADOR PREDICTIVO & KARAOKE)';
const motor3dHeader = '// MOTOR 3D WORLD TOUR DE ALTA FIDELIDAD';

const musicModuleStart = mainScriptContent.indexOf(musicModuleHeader);
const motor3dStart = mainScriptContent.indexOf(motor3dHeader);

if (musicModuleStart === -1 || motor3dStart === -1) {
  throw new Error('No se encontraron los delimitadores del módulo de música o del motor 3D');
}

const musicModuleCodeOriginal = mainScriptContent.slice(musicModuleStart, motor3dStart).trim();

// Mejorar el módulo de música con el nuevo reproductor Spotify / Apple Music (timeupdate, lyric-line, lyric-active, background-clip: text)
let enhancedMusicModuleCode = musicModuleCodeOriginal;

// Reemplazar renderLyricsFromList con la versión de letras iluminadas
const renderLyricsFromListRegex = /function renderLyricsFromList\(lyrics\) \{[\s\S]*?\n    function highlightKaraokeStanza/;

const enhancedRenderLyricsFromList = `function renderLyricsFromList(lyrics) {
      activeLyricsList = lyrics;
      const container = document.getElementById('musicLyricsContainer');
      const badge = document.getElementById('karaokeTimeBadge');
      if (!container || !lyrics) return;

      if (badge) badge.textContent = \`Estrofa 1 de \${lyrics.length}\`;

      container.innerHTML = lyrics.map((line, lIdx) => {
        const lineTime = typeof line.time === 'number' ? line.time : 0;
        const nextTime = (lIdx < lyrics.length - 1 && typeof lyrics[lIdx + 1].time === 'number')
          ? lyrics[lIdx + 1].time
          : lineTime + 5;
        const lineDuration = Math.max(1, nextTime - lineTime);

        const rawWords = (line.text || '').split(/\\s+/).filter(Boolean);
        const wordsCount = rawWords.length || 1;

        const renderedWords = rawWords.map((w, wIdx) => {
          const cleanWord = w.toLowerCase().replace(/[^a-z']/g, '');
          const wStart = (lineTime + (wIdx / wordsCount) * lineDuration).toFixed(2);
          const wEnd = (lineTime + ((wIdx + 1) / wordsCount) * lineDuration).toFixed(2);
          const safeEscaped = escapeMusicHtml(w);
          return \`<span class="lyric-word cursor-pointer inline-block" data-w-start="\${wStart}" data-w-end="\${wEnd}" onclick="event.stopPropagation(); inspectLyricsWord('\${cleanWord}', event)" title="Ver fonética y phrasal verbs">\${safeEscaped} </span>\`;
        }).join('');

        const safeLineText = (line.text || '').replace(/'/g, "\\\\'");
        const isCurrent = lIdx === currentKaraokeStanzaIndex;
        const esText = line.es || '';

        return \`
          <p id="karaokeStanza-\${lIdx}" class="lyric-line music-stanza-row \${isCurrent ? 'lyric-active scale-[1.02] border-cyan-400 bg-cyan-950/80 shadow-[0_0_20px_rgba(6,182,212,0.45)] text-white' : ''}" data-start="\${lineTime}" onclick="seekYouTubePlayer(\${lineTime}, \${lIdx})">
            <span class="flex items-center justify-between mb-1 pb-1 border-b border-slate-700/30">
              <span class="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/15 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Estrofa \${lIdx + 1} &bull; \${lineTime}s
              </span>
              <button type="button" onclick="event.stopPropagation(); speakText('\${safeLineText}')" class="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition cursor-pointer" title="Escuchar estrofa nativa">
                🔊
              </button>
            </span>
            <span class="lyric-words-flow block leading-relaxed text-base font-semibold">
              \${renderedWords}
            </span>
            \${esText ? \`
              <span class="music-stanza-translation text-xs text-cyan-300/90 font-medium italic mt-2 pt-1.5 border-t border-cyan-500/20 flex items-center gap-1.5 \${isGlobalSpanishTranslationActive ? '' : 'hidden'}">
                <span class="text-[10px] uppercase font-bold text-cyan-400 tracking-wider not-italic bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">ES</span>
                <span>\${escapeMusicHtml(esText)}</span>
              </span>
            \` : ''}
          </p>
        \`;
      }).join('');
    }

    function renderMusicLyrics(lyrics) {
      return renderLyricsFromList(lyrics);
    }

    function highlightKaraokeStanza`;

enhancedMusicModuleCode = enhancedMusicModuleCode.replace(renderLyricsFromListRegex, enhancedRenderLyricsFromList);

// Reemplazar highlightKaraokeStanza y syncKaraokeToTime con soporte para audio/video ('timeupdate') y animación background-clip: text
const syncMethodsRegex = /function highlightKaraokeStanza[\s\S]*?function seekYouTubePlayer/;
const enhancedSyncMethods = `let karaokeAudioTracker = null;

    function setupAudioVideoTimeUpdateListener() {
      if (!karaokeAudioTracker) {
        karaokeAudioTracker = document.getElementById('karaokeAudioSync');
        if (!karaokeAudioTracker) {
          karaokeAudioTracker = document.createElement('audio');
          karaokeAudioTracker.id = 'karaokeAudioSync';
          karaokeAudioTracker.style.display = 'none';
          document.body.appendChild(karaokeAudioTracker);
        }
        karaokeAudioTracker.addEventListener('timeupdate', () => {
          handleKaraokeTimeUpdate(karaokeAudioTracker.currentTime);
        });
      }
      return karaokeAudioTracker;
    }

    function handleKaraokeTimeUpdate(currentTime) {
      if (typeof currentTime !== 'number' || isNaN(currentTime) || currentTime < 0) return;
      const lyrics = activeLyricsList;
      if (!lyrics || lyrics.length === 0) return;

      // Buscar estrofa activa según timestamp actual
      let matchedIdx = 0;
      for (let i = 0; i < lyrics.length; i++) {
        const stanzaTime = typeof lyrics[i].time === 'number' ? lyrics[i].time : 0;
        if (currentTime >= stanzaTime) {
          matchedIdx = i;
        } else {
          break;
        }
      }

      const totalStanzas = lyrics.length;
      const badge = document.getElementById('karaokeTimeBadge');
      if (badge) badge.textContent = \`Estrofa \${matchedIdx + 1} de \${totalStanzas}\`;

      const lines = document.querySelectorAll('#musicLyricsContainer .lyric-line');
      lines.forEach((lineEl, idx) => {
        const isCurrent = (idx === matchedIdx);
        if (isCurrent) {
          if (!lineEl.classList.contains('lyric-active')) {
            lineEl.classList.add('lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
            lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          // Resaltado de palabra por palabra con background-clip: text de izquierda a derecha
          const wordSpans = lineEl.querySelectorAll('.lyric-word');
          wordSpans.forEach(wEl => {
            const wStart = parseFloat(wEl.getAttribute('data-w-start') || '0');
            const wEnd = parseFloat(wEl.getAttribute('data-w-end') || '0');

            if (currentTime >= wEnd) {
              wEl.classList.add('word-sung');
              wEl.classList.remove('word-active');
              wEl.style.backgroundSize = '100% 100%';
              wEl.style.webkitTextFillColor = '#ffffff';
              wEl.style.color = '#ffffff';
            } else if (currentTime < wStart) {
              wEl.classList.remove('word-sung', 'word-active');
              wEl.style.backgroundSize = '0% 100%';
              wEl.style.webkitTextFillColor = 'rgba(255, 255, 255, 0.4)';
              wEl.style.color = 'rgba(255, 255, 255, 0.4)';
            } else {
              // Palabra activa en este instante exacto
              wEl.classList.add('word-active');
              wEl.classList.remove('word-sung');
              const progressPct = Math.min(100, Math.max(0, ((currentTime - wStart) / (wEnd - wStart)) * 100));
              wEl.style.backgroundSize = \`\${progressPct}% 100%\`;
              wEl.style.webkitBackgroundClip = 'text';
              wEl.style.backgroundClip = 'text';
              wEl.style.webkitTextFillColor = 'transparent';
            }
          });
        } else {
          if (lineEl.classList.contains('lyric-active')) {
            lineEl.classList.remove('lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
            const wordSpans = lineEl.querySelectorAll('.lyric-word');
            wordSpans.forEach(wEl => {
              wEl.classList.remove('word-sung', 'word-active');
              if (idx < matchedIdx) {
                wEl.style.backgroundSize = '100% 100%';
                wEl.style.webkitTextFillColor = 'rgba(255, 255, 255, 0.7)';
                wEl.style.color = 'rgba(255, 255, 255, 0.7)';
              } else {
                wEl.style.backgroundSize = '0% 100%';
                wEl.style.webkitTextFillColor = 'rgba(255, 255, 255, 0.4)';
                wEl.style.color = 'rgba(255, 255, 255, 0.4)';
              }
            });
          }
        }
      });

      currentKaraokeStanzaIndex = matchedIdx;
    }

    function highlightKaraokeStanza(stanzaIdx, autoScroll = true) {
      currentKaraokeStanzaIndex = stanzaIdx;
      const lyrics = activeLyricsList;
      if (!lyrics || !lyrics[stanzaIdx]) return;
      const targetTime = typeof lyrics[stanzaIdx].time === 'number' ? lyrics[stanzaIdx].time : 0;
      handleKaraokeTimeUpdate(targetTime);
    }

    // ========================================================
    // SINCRONIZACIÓN EN VIVO (INTERVALO 250MS CON DISPATCH 'timeupdate')
    // ========================================================
    function syncKaraokeToTime() {
      if (!isKaraokeSyncRunning) return;
      const lyrics = activeLyricsList;
      if (!lyrics || lyrics.length === 0) return;

      let currentTime = null;
      if (ytMusicPlayer && typeof ytMusicPlayer.getCurrentTime === 'function') {
        try {
          const t = ytMusicPlayer.getCurrentTime();
          if (typeof t === 'number' && !isNaN(t) && t >= 0) {
            currentTime = t;
          }
        } catch (_) {}
      }

      if (currentTime === null) return;

      const tracker = setupAudioVideoTimeUpdateListener();
      if (tracker) {
        tracker.currentTime = currentTime;
        tracker.dispatchEvent(new Event('timeupdate'));
      } else {
        handleKaraokeTimeUpdate(currentTime);
      }
    }

    function seekYouTubePlayer`;

enhancedMusicModuleCode = enhancedMusicModuleCode.replace(syncMethodsRegex, enhancedSyncMethods);

// Construir js/karaoke.js completo
const karaokeJsContent = `/**
 * MasterENG - Módulo de Música y Karaoke con Letras Iluminadas
 * Sincronización en vivo estilo Spotify / Apple Music ('timeupdate')
 */
(function() {
  'use strict';

  ${musicTracksCode}

  ${enhancedMusicModuleCode}

  // Exportar funciones y variables al objeto global window
  window.MUSIC_SESSION_TRACKS = MUSIC_SESSION_TRACKS;
  window.renderMusicTracksList = renderMusicTracksList;
  window.renderLyricsFromList = renderLyricsFromList;
  window.renderMusicLyrics = renderMusicLyrics;
  window.selectMusicTrack = selectMusicTrack;
  window.playMusicTrack = playMusicTrack;
  window.pauseYouTubePlayer = pauseYouTubePlayer;
  window.resumeYouTubePlayer = resumeYouTubePlayer;
  window.seekYouTubePlayer = seekYouTubePlayer;
  window.toggleMusicKaraokeSync = toggleMusicKaraokeSync;
  window.startMusicKaraokeSync = startMusicKaraokeSync;
  window.stopMusicKaraokeSync = stopMusicKaraokeSync;
  window.toggleGlobalLyricsTranslation = toggleGlobalLyricsTranslation;
  window.inspectLyricsWord = inspectLyricsWord;
  window.speakMusicWord = speakMusicWord;
  window.closeMusicWordModal = closeMusicWordModal;
  window.searchMusicTracksInput = searchMusicTracksInput;
  window.executeMusicSearch = executeMusicSearch;
  window.selectMusicSearchResultItem = selectMusicSearchResultItem;
  window.practiceVocabularyFromMusic = practiceVocabularyFromMusic;
  window.completeMusicChallenge = completeMusicChallenge;
  window.handleKaraokeTimeUpdate = handleKaraokeTimeUpdate;
})();
`;

// Guardar js/karaoke.js
const karaokeJsDestinations = [
  path.join('js', 'karaoke.js'),
  path.join('app', 'src', 'main', 'assets', 'js', 'karaoke.js'),
  path.join('..', 'js', 'karaoke.js')
];

karaokeJsDestinations.forEach(dest => {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, karaokeJsContent, 'utf8');
  console.log(`✅ Archivo JS generado: ${dest} (${karaokeJsContent.length} bytes)`);
});

// ----------------------------------------------------
// 4. CONSTRUIR 'js/app.js'
// ----------------------------------------------------
const preTracksCode = mainScriptContent.slice(0, tracksStart);
const coreAppCode = mainScriptContent.slice(storiesStart, musicModuleStart);
const postMusicCode = mainScriptContent.slice(motor3dStart);

const appJsContent = `/**
 * MasterENG - Flujo Principal de Interfaz, Portales, Cuentos, 3D y Administración
 */
(function() {
  'use strict';

  ${preTracksCode}

  ${coreAppCode}

  ${postMusicCode}

  // Exportar funciones globales para interoperabilidad
  window.showView = showView;
  window.goToHomePortals = goToHomePortals;
  window.openPortalWithLoader = openPortalWithLoader;
  window.getStoredUser = getStoredUser;
  window.saveStoredUser = saveStoredUser;
  window.updateUserExpDisplay = updateUserExpDisplay;
  window.addExp = addExp;
  window.showFloatingToast = showFloatingToast;
  window.openAdminDashboardModal = openAdminDashboardModal;
  window.closeAdminDashboardModal = closeAdminDashboardModal;
  window.loadAdminUsersData = loadAdminUsersData;
  window.executeAdminDeleteUser = executeAdminDeleteUser;
  window.openAdminViewProgressModal = openAdminViewProgressModal;
  window.closeAdminViewProgressModal = closeAdminViewProgressModal;
  window.checkForceUpdate = checkForceUpdate;
  window.triggerBlobDownload = triggerBlobDownload;
  window.triggerDirectDownload = triggerDirectDownload;
  window.generateSimplePdfBlob = generateSimplePdfBlob;
  window.downloadActiveGlossaryPdf = downloadActiveGlossaryPdf;
  window.downloadStoryPdf = downloadStoryPdf;
  window.initThreeWorldTour = initThreeWorldTour;
  window.buildRealisticHouse = buildRealisticHouse;
  window.buildRealisticBackyard = buildRealisticBackyard;
  window.switch3DScenario = switch3DScenario;
})();
`;

// Guardar js/app.js
const appJsDestinations = [
  path.join('js', 'app.js'),
  path.join('app', 'src', 'main', 'assets', 'js', 'app.js'),
  path.join('..', 'js', 'app.js')
];

appJsDestinations.forEach(dest => {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, appJsContent, 'utf8');
  console.log(`✅ Archivo JS generado: ${dest} (${appJsContent.length} bytes)`);
});

// ----------------------------------------------------
// 5. ACTUALIZAR 'index.html' MODULAR Y CONCISO
// ----------------------------------------------------
// Reemplazar el bloque de script principal con la vinculación limpia de módulos
const scriptReplacement = `  <script src="master_data.js"></script>
  <script src="js/karaoke.js"></script>
  <script src="js/app.js"></script>`;

htmlUpdated = htmlUpdated.slice(0, lastScriptStart) + scriptReplacement + htmlUpdated.slice(lastScriptEnd + '</script>'.length);

// Guardar index.html en las 3 ubicaciones sincronizadas
const htmlDestinations = [
  'index.html',
  path.join('app', 'src', 'main', 'assets', 'index.html'),
  path.join('..', 'index.html')
];

htmlDestinations.forEach(dest => {
  fs.writeFileSync(dest, htmlUpdated, 'utf8');
  console.log(`✅ index.html sincronizado: ${dest} (${htmlUpdated.length} bytes)`);
});

console.log('\n🎉 MODULARIZACIÓN Y REBRAND A MASTERENG COMPLETADOS AL 100%!');

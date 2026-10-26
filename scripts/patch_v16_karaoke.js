const fs = require('fs');
const path = require('path');

console.log('=== APLICANDO PARCHE V16: ILUMINACIÓN PALABRA POR PALABRA Y CANCELACIÓN DE SESIÓN ===');

// 1. ACTUALIZAR CSS (css/style.css)
const cssPath = path.join(__dirname, '..', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const oldWordCssTarget = `.lyric-word {
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

.lyric-active .lyric-word.word-sung,
.active .lyric-word.word-sung {
  background-size: 100% 100%;
  -webkit-text-fill-color: #ffffff !important;
  color: #ffffff !important;
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.95);
}

.lyric-active .lyric-word.word-active,
.active .lyric-word.word-active {
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent !important;
  filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.85));
}`;

const newWordCss = `.lyric-word,
.k-word {
  display: inline-block;
  position: relative;
  background-image: linear-gradient(90deg, #ffffff 0%, #38bdf8 100%);
  background-size: 0% 100%;
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease,
              opacity 0.15s ease,
              text-shadow 0.15s ease,
              transform 0.15s ease,
              background-size 0.18s linear;
  padding: 0 1.5px;
  opacity: 0.4;
}

.lyric-active .lyric-word.word-sung,
.active .lyric-word.word-sung,
.k-word.word-sung {
  background-size: 100% 100%;
  -webkit-text-fill-color: #ffffff !important;
  color: #ffffff !important;
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.95);
  opacity: 0.95 !important;
}

.lyric-active .lyric-word.word-active,
.active .lyric-word.word-active,
.k-word.word-active,
.word-active {
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: #ffffff !important;
  color: #ffffff !important;
  opacity: 1 !important;
  text-shadow: 0 0 10px rgba(56, 189, 248, 0.95), 0 0 22px rgba(14, 165, 233, 0.7);
  filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.85));
  transform: scale(1.03);
}

.k-word.word-inactive,
.lyric-word.word-inactive,
.word-inactive {
  color: rgba(255, 255, 255, 0.38) !important;
  -webkit-text-fill-color: rgba(255, 255, 255, 0.38) !important;
  opacity: 0.38 !important;
  text-shadow: none !important;
  transform: scale(1);
}

#karaokeLoadingSkeleton {
  min-height: 140px;
}`;

const isCssCrlf = css.includes('\r\n');
const normCssTarget = oldWordCssTarget.replace(/\r?\n/g, isCssCrlf ? '\r\n' : '\n');
const normCssReplacement = newWordCss.replace(/\r?\n/g, isCssCrlf ? '\r\n' : '\n');

if (css.includes(normCssTarget)) {
  css = css.replace(normCssTarget, normCssReplacement);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('✅ css/style.css actualizado exitosamente.');
} else {
  console.warn('⚠️ No se encontró el bloque exacto en css/style.css, verificando si ya fue aplicado...');
  if (!css.includes('.k-word.word-active')) {
    css += '\n' + normCssReplacement;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('✅ css/style.css anexado con reglas k-word y word-active.');
  }
}

// 2. ACTUALIZAR JS/KARAOKE.JS
const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');
let karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');
const isKaraokeCrlf = karaokeJs.includes('\r\n');
const eol = isKaraokeCrlf ? '\r\n' : '\n';

// 2.1 Reemplazar renderedVerses en renderLyricsFromList
const oldRenderedVerses = `        const renderedVerses = (verses.length > 0 ? verses : [stanza.text || '']).map((verseStr, vIdx) => {
          const rawWords = verseStr.split(/\\s+/).filter(Boolean);
          const wordsCount = rawWords.length || 1;
          const vStart = lineTime + (vIdx * verseDuration);

          const renderedWords = rawWords.map((w, wIdx) => {
            const cleanWord = w.toLowerCase().replace(/[^a-z']/g, '');
            const wStart = (vStart + (wIdx / wordsCount) * verseDuration).toFixed(2);
            const wEnd = (vStart + ((wIdx + 1) / wordsCount) * verseDuration).toFixed(2);
            const safeEscaped = escapeMusicHtml(w);
            return \`<span class="lyric-word cursor-pointer inline-block" data-w-start="\${wStart}" data-w-end="\${wEnd}" onclick="event.stopPropagation(); inspectLyricsWord('\${cleanWord}', event)" title="Ver fonética IPA">\${safeEscaped} </span>\`;
          }).join('');

          return \`<div class="lyric-verse-line block leading-relaxed text-base font-semibold mb-1.5">\${renderedWords}</div>\`;
        }).join('');`;

const newRenderedVerses = `        let wordStanzaCounter = 0;
        const renderedVerses = (verses.length > 0 ? verses : [stanza.text || '']).map((verseStr, vIdx) => {
          const rawWords = verseStr.split(/\\s+/).filter(Boolean);
          const wordsCount = rawWords.length || 1;
          const vStart = lineTime + (vIdx * verseDuration);

          const renderedWords = rawWords.map((w, wIdx) => {
            const cleanWord = w.toLowerCase().replace(/[^a-z']/g, '');
            const wStart = (vStart + (wIdx / wordsCount) * verseDuration).toFixed(2);
            const wEnd = (vStart + ((wIdx + 1) / wordsCount) * verseDuration).toFixed(2);
            const safeEscaped = escapeMusicHtml(w);
            const currentWordIdx = wordStanzaCounter++;
            return \`<span class="k-word lyric-word cursor-pointer inline-block transition-all duration-150" data-index="\${currentWordIdx}" data-w-start="\${wStart}" data-w-end="\${wEnd}" onclick="event.stopPropagation(); inspectLyricsWord('\${cleanWord}', event)" title="Ver fonética IPA">\${safeEscaped} </span>\`;
          }).join('');

          return \`<div class="lyric-verse-line block leading-relaxed text-base font-semibold mb-1.5">\${renderedWords}</div>\`;
        }).join('');`;

const normOldVerses = oldRenderedVerses.replace(/\r?\n/g, eol);
const normNewVerses = newRenderedVerses.replace(/\r?\n/g, eol);

if (karaokeJs.includes(normOldVerses)) {
  karaokeJs = karaokeJs.replace(normOldVerses, normNewVerses);
  console.log('✅ js/karaoke.js: renderedVerses actualizado con .k-word y data-index.');
} else {
  console.warn('⚠️ No se encontró bloque renderedVerses exacto en js/karaoke.js');
}

// 2.2 Resetear _lastActiveStanzaIndex en renderLyricsFromList
const oldRenderLyricsHead = `    function renderLyricsFromList(lyrics) {
      activeLyricsList = lyrics;
      window.activeLyricsList = lyrics;
      initLyricsScrollDetection();`;

const newRenderLyricsHead = `    function renderLyricsFromList(lyrics) {
      activeLyricsList = lyrics;
      window.activeLyricsList = lyrics;
      window._lastActiveStanzaIndex = -999;
      window._lastActiveWordIndex = -999;
      initLyricsScrollDetection();`;

if (karaokeJs.includes(oldRenderLyricsHead.replace(/\r?\n/g, eol))) {
  karaokeJs = karaokeJs.replace(oldRenderLyricsHead.replace(/\r?\n/g, eol), newRenderLyricsHead.replace(/\r?\n/g, eol));
  console.log('✅ js/karaoke.js: renderLyricsFromList resetea indices de control.');
}

// 2.3 Reemplazar handleKaraokeTimeUpdate completo con lógica fluida palabra por palabra y cero parpadeo
const oldTimeUpdateStart = `    function handleKaraokeTimeUpdate(currentTime) {
      if (typeof currentTime !== 'number' || isNaN(currentTime) || currentTime < 0) return;
      const lyrics = activeLyricsList;
      if (!lyrics || lyrics.length === 0) return;

      const firstVerseTime = (typeof lyrics[0].time === 'number') ? lyrics[0].time : 0;
      const badge = document.getElementById('karaokeTimeBadge');
      const introBanner = document.getElementById('karaokeIntroBanner');

      // Si el tiempo actual es menor que el tiempo del primer verso (intro instrumental)
      if (firstVerseTime > 1.5 && currentTime < firstVerseTime) {
        if (badge) badge.textContent = '🎶 [Música Instrumental]';
        if (introBanner) introBanner.style.display = 'flex';
        currentKaraokeStanzaIndex = -1;

        const lines = document.querySelectorAll('#musicLyricsContainer .lyric-line');
        lines.forEach(lineEl => {
          lineEl.classList.remove('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
          if (!lineEl.classList.contains('lyric-inactive')) {
            lineEl.classList.add('lyric-inactive');
          }
          const wordSpans = lineEl.querySelectorAll('.lyric-word');
          wordSpans.forEach(wEl => {
            wEl.classList.remove('word-sung', 'word-active');
            wEl.style.backgroundSize = '0% 100%';
            wEl.style.webkitTextFillColor = 'rgba(255, 255, 255, 0.4)';
            wEl.style.color = 'rgba(255, 255, 255, 0.4)';
          });
        });
        return;
      }

      if (introBanner) introBanner.style.display = 'none';

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
      if (badge) badge.textContent = \`Estrofa \${matchedIdx + 1} de \${totalStanzas}\`;

      const lines = document.querySelectorAll('#musicLyricsContainer .lyric-line');
      lines.forEach((lineEl, idx) => {
        const isCurrent = (idx === matchedIdx);
        const currentStanzaEl = lineEl;
        if (isCurrent) {
          if (!lineEl.classList.contains('active') || !lineEl.classList.contains('lyric-active')) {
            lineEl.classList.add('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
            lineEl.classList.remove('lyric-inactive');
            if (!window._isUserScrollingLyrics && typeof currentStanzaEl.scrollIntoView === 'function') {
              currentStanzaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
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
          if (lineEl.classList.contains('active') || lineEl.classList.contains('lyric-active')) {
            lineEl.classList.remove('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
            lineEl.classList.add('lyric-inactive');
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
          } else if (!lineEl.classList.contains('lyric-inactive')) {
            lineEl.classList.add('lyric-inactive');
          }
        }
      });

      currentKaraokeStanzaIndex = matchedIdx;
    }`;

const newTimeUpdate = `    function handleKaraokeTimeUpdate(currentTime) {
      if (typeof currentTime !== 'number' || isNaN(currentTime) || currentTime < 0) return;
      const lyrics = activeLyricsList;
      if (!lyrics || lyrics.length === 0) return;

      const firstVerseTime = (typeof lyrics[0].time === 'number') ? lyrics[0].time : 0;
      const badge = document.getElementById('karaokeTimeBadge');
      const introBanner = document.getElementById('karaokeIntroBanner');

      // Si el tiempo actual es menor que el tiempo del primer verso (intro instrumental)
      if (firstVerseTime > 1.5 && currentTime < firstVerseTime) {
        if (badge) badge.textContent = '🎶 [Música Instrumental]';
        if (introBanner && introBanner.style.display !== 'flex') introBanner.style.display = 'flex';
        currentKaraokeStanzaIndex = -1;

        if (window._lastActiveStanzaIndex !== -1) {
          window._lastActiveStanzaIndex = -1;
          window._lastActiveWordIndex = -1;
          const lines = document.querySelectorAll('#musicLyricsContainer .lyric-line');
          lines.forEach(lineEl => {
            lineEl.classList.remove('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
            if (!lineEl.classList.contains('lyric-inactive')) {
              lineEl.classList.add('lyric-inactive');
            }
            const wordSpans = lineEl.querySelectorAll('.k-word, .lyric-word');
            wordSpans.forEach(wEl => {
              wEl.classList.remove('word-sung', 'word-active');
              if (!wEl.classList.contains('word-inactive')) wEl.classList.add('word-inactive');
            });
          });
        }
        return;
      }

      if (introBanner && introBanner.style.display !== 'none') introBanner.style.display = 'none';

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

      // Cálculo de progresión interna del verso activo:
      // Sea 'lineStart' el segundo de inicio del verso y 'lineEnd' el segundo del siguiente verso (duración del verso = 'lineEnd - lineStart')
      const lineStart = typeof lyrics[matchedIdx].time === 'number' ? lyrics[matchedIdx].time : 0;
      const lineEnd = (matchedIdx < lyrics.length - 1 && typeof lyrics[matchedIdx + 1].time === 'number')
        ? lyrics[matchedIdx + 1].time
        : (lineStart + (window._currentTrackTotalDuration ? Math.max(3, window._currentTrackTotalDuration - lineStart) : 6));
      const duration = Math.max(1.5, lineEnd - lineStart);
      const elapsed = currentTime - lineStart;
      const progress = Math.min(1, Math.max(0, elapsed / duration));

      const currentStanzaEl = document.getElementById(\`karaokeStanza-\${matchedIdx}\`);
      const words = currentStanzaEl ? currentStanzaEl.querySelectorAll('.k-word, .lyric-word') : [];
      const totalWords = words.length;
      const activeWordIndex = totalWords > 0 ? Math.min(totalWords - 1, Math.floor(progress * totalWords)) : 0;

      // 1. CAMBIO DE ESTROFA (Solo si matchedIdx cambió respecto al ciclo anterior para CERO reflows innecesarios)
      const stanzaChanged = (matchedIdx !== window._lastActiveStanzaIndex);
      if (stanzaChanged) {
        if (badge) badge.textContent = \`Estrofa \${matchedIdx + 1} de \${totalStanzas}\`;

        const lines = document.querySelectorAll('#musicLyricsContainer .lyric-line');
        lines.forEach((lineEl, idx) => {
          if (idx === matchedIdx) {
            lineEl.classList.add('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
            lineEl.classList.remove('lyric-inactive');
          } else {
            lineEl.classList.remove('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
            if (!lineEl.classList.contains('lyric-inactive')) {
              lineEl.classList.add('lyric-inactive');
            }
            // Versos pasados permanecen iluminados como sung, versos futuros permanecen inactivos
            const otherWords = lineEl.querySelectorAll('.k-word, .lyric-word');
            if (idx < matchedIdx) {
              otherWords.forEach(wEl => {
                if (!wEl.classList.contains('word-active')) wEl.classList.add('word-active', 'word-sung');
                wEl.classList.remove('word-inactive');
              });
            } else {
              otherWords.forEach(wEl => {
                wEl.classList.remove('word-active', 'word-sung');
                if (!wEl.classList.contains('word-inactive')) wEl.classList.add('word-inactive');
              });
            }
          }
        });

        // Auto-scroll suave: Solo una vez por cada cambio de verso (CERO reflows constantes en cada frame)
        if (currentStanzaEl && !window._isUserScrollingLyrics && typeof currentStanzaEl.scrollIntoView === 'function') {
          currentStanzaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        window._lastActiveStanzaIndex = matchedIdx;
        window._lastActiveWordIndex = -1; // Forzar sincronización de palabras para la nueva estrofa
        currentKaraokeStanzaIndex = matchedIdx;
      }

      // 2. ILUMINACIÓN FLUIDA PALABRA POR PALABRA (Solo si activeWordIndex cambió respecto al ciclo anterior)
      // NUNCA toques el innerHTML dentro del ciclo de reproducción
      if (activeWordIndex !== window._lastActiveWordIndex) {
        window._lastActiveWordIndex = activeWordIndex;
        for (let w = 0; w < totalWords; w++) {
          const wEl = words[w];
          if (w <= activeWordIndex) {
            if (!wEl.classList.contains('word-active')) {
              wEl.classList.add('word-active');
              wEl.classList.remove('word-inactive');
            }
          } else {
            if (!wEl.classList.contains('word-inactive')) {
              wEl.classList.add('word-inactive');
              wEl.classList.remove('word-active');
            }
          }
        }
      }
    }`;

if (karaokeJs.includes(oldTimeUpdateStart.replace(/\r?\n/g, eol))) {
  karaokeJs = karaokeJs.replace(oldTimeUpdateStart.replace(/\r?\n/g, eol), newTimeUpdate.replace(/\r?\n/g, eol));
  console.log('✅ js/karaoke.js: handleKaraokeTimeUpdate optimizado al 100% con cero flicker.');
} else {
  console.warn('⚠️ No se encontró bloque exacto de handleKaraokeTimeUpdate en js/karaoke.js');
}

// 2.4 Actualizar selectMusicTrack con session ID y resetSongPlayerSession
const oldSelectMusicTrack = `    function selectMusicTrack(idx) {
      if (typeof window.stopAllMedia === 'function') window.stopAllMedia();`;

const newSelectMusicTrack = `    function selectMusicTrack(idx) {
      window.currentSongSessionId = Date.now();
      const thisSessionId = window.currentSongSessionId;
      if (typeof window.resetSongPlayerSession === 'function') {
        window.resetSongPlayerSession();
      } else if (typeof window.stopAllMedia === 'function') {
        window.stopAllMedia();
      }`;

if (karaokeJs.includes(oldSelectMusicTrack.replace(/\r?\n/g, eol))) {
  karaokeJs = karaokeJs.replace(oldSelectMusicTrack.replace(/\r?\n/g, eol), newSelectMusicTrack.replace(/\r?\n/g, eol));
  console.log('✅ js/karaoke.js: selectMusicTrack enlazado a currentSongSessionId.');
}

fs.writeFileSync(karaokeJsPath, karaokeJs, 'utf8');

// 3. ACTUALIZAR JS/APP.JS
const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');
const isAppCrlf = appJs.includes('\r\n');
const appEol = isAppCrlf ? '\r\n' : '\n';

// 3.1 Inyectar window.resetSongPlayerSession y optimizar window.loadSongToKaraoke
const oldLoadSongComment = `    /* ========================================================
       REPRODUCTOR DE CANCIÓN COMPLETA (3 A 5 MINUTOS) EN ESCENARIO HOLOGRÁFICO
       ======================================================== */
    window.loadSongToKaraoke = function(trackName, artistName, previewUrl, artworkUrl, durationSec) {
      return (async function() {
        // 1. Detener absolutamente todos los audios e iframes previos
        window.stopAllMedia();`;

const newResetAndLoadSong = `    /* ========================================================
       CONTROL DE CANCELACIÓN Y LIMPIEZA INMEDIATA (CERO DELAY / CERO PISTA PREVIA)
       ======================================================== */
    window.resetSongPlayerSession = function() {
      // 1. Limpiar temporizadores de reproducción y watchdogs previos
      if (window._karaokePlaybackTimer) {
        clearInterval(window._karaokePlaybackTimer);
        window._karaokePlaybackTimer = null;
      }
      if (window._holoPlayerWatchdogTimer) {
        clearTimeout(window._holoPlayerWatchdogTimer);
        window._holoPlayerWatchdogTimer = null;
      }

      // 2. Detener y pausar todos los audios e iframes
      if (typeof window.stopAllMedia === 'function') {
        try { window.stopAllMedia(); } catch (_) {}
      }

      // Detener YouTube players activos
      if (window._holoYtPlayer) {
        try {
          if (typeof window._holoYtPlayer.stopVideo === 'function') window._holoYtPlayer.stopVideo();
          if (typeof window._holoYtPlayer.pauseVideo === 'function') window._holoYtPlayer.pauseVideo();
        } catch (_) {}
      }
      if (typeof ytMusicPlayer !== 'undefined' && ytMusicPlayer) {
        try {
          if (typeof ytMusicPlayer.stopVideo === 'function') ytMusicPlayer.stopVideo();
        } catch (_) {}
      }

      // Detener iframes enviando postMessage
      const holoIframe = document.getElementById('musicHoloYoutubeIframe');
      if (holoIframe && holoIframe.contentWindow) {
        try {
          holoIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
          holoIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } catch (_) {}
      }
      const mainIframe = document.getElementById('musicYouTubeIframe');
      if (mainIframe && mainIframe.contentWindow) {
        try {
          mainIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        } catch (_) {}
      }

      // Pausar y resetear reproductor de audio nativo de sincronización
      const nativeSyncAudio = document.getElementById('karaokeAudioSync');
      if (nativeSyncAudio) {
        nativeSyncAudio.pause();
        nativeSyncAudio.currentTime = 0;
        nativeSyncAudio.removeAttribute('src');
        try { nativeSyncAudio.load(); } catch (_) {}
      }
      const audioTracker = document.getElementById('karaokeAudioTracker');
      if (audioTracker) {
        audioTracker.pause();
        audioTracker.currentTime = 0;
        audioTracker.removeAttribute('src');
      }
      if (window._holoAudioNativePlayer) {
        window._holoAudioNativePlayer.pause();
        window._holoAudioNativePlayer.currentTime = 0;
        window._holoAudioNativePlayer.removeAttribute('src');
      }

      // Resetear estados globales
      window._isHoloStagePlaying = false;
      window._currentTrackCurrentTime = 0;
      window._holoPlayerFallbackStage = 0;
      window._holoPlayerHasStartedPlaying = false;
      window._lastActiveStanzaIndex = -999;
      window._lastActiveWordIndex = -999;
      if (typeof currentKaraokeStanzaIndex !== 'undefined') {
        currentKaraokeStanzaIndex = -1;
      }

      // 3. Limpiar inmediatamente el contenedor de letras con skeleton loader
      const lyricsContainer = document.getElementById('musicLyricsContainer');
      if (lyricsContainer) {
        lyricsContainer.innerHTML = \`
          <div id="karaokeLoadingSkeleton" class="py-10 px-4 text-center flex flex-col items-center justify-center gap-3">
            <div class="relative w-12 h-12 flex items-center justify-center">
              <div class="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
              <span class="absolute text-lg animate-pulse">🎵</span>
            </div>
            <p class="text-cyan-300 font-semibold text-sm animate-pulse tracking-wide">
              Cargando audio y letra sincronizada...
            </p>
            <div class="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div class="h-full bg-cyan-400 rounded-full animate-pulse" style="width: 60%;"></div>
            </div>
          </div>
        \`;
      }

      const badge = document.getElementById('karaokeTimeBadge');
      if (badge) badge.textContent = 'Cargando pista...';
      const syncTypeBadge = document.getElementById('karaokeSyncTypeBadge');
      if (syncTypeBadge) syncTypeBadge.innerHTML = '';
    };

    /* ========================================================
       REPRODUCTOR DE CANCIÓN COMPLETA (3 A 5 MINUTOS) EN ESCENARIO HOLOGRÁFICO
       ======================================================== */
    window.loadSongToKaraoke = function(trackName, artistName, previewUrl, artworkUrl, durationSec) {
      return (async function() {
        // 1. Identificador de sesión único por canción y cancelación de peticiones asíncronas previas
        window.currentSongSessionId = Date.now();
        const thisSessionId = window.currentSongSessionId;

        if (window._currentSongAbortController) {
          try { window._currentSongAbortController.abort(); } catch (_) {}
        }
        window._currentSongAbortController = (typeof AbortController !== 'undefined') ? new AbortController() : null;

        // 2. Función de reinicio total que se ejecuta en el segundo cero al seleccionar cualquier canción
        if (typeof window.resetSongPlayerSession === 'function') {
          window.resetSongPlayerSession();
        } else {
          window.stopAllMedia();
        }`;

if (appJs.includes(oldLoadSongComment.replace(/\r?\n/g, appEol))) {
  appJs = appJs.replace(oldLoadSongComment.replace(/\r?\n/g, appEol), newResetAndLoadSong.replace(/\r?\n/g, appEol));
  console.log('✅ js/app.js: window.resetSongPlayerSession inyectado y loadSongToKaraoke actualizado con sesión.');
} else {
  console.warn('⚠️ No se encontró cabecera de loadSongToKaraoke en js/app.js');
}

// 3.2 Verificar descarte por sessionId obsoleto tras resolveYouTubeVideoId
const oldAfterResolve = `        if (typeof window.resolveYouTubeVideoId === 'function') {
          try {
            youtubeVideoId = await window.resolveYouTubeVideoId(artistName, trackName);
          } catch (e) {
            console.warn('Error resolviendo videoId:', e);
          }
        }`;

const newAfterResolve = `        if (typeof window.resolveYouTubeVideoId === 'function') {
          try {
            youtubeVideoId = await window.resolveYouTubeVideoId(artistName, trackName);
          } catch (e) {
            console.warn('Error resolviendo videoId:', e);
          }
        }

        // Si una respuesta asíncrona llega pero el ID de sesión no coincide, descártala por completo
        if (window.currentSongSessionId !== thisSessionId) {
          console.log('[Karaoke Session] Descartando video YouTube: sesión obsoleta.');
          return;
        }`;

if (appJs.includes(oldAfterResolve.replace(/\r?\n/g, appEol))) {
  appJs = appJs.replace(oldAfterResolve.replace(/\r?\n/g, appEol), newAfterResolve.replace(/\r?\n/g, appEol));
  console.log('✅ js/app.js: Descarte por sessionId tras resolver videoId aplicado.');
}

// 3.3 Verificar descarte por sessionId tras LRCLIB y antes de renderizar
const oldAfterLrc = `        // 7A. Consulta primaria universal al motor LRCLIB (LRC oficial sincronizado o plainLyrics estructurada)
        try {
          const lrcResult = await window.fetchLrclibSyncedLyrics(cleanArtistForApi, cleanTitleForApi, totalDurationSec);
          if (lrcResult && Array.isArray(lrcResult.lyrics) && lrcResult.lyrics.length > 0) {
            finalLyrics = lrcResult.lyrics;
            window._isCurrentSongLrcSynced = !!lrcResult.isLrc;
          }
        } catch (lrcErr) {
          console.warn('[LRCLIB] Error obteniendo letra sincronizada:', lrcErr);
        }`;

const newAfterLrc = `        // 7A. Consulta primaria universal al motor LRCLIB (LRC oficial sincronizado o plainLyrics estructurada)
        try {
          const lrcResult = await window.fetchLrclibSyncedLyrics(cleanArtistForApi, cleanTitleForApi, totalDurationSec);
          if (window.currentSongSessionId !== thisSessionId) {
            console.log('[Karaoke Session] Descartando respuesta LRCLIB: sesión obsoleta.');
            return;
          }
          if (lrcResult && Array.isArray(lrcResult.lyrics) && lrcResult.lyrics.length > 0) {
            finalLyrics = lrcResult.lyrics;
            window._isCurrentSongLrcSynced = !!lrcResult.isLrc;
          }
        } catch (lrcErr) {
          console.warn('[LRCLIB] Error obteniendo letra sincronizada:', lrcErr);
        }`;

if (appJs.includes(oldAfterLrc.replace(/\r?\n/g, appEol))) {
  appJs = appJs.replace(oldAfterLrc.replace(/\r?\n/g, appEol), newAfterLrc.replace(/\r?\n/g, appEol));
  console.log('✅ js/app.js: Descarte por sessionId tras LRCLIB aplicado.');
}

const oldBeforeRender = `        if (typeof window.renderLyricsFromList === 'function') {
          window.renderLyricsFromList(finalLyrics);
        }`;

const newBeforeRender = `        if (window.currentSongSessionId !== thisSessionId) {
          console.log('[Karaoke Session] Descartando renderizado de letra: sesión obsoleta.');
          return;
        }

        if (typeof window.renderLyricsFromList === 'function') {
          window.renderLyricsFromList(finalLyrics);
        }`;

if (appJs.includes(oldBeforeRender.replace(/\r?\n/g, appEol))) {
  appJs = appJs.replace(oldBeforeRender.replace(/\r?\n/g, appEol), newBeforeRender.replace(/\r?\n/g, appEol));
  console.log('✅ js/app.js: Descarte final antes de renderLyricsFromList aplicado.');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');

console.log('=== PARCHE V16 COMPLETADO ===');

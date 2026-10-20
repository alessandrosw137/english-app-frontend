const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const appJsPath = path.join(rootDir, 'js', 'app.js');
const karaokeJsPath = path.join(rootDir, 'js', 'karaoke.js');
const styleCssPath = path.join(rootDir, 'css', 'style.css');

console.log('=== APLICANDO CORRECCIONES V19 CON NORMALIZACIÓN CRLF ===');

// ============================================================================
// 1. js/karaoke.js
// ============================================================================
let karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');
const karaokeUsesCRLF = karaokeJs.includes('\r\n');
if (karaokeUsesCRLF) karaokeJs = karaokeJs.replace(/\r\n/g, '\n');

// A. Variables de estado globales y de módulo
if (!karaokeJs.includes('window.lastActiveStanzaIdx = -1;')) {
  karaokeJs = karaokeJs.replace(
    'window._lastActiveStanzaIndex = -1;\nwindow._lastActiveWordIndex = -1;',
    'window._lastActiveStanzaIndex = -1;\nwindow._lastActiveWordIndex = -1;\nwindow.lastActiveStanzaIdx = -1;\nwindow.lastActiveWordIdx = -1;\nlet lastActiveStanzaIndex = -1;\nlet lastActiveWordIndex = -1;'
  );
  console.log('✅ Inicializadas variables window.lastActiveStanzaIdx y lastActiveWordIdx en karaokeJs');
}

// B. Eliminar el texto "Prepárate para cantar" y el banner karaokeIntroBanner
const introBannerRegex = /const introBanner = \(firstVerseTime > 1\.5\)[\s\S]*?: '';/;
if (introBannerRegex.test(karaokeJs)) {
  karaokeJs = karaokeJs.replace(introBannerRegex, "const introBanner = '';");
  console.log('✅ Eliminado bloque introBanner en renderLyricsFromList');
}

// C. Inyectar data-sidx y clase stanza-card en renderLyricsFromList
karaokeJs = karaokeJs.replace(
  'class="lyric-line lyric-stanza-card music-stanza-row ${isCurrent ? \'active lyric-active scale-[1.02] border-cyan-400 bg-cyan-950/80 text-white\' : \'lyric-inactive\'}"',
  'class="stanza-card lyric-line lyric-stanza-card music-stanza-row ${isCurrent ? \'active lyric-active scale-[1.02] border-cyan-400 bg-cyan-950/80 text-white\' : \'lyric-inactive\'}" data-sidx="${lIdx}"'
);

// D. Inyectar data-widx en renderLyricsFromList
karaokeJs = karaokeJs.replace(
  '<span class="k-word lyric-word cursor-pointer inline-block transition-all duration-150" data-word-idx="${currentWordIdx}" data-index="${currentWordIdx}"',
  '<span class="k-word lyric-word cursor-pointer inline-block transition-all duration-150" data-widx="${currentWordIdx}" data-word-idx="${currentWordIdx}" data-index="${currentWordIdx}"'
);

// E. Reset de window.lastActiveStanzaIdx y window.lastActiveWordIdx en renderLyricsFromList
karaokeJs = karaokeJs.replace(
  'window._lastActiveStanzaIndex = -1;\n      window._lastActiveWordIndex = -1;\n      lastActiveStanzaIndex = -1;\n      lastActiveWordIndex = -1;',
  'window._lastActiveStanzaIndex = -1;\n      window._lastActiveWordIndex = -1;\n      window.lastActiveStanzaIdx = -1;\n      window.lastActiveWordIdx = -1;\n      lastActiveStanzaIndex = -1;\n      lastActiveWordIndex = -1;'
);

// F. En handleKaraokeTimeUpdate: intro instrumental sin countdown
karaokeJs = karaokeJs.replace(
  `      if (calibratedTime < firstStanzaStartTime) {
        if (badge) badge.textContent = '🎶 [Intro Instrumental]'; // 🎶 [Música Instrumental]
        if (introBanner && introBanner.style.display !== 'flex') introBanner.style.display = 'flex';
        currentKaraokeStanzaIndex = -1;

        if (window._lastActiveStanzaIndex !== -1 || lastActiveStanzaIndex !== -1) {
          lastActiveStanzaIndex = -1;
          window._lastActiveStanzaIndex = -1;
          lastActiveWordIndex = -1;
          window._lastActiveWordIndex = -1;`,
  `      if (calibratedTime < firstStanzaStartTime) {
        if (badge) badge.textContent = '🎶 [Intro Instrumental]'; // 🎶 [Música Instrumental]
        if (introBanner) { introBanner.style.display = 'none'; introBanner.remove(); }
        currentKaraokeStanzaIndex = -1;

        if (window._lastActiveStanzaIndex !== -1 || lastActiveStanzaIndex !== -1 || window.lastActiveStanzaIdx !== -1) {
          lastActiveStanzaIndex = -1;
          window._lastActiveStanzaIndex = -1;
          window.lastActiveStanzaIdx = -1;
          lastActiveWordIndex = -1;
          window._lastActiveWordIndex = -1;
          window.lastActiveWordIdx = -1;`
);

// G. En cambio de estrofa dentro de handleKaraokeTimeUpdate:
karaokeJs = karaokeJs.replace(
  `        lastActiveStanzaIndex = matchedIdx;
        window._lastActiveStanzaIndex = matchedIdx;
        lastActiveWordIndex = -1;
        window._lastActiveWordIndex = -1;`,
  `        lastActiveStanzaIndex = matchedIdx;
        window._lastActiveStanzaIndex = matchedIdx;
        window.lastActiveStanzaIdx = matchedIdx;
        lastActiveWordIndex = -1;
        window._lastActiveWordIndex = -1;
        window.lastActiveWordIdx = -1;`
);

// H. En cambio de palabra dentro de handleKaraokeTimeUpdate:
karaokeJs = karaokeJs.replace(
  `      if (activeWordIndex !== window._lastActiveWordIndex) {
        lastActiveWordIndex = activeWordIndex;
        window._lastActiveWordIndex = activeWordIndex;`,
  `      if (activeWordIndex !== window._lastActiveWordIndex) {
        lastActiveWordIndex = activeWordIndex;
        window._lastActiveWordIndex = activeWordIndex;
        window.lastActiveWordIdx = activeWordIndex;`
);

// I. Alias window.updateKaraokeSync
if (!karaokeJs.includes('window.updateKaraokeSync =')) {
  karaokeJs = karaokeJs.replace(
    'window.handleKaraokeTimeUpdate = handleKaraokeTimeUpdate;',
    'window.handleKaraokeTimeUpdate = handleKaraokeTimeUpdate;\nwindow.updateKaraokeSync = handleKaraokeTimeUpdate;'
  );
}

// Convertir de regreso a CRLF si correspondía
if (karaokeUsesCRLF) karaokeJs = karaokeJs.replace(/\n/g, '\r\n');
fs.writeFileSync(karaokeJsPath, karaokeJs, 'utf8');
console.log('✅ js/karaoke.js procesado con éxito.');

// ============================================================================
// 2. js/app.js
// ============================================================================
let appJs = fs.readFileSync(appJsPath, 'utf8');
const appUsesCRLF = appJs.includes('\r\n');
if (appUsesCRLF) appJs = appJs.replace(/\r\n/g, '\n');

// A. Inyectar window.stopAllAudioAndTimers en app.js
if (!appJs.includes('window.stopAllAudioAndTimers = function() {')) {
  const insertTarget = 'window.toggleMainStageAudio = function() {';
  const stopFnCode = `window.stopAllAudioAndTimers = function() {
    if (window.karaokeInterval) { clearInterval(window.karaokeInterval); window.karaokeInterval = null; }
    if (window.karaokeRaf) { cancelAnimationFrame(window.karaokeRaf); window.karaokeRaf = null; }
    if (window._karaokePlaybackTimer) { clearInterval(window._karaokePlaybackTimer); window._karaokePlaybackTimer = null; }
    document.querySelectorAll('audio, video').forEach(media => {
      try { media.pause(); } catch(e){}
    });
    if (window.ytPlayer && typeof window.ytPlayer.pauseVideo === 'function') {
      try { window.ytPlayer.pauseVideo(); } catch(e){}
    }
    if (window._holoYtPlayer && typeof window._holoYtPlayer.pauseVideo === 'function') {
      try { window._holoYtPlayer.pauseVideo(); } catch(e){}
    }
    document.querySelectorAll('iframe').forEach(ifr => {
      try {
        if (ifr.contentWindow) {
          ifr.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      } catch(e){}
    });
  };\n\n    `;
  appJs = appJs.replace(insertTarget, stopFnCode + insertTarget);
  console.log('✅ Inyectado window.stopAllAudioAndTimers en js/app.js');
}

// B. En window.toggleMainStageAudio: Pausa instantánea con stopAllAudioAndTimers
const pauseBlockTarget = `      if (window._isHoloStagePlaying) {
        // PAUSAR: Detener inmediatamente avance y congelar en la estrofa actual
        window._isHoloStagePlaying = false;
        if (window._karaokePlaybackTimer) {
          clearInterval(window._karaokePlaybackTimer);
          window._karaokePlaybackTimer = null;
        }
        if (window._holoYtPlayer && typeof window._holoYtPlayer.pauseVideo === 'function') {
          try { window._holoYtPlayer.pauseVideo(); } catch (e) {}
        }
        if (ytIframe && ytIframe.contentWindow) {
          try {
            ytIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          } catch (e) {}
        }
        const nativeAudio = document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
        if (nativeAudio) {
          try { nativeAudio.pause(); } catch (e) {}
        }
        if (playIcon) playIcon.textContent = '▶️';
        if (eq) eq.classList.remove('holo-eq-playing');
        waveBars.forEach(b => b.style.animationPlayState = 'paused');
      }`;

const pauseBlockReplacement = `      if (window._isHoloStagePlaying) {
        // PAUSAR: Detener inmediatamente avance y congelar en la estrofa actual (Pausa Instantánea 0ms)
        if (typeof window.stopAllAudioAndTimers === 'function') {
          window.stopAllAudioAndTimers();
        }
        window._isHoloStagePlaying = false;
        if (window._karaokePlaybackTimer) {
          clearInterval(window._karaokePlaybackTimer);
          window._karaokePlaybackTimer = null;
        }
        if (playIcon) playIcon.textContent = '▶️';
        if (eq) eq.classList.remove('holo-eq-playing');
        waveBars.forEach(b => b.style.animationPlayState = 'paused');
      }`;

if (appJs.includes(pauseBlockTarget)) {
  appJs = appJs.replace(pauseBlockTarget, pauseBlockReplacement);
  console.log('✅ Reemplazado bloque de pausa en toggleMainStageAudio');
} else {
  console.log('⚠️ No se encontró coincidencia exacta para pauseBlockTarget en appJs');
}

// C. Al reproducir con YouTube activo: audio.pause() y audio.src = ""
const ytPlayTarget = `        if (window._holoYtPlayer && typeof window._holoYtPlayer.playVideo === 'function' && window._holoPlayerFallbackStage < 2) {
          try {
            window._holoYtPlayer.unMute();
            window._holoYtPlayer.setVolume(100);
            window._holoYtPlayer.playVideo();
          } catch (e) {}
        }`;

const ytPlayReplacement = `        if (window._holoYtPlayer && typeof window._holoYtPlayer.playVideo === 'function' && window._holoPlayerFallbackStage < 2) {
          try {
            window._holoYtPlayer.unMute();
            window._holoYtPlayer.setVolume(100);
            window._holoYtPlayer.playVideo();
            // Asegura que el tag <audio> y el reproductor de YouTube NUNCA suenen al mismo tiempo
            document.querySelectorAll('audio').forEach(a => {
              try { a.pause(); a.src = ""; a.removeAttribute('src'); } catch (e) {}
            });
          } catch (e) {}
        }`;

if (appJs.includes(ytPlayTarget)) {
  appJs = appJs.replace(ytPlayTarget, ytPlayReplacement);
  console.log('✅ Reemplazado bloque de reproducción YouTube con silenciado de audio en appJs');
} else {
  console.log('⚠️ No se encontró coincidencia exacta para ytPlayTarget en appJs');
}

// D. En startKaraokeSyncTimer: 80 ms
if (appJs.includes('}, 100);')) {
  appJs = appJs.replace('      }, 100);', '      }, 80);');
  console.log('✅ Frecuencia de sincronización ajustada a 80 ms en appJs');
}

// E. En fetchLrclibSyncedLyrics: Selección por duración más cercana con reduce y Math.abs
const lrclibTarget = `          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const bestSynced = data.find(i => i.syncedLyrics);
            if (bestSynced && bestSynced.syncedLyrics) {
              const parsed = window.parseLrcToSyncedLyrics(bestSynced.syncedLyrics);
              if (parsed.length > 0) return { lyrics: parsed, isLrc: true };
            }
            const bestPlain = data.find(i => i.plainLyrics) || data[0];
            if (bestPlain && bestPlain.plainLyrics) {
              const fallback = window.parseRawLyricsIntoStanzas(bestPlain.plainLyrics, totalDurationSec, true);
              if (fallback.length > 0) return { lyrics: fallback, isLrc: false, isApproximated: true };
            }
          }`;

const lrclibReplacement = `          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const songDurationSec = totalDurationSec || 225;
            const syncedResults = data.filter(i => i.syncedLyrics);
            if (syncedResults.length > 0) {
              const bestMatch = syncedResults.reduce((prev, curr) =>
                Math.abs(curr.duration - songDurationSec) < Math.abs(prev.duration - songDurationSec) ? curr : prev
              );
              if (bestMatch && bestMatch.syncedLyrics) {
                const parsed = window.parseLrcToSyncedLyrics(bestMatch.syncedLyrics);
                if (parsed.length > 0) return { lyrics: parsed, isLrc: true };
              }
            }
            const bestPlain = data.find(i => i.plainLyrics) || data[0];
            if (bestPlain && bestPlain.plainLyrics) {
              const fallback = window.parseRawLyricsIntoStanzas(bestPlain.plainLyrics, totalDurationSec, true);
              if (fallback.length > 0) return { lyrics: fallback, isLrc: false, isApproximated: true };
            }
          }`;

if (appJs.includes(lrclibTarget)) {
  appJs = appJs.replace(lrclibTarget, lrclibReplacement);
  console.log('✅ Reemplazado bloque LRCLIB por duración más cercana en appJs');
} else {
  console.log('⚠️ No se encontró coincidencia exacta para lrclibTarget en appJs');
}

// F. En loadSongToKaraoke: Watchdog de 2.5s (2500 ms)
if (appJs.includes('}, 3200);')) {
  appJs = appJs.replace('        }, 3200);', '        }, 2500);');
  console.log('✅ Watchdog ajustado a 2500 ms (2.5s)');
}

// G. Carátula hdArtwork asignada a thumbnail de controles y círculo central del holograma
const artworkTarget = `        // 5.1 Variables de sesión activa del reproductor
        window._currentPlayingTrackName = trackName;
        window._currentPlayingArtistName = artistName;
        window._currentPlayingPreviewUrl = previewUrl || '';
        window._currentPlayingArtwork = hdArtwork;`;

const artworkReplacement = `        // 5.1 Variables de sesión activa del reproductor
        window._currentPlayingTrackName = trackName;
        window._currentPlayingArtistName = artistName;
        window._currentPlayingPreviewUrl = previewUrl || '';
        window._currentPlayingArtwork = hdArtwork;
        const ctrlArtwork = document.getElementById('holoStageControlsArtwork');
        if (ctrlArtwork) ctrlArtwork.src = hdArtwork;
        const fallbackArtworkEl = document.getElementById('holoAudioFallbackArtwork');
        if (fallbackArtworkEl) fallbackArtworkEl.src = hdArtwork;`;

if (appJs.includes(artworkTarget)) {
  appJs = appJs.replace(artworkTarget, artworkReplacement);
  console.log('✅ Reemplazado bloque de asignación de carátulas en loadSongToKaraoke');
}

// Convertir de regreso a CRLF si correspondía
if (appUsesCRLF) appJs = appJs.replace(/\n/g, '\r\n');
fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✅ js/app.js procesado con éxito.');

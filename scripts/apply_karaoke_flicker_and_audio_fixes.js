const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const appJsPath = path.join(baseDir, 'js', 'app.js');
const karaokeJsPath = path.join(baseDir, 'js', 'karaoke.js');
const styleCssPath = path.join(baseDir, 'css', 'style.css');

console.log('--- Applying Karaoke Flicker, Audio Loop & Overlap Fixes ---');

// 1. EDIT APP.JS
let appJs = fs.readFileSync(appJsPath, 'utf8');

// A. Stage 1 fallback timeout from 2500ms to 8000ms
const targetWatchdogAlt = `console.warn('[HoloPlayer Watchdog] Video alternativo tampoco cargó en 3s. Pasando a Modo Audio Garantizado...');
              window.handleHoloPlayerError('ALT_TIMEOUT');
            }
          }, 2500);`;
const replaceWatchdogAlt = `console.warn('[HoloPlayer Watchdog] Video alternativo tampoco cargó en 8s. Pasando a Modo Audio Garantizado...');
              window.handleHoloPlayerError('ALT_TIMEOUT');
            }
          }, 8000);`;
if (appJs.includes(targetWatchdogAlt)) {
  appJs = appJs.replace(targetWatchdogAlt, replaceWatchdogAlt);
  console.log('✅ app.js: Watchdog alt updated to 8000ms');
} else {
  console.warn('⚠️ app.js: targetWatchdogAlt not found directly, trying normalized line endings...');
  const normApp = appJs.replace(/\r\n/g, '\n');
  const normTarget = targetWatchdogAlt.replace(/\r\n/g, '\n');
  const normReplace = replaceWatchdogAlt.replace(/\r\n/g, '\n');
  if (normApp.includes(normTarget)) {
    appJs = normApp.replace(normTarget, normReplace).replace(/\n/g, '\r\n');
    console.log('✅ app.js: Watchdog alt updated (normalized)');
  } else {
    console.error('❌ app.js: Failed to find targetWatchdogAlt');
  }
}

// B. Stage 2 YouTube Cutoff in handleHoloPlayerError: about:blank
const targetStage2Cutoff = `// Ocultar iframe con restricción
      const iframe = document.getElementById('musicHoloYoutubeIframe');
      if (iframe) {
        iframe.style.display = 'none';
        try {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } catch (_) {}
      }`;
const replaceStage2Cutoff = `// Ocultar iframe con restricción y cortar stream completamente asignando about:blank
      const iframe = document.getElementById('musicHoloYoutubeIframe');
      if (iframe) {
        iframe.style.display = 'none';
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
          }
        } catch (_) {}
        iframe.src = 'about:blank';
      }
      if (window._holoYtPlayer && typeof window._holoYtPlayer.destroy === 'function') {
        try { window._holoYtPlayer.destroy(); } catch (_) {}
        window._holoYtPlayer = null;
      }`;
if (appJs.replace(/\r\n/g, '\n').includes(targetStage2Cutoff.replace(/\r\n/g, '\n'))) {
  appJs = appJs.replace(/\r\n/g, '\n').replace(targetStage2Cutoff.replace(/\r\n/g, '\n'), replaceStage2Cutoff.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log('✅ app.js: Stage 2 iframe about:blank cutoff applied');
} else {
  console.error('❌ app.js: targetStage2Cutoff not found');
}

// C. handleHoloPlayerStateChange: ignore buffering (state 3)
const targetBuffering = `window.handleHoloPlayerStateChange = function(state) {
      // YT.PlayerState: ENDED = 0, PLAYING = 1, PAUSED = 2, BUFFERING = 3, CUED = 5
      const isPlaying = state === 1 || (window.YT && window.YT.PlayerState && state === window.YT.PlayerState.PLAYING);`;
const replaceBuffering = `window.handleHoloPlayerStateChange = function(state) {
      // YT.PlayerState: ENDED = 0, PLAYING = 1, PAUSED = 2, BUFFERING = 3, CUED = 5
      if (state === 3) return; // Buffering de YouTube en progreso: no alterar estado ni forzar fallback
      const isPlaying = state === 1 || (window.YT && window.YT.PlayerState && state === window.YT.PlayerState.PLAYING);`;
if (appJs.replace(/\r\n/g, '\n').includes(targetBuffering.replace(/\r\n/g, '\n'))) {
  appJs = appJs.replace(/\r\n/g, '\n').replace(targetBuffering.replace(/\r\n/g, '\n'), replaceBuffering.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log('✅ app.js: handleHoloPlayerStateChange buffering guard applied');
} else {
  console.error('❌ app.js: targetBuffering not found');
}

// D. Continuous audio progression in startKaraokeSyncTimer
const targetNativeProg = `// 2. Lectura en tiempo real en modo audio nativo (<audio id="mastereng-audio">, etc.)
        const dur = window._currentTrackTotalDuration || 225;
        const nativeAudio = document.getElementById('mastereng-audio') || document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
        if (currentTime === null && nativeAudio && !isNaN(nativeAudio.currentTime) && (!nativeAudio.paused || window._holoPlayerFallbackStage >= 2)) {
          currentTime = nativeAudio.currentTime + window.lyricsOffset;
        }`;
const replaceNativeProg = `// 2. Lectura en tiempo real en modo audio nativo (<audio id="mastereng-audio">, etc.)
        const dur = window._currentTrackTotalDuration || 225;
        const nativeAudio = document.getElementById('mastereng-audio') || document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
        if (currentTime === null && nativeAudio && (!nativeAudio.paused || window._holoPlayerFallbackStage >= 2)) {
          if (window._holoPlayerFallbackStage >= 2) {
            const elapsed = (Date.now() - (window._currentTrackStartTime || Date.now())) / 1000;
            currentTime = Math.min(dur, Math.max(0, elapsed + (window.lyricsOffset || 0)));
          } else if (!isNaN(nativeAudio.currentTime)) {
            currentTime = nativeAudio.currentTime + window.lyricsOffset;
          }
        }`;
if (appJs.replace(/\r\n/g, '\n').includes(targetNativeProg.replace(/\r\n/g, '\n'))) {
  appJs = appJs.replace(/\r\n/g, '\n').replace(targetNativeProg.replace(/\r\n/g, '\n'), replaceNativeProg.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log('✅ app.js: Continuous audio progression in startKaraokeSyncTimer applied');
} else {
  console.error('❌ app.js: targetNativeProg not found');
}

// E. KaraokeSyncEngine.getCurrentPlaybackTime continuous progression in stage >= 2
const targetEngineCurTime = `const audioEl = document.getElementById('mastereng-audio');
        if (audioEl && !audioEl.paused) {
          return audioEl.currentTime || 0;
        }`;
const replaceEngineCurTime = `const audioEl = document.getElementById('mastereng-audio');
        if (audioEl && !audioEl.paused) {
          if (window._holoPlayerFallbackStage >= 2) {
            const dur = window._currentTrackTotalDuration || 225;
            const elapsed = (Date.now() - (window._currentTrackStartTime || Date.now())) / 1000;
            return Math.min(dur, Math.max(0, elapsed));
          }
          return audioEl.currentTime || 0;
        }`;
if (appJs.replace(/\r\n/g, '\n').includes(targetEngineCurTime.replace(/\r\n/g, '\n'))) {
  appJs = appJs.replace(/\r\n/g, '\n').replace(targetEngineCurTime.replace(/\r\n/g, '\n'), replaceEngineCurTime.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log('✅ app.js: KaraokeSyncEngine.getCurrentPlaybackTime continuous progression applied');
} else {
  console.error('❌ app.js: targetEngineCurTime not found');
}

// F. seekToStanza update _currentTrackStartTime
const targetSeekStanza = `window._currentTrackCurrentTime = targetSec;
      window.lastKnownPlaybackTime = targetSec;`;
const replaceSeekStanza = `window._currentTrackCurrentTime = targetSec;
      window._currentTrackStartTime = Date.now() - (targetSec * 1000);
      window.lastKnownPlaybackTime = targetSec;`;
if (appJs.replace(/\r\n/g, '\n').includes(targetSeekStanza.replace(/\r\n/g, '\n'))) {
  appJs = appJs.replace(/\r\n/g, '\n').replace(targetSeekStanza.replace(/\r\n/g, '\n'), replaceSeekStanza.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log('✅ app.js: seekToStanza _currentTrackStartTime update applied');
} else {
  console.error('❌ app.js: targetSeekStanza not found');
}

// G. resetSongPlayerSession: about:blank for iframes and complete audio reset
const targetResetSession = `// Detener iframes enviando postMessage
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
      }`;
const replaceResetSession = `// Detener iframes enviando postMessage y cortando el stream con about:blank para cero solapamiento
      const holoIframe = document.getElementById('musicHoloYoutubeIframe');
      if (holoIframe) {
        try {
          if (holoIframe.contentWindow) {
            holoIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
            holoIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          }
        } catch (_) {}
        holoIframe.src = 'about:blank';
      }
      const mainIframe = document.getElementById('musicYouTubeIframe');
      if (mainIframe) {
        try {
          if (mainIframe.contentWindow) {
            mainIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
          }
        } catch (_) {}
        mainIframe.src = 'about:blank';
      }

      // Pausar y resetear todos los reproductores de audio nativos
      document.querySelectorAll('audio').forEach(audioEl => {
        try {
          audioEl.pause();
          audioEl.currentTime = 0;
          audioEl.removeAttribute('src');
          audioEl.load();
        } catch (_) {}
      });
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
      }`;
if (appJs.replace(/\r\n/g, '\n').includes(targetResetSession.replace(/\r\n/g, '\n'))) {
  appJs = appJs.replace(/\r\n/g, '\n').replace(targetResetSession.replace(/\r\n/g, '\n'), replaceResetSession.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log('✅ app.js: resetSongPlayerSession about:blank and audio cleanup applied');
} else {
  console.error('❌ app.js: targetResetSession not found');
}

// H. Watchdog in loadSongToKaraoke: increase to 10000ms
const targetWatchdogMain = `// Watchdog de 3.2 segundos para detectar bloqueos de incrustación o falta de inicio
        if (window._holoPlayerWatchdogTimer) clearTimeout(window._holoPlayerWatchdogTimer);
        window._holoPlayerWatchdogTimer = setTimeout(() => {
          const ytPlayer = window._holoYtPlayer;
          const pState = (ytPlayer && typeof ytPlayer.getPlayerState === 'function') ? ytPlayer.getPlayerState() : null;
          if (pState === 1 || pState === 3 || window._holoPlayerHasStartedPlaying) return;
          if (!window._holoPlayerHasStartedPlaying && window._isHoloStagePlaying && window._holoPlayerFallbackStage === 0) {
            console.warn('[YouTube Watchdog] Video restringido o no inició en 3s, iniciando fallback...');
            if (typeof window.handleHoloPlayerError === 'function') {
              window.handleHoloPlayerError('TIMEOUT_OR_BLOCKED');
            }
          }
        }, 3200);`;
const replaceWatchdogMain = `// Watchdog de 10 segundos para detectar bloqueos de incrustación o falta de inicio
        if (window._holoPlayerWatchdogTimer) clearTimeout(window._holoPlayerWatchdogTimer);
        window._holoPlayerWatchdogTimer = setTimeout(() => {
          const ytPlayer = window._holoYtPlayer;
          const pState = (ytPlayer && typeof ytPlayer.getPlayerState === 'function') ? ytPlayer.getPlayerState() : null;
          if (pState === 1 || pState === 3 || window._holoPlayerHasStartedPlaying) return;
          if (!window._holoPlayerHasStartedPlaying && window._isHoloStagePlaying && window._holoPlayerFallbackStage === 0) {
            console.warn('[YouTube Watchdog] Video restringido o no inició en 10s, iniciando fallback...');
            if (typeof window.handleHoloPlayerError === 'function') {
              window.handleHoloPlayerError('TIMEOUT_OR_BLOCKED');
            }
          }
        }, 10000);`;
if (appJs.replace(/\r\n/g, '\n').includes(targetWatchdogMain.replace(/\r\n/g, '\n'))) {
  appJs = appJs.replace(/\r\n/g, '\n').replace(targetWatchdogMain.replace(/\r\n/g, '\n'), replaceWatchdogMain.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log('✅ app.js: loadSongToKaraoke watchdog increased to 10000ms');
} else {
  console.error('❌ app.js: targetWatchdogMain not found');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');


// 2. EDIT KARAOKE.JS
let karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');

// A. selectMusicTrack route through loadSongToKaraoke
const targetSelectTrack = `      currentMusicIndex = idx;
      currentKaraokeStanzaIndex = 0;
      stopMusicKaraokeSync();

      const track = MUSIC_SESSION_TRACKS[idx];
      if (!track) return;`;
const replaceSelectTrack = `      currentMusicIndex = idx;
      currentKaraokeStanzaIndex = 0;

      const track = MUSIC_SESSION_TRACKS[idx];
      if (!track) return;

      if (typeof window.loadSongToKaraoke === 'function') {
        const durSec = (track.duration && track.duration.includes(':'))
          ? (parseInt(track.duration.split(':')[0], 10) * 60 + parseInt(track.duration.split(':')[1], 10))
          : 225;
        window.loadSongToKaraoke(track.title, track.artist, track.previewUrl || '', track.artwork || '', durSec);
        return;
      }

      stopMusicKaraokeSync();`;
if (karaokeJs.replace(/\r\n/g, '\n').includes(targetSelectTrack.replace(/\r\n/g, '\n'))) {
  karaokeJs = karaokeJs.replace(/\r\n/g, '\n').replace(targetSelectTrack.replace(/\r\n/g, '\n'), replaceSelectTrack.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log('✅ karaoke.js: selectMusicTrack loadSongToKaraoke forwarding applied');
} else {
  console.error('❌ karaoke.js: targetSelectTrack not found');
}

// B. handleKaraokeTimeUpdate: delegate cleanly to KaraokeSyncEngine if active
const targetHandleUpdate = `    function handleKaraokeTimeUpdate(currentTime) {
      const lyrics = activeLyricsList;
      if (!lyrics || lyrics.length === 0) return;`;
const replaceHandleUpdate = `    function handleKaraokeTimeUpdate(currentTime) {
      if (window.KaraokeSyncEngine && window.KaraokeSyncEngine.stanzas && window.KaraokeSyncEngine.stanzas.length > 0) {
        const timeToSync = (typeof currentTime === 'number' && !isNaN(currentTime))
          ? currentTime
          : window.KaraokeSyncEngine.getCurrentPlaybackTime();
        window.KaraokeSyncEngine.syncFrame(timeToSync, false);
        window.KaraokeSyncEngine.updateSeekBarUI(timeToSync);
        return;
      }

      const lyrics = activeLyricsList;
      if (!lyrics || lyrics.length === 0) return;`;
if (karaokeJs.replace(/\r\n/g, '\n').includes(targetHandleUpdate.replace(/\r\n/g, '\n'))) {
  karaokeJs = karaokeJs.replace(/\r\n/g, '\n').replace(targetHandleUpdate.replace(/\r\n/g, '\n'), replaceHandleUpdate.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log('✅ karaoke.js: handleKaraokeTimeUpdate KaraokeSyncEngine delegation applied');
} else {
  console.error('❌ karaoke.js: targetHandleUpdate not found');
}

// C. syncKaraokeToTime: delegate to KaraokeSyncEngine
const targetSyncToTime = `    function syncKaraokeToTime() {
      if (!isKaraokeSyncRunning) return;
      const lyrics = activeLyricsList;
      if (!lyrics || lyrics.length === 0) return;`;
const replaceSyncToTime = `    function syncKaraokeToTime() {
      if (!isKaraokeSyncRunning) return;
      if (window.KaraokeSyncEngine && window.KaraokeSyncEngine.stanzas && window.KaraokeSyncEngine.stanzas.length > 0) {
        const t = window.KaraokeSyncEngine.getCurrentPlaybackTime();
        window.KaraokeSyncEngine.syncFrame(t, false);
        window.KaraokeSyncEngine.updateSeekBarUI(t);
        return;
      }
      const lyrics = activeLyricsList;
      if (!lyrics || lyrics.length === 0) return;`;
if (karaokeJs.replace(/\r\n/g, '\n').includes(targetSyncToTime.replace(/\r\n/g, '\n'))) {
  karaokeJs = karaokeJs.replace(/\r\n/g, '\n').replace(targetSyncToTime.replace(/\r\n/g, '\n'), replaceSyncToTime.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log('✅ karaoke.js: syncKaraokeToTime KaraokeSyncEngine delegation applied');
} else {
  console.error('❌ karaoke.js: targetSyncToTime not found');
}

// D. startMusicKaraokeSync: avoid duplicate interval if KaraokeSyncEngine is active
const targetStartSync = `      // Sincronización inmediata
      syncKaraokeToTime();

      // Intervalo de alta frecuencia de 250ms con polling ultra-rápido a 100ms
      musicKaraokeInterval = setInterval(() => {
        if (!isKaraokeSyncRunning) return;
        syncKaraokeToTime();
      }, 100);`;
const replaceStartSync = `      // Sincronización inmediata
      syncKaraokeToTime();

      // Si KaraokeSyncEngine ya está activo con su propio bucle rAF, evitar bucles conflictivos
      if (window.KaraokeSyncEngine && window.KaraokeSyncEngine.stanzas && window.KaraokeSyncEngine.stanzas.length > 0) {
        return;
      }

      // Intervalo de alta frecuencia de 250ms con polling ultra-rápido a 100ms
      musicKaraokeInterval = setInterval(() => {
        if (!isKaraokeSyncRunning) return;
        syncKaraokeToTime();
      }, 100);`;
if (karaokeJs.replace(/\r\n/g, '\n').includes(targetStartSync.replace(/\r\n/g, '\n'))) {
  karaokeJs = karaokeJs.replace(/\r\n/g, '\n').replace(targetStartSync.replace(/\r\n/g, '\n'), replaceStartSync.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log('✅ karaoke.js: startMusicKaraokeSync loop deduplication applied');
} else {
  console.error('❌ karaoke.js: targetStartSync not found');
}

fs.writeFileSync(karaokeJsPath, karaokeJs, 'utf8');

console.log('All file updates applied successfully!');

const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');

let appJs = fs.readFileSync(appJsPath, 'utf8');
let karaokeJs = fs.readFileSync(karaokeJsPath, 'utf8');

// 1. Eliminar selectMusicTrack(0) de DOMContentLoaded en app.js y forzar silencio inicial
const oldDomContentLoaded = `    document.addEventListener('DOMContentLoaded', () => {
      setupDraggableWidget('draggableRobotWidget', 'saved_robot_pos');
      setupDraggableWidget('draggableRouletteWidget', 'saved_roulette_pos');
      updateCoverFlowVisuals();
      setupCoverFlowGestures();
      initGoogleIdentityServices();

      renderMusicTracksList();
      selectMusicTrack(0);
      renderStorySelector();
      renderLearningModules();`;

const newDomContentLoaded = `    document.addEventListener('DOMContentLoaded', () => {
      // Silencio total garantizado en el menú de inicio
      if (typeof window.stopAllAudioAndTimers === 'function') {
        window.stopAllAudioAndTimers();
      }
      setupDraggableWidget('draggableRobotWidget', 'saved_robot_pos');
      setupDraggableWidget('draggableRouletteWidget', 'saved_roulette_pos');
      updateCoverFlowVisuals();
      setupCoverFlowGestures();
      initGoogleIdentityServices();

      renderMusicTracksList();
      renderStorySelector();
      renderLearningModules();`;

if (appJs.includes(oldDomContentLoaded)) {
  appJs = appJs.replace(oldDomContentLoaded, newDomContentLoaded);
  console.log('✅ app.js: selectMusicTrack(0) eliminado de DOMContentLoaded y silencio forzado.');
} else {
  // Manejo flexible por saltos de línea CRLF/LF
  const oldRegex = /document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{[\s\S]*?renderMusicTracksList\(\);[\s\S]*?selectMusicTrack\(0\);[\s\S]*?renderStorySelector\(\);/;
  if (oldRegex.test(appJs)) {
    appJs = appJs.replace(oldRegex, `document.addEventListener('DOMContentLoaded', () => {
      if (typeof window.stopAllAudioAndTimers === 'function') {
        window.stopAllAudioAndTimers();
      }
      setupDraggableWidget('draggableRobotWidget', 'saved_robot_pos');
      setupDraggableWidget('draggableRouletteWidget', 'saved_roulette_pos');
      updateCoverFlowVisuals();
      setupCoverFlowGestures();
      initGoogleIdentityServices();

      renderMusicTracksList();
      renderStorySelector();`);
    console.log('✅ app.js: selectMusicTrack(0) eliminado de DOMContentLoaded mediante regex.');
  } else {
    console.error('❌ Error: no se encontró bloque DOMContentLoaded en app.js');
  }
}

// 2. Fortalecer stopAllAudioAndTimers en app.js
const oldStopAllAudio = `    window.stopAllAudioAndTimers = function() {
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
  };`;

const newStopAllAudio = `    window.stopAllAudioAndTimers = function() {
    window._isHoloStagePlaying = false;
    window._userInitiatedMusicPlayback = false;
    if (window.karaokeInterval) { clearInterval(window.karaokeInterval); window.karaokeInterval = null; }
    if (window.karaokeRaf) { cancelAnimationFrame(window.karaokeRaf); window.karaokeRaf = null; }
    if (window._karaokePlaybackTimer) { clearInterval(window._karaokePlaybackTimer); window._karaokePlaybackTimer = null; }
    document.querySelectorAll('audio, video').forEach(media => {
      try { media.pause(); } catch(e){}
    });
    if (window.ytPlayer && typeof window.ytPlayer.pauseVideo === 'function') {
      try { window.ytPlayer.pauseVideo(); } catch(e){}
    }
    if (window.ytMusicPlayer && typeof window.ytMusicPlayer.pauseVideo === 'function') {
      try { window.ytMusicPlayer.pauseVideo(); } catch(e){}
    }
    if (window._holoYtPlayer && typeof window._holoYtPlayer.pauseVideo === 'function') {
      try { window._holoYtPlayer.pauseVideo(); } catch(e){}
    }
    if (typeof window.stopMusicKaraokeSync === 'function') {
      try { window.stopMusicKaraokeSync(); } catch(e){}
    }
    document.querySelectorAll('iframe').forEach(ifr => {
      try {
        if (ifr.contentWindow) {
          ifr.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      } catch(e){}
    });
  };`;

if (appJs.includes(oldStopAllAudio)) {
  appJs = appJs.replace(oldStopAllAudio, newStopAllAudio);
  console.log('✅ app.js: stopAllAudioAndTimers actualizado para pausar ytMusicPlayer y resetear estado.');
} else {
  console.log('⚠️ Reemplazo con regex para stopAllAudioAndTimers...');
  const stopRegex = /window\.stopAllAudioAndTimers\s*=\s*function\(\)\s*\{[\s\S]*?document\.querySelectorAll\('iframe'\)[\s\S]*?\};\s*};/;
  // Alternativamente reemplazamos el inicio de la función
  appJs = appJs.replace(/window\.stopAllAudioAndTimers\s*=\s*function\(\)\s*\{/, `window.stopAllAudioAndTimers = function() {\n    window._isHoloStagePlaying = false;\n    window._userInitiatedMusicPlayback = false;\n    if (window.ytMusicPlayer && typeof window.ytMusicPlayer.pauseVideo === 'function') { try { window.ytMusicPlayer.pauseVideo(); } catch(e){} }\n    if (typeof window.stopMusicKaraokeSync === 'function') { try { window.stopMusicKaraokeSync(); } catch(e){} }`);
  console.log('✅ app.js: stopAllAudioAndTimers extendido.');
}

// 3. Asegurar que goToHomePortals detenga audio al regresar al hub
appJs = appJs.replace(/function goToHomePortals\(\)\s*\{/, `function goToHomePortals() {\n      if (typeof window.stopAllAudioAndTimers === 'function') window.stopAllAudioAndTimers();`);

// 4. Asegurar que showView detenga audio si no es view-music
appJs = appJs.replace(/if\s*\(targetId\s*!==\s*'view-music'\s*&&\s*typeof pauseYouTubePlayer === 'function'\)\s*\{\s*pauseYouTubePlayer\(\);\s*\}/, `if (targetId !== 'view-music') {\n        if (typeof window.stopAllAudioAndTimers === 'function') {\n          window.stopAllAudioAndTimers();\n        } else if (typeof pauseYouTubePlayer === 'function') {\n          pauseYouTubePlayer();\n        }\n      }`);

// 5. En karaoke.js: onYouTubePlayerReady NO debe hacer autoplay salvo que sea iniciado explícitamente
karaokeJs = karaokeJs.replace(/function onYouTubePlayerReady\(event\)\s*\{[\s\S]*?if\s*\(event\s*&&\s*event\.target\)\s*\{[\s\S]*?event\.target\.playVideo\(\);[\s\S]*?\}\s*\}\s*catch\s*\(_\)\s*\{\}/, `function onYouTubePlayerReady(event) {
      console.log('✅ [YOUTUBE-API] Reproductor de Music Session listo');
      try {
        if (event && event.target) {
          event.target.unMute();
          event.target.setVolume(100);
          if (window._isHoloStagePlaying || window._userInitiatedMusicPlayback) {
            event.target.playVideo();
          } else {
            if (typeof event.target.pauseVideo === 'function') {
              event.target.pauseVideo();
            }
          }
        }
      } catch (_) {}`);

// 6. En karaoke.js: marcar _userInitiatedMusicPlayback = true al seleccionar pista
karaokeJs = karaokeJs.replace(/function selectMusicTrack\(idx\)\s*\{/, `function selectMusicTrack(idx) {\n      window._userInitiatedMusicPlayback = true;`);

fs.writeFileSync(appJsPath, appJs, 'utf8');
fs.writeFileSync(karaokeJsPath, karaokeJs, 'utf8');

console.log('✨ Modificaciones guardadas exitosamente en app.js y karaoke.js');

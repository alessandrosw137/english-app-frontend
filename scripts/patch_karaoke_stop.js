const fs = require('fs');
const path = require('path');

const karaokeJsPath = path.join(__dirname, '..', 'js', 'karaoke.js');
let k = fs.readFileSync(karaokeJsPath, 'utf8');

const regex = /window\.stopAllAudioAndTimers\s*=\s*function\(\)\s*\{[\s\S]*?document\.querySelectorAll\('iframe'\)[\s\S]*?\};\s*\}\s*\);\s*\};?/;

const replacement = `window.stopAllAudioAndTimers = function() {
  window._isHoloStagePlaying = false;
  window._userInitiatedMusicPlayback = false;
  if (window.ytMusicPlayer && typeof window.ytMusicPlayer.pauseVideo === 'function') {
    try { window.ytMusicPlayer.pauseVideo(); } catch(e){}
  }
  if (typeof window.stopMusicKaraokeSync === 'function') {
    try { window.stopMusicKaraokeSync(); } catch(e){}
  }
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

if (regex.test(k)) {
  k = k.replace(regex, replacement);
  fs.writeFileSync(karaokeJsPath, k, 'utf8');
  console.log('✅ karaoke.js stopAllAudioAndTimers replaced successfully with regex');
} else {
  // Let's check last lines
  const idx = k.lastIndexOf('window.stopAllAudioAndTimers = function() {');
  if (idx !== -1) {
    k = k.substring(0, idx) + replacement + '\n';
    fs.writeFileSync(karaokeJsPath, k, 'utf8');
    console.log('✅ karaoke.js stopAllAudioAndTimers replaced at last index');
  } else {
    console.error('❌ Could not find window.stopAllAudioAndTimers in karaoke.js');
  }
}

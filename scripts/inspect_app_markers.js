const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'ENGLISH-', 'js', 'app.js');
const appJs = fs.readFileSync(appPath, 'utf8');

const markers = ['openPortalModules', 'navigateToView', 'window.navigateTo', 'resizeWorld3DFullscreen', 'syncTopBackBtnVisibility', 'returnToMusicSearch', 'goBackToMusicSearch'];

markers.forEach(m => {
  let idx = 0;
  let count = 0;
  while ((idx = appJs.indexOf(m, idx)) !== -1) {
    count++;
    const lineStart = appJs.lastIndexOf('\n', idx);
    const lineEnd = appJs.indexOf('\n', idx);
    console.log(`[${m} #${count}]: ${appJs.slice(lineStart + 1, Math.min(lineStart + 120, lineEnd))}`);
    idx += m.length;
  }
  if (count === 0) console.log(`[${m}]: NOT FOUND`);
});

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'ENGLISH-', 'css', 'style.css');
const css = fs.readFileSync(cssPath, 'utf8');

const markers = ['view-worldtour', 'world3dFloatingBackBtn', 'canvas-container', 'emergency-nav-bar', 'btn-install-share-app'];
markers.forEach(m => {
  let idx = 0;
  let count = 0;
  while ((idx = css.indexOf(m, idx)) !== -1) {
    count++;
    const lineStart = css.lastIndexOf('\n', idx);
    const lineEnd = css.indexOf('\n', idx);
    console.log(`[${m} #${count}]: ${css.slice(lineStart + 1, Math.min(lineStart + 120, lineEnd))}`);
    idx += m.length;
  }
  if (count === 0) console.log(`[${m}]: NOT FOUND`);
});

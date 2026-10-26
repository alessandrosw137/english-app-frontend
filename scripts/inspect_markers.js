const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'ENGLISH-', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const lines = html.split(/\r?\n/);

console.log('Total lines:', lines.length);
console.log('Total bytes LF:', Buffer.byteLength(html.replace(/\r\n/g, '\n'), 'utf8'));
console.log('Total bytes CRLF:', Buffer.byteLength(html, 'utf8'));

lines.forEach((l, i) => {
  if (
    l.includes('mainHeader') ||
    l.includes('world3dFloatingBackBtn') ||
    l.includes('view-worldtour') ||
    l.includes('canvas-container') ||
    l.includes('view-music') ||
    l.includes('music-search-subview') ||
    l.includes('openPortalModules') ||
    l.includes('navigateTo =') ||
    l.includes('viewMap') ||
    l.includes('MASTER_ROOT_VIEWS')
  ) {
    console.log(`${i + 1}: ${l.slice(0, 120)}`);
  }
});

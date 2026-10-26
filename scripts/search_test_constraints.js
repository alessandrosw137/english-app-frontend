const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, '..', 'ENGLISH-', 'scripts');
const files = fs.readdirSync(scriptsDir).filter(f => f.startsWith('verify_') && f.endsWith('.js'));

const searchTerms = ['580px', 'world3dFloatingBackBtn', 'canvas-container', 'view-worldtour', 'music-view', 'headerGlobalBackBtn'];

files.forEach(f => {
  const content = fs.readFileSync(path.join(scriptsDir, f), 'utf8');
  searchTerms.forEach(term => {
    if (content.includes(term)) {
      console.log(`[${f}] mentions "${term}"`);
    }
  });
});

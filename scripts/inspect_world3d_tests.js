const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, '..', 'ENGLISH-', 'scripts');
['verify_spatial_immersion_portal.js', 'verify_world3d_engine.js'].forEach(f => {
  console.log(`=== ${f} ===`);
  const content = fs.readFileSync(path.join(scriptsDir, f), 'utf8');
  content.split(/\r?\n/).forEach((l, i) => {
    if (l.includes('world3dFloatingBackBtn') || l.includes('canvas-container')) {
      console.log(`  Line ${i+1}: ${l}`);
    }
  });
});

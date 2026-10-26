const fs = require('fs');

const rRes = fs.readFileSync('ENGLISH-/scripts/verify_render_resilience.js', 'utf8');
rRes.split('\n').forEach((l, i) => {
  if (l.includes('view-worldtour') || l.includes('display: none')) {
    console.log(`verify_render_resilience.js:${i+1} ${l}`);
  }
});

console.log('--- verify_world3d_engine.js ---');
const w3d = fs.readFileSync('ENGLISH-/scripts/verify_world3d_engine.js', 'utf8');
w3d.split('\n').forEach((l, i) => {
  if (l.includes('camera.aspect') || l.includes('renderer.setSize') || l.includes('resize') || l.includes('Listener resize')) {
    console.log(`verify_world3d_engine.js:${i+1} ${l}`);
  }
});

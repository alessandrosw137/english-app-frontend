const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

function showAround(target, before = 50, after = 2000) {
  const idx = content.indexOf(target);
  if (idx === -1) {
    console.log(`=== ${target} NOT FOUND ===`);
    return;
  }
  console.log(`=== ${target} (idx: ${idx}) ===`);
  console.log(content.slice(Math.max(0, idx - before), idx + after));
}

showAround('WORLD_TOUR_SCENARIOS =', 20, 2000);
showAround('function initThreeWorld', 20, 3000);

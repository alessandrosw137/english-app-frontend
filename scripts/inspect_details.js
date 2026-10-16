const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

function showAround(target, before = 100, after = 1500) {
  const idx = content.indexOf(target);
  if (idx === -1) {
    console.log(`=== ${target} NOT FOUND ===`);
    return;
  }
  console.log(`=== ${target} (idx: ${idx}) ===`);
  console.log(content.slice(Math.max(0, idx - before), idx + after));
}

console.log('--- 1. initWorldTourPortal JS ---');
showAround('function initWorldTourPortal', 50, 1800);

console.log('--- 2. view-worldtour HTML ---');
showAround('id="view-worldtour"', 50, 1500);

console.log('--- 3. view-home cards ---');
showAround('id="view-home"', 50, 2200);

console.log('--- 4. chatbotAvatarCanvas ---');
showAround('chatbotAvatarCanvas', 150, 1000);

console.log('--- 5. view-profile ---');
showAround('id="view-profile"', 50, 1500);

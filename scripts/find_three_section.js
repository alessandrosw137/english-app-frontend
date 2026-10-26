const fs = require('fs');

const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('// ========================================================\n    // MOTOR 3D WORLD TOUR');
const eIdx = html.indexOf('function startPortalStars()');

console.log('Three.js section start:', sIdx, 'end:', eIdx);

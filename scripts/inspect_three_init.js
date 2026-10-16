const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

const sIdx = content.indexOf('function initThreeWorld()');
const eIdx = content.indexOf('function buildThirdPersonCharacter()', sIdx);

console.log(content.substring(sIdx, eIdx));

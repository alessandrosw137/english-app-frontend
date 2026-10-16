const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

const start = content.indexOf('function buildScenario3D');
const end = content.indexOf('function buildThirdPersonCharacter');
console.log('Range:', start, end);
console.log(content.slice(start, start + 2500));

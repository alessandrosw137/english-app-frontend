const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

const idx = content.indexOf('id="view-medialab"');
console.log('view-medialab HTML:');
console.log(content.slice(idx, idx + 1800));

const jsIdx = content.indexOf('function initMediaLab');
console.log('initMediaLab JS:');
console.log(content.slice(jsIdx, jsIdx + 1500));

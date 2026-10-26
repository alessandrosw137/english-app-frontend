const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

const idx = content.indexOf('id="view-stories"');
console.log('view-stories HTML:');
console.log(content.slice(idx, idx + 1800));

const jsIdx = content.indexOf('function selectStory');
console.log('selectStory JS:');
console.log(content.slice(jsIdx, jsIdx + 1500));

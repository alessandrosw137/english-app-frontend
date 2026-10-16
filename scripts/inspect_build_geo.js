const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('function build3DObjectGeometry(obj)');
const eIdx = html.indexOf('function buildThirdPersonCharacter()');
console.log('build3DObjectGeometry sIdx:', sIdx, 'eIdx:', eIdx);
const snippet = html.substring(sIdx, eIdx);
console.log('Snippet length:', snippet.length);
console.log(snippet.substring(0, 1500));

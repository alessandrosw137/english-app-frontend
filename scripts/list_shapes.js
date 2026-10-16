const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('function build3DObjectGeometry(obj)');
const eIdx = html.indexOf('function buildThirdPersonCharacter()');
const snippet = html.substring(sIdx, eIdx);

const shapes = [];
const regex = /obj\.shape === '([^']+)'/g;
let m;
while ((m = regex.exec(snippet)) !== null) {
  shapes.push(m[1]);
}
console.log('Shapes handled in build3DObjectGeometry:', shapes);

const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

const sIdx = content.indexOf('const STORIES_DATA = [');
const eIdx = content.indexOf('// Diccionario contextual', sIdx);
const sub = content.substring(sIdx, eIdx);

const regex = /title:\s*"([^"]+)"/g;
let m;
const titles = [];
while ((m = regex.exec(sub)) !== null) {
  titles.push(m[1]);
}
console.log('Story titles in STORIES_DATA:', titles);

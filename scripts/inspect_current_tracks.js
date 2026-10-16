const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const startIdx = html.indexOf('const MUSIC_SESSION_TRACKS = [');
const endIdx = html.indexOf('let currentMediaIndex = 0;');
console.log('startIdx:', startIdx, 'endIdx:', endIdx);
const snippet = html.substring(startIdx, endIdx);

const titles = [];
const regex = /title:\s*"([^"]+)",\s*artist:\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(snippet)) !== null) {
  titles.push(`${m[1]} - ${m[2]}`);
}
console.log('Current tracks:', titles);

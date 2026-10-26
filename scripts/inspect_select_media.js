const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('function selectMediaTrack');
console.log('sIdx:', sIdx);
console.log(html.substring(sIdx, sIdx + 1500));

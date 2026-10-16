const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('<section id="view-medialab"');
const eIdx = html.indexOf('</section>', sIdx);
console.log('sIdx:', sIdx, 'eIdx:', eIdx);
console.log(html.substring(sIdx, sIdx + 1200));

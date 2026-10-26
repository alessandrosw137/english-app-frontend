const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('<section id="view-stories"');
console.log('view-stories sIdx:', sIdx);
console.log(html.substring(sIdx, sIdx + 1500));

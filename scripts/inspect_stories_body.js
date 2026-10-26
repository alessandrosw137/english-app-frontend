const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('<section id="view-stories"');
console.log(html.substring(sIdx + 600, sIdx + 2500));

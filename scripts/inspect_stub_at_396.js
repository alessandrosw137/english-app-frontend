const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = 396383;
console.log(html.substring(sIdx, sIdx + 500));

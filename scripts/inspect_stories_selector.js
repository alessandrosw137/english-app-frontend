const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('<!-- Selector de Lecturas Clásicas Reales -->');
console.log(html.substring(sIdx, sIdx + 1600));

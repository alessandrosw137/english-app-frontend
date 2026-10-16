const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(10165, 10220).map((l, i) => `${10166 + i}: ${l}`).join('\n'));

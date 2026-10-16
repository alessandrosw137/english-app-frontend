const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(2135, 2220).map((l, i) => `${2136 + i}: ${l}`).join('\n'));

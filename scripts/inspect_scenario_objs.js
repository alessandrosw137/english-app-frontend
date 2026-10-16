const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(9300, 9420).map((l, i) => `${9301 + i}: ${l}`).join('\n'));

const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(130, 240).map((l, i) => `${131 + i}: ${l}`).join('\n'));

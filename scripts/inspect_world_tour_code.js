const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(8790, 8880).map((l, i) => `${8791 + i}: ${l}`).join('\n'));

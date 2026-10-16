const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(3125, 3260).map((l, i) => `${3126 + i}: ${l}`).join('\n'));

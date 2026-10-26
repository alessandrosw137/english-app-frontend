const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(745, 865).map((l, i) => `${746 + i}: ${l}`).join('\n'));

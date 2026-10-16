const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(4345, 4375).map((l, i) => `${4346 + i}: ${l}`).join('\n'));

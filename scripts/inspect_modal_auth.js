const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(10220, 10330).map((l, i) => `${10221 + i}: ${l}`).join('\n'));

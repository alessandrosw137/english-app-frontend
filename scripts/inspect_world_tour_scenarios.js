const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(8680, 8780).map((l, i) => `${8681 + i}: ${l}`).join('\n'));

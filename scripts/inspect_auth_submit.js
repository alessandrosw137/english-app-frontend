const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(3260, 3330).map((l, i) => `${3261 + i}: ${l}`).join('\n'));

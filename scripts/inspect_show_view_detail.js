const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(3338, 3375).map((l, i) => `${3339 + i}: ${l}`).join('\n'));

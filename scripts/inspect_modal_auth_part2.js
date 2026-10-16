const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(10330, 10420).map((l, i) => `${10331 + i}: ${l}`).join('\n'));

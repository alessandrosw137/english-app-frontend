const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(9080, 9170).map((l, i) => `${9081 + i}: ${l}`).join('\n'));

const fs = require('fs');
const html = fs.readFileSync('ENGLISH-/index.html', 'utf8');

const lines = html.split('\n');
console.log('Lines 1450 to 1592:');
console.log(lines.slice(1450).join('\n'));

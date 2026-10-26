const fs = require('fs');
const html = fs.readFileSync('ENGLISH-/index.html', 'utf8');

const lines = html.split('\n');
console.log('Lines 1350 to 1450:');
console.log(lines.slice(1350, 1450).join('\n'));

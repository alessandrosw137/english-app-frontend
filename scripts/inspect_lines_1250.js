const fs = require('fs');
const html = fs.readFileSync('ENGLISH-/index.html', 'utf8');

const lines = html.split('\n');
console.log('Lines 1250 to 1350:');
console.log(lines.slice(1250, 1350).join('\n'));

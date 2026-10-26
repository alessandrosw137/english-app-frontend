const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');
const lines = content.split('\n');

console.log(lines.slice(747, 850).join('\n'));

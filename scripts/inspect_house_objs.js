const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

const start = content.indexOf('"house": {');
const end = content.indexOf('"backyard": {');
console.log(content.slice(start, end));

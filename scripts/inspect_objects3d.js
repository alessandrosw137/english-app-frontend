const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

const idx = content.indexOf('function buildInteractiveObjects3D');
console.log(content.slice(idx, idx + 3500));

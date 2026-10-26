const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');
const idx = content.indexOf('document.addEventListener("DOMContentLoaded"');
console.log(content.slice(idx - 100, idx + 400));

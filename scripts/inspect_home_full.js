const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

const idx = content.indexOf('id="view-home"');
const endIdx = content.indexOf('</section>', idx);
console.log(content.slice(idx, endIdx + 10));

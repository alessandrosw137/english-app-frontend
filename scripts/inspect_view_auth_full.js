const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

const sIdx = content.indexOf('id="view-auth"');
const eIdx = content.indexOf('</section>', sIdx);

console.log(content.substring(sIdx, eIdx + 10));

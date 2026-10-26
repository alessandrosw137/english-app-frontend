const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

const sIdx = content.indexOf('function renderProfileModal()');
const eIdx = content.indexOf('function handleModalGoogleLogin()', sIdx);

console.log(content.substring(sIdx, eIdx));

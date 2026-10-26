const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const startIdx = html.indexOf('function renderProfileModal()');
const endIdx = html.indexOf('function handleModalGoogleLogin()');
console.log(html.substring(startIdx, endIdx));

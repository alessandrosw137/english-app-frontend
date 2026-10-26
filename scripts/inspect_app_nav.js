const fs = require('fs');
const appJs = fs.readFileSync('ENGLISH-/js/app.js', 'utf8');

const idx = appJs.indexOf('window.navigateTo = function(viewId)');
console.log(appJs.slice(idx, idx + 1200));

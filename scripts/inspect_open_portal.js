const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'ENGLISH-', 'js', 'app.js');
const appJs = fs.readFileSync(appPath, 'utf8');

const idx = appJs.indexOf('window.openPortalModules = function(targetPortal)');
console.log(appJs.slice(idx - 100, idx + 1200));

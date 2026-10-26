const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'ENGLISH-', 'css', 'style.css');
const css = fs.readFileSync(cssPath, 'utf8');

const idx = css.indexOf('#world3dFloatingBackBtn {');
console.log(css.slice(idx - 100, idx + 800));

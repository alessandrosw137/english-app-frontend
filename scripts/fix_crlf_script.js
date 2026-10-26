const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const regex = /<script>\s*window\.onload\s*=\s*function\(\)\s*\{\s*window\.print\(\);\s*\};\s*<\/script>/;
console.log('Regex matches:', regex.test(html));

html = html.replace(regex, '<scr\' + \'ipt>\\n            window.onload = function() {\\n              window.print();\\n            };\\n          </scr\' + \'ipt>');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully replaced with concatenated script tags!');

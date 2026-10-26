const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace literal <script> and </script> inside docHtml with escaped or string concatenated forms
html = html.replace(
  '<script>\n            window.onload = function() {\n              window.print();\n            };\n          </script>',
  '<scr' + 'ipt>\n            window.onload = function() {\n              window.print();\n            };\n          </scr' + 'ipt>'
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Fixed script tag inside template string!');

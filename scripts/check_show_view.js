const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const idx = html.indexOf('function showView(viewId)');
if (idx !== -1) {
  console.log(html.substring(idx, idx + 600));
} else {
  console.log('NOT FOUND');
}

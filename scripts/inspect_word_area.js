const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('function inspectMusicWord');
if (sIdx !== -1) {
  console.log(html.substring(sIdx, sIdx + 1200));
} else {
  console.log('NOT FOUND');
}

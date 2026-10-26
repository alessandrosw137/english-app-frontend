const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('function renderActiveStory()');
console.log('sIdx:', sIdx);
if (sIdx !== -1) {
  console.log(html.substring(sIdx, sIdx + 1600));
}

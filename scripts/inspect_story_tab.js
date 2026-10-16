const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('id="storyTab-0"');
console.log('storyTab-0 sIdx:', sIdx);
if (sIdx !== -1) {
  console.log(html.substring(sIdx - 300, sIdx + 500));
}

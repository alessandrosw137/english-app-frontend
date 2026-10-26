const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('const illContainer = document.getElementById("storyThematicIllustration");');
console.log('illContainer sIdx:', sIdx);
if (sIdx !== -1) {
  console.log(html.substring(sIdx - 200, sIdx + 1200));
}

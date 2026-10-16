const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const regex = /function selectStory\(/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log('Found function selectStory at index:', m.index);
}

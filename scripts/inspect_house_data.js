const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const startIdx = html.indexOf('const WORLD_TOUR_SCENARIOS = {');
console.log('Found startIdx:', startIdx);
if (startIdx !== -1) {
  const snippet = html.substring(startIdx, startIdx + 3000);
  console.log(snippet.substring(0, 1500));
}

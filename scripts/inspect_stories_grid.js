const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">');
console.log('grid start:', sIdx);
const nextViewerIdx = html.indexOf('id="storyThematicIllustration"', sIdx);
console.log('nextViewerIdx:', nextViewerIdx);
console.log(html.substring(sIdx, nextViewerIdx));

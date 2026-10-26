const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('const STORIES_DATA = [');
const eIdx = html.indexOf('let currentStoryIndex = 0;');
console.log('sIdx:', sIdx, 'eIdx:', eIdx);
console.log('Snippet length:', eIdx - sIdx);

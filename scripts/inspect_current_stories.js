const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const startIdx = html.indexOf('const STORIES_DATA = [');
const endIdx = html.indexOf('let currentStoryIndex = 0;');
console.log('startIdx:', startIdx, 'endIdx:', endIdx);
const snippet = html.substring(startIdx, endIdx);

const titles = [];
const regex = /title:\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(snippet)) !== null) {
  titles.push(m[1]);
}
console.log('Current stories:', titles);

// Check if any emojis exist in STORIES_DATA snippet
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
console.log('Has emojis in STORIES_DATA:', emojiRegex.test(snippet));

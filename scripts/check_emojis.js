const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

// 1. Check in STORIES_DATA
const sIdx = html.indexOf('const STORIES_DATA = [');
const eIdx = html.indexOf('let currentStoryIndex = 0;');
const storiesData = html.substring(sIdx, eIdx);

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
console.log('Emojis in STORIES_DATA:', emojiRegex.test(storiesData));

// 2. Check in view-stories
const vStart = html.indexOf('<section id="view-stories"');
const vEnd = html.indexOf('</section>', vStart);
const viewStoriesHtml = html.substring(vStart, vEnd);
console.log('Emojis in view-stories HTML:', emojiRegex.test(viewStoriesHtml));

if (emojiRegex.test(viewStoriesHtml)) {
  const matches = viewStoriesHtml.match(new RegExp(emojiRegex.source, 'gu'));
  console.log('Found emojis in view-stories:', matches);
}

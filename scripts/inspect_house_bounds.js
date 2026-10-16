const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('"house": {');
const bIdx = html.indexOf('"backyard": {');
console.log('sIdx:', sIdx, 'bIdx:', bIdx);
const houseSnippet = html.substring(sIdx, bIdx);
console.log('House snippet length:', houseSnippet.length);

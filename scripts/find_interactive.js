const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

const matches = [...content.matchAll(/interactiveObjects\.push/g)];
console.log('interactiveObjects.push matches:', matches.length);
if (matches.length > 0) {
  const idx = matches[0].index;
  console.log(content.slice(Math.max(0, idx - 500), idx + 1000));
}

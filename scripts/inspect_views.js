const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);

const views = [];
lines.forEach((l, i) => {
  const m = l.match(/id="(view-[^"]+)"/);
  if (m) {
    views.push({ line: i + 1, id: m[1] });
  }
});
console.log('Views found:', views);

const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

function searchAll(term) {
  const lines = html.split('\n');
  const results = [];
  lines.forEach((line, idx) => {
    if (line.includes(term)) {
      results.push(`${idx + 1}: ${line.trim()}`);
    }
  });
  return results;
}

console.log('initAuthSystem references:', searchAll('initAuthSystem'));
console.log('DOMContentLoaded references:', searchAll('DOMContentLoaded'));
console.log('goToHomePortals references:', searchAll('goToHomePortals'));

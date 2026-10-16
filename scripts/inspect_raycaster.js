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

console.log('Raycaster references:', searchAll('Raycaster'));
console.log('inspectObject references:', searchAll('inspectObject'));
console.log('checkProximityToObjects references:', searchAll('checkProximityToObjects'));

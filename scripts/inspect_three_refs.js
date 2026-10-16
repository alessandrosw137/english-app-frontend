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

console.log('initThreeSimulator:', searchAll('function initThreeSimulator'));
console.log('initWorldTourPortal:', searchAll('function initWorldTourPortal'));
console.log('buildRealisticHouse:', searchAll('buildRealisticHouse'));
console.log('INTERACTIVE_HOUSE_OBJECTS:', searchAll('INTERACTIVE_HOUSE_OBJECTS'));

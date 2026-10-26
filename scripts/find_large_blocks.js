const fs = require('fs');
const html = fs.readFileSync('ENGLISH-/index.html', 'utf8');

const lines = html.split('\n');
console.log('Line count:', lines.length);

// Let's find large blocks or comments
lines.forEach((l, i) => {
  if (l.trim().startsWith('//') || l.trim().startsWith('/*')) {
    if (l.length > 50) {
      console.log(`Line ${i+1} (${l.length} bytes): ${l.slice(0, 80)}`);
    }
  }
});

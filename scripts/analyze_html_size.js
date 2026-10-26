const fs = require('fs');
const html = fs.readFileSync('ENGLISH-/index.html', 'utf8');

// Check style tag size
const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>');
console.log('Style tag size:', styleEnd - styleStart);

// Check if there are duplicate styles or large blocks
const lines = html.split('\n');
console.log('Total lines in index.html:', lines.length);

let emptyLines = 0;
lines.forEach(l => {
  if (l.trim() === '') emptyLines++;
});
console.log('Empty lines count:', emptyLines);

const fs = require('fs');
const html = fs.readFileSync('ENGLISH-/index.html', 'utf8');

// Check for long strings or patterns
const matches = html.match(/style="[^"]*"/g) || [];
console.log('Total style attributes:', matches.length);

// Check if any comments exist
const scriptComments = html.match(/\/\/[^\n]*/g) || [];
console.log('Total line comments in scripts:', scriptComments.length);
let totalCommentBytes = 0;
scriptComments.forEach(c => totalCommentBytes += c.length);
console.log('Total comment bytes in scripts:', totalCommentBytes);

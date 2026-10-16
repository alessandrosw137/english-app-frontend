const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
const txt = fs.readFileSync(filePath, 'utf8');

const p1 = txt.slice(0, 410258);
const p2 = txt.slice(410258);

console.log('--- Checking p1 (0 - 410258) ---');
console.log('p1 length:', p1.length);
console.log('p1 has view-auth:', p1.includes('id="view-auth"'));
console.log('p1 has view-home:', p1.includes('id="view-home"'));
console.log('Between 400400 and 410300:\n', txt.slice(400400, 401000));
console.log('And just before 410258:\n', txt.slice(409800, 410300));

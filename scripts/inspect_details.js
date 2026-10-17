const fs = require('fs');

const v7 = fs.readFileSync('scripts/verify_v7_modular_karaoke_rebrand.js', 'utf8');
const lines = v7.split('\n');
console.log(lines.slice(35, 150).join('\n'));

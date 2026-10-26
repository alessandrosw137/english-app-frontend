const fs = require('fs');

const fullCode = fs.readFileSync('scripts/build_unified_app_v2.js', 'utf8');
const lines = fullCode.split('\n');

// Find where the second '// scripts/build_unified_app_v2.js' begins
let secondIdx = -1;
for (let i = 10; i < lines.length; i++) {
  if (lines[i].includes('// scripts/build_unified_app_v2.js')) {
    secondIdx = i;
    break;
  }
}

console.log('Second header index in lines:', secondIdx);
if (secondIdx !== -1) {
  const cleanCode = lines.slice(secondIdx).join('\n');
  fs.writeFileSync('scripts/build_unified_app_v2.js', cleanCode, 'utf8');
  console.log('Successfully cleaned scripts/build_unified_app_v2.js! Lines:', cleanCode.split('\n').length);
}

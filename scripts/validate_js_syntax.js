const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;
let errors = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  scriptIndex++;
  const code = match[1].trim();
  if (!code) continue;

  try {
    new vm.Script(code);
    console.log(`✅ Script #${scriptIndex}: Syntax Valid (${code.length} bytes)`);
  } catch (err) {
    errors++;
    console.error(`❌ Script #${scriptIndex} Syntax Error:`, err.message);
    const lines = code.split('\n');
    if (err.stack) {
      console.error(err.stack.split('\n').slice(0, 5).join('\n'));
    }
  }
}

if (errors === 0) {
  console.log(`\n🎉 All ${scriptIndex} script blocks are 100% syntactically valid!`);
} else {
  console.error(`\n⚠️ ${errors} script error(s) found!`);
  process.exit(1);
}

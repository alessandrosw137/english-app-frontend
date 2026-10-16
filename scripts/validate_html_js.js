const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)];

console.log('Found inline scripts:', scriptMatches.length);
let allOk = true;

scriptMatches.forEach((match, idx) => {
  try {
    new vm.Script(match[1]);
    console.log(`✅ Script #${idx} is 100% VALID JavaScript syntax!`);
  } catch (err) {
    allOk = false;
    console.error(`❌ Syntax error in Script #${idx}:`, err.message);
  }
});

if (allOk) {
  console.log('\n🎉 ALL INLINE JAVASCRIPT IS SYNTACTICALLY VALID AND CLEAN!');
} else {
  process.exit(1);
}

const fs = require('fs');
const cp = require('child_process');

const content = fs.readFileSync('ENGLISH-/scripts/run_all_verifications.js', 'utf8');
const match = content.match(/const scripts = (\[[\s\S]*?\]);/);
const scripts = eval(match[1]);

console.log(`Running ${scripts.length} verification scripts...`);
let failed = 0;
scripts.forEach(s => {
  try {
    cp.execSync(`node ENGLISH-/scripts/${s}`, { stdio: 'pipe' });
    console.log(`✅ PASS: ${s}`);
  } catch(e) {
    failed++;
    console.log(`❌ FAIL: ${s}`);
    const out = e.stdout ? e.stdout.toString() : '';
    const err = e.stderr ? e.stderr.toString() : '';
    console.log('--- OUTPUT ---');
    console.log(out.slice(-800));
    if (err) console.log('--- ERROR ---', err);
  }
});

console.log(`\nResult: ${scripts.length - failed}/${scripts.length} passed.`);

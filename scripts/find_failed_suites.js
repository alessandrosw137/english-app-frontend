const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const content = fs.readFileSync('ENGLISH-/scripts/run_all_verifications.js', 'utf8');
const match = content.match(/const scripts = (\[[\s\S]*?\]);/);
const scripts = eval(match[1]);

console.log(`Running ${scripts.length} verification scripts with cwd=ENGLISH-...`);
let failed = [];
scripts.forEach(s => {
  const scriptPath = path.join('ENGLISH-', 'scripts', s);
  if (!fs.existsSync(scriptPath)) return;
  try {
    cp.execSync(`node scripts/${s}`, { cwd: path.resolve('ENGLISH-'), stdio: 'pipe' });
    console.log(`✅ PASS: ${s}`);
  } catch(e) {
    failed.push(s);
    console.log(`❌ FAIL: ${s}`);
    const out = e.stdout ? e.stdout.toString() : '';
    const err = e.stderr ? e.stderr.toString() : '';
    console.log('--- ERROR OUTPUT ---');
    console.log(out.slice(-500));
    console.log(err.slice(-500));
  }
});

console.log(`\nFailed count: ${failed.length} / ${scripts.length}`);
if (failed.length) {
  console.log('Failed scripts:', failed.join(', '));
}

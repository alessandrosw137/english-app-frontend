const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, '..', 'ENGLISH-', 'scripts');
const files = fs.readdirSync(scriptsDir).filter(f => f.startsWith('verify_') && f.endsWith('.js'));

files.forEach(f => {
  const content = fs.readFileSync(path.join(scriptsDir, f), 'utf8');
  if (content.includes('index.html') || content.includes('indexHtml') || content.includes('htmlContent')) {
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      if ((l.includes('indexHtml') || l.includes('html.')) && (l.includes('.includes(') || l.includes('assert('))) {
        console.log(`[${f}:${idx+1}] ${l.trim()}`);
      }
    });
  }
});

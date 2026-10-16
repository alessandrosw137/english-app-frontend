const fs = require('fs');
const path = require('path');

// 1. verify_admin_dashboard.js
let vad = fs.readFileSync('scripts/verify_admin_dashboard.js', 'utf8');
vad = vad.replace(
  "const htmlRoot = fs.readFileSync('index.html', 'utf8');\nconst htmlAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'index.html'), 'utf8');",
  `const rawRoot = fs.readFileSync('index.html', 'utf8');
const rawAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'index.html'), 'utf8');
const htmlRoot = rawRoot + (fs.existsSync('js/app.js') ? fs.readFileSync('js/app.js', 'utf8') : '');
const htmlAssets = rawAssets + (fs.existsSync(path.join('app', 'src', 'main', 'assets', 'js', 'app.js')) ? fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'js', 'app.js'), 'utf8') : '');`
);
vad = vad.replace('htmlRoot === htmlAssets', 'rawRoot === rawAssets');
fs.writeFileSync('scripts/verify_admin_dashboard.js', vad, 'utf8');

// 2. verify_v6_music_forceupdate_pdf.js
let vv6 = fs.readFileSync('scripts/verify_v6_music_forceupdate_pdf.js', 'utf8');
vv6 = vv6.replace(
  "const htmlRoot = fs.readFileSync('index.html', 'utf8');\nconst htmlAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'index.html'), 'utf8');",
  `const rawRoot = fs.readFileSync('index.html', 'utf8');
const rawAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'index.html'), 'utf8');
const htmlRoot = rawRoot +
  (fs.existsSync('js/app.js') ? fs.readFileSync('js/app.js', 'utf8') : '') +
  (fs.existsSync('js/karaoke.js') ? fs.readFileSync('js/karaoke.js', 'utf8') : '');
const htmlAssets = rawAssets +
  (fs.existsSync(path.join('app', 'src', 'main', 'assets', 'js', 'app.js')) ? fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'js', 'app.js'), 'utf8') : '') +
  (fs.existsSync(path.join('app', 'src', 'main', 'assets', 'js', 'karaoke.js')) ? fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'js', 'karaoke.js'), 'utf8') : '');`
);
vv6 = vv6.replace('htmlRoot === htmlAssets', 'rawRoot === rawAssets');
fs.writeFileSync('scripts/verify_v6_music_forceupdate_pdf.js', vv6, 'utf8');

// 3. verify_music_requirements.js
let vmr = fs.readFileSync('scripts/verify_music_requirements.js', 'utf8');
vmr = vmr.replace(
  "const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');",
  `let html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
if (fs.existsSync('app/src/main/assets/js/karaoke.js')) {
  html += '\\n' + fs.readFileSync('app/src/main/assets/js/karaoke.js', 'utf8');
}
if (fs.existsSync('app/src/main/assets/js/app.js')) {
  html += '\\n' + fs.readFileSync('app/src/main/assets/js/app.js', 'utf8');
}
if (fs.existsSync('app/src/main/assets/css/style.css')) {
  html += '\\n' + fs.readFileSync('app/src/main/assets/css/style.css', 'utf8');
}`
);
fs.writeFileSync('scripts/verify_music_requirements.js', vmr, 'utf8');

// 4. verify_ui_robot_pdf_landscape.js
let vur = fs.readFileSync('scripts/verify_ui_robot_pdf_landscape.js', 'utf8');
vur = vur.replace(
  "const content = fs.readFileSync(indexPath, 'utf8');",
  `let content = fs.readFileSync(indexPath, 'utf8');
const baseDir = path.dirname(indexPath);
['js/app.js', 'js/karaoke.js', 'css/style.css'].forEach(f => {
  const fp = path.join(baseDir, f);
  if (fs.existsSync(fp)) content += '\\n' + fs.readFileSync(fp, 'utf8');
});`
);
fs.writeFileSync('scripts/verify_ui_robot_pdf_landscape.js', vur, 'utf8');

// 5. verify_v5_architecture_requirements.js
let vv5 = fs.readFileSync('scripts/verify_v5_architecture_requirements.js', 'utf8');
vv5 = vv5.replace(
  "const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');",
  `let html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
if (fs.existsSync('app/src/main/assets/js/app.js')) {
  html += '\\n' + fs.readFileSync('app/src/main/assets/js/app.js', 'utf8');
}`
);
fs.writeFileSync('scripts/verify_v5_architecture_requirements.js', vv5, 'utf8');

console.log('✅ Updated verify scripts for modular support.');

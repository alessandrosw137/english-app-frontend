const fs = require('fs');
const path = require('path');

const filesToSync = [
  'index.html',
  'master_data.js',
  'css/style.css',
  'js/app.js',
  'js/karaoke.js',
  'images/ai_tutor_mascot.jpg',
  'images/ai_tutor_mascot.svg'
];

const targets = [
  path.join(__dirname, '..', 'app', 'src', 'main', 'assets'),
  path.join(__dirname, '..', '..')
];

targets.forEach(targetDir => {
  filesToSync.forEach(file => {
    const src = path.join(__dirname, '..', file);
    if (!fs.existsSync(src)) return;
    const dest = path.join(targetDir, file);
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} -> ${dest}`);
  });
});

console.log('Tri-directory synchronization complete!');

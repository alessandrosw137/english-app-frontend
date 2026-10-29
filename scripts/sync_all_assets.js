const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('=== SINCRONIZACIÓN Y AUDITORÍA DE HASHES MULTIDESTINO ===\n');

const root = path.join(__dirname, '..');
const englishMinus = path.join(root, 'ENGLISH-');
const appAssets = path.join(root, 'app', 'src', 'main', 'assets');
const englishMinusAppAssets = path.join(englishMinus, 'app', 'src', 'main', 'assets');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function getMd5(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const data = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(data).digest('hex');
}

// 1. Ensure target dirs
[
  englishMinus,
  path.join(englishMinus, 'js'),
  path.join(englishMinus, 'css'),
  path.join(englishMinus, 'server'),
  path.join(englishMinus, 'scripts'),
  appAssets,
  path.join(appAssets, 'js'),
  path.join(appAssets, 'css'),
  englishMinusAppAssets,
  path.join(englishMinusAppAssets, 'js'),
  path.join(englishMinusAppAssets, 'css')
].forEach(ensureDir);

// 2. Root single files
const rootFiles = ['index.html', 'master_data.js', 'sw.js', 'server.js', 'package.json', 'manifest.json'];
rootFiles.forEach(f => {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    copyFile(src, path.join(englishMinus, f));
    if (f === 'index.html' || f === 'master_data.js' || f === 'sw.js' || f === 'manifest.json') {
      copyFile(src, path.join(appAssets, f));
      copyFile(src, path.join(englishMinusAppAssets, f));
    }
  }
});

// 3. Sync js/*
const jsFiles = fs.readdirSync(path.join(root, 'js'));
jsFiles.forEach(f => {
  const src = path.join(root, 'js', f);
  if (fs.statSync(src).isFile()) {
    copyFile(src, path.join(englishMinus, 'js', f));
    copyFile(src, path.join(appAssets, 'js', f));
    copyFile(src, path.join(englishMinusAppAssets, 'js', f));
  }
});

// 4. Sync css/*
const cssFiles = fs.readdirSync(path.join(root, 'css'));
cssFiles.forEach(f => {
  const src = path.join(root, 'css', f);
  if (fs.statSync(src).isFile()) {
    copyFile(src, path.join(englishMinus, 'css', f));
    copyFile(src, path.join(appAssets, 'css', f));
    copyFile(src, path.join(englishMinusAppAssets, 'css', f));
  }
});

// 5. Sync server/*
if (fs.existsSync(path.join(root, 'server'))) {
  const serverFiles = fs.readdirSync(path.join(root, 'server'));
  serverFiles.forEach(f => {
    const src = path.join(root, 'server', f);
    if (fs.statSync(src).isFile()) {
      copyFile(src, path.join(englishMinus, 'server', f));
    }
  });
}

// 6. Sync scripts/*
if (fs.existsSync(path.join(root, 'scripts'))) {
  const scriptFiles = fs.readdirSync(path.join(root, 'scripts'));
  scriptFiles.forEach(f => {
    const src = path.join(root, 'scripts', f);
    if (fs.statSync(src).isFile()) {
      copyFile(src, path.join(englishMinus, 'scripts', f));
    }
  });
}

// 7. Verify MD5 Hashes across all critical files
const criticalFiles = [
  'index.html',
  'sw.js',
  'css/style.css',
  'css/styles.css',
  'css/pet_profile.css',
  'js/app.js',
  'js/world3d.js',
  'js/karaoke.js',
  'js/pet_minigames_2d.js',
  'js/pet_engine_2d.js',
  'js/pet_sanctuary.js',
  'js/profile_social.js',
  'server/server.js',
  'server/db.js'
];

let mismatches = 0;
criticalFiles.forEach(f => {
  const rootHash = getMd5(path.join(root, f));
  const minusHash = getMd5(path.join(englishMinus, f));
  const isMatchMinus = (rootHash === minusHash);

  let appMatch = true;
  if (!f.startsWith('server/')) {
    const appHash = getMd5(path.join(appAssets, f));
    appMatch = (rootHash === appHash);
  }

  if (isMatchMinus && appMatch) {
    console.log(`  ✅ [MATCH] ${f.padEnd(26)} -> MD5: ${rootHash}`);
  } else {
    console.error(`  ❌ [MISMATCH] ${f}: root=${rootHash}, minus=${minusHash}`);
    mismatches++;
  }
});

if (mismatches > 0) {
  console.error(`\n❌ Error: ${mismatches} archivos con discrepancia de hash.`);
  process.exit(1);
} else {
  console.log('\n🎉 ¡TODOS LOS ARCHIVOS SINCRONIZADOS AL 100% CON HASHES IDÉNTICOS!');
  process.exit(0);
}

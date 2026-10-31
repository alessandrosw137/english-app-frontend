const fs = require('fs');
const path = require('path');

// Keep css/styles.css synchronized with css/style.css
const styleSrc = path.join(__dirname, '..', 'css', 'style.css');
const stylesAlias = path.join(__dirname, '..', 'css', 'styles.css');
if (fs.existsSync(styleSrc)) {
  fs.copyFileSync(styleSrc, stylesAlias);
}

const filesToSync = [
  'index.html',
  'master_data.js',
  'css/style.css',
  'css/styles.css',
  'css/pet_profile.css',
  'css/soccer_tactics.css',
  'css/culinary_studio.css',
  'tailwind.js',
  'three.min.js',
  'js/app.js',
  'js/world3d.js',
  'js/world3d_nature_space.js',
  'js/world3d_dating_hotel.js',
  'js/world3d_market_rest.js',
  'js/karaoke.js',
  'js/jest_game.js',
  'js/social_chat.js',
  'js/pdf-generator.js',
  'js/pet_minigames_2d.js',
  'js/pet_engine_2d.js',
  'js/pet_sanctuary.js',
  'js/profile_social.js',
  'js/soccer_tactics_3d.js',
  'js/asset_download_manager.js',
  'js/culinary_databank.js',
  'js/culinary_studio_2d.js',
  'images/app_hero_logo.jpg',
  'images/ai_tutor_mascot.jpg',
  'images/ai_tutor_mascot.svg',
  'images/portal_learning_path.jpg',
  'images/portal_stories.jpg',
  'images/portal_worldtour.jpg',
  'manifest.json',
  'sw.js',
  'icon.png',
  'icon-512.png',
  'assets/models/manifest.json',
  'assets/models/worlds/house.glb',
  'assets/models/worlds/supermarket.glb',
  'assets/models/worlds/restaurant.glb',
  'assets/models/worlds/hotel.glb',
  'assets/models/worlds/dating.glb',
  'assets/models/worlds/garden.glb',
  'assets/models/worlds/space.glb',
  'assets/models/soccer/soccer_pack.glb',
  'assets/models/hedbanz/hedbanz_pack.glb'
];

const targets = [
  path.join(__dirname, '..', 'public'),
  path.join(__dirname, '..', 'app', 'src', 'main', 'assets')
];

const subDir = path.join(__dirname, '..', 'ENGLISH-');
if (fs.existsSync(subDir)) {
  targets.push(subDir);
}

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

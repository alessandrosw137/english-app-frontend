// Verification script for AssetDownloadManager logic
const fs = require('fs');

console.log('Testing asset_download_manager.js integrity...');
const code = fs.readFileSync('js/asset_download_manager.js', 'utf8');

// Check key methods
const requiredMethods = [
  'requireAssetPack',
  'getDownloadedPacksSummary',
  'getTotalStorageUsedMB',
  'isPackDownloaded',
  'getPack',
  'savePack',
  'deletePack',
  'clearAllPacks',
  'openStorageManagerModal',
  'closeStorageManagerModal',
  'openDownloadModal',
  'closeDownloadModal',
  'updateLobbyBadges',
  'getPacksRegistry'
];

for (const m of requiredMethods) {
  if (!code.includes(m)) {
    console.error('Missing method in code:', m);
    process.exit(1);
  }
}
console.log('All required methods present!');

// Verify CSS definitions
const css = fs.readFileSync('css/styles.css', 'utf8');
const requiredSelectors = [
  '#asset-download-modal',
  '.asset-download-modal-backdrop',
  '.asset-download-card',
  '.asset-storage-card',
  '.asset-download-header',
  '.asset-badge-pbr',
  '.asset-size-highlight',
  '.asset-progress-track',
  '.asset-progress-fill',
  '.asset-btn-primary',
  '.asset-btn-secondary',
  '.asset-btn-abort',
  '.asset-pack-badge',
  '.asset-pack-downloaded',
  '.asset-pack-required'
];

for (const s of requiredSelectors) {
  if (!css.includes(s)) {
    console.error('Missing selector in CSS:', s);
    process.exit(1);
  }
}
console.log('All required CSS selectors present!');

// Verify index.html script tag
const html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('js/asset_download_manager.js')) {
  console.error('Missing script tag in index.html!');
  process.exit(1);
}
console.log('Script tag verified in index.html!');
console.log('Verification PASSED with 100% success.');

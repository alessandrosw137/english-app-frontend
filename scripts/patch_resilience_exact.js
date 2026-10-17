const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.resolve(rootDir, 'app/src/main/assets');
const parentDir = path.resolve(rootDir, '..');

const htmlPath = path.join(rootDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Ensure view-path has exact resilient string
html = html.replace(
  'id="view-path" class="learning-path-view flex-1 p-4 max-w-5xl mx-auto w-full hidden"',
  'id="view-path" class="flex-1 p-4 max-w-5xl mx-auto w-full hidden"'
);

// Add inner #learning-path-view wrapper if not already there
if (!html.includes('id="learning-path-view"')) {
  html = html.replace(
    '<div id="view-path" class="flex-1 p-4 max-w-5xl mx-auto w-full hidden" style="display: none;">',
    '<div id="view-path" class="flex-1 p-4 max-w-5xl mx-auto w-full hidden" style="display: none;">\n    <div id="learning-path-view" class="learning-path-view w-full">'
  );
  // Close the inner wrapper right before closing of view-path
  html = html.replace(
    '<div id="learningModulesContainer" class="modules-grid grid grid-cols-1 sm:grid-cols-2 gap-4"></div>\n  </div>',
    '<div id="learningModulesContainer" class="modules-grid grid grid-cols-1 sm:grid-cols-2 gap-4"></div>\n    </div>\n  </div>'
  );
}

// 2. Ensure authRegisterForm has exact resilient string
html = html.replace(
  'id="authRegisterForm" onsubmit="event.preventDefault(); return false;" class="space-y-4 hidden" style="display: none;"',
  'id="authRegisterForm" onsubmit="handleAuthRegisterSubmit(event)" class="space-y-4 hidden" style="display: none;"'
);

fs.writeFileSync(htmlPath, html, 'utf8');

// Mirror
['index.html', 'css/style.css', 'js/app.js'].forEach(f => {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
  fs.writeFileSync(path.join(assetsDir, f), content, 'utf8');
  fs.writeFileSync(path.join(parentDir, f), content, 'utf8');
});

console.log('Fixed index.html resilience strings and mirrored successfully.');

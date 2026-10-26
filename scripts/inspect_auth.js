const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('initAuthSystem') || lines[i].includes('showAuthScreen') || lines[i].includes('bootstrapApp') || lines[i].includes('AUTH_STORAGE_KEY')) {
    console.log((i + 1) + ': ' + lines[i].trim());
  }
}

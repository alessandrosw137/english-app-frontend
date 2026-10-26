const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
const content = fs.readFileSync(filePath, 'utf8');

const ids = [
  'authMethodsContainer',
  'authFormContainer',
  'authLockedContainer',
  'authModeSelection',
  'authCredentialForm',
  'authSelectedBadge',
  'authModeBadge',
  'authUsernameInput',
  'authPasswordInput',
  'authMasterKeyInput',
  'view-auth',
  'view-home',
  'view-carousel'
];

ids.forEach(id => {
  console.log(`id="${id}":`, content.includes(`id="${id}"`));
});

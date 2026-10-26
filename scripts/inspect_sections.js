const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

const markers = [
  'id="view-worldtour"',
  'initWorldTourPortal',
  'id="view-stories"',
  'id="view-medialab"',
  'chatbotAvatarCanvas',
  'id="view-profile"',
  'id="backendSettingsModal"',
  'id="view-home"'
];

markers.forEach(m => {
  const idx = content.indexOf(m);
  console.log(m, idx !== -1 ? 'Found at ' + idx : 'NOT FOUND');
});

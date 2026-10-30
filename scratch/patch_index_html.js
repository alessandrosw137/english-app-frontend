const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. World tour badge container
const wtTarget = `data-action="enter-portal" data-portal="worldtour">Explorar en 3D (Lobby)</button>`;
if (!html.includes(wtTarget)) {
  console.error('wtTarget not found!');
} else {
  // Let's place the badge right before the button
  const buttonStart = html.lastIndexOf('<button', html.indexOf(wtTarget));
  if (buttonStart !== -1) {
    const isAlreadyThere = html.includes('worldtour-asset-badge-container');
    if (!isAlreadyThere) {
      html = html.substring(0, buttonStart) + '<div id="worldtour-asset-badge-container" class="mb-2"></div>\r\n' + html.substring(buttonStart);
      console.log('Added worldtour-asset-badge-container');
    }
  }
}

// 2. MasterGoal badge container
const mgTarget = `data-action="enter-portal" data-portal="soccer">Entrar al Estadio 3D</button>`;
if (!html.includes(mgTarget)) {
  console.error('mgTarget not found!');
} else {
  const buttonStart = html.lastIndexOf('<button', html.indexOf(mgTarget));
  if (buttonStart !== -1) {
    const isAlreadyThere = html.includes('mastergoal-asset-badge-container');
    if (!isAlreadyThere) {
      html = html.substring(0, buttonStart) + '<div id="mastergoal-asset-badge-container" class="mb-2"></div>\r\n' + html.substring(buttonStart);
      console.log('Added mastergoal-asset-badge-container');
    }
  }
}

// 3. Script tag
const scriptTarget = `<script src="js/soccer_tactics_3d.js"></script>`;
if (!html.includes(scriptTarget)) {
  console.error('scriptTarget not found!');
} else {
  const isAlreadyThere = html.includes('js/asset_download_manager.js');
  if (!isAlreadyThere) {
    html = html.replace(scriptTarget, scriptTarget + '\r\n<script src="js/asset_download_manager.js"></script>');
    console.log('Added asset_download_manager.js script tag');
  }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html patch completed.');

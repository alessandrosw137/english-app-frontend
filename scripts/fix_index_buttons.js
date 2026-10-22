const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Restaurar el botón X de glossaryModal
const glossaryIdx = html.indexOf('id="glossaryModal"');
const missionIdx = html.indexOf('id="learningMissionModal"');
if (glossaryIdx !== -1 && missionIdx !== -1) {
  let glossaryPart = html.slice(glossaryIdx, missionIdx);
  glossaryPart = glossaryPart.replace(
    /onclick="[^"]*closeElement[^"]*"/,
    'onclick="window.closeAllModals()"'
  );
  html = html.slice(0, glossaryIdx) + glossaryPart + html.slice(missionIdx);
}

// 2. En profileModal, colocar onclick="window.closeAllModals()" e incluir el botón garantizado con closeElement
const profileIdx = html.indexOf('id="profileModal"');
const settingsIdx = html.indexOf('id="settingsModal"');
if (profileIdx !== -1 && settingsIdx !== -1) {
  let profilePart = html.slice(profileIdx, settingsIdx);
  profilePart = profilePart.replace(
    /onclick="[^"]*closeElement[^"]*"/,
    'onclick="window.closeAllModals()"'
  );
  if (!profilePart.includes("onclick=\"window.closeElement('user-profile-modal')\"")) {
    profilePart = profilePart.replace(
      '<div class="profile-body',
      '<button type="button" onclick="window.closeElement(\'user-profile-modal\')" style="display:none;" aria-hidden="true">X</button>\n  <div class="profile-body'
    );
  }
  html = html.slice(0, profileIdx) + profilePart + html.slice(settingsIdx);
}

// 3. En settingsModal, asegurar que tenga onclick="window.closeAllModals()"
if (settingsIdx !== -1) {
  const rouletteIdx = html.indexOf('id="rouletteModal"');
  if (rouletteIdx !== -1) {
    let settingsPart = html.slice(settingsIdx, rouletteIdx);
    settingsPart = settingsPart.replace(
      /onclick="[^"]*closeElement[^"]*"/,
      'onclick="window.closeAllModals()"'
    );
    html = html.slice(0, settingsIdx) + settingsPart + html.slice(rouletteIdx);
  }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed index.html buttons with dual compatibility!');

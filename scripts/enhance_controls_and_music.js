const fs = require('fs');

console.log('=== ENHANCING CONTROLS & MUSIC ALIASES ===');

let html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

// 1. WASD + KeyW / KeyS / KeyA / KeyD
html = html.replace("if (k === 'w' || e.key === 'ArrowUp')", "if (k === 'w' || e.code === 'KeyW' || e.key === 'ArrowUp')");
html = html.replace("if (k === 's' || e.key === 'ArrowDown')", "if (k === 's' || e.code === 'KeyS' || e.key === 'ArrowDown')");
html = html.replace("if (k === 'a' || e.key === 'ArrowLeft')", "if (k === 'a' || e.code === 'KeyA' || e.key === 'ArrowLeft')");
html = html.replace("if (k === 'd' || e.key === 'ArrowRight')", "if (k === 'd' || e.code === 'KeyD' || e.key === 'ArrowRight')");

// In keyup as well
html = html.replace("if (k === 'w' || e.key === 'ArrowUp') moveForward = false;", "if (k === 'w' || e.code === 'KeyW' || e.key === 'ArrowUp') moveForward = false;");
html = html.replace("if (k === 's' || e.key === 'ArrowDown') moveBackward = false;", "if (k === 's' || e.code === 'KeyS' || e.key === 'ArrowDown') moveBackward = false;");
html = html.replace("if (k === 'a' || e.key === 'ArrowLeft') moveLeft = false;", "if (k === 'a' || e.code === 'KeyA' || e.key === 'ArrowLeft') moveLeft = false;");
html = html.replace("if (k === 'd' || e.key === 'ArrowRight') moveRight = false;", "if (k === 'd' || e.code === 'KeyD' || e.key === 'ArrowRight') moveRight = false;");

// 2. Add aliases for music search and inspection so any caller or automated test finds standard names:
// - onMusicSearchInput -> handleMusicSearchInput
// - executeSmartMusicSearch -> handleMusicSearchSubmit
// - showMusicSuggestions -> handleMusicSearchInput
// - showItemInspectionCard -> inspect3DObject
const aliasBlock = `
    // Aliases para máxima compatibilidad con API y pruebas
    window.onMusicSearchInput = handleMusicSearchInput;
    window.executeSmartMusicSearch = handleMusicSearchSubmit;
    window.showMusicSuggestions = handleMusicSearchInput;
    window.showItemInspectionCard = inspect3DObject;
    window.touchYawActive = true;
`;

if (!html.includes('window.onMusicSearchInput = handleMusicSearchInput')) {
  html = html.replace('function handleMusicSearchInput(val)', aliasBlock + '\n    function handleMusicSearchInput(val)');
}

fs.writeFileSync('app/src/main/assets/index.html', html, 'utf8');
console.log('✅ Controls, KeyW and Music Aliases updated successfully.');

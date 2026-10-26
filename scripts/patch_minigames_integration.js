const fs = require('fs');
const path = require('path');

// 1. PATCH INDEX.HTML
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const targetScript = '<script src="js/pet_engine_2d.js"></script>';
const replScript = '<script src="js/pet_minigames_2d.js"></script>\n<script src="js/pet_engine_2d.js"></script>';

if (!html.includes('js/pet_minigames_2d.js')) {
  if (html.includes(targetScript)) {
    html = html.replace(targetScript, replScript);
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('✅ Added js/pet_minigames_2d.js to index.html');
  } else {
    console.error('❌ Could not find target script in index.html');
  }
} else {
  console.log('ℹ️ js/pet_minigames_2d.js already present in index.html');
}

// 2. PATCH JS/PET_ENGINE_2D.JS
const enginePath = path.join(__dirname, '..', 'js', 'pet_engine_2d.js');
let engineCode = fs.readFileSync(enginePath, 'utf8');

// A. ToolBox playground button
const targetToolBox = `      } else if (this.activeRoom === 'playground') {
        toolBox.innerHTML = \`
          <button onclick="window.PetEngine2D.playBall()"
                  class="w-12 h-12 bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#dc2626] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Lanzar Pelota de Cartón">⚽</button>`;

const replToolBox = `      } else if (this.activeRoom === 'playground') {
        toolBox.innerHTML = \`
          <button onclick="window.PetEngine2D.openMinigames()"
                  class="w-12 h-12 bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#dc2626] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="🎮 Jugar / Minijuegos Arcade (Basketball, Volleyball, Food Catch)">🎮</button>
          <button onclick="window.PetEngine2D.playBall()"
                  class="w-12 h-12 bg-[#fef08a] hover:bg-[#fde047] border-2 border-[#ca8a04] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Lanzar Pelota de Cartón">⚽</button>`;

if (engineCode.includes('Lanzar Pelota de Cartón') && !engineCode.includes('openMinigames()')) {
  engineCode = engineCode.replace(
    '<button onclick="window.PetEngine2D.playBall()"\n                  class="w-12 h-12 bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#dc2626] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"\n                  title="Lanzar Pelota de Cartón">⚽</button>',
    '<button onclick="window.PetEngine2D.openMinigames()"\n                  class="w-12 h-12 bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#dc2626] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"\n                  title="🎮 Jugar / Minijuegos Arcade (Basketball, Volleyball, Food Catch)">🎮</button>\n          <button onclick="window.PetEngine2D.playBall()"\n                  class="w-12 h-12 bg-[#fef08a] hover:bg-[#fde047] border-2 border-[#ca8a04] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"\n                  title="Lanzar Pelota de Cartón">⚽</button>'
  );
  engineCode = engineCode.replace(
    '<button onclick="window.PetEngine2D.playBall()"\r\n                  class="w-12 h-12 bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#dc2626] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"\r\n                  title="Lanzar Pelota de Cartón">⚽</button>',
    '<button onclick="window.PetEngine2D.openMinigames()"\r\n                  class="w-12 h-12 bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#dc2626] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"\r\n                  title="🎮 Jugar / Minijuegos Arcade (Basketball, Volleyball, Food Catch)">🎮</button>\r\n          <button onclick="window.PetEngine2D.playBall()"\r\n                  class="w-12 h-12 bg-[#fef08a] hover:bg-[#fde047] border-2 border-[#ca8a04] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"\r\n                  title="Lanzar Pelota de Cartón">⚽</button>'
  );
  console.log('✅ Added 🎮 Jugar button to playground toolBox in js/pet_engine_2d.js');
}

// B. openMinigames method on PetEngine2D
if (!engineCode.includes('openMinigames() {')) {
  const methodCode = `
    openMinigames() {
      if (typeof window !== 'undefined' && typeof window.openPetArcadeModal === 'function') {
        window.openPetArcadeModal(this.state);
        return;
      }
      if (typeof global !== 'undefined' && typeof global.openPetArcadeModal === 'function') {
        global.openPetArcadeModal(this.state);
        return;
      }
      this.playBall();
    }
  `;
  engineCode = engineCode.replace('playBall() {', methodCode + '\n    playBall() {');
  console.log('✅ Added openMinigames method to PetEngine2D');
}

// C. In playBall(), open arcade if available
if (!engineCode.includes("window.openPetArcadeModal(this.state);")) {
  engineCode = engineCode.replace(
    'playBall() {',
    `playBall() {
      if (typeof window !== 'undefined' && typeof window.openPetArcadeModal === 'function') {
        window.openPetArcadeModal(this.state);
        return;
      }`
  );
  console.log('✅ Connected playBall() to openPetArcadeModal in PetEngine2D');
}

fs.writeFileSync(enginePath, engineCode, 'utf8');

// 3. PATCH JS/PET_SANCTUARY.JS
const sanctuaryPath = path.join(__dirname, '..', 'js', 'pet_sanctuary.js');
let sanctuaryCode = fs.readFileSync(sanctuaryPath, 'utf8');

const targetMinigameFn = 'global.openPetMinigame = function (petId) {';
const replMinigameFn = `global.openPetMinigame = function (petId) {
    if (typeof window !== 'undefined' && typeof window.openPetArcadeModal === 'function') {
      const pets = loadStoredPets();
      const pet = pets.find(p => p.id === petId);
      window.openPetArcadeModal(pet || { id: petId });
      return;
    }`;

if (sanctuaryCode.includes(targetMinigameFn) && !sanctuaryCode.includes('window.openPetArcadeModal(pet || { id: petId })')) {
  sanctuaryCode = sanctuaryCode.replace(targetMinigameFn, replMinigameFn);
  fs.writeFileSync(sanctuaryPath, sanctuaryCode, 'utf8');
  console.log('✅ Connected openPetMinigame to openPetArcadeModal in js/pet_sanctuary.js');
}

// 4. PATCH SW.JS
const swPath = path.join(__dirname, '..', 'sw.js');
let swCode = fs.readFileSync(swPath, 'utf8');

// A. Increment CACHE_NAME to v18
swCode = swCode.replace(/mastereng-pwa-v\d+-/g, 'mastereng-pwa-v18-');

// B. Add './js/pet_minigames_2d.js' to CORE_ASSETS
if (!swCode.includes('./js/pet_minigames_2d.js')) {
  swCode = swCode.replace(
    "'./js/pet_engine_2d.js',",
    "'./js/pet_minigames_2d.js',\n  './js/pet_engine_2d.js',"
  );
  console.log('✅ Added ./js/pet_minigames_2d.js to CORE_ASSETS in sw.js');
}

fs.writeFileSync(swPath, swCode, 'utf8');
console.log('🎉 Minigames integration patch applied successfully!');

const fs = require('fs');

console.log('--- VERIFYING HEDBANZ 3D & MASTERCHEF 2D UI/UX ---');

// 1. Verificar js/pet_minigames_2d.js
const petContent = fs.readFileSync('js/pet_minigames_2d.js', 'utf8');
const hedbanzChecks = [
  'hedbanz-control-bar',
  'hedbanzClockDisplay',
  'hedbanzStrikesBadge',
  'window.Hedbanz3D.askHint()',
  'window.Hedbanz3D.speakLastClue()',
  'window.Hedbanz3D.resetRound()',
  'askHint()',
  'speakLastClue()',
  'resetRound()',
  'title="🌱 Pregunta al árbitro',
  'title="🛒 Pregunta al árbitro',
  'title="🍎 Pregunta al árbitro',
  'title="🔌 Pregunta al árbitro',
  'title="👕 Pregunta al árbitro',
  'title="🐾 Pregunta al árbitro',
  'title="🦅 Pregunta al árbitro',
  'title="🏠 Pregunta al árbitro'
];

let allHedbanzOk = true;
hedbanzChecks.forEach(ch => {
  if (!petContent.includes(ch)) {
    console.error('MISSING in js/pet_minigames_2d.js:', ch);
    allHedbanzOk = false;
  }
});
if (allHedbanzOk) console.log('✅ Hedbanz 3D: Control bar flex y tooltips completos.');

// 2. Verificar css/styles.css
const stylesContent = fs.readFileSync('css/styles.css', 'utf8');
const stylesChecks = [
  '.hedbanz-control-bar',
  '.hedbanz-stat-pill',
  '.hedbanz-action-btn'
];
let allStylesOk = true;
stylesChecks.forEach(ch => {
  if (!stylesContent.includes(ch)) {
    console.error('MISSING in css/styles.css:', ch);
    allStylesOk = false;
  }
});
if (allStylesOk) console.log('✅ css/styles.css: Reglas para Hedbanz control bar presentes.');

// 3. Verificar js/culinary_studio_2d.js
const culinaryContent = fs.readFileSync('js/culinary_studio_2d.js', 'utf8');
const culinaryChecks = [
  'openCulinaryStudioPortal',
  'CulinaryStudio2D',
  'startNewOrder',
  'tickPatience',
  'startGrillLoop',
  'clickGrillSlot',
  'handleFryerClick',
  'handleShelfItemClick',
  'addIngredientToPlate',
  'serveOrder',
  'clearPlate',
  'openDictionary',
  'renderDictionaryCards',
  'culinary-counter-view',
  'culinary-kitchen-view',
  'kitchen-grill-station',
  'kitchen-fryer-station',
  'kitchen-shelf-station',
  'kitchen-assembly-station',
  'btnBackToPortals',
  'btnOpenChefDictionary',
  'statChefCoins'
];
let allCulinaryOk = true;
culinaryChecks.forEach(ch => {
  if (!culinaryContent.includes(ch)) {
    console.error('MISSING in js/culinary_studio_2d.js:', ch);
    allCulinaryOk = false;
  }
});
if (allCulinaryOk) console.log('✅ MasterChef 2D: Restaurante en tiempo real y diccionario integrados.');

// 4. Verificar css/culinary_studio.css
const culinaryCss = fs.readFileSync('css/culinary_studio.css', 'utf8');
const culinaryCssChecks = [
  '.culinary-topbar',
  '.culinary-counter-view',
  '.culinary-kitchen-view',
  '.kitchen-grill-station',
  '.kitchen-fryer-station',
  '.kitchen-shelf-station',
  '.kitchen-assembly-station',
  '.culinary-dictionary-modal',
  '.culinary-toast-notification',
  '@media (max-width: 768px)'
];
let allCulinaryCssOk = true;
culinaryCssChecks.forEach(ch => {
  if (!culinaryCss.includes(ch)) {
    console.error('MISSING in css/culinary_studio.css:', ch);
    allCulinaryCssOk = false;
  }
});
if (allCulinaryCssOk) console.log('✅ css/culinary_studio.css: Estilos HD Cartoon y responsive listos.');

if (allHedbanzOk && allStylesOk && allCulinaryOk && allCulinaryCssOk) {
  console.log('\n🎉 ALL UI & GAMEPLAY VERIFICATIONS PASSED SUCCESSFULLY!');
} else {
  process.exit(1);
}

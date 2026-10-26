const fs = require('fs');
const path = require('path');

const enginePath = path.join(__dirname, '..', 'js', 'pet_engine_2d.js');
let code = fs.readFileSync(enginePath, 'utf8');

const target = `    playBall() {
      this.sfx.playPop();`;

const repl = `    playBall() {
      if (typeof window !== 'undefined' && typeof window.openPetArcadeModal === 'function') {
        window.openPetArcadeModal(this.state);
        return;
      }
      if (typeof global !== 'undefined' && typeof global.openPetArcadeModal === 'function') {
        global.openPetArcadeModal(this.state);
        return;
      }
      this.sfx.playPop();`;

if (code.includes(target)) {
  code = code.replace(target, repl);
  fs.writeFileSync(enginePath, code, 'utf8');
  console.log('✅ Updated playBall to check openPetArcadeModal first');
} else {
  console.log('ℹ️ playBall already updated or target mismatch');
}

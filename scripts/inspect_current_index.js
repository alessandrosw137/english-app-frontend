const fs = require('fs');

const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const lines = html.split('\n');

console.log('Total characters:', html.length);
console.log('Total lines:', lines.length);

const sections = [
  'id="view-auth"',
  'id="view-home"',
  'id="view-path"',
  'id="view-stories"',
  'id="view-music"',
  'id="view-worldtour"',
  'id="threeCanvasContainer"',
  'id="virtualJoystickContainer"',
  'id="threeObjectInspectCard"',
  'WORLD_TOUR_SCENARIOS',
  'initThreeWorldTour',
  'starsCanvasAnimId',
  'switch3DScenario'
];

sections.forEach(s => {
  console.log(`${s}: ${html.includes(s)}`);
});

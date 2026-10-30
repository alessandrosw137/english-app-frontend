const fs = require('fs');

const content = fs.readFileSync('js/world3d.js', 'utf8');
const startIdx = content.indexOf('const WORLD_TOUR_SCENARIOS = {');
if (startIdx === -1) {
  console.log('Not found');
  process.exit(1);
}

// Find matching closing brace
let depth = 0;
let endIdx = -1;
for (let i = startIdx; i < content.length; i++) {
  if (content[i] === '{') depth++;
  else if (content[i] === '}') {
    depth--;
    if (depth === 0) {
      endIdx = i;
      break;
    }
  }
}

const scenarioCode = content.slice(startIdx, endIdx + 1);
const fn = new Function(scenarioCode + '\nreturn WORLD_TOUR_SCENARIOS;');
const scenarios = fn();

for (const [key, scen] of Object.entries(scenarios)) {
  console.log(`\n=================== ${key.toUpperCase()} ===================`);
  console.log(`Title: ${scen.title}, CameraPos: ${JSON.stringify(scen.cameraPos)}, LookAt: ${JSON.stringify(scen.cameraLookAt)}`);
  (scen.objects || []).forEach(o => {
    console.log(`  ${o.id.padEnd(25)} pos:[${o.pos.join(', ')}]  "${o.en}" (${o.type || 'object'})`);
  });
}

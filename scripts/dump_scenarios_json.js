const fs = require('fs');

const content = fs.readFileSync('js/world3d.js', 'utf8');
const startIdx = content.indexOf('const WORLD_TOUR_SCENARIOS = {');
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

const summary = {};
for (const [key, scen] of Object.entries(scenarios)) {
  summary[key] = (scen.objects || []).filter(o => o.type !== 'concept' && o.type !== 'phrase').map(o => ({
    id: o.id,
    en: o.en,
    pos: o.pos
  }));
}

fs.writeFileSync('scripts/scenarios_summary.json', JSON.stringify(summary, null, 2), 'utf8');
console.log('Saved scenarios_summary.json');

const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const startIdx = html.indexOf('const WORLD_TOUR_SCENARIOS = {');
const endIdx = html.indexOf('let activeScenarioKey = \'house\';');
const jsonStr = html.substring(startIdx + 'const WORLD_TOUR_SCENARIOS = '.length, endIdx).trim().replace(/;$/, '');
const scenarios = JSON.parse(jsonStr);

console.log('House objects:', scenarios.house.objects.map(o => o.id));
console.log('Total house objects:', scenarios.house.objects.length);

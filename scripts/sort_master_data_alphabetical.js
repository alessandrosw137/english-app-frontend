const fs = require('fs');
const vm = require('vm');

let code = fs.readFileSync('master_data.js', 'utf8');

// We parse MASTER_MODULES_DATA and re-sort each module
const sb = {
  window: {},
  document: { readyState: 'complete', addEventListener() {}, querySelectorAll() { return []; } }
};
sb.window = sb;
vm.createContext(sb);
vm.runInContext(code, sb);

const data = sb.window.MASTER_MODULES_DATA;
const keys = [
  'phrasal_verbs',
  'difficult_verbs',
  'power_adjectives',
  'native_idioms',
  'connectors_linking',
  'false_friends',
  'collocations',
  'business_tech',
  'travel_survival',
  'toefl_academic'
];

keys.forEach(k => {
  if (data[k] && Array.isArray(data[k].items)) {
    data[k].items.sort((a, b) =>
      (a.term || a.word || '').localeCompare((b.term || b.word || ''), 'en', { sensitivity: 'base' })
    );
    console.log(`Sorted ${k}: ${data[k].items.length} items. First 3:`, data[k].items.slice(0, 3).map(i => i.term));
  }
});

// Now we rebuild the master_data.js file preserving everything, with sorted MASTER_MODULES_DATA
const karaokeIdx = code.indexOf('// 1. REFINED KARAOKE & READING DATASETS WITH TIMESTAMPS & KEYWORDS');
const enginesSection = karaokeIdx !== -1 ? code.substring(karaokeIdx) : '';

let newCode = `// MASTER_DATA.JS — BASE DE DATOS MAESTRA DE MASTERENG
// 10 MÓDULOS TEMÁTICOS PUROS CON EXACTAMENTE 100 TÉRMINOS CADA UNO (1,000 TÉRMINOS TOTALES)
// ORDENAMIENTO ALFABÉTICO ESTRICTO (A - Z) EN TODOS LOS MÓDULOS

window.MASTER_MODULES_DATA = {\n`;

keys.forEach((k, idx) => {
  const mod = data[k];
  newCode += `  ${JSON.stringify(k)}: {\n`;
  newCode += `    title: ${JSON.stringify(mod.title)},\n`;
  newCode += `    level: ${JSON.stringify(mod.level)},\n`;
  newCode += `    category: ${JSON.stringify(mod.category)},\n`;
  newCode += `    badge: ${JSON.stringify(mod.badge)},\n`;
  newCode += `    icon: ${JSON.stringify(mod.icon)},\n`;
  newCode += `    total: ${mod.items.length},\n`;
  newCode += `    items: [\n`;
  mod.items.forEach((item, iIdx) => {
    newCode += `      ${JSON.stringify(item)}${iIdx < mod.items.length - 1 ? ',' : ''}\n`;
  });
  newCode += `    ]\n  }${idx < keys.length - 1 ? ',' : ''}\n`;
});

newCode += `};\n\n`;

// Aliases
newCode += `// Alias para compatibilidad con código legado
window.MASTER_MODULES_DATA['everyday_actions'] = window.MASTER_MODULES_DATA['phrasal_verbs'];
window.MASTER_MODULES_DATA['connectors'] = window.MASTER_MODULES_DATA['connectors_linking'];
window.MASTER_MODULES_DATA['social_dating'] = window.MASTER_MODULES_DATA['power_adjectives'];
window.MASTER_MODULES_DATA['professional_english'] = window.MASTER_MODULES_DATA['business_tech'];
window.MASTER_MODULES_DATA['idioms_slang'] = window.MASTER_MODULES_DATA['native_idioms'];
window.MASTER_MODULES_DATA['common_confusions'] = window.MASTER_MODULES_DATA['false_friends'];
window.MASTER_MODULES_DATA['collocations_phrases'] = window.MASTER_MODULES_DATA['collocations'];
window.MASTER_MODULES_DATA['grammar_path'] = window.MASTER_MODULES_DATA['difficult_verbs'];
window.MASTER_MODULES_DATA['toefl_simulator'] = window.MASTER_MODULES_DATA['toefl_academic'];
window.MASTER_MODULES_DATA['internet_slang'] = window.MASTER_MODULES_DATA['native_idioms'];

window.VOCAB_ENGINE = (function() {
  function search(query, limit = 50) {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    const results = [];
    Object.keys(window.MASTER_MODULES_DATA).forEach(key => {
      const mod = window.MASTER_MODULES_DATA[key];
      if (mod && Array.isArray(mod.items)) {
        mod.items.forEach(item => {
          if (
            (item.term && item.term.toLowerCase().includes(q)) ||
            (item.meaning && item.meaning.toLowerCase().includes(q)) ||
            (item.example && item.example.toLowerCase().includes(q))
          ) {
            results.push({ ...item, moduleKey: key });
          }
        });
      }
    });
    return results.slice(0, limit);
  }

  function getModuleItems(moduleKey) {
    const mod = window.MASTER_MODULES_DATA[moduleKey];
    return (mod && Array.isArray(mod.items)) ? mod.items : [];
  }

  return { search, getModuleItems };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MASTER_MODULES_DATA: window.MASTER_MODULES_DATA, VOCAB_ENGINE: window.VOCAB_ENGINE };
}
\n\n`;

if (enginesSection) {
  newCode += enginesSection;
}

fs.writeFileSync('master_data.js', newCode, 'utf8');
console.log('✅ master_data.js updated with all 10 modules strictly sorted A-Z!');

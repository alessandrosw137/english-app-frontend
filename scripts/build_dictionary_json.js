const fs = require('fs');
const path = require('path');

// Mock browser environment to evaluate master_data.js
global.window = {};
global.document = { readyState: 'complete', addEventListener: () => {}, querySelectorAll: () => [] };

const masterDataPath = path.resolve(__dirname, '../master_data.js');
require(masterDataPath);

const moduleConfigs = [
  {
    id: 1,
    key: 'phrasal_verbs',
    title: 'Módulo 01: 100 Essential Phrasal Verbs',
    name: '100 Essential Phrasal Verbs',
    level: 'A1-B1',
    category: 'Phrasal Verb'
  },
  {
    id: 2,
    key: 'difficult_verbs',
    title: 'Módulo 02: 100 Difficult & Common Verbs',
    name: '100 Difficult & Common Verbs',
    level: 'A2-B1',
    category: 'Verbo'
  },
  {
    id: 3,
    key: 'power_adjectives',
    title: 'Módulo 03: 100 Power Adjectives & Descriptions',
    name: '100 Power Adjectives & Descriptions',
    level: 'B1-B2',
    category: 'Adjetivo'
  },
  {
    id: 4,
    key: 'native_idioms',
    title: 'Módulo 04: 100 Native Idioms & Slang Expressions',
    name: '100 Native Idioms & Slang Expressions',
    level: 'B2',
    category: 'Idiom'
  },
  {
    id: 5,
    key: 'connectors_linking',
    title: 'Módulo 05: 100 Connectors & Linking Words',
    name: '100 Connectors & Linking Words',
    level: 'B2-C1',
    category: 'Conector'
  },
  {
    id: 6,
    key: 'false_friends',
    title: 'Módulo 06: 100 False Friends & Confusing Words',
    name: '100 False Friends & Confusing Words',
    level: 'B2',
    category: 'Falso Amigo'
  },
  {
    id: 7,
    key: 'collocations',
    title: 'Módulo 07: 100 Prepositional Phrases & Collocations',
    name: '100 Prepositional Phrases & Collocations',
    level: 'B2-C1',
    category: 'Collocation'
  },
  {
    id: 8,
    key: 'business_tech',
    title: 'Módulo 08: 100 Business, Tech & Engineering Terms',
    name: '100 Business, Tech & Engineering Terms',
    level: 'C1',
    category: 'Negocios & Tech'
  },
  {
    id: 9,
    key: 'travel_survival',
    title: 'Módulo 09: 100 Travel, Airport & Daily Survival',
    name: '100 Travel, Airport & Daily Survival',
    level: 'A2-B1',
    category: 'Viajes & Supervivencia'
  },
  {
    id: 10,
    key: 'toefl_academic',
    title: 'Módulo 10: 100 Academic & High-Score TOEFL Words',
    name: '100 Academic & High-Score TOEFL Words',
    level: 'C1-C2',
    category: 'Académico TOEFL'
  }
];

// Deduplicate Module 06 (false_friends)
const ffItems = window.MASTER_MODULES_DATA['false_friends'].items;
ffItems[32] = {
  term: 'Diverse',
  pron: '/daɪˈvɝːs/',
  category: 'Falso Amigo',
  meaning: 'Diverso, variado o heterogéneo (NO: divertido)',
  example: 'The research institute employs scholars from diverse academic disciplines.'
};
ffItems[59] = {
  term: 'Misery',
  pron: '/ˈmɪz.ɚ.i/',
  category: 'Falso Amigo',
  meaning: 'Gran sufrimiento o tristeza profunda (NO: miseria económica exclusivamente)',
  example: 'Severe drought brought untold misery to rural farming families.'
};
ffItems[85] = {
  term: 'Relative',
  pron: '/ˈrel.ə.t̬ɪv/',
  category: 'Falso Amigo',
  meaning: 'Pariente o familiar consanguíneo (NO: relativo exclusivamente)',
  example: 'All close relatives gathered at the estate for the annual reunion.'
};
ffItems[92] = {
  term: 'Support',
  pron: '/səˈpɔːrt/',
  category: 'Falso Amigo',
  meaning: 'Apoyar, sostener o respaldar económica y moralmente (NO: soportar/tolerar)',
  example: 'Mentors actively support first-generation college students through graduation.'
};

// Deduplicate Module 07 (collocations)
const colItems = window.MASTER_MODULES_DATA['collocations'].items;
colItems[26] = {
  term: 'By surprise',
  pron: '/baɪ sɚˈpraɪz/',
  category: 'Collocation',
  meaning: 'Por sorpresa o de manera imprevista',
  example: 'The sudden tropical thunderstorm caught the unprepared tourists by surprise.'
};

// Check 'Ask out' in Module 01
const p1Items = window.MASTER_MODULES_DATA['phrasal_verbs'].items;
const askOutItem = p1Items.find(i => i.term.toLowerCase() === 'ask out');
if (askOutItem) {
  askOutItem.term = 'Ask out';
  askOutItem.pron = '/ɑːsk aʊt/';
  askOutItem.meaning = 'Invitar a salir a alguien en una cita romántica';
  askOutItem.example = 'He finally gathered the courage to ask her out for coffee.';
}

const dictionaryResult = {
  metadata: {
    title: 'MasterENG • Diccionario Oficial de Inmersión y Certificación TOEFL',
    author: 'Wilberth Alessandro Molina Cutz',
    total_modules: 10,
    total_terms: 1000,
    version: '2.0.0',
    created_at: new Date().toISOString()
  },
  modules: []
};

let globalTotal = 0;

moduleConfigs.forEach(mc => {
  const rawItems = window.MASTER_MODULES_DATA[mc.key].items;

  // Deduplicate by term just in case
  const uniqueMap = new Map();
  rawItems.forEach(item => {
    const wordKey = (item.term || item.word).trim().toLowerCase();
    if (!uniqueMap.has(wordKey)) {
      uniqueMap.set(wordKey, item);
    }
  });

  const uniqueList = Array.from(uniqueMap.values());
  if (uniqueList.length !== 100) {
    throw new Error(`Module ${mc.key} does not have exactly 100 unique items! Has: ${uniqueList.length}`);
  }

  // Sort strictly A-Z by word
  uniqueList.sort((a, b) => {
    const wA = (a.term || a.word).trim();
    const wB = (b.term || b.word).trim();
    return wA.localeCompare(wB, 'en', { sensitivity: 'base' });
  });

  // Number sequentially from 1 to 100 and map to strict schema
  const formattedWords = uniqueList.map((item, index) => {
    return {
      id: index + 1,
      word: (item.term || item.word).trim(),
      ipa: (item.pron || item.ipa).trim(),
      category: mc.category,
      translation: (item.meaning || item.translation).trim(),
      example: (item.example || '').trim()
    };
  });

  const moduleObj = {
    id: mc.id,
    key: mc.key,
    title: mc.title,
    name: mc.name,
    level: mc.level,
    category: mc.category,
    total: formattedWords.length,
    words: formattedWords
  };

  dictionaryResult.modules.push(moduleObj);
  // Also provide direct access by key and string id
  dictionaryResult[mc.key] = formattedWords;
  dictionaryResult[String(mc.id)] = formattedWords;
  dictionaryResult[mc.title] = formattedWords;

  globalTotal += formattedWords.length;
  console.log(`✅ ${mc.title}: 100 términos estrictos A-Z (IDs #01-#100)`);
});

console.log(`\n🎉 Gran Total de términos procesados: ${globalTotal}`);

if (globalTotal !== 1000) {
  throw new Error(`Expected 1000 terms, got ${globalTotal}`);
}

const jsonString = JSON.stringify(dictionaryResult, null, 2);

// Target file paths
const targetPaths = [
  path.resolve(__dirname, '../data/dictionary.json'),
  path.resolve(__dirname, '../../data/dictionary.json')
];

targetPaths.forEach(p => {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(p, jsonString, 'utf8');
  console.log(`✅ Guardado exitosamente en: ${p} (${Buffer.byteLength(jsonString, 'utf8')} bytes)`);
});

// Update master_data.js in both locations so they are in 100% sync
const masterDataTargets = [
  path.resolve(__dirname, '../master_data.js'),
  path.resolve(__dirname, '../../master_data.js')
];

masterDataTargets.forEach(target => {
  if (fs.existsSync(target)) {
    let mdContent = fs.readFileSync(target, 'utf8');
    moduleConfigs.forEach(mc => {
      const words = dictionaryResult[mc.key];
      // Format as array of items: { term, pron, meaning, example, category }
      const itemsFormatted = words.map(w => ({
        term: w.word,
        pron: w.ipa,
        meaning: w.translation,
        example: w.example,
        category: w.category
      }));
      // Replace the module block in window.MASTER_MODULES_DATA
      const keyRegex = new RegExp(`"${mc.key}":\\s*\\{[\\s\\S]*?items:\\s*\\[[\\s\\S]*?\\n\\s*\\]\\s*\\}`, 'm');
      const newBlock = `"${mc.key}": {\n    title: "${mc.title}",\n    level: "${mc.level}",\n    category: "${mc.category}",\n    badge: "${mc.category}",\n    total: 100,\n    items: ${JSON.stringify(itemsFormatted, null, 6).replace(/\\n/g, '\n    ')}\n  }`;
      if (keyRegex.test(mdContent)) {
        mdContent = mdContent.replace(keyRegex, newBlock);
      }
    });
    fs.writeFileSync(target, mdContent, 'utf8');
    console.log(`✅ master_data.js sincronizado en: ${target}`);
  }
});

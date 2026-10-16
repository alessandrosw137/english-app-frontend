const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('Unifying stories logic and removing duplicate stubs...');

// 1. En la primera ocurrencia (alrededor de index 396000), dejar solo renderStorySelector y downloadStoryPdf, sin duplicar selectStory
const stubTarget = `function selectStory(idx) {
      currentStoryIndex = idx;
      renderStorySelector();
      renderActiveStory();
    }`;

if (html.includes(stubTarget)) {
  html = html.replace(stubTarget, `// selectStory consolidado en el módulo principal`);
  console.log('✅ Eliminado stub duplicado selectStory.');
}

// 2. En la segunda ocurrencia (la real), agregar renderStorySelector() dentro de selectStory(idx)
const realTarget = `function selectStory(idx) {
      currentStoryIndex = idx;
      const story = STORIES_DATA[idx];
      if (!story) return;

      stopStoryNarration();

      for (let i = 0; i < STORIES_DATA.length; i++) {
        const tab = document.getElementById(\`storyTab-\${i}\`);
        if (!tab) continue;
        if (i === idx) {
          tab.className = "story-tab-btn text-left p-4 rounded-2xl bg-[#1e293b] border border-emerald-500/60 transition cursor-pointer flex flex-col justify-between shadow-md";
        } else {
          tab.className = "story-tab-btn text-left p-4 rounded-2xl bg-[#1e293b] border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between shadow-sm";
        }
      }`;

const realReplacement = `function selectStory(idx) {
      currentStoryIndex = idx;
      const story = STORIES_DATA[idx];
      if (!story) return;

      stopStoryNarration();
      renderStorySelector();`;

if (html.includes(realTarget)) {
  html = html.replace(realTarget, realReplacement);
  console.log('✅ selectStory principal actualizado para llamar a renderStorySelector() dinámicamente.');
} else {
  console.warn('⚠️ No se encontró realTarget exacto.');
}

// 3. Eliminar emojis de toggleBilingualStoryMode
html = html.replace('"🌐 Ocultar Español"', '"Ocultar Español"');
html = html.replace('"🌐 Modo Bilingüe"', '"Modo Bilingüe"');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Stories logic unified successfully.');

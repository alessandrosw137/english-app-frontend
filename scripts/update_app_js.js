const fs = require('fs');
const path = require('path');

const appJsPath = path.resolve(__dirname, '../js/app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

console.log('Original app.js length:', content.length);

// 1. Update renderGlossaryItems
const oldRenderRegex = /function renderGlossaryItems\(items\)\s*\{[\s\S]*?renderGlossaryItems\(sortedFiltered\);\s*\}/;

const newRenderCode = `function renderGlossaryItems(items) {
      const container = document.getElementById('glossaryTermsContainer');
      if (!container) return;

      if (!items || items.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 text-center py-6">No se encontraron términos con ese filtro en este módulo.</p>';
        return;
      }

      // Orden alfabético estricto (A - Z) antes de asignar la numeración secuencial (#01, #02... #100)
      const sortedItems = [...items].sort((a, b) => {
        const wA = (a.word || a.term || '').trim();
        const wB = (b.word || b.term || '').trim();
        return wA.localeCompare(wB, 'en', { sensitivity: 'base' });
      });

      container.innerHTML = sortedItems.map((item, idx) => {
        const numStr = String(idx + 1).padStart(2, '0');
        const cat = item.category || 'Sustantivo';
        const badgeCls = getCategoryBadgeColors(cat);
        const wordText = item.word || item.term || '';
        const ipaText = item.ipa || item.pron || '';
        const transText = item.translation || item.meaning || '';
        const exText = item.example || '';
        const safeWord = wordText.replace(/\\\\/g, "\\\\\\\\").replace(/'/g, "\\\\'");
        const safeEx = exText.replace(/\\\\/g, "\\\\\\\\").replace(/'/g, "\\\\'");

        return \`
        <div class="p-3.5 rounded-2xl bg-slate-800/85 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-[10px] font-mono font-black text-amber-400">#\${numStr}</span>
              <span class="text-sm sm:text-base font-black text-white">\${wordText}</span>
              <span class="text-xs text-amber-300 font-mono bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/60">\${ipaText}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border \${badgeCls}">\${cat}</span>
              <button type="button" onclick="if(window.speakGlossaryWord){window.speakGlossaryWord('\${safeWord}');}else{speakText('\${safeWord}', 0.9);}" class="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold transition cursor-pointer flex items-center gap-1" title="Escuchar pronunciación nativa">
                <span>🔊</span>
                <span class="text-[10px]">Pronunciar</span>
              </button>
            </div>
            <p class="text-xs sm:text-sm text-emerald-300 font-bold mt-1.5">🇪🇸 \${transText}</p>
            <div class="mt-1.5 bg-slate-900/75 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <p class="text-xs text-slate-300 italic">"<span class="text-slate-100">\${exText}</span>"</p>
              \${exText ? \`<button type="button" onclick="if(window.speakGlossaryWord){window.speakGlossaryWord('\${safeEx}', 0.9);}else{speakText('\${safeEx}', 0.9);}" class="shrink-0 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs cursor-pointer" title="Escuchar oración de ejemplo">🔊</button>\` : ''}
            </div>
          </div>
        </div>
      \`;
      }).join('');
    }

    function filterGlossaryTerms(query) {
      enrichMasterModulesDictionary();
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey])
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey]
        : { items: [] };
      const q = (query || '').toLowerCase().trim();
      const filtered = (modData.items || []).filter(i => {
        const matchesCat = (activeGlossaryCategoryFilter === 'all') || (i.category === activeGlossaryCategoryFilter);
        if (!matchesCat) return false;
        if (!q) return true;
        const w = (i.word || i.term || '').toLowerCase();
        const p = (i.ipa || i.pron || '').toLowerCase();
        const c = (i.category || '').toLowerCase();
        const t = (i.translation || i.meaning || '').toLowerCase();
        const ex = (i.example || '').toLowerCase();
        return (
          w.includes(q) ||
          p.includes(q) ||
          c.includes(q) ||
          t.includes(q) ||
          ex.includes(q)
        );
      });
      const sortedFiltered = [...filtered].sort((a, b) => {
        const wA = (a.word || a.term || '').trim();
        const wB = (b.word || b.term || '').trim();
        return wA.localeCompare(wB, 'en', { sensitivity: 'base' });
      });
      renderGlossaryItems(sortedFiltered);
    }`;

if (oldRenderRegex.test(content)) {
  content = content.replace(oldRenderRegex, () => newRenderCode);
  console.log('✅ Updated renderGlossaryItems & filterGlossaryTerms');
} else {
  console.warn('⚠️ oldRenderRegex not found');
}

// 2. Update downloadActiveGlossaryPdf to delegate to window.PDF_GENERATOR
const oldDownloadRegex = /function downloadActiveGlossaryPdf\(\)\s*\{[\s\S]*?const modId = arguments\[0\];/;

const newDownloadHeader = `function downloadActiveGlossaryPdf(modId) {
      if (window.PDF_GENERATOR && typeof window.PDF_GENERATOR.generateModulePdf === 'function') {
        return window.PDF_GENERATOR.generateModulePdf(modId || activeGlossaryModuleKey);
      }
      enrichMasterModulesDictionary();
      const resolvedId = modId || arguments[0];`;

if (oldDownloadRegex.test(content)) {
  content = content.replace(oldDownloadRegex, () => newDownloadHeader);
  console.log('✅ Updated downloadActiveGlossaryPdf delegation');
} else {
  console.warn('⚠️ oldDownloadRegex not found');
}

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('Successfully written to ENGLISH-/js/app.js. New length:', content.length);

// Also copy to parent ENGLISH/js/app.js
const parentAppJs = path.resolve(__dirname, '../../js/app.js');
if (fs.existsSync(path.dirname(parentAppJs))) {
  fs.writeFileSync(parentAppJs, content, 'utf8');
  console.log('Successfully copied to parent js/app.js');
}

// Also copy to app/src/main/assets/js/app.js
const assetsAppJs = path.resolve(__dirname, '../app/src/main/assets/js/app.js');
if (fs.existsSync(path.dirname(assetsAppJs))) {
  fs.writeFileSync(assetsAppJs, content, 'utf8');
  console.log('Successfully copied to app/src/main/assets/js/app.js');
}

const fs = require('fs');

let code = fs.readFileSync('scripts/build_unified_app_v2.js', 'utf8');

const target = 'closeGlossaryModal()" class="w-8 h-8 rounded-xl bg-slate-800';
const backBtn = `closeGlossaryModal()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer" title="Cerrar y Volver">
            <span class="text-amber-400 font-bold">←</span>
            <span>Volver</span>
          </button>
          <button onclick="closeGlossaryModal()" class="w-8 h-8 rounded-xl bg-slate-800`;

if (code.includes(target) && !code.includes('title="Cerrar y Volver"')) {
  code = code.replace(target, backBtn);
  fs.writeFileSync('scripts/build_unified_app_v2.js', code, 'utf8');
  console.log('✅ Added "← Volver" to glossaryModal in builder');
} else {
  console.log('Glossary already has Volver button or already modified');
}

const fs = require('fs');

let code = fs.readFileSync('scripts/build_unified_app_v2.js', 'utf8');

const target = '<button onclick="closeGlossaryModal()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base">';
const replacement = `<button onclick="closeGlossaryModal()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer" title="Cerrar y Volver">
            <span class="text-amber-400 font-bold">←</span>
            <span>Volver</span>
          </button>
          <button onclick="closeGlossaryModal()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base">`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('scripts/build_unified_app_v2.js', code, 'utf8');
  console.log('✅ Added "← Volver" button to glossaryModal header');
} else {
  console.log('Target not found in glossaryModal');
}

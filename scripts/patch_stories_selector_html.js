const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const target = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <!-- Story 0: The Three Little Pigs -->
          <button onclick="selectStory(0)" id="storyTab-0" class="story-tab-btn text-left p-4 rounded-2xl bg-[#1e293b] border border-emerald-500/60 transition cursor-pointer flex flex-col justify-between shadow-sm hover:border-emerald-500/80">
            <div>
              <div class="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-1.5">
                <span class="bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">Relato 1</span>
                <span class="text-slate-400">Fábula Clásica</span>
              </div>
              <h3 class="text-sm sm:text-base font-bold text-slate-100">The Three Little Pigs</h3>
              <p class="text-xs text-slate-400 mt-1 line-clamp-2">Los tres cerditos y el lobo feroz: esfuerzo, perseverancia y construcción sólida.</p>
            </div>
            <span class="text-xs font-semibold text-emerald-400 mt-3 flex items-center gap-1">Lectura activa &rarr;</span>
          </button>

          <!-- Story 1: Little Red Riding Hood -->
          <button onclick="selectStory(1)" id="storyTab-1" class="story-tab-btn text-left p-4 rounded-2xl bg-[#1e293b] border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between shadow-sm">
            <div>
              <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span class="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded font-bold">Relato 2</span>
                <span>Cuento Popular</span>
              </div>
              <h3 class="text-sm sm:text-base font-bold text-slate-100">Little Red Riding Hood</h3>
              <p class="text-xs text-slate-400 mt-1 line-clamp-2">Caperucita Roja: la travesía por el bosque encantado hacia la cabaña de la abuela.</p>
            </div>
            <span class="text-xs font-semibold text-slate-400 mt-3 flex items-center gap-1">Seleccionar relato &rarr;</span>
          </button>

          <!-- Story 2: Goldilocks and the Three Bears -->
          <button onclick="selectStory(2)" id="storyTab-2" class="story-tab-btn text-left p-4 rounded-2xl bg-[#1e293b] border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between shadow-sm">
            <div>
              <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span class="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded font-bold">Relato 3</span>
                <span>Fábula Moral</span>
              </div>
              <h3 class="text-sm sm:text-base font-bold text-slate-100">Goldilocks and the Three Bears</h3>
              <p class="text-xs text-slate-400 mt-1 line-clamp-2">Ricitos de Oro y los tres osos: curiosidad y respeto por lo ajeno en el bosque.</p>
            </div>
            <span class="text-xs font-semibold text-slate-400 mt-3 flex items-center gap-1">Seleccionar relato &rarr;</span>
          </button>

          <!-- Story 3: The Tortoise and the Hare -->
          <button onclick="selectStory(3)" id="storyTab-3" class="story-tab-btn text-left p-4 rounded-2xl bg-[#1e293b] border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between shadow-sm">
            <div>
              <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span class="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded font-bold">Relato 4</span>
                <span>Fábula de Esopo</span>
              </div>
              <h3 class="text-sm sm:text-base font-bold text-slate-100">The Tortoise and the Hare</h3>
              <p class="text-xs text-slate-400 mt-1 line-clamp-2">La liebre y la tortuga: la constancia y la humildad triunfan sobre la arrogancia.</p>
            </div>
            <span class="text-xs font-semibold text-slate-400 mt-3 flex items-center gap-1">Seleccionar relato &rarr;</span>
          </button>
        </div>`;

const replacement = `<div id="storiesSelectorContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <!-- Renderizado dinámicamente para las 6 obras maestras clásicas sin emojis -->
        </div>`;

const targetNormalized = target.replace(/\r\n/g, '\n');
const htmlNormalized = html.replace(/\r\n/g, '\n');

if (htmlNormalized.includes(targetNormalized)) {
  html = htmlNormalized.replace(targetNormalized, replacement);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('✅ Grid estático de cuentos reemplazado por #storiesSelectorContainer dinámico.');
} else {
  console.error('❌ Could not find target in html.');
}

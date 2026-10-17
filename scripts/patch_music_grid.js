const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.resolve(rootDir, 'app/src/main/assets');
const parentDir = path.resolve(rootDir, '..');

const htmlPath = path.join(rootDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const target = `          <button type="button" onclick="window.searchGlobalMusic()"
            class="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-95">
            <span>▶️ Buscar / Cargar</span>
          </button>
        </div>`;

const replacement = `          <button type="button" onclick="window.searchGlobalMusic()"
            class="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-95">
            <span>▶️ Buscar / Cargar</span>
          </button>
        </div>

        <!-- CUADRÍCULA DE RESULTADOS DE BÚSQUEDA GLOBAL ITUNES -->
        <div id="musicResultsGrid" class="music-results-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 hidden" style="display: none;"></div>`;

if (!html.includes('music-results-grid')) {
  html = html.replace(target, replacement);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Injected music-results-grid into index.html');
}

// Exact mirror
const buf = fs.readFileSync(htmlPath);
fs.writeFileSync(path.join(assetsDir, 'index.html'), buf);
fs.writeFileSync(path.join(parentDir, 'index.html'), buf);
console.log('index.html mirrored to assets and parent.');

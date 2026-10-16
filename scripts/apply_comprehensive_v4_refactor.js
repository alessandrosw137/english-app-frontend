const fs = require('fs');

console.log('=== STARTING COMPREHENSIVE V4 REFACTOR ===');

let html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

// ========================================================
// 1. REQUISITO 1: CORRECCIÓN DEL DOM Y AISLAMIENTO DE MÓDULOS
// ========================================================
console.log('1. Verificando DOM y aislamiento de Music Session y 3D Mount...');

// 1.1 Asegurar que view-worldtour tenga los dos botones de alternar escenarios
const oldScenarioHeaderRegex = /<div class="flex items-center gap-2">\s*<span\s*class="text-xs font-bold text-purple-400 bg-purple-500\/10 px-3 py-1 rounded-full border border-purple-500\/30">\s*🪐 World Tour 3D &bull; House & Rooms\s*<\/span>\s*<\/div>/;

const newScenarioHeader = `<div class="flex items-center gap-2">
        <button id="scenarioBtnHouse" onclick="switch3DScenario('house')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer bg-purple-600 text-white border border-purple-400">
          <span>🏠 House & Rooms (15 Objetos)</span>
        </button>
        <button id="scenarioBtnGarden" onclick="switch3DScenario('garden')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-slate-800 text-slate-300 hover:text-white border border-slate-700">
          <span>🌿 Backyard & Garden (12 Objetos)</span>
        </button>
      </div>`;

if (oldScenarioHeaderRegex.test(html)) {
  html = html.replace(oldScenarioHeaderRegex, newScenarioHeader);
  console.log('✅ Selector de escenarios (House / Garden) inyectado en el encabezado de view-worldtour');
} else {
  console.log('ℹ️ Selector de escenarios ya presente o patrón modificado');
}

// 1.2 Asegurar que #threeWebGLMount exista dentro de #threeCanvasContainer
if (!html.includes('id="threeWebGLMount"')) {
  html = html.replace(
    '<div id="threeCanvasContainer" class="w-full relative select-none"',
    '<div id="threeCanvasContainer" class="w-full relative select-none">\n        <div id="threeWebGLMount" class="absolute inset-0 w-full h-full z-10"></div>'
  );
  console.log('✅ #threeWebGLMount inyectado dentro de #threeCanvasContainer');
}

// 1.3 Asegurar que en showView y goToHomePortals se pause el video de YouTube y no quede rastro musical
const oldShowViewFunc = `    function showView(viewId) {
      const views = ['view-auth', 'view-home', 'view-path', 'view-stories', 'view-music', 'view-worldtour'];
      views.forEach(v => {
        const el = document.getElementById(v);
        if (el) {
          if (v === viewId) {
            el.classList.remove('hidden');
          } else {
            el.classList.add('hidden');
          }
        }
      });
      currentActiveView = viewId;

      // Pausar video de YouTube si se abandona Music Session
      if (viewId !== 'view-music') {
        pauseYouTubePlayer();
      }

      // El botón superior universal se oculta por completo al mostrar cualquier vista
      const universalBtn = document.getElementById('universalExitBtn');
      if (universalBtn) {
        universalBtn.style.display = 'none';
        universalBtn.classList.add('hidden');
      }

      const robot = document.getElementById('draggableRobotWidget');
      if (robot) {
        if (viewId === 'view-auth' || viewId === 'view-home') {
          robot.classList.add('hidden');
        } else {
          robot.classList.remove('hidden');
        }
      }

      const roulette = document.getElementById('draggableRouletteWidget');
      if (roulette) {
        if (viewId === 'view-home') {
          roulette.classList.remove('hidden');
        } else {
          roulette.classList.add('hidden');
        }
      }

      if (viewId === 'view-home') {
        startPortalStars();
      } else {
        stopPortalStars();
      }

      if (viewId === 'view-worldtour') {
        initThreeWorldTour();
      }
    }`;

// Reemplazar la función showView
const rxShowView = /function showView\(viewId\)[\s\S]*?\n    function goToHomePortals\(\)/;
if (rxShowView.test(html)) {
  html = html.replace(rxShowView, `${oldShowViewFunc}\n\n    function goToHomePortals()`);
  console.log('✅ showView actualizado con aislamiento estricto y pausa de YouTube');
}

// ========================================================
// 2. REQUISITO 5: ACTUALIZACIÓN DE STORIES (EVITAR UNDEFINED)
// ========================================================
console.log('2. Actualizando lógica de cuentos (Stories) para evitar errores undefined...');

const oldLoadStoryViewerRegex = /function loadStoryViewer\(idx\)[\s\S]*?\n    function toggleBilingualStoryMode\(\)/;
const newLoadStoryViewer = `function loadStoryViewer(idx) {
      const story = STORIES_DATA[idx];
      if (!story) return;

      const titleEl = document.getElementById('activeStoryTitle');
      const subtitleEl = document.getElementById('activeStorySubtitle');
      const diffEl = document.getElementById('activeStoryDifficulty');
      const illEl = document.getElementById('activeStoryIllustration');
      const pContainer = document.getElementById('storyParagraphsContainer');

      if (titleEl) titleEl.textContent = story.title || 'Cuento';
      if (subtitleEl) subtitleEl.textContent = story.titleEs || story.title_es || story.title || '';
      if (diffEl) diffEl.textContent = story.level || story.difficulty || 'Nivel A2';
      if (illEl) illEl.innerHTML = story.illustrationSvg || '<div class="text-4xl text-emerald-400">📖</div>';

      if (pContainer && story.paragraphs) {
        pContainer.innerHTML = story.paragraphs.map((p, pIdx) => {
          const safeEn = (p.en || '').replace(/'/g, "\\\\'");
          return \`
          <div class="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div class="flex items-start justify-between gap-3">
              <p class="text-sm font-semibold text-white leading-relaxed">\${p.en || ''}</p>
              <div class="flex items-center gap-1.5 shrink-0">
                <button onclick="speakText('\${safeEn}')" class="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition cursor-pointer" title="Escuchar pronunciación nativa">🔊</button>
                <button onclick="startVoicePracticeParagraph(\${pIdx}, '\${safeEn}')" class="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs transition cursor-pointer" title="Practicar pronunciación (+50 EXP)">🎤</button>
              </div>
            </div>
            \${isBilingualStoryModeActive ? \`<p class="text-xs text-slate-400 italic pt-1 border-t border-slate-700/40">\${p.es || ''}</p>\` : ''}
            <div id="voiceFeedback-\${pIdx}" class="text-[11px] font-mono font-bold text-emerald-400 hidden pt-1"></div>
          </div>
        \`;
        }).join('');
      }
    }

    function toggleBilingualStoryMode()`;

if (oldLoadStoryViewerRegex.test(html)) {
  html = html.replace(oldLoadStoryViewerRegex, newLoadStoryViewer);
  console.log('✅ loadStoryViewer actualizado con vinculación segura de illustrationSvg, titleEs y level');
}

// 2.2 Asegurar declaración de starsCanvasAnimId al inicio del script
if (!html.includes('let starsCanvasAnimId = null;')) {
  html = html.replace('<script>\n    // ========================================================', '<script>\n    let starsCanvasAnimId = null;\n    // ========================================================');
  console.log('✅ let starsCanvasAnimId = null; declarado globalmente');
}

fs.writeFileSync('app/src/main/assets/index.html', html, 'utf8');
console.log('✅ Paso 1 y 2 guardados correctamente.');

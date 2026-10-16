const fs = require('fs');
const path = require('path');

let code = fs.readFileSync('scripts/build_unified_app_v2.js', 'utf8');

console.log('=== APLICANDO ACTUALIZACIÓN INTEGRAL V3 ===');

// ========================================================
// 1. REQUISITO 2: BOTÓN UNIVERSAL DE RETORNO Y PANTALLA DE CARGA
// ========================================================
console.log('Paso 1: Ajustando visibilidad del botón universal de retorno...');

// El botón universal debe estar oculto por defecto con display: none
const oldBtnStr = '<button id="universalExitBtn" onclick="forceReturnToHome()" \n    class="fixed top-3 left-3 z-[9999] flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 border-2 border-sky-500/70 hover:border-sky-400 text-white font-bold text-xs shadow-2xl shadow-sky-950/80 backdrop-blur-md transition-all cursor-pointer group active:scale-95"\n    title="Volver al Menú Principal">\n    <span class="text-sky-400 text-sm group-hover:-translate-x-1 transition-transform">←</span>\n    <span>Volver al Menú Principal</span>\n  </button>';

const newBtnStr = `<button id="universalExitBtn" onclick="forceReturnToHome()" style="display: none;"
    class="fixed top-3 left-3 z-[9999] flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 border-2 border-sky-500/70 hover:border-sky-400 text-white font-bold text-xs shadow-2xl shadow-sky-950/80 backdrop-blur-md transition-all cursor-pointer group active:scale-95 hidden"
    title="Volver al Menú Principal">
    <span class="text-sky-400 text-sm group-hover:-translate-x-1 transition-transform">←</span>
    <span>Volver al Menú Principal</span>
  </button>`;

if (code.includes('id="universalExitBtn"')) {
  code = code.replace(/<button id="universalExitBtn"[\s\S]*?<\/button>/, newBtnStr);
  console.log('✅ Botón universal configurado con style="display: none;" por defecto');
}

// En showView(), el botón universal debe ser estrictamente display: none
const showViewUniversalRegex = /\/\/ Botón universal:[\s\S]*?universalBtn\.classList\.remove\('hidden'\);\s*\}/;
const newShowViewUniversal = `// El botón superior universal se muestra ÚNICAMENTE mientras la pantalla de carga está activa
      const universalBtn = document.getElementById('universalExitBtn');
      if (universalBtn) {
        universalBtn.style.display = 'none';
        universalBtn.classList.add('hidden');
      }`;

if (showViewUniversalRegex.test(code)) {
  code = code.replace(showViewUniversalRegex, newShowViewUniversal);
  console.log('✅ showView actualizado: botón superior universal forzado a display: none');
}

// En todos los módulos, el botón integrado del encabezado debe ser "← Volver a Portales"
code = code.replace(/<span>← Volver al Menú Principal<\/span>/g, '<span>← Volver a Portales</span>');
console.log('✅ Encabezados de módulos unificados a "← Volver a Portales"');

// ========================================================
// 2. REQUISITO 1: MUSIC SESSION (BUSCADOR PREDICTIVO + YOUTUBE + PALABRAS INTERACTIVAS)
// ========================================================
console.log('Paso 2: Actualizando interfaz y lógica de Music Session...');

// Reemplazar la barra de búsqueda en view-music con el buscador inteligente con autocompletado flotante
const oldMusicSearchContainerRegex = /<!-- BUSCADOR FUNCIONAL DE CANCIONES Y ARTISTAS DE YOUTUBE -->[\s\S]*?<!-- Selector de Catálogo Precargado -->/;
const newMusicSearchContainer = `<!-- BUSCADOR INTELIGENTE ESTILO YOUTUBE CON AUTOPREDICTIVO Y SUGERENCIAS -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 mb-4 shadow-xl">
      <div class="relative w-full">
        <div class="flex flex-col sm:flex-row gap-2.5">
          <div class="relative flex-1">
            <input type="text" id="musicSearchInput" 
              oninput="handleMusicSearchInput(this.value)" 
              onkeydown="handleMusicSearchKey(event)"
              placeholder="Escribe 'losing my religion', 'coldplay', 'queen', 'believer' o pega enlace..." 
              class="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition shadow-inner"
              autocomplete="off">
            <span class="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
          </div>
          <button onclick="handleMusicSearchSubmit()" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-95">
            <span>▶️ Buscar / Cargar</span>
          </button>
        </div>

        <!-- MENÚ FLOTANTE DE SUGERENCIAS PREDICTIVAS EN TIEMPO REAL (ESTILO YOUTUBE) -->
        <div id="musicSearchSuggestions" class="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-900/98 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl max-h-80 overflow-y-auto hidden">
          <!-- Inyectado dinámicamente con miniaturas, título, artista y género -->
        </div>
      </div>

      <!-- Selector de Catálogo Rápido -->
      <div class="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">🔥 Éxitos:</span>
        <div id="musicTrackButtonsContainer" class="flex gap-2 overflow-x-auto py-1 flex-1 scrollbar-none">
          <!-- Inyectado dinámicamente -->
        </div>
      </div>
    </div>

    <!-- Selector de Catálogo Precargado -->`;

if (oldMusicSearchContainerRegex.test(code)) {
  code = code.replace(oldMusicSearchContainerRegex, newMusicSearchContainer);
  console.log('✅ HTML de búsqueda de Music Session reemplazado con autocompletado flotante');
}

// Inyectar el modal de palabra interactiva para lyrics justo antes del cierre de view-music
const musicWordModalHtml = `
  <!-- MODAL DE PALABRA INTERACTIVA EN MUSIC SESSION -->
  <div id="musicWordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">
    <div class="w-full max-w-sm bg-slate-900 border border-cyan-500/50 rounded-3xl p-5 shadow-2xl flex flex-col relative overflow-hidden">
      <div class="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <span id="musicWordType" class="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/20 px-2.5 py-0.5 rounded-full">Vocabulario</span>
        <button onclick="closeMusicWordModal()" class="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base">&times;</button>
      </div>
      <div class="mt-3.5 flex items-center justify-between">
        <div>
          <h4 id="musicWordTerm" class="text-xl font-black text-white">Religion</h4>
          <p id="musicWordIpa" class="text-xs text-cyan-300 font-mono mt-0.5">/rɪˈlɪdʒ.ən/</p>
        </div>
        <button onclick="speakMusicWord()" class="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition cursor-pointer shadow-md shadow-cyan-600/30 text-base" title="Pronunciación nativa">🔊</button>
      </div>
      <p id="musicWordEs" class="text-sm text-slate-200 font-semibold mt-2.5">Religión / fe</p>
      
      <div class="mt-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 space-y-1">
        <p class="font-bold text-cyan-400 text-[11px] flex items-center gap-1.5">
          <span>💡 Phrasal Verbs & Contexto:</span>
        </p>
        <p id="musicWordPhrasal" class="italic text-slate-300">"Losing my religion" es una expresión que significa llegar al límite de la paciencia.</p>
        <p id="musicWordPhrasalEs" class="text-[11px] text-slate-400"></p>
      </div>

      <div class="mt-4 flex items-center gap-2">
        <button onclick="resumeYouTubePlayer()" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5 active:scale-95">
          <span>▶️ Reanudar Canción</span>
        </button>
      </div>
    </div>
  </div>
`;

if (!code.includes('id="musicWordModal"')) {
  const musicEndIdx = code.indexOf('<!-- ========================================================\n       VISTA 6: WORLD TOUR 3D');
  code = code.substring(0, musicEndIdx) + musicWordModalHtml + '\n  ' + code.substring(musicEndIdx);
  console.log('✅ Modal de inspección de palabra de lírica inyectado');
}

// Default video iframe a Losing My Religion con youtube-nocookie
code = code.replace(/https:\/\/www\.youtube\.com\/embed\/rYEDA3JcQqw\?enablejsapi=1/g, 'https://www.youtube-nocookie.com/embed/xwtdhWltSIg?enablejsapi=1');
code = code.replace(/Rolling in the Deep/g, 'Losing My Religion');
code = code.replace(/Adele &bull; Pop Soul/g, 'R.E.M. &bull; Alternative Rock');

// ========================================================
// 3. REQUISITO 3 Y 4: WORLD TOUR 3D (JOYSTICK + CONTROLES + GRÁFICOS REALISTAS)
// ========================================================
console.log('Paso 3: Actualizando controles y escena de World Tour 3D...');

// Añadir el Joystick Virtual táctil en el canvas container de view-worldtour
const oldThreeCanvasContainer = `<div id="threeCanvasContainer" class="w-full relative select-none" style="height: 520px; background-color: #1e293b;">
        <!-- Canvas generado por Three.js -->`;

const newThreeCanvasContainer = `<div id="threeCanvasContainer" class="w-full relative select-none" style="height: 520px; background-color: #0f172a;">
        <!-- Canvas generado por Three.js -->

        <!-- Joystick Virtual Táctil para Celulares y Tablets -->
        <div id="virtualJoystickContainer" class="absolute bottom-5 left-5 z-30 w-28 h-28 rounded-full bg-slate-900/75 border-2 border-purple-500/50 backdrop-blur-md flex items-center justify-center touch-none select-none sm:hidden shadow-2xl">
          <div id="virtualJoystickKnob" class="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 border-2 border-white/60 shadow-lg pointer-events-none transition-transform duration-75"></div>
        </div>

        <!-- Indicador de controles de movimiento y mirada -->
        <div class="absolute top-3 left-3 z-20 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 font-medium shadow-lg flex items-center gap-2">
          <span class="text-purple-400 font-bold">🎮</span>
          <span>PC: WASD / Flechas + Arrastrar ratón | Celular: Joystick y deslizamiento</span>
        </div>`;

if (code.includes('id="threeCanvasContainer"')) {
  code = code.replace(oldThreeCanvasContainer, newThreeCanvasContainer);
  console.log('✅ Joystick virtual táctil e indicador de controles inyectados en HTML');
}

// Ahora escribir la nueva lógica JS para Music Session y World Tour 3D
console.log('Paso 4: Escribiendo lógica JS de Music Session con autocompletado y diccionario...');

const oldMusicJsStart = code.indexOf('function renderMusicTracksList(');
const oldMusicJsEnd = code.indexOf('// ========================================================\n    // MOTOR 3D WORLD TOUR');

const newMusicJs = `
    // DICCIONARIO INTEGRAL PARA LÍRICAS MUSICALES
    const MUSIC_VOCAB_DICTIONARY = {
      "losing": { ipa: "/ˈluː.zɪŋ/", trans: "Perdiendo / extraviando", type: "Verbo (Gerundio)", note: "Lose (perder) → Phrasal verbs: lose out (quedarse atrás), lose touch (perder contacto)." },
      "religion": { ipa: "/rɪˈlɪdʒ.ən/", trans: "Religión / fe / paciencia", type: "Sustantivo", note: "Modismo sureño: 'Losing my religion' significa llegar al límite de la paciencia." },
      "spotlight": { ipa: "/ˈspɑːt.laɪt/", trans: "Centro de atención / foco", type: "Sustantivo compuesto", note: "Spot (punto) + Light (luz). Estar bajo la mirada pública." },
      "corner": { ipa: "/ˈkɔːr.nɚ/", trans: "Rincón / esquina", type: "Sustantivo", note: "Phrasal verb: 'Corner someone' (acorralar o arrinconar a alguien)." },
      "distance": { ipa: "/ˈdɪs.təns/", trans: "Distancia / lejanía", type: "Sustantivo", note: "Phrasal verb: 'Distance oneself from' (distanciarse de algo)." },
      "whisper": { ipa: "/ˈwɪs.pɚ/", trans: "Susurro / cuchicheo", type: "Sustantivo / Verbo", note: "Hablar suavemente sin resonancia vocal." },
      "confessions": { ipa: "/kənˈfeʃ.ənz/", trans: "Confesiones", type: "Sustantivo plural", note: "Verbo: 'Confess to' (admitir una culpa o confesar)." },
      "lengths": { ipa: "/leŋθs/", trans: "Límites / extremos", type: "Sustantivo", note: "Expresión: 'Go to great lengths' (hacer hasta lo imposible)." },
      "blinded": { ipa: "/ˈblaɪn.dɪd/", trans: "Cegado / deslumbrado", type: "Adjetivo / Participio", note: "Phrasal verb: 'Blind someone with' (deslumbrar con algo)." },
      "fool": { ipa: "/fuːl/", trans: "Tonto / ingenuo / loco", type: "Sustantivo", note: "Phrasal verb: 'Fool around' (perder el tiempo), 'Fool with' (manipular)." },
      "fantasy": { ipa: "/ˈfæn.tə.si/", trans: "Fantasía / ilusión", type: "Sustantivo", note: "Imaginación sin base en la realidad." },
      "landslide": { ipa: "/ˈlænd.slaɪd/", trans: "Derrumbe / avalancha", type: "Sustantivo compuesto", note: "Land (tierra) + Slide (deslizar). Suceso arrollador." },
      "reality": { ipa: "/riˈæl.ə.t̬i/", trans: "Realidad", type: "Sustantivo", note: "Phrasal verb: 'Face up to reality' (afrontar la realidad)." },
      "sympathy": { ipa: "/ˈsɪm.pə.θi/", trans: "Compasión / empatía", type: "Sustantivo", note: "Afecto hacia los sentimientos de otros." },
      "trigger": { ipa: "/ˈtrɪɡ.ɚ/", trans: "Gatillo / desencadenar", type: "Sustantivo / Verbo", note: "Phrasal verb: 'Trigger off' (detonar una reacción en cadena)." },
      "yellow": { ipa: "/ˈjel.oʊ/", trans: "Amarillo / brillante", type: "Adjetivo", note: "Símbolo de luz, calidez y devoción en la lírica." },
      "shine": { ipa: "/ʃaɪn/", trans: "Brillar / resplandecer", type: "Verbo", note: "Phrasal verb: 'Shine through' (hacerse evidente una virtud)." },
      "bones": { ipa: "/boʊnz/", trans: "Huesos", type: "Sustantivo plural", note: "Expresión: 'Skin and bones' (muy vulnerable o exhausto)." },
      "radioactive": { ipa: "/ˌreɪ.di.oʊˈæk.tɪv/", trans: "Radiactivo / imparable", type: "Adjetivo", note: "Metáfora de transformación y renacimiento energético." },
      "chemicals": { ipa: "/ˈkem.ɪ.kəlz/", trans: "Sustancias químicas", type: "Sustantivo", note: "Ambiente tóxico superado por el protagonista." },
      "apocalypse": { ipa: "/əˈpɑː.kə.lɪps/", trans: "Apocalipsis / fin", type: "Sustantivo", note: "Caída de lo viejo para dar paso a la nueva era." },
      "wonderwall": { ipa: "/ˈwʌn.dɚ.wɔːl/", trans: "Muro protector / salvador", type: "Neologismo lírico", note: "La persona o recuerdo que te mantiene a flote." },
      "believer": { ipa: "/bɪˈliː.vɚ/", trans: "Creyente / devoto", type: "Sustantivo", note: "Phrasal verb: 'Believe in' (confiar plenamente en algo)." },
      "rolling": { ipa: "/ˈroʊ.lɪŋ/", trans: "Rodando / en marcha", type: "Verbo (Gerundio)", note: "Phrasal verb: 'Roll in' (llegar en abundancia)." },
      "deep": { ipa: "/diːp/", trans: "Profundo / intenso", type: "Adjetivo", note: "Expresión: 'In too deep' (involucrado más allá de lo prudente)." }
    };

    let currentMusicIndex = 0;

    function renderMusicTracksList(filter = '') {
      const container = document.getElementById('musicTrackButtonsContainer');
      if (!container || !window.MUSIC_SESSION_TRACKS) return;

      const lower = filter.toLowerCase().trim();
      const filtered = MUSIC_SESSION_TRACKS.filter(t => 
        !lower || t.title.toLowerCase().includes(lower) || t.artist.toLowerCase().includes(lower)
      );

      container.innerHTML = filtered.map((track) => {
        const originalIdx = MUSIC_SESSION_TRACKS.findIndex(t => t.id === track.id);
        const isActive = originalIdx === currentMusicIndex;
        return \`
          <button onclick="selectMusicTrack(\${originalIdx})" class="px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition flex items-center gap-1.5 cursor-pointer \${isActive ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}">
            <span>\${track.artist} - \${track.title}</span>
          </button>
        \`;
      }).join('');
    }

    // Buscador con autocompletado predictivo en tiempo real (Estilo YouTube)
    function handleMusicSearchInput(val) {
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      if (!suggestionsEl) return;

      const query = val.toLowerCase().trim();
      if (!query) {
        suggestionsEl.classList.add('hidden');
        renderMusicTracksList('');
        return;
      }

      renderMusicTracksList(query);

      // Buscar coincidencias en el catálogo
      const matches = MUSIC_SESSION_TRACKS.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.artist.toLowerCase().includes(query) ||
        (t.genre && t.genre.toLowerCase().includes(query))
      );

      if (matches.length > 0) {
        suggestionsEl.innerHTML = matches.map(track => {
          const originalIdx = MUSIC_SESSION_TRACKS.findIndex(t => t.id === track.id);
          const thumb = track.thumbnail || \`https://img.youtube.com/vi/\${track.youtubeId}/mqdefault.jpg\`;
          return \`
            <div onclick="selectMusicTrackFromSuggestion(\${originalIdx})" class="p-2.5 flex items-center gap-3 hover:bg-slate-800/90 cursor-pointer border-b border-slate-800/60 transition group">
              <img src="\${thumb}" class="w-14 h-9 object-cover rounded-lg border border-slate-700 group-hover:border-cyan-500/50 shadow" alt="\${track.title}">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition">\${track.title}</p>
                <p class="text-[11px] text-slate-400 truncate">\${track.artist} • <span class="text-cyan-400/80">\${track.genre || 'Hit'}</span></p>
              </div>
              <span class="text-xs text-slate-500 group-hover:text-cyan-400">▶️</span>
            </div>
          \`;
        }).join('');
        suggestionsEl.classList.remove('hidden');
      } else {
        // Opción de búsqueda directa o carga de URL
        suggestionsEl.innerHTML = \`
          <div onclick="handleMusicSearchSubmit()" class="p-3 text-xs text-slate-300 hover:bg-slate-800/90 cursor-pointer flex items-center justify-between">
            <span>🔍 Buscar y reproducir: "<strong class="text-cyan-400">\${val}</strong>"</span>
            <span class="text-xs text-slate-500">Enter ↵</span>
          </div>
        \`;
        suggestionsEl.classList.remove('hidden');
      }
    }

    function handleMusicSearchKey(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleMusicSearchSubmit();
      }
    }

    function selectMusicTrackFromSuggestion(idx) {
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      if (suggestionsEl) suggestionsEl.classList.add('hidden');
      selectMusicTrack(idx);
    }

    function handleMusicSearchSubmit() {
      const input = document.getElementById('musicSearchInput');
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      if (suggestionsEl) suggestionsEl.classList.add('hidden');
      if (!input) return;

      const val = input.value.trim();
      if (!val) return;

      // 1. Si es un enlace o ID directo de YouTube
      const ytId = extractYouTubeId(val);
      if (ytId) {
        loadYouTubeVideoById(ytId, 'Canción de YouTube', 'Personalizada');
        showFloatingToast('Cargando video de YouTube...', '▶️');
        return;
      }

      // 2. Si es texto libre, resolver contra catálogo precargado
      const query = val.toLowerCase();
      const matchIdx = MUSIC_SESSION_TRACKS.findIndex(t => 
        t.title.toLowerCase().includes(query) || t.artist.toLowerCase().includes(query)
      );

      if (matchIdx !== -1) {
        selectMusicTrack(matchIdx);
        showFloatingToast(\`Reproduciendo \${MUSIC_SESSION_TRACKS[matchIdx].title}\`, '🎵');
      } else {
        // Enlace por defecto al catálogo más cercano
        selectMusicTrack(0);
        showFloatingToast('No se encontró coincidencia exacta; cargando éxito sugerido', 'ℹ️');
      }
    }

    function loadYouTubeVideoById(ytId, title = 'Video', artist = 'Artista') {
      const iframe = document.getElementById('musicYouTubeIframe');
      const titleEl = document.getElementById('activeMusicTitle');
      const artistEl = document.getElementById('activeMusicArtist');
      if (iframe) iframe.src = \`https://www.youtube-nocookie.com/embed/\${ytId}?enablejsapi=1\`;
      if (titleEl) titleEl.textContent = title;
      if (artistEl) artistEl.textContent = artist;
    }

    function selectMusicTrack(idx) {
      currentMusicIndex = idx;
      const track = MUSIC_SESSION_TRACKS[idx];
      if (!track) return;

      const titleEl = document.getElementById('activeMusicTitle');
      const artistEl = document.getElementById('activeMusicArtist');
      const iframe = document.getElementById('musicYouTubeIframe');

      if (titleEl) titleEl.textContent = track.title;
      if (artistEl) artistEl.textContent = \`\${track.artist} \${track.genre ? '• ' + track.genre : ''}\`;
      if (iframe && track.youtubeId) {
        iframe.src = \`https://www.youtube-nocookie.com/embed/\${track.youtubeId}?enablejsapi=1\`;
      }

      renderLyrics(track);
      renderMusicTracksList();
    }

    function renderLyrics(track) {
      const container = document.getElementById('musicLyricsContainer');
      if (!container || !track || !track.lyrics) return;

      container.innerHTML = track.lyrics.map((line, idx) => {
        const words = line.text.split(/\\s+/).map(w => {
          const cleanWord = w.toLowerCase().replace(/[^a-z']/g, '');
          if (!cleanWord) return w;
          return \`<span onclick="inspectLyricsWord('\${cleanWord}', event)" class="lyrics-word hover:text-cyan-300 hover:bg-cyan-500/20 px-1 py-0.5 rounded transition cursor-pointer select-none active:scale-95" title="Toca para ver significado">\${w}</span>\`;
        }).join(' ');

        return \`
          <div class="p-2.5 rounded-xl transition hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50 text-slate-300 flex items-start gap-2.5 group">
            <span class="text-[10px] font-mono text-cyan-500/70 pt-0.5 select-none w-8 text-right">\${line.time ? line.time + 's' : '♪'}</span>
            <p class="leading-relaxed text-sm flex-1">\${words}</p>
          </div>
        \`;
      }).join('');
    }

    function pauseYouTubePlayer() {
      const iframe = document.getElementById('musicYouTubeIframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    }

    function resumeYouTubePlayer() {
      closeMusicWordModal();
      const iframe = document.getElementById('musicYouTubeIframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
    }

    function inspectLyricsWord(word, event) {
      if (event) event.stopPropagation();
      pauseYouTubePlayer();

      const clean = word.toLowerCase().replace(/[^a-z]/g, '');
      const entry = MUSIC_VOCAB_DICTIONARY[clean] || {
        ipa: \`/\${clean}/\`,
        trans: 'Término de la canción',
        type: 'Vocabulario',
        note: 'Palabra en inglés utilizada en la lírica musical.'
      };

      const termEl = document.getElementById('musicWordTerm');
      const ipaEl = document.getElementById('musicWordIpa');
      const esEl = document.getElementById('musicWordEs');
      const pTermEl = document.getElementById('musicWordPhrasal');
      const pEsEl = document.getElementById('musicWordPhrasalEs');
      const typeEl = document.getElementById('musicWordType');
      const modal = document.getElementById('musicWordModal');

      if (termEl) termEl.textContent = clean.charAt(0).toUpperCase() + clean.slice(1);
      if (ipaEl) ipaEl.textContent = entry.ipa;
      if (esEl) esEl.textContent = entry.trans;
      if (pTermEl) pTermEl.textContent = entry.note;
      if (pEsEl) pEsEl.textContent = '';
      if (typeEl) typeEl.textContent = entry.type || 'Vocabulario';

      if (modal) modal.classList.remove('hidden');
    }

    function speakMusicWord() {
      const termEl = document.getElementById('musicWordTerm');
      if (termEl) speakText(termEl.textContent);
    }

    function closeMusicWordModal() {
      const modal = document.getElementById('musicWordModal');
      if (modal) modal.classList.add('hidden');
    }

    function extractYouTubeId(url) {
      if (!url) return null;
      const clean = url.trim();
      if (clean.length === 11 && !clean.includes('/') && !clean.includes('.')) return clean;
      const reg = /(?:youtube\\.com\\/(?:watch\\?.*v=|embed\\/)|youtu\\.be\\/)([a-zA-Z0-9_-]{11})/;
      const match = clean.match(reg);
      return match ? match[1] : null;
    }

    function completeMusicChallenge() {
      addExp(30, 'Reto superado en Music Session');
    }
`;

if (oldMusicJsStart !== -1 && oldMusicJsEnd !== -1) {
  code = code.substring(0, oldMusicJsStart) + newMusicJs.trim() + '\n\n    ' + code.substring(oldMusicJsEnd);
  console.log('✅ Lógica JS de Music Session actualizada exitosamente');
}

// ========================================================
// 4. REQUISITO 3 Y 4: LÓGICA Y GRÁFICOS REALISTAS THREE.JS WORLD TOUR
// ========================================================
console.log('Paso 5: Escribiendo motor Three.js con ACESFilmic, sombras suaves, texturas y controles PC/móvil...');

const oldThreeStart = code.indexOf('// ========================================================\n    // MOTOR 3D WORLD TOUR');
const oldThreeEnd = code.indexOf('function startPortalStars()');

const newThreeJs = `// ========================================================
    // MOTOR 3D WORLD TOUR (GRÁFICOS REALISTAS + CONTROLES PC / MÓVIL)
    // ========================================================
    let threeScene, threeCamera, threeRenderer;
    let threeRaycaster, threePointer;
    let threeInteractiveMeshes = [];
    let threeCurrentInspectedObj = null;
    let threeResizeObserver = null;
    let isThreeInitialized = false;

    // Variables de navegación en primera persona
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let cameraYaw = -Math.PI / 2; // Orientación hacia el interior de la sala
    let cameraPitch = 0;
    let isDraggingMouse = false;
    let previousMousePosition = { x: 0, y: 0 };
    let mouseDownPos = { x: 0, y: 0 };
    let joystickMove = { x: 0, y: 0 }; // Vector móvil (-1 a 1)

    const ROOM_LIMITS = {
      minX: -7.5,
      maxX: 7.5,
      minZ: -7.5,
      maxZ: 7.5,
      eyeHeight: 1.7
    };

    function initThreeWorldTour() {
      const container = document.getElementById('threeCanvasContainer');
      if (!container) return;

      const width = container.clientWidth || 800;
      const height = container.clientHeight || 520;

      if (isThreeInitialized && threeRenderer) {
        threeCamera.aspect = width / height;
        threeCamera.updateProjectionMatrix();
        threeRenderer.setSize(width, height);
        threeRenderer.render(threeScene, threeCamera);
        return;
      }

      // 1. Escena
      threeScene = new THREE.Scene();
      threeScene.background = new THREE.Color(0x0f172a);

      // 2. Cámara en primera persona
      threeCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      threeCamera.position.set(-3.8, ROOM_LIMITS.eyeHeight, 2.0);

      // 3. Renderer con ACESFilmicToneMapping y PCFSoftShadowMap
      threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      threeRenderer.setClearColor(0x0f172a, 1);
      threeRenderer.setSize(width, height);
      threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Configuración de ToneMapping y Sombras Suaves solicitada por el usuario
      threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      threeRenderer.toneMappingExposure = 1.0;
      threeRenderer.shadowMap.enabled = true;
      threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = '';
      container.appendChild(threeRenderer.domElement);

      // 4. Iluminación Balanceada
      // AmbientLight suave (0xe2e8f0, intensidad 0.7)
      const ambientLight = new THREE.AmbientLight(0xe2e8f0, 0.7);
      threeScene.add(ambientLight);

      // DirectionalLight cálida (0xfffaf0, intensidad 1.5) entrando por la ventana
      const dirLight = new THREE.DirectionalLight(0xfffaf0, 1.5);
      dirLight.position.set(-6.5, 4.2, -4.5);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.0005;
      threeScene.add(dirLight);

      // PointLight cálida (0xffedd5, intensidad 1.2, distancia 8) en la lámpara
      const lampLight = new THREE.PointLight(0xffedd5, 1.2, 8);
      lampLight.position.set(-5.5, 1.8, -5.5);
      lampLight.castShadow = true;
      threeScene.add(lampLight);

      // 5. Construcción de la Casa Realista (Duela con vetas, cortinas y mobiliario)
      buildRealisticHouse();

      // 6. Raycaster
      threeRaycaster = new THREE.Raycaster();
      threePointer = new THREE.Vector2();

      // 7. Configuración de Controles PC (WASD + Arrastre) y Móvil (Joystick + Swipe)
      setupFirstPersonControls(threeRenderer.domElement);
      setupVirtualJoystick();

      // 8. ResizeObserver
      if (window.ResizeObserver) {
        threeResizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            const cr = entry.contentRect;
            if (cr.width > 0 && cr.height > 0) {
              threeCamera.aspect = cr.width / cr.height;
              threeCamera.updateProjectionMatrix();
              threeRenderer.setSize(cr.width, cr.height);
              threeRenderer.render(threeScene, threeCamera);
            }
          }
        });
        threeResizeObserver.observe(container);
      }

      // 9. Bucle de Render Continuo
      let lastTime = performance.now();
      function animate3D(now) {
        requestAnimationFrame(animate3D);
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        if (threeRenderer && threeScene && threeCamera && currentActiveView === 'view-worldtour') {
          updatePlayerMovement(delta);
          threeRenderer.render(threeScene, threeCamera);
        }
      }
      requestAnimationFrame(animate3D);
      isThreeInitialized = true;
    }

    // Textura procedural de duela de madera con vetas naturales
    function createProceduralWoodTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Tono base madera cálida
      ctx.fillStyle = '#5c2d16';
      ctx.fillRect(0, 0, 512, 512);

      const plankHeight = 64;
      for (let y = 0; y < 512; y += plankHeight) {
        // Tonalidad aleatoria por tabla
        const rand = (Math.random() * 20 - 10);
        ctx.fillStyle = rand > 0 ? 'rgba(255, 220, 180, 0.08)' : 'rgba(0, 0, 0, 0.12)';
        ctx.fillRect(0, y, 512, plankHeight);

        // Vetas de madera
        for (let i = 0; i < 10; i++) {
          ctx.strokeStyle = 'rgba(40, 18, 8, 0.22)';
          ctx.lineWidth = Math.random() * 2 + 0.5;
          ctx.beginPath();
          const lineY = y + Math.random() * plankHeight;
          ctx.moveTo(0, lineY);
          ctx.bezierCurveTo(150, lineY + (Math.random() * 6 - 3), 350, lineY + (Math.random() * 6 - 3), 512, lineY);
          ctx.stroke();
        }

        // Ranura entre duelas
        ctx.strokeStyle = 'rgba(20, 8, 4, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    }

    function buildRealisticHouse() {
      // 1. Piso de duela con reflejo sutil (roughness: 0.35)
      const woodTex = createProceduralWoodTexture();
      const floorMat = new THREE.MeshStandardMaterial({
        map: woodTex,
        roughness: 0.35,
        metalness: 0.08
      });
      const floorGeo = new THREE.PlaneGeometry(20, 20);
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      threeScene.add(floor);

      // 2. Paredes
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
      
      // Pared trasera
      const backWallGeo = new THREE.BoxGeometry(20, 5.0, 0.3);
      const backWall = new THREE.Mesh(backWallGeo, wallMat);
      backWall.position.set(0, 2.5, -8.5);
      backWall.receiveShadow = true;
      threeScene.add(backWall);

      // Pared izquierda
      const leftWallGeo = new THREE.BoxGeometry(0.3, 5.0, 20);
      const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
      leftWall.position.set(-8.5, 2.5, 0);
      leftWall.receiveShadow = true;
      threeScene.add(leftWall);

      // Pared derecha
      const rightWall = new THREE.Mesh(leftWallGeo, wallMat);
      rightWall.position.set(8.5, 2.5, 0);
      rightWall.receiveShadow = true;
      threeScene.add(rightWall);

      // 3. Ventana amplia con marco y luz exterior
      const winGeo = new THREE.PlaneGeometry(3.6, 2.4);
      const winMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const windowMesh = new THREE.Mesh(winGeo, winMat);
      windowMesh.position.set(-6.5, 2.5, -8.3);
      threeScene.add(windowMesh);

      // Marco de ventana
      const frameMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const frameTop = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.12, 0.15), frameMat);
      frameTop.position.set(-6.5, 3.75, -8.28);
      const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.12, 0.15), frameMat);
      frameBottom.position.set(-6.5, 1.25, -8.28);
      threeScene.add(frameTop, frameBottom);

      // Cortinas con pliegues suaves drapeadas a ambos lados
      const curtainMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.8 });
      const curtainLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 2.5, 16), curtainMat);
      curtainLeft.position.set(-8.1, 2.5, -8.2);
      const curtainRight = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 2.5, 16), curtainMat);
      curtainRight.position.set(-4.9, 2.5, -8.2);
      threeScene.add(curtainLeft, curtainRight);

      // Zoclos de madera noble
      const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x3b1d0e, roughness: 0.4 });
      const baseboardBack = new THREE.Mesh(new THREE.BoxGeometry(20, 0.2, 0.08), baseboardMat);
      baseboardBack.position.set(0, 0.1, -8.32);
      threeScene.add(baseboardBack);

      // 4. Instanciar Mobiliario Detallado Procedural
      threeInteractiveMeshes = [];
      const objects = (WORLD_TOUR_SCENARIOS && WORLD_TOUR_SCENARIOS.house && WORLD_TOUR_SCENARIOS.house.objects) || [];

      objects.forEach(objData => {
        try {
          const mesh = build3DObjectGeometry(objData);
          if (mesh) {
            mesh.userData = objData;
            threeScene.add(mesh);
            threeInteractiveMeshes.push(mesh);
          }
        } catch (err) {
          console.error('Error instanciando objeto 3D ' + objData.id, err);
        }
      });
    }

    function safeGetPosition(pos) {
      if (!pos) return { x: 0, y: 0, z: 0 };
      const x = typeof pos.x === 'number' ? pos.x : (Array.isArray(pos) && typeof pos[0] === 'number' ? pos[0] : 0);
      const y = typeof pos.y === 'number' ? pos.y : (Array.isArray(pos) && typeof pos[1] === 'number' ? pos[1] : 0);
      const z = typeof pos.z === 'number' ? pos.z : (Array.isArray(pos) && typeof pos[2] === 'number' ? pos[2] : 0);
      return { x, y, z };
    }

    function safeGetScale(scale) {
      if (!scale) return { x: 0.6, y: 0.6, z: 0.6 };
      const x = typeof scale.x === 'number' ? scale.x : (Array.isArray(scale) && typeof scale[0] === 'number' ? scale[0] : 0.6);
      const y = typeof scale.y === 'number' ? scale.y : (Array.isArray(scale) && typeof scale[1] === 'number' ? scale[1] : 0.6);
      const z = typeof scale.z === 'number' ? scale.z : (Array.isArray(scale) && typeof scale[2] === 'number' ? scale[2] : 0.6);
      return { x, y, z };
    }

    function build3DObjectGeometry(obj) {
      const group = new THREE.Group();

      if (obj.id === 'hammock') {
        // Hamaca tejida suspendida con ganchos y cuerdas en abanico
        const fabricGeo = new THREE.CylinderGeometry(0.55, 0.45, 3.2, 16, 1, true, 0, Math.PI);
        const fabricMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, side: THREE.DoubleSide, roughness: 0.7 });
        const fabric = new THREE.Mesh(fabricGeo, fabricMat);
        fabric.rotation.z = Math.PI / 2;
        fabric.position.set(0, 0.35, 0);
        fabric.castShadow = true;
        group.add(fabric);

        // Cuerdas trenzadas de suspensión en abanico
        const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
        const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.9), ropeMat);
        r1.rotation.z = -Math.PI / 4;
        r1.position.set(-1.8, 0.75, 0);
        const r2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.9), ropeMat);
        r2.rotation.z = Math.PI / 4;
        r2.position.set(1.8, 0.75, 0);

        // Ganchos metálicos
        const hookMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
        const h1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25), hookMat);
        h1.position.set(-2.5, 1.45, 0);
        const h2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25), hookMat);
        h2.position.set(2.5, 1.45, 0);

        group.add(r1, r2, h1, h2);
      } else if (obj.id === 'sofa') {
        // Sofá con cojines independientes redondeados y textura de tela
        const sofaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.35, 1.1), sofaMat);
        base.position.y = 0.18;
        base.castShadow = true;

        // 2 Cojines de asiento independientes redondeados
        const cushionMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
        const seat1 = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.05, 16), cushionMat);
        seat1.rotation.z = Math.PI / 2;
        seat1.position.set(-0.6, 0.42, 0);
        const seat2 = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.05, 16), cushionMat);
        seat2.rotation.z = Math.PI / 2;
        seat2.position.set(0.6, 0.42, 0);

        // Respaldo acolchado
        const back = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.75, 0.3), sofaMat);
        back.position.set(0, 0.7, -0.42);

        // Reposabrazos redondeados
        const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.1, 16), sofaMat);
        armL.rotation.x = Math.PI / 2;
        armL.position.set(-1.3, 0.5, 0);
        const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.1, 16), sofaMat);
        armR.rotation.x = Math.PI / 2;
        armR.position.set(1.3, 0.5, 0);

        // 2 Cojines decorativos con contraste
        const decCushion1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.12), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 }));
        decCushion1.rotation.y = 0.3;
        decCushion1.position.set(-0.95, 0.58, -0.2);
        const decCushion2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.12), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 }));
        decCushion2.rotation.y = -0.3;
        decCushion2.position.set(0.95, 0.58, -0.2);

        group.add(base, seat1, seat2, back, armL, armR, decCushion1, decCushion2);
      } else if (obj.id === 'cushion') {
        const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.15), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 }));
        group.add(cushion);
      } else if (obj.id === 'coffee_table') {
        // Mesa de centro de madera pulida con accesorios
        const topMat = new THREE.MeshStandardMaterial({ color: 0x5c2c16, roughness: 0.25, metalness: 0.15 });
        const top = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.06, 32), topMat);
        top.position.y = 0.38;
        top.castShadow = true;

        // 3 Patas metálicas en ángulo con conteras de latón
        const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3;
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.025, 0.38, 16), legMat);
          leg.position.set(Math.cos(angle) * 0.55, 0.19, Math.sin(angle) * 0.55);
          leg.rotation.z = Math.cos(angle) * 0.15;
          leg.rotation.x = Math.sin(angle) * 0.15;
          group.add(leg);
        }

        // Taza de café con platito encima
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.015, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
        plate.position.set(0.15, 0.42, 0.1);
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
        cup.position.set(0.15, 0.47, 0.1);

        // Libro decorativo
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.035, 0.38), new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.5 }));
        book.rotation.y = 0.4;
        book.position.set(-0.2, 0.43, -0.05);

        group.add(top, plate, cup, book);
      } else if (obj.id === 'coffee_mug') {
        const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.12, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
        group.add(mug);
      } else if (obj.id === 'television') {
        // Pantalla plana delgada biselada montada en pared
        const frame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.35, 0.06), new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.2 }));
        const screen = new THREE.Mesh(new THREE.BoxGeometry(2.32, 1.28, 0.07), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.05, metalness: 0.7 }));
        frame.castShadow = true;
        group.add(frame, screen);
      } else if (obj.id === 'bookshelf') {
        // Librero de madera noble con estantes y libros de colores
        const shelfMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 0.35), shelfMat);
        shelf.castShadow = true;
        group.add(shelf);
      } else if (obj.id === 'rug') {
        // Tapete con borde decorativo
        const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.4), new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.9 }));
        rug.rotation.x = -Math.PI / 2;
        group.add(rug);
      } else if (obj.id === 'ceiling_fan') {
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        for (let i = 0; i < 4; i++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.02, 0.18), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 }));
          blade.rotation.y = (i * Math.PI) / 2;
          blade.position.x = Math.cos((i * Math.PI) / 2) * 0.55;
          blade.position.z = Math.sin((i * Math.PI) / 2) * 0.55;
          hub.add(blade);
        }
        group.add(hub);
      } else if (obj.id === 'hanging_lamp') {
        const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        wire.position.y = 0.4;
        const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.35, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 }));
        group.add(wire, shade);
      } else if (obj.id === 'floor_lamp') {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.3 }));
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.3 }));
        pole.position.y = 0.9;
        const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.38, 0.45, 24), new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.5 }));
        shade.position.y = 1.7;
        group.add(base, pole, shade);
      } else if (obj.id === 'light_switch') {
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.02), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
        const toggle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.03), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
        group.add(plate, toggle);
      } else if (obj.id === 'curtain') {
        const drape = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.2, 0.15), new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.7 }));
        group.add(drape);
      } else if (obj.id === 'door_lock') {
        const escutcheon = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.03), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 }));
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.04), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 }));
        handle.position.set(0.06, 0.04, 0.02);
        group.add(escutcheon, handle);
      } else if (obj.id === 'wall_crack') {
        const crack = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 0.02), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
        group.add(crack);
      } else {
        const s = safeGetScale(obj.scale);
        const geo = new THREE.BoxGeometry(s.x, s.y, s.z);
        const mat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });
        group.add(new THREE.Mesh(geo, mat));
      }

      const p = safeGetPosition(obj.pos);
      group.position.set(p.x, p.y, p.z);
      return group;
    }

    // Configuración de controles PC (WASD + Arrastre)
    function setupFirstPersonControls(canvas) {
      if (!canvas) return;

      window.addEventListener('keydown', (e) => {
        if (currentActiveView !== 'view-worldtour') return;
        const k = e.key.toLowerCase();
        if (k === 'w' || e.key === 'ArrowUp') moveForward = true;
        if (k === 's' || e.key === 'ArrowDown') moveBackward = true;
        if (k === 'a' || e.key === 'ArrowLeft') moveLeft = true;
        if (k === 'd' || e.key === 'ArrowRight') moveRight = true;
      });

      window.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        if (k === 'w' || e.key === 'ArrowUp') moveForward = false;
        if (k === 's' || e.key === 'ArrowDown') moveBackward = false;
        if (k === 'a' || e.key === 'ArrowLeft') moveLeft = false;
        if (k === 'd' || e.key === 'ArrowRight') moveRight = false;
      });

      canvas.addEventListener('mousedown', (e) => {
        isDraggingMouse = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        mouseDownPos = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDraggingMouse || currentActiveView !== 'view-worldtour') return;
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        cameraYaw += deltaX * 0.0035;
        cameraPitch = Math.max(-1.1, Math.min(1.1, cameraPitch - deltaY * 0.0035));
        previousMousePosition = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mouseup', (e) => {
        if (isDraggingMouse) {
          isDraggingMouse = false;
          const dist = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
          if (dist < 6) {
            onThreeCanvasClick(e);
          }
        }
      });

      // Swipe táctil en mitad derecha de pantalla en móvil para girar vista libre en 360°
      let touchLookId = null;
      let prevTouch = { x: 0, y: 0 };
      canvas.addEventListener('touchstart', (e) => {
        for (let t of e.changedTouches) {
          const rect = canvas.getBoundingClientRect();
          if ((t.clientX - rect.left) > rect.width * 0.35 && touchLookId === null) {
            touchLookId = t.identifier;
            prevTouch = { x: t.clientX, y: t.clientY };
          }
        }
      }, { passive: true });

      canvas.addEventListener('touchmove', (e) => {
        for (let t of e.changedTouches) {
          if (t.identifier === touchLookId) {
            const dx = t.clientX - prevTouch.x;
            const dy = t.clientY - prevTouch.y;
            cameraYaw += dx * 0.005;
            cameraPitch = Math.max(-1.1, Math.min(1.1, cameraPitch - dy * 0.005));
            prevTouch = { x: t.clientX, y: t.clientY };
          }
        }
      }, { passive: true });

      const endTouchLook = (e) => {
        for (let t of e.changedTouches) {
          if (t.identifier === touchLookId) {
            touchLookId = null;
          }
        }
      };
      canvas.addEventListener('touchend', endTouchLook);
      canvas.addEventListener('touchcancel', endTouchLook);
    }

    // Configuración de Joystick Virtual Táctil para Celular
    function setupVirtualJoystick() {
      const container = document.getElementById('virtualJoystickContainer');
      const knob = document.getElementById('virtualJoystickKnob');
      if (!container || !knob) return;

      let activeTouchId = null;
      const radius = 38;

      function updateKnob(clientX, clientY) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let dx = clientX - centerX;
        let dy = clientY - centerY;
        const dist = Math.hypot(dx, dy);
        if (dist > radius) {
          dx = (dx / dist) * radius;
          dy = (dy / dist) * radius;
        }
        knob.style.transform = \`translate(\${dx}px, \${dy}px)\`;
        joystickMove.x = dx / radius;
        joystickMove.y = dy / radius;
      }

      container.addEventListener('touchstart', (e) => {
        if (activeTouchId === null && e.changedTouches.length > 0) {
          activeTouchId = e.changedTouches[0].identifier;
          updateKnob(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      }, { passive: false });

      window.addEventListener('touchmove', (e) => {
        if (activeTouchId !== null) {
          for (let t of e.changedTouches) {
            if (t.identifier === activeTouchId) {
              updateKnob(t.clientX, t.clientY);
            }
          }
        }
      }, { passive: false });

      const resetJoystick = (e) => {
        for (let t of e.changedTouches) {
          if (t.identifier === activeTouchId) {
            activeTouchId = null;
            knob.style.transform = 'translate(0px, 0px)';
            joystickMove.x = 0;
            joystickMove.y = 0;
          }
        }
      };

      window.addEventListener('touchend', resetJoystick);
      window.addEventListener('touchcancel', resetJoystick);
    }

    // Actualización de movimiento de jugador en primera persona
    function updatePlayerMovement(delta = 0.016) {
      if (currentActiveView !== 'view-worldtour') return;

      const moveSpeed = 4.2 * delta;
      const forwardX = Math.cos(cameraYaw);
      const forwardZ = Math.sin(cameraYaw);
      const rightX = -Math.sin(cameraYaw);
      const rightZ = Math.cos(cameraYaw);

      let dirX = 0;
      let dirZ = 0;

      if (moveForward) {
        dirX += forwardX;
        dirZ += forwardZ;
      }
      if (moveBackward) {
        dirX -= forwardX;
        dirZ -= forwardZ;
      }
      if (moveLeft) {
        dirX -= rightX;
        dirZ -= rightZ;
      }
      if (moveRight) {
        dirX += rightX;
        dirZ += rightZ;
      }

      if (joystickMove.x !== 0 || joystickMove.y !== 0) {
        dirX += forwardX * (-joystickMove.y) + rightX * joystickMove.x;
        dirZ += forwardZ * (-joystickMove.y) + rightZ * joystickMove.x;
      }

      const length = Math.hypot(dirX, dirZ);
      if (length > 0.001) {
        dirX /= length;
        dirZ /= length;

        threeCamera.position.x += dirX * moveSpeed;
        threeCamera.position.z += dirZ * moveSpeed;

        // Límites de colisión para no atravesar las paredes
        threeCamera.position.x = Math.max(ROOM_LIMITS.minX, Math.min(ROOM_LIMITS.maxX, threeCamera.position.x));
        threeCamera.position.z = Math.max(ROOM_LIMITS.minZ, Math.min(ROOM_LIMITS.maxZ, threeCamera.position.z));
      }

      threeCamera.position.y = ROOM_LIMITS.eyeHeight;

      // Calcular punto de mira con rotación libre en 360°
      const targetX = threeCamera.position.x + Math.cos(cameraPitch) * Math.cos(cameraYaw);
      const targetY = threeCamera.position.y + Math.sin(cameraPitch);
      const targetZ = threeCamera.position.z + Math.cos(cameraPitch) * Math.sin(cameraYaw);
      threeCamera.lookAt(targetX, targetY, targetZ);
    }

    // Resaltado de objeto con destello suave al tocarlo
    function highlightObject(mesh) {
      if (!mesh) return;
      const originalColors = [];
      mesh.traverse(child => {
        if (child.isMesh && child.material && child.material.emissive) {
          originalColors.push({
            child,
            color: child.material.emissive.getHex(),
            intensity: child.material.emissiveIntensity || 0
          });
          child.material.emissive.setHex(0xa855f7); // Destello neón suave
          child.material.emissiveIntensity = 0.85;
        }
      });

      setTimeout(() => {
        originalColors.forEach(item => {
          if (item.child && item.child.material && item.child.material.emissive) {
            item.child.material.emissive.setHex(item.color);
            item.child.material.emissiveIntensity = item.intensity;
          }
        });
      }, 450);
    }

    function onThreeCanvasClick(event) {
      const container = document.getElementById('threeCanvasContainer');
      if (!container || !threeRaycaster || !threeCamera) return;

      const rect = container.getBoundingClientRect();
      const clientX = event.clientX || (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientX : 0);
      const clientY = event.clientY || (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientY : 0);

      threePointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      threePointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      threeRaycaster.setFromCamera(threePointer, threeCamera);
      const intersects = threeRaycaster.intersectObjects(threeInteractiveMeshes, true);

      if (intersects.length > 0) {
        let target = intersects[0].object;
        while (target.parent && (!target.userData || !target.userData.id) && target.parent !== threeScene) {
          target = target.parent;
        }
        if (target && target.userData && target.userData.id) {
          highlightObject(target);
          inspect3DObject(target.userData);
        }
      }
    }

    function inspect3DObject(objData) {
      threeCurrentInspectedObj = objData;
      const card = document.getElementById('threeObjectInspectCard');
      const enEl = document.getElementById('threeObjEnName');
      const esEl = document.getElementById('threeObjEsName');
      const ipaEl = document.getElementById('threeObjIpa');
      const catEl = document.getElementById('threeObjCategory');
      const exEl = document.getElementById('threeObjExample');

      if (enEl) enEl.textContent = objData.en;
      if (esEl) esEl.textContent = objData.es;
      if (ipaEl) ipaEl.textContent = objData.ipa || '';
      if (catEl) catEl.textContent = objData.category || 'Hogar';
      if (exEl) exEl.textContent = objData.example || \`I see the \${objData.en.toLowerCase()} in the room.\`;

      if (card) card.classList.remove('hidden');
    }

    function speakCurrent3DObj() {
      if (threeCurrentInspectedObj && threeCurrentInspectedObj.en) {
        speakText(threeCurrentInspectedObj.en);
      }
    }

    function close3DInspectCard() {
      const card = document.getElementById('threeObjectInspectCard');
      if (card) card.classList.add('hidden');
    }

    `;

if (oldThreeStart !== -1 && oldThreeEnd !== -1) {
  code = code.substring(0, oldThreeStart) + newThreeJs.trim() + '\n\n    ' + code.substring(oldThreeEnd);
  console.log('✅ Motor Three.js actualizado con éxito');
}

fs.writeFileSync('scripts/build_unified_app_v2.js', code, 'utf8');
console.log('🎉 scripts/build_unified_app_v2.js ha sido actualizado con todas las especificaciones!');

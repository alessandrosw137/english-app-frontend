const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const sIdx = html.indexOf('function initMusicSessionModule() {');
const eIdx = html.indexOf('function inspectMusicWord(cleanWord, originalWord, event) {');

if (sIdx !== -1 && eIdx !== -1) {
  const newCode = `function initMusicSessionModule() {
      renderMusicTrackButtons('');
      selectMusicTrack(0);
    }

    function renderMusicTrackButtons(filterText = '') {
      const container = document.getElementById("musicTrackButtonsContainer");
      if (!container) return;

      const q = (filterText || '').toLowerCase().trim();
      const filtered = MUSIC_SESSION_TRACKS.map((t, idx) => ({ ...t, originalIndex: idx }))
        .filter(t => !q || t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || (t.genre && t.genre.toLowerCase().includes(q)));

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div class="col-span-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
            No se encontraron canciones que coincidan con "\${filterText}". Puedes pegar una URL de YouTube arriba y presionar "Cargar Video".
          </div>
        \`;
        return;
      }

      container.innerHTML = filtered.map(t => {
        const isSelected = t.originalIndex === currentMusicTrackIdx;
        return \`
          <button onclick="selectMusicTrack(\${t.originalIndex})" id="musicTrackBtn-\${t.originalIndex}" class="p-3 rounded-2xl text-left transition hover:scale-[1.02] cursor-pointer \${isSelected ? 'bg-cyan-950/70 border-2 border-cyan-400 shadow-lg shadow-cyan-950/60' : 'bg-slate-900 border border-slate-800 hover:border-slate-700'}">
            <span class="text-[10px] font-mono uppercase text-cyan-400 font-bold block">\${t.genre || 'Hit'}</span>
            <div class="font-bold text-slate-100 text-xs sm:text-sm truncate" title="\${t.title}">\${t.title}</div>
            <div class="text-[11px] text-slate-400 truncate">\${t.artist}</div>
          </button>
        \`;
      }).join('');
    }

    function handleMusicSearchInput(val) {
      renderMusicTrackButtons(val);
    }

    function extractYouTubeId(urlOrId) {
      if (!urlOrId) return null;
      const str = urlOrId.trim();
      // Si es un ID de 11 caracteres alfanuméricos
      if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
        return str;
      }
      // Formatos youtube.com/watch?v=... o youtu.be/...
      const match = str.match(/(?:youtu\\.be\\/|youtube\\.com\\/(?:embed\\/|v\\/|watch\\?v=|watch\\?.+&v=))([\\w-]{11})/);
      return match ? match[1] : null;
    }

    function handleCustomYouTubeLoad() {
      const input = document.getElementById("musicSearchInput");
      const val = input ? input.value.trim() : "";
      const ytId = extractYouTubeId(val);

      if (!ytId) {
        showFloatingToast("Por favor ingresa un enlace o ID de YouTube válido (ej. https://youtu.be/... o 11 caracteres).");
        return;
      }

      // Crear o sustituir la pista personalizada
      const customTrack = {
        id: "custom_" + ytId,
        title: "Video Personalizado de YouTube",
        artist: "YouTube Player",
        genre: "Video YouTube",
        youtubeId: ytId,
        duration: "0:00",
        lyrics: [
          { time: 0, text: "Video de YouTube cargado exitosamente." },
          { time: 5, text: "Toca cualquier palabra del texto de estudio para inspeccionar su fonética y significado." },
          { time: 10, text: "Practice your listening comprehension with native English speakers." },
          { time: 15, text: "Pay close attention to pronunciation, rhythm and intonation." }
        ],
        dictionary: {
          "video": { ipa: "/ˈvɪd.i.oʊ/", es: "Video / Grabación audiovisual", phrasal: "Tune in", phrasalEs: "Sintonizar / Prestar atención", phrasalEx: "Tune in to English videos daily." },
          "practice": { ipa: "/ˈpræk.tɪs/", es: "Práctica / Ejercicio constante", phrasal: "Keep up", phrasalEs: "Mantener el ritmo", phrasalEx: "Keep up the excellent daily practice!" },
          "listening": { ipa: "/ˈlɪs.ən.ɪŋ/", es: "Escucha activa / Comprensión auditiva", phrasal: "Listen up", phrasalEs: "Prestar mucha atención", phrasalEx: "Listen up to the native pronunciation nuances." },
          "pronunciation": { ipa: "/prəˌnʌn.siˈeɪ.ʃən/", es: "Pronunciación fonética precisa", phrasal: "Sound out", phrasalEs: "Pronunciar sílaba por sílaba", phrasalEx: "Sound out unfamiliar words using IPA." },
          "rhythm": { ipa: "/ˈrɪð.əm/", es: "Ritmo y cadencia del habla", phrasal: "Get into the swing", phrasalEs: "Agarrar el ritmo / acostumbrarse", phrasalEx: "You will soon get into the swing of natural English rhythm." }
        }
      };

      const existingIdx = MUSIC_SESSION_TRACKS.findIndex(t => t.youtubeId === ytId);
      if (existingIdx !== -1) {
        selectMusicTrack(existingIdx);
      } else {
        MUSIC_SESSION_TRACKS.unshift(customTrack);
        renderMusicTrackButtons('');
        selectMusicTrack(0);
      }
      showFloatingToast("¡Video de YouTube cargado con éxito en el reproductor!");
    }

    function selectMusicTrack(idx) {
      currentMusicTrackIdx = idx;
      currentMusicLineIdx = 0;
      stopMusicPlayback();

      const track = MUSIC_SESSION_TRACKS[idx];
      if (!track) return;

      const searchInput = document.getElementById("musicSearchInput");
      renderMusicTrackButtons(searchInput ? searchInput.value : '');

      const iframe = document.getElementById("musicYoutubeIframe");
      if (iframe) {
        iframe.src = \`https://www.youtube-nocookie.com/embed/\${track.youtubeId}?enablejsapi=1&rel=0\`;
      }

      const titleEl = document.getElementById("musicActiveSongTitle");
      if (titleEl) titleEl.textContent = \`\${track.title} - \${track.artist}\`;

      const durEl = document.getElementById("musicDurationDisplay");
      if (durEl) durEl.textContent = track.duration || "0:00";

      renderLyricsList(track);
    }

    function renderLyricsList(track) {
      const container = document.getElementById("musicLyricsContainer");
      if (!container) return;

      container.innerHTML = track.lyrics.map((line, idx) => {
        const words = line.text.split(/(\\s+|[.,!?;:"'()]+)/).filter(Boolean);
        const wordsHtml = words.map(w => {
          if (/^[a-zA-Z0-9'-]+$/.test(w)) {
            const clean = w.toLowerCase().replace(/[^a-z]/g, '');
            return \`<span onclick="inspectMusicWord('\${clean}', '\${w}', event)" class="cursor-pointer hover:text-cyan-300 hover:underline decoration-cyan-400 transition-colors inline-block px-0.5">\${w}</span>\`;
          }
          return \`<span class="opacity-70">\${w}</span>\`;
        }).join('');

        return \`
          <div id="lyricsLine-\${idx}" onclick="jumpToLyricsLine(\${idx})" class="p-2.5 rounded-xl transition-all duration-200 cursor-pointer text-slate-300 hover:bg-slate-800/60 \${idx === currentMusicLineIdx ? 'lyrics-active-line' : ''}">
            \${wordsHtml}
          </div>
        \`;
      }).join('');
    }

    function jumpToLyricsLine(lineIdx) {
      currentMusicLineIdx = lineIdx;
      updateActiveLyricsLine();
    }

    function updateActiveLyricsLine() {
      const track = MUSIC_SESSION_TRACKS[currentMusicTrackIdx];
      if (!track) return;

      for (let i = 0; i < track.lyrics.length; i++) {
        const lineEl = document.getElementById(\`lyricsLine-\${i}\`);
        if (lineEl) {
          if (i === currentMusicLineIdx) {
            lineEl.classList.add("lyrics-active-line");
            lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            lineEl.classList.remove("lyrics-active-line");
          }
        }
      }

      const timeEl = document.getElementById("musicTimeDisplay");
      if (timeEl && track.lyrics[currentMusicLineIdx]) {
        const sec = track.lyrics[currentMusicLineIdx].time;
        const mins = Math.floor(sec / 60);
        const remSecs = sec % 60;
        timeEl.textContent = \`\${mins}:\${remSecs < 10 ? '0' : ''}\${remSecs}\`;
      }
    }

    function toggleMusicPlayback() {
      isMusicPlaying = !isMusicPlaying;
      const btn = document.getElementById("musicPlayBtn");
      if (btn) btn.textContent = isMusicPlaying ? "❚❚" : "▶";

      if (isMusicPlaying) {
        startLyricsProgression();
      } else {
        stopMusicPlayback();
      }
    }

    function startLyricsProgression() {
      if (musicPlaybackTimer) clearInterval(musicPlaybackTimer);
      musicPlaybackTimer = setInterval(() => {
        const track = MUSIC_SESSION_TRACKS[currentMusicTrackIdx];
        if (!track) return;
        currentMusicLineIdx++;
        if (currentMusicLineIdx >= track.lyrics.length) {
          currentMusicLineIdx = 0;
          stopMusicPlayback();
        }
        updateActiveLyricsLine();
      }, 3500);
    }

    function stopMusicPlayback() {
      isMusicPlaying = false;
      const btn = document.getElementById("musicPlayBtn");
      if (btn) btn.textContent = "▶";
      if (musicPlaybackTimer) {
        clearInterval(musicPlaybackTimer);
        musicPlaybackTimer = null;
      }
    }

    `;

  html = html.substring(0, sIdx) + newCode + html.substring(eIdx);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('✅ Funciones JS de Music Session actualizadas exitosamente.');
} else {
  console.error('❌ No se encontraron sIdx y eIdx.');
}

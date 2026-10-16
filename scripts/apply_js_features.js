const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const isCRLF = content.includes('\r\n');
let code = content.replace(/\r\n/g, '\n');

console.log('🚀 Injecting interactive JS features for Music Session, Cuentos, Chatbot Predefined Options, and Dynamic Profile...');

// ========================================================
// 1. DATASET: MUSIC SESSION SONGS WITH SYNCED LYRICS & PHRASAL VERBS
// ========================================================
const musicDatasetCode = `
    // ========================================================
    // CATÁLOGO DE CANCIONES Y LETRAS SINCRONIZADAS (MUSIC SESSION)
    // ========================================================
    const MUSIC_SESSION_TRACKS = [
      {
        id: "rolling_in_the_deep",
        title: "Rolling in the Deep",
        artist: "Adele",
        youtubeId: "rYEDA3JcQqw",
        duration: "3:48",
        lyrics: [
          { time: 8,  text: "There's a fire starting in my heart" },
          { time: 13, text: "Reaching a fever pitch, it's bringing me out the dark" },
          { time: 17, text: "Finally I can see you crystal clear" },
          { time: 21, text: "Go 'head and sell me out and I'll lay your ship bare" },
          { time: 26, text: "See how I'll leave with every piece of you" },
          { time: 30, text: "Don't underestimate the things that I will do" },
          { time: 35, text: "There's a fire starting in my heart" },
          { time: 39, text: "Reaching a fever pitch and it's bringing me out the dark" },
          { time: 43, text: "The scars of your love remind me of us" },
          { time: 47, text: "They keep me thinking that we almost had it all" },
          { time: 52, text: "The scars of your love, they leave me breathless" },
          { time: 56, text: "I can't help feeling..." },
          { time: 60, text: "We could have had it all... Rolling in the deep!" },
          { time: 69, text: "You had my heart inside of your hand" },
          { time: 73, text: "And you played it to the beat" }
        ],
        dictionary: {
          "rolling": { ipa: "/ˈroʊ.lɪŋ/", es: "Rodando / Ondulando con gran fuerza", phrasal: "Roll in", phrasalEs: "Llegar en gran abundancia (ej. ofertas o dinero)", phrasalEx: "Good news kept rolling in all morning." },
          "fire": { ipa: "/faɪr/", es: "Fuego / Pasión ardiente", phrasal: "Fire away", phrasalEs: "Disparar / Empezar a hacer preguntas", phrasalEx: "If you have questions, fire away!" },
          "heart": { ipa: "/hɑːrt/", es: "Corazón / Sentimientos profundos", phrasal: "Take heart", phrasalEs: "Cobrar ánimo o valor", phrasalEx: "Take heart, you will pass the TOEFL test." },
          "reaching": { ipa: "/ˈriː.tʃɪŋ/", es: "Alcanzando / Llegando a", phrasal: "Reach out", phrasalEs: "Contactar a alguien / Ofrecer ayuda", phrasalEx: "Feel free to reach out if you need assistance." },
          "dark": { ipa: "/dɑːrk/", es: "Oscuridad / Desconocimiento", phrasal: "In the dark", phrasalEs: "Estar desinformado / a oscuras", phrasalEx: "We were kept in the dark about the changes." },
          "sell": { ipa: "/sel/", es: "Vender / Traicionar", phrasal: "Sell out", phrasalEs: "Traicionar principios o delatar", phrasalEx: "He refused to sell out his team." },
          "underestimate": { ipa: "/ˌʌn.dɚˈes.tə.meɪt/", es: "Subestimar / Menospreciar", phrasal: "Count out", phrasalEs: "Descartar a alguien", phrasalEx: "Never count yourself out before trying." },
          "scars": { ipa: "/skɑːrz/", es: "Cicatrices / Marcas emocionales", phrasal: "Heal up", phrasalEs: "Sanar / Cicatrizar por completo", phrasalEx: "The deep wound will eventually heal up." },
          "breathless": { ipa: "/ˈbreθ.ləs/", es: "Sin aliento / Boquiabierto", phrasal: "Catch up", phrasalEs: "Recuperar el aliento o ponerse al día", phrasalEx: "Stop running for a moment to catch your breath." }
        }
      },
      {
        id: "viva_la_vida",
        title: "Viva La Vida",
        artist: "Coldplay",
        youtubeId: "dvgZkm1xWPE",
        duration: "4:02",
        lyrics: [
          { time: 12, text: "I used to rule the world" },
          { time: 16, text: "Seas would rise when I gave the word" },
          { time: 20, text: "Now in the morning I sleep alone" },
          { time: 25, text: "Sweep the streets I used to own" },
          { time: 30, text: "I used to roll the dice" },
          { time: 34, text: "Feel the fear in my enemy's eyes" },
          { time: 38, text: "Listen as the crowd would sing" },
          { time: 42, text: "Now the old king is dead, long live the king!" },
          { time: 51, text: "One minute I held the key" },
          { time: 55, text: "Next the walls were closed on me" },
          { time: 59, text: "And I discovered that my castles stand" },
          { time: 64, text: "Upon pillars of salt and pillars of sand" }
        ],
        dictionary: {
          "rule": { ipa: "/ruːl/", es: "Gobernar / Regir", phrasal: "Rule out", phrasalEs: "Descartar una posibilidad", phrasalEx: "The committee ruled out the old proposal." },
          "sweep": { ipa: "/swiːp/", es: "Barrer / Limpiar", phrasal: "Sweep away", phrasalEs: "Arrastrar / Eliminar repentinamente", phrasalEx: "The flood swept away the wooden fences." },
          "roll": { ipa: "/roʊl/", es: "Rodar / Lanzar", phrasal: "Roll on", phrasalEs: "Transcurrir el tiempo", phrasalEx: "As the months roll on, you will improve your fluency." },
          "crowd": { ipa: "/kraʊd/", es: "Multitud / Público", phrasal: "Crowd around", phrasalEs: "Aglomerarse alrededor", phrasalEx: "Fans crowded around the singer." },
          "closed": { ipa: "/kloʊzd/", es: "Cerrado / Atrapado", phrasal: "Close in", phrasalEs: "Acorralar / Acercarse amenazante", phrasalEx: "The cold winter began to close in." },
          "stand": { ipa: "/stænd/", es: "Estar de pie / Sostenerse", phrasal: "Stand by", phrasalEs: "Apoyar / Estar listo", phrasalEx: "True friends will stand by you through difficulties." }
        }
      },
      {
        id: "dont_stop_me_now",
        title: "Don't Stop Me Now",
        artist: "Queen",
        youtubeId: "HgzGwKwLmgM",
        duration: "3:30",
        lyrics: [
          { time: 8,  text: "Tonight I'm gonna have myself a real good time" },
          { time: 14, text: "I feel alive and the world, I'll turn it inside out, yeah" },
          { time: 20, text: "I'm floating around in ecstasy, so don't stop me now!" },
          { time: 28, text: "Cause I'm having a good time, having a good time" },
          { time: 33, text: "I'm a shooting star leaping through the sky like a tiger" },
          { time: 40, text: "Defying the laws of gravity" },
          { time: 43, text: "I'm a racing car passing by like Lady Godiva" },
          { time: 48, text: "I'm gonna go, go, go, there's no stopping me!" }
        ],
        dictionary: {
          "stop": { ipa: "/stɑːp/", es: "Detener / Parar", phrasal: "Stop by", phrasalEs: "Hacer una visita breve e informal", phrasalEx: "Stop by my office when you finish the exercise." },
          "turn": { ipa: "/tɝːn/", es: "Girar / Cambiar", phrasal: "Turn inside out", phrasalEs: "Voltear al revés / Poner patas arriba", phrasalEx: "He turned the room inside out looking for his keys." },
          "floating": { ipa: "/ˈfloʊ.t̬ɪŋ/", es: "Flotando / Levitando", phrasal: "Float around", phrasalEs: "Circular una idea o rumor", phrasalEx: "A great idea was floating around the meeting." },
          "passing": { ipa: "/ˈpæs.ɪŋ/", es: "Pasando / Adelantando", phrasal: "Pass by", phrasalEs: "Pasar de largo sin detenerse", phrasalEx: "I saw the express train pass by at high speed." }
        }
      },
      {
        id: "believer",
        title: "Believer",
        artist: "Imagine Dragons",
        youtubeId: "7wtfhZwyrcc",
        duration: "3:24",
        lyrics: [
          { time: 10, text: "First things first: I'ma say all the words inside my head" },
          { time: 15, text: "I'm fired up and tired of the way that things have been" },
          { time: 20, text: "Second thing second: Don't you tell me what you think that I could be" },
          { time: 25, text: "I'm the one at the sail, I'm the master of my sea" },
          { time: 31, text: "I was broken from a young age" },
          { time: 35, text: "Taking my sulking to the masses" },
          { time: 38, text: "Writing my poems for the few that look at me, took to me" },
          { time: 44, text: "Singing from heartache from the pain" },
          { time: 48, text: "Taking my message from the veins" },
          { time: 51, text: "Speaking my lesson from the brain" },
          { time: 54, text: "Seeing the beauty through the... Pain!" }
        ],
        dictionary: {
          "fired": { ipa: "/faɪrd/", es: "Encendido / Lleno de energía", phrasal: "Fire up", phrasalEs: "Entusiasmar / Encender los ánimos", phrasalEx: "The coach's speech fired up the entire team." },
          "tired": { ipa: "/ˈtaɪ.ɚd/", es: "Cansado / Harto", phrasal: "Tire out", phrasalEs: "Agotar físicamente a alguien", phrasalEx: "The long grammar quiz tired out the students." },
          "broken": { ipa: "/ˈbroʊ.kən/", es: "Roto / Quebrado", phrasal: "Break down", phrasalEs: "Colapsar emocionalmente o averiarse", phrasalEx: "Don't break down under pressure during the exam." },
          "message": { ipa: "/ˈmes.ɪdʒ/", es: "Mensaje / Enseñanza", phrasal: "Get across", phrasalEs: "Hacer entender un mensaje claramente", phrasalEx: "He managed to get his message across in English." }
        }
      }
    ];

    let currentMusicTrackIdx = 0;
    let currentMusicLineIdx = 0;
    let musicPlaybackTimer = null;
    let isMusicPlaying = false;
    let selectedWordForModal = null;

    function initMusicSessionModule() {
      selectMusicTrack(0);
    }

    function selectMusicTrack(idx) {
      currentMusicTrackIdx = idx;
      currentMusicLineIdx = 0;
      stopMusicPlayback();

      const track = MUSIC_SESSION_TRACKS[idx];
      if (!track) return;

      // Update button highlights
      for (let i = 0; i < MUSIC_SESSION_TRACKS.length; i++) {
        const btn = document.getElementById(\`musicTrackBtn-\${i}\`);
        if (btn) {
          if (i === idx) {
            btn.className = "p-3 rounded-2xl bg-cyan-950/60 border border-cyan-400 text-left transition hover:scale-[1.02] cursor-pointer shadow-lg";
          } else {
            btn.className = "p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition hover:scale-[1.02] cursor-pointer";
          }
        }
      }

      const iframe = document.getElementById("musicYoutubeIframe");
      if (iframe) {
        iframe.src = \`https://www.youtube-nocookie.com/embed/\${track.youtubeId}?enablejsapi=1&rel=0\`;
      }

      const titleEl = document.getElementById("musicActiveSongTitle");
      if (titleEl) titleEl.textContent = \`\${track.title} - \${track.artist}\`;

      const durEl = document.getElementById("musicDurationDisplay");
      if (durEl) durEl.textContent = track.duration;

      renderLyricsList(track);
    }

    function renderLyricsList(track) {
      const container = document.getElementById("musicLyricsContainer");
      if (!container) return;

      container.innerHTML = track.lyrics.map((line, idx) => {
        // Envolver cada palabra en un elemento interactivo
        const words = line.text.split(/(\\s+|[.,!?;:"'()]+)/).filter(Boolean);
        const wordsHtml = words.map(w => {
          if (/^[a-zA-Z0-9'-]+$/.test(w)) {
            const clean = w.toLowerCase().replace(/[^a-z]/g, '');
            return \`<span onclick="inspectMusicWord('\${clean}', '\${w}', event)" class="cursor-pointer hover:text-amber-300 hover:underline decoration-amber-400 transition-colors inline-block px-0.5">\${w}</span>\`;
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

        if (currentMusicLineIdx < track.lyrics.length - 1) {
          currentMusicLineIdx++;
          updateActiveLyricsLine();
        } else {
          stopMusicPlayback();
        }
      }, 4200);
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

    function nextLyricsLine() {
      const track = MUSIC_SESSION_TRACKS[currentMusicTrackIdx];
      if (!track) return;
      if (currentMusicLineIdx < track.lyrics.length - 1) {
        currentMusicLineIdx++;
        updateActiveLyricsLine();
      }
    }

    function prevLyricsLine() {
      if (currentMusicLineIdx > 0) {
        currentMusicLineIdx--;
        updateActiveLyricsLine();
      }
    }

    // Modal de traducción y Phrasal Verb interactivo al tocar cualquier palabra
    function inspectMusicWord(cleanWord, originalWord, event) {
      if (event) event.stopPropagation();

      // Pausar música automáticamente
      stopMusicPlayback();

      const track = MUSIC_SESSION_TRACKS[currentMusicTrackIdx];
      const dict = (track && track.dictionary) ? track.dictionary : {};

      const info = dict[cleanWord] || {
        ipa: \`/\${cleanWord}/\`,
        es: \`Término clave: "\${originalWord}"\`,
        phrasal: \`\${originalWord.charAt(0).toUpperCase() + originalWord.slice(1)} out / in\`,
        phrasalEs: "Verbo o expresión idiomática vinculada al contexto sonoro.",
        phrasalEx: \`"The melody uses \${originalWord} to emphasize strong emotion."\`
      };

      selectedWordForModal = originalWord;

      document.getElementById("musicWordEn").textContent = originalWord;
      document.getElementById("musicWordIpa").textContent = info.ipa || \`/\${cleanWord}/\`;
      document.getElementById("musicWordEs").textContent = info.es;
      document.getElementById("musicWordPhrasal").textContent = \`\${info.phrasal} • \${info.phrasalEs}\`;
      document.getElementById("musicWordPhrasalEx").textContent = info.phrasalEx || "";

      document.getElementById("musicWordModal").classList.remove("hidden");
    }

    function closeMusicWordModal(resume = true) {
      document.getElementById("musicWordModal").classList.add("hidden");
      if (resume) {
        toggleMusicPlayback();
      }
    }

    function playWordTTS() {
      if (selectedWordForModal && typeof speakEnglish === 'function') {
        speakEnglish(selectedWordForModal);
      }
    }
`;

// ========================================================
// 2. DATASET: CUENTOS ILUSTRADOS Y MODO BILINGÜE
// ========================================================
const storiesBilingualCode = `
    // ========================================================
    // MODO BILINGÜE Y NARRADOR PARA EL MÓDULO CUENTOS
    // ========================================================
    let isBilingualStoryModeActive = true;
    let storyNarrationUtterance = null;
    let isStoryNarrating = false;

    function toggleBilingualStoryMode() {
      isBilingualStoryModeActive = !isBilingualStoryModeActive;
      const btn = document.getElementById("storyBilingualToggleBtn");
      if (btn) {
        btn.textContent = isBilingualStoryModeActive ? "🌐 Ocultar Español" : "🌐 Modo Bilingüe";
        btn.className = isBilingualStoryModeActive
          ? "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 text-xs font-semibold transition cursor-pointer shadow-sm"
          : "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer";
      }

      // Toggle todas las tarjetas de traducción en el cuento
      const transBoxes = document.querySelectorAll(".story-trans-box");
      transBoxes.forEach(box => {
        if (isBilingualStoryModeActive) {
          box.classList.remove("hidden");
        } else {
          box.classList.add("hidden");
        }
      });
    }

    function toggleStoryNarration() {
      if (!('speechSynthesis' in window)) {
        alert("Tu navegador no soporta síntesis de voz (TTS).");
        return;
      }

      if (isStoryNarrating) {
        window.speechSynthesis.cancel();
        isStoryNarrating = false;
        const btn = document.getElementById("storyNarrationBtn");
        if (btn) btn.textContent = "🔊 Narrar Cuento";
      } else {
        const story = STORIES_DATA[currentStoryIndex];
        if (!story) return;

        const fullText = story.paragraphs.map(p => p.sentences.join(' ')).join('. ');
        storyNarrationUtterance = new SpeechSynthesisUtterance(fullText);
        storyNarrationUtterance.lang = "en-US";
        storyNarrationUtterance.rate = 0.92;

        storyNarrationUtterance.onend = () => {
          isStoryNarrating = false;
          const btn = document.getElementById("storyNarrationBtn");
          if (btn) btn.textContent = "🔊 Narrar Cuento";
        };

        storyNarrationUtterance.onerror = () => {
          isStoryNarrating = false;
          const btn = document.getElementById("storyNarrationBtn");
          if (btn) btn.textContent = "🔊 Narrar Cuento";
        };

        window.speechSynthesis.speak(storyNarrationUtterance);
        isStoryNarrating = true;
        const btn = document.getElementById("storyNarrationBtn");
        if (btn) btn.textContent = "❚❚ Pausar Narración";
      }
    }
`;

// ========================================================
// 3. CHATBOT: PREDEFINED OPTIONS DIRECT RESPONSES (HELP BOT)
// ========================================================
const chatbotPredefinedCode = `
    // ========================================================
    // RESPUESTAS DIRECTAS PREDEFINIDAS DEL CHATBOT DE ASISTENCIA
    // ========================================================
    function handlePredefinedChat(topic) {
      const container = document.getElementById("chatbotMessagesContainer");
      if (!container) return;

      const user = getStoredUser();
      const username = user ? user.username : getStudentName();
      const exp = getUserExp();
      const rank = getRankInfo(exp);

      let responseText = "";
      let topicTitle = "";

      if (topic === 'phrasal_verbs') {
        topicTitle = "Dudas sobre Phrasal Verbs";
        responseText = \`
          <strong>📘 Guía Rápida de Phrasal Verbs:</strong><br>
          • <strong>¿Qué son?</strong> Es la combinación de un verbo + partícula (preposición o adverbio) cuyo significado cambia por completo.<br>
          • <strong>Separables:</strong> El objeto directo puede ir en medio. Ej: <em>"Turn off the light"</em> o <em>"Turn the light off"</em>.<br>
          • <strong>Inseparables:</strong> El verbo y la partícula deben ir siempre juntos. Ej: <em>"Look after the kids"</em>.<br>
          • <strong>Estrategia TOEFL:</strong> Apréndelos por contexto temático (trabajo, viaje, emociones) en lugar de memorizarlos en listas A-Z.
        \`;
      } else if (topic === 'toefl') {
        topicTitle = "¿Cómo funciona el examen TOEFL?";
        responseText = \`
          <strong>🎓 Formato del Examen TOEFL iBT:</strong><br>
          • <strong>Estructura:</strong> 4 secciones evaluadas de 0 a 30 puntos cada una (Total: 120 pts).<br>
          • <strong>Reading:</strong> 35 minutos, 20 preguntas sobre pasajes académicos.<br>
          • <strong>Listening:</strong> 36 minutos sobre conferencias y conversaciones universitarias.<br>
          • <strong>Speaking & Writing:</strong> Tareas integradas de síntesis y redacción académica.<br>
          • <strong>En esta App:</strong> Dirígete al <strong>Módulo 10 (TOEFL Simulator)</strong> en el Learning Path para entrenar con simulaciones reales cronometradas.
        \`;
      } else if (topic === 'progress') {
        topicTitle = "Revisar mi progreso y EXP";
        responseText = \`
          <strong>📊 Tu Estado de Aprendizaje Actual:</strong><br>
          • <strong>Usuario:</strong> \${username}<br>
          • <strong>Rango Actual:</strong> <span class="text-amber-400 font-bold">\${rank.name}</span> (\${rank.rangeText})<br>
          • <strong>Puntos Acumulados:</strong> \${exp} EXP<br>
          • <strong>Para el siguiente rango:</strong> \${rank.isMax ? '¡Rango Máximo Alcanzado!' : \`Faltan \${rank.missingExp} EXP\`}<br>
          • <strong>Persistencia:</strong> Conectado a PostgreSQL (english_app).
        \`;
      } else if (topic === 'free_chat') {
        topicTitle = "Pregunta abierta / Chat libre";
        responseText = \`
          Escribe cualquier duda o pide un ejemplo en la barra inferior. Responderé de inmediato, directo al punto y sin rodeos.
        \`;
        const input = document.getElementById("chatbotUserInput");
        if (input) input.focus();
      }

      // Insertar pregunta y respuesta directa
      appendChatbotMessage("user", topicTitle);
      setTimeout(() => {
        appendChatbotMessage("bot", responseText);
      }, 150);
    }
`;

// ========================================================
// 4. DYNAMIC PROFILE: GUEST VS REGISTERED ACTIONS
// ========================================================
const profileDynamicCode = `
    // ========================================================
    // PERFIL DINÁMICO: INVITADO VS REGISTRADO (POSTGRESQL SYNC)
    // ========================================================
    function updateProfileAccountBox() {
      const box = document.getElementById("profileAccountActionBox");
      if (!box) return;

      const user = getStoredUser();
      const isGuest = !user || user.role === 'guest' || user.username === 'Invitado';

      if (isGuest) {
        box.innerHTML = \`
          <div class="p-5 rounded-3xl bg-amber-950/40 border border-amber-500/40 shadow-xl space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span class="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">Modo Invitado Activo</span>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Sin Guardar en DB</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Tus niveles, EXP y vocabulario se conservan de forma temporal en tu dispositivo. Inicia sesión o vincula tu cuenta para respaldar tu progreso en la base de datos PostgreSQL de forma permanente.
            </p>
            <button onclick="showAuthScreen()" class="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
              <span>🔗 Vincular Cuenta / Iniciar Sesión</span>
            </button>
          </div>
        \`;
      } else {
        box.innerHTML = \`
          <div class="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Cuenta Verificada en PostgreSQL</span>
              </div>
              <span class="text-[10px] font-mono text-slate-400">\${user.role === 'admin' ? 'ADMIN / AUTOR' : 'ESTUDIANTE'}</span>
            </div>
            <div class="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button onclick="forceSyncFromProfile()" class="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow">
                <span>🔄 Sincronizar Datos con DB</span>
              </button>
              <button onclick="handleLogout()" class="py-3 px-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow">
                <span>🚪 Cerrar Sesión</span>
              </button>
            </div>
          </div>
        \`;
      }
    }

    function forceSyncFromProfile() {
      if (window.BackendSync) {
        BackendSync.flushQueue();
        BackendSync.checkConnection();
        showFloatingToast("🔄 Sincronizando datos con PostgreSQL (english_app)...");
      }
    }

    function handleLogout() {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (e) {}
      showFloatingToast("Sesión cerrada. Regresando a la pantalla de acceso...");
      setTimeout(() => {
        showAuthScreen();
      }, 400);
    }
`;

// Hook updateProfileAccountBox into renderProfileView
const oldRenderProfileRegex = /function renderProfileView\(\)\s*\{/;
if (code.includes('function renderProfileView() {')) {
  code = code.replace(
    'function renderProfileView() {',
    `function renderProfileView() {
      updateProfileAccountBox();`
  );
  console.log('✅ updateProfileAccountBox hooked into renderProfileView.');
}

// Hook initMusicSessionModule into openPortalView
const oldOpenPortalRegex = /if \(portalKey === 'medialab'\) \{[\s\S]*?showView\('view-medialab'\);/;
if (oldOpenPortalRegex.test(code)) {
  code = code.replace(
    oldOpenPortalRegex,
    `if (portalKey === 'medialab') {
        navigationHistory.push('medialab');
        initMusicSessionModule();
        showView('view-medialab');`
  );
  console.log('✅ openPortalView updated to launch initMusicSessionModule.');
}

// Append new module codes before the closing script tag
const scriptEndMarker = '</script>';
const allNewCode = `
${musicDatasetCode}
${storiesBilingualCode}
${chatbotPredefinedCode}
${profileDynamicCode}
${scriptEndMarker}`;

code = code.replace(scriptEndMarker, allNewCode);
console.log('✅ All module JavaScript injected cleanly.');

if (isCRLF) {
  code = code.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('🎉 apply_js_features.js finished cleanly!');

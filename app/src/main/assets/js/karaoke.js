/**
 * MasterENG - Módulo de Música y Karaoke con Letras Iluminadas
 * Sincronización en vivo estilo Spotify / Apple Music ('timeupdate')
 */
(function() {
  'use strict';

  // ==========================================================================
  // DICCIONARIO DE OFFSETS PRE-CALIBRADOS POR CANCIÓN (COMPENSACIÓN DE INTRO DE YOUTUBE)
  // ==========================================================================
  const songOffsets = {
    "losing_my_religion": -0.5,
    "rolling_in_the_deep": -0.4,
    "viva_la_vida": -0.6,
    "dont_stop_me_now": -0.5,
    "believer": -0.4,
    "shape_of_you": -0.5,
    "in_the_end": -0.6,
    "bohemian_rhapsody": -0.3,
    "yellow": -0.6,
    "radioactive": -0.5
  };
  window.songOffsets = songOffsets;

  let lastActiveStanzaIndex = -1;
  let lastActiveWordIndex = -1;
  window._lastActiveStanzaIndex = -1;
  window._lastActiveWordIndex = -1;
  window._isUserScrollingLyrics = false;
  let _userScrollLyricsTimer = null;

  // ==========================================================================
  // MOTOR O(1) DE SINCRONIZACIÓN DE LETRAS SIN LAG CON RELOJ INTERPOLADO (16MS)
  // ==========================================================================
  const KaraokeSyncEngine = {
    rafId: null,
    syncRafId: null,
    syncTimer: null,
    lastYtTime: 0,
    lastPerfTime: 0,
    currentIndex: -1,
    currentLyricIndex: -1,
    lyricNodes: [],
    lyricsData: [],
    stanzas: [],
    offsetSec: 0,
    currentSongId: null,

    start(player, lyrics, songId) {
      this.stop();
      this.lyricsData = lyrics || [];
      this.stanzas = this.lyricsData;
      this.currentIndex = -1;
      this.currentLyricIndex = -1;

      // Identificar ID de la canción
      let sId = 'custom_song';
      if (typeof songId === 'string') {
        sId = songId;
      } else if (songId && songId.id) {
        sId = songId.id;
      } else if (typeof currentMusicIndex === 'number' && MUSIC_SESSION_TRACKS[currentMusicIndex]) {
        sId = MUSIC_SESSION_TRACKS[currentMusicIndex].id;
      }
      this.currentSongId = sId;

      // Recuperar offset guardado en localStorage o valor pre-calibrado
      let savedOffset = null;
      try {
        const s1 = localStorage.getItem('k_offset_' + sId);
        const s2 = localStorage.getItem('karaoke_offset_' + sId);
        if (s1 !== null && !isNaN(parseFloat(s1))) savedOffset = parseFloat(s1);
        else if (s2 !== null && !isNaN(parseFloat(s2))) savedOffset = parseFloat(s2);
      } catch (_) {}

      const defaultOffset = (songOffsets && songOffsets[sId] !== undefined)
        ? songOffsets[sId]
        : ((typeof songId === 'object' && typeof songId.defaultOffset === 'number') ? songId.defaultOffset : 0);

      this.offsetSec = savedOffset !== null ? savedOffset : defaultOffset;
      window.lyricsOffset = this.offsetSec;

      // Cachear en memoria las referencias a los nodos del DOM una sola vez
      const container = document.getElementById('karaoke-lyrics-container') || document.getElementById('musicLyricsContainer');
      this.lyricNodes = (container && typeof container.querySelectorAll === 'function')
        ? Array.from(container.querySelectorAll('.karaoke-lyric-line, .lyric-line'))
        : (typeof document.querySelectorAll === 'function' ? Array.from(document.querySelectorAll('.karaoke-lyric-line, .lyric-line')) : []);

      ensureKaraokeOffsetControls();
      this.updateOffsetBadgeUI();

      this.lastYtTime = 0;
      this.lastPerfTime = performance.now();

      const tick = () => {
        const p = player || window._holoYtPlayer || ytMusicPlayer || window.ytMusicPlayer;
        if (p) {
          let pState = -1;
          if (typeof p.getPlayerState === 'function') {
            try { pState = p.getPlayerState(); } catch (_) {}
          } else if (window.ytMasterState && typeof window.ytMasterState.playerState === 'number') {
            pState = window.ytMasterState.playerState;
          }

          if (pState === 1) { // PLAYING
            let rawTime = 0;
            if (typeof p.getCurrentTime === 'function') {
              try { rawTime = p.getCurrentTime(); } catch (_) {}
            } else if (window.ytMasterState && typeof window.ytMasterState.currentTime === 'number') {
              rawTime = window.ytMasterState.currentTime;
            }

            const now = performance.now();
            if (Math.abs(rawTime - this.lastYtTime) > 0.05) {
              this.lastYtTime = rawTime;
              this.lastPerfTime = now;
            }
            const smoothTime = this.lastYtTime + ((now - this.lastPerfTime) / 1000) + this.offsetSec;
            this.updateActiveLine(smoothTime);
          }
        }
        this.rafId = requestAnimationFrame(tick);
        this.syncRafId = this.rafId;
      };

      this.rafId = requestAnimationFrame(tick);
      this.syncRafId = this.rafId;
    },

    updateActiveLine(currentTime) {
      let idx = -1;
      const data = this.lyricsData;
      const len = data.length;

      // Búsqueda binaria O(log N) para máximo rendimiento
      if (len > 0) {
        let low = 0;
        let high = len - 1;
        while (low <= high) {
          const mid = (low + high) >> 1;
          const midTime = typeof data[mid].time === 'number'
            ? data[mid].time
            : (typeof data[mid].startTime === 'number' ? data[mid].startTime : 0);
          if (midTime <= currentTime) {
            idx = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
      }

      // REGLA DE ORO ANTI-LAG: Si el índice no ha cambiado, no tocar el DOM ni hacer scroll
      if (idx === this.currentIndex) return;

      // Actualizar solo las clases de la línea anterior y la nueva
      if (this.currentIndex >= 0 && this.lyricNodes[this.currentIndex]) {
        const prevNode = this.lyricNodes[this.currentIndex];
        prevNode.classList.remove('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
        if (!prevNode.classList.contains('lyric-inactive')) {
          prevNode.classList.add('lyric-inactive');
        }
      }

      this.currentIndex = idx;
      this.currentLyricIndex = idx;

      if (idx >= 0 && this.lyricNodes[idx]) {
        const node = this.lyricNodes[idx];
        node.classList.remove('lyric-inactive');
        node.classList.add('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
        const container = node.parentElement;
        if (container && !window._isUserScrollingLyrics) {
          const scrollTarget = node.offsetTop - (container.clientHeight / 2) + (node.clientHeight / 2);
          container.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' });
        }
        const badge = document.getElementById('karaokeTimeBadge');
        if (badge) {
          badge.textContent = `Estrofa ${idx + 1} de ${len}`;
        }
      }
    },

    adjustOffset(delta, songId) {
      const sId = songId || this.currentSongId;
      this.offsetSec = Math.round((this.offsetSec + delta) * 10) / 10;
      window.lyricsOffset = this.offsetSec;
      if (sId) {
        try {
          localStorage.setItem('k_offset_' + sId, String(this.offsetSec));
          localStorage.setItem('karaoke_offset_' + sId, String(this.offsetSec));
        } catch (_) {}
      }
      this.updateOffsetBadgeUI();
      if (typeof showFloatingToast === 'function') {
        const sign = this.offsetSec >= 0 ? '+' : '';
        showFloatingToast(`Sincronía: ${sign}${this.offsetSec.toFixed(1)}s`, '⏱️');
      }
    },

    setOffset(val, songId) {
      const sId = songId || this.currentSongId;
      this.offsetSec = Math.round(val * 10) / 10;
      window.lyricsOffset = this.offsetSec;
      if (sId) {
        try {
          localStorage.setItem('k_offset_' + sId, String(this.offsetSec));
          localStorage.setItem('karaoke_offset_' + sId, String(this.offsetSec));
        } catch (_) {}
      }
      this.updateOffsetBadgeUI();
      if (typeof showFloatingToast === 'function') {
        const sign = this.offsetSec >= 0 ? '+' : '';
        showFloatingToast(`Sincronía restablecida: ${sign}${this.offsetSec.toFixed(1)}s`, '⏱️');
      }
    },

    updateOffsetBadgeUI() {
      const sign = (typeof this.offsetSec === 'number' && this.offsetSec > 0) ? '+' : '';
      const text = typeof this.offsetSec === 'number' ? (sign + this.offsetSec.toFixed(1) + 's') : '0.0s';
      const badge1 = document.getElementById('karaokeOffsetBadge');
      if (badge1) badge1.textContent = text;
      const badge2 = document.getElementById('lyricsOffsetBadge');
      if (badge2) badge2.textContent = `Sync: ${text}`;
    },

    stop() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.syncRafId) {
        cancelAnimationFrame(this.syncRafId);
        this.syncRafId = null;
      }
      if (this.syncTimer) {
        clearInterval(this.syncTimer);
        this.syncTimer = null;
      }
      this.currentIndex = -1;
      this.currentLyricIndex = -1;
    },

    initSong(lyrics) {
      this.lyricsData = lyrics || [];
      this.stanzas = this.lyricsData;
      this.currentIndex = -1;
      this.currentLyricIndex = -1;
      const container = document.getElementById('karaoke-lyrics-container') || document.getElementById('musicLyricsContainer');
      if (container) {
        this.lyricNodes = Array.from(container.querySelectorAll('.karaoke-lyric-line, .lyric-line'));
      }
    },

    syncFrame(time, force) {
      this.updateActiveLine(time);
    },

    updateSeekBarUI(time) {
      const bar = document.getElementById('musicProgressBar') || document.getElementById('karaokeProgressBar');
      if (bar && window._currentTrackTotalDuration && window._currentTrackTotalDuration > 0) {
        const pct = Math.min(100, Math.max(0, (time / window._currentTrackTotalDuration) * 100));
        bar.style.width = pct + '%';
      }
    },

    getCurrentPlaybackTime() {
      return (typeof getMasterPlaybackTime === 'function') ? getMasterPlaybackTime() : 0;
    }
  };

  window.KaraokeSyncEngine = KaraokeSyncEngine;

  function ensureKaraokeOffsetControls() {
    if (typeof document === 'undefined') return;
    let ctrl = document.getElementById('karaokeOffsetControls');
    if (!ctrl) {
      const container = document.getElementById('karaoke-lyrics-container') || document.getElementById('musicLyricsContainer');
      if (container && container.parentNode) {
        ctrl = document.createElement('div');
        ctrl.id = 'karaokeOffsetControls';
        ctrl.className = 'karaoke-sync-floating-bar flex items-center justify-between gap-2 px-3 py-1.5 mb-2.5 bg-slate-950/90 border border-cyan-500/40 rounded-xl text-xs font-mono text-slate-300 shadow-lg backdrop-blur-md sticky top-0 z-20';
        ctrl.innerHTML = `
          <div class="flex items-center gap-1.5">
            <span class="text-cyan-400 font-bold text-[11px] flex items-center gap-1">⏱️ Sincronía:</span>
            <span id="karaokeOffsetBadge" class="px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold text-[11px]">0.0s</span>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" onclick="window.KaraokeSyncEngine.adjustOffset(-0.5)" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-950/80 active:scale-95 text-slate-200 hover:text-cyan-300 text-[10px] font-bold transition cursor-pointer border border-slate-700 hover:border-cyan-500/50" title="Adelantar letra 0.5s">[-0.5s]</button>
            <button type="button" onclick="window.KaraokeSyncEngine.setOffset(0)" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-cyan-300 text-[10px] font-bold transition cursor-pointer border border-slate-700" title="Reiniciar sincronía a 0.0s">[0.0s]</button>
            <button type="button" onclick="window.KaraokeSyncEngine.adjustOffset(0.5)" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-950/80 active:scale-95 text-slate-200 hover:text-cyan-300 text-[10px] font-bold transition cursor-pointer border border-slate-700 hover:border-cyan-500/50" title="Retrasar letra 0.5s">[+0.5s]</button>
          </div>
        `;
        container.parentNode.insertBefore(ctrl, container);
      }
    }
  }
  window.ensureKaraokeOffsetControls = ensureKaraokeOffsetControls;

  function updateLyricsOffsetUI() {
    KaraokeSyncEngine.updateOffsetBadgeUI();
  }
  window.updateLyricsOffsetUI = updateLyricsOffsetUI;

  window.adjustLyricsOffset = function(delta) {
    KaraokeSyncEngine.adjustOffset(delta);
  };

  window.setLyricsOffset = function(val) {
    KaraokeSyncEngine.setOffset(val);
  };

  const MUSIC_SESSION_TRACKS = [
      {
        id: "losing_my_religion",
        title: "Losing My Religion",
        defaultOffset: -0.5,
        artist: "R.E.M.",
        genre: "Alternative Rock",
        youtubeId: "xwtdhWltSIg",
        duration: "4:28",
        lyrics: [
          { time: 8, text: "Oh life is bigger, it's bigger than you", es: "Oh, la vida es más grande, es más grande que tú" },
          { time: 13, text: "And you are not me, the lengths that I will go to", es: "Y tú no eres yo, los extremos a los que llegaré" },
          { time: 18, text: "The distance in your eyes", es: "La distancia en tus ojos" },
          { time: 24, text: "Oh no, I've said too much, I set it up", es: "Oh no, he dicho demasiado, lo he provocado" },
          { time: 30, text: "That's me in the corner, that's me in the spotlight", es: "Ese soy yo en la esquina, ese soy yo bajo el reflector" },
          { time: 36, text: "Losing my religion", es: "Perdiendo el control y mi paciencia" },
          { time: 41, text: "Trying to keep up with you, and I don't know if I can do it", es: "Tratando de mantener tu ritmo, y no sé si podré lograrlo" },
          { time: 47, text: "Oh no, I've said too much, I haven't said enough", es: "Oh no, he dicho demasiado, no he dicho lo suficiente" },
          { time: 54, text: "I thought that I heard you laughing", es: "Creí haberte escuchado reír" },
          { time: 58, text: "I thought that I heard you sing", es: "Creí haberte escuchado cantar" },
          { time: 63, text: "I think I thought I saw you try", es: "Creo que creí verte intentarlo" },
          { time: 70, text: "Every whisper, of every waking hour", es: "Cada susurro, de cada hora despierto" },
          { time: 76, text: "I'm choosing my confessions, trying to keep an eye on you", es: "Elijo mis confesiones, intentando no perderte de vista" },
          { time: 82, text: "Like a hurt, lost and blinded fool, fool", es: "Como un tonto herido, perdido y cegado" }
        ]
      },
      {
        id: "rolling_in_the_deep",
        title: "Rolling in the Deep",
        defaultOffset: -0.4,
        artist: "Adele",
        genre: "Pop Soul",
        youtubeId: "rYEDA3JcQqw",
        duration: "3:48",
        lyrics: [
          { time: 8, text: "There's a fire starting in my heart", es: "Hay un fuego encendiéndose en mi corazón" },
          { time: 13, text: "Reaching a fever pitch, it's bringing me out the dark", es: "Alcanzando su punto álgido, me saca de la oscuridad" },
          { time: 17, text: "Finally I can see you crystal clear", es: "Por fin puedo verte con total claridad" },
          { time: 21, text: "Go 'head and sell me out and I'll lay your ship bare", es: "Adelante, traicióname y dejaré tu barco al descubierto" },
          { time: 26, text: "See how I'll leave with every piece of you", es: "Mira cómo me iré con cada pedazo de ti" },
          { time: 30, text: "Don't underestimate the things that I will do", es: "No subestimes las cosas que soy capaz de hacer" },
          { time: 43, text: "The scars of your love remind me of us", es: "Las cicatrices de tu amor me recuerdan a nosotros" },
          { time: 47, text: "They keep me thinking that we almost had it all", es: "Me hacen seguir pensando que casi lo tuvimos todo" },
          { time: 60, text: "We could have had it all... Rolling in the deep!", es: "Pudimos haberlo tenido todo... ¡Rodando en lo más profundo!" },
          { time: 69, text: "You had my heart inside of your hand", es: "Tenías mi corazón dentro de tu mano" }
        ]
      },
      {
        id: "viva_la_vida",
        title: "Viva La Vida",
        defaultOffset: -0.6,
        artist: "Coldplay",
        genre: "Alt Rock",
        youtubeId: "dvgZkm1xWPE",
        duration: "4:02",
        lyrics: [
          { time: 12, text: "I used to rule the world", es: "Solía gobernar el mundo" },
          { time: 16, text: "Seas would rise when I gave the word", es: "Los mares se elevaban cuando daba la orden" },
          { time: 20, text: "Now in the morning I sleep alone", es: "Ahora por la mañana duermo en soledad" },
          { time: 25, text: "Sweep the streets I used to own", es: "Barro las calles que solían ser mías" },
          { time: 30, text: "I used to roll the dice", es: "Solía tirar los dados" },
          { time: 34, text: "Feel the fear in my enemy's eyes", es: "Sentir el temor en los ojos de mis enemigos" },
          { time: 42, text: "Now the old king is dead, long live the king!", es: "Ahora el viejo rey ha muerto, ¡larga vida al rey!" },
          { time: 51, text: "One minute I held the key", es: "Un minuto tenía la llave" },
          { time: 55, text: "Next the walls were closed on me", es: "Al siguiente las paredes se cerraron sobre mí" },
          { time: 59, text: "And I discovered that my castles stand", es: "Y descubrí que mis castillos se sostienen" },
          { time: 64, text: "Upon pillars of salt and pillars of sand", es: "Sobre pilares de sal y pilares de arena" }
        ]
      },
      {
        id: "dont_stop_me_now",
        title: "Don't Stop Me Now",
        defaultOffset: -0.5,
        artist: "Queen",
        genre: "Classic Rock",
        youtubeId: "HgzGwKwLmgM",
        duration: "3:30",
        lyrics: [
          { time: 7, text: "Tonight I'm gonna have myself a real good time", es: "Esta noche me la voy a pasar realmente bien" },
          { time: 13, text: "I feel alive and the world I'll turn it inside out, yeah", es: "Me siento vivo y pondré el mundo de cabeza, sí" },
          { time: 19, text: "I'm floating around in ecstasy, so don't stop me now", es: "Estoy flotando en éxtasis, así que no me detengas ahora" },
          { time: 33, text: "I'm a shooting star leaping through the sky like a tiger", es: "Soy una estrella fugaz saltando por el cielo como un tigre" },
          { time: 40, text: "Defying the laws of gravity", es: "Desafiando las leyes de la gravedad" },
          { time: 43, text: "I'm a racing car passing by like Lady Godiva", es: "Soy un auto de carreras pasando como Lady Godiva" },
          { time: 47, text: "I'm gonna go, go, go, there's no stopping me!", es: "¡Voy a avanzar y avanzar, no hay quien me detenga!" }
        ]
      },
      {
        id: "believer",
        title: "Believer",
        defaultOffset: -0.4,
        artist: "Imagine Dragons",
        genre: "Indie Rock",
        youtubeId: "7wtfhZwyrcc",
        duration: "3:24",
        lyrics: [
          { time: 8, text: "First things first: I'ma say all the words inside my head", es: "Lo primero es lo primero: diré todo lo que llevo en mi cabeza" },
          { time: 13, text: "I'm fired up and tired of the way that things have been", es: "Estoy encendido y cansado de cómo han sido las cosas" },
          { time: 26, text: "I'm the one at the sail, I'm the master of my sea", es: "Soy quien lleva las velas, soy el dueño de mi destino" },
          { time: 33, text: "I was broken from a young age", es: "Estuve roto desde temprana edad" },
          { time: 36, text: "Taking my sulking to the masses", es: "Llevando mis lamentos ante las multitudes" },
          { time: 44, text: "Pain! You made me a, you made me a believer, believer!", es: "¡Dolor! Me convertiste en un creyente, ¡un creyente!" }
        ]
      },
      {
        id: "shape_of_you",
        title: "Shape of You",
        defaultOffset: -0.5,
        artist: "Ed Sheeran",
        genre: "Pop Hit",
        youtubeId: "JGwWNGJdvx8",
        duration: "3:53",
        lyrics: [
          { time: 9, text: "The club isn't the best place to find a lover", es: "El club no es el mejor sitio para encontrar un amor" },
          { time: 13, text: "So the bar is where I go", es: "Así que voy directo al bar" },
          { time: 23, text: "Come over and start up a conversation with just me", es: "Acércate e inicia una conversación a solas conmigo" },
          { time: 27, text: "And trust me I'll give it a chance now", es: "Y créeme, le daré una oportunidad ahora" },
          { time: 49, text: "I'm in love with the shape of you", es: "Estoy enamorado de tu silueta" },
          { time: 54, text: "We push and pull like a magnet do", es: "Nos atraemos y empujamos como un imán" }
        ]
      },
      {
        id: "in_the_end",
        title: "In the End",
        defaultOffset: -0.6,
        artist: "Linkin Park",
        genre: "Alternative Rock",
        youtubeId: "eVTXPUF4Oz4",
        duration: "3:36",
        lyrics: [
          { time: 9, text: "It starts with one, one thing, I don't know why", es: "Comienza con una cosa, no sé por qué razón" },
          { time: 14, text: "It doesn't even matter how hard you try", es: "Ni siquiera importa qué tan duro lo intentes" },
          { time: 26, text: "All I know, time is a valuable thing", es: "Todo lo que sé es que el tiempo es un bien invaluable" },
          { time: 30, text: "Watch it fly by as the pendulum swings", es: "Míralo pasar volando mientras oscila el péndulo" },
          { time: 44, text: "I tried so hard and got so far", es: "Me esforcé tanto y llegué tan lejos" },
          { time: 48, text: "But in the end, it doesn't even matter", es: "Pero al final, ni siquiera importa" }
        ]
      },
      {
        id: "bohemian_rhapsody",
        title: "Bohemian Rhapsody",
        defaultOffset: -0.3,
        artist: "Queen",
        genre: "Classic Rock",
        youtubeId: "fJ9rUzIMcZQ",
        duration: "5:55",
        lyrics: [
          { time: 4, text: "Is this the real life? Is this just fantasy?", es: "¿Es esta la vida real? ¿Es solo fantasía?" },
          { time: 11, text: "Caught in a landslide, no escape from reality", es: "Atrapado en un derrumbe, sin escape de la realidad" },
          { time: 18, text: "Open your eyes, look up to the skies and see", es: "Abre tus ojos, mira hacia los cielos y observa" },
          { time: 27, text: "I'm just a poor boy, I need no sympathy", es: "Solo soy un muchacho pobre, no necesito compasión" },
          { time: 33, text: "Because I'm easy come, easy go, little high, little low", es: "Porque lo que fácil viene, fácil se va, un poco arriba, un poco abajo" }
        ]
      },
      {
        id: "yellow",
        title: "Yellow",
        defaultOffset: -0.6,
        artist: "Coldplay",
        genre: "Alternative Rock",
        youtubeId: "yKNxeF4KMsY",
        duration: "4:29",
        lyrics: [
          { time: 16, text: "Look at the stars, look how they shine for you", es: "Mira las estrellas, mira cómo brillan para ti" },
          { time: 24, text: "And everything you do, yeah they were all yellow", es: "Y todo lo que haces, sí, todas eran amarillas" },
          { time: 37, text: "I came along, I wrote a song for you", es: "Llegué hasta aquí, escribí una canción para ti" },
          { time: 78, text: "Your skin, oh yeah your skin and bones", es: "Tu piel, oh sí, tu piel y tus huesos" },
          { time: 86, text: "Turn into something beautiful, you know I love you so", es: "Se convierten en algo hermoso, sabes que te quiero tanto" }
        ]
      },
      {
        id: "radioactive",
        title: "Radioactive",
        defaultOffset: -0.5,
        artist: "Imagine Dragons",
        genre: "Alternative Rock",
        youtubeId: "ktvTqknDobU",
        duration: "3:06",
        lyrics: [
          { time: 14, text: "I'm waking up to ash and dust", es: "Me estoy despertando entre cenizas y polvo" },
          { time: 18, text: "I wipe my brow and I sweat my rust", es: "Me limpio la frente y sudo todo mi óxido" },
          { time: 22, text: "I'm breathing in the chemicals", es: "Estoy respirando las sustancias químicas" },
          { time: 28, text: "I'm breaking in, shaping up, then checking out on the prison bus", es: "Entrando en ritmo, poniéndome en forma, partiendo en el autobús" },
          { time: 36, text: "This is it, the apocalypse", es: "Esto es todo, el apocalipsis ha llegado" },
          { time: 42, text: "I'm waking up, I feel it in my bones", es: "Me estoy despertando, lo siento en mis huesos" },
          { time: 49, text: "Welcome to the new age, to the new age", es: "Bienvenido a la nueva era, a la nueva era" },
          { time: 56, text: "Whoa, oh, oh, oh, I'm radioactive, radioactive", es: "Whoa, oh, oh, oh, soy radiactivo, radiactivo" }
        ]
      }
    ];

  // MÓDULO MUSIC SESSION (BUSCADOR PREDICTIVO & KARAOKE)
    // ========================================================
    // ========================================================
    // MÓDULO MUSIC SESSION (BUSCADOR PREDICTIVO & KARAOKE)
    // ========================================================
    let currentMusicIndex = 0;
    let currentKaraokeStanzaIndex = 0;
    let musicKaraokeInterval = null;
    let isKaraokeSyncRunning = false;
    let ytMusicPlayer = null;
    let isYtApiReady = false;
    let musicSearchDebounceTimer = null;
    let isGlobalSpanishTranslationActive = false;
    let activeLyricsList = [];

    const MUSIC_VOCAB_DICTIONARY = {
      // R.E.M. - Losing My Religion
      "losing": { ipa: "/ˈluː.zɪŋ/", trans: "Perdiendo / extraviando", type: "Verbo (Gerundio)", note: "Lose out", phrasalEs: "Perder una oportunidad valiosa", ex: "Don't lose out on this unique chance to study." },
      "religion": { ipa: "/rɪˈlɪdʒ.ən/", trans: "Paciencia / convicción / religión", type: "Sustantivo", note: "Losing my religion", phrasalEs: "Llegar al límite de la paciencia", ex: "He felt like he was losing his religion under pressure." },
      "spotlight": { ipa: "/ˈspɑːt.laɪt/", trans: "Reflector / centro de atención", type: "Sustantivo", note: "Step up to the spotlight", phrasalEs: "Asumir el protagonismo", ex: "She stepped up to the spotlight with confidence." },
      "corner": { ipa: "/ˈkɔːr.nɚ/", trans: "Rincón / esquina", type: "Sustantivo", note: "Corner someone", phrasalEs: "Acorralar a alguien", ex: "Reporters cornered the mayor after the conference." },
      "distance": { ipa: "/ˈdɪs.təns/", trans: "Distancia / alejamiento", type: "Sustantivo", note: "Keep distance", phrasalEs: "Mantenerse al margen o distante", ex: "He decided to keep his distance from toxic rumors." },
      "whisper": { ipa: "/ˈwɪs.pɚ/", trans: "Susurro / cuchichear", type: "Sustantivo / Verbo", note: "Whisper away", phrasalEs: "Contar secretos en voz baja", ex: "They whispered away in the library corner." },
      "confessions": { ipa: "/kənˈfeʃ.ənz/", trans: "Confesiones / declaraciones", type: "Sustantivo", note: "Confess to", phrasalEs: "Admitir abiertamente algo", ex: "He confessed to making a major tactical mistake." },
      "lengths": { ipa: "/leŋkθs/", trans: "Extremos / esfuerzos", type: "Sustantivo", note: "Go to great lengths", phrasalEs: "Hacer hasta lo imposible", ex: "She went to great lengths to help her brother." },
      "blinded": { ipa: "/ˈblaɪn.dɪd/", trans: "Cegado / deslumbrado", type: "Adjetivo / Participio", note: "Blind to", phrasalEs: "Incapaz de notar la realidad", ex: "Love blinded him to her true intentions." },
      "fool": { ipa: "/fuːl/", trans: "Tonto / ingenuo", type: "Sustantivo", note: "Fool around", phrasalEs: "Perder el tiempo o bromear", ex: "Stop fooling around and finish your mission." },

      // Adele - Rolling in the Deep
      "fire": { ipa: "/faɪr/", trans: "Fuego / pasión ardiente", type: "Sustantivo", note: "Fire up", phrasalEs: "Motivar o encender entusiasmo", ex: "The coach fired up the team before the match." },
      "heart": { ipa: "/hɑːrt/", trans: "Corazón / centro emocional", type: "Sustantivo", note: "Learn by heart", phrasalEs: "Aprenderse algo de memoria", ex: "I learned all the lyrics by heart." },
      "dark": { ipa: "/dɑːrk/", trans: "Oscuridad / tinieblas", type: "Sustantivo / Adjetivo", note: "In the dark", phrasalEs: "Desinformado o a ciegas", ex: "They left me in the dark about the new rules." },
      "rolling": { ipa: "/ˈroʊ.lɪŋ/", trans: "Rodando / avanzando con fuerza", type: "Verbo (Gerundio)", note: "Roll in", phrasalEs: "Llegar en gran abundancia", ex: "Donations started rolling in after the speech." },
      "scars": { ipa: "/skɑːrz/", trans: "Cicatrices / marcas", type: "Sustantivo", note: "Scar over", phrasalEs: "Cerrar o sanar una herida", ex: "Emotional wounds take time to scar over." },
      "fever": { ipa: "/ˈfiː.vɚ/", trans: "Fiebre / intensidad máxima", type: "Sustantivo", note: "Fever pitch", phrasalEs: "Punto culminante de emoción", ex: "Excitement reached a fever pitch at the concert." },
      "bare": { ipa: "/ber/", trans: "Al descubierto / expuesto", type: "Adjetivo", note: "Lay bare", phrasalEs: "Revelar o desnudar la verdad", ex: "The investigation laid bare the company secrets." },

      // Coldplay - Viva La Vida & Yellow
      "rule": { ipa: "/ruːl/", trans: "Gobernar / dominar", type: "Verbo", note: "Rule out", phrasalEs: "Descartar una posibilidad", ex: "Doctors ruled out any severe complications." },
      "seas": { ipa: "/siːz/", trans: "Mares / océanos", type: "Sustantivo", note: "At sea", phrasalEs: "Confundido o desconcertado", ex: "I was completely at sea with the new algebra topic." },
      "sweep": { ipa: "/swiːp/", trans: "Barrer / limpiar", type: "Verbo", note: "Sweep away", phrasalEs: "Arrasar o llevarse todo", ex: "The hurricane swept away the wooden fence." },
      "streets": { ipa: "/striːts/", trans: "Calles", type: "Sustantivo", note: "Man on the street", phrasalEs: "El ciudadano común", ex: "The law protects the ordinary man on the street." },
      "dice": { ipa: "/daɪs/", trans: "Dados de juego", type: "Sustantivo", note: "Roll the dice", phrasalEs: "Arriesgarse o tomar una apuesta", ex: "He decided to roll the dice and launch the startup." },
      "enemy": { ipa: "/ˈen.ə.mi/", trans: "Enemigo / adversario", type: "Sustantivo", note: "Make an enemy", phrasalEs: "Ganarse la enemistad de alguien", ex: "Be careful not to make enemies in your new job." },
      "castles": { ipa: "/ˈkæs.əlz/", trans: "Castillos / fortalezas", type: "Sustantivo", note: "Build castles in the air", phrasalEs: "Soñar despierto con imposibles", ex: "Don't build castles in the air; create a real plan." },
      "pillars": { ipa: "/ˈpɪl.ɚz/", trans: "Pilares / columnas de soporte", type: "Sustantivo", note: "Pillar of strength", phrasalEs: "Pilar de apoyo incondicional", ex: "His mother was a pillar of strength during hard times." },
      "yellow": { ipa: "/ˈjel.oʊ/", trans: "Amarillo / resplandeciente", type: "Adjetivo", note: "Shine through", phrasalEs: "Brillar o relucir con luz propia", ex: "Her kindness shone through everything she did." },
      "shine": { ipa: "/ʃaɪn/", trans: "Brillar / resplandecer", type: "Verbo", note: "Shine on", phrasalEs: "Seguir brillando a pesar de todo", ex: "Keep your head up and shine on!" },
      "stars": { ipa: "/stɑːrz/", trans: "Estrellas / astros", type: "Sustantivo", note: "Reach for the stars", phrasalEs: "Aspirar a lo más alto", ex: "Teachers encourage students to reach for the stars." },
      "skin": { ipa: "/skɪn/", trans: "Piel / cutis", type: "Sustantivo", note: "Get under someone's skin", phrasalEs: "Irritar o calar profundamente", ex: "His critical remarks really got under her skin." },

      // Queen - Bohemian Rhapsody & Don't Stop Me Now
      "fantasy": { ipa: "/ˈfæn.tə.si/", trans: "Fantasía / ilusión", type: "Sustantivo", note: "Live in fantasy", phrasalEs: "Vivir en un mundo de ensueño", ex: "He lives in a fantasy world instead of facing reality." },
      "landslide": { ipa: "/ˈlænd.slaɪd/", trans: "Derrumbe / victoria aplastante", type: "Sustantivo", note: "Win by a landslide", phrasalEs: "Ganar de manera contundente", ex: "The candidate won the election by a landslide." },
      "reality": { ipa: "/riˈæl.ə.t̬i/", trans: "Realidad / verdad", type: "Sustantivo", note: "Face up to reality", phrasalEs: "Afrontar la dura realidad", ex: "It was time to face up to reality and move on." },
      "sympathy": { ipa: "/ˈsɪm.pə.θi/", trans: "Compasión / empatía", type: "Sustantivo", note: "Feel sympathy for", phrasalEs: "Sentir compasión o apoyo por", ex: "We felt deep sympathy for the flood victims." },
      "easy": { ipa: "/ˈiː.zi/", trans: "Fácil / tranquilo", type: "Adjetivo", note: "Easy come, easy go", phrasalEs: "Lo que fácil viene, fácil se va", ex: "Money won by luck is often easy come, easy go." },
      "tonight": { ipa: "/təˈnaɪt/", trans: "Esta noche", type: "Adverbio / Sustantivo", note: "Hit the town tonight", phrasalEs: "Salir a festejar por la ciudad", ex: "Let's hit the town tonight to celebrate your grade." },
      "alive": { ipa: "/əˈlaɪv/", trans: "Vivo / lleno de vitalidad", type: "Adjetivo", note: "Come alive", phrasalEs: "Cobrar vida y entusiasmo", ex: "The city comes alive as soon as the sun sets." },
      "ecstasy": { ipa: "/ˈek.stə.si/", trans: "Éxtasis / felicidad extrema", type: "Sustantivo", note: "In pure ecstasy", phrasalEs: "En estado de euforia absoluta", ex: "He listened to his favorite melody in pure ecstasy." },
      "gravity": { ipa: "/ˈɡræv.ə.t̬i/", trans: "Gravedad / seriedad", type: "Sustantivo", note: "Grasp the gravity", phrasalEs: "Comprender la seriedad de una situación", ex: "Officials failed to grasp the gravity of the crisis." },

      // Imagine Dragons - Believer & Radioactive
      "believer": { ipa: "/bɪˈliː.vɚ/", trans: "Creyente / devoto", type: "Sustantivo", note: "Believe in", phrasalEs: "Tener fe o confianza en alguien", ex: "You must always believe in your own potential." },
      "sail": { ipa: "/seɪl/", trans: "Vela de barco / navegar", type: "Sustantivo / Verbo", note: "Set sail", phrasalEs: "Zarpar o emprender un nuevo viaje", ex: "The brave explorers set sail at dawn." },
      "master": { ipa: "/ˈmæs.tɚ/", trans: "Amo / dominar con maestría", type: "Sustantivo / Verbo", note: "Master up", phrasalEs: "Dominar o adquirir maestría", ex: "She mastered the English phrasal verbs in two months." },
      "pain": { ipa: "/peɪn/", trans: "Dolor / sufrimiento", type: "Sustantivo", note: "Pain away", phrasalEs: "Aliviar gradualmente un dolor", ex: "Time helped wash the emotional pain away." },
      "masses": { ipa: "/ˈmæs.ɪz/", trans: "Las masas / multitud", type: "Sustantivo", note: "Appeal to the masses", phrasalEs: "Gustar a un público general", ex: "Pop music is engineered to appeal to the masses." },
      "waking": { ipa: "/ˈweɪ.kɪŋ/", trans: "Despertando", type: "Verbo (Gerundio)", note: "Wake up to", phrasalEs: "Darse cuenta de una realidad", ex: "He finally woke up to the dangers of burnout." },
      "dust": { ipa: "/dʌst/", trans: "Polvo / cenizas", type: "Sustantivo", note: "Dust off", phrasalEs: "Desempolvar o retomar una habilidad", ex: "I dusted off my old English dictionary today." },
      "rust": { ipa: "/rʌst/", trans: "Óxido / falta de práctica", type: "Sustantivo", note: "Shake off the rust", phrasalEs: "Quitarse el desentrenamiento", ex: "He had to shake off the rust before the exam." },
      "chemicals": { ipa: "/ˈkem.ɪ.kəlz/", trans: "Sustancias químicas", type: "Sustantivo", note: "Chemical reaction", phrasalEs: "Conexión o reacción instantánea", ex: "There was an immediate chemistry between them." },
      "apocalypse": { ipa: "/əˈpɑː.kə.lɪps/", trans: "Apocalipsis / cataclismo", type: "Sustantivo", note: "Post-apocalyptic", phrasalEs: "Escenario tras un gran colapso", ex: "The film portrayed a gritty post-apocalyptic future." },
      "radioactive": { ipa: "/ˌreɪ.di.oʊˈæk.tɪv/", trans: "Radiactivo / electrizante", type: "Adjetivo", note: "Power up", phrasalEs: "Cargarse de energía pura", ex: "The upbeat beat helps you power up for workouts." },

      // Linkin Park - In the End
      "matter": { ipa: "/ˈmæt̬.ɚ/", trans: "Importar / materia", type: "Verbo / Sustantivo", note: "Matter to", phrasalEs: "Ser de gran importancia para alguien", ex: "Passing the TOEFL really mattered to his career." },
      "valuable": { ipa: "/ˈvæl.jə.bəl/", trans: "Valioso / preciado", type: "Adjetivo", note: "Hold valuable", phrasalEs: "Considerar algo digno de aprecio", ex: "He holds honest friendship as his most valuable gift." },
      "pendulum": { ipa: "/ˈpen.dʒə.ləm/", trans: "Péndulo / oscilación", type: "Sustantivo", note: "Swing back and forth", phrasalEs: "Oscilar indeciso entre opciones", ex: "Public opinion swung back and forth on the matter." },
      "swings": { ipa: "/swɪŋz/", trans: "Oscilaciones / balanceos", type: "Verbo / Sustantivo", note: "Swing by", phrasalEs: "Pasar a visitar rápidamente", ex: "Swing by my office if you have any doubts." },

      // Ed Sheeran - Shape of You
      "lover": { ipa: "/ˈlʌv.ɚ/", trans: "Amante / enamorado", type: "Sustantivo", note: "Fall in love", phrasalEs: "Enamorarse profundamente", ex: "They fell in love while studying abroad." },
      "conversation": { ipa: "/ˌkɑːn.vɚˈseɪ.ʃən/", trans: "Conversación / charla", type: "Sustantivo", note: "Strike up a conversation", phrasalEs: "Iniciar una charla casualmente", ex: "He struck up a conversation with the foreigner." },
      "chance": { ipa: "/tʃæns/", trans: "Oportunidad / posibilidad", type: "Sustantivo", note: "Take a chance on", phrasalEs: "Arriesgarse y apostar por algo", ex: "Take a chance on this course; you won't regret it." },
      "magnet": { ipa: "/ˈmæɡ.nət/", trans: "Imán / atracción magnética", type: "Sustantivo", note: "Attract like a magnet", phrasalEs: "Atraer irresistiblemente", ex: "Her bright personality attracted people like a magnet." },
      "push": { ipa: "/pʊʃ/", trans: "Empujar / esforzarse", type: "Verbo", note: "Push forward", phrasalEs: "Avanzar con tenacidad", ex: "Despite obstacles, we must always push forward." },
      "pull": { ipa: "/pʊl/", trans: "Jalar / tirar hacia uno", type: "Verbo", note: "Pull off", phrasalEs: "Lograr una hazaña difícil", ex: "The student pulled off a top score in the test." }
    };

    function findMusicVocabEntry(rawWord) {
      if (!rawWord) return null;
      const clean = rawWord.toLowerCase().replace(/[^a-z']/g, '').trim();
      if (!clean) return null;

      if (MUSIC_VOCAB_DICTIONARY[clean]) return MUSIC_VOCAB_DICTIONARY[clean];

      // Búsqueda por lematización / raíz morfológica común en inglés
      const candidates = [];
      if (clean.endsWith('ing') && clean.length > 4) {
        candidates.push(clean.slice(0, -3));
        candidates.push(clean.slice(0, -3) + 'e');
      }
      if (clean.endsWith('ed') && clean.length > 3) {
        candidates.push(clean.slice(0, -2));
        candidates.push(clean.slice(0, -1));
      }
      if (clean.endsWith('s') && clean.length > 2) {
        candidates.push(clean.slice(0, -1));
      }
      if (clean.endsWith('es') && clean.length > 3) {
        candidates.push(clean.slice(0, -2));
      }

      for (let cand of candidates) {
        if (MUSIC_VOCAB_DICTIONARY[cand]) return MUSIC_VOCAB_DICTIONARY[cand];
      }

      // Si no existe, revisar glosario de phrasal verbs global
      if (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA.phrasal_verbs) {
        const found = window.MASTER_MODULES_DATA.phrasal_verbs.items.find(item =>
          item.term.toLowerCase().includes(clean)
        );
        if (found) {
          return {
            ipa: found.pron || `/${clean}/`,
            trans: found.meaning || 'Expresión en inglés cotidiano',
            type: 'Phrasal Verb Clave',
            note: found.term,
            phrasalEs: found.meaning,
            ex: found.example || `Used in song lyric: "${clean}".`
          };
        }
      }

      return null;
    }

    function renderMusicTracksList(filter = '') {
      // perf(router): esta función SOLO renderiza la lista de pistas. Ya no fuerza la
      // visibilidad de #view-music / #music-search-subview, porque al invocarse en el
      // arranque o en segundo plano dejaba el buscador del Karaoke encima de otros
      // portales (p. ej. MasterPet Sanctuary). La apertura visible del portal se
      // centraliza en window.openMusicPortal().
      const container = document.getElementById('musicTrackButtonsContainer');
      if (!container) return;

      const lower = filter.toLowerCase().trim();
      const filtered = MUSIC_SESSION_TRACKS.filter(t =>
        !lower ||
        t.title.toLowerCase().includes(lower) ||
        t.artist.toLowerCase().includes(lower) ||
        (t.genre && t.genre.toLowerCase().includes(lower))
      );

      container.innerHTML = filtered.map((track) => {
        const originalIdx = MUSIC_SESSION_TRACKS.findIndex(t => t.id === track.id);
        const isActive = originalIdx === currentMusicIndex;
        return `
          <button onclick="selectMusicTrack(${originalIdx})" class="px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${isActive ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}">
            <span>${track.artist} &bull; ${track.title}</span>
          </button>
        `;
      }).join('');
      const altContainer = document.getElementById('musicLyricsContainer');
      if (altContainer && altContainer !== container) {
        altContainer.innerHTML = container.innerHTML;
      }

      // Inicializar nodos en memoria y controles de offset
      KaraokeSyncEngine.lyricNodes = Array.from(container.querySelectorAll('.karaoke-lyric-line, .lyric-line'));
      KaraokeSyncEngine.lyricsData = lyrics;
      KaraokeSyncEngine.stanzas = lyrics;
      KaraokeSyncEngine.currentIndex = -1;
      KaraokeSyncEngine.currentLyricIndex = -1;
      ensureKaraokeOffsetControls();
      KaraokeSyncEngine.updateOffsetBadgeUI();
    }

    function escapeMusicHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    // ========================================================
    // YOUTUBE IFRAME PLAYER API OFICIAL
    // ========================================================
    function initYouTubePlayer() {
      if (ytMusicPlayer) return;
      const iframeEl = document.getElementById('musicYouTubeIframe');
      if (!iframeEl) return;

      if (window.YT && window.YT.Player) {
        try {
          ytMusicPlayer = new YT.Player('musicYouTubeIframe', {
            events: {
              'onReady': onYouTubePlayerReady,
              'onStateChange': onYouTubePlayerStateChange,
              'onError': function(ev) {
                if (typeof window.handleHoloPlayerError === 'function') {
                  window.handleHoloPlayerError(ev.data);
                }
              }
            }
          });
          isYtApiReady = true;
        } catch (e) {
          console.warn('Error inicializando YT.Player:', e);
        }
      }
    }

    // Callback global requerido por la API oficial de YouTube
    window.onYouTubeIframeAPIReady = function() {
      initYouTubePlayer();
    };

    // Inicializar inmediatamente si la API ya estaba presente
    if (window.YT && window.YT.Player) {
      initYouTubePlayer();
    }

    function onYouTubePlayerReady(event) {
      console.log('✅ [YOUTUBE-API] Reproductor de Music Session listo');
      try {
        if (event && event.target) {
          event.target.unMute();
          event.target.setVolume(100);
          if (window._isHoloStagePlaying || window._userInitiatedMusicPlayback) {
            event.target.playVideo();
          } else {
            if (typeof event.target.pauseVideo === 'function') {
              event.target.pauseVideo();
            }
          }
        }
      } catch (_) {}
      if (typeof window.logAudioDiagnosticStatus === 'function') {
        window.logAudioDiagnosticStatus('YouTube', 'Ready', 100);
      }
    }

    // ========================================================
    // RELOJ MAESTRO DE ALTA FRECUENCIA (YOUTUBE BRIDGE + POSTMESSAGE)
    // ========================================================
    const ytMasterState = {
      playerState: -1,
      currentTime: 0,
      duration: 0,
      lastReportedTime: 0,
      lastReportedTimestamp: (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now(),
      isPlaying: false
    };
    window.ytMasterState = ytMasterState;

    function pingYouTubeIframeListening() {
      const ifr = document.getElementById('musicYouTubeIframe');
      if (ifr && ifr.contentWindow) {
        try {
          ifr.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1 }), '*');
        } catch (_) {}
      }
      const holoIfr = document.getElementById('musicHoloYoutubeIframe');
      if (holoIfr && holoIfr.contentWindow) {
        try {
          holoIfr.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1 }), '*');
        } catch (_) {}
      }
    }
    window.pingYouTubeIframeListening = pingYouTubeIframeListening;

    function onYouTubePlayerStateChange(event) {
      handlePlayerStateChange(event.data);
    }

    function handlePlayerStateChange(state) {
      // YT.PlayerState: ENDED = 0, PLAYING = 1, PAUSED = 2, BUFFERING = 3, CUED = 5
      const isPlaying = state === 1 || (window.YT && window.YT.PlayerState && state === YT.PlayerState.PLAYING);
      const isPaused = state === 2 || (window.YT && window.YT.PlayerState && state === YT.PlayerState.PAUSED);
      const isEnded = state === 0 || (window.YT && window.YT.PlayerState && state === YT.PlayerState.ENDED);

      ytMasterState.playerState = state;
      ytMasterState.isPlaying = isPlaying;

      if (isPlaying) {
        ytMasterState.lastReportedTimestamp = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        // Cero doble audio: si el video de YouTube está activo, mantener #mastereng-audio en pausa, en 0 y muteado
        const audioEl = document.getElementById('mastereng-audio') || document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
        if (audioEl) {
          try {
            audioEl.pause();
            audioEl.currentTime = 0;
            audioEl.muted = true;
          } catch (_) {}
        }
        // Reproduciendo: iniciar seguimiento sincronizado de alta frecuencia a 60Hz
        startMusicKaraokeSync();
      } else if (isPaused || isEnded) {
        // Pausado o finalizado: congelar reloj y sincronizar pausa en todos los reproductores
        ytMasterState.isPlaying = false;
        if (typeof syncPauseAllMusicPlayers === 'function') {
          syncPauseAllMusicPlayers();
        } else if (typeof window.syncPauseAllMusicPlayers === 'function') {
          window.syncPauseAllMusicPlayers();
        } else {
          stopMusicKaraokeSync();
        }
      }
    }

    // Escuchar mensajes postMessage bidireccionales del iframe ('infoDelivery' y 'onStateChange')
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('message', (event) => {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (!data) return;

          if (data.event === 'infoDelivery' && data.info) {
            const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
            if (typeof data.info.currentTime === 'number') {
              ytMasterState.lastReportedTime = data.info.currentTime;
              ytMasterState.currentTime = data.info.currentTime;
              ytMasterState.lastReportedTimestamp = now;
            }
            if (typeof data.info.duration === 'number' && data.info.duration > 0) {
              ytMasterState.duration = data.info.duration;
              window._currentTrackTotalDuration = data.info.duration;
            }
            if (typeof data.info.playerState === 'number') {
              handlePlayerStateChange(data.info.playerState);
            }
          } else if (data.event === 'onStateChange') {
            const st = typeof data.info === 'number' ? data.info : (data.info && data.info.playerState);
            if (typeof st === 'number') {
              handlePlayerStateChange(st);
            }
          }
        } catch (_) {}
      });
    }

    // Función del reloj maestro de alta precisión (interpolación 60Hz y congelación inmediata en pausa)
    function getMasterPlaybackTime() {
      // 1. Audio nativo si estuviera activo
      const audioEl = document.getElementById('mastereng-audio');
      if (audioEl && !audioEl.paused && !audioEl.muted && audioEl.currentTime > 0) {
        return audioEl.currentTime;
      }

      // 2. Si YouTube está reproduciendo (playerState === 1), interpolar a 60Hz usando performance.now()
      if (ytMasterState.isPlaying && ytMasterState.playerState === 1) {
        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const elapsed = (now - ytMasterState.lastReportedTimestamp) / 1000;
        return ytMasterState.lastReportedTime + Math.min(Math.max(0, elapsed), 2.5);
      }

      // 3. Si YouTube está pausado (playerState === 2), congelar inmediatamente
      if (ytMasterState.playerState === 2) {
        return ytMasterState.lastReportedTime;
      }

      // 4. Si la instancia YT.Player tiene getCurrentTime disponible
      const ytPlayer = (typeof ytMusicPlayer !== 'undefined' && ytMusicPlayer) || window.ytMusicPlayer || window._holoYtPlayer;
      if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
        try {
          const t = ytPlayer.getCurrentTime();
          if (typeof t === 'number' && !isNaN(t) && t >= 0) {
            ytMasterState.lastReportedTime = t;
            return t;
          }
        } catch (_) {}
      }

      return ytMasterState.lastReportedTime || 0;
    }
    window.getMasterPlaybackTime = getMasterPlaybackTime;

    // ========================================================
    // BUSCADOR INTELIGENTE CON DEBOUNCE 300MS Y API REAL
    // ========================================================
    function clearMusicSearchInput() {
      const input = document.getElementById('musicSearchInput');
      const clearBtn = document.getElementById('musicSearchClearBtn');
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      const resultsGrid = document.getElementById('musicResultsGrid');
      const trendingSection = document.getElementById('musicTrendingSection');
      const trendingCarousel = document.getElementById('trending-tracks-carousel');

      if (input) {
        input.value = '';
        try { input.focus(); } catch (e) {}
      }
      if (clearBtn) {
        clearBtn.classList.add('hidden');
        clearBtn.style.display = 'none';
      }
      if (suggestionsEl) {
        suggestionsEl.innerHTML = '';
        suggestionsEl.classList.add('hidden');
        suggestionsEl.style.display = 'none';
      }
      if (resultsGrid) {
        resultsGrid.innerHTML = '';
        resultsGrid.style.display = 'none';
        resultsGrid.classList.add('hidden');
      }
      if (trendingSection) {
        trendingSection.style.display = 'block';
        trendingSection.classList.remove('hidden');
      }
      if (trendingCarousel) {
        trendingCarousel.style.display = 'block';
        trendingCarousel.classList.remove('hidden');
      }
      if (musicSearchDebounceTimer) {
        clearTimeout(musicSearchDebounceTimer);
        musicSearchDebounceTimer = null;
      }
      renderMusicTracksList('');
    }

    function handleMusicSearchInput(val) {
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      const clearBtn = document.getElementById('musicSearchClearBtn');
      if (!suggestionsEl) return;

      const raw = (val || '').trim();
      if (clearBtn) {
        if (raw.length > 0) {
          clearBtn.classList.remove('hidden');
          clearBtn.style.display = 'flex';
        } else {
          clearBtn.classList.add('hidden');
          clearBtn.style.display = 'none';
        }
      }

      if (!raw) {
        suggestionsEl.classList.add('hidden');
        renderMusicTracksList('');
        if (typeof window.clearMusicSearchInput === 'function') {
          window.clearMusicSearchInput();
        }
        if (musicSearchDebounceTimer) {
          clearTimeout(musicSearchDebounceTimer);
          musicSearchDebounceTimer = null;
        }
        return;
      }

      renderMusicTracksList(raw.toLowerCase());

      // 1. Detectar si el usuario pegó un enlace directo o ID de YouTube
      const detectedYtId = extractYouTubeId(raw);
      if (detectedYtId) {
        if (musicSearchDebounceTimer) {
          clearTimeout(musicSearchDebounceTimer);
          musicSearchDebounceTimer = null;
        }
        renderDirectYouTubePreview(detectedYtId);
        return;
      }

      // 2. Debounce de 300ms conectado al endpoint real /api/music/search
      if (musicSearchDebounceTimer) {
        clearTimeout(musicSearchDebounceTimer);
      }

      musicSearchDebounceTimer = setTimeout(() => {
        executeMusicSearch(raw);
      }, 300);
    }

    function renderDirectYouTubePreview(detectedYtId) {
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      if (!suggestionsEl) return;

      const matchedTrack = MUSIC_SESSION_TRACKS.find(t => t.youtubeId === detectedYtId);
      const previewTitle = matchedTrack ? matchedTrack.title : 'Video de YouTube detectado';
      const previewArtist = matchedTrack ? matchedTrack.artist : `ID: ${detectedYtId}`;
      const previewThumb = `https://img.youtube.com/vi/${detectedYtId}/mqdefault.jpg`;

      suggestionsEl.innerHTML = `
        <div onclick="loadDirectYouTubeById('${detectedYtId}')" class="p-3 bg-cyan-950/70 border-b border-cyan-500/40 hover:bg-cyan-900/60 cursor-pointer transition flex items-center gap-3 group">
          <div class="relative w-16 h-10 rounded-lg overflow-hidden border border-cyan-400 shrink-0 shadow-md">
            <img src="${previewThumb}" class="w-full h-full object-cover" alt="YouTube Preview" onerror="this.src='https://img.youtube.com/vi/${detectedYtId}/default.jpg'">
            <span class="absolute inset-0 bg-black/20 flex items-center justify-center text-xs group-hover:scale-110 transition">▶️</span>
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-[10px] font-bold text-cyan-300 uppercase tracking-widest bg-cyan-500/20 px-2 py-0.5 rounded-full">Enlace Directo Válido</span>
            <p class="text-xs font-black text-white truncate mt-0.5">${escapeMusicHtml(previewTitle)}</p>
            <p class="text-[11px] text-slate-300 truncate">${escapeMusicHtml(previewArtist)}</p>
          </div>
          <span class="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition shrink-0 shadow">Cargar Video</span>
        </div>
      `;
      suggestionsEl.classList.remove('hidden');
    }

    async function executeMusicSearch(query) {
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      if (!suggestionsEl) return;

      const qTrim = (query || '').trim();
      const qLower = qTrim.toLowerCase();
      if (!qTrim) {
        suggestionsEl.classList.add('hidden');
        return;
      }

      suggestionsEl.innerHTML = `
        <div class="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span class="inline-block animate-spin text-cyan-400 text-sm">⌛</span>
          <span>Buscando pistas de música y canciones...</span>
        </div>
      `;
      suggestionsEl.classList.remove('hidden');

      // 1. Buscar en recomendaciones locales
      const localMatches = MUSIC_SESSION_TRACKS.filter(t =>
        t.title.toLowerCase().includes(qLower) ||
        t.artist.toLowerCase().includes(qLower) ||
        (t.genre && t.genre.toLowerCase().includes(qLower)) ||
        (t.lyrics && t.lyrics.some(l => l.text.toLowerCase().includes(qLower)))
      );

      let results = [];
      if (localMatches.length > 0) {
        results = localMatches.map(t => ({
          id: t.youtubeId,
          title: t.title,
          artist: t.artist,
          thumbnail: `https://img.youtube.com/vi/${t.youtubeId}/mqdefault.jpg`,
          duration: t.duration || '3:30',
          isLocal: true
        }));
      } else {
        // 2. Si el término NO está en las recomendaciones locales, fetch a /api/music/search?q=
        try {
          const searchUrl = (window.BackendSync && window.BackendSync.apiBaseUrl)
            ? `${window.BackendSync.apiBaseUrl}/music/search?q=${encodeURIComponent(qTrim)}`
            : ((typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http'))
              ? `${window.location.origin}/api/music/search?q=${encodeURIComponent(qTrim)}`
              : `http://localhost:3000/api/music/search?q=${encodeURIComponent(qTrim)}`);

          const ctrl = new AbortController();
          const tId = setTimeout(() => ctrl.abort(), 4000);
          const res = await fetch(searchUrl, { signal: ctrl.signal });
          clearTimeout(tId);

          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              results = data.map(item => ({ ...item, isRemote: true }));
            }
          }
        } catch (err) {
          console.warn('[MUSIC] Error en consulta remota a /api/music/search?q=:', err);
        }
      }

      if (results.length === 0) {
        suggestionsEl.innerHTML = `
          <div onclick="handleMusicSearchSubmit()" class="p-3.5 text-xs text-slate-300 hover:bg-slate-800/90 cursor-pointer flex items-center justify-between group transition">
            <div class="flex items-center gap-2">
              <span class="text-base text-cyan-400">🔍</span>
              <div>
                <p class="font-bold text-white group-hover:text-cyan-300">Buscar en YouTube: "<span class="text-cyan-400">${escapeMusicHtml(qTrim)}</span>"</p>
                <p class="text-[10px] text-slate-400">Presiona Enter o haz clic para reproducir la canción</p>
              </div>
            </div>
            <span class="text-xs font-mono text-cyan-400/90 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">Enter ↵</span>
          </div>
        `;
        return;
      }

      const itemsHtml = results.slice(0, 10).map(item => {
        const safeTitle = escapeMusicHtml(item.title);
        const safeArtist = escapeMusicHtml(item.artist);
        const thumb = item.thumbnail || `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`;
        const duration = item.duration || '3:30';
        const escapedId = (item.id || '').replace(/'/g, "\\'");
        const escTitle = (item.title || '').replace(/'/g, "\\'");
        const escArtist = (item.artist || '').replace(/'/g, "\\'");
        const sourceBadge = item.isRemote
          ? '<span class="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold border border-cyan-500/30">🌐 YouTube</span>'
          : '<span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">⭐ Local</span>';

        return `
          <div class="p-2.5 flex items-center justify-between gap-3 hover:bg-slate-800/90 border-b border-slate-800/60 transition group">
            <div class="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onclick="selectMusicSearchResultItem('${escapedId}', '${escTitle}', '${escArtist}', '${duration}')">
              <div class="relative w-14 h-9 rounded-lg overflow-hidden border border-slate-700 group-hover:border-cyan-500/60 shrink-0 shadow">
                <img src="${thumb}" class="w-full h-full object-cover" alt="${safeTitle}" onerror="this.src='https://img.youtube.com/vi/${item.id}/default.jpg'">
                <span class="absolute bottom-0.5 right-0.5 bg-black/80 text-[9px] font-mono font-bold text-white px-1 rounded">${duration}</span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <p class="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition">${safeTitle}</p>
                  ${sourceBadge}
                </div>
                <p class="text-[11px] text-slate-400 truncate">${safeArtist}</p>
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button onclick="selectMusicSearchResultItem('${escapedId}', '${escTitle}', '${escArtist}', '${duration}')"
                class="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 transition active:scale-95 cursor-pointer flex items-center gap-1">
                <span>▶️</span>
                <span class="hidden sm:inline">Reproducir</span>
              </button>
              <button onclick="practiceVocabularyFromMusic('${escapedId}', '${escTitle}', '${escArtist}', '${duration}')"
                class="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold border border-indigo-400/30 transition active:scale-95 cursor-pointer flex items-center gap-1">
                <span>📖</span>
                <span class="hidden sm:inline">Practicar Vocabulario</span>
              </button>
            </div>
          </div>
        `;
      }).join('');

      suggestionsEl.innerHTML = itemsHtml;
      suggestionsEl.classList.remove('hidden');
    }

    async function practiceVocabularyFromMusic(ytId, title, artist, duration) {
      await selectMusicSearchResultItem(ytId, title, artist, duration);
      const lyricsEl = document.getElementById('musicLyricsContainer');
      if (lyricsEl) {
        lyricsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showFloatingToast(`Practicando vocabulario interactivo de "${title}"`, '📖');
    }

    async function selectMusicSearchResultItem(ytId, title, artist, duration) {
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      if (suggestionsEl) suggestionsEl.classList.add('hidden');

      // Si coincide con alguna pista del catálogo local, seleccionarla por índice
      const localMatch = MUSIC_SESSION_TRACKS.find(t => t.youtubeId === ytId || t.title.toLowerCase() === title.toLowerCase());
      if (localMatch) {
        const idx = MUSIC_SESSION_TRACKS.indexOf(localMatch);
        selectMusicTrack(idx);
        showFloatingToast(`Reproduciendo "${localMatch.title}"`, '🎵');
        return;
      }

      await loadCustomYouTubeTrack(ytId, title, artist, duration);
    }

    function handleMusicSearchKey(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleMusicSearchSubmit();
      } else if (event.key === 'Escape') {
        const suggestionsEl = document.getElementById('musicSearchSuggestions');
        if (suggestionsEl) suggestionsEl.classList.add('hidden');
      }
    }

    function selectMusicTrackFromSuggestion(idx) {
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      if (suggestionsEl) suggestionsEl.classList.add('hidden');
      selectMusicTrack(idx);
    }

    async function loadDirectYouTubeById(ytId) {
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      if (suggestionsEl) suggestionsEl.classList.add('hidden');

      const matchedTrack = MUSIC_SESSION_TRACKS.find(t => t.youtubeId === ytId);
      if (matchedTrack) {
        const idx = MUSIC_SESSION_TRACKS.indexOf(matchedTrack);
        selectMusicTrack(idx);
        showFloatingToast(`Reproduciendo "${matchedTrack.title}"`, '🎵');
        return;
      }

      await loadCustomYouTubeTrack(ytId, 'Canción de YouTube Personalizada', 'Artista en Vivo');
      showFloatingToast('Video de YouTube enlazado correctamente', '▶️');
    }

    function handleMusicSearchSubmit() {
      const input = document.getElementById('musicSearchInput');
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      if (suggestionsEl) suggestionsEl.classList.add('hidden');
      if (!input) return;

      const val = input.value.trim();
      if (!val) return;

      const ytId = extractYouTubeId(val);
      if (ytId) {
        loadDirectYouTubeById(ytId);
        return;
      }

      const query = val.toLowerCase();
      const matchIdx = MUSIC_SESSION_TRACKS.findIndex(t =>
        t.title.toLowerCase().includes(query) ||
        t.artist.toLowerCase().includes(query) ||
        (t.genre && t.genre.toLowerCase().includes(query)) ||
        (t.lyrics && t.lyrics.some(l => l.text.toLowerCase().includes(query)))
      );

      if (matchIdx !== -1) {
        selectMusicTrack(matchIdx);
        showFloatingToast(`Reproduciendo "${MUSIC_SESSION_TRACKS[matchIdx].title}"`, '🎵');
      } else {
        // En lugar de arrojar error de formato inválido, ejecutar la búsqueda en la API o fallback
        executeMusicSearch(val);
      }
    }

    async function loadCustomYouTubeTrack(ytId, title = 'Video', artist = 'Artista', duration = '3:30') {
      window._userInitiatedMusicPlayback = true;
      if (typeof window.openMusicPlayerStage === 'function') {
        window.openMusicPlayerStage();
      }
      stopMusicKaraokeSync();

      const titleEl = document.getElementById('activeMusicTitle');
      const artistEl = document.getElementById('activeMusicArtist');
      if (titleEl) titleEl.textContent = title;
      if (artistEl) artistEl.textContent = artist;

      // Cargar en el reproductor de YouTube
      if (ytMusicPlayer && typeof ytMusicPlayer.loadVideoById === 'function') {
        try {
          ytMusicPlayer.loadVideoById(ytId);
        } catch (_) {
          const iframe = document.getElementById('musicYouTubeIframe');
          if (iframe) iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=1`;
        }
      } else {
        const iframe = document.getElementById('musicYouTubeIframe');
        if (iframe) {
          iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=1`;
        }
        initYouTubePlayer();
      }

      // Intentar obtener letra sincronizada desde /api/music/lyrics
      let lyrics = null;
      try {
        const lyricsUrl = `http://localhost:3000/api/music/lyrics?id=${encodeURIComponent(ytId)}&title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;
        const res = await fetch(lyricsUrl);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            lyrics = data;
          }
        }
      } catch (err) {
        console.warn('No se pudo obtener letra remota:', err);
      }

      if ((!lyrics || lyrics.length === 0) && typeof window.fetchLrclibSyncedLyrics === 'function') {
        try {
          const lrcRes = await window.fetchLrclibSyncedLyrics(artist, title, 210);
          if (lrcRes && Array.isArray(lrcRes.lyrics) && lrcRes.lyrics.length > 0) {
            lyrics = lrcRes.lyrics;
          }
        } catch (_) {}
      }

      if (!lyrics || lyrics.length === 0) {
        lyrics = [
          { time: 5, startTime: 5, endTime: 18, text: `Listen carefully to the melody of ${title}`, es: `Escucha atentamente la melodía de ${title}` },
          { time: 18, startTime: 18, endTime: 32, text: `Feel the rhythm and musical emotion by ${artist}`, es: `Siente el ritmo y la emoción musical de ${artist}` },
          { time: 32, startTime: 32, endTime: 50, text: "Touch any word in the lyrics to inspect its phonetic pronunciation", es: "Toca cualquier palabra de la letra para ver su pronunciación fonética" },
          { time: 50, startTime: 50, endTime: 75, text: "Sing along with the music to master spoken English fluency", es: "Canta con la música para dominar la fluidez en inglés hablado" },
          { time: 75, startTime: 75, endTime: 105, text: "Every stanza boosts your listening comprehension and TOEFL vocabulary", es: "Cada estrofa potencia tu comprensión auditiva y vocabulario TOEFL" },
          { time: 105, startTime: 105, endTime: 135, text: "Keep practicing daily with your favorite English songs and melodies", es: "Sigue practicando a diario con tus canciones y melodías favoritas en inglés" }
        ];
      }

      activeLyricsList = lyrics;
      currentKaraokeStanzaIndex = 0;
      renderLyricsFromList(lyrics);
      if (window.KaraokeSyncEngine && typeof window.KaraokeSyncEngine.initSong === 'function') {
        window.KaraokeSyncEngine.initSong(lyrics);
      }
      startMusicKaraokeSync();
      showFloatingToast(`Cargado: "${title}"`, '🎵');
    }

    function loadYouTubeVideoById(ytId, title = 'Video', artist = 'Artista', customLyrics = null) {
      if (customLyrics) {
        activeLyricsList = customLyrics;
        loadCustomYouTubeTrack(ytId, title, artist);
      } else {
        loadCustomYouTubeTrack(ytId, title, artist);
      }
    }

    
    function returnToMusicSearch(stopMedia = true) {
      window._userInitiatedMusicPlayback = false;
      if (KaraokeSyncEngine && typeof KaraokeSyncEngine.stop === 'function') {
        try { KaraokeSyncEngine.stop(); } catch (_) {}
      }
      if (stopMedia && typeof window.stopAllMedia === 'function') {
        try { window.stopAllMedia(); } catch (e) {}
      } else if (stopMedia && typeof window.stopAllAudioAndTimers === 'function') {
        try { window.stopAllAudioAndTimers(); } catch (e) {}
      }
      if (typeof window.pauseYouTubePlayer === 'function') {
        try { window.pauseYouTubePlayer(); } catch (_) {}
      }
      if (window._karaokePlaybackTimer) {
        clearInterval(window._karaokePlaybackTimer);
        window._karaokePlaybackTimer = null;
      }
      if (window.KaraokeSyncEngine && typeof window.KaraokeSyncEngine.stop === 'function') {
        try { window.KaraokeSyncEngine.stop(); } catch (_) {}
      }
      const audioEl = document.getElementById('mastereng-audio');
      if (audioEl) { try { audioEl.pause(); } catch (_) {} }

      const viewMusic = document.getElementById('view-music');
      const searchSub = document.getElementById('music-search-subview');
      const playerSub = document.getElementById('music-player-subview');
      const holoStage = document.getElementById('musicHolographicStage');
      const origVideoWrapper = document.getElementById('musicOriginalVideoWrapper');
      const origMetaWrapper = document.getElementById('musicOriginalMetaWrapper');
      if (playerSub) {
        playerSub.classList.add('hidden');
        playerSub.style.setProperty('display', 'none', 'important');
      }
      if (holoStage) {
        holoStage.classList.add('hidden');
        holoStage.style.setProperty('display', 'none', 'important');
      }
      if (origVideoWrapper) {
        origVideoWrapper.style.display = 'block';
      }
      if (origMetaWrapper) {
        origMetaWrapper.style.display = 'flex';
      }
      if (viewMusic) {
        viewMusic.classList.remove('hidden', 'offline-locked');
        viewMusic.style.setProperty('display', 'block', 'important');
        viewMusic.style.setProperty('visibility', 'visible', 'important');
        viewMusic.style.setProperty('opacity', '1', 'important');
        viewMusic.style.setProperty('pointer-events', 'auto', 'important');
      }
      if (searchSub) {
        searchSub.classList.remove('hidden', 'offline-locked');
        searchSub.style.setProperty('display', 'block', 'important');
        searchSub.style.setProperty('visibility', 'visible', 'important');
        searchSub.style.setProperty('opacity', '1', 'important');
        searchSub.style.setProperty('pointer-events', 'auto', 'important');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Apertura del portal de Música / Karaoke (vista de búsqueda)
    function openMusicPortal() {
      // Limpieza universal ANTES de mostrar el buscador: evita superposición con otros portales
      if (typeof window.hideAllModules === 'function') window.hideAllModules();

      const viewMusic = document.getElementById('view-music');
      const searchSub = document.getElementById('music-search-subview');
      const playerSub = document.getElementById('music-player-subview');
      if (playerSub) {
        playerSub.classList.add('hidden');
        playerSub.style.setProperty('display', 'none', 'important');
      }
      if (viewMusic) {
        viewMusic.classList.remove('hidden', 'offline-locked');
        viewMusic.style.setProperty('display', 'block', 'important');
        viewMusic.style.setProperty('visibility', 'visible', 'important');
        viewMusic.style.setProperty('opacity', '1', 'important');
        viewMusic.style.setProperty('pointer-events', 'auto', 'important');
      }
      if (searchSub) {
        searchSub.classList.remove('hidden', 'offline-locked');
        searchSub.style.setProperty('display', 'block', 'important');
        searchSub.style.setProperty('visibility', 'visible', 'important');
        searchSub.style.setProperty('opacity', '1', 'important');
        searchSub.style.setProperty('pointer-events', 'auto', 'important');
      }
      window._activeModule = 'music';

      renderMusicTracksList('');
      if (typeof window.clearMusicSearchInput === 'function') {
        try { window.clearMusicSearchInput(); } catch (_) {}
      }
      if (typeof window.renderTrendingTracksCarousel === 'function') {
        try { window.renderTrendingTracksCarousel(); } catch (_) {}
      }
      if (typeof window.scrollTo === 'function') {
        try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch (_) {}
      }
    }
    window.openMusicPortal = openMusicPortal;

    window.openMusicPlayerStage = function() {
      // 1. Garantizar que todas las demás vistas raíz estén ocultas EXCEPTO #view-music
      ['view-auth', 'view-home', 'view-path', 'view-stories', 'view-worldtour', 'ai-tutor-view', 'portal-3d-master-view', 'portalLoadingScreen'].forEach(function(id) {
        const el = document.getElementById(id);
        if (el) {
          el.classList.add('hidden');
          el.style.setProperty('display', 'none', 'important');
        }
      });

      // 2. Garantizar que el contenedor padre #view-music esté 100% visible
      const viewMusic = document.getElementById('view-music');
      if (viewMusic) {
        viewMusic.classList.remove('hidden', 'offline-locked');
        viewMusic.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; pointer-events: auto !important; position: relative !important; z-index: 35 !important; width: 100% !important; max-width: 68rem !important; margin: 0 auto !important; padding: 1rem !important;';
      }

      // 3. Ocultar el buscador (#music-search-subview)
      const searchSub = document.getElementById('music-search-subview');
      if (searchSub) {
        searchSub.classList.add('hidden');
        searchSub.style.setProperty('display', 'none', 'important');
      }

      // 4. Mostrar el reproductor (#music-player-subview) quitando .hidden y forzando display: block !important
      const playerSub = document.getElementById('music-player-subview');
      if (playerSub) {
        playerSub.classList.remove('hidden', 'offline-locked');
        playerSub.removeAttribute('style');
        playerSub.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; pointer-events: auto !important; width: 100% !important;';
      }

      // 5. Asegurar que las columnas internas del reproductor (video/escenario a la izquierda y letra sincronizada a la derecha) sean visibles
      const grid = document.getElementById('musicStageColumnsGrid');
      if (grid) {
        grid.classList.remove('hidden');
        grid.style.setProperty('display', 'grid', 'important');
      }
      const leftCol = document.getElementById('musicPlayerLeftCol');
      if (leftCol) {
        leftCol.classList.remove('hidden');
        leftCol.style.setProperty('display', 'flex', 'important');
      }
      const rightCol = document.getElementById('musicLyricsRightCol');
      if (rightCol) {
        rightCol.classList.remove('hidden');
        rightCol.style.setProperty('display', 'flex', 'important');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
    function selectMusicTrack(idx) {
      if (typeof window.openMusicPlayerStage === 'function') {
        window.openMusicPlayerStage();
      }
      window._userInitiatedMusicPlayback = true;
      window.currentSongSessionId = Date.now();
      const thisSessionId = window.currentSongSessionId;
      if (typeof window.resetSongPlayerSession === 'function') {
        window.resetSongPlayerSession();
      } else if (typeof window.stopAllMedia === 'function') {
        window.stopAllMedia();
      }

      // Forzar enrutamiento a la vista del estudio musical (#music-player-subview)
      const searchSub = document.getElementById('music-search-subview');
      const playerSub = document.getElementById('music-player-subview');
      if (searchSub) {
        searchSub.style.display = 'none';
        searchSub.classList.add('hidden');
      }
      if (playerSub) {
        playerSub.style.display = 'block';
        playerSub.classList.remove('hidden');
        playerSub.style.setProperty('display', 'block', 'important');
      }
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      const holoStage = document.getElementById('musicHolographicStage');
      if (holoStage) holoStage.style.display = 'none';
      const ytIframe = document.getElementById('musicYouTubeIframe');
      if (ytIframe) ytIframe.style.display = 'block';
      currentMusicIndex = idx;
      currentKaraokeStanzaIndex = 0;

      const track = MUSIC_SESSION_TRACKS[idx];
      if (!track) return;

      if (typeof window.loadSongToKaraoke === 'function') {
        const durSec = (track.duration && track.duration.includes(':'))
          ? (parseInt(track.duration.split(':')[0], 10) * 60 + parseInt(track.duration.split(':')[1], 10))
          : 225;
        window.loadSongToKaraoke(track.title, track.artist, track.previewUrl || '', track.artwork || '', durSec);
        return;
      }

      stopMusicKaraokeSync();

      const titleEl = document.getElementById('activeMusicTitle');
      const artistEl = document.getElementById('activeMusicArtist');
      const iframe = document.getElementById('musicYouTubeIframe');

      if (titleEl) titleEl.textContent = track.title;
      if (artistEl) artistEl.textContent = `${track.artist} ${track.genre ? '• ' + track.genre : ''}`;

      if (track.youtubeId) {
        if (ytMusicPlayer && typeof ytMusicPlayer.loadVideoById === 'function') {
          try {
            ytMusicPlayer.loadVideoById(track.youtubeId);
            ytMusicPlayer.unMute();
            ytMusicPlayer.setVolume(100);
            ytMusicPlayer.playVideo();
          } catch (_) {
            if (iframe) iframe.src = `https://www.youtube-nocookie.com/embed/${track.youtubeId}?enablejsapi=1&autoplay=1`;
          }
        } else {
          if (iframe) {
            iframe.src = `https://www.youtube-nocookie.com/embed/${track.youtubeId}?enablejsapi=1&autoplay=1`;
          }
          initYouTubePlayer();
        }
      }
      if (typeof window.logAudioDiagnosticStatus === 'function') {
        window.logAudioDiagnosticStatus('YouTube', 'Playing', 100);
      }

      activeLyricsList = track.lyrics || [];
      renderLyricsFromList(activeLyricsList);
      renderMusicTracksList();

      let trackDurationSec = 220;
      if (track.duration) {
        const parts = String(track.duration).split(':');
        if (parts.length === 2) {
          trackDurationSec = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
        }
      }

      if (typeof window.fetchLrclibSyncedLyrics === 'function') {
        window.fetchLrclibSyncedLyrics(track.artist, track.title, trackDurationSec).then(res => {
          if (res && res.lyrics && res.lyrics.length > 0 && currentMusicIndex === idx) {
            activeLyricsList = res.lyrics;
            window._isCurrentSongLrcSynced = !!res.isLrc;
            renderLyricsFromList(activeLyricsList);
          }
        }).catch(() => {});
      }
    }

    function renderLyrics(track) {
      if (track && track.lyrics) {
        activeLyricsList = track.lyrics;
        renderLyricsFromList(activeLyricsList);
      }
    }

    // ========================================================
    // INTERRUPTOR GLOBAL DE TRADUCCIÓN AL ESPAÑOL & LETRAS
    // ========================================================
    function toggleGlobalLyricsTranslation() {
      isGlobalSpanishTranslationActive = !isGlobalSpanishTranslationActive;
      const btn = document.getElementById('toggleGlobalTranslationBtn');
      if (btn) {
        if (isGlobalSpanishTranslationActive) {
          btn.className = 'px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-cyan-500/20 active:scale-95';
          btn.innerHTML = '<span>✅ Traducción al Español (Activa)</span>';
          showFloatingToast('Subtítulos en español visibles para toda la canción', '🌐');
        } else {
          btn.className = 'px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95';
          btn.innerHTML = '<span>🌐 Traducción al Español (Toda la Canción)</span>';
          showFloatingToast('Subtítulos en español ocultos', '🌐');
        }
      }

      const translations = document.querySelectorAll('.music-stanza-translation');
      translations.forEach(el => {
        if (isGlobalSpanishTranslationActive) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      });
    }

    function initLyricsScrollDetection() {
      if (typeof document === 'undefined') return;
      const container = document.getElementById('musicLyricsContainer');
      if (!container || container._hasLyricsScrollListener) return;
      container._hasLyricsScrollListener = true;

      const onUserScroll = () => {
        window._isUserScrollingLyrics = true;
        if (_userScrollLyricsTimer) clearTimeout(_userScrollLyricsTimer);
        _userScrollLyricsTimer = setTimeout(() => {
          window._isUserScrollingLyrics = false;
        }, 2500);
      };

      if (typeof container.addEventListener === 'function') {
        container.addEventListener('wheel', onUserScroll, { passive: true });
        container.addEventListener('touchmove', onUserScroll, { passive: true });
        container.addEventListener('scroll', onUserScroll, { passive: true });
      }
    }

    function renderLyricsFromList(lyrics) {
      activeLyricsList = lyrics;
      window.activeLyricsList = lyrics;
      if (typeof window.translateAllStanzasToSpanish === 'function') {
        try { window.translateAllStanzasToSpanish(lyrics); } catch (_) {}
      }
      lastActiveStanzaIndex = -1;
      lastActiveWordIndex = -1;
      window._lastActiveStanzaIndex = -1;
      window._lastActiveWordIndex = -1;
      window.lastActiveStanzaIdx = -1;
      window.lastActiveWordIdx = -1;
      initLyricsScrollDetection();
      const container = document.getElementById('karaoke-lyrics-container') || document.getElementById('musicLyricsContainer');
      const badge = document.getElementById('karaokeTimeBadge');
      if (!container || !lyrics) return;

      const firstVerseTime = (lyrics.length > 0 && typeof lyrics[0].time === 'number') ? lyrics[0].time : 0;
      const isLrc = lyrics.some(item => item.isLrcSynced) || !!window._isCurrentSongLrcSynced;

      // Distintivo sutil de sincronización: '⚡ Sincronizado LRC Oficial' vs '⏱ Sincronización aproximada'
      let syncTypeBadge = document.getElementById('karaokeSyncTypeBadge');
      if (!syncTypeBadge && badge && badge.parentNode) {
        syncTypeBadge = document.createElement('span');
        syncTypeBadge.id = 'karaokeSyncTypeBadge';
        badge.parentNode.insertBefore(syncTypeBadge, badge);
      }
      if (syncTypeBadge) {
        if (isLrc) {
          syncTypeBadge.className = 'inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30';
          syncTypeBadge.innerHTML = '⚡ Sincronizado LRC Oficial';
        } else {
          syncTypeBadge.className = 'inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30';
          syncTypeBadge.innerHTML = '⏱ Sincronización aproximada';
        }
      }

      if (firstVerseTime > 1.5) {
        currentKaraokeStanzaIndex = -1;
        if (badge) badge.textContent = '🎶 [Música Instrumental]';
      } else {
        currentKaraokeStanzaIndex = 0;
        if (badge) badge.textContent = `Estrofa 1 de ${lyrics.length}`;
      }

      let introBanner = '';
      if (window._autoIntroOffset && window._autoIntroOffset >= 2) {
        const introSec = window._autoIntroOffset;
        introBanner = `
          <div id="videoIntroAdjustBanner" class="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 flex items-center justify-between gap-2 shadow-lg backdrop-blur-sm animate-fade-in">
            <div class="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <span class="text-base">🎬</span>
              <span>Intro detectada en el video (+${introSec}s vs letra de estudio)</span>
            </div>
            <button type="button" onclick="event.stopPropagation(); window.applyAutoIntroOffset(${introSec})"
              class="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs transition shadow-md flex items-center gap-1.5 whitespace-nowrap cursor-pointer" title="Calibrar desfase de la intro del video musical">
              <span>⚡</span> <span>Ajustar Intro de Video (+${introSec}s)</span>
            </button>
          </div>
        `;
      }

      container.innerHTML = introBanner + lyrics.map((stanza, lIdx) => {
        const lineTime = typeof stanza.startTime === 'number' ? stanza.startTime : (typeof stanza.time === 'number' ? stanza.time : 0);
        const nextStanzaObj = lIdx < lyrics.length - 1 ? lyrics[lIdx + 1] : null;
        const nextTime = nextStanzaObj
          ? (typeof nextStanzaObj.startTime === 'number' ? nextStanzaObj.startTime : (typeof nextStanzaObj.time === 'number' ? nextStanzaObj.time : lineTime + 8))
          : lineTime + 8;
        const stanzaDuration = Math.max(2, (typeof stanza.endTime === 'number' && stanza.endTime > lineTime) ? (stanza.endTime - lineTime) : (nextTime - lineTime));
        stanza.startTime = lineTime;
        stanza.time = lineTime;
        if (typeof stanza.endTime !== 'number' || stanza.endTime <= lineTime) {
          stanza.endTime = lineTime + stanzaDuration;
        }

        // Soporta array de líneas o texto multilínea dividido por saltos de línea
        const verses = Array.isArray(stanza.lines) && stanza.lines.length > 0
          ? stanza.lines
          : (stanza.text || '').split(/\r?\n/).map(v => v.trim()).filter(Boolean);
        if (!Array.isArray(stanza.words) || stanza.words.length === 0) {
          stanza.words = (verses.join(' ') || stanza.text || '').split(/\s+/).filter(Boolean);
        }

        const totalVerses = verses.length || 1;
        const verseDuration = stanzaDuration / totalVerses;

        let wordStanzaCounter = 0;
        const renderedVerses = (verses.length > 0 ? verses : [stanza.text || '']).map((verseStr, vIdx) => {
          const rawWords = verseStr.split(/\s+/).filter(Boolean);
          const wordsCount = rawWords.length || 1;
          const vStart = lineTime + (vIdx * verseDuration);

          const renderedWords = rawWords.map((w, wIdx) => {
            const cleanWord = w.toLowerCase().replace(/[^a-z']/g, '');
            const wStart = (vStart + (wIdx / wordsCount) * verseDuration).toFixed(2);
            const wEnd = (vStart + ((wIdx + 1) / wordsCount) * verseDuration).toFixed(2);
            const safeEscaped = escapeMusicHtml(w);
            const currentWordIdx = wordStanzaCounter++;
            return `<span class="k-word lyric-word cursor-pointer inline-block transition-all duration-150" data-widx="${currentWordIdx}" data-word-idx="${currentWordIdx}" data-index="${currentWordIdx}" data-w-start="${wStart}" data-w-end="${wEnd}" onclick="event.stopPropagation(); inspectLyricsWord('${cleanWord}', event)" title="Ver fonética IPA">${safeEscaped} </span>`;
          }).join('');

          return `<div class="lyric-verse-line block leading-relaxed text-base font-semibold mb-1.5">${renderedWords}</div>`;
        }).join('');

        const safeFullText = (verses.join(' ') || stanza.text || '').replace(/'/g, "\\'");
        const isCurrent = lIdx === currentKaraokeStanzaIndex;
        const esText = stanza.es || '';

        return `
          <div id="karaokeStanza-${lIdx}"
            class="karaoke-lyric-line lyric-line stanza-card lyric-stanza-card music-stanza-row ${isCurrent ? 'active lyric-active scale-[1.02] border-cyan-400 bg-cyan-950/80 text-white' : 'lyric-inactive'}" data-sidx="${lIdx}"
            data-start="${lineTime}" data-end="${stanza.endTime}"
            onclick="window.seekToStanza ? window.seekToStanza(${lineTime}, ${lIdx}) : seekYouTubePlayer(${lineTime}, ${lIdx})">
            <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-700/40">
              <span class="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/25">
                ESTROFA ${lIdx + 1} &bull; ${lineTime}S
              </span>
              <div class="flex items-center gap-1.5">
                <button type="button" onclick="event.stopPropagation(); window.syncStanzaHere(${lineTime}, ${lIdx}, event)"
                  class="p-1 px-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-800/90 text-cyan-300 hover:text-cyan-100 text-xs transition cursor-pointer flex items-center gap-1 border border-cyan-500/40 shadow-sm active:scale-95 hover:border-cyan-400" title="Sincronizar esta estrofa con el audio actual">
                  <span>🎯</span> <span class="text-[10px] font-bold">Sincronizar Aquí</span>
                </button>
                <button type="button" onclick="event.stopPropagation(); speakText('${safeFullText}')"
                  class="p-1 px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-xs transition cursor-pointer flex items-center gap-1 border border-slate-700/60 shadow-sm active:scale-95" title="Pronunciación de la estrofa">
                  <span>🔊</span> <span class="text-[10px] font-bold">Pronunciar</span>
                </button>
              </div>
            </div>
            <div class="lyric-words-flow block space-y-1">
              ${renderedVerses}
            </div>
            <div class="music-stanza-translation stanza-translation text-xs text-cyan-300/95 font-medium italic mt-2.5 pt-2 border-t border-cyan-500/20 flex items-center gap-1.5" id="stanza-es-${lIdx}" style="display: ${(typeof window.isSpanishTranslationActive !== 'undefined' ? window.isSpanishTranslationActive : isGlobalSpanishTranslationActive) ? 'flex' : 'none'};">
                <span class="text-[10px] uppercase font-bold text-cyan-400 tracking-wider not-italic bg-cyan-500/15 px-1.5 py-0.5 rounded border border-cyan-500/25">ES</span>
                <span>${escapeMusicHtml(stanza.textEs || esText || 'Traduciendo al español...')}</span>
              </div>
          </div>
        `;
      }).join('');
      const altContainer = document.getElementById('musicLyricsContainer');
      if (altContainer && altContainer !== container) {
        altContainer.innerHTML = container.innerHTML;
      }
    }

    // Calibración de 1 clic para intro de video detectada
    window.applyAutoIntroOffset = function(introSec) {
      const offsetVal = -Math.abs(parseFloat(introSec) || 0);
      window.lyricsOffset = Math.round(offsetVal * 10) / 10;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('mastereng_lyrics_offset', String(window.lyricsOffset));
        }
      } catch (_) {}
      updateLyricsOffsetUI();
      const banner = document.getElementById('videoIntroAdjustBanner');
      if (banner) {
        banner.innerHTML = `
          <div class="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <span class="text-base">✅</span>
            <span>Intro de video calibrada (${window.lyricsOffset.toFixed(1)}s aplicado al karaoke)</span>
          </div>
        `;
        setTimeout(() => { if (banner) banner.style.display = 'none'; }, 3500);
      }
      if (typeof showFloatingToast === 'function') {
        showFloatingToast(`Intro calibrada: ${window.lyricsOffset.toFixed(1)}s`, '⚡');
      }
      if (typeof handleKaraokeTimeUpdate === 'function') {
        handleKaraokeTimeUpdate();
      }
    };

    // Sincronización Interactiva de 1 Clic en Cualquier Estrofa ("Tap to Sync")
    window.syncStanzaHere = function(stanzaTime, stanzaIdx, event) {
      if (event) {
        if (typeof event.stopPropagation === 'function') event.stopPropagation();
        if (typeof event.preventDefault === 'function') event.preventDefault();
      }
      const playerTime = getMasterPlaybackTime();
      // calibratedTime = playerTime + lyricsOffset -> lyricsOffset = stanzaTime - playerTime
      const targetOffset = Math.round((stanzaTime - playerTime) * 10) / 10;
      window.lyricsOffset = targetOffset;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('mastereng_lyrics_offset', String(targetOffset));
        }
      } catch (_) {}
      updateLyricsOffsetUI();
      highlightKaraokeStanza(stanzaIdx, true);
      if (typeof showFloatingToast === 'function') {
        const sign = targetOffset > 0 ? '+' : '';
        showFloatingToast(`Sincronizado aquí: ${sign}${targetOffset.toFixed(1)}s`, '🎯');
      }
    };

    function renderMusicLyrics(lyrics) {
      return renderLyricsFromList(lyrics);
    }

    let karaokeAudioTracker = null;

    function setupAudioVideoTimeUpdateListener() {
      if (!karaokeAudioTracker) {
        karaokeAudioTracker = document.getElementById('karaokeAudioSync');
        if (!karaokeAudioTracker) {
          karaokeAudioTracker = document.createElement('audio');
          karaokeAudioTracker.id = 'karaokeAudioSync';
          karaokeAudioTracker.style.display = 'none';
          document.body.appendChild(karaokeAudioTracker);
        }
        karaokeAudioTracker.addEventListener('timeupdate', () => {
          handleKaraokeTimeUpdate(karaokeAudioTracker.currentTime);
        });
      }
      return karaokeAudioTracker;
    }

    function handleKaraokeTimeUpdate(currentTime) {
      if (window.KaraokeSyncEngine && window.KaraokeSyncEngine.stanzas && window.KaraokeSyncEngine.stanzas.length > 0) {
        const timeToSync = (typeof currentTime === 'number' && !isNaN(currentTime))
          ? currentTime
          : window.KaraokeSyncEngine.getCurrentPlaybackTime();
        window.KaraokeSyncEngine.syncFrame(timeToSync, false);
        window.KaraokeSyncEngine.updateSeekBarUI(timeToSync);
        return;
      }

      const lyrics = activeLyricsList;
      if (!lyrics || lyrics.length === 0) return;

      const activePlayer = window._holoYtPlayer || (typeof ytMusicPlayer !== 'undefined' ? ytMusicPlayer : null) || document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
      const playbackTime = (typeof currentTime === 'number' && !isNaN(currentTime))
        ? currentTime
        : ((activePlayer && typeof activePlayer.getCurrentTime === 'function')
            ? activePlayer.getCurrentTime()
            : (activePlayer && typeof activePlayer.currentTime === 'number' ? activePlayer.currentTime : 0));

      // const playbackTime = activePlayer.getCurrentTime();
      // const calibratedTime = playbackTime + window.lyricsOffset;
      const calibratedTime = (typeof currentTime === 'number' && !isNaN(currentTime))
        ? currentTime
        : (playbackTime + (typeof window.lyricsOffset === 'number' ? window.lyricsOffset : -0.6));

      // Normalizar startTime en cada estrofa
      lyrics.forEach((st) => {
        if (typeof st.startTime !== 'number') {
          st.startTime = (typeof st.time === 'number') ? st.time : 0;
        }
        st.time = st.startTime;
      });

      const firstStanza = lyrics[0];
      const firstStanzaStartTime = firstStanza ? firstStanza.startTime : 0;
      const badge = document.getElementById('karaokeTimeBadge');
      const introBanner = document.getElementById('karaokeIntroBanner');

      // Si calibratedTime < firstStanza.startTime, el estado debe ser estrictamente "🎶 [Intro Instrumental]"
      if (calibratedTime < firstStanzaStartTime) {
        if (badge) badge.textContent = '🎶 [Intro Instrumental]'; // 🎶 [Música Instrumental]
        if (introBanner) { introBanner.style.display = 'none'; if (typeof introBanner.remove === 'function') introBanner.remove(); }
        currentKaraokeStanzaIndex = -1;

        if (window._lastActiveStanzaIndex !== -1 || lastActiveStanzaIndex !== -1 || window.lastActiveStanzaIdx !== -1) {
          lastActiveStanzaIndex = -1;
          window._lastActiveStanzaIndex = -1;
          window.lastActiveStanzaIdx = -1;
          lastActiveWordIndex = -1;
          window._lastActiveWordIndex = -1;
          window.lastActiveWordIdx = -1;

          const lines = document.querySelectorAll('#karaoke-lyrics-container .lyric-line, #musicLyricsContainer .lyric-line, .stanza-card');
          lines.forEach(lineEl => {
            lineEl.classList.remove('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
            if (!lineEl.classList.contains('lyric-inactive')) {
              lineEl.classList.add('lyric-inactive');
            }
            const wordSpans = lineEl.querySelectorAll('.k-word, .lyric-word');
            wordSpans.forEach(wEl => {
              wEl.classList.remove('lit', 'word-sung', 'word-active');
              if (!wEl.classList.contains('word-inactive')) wEl.classList.add('word-inactive');
            });
          });
        }
        return;
      }

      if (introBanner && introBanner.style.display !== 'none') introBanner.style.display = 'none';

      // Condición estricta de asignación de estrofa:
      // calibratedTime >= currentStanza.startTime && calibratedTime < nextStanza.startTime
      let matchedIdx = -1;
      for (let i = 0; i < lyrics.length; i++) {
        const currentStanza = lyrics[i];
        const nextStanza = lyrics[i + 1];
        const nextStanzaStartTime = nextStanza
          ? (typeof nextStanza.startTime === 'number' ? nextStanza.startTime : nextStanza.time)
          : 999999;

        if (calibratedTime >= currentStanza.startTime && calibratedTime < nextStanzaStartTime) {
          matchedIdx = i;
          break;
        }
      }

      if (matchedIdx === -1 && lyrics.length > 0 && calibratedTime >= lyrics[lyrics.length - 1].startTime) {
        matchedIdx = lyrics.length - 1;
      }
      if (matchedIdx === -1 && calibratedTime >= firstStanzaStartTime) matchedIdx = 0;

      const totalStanzas = lyrics.length;
      const stanzaChanged = (matchedIdx !== window._lastActiveStanzaIndex);

      // 1. Si la estrofa activa calculada es IGUAL a 'lastActiveStanzaIndex', NO toques las clases de las estrofas. Solo evalúa la palabra interna.
      if (stanzaChanged) {
        if (badge) badge.textContent = `Estrofa ${matchedIdx + 1} de ${totalStanzas}`;

        const lines = document.querySelectorAll('#karaoke-lyrics-container .lyric-line, #musicLyricsContainer .lyric-line, .stanza-card');
        lines.forEach((lineEl, idx) => {
          if (idx === matchedIdx) {
            lineEl.classList.add('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
            lineEl.classList.remove('lyric-inactive');
          } else {
            lineEl.classList.remove('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
            if (!lineEl.classList.contains('lyric-inactive')) {
              lineEl.classList.add('lyric-inactive');
            }
            // Versos pasados permanecen iluminados como sung, versos futuros permanecen inactivos
            const otherWords = lineEl.querySelectorAll('.k-word, .lyric-word');
            if (idx < matchedIdx) {
              otherWords.forEach(wEl => {
                if (!wEl.classList.contains('word-active')) wEl.classList.add('lit', 'word-active', 'word-sung');
                wEl.classList.remove('word-inactive');
              });
            } else {
              otherWords.forEach(wEl => {
                wEl.classList.remove('lit', 'word-active', 'word-sung');
                if (!wEl.classList.contains('word-inactive')) wEl.classList.add('word-inactive');
              });
            }
          }
        });

        // 4. El desplazamiento suave ('scrollIntoView') SOLO debe ejecutarse una única vez cuando cambie 'lastActiveStanzaIndex'.
        const currentStanzaEl = document.getElementById(`karaokeStanza-${matchedIdx}`);
        if (currentStanzaEl && !window._isUserScrollingLyrics && typeof currentStanzaEl.scrollIntoView === 'function') {
          currentStanzaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        lastActiveStanzaIndex = matchedIdx;
        window._lastActiveStanzaIndex = matchedIdx;
        window.lastActiveStanzaIdx = matchedIdx;
        lastActiveWordIndex = -1;
        window._lastActiveWordIndex = -1;
        window.lastActiveWordIdx = -1;
        currentKaraokeStanzaIndex = matchedIdx;
      }

      // Evaluación interna de palabra por palabra de la estrofa activa:
      const activeStanza = lyrics[matchedIdx];
      const lineStart = typeof activeStanza.startTime === 'number' ? activeStanza.startTime : (typeof activeStanza.time === 'number' ? activeStanza.time : 0);
      const nextStanza = lyrics[matchedIdx + 1];
      const lineEnd = nextStanza
        ? (typeof nextStanza.startTime === 'number' ? nextStanza.startTime : nextStanza.time)
        : (lineStart + (window._currentTrackTotalDuration ? Math.max(3, window._currentTrackTotalDuration - lineStart) : 6));
      const duration = Math.max(1.5, lineEnd - lineStart);
      const elapsed = calibratedTime - lineStart;
      const progress = Math.min(1, Math.max(0, elapsed / duration));

      const currentStanzaEl = document.getElementById(`karaokeStanza-${matchedIdx}`);
      const words = currentStanzaEl ? currentStanzaEl.querySelectorAll('.k-word, .lyric-word') : [];
      const totalWords = words.length;
      const activeWordIndex = totalWords > 0 ? Math.min(totalWords - 1, Math.floor(progress * totalWords)) : 0;

      // 2. Si la palabra activa calculada dentro de esa estrofa es IGUAL a 'lastActiveWordIndex', NO toques el DOM.
      // 3. PROHIBIDO alterar 'innerHTML' o remover/añadir clases si los índices no han cambiado.
      // webkitBackgroundClip
      if (activeWordIndex !== window._lastActiveWordIndex) {
        lastActiveWordIndex = activeWordIndex;
        window._lastActiveWordIndex = activeWordIndex;
        window.lastActiveWordIdx = activeWordIndex;
        for (let w = 0; w < totalWords; w++) {
          const wEl = words[w];
          if (w <= activeWordIndex) {
            if (!wEl.classList.contains('word-active')) {
              wEl.classList.add('lit');
              wEl.classList.add('word-active');
              wEl.classList.remove('word-inactive');
            }
          } else {
            if (!wEl.classList.contains('word-inactive')) {
              wEl.classList.add('word-inactive');
              wEl.classList.remove('lit');
              wEl.classList.remove('word-active');
            }
          }
        }
      }
    }

        function highlightKaraokeStanza(stanzaIdx, autoScroll = true) {
      currentKaraokeStanzaIndex = stanzaIdx;
      window._lastActiveStanzaIndex = stanzaIdx;
      lastActiveStanzaIndex = stanzaIdx;
      window.lastActiveStanzaIdx = stanzaIdx;
      const lyrics = activeLyricsList;
      if (!lyrics || !lyrics[stanzaIdx]) return;
      const targetTime = typeof lyrics[stanzaIdx].time === 'number' ? lyrics[stanzaIdx].time : 0;
      handleKaraokeTimeUpdate(targetTime);

      const lines = document.querySelectorAll('#karaoke-lyrics-container .lyric-line, #musicLyricsContainer .lyric-line, .stanza-card');
      lines.forEach((lineEl, idx) => {
        if (idx === stanzaIdx) {
          lineEl.classList.add('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
          lineEl.classList.remove('lyric-inactive');
        } else {
          lineEl.classList.remove('active', 'lyric-active', 'scale-[1.02]', 'border-cyan-400', 'bg-cyan-950/80', 'text-white');
          if (!lineEl.classList.contains('lyric-inactive')) lineEl.classList.add('lyric-inactive');
          const otherWords = lineEl.querySelectorAll('.k-word, .lyric-word');
          if (idx < stanzaIdx) {
            otherWords.forEach(wEl => {
              wEl.classList.add('lit', 'word-active', 'word-sung');
              wEl.classList.remove('word-inactive');
            });
          } else {
            otherWords.forEach(wEl => {
              wEl.classList.remove('lit', 'word-active', 'word-sung');
              wEl.classList.add('word-inactive');
            });
          }
        }
      });
      if (autoScroll) {
        const currentStanzaEl = document.getElementById(`karaokeStanza-${stanzaIdx}`);
        if (currentStanzaEl && typeof currentStanzaEl.scrollIntoView === 'function') {
          currentStanzaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    // ========================================================
    // SINCRONIZACIÓN EN VIVO (RELOJ MAESTRO DE ALTA PRECISIÓN A 60HZ)
    // ========================================================
    function syncKaraokeToTime() {
      if (!isKaraokeSyncRunning) return;
      if (window.KaraokeSyncEngine && window.KaraokeSyncEngine.stanzas && window.KaraokeSyncEngine.stanzas.length > 0) {
        const t = window.KaraokeSyncEngine.getCurrentPlaybackTime();
        window.KaraokeSyncEngine.syncFrame(t, false);
        window.KaraokeSyncEngine.updateSeekBarUI(t);
        return;
      }
      const lyrics = activeLyricsList;
      if (!lyrics || lyrics.length === 0) return;

      const ytPlayer = ytMusicPlayer || window._holoYtPlayer;
      const rawMasterTime = getMasterPlaybackTime();
      let currentTime = rawMasterTime + (typeof window.lyricsOffset === 'number' ? window.lyricsOffset : -0.6);

      // Escala proporcional por duracion SOLO para canciones sin sincronizar con tiempo aproximado
      const duracionRealPlayer = (ytPlayer && typeof ytPlayer.getDuration === 'function')
        ? ytPlayer.getDuration()
        : (ytMasterState.duration || 0);
      if (duracionRealPlayer > 30) {
        try {
          const hasApprox = activeLyricsList && activeLyricsList.length > 0 && activeLyricsList.some(s => s.isApproximatedSync);
          if (hasApprox) {
            const duracionTotalLetra = window._currentTrackTotalDuration || (activeLyricsList[activeLyricsList.length - 1].time + 10);
            if (duracionTotalLetra > 30 && Math.abs(duracionRealPlayer - duracionTotalLetra) > 5) {
              const factorEscala = duracionRealPlayer / duracionTotalLetra;
              if (Math.abs(factorEscala - 1) < 0.25) {
                if (!window._karaokeScaledMap) window._karaokeScaledMap = {};
                const kKey = `${currentMusicIndex}_${Math.round(duracionRealPlayer)}`;
                if (!window._karaokeScaledMap[kKey]) {
                  window._karaokeScaledMap[kKey] = true;
                  activeLyricsList.forEach(st => {
                    const tiempoEstrofaOriginal = typeof st.originalTime === 'number' ? st.originalTime : (typeof st.time === 'number' ? st.time : 0);
                    if (typeof st.originalTime !== 'number') st.originalTime = tiempoEstrofaOriginal;
                    st.time = Math.round(tiempoEstrofaOriginal * factorEscala * 100) / 100;
                  });
                  renderLyricsFromList(activeLyricsList);
                }
              }
            }
          }
        } catch (_) {}
      }

      const tracker = setupAudioVideoTimeUpdateListener();
      if (tracker) {
        tracker.currentTime = Math.max(0, currentTime);
        tracker.dispatchEvent(new Event('timeupdate'));
      } else {
        handleKaraokeTimeUpdate(Math.max(0, currentTime));
      }
    }

    // ========================================================
    // PAUSA SIMULTÁNEA UNIFICADA Y CONTROL ANTI-DOBLE AUDIO
    // ========================================================
    function syncPauseAllMusicPlayers() {
      // 1. Pausa simultáneamente #mastereng-audio, resetea a 0 y lo silencia (cero audio residual)
      const audioEl = document.getElementById('mastereng-audio');
      if (audioEl) {
        try {
          audioEl.pause();
          audioEl.currentTime = 0;
          audioEl.muted = true;
        } catch (_) {}
      }
      const syncAudio = document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
      if (syncAudio) {
        try {
          syncAudio.pause();
          syncAudio.currentTime = 0;
          syncAudio.muted = true;
        } catch (_) {}
      }
      if (window._holoAudioNativePlayer) {
        try {
          window._holoAudioNativePlayer.pause();
          window._holoAudioNativePlayer.currentTime = 0;
          window._holoAudioNativePlayer.muted = true;
        } catch (_) {}
      }

      // 2. Enviar {"event":"command","func":"pauseVideo","args":""} al #musicYouTubeIframe y #musicHoloYoutubeIframe
      const iframe = document.getElementById('musicYouTubeIframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } catch (_) {}
      }
      const holoIframe = document.getElementById('musicHoloYoutubeIframe');
      if (holoIframe && holoIframe.contentWindow) {
        try {
          holoIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } catch (_) {}
      }

      // 3. Pausar instancias de la API YT.Player
      if (ytMusicPlayer && typeof ytMusicPlayer.pauseVideo === 'function') {
        try { ytMusicPlayer.pauseVideo(); } catch (_) {}
      }
      if (window.ytMusicPlayer && typeof window.ytMusicPlayer.pauseVideo === 'function') {
        try { window.ytMusicPlayer.pauseVideo(); } catch (_) {}
      }
      if (window._holoYtPlayer && typeof window._holoYtPlayer.pauseVideo === 'function') {
        try { window._holoYtPlayer.pauseVideo(); } catch (_) {}
      }
      if (window.ytPlayer && typeof window.ytPlayer.pauseVideo === 'function') {
        try { window.ytPlayer.pauseVideo(); } catch (_) {}
      }

      // 4. Congelar reloj maestro y detener de inmediato el seguimiento y avance de la letra
      ytMasterState.isPlaying = false;
      ytMasterState.playerState = 2;
      stopMusicKaraokeSync();
    }
    window.syncPauseAllMusicPlayers = syncPauseAllMusicPlayers;

    // Listener de exclusión mutua: si #mastereng-audio se reproduce, pausar YouTube
    if (typeof document !== 'undefined') {
      const initAudioMutualExclusion = () => {
        const audioEl = document.getElementById('mastereng-audio');
        if (audioEl && typeof audioEl.addEventListener === 'function' && !audioEl._hasAudioSyncMutex) {
          audioEl._hasAudioSyncMutex = true;
          audioEl.addEventListener('play', () => {
            if (ytMusicPlayer && typeof ytMusicPlayer.pauseVideo === 'function') {
              try { ytMusicPlayer.pauseVideo(); } catch (_) {}
            }
            const ifr = document.getElementById('musicYouTubeIframe');
            if (ifr && ifr.contentWindow) {
              try { ifr.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'); } catch (_) {}
            }
          });
        }
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAudioMutualExclusion);
      } else {
        setTimeout(initAudioMutualExclusion, 0);
      }
    }

    // ========================================================
    // SALTO TEMPORAL Y SINCRONIZACIÓN DE ESTROFA
    // ========================================================
    function seekToStanza(seconds, stanzaIdx = null) {
      window._isUserScrollingLyrics = false;
      const targetSec = parseFloat(seconds);
      if (isNaN(targetSec)) return;

      // Compensar offset de intro o calibración para el reproductor de video
      const seekTime = (typeof window.lyricsOffset === 'number' && !isNaN(window.lyricsOffset) && Math.abs(window.lyricsOffset) > 0.1)
        ? Math.max(0, targetSec - window.lyricsOffset)
        : targetSec;

      ytMasterState.lastReportedTime = seekTime;
      ytMasterState.lastReportedTimestamp = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

      // 1. Salto temporal en el reproductor de YouTube (player.seekTo(seekTime, true))
      const ytTargetPlayer = (typeof ytMusicPlayer !== 'undefined' && ytMusicPlayer) || window.ytMusicPlayer || window._holoYtPlayer || window.ytPlayer;
      if (ytTargetPlayer && typeof ytTargetPlayer.seekTo === 'function') {
        try { ytTargetPlayer.seekTo(seekTime, true); } catch (_) {}
      }
      const iframe = document.getElementById('musicYouTubeIframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [seekTime, true]
          }), '*');
        } catch (_) {}
      }
      const holoIframe = document.getElementById('musicHoloYoutubeIframe');
      if (holoIframe && holoIframe.contentWindow) {
        try {
          holoIframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [seekTime, true]
          }), '*');
        } catch (_) {}
      }

      // 2. Mantener #mastereng-audio pausado y muteado si YouTube está activo
      const audioEl = document.getElementById('mastereng-audio');
      if (audioEl) {
        try {
          audioEl.currentTime = 0;
          audioEl.pause();
          audioEl.muted = true;
        } catch (_) {}
      }
      const syncAudio = document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
      if (syncAudio) {
        try {
          syncAudio.currentTime = seekTime;
          syncAudio.pause();
          syncAudio.muted = true;
        } catch (_) {}
      }

      // 3. Resolver índice de la estrofa seleccionada
      let targetIdx = stanzaIdx;
      const lyrics = activeLyricsList || window.activeLyricsList || [];
      if ((targetIdx === null || targetIdx === undefined || targetIdx < 0) && lyrics.length > 0) {
        targetIdx = lyrics.findIndex(s => Math.abs((s.time || 0) - targetSec) < 0.8);
        if (targetIdx === -1) {
          targetIdx = lyrics.findIndex((s, i) => {
            const nextTime = lyrics[i + 1] ? (lyrics[i + 1].time || 9999) : 9999;
            return targetSec >= (s.time || 0) && targetSec < nextTime;
          });
        }
      }

      // 4. Sincronizar automáticamente window.lyricsOffset para esa estrofa sin desfasar el resto
      if (targetIdx !== -1 && targetIdx !== null && targetIdx !== undefined && lyrics[targetIdx]) {
        if (typeof window.lyricsOffset !== 'number' || isNaN(window.lyricsOffset)) {
          window.lyricsOffset = -0.6;
        }
        highlightKaraokeStanza(targetIdx, true);
      }

      if (window.KaraokeSyncEngine) {
        window.KaraokeSyncEngine.lastStanzaIdx = targetIdx;
        window.KaraokeSyncEngine.syncFrame(targetSec, true);
        window.KaraokeSyncEngine.updateSeekBarUI(targetSec);
      }
      if (typeof handleKaraokeTimeUpdate === 'function') {
        handleKaraokeTimeUpdate(targetSec);
      }
    }
    window.seekToStanza = seekToStanza;

    function seekYouTubePlayer(seconds, stanzaIdx = null) {
      if (typeof window.seekTrackToSeconds === 'function') {
        window.seekTrackToSeconds(seconds);
      }
      seekToStanza(seconds, stanzaIdx);
    }

    // ========================================================
    // BÚSQUEDA Y FILTRADO LRCLIB (DESCARTA ACOUSTIC/LIVE Y BUSCA DURACIÓN MÁS CERCANA)
    // ========================================================
    async function fetchLrclibSyncedLyrics(artist, title, totalDurationSec, ytDurationSec) {
      const rawTitle = title || '';
      const rawArtist = artist || '';
      const cleanTitle = rawTitle.replace(/\s*\([^)]*\)/g, '').replace(/\s*-\s*.*$/, '').trim() || rawTitle;
      const cleanArtist = rawArtist.replace(/\s*&.*$/, '').trim() || rawArtist;

      const isAcousticRequested = /\b(acoustic|acustico|acústica|unplugged)\b/i.test(rawTitle);
      const isLiveRequested = /\b(live|en vivo|in concert|directo)\b/i.test(rawTitle);
      const isRemixRequested = /\b(remix|mix|edit|version)\b/i.test(rawTitle);
      const isInstrumentalRequested = /\b(instrumental|karaoke|backing track)\b/i.test(rawTitle);

      // Determinar duración objetivo (prioridad: ytDurationSec > ytMasterState.duration > totalDurationSec > ytMusicPlayer.getDuration)
      let targetDuration = ytDurationSec;
      if (!targetDuration && ytMasterState && typeof ytMasterState.duration === 'number' && ytMasterState.duration > 0) {
        targetDuration = ytMasterState.duration;
      }
      if (!targetDuration && ytMusicPlayer && typeof ytMusicPlayer.getDuration === 'function') {
        try {
          const d = ytMusicPlayer.getDuration();
          if (typeof d === 'number' && d > 0) targetDuration = d;
        } catch (_) {}
      }
      targetDuration = targetDuration || totalDurationSec || 220;

      const isUnwantedVersion = (item) => {
        const text = `${item.trackName || ''} ${item.albumName || ''} ${item.artistName || ''}`;
        if (!isAcousticRequested && /\b(acoustic|acustico|acústica|unplugged)\b/i.test(text)) return true;
        if (!isLiveRequested && /\b(live|en vivo|in concert|directo)\b/i.test(text)) return true;
        if (!isRemixRequested && /\b(remix|club mix|extended mix|dub)\b/i.test(text)) return true;
        if (!isInstrumentalRequested && /\b(instrumental|karaoke|backing track|tribute)\b/i.test(text)) return true;
        return false;
      };

      // 1. Intento primario: LRCLIB API /get directa
      try {
        const getUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(cleanArtist)}&track_name=${encodeURIComponent(cleanTitle)}`;
        const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        const tid = ctrl ? setTimeout(() => ctrl.abort(), 3800) : null;
        const res = await fetch(getUrl, ctrl ? { signal: ctrl.signal } : {});
        if (tid) clearTimeout(tid);

        if (res && res.ok) {
          const data = await res.json();
          const candidateDuration = data.duration || targetDuration;
          const diff = Math.abs(candidateDuration - targetDuration);
          const discard = isUnwantedVersion(data);

          if (!discard && diff <= 45) {
            let autoIntroOffset = 0;
            if (targetDuration > 30 && candidateDuration > 30) {
              const dIntro = targetDuration - candidateDuration;
              if (dIntro >= 3 && dIntro <= 45) {
                autoIntroOffset = Math.round(dIntro * 10) / 10;
              }
            }
            window._autoIntroOffset = autoIntroOffset;

            if (data.syncedLyrics) {
              const parseFn = window.parseLrcToSyncedLyrics || parseLrcFallback;
              const parsed = parseFn(data.syncedLyrics);
              if (parsed && parsed.length > 0) return { lyrics: parsed, isLrc: true, duration: candidateDuration, videoDuration: targetDuration, autoIntroOffset: autoIntroOffset };
            }
            if (data.plainLyrics) {
              const parseRawFn = window.parseRawLyricsIntoStanzas || parseRawFallback;
              const fallback = parseRawFn(data.plainLyrics, targetDuration, true);
              if (fallback && fallback.length > 0) return { lyrics: fallback, isLrc: false, isApproximated: true, duration: candidateDuration, videoDuration: targetDuration, autoIntroOffset: autoIntroOffset };
            }
          }
        }
      } catch (err) {
        console.warn('[LRCLIB] Intento /get falló:', err);
      }

      // 2. Intento secundario: LRCLIB API /search con descarte de versiones indeseadas y duración más cercana
      try {
        const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(cleanArtist + ' ' + cleanTitle)}`;
        const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        const tid = ctrl ? setTimeout(() => ctrl.abort(), 3800) : null;
        const res = await fetch(searchUrl, ctrl ? { signal: ctrl.signal } : {});
        if (tid) clearTimeout(tid);

        if (res && res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            // Descartar versiones Acoustic/Live/Remix/Instrumental si el título no las pide
            let candidates = list.filter(item => !isUnwantedVersion(item));
            if (candidates.length === 0) {
              candidates = list;
            }

            // Priorizar canciones con syncedLyrics válidos
            const syncedCandidates = candidates.filter(i => i.syncedLyrics && typeof i.syncedLyrics === 'string');
            const pool = syncedCandidates.length > 0 ? syncedCandidates : candidates;

            // Seleccionar el registro cuya duración sea la más cercana al video de YouTube
            const bestMatch = pool.reduce((prev, curr) => {
              const prevDiff = Math.abs((prev.duration || 0) - targetDuration);
              const currDiff = Math.abs((curr.duration || 0) - targetDuration);
              return currDiff < prevDiff ? curr : prev;
            }, pool[0]);

            const lrcDuration = bestMatch.duration || 0;
            let autoIntroOffset = 0;
            if (targetDuration > 30 && lrcDuration > 30) {
              const dIntro = targetDuration - lrcDuration;
              if (dIntro >= 3 && dIntro <= 45) {
                autoIntroOffset = Math.round(dIntro * 10) / 10;
              }
            }
            window._autoIntroOffset = autoIntroOffset;

            if (bestMatch && bestMatch.syncedLyrics) {
              const parseFn = window.parseLrcToSyncedLyrics || parseLrcFallback;
              const parsed = parseFn(bestMatch.syncedLyrics);
              if (parsed && parsed.length > 0) return { lyrics: parsed, isLrc: true, duration: lrcDuration, videoDuration: targetDuration, autoIntroOffset: autoIntroOffset };
            }
            if (bestMatch && bestMatch.plainLyrics) {
              const parseRawFn = window.parseRawLyricsIntoStanzas || parseRawFallback;
              const fallback = parseRawFn(bestMatch.plainLyrics, targetDuration, true);
              if (fallback && fallback.length > 0) return { lyrics: fallback, isLrc: false, isApproximated: true, duration: lrcDuration, videoDuration: targetDuration, autoIntroOffset: autoIntroOffset };
            }
          }
        }
      } catch (err) {
        console.warn('[LRCLIB] Intento /search falló:', err);
      }

      // 3. Respaldo lyrics.ovh
      try {
        const ovhUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`;
        const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        const tid = ctrl ? setTimeout(() => ctrl.abort(), 3000) : null;
        const res = await fetch(ovhUrl, ctrl ? { signal: ctrl.signal } : {});
        if (tid) clearTimeout(tid);

        if (res && res.ok) {
          const data = await res.json();
          if (data && data.lyrics) {
            const parseRawFn = window.parseRawLyricsIntoStanzas || parseRawFallback;
            const fallback = parseRawFn(data.lyrics, targetDuration, true);
            if (fallback && fallback.length > 0) return { lyrics: fallback, isLrc: false, isApproximated: true };
          }
        }
      } catch (err) {
        console.warn('[lyrics.ovh] Respaldo falló:', err);
      }

      return null;
    }
    window.fetchLrclibSyncedLyrics = fetchLrclibSyncedLyrics;

    // Fallbacks auxiliares por si no están expuestos en window
    function parseLrcFallback(lrcString) {
      if (!lrcString) return [];
      const lines = lrcString.split(/\r?\n/);
      const result = [];
      const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;
      for (const line of lines) {
        timeRegex.lastIndex = 0;
        const matches = [];
        let match;
        while ((match = timeRegex.exec(line)) !== null) {
          const mins = parseInt(match[1], 10);
          const secs = parseInt(match[2], 10);
          const msStr = (match[3] || '0').padEnd(3, '0').slice(0, 3);
          const ms = parseInt(msStr, 10);
          matches.push(mins * 60 + secs + ms / 1000);
        }
        const text = line.replace(/\[\d{2}:\d{2}(?:\.\d{2,3})?\]/g, '').trim();
        if (text && matches.length > 0) {
          for (const time of matches) {
            result.push({ time, text, isLrcSynced: true });
          }
        }
      }
      result.sort((a, b) => a.time - b.time);
      return result;
    }

    function parseRawFallback(rawLyrics, totalDurationSec, approximate) {
      if (!rawLyrics) return [];
      const lines = rawLyrics.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return [];
      const duration = totalDurationSec || 200;
      const step = duration / lines.length;
      return lines.map((line, idx) => ({
        time: Math.round(idx * step * 10) / 10,
        text: line,
        isApproximated: !!approximate
      }));
    }

    function toggleMusicKaraokeSync() {
      if (isKaraokeSyncRunning) {
        pauseYouTubePlayer();
        stopMusicKaraokeSync();
        showFloatingToast('Karaoke pausado', '⏸️');
      } else {
        resumeYouTubePlayer();
        startMusicKaraokeSync();
        showFloatingToast('Karaoke sincronizado activado', '▶️');
      }
    }

    let masterRafId = null;

    function startMusicKaraokeSync() {
      if (musicKaraokeInterval) {
        clearInterval(musicKaraokeInterval);
        musicKaraokeInterval = null;
      }
      if (masterRafId) {
        cancelAnimationFrame(masterRafId);
        masterRafId = null;
      }

      isKaraokeSyncRunning = true;
      ytMasterState.isPlaying = true;
      ytMasterState.playerState = 1;
      ytMasterState.lastReportedTimestamp = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

      const icon = document.getElementById('karaokeSyncToggleIcon');
      const text = document.getElementById('karaokeSyncToggleText');
      if (icon) icon.textContent = '⏸️';
      if (text) text.textContent = 'Pausar Karaoke';

      pingYouTubeIframeListening();

      // Arrancar motor O(1) de alta precisión con interpolación a 60Hz
      const activePlayer = window._holoYtPlayer || ytMusicPlayer || window.ytMusicPlayer;
      const currentTrack = MUSIC_SESSION_TRACKS[currentMusicIndex] || { id: 'custom_song', defaultOffset: 0 };
      KaraokeSyncEngine.start(activePlayer, activeLyricsList, currentTrack);
    }

    function stopMusicKaraokeSync() {
      isKaraokeSyncRunning = false;
      ytMasterState.isPlaying = false;
      if (ytMasterState.playerState === 1) ytMasterState.playerState = 2;

      // Pausa estricta del loop para 0% uso de CPU
      KaraokeSyncEngine.stop();

      if (masterRafId) {
        cancelAnimationFrame(masterRafId);
        masterRafId = null;
      }
      if (musicKaraokeInterval) {
        clearInterval(musicKaraokeInterval);
        musicKaraokeInterval = null;
      }
      const icon = document.getElementById('karaokeSyncToggleIcon');
      const text = document.getElementById('karaokeSyncToggleText');
      if (icon) icon.textContent = '▶️';
      if (text) text.textContent = 'Sincronizar Karaoke';
    }

    function pauseYouTubePlayer() {
      syncPauseAllMusicPlayers();
    }

    function resumeYouTubePlayer() {
      closeMusicWordModal();
      const activeYt = window._holoYtPlayer || ytMusicPlayer;
      if (activeYt && typeof activeYt.playVideo === 'function') {
        try {
          activeYt.unMute();
          activeYt.setVolume(100);
          activeYt.playVideo();
        } catch (_) {}
      }
      const holoIframe = document.getElementById('musicHoloYoutubeIframe');
      const legacyIframe = document.getElementById('musicYouTubeIframe');
      [holoIframe, legacyIframe].forEach(iframe => {
        if (iframe && iframe.contentWindow) {
          try {
            iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            iframe.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[100]}', '*');
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          } catch (_) {}
        }
      });
      // NUNCA permitir que ambos suenen a la vez: si el video de YouTube está activo, mantener #mastereng-audio pausado y muteado
      const audioEl = document.getElementById('mastereng-audio') || document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
      if (audioEl) {
        try {
          audioEl.pause();
          audioEl.muted = true;
        } catch (_) {}
      }
      window._isHoloStagePlaying = true;
      if (typeof window.startKaraokeSyncTimer === 'function') {
        window.startKaraokeSyncTimer();
      }
      if (typeof window.logAudioDiagnosticStatus === 'function') {
        window.logAudioDiagnosticStatus(null, 'Playing', 100);
      }
      startMusicKaraokeSync();
    }

    function inspectLyricsWord(word, event) {
      if (event) event.stopPropagation();
      pauseYouTubePlayer();

      const clean = (word || '').toLowerCase().replace(/[^a-z']/g, '').trim();
      const entry = findMusicVocabEntry(clean) || {
        ipa: `/${clean}/`,
        trans: 'Palabra en contexto lírico',
        type: 'Vocabulario de la Canción',
        note: `Use "${clean}" in daily spoken English`,
        phrasalEs: 'Expresión contextual',
        ex: `Listen to how the artist pronounces "${clean}" with native intonation.`
      };

      const termEl = document.getElementById('musicWordTerm');
      const ipaEl = document.getElementById('musicWordIpa');
      const esEl = document.getElementById('musicWordEs');
      const pTermEl = document.getElementById('musicWordPhrasal');
      const pEsEl = document.getElementById('musicWordPhrasalEs');
      const pExEl = document.getElementById('musicWordPhrasalEx');
      const typeEl = document.getElementById('musicWordType');
      const modal = document.getElementById('musicWordModal');

      if (termEl) termEl.textContent = clean.charAt(0).toUpperCase() + clean.slice(1);
      if (ipaEl) ipaEl.textContent = entry.ipa || `/${clean}/`;
      if (esEl) esEl.textContent = entry.trans || 'Significado en español';
      if (pTermEl) pTermEl.textContent = entry.note || `Expresión con "${clean}"`;
      if (pEsEl) pEsEl.textContent = entry.phrasalEs || 'Significado y uso práctico';
      if (pExEl) pExEl.textContent = entry.ex ? `"${entry.ex}"` : '';
      if (typeEl) typeEl.textContent = entry.type || 'Vocabulario Musical';

      if (modal) modal.classList.remove('hidden');
    }

    function speakMusicWord() {
      const termEl = document.getElementById('musicWordTerm');
      if (termEl && termEl.textContent) {
        speakText(termEl.textContent, 0.9);
      }
    }

    function closeMusicWordModal() {
      const modal = document.getElementById('musicWordModal');
      if (modal) modal.classList.add('hidden');
    }

    function extractYouTubeId(url) {
      if (!url) return null;
      const clean = url.trim();
      if (clean.length === 11 && !clean.includes('/') && !clean.includes('.') && !clean.includes(' ') && !clean.includes('?')) {
        return clean;
      }
      const reg = /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = clean.match(reg);
      return match ? match[1] : null;
    }

    function completeMusicChallenge() {
      addExp(30, 'Reto superado en Music Session');
    }

    // Cerrar menú de sugerencias predictivas al hacer clic fuera del buscador
    document.addEventListener('click', (e) => {
      const searchBox = document.getElementById('musicSearchBoxWrapper');
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      if (suggestionsEl && searchBox && !searchBox.contains(e.target)) {
        suggestionsEl.classList.add('hidden');
      }
    });

    // ========================================================

  // Exportar funciones y variables al objeto global window sin errores de referencia
  const playMusicTrack = selectMusicTrack;
  function quickSearchMusic(term) { const inp = document.getElementById('musicSearchInput'); if (inp) inp.value = term; if (typeof window.searchGlobalMusic === 'function') window.searchGlobalMusic(term); }
  const searchMusicTracksInput = handleMusicSearchInput;
  window.MUSIC_SESSION_TRACKS = MUSIC_SESSION_TRACKS;
  window.returnToMusicSearch = returnToMusicSearch;
  window.goBackToMusicSearch = returnToMusicSearch;
  window.renderMusicTracksList = renderMusicTracksList;
  window.renderLyricsFromList = renderLyricsFromList;
  window.renderMusicLyrics = renderMusicLyrics;
  window.selectMusicTrack = selectMusicTrack;
  window.playMusicTrack = playMusicTrack;
  window.pauseYouTubePlayer = pauseYouTubePlayer;
  window.resumeYouTubePlayer = resumeYouTubePlayer;
  window.syncPauseAllMusicPlayers = syncPauseAllMusicPlayers;
  window.seekToStanza = seekToStanza;
  window.seekYouTubePlayer = seekYouTubePlayer;
  window.fetchLrclibSyncedLyrics = fetchLrclibSyncedLyrics;
  window.toggleMusicKaraokeSync = toggleMusicKaraokeSync;
  window.startMusicKaraokeSync = startMusicKaraokeSync;
  window.stopMusicKaraokeSync = stopMusicKaraokeSync;
  window.toggleGlobalLyricsTranslation = toggleGlobalLyricsTranslation;
  window.inspectLyricsWord = inspectLyricsWord;
  window.speakMusicWord = speakMusicWord;
  window.closeMusicWordModal = closeMusicWordModal;
  window.handleMusicSearchInput = handleMusicSearchInput;
  window.handleMusicSearchKey = handleMusicSearchKey;
  window.handleMusicSearchSubmit = handleMusicSearchSubmit;
  window.clearMusicSearchInput = clearMusicSearchInput;
  window.quickSearchMusic = quickSearchMusic;
  window.searchMusicTracksInput = searchMusicTracksInput;
  window.executeMusicSearch = executeMusicSearch;
  window.selectMusicSearchResultItem = selectMusicSearchResultItem;
  window.practiceVocabularyFromMusic = practiceVocabularyFromMusic;
  window.completeMusicChallenge = completeMusicChallenge;
  window.onYouTubePlayerReady = onYouTubePlayerReady;
  window.handleKaraokeTimeUpdate = handleKaraokeTimeUpdate;
  window.updateKaraokeSync = handleKaraokeTimeUpdate;
  window.lyricsOffset = window.lyricsOffset !== undefined ? window.lyricsOffset : -0.6;
  window.adjustLyricsOffset = window.adjustLyricsOffset;
  window.syncStanzaHere = window.syncStanzaHere;
  window.applyAutoIntroOffset = window.applyAutoIntroOffset;
  window.updateLyricsOffsetUI = window.updateLyricsOffsetUI;
  window.getMasterPlaybackTime = getMasterPlaybackTime;
  window.pingYouTubeIframeListening = pingYouTubeIframeListening;
  window.ytMasterState = ytMasterState;

  // Vigilancia estricta del portal de música: al salir o cerrar, pausar loops y liberar 100% de CPU
  if (typeof document !== 'undefined') {
    const attachMusicViewObserver = () => {
      const musicView = document.getElementById('view-music');
      if (musicView && typeof MutationObserver !== 'undefined' && !musicView._hasKaraokeObserver) {
        musicView._hasKaraokeObserver = true;
        const observer = new MutationObserver(() => {
          const isHidden = musicView.classList.contains('hidden') ||
            musicView.style.display === 'none' ||
            musicView.style.visibility === 'hidden';
          if (isHidden) {
            if (KaraokeSyncEngine && typeof KaraokeSyncEngine.stop === 'function') {
              KaraokeSyncEngine.stop();
            }
            if (typeof stopMusicKaraokeSync === 'function') {
              stopMusicKaraokeSync();
            }
          }
        });
        observer.observe(musicView, { attributes: true, attributeFilter: ['class', 'style'] });
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachMusicViewObserver);
    } else {
      attachMusicViewObserver();
    }
  }
})();

// Función unificada de parada en window (Pausa Instantánea 0ms y Cero Audio Residual)
window.stopAllAudioAndTimers = function() {
  window._isHoloStagePlaying = false;
  window._userInitiatedMusicPlayback = false;
  if (window.KaraokeSyncEngine && typeof window.KaraokeSyncEngine.stop === 'function') {
    try { window.KaraokeSyncEngine.stop(); } catch (_) {}
  }
  if (typeof window.syncPauseAllMusicPlayers === 'function') {
    try { window.syncPauseAllMusicPlayers(); } catch(e){}
  }
  if (window.ytMusicPlayer && typeof window.ytMusicPlayer.pauseVideo === 'function') {
    try { window.ytMusicPlayer.pauseVideo(); } catch(e){}
  }
  if (typeof window.stopMusicKaraokeSync === 'function') {
    try { window.stopMusicKaraokeSync(); } catch(e){}
  }
  if (window.karaokeInterval) { clearInterval(window.karaokeInterval); window.karaokeInterval = null; }
  if (window.karaokeRaf) { cancelAnimationFrame(window.karaokeRaf); window.karaokeRaf = null; }
  if (window._karaokePlaybackTimer) { clearInterval(window._karaokePlaybackTimer); window._karaokePlaybackTimer = null; }
  document.querySelectorAll('audio, video').forEach(media => {
    try { media.pause(); } catch(e){}
  });
  if (window.ytPlayer && typeof window.ytPlayer.pauseVideo === 'function') {
    try { window.ytPlayer.pauseVideo(); } catch(e){}
  }
  if (window._holoYtPlayer && typeof window._holoYtPlayer.pauseVideo === 'function') {
    try { window._holoYtPlayer.pauseVideo(); } catch(e){}
  }
  document.querySelectorAll('iframe').forEach(ifr => {
    try {
      if (ifr.contentWindow) {
        ifr.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    } catch(e){}
  });
};

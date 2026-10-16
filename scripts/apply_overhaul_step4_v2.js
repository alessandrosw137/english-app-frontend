const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('Applying Overhaul Step 4: Music Session with YouTube Search & Expanded Catalogue...');

// 1. EXPANDIR EL CATÁLOGO DE CANCIONES CON ADELE, COLDPLAY, QUEEN, IMAGINE DRAGONS, ED SHEERAN, THE BEATLES, ETC.
const expandedTracks = [
  {
    id: "rolling_in_the_deep",
    title: "Rolling in the Deep",
    artist: "Adele",
    genre: "Pop Soul",
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
    genre: "Alt Rock",
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
      "seas": { ipa: "/siːz/", es: "Mares / Océanos", phrasal: "At sea", phrasalEs: "Estar desorientado / confuso", phrasalEx: "I was completely at sea during the first grammar class." },
      "sweep": { ipa: "/swiːp/", es: "Barrer / Arrastrar", phrasal: "Sweep away", phrasalEs: "Arrasar o dejarse llevar por la emoción", phrasalEx: "The crowd was swept away by the melody." },
      "dice": { ipa: "/daɪs/", es: "Dados de azar", phrasal: "No dice", phrasalEs: "Sin suerte / De ninguna manera", phrasalEx: "I asked for an extension, but no dice." },
      "fear": { ipa: "/fɪr/", es: "Miedo / Temor", phrasal: "Fear for", phrasalEs: "Temer por el bienestar de alguien", phrasalEx: "They feared for the safety of the lost travelers." },
      "castles": { ipa: "/ˈkæs.əlz/", es: "Castillos / Fortalezas", phrasal: "Build castles in the air", phrasalEs: "Hacer castillos en el aire / soñar despierto", phrasalEx: "Stop building castles in the air and start practicing." },
      "pillars": { ipa: "/ˈpɪl.ɚz/", es: "Pilares / Columnas fundamentales", phrasal: "Stand by", phrasalEs: "Respaldar o apoyar incondicionalmente", phrasalEx: "His dedication is the pillar that stood by the team." }
    }
  },
  {
    id: "dont_stop_me_now",
    title: "Don't Stop Me Now",
    artist: "Queen",
    genre: "Classic Rock",
    youtubeId: "HgzGwKwLmgM",
    duration: "3:30",
    lyrics: [
      { time: 7,  text: "Tonight I'm gonna have myself a real good time" },
      { time: 13, text: "I feel alive and the world I'll turn it inside out, yeah" },
      { time: 19, text: "I'm floating around in ecstasy, so don't stop me now" },
      { time: 27, text: "Don't stop me 'cause I'm having a good time, having a good time" },
      { time: 33, text: "I'm a shooting star leaping through the sky like a tiger" },
      { time: 40, text: "Defying the laws of gravity" },
      { time: 43, text: "I'm a racing car passing by like Lady Godiva" },
      { time: 47, text: "I'm gonna go, go, go, there's no stopping me!" }
    ],
    dictionary: {
      "stop": { ipa: "/stɑːp/", es: "Detener / Frenar", phrasal: "Stop by", phrasalEs: "Pasar a visitar brevemente", phrasalEx: "Feel free to stop by my office anytime." },
      "alive": { ipa: "/əˈlaɪv/", es: "Vivo / Lleno de energía", phrasal: "Come alive", phrasalEs: "Cobrar vida o animarse", phrasalEx: "The festival truly came alive at dusk." },
      "floating": { ipa: "/ˈfloʊ.tɪŋ/", es: "Flotando suavemente", phrasal: "Float around", phrasalEs: "Circular (un rumor o una idea)", phrasalEx: "Several interesting ideas are floating around." },
      "shooting": { ipa: "/ˈʃuː.tɪŋ/", es: "Disparando / Fugaz", phrasal: "Shoot for", phrasalEs: "Aspirar a una meta elevada", phrasalEx: "Always shoot for the top TOEFL band." },
      "defying": { ipa: "/dɪˈfaɪ.ɪŋ/", es: "Desafiando / Retando", phrasal: "Stand up to", phrasalEs: "Hacer frente valientemente", phrasalEx: "He stood up to all academic challenges." },
      "gravity": { ipa: "/ˈɡræv.ə.t̬i/", es: "Gravedad / Seriedad", phrasal: "Weigh down", phrasalEs: "Agobiar o pesar con fuerza", phrasalEx: "Do not let stress weigh you down." }
    }
  },
  {
    id: "believer",
    title: "Believer",
    artist: "Imagine Dragons",
    genre: "Indie Rock",
    youtubeId: "7wtfhZwyrcc",
    duration: "3:24",
    lyrics: [
      { time: 8,  text: "First things first: I'ma say all the words inside my head" },
      { time: 13, text: "I'm fired up and tired of the way that things have been, oh-ooh" },
      { time: 19, text: "Second thing second: Don't you tell me what you think that I could be" },
      { time: 26, text: "I'm the one at the sail, I'm the master of my sea, oh-ooh" },
      { time: 33, text: "I was broken from a young age" },
      { time: 36, text: "Taking my sulking to the masses" },
      { time: 40, text: "Writing my poems for the few that look at me" },
      { time: 44, text: "Pain! You made me a, you made me a believer, believer!" }
    ],
    dictionary: {
      "believer": { ipa: "/bɪˈliː.vɚ/", es: "Creyente / Persona con fe y convicción", phrasal: "Believe in", phrasalEs: "Tener fe en las capacidades de alguien", phrasalEx: "I strongly believe in your learning progress." },
      "words": { ipa: "/wɝːdz/", es: "Palabras / Vocabulario", phrasal: "Put into words", phrasalEs: "Expresar verbalmente con claridad", phrasalEx: "It is hard to put this joy into words." },
      "fired": { ipa: "/faɪrd/", es: "Entusiasmado / Con energía", phrasal: "Fire up", phrasalEs: "Encender los motores / motivar al equipo", phrasalEx: "The coach fired up the team before the match." },
      "master": { ipa: "/ˈmæs.tɚ/", es: "Amo / Maestro / Dominador", phrasal: "Master of", phrasalEs: "Dueño y responsable de su destino", phrasalEx: "You are the master of your own study routine." },
      "broken": { ipa: "/ˈbroʊ.kən/", es: "Roto / Quebrantado", phrasal: "Break down", phrasalEs: "Desglosar en partes sencillas", phrasalEx: "Let's break down this complex sentence." },
      "masses": { ipa: "/ˈmæs.ɪz/", es: "Las masas / La multitud", phrasal: "Stand out", phrasalEs: "Destacar entre la multitud", phrasalEx: "Consistent study makes you stand out." }
    }
  },
  {
    id: "shape_of_you",
    title: "Shape of You",
    artist: "Ed Sheeran",
    genre: "Pop Hit",
    youtubeId: "JGwWNGJdvx8",
    duration: "3:53",
    lyrics: [
      { time: 9,  text: "The club isn't the best place to find a lover" },
      { time: 13, text: "So the bar is where I go" },
      { time: 15, text: "Me and my friends at the table doing shots" },
      { time: 18, text: "Drinking fast and then we talk slow" },
      { time: 23, text: "Come over and start up a conversation with just me" },
      { time: 27, text: "And trust me I'll give it a chance now" },
      { time: 31, text: "Take my hand, stop, put Van the Man on the jukebox" },
      { time: 36, text: "And then we start to dance, and now I'm singing like" },
      { time: 41, text: "Girl, you know I want your love" },
      { time: 45, text: "Your love was handmade for somebody like me" },
      { time: 49, text: "I'm in love with the shape of you" },
      { time: 54, text: "We push and pull like a magnet do" }
    ],
    dictionary: {
      "shape": { ipa: "/ʃeɪp/", es: "Forma / Figura", phrasal: "Shape up", phrasalEs: "Progresar o mejorar favorablemente", phrasalEx: "Your English pronunciation is really shaping up." },
      "start": { ipa: "/stɑːrt/", es: "Iniciar / Comenzar", phrasal: "Start up", phrasalEs: "Poner en marcha un diálogo o negocio", phrasalEx: "Don't hesitate to start up a conversation in English." },
      "trust": { ipa: "/trʌst/", es: "Confianza / Creer en", phrasal: "Trust in", phrasalEs: "Depositar la fe o confianza", phrasalEx: "Trust in your daily vocabulary practice." },
      "chance": { ipa: "/tʃæns/", es: "Oportunidad / Ocasión", phrasal: "Chance upon", phrasalEs: "Toparse casualmente con algo", phrasalEx: "I chanced upon an excellent English article yesterday." },
      "push": { ipa: "/pʊʃ/", es: "Empujar / Esforzarse", phrasal: "Push forward", phrasalEs: "Avanzar con determinación", phrasalEx: "Always push forward even when grammar seems tough." }
    }
  },
  {
    id: "let_it_be",
    title: "Let It Be",
    artist: "The Beatles",
    genre: "Classic Rock",
    youtubeId: "QDYfEBY9NM4",
    duration: "4:03",
    lyrics: [
      { time: 11, text: "When I find myself in times of trouble" },
      { time: 16, text: "Mother Mary comes to me" },
      { time: 20, text: "Speaking words of wisdom: Let it be" },
      { time: 28, text: "And in my hour of darkness she is standing right in front of me" },
      { time: 36, text: "Speaking words of wisdom: Let it be" },
      { time: 45, text: "Let it be, let it be, let it be, let it be" },
      { time: 54, text: "Whisper words of wisdom: Let it be" },
      { time: 63, text: "And when the broken hearted people living in the world agree" },
      { time: 71, text: "There will be an answer: Let it be" }
    ],
    dictionary: {
      "trouble": { ipa: "/ˈtrʌb.əl/", es: "Problemas / Dificultades", phrasal: "Run into trouble", phrasalEs: "Toparse con contratiempos", phrasalEx: "Ask the tutor if you run into trouble with irregular verbs." },
      "wisdom": { ipa: "/ˈwɪz.dəm/", es: "Sabiduría / Buen juicio", phrasal: "Pass down", phrasalEs: "Transmitir conocimientos de generación en generación", phrasalEx: "Timeless wisdom is passed down through literature." },
      "darkness": { ipa: "/ˈdɑːrk.nəs/", es: "Oscuridad / Momento adverso", phrasal: "Clear up", phrasalEs: "Aclararse o disiparse la confusión", phrasalEx: "The linguistic doubts will clear up after reviewing." },
      "whisper": { ipa: "/ˈwɪs.pɚ/", es: "Susurrar / Hablar en voz baja", phrasal: "Whisper away", phrasalEs: "Compartir secretos con suavidad", phrasalEx: "She whispered words of encouragement before the TOEFL exam." },
      "answer": { ipa: "/ˈæn.sɚ/", es: "Respuesta / Solución", phrasal: "Answer for", phrasalEs: "Hacerse responsable de algo", phrasalEx: "Each student answers for their own practice consistency." }
    }
  },
  {
    id: "do_i_wanna_know",
    title: "Do I Wanna Know?",
    artist: "Arctic Monkeys",
    genre: "Indie Rock",
    youtubeId: "bpOSxM0rNPM",
    duration: "4:25",
    lyrics: [
      { time: 18, text: "Have you got colour in your cheeks?" },
      { time: 22, text: "Do you ever get that fear that you can't shift the type" },
      { time: 27, text: "That sticks around like summat in your teeth?" },
      { time: 31, text: "Are there some aces up your sleeve?" },
      { time: 35, text: "Have you no idea that you're in deep?" },
      { time: 40, text: "I dreamt about you nearly every night this week" },
      { time: 44, text: "How many secrets can you keep?" },
      { time: 48, text: "Crawling back to you" }
    ],
    dictionary: {
      "colour": { ipa: "/ˈkʌl.ɚ/", es: "Color / Vitalidad", phrasal: "Colour up", phrasalEs: "Sonrojarse por emoción", phrasalEx: "He coloured up when the teacher praised his English speech." },
      "shift": { ipa: "/ʃɪft/", es: "Cambiar / Mover", phrasal: "Shift away", phrasalEs: "Alejarse o cambiar de enfoque", phrasalEx: "Shift away from passive memorization to active speaking." },
      "sticks": { ipa: "/stɪks/", es: "Se adhiere / Permanece", phrasal: "Stick around", phrasalEs: "Quedarse en un lugar un rato más", phrasalEx: "Please stick around after class for extra listening practice." },
      "aces": { ipa: "/ˈeɪ.sɪz/", es: "Ases / Ventajas ocultas", phrasal: "Ace in the hole", phrasalEs: "Carta de triunfo reservada", phrasalEx: "Phonetic training is your ace in the hole for TOEFL." },
      "secrets": { ipa: "/ˈsiː.krəts/", es: "Secretos", phrasal: "Keep to oneself", phrasalEs: "Guardarse algo en secreto", phrasalEx: "She kept the exam results to herself until dinner." }
    }
  },
  {
    id: "counting_stars",
    title: "Counting Stars",
    artist: "OneRepublic",
    genre: "Pop Rock",
    youtubeId: "hT_nvWreIhg",
    duration: "4:17",
    lyrics: [
      { time: 10, text: "Lately I've been, I've been losing sleep" },
      { time: 15, text: "Dreaming about the things that we could be" },
      { time: 19, text: "Baby I've been, I've been praying hard" },
      { time: 24, text: "Said no more counting dollars, we'll be counting stars" },
      { time: 32, text: "I see this life like a swinging vine" },
      { time: 36, text: "Swing my heart across the line" },
      { time: 41, text: "In my face is flashing signs" },
      { time: 45, text: "Seek it out and ye shall find" }
    ],
    dictionary: {
      "counting": { ipa: "/ˈkaʊn.tɪŋ/", es: "Contando / Enumerando", phrasal: "Count on", phrasalEs: "Confiar o depender de alguien", phrasalEx: "You can always count on our learning assistant." },
      "losing": { ipa: "/ˈluː.zɪŋ/", es: "Perdiendo", phrasal: "Lose sleep over", phrasalEs: "Preocuparse en exceso por algo", phrasalEx: "Don't lose sleep over small grammar errors; keep practicing." },
      "dreaming": { ipa: "/ˈdriː.mɪŋ/", es: "Soñando", phrasal: "Dream up", phrasalEs: "Idear o inventar algo creativo", phrasalEx: "He dreamed up a fun way to memorize irregular verbs." },
      "swing": { ipa: "/swɪŋ/", es: "Balancear / Oscilar", phrasal: "Swing by", phrasalEs: "Hacer una visita corta", phrasalEx: "Swing by the library to pick up the audio CD." },
      "seek": { ipa: "/siːk/", es: "Buscar con empeño", phrasal: "Seek out", phrasalEs: "Buscar activamente hasta encontrar", phrasalEx: "Seek out English speakers to practice conversational skills." }
    }
  }
];

const trackStartMarker = 'const MUSIC_SESSION_TRACKS = [';
const trackEndMarker = 'let currentMusicTrackIdx = 0;';

const tStart = html.indexOf(trackStartMarker);
const tEnd = html.indexOf(trackEndMarker);

if (tStart !== -1 && tEnd !== -1) {
  const newTracksCode = `const MUSIC_SESSION_TRACKS = ${JSON.stringify(expandedTracks, null, 2)};\n\n    `;
  html = html.substring(0, tStart) + newTracksCode + html.substring(tEnd);
  console.log('✅ MUSIC_SESSION_TRACKS actualizado con 8 canciones de Adele, Coldplay, Queen, Imagine Dragons, Ed Sheeran, The Beatles, Arctic Monkeys y OneRepublic.');
} else {
  console.warn('⚠️ No se pudo localizar el bloque MUSIC_SESSION_TRACKS.');
}

// 2. ACTUALIZAR EL HTML DE view-medialab PARA INCLUIR EL BUSCADOR FUNCIONAL EN LA PARTE SUPERIOR
const oldMediaLabHeaderRegex = /<!-- Encabezado de Music Session -->[\s\S]*?<!-- Selector de Canciones Populares -->[\s\S]*?<div class="w-full grid grid-cols-2 sm:grid-cols-4 gap-2\.5 sm:gap-3 mb-6">[\s\S]*?<\/div>/;

const newMediaLabHeader = `<!-- Encabezado de Music Session -->
      <div class="w-full mb-5">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Music Session: Laboratorio de Ritmo y Letras</h1>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">Aprende inglés cantando: busca tus canciones favoritas, pega cualquier enlace de YouTube o selecciona éxitos clásicos con karaoke interactivo en tiempo real.</p>
      </div>

      <!-- Buscador Funcional de Canciones & YouTube (Requisito 4) -->
      <div class="w-full mb-6 p-4 rounded-3xl bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md shadow-lg shadow-cyan-950/30 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            Buscador de Canciones & YouTube
          </span>
          <span class="text-[11px] font-mono text-slate-400">Pega un enlace de YouTube o escribe un artista</span>
        </div>
        <div class="flex flex-col sm:flex-row gap-2.5">
          <div class="relative flex-1">
            <input type="text" id="musicSearchInput" oninput="handleMusicSearchInput(this.value)" placeholder="Escribe el nombre de la canción/artista o pega una URL de YouTube..." class="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition font-medium">
          </div>
          <button onclick="handleCustomYouTubeLoad()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-md active:scale-95">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            <span>Cargar Video</span>
          </button>
        </div>
      </div>

      <!-- Selector Dinámico de Canciones (Catálogo Pop, Rock, Indie) -->
      <div id="musicTrackButtonsContainer" class="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
        <!-- Generado dinámicamente -->
      </div>`;

if (oldMediaLabHeaderRegex.test(html)) {
  html = html.replace(oldMediaLabHeaderRegex, newMediaLabHeader);
  console.log('✅ HTML de view-medialab actualizado con el Buscador de YouTube en la parte superior y contenedor dinámico de pistas.');
} else {
  console.warn('⚠️ No se pudo emparejar oldMediaLabHeaderRegex.');
}

// 3. ACTUALIZAR LAS FUNCIONES JS DE MUSIC SESSION (renderMusicTrackButtons, handleMusicSearchInput, handleCustomYouTubeLoad, inspectMusicWord)
const oldSelectMusicTrackRegex = /function initMusicSessionModule\(\) \{[\s\S]*?function inspectMusicWord\(cleanWord, rawWord, event\) \{/;

const newMusicSessionLogic = `function initMusicSessionModule() {
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
      const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
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

      // Agregar a la primera posición o actualizar
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

      renderMusicTrackButtons(document.getElementById("musicSearchInput") ? document.getElementById("musicSearchInput").value : '');

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

    function inspectMusicWord(cleanWord, rawWord, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      // Detener la reproducción al tocar la palabra para estudiar
      stopMusicPlayback();`;

if (oldSelectMusicTrackRegex.test(html)) {
  html = html.replace(oldSelectMusicTrackRegex, newMusicSessionLogic);
  console.log('✅ Funciones de Music Session actualizadas con buscador en tiempo real, extractor de YouTube ID e inspección de palabras.');
} else {
  console.warn('⚠️ No se pudo emparejar oldSelectMusicTrackRegex.');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Step 4 applied successfully.');

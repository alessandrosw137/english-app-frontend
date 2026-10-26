const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. UPDATE STORY SELECTOR TABS IN HTML TO 4 CLASSIC STORIES & ADD PDF BUTTON + THEMATIC ILLUSTRATION
const oldStoryTabsRegex = /<!-- Selector de Lecturas por Nivel -->[\s\S]*?<!-- Área de Lectura Activa -->[\s\S]*?<!-- Botón Narrar con Resaltado Sincronizado -->/;

const newStoryTabsHtml = `<!-- Selector de Lecturas Clásicas Reales -->
      <div class="w-full mb-6">
        <div class="text-left mb-3">
          <h2 class="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">Biblioteca de Cuentos Clásicos Infantiles</h2>
          <p class="text-xs text-slate-400 mt-0.5">Lectura bilingüe estructurada, ilustraciones temáticas, práctica de pronunciación con Web Speech API y glosario interactivo.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
        </div>
      </div>

      <!-- Área de Lectura Activa -->
      <div id="storyActiveContainer" class="w-full bg-[#1e293b] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        
        <!-- Ilustración Temática Nítida en el Encabezado -->
        <div id="storyThematicIllustration" class="w-full h-40 sm:h-48 rounded-2xl mb-6 overflow-hidden relative flex items-center justify-center border border-slate-700/80 shadow-md">
          <!-- Renderizado dinámico de la ilustración del cuento -->
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span id="storyActiveLevel" class="text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-md font-bold">Relato Clásico</span>
              <span id="storyActiveCategory" class="text-[11px] font-mono text-slate-400">Literatura Infantil</span>
            </div>
            <h2 id="storyActiveTitle" class="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">The Three Little Pigs</h2>
          </div>
          <div class="flex items-center flex-wrap gap-2">
            <!-- Botón Descargar PDF Imprimible (Wilberth Alessandro Molina Cutz) -->
            <button onclick="downloadStoryPdf()" class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer shadow-sm" title="Descargar versión imprimible en PDF">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span>Descargar PDF</span>
            </button>
            <!-- Botón Narrar con Resaltado Sincronizado -->`;

if (oldStoryTabsRegex.test(html)) {
  html = html.replace(oldStoryTabsRegex, newStoryTabsHtml);
  console.log('Successfully updated story tabs HTML with 4 stories, illustration container, and PDF button!');
} else {
  console.warn('Could not match oldStoryTabsRegex');
}

// 2. REPLACE STORIES_DATA WITH THE 4 REAL CLASSIC TALES
const oldStoriesDataRegex = /const STORIES_DATA = \[[\s\S]*?\n    \/\/\s*---\s*SELECT STORY\s*---/;

const newStoriesData = `const STORIES_DATA = [
      {
        id: "three-little-pigs",
        title: "The Three Little Pigs",
        titleEs: "Los tres cerditos",
        level: "Nivel A2",
        category: "Fábula Clásica",
        illustrationSvg: \`<div class="w-full h-full bg-gradient-to-r from-amber-900/60 via-slate-900 to-emerald-950/60 flex items-center justify-between px-6 sm:px-12 relative overflow-hidden">
          <div class="z-10">
            <span class="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block mb-1">Cuento Clásico Infantil</span>
            <h3 class="text-xl sm:text-2xl font-black text-white">The Three Little Pigs</h3>
            <p class="text-xs text-slate-300 mt-1 max-w-sm">"I'll huff, and I'll puff, and I'll blow your house in!"</p>
          </div>
          <div class="text-5xl sm:text-7xl opacity-90 select-none z-10 flex gap-2">
            <span>🐷</span><span>🐺</span><span>🧱</span>
          </div>
          <div class="absolute -right-8 -bottom-8 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl"></div>
        </div>\`,
        paragraphs: [
          {
            en: "Once upon a time, three little pigs left their cozy family home to explore the wide world and build their own houses.",
            es: "Érase una vez, tres cerditos dejaron su acogedor hogar familiar para explorar el ancho mundo y construir sus propias casas.",
            sentences: [
              "Once upon a time, three little pigs left their cozy family home to explore the wide world and build their own houses."
            ]
          },
          {
            en: "The first little pig was impatient and quickly built a simple house made of dry straw so he could play right away.",
            es: "El primer cerdito era impaciente y rápidamente construyó una casa sencilla hecha de paja seca para poder jugar de inmediato.",
            sentences: [
              "The first little pig was impatient and quickly built a simple house made of dry straw so he could play right away."
            ]
          },
          {
            en: "The second little pig gathered tree branches and built a wooden stick house, which was slightly stronger than straw.",
            es: "El segundo cerdito recolectó ramas de árboles y construyó una casa de madera, la cual era un poco más fuerte que la de paja.",
            sentences: [
              "The second little pig gathered tree branches and built a wooden stick house, which was slightly stronger than straw."
            ]
          },
          {
            en: "The third little pig worked with patience and determination, laying strong red bricks and cement to withstand any storm.",
            es: "El tercer cerdito trabajó con paciencia y determinación, colocando fuertes ladrillos rojos y cemento para soportar cualquier tormenta.",
            sentences: [
              "The third little pig worked with patience and determination, laying strong red bricks and cement to withstand any storm."
            ]
          },
          {
            en: "Soon, a big bad wolf approached the straw house. He huffed and puffed and easily blew it completely down!",
            es: "Pronto, un lobo feroz se acercó a la casa de paja. ¡Sopló y resopló y fácilmente la derribó por completo!",
            sentences: [
              "Soon, a big bad wolf approached the straw house.",
              "He huffed and puffed and easily blew it completely down!"
            ]
          },
          {
            en: "The terrified pigs took refuge inside the sturdy brick house, where the wolf could never blow the solid walls away.",
            es: "Los cerditos aterrorizados se refugiaron dentro de la robusta casa de ladrillo, donde el lobo jamás pudo derribar las paredes sólidas.",
            sentences: [
              "The terrified pigs took refuge inside the sturdy brick house, where the wolf could never blow the solid walls away."
            ]
          }
        ],
        vocab: [
          { term: "Straw", pron: "/strɔː/", meaning: "Paja seca", pos: "Sustantivo" },
          { term: "Bricks", pron: "/brɪks/", meaning: "Ladrillos de construcción", pos: "Sustantivo" },
          { term: "Sturdy", pron: "/ˈstɜː.di/", meaning: "Robusto / Resistente", pos: "Adjetivo" },
          { term: "Huff and puff", pron: "/hʌf ænd pʌf/", meaning: "Soplar y resoplar con fuerza", pos: "Frase verbal" },
          { term: "Refuge", pron: "/ˈref.juːdʒ/", meaning: "Refugio seguro", pos: "Sustantivo" }
        ],
        speakingPhrases: [
          { en: "The third pig built a sturdy house of bricks.", es: "El tercer cerdito construyó una casa robusta de ladrillos." },
          { en: "He huffed and puffed and blew the house down.", es: "Sopló y resopló y derribó la casa." },
          { en: "The terrified pigs took refuge inside the brick house.", es: "Los cerditos aterrorizados se refugiaron en la casa de ladrillo." }
        ]
      },
      {
        id: "red-riding-hood",
        title: "Little Red Riding Hood",
        titleEs: "Caperucita Roja",
        level: "Nivel A2",
        category: "Cuento Popular",
        illustrationSvg: \`<div class="w-full h-full bg-gradient-to-r from-rose-950/70 via-slate-900 to-red-900/60 flex items-center justify-between px-6 sm:px-12 relative overflow-hidden">
          <div class="z-10">
            <span class="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-bold block mb-1">Cuento Clásico Infantil</span>
            <h3 class="text-xl sm:text-2xl font-black text-white">Little Red Riding Hood</h3>
            <p class="text-xs text-slate-300 mt-1 max-w-sm">"Grandmother, what big teeth you have!"</p>
          </div>
          <div class="text-5xl sm:text-7xl opacity-90 select-none z-10 flex gap-2">
            <span>👧</span><span>🍎</span><span>🌲</span><span>🐺</span>
          </div>
          <div class="absolute -right-8 -bottom-8 w-44 h-44 bg-rose-500/10 rounded-full blur-2xl"></div>
        </div>\`,
        paragraphs: [
          {
            en: "Little Red Riding Hood was a cheerful young girl who always wore a lovely scarlet velvet cloak made by her grandmother.",
            es: "Caperucita Roja era una alegre jovencita que siempre vestía una hermosa capa de terciopelo escarlata hecha por su abuelita.",
            sentences: [
              "Little Red Riding Hood was a cheerful young girl who always wore a lovely scarlet velvet cloak made by her grandmother."
            ]
          },
          {
            en: "One bright morning, her mother packed a wicker basket with fresh bread and herbal tea for her sick grandmother.",
            es: "Una mañana radiante, su madre empacó una canasta de mimbre con pan fresco y té de hierbas para su abuela enferma.",
            sentences: [
              "One bright morning, her mother packed a wicker basket with fresh bread and herbal tea for her sick grandmother."
            ]
          },
          {
            en: "As she walked through the deep woodland, she met a cunning wolf who asked where she was heading with her basket.",
            es: "Mientras caminaba por el frondoso bosque, se encontró con un astuto lobo que le preguntó hacia dónde se dirigía con su cesta.",
            sentences: [
              "As she walked through the deep woodland, she met a cunning wolf who asked where she was heading with her basket."
            ]
          },
          {
            en: "The wolf took a secret shortcut to the grandmother's cottage and disguised himself beneath the flowered bedsheets.",
            es: "El lobo tomó un atajo secreto hacia la cabaña de la abuela y se disfrazó debajo de las sábanas floreadas.",
            sentences: [
              "The wolf took a secret shortcut to the grandmother's cottage and disguised himself beneath the flowered bedsheets."
            ]
          },
          {
            en: "A brave woodsman heard cries for help, dashed into the cottage, and safely rescued the girl and her grandmother.",
            es: "Un valiente leñador escuchó gritos de auxilio, corrió dentro de la cabaña y rescató a salvo a la niña y a su abuela.",
            sentences: [
              "A brave woodsman heard cries for help, dashed into the cottage, and safely rescued the girl and her grandmother."
            ]
          }
        ],
        vocab: [
          { term: "Velvet cloak", pron: "/ˈvel.vɪt kloʊk/", meaning: "Capa de terciopelo", pos: "Sustantivo" },
          { term: "Wicker basket", pron: "/ˈwɪk.ər ˈbæs.kɪt/", meaning: "Canasta de mimbre", pos: "Sustantivo" },
          { term: "Cunning", pron: "/ˈkʌn.ɪŋ/", meaning: "Astuto / Cauteloso", pos: "Adjetivo" },
          { term: "Shortcut", pron: "/ˈʃɔːrt.kʌt/", meaning: "Atajo / Camino corto", pos: "Sustantivo" },
          { term: "Woodsman", pron: "/ˈwʊdz.mən/", meaning: "Leñador del bosque", pos: "Sustantivo" }
        ],
        speakingPhrases: [
          { en: "Little Red Riding Hood wore a lovely scarlet velvet cloak.", es: "Caperucita vestía una hermosa capa de terciopelo escarlata." },
          { en: "The cunning wolf took a secret shortcut through the woods.", es: "El astuto lobo tomó un atajo secreto por el bosque." },
          { en: "A brave woodsman dashed into the cottage to help.", es: "Un valiente leñador corrió hacia la cabaña para ayudar." }
        ]
      },
      {
        id: "goldilocks",
        title: "Goldilocks and the Three Bears",
        titleEs: "Ricitos de Oro y los tres osos",
        level: "Nivel B1",
        category: "Fábula Moral",
        illustrationSvg: \`<div class="w-full h-full bg-gradient-to-r from-amber-950/70 via-slate-900 to-yellow-900/60 flex items-center justify-between px-6 sm:px-12 relative overflow-hidden">
          <div class="z-10">
            <span class="text-[10px] font-mono text-yellow-400 uppercase tracking-widest font-bold block mb-1">Cuento Clásico Infantil</span>
            <h3 class="text-xl sm:text-2xl font-black text-white">Goldilocks and the Three Bears</h3>
            <p class="text-xs text-slate-300 mt-1 max-w-sm">"This porridge is not too hot, and not too cold: it is just right!"</p>
          </div>
          <div class="text-5xl sm:text-7xl opacity-90 select-none z-10 flex gap-2">
            <span>🐻</span><span>🥣</span><span>🪑</span><span>🛏️</span>
          </div>
          <div class="absolute -right-8 -bottom-8 w-44 h-44 bg-yellow-500/10 rounded-full blur-2xl"></div>
        </div>\`,
        paragraphs: [
          {
            en: "Deep inside a peaceful forest lived three brown bears in a warm cottage: Papa Bear, Mama Bear, and tiny Baby Bear.",
            es: "En lo profundo de un bosque apacible vivían tres osos pardos en una cálida cabaña: Papá Oso, Mamá Osa y el pequeño Bebé Oso.",
            sentences: [
              "Deep inside a peaceful forest lived three brown bears in a warm cottage: Papa Bear, Mama Bear, and tiny Baby Bear."
            ]
          },
          {
            en: "Before having breakfast, they prepared three bowls of oats and went for a pleasant stroll while the hot porridge cooled down.",
            es: "Antes de desayunar, prepararon tres tazones de avena y salieron a dar un agradable paseo mientras la avena caliente se enfriaba.",
            sentences: [
              "Before having breakfast, they prepared three bowls of oats and went for a pleasant stroll while the hot porridge cooled down."
            ]
          },
          {
            en: "A playful girl named Goldilocks wandered into the cottage and tasted the porridge from the three ceramic bowls on the table.",
            es: "Una niña juguetona llamada Ricitos de Oro entró a la cabaña y probó la avena de los tres tazones de cerámica sobre la mesa.",
            sentences: [
              "A playful girl named Goldilocks wandered into the cottage and tasted the porridge from the three ceramic bowls on the table."
            ]
          },
          {
            en: "The first bowl was too hot, the second too cold, but Baby Bear's porridge was delicious and just right, so she finished it.",
            es: "El primer tazón estaba demasiado caliente, el segundo muy frío, pero la avena de Bebé Oso estaba deliciosa y perfecta, así que se la terminó.",
            sentences: [
              "The first bowl was too hot, the second too cold, but Baby Bear's porridge was delicious and just right, so she finished it."
            ]
          },
          {
            en: "When the bears returned, Goldilocks awakened from a sound sleep in Baby Bear's soft bed and dashed home through the open window.",
            es: "Cuando los osos regresaron, Ricitos de Oro despertó de un sueño profundo en la suave cama de Bebé Oso y escapó a casa por la ventana abierta.",
            sentences: [
              "When the bears returned, Goldilocks awakened from a sound sleep in Baby Bear's soft bed and dashed home through the open window."
            ]
          }
        ],
        vocab: [
          { term: "Porridge", pron: "/ˈpɔːr.ɪdʒ/", meaning: "Avena cocida / Gachas", pos: "Sustantivo" },
          { term: "Cozy cottage", pron: "/ˈkoʊ.zi ˈkɑː.t̬ɪdʒ/", meaning: "Cabaña acogedora", pos: "Sustantivo compuesto" },
          { term: "Just right", pron: "/dʒʌst raɪt/", meaning: "En su punto exacto", pos: "Frase adverbial" },
          { term: "Pleasant stroll", pron: "/ˈplez.ənt stroʊl/", meaning: "Paseo agradable", pos: "Sustantivo compuesto" },
          { term: "Sound sleep", pron: "/saʊnd sliːp/", meaning: "Sueño profundo", pos: "Sustantivo" }
        ],
        speakingPhrases: [
          { en: "Baby Bear's porridge was delicious and just right.", es: "La avena de Bebé Oso estaba deliciosa y en su punto exacto." },
          { en: "They went for a pleasant stroll in the green forest.", es: "Fueron a dar un agradable paseo por el bosque verde." },
          { en: "Goldilocks awakened and dashed home through the window.", es: "Ricitos de Oro despertó y escapó a casa por la ventana." }
        ]
      },
      {
        id: "tortoise-and-hare",
        title: "The Tortoise and the Hare",
        titleEs: "La liebre y la tortuga",
        level: "Nivel B1",
        category: "Fábula de Esopo",
        illustrationSvg: \`<div class="w-full h-full bg-gradient-to-r from-teal-950/70 via-slate-900 to-emerald-900/60 flex items-center justify-between px-6 sm:px-12 relative overflow-hidden">
          <div class="z-10">
            <span class="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block mb-1">Fábula de Esopo</span>
            <h3 class="text-xl sm:text-2xl font-black text-white">The Tortoise and the Hare</h3>
            <p class="text-xs text-slate-300 mt-1 max-w-sm">"Slow and steady wins the race!"</p>
          </div>
          <div class="text-5xl sm:text-7xl opacity-90 select-none z-10 flex gap-2">
            <span>🐢</span><span>🏁</span><span>🐇</span>
          </div>
          <div class="absolute -right-8 -bottom-8 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl"></div>
        </div>\`,
        paragraphs: [
          {
            en: "A speedy and conceited hare constantly mocked a peaceful tortoise for his slow, heavy footsteps.",
            es: "Una liebre veloz y engreída se burlaba constantemente de una pacífica tortuga por sus pasos lentos y pesados.",
            sentences: [
              "A speedy and conceited hare constantly mocked a peaceful tortoise for his slow, heavy footsteps."
            ]
          },
          {
            en: "Calm and unbothered, the tortoise challenged the arrogant hare to an official five-mile cross-country race.",
            es: "Tranquila y sin inmutarse, la tortuga desafió a la arrogante liebre a una carrera oficial de campo a través de cinco millas.",
            sentences: [
              "Calm and unbothered, the tortoise challenged the arrogant hare to an official five-mile cross-country race."
            ]
          },
          {
            en: "The race began and the hare darted ahead effortlessly, gaining a massive lead within the opening minutes.",
            es: "La carrera comenzó y la liebre salió disparada sin esfuerzo, obteniendo una enorme ventaja en los primeros minutos.",
            sentences: [
              "The race began and the hare darted ahead effortlessly, gaining a massive lead within the opening minutes."
            ]
          },
          {
            en: "Overconfident in his natural speed, the hare decided to take a leisurely nap under the cool shade of a flowering tree.",
            es: "Confiado en exceso de su velocidad natural, la liebre decidió tomar una siesta relajada bajo la fresca sombra de un árbol florido.",
            sentences: [
              "Overconfident in his natural speed, the hare decided to take a leisurely nap under the cool shade of a flowering tree."
            ]
          },
          {
            en: "Meanwhile, the tortoise kept marching step by step with quiet persistence, passing the snoring hare without hesitation.",
            es: "Mientras tanto, la tortuga siguió marchando paso a paso con silenciosa persistencia, pasando a la liebre que roncaba sin vacilar.",
            sentences: [
              "Meanwhile, the tortoise kept marching step by step with quiet persistence, passing the snoring hare without hesitation."
            ]
          },
          {
            en: "When the hare finally opened his eyes, the disciplined tortoise was already stepping across the victory ribbon.",
            es: "Cuando la liebre finalmente abrió los ojos, la disciplinada tortuga ya estaba cruzando la cinta de la victoria.",
            sentences: [
              "When the hare finally opened his eyes, the disciplined tortoise was already stepping across the victory ribbon."
            ]
          }
        ],
        vocab: [
          { term: "Conceited", pron: "/kənˈsiː.t̬ɪd/", meaning: "Engreído / Vanidoso", pos: "Adjetivo" },
          { term: "Persistence", pron: "/pɚˈsɪs.təns/", meaning: "Persistencia / Constancia", pos: "Sustantivo" },
          { term: "Overconfident", pron: "/ˌoʊ.vɚˈkɑːn.fə.dənt/", meaning: "Demasiado confiado", pos: "Adjetivo" },
          { term: "Leisurely nap", pron: "/ˈliː.ʒɚ.li næp/", meaning: "Siesta tranquila", pos: "Sustantivo compuesto" },
          { term: "Slow and steady", pron: "/sloʊ ænd ˈsted.i/", meaning: "Lento pero constante", pos: "Expresión idiomática" }
        ],
        speakingPhrases: [
          { en: "Slow and steady wins the race.", es: "Lento pero constante gana la carrera." },
          { en: "The tortoise marched step by step with quiet persistence.", es: "La tortuga marchó paso a paso con silenciosa persistencia." },
          { en: "The disciplined tortoise crossed the victory ribbon.", es: "La disciplinada tortuga cruzó la cinta de la victoria." }
        ]
      }
    ];

    // --- SELECT STORY ---`;

if (oldStoriesDataRegex.test(html)) {
  html = html.replace(oldStoriesDataRegex, newStoriesData);
  console.log('Successfully replaced STORIES_DATA with the 4 classic tales!');
} else {
  console.warn('Could not match oldStoriesDataRegex');
}

// 3. REFACTOR selectStory() TO RENDER THEMATIC ILLUSTRATION, SPEAKING COACH PER PARAGRAPH, AND TACTILE GLOSSARY
const oldSelectStoryRegex = /function selectStory\(idx\) \{[\s\S]*?updateSavedVocabBadge\(\);\s*\}/;

const newSelectStory = `function selectStory(idx) {
      currentStoryIndex = idx;
      const story = STORIES_DATA[idx];
      if (!story) return;

      stopStoryNarration();

      for (let i = 0; i < STORIES_DATA.length; i++) {
        const tab = document.getElementById(\`storyTab-\${i}\`);
        if (!tab) continue;
        if (i === idx) {
          tab.className = "story-tab-btn text-left p-4 rounded-2xl bg-[#1e293b] border border-emerald-500/60 transition cursor-pointer flex flex-col justify-between shadow-md";
        } else {
          tab.className = "story-tab-btn text-left p-4 rounded-2xl bg-[#1e293b] border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between shadow-sm";
        }
      }

      // Encabezado activo
      document.getElementById("storyActiveTitle").textContent = story.title;
      document.getElementById("storyActiveLevel").textContent = story.level;
      document.getElementById("storyActiveCategory").textContent = story.category;

      // Ilustración temática nítida en el encabezado
      const illContainer = document.getElementById("storyThematicIllustration");
      if (illContainer && story.illustrationSvg) {
        illContainer.innerHTML = story.illustrationSvg;
      }

      // Renderizado de párrafos estructurados con Speaking Coach y botón de traducción
      const pContainer = document.getElementById("storyParagraphsList");
      pContainer.innerHTML = story.paragraphs.map((p, pIdx) => {
        const sentencesHtml = p.sentences.map((sentence, sIdx) => {
          const tokens = sentence.split(/(\\s+|[.,;!?"()]+)/);
          const wordsHtml = tokens.map(token => {
            if (/^[a-zA-Z0-9'-]+$/.test(token)) {
              const clean = token.toLowerCase().replace(/[^a-z0-9]/g, '');
              return \`<span class="story-word cursor-pointer hover:text-emerald-400 hover:underline decoration-emerald-500/50 decoration-1 px-0.5 rounded transition-colors" onclick="openWordCard('\${clean}', event)">\${token}</span>\`;
            } else {
              return token;
            }
          }).join('');
          return \`<span id="story-s-\${pIdx}-\${sIdx}" class="story-sentence transition-all duration-200 rounded px-1">\${wordsHtml}</span>\`;
        }).join(' ');

        return \`
          <div class="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="text-slate-100 font-medium leading-relaxed flex-1 text-sm sm:text-base">
                \${sentencesHtml}
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <!-- Botón Speaking Coach (Práctica de Voz por Párrafo) -->
                <button id="story-voice-btn-\${pIdx}" onclick="startParagraphVoicePractice(\${pIdx})" class="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white text-[11px] font-semibold transition cursor-pointer border border-emerald-500/40 flex items-center gap-1 shadow-sm" title="Práctica de voz en este párrafo">
                  <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                  <span>Practicar</span>
                </button>
                <!-- Botón Alternar Traducción Bilingüe -->
                <button id="story-trans-btn-\${pIdx}" onclick="toggleParagraphTranslation(\${pIdx})" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition cursor-pointer border border-slate-700/60" title="Alternar traducción en español">
                  Traducir
                </button>
              </div>
            </div>

            <!-- Retroalimentación inmediata del Speaking Coach -->
            <div id="story-voice-feedback-\${pIdx}" class="hidden py-1 px-2.5 rounded-lg text-xs font-mono"></div>

            <!-- Traducción Bilingüe al Español -->
            <div id="story-trans-\${pIdx}" class="hidden pt-2 border-t border-slate-800/80 text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              \${p.es}
            </div>
          </div>
        \`;
      }).join('');

      // Vocabulario clave del cuento
      const vContainer = document.getElementById("storyVocabularyList");
      vContainer.innerHTML = story.vocab.map((v) => \`
        <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-100 text-xs">\${v.term}</span>
              <span class="text-[10px] font-mono text-emerald-400">\${v.pron}</span>
            </div>
            <span class="text-[11px] text-slate-400">\${v.meaning}</span>
          </div>
          <button onclick="speakText('\${v.term}')" class="audio-speak-btn p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition shrink-0 cursor-pointer" title="Pronunciación">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          </button>
        </div>
      \`).join('');

      const dotsContainer = document.getElementById("speakingPhraseSelectorDots");
      if (dotsContainer && story.speakingPhrases) {
        dotsContainer.innerHTML = story.speakingPhrases.map((_, pIdx) => \`
          <button onclick="selectSpeakingPhrase(\${pIdx})" class="speaking-phrase-dot \${pIdx === 0 ? 'w-6 h-2 bg-emerald-400' : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'} rounded-full transition-all cursor-pointer" aria-label="Frase \${pIdx + 1}"></button>
        \`).join('');
      }

      selectSpeakingPhrase(0);
      updateSavedVocabBadge();
    }`;

if (oldSelectStoryRegex.test(html)) {
  html = html.replace(oldSelectStoryRegex, newSelectStory);
  console.log('Successfully updated selectStory() with Speaking Coach, illustrations, and bilingual controls!');
} else {
  console.warn('Could not match oldSelectStoryRegex');
}

// 4. ADD FUNCTIONS FOR SPEAKING COACH PER PARAGRAPH & PDF EXPORT
const storyHelpersJs = `
    // ========================================================
    // SPEAKING COACH (WEB SPEECH API) POR PÁRRAFO
    // ========================================================
    let paragraphRecognition = null;

    function startParagraphVoicePractice(pIdx) {
      const story = STORIES_DATA[currentStoryIndex];
      if (!story || !story.paragraphs[pIdx]) return;

      const targetParagraph = story.paragraphs[pIdx].en;
      const btn = document.getElementById(\`story-voice-btn-\${pIdx}\`);
      const feedback = document.getElementById(\`story-voice-feedback-\${pIdx}\`);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        showFloatingToast("Web Speech API no está soportada en este navegador.");
        return;
      }

      if (paragraphRecognition) {
        try { paragraphRecognition.stop(); } catch (e) {}
      }

      paragraphRecognition = new SpeechRecognition();
      paragraphRecognition.lang = 'en-US';
      paragraphRecognition.interimResults = false;
      paragraphRecognition.maxAlternatives = 1;

      if (btn) {
        btn.innerHTML = \`<span class="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block"></span><span>Escuchando...</span>\`;
        btn.className = "px-2.5 py-1 rounded-lg bg-rose-600/30 text-rose-300 text-[11px] font-semibold transition cursor-pointer border border-rose-500/50 flex items-center gap-1 shadow";
      }

      if (feedback) {
        feedback.className = "py-1.5 px-3 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 block";
        feedback.textContent = "🎙️ Di en voz alta la oración en inglés...";
      }

      paragraphRecognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        // Comparación fonético-léxica de tokens
        const targetWords = targetParagraph.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\\s+/).filter(Boolean);
        const spokenWords = spoken.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\\s+/).filter(Boolean);
        
        let matches = 0;
        targetWords.forEach(w => {
          if (spokenWords.includes(w)) matches++;
        });

        const score = Math.min(100, Math.round((matches / Math.max(targetWords.length, 1)) * 100));

        if (feedback) {
          if (score >= 80) {
            feedback.className = "py-1.5 px-3 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-xs font-mono text-emerald-300 font-bold block";
            feedback.textContent = \`🎉 ¡Excelente pronunciación! (\${score}% precisión) - "+25 EXP"\`;
            addUserExp(25);
          } else if (score >= 50) {
            feedback.className = "py-1.5 px-3 rounded-lg bg-amber-950/70 border border-amber-500/50 text-xs font-mono text-amber-300 font-bold block";
            feedback.textContent = \`👍 ¡Buen intento! (\${score}% precisión). Intenta modular más lento. (+10 EXP)\`;
            addUserExp(10);
          } else {
            feedback.className = "py-1.5 px-3 rounded-lg bg-rose-950/70 border border-rose-500/50 text-xs font-mono text-rose-300 block";
            feedback.textContent = \`💡 Precisión: \${score}%. Dijiste: "\${spoken}". Practica escuchando con el audio.\`;
          }
        }
      };

      paragraphRecognition.onerror = (e) => {
        if (feedback) {
          feedback.className = "py-1.5 px-3 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400 block";
          feedback.textContent = "Micrófono cerrado. Intenta nuevamente.";
        }
      };

      paragraphRecognition.onend = () => {
        if (btn) {
          btn.innerHTML = \`<svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg><span>Practicar</span>\`;
          btn.className = "px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white text-[11px] font-semibold transition cursor-pointer border border-emerald-500/40 flex items-center gap-1 shadow-sm";
        }
      };

      try {
        paragraphRecognition.start();
      } catch (err) {
        console.warn('SpeechRecognition start error:', err);
      }
    }

    // ========================================================
    // EXPORTACIÓN A PDF IMPRIMIBLE (WILBERTH ALESSANDRO MOLINA CUTZ)
    // ========================================================
    function downloadStoryPdf() {
      const story = STORIES_DATA[currentStoryIndex];
      if (!story) return;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        showFloatingToast('Permite las ventanas emergentes para generar el PDF imprimible.');
        return;
      }

      const paragraphsHtml = story.paragraphs.map((p, idx) => \`
        <div style="margin-bottom: 16px; padding: 12px; background: #f8fafc; border-left: 4px solid #059669; border-radius: 6px;">
          <p style="font-size: 15px; color: #0f172a; margin: 0 0 6px 0; line-height: 1.6; font-weight: 500;">
            <strong style="color: #059669; margin-right: 6px;">[\${idx + 1}]</strong> \${p.en}
          </p>
          <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.5; font-style: italic;">
            \${p.es}
          </p>
        </div>
      \`).join('');

      const vocabHtml = story.vocab.map(v => \`
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: bold; color: #0f172a;">\${v.term}</td>
          <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-family: monospace; color: #059669;">\${v.pron}</td>
          <td style="padding: 8px 12px; border: 1px solid #cbd5e1; color: #334155;">\${v.meaning}</td>
          <td style="padding: 8px 12px; border: 1px solid #cbd5e1; color: #64748b; font-size: 12px;">\${v.pos}</td>
        </tr>
      \`).join('');

      const docHtml = \`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>\${story.title} - Edición Imprimible</title>
          <style>
            @page { margin: 20mm; size: A4 portrait; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; line-height: 1.5; margin: 0; padding: 0; }
            .header-banner { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .title-area h1 { margin: 0; font-size: 24px; color: #0f172a; }
            .title-area h2 { margin: 4px 0 0 0; font-size: 16px; color: #64748b; font-weight: normal; }
            .author-badge { text-align: right; font-size: 12px; color: #475569; }
            .author-name { font-weight: bold; color: #059669; font-size: 13px; }
            .footer-info { margin-top: 30px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #94a3b8; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
            th { background: #e2e8f0; color: #1e293b; padding: 8px 12px; border: 1px solid #cbd5e1; text-align: left; }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div class="title-area">
              <h1>\${story.title}</h1>
              <h2>\${story.titleEs} (\${story.level})</h2>
            </div>
            <div class="author-badge">
              <span>Colección Oficial de Lectura</span><br>
              Autoría: <span class="author-name">Wilberth Alessandro Molina Cutz</span>
            </div>
          </div>

          <h3 style="font-size: 16px; color: #059669; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Lectura Bilingüe Estructurada</h3>
          \${paragraphsHtml}

          <h3 style="font-size: 16px; color: #059669; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">Glosario y Vocabulario Clave</h3>
          <table>
            <thead>
              <tr>
                <th>Término en Inglés</th>
                <th>Pronunciación</th>
                <th>Significado</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              \${vocabHtml}
            </tbody>
          </table>

          <div class="footer-info">
            Material pedagógico desarrollado por Wilberth Alessandro Molina Cutz &bull; Plataforma Interactiva de Inglés
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      \`;

      printWindow.document.open();
      printWindow.document.write(docHtml);
      printWindow.document.close();
    }
`;

// Insert the new helpers before </script>
const lastScriptIdx = html.lastIndexOf('</script>');
html = html.substring(0, lastScriptIdx) + '\n' + storyHelpersJs + '\n</script>' + html.substring(lastScriptIdx + 9);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Step 4 applied successfully.');

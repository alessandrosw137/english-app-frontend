const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const startIdx = html.indexOf('const STORIES_DATA = [');
if (startIdx === -1) {
  console.error('Could not find const STORIES_DATA = [');
  process.exit(1);
}

// Find the closing ]; of STORIES_DATA
const closeToken = '\n    ];';
const closeIdx = html.indexOf(closeToken, startIdx);
if (closeIdx === -1) {
  console.error('Could not find closing ];');
  process.exit(1);
}

const newStoriesDataCode = `const STORIES_DATA = [
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
    ];`;

html = html.substring(0, startIdx) + newStoriesDataCode + html.substring(closeIdx + closeToken.length);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully replaced STORIES_DATA with the 4 classic stories!');

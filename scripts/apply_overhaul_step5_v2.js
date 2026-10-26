const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('Applying Overhaul Step 5: Cuentos Module (6 Classic Stories, Artistic SVG, No Emojis, PDF & Speaking Coach)...');

// 1. REEMPLAZAR EL SELECTOR ESTÁTICO DE 4 CUENTOS CON EL CONTENEDOR DINÁMICO DE 6 CUENTOS
const oldSelectorStart = '<!-- Selector de Lecturas Clásicas Reales -->';
const oldSelectorEnd = '<!-- Visor Principal del Cuento Activo -->';

const selStartIdx = html.indexOf(oldSelectorStart);
const selEndIdx = html.indexOf(oldSelectorEnd);

if (selStartIdx !== -1 && selEndIdx !== -1) {
  const newSelectorHtml = `<!-- Selector de Lecturas Clásicas Reales (6 Obras Maestras Ilustradas Sin Emojis) -->
      <div class="w-full mb-6">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">Biblioteca Clásica Ilustrada</h2>
            <p class="text-xs text-slate-400 mt-0.5">Colección de 6 relatos clásicos de la literatura universal con narración nativa, modo bilingüe y Speaking Coach con Web Speech API.</p>
          </div>
          <span class="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 shrink-0">
            6 Cuentos Disponibles
          </span>
        </div>
        <div id="storiesSelectorContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <!-- Renderizado dinámicamente sin emojis -->
        </div>
      </div>\n\n      `;

  html = html.substring(0, selStartIdx) + newSelectorHtml + html.substring(selEndIdx);
  console.log('✅ Selector de cuentos actualizado con contenedor dinámico para 6 obras.');
} else {
  console.warn('⚠️ No se pudo localizar el bloque del selector de cuentos.');
}

// 2. ELIMINAR CUALQUIER EMOJI RESTANTE EN LA BARRA SUPERIOR DE view-stories
html = html.replace('<span>🌐 Modo Bilingüe</span>', `<span>
            <svg class="w-3.5 h-3.5 inline-block mr-1 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>Modo Bilingüe
          </span>`);

// 3. DEFINIR EL CATÁLOGO COMPLETO DE 6 CUENTOS CON ILUSTRACIONES ARTÍSTICAS VECTORIALES (CERO EMOJIS)
const storiesCatalogue = [
  {
    id: "three-little-pigs",
    title: "The Three Little Pigs",
    titleEs: "Los tres cerditos",
    level: "Nivel A2",
    category: "Fábula Clásica",
    description: "Tres hermanos constructores frente al astuto lobo del bosque: el triunfo del esfuerzo y la perseverancia.",
    illustrationSvg: `<svg viewBox="0 0 800 240" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pigsGradSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
        <linearGradient id="brickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#7f1d1d"/>
        </linearGradient>
      </defs>
      <rect width="800" height="240" fill="url(#pigsGradSky)"/>
      <circle cx="680" cy="60" r="35" fill="#fef08a" opacity="0.85"/>
      <path d="M 0 240 L 0 170 Q 200 120 400 170 T 800 160 L 800 240 Z" fill="#047857" opacity="0.6"/>
      <path d="M 0 240 L 0 190 Q 250 150 500 190 T 800 185 L 800 240 Z" fill="#065f46"/>
      <!-- Casa de paja -->
      <polygon points="120,200 150,150 180,200" fill="#f59e0b"/>
      <rect x="135" y="175" width="30" height="25" fill="#d97706"/>
      <!-- Casa de madera -->
      <polygon points="260,200 295,140 330,200" fill="#b45309"/>
      <rect x="275" y="165" width="40" height="35" fill="#78350f"/>
      <!-- Casa sólida de ladrillo -->
      <polygon points="430,200 480,130 530,200" fill="#dc2626"/>
      <rect x="445" y="155" width="70" height="45" fill="url(#brickGrad)"/>
      <rect x="470" y="175" width="20" height="25" fill="#facc15"/>
      <rect x="495" y="125" width="12" height="25" fill="#450a0a"/>
      <!-- Árboles y silueta del sendero -->
      <path d="M 380 200 Q 420 220 480 240" stroke="#fef3c7" stroke-width="8" fill="none" opacity="0.4"/>
      <text x="40" y="55" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">OBRA CLÁSICA ILUSTRADA &bull; RELATO 1</text>
      <text x="40" y="90" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="900">The Three Little Pigs</text>
      <text x="40" y="115" fill="#a7f3d0" font-family="sans-serif" font-size="13">"I'll huff, and I'll puff, and I'll blow your house down!"</text>
    </svg>`,
    paragraphs: [
      {
        en: "Once upon a time, three little pigs left their cozy family home to explore the wide world and build their own houses.",
        es: "Érase una vez, tres cerditos dejaron su acogedor hogar familiar para explorar el ancho mundo y construir sus propias casas.",
        sentences: [
          "Once upon a time, three little pigs left their cozy family home to explore the wide world and build their own houses."
        ],
        words: [
          { en: "once", ipa: "/wʌns/", es: "una vez" },
          { en: "cozy", ipa: "/ˈkoʊ.zi/", es: "acogedor" },
          { en: "explore", ipa: "/ɪkˈsplɔːr/", es: "explorar" },
          { en: "houses", ipa: "/ˈhaʊ.zɪz/", es: "casas" }
        ]
      },
      {
        en: "The first little pig built his house out of yellow straw because it was quick and easy, allowing him plenty of time to play.",
        es: "El primer cerdito construyó su casa de paja amarilla porque era rápido y fácil, lo que le dejaba mucho tiempo para jugar.",
        sentences: [
          "The first little pig built his house out of yellow straw because it was quick and easy, allowing him plenty of time to play."
        ],
        words: [
          { en: "straw", ipa: "/strɔː/", es: "paja" },
          { en: "quick", ipa: "/kwɪk/", es: "rápido" },
          { en: "easy", ipa: "/ˈiː.zi/", es: "fácil" },
          { en: "plenty", ipa: "/ˈplen.ti/", es: "abundante" }
        ]
      },
      {
        en: "The second little pig gathered bundles of sticks and twigs from the forest to assemble a modest wooden cabin.",
        es: "El segundo cerdito reunió ramas y palos del bosque para armar una modesta cabaña de madera.",
        sentences: [
          "The second little pig gathered bundles of sticks and twigs from the forest to assemble a modest wooden cabin."
        ],
        words: [
          { en: "gathered", ipa: "/ˈɡæð.ɚd/", es: "reunió" },
          { en: "sticks", ipa: "/stɪks/", es: "palos / ramas" },
          { en: "wooden", ipa: "/ˈwʊd.ən/", es: "de madera" }
        ]
      },
      {
        en: "The third little pig worked diligently from sunrise to sunset, laying heavy red bricks and strong mortar with unwavering patience.",
        es: "El tercer cerdito trabajó diligentemente desde el amanecer hasta el anochecer, colocando pesados ladrillos rojos y cemento fuerte con paciencia inquebrantable.",
        sentences: [
          "The third little pig worked diligently from sunrise to sunset, laying heavy red bricks and strong mortar with unwavering patience."
        ],
        words: [
          { en: "diligently", ipa: "/ˈdɪl.ə.dʒənt.li/", es: "diligentemente" },
          { en: "bricks", ipa: "/brɪks/", es: "ladrillos" },
          { en: "mortar", ipa: "/ˈmɔːr.tɚ/", es: "mortero / cemento" },
          { en: "patience", ipa: "/ˈpeɪ.ʃəns/", es: "paciencia" }
        ]
      },
      {
        en: "When the big hungry wolf blew away the straw and stick houses, both brothers found safe shelter in the unbreakable brick fortress.",
        es: "Cuando el gran lobo hambriento derribó las casas de paja y ramas, ambos hermanos hallaron refugio seguro en la inquebrantable fortaleza de ladrillos.",
        sentences: [
          "When the big hungry wolf blew away the straw and stick houses, both brothers found safe shelter in the unbreakable brick fortress."
        ],
        words: [
          { en: "hungry", ipa: "/ˈhʌŋ.ɡri/", es: "hambriento" },
          { en: "shelter", ipa: "/ˈʃel.tɚ/", es: "refugio" },
          { en: "unbreakable", ipa: "/ʌnˈbreɪ.kə.bəl/", es: "inquebrantable" },
          { en: "fortress", ipa: "/ˈfɔːr.trəs/", es: "fortaleza" }
        ]
      }
    ]
  },
  {
    id: "little-red-riding-hood",
    title: "Little Red Riding Hood",
    titleEs: "Caperucita Roja",
    level: "Nivel A2",
    category: "Cuento Popular",
    description: "Una joven con capa escarlata viaja por el bosque encantado hacia la casa de su abuela, aprendiendo la prudencia.",
    illustrationSvg: `<svg viewBox="0 0 800 240" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hoodGradSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="800" height="240" fill="url(#hoodGradSky)"/>
      <circle cx="120" cy="65" r="40" fill="#f8fafc" opacity="0.9"/>
      <!-- Siluetas de pinos de bosque profundo -->
      <polygon points="200,240 230,120 260,240" fill="#064e3b" opacity="0.8"/>
      <polygon points="280,240 315,90 350,240" fill="#065f46" opacity="0.9"/>
      <polygon points="360,240 390,130 420,240" fill="#047857"/>
      <polygon points="520,240 560,80 600,240" fill="#064e3b"/>
      <polygon points="620,240 655,110 690,240" fill="#065f46"/>
      <!-- Sendero dorado de tierra -->
      <path d="M 0 240 Q 300 200 450 240" stroke="#d97706" stroke-width="26" fill="none" opacity="0.7"/>
      <!-- Capucha roja estilizada -->
      <polygon points="450,190 465,160 480,190" fill="#ef4444"/>
      <circle cx="465" cy="155" r="8" fill="#fca5a5"/>
      <text x="40" y="55" fill="#f87171" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">OBRA CLÁSICA ILUSTRADA &bull; RELATO 2</text>
      <text x="40" y="90" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="900">Little Red Riding Hood</text>
      <text x="40" y="115" fill="#fecaca" font-family="sans-serif" font-size="13">"Grandmother, what big eyes you have!"</text>
    </svg>`,
    paragraphs: [
      {
        en: "Little Red Riding Hood lived in a cheerful cottage at the edge of a deep, whispering forest.",
        es: "Caperucita Roja vivía en una alegre cabaña al borde de un profundo y susurrante bosque.",
        sentences: [
          "Little Red Riding Hood lived in a cheerful cottage at the edge of a deep, whispering forest."
        ],
        words: [
          { en: "cheerful", ipa: "/ˈtʃɪr.fəl/", es: "alegre" },
          { en: "cottage", ipa: "/ˈkɑː.t̬ɪdʒ/", es: "cabaña" },
          { en: "edge", ipa: "/edʒ/", es: "borde" },
          { en: "whispering", ipa: "/ˈwɪs.pɚ.ɪŋ/", es: "susurrante" }
        ]
      },
      {
        en: "Her loving mother packed a wicker basket with fresh bread and herbal honey for her sick grandmother.",
        es: "Su amorosa madre empacó una canasta de mimbre con pan fresco y miel de hierbas para su abuela enferma.",
        sentences: [
          "Her loving mother packed a wicker basket with fresh bread and herbal honey for her sick grandmother."
        ],
        words: [
          { en: "wicker", ipa: "/ˈwɪk.ɚ/", es: "mimbre" },
          { en: "basket", ipa: "/ˈbæs.kət/", es: "canasta" },
          { en: "herbal", ipa: "/ˈɝː.bəl/", es: "de hierbas" },
          { en: "honey", ipa: "/ˈhʌn.i/", es: "miel" }
        ]
      },
      {
        en: "She promised never to leave the cobblestone path, yet the sweet forest flowers led her into conversation with a sly wolf.",
        es: "Prometió nunca salir del camino empedrado, pero las dulces flores del bosque la llevaron a conversar con un lobo astuto.",
        sentences: [
          "She promised never to leave the cobblestone path, yet the sweet forest flowers led her into conversation with a sly wolf."
        ],
        words: [
          { en: "promised", ipa: "/ˈprɑː.mɪst/", es: "prometió" },
          { en: "cobblestone", ipa: "/ˈkɑː.bəl.stoʊn/", es: "empedrado" },
          { en: "path", ipa: "/pæθ/", es: "sendero" },
          { en: "sly", ipa: "/slaɪ/", es: "astuto / pícaro" }
        ]
      },
      {
        en: "Thanks to a courageous local woodsman, the grandmother and the girl were safely rescued, and the forest became peaceful once more.",
        es: "Gracias a un valiente leñador local, la abuela y la niña fueron rescatadas a salvo, y el bosque volvió a ser pacífico.",
        sentences: [
          "Thanks to a courageous local woodsman, the grandmother and the girl were safely rescued, and the forest became peaceful once more."
        ],
        words: [
          { en: "courageous", ipa: "/kəˈreɪ.dʒəs/", es: "valiente" },
          { en: "woodsman", ipa: "/ˈwʊdz.mən/", es: "leñador" },
          { en: "rescued", ipa: "/ˈres.kjuːd/", es: "rescatada" },
          { en: "peaceful", ipa: "/ˈpiːs.fəl/", es: "pacífico" }
        ]
      }
    ]
  },
  {
    id: "goldilocks-three-bears",
    title: "Goldilocks and the Three Bears",
    titleEs: "Ricitos de Oro y los tres osos",
    level: "Nivel B1",
    category: "Cuento Clásico",
    description: "Una curiosa niña explora la acogedora casa de tres osos en el bosque, descubriendo la medida justa de cada cosa.",
    illustrationSvg: `<svg viewBox="0 0 800 240" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bearsGradSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#451a03"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="800" height="240" fill="url(#bearsGradSky)"/>
      <!-- Casa rústica de madera con chimenea -->
      <polygon points="500,200 580,110 660,200" fill="#78350f"/>
      <rect x="520" y="150" width="120" height="65" fill="#451a03"/>
      <rect x="565" y="170" width="30" height="45" fill="#fbbf24"/>
      <rect x="620" y="100" width="20" height="35" fill="#334155"/>
      <!-- Humo suave de chimenea -->
      <circle cx="630" cy="85" r="10" fill="#e2e8f0" opacity="0.6"/>
      <circle cx="638" cy="65" r="14" fill="#e2e8f0" opacity="0.4"/>
      <!-- Tres tazones humeantes sobre la mesa de madera -->
      <rect x="180" y="195" width="220" height="15" fill="#78350f"/>
      <!-- Tazón grande -->
      <ellipse cx="220" cy="190" rx="24" ry="12" fill="#3b82f6"/>
      <!-- Tazón mediano -->
      <ellipse cx="285" cy="190" rx="18" ry="10" fill="#ef4444"/>
      <!-- Tazón pequeño perfecto -->
      <ellipse cx="340" cy="190" rx="13" ry="8" fill="#10b981"/>
      <text x="40" y="55" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">OBRA CLÁSICA ILUSTRADA &bull; RELATO 3</text>
      <text x="40" y="90" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="900">Goldilocks and the Three Bears</text>
      <text x="40" y="115" fill="#fde68a" font-family="sans-serif" font-size="13">"This porridge is not too hot, not too cold, it's just right!"</text>
    </svg>`,
    paragraphs: [
      {
        en: "Deep inside the peaceful green woods stood a charming wooden home belonging to a family of three brown bears.",
        es: "En lo profundo del bosque verde y pacífico se encontraba una encantadora casa de madera perteneciente a una familia de tres osos pardos.",
        sentences: [
          "Deep inside the peaceful green woods stood a charming wooden home belonging to a family of three brown bears."
        ],
        words: [
          { en: "charming", ipa: "/ˈtʃɑːr.mɪŋ/", es: "encantadora" },
          { en: "belonging", ipa: "/bɪˈlɑːŋ.ɪŋ/", es: "perteneciente" },
          { en: "brown", ipa: "/braʊn/", es: "pardo / marrón" }
        ]
      },
      {
        en: "Before sitting down for breakfast, they stepped out for a morning stroll while their freshly cooked porridge cooled down.",
        es: "Antes de sentarse a desayunar, salieron a dar un paseo matutino mientras su avena recién cocinada se enfriaba.",
        sentences: [
          "Before sitting down for breakfast, they stepped out for a morning stroll while their freshly cooked porridge cooled down."
        ],
        words: [
          { en: "breakfast", ipa: "/ˈbrek.fəst/", es: "desayuno" },
          { en: "stroll", ipa: "/stroʊl/", es: "paseo corto" },
          { en: "porridge", ipa: "/ˈpɔːr.ɪdʒ/", es: "avena cocida" },
          { en: "cooled", ipa: "/kuːld/", es: "se enfrió" }
        ]
      },
      {
        en: "A golden-haired girl named Goldilocks knocked on the open door and curiously tasted the steaming porridge bowls.",
        es: "Una niña de cabellos dorados llamada Ricitos de Oro llamó a la puerta abierta y probó curiosamente los humeantes tazones de avena.",
        sentences: [
          "A golden-haired girl named Goldilocks knocked on the open door and curiously tasted the steaming porridge bowls."
        ],
        words: [
          { en: "knocked", ipa: "/nɑːkt/", es: "llamó / tocó" },
          { en: "curiously", ipa: "/ˈkjʊr.i.əs.li/", es: "con curiosidad" },
          { en: "tasted", ipa: "/ˈteɪ.stɪd/", es: "probó" },
          { en: "bowls", ipa: "/boʊlz/", es: "tazones" }
        ]
      },
      {
        en: "The smallest bowl was neither too hot nor too cold: it was just right, and she ate it all before resting in the baby bed.",
        es: "El tazón más pequeño no estaba ni muy caliente ni muy frío: estaba en su punto justo, y lo comió todo antes de descansar en la cama del bebé.",
        sentences: [
          "The smallest bowl was neither too hot nor too cold: it was just right, and she ate it all before resting in the baby bed."
        ],
        words: [
          { en: "neither", ipa: "/ˈniː.ðɚ/", es: "ni (uno ni otro)" },
          { en: "right", ipa: "/raɪt/", es: "justo / correcto" },
          { en: "resting", ipa: "/ˈres.tɪŋ/", es: "descansando" }
        ]
      }
    ]
  },
  {
    id: "tortoise-and-hare",
    title: "The Tortoise and the Hare",
    titleEs: "La tortuga y la liebre",
    level: "Nivel A2",
    category: "Fábula de Esopo",
    description: "Una célebre competencia donde la constancia paciente derrota a la arrogancia veloz.",
    illustrationSvg: `<svg viewBox="0 0 800 240" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hareGradSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#065f46"/>
        </linearGradient>
      </defs>
      <rect width="800" height="240" fill="url(#hareGradSky)"/>
      <circle cx="720" cy="50" r="32" fill="#fde047" opacity="0.9"/>
      <!-- Colinas de pradera verde -->
      <path d="M 0 240 L 0 160 Q 300 110 600 170 T 800 150 L 800 240 Z" fill="#15803d"/>
      <path d="M 0 240 L 0 190 Q 200 160 500 195 T 800 180 L 800 240 Z" fill="#166534"/>
      <!-- Pista de atletismo / sendero -->
      <path d="M 50 220 Q 400 190 750 230" stroke="#fde68a" stroke-width="18" fill="none" opacity="0.8"/>
      <!-- Línea de meta ajedrezada -->
      <rect x="710" y="195" width="8" height="35" fill="#ffffff"/>
      <rect x="718" y="195" width="8" height="35" fill="#0f172a"/>
      <!-- Tortuga paciente -->
      <ellipse cx="620" cy="215" rx="20" ry="12" fill="#047857"/>
      <circle cx="642" cy="214" r="6" fill="#10b981"/>
      <text x="40" y="55" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">OBRA CLÁSICA ILUSTRADA &bull; RELATO 4</text>
      <text x="40" y="90" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="900">The Tortoise and the Hare</text>
      <text x="40" y="115" fill="#bae6fd" font-family="sans-serif" font-size="13">"Slow and steady wins the race!"</text>
    </svg>`,
    paragraphs: [
      {
        en: "A boastful hare continually mocked a humble tortoise for his slow and measured walking pace.",
        es: "Una liebre presumida se burlaba continuamente de una humilde tortuga por su paso lento y medido al caminar.",
        sentences: [
          "A boastful hare continually mocked a humble tortoise for his slow and measured walking pace."
        ],
        words: [
          { en: "boastful", ipa: "/ˈboʊst.fəl/", es: "presumida / jactanciosa" },
          { en: "mocked", ipa: "/mɑːkt/", es: "se burlaba" },
          { en: "humble", ipa: "/ˈhʌm.bəl/", es: "humilde" },
          { en: "pace", ipa: "/peɪs/", es: "ritmo de paso" }
        ]
      },
      {
        en: "Tired of the relentless taunts, the tortoise challenged the swift hare to an official five-mile cross-country race.",
        es: "Cansada de las incesantes burlas, la tortuga desafió a la veloz liebre a una carrera oficial de campo traviesa de cinco millas.",
        sentences: [
          "Tired of the relentless taunts, the tortoise challenged the swift hare to an official five-mile cross-country race."
        ],
        words: [
          { en: "relentless", ipa: "/rɪˈlent.ləs/", es: "incesante" },
          { en: "taunts", ipa: "/tɑːnts/", es: "burlas" },
          { en: "challenged", ipa: "/ˈtʃæl.ɪndʒd/", es: "desafió" },
          { en: "swift", ipa: "/swɪft/", es: "veloz" }
        ]
      },
      {
        en: "Overconfident in her speed, the hare sprinted ahead and decided to take a long nap beneath an oak tree.",
        es: "Excesivamente confiada en su velocidad, la liebre corrió con ímpetu y decidió tomar una larga siesta bajo un roble.",
        sentences: [
          "Overconfident in her speed, the hare sprinted ahead and decided to take a long nap beneath an oak tree."
        ],
        words: [
          { en: "overconfident", ipa: "/ˌoʊ.vɚˈkɑːn.fə.dənt/", es: "excesivamente confiada" },
          { en: "sprinted", ipa: "/ˈsprɪn.tɪd/", es: "corrió a toda velocidad" },
          { en: "nap", ipa: "/næp/", es: "siesta" }
        ]
      },
      {
        en: "Step by step without stopping, the tortoise crossed the finish line amid thunderous applause: slow and steady wins the race.",
        es: "Paso a paso sin detenerse, la tortuga cruzó la línea de meta en medio de atronadores aplausos: lento y constante gana la carrera.",
        sentences: [
          "Step by step without stopping, the tortoise crossed the finish line amid thunderous applause: slow and steady wins the race."
        ],
        words: [
          { en: "stopping", ipa: "/ˈstɑː.pɪŋ/", es: "detenerse" },
          { en: "finish", ipa: "/ˈfɪn.ɪʃ/", es: "meta / final" },
          { en: "thunderous", ipa: "/ˈθʌn.dɚ.əs/", es: "atronador" },
          { en: "steady", ipa: "/ˈsted.i/", es: "constante" }
        ]
      }
    ]
  },
  {
    id: "boy-who-cried-wolf",
    title: "The Boy Who Cried Wolf",
    titleEs: "El pastorcito mentiroso",
    level: "Nivel B1",
    category: "Fábula Moral",
    description: "La inolvidable lección de un joven pastor sobre el valor sagrado de la verdad y la pérdida de la confianza.",
    illustrationSvg: `<svg viewBox="0 0 800 240" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wolfGradSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#431407"/>
        </linearGradient>
      </defs>
      <rect width="800" height="240" fill="url(#wolfGradSky)"/>
      <circle cx="690" cy="55" r="30" fill="#fed7aa" opacity="0.9"/>
      <!-- Colinas pastorales y rebaño de ovejas -->
      <path d="M 0 240 L 0 160 Q 250 115 500 165 T 800 150 L 800 240 Z" fill="#365314"/>
      <path d="M 0 240 L 0 185 Q 350 145 700 190 L 800 240 Z" fill="#1e3a1e"/>
      <!-- Siluetas de ovejas blancas en la colina -->
      <ellipse cx="280" cy="180" rx="14" ry="9" fill="#f8fafc"/>
      <ellipse cx="330" cy="175" rx="16" ry="10" fill="#f8fafc"/>
      <ellipse cx="380" cy="185" rx="13" ry="8" fill="#f8fafc"/>
      <!-- Silueta del pastor en la cima con cayado -->
      <rect x="520" y="145" width="8" height="28" fill="#cbd5e1"/>
      <circle cx="524" cy="140" r="5" fill="#f8fafc"/>
      <line x1="528" y1="135" x2="528" y2="175" stroke="#f59e0b" stroke-width="2"/>
      <text x="40" y="55" fill="#fb923c" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">OBRA CLÁSICA ILUSTRADA &bull; RELATO 5</text>
      <text x="40" y="90" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="900">The Boy Who Cried Wolf</text>
      <text x="40" y="115" fill="#fed7aa" font-family="sans-serif" font-size="13">"Nobody believes a liar, even when he tells the truth."</text>
    </svg>`,
    paragraphs: [
      {
        en: "A young shepherd boy watched over a flock of village sheep upon a breezy grassy hillside every single day.",
        es: "Un joven pastorcillo cuidaba un rebaño de ovejas del pueblo en una ventosa colina cubierta de pasto todos los días.",
        sentences: [
          "A young shepherd boy watched over a flock of village sheep upon a breezy grassy hillside every single day."
        ],
        words: [
          { en: "shepherd", ipa: "/ˈʃep.ɚd/", es: "pastor" },
          { en: "flock", ipa: "/flɑːk/", es: "rebaño" },
          { en: "breezy", ipa: "/ˈbriː.zi/", es: "ventoso / fresco" },
          { en: "hillside", ipa: "/ˈhɪl.saɪd/", es: "ladera de colina" }
        ]
      },
      {
        en: "Growing bored with his quiet duties, he cried out aloud: 'Wolf! Wolf! A ferocious beast is attacking the flock!'",
        es: "Aburriéndose de sus tranquilas tareas, gritó en voz alta: '¡Lobo! ¡Lobo! ¡Una bestia feroz está atacando el rebaño!'",
        sentences: [
          "Growing bored with his quiet duties, he cried out aloud: 'Wolf! Wolf! A ferocious beast is attacking the flock!'"
        ],
        words: [
          { en: "bored", ipa: "/bɔːrd/", es: "aburrido" },
          { en: "duties", ipa: "/ˈduː.t̬iz/", es: "deberes / tareas" },
          { en: "ferocious", ipa: "/fəˈroʊ.ʃəs/", es: "feroz" },
          { en: "attacking", ipa: "/əˈtæk.ɪŋ/", es: "atacando" }
        ]
      },
      {
        en: "The worried villagers rushed uphill with pitchforks only to find the mischievous boy laughing at their frantic concern.",
        es: "Los preocupados aldeanos subieron corriendo la colina con horquillas solo para encontrar al travieso chico riéndose de su frenética preocupación.",
        sentences: [
          "The worried villagers rushed uphill with pitchforks only to find the mischievous boy laughing at their frantic concern."
        ],
        words: [
          { en: "villagers", ipa: "/ˈvɪl.ə.dʒɚz/", es: "aldeanos" },
          { en: "mischievous", ipa: "/ˈmɪs.tʃə.vəs/", es: "travieso / pícaro" },
          { en: "frantic", ipa: "/ˈfræn.tɪk/", es: "frenético" }
        ]
      },
      {
        en: "When a real wolf finally prowled from the dark woods, the villagers ignored his genuine cries, teaching that truth is precious.",
        es: "Cuando un lobo real finalmente merodeó desde el bosque oscuro, los aldeanos ignoraron sus gritos genuinos, enseñando que la verdad es preciosa.",
        sentences: [
          "When a real wolf finally prowled from the dark woods, the villagers ignored his genuine cries, teaching that truth is precious."
        ],
        words: [
          { en: "prowled", ipa: "/praʊld/", es: "merodeó" },
          { en: "ignored", ipa: "/ɪɡˈnɔːrd/", es: "ignoraron" },
          { en: "genuine", ipa: "/ˈdʒen.ju.ɪn/", es: "genuino / verdadero" },
          { en: "precious", ipa: "/ˈpreʃ.əs/", es: "precioso / invaluable" }
        ]
      }
    ]
  },
  {
    id: "the-ugly-duckling",
    title: "The Ugly Duckling",
    titleEs: "El patito feo",
    level: "Nivel B1",
    category: "Cuento de Andersen",
    description: "La conmovedora historia de transformación, aceptación y el descubrimiento de la auténtica belleza interior y exterior.",
    illustrationSvg: `<svg viewBox="0 0 800 240" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="swanGradSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#0e7490"/>
        </linearGradient>
      </defs>
      <rect width="800" height="240" fill="url(#swanGradSky)"/>
      <circle cx="670" cy="50" r="32" fill="#cffafe" opacity="0.85"/>
      <!-- Lago sereno con reflejos de agua -->
      <path d="M 0 170 Q 200 150 400 170 T 800 165 L 800 240 L 0 240 Z" fill="#083344"/>
      <path d="M 0 195 Q 300 185 600 195 L 800 240 L 0 240 Z" fill="#155e75" opacity="0.8"/>
      <!-- Nenúfares y nenúfar en flor -->
      <ellipse cx="250" cy="210" rx="20" ry="7" fill="#047857"/>
      <ellipse cx="320" cy="218" rx="25" ry="8" fill="#047857"/>
      <!-- Silueta del cisne majestuoso y blanco -->
      <path d="M 520 205 C 500 185 530 145 550 155 C 560 160 550 175 570 185 C 590 190 600 205 570 210 Z" fill="#ffffff"/>
      <circle cx="550" cy="155" r="7" fill="#ffffff"/>
      <polygon points="556,155 565,157 556,160" fill="#f59e0b"/>
      <text x="40" y="55" fill="#22d3ee" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">OBRA CLÁSICA ILUSTRADA &bull; RELATO 6</text>
      <text x="40" y="90" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="900">The Ugly Duckling</text>
      <text x="40" y="115" fill="#a5f3fc" font-family="sans-serif" font-size="13">"He was no longer a clumsy gray bird, but a graceful swan."</text>
    </svg>`,
    paragraphs: [
      {
        en: "On a warm summer morning near a crystal-clear rural lake, a mother duck waited patiently as her eggs began to hatch.",
        es: "En una cálida mañana de verano junto a un lago rural de aguas cristalinas, una mamá pata esperaba pacientemente mientras sus huevos comenzaban a eclosionar.",
        sentences: [
          "On a warm summer morning near a crystal-clear rural lake, a mother duck waited patiently as her eggs began to hatch."
        ],
        words: [
          { en: "summer", ipa: "/ˈsʌm.ɚ/", es: "verano" },
          { en: "crystal-clear", ipa: "/ˌkrɪs.təl ˈklɪr/", es: "cristalino" },
          { en: "patiently", ipa: "/ˈpeɪ.ʃənt.li/", es: "pacientemente" },
          { en: "hatch", ipa: "/hætʃ/", es: "eclosionar / romper cascarón" }
        ]
      },
      {
        en: "The last egg was unusually large, and when it cracked open, a gray and clumsy fledgling emerged looking quite different.",
        es: "El último huevo era inusualmente grande, y cuando se rompió, emergió un pichón gris y torpe que se veía bastante diferente.",
        sentences: [
          "The last egg was unusually large, and when it cracked open, a gray and clumsy fledgling emerged looking quite different."
        ],
        words: [
          { en: "unusually", ipa: "/ʌnˈjuː.ʒu.ə.li/", es: "inusualmente" },
          { en: "clumsy", ipa: "/ˈklʌm.zi/", es: "torpe" },
          { en: "fledgling", ipa: "/ˈfledʒ.lɪŋ/", es: "pichón / ave joven" },
          { en: "emerged", ipa: "/ɪˈmɝːdʒd/", es: "emergió" }
        ]
      },
      {
        en: "Teased by the farmyard animals, he wandered through freezing winter storms, enduring hardship with quiet bravery.",
        es: "Molestado por los animales del corral, vagó a través de gélidas tormentas de invierno, soportando dificultades con serena valentía.",
        sentences: [
          "Teased by the farmyard animals, he wandered through freezing winter storms, enduring hardship with quiet bravery."
        ],
        words: [
          { en: "teased", ipa: "/tiːzd/", es: "molestado / burlado" },
          { en: "wandered", ipa: "/ˈwɑːn.dɚd/", es: "vagó" },
          { en: "enduring", ipa: "/ɪnˈdʊr.ɪŋ/", es: "soportando" },
          { en: "bravery", ipa: "/ˈbreɪ.vɚ.i/", es: "valentía" }
        ]
      },
      {
        en: "When spring arrived, he gazed at his reflection in the shimmering lake: he was no longer an ugly duckling, but a magnificent swan.",
        es: "Cuando llegó la primavera, contempló su reflejo en el resplandeciente lago: ya no era un patito feo, sino un magnífico cisne.",
        sentences: [
          "When spring arrived, he gazed at his reflection in the shimmering lake: he was no longer an ugly duckling, but a magnificent swan."
        ],
        words: [
          { en: "spring", ipa: "/sprɪŋ/", es: "primavera" },
          { en: "gazed", ipa: "/ɡeɪzd/", es: "contempló" },
          { en: "shimmering", ipa: "/ˈʃɪm.ɚ.ɪŋ/", es: "resplandeciente" },
          { en: "magnificent", ipa: "/mæɡˈnɪf.ə.sənt/", es: "magnífico" },
          { en: "swan", ipa: "/swɑːn/", es: "cisne" }
        ]
      }
    ]
  }
];

// 4. REEMPLAZAR EL BLOQUE STORIES_DATA COMPLETO
const oldStoriesStart = html.indexOf('const STORIES_DATA = [');
const oldStoriesEnd = html.indexOf('let currentStoryIndex = 0;');

if (oldStoriesStart !== -1 && oldStoriesEnd !== -1) {
  const newStoriesCode = `const STORIES_DATA = ${JSON.stringify(storiesCatalogue, null, 2)};\n\n    `;
  html = html.substring(0, oldStoriesStart) + newStoriesCode + html.substring(oldStoriesEnd);
  console.log('✅ STORIES_DATA actualizado con las 6 obras maestras, cero emojis e ilustraciones vectoriales HD.');
} else {
  console.warn('⚠️ No se pudo localizar el bloque STORIES_DATA.');
}

// 5. ACTUALIZAR renderStorySelector() Y downloadStoryPdf() CON AUTORÍA OFICIAL "Wilberth Alessandro Molina Cutz"
const storyJsRegex = /function selectStory\(idx\) \{[\s\S]*?function renderStorySelector\(\) \{[\s\S]*?function downloadStoryPdf\(\) \{[\s\S]*?printWindow\.print\(\);\s*\}\s*\}/;

const newStoryJs = `function selectStory(idx) {
      currentStoryIndex = idx;
      renderStorySelector();
      renderActiveStory();
    }

    function renderStorySelector() {
      const container = document.getElementById("storiesSelectorContainer");
      if (!container) return;

      container.innerHTML = STORIES_DATA.map((story, idx) => {
        const isSelected = idx === currentStoryIndex;
        return \`
          <button onclick="selectStory(\${idx})" id="storyTab-\${idx}" class="story-tab-btn text-left p-4 rounded-2xl transition cursor-pointer flex flex-col justify-between shadow-sm \${isSelected ? 'bg-slate-900 border-2 border-emerald-400 shadow-emerald-950/40' : 'bg-[#1e293b] border border-slate-800 hover:border-emerald-500/60'}">
            <div>
              <div class="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-2">
                <span class="bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">Relato \${idx + 1}</span>
                <span class="text-slate-400">\${story.level}</span>
              </div>
              <h3 class="text-sm sm:text-base font-bold text-slate-100 tracking-tight">\${story.title}</h3>
              <p class="text-xs text-slate-400 mt-1 line-clamp-2">\${story.description}</p>
            </div>
            <div class="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold \${isSelected ? 'text-emerald-400' : 'text-slate-500'}">
              <span>\${isSelected ? 'Lectura en curso' : 'Comenzar lectura'}</span>
              <span class="font-bold">&rarr;</span>
            </div>
          </button>
        \`;
      }).join('');
    }

    function downloadStoryPdf() {
      const story = STORIES_DATA[currentStoryIndex];
      if (!story) return;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        showFloatingToast("Por favor permite las ventanas emergentes para generar el documento PDF.");
        return;
      }

      const paragraphsHtml = story.paragraphs.map((p, idx) => \`
        <div style="margin-bottom: 22px; page-break-inside: avoid;">
          <p style="font-size: 15px; font-weight: bold; color: #0f172a; line-height: 1.6; margin: 0 0 6px 0;">
            \${idx + 1}. \${p.en}
          </p>
          <p style="font-size: 13px; color: #475569; font-style: italic; line-height: 1.5; margin: 0;">
            \${p.es}
          </p>
        </div>
      \`).join('');

      printWindow.document.write(\`
        <!DOCTYPE html>
        <html>
        <head>
          <title>\${story.title} - English Learning Edition</title>
          <style>
            @page { margin: 25mm 20mm 25mm 20mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 20px; }
            .header-banner { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 24px; }
            .title { font-size: 26px; font-weight: 900; color: #064e3b; margin: 0 0 6px 0; }
            .subtitle { font-size: 13px; color: #047857; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold; margin: 0; }
            .author-badge { margin-top: 8px; font-size: 12px; font-weight: bold; color: #0f172a; background: #e6fffa; border: 1px solid #10b981; padding: 5px 12px; border-radius: 6px; display: inline-block; }
            .footer { margin-top: 40px; padding-top: 14px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <p class="subtitle">\${story.category} &bull; \${story.level} &bull; Edición Bilingüe Oficial</p>
            <h1 class="title">\${story.title} (\${story.titleEs})</h1>
            <div class="author-badge">Compilado y Desarrollado por: Wilberth Alessandro Molina Cutz</div>
          </div>
          <div class="content">
            \${paragraphsHtml}
          </div>
          <div class="footer">
            Documento de Estudio de Inglés Certificado &bull; Autoría: Wilberth Alessandro Molina Cutz &bull; english_app
          </div>
        </body>
        </html>
      \`);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
    }`;

const oldStoryJsStart = html.indexOf('function selectStory(idx) {');
const oldStoryJsEnd = html.indexOf('function toggleBilingualStoryMode() {');

if (oldStoryJsStart !== -1 && oldStoryJsEnd !== -1) {
  html = html.substring(0, oldStoryJsStart) + newStoryJs.trim() + '\n\n    ' + html.substring(oldStoryJsEnd);
  console.log('✅ selectStory, renderStorySelector y downloadStoryPdf actualizados con autoría oficial.');
} else {
  console.warn('⚠️ No se pudo localizar el bloque JS de cuentos.');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Step 5 applied successfully.');

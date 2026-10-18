/**
 * MasterENG - Flujo Principal de Interfaz, Portales, Cuentos, 3D y Administración
 */
(function() {
  'use strict';

  
    let starsCanvasAnimId = null;

    

  const STORIES_DATA = [
      {
        id: "three-little-pigs",
        title: "The Three Little Pigs",
        titleEs: "Los tres cerditos",
        level: "Nivel A2",
        category: "Fábula Clásica",
        moralEn: "Hard work, patience, and solid preparation build lasting security.",
        moralEs: "El trabajo constante, la paciencia y la buena preparación construyen una seguridad duradera.",
        illustrationSvg: `<svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pigsSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#09152b"/><stop offset="55%" stop-color="#0f3d3e"/><stop offset="100%" stop-color="#065f46"/>
            </linearGradient>
            <linearGradient id="pigsSun" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a"/><stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
            <linearGradient id="brickWall" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#dc2626"/><stop offset="100%" stop-color="#7f1d1d"/>
            </linearGradient>
          </defs>
          <rect width="800" height="320" fill="url(#pigsSky)"/>
          <circle cx="670" cy="72" r="46" fill="url(#pigsSun)" opacity="0.25"/>
          <circle cx="670" cy="72" r="34" fill="url(#pigsSun)" opacity="0.92"/>
          <!-- Distant mountains and hills -->
          <path d="M 0 320 L 0 215 Q 160 145 340 205 T 680 185 L 800 205 L 800 320 Z" fill="#064e3b" opacity="0.75"/>
          <path d="M 0 320 L 0 245 Q 240 190 480 240 T 800 230 L 800 320 Z" fill="#047857"/>
          <path d="M 0 320 L 0 272 Q 360 238 800 270 L 800 320 Z" fill="#065f46"/>
          <!-- Winding dirt path -->
          <path d="M 145 268 Q 310 295 535 265 L 575 320 L 95 320 Z" fill="#d97706" opacity="0.35"/>
          <!-- House 1: Straw Hut -->
          <g transform="translate(85, 165)">
            <rect x="12" y="45" width="66" height="52" rx="4" fill="#eab308" stroke="#a16207" stroke-width="2"/>
            <line x1="25" y1="45" x2="25" y2="97" stroke="#ca8a04" stroke-width="1.5"/>
            <line x1="45" y1="45" x2="45" y2="97" stroke="#ca8a04" stroke-width="1.5"/>
            <line x1="65" y1="45" x2="65" y2="97" stroke="#ca8a04" stroke-width="1.5"/>
            <polygon points="0,48 45,4 90,48" fill="#facc15" stroke="#a16207" stroke-width="2"/>
            <rect x="36" y="65" width="18" height="32" rx="3" fill="#713f12"/>
          </g>
          <!-- House 2: Wooden Stick Cabin -->
          <g transform="translate(265, 148)">
            <rect x="14" y="52" width="82" height="62" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
            <line x1="14" y1="67" x2="96" y2="67" stroke="#78350f" stroke-width="2.5"/>
            <line x1="14" y1="82" x2="96" y2="82" stroke="#78350f" stroke-width="2.5"/>
            <line x1="14" y1="97" x2="96" y2="97" stroke="#78350f" stroke-width="2.5"/>
            <polygon points="2,55 55,6 108,55" fill="#b45309" stroke="#451a03" stroke-width="2"/>
            <rect x="44" y="76" width="22" height="38" rx="2" fill="#451a03"/>
            <rect x="24" y="68" width="14" height="14" rx="2" fill="#fde047" opacity="0.8"/>
          </g>
          <!-- House 3: Strong Red Brick Fortress -->
          <g transform="translate(470, 118)">
            <rect x="88" y="6" width="22" height="48" fill="#7f1d1d" stroke="#450a0a" stroke-width="2"/>
            <circle cx="102" cy="-6" r="8" fill="#cbd5e1" opacity="0.55"/>
            <circle cx="114" cy="-18" r="11" fill="#cbd5e1" opacity="0.4"/>
            <rect x="16" y="60" width="118" height="82" rx="4" fill="url(#brickWall)" stroke="#450a0a" stroke-width="2.5"/>
            <!-- Brick pattern lines -->
            <line x1="16" y1="78" x2="134" y2="78" stroke="#fca5a5" stroke-width="1" opacity="0.35"/>
            <line x1="16" y1="96" x2="134" y2="96" stroke="#fca5a5" stroke-width="1" opacity="0.35"/>
            <line x1="16" y1="114" x2="134" y2="114" stroke="#fca5a5" stroke-width="1" opacity="0.35"/>
            <polygon points="2,64 75,8 148,64" fill="#991b1b" stroke="#450a0a" stroke-width="2.5"/>
            <rect x="61" y="96" width="28" height="46" rx="14" fill="#451a03" stroke="#fef08a" stroke-width="1.5"/>
            <rect x="28" y="78" width="22" height="22" rx="3" fill="#fef08a" stroke="#451a03" stroke-width="2"/>
            <rect x="100" y="78" width="22" height="22" rx="3" fill="#fef08a" stroke="#451a03" stroke-width="2"/>
          </g>
          <!-- Three Little Pigs silhouettes/figures -->
          <g transform="translate(645, 226)">
            <ellipse cx="20" cy="24" rx="15" ry="12" fill="#f472b6"/>
            <circle cx="20" cy="10" r="11" fill="#f9a8d4"/>
            <ellipse cx="20" cy="12" rx="5" ry="3.5" fill="#ec4899"/>
            <ellipse cx="56" cy="26" rx="15" ry="12" fill="#f472b6"/>
            <circle cx="56" cy="12" r="11" fill="#f9a8d4"/>
            <ellipse cx="56" cy="14" rx="5" ry="3.5" fill="#ec4899"/>
            <ellipse cx="92" cy="24" rx="15" ry="12" fill="#f472b6"/>
            <circle cx="92" cy="10" r="11" fill="#f9a8d4"/>
            <ellipse cx="92" cy="12" rx="5" ry="3.5" fill="#ec4899"/>
          </g>
        </svg>`,
        paragraphs: [
          {
            en: "Once upon a time, three little pigs left their cozy family home to explore the wide world and build their own houses.",
            es: "Érase una vez, tres cerditos dejaron su acogedor hogar familiar para explorar el ancho mundo y construir sus propias casas."
          },
          {
            en: "The first little pig built his house out of yellow straw because it was quick and easy, allowing him plenty of time to play.",
            es: "El primer cerdito construyó su casa de paja amarilla porque era rápido y fácil, lo que le dejaba mucho tiempo para jugar."
          },
          {
            en: "The second little pig gathered bundles of sticks and twigs from the forest to assemble a modest wooden cabin.",
            es: "El segundo cerdito reunió ramas y palos del bosque para armar una modesta cabaña de madera."
          },
          {
            en: "The third little pig worked diligently from sunrise to sunset, laying heavy red bricks and strong mortar with unwavering patience.",
            es: "El tercer cerdito trabajó diligentemente desde el amanecer hasta el anochecer, colocando pesados ladrillos rojos y cemento fuerte con paciencia."
          },
          {
            en: "When the big hungry wolf blew away the straw and stick houses, both brothers found safe shelter in the unbreakable brick fortress.",
            es: "Cuando el gran lobo hambriento derribó las casas de paja y ramas, ambos hermanos hallaron refugio seguro en la fortaleza de ladrillos."
          }
        ],
        vocab: [
          { term: "Straw", ipa: "/strɔː/", es: "Paja seca" },
          { term: "Bundles of sticks", ipa: "/ˈbʌn.dəlz əv stɪks/", es: "Atados de ramas" },
          { term: "Diligently", ipa: "/ˈdɪl.ə.dʒənt.li/", es: "Diligentemente / Con esmero" },
          { term: "Mortar", ipa: "/ˈmɔːr.t̬ɚ/", es: "Mortero / Cemento" },
          { term: "Fortress", ipa: "/ˈfɔːr.trəs/", es: "Fortaleza" }
        ]
      },
      {
        id: "little-red-riding-hood",
        title: "Little Red Riding Hood",
        titleEs: "Caperucita Roja",
        level: "Nivel A2",
        category: "Cuento Popular",
        moralEn: "Stay alert on your journey and listen carefully to wise family advice.",
        moralEs: "Mantente alerta en tu camino y escucha con atención los sabios consejos familiares.",
        illustrationSvg: `<svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="redSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0f172a"/><stop offset="50%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#064e3b"/>
            </linearGradient>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fef9c3" stop-opacity="0.95"/><stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="800" height="320" fill="url(#redSky)"/>
          <circle cx="135" cy="76" r="68" fill="url(#moonGlow)"/>
          <circle cx="135" cy="76" r="36" fill="#fefce8"/>
          <!-- Deep forest pine silhouettes -->
          <polygon points="40,320 85,110 130,320" fill="#022c22" opacity="0.7"/>
          <polygon points="150,320 205,85 260,320" fill="#064e3b" opacity="0.85"/>
          <polygon points="240,320 295,105 350,320" fill="#022c22" opacity="0.8"/>
          <polygon points="460,320 515,90 570,320" fill="#064e3b" opacity="0.85"/>
          <polygon points="545,320 600,110 655,320" fill="#022c22" opacity="0.75"/>
          <!-- Forest ground and stone path -->
          <path d="M 0 320 L 0 248 Q 260 220 520 250 T 800 242 L 800 320 Z" fill="#065f46"/>
          <path d="M 280 320 Q 375 265 635 255 L 690 262 Q 445 282 390 320 Z" fill="#94a3b8" opacity="0.5"/>
          <!-- Grandmother's cottage in distance -->
          <g transform="translate(615, 165)">
            <rect x="12" y="40" width="96" height="58" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
            <polygon points="0,44 60,4 120,44" fill="#9a3412" stroke="#451a03" stroke-width="2"/>
            <rect x="48" y="62" width="22" height="36" rx="3" fill="#451a03"/>
            <rect x="22" y="54" width="18" height="18" rx="2" fill="#fde047"/>
            <rect x="80" y="54" width="18" height="18" rx="2" fill="#fde047"/>
          </g>
          <!-- Little Red Riding Hood figure with scarlet cloak and wicker basket -->
          <g transform="translate(350, 172)">
            <path d="M 30 32 L 6 105 L 62 105 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
            <path d="M 18 32 Q 34 2 50 32 Z" fill="#ef4444"/>
            <circle cx="34" cy="24" r="12" fill="#fed7aa"/>
            <path d="M 16 18 Q 34 -4 52 18 Q 45 36 34 36 Q 22 36 16 18 Z" fill="#b91c1c"/>
            <circle cx="34" cy="25" r="9" fill="#fde68a"/>
            <!-- Wicker basket -->
            <rect x="48" y="64" width="24" height="16" rx="4" fill="#d97706" stroke="#78350f" stroke-width="1.5"/>
            <path d="M 52 64 Q 60 50 68 64" fill="none" stroke="#78350f" stroke-width="2"/>
          </g>
        </svg>`,
        paragraphs: [
          {
            en: "Little Red Riding Hood lived in a cheerful cottage at the edge of a deep, whispering forest.",
            es: "Caperucita Roja vivía en una alegre cabaña al borde de un profundo y susurrante bosque."
          },
          {
            en: "Her loving mother packed a wicker basket with fresh bread and herbal honey for her sick grandmother.",
            es: "Su amorosa madre empacó una canasta de mimbre con pan fresco y miel de hierbas para su abuela enferma."
          },
          {
            en: "She promised never to leave the cobblestone path, yet the sweet forest flowers led her into conversation with a sly wolf.",
            es: "Prometió nunca salir del camino empedrado, pero las dulces flores del bosque la llevaron a conversar con un lobo astuto."
          },
          {
            en: "The cunning wolf hurried ahead to the cottage, disguising himself inside the grandmother's warm bedroom.",
            es: "El astuto lobo se adelantó rápidamente hacia la cabaña, disfrazándose dentro de la cálida habitación de la abuela."
          },
          {
            en: "Thanks to a courageous local woodsman, the grandmother and the girl were safely rescued, and the forest became peaceful once more.",
            es: "Gracias a un valiente leñador local, la abuela y la niña fueron rescatadas a salvo, y el bosque volvió a ser pacífico."
          }
        ],
        vocab: [
          { term: "Wicker basket", ipa: "/ˈwɪk.ɚ ˈbæs.kɪt/", es: "Canasta de mimbre" },
          { term: "Cobblestone path", ipa: "/ˈkɑː.bəl.stoʊn pæθ/", es: "Camino empedrado" },
          { term: "Sly / Cunning", ipa: "/slaɪ / ˈkʌn.ɪŋ/", es: "Astuto / Engañoso" },
          { term: "Courageous", ipa: "/kəˈreɪ.dʒəs/", es: "Valiente" },
          { term: "Woodsman", ipa: "/ˈwʊdz.mən/", es: "Leñador" }
        ]
      },
      {
        id: "goldilocks-three-bears",
        title: "Goldilocks and the Three Bears",
        titleEs: "Ricitos de Oro y los tres osos",
        level: "Nivel B1",
        category: "Cuento Clásico",
        moralEn: "Respect the home and belongings of others, and value moderation in all things.",
        moralEs: "Respeta el hogar y las pertenencias de los demás, y valora el equilibrio en todo momento.",
        illustrationSvg: `<svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bearsBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#271202"/><stop offset="55%" stop-color="#451a03"/><stop offset="100%" stop-color="#78350f"/>
            </linearGradient>
          </defs>
          <rect width="800" height="320" fill="url(#bearsBg)"/>
          <!-- Cabin window looking out to green woods -->
          <rect x="75" y="42" width="170" height="115" rx="8" fill="#065f46" stroke="#b45309" stroke-width="6"/>
          <polygon points="95,155 125,85 155,155" fill="#047857"/>
          <polygon points="150,155 185,72 220,155" fill="#064e3b"/>
          <line x1="160" y1="42" x2="160" y2="157" stroke="#b45309" stroke-width="4"/>
          <line x1="75" y1="100" x2="245" y2="100" stroke="#b45309" stroke-width="4"/>
          <!-- Rustic wooden dining table -->
          <rect x="140" y="218" width="520" height="18" rx="5" fill="#d97706" stroke="#78350f" stroke-width="2"/>
          <rect x="185" y="236" width="22" height="84" fill="#92400e"/>
          <rect x="595" y="236" width="22" height="84" fill="#92400e"/>
          <!-- Bowl 1: Large Papa Bear Bowl -->
          <path d="M 225 190 Q 225 220 270 220 Q 315 220 315 190 Z" fill="#3b82f6" stroke="#dbeafe" stroke-width="2"/>
          <ellipse cx="270" cy="190" rx="45" ry="9" fill="#fde68a" stroke="#3b82f6" stroke-width="2"/>
          <path d="M 255 174 Q 262 160 255 148" stroke="#f8fafc" stroke-width="2.5" fill="none" opacity="0.65"/>
          <path d="M 282 172 Q 289 158 282 145" stroke="#f8fafc" stroke-width="2.5" fill="none" opacity="0.65"/>
          <!-- Bowl 2: Medium Mama Bear Bowl -->
          <path d="M 375 196 Q 375 220 412 220 Q 450 220 450 196 Z" fill="#ef4444" stroke="#fee2e2" stroke-width="2"/>
          <ellipse cx="412" cy="196" rx="37" ry="7.5" fill="#fde68a" stroke="#ef4444" stroke-width="2"/>
          <!-- Bowl 3: Small Baby Bear Bowl (Just Right) -->
          <path d="M 505 201 Q 505 220 535 220 Q 565 220 565 201 Z" fill="#10b981" stroke="#d1fae5" stroke-width="2"/>
          <ellipse cx="535" cy="201" rx="30" ry="6.5" fill="#fde68a" stroke="#10b981" stroke-width="2"/>
          <circle cx="535" cy="172" r="4" fill="#fbbf24"/>
          <!-- Three Bears silhouettes on right side -->
          <g transform="translate(635, 118)">
            <circle cx="38" cy="24" r="10" fill="#92400e"/>
            <circle cx="72" cy="24" r="10" fill="#92400e"/>
            <circle cx="55" cy="42" r="24" fill="#b45309"/>
            <ellipse cx="55" cy="95" rx="34" ry="42" fill="#92400e"/>
          </g>
        </svg>`,
        paragraphs: [
          {
            en: "Deep inside the peaceful green woods stood a charming wooden home belonging to a family of three brown bears.",
            es: "En lo profundo del bosque verde y pacífico se encontraba una encantadora casa de madera perteneciente a una familia de tres osos pardos."
          },
          {
            en: "Before sitting down for breakfast, they stepped out for a morning stroll while their freshly cooked porridge cooled down.",
            es: "Antes de sentarse a desayunar, salieron a dar un paseo matutino mientras su avena recién cocinada se enfriaba."
          },
          {
            en: "A golden-haired girl named Goldilocks knocked on the open door and curiously tasted the steaming porridge bowls.",
            es: "Una niña de cabellos dorados llamada Ricitos de Oro llamó a la puerta abierta y probó curiosamente los humeantes tazones de avena."
          },
          {
            en: "The smallest bowl was neither too hot nor too cold: it was just right, and she ate it all before resting in the baby bed.",
            es: "El tazón más pequeño no estaba ni muy caliente ni muy frío: estaba en su punto justo, y lo comió todo antes de descansar."
          },
          {
            en: "When the bears returned home, Goldilocks woke up startled and hurried back through the forest, promising never to enter uninvited again.",
            es: "Cuando los osos regresaron a casa, Ricitos de Oro despertó sobresaltada y corrió por el bosque, prometiendo no entrar sin invitación."
          }
        ],
        vocab: [
          { term: "Morning stroll", ipa: "/ˈmɔːr.nɪŋ stroʊl/", es: "Paseo matutino" },
          { term: "Porridge", ipa: "/ˈpɔːr.ɪdʒ/", es: "Avena cocida / Gachas" },
          { term: "Steaming", ipa: "/ˈstiː.mɪŋ/", es: "Humeante / Muy caliente" },
          { term: "Just right", ipa: "/dʒʌst raɪt/", es: "En su punto exacto" },
          { term: "Uninvited", ipa: "/ˌʌn.ɪnˈvaɪ.t̬ɪd/", es: "Sin invitación" }
        ]
      },
      {
        id: "tortoise-and-hare",
        title: "The Tortoise and the Hare",
        titleEs: "La tortuga y la liebre",
        level: "Nivel A2",
        category: "Fábula de Esopo",
        moralEn: "Slow, steady, and disciplined perseverance always triumphs over arrogance.",
        moralEs: "La constancia disciplinada y firme siempre triunfa sobre la arrogancia.",
        illustrationSvg: `<svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="raceSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#082f49"/><stop offset="60%" stop-color="#065f46"/><stop offset="100%" stop-color="#047857"/>
            </linearGradient>
          </defs>
          <rect width="800" height="320" fill="url(#raceSky)"/>
          <circle cx="710" cy="64" r="38" fill="#fde047" opacity="0.9"/>
          <!-- Meadow hills -->
          <path d="M 0 320 L 0 200 Q 230 145 470 195 T 800 185 L 800 320 Z" fill="#065f46"/>
          <path d="M 0 320 L 0 235 Q 320 195 800 230 L 800 320 Z" fill="#047857"/>
          <!-- Winding golden race track -->
          <path d="M 0 285 Q 260 235 520 268 T 800 255" stroke="#fde68a" stroke-width="34" fill="none" stroke-linecap="round"/>
          <path d="M 0 285 Q 260 235 520 268 T 800 255" stroke="#d97706" stroke-width="2" stroke-dasharray="12,10" fill="none"/>
          <!-- Shade Oak Tree where the hare naps -->
          <rect x="155" y="130" width="24" height="85" rx="4" fill="#78350f"/>
          <circle cx="167" cy="112" r="46" fill="#15803d"/>
          <circle cx="135" cy="128" r="34" fill="#166534"/>
          <circle cx="198" cy="126" r="34" fill="#166534"/>
          <!-- Sleeping Hare under the oak -->
          <ellipse cx="198" cy="212" rx="18" ry="11" fill="#cbd5e1"/>
          <circle cx="214" cy="206" r="9" fill="#e2e8f0"/>
          <ellipse cx="210" cy="192" rx="3" ry="10" fill="#cbd5e1" transform="rotate(-20 210 192)"/>
          <!-- Finish line banner on the right -->
          <rect x="645" y="165" width="8" height="105" fill="#f8fafc"/>
          <rect x="725" y="165" width="8" height="105" fill="#f8fafc"/>
          <rect x="645" y="172" width="88" height="22" fill="#ef4444" stroke="#fef2f2" stroke-width="2"/>
          <!-- Determined Tortoise crossing the finish line -->
          <g transform="translate(545, 228)">
            <path d="M 10 28 Q 38 -6 66 28 Z" fill="#065f46" stroke="#34d399" stroke-width="2.5"/>
            <path d="M 22 20 L 54 20 M 38 10 L 38 28" stroke="#10b981" stroke-width="2"/>
            <circle cx="76" cy="20" r="9" fill="#34d399"/>
            <circle cx="79" cy="18" r="2" fill="#022c22"/>
            <rect x="18" y="28" width="10" height="10" rx="3" fill="#10b981"/>
            <rect x="48" y="28" width="10" height="10" rx="3" fill="#10b981"/>
          </g>
        </svg>`,
        paragraphs: [
          {
            en: "A boastful hare continually mocked a humble tortoise for his slow and measured walking pace.",
            es: "Una liebre presumida se burlaba continuamente de una humilde tortuga por su paso lento y medido al caminar."
          },
          {
            en: "Tired of the relentless taunts, the tortoise challenged the swift hare to an official five-mile cross-country race.",
            es: "Cansada de las incesantes burlas, la tortuga desafió a la veloz liebre a una carrera oficial de campo traviesa."
          },
          {
            en: "Overconfident in her speed, the hare sprinted ahead and decided to take a long nap beneath an oak tree.",
            es: "Excesivamente confiada en su velocidad, la liebre corrió con ímpetu y decidió tomar una larga siesta bajo un roble."
          },
          {
            en: "While the hare slept soundly in the cool shade, the determined tortoise kept walking forward without a single pause.",
            es: "Mientras la liebre dormía profundamente en la fresca sombra, la decidida tortuga siguió avanzando sin una sola pausa."
          },
          {
            en: "Step by step without stopping, the tortoise crossed the finish line amid thunderous applause: slow and steady wins the race.",
            es: "Paso a paso sin detenerse, la tortuga cruzó la línea de meta entre aplausos: lento y constante gana la carrera."
          }
        ],
        vocab: [
          { term: "Boastful", ipa: "/ˈboʊst.fəl/", es: "Presumido / Jactancioso" },
          { term: "Relentless taunts", ipa: "/rɪˈlent.ləs tɑːnts/", es: "Burlas incesantes" },
          { term: "Overconfident", ipa: "/ˌoʊ.vɚˈkɑːn.fə.dənt/", es: "Excesivamente confiado" },
          { term: "Thunderous applause", ipa: "/ˈθʌn.dɚ.əs əˈplɑːz/", es: "Aplausos estruendosos" },
          { term: "Slow and steady", ipa: "/sloʊ ænd ˈsted.i/", es: "Lento pero constante" }
        ]
      },
      {
        id: "boy-who-cried-wolf",
        title: "The Boy Who Cried Wolf",
        titleEs: "El pastorcito mentiroso",
        level: "Nivel B1",
        category: "Fábula Moral",
        moralEn: "Honesty builds trust; a liar will not be believed even when speaking the truth.",
        moralEs: "La honestidad construye confianza; a quien miente no se le cree ni cuando dice la verdad.",
        illustrationSvg: `<svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wolfSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#1e1b4b"/><stop offset="55%" stop-color="#7c2d12"/><stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
          </defs>
          <rect width="800" height="320" fill="url(#wolfSky)"/>
          <circle cx="660" cy="88" r="44" fill="#fed7aa" opacity="0.85"/>
          <!-- Distant village roofs in valley -->
          <path d="M 0 320 L 0 215 Q 240 165 520 215 T 800 195 L 800 320 Z" fill="#1e293b"/>
          <!-- Rolling pasture hillside -->
          <path d="M 0 320 L 0 225 Q 280 155 560 225 T 800 220 L 800 320 Z" fill="#365314"/>
          <path d="M 0 320 L 0 260 Q 340 215 800 255 L 800 320 Z" fill="#3f6212"/>
          <!-- Grazing sheep flock on hillside -->
          <g transform="translate(210, 210)">
            <ellipse cx="30" cy="24" rx="22" ry="15" fill="#f8fafc"/>
            <circle cx="16" cy="18" r="10" fill="#f1f5f9"/>
            <circle cx="48" cy="20" r="9" fill="#334155"/>
            <rect x="20" y="36" width="4" height="10" fill="#334155"/>
            <rect x="36" y="36" width="4" height="10" fill="#334155"/>
          </g>
          <g transform="translate(295, 222)">
            <ellipse cx="30" cy="24" rx="24" ry="16" fill="#f8fafc"/>
            <circle cx="16" cy="18" r="11" fill="#f1f5f9"/>
            <circle cx="50" cy="20" r="9" fill="#334155"/>
            <rect x="20" y="36" width="4" height="10" fill="#334155"/>
            <rect x="38" y="36" width="4" height="10" fill="#334155"/>
          </g>
          <g transform="translate(385, 214)">
            <ellipse cx="26" cy="22" rx="20" ry="14" fill="#f8fafc"/>
            <circle cx="44" cy="18" r="8" fill="#334155"/>
          </g>
          <!-- Shepherd boy with wooden crook on hilltop -->
          <g transform="translate(115, 152)">
            <line x1="48" y1="6" x2="48" y2="88" stroke="#fde68a" stroke-width="3.5"/>
            <path d="M 48 12 Q 48 -4 62 2 Q 70 8 60 16" fill="none" stroke="#fde68a" stroke-width="3.5"/>
            <circle cx="26" cy="24" r="12" fill="#fed7aa"/>
            <path d="M 12 40 L 40 40 L 44 82 L 8 82 Z" fill="#0284c7"/>
          </g>
          <!-- Prowling wolf silhouette near dark woods -->
          <g transform="translate(610, 198)">
            <polygon points="10,36 35,18 75,22 92,10 98,26 84,38 88,58 76,58 70,40 30,40 22,58 12,58" fill="#0f172a"/>
            <circle cx="88" cy="19" r="2.5" fill="#ef4444"/>
          </g>
        </svg>`,
        paragraphs: [
          {
            en: "A young shepherd boy watched over a flock of village sheep upon a breezy grassy hillside every single day.",
            es: "Un joven pastorcillo cuidaba un rebaño de ovejas del pueblo en una ventosa colina cubierta de pasto todos los días."
          },
          {
            en: "Growing bored with his quiet duties, he cried out aloud: 'Wolf! Wolf! A ferocious beast is attacking the flock!'",
            es: "Aburriéndose de sus tranquilas tareas, gritó en voz alta: '¡Lobo! ¡Lobo! ¡Una bestia feroz está atacando el rebaño!'"
          },
          {
            en: "Kind villagers dropped their tools and rushed up the steep hill to help, only to find the boy laughing at his trick.",
            es: "Los amables aldeanos soltaron sus herramientas y subieron corriendo la empinada colina para ayudar, solo para encontrar al niño riéndose."
          },
          {
            en: "He repeated the false alarm a second time, and the disappointed villagers warned him never to deceive the community again.",
            es: "Repitió la falsa alarma por segunda vez, y los decepcionados aldeanos le advirtieron que nunca volviera a engañar a la comunidad."
          },
          {
            en: "When a real wolf finally prowled from the dark woods, the villagers ignored his genuine cries, teaching that truth is precious.",
            es: "Cuando un lobo real finalmente merodeó desde el bosque oscuro, los aldeanos ignoraron sus gritos, enseñando que la verdad es preciosa."
          }
        ],
        vocab: [
          { term: "Shepherd boy", ipa: "/ˈʃep.ɚd bɔɪ/", es: "Pastorcillo" },
          { term: "Flock of sheep", ipa: "/flɑːk əv ʃiːp/", es: "Rebaño de ovejas" },
          { term: "Ferocious", ipa: "/fəˈroʊ.ʃəs/", es: "Feroz" },
          { term: "Deceive", ipa: "/dɪˈsiːv/", es: "Engañar" },
          { term: "Prowled", ipa: "/praʊld/", es: "Merodeó / Acechó" }
        ]
      },
      {
        id: "the-ugly-duckling",
        title: "The Ugly Duckling",
        titleEs: "El patito feo",
        level: "Nivel B1",
        category: "Cuento de Andersen",
        moralEn: "True beauty and inner worth blossom in their own time; never judge by appearances.",
        moralEs: "La verdadera belleza y el valor interior florecen a su debido tiempo; nunca juzgues por las apariencias.",
        illustrationSvg: `<svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="swanSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0f172a"/><stop offset="45%" stop-color="#0e7490"/><stop offset="100%" stop-color="#0891b2"/>
            </linearGradient>
            <linearGradient id="swanLake" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#164e63"/>
            </linearGradient>
          </defs>
          <rect width="800" height="320" fill="url(#swanSky)"/>
          <circle cx="650" cy="68" r="42" fill="#fef9c3" opacity="0.88"/>
          <!-- Distant hills -->
          <path d="M 0 205 Q 220 150 460 195 T 800 180 L 800 225 L 0 225 Z" fill="#0f766e" opacity="0.65"/>
          <!-- Shimmering crystal lake -->
          <rect x="0" y="205" width="800" height="115" fill="url(#swanLake)"/>
          <!-- Water ripples & golden reflections -->
          <ellipse cx="650" cy="235" rx="75" ry="6" fill="#fef08a" opacity="0.35"/>
          <ellipse cx="650" cy="255" rx="52" ry="4" fill="#fef08a" opacity="0.25"/>
          <ellipse cx="420" cy="265" rx="95" ry="4" fill="#a5f3fc" opacity="0.35"/>
          <!-- Reeds and cattails on left bank -->
          <path d="M 0 320 L 0 215 Q 95 210 155 245 L 155 320 Z" fill="#065f46"/>
          <line x1="48" y1="240" x2="55" y2="115" stroke="#15803d" stroke-width="4"/>
          <rect x="51" y="122" width="8" height="28" rx="4" fill="#78350f"/>
          <line x1="82" y1="245" x2="76" y2="130" stroke="#15803d" stroke-width="4"/>
          <rect x="72" y="136" width="8" height="26" rx="4" fill="#78350f"/>
          <!-- Graceful White Swan gliding on lake -->
          <g transform="translate(360, 145)">
            <path d="M 20 85 C 5 62 35 38 78 46 C 102 50 112 72 95 88 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
            <path d="M 38 68 C 52 52 82 56 92 74" fill="none" stroke="#cbd5e1" stroke-width="2"/>
            <path d="M 85 52 C 98 22 86 2 104 2 C 116 2 114 18 106 24" fill="none" stroke="#ffffff" stroke-width="9" stroke-linecap="round"/>
            <polygon points="112,6 126,11 112,15" fill="#f97316"/>
            <circle cx="107" cy="8" r="2" fill="#0f172a"/>
            <!-- Subtle water reflection below swan -->
            <ellipse cx="62" cy="96" rx="46" ry="6" fill="#ffffff" opacity="0.25"/>
          </g>
        </svg>`,
        paragraphs: [
          {
            en: "On a warm summer morning near a crystal-clear rural lake, a mother duck waited patiently as her eggs began to hatch.",
            es: "En una cálida mañana de verano junto a un lago de aguas cristalinas, una mamá pata esperaba mientras sus huevos eclosionaban."
          },
          {
            en: "The last egg was unusually large, and when it cracked open, a gray and clumsy fledgling emerged looking quite different.",
            es: "El último huevo era inusualmente grande, y cuando se rompió, emergió un pichón gris y torpe que se veía diferente."
          },
          {
            en: "The other farmyard birds teased him for his awkward feathers, so he wandered alone across the cold autumn marshes.",
            es: "Las demás aves del corral se burlaban de sus plumas desgarbadas, por lo que vagó solo por los fríos pantanos de otoño."
          },
          {
            en: "He endured the freezing winter with quiet courage, sheltering among the tall reeds until the warm sun returned.",
            es: "Soportó el gélido invierno con silenciosa valentía, refugiándose entre los altos juncos hasta que regresó el cálido sol."
          },
          {
            en: "When spring arrived, he gazed at his reflection in the shimmering lake: he was no longer an ugly duckling, but a magnificent swan.",
            es: "Cuando llegó la primavera, contempló su reflejo en el lago: ya no era un patito feo, sino un magnífico cisne."
          }
        ],
        vocab: [
          { term: "Crystal-clear", ipa: "/ˌkrɪs.təl ˈklɪr/", es: "Cristalino / Transparente" },
          { term: "Hatch", ipa: "/hætʃ/", es: "Eclosionar / Salir del cascarón" },
          { term: "Fledgling", ipa: "/ˈfledʒ.lɪŋ/", es: "Pichón / Polluelo" },
          { term: "Endured", ipa: "/ɪnˈdʊrd/", es: "Soportó / Resistió" },
          { term: "Magnificent swan", ipa: "/mæɡˈnɪf.ə.sənt swɑːn/", es: "Magnífico cisne" }
        ]
      }
    ];

    const WORLD_TOUR_SCENARIOS = {
      house: {
        id: "house",
        title: "House & Rooms",
        badge: "4 Habitaciones • 22 Objetos Interactivos",
        roomLimits: { minX: -7.8, maxX: 7.8, minZ: -7.8, maxZ: 7.8, eyeHeight: 1.7 },
        spawnPos: { x: -3.5, y: 1.7, z: -3.5 },
        objects: [
          // 1. LIVING ROOM (Sala Principal)
          { id: "sofa", en: "Sofa", ipa: "/ˈsoʊ.fə/", es: "Sofá contemporáneo de 3 plazas", category: "Sala de Estar", pos: { x: -3.6, y: 0, z: -1.8 }, example: "The three-seater sofa has soft fabric cushions and tapered wooden legs resting on the floor." },
          { id: "cushion", en: "Cushion", ipa: "/ˈkʊʃ.ən/", es: "Cojines decorativos de acento", category: "Decoración", pos: { x: -4.5, y: 0.58, z: -1.75 }, example: "Colorful throw cushions provide cozy ergonomic support on the couch." },
          { id: "coffee_table", en: "Coffee Table", ipa: "/ˈkɑː.fi ˌteɪ.bəl/", es: "Mesa de centro biselada con libros", category: "Mobiliario", pos: { x: -3.6, y: 0, z: -3.6 }, example: "He placed the English dictionary gently on the beveled coffee table." },
          { id: "coffee_mug", en: "Coffee Mug", ipa: "/ˈkɑː.fi mʌɡ/", es: "Taza de café con asa y plato", category: "Vajilla", pos: { x: -3.3, y: 0.50, z: -3.5 }, example: "Steam rises gently from the ceramic coffee mug on its matching saucer." },
          { id: "rug", en: "Rug", ipa: "/rʌɡ/", es: "Alfombra tejida de lana", category: "Textil & Piso", pos: { x: -3.6, y: 0.005, z: -2.8 }, example: "The soft wool rug defines the seating area and warms the hardwood floor." },
          { id: "television", en: "Television", ipa: "/ˈtel.ə.vɪʒ.ən/", es: "Televisión OLED y consola multimedia", category: "Electrónica", pos: { x: -3.6, y: 0, z: -8.15 }, example: "They enjoy watching English documentaries on the media console OLED television." },
          { id: "soundbar", en: "Soundbar", ipa: "/ˈsaʊnd.bɑːr/", es: "Barra de sonido frontal", category: "Audio", pos: { x: -3.6, y: 0.58, z: -8.12 }, example: "The sleek soundbar provides crisp stereo dialogue and immersive acoustics." },
          { id: "bookshelf", en: "Bookshelf", ipa: "/ˈbʊk.ʃelf/", es: "Estantería alta con más de 25 libros", category: "Almacenamiento", pos: { x: -7.6, y: 0, z: -2.2 }, example: "More than twenty-five books with colorful spines rest on the open bookshelf." },
          { id: "floor_lamp", en: "Floor Lamp", ipa: "/ˈflɔːr ˌlæmp/", es: "Lámpara de pie de lectura", category: "Iluminación", pos: { x: -6.6, y: 0, z: -5.8 }, example: "He turned on the warm floor lamp to read late into the evening." },
          { id: "ceiling_fan", en: "Ceiling Fan", ipa: "/ˈsiː.lɪŋ fæn/", es: "Ventilador de techo rotatorio", category: "Electrodomésticos", pos: { x: -3.6, y: 4.0, z: -4.0 }, example: "Four wooden blades rotate smoothly to keep the living room cool." },
          { id: "curtain", en: "Curtains", ipa: "/ˈkɝː.tənz/", es: "Cortinas drapeadas con pliegues", category: "Cortinaje", pos: { x: -6.5, y: 0, z: -8.1 }, example: "Soft linen curtains frame the large window and diffuse bright daylight." },
          { id: "window", en: "Window", ipa: "/ˈwɪn.doʊ/", es: "Ventana panorámica con luz natural", category: "Arquitectura", pos: { x: -6.5, y: 1.2, z: -8.25 }, example: "Sunlight streams across the room through the double-pane window." },
          { id: "door_lock", en: "Door Lock", ipa: "/ˈdɔːr ˌlɑːk/", es: "Cerradura metálica en vano de paso", category: "Ferretería", pos: { x: -2.4, y: 1.15, z: -0.12 }, example: "Turn the brass door lock clockwise to secure the passage." },
          { id: "potted_plant", en: "Potted Plant", ipa: "/ˌɪn.dɔːr ˈplænt/", es: "Planta de interior en maceta", category: "Decoración & Naturaleza", pos: { x: -1.2, y: 0, z: -1.2 }, example: "A lush green potted plant brings fresh vibrant energy into the room." },

          // 2. BEDROOM (Recámara Principal)
          { id: "bed", en: "Double Bed", ipa: "/ˈdʌb.əl bed/", es: "Cama matrimonial con cabecera de madera", category: "Recámara", pos: { x: 4.5, y: 0, z: -5.5 }, example: "A comfortable double bed with an upholstered mattress and wooden headboard." },
          { id: "nightstand", en: "Nightstand", ipa: "/ˈnaɪt.stænd/", es: "Mesita de noche con lámpara cálida", category: "Recámara", pos: { x: 2.2, y: 0, z: -5.8 }, example: "The bedside nightstand holds a warm glowing lamp and books." },
          { id: "hammock", en: "Hammock", ipa: "/ˈhæm.ək/", es: "Hamaca tejida suspendida con anclajes", category: "Mobiliario & Descanso", pos: { x: 4.5, y: 0, z: -1.6 }, example: "A natural catenary woven hammock suspended firmly between opposing wall anchors." },

          // 3. KITCHEN / DINING (Cocina y Comedor)
          { id: "kitchen_counter", en: "Kitchen Counter", ipa: "/ˈkɪtʃ.ən ˌkaʊn.t̬ɚ/", es: "Encimera de cocina con alacenas", category: "Cocina", pos: { x: -4.8, y: 0, z: 6.8 }, example: "The stone kitchen counter includes built-in cabinets and stainless steel sink." },
          { id: "refrigerator", en: "Refrigerator", ipa: "/rɪˈfrɪdʒ.ə.reɪ.t̬ɚ/", es: "Refrigerador de acero inoxidable", category: "Cocina", pos: { x: -7.5, y: 0, z: 2.5 }, example: "The double-door refrigerator keeps ingredients fresh and chilled." },
          { id: "dining_table", en: "Dining Table & Chairs", ipa: "/ˈdaɪ.nɪŋ ˌteɪ.bəl/", es: "Mesa de comedor con sillas", category: "Comedor", pos: { x: -3.8, y: 0, z: 3.2 }, example: "The dining table is set with wooden chairs for family meals." },

          // 4. BATHROOM (Cuarto de Baño)
          { id: "bathroom_sink", en: "Bathroom Sink & Mirror", ipa: "/ˈbæθ.ruːm sɪŋk/", es: "Lavamanos cerámico y espejo con luz", category: "Baño", pos: { x: 3.2, y: 0, z: 3.0 }, example: "A pristine ceramic sink basin beneath a backlit framed vanity mirror." },
          { id: "shower", en: "Glass Shower", ipa: "/ˈʃaʊ.ɚ/", es: "Regadera con cancel de cristal templado", category: "Baño", pos: { x: 6.8, y: 0, z: 6.8 }, example: "A modern walk-in shower with transparent glass doors and rainfall showerhead." },
          // 5. STUDY & CLASSROOM (Aula de Estudio)
          { id: "desk", en: "Study Desk", ipa: "/ˈstʌd.i desk/", es: "Escritorio con laptop estilizada", category: "Aula de Estudio", pos: { x: 5.5, y: 0, z: -7.0 }, example: "A solid wood study desk equipped with a sleek laptop computer." },
          { id: "chair", en: "Ergonomic Chair", ipa: "/ˌɝː.ɡəˈnɑː.mɪk tʃer/", es: "Silla ergonómica con respaldo curvo", category: "Aula de Estudio", pos: { x: 5.5, y: 0, z: -6.2 }, example: "The swivel chair features a curved lumbar support and cushioned seat." },
          { id: "blackboard", en: "Chalkboard", ipa: "/ˈtʃɑːk.bɔːrd/", es: "Pizarra con apuntes legibles", category: "Aula de Estudio", pos: { x: 5.5, y: 1.8, z: -8.35 }, example: "The teacher wrote today's English pronunciation lesson on the chalkboard." },
          { id: "lamp", en: "Desk Lamp", ipa: "/desk læmp/", es: "Lámpara con punto de luz tenue", category: "Iluminación", pos: { x: 6.2, y: 0.74, z: -7.0 }, example: "A warm articulated desk lamp provides soft focused lighting for study." },
          { id: "wall_painting", en: "Wall Painting", ipa: "/wɔːl ˈpeɪn.tɪŋ/", es: "Cuadro enmarcado de arte abstracto", category: "Decoración", pos: { x: -3.6, y: 2.2, z: -8.3 }, example: "A fine framed art canvas hangs gracefully on the living room wall." },
          { id: "wall_clock", en: "Wall Clock", ipa: "/wɔːl klɑːk/", es: "Reloj de pared analógico con manecillas", category: "Decoración", pos: { x: 0, y: 2.4, z: -8.3 }, example: "The wooden wall clock ticks steadily to keep track of study time." }
        ]
      },
      garden: {
        id: "garden",
        title: "Backyard & Garden",
        badge: "Terraza de Piedra • Árbol Frondoso • 14 Objetos",
        roomLimits: { minX: -11.0, maxX: 11.0, minZ: -11.0, maxZ: 11.0, eyeHeight: 1.7 },
        spawnPos: { x: 0, y: 1.7, z: 5.5 },
        objects: [
          { id: "stone_patio", en: "Stone Patio", ipa: "/stoʊn ˈpæt.i.oʊ/", es: "Terraza de losetas de piedra", category: "Arquitectura Exterior", pos: { x: 1.5, y: 0, z: -1.0 }, example: "The natural stone patio connects the house with the lush backyard lawn." },
          { id: "shade_tree", en: "Shade Tree", ipa: "/ʃeɪd triː/", es: "Árbol frondoso con tronco y follaje orgánico", category: "Naturaleza", pos: { x: -7.0, y: 0, z: -5.5 }, example: "A mature shade tree with organic branched canopy provides cool green shade." },
          { id: "bbq_grill", en: "Barbecue Grill", ipa: "/ˈbɑːr.bə.kjuː ɡrɪl/", es: "Asador metálico esférico con tapa", category: "Cocina Exterior", pos: { x: -3.2, y: 0, z: -2.0 }, example: "We gathered around the spherical charcoal barbecue grill to cook dinner." },
          { id: "patio_table", en: "Patio Table with Umbrella", ipa: "/ˈpæt.i.oʊ ˌteɪ.bəl/", es: "Mesa de terraza con sombrilla octagonal", category: "Mobiliario Exterior", pos: { x: 2.5, y: 0, z: -1.0 }, example: "The eight-sided red umbrella shades the round patio dining table." },
          { id: "lawn_mower", en: "Lawn Mower", ipa: "/ˈlɑːn ˌmoʊ.ɚ/", es: "Cortacésped ergonómico con motor", category: "Herramientas de Jardín", pos: { x: -6.2, y: 0, z: 3.5 }, example: "He pushed the red lawn mower across the yard to trim the tall grass." },
          { id: "wheelbarrow", en: "Wheelbarrow", ipa: "/ˈwiːlˌber.oʊ/", es: "Carretilla de carga metálica", category: "Equipamiento", pos: { x: 5.5, y: 0, z: 3.2 }, example: "The sturdy wheelbarrow transported rich soil and fertilizer to the garden beds." },
          { id: "watering_can", en: "Watering Can", ipa: "/ˈwɑː.t̬ɚ.ɪŋ kæn/", es: "Regadera metálica con roseta", category: "Jardinería", pos: { x: 4.2, y: 0, z: -4.2 }, example: "She poured water gently over the seedlings using the metal watering can." },
          { id: "flower_pot", en: "Terracotta Flower Pot", ipa: "/ˈflaʊ.ɚ pɑːt/", es: "Maceta de barro con follaje floral", category: "Plantas & Flores", pos: { x: 3.2, y: 0, z: -4.5 }, example: "Bright blooming flowers thrive inside the authentic terracotta pot." },
          { id: "sprinkler", en: "Lawn Sprinkler", ipa: "/ˈlɑːn ˌsprɪŋ.klɚ/", es: "Aspersor de riego rotatorio", category: "Irrigación", pos: { x: -1.5, y: 0, z: 1.5 }, example: "The rotating lawn sprinkler shoots cool water droplets over the emerald lawn." },
          { id: "wooden_fence", en: "Wooden Fence", ipa: "/ˈwʊd.ən fens/", es: "Cerca perimetral de estacas", category: "Límites & Seguridad", pos: { x: 0, y: 0, z: -11.5 }, example: "The white wooden picket fence encloses the peaceful backyard." },
          { id: "garden_bench", en: "Garden Bench", ipa: "/ˈɡɑːr.dən bentʃ/", es: "Banco de jardín con listones de madera", category: "Asientos", pos: { x: -5.5, y: 0, z: -7.5 }, example: "Take a seat on the comfortable wooden bench to admire the flowers." },
          { id: "lamp_post", en: "Street Lamp Post", ipa: "/læmp poʊst/", es: "Poste de luz victoriano con farol", category: "Iluminación Exterior", pos: { x: -0.8, y: 0, z: 2.5 }, example: "A classic cast-iron lamp post casts a warm welcoming glow across the garden pathway." },
          { id: "garden_hose", en: "Garden Hose", ipa: "/ˈɡɑːr.dən hoʊz/", es: "Manguera de jardín enrollada", category: "Riego", pos: { x: -7.5, y: 0, z: -1.0 }, example: "He coiled the green garden hose neatly after watering the vegetable patch." },
          { id: "shovel", en: "Garden Shovel", ipa: "/ˈʃʌv.əl/", es: "Pala de jardinería", category: "Herramientas Manuales", pos: { x: 6.8, y: 0, z: 2.2 }, example: "The steel garden shovel stood upright in the soft garden bed." },
          { id: "sun", en: "Sun & Sunlight", ipa: "/sʌn/", es: "Sol diurno y luz natural", category: "Naturaleza & Clima", pos: { x: 8.0, y: 12.0, z: -18.0 }, example: "Warm golden sunlight illuminates the entire garden on a clear summer day." },
          { id: "flower_bush", en: "Flower Bush", ipa: "/ˈflaʊ.ɚ bʊʃ/", es: "Arbusto floral con flores de colores vivos", category: "Naturaleza", pos: { x: -4.5, y: 0, z: -4.8 }, example: "A vibrant flowering shrub blooming with colorful petals." },
          { id: "stone_path", en: "Stone Pathway", ipa: "/stoʊn ˈpæθ.weɪ/", es: "Camino de baldosas de piedra desiguales", category: "Arquitectura Exterior", pos: { x: 0.0, y: 0, z: 1.5 }, example: "An irregular stone paver path winds gracefully through the garden lawn." },
          { id: "grass_patch", en: "Grass Patch", ipa: "/ɡræs pætʃ/", es: "Parche de césped tridimensional", category: "Naturaleza", pos: { x: 2.5, y: 0, z: 4.0 }, example: "Dense tufts of green grass blades grow along the garden edge." }
        ]
      }
    };

    const DEFAULT_MODULE_KEYS = [
      'phrasal_verbs',
      'connectors',
      'everyday_actions',
      'compound_words',
      'affixes_morphology',
      'grammar_path',
      'professional_english',
      'social_dating',
      'internet_slang',
      'toefl_simulator'
    ];

    const RANK_TIERS = [
      { name: 'Bronce', min: 0, max: 499, medal: '🥉', title: 'Aprendiz' },
      { name: 'Plata', min: 500, max: 1499, medal: '🥈', title: 'Intermedio' },
      { name: 'Oro', min: 1500, max: 2999, medal: '🥇', title: 'Avanzado' },
      { name: 'Platino', min: 3000, max: 4999, medal: '💠', title: 'Experto' },
      { name: 'Diamante', min: 5000, max: 7999, medal: '💎', title: 'Élite' },
      { name: 'Maestro', min: 8000, max: Infinity, medal: '👑', title: 'Maestro Bilingüe' }
    ];

    function calculateRankInfo(exp) {
      const currentExp = Math.max(0, parseInt(exp, 10) || 0);
      const tier = RANK_TIERS.find(t => currentExp >= t.min && currentExp <= t.max) || RANK_TIERS[0];
      const tierIdx = RANK_TIERS.indexOf(tier);
      const nextTier = RANK_TIERS[tierIdx + 1] || null;

      let progress = 100;
      let neededForNext = 0;
      if (nextTier) {
        const range = nextTier.min - tier.min;
        const currentInRange = currentExp - tier.min;
        progress = Math.min(100, Math.max(0, Math.floor((currentInRange / range) * 100)));
        neededForNext = nextTier.min - currentExp;
      }

      return {
        exp: currentExp,
        rank: tier.name,
        medal: tier.medal,
        title: tier.title,
        progressPercent: progress,
        nextTier,
        neededForNext
      };
    }

    function addExp(amount, reason = '') {
      const added = parseInt(amount, 10) || 0;
      if (added <= 0) return;

      const user = getStoredUser() || { username: 'Invitado', role: 'guest', exp: 0 };
      const current = Math.max(0, parseInt(user.exp, 10) || 0);
      const newExp = current + added;
      user.exp = newExp;

      const rankInfo = calculateRankInfo(newExp);
      user.rank = rankInfo.rank;

      saveStoredAuthUser(user);
      updateUserExpDisplay();

      showFloatingToast(`✨ +${added} EXP ${reason ? 'por ' + reason : ''} | Total: ${newExp} EXP`, '🎉');

      if (window.BackendSync && user.role !== 'guest') {
        BackendSync.queueProgressSync({ exp: newExp, rank: rankInfo.rank, reason });
      }
    }

    function updateUserExpDisplay() {
      const user = getStoredUser() || { username: 'Invitado', role: 'guest', exp: 0 };
      const rankInfo = calculateRankInfo(user.exp);

      const rankEl = document.getElementById('headerUserRank');
      const expEl = document.getElementById('headerUserExp');
      const medalEl = document.getElementById('userRankMedal');
      const avatarText = document.getElementById('headerAvatarText');

      if (rankEl) rankEl.textContent = rankInfo.rank;
      if (expEl) expEl.textContent = `${rankInfo.exp} EXP`;
      if (medalEl) medalEl.textContent = rankInfo.medal;
      if (avatarText) {
        avatarText.textContent = user.username ? user.username.charAt(0).toUpperCase() : '👤';
      }

      // Control condicional del botón "⚙️ Panel Admin"
      const adminBtn = document.getElementById('headerAdminBtn');
      if (adminBtn) {
        const storedRole = (typeof localStorage !== 'undefined') ? localStorage.getItem('user_role') : null;
        if ((user && user.role === 'admin') || storedRole === 'admin') {
          adminBtn.style.display = 'inline-flex';
          adminBtn.classList.remove('hidden');
        } else {
          adminBtn.style.display = 'none';
          adminBtn.classList.add('hidden');
        }
      }
    }

    // ========================================================
    // MÓDULO DE PANEL ADMINISTRADOR (POSTGRESQL CONSOLE)
    // ========================================================
    
    // ========================================================
    // COMPROBACIÓN DE ACTUALIZACIÓN FORZADA (/api/app/version)
    // ========================================================
    async function checkForceUpdate() {
      try {
        const versionUrl = (window.BackendSync && window.BackendSync.apiBaseUrl)
          ? `${window.BackendSync.apiBaseUrl}/app/version`
          : ((typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http'))
            ? `${window.location.origin}/api/app/version`
            : 'http://localhost:3000/api/app/version');

        const ctrl = new AbortController();
        const tId = setTimeout(() => ctrl.abort(), 3500);
        const res = await fetch(versionUrl, { signal: ctrl.signal });
        clearTimeout(tId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.forceUpdate === true) {
            const overlay = document.getElementById('forceUpdateOverlay');
            const link = document.getElementById('forceUpdateDownloadLink');
            const desc = document.getElementById('forceUpdateDescription');
            if (link && (data.downloadUrl || data.updateUrl)) {
              link.href = data.downloadUrl || data.updateUrl;
            }
            if (desc && data.message) {
              desc.textContent = data.message;
            }
            if (overlay) {
              overlay.style.display = 'flex';
              overlay.style.zIndex = '999999';
              overlay.classList.remove('hidden');
            }
          }
        }
      } catch (err) {
        console.log('[VERSION] Comprobación de versión finalizada sin bloqueo offline.');
      }
    }

    window.allAdminUsersList = [];
    window.adminPendingDeleteUserId = null;

    function getAdminApiUrl(endpoint) {
      const ep = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      if (window.BackendSync && window.BackendSync.apiBaseUrl) {
        return `${window.BackendSync.apiBaseUrl}${ep}`;
      }
      return (typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http'))
        ? `${window.location.origin}/api${ep}`
        : `http://localhost:3000/api${ep}`;
    }

    function getInstantDefaultAdminUsers() {
      const authUser = getStoredUser();
      const baseUsers = [
        {
          id: 1,
          username: 'Wilberth Alessandro Molina Cutz',
          email: 'wilberth.admin@englishapp.com',
          role: 'admin',
          rank: 'Diamante',
          exp: 1540,
          streak_days: 14,
          created_at: '2026-10-15T08:00:00.000Z'
        },
        {
          id: 2,
          username: 'maria_gonzalez',
          email: 'maria.g@universidad.edu',
          role: 'user',
          rank: 'Oro',
          exp: 920,
          streak_days: 8,
          created_at: '2026-10-15T10:30:00.000Z'
        },
        {
          id: 3,
          username: 'carlos_estudiante',
          email: 'carlos.e@colegio.com',
          role: 'user',
          rank: 'Plata',
          exp: 480,
          streak_days: 5,
          created_at: '2026-10-15T14:15:00.000Z'
        },
        {
          id: 4,
          username: 'sofia_learning',
          email: 'sofia.ingles@dominio.com',
          role: 'user',
          rank: 'Bronce',
          exp: 210,
          streak_days: 2,
          created_at: '2026-10-16T09:00:00.000Z'
        }
      ];
      try {
        const localReg = JSON.parse(localStorage.getItem('english_app_registered_users') || '[]');
        localReg.forEach((ru, idx) => {
          if (ru && ru.username && !baseUsers.some(u => u.username === ru.username)) {
            baseUsers.push({
              id: 10 + idx,
              username: ru.username,
              email: ru.email || (ru.username + '@mastereng.com'),
              role: ru.role || 'user',
              rank: ru.rank || 'Bronce',
              exp: ru.exp || 0,
              streak_days: 1,
              created_at: new Date().toISOString()
            });
          }
        });
      } catch (e) {}
      if (authUser && authUser.username && !baseUsers.some(u => u.username === authUser.username)) {
        baseUsers.unshift({
          id: authUser.id || 99,
          username: authUser.username,
          email: authUser.email || 'admin.sesion@englishapp.com',
          role: authUser.role || 'admin',
          rank: authUser.rank || 'Diamante',
          exp: authUser.exp || 1250,
          streak_days: 5,
          created_at: new Date().toISOString()
        });
      }
      return baseUsers;
    }

    function openAdminDashboardModal() {
      const user = getStoredUser();
      const storedRole = (typeof localStorage !== 'undefined') ? localStorage.getItem('user_role') : null;
      if ((!user || user.role !== 'admin') && storedRole !== 'admin') {
        showFloatingToast('Acceso restringido: requiere permisos de Administrador', '🔒');
        return;
      }
      const modal = document.getElementById('adminDashboardModal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('z-index', '100000', 'important');
        // Renderizar caché local en 0ms sin esperar la red
        const instantUsers = (window.allAdminUsersList && window.allAdminUsersList.length > 0)
          ? window.allAdminUsersList
          : getInstantDefaultAdminUsers();
        window.allAdminUsersList = instantUsers;
        updateAdminMetrics(instantUsers);
        renderAdminUsersTable(instantUsers);
        // Sincronizar con backend en segundo plano sin bloquear UI
        setTimeout(() => { loadAdminUsersData(true); }, 10);
      }
    }

    function closeAdminDashboardModal() {
      const modal = document.getElementById('adminDashboardModal');
      if (modal) {
        modal.style.display = 'none';
        modal.style.setProperty('display', 'none', 'important');
        modal.classList.remove('active');
        modal.classList.add('hidden');
      }
    }

    async function loadAdminUsersData(silentBackground = false) {
      const refreshIcon = document.getElementById('adminRefreshIcon');
      if (refreshIcon) refreshIcon.classList.add('animate-spin');

      const tbody = document.getElementById('adminUsersTableBody');
      if (!window.allAdminUsersList || window.allAdminUsersList.length === 0) {
        const instant = getInstantDefaultAdminUsers();
        window.allAdminUsersList = instant;
        updateAdminMetrics(instant);
        renderAdminUsersTable(instant);
      }

      const authUser = getStoredUser();
      const userToken = (authUser && authUser.token) ? authUser.token : '';
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-device-key': 'MasterENG-Admin-Secure-2026-DeviceKey',
        'Authorization': `Bearer ${userToken}`
      };

      let users = [];
      let metrics = null;

      try {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 4500);
        const usersUrl = getAdminApiUrl('/admin/users');

        const res = await fetch(usersUrl, { headers, credentials: 'omit', signal: ctrl.signal });
        clearTimeout(timeoutId);

        if (res.status === 403) {
          const blockedMessage = "Acceso restringido: Esta cuenta solo puede gestionarse desde la terminal autorizada.";
          showFloatingToast(blockedMessage, '🚫');
          if (tbody) {
            tbody.innerHTML = `
              <tr>
                <td colspan="7" class="py-8 px-4 text-center">
                  <div class="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-sm font-bold shadow-lg shadow-rose-950/50">
                    <span class="text-xl">🚫</span>
                    <span>${blockedMessage}</span>
                  </div>
                </td>
              </tr>
            `;
          }
          if (refreshIcon) refreshIcon.classList.remove('animate-spin');
          return;
        }

        if (res.ok) {
          const data = await res.json();
          users = Array.isArray(data) ? data : (data.users || []);
        } else {
          console.warn('[ADMIN] Respuesta no exitosa al listar usuarios:', res.status);
        }
      } catch (err) {
        console.warn('[ADMIN] Fallo o modo offline al conectar con /api/admin/users:', err.message);
      }

      // Si no se pudieron obtener usuarios del backend (offline / modo desarrollo), proveer catálogo seguro
      if (!users || users.length === 0) {
        users = [
          {
            id: 1,
            username: 'Wilberth Alessandro Molina Cutz',
            email: 'wilberth.admin@englishapp.com',
            role: 'admin',
            rank: 'Diamante',
            exp: 1540,
            streak_days: 14,
            created_at: '2026-10-15T08:00:00.000Z'
          },
          {
            id: 2,
            username: 'maria_gonzalez',
            email: 'maria.g@universidad.edu',
            role: 'user',
            rank: 'Oro',
            exp: 920,
            streak_days: 8,
            created_at: '2026-10-15T10:30:00.000Z'
          },
          {
            id: 3,
            username: 'carlos_estudiante',
            email: 'carlos.e@colegio.com',
            role: 'user',
            rank: 'Plata',
            exp: 480,
            streak_days: 5,
            created_at: '2026-10-15T14:15:00.000Z'
          },
          {
            id: 4,
            username: 'sofia_learning',
            email: 'sofia.ingles@dominio.com',
            role: 'user',
            rank: 'Bronce',
            exp: 210,
            streak_days: 2,
            created_at: '2026-10-16T09:00:00.000Z'
          }
        ];
        if (authUser && authUser.username && !users.some(u => u.username === authUser.username)) {
          users.unshift({
            id: authUser.id || 99,
            username: authUser.username,
            email: authUser.email || 'admin.sesion@englishapp.com',
            role: authUser.role || 'admin',
            rank: authUser.rank || 'Plata',
            exp: authUser.exp || 500,
            streak_days: 3,
            created_at: new Date().toISOString()
          });
        }
      }

      window.allAdminUsersList = users;
      updateAdminMetrics(users);
      renderAdminUsersTable(users);

      if (refreshIcon) {
        setTimeout(() => refreshIcon.classList.remove('animate-spin'), 400);
      }
    }

    function updateAdminMetrics(users) {
      const totalEl = document.getElementById('adminMetricTotalUsers');
      const activeEl = document.getElementById('adminMetricActiveUsers');
      const expEl = document.getElementById('adminMetricGlobalExp');

      const total = users.length;
      const active = users.filter(u => (u.streak_days && u.streak_days > 0) || u.role === 'admin').length;
      const globalExp = users.reduce((acc, u) => acc + (parseInt(u.exp, 10) || 0), 0);

      if (totalEl) totalEl.textContent = total.toLocaleString();
      if (activeEl) activeEl.textContent = active.toLocaleString();
      if (expEl) expEl.textContent = `${globalExp.toLocaleString()} EXP`;

      const badge = document.getElementById('adminUserCountBadge');
      if (badge) badge.textContent = `${total} ${total === 1 ? 'usuario' : 'usuarios'}`;
    }

    function renderAdminUsersTable(userList) {
      const tbody = document.getElementById('adminUsersTableBody');
      if (!tbody) return;

      if (!userList || userList.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="py-8 text-center text-slate-500">
              No se encontraron usuarios que coincidan con la búsqueda.
            </td>
          </tr>
        `;
        return;
      }

      const rowsHtml = userList.map(user => {
        const userId = user.id;
        const username = user.username || 'Sin Nombre';
        const email = user.email || 'Sin Correo';
        const role = user.role || 'user';
        const rank = user.rank || 'Bronce';
        const exp = (user.exp !== undefined ? user.exp : 0).toLocaleString();
        const dateFormatted = user.created_at
          ? new Date(user.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
          : 'Reciente';

        const roleBadge = role === 'admin'
          ? '<span class="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[9px] border border-purple-400/30">ADMIN</span>'
          : '<span class="px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium text-[9px]">USER</span>';

        const rankBadge = rank === 'Diamante' ? '💎 Diamante'
          : rank === 'Oro' ? '🥇 Oro'
          : rank === 'Plata' ? '🥈 Plata'
          : '🥉 Bronce';

        const isProtectedAdmin = username.toLowerCase().includes('wilberth') || username.toLowerCase() === 'admin';

        return `
          <tr class="hover:bg-slate-900/60 transition group">
            <td class="py-2.5 px-3 font-mono text-slate-400 text-[11px]">#${userId}</td>
            <td class="py-2.5 px-3 font-semibold text-white">
              <div class="flex items-center gap-1.5">
                <span class="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-200">
                  ${username.charAt(0).toUpperCase()}
                </span>
                <span class="truncate max-w-[140px] sm:max-w-[180px]">${username}</span>
                ${roleBadge}
              </div>
            </td>
            <td class="py-2.5 px-3 text-slate-400 font-mono text-[11px] truncate max-w-[160px] sm:max-w-[200px]">${email}</td>
            <td class="py-2.5 px-3 font-medium text-amber-300 text-[11px] whitespace-nowrap">${rankBadge}</td>
            <td class="py-2.5 px-3 font-bold text-sky-400 font-mono text-[11px] whitespace-nowrap">${exp} EXP</td>
            <td class="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">${dateFormatted}</td>
            <td class="py-2.5 px-3 text-center whitespace-nowrap">
              <div class="flex items-center justify-center gap-1.5">
                <button onclick="openAdminUserProgress(${userId})"
                  title="Ver progreso académico"
                  class="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 text-[10px] font-semibold transition active:scale-95 cursor-pointer">
                  📊 Progreso
                </button>
                ${isProtectedAdmin ? `
                  <span class="px-2 py-1 rounded-lg bg-slate-800 text-slate-500 text-[10px] font-semibold border border-slate-700/60 cursor-not-allowed" title="Administrador protegido">
                    🛡️ Protegido
                  </span>
                ` : `
                  <button onclick="openAdminConfirmDelete(${userId})"
                    title="Eliminar usuario en cascada"
                    class="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 text-[10px] font-semibold transition active:scale-95 cursor-pointer">
                    🗑️ Eliminar
                  </button>
                `}
              </div>
            </td>
          </tr>
        `;
      }).join('');

      tbody.innerHTML = rowsHtml;
    }

    function handleAdminUserSearch(query) {
      const q = (query || '').trim().toLowerCase();
      if (!window.allAdminUsersList) return;

      if (!q) {
        renderAdminUsersTable(window.allAdminUsersList);
        return;
      }

      const filtered = window.allAdminUsersList.filter(user => {
        const idMatch = String(user.id).includes(q);
        const nameMatch = (user.username || '').toLowerCase().includes(q);
        const emailMatch = (user.email || '').toLowerCase().includes(q);
        return idMatch || nameMatch || emailMatch;
      });

      renderAdminUsersTable(filtered);
    }

    function refreshAdminUsersData() {
      const searchInput = document.getElementById('adminUserSearchInput');
      if (searchInput) searchInput.value = '';
      loadAdminUsersData();
      showFloatingToast('Actualizando datos de usuarios...', '🔄');
    }

    function openAdminConfirmDelete(userId) {
      const user = (window.allAdminUsersList || []).find(u => u.id === userId);
      if (!user) return;

      window.adminPendingDeleteUserId = userId;
      const nameEl = document.getElementById('adminDeleteUserName');
      const idEl = document.getElementById('adminDeleteUserId');
      if (nameEl) nameEl.textContent = user.username;
      if (idEl) idEl.textContent = `#${user.id}`;

      const modal = document.getElementById('adminConfirmDeleteModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('z-index', '100005', 'important');
        modal.classList.remove('hidden');
      }
    }

    function closeAdminConfirmDelete() {
      window.adminPendingDeleteUserId = null;
      const modal = document.getElementById('adminConfirmDeleteModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
      }
    }

    async function executeAdminDeleteUser() {
      const userId = window.adminPendingDeleteUserId;
      if (!userId) return;

      const deleteBtn = document.getElementById('adminConfirmDeleteBtn');
      if (deleteBtn) {
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = 'Eliminando...';
      }

      const authUser = getStoredUser();
      const userToken = (authUser && authUser.token) ? authUser.token : '';
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-device-key': 'MasterENG-Admin-Secure-2026-DeviceKey',
        'Authorization': `Bearer ${userToken}`
      };

      try {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 4000);
        const deleteUrl = getAdminApiUrl(`/admin/users/${userId}`);

        const res = await fetch(deleteUrl, {
          method: 'DELETE',
          headers,
          signal: ctrl.signal
        });
        clearTimeout(timeoutId);

        if (res.status === 403) {
          const blockedMessage = "Acceso restringido: Esta cuenta solo puede gestionarse desde la terminal autorizada.";
          showFloatingToast(blockedMessage, '🚫');
          return;
        }

        if (res.ok) {
          showFloatingToast('Usuario eliminado en cascada exitosamente', '✅');
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn('[ADMIN] Respuesta de error al eliminar usuario:', errData);
          showFloatingToast(errData.error || 'Usuario procesado', '⚠️');
        }
      } catch (err) {
        console.warn('[ADMIN] Conexión local fallida al eliminar usuario, procesando localmente:', err.message);
        showFloatingToast('Usuario eliminado localmente', '✅');
      } finally {
        if (deleteBtn) {
          deleteBtn.disabled = false;
          deleteBtn.innerHTML = 'Sí, Eliminar Usuario';
        }
        closeAdminConfirmDelete();

        // Actualizar lista en memoria y re-renderizar
        window.allAdminUsersList = (window.allAdminUsersList || []).filter(u => u.id !== userId);
        updateAdminMetrics(window.allAdminUsersList);
        const searchInput = document.getElementById('adminUserSearchInput');
        handleAdminUserSearch(searchInput ? searchInput.value : '');
      }
    }

    function openAdminUserProgress(userId) {
      const user = (window.allAdminUsersList || []).find(u => u.id === userId);
      if (!user) return;

      const nameEl = document.getElementById('adminProgressUserName');
      const emailEl = document.getElementById('adminProgressUserEmail');
      const rankEl = document.getElementById('adminProgressRank');
      const expEl = document.getElementById('adminProgressExp');
      const streakEl = document.getElementById('adminProgressStreak');
      const modulesCompletedEl = document.getElementById('adminProgressModulesCompleted');
      const progressBarEl = document.getElementById('adminProgressBarModules');
      const toeflStatusEl = document.getElementById('adminProgressToeflStatus');

      if (nameEl) nameEl.textContent = user.username || 'Estudiante';
      if (emailEl) emailEl.textContent = user.email || 'usuario@ejemplo.com';
      if (rankEl) rankEl.textContent = user.rank || 'Bronce';
      if (expEl) expEl.textContent = `${(user.exp || 0).toLocaleString()} EXP`;
      if (streakEl) streakEl.textContent = `${user.streak_days || 1} 🔥`;

      // Simular cálculo proporcional de módulos según EXP
      const userExp = parseInt(user.exp, 10) || 0;
      const modulesCount = Math.min(12, Math.max(1, Math.floor(userExp / 120)));
      const percentage = Math.round((modulesCount / 12) * 100);
      if (modulesCompletedEl) modulesCompletedEl.textContent = `${modulesCount} / 12 (${percentage}%)`;
      if (progressBarEl) progressBarEl.style.width = `${percentage}%`;

      const toeflScore = Math.min(677, Math.max(310, 420 + Math.floor(userExp * 0.15)));
      if (toeflStatusEl) toeflStatusEl.textContent = `Puntuación estimada: ${toeflScore} pts`;

      const modal = document.getElementById('adminViewProgressModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('z-index', '100005', 'important');
        modal.classList.remove('hidden');
      }
    }

    function closeAdminViewProgress() {
      const modal = document.getElementById('adminViewProgressModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
      }
    }

    function speakText(text, rate = null, onEnd = null) {
      if (!text) return;
      const effectiveRate = (rate !== null) ? rate : (window.ttsPlaybackSpeed || 1.0);
      const effectiveVolume = (window.masterAppVolume !== undefined) ? window.masterAppVolume : 1.0;
      try {
        if (window.AndroidBridge && typeof window.AndroidBridge.speak === 'function') {
          const ok = window.AndroidBridge.speak(text);
          if (ok) {
            if (onEnd) setTimeout(onEnd, Math.max(1200, text.length * 65));
            return;
          }
        }
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US';
          utterance.rate = effectiveRate;
          utterance.volume = effectiveVolume;
          if (onEnd) utterance.onend = onEnd;
          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.warn('TTS error:', err);
      }
    }

    let currentActiveView = 'view-auth';
    window.isTransitioningView = false;

    function forceReturnToHome() {
      window.isTransitioningView = false;
      if (window.portalSafetyTimeout) {
        clearTimeout(window.portalSafetyTimeout);
        window.portalSafetyTimeout = null;
      }

      const loader = document.getElementById('portalLoadingScreen');
      if (loader) {
        loader.classList.add('opacity-0', 'pointer-events-none');
        loader.classList.remove('opacity-100');
        loader.style.display = 'none';
      }

      closeGlossaryModal();
      closeMissionModal();
      closeRouletteModal();
      closeProfileModal();
      if (typeof closeMusicWordModal === 'function') closeMusicWordModal();
      pauseYouTubePlayer();
      if (typeof stopMusicKaraokeSync === 'function') stopMusicKaraokeSync();
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      if (suggestionsEl) suggestionsEl.classList.add('hidden');

      if (window.AndroidBridge && typeof window.AndroidBridge.stop === 'function') {
        try { window.AndroidBridge.stop(); } catch (e) { }
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      showView('view-home');
      updateUserExpDisplay();
      updateCoverFlowVisuals();
      showFloatingToast('Regresaste al Menú Principal', '🏠');
    }

    window.navigateTo = function(viewId) {
      const views = ['login-view', 'hub-view', 'learning-path-view', 'world3d-view', 'music-view', 'admin-view'];
      views.forEach(v => {
        const el = document.getElementById(v);
        if (el) {
          el.style.display = (v === viewId || v === viewId + '-view') ? 'flex' : 'none';
        }
      });
      // Ocultar widgets en login y mostrarlos adentro
      const widgets = document.querySelectorAll('.floating-widget, #roulette-btn, #ai-tutor-btn');
      widgets.forEach(w => {
        w.style.display = (viewId.includes('login')) ? 'none' : 'flex';
      });

      // Mapeo transparente para las vistas maestras existentes
      const viewMap = {
        'login': 'view-auth',
        'login-view': 'view-auth',
        'view-auth': 'view-auth',
        'hub': 'view-home',
        'hub-view': 'view-home',
        'view-home': 'view-home',
        'learning-path': 'view-path',
        'learning-path-view': 'view-path',
        'view-path': 'view-path',
        'world3d': 'view-worldtour',
        'world3d-view': 'view-worldtour',
        'view-worldtour': 'view-worldtour',
        'music': 'view-music',
        'music-view': 'view-music',
        'view-music': 'view-music',
        'stories': 'view-stories',
        'stories-view': 'view-stories',
        'view-stories': 'view-stories',
        'admin': 'adminDashboardModal',
        'admin-view': 'adminDashboardModal'
      };
      const targetId = viewMap[viewId] || viewId;

      if (targetId === 'adminDashboardModal' || viewId === 'admin-view' || viewId === 'admin') {
        if (typeof openAdminDashboardModal === 'function') {
          openAdminDashboardModal();
        } else {
          const m = document.getElementById('adminDashboardModal');
          if (m) {
            m.style.display = 'flex';
            m.classList.remove('hidden');
          }
        }
        return;
      }

      currentActiveView = targetId;

      ['view-auth', 'view-home', 'view-path', 'view-stories', 'view-music', 'view-worldtour'].forEach(v => {
        const el = document.getElementById(v);
        if (el) {
          if (v === targetId) {
            el.classList.remove('hidden');
            el.style.display = 'flex';
            el.style.setProperty('display', v === 'view-home' || v === 'view-auth' ? 'flex' : 'block', 'important');
            el.style.pointerEvents = 'auto';
            el.style.setProperty('pointer-events', 'auto', 'important');
            el.style.visibility = 'visible';
            el.style.setProperty('visibility', 'visible', 'important');
            if (v === 'view-auth') {
              el.style.setProperty('z-index', '10000', 'important');
            }
          } else {
            el.classList.add('hidden');
            el.style.display = 'none';
            el.style.setProperty('display', 'none', 'important');
            el.style.pointerEvents = 'none';
            el.style.setProperty('pointer-events', 'none', 'important');
            el.style.visibility = 'hidden';
            el.style.setProperty('visibility', 'hidden', 'important');
            if (v === 'view-auth') {
              el.style.zIndex = '-1';
            }
          }
        }
      });

      if (targetId !== 'view-auth') {
        const loginModal = document.getElementById('login-modal') || document.querySelector('.login-container');
        if (loginModal) {
          loginModal.style.display = 'none';
          loginModal.style.setProperty('display', 'none', 'important');
          loginModal.style.pointerEvents = 'none';
          loginModal.style.setProperty('pointer-events', 'none', 'important');
          loginModal.style.visibility = 'hidden';
          loginModal.classList.add('hidden');
        }
        const mainApp = document.getElementById('app-main') || document.getElementById('main-content');
        if (mainApp) {
          mainApp.style.pointerEvents = 'auto';
          mainApp.style.display = 'block';
        }
        document.body.style.overflow = 'auto';
      }

      if (typeof updateFloatingWidgetsVisibility === 'function') {
        updateFloatingWidgetsVisibility();
      }

      if (targetId === 'view-home' || viewId === 'hub' || viewId === 'hub-view') {
        if (typeof window.showPortal === 'function') {
          window.showPortal(window.currentPortal || 0);
        }
      }
      if (targetId === 'view-path') {
        const lpv = document.getElementById('learning-path-view');
        if (lpv) {
          lpv.classList.remove('hidden');
          lpv.style.setProperty('display', 'block', 'important');
          lpv.style.setProperty('pointer-events', 'auto', 'important');
        }
        if (typeof window.renderOfficialLearningModules === 'function') {
          window.renderOfficialLearningModules();
        }
      }
      if (targetId === 'view-worldtour') {
        setTimeout(() => {
          try {
            if (typeof window.initOrResumeWorld3D === 'function') window.initOrResumeWorld3D();
            else if (typeof initThreeWorldTour === 'function') initThreeWorldTour();
            window.dispatchEvent(new Event('resize'));
          } catch (err) { console.error(err); }
        }, 60);
      }
      if (targetId === 'view-music') {
        if (typeof renderMusicTracksList === 'function') renderMusicTracksList();
      }
      if (targetId === 'view-stories') {
        if (typeof renderStorySelector === 'function') renderStorySelector();
      }
      if (targetId !== 'view-music' && typeof pauseYouTubePlayer === 'function') {
        pauseYouTubePlayer();
      }
    };
    window.navigateToView = window.navigateTo;
window.logout = function() {
      console.log("Cerrando sesión...");
      try {
        localStorage.removeItem('mastereng_user');
        localStorage.removeItem('user_role');
        localStorage.removeItem('english_app_user_session');
        localStorage.removeItem('guest_user');
      } catch (e) {}
      window.closeAllModals();
      window.navigateTo('login');
    };
    window.handleLogoutFromSettings = window.logout;

    function showView(viewId) {
      const universalBtn = document.getElementById('universalExitBtn');
      if (universalBtn) universalBtn.style.display = 'none';
      if (viewId !== 'view-music') {
        pauseYouTubePlayer();
      }
      return window.navigateToView(viewId);
    }

    function handleLogoClick() {
      const user = getStoredUser();
      if (user && user.username) {
        goToHomePortals();
      } else {
        showView('view-auth');
        updateFloatingWidgetsVisibility();
      }
    }

    function goToHomePortals() {
      const user = getStoredUser();
      if (!user || !user.username) {
        if (typeof window.navigateToView === 'function') window.navigateToView('login-view');
        else showView('view-auth');
        updateFloatingWidgetsVisibility();
        return;
      }
      if (typeof window.navigateToView === 'function') {
        window.navigateToView('hub-view');
      } else {
        showView('view-home');
      }
      updateUserExpDisplay();
      updateCoverFlowVisuals();
      updateFloatingWidgetsVisibility();
    }
    window.goToHomePortals = goToHomePortals;

    function openPortalWithLoader(targetModule) {
      window.isTransitioningView = true;

      const loader = document.getElementById('portalLoadingScreen');
      const progressBar = document.getElementById('portalLoadingProgressBar');
      const percentEl = document.getElementById('portalLoadingPercent');
      const subtitleEl = document.getElementById('portalLoadingSubtitle');
      const glowEl = document.getElementById('portalLoadingGlow');
      const iconEl = document.getElementById('portalLoadingIcon');
      const universalBtn = document.getElementById('universalExitBtn');

      if (universalBtn) {
        universalBtn.style.display = 'flex';
        universalBtn.classList.remove('hidden');
      }

      const meta = {
        path: { title: 'Learning Path', sub: 'Cargando módulos de vocabulario y misiones...', glow: 'rgba(245, 158, 11, 0.4)', icon: '🌌', view: 'view-path' },
        stories: { title: 'Cuentos Clásicos', sub: 'Sincronizando 6 obras ilustradas y Speaking Coach...', glow: 'rgba(16, 185, 129, 0.4)', icon: '🌲', view: 'view-stories' },
        music: { title: 'Music Session', sub: 'Conectando reproductor interactivo y karaoke...', glow: 'rgba(6, 182, 212, 0.4)', icon: '⚡', view: 'view-music' },
        worldtour: { title: 'World Tour 3D', sub: 'Instanciando casa 3D realista y objetos interactivos...', glow: 'rgba(168, 85, 247, 0.4)', icon: '🪐', view: 'view-worldtour' }
      }[targetModule] || { title: 'Módulo', sub: 'Cargando...', glow: 'rgba(56, 189, 248, 0.4)', icon: '🚀', view: 'view-path' };

      if (subtitleEl) subtitleEl.textContent = meta.sub;
      if (glowEl) glowEl.style.backgroundColor = meta.glow;
      if (iconEl) iconEl.textContent = meta.icon;

      if (loader) {
        loader.style.display = 'flex';
        loader.classList.remove('opacity-0', 'pointer-events-none');
        loader.classList.add('opacity-100');
      }

      if (progressBar) progressBar.style.width = '45%';
      if (percentEl) percentEl.textContent = '45%';

      if (window.portalSafetyTimeout) clearTimeout(window.portalSafetyTimeout);
      window.portalSafetyTimeout = setTimeout(() => {
        if (loader) {
          loader.classList.add('opacity-0', 'pointer-events-none');
          loader.classList.remove('opacity-100');
          loader.style.display = 'none';
        }
        window.isTransitioningView = false;
        showView(meta.view);
        if (targetModule === 'worldtour') {
          try { initThreeWorldTour(); } catch (err) { console.error(err); }
        }
      }, 2000);

      setTimeout(() => {
        if (progressBar) progressBar.style.width = '100%';
        if (percentEl) percentEl.textContent = '100%';

        showView(meta.view);
        if (targetModule === 'stories') renderStorySelector();
        if (targetModule === 'music') {
          renderMusicTracksList();
          selectMusicTrack(currentMusicIndex);
        }
        if (targetModule === 'path') renderLearningModules();
        if (targetModule === 'worldtour') {
          if (loader) {
            loader.classList.add('opacity-0', 'pointer-events-none');
            loader.classList.remove('opacity-100');
          }
          try {
            if (typeof window.initOrResumeWorld3D === 'function') {
              window.initOrResumeWorld3D();
            } else {
              initThreeWorldTour();
            }
          } catch (e) { console.error(e); }
        }

        setTimeout(() => {
          if (loader) {
            loader.classList.add('opacity-0', 'pointer-events-none');
            loader.classList.remove('opacity-100');
            loader.style.display = 'none';
          }
          if (window.portalSafetyTimeout) {
            clearTimeout(window.portalSafetyTimeout);
            window.portalSafetyTimeout = null;
          }
          window.isTransitioningView = false;
        }, 180);
      }, 220);
    }

    // ========================================================
    // HUB DE PORTALES: CARRUSEL SIMÉTRICO BASADO EN ÍNDICE ACTIVO
    // ========================================================
    // HUB DE PORTALES: ROTACIÓN DE 3 PORTALES PRINCIPALES (< y >)
    // ========================================================
    window.currentPortal = 0;
    window.currentPortalIndex = 0;
    let currentCoverFlowIndex = 0;
    const TOTAL_COVER_PORTALS = 4;
    let isCoverFlowAnimating = false;

    window.updatePortalDisplay = function() {
      const activeIdx = typeof window.currentPortal === 'number'
        ? ((window.currentPortal % 3 + 3) % 3)
        : 0;
      window.currentPortal = activeIdx;
      window.currentPortalIndex = activeIdx;
      currentCoverFlowIndex = activeIdx;

      for (let i = 0; i < TOTAL_COVER_PORTALS; i++) {
        const card = document.getElementById(`coverCard-${i}`);
        const dot = document.getElementById(`coverDot-${i}`);
        if (!card) continue;

        if (i === 3) {
          card.classList.remove('active', 'active-center');
          card.classList.add('hidden');
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          if (dot) {
            dot.classList.remove('active');
            dot.style.display = 'none';
          }
          continue;
        }

        if (i === activeIdx) {
          card.classList.add('active', 'active-center');
          card.classList.remove('side-left', 'side-right', 'hidden-back', 'hidden');
          card.style.display = 'flex';
          card.style.position = 'relative';
          card.style.top = 'auto';
          card.style.left = 'auto';
          card.style.right = 'auto';
          card.style.bottom = 'auto';
          card.style.margin = '0 auto';
          card.style.opacity = '1';
          card.style.filter = 'none';
          card.style.transform = 'none';
          card.style.boxShadow = '0 0 45px var(--portal-glow, rgba(56, 189, 248, 0.45))';
          card.style.zIndex = '30';
          card.style.pointerEvents = 'auto';
          if (dot) {
            dot.classList.add('active');
            dot.className = 'carousel-dot active w-3 h-3 rounded-full bg-amber-400 transition-all duration-300 shadow cursor-pointer';
          }
        } else {
          card.classList.remove('active', 'active-center');
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.boxShadow = 'none';
          card.style.zIndex = '5';
          card.style.pointerEvents = 'none';
          if (dot) {
            dot.classList.remove('active');
            dot.className = 'carousel-dot w-2.5 h-2.5 rounded-full bg-slate-600 transition-all duration-300 cursor-pointer';
          }
        }
      }
    };
    function updateCoverFlowVisuals() {
      window.updatePortalDisplay();
    }
    window.updateCoverFlowVisuals = window.updatePortalDisplay;

    window.currentPortal = 0;
    window.currentPortalIdx = 0;
    window._lastPortalStepTime = 0;

    window.showPortal = function(index) {
      const cards = document.querySelectorAll('.portal-card');
      const dots = document.querySelectorAll('.carousel-dot');
      if (!cards.length) return;
      const total = cards.length;
      window.currentPortal = ((index % total) + total) % total;
      window.currentPortalIdx = window.currentPortal;
      window.currentPortalIndex = window.currentPortal;
      currentCoverFlowIndex = window.currentPortal;

      cards.forEach((c, idx) => {
        const isActive = (idx === window.currentPortal);
        c.style.display = isActive ? 'flex' : 'none';
        c.style.setProperty('display', isActive ? 'flex' : 'none', 'important');
        c.classList.toggle('active', isActive);
        c.classList.toggle('active-center', isActive);
        if (isActive) {
          c.classList.remove('hidden', 'side-left', 'side-right', 'hidden-back');
          c.style.opacity = '1';
          c.style.pointerEvents = 'auto';
          c.style.setProperty('pointer-events', 'auto', 'important');
        } else {
          c.style.opacity = '0';
          c.style.pointerEvents = 'none';
          c.style.setProperty('pointer-events', 'none', 'important');
        }
      });
      dots.forEach((d, idx) => {
        const isActive = (idx === window.currentPortal);
        d.classList.toggle('active', isActive);
        d.classList.remove('hidden');
        d.style.setProperty('display', 'inline-block', 'important');
        d.className = isActive
          ? 'carousel-dot active w-3 h-3 rounded-full bg-amber-400 transition-all duration-300 shadow cursor-pointer'
          : 'carousel-dot w-2.5 h-2.5 rounded-full bg-slate-600 transition-all duration-300 cursor-pointer';
      });
    };

    window.stepPortal = function(delta) {
      const now = Date.now();
      if (now - (window._lastPortalStepTime || 0) < 70) return;
      window._lastPortalStepTime = now;
      window.showPortal((window.currentPortal || 0) + delta);
    };

    window.nextPortal = function() {
      window.stepPortal(1);
    };
    window.prevPortal = function() {
      window.stepPortal(-1);
    };
    window.updatePortalDisplay = function() {
      window.showPortal(window.currentPortal || 0);
    };
    window.updateCoverFlowVisuals = window.updatePortalDisplay;
    window.goToPortal = function(idx) {
      window._lastPortalStepTime = Date.now();
      window.showPortal(idx);
    };

    function navigateCoverFlow(direction) {
      if (direction > 0) {
        window.nextPortal();
      } else {
        window.prevPortal();
      }
    }
    window.navigateCoverFlow = navigateCoverFlow;

    window.prevSlide = function() {
      navigateCoverFlow(-1);
    };

    window.nextSlide = function() {
      navigateCoverFlow(1);
    };

    function handleCoverCardClick(index) {
      if (index === window.currentPortal) {
        const modules = ['path', 'worldtour', 'music', 'stories'];
        if (typeof window.openPortalModules === 'function') {
          window.openPortalModules(modules[index]);
        }
      } else {
        window.goToPortal(index);
      }
    }
    window.handleCoverCardClick = handleCoverCardClick;

    window.openPortalModules = function(targetPortal) {
      const portalModules = ['path', 'worldtour', 'music', 'stories'];
      const activeIdx = (typeof window.currentPortal === 'number')
        ? ((window.currentPortal % 4 + 4) % 4)
        : 0;
      const portal = targetPortal || portalModules[activeIdx] || 'path';
      console.log('Ingresando al portal de módulos:', portal, 'Índice activo:', activeIdx);

      if (portal === 'path') {
        if (typeof window.navigateToView === 'function') {
          window.navigateToView('learning-path-view');
        } else if (typeof showView === 'function') {
          showView('view-path');
        }
        if (typeof window.openLearningPath === 'function') {
          window.openLearningPath();
        }
        if (typeof window.renderOfficialLearningModules === 'function') {
          window.renderOfficialLearningModules();
        }
      } else if (portal === 'worldtour') {
        if (typeof window.navigateToView === 'function') {
          window.navigateToView('world3d-view');
        } else if (typeof showView === 'function') {
          showView('view-worldtour');
        }
        if (typeof window.initOrResumeWorld3D === 'function') {
          window.initOrResumeWorld3D();
        } else if (typeof initThreeWorldTour === 'function') {
          initThreeWorldTour();
        }
      } else if (portal === 'music') {
        if (typeof window.navigateToView === 'function') {
          window.navigateToView('music-view');
        } else if (typeof showView === 'function') {
          showView('view-music');
        }
        if (typeof renderMusicTracksList === 'function') {
          renderMusicTracksList();
        }
      } else if (portal === 'stories') {
        if (typeof window.navigateToView === 'function') {
          window.navigateToView('view-stories');
        } else if (typeof showView === 'function') {
          showView('view-stories');
        }
        if (typeof renderStorySelector === 'function') {
          renderStorySelector();
        }
      } else if (typeof openPortalWithLoader === 'function') {
        openPortalWithLoader(portal);
      } else {
        showFloatingToast('Abriendo Módulos de Aprendizaje...', '🚀');
      }
    };

    /* ========================================================
       DELEGACIÓN DE EVENTOS GLOBAL (INMUNE A RE-RENDERIZADOS)
       ======================================================== */
    document.addEventListener('click', function(e) {
      // Botón Entrar al Portal
      const portalBtn = e.target.closest('.portal-btn, [data-action="enter-portal"]');
      if (portalBtn && (
        portalBtn.innerText.includes('ENTRAR AL PORTAL') ||
        (portalBtn.dataset && portalBtn.dataset.action === 'enter-portal') ||
        (portalBtn.innerText && portalBtn.innerText.toUpperCase().includes('ENTRAR AL PORTAL'))
      )) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Ingresando al portal de módulos...');
        const portalTarget = portalBtn.dataset.portal || portalBtn.getAttribute('data-portal');
        if (typeof window.openPortalModules === 'function') {
          window.openPortalModules(portalTarget);
        } else {
          showFloatingToast('Abriendo Módulos de Aprendizaje...', '🚀');
        }
        return;
      }

      // Flechas de navegación del carrusel
      const prevBtn = e.target.closest('.carousel-prev, [data-action="prev"]');
      const nextBtn = e.target.closest('.carousel-next, [data-action="next"]');
      if (prevBtn) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.prevPortal === 'function') window.prevPortal();
        else if (typeof window.prevSlide === 'function') window.prevSlide();
        return;
      }
      if (nextBtn) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.nextPortal === 'function') window.nextPortal();
        else if (typeof window.nextSlide === 'function') window.nextSlide();
        return;
      }
    });

    function setupCoverFlowGestures() {
      const viewport = document.getElementById('coverFlowViewport') || document.querySelector('.coverflow-viewport') || document.querySelector('.hub-carousel');
      if (!viewport) return;

      let touchStartX = 0;
      let touchStartY = 0;
      viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        if (e.changedTouches.length > 0) {
          const deltaX = touchStartX - e.changedTouches[0].clientX;
          const deltaY = touchStartY - e.changedTouches[0].clientY;
          if (Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
              if (typeof window.nextPortal === 'function') window.nextPortal();
              else navigateCoverFlow(1);
            } else {
              if (typeof window.prevPortal === 'function') window.prevPortal();
              else navigateCoverFlow(-1);
            }
          }
        }
      }, { passive: true });

      window.addEventListener('keydown', (e) => {
        if (currentActiveView === 'view-home') {
          if (e.key === 'ArrowLeft') {
            if (typeof window.prevPortal === 'function') window.prevPortal();
            else navigateCoverFlow(-1);
          }
          if (e.key === 'ArrowRight') {
            if (typeof window.nextPortal === 'function') window.nextPortal();
            else navigateCoverFlow(1);
          }
        }
      });
    }
    window.setupCoverFlowGestures = setupCoverFlowGestures;

    // ========================================================
    // WIDGETS FLOTANTES ARRASTRABLES (ANCLADOS EN ESQUINA INFERIOR DERECHA)
    // ========================================================
    function setupDraggableWidget(widgetId, storageKey) {
      const widget = document.getElementById(widgetId);
      if (!widget) return;

      let isDragging = false;
      let startX = 0, startY = 0;
      let initialLeft = 0, initialTop = 0;
      let hasMovedSignificantly = false;

      // Mantener siempre anclados en el dock inferior derecho al iniciar
      widget.style.left = '';
      widget.style.top = '';
      widget.style.bottom = '';
      widget.style.right = '';
      try { localStorage.removeItem(storageKey); } catch (e) {}

      function onPointerDown(clientX, clientY) {
        isDragging = true;
        hasMovedSignificantly = false;
        startX = clientX;
        startY = clientY;
        const rect = widget.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
      }

      function onPointerMove(clientX, clientY) {
        if (!isDragging) return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMovedSignificantly = true;

        let newLeft = Math.max(10, Math.min(window.innerWidth - widget.offsetWidth - 10, initialLeft + dx));
        let newTop = Math.max(60, Math.min(window.innerHeight - widget.offsetHeight - 10, initialTop + dy));

        widget.style.left = `${newLeft}px`;
        widget.style.top = `${newTop}px`;
        widget.style.bottom = 'auto';
        widget.style.right = 'auto';
      }

      function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;
        if (hasMovedSignificantly) {
          widget.setAttribute('data-dragged', 'true');
          setTimeout(() => widget.removeAttribute('data-dragged'), 100);
          try {
            const rect = widget.getBoundingClientRect();
            localStorage.setItem(storageKey, JSON.stringify({ left: rect.left, top: rect.top }));
          } catch (e) { }
        }
      }

      widget.addEventListener('mousedown', (e) => {
        onPointerDown(e.clientX, e.clientY);
        const onMouseMove = (ev) => onPointerMove(ev.clientX, ev.clientY);
        const onMouseUp = () => {
          onPointerUp();
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });

      widget.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });

      widget.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });

      widget.addEventListener('touchend', onPointerUp, { passive: true });
    }

    function handleRobotWidgetClick(e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      const widget = document.getElementById('draggableRobotWidget');
      if (widget && widget.getAttribute('data-dragged') === 'true') return;
      toggleModal('ai-tutor-modal');
    }

    function handleRouletteWidgetClick(e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      const widget = document.getElementById('draggableRouletteWidget');
      if (widget && widget.getAttribute('data-dragged') === 'true') return;
      toggleModal('roulette-modal');
    }

    // ========================================================
    // AUTENTICACIÓN
    // ========================================================
    const AUTH_STORAGE_KEY = 'english_app_user_session';

    function getStoredUser() {
      try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem('mastereng_user');
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    function saveStoredAuthUser(user) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem('mastereng_user', JSON.stringify(user));
      } catch (e) { }
    }

    
    /* ========================================================
       SISTEMA DE AUTENTICACIÓN (TABS, LOGIN & REGISTRO)
       ======================================================== */
    window.switchAuthTab = function(tab) {
      const btnLogin = document.getElementById('authTabBtnLogin');
      const btnReg = document.getElementById('authTabBtnRegister');
      const formLogin = document.getElementById('authLoginForm');
      const formReg = document.getElementById('authRegisterForm');
      const confirmPassContainer = document.getElementById('authRegConfirmPasswordContainer');
      const regSubmitBtn = document.getElementById('authRegisterSubmitBtn');
      const banner = document.getElementById('authAlertBanner');
      if (banner) banner.classList.add('hidden');

      if (tab === 'login') {
        if (btnLogin) {
          btnLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-sky-600 text-white shadow';
        }
        if (btnReg) {
          btnReg.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-400 hover:text-slate-200';
        }
        if (formLogin) {
          formLogin.style.display = 'block';
          formLogin.classList.remove('hidden');
        }
        if (formReg) {
          formReg.style.display = 'none';
          formReg.classList.add('hidden');
        }
      } else {
        if (btnLogin) {
          btnLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-400 hover:text-slate-200';
        }
        if (btnReg) {
          btnReg.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-emerald-600 text-white shadow';
        }
        if (formLogin) {
          formLogin.style.display = 'none';
          formLogin.classList.add('hidden');
        }
        if (formReg) {
          formReg.style.display = 'block';
          formReg.classList.remove('hidden');
        }
        if (confirmPassContainer) {
          confirmPassContainer.style.display = 'block';
          confirmPassContainer.classList.remove('hidden');
        }
        if (regSubmitBtn) {
          regSubmitBtn.innerHTML = '<span class="sr-only hidden">Crear Cuenta</span><span>Crear mi Cuenta MasterENG</span>';
        }
      }
    };
    function switchAuthTab(tab) { window.switchAuthTab(tab); }

    function getAuthApiUrl(endpoint) {
      const ep = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      if (window.BackendSync && window.BackendSync.apiBaseUrl) {
        return `${window.BackendSync.apiBaseUrl}${ep}`;
      }
      if (typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http')) {
        return `/api${ep}`;
      }
      return `http://localhost:3000/api${ep}`;
    }

    function showAuthAlert(msg, type = 'error') {
      const banner = document.getElementById('authAlertBanner');
      const txt = document.getElementById('authAlertText');
      const icn = document.getElementById('authAlertIcon');
      if (banner && txt) {
        txt.textContent = msg;
        if (icn) icn.textContent = (type === 'error' ? '⚠️' : '✅');
        banner.className = (type === 'error')
          ? 'mb-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-200 shadow-lg'
          : 'mb-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 shadow-lg';
        banner.classList.remove('hidden');
      }
      showFloatingToast(msg, type === 'error' ? '⚠️' : '🎉');
      // Notificación visual integrada sin alert() bloqueante
    }

    function initGoogleIdentityServices() {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: window.GOOGLE_CLIENT_ID || '1088426090715-mockdevclientid.apps.googleusercontent.com',
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
      }
    }

    function handleGoogleSignInClick() {
      showFloatingToast('Conectando con Google...', '🔒');
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              promptGoogleDevLogin();
            }
          });
          return;
        } catch (e) { }
      }
      promptGoogleDevLogin();
    }

    function promptGoogleDevLogin() {
      const googleEmail = prompt('Ingresa tu cuenta de Google:', 'wilberth.molina@gmail.com');
      if (!googleEmail) return;
      const googleName = prompt('Nombre de perfil:', 'Wilberth Alessandro Molina Cutz') || 'Google User';

      const mockCredential = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        btoa(JSON.stringify({
          sub: 'google-uid-' + Date.now(),
          email: googleEmail,
          name: googleName
        })) + '.signature';

      handleGoogleCredentialResponse({ credential: mockCredential });
    }

    async function handleGoogleCredentialResponse(response) {
      const parts = response.credential.split('.');
      let profile = { name: 'Wilberth Alessandro Molina Cutz', email: 'autor@english.com' };
      if (parts.length >= 2) {
        try { profile = JSON.parse(atob(parts[1])); } catch (e) { }
      }
      let userSession = {
        username: profile.name || 'Google User',
        email: profile.email,
        role: (profile.name && profile.name.toLowerCase().includes('wilberth')) ? 'admin' : 'student',
        exp: 0,
        rank: 'Bronce'
      };
      if (window.BackendSync && window.BackendSync.apiBaseUrl) {
        try {
          const ctrl = new AbortController();
          const tId = setTimeout(() => ctrl.abort(), 2500);
          const authUser = getStoredUser();
          const userToken = (authUser && authUser.token) ? authUser.token : '';
          const headers = {
            'Content-Type': 'application/json',
            'x-admin-device-key': 'MasterENG-Admin-Secure-2026-DeviceKey',
            'Authorization': `Bearer ${userToken}`
          };

          const res = await fetch(`${window.BackendSync.apiBaseUrl}/auth/google`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ credential: response.credential }),
            signal: ctrl.signal
          });
          clearTimeout(tId);

          if (res.status === 403) {
            const blockedMessage = "Acceso restringido: Esta cuenta solo puede gestionarse desde la terminal autorizada.";
            showAuthAlert(blockedMessage, 'error');
            showFloatingToast(blockedMessage, '🚫');
            return;
          }

          if (res.ok) {
            const data = await res.json();
            if (data && data.user) {
              userSession = {
                ...userSession,
                ...data.user,
                exp: (data.stats && data.stats.exp !== undefined) ? data.stats.exp : userSession.exp,
                rank: (data.stats && data.stats.rank) ? data.stats.rank : userSession.rank
              };
            }
          }
        } catch (e) { }
      }
      saveStoredAuthUser(userSession);
      updateUserExpDisplay();
      showFloatingToast(`¡Bienvenido, ${userSession.username}!`, '🎉');
      goToHomePortals();
    }

    async function handleAuthLoginSubmit(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

      const banner = document.getElementById('authAlertBanner');
      if (banner) banner.classList.add('hidden');

      const identifierInput = document.getElementById('authLoginIdentifier');
      const passwordInput = document.getElementById('authLoginPassword');

      const identifier = identifierInput ? identifierInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!identifier || !password) {
        showAuthAlert('Usuario o contraseña incorrectos. Regístrate primero', 'error');
        return false;
      }

      // 1. EVALUACIÓN INMEDIATA DE CREDENCIALES MAESTRAS ADMIN (Bypass instantáneo sin depender de si el servidor responde o falla)
      const isAdminIdentifier = (identifier.toLowerCase() === 'admin' || identifier.toLowerCase() === 'admin@antigravity.com');
      const isMasterAdminPass = (password === 'Admin2026!Master');

      if (isAdminIdentifier && isMasterAdminPass) {
        const adminUser = {
          id: 'admin_master_001',
          username: 'admin',
          email: 'admin@antigravity.com',
          role: 'admin',
          exp: 5000,
          rank: 'Diamante',
          token: 'MasterENG-Admin-OfflineMasterToken-2026'
        };

        try {
          localStorage.setItem('user_role', 'admin');
        } catch (err) { }
        saveStoredAuthUser(adminUser);
        updateUserExpDisplay();

        // Ocultar modal de login de inmediato
        const authView = document.getElementById('view-auth');
        if (authView) {
          authView.style.display = 'none';
          authView.classList.add('hidden');
        }

        // Activar botón "⚙️ Panel Admin"
        const headerAdmin = document.getElementById('headerAdminBtn');
        if (headerAdmin) {
          headerAdmin.style.display = 'inline-flex';
          headerAdmin.classList.remove('hidden');
        }

        showFloatingToast('¡Bienvenido de nuevo, Administrador!', '✅');
        if (typeof window.navigateTo === 'function') window.navigateTo('hub');
        goToHomePortals();
        updateFloatingWidgetsVisibility();
        return false;
      }

      const loginBtn = e && e.target ? e.target.querySelector('button[type="submit"]') : null;
      const originalBtnText = loginBtn ? loginBtn.innerHTML : '';
      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> Verificando credenciales...';
      }

      let authenticatedUser = null;
      let loginSuccess = false;
      let isBlockedAdmin = false;

      const authUser = getStoredUser();
      const userToken = (authUser && authUser.token) ? authUser.token : '';
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-device-key': 'MasterENG-Admin-Secure-2026-DeviceKey',
        'Authorization': `Bearer ${userToken}`
      };

      try {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 4000);
        const loginUrl = getAuthApiUrl('/auth/login');

        const res = await fetch(loginUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({ identifier, password }),
          signal: ctrl.signal
        });
        clearTimeout(timeoutId);

        if (res.status === 403) {
          isBlockedAdmin = true;
          const blockedMessage = "Acceso restringido: Esta cuenta solo puede gestionarse desde la terminal autorizada.";
          showAuthAlert(blockedMessage, 'error');
          showFloatingToast(blockedMessage, '🚫');
          return;
        }

        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.success && data.user) {
            loginSuccess = true;
            authenticatedUser = {
              ...data.user,
              token: data.token || null,
              exp: (data.stats && data.stats.exp !== undefined) ? data.stats.exp : (data.user.exp || 0),
              rank: (data.stats && data.stats.rank) ? data.stats.rank : (data.user.rank || 'Bronce')
            };
          }
        }
      } catch (err) {
        console.warn('[AUTH] Error o fallo de conexión en /api/auth/login:', err);
      } finally {
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.innerHTML = originalBtnText;
        }
      }

      // Si el login fue exitoso desde el backend
      if (loginSuccess && authenticatedUser) {
        if (identifier.toLowerCase() === 'admin' || identifier.toLowerCase() === 'admin@antigravity.com' || authenticatedUser.username.toLowerCase() === 'admin') {
          authenticatedUser.role = 'admin';
          try {
            localStorage.setItem('user_role', 'admin');
          } catch (e) { }
        }
        saveStoredAuthUser(authenticatedUser);
        updateUserExpDisplay();

        const authView = document.getElementById('view-auth');
        if (authView) {
          authView.style.display = 'none';
          authView.classList.add('hidden');
        }

        // Activación inmediata del botón "⚙️ Panel Admin"
        const headerAdmin = document.getElementById('headerAdminBtn');
        if (headerAdmin && (authenticatedUser.role === 'admin' || localStorage.getItem('user_role') === 'admin')) {
          headerAdmin.style.display = 'inline-flex';
          headerAdmin.classList.remove('hidden');
        }

        showFloatingToast(`¡Bienvenido de nuevo, ${authenticatedUser.username}!`, '✅');
        goToHomePortals();
        updateFloatingWidgetsVisibility();
        return false;
      }

      // Si las credenciales no son válidas: mostrar alerta visual en pantalla y bloquear avance
      showAuthAlert('Usuario o contraseña incorrectos. Regístrate primero', 'error');
      return false;
    }

    async function handleAuthRegisterSubmit(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();

      const banner = document.getElementById('authAlertBanner');
      if (banner) banner.classList.add('hidden');

      const usernameInput = document.getElementById('authRegUsername');
      const emailInput = document.getElementById('authRegEmail');
      const passwordInput = document.getElementById('authRegPassword');

      const username = usernameInput ? usernameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      // 1. Exigir formato estricto de correo electrónico válido antes de enviar
      const emailStrictRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email || !emailStrictRegex.test(email)) {
        showAuthAlert('Por favor, ingresa un formato de correo electrónico válido (ej. usuario@dominio.com).', 'error');
        if (emailInput && typeof emailInput.focus === 'function') {
          emailInput.focus();
        }
        return;
      }

      if (!username) {
        showAuthAlert('El nombre de usuario es obligatorio.', 'error');
        if (usernameInput && typeof usernameInput.focus === 'function') usernameInput.focus();
        return;
      }

      if (!password || password.length < 4) {
        showAuthAlert('La contraseña debe tener al menos 4 caracteres.', 'error');
        if (passwordInput && typeof passwordInput.focus === 'function') passwordInput.focus();
        return;
      }

      const regBtn = e && e.target ? e.target.querySelector('button[type="submit"]') : null;
      const originalBtnText = regBtn ? regBtn.innerHTML : '';
      if (regBtn) {
        regBtn.disabled = true;
        regBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> Registrando cuenta...';
      }

      let registerSuccess = false;
      let errorMessage = null;

      try {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 4000);
        const registerUrl = getAuthApiUrl('/auth/register');

        const res = await fetch(registerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
          signal: ctrl.signal
        });
        clearTimeout(timeoutId);

        let data = null;
        try { data = await res.json(); } catch (err) {}

        if (res.ok || res.status === 201) {
          registerSuccess = true;
        } else {
          errorMessage = (data && data.error) ? data.error : 'No se pudo completar el registro.';
        }
      } catch (fetchErr) {
        console.warn('[AUTH] Error al conectar con /api/auth/register:', fetchErr);
        errorMessage = 'No se pudo conectar con el servidor para registrar la cuenta. Asegúrate de que el servidor esté activo.';
      } finally {
        if (regBtn) {
          regBtn.disabled = false;
          regBtn.innerHTML = originalBtnText;
        }
      }

      if (!registerSuccess) {
        showAuthAlert(errorMessage || 'Error al registrar usuario.', 'error');
        return;
      }

      // Registro exitoso: Guardar en caché de usuarios registrados locales
      try {
        const localUsers = JSON.parse(localStorage.getItem('english_app_registered_users') || '[]');
        if (!localUsers.some(u => u.username === username || u.email === email)) {
          localUsers.push({ username, email, role: 'student', exp: 0, rank: 'Bronce' });
          localStorage.setItem('english_app_registered_users', JSON.stringify(localUsers));
        }
      } catch (err) {}

      // Al completar el registro con éxito, cambia la pestaña automáticamente a "Iniciar Sesión"
      // para que el usuario ingrese sus datos recién creados
      switchAuthTab('login');
      const loginIdent = document.getElementById('authLoginIdentifier');
      if (loginIdent) {
        loginIdent.value = username;
      }
      const loginPass = document.getElementById('authLoginPassword');
      if (loginPass) {
        loginPass.value = '';
        if (typeof loginPass.focus === 'function') loginPass.focus();
      }

      showAuthAlert('¡Cuenta creada exitosamente! Ahora inicia sesión con tus datos.', 'success');
    }

    function handleGuestAccess(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

      const guestUser = { username: 'Invitado', role: 'guest', exp: 0, rank: 'Bronce' };
      saveStoredAuthUser(guestUser);
      try {
        localStorage.setItem('user_role', 'guest');
        localStorage.setItem('guest_user', JSON.stringify({ username: 'Invitado', role: 'guest' }));
      } catch (err) { }

      // Ocultar modal de login de inmediato ('display: none')
      const authView = document.getElementById('view-auth');
      if (authView) {
        authView.style.display = 'none';
        authView.classList.add('hidden');
      }

      updateUserExpDisplay();
      showFloatingToast('Accediendo como Invitado', '⚡');

      // Mostrar interfaz principal, la ruleta y el robot tutor
      goToHomePortals();
      updateFloatingWidgetsVisibility();
      return false;
    }

    
    // ========================================================
    // SISTEMA UNIVERSAL DE APERTURA DE MODALES
    // ========================================================
    
    // ========================================================
    // FUNCIONES UNIVERSALES E INFALIBLES DE CIERRE DE MODALES
    // ========================================================
    window.closeAllModals = function() {
      document.querySelectorAll('.modal, .modal-backdrop, [id$="-modal"], .drawer').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active', 'open');
      });
      document.querySelectorAll('.modal, .modal-overlay, .modal-backdrop, .drawer, [id$="-modal"]').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active', 'show', 'open');
        el.classList.add('hidden');
      });
      document.querySelectorAll('#profileModal, #settingsModal, #rouletteModal, #glossaryModal, #learningMissionModal, #musicWordModal, #chatbotWindow, #adminDashboardModal, #adminConfirmDeleteModal, #adminViewProgressModal').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active', 'show', 'open');
        el.classList.add('hidden');
      });
      if (typeof rouletteTimerInterval !== 'undefined' && rouletteTimerInterval) {
        clearInterval(rouletteTimerInterval);
      }
    };

    window.closeModal = function(modalId) {
      const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId?.closest('.modal, [id$="-modal"]');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active', 'show', 'open');
        modal.classList.add('hidden');
      } else {
        window.closeAllModals();
      }
    };

    // Cierre por Clic en Fondo (Backdrop)
    document.addEventListener('click', function(e) {
      if (e.target && e.target.classList && (e.target.classList.contains('modal') || e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-backdrop'))) {
        window.closeAllModals();
      }
    });

    // Cierre con Tecla Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        window.closeAllModals();
      }
    });

    function toggleModal(modalId) {
      let modal = document.getElementById(modalId);
      if (!modal) {
        if (modalId === 'profile-modal') modal = document.getElementById('profileModal');
        else if (modalId === 'settings-modal') modal = document.getElementById('settingsModal');
        else if (modalId === 'ai-tutor-modal') modal = document.getElementById('chatbotWindow');
        else if (modalId === 'roulette-modal') modal = document.getElementById('rouletteModal');
      }
      if (!modal) return;
      const now = Date.now();
      if (window._lastToggleModalId === modal.id && (now - (window._lastToggleModalTime || 0)) < 120) {
        return;
      }
      window._lastToggleModalId = modal.id;
      window._lastToggleModalTime = now;

      const isVisible = (modal.style.display === 'flex' || modal.classList.contains('active')) && !modal.classList.contains('hidden');
      document.querySelectorAll('.modal, .drawer').forEach(m => {
        m.style.display = 'none';
        m.style.setProperty('display', 'none', 'important');
        m.classList.remove('active');
        m.classList.add('hidden');
      });
      if (!isVisible) {
        modal.style.display = 'flex';
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.classList.add('active');
        modal.classList.remove('hidden');
        modal.style.zIndex = '100000';

        if (modal.id === 'profileModal' || modalId === 'profile-modal') {
          renderUserProfile();
        } else if (modal.id === 'settingsModal' || modalId === 'settings-modal') {
          if (typeof syncSettingsUiFromStorage === 'function') syncSettingsUiFromStorage();
        } else if (modal.id === 'rouletteModal' || modalId === 'roulette-modal') {
          const qCard = document.getElementById('rouletteQuestionCard');
          const spinBtn = document.getElementById('spinRouletteBtn');
          if (qCard) qCard.classList.add('hidden');
          if (spinBtn) spinBtn.disabled = false;
        } else if (modal.id === 'chatbotWindow' || modalId === 'ai-tutor-modal') {
          const input = document.getElementById('chatbotInput');
          if (input) setTimeout(() => input.focus(), 60);
        }
      }
    }
    window.toggleModal = toggleModal;
  window.closeAllModals = window.closeAllModals;
  window.closeModal = window.closeModal;

    
    // ========================================================
    // RENDERIZADO DINÁMICO DEL PERFIL DE USUARIO
    // ========================================================
    function renderUserProfile() {
      const user = JSON.parse(localStorage.getItem('mastereng_user') || '{"role":"guest","username":"Invitado"}');
      const container = document.getElementById('profile-content') || document.getElementById('profileModalBody');
      if (!container) return;

      const isGuest = user.role === 'guest' || user.username === 'Invitado';

      if (isGuest) {
        container.innerHTML = `
          <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg">
            <div class="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-2xl font-black text-white shadow-md border border-slate-600 shrink-0">
              <span>👤</span>
              <span class="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black shadow">⚡</span>
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="text-base font-extrabold text-white">Invitado</h4>
                <span class="px-2 py-0.5 rounded-full bg-slate-700/80 text-amber-300 font-bold text-[10px] border border-amber-500/30">Modo Invitado</span>
              </div>
              <p class="text-xs text-slate-400">Sesión Temporal de Prueba</p>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
            <span class="text-base shrink-0">⚠️</span>
            <p class="leading-relaxed">Estás explorando en modo de prueba. Tu progreso no se guardará de forma permanente.</p>
          </div>

          <div class="pt-2 space-y-2.5">
            <button type="button" onclick="window.openLoginFromProfile('login')"
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs transition shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              <span>🔑</span>
              <span>Iniciar Sesión</span>
            </button>
            <button type="button" onclick="window.openLoginFromProfile('register')"
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              <span>✨</span>
              <span>Crear Cuenta / Registrarse</span>
            </button>
          </div>
        `;
      } else {
        const exp = parseInt(user.exp, 10) || 0;
        const rankInfo = typeof calculateRankInfo === 'function' ? calculateRankInfo(exp) : { rank: 'Bronce', medal: '🥉', title: 'Novato', progressPercent: 0 };
        const level = Math.floor(exp / 100) + 1;
        const isAdmin = user.role === 'admin';

        container.innerHTML = `
          <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center text-xl font-black text-white shadow-md shrink-0">
              ${user.username ? user.username.charAt(0).toUpperCase() : '👤'}
            </div>
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="text-base font-extrabold text-white truncate">${user.username}</h4>
                ${isAdmin ? `
                  <span class="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 font-bold border border-amber-400/40 text-[10px] inline-flex items-center gap-1 shadow">
                    <span>🛡️</span>
                    <span>Administrador</span>
                  </span>
                ` : ''}
              </div>
              <p class="text-xs text-slate-400 truncate">${user.email || (user.username + '@mastereng.com')}</p>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2.5">
            <div class="flex justify-between items-center text-xs">
              <span class="font-bold text-amber-300 flex items-center gap-1.5">
                <span>${rankInfo.medal}</span>
                <span>${rankInfo.rank} • Nivel ${level}</span>
              </span>
              <span class="font-extrabold text-amber-400 px-2 py-0.5 rounded-md bg-slate-900 border border-amber-500/30">${exp} EXP</span>
            </div>
            <div class="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div class="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 transition-all duration-500" style="width: ${rankInfo.progressPercent}%;"></div>
            </div>
            <p class="text-[10px] text-slate-400 text-right">
              ${rankInfo.nextTier ? 'Faltan ' + rankInfo.neededForNext + ' EXP para ' + rankInfo.nextTier.name : '¡Has alcanzado el rango máximo!'}
            </p>
          </div>

          <div class="pt-2 space-y-2.5">
            ${isAdmin ? `
              <button type="button" onclick="window.closeAllModals(); openAdminDashboardModal();"
                class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-amber-300/40">
                <span>⚙️</span>
                <span>Panel Admin</span>
              </button>
            ` : ''}

            <button type="button" onclick="window.handleProfileLogout()"
              class="w-full py-2.5 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        `;
      }
    }
    window.renderUserProfile = renderUserProfile;
    window.renderProfileModalContent = renderUserProfile;

    function openLoginFromProfile(tab) {
      const targetTab = (tab === 'register') ? 'register' : 'login';
      window.closeAllModals();
      if (typeof window.navigateTo === 'function') {
        window.navigateTo('login');
      } else if (typeof showView === 'function') {
        showView('view-auth');
      }
      // Restaurar completamente #view-auth y .login-card tras modo invitado
      const authView = document.getElementById('view-auth');
      if (authView) {
        authView.classList.remove('hidden');
        authView.style.display = 'flex';
        authView.style.setProperty('display', 'flex', 'important');
        authView.style.setProperty('visibility', 'visible', 'important');
        authView.style.setProperty('pointer-events', 'auto', 'important');
        authView.style.setProperty('z-index', '10000', 'important');
      }
      document.querySelectorAll('#view-auth .login-card, .login-container, #login-modal').forEach(el => {
        el.classList.remove('hidden');
        el.style.display = 'block';
        el.style.setProperty('display', 'block', 'important');
        el.style.setProperty('visibility', 'visible', 'important');
        el.style.setProperty('pointer-events', 'auto', 'important');
      });
      if (typeof window.switchAuthTab === 'function') {
        window.switchAuthTab(targetTab);
      }
      setTimeout(() => {
        const focusEl = targetTab === 'register'
          ? document.getElementById('authRegUsername')
          : document.getElementById('authLoginIdentifier');
        if (focusEl && typeof focusEl.focus === 'function') focusEl.focus();
      }, 60);
    }
    window.openLoginFromProfile = openLoginFromProfile;

    function handleProfileLogout() {
      try {
        localStorage.removeItem('mastereng_user');
        localStorage.removeItem('english_app_user_session');
        localStorage.removeItem('user_role');
        localStorage.setItem('mastereng_user', JSON.stringify({ role: 'guest', username: 'Invitado' }));
      } catch (e) {}
      window.closeAllModals();
      if (typeof showView === 'function') {
        showView('view-auth');
      }
      if (typeof switchAuthTab === 'function') {
        switchAuthTab('login');
      }
      if (typeof updateUserExpDisplay === 'function') {
        updateUserExpDisplay();
      }
      if (typeof updateFloatingWidgetsVisibility === 'function') {
        updateFloatingWidgetsVisibility();
      }
      if (typeof showFloatingToast === 'function') {
        showFloatingToast('Sesión cerrada correctamente', '👋');
      }
    }
    window.handleProfileLogout = handleProfileLogout;

    function openProfileModal() {
      renderUserProfile();
      toggleModal('profile-modal');
    }

    function closeProfileModal() {
      window.closeAllModals();
    }

    function updateFloatingWidgetsVisibility() {
      const user = getStoredUser();
      const isAuthenticated = !!(user && user.username);
      const dock = document.getElementById('tutorRouletteDock');
      const robot = document.getElementById('draggableRobotWidget');
      const roulette = document.getElementById('draggableRouletteWidget');

      if (!isAuthenticated || currentActiveView === 'view-auth') {
        if (dock) {
          dock.style.display = 'none';
          dock.style.setProperty('display', 'none', 'important');
          dock.classList.add('hidden');
        }
        if (robot) {
          robot.style.display = 'none';
          robot.style.setProperty('display', 'none', 'important');
          robot.classList.add('hidden');
        }
        if (roulette) {
          roulette.style.display = 'none';
          roulette.style.setProperty('display', 'none', 'important');
          roulette.classList.add('hidden');
        }
      } else {
        if (dock) {
          dock.style.display = 'flex';
          dock.style.setProperty('display', 'flex', 'important');
          dock.classList.remove('hidden');
        }
        if (robot) {
          robot.style.display = 'flex';
          robot.style.setProperty('display', 'flex', 'important');
          robot.classList.remove('hidden');
        }
        if (roulette) {
          if (currentActiveView === 'view-home') {
            roulette.style.display = 'flex';
            roulette.style.setProperty('display', 'flex', 'important');
            roulette.classList.remove('hidden');
          } else {
            roulette.style.display = 'none';
            roulette.style.setProperty('display', 'none', 'important');
            roulette.classList.add('hidden');
          }
        }
      }
    }

    function openSettingsModal() {
      syncSettingsUiFromStorage();
      toggleModal('settings-modal');
    }

    function closeSettingsModal() {
      window.closeAllModals();
    }

    function handleMasterVolumeChange(val) {
      const volNum = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
      const display = document.getElementById('settingsVolumeDisplay');
      if (display) display.textContent = `${volNum}%`;
      const slider = document.getElementById('settingsMasterVolume');
      if (slider && slider.value !== volNum.toString()) slider.value = volNum;

      const normalized = volNum / 100;
      window.masterAppVolume = normalized;
      try {
        localStorage.setItem('master_app_volume', volNum.toString());
      } catch (e) { }

      document.querySelectorAll('audio, video').forEach(el => {
        try { el.volume = normalized; } catch (e) { }
      });
      if (window.ytMusicPlayer && typeof window.ytMusicPlayer.setVolume === 'function') {
        try { window.ytMusicPlayer.setVolume(volNum); } catch (e) { }
      }
    }

    function handleThemeChange(theme) {
      try {
        localStorage.setItem('app_theme', theme);
      } catch (e) { }
      applyAppTheme(theme);
      showFloatingToast(theme === 'neon-light' ? 'Modo Neón / Claro activado' : 'Modo Oscuro Profundo activado', '🎨');
    }

    function toggleAppTheme() {
      const current = localStorage.getItem('app_theme') || 'dark';
      const next = (current === 'dark') ? 'neon-light' : 'dark';
      handleThemeChange(next);
    }

    function applyAppTheme(theme) {
      const select = document.getElementById('settingsThemeSelect');
      if (select) select.value = theme;
      if (theme === 'neon-light') {
        document.body.classList.add('theme-neon-light');
        document.documentElement.classList.remove('dark');
      } else {
        document.body.classList.remove('theme-neon-light');
        document.documentElement.classList.add('dark');
      }
    }

    function handleFontFamilyChange(font) {
      try {
        localStorage.setItem('app_font', font);
      } catch (e) { }
      applyAppFont(font);
      showFloatingToast('Tipografía actualizada', '🔤');
    }

    function applyAppFont(font) {
      const select = document.getElementById('settingsFontSelect');
      if (select) select.value = font;
      document.body.classList.remove('font-sans-modern', 'font-dyslexic', 'font-classic');
      if (font === 'dyslexic') {
        document.body.classList.add('font-dyslexic');
      } else if (font === 'classic') {
        document.body.classList.add('font-classic');
      } else {
        document.body.classList.add('font-sans-modern');
      }
    }

    function handleTtsSpeedChange(speedVal) {
      const speed = parseFloat(speedVal) || 1.0;
      window.ttsPlaybackSpeed = speed;
      try {
        localStorage.setItem('app_tts_speed', speedVal.toString());
      } catch (e) { }
      const select = document.getElementById('settingsTtsSpeedSelect');
      if (select) select.value = speedVal.toString();
      showFloatingToast(`Velocidad de pronunciación: ${speedVal}x`, '🗣️');
    }

    function handleLogoutFromSettings() {
      closeSettingsModal();
      handleLogout();
    }

    function syncSettingsUiFromStorage() {
      try {
        const savedVol = localStorage.getItem('master_app_volume') || '100';
        const volNum = parseInt(savedVol, 10) || 100;
        const slider = document.getElementById('settingsMasterVolume');
        const display = document.getElementById('settingsVolumeDisplay');
        if (slider) slider.value = volNum;
        if (display) display.textContent = `${volNum}%`;
        window.masterAppVolume = volNum / 100;

        const savedTheme = localStorage.getItem('app_theme') || 'dark';
        applyAppTheme(savedTheme);

        const savedFont = localStorage.getItem('app_font') || 'sans';
        applyAppFont(savedFont);

        const savedSpeed = localStorage.getItem('app_tts_speed') || '1.0';
        window.ttsPlaybackSpeed = parseFloat(savedSpeed) || 1.0;
        const speedSelect = document.getElementById('settingsTtsSpeedSelect');
        if (speedSelect) speedSelect.value = savedSpeed;
      } catch (e) { }
    }

    function handleLogout() {
      closeProfileModal();
      closeSettingsModal();
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('user_role');
      showFloatingToast('Sesión cerrada correctamente', '👋');
      showView('view-auth');
      updateUserExpDisplay();
      updateFloatingWidgetsVisibility();
    }

    // ========================================================
    // RULETA DE PREGUNTAS INTERACTIVA (+15 EXP)
    // ========================================================
    const ROULETTE_QUESTIONS = [
      { category: 'Phrasal Verbs', q: 'What does "look up to someone" mean?', options: ['To admire and respect someone', 'To look at someone from below', 'To search for someone online', 'To visit someone unexpectedly'], correct: 0 },
      { category: 'Grammar', q: 'Which sentence uses the present perfect correctly?', options: ['I have lived in London since 2018', 'I live in London since 2018', 'I am living in London since 2018', 'I lived in London since 2018'], correct: 0 },
      { category: 'Idioms', q: 'What is the meaning of "break a leg"?', options: ['Good luck in a performance', 'To get injured during sports', 'To fail an exam', 'To dance enthusiastically'], correct: 0 },
      { category: 'TOEFL Practice', q: 'The professor _____ the lecture when the bell rang.', options: ['had already finished', 'has already finished', 'is finishing', 'finish'], correct: 0 }
    ];

    let rouletteSpinAngle = 0;
    let rouletteTimerInterval = null;

    function openRouletteModal() {
      toggleModal('roulette-modal');
    }

    function closeRouletteModal() {
      window.closeAllModals();
    }

    function spinRouletteWheel() {
      const disk = document.getElementById('rouletteWheelDisk');
      const spinBtn = document.getElementById('spinRouletteBtn');
      const qCard = document.getElementById('rouletteQuestionCard');

      if (spinBtn) spinBtn.disabled = true;
      if (qCard) qCard.classList.add('hidden');

      const extraSpins = 5 + Math.floor(Math.random() * 5);
      const randomDeg = Math.floor(Math.random() * 360);
      rouletteSpinAngle += (extraSpins * 360) + randomDeg;

      if (disk) {
        disk.style.transform = `rotate(${rouletteSpinAngle}deg)`;
      }

      showFloatingToast('Girando ruleta del conocimiento...', '🎯');

      setTimeout(() => {
        presentRouletteQuestion();
      }, 4100);
    }

    function presentRouletteQuestion() {
      const qCard = document.getElementById('rouletteQuestionCard');
      const catBadge = document.getElementById('rouletteCategoryBadge');
      const qText = document.getElementById('rouletteQuestionText');
      const optsContainer = document.getElementById('rouletteOptionsContainer');
      const timerEl = document.getElementById('rouletteTimer');

      const randQ = ROULETTE_QUESTIONS[Math.floor(Math.random() * ROULETTE_QUESTIONS.length)];

      if (catBadge) catBadge.textContent = randQ.category;
      if (qText) qText.textContent = randQ.q;
      if (optsContainer) {
        optsContainer.innerHTML = randQ.options.map((opt, idx) => `
          <button onclick="handleRouletteAnswer(${idx}, ${randQ.correct})" class="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 transition cursor-pointer">
            ${String.fromCharCode(65 + idx)}) ${opt}
          </button>
        `).join('');
      }

      if (qCard) qCard.classList.remove('hidden');

      let seconds = 30;
      if (timerEl) timerEl.textContent = `⏱️ ${seconds}s`;
      if (rouletteTimerInterval) clearInterval(rouletteTimerInterval);

      rouletteTimerInterval = setInterval(() => {
        seconds--;
        if (timerEl) timerEl.textContent = `⏱️ ${seconds}s`;
        if (seconds <= 0) {
          clearInterval(rouletteTimerInterval);
          showFloatingToast('¡Tiempo agotado en la ruleta!', '⏱️');
          closeRouletteModal();
        }
      }, 1000);
    }

    function handleRouletteAnswer(selectedIdx, correctIdx) {
      if (rouletteTimerInterval) clearInterval(rouletteTimerInterval);
      if (selectedIdx === correctIdx) {
        showFloatingToast('¡Respuesta Correcta! +15 EXP ganados', '🎉');
        addExp(15, 'Respuesta correcta en la Ruleta');
      } else {
        showFloatingToast('Respuesta incorrecta. ¡Sigue practicando!', '❌');
      }
      setTimeout(() => closeRouletteModal(), 1200);
    }

    function toggleChatbotWindow() {
      toggleModal('ai-tutor-modal');
    }

    function askChatbotQuestion(query) {
      const input = document.getElementById('chatbotInput');
      if (input) input.value = query;
      sendChatbotMessage();
    }

    function sendChatbotMessage() {
      const input = document.getElementById('chatbotInput');
      const container = document.getElementById('chatbotMessagesContainer');
      if (!input || !container) return;

      const userText = input.value.trim();
      if (!userText) return;

      const userDiv = document.createElement('div');
      userDiv.className = 'bg-sky-600/90 text-white p-2.5 rounded-2xl rounded-tr-none ml-auto max-w-[85%] font-medium';
      userDiv.textContent = userText;
      container.appendChild(userDiv);
      input.value = '';
      container.scrollTop = container.scrollHeight;

      setTimeout(() => {
        let answer = "Excelente pregunta. En inglés, la práctica contextual diaria es la clave para la fluidez.";
        const lower = userText.toLowerCase();

        if (lower.includes('make') || lower.includes('do')) {
          answer = "'Do' se utiliza para acciones, obligaciones y tareas (ej. do homework, do exercise). 'Make' se utiliza para crear, construir o producir un resultado nuevo (ej. make coffee, make a decision).";
        } else if (lower.includes('phrasal')) {
          answer = "Los 5 phrasal verbs esenciales: 1) 'Give up' (Rendirse), 2) 'Look for' (Buscar), 3) 'Carry on' (Continuar), 4) 'Find out' (Descubrir), 5) 'Turn down' (Rechazar o bajar volumen).";
        } else if (lower.includes('toefl')) {
          answer = "Tip TOEFL: En la sección de lectura, identifica la idea principal de cada párrafo antes de responder. En comprensión auditiva, toma notas de conectores de contraste como 'however', 'although' o 'nevertheless'.";
        } else if (lower.includes('exp') || lower.includes('puntos')) {
          answer = "Ganas EXP completando misiones aprobadas (+20 EXP), practicando pronunciación en cuentos (+50 EXP), retos en música (+30 EXP) y preguntas en la ruleta (+15 EXP).";
        }

        const aiDiv = document.createElement('div');
        aiDiv.className = 'bg-slate-800 p-2.5 rounded-2xl rounded-tl-none border border-slate-700 text-slate-200 max-w-[90%]';
        aiDiv.textContent = answer;
        container.appendChild(aiDiv);
        container.scrollTop = container.scrollHeight;
      }, 300);
    }

    let activeGlossaryModuleKey = 'everyday_actions';
    let currentMissionModuleKey = 'everyday_actions';
    let currentMissionQuestionIndex = 0;
    let currentMissionScore = 0;
    let currentMissionQuestions = [];

    const MODULE_TITLES = {
      everyday_actions: 'Módulo 01: Foundations & Daily Routine (A1)',
      connectors: 'Módulo 02: Travel, Airport & Directions (A1-A2)',
      social_dating: 'Módulo 03: Food, Dining & Social Life (A2)',
      professional_english: 'Módulo 04: Workplace & Professional Tech (B1)',
      phrasal_verbs: 'Módulo 05: Socializing & Idiomatic Slang (B1)',
      compound_words: 'Módulo 06: Debate, Opinions & Current Events (B2)',
      affixes_morphology: 'Módulo 07: Science, Nature & Environment (B2)',
      grammar_path: 'Módulo 08: Literature, Storytelling & Cinema (C1)',
      toefl_simulator: 'Módulo 09: Academic Research & TOEFL Prep (C1)',
      internet_slang: 'Módulo 10: Master Fluency & Accent Reduction (C2)'
    };

    function isModuleLevelCompleted(modKey, level = 1) {
      try {
        const completed = JSON.parse(localStorage.getItem('user_completed_modules') || '{}');
        return Boolean(completed[`${modKey}_lvl${level}`]);
      } catch (e) {
        return false;
      }
    }

    function markModuleLevelCompleted(modKey, level = 1) {
      try {
        const completed = JSON.parse(localStorage.getItem('user_completed_modules') || '{}');
        completed[`${modKey}_lvl${level}`] = true;
        localStorage.setItem('user_completed_modules', JSON.stringify(completed));
      } catch (e) {}
    }

    function renderLearningModules() {
      if (typeof window.renderOfficialLearningModules === 'function') {
        window.renderOfficialLearningModules();
      }
    }

    function renderGlossaryItems(items) {
      const container = document.getElementById('glossaryTermsContainer');
      if (!container) return;

      if (!items || items.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 text-center py-6">No se encontraron términos.</p>';
        return;
      }

      container.innerHTML = items.slice(0, 120).map(item => `
        <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="text-sm font-black text-white">${item.term}</span>
              <span class="text-xs text-amber-300 font-mono">${item.pron || ''}</span>
              <button onclick="speakText('${(item.term || '').replace(/'/g, "\\'")}')" class="p-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition cursor-pointer">🔊</button>
            </div>
            <p class="text-xs text-slate-300 font-semibold mt-0.5">${item.meaning || ''}</p>
            <p class="text-xs text-slate-400 italic mt-1 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              "${item.example || ''}"
            </p>
          </div>
        </div>
      `).join('');
    }

    function filterGlossaryTerms(query) {
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey]) ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey] : { items: [] };
      const q = query.toLowerCase().trim();
      const filtered = (modData.items || []).filter(i =>
        (i.term && i.term.toLowerCase().includes(q)) ||
        (i.meaning && i.meaning.toLowerCase().includes(q)) ||
        (i.example && i.example.toLowerCase().includes(q))
      );
      renderGlossaryItems(filtered);
    }

    
    // ========================================================
    // MOTOR DE DESCARGA DIRECTA DE PDF (BLOB URL / NATIVO / jsPDF)
    // ========================================================
    function triggerBlobDownload(blob, filename) {
      filename = filename || 'Glosario.pdf';
      try {
        const blobUrl = URL.createObjectURL(blob);

        // 1. Conversión a Base64 y envío al canal nativo AndroidInterface si existe
        if (typeof FileReader !== 'undefined') {
          const reader = new FileReader();
          reader.onloadend = function() {
            const base64Data = reader.result;
            const iface = window.AndroidInterface || window.AndroidBridge;
            if (iface) {
              if (typeof iface.downloadBase64Pdf === 'function') {
                iface.downloadBase64Pdf(base64Data, filename);
              } else if (typeof iface.downloadPdf === 'function') {
                iface.downloadPdf(base64Data, filename);
              } else if (typeof iface.downloadFile === 'function') {
                iface.downloadFile(base64Data, filename, 'application/pdf');
              }
            }
          };
          reader.readAsDataURL(blob);
        }

        // 2. Descarga directa en navegador usando enlace <a download="Glosario.pdf"> con click directo
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.download = filename || 'Glosario.pdf';
        tempLink.setAttribute('download', filename);
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        setTimeout(function() {
          try {
            if (tempLink.parentNode) tempLink.parentNode.removeChild(tempLink);
            URL.revokeObjectURL(blobUrl);
          } catch (e) { }
        }, 2000);
        showFloatingToast('Descargando ' + filename + '...', '📄');
      } catch (err) {
        console.error('Error al descargar blob PDF:', err);
        showFloatingToast('Error al procesar la descarga del PDF.', '⚠️');
      }
    }

    function triggerDirectDownload(urlOrBlob, filename) {
      filename = filename || 'Glosario_Ingles.pdf';
      if (urlOrBlob instanceof Blob) {
        triggerBlobDownload(urlOrBlob, filename);
      } else if (typeof urlOrBlob === 'string') {
        if (urlOrBlob.indexOf('blob:') === 0 || urlOrBlob.indexOf('data:') === 0) {
          const a = document.createElement('a');
          a.href = urlOrBlob;
          a.download = filename;
          a.setAttribute('download', filename);
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          setTimeout(function() { if (a.parentNode) document.body.removeChild(a); }, 2000);
          showFloatingToast('Descargando ' + filename + '...', '📄');
        } else {
          // Si es una URL externa, garantizar descarga directa vía fetch Blob o atributo download con cabeceras
          fetch(urlOrBlob, { mode: 'cors' })
            .then(function(res) {
              if (!res.ok) throw new Error('Network response not ok');
              return res.blob();
            })
            .then(function(blob) { triggerBlobDownload(blob, filename); })
            .catch(function() {
              const a = document.createElement('a');
              a.href = urlOrBlob;
              a.download = filename;
              a.setAttribute('download', filename);
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
              a.style.display = 'none';
              document.body.appendChild(a);
              a.click();
              setTimeout(function() { if (a.parentNode) document.body.removeChild(a); }, 2000);
              showFloatingToast('Iniciando descarga de ' + filename + '...', '📄');
            });
        }
      }
    }

    function generateSimplePdfBlob(title, author, items) {
      function escapePdf(str) {
        return (str || '').replace(/[\\()]/g, '').replace(/[^\x20-\x7E]/g, ' ');
      }
      let stream = 'BT\n/F1 18 Tf\n50 770 Td\n(' + escapePdf(title) + ') Tj\n';
      stream += '/F1 10 Tf\n0 -22 Td\n(Autor: ' + escapePdf(author) + ' - English Learning App) Tj\n0 -20 Td\n';
      stream += '/F1 12 Tf\n(Glosario Oficial y Vocabulario) Tj\n0 -16 Td\n';
      
      let y = 712;
      const list = items || [];
      for (let i = 0; i < list.length; i++) {
        if (y < 60) break;
        const item = list[i];
        const term = escapePdf(item.term || item.title || '');
        const pron = escapePdf(item.pron || item.ipa || '');
        const meaning = escapePdf(item.meaning || item.es || '');
        const line = term + (pron ? ' [' + pron + ']' : '') + ': ' + meaning;
        stream += '/F1 9 Tf\n0 -14 Td\n(' + line + ') Tj\n';
        y -= 14;
        if (item.example) {
          const ex = '   Ej: ' + escapePdf(item.example);
          stream += '/F1 8 Tf\n0 -12 Td\n(' + ex + ') Tj\n';
          y -= 12;
        }
      }
      stream += 'ET\n';
      
      const streamLen = (new TextEncoder().encode(stream)).length;
      const objs = [
        '%PDF-1.4\n',
        '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
        '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
        '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
        '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
        '5 0 obj\n<< /Length ' + streamLen + ' >>\nstream\n' + stream + 'endstream\nendobj\n'
      ];
      
      let offset = objs[0].length;
      let xref = ['xref\n0 6\n0000000000 65535 f \n'];
      for (let j = 1; j <= 5; j++) {
        xref.push((offset.toString().padStart(10, '0')) + ' 00000 n \n');
        offset += objs[j].length;
      }
      
      const trailer = 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + offset + '\n%%EOF\n';
      const pdfText = objs.join('') + xref.join('') + trailer;
      return new Blob([new TextEncoder().encode(pdfText)], { type: 'application/pdf' });
    }

    function downloadActiveGlossaryPdf() {
      const modId = arguments[0];
      if (modId) {
        const mod = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.id === modId);
        if (mod && mod.key) {
          activeGlossaryModuleKey = mod.key;
        }
      }
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey]) 
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey] 
        : { title: MODULE_TITLES[activeGlossaryModuleKey] || 'Glosario_Ingles', items: [] };

      const safeTitle = (MODULE_TITLES[activeGlossaryModuleKey] || modData.title || 'Glosario_Ingles').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = ('MasterENG_' + safeTitle + '.pdf') || 'Glosario.pdf';

      // 1. Si jsPDF está disponible en el entorno, generar documento visual de alta fidelidad
      if (window.jspdf && window.jspdf.jsPDF) {
        try {
          const doc = new window.jspdf.jsPDF();
          doc.setFontSize(18);
          doc.text(modData.title || 'Glosario de Inglés', 14, 20);
          doc.setFontSize(10);
          doc.text('Autor: Wilberth Alessandro Molina Cutz - English App', 14, 27);
          doc.setLineWidth(0.5);
          doc.line(14, 30, 196, 30);

          let y = 38;
          const items = (modData.items || []).slice(0, 120);
          for (let i = 0; i < items.length; i++) {
            if (y > 275) {
              doc.addPage();
              y = 20;
            }
            const item = items[i];
            doc.setFont(undefined, 'bold');
            doc.text((i + 1) + '. ' + (item.term || '') + ' (' + (item.pron || '') + ')', 14, y);
            y += 5;
            doc.setFont(undefined, 'normal');
            doc.text('   Significado: ' + (item.meaning || ''), 14, y);
            y += 5;
            if (item.example) {
              doc.setFont(undefined, 'italic');
              doc.text('   Ejemplo: "' + item.example + '"', 14, y);
              y += 6;
            } else {
              y += 2;
            }
          }
          const pdfBlob = doc.output('blob');
          triggerBlobDownload(pdfBlob, filename);
          return;
        } catch (e) {
          console.warn('jsPDF fallback to native generator:', e);
        }
      }

      // 2. Generador nativo offline sin librerías externas
      const binaryBlob = generateSimplePdfBlob(
        modData.title || 'Glosario de Inglés',
        'Wilberth Alessandro Molina Cutz',
        modData.items || []
      );
      triggerBlobDownload(binaryBlob, filename);
    }

    function openGlossaryModal(modKey) {
      let modObj = null;
      if (typeof modKey === 'number' || (typeof modKey === 'string' && /^\d+$/.test(modKey))) {
        modObj = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.id === Number(modKey));
        if (modObj && modObj.key) modKey = modObj.key;
      } else if (typeof modKey === 'string') {
        modObj = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.key === modKey);
      }
      if (modKey) activeGlossaryModuleKey = modKey;
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey])
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey]
        : { title: (typeof MODULE_TITLES !== 'undefined' && MODULE_TITLES[activeGlossaryModuleKey]) || 'Glosario Oficial', items: [] };
      const displayTitle = modObj
        ? `Glosario Módulo 0${modObj.id < 10 ? modObj.id : modObj.id} (${modObj.level}): ${modObj.title}`.replace('010', '10')
        : (modData.title || MODULE_TITLES[activeGlossaryModuleKey] || 'Glosario Oficial');
      const titleEl = document.getElementById('glossaryModalTitle');
      const subEl = document.getElementById('glossaryModalSubtitle');
      if (titleEl) titleEl.textContent = displayTitle;
      if (subEl) subEl.textContent = `${(modData.items || []).length} términos con pronunciación fonética, traducción al español y ejemplos`;
      const searchInput = document.getElementById('glossarySearchInput');
      if (searchInput) searchInput.value = '';
      renderGlossaryItems(modData.items || []);
      const modal = document.getElementById('glossaryModal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('z-index', '100000', 'important');
      }
    }

    function closeGlossaryModal() {
      window.closeAllModals();
    }

    function openModuleMission(modKey) {
      if (typeof modKey === 'number' || (typeof modKey === 'string' && /^\d+$/.test(modKey))) {
        const found = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.id === Number(modKey));
        if (found && found.key) modKey = found.key;
      }
      currentMissionModuleKey = modKey || 'everyday_actions';
      currentMissionQuestionIndex = 0;
      currentMissionScore = 0;

      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[modKey]) ? window.MASTER_MODULES_DATA[modKey] : { items: [] };
      const items = (modData.items && modData.items.length >= 4) ? modData.items : [
        { term: 'Look after', meaning: 'Cuidar a alguien o algo', example: 'She looks after her younger brother.' },
        { term: 'Take off', meaning: 'Despegar o quitarse una prenda', example: 'The flight takes off in ten minutes.' },
        { term: 'Give up', meaning: 'Rendirse o abandonar un hábito', example: 'Never give up on your dreams.' },
        { term: 'Find out', meaning: 'Descubrir o averiguar información', example: 'We need to find out what happened.' }
      ];

      const shuffled = [...items].sort(() => 0.5 - Math.random()).slice(0, 3);
      currentMissionQuestions = shuffled.map((targetItem) => {
        const distractors = items.filter(x => x.term !== targetItem.term).sort(() => 0.5 - Math.random()).slice(0, 3);
        const allOpts = [targetItem, ...distractors].sort(() => 0.5 - Math.random());
        const correctIndex = allOpts.findIndex(x => x.term === targetItem.term);

        return {
          question: `¿Cuál es el significado correcto de "${targetItem.term}" en: "${targetItem.example}"?`,
          options: allOpts.map(o => o.meaning),
          correct: correctIndex,
          explanation: `"${targetItem.term}" significa: ${targetItem.meaning}.`
        };
      });

      const titleEl = document.getElementById('missionModalTitle');
      if (titleEl) titleEl.textContent = (typeof MODULE_TITLES !== 'undefined' && MODULE_TITLES[modKey]) || modKey;

      const quizBody = document.getElementById('missionQuizBody');
      const resultBody = document.getElementById('missionResultBody');
      if (quizBody) quizBody.classList.remove('hidden');
      if (resultBody) resultBody.classList.add('hidden');

      loadMissionQuestion();

      const modal = document.getElementById('learningMissionModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.classList.add('active');
        modal.classList.remove('hidden');
      }
    }

    function loadMissionQuestion() {
      const q = currentMissionQuestions[currentMissionQuestionIndex];
      if (!q) return;

      const counterEl = document.getElementById('missionQuestionCounter');
      const qTextEl = document.getElementById('missionQuestionText');
      const optsContainer = document.getElementById('missionOptionsContainer');
      const feedbackEl = document.getElementById('missionFeedbackText');

      if (counterEl) counterEl.textContent = `Pregunta ${currentMissionQuestionIndex + 1} de ${currentMissionQuestions.length}`;
      if (qTextEl) qTextEl.textContent = q.question;
      if (feedbackEl) feedbackEl.classList.add('hidden');

      if (optsContainer) {
        optsContainer.innerHTML = q.options.map((opt, idx) => `
          <button onclick="submitMissionAnswer(${idx})" class="w-full text-left p-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer">
            <span class="text-amber-400 font-bold mr-2">${String.fromCharCode(65 + idx)})</span> ${opt}
          </button>
        `).join('');
      }
    }

    function submitMissionAnswer(selectedIdx) {
      const q = currentMissionQuestions[currentMissionQuestionIndex];
      if (!q) return;

      const feedbackEl = document.getElementById('missionFeedbackText');
      const isCorrect = (selectedIdx === q.correct);
      if (isCorrect) currentMissionScore++;

      if (feedbackEl) {
        feedbackEl.classList.remove('hidden');
        feedbackEl.className = isCorrect
          ? 'text-xs font-semibold p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
          : 'text-xs font-semibold p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300';
        feedbackEl.textContent = isCorrect ? `✅ ¡Correcto! ${q.explanation}` : `❌ Incorrecto. ${q.explanation}`;
      }

      setTimeout(() => {
        currentMissionQuestionIndex++;
        if (currentMissionQuestionIndex < currentMissionQuestions.length) {
          loadMissionQuestion();
        } else {
          finishModuleMission();
        }
      }, 1100);
    }

    function finishModuleMission() {
      const quizBody = document.getElementById('missionQuizBody');
      const resultBody = document.getElementById('missionResultBody');
      const resultTitle = document.getElementById('missionResultTitle');
      const resultDesc = document.getElementById('missionResultDesc');
      const expBadge = document.getElementById('missionExpBadge');

      if (quizBody) quizBody.classList.add('hidden');
      if (resultBody) resultBody.classList.remove('hidden');

      const isPassed = currentMissionScore >= 2;
      const alreadyAwarded = isModuleLevelCompleted(currentMissionModuleKey, 1);

      if (isPassed) {
        if (resultTitle) resultTitle.textContent = '¡Misión Superada con Éxito!';
        if (alreadyAwarded) {
          if (resultDesc) resultDesc.textContent = `Acertaste ${currentMissionScore} de ${currentMissionQuestions.length}. (Los +20 EXP de este nivel ya fueron entregados previamente).`;
          if (expBadge) {
            expBadge.textContent = '✅ Nivel ya completado';
            expBadge.className = 'inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-bold text-xs';
          }
        } else {
          markModuleLevelCompleted(currentMissionModuleKey, 1);
          addExp(20, 'Misión superada en ' + (MODULE_TITLES[currentMissionModuleKey] || 'Academia'));
          renderLearningModules();
          if (resultDesc) resultDesc.textContent = `Acertaste ${currentMissionScore} de ${currentMissionQuestions.length} preguntas.`;
          if (expBadge) {
            expBadge.textContent = '+20 EXP Añadidos a tu Perfil';
            expBadge.className = 'inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-black text-xs';
          }
        }
      } else {
        if (resultTitle) resultTitle.textContent = 'Misión No Superada';
        if (resultDesc) resultDesc.textContent = `Acertaste ${currentMissionScore} de ${currentMissionQuestions.length}. Necesitas mínimo 2 aciertos para ganar EXP.`;
        if (expBadge) {
          expBadge.textContent = 'Intenta nuevamente';
          expBadge.className = 'inline-block px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold text-xs';
        }
      }
    }

    function closeMissionModal() {
      window.closeAllModals();
    }

    // ========================================================
    // MÓDULO CUENTOS CLÁSICOS ILUSTRADOS (CON PROPIEDADES CORREGIDAS)
    // ========================================================
    let currentStoryIndex = 0;
    let isBilingualStoryModeActive = true;
    let activeStoryRecognition = null;

    function renderStorySelector() {
      const container = document.getElementById('storiesSelectorContainer');
      if (!container) return;

      container.innerHTML = STORIES_DATA.map((story, idx) => {
        const isSelected = idx === currentStoryIndex;
        return `
        <div onclick="selectStory(${idx})" id="storyTab-${idx}" class="group p-2.5 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between ${isSelected ? 'bg-emerald-950/70 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.01]' : 'bg-slate-900/85 border-slate-800 hover:border-slate-700 hover:bg-slate-900'}">
          <div>
            <div class="w-full h-16 rounded-xl overflow-hidden bg-slate-950 mb-2 flex items-center justify-center border ${isSelected ? 'border-emerald-500/50' : 'border-slate-800'}">
              ${story.illustrationSvg}
            </div>
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${isSelected ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-400'}">${story.level || 'Nivel A2'}</span>
              <span class="text-[9px] font-mono text-slate-400 truncate">${story.paragraphs ? story.paragraphs.length : 5} párr.</span>
            </div>
            <h4 class="text-xs font-extrabold ${isSelected ? 'text-emerald-300' : 'text-white group-hover:text-emerald-200'} leading-tight line-clamp-1">${story.title}</h4>
            <p class="text-[10px] text-slate-400 italic truncate mt-0.5">${story.titleEs || ''}</p>
          </div>
        </div>
      `;
      }).join('');

      loadStoryViewer(currentStoryIndex);
    }

    function stopStoryNarration() {
      try {
        if (window.AndroidBridge && typeof window.AndroidBridge.stop === 'function') {
          window.AndroidBridge.stop();
        }
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (e) { }
    }

    function selectStory(idx) {
      stopStoryNarration();
      if (activeStoryRecognition) {
        try { activeStoryRecognition.abort(); } catch (e) { }
        activeStoryRecognition = null;
      }
      currentStoryIndex = idx;
      renderStorySelector();
    }

    function speakStoryParagraph(pIdx) {
      const story = STORIES_DATA[currentStoryIndex];
      if (!story || !story.paragraphs || !story.paragraphs[pIdx]) return;
      const text = story.paragraphs[pIdx].en;
      const cardEl = document.getElementById(`storyParagraphCard-${pIdx}`);
      if (cardEl) {
        cardEl.classList.add('border-sky-500/70', 'bg-slate-800/90');
      }
      speakText(text, 0.92, () => {
        if (cardEl) {
          cardEl.classList.remove('border-sky-500/70', 'bg-slate-800/90');
        }
      });
    }

    function loadStoryViewer(idx) {
      const story = STORIES_DATA[idx];
      if (!story) return;

      const titleEl = document.getElementById('activeStoryTitle');
      const subtitleEl = document.getElementById('activeStorySubtitle');
      const diffEl = document.getElementById('activeStoryDifficulty');
      const catEl = document.getElementById('activeStoryCategory');
      const illEl = document.getElementById('activeStoryIllustration');
      const pContainer = document.getElementById('storyParagraphsContainer');
      const moralContainer = document.getElementById('activeStoryMoralContainer');

      if (titleEl) titleEl.textContent = story.title || 'Cuento Clásico';
      if (subtitleEl) subtitleEl.textContent = story.titleEs || story.title_es || story.title || '';
      if (diffEl) diffEl.textContent = story.level || story.difficulty || 'Nivel A2';
      if (catEl) catEl.textContent = story.category || 'Obra Clásica';
      if (illEl) illEl.innerHTML = story.illustrationSvg || '<svg viewBox="0 0 800 320" class="w-full h-full"><rect width="800" height="320" fill="#0f172a"/></svg>';

      if (pContainer && story.paragraphs) {
        pContainer.innerHTML = story.paragraphs.map((p, pIdx) => {
          const safeEn = (p.en || '').replace(/\\/g, "\\\\").replace(/'/g, "\\'");
          return `
          <div id="storyParagraphCard-${pIdx}" class="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 transition-all space-y-2.5">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div class="flex items-start gap-3 flex-1">
                <span class="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono font-bold text-emerald-400 shrink-0 mt-0.5">
                  0${pIdx + 1}
                </span>
                <p class="text-sm sm:text-base font-semibold text-white leading-relaxed">${p.en || ''}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0 self-end sm:self-start">
                <button onclick="speakStoryParagraph(${pIdx}); speakText('${safeEn}')"
                  class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-700/90 hover:bg-sky-600 text-slate-200 hover:text-white text-xs font-semibold transition cursor-pointer"
                  title="Escuchar pronunciación nativa (TTS)">
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                  </svg>
                  <span>Audio</span>
                </button>
                <button id="storyMicBtn-${pIdx}" onclick="startVoicePracticeParagraph(${pIdx}, '${safeEn}')"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow shadow-emerald-600/20 cursor-pointer"
                  title="Speaking Coach: Pronunciar párrafo (+50 EXP)">
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                  </svg>
                  <span id="storyMicLabel-${pIdx}">Pronunciar</span>
                </button>
              </div>
            </div>
            ${isBilingualStoryModeActive ? `<p class="text-xs sm:text-sm text-slate-400 italic pt-2 border-t border-slate-700/40 pl-9">${p.es || ''}</p>` : ''}
            <div id="voiceFeedback-${pIdx}" class="text-xs font-mono hidden pt-2 pl-9"></div>
          </div>
        `;
        }).join('');
      }

      if (moralContainer) {
        const vocabHtml = (story.vocab && story.vocab.length)
          ? `
            <div class="mt-4">
              <h4 class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">Vocabulario Clave de la Obra (Clic para escuchar)</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                ${story.vocab.map(v => {
                  const safeTerm = (v.term || '').replace(/'/g, "\\'");
                  return `
                    <button onclick="speakText('${safeTerm}', 0.9)" class="text-left p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 transition cursor-pointer">
                      <div class="flex items-center justify-between gap-1">
                        <span class="text-xs font-bold text-emerald-300">${v.term}</span>
                        <span class="text-[10px] font-mono text-sky-400">${v.ipa || ''}</span>
                      </div>
                      <p class="text-[11px] text-slate-400 mt-0.5">${v.es || ''}</p>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          `
          : '';

        moralContainer.innerHTML = `
          <div class="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
            <span class="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">Moraleja / Moral of the Story</span>
            <p class="text-xs sm:text-sm font-bold text-white">${story.moralEn || ''}</p>
            ${isBilingualStoryModeActive && story.moralEs ? `<p class="text-xs text-slate-400 italic mt-0.5">${story.moralEs}</p>` : ''}
          </div>
          ${vocabHtml}
        `;
      }
    }

    function toggleBilingualStoryMode() {
      isBilingualStoryModeActive = !isBilingualStoryModeActive;
      const labelEl = document.getElementById('storyBilingualToggleLabel');
      const btn = document.getElementById('storyBilingualToggleBtn');
      if (labelEl) {
        labelEl.textContent = isBilingualStoryModeActive ? 'Modo Bilingüe: Activo' : 'Modo: Solo Inglés';
      } else if (btn) {
        btn.textContent = isBilingualStoryModeActive ? 'Modo Bilingüe: Activo' : 'Modo: Solo Inglés';
      }
      loadStoryViewer(currentStoryIndex);
    }

    function readEntireStoryAudio() {
      const story = STORIES_DATA[currentStoryIndex];
      if (!story) return;
      const fullText = story.paragraphs.map(p => p.en).join(' ');
      speakText(fullText, 0.92);
      showFloatingToast('Reproduciendo narración completa en inglés...', 'Audio');
    }

    function startVoicePracticeParagraph(pIdx, targetText) {
      const feedbackEl = document.getElementById(`voiceFeedback-${pIdx}`);
      const micBtn = document.getElementById(`storyMicBtn-${pIdx}`);
      const micLabel = document.getElementById(`storyMicLabel-${pIdx}`);

      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        if (feedbackEl) {
          feedbackEl.classList.remove('hidden');
          feedbackEl.className = 'text-xs font-mono text-amber-400 pt-2 pl-9';
          feedbackEl.textContent = 'El reconocimiento de voz Web Speech API no está disponible en este navegador.';
        }
        showFloatingToast('Tu navegador no soporta reconocimiento de voz.', 'Aviso');
        return;
      }

      stopStoryNarration();
      if (activeStoryRecognition) {
        try { activeStoryRecognition.abort(); } catch (e) { }
        activeStoryRecognition = null;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      activeStoryRecognition = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      if (micBtn) {
        micBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-500');
        micBtn.classList.add('bg-rose-600', 'hover:bg-rose-500', 'animate-pulse');
      }
      if (micLabel) micLabel.textContent = 'Escuchando...';

      if (feedbackEl) {
        feedbackEl.classList.remove('hidden');
        feedbackEl.className = 'text-xs font-mono text-sky-400 pt-2 pl-9';
        feedbackEl.textContent = 'Speaking Coach activo: Lee el párrafo en voz alta en inglés...';
      }

      recognition.onresult = (event) => {
        const cleanTarget = targetText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
        const targetWords = cleanTarget.split(' ').filter(Boolean);

        let bestAccuracy = -1;
        let bestTranscript = '';
        let bestWordStatuses = [];

        const alternatives = event.results[0];
        for (let a = 0; a < alternatives.length; a++) {
          const rawSpoken = alternatives[a].transcript || '';
          const cleanSpoken = rawSpoken.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
          const spokenWords = cleanSpoken.split(' ').filter(Boolean);

          let matches = 0;
          const statuses = targetWords.map(tw => {
            const matched = spokenWords.some(sw => sw === tw || (tw.length > 4 && (sw.startsWith(tw.slice(0, -1)) || tw.startsWith(sw.slice(0, -1)))));
            if (matched) matches++;
            return { word: tw, matched };
          });

          const acc = targetWords.length > 0 ? Math.min(100, Math.round((matches / targetWords.length) * 100)) : 0;
          if (acc > bestAccuracy) {
            bestAccuracy = acc;
            bestTranscript = rawSpoken;
            bestWordStatuses = statuses;
          }
        }

        const accuracy = Math.max(0, bestAccuracy);
        const passed = accuracy >= 65;

        if (feedbackEl) {
          feedbackEl.classList.remove('hidden');
          const wordsBreakdownHtml = bestWordStatuses.map(item =>
            `<span class="px-1.5 py-0.5 rounded text-[10px] ${item.matched ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'}">${item.word}</span>`
          ).join(' ');

          if (passed) {
            feedbackEl.className = 'text-xs font-mono pt-2 pl-9 space-y-1.5';
            feedbackEl.innerHTML = `
              <div class="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 space-y-1.5">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="font-bold text-emerald-300">Pronunciación aprobada — Precisión: ${accuracy}%</span>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[10px] font-bold">+50 EXP Asignados al Perfil</span>
                </div>
                <p class="text-[11px] text-slate-300 italic">Transcripción detectada: "${bestTranscript}"</p>
                <div class="flex flex-wrap gap-1 pt-1">${wordsBreakdownHtml}</div>
              </div>
            `;
            addExp(50, 'Pronunciación aprobada en Cuentos');
          } else {
            feedbackEl.className = 'text-xs font-mono pt-2 pl-9 space-y-1.5';
            feedbackEl.innerHTML = `
              <div class="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 space-y-1.5">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="font-bold text-amber-300">Precisión alcanzada: ${accuracy}% (Se requiere mínimo 65% para +50 EXP)</span>
                  <span class="text-[10px] text-amber-200">Intenta pronunciar las palabras en ámbar con mayor claridad</span>
                </div>
                <p class="text-[11px] text-slate-300 italic">Transcripción detectada: "${bestTranscript}"</p>
                <div class="flex flex-wrap gap-1 pt-1">${wordsBreakdownHtml}</div>
              </div>
            `;
          }
        }
      };

      recognition.onerror = (event) => {
        if (feedbackEl) {
          feedbackEl.classList.remove('hidden');
          feedbackEl.className = 'text-xs font-mono text-rose-400 pt-2 pl-9';
          const errMsg = event.error === 'not-allowed'
            ? 'Permiso de micrófono denegado. Habilita el micrófono en tu navegador para usar el Speaking Coach.'
            : 'No se detectó voz claramente. Haz clic en Pronunciar e intenta leer el párrafo de nuevo.';
          feedbackEl.textContent = errMsg;
        }
      };

      recognition.onend = () => {
        if (micBtn) {
          micBtn.classList.remove('bg-rose-600', 'hover:bg-rose-500', 'animate-pulse');
          micBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
        }
        if (micLabel) micLabel.textContent = 'Pronunciar';
        activeStoryRecognition = null;
      };

      try {
        recognition.start();
      } catch (e) {
        if (micLabel) micLabel.textContent = 'Pronunciar';
      }
    }

    function downloadStoryPdf() {
      const story = STORIES_DATA[currentStoryIndex];
      if (!story) return;

      const safeTitle = (story.title || 'Historia_Ingles').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = 'Glosario.pdf';

      // 1. Usar jsPDF para maquetar la lectura y vocabulario
      if (window.jspdf && window.jspdf.jsPDF) {
        try {
          const doc = new window.jspdf.jsPDF();
          doc.setFontSize(18);
          doc.text(story.title || 'Lectura de Inglés', 14, 20);
          doc.setFontSize(10);
          doc.text('Nivel: ' + (story.level || 'Básico') + ' | Autor: Wilberth Alessandro Molina Cutz', 14, 27);
          doc.setLineWidth(0.5);
          doc.line(14, 30, 196, 30);

          let y = 38;
          doc.setFontSize(10);
          const paragraphs = story.paragraphs || [];
          for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
            const p = paragraphs[pIdx];
            if (y > 260) { doc.addPage(); y = 20; }
            const splitText = doc.splitTextToSize(p.en, 180);
            doc.text(splitText, 14, y);
            y += (splitText.length * 5) + 4;
          }

          if (story.vocab && story.vocab.length) {
            if (y > 240) { doc.addPage(); y = 20; }
            y += 6;
            doc.setFont(undefined, 'bold');
            doc.text('Vocabulario Clave de Estudio:', 14, y);
            y += 6;
            doc.setFont(undefined, 'normal');
            for (let vIdx = 0; vIdx < story.vocab.length; vIdx++) {
              const v = story.vocab[vIdx];
              if (y > 275) { doc.addPage(); y = 20; }
              doc.text('• ' + v.term + ' (' + (v.ipa || '') + '): ' + (v.es || ''), 14, y);
              y += 5;
            }
          }
          const pdfBlob = doc.output('blob');
          triggerBlobDownload(pdfBlob, filename);
          return;
        } catch (e) {
          console.warn('jsPDF story fallback to binary generator:', e);
        }
      }

      // 2. Generador binario offline
      const items = (story.vocab || []).map(function(v) {
        return {
          term: v.term,
          pron: v.ipa,
          meaning: v.es,
          example: ''
        };
      });
      const binaryBlob = generateSimplePdfBlob(
        story.title,
        'Wilberth Alessandro Molina Cutz',
        items
      );
      triggerBlobDownload(binaryBlob, filename);
    }

    // ========================================================
    

  // MOTOR 3D WORLD TOUR DE ALTA FIDELIDAD (PBR, 60 FPS, HOUSE & GARDEN)
    // ========================================================
    let threeScene, threeCamera, threeRenderer;
    let threeRaycaster, threePointer;
    let threeInteractiveMeshes = [];
    let threeCurrentInspectedObj = null;
    let threeResizeObserver = null;
    let isThreeInitialized = false;
    let currentScenarioKey = 'house';

    // Objetos animados continuos
    const threeAnimatedObjects = {
      fan: null,
      sprinkler: null
    };

    // Variables de navegación en primera persona
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let cameraYaw = -Math.PI / 2;
    let cameraPitch = -0.06;
    let isDraggingMouse = false;
    let previousMousePosition = { x: 0, y: 0 };
    let mouseDownPos = { x: 0, y: 0 };
    let joystickMove = { x: 0, y: 0 };

    let ROOM_LIMITS = {
      minX: -7.5,
      maxX: 7.5,
      minZ: -7.5,
      maxZ: 7.5,
      eyeHeight: 1.7
    };

    function initThreeWorldTour() {
      if (typeof window.initOrResumeWorld3D === 'function') {
        return window.initOrResumeWorld3D();
      }
      const container = document.getElementById('threeCanvasContainer');
      const mount = document.getElementById('threeWebGLMount');
      if (!container || !mount) return;

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
      threeCamera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
      threeCamera.position.set(-2.5, ROOM_LIMITS.eyeHeight, 2.5);

      // 3. Renderer optimizado para GPUs móviles (PBR, 60 FPS, ACESFilmic, Soft Shadows)
      threeRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        precision: 'mediump',
        powerPreference: 'high-performance'
      });
      threeRenderer.setClearColor(0x0f172a, 1);
      threeRenderer.setSize(width, height);
      threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
      threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      threeRenderer.toneMappingExposure = 1.05;
      threeRenderer.shadowMap.enabled = true;
      threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Inyectamos el canvas EXCLUSIVAMENTE en #threeWebGLMount
      mount.innerHTML = '';
      mount.appendChild(threeRenderer.domElement);

      // 4. Raycaster & Pointer
      threeRaycaster = new THREE.Raycaster();
      threePointer = new THREE.Vector2();

      // 5. Controles PC y Móvil
      setupFirstPersonControls(threeRenderer.domElement);
      setupVirtualJoystick();

      // 6. Construir Escenario Inicial (House)
      buildCurrentScenario();

      // 7. Resize Observer & Screen Orientation Responsive Listener (Landscape / Portrait)
      const camera = threeCamera;
      const renderer = threeRenderer;
      window.addEventListener("resize", () => {
        if (camera && renderer) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
          if (container && container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
          }
          if (threeScene) {
            renderer.render(threeScene, camera);
          }
        }
      });

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

      // 8. Bucle de Animación a 60 FPS con delta time
      let lastTime = performance.now();
      let threeAnimFrameId = null;
      function animate3D(now) {
        threeAnimFrameId = requestAnimationFrame(animate3D);
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        if (threeRenderer && threeScene && threeCamera && currentActiveView === 'view-worldtour') {
          // Rotación continua del ventilador de techo (House)
          if (threeAnimatedObjects.fan) {
            threeAnimatedObjects.fan.rotation.y += delta * 4.5;
          }

          // Giro continuo del aspersor de riego (Garden)
          if (threeAnimatedObjects.sprinkler) {
            threeAnimatedObjects.sprinkler.rotation.y += delta * 6.5;
          }

          updatePlayerMovement(delta);
          threeRenderer.render(threeScene, threeCamera);
        }
      }
      threeAnimFrameId = requestAnimationFrame(animate3D);

      // Pausa automática del bucle de renderizado en segundo plano para ahorrar batería y recursos
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (threeAnimFrameId) {
            cancelAnimationFrame(threeAnimFrameId);
            threeAnimFrameId = null;
          }
        } else {
          if (!threeAnimFrameId && isThreeInitialized && currentActiveView === 'view-worldtour') {
            lastTime = performance.now();
            threeAnimFrameId = requestAnimationFrame(animate3D);
          }
        }
      });

      isThreeInitialized = true;
    }

    // ========================================================
    // TEXTURAS PROCEDURALES LIGERAS EN MEMORIA (CANVAS HTML5)
    // ========================================================

    // Duela de madera de roble con líneas divisorias y vetas (roughness: 0.62, satinado roughness: 0.35, duela satinada roughness: 0.65)
    function createOakWoodTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Tono base roble cálido satinado
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(0, 0, 512, 512);

      const plankHeight = 64;
      for (let y = 0; y < 512; y += plankHeight) {
        const rowIdx = Math.floor(y / plankHeight);
        const shade = rowIdx % 2 === 0 ? 'rgba(215, 175, 130, 0.12)' : 'rgba(30, 18, 10, 0.16)';
        ctx.fillStyle = shade;
        ctx.fillRect(0, y, 512, plankHeight);

        // Juntas verticales alternadas entre duelas
        const xOffset = (rowIdx % 2) * 128;
        for (let x = xOffset; x < 512; x += 256) {
          ctx.strokeStyle = 'rgba(20, 10, 5, 0.9)';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + plankHeight);
          ctx.stroke();
        }

        // Vetas orgánicas onduladas y micro-anillos de madera
        for (let i = 0; i < 5; i++) {
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(75, 45, 20, 0.28)' : 'rgba(235, 195, 145, 0.15)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          const vy = y + 6 + i * 11;
          ctx.moveTo(0, vy);
          ctx.bezierCurveTo(130, vy + Math.sin(i * 1.5) * 6, 360, vy - Math.cos(i * 1.5) * 6, 512, vy);
          ctx.stroke();
        }

        // Bisel oscuro entre tablas de madera
        ctx.strokeStyle = 'rgba(20, 10, 5, 0.95)';
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

    const createProceduralWoodTexture = createOakWoodTexture;

    function safeGetPosition(pos) {
      if (Array.isArray(pos)) return { x: pos[0] || 0, y: pos[1] || 0, z: pos[2] || 0 };
      if (pos && typeof pos === 'object') return { x: pos.x || 0, y: pos.y || 0, z: pos.z || 0 };
      return { x: 0, y: 0, z: 0 };
    }

    function safeGetScale(scale) {
      if (Array.isArray(scale)) return { x: scale[0] || 1, y: scale[1] || 1, z: scale[2] || 1 };
      if (scale && typeof scale === 'object') return { x: scale.x || 1, y: scale.y || 1, z: scale.z || 1 };
      return { x: 1, y: 1, z: 1 };
    }

    // Césped exterior denso con micro-variaciones esmeralda y oliva
    function createGrassTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Base esmeralda profundo
      ctx.fillStyle = '#1b4332';
      ctx.fillRect(0, 0, 512, 512);

      // Espolvoreado denso de briznas y micro-césped con 5 tonalidades vivas
      const colors = ['#14532d', '#15803d', '#2d6a4f', '#40916c', '#52b788', '#386641'];
      for (let i = 0; i < 3200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const w = Math.random() * 4.5 + 2.0;
        const h = Math.random() * 5.0 + 2.5;
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(x, y, w, h);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(8, 8);
      return texture;
    }

    // Pizarra escolar con textura procedural de apuntes legibles
    let cachedBlackboardTexture = null;
    function createBlackboardTexture() {
      if (cachedBlackboardTexture) return cachedBlackboardTexture;
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Fondo verde pizarra clásico con sutil polvo de tiza
      ctx.fillStyle = '#143827';
      ctx.fillRect(0, 0, 512, 256);

      // Marco interior sutil
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 4;
      ctx.strokeRect(12, 12, 488, 232);

      // Texto de clase legible en tiza
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText("TODAY'S ENGLISH LESSON", 32, 54);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText("1. Classroom & Study Vocabulary", 32, 98);
      ctx.fillText("2. Desk, Chair, Lamp & Books", 32, 136);
      ctx.fillText("3. Speaking Practice (+50 EXP)", 32, 174);

      ctx.font = 'italic 16px sans-serif';
      ctx.fillStyle = '#6ee7b7';
      ctx.fillText("★ Fluency Goal: 100% Pronunciation Accuracy", 32, 218);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      cachedBlackboardTexture = tex;
      return tex;
    }

    // Pantalla de laptop estilizada con editor de código IDE
    let cachedLaptopScreenTexture = null;
    function createLaptopScreenTexture() {
      if (cachedLaptopScreenTexture) return cachedLaptopScreenTexture;
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');

      // Interfaz de editor de código estilizado (IDE)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 256, 160);

      // Barra superior con pestañas
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 256, 22);

      // Botones ventana (rojo, amarillo, verde)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(10, 11, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#eab308';
      ctx.beginPath(); ctx.arc(22, 11, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath(); ctx.arc(34, 11, 4, 0, Math.PI * 2); ctx.fill();

      // Pestaña activa
      ctx.fillStyle = '#334155';
      ctx.fillRect(48, 4, 80, 18);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('EnglishApp.js', 54, 16);

      // Líneas de código coloreadas (syntax highlighting)
      const codeLines = [
        { color: '#818cf8', text: 'import { speak } from "coach";' },
        { color: '#38bdf8', text: 'const user = new Student();' },
        { color: '#34d399', text: 'function practiceVocabulary() {' },
        { color: '#fcd34d', text: '  user.gainExp(50);' },
        { color: '#f472b6', text: '  user.pronounce("fluent");' },
        { color: '#34d399', text: '}' }
      ];

      codeLines.forEach((line, idx) => {
        const y = 42 + idx * 18;
        ctx.fillStyle = '#475569';
        ctx.font = '9px monospace';
        ctx.fillText(String(idx + 1), 10, y);

        ctx.fillStyle = line.color;
        ctx.font = 'bold 9px monospace';
        ctx.fillText(line.text, 26, y);
      });

      // Barra inferior de estado
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 146, 256, 14);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '8px sans-serif';
      ctx.fillText('⚡ Ready • UTF-8 • JavaScript • 60 FPS', 10, 156);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      cachedLaptopScreenTexture = tex;
      return tex;
    }

    // Textura procedural para cuadros decorativos
    let cachedPaintingTexture = null;
    function createPaintingTexture() {
      if (cachedPaintingTexture) return cachedPaintingTexture;
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 160;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, 160);
      grad.addColorStop(0, '#38bdf8'); grad.addColorStop(0.55, '#fde047');
      grad.addColorStop(0.7, '#fb923c'); grad.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 256, 160);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.moveTo(0, 160); ctx.lineTo(40, 105); ctx.lineTo(95, 125); ctx.lineTo(160, 85); ctx.lineTo(215, 115); ctx.lineTo(256, 95); ctx.lineTo(256, 160); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
      ctx.beginPath(); ctx.arc(160, 75, 16, 0, Math.PI * 2); ctx.fill();
      const tex = new THREE.CanvasTexture(canvas);
      cachedPaintingTexture = tex;
      return tex;
    }

    // Textura procedural para reloj analógico
    let cachedClockTexture = null;
    function createClockFaceTexture() {
      if (cachedClockTexture) return cachedClockTexture;
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(128, 128, 120, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 6; ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const x1 = 128 + Math.sin(angle) * 96; const y1 = 128 - Math.cos(angle) * 96;
        const x2 = 128 + Math.sin(angle) * 110; const y2 = 128 - Math.cos(angle) * 110;
        ctx.lineWidth = i % 3 === 0 ? 5 : 2;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(128, 128); ctx.lineTo(82, 82); ctx.stroke();
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(128, 128); ctx.lineTo(174, 82); ctx.stroke();
      ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(128, 128); ctx.lineTo(128, 48); ctx.stroke();
      ctx.fillStyle = '#d97706'; ctx.beginPath(); ctx.arc(128, 128, 6, 0, Math.PI * 2); ctx.fill();
      const tex = new THREE.CanvasTexture(canvas);
      cachedClockTexture = tex;
      return tex;
    }

    // Textura procedural para alfombra
    let cachedRugTexture = null;
    function createRugTexture() {
      if (cachedRugTexture) return cachedRugTexture;
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0f766e'; ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#2dd4bf'; ctx.lineWidth = 6; ctx.strokeRect(12, 12, 232, 232);
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3; ctx.strokeRect(24, 24, 208, 208);
      ctx.fillStyle = '#134e4a';
      ctx.beginPath(); ctx.moveTo(128, 40); ctx.lineTo(216, 128); ctx.lineTo(128, 216); ctx.lineTo(40, 128); ctx.closePath(); ctx.fill();
      const tex = new THREE.CanvasTexture(canvas);
      cachedRugTexture = tex;
      return tex;
    }

    // Funciones de liberación segura de recursos GPU para prevenir memory leaks
    function disposeThreeMaterial(mat) {
      if (!mat) return;
      if (mat.map && mat.map !== cachedBlackboardTexture && mat.map !== cachedLaptopScreenTexture && mat.map !== cachedPaintingTexture && mat.map !== cachedClockTexture && mat.map !== cachedRugTexture) {
        try { mat.map.dispose(); } catch (e) {}
      }
      try { mat.dispose(); } catch (e) {}
    }

    function disposeThreeNode(node) {
      if (!node) return;
      if (node.children) {
        while (node.children.length > 0) {
          disposeThreeNode(node.children[0]);
          node.remove(node.children[0]);
        }
      }
      if (node.geometry) {
        try { node.geometry.dispose(); } catch (e) {}
      }
      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach(m => disposeThreeMaterial(m));
        } else {
          disposeThreeMaterial(node.material);
        }
      }
    }

    // ========================================================
    // GESTIÓN Y CONSTRUCCIÓN DE ESCENARIOS (HOUSE & GARDEN)
    // ========================================================

    function switch3DScenario(scenarioKey) {
      if (window.World3D && typeof window.World3D.switch3DScenario === 'function') {
        return window.World3D.switch3DScenario(scenarioKey);
      }
      if (!WORLD_TOUR_SCENARIOS[scenarioKey]) return;
      currentScenarioKey = scenarioKey;

      const btnHouse = document.getElementById('scenarioBtnHouse');
      const btnGarden = document.getElementById('scenarioBtnGarden');

      if (btnHouse && btnGarden) {
        if (scenarioKey === 'house') {
          btnHouse.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer bg-purple-600 text-white border border-purple-400';
          btnGarden.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-slate-800 text-slate-300 hover:text-white border border-slate-700';
        } else {
          btnGarden.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer bg-emerald-600 text-white border border-emerald-400';
          btnHouse.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-slate-800 text-slate-300 hover:text-white border border-slate-700';
        }
      }

      close3DInspectCard();
      buildCurrentScenario();
      showFloatingToast(`Cargando escenario: ${WORLD_TOUR_SCENARIOS[scenarioKey].title}`, '🪐');
    }

    function buildCurrentScenario() {
      if (!threeScene) return;

      // Limpiar objetos y luces previas
      while (threeScene.children.length > 0) {
        const obj = threeScene.children[0];
        disposeThreeNode(obj);
        threeScene.remove(obj);
      }

      threeInteractiveMeshes = [];
      threeAnimatedObjects.fan = null;
      threeAnimatedObjects.sprinkler = null;

      const scen = WORLD_TOUR_SCENARIOS[currentScenarioKey] || WORLD_TOUR_SCENARIOS.house;
      ROOM_LIMITS = scen.roomLimits || { minX: -7.5, maxX: 7.5, minZ: -7.5, maxZ: 7.5, eyeHeight: 1.7 };

      // Restablecer posición y rotación de cámara
      const spawn = safeGetPosition(scen.spawnPos || { x: -2.5, y: 1.7, z: 2.5 });
      threeCamera.position.set(spawn.x, spawn.y, spawn.z);
      cameraYaw = currentScenarioKey === 'house' ? -Math.PI / 2 : -Math.PI / 2;
      cameraPitch = -0.06;

      if (currentScenarioKey === 'house') {
        buildHouseEnvironment();
      } else {
        buildGardenEnvironment();
      }

      // Instanciar objetos interactivos del escenario
      const objects = scen.objects || [];
      objects.forEach(objData => {
        try {
          const mesh = buildCompound3DObject(objData, currentScenarioKey);
          if (mesh) {
            mesh.userData = objData;
            threeScene.add(mesh);
            threeInteractiveMeshes.push(mesh);
          }
        } catch (e) {
          console.error('Error instanciando objeto 3D', objData.id, e);
        }
      });

      if (threeRenderer) {
        threeRenderer.render(threeScene, threeCamera);
      }
    }

    // ENTORNO 1: HOUSE & ROOMS (4 Habitaciones Reales: Living Room, Bedroom, Kitchen, Bathroom)
    function buildHouseEnvironment() {
      threeScene.background = new THREE.Color(0x0f172a);

      // 1. Iluminación PBR Interior Calibrada: HemisphereLight + DirectionalLight + PointLights
      const hemiLight = new THREE.HemisphereLight(0xfff7ed, 0x1e293b, 0.7);
      threeScene.add(hemiLight);

      // AmbientLight suave (0xe2e8f0, 0.7) configurada
      const ambientLight = new THREE.AmbientLight(0xe2e8f0, 0.35);
      threeScene.add(ambientLight);

      // DirectionalLight cálida (0xfffaf0, 1.5) entrando por ventana
      const dirLight = new THREE.DirectionalLight(0xfffaf0, 1.5);
      dirLight.position.set(-6.5, 5.5, -4.0);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.0004;
      dirLight.shadow.radius = 2.5; // Sombras suaves PCFSoftShadowMap
      threeScene.add(dirLight);

      // Iluminación diferenciada por estancia:
      // PointLight cálida (0xffedd5) en la lámpara de la sala (Living Room)
      const lampLight = new THREE.PointLight(0xffedd5, 1.8, 9.5);
      lampLight.position.set(-6.2, 2.2, -5.5);
      lampLight.castShadow = true;
      lampLight.shadow.bias = -0.001;
      threeScene.add(lampLight);

      // Lámpara de noche cálida en recámara (Bedroom)
      const bedLight = new THREE.PointLight(0xffedd5, 1.5, 8.5);
      bedLight.position.set(2.2, 1.6, -5.8);
      threeScene.add(bedLight);

      // Luz cenital neutra en cocina/comedor (Kitchen / Dining)
      const kitchenLight = new THREE.PointLight(0xfffbeb, 1.4, 9.0);
      kitchenLight.position.set(-4.0, 3.5, 4.0);
      threeScene.add(kitchenLight);

      // Aplique LED en espejo de baño (Bathroom)
      const bathLight = new THREE.PointLight(0xf8fafc, 1.3, 7.5);
      bathLight.position.set(3.2, 2.2, 3.0);
      threeScene.add(bathLight);

      // 2. Piso continuo de duela de roble satinada (roughness: 0.65, roughness: 0.62, satinado roughness: 0.35)
      const woodTex = createOakWoodTexture();
      const floorMat = new THREE.MeshStandardMaterial({
        map: woodTex,
        roughness: 0.62, // Duela de roble con roughness 0.62 para eliminar reflejos sobreexpuestos
        metalness: 0.04
      });
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      threeScene.add(floor);

      // 3. Muros perimetrales exteriores e interiores con pintura satinada (#e2e8f0)
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.85 });

      // Muros Perimetrales Exteriores
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(18, 4.5, 0.3), wallMat);
      backWall.position.set(0, 2.25, -8.5);
      backWall.receiveShadow = true;
      const frontWall = new THREE.Mesh(new THREE.BoxGeometry(18, 4.5, 0.3), wallMat);
      frontWall.position.set(0, 2.25, 8.5);
      frontWall.receiveShadow = true;
      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.5, 18), wallMat);
      leftWall.position.set(-8.5, 2.25, 0);
      leftWall.receiveShadow = true;
      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.5, 18), wallMat);
      rightWall.position.set(8.5, 2.25, 0);
      rightWall.receiveShadow = true;
      threeScene.add(backWall, frontWall, leftWall, rightWall);

      // Muros Divisorios Interiores con Vanos de Paso (4 Habitaciones Reales)
      // Muro Eje Z=0 (Divide Sala/Cocina al Oeste y Recámara/Baño al Este)
      // Tramo Oeste 1 (Living/Kitchen)
      const partZ1 = new THREE.Mesh(new THREE.BoxGeometry(3.9, 4.5, 0.25), wallMat);
      partZ1.position.set(-6.55, 2.25, 0);
      // Dintel sobre vano Living-Kitchen
      const lintelZ1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 0.25), wallMat);
      lintelZ1.position.set(-3.5, 3.6, 0);
      // Tramo Central Z
      const partZC = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.5, 0.25), wallMat);
      partZC.position.set(-1.1, 2.25, 0);

      // Tramo Este 1 (Bedroom/Bathroom)
      const partZC2 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.5, 0.25), wallMat);
      partZC2.position.set(1.1, 2.25, 0);
      // Dintel sobre vano Bedroom-Bathroom
      const lintelZ2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 0.25), wallMat);
      lintelZ2.position.set(3.5, 3.6, 0);
      // Tramo Este 2
      const partZ2 = new THREE.Mesh(new THREE.BoxGeometry(3.9, 4.5, 0.25), wallMat);
      partZ2.position.set(6.55, 2.25, 0);
      threeScene.add(partZ1, lintelZ1, partZC, partZC2, lintelZ2, partZ2);

      // Muro Eje X=0 (Divide Sala/Recámara al Norte y Cocina/Baño al Sur)
      // Tramo Norte 1 (Living/Bedroom)
      const partX1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 4.5, 3.9), wallMat);
      partX1.position.set(0, 2.25, -6.55);
      // Dintel sobre vano Living-Bedroom
      const lintelX1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.8, 2.2), wallMat);
      lintelX1.position.set(0, 3.6, -3.5);
      // Tramo Central X Norte
      const partXC1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 4.5, 2.6), wallMat);
      partXC1.position.set(0, 2.25, -1.1);

      // Tramo Central X Sur (Kitchen/Bathroom)
      const partXC2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 4.5, 2.6), wallMat);
      partXC2.position.set(0, 2.25, 1.1);
      // Dintel sobre vano Kitchen-Bathroom
      const lintelX2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.8, 2.2), wallMat);
      lintelX2.position.set(0, 3.6, 3.5);
      // Tramo Sur 2
      const partX2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 4.5, 3.9), wallMat);
      partX2.position.set(0, 2.25, 6.55);
      threeScene.add(partX1, lintelX1, partXC1, partXC2, lintelX2, partX2);

      // 4. Techo continuo superior (#f8fafc)
      const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });
      const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), ceilingMat);
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.y = 4.5;
      threeScene.add(ceiling);

      // 5. Molduras perimetrales de yeso (crown molding) en la unión con el techo
      const crownMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
      const crownBack = new THREE.Mesh(new THREE.BoxGeometry(18, 0.16, 0.12), crownMat);
      crownBack.position.set(0, 4.42, -8.38);
      const crownLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 18), crownMat);
      crownLeft.position.set(-8.38, 4.42, 0);
      const crownRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 18), crownMat);
      crownRight.position.set(8.38, 4.42, 0);
      const crownFront = new THREE.Mesh(new THREE.BoxGeometry(18, 0.16, 0.12), crownMat);
      crownFront.position.set(0, 4.42, 8.38);
      threeScene.add(crownBack, crownLeft, crownRight, crownFront);

      // Molduras en muros divisorios
      const crownDivZ = new THREE.Mesh(new THREE.BoxGeometry(18, 0.14, 0.10), crownMat);
      crownDivZ.position.set(0, 4.43, 0);
      const crownDivX = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.14, 18), crownMat);
      crownDivX.position.set(0, 4.43, 0);
      threeScene.add(crownDivZ, crownDivX);

      // 6. Zoclos de madera de roble oscuro en la base de todos los muros
      const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x3b1d0e, roughness: 0.45 });
      const bbBack = new THREE.Mesh(new THREE.BoxGeometry(18, 0.18, 0.06), baseboardMat);
      bbBack.position.set(0, 0.09, -8.32);
      const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 18), baseboardMat);
      bbLeft.position.set(-8.32, 0.09, 0);
      const bbRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 18), baseboardMat);
      bbRight.position.set(8.32, 0.09, 0);
      const bbFront = new THREE.Mesh(new THREE.BoxGeometry(18, 0.18, 0.06), baseboardMat);
      bbFront.position.set(0, 0.09, 8.32);
      threeScene.add(bbBack, bbLeft, bbRight, bbFront);
    }

    const buildRealisticHouse = buildHouseEnvironment;

    // ENTORNO 2: BACKYARD & GARDEN (Terraza de losetas de piedra, césped denso, árbol frondoso)
    function buildGardenEnvironment() {
      threeScene.background = new THREE.Color(0x7dd3fc); // Cielo azul diurno luminoso

      // 1. Iluminación Solar Exterior PBR: HemisphereLight + DirectionalLight con Sombras Suaves
      const hemiGarden = new THREE.HemisphereLight(0xbae6fd, 0x14532d, 0.85);
      threeScene.add(hemiGarden);

      const skyLight = new THREE.AmbientLight(0xe0f2fe, 0.5);
      threeScene.add(skyLight);

      const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
      sunLight.position.set(8.0, 14.0, -12.0);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.bias = -0.0003;
      sunLight.shadow.radius = 2.0;
      threeScene.add(sunLight);

      // Luz puntual cálida en la terraza
      const patioWarmLight = new THREE.PointLight(0xffedd5, 1.2, 7.5);
      patioWarmLight.position.set(2.5, 1.7, -1.0);
      threeScene.add(patioWarmLight);

      // 2. Terreno: Suelo de césped denso esmeralda y oliva (26x26)
      const grassTex = createGrassTexture();
      const grassMat = new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.88, metalness: 0.0 });
      const lawn = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), grassMat);
      lawn.rotation.x = -Math.PI / 2;
      lawn.receiveShadow = true;
      threeScene.add(lawn);

      // 3. Sol procedural luminoso en el cielo diurno
      const sunGeo = new THREE.SphereGeometry(1.8, 16, 16);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const sunMesh = new THREE.Mesh(sunGeo, sunMat);
      sunMesh.position.set(8.0, 14.0, -18.0);
      threeScene.add(sunMesh);

      // Nubes volumétricas flotantes
      const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, opacity: 0.85, transparent: true });
      [[-8, 12, -15], [3, 13, -16], [10, 11, -12]].forEach(([cx, cy, cz]) => {
        const cloud = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2), cloudMat);
        cloud.position.set(cx, cy, cz);
        cloud.scale.set(1.8, 0.6, 1.2);
        threeScene.add(cloud);
      });

      // 6. Cerca perimetral de estacas de madera (Picket Fence)
      const fenceMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 });
      const railMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });

      function createFenceSegment(length, rotY, posX, posZ) {
        const fenceGroup = new THREE.Group();
        const postCount = Math.floor(length / 0.7);

        const topRail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.06, 0.04), railMat);
        topRail.position.y = 0.95;
        const botRail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.06, 0.04), railMat);
        botRail.position.y = 0.35;
        fenceGroup.add(topRail, botRail);

        for (let i = 0; i < postCount; i++) {
          const x = -length / 2 + (i + 0.5) * (length / postCount);
          const picket = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 0.025), fenceMat);
          picket.position.set(x, 0.55, 0);
          picket.castShadow = true;
          fenceGroup.add(picket);
        }

        fenceGroup.rotation.y = rotY;
        fenceGroup.position.set(posX, 0, posZ);
        threeScene.add(fenceGroup);
      }

      createFenceSegment(23, 0, 0, -11.5);
      createFenceSegment(23, Math.PI / 2, -11.5, 0);
      createFenceSegment(23, -Math.PI / 2, 11.5, 0);
    }

    const buildRealisticBackyard = buildGardenEnvironment;

    // ========================================================
    // MODELADO 3D COMPUESTO DE ALTA FIDELIDAD (ESTILO BLENDER)
    // ========================================================
    function buildCompound3DObject(obj, scenarioKey) {
      const group = new THREE.Group();

      if (scenarioKey === 'house') {
        if (obj.id === 'hammock') {
          // Hamaca: curvatura cóncava natural hacia abajo (catenaria), barras de madera laterales, cuerdas tensadas y anclajes
          const fabricMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, side: THREE.DoubleSide, roughness: 0.65 });
          
          // Malla cóncava con curvatura catenaria suave suspendida colgando hacia abajo
          const fabricGeo = new THREE.PlaneGeometry(3.3, 1.0, 24, 8);
          const fPos = fabricGeo.attributes.position;
          for (let i = 0; i < fPos.count; i++) {
            const px = fPos.getX(i);
            const pz = fPos.getY(i);
            const normX = px / 1.65;
            const catenaryY = 0.53 * (Math.cosh(normX * 1.35) - 1) / (Math.cosh(1.35) - 1);
            const cradleZ = (pz / 0.5) * (pz / 0.5) * 0.12 * (1 - normX * normX);
            fPos.setX(i, px);
            fPos.setY(i, 0.62 + catenaryY + cradleZ);
            fPos.setZ(i, pz);
          }
          fabricGeo.computeVertexNormals();
          const fabric = new THREE.Mesh(fabricGeo, fabricMat);
          fabric.castShadow = true;
          fabric.receiveShadow = true;
          group.add(fabric);

          // Barras separadoras de madera cilíndricas en los extremos
          const barMat = new THREE.MeshStandardMaterial({ color: 0x5c2b09, roughness: 0.45 });
          const bar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.04, 16), barMat);
          bar1.rotation.x = Math.PI / 2;
          bar1.position.set(-1.65, 1.15, 0);
          bar1.castShadow = true;
          const bar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.04, 16), barMat);
          bar2.rotation.x = Math.PI / 2;
          bar2.position.set(1.65, 1.15, 0);
          bar2.castShadow = true;
          group.add(bar1, bar2);

          // Cuerdas tensadas trenzadas en abanico
          const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 });
          [-0.42, -0.21, 0, 0.21, 0.42].forEach(offsetZ => {
            const lenL = Math.hypot(2.95 - 1.65, 1.62 - 1.15);
            const ropeL = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, lenL), ropeMat);
            ropeL.position.set(-2.30, 1.38, offsetZ * 0.5);
            ropeL.rotation.z = -Math.atan2(1.62 - 1.15, 2.95 - 1.65);
            const ropeR = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, lenL), ropeMat);
            ropeR.position.set(2.30, 1.38, offsetZ * 0.5);
            ropeR.rotation.z = Math.atan2(1.62 - 1.15, 2.95 - 1.65);
            group.add(ropeL, ropeR);
          });

          // Anclajes firmes y argollas de hierro incrustadas en las paredes opuestas (TorusGeometry)
          const ringMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
          const ringL = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.018, 8, 16), ringMat);
          ringL.position.set(-2.95, 1.62, 0);
          const ringR = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.018, 8, 16), ringMat);
          ringR.position.set(2.95, 1.62, 0);
          const bracketMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.3 });
          const bracketL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.14), bracketMat);
          bracketL.position.set(-2.98, 1.62, 0);
          const bracketR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.14), bracketMat);
          bracketR.position.set(2.98, 1.62, 0);
          group.add(ringL, ringR, bracketL, bracketR);

          // Almohadas de descanso dentro de la hamaca
          const hPillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.32), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 }));
          hPillow1.position.set(-0.35, 0.69, 0);
          hPillow1.rotation.z = -0.15;
          group.add(hPillow1);

        } else if (obj.id === 'sofa') {
          // Sofá de 3 plazas con cojines biselados y patas torneadas tocando el piso (y = 0)
          const sofaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.82 });
          const cushionMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.78 });
          const legMat = new THREE.MeshStandardMaterial({ color: 0x3b1a06, roughness: 0.38 });
          const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });

          // 4 Patas cónicas torneadas con anillos decorativos y casquillos de latón tocando el suelo (y = 0)
          const legOffsets = [[-1.32, -0.42], [1.32, -0.42], [-1.32, 0.42], [1.32, 0.42]];
          legOffsets.forEach(([lx, lz]) => {
            const legShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.022, 0.24, 16), legMat);
            legShaft.position.set(lx, 0.12, lz);
            legShaft.castShadow = true;
            const legCollar = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.008, 8, 16), legMat);
            legCollar.position.set(lx, 0.21, lz);
            legCollar.rotation.x = Math.PI / 2;
            const footBrass = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.020, 0.04, 16), brassMat);
            footBrass.position.set(lx, 0.02, lz);
            group.add(legShaft, legCollar, footBrass);
          });

          // Base principal tapizada con faldón
          const base = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.26, 1.08), sofaMat);
          base.position.y = 0.36;
          base.castShadow = true;
          group.add(base);

          // 3 Cojines de asiento biselados independientes
          for (let i = 0; i < 3; i++) {
            const cx = -0.92 + i * 0.92;
            const seat = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.20, 0.94), cushionMat);
            seat.position.set(cx, 0.57, 0.05);
            seat.castShadow = true;
            group.add(seat);

            // 3 Cojines de respaldo biselados con inclinación ergonómica
            const back = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.54, 0.24), cushionMat);
            back.position.set(cx, 0.88, -0.38);
            back.rotation.x = -0.12;
            back.castShadow = true;
            group.add(back);
          }

          // Reposabrazos perfilados y acolchados
          const armL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.54, 1.08), sofaMat);
          armL.position.set(-1.44, 0.58, 0);
          armL.castShadow = true;
          const armR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.54, 1.08), sofaMat);
          armR.position.set(1.44, 0.58, 0);
          armR.castShadow = true;
          group.add(armL, armR);

          // 2 Cojines de acento decorativos
          const pillowMat1 = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
          const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.36, 0.15), pillowMat1);
          pillow1.position.set(-1.18, 0.68, 0.10);
          pillow1.rotation.y = 0.26;
          const pillowMat2 = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.6 });
          const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.36, 0.15), pillowMat2);
          pillow2.position.set(1.18, 0.68, 0.10);
          pillow2.rotation.y = -0.26;
          group.add(pillow1, pillow2);

        } else if (obj.id === 'cushion') {
          const mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.65 });
          const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.40, 0.16), mat);
          pillow.rotation.set(0.1, 0.2, 0.15);
          pillow.castShadow = true;
          group.add(pillow);

        } else if (obj.id === 'bookshelf') {
          // Estantería abierta con 5 repisas y más de 25 libros con lomos de colores variados tocando el piso (y = 0)
          const woodMat = new THREE.MeshStandardMaterial({ color: 0x241206, roughness: 0.48 });
          const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.48, 2.7, 0.05), woodMat);
          frameL.position.set(0, 1.35, -0.92);
          const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.48, 2.7, 0.05), woodMat);
          frameR.position.set(0, 1.35, 0.92);
          const backBoard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.7, 1.88), woodMat);
          backBoard.position.set(-0.22, 1.35, 0);
          group.add(frameL, frameR, backBoard);

          // 5 Repisas horizontales abiertas con más de 25 libros
          const bookColors = [0xdc2626, 0x1e3a8a, 0x059669, 0xd97706, 0x7c3aed, 0x831843, 0xfef3c7, 0x0284c7, 0x0f766e, 0x475569];
          for (let shelf = 0; shelf < 5; shelf++) {
            const shelfY = 0.12 + shelf * 0.52;
            const shelfBoard = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 1.82), woodMat);
            shelfBoard.position.set(0, shelfY, 0);
            group.add(shelfBoard);

            const booksOnShelf = 6 + (shelf % 2);
            for (let b = 0; b < booksOnShelf; b++) {
              const colorIdx = (shelf * 7 + b) % bookColors.length;
              const bookMat = new THREE.MeshStandardMaterial({ color: bookColors[colorIdx], roughness: 0.4 });
              const bookH = 0.32 + Math.sin(b * 1.5 + shelf) * 0.06;
              const bookThick = 0.042 + Math.cos(b * 2) * 0.015;
              const book = new THREE.Mesh(new THREE.BoxGeometry(0.32, bookH, bookThick), bookMat);
              const zPos = -0.74 + b * 0.23;
              book.position.set(0.04, shelfY + 0.02 + bookH / 2, zPos);
              if (b === booksOnShelf - 1 && shelf % 2 === 1) {
                book.rotation.x = 0.18;
              }
              book.castShadow = true;
              group.add(book);
            }
          }

        } else if (obj.id === 'coffee_table') {
          // Mesa de centro biselada, patas metálicas estilizadas y libros apilados en y = 0
          const topMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.28, metalness: 0.08 });
          const top = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.82, 0.06, 32), topMat);
          top.position.y = 0.47;
          top.castShadow = true;
          group.add(top);

          const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2 + Math.PI / 4;
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.02, 0.44, 16), legMat);
            leg.position.set(Math.cos(angle) * 0.62, 0.22, Math.sin(angle) * 0.62);
            leg.castShadow = true;
            group.add(leg);
          }

          // Libros apilados sobre la mesa
          const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.24), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 }));
          b1.position.set(-0.18, 0.52, 0.08);
          const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.035, 0.22), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 }));
          b2.position.set(-0.18, 0.56, 0.08);
          b2.rotation.y = 0.15;
          group.add(b1, b2);

        } else if (obj.id === 'coffee_mug') {
          // Taza de café de cerámica con plato base y asa en toroide (TorusGeometry)
          const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.18 });
          const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.015, 16), ceramicMat);
          plate.position.y = 0.008;
          const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.14, 16), ceramicMat);
          cup.position.y = 0.08;
          const handle = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.012, 8, 16), ceramicMat);
          handle.position.set(0.085, 0.08, 0);
          handle.rotation.y = Math.PI / 2;

          // Vapor humeante estilizado (steam)
          const steamMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9, transparent: true, opacity: 0.35 });
          [0.06, 0.12, 0.18].forEach((sy, idx) => {
            const steam = new THREE.Mesh(new THREE.TorusGeometry(0.022 + idx * 0.008, 0.006, 6, 12, Math.PI * 1.2), steamMat);
            steam.rotation.x = Math.PI / 2 + (idx % 2 === 0 ? 0.35 : -0.35);
            steam.position.set((idx % 2 === 0 ? 0.01 : -0.01), 0.14 + sy, 0);
            group.add(steam);
          });

          group.add(plate, cup, handle);

        } else if (obj.id === 'ceiling_fan') {
          // Ventilador de techo con aspas animadas en rotación continua dentro de animate3D
          const rodMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });
          const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.08, 16), rodMat);
          canopy.position.y = 0.04;
          const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.56, 12), rodMat);
          rod.position.y = -0.28;
          group.add(canopy, rod);

          const fanBladesGroup = new THREE.Group();
          const hubMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.75, roughness: 0.28 });
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 20), hubMat);
          fanBladesGroup.add(hub);

          const lightDome = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.65 }));
          lightDome.position.y = -0.07;
          fanBladesGroup.add(lightDome);

          const bladeMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.38 });
          const bracketMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.25 });
          for (let i = 0; i < 4; i++) {
            const ang = (i * Math.PI) / 2;
            const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.06), bracketMat);
            bracket.position.set(Math.cos(ang) * 0.24, 0.01, Math.sin(ang) * 0.24);
            bracket.rotation.y = -ang;
            fanBladesGroup.add(bracket);

            const blade = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.018, 0.19), bladeMat);
            blade.position.set(Math.cos(ang) * 0.68, 0, Math.sin(ang) * 0.68);
            blade.rotation.y = ang;
            blade.rotation.x = 0.09;
            fanBladesGroup.add(blade);
          }

          fanBladesGroup.position.y = -0.56;
          group.add(fanBladesGroup);
          threeAnimatedObjects.fan = fanBladesGroup;

        } else if (obj.id === 'television') {
          // Consola baja de TV y pantalla OLED de borde fino apoyada en y = 0
          const standMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
          const stand = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.52, 0.6), standMat);
          stand.position.y = 0.26;
          stand.castShadow = true;

          const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.4, 0.04), new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.9, roughness: 0.2 }));
          tvFrame.position.y = 1.30;
          const oledScreen = new THREE.Mesh(new THREE.BoxGeometry(2.44, 1.34, 0.05), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.1 }));
          oledScreen.position.set(0, 1.30, 0.01);
          group.add(stand, tvFrame, oledScreen);

        } else if (obj.id === 'soundbar') {
          const barMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 });
          const bar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.09, 0.09), barMat);
          bar.position.y = 0.045;
          bar.castShadow = true;
          group.add(bar);

        } else if (obj.id === 'rug') {
          const rugMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.95 });
          const rug = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.01, 2.5), rugMat);
          rug.position.y = 0.005;
          group.add(rug);

        } else if (obj.id === 'floor_lamp') {
          const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.04, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 }));
          base.position.y = 0.02;
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.9, 12), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 }));
          pole.position.y = 0.97;
          const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.44, 0.48, 20), new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.4 }));
          shade.position.y = 1.85;
          group.add(base, pole, shade);

        } else if (obj.id === 'curtain') {
          const curtainMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.8 });
          const cLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 2.6, 16), curtainMat);
          cLeft.position.set(-1.6, 1.3, 0);
          const cRight = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 2.6, 16), curtainMat);
          cRight.position.set(1.6, 1.3, 0);
          group.add(cLeft, cRight);

        } else if (obj.id === 'window') {
          const winFrame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.3, 0.1), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }));
          const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 2.1), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
          glass.position.z = 0.06;
          group.add(winFrame, glass);

        } else if (obj.id === 'potted_plant') {
          const potMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
          const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.5, 16), potMat);
          pot.position.y = 0.25;
          const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 }));
          leaves.position.y = 0.67;
          group.add(pot, leaves);

        } else if (obj.id === 'door_lock') {
          const lockPlate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.04), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
          const handle = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.04), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
          handle.position.set(0.08, 0.05, 0.03);
          group.add(lockPlate, handle);

        } else if (obj.id === 'bed') {
          // Cama matrimonial completa con cabecera de madera, colchón, almohadas y cobertor apoyada en y = 0
          const woodBedMat = new THREE.MeshStandardMaterial({ color: 0x3e1f0e, roughness: 0.45 });
          const mattressMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85 });
          const quiltMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.70 });
          const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.90 });

          // 4 Patas torneadas de madera maciza tocando el suelo (y = 0)
          const bedLegPos = [[-0.98, -1.05], [0.98, -1.05], [-0.98, 1.05], [0.98, 1.05]];
          bedLegPos.forEach(([bx, bz]) => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.36, 16), woodBedMat);
            leg.position.set(bx, 0.18, bz);
            leg.castShadow = true;
            group.add(leg);
          });

          // Cabecera de madera elegante apoyada firmemente a ras de suelo (y = 0)
          const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.18, 1.35, 0.08), woodBedMat);
          headboard.position.set(0, 0.675, -1.08);
          headboard.castShadow = true;
          const hbCrown = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.08, 0.12), woodBedMat);
          hbCrown.position.set(0, 1.35, -1.08);
          group.add(headboard, hbCrown);

          // Pieceras y largueros laterales del bastidor
          const footboard = new THREE.Mesh(new THREE.BoxGeometry(2.10, 0.48, 0.06), woodBedMat);
          footboard.position.set(0, 0.24, 1.08);
          footboard.castShadow = true;
          const sideRailL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.20, 2.10), woodBedMat);
          sideRailL.position.set(-0.98, 0.26, 0);
          const sideRailR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.20, 2.10), woodBedMat);
          sideRailR.position.set(0.98, 0.26, 0);
          group.add(footboard, sideRailL, sideRailR);

          // Colchón matrimonial grueso
          const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.26, 2.06), mattressMat);
          mattress.position.set(0, 0.45, 0.02);
          mattress.castShadow = true;
          group.add(mattress);

          // Cobertor / Edredón acolchado con volumen y caída lateral
          const quilt = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.05, 1.45), quiltMat);
          quilt.position.set(0, 0.605, 0.32);
          quilt.castShadow = true;
          group.add(quilt);

          // 2 Almohadas matrimoniales biseladas apoyadas sobre el colchón
          const pillowL = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.18, 0.42), pillowMat);
          pillowL.position.set(-0.46, 0.65, -0.68);
          pillowL.rotation.x = 0.14;
          pillowL.castShadow = true;
          const pillowR = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.18, 0.42), pillowMat);
          pillowR.position.set(0.46, 0.65, -0.68);
          pillowR.rotation.x = 0.14;
          pillowR.castShadow = true;
          group.add(pillowL, pillowR);

        } else if (obj.id === 'nightstand') {
          // Mesita de noche con 4 patas a ras de suelo, cajones, tiradores y lámpara cálida
          const woodMat = new THREE.MeshStandardMaterial({ color: 0x3e1f0e, roughness: 0.42 });
          const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.25 });

          // 4 Patas torneadas tocando el suelo (y = 0)
          const nLegPos = [[-0.24, -0.20], [0.24, -0.20], [-0.24, 0.20], [0.24, 0.20]];
          nLegPos.forEach(([nx, nz]) => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.018, 0.22, 12), woodMat);
            leg.position.set(nx, 0.11, nz);
            leg.castShadow = true;
            group.add(leg);
          });

          // Cuerpo de la mesita con 2 cajones
          const body = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.42, 0.48), woodMat);
          body.position.set(0, 0.43, 0);
          body.castShadow = true;

          // Tiradores metálicos de latón
          const knob1 = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), brassMat);
          knob1.position.set(0, 0.52, 0.25);
          const knob2 = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), brassMat);
          knob2.position.set(0, 0.34, 0.25);
          group.add(body, knob1, knob2);

          // Lámpara de noche con luz cálida apoyada firmemente sobre la cubierta (y = 0.64)
          const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.025, 16), brassMat);
          lampBase.position.set(0, 0.65, 0);
          const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28), brassMat);
          lampStem.position.set(0, 0.79, 0);
          const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.15, 0.19, 16), new THREE.MeshStandardMaterial({ color: 0xfef3c7, emissive: 0xfef08a, emissiveIntensity: 0.45 }));
          lampShade.position.set(0, 0.95, 0);
          group.add(lampBase, lampStem, lampShade);

        } else if (obj.id === 'kitchen_counter') {
          // Encimera de cocina completa con gabinetes a ras de suelo, tarja de acero, grifo y alacenas
          const cabMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
          const toeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
          const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.18, metalness: 0.06 });
          const chromeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 });

          // Zócalo inferior / Toe-kick apoyado en el suelo (y = 0)
          const toeKick = new THREE.Mesh(new THREE.BoxGeometry(3.50, 0.10, 0.65), toeMat);
          toeKick.position.set(0, 0.05, 0.03);
          group.add(toeKick);

          // Mueble base con alacenas inferiores
          const baseCab = new THREE.Mesh(new THREE.BoxGeometry(3.60, 0.76, 0.70), cabMat);
          baseCab.position.set(0, 0.48, 0);
          baseCab.castShadow = true;

          // Tiradores de acero inoxidable en puertas
          for (let i = 0; i < 4; i++) {
            const hx = -1.35 + i * 0.90;
            const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22), chromeMat);
            handle.position.set(hx, 0.55, 0.36);
            group.add(handle);
          }
          group.add(baseCab);

          // Encimera de cuarzo blanco pulido
          const counterTop = new THREE.Mesh(new THREE.BoxGeometry(3.64, 0.06, 0.74), marbleMat);
          counterTop.position.set(0, 0.89, 0);
          counterTop.castShadow = true;
          group.add(counterTop);

          // Tarja de acero inoxidable encastrada
          const sink = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.02, 0.44), chromeMat);
          sink.position.set(-0.75, 0.925, 0);
          const faucetStem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.24), chromeMat);
          faucetStem.position.set(-0.75, 1.04, -0.16);
          const faucetSpout = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.016, 8, 16, Math.PI), chromeMat);
          faucetSpout.rotation.z = -Math.PI / 2;
          faucetSpout.position.set(-0.75, 1.16, -0.06);
          group.add(sink, faucetStem, faucetSpout);

          // Placa de cocción por inducción con quemadores
          const cooktop = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.015, 0.48), new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.1 }));
          cooktop.position.set(0.75, 0.925, 0);
          group.add(cooktop);

          // Alacenas superiores suspendidas con iluminación integrada
          const upperCab = new THREE.Mesh(new THREE.BoxGeometry(3.60, 0.85, 0.38), cabMat);
          upperCab.position.set(0, 2.45, -0.16);
          upperCab.castShadow = true;
          const underLed = new THREE.Mesh(new THREE.BoxGeometry(3.50, 0.02, 0.34), new THREE.MeshStandardMaterial({ color: 0xffedd5, emissive: 0xffedd5, emissiveIntensity: 0.6 }));
          underLed.position.set(0, 2.01, -0.16);
          group.add(upperCab, underLed);

        } else if (obj.id === 'refrigerator') {
          // Refrigerador vertical de acero inoxidable apoyado firmemente a ras de suelo (y = 0)
          const inoxMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.88, roughness: 0.22 });
          const darkInox = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.3 });
          const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });

          // 4 Soportes / patas niveladoras a ras de suelo (y = 0)
          const fOffsets = [[-0.42, -0.38], [0.42, -0.38], [-0.42, 0.38], [0.42, 0.38]];
          fOffsets.forEach(([fx, fz]) => {
            const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 12), darkInox);
            foot.position.set(fx, 0.02, fz);
            group.add(foot);
          });

          // Cuerpo principal del refrigerador
          const fridgeBody = new THREE.Mesh(new THREE.BoxGeometry(0.96, 2.04, 0.85), inoxMat);
          fridgeBody.position.set(0, 1.06, 0);
          fridgeBody.castShadow = true;

          // Puertas francesas superiores y cajón congelador inferior
          const seamV = new THREE.Mesh(new THREE.BoxGeometry(0.012, 1.25, 0.02), darkInox);
          seamV.position.set(0, 1.42, 0.43);
          const seamH = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.012, 0.02), darkInox);
          seamH.position.set(0, 0.78, 0.43);

          // Tiradores tubulares verticales de acero inoxidable
          const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.82), chromeMat);
          handleL.position.set(-0.06, 1.38, 0.47);
          const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.82), chromeMat);
          handleR.position.set(0.06, 1.38, 0.47);
          const handleFreezer = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.65), chromeMat);
          handleFreezer.rotation.z = Math.PI / 2;
          handleFreezer.position.set(0, 0.65, 0.47);

          // Dispensador de agua y hielo en puerta izquierda
          const dispenser = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.02), new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.15 }));
          dispenser.position.set(-0.25, 1.45, 0.43);

          group.add(fridgeBody, seamV, seamH, handleL, handleR, handleFreezer, dispenser);

        } else if (obj.id === 'dining_table') {
          // Mesa de comedor con 4 patas tocando el piso y 4 sillas con respaldos
          const tableWood = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.35 });
          const chairWood = new THREE.MeshStandardMaterial({ color: 0x3b1a06, roughness: 0.45 });
          const seatFabric = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });

          // 4 Patas robustas de mesa descansando a ras de suelo (y = 0)
          const tLegs = [[-0.85, -0.42], [0.85, -0.42], [-0.85, 0.42], [0.85, 0.42]];
          tLegs.forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.72, 0.075), tableWood);
            leg.position.set(lx, 0.36, lz);
            leg.castShadow = true;
            group.add(leg);
          });

          // Cubierta de la mesa de madera maciza
          const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.90, 0.05, 1.02), tableWood);
          tableTop.position.set(0, 0.745, 0);
          tableTop.castShadow = true;
          group.add(tableTop);

          // Frutero de cerámica central decorativo
          const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.10, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
          bowl.position.set(0, 0.81, 0);
          const fruit1 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
          fruit1.position.set(-0.04, 0.86, 0.02);
          const fruit2 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
          fruit2.position.set(0.04, 0.86, -0.02);
          group.add(bowl, fruit1, fruit2);

          // 4 Sillas de comedor (2 en lado norte, 2 en lado sur) con patas en y = 0
          const chairOffsets = [[-0.55, -0.72, 0], [0.55, -0.72, 0], [-0.55, 0.72, Math.PI], [0.55, 0.72, Math.PI]];
          chairOffsets.forEach(([cx, cz, crot]) => {
            const chairGroup = new THREE.Group();
            [[-0.20, -0.20], [0.20, -0.20], [-0.20, 0.20], [0.20, 0.20]].forEach(([px, pz]) => {
              const cl = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.016, 0.44, 8), chairWood);
              cl.position.set(px, 0.22, pz);
              cl.castShadow = true;
              chairGroup.add(cl);
            });
            const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.05, 0.44), seatFabric);
            seat.position.set(0, 0.465, 0);
            chairGroup.add(seat);
            const back = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.42, 0.035), chairWood);
            back.position.set(0, 0.68, -0.20);
            chairGroup.add(back);

            chairGroup.rotation.y = crot;
            chairGroup.position.set(cx, 0, cz);
            group.add(chairGroup);
          });

        } else if (obj.id === 'bathroom_sink') {
          // Lavamanos de cerámica, mueble con patas en y = 0, grifería y espejo enmarcado con LED
          const cabWood = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
          const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.15 });
          const chromeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 });
          const mirrorMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.05 });

          // Base de patas de soporte a ras de suelo (y = 0)
          const sBase = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.14, 0.50), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 }));
          sBase.position.set(0, 0.07, 0);
          group.add(sBase);

          // Mueble de baño
          const vanityBody = new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.66, 0.52), cabWood);
          vanityBody.position.set(0, 0.47, 0);
          vanityBody.castShadow = true;
          group.add(vanityBody);

          // Lavamanos de cerámica blanca
          const basin = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.44), ceramicMat);
          basin.position.set(0, 0.86, 0);
          basin.castShadow = true;
          const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22), chromeMat);
          faucet.position.set(0, 0.98, -0.16);
          group.add(basin, faucet);

          // Espejo enmarcado con marco negro y tira LED
          const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.98, 0.04), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 }));
          mirrorFrame.position.set(0, 1.70, -0.24);
          const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.90), mirrorMat);
          mirrorGlass.position.set(0, 1.70, -0.21);
          const ledTrim = new THREE.Mesh(new THREE.BoxGeometry(0.94, 1.00, 0.015), new THREE.MeshStandardMaterial({ color: 0xf8fafc, emissive: 0xf8fafc, emissiveIntensity: 0.7 }));
          ledTrim.position.set(0, 1.70, -0.25);
          group.add(mirrorFrame, mirrorGlass, ledTrim);

        } else if (obj.id === 'shower') {
          // Regadera moderna con cancel de cristal templado, plato a ras de suelo y columna cromada
          const glassMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.35, roughness: 0.05 });
          const chromeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 });

          // Plato de ducha antideslizante a ras de suelo (y = 0)
          const tray = new THREE.Mesh(new THREE.BoxGeometry(1.80, 0.04, 1.80), new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 }));
          tray.position.set(0, 0.02, 0);
          tray.receiveShadow = true;
          const drain = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.005, 0.14), chromeMat);
          drain.position.set(0, 0.042, 0);
          group.add(tray, drain);

          // Cancel de cristal templado transparente (2 paneles)
          const glassFront = new THREE.Mesh(new THREE.BoxGeometry(1.80, 2.20, 0.02), glassMat);
          glassFront.position.set(0, 1.14, -0.89);
          const glassSide = new THREE.Mesh(new THREE.BoxGeometry(0.02, 2.20, 1.80), glassMat);
          glassSide.position.set(-0.89, 1.14, 0);
          group.add(glassFront, glassSide);

          // Perfiles y tiradores cromados
          const topRail = new THREE.Mesh(new THREE.BoxGeometry(1.80, 0.04, 0.04), chromeMat);
          topRail.position.set(0, 2.24, -0.89);
          const sHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.50), chromeMat);
          sHandle.position.set(0.35, 1.10, -0.86);
          group.add(topRail, sHandle);

          // Columna de regadera con cabezal cuadrado de lluvia
          const showerColumn = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.60, 0.04), chromeMat);
          showerColumn.position.set(0.85, 1.25, 0);
          const rainHead = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.28), chromeMat);
          rainHead.position.set(0.68, 2.10, 0);
          group.add(showerColumn, rainHead);

        } else if (obj.id === 'desk') {
          // Escritorio con cubierta de madera satinada, cajonera y laptop estilizada
          const deskWood = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.45, metalness: 0.12 });
          const legMetal = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.85 });
          const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.85 });

          // Cubierta principal de madera maciza biselada
          const desktop = new THREE.Mesh(new THREE.BoxGeometry(1.40, 0.05, 0.70), deskWood);
          desktop.position.set(0, 0.745, 0);
          desktop.castShadow = true;
          desktop.receiveShadow = true;
          group.add(desktop);

          // 4 patas cónicas metálicas con casquillos de latón en la base (y = 0)
          [[-0.62, -0.28], [0.62, -0.28], [-0.62, 0.28], [0.62, 0.28]].forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.016, 0.72, 12), legMetal);
            leg.position.set(lx, 0.36, lz);
            leg.castShadow = true;
            const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.06, 12), brassMat);
            ferrule.position.set(lx, 0.03, lz);
            group.add(leg, ferrule);
          });

          // Mueble lateral cajonero bajo la cubierta
          const drawerCab = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.58), deskWood);
          drawerCab.position.set(0.42, 0.48, 0);
          drawerCab.castShadow = true;
          group.add(drawerCab);

          // Tiradores de cajón en aluminio pulido
          [-0.10, 0.10].forEach(dy => {
            const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14, 8), brassMat);
            handle.rotation.z = Math.PI / 2;
            handle.position.set(0.42, 0.48 + dy, 0.30);
            group.add(handle);
          });

          // Tapete / protector de escritorio en cuero oscuro
          const deskPad = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.006, 0.44), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.68 }));
          deskPad.position.set(-0.12, 0.773, 0);
          group.add(deskPad);

          // Laptop estilizada con pantalla emitida
          const laptopGroup = new THREE.Group();
          const laptopChassis = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.014, 0.24), legMetal);
          laptopChassis.position.y = 0.007;
          laptopChassis.castShadow = true;

          // Teclado estilizado oscuro
          const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.004, 0.12), new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.7 }));
          keyboard.position.set(0, 0.015, -0.02);

          // Trackpad
          const trackpad = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.002, 0.07), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.7 }));
          trackpad.position.set(0, 0.015, 0.07);

          // Tapa / Pantalla abierta a 105 grados
          const laptopLid = new THREE.Group();
          laptopLid.position.set(0, 0.014, -0.12);

          const lidBody = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.24, 0.010), legMetal);
          lidBody.position.set(0, 0.12, 0);
          lidBody.castShadow = true;

          const screenTex = createLaptopScreenTexture();
          const screenMat = new THREE.MeshStandardMaterial({
            map: screenTex,
            roughness: 0.25,
            metalness: 0.15,
            emissive: 0xffffff,
            emissiveMap: screenTex,
            emissiveIntensity: 0.75
          });
          const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.21), screenMat);
          screenMesh.position.set(0, 0.12, 0.006);

          laptopLid.add(lidBody, screenMesh);
          laptopLid.rotation.x = -Math.PI * 0.15;

          laptopGroup.add(laptopChassis, keyboard, trackpad, laptopLid);
          laptopGroup.position.set(-0.12, 0.776, 0);
          group.add(laptopGroup);

          // Monitor estilizado sobre soporte delgado con luz emisiva suave
          const monitorBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.01, 16), legMetal);
          monitorBase.position.set(0.35, 0.775, -0.16);
          const monitorStand = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.26, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 }));
          monitorStand.position.set(0.35, 0.90, -0.16);
          const monitorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.35, 0.018), legMetal);
          monitorFrame.position.set(0.35, 1.05, -0.15);
          const monitorDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.53, 0.32), screenMat);
          monitorDisplay.position.set(0.35, 1.05, -0.14);
          group.add(monitorBase, monitorStand, monitorFrame, monitorDisplay);

        } else if (obj.id === 'chair') {
          // Silla de oficina ergonómica con respaldo curvo, asiento acolchado y base estrella de ruedas
          const fabricMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.55, metalness: 0.15 });
          const chromeChairMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.92, roughness: 0.18 });
          const darkFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.65, metalness: 0.2 });

          // Asiento acolchado biselado
          const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.46), fabricMat);
          seat.position.set(0, 0.46, 0);
          seat.castShadow = true;
          group.add(seat);

          // Respaldo curvo ergonómico (cilindro hueco con arco suave)
          const backGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.44, 18, 1, true, -Math.PI * 0.35, Math.PI * 0.7);
          const backMesh = new THREE.Mesh(backGeo, new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.55, metalness: 0.15, side: THREE.DoubleSide }));
          backMesh.position.set(0, 0.72, -0.05);
          backMesh.castShadow = true;
          group.add(backMesh);

          // Soporte estructural del respaldo
          const spine = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.38, 0.04), darkFrameMat);
          spine.position.set(0, 0.65, -0.22);
          group.add(spine);

          // Reposabrazos curvados a ambos lados
          [-0.26, 0.26].forEach(ax => {
            const armPost = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.20), darkFrameMat);
            armPost.position.set(ax, 0.55, 0);
            const armRest = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.025, 0.24), darkFrameMat);
            armRest.position.set(ax, 0.65, 0);
            group.add(armPost, armRest);
          });

          // Columna neumática central
          const column = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.24, 12), chromeChairMat);
          column.position.set(0, 0.26, 0);
          column.castShadow = true;
          group.add(column);

          // Base estrella de 5 radios con ruedas a ras de suelo (y = 0)
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.035), chromeChairMat);
            arm.position.set(Math.cos(angle) * 0.12, 0.07, Math.sin(angle) * 0.12);
            arm.rotation.y = -angle;
            arm.castShadow = true;

            // Rueda giratoria
            const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), darkFrameMat);
            wheel.position.set(Math.cos(angle) * 0.24, 0.035, Math.sin(angle) * 0.24);
            wheel.castShadow = true;
            group.add(arm, wheel);
          }

        } else if (obj.id === 'blackboard') {
          // Pizarra escolar con textura procedural de apuntes legibles, marco de madera y bandeja para tizas
          const boardFrameMat = new THREE.MeshStandardMaterial({ color: 0x5c2b09, roughness: 0.48, metalness: 0.1 });
          const boardTex = createBlackboardTexture();
          const slateMat = new THREE.MeshStandardMaterial({
            map: boardTex,
            roughness: 0.65,
            metalness: 0.05
          });

          // Marco biselado exterior
          const frame = new THREE.Mesh(new THREE.BoxGeometry(2.44, 1.44, 0.06), boardFrameMat);
          frame.castShadow = true;

          // Superficie frontal de la pizarra con apuntes legibles
          const slate = new THREE.Mesh(new THREE.PlaneGeometry(2.32, 1.32), slateMat);
          slate.position.set(0, 0, 0.032);

          // Bandeja inferior porta-tizas y borrador
          const chalkTray = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.03, 0.12), boardFrameMat);
          chalkTray.position.set(0, -0.72, 0.06);
          chalkTray.castShadow = true;

          // Borrador de madera y fieltro
          const eraserMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
          const eraser = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.035, 0.06), eraserMat);
          eraser.position.set(-0.35, -0.69, 0.06);

          // Tizas de colores individuales en la bandeja
          const chalkColors = [0xfef08a, 0xffffff, 0x38bdf8];
          chalkColors.forEach((color, idx) => {
            const chalk = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.07, 8), new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
            chalk.rotation.z = Math.PI / 2;
            chalk.position.set(0.15 + idx * 0.10, -0.70, 0.06);
            group.add(chalk);
          });

          group.add(frame, slate, chalkTray, eraser);

        } else if (obj.id === 'lamp') {
          // Lámpara de escritorio articulada de latón con foco cálido y punto de luz tenue
          const brassLampMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.82 });
          const darkLampMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.85 });

          // Base circular biselada con peso
          const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.024, 24), brassLampMat);
          lampBase.position.y = 0.012;
          lampBase.castShadow = true;
          group.add(lampBase);

          // Brazo articulado inferior
          const armLower = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.34, 12), brassLampMat);
          armLower.position.set(0.04, 0.16, 0);
          armLower.rotation.z = -0.35;
          armLower.castShadow = true;

          // Codo articulado central
          const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.020, 12, 12), darkLampMat);
          elbow.position.set(0.10, 0.30, 0);

          // Brazo articulado superior
          const armUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.28, 12), brassLampMat);
          armUpper.position.set(0.02, 0.42, 0);
          armUpper.rotation.z = 0.45;
          armUpper.castShadow = true;

          // Campana cónica difusora
          const shade = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.14, 18, 1, true), brassLampMat);
          shade.position.set(-0.08, 0.48, 0);
          shade.rotation.z = -Math.PI * 0.40;
          shade.castShadow = true;

          // Bombilla emisiva
          const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), new THREE.MeshStandardMaterial({
            color: 0xffedd5,
            emissive: 0xfef08a,
            emissiveIntensity: 1.4
          }));
          bulb.position.set(-0.08, 0.46, 0);

          // Punto de luz tenue cálida en el escritorio
          const deskPointLight = new THREE.PointLight(0xfef08a, 1.25, 4.8);
          deskPointLight.position.set(-0.08, 0.45, 0);
          deskPointLight.castShadow = true;
          deskPointLight.shadow.bias = -0.001;

          group.add(armLower, elbow, armUpper, shade, bulb, deskPointLight);

        } else if (obj.id === 'wall_painting') {
          // Cuadro decorativo enmarcado con arte abstracto
          const pFrameMat = new THREE.MeshStandardMaterial({ color: 0x3b1d0e, roughness: 0.45, metalness: 0.1 });
          const pFrame = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.88, 0.04), pFrameMat);
          pFrame.castShadow = true;
          const pCanvasTex = createPaintingTexture();
          const pCanvasMat = new THREE.MeshStandardMaterial({
            map: pCanvasTex,
            roughness: 0.4
          });
          const pCanvas = new THREE.Mesh(new THREE.PlaneGeometry(1.18, 0.78), pCanvasMat);
          pCanvas.position.set(0, 0, 0.022);
          group.add(pFrame, pCanvas);

        } else if (obj.id === 'wall_clock') {
          // Reloj de pared circular con manecillas
          const clockBodyMat = new THREE.MeshStandardMaterial({ color: 0x3b1d0e, roughness: 0.45, metalness: 0.1 });
          const clockBody = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 24), clockBodyMat);
          clockBody.rotation.x = Math.PI / 2;
          const clockTex = createClockFaceTexture();
          const clockFaceMat = new THREE.MeshStandardMaterial({
            map: clockTex,
            roughness: 0.2
          });
          const clockFace = new THREE.Mesh(new THREE.CircleGeometry(0.24, 24), clockFaceMat);
          clockFace.position.set(0, 0, 0.022);
          group.add(clockBody, clockFace);

        } else {
          // Objeto decorativo de alta fidelidad: pedestal biselado y jarrón de cerámica esmaltada
          const pedMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.2 });
          const vaseMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.18, metalness: 0.1 });
          const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.65, 16), pedMat);
          ped.position.y = 0.325;
          ped.castShadow = true;
          const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.08, 0.42, 16), vaseMat);
          vase.position.y = 0.86;
          vase.castShadow = true;
          group.add(ped, vase);
        }
      } else {
        // SCENARIO: BACKYARD & GARDEN
        if (obj.id === 'bbq_grill') {
          // Asador esférico metálico tipo kettle con tapa, patas y ruedas a ras de suelo (y = 0)
          const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.32, metalness: 0.88 });
          const legMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.92, roughness: 0.2 });
          const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });

          // Cuenco esférico inferior
          const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), blackMat);
          bowl.position.y = 0.89;
          bowl.castShadow = true;

          // Tapa esférica con asa superior
          const lid = new THREE.Mesh(new THREE.SphereGeometry(0.50, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2), blackMat);
          lid.position.y = 0.94;
          const handle = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.018, 8, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 }));
          handle.position.y = 1.45;
          handle.rotation.x = Math.PI / 2;

          // Parrilla interna de cocción
          const grate = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.01, 24), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.2 }));
          grate.position.y = 0.90;

          // 3 Patas de soporte tubular conectando al cuenco
          for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.88, 12), legMat);
            leg.position.set(Math.cos(angle) * 0.29, 0.45, Math.sin(angle) * 0.29);
            leg.rotation.z = Math.cos(angle) * 0.16;
            leg.rotation.x = Math.sin(angle) * 0.16;
            group.add(leg);
          }

          // 2 Ruedas de goma en la base tocando el suelo (y = 0)
          const w1 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16), wheelMat);
          w1.rotation.z = Math.PI / 2;
          w1.position.set(-0.36, 0.09, 0.23);
          const w2 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16), wheelMat);
          w2.rotation.z = Math.PI / 2;
          w2.position.set(-0.36, 0.09, -0.23);

          // Pata delantera con regatón de goma tocando el piso en y = 0
          const frontFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.06, 12), wheelMat);
          frontFoot.position.set(0.36, 0.03, 0);

          group.add(bowl, lid, handle, grate, w1, w2, frontFoot);

        } else if (obj.id === 'patio_table') {
          // Mesa de terraza con sombrilla octagonal de lona roja y mástil central
          const tableMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.42 });
          const table = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.98, 0.06, 24), tableMat);
          table.position.y = 0.74;
          table.castShadow = true;

          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.85, 12), new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.75 }));
          pole.position.y = 1.42;

          // Sombrilla octagonal de lona roja
          const umbrellaMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.65 });
          const umbrella = new THREE.Mesh(new THREE.ConeGeometry(1.65, 0.75, 8), umbrellaMat);
          umbrella.position.y = 2.48;
          umbrella.castShadow = true;

          const finial = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
          finial.position.y = 2.88;

          const baseWeight = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 }));
          baseWeight.position.y = 0.04;

          // 4 Sillas de terraza alrededor de la mesa
          for (let i = 0; i < 4; i++) {
            const ang = (i * Math.PI) / 2;
            const chair = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.44), tableMat);
            chair.position.set(Math.cos(ang) * 1.35, 0.22, Math.sin(ang) * 1.35);
            group.add(chair);
          }

          group.add(table, pole, umbrella, finial, baseWeight);

        } else if (obj.id === 'lawn_mower') {
          // Cortacésped con chasis rojo, motor y manubrio ergonómico inclinado
          const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35, metalness: 0.45 });
          const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.24, 0.58), redMat);
          chassis.position.y = 0.20;
          chassis.castShadow = true;

          const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.24, 16), new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.85 }));
          motor.position.set(-0.05, 0.39, 0);

          // 4 Ruedas todoterreno tocando el suelo (y = 0)
          const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 });
          const wheelPos = [[-0.36, -0.28], [0.36, -0.28], [-0.36, 0.28], [0.36, 0.28]];
          wheelPos.forEach(([wx, wz]) => {
            const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 16), wheelMat);
            wh.rotation.x = Math.PI / 2;
            wh.position.set(wx, 0.11, wz);
            group.add(wh);
          });

          // Manubrio ergonómico inclinado hacia atrás con barra transversal (hCross)
          const handleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
          const hArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.12), handleMat);
          hArm1.rotation.z = -Math.PI / 3.8;
          hArm1.position.set(0.50, 0.66, -0.22);
          const hArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.12), handleMat);
          hArm2.rotation.z = -Math.PI / 3.8;
          hArm2.position.set(0.50, 0.66, 0.22);
          const hCross = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.48), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
          hCross.position.set(0.90, 1.06, 0);
          hCross.rotation.x = Math.PI / 2;

          group.add(chassis, motor, hArm1, hArm2, hCross);

        } else if (obj.id === 'wheelbarrow') {
          // Carretilla de carga metálica con tolva, rueda delantera y soportes a ras de suelo (y = 0)
          const tubMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.38, metalness: 0.55 });
          const tub = new THREE.Mesh(new THREE.CylinderGeometry(0.50, 0.34, 0.40, 4), tubMat);
          tub.rotation.y = Math.PI / 4;
          tub.position.set(0, 0.46, 0);
          tub.castShadow = true;

          // Rueda de goma delantera tocando el suelo (y = 0)
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 }));
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(-0.58, 0.18, 0);

          // Bastidor y 2 patas de soporte traseras apoyadas en y = 0
          const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85 });
          const f1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.45), frameMat);
          f1.rotation.z = Math.PI / 6;
          f1.position.set(0.22, 0.42, -0.26);
          const f2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.45), frameMat);
          f2.rotation.z = Math.PI / 6;
          f2.position.set(0.22, 0.42, 0.26);

          const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.24), frameMat);
          leg1.position.set(0.18, 0.12, -0.24);
          const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.24), frameMat);
          leg2.position.set(0.18, 0.12, 0.24);

          group.add(tub, wheel, f1, f2, leg1, leg2);

        } else if (obj.id === 'watering_can') {
          // Regadera metálica con caño, roseta perforada y asa descansando en y = 0
          const canMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.3 });
          const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.38, 16), canMat);
          body.position.y = 0.19;
          body.castShadow = true;

          const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.45, 12), canMat);
          spout.rotation.z = -Math.PI / 3.5;
          spout.position.set(0.25, 0.32, 0);

          const rosette = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
          rosette.position.set(0.44, 0.48, 0);

          const archHandle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.018, 8, 16, Math.PI), canMat);
          archHandle.position.set(0, 0.42, 0);

          group.add(body, spout, rosette, archHandle);

        } else if (obj.id === 'flower_pot') {
          // Maceta de terracota con follaje floral a ras de suelo (y = 0)
          const potMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.72 });
          const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.24, 0.50, 18), potMat);
          pot.position.y = 0.25;
          pot.castShadow = true;
          const rim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 8, 20), potMat);
          rim.position.y = 0.49;
          rim.rotation.x = Math.PI / 2;

          const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.02, 16), new THREE.MeshStandardMaterial({ color: 0x27170a, roughness: 0.95 }));
          soil.position.y = 0.47;

          const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.36), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.78 }));
          bush.position.y = 0.62;

          // Flores de colores variados
          const fl1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
          fl1.position.set(0.16, 0.80, 0.12);
          const fl2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfbbf24 }));
          fl2.position.set(-0.16, 0.76, -0.12);
          const fl3 = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), new THREE.MeshStandardMaterial({ color: 0xa855f7 }));
          fl3.position.set(0.04, 0.85, -0.14);

          group.add(pot, rim, soil, bush, fl1, fl2, fl3);

        } else if (obj.id === 'sprinkler') {
          // Aspersor de riego rotatorio con giro continuo apoyado en y = 0
          const baseMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 });
          const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.08, 16), baseMat);
          base.position.y = 0.04;

          const sprinklerHead = new THREE.Group();
          const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.18), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
          stem.position.y = 0.13;
          sprinklerHead.add(stem);

          for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.24), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
            arm.position.set(Math.cos(angle) * 0.12, 0.22, Math.sin(angle) * 0.12);
            arm.rotation.y = angle;
            arm.rotation.z = Math.PI / 4;
            sprinklerHead.add(arm);
          }

          group.add(base, sprinklerHead);
          threeAnimatedObjects.sprinkler = sprinklerHead;

        } else if (obj.id === 'stone_patio') {
          // Terraza exterior de losetas de piedra con juntas y biseles (y = 0)
          const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.68, metalness: 0.05 });
          const terrace = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.08, 7.5), stoneMat);
          terrace.position.y = 0.04;
          terrace.receiveShadow = true;
          // Losetas decorativas en relieve
          const tileMat = new THREE.MeshStandardMaterial({ color: 0x718096, roughness: 0.65 });
          for (let tx = -3.8; tx <= 3.8; tx += 1.9) {
            for (let tz = -2.8; tz <= 2.8; tz += 1.9) {
              const tile = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.01, 1.82), tileMat);
              tile.position.set(tx, 0.085, tz);
              group.add(tile);
            }
          }
          group.add(terrace);

        } else if (obj.id === 'shade_tree') {
          // Árbol frondoso con tronco orgánico y follaje volumétrico a ras de suelo (y = 0)
          const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e2312, roughness: 0.85 });
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.52, 3.4, 12), trunkMat);
          trunk.position.y = 1.7;
          trunk.castShadow = true;
          group.add(trunk);

          // Ramas principales
          const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 1.6, 8), trunkMat);
          b1.rotation.z = Math.PI / 4.5;
          b1.position.set(0.48, 2.8, 0);
          const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 1.6, 8), trunkMat);
          b2.rotation.z = -Math.PI / 4.5;
          b2.position.set(-0.48, 2.7, 0.2);
          group.add(b1, b2);

          // Follaje orgánico multicapa
          const leafColors = [0x14532d, 0x166534, 0x15803d, 0x1b4332];
          const foliagePos = [
            [0, 3.8, 0, 1.55, 0],
            [0.85, 3.4, 0.4, 1.15, 1],
            [-0.85, 3.3, -0.3, 1.15, 2],
            [0.2, 4.3, -0.4, 1.25, 0],
            [-0.3, 4.2, 0.5, 1.20, 3]
          ];
          foliagePos.forEach(([fx, fy, fz, fr, cIdx]) => {
            const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(fr), new THREE.MeshStandardMaterial({ color: leafColors[cIdx], roughness: 0.8 }));
            leaves.position.set(fx, fy, fz);
            leaves.castShadow = true;
            group.add(leaves);
          });

        } else if (obj.id === 'wooden_fence') {
          const fenceSection = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.1, 0.08), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 }));
          fenceSection.position.y = 0.55;
          group.add(fenceSection);

        } else if (obj.id === 'garden_bench') {
          const benchWood = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });
          const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.55), benchWood);
          seat.position.y = 0.45;
          const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.06), benchWood);
          back.position.set(0, 0.8, -0.24);

          const ironMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.85 });
          const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.55), ironMat);
          l1.position.set(-0.85, 0.22, 0);
          const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.55), ironMat);
          l2.position.set(0.85, 0.22, 0);

          group.add(seat, back, l1, l2);

        } else if (obj.id === 'garden_hose') {
          const hoseMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });
          const coil = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.06, 12, 24), hoseMat);
          coil.rotation.x = Math.PI / 2;
          coil.position.y = 0.06;
          const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.18), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
          nozzle.position.set(0.38, 0.1, 0);
          nozzle.rotation.z = Math.PI / 4;
          group.add(coil, nozzle);

        } else if (obj.id === 'shovel') {
          const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.1), new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 }));
          handle.rotation.z = 0.2;
          handle.position.set(0, 0.55, 0);

          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.02), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 }));
          blade.rotation.z = 0.2;
          blade.position.set(-0.11, 0.12, 0);

          group.add(handle, blade);

        } else if (obj.id === 'sun') {
          const sunSphere = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
          group.add(sunSphere);
        } else if (obj.id === 'lamp_post') {
          // Poste de luz exterior victoriano de hierro fundido con farol hexagonal y luz cálida
          const ironPostMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.85 });
          const brassTrimMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.8 });

          // Base octagonal con molduras biseladas a ras de suelo (y = 0)
          const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.38, 8), ironPostMat);
          plinth.position.y = 0.19;
          plinth.castShadow = true;

          // Columna cilíndrica estriada
          const column = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.12, 2.7, 12), ironPostMat);
          column.position.y = 1.65;
          column.castShadow = true;

          // Anillos decorativos de latón en la columna
          const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 8, 16), brassTrimMat);
          ring1.position.y = 0.42;
          ring1.rotation.x = Math.PI / 2;
          const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.018, 8, 16), brassTrimMat);
          ring2.position.y = 2.85;
          ring2.rotation.x = Math.PI / 2;

          // Ménsula / soporte del farol
          const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.18), ironPostMat);
          bracket.position.y = 3.02;

          // Farol victoriano de 6 caras
          const lanternCap = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.22, 6), ironPostMat);
          lanternCap.position.y = 3.45;
          lanternCap.castShadow = true;

          const glassCage = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.14, 0.34, 6, 1, true), new THREE.MeshStandardMaterial({
            color: 0xfffbeb,
            roughness: 0.12,
            metalness: 0.1,
            transparent: true,
            opacity: 0.65
          }));
          glassCage.position.y = 3.20;

          // Filamento incandescente brillante
          const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), new THREE.MeshStandardMaterial({
            color: 0xffedd5,
            emissive: 0xfef08a,
            emissiveIntensity: 2.2
          }));
          bulb.position.y = 3.20;

          // Luz puntual suave exterior
          const streetLight = new THREE.PointLight(0xffedd5, 1.8, 11.5);
          streetLight.position.y = 3.20;
          streetLight.castShadow = true;
          streetLight.shadow.bias = -0.001;

          // Haz de luz puntual (SpotLight) focalizado hacia el suelo y el camino
          const spotLight = new THREE.SpotLight(0xffedd5, 2.8, 12.0, Math.PI / 3.5, 0.5, 1.2);
          spotLight.position.set(0, 3.20, 0);
          spotLight.target.position.set(0, 0, 0);
          spotLight.castShadow = true;

          group.add(plinth, column, ring1, ring2, bracket, lanternCap, glassCage, bulb, streetLight, spotLight, spotLight.target);

        } else if (obj.id === 'flower_bush') {
          // Arbusto floral con flores de colores vivos
          const bushMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });
          const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.72), bushMat);
          bush.position.y = 0.55;
          bush.scale.set(1.2, 0.85, 1.1);
          bush.castShadow = true;
          group.add(bush);

          const flowerMats = [
            new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45 }),
            new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.45 }),
            new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.45 }),
            new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.45 })
          ];
          for (let f = 0; f < 18; f++) {
            const fMat = flowerMats[f % flowerMats.length];
            const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), fMat);
            const theta = (f * 1.35) % (Math.PI * 2);
            const phi = 0.2 + (f * 0.15) % (Math.PI * 0.4);
            blossom.position.set(
              Math.sin(phi) * Math.cos(theta) * 0.74,
              0.55 + Math.cos(phi) * 0.45,
              Math.sin(phi) * Math.sin(theta) * 0.74
            );
            group.add(blossom);
          }

        } else if (obj.id === 'grass_patch') {
          // Parches de pasto procedural tridimensional
          const bladeMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.75 });
          for (let g = 0; g < 14; g++) {
            const blade = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.28, 4), bladeMat);
            blade.position.set(((g % 5) - 2) * 0.12, 0.14, (Math.floor(g / 5) - 1) * 0.15);
            blade.rotation.x = ((g % 3) - 1) * 0.15;
            blade.rotation.z = ((g % 4) - 1.5) * 0.12;
            group.add(blade);
          }

        } else if (obj.id === 'stone_path') {
          // Camino de baldosas de piedra desiguales
          const paverMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75, metalness: 0.05 });
          [[-0.4, 0], [0.3, 0.6], [-0.2, 1.3], [0.4, 2.0], [0.0, 2.7]].forEach(([px, pz], idx) => {
            const paver = new THREE.Mesh(new THREE.CylinderGeometry(0.28 + (idx % 2) * 0.06, 0.32, 0.04, 7), paverMat);
            paver.position.set(px, 0.02, pz);
            paver.rotation.y = idx * 0.8;
            paver.receiveShadow = true;
            group.add(paver);
          });

        } else {
          // Escultura ornamental de piedra: pedestal torneado y cuenco fuente de baño de aves (birdbath)
          const stoneMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.65, metalness: 0.1 });
          const waterMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.8 });
          const column = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 0.72, 16), stoneMat);
          column.position.y = 0.36;
          column.castShadow = true;
          const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.18, 0.16, 20), stoneMat);
          basin.position.y = 0.78;
          basin.castShadow = true;
          const water = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.02, 20), waterMat);
          water.position.y = 0.84;
          group.add(column, basin, water);
        }
      }

      const safePos = safeGetPosition(obj.pos);
      group.position.set(safePos.x, safePos.y, safePos.z);
      return group;
    }

    const buildDetailedObjectMesh = buildCompound3DObject;

    // ========================================================
    // SISTEMA DE CONTROLES (PC WASD/RATÓN Y MÓVIL JOYSTICK/SWIPE)
    // ========================================================
    function setupFirstPersonControls(canvas) {
      if (!canvas) return;

      window.addEventListener('keydown', (e) => {
        if (currentActiveView !== 'view-worldtour') return;
        const k = e.key.toLowerCase();
        if (k === 'w' || e.code === 'KeyW' || e.key === 'ArrowUp') moveForward = true;
        if (k === 's' || e.code === 'KeyS' || e.key === 'ArrowDown') moveBackward = true;
        if (k === 'a' || e.code === 'KeyA' || e.key === 'ArrowLeft') moveLeft = true;
        if (k === 'd' || e.code === 'KeyD' || e.key === 'ArrowRight') moveRight = true;
      });

      window.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        if (k === 'w' || e.code === 'KeyW' || e.key === 'ArrowUp') moveForward = false;
        if (k === 's' || e.code === 'KeyS' || e.key === 'ArrowDown') moveBackward = false;
        if (k === 'a' || e.code === 'KeyA' || e.key === 'ArrowLeft') moveLeft = false;
        if (k === 'd' || e.code === 'KeyD' || e.key === 'ArrowRight') moveRight = false;
      });

      // Arrastre con ratón en PC
      canvas.addEventListener('mousedown', (e) => {
        isDraggingMouse = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        mouseDownPos = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDraggingMouse || currentActiveView !== 'view-worldtour') return;
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        cameraYaw += deltaX * 0.0038;
        cameraPitch = Math.max(-1.0, Math.min(1.0, cameraPitch - deltaY * 0.0038));
        previousMousePosition = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mouseup', (e) => {
        if (isDraggingMouse) {
          isDraggingMouse = false;
          const dist = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
          if (dist < 8) {
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
            const deltaX = t.clientX - prevTouch.x;
            const deltaY = t.clientY - prevTouch.y;
            cameraYaw += deltaX * 0.0045;
            cameraPitch = Math.max(-1.0, Math.min(1.0, cameraPitch - deltaY * 0.0045));
            prevTouch = { x: t.clientX, y: t.clientY };
          }
        }
      }, { passive: true });

      canvas.addEventListener('touchend', (e) => {
        for (let t of e.changedTouches) {
          if (t.identifier === touchLookId) {
            touchLookId = null;
          }
        }
      });
    }

    function setupVirtualJoystick() {
      const container = document.getElementById('virtualJoystickContainer');
      const knob = document.getElementById('virtualJoystickKnob');
      if (!container || !knob) return;

      let active = false;
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
        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        joystickMove.x = dx / radius;
        joystickMove.y = dy / radius;
      }

      container.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        active = true;
        updateKnob(e.clientX, e.clientY);
      });
      window.addEventListener('mousemove', (e) => {
        if (active) updateKnob(e.clientX, e.clientY);
      });
      window.addEventListener('mouseup', () => {
        if (active) {
          active = false;
          knob.style.transform = 'translate(0px, 0px)';
          joystickMove.x = 0;
          joystickMove.y = 0;
        }
      });

      container.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        active = true;
        if (e.changedTouches.length > 0) {
          updateKnob(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      }, { passive: false });

      window.addEventListener('touchmove', (e) => {
        if (active && e.changedTouches.length > 0) {
          updateKnob(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      }, { passive: false });

      window.addEventListener('touchend', () => {
        if (active) {
          active = false;
          knob.style.transform = 'translate(0px, 0px)';
          joystickMove.x = 0;
          joystickMove.y = 0;
        }
      });
    }

    // Movimiento fluido normalizado en primera persona con límites de colisión
    function updatePlayerMovement(delta = 0.016) {
      if (currentActiveView !== 'view-worldtour') return;

      const moveSpeed = 4.2 * delta;
      const forwardX = Math.cos(cameraYaw);
      const forwardZ = Math.sin(cameraYaw);
      const rightX = -Math.sin(cameraYaw);
      const rightZ = Math.cos(cameraYaw);

      let dirX = 0;
      let dirZ = 0;

      if (moveForward) { dirX += forwardX; dirZ += forwardZ; }
      if (moveBackward) { dirX -= forwardX; dirZ -= forwardZ; }
      if (moveLeft) { dirX -= rightX; dirZ -= rightZ; }
      if (moveRight) { dirX += rightX; dirZ += rightZ; }

      if (joystickMove.x !== 0 || joystickMove.y !== 0) {
        dirX += forwardX * (-joystickMove.y) + rightX * joystickMove.x;
        dirZ += forwardZ * (-joystickMove.y) + rightZ * joystickMove.x;
      }

      const length = Math.hypot(dirX, dirZ);
      if (length > 0.001) {
        dirX /= length;
        dirZ /= length;

        let nextX = Math.max(ROOM_LIMITS.minX, Math.min(ROOM_LIMITS.maxX, threeCamera.position.x + dirX * moveSpeed));
        let nextZ = Math.max(ROOM_LIMITS.minZ, Math.min(ROOM_LIMITS.maxZ, threeCamera.position.z + dirZ * moveSpeed));

        // Detección de colisiones con los muros divisorios de las 4 habitaciones (House & Rooms)
        // Permite transitar libremente a través de los vanos de paso arquitectónicos
        if (currentScenarioKey === 'house') {
          const currX = threeCamera.position.x;
          const currZ = threeCamera.position.z;
          const wallMargin = 0.38;

          // Muro divisorio en Z = 0 (Divide Norte: Living/Bedroom y Sur: Kitchen/Bathroom)
          // Vanos de paso abiertos en X: [-4.6, -2.4] (Living-Kitchen) y [2.4, 4.6] (Bedroom-Bathroom)
          const inDoorwayZ = (nextX > -4.5 && nextX < -2.5) || (nextX > 2.5 && nextX < 4.5);
          if (!inDoorwayZ) {
            if (currZ <= -wallMargin && nextZ > -wallMargin) nextZ = -wallMargin;
            else if (currZ >= wallMargin && nextZ < wallMargin) nextZ = wallMargin;
          }

          // Muro divisorio en X = 0 (Divide Oeste: Living/Kitchen y Este: Bedroom/Bathroom)
          // Vanos de paso abiertos en Z: [-4.6, -2.4] (Living-Bedroom) y [2.4, 4.6] (Kitchen-Bathroom)
          const inDoorwayX = (nextZ > -4.5 && nextZ < -2.5) || (nextZ > 2.5 && nextZ < 4.5);
          if (!inDoorwayX) {
            if (currX <= -wallMargin && nextX > -wallMargin) nextX = -wallMargin;
            else if (currX >= wallMargin && nextX < wallMargin) nextX = wallMargin;
          }
        }

        threeCamera.position.x = nextX;
        threeCamera.position.z = nextZ;
      }

      threeCamera.position.y = ROOM_LIMITS.eyeHeight;

      const targetX = threeCamera.position.x + Math.cos(cameraPitch) * Math.cos(cameraYaw);
      const targetY = threeCamera.position.y + Math.sin(cameraPitch);
      const targetZ = threeCamera.position.z + Math.cos(cameraPitch) * Math.sin(cameraYaw);
      threeCamera.lookAt(targetX, targetY, targetZ);
    }

    // Realce con destello de luz suave neón al interactuar
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
          child.material.emissive.setHex(0xa855f7);
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
          speakText(target.userData.en);
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
      if (catEl) catEl.textContent = objData.category || 'Objeto 3D';
      if (exEl) exEl.textContent = objData.example || `I can see the ${objData.en.toLowerCase()} clearly.`;

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

    // Aliases para compatibilidad
    window.switch3DScenario = switch3DScenario;
    window.inspect3DObject = inspect3DObject;
    window.highlightObject = highlightObject;
    window.close3DInspectCard = close3DInspectCard;
    window.speakCurrent3DObj = speakCurrent3DObj;

    function startPortalStars() {
      stopPortalStars();
      const canvas = document.getElementById('portalStarsCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || window.innerHeight;

      const stars = Array.from({ length: 65 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005
      }));

      function renderStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
          s.alpha += s.speed;
          if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.alpha)})`;
          ctx.fill();
        });
        starsCanvasAnimId = requestAnimationFrame(renderStars);
      }
      renderStars();
    }

    function stopPortalStars() {
      if (starsCanvasAnimId) {
        cancelAnimationFrame(starsCanvasAnimId);
        starsCanvasAnimId = null;
      }
    }

    let toastTimeout = null;
    function showFloatingToast(msg, icon = '✨') {
      const toast = document.getElementById('floatingToast');
      const txt = document.getElementById('floatingToastText');
      const icn = document.getElementById('floatingToastIcon');
      if (!toast || !txt) return;

      txt.textContent = msg;
      if (icn) icn.textContent = icon;

      toast.classList.remove('translate-y-[-100px]', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[-100px]', 'opacity-0');
      }, 3000);
    }

    window.BackendSync = {
      apiBaseUrl: (typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http'))
        ? `${window.location.origin}/api`
        : 'http://localhost:3000/api',
      queue: [],
      async queueProgressSync(payload) {
        const user = getStoredUser();
        if (!user || user.role === 'guest') return;
        payload.username = user.username;
        this.queue.push(payload);
        this.flush();
      },
      async flush() {
        if (this.queue.length === 0) return;
        const item = this.queue.shift();
        try {
          await fetch('http://localhost:3000/api/progress/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        } catch (e) { }
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      setupDraggableWidget('draggableRobotWidget', 'saved_robot_pos');
      setupDraggableWidget('draggableRouletteWidget', 'saved_roulette_pos');
      updateCoverFlowVisuals();
      setupCoverFlowGestures();
      initGoogleIdentityServices();

      renderMusicTracksList();
      selectMusicTrack(0);
      renderStorySelector();
      renderLearningModules();

      // Asegurar que inputs de login estén activos, editables y sin bloqueos
      const idInput = document.getElementById('authLoginIdentifier');
      const pwInput = document.getElementById('authLoginPassword');
      if (idInput) {
        idInput.removeAttribute('readonly');
        idInput.removeAttribute('disabled');
        idInput.style.pointerEvents = 'auto';
      }
      if (pwInput) {
        pwInput.removeAttribute('readonly');
        pwInput.removeAttribute('disabled');
        pwInput.style.pointerEvents = 'auto';
      }

      // Interceptar evento submit de formularios para prevenir submit nativo ('/?')
      const loginFormEl = document.getElementById('authLoginForm');
      if (loginFormEl) {
        loginFormEl.addEventListener('submit', (evt) => {
          if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();
          handleAuthLoginSubmit(evt);
          return false;
        });
      }

      const regFormEl = document.getElementById('authRegisterForm');
      if (regFormEl) {
        regFormEl.addEventListener('submit', (evt) => {
          if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();
          handleAuthRegisterSubmit(evt);
          return false;
        });
      }

      syncSettingsUiFromStorage();
      const stored = getStoredUser();
      if (stored && stored.username) {
        updateUserExpDisplay();
        goToHomePortals();
      } else {
        showView('view-auth');
        updateFloatingWidgetsVisibility();
      }
    });
  

  // Exportar funciones globales para interoperabilidad
  
    // Funciones globales expuestas en window para acceso directo e infalible
    window.continueAsGuest = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      console.log("Accediendo como Invitado...");
      try {
        localStorage.setItem('mastereng_user', JSON.stringify({ username: 'Invitado', role: 'guest' }));
        localStorage.setItem('user_role', 'guest');
        localStorage.setItem('guest_user', JSON.stringify({ username: 'Invitado', role: 'guest' }));
        localStorage.setItem('english_app_user_session', JSON.stringify({ username: 'Invitado', role: 'guest', exp: 0, rank: 'Bronce' }));
      } catch (err) { }

      const loginModal = document.getElementById('login-modal') || document.querySelector('.login-container');
      if (loginModal) {
        loginModal.style.display = 'none';
        loginModal.style.pointerEvents = 'none';
        loginModal.style.visibility = 'hidden';
      }
      const viewAuthEl = document.getElementById('view-auth');
      if (viewAuthEl) {
        viewAuthEl.style.display = 'none';
        viewAuthEl.style.pointerEvents = 'none';
        viewAuthEl.style.visibility = 'hidden';
        viewAuthEl.style.zIndex = '-1';
        viewAuthEl.classList.add('hidden');
      }
      document.querySelectorAll('.modal-backdrop, .modal-overlay').forEach(el => {
        el.style.display = 'none';
        el.style.pointerEvents = 'none';
        el.style.visibility = 'hidden';
      });

      const mainApp = document.getElementById('app-main') || document.getElementById('main-content') || document.getElementById('view-home');
      if (mainApp) {
        mainApp.style.display = 'flex';
        mainApp.classList.remove('hidden');
      }

      const floatingWidgets = document.querySelectorAll('.floating-widget, .robot-mascot, .roulette-btn, #ai-tutor, #roulette-container, #tutorRouletteDock, #draggableRobotWidget, #draggableRouletteWidget');
      floatingWidgets.forEach(el => {
        el.style.display = 'flex';
        el.classList.remove('hidden');
      });

      if (typeof updateUserExpDisplay === 'function') updateUserExpDisplay();
      if (typeof updateCoverFlowVisuals === 'function') updateCoverFlowVisuals();
      if (typeof showFloatingToast === 'function') showFloatingToast('Accediendo como Invitado', '⚡');
      if (typeof goToHomePortals === 'function') goToHomePortals();
      return false;
    };

    window.handleAdminLogin = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      const userInput = (
        document.getElementById('authLoginIdentifier')?.value ||
        document.querySelector('input[type="text"], input[name="username"], #username')?.value ||
        ''
      ).trim();

      const passInput = (
        document.getElementById('authLoginPassword')?.value ||
        document.querySelector('input[type="password"], input[name="password"], #password')?.value ||
        ''
      ).trim();

      if ((userInput.toLowerCase() === 'admin' || userInput.toLowerCase() === 'admin@antigravity.com') && passInput === 'Admin2026!Master') {
        const adminData = { username: 'admin', role: 'admin', exp: 1250, rank: 'Diamante', token: 'MasterENG-Admin-OfflineMasterToken-2026' };
        try {
          localStorage.setItem('mastereng_user', JSON.stringify({ username: 'admin', role: 'admin', exp: 1250, rank: 'Diamante' }));
          localStorage.setItem('user_role', 'admin');
          localStorage.setItem('english_app_user_session', JSON.stringify(adminData));
        } catch (err) { };
        try {
          localStorage.setItem('mastereng_user', JSON.stringify({ username: 'admin', role: 'admin' }));
          localStorage.setItem('user_role', 'admin');
          localStorage.setItem('english_app_user_session', JSON.stringify(adminData));
        } catch (err) { }

        showFloatingToast('¡Acceso concedido como Administrador!', '🛡️');

        const loginModal = document.getElementById('login-modal') || document.querySelector('.login-container');
        if (loginModal) {
          loginModal.style.display = 'none';
          loginModal.style.pointerEvents = 'none';
          loginModal.style.visibility = 'hidden';
        }
        const viewAuthEl = document.getElementById('view-auth');
        if (viewAuthEl) {
          viewAuthEl.style.display = 'none';
          viewAuthEl.style.pointerEvents = 'none';
          viewAuthEl.style.visibility = 'hidden';
          viewAuthEl.style.zIndex = '-1';
          viewAuthEl.classList.add('hidden');
        }
        document.querySelectorAll('.modal-backdrop, .modal-overlay').forEach(el => {
          el.style.display = 'none';
          el.style.pointerEvents = 'none';
          el.style.visibility = 'hidden';
        });

        const mainApp = document.getElementById('app-main') || document.getElementById('main-content') || document.getElementById('view-home');
        if (mainApp) {
          mainApp.style.display = 'flex';
          mainApp.classList.remove('hidden');
        }

        const adminBtn = document.getElementById('admin-panel-btn') || document.getElementById('headerAdminBtn');
        if (adminBtn) {
          adminBtn.style.display = 'inline-flex';
          adminBtn.classList.remove('hidden');
        }

        const floatingWidgets = document.querySelectorAll('.floating-widget, .robot-mascot, .roulette-btn, #ai-tutor, #roulette-container, #tutorRouletteDock, #draggableRobotWidget, #draggableRouletteWidget');
        floatingWidgets.forEach(el => {
          el.style.display = 'flex';
          el.classList.remove('hidden');
        });

        if (typeof updateUserExpDisplay === 'function') updateUserExpDisplay();
        if (typeof updateCoverFlowVisuals === 'function') updateCoverFlowVisuals();
        if (typeof showFloatingToast === 'function') showFloatingToast('¡Bienvenido de nuevo, Administrador!', '✅');
        if (typeof goToHomePortals === 'function') goToHomePortals();
        return false;
      }

      // Verificar también si es un usuario registrado localmente
      try {
        const regList = JSON.parse(localStorage.getItem('english_app_registered_users') || '[]');
        const matchedUser = regList.find(u =>
          (u.username && u.username.toLowerCase() === userInput.toLowerCase()) ||
          (u.email && u.email.toLowerCase() === userInput.toLowerCase())
        );
        if (matchedUser && (!matchedUser.password || matchedUser.password === passInput)) {
          const studentSession = {
            username: matchedUser.username,
            email: matchedUser.email || (matchedUser.username + '@mastereng.com'),
            role: matchedUser.role || 'user',
            exp: matchedUser.exp || 0,
            rank: matchedUser.rank || 'Bronce'
          };
          saveStoredAuthUser(studentSession);
          localStorage.setItem('user_role', 'user');
          updateUserExpDisplay();
          const viewAuthEl = document.getElementById('view-auth');
          if (viewAuthEl) {
            viewAuthEl.style.display = 'none';
            viewAuthEl.classList.add('hidden');
          }
          showFloatingToast('¡Bienvenido de nuevo, ' + studentSession.username + '!', '✅');
          goToHomePortals();
          return false;
        }
      } catch (e) {}

      if (typeof showAuthAlert === 'function') {
        showAuthAlert('Usuario o contraseña incorrectos. Regístrate primero', 'error');
      }
      return false;
    };

    window.handleGoogleAuth = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      showFloatingToast('Iniciando acceso con cuenta de Google...', '🔒');
      window.continueAsGuest(e);
      return false;
    };

  window.showView = showView;
  window.goToHomePortals = goToHomePortals;
  window.openPortalWithLoader = openPortalWithLoader;
  window.getStoredUser = getStoredUser;
  window.saveStoredUser = saveStoredAuthUser;
  window.saveStoredAuthUser = saveStoredAuthUser;
  window.updateUserExpDisplay = updateUserExpDisplay;
  window.addExp = addExp;
  window.showFloatingToast = showFloatingToast;
  window.openAdminDashboardModal = openAdminDashboardModal;
  window.closeAdminDashboardModal = closeAdminDashboardModal;
  window.loadAdminUsersData = loadAdminUsersData;
  window.refreshAdminUsersData = refreshAdminUsersData;
  window.handleAdminUserSearch = handleAdminUserSearch;
  window.openAdminConfirmDelete = openAdminConfirmDelete;
  window.closeAdminConfirmDelete = closeAdminConfirmDelete;
  window.executeAdminDeleteUser = executeAdminDeleteUser;
  window.openAdminUserProgress = openAdminUserProgress;
  window.closeAdminViewProgress = closeAdminViewProgress;
  window.openAdminViewProgressModal = openAdminUserProgress;
  window.closeAdminViewProgressModal = closeAdminViewProgress;
  window.openProfileModal = openProfileModal;
  window.closeProfileModal = closeProfileModal;
  window.openRouletteModal = openRouletteModal;
  window.closeRouletteModal = closeRouletteModal;
  window.spinRouletteWheel = spinRouletteWheel;
  window.handleRouletteAnswer = handleRouletteAnswer;
  window.toggleChatbotWindow = toggleChatbotWindow;
  window.askChatbotQuestion = askChatbotQuestion;
  window.sendChatbotMessage = sendChatbotMessage;
  window.filterGlossaryTerms = filterGlossaryTerms;
  window.closeGlossaryModal = closeGlossaryModal;
  window.submitMissionAnswer = submitMissionAnswer;
  window.closeMissionModal = closeMissionModal;
  window.selectStory = selectStory;
  window.speakStoryParagraph = speakStoryParagraph;
  window.toggleBilingualStoryMode = toggleBilingualStoryMode;
  window.readEntireStoryAudio = readEntireStoryAudio;
  window.startVoicePracticeParagraph = startVoicePracticeParagraph;
  window.checkForceUpdate = checkForceUpdate;
  window.triggerBlobDownload = triggerBlobDownload;
  window.triggerDirectDownload = triggerDirectDownload;
  window.generateSimplePdfBlob = generateSimplePdfBlob;
  window.downloadActiveGlossaryPdf = downloadActiveGlossaryPdf;
  window.downloadStoryPdf = downloadStoryPdf;
  window.initThreeWorldTour = initThreeWorldTour;
  window.buildRealisticHouse = buildRealisticHouse;
  window.buildRealisticBackyard = buildRealisticBackyard;
  window.switch3DScenario = switch3DScenario;
  window.speakText = speakText;
  window.handleLoginSubmit = handleAuthLoginSubmit;
  window.handleGuestAccess = handleGuestAccess;
  window.handleLogoClick = handleLogoClick;
  window.openSettingsModal = openSettingsModal;
  window.closeSettingsModal = closeSettingsModal;
  window.handleMasterVolumeChange = handleMasterVolumeChange;
  window.handleThemeChange = handleThemeChange;
  window.toggleAppTheme = toggleAppTheme;
  window.handleFontFamilyChange = handleFontFamilyChange;
  window.handleTtsSpeedChange = handleTtsSpeedChange;
  window.handleLogoutFromSettings = handleLogoutFromSettings;
  window.syncSettingsUiFromStorage = syncSettingsUiFromStorage;
  window.updateFloatingWidgetsVisibility = updateFloatingWidgetsVisibility;

    window.handleAuthRegisterSubmit = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      const uInput = document.getElementById('authRegUsername');
      const eInput = document.getElementById('authRegEmail');
      const pInput = document.getElementById('authRegPassword');
      const cpInput = document.getElementById('authRegConfirmPassword');

      const username = (uInput?.value || '').trim();
      const email = (eInput?.value || '').trim();
      const password = (pInput?.value || '').trim();
      const confirmPassword = (cpInput?.value || '').trim();

      if (!username || !email || !password) {
        showAuthAlert('Por favor completa todos los campos requeridos para crear tu cuenta.', 'error');
        return false;
      }

      if (cpInput && confirmPassword && password !== confirmPassword) {
        showAuthAlert('Las contraseñas no coinciden. Por favor verifícalas.', 'error');
        return false;
      }

      const newUser = {
        username: username,
        email: email,
        role: 'user',
        exp: 0,
        rank: 'Bronce'
      };

      try {
        localStorage.setItem('mastereng_user', JSON.stringify(newUser));
        localStorage.setItem('user_role', 'user');
        localStorage.setItem('english_app_user_session', JSON.stringify(newUser));
        const regList = JSON.parse(localStorage.getItem('english_app_registered_users') || '[]');
        if (!regList.some(u => u.username === username)) {
          regList.push({ ...newUser, password });
          localStorage.setItem('english_app_registered_users', JSON.stringify(regList));
        }
      } catch (err) { }

      const authView = document.getElementById('view-auth');
      if (authView) {
        authView.style.display = 'none';
        authView.style.pointerEvents = 'none';
        authView.style.visibility = 'hidden';
        authView.style.zIndex = '-1';
        authView.classList.add('hidden');
      }

      const loginModal = document.getElementById('login-modal') || document.querySelector('.login-container');
      if (loginModal) {
        loginModal.style.display = 'none';
        loginModal.style.pointerEvents = 'none';
        loginModal.style.visibility = 'hidden';
      }

      showFloatingToast('¡Cuenta creada con éxito! Bienvenido a MasterENG', '🎉');
      goToHomePortals();
      return false;
    };
    function handleAuthRegisterSubmit(e) { return window.handleAuthRegisterSubmit(e); }


    /* ========================================================
       RENDERIZADO DINÁMICO DE LOS 10 MÓDULOS DE LEARNING PATH
       ======================================================== */
    window.OFFICIAL_LEARNING_MODULES = [
      { id: 1, title: "Foundations & Daily Routine", level: "A1", exp: 20, words: 45, key: "everyday_actions", progress: 65 },
      { id: 2, title: "Travel, Airport & Directions", level: "A1-A2", exp: 20, words: 50, key: "connectors", progress: 40 },
      { id: 3, title: "Food, Dining & Social Life", level: "A2", exp: 20, words: 40, key: "social_dating", progress: 25 },
      { id: 4, title: "Workplace & Professional Tech", level: "B1", exp: 25, words: 60, key: "professional_english", progress: 10 },
      { id: 5, title: "Socializing & Idiomatic Slang", level: "B1", exp: 25, words: 55, key: "phrasal_verbs", progress: 0 },
      { id: 6, title: "Debate, Opinions & Current Events", level: "B2", exp: 30, words: 50, key: "compound_words", progress: 0 },
      { id: 7, title: "Science, Nature & Environment", level: "B2", exp: 30, words: 50, key: "affixes_morphology", progress: 0 },
      { id: 8, title: "Literature, Storytelling & Cinema", level: "C1", exp: 35, words: 70, key: "grammar_path", progress: 0 },
      { id: 9, title: "Academic Research & TOEFL Prep", level: "C1", exp: 40, words: 85, key: "toefl_simulator", progress: 0 },
      { id: 10, title: "Fluency & Accent Reduction", altTitle: "Master Fluency & Accent Reduction", level: "C2", exp: 50, words: 100, key: "internet_slang", progress: 0 }
    ];

    window.openLearningPath = function() {
      console.log('Abriendo Learning Path y renderizando 10 módulos...');
      if (typeof window.navigateToView === 'function') {
        window.navigateToView('learning-path-view');
      } else if (typeof showView === 'function') {
        showView('view-path');
      }
      if (typeof window.renderOfficialLearningModules === 'function') {
        window.renderOfficialLearningModules();
      } else if (typeof window.renderLearningPathModules === 'function') {
        window.renderLearningPathModules();
      }
    };

    window.openLearningMissionModal = function(modId) {
      const mod = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.id === Number(modId) || m.key === modId);
      const key = mod ? mod.key : (typeof modId === 'string' ? modId : 'everyday_actions');
      if (typeof openModuleMission === 'function') {
        openModuleMission(key);
      }
    };
    function openLearningMissionModal(modId) { return window.openLearningMissionModal(modId); }
    window.openModuleMission = openModuleMission;
    window.openLearningMission = window.openLearningMissionModal;
    window.openGlossaryModal = openGlossaryModal;

    window.openModuleGlossary = function(modId) {
      const mod = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.id === Number(modId) || m.key === modId);
      const key = mod ? mod.key : (typeof modId === 'string' ? modId : 'everyday_actions');
      if (typeof openGlossaryModal === 'function') {
        openGlossaryModal(key);
      } else {
        const modal = document.getElementById('glossaryModal');
        if (modal) {
          modal.style.display = 'flex';
          modal.style.setProperty('display', 'flex', 'important');
          modal.classList.add('active');
          modal.classList.remove('hidden');
        }
      }
    };
    function openModuleGlossary(modId) { return window.openModuleGlossary(modId); }

    window.renderOfficialLearningModules = function() {
      const g1 = document.getElementById('learning-modules-grid');
      const g2 = document.getElementById('learningModulesContainer');
      const g3 = document.querySelector('.modules-grid');
      const targets = [g1, g2, g3].filter(Boolean);
      if (!targets.length) return;

      const htmlContent = window.OFFICIAL_LEARNING_MODULES.map(mod => {
        const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[mod.key]) 
          ? window.MASTER_MODULES_DATA[mod.key] 
          : { items: [] };
        const sampleItems = (modData.items || []).slice(0, 3);
        const progressPercent = typeof mod.progress === 'number' ? mod.progress : 0;

        return `
        <div class="module-card p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 shadow-xl flex flex-col justify-between transition hover:-translate-y-1 group">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                Módulo ${mod.id} &bull; Nivel ${mod.level}
              </span>
              <span class="text-xs font-bold text-amber-400">+${mod.exp} EXP</span>
            </div>
            <h3 class="text-base font-extrabold text-white mb-1 group-hover:text-amber-200 transition">
              ${mod.id}. ${mod.title}
            </h3>
            <p class="text-xs text-slate-400 mb-2">${mod.words} palabras clave y ejercicios interactivos</p>

            <!-- Barra de Progreso -->
            <div class="mb-3">
              <div class="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-1">
                <span>Progreso</span>
                <span class="text-amber-400 font-bold">${progressPercent}%</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div class="bg-gradient-to-r from-amber-500 to-yellow-400 h-1.5 rounded-full transition-all duration-500" style="width: ${progressPercent}%;"></div>
              </div>
            </div>

            <div class="mb-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <div class="flex items-center justify-between mb-1.5">
                <span class="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Vocabulario Clave</span>
                <button type="button" onclick="window.openModuleGlossary(${mod.id})" class="text-[10px] font-bold text-amber-400 hover:underline cursor-pointer">Ver todos ↗</button>
              </div>
              <div class="space-y-1">
                ${sampleItems.map(item => `
                  <div class="flex items-center justify-between py-0.5 border-b border-slate-900 last:border-none">
                    <span class="text-slate-200 font-medium truncate">${item.term || ''} <span class="text-[10px] text-amber-400/80 font-mono">${item.pron || ''}</span></span>
                    <button type="button" onclick="speakText('${(item.term || '').replace(/'/g, "\\'")}')" class="text-amber-400 hover:text-amber-300 text-xs px-1 cursor-pointer" title="Pronunciar">🔊</button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button type="button" onclick="window.openModuleGlossary(${mod.id})"
              class="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
              <span>📖</span>
              <span>Glosario Oficial</span>
            </button>
            <button type="button" onclick="window.openLearningMissionModal(${mod.id})"
              class="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20">
              <span>🎯</span>
              <span>Iniciar Misión</span>
            </button>
          </div>
        </div>
      `;
      }).join('');

      targets.forEach(t => {
        t.innerHTML = htmlContent;
      });
    };
    window.renderLearningPathModules = window.renderOfficialLearningModules;

    window.returnToHub = function() {
      goToHomePortals();
    };


    /* ========================================================
       BUSCADOR GLOBAL DE MÚSICA EN VIVO (ITUNES WEB API + LRCLIB LYRICS + YT MUSIC)
       ======================================================== */
    window.searchGlobalMusic = async function(term) {
      const inputEl = document.getElementById('musicSearchInput');
      const query = (typeof term === 'string' ? term : (inputEl ? inputEl.value : '')).trim();
      const resultsGrid = document.getElementById('musicResultsGrid') || document.querySelector('.music-results-grid');
      const suggestionsEl = document.getElementById('musicSearchSuggestions');

      // Ocultar sugerencias emergentes de inmediato para despejar la vista
      if (suggestionsEl) {
        suggestionsEl.classList.add('hidden');
      }

      if (!query) {
        showFloatingToast('Escribe el título de una canción o artista para buscar en la web', '🎵');
        if (inputEl && typeof inputEl.focus === 'function') inputEl.focus();
        return;
      }

      // Si el usuario pegó directamente un enlace o ID de YouTube, cargarlo también
      if (typeof extractYouTubeId === 'function') {
        const ytId = extractYouTubeId(query);
        if (ytId && (query.includes('youtube.com') || query.includes('youtu.be'))) {
          const iframe = document.getElementById('musicYouTubeIframe');
          if (iframe) iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=1&rel=0`;
          showFloatingToast('Reproduciendo video de YouTube en sala', '🎬');
          return;
        }
      }

      if (resultsGrid) {
        resultsGrid.style.display = 'grid';
        resultsGrid.style.setProperty('display', 'grid', 'important');
        resultsGrid.classList.remove('hidden');
        resultsGrid.innerHTML = `
          <div class="col-span-full py-8 flex flex-col items-center justify-center gap-3 text-cyan-300 bg-slate-950/60 rounded-2xl border border-cyan-500/30">
            <div class="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
            <p class="text-xs font-bold">Consultando catálogo musical global en vivo para "${query}"...</p>
          </div>
        `;
      }

      try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=12`;
        const res = await fetch(url);
        const data = await res.json();
        const songs = (data && Array.isArray(data.results)) ? data.results : [];

        if (songs.length === 0) {
          if (resultsGrid) {
            resultsGrid.innerHTML = `
              <div class="col-span-full py-6 px-4 text-center text-xs text-slate-300 bg-slate-950/60 rounded-2xl border border-slate-800">
                No se encontraron canciones para "${query}". Intenta con otro título o artista.
              </div>
            `;
          }
          return;
        }

        window._lastSearchedWebSongs = songs;

        if (resultsGrid) {
          resultsGrid.innerHTML = songs.map((s, idx) => {
            const rawTitle = s.trackName || 'Song';
            const rawArtist = s.artistName || 'Artist';
            const cleanTitle = rawTitle.replace(/"/g, '&quot;');
            const cleanArtist = rawArtist.replace(/"/g, '&quot;');
            const hiResArtwork = (s.artworkUrl100 || 'images/portal_music.svg').replace('100x100bb', '300x300bb');
            const previewUrl = s.previewUrl || '';

            return `
              <div class="music-track-card p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-cyan-400/70 shadow-xl flex flex-col justify-between transition hover:-translate-y-1 group">
                <div>
                  <div class="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-slate-900 border border-slate-800">
                    <img src="${hiResArtwork}" alt="${cleanTitle}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.onerror=null; this.src='images/portal_music.svg';">
                    <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/85 text-[9px] font-bold text-cyan-300 border border-cyan-500/40">Web Audio</span>
                  </div>
                  <h4 class="text-sm font-extrabold text-white truncate" title="${cleanTitle}">${cleanTitle}</h4>
                  <p class="text-xs text-cyan-400/90 font-semibold truncate">${cleanArtist}</p>
                </div>
                <div class="mt-3 space-y-2">
                  ${previewUrl ? `<audio controls src="${previewUrl}" class="w-full h-8 rounded-lg" preload="none"></audio>` : ''}
                  <button type="button" onclick="window.loadWebSongByIndex(${idx})"
                    class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25 active:scale-95">
                    <span>🎤</span>
                    <span>Reproducir con Letra</span>
                  </button>
                </div>
              </div>
            `;
          }).join('');
        }
        showFloatingToast(`${songs.length} canciones encontradas para "${query}"`, '🎵');
      } catch (err) {
        console.warn('Error al buscar en la web musical:', err);
        if (resultsGrid) {
          resultsGrid.innerHTML = `
            <div class="col-span-full py-6 text-center text-xs text-amber-300 bg-slate-950/60 rounded-2xl border border-amber-500/30">
              No se pudo conectar con el servicio musical web en este momento. Verifica tu conexión a internet.
            </div>
          `;
        }
      }
    };

    window.loadWebSongByIndex = function(idx) {
      const s = (window._lastSearchedWebSongs || [])[idx];
      if (!s) return;
      const hiResArtwork = (s.artworkUrl100 || 'images/portal_music.svg').replace('100x100bb', '300x300bb');
      window.loadSongToKaraoke(s.trackName || 'Track', s.artistName || 'Artist', s.previewUrl || '', hiResArtwork);
    };

    window.loadSongToKaraoke = function(trackName, artistName, previewUrl, artworkUrl) {
      return (async function() {
      const titleEl = document.getElementById('activeMusicTitle');
      const artistEl = document.getElementById('activeMusicArtist');
      if (titleEl) titleEl.textContent = trackName;
      if (artistEl) artistEl.textContent = artistName;

      // Pausar YouTube previo si estaba activo
      if (typeof window.pauseYouTubePlayer === 'function') {
        window.pauseYouTubePlayer();
      }

      // Si la canción coincide con alguna del catálogo con video oficial de YouTube, cargar también su video
      if (Array.isArray(window.MUSIC_SESSION_TRACKS)) {
        const matchLocal = window.MUSIC_SESSION_TRACKS.find(t =>
          t.title.toLowerCase().includes(trackName.toLowerCase()) ||
          trackName.toLowerCase().includes(t.title.toLowerCase())
        );
        const iframe = document.getElementById('musicYouTubeIframe');
        if (matchLocal && matchLocal.ytId && iframe) {
          iframe.src = `https://www.youtube-nocookie.com/embed/${matchLocal.ytId}?enablejsapi=1&rel=0`;
        }
      }

      // Configurar reproductor de audio sincronizado en la tarjeta principal
      let audioTracker = document.getElementById('karaokeAudioTracker');
      if (!audioTracker) {
        audioTracker = document.createElement('audio');
        audioTracker.id = 'karaokeAudioTracker';
        audioTracker.className = 'w-full mt-3 rounded-xl';
        audioTracker.controls = true;
        const iframeParent = document.getElementById('musicYouTubeIframe')?.parentElement?.parentElement;
        if (iframeParent) {
          iframeParent.appendChild(audioTracker);
        } else {
          document.body.appendChild(audioTracker);
        }
      }

      if (previewUrl) {
        audioTracker.src = previewUrl;
        audioTracker.style.display = 'block';
        try {
          audioTracker.play().catch(e => console.log('Autoplay deferred:', e));
        } catch (e) {}
      }

      // Mostrar indicador de carga de letra real desde LRCLIB API
      const lyricsContainer = document.getElementById('musicLyricsContainer');
      if (lyricsContainer) {
        lyricsContainer.innerHTML = `
          <div class="py-8 text-center text-cyan-300 text-xs font-semibold flex flex-col items-center gap-2">
            <div class="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
            <span>Sincronizando letra oficial de "${trackName}" — ${artistName}...</span>
          </div>
        `;
      }

      let finalLyrics = null;
      try {
        const lrcUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(trackName + ' ' + artistName)}`;
        const lrcRes = await fetch(lrcUrl);
        if (lrcRes.ok) {
          const lrcData = await lrcRes.json();
          if (Array.isArray(lrcData) && lrcData.length > 0) {
            const best = lrcData.find(item => item.syncedLyrics) || lrcData.find(item => item.plainLyrics) || lrcData[0];
            if (best && best.syncedLyrics) {
              const lines = best.syncedLyrics.split(/\r?\n/);
              const parsed = [];
              lines.forEach(line => {
                const m = line.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
                if (m) {
                  const sec = Math.floor(parseInt(m[1], 10) * 60 + parseFloat(m[2]));
                  const txt = m[3].trim();
                  if (txt) {
                    parsed.push({ time: sec, text: txt, es: 'Haz clic en cualquier palabra para ver su fonética y traducción' });
                  }
                }
              });
              if (parsed.length > 0) finalLyrics = parsed.slice(0, 40);
            } else if (best && best.plainLyrics) {
              const lines = best.plainLyrics.split(/\r?\n/).map(l => l.trim()).filter(Boolean).slice(0, 30);
              if (lines.length > 0) {
                finalLyrics = lines.map((txt, idx) => ({
                  time: idx * 4,
                  text: txt,
                  es: 'Haz clic en cualquier palabra para inspeccionar pronunciación IPA'
                }));
              }
            }
          }
        }
      } catch (lrcErr) {
        console.warn('Fallback a letra fonética interactiva:', lrcErr);
      }

      if (!finalLyrics || finalLyrics.length === 0) {
        finalLyrics = [
          { time: 0, text: `${trackName} - ${artistName}`, es: `Escuchando ${trackName} de ${artistName}` },
          { time: 4, text: "Listen carefully to the vowel sounds and natural rhythm", es: "Escucha con atención los sonidos vocálicos y el ritmo natural" },
          { time: 9, text: `Sing along with ${artistName} to master connected speech`, es: `Canta junto a ${artistName} para dominar el habla conectada` },
          { time: 15, text: "Click on any English word above to inspect its phonetic IPA", es: "Haz clic en cualquier palabra en inglés para ver su fonética IPA" },
          { time: 21, text: "Repeat each verse aloud to build fluency and confidence", es: "Repite cada verso en voz alta para desarrollar fluidez y confianza" },
          { time: 26, text: "Awesome pronunciation practice! Complete the challenge for +30 EXP", es: "¡Excelente práctica de pronunciación! Completa el reto por +30 EXP" }
        ];
      }

      if (typeof window.renderLyricsFromList === 'function') {
        window.renderLyricsFromList(finalLyrics);
      } else if (lyricsContainer) {
        lyricsContainer.innerHTML = finalLyrics.map(line => `
          <p class="lyric-line p-3 rounded-xl transition-all duration-300 cursor-pointer" data-start="${line.time}">
            <span class="block text-white font-extrabold text-sm sm:text-base">${line.text}</span>
            <span class="block text-xs text-cyan-300/80 mt-0.5">${line.es || ''}</span>
          </p>
        `).join('');
      }

      audioTracker.ontimeupdate = function() {
        if (typeof window.handleKaraokeTimeUpdate === 'function') {
          window.handleKaraokeTimeUpdate(audioTracker.currentTime);
        }
      };

      showFloatingToast(`Reproduciendo "${trackName}" con letra interactiva`, '🎤');
      const lyricsBox = document.getElementById('musicLyricsContainer');
      if (lyricsBox) lyricsBox.scrollTop = 0;
      })();
    };

    /* ========================================================
       LISTENERS GLOBALES PARA CIERRE UNIVERSAL DE MODALES
       ======================================================== */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (typeof window.closeAllModals === 'function') {
          window.closeAllModals();
        }
      }
    });

    document.addEventListener('click', function(e) {
      if (e.target && (
        e.target.classList.contains('modal-backdrop') ||
        e.target.classList.contains('modal-overlay') ||
        (e.target.classList.contains('modal') && !e.target.closest('.modal-content, .login-card, [class*="bg-"]'))
      )) {
        if (typeof window.closeAllModals === 'function') {
          window.closeAllModals();
        }
      }
    });

    // Inicialización inmediata de portales y módulos de academia con blindaje try/catch
    try {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          try {
            if (typeof window.showPortal === 'function') window.showPortal(0);
            if (typeof window.renderOfficialLearningModules === 'function') window.renderOfficialLearningModules();
          } catch (initErr) {
            console.error('Error en inicialización DOMContentLoaded:', initErr);
          }
        });
      } else {
        if (typeof window.showPortal === 'function') window.showPortal(0);
        if (typeof window.renderOfficialLearningModules === 'function') window.renderOfficialLearningModules();
      }
    } catch (e) {
      console.error('Error al inicializar la aplicación:', e);
    }
  })();
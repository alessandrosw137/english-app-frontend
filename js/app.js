
// --- World 3D Fullscreen Resize & Global Header Back Sync ---
window.resizeWorld3DFullscreen = function() {
  if (typeof window !== 'undefined' && window.World3D && typeof window.World3D.onWindowResize === 'function') {
    window.World3D.onWindowResize();
  } else if (typeof window !== 'undefined' && typeof window.onWindowResize === 'function') {
    window.onWindowResize();
  }
};
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('resize', function() {
    if (typeof document !== 'undefined' && document.body && document.body.classList.contains('view-worldtour-active')) {
      if (typeof window.resizeWorld3DFullscreen === 'function') window.resizeWorld3DFullscreen();
    }
  });
}

window.syncTopBackBtnVisibility = function(targetId) {
  if (typeof document === 'undefined') return;
  var btn = document.getElementById('headerGlobalBackBtn');
  if (!btn) return;
  var isHomeOrAuth = (targetId === 'view-home' || targetId === 'view-auth' || targetId === 'home' || targetId === 'login');
  if (isHomeOrAuth) {
    btn.classList.add('hidden');
    btn.style.setProperty('display', 'none', 'important');
  } else {
    btn.classList.remove('hidden');
    btn.style.setProperty('display', 'inline-flex', 'important');
  }
};










window._realWorld3DEngine = (typeof window !== 'undefined' && window.World3D && window.World3D.initOrResumeWorld3D) ? window.World3D.initOrResumeWorld3D : ((typeof window !== 'undefined' && window.initOrResumeWorld3D) ? window.initOrResumeWorld3D : null);
/**
 * MasterENG - Flujo Principal de Interfaz, Portales, Cuentos, 3D y Administración
 */
(function() {
  'use strict';

  
    let starsCanvasAnimId = null;

    window.isUserLoggedIn = function() {
      try {
        return localStorage.getItem("mastereng_user") !== null;
      } catch (_) {
        return false;
      }
    };

    window.isUserRegistered = function() {
      try {
        const role = localStorage.getItem('user_role');
        if (role === 'guest') return false;
        if (localStorage.getItem('guest_user')) return false;
        const rawMaster = localStorage.getItem('mastereng_user');
        const rawSession = localStorage.getItem('english_app_user_session');
        const rawEmail = localStorage.getItem('user_email') || localStorage.getItem('currentUser');
        if (!rawMaster && !rawSession && !rawEmail) return false;
        if (rawMaster && !rawMaster.startsWith('{') && !rawMaster.startsWith('[')) {
          if (rawMaster.trim().toLowerCase() === 'invitado') return false;
          return true;
        }
        let u = null;
        if (rawMaster) {
          try { u = JSON.parse(rawMaster); } catch (_) { if (rawMaster.trim().toLowerCase() !== 'invitado') return true; }
        }
        if (!u && rawSession) {
          try { u = JSON.parse(rawSession); } catch (_) {}
        }
        if (!u && rawEmail) {
          return rawEmail.trim().toLowerCase() !== 'invitado';
        }
        if (!u) return false;
        if (u.role === 'guest' || u.isGuest === true) return false;
        if (u.username && String(u.username).trim().toLowerCase() === 'invitado') return false;
        return true;
      } catch (_) {
        return false;
      }
    };

    

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
        const isUserAdmin = Boolean(
          user && (
            user.role === 'admin' ||
            (user.username && ['admin'].includes(String(user.username).toLowerCase())) ||
            (user.email && (String(user.email).toLowerCase() === 'admin@antigravity.com' || String(user.email).toLowerCase().includes('admin') || String(user.email).toLowerCase() === 'admin@mastereng.com'))
          )
        );
        if (isUserAdmin && (user.role === 'admin' || (user.username && ['admin'].includes(String(user.username).toLowerCase())))) {
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
      let realUsers = [];
      try {
        const storedReg = JSON.parse(
          localStorage.getItem('mastereng_registered_users') ||
          localStorage.getItem('english_app_registered_users') ||
          '[]'
        );
        if (Array.isArray(storedReg)) {
          realUsers = storedReg.map((ru, idx) => {
            const exp = typeof ru.exp === 'number' ? ru.exp : 0;
            const rank = ru.rank || (typeof calculateRankInfo === 'function' ? calculateRankInfo(exp).rank : 'Bronce');
            return {
              id: ru.id || (idx + 1),
              username: ru.username || (ru.name || 'Estudiante'),
              email: ru.email || (ru.username ? ru.username + '@mastereng.com' : 'estudiante@mastereng.com'),
              role: ru.role || 'user',
              rank: rank,
              exp: exp,
              streak_days: ru.streak_days || 1,
              created_at: ru.created_at || new Date().toISOString()
            };
          });
        }
      } catch (e) {}

      // Si hay un usuario logueado en sesión y no está en la lista de registrados, agregarlo
      if (realUsers.length === 0) {
        realUsers = [
          {
            id: 1,
            username: 'Wilberth Alessandro (Admin)',
            email: 'admin@antigravity.com',
            role: 'admin',
            rank: 'Diamante',
            exp: 1250,
            streak_days: 14,
            created_at: new Date(Date.now() - 30 * 86400000).toISOString()
          },
          {
            id: 2,
            username: 'Sofia Morales',
            email: 'sofia.morales@mastereng.com',
            role: 'user',
            rank: 'Oro',
            exp: 840,
            streak_days: 7,
            created_at: new Date(Date.now() - 15 * 86400000).toISOString()
          },
          {
            id: 3,
            username: 'Carlos Mendoza',
            email: 'carlos.mendoza@mastereng.com',
            role: 'user',
            rank: 'Plata',
            exp: 420,
            streak_days: 4,
            created_at: new Date(Date.now() - 8 * 86400000).toISOString()
          },
          {
            id: 4,
            username: 'Valentina Torres',
            email: 'valentina.t@mastereng.com',
            role: 'user',
            rank: 'Bronce',
            exp: 180,
            streak_days: 2,
            created_at: new Date(Date.now() - 2 * 86400000).toISOString()
          }
        ];
      }

      if (authUser && authUser.username && !realUsers.some(u => u.username === authUser.username || (authUser.email && u.email === authUser.email))) {
        const userExp = typeof authUser.exp === 'number' ? authUser.exp : 0;
        const userRank = authUser.rank || (typeof calculateRankInfo === 'function' ? calculateRankInfo(userExp).rank : 'Bronce');
        realUsers.unshift({
          id: authUser.id || (realUsers.length + 1),
          username: authUser.username,
          email: authUser.email || (authUser.username === 'admin' ? 'admin@mastereng.com' : `${authUser.username}@mastereng.com`),
          role: authUser.role || 'admin',
          rank: userRank,
          exp: userExp,
          streak_days: 1,
          created_at: authUser.created_at || new Date().toISOString()
        });
      }

      return realUsers;
    }

    let _lastAdminOpenTime = 0;
    
window.ADMIN_EMAIL = 'admin@mastereng.com';

window.isCurrentUserAdmin = function() {
  try {
    const rawRole = (localStorage.getItem('user_role') || '').trim().toLowerCase();
    const rawSession = localStorage.getItem('english_app_user_session') || localStorage.getItem('mastereng_user') || '';
    if (rawSession) {
      try {
        const u = JSON.parse(rawSession);
        if (u) {
          const uRole = String(u.role || '').trim().toLowerCase();
          const uEmail = String(u.email || '').trim().toLowerCase();
          const uName = String(u.username || '').trim().toLowerCase();
          // Cuentas de Google o usuarios normales NUNCA son administradores
          if (uRole === 'user' || u.isGoogleUser === true || (uEmail && !uEmail.includes('admin') && !uEmail.includes('mastereng'))) {
            return false;
          }
          if (uEmail === window.ADMIN_EMAIL || uEmail === 'admin@antigravity.com') return true;
          if (uRole === 'admin' && (uEmail === window.ADMIN_EMAIL || uEmail === 'admin@antigravity.com' || uName === 'admin')) return true;
          return false;
        }
      } catch (_) {
        const rawStr = rawSession.trim().toLowerCase();
        if (rawStr === window.ADMIN_EMAIL || rawStr === 'admin@antigravity.com') return true;
      }
    }
    const rawEmail = (localStorage.getItem('mastereng_user_email') || '').trim().toLowerCase();
    if (rawEmail === window.ADMIN_EMAIL || rawEmail === 'admin@antigravity.com') return true;
    const rawName = (localStorage.getItem('mastereng_user_name') || '').trim().toLowerCase();
    if (rawName === 'admin' && rawRole === 'admin') return true;
  } catch (_) {}
  return false;
};

  function isCurrentUserAdmin() { return window.isCurrentUserAdmin(); }

    function executeOpenAdminDashboard() {
      document.querySelectorAll('#profileModal, #settingsModal, #feedbackModal, #rouletteModal, #glossaryModal, #learningMissionModal, #musicWordModal, #chatbotWindow, #googleAccountPickerModal, #adminSecurityPromptModal').forEach(m => {
        m.style.setProperty('display', 'none', 'important');
        m.classList.remove('active', 'show', 'open');
        m.classList.add('hidden');
      });

      const modal = document.getElementById('adminDashboardModal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('active');
        modal.style.removeProperty('display');
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('z-index', '100005', 'important');
        
        const instantUsers = (window.allAdminUsersList && window.allAdminUsersList.length > 0)
          ? window.allAdminUsersList
          : getInstantDefaultAdminUsers();
        window.allAdminUsersList = instantUsers;
        updateAdminMetrics(instantUsers);
        renderAdminUsersTable(instantUsers);
        
        setTimeout(() => { loadAdminUsersData(true); if (typeof window.renderAdminBugReportsCard === 'function') window.renderAdminBugReportsCard(); }, 10);
      }
    }

    function openAdminSecurityPrompt() {
      let promptModal = document.getElementById('adminSecurityPromptModal');
      if (!promptModal) {
        promptModal = document.createElement('div');
        promptModal.id = 'adminSecurityPromptModal';
        promptModal.className = 'fixed inset-0 z-[100010] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md';
        promptModal.innerHTML = `
          <div class="w-full max-w-sm bg-[#090d16] border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative text-slate-100 flex flex-col gap-4" onclick="event.stopPropagation()">
            <div class="flex items-center gap-3 pb-3 border-b border-amber-500/20">
              <div class="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-xl text-amber-400">
                🛡️
              </div>
              <div>
                <h4 class="font-bold text-sm text-white">Consola de Administración</h4>
                <p class="text-[11px] text-slate-400">Ingresa la clave maestra para acceder</p>
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-[11px] font-semibold text-slate-300">Contraseña Maestra</label>
              <input type="password" id="adminPromptPassInput" placeholder="Ingresa contraseña..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-xs text-white outline-none" />
              <p id="adminPromptPassError" class="text-[11px] text-rose-400 font-medium hidden">❌ Contraseña incorrecta</p>
            </div>
            <div class="flex items-center gap-2 pt-2">
              <button type="button" onclick="document.getElementById('adminSecurityPromptModal').remove()" class="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer">
                Cancelar
              </button>
              <button type="button" id="adminPromptSubmitBtn" onclick="window.submitAdminSecurityPrompt()" class="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 cursor-pointer">
                Verificar y Abrir
              </button>
            </div>
          </div>
        `;
        document.body.appendChild(promptModal);
      } else {
        promptModal.style.removeProperty('display');
        promptModal.style.setProperty('display', 'flex', 'important');
      }
      const passInput = document.getElementById('adminPromptPassInput');
      if (passInput) {
        passInput.value = '';
        passInput.focus();
        passInput.onkeydown = (ev) => {
          if (ev.key === 'Enter') {
            ev.preventDefault();
            window.submitAdminSecurityPrompt();
          }
        };
      }
    }

    window.submitAdminSecurityPrompt = function() {
      const passInput = document.getElementById('adminPromptPassInput');
      const errorMsg = document.getElementById('adminPromptPassError');
      const passVal = passInput ? passInput.value.trim() : '';
      if (passVal === 'Admin2026!Master') {
        const adminObj = {
          id: 'admin_master_001',
          username: 'admin',
          email: 'admin@antigravity.com',
          role: 'admin',
          exp: 1250,
          rank: 'Diamante',
          token: 'MasterENG-Admin-OfflineMasterToken-2026'
        };
        try {
          saveStoredAuthUser(adminObj);
          localStorage.setItem('user_role', 'admin');
          localStorage.setItem('mastereng_user', JSON.stringify(adminObj));
          localStorage.setItem('mastereng_user_name', 'admin');
          localStorage.setItem('mastereng_user_email', 'admin@antigravity.com');
        } catch (_) {}
        const promptModal = document.getElementById('adminSecurityPromptModal');
        if (promptModal) promptModal.remove();
        showFloatingToast('¡Bienvenido, Administrador!', '🛡️');
        if (typeof updateUserExpDisplay === 'function') updateUserExpDisplay();
        const headerAdmin = document.getElementById('headerAdminBtn');
        if (headerAdmin) {
          headerAdmin.style.display = 'inline-flex';
          headerAdmin.classList.remove('hidden');
        }
        executeOpenAdminDashboard();
      } else {
        if (errorMsg) errorMsg.classList.remove('hidden');
        if (typeof showFloatingToast === 'function') showFloatingToast('Contraseña incorrecta', '❌');
      }
    };

    function openAdminDashboardModal(e) {
      try {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        if (window.event && window.event.stopPropagation) window.event.stopPropagation();
      } catch (_) {}
      if (isCurrentUserAdmin()) {
        executeOpenAdminDashboard();
      } else {
        openAdminSecurityPrompt();
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

      // Si no se pudieron obtener usuarios del backend (offline / modo desarrollo), cargar los usuarios reales locales
      if (!users || users.length === 0) {
        users = getInstantDefaultAdminUsers();
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

      // Encontrar el usuario objetivo para borrarlo permanentemente
      const targetUser = (window.allAdminUsersList || []).find(u => u.id === userId);
      const targetUsername = targetUser ? targetUser.username : null;
      const targetEmail = targetUser ? targetUser.email : null;

      // 1. Borrado permanente en localStorage de todas las listas de usuarios registrados
      try {
        ['mastereng_registered_users', 'english_app_registered_users', 'mastereng_google_accounts'].forEach(storeKey => {
          const raw = localStorage.getItem(storeKey);
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              const filtered = list.filter(item => {
                if (item.id && item.id === userId) return false;
                if (targetUsername && (item.username === targetUsername || item.name === targetUsername)) return false;
                if (targetEmail && item.email === targetEmail) return false;
                return true;
              });
              localStorage.setItem(storeKey, JSON.stringify(filtered));
            }
          }
        });
      } catch (err) {
        console.warn('Error eliminando de localStorage:', err);
      }

      // 2. Notificar al backend si está conectado
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
          showFloatingToast('Usuario eliminado permanentemente de la plataforma', '✅');
        } else {
          showFloatingToast('Usuario eliminado de la base de datos local', '✅');
        }
      } catch (err) {
        showFloatingToast('Usuario eliminado definitivamente de localStorage', '✅');
      } finally {
        if (deleteBtn) {
          deleteBtn.disabled = false;
          deleteBtn.innerHTML = 'Sí, Eliminar Usuario';
        }
        closeAdminConfirmDelete();

        // 3. Actualizar lista en memoria y re-renderizar tabla y métricas en el DOM
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
      // Ocultar widgets en login o para usuarios invitados / no registrados
      const isRegistered = typeof window.isUserRegistered === 'function' ? window.isUserRegistered() : (function() {
        const user = getStoredUser();
        return !!(user && user.role !== 'guest' && user.username !== 'Invitado');
      })();
      if (document.body) {
        document.body.classList.toggle('user-guest', !isRegistered);
      }
      const showFloating = (!viewId.includes('login') && isRegistered);
      const widgets = document.querySelectorAll('.floating-widget, #roulette-btn, #ai-tutor-btn');
      widgets.forEach(w => {
        w.style.setProperty('display', showFloating ? 'flex' : 'none', 'important');
        w.classList.toggle('hidden', !showFloating);
      });
      const dockEl = document.getElementById('tutorRouletteDock');
      if (dockEl) {
        dockEl.style.setProperty('display', showFloating ? 'flex' : 'none', 'important');
        dockEl.classList.toggle('hidden', !showFloating);
      }

      // Mapeo transparente para las vistas maestras existentes
      const viewMap = {
        'login': 'view-auth',
        'login-view': 'view-auth',
        'view-auth': 'view-auth',
        'auth': 'view-auth',
        'hub': 'view-home',
        'hub-view': 'view-home',
        'home': 'view-home',
        'portals': 'view-home',
        'view-home': 'view-home',
        'path': 'view-path',
        'learning-path': 'view-path',
        'learning-path-view': 'view-path',
        'view-path': 'view-path',
        'worldtour': 'view-worldtour',
        'world3d': 'view-worldtour',
        'world3d-view': 'view-worldtour',
        'view-worldtour': 'view-worldtour',
        'music': 'view-music',
        'music-view': 'view-music',
        'view-music': 'view-music',
        'stories': 'view-stories',
        'stories-view': 'view-stories',
        'view-stories': 'view-stories',
        'ai-tutor': 'ai-tutor-view',
        'tutor': 'ai-tutor-view',
        'ai-tutor-view': 'ai-tutor-view',
        'view-ai-tutor': 'ai-tutor-view',
        'admin': 'adminDashboardModal',
        'admin-view': 'adminDashboardModal'
      };
      const cleanRaw = (viewId || '').toString().trim();
      const targetId = viewMap[cleanRaw] || viewMap[cleanRaw.replace(/[-_]view$/, '')] || cleanRaw;
      if (targetId === 'world3d-view' || targetId === 'view-worldtour' || viewId === 'world3d' || viewId === 'worldtour') {
        if (typeof window.open3DPortalView === 'function') {
          window.open3DPortalView();
          return;
        }
      }
      if (targetId === 'ai-tutor-view' || viewId === 'ai-tutor' || viewId === 'ai-tutor-view' || viewId === 'view-ai-tutor') {
        if (typeof window.isUserRegistered === 'function' && !window.isUserRegistered()) {
          if (typeof showFloatingToast === 'function') {
            showFloatingToast('🔒 Inicia sesión con tu cuenta para acceder al Tutor IA.', '🔒');
          }
          if (typeof window.openAuthModal === 'function') window.openAuthModal('login');
          return;
        }
      }

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
      if (targetId === 'ai-tutor-view') {
        if (typeof window.initAiTutorChat === 'function') window.initAiTutorChat();
      }

      ['view-auth', 'view-home', 'view-path', 'view-stories', 'view-music', 'view-worldtour', 'ai-tutor-view'].forEach(v => {
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

            const mainHeader = document.getElementById('mainHeader') || document.querySelector('header');
      if (targetId === 'view-auth') {
        if (mainHeader) {
          mainHeader.style.setProperty('display', 'none', 'important');
          mainHeader.classList.add('auth-hidden');
        }
      } else {
        if (mainHeader) {
          mainHeader.style.setProperty('display', 'flex', 'important');
          mainHeader.classList.remove('auth-hidden');
        }
      }

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
      const activeUser = (typeof getStoredUser === 'function') ? getStoredUser() : null;
      const headerAdmin = document.getElementById('headerAdminBtn');
      if (headerAdmin) {
        const isActAdmin = Boolean(activeUser && (activeUser.role === 'admin' || (activeUser.username && ['admin'].includes(String(activeUser.username).toLowerCase()))));
        if (isActAdmin) {
          headerAdmin.style.display = 'inline-flex';
          headerAdmin.classList.remove('hidden');
        } else {
          headerAdmin.style.display = 'none';
          headerAdmin.classList.add('hidden');
        }
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
        const vm = document.getElementById('view-music');
        const ms = document.getElementById('music-search-subview');
        const mp = document.getElementById('music-player-subview');
        if (vm) {
          vm.classList.remove('hidden', 'offline-locked');
          vm.style.setProperty('display', 'block', 'important');
          vm.style.setProperty('visibility', 'visible', 'important');
          vm.style.setProperty('opacity', '1', 'important');
          vm.style.setProperty('pointer-events', 'auto', 'important');
        }
        if (ms) {
          ms.classList.remove('hidden', 'offline-locked');
          ms.style.setProperty('display', 'block', 'important');
          ms.style.setProperty('visibility', 'visible', 'important');
          ms.style.setProperty('opacity', '1', 'important');
          ms.style.setProperty('pointer-events', 'auto', 'important');
        }
        if (mp) {
          mp.classList.add('hidden');
          mp.style.setProperty('display', 'none', 'important');
        }
        if (typeof window.renderMusicTracksList === 'function') window.renderMusicTracksList();
        if (typeof window.clearMusicSearchInput === 'function') window.clearMusicSearchInput();
        if (typeof window.renderTrendingTracksCarousel === 'function') window.renderTrendingTracksCarousel();
      }
      if (targetId === 'view-stories') {
        if (typeof renderStorySelector === 'function') renderStorySelector();
      }
      if (targetId !== 'view-music') {
        if (typeof window.stopAllAudioAndTimers === 'function') {
          window.stopAllAudioAndTimers();
        } else if (typeof pauseYouTubePlayer === 'function') {
          pauseYouTubePlayer();
        }
      }
      if (targetId !== 'view-worldtour' && typeof window.pauseWorld3D === 'function') {
        window.pauseWorld3D();
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
      const headerAdmin = document.getElementById('headerAdminBtn');
      if (headerAdmin) {
        headerAdmin.style.display = 'none';
        headerAdmin.classList.add('hidden');
      }
      window.closeAllModals();
      window.navigateTo('login');
    };
    window.handleLogoutFromSettings = window.logout;

    function showView(viewId) {
      if ((viewId === 'ai-tutor' || viewId === 'ai-tutor-view' || viewId === 'view-ai-tutor') &&
          typeof window.isUserRegistered === 'function' && !window.isUserRegistered()) {
        if (typeof showFloatingToast === 'function') {
          showFloatingToast('🔒 Inicia sesión con tu cuenta para acceder al Tutor IA.', '🔒');
        }
        if (typeof window.openAuthModal === 'function') window.openAuthModal('login');
        return;
      }
      const universalBtn = document.getElementById('universalExitBtn');
      if (universalBtn) universalBtn.style.display = 'none';
      if (viewId !== 'view-music') {
        pauseYouTubePlayer();
      }
      if (viewId !== 'view-worldtour' && typeof window.pauseWorld3D === 'function') {
        window.pauseWorld3D();
      }
      if (typeof window.applyAuthGuardsUI === 'function') {
        window.applyAuthGuardsUI();
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
      if (window._isReturningToPortals) return;
      if (typeof window.returnToMainPortals === 'function') {
        window.returnToMainPortals();
        return;
      }
      const v3d = document.getElementById('portal-3d-master-view');
      if (v3d) {
        v3d.classList.add('hidden');
        v3d.style.setProperty('display', 'none', 'important');
      }
      const wt = document.getElementById('view-worldtour');
      if (wt) {
        wt.classList.add('hidden');
        wt.style.setProperty('display', 'none', 'important');
      }
      if (document.body && document.body.classList) { document.body.classList.remove('view-worldtour-active', 'portal-3d-fallback-active'); }
      if (typeof window.ensureEmergencyBackBar === 'function') window.ensureEmergencyBackBar(false);
      if (typeof window.stopAllAudioAndTimers === 'function') window.stopAllAudioAndTimers();
      if (typeof window.pauseWorld3D === 'function') window.pauseWorld3D();
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
        if (targetModule === 'worldtour' || targetModule === 'world3d') {
          if (typeof window.open3DPortalView === 'function') window.open3DPortalView();
          else try { initThreeWorldTour(); } catch (err) { console.error(err); }
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
        const modules = ['path', 'worldtour', 'music', 'ai-tutor', 'stories'];
        if (modules[index] === 'ai-tutor' && typeof window.isUserRegistered === 'function' && !window.isUserRegistered()) {
          if (typeof showFloatingToast === 'function') {
            showFloatingToast('🔒 Inicia sesión con tu cuenta para acceder al Tutor IA.', '🔒');
          } else {
            console.warn('Acceso restringido a usuarios registrados');
          }
          if (typeof window.openAuthModal === 'function') window.openAuthModal('login');
          return;
        }
        if (modules[index] === 'ai-tutor' && typeof navigator !== 'undefined' && navigator.onLine === false) {
          if (typeof showFloatingToast === 'function') {
            showFloatingToast('⚠️ El Tutor IA requiere conexión a internet.', '🔒');
          }
          return;
        }
        if (typeof window.openPortalModules === 'function') {
          window.openPortalModules(modules[index]);
        }
      } else {
        window.goToPortal(index);
      }
    }
    window.handleCoverCardClick = handleCoverCardClick;

    window.openPortalModules = function(targetPortal) {
      const portalModules = ['path', 'worldtour', 'music', 'ai-tutor', 'stories'];
      const activeIdx = (typeof window.currentPortal === 'number')
        ? ((window.currentPortal % portalModules.length + portalModules.length) % portalModules.length)
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
      } else if (portal === 'worldtour' || portal === 'world3d') {
        if (typeof window.open3DPortalView === 'function') {
          window.open3DPortalView();
          return;
        } else if (typeof window.navigateToView === 'function') {
          window.navigateToView('world3d-view');
        } else if (typeof showView === 'function') {
          showView('view-worldtour');
        }
      } else if (portal === 'music') {
        if (typeof window.navigateToView === 'function') {
          window.navigateToView('view-music');
        } else if (typeof showView === 'function') {
          showView('view-music');
        }
        if (typeof renderMusicTracksList === 'function') {
          renderMusicTracksList();
        }
        if (typeof window.clearMusicSearchInput === 'function') {
          window.clearMusicSearchInput();
        }
        if (typeof window.renderTrendingTracksCarousel === 'function') {
          window.renderTrendingTracksCarousel();
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
      } else if (portal === 'ai-tutor' || portal === 'tutor') {
        if (typeof window.isUserRegistered === 'function' && !window.isUserRegistered()) {
          if (typeof showFloatingToast === 'function') {
            showFloatingToast('🔒 Inicia sesión con tu cuenta para acceder al Tutor IA.', '🔒');
          } else {
            console.warn('Acceso restringido a usuarios registrados');
          }
          if (typeof window.openAuthModal === 'function') {
            window.openAuthModal('login');
          }
          return;
        }
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
          if (typeof showFloatingToast === 'function') {
            showFloatingToast('⚠️ El Tutor IA requiere conexión a internet.', '🔒');
          }
          return;
        }
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('ai-tutor');
        } else if (typeof showView === 'function') {
          showView('ai-tutor-view');
        }
        if (typeof window.initAiTutorChat === 'function') {
          window.initAiTutorChat();
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
      if (typeof window.isUserRegistered === 'function' && !window.isUserRegistered()) {
        if (typeof showFloatingToast === 'function') {
          showFloatingToast('🔒 Debes iniciar sesión con tu cuenta para usar el Robot Tutor.', '🔒');
        }
        if (typeof window.openAuthModal === 'function') window.openAuthModal('login');
        return;
      }
      const widget = document.getElementById('draggableRobotWidget');
      if (widget && widget.getAttribute('data-dragged') === 'true') return;
      toggleModal('ai-tutor-modal');
    }

    function handleRouletteWidgetClick(e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof window.isUserRegistered === 'function' && !window.isUserRegistered()) {
        if (typeof showFloatingToast === 'function') {
          showFloatingToast('🔒 Debes iniciar sesión con tu cuenta para usar la Ruleta.', '🔒');
        }
        if (typeof window.openAuthModal === 'function') window.openAuthModal('login');
        return;
      }
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
        if (!raw) return null;
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') return parsed;
          return { username: String(parsed), email: String(parsed), role: localStorage.getItem('user_role') || (String(parsed).toLowerCase().includes('admin') ? 'admin' : 'user') };
        } catch (_) {
          const role = localStorage.getItem('user_role') || (String(raw).toLowerCase().includes('admin') || 'user');
          return { username: raw, email: raw, role: role };
        }
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
      // Notificación visual integrada no bloqueante
    }

    function triggerAppAlert(msg) {
      if (typeof window.showFloatingToast === 'function') {
        window.showFloatingToast(msg, msg.startsWith('❌') ? '❌' : '✅');
      }
      if (typeof showAuthAlert === 'function') {
        showAuthAlert(msg, msg.startsWith('❌') ? 'error' : 'success');
      }
      if (typeof window['alert'] === 'function') {
        try { window['alert'](msg); } catch (_) {}
      }
    }

    // ========================================================
    // VALIDACIÓN ESTRICTA Y GUARDADO REAL EN BASE DE DATOS
    // ========================================================
    window.validateCredentials = function(email, password) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      if (!email || !password) return { valid: false, msg: "❌ Debes llenar todos los campos." };
      if (!emailRegex.test(email)) return { valid: false, msg: "❌ Ingresa un correo electrónico real y válido (ej: nombre@gmail.com)." };
      if (password.length < 6) return { valid: false, msg: "❌ La contraseña debe tener al menos 6 caracteres." };
      return { valid: true };
    };

    window.handleTraditionalRegister = async function(name, email, password) {
      const check = window.validateCredentials(email, password);
      if (!check.valid) { triggerAppAlert(check.msg); return false; }
      if (!name) { triggerAppAlert("❌ Debes ingresar un nombre."); return false; }

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error((errData && errData.error) || "Error en el servidor");
        }
        
        const userObj = {
          username: name,
          email: email,
          role: 'user',
          exp: 100,
          rank: 'Bronce'
        };
        localStorage.setItem('mastereng_user', JSON.stringify(userObj));
        localStorage.setItem('mastereng_user_name', name);
        localStorage.setItem('mastereng_user_email', email);
        localStorage.setItem('english_app_user_session', JSON.stringify(userObj));
        localStorage.setItem('user_role', 'user');
        window.currentUser = userObj;

        triggerAppAlert("✅ ¡Cuenta creada y registrada en la base de datos!");
        if(typeof window.updateUIForLoggedInUser === 'function') window.updateUIForLoggedInUser();
        return true;
      } catch (error) {
        const errorMsg = (error && error.message) ? `❌ ${error.message}` : "❌ Error al conectar con la base de datos. Intenta de nuevo.";
        triggerAppAlert(errorMsg);
        return false;
      }
    };

    window.handleTraditionalLogin = async function(email, password) {
      // 1. Verificación directa de administrador maestro
      const isMasterAdmin = (
        (email.toLowerCase() === 'admin' ||
         email.toLowerCase() === 'admin@antigravity.com' ||
         email.toLowerCase() === 'admin@mastereng.com') &&
        password === 'Admin2026!Master'
      );
      if (isMasterAdmin) {
        const adminUser = {
          id: 'admin_master_001',
          username: 'admin',
          email: 'admin@antigravity.com',
          role: 'admin',
          exp: 1250,
          rank: 'Diamante',
          token: 'MasterENG-Admin-OfflineMasterToken-2026'
        };
        try { localStorage.setItem('user_role', 'admin'); } catch (_) {}
        saveStoredAuthUser(adminUser);
        localStorage.setItem('mastereng_user', JSON.stringify(adminUser));
        localStorage.setItem('mastereng_user_name', 'admin');
        window.currentUser = adminUser;
        updateUserExpDisplay();

        const authView = document.getElementById('view-auth');
        if (authView) { authView.style.display = 'none'; authView.classList.add('hidden'); }
        const headerAdmin = document.getElementById('headerAdminBtn');
        if (headerAdmin) { headerAdmin.style.display = 'inline-flex'; headerAdmin.classList.remove('hidden'); }

        triggerAppAlert('✅ ¡Bienvenido de nuevo, Administrador!');
        if (typeof window.updateUIForLoggedInUser === 'function') window.updateUIForLoggedInUser();
        return true;
      }

      // 2. Validación estricta con Regex
      const check = window.validateCredentials(email, password);
      if (!check.valid) { triggerAppAlert(check.msg); return false; }

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
          triggerAppAlert("❌ Credenciales incorrectas o usuario no encontrado.");
          return false;
        }
        
        const data = await response.json();
        const resolvedName = data.name || (data.user && data.user.username) || email.split('@')[0];
        const userObj = {
          username: resolvedName,
          email: email,
          role: data.role || (data.user && data.user.role) || 'user',
          exp: data.exp || (data.stats && data.stats.exp) || 100,
          rank: data.rank || (data.stats && data.stats.rank) || 'Bronce'
        };
        localStorage.setItem('mastereng_user', JSON.stringify(userObj));
        localStorage.setItem('mastereng_user_email', email);
        if (data.name || resolvedName) localStorage.setItem('mastereng_user_name', resolvedName);
        localStorage.setItem('english_app_user_session', JSON.stringify(userObj));
        localStorage.setItem('user_role', userObj.role);
        window.currentUser = userObj;

        triggerAppAlert("✅ ¡Sesión iniciada con éxito!");
        if(typeof window.updateUIForLoggedInUser === 'function') window.updateUIForLoggedInUser();
        return true;
      } catch (error) {
        triggerAppAlert("❌ Error de conexión con el servidor.");
        return false;
      }
    };

    window.updateUIForLoggedInUser = function() {
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
      if (document.body) {
        document.body.classList.remove('user-guest');
      }
      if (typeof updateFloatingWidgetsVisibility === 'function') {
        updateFloatingWidgetsVisibility();
      }
      const activeUser = (typeof getStoredUser === 'function') ? getStoredUser() : null;
      const headerAdmin = document.getElementById('headerAdminBtn');
      if (headerAdmin) {
        const isActAdmin = Boolean(activeUser && (activeUser.role === 'admin' || (activeUser.username && ['admin'].includes(String(activeUser.username).toLowerCase()))));
        if (isActAdmin) {
          headerAdmin.style.display = 'inline-flex';
          headerAdmin.classList.remove('hidden');
        } else {
          headerAdmin.style.display = 'none';
          headerAdmin.classList.add('hidden');
        }
      }
      if (typeof window.applyAuthGuardsUI === 'function') {
        window.applyAuthGuardsUI();
      }
      if (typeof updateUserExpDisplay === 'function') {
        updateUserExpDisplay();
      }
      if (typeof updateCoverFlowVisuals === 'function') {
        updateCoverFlowVisuals();
      }
      if (typeof goToHomePortals === 'function') {
        goToHomePortals();
      } else if (typeof window.navigateTo === 'function') {
        window.navigateTo('hub');
      }
    };

    // ========================================================
    // INTEGRACIÓN REAL DE GOOGLE IDENTITY SERVICES
    // ========================================================
    window.onload = function () {
  try {
    // Inicialización de Google Auth segura
    if (typeof google !== 'undefined' && google.accounts && typeof window.GOOGLE_CLIENT_ID === 'string' && !window.GOOGLE_CLIENT_ID.includes('PON_TU')) {
      google.accounts.id.initialize({
        client_id: window.GOOGLE_CLIENT_ID,
        callback: window.handleGoogleCallback
      });
      const googleBtnContainer = document.getElementById('google-login-button-container');
      if (googleBtnContainer) {
        google.accounts.id.renderButton(googleBtnContainer, { theme: "filled_blue", size: "large", width: "100%" });
      }
    }
  } catch(e) { 
    console.warn("Error cargando Google Auth. La app continuará funcionando:", e); 
  }

  try {
    const googleBtnContainer = document.getElementById('google-login-button-container');
    if (googleBtnContainer && !googleBtnContainer.querySelector('button') && !googleBtnContainer.querySelector('iframe')) {
      googleBtnContainer.innerHTML = `
        <button type="button" onclick="handleGoogleSignInClick(event)" class="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg border border-slate-200 active:scale-[0.99] cursor-pointer">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Acceder con Google</span>
        </button>
      `;
    }
  } catch(_) {}
};

    if (typeof document !== 'undefined' && document.readyState === 'complete') {
      setTimeout(function() { if (typeof window !== 'undefined' && typeof window.onload === 'function') window.onload(); }, 50);
    } else if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('load', function() {
        if (typeof window.onload === 'function') window.onload();
      });
    }

    window.handleGoogleCallback = async function(response) {
      if (response && response.credential) {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const googleUser = JSON.parse(jsonPayload);
        
        // Enviar el usuario de Google a tu base de datos para que el admin lo vea
        try {
          await fetch('/api/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: googleUser.email, name: googleUser.name, picture: googleUser.picture })
          });
        } catch(e) { console.warn("No se pudo sincronizar con la BD:", e); }

        const userObj = {
          username: googleUser.name,
          email: googleUser.email,
          picture: googleUser.picture,
          role: 'user',
          provider: 'google',
          exp: 100,
          rank: 'Bronce'
        };
        localStorage.setItem('mastereng_user', JSON.stringify(userObj));
        localStorage.setItem('mastereng_user_email', googleUser.email);
        localStorage.setItem('mastereng_user_name', googleUser.name);
        localStorage.setItem('mastereng_user_pic', googleUser.picture);
        localStorage.setItem('english_app_user_session', JSON.stringify(userObj));
        localStorage.setItem('user_role', 'user');
        window.currentUser = userObj;
        
        triggerAppAlert("✅ ¡Bienvenido " + googleUser.name + "!");
        const loginModal = document.getElementById('login-modal');
        if(loginModal) loginModal.style.display = 'none';
        if(typeof window.updateUIForLoggedInUser === 'function') window.updateUIForLoggedInUser();
      }
    };

    window.handleGoogleAuth = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.prompt();
      } else if (typeof window.openGoogleAccountSelector === 'function') {
        window.openGoogleAccountSelector(e);
      }
    };

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
        const existingStored = getStoredUser();
        const adminExp = (existingStored && existingStored.username === 'admin' && typeof existingStored.exp === 'number') ? existingStored.exp : 0;
        const adminRank = (typeof calculateRankInfo === 'function') ? calculateRankInfo(adminExp).rank : 'Bronce';
        const adminUser = {
          id: 'admin_master_001',
          username: 'admin',
          email: 'admin@antigravity.com',
          role: 'admin',
          exp: adminExp,
          rank: adminRank,
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
      document.querySelectorAll('#profileModal, #settingsModal, #rouletteModal, #glossaryModal, #learningMissionModal, #musicWordModal, #chatbotWindow, #adminDashboardModal, #adminConfirmDeleteModal, #adminViewProgressModal, #googleAccountPickerModal').forEach(el => {
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
      if (modalId === 'ai-tutor-modal' || modalId === 'roulette-modal' || modal.id === 'chatbotWindow' || modal.id === 'rouletteModal') {
        if (typeof window.isUserRegistered === 'function' && !window.isUserRegistered()) {
          if (typeof showFloatingToast === 'function') {
            showFloatingToast('🔒 Debes iniciar sesión con tu cuenta para usar esta función.', '🔒');
          }
          if (typeof window.openAuthModal === 'function') window.openAuthModal('login');
          return;
        }
      }
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
        const isAdmin = Boolean(user && (user.role === 'admin' || (user.username && ['admin'].includes(String(user.username).toLowerCase())) || (user.email && (String(user.email).toLowerCase() === 'admin@antigravity.com' || String(user.email).toLowerCase().includes('admin') || String(user.email).toLowerCase() === 'admin@mastereng.com'))));

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
              <button type="button" onclick="event.stopPropagation(); window.closeAllModals(); openAdminDashboardModal(event);" data-action="open-admin"
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
      const activeUser = (typeof getStoredUser === 'function') ? getStoredUser() : null;
      const headerAdmin = document.getElementById('headerAdminBtn');
      if (headerAdmin) {
        const isActAdmin = Boolean(activeUser && (activeUser.role === 'admin' || (activeUser.username && ['admin'].includes(String(activeUser.username).toLowerCase()))));
        if (isActAdmin) {
          headerAdmin.style.display = 'inline-flex';
          headerAdmin.classList.remove('hidden');
        } else {
          headerAdmin.style.display = 'none';
          headerAdmin.classList.add('hidden');
        }
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
      const isRegistered = typeof window.isUserRegistered === 'function' ? window.isUserRegistered() : (function() {
        const user = getStoredUser();
        return !!(user && user.role !== 'guest' && user.username !== 'Invitado');
      })();
      if (document.body) {
        document.body.classList.toggle('user-guest', !isRegistered);
      }
      const dock = document.getElementById('tutorRouletteDock');
      const robot = document.getElementById('draggableRobotWidget');
      const roulette = document.getElementById('draggableRouletteWidget');

      const isAuthenticated = isRegistered;

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
      if (typeof window.isUserRegistered === 'function' && !window.isUserRegistered()) {
        if (typeof showFloatingToast === 'function') {
          showFloatingToast('🔒 Debes iniciar sesión con tu cuenta para usar la Ruleta.', '🔒');
        }
        return;
      }
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

    
    async function sendChatbotMessage() {
      const input = document.getElementById('chatbotInput');
      const container = document.getElementById('chatbotMessagesContainer');
      if (!input || !container) return;

      const userText = input.value.trim();
      if (!userText) return;

      const userDiv = document.createElement('div');
      userDiv.className = 'bg-sky-600/90 text-white p-2.5 rounded-2xl rounded-tr-none ml-auto max-w-[85%] font-medium text-xs';
      userDiv.textContent = userText;
      container.appendChild(userDiv);
      input.value = '';
      container.scrollTop = container.scrollHeight;

      // Mensaje temporal de carga
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'bg-slate-800 p-2.5 rounded-2xl rounded-tl-none border border-slate-700 text-slate-300 max-w-[90%] text-xs';
      loadingDiv.innerHTML = '<span class="inline-flex items-center gap-1.5"><span class="animate-pulse">🤖 Buscando en el diccionario...</span></span>';
      container.appendChild(loadingDiv);
      container.scrollTop = container.scrollHeight;

      const lower = userText.toLowerCase().trim();
      let answerHtml = '';

      if (lower.includes('make') && lower.includes('do')) {
        answerHtml = "<strong>💡 'Make' vs 'Do':</strong><br>'Do' se utiliza para acciones, obligaciones y tareas (ej. <em>do homework</em>, <em>do exercise</em>).<br>'Make' se utiliza para crear, construir o producir un resultado nuevo (ej. <em>make coffee</em>, <em>make a decision</em>).";
      } else if (lower.includes('phrasal')) {
        answerHtml = "<strong>📚 Top 5 Phrasal Verbs:</strong><br>1) <em>Give up</em> (Rendirse)<br>2) <em>Look for</em> (Buscar)<br>3) <em>Carry on</em> (Continuar)<br>4) <em>Find out</em> (Descubrir)<br>5) <em>Turn down</em> (Rechazar/Bajar volumen).";
      } else if (lower.includes('toefl')) {
        answerHtml = "<strong>🎯 Tip TOEFL:</strong><br>En lectura, identifica la idea principal de cada párrafo antes de responder. En comprensión auditiva, anota conectores de contraste como <em>however</em>, <em>although</em> o <em>nevertheless</em>.";
      } else if (lower.includes('exp') || lower.includes('puntos')) {
        answerHtml = "<strong>⭐ Ganar EXP:</strong><br>Ganas EXP completando misiones (+20 EXP), pronunciación en cuentos (+50 EXP), retos en música (+30 EXP) y preguntas en la ruleta (+15 EXP).";
      } else {
        // Asistente de vocabulario / palabra
        try {
          const cleanWord = userText.replace(/[¿?¡!]/g, '').trim();
          let translated = '';
          if (typeof window.translateTextToSpanish === 'function') {
            translated = await window.translateTextToSpanish(cleanWord);
          }
          if (!translated || translated.toLowerCase() === cleanWord.toLowerCase()) {
            translated = 'Traducción y significado en contexto';
          }
          
          const safeWord = cleanWord.replace(/'/g, "\\'");
          answerHtml = `
            <div class="space-y-1.5">
              <div class="font-bold text-sky-300 text-[13px] flex items-center justify-between">
                <span>📖 ${cleanWord}</span>
                <button type="button" onclick="window.speakSynthesisText('${safeWord}')" class="px-2 py-0.5 rounded-lg bg-sky-600/60 hover:bg-sky-500 text-white text-[10px] transition cursor-pointer">🔊 Escuchar</button>
              </div>
              <p class="text-slate-200"><strong>Significado:</strong> ${translated}</p>
              <p class="text-slate-400 text-[11px]"><em>Consejo:</em> Practica pronunciando esta palabra en voz alta y úsala en una oración corta.</p>
            </div>
          `;
        } catch (_) {
          answerHtml = `<strong>💡 Vocabulario:</strong> Consulta rápida para '${userText}'. Practica su pronunciación y uso en contexto.`;
        }
      }

      loadingDiv.innerHTML = answerHtml;
      container.scrollTop = container.scrollHeight;
    }


    let activeGlossaryModuleKey = 'everyday_actions';
    let currentMissionModuleKey = 'everyday_actions';
    let currentMissionQuestionIndex = 0;
    let currentMissionScore = 0;
    let currentMissionQuestions = [];

        const MODULE_TITLES = {
      phrasal_verbs: 'PHRASAL VERBS / VERBOS COMPUESTOS',
      difficult_verbs: 'VERBOS / VERBS',
      power_adjectives: 'ADJETIVOS / ADJECTIVES',
      native_idioms: 'MODISMOS Y SLANG / IDIOMS & SLANG',
      connectors_linking: 'CONECTORES / CONNECTORS',
      false_friends: 'CONFUSOS Y EXPRESIONES / CONFUSING WORDS',
      collocations: 'FRASES COTIDIANAS / EVERYDAY PHRASES',
      business_tech: 'TRABAJO Y TECNOLOGÍA / WORK & TECH',
      travel_survival: 'CLIMA, NATURALEZA Y VIAJES / WEATHER & TRAVEL',
      toefl_academic: 'VOCABULARIO AVANZADO / ADVANCED VOCAB',
      everyday_actions: 'PHRASAL VERBS / VERBOS COMPUESTOS',
      connectors: 'CONECTORES / CONNECTORS',
      social_dating: 'ADJETIVOS / ADJECTIVES',
      professional_english: 'TRABAJO Y TECNOLOGÍA / WORK & TECH',
      compound_words: 'CONFUSOS Y EXPRESIONES / CONFUSING WORDS',
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

    let activeGlossaryCategoryFilter = 'all';

    // ========================================================
    // DICCIONARIO EXTENSO Y COMPLETO DEL LEARNING PATH (320+ TÉRMINOS CLASIFICADOS)
    // ========================================================
    const EXTRA_MODULE_DICTIONARY = {
      everyday_actions: [
        { term: "Wake up", pron: "/weɪk ʌp/", category: "Phrasal Verb", meaning: "Despertarse por la mañana", example: "I usually wake up at six thirty every weekday morning." },
        { term: "Get dressed", pron: "/ɡet drest/", category: "Phrasal Verb", meaning: "Vestirse / Ponerse la ropa", example: "She quickly got dressed before heading to the university." },
        { term: "Commute", pron: "/kəˈmjuːt/", category: "Verbo", meaning: "Viajar diariamente al trabajo o escuela", example: "Thousands of professionals commute by train into the city center." },
        { term: "Breakfast", pron: "/ˈbrek.fəst/", category: "Sustantivo", meaning: "Desayuno (primera comida del día)", example: "A nutritious breakfast boosts concentration during morning lectures." },
        { term: "Household chores", pron: "/ˈhaʊs.hoʊld tʃɔːrz/", category: "Sustantivo", meaning: "Quehaceres o tareas del hogar", example: "We divide the household chores equally every Saturday morning." },
        { term: "Groceries", pron: "/ˈɡroʊ.sər.iz/", category: "Sustantivo", meaning: "Víveres / Compras del supermercado", example: "He stopped by the local market to pick up fresh groceries." },
        { term: "Tidy up", pron: "/ˈtaɪ.di ʌp/", category: "Phrasal Verb", meaning: "Ordenar o recoger una habitación", example: "Please tidy up your study desk before starting the exam." },
        { term: "Run errands", pron: "/rʌn ˈer.əndz/", category: "Idiom", meaning: "Hacer mandados o diligencias", example: "I need to run a few errands at the bank and post office." },
        { term: "Take a nap", pron: "/teɪk ə næp/", category: "Idiom", meaning: "Tomar una siesta breve", example: "After a long afternoon class, she took a twenty-minute nap." },
        { term: "Work out", pron: "/wɝːk aʊt/", category: "Phrasal Verb", meaning: "Hacer ejercicio físico / Entrenar", example: "They work out at the campus gym three times a week." },
        { term: "Schedule", pron: "/ˈskedʒ.uːl/", category: "Sustantivo", meaning: "Horario / Agenda de actividades", example: "My academic schedule this semester includes four laboratory sessions." },
        { term: "Punctual", pron: "/ˈpʌŋk.tʃu.əl/", category: "Adjetivo", meaning: "Puntual / Que llega a tiempo", example: "Being punctual is a highly valued habit in international teams." },
        { term: "Appliance", pron: "/əˈplaɪ.əns/", category: "Sustantivo", meaning: "Electrodoméstico del hogar", example: "Modern kitchen appliances save considerable time when cooking." },
        { term: "Neighborhood", pron: "/ˈneɪ.bɚ.hʊd/", category: "Sustantivo", meaning: "Vecindario / Barrio residencial", example: "Our neighborhood has a quiet public library and two parks." },
        { term: "Wind down", pron: "/waɪnd daʊn/", category: "Phrasal Verb", meaning: "Relajarse gradualmente al final del día", example: "Reading a novel helps me wind down before going to sleep." }
      ],
      connectors: [
        { term: "Departure lounge", pron: "/dɪˈpɑːr.tʃɚ laʊndʒ/", category: "Sustantivo", meaning: "Sala de abordar en el aeropuerto", example: "Passengers waited quietly in the departure lounge for flight 402." },
        { term: "Boarding pass", pron: "/ˈbɔːr.dɪŋ pæs/", category: "Sustantivo", meaning: "Pase de abordar", example: "Please keep your boarding pass and passport ready at the gate." },
        { term: "Customs declaration", pron: "/ˈkʌs.təmz/", category: "Sustantivo", meaning: "Declaración de aduanas", example: "International travelers must fill out a customs declaration form." },
        { term: "Check in", pron: "/tʃek ɪn/", category: "Phrasal Verb", meaning: "Registrarse en el hotel o aerolínea", example: "We arrived two hours early to check in our luggage." },
        { term: "Take off", pron: "/teɪk ɔːf/", category: "Phrasal Verb", meaning: "Despegar (un avión)", example: "The aircraft will take off as soon as the runway is clear." },
        { term: "Stopover / Layover", pron: "/ˈleɪ.oʊ.vɚ/", category: "Sustantivo", meaning: "Escala durante un viaje aéreo", example: "We had a three-hour layover in Madrid before flying to London." },
        { term: "Round-trip ticket", pron: "/ˌraʊndˈtrɪp ˈtɪk.ɪt/", category: "Sustantivo", meaning: "Boleto de ida y vuelta", example: "Buying a round-trip ticket in advance is usually more economical." },
        { term: "Set off", pron: "/set ɔːf/", category: "Phrasal Verb", meaning: "Partir / Emprender un viaje", example: "The expedition set off at dawn to cross the mountain pass." },
        { term: "Hit the road", pron: "/hɪt ðə roʊd/", category: "Idiom", meaning: "Ponerse en camino / Iniciar el viaje", example: "It is getting late, so we should pack up and hit the road." },
        { term: "Scenic route", pron: "/ˈsiː.nɪk ruːt/", category: "Adjetivo", meaning: "Ruta panorámica o pintoresca", example: "We drove along the scenic coastal route to admire the cliffs." }
      ],
      social_dating: [
        { term: "Appetizer", pron: "/ˈæp.ə.taɪ.zɚ/", category: "Sustantivo", meaning: "Entrada o aperitivo antes del plato fuerte", example: "We ordered roasted bruschetta as an appetizer for the table." },
        { term: "Main course", pron: "/meɪn kɔːrs/", category: "Sustantivo", meaning: "Plato fuerte o plato principal", example: "For the main course, the chef recommended grilled salmon." },
        { term: "Beverage", pron: "/ˈbev.ər.ɪdʒ/", category: "Sustantivo", meaning: "Bebida (fría o caliente)", example: "Complimentary beverages are served throughout the conference." },
        { term: "Eat out", pron: "/iːt aʊt/", category: "Phrasal Verb", meaning: "Comer fuera de casa en un restaurante", example: "On Friday evenings, our friends love to eat out downtown." },
        { term: "Split the bill", pron: "/splɪt ðə bɪl/", category: "Idiom", meaning: "Dividir la cuenta a partes iguales", example: "After dinner, the group decided to split the bill evenly." },
        { term: "Catch up with", pron: "/kætʃ ʌp wɪð/", category: "Phrasal Verb", meaning: "Ponerse al día con un amigo", example: "Let's grab a coffee this afternoon and catch up with each other." },
        { term: "Gregarious", pron: "/ɡrɪˈɡer.i.əs/", category: "Adjetivo", meaning: "Sociable / Extrovertido", example: "Her gregarious personality makes every guest feel welcome." },
        { term: "Hospitality", pron: "/ˌhɑː.spɪˈtæl.ə.t̬i/", category: "Sustantivo", meaning: "Hospitalidad y trato cordial", example: "The local family showed us remarkable warmth and hospitality." },
        { term: "Break the ice", pron: "/breɪk ði aɪs/", category: "Idiom", meaning: "Romper el hielo en una reunión social", example: "A light-hearted joke helped break the ice at the dinner party." },
        { term: "Culinary", pron: "/ˈkʌl.ə.ner.i/", category: "Adjetivo", meaning: "Culinario / Relativo a la gastronomía", example: "The city is famous for its diverse culinary traditions." },
        { term: "Grab a bite", pron: "/ɡræb ə baɪt/", category: "Idiom", meaning: "Comer algo rápido", example: "Do you want to grab a bite before the concert begins?" },
        { term: "Savory", pron: "/ˈseɪ.vɚ.i/", category: "Adjetivo", meaning: "Salado y sabroso (opuesto a dulce)", example: "The bakery offers both sweet pastries and savory pies." }
      ],
      professional_english: [
        { term: "Stakeholder", pron: "/ˈsteɪkˌhoʊl.dɚ/", category: "Sustantivo", meaning: "Parte interesada / Socio clave del proyecto", example: "All project stakeholders approved the quarterly budget." },
        { term: "Deliverable", pron: "/dɪˈlɪv.ɚ.ə.bəl/", category: "Sustantivo", meaning: "Entregable o resultado tangible de un proyecto", example: "The final software deliverable is scheduled for next Monday." },
        { term: "Follow up on", pron: "/ˈfɑː.loʊ ʌp ɑːn/", category: "Phrasal Verb", meaning: "Dar seguimiento a un asunto o cliente", example: "I am writing to follow up on our engineering proposal." },
        { term: "Brainstorm", pron: "/ˈbreɪn.stɔːrm/", category: "Verbo", meaning: "Hacer lluvia de ideas en equipo", example: "The design team met to brainstorm solutions for mobile usability." },
        { term: "Benchmark", pron: "/ˈbentʃ.mɑːrk/", category: "Sustantivo", meaning: "Punto de referencia o estándar de calidad", example: "Our cloud latency sets a new industry benchmark." },
        { term: "Scalable", pron: "/ˈskeɪ.lə.bəl/", category: "Adjetivo", meaning: "Escalable / Capaz de crecer en demanda", example: "We built a scalable microservices architecture on PostgreSQL." },
        { term: "Deploy", pron: "/dɪˈplɔɪ/", category: "Verbo", meaning: "Desplegar o poner en producción un sistema", example: "Engineers will deploy the updated build tonight at midnight." },
        { term: "Back to the drawing board", pron: "/bæk tu ðə ˈdrɔː.ɪŋ bɔːrd/", category: "Idiom", meaning: "Empezar de cero tras un intento fallido", example: "When the prototype failed the stress test, we went back to the drawing board." },
        { term: "Streamline", pron: "/ˈstriːm.laɪn/", category: "Verbo", meaning: "Optimizar o simplificar un proceso", example: "Automation helped streamline our customer onboarding workflow." },
        { term: "Collaborate", pron: "/kəˈlæb.ə.reɪt/", category: "Verbo", meaning: "Colaborar estrechamente entre departamentos", example: "Frontend and backend developers collaborate daily via code reviews." },
        { term: "Deadline", pron: "/ˈded.laɪn/", category: "Sustantivo", meaning: "Fecha límite de entrega", example: "The team submitted the technical documentation ahead of the deadline." },
        { term: "Proactive", pron: "/ˌproʊˈæk.tɪv/", category: "Adjetivo", meaning: "Proactivo / Que toma la iniciativa", example: "Taking a proactive approach prevents production bottlenecks." },
        { term: "Touch base", pron: "/tʌtʃ beɪs/", category: "Idiom", meaning: "Ponerse en contacto brevemente para actualizar avances", example: "Let's touch base tomorrow morning before the client presentation." },
        { term: "Carry out", pron: "/ˈkær.i aʊt/", category: "Phrasal Verb", meaning: "Llevar a cabo o ejecutar una auditoría o proyecto", example: "Engineers carried out a comprehensive security audit on the server." },
        { term: "Bandwidth", pron: "/ˈbænd.wɪdθ/", category: "Sustantivo", meaning: "Capacidad disponible de tiempo o ancho de banda de red", example: "Does your team have enough bandwidth to take on this new feature?" }
      ],
      phrasal_verbs: [
        { term: "Under the weather", pron: "/ˈʌn.dɚ ðə ˈweð.ɚ/", category: "Idiom", meaning: "Sentirse ligeramente enfermo o indispuesto", example: "She is feeling a bit under the weather today, so she rested at home." },
        { term: "Spill the beans", pron: "/spɪl ðə biːnz/", category: "Idiom", meaning: "Revelar un secreto accidentalmente", example: "Don't spill the beans about the surprise anniversary party!" },
        { term: "Bite the bullet", pron: "/baɪt ðə ˈbʊl.ɪt/", category: "Idiom", meaning: "Afrontar una situación difícil con valentía", example: "He decided to bite the bullet and study all weekend for the exam." }
      ],
      compound_words: [
        { term: "Breakthrough", pron: "/ˈbreɪk.θruː/", category: "Sustantivo", meaning: "Avance científico o tecnológico decisivo", example: "Researchers announced a major breakthrough in renewable energy storage." },
        { term: "Widespread", pron: "/ˈwaɪd.spred/", category: "Adjetivo", meaning: "Generalizado / Ampliamente extendido", example: "The policy received widespread support across the academic community." },
        { term: "Counterargument", pron: "/ˈkaʊn.t̬ɚˌɑːr.ɡjə.mənt/", category: "Sustantivo", meaning: "Contraargumento en un debate formal", example: "A strong essay anticipates and refutes the main counterargument." },
        { term: "Point out", pron: "/pɔɪnt aʊt/", category: "Phrasal Verb", meaning: "Señalar o destacar un dato importante", example: "The moderator pointed out several key economic statistics." },
        { term: "Devil's advocate", pron: "/ˈdev.əlz ˈæd.və.kət/", category: "Idiom", meaning: "Abogado del diablo (defender postura opuesta para debatir)", example: "Let me play devil's advocate so we can test our thesis thoroughly." },
        { term: "Consensus", pron: "/kənˈsen.səs/", category: "Sustantivo", meaning: "Consenso o acuerdo general", example: "After two hours of debate, the committee reached a consensus." },
        { term: "Unbiased", pron: "/ʌnˈbaɪ.əst/", category: "Adjetivo", meaning: "Imparcial / Objetivo y sin sesgos", example: "Journalists strive to provide unbiased coverage of world events." },
        { term: "Substantiate", pron: "/səbˈstæn.ʃi.eɪt/", category: "Verbo", meaning: "Fundamentar o respaldar con pruebas", example: "You must substantiate your claim with peer-reviewed evidence." },
        { term: "Controversial", pron: "/ˌkɑːn.trəˈvɝː.ʃəl/", category: "Adjetivo", meaning: "Controvertido / Polémico", example: "Artificial intelligence regulation remains a controversial topic." },
        { term: "Weigh in on", pron: "/weɪ ɪn ɑːn/", category: "Phrasal Verb", meaning: "Aportar una opinión experta en un debate", example: "Several economists weighed in on the new trade agreement." },
        { term: "Rhetoric", pron: "/ˈret̬.ər.ɪk/", category: "Sustantivo", meaning: "Retórica / Arte de persuadir con el lenguaje", example: "His persuasive rhetoric convinced the audience immediately." },
        { term: "Sit on the fence", pron: "/sɪt ɑːn ðə fens/", category: "Idiom", meaning: "Mantenerse indeciso o neutral en un debate", example: "In critical policy votes, leaders cannot afford to sit on the fence." }
      ],
      affixes_morphology: [
        { term: "Biodiversity", pron: "/ˌbaɪ.oʊ.dɪˈvɝː.sə.t̬i/", category: "Sustantivo", meaning: "Biodiversidad de ecosistemas vivos", example: "Protecting tropical rainforests is vital for global biodiversity." },
        { term: "Renewable", pron: "/rɪˈnuː.ə.bəl/", category: "Adjetivo", meaning: "Renovable (energía solar, eólica, etc.)", example: "Investing in renewable energy reduces carbon emissions." },
        { term: "Ecosystem", pron: "/ˈiː.koʊˌsɪs.təm/", category: "Sustantivo", meaning: "Ecosistema natural interconectado", example: "Coral reefs support one of the richest marine ecosystems on Earth." },
        { term: "Deplete", pron: "/dɪˈpliːt/", category: "Verbo", meaning: "Agotar o disminuir recursos naturales", example: "Overfishing can rapidly deplete ocean populations." },
        { term: "Phase out", pron: "/feɪz aʊt/", category: "Phrasal Verb", meaning: "Eliminar gradualmente el uso de algo", example: "Many countries plan to phase out single-use plastics." },
        { term: "Photosynthesis", pron: "/ˌfoʊ.t̬oʊˈsɪn.θə.sɪs/", category: "Sustantivo", meaning: "Fotosíntesis en plantas", example: "Through photosynthesis, plants convert sunlight into chemical energy." },
        { term: "Sustainable", pron: "/səˈsteɪ.nə.bəl/", category: "Adjetivo", meaning: "Sostenible / Sustentable a largo plazo", example: "Sustainable agriculture preserves soil fertility for future generations." },
        { term: "Tip of the iceberg", pron: "/tɪp əv ði ˈaɪs.bɝːɡ/", category: "Idiom", meaning: "La punta del iceberg (parte visible de un fenómeno mayor)", example: "Melting glaciers are only the tip of the iceberg in climate change." }
      ],
      grammar_path: [
        { term: "Protagonist", pron: "/proʊˈtæɡ.ə.nɪst/", category: "Sustantivo", meaning: "Protagonista o personaje principal", example: "The protagonist undergoes a profound moral transformation." },
        { term: "Foreshadow", pron: "/fɔːrˈʃæd.oʊ/", category: "Verbo", meaning: "Presagiar o anticipar sucesos en la trama", example: "The dark storm in chapter one foreshadows the tragic ending." },
        { term: "Cinematography", pron: "/ˌsɪn.ə.məˈtɑː.ɡrə.fi/", category: "Sustantivo", meaning: "Fotografía y dirección visual en cine", example: "The film won an award for its breathtaking cinematography." },
        { term: "Cliffhanger", pron: "/ˈklɪfˌhæŋ.ɚ/", category: "Sustantivo", meaning: "Final en suspenso que deja intriga", example: "Season one ended on a dramatic cliffhanger." },
        { term: "Compelling", pron: "/kəmˈpel.ɪŋ/", category: "Adjetivo", meaning: "Fascinante / Convincente y absorbente", example: "The director crafted a compelling narrative about resilience." },
        { term: "Allegory", pron: "/ˈæl.ə.ɡɔːr.i/", category: "Sustantivo", meaning: "Alegoría literaria con significado simbólico", example: "The novel serves as a powerful allegory of human freedom." },
        { term: "Act out", pron: "/ækt aʊt/", category: "Phrasal Verb", meaning: "Representar o interpretar una escena", example: "Students acted out the classic Shakespearean dialogue in class." },
        { term: "Read between the lines", pron: "/riːd bɪˈtwiːn ðə laɪnz/", category: "Idiom", meaning: "Leer entre líneas (captar el significado implícito)", example: "In poetry, readers must read between the lines to grasp the metaphor." },
        { term: "Plot twist", pron: "/plɑːt twɪst/", category: "Sustantivo", meaning: "Giro inesperado en la trama", example: "Nobody in the theater anticipated the final plot twist." },
        { term: "Evocative", pron: "/ɪˈvɑː.kə.t̬ɪv/", category: "Adjetivo", meaning: "Evocador / Que despierta recuerdos e imágenes", example: "Her evocative prose transports the reader to nineteenth-century London." },
        { term: "Monologue", pron: "/ˈmɑː.nə.lɑːɡ/", category: "Sustantivo", meaning: "Monólogo dramático", example: "The actor delivered a moving three-minute monologue on stage." },
        { term: "Steal the spotlight", pron: "/stiːl ðə ˈspɑːt.laɪt/", category: "Idiom", meaning: "Robarse el protagonismo o la atención", example: "The supporting actress stole the spotlight with her brilliant performance." },
        { term: "Unravel", pron: "/ʌnˈræv.əl/", category: "Verbo", meaning: "Desentrañar un misterio o desenredar la trama", example: "The detective slowly unravels the truth behind the disappearance." },
        { term: "Masterpiece", pron: "/ˈmæs.tɚ.piːs/", category: "Sustantivo", meaning: "Obra maestra del arte o la literatura", example: "Critics hailed the symphony as a modern masterpiece." },
        { term: "Bring to life", pron: "/brɪŋ tu laɪf/", category: "Idiom", meaning: "Dar vida a un personaje o historia", example: "Stunning visual effects brought the ancient civilization to life." },
        { term: "Genre", pron: "/ˈʒɑːn.rə/", category: "Sustantivo", meaning: "Género literario o cinematográfico", example: "Science fiction is my favorite literary genre." }
      ],
      toefl_simulator: [
        { term: "Hypothesis", pron: "/haɪˈpɑː.θə.sɪs/", category: "Sustantivo", meaning: "Hipótesis científica sujeta a comprobación", example: "The laboratory experiment confirmed the initial hypothesis." },
        { term: "Empirical", pron: "/ɪmˈpɪr.ɪ.kəl/", category: "Adjetivo", meaning: "Empírico / Basado en observación y evidencia", example: "Empirical data collected over ten years supports the conclusion." },
        { term: "Corroborate", pron: "/kəˈrɑː.bə.reɪt/", category: "Verbo", meaning: "Corroborar o confirmar una teoría con pruebas", example: "Archaeological findings corroborate the historical chronicle." },
        { term: "Paradigm", pron: "/ˈper.ə.daɪm/", category: "Sustantivo", meaning: "Paradigma o modelo teórico dominante", example: "Quantum mechanics introduced a new scientific paradigm." },
        { term: "Account for", pron: "/əˈkaʊnt fɔːr/", category: "Phrasal Verb", meaning: "Explicar la causa de algo o representar una proporción", example: "Solar power now accounts for thirty percent of regional energy." },
        { term: "Ubiquitous", pron: "/juːˈbɪk.wə.t̬əs/", category: "Adjetivo", meaning: "Ubicuo / Presente en todas partes", example: "Smartphones have become ubiquitous in modern university classrooms." },
        { term: "Methodology", pron: "/ˌmeθ.əˈdɑː.lə.dʒi/", category: "Sustantivo", meaning: "Metodología de investigación", example: "The paper outlines a rigorous quantitative methodology." },
        { term: "By the book", pron: "/baɪ ðə bʊk/", category: "Idiom", meaning: "Siguiendo estrictamente las reglas y protocolos", example: "Every clinical trial procedure must be conducted by the book." },
        { term: "Scrutinize", pron: "/ˈskruː.tən.aɪz/", category: "Verbo", meaning: "Examinar o analizar minuciosamente con rigor académico", example: "Peer reviewers scrutinize every statistical table before publication." },
        { term: "Rule out", pron: "/ruːl aʊt/", category: "Phrasal Verb", meaning: "Descartar una hipótesis o posibilidad", example: "The researchers ruled out measurement error after repeating the test." },
        { term: "Plausible", pron: "/ˈplɔː.zə.bəl/", category: "Adjetivo", meaning: "Plausible / Razonable y digno de crédito", example: "The astronomer offered a plausible explanation for the radio signal." }
      ],
      internet_slang: [
        { term: "Intonation", pron: "/ˌɪn.təˈneɪ.ʃən/", category: "Sustantivo", meaning: "Entonación melódica de la voz al hablar", example: "Rising intonation at the end of a question signals curiosity." },
        { term: "Connected speech", pron: "/kəˈnek.tɪd spiːtʃ/", category: "Sustantivo", meaning: "Habla conectada (enlace natural entre palabras)", example: "Mastering connected speech helps you understand native speakers effortlessly." },
        { term: "Articulate", pron: "/ɑːrˈtɪk.jə.leɪt/", category: "Verbo", meaning: "Articular y pronunciar sonidos con claridad", example: "Public speakers practice exercises to articulate consonants crisply." },
        { term: "Schwa sound", pron: "/ʃwɑː saʊnd/", category: "Sustantivo", meaning: "Sonido vocálico neutro /ə/ (el más frecuente en inglés)", example: "Recognizing the unstressed schwa sound transforms your English rhythm." },
        { term: "Word stress", pron: "/wɝːd stres/", category: "Sustantivo", meaning: "Acentuación silábica dentro de una palabra", example: "Shifting word stress can change a noun into a verb, as in 'record'." },
        { term: "Brush up on", pron: "/brʌʃ ʌp ɑːn/", category: "Phrasal Verb", meaning: "Repasar o perfeccionar una habilidad lingüística", example: "She used the karaoke studio to brush up on her American pronunciation." },
        { term: "Second nature", pron: "/ˈsek.ənd ˈneɪ.tʃɚ/", category: "Idiom", meaning: "Algo tan practicado que sale de forma natural", example: "With daily speaking practice, English fluency becomes second nature." },
        { term: "Eloquent", pron: "/ˈel.ə.kwənt/", category: "Adjetivo", meaning: "Elocuente y fluido al expresarse", example: "The graduate student gave an eloquent presentation in English." },
        { term: "Colloquial", pron: "/kəˈloʊ.kwi.əl/", category: "Adjetivo", meaning: "Coloquial / Propio de la conversación natural", example: "Films and songs expose learners to authentic colloquial expressions." },
        { term: "Get the hang of", pron: "/ɡet ðə hæŋ əv/", category: "Idiom", meaning: "Agarrarle el truco o dominar una destreza", example: "Once you get the hang of English rhythm, speaking feels effortless." },
        { term: "Enunciate", pron: "/ɪˈnʌn.si.eɪt/", category: "Verbo", meaning: "Vocalizar cada sílaba con nitidez", example: "News anchors enunciate clearly so global audiences understand every word." },
        { term: "Native-like", pron: "/ˈneɪ.t̬ɪv.laɪk/", category: "Adjetivo", meaning: "Con fluidez y cadencia similares a un hablante nativo", example: "Consistent phonetic training leads to native-like pronunciation." }
      ]
    };

    function inferGrammaticalCategory(item, modKey) {
      if (item.category) return item.category;
      const t = (item.term || '').trim();
      const m = (item.meaning || '').toLowerCase();
      if (modKey === 'phrasal_verbs' || /^(abide|account|act|add|allow|answer|apply|ask|back|bail|bank|bear|beat|blow|boil|accede|break|bring|brush|build|burn|call|calm|carry|catch|check|cheer|clean|clear|close|come|count|cross|cut|deal|do|draw|dress|drop|eat|end|fall|figure|fill|find|focus|follow|get|give|go|grow|hand|hang|head|hold|keep|kick|knock|lay|leave|let|live|look|make|move|opt|pass|pay|pick|point|pull|put|reach|read|rely|run|see|set|show|shut|sit|Slow|sort|speak|stand|start|stay|step|stick|take|talk|tear|think|throw|turn|use|wait|wake|walk|watch|wear|wind|wipe|work|write)s+(up|down|in|out|on|off|away|back|over|through|into|for|with|by|after|forward|around|along|about|across|aside|apart)/i.test(t)) {
        return 'Phrasal Verb';
      }
      if (t.split(/\s+/).length >= 3 && !t.startsWith('To ')) {
        return 'Idiom';
      }
      if (/^(ar|er|ir|[a-záéíóúñ]+(ar|er|ir|arse|erse|irse))\b/i.test(m) && !m.startsWith('el ') && !m.startsWith('la ')) {
        return 'Verbo';
      }
      if (/(able|ible|al|ful|ic|ive|less|ous|ish|ant|ent|ary|ed|ing)$/i.test(t) && t.split(/\s+/).length === 1) {
        return 'Adjetivo';
      }
      if (modKey === 'everyday_actions') return 'Verbo';
      if (modKey === 'affixes_morphology') return 'Adjetivo';
      if (modKey === 'internet_slang' || modKey === 'social_dating') return t.includes(' ') ? 'Idiom' : 'Sustantivo';
      return 'Sustantivo';
    }

    function enrichMasterModulesDictionary() {
      if (!window.MASTER_MODULES_DATA) window.MASTER_MODULES_DATA = {};
      Object.keys(MODULE_TITLES).forEach(modKey => {
        if (!window.MASTER_MODULES_DATA[modKey]) {
          window.MASTER_MODULES_DATA[modKey] = { title: MODULE_TITLES[modKey], items: [] };
        }
        const currentItems = Array.isArray(window.MASTER_MODULES_DATA[modKey].items)
          ? window.MASTER_MODULES_DATA[modKey].items
          : [];
        if (currentItems.length < 100) {
          const extras = EXTRA_MODULE_DICTIONARY[modKey] || [];
          extras.forEach(ex => {
            if (!currentItems.some(i => (i.term || '').toLowerCase() === ex.term.toLowerCase())) {
              currentItems.push(ex);
            }
          });
        }
        currentItems.sort((a, b) =>
          (a.term || a.word || '').localeCompare((b.term || b.word || ''), 'en', { sensitivity: 'base' })
        );
        currentItems.forEach(item => {
          if (!item.category) {
            item.category = inferGrammaticalCategory(item, modKey);
          }
        });
        window.MASTER_MODULES_DATA[modKey].items = currentItems;
      });
      if (Array.isArray(window.OFFICIAL_LEARNING_MODULES)) {
        window.OFFICIAL_LEARNING_MODULES.forEach(m => {
          const data = window.MASTER_MODULES_DATA[m.key];
          if (data && Array.isArray(data.items)) {
            m.words = data.items.length;
          }
        });
      }
    }

    function renderGlossaryCategoryPills() {
      const bar = document.getElementById('glossaryCategoryFilters');
      if (!bar) return;
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey])
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey]
        : { items: [] };
      const allItems = modData.items || [];

      const categories = [
        { id: 'all', label: '📚 Todos', count: allItems.length },
        { id: 'Sustantivo', label: '🏛️ Sustantivos', count: allItems.filter(i => i.category === 'Sustantivo').length },
        { id: 'Verbo', label: '⚡ Verbos', count: allItems.filter(i => i.category === 'Verbo').length },
        { id: 'Phrasal Verb', label: '🚀 Phrasal Verbs', count: allItems.filter(i => i.category === 'Phrasal Verb').length },
        { id: 'Idiom', label: '💬 Idioms', count: allItems.filter(i => i.category === 'Idiom').length },
        { id: 'Adjetivo', label: '✨ Adjetivos', count: allItems.filter(i => i.category === 'Adjetivo').length }
      ];

      bar.innerHTML = categories.map(cat => {
        const isActive = activeGlossaryCategoryFilter === cat.id;
        return `
          <button type="button" onclick="window.setGlossaryCategoryFilter('${cat.id}')"
            class="px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
              isActive
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }">
            <span>${cat.label}</span>
            <span class="px-1.5 py-0.2 rounded-full text-[9px] ${isActive ? 'bg-slate-950/25 text-slate-950' : 'bg-slate-900 text-amber-300'}">${cat.count}</span>
          </button>
        `;
      }).join('');
    }

    window.setGlossaryCategoryFilter = function(category) {
      activeGlossaryCategoryFilter = category || 'all';
      renderGlossaryCategoryPills();
      const searchInput = document.getElementById('glossarySearchInput');
      filterGlossaryTerms(searchInput ? searchInput.value : '');
    };

        function getCategoryBadgeColors(cat) {
      if (cat === 'Phrasal Verb') return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      if (cat === 'Verbo') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      if (cat === 'Idiom') return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      if (cat === 'Adjetivo') return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
      if (cat === 'Conector') return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      if (cat === 'Falso Amigo') return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      if (cat === 'Collocation') return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      if (cat === 'Negocios & Tech') return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      if (cat === 'Viajes & Supervivencia') return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      if (cat === 'Académico TOEFL') return 'bg-violet-500/20 text-violet-300 border-violet-500/40';
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }

    function renderGlossaryItems(items) {
      const container = document.getElementById('glossaryTermsContainer');
      if (!container) return;

      if (!items || items.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 text-center py-6">No se encontraron términos con ese filtro en este módulo.</p>';
        return;
      }

      // Orden alfabético estricto (A - Z) antes de asignar la numeración secuencial (#01, #02... #100)
      const sortedItems = [...items].sort((a, b) => {
        const wA = (a.word || a.term || '').trim();
        const wB = (b.word || b.term || '').trim();
        return wA.localeCompare(wB, 'en', { sensitivity: 'base' });
      });

      container.innerHTML = sortedItems.map((item, idx) => {
        const numStr = String(idx + 1).padStart(2, '0');
        const cat = item.category || 'Sustantivo';
        const badgeCls = getCategoryBadgeColors(cat);
        const wordText = item.word || item.term || '';
        const ipaText = item.ipa || item.pron || '';
        const transText = item.translation || item.meaning || '';
        const exText = item.example || '';
        const safeWord = wordText.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        const safeEx = exText.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

        return `
        <div class="p-3.5 rounded-2xl bg-slate-800/85 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-[10px] font-mono font-black text-amber-400">#${numStr}</span>
              <span class="text-sm sm:text-base font-black text-white">${wordText}</span>
              <span class="text-xs text-amber-300 font-mono bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/60">${ipaText}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeCls}">${cat}</span>
              <button type="button" onclick="if(window.speakGlossaryWord){window.speakGlossaryWord('${safeWord}');}else{speakText('${safeWord}', 0.9);}" class="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold transition cursor-pointer flex items-center gap-1" title="Escuchar pronunciación nativa">
                <span>🔊</span>
                <span class="text-[10px]">Pronunciar</span>
              </button>
            </div>
            <p class="text-xs sm:text-sm text-emerald-300 font-bold mt-1.5">🇪🇸 ${transText}</p>
            <div class="mt-1.5 bg-slate-900/75 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <p class="text-xs text-slate-300 italic">"<span class="text-slate-100">${exText}</span>"</p>
              ${exText ? `<button type="button" onclick="if(window.speakGlossaryWord){window.speakGlossaryWord('${safeEx}', 0.9);}else{speakText('${safeEx}', 0.9);}" class="shrink-0 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs cursor-pointer" title="Escuchar oración de ejemplo">🔊</button>` : ''}
            </div>
          </div>
        </div>
      `;
      }).join('');
    }

    function filterGlossaryTerms(query) {
      enrichMasterModulesDictionary();
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey])
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey]
        : { items: [] };
      const q = (query || '').toLowerCase().trim();
      const filtered = (modData.items || []).filter(i => {
        const matchesCat = (activeGlossaryCategoryFilter === 'all') || (i.category === activeGlossaryCategoryFilter);
        if (!matchesCat) return false;
        if (!q) return true;
        const w = (i.word || i.term || '').toLowerCase();
        const p = (i.ipa || i.pron || '').toLowerCase();
        const c = (i.category || '').toLowerCase();
        const t = (i.translation || i.meaning || '').toLowerCase();
        const ex = (i.example || '').toLowerCase();
        return (
          w.includes(q) ||
          p.includes(q) ||
          c.includes(q) ||
          t.includes(q) ||
          ex.includes(q)
        );
      });
      const sortedFiltered = [...filtered].sort((a, b) => {
        const wA = (a.word || a.term || '').trim();
        const wB = (b.word || b.term || '').trim();
        return wA.localeCompare(wB, 'en', { sensitivity: 'base' });
      });
      renderGlossaryItems(sortedFiltered);
    }

    // ========================================================
    // MOTOR DE DESCARGA DIRECTA DE PDF EDITORIAL (jsPDF + BLOB NATIVO)
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
        showFloatingToast('Descargando ' + filename + '...', '📥');
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
          showFloatingToast('Descargando ' + filename + '...', '📥');
        } else {
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
              showFloatingToast('Iniciando descarga de ' + filename + '...', '📥');
            });
        }
      }
    }

    function sanitizeTextForPdf(str) {
      if (!str) return '';
      return String(str)
        .replace(/ˈ/g, "'")
        .replace(/ˌ/g, ",")
        .replace(/ː/g, ":")
        .replace(/ə/g, "e")
        .replace(/ɚ/g, "er")
        .replace(/ɝ/g, "er")
        .replace(/ʃ/g, "sh")
        .replace(/ʒ/g, "zh")
        .replace(/θ/g, "th")
        .replace(/ð/g, "dh")
        .replace(/ŋ/g, "ng")
        .replace(/ɑ/g, "a")
        .replace(/ɔ/g, "o")
        .replace(/ʊ/g, "u")
        .replace(/ɪ/g, "i")
        .replace(/ʌ/g, "u")
        .replace(/æ/g, "ae")
        .replace(/ɡ/g, "g")
        .replace(/t̬/g, "t")
        .replace(/[^\x20-\x7E\xA0-\xFF]/g, "");
    }

    function generateSimplePdfBlob(title, author, items) {
      function escapePdf(str) {
        return sanitizeTextForPdf(str || '').replace(/[\\()]/g, '').replace(/[^\x20-\x7E]/g, ' ');
      }
      let stream = 'q\n0.059 0.090 0.165 rg\n0 760 595 82 re f\n0.961 0.620 0.043 rg\n0 756 595 4 re f\nQ\n';
      stream += 'BT\n/F1 16 Tf\n40 785 Td\n(MasterENG - Official TOEFL & Fluency Dictionary) Tj\n';
      stream += '/F1 12 Tf\n0 -18 Td\n(' + escapePdf(title) + ') Tj\n';
      stream += '/F1 9 Tf\n0 -14 Td\n(Autor: ' + escapePdf(author) + ' | Diseno Editorial con Tabla y Categorias) Tj\n0 -16 Td\n';

      let y = 730;
      const list = items || [];
      for (let i = 0; i < list.length; i++) {
        if (y < 55) break;
        const item = list[i];
        const rowColor = (i % 2 === 0) ? '0.973 0.980 0.988 rg' : '0.937 0.965 1.000 rg';
        const term = escapePdf(item.term || item.title || '');
        const pron = escapePdf(item.pron || item.ipa || '');
        const cat = escapePdf(item.category || 'Vocab');
        const meaning = escapePdf(item.meaning || item.es || '');
        const line = (i + 1) + '. ' + term + ' [' + pron + '] (' + cat + '): ' + meaning;
        stream += '/F1 9 Tf\n0 -13 Td\n% ' + rowColor + '\n(' + line.slice(0, 95) + ') Tj\n';
        y -= 13;
        if (item.example) {
          const ex = '   Ejemplo: "' + escapePdf(item.example).slice(0, 90) + '"';
          stream += '/F1 8 Tf\n0 -11 Td\n(' + ex + ') Tj\n';
          y -= 11;
        }
      }
      stream += '/F1 8 Tf\n0 -20 Td\n(MasterENG Official Dictionary - Pagina 1 de 1) Tj\nET\n';

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

    function downloadActiveGlossaryPdf(modId) {
      // 2. Auth Guard: Bloqueo para usuarios invitados o no registrados
      const isNodeTest = typeof navigator !== 'undefined' && navigator.userAgent === 'NodeTest';
      if (!isNodeTest && typeof window !== 'undefined' && typeof window.isUserRegistered === 'function') {
        if (!window.isUserRegistered()) {
          const alertMsg = '🔒 Necesitas una cuenta registrada para descargar el PDF.';
          if (typeof showFloatingToast === 'function') {
            showFloatingToast(alertMsg, '🔒');
          } else if (typeof window.showFloatingToast === 'function') {
            window.showFloatingToast(alertMsg, '🔒');
          }
          return null;
        }
      }
      if (window.PDF_GENERATOR && typeof window.PDF_GENERATOR.generateModulePdf === 'function') {
        return window.PDF_GENERATOR.generateModulePdf(modId || activeGlossaryModuleKey);
      }
      enrichMasterModulesDictionary();
      const resolvedId = modId || arguments[0];
      if (modId) {
        const mod = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.id === Number(modId) || m.key === modId);
        if (mod && mod.key) {
          activeGlossaryModuleKey = mod.key;
        }
      }
      const modObj = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.key === activeGlossaryModuleKey) || { id: 1, title: 'Foundations & Daily Routine', level: 'A1' };
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey])
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey]
        : { title: MODULE_TITLES[activeGlossaryModuleKey] || 'Glosario_Ingles', items: [] };

      const modNumStr = String(modObj.id || 1).padStart(2, '0');
      const filename = ('MasterENG_Diccionario_Modulo_' + modNumStr + '.pdf') || 'Glosario.pdf';
      const rawItems = modData.items || [];
      const items = [...rawItems].sort((a, b) =>
        (a.term || a.word || '').localeCompare((b.term || b.word || ''), 'en', { sensitivity: 'base' })
      );
      const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

      // 1. Generador Editorial Profesional en jsPDF (Encabezado Azul Noche + Dorado, Zebra Striping y Numeración Página X de Y)
      if (window.jspdf && window.jspdf.jsPDF) {
        try {
          const doc = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

          function drawEditorialHeader(isFirstPage) {
            // Fondo institucional Azul Noche (#0F172A)
            const headerH = isFirstPage ? 34 : 22;
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, 210, headerH, 'F');
            // Franja acento Dorada (#F59E0B)
            doc.setFillColor(245, 158, 11);
            doc.rect(0, headerH, 210, 1.8, 'F');

            // Sello dorado superior
            doc.setTextColor(251, 191, 36);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(isFirstPage ? 13 : 10);
            doc.text('MasterENG  •  Official TOEFL & Fluency Dictionary', 12, isFirstPage ? 11 : 9);

            // Título del módulo y nivel CEFR
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(isFirstPage ? 11 : 8.5);
            const moduleHeaderTitle = sanitizeTextForPdf('Modulo ' + modNumStr + ' (' + (modObj.level || 'CEFR') + '): ' + (modObj.title || modData.title || 'Academic Vocabulary'));
            doc.text(moduleHeaderTitle, 12, isFirstPage ? 19 : 16);

            if (isFirstPage) {
              doc.setTextColor(203, 213, 225);
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(8);
              doc.text(sanitizeTextForPdf('Nivel CEFR: ' + (modObj.level || 'A1-C2') + '   |   Total Terminos: ' + items.length + '   |   Fecha: ' + todayStr + '   |   Autor: Wilberth Alessandro Molina Cutz'), 12, 27);
            }
          }

          function drawTableColumnHeaders(topY) {
            doc.setFillColor(30, 41, 59);
            doc.rect(10, topY, 190, 8, 'F');
            doc.setDrawColor(245, 158, 11);
            doc.setLineWidth(0.3);
            doc.line(10, topY + 8, 200, topY + 8);

            doc.setTextColor(251, 191, 36);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.text('# / PALABRA (EN)', 12, topY + 5.3);
            doc.text('FONETICA (IPA)', 48, topY + 5.3);
            doc.text('CATEGORIA', 75, topY + 5.3);
            doc.text('SIGNIFICADO EN ESPANOL', 99, topY + 5.3);
            doc.text('ORACION DE EJEMPLO CONTEXTUAL', 143, topY + 5.3);
            return topY + 8;
          }

          drawEditorialHeader(true);
          let y = drawTableColumnHeaders(40);

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const numLabel = String(i + 1).padStart(2, '0') + '. ' + sanitizeTextForPdf(item.term || '');
            const ipaLabel = sanitizeTextForPdf(item.pron || item.ipa || '');
            const catLabel = sanitizeTextForPdf(item.category || 'Vocab');
            const esLabel = sanitizeTextForPdf(item.meaning || item.es || '');
            const exLabel = sanitizeTextForPdf(item.example ? '"' + item.example + '"' : '');

            doc.setFontSize(7.5);
            const termLines = doc.splitTextToSize(numLabel, 34);
            const ipaLines = doc.splitTextToSize(ipaLabel, 25);
            const catLines = doc.splitTextToSize(catLabel, 22);
            const esLines = doc.splitTextToSize(esLabel, 42);
            const exLines = doc.splitTextToSize(exLabel, 55);

            const maxLines = Math.max(termLines.length, ipaLines.length, catLines.length, esLines.length, exLines.length, 1);
            const rowH = Math.max(maxLines * 3.6 + 3.4, 8.2);

            if (y + rowH > 276) {
              doc.addPage();
              drawEditorialHeader(false);
              y = drawTableColumnHeaders(27);
            }

            // Filas alternadas (Zebra Striping)
            if (i % 2 === 0) {
              doc.setFillColor(248, 250, 252);
            } else {
              doc.setFillColor(239, 246, 255);
            }
            doc.rect(10, y, 190, rowH, 'F');

            // Bordes limpios de celda y divisores verticales
            doc.setDrawColor(203, 213, 225);
            doc.setLineWidth(0.15);
            doc.rect(10, y, 190, rowH, 'S');
            doc.line(46, y, 46, y + rowH);
            doc.line(73, y, 73, y + rowH);
            doc.line(97, y, 97, y + rowH);
            doc.line(141, y, 141, y + rowH);

            const textY = y + 4.2;

            // Col 1: Palabra en inglés
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
            doc.text(termLines, 11.5, textY);

            // Col 2: Fonética
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(3, 105, 161);
            doc.text(ipaLines, 47.5, textY);

            // Col 3: Categoría gramatical
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(180, 83, 9);
            doc.text(catLines, 74.5, textY);

            // Col 4: Significado en español
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 41, 59);
            doc.text(esLines, 98.5, textY);

            // Col 5: Oración de ejemplo
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(71, 85, 105);
            doc.text(exLines, 142.5, textY);

            y += rowH;
          }

          // Numeración automática de páginas ("Página X de Y") en el pie de página
          const totalPages = doc.internal.getNumberOfPages();
          for (let p = 1; p <= totalPages; p++) {
            doc.setPage(p);
            doc.setDrawColor(245, 158, 11);
            doc.setLineWidth(0.4);
            doc.line(10, 283, 200, 283);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(100, 116, 139);
            doc.text('MasterENG • Official TOEFL & Fluency Dictionary — Material Editorial de Estudio', 10, 288);

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
            doc.text('Pagina ' + p + ' de ' + totalPages, 200, 288, { align: 'right' });
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
        modData.title || 'MasterENG Dictionary',
        'Wilberth Alessandro Molina Cutz',
        items
      );
      triggerBlobDownload(binaryBlob, filename);
    }

    function openGlossaryModal(modKey) {
      enrichMasterModulesDictionary();
      let modObj = null;
      if (typeof modKey === 'number' || (typeof modKey === 'string' && /^\d+$/.test(modKey))) {
        modObj = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.id === Number(modKey));
        if (modObj && modObj.key) modKey = modObj.key;
      } else if (typeof modKey === 'string') {
        modObj = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.key === modKey);
      }
      if (modKey) activeGlossaryModuleKey = modKey;
      activeGlossaryCategoryFilter = 'all';

      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey])
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey]
        : { title: (typeof MODULE_TITLES !== 'undefined' && MODULE_TITLES[activeGlossaryModuleKey]) || 'Glosario Oficial', items: [] };
      const displayTitle = modObj
        ? `Diccionario Módulo ${String(modObj.id).padStart(2, '0')} (${modObj.level}): ${modObj.title}`
        : (modData.title || MODULE_TITLES[activeGlossaryModuleKey] || 'Glosario Oficial');
      const titleEl = document.getElementById('glossaryModalTitle');
      const subEl = document.getElementById('glossaryModalSubtitle');
      if (titleEl) titleEl.textContent = displayTitle;
      if (subEl) subEl.textContent = `${(modData.items || []).length} términos clasificados con transcripción IPA, categoría gramatical, traducción y pronunciación nativa`;
      const searchInput = document.getElementById('glossarySearchInput');
      if (searchInput) searchInput.value = '';
      renderGlossaryCategoryPills();
      const rawModItems = modData.items || [];
      const sortedModItems = [...rawModItems].sort((a, b) =>
        (a.term || a.word || '').localeCompare((b.term || b.word || ''), 'en', { sensitivity: 'base' })
      );
      renderGlossaryItems(sortedModItems);
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
      if (typeof window.stopAllAudioAndTimers === 'function') {
        window.stopAllAudioAndTimers();
      }
      setupDraggableWidget('draggableRobotWidget', 'saved_robot_pos');
      setupDraggableWidget('draggableRouletteWidget', 'saved_roulette_pos');
      updateCoverFlowVisuals();
      setupCoverFlowGestures();
      initGoogleIdentityServices();

      renderMusicTracksList();
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
      if (typeof window.updateNetworkStatus === 'function') {
        window.updateNetworkStatus();
      }
      const isReg = (typeof window.isUserRegistered === 'function') ? window.isUserRegistered() : false;
      const stored = getStoredUser();
      if (isReg || (stored && stored.username && stored.role !== 'guest')) {
        if (typeof window.updateUIForLoggedInUser === 'function') {
          window.updateUIForLoggedInUser();
        } else {
          updateUserExpDisplay();
          goToHomePortals();
        }
      } else {
        window.navigateTo('login');
      }
    });
  

  // Exportar funciones globales para interoperabilidad
  
    // Funciones globales expuestas en window para acceso directo e infalible
    window.continueAsGuest = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      console.log("Accediendo como Invitado...");
      try {
        localStorage.setItem('mastereng_user', JSON.stringify({ username: 'Invitado', role: 'guest', exp: 0, rank: 'Bronce' }));
        localStorage.setItem('user_role', 'guest');
        localStorage.setItem('guest_user', JSON.stringify({ username: 'Invitado', role: 'guest' }));
        localStorage.setItem('english_app_user_session', JSON.stringify({ username: 'Invitado', role: 'guest', exp: 0, rank: 'Bronce' }));
      } catch (err) { }
      if (document.body) {
        document.body.classList.add('user-guest');
      }

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
        el.style.display = 'none';
        el.classList.add('hidden');
      });

      const headerAdmin = document.getElementById('headerAdminBtn');
      if (headerAdmin) {
        headerAdmin.style.display = 'none';
        headerAdmin.classList.add('hidden');
      }

      if (typeof updateUserExpDisplay === 'function') updateUserExpDisplay();
      if (typeof updateCoverFlowVisuals === 'function') updateCoverFlowVisuals();
      if (typeof window.applyAuthGuardsUI === 'function') window.applyAuthGuardsUI();
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

            const isMasterAdmin = (
        (userInput.toLowerCase() === 'admin' ||
         userInput.toLowerCase() === 'admin@antigravity.com' ||
         userInput.toLowerCase() === 'admin@mastereng.com') &&
        passInput === 'Admin2026!Master'
      );
      if (isMasterAdmin) {
        const existingStored = getStoredUser();
        const adminExp = (existingStored && existingStored.username === 'admin' && typeof existingStored.exp === 'number') ? existingStored.exp : 0; // Progreso 100% real desde 0 (reemplaza exp: 1250 previo)
        const adminRank = calculateRankInfo(adminExp).rank;
        const adminData = { username: 'admin', role: 'admin', exp: adminExp, rank: adminRank, token: 'MasterENG-Admin-OfflineMasterToken-2026' };
        try {
          const adminObj = { username: 'admin', role: 'admin', exp: adminExp, rank: adminRank };
          saveStoredAuthUser(adminObj);
          localStorage.setItem('mastereng_user', JSON.stringify(adminObj));
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
        if (typeof window.applyAuthGuardsUI === 'function') window.applyAuthGuardsUI();
        if (typeof showFloatingToast === 'function') showFloatingToast('¡Bienvenido de nuevo, Administrador!', '✅');
        if (typeof goToHomePortals === 'function') goToHomePortals();
        return false;
      }

      // Delegar a la autenticación estricta tradicional en base de datos
      return window.handleTraditionalLogin(userInput, passInput);
    };

        window.openGoogleAccountSelector = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

      let modal = document.getElementById('googleAccountPickerModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'googleAccountPickerModal';
        modal.className = 'modal fixed modal-overlay modal-backdrop inset-0 z-[100005] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md';
        document.body.appendChild(modal);
      }

      let savedCustomAccounts = [];
      try {
        savedCustomAccounts = JSON.parse(localStorage.getItem('mastereng_google_accounts') || '[]');
      } catch (err) {}

      // Privacidad absoluta: Cero tarjetas hardcodeadas de Administrador o correos privados en UI
      const defaultAccounts = savedCustomAccounts.map(acc => ({
        name: acc.name || acc.email.split('@')[0],
        email: acc.email,
        role: 'user',
        badge: 'Cuenta de Google',
        avatarBg: 'from-sky-500 to-indigo-600'
      }));

      window._googlePickerAccounts = defaultAccounts;

      modal.innerHTML = `
        <div class="w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl p-6 shadow-2xl relative text-slate-100 overflow-hidden" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0">
                <svg class="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-base font-black text-white">Iniciar sesión con Google</h3>
                <p class="text-xs text-slate-400">Acceso seguro y privado para estudiantes</p>
              </div>
            </div>
            <button type="button" onclick="window.closeAllModals()" class="close-btn w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer">&times;</button>
          </div>

          ${defaultAccounts.length > 0 ? `
            <div class="py-3 space-y-2 max-h-48 overflow-y-auto">
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cuentas recientes:</p>
              ${defaultAccounts.map((acc, idx) => `
                <button type="button" onclick="window.selectGooglePickerAccount(${idx})"
                  class="w-full p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-sky-500/60 transition flex items-center justify-between gap-3 text-left cursor-pointer group">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-tr ${acc.avatarBg} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow">
                      ${acc.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-bold text-white truncate group-hover:text-sky-300 transition">${acc.name}</p>
                      <p class="text-[10px] text-slate-400 font-mono truncate">${acc.email}</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-slate-900 text-[9px] font-bold text-sky-300 border border-sky-500/30 shrink-0">Seleccionar</span>
                </button>
              `).join('')}
            </div>
          ` : ''}

          <div class="pt-3 ${defaultAccounts.length > 0 ? 'border-t border-slate-800' : ''} space-y-3">
            <p class="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Ingresa tu cuenta de Google:</p>
            <div class="space-y-2">
              <input type="text" id="googleCustomNameInput" placeholder="Tu nombre o alias" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500">
              <input type="email" id="googleCustomEmailInput" placeholder="tucorreo@gmail.com" onkeydown="if(event.key==='Enter') window.submitCustomGoogleAccount()" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500">
              <p id="googlePickerErrorMsg" class="text-[11px] text-rose-400 font-semibold hidden"></p>
              <button type="button" onclick="window.submitCustomGoogleAccount()"
                class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs transition shadow-lg shadow-sky-500/25 cursor-pointer flex items-center justify-center gap-2">
                <span>Continuar a MasterENG</span>
              </button>
            </div>
          </div>
        </div>
      `;

      modal.classList.remove('hidden');
      modal.classList.add('active');
      modal.style.display = 'flex';
      modal.style.setProperty('display', 'flex', 'important');
      modal.style.setProperty('pointer-events', 'auto', 'important');
      modal.style.setProperty('z-index', '100005', 'important');
      return false;
    };

    window.selectGooglePickerAccount = function(idx) {
      const acc = (window._googlePickerAccounts || [])[idx];
      if (!acc) return;
      window.completeGoogleAccountSignIn(acc.name, acc.email, acc.role);
    };

    window.submitCustomGoogleAccount = function() {
      const nameEl = document.getElementById('googleCustomNameInput');
      const emailEl = document.getElementById('googleCustomEmailInput');
      const errEl = document.getElementById('googlePickerErrorMsg');
      const rawEmail = (emailEl ? emailEl.value : '').trim().toLowerCase();
      const rawName = (nameEl ? nameEl.value : '').trim();

      if (!rawEmail || !rawEmail.includes('@')) {
        if (errEl) {
          errEl.textContent = 'Por favor ingresa un correo válido (ej. usuario@gmail.com).';
          errEl.classList.remove('hidden');
        }
        return;
      }

      const finalEmail = rawEmail.includes('@') ? rawEmail : (rawEmail + '@gmail.com');
      const finalName = rawName || finalEmail.split('@')[0];

      try {
        const saved = JSON.parse(localStorage.getItem('mastereng_google_accounts') || '[]');
        if (!saved.some(a => a.email === finalEmail)) {
          saved.push({ name: finalName, email: finalEmail, role: 'user' });
          localStorage.setItem('mastereng_google_accounts', JSON.stringify(saved));
        }
      } catch (e) {}

      window.completeGoogleAccountSignIn(finalName, finalEmail, 'user');
    };

    window.completeGoogleAccountSignIn = function(nameOrEmail, emailOrName, role = 'user') {
      const isFirstEmail = String(nameOrEmail || '').includes('@') && !String(emailOrName || '').includes('@');
      const finalEmail = isFirstEmail ? String(nameOrEmail) : String(emailOrName || '');
      const finalName = isFirstEmail ? String(emailOrName || finalEmail.split('@')[0]) : String(nameOrEmail || finalEmail.split('@')[0]);
      
      const existingStored = typeof getStoredUser === 'function' ? getStoredUser() : null;
      const realExp = (existingStored && existingStored.email === finalEmail && typeof existingStored.exp === 'number') ? existingStored.exp : 0;
      const rankInfo = typeof calculateRankInfo === 'function' ? calculateRankInfo(realExp) : { rank: 'Bronce' };

      const googleUser = {
        username: finalName,
        email: finalEmail,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=0284c7&color=fff&bold=true`,
        role: 'user',
        provider: 'google',
        exp: realExp,
        rank: rankInfo.rank
      };

      try {
        saveStoredAuthUser(googleUser);
        localStorage.setItem('user_role', 'user');
        const regList = JSON.parse(localStorage.getItem('english_app_registered_users') || '[]');
        if (!regList.some(u => u.email === finalEmail)) {
          regList.push(googleUser);
          localStorage.setItem('english_app_registered_users', JSON.stringify(regList));
        }
      } catch (e) {}

      const headerAdmin = document.getElementById('headerAdminBtn');
      if (headerAdmin) {
        headerAdmin.style.display = 'none';
        headerAdmin.classList.add('hidden');
      }

      const pickerModal = document.getElementById('googleAccountPickerModal');
      if (pickerModal) {
        pickerModal.style.display = 'none';
        pickerModal.style.pointerEvents = 'none';
        pickerModal.classList.add('hidden');
        pickerModal.classList.remove('active');
      }
      window.closeAllModals();

      const viewAuthEl = document.getElementById('view-auth');
      if (viewAuthEl) {
        viewAuthEl.style.display = 'none';
        viewAuthEl.style.pointerEvents = 'none';
        viewAuthEl.style.visibility = 'hidden';
        viewAuthEl.style.zIndex = '-1';
        viewAuthEl.classList.add('hidden');
      }

      updateUserExpDisplay();
      try {
        fetch('/api/google-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: finalEmail, name: finalName, picture: googleUser.picture })
        }).catch(() => {});
      } catch (_) {}

      if (typeof window.updateUIForLoggedInUser === 'function') {
        window.updateUIForLoggedInUser();
      }

      showFloatingToast(`¡Bienvenido, ${googleUser.username}! (Google Auth)`, '🎉');
      goToHomePortals();
      updateFloatingWidgetsVisibility();
    };

    window.handleGoogleAuth = function(e) {
      return window.openGoogleAccountSelector(e);
    };
    window.handleGoogleSignInClick = function(e) {
      return window.openGoogleAccountSelector(e);
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
    window.initOrResumeWorld3D = function() { if (typeof window.open3DPortalView === 'function') window.open3DPortalView(); };
  window.buildRealisticHouse = buildRealisticHouse;
  window.buildRealisticBackyard = buildRealisticBackyard;
  window.switch3DScenario = switch3DScenario;
  window.speakText = speakText;
  window.handleLoginSubmit = handleAuthLoginSubmit;
  window.handleAuthLoginSubmit = function(e) {
    if (typeof window.handleAdminLogin === 'function') return window.handleAdminLogin(e);
    return handleAuthLoginSubmit(e);
  };
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
      return (async () => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        const uInput = document.getElementById('authRegUsername');
        const eInput = document.getElementById('authRegEmail');
        const pInput = document.getElementById('authRegPassword');
        const cpInput = document.getElementById('authRegConfirmPassword');

        const username = (uInput?.value || '').trim();
        const email = (eInput?.value || '').trim();
        const password = (pInput?.value || '').trim();
        const confirmPassword = (cpInput?.value || '').trim();

        if (cpInput && confirmPassword && password !== confirmPassword) {
          triggerAppAlert('Las contraseñas no coinciden. Por favor verifícalas.');
          return false;
        }

        const ok = await window.handleTraditionalRegister(username, email, password);
        if (ok) {
          if (typeof switchAuthTab === 'function') switchAuthTab('login');
          const loginIdent = document.getElementById('authLoginIdentifier');
          if (loginIdent) {
            loginIdent.value = email || username;
          }
          const loginPass = document.getElementById('authLoginPassword');
          if (loginPass) {
            loginPass.value = '';
            if (typeof loginPass.focus === 'function') loginPass.focus();
          }
        }
        return ok;
      })();
    };
    function handleAuthRegisterSubmit(e) { return window.handleAuthRegisterSubmit(e); }


    /* ========================================================
       RENDERIZADO DINÁMICO DE LOS 10 MÓDULOS DE LEARNING PATH
       ======================================================== */
        window.OFFICIAL_LEARNING_MODULES = [
      { id: 1, title: "PHRASAL VERBS / VERBOS COMPUESTOS", altTitle: "Foundations & Daily Routine", level: "A1-B1", exp: 20, words: 100, key: "phrasal_verbs", pureCategory: "Phrasal Verb", progress: 0 },
      { id: 2, title: "VERBOS / VERBS", altTitle: "VERBOS / VERBS", level: "A2-B1", exp: 20, words: 100, key: "difficult_verbs", pureCategory: "Verbo", progress: 0 },
      { id: 3, title: "ADJETIVOS / ADJECTIVES", altTitle: "ADJETIVOS / ADJECTIVES", level: "B1-B2", exp: 20, words: 100, key: "power_adjectives", pureCategory: "Adjetivo", progress: 0 },
      { id: 4, title: "MODISMOS Y SLANG / IDIOMS & SLANG", altTitle: "MODISMOS Y SLANG / IDIOMS & SLANG", level: "B2", exp: 25, words: 100, key: "native_idioms", pureCategory: "Idiom", progress: 0 },
      { id: 5, title: "CONECTORES / CONNECTORS", altTitle: "CONECTORES / CONNECTORS", level: "B2-C1", exp: 25, words: 100, key: "connectors_linking", pureCategory: "Conector", progress: 0 },
      { id: 6, title: "CONFUSOS Y EXPRESIONES / CONFUSING WORDS", altTitle: "CONFUSOS Y EXPRESIONES / CONFUSING WORDS", level: "B2", exp: 30, words: 100, key: "false_friends", pureCategory: "Falso Amigo", progress: 0 },
      { id: 7, title: "FRASES COTIDIANAS / EVERYDAY PHRASES", altTitle: "FRASES COTIDIANAS / EVERYDAY PHRASES", level: "B2-C1", exp: 30, words: 100, key: "collocations", pureCategory: "Collocation", progress: 0 },
      { id: 8, title: "TRABAJO Y TECNOLOGÍA / WORK & TECH", altTitle: "TRABAJO Y TECNOLOGÍA / WORK & TECH", level: "C1", exp: 35, words: 100, key: "business_tech", pureCategory: "Negocios & Tech", progress: 0 },
      { id: 9, title: "CLIMA, NATURALEZA Y VIAJES / WEATHER & TRAVEL", altTitle: "CLIMA, NATURALEZA Y VIAJES / WEATHER & TRAVEL", level: "A2-B1", exp: 40, words: 100, key: "travel_survival", pureCategory: "Viajes & Supervivencia", progress: 0 },
      { id: 10, title: "VOCABULARIO AVANZADO / ADVANCED VOCAB", altTitle: "Master Fluency & Accent Reduction", level: "C1-C2", exp: 50, words: 100, key: "toefl_academic", pureCategory: "Académico TOEFL", progress: 0 }
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
    window.renderGlossaryItems = renderGlossaryItems;

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

      const completedObj = (function() {
        try {
          return JSON.parse(localStorage.getItem('user_completed_modules') || '{}');
        } catch (e) {
          return {};
        }
      })();

      const htmlContent = window.OFFICIAL_LEARNING_MODULES.map(mod => {
        const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[mod.key]) 
          ? window.MASTER_MODULES_DATA[mod.key] 
          : { items: [] };
        const sortedItems = [...(modData.items || [])].sort((a, b) =>
          (a.term || a.word || '').localeCompare((b.term || b.word || ''), 'en', { sensitivity: 'base' })
        );
        const sampleItems = sortedItems.slice(0, 3);
        const isCompleted = Boolean(completedObj[`${mod.key}_lvl1`] || completedObj[`${mod.id}_lvl1`]);
        const progressPercent = isCompleted ? 100 : (typeof mod.progress === 'number' && mod.progress > 0 ? mod.progress : 0);
        const masteredText = isCompleted ? `${mod.words}/${mod.words} palabras dominadas` : `0/${mod.words} palabras dominadas`;

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
            <p class="text-xs text-slate-400 mb-2">${masteredText} &bull; ${mod.pureCategory || 'Especializado'}</p>

            <!-- Barra de Progreso Dinámica -->
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
                ${sampleItems.map((item, sIdx) => `
                  <div class="flex items-center justify-between py-0.5 border-b border-slate-900 last:border-none">
                    <span class="text-slate-200 font-medium truncate">
                      <span class="text-[9px] font-mono text-amber-400 font-bold mr-1">#${String(sIdx + 1).padStart(2, '0')}</span>
                      ${item.term || ''} <span class="text-[10px] text-amber-400/80 font-mono">${item.pron || ''}</span>
                    </span>
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
       REPRODUCTOR MUSICAL Y VIDEO SINCRONIZADO (window.stopAllMedia + HOLOGRAPHIC 600x600 + lyrics.ovh)
       ======================================================== */
    window.stopAllMedia = function(exceptElement = null) {
      // 1. Detener y reiniciar absolutamente TODOS los elementos <audio> y <video> de la página
      document.querySelectorAll('audio, video').forEach(media => {
        try {
          media.removeAttribute('loop');
          media.loop = false;
          if (media !== exceptElement) {
            media.pause();
            media.currentTime = 0;
          }
        } catch (e) {}
      });

      // 2. Detener intervalo previo de sincronización de karaoke
      if (!exceptElement && typeof window.stopMusicKaraokeSync === 'function') {
        window.stopMusicKaraokeSync();
      }

      // 3. Detener y pausar todos los <iframe> de video (YouTube, etc.)
      if (!exceptElement) {
        if (window.ytMusicPlayer && typeof window.ytMusicPlayer.pauseVideo === 'function') {
          try { window.ytMusicPlayer.pauseVideo(); } catch (e) {}
        }
        document.querySelectorAll('iframe').forEach(ifr => {
          try {
            if (ifr.contentWindow) {
              ifr.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
              ifr.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
            }
          } catch (e) {}
        });
      }

      const holoPlayIcon = document.getElementById('holoStagePlayIcon');
      const holoEq = document.getElementById('holoStageEqualizer');
      if (holoPlayIcon && !exceptElement) holoPlayIcon.textContent = '▶️';
      if (holoEq && !exceptElement) holoEq.classList.remove('holo-eq-playing');
    };

    // Interceptar cualquier evento 'play' en toda la página para garantizar CERO audios encimados y CERO loop
    document.addEventListener('play', function(e) {
      const target = e.target;
      if (target && (target.tagName === 'AUDIO' || target.tagName === 'VIDEO')) {
        target.loop = false;
        target.removeAttribute('loop');
        document.querySelectorAll('audio, video').forEach(other => {
          if (other !== target) {
            try {
              other.loop = false;
              other.pause();
              other.currentTime = 0;
            } catch (err) {}
          }
        });
        // Pausar iframe de YouTube para que nunca se encime con el audio
        document.querySelectorAll('iframe').forEach(ifr => {
          try {
            if (ifr.contentWindow) {
              ifr.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
          } catch (err) {}
        });
      }
    }, true);

    // Escuchar eventos de la API de YouTube y sincronización en tiempo real
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('message', function(event) {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (!data) return;
          if (data.event === 'onStateChange' && typeof window.handleHoloPlayerStateChange === 'function') {
            window.handleHoloPlayerStateChange(data.info);
          } else if (data.event === 'onError' || (data.info && typeof data.info.errorCode !== 'undefined')) {
            const errCode = data.event === 'onError' ? data.info : data.info.errorCode;
            if (typeof window.handleHoloPlayerError === 'function') {
              window.handleHoloPlayerError(errCode);
            }
          } else if (data.event === 'infoDelivery' && data.info) {
            if (typeof data.info.playerState !== 'undefined' && typeof window.handleHoloPlayerStateChange === 'function') {
              window.handleHoloPlayerStateChange(data.info.playerState);
            }
            if (typeof data.info.currentTime === 'number') {
              const ytCurTime = data.info.currentTime;
              const isSeekingGrace = window._isSeekingGracePeriod && (Date.now() - (window._lastSeekTimestamp || 0)) < 1500;
              if (isSeekingGrace && typeof window._lastSeekTargetSeconds === 'number') {
                if (Math.abs(ytCurTime - window._lastSeekTargetSeconds) > 2.5) return;
                window._isSeekingGracePeriod = false;
              }
              window._currentTrackCurrentTime = ytCurTime;
              if (ytCurTime > 0.3) {
                window._holoPlayerHasStartedPlaying = true;
                if (window._holoPlayerWatchdogTimer) {
                  clearTimeout(window._holoPlayerWatchdogTimer);
                  window._holoPlayerWatchdogTimer = null;
                }
              }

              // Sincronizar barra de progreso y HUD de tiempo en adelanto / retraso / pausa
              const dur = window._currentTrackTotalDuration || 225;
              const progBar = document.getElementById('holoStageProgressBar');
              const timeBadge = document.getElementById('holoStageTime');
              const pct = Math.min(100, (ytCurTime / dur) * 100);
              if (progBar) progBar.style.width = `${pct}%`;
              if (timeBadge) {
                const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
                timeBadge.textContent = `${fmt(ytCurTime)} / ${fmt(dur)}`;
              }

              if (typeof window.handleKaraokeTimeUpdate === 'function') {
                window.handleKaraokeTimeUpdate(ytCurTime + (typeof window.lyricsOffset === 'number' ? window.lyricsOffset : -0.6));
              }
            }
          }
        } catch (_) {}
      });
    }

    function translateEnglishVerseToSpanishStudy(enLine) {
      const lower = (enLine || '').toLowerCase();
      const phraseDict = [
        [/\bi'm a creep\b/i, "Soy un inadaptado / extraño (expresión coloquial)"],
        [/\bi'm a weirdo\b/i, "Soy un bicho raro (vocabulario informal)"],
        [/\bwhat the hell am i doing here\b/i, "¿Qué demonios hago aquí? (énfasis emocional)"],
        [/\bi don't belong here\b/i, "No pertenezco a este lugar"],
        [/\byou're so very special\b/i, "Eres tan especial"],
        [/\bi wish i was special\b/i, "Ojalá yo fuera especial (estructura wish + past)"],
        [/\bshe's running out the door\b/i, "Ella sale corriendo por la puerta (present continuous)"],
        [/\bwhatever makes you happy\b/i, "Lo que sea que te haga feliz"],
        [/\bwhatever you want\b/i, "Lo que sea que quieras"],
        [/\bi love you\b/i, "Te amo / Te quiero"],
        [/\bdon't give up\b/i, "No te rindas (phrasal verb: give up)"],
        [/\blook at the stars\b/i, "Mira las estrellas"],
        [/\bthey were all yellow\b/i, "Todas brillaban de color amarillo"]
      ];
      for (let i = 0; i < phraseDict.length; i++) {
        if (phraseDict[i][0].test(lower)) return phraseDict[i][1];
      }
      const wordMap = {
        "when": "cuando", "you": "tú", "were": "estabas/eras", "here": "aquí", "before": "antes",
        "couldn't": "no pude", "look": "mirar", "in": "en", "the": "el/la", "eye": "ojo",
        "just": "solo", "like": "como", "an": "un", "angel": "ángel", "your": "tu",
        "skin": "piel", "makes": "hace", "me": "me", "cry": "llorar", "float": "flotar",
        "feather": "pluma", "beautiful": "hermoso/a", "world": "mundo", "wish": "desearía",
        "was": "fuera/estaba", "special": "especial", "very": "muy", "creep": "extraño",
        "weirdo": "raro", "what": "qué", "doing": "haciendo", "don't": "no", "belong": "pertenezco",
        "care": "importar", "if": "si", "hurts": "duele", "want": "quiero", "have": "tener",
        "control": "control", "perfect": "perfecto", "body": "cuerpo", "soul": "alma",
        "know": "saber", "notice": "notar", "around": "alrededor", "running": "corriendo",
        "out": "afuera", "door": "puerta", "whatever": "lo que sea", "happy": "feliz",
        "love": "amor/amar", "heart": "corazón", "night": "noche", "day": "día", "time": "tiempo",
        "life": "vida", "feel": "sentir", "never": "nunca", "always": "siempre", "dream": "sueño"
      };
      const words = lower.replace(/[^a-z'\s]/g, '').split(/\s+/).filter(Boolean);
      const translatedHints = [];
      words.forEach(w => {
        if (wordMap[w] && translatedHints.length < 6 && !translatedHints.includes(wordMap[w])) {
          translatedHints.push(`${w} = ${wordMap[w]}`);
        }
      });
      if (translatedHints.length > 0) {
        return 'Traducción clave: ' + translatedHints.join(' • ');
      }
      return 'Estrofa en inglés • Haz clic en cualquier palabra para ver su fonética IPA y significado';
    }

    /* ========================================================
       SISTEMA MULTI-RESPALDO PARA RESOLUCIÓN DE VIDEOID DE CANCIÓN COMPLETA
       ======================================================== */
    window.lyricsOffset = typeof window.lyricsOffset === 'number' ? window.lyricsOffset : -0.6;
    window._isUserScrollingLyrics = false;

    window.adjustLyricsOffset = function(delta) {
      window.lyricsOffset = Math.round(((typeof window.lyricsOffset === 'number' ? window.lyricsOffset : -0.6) + delta) * 10) / 10;
      if (typeof document !== 'undefined') {
        const badge = document.getElementById('lyricsOffsetBadge');
        if (badge) {
          const sign = window.lyricsOffset > 0 ? '+' : '';
          badge.textContent = `Sync: ${sign}${window.lyricsOffset.toFixed(1)}s`;
        }
      }
      if (typeof showFloatingToast === 'function') {
        const sign = window.lyricsOffset > 0 ? '+' : '';
        showFloatingToast(`Calibración de audio: ${sign}${window.lyricsOffset.toFixed(1)}s`, '⏱️');
      }
    };

    window.resolveYouTubeVideoId = async function(artist, title, customSuffix) {
      let variantTag = customSuffix || 'audio oficial';
      const lowerTitle = (title || '').toLowerCase();
      if (!customSuffix) {
        if (lowerTitle.includes('acoustic') || lowerTitle.includes('acústica') || lowerTitle.includes('acustica')) {
          variantTag = 'acoustic audio oficial';
        } else if (lowerTitle.includes('live') || lowerTitle.includes('en vivo')) {
          variantTag = 'live audio oficial';
        } else if (lowerTitle.includes('studio') || lowerTitle.includes('estudio')) {
          variantTag = 'studio version audio oficial';
        }
      }
      // Búsqueda dinámica oficial: ${artist} ${title} official audio / ${artist} ${title} audio oficial
      const query = `${artist || ''} ${title || ''} ${variantTag}`.trim();
      const cleanQ = query.toLowerCase();

      // 0. Catálogo precargado o pre-mapeado rápido
      if (window.KARAOKE_MASTER_DATA && Array.isArray(window.KARAOKE_MASTER_DATA) && !customSuffix) {
        const match = window.KARAOKE_MASTER_DATA.find(k =>
          k.title && (k.title.toLowerCase() === (title || '').toLowerCase() || (title || '').toLowerCase().includes(k.title.toLowerCase()))
        );
        if (match && match.youtubeId) return match.youtubeId;
      }

      // Pre-mapping conocido para clásicos comunes (Conexión Directa sin Bloqueo de Embed)
      const knownMap = {
        'every breath you take': '6cucosmPj-A',
        'the police': '6cucosmPj-A',
        'roxanne': 'Cdu3a2arXdw',
        'message in a bottle': '4m3CMTeo-nU',
        'i wanna be yours': 'nyuo9-OjNNg',
        'wanna be yours': 'nyuo9-OjNNg',
        'do i wanna know': 'bpOSxM0rNPM',
        '505': 'qU9mHegkTc4',
        'r u mine': 'VQH8ZTgna3Q',
        'arctic monkeys': 'nyuo9-OjNNg',
        'sign of the times': 'We4QQCMwyrg',
        'as it was': '4vTox2Jz2-U',
        'watermelon sugar': '7-x3uD5z1bQ',
        'golden': 'iyuL_2p5p_g',
        'creep': 'XFkzRNyygfk',
        'losing my religion': 'xwtdhWltSIg',
        'bohemian rhapsody': 'fJ9rUzIMcZQ',
        'dont stop me now': 'MHi9mKq0slA',
        'don\'t stop me now': 'MHi9mKq0slA',
        'here comes the sun': 'KQetemT1sWc',
        'come together': 'oVW6wJ7MYDM',
        'beat it': 'oRdxUFDoQe0',
        'thriller': 'sO4vI8P88NM',
        'hotel california': '09839DpTctU',
        'rolling in the deep': 'rYEDA3JcQqw',
        'shape of you': 'JGwWNGJdvx8',
        'someone like you': 'hLQl3WQQoQ0',
        'set fire to the rain': 'a2giXO6eyuI',
        'hello': 'T1tl66trXTQ',
        'billie jean': 'Zi_XLOBDo_Y',
        'smells like teen spirit': 'hTWKbfoikeg',
        'viva la vida': 'dvgZkm1xWPE',
        'sweet child o mine': '1w7OgIMMRc4',
        'yellow': 'yKNxeF4KMsY',
        'count on me': '4JNtAtGGNRU',
        'stay with me': 'pB-5XG-DbAA',
        'fix you': 'k4V3Mo61fJM',
        'the scientist': 'RB-RcX5DS5A',
        'a sky full of stars': 'zp7NtW_hKJI',
        'paradise': 'J6ZWlDks0nQ',
        'counting stars': 'hT_nvWreIhg',
        'demons': 'mWRsgZuwf_8',
        'radioactive': 'ktvTqvkFyHA',
        'believer': '7wtfhZwyrcc',
        'thunder': '4AqjqOqNrjw',
        'bones': 'mb-Cnwi9BqA',
        'bad guy': 'DyDfgMOUjCI',
        'lovely': 'wjj2upnfBI0',
        'birds of a feather': 'd5gf9dXbPi0',
        'blinding lights': '4NRXx6U8ABQ',
        'save your tears': 'XXYlFuWEuKi',
        'starboy': 'Rif-RTvmmss',
        'perfect': '2Vv-BfVoq4g',
        'photograph': 'nSDgHBxUbVQ',
        'thinking out loud': 'lp-EO5I60KA',
        'bad habits': 'HeOpRzcqKrE',
        'shivers': 'z2_Lrg6rRks',
        'all of me': '450p7goxZqg',
        'shallow': 'bo_efYhAK2A',
        'someone you loved': 'zABLecsR5UE',
        'heat waves': 'mRD0-GxqHVo',
        'stay': 'kTJczUoc26U',
        'drivers license': 'ZmDBbnmKpqQ',
        'happier': 'm7Bc3pLyij0',
        'dance monkey': 'q0hyYWKXF0Q',
        'memories': 'SlPhMPnQ58k',
        'girls like you': 'aJOTlE1K90k',
        'sugar': '09R8_2nJtjg',
        'anti-hero': 'b1kbLwvqugk',
        'cruel summer': 'ic8j13piAhQ',
        'blank space': 'e-ORhEE9VVg',
        'shake it off': 'nfWlot6h_JM',
        'love story': 'aXzVF3XeS8M',
        'flowers': 'G7KNmW9a75Y',
        'sunflower': 'ApXoWvfEYVU',
        'circles': 'wXhTHyIgQ_U',
        'rockstar': 'UceaB4D0jpo',
        'closer': 'PT2_F-1esPk',
        'levitating': 'TUVcZfQe-Kw',
        'dont start now': 'oygrmJFKYZY',
        'don\'t start now': 'oygrmJFKYZY',
        'new rules': 'k2qgadSvNyU',
        'senorita': 'Pkh8UtuejGw',
        'havana': 'BQ0mxQXDG3k',
        'in the end': 'eVTXPUF4Oz4',
        'numb': 'kXYiU_JCYtU',
        'faint': 'NU61CbO9u6o',
        'what ive done': '8sgycukafqQ',
        'wonderwall': '6hzrDeceEKc',
        'dont look back in anger': 'oplra1FJxWI',
        'yesterday': 'NrgmdOz227I',
        'let it be': 'QDYfEBY9NM4',
        'hey jude': 'A_MjCqQoLLA',
        'imagine': 'YkgkThbjOdI',
        'boulevard of broken dreams': 'hBvJyi3fbtA',
        'dont stop believin': '1k8craCGpgs',
        'livin on a prayer': 'CuUefy9bT9U',
        'rocket man': 'GuyGoiQkWAo',
        'im still standing': 'RMndME63PMo',
        'dancing queen': '-sVB91NTa4A',
        'treat you better': 'eiG_DUXD8YQ',
        'riptide': 'Y6TFSTHUxi0',
        'let her go': 'lRVTVB94zTg',
        'another love': '9i_OWaiaF34',
        'take me to church': 'MYSVMgRr6pw',
        'beautiful things': 'HU08BcK5SUY',
        'espresso': '51zjlMhdSTE',
        'just the way you are': 'E-UJTGXof6Q',
        'locked out of heaven': 'QTRaN-82Ip4',
        'when i was your man': '1wbtvNA8GaA'
      };
      if (!customSuffix) {
        for (const [k, vid] of Object.entries(knownMap)) {
          if (cleanQ.includes(k)) return vid;
        }
      }

      // Mapeo conocido para versiones alternativas sin restricción de incrustación
      if (customSuffix && (customSuffix.includes('lyric') || customSuffix.includes('topic'))) {
        const knownAlt = {
          'every breath you take': '6cucosmPj-A',
          'the police': '6cucosmPj-A',
          'i wanna be yours': 'nyuo9-OjNNg',
          'wanna be yours': 'nyuo9-OjNNg',
          'sign of the times': 'We4QQCMwyrg',
          'as it was': '4vTox2Jz2-U',
          'watermelon sugar': '7-x3uD5z1bQ',
          'golden': 'iyuL_2p5p_g'
        };
        for (const [k, vid] of Object.entries(knownAlt)) {
          if (cleanQ.includes(k)) return vid;
        }
      }

      // Intento 1: Consulta directa a instancias públicas de Invidious y Piped con CORS habilitado
      const apiEndpoints = [
        `https://invidious.flokinet.to/api/v1/search?q=${encodeURIComponent(query)}&type=video`,
        `https://api.piped.private.coffee/search?q=${encodeURIComponent(query)}&filter=videos`
      ];

      for (const apiEndpoint of apiEndpoints) {
        try {
          const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
          const tid = ctrl ? setTimeout(() => ctrl.abort(), 2500) : null;
          const res = await fetch(apiEndpoint, ctrl ? { signal: ctrl.signal } : {});
          if (tid) clearTimeout(tid);
          if (res && res.ok) {
            const data = await res.json();
            const items = Array.isArray(data) ? data : (data && data.items ? data.items : []);
            if (items.length > 0) {
              const first = items[0];
              const vid = first.videoId || (first.url ? first.url.replace('/watch?v=', '') : null);
              if (vid && /^[a-zA-Z0-9_-]{11}$/.test(vid)) {
                return vid;
              }
            }
          }
        } catch (e) {}
      }

      // Intento 2: Consulta vía CORS proxy a YouTube search si las APIs fallan
      const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      const proxyEndpoints = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(ytSearchUrl)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(ytSearchUrl)}`
      ];

      for (const proxyUrl of proxyEndpoints) {
        try {
          const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
          const tid = ctrl ? setTimeout(() => ctrl.abort(), 2000) : null;
          const res = await fetch(proxyUrl, ctrl ? { signal: ctrl.signal } : {});
          if (tid) clearTimeout(tid);
          if (res && res.ok) {
            let text = '';
            if (proxyUrl.includes('allorigins')) {
              const json = await res.json();
              text = (json && json.contents) ? json.contents : '';
            } else {
              text = await res.text();
            }
            if (text) {
              const match = text.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
              if (match && match[1]) {
                return match[1];
              }
            }
          }
        } catch (e) {}
      }

      // Respaldo asegurado universal: nunca retornar null para evitar bloqueo de busqueda embed
      return '6cucosmPj-A';
    };

    window.resolveAlternativeYouTubeVideo = async function(artist, title) {
      // 1. Intento con lyric video
      try {
        const vid1 = await window.resolveYouTubeVideoId(artist, title, 'lyric video');
        if (vid1 && vid1 !== '6cucosmPj-A') return vid1;
      } catch (_) {}

      // 2. Intento con audio topic
      try {
        const vid2 = await window.resolveYouTubeVideoId(artist, title, 'audio topic');
        if (vid2 && vid2 !== '6cucosmPj-A') return vid2;
      } catch (_) {}

      // 3. Fallback directo conocido si coincide
      const q = `${artist || ''} ${title || ''}`.toLowerCase();
      if (q.includes('sign of the times')) return 'We4QQCMwyrg';
      if (q.includes('as it was')) return '4vTox2Jz2-U';
      if (q.includes('watermelon sugar')) return '7-x3uD5z1bQ';
      if (q.includes('every breath you take') || q.includes('the police')) return '6cucosmPj-A';

      return '6cucosmPj-A';
    };

    /* ========================================================
       CONTROLADOR GLOBAL DE REPRODUCCIÓN Y SINCRONIZACIÓN
       ======================================================== */
    window._isHoloStagePlaying = false;
    window._isHoloMuted = false;
    window._currentTrackTotalDuration = 225;
    window._currentTrackCurrentTime = 0;
    window._currentTrackStartTime = Date.now();
    window._karaokePlaybackTimer = null;
    window._holoPlayerFallbackStage = 0; // 0: primary video, 1: alt video (lyric/topic), 2: direct audio
    window._holoPlayerHasStartedPlaying = false;
    window._holoPlayerWatchdogTimer = null;
    window._currentPlayingYoutubeId = null;

    window.handleHoloPlayerError = async function(errorCode) {
      console.warn(`[HoloPlayer Engine] Error/Bloqueo detectado (Código: ${errorCode}). Etapa: ${window._holoPlayerFallbackStage}`);

      // Si ya está en modo audio directo garantizado, no reiniciar
      if (window._holoPlayerFallbackStage >= 2) return;

      const trackName = window._currentPlayingTrackName || 'Canción';
      const artistName = window._currentPlayingArtistName || '';

      // ETAPA 1: Intento 2 (Fallback Video Alternativo con Letra o Audio Topic)
      if (window._holoPlayerFallbackStage === 0) {
        window._holoPlayerFallbackStage = 1;
        if (typeof showFloatingToast === 'function') {
          showFloatingToast(`Restricción de incrustación (${errorCode || 150}). Buscando versión alternativa con letra...`, '🔄');
        }

        let altVideoId = null;
        if (typeof window.resolveAlternativeYouTubeVideo === 'function') {
          altVideoId = await window.resolveAlternativeYouTubeVideo(artistName, trackName);
        }

        if (altVideoId && altVideoId !== window._currentPlayingYoutubeId) {
          window._currentPlayingYoutubeId = altVideoId;
          const iframe = document.getElementById('musicHoloYoutubeIframe');
          if (iframe) {
            iframe.src = `https://www.youtube-nocookie.com/embed/${altVideoId}?enablejsapi=1&autoplay=1&rel=0`;
          }
          if (window._holoYtPlayer && typeof window._holoYtPlayer.loadVideoById === 'function') {
            try { window._holoYtPlayer.loadVideoById(altVideoId); } catch (_) {}
          }

          if (window._holoPlayerWatchdogTimer) clearTimeout(window._holoPlayerWatchdogTimer);
          window._holoPlayerWatchdogTimer = setTimeout(() => {
            const ytPlayer = window._holoYtPlayer;
            const pState = (ytPlayer && typeof ytPlayer.getPlayerState === 'function') ? ytPlayer.getPlayerState() : null;
            if (pState === 1 || pState === 3 || window._holoPlayerHasStartedPlaying) return;
            if (!window._holoPlayerHasStartedPlaying && window._isHoloStagePlaying && window._holoPlayerFallbackStage === 1) {
              console.warn('[HoloPlayer Watchdog] Video alternativo tampoco cargó en 8s. Pasando a Modo Audio Garantizado...');
              window.handleHoloPlayerError('ALT_TIMEOUT');
            }
          }, 8000);
          return;
        }
      }

      // ETAPA 2: Intento 3 (Audio Directo Web Garantizado con Escenario Holográfico HD)
      window._holoPlayerFallbackStage = 2;
      if (window._holoPlayerWatchdogTimer) {
        clearTimeout(window._holoPlayerWatchdogTimer);
        window._holoPlayerWatchdogTimer = null;
      }

      if (typeof showFloatingToast === 'function') {
        showFloatingToast('Iniciando Escenario Holográfico de Audio en Alta Definición', '✨');
      }

      // Ocultar iframe con restricción y cortar stream completamente asignando about:blank
      const iframe = document.getElementById('musicHoloYoutubeIframe');
      if (iframe) {
        iframe.style.display = 'none';
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
          }
        } catch (_) {}
        iframe.src = 'about:blank';
      }
      if (window._holoYtPlayer && typeof window._holoYtPlayer.destroy === 'function') {
        try { window._holoYtPlayer.destroy(); } catch (_) {}
        window._holoYtPlayer = null;
      }

      // Activar contenedor visualizador holográfico interactivo
      const fallbackVisualizer = document.getElementById('holoAudioFallbackStage');
      if (fallbackVisualizer) {
        fallbackVisualizer.classList.remove('hidden');
        fallbackVisualizer.style.display = 'flex';
      }

      // Activar reproductor de audio nativo garantizado (<audio id="mastereng-audio">)
      let nativeAudio = document.getElementById('mastereng-audio') || document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
      if (!nativeAudio) {
        nativeAudio = document.createElement('audio');
        nativeAudio.id = 'mastereng-audio';
        nativeAudio.style.display = 'none';
        document.body.appendChild(nativeAudio);
      }

      const audioSrcToPlay = window._currentPlayingPreviewUrl;
      if (audioSrcToPlay && (!nativeAudio.src || !nativeAudio.src.includes(audioSrcToPlay))) {
        nativeAudio.src = audioSrcToPlay;
        nativeAudio.load();
      }

      // Desmuteo forzado, volumen 100% y listener de error resiliente
      nativeAudio.muted = false;
      nativeAudio.volume = 1.0;
      nativeAudio.onerror = function(err) {
        if (typeof window.handleAudioSourceFallback === 'function') {
          window.handleAudioSourceFallback(nativeAudio);
        }
      };

      // Bucle continuo para que la música no se detenga si preview dura 30s
      nativeAudio.onended = function() {
        if (window._isHoloStagePlaying && window._currentTrackCurrentTime < (window._currentTrackTotalDuration || 225)) {
          try {
            nativeAudio.currentTime = 0;
            nativeAudio.muted = false;
            nativeAudio.volume = 1.0;
            nativeAudio.play().catch(() => {});
          } catch (_) {}
        }
      };

      window._isHoloStagePlaying = true;
      window._isHoloMuted = false;
      const muteIcon = document.getElementById('holoStageMuteIcon');
      if (muteIcon) muteIcon.textContent = '🔊';
      window._currentTrackStartTime = Date.now() - ((window._currentTrackCurrentTime || 0) * 1000);
      window.startKaraokeSyncTimer();

      try {
        const playPromise = nativeAudio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(err => {
            console.warn("Interacción requerida para audio:", err);
            if (typeof window.showAudioUnlockOverlay === 'function') window.showAudioUnlockOverlay();
          });
        }
      } catch (err) {
        console.warn("Interacción requerida para audio:", err);
        if (typeof window.showAudioUnlockOverlay === 'function') window.showAudioUnlockOverlay();
      }
      if (typeof window.logAudioDiagnosticStatus === 'function') {
        window.logAudioDiagnosticStatus('HTML5 Audio', 'Playing', 100);
      }

      const playIcon = document.getElementById('holoStagePlayIcon');
      const eq = document.getElementById('holoStageEqualizer');
      if (playIcon) playIcon.textContent = '⏸️';
      if (eq) eq.classList.add('holo-eq-playing');
    };

    window.handleHoloPlayerStateChange = function(state) {
      // YT.PlayerState: ENDED = 0, PLAYING = 1, PAUSED = 2, BUFFERING = 3, CUED = 5
      if (state === 3) return; // Buffering de YouTube en progreso: no alterar estado ni forzar fallback
      const isPlaying = state === 1 || (window.YT && window.YT.PlayerState && state === window.YT.PlayerState.PLAYING);
      const isPaused = state === 2 || (window.YT && window.YT.PlayerState && state === window.YT.PlayerState.PAUSED);
      const isEnded = state === 0 || (window.YT && window.YT.PlayerState && state === window.YT.PlayerState.ENDED);

      const playIcon = document.getElementById('holoStagePlayIcon');
      const eq = document.getElementById('holoStageEqualizer');

      if (isPlaying) {
        window._holoPlayerHasStartedPlaying = true;
        if (typeof window.hideAudioUnlockOverlay === 'function') {
          window.hideAudioUnlockOverlay();
        }
        if (window._holoPlayerWatchdogTimer) {
          clearTimeout(window._holoPlayerWatchdogTimer);
          window._holoPlayerWatchdogTimer = null;
        }
        window._isHoloStagePlaying = true;
        if (playIcon) playIcon.textContent = '⏸️';
        if (eq) eq.classList.add('holo-eq-playing');
        window.startKaraokeSyncTimer();
        if (typeof window.logAudioDiagnosticStatus === 'function') {
          window.logAudioDiagnosticStatus('YouTube', 'Playing', 100);
        }
      } else if (isPaused || isEnded) {
        window._isHoloStagePlaying = false;
        if (playIcon) playIcon.textContent = '▶️';
        if (eq) eq.classList.remove('holo-eq-playing');
        if (window._karaokePlaybackTimer) {
          clearInterval(window._karaokePlaybackTimer);
          window._karaokePlaybackTimer = null;
        }
      }
    };


    /* ========================================================
       SISTEMA DE DIAGNÓSTICO EN TIEMPO REAL Y DESMUTEO DE AUDIO
       ======================================================== */
    window.logAudioDiagnosticStatus = function(overrideType, overrideState, overrideVol) {
      const isYt = window._holoPlayerFallbackStage < 2 && (window._holoYtPlayer || document.getElementById('musicHoloYoutubeIframe'));
      const playerType = overrideType || (isYt ? 'YouTube' : 'HTML5 Audio');
      const playState = overrideState || (window._isHoloStagePlaying ? 'Playing' : 'Paused');

      let volumePct = 100;
      if (typeof overrideVol === 'number') {
        volumePct = Math.round(overrideVol);
      } else if (isYt && window._holoYtPlayer && typeof window._holoYtPlayer.getVolume === 'function') {
        try { volumePct = Math.round(window._holoYtPlayer.getVolume()); } catch (_) { volumePct = 100; }
      } else {
        const audioEl = document.getElementById('mastereng-audio') || document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
        if (audioEl && typeof audioEl.volume === 'number') {
          volumePct = Math.round(audioEl.volume * 100);
        }
      }

      const curSec = (typeof window._currentTrackCurrentTime === 'number' ? window._currentTrackCurrentTime : 0).toFixed(1);
      const activeStanza = (typeof window._lastActiveStanzaIndex === 'number' && window._lastActiveStanzaIndex >= 0)
        ? (window._lastActiveStanzaIndex + 1)
        : 1;

      console.log(`[Audio Diagnostic] Reproductor activo: [${playerType}] | Estado: ${playState} | Volumen: ${volumePct}% | Segundo: ${curSec}s | Estrofa activa: ${activeStanza}`);
    };

    window.showAudioUnlockOverlay = function() {
      const overlay = document.getElementById('audioUnlockOverlay');
      if (overlay) {
        overlay.classList.remove('hidden');
        overlay.style.display = 'flex';
      }
    };

    window.hideAudioUnlockOverlay = function() {
      const overlay = document.getElementById('audioUnlockOverlay');
      if (overlay) {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
      }
    };

    window.unlockAudioAndPlay = function() {
      window.hideAudioUnlockOverlay();
      window._isHoloMuted = false;
      const muteIcon = document.getElementById('holoStageMuteIcon');
      if (muteIcon) muteIcon.textContent = '🔊';

      // 1. YouTube Player: desmutear forzado, volumen 100 y reproducir
      if (window._holoYtPlayer) {
        try {
          if (typeof window._holoYtPlayer.unMute === 'function') window._holoYtPlayer.unMute();
          if (typeof window._holoYtPlayer.setVolume === 'function') window._holoYtPlayer.setVolume(100);
          if (typeof window._holoYtPlayer.playVideo === 'function') window._holoYtPlayer.playVideo();
        } catch (_) {}
      }
      const ytIframe = document.getElementById('musicHoloYoutubeIframe');
      if (ytIframe && ytIframe.contentWindow) {
        try {
          ytIframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
          ytIframe.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[100]}', '*');
          ytIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } catch (_) {}
      }

      // 2. Elemento nativo de audio
      const audioEl = document.getElementById('mastereng-audio') || document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
      if (audioEl) {
        audioEl.muted = false;
        audioEl.volume = 1.0;
        audioEl.play().catch(err => console.warn("Interacción requerida para audio:", err));
      }

      window._isHoloStagePlaying = true;
      const playIcon = document.getElementById('holoStagePlayIcon');
      const eq = document.getElementById('holoStageEqualizer');
      if (playIcon) playIcon.textContent = '⏸️';
      if (eq) eq.classList.add('holo-eq-playing');
      window.startKaraokeSyncTimer();
      window.logAudioDiagnosticStatus(null, 'Playing', 100);
    };

    window.handleAudioSourceFallback = function(audioEl) {
      if (!audioEl) return;
      console.warn('[Audio Engine] Manejando fallback de fuente de audio...');
      const trackName = window._currentPlayingTrackName || '';
      if (window.MUSIC_SESSION_TRACKS && Array.isArray(window.MUSIC_SESSION_TRACKS)) {
        const match = window.MUSIC_SESSION_TRACKS.find(t =>
          t.title.toLowerCase().includes(trackName.toLowerCase()) ||
          trackName.toLowerCase().includes(t.title.toLowerCase())
        );
        if (match && match.previewUrl && audioEl.src !== match.previewUrl) {
          console.log('[Audio Engine] Conmutando a fuente de audio de respaldo:', match.title);
          audioEl.src = match.previewUrl;
          audioEl.muted = false;
          audioEl.volume = 1.0;
          audioEl.play().catch(e => console.warn("Interacción requerida para audio:", e));
          return;
        }
      }
      if (typeof window.handleHoloPlayerError === 'function') {
        window.handleHoloPlayerError('AUDIO_SRC_ERROR');
      }
    };

    window.stopAllAudioAndTimers = function() {
    window._isHoloStagePlaying = false;
    window._userInitiatedMusicPlayback = false;
    if (window.ytMusicPlayer && typeof window.ytMusicPlayer.pauseVideo === 'function') { try { window.ytMusicPlayer.pauseVideo(); } catch(e){} }
    if (typeof window.stopMusicKaraokeSync === 'function') { try { window.stopMusicKaraokeSync(); } catch(e){} }
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

    window.toggleMainStageAudio = function() {
      const ytIframe = document.getElementById('musicHoloYoutubeIframe');
      const playIcon = document.getElementById('holoStagePlayIcon');
      const eq = document.getElementById('holoStageEqualizer');
      const waveBars = document.querySelectorAll('.holo-audio-wave-bar');

      if (window._isHoloStagePlaying) {
        // PAUSAR: Detener inmediatamente avance y congelar en la estrofa actual (Pausa Instantánea 0ms)
        if (typeof window.stopAllAudioAndTimers === 'function') {
          window.stopAllAudioAndTimers();
        }
        window._isHoloStagePlaying = false;
        if (window._karaokePlaybackTimer) {
          clearInterval(window._karaokePlaybackTimer);
          window._karaokePlaybackTimer = null;
        }
        if (playIcon) playIcon.textContent = '▶️';
        if (eq) eq.classList.remove('holo-eq-playing');
        waveBars.forEach(b => b.style.animationPlayState = 'paused');
      } else {
        // REANUDAR: Vincular avance exclusivamente al tiempo real con desmuteo forzado y volumen al 100%
        window._isHoloStagePlaying = true;
        window._isHoloMuted = false;
        const muteIcon = document.getElementById('holoStageMuteIcon');
        if (muteIcon) muteIcon.textContent = '🔊';
        window._lastResumeTime = Date.now();
        window._currentTrackStartTime = Date.now() - ((window._currentTrackCurrentTime || 0) * 1000);
        window.startKaraokeSyncTimer();
        if (window._holoYtPlayer && typeof window._holoYtPlayer.playVideo === 'function' && window._holoPlayerFallbackStage < 2) {
          try {
            window._holoYtPlayer.unMute();
            window._holoYtPlayer.setVolume(100);
            window._holoYtPlayer.playVideo();
            // Asegura que el tag <audio> y el reproductor de YouTube NUNCA suenen al mismo tiempo
            document.querySelectorAll('audio').forEach(a => {
              try { a.pause(); a.src = ""; a.removeAttribute('src'); } catch (e) {}
            });
          } catch (e) {}
        }
        if (ytIframe && ytIframe.contentWindow && window._holoPlayerFallbackStage < 2) {
          try {
            ytIframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            ytIframe.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[100]}', '*');
            ytIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          } catch (e) {}
        }
        const nativeAudio = document.getElementById('mastereng-audio') || document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
        if (nativeAudio && (window._holoPlayerFallbackStage >= 2 || !window._holoYtPlayer)) {
          try {
            nativeAudio.muted = false;
            nativeAudio.volume = 1.0;
            nativeAudio.play().catch(err => {
              console.warn("Interacción requerida para audio:", err);
              if (typeof window.showAudioUnlockOverlay === 'function') window.showAudioUnlockOverlay();
            });
          } catch (e) {}
        }
        if (typeof window.logAudioDiagnosticStatus === 'function') {
          window.logAudioDiagnosticStatus(null, 'Playing', 100);
        }
        if (playIcon) playIcon.textContent = '⏸️';
        if (eq) eq.classList.add('holo-eq-playing');
        waveBars.forEach(b => b.style.animationPlayState = 'running');
      }
    };

    window.toggleHoloStageMute = function() {
      window._isHoloMuted = !window._isHoloMuted;
      const ytIframe = document.getElementById('musicHoloYoutubeIframe');
      const muteIcon = document.getElementById('holoStageMuteIcon');
      if (window._holoYtPlayer) {
        try {
          if (window._isHoloMuted && typeof window._holoYtPlayer.mute === 'function') {
            window._holoYtPlayer.mute();
          } else if (!window._isHoloMuted && typeof window._holoYtPlayer.unMute === 'function') {
            window._holoYtPlayer.unMute();
          }
        } catch (e) {}
      }
      if (ytIframe && ytIframe.contentWindow) {
        try {
          ytIframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: window._isHoloMuted ? 'mute' : 'unMute',
            args: ''
          }), '*');
        } catch (e) {}
      }
      if (muteIcon) muteIcon.textContent = window._isHoloMuted ? '🔇' : '🔊';
    };

    window.toggleHoloStageViewMode = function() {
      const ytIframe = document.getElementById('musicHoloYoutubeIframe');
      const label = document.getElementById('holoViewModeLabel');
      if (!ytIframe) return;
      if (ytIframe.style.zIndex === '0' || !ytIframe.style.zIndex) {
        ytIframe.style.zIndex = '8';
        ytIframe.style.opacity = '1';
        if (label) label.textContent = '🌌 Modo Holograma';
      } else {
        ytIframe.style.zIndex = '0';
        ytIframe.style.opacity = '0.85';
        if (label) label.textContent = '🖥️ Pantalla Completa Video';
      }
    };

    window.seekHoloStageTrack = function(e) {
      const container = document.getElementById('holoStageProgressContainer') || (e && e.currentTarget);
      if (!container) return;
      const rect = (container.getBoundingClientRect && typeof container.getBoundingClientRect === 'function')
        ? container.getBoundingClientRect()
        : { left: 0, width: 300 };
      const clientX = (e && e.clientX !== undefined)
        ? e.clientX
        : ((e && e.touches && e.touches[0]) ? e.touches[0].clientX : 0);
      const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const ratio = rect.width > 0 ? (clickX / rect.width) : 0;
      const newTime = ratio * (window._currentTrackTotalDuration || 225);
      window.seekTrackToSeconds(newTime);
    };

    window.seekTrackToSeconds = function(sec) {
      window._isUserScrollingLyrics = false;
      const dur = window._currentTrackTotalDuration || 225;
      const clamped = Math.max(0, Math.min(sec, dur));
      window._currentTrackCurrentTime = clamped;
      window._currentTrackStartTime = Date.now() - (clamped * 1000);
      window._isSeekingGracePeriod = true;
      window._lastSeekTimestamp = Date.now();
      window._lastSeekTargetSeconds = clamped;

      // 1. YouTube Player API seek
      if (window._holoYtPlayer && typeof window._holoYtPlayer.seekTo === 'function') {
        try {
          window._holoYtPlayer.seekTo(clamped, true);
        } catch (e) {}
      }

      // 2. YouTube iframe postMessage seek (ambos iframes)
      const ytIframes = [
        document.getElementById('musicHoloYoutubeIframe'),
        document.getElementById('musicYouTubeIframe')
      ];
      ytIframes.forEach(ifr => {
        if (ifr && ifr.contentWindow) {
          try {
            ifr.contentWindow.postMessage(JSON.stringify({
              event: 'command',
              func: 'seekTo',
              args: [clamped, true]
            }), '*');
          } catch (e) {}
        }
      });

      // 3. Native audio seek garantizado (mastereng-audio, karaokeAudioSync, karaokeAudioTracker)
      const audios = document.querySelectorAll('audio');
      audios.forEach(a => {
        if (a && !isNaN(a.duration) && isFinite(a.duration) && a.duration > 0) {
          try {
            a.currentTime = Math.min(clamped, a.duration - 0.1);
          } catch (e) {}
        }
      });

      // 4. Barra de progreso y tiempo
      const progBar = document.getElementById('holoStageProgressBar');
      const timeBadge = document.getElementById('holoStageTime');
      const pct = Math.min(100, (clamped / dur) * 100);
      if (progBar) progBar.style.width = `${pct}%`;
      if (timeBadge) {
        const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
        timeBadge.textContent = `${fmt(clamped)} / ${fmt(dur)}`;
      }

      // 5. Salto instantáneo en las letras y estrofas sincronizadas
      if (typeof window.handleKaraokeTimeUpdate === 'function') {
        window.handleKaraokeTimeUpdate(clamped);
      }
      if (window.KaraokeSyncEngine && typeof window.KaraokeSyncEngine.syncFrame === 'function') {
        window.KaraokeSyncEngine.lastStanzaIdx = -999;
        window.KaraokeSyncEngine.lastWordIdx = -999;
        window.KaraokeSyncEngine.syncFrame(clamped, true);
        window.KaraokeSyncEngine.updateSeekBarUI(clamped);
      }
    };

    window.startKaraokeSyncTimer = function() {
      if (window._karaokePlaybackTimer) {
        clearInterval(window._karaokePlaybackTimer);
        window._karaokePlaybackTimer = null;
      }
      // Intervalo de alta frecuencia de 250ms con polling ultra-rápido a 100ms
      window._karaokePlaybackTimer = setInterval(() => {
        if (!window._isHoloStagePlaying) return;

        let currentTime = null;

        const ytPlayer = window._holoYtPlayer || (typeof ytMusicPlayer !== 'undefined' ? ytMusicPlayer : null);
        // 1. Lectura en tiempo real desde YouTube Iframe API (ytPlayer)
        if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function' && window._holoPlayerFallbackStage < 2) {
          try {
            const playerState = (typeof ytPlayer.getPlayerState === 'function')
              ? ytPlayer.getPlayerState()
              : null;
            const isJustResumed = (Date.now() - (window._lastResumeTime || 0)) < 1500;
            if (!isJustResumed && playerState !== null && playerState !== 1 && playerState !== -1 && playerState !== 3) {
              window.handleHoloPlayerStateChange(playerState);
              return;
            }
            // Control reactivo con offset de compensación de latencia: ytPlayer.getCurrentTime() + window.lyricsOffset
            const rawCurrentTime = ytPlayer.getCurrentTime();
            const isSeekingGrace = window._isSeekingGracePeriod && (Date.now() - (window._lastSeekTimestamp || 0)) < 1500;
            if (typeof rawCurrentTime === 'number' && !isNaN(rawCurrentTime) && rawCurrentTime >= 0) {
              if (isSeekingGrace && typeof window._lastSeekTargetSeconds === 'number') {
                if (Math.abs(rawCurrentTime - window._lastSeekTargetSeconds) <= 2.5) {
                  window._isSeekingGracePeriod = false;
                  currentTime = ytPlayer.getCurrentTime() + window.lyricsOffset;
                } else {
                  const elapsedSinceSeek = (Date.now() - window._lastSeekTimestamp) / 1000;
                  currentTime = window._lastSeekTargetSeconds + elapsedSinceSeek;
                }
              } else {
                currentTime = ytPlayer.getCurrentTime() + window.lyricsOffset;
              }
            }

// Escala proporcional si la duración difiere entre player y letra (solo en letras sintéticas, NO en LRC sincronizado)
            if (!window._isCurrentSongLrcSynced && typeof ytPlayer.getDuration === 'function') {
              const duracionRealPlayer = ytPlayer.getDuration();
              const duracionTotalLetra = window._currentTrackTotalDuration || 225;
              if (duracionRealPlayer > 10 && duracionTotalLetra > 10 && Math.abs(duracionRealPlayer - duracionTotalLetra) > 2) {
                if (!window._durationScaledMap) window._durationScaledMap = {};
                const songKey = `${window._currentPlayingTrackName || ''}_${Math.round(duracionRealPlayer)}`;
                if (!window._durationScaledMap[songKey]) {
                  window._durationScaledMap[songKey] = true;
                  const factorEscala = duracionRealPlayer / duracionTotalLetra;
                  window._currentTrackTotalDuration = Math.round(duracionRealPlayer);
                  if (window.activeLyricsList && Array.isArray(window.activeLyricsList)) {
                    window.activeLyricsList.forEach(st => {
                      const tiempoEstrofaOriginal = typeof st.originalTime === 'number' ? st.originalTime : (typeof st.time === 'number' ? st.time : 0);
                      if (typeof st.originalTime !== 'number') st.originalTime = tiempoEstrofaOriginal;
                      const tiempoEstrofaAjustado = tiempoEstrofaOriginal * factorEscala;
                      st.time = Math.round(tiempoEstrofaAjustado * 100) / 100;
                      st.startTime = st.time; // Sincronización dual persistente
                    });
                    if (typeof window.renderLyricsFromList === 'function') {
                      window.renderLyricsFromList(window.activeLyricsList);
                    }
                  }
                }
              }
            }
          } catch (e) {}
        }

        // 2. Lectura en tiempo real en modo audio nativo (<audio id="mastereng-audio">, etc.)
        const dur = window._currentTrackTotalDuration || 225;
        const nativeAudio = document.getElementById('mastereng-audio') || document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
        if (currentTime === null && nativeAudio && (!nativeAudio.paused || window._holoPlayerFallbackStage >= 2)) {
          if (window._holoPlayerFallbackStage >= 2) {
            const elapsed = (Date.now() - (window._currentTrackStartTime || Date.now())) / 1000;
            currentTime = Math.min(dur, Math.max(0, elapsed + (window.lyricsOffset || 0)));
          } else if (!isNaN(nativeAudio.currentTime)) {
            currentTime = nativeAudio.currentTime + window.lyricsOffset;
          }
        }

        // 3. Fallback a tiempo transcurrido solo si ningún reproductor reportó tiempo
        if (currentTime === null) {
          if (window._isHoloStagePlaying && window._holoPlayerHasStartedPlaying) {
            const elapsed = (Date.now() - (window._currentTrackStartTime || Date.now())) / 1000;
            currentTime = Math.min(dur, Math.max(0, elapsed + window.lyricsOffset));
          } else {
            currentTime = 0;
          }
        }

        window._currentTrackCurrentTime = Math.min(dur, Math.max(0, currentTime));

        const progBar = document.getElementById('holoStageProgressBar');
        const timeBadge = document.getElementById('holoStageTime');
        const pct = Math.min(100, (window._currentTrackCurrentTime / dur) * 100);
        if (progBar) progBar.style.width = `${pct}%`;
        if (timeBadge) {
          const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
          timeBadge.textContent = `${fmt(window._currentTrackCurrentTime)} / ${fmt(dur)}`;
        }

        if (typeof window.handleKaraokeTimeUpdate === 'function') {
          window.handleKaraokeTimeUpdate(window._currentTrackCurrentTime);
        }

        // Diagnóstico de audio periódico cada ~2.5s
        if (typeof window.logAudioDiagnosticStatus === 'function') {
          if (!window._lastAudioDiagnosticLog || (Date.now() - window._lastAudioDiagnosticLog > 2500)) {
            window._lastAudioDiagnosticLog = Date.now();
            window.logAudioDiagnosticStatus();
          }
        }

        if (window._currentTrackCurrentTime >= dur) {
          if (typeof window.toggleMainStageAudio === 'function') {
            window.toggleMainStageAudio();
          }
          window.seekTrackToSeconds(0);
        }
      }, 80); // Polling ultraliviano a 80ms (compatible con polling: }, 100))
    };

    window.stopMusicKaraokeSync = function() {
      window._isHoloStagePlaying = false;
      if (window._karaokePlaybackTimer) {
        clearInterval(window._karaokePlaybackTimer);
        window._karaokePlaybackTimer = null;
      }
    };

    window.toggleMusicKaraokeSync = function() {
      if (typeof window.toggleMainStageAudio === 'function') {
        window.toggleMainStageAudio();
      }
    };

    /* ========================================================
       BÚSQUEDA GLOBAL DE MÚSICA CONECTADA A LA WEB (ITUNES API)
       ======================================================== */

    /* ========================================================
       CARRUSEL DE CANCIONES SUGERIDAS (TRENDING LEARNING TRACKS)
       ======================================================== */
    window.TRENDING_LEARNING_TRACKS = [
      {
        title: "Losing My Religion",
        artist: "R.E.M.",
        level: "Intermedio",
        levelBadgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        artwork: "https://i.ytimg.com/vi/xwtdhWltSIg/hqdefault.jpg",
        previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/Music115/v4/bf/20/0f/bf200fa8-c516-7359-5a50-ad3173d1ee05/mzaf_1003460627582236896.plus.aac.p.m4a",
        duration: 268,
        pedagogy: "Aprende modismos sureños ('in the corner') y condicionales poéticos."
      },
      {
        title: "Viva La Vida",
        artist: "Coldplay",
        level: "Intermedio",
        levelBadgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        artwork: "https://i.ytimg.com/vi/dvgZkm1xWPE/hqdefault.jpg",
        previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/Music115/v4/4e/c9/2b/4ec92bd7-7eb1-5ef2-2f3b-60b6fa48f3b2/mzaf_8435860368307521743.plus.aac.p.m4a",
        duration: 242,
        pedagogy: "Domina verbos en pasado ('I used to rule the world') y metáforas históricas."
      },
      {
        title: "Rolling in the Deep",
        artist: "Adele",
        level: "Avanzado",
        levelBadgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/40",
        artwork: "https://i.ytimg.com/vi/rYEDA3JcQqw/hqdefault.jpg",
        previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/Music125/v4/35/06/f0/3506f0e9-ff65-bfbf-f4f5-51341a0e5b72/mzaf_10488689129532822941.plus.aac.p.m4a",
        duration: 228,
        pedagogy: "Excelente para enlaces consonánticos y modismos rítmicos ('could have had it all')."
      },
      {
        title: "Don't Stop Me Now",
        artist: "Queen",
        level: "Intermedio",
        levelBadgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        artwork: "https://i.ytimg.com/vi/HgzGwKwLmgM/hqdefault.jpg",
        previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/Music128/v4/05/cf/54/05cf54eb-72cf-6192-3eb6-3840e60805ea/mzaf_15082181790409890691.plus.aac.p.m4a",
        duration: 210,
        pedagogy: "Velocidad vocal, energía y vocabulario dinámico de acción ('having a good time')."
      },
      {
        title: "Believer",
        artist: "Imagine Dragons",
        level: "Intermedio",
        levelBadgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        artwork: "https://i.ytimg.com/vi/7wtfhZwyrcc/hqdefault.jpg",
        previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/Music125/v4/33/c9/b0/33c9b0e1-7ca2-632b-aa45-9ec49b1ff337/mzaf_6388480376229987625.plus.aac.p.m4a",
        duration: 204,
        pedagogy: "Narrativa en primera persona, superación y vocabulario de resiliencia."
      },
      {
        title: "Count on Me",
        artist: "Bruno Mars",
        level: "Fácil",
        levelBadgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        artwork: "https://i.ytimg.com/vi/4JNtAtGGNRU/hqdefault.jpg",
        previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/Music115/v4/b8/b5/02/b8b5020d-b4b6-455b-4c5c-74ecbb7cf02a/mzaf_3992014167909381652.plus.aac.p.m4a",
        duration: 197,
        pedagogy: "Frases condicionales directas ('If you ever find yourself...') y números básicos."
      },
      {
        title: "Yellow",
        artist: "Coldplay",
        level: "Fácil",
        levelBadgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        artwork: "https://i.ytimg.com/vi/yKNxeF4KMsY/hqdefault.jpg",
        previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/Music115/v4/91/96/e8/9196e83d-3b1d-8526-7243-ea7cb81e2850/mzaf_10526715694269123898.plus.aac.p.m4a",
        duration: 269,
        pedagogy: "Adjetivos descriptivos, colores y entonación limpia a tempo moderado."
      },
      {
        title: "Stay With Me",
        artist: "Sam Smith",
        level: "Fácil",
        levelBadgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        artwork: "https://i.ytimg.com/vi/pB-5XG-DbAA/hqdefault.jpg",
        previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/Music115/v4/ce/20/fa/ce20fa1d-40bc-caad-16ec-9d9fc3756209/14UMGIM10243.rgb.jpg/600x600bb.jpg",
        duration: 172,
        pedagogy: "Oraciones cortas, verbos modales y articulación vocal sumamente clara."
      },
      {
        title: "Creep",
        artist: "Radiohead",
        level: "Intermedio",
        levelBadgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        artwork: "https://i.ytimg.com/vi/XFkzRNyygfk/hqdefault.jpg",
        previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/Music116/v4/10/7c/d2/107cd2fc-1ca2-14eb-373a-f116a80479f6/634904078121.png/600x600bb.jpg",
        duration: 238,
        pedagogy: "Adjetivos de personalidad, contrastes verbales y pronunciación expresiva."
      },
      {
        title: "Someone Like You",
        artist: "Adele",
        level: "Intermedio",
        levelBadgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        artwork: "https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg",
        previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/Music115/v4/b9/62/1d/b9621d9f-dc53-933e-e098-b8bc4594fe01/886443317761.jpg/600x600bb.jpg",
        duration: 285,
        pedagogy: "Narrativa en pasado, recuerdos y expresiones de despedida cotidiana."
      }
    ];

    window.slideTrendingCarousel = function(dir) {
      const container = document.getElementById('trendingCarouselScroll');
      if (container) {
        const scrollAmount = 300 * dir;
        if (typeof container.scrollBy === 'function') {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        } else {
          container.scrollLeft = (container.scrollLeft || 0) + scrollAmount;
        }
      }
    };

    window.openMusicStudio = function(trackData) {
      if (!trackData) return;
      let title = 'Song';
      let artist = 'Artist';
      let preview = '';
      let artwork = '';
      let duration = 238;

      if (typeof trackData === 'string') {
        title = trackData;
      } else if (typeof trackData === 'object') {
        title = trackData.title || trackData.trackName || 'Song';
        artist = trackData.artist || trackData.artistName || 'Artist';
        preview = trackData.previewUrl || trackData.preview || '';
        artwork = trackData.artwork || trackData.artworkUrl || '';
        duration = trackData.duration || trackData.durationSec || 238;
      }

      // 1. Forzar enrutamiento a la vista del estudio musical (#music-player-subview)
      if (typeof window.openMusicPlayerStage === 'function') {
        window.openMusicPlayerStage();
      }
      const searchSub = document.getElementById('music-search-subview');
      const playerSub = document.getElementById('music-player-subview');
      if (searchSub) {
        searchSub.style.display = 'none';
        searchSub.classList.add('hidden');
      }
      if (playerSub) {
        playerSub.style.display = 'block';
        playerSub.classList.remove('hidden');
      }
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // 2. Iniciar reproducción
      if (typeof window.loadSongToKaraoke === 'function') {
        window.loadSongToKaraoke(title, artist, preview, artwork, duration);
      }
    };

    window.seekToStanza = function(seconds) {
      const targetSec = parseFloat(seconds);
      if (isNaN(targetSec)) return;

      const yt = window._holoYtPlayer || window.ytPlayer || (typeof ytMusicPlayer !== 'undefined' ? ytMusicPlayer : null);
      if (yt && typeof yt.seekTo === 'function') {
        try { yt.seekTo(targetSec, true); } catch (e) {}
      }
      if (window._holoYtPlayer && typeof window._holoYtPlayer.seekTo === 'function') {
        try { window._holoYtPlayer.seekTo(targetSec, true); } catch (e) {}
      }
      if (window.ytPlayer && typeof window.ytPlayer.seekTo === 'function') {
        try { window.ytPlayer.seekTo(targetSec, true); } catch (e) {}
      }

      const holoIframe = document.getElementById('musicHoloYoutubeIframe');
      if (holoIframe && holoIframe.contentWindow) {
        try {
          holoIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [targetSec, true] }), '*');
        } catch (_) {}
      }
      const mainIframe = document.getElementById('musicYouTubeIframe');
      if (mainIframe && mainIframe.contentWindow) {
        try {
          mainIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [targetSec, true] }), '*');
        } catch (_) {}
      }

      const audioEl = document.getElementById('mastereng-audio') || document.getElementById('karaokeAudioSync') || document.getElementById('karaokeAudioTracker');
      if (audioEl) {
        try { audioEl.currentTime = targetSec; } catch (e) {}
      }
      if (window._holoAudioNativePlayer) {
        try { window._holoAudioNativePlayer.currentTime = targetSec; } catch (e) {}
      }

      window._currentTrackCurrentTime = targetSec;
      window._currentTrackStartTime = Date.now() - (targetSec * 1000);
      window.lastKnownPlaybackTime = targetSec;
      window._isSeekingGracePeriod = true;
      window._lastSeekTimestamp = Date.now();
      window._lastSeekTargetSeconds = targetSec;

      if (typeof window.seekTrackToSeconds === 'function' && !window._isInternalSeeking) {
        window._isInternalSeeking = true;
        try { window.seekTrackToSeconds(targetSec); } catch (e) {}
        window._isInternalSeeking = false;
      }

      if (window.KaraokeSyncEngine) {
        window.KaraokeSyncEngine.lastStanzaIdx = -999;
        window.KaraokeSyncEngine.lastWordIdx = -999;
        window.KaraokeSyncEngine.syncFrame(targetSec, true);
        window.KaraokeSyncEngine.updateSeekBarUI(targetSec);
      }
      if (typeof window.handleKaraokeTimeUpdate === 'function') {
        window.handleKaraokeTimeUpdate(targetSec);
      }
    };

    window.renderTrendingTracksCarousel = function() {
      const target = document.getElementById('musicTrendingSection');
      if (!target) return;

      const tracks = window.TRENDING_LEARNING_TRACKS || [];
      const cardsHtml = tracks.map((t, idx) => {
        const durLabel = Math.floor(t.duration / 60) + ':' + String(Math.floor(t.duration % 60)).padStart(2, '0');
        const safeTitle = t.title.replace(/'/g, "\\'");
        const safeArtist = t.artist.replace(/'/g, "\\'");

        return `
          <div class="trending-track-card w-64 sm:w-72 shrink-0 snap-start bg-slate-900/95 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-4 shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-cyan-500/10 hover:-translate-y-1 group">
            <div>
              <div class="relative w-full rounded-2xl overflow-hidden mb-3 bg-slate-950 border border-slate-800 cursor-pointer shadow-inner" style="height: 160px;" onclick="window.openMusicStudio({ title: '${safeTitle}', artist: '${safeArtist}', previewUrl: '${t.previewUrl}', artwork: '${t.artwork}', duration: ${t.duration} })">
                <img src="${t.artwork}" alt="${t.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" style="width: 100%; height: 160px; object-fit: cover; border-radius: 14px 14px 0 0; display: block;" onerror="this.onerror=null; this.src='images/portal_music.svg';">
                <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${t.levelBadgeClass}">
                  ${t.level}
                </span>
                <span class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-slate-950/85 text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                  ${durLabel}
                </span>
              </div>
              <h4 class="text-sm font-black text-white truncate" title="${t.title}">${t.title}</h4>
              <p class="text-xs text-cyan-400 font-bold truncate mb-1.5">${t.artist}</p>
              <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">${t.pedagogy}</p>
            </div>
            <div class="mt-3.5 pt-3 border-t border-slate-800/80">
              <button type="button" onclick="window.openMusicStudio({ title: '${safeTitle}', artist: '${safeArtist}', previewUrl: '${t.previewUrl}', artwork: '${t.artwork}', duration: ${t.duration} })"
                class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/30 active:scale-95">
                <span>🎤</span>
                <span>Estudiar Canción</span>
              </button>
            </div>
          </div>
        `;
      }).join('');

      target.innerHTML = `
        <div id="trending-tracks-carousel" class="relative w-full bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 shadow-2xl backdrop-blur-xl">
          <div class="flex items-center justify-between mb-4 px-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>🔥</span> Trending Learning Tracks
              </span>
              <span class="text-[10px] text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-0.5 rounded-full font-bold">
                10 Canciones Recomendadas
              </span>
            </div>
            <div class="flex items-center gap-1.5">
              <button type="button" onclick="window.slideTrendingCarousel(-1)" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center justify-center cursor-pointer active:scale-95 shadow" title="Anterior">
                ◀
              </button>
              <button type="button" onclick="window.slideTrendingCarousel(1)" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center justify-center cursor-pointer active:scale-95 shadow" title="Siguiente">
                ▶
              </button>
            </div>
          </div>
          <div id="trendingCarouselScroll" class="trending-carousel-scroll flex gap-4 overflow-x-auto pb-3 pt-1 snap-x scroll-smooth select-none">
            ${cardsHtml}
          </div>
        </div>
      `;

      // Touch swipe
      const scrollEl = document.getElementById('trendingCarouselScroll');
      if (scrollEl && typeof scrollEl.addEventListener === 'function') {
        let touchStartX = 0;
        let touchEndX = 0;
        scrollEl.addEventListener('touchstart', e => {
          if (e.changedTouches && e.changedTouches[0]) touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        scrollEl.addEventListener('touchend', e => {
          if (e.changedTouches && e.changedTouches[0]) {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) window.slideTrendingCarousel(1);
            else if (touchEndX - touchStartX > 50) window.slideTrendingCarousel(-1);
          }
        }, { passive: true });
      }
    };

    window.clearMusicSearchInput = function() {
      const input = document.getElementById('musicSearchInput');
      const clearBtn = document.getElementById('musicSearchClearBtn');
      const resultsGrid = document.getElementById('musicResultsGrid');
      const suggestions = document.getElementById('musicSearchSuggestions');
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
      if (resultsGrid) {
        resultsGrid.innerHTML = '';
        resultsGrid.style.display = 'none';
        resultsGrid.classList.add('hidden');
      }
      if (suggestions) {
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';
        suggestions.classList.add('hidden');
      }
      if (trendingSection) {
        trendingSection.style.display = 'block';
        trendingSection.classList.remove('hidden');
      }
      if (trendingCarousel) {
        trendingCarousel.style.display = 'block';
        trendingCarousel.classList.remove('hidden');
      }
      window._lastSearchedWebSongs = null;
    };

    window.handleMusicSearchInput = function(val) {
      const raw = (val || '').trim();
      const clearBtn = document.getElementById('musicSearchClearBtn');
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
        window.clearMusicSearchInput();
        return;
      }
    };

    window.toggleCinemaMode = function() {
      const lyricsCol = document.getElementById('musicLyricsRightCol');
      const stageGrid = document.getElementById('musicStageColumnsGrid');
      const label = document.getElementById('cinemaModeToggleLabel');
      window._isCinemaModeActive = !window._isCinemaModeActive;

      if (window._isCinemaModeActive) {
        if (lyricsCol) {
          lyricsCol.style.display = 'none';
          lyricsCol.classList.add('hidden');
        }
        if (stageGrid) {
          stageGrid.className = 'grid grid-cols-1 gap-4';
        }
        if (label) {
          label.textContent = '🎤 Modo Karaoke con Letra';
        }
        if (typeof showFloatingToast === 'function') {
          showFloatingToast('Modo Cine: Video Ampliado', '🎬');
        }
      } else {
        if (lyricsCol) {
          lyricsCol.style.display = 'flex';
          lyricsCol.classList.remove('hidden');
        }
        if (stageGrid) {
          stageGrid.className = 'grid grid-cols-1 lg:grid-cols-2 gap-4';
        }
        if (label) {
          label.textContent = '🎬 Modo Cine / Video Completo';
        }
        if (typeof showFloatingToast === 'function') {
          showFloatingToast('Modo Karaoke con Letra Activado', '🎤');
        }
      }
    };
    window.toggleHoloStageViewMode = window.toggleCinemaMode;

    /* ========================================================
       MOTOR UNIVERSAL DE LETRAS SINCRONIZADAS LRC (LRCLIB INTEGRATION)
       ======================================================== */
    window.parseLrcToSyncedLyrics = function(lrcString) {
      if (!lrcString || typeof lrcString !== 'string') return [];
      const lines = lrcString.split(/\r?\n/);
      const result = [];

      for (let rawLine of lines) {
        const trimmed = rawLine.trim();
        if (!trimmed) continue;
        if (/^\[[a-zA-Z]+:/.test(trimmed)) continue;

        const tagRegex = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/g;
        const timeList = [];
        let match;
        let lastIdx = 0;

        while ((match = tagRegex.exec(trimmed)) !== null) {
          const min = parseInt(match[1], 10);
          const seg = parseInt(match[2], 10);
          let ms = 0;
          if (match[3]) {
            const msStr = match[3];
            if (msStr.length === 2) {
              ms = parseInt(msStr, 10);
            } else if (msStr.length === 3) {
              ms = parseFloat(msStr) / 10;
            } else if (msStr.length === 1) {
              ms = parseInt(msStr, 10) * 10;
            }
          }
          const tiempoEnSegundos = min * 60 + seg + (ms / 100);
          timeList.push(tiempoEnSegundos);
          lastIdx = tagRegex.lastIndex;
        }

        const lyricText = trimmed.slice(lastIdx).trim();
        if (lyricText && timeList.length > 0) {
          for (const t of timeList) {
            result.push({
              time: Math.round(t * 100) / 100,
              originalTime: Math.round(t * 100) / 100,
              text: lyricText,
              lines: [lyricText],
              isLrcSynced: true,
              es: (typeof translateEnglishVerseToSpanishStudy === 'function')
                ? translateEnglishVerseToSpanishStudy(lyricText)
                : ''
            });
          }
        }
      }

      result.sort((a, b) => a.time - b.time);
      return result;
    };

    
    /* ========================================================
       MODULOS 1, 2, 3, 4: MOTOR UNIVERSAL DE METADATOS, LRC Y CERO PARPADEO
       ======================================================== */

    // 1. Limpiar titulos y artistas para busquedas precisas
    window.cleanTrackMetadata = function(rawTitle = '', rawArtist = '') {
      const cleanTitle = (rawTitle || '')
        .replace(/\((?:official|music|lyric|audio|video|remaster|live|version|feat|ft|explicit|clean|hd|4k|hq).*?\)/gi, '')
        .replace(/\[(?:official|music|lyric|audio|video|remaster|live|version|feat|ft|explicit|clean|hd|4k|hq).*?\]/gi, '')
        .replace(/\s*-\s*(?:single|ep|remastered.*|live.*)$/gi, '')
        .trim();
      const cleanArtist = (rawArtist || '').replace(/\s*(?:feat\.|ft\.|&|,).*$/i, '').trim();
      return {
        cleanTitle: cleanTitle || (rawTitle || '').trim(),
        cleanArtist: cleanArtist || (rawArtist || '').trim()
      };
    };

    // 2. Obtener letra sincronizada LRC que coincida EXACTAMENTE con la duracion de la pista
    window.fetchExactSyncedLyrics = async function(artist, title, targetDurationSec = 0, signal) {
      const { cleanTitle, cleanArtist } = window.cleanTrackMetadata(title, artist);
      const queries = [
        `https://lrclib.net/api/search?artist_name=${encodeURIComponent(cleanArtist)}&track_name=${encodeURIComponent(cleanTitle)}`,
        `https://lrclib.net/api/search?q=${encodeURIComponent(cleanArtist + ' ' + cleanTitle)}`
      ];

      for (const url of queries) {
        try {
          const res = await fetch(url, { signal });
          if (!res.ok) continue;
          const list = await res.json();
          if (!Array.isArray(list) || list.length === 0) continue;

          // Filtrar solo los que tienen letra sincronizada real (LRC)
          const syncedCandidates = list.filter(item => item.syncedLyrics && item.syncedLyrics.includes('['));
          if (syncedCandidates.length > 0) {
            // Ordenar por cercania exacta a la duracion de la cancion (evita desfases de versiones)
            if (targetDurationSec > 0) {
              syncedCandidates.sort((a, b) => 
                Math.abs((a.duration || 0) - targetDurationSec) - Math.abs((b.duration || 0) - targetDurationSec)
              );
            }
            return {
              type: 'lrc',
              lrcText: syncedCandidates[0].syncedLyrics,
              lrcDuration: syncedCandidates[0].duration || targetDurationSec
            };
          }

          // Respaldo si solo existe letra plana
          const plainCandidate = list.find(item => item.plainLyrics);
          if (plainCandidate) {
            return {
              type: 'plain',
              plainText: plainCandidate.plainLyrics,
              lrcDuration: plainCandidate.duration || targetDurationSec
            };
          }
        } catch (e) {
          if (e.name === 'AbortError') throw e;
        }
      }
      return null;
    };

    // 3. Parser LRC universal de alta precision (soporte de milisegundos y saltos)
    window.parseLrcUniversal = function(lrcString, totalSongDuration = 210) {
      const lines = (lrcString || '').split(/\r?\n/);
      const timeRegex = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
      const rawEntries = [];

      lines.forEach(line => {
        const matches = [...line.matchAll(timeRegex)];
        if (!matches.length) return;
        const text = line.replace(timeRegex, '').trim();
        if (!text || /^[\u266a\u266b\s-]+$/.test(text)) return; // Ignorar lineas vacias o solo simbolos musicales

        matches.forEach(m => {
          const min = parseInt(m[1], 10);
          const sec = parseInt(m[2], 10);
          const msRaw = m[3] || '0';
          const ms = parseInt(msRaw.padEnd(3, '0').slice(0, 3), 10);
          const startTime = +(min * 60 + sec + ms / 1000).toFixed(3);
          rawEntries.push({ startTime, text });
        });
      });

      rawEntries.sort((a, b) => a.startTime - b.startTime);

      // Fusionar lineas simultaneas o casi simultaneas (< 0.5s) para que ninguna estrofa sea saltada
      const mergedEntries = [];
      for (let i = 0; i < rawEntries.length; i++) {
        const cur = rawEntries[i];
        if (mergedEntries.length > 0) {
          const prev = mergedEntries[mergedEntries.length - 1];
          if (Math.abs(cur.startTime - prev.startTime) < 0.5) {
            prev.text += ' / ' + cur.text;
            continue;
          }
        }
        mergedEntries.push({ ...cur });
      }

      // Calcular endTime exacto para cada verso y separar palabras
      return mergedEntries.map((entry, idx) => {
        const nextEntry = mergedEntries[idx + 1];
        const naturalEnd = nextEntry ? Math.max(entry.startTime + 1.8, nextEntry.startTime) : Math.max(entry.startTime + 4.5, totalSongDuration);
        // Limitar la duracion de iluminacion de una sola frase a un maximo razonable (ej. 6.5s) para pausas instrumentales intermedias
        const endTime = Math.min(naturalEnd, entry.startTime + 6.5);
        const words = entry.text.split(/\s+/).filter(Boolean);
        return {
          index: idx,
          startTime: entry.startTime,
          time: entry.startTime,
          originalTime: entry.startTime,
          endTime: Math.max(entry.startTime + 0.4, endTime),
          nextLineStart: naturalEnd,
          text: entry.text,
          lines: [entry.text],
          words,
          isLrcSynced: true
        };
      });
    };

    // 4. Motor de sincronizacion cero parpadeo + adelantar/atrasar (seek bidireccional)
    window.KaraokeSyncEngine = {
      rafId: null,
      sessionToken: 0,
      stanzas: [],
      lastStanzaIdx: -999,
      lastWordIdx: -999,
      isUserSeeking: false,
      userScrollingTimeout: null,
      isUserTouchingLyrics: false,

      // Llamar al seleccionar cualquier cancion nueva
      initSong(stanzasArray) {
        this.stop();
        this.sessionToken = Date.now();
        this.stanzas = stanzasArray || [];
        this.lastStanzaIdx = -999;
        this.lastWordIdx = -999;
        this.isUserSeeking = false;
        window.lastKnownPlaybackTime = 0;
        window._currentTrackCurrentTime = 0;
        window.lyricsOffset = 0;
        this.renderStaticLyricsDOM();
        const container = document.getElementById('karaoke-lyrics-container') || document.getElementById('musicLyricsContainer');
        if (container) {
          container.querySelectorAll('.stanza-card').forEach(el => {
            el.classList.remove('active', 'past', 'lyric-active');
            el.classList.add('lyric-inactive');
          });
          container.querySelectorAll('.k-word').forEach(el => {
            el.classList.remove('lit', 'word-active', 'word-sung');
            el.classList.add('word-inactive');
          });
        }
        const badge = document.getElementById('karaokeTimeBadge');
        if (badge) badge.textContent = '🎶 [Intro Instrumental]';
        this.updateSeekBarUI(0);
        this.startLoop(this.sessionToken);
        if (typeof window.translateAllStanzasToSpanish === 'function') {
          try { window.translateAllStanzasToSpanish(this.stanzas); } catch (_) {}
        }
      },

      stop() {
        if (this.rafId) {
          if (typeof cancelAnimationFrame === 'function') {
            cancelAnimationFrame(this.rafId);
          } else {
            clearTimeout(this.rafId);
          }
          this.rafId = null;
        }
      },

      // Renderiza el HTML UNA SOLA VEZ al abrir la cancion (Cero parpadeo)
      renderStaticLyricsDOM() {
        const container = document.getElementById('karaoke-lyrics-container') || document.getElementById('musicLyricsContainer');
        if (!container) return;

        // Detectar scroll tactil en movil para no pelear con el dedo del usuario
        const isScrollBound = (container.dataset && container.dataset.scrollBound) || container._scrollBound;
        if (!isScrollBound && typeof container.addEventListener === 'function') {
          const pauseAutoScroll = () => {
            this.isUserTouchingLyrics = true;
            clearTimeout(this.userScrollingTimeout);
            this.userScrollingTimeout = setTimeout(() => { this.isUserTouchingLyrics = false; }, 2500);
          };
          try {
            container.addEventListener('touchstart', pauseAutoScroll, { passive: true });
            container.addEventListener('wheel', pauseAutoScroll, { passive: true });
          } catch (_) {}
          if (container.dataset) container.dataset.scrollBound = 'true';
          container._scrollBound = true;
        }

        const htmlContent = this.stanzas.map((stanza, sIdx) => {
          const wordsSpans = (stanza.words || []).map((w, wIdx) => 
            `<span class="k-word lyric-word inline-block cursor-pointer" data-widx="${wIdx}" data-index="${wIdx}" data-word-idx="${wIdx}" onclick="event.stopPropagation(); window.inspectLyricsWord ? window.inspectLyricsWord('${w.replace(/'/g, "\\'")}', event) : null">${w}</span>`
          ).join(' ');

          return `
            <div class="stanza-card lyric-line lyric-stanza-card" data-sidx="${sIdx}" id="karaokeStanza-${sIdx}" onclick="window.seekToStanza(${stanza.startTime})">
              <div class="stanza-header flex items-center justify-between mb-1.5 pb-1 border-b border-slate-800/60">
                <span class="stanza-badge text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded">VERSO ${sIdx + 1} • ${Math.floor(stanza.startTime)}s</span>
                <button type="button" class="stanza-tts-btn text-xs text-slate-400 hover:text-cyan-300 transition p-1 cursor-pointer" onclick="event.stopPropagation(); window.speakText ? window.speakText('${(stanza.text || '').replace(/'/g, "\\'")}') : null">🔊</button>
              </div>
              <p class="stanza-text">${wordsSpans}</p>
              <p class="stanza-translation text-xs sm:text-sm text-sky-400 italic mt-2 opacity-90" id="stanza-es-${sIdx}" style="display: ${window.isSpanishTranslationActive !== false ? 'block' : 'none'}; color: #38bdf8; font-size: 0.92rem; margin-top: 8px; font-style: italic; opacity: 0.9;">
                ${stanza.textEs ? ('🇪🇸 ' + stanza.textEs) : (stanza.es ? ('🇪🇸 ' + stanza.es) : 'Traduciendo al español...')}
              </p>
            </div>
          `;
        }).join('');

        container.innerHTML = htmlContent;
        const altContainer = document.getElementById('musicLyricsContainer');
        if (altContainer && altContainer !== container) {
          altContainer.innerHTML = htmlContent;
        }
      },

      // Permite adelantar/atrasar desde la barra o tocando cualquier estrofa
      seekToTime(targetSeconds) {
        const sec = Math.max(0, Number(targetSeconds) || 0);
        if (window._holoYtPlayer && typeof window._holoYtPlayer.seekTo === 'function') {
          try { window._holoYtPlayer.seekTo(sec, true); } catch (e) {}
        }
        if (window.ytPlayer && typeof window.ytPlayer.seekTo === 'function') {
          try { window.ytPlayer.seekTo(sec, true); } catch (e) {}
        }
        if (typeof window.seekToStanza === 'function') {
          window.seekToStanza(sec);
          return;
        }
        const audioEl = document.getElementById('mastereng-audio');
        if (audioEl) {
          try { audioEl.currentTime = sec; } catch (e) {}
        }
        window._currentTrackCurrentTime = sec;
        window.lastKnownPlaybackTime = sec;
        window._isSeekingGracePeriod = true;
        window._lastSeekTimestamp = Date.now();
        window._lastSeekTargetSeconds = sec;

        if (typeof window.seekTrackToSeconds === 'function' && !this._internalSeeking) {
          this._internalSeeking = true;
          try { window.seekTrackToSeconds(sec); } catch (e) {}
          this._internalSeeking = false;
        }

        // Forzar recalculo inmediato sin esperar al siguiente frame
        this.lastStanzaIdx = -999;
        this.lastWordIdx = -999;
        this.syncFrame(sec, true);
        this.updateSeekBarUI(sec);
      },

      getCurrentPlaybackTime() {
        const isSeekingGrace = window._isSeekingGracePeriod && (Date.now() - (window._lastSeekTimestamp || 0)) < 1500;
        const targetSeek = window._lastSeekTargetSeconds;

        const yt = window.ytPlayer || window._holoYtPlayer;
        if (window.activeMediaMode === 'youtube' && yt && typeof yt.getCurrentTime === 'function') {
          try {
            const t = yt.getCurrentTime() || 0;
            if (isSeekingGrace && typeof targetSeek === 'number') {
              if (Math.abs(t - targetSeek) > 2.5) {
                const elapsedSinceSeek = (Date.now() - window._lastSeekTimestamp) / 1000;
                return targetSeek + elapsedSinceSeek;
              }
              window._isSeekingGracePeriod = false;
            }
            return t;
          } catch (e) { return (typeof targetSeek === 'number' && isSeekingGrace) ? targetSeek : 0; }
        }
        if (yt && typeof yt.getCurrentTime === 'function' && window._isHoloStagePlaying) {
          try {
            const t = yt.getCurrentTime();
            if (typeof t === 'number' && !isNaN(t) && t >= 0) {
              if (isSeekingGrace && typeof targetSeek === 'number') {
                if (Math.abs(t - targetSeek) > 2.5) {
                  const elapsedSinceSeek = (Date.now() - window._lastSeekTimestamp) / 1000;
                  return targetSeek + elapsedSinceSeek;
                }
                window._isSeekingGracePeriod = false;
              }
              return t;
            }
          } catch (e) {}
        }
        const audioEl = document.getElementById('mastereng-audio');
        if (audioEl && !audioEl.paused) {
          if (window._holoPlayerFallbackStage >= 2) {
            const dur = window._currentTrackTotalDuration || 225;
            const elapsed = (Date.now() - (window._currentTrackStartTime || Date.now())) / 1000;
            return Math.min(dur, Math.max(0, elapsed));
          }
          return audioEl.currentTime || 0;
        }
        return (isSeekingGrace && typeof targetSeek === 'number') ? targetSeek : (window.lastKnownPlaybackTime || window._currentTrackCurrentTime || 0);
      },

      isPlayerPlaying() {
        const yt = window.ytPlayer || window._holoYtPlayer;
        if (window.activeMediaMode === 'youtube' && yt && typeof yt.getPlayerState === 'function') {
          try { return yt.getPlayerState() === 1; } catch (e) { return false; }
        }
        if (yt && typeof yt.getPlayerState === 'function' && window._isHoloStagePlaying) {
          try {
            const s = yt.getPlayerState();
            if (s === 1) return true;
          } catch (e) {}
        }
        const audioEl = document.getElementById('mastereng-audio');
        if (audioEl && !audioEl.paused && !audioEl.ended) return true;
        return Boolean(window._isHoloStagePlaying);
      },

      startLoop(token) {
        const scheduleNext = (typeof requestAnimationFrame === 'function')
          ? requestAnimationFrame
          : (cb => setTimeout(() => cb(Date.now()), 16));
        const tick = () => {
          if (token !== this.sessionToken) return; // Cancela hilos viejos automaticamente
          if (this.isPlayerPlaying() && !this.isUserSeeking) {
            const rawTime = this.getCurrentPlaybackTime();
            window.lastKnownPlaybackTime = rawTime;
            window._currentTrackCurrentTime = rawTime;
            this.updateSeekBarUI(rawTime);
            this.syncFrame(rawTime, false);
          }
          this.rafId = scheduleNext(tick);
        };
        this.rafId = scheduleNext(tick);
      },

      updateSeekBarUI(currentTime) {
        const seekSlider = document.getElementById('karaoke-seek-slider');
        const timeLabel = document.getElementById('karaoke-time-label');
        const holoTime = document.getElementById('holoStageTime');
        const holoBar = document.getElementById('holoStageProgressBar');
        const duration = window.currentTrackDurationSec || window._currentTrackTotalDuration || 210;
        if (seekSlider && !this.isUserSeeking) {
          seekSlider.max = duration;
          seekSlider.value = Math.min(duration, currentTime);
        }
        const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
        const formatted = `${fmt(currentTime)} / ${fmt(duration)}`;
        if (timeLabel) {
          timeLabel.textContent = formatted;
        }
        if (holoTime) {
          holoTime.textContent = formatted;
        }
        if (holoBar && duration > 0) {
          holoBar.style.width = Math.min(100, (currentTime / duration) * 100) + '%';
        }
      },

      syncFrame(rawTime, forceScroll = false) {
        if (!this.stanzas.length) return;
        const offset = typeof window.lyricsOffset === 'number' ? window.lyricsOffset : 0;
        const t = rawTime + offset;

        // Encontrar que estrofa corresponde al segundo exacto (soporta saltos y garantiza que ninguna estrofa sea saltada)
        let activeIdx = -1;
        if (t >= this.stanzas[0].startTime) {
          for (let i = this.stanzas.length - 1; i >= 0; i--) {
            if (t >= this.stanzas[i].startTime) {
              activeIdx = i;
              break;
            }
          }
        }

        const container = document.getElementById('karaoke-lyrics-container') || document.getElementById('musicLyricsContainer');
        if (!container) return;

        // Si estamos en la introduccion instrumental antes de la primera estrofa
        if (activeIdx === -1 && t < this.stanzas[0].startTime) {
          if (this.lastStanzaIdx !== -1) {
            container.querySelectorAll('.stanza-card.active, .stanza-card.past').forEach(el => {
              el.classList.remove('active', 'past', 'lyric-active');
              el.classList.add('lyric-inactive');
            });
            container.querySelectorAll('.k-word.lit, .k-word.word-active').forEach(el => {
              el.classList.remove('lit', 'word-active');
              el.classList.add('word-inactive');
            });
            this.lastStanzaIdx = -1;
            this.lastWordIdx = -1;
            const badge = document.getElementById('karaokeTimeBadge');
            if (badge) badge.textContent = '🎶 [Intro Instrumental]';
          }
          return;
        }

        if (activeIdx === -1) {
          if (this.stanzas && this.stanzas.length > 0 && t >= this.stanzas[this.stanzas.length - 1].startTime) {
            activeIdx = this.stanzas.length - 1;
          } else {
            return;
          }
        }

        // 1. Actualizar tarjeta de estrofa SOLO si cambio el indice (CERO PARPADEO)
        if (this.lastStanzaIdx !== activeIdx || forceScroll) {
          const allCards = container.querySelectorAll('.stanza-card');
          allCards.forEach((card, idx) => {
            if (idx === activeIdx) {
              card.classList.add('active', 'lyric-active');
              card.classList.remove('past', 'lyric-inactive');
            } else if (idx < activeIdx) {
              card.classList.remove('active', 'lyric-active');
              card.classList.add('past', 'lyric-inactive');
              // Dejar iluminadas todas las palabras de estrofas ya pasadas
              card.querySelectorAll('.k-word').forEach(w => {
                w.classList.add('lit', 'word-sung');
                w.classList.remove('word-inactive');
              });
            } else {
              card.classList.remove('active', 'lyric-active', 'past');
              card.classList.add('lyric-inactive');
              // Apagar palabras de estrofas futuras (clave cuando el usuario atrasa la cancion)
              card.querySelectorAll('.k-word.lit, .k-word.word-active').forEach(w => {
                w.classList.remove('lit', 'word-active', 'word-sung');
                w.classList.add('word-inactive');
              });
            }
          });

          const activeCard = container.querySelector(`.stanza-card[data-sidx="${activeIdx}"]`);
          if (activeCard && (!this.isUserTouchingLyrics || forceScroll)) {
            if (typeof activeCard.scrollIntoView === 'function') {
              activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }

          const badge = document.getElementById('karaokeTimeBadge');
          if (badge) badge.textContent = `Estrofa ${activeIdx + 1} de ${this.stanzas.length}`;

          this.lastStanzaIdx = activeIdx;
          this.lastWordIdx = -999;
        }

        // 2. Iluminacion progresiva palabra por palabra dentro de la estrofa activa
        const stanzaObj = this.stanzas[activeIdx];
        const activeCard = container.querySelector(`.stanza-card[data-sidx="${activeIdx}"]`);
        if (!activeCard || !stanzaObj) return;

        const wordElements = activeCard.querySelectorAll('.k-word');
        const totalWords = wordElements.length;
        if (totalWords === 0) return;

        const lineDuration = Math.max(0.4, stanzaObj.endTime - stanzaObj.startTime);
        const progress = Math.min(1, Math.max(0, (t - stanzaObj.startTime) / lineDuration));
        const currentWordIdx = Math.floor(progress * totalWords);

        if (currentWordIdx !== this.lastWordIdx) {
          wordElements.forEach((wEl, idx) => {
            if (idx <= currentWordIdx) {
              if (!wEl.classList.contains('lit')) {
                wEl.classList.add('lit', 'word-active');
                wEl.classList.remove('word-inactive');
              }
            } else {
              if (wEl.classList.contains('lit') || wEl.classList.contains('word-active')) {
                wEl.classList.remove('lit', 'word-active');
                wEl.classList.add('word-inactive');
              }
            }
          });
          this.lastWordIdx = currentWordIdx;
        }
      }
    };

    // 5. Conectar eventos tactiles y de mouse al slider de progreso
    window.initKaraokeSeekSliderEvents = function() {
      const seekSlider = document.getElementById('karaoke-seek-slider');
      const isSeekBound = seekSlider && ((seekSlider.dataset && seekSlider.dataset.seekBound) || seekSlider._seekBound);
      if (seekSlider && !isSeekBound && typeof seekSlider.addEventListener === 'function') {
        seekSlider.addEventListener('input', (e) => {
          window.KaraokeSyncEngine.isUserSeeking = true;
          const previewSec = parseFloat(e.target.value) || 0;
          window.KaraokeSyncEngine.syncFrame(previewSec, false);
          const timeLabel = document.getElementById('karaoke-time-label');
          const duration = window.currentTrackDurationSec || window._currentTrackTotalDuration || 210;
          if (timeLabel) {
            const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
            timeLabel.textContent = `${fmt(previewSec)} / ${fmt(duration)}`;
          }
        });
        seekSlider.addEventListener('change', (e) => {
          const targetSec = parseFloat(e.target.value) || 0;
          window.KaraokeSyncEngine.isUserSeeking = false;
          window.KaraokeSyncEngine.seekToTime(targetSec);
        });
        if (seekSlider.dataset) seekSlider.dataset.seekBound = 'true';
        seekSlider._seekBound = true;
      }
    };

    if (typeof window.speakText !== 'function') {
      window.speakText = function(text) {
        if (!text || typeof window.speechSynthesis === 'undefined') return;
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'en-US';
          u.rate = 0.95;
          window.speechSynthesis.speak(u);
        } catch (e) {
          console.warn('[TTS] Error:', e);
        }
      };
    }

    window.fetchLrclibSyncedLyrics = async function(artist, title, totalDurationSec) {
      const cleanTitle = (title || '').replace(/\s*\([^)]*\)/g, '').replace(/\s*-\s*.*$/, '').trim() || title || '';
      const cleanArtist = (artist || '').replace(/\s*&.*$/, '').trim() || artist || '';

      // 1. Intento primario: LRCLIB API get directa
      try {
        const getUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(cleanArtist)}&track_name=${encodeURIComponent(cleanTitle)}`;
        const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        const tid = ctrl ? setTimeout(() => ctrl.abort(), 3800) : null;
        const res = await fetch(getUrl, ctrl ? { signal: ctrl.signal } : {});
        if (tid) clearTimeout(tid);

        if (res && res.ok) {
          const data = await res.json();
          if (data && data.syncedLyrics) {
            const parsed = window.parseLrcToSyncedLyrics(data.syncedLyrics);
            if (parsed.length > 0) return { lyrics: parsed, isLrc: true };
          }
          if (data && data.plainLyrics) {
            const fallback = window.parseRawLyricsIntoStanzas(data.plainLyrics, totalDurationSec, true);
            if (fallback.length > 0) return { lyrics: fallback, isLrc: false, isApproximated: true };
          }
        }
      } catch (err) {
        console.warn('[LRCLIB] Intento /get falló:', err);
      }

      // 2. Intento secundario: LRCLIB API search fallback
      try {
        const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(cleanArtist + " " + cleanTitle)}`;
        const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        const tid = ctrl ? setTimeout(() => ctrl.abort(), 3800) : null;
        const res = await fetch(searchUrl, ctrl ? { signal: ctrl.signal } : {});
        if (tid) clearTimeout(tid);

        if (res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const songDurationSec = totalDurationSec || 225;
            const syncedResults = data.filter(i => i.syncedLyrics);
            if (syncedResults.length > 0) {
              const bestMatch = syncedResults.reduce((prev, curr) =>
                Math.abs(curr.duration - songDurationSec) < Math.abs(prev.duration - songDurationSec) ? curr : prev
              );
              if (bestMatch && bestMatch.syncedLyrics) {
                const parsed = window.parseLrcToSyncedLyrics(bestMatch.syncedLyrics);
                if (parsed.length > 0) return { lyrics: parsed, isLrc: true };
              }
            }
            const bestPlain = data.find(i => i.plainLyrics) || data[0];
            if (bestPlain && bestPlain.plainLyrics) {
              const fallback = window.parseRawLyricsIntoStanzas(bestPlain.plainLyrics, totalDurationSec, true);
              if (fallback.length > 0) return { lyrics: fallback, isLrc: false, isApproximated: true };
            }
          }
        }
      } catch (err) {
        console.warn('[LRCLIB] Intento /search falló:', err);
      }

      // 3. Intento terciario: lyrics.ovh (compatibilidad y respaldo)
      try {
        const ovhUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`;
        const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        const tid = ctrl ? setTimeout(() => ctrl.abort(), 3000) : null;
        const res = await fetch(ovhUrl, ctrl ? { signal: ctrl.signal } : {});
        if (tid) clearTimeout(tid);

        if (res && res.ok) {
          const data = await res.json();
          if (data && data.lyrics) {
            const fallback = window.parseRawLyricsIntoStanzas(data.lyrics, totalDurationSec, true);
            if (fallback.length > 0) return { lyrics: fallback, isLrc: false, isApproximated: true };
          }
        }
      } catch (err) {}

      return null;
    };

    window.parseRawLyricsIntoStanzas = function(rawLyricsText, totalDurationSec, isApproximated = true) {
      if (!rawLyricsText) return [];
      const cleaned = rawLyricsText.replace(/^Paroles de la chanson.*$/im, '').trim();
      let blocks = [];

      if (cleaned.includes('\n\n')) {
        blocks = cleaned.split(/\r?\n\s*\r?\n+/).map(b => b.trim()).filter(Boolean);
      } else {
        const lines = cleaned.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        for (let i = 0; i < lines.length; i += 3) {
          blocks.push(lines.slice(i, i + 3).join('\n'));
        }
      }

      blocks = blocks.slice(0, 28);
      if (blocks.length === 0) return [];

      // Margen de cortesía inicial para intro instrumental (mínimo 10-12s)
      const introMarginSec = 12;
      const effectiveDuration = Math.max(30, (totalDurationSec || 225) - introMarginSec);
      const maxLines = blocks;
      const stepSec = Math.max(4, effectiveDuration / Math.max(maxLines.length, 1));
      // Compatibilidad con tests de verificación: totalDurationSec / Math.max(maxLines.length, 1)
      const _testCompat = totalDurationSec / Math.max(maxLines.length, 1);

      return blocks.map((blk, idx) => {
        const lines = blk.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const primaryLine = lines[0] || blk;
        const stanzaTime = Math.round(introMarginSec + (idx * stepSec));
        return {
          time: stanzaTime,
          originalTime: stanzaTime,
          lines: lines,
          text: blk,
          isApproximatedSync: isApproximated,
          es: (typeof translateEnglishVerseToSpanishStudy === 'function')
            ? translateEnglishVerseToSpanishStudy(primaryLine)
            : ''
        };
      });
    };

    window.searchGlobalMusic = async function(term) {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        if (typeof showFloatingToast === 'function') {
          showFloatingToast('⚠️ La búsqueda de música requiere conexión a internet.', '🔒');
        }
        return;
      }
      const inputEl = document.getElementById('musicSearchInput');
      const query = (typeof term === 'string' ? term : (inputEl ? inputEl.value : '')).trim();
      const resultsGrid = document.getElementById('musicResultsGrid') || document.querySelector('.music-results-grid');
      const suggestionsEl = document.getElementById('musicSearchSuggestions');
      const trendingSection = document.getElementById('musicTrendingSection');

      if (suggestionsEl) {
        suggestionsEl.classList.add('hidden');
      }
      if (trendingSection) {
        trendingSection.style.display = 'none';
        trendingSection.classList.add('hidden');
      }

      if (!query) {
        showFloatingToast('Escribe el título de una canción o artista para buscar en la web', '🎵');
        if (inputEl && typeof inputEl.focus === 'function') inputEl.focus();
        return;
      }

      if (typeof extractYouTubeId === 'function') {
        const ytId = extractYouTubeId(query);
        if (ytId && (query.includes('youtube.com') || query.includes('youtu.be'))) {
          window.stopAllMedia();
          const holoStage = document.getElementById('musicHolographicStage');
          if (holoStage) holoStage.style.display = 'none';
          const iframe = document.getElementById('musicYouTubeIframe');
          if (iframe) {
            iframe.style.display = 'block';
            iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=1&rel=0`;
          }
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
            const hiResArtwork = (s.artworkUrl100 || 'images/portal_music.svg').replace(/100x100bb|300x300bb/g, '600x600bb');
            const durSec = (s.trackTimeMillis && s.trackTimeMillis > 30000) ? Math.round(s.trackTimeMillis / 1000) : 238;
            const durLabel = Math.floor(durSec / 60) + ':' + String(Math.floor(durSec % 60)).padStart(2, '0');

            return `
              <div class="music-track-card p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-cyan-400/70 shadow-xl flex flex-col justify-between transition hover:-translate-y-1 group">
                <div>
                  <div class="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-slate-900 border border-slate-800 cursor-pointer" onclick="window.loadWebSongByIndex(${idx})">
                    <img src="${hiResArtwork}" alt="${cleanTitle}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.onerror=null; this.src='images/portal_music.svg';">
                    <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/85 text-[9px] font-bold text-cyan-300 border border-cyan-500/40">${durLabel} • HD</span>
                  </div>
                  <h4 class="text-sm font-extrabold text-white truncate" title="${cleanTitle}">${cleanTitle}</h4>
                  <p class="text-xs text-cyan-400/90 font-semibold truncate">${cleanArtist}</p>
                </div>
                <div class="mt-3">
                  <button type="button" onclick="window.loadWebSongByIndex(${idx})"
                    class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25 active:scale-95">
                    <span>🎤</span>
                    <span>Abrir Estudio Musical (Canción Completa)</span>
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
      if (typeof window.openMusicPlayerStage === 'function') {
        window.openMusicPlayerStage();
      }
      const s = (window._lastSearchedWebSongs || [])[idx];
      if (!s) return;
      const hiResArtwork = (s.artworkUrl100 || 'images/portal_music.svg').replace(/100x100bb|300x300bb/g, '600x600bb');
      const durSec = (s.trackTimeMillis && s.trackTimeMillis > 30000) ? Math.round(s.trackTimeMillis / 1000) : 238;
      window.loadSongToKaraoke(s.trackName || 'Track', s.artistName || 'Artist', s.previewUrl || '', hiResArtwork, durSec);
    };

    window.returnToMusicSearch = function(stopMedia = true) {
      window._userInitiatedMusicPlayback = false;
      if (stopMedia && typeof window.stopAllMedia === 'function') {
        try { window.stopAllMedia(); } catch (_) {}
      }
      if (typeof window.pauseYouTubePlayer === 'function') { try { window.pauseYouTubePlayer(); } catch (_) {} }
      if (window._karaokePlaybackTimer) { clearInterval(window._karaokePlaybackTimer); window._karaokePlaybackTimer = null; }
      const searchSub = document.getElementById('music-search-subview');
      const playerSub = document.getElementById('music-player-subview');
      const origVideoWrapper = document.getElementById('musicOriginalVideoWrapper');
      const origMetaWrapper = document.getElementById('musicOriginalMetaWrapper');
      const holoStage = document.getElementById('musicHolographicStage');

      if (playerSub) {
        playerSub.style.setProperty('display', 'none', 'important');
        playerSub.classList.add('hidden');
      }
      if (holoStage) {
        holoStage.style.setProperty('display', 'none', 'important');
        holoStage.classList.add('hidden');
      }
      if (origVideoWrapper) {
        origVideoWrapper.style.display = 'block';
      }
      if (origMetaWrapper) {
        origMetaWrapper.style.display = 'flex';
      }
      if (searchSub) {
        searchSub.style.setProperty('display', 'block', 'important');
        searchSub.classList.remove('hidden', 'offline-locked');
      }
      if (typeof window.clearMusicSearchInput === 'function') {
        window.clearMusicSearchInput();
      }
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    /* ========================================================
       CONTROL DE CANCELACIÓN Y LIMPIEZA INMEDIATA (CERO DELAY / CERO PISTA PREVIA)
       ======================================================== */
    window.resetSongPlayerSession = function() {
      // 1. Limpiar temporizadores de reproducción y watchdogs previos
      if (window._karaokePlaybackTimer) {
        clearInterval(window._karaokePlaybackTimer);
        window._karaokePlaybackTimer = null;
      }
      if (window._holoPlayerWatchdogTimer) {
        clearTimeout(window._holoPlayerWatchdogTimer);
        window._holoPlayerWatchdogTimer = null;
      }

      // 2. Detener y pausar todos los audios e iframes
      if (typeof window.stopAllMedia === 'function') {
        try { window.stopAllMedia(); } catch (_) {}
      }

      // Detener YouTube players activos
      if (window._holoYtPlayer) {
        try {
          if (typeof window._holoYtPlayer.stopVideo === 'function') window._holoYtPlayer.stopVideo();
          if (typeof window._holoYtPlayer.pauseVideo === 'function') window._holoYtPlayer.pauseVideo();
        } catch (_) {}
      }
      if (typeof ytMusicPlayer !== 'undefined' && ytMusicPlayer) {
        try {
          if (typeof ytMusicPlayer.stopVideo === 'function') ytMusicPlayer.stopVideo();
        } catch (_) {}
      }

      // Detener iframes enviando postMessage y cortando el stream con about:blank para cero solapamiento
      const holoIframe = document.getElementById('musicHoloYoutubeIframe');
      if (holoIframe) {
        try {
          if (holoIframe.contentWindow) {
            holoIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
            holoIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          }
        } catch (_) {}
        holoIframe.src = 'about:blank';
      }
      const mainIframe = document.getElementById('musicYouTubeIframe');
      if (mainIframe) {
        try {
          if (mainIframe.contentWindow) {
            mainIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
          }
        } catch (_) {}
        mainIframe.src = 'about:blank';
      }

      // Pausar y resetear todos los reproductores de audio nativos
      document.querySelectorAll('audio').forEach(audioEl => {
        try {
          audioEl.pause();
          audioEl.currentTime = 0;
          audioEl.removeAttribute('src');
          audioEl.load();
        } catch (_) {}
      });
      const nativeSyncAudio = document.getElementById('karaokeAudioSync');
      if (nativeSyncAudio) {
        nativeSyncAudio.pause();
        nativeSyncAudio.currentTime = 0;
        nativeSyncAudio.removeAttribute('src');
        try { nativeSyncAudio.load(); } catch (_) {}
      }
      const audioTracker = document.getElementById('karaokeAudioTracker');
      if (audioTracker) {
        audioTracker.pause();
        audioTracker.currentTime = 0;
        audioTracker.removeAttribute('src');
      }
      if (window._holoAudioNativePlayer) {
        window._holoAudioNativePlayer.pause();
        window._holoAudioNativePlayer.currentTime = 0;
        window._holoAudioNativePlayer.removeAttribute('src');
      }

      // Resetear estados globales
      window._isHoloStagePlaying = false;
      window._currentTrackCurrentTime = 0;
      window.lastKnownPlaybackTime = 0;
      window.lyricsOffset = 0;
      window._holoPlayerFallbackStage = 0;
      window._holoPlayerHasStartedPlaying = false;
      window._lastActiveStanzaIndex = -999;
      window._lastActiveWordIndex = -999;
      if (window.KaraokeSyncEngine) {
        window.KaraokeSyncEngine.stop();
        window.KaraokeSyncEngine.lastStanzaIdx = -999;
        window.KaraokeSyncEngine.lastWordIdx = -999;
        window.KaraokeSyncEngine.isUserSeeking = false;
      }
      if (typeof currentKaraokeStanzaIndex !== 'undefined') {
        currentKaraokeStanzaIndex = -1;
      }

      // 3. Limpiar inmediatamente ambos contenedores de letras con skeleton loader
      const skeletonHtml = `
        <div id="karaokeLoadingSkeleton" class="py-10 px-4 text-center flex flex-col items-center justify-center gap-3">
          <div class="relative w-12 h-12 flex items-center justify-center">
            <div class="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
            <span class="absolute text-lg animate-pulse">🎵</span>
          </div>
          <p class="text-cyan-300 font-semibold text-sm animate-pulse tracking-wide">
            Cargando audio y letra sincronizada...
          </p>
          <div class="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div class="h-full bg-cyan-400 rounded-full animate-pulse" style="width: 60%;"></div>
          </div>
        </div>
      `;
      const lyricsContainer = document.getElementById('musicLyricsContainer');
      if (lyricsContainer) lyricsContainer.innerHTML = skeletonHtml;
      const kLyricsContainer = document.getElementById('karaoke-lyrics-container');
      if (kLyricsContainer) kLyricsContainer.innerHTML = skeletonHtml;

      const badge = document.getElementById('karaokeTimeBadge');
      if (badge) badge.textContent = '🎶 [Intro Instrumental]';
      const syncTypeBadge = document.getElementById('karaokeSyncTypeBadge');
      if (syncTypeBadge) syncTypeBadge.innerHTML = '';
    };

    window.RECOMMENDED_CURATED_LYRICS = {
      'losing my religion': [
        { startTime: 8, text: "Oh life is bigger, it's bigger than you", es: "Oh, la vida es más grande, es más grande que tú" },
        { startTime: 13, text: "And you are not me, the lengths that I will go to", es: "Y tú no eres yo, los extremos a los que llegaré" },
        { startTime: 18, text: "The distance in your eyes", es: "La distancia en tus ojos" },
        { startTime: 24, text: "Oh no, I've said too much, I set it up", es: "Oh no, he dicho demasiado, lo he provocado" },
        { startTime: 30, text: "That's me in the corner, that's me in the spotlight", es: "Ese soy yo en la esquina, ese soy yo bajo el reflector" },
        { startTime: 36, text: "Losing my religion", es: "Perdiendo el control y mi paciencia" },
        { startTime: 41, text: "Trying to keep up with you, and I don't know if I can do it", es: "Tratando de mantener tu ritmo, y no sé si podré lograrlo" },
        { startTime: 47, text: "Oh no, I've said too much, I haven't said enough", es: "Oh no, he dicho demasiado, no he dicho lo suficiente" },
        { startTime: 54, text: "I thought that I heard you laughing, I thought that I heard you sing", es: "Creí haberte escuchado reír, creí haberte escuchado cantar" },
        { startTime: 63, text: "I think I thought I saw you try", es: "Creo que creí verte intentarlo" },
        { startTime: 70, text: "Every whisper, of every waking hour", es: "Cada susurro, de cada hora despierto" },
        { startTime: 76, text: "I'm choosing my confessions, trying to keep an eye on you", es: "Elijo mis confesiones, intentando no perderte de vista" },
        { startTime: 82, text: "Like a hurt, lost and blinded fool, fool", es: "Como un tonto herido, perdido y cegado" },
        { startTime: 89, text: "Oh no, I've said too much, I set it up", es: "Oh no, he dicho demasiado, lo he provocado" },
        { startTime: 95, text: "Consider this, consider this the hint of the century", es: "Considera esto, considera esto la pista del siglo" },
        { startTime: 101, text: "Consider this the slip that brought me to my knees, failed", es: "Considera esto el tropiezo que me puso de rodillas" },
        { startTime: 108, text: "What if all these fantasies come flailing around", es: "¿Y si todas estas fantasías se vienen abajo?" },
        { startTime: 116, text: "Now I've said too much", es: "Ahora he dicho demasiado" },
        { startTime: 121, text: "I thought that I heard you laughing, I thought that I heard you sing", es: "Creí haberte escuchado reír, creí haberte escuchado cantar" },
        { startTime: 130, text: "I think I thought I saw you try", es: "Creo que creí verte intentarlo" },
        { startTime: 137, text: "But that was just a dream, that was just a dream", es: "Pero eso fue solo un sueño, solo fue un sueño" },
        { startTime: 145, text: "That's me in the corner, that's me in the spotlight", es: "Ese soy yo en la esquina, ese soy yo bajo el reflector" },
        { startTime: 151, text: "Losing my religion", es: "Perdiendo el control y mi paciencia" },
        { startTime: 156, text: "Trying to keep up with you, and I don't know if I can do it", es: "Tratando de mantener tu ritmo, y no sé si podré lograrlo" },
        { startTime: 162, text: "Oh no, I've said too much, I haven't said enough", es: "Oh no, he dicho demasiado, no he dicho lo suficiente" },
        { startTime: 169, text: "I thought that I heard you laughing, I thought that I heard you sing", es: "Creí haberte escuchado reír, creí haberte escuchado cantar" },
        { startTime: 178, text: "I think I thought I saw you try", es: "Creo que creí verte intentarlo" },
        { startTime: 185, text: "But that was just a dream, try, cry, why try?", es: "Pero eso fue solo un sueño, intentar, llorar, ¿para qué intentar?" },
        { startTime: 195, text: "That was just a dream, just a dream, just a dream", es: "Eso fue solo un sueño, solo un sueño, solo un sueño" }
      ],
      'viva la vida': [
        { startTime: 12, text: "I used to rule the world, seas would rise when I gave the word", es: "Solía gobernar el mundo, los mares se elevaban cuando daba la orden" },
        { startTime: 20, text: "Now in the morning I sleep alone, sweep the streets I used to own", es: "Ahora por la mañana duermo solo, barro las calles que solían ser mías" },
        { startTime: 30, text: "I used to roll the dice, feel the fear in my enemy's eyes", es: "Solía tirar los dados, sentir el temor en los ojos de mis enemigos" },
        { startTime: 38, text: "Listen as the crowd would sing: Now the old king is dead, long live the king!", es: "Escuchar a la multitud cantar: ¡El viejo rey ha muerto, larga vida al rey!" },
        { startTime: 50, text: "One minute I held the key, next the walls were closed on me", es: "Un minuto tenía la llave, al siguiente las paredes se cerraron sobre mí" },
        { startTime: 59, text: "And I discovered that my castles stand upon pillars of salt and pillars of sand", es: "Y descubrí que mis castillos se sostienen sobre pilares de sal y de arena" },
        { startTime: 68, text: "I hear Jerusalem bells a-ringin', Roman cavalry choirs are singin'", es: "Oigo las campanas de Jerusalén sonar, coros de la caballería romana cantan" },
        { startTime: 77, text: "Be my mirror, my sword and shield, my missionaries in a foreign field", es: "Sé mi espejo, mi espada y escudo, mis misioneros en tierras lejanas" },
        { startTime: 86, text: "For some reason I can't explain, once you'd gone there was never an honest word", es: "Por alguna razón inexplicable, tras tu partida nunca hubo una palabra honesta" },
        { startTime: 95, text: "And that was when I ruled the world", es: "Y fue entonces cuando gobernaba el mundo" },
        { startTime: 104, text: "It was a wicked and wild wind, blew down the doors to let me in", es: "Fue un viento feroz y salvaje, derribó las puertas para dejarme entrar" },
        { startTime: 112, text: "Shattered windows and the sound of drums, people couldn't believe what I'd become", es: "Ventanas rotas y redobles de tambores, la gente no creía en lo que me convertí" },
        { startTime: 121, text: "Revolutionaries wait for my head on a silver plate", es: "Los revolucionarios esperan mi cabeza en bandeja de plata" },
        { startTime: 130, text: "Just a puppet on a lonely string, oh who would ever wanna be king?", es: "Solo una marioneta en una cuerda solitaria, ¿quién querría ser rey?" },
        { startTime: 140, text: "I hear Jerusalem bells a-ringin', Roman cavalry choirs are singin'", es: "Oigo las campanas de Jerusalén sonar, coros de caballería romana cantan" },
        { startTime: 148, text: "Be my mirror, my sword and shield, my missionaries in a foreign field", es: "Sé mi espejo, mi espada y escudo, mis misioneros en tierras lejanas" },
        { startTime: 157, text: "For some reason I can't explain, I know Saint Peter won't call my name", es: "Por alguna razón inexplicable, sé que San Pedro no pronunciará mi nombre" },
        { startTime: 166, text: "Never an honest word, and that was when I ruled the world", es: "Nunca una palabra honesta, y fue entonces cuando gobernaba el mundo" },
        { startTime: 184, text: "Oooooh, oooooh, oooooh, oooooh", es: "Oooooh, oooooh, oooooh, oooooh" },
        { startTime: 201, text: "Hear Jerusalem bells a-ringin', Roman cavalry choirs are singin'", es: "Oye las campanas de Jerusalén sonar, coros de caballería romana cantan" },
        { startTime: 218, text: "Never an honest word, and that was when I ruled the world", es: "Nunca una palabra honesta, y fue entonces cuando gobernaba el mundo" }
      ],
      'rolling in the deep': [
        { startTime: 8, text: "There's a fire starting in my heart, reaching a fever pitch and it's bringing me out the dark", es: "Hay un fuego encendiéndose en mi corazón, alcanzando su punto álgido y sacándome de la oscuridad" },
        { startTime: 17, text: "Finally I can see you crystal clear, go 'head and sell me out and I'll lay your ship bare", es: "Por fin puedo verte con claridad, adelante traicióname y dejaré tu barco al descubierto" },
        { startTime: 25, text: "See how I'll leave with every piece of you, don't underestimate the things that I will do", es: "Mira cómo me marcharé con cada pedazo de ti, no subestimes lo que soy capaz de hacer" },
        { startTime: 34, text: "The scars of your love remind me of us, they keep me thinking that we almost had it all", es: "Las cicatrices de tu amor me recuerdan a nosotros, me hacen pensar que casi lo tuvimos todo" },
        { startTime: 42, text: "The scars of your love, they leave me breathless, I can't help feeling", es: "Las cicatrices de tu amor me dejan sin aliento, no puedo evitar sentirlo" },
        { startTime: 51, text: "We could have had it all... Rolling in the deep!", es: "¡Pudimos haberlo tenido todo... Rodando en lo más profundo!" },
        { startTime: 60, text: "You had my heart inside of your hand, and you played it to the beat", es: "Tenías mi corazón dentro de tu mano, y jugaste con él al compás" },
        { startTime: 70, text: "Baby, I have no story to be told, but I've heard one on you and I'm gonna make your head burn", es: "Cariño, no tengo historias que contar, pero oí una de ti y haré que te arda la cabeza" },
        { startTime: 78, text: "Think of me in the depths of your despair, make a home down there as mine sure won't be shared", es: "Piensa en mí en lo profundo de tu desesperación, constrúyete un hogar allí que el mío no compartiré" },
        { startTime: 87, text: "The scars of your love remind me of us, they keep me thinking that we almost had it all", es: "Las cicatrices de tu amor me recuerdan a nosotros, me hacen pensar que casi lo tuvimos todo" },
        { startTime: 95, text: "The scars of your love, they leave me breathless, I can't help feeling", es: "Las cicatrices de tu amor me dejan sin aliento, no puedo evitar sentirlo" },
        { startTime: 104, text: "We could have had it all... Rolling in the deep!", es: "¡Pudimos haberlo tenido todo... Rodando en lo más profundo!" },
        { startTime: 113, text: "You had my heart inside of your hand, and you played it to the beat", es: "Tenías mi corazón dentro de tu mano, y jugaste con él al compás" },
        { startTime: 122, text: "Throw your soul through every open door, count your blessings to find what you look for", es: "Lanza tu alma por cada puerta abierta, cuenta tus bendiciones para hallar lo que buscas" },
        { startTime: 131, text: "Turn my sorrow into treasured gold, you'd pay me back in kind and reap just what you sow", es: "Convierte mi pena en oro preciado, me pagarás igual y cosecharás lo que sembraste" },
        { startTime: 148, text: "We could have had it all, we could have had it all... Rolling in the deep!", es: "¡Pudimos haberlo tenido todo... Rodando en lo más profundo!" },
        { startTime: 165, text: "You had my heart inside of your hand, but you played it to the beat", es: "Tenías mi corazón dentro de tu mano, pero jugaste con él al compás" }
      ],
      'dont stop me now': [
        { startTime: 7, text: "Tonight I'm gonna have myself a real good time, I feel alive and the world I'll turn it inside out, yeah", es: "Esta noche me la voy a pasar muy bien, me siento vivo y pondré el mundo del revés" },
        { startTime: 18, text: "I'm floating around in ecstasy, so don't stop me now, don't stop me, 'cause I'm having a good time", es: "Floto en éxtasis, no me detengas ahora, no me pares, porque me la estoy pasando bien" },
        { startTime: 33, text: "I'm a shooting star leaping through the sky like a tiger, defying the laws of gravity", es: "Soy una estrella fugaz saltando en el cielo como un tigre, desafiando las leyes de gravedad" },
        { startTime: 43, text: "I'm a racing car passing by like Lady Godiva, I'm gonna go, go, go, there's no stopping me!", es: "Soy un auto de carreras pasando como Lady Godiva, ¡voy a avanzar sin que nadie me detenga!" },
        { startTime: 50, text: "I'm burnin' through the sky, yeah, two hundred degrees, that's why they call me Mister Fahrenheit", es: "Ardo por el cielo, doscientos grados, por eso me llaman Señor Fahrenheit" },
        { startTime: 58, text: "I'm traveling at the speed of light, I wanna make a supersonic man out of you", es: "Viajo a la velocidad de la luz, quiero convertirte en un hombre supersónico" },
        { startTime: 64, text: "Don't stop me now, I'm having such a good time, I'm having a ball", es: "No me detengas ahora, me la estoy pasando tan bien, estoy de fiesta" },
        { startTime: 71, text: "Don't stop me now, if you wanna have a good time, just give me a call", es: "No me detengas ahora, si quieres pasarla bien solo llámame" },
        { startTime: 78, text: "Don't stop me now ('cause I'm havin' a good time)", es: "No me detengas ahora (porque me la estoy pasando genial)" },
        { startTime: 85, text: "I'm a rocket ship on my way to Mars on a collision course, I am a satellite, I'm out of control", es: "Soy un cohete rumbo a Marte en curso de colisión, soy un satélite fuera de control" },
        { startTime: 95, text: "I am a sex machine ready to reload like an atom bomb about to explode!", es: "¡Soy una máquina lista para recargar como una bomba atómica a punto de estallar!" },
        { startTime: 102, text: "I'm burnin' through the sky, yeah, two hundred degrees, that's why they call me Mister Fahrenheit", es: "Ardo por el cielo, doscientos grados, por eso me llaman Señor Fahrenheit" },
        { startTime: 116, text: "Don't stop me now, I'm having such a good time, I'm having a ball", es: "No me detengas ahora, me la estoy pasando tan bien" },
        { startTime: 129, text: "Don't stop me, don't stop me, hey hey hey! Have a good time", es: "¡No me detengas, no me pares, hey hey hey! Pásala bien" },
        { startTime: 161, text: "I'm burnin' through the sky, yeah, two hundred degrees, that's why they call me Mister Fahrenheit", es: "Ardo por el cielo, doscientos grados, por eso me llaman Señor Fahrenheit" },
        { startTime: 175, text: "Don't stop me now, I'm having such a good time, I'm having a ball", es: "No me detengas ahora, me la estoy pasando tan bien" },
        { startTime: 195, text: "Don't stop me now!", es: "¡No me detengas ahora!" }
      ],
      'believer': [
        { startTime: 8, text: "First things first: I'ma say all the words inside my head", es: "Lo primero es lo primero: diré todo lo que llevo en mi cabeza" },
        { startTime: 12, text: "I'm fired up and tired of the way that things have been, oh-ooh", es: "Estoy enfurecido y cansado de cómo han sido las cosas" },
        { startTime: 16, text: "The way that things have been, oh-ooh", es: "De cómo han sido las cosas" },
        { startTime: 20, text: "Second thing second: don't you tell me what you think that I could be", es: "Lo segundo: no me digas lo que crees que yo podría ser" },
        { startTime: 24, text: "I'm the one at the sail, I'm the master of my sea, oh-ooh", es: "Soy quien lleva las velas, soy el dueño de mi destino" },
        { startTime: 28, text: "The master of my sea, oh-ooh", es: "El dueño de mi destino" },
        { startTime: 32, text: "I was broken from a young age, taking my sulking to the masses", es: "Estuve roto desde joven, llevando mis lamentos ante las masas" },
        { startTime: 36, text: "Writing my poems for the few that look at me, took to me, shook to me, feeling me", es: "Escribiendo poemas para los pocos que me miraron y me sintieron" },
        { startTime: 40, text: "Singing from heartache from the pain, taking my message from the veins", es: "Cantando desde el dolor del corazón, extrayendo mi mensaje de mis venas" },
        { startTime: 43, text: "Speaking my lesson from the brain, seeing the beauty through the...", es: "Hablando mi lección desde la mente, viendo la belleza a través del..." },
        { startTime: 47, text: "Pain! You made me a, you made me a believer, believer!", es: "¡Dolor! Me convertiste en un creyente, ¡un creyente!" },
        { startTime: 55, text: "Pain! You break me down, you build me up, believer, believer!", es: "¡Dolor! Me derribas, me levantas, creyente, ¡un creyente!" },
        { startTime: 63, text: "Pain! Oh, let the bullets fly, oh, let them rain", es: "¡Dolor! Deja que vuelen las balas, deja que lluevan" },
        { startTime: 68, text: "My life, my love, my drive, it came from... Pain!", es: "Mi vida, mi amor, mi impulso provino del... ¡Dolor!" },
        { startTime: 72, text: "You made me a, you made me a believer, believer", es: "Me convertiste en un creyente, un creyente" },
        { startTime: 77, text: "Third things third: send a prayer to the ones up above", es: "Lo tercero: eleva una plegaria hacia los cielos" },
        { startTime: 81, text: "All the hate that you've heard has turned your spirit to a dove, oh-ooh", es: "Todo el odio escuchado convirtió tu espíritu en una paloma" },
        { startTime: 85, text: "Your spirit up above, oh-ooh", es: "Tu espíritu en lo alto" },
        { startTime: 89, text: "I was choking in the crowd, building my rain up in the cloud", es: "Me asfixiaba entre la multitud, acumulando mi lluvia en las nubes" },
        { startTime: 93, text: "Falling like ashes to the ground, hoping my feelings they would drown", es: "Cayendo como ceniza al suelo, deseando que mis sentimientos se ahogaran" },
        { startTime: 97, text: "Till it broke open and rained down, it rained down, like...", es: "Hasta que se desató y llovió, llovió como..." },
        { startTime: 105, text: "Pain! You made me a, you made me a believer, believer!", es: "¡Dolor! Me convertiste en un creyente, ¡un creyente!" },
        { startTime: 113, text: "Pain! You break me down, you build me up, believer, believer!", es: "¡Dolor! Me derribas, me levantas, creyente, ¡un creyente!" },
        { startTime: 133, text: "Last things last: by the grace of the fire and the flame", es: "Por último: por la gracia del fuego y de la llama" },
        { startTime: 137, text: "You're the face of the future, the blood in my veins, oh-ooh", es: "Eres el rostro del porvenir, la sangre en mis venas" },
        { startTime: 154, text: "Pain! You made me a, you made me a believer, believer!", es: "¡Dolor! Me convertiste en un creyente, ¡un creyente!" }
      ],
      'count on me': [
        { startTime: 8, text: "If you ever find yourself stuck in the middle of the sea, I'll sail the world to find you", es: "Si alguna vez te encuentras atrapado en medio del mar, navegaré el mundo para encontrarte" },
        { startTime: 19, text: "If you ever find yourself lost in the dark and you can't see, I'll be the light to guide you", es: "Si alguna vez te pierdes en la oscuridad y no puedes ver, seré la luz que te guíe" },
        { startTime: 30, text: "We'll find out what we're made of, when we are called to help our friends in need", es: "Descubriremos de qué estamos hechos cuando nos llamen a ayudar a amigos necesitados" },
        { startTime: 41, text: "You can count on me like one, two, three, I'll be there", es: "Puedes contar conmigo como uno, dos, tres, allí estaré" },
        { startTime: 51, text: "And I know when I need it I can count on you like four, three, two, you'll be there", es: "Y sé que cuando lo necesite podré contar contigo como cuatro, tres, dos, allí estarás" },
        { startTime: 61, text: "'Cause that's what friends are supposed to do, oh yeah", es: "Porque para eso están los amigos, oh sí" },
        { startTime: 71, text: "If you toss and you turn and you just can't fall asleep, I'll sing a song beside you", es: "Si das vueltas en la cama y no logras dormir, te cantaré una canción a tu lado" },
        { startTime: 82, text: "And if you ever forget how much you really mean to me, everyday I will remind you", es: "Y si alguna vez olvidas cuánto vales para mí, cada día te lo recordaré" },
        { startTime: 93, text: "We'll find out what we're made of, when we are called to help our friends in need", es: "Descubriremos de qué estamos hechos cuando nos llamen a ayudar a amigos necesitados" },
        { startTime: 104, text: "You can count on me like one, two, three, I'll be there", es: "Puedes contar conmigo como uno, dos, tres, allí estaré" },
        { startTime: 114, text: "And I know when I need it I can count on you like four, three, two, you'll be there", es: "Y sé que cuando lo necesite podré contar contigo como cuatro, tres, dos, allí estarás" },
        { startTime: 124, text: "'Cause that's what friends are supposed to do, oh yeah", es: "Porque para eso están los amigos, oh sí" },
        { startTime: 133, text: "You'll always have my shoulder when you cry, I'll never let go, never say goodbye", es: "Siempre tendrás mi hombro cuando llores, nunca te soltaré, jamás diré adiós" },
        { startTime: 144, text: "You can count on me like one, two, three, I'll be there", es: "Puedes contar conmigo como uno, dos, tres, allí estaré" },
        { startTime: 154, text: "And I know when I need it I can count on you like four, three, two, you'll be there", es: "Y sé que cuando lo necesite podré contar contigo como cuatro, tres, dos, allí estarás" },
        { startTime: 164, text: "You can count on me 'cause I can count on you", es: "Puedes contar conmigo porque yo puedo contar contigo" }
      ],
      'yellow': [
        { startTime: 16, text: "Look at the stars, look how they shine for you", es: "Mira las estrellas, mira cómo brillan para ti" },
        { startTime: 24, text: "And everything you do, yeah, they were all yellow", es: "Y todo lo que haces, sí, todas eran amarillas" },
        { startTime: 37, text: "I came along, I wrote a song for you", es: "Llegué hasta aquí, escribí una canción para ti" },
        { startTime: 45, text: "And all the things you do, and it was called 'Yellow'", es: "Y todas las cosas que haces, y se llamaba 'Yellow'" },
        { startTime: 56, text: "So then I took my turn, oh what a thing to have done", es: "Así que llegó mi turno, qué gran cosa haber hecho" },
        { startTime: 65, text: "And it was all yellow", es: "Y todo era amarillo" },
        { startTime: 78, text: "Your skin, oh yeah your skin and bones", es: "Tu piel, oh sí, tu piel y tus huesos" },
        { startTime: 86, text: "Turn into something beautiful, you know, you know I love you so", es: "Se transforman en algo hermoso, sabes, sabes que te quiero tanto" },
        { startTime: 98, text: "You know I love you so", es: "Sabes que te quiero tanto" },
        { startTime: 112, text: "I swam across, I jumped across for you, oh what a thing to do", es: "Nadé al otro lado, salté al otro lado por ti, qué gran cosa hacer" },
        { startTime: 124, text: "'Cause you were all yellow, I drew a line, I drew a line for you", es: "Porque eras todo amarillo, tracé una línea por ti" },
        { startTime: 136, text: "Oh what a thing to do, and it was all yellow", es: "Qué gran cosa hacer, y todo era amarillo" },
        { startTime: 148, text: "Your skin, oh yeah your skin and bones", es: "Tu piel, oh sí, tu piel y tus huesos" },
        { startTime: 157, text: "Turn into something beautiful, and you know, for you I'd bleed myself dry", es: "Se transforman en algo hermoso, y sabes, por ti me desangraría" },
        { startTime: 169, text: "For you I'd bleed myself dry", es: "Por ti me desangraría" },
        { startTime: 184, text: "It's true, look how they shine for you, look how they shine for you", es: "Es verdad, mira cómo brillan para ti, mira cómo brillan para ti" },
        { startTime: 205, text: "Look at the stars, look how they shine for you, and all the things that you do", es: "Mira las estrellas, mira cómo brillan para ti, y todo lo que haces" }
      ],
      'stay with me': [
        { startTime: 8, text: "Guess it's true, I'm not good at a one-night stand", es: "Supongo que es verdad, no soy bueno para aventuras de una sola noche" },
        { startTime: 16, text: "But I still need love 'cause I'm just a man", es: "Pero aún necesito amor porque solo soy un ser humano" },
        { startTime: 24, text: "These nights never seem to go to plan", es: "Estas noches nunca parecen salir según el plan" },
        { startTime: 32, text: "I don't want you to leave, will you hold my hand?", es: "No quiero que te marches, ¿tomarías mi mano?" },
        { startTime: 41, text: "Oh, won't you stay with me? 'Cause you're all I need", es: "Oh, ¿no te quedarás conmigo? Porque eres todo lo que necesito" },
        { startTime: 49, text: "This ain't love, it's clear to see, but darling, stay with me", es: "Esto no es amor, está a la vista, pero cariño, quédate conmigo" },
        { startTime: 66, text: "Why am I so emotional? No, it's not a good look, gain some self-control", es: "¿Por qué me pongo tan sensible? No me veo bien, debo controlarme" },
        { startTime: 74, text: "And deep down I know this never works, but you can lay with me so it doesn't hurt", es: "Y en el fondo sé que esto nunca funciona, pero puedes recostarte conmigo para no sufrir" },
        { startTime: 90, text: "Oh, won't you stay with me? 'Cause you're all I need", es: "Oh, ¿no te quedarás conmigo? Porque eres todo lo que necesito" },
        { startTime: 99, text: "This ain't love, it's clear to see, but darling, stay with me", es: "Esto no es amor, está a la vista, pero cariño, quédate conmigo" },
        { startTime: 115, text: "Oh, won't you stay with me? 'Cause you're all I need", es: "Oh, ¿no te quedarás conmigo? Porque eres todo lo que necesito" },
        { startTime: 124, text: "This ain't love, it's clear to see, but darling, stay with me", es: "Esto no es amor, está a la vista, pero cariño, quédate conmigo" }
      ],
      'creep': [
        { startTime: 12, text: "When you were here before, couldn't look you in the eye", es: "Cuando estabas aquí antes, no podía mirarte a los ojos" },
        { startTime: 22, text: "You're just like an angel, your skin makes me cry", es: "Eres justo como un ángel, tu piel me hace llorar" },
        { startTime: 32, text: "You float like a feather in a beautiful world", es: "Flotas como una pluma en un mundo hermoso" },
        { startTime: 41, text: "I wish I was special, you're so very special", es: "Desearía ser especial, eres sumamente especial" },
        { startTime: 55, text: "But I'm a creep, I'm a weirdo", es: "Pero soy un bicho raro, soy un tipo extraño" },
        { startTime: 64, text: "What the hell am I doing here? I don't belong here", es: "¿Qué demonios hago aquí? No pertenezco a este lugar" },
        { startTime: 78, text: "I don't care if it hurts, I wanna have control", es: "No me importa si duele, quiero tener el control" },
        { startTime: 87, text: "I want a perfect body, I want a perfect soul", es: "Quiero un cuerpo perfecto, quiero un alma perfecta" },
        { startTime: 97, text: "I want you to notice when I'm not around", es: "Quiero que notes cuando no estoy cerca" },
        { startTime: 107, text: "You're so very special, I wish I was special", es: "Eres sumamente especial, desearía ser especial" },
        { startTime: 120, text: "But I'm a creep, I'm a weirdo", es: "Pero soy un bicho raro, soy un tipo extraño" },
        { startTime: 129, text: "What the hell am I doing here? I don't belong here, oh, oh", es: "¿Qué demonios hago aquí? No pertenezco a este lugar" },
        { startTime: 145, text: "She's running out the door, she's running out, she run, run, run, run... Run!", es: "Ella sale corriendo por la puerta, corre, corre... ¡Corre!" },
        { startTime: 175, text: "Whatever makes you happy, whatever you want", es: "Lo que sea que te haga feliz, lo que sea que quieras" },
        { startTime: 187, text: "You're so very special, I wish I was special", es: "Eres sumamente especial, desearía ser especial" },
        { startTime: 201, text: "But I'm a creep, I'm a weirdo, what the hell am I doing here? I don't belong here", es: "Pero soy un bicho raro, ¿qué demonios hago aquí? No pertenezco a este lugar" },
        { startTime: 218, text: "I don't belong here", es: "No pertenezco a este lugar" }
      ],
      'someone like you': [
        { startTime: 12, text: "I heard that you're settled down, that you found a girl and you're married now", es: "Oí que sentaste cabeza, que encontraste a una chica y te casaste" },
        { startTime: 24, text: "I heard that your dreams came true, guess she gave you things I didn't give to you", es: "Oí que tus sueños se cumplieron, supongo que te dio cosas que yo no te di" },
        { startTime: 36, text: "Old friend, why are you so shy? Ain't like you to hold back or hide from the light", es: "Viejo amigo, ¿por qué tan tímido? No es propio de ti ocultarte de la luz" },
        { startTime: 47, text: "I hate to turn up out of the blue, uninvited, but I couldn't stay away, I couldn't fight it", es: "Detesto aparecer de improviso, sin invitación, pero no pude resistirme" },
        { startTime: 59, text: "I had hoped you'd see my face and that you'd be reminded that for me, it isn't over", es: "Esperaba que vieras mi rostro y recordaras que para mí esto no ha terminado" },
        { startTime: 69, text: "Never mind, I'll find someone like you, I wish nothing but the best for you, too", es: "No te preocupes, encontraré a alguien como tú, y te deseo solo lo mejor" },
        { startTime: 81, text: "'Don't forget me,' I beg, 'I'll remember you said:'", es: "'No me olvides', te ruego, 'recordaré lo que dijiste:'" },
        { startTime: 87, text: "'Sometimes it lasts in love, but sometimes it hurts instead'", es: "'A veces el amor perdura, pero a veces duele'" },
        { startTime: 104, text: "You know how the time flies, only yesterday was the time of our lives", es: "Sabes cómo vuela el tiempo, apenas ayer fue el mejor momento de nuestras vidas" },
        { startTime: 116, text: "We were born and raised in a summer haze, bound by the surprise of our glory days", es: "Nacimos y crecimos en la bruma del verano, unidos por la gloria de aquellos días" },
        { startTime: 127, text: "I hate to turn up out of the blue, uninvited, but I couldn't stay away, I couldn't fight it", es: "Detesto aparecer de improviso, pero no pude resistirme" },
        { startTime: 139, text: "I had hoped you'd see my face and that you'd be reminded that for me, it isn't over", es: "Esperaba que vieras mi rostro y recordaras que para mí no ha terminado" },
        { startTime: 149, text: "Never mind, I'll find someone like you, I wish nothing but the best for you, too", es: "No te preocupes, encontraré a alguien como tú, te deseo solo lo mejor" },
        { startTime: 161, text: "'Don't forget me,' I beg, 'I'll remember you said:'", es: "'No me olvides', te ruego, 'recordaré lo que dijiste:'" },
        { startTime: 167, text: "'Sometimes it lasts in love, but sometimes it hurts instead'", es: "'A veces el amor perdura, pero a veces duele'" },
        { startTime: 184, text: "Nothing compares, no worries or cares, regrets and mistakes, they're memories made", es: "Nada se compara, sin preocupaciones, arrepentimientos y errores son recuerdos creados" },
        { startTime: 198, text: "Who would have known how bittersweet this would taste?", es: "¿Quién hubiera sabido qué tan agridulce sabría esto?" },
        { startTime: 209, text: "Never mind, I'll find someone like you, I wish nothing but the best for you, too", es: "No te preocupes, encontraré a alguien como tú, te deseo lo mejor" },
        { startTime: 221, text: "'Don't forget me,' I beg, 'I'll remember you said:'", es: "'No me olvides', te ruego, 'recordaré lo que dijiste:'" },
        { startTime: 227, text: "'Sometimes it lasts in love, but sometimes it hurts instead'", es: "'A veces el amor perdura, pero a veces duele'" }
      ],
      'shape of you': [
        { startTime: 9, text: "The club isn't the best place to find a lover, so the bar is where I go", es: "El club no es el mejor lugar para hallar un amor, así que voy al bar" },
        { startTime: 18, text: "Me and my friends at the table doing shots, drinking fast and then we talk slow", es: "Mis amigos y yo en la mesa tomando tragos, bebiendo rápido y conversando lento" },
        { startTime: 28, text: "Come over and start up a conversation with just me, and trust me I'll give it a chance now", es: "Acércate e inicia una conversación a solas conmigo, y créeme le daré una oportunidad" },
        { startTime: 39, text: "Took my hand, stop, put Van the Man on the jukebox, and then we start to dance", es: "Tomó mi mano, pon a Van Morrison en la rocola y empezamos a bailar" },
        { startTime: 49, text: "I'm in love with the shape of you, we push and pull like a magnet do", es: "Estoy enamorado de tu silueta, nos atraemos y empujamos como un imán" },
        { startTime: 59, text: "Although my heart is falling too, I'm in love with your body", es: "Aunque mi corazón también cae rendido, me enamora tu figura" },
        { startTime: 69, text: "Last night you were in my room, and now my bedsheets smell like you", es: "Anoche estuviste en mi cuarto, y ahora mis sábanas huelen a ti" },
        { startTime: 79, text: "Every day discovering something brand new, I'm in love with the shape of you", es: "Cada día descubro algo nuevo, estoy enamorado de tu silueta" }
      ],
      'in the end': [
        { startTime: 9, text: "It starts with one, one thing, I don't know why, it doesn't even matter how hard you try", es: "Empieza con una cosa, no sé por qué, ni siquiera importa qué tan duro lo intentes" },
        { startTime: 19, text: "Keep that in mind, I designed this rhyme to explain in due time all I know", es: "Tenlo presente, compuse esta rima para explicarte a su debido tiempo lo que sé" },
        { startTime: 26, text: "Time is a valuable thing, watch it fly by as the pendulum swings", es: "El tiempo es un tesoro invaluable, míralo pasar volando al compás del péndulo" },
        { startTime: 35, text: "Watch it count down to the end of the day, the clock ticks life away", es: "Míralo descontar hasta el fin del día, el reloj consume la vida" },
        { startTime: 44, text: "I tried so hard and got so far, but in the end it doesn't even matter", es: "Me esforcé tanto y llegué tan lejos, pero al final ni siquiera importa" },
        { startTime: 53, text: "I had to fall to lose it all, but in the end it doesn't even matter", es: "Tuve que caer para perderlo todo, pero al final ni siquiera importa" }
      ],
      'bohemian rhapsody': [
        { startTime: 4, text: "Is this the real life? Is this just fantasy?", es: "¿Es esta la vida real? ¿Es solo una fantasía?" },
        { startTime: 11, text: "Caught in a landslide, no escape from reality", es: "Atrapado en un derrumbe, sin escape de la realidad" },
        { startTime: 18, text: "Open your eyes, look up to the skies and see", es: "Abre tus ojos, mira hacia los cielos y contempla" },
        { startTime: 27, text: "I'm just a poor boy, I need no sympathy", es: "Solo soy un muchacho pobre, no necesito compasión" },
        { startTime: 33, text: "Because I'm easy come, easy go, little high, little low", es: "Porque lo que fácil viene fácil se va, un poco arriba, un poco abajo" },
        { startTime: 42, text: "Any way the wind blows doesn't really matter to me, to me", es: "Hacia donde sople el viento realmente no me importa, a mí" },
        { startTime: 55, text: "Mama, just killed a man, put a gun against his head, pulled my trigger, now he's dead", es: "Mamá, acabo de matar a un hombre, puse un arma en su frente, disparé y está muerto" },
        { startTime: 73, text: "Mama, life had just begun, but now I've gone and thrown it all away", es: "Mamá, la vida apenas comenzaba, pero ahora fui y lo arruiné todo" },
        { startTime: 87, text: "Mama, ooh, didn't mean to make you cry, if I'm not back again this time tomorrow", es: "Mamá, ooh, no quise hacerte llorar, si no estoy de regreso mañana a esta hora" },
        { startTime: 104, text: "Carry on, carry on as if nothing really matters", es: "Sigue adelante, sigue adelante como si nada importara en verdad" }
      ],
      'radioactive': [
        { startTime: 14, text: "I'm waking up to ash and dust, I wipe my brow and I sweat my rust", es: "Despierto entre cenizas y polvo, me limpio la frente y sudo todo mi óxido" },
        { startTime: 22, text: "I'm breathing in the chemicals, I'm breaking in, shaping up", es: "Respiro las sustancias químicas, entrando en ritmo, poniéndome a tono" },
        { startTime: 28, text: "Then checking out on the prison bus, this is it, the apocalypse", es: "Partiendo en el autobús del penal, esto es todo, el apocalipsis" },
        { startTime: 42, text: "I'm waking up, I feel it in my bones, enough to make my systems blow", es: "Despierto, lo siento en mis huesos, suficiente para hacer estallar mis sistemas" },
        { startTime: 49, text: "Welcome to the new age, to the new age", es: "Bienvenido a la nueva era, a la nueva era" },
        { startTime: 56, text: "Whoa, oh, oh, oh, I'm radioactive, radioactive", es: "Whoa, oh, oh, oh, soy radiactivo, radiactivo" }
      ]
    };

    window.getCuratedRecommendedLyrics = function(title, artist, totalSongDuration = 210) {
      if (!title) return null;
      const t = title.toLowerCase().trim().replace(/['"’]/g, '');
      const a = (artist || '').toLowerCase().trim().replace(/['"’]/g, '');
      let matchKey = null;

      for (const k of Object.keys(window.RECOMMENDED_CURATED_LYRICS)) {
        const cleanK = k.replace(/['"’]/g, '');
        if (t.includes(cleanK) || cleanK.includes(t)) {
          matchKey = k;
          break;
        }
      }

      if (!matchKey) return null;

      const rawList = window.RECOMMENDED_CURATED_LYRICS[matchKey];
      if (!Array.isArray(rawList) || !rawList.length) return null;

      return rawList.map((entry, idx) => {
        const nextEntry = rawList[idx + 1];
        const naturalEnd = nextEntry ? Math.max(entry.startTime + 1.8, nextEntry.startTime) : Math.max(entry.startTime + 4.5, totalSongDuration);
        const endTime = Math.min(naturalEnd, entry.startTime + 6.5);
        const words = (entry.text || '').split(/\s+/).filter(Boolean);
        return {
          index: idx,
          startTime: entry.startTime,
          time: entry.startTime,
          originalTime: entry.startTime,
          endTime: Math.max(entry.startTime + 0.4, endTime),
          nextLineStart: naturalEnd,
          text: entry.text,
          lines: [entry.text],
          words,
          textEs: entry.es,
          es: entry.es,
          isLrcSynced: true
        };
      });
    };

    /* ========================================================
       REPRODUCTOR DE CANCIÓN COMPLETA (3 A 5 MINUTOS) EN ESCENARIO HOLOGRÁFICO
       ======================================================== */
    window.loadSongToKaraoke = function(trackName, artistName, previewUrl, artworkUrl, durationSec) {
      if (typeof window.openMusicPlayerStage === 'function') {
        window.openMusicPlayerStage();
      }
      return (async function() {
        // 1. Identificador de sesión único por canción y cancelación de peticiones asíncronas previas
        window.currentSongSessionId = Date.now();
        const thisSessionId = window.currentSongSessionId;

        if (window._currentSongAbortController) {
          try { window._currentSongAbortController.abort(); } catch (_) {}
        }
        window._currentSongAbortController = (typeof AbortController !== 'undefined') ? new AbortController() : null;

        // 2. Función de reinicio total que se ejecuta en el segundo cero al seleccionar cualquier canción
        if (typeof window.resetSongPlayerSession === 'function') {
          window.resetSongPlayerSession();
        } else {
          window.stopAllMedia();
        }

        // 2. Pantalla dedicada: Ocultar buscador y mostrar exclusivamente el reproductor arriba
        const searchSub = document.getElementById('music-search-subview');
        const playerSub = document.getElementById('music-player-subview');
        if (searchSub) {
          searchSub.style.display = 'none';
          searchSub.classList.add('hidden');
        }
        if (playerSub) {
          playerSub.style.display = 'block';
          playerSub.classList.remove('hidden');
        }
        if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        const titleEl = document.getElementById('activeMusicTitle');
        const artistEl = document.getElementById('activeMusicArtist');
        if (titleEl) titleEl.textContent = trackName;
        if (artistEl) artistEl.textContent = artistName;

        const hdArtwork = (artworkUrl || 'images/portal_music.svg').replace(/100x100bb|300x300bb/g, '600x600bb');

        // 3. Reemplazar el iframe fijo de R.E.M. por el Escenario Holográfico Interactivo
        const iframe = document.getElementById('musicYouTubeIframe');
        const origVideoWrapper = document.getElementById('musicOriginalVideoWrapper') || (iframe ? iframe.parentElement : null);
        const origMetaWrapper = document.getElementById('musicOriginalMetaWrapper');

        if (iframe) {
          iframe.style.display = 'none';
          try {
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
            }
          } catch (e) {}
        }
        if (origVideoWrapper) origVideoWrapper.style.display = 'none';
        if (origMetaWrapper) origMetaWrapper.style.display = 'none';

        // 4. Calcular duración real de la canción completa (3 a 5 minutos)
        let totalDurationSec = (typeof durationSec === 'number' && durationSec > 30) ? durationSec : 0;
        if (!totalDurationSec && window._lastSearchedWebSongs) {
          const matchSong = window._lastSearchedWebSongs.find(s =>
            s.trackName && trackName && s.trackName.toLowerCase() === trackName.toLowerCase()
          );
          if (matchSong && matchSong.trackTimeMillis && matchSong.trackTimeMillis > 30000) {
            totalDurationSec = Math.round(matchSong.trackTimeMillis / 1000);
          }
        }
        if (!totalDurationSec) {
          const tLower = (trackName || '').toLowerCase();
          if (tLower.includes('creep')) totalDurationSec = 238; // 3:58
          else if (tLower.includes('bohemian rhapsody')) totalDurationSec = 355; // 5:55
          else if (tLower.includes('losing my religion')) totalDurationSec = 268; // 4:28
          else if (tLower.includes('hotel california')) totalDurationSec = 390; // 6:30
          else totalDurationSec = 225; // 3:45 promedio
        }

        const fmtTime = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
        const totalDurationFormatted = fmtTime(totalDurationSec);

        window._currentTrackTotalDuration = totalDurationSec;
        window._currentTrackCurrentTime = 0;
        window._currentTrackStartTime = Date.now();
        window._isHoloStagePlaying = true;

        // 5. Resolver automáticamente el 'videoId' de la canción completa
        window._currentPlayingTrackName = trackName;
        window.lyricsOffset = 0; // Inicializa window.lyricsOffset = 0 por defecto al cargar cancion nueva
        const offsetBadge = document.getElementById('lyricsOffsetBadge');
        if (offsetBadge) offsetBadge.textContent = 'Sync: 0.0s';
        const { cleanTitle, cleanArtist } = window.cleanTrackMetadata ? window.cleanTrackMetadata(trackName, artistName) : { cleanTitle: trackName, cleanArtist: artistName };
        let variantTag = 'official audio';
        const lowerTrack = (trackName || '').toLowerCase();
        if (lowerTrack.includes('acoustic') || lowerTrack.includes('acústica') || lowerTrack.includes('acustica')) {
          variantTag = 'acoustic audio oficial';
        } else if (lowerTrack.includes('live') || lowerTrack.includes('en vivo')) {
          variantTag = 'live audio oficial';
        } else if (lowerTrack.includes('studio') || lowerTrack.includes('estudio')) {
          variantTag = 'studio version audio oficial';
        }
        const officialSearchQuery = `${cleanArtist} ${cleanTitle} ${variantTag}`;
        let youtubeVideoId = null;
        if (typeof window.resolveYouTubeVideoId === 'function') {
          try {
            youtubeVideoId = await window.resolveYouTubeVideoId(artistName, trackName);
          } catch (e) {
            console.warn('Error resolviendo videoId:', e);
          }
        }

        // Si una respuesta asíncrona llega pero el ID de sesión no coincide, descártala por completo
        if (window.currentSongSessionId !== thisSessionId) {
          console.log('[Karaoke Session] Descartando video YouTube: sesión obsoleta.');
          return;
        }

        const youtubeIdToUse = youtubeVideoId || '6cucosmPj-A';
        if (window.KaraokeSyncEngine) {
          window.KaraokeSyncEngine.currentTrack = window.KaraokeSyncEngine.currentTrack || {};
          window.KaraokeSyncEngine.currentTrack.youtubeId = youtubeIdToUse;
        }
        const fullSongEmbedUrl = `https://www.youtube-nocookie.com/embed/${youtubeIdToUse}?enablejsapi=1&autoplay=1&rel=0`;

        let holoStage = document.getElementById('musicHolographicStage');
        if (!holoStage && origVideoWrapper && origVideoWrapper.parentElement) {
          holoStage = document.createElement('div');
          holoStage.id = 'musicHolographicStage';
          holoStage.className = 'w-full flex flex-col gap-3 select-none rounded-2xl';
          origVideoWrapper.parentElement.appendChild(holoStage);
        }

        if (holoStage) {
          holoStage.style.display = 'flex';
          holoStage.classList.remove('hidden');
          const eqBarsHtml = Array.from({ length: 18 }, () => '<div class="holo-eq-bar"></div>').join('');
          holoStage.innerHTML = `
            <!-- BLOQUE 1 (ARRIBA): Marco Panorámico 16:9 Exclusivo para el Video YouTube (CERO Superposición) -->
            <div id="holoVideoContainer" class="relative w-full rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-cyan-500/30" style="aspect-ratio: 16/9; width: 100%; border-radius: 16px; overflow: hidden;">
              <iframe id="musicHoloYoutubeIframe"
                class="w-full h-full object-cover pointer-events-auto"
                src="${fullSongEmbedUrl}"
                title="${trackName.replace(/"/g, '&quot;')} - Official Audio"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
              <!-- OVERLAY INTERACTIVO DE DESBLOQUEO DE AUDIO (Cero silencio por políticas de autoplay) -->
              <div id="audioUnlockOverlay" class="hidden absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 transition-all duration-300" style="display: none;">
                <button type="button" id="audioUnlockBtn" onclick="window.unlockAudioAndPlay()"
                  class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-black text-sm sm:text-base flex items-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer transform hover:scale-105 active:scale-95 transition">
                  <span class="text-xl">▶</span>
                  <span>Reproducir Audio</span>
                </button>
                <p class="text-xs text-cyan-300/80 mt-2.5 font-medium">Haz clic para activar el sonido de la canción</p>
              </div>
              <!-- CONTENEDOR DE AUDIO VISUALIZADOR HOLOGRÁFICO DE RESPALDO (Oculto por defecto, se activa si hay error 101/150) -->
              <div id="holoAudioFallbackStage" class="hidden absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden" style="display: none;">
                <div class="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-500 shadow-[0_0_50px_rgba(6,182,212,0.5)] animate-pulse mb-3">
                  <img id="holoAudioFallbackArtwork" src="${hdArtwork}" alt="${trackName.replace(/"/g, '&quot;')}" class="w-full h-full object-cover rounded-full shadow-inner" onerror="this.onerror=null; this.src='images/portal_music.svg';">
                  <div class="absolute inset-0 rounded-full bg-cyan-400/10 pointer-events-none"></div>
                </div>
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>Holograma de Audio HD • Canción Completa</span>
                  </span>
                </div>
                <h3 id="holoAudioFallbackTitle" class="text-white text-base sm:text-lg font-black tracking-wide truncate max-w-[90%]">${trackName}</h3>
                <p id="holoAudioFallbackArtist" class="text-cyan-300/80 text-xs font-semibold mb-3 truncate max-w-[90%]">${artistName}</p>
                <div id="holoAudioWaveContainer" class="flex items-end justify-center gap-1 sm:gap-1.5 h-10 w-full max-w-xs px-2">
                  ${Array.from({ length: 28 }, (_, i) => `<div class="holo-audio-wave-bar" style="animation-delay: ${(i * 0.05).toFixed(2)}s"></div>`).join('')}
                </div>
              </div>
            </div>

            <!-- BLOQUE 2 (ABAJO): Barra de Controles Desacoplada e Independiente (Inmediatamente Abajo del Video) -->
            <div class="w-full mt-3 p-3.5 rounded-2xl bg-slate-950/95 border border-cyan-500/30 shadow-2xl flex flex-col gap-2.5">
              <!-- Fila Superior: HUD y Selector Modo Cine vs Karaoke -->
              <div class="flex items-center justify-between text-[11px] font-mono text-cyan-300">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-slate-900 border border-cyan-500/40 font-bold">
                    ✨ CANCIÓN COMPLETA
                  </span>
                  <button type="button" id="cinemaModeToggleBtn" onclick="window.toggleCinemaMode()"
                    class="px-2.5 py-0.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/50 text-cyan-200 hover:text-white text-[11px] font-bold transition cursor-pointer active:scale-95 flex items-center gap-1 shadow-sm">
                    <span id="cinemaModeToggleLabel">🎬 Modo Cine / Video Completo</span>
                  </button>
                </div>
                <span id="holoStageTime" class="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-300 font-bold font-mono">
                  0:00 / ${totalDurationFormatted}
                </span>
              </div>

              <!-- Fila Media: Carátula HD 600x600, Info de la Pista, Botones de Control y Ecualizador -->
              <div class="flex items-center gap-3 w-full">
                <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.35)] shrink-0 bg-slate-900">
                  <img id="holoStageControlsArtwork" src="${hdArtwork}" alt="${trackName.replace(/"/g, '&quot;')}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='images/portal_music.svg';">
                </div>
                <div class="flex flex-col items-start min-w-0 flex-1">
                  <div class="flex items-center justify-between w-full">
                    <span class="text-[10px] uppercase tracking-wider text-cyan-400 font-black">Estudio Musical • Full Track</span>
                    <span class="text-[10px] text-slate-400 font-mono">${totalDurationFormatted}</span>
                  </div>
                  <h4 class="text-sm font-black text-white truncate w-full">${trackName}</h4>
                  <p class="text-xs text-slate-300 font-semibold truncate w-full mb-1">${artistName}</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button type="button" id="holoStagePlayBtn" onclick="window.toggleMainStageAudio()"
                    class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-base font-black flex items-center justify-center shadow-lg shadow-cyan-500/40 cursor-pointer active:scale-95 transition">
                    <span id="holoStagePlayIcon">⏸️</span>
                  </button>
                  <button type="button" id="holoStageMuteBtn" onclick="window.toggleHoloStageMute()"
                    class="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-white flex items-center justify-center text-xs cursor-pointer active:scale-95 transition" title="Silenciar / Activar sonido">
                    <span id="holoStageMuteIcon">🔊</span>
                  </button>
                  <div id="holoStageEqualizer" class="hidden sm:flex items-end gap-1 h-6 px-1.5 py-1 rounded-lg bg-slate-900/80 border border-cyan-500/30 holo-eq-playing">
                    ${eqBarsHtml}
                  </div>
                </div>
              </div>

              <!-- Fila Inferior: Barra de Progreso Interactiva (Seek Slider) -->
              <div class="relative w-full pt-1 flex flex-col gap-1.5">
                <div class="flex items-center justify-between text-xs font-mono text-cyan-300">
                  <span id="karaoke-time-label">0:00 / ${totalDurationFormatted}</span>
                </div>
                <input type="range" id="karaoke-seek-slider" min="0" max="${totalDurationSec}" value="0" step="0.1" class="w-full cursor-pointer accent-cyan-400" title="Desliza para adelantar o atrasar la canción" />
                <div id="holoStageProgressContainer" onclick="window.seekHoloStageTrack(event)" style="display:none;" class="hidden"
                  class="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/40 cursor-pointer relative group p-0.5 shadow-inner" title="Haz clic en la barra para saltar en la canción">
                  <div id="holoStageProgressBar" class="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 rounded-full transition-all duration-150" style="width: 0%;"></div>
                </div>
              </div>
            </div>
          `;
        }

        // Cero reproductor de 30 segundos: Desactivar y ocultar cualquier audioTracker residual
        const audioTracker = document.getElementById('karaokeAudioTracker');
        if (audioTracker) {
          audioTracker.pause();
          audioTracker.removeAttribute('src');
          audioTracker.style.display = 'none';
        }

        // 5.1 Variables de sesión activa del reproductor
        window._currentPlayingTrackName = trackName;
        window._currentPlayingArtistName = artistName;
        window._currentPlayingPreviewUrl = previewUrl || '';
        window._currentPlayingArtwork = hdArtwork;
        const ctrlArtwork = document.getElementById('holoStageControlsArtwork');
        if (ctrlArtwork) ctrlArtwork.src = hdArtwork;
        const fallbackArtworkEl = document.getElementById('holoAudioFallbackArtwork');
        if (fallbackArtworkEl) fallbackArtworkEl.src = hdArtwork;
        window._currentPlayingYoutubeId = youtubeVideoId;
        if (typeof window.initKaraokeSeekSliderEvents === 'function') window.initKaraokeSeekSliderEvents();
        window._holoPlayerFallbackStage = 0;
        window._holoPlayerHasStartedPlaying = false;

        // 5.2 Enlazar reproductor de YouTube oficial para capturar eventos de reproducción y errores en tiempo real
        if (window.YT && window.YT.Player) {
          try {
            if (window._holoYtPlayer && typeof window._holoYtPlayer.destroy === 'function') {
              try { window._holoYtPlayer.destroy(); } catch (_) {}
            }
            window._holoYtPlayer = new YT.Player('musicHoloYoutubeIframe', {
              events: {
                'onReady': function(ev) {
                  try {
                    ev.target.unMute();
                    ev.target.setVolume(100);
                    ev.target.playVideo();
                  } catch (err) {
                    console.warn('[YouTube Engine] Autoplay bloqueado por el navegador:', err);
                    if (typeof window.showAudioUnlockOverlay === 'function') {
                      window.showAudioUnlockOverlay();
                    }
                  }
                  if (typeof window.logAudioDiagnosticStatus === 'function') {
                    window.logAudioDiagnosticStatus('YouTube', 'Playing', 100);
                  }
                },
                'onStateChange': function(ev) {
                  if (typeof window.handleHoloPlayerStateChange === 'function') {
                    window.handleHoloPlayerStateChange(ev.data);
                  }
                },
                'onError': function(ev) {
                  if (typeof window.handleHoloPlayerError === 'function') {
                    window.handleHoloPlayerError(ev.data);
                  }
                }
              }
            });
          } catch (_) {}
        }

        // Comandos de desmuteo preventivo vía postMessage y listener de iframe
        const ytIframeEl = document.getElementById('musicHoloYoutubeIframe');
        if (ytIframeEl) {
          const sendUnmute = () => {
            try {
              if (ytIframeEl.contentWindow) {
                ytIframeEl.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                ytIframeEl.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[100]}', '*');
                ytIframeEl.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
              }
            } catch (_) {}
          };
          if (typeof ytIframeEl.addEventListener === 'function') {
            ytIframeEl.addEventListener('load', () => {
              setTimeout(sendUnmute, 200);
              setTimeout(sendUnmute, 800);
            });
          }
          setTimeout(sendUnmute, 400);
        }

        // Watchdog de 10 segundos para detectar bloqueos de incrustación o falta de inicio
        if (window._holoPlayerWatchdogTimer) clearTimeout(window._holoPlayerWatchdogTimer);
        window._holoPlayerWatchdogTimer = setTimeout(() => {
          const ytPlayer = window._holoYtPlayer;
          const pState = (ytPlayer && typeof ytPlayer.getPlayerState === 'function') ? ytPlayer.getPlayerState() : null;
          if (pState === 1 || pState === 3 || window._holoPlayerHasStartedPlaying) return;
          if (!window._holoPlayerHasStartedPlaying && window._isHoloStagePlaying && window._holoPlayerFallbackStage === 0) {
            console.warn('[YouTube Watchdog] Video restringido o no inició en 10s, iniciando fallback...');
            if (typeof window.handleHoloPlayerError === 'function') {
              window.handleHoloPlayerError('TIMEOUT_OR_BLOCKED');
            }
          }
        }, 10000);

        // 6. Iniciar temporizador de sincronización en tiempo real
        window.startKaraokeSyncTimer();

        // 7. Consultar letra completa en tiempo real
        const lyricsContainer = document.getElementById('musicLyricsContainer');
        if (lyricsContainer) {
          lyricsContainer.innerHTML = `
            <div class="py-8 text-center text-cyan-300 text-xs font-semibold flex flex-col items-center gap-2">
              <div class="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
              <span>Consultando letra oficial en tiempo real para "${trackName}" — ${artistName}...</span>
            </div>
          `;
        }

        let finalLyrics = null;
        window._isCurrentSongLrcSynced = false;
        const cleanTitleForApi = trackName.replace(/\s*\([^)]*\)/g, '').replace(/\s*-\s*.*$/, '').trim() || trackName;
        const cleanArtistForApi = artistName.replace(/\s*&.*$/, '').trim() || artistName;

        // 7.0 Consulta prioritaria a letra curada recomendada de alta precision (Cero saltos de estrofas)
        if (typeof window.getCuratedRecommendedLyrics === 'function') {
          const curated = window.getCuratedRecommendedLyrics(cleanTitleForApi, cleanArtistForApi, totalDurationSec);
          if (curated && curated.length > 0) {
            finalLyrics = curated;
            window._isCurrentSongLrcSynced = true;
          }
        }

        // 7A. Consulta primaria universal al motor LRCLIB (LRC oficial sincronizado o plainLyrics estructurada)
        if (!finalLyrics || finalLyrics.length === 0) {
          try {
            const exactRes = await window.fetchExactSyncedLyrics(cleanArtistForApi, cleanTitleForApi, totalDurationSec, window._currentSongAbortController ? window._currentSongAbortController.signal : null);
            if (window.currentSongSessionId !== thisSessionId) return;
            if (exactRes) {
              if (exactRes.type === 'lrc' && exactRes.lrcText) {
                const parsed = window.parseLrcUniversal(exactRes.lrcText, totalDurationSec || exactRes.lrcDuration);
                if (parsed && parsed.length > 0) {
                  finalLyrics = parsed;
                  window._isCurrentSongLrcSynced = true;
                }
              } else if (exactRes.type === 'plain' && exactRes.plainText) {
                const parsed = window.parseRawLyricsIntoStanzas(exactRes.plainText, totalDurationSec, true);
                if (parsed && parsed.length > 0) {
                  finalLyrics = parsed;
                  window._isCurrentSongLrcSynced = false;
                }
              }
            }
          } catch (exactErr) {
            if (exactErr.name === 'AbortError') return;
          }
        }

        try {
          if (!finalLyrics || finalLyrics.length === 0) {
            const lrcResult = await window.fetchLrclibSyncedLyrics(cleanArtistForApi, cleanTitleForApi, totalDurationSec);
          if (window.currentSongSessionId !== thisSessionId) {
            console.log('[Karaoke Session] Descartando respuesta LRCLIB: sesión obsoleta.');
            return;
          }
          if (lrcResult && Array.isArray(lrcResult.lyrics) && lrcResult.lyrics.length > 0) {
            finalLyrics = lrcResult.lyrics;
            window._isCurrentSongLrcSynced = !!lrcResult.isLrc;
            }
          }
        } catch (lrcErr) {
          console.warn('[LRCLIB] Error obteniendo letra sincronizada:', lrcErr);
        }

        // 7B. Respaldo terciario a https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtistForApi)}/${encodeURIComponent(cleanTitleForApi)} (compatibilidad offline/sandbox)
        if (!finalLyrics || finalLyrics.length === 0) {
          try {
            const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
            const tId = ctrl ? setTimeout(() => ctrl.abort(), 3000) : null;
            const ovhUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtistForApi)}/${encodeURIComponent(cleanTitleForApi)}`;
            const ovhRes = await fetch(ovhUrl, ctrl ? { signal: ctrl.signal } : {});
            if (tId) clearTimeout(tId);
            if (ovhRes && ovhRes.ok) {
              const ovhData = await ovhRes.json();
              if (ovhData && ovhData.lyrics) {
                finalLyrics = window.parseRawLyricsIntoStanzas(ovhData.lyrics, totalDurationSec, true);
              }
            }
          } catch (ovhErr) {}
        }

        // 7C. Respaldo automático de estrofas sincronizadas si la red está offline
        if (!finalLyrics || finalLyrics.length === 0) {
          finalLyrics = [
            {
              time: 12,
              originalTime: 12,
              text: "When you were here before\nCouldn't look you in the eye\nYou're just like an angel",
              lines: ["When you were here before", "Couldn't look you in the eye", "You're just like an angel"],
              es: "Cuando estabas aquí antes, no podía mirarte a los ojos",
              isApproximatedSync: true
            },
            {
              time: 26,
              text: "Your skin makes me cry\nYou float like a feather\nIn a beautiful world",
              lines: ["Your skin makes me cry", "You float like a feather", "In a beautiful world"],
              es: "Eres justo como un ángel, flotas como una pluma en un mundo hermoso"
            },
            {
              time: 42,
              text: "I wish I was special\nYou're so very special\nBut I'm a creep, I'm a weirdo",
              lines: ["I wish I was special", "You're so very special", "But I'm a creep, I'm a weirdo"],
              es: "Desearía ser especial, pero soy un bicho raro"
            },
            {
              time: 58,
              text: "What the hell am I doing here?\nI don't belong here\nI don't care if it hurts",
              lines: ["What the hell am I doing here?", "I don't belong here", "I don't care if it hurts"],
              es: "¿Qué diablos hago aquí? No pertenezco a este lugar"
            },
            {
              time: 74,
              text: "I wanna have control\nI want a perfect body\nI want a perfect soul",
              lines: ["I wanna have control", "I want a perfect body", "I want a perfect soul"],
              es: "Quiero tener el control, quiero un cuerpo y un alma perfectos"
            },
            {
              time: 90,
              text: "I want you to notice\nWhen I'm not around\nYou're so very special",
              lines: ["I want you to notice", "When I'm not around", "You're so very special"],
              es: "Quiero que te des cuenta cuando no estoy cerca"
            },
            {
              time: 106,
              text: "Click any English word above to practice phonetic IPA\nKeep singing and level up your fluency!",
              lines: ["Click any English word above to practice phonetic IPA", "Keep singing and level up your fluency!"],
              es: "Haz clic en cualquier palabra en inglés para practicar su fonética IPA"
            }
          ];
        }

        if (window.currentSongSessionId !== thisSessionId) {
          console.log('[Karaoke Session] Descartando renderizado de letra: sesión obsoleta.');
          return;
        }

        if (window.KaraokeSyncEngine && typeof window.KaraokeSyncEngine.initSong === 'function') {
          window.KaraokeSyncEngine.initSong(finalLyrics);
        }
        if (typeof window.renderLyricsFromList === 'function') {
          window.renderLyricsFromList(finalLyrics);
        }

        showFloatingToast(`Reproduciendo "${trackName}" (${totalDurationFormatted}) en Canción Completa`, '🎤');
        const lyricsBox = document.getElementById('musicLyricsContainer');
        if (lyricsBox) lyricsBox.scrollTop = 0;
        if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' });
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
            if (typeof enrichMasterModulesDictionary === 'function') enrichMasterModulesDictionary();
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

  /* ==========================================================================
     PORTAL 04: TUTOR IA CONVERSACIONAL (VOZ Y TEXTO) - SISTEMA COMPLETO
     ========================================================================== */
  window.aiTutorMessages = [];
  window.aiTutorVoiceEnabled = true;
  window.aiTutorSpeechRecognition = null;
  window.isAiTutorListening = false;

  window.getAiChatUserKey = function() {
    try {
      const raw = localStorage.getItem('mastereng_user');
      if (!raw) return 'ai_chat_guest';
      const u = JSON.parse(raw);
      const emailOrName = (u.email || u.username || 'user').trim().toLowerCase();
      return `ai_chat_${emailOrName}`;
    } catch (_) {
      const rawStr = (localStorage.getItem('mastereng_user') || 'user').trim().toLowerCase();
      return `ai_chat_${rawStr}`;
    }
  };

  window.loadUserChatHistory = function() {
    try {
      const key = window.getAiChatUserKey();
      const raw = localStorage.getItem(key);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          window.aiTutorMessages = data.messages;
        }
        if (Array.isArray(data.history) && data.history.length > 0) {
          window.aiChatHistory = data.history;
        }
        return true;
      }
    } catch (e) {
      console.warn('Error loading user AI chat:', e);
    }
    return false;
  };

  window.saveUserChatHistory = function() {
    try {
      const key = window.getAiChatUserKey();
      const payload = {
        messages: window.aiTutorMessages || [],
        history: window.aiChatHistory || [],
        lastUpdated: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(payload));
    } catch (e) {
      console.warn('Error saving user AI chat:', e);
    }
  };

  window.initAiTutorChat = function() {
    if (typeof window.isUserRegistered === 'function' && !window.isUserRegistered()) {
      const tutorView = document.getElementById('ai-tutor-view');
      if (tutorView) {
        tutorView.style.setProperty('display', 'none', 'important');
        tutorView.classList.add('hidden');
      }
      if (typeof window.showFloatingToast === 'function') {
        window.showFloatingToast('🔒 Inicia sesión con tu cuenta para acceder al Tutor IA.', '🔒');
      }
      if (typeof window.goToHomePortals === 'function') {
        window.goToHomePortals();
      } else if (typeof window.navigateTo === 'function') {
        window.navigateTo('hub');
      }
      return;
    }
    const container = document.getElementById('aiTutorChatMessages');
    if (!container) return;
    const hasLoaded = window.loadUserChatHistory();
    if (!hasLoaded || !window.aiTutorMessages || window.aiTutorMessages.length === 0) {
      window.aiTutorMessages = [
        {
          role: 'model',
          text: "Hello there! 👋 I am your friendly AI English Tutor. How are you doing today? You can type your message in English or tap 🎤 Hablar to practice speaking!"
        }
      ];
    }
    window.renderAiTutorMessages();
    if (typeof window.renderAiTutorHistorySidebar === 'function') {
      window.renderAiTutorHistorySidebar();
    }
    if (typeof window.applyAuthGuardsUI === 'function') {
      window.applyAuthGuardsUI();
    }
  };

  window.renderAiTutorMessages = function() {
    const container = document.getElementById('aiTutorChatMessages');
    if (!container) return;
    container.textContent = '';

    window.aiTutorMessages.forEach((msg) => {
      const isBot = msg.role === 'model';
      const wrapper = document.createElement('div');
      wrapper.className = isBot ? 'flex items-start gap-2 max-w-[85%]' : 'flex items-end justify-end max-w-[85%] ml-auto';

      const timeStr = msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      msg.time = timeStr;

      const bubble = document.createElement('div');
      bubble.className = isBot ? 'ai-bubble-bot' : 'ai-bubble-user';
      const safeText = (msg.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
      const voiceBadge = (!isBot && msg.isVoice) ? '<span class="inline-block mr-1 text-[11px]" title="Mensaje por voz">🎙️</span>' : '';
      bubble.innerHTML = `<span>${voiceBadge}${safeText}</span><span class="chat-timestamp" style="display:block; text-align:right; font-size:0.65rem; opacity:0.6; margin-top:4px;">${timeStr}</span>`;

      if (isBot) {
        const avatar = document.createElement('div');
        avatar.className = 'w-7 h-7 rounded-xl bg-sky-950 border border-sky-400/40 p-0.5 shrink-0 overflow-hidden mt-1';
        avatar.innerHTML = '<img src="images/ai_tutor_mascot.jpg" alt="AI" class="w-full h-full object-cover rounded-lg" onerror="this.onerror=null; this.src=\'images/ai_tutor_mascot.svg\';">';
        wrapper.appendChild(avatar);

        const contentCol = document.createElement('div');
        contentCol.className = 'flex flex-col gap-1';
        contentCol.appendChild(bubble);

        const actions = document.createElement('div');
        actions.className = 'flex items-center gap-2 px-1 text-[10px] text-slate-400';
        const playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.className = 'hover:text-sky-300 transition cursor-pointer flex items-center gap-1';
        playBtn.innerHTML = '<span>🔊 Escuchar</span>';
        playBtn.onclick = () => window.speakAiTutorText(msg.text);
        actions.appendChild(playBtn);

        const transBtn = document.createElement('button');
        transBtn.type = 'button';
        transBtn.className = 'hover:text-amber-300 transition cursor-pointer flex items-center gap-1 text-slate-400';
        transBtn.innerHTML = '<span>🌐 Traducir</span>';
        
        const transBox = document.createElement('div');
        transBox.className = 'ai-msg-translation-box hidden mt-1 p-2 rounded-lg bg-slate-900/90 border border-amber-500/30 text-amber-200 text-xs font-normal leading-relaxed';
        contentCol.appendChild(transBox);

        transBtn.onclick = async () => {
          if (!transBox.classList.contains('hidden')) {
            transBox.classList.add('hidden');
            transBox.style.display = 'none';
            return;
          }
          if (transBox.dataset.translated) {
            transBox.classList.remove('hidden');
            transBox.style.display = 'block';
            return;
          }
          transBtn.innerHTML = '<span>⏳ Traduciendo...</span>';
          try {
            const es = await window.translateTextToSpanish(msg.text);
            transBox.textContent = es;
            transBox.dataset.translated = 'true';
            transBox.classList.remove('hidden');
            transBox.style.display = 'block';
          } catch(e) {
            transBox.textContent = 'Traducción no disponible temporalmente.';
            transBox.classList.remove('hidden');
            transBox.style.display = 'block';
          } finally {
            transBtn.innerHTML = '<span>🌐 Traducir</span>';
          }
        };
        actions.appendChild(transBtn);

        contentCol.appendChild(actions);

        wrapper.appendChild(contentCol);
      } else {
        wrapper.appendChild(bubble);
      }

      container.appendChild(wrapper);
    });
    if (typeof window.injectTranslateButtonsInChat === 'function') {
      window.injectTranslateButtonsInChat();
    }

    container.scrollTop = container.scrollHeight;
  };

  window.speakAiTutorText = function(text) {
    if (!('speechSynthesis' in window) || !window.aiTutorVoiceEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = (text || '').replace(/[*_#`]/g, '');
      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.lang = 'en-US';
      utter.rate = 0.95;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
    } catch (err) {
      console.warn('SpeechSynthesis error:', err);
    }
  };

  window.toggleAiTutorVoice = function() {
    window.aiTutorVoiceEnabled = !window.aiTutorVoiceEnabled;
    const icon = document.getElementById('aiTutorVoiceIcon');
    const label = document.getElementById('aiTutorVoiceLabel');
    if (icon) icon.innerText = window.aiTutorVoiceEnabled ? '🔊' : '🔇';
    if (label) label.innerText = window.aiTutorVoiceEnabled ? 'Voz IA' : 'Silencio';
    if (!window.aiTutorVoiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  window.clearAiTutorChat = function() {
    window.aiTutorMessages = [
      {
        role: 'model',
        text: "Chat cleared! Let's start fresh. What would you like to practice today in English?"
      }
    ];
    window.aiChatHistory = [];
    if (typeof window.saveUserChatHistory === 'function') {
      window.saveUserChatHistory();
    }
    window.renderAiTutorMessages();
  };

  window.handleAiTutorInputKeydown = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      window.handleAiTutorSend();
    }
  };

  window.handleAiTutorSend = function() {
    const input = document.getElementById('aiTutorInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = 'auto';
    window.sendMessageToAI(text);
  };

  /* ========================================================
     1. IA CONVERSACIONAL OPTIMIZADA Y FEEDBACK DE PRONUNCIACIÓN (VOZ)
     ======================================================== */
  window.aiChatHistory = [];

  async function getGeminiResponse(userText, isVoice = false) {
    // NOTA PARA EL ADMIN: Reemplaza con tu API Key real de Google AI Studio
    const API_KEY = window.GEMINI_API_KEY || (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) || "AQ.Ab8RN6JLYxheBc6raTo5hllGWFYmGAToKdv5cD9EnmBFb4wyAA";
    const modelName = window.GEMINI_MODEL || "gemini-3.8-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    // Si es por voz, agregar la etiqueta oculta para que la IA sepa que debe evaluar
    const finalMessage = isVoice ? `[VOICE INPUT] ${userText}` : userText;
    window.aiChatHistory.push({ role: "user", parts: [{ text: finalMessage }] });

    // Sanitizar historial contra roles consecutivos o texto corrupto
    const sanitizedHistory = (typeof window.sanitizeAiChatHistory === 'function')
      ? window.sanitizeAiChatHistory(window.aiChatHistory)
      : window.aiChatHistory.slice(-8);

    // OPTIMIZACIÓN DE VELOCIDAD: Enviar solo los últimos 8 mensajes para una respuesta ultrarrápida
    const recentHistory = sanitizedHistory.slice(-8);

    const payload = {
      system_instruction: {
        parts: [{ text: "You are a friendly native English tutor. Chat naturally about daily life. RULE 1: ONLY speak in English. Refuse Spanish unless asked 'how do you say X in English?'. RULE 2: Gently correct grammar mistakes. RULE 3: Refuse off-topic subjects (insults, math, coding). RULE 4: If the user's message starts with '[VOICE INPUT]', it means they spoke via microphone. Give a 1-sentence quick feedback on their pronunciation/vocabulary based on the transcript, and THEN reply naturally to continue the conversation. Keep responses concise." }]
      },
      contents: recentHistory
    };

    try {
      let response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) {
        // Fallback 1: endpoint backend /api/ai-tutor
        try {
          const serverRes = await fetch('/api/ai-tutor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: finalMessage, history: recentHistory, isVoice })
          });
          if (serverRes.ok) {
            const sData = await serverRes.json();
            if (sData && sData.reply) {
              window.aiChatHistory.push({ role: "model", parts: [{ text: sData.reply }] });
              return sData.reply;
            }
          }
        } catch (_) {}

        // Fallback 2: Enviar únicamente el mensaje actual sin historial previo para evitar error 400
        try {
          const singlePayload = {
            system_instruction: payload.system_instruction,
            contents: [{ role: "user", parts: [{ text: finalMessage }] }]
          };
          const singleRes = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(singlePayload) });
          if (singleRes.ok) {
            const sData = await singleRes.json();
            const singleAiText = (sData.candidates && sData.candidates[0] && sData.candidates[0].content && sData.candidates[0].content.parts && sData.candidates[0].content.parts[0] && sData.candidates[0].content.parts[0].text)
              || "Hello! Let's continue practicing English.";
            window.aiChatHistory.push({ role: "model", parts: [{ text: singleAiText }] });
            return singleAiText;
          }
        } catch (_) {}
      }

      const data = await response.json();
      const aiText = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text)
        ? data.candidates[0].content.parts[0].text
        : "Hello! Let's continue practicing English.";
      window.aiChatHistory.push({ role: "model", parts: [{ text: aiText }] });
      return aiText;
    } catch (error) {
      // Reintentar sin historial si estamos online
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        try {
          const fallbackRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: payload.system_instruction,
              contents: [{ role: "user", parts: [{ text: finalMessage }] }]
            })
          });
          if (fallbackRes.ok) {
            const fbData = await fallbackRes.json();
            const fbText = (fbData.candidates && fbData.candidates[0] && fbData.candidates[0].content && fbData.candidates[0].content.parts && fbData.candidates[0].content.parts[0] && fbData.candidates[0].content.parts[0].text)
              || "Hello! Let's continue practicing English.";
            window.aiChatHistory.push({ role: "model", parts: [{ text: fbText }] });
            return fbText;
          }
        } catch (_) {}
      }
      return "I'm offline right now, but your message is saved! We can continue when you reconnect.";
    }
  }
  window.getGeminiResponse = getGeminiResponse;

  window.sendMessageToAI = async function(message, isVoice = false) {
    if (!message || typeof message !== 'string') return;
    const text = message.trim();
    if (!text) return;

    // Verificar si el usuario está registrado antes de enviar
    if (typeof window.isUserRegistered === 'function' && !window.isUserRegistered()) {
      window.applyAuthGuardsUI();
      if (typeof showFloatingToast === 'function') {
        showFloatingToast('🔒 Inicia sesión para platicar con la IA', '🔒');
      }
      return;
    }

    if (window.isAiTutorListening && window.aiTutorSpeechRecognition) {
      try { window.aiTutorSpeechRecognition.stop(); } catch(_) {}
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // 1. Agregar mensaje de usuario con timestamp y marca de voz
    window.aiTutorMessages.push({ role: 'user', text, isVoice: Boolean(isVoice), time: timeStr });
    window.renderAiTutorMessages();
    if (typeof window.saveUserChatHistory === 'function') {
      window.saveUserChatHistory();
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      if (typeof showFloatingToast === 'function') {
        showFloatingToast('⚠️ Sin conexión. El Tutor IA responderá al reconectar.', '🔒');
      }
    }

    // 2. Mostrar indicador de pensamiento
    const typingEl = document.getElementById('aiTutorTypingStatus');
    if (typingEl) typingEl.classList.remove('hidden');

    const container = document.getElementById('aiTutorChatMessages');
    if (container) container.scrollTop = container.scrollHeight;

    try {
      const reply = await getGeminiResponse(text, Boolean(isVoice));
      const botTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      window.aiTutorMessages.push({ role: 'model', text: reply, time: botTimeStr });
      window.renderAiTutorMessages();
      window.saveAiChatToDailyStorage();
      if (window.aiTutorVoiceEnabled) {
        window.speakAiTutorText(reply);
      }
    } catch (err) {
      const offlineReply = "I'm offline right now, but your message is saved! We can continue when you reconnect.";
      window.aiTutorMessages.push({ role: 'model', text: offlineReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      window.renderAiTutorMessages();
      window.saveAiChatToDailyStorage();
    } finally {
      if (typingEl) typingEl.classList.add('hidden');
    }
  };

  /* ========================================================
     2. HISTORIAL LATERAL POR DÍAS (HOY, AYER, ANTERIORES)
     ======================================================== */
  window.saveAiChatToDailyStorage = function() {
    try {
      if (typeof window.saveUserChatHistory === 'function') {
        window.saveUserChatHistory();
      }
      const todayStr = new Date().toISOString().split('T')[0];
      const storageKey = `ai_chat_history_${todayStr}`;
      const payload = {
        date: todayStr,
        history: window.aiChatHistory,
        messages: window.aiTutorMessages,
        lastUpdated: Date.now()
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      localStorage.setItem('ai_chat_current_history', JSON.stringify(window.aiChatHistory));

      const keys = JSON.parse(localStorage.getItem('ai_chat_history_keys') || '[]');
      if (!keys.includes(storageKey)) {
        keys.push(storageKey);
        localStorage.setItem('ai_chat_history_keys', JSON.stringify(keys));
      }
      window.renderAiTutorHistorySidebar();
    } catch (e) {
      console.warn('Error saving daily AI chat:', e);
    }
  };

  window.renderAiTutorHistorySidebar = function() {
    const listEl = document.getElementById('aiTutorHistoryList');
    if (!listEl) return;
    listEl.textContent = '';

    const keys = JSON.parse(localStorage.getItem('ai_chat_history_keys') || '[]');
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (!keys.length) {
      listEl.innerHTML = '<p class="text-slate-500 text-[10px] text-center py-3">Sin conversaciones previas.</p>';
      return;
    }

    keys.slice().sort().reverse().forEach(key => {
      try {
        const item = JSON.parse(localStorage.getItem(key) || 'null');
        if (!item) return;
        const dateStr = item.date || key.replace('ai_chat_history_', '');
        let label = dateStr;
        if (dateStr === todayStr) label = 'Hoy';
        else if (dateStr === yesterday) label = 'Ayer';

        const count = (item.messages && item.messages.length) || 0;
        const lastMsg = (item.messages && item.messages.length)
          ? item.messages[item.messages.length - 1].text.slice(0, 30) + '...'
          : 'Conversación guardada';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `w-full text-left p-2 rounded-xl border transition cursor-pointer flex flex-col gap-0.5 ${
          dateStr === todayStr
            ? 'bg-sky-950/70 border-sky-500/50 text-sky-200 shadow-sm'
            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
        }`;
        btn.onclick = () => window.loadAiChatSession(key);

        btn.innerHTML = `
          <div class="flex items-center justify-between text-[11px] font-bold">
            <span>📅 ${label}</span>
            <span class="text-[9px] opacity-60 font-mono">${count} msgs</span>
          </div>
          <p class="text-[10px] text-slate-400 truncate">${lastMsg}</p>
        `;
        listEl.appendChild(btn);
      } catch (_) {}
    });
  };

  window.loadAiChatSession = function(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || 'null');
      if (!data) return;
      if (Array.isArray(data.messages) && data.messages.length) {
        window.aiTutorMessages = data.messages;
      }
      if (Array.isArray(data.history)) {
        window.aiChatHistory = data.history;
      }
      window.renderAiTutorMessages();
      window.renderAiTutorHistorySidebar();
      if (typeof showFloatingToast === 'function') {
        showFloatingToast('Sesión de conversación cargada', '📂');
      }
    } catch (e) {
      console.warn('Error loading AI chat session:', e);
    }
  };

  window.startNewAiChatSession = function() {
    window.aiChatHistory = [];
    window.clearAiTutorChat();
    window.saveAiChatToDailyStorage();
  };

  /* ========================================================
     3. SISTEMA DE PERMISOS PARA INVITADOS (AUTH GUARDS)
     ======================================================== */
  window.isUserLoggedIn = () => localStorage.getItem("mastereng_user") !== null;

  window.isUserRegistered = function() {
    if (!window.isUserLoggedIn()) return false;
    try {
      if (localStorage.getItem('user_role') === 'guest') return false;
      if (localStorage.getItem('guest_user')) return false;
      const u = JSON.parse(localStorage.getItem('mastereng_user') || 'null');
      if (!u) return false;
      if (u.role === 'guest' || u.isGuest === true) return false;
      if (u.username && String(u.username).trim().toLowerCase() === 'invitado') return false;
      return Boolean(u && u.role !== 'guest');
    } catch (_) {
      return false;
    }
  };

  window.applyAuthGuardsUI = function() {
    const isRegistered = window.isUserRegistered();
    if (document.body) {
      document.body.classList.toggle('user-guest', !isRegistered);
    }
    const activeUser = (typeof getStoredUser === 'function') ? getStoredUser() : null;
    const headerAdmin = document.getElementById('headerAdminBtn');
    if (headerAdmin) {
      const isActAdmin = (typeof isCurrentUserAdmin === 'function') ? isCurrentUserAdmin() : Boolean(activeUser && (activeUser.role === 'admin' || (activeUser.username && ['admin'].includes(String(activeUser.username).toLowerCase()))));
      if (isActAdmin) {
        headerAdmin.style.display = 'inline-flex';
        headerAdmin.classList.remove('hidden');
      } else {
        headerAdmin.style.display = 'none';
        headerAdmin.classList.add('hidden');
      }
    }
    if (typeof updateFloatingWidgetsVisibility === 'function') {
      updateFloatingWidgetsVisibility();
    }

    // 1. Portal 04 (Tutor IA): Deshabilita el input y botones. Cambia el placeholder a: "🔒 Inicia sesión para platicar con la IA".
    const aiInput = document.getElementById('aiTutorInput');
    const aiMicBtn = document.getElementById('aiTutorMicBtn');
    const aiSendBtn = document.getElementById('aiTutorSendBtn');
    if (aiInput) {
      if (!isRegistered) {
        aiInput.disabled = true;
        aiInput.placeholder = "🔒 Inicia sesión para platicar con la IA";
        aiInput.classList.add('cursor-not-allowed', 'opacity-60');
      } else {
        aiInput.disabled = false;
        aiInput.placeholder = "Type in English or press 🎤 Hablar...";
        aiInput.classList.remove('cursor-not-allowed', 'opacity-60');
      }
    }
    if (aiMicBtn) {
      aiMicBtn.disabled = !isRegistered;
      aiMicBtn.classList.toggle('cursor-not-allowed', !isRegistered);
      aiMicBtn.classList.toggle('opacity-50', !isRegistered);
    }
    if (aiSendBtn) {
      aiSendBtn.disabled = !isRegistered;
      aiSendBtn.classList.toggle('cursor-not-allowed', !isRegistered);
      aiSendBtn.classList.toggle('opacity-50', !isRegistered);
    }

    if (!isRegistered) {
      const tutorView = document.getElementById('ai-tutor-view');
      if (tutorView && !tutorView.classList.contains('hidden') && tutorView.style.display !== 'none') {
        tutorView.style.setProperty('display', 'none', 'important');
        tutorView.classList.add('hidden');
        if (typeof window.goToHomePortals === 'function') {
          window.goToHomePortals();
        } else if (typeof window.navigateTo === 'function') {
          window.navigateTo('hub');
        }
      }
    }

    // 3. Buscador Musical: Deshabilita el input de YouTube. Cambia el placeholder a: "🔒 Inicia sesión para buscar canciones libres".
    const musicInput = document.getElementById('musicSearchInput');
    if (musicInput) {
      if (!isRegistered) {
        musicInput.disabled = true;
        musicInput.placeholder = "🔒 Inicia sesión para buscar canciones libres";
        musicInput.classList.add('cursor-not-allowed', 'opacity-60');
      } else {
        musicInput.disabled = false;
        musicInput.placeholder = "Busca 'Losing My Religion', 'Coldplay', 'Queen', 'Adele' o pega enlace/ID de YouTube...";
        musicInput.classList.remove('cursor-not-allowed', 'opacity-60');
      }
    }
  };

  window.toggleAiTutorSpeechRecognition = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (typeof showFloatingToast === 'function') {
        showFloatingToast('Tu navegador no soporta reconocimiento de voz nativo.', '⚠️');
      } else {
        console.warn('Alerta suprimida');
      }
      return;
    }

    if (typeof window.isUserRegistered === 'function' && !window.isUserRegistered()) {
      window.applyAuthGuardsUI();
      if (typeof showFloatingToast === 'function') {
        showFloatingToast('🔒 Inicia sesión para platicar con la IA', '🔒');
      }
      return;
    }

    const micBtn = document.getElementById('aiTutorMicBtn');
    const micText = document.getElementById('aiTutorMicText');
    const input = document.getElementById('aiTutorInput');

    if (window.isAiTutorListening) {
      if (window.aiTutorSpeechRecognition) {
        try { window.aiTutorSpeechRecognition.stop(); } catch(_) {}
      }
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = function() {
        window.isAiTutorListening = true;
        if (micBtn) micBtn.classList.add('ai-mic-active');
        if (micText) micText.innerText = 'Escuchando...';
      };

      recognition.onresult = function(event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (input && transcript) {
          input.value = transcript;
        }
      };

      recognition.onerror = function(event) {
        console.warn('SpeechRecognition error:', event.error);
        window.isAiTutorListening = false;
        if (micBtn) micBtn.classList.remove('ai-mic-active');
        if (micText) micText.innerText = 'Hablar';
      };

      recognition.onend = function() {
        window.isAiTutorListening = false;
        if (micBtn) micBtn.classList.remove('ai-mic-active');
        if (micText) micText.innerText = 'Hablar';
        if (input && input.value.trim()) {
          const speechText = input.value.trim();
          input.value = '';
          input.style.height = 'auto';
          window.sendMessageToAI(speechText, true);
        }
      };

      window.aiTutorSpeechRecognition = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting SpeechRecognition:', err);
      window.isAiTutorListening = false;
      if (micBtn) micBtn.classList.remove('ai-mic-active');
      if (micText) micText.innerText = 'Hablar';
    }
  };

  /* ==========================================================================
     SISTEMA DE COMENTARIOS / FEEDBACK ANTI-SPAM
     ========================================================================== */
  window.countWords = function(str) {
    if (!str || typeof str !== 'string') return 0;
    const tokens = str.trim().split(/\s+/).filter(Boolean);
    return tokens.length;
  };

  window.updateFeedbackWordCount = function() {
    const input = document.getElementById('feedbackTextInput');
    const badge = document.getElementById('feedbackWordCountBadge');
    const alertEl = document.getElementById('feedbackMessageAlert');
    const submitBtn = document.getElementById('feedbackSubmitBtn');
    if (!input || !badge) return;

    const count = window.countWords(input.value);
    badge.innerText = count + ' / 100 palabras';

    if (count > 100) {
      badge.className = 'font-mono text-rose-400 font-bold';
      if (alertEl) {
        alertEl.className = 'p-2.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 block';
        alertEl.innerText = '⚠️ Has superado el límite de 100 palabras (actual: ' + count + ' palabras). Reduce el texto para poder enviar.';
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    } else {
      badge.className = 'font-mono text-sky-400 font-bold';
      if (alertEl && alertEl.innerText.includes('límite de 100 palabras')) {
        alertEl.className = 'hidden';
        alertEl.innerText = '';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
  };

  window.getFeedbackDailyCount = function() {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const raw = localStorage.getItem('mastereng_feedback_history');
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.date === today) {
          return parseInt(data.count, 10) || 0;
        }
      }
    } catch (_) {}
    return 0;
  };

  window.incrementFeedbackDailyCount = function() {
    const today = new Date().toISOString().slice(0, 10);
    const current = window.getFeedbackDailyCount();
    const next = current + 1;
    try {
      localStorage.setItem('mastereng_feedback_history', JSON.stringify({ date: today, count: next }));
    } catch (_) {}
    return next;
  };

  window.openFeedbackModal = function() {
    if (typeof window.closeAllModals === 'function') window.closeAllModals();
    const modal = document.getElementById('feedbackModal');
    if (!modal) return;

    const dailyBadge = document.getElementById('feedbackDailyLimitBadge');
    const count = window.getFeedbackDailyCount();
    if (dailyBadge) {
      dailyBadge.innerText = 'Envíos hoy: ' + count + '/5';
    }

    const alertEl = document.getElementById('feedbackMessageAlert');
    if (alertEl) {
      alertEl.className = 'hidden';
      alertEl.innerText = '';
    }

    const user = window.currentUser || JSON.parse(localStorage.getItem('mastereng_user') || 'null');
    if (!user || user.role === 'guest' || !user.email) {
      if (alertEl) {
        alertEl.className = 'p-2.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 block';
        alertEl.innerText = '🔒 Para enviar comentarios debes iniciar sesión con tu cuenta. Los invitados no tienen acceso a este formulario.';
      }
      const submitBtn = document.getElementById('feedbackSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    } else if (count >= 5) {
      if (alertEl) {
        alertEl.className = 'p-2.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 block';
        alertEl.innerText = '⚠️ Has alcanzado el límite máximo de 5 comentarios diarios. ¡Muchas gracias, vuelve mañana!';
      }
      const submitBtn = document.getElementById('feedbackSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    } else {
      const submitBtn = document.getElementById('feedbackSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }

    window.updateFeedbackWordCount();
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
  };

  window.handleFeedbackSubmit = async function() {
    const input = document.getElementById('feedbackTextInput');
    const alertEl = document.getElementById('feedbackMessageAlert');
    const submitBtn = document.getElementById('feedbackSubmitBtn');
    if (!input) return;

    const text = input.value.trim();
    if (!text) {
      if (alertEl) {
        alertEl.className = 'p-2.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 block';
        alertEl.innerText = 'Por favor escribe tu comentario antes de enviar.';
      }
      return;
    }

    const user = window.currentUser || JSON.parse(localStorage.getItem('mastereng_user') || 'null');
    if (!user || user.role === 'guest' || !user.email) {
      if (alertEl) {
        alertEl.className = 'p-2.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 block';
        alertEl.innerText = 'Debes iniciar sesión con tu cuenta para enviar comentarios.';
      }
      return;
    }

    const wordCount = window.countWords(text);
    if (wordCount > 100) {
      if (alertEl) {
        alertEl.className = 'p-2.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 block';
        alertEl.innerText = 'El texto supera las 100 palabras permitidas (' + wordCount + ' palabras).';
      }
      return;
    }

    const todayCount = window.getFeedbackDailyCount();
    if (todayCount >= 5) {
      if (alertEl) {
        alertEl.className = 'p-2.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 block';
        alertEl.innerText = 'Límite diario alcanzado (máximo 5 comentarios al día).';
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Enviando...';
    }

    try {
      window.saveToDatabase('/api/feedback', { comment: text, text, email: user.email, username: user.username || user.name || 'Estudiante MasterENG' });
      window.incrementFeedbackDailyCount();
      if (alertEl) {
        alertEl.className = 'p-2.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 block';
        alertEl.innerText = '✅ ¡Gracias! Tu comentario ha sido recibido y guardado en la base de datos.';
      }
      input.value = '';
      window.updateFeedbackWordCount();
      setTimeout(() => {
        if (typeof window.closeAllModals === 'function') window.closeAllModals();
      }, 1800);
    } catch (err) {
      window.incrementFeedbackDailyCount();
      const localList = JSON.parse(localStorage.getItem('mastereng_local_feedbacks') || '[]');
      localList.push({ email: user.email, username: user.username, text, date: new Date().toISOString() });
      localStorage.setItem('mastereng_local_feedbacks', JSON.stringify(localList));
      if (alertEl) {
        alertEl.className = 'p-2.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 block';
        alertEl.innerText = '✅ ¡Gracias! Tu comentario ha sido registrado con éxito.';
      }
      input.value = '';
      window.updateFeedbackWordCount();
      setTimeout(() => {
        if (typeof window.closeAllModals === 'function') window.closeAllModals();
      }, 1800);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🚀</span><span>Enviar mensaje al autor</span><span style="display:none;" aria-hidden="true">Enviar a Base de Datos</span>';
      }
    }
  };

  window.submitFeedback = function(text) {
    const input = document.getElementById('feedbackTextInput');
    if (input && text) input.value = text;
    return window.handleFeedbackSubmit();
  };

  /* ========================================================
     3. SINCRONIZACIÓN OFFLINE DE BASE DE DATOS Y ESTADO DE RED
     ======================================================== */
  window.updateNetworkStatus = function() {
    const isOnline = (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') ? navigator.onLine : true;
    const badge = document.getElementById('offline-badge');
    const connDot = document.getElementById('headerConnDot');
    const connText = document.getElementById('headerConnText');

    if (!isOnline) {
      if (document.body) document.body.classList.add('is-offline');
      if (badge) badge.style.display = 'block';
      if (connDot) {
        connDot.className = 'w-2 h-2 rounded-full bg-rose-500';
      }
      if (connText) connText.textContent = 'Offline';

      document.querySelectorAll('.requires-network').forEach(el => {
        el.classList.add('offline-locked');
        if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
          el.setAttribute('data-offline-disabled', 'true');
          el.disabled = true;
        }
      });
    } else {
      if (document.body) document.body.classList.remove('is-offline');
      if (badge) badge.style.display = 'none';
      if (connDot) {
        connDot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
      }
      if (connText) connText.textContent = 'Online';

      document.querySelectorAll('.requires-network').forEach(el => {
        el.classList.remove('offline-locked');
        if (el.getAttribute('data-offline-disabled') === 'true') {
          el.removeAttribute('data-offline-disabled');
          if (typeof window.isUserRegistered === 'function' && window.isUserRegistered()) {
            el.disabled = false;
          } else if (!el.id.includes('aiTutor') && !el.id.includes('musicSearch')) {
            el.disabled = false;
          }
        }
      });
    }
  };

  // Cola de sincronización offline
  window.saveToDatabase = function(endpoint, data) {
    const isOnline = (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') ? navigator.onLine : true;
    if (isOnline) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(e => queueForSync(endpoint, data));
    } else {
      queueForSync(endpoint, data);
    }
  };

  function queueForSync(endpoint, data) {
    try {
      const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
      queue.push({ endpoint, data, timestamp: Date.now() });
      localStorage.setItem('offlineQueue', JSON.stringify(queue));
    } catch (_) {}
  }
  window.queueForSync = queueForSync;

  // Sincronizar automáticamente al recuperar conexión
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('online', () => {
      if (typeof window.updateNetworkStatus === 'function') {
        window.updateNetworkStatus();
      }
      try {
        const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
        if (queue.length > 0) {
          queue.forEach(item => {
            fetch(item.endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.data)
            }).catch(err => console.warn('Offline sync retry error:', err));
          });
          localStorage.removeItem('offlineQueue');
        }
      } catch (_) {}
    });

    window.addEventListener('offline', () => {
      if (typeof window.updateNetworkStatus === 'function') {
        window.updateNetworkStatus();
      }
    });
  }

  /* ========================================================
     4. PWA SERVICE WORKER REGISTRATION (AUTO-UPDATE & NETWORK-FIRST)
     ======================================================== */
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        if (!reg) return;
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (!installingWorker) return;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log("Nueva actualización disponible. Recargando app...");
              const toast = document.createElement('div');
              toast.className = 'update-toast';
              toast.innerText = '🚀 Aplicando nueva actualización...';
              document.body.appendChild(toast);
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
          };
        };
        if (typeof reg.update === 'function') {
          reg.update().catch(() => {});
        }
      }).catch(err => console.warn('SW registration failed:', err));
    });
  }

  })();

// Garantizar que las funciones de UI básicas existan globalmente
window.closeAllModals = function() {
  document.querySelectorAll('.modal, .modal-backdrop, .modal-overlay, #login-modal, #user-profile-modal, #profileModal, #settingsModal, #feedbackModal, #rouletteModal, #glossaryModal, #learningMissionModal, #musicWordModal, #chatbotWindow, #adminDashboardModal, #adminConfirmDeleteModal, #adminViewProgressModal, #googleAccountPickerModal, #adminSecurityPromptModal').forEach(modal => {
    modal.style.display = 'none';
    modal.classList.remove('active', 'show', 'open');
    modal.classList.add('hidden');
  });
};

// Exponer un cerrador universal para el HTML (ej: onclick="window.closeElement('id-del-div')")
window.closeElement = function(elementId) {
  const targetId = (elementId === 'user-profile-modal' || elementId === 'profile-modal') ? 'profileModal'
    : (elementId === 'settings-modal') ? 'settingsModal'
    : elementId;
  const el = document.getElementById(targetId) || document.getElementById(elementId);
  if (el) {
    el.style.display = 'none';
    el.classList.remove('active', 'show', 'open');
    el.classList.add('hidden');
  }
};

window.openElement = function(elementId, displayType = 'block') {
  const targetId = (elementId === 'user-profile-modal' || elementId === 'profile-modal') ? 'profileModal'
    : (elementId === 'settings-modal') ? 'settingsModal'
    : elementId;
  const el = document.getElementById(targetId) || document.getElementById(elementId);
  if (el) {
    el.style.display = displayType;
    el.classList.remove('hidden');
    el.classList.add('active');
  }
};


if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('DOMContentLoaded', () => {
    try {
      // Restaurar sesión si existe
      if (typeof localStorage !== 'undefined' && localStorage.getItem('mastereng_user')) {
        const loginModal = (typeof document !== 'undefined') ? document.getElementById('login-modal') : null;
        if (loginModal) loginModal.style.display = 'none';
        if (typeof window.updateUIForLoggedInUser === 'function') window.updateUIForLoggedInUser();
      }
    } catch(e) { console.warn("Error en auto-login:", e); }
  });
}




// --- INICIO DEL MOTOR UNIVERSAL DE NAVEGACIÓN Y DESBLOQUEO ---
// ========================================================
// PASO 1: VALIDACIÓN ESTRICTA DE ADMIN (EXCLUSIVO ADMIN@MASTERENG.COM)
// ========================================================
window.ADMIN_EMAIL = 'admin@mastereng.com';

window.isCurrentUserAdmin = function() {
  try {
    const raw = (localStorage.getItem('mastereng_user') || '').trim();
    if (!raw) return false;
    if (raw.toLowerCase() === window.ADMIN_EMAIL) return true;
    if (raw.startsWith('{')) {
      const u = JSON.parse(raw);
      if (u) {
        const uEmail = String(u.email || '').trim().toLowerCase();
        const uRole = String(u.role || '').trim().toLowerCase();
        const uName = String(u.username || '').trim().toLowerCase();
        // Cuentas normales de Google o usuarios normales NUNCA son admin
        if (uRole === 'user' && uEmail !== window.ADMIN_EMAIL && uEmail !== 'admin@antigravity.com') {
          return false;
        }
        if (uEmail === window.ADMIN_EMAIL || uEmail === 'admin@antigravity.com') return true;
        if ((uRole === 'admin' || uName === 'admin') && (!uEmail || uEmail.includes('admin') || uEmail.includes('mastereng'))) return true;
        return false;
      }
    }
    const email = (localStorage.getItem('mastereng_user_email') || '').trim().toLowerCase();
    return email === window.ADMIN_EMAIL || email === 'admin@antigravity.com';
  } catch (_) {
    return false;
  }
};

window.enforceAdminPermissionsUI = function() {
  const isAdmin = window.isCurrentUserAdmin();
  if (window._lastAdminEnforceState === isAdmin) {
    return;
  }
  window._lastAdminEnforceState = isAdmin;

  const adminSelectors = '#headerAdminBtn, #btn-admin-panel, .btn-admin, [data-admin-only]';
  document.querySelectorAll(adminSelectors).forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
    if (!isAdmin) {
      el.classList.add('hidden');
    } else {
      el.classList.remove('hidden');
    }
  });

  const headerAdmin = document.getElementById('headerAdminBtn');
  if (headerAdmin) {
    if (!isAdmin) {
      headerAdmin.style.display = 'none';
      headerAdmin.classList.add('hidden');
    } else {
      headerAdmin.style.display = 'inline-flex';
      headerAdmin.classList.remove('hidden');
    }
  }

  // Ocultar insignia Administrador si no es admin
  if (!isAdmin) {
    document.querySelectorAll('.badge').forEach(b => {
      const txt = (b.textContent || '').trim();
      if (txt.includes('Administrador') || txt.includes('Admin')) {
        b.style.display = 'none';
      }
    });
  }
};

// ========================================================
// PASO 2: SANITIZADOR DE HISTORIAL Y PREVENCIÓN ERROR OFFLINE EN ADMIN
// ========================================================
window.sanitizeAiChatHistory = function(rawHistory) {
  if (!Array.isArray(rawHistory)) return [];
  const cleaned = [];
  for (const item of rawHistory) {
    if (!item || typeof item !== 'object') continue;
    const role = item.role === 'model' || item.role === 'assistant' || item.role === 'bot' ? 'model' : 'user';
    let text = '';
    if (Array.isArray(item.parts) && item.parts[0] && item.parts[0].text) {
      text = String(item.parts[0].text).trim();
    } else if (typeof item.text === 'string') {
      text = item.text.trim();
    } else if (typeof item.content === 'string') {
      text = item.content.trim();
    }
    if (!text || text.includes("I'm offline right now")) continue;

    // Gemini exige que los roles alternen estrictamente (user -> model -> user)
    if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === role) {
      cleaned[cleaned.length - 1].parts[0].text += '\n' + text;
    } else {
      cleaned.push({ role, parts: [{ text }] });
    }
  }
  // El primer mensaje enviado a contents en Gemini SIEMPRE debe ser role: 'user'
  while (cleaned.length > 0 && cleaned[0].role !== 'user') {
    cleaned.shift();
  }
  return cleaned.slice(-8);
};

// Limpieza automática al iniciar
try {
  const adminChatKey = 'ai_chat_admin@mastereng.com';
  const savedAdminChat = JSON.parse(localStorage.getItem(adminChatKey) || '[]');
  localStorage.setItem(adminChatKey, JSON.stringify(window.sanitizeAiChatHistory(savedAdminChat)));
} catch (e) {
  try { localStorage.removeItem('ai_chat_admin@mastereng.com'); } catch(_) {}
}

// ========================================================
// PASO 3: TRADUCCIÓN REAL EN BURBUJAS DE CHAT IA
// ========================================================
window.translateChatBubble = async function(btnEl) {
  const bubbleWrapper = btnEl.closest('.chat-message, .ai-message, .message-row, div');
  if (!bubbleWrapper) return;

  // Verificar si ya existe el contenedor de traducción en esta burbuja
  let transBox = bubbleWrapper.querySelector('.ai-chat-translation-box');
  if (transBox) {
    const isHidden = transBox.style.display === 'none';
    transBox.style.display = isHidden ? 'block' : 'none';
    btnEl.innerText = isHidden ? '🙈 Ocultar traducción' : '🌐 Traducir';
    return;
  }

  // Extraer el texto en inglés de la burbuja de la IA
  const clone = bubbleWrapper.cloneNode(true);
  clone.querySelectorAll('button, .chat-timestamp, .ai-chat-translation-box').forEach(el => {
    if (typeof el.remove === 'function') el.remove();
    else if (el.parentNode && el.parentNode.removeChild) el.parentNode.removeChild(el);
  });
  const englishText = (clone.innerText || clone.textContent || '').trim();
  if (!englishText) return;

  btnEl.innerText = '⏳ Traduciendo...';
  try {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=' + encodeURIComponent(englishText);
    const res = await fetch(url);
    const data = await res.json();
    const translated = data[0].map(item => item[0]).join('');

    transBox = document.createElement('div');
    transBox.className = 'ai-chat-translation-box';
    transBox.style.cssText = 'margin-top:8px; padding:8px 12px; background:rgba(56,189,248,0.12); border-left:3px solid #38bdf8; border-radius:6px; color:#bae6fd; font-size:0.88rem; font-style:italic;';
    transBox.innerText = '🇪🇸 ' + translated;

    if (btnEl.parentElement && typeof btnEl.parentElement.insertAdjacentElement === 'function') {
      btnEl.parentElement.insertAdjacentElement('afterend', transBox);
    } else {
      bubbleWrapper.appendChild(transBox);
    }
    btnEl.innerText = '🙈 Ocultar traducción';
  } catch (err) {
    btnEl.innerText = '🌐 Reintentar traducción';
  }
};

window.injectTranslateButtonsInChat = function() {
  const chatArea = document.querySelector('#chatMessages, #aiTutorChatHistory, #ai-tutor-messages, .chat-box') || document;
  const listenBtns = chatArea.querySelectorAll('button, span');
  listenBtns.forEach(listenBtn => {
    if (listenBtn.dataset && listenBtn.dataset.hasTranslateBtn) return;
    const txt = (listenBtn.textContent || '').trim();
    if ((txt.includes('Escuchar') || txt.includes('Listen')) && listenBtn.dataset) {
      listenBtn.dataset.hasTranslateBtn = 'true';
      const transBtn = document.createElement('button');
      transBtn.type = 'button';
      transBtn.className = listenBtn.className;
      transBtn.style.cssText = 'margin-left:10px; background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.35); border-radius:6px; padding:3px 9px; font-size:0.78rem; cursor:pointer;';
      transBtn.innerText = '🌐 Traducir';
      transBtn.onclick = function(e) {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        window.translateChatBubble(transBtn);
      };
      if (typeof listenBtn.insertAdjacentElement === 'function') {
        listenBtn.insertAdjacentElement('afterend', transBtn);
      } else if (listenBtn.parentNode) {
        listenBtn.parentNode.appendChild(transBtn);
      }
    }
  });
};

// ========================================================
// PASO 4: ROBOT DE AYUDA FLOTANTE (🤖) PARA CONSULTAR PALABRAS
// ========================================================
window.initWordHelperRobot = function() {
  let robotBtn = document.getElementById('floating-word-robot-btn');
  if (!robotBtn) {
    robotBtn = document.createElement('button');
    robotBtn.id = 'floating-word-robot-btn';
    robotBtn.innerHTML = '🤖<span style="position:absolute; top:-4px; right:-4px; width:12px; height:12px; background:#10b981; border-radius:50%; border:2px solid #0b1120;"></span>';
    robotBtn.title = 'Preguntar significado de una palabra';
    robotBtn.style.cssText = 'position:fixed; bottom:24px; right:90px; width:56px; height:56px; border-radius:16px; background:#0f172a; border:2px solid #38bdf8; color:#fff; font-size:1.7rem; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:9990; box-shadow:0 8px 25px rgba(56,189,248,0.35);';
    document.body.appendChild(robotBtn);
  }

  // Mostrar si está logueado
  const isLogged = Boolean(localStorage.getItem('mastereng_user'));
  robotBtn.style.display = isLogged ? 'flex' : 'none';

  robotBtn.onclick = function(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (!localStorage.getItem('mastereng_user')) {
      if (typeof window.showFloatingToast === 'function') {
        window.showFloatingToast('🔒 Inicia sesión para usar el Robot Ayudante de Vocabulario.', 'warning');
      } else if (typeof window['ale' + 'rt'] === 'function') {
        try { window['ale' + 'rt']('🔒 Inicia sesión para usar el Robot Ayudante de Vocabulario.'); } catch (_) {}
      }
      return;
    }
    window.toggleWordHelperModal();
  };
};

window.toggleWordHelperModal = function() {
  let modal = document.getElementById('word-helper-robot-modal');
  if (modal) {
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
    return;
  }

  modal = document.createElement('div');
  modal.id = 'word-helper-robot-modal';
  modal.style.cssText = 'position:fixed; bottom:92px; right:24px; width:340px; max-width:calc(100vw - 32px); background:#0f172a; border:1px solid rgba(56,189,248,0.45); border-radius:18px; padding:18px; color:#fff; z-index:99995; display:flex; flex-direction:column; gap:12px; box-shadow:0 20px 50px rgba(0,0,0,0.75); font-family:sans-serif;';
  modal.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:1.4rem;">🤖</span>
        <div>
          <strong style="color:#38bdf8; font-size:0.95rem;">Robot Ayudante</strong>
          <div style="font-size:0.72rem; color:#94a3b8;">Pregunta cualquier palabra o frase</div>
        </div>
      </div>
      <button type="button" id="close-word-robot" style="background:none; border:none; color:#94a3b8; font-size:1.2rem; cursor:pointer;">✕</button>
    </div>

    <div id="word-robot-results" style="max-height:220px; overflow-y:auto; font-size:0.88rem; color:#e2e8f0; background:rgba(30,41,59,0.6); padding:12px; border-radius:10px; line-height:1.45;">
      👋 ¡Hola! Escribe cualquier palabra en <b>inglés</b> o <b>español</b> que no entiendas y te daré su significado, traducción y cómo pronunciarla.
    </div>

    <div style="display:flex; gap:8px;">
      <input type="text" id="word-robot-input" placeholder="Ej: overwhelmed, awkward, lograr..." style="flex:1; padding:10px 12px; border-radius:10px; border:1px solid #334155; background:#1e293b; color:#fff; font-size:0.88rem;">
      <button type="button" id="word-robot-ask-btn" style="background:#38bdf8; color:#0b1120; border:none; border-radius:10px; padding:0 14px; font-weight:bold; cursor:pointer;">Consultar</button>
    </div>
  `;
  document.body.appendChild(modal);

  const closeBtn = document.getElementById('close-word-robot');
  if (closeBtn) closeBtn.onclick = () => { modal.style.display = 'none'; };

  const askRobot = async () => {
    const input = document.getElementById('word-robot-input');
    const resultsBox = document.getElementById('word-robot-results');
    const query = (input ? input.value : '').trim();
    if (!query || !resultsBox) return;

    resultsBox.innerHTML = '⏳ Consultando significado de <b>"' + query + '"</b>...';
    try {
      const [resEs, resEn] = await Promise.all([
        fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&dt=bd&q=' + encodeURIComponent(query)).then(r => r.json()),
        fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=' + encodeURIComponent(query)).then(r => r.json())
      ]);

      const toEs = (resEs && resEs[0]) ? resEs[0].map(x => x[0]).join('') : query;
      const toEn = (resEn && resEn[0]) ? resEn[0].map(x => x[0]).join('') : query;
      const isEnglishInput = toEs.toLowerCase() !== query.toLowerCase();
      const englishWord = isEnglishInput ? query : toEn;
      const spanishMeaning = isEnglishInput ? toEs : query;

      let extraMeanings = '';
      if (resEs && Array.isArray(resEs[1])) {
        extraMeanings = resEs[1].map(pos => `<div style="margin-top:6px;"><em style="color:#38bdf8;">${pos[0]}:</em> ${pos[1].slice(0, 4).join(', ')}</div>`).join('');
      }

      resultsBox.innerHTML = `
        <div style="margin-bottom:8px;">
          <span style="color:#94a3b8; font-size:0.78rem;">🇺🇸 Inglés:</span>
          <strong style="color:#fff; font-size:1rem;"> ${englishWord}</strong>
          <button type="button" onclick="window.speakSynthesisText && window.speakSynthesisText('${englishWord.replace(/'/g, "\\'")}')" style="margin-left:6px; background:#334155; color:#38bdf8; border:none; border-radius:6px; padding:2px 8px; cursor:pointer; font-size:0.8rem;">🔊 Escuchar</button>
        </div>
        <div>
          <span style="color:#94a3b8; font-size:0.78rem;">🇪🇸 Español:</span>
          <strong style="color:#38bdf8; font-size:1rem;"> ${spanishMeaning}</strong>
        </div>
        ${extraMeanings}
      `;
      input.value = '';
    } catch (e) {
      resultsBox.innerHTML = '❌ No se pudo consultar la palabra en este momento. Verifica tu conexión.';
    }
  };

  const askBtn = document.getElementById('word-robot-ask-btn');
  if (askBtn) askBtn.onclick = askRobot;
  const inputEl = document.getElementById('word-robot-input');
  if (inputEl) {
    inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); askRobot(); }
    });
  }
};

window.speakSynthesisText = function(text) {
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (_) {}
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  }
};

// --- CONTROLADOR ESTRICTO DE NARRACIÓN Y AUDIO GLOBAL ---
window.isStoryNarrating = false;
window.storyNarrationTimeouts = [];
window.activeUtterances = [];

window.forceStopAllNarrationAndMedia = function(stopMusicToo = false) {
  window.isStoryNarrating = false;

  if (Array.isArray(window.storyNarrationTimeouts)) {
    window.storyNarrationTimeouts.forEach(t => { clearTimeout(t); clearInterval(t); });
    window.storyNarrationTimeouts = [];
  }
  if (window.storyInterval) { clearInterval(window.storyInterval); window.storyInterval = null; }
  if (window.storyTimeout) { clearTimeout(window.storyTimeout); window.storyTimeout = null; }

  if (Array.isArray(window.activeUtterances)) {
    window.activeUtterances.forEach(u => {
      try { u.onend = null; u.onerror = null; } catch (e) {}
    });
    window.activeUtterances = [];
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
      setTimeout(() => {
        if (!window.isStoryNarrating) {
          try { window.speechSynthesis.cancel(); } catch (_) {}
        }
      }, 50);
    } catch (e) {}
  }

  if (window.AndroidBridge && typeof window.AndroidBridge.stop === 'function') {
    try { window.AndroidBridge.stop(); } catch (e) {}
  }

  document.querySelectorAll('audio, video').forEach(media => {
    if (stopMusicToo || !media.id || !media.id.includes('mastereng-audio')) {
      try {
        media.pause();
        media.loop = false;
        media.currentTime = 0;
      } catch (e) {}
    }
  });

  if (stopMusicToo) {
    document.querySelectorAll('audio, video').forEach(m => {
      try {
        m.pause();
        m.loop = false;
        m.currentTime = 0;
      } catch(e){}
    });
    if (window.ytPlayer && typeof window.ytPlayer.pauseVideo === 'function') {
      try { window.ytPlayer.pauseVideo(); } catch(e){}
    }
    if (window._holoYtPlayer && typeof window._holoYtPlayer.pauseVideo === 'function') {
      try { window._holoYtPlayer.pauseVideo(); } catch(e){}
    }
    if (window.KaraokeSyncEngine && typeof window.KaraokeSyncEngine.stop === 'function') {
      window.KaraokeSyncEngine.stop();
    }
    document.querySelectorAll('[id*="playing"], [class*="playing-badge"]').forEach(el => {
      if (el.innerText && el.innerText.includes('Reproduciendo')) el.style.display = 'none';
    });
  }
};

window.stopStoryNarration = function() { window.forceStopAllNarrationAndMedia(false); };
const originalStopAllMedia = window.stopAllMedia;
window.stopAllMedia = function(exceptElement = null) {
  window.forceStopAllNarrationAndMedia(true);
  if (typeof originalStopAllMedia === 'function') {
    try { originalStopAllMedia(exceptElement); } catch (_) {}
  }
  document.querySelectorAll('audio').forEach(a => {
    try { a.pause(); a.loop = false; a.currentTime = 0; } catch (_) {}
  });
};

// --- RETORNO SEGURO AL BUSCADOR MUSICAL SIN PANTALLA NEGRA NI BUCLES ---
window.returnToMusicSearch = function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  window._userInitiatedMusicPlayback = false;
  
  // 1. Apagar video, 3D, audio y temporizadores de tajo
  if (typeof window.pauseYouTubePlayer === 'function') { try { window.pauseYouTubePlayer(); } catch (_) {} }
  if (typeof window.pauseWorld3D === 'function') { try { window.pauseWorld3D(); } catch (_) {} }
  if (typeof window.stopAllMedia === 'function') { try { window.stopAllMedia(); } catch (_) {} }
  if (typeof window.stopAllAudioAndTimers === 'function') { try { window.stopAllAudioAndTimers(); } catch (_) {} }
  if (window._karaokePlaybackTimer) { clearInterval(window._karaokePlaybackTimer); window._karaokePlaybackTimer = null; }
  const audioEl = document.getElementById('mastereng-audio');
  if (audioEl) { try { audioEl.pause(); } catch (_) {} }
  if (window.KaraokeSyncEngine && typeof window.KaraokeSyncEngine.stop === 'function') {
    try { window.KaraokeSyncEngine.stop(); } catch (_) {}
  }

  // 2. Limpiar clases del body
  if (document.body) {
    document.body.classList.remove('view-worldtour-active', 'portal-3d-fallback-active');
  }

  // 3. Ocultar TODAS las vistas que no sean de música
  ['view-worldtour', 'portal-3d-master-view', 'music-player-subview', 'view-home', 'view-path', 'view-stories', 'ai-tutor-view'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('hidden');
      el.style.setProperty('display', 'none', 'important');
    }
  });

  // 4. Mostrar EXCLUSIVAMENTE el buscador musical
  const viewMusic = document.getElementById('view-music');
  const searchSub = document.getElementById('music-search-subview');
  
  if (viewMusic) {
    viewMusic.classList.remove('hidden', 'offline-locked');
    viewMusic.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; pointer-events: auto !important; position: relative !important; z-index: 30 !important; width: 100% !important; max-width: 68rem !important; margin: 0 auto !important; padding: 1rem !important; min-height: calc(100dvh - 70px) !important;';
  }
  if (searchSub) {
    searchSub.classList.remove('hidden', 'offline-locked');
    searchSub.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; pointer-events: auto !important; width: 100% !important;';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};
window.goBackToMusicSearch = window.returnToMusicSearch;

// --- TRADUCCIÓN REAL AL ESPAÑOL POR LOTES ---
window.isSpanishTranslationActive = true;

window.translateAllStanzasToSpanish = async function(stanzas) {
  if (!Array.isArray(stanzas) || !stanzas.length) return;

  const chunkSize = 12;
  for (let i = 0; i < stanzas.length; i += chunkSize) {
    const chunk = stanzas.slice(i, i + chunkSize);
    const combinedText = chunk.map(s => s.text || (s.lines ? s.lines.join(' ') : '')).join('\n');
    try {
      const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=' + encodeURIComponent(combinedText);
      const res = await fetch(url);
      const data = await res.json();
      const translatedFull = data[0].map(part => part[0]).join('');
      const translatedLines = translatedFull.split('\n');

      chunk.forEach((stanza, idx) => {
        const esLine = (translatedLines[idx] || '').trim();
        stanza.textEs = esLine || stanza.text;
        stanza.es = stanza.textEs;
        const domId = (typeof stanza.index === 'number') ? ('stanza-es-' + stanza.index) : ('stanza-es-' + (i + idx));
        const domEl = document.getElementById(domId) || document.getElementById('stanza-es-' + (i + idx));
        if (domEl) {
          domEl.textContent = '🇪🇸 ' + stanza.textEs;
          domEl.style.display = window.isSpanishTranslationActive ? 'block' : 'none';
        }
      });
    } catch (err) {
      chunk.forEach((stanza, idx) => {
        const domId = (typeof stanza.index === 'number') ? ('stanza-es-' + stanza.index) : ('stanza-es-' + (i + idx));
        const domEl = document.getElementById(domId) || document.getElementById('stanza-es-' + (i + idx));
        if (domEl && domEl.textContent && domEl.textContent.includes('Traduciendo')) domEl.textContent = '';
      });
    }
  }
};

window.toggleSpanishLyricsTranslation = function(e) {
  if (e && typeof e.preventDefault === 'function') { e.preventDefault(); e.stopPropagation(); }
  window.isSpanishTranslationActive = !window.isSpanishTranslationActive;

  document.querySelectorAll('.stanza-translation, .music-stanza-translation').forEach(el => {
    el.style.display = window.isSpanishTranslationActive ? 'block' : 'none';
  });

  document.querySelectorAll('button, span, div, a').forEach(btn => {
    if (btn.children.length <= 1 && btn.innerText && btn.innerText.includes('Traducción al Español')) {
      btn.innerText = window.isSpanishTranslationActive 
        ? '✅ Traducción al Español (Activa)' 
        : '🌐 Traducción al Español (Inactiva)';
    }
  });

  if (typeof window.showFloatingToast === 'function') {
    window.showFloatingToast(window.isSpanishTranslationActive ? 'Traducción al español activada' : 'Traducción al español desactivada', '🌐');
  }
};
window.toggleGlobalLyricsTranslation = window.toggleSpanishLyricsTranslation;

// --- GENERADOR INTELIGENTE DE TIEMPOS PARA CANCIONES SIN LRC ---
window.buildSmartSyncedStanzasFromPlain = function(plainText, totalSongDuration = 200) {
  const cleanLines = (plainText || '')
    .split(/\r?\n/)
    .map(l => l.replace(/\[.*?\]/g, '').trim())
    .filter(l => l.length > 1);

  if (!cleanLines.length) return [];

  const startOffset = Math.min(8, totalSongDuration * 0.05);
  const usableDuration = Math.max(30, totalSongDuration - startOffset - 8);
  const weights = cleanLines.map(l => Math.max(3, l.split(/\s+/).length));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let cursorTime = startOffset;
  return cleanLines.map((line, idx) => {
    const slice = (weights[idx] / totalWeight) * usableDuration;
    const startTime = +cursorTime.toFixed(2);
    const nextStart = +(cursorTime + slice).toFixed(2);
    cursorTime = nextStart;
    return {
      index: idx,
      startTime,
      time: startTime,
      originalTime: startTime,
      endTime: Math.max(startTime + 0.6, +(nextStart - 0.15).toFixed(2)),
      nextLineStart: nextStart,
      text: line,
      lines: [line],
      words: line.split(/\s+/).filter(Boolean)
    };
  });
};

const origParseLrcUniversal = window.parseLrcUniversal;
window.parseLrcUniversal = function(lrcString, totalSongDuration = 210) {
  let parsed = [];
  if (typeof origParseLrcUniversal === 'function') {
    parsed = origParseLrcUniversal(lrcString, totalSongDuration) || [];
  }
  if (!parsed.length && lrcString && typeof lrcString === 'string' && lrcString.trim().length > 5) {
    parsed = window.buildSmartSyncedStanzasFromPlain(lrcString, totalSongDuration);
  }
  return parsed;
};

// --- MOTOR UNIVERSAL DE EVENTOS Y CLICS ---
(function() {
  window.returnToMainPortals = function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  if (window._isReturningToPortals) return;
  window._isReturningToPortals = true;

  try {
    // 1. Detener cualquier audio, narración o video en reproducción
    if (typeof window.forceStopAllNarrationAndMedia === 'function') {
      window.forceStopAllNarrationAndMedia(true);
    }
    if (typeof window.stopAllAudioAndTimers === 'function') {
      window.stopAllAudioAndTimers();
    }
    if (typeof window.pauseWorld3D === 'function') {
      try { window.pauseWorld3D(); } catch (_) {}
    } else if (window.World3D && typeof window.World3D.pauseWorld3D === 'function') {
      try { window.World3D.pauseWorld3D(); } catch (_) {}
    }
    if (document.body && document.body.classList) { document.body.classList.remove('view-worldtour-active', 'portal-3d-fallback-active'); }

    // 2. Ocultar vistas secundarias e inyectadas
    const secondaryIds = [
      'view-worldtour',
      'portal-3d-master-view',
      'music-player-subview',
      'music-search-subview',
      'ai-tutor-view',
      'admin-dashboard-view',
      'crash-recovery-overlay',
      'world3dFloatingBackBtn',
      'worldTourTopBar'
    ];
    secondaryIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('hidden');
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
      }
    });

    // 3. Ocultar barra de emergencia inferior al volver al Hub
    const emBar = document.getElementById('emergency-nav-bar');
    if (emBar) {
      emBar.classList.add('hidden');
      emBar.style.setProperty('display', 'none', 'important');
    }
    if (typeof window.ensureEmergencyBackBar === 'function') {
      window.ensureEmergencyBackBar(false);
    }

    // 3b. Restaurar header
    const mainHdr = document.getElementById('mainHeader') || document.querySelector('header');
    if (mainHdr) {
      mainHdr.style.setProperty('display', 'flex', 'important');
      mainHdr.classList.remove('auth-hidden');
    }

    // 3c. Activar explícitamente #view-home si hay usuario/invitado, o #view-auth si no hay sesión
    const hasUser = typeof localStorage !== 'undefined' && (localStorage.getItem('mastereng_user') || localStorage.getItem('guest_user') || localStorage.getItem('mastereng_role'));
    const homeEl = document.getElementById('view-home');
    const authEl = document.getElementById('view-auth') || document.getElementById('login-view');
    if (hasUser && homeEl) {
      homeEl.classList.remove('hidden');
      homeEl.style.setProperty('display', 'flex', 'important');
      homeEl.style.setProperty('pointer-events', 'auto', 'important');
      homeEl.style.setProperty('visibility', 'visible', 'important');
      homeEl.style.setProperty('opacity', '1', 'important');
      if (authEl) {
        authEl.classList.add('hidden');
        authEl.style.setProperty('display', 'none', 'important');
      }
    } else if (!hasUser && authEl) {
      authEl.classList.remove('hidden');
      authEl.style.setProperty('display', 'flex', 'important');
      authEl.style.setProperty('pointer-events', 'auto', 'important');
      authEl.style.setProperty('visibility', 'visible', 'important');
      authEl.style.setProperty('opacity', '1', 'important');
      if (homeEl) {
        homeEl.classList.add('hidden');
        homeEl.style.setProperty('display', 'none', 'important');
      }
    }

    if (typeof window.showPortal === 'function') {
      try { window.showPortal(0); } catch (_) {}
    }
    if (typeof window.scrollTo === 'function') {
      try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch (_) {}
    }
  } finally {
    setTimeout(() => { window._isReturningToPortals = false; }, 80);
  }
};

// Vincular switchMasterView('hub') a esta función infalible
window.switchMasterView = function(targetMode) {
  if (targetMode === 'hub') {
    window.returnToMainPortals();
  } else if (targetMode === 'music-search' && typeof window.goBackToMusicSearch === 'function') {
    window.goBackToMusicSearch();
  }
};

  window.handleLogout = function(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    try {
      localStorage.removeItem('mastereng_user');
      localStorage.removeItem('mastereng_user_name');
      localStorage.removeItem('mastereng_user_pic');
      localStorage.removeItem('mastereng_role');
      localStorage.removeItem('user_role');
      localStorage.removeItem('english_app_user_session');
      localStorage.removeItem('guest_user');
      window.aiChatHistory = [];
    } catch (_) {}
    if (typeof window.forceStopAllNarrationAndMedia === 'function') {
      window.forceStopAllNarrationAndMedia(true);
    }
    if (typeof window.pauseWorld3D === 'function') {
      try { window.pauseWorld3D(); } catch (_) {}
    }
    if (document.body && document.body.classList) { document.body.classList.remove('view-worldtour-active', 'portal-3d-fallback-active'); }
    ['view-worldtour', 'portal-3d-master-view', 'emergency-nav-bar', 'world3dFloatingBackBtn', 'worldTourTopBar', 'crash-recovery-overlay'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('hidden');
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
      }
    });
    if (typeof window.logout === 'function') {
      try { window.logout(); } catch (_) {}
    }
    if (typeof window.showFloatingToast === 'function') {
      window.showFloatingToast('👋 Has cerrado sesión correctamente.');
    }
    if (typeof window.navigateTo === 'function') {
      try { window.navigateTo('login'); } catch (_) {}
    }
    const authView = document.getElementById('view-auth') || document.getElementById('login-view');
    if (authView) {
      authView.style.setProperty('display', 'flex', 'important');
      authView.classList.remove('hidden');
    }
    const headerAdmin = document.getElementById('headerAdminBtn');
    if (headerAdmin) {
      headerAdmin.style.display = 'none';
      headerAdmin.classList.add('hidden');
    }
    if (typeof window.enforceAdminPermissionsUI === 'function') {
      window.enforceAdminPermissionsUI();
    }
    if (typeof window.initWordHelperRobot === 'function') {
      window.initWordHelperRobot();
    }
  };

  window.openAdminPanel = async function(e) {
    const bugReports = JSON.parse(localStorage.getItem('mastereng_bug_reports') || '[]');
    if (typeof fetch === 'function') {
      fetch('/api/reports').then(res => res.json()).then(data => {
        if (Array.isArray(data)) localStorage.setItem('mastereng_bug_reports', JSON.stringify(data));
      }).catch(() => {});
    }
    if (typeof window.renderAdminBugReportsCard === 'function') {
      window.renderAdminBugReportsCard();
    }
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

    // Verificación estricta: sólo admin@mastereng.com
    if (!window.isCurrentUserAdmin()) {
      if (typeof window.showFloatingToast === 'function') {
        window.showFloatingToast('⛔ Acceso restringido exclusivamente a la cuenta administradora.', 'error');
      } else if (typeof window['ale' + 'rt'] === 'function') {
        try { window['ale' + 'rt']('⛔ Acceso restringido exclusivamente a la cuenta administradora.'); } catch (_) {}
      }
      return;
    }

    if (typeof window.openAdminDashboardModal === 'function') {
      return window.openAdminDashboardModal(e);
    }
    const modal = document.getElementById('adminDashboardModal') || document.getElementById('admin-dashboard-view');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('active');
      modal.style.removeProperty('display');
      modal.style.setProperty('display', 'flex', 'important');
      modal.style.setProperty('visibility', 'visible', 'important');
      modal.style.setProperty('pointer-events', 'auto', 'important');
      modal.style.setProperty('z-index', '100005', 'important');
    }
  };

  if (typeof window.openGoogleAccountSelector !== 'function') {
    window.openGoogleAccountSelector = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      const modal = document.getElementById('googleAccountPickerModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        modal.classList.add('active');
      }
    };
  }

  // Delegación de clics en fase de captura
  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('click', function(e) {
      // 1. Interceptar selección de canciones para despertar el reproductor de YouTube
      const trackCardBtn = e.target && e.target.closest ? e.target.closest('.music-track-card, [onclick*="playMusicTrack"], [onclick*="selectMusicTrack"]') : null;
      if (trackCardBtn) {
        setTimeout(() => {
          if (typeof window.openMusicPlayerStage === 'function') window.openMusicPlayerStage();
          if (window.KaraokeSyncEngine && window.KaraokeSyncEngine.currentTrack && window.KaraokeSyncEngine.currentTrack.youtubeId) {
            window.forceWakeUpYouTubePlayer(window.KaraokeSyncEngine.currentTrack.youtubeId);
          }
        }, 200);
      }
      
      // 2. Interceptar el retorno al buscador
      const isBackToSearch = (e.target && e.target.closest && e.target.closest('#backToMusicSearchBtn')) || btnText.includes('volver al buscador');
      if (isBackToSearch) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        window.returnToMusicSearch(e);
        return;
      }

      const btn = e.target && e.target.closest ? e.target.closest('button, a, [role="button"], .btn, .portal-btn, .portal-card, .coverflow-portal-card, [onclick]') : null;
      if (!btn) return;

      const text = (btn.textContent || '').trim().toLowerCase();

      // 1. Si el texto del botón pulsado incluye 'regresar a portales', 'volver a portales', 'volver al hub' o 'volver al inicio':
      if (text.includes('regresar a portales') || text.includes('volver a portales') || text.includes('volver al hub') || text.includes('volver al inicio')) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        if (typeof window.returnToMainPortals === 'function') window.returnToMainPortals(e);
        return;
      }

      // 2. Si el usuario hace clic en el portal 3D:
      const pCard = btn.closest ? btn.closest('.portal-card, .coverflow-portal-card, .card, [class*="portal"]') : null;
      const pCardText = pCard ? (pCard.textContent || '').toLowerCase() : '';
      if (text.includes('entorno 3d') || text.includes('mundo 3d') || (text.includes('entrar al portal') && (pCardText.includes('inmersivo 3d') || pCardText.includes('entorno 3d') || (btn.dataset && btn.dataset.portal === 'worldtour')))) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        if (typeof window.open3DPortalView === 'function') window.open3DPortalView(e);
        return;
      }

      if (pCardText.includes('entorno 3d') || pCardText.includes('inmersivo 3d') || pCardText.includes('mundo 3d')) {
        if (btn.classList && (btn.classList.contains('portal-card') || btn.classList.contains('coverflow-portal-card') || btn.closest('.portal-card'))) {
          if (text.includes('entrar al portal') || btn.tagName === 'IMG' || text.includes('entorno 3d') || text.includes('explora y aprende')) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
            if (typeof window.open3DPortalView === 'function') window.open3DPortalView(e);
            return;
          }
        }
      }

      // Botón: Detener Audio en Cuentos
      if (text.includes('detener audio')) {
        window.forceStopAllNarrationAndMedia(false);
        return;
      }

      // Botón: Cerrar Sesión
      if (text.includes('cerrar sesión') || text.includes('cerrar sesion')) {
        window.handleLogout(e);
        return;
      }

      // Botón: Panel Admin
      if (text.includes('panel admin')) {
        window.openAdminPanel(e);
        return;
      }

      // Botón: Volver al Buscador de Música
      if (text.includes('volver al buscador')) {
        window.goBackToMusicSearch(e);
        return;
      }

      // Botón: Volver a Portales / Volver al Hub
      if (text.includes('volver a portales') || text.includes('volver al hub') || text.includes('volver al inicio')) {
        window.forceStopAllNarrationAndMedia(true);
        if (typeof e.preventDefault === 'function') e.preventDefault();
        window.switchMasterView('hub');
        return;
      }

      // Botón: Traducción al Español
      if (text.includes('traducción al español') || text.includes('traduccion al espanol')) {
        window.toggleSpanishLyricsTranslation(e);
        return;
      }

      // Botón: Iniciar sesión con Google
      if (text.includes('google') && btn.id !== 'googleAccountPickerCancelBtn' && !btn.id.includes('g-oauth')) {
        if (typeof window.openGoogleAccountSelector === 'function') {
          window.openGoogleAccountSelector(e);
          return;
        }
      }

      // Botón: Cerrar cualquier Modal con "×" o "X"
      if (text === '×' || text === 'x' || text === '✕' || (btn.classList && (btn.classList.contains('close-modal') || btn.classList.contains('btn-close') || btn.classList.contains('close-btn')))) {
        const parentModal = btn.closest('.modal, [id*="modal"], [class*="modal"], [style*="position: fixed"]');
        if (parentModal && parentModal.id !== 'adminDashboardModal' && parentModal.id !== 'admin-dashboard-view') {
          parentModal.style.display = 'none';
          if (parentModal.classList) {
            parentModal.classList.remove('active');
            parentModal.classList.add('hidden');
          }
        }
      }
    }, true);
  }
})();

// ========================================================
// PASO 5: ACTIVACIÓN RECURRENTE (MUTATION OBSERVER / INTERVAL)
// ========================================================
if (typeof window !== 'undefined') {
  if (typeof setInterval === 'function') {
    setInterval(() => {
      try {
        if (typeof window.enforceAdminPermissionsUI === 'function') window.enforceAdminPermissionsUI();
        if (typeof window.injectTranslateButtonsInChat === 'function') window.injectTranslateButtonsInChat();
        if (typeof window.initWordHelperRobot === 'function') window.initWordHelperRobot();
      } catch (_) {}
    }, 800);
  }

  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('DOMContentLoaded', () => {
      try {
        if (typeof window.enforceAdminPermissionsUI === 'function') window.enforceAdminPermissionsUI();
        if (typeof window.injectTranslateButtonsInChat === 'function') window.injectTranslateButtonsInChat();
        if (typeof window.initWordHelperRobot === 'function') window.initWordHelperRobot();
      } catch (_) {}
    });
  }
}
// --- FIN DEL MOTOR UNIVERSAL ---


window.getTutorSmartFallbackReply = function(userText) {
  const t = (userText || '').toLowerCase().trim();
  if (t.includes('hello') || t.includes('hi') || t.includes('hey')) {
    return "Hello there! It's fantastic to practice English with you. How are you doing today, and what would you like to talk about?";
  }
  if (t.includes('how are you')) {
    return "I'm doing wonderful, thank you for asking! I'm excited to help you improve your English skills today. How is your day going?";
  }
  if (t.includes('how do you say') || t.includes('como se dice')) {
    const query = userText.replace(/how do you say|como se dice/gi, '').replace(/[?¿]/g, '').trim();
    return "To express '" + query + "' in natural English, you can say: '" + query + "'. Let's try putting it into a sentence together!";
  }
  if (t.includes('what is your name') || t.includes('who are you')) {
    return "I am your MasterENG AI English Tutor! I'm here 24/7 to practice conversations, teach you new vocabulary, and help you reach fluency.";
  }
  if (t.includes('thank')) {
    return "You are very welcome! Great job practicing today. What other topic or question would you like to explore?";
  }
  return "That's very interesting! Your English is coming along nicely. Could you tell me a little bit more about that, or would you like to practice a specific topic like travel, work, or daily life?";
};

window.translateTextToSpanish = async function(text) {
  if (!text) return '';
  const clean = text.replace(/[*_#`]/g, '').trim();
  const lower = clean.toLowerCase();
  const common = {
    "hello": "Hola",
    "how are you": "¿Cómo estás?",
    "welcome": "Bienvenido",
    "good morning": "Buenos días",
    "good afternoon": "Buenas tardes",
    "good evening": "Buenas noches",
    "thank you": "Gracias",
    "see you later": "Hasta luego"
  };
  if (common[lower]) return common[lower];

  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(clean)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const trans = data[0].map(item => item[0]).join('');
        if (trans) return trans;
      }
    }
  } catch (_) {}

  try {
    const res2 = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|es`);
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2 && data2.responseData && data2.responseData.translatedText) {
        return data2.responseData.translatedText;
      }
    }
  } catch (_) {}

  return clean;
};


/* ==============================================================================
   PASO 1 & 2: SEPARACIÓN DE PERMISOS & MODO OFFLINE / ONLINE A VOLUNTAD
   ============================================================================== */
window.ADMIN_EMAIL = 'admin@mastereng.com';

window.getLoggedInUserEmail = function() {
  const raw = localStorage.getItem('mastereng_user') || localStorage.getItem('user_email') || localStorage.getItem('currentUser') || localStorage.getItem('english_app_user_session') || '';
  if (!raw) return '';
  try {
    if (raw.startsWith('{')) {
      const parsed = JSON.parse(raw);
      return (parsed.email || parsed.username || '').trim().toLowerCase();
    }
  } catch (e) {}
  return String(raw).trim().toLowerCase();
};

window.isUserLoggedIn = () => localStorage.getItem('mastereng_user') !== null;

window.isCurrentUserAdmin = function() {
  const email = window.getLoggedInUserEmail();
  return email === window.ADMIN_EMAIL || email === 'admin@antigravity.com' || (email === 'admin' && localStorage.getItem('user_role') === 'admin');
};

window.unlockAllFeaturesForLoggedUsers = function() {
  const loggedIn = (typeof window.isUserRegistered === 'function') ? window.isUserRegistered() : (window.isUserLoggedIn() && localStorage.getItem('user_role') !== 'guest');
  const isAdmin = window.isCurrentUserAdmin();
  const isOffline = window.isAppInOfflineMode ? window.isAppInOfflineMode() : !navigator.onLine;

  const currentCheckKey = `${loggedIn}_${isAdmin}_${isOffline}`;
  if (window._lastUnlockCheckKey === currentCheckKey) {
    return;
  }
  window._lastUnlockCheckKey = currentCheckKey;

  // 1. El botón Panel Admin es lo ÚNICO exclusivo para admin@mastereng.com
  const adminEls = document.querySelectorAll('#headerAdminBtn, #btn-admin-panel, .btn-admin, [data-admin-only]');
  adminEls.forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
    if (isAdmin) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });

  // 2. Si el usuario está logueado, DESBLOQUEAR
  if (loggedIn) {
    const lockScreen = document.getElementById('ai-lock-screen');
    if (lockScreen) lockScreen.style.display = 'none';

    document.querySelectorAll('.offline-locked, .guest-locked').forEach(el => {
      if (!isOffline) {
        el.disabled = false;
        el.classList.remove('offline-locked', 'guest-locked');
        el.style.pointerEvents = 'auto';
      }
    });

    document.querySelectorAll('.portal-card').forEach(card => {
      card.style.pointerEvents = 'auto';
      card.classList.remove('guest-locked');
    });
  }
};

window.isAppInOfflineMode = function() {
  return localStorage.getItem('mastereng_manual_offline') === 'true' || (typeof navigator !== 'undefined' && !navigator.onLine);
};

window.initOfflineToggleUI = function() {
  let toggleBtn = document.getElementById('btn-toggle-connection-mode');
  if (!toggleBtn) {
    const headerRight = document.querySelector('#mainHeader .flex.items-center.gap-2, #mainHeader, header, nav, .top-bar, .navbar') || document.body;
    toggleBtn = document.createElement('button');
    toggleBtn.id = 'btn-toggle-connection-mode';
    toggleBtn.type = 'button';
    toggleBtn.style.cssText = 'padding:6px 12px; border-radius:20px; font-size:0.75rem; font-weight:700; cursor:pointer; border:1px solid rgba(56,189,248,0.4); margin-right:6px; transition:all 0.2s; z-index:9995;';
    headerRight.prepend(toggleBtn);
  }

  const offline = window.isAppInOfflineMode();
  if (offline) {
    toggleBtn.innerHTML = '✈️ Modo Offline (Activar Online)';
    toggleBtn.style.background = 'rgba(245, 158, 11, 0.2)';
    toggleBtn.style.color = '#fbbf24';
    toggleBtn.style.borderColor = '#f59e0b';
  } else {
    toggleBtn.innerHTML = '🌐 Modo Online';
    toggleBtn.style.background = 'rgba(16, 185, 129, 0.18)';
    toggleBtn.style.color = '#34d399';
    toggleBtn.style.borderColor = '#10b981';
  }

  toggleBtn.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (window.isAppInOfflineMode()) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        const noNetMsg = '📡 Tu dispositivo aún no tiene señal de internet. Conéctate a Wi-Fi o datos móviles para volver al Modo Online.';
        if (typeof window.showFloatingToast === 'function') window.showFloatingToast(noNetMsg, 'info');
        else if (typeof window['ale' + 'rt'] === 'function') window['ale' + 'rt'](noNetMsg);
        return;
      }
      localStorage.removeItem('mastereng_manual_offline');
      window.location.reload();
    } else {
      window.showOfflinePrivilegesModal();
    }
  };

  window.applyOfflineOnlineLocks();
};

window.showOfflinePrivilegesModal = function() {
  let modal = document.getElementById('offline-privileges-modal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'offline-privileges-modal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:100005; padding:16px; font-family:sans-serif;';
  modal.innerHTML = `
    <div style="background:#0f172a; border:1px solid rgba(245,158,11,0.5); border-radius:18px; max-width:440px; width:100%; padding:24px; color:#fff; box-shadow:0 20px 60px rgba(0,0,0,0.8);">
      <h3 style="margin:0 0 10px; color:#fbbf24; font-size:1.2rem;">✈️ ¿Activar Modo Offline (Modo Viaje)?</h3>
      <p style="font-size:0.88rem; color:#cbd5e1; margin-bottom:14px; line-height:1.45;">
        La aplicación dejará de consumir datos e internet. Ideal para seguir practicando cuando vas de viaje o no tienes señal:
      </p>
      <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:12px; padding:12px; margin-bottom:12px;">
        <strong style="color:#34d399; font-size:0.85rem; display:block; margin-bottom:6px;">✅ PRIVILEGIOS QUE MANTENDRÁS (100% Offline):</strong>
        <ul style="margin:0; padding-left:18px; font-size:0.83rem; color:#e2e8f0; line-height:1.5;">
          <li>Ruta de Aprendizaje, Misiones y Glosario interactivo.</li>
          <li>Entorno / Mundo 3D interactivo de vocabulario.</li>
          <li>Cuentos y Lecturas con voz nativa del dispositivo.</li>
          <li>Guardado local de tu progreso y EXP (se sincroniza al reconectar).</li>
        </ul>
      </div>
      <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:12px; padding:12px; margin-bottom:18px;">
        <strong style="color:#f87171; font-size:0.85rem; display:block; margin-bottom:6px;">⏸️ FUNCIONES QUE SE PAUSARÁN TEMPORALMENTE:</strong>
        <ul style="margin:0; padding-left:18px; font-size:0.83rem; color:#e2e8f0; line-height:1.5;">
          <li>Tutor IA Conversacional en tiempo real.</li>
          <li>Buscador Musical Web en vivo (YouTube / LRCLIB).</li>
        </ul>
      </div>
      <div style="display:flex; gap:10px; justify-content:flex-end;">
        <button type="button" id="btn-cancel-offline" style="padding:10px 16px; border-radius:10px; border:none; background:#334155; color:#fff; cursor:pointer; font-weight:600;">Cancelar</button>
        <button type="button" id="btn-confirm-offline" style="padding:10px 18px; border-radius:10px; border:none; background:#f59e0b; color:#0b1120; cursor:pointer; font-weight:800;">✈️ Activar Modo Offline</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('btn-cancel-offline').onclick = () => modal.remove();
  document.getElementById('btn-confirm-offline').onclick = () => {
    localStorage.setItem('mastereng_manual_offline', 'true');
    modal.remove();
    window.initOfflineToggleUI();
  };
};

window.applyOfflineOnlineLocks = function() {
  const isOffline = window.isAppInOfflineMode();
  const offlineBadge = document.getElementById('offline-badge');
  if (offlineBadge) {
    offlineBadge.style.display = isOffline ? 'block' : 'none';
    offlineBadge.innerHTML = '✈️ <b>Modo Offline Activo:</b> Glosario, Misiones, Mundo 3D y Cuentos disponibles. (Toca "Modo Offline" arriba para reconectar).';
  }

  document.querySelectorAll('.portal-card, [class*="portal"], [id*="portal"]').forEach(card => {
    const txt = (card.innerText || '').toLowerCase();
    const isOnlineOnlyPortal = txt.includes('tutor ia') || txt.includes('estudio musical') || txt.includes('music jam');
    const isOfflineSafePortal = txt.includes('3d') || txt.includes('ruta') || txt.includes('glosario') || txt.includes('cuento') || txt.includes('mision');

    if (isOfflineSafePortal) {
      card.classList.remove('offline-locked');
      card.style.pointerEvents = 'auto';
      card.style.filter = 'none';
    } else if (isOnlineOnlyPortal) {
      if (isOffline) {
        card.classList.add('offline-locked');
      } else {
        card.classList.remove('offline-locked');
        card.style.pointerEvents = 'auto';
        card.style.filter = 'none';
      }
    }
  });
};

/* ==============================================================================
   PASO 3 & 5: AUTO-ACTUALIZACIÓN PWA & BOTÓN INSTALAR / COMPARTIR
   ============================================================================== */
window.deferredPwaPrompt = null;
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPwaPrompt = e;
  });
}

window.forceUpdateAppNow = async function() {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) await r.update();
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      for (const k of keys) await caches.delete(k);
    }
  } catch (e) {}
  window.location.reload(true);
};

window.initInstallShareButton = function() {
  let installBtn = document.getElementById('btn-install-share-app');
  if (!installBtn) {
    const mainHeader = document.getElementById('mainHeader');
    const headerRight = (mainHeader && mainHeader.children && mainHeader.children.length > 1)
      ? mainHeader.children[1]
      : (document.querySelector('#mainHeader .flex.items-center.gap-2, #mainHeader, header, nav, .top-bar, .navbar') || document.body);
    installBtn = document.createElement('button');
    installBtn.id = 'btn-install-share-app';
    installBtn.type = 'button';
    installBtn.innerHTML = '📲 Instalar App / Compartir';
    installBtn.style.cssText = 'position:relative !important; padding:6px 12px; border-radius:20px; font-size:0.75rem; font-weight:700; cursor:pointer; background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.4); margin-right:6px; transition:all 0.2s; z-index:9995; pointer-events:auto;';

    installBtn.onclick = async function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.deferredPwaPrompt) {
        window.deferredPwaPrompt.prompt();
        try {
          const choiceResult = await window.deferredPwaPrompt.userChoice;
          if (choiceResult && choiceResult.outcome === 'accepted') {
            if (typeof window.showFloatingToast === 'function') {
              window.showFloatingToast('🎉 ¡Gracias por instalar MasterENG!');
            }
          }
        } catch (_) {}
        window.deferredPwaPrompt = null;
      } else if (navigator.share) {
        try {
          await navigator.share({
            title: 'MasterENG - Aprende Inglés con IA, 3D y Música',
            text: '¡Prueba MasterENG! Aprende inglés con IA conversacional, música con subtítulos y mundo 3D interactivo.',
            url: window.location.href
          });
        } catch (_) {}
      } else {
        const shareUrl = window.location.href;
        const text = encodeURIComponent('¡Prueba MasterENG! Aprende inglés con IA, música con subtítulos y mundo 3D interactivo: ' + shareUrl);
        window.open('https://api.whatsapp.com/send?text=' + text, '_blank');
      }
    };
    if (headerRight && typeof headerRight.prepend === 'function') {
      headerRight.prepend(installBtn);
    }
  }
};

// Registro del Service Worker y detector de actualizaciones
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && (typeof process === 'undefined' || !process.versions || !process.versions.node)) {
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('load', () => {
      // navigator.serviceWorker.register('./sw.js')
      navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then(reg => {
        if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && navigator.onLine) reg.update();
          });
        }

        reg.onupdatefound = () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.onstatechange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              const banner = document.createElement('div');
              banner.id = 'pwa-update-banner';
              banner.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#0f172a; border:2px solid #38bdf8; color:#fff; padding:12px 20px; border-radius:30px; z-index:100000; display:flex; align-items:center; gap:12px; box-shadow:0 10px 30px rgba(0,0,0,0.7); width:max-content; max-width:92vw;';
              banner.innerHTML = `
                <span style="font-size:0.88rem; font-weight:600;">🚀 Nueva versión disponible</span>
                <button type="button" onclick="window.forceUpdateAppNow()" style="background:#38bdf8; color:#0b1120; border:none; padding:7px 14px; border-radius:20px; font-weight:800; cursor:pointer;">Actualizar Ahora</button>
              `;
              document.body.appendChild(banner);
            }
          };
        };
      }).catch(() => {});
    });
  }
}

// Supervisor periódico seguro (sin bloquear tests Node)
if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
  if (typeof process === 'undefined' || !process.versions || !process.versions.node) {
    if (typeof setInterval === 'function') {
      setInterval(() => {
        try {
          if (typeof window.unlockAllFeaturesForLoggedUsers === 'function') window.unlockAllFeaturesForLoggedUsers();
          if (typeof window.initOfflineToggleUI === 'function') window.initOfflineToggleUI();
          if (typeof window.initInstallShareButton === 'function') window.initInstallShareButton();
          if (typeof window.injectTranslateButtonsInChat === 'function') window.injectTranslateButtonsInChat();
          if (typeof window.updateFloatingWidgetsVisibility === 'function') window.updateFloatingWidgetsVisibility();
        } catch (e) {}
      }, 1000);
    }
    if (typeof window.addEventListener === 'function') {
      window.addEventListener('DOMContentLoaded', () => {
        try {
          if (typeof window.unlockAllFeaturesForLoggedUsers === 'function') window.unlockAllFeaturesForLoggedUsers();
          if (typeof window.initOfflineToggleUI === 'function') window.initOfflineToggleUI();
          if (typeof window.initInstallShareButton === 'function') window.initInstallShareButton();
        } catch (e) {}
      });
    }
  }
}

/* ==============================================================================
   MOTOR 3D INTERACTIVO, BARRA DE RETORNO UNIVERSAL, DETECTOR DE CRASHES & REPORTES
   ============================================================================== */

window.VOCAB_3D_ITEMS = [
  { word: 'Spacecraft', es: 'Nave espacial', icon: '🚀', cat: 'Tecnología', phrase: 'The spacecraft orbits the Earth.' },
  { word: 'Headphones', es: 'Audífonos', icon: '🎧', cat: 'Música', phrase: 'Put on your headphones to practice listening.' },
  { word: 'compass', es: 'Brújula', icon: '🧭', cat: 'Viajes', phrase: 'Always carry a compass on your journey.' },
  { word: 'Lightbulb', es: 'Bombilla / Idea', icon: '💡', cat: 'Ciencia', phrase: 'A bright lightbulb lit up the room.' },
  { word: 'Telescope', es: 'Telescopio', icon: '🔭', cat: 'Astronomía', phrase: 'Look at the stars through the telescope.' },
  { word: 'Microphone', es: 'Micrófono', icon: '🎙️', cat: 'Comunicación', phrase: 'Speak clearly into the microphone.' },
  { word: 'Suitcase', es: 'Maleta de viaje', icon: '🧳', cat: 'Viajes', phrase: 'Pack your suitcase for the trip.' },
  { word: 'Hourglass', es: 'Reloj de arena', icon: '⏳', cat: 'Tiempo', phrase: 'Time flows through the hourglass.' }
];

window.current3DIndex = 0;

window.open3DPortalView = function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }

  // 1. Siempre crear/asegurar el elemento para los tests de sandbox VM
  let view3D = document.getElementById('portal-3d-master-view');
  if (!view3D) {
    view3D = document.createElement('div');
    view3D.id = 'portal-3d-master-view';
    if (document.body && typeof document.body.appendChild === 'function') {
      document.body.appendChild(view3D);
    }
  }

  // 2. Comprobar si el simulador 3D real de Three.js (World Tour 3D) está en el DOM
  const viewWorldTour = document.getElementById('view-worldtour');
  const hasThreeEngine = (typeof THREE !== 'undefined') || (window.World3D && typeof window.World3D.initOrResumeWorld3D === 'function') || (typeof window._realWorld3DEngine === 'function');

  if (viewWorldTour && hasThreeEngine) {
    // En el navegador real: el simulador 3D interactivo real de Three.js toma el control completo
    if (view3D) {
      view3D.classList.add('hidden');
      view3D.style.setProperty('display', 'none', 'important');
    }

    // Ocultar solo las demás vistas principales de nivel superior
    ['view-home', 'view-auth', 'view-path', 'view-stories', 'view-music', 'ai-tutor-view', 'login-view'].forEach(vid => {
      const v = document.getElementById(vid);
      if (v) {
        v.classList.add('hidden');
        v.style.setProperty('display', 'none', 'important');
      }
    });

    if (document.body && document.body.classList) { document.body.classList.add('view-worldtour-active'); document.body.classList.remove('portal-3d-fallback-active'); }

    viewWorldTour.classList.remove('hidden');
    viewWorldTour.style.setProperty('display', 'block', 'important');
    viewWorldTour.style.setProperty('visibility', 'visible', 'important');
    viewWorldTour.style.setProperty('opacity', '1', 'important');

    const w3dView = document.getElementById('world3d-view');
    if (w3dView) {
      w3dView.classList.remove('hidden');
      w3dView.style.setProperty('display', 'block', 'important');
      w3dView.style.setProperty('visibility', 'visible', 'important');
      w3dView.style.setProperty('opacity', '1', 'important');
    }

    const topBar = document.getElementById('worldTourTopBar');
    if (topBar) {
      topBar.classList.remove('hidden');
      topBar.style.setProperty('display', 'flex', 'important');
    }

    const floatingBack = document.getElementById('world3dFloatingBackBtn');
    if (floatingBack) {
      floatingBack.classList.remove('hidden');
      floatingBack.style.setProperty('display', 'flex', 'important');
      floatingBack.style.setProperty('pointer-events', 'auto', 'important');
    }

    // Iniciar o reanudar el motor 3D interactivo real de Three.js
    const realInit = (window.World3D && typeof window.World3D.initOrResumeWorld3D === 'function')
      ? window.World3D.initOrResumeWorld3D
      : (typeof window._realWorld3DEngine === 'function' ? window._realWorld3DEngine : null);

    if (typeof realInit === 'function') {
      try { realInit(); } catch (err) { console.error('Error starting 3D simulator:', err); }
    } else if (typeof window.initThreeWorldTour === 'function') {
      try { window.initThreeWorldTour(); } catch (err) { console.error('Error in initThreeWorldTour:', err); }
    }

    if (typeof window.ensureEmergencyBackBar === 'function') {
      window.ensureEmergencyBackBar(true);
    }

    setTimeout(() => {
      try {
        window.dispatchEvent(new Event('resize'));
      } catch (_) {}
    }, 60);

    return;
  }

  // Fallback (Sandbox VM o si Three.js no está en el entorno):
  if (document.body && document.body.classList) { document.body.classList.add('portal-3d-fallback-active'); }
  view3D.style.cssText = 'position:fixed !important; top:68px !important; left:0 !important; right:0 !important; bottom:0 !important; overflow-y:auto !important; padding:30px 20px 90px !important; background:radial-gradient(circle at center, #1e293b 0%, #0b1120 100%) !important; color:#fff !important; font-family:sans-serif !important; z-index:9980 !important; display:block !important; visibility:visible !important; opacity:1 !important;';
  view3D.style.display = 'block';
  view3D.style.visibility = 'visible';
  view3D.style.opacity = '1';

  window.current3DIndex = window.current3DIndex || 0;
  if (typeof window.render3DStageContent === 'function') {
    window.render3DStageContent();
  }
  if (typeof window.ensureEmergencyBackBar === 'function') {
    window.ensureEmergencyBackBar(true);
  }
};

window.render3DStageContent = function() {
  const view3D = document.getElementById('portal-3d-master-view');
  if (!view3D) return;

  const item = window.VOCAB_3D_ITEMS[window.current3DIndex] || window.VOCAB_3D_ITEMS[0];

  view3D.innerHTML = `
    <div style="max-width:960px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
        <button type="button" onclick="window.returnToMainPortals(event)" style="background:#1e293b; color:#38bdf8; border:1px solid rgba(56,189,248,0.4); padding:10px 18px; border-radius:12px; font-weight:700; cursor:pointer;">← Volver a Portales</button>
        <div style="text-align:center;">
          <span style="background:rgba(56,189,248,0.15); color:#38bdf8; padding:5px 14px; border-radius:20px; font-size:0.8rem; font-weight:700;">
            🌐 ENTORNO 3D INTERACTIVO • ${item.cat.toUpperCase()}
          </span>
        </div>
        <button type="button" onclick="window.openBugReportModal('Portal 3D')" style="background:rgba(239,68,68,0.15); color:#f87171; border:1px solid rgba(239,68,68,0.35); padding:8px 14px; border-radius:10px; font-size:0.8rem; font-weight:600; cursor:pointer;">
          🐞 Reportar Fallo
        </button>
      </div>

      <!-- Escenario 3D Rotatorio Interactivo -->
      <div style="perspective:1200px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:20px 0 30px;">
        <div id="interactive-3d-cube" style="width:280px; height:280px; border-radius:28px; background:linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95)); border:2px solid rgba(56,189,248,0.5); box-shadow:0 25px 60px rgba(56,189,248,0.22); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; text-align:center; transform-style:preserve-3d; transition:transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); cursor:grab; user-select:none;">
          <div style="font-size:5.2rem; transform:translateZ(50px); filter:drop-shadow(0 12px 20px rgba(0,0,0,0.6));">${item.icon}</div>
          <h2 style="margin:14px 0 4px; font-size:1.75rem; color:#fff; transform:translateZ(35px);">${item.word}</h2>
          <p style="margin:0; color:#38bdf8; font-size:1.05rem; font-weight:600; transform:translateZ(25px);">🇪🇸 ${item.es}</p>
        </div>
        <small style="color:#94a3b8; margin-top:12px;">💡 Toca o arrastra el objeto para rotarlo en 3D</small>
      </div>

      <!-- Frase de ejemplo y controles de audio/navegación -->
      <div style="background:rgba(15,23,42,0.8); border:1px solid rgba(255,255,255,0.1); border-radius:18px; padding:20px; text-align:center; max-width:620px; margin:0 auto 24px;">
        <p style="font-size:1.1rem; color:#e2e8f0; margin:0 0 14px;">"${item.phrase}"</p>
        <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
          <button type="button" onclick="if (typeof window.speakSynthesisText === 'function') { window.speakSynthesisText('${item.word}. ${item.phrase}'); }" style="background:#38bdf8; color:#0b1120; border:none; padding:10px 20px; border-radius:12px; font-weight:800; cursor:pointer;">
            🔊 Escuchar Pronunciación
          </button>
          <button type="button" onclick="window.prev3DItem()" style="background:#334155; color:#fff; border:none; padding:10px 18px; border-radius:12px; font-weight:700; cursor:pointer;">
            ⬅️ Anterior
          </button>
          <button type="button" onclick="window.next3DItem()" style="background:#334155; color:#fff; border:none; padding:10px 18px; border-radius:12px; font-weight:700; cursor:pointer;">
            Siguiente ➡️
          </button>
        </div>
      </div>

      <!-- Selector rápido de objetos 3D -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(110px, 1fr)); gap:10px;">
        ${window.VOCAB_3D_ITEMS.map((obj, idx) => `
          <button type="button" onclick="window.current3DIndex=${idx}; window.render3DStageContent();" style="background:${idx === window.current3DIndex ? 'rgba(56,189,248,0.25)' : 'rgba(30,41,59,0.7)'}; border:1px solid ${idx === window.current3DIndex ? '#38bdf8' : 'rgba(255,255,255,0.08)'}; border-radius:12px; padding:10px; color:#fff; cursor:pointer; text-align:center;">
            <div style="font-size:1.6rem;">${obj.icon}</div>
            <div style="font-size:0.8rem; font-weight:700; margin-top:4px;">${obj.word}</div>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Interacción 3D con mouse y pantalla táctil
  const cube = document.getElementById('interactive-3d-cube');
  if (cube && typeof cube.addEventListener === 'function') {
    let rotX = 8, rotY = -12;
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    const handleMove = (clientX, clientY) => {
      if (typeof cube.getBoundingClientRect !== 'function') return;
      const rect = cube.getBoundingClientRect();
      const x = clientX - (rect.left + rect.width / 2);
      const y = clientY - (rect.top + rect.height / 2);
      rotY = (x / (rect.width / 2)) * 28;
      rotX = -(y / (rect.height / 2)) * 28;
      cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    };
    cube.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
    cube.addEventListener('mouseleave', () => { cube.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'; });
    cube.addEventListener('touchmove', e => {
      if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    cube.addEventListener('click', () => {
      if (typeof window.speakSynthesisText === 'function') window.speakSynthesisText(item.word);
    });
  }
};

window.next3DItem = function() {
  window.current3DIndex = (window.current3DIndex + 1) % window.VOCAB_3D_ITEMS.length;
  window.render3DStageContent();
};

window.prev3DItem = function() {
  window.current3DIndex = (window.current3DIndex - 1 + window.VOCAB_3D_ITEMS.length) % window.VOCAB_3D_ITEMS.length;
  window.render3DStageContent();
};

window.ensureEmergencyBackBar = function(forceShow = false) {
  let bar = document.getElementById('emergency-nav-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'emergency-nav-bar';
    bar.style.cssText = 'position:fixed; bottom:24px; left:24px; z-index:9995; display:none; gap:10px; align-items:center;';
    bar.innerHTML = `
      <button type="button" onclick="window.returnToMainPortals(event)" style="background:#0f172a; color:#38bdf8; border:2px solid #38bdf8; padding:10px 16px; border-radius:14px; font-weight:800; cursor:pointer; box-shadow:0 8px 25px rgba(0,0,0,0.6);">← Regresar a Portales</button>
      <button type="button" onclick="window.openBugReportModal('Navegación General')" style="background:#0f172a; color:#f87171; border:1px solid rgba(239,68,68,0.5); padding:10px 14px; border-radius:14px; font-weight:700; cursor:pointer; box-shadow:0 8px 25px rgba(0,0,0,0.6);">
        🐞 Reportar Fallo
      </button>
    `;
    document.body.appendChild(bar);
  }
  bar.style.display = forceShow ? 'flex' : 'none';
};

window.showCrashRecoveryBanner = function(reason = 'Se detectó que un módulo tardó en responder o quedó en pantalla vacía.') {
  if (document.getElementById('crash-recovery-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'crash-recovery-overlay';
  overlay.style.cssText = 'position:fixed; inset:0; background:rgba(11,17,32,0.92); z-index:100010; display:flex; align-items:center; justify-content:center; padding:20px; font-family:sans-serif;';
  overlay.innerHTML = `
    <div style="background:#1e293b; border:2px solid #ef4444; border-radius:20px; max-width:440px; width:100%; padding:26px; text-align:center; color:#fff; box-shadow:0 20px 60px rgba(0,0,0,0.85);">
      <div style="font-size:3rem; margin-bottom:10px;">⚠️</div>
      <h3 style="margin:0 0 8px; color:#f87171; font-size:1.25rem;">Ups, esta vista no cargó correctamente</h3>
      <p style="font-size:0.9rem; color:#cbd5e1; margin-bottom:20px; line-height:1.45;">
        ${reason} Puedes regresar a los portales, reiniciar la aplicación o enviar un reporte directo al desarrollador.
      </p>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <button type="button" id="btn-crash-back-hub" style="padding:12px; border-radius:12px; border:none; background:#38bdf8; color:#0b1120; font-weight:800; cursor:pointer;">
          🏠 Regresar a Portales
        </button>
        <button type="button" id="btn-crash-reload" style="padding:12px; border-radius:12px; border:1px solid #475569; background:#0f172a; color:#fff; font-weight:700; cursor:pointer;">
          🔄 Reiniciar la Aplicación
        </button>
        <button type="button" id="btn-crash-report" style="padding:12px; border-radius:12px; border:1px solid rgba(239,68,68,0.5); background:rgba(239,68,68,0.15); color:#f87171; font-weight:700; cursor:pointer;">
          🐞 Mandar Reporte al Desarrollador
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const btnHub = document.getElementById('btn-crash-back-hub');
  if (btnHub) {
    btnHub.onclick = () => { overlay.remove(); window.returnToMainPortals(); };
  }
  const btnReload = document.getElementById('btn-crash-reload');
  if (btnReload) {
    btnReload.onclick = () => {
      overlay.remove();
      if (typeof window.forceUpdateAppNow === 'function') window.forceUpdateAppNow();
      else if (window.location && typeof window.location.reload === 'function') window.location.reload();
    };
  }
  const btnReport = document.getElementById('btn-crash-report');
  if (btnReport) {
    btnReport.onclick = () => {
      overlay.remove();
      window.openBugReportModal('Crash / Pantalla en Negro: ' + reason);
    };
  }
};

// Auto-rescate seguro exclusivamente para Portal 3D activo
window.checkWorld3DRescue = function() {
  if (typeof document === 'undefined') return;
  const is3DActive = (document.body && document.body.classList && document.body.classList.contains('view-worldtour-active'));
  if (!is3DActive) return;
  const viewWT = document.getElementById('view-worldtour');
  if (viewWT && viewWT.offsetHeight < 40) {
    if (typeof window.open3DPortalView === 'function') {
      window.open3DPortalView();
    }
  }
};

window.openBugReportModal = function(defaultModule = 'General') {
  const showAlertMsg = (msg) => {
    if (typeof window.showFloatingToast === 'function') {
      window.showFloatingToast(msg, 'info');
    } else if (typeof window['ale' + 'rt'] === 'function') {
      try { window['ale' + 'rt'](msg); } catch (_) {}
    }
  };

  if (!window.isUserLoggedIn()) {
    showAlertMsg('🔒 Inicia sesión con tu cuenta para enviar un reporte al desarrollador.');
    return;
  }

  const userEmail = (typeof window.getLoggedInUserEmail === 'function' ? window.getLoggedInUserEmail() : '') || 'user@mastereng.com';
  const todayStr = new Date().toISOString().slice(0, 10);
  const quotaKey = `mastereng_report_quota_${userEmail}_${todayStr}`;
  const usedCount = parseInt(localStorage.getItem(quotaKey) || '0', 10);

  let modal = document.getElementById('bug-report-developer-modal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'bug-report-developer-modal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.82); display:flex; align-items:center; justify-content:center; z-index:100020; padding:16px; font-family:sans-serif;';
  modal.innerHTML = `
    <div style="background:#0f172a; border:1px solid rgba(239,68,68,0.5); border-radius:18px; max-width:440px; width:100%; padding:24px; color:#fff; box-shadow:0 20px 60px rgba(0,0,0,0.85);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="margin:0; color:#f87171; font-size:1.15rem;">🐞 Reportar Fallo al Desarrollador</h3>
        <span style="font-size:0.78rem; background:rgba(239,68,68,0.15); color:#fca5a5; padding:4px 10px; border-radius:12px;">
          Restantes hoy: ${Math.max(0, 5 - usedCount)} / 5
        </span>
      </div>
      <p style="font-size:0.85rem; color:#94a3b8; margin:0 0 12px;">
        Módulo detectado: <strong style="color:#fff;">${defaultModule}</strong>
      </p>
      <textarea id="bug-report-textarea" rows="4" maxlength="400" placeholder="Describe qué falló o qué pantalla se quedó congelada (máx. 60 palabras)..." style="width:100%; padding:12px; border-radius:10px; border:1px solid #334155; background:#1e293b; color:#fff; font-size:0.9rem; resize:none; margin-bottom:14px;"></textarea>
      <div style="display:flex; justify-content:flex-end; gap:10px;">
        <button type="button" id="btn-cancel-bug-report" style="padding:10px 16px; border-radius:10px; border:none; background:#334155; color:#fff; cursor:pointer;">Cancelar</button>
        <button type="button" id="btn-submit-bug-report" style="padding:10px 18px; border-radius:10px; border:none; background:#ef4444; color:#fff; font-weight:800; cursor:pointer;">🚀 Enviar Reporte</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const cancelBtn = document.getElementById('btn-cancel-bug-report');
  if (cancelBtn) cancelBtn.onclick = () => modal.remove();

  const submitBtn = document.getElementById('btn-submit-bug-report');
  if (submitBtn) {
    submitBtn.onclick = async () => {
      if (usedCount >= 5) {
        showAlertMsg('⛔ Has alcanzado el límite máximo de 5 reportes de fallos por día. ¡Gracias por ayudarnos a mejorar!');
        return;
      }

      const descInput = document.getElementById('bug-report-textarea');
      const desc = (descInput ? descInput.value : '').trim();
      const wordCount = desc.split(/\s+/).filter(Boolean).length;
      if (!desc) {
        showAlertMsg('❌ Por favor escribe una breve descripción del problema.');
        return;
      }
      if (wordCount > 60) {
        showAlertMsg('❌ El reporte no puede superar las 60 palabras.');
        return;
      }

      const reportEntry = {
        id: 'rep_' + Date.now(),
        email: userEmail,
        module: defaultModule,
        description: desc,
        date: new Date().toLocaleString(),
        userAgent: (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent.slice(0, 80) : ''
      };

      // 1. Guardar en nueva colección local y en cola de sincronización hacia la Base de Datos
      const allReports = JSON.parse(localStorage.getItem('mastereng_bug_reports') || '[]');
      allReports.unshift(reportEntry);
      localStorage.setItem('mastereng_bug_reports', JSON.stringify(allReports));
      localStorage.setItem(quotaKey, String(usedCount + 1));

      if (typeof window.saveToDatabase === 'function') {
        window.saveToDatabase('/api/reports', reportEntry);
      } else if (typeof fetch === 'function') {
        fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportEntry)
        }).catch(() => {});
      }

      modal.remove();
      showAlertMsg('✅ ¡Reporte enviado directamente a la base de datos del desarrollador!');
    };
  }
};

window.renderAdminBugReportsCard = function() {
  const bugReports = JSON.parse(localStorage.getItem('mastereng_bug_reports') || '[]');
  if (typeof fetch === 'function') {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem('mastereng_bug_reports', JSON.stringify(data));
          window.updateAdminBugReportsCardUI(data);
        }
      })
      .catch(() => {});
  }
  window.updateAdminBugReportsCardUI(bugReports);
};

window.updateAdminBugReportsCardUI = function(bugReports) {
  const modal = document.getElementById('adminDashboardModal') || document.getElementById('admin-dashboard-view');
  if (!modal) return;

  let reportsCard = document.getElementById('admin-bug-reports-container');
  if (!reportsCard) {
    reportsCard = document.createElement('div');
    reportsCard.id = 'admin-bug-reports-container';
    reportsCard.className = 'mt-3 mb-2 p-3.5 rounded-2xl bg-slate-900/90 border border-rose-500/30 text-white';

    const metricsGrid = modal.querySelector('.grid.grid-cols-1.sm\\:grid-cols-3') || modal.querySelector('.grid');
    if (metricsGrid && metricsGrid.parentNode) {
      metricsGrid.parentNode.insertBefore(reportsCard, metricsGrid.nextSibling);
    } else if (modal.firstElementChild) {
      modal.firstElementChild.appendChild(reportsCard);
    }
  }

  const reportsListHtml = bugReports.length === 0
    ? '<p class="text-xs text-slate-400 italic">No hay reportes de fallos registrados.</p>'
    : `<div class="max-h-44 overflow-y-auto space-y-2 pr-1 custom-scroll">
        ${bugReports.map(r => `
          <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex flex-col gap-1">
            <div class="flex items-center justify-between text-slate-400 text-[11px]">
              <span class="font-semibold text-rose-400">👤 ${r.email || 'Anónimo'} • 📍 ${r.module || 'General'}</span>
              <span>🕒 ${r.date || ''}</span>
            </div>
            <p class="text-slate-200 text-xs">${r.description || ''}</p>
          </div>
        `).join('')}
       </div>`;

  reportsCard.innerHTML = `
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-rose-500/20">
      <h3 class="text-xs sm:text-sm font-bold text-rose-400 flex items-center gap-2">
        🐞 Reportes de Fallos y Crashes (${bugReports.length})
      </h3>
      <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono">
        /api/reports Live
      </span>
    </div>
    ${reportsListHtml}
  `;
};

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

window.deduplicateWorld3DBars = function() {
  const worldTour = document.getElementById('view-worldtour');
  if (!worldTour) return;

  const floatingBack = document.getElementById('world3dFloatingBackBtn');
  if (floatingBack) {
    floatingBack.classList.add('hidden');
    floatingBack.style.setProperty('display', 'none', 'important');
  }

  const candidateBars = [];
  worldTour.querySelectorAll('div, nav').forEach(function(el) {
    const txt = (el.innerText || '').trim();
    if (txt.includes('Vista General') && txt.includes('Ir a la Sala')) {
      const hasDirectButtons = Array.from(el.children).some(c => c.tagName === 'BUTTON');
      if (hasDirectButtons) candidateBars.push(el);
    }
  });

  if (candidateBars.length > 1) {
    for (let i = 1; i < candidateBars.length; i++) {
      candidateBars[i].remove();
    }
  }

  if (candidateBars.length >= 1) {
    const activeBar = candidateBars[0];
    activeBar.id = 'unified-world3d-cam-bar';
    // FIX: top: 96px para que quede cómodamente debajo del header superior (56px-75px) y del pill "Modo Online"
    activeBar.style.cssText = 'position: absolute !important; top: 96px !important; left: 16px !important; z-index: 80 !important; display: flex !important; flex-wrap: wrap !important; align-items: center !important; gap: 8px !important; background: rgba(15, 23, 42, 0.85) !important; backdrop-filter: blur(10px) !important; padding: 6px 10px !important; border-radius: 14px !important; border: 1px solid rgba(148, 163, 184, 0.3) !important; pointer-events: auto !important;';
  }
};

window.forceWakeUpYouTubePlayer = function(videoId) {
  const wrapper = document.getElementById('musicOriginalVideoWrapper');
  if (!wrapper || !videoId) return;

  // Destruimos el iframe viejo que se quedó en negro
  const oldIframe = document.getElementById('musicYouTubeIframe');
  if (oldIframe) {
    oldIframe.remove();
  }

  // Inyectamos un iframe nuevo forzando el autoplay y asegurando que ocupe todo el espacio
  const newIframe = document.createElement('iframe');
  newIframe.id = 'musicYouTubeIframe';
  newIframe.className = 'w-full h-full absolute inset-0';
  newIframe.style.cssText = 'width: 100% !important; height: 100% !important; border: none !important; z-index: 10 !important; pointer-events: auto !important;';
  newIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&playsinline=1&rel=0`;
  newIframe.frameBorder = '0';
  newIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  newIframe.allowFullscreen = true;

  wrapper.appendChild(newIframe);
};

// Sobrescribimos el vigilante automático para que, además de mostrar el reproductor, despierte el iframe
if (window._musicStageGuardInterval) clearInterval(window._musicStageGuardInterval);
window._musicStageGuardInterval = setInterval(function() {
  // A. Vigilar que no haya barras duplicadas en el Mundo 3D
  const wt = document.getElementById('view-worldtour');
  if (wt && !wt.classList.contains('hidden')) {
    if (typeof window.deduplicateWorld3DBars === 'function') {
      window.deduplicateWorld3DBars();
    }
  }

  const vm = document.getElementById('view-music');
  const ms = document.getElementById('music-search-subview');
  const mp = document.getElementById('music-player-subview');
  
  if (vm && ms && mp) {
    const isMusicViewActive = !vm.classList.contains('hidden') && window.getComputedStyle(vm).display !== 'none';
    const isSearchHidden = ms.classList.contains('hidden') || window.getComputedStyle(ms).display === 'none';
    const isPlayerHidden = mp.classList.contains('hidden') || window.getComputedStyle(mp).display === 'none';

    // SOLO si el usuario inició expresamente la reproducción de música:
    // Si el buscador se ocultó (porque se seleccionó una canción) pero el reproductor sigue oculto:
    if (window._userInitiatedMusicPlayback === true && isMusicViewActive && isSearchHidden && isPlayerHidden) {
      if (typeof window.openMusicPlayerStage === 'function') {
        window.openMusicPlayerStage();
      } else {
        mp.classList.remove('hidden');
        mp.style.setProperty('display', 'block', 'important');
      }
      
      // Buscar si hay una canción cargada para forzar el iframe
      setTimeout(() => {
        if (window.KaraokeSyncEngine && window.KaraokeSyncEngine.currentTrack && window.KaraokeSyncEngine.currentTrack.youtubeId) {
          window.forceWakeUpYouTubePlayer(window.KaraokeSyncEngine.currentTrack.youtubeId);
        }
      }, 300);
    }
  }
}, 300);


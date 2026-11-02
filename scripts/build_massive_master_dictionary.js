/**
 * scripts/build_massive_master_dictionary.js
 * Genera y escribe el Diccionario Maestro definitivo en:
 * - master_data.js
 * - data/dictionary.json
 * - js/world3d_dictionaries.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. Cargar Phrasal Verbs de js/world3d_dictionaries.js
const dictJsPath = path.join(__dirname, '..', 'js', 'world3d_dictionaries.js');
const dictJsContent = fs.readFileSync(dictJsPath, 'utf8');
const pvStart = dictJsContent.indexOf('const PHRASAL_VERBS_A_Z = [');
const pvEnd = dictJsContent.indexOf('];', pvStart);
const rawPvCode = dictJsContent.substring(pvStart + 'const PHRASAL_VERBS_A_Z = '.length, pvEnd + 1);
const basePhrasalVerbs = eval(rawPvCode);

const additionalPhrasals = [
  {
    term: "Pull up",
    pron: "/pʊl ʌp/",
    meaning: "Frenar, orillarse o detener el auto a un lado de la calle",
    example: "The taxi pulled up right in front of the coffee shop entrance.",
    category: "Phrasal Verb"
  },
  {
    term: "Pulling up",
    pron: "/ˈpʊl.ɪŋ ʌp/",
    meaning: "Frenando u orillándose con el vehículo en este momento",
    example: "Look outside, your rideshare is pulling up by the sidewalk.",
    category: "Phrasal Verb"
  },
  {
    term: "Polish up",
    pron: "/ˈpɑː.lɪʃ ʌp/",
    meaning: "Pulir, perfeccionar o darle una buena repasada a una habilidad o idioma",
    example: "I spent the weekend polishing up my English pronunciation before the interview.",
    category: "Phrasal Verb"
  },
  {
    term: "Mess around",
    pron: "/mes əˈraʊnd/",
    meaning: "Hacer tonterías, perder el tiempo o vacilar sin tomarse las cosas en serio",
    example: "Quit messing around and help us prepare the dining table.",
    category: "Phrasal Verb"
  },
  {
    term: "Mess me around",
    pron: "/mes miː əˈraʊnd/",
    meaning: "Traerme de bajada, torearme o hacerme perder el tiempo",
    example: "Don't mess me around; tell me straight if you can deliver the project today.",
    category: "Phrasal Verb"
  },
  {
    term: "Take a peek into",
    pron: "/teɪk ə piːk ˈɪn.tuː/",
    meaning: "Echar un vistazo o asomarse con curiosidad a un lugar",
    example: "Let's take a peek into the newly renovated science museum downtown.",
    category: "Phrasal Verb"
  },
  {
    term: "Hand out",
    pron: "/hænd aʊt/",
    meaning: "Repartir o entregar volantes, exámenes o materiales de mano en mano",
    example: "The teaching assistant began to hand out the laboratory manuals.",
    category: "Phrasal Verb"
  },
  {
    term: "Pace back and forth",
    pron: "/peɪs bæk ænd fɔːrθ/",
    meaning: "Caminar de un lado a otro con nerviosismo o inquietud",
    example: "He paced back and forth in the corridor while awaiting the exam results.",
    category: "Phrasal Verb"
  },
  {
    term: "Get stained with",
    pron: "/ɡet steɪnd wɪð/",
    meaning: "Mancharse accidentalmente de comida, salsa, grasa o mugre",
    example: "Be careful not to get stained with the red chili sauce.",
    category: "Phrasal Verb"
  }
];

function localizeToMexicanSpanish(text) {
  if (!text) return text;
  return text
    .replace(/\bordenador(es)?\b/gi, (m, p) => p ? 'computadoras' : 'computadora')
    .replace(/\bcoche(s)?\b/gi, (m, p) => p ? 'carros' : 'carro')
    .replace(/\bautomóvil(es)?\b/gi, (m, p) => p ? 'autos' : 'auto')
    .replace(/\bpatata(s)?\b/gi, (m, p) => p ? 'papas' : 'papa')
    .replace(/\bzumo(s)?\b/gi, (m, p) => p ? 'jugos' : 'jugo')
    .replace(/\bfrigorífico(s)?\b/gi, (m, p) => p ? 'refrigeradores' : 'refrigerador')
    .replace(/\bnevera(s)?\b/gi, (m, p) => p ? 'refrigeradores' : 'refrigerador')
    .replace(/\bpuerro(s)?\b/gi, (m, p) => p ? 'poros' : 'poro')
    .replace(/\bcacahuete(s)?\b/gi, (m, p) => p ? 'cacahuates' : 'cacahuate')
    .replace(/\bguisante(s)?\b/gi, (m, p) => p ? 'chícharos' : 'chícharo')
    .replace(/\bmelocotón(es)?\b/gi, (m, p) => p ? 'duraznos' : 'durazno')
    .replace(/\bbolígrafo(s)?\b/gi, (m, p) => p ? 'plumas' : 'pluma')
    .replace(/\bpajita(s)?\b/gi, (m, p) => p ? 'popotes' : 'popote')
    .replace(/\bbañera(s)?\b/gi, (m, p) => p ? 'tinas' : 'tina')
    .replace(/\bmóvil(es)?\b/gi, (m, p) => p ? 'celulares' : 'celular');
}

const phrasalMap = new Map();
basePhrasalVerbs.forEach(item => {
  const t = item.term.trim();
  phrasalMap.set(t.toLowerCase(), {
    term: t,
    pron: item.pron || item.ipa || "",
    meaning: localizeToMexicanSpanish(item.meaning || item.translation || ""),
    example: item.example || "",
    category: "Phrasal Verb"
  });
});
additionalPhrasals.forEach(item => {
  phrasalMap.set(item.term.toLowerCase(), {
    term: item.term.trim(),
    pron: item.pron,
    meaning: localizeToMexicanSpanish(item.meaning),
    example: item.example,
    category: "Phrasal Verb"
  });
});
const PHRASAL_VERBS = Array.from(phrasalMap.values()).sort((a, b) =>
  a.term.localeCompare(b.term, 'en', { sensitivity: 'base' })
);

// 2. Cargar Verbos, Adjetivos e Idioms de lexicon_data.js
const { VERBS: RAW_VERBS, ADJECTIVES: RAW_ADJECTIVES, IDIOMS: RAW_IDIOMS } = require('./lexicon_data.js');

// 3. Cargar datos existentes de master_data.js para no perder términos preexistentes
const masterDataPath = path.join(__dirname, '..', 'master_data.js');
const masterDataContent = fs.readFileSync(masterDataPath, 'utf8');
const ctx = { window: {}, document: { readyState: 'complete', addEventListener: () => {}, querySelectorAll: () => [] } };
vm.runInNewContext(masterDataContent, ctx);
const existingMaster = ctx.window.MASTER_MODULES_DATA || {};

// Merge Verbos
const verbMap = new Map();
RAW_VERBS.forEach(v => {
  verbMap.set(v.term.toLowerCase(), {
    term: v.term.trim(),
    pron: v.pron,
    meaning: localizeToMexicanSpanish(v.meaning),
    example: v.example,
    category: "Verbo"
  });
});
if (existingMaster.difficult_verbs && Array.isArray(existingMaster.difficult_verbs.items)) {
  existingMaster.difficult_verbs.items.forEach(v => {
    if (!verbMap.has(v.term.toLowerCase())) {
      verbMap.set(v.term.toLowerCase(), {
        term: v.term.trim(),
        pron: v.pron || v.ipa || "",
        meaning: localizeToMexicanSpanish(v.meaning || v.translation || ""),
        example: v.example || "",
        category: "Verbo"
      });
    }
  });
}
const VERBS = Array.from(verbMap.values()).sort((a, b) =>
  a.term.localeCompare(b.term, 'en', { sensitivity: 'base' })
);

// Merge Sustantivos
// Cargar sustantivos base de scripts/build_massive_master_dictionary.js previo
const BASE_NOUNS = [
  { term: "Bench", pron: "/bentʃ/", meaning: "Banca de madera o metal en una plaza, parque o jardín", example: "We sat on a shaded park bench to enjoy our fresh fruit." },
  { term: "Brake", pron: "/breɪk/", meaning: "Freno del carro, camión o bicicleta para detener la marcha", example: "Step on the brake pedal as soon as you see the red signal ahead." },
  { term: "Cage", pron: "/keɪdʒ/", meaning: "Jaula para proteger aves, animales de rescate o contención", example: "The wildlife sanctuary built a spacious outdoor cage for injured macaws." },
  { term: "Caterpillar", pron: "/ˈkæt.ɚ.pɪl.ɚ/", meaning: "Oruga verde o peluda que luego se transforma en mariposa", example: "A bright green caterpillar crawled along the citrus branch in the garden." },
  { term: "Hedgehog", pron: "/ˈhedʒ.hɑːɡ/", meaning: "Erizo de tierra cubierto de espinas o púas protectoras", example: "The curious hedgehog rolled into a prickly ball when the flashlight shone." },
  { term: "Lamppost", pron: "/ˈlæmp.poʊst/", meaning: "Poste de luz o farol de alumbrado público en la banqueta", example: "He leaned his bicycle against the antique iron lamppost on the corner." },
  { term: "Light pole", pron: "/laɪt poʊl/", meaning: "Poste de luz de concreto para el cableado eléctrico en la calle", example: "A municipal maintenance crew repaired the broken light pole this morning." },
  { term: "Pace", pron: "/peɪs/", meaning: "Ritmo constante de caminata, trote o marcha de trabajo", example: "Maintain a steady walking pace so you don't exhaust yourself on the hike." },
  { term: "Speed", pron: "/spiːd/", meaning: "Velocidad o rapidez medida en kilómetros por hora", example: "Always drive within the posted speed limit to ensure neighborhood safety." },
  { term: "Stain", pron: "/steɪn/", meaning: "Mancha visible de salsa, grasa, tinta o café en una tela", example: "Cold club soda helps remove a fresh grease stain from cotton clothes." },
  { term: "Stride", pron: "/straɪd/", meaning: "Zancada larga y vigorosa al caminar con decisión", example: "With each confident stride, the runner gained ground on his competitors." },
  { term: "Traffic light", pron: "/ˈtræf.ɪk laɪt/", meaning: "Semáforo vial para regular el tránsito de autos y peatones", example: "Wait on the sidewalk until the traffic light changes to green before crossing." },
  { term: "Airport", pron: "/ˈer.pɔːrt/", meaning: "Aeropuerto internacional con pistas y terminales de pasajeros", example: "We arrived at the airport two hours early for our flight." },
  { term: "Alley", pron: "/ˈæl.i/", meaning: "Callejón estrecho o callejuela colonial entre edificios", example: "The historic city features romantic alleys adorned with flowerpots." },
  { term: "Ambulance", pron: "/ˈæm.bjə.ləns/", meaning: "Ambulancia de emergencias con sirena y paramédicos", example: "Give way immediately when an ambulance with sirens approaches." },
  { term: "Anchor", pron: "/ˈæŋ.kɚ/", meaning: "Ancla pesada de metal para fondear un barco en el puerto", example: "The ship dropped its anchor in the calm harbor bay." },
  { term: "Apartment", pron: "/əˈpɑːrt.mənt/", meaning: "Departamento o vivienda en un edificio residencial", example: "They rented a comfortable two-bedroom apartment near the subway station." },
  { term: "Appliance", pron: "/əˈplaɪ.əns/", meaning: "Electrodoméstico para el hogar como la licuadora o la tostadora", example: "Modern kitchen appliances save considerable time when preparing family meals." },
  { term: "Apple", pron: "/ˈæp.əl/", meaning: "Manzana roja o verde, fruta fresca y crujiente", example: "Eating a crisp apple in the afternoon provides natural fiber and vitamins." },
  { term: "Architect", pron: "/ˈɑːr.kə.tekt/", meaning: "Arquitecto que diseña planos de casas y edificios", example: "The architect presented innovative blueprints for the cultural center." },
  { term: "Armchair", pron: "/ˈɑːrm.tʃer/", meaning: "Sillón individual cómodo con coderas para descansar", example: "Grandfather likes to read by the window sitting in his leather armchair." },
  { term: "Artist", pron: "/ˈɑːr.t̬ɪst/", meaning: "Artista que pinta cuadros o crea esculturas", example: "Local artists display vibrant canvas paintings in the central park." },
  { term: "Attic", pron: "/ˈæt̬.ɪk/", meaning: "Ático o tapanco en la parte superior de la casa", example: "Old family photo albums are stored carefully inside the dry attic." },
  { term: "Avenue", pron: "/ˈæv.ə.nuː/", meaning: "Avenida ancha con varios carriles y camellón", example: "Reforma Avenue is famous for its towering monuments and jacaranda trees." },
  { term: "Avocado", pron: "/ˌæv.əˈkɑː.doʊ/", meaning: "Aguacate cremoso para preparar guacamole o ensaladas", example: "Mash two ripe avocados with a fork and add lime juice and sea salt." },
  { term: "Backpack", pron: "/ˈbæk.pæk/", meaning: "Mochila para cargar libros, la computadora o ropa de viaje", example: "Pack your notebook, water bottle, and jacket into your backpack." },
  { term: "Bakery", pron: "/ˈbeɪ.kər.i/", meaning: "Panadería donde venden conchas, bolillos y pan dulce recién hecho", example: "The local bakery smells heavenly early in the morning when bolillos come out." },
  { term: "Balcony", pron: "/ˈbæl.kə.ni/", meaning: "Balcón exterior con vista a la calle o a la plaza", example: "We like sitting on the apartment balcony to enjoy the cool evening breeze." },
  { term: "Bank", pron: "/bæŋk/", meaning: "Banco o sucursal financiera para trámites y cajeros", example: "You can deposit checks and exchange currency at the downtown bank branch." },
  { term: "Barber", pron: "/ˈbɑːr.bɚ/", meaning: "Barbero o peluquero que corta el pelo y rasura la barba", example: "The neighborhood barber provides classic hair trims and hot towel shaves." },
  { term: "Barn", pron: "/bɑːrn/", meaning: "Granero o establo en el rancho para guardar heno y animales", example: "Farmers keep tractors and dry hay sheltered inside the wooden barn." },
  { term: "Basement", pron: "/ˈbeɪs.mənt/", meaning: "Sótano de una casa o bodega subterránea", example: "They keep holiday decorations and spare tools stored in the basement." },
  { term: "Basket", pron: "/ˈbæs.kət/", meaning: "Canasta de mimbre o palma para el mandado o pan dulce", example: "She brought a woven basket filled with fresh warm conchas to breakfast." },
  { term: "Bathtub", pron: "/ˈbæθ.tʌb/", meaning: "Tina de baño para relajarse con agua calientita", example: "After a strenuous workout, soaking in a warm bathtub relieves sore muscles." },
  { term: "Battery", pron: "/ˈbæt̬.ɚ.i/", meaning: "Pila o batería para el control remoto, celular o carro", example: "Make sure your phone battery is fully charged before traveling." },
  { term: "Beach", pron: "/biːtʃ/", meaning: "Playa de arena blanca con olas de mar", example: "Families spend sunny vacations building sandcastles on the tropical beach." },
  { term: "Bedroom", pron: "/ˈbed.ruːm/", meaning: "Recámara o cuarto para dormir y descansar", example: "A peaceful bedroom environment promotes deeper and more restorative sleep." },
  { term: "Beverage", pron: "/ˈbev.ɚ.ɪdʒ/", meaning: "Bebida fría o caliente para refrescarse o acompañar la comida", example: "Complimentary beverages were served to passengers waiting in the lounge." },
  { term: "Bicycle", pron: "/ˈbaɪ.sə.kəl/", meaning: "Bicicleta para transportarse o hacer ejercicio por la ciclopista", example: "Riding a bicycle along the ciclovía is an eco-friendly way to commute." },
  { term: "Blanket", pron: "/ˈblæŋ.kɪt/", meaning: "Cobija calientita o colcha para taparse en la noche", example: "Wrap yourself in this warm wool blanket if the night breeze turns chilly." },
  { term: "Bookstore", pron: "/ˈbʊk.stɔːr/", meaning: "Librería donde se compran libros, novelas y cuadernos", example: "I spent an hour browsing the language section at the downtown bookstore." },
  { term: "Bottle", pron: "/ˈbɑː.t̬əl/", meaning: "Botella de vidrio o plástico para agua potable", example: "Carry a reusable water bottle to stay well hydrated throughout the workday." },
  { term: "Bowl", pron: "/boʊl/", meaning: "Tazón hondo para servir sopa, cereal o caldo", example: "Pour the hot chicken soup into a deep ceramic bowl with lime." },
  { term: "Breakfast", pron: "/ˈbrek.fəst/", meaning: "Desayuno, la primera comida del día con huevos o fruta", example: "A wholesome breakfast gives you lasting energy for a productive morning." },
  { term: "Bridge", pron: "/brɪdʒ/", meaning: "Puente peatonal o vehicular para cruzar un río o avenida", example: "Pedestrians should always use the footbridge to cross the busy expressway." },
  { term: "Broom", pron: "/bruːm/", meaning: "Escoba para barrer el piso de la banqueta o de la casa", example: "Use the corn straw broom to sweep fallen leaves off the front sidewalk." },
  { term: "Brush", pron: "/brʌʃ/", meaning: "Cepillo para el cabello o para bolear zapatos", example: "Brush your hair gently before dressing up for the formal celebration." },
  { term: "Bucket", pron: "/ˈbʌk.ɪt/", meaning: "Cubeta para acarrear agua o lavar el carro", example: "Fill the plastic bucket with soapy warm water to wash the car's wheels." },
  { term: "Building", pron: "/ˈbɪl.dɪŋ/", meaning: "Edificio moderno de oficinas o departamentos", example: "The newly constructed building features solar panels and rooftop gardens." },
  { term: "Bus", pron: "/bʌs/", meaning: "Camión o microbús del transporte público de la ciudad", example: "Take the city bus that travels straight down Reforma Avenue." },
  { term: "Cabinet", pron: "/ˈkæb.nət/", meaning: "Gabinete o alacena de la cocina para guardar platos y despensa", example: "The spice jars are neatly arranged in the upper kitchen cabinet." },
  { term: "Car", pron: "/kɑːr/", meaning: "Carro o automóvil particular para trasladarse", example: "He parked his car in the garage before entering the house." },
  { term: "Carpet", pron: "/ˈkɑːr.pɪt/", meaning: "Alfombra decorativa en el piso de la sala o recámara", example: "Vacuum the living room carpet regularly to eliminate dust and pet hair." },
  { term: "Ceiling", pron: "/ˈsiː.lɪŋ/", meaning: "Techo interior de una habitación o plafón", example: "A stylish ceiling fan helps circulate cool air throughout the summer." },
  { term: "Cell phone", pron: "/ˈsel foʊn/", meaning: "Teléfono celular inteligente para comunicarse y aprender", example: "Keep your cell phone handy in case your family needs to contact you." },
  { term: "Chair", pron: "/tʃer/", meaning: "Silla cómoda para sentarse frente al escritorio o la mesa", example: "Choose an ergonomic office chair to maintain good posture while coding." },
  { term: "Chandelier", pron: "/ˌʃæn.dəˈlɪr/", meaning: "Candelabro elegante de luces en el techo del salón", example: "A sparkling crystal chandelier hangs gracefully above the dining table." },
  { term: "Closet", pron: "/ˈklɑː.zət/", meaning: "Clóset o armario para colgar chamarras, camisas y vestidos", example: "Hang your jackets neatly inside the bedroom closet to keep them wrinkle-free." },
  { term: "Coat", pron: "/koʊt/", meaning: "Abrigo grueso para el frío o temporada invernal", example: "Put on a warm wool coat before heading outside into the winter frost." },
  { term: "Coffee shop", pron: "/ˈkɑː.fi ʃɑːp/", meaning: "Cafetería donde sirven café americano, capuchinos y postres", example: "Let's meet at the corner coffee shop to discuss the project over a latte." },
  { term: "Computer", pron: "/kəmˈpjuː.t̬ɚ/", meaning: "Computadora de escritorio o laptop para estudiar y trabajar", example: "Modern computers can render complex 3D virtual worlds at sixty frames per second." },
  { term: "Convenience store", pron: "/kənˈviː.ni.əns stɔːr/", meaning: "Tienda de la esquina o tiendita de abarrotes abierta muchas horas", example: "You can buy snacks and bottled water at the convenience store across the street." },
  { term: "Counter", pron: "/ˈkaʊn.t̬ɚ/", meaning: "Mostrador de atención al cliente o barra de la cocina", example: "Place the freshly cooked plates onto the service counter for the waiters." },
  { term: "Crosswalk", pron: "/ˈkrɑːs.wɑːk/", meaning: "Paso peatonal con rayas blancas pintadas en el pavimento", example: "Vehicles must yield the right of way to pedestrians in the crosswalk." },
  { term: "Cupboard", pron: "/ˈkʌb.ɚd/", meaning: "Alacena o repisa para guardar tazas, vasos y platos", example: "Grab two ceramic mugs from the cupboard to serve the hot herbal tea." },
  { term: "Curtain", pron: "/ˈkɝː.t̬ən/", meaning: "Cortina de tela en las ventanas para regular la luz del sol", example: "Draw the bedroom curtains to block the morning sunlight while sleeping." },
  { term: "Desk", pron: "/desk/", meaning: "Escritorio de trabajo con espacio para computadora y libreta", example: "Keep your study desk tidy so you can concentrate without distractions." },
  { term: "Doorbell", pron: "/ˈdɔːr.bel/", meaning: "Timbre de la puerta principal para anunciar una visita", example: "The doorbell rang just as the food delivery courier arrived at the gate." },
  { term: "Drawer", pron: "/drɔːr/", meaning: "Cajón del mueble para guardar plumas, llaves o calcetines", example: "You will find extra pens and note pads in the top desk drawer." },
  { term: "Elevator", pron: "/ˈel.ə.veɪ.t̬ɚ/", meaning: "Elevador para subir o bajar pisos en un edificio alto", example: "Take the elevator to the fifth floor where the language lab is located." },
  { term: "Engine", pron: "/ˈen.dʒɪn/", meaning: "Motor del carro, camioneta o avión", example: "A well-maintained engine runs smoothly and delivers great fuel economy." },
  { term: "Faucet", pron: "/ˈfɑː.sɪt/", meaning: "Llave del agua en el lavabo del baño o fregadero de la cocina", example: "Turn off the faucet tightly to avoid wasting clean drinking water." },
  { term: "Fence", pron: "/fens/", meaning: "Cerca de madera o reja perimetral alrededor del jardín", example: "A white picket fence encloses the front flower garden." },
  { term: "Fireplace", pron: "/ˈfaɪr.pleɪs/", meaning: "Chimenea de leña para calentar la sala en días fríos", example: "The whole family gathered around the fireplace to roast marshmallows." },
  { term: "Flashlight", pron: "/ˈflæʃ.laɪt/", meaning: "Linterna de mano con pilas para ver en la oscuridad", example: "Always keep a working flashlight in your home emergency kit." },
  { term: "Fork", pron: "/fɔːrk/", meaning: "Tenedor metálico para comer alimentos sólidos", example: "Set the fork to the left of the dinner plate according to dining etiquette." },
  { term: "Garage", pron: "/ɡəˈrɑːʒ/", meaning: "Cochera techada o taller para guardar el auto", example: "Park the car inside the garage to protect it from hail and strong sun." },
  { term: "Garden", pron: "/ˈɡɑːr.dən/", meaning: "Jardín con pasto verde, plantas y flores aromáticas", example: "Her backyard garden is filled with colorful roses and fragrant mint." },
  { term: "Glass", pron: "/ɡlæs/", meaning: "Vaso de cristal para tomar agua, jugo o refresco", example: "Pour the cold fresh water into a tall glass with ice cubes." },
  { term: "Groceries", pron: "/ˈɡroʊ.sɚ.iz/", meaning: "Mandado o despensa de alimentos comprada en el supermercado", example: "We bought fresh groceries including fruits, vegetables, and milk." },
  { term: "Hallway", pron: "/ˈhɑːl.weɪ/", meaning: "Pasillo interior que conecta las diferentes habitaciones", example: "Follow the brightly lit hallway until you reach room number twenty-four." },
  { term: "Hardware store", pron: "/ˈhɑːrd.wer stɔːr/", meaning: "Ferretería o tlapalería donde venden clavos, pintura y herramientas", example: "Buy screws, nails, and sandpaper at the neighborhood hardware store." },
  { term: "Highway", pron: "/ˈhaɪ.weɪ/", meaning: "Carretera o autopista federal de alta velocidad", example: "The toll highway connects Mexico City with Puebla in under two hours." },
  { term: "Hood", pron: "/hʊd/", meaning: "Cofre del carro que cubre el motor", example: "The mechanic opened the hood to inspect the oil level and coolant." },
  { term: "Hospital", pron: "/ˈhɑː.spɪ.t̬əl/", meaning: "Hospital o clínica médica con servicio de urgencias", example: "The city hospital provides emergency medical care twenty-four hours a day." },
  { term: "Jacket", pron: "/ˈdʒæk.ɪt/", meaning: "Chamarra ligera o abrigadora para protegerse del aire fresco", example: "Zip up your jacket before going out into the cool evening breeze." },
  { term: "Juice", pron: "/dʒuːs/", meaning: "Jugo natural recién exprimido de naranja, toronja o zanahoria", example: "A cold glass of fresh orange juice is packed with natural vitamin C." },
  { term: "Kitchen", pron: "/ˈkɪtʃ.ən/", meaning: "Cocina donde se preparan los guisos y desayunos", example: "The aroma of roasted coffee filled the kitchen early this morning." },
  { term: "Knife", pron: "/naɪf/", meaning: "Cuchillo de cocina con buen filo para picar alimentos", example: "Use a sharp chef's knife to chop the onions and carrots safely." },
  { term: "Laundromat", pron: "/ˈlɑːn.drə.mæt/", meaning: "Lavandería pública con lavadoras y secadoras de monedas", example: "Drop off your heavy comforters at the neighborhood laundromat." },
  { term: "Leek", pron: "/liːk/", meaning: "Poro, verdura aromática alargada para preparar sopas y caldos", example: "Sauté sliced leeks with butter as the aromatic base for potato soup." },
  { term: "Library", pron: "/ˈlaɪ.brer.i/", meaning: "Biblioteca pública con libros para estudiar en silencio", example: "The university library is the ideal place to study without noise." },
  { term: "Living room", pron: "/ˈlɪv.ɪŋ ruːm/", meaning: "Sala de estar de la casa con sillones y televisión", example: "The family gathered in the comfortable living room to watch a movie." },
  { term: "Market", pron: "/ˈmɑːr.kɪt/", meaning: "Mercado municipal o tianguis sobre ruedas con frutas y verduras", example: "Local vendors sell fresh avocados, mangoes, and chilies at the market." },
  { term: "Microwave", pron: "/ˈmaɪ.kroʊ.weɪv/", meaning: "Horno de microondas para calentar comida rápidamente", example: "Heat the leftover soup in the microwave for two minutes on high." },
  { term: "Mirror", pron: "/ˈmɪr.ɚ/", meaning: "Espejo para verse la cara o peinarse en las mañanas", example: "She looked in the bathroom mirror while brushing her hair." },
  { term: "Napkin", pron: "/ˈnæp.kɪn/", meaning: "Servilleta de papel o tela para limpiarse las manos", example: "Place a cloth napkin on your lap before starting to eat dinner." },
  { term: "Neighborhood", pron: "/ˈneɪ.bɚ.hʊd/", meaning: "Colonia, barrio o vecindario donde uno vive", example: "Our quiet residential neighborhood has two public parks and a library." },
  { term: "Notebook", pron: "/ˈnoʊt.bʊk/", meaning: "Cuaderno o libreta de notas para apuntes escolares", example: "Write down newly learned vocabulary words in your dedicated notebook." },
  { term: "Oven", pron: "/ˈʌv.ən/", meaning: "Horno de la estufa para asar carnes o hornear pasteles", example: "Preheat the oven to three hundred and fifty degrees before baking the cake." },
  { term: "Pantry", pron: "/ˈpæn.tri/", meaning: "Alacena o despensa donde se guardan latas, arroz y frijol", example: "Check the kitchen pantry to see if we need more rice and beans." },
  { term: "Park", pron: "/pɑːrk/", meaning: "Parque público con árboles frondosos y área de juegos", example: "Families love to picnic and ride bicycles in the city park on weekends." },
  { term: "Peach", pron: "/piːtʃ/", meaning: "Durazno dulce y aterciopelado con pulpa jugosa", example: "Sweet ripe peaches make a delicious afternoon snack during the summer." },
  { term: "Peanut", pron: "/ˈpiː.nʌt/", meaning: "Cacahuate tostado o con sal y chile para botanear", example: "Pass around a bowl of roasted peanuts for our guests to snack on." },
  { term: "Peas", pron: "/piːz/", meaning: "Chícharos verdes y tiernos para guarniciones de arroz", example: "Toss tender green peas into the warm Mexican rice during cooking." },
  { term: "Pen", pron: "/pen/", meaning: "Pluma de tinta para escribir o firmar documentos oficiales", example: "Use a blue or black pen when signing your official scholarship contract." },
  { term: "Pencil", pron: "/ˈpen.səl/", meaning: "Lápiz de grafito para hacer bocetos o resolver ejercicios", example: "Sharpen your pencil before starting the multiple-choice mathematics test." },
  { term: "Pharmacy", pron: "/ˈfɑːr.mə.si/", meaning: "Farmacia o botica donde se compran medicinas y curitas", example: "The twenty-four-hour pharmacy on the corner is always open for emergencies." },
  { term: "Pillow", pron: "/ˈpɪl.oʊ/", meaning: "Almohada suave para apoyar la cabeza al dormir en la cama", example: "Fluff up your pillow before bed to ensure a comfortable night's rest." },
  { term: "Plate", pron: "/pleɪt/", meaning: "Plato hondo o extendido donde se sirve la comida", example: "Serve the steaming hot enchiladas on a warm ceramic plate." },
  { term: "Porch", pron: "/pɔːrtʃ/", meaning: "Porche techado en la entrada de la casa con mecedoras", example: "Grandfather enjoys reading the morning paper on the front porch." },
  { term: "Potato", pron: "/pəˈteɪ.t̬oʊ/", meaning: "Papa cocida, horneada o frita en tiras", example: "Mashed potatoes seasoned with butter and garlic make a hearty side dish." },
  { term: "Refrigerator", pron: "/rɪˈfrɪdʒ.ə.reɪ.t̬ɚ/", meaning: "Refrigerador o refri para conservar los alimentos frescos", example: "Put the milk and leftover stew inside the refrigerator immediately." },
  { term: "Roof", pron: "/ruːf/", meaning: "Azotea o techo exterior de la casa que resguarda de la lluvia", example: "Solar water heaters installed on the roof help save gas every month." },
  { term: "Saucepan", pron: "/ˈsɑː.spæn/", meaning: "Cacerola u ollita pequeña con mango para calentar leche o salsas", example: "Heat the chocolate milk in a small saucepan over low heat." },
  { term: "Sidewalk", pron: "/ˈsaɪd.wɑːk/", meaning: "Banqueta peatonal al lado del arroyo vehicular en la calle", example: "Always walk on the sidewalk and look both ways before crossing." },
  { term: "Sink", pron: "/sɪŋk/", meaning: "Fregadero de la cocina para lavar trastes o lavabo del baño", example: "Rinse the dishes thoroughly under running water in the kitchen sink." },
  { term: "Skillet", pron: "/ˈskɪl.ɪt/", meaning: "Sartén para freír huevos, calentar tortillas o dorar carne", example: "Heat the seasoned cast-iron skillet before searing the steak." },
  { term: "Spoon", pron: "/spuːn/", meaning: "Cuchara sopera para tomar caldos, sopas o postres", example: "Eat the hot chicken broth using a silver soup spoon." },
  { term: "Stairs", pron: "/sterz/", meaning: "Escaleras para subir al segundo piso de un inmueble", example: "Taking the stairs instead of the elevator provides excellent daily exercise." },
  { term: "Sticker", pron: "/ˈstɪk.ɚ/", meaning: "Estampa o calcomanía adhesiva decorativa", example: "Children love collecting colorful astronaut stickers in their school albums." },
  { term: "Stove", pron: "/stoʊv/", meaning: "Estufa de gas o eléctrica con cuatro quemadores", example: "Turn on the gas burner on the stove to boil water for tea." },
  { term: "Straw", pron: "/strɑː/", meaning: "Popote para tomar aguas frescas, malteadas o refrescos", example: "Sip your cold fruit smoothie through a reusable bamboo straw." },
  { term: "Street", pron: "/striːt/", meaning: "Calle pavimentada de la ciudad por donde transitan los carros", example: "Trees line both sides of the quiet residential street in our neighborhood." },
  { term: "Subway", pron: "/ˈsʌb.weɪ/", meaning: "Metro o tren subterráneo metropolitano de la ciudad", example: "Riding the metro subway is the fastest way to get downtown at rush hour." },
  { term: "Supermarket", pron: "/ˈsuː.pɚˌmɑːr.kɪt/", meaning: "Supermercado con carritos de compra y variedad de productos", example: "We go to the supermarket every Saturday to stock up on essentials." },
  { term: "T-shirt", pron: "/ˈtiː.ʃɝːt/", meaning: "Playera cómoda de algodón y manga corta para uso diario", example: "He wore a clean white cotton t-shirt with blue denim jeans." },
  { term: "Table", pron: "/ˈteɪ.bəl/", meaning: "Mesa del comedor para sentarse a comer en familia", example: "Gather around the dining table because dinner is ready to be served." },
  { term: "Toaster", pron: "/ˈtoʊ.stɚ/", meaning: "Tostador eléctrico de pan para dorar rebanadas", example: "Put two slices of whole wheat bread into the toaster for breakfast." },
  { term: "Tomato", pron: "/təˈmeɪ.t̬oʊ/", meaning: "Jitomate rojo fresco para rebanar o moler en salsas", example: "Blend ripe red tomatoes with garlic and onion to make enchilada salsa." },
  { term: "Towel", pron: "/taʊəl/", meaning: "Toalla suave para secarse las manos o el cuerpo al bañarse", example: "Hang your damp bath towel on the bathroom rack so it dries quickly." },
  { term: "Trunk", pron: "/trʌŋk/", meaning: "Cajuela trasera del carro para guardar maletas y bolsas", example: "Place the heavy grocery bags and suitcases into the car's trunk." },
  { term: "Umbrella", pron: "/ʌmˈbrel.ə/", meaning: "Paraguas para resguardarse de los aguaceros imprevistos", example: "Take a sturdy umbrella with you whenever the sky looks overcast." },
  { term: "Wardrobe", pron: "/ˈwɔːr.droʊb/", meaning: "Ropero de madera para guardar trajes y vestidos formales", example: "Her favorite evening dresses are safely hung inside the wooden wardrobe." },
  { term: "Window", pron: "/ˈwɪn.doʊ/", meaning: "Ventana de cristal que deja entrar luz natural y aire fresco", example: "Open the bedroom window to let in the fresh early morning breeze." },
  { term: "Wristwatch", pron: "/ˈrɪst.wɑːtʃ/", meaning: "Reloj de pulsera para consultar la hora con precisión", example: "He looked down at his wristwatch to ensure he arrived on time for class." }
];

const nounMap = new Map();
BASE_NOUNS.forEach(n => {
  nounMap.set(n.term.toLowerCase(), {
    term: n.term.trim(),
    pron: n.pron,
    meaning: localizeToMexicanSpanish(n.meaning),
    example: n.example,
    category: "Sustantivo"
  });
});

// Incorporar sustantivos de los otros módulos existentes
['business_tech', 'travel_survival', 'toefl_academic'].forEach(modKey => {
  if (existingMaster[modKey] && Array.isArray(existingMaster[modKey].items)) {
    existingMaster[modKey].items.forEach(item => {
      const isCandidateNoun = !item.term.includes(' ') || ['Juicing room', 'Boarding pass', 'Departure lounge', 'Round-trip ticket', 'Customs declaration', 'Security checkpoint'].includes(item.term);
      if (isCandidateNoun && !nounMap.has(item.term.toLowerCase()) && item.category !== 'Verbo' && item.category !== 'Phrasal Verb') {
        nounMap.set(item.term.toLowerCase(), {
          term: item.term.trim(),
          pron: item.pron || item.ipa || "",
          meaning: localizeToMexicanSpanish(item.meaning || item.translation || ""),
          example: item.example || "",
          category: "Sustantivo"
        });
      }
    });
  }
});
const NOUNS = Array.from(nounMap.values()).sort((a, b) =>
  a.term.localeCompare(b.term, 'en', { sensitivity: 'base' })
);

// Merge Adjetivos
const adjMap = new Map();
RAW_ADJECTIVES.forEach(a => {
  adjMap.set(a.term.toLowerCase(), {
    term: a.term.trim(),
    pron: a.pron,
    meaning: localizeToMexicanSpanish(a.meaning),
    example: a.example,
    category: "Adjetivo"
  });
});
if (existingMaster.power_adjectives && Array.isArray(existingMaster.power_adjectives.items)) {
  existingMaster.power_adjectives.items.forEach(a => {
    if (!adjMap.has(a.term.toLowerCase())) {
      adjMap.set(a.term.toLowerCase(), {
        term: a.term.trim(),
        pron: a.pron || a.ipa || "",
        meaning: localizeToMexicanSpanish(a.meaning || a.translation || ""),
        example: a.example || "",
        category: "Adjetivo"
      });
    }
  });
}
const ADJECTIVES = Array.from(adjMap.values()).sort((a, b) =>
  a.term.localeCompare(b.term, 'en', { sensitivity: 'base' })
);

// Merge Idioms
const idiomMap = new Map();
RAW_IDIOMS.forEach(i => {
  idiomMap.set(i.term.toLowerCase(), {
    term: i.term.trim(),
    pron: i.pron,
    meaning: localizeToMexicanSpanish(i.meaning),
    example: i.example,
    category: "Idiom"
  });
});
if (existingMaster.native_idioms && Array.isArray(existingMaster.native_idioms.items)) {
  existingMaster.native_idioms.items.forEach(i => {
    if (!idiomMap.has(i.term.toLowerCase())) {
      idiomMap.set(i.term.toLowerCase(), {
        term: i.term.trim(),
        pron: i.pron || i.ipa || "",
        meaning: localizeToMexicanSpanish(i.meaning || i.translation || ""),
        example: i.example || "",
        category: "Idiom"
      });
    }
  });
}
const IDIOMS = Array.from(idiomMap.values()).sort((a, b) =>
  a.term.localeCompare(b.term, 'en', { sensitivity: 'base' })
);

// Crear Diccionario Global Maestro Unificado
const GLOBAL_CATALOG = [
  ...PHRASAL_VERBS,
  ...NOUNS,
  ...VERBS,
  ...ADJECTIVES,
  ...IDIOMS
].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));

console.log(`====================================================`);
console.log(`RESUMEN CATÁLOGO MAESTRO (LOCALIZADO A MÉXICO):`);
console.log(`- Phrasal Verbs A-Z: ${PHRASAL_VERBS.length}`);
console.log(`- Sustantivos A-Z:   ${NOUNS.length}`);
console.log(`- Verbos A-Z:        ${VERBS.length}`);
console.log(`- Adjetivos A-Z:     ${ADJECTIVES.length}`);
console.log(`- Idioms A-Z:        ${IDIOMS.length}`);
console.log(`TOTAL GENERAL:       ${GLOBAL_CATALOG.length} términos`);
console.log(`====================================================`);

// 4. Actualizar master_data.js
// Actualizamos los módulos en existingMaster:
existingMaster.phrasal_verbs = {
  title: "PHRASAL VERBS / VERBOS COMPUESTOS",
  level: "A1-B2",
  category: "Phrasal Verb",
  badge: "Phrasal Verb",
  total: PHRASAL_VERBS.length,
  items: PHRASAL_VERBS
};
existingMaster.everyday_actions = existingMaster.phrasal_verbs;

existingMaster.difficult_verbs = {
  title: "VERBOS / VERBS",
  level: "A2-B1",
  category: "Verbo",
  badge: "Verbo",
  total: VERBS.length,
  items: VERBS
};
existingMaster.grammar_path = existingMaster.difficult_verbs;

existingMaster.power_adjectives = {
  title: "ADJETIVOS / ADJECTIVES",
  level: "B1-B2",
  category: "Adjetivo",
  badge: "Adjetivo",
  total: ADJECTIVES.length,
  items: ADJECTIVES
};
existingMaster.social_dating = existingMaster.power_adjectives;

existingMaster.native_idioms = {
  title: "MODISMOS Y SLANG / IDIOMS & SLANG",
  level: "B2",
  category: "Idiom",
  badge: "Idiom",
  total: IDIOMS.length,
  items: IDIOMS
};
existingMaster.idioms_slang = existingMaster.native_idioms;
existingMaster.internet_slang = existingMaster.native_idioms;

existingMaster.nouns = {
  title: "SUSTANTIVOS / NOUNS",
  level: "A1-B2",
  category: "Sustantivo",
  badge: "Sustantivo",
  total: NOUNS.length,
  items: NOUNS
};
existingMaster.sustantivos = existingMaster.nouns;

// Localizar otros módulos a español de México
['connectors_linking', 'false_friends', 'collocations', 'business_tech', 'travel_survival', 'toefl_academic'].forEach(modKey => {
  if (existingMaster[modKey] && Array.isArray(existingMaster[modKey].items)) {
    existingMaster[modKey].items.forEach(item => {
      item.meaning = localizeToMexicanSpanish(item.meaning || item.translation || '');
    });
  }
});

// Guardar en master_data.js reconstruyendo la sección window.MASTER_MODULES_DATA
const karaokeIndex = masterDataContent.indexOf('window.KARAOKE_MASTER_DATA =');
const masterDataHeader = `// MASTER_DATA.JS — BASE DE DATOS MAESTRA DE MASTERENG
// EXPANDIDO MASIVAMENTE DE LA A A LA Z SIN LÍMITES ARTIFICIALES
// LOCALIZACIÓN ESTRICTA A ESPAÑOL DE MÉXICO Y AUDIO NATIVO KOKORO TTS

window.MASTER_MODULES_DATA = ${JSON.stringify(existingMaster, null, 2)};

// Glosario Global Unificado Completo para navegación directa por categorías
window.MASTER_GLOBAL_GLOSSARY = ${JSON.stringify(GLOBAL_CATALOG, null, 2)};
window.MASTER_DICTIONARY_ALL = window.MASTER_GLOBAL_GLOSSARY;

// Alias para compatibilidad con código legado
window.MASTER_MODULES_DATA['everyday_actions'] = window.MASTER_MODULES_DATA['phrasal_verbs'];
window.MASTER_MODULES_DATA['connectors'] = window.MASTER_MODULES_DATA['connectors_linking'];
window.MASTER_MODULES_DATA['social_dating'] = window.MASTER_MODULES_DATA['power_adjectives'];
window.MASTER_MODULES_DATA['professional_english'] = window.MASTER_MODULES_DATA['business_tech'];
window.MASTER_MODULES_DATA['idioms_slang'] = window.MASTER_MODULES_DATA['native_idioms'];
window.MASTER_MODULES_DATA['common_confusions'] = window.MASTER_MODULES_DATA['false_friends'];
window.MASTER_MODULES_DATA['collocations_phrases'] = window.MASTER_MODULES_DATA['collocations'];
window.MASTER_MODULES_DATA['grammar_path'] = window.MASTER_MODULES_DATA['difficult_verbs'];
window.MASTER_MODULES_DATA['toefl_simulator'] = window.MASTER_MODULES_DATA['toefl_academic'];
window.MASTER_MODULES_DATA['internet_slang'] = window.MASTER_MODULES_DATA['native_idioms'];
window.MASTER_MODULES_DATA['nouns'] = window.MASTER_MODULES_DATA['nouns'];
window.MASTER_MODULES_DATA['sustantivos'] = window.MASTER_MODULES_DATA['nouns'];

window.VOCAB_ENGINE = (function() {
  function search(query, limit = 50) {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    const results = [];
    (window.MASTER_GLOBAL_GLOSSARY || []).forEach(item => {
      if (
        (item.term && item.term.toLowerCase().includes(q)) ||
        (item.meaning && item.meaning.toLowerCase().includes(q)) ||
        (item.example && item.example.toLowerCase().includes(q))
      ) {
        results.push(item);
      }
    });
    return results.slice(0, limit);
  }

  function getModuleItems(moduleKey) {
    const mod = window.MASTER_MODULES_DATA[moduleKey];
    return (mod && Array.isArray(mod.items)) ? mod.items : [];
  }

  return { search, getModuleItems };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MASTER_MODULES_DATA: window.MASTER_MODULES_DATA, MASTER_GLOBAL_GLOSSARY: window.MASTER_GLOBAL_GLOSSARY, VOCAB_ENGINE: window.VOCAB_ENGINE };
}

`;

const newMasterDataContent = masterDataHeader + masterDataContent.substring(karaokeIndex);
fs.writeFileSync(masterDataPath, newMasterDataContent, 'utf8');
console.log(`[OK] master_data.js actualizado con éxito (${(newMasterDataContent.length / 1024).toFixed(1)} KB)`);

// 5. Actualizar data/dictionary.json
const dictJsonPath = path.join(__dirname, '..', 'data', 'dictionary.json');
const dictJsonData = {
  version: "2.5.0",
  lastUpdated: new Date().toISOString(),
  categories: {
    phrasal_verbs: PHRASAL_VERBS,
    nouns: NOUNS,
    verbs: VERBS,
    adjectives: ADJECTIVES,
    idioms: IDIOMS
  },
  all: GLOBAL_CATALOG,
  modules: existingMaster
};
fs.writeFileSync(dictJsonPath, JSON.stringify(dictJsonData, null, 2), 'utf8');
console.log(`[OK] data/dictionary.json actualizado con éxito (${(fs.statSync(dictJsonPath).size / 1024).toFixed(1)} KB)`);

module.exports = {
  PHRASAL_VERBS,
  VERBS,
  NOUNS,
  ADJECTIVES,
  IDIOMS,
  GLOBAL_CATALOG
};

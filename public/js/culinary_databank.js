/**
 * ============================================================================
 * CULINARY DATABANK & PROFESSIONAL GASTRONOMY BILINGUAL ENGINE
 * ============================================================================
 * Comprehensive, verified bilingual culinary knowledge base with phonetic IPA,
 * vector SVG graphics, French haute cuisine brigade vocabulary, HACCP standards,
 * full interactive recipes, restaurant guest orders, and Web Speech API TTS.
 * 
 * Metrics:
 * - Equipment & Heavy Tools: 100 items
 * - Ingredients & Cold Storage: 170 items
 * - Kitchen Brigade Slang & Techniques: 86 expressions
 * - Complete Professional Recipes: 16 recipes
 * - Customer Orders & Personas: 10 orders
 * ============================================================================
 */

(function(global) {
  'use strict';

  const equipmentAndTools = [
  {
    "id": "chefs_knife",
    "nameEn": "Chef's Knife",
    "nameEs": "Cuchillo de Chef",
    "ipa": "/ʃɛfs naɪf/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "The primary all-purpose culinary blade (8–10 inches) used for chopping, slicing, dicing, and mincing.",
    "definitionEs": "Cuchillo polivalente principal (20-25 cm) indispensable para picar, rebanar, cortar en cubos y desmenuzar.",
    "usageTipsEn": "Grip the heel with thumb and index finger on the blade for maximum balance and control.",
    "usageTipsEs": "Sujeta el talón con el pulgar y el índice sobre la hoja para control y equilibrio óptimos.",
    "audioPrompt": "Chef's Knife, French style or German style all-purpose blade."
  },
  {
    "id": "paring_knife",
    "nameEn": "Paring Knife",
    "nameEs": "Puntilla / Mondador",
    "ipa": "/ˈpɛər.ɪŋ naɪf/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Small blade (3–4 inches) designed for peeling fruits, trimming blemishes, coring, and intricate carving.",
    "definitionEs": "Hoja corta y maniobrable (7-10 cm) para pelar frutas, tornear verduras y retirar imperfecciones.",
    "usageTipsEn": "Use your thumb as a guide against the produce when peeling towards yourself.",
    "usageTipsEs": "Usa el pulgar como tope guía contra el vegetal al pelar hacia ti.",
    "audioPrompt": "Paring Knife, small utility blade for precision trimming and peeling."
  },
  {
    "id": "boning_knife",
    "nameEn": "Boning Knife",
    "nameEs": "Deshuesador",
    "ipa": "/ˈboʊ.nɪŋ naɪf/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Narrow, semi-flexible blade configured to separate raw meat, poultry, and connective tissue from bone.",
    "definitionEs": "Hoja delgada y semi-flexible para desarticular carnes, separar aves y retirar tejido conectivo.",
    "usageTipsEn": "Keep the blade tip angled snugly against bone surfaces to maximize yield and avoid flesh tearing.",
    "usageTipsEs": "Mantén la punta firmemente adherida al hueso para no desgarrar carne ni desperdiciar merma.",
    "audioPrompt": "Boning Knife, narrow flexible blade for butchery and deboning."
  },
  {
    "id": "fillet_knife",
    "nameEn": "Fillet Knife",
    "nameEs": "Fileteador de Pescado",
    "ipa": "/ˈfɪl.ɪt naɪf/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Ultra-flexible, long, thin blade engineered to glide smoothly over delicate fish skin and along spinal bones.",
    "definitionEs": "Hoja larga, delgada y de alta flexibilidad diseñada para deslizarse entre la piel y el espinazo del pescado.",
    "usageTipsEn": "Maintain a flat 15-degree angle against the cutting board to peel off skin in a single clean pass.",
    "usageTipsEs": "Mantén un ángulo plano de 15 grados contra la tabla para retirar la piel de una sola pasada.",
    "audioPrompt": "Fillet Knife, ultra-flexible blade specialized in fish fabrication."
  },
  {
    "id": "bread_knife",
    "nameEn": "Bread Knife / Serrated Knife",
    "nameEs": "Cuchillo de Sierra para Pan",
    "ipa": "/brɛd naɪf/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Long blade with scalloped serrations that bites through crusty loaves without compressing crumb.",
    "definitionEs": "Cuchillo de sierra dentada para rebanar pan crujiente y pasteles delicados sin aplastar la miga.",
    "usageTipsEn": "Saw gently with forward and backward strokes; let the teeth do the cutting without pressing down.",
    "usageTipsEs": "Sierras suavemente hacia adelante y hacia atrás sin ejercer presión vertical.",
    "audioPrompt": "Bread Knife, serrated edge ideal for crusty sourdough and pastries."
  },
  {
    "id": "cleaver",
    "nameEn": "Meat Cleaver",
    "nameEs": "Hachuela de Carnicero",
    "ipa": "/ˈmiːt ˌkliː.vɚ/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Heavy rectangular axe-blade capable of hacking through dense poultry joints, cartilage, and bone.",
    "definitionEs": "Hacha rectangular pesada diseñada para trocear coyunturas duras, cartílago y huesos de ave.",
    "usageTipsEn": "Deliver decisive, perpendicular swings using forearm weight rather than wild wrist flicking.",
    "usageTipsEs": "Aplica golpes secos y perpendiculares con el peso del antebrazo sin girar la muñeca.",
    "audioPrompt": "Meat Cleaver, heavyweight chopper for splitting joints and butchering."
  },
  {
    "id": "santoku_knife",
    "nameEn": "Santoku Knife",
    "nameEs": "Cuchillo Santoku",
    "ipa": "/sænˈtoʊ.kuː naɪf/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Japanese generalist blade with a sheep's foot curve and granton dimples for slicing, dicing, and mincing.",
    "definitionEs": "Cuchillo japonés de tres virtudes con punta caída y alveolos que evitan la adherencia de vegetales.",
    "usageTipsEn": "Utilize an up-and-down push-cut stroke rather than western rocking motion.",
    "usageTipsEs": "Realiza un corte de guillotina vertical empujando hacia adelante en vez del balanceo occidental.",
    "audioPrompt": "Santoku Knife, Japanese three-virtue knife for slicing and dicing."
  },
  {
    "id": "mezzaluna",
    "nameEn": "Mezzaluna",
    "nameEs": "Medialuna / Cuchilla Curva",
    "ipa": "/ˌmɛt.səˈluː.nə/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Crescent-shaped blade with dual handles rocked back and forth to rapidly mince fresh herbs and garlic.",
    "definitionEs": "Hoja en forma de media luna con dos mangos que se mece para picar finamente hierbas y ajos.",
    "usageTipsEn": "Keep fingers wrapped high on handles and rock rhythmical across the wooden cutting board.",
    "usageTipsEs": "Sujeta los pomos superiores firmemente y balancea en vaivén constante sobre la tabla.",
    "audioPrompt": "Mezzaluna, curved double-handled rocker blade for fresh herbs."
  },
  {
    "id": "mandoline_slicer",
    "nameEn": "Mandoline Slicer",
    "nameEs": "Mandolina de Cocina",
    "ipa": "/ˈmæn.də.lɪn ˈslaɪ.sɚ/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Stationary frame with an adjustable blade used for ultra-uniform paper-thin vegetable slices and julienne.",
    "definitionEs": "Dispositivo de corte plano con cuchillas ajustables para rebanadas ultrafinas, chips y julianas perfectas.",
    "usageTipsEn": "MANDATORY: Always use the safety cut-resistant guard or chainmail glove to prevent severe injuries.",
    "usageTipsEs": "OBLIGATORIO: Utiliza siempre el carro protector de seguridad o guante anticorte.",
    "audioPrompt": "Mandoline Slicer, precision cutting instrument for wafer-thin vegetables."
  },
  {
    "id": "honing_steel",
    "nameEn": "Honing Steel",
    "nameEs": "Chaira Estriada",
    "ipa": "/ˈhoʊ.nɪŋ stiːl/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Magnetized grooved rod that realigns microscopic bent knife teeth without removing bulk blade steel.",
    "definitionEs": "Varilla de acero estriado o cerámica que realinea el filo microscópico curvado de la hoja.",
    "usageTipsEn": "Maintain a consistent 20-degree angle from heel to tip in sweeping diagonal passes.",
    "usageTipsEs": "Mantén un ángulo riguroso de 20 grados desde el talón hasta la punta en pasadas suaves.",
    "audioPrompt": "Honing Steel, rod used daily to realign folded knife edges."
  },
  {
    "id": "whetstone",
    "nameEn": "Sharpening Whetstone",
    "nameEs": "Piedra de Afilar al Agua",
    "ipa": "/ˈwɛt.stoʊn/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Dual-grit water stone (typically 1000/6000) used to reshape and polish knife bevels to razor sharpness.",
    "definitionEs": "Bloque abrasivo mineral de doble grano para afilar y asentar el bisel de cuchillos con agua.",
    "usageTipsEn": "Submerge in water for 15 minutes prior to use until air bubbles cease rising.",
    "usageTipsEs": "Sumerge en agua durante 15 minutos antes de su uso hasta que dejen de salir burbujas.",
    "audioPrompt": "Sharpening Whetstone, water stone for grinding new knife bevels."
  },
  {
    "id": "kitchen_shears",
    "nameEn": "Kitchen Shears",
    "nameEs": "Tijeras de Cocina",
    "ipa": "/ˈkɪtʃ.ən ʃɪərz/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Heavy-duty take-apart scissors designed to snip twine, trim fins, and spatchcock whole chickens.",
    "definitionEs": "Tijeras desmontables de acero inoxidable para abrir aves, recortar aletas y cortar cordel.",
    "usageTipsEn": "Disassemble halves completely after raw meat contact for thorough sanitization.",
    "usageTipsEs": "Desmonta las dos hojas por completo al lavar para evitar acumulación bacteriana en el perno.",
    "audioPrompt": "Kitchen Shears, heavy-duty culinary scissors for butchery and prep."
  },
  {
    "id": "y_peeler",
    "nameEn": "Y-Shaped Peeler",
    "nameEs": "Pelador en Y",
    "ipa": "/waɪ ˈpiː.lɚ/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Ergonomic wide-frame peeler with a swiveling carbon blade that strips skin from tubers with minimal waste.",
    "definitionEs": "Pelador ergonómico en forma de horquilla con cuchilla basculante para pelar tubérculos con mínima merma.",
    "usageTipsEn": "Pull with fluid, swift motions away from your body across root vegetables.",
    "usageTipsEs": "Desliza con pasadas fluidas hacia adelante aprovechando el pivoteo de la hoja.",
    "audioPrompt": "Y-Shaped Peeler, ergonomic peeler with swiveling carbon steel blade."
  },
  {
    "id": "microplane_zester",
    "nameEn": "Microplane / Zester",
    "nameEs": "Rallador Zester Microplane",
    "ipa": "/ˈmaɪ.kroʊ.pleɪn/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Photo-etched rasp with miniature surgical teeth for removing citrus zest without bitter white pith.",
    "definitionEs": "Rallador de acero grabado químicamente para extraer ralladura de cítricos sin tocar el albedo amargo.",
    "usageTipsEn": "Hold the rasp teeth-side down over produce so zest collects neatly on top channel.",
    "usageTipsEs": "Coloca el rallador con los dientes hacia abajo sobre el cítrico para controlar lo que rallas.",
    "audioPrompt": "Microplane Zester, surgical-grade rasp for citrus zest, garlic, and parmesan."
  },
  {
    "id": "tourne_knife",
    "nameEn": "Tourné Knife / Bird's Beak",
    "nameEs": "Cuchillo de Tornear / Pico de Loro",
    "ipa": "/tʊərˈneɪ naɪf/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Curved-blade knife tailored for classical French barrel-shaping (tournée) of potatoes and root vegetables.",
    "definitionEs": "Cuchillo de hoja curva hacia adentro para tallar verduras en forma de pequeños barriles de siete caras.",
    "usageTipsEn": "Rotate vegetable against the concave curve to sculpt 7 equal curved facets.",
    "usageTipsEs": "Gira la raíz contra la curva cóncava para tallar 7 facetas uniformes de tamaño idéntico.",
    "audioPrompt": "Tourné Knife, curved bird's beak blade for classical French vegetable turning."
  },
  {
    "id": "carving_knife",
    "nameEn": "Carving Knife & Slicer",
    "nameEs": "Cuchillo Trinchero / Fileteador de Asados",
    "ipa": "/ˈkɑːr.vɪŋ naɪf/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Long, narrow blade used for carving uniform thin slices of roasted prime rib, turkey breast, and ham.",
    "definitionEs": "Cuchillo largo y estilizado para trinchar finas láminas uniformes de carne asada y jamones.",
    "usageTipsEn": "Slice across the muscle grain in single continuous drawing strokes without sawing.",
    "usageTipsEs": "Corta a contrahebra del músculo con un único movimiento continuo de retroceso.",
    "audioPrompt": "Carving Knife, long slender blade for precision roast carving."
  },
  {
    "id": "carving_fork",
    "nameEn": "Carving Fork",
    "nameEs": "Tenedor de Trinchador",
    "ipa": "/ˈkɑːr.vɪŋ fɔːrk/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Two-pronged forged steel fork used to securely anchor large roasts onto carving stations.",
    "definitionEs": "Tenedor de dos púas largas forjadas para inmovilizar piezas grandes de asado durante el corte.",
    "usageTipsEn": "Insert firmly near the bone to steady the roast without puncturing center juices unnecessarily.",
    "usageTipsEs": "Clava cerca de la estructura ósea para estabilizar sin desjugar los centros tiernos.",
    "audioPrompt": "Carving Fork, dual-pronged fork for holding roasts securely."
  },
  {
    "id": "cheese_wire",
    "nameEn": "Cheese Wire / Lyre",
    "nameEs": "Lira Cortadora de Quesos",
    "ipa": "/tʃiːz waɪər/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Taut stainless wire stretched across a frame to slice soft, blooming, and blue cheeses without sticking.",
    "definitionEs": "Alambre de acero tenso en arco para cortar quesos cremosos y azules sin aplastar su textura.",
    "usageTipsEn": "Wipe wire clean with a warm, damp cloth between each slice for razor-clean cheese presentation.",
    "usageTipsEs": "Limpia el alambre con un paño templado entre cortes para bordes impolutos en la tabla de quesos.",
    "audioPrompt": "Cheese Wire, tensioned wire for slicing delicate cheeses cleanly."
  },
  {
    "id": "oyster_knife",
    "nameEn": "Oyster Shucking Knife",
    "nameEs": "Cuchillo Abreostras",
    "ipa": "/ˈɔɪ.stɚ naɪf/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Short, thick, beveled dagger blade with a knuckle guard engineered to pop shell hinges safely.",
    "definitionEs": "Hoja corta, maciza y puntiaguda con guarda protectora diseñada para apalancar bisagras de ostras.",
    "usageTipsEn": "Wrap holding hand in thick towel and work blade tip into the hinge before twisting wrist like turning a key.",
    "usageTipsEs": "Envuelve la mano en un paño grueso e introduce la punta en la bisagra girando como una llave.",
    "audioPrompt": "Oyster Knife, robust short dagger designed for shucking bivalves."
  },
  {
    "id": "clam_knife",
    "nameEn": "Clam Knife",
    "nameEs": "Cuchillo para Almejas",
    "ipa": "/klæm naɪf/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Thin, rounded blade with a blunt tip and single sharp bevel, designed to slip between clam shell halves.",
    "definitionEs": "Cuchillo de hoja delgada con punta roma y filo biselado para separar las valvas de almejas vivas.",
    "usageTipsEn": "Slide along the shell perimeter to sever the adductor muscle cleanly without splintering shell.",
    "usageTipsEs": "Desliza por la hendidura para cortar el músculo abductor sin quebrar fragmentos de concha.",
    "audioPrompt": "Clam Knife, rounded blunt-tipped blade for opening hard-shell clams."
  },
  {
    "id": "deba_knife",
    "nameEn": "Deba Bocho",
    "nameEs": "Cuchillo Deba Japonés",
    "ipa": "/ˈdeɪ.bə ˈboʊ.tʃoʊ/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Heavy, single-bevel Japanese butchery blade designed to sever fish heads and fillet whole sea creatures.",
    "definitionEs": "Cuchillo japonés macizo de bisel único (kataba) para decapitar y despiezar pescados enteros.",
    "usageTipsEn": "Use the heel for splitting fish bone and the forward belly for sliding along backbone ribs.",
    "usageTipsEs": "Usa el talón pesado para quebrar espinas duras y la parte media para filetear.",
    "audioPrompt": "Deba Bocho, traditional Japanese single-bevel fish butchery knife."
  },
  {
    "id": "yanagiba_knife",
    "nameEn": "Yanagiba Sashimi Knife",
    "nameEs": "Cuchillo Yanagiba para Sashimi",
    "ipa": "/jɑː.nɑː.ɡiːˈbɑː/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Ultra-long willow-leaf blade with a single bevel (kataba) that slices raw fish in one smooth pull stroke.",
    "definitionEs": "Cuchillo japonés largo en forma de hoja de sauce para cortar sashimi en un único tirón sin fricción.",
    "usageTipsEn": "Draw from heel to tip in one single motion without sawing to preserve cell structure and glaze.",
    "usageTipsEs": "Tira desde el talón hasta la punta en un solo trazo para no dañar las fibras celulares.",
    "audioPrompt": "Yanagiba, single-bevel willow blade for translucent sashimi slices."
  },
  {
    "id": "nakiri_knife",
    "nameEn": "Nakiri Vegetable Cleaver",
    "nameEs": "Cuchillo Nakiri para Vegetales",
    "ipa": "/nɑːˈkɪər.i/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Double-bevel rectangular Japanese knife designed for clean, parallel push-chopping of vegetables.",
    "definitionEs": "Cuchillo japonés plano y rectangular de doble bisel para picar verduras sin arrastrar ni deshilachar.",
    "usageTipsEn": "The flat edge contacts the board completely, preventing vegetables from hinging on unsevered skins.",
    "usageTipsEs": "Su filo recto toca la tabla en su totalidad, evitando que las verduras queden unidas en acordeón.",
    "audioPrompt": "Nakiri, double-bevel rectangular blade for precise vegetable prep."
  },
  {
    "id": "melon_baller",
    "nameEn": "Melon Baller / Parisienne Scoop",
    "nameEs": "Cucharilla Parisina / Sacabocados",
    "ipa": "/ˈmɛl.ən ˈbɑː.lɚ/",
    "category": "Knives & Blades",
    "categoryEs": "Cuchillería",
    "definitionEn": "Dual hemisphere scoops with sharp drainage edges to carve spheres out of fruits and soft vegetables.",
    "definitionEs": "Herramienta con copa hemisférica afilada para tornear bolitas perfectas de melón, mantequilla o papas.",
    "usageTipsEn": "Press deeply straight into melon flesh before twisting full 360 degrees to extract a perfect orb.",
    "usageTipsEs": "Presiona hacia el fondo de la pulpa antes de rotar 360 grados sobre el eje para esferas perfectas.",
    "audioPrompt": "Melon Baller, Parisienne scoop for carving ornamental spheres."
  },
  {
    "id": "skillet_pan",
    "nameEn": "Skillet / Frying Pan",
    "nameEs": "Sartén Clásica",
    "ipa": "/ˈskɪl.ɪt/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Sloped-sided pan designed for searing, sautéing, frying, and tossing food with quick wrist movement.",
    "definitionEs": "Sartén de bordes inclinados ideal para saltear, freír y voltear ingredientes con juego de muñeca.",
    "usageTipsEn": "Preheat pan dry until oil shimmers to create an instant thermal non-stick crust.",
    "usageTipsEs": "Calienta la sartén seca antes de verter la grasa para crear una barrera térmica antiadherente.",
    "audioPrompt": "Skillet, sloped-side sauté pan for searing and tossing ingredients."
  },
  {
    "id": "cast_iron_skillet",
    "nameEn": "Cast-Iron Skillet",
    "nameEs": "Sartén de Hierro Fundido",
    "ipa": "/kæst ˈaɪ.ɚn ˈskɪl.ɪt/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Heavy carbon-iron pan known for extreme heat retention, even thermal distribution, and natural seasoning.",
    "definitionEs": "Sartén de hierro colado con excelente retención térmica, ideal para sellados profundos y horneado.",
    "usageTipsEn": "Dry thoroughly over flame after hand-washing and rub a micro-thin layer of high-smoke oil.",
    "usageTipsEs": "Seca al fuego tras lavarla a mano y frota una capa milimétrica de aceite para mantener el curado.",
    "audioPrompt": "Cast-Iron Skillet, heavy cookware prized for high-heat steak searing."
  },
  {
    "id": "saute_pan",
    "nameEn": "Sauté Pan / Sauteuse",
    "nameEs": "Sauteuse / Sartén de Bordes Rectos",
    "ipa": "/soʊˈteɪ pæn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Wide pan with straight, vertical sides and a tight lid, built for searing then pan-braising and deglazing.",
    "definitionEs": "Sartén de fondo plano y paredes rectas verticales para sellar carnes y reducir salsas sin salpicaduras.",
    "usageTipsEn": "Vertical walls provide greater bottom surface area and retain liquids during vigorous deglazing.",
    "usageTipsEs": "Sus paredes rectas ofrecen mayor superficie de contacto y contienen fondos durante el desglasado.",
    "audioPrompt": "Sauté Pan, straight-sided pan engineered for shallow braising and pan sauces."
  },
  {
    "id": "saucepan",
    "nameEn": "Saucepan",
    "nameEs": "Cazo / Cacerola",
    "ipa": "/ˈsɔːs.pæn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Deep cylindrical pot with high sides and a long handle, utilized for simmering reductions and grains.",
    "definitionEs": "Recipiente cilíndrico profundo con mango largo para cocinar caldos, reducciones de salsa y granos.",
    "usageTipsEn": "Whisk in figure-eight patterns into corner edges to prevent starch scorching.",
    "usageTipsEs": "Bate en forma de ocho llegando a las esquinas inferiores para evitar que los almidones se agarren.",
    "audioPrompt": "Saucepan, medium deep vessel for making sauces and simmering grains."
  },
  {
    "id": "stockpot",
    "nameEn": "Stockpot / Marmite",
    "nameEs": "Marmita / Olla Caldera",
    "ipa": "/ˈstɑːk.pɑːt/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Tall, deep pot with two looped handles designed to slow-simmer stocks, broths, and pasta water.",
    "definitionEs": "Olla de gran volumen y boca estrecha para hervir pastas y elaborar fondos concentrados a fuego lento.",
    "usageTipsEn": "The tall, narrow shape minimizes evaporation while keeping whole bones and aromatics fully submerged.",
    "usageTipsEs": "Su perfil alto reduce la evaporación excesiva manteniendo huesos y mirepoix sumergidos.",
    "audioPrompt": "Stockpot, large volume pot for long-simmering broths and boiling pasta."
  },
  {
    "id": "dutch_oven",
    "nameEn": "Dutch Oven / Cocotte",
    "nameEs": "Cocotte / Olla Holandesa",
    "ipa": "/dʌtʃ ˈʌv.ən/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Heavy enameled cast-iron pot with a tight-fitting heavy lid, supreme for low-and-slow braises and crusty bread.",
    "definitionEs": "Olla de hierro esmaltado con tapa hermética para estofados lentos, guisos melosos y panadería.",
    "usageTipsEn": "The condensation spikes under the lid continuously self-baste meats throughout long oven cycles.",
    "usageTipsEs": "Los relieves de la tapa condensan el vapor goteando jugos de vuelta sobre la carne de forma continua.",
    "audioPrompt": "Dutch Oven, heavy enameled cocotte for braises, stews, and boules."
  },
  {
    "id": "wok_pan",
    "nameEn": "Carbon Steel Wok",
    "nameEs": "Wok de Acero al Carbono",
    "ipa": "/wɑːk/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Deep concave round-bottom bowl that concentrates scorching heat at base while sides stay cooler.",
    "definitionEs": "Recipiente cóncavo asiático de acero al carbono para salteados relámpago con alta potencia calórica.",
    "usageTipsEn": "Toss constantly over roaring flame to vaporize oil droplets and impart smoky 'Wok Hei' aroma.",
    "usageTipsEs": "Saltea con movimientos rápidos sobre llama viva para vaporizar grasa y lograr el aroma Wok Hei.",
    "audioPrompt": "Wok, bowl-shaped pan used for stir-frying and steaming."
  },
  {
    "id": "roasting_pan",
    "nameEn": "Roasting Pan & V-Rack",
    "nameEs": "Rostiera con Rejilla",
    "ipa": "/ˈroʊ.stɪŋ pæn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Large rectangular metal pan equipped with high sides and a wire rack to roast whole poultry and roasts.",
    "definitionEs": "Bandeja rectangular profunda con rejilla elevada para asar piezas enteras de carne y recolectar jugos.",
    "usageTipsEn": "Add aromatics and water to bottom to prevent dripping fat from smoking, creating instant pan sauce base.",
    "usageTipsEs": "Añade vino o caldo al fondo para que las grasas caídas no humeen y formen la base del jugo de asado.",
    "audioPrompt": "Roasting Pan, heavy-duty pan with rack for festive turkeys and prime ribs."
  },
  {
    "id": "bain_marie",
    "nameEn": "Bain-Marie / Double Boiler",
    "nameEs": "Baño María / Doble Caldera",
    "ipa": "/bæn məˈriː/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Two nested pots with water in the base, gently heating the upper bowl with steam for delicate sauces.",
    "definitionEs": "Sistema de dos recipientes donde el vapor inferior calienta suavemente el superior sin contacto directo.",
    "usageTipsEn": "Never let bottom of the upper bowl touch boiling water; steam alone should transfer heat.",
    "usageTipsEs": "Asegúrate de que la base del cuenco superior no toque el agua hirviendo para no cortar el huevo.",
    "audioPrompt": "Bain-Marie, gentle indirect steam bath for hollandaise and tempered chocolate."
  },
  {
    "id": "crepe_pan",
    "nameEn": "Crepe Pan",
    "nameEs": "Crepera",
    "ipa": "/kreɪp pæn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Flat, low-rimmed pan that allows spatulas to flip thin crêpes, galettes, and tortillas effortlessly.",
    "definitionEs": "Sartén de bordes casi rasos para girar crepes finas y masas delicadas sin romperlas.",
    "usageTipsEn": "Swirl batter immediately after pouring in one fluid tilt of the wrist across the entire surface.",
    "usageTipsEs": "Gira la muñeca en un movimiento circular rápido nada más verter la masa para extenderla fina.",
    "audioPrompt": "Crepe Pan, shallow-rimmed pan for delicate French crêpes."
  },
  {
    "id": "griddle_pan",
    "nameEn": "Griddle / Plancha",
    "nameEs": "Plancha Acanalada / Grill",
    "ipa": "/ˈɡrɪd.əl/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Heavy flat or grooved plate for searing burgers, steaks, and flatbreads while allowing fat to drain.",
    "definitionEs": "Placa metálica pesada lisa o estriada para asar hamburguesas, carnes y verduras marcando líneas.",
    "usageTipsEn": "Do not move proteins until natural grill mark release occurs to ensure crisp caramelization.",
    "usageTipsEs": "No muevas la proteína antes de tiempo; cuando se selle correctamente se despegará sola.",
    "audioPrompt": "Griddle, flat or ridged searing surface for smash burgers and grilled panini."
  },
  {
    "id": "sheet_pan",
    "nameEn": "Half-Sheet Pan",
    "nameEs": "Bandeja de Horno Media Placa",
    "ipa": "/ʃiːt pæn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Heavy 18x13 inch rimmed aluminum pan that delivers reliable roasting, baking, and prep organizing.",
    "definitionEs": "Bandeja de aluminio reforzado con reborde de 45x33 cm para asar vegetales y hornear galletas.",
    "usageTipsEn": "Line with parchment paper or silicone mats to ensure rapid cleanup and prevent sticking.",
    "usageTipsEs": "Fórrala con papel de hornear o tapetes de silicona para desmoldar fácil y proteger el metal.",
    "audioPrompt": "Half-Sheet Pan, standard 18 by 13 inch commercial bakery baking tray."
  },
  {
    "id": "silpat_mat",
    "nameEn": "Silpat Silicone Baking Mat",
    "nameEs": "Tapete de Silicona Silpat",
    "ipa": "/ˈsɪl.pæt/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Fiberglass-reinforced food-grade silicone sheet providing non-stick baking up to 480°F (250°C).",
    "definitionEs": "Lámina antiadherente de silicona y fibra de vidrio para macarons, tuiles y caramelo sin engrasar.",
    "usageTipsEn": "Never cut directly on the mat with sharp knives as it will slice inner woven fiberglass fibers.",
    "usageTipsEs": "Jamás cortes con cuchillos sobre el tapete para no cortar las fibras internas de vidrio.",
    "audioPrompt": "Silpat Mat, reusable non-stick silicone baking liner."
  },
  {
    "id": "springform_pan",
    "nameEn": "Springform Pan",
    "nameEs": "Molde Desmontable de Repostería",
    "ipa": "/ˈsprɪŋ.fɔːrm pæn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Round cake pan with removable base and latching expandable wall for delicate cheesecakes and mousses.",
    "definitionEs": "Molde redondo con aro perimetral desmontable mediante pestillo para desmoldar tartas de queso.",
    "usageTipsEn": "Wrap bottom exterior tightly in triple aluminum foil when baking in water baths to prevent leaks.",
    "usageTipsEs": "Forra el exterior con triple papel aluminio al hornear al baño maría para evitar filtraciones.",
    "audioPrompt": "Springform Pan, detachable wall cake pan for cheesecakes."
  },
  {
    "id": "tart_pan",
    "nameEn": "Tart Pan with Removable Bottom",
    "nameEs": "Molde para Tartas con Fondo Móvil",
    "ipa": "/tɑːrt pæn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Fluted-edge metal pan with a drop-out bottom disc that displays decorative crimped pastry crusts.",
    "definitionEs": "Molde de bordes rizados con base extraíble para presentar quiches y tartas sin dañar la masa quebrada.",
    "usageTipsEn": "Rest finished cooled tart on an inverted can; press the rim down gently to release effortlessly.",
    "usageTipsEs": "Apoya el molde sobre una lata y desliza el anillo hacia abajo para desmoldar con elegancia.",
    "audioPrompt": "Tart Pan, fluted pan with drop-out bottom for quiches and fruit tarts."
  },
  {
    "id": "muffin_tin",
    "nameEn": "Muffin Tin / Cupcake Pan",
    "nameEs": "Molde para Muffins y Magdalenas",
    "ipa": "/ˈmʌf.ɪn tɪn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Multi-cup baking tray with 6 to 12 wells for single-portion muffins, cupcakes, and tartlets.",
    "definitionEs": "Bandeja metálica con cavidades individuales para hornear magdalenas, muffins y soufflés pequeños.",
    "usageTipsEn": "Fill empty cups with two tablespoons of water if baking fewer items to maintain balanced oven heat.",
    "usageTipsEs": "Llena los huecos vacíos con agua si horneas pocas piezas para no descalibrar el calor del molde.",
    "audioPrompt": "Muffin Tin, multi-well tray for baking cupcakes and individual desserts."
  },
  {
    "id": "loaf_pan",
    "nameEn": "Loaf Pan / Terrine Mold",
    "nameEs": "Molde de Pan de Molde / Terrina",
    "ipa": "/loʊf pæn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Deep rectangular vessel utilized for sandwich breads, meatloaves, pâtés, and tea cakes.",
    "definitionEs": "Molde rectangular profundo de paredes altas para panes de molde, queques y patés horneados.",
    "usageTipsEn": "Leave a 2-inch overhang of parchment paper on sides to act as handles for lifting hot bread out.",
    "usageTipsEs": "Deja un sobrante de papel de hornear en los costados para usarlo como asas y desmoldar fácil.",
    "audioPrompt": "Loaf Pan, rectangular tin for sandwich loaves and savory terrines."
  },
  {
    "id": "ramekin",
    "nameEn": "Ceramic Ramekin",
    "nameEs": "Ramequín de Cerámica",
    "ipa": "/ˈræm.ɪ.kɪn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Glazed cylindrical stoneware dish for single-serving soufflés, crème brûlée, and mise-en-place.",
    "definitionEs": "Pocillo cilíndrico de cerámica refractaria para hornear soufflés, crème brûlée y organizar ingredientes.",
    "usageTipsEn": "Brush interior walls vertically with softened butter then coat in sugar for dramatic soufflé rise.",
    "usageTipsEs": "Pinta las paredes hacia arriba con mantequilla pomada y azúcar para guiar el inflado del soufflé.",
    "audioPrompt": "Ceramic Ramekin, heatproof stoneware cup for individual custards and soufflés."
  },
  {
    "id": "bundt_pan",
    "nameEn": "Bundt Pan",
    "nameEs": "Molde Bundt con Chimenea",
    "ipa": "/bʌndt pæn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Ring-shaped fluted cake mold with a hollow central chimney that conducts heat evenly to heavy batters.",
    "definitionEs": "Molde estriado con chimenea central que distribuye el calor al centro de bizcochos densos.",
    "usageTipsEn": "Use melted butter mixed with cocoa or flour applied with pastry brush into every intricate groove.",
    "usageTipsEs": "Aplica con brocha mantequilla derretida mezclada con harina en cada estría para evitar pegaduras.",
    "audioPrompt": "Bundt Pan, fluted ring pan with central heat-conducting chimney."
  },
  {
    "id": "cooling_rack",
    "nameEn": "Wire Cooling Rack",
    "nameEs": "Rejilla Enfriadora",
    "ipa": "/ˈkuː.lɪŋ ræk/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Elevated grid of crisscrossed wires that circulates airflow beneath fresh baked goods to avert sogginess.",
    "definitionEs": "Rejilla elevada de acero para que el aire circule bajo los panes y evitar condensación en la base.",
    "usageTipsEn": "Also place inside sheet pans for oven-roasting bacon so rendering grease drops clear.",
    "usageTipsEs": "Colócala dentro de una placa para asar panceta y lograr que la grasa escurra dejándola crujiente.",
    "audioPrompt": "Cooling Rack, elevated metal wire grid for airflow and crisp bottoms."
  },
  {
    "id": "casserole_dish",
    "nameEn": "Casserole Dish / Baking Dish",
    "nameEs": "Fuente para Gratinar / Cazuela",
    "ipa": "/ˈkæs.ə.roʊl dɪʃ/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Oven-to-table ceramic or glass rectangular baker ideal for lasagnas, gratins, and cobblers.",
    "definitionEs": "Fuente honda refractaria de porcelana o vidrio para lasañas, gratinados y horneados al horno.",
    "usageTipsEn": "Never place a hot ceramic baker directly onto cold granite or water to avoid thermal shock breakage.",
    "usageTipsEs": "Nunca apoyes la fuente hirviendo sobre mármol frío para evitar fracturas por choque térmico.",
    "audioPrompt": "Casserole Dish, deep rectangular baker for creamy lasagnas and gratins."
  },
  {
    "id": "pizza_stone",
    "nameEn": "Pizza Stone / Baking Steel",
    "nameEs": "Piedra o Placa de Acero para Pizza",
    "ipa": "/ˈpiːt.sə stoʊn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Dense cordierite or steel plate that stores immense heat to flash-bake blisters into pizza crusts.",
    "definitionEs": "Plancha refractaria de cordierita o acero que acumula calor para suelas de pizza crujientes.",
    "usageTipsEn": "Preheat inside the oven for a full 45 to 60 minutes at maximum oven temperature before baking.",
    "usageTipsEs": "Precalienta dentro del horno durante 45-60 minutos al máximo antes de introducir la masa.",
    "audioPrompt": "Pizza Stone, porous refractory slab replicating hearth deck oven heat."
  },
  {
    "id": "pasta_pot",
    "nameEn": "Pasta Pot with Strainer Insert",
    "nameEs": "Olla para Pasta con Colador Integrado",
    "ipa": "/ˈpɑː.stə pɑːt/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Large stockpot fitted with a perforated basket allowing cooks to lift pasta out while keeping water boiling.",
    "definitionEs": "Olla con cesta coladora perforada extraíble para retirar la pasta al dente reservando el agua.",
    "usageTipsEn": "Always save 1 cup of starchy pasta water to emulsify silky sauces in the finishing pan.",
    "usageTipsEs": "Conserva siempre una taza de agua de cocción almidonada para ligar la salsa con la pasta.",
    "audioPrompt": "Pasta Pot, stockpot with built-in perforated strainer insert."
  },
  {
    "id": "pressure_cooker",
    "nameEn": "Stovetop Pressure Cooker",
    "nameEs": "Olla a Presión Tradicional",
    "ipa": "/ˈprɛʃ.ɚ ˈkʊk.ɚ/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Hermetically sealed pot that builds steam pressure, raising boiling point to 250°F (121°C) to cook 70% faster.",
    "definitionEs": "Olla hermética que incrementa la presión interna reduciendo los tiempos de cocción hasta un 70%.",
    "usageTipsEn": "Check that the safety release valve and rubber silicone gasket are spotless and supple before locking.",
    "usageTipsEs": "Inspecciona la válvula de seguridad y la junta de goma antes de cerrar para garantizar sellado hermético.",
    "audioPrompt": "Pressure Cooker, sealed vessel cooking tough cuts in a fraction of time."
  },
  {
    "id": "fondue_pot",
    "nameEn": "Fondue Pot / Caquelon",
    "nameEs": "Caquelon / Olla para Fondue",
    "ipa": "/fɑːnˈduː pɑːt/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "Heavy ceramic or cast-iron pot mounted over an adjustable burner for communal melted cheese or chocolate.",
    "definitionEs": "Olla de barro esmaltado o hierro con mechero para mantener quesos fundidos a temperatura ideal.",
    "usageTipsEn": "Rub the raw cut side of a garlic clove all over the interior before pouring in wine and gruyère.",
    "usageTipsEs": "Frota medio diente de ajo por toda la pared interior antes de añadir el vino y los quesos.",
    "audioPrompt": "Fondue Pot, tabletop vessel for communal cheese and broth dipping."
  },
  {
    "id": "tagine_pot",
    "nameEn": "Moroccan Tagine",
    "nameEs": "Tajín Marroquí",
    "ipa": "/təˈʒiːn/",
    "category": "Cookware & Bakeware",
    "categoryEs": "Batería y Panadería",
    "definitionEn": "North African earthenware vessel featuring a cone-shaped lid that returns condensed juices into stew.",
    "definitionEs": "Recipiente de barro con tapa cónica tradicional del Magreb que recircula vapores humectando carnes.",
    "usageTipsEn": "Cook over very low, indirect heat or utilize a metal flame diffuser to protect earthenware from cracking.",
    "usageTipsEs": "Usa un difusor de calor sobre el fuego para evitar que el barro sufra choques de llama directa.",
    "audioPrompt": "Tagine, conical lid earthenware pot for aromatic North African stews."
  },
  {
    "id": "balloon_whisk",
    "nameEn": "Balloon Whisk",
    "nameEs": "Batidor de Globo",
    "ipa": "/bəˈluːn wɪsk/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Pear-shaped looped wire tool engineered to incorporate air into egg whites, heavy cream, and batters.",
    "definitionEs": "Varillas metálicas curvas en forma de pera para emulsionar e incorporar volumen de aire a cremas.",
    "usageTipsEn": "Whisk horizontally side-to-side across the bowl rather than in circles to incorporate air twice as fast.",
    "usageTipsEs": "Bate de lado a lado en vaivén recto en vez de círculos para crear vórtices que airean más rápido.",
    "audioPrompt": "Balloon Whisk, curved multi-wire tool for aerating meringues and cream."
  },
  {
    "id": "french_whisk",
    "nameEn": "French Whisk",
    "nameEs": "Batidor Francés Estrecho",
    "ipa": "/frɛntʃ wɪsk/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Narrow, elongated stiff wire whisk designed for blending thick sauces, pan gravies, and roux.",
    "definitionEs": "Batidor de varillas rígidas y silueta delgada para remover salsas espesas, roux y natillas.",
    "usageTipsEn": "The narrow profile digs straight into bottom pot corners without splattering liquid upward.",
    "usageTipsEs": "Su ángulo estrecho penetra en los rincones de la cacerola evitando que el roux se queme.",
    "audioPrompt": "French Whisk, stiff narrow whisk specialized for velvety pan sauces and roux."
  },
  {
    "id": "silicone_spatula",
    "nameEn": "Silicone Spatula / Marise",
    "nameEs": "Espátula Maryse / Lengua de Silicona",
    "ipa": "/ˈsɪl.ɪ.koʊn ˈspætʃ.ə.lə/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Flexible heat-resistant silicone scraper that clears 100% of batter from bowls and pans.",
    "definitionEs": "Espátula flexible de silicona resistente a 260°C para rebañar boles y doblar merengues con delicadeza.",
    "usageTipsEn": "Cut down through the middle, sweep around the bottom perimeter, and fold gently over top.",
    "usageTipsEs": "Corta por el centro, barre el fondo y pliega sobre sí misma para movimientos envolventes perfectos.",
    "audioPrompt": "Silicone Spatula, heatproof scraper indispensable for clean bowl scraping and folding."
  },
  {
    "id": "fish_spatula",
    "nameEn": "Fish Spatula / Slotted Turner",
    "nameEs": "Espátula para Pescado Ranurada",
    "ipa": "/fɪʃ ˈspætʃ.ə.lə/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Ultra-thin, flexible slotted metal turner with an angled razor edge for slipping under delicate fillets.",
    "definitionEs": "Espátula metálica delgada, flexible y ranurada para deslizarse bajo pescados y freír escurriendo aceite.",
    "usageTipsEn": "Slide the front angled tip beneath the crisp skin while supporting the top with fingers.",
    "usageTipsEs": "Introduce el filo biselado en paralelo a la sartén sosteniendo el filete para que no se parta.",
    "audioPrompt": "Fish Spatula, flexible slotted flipper tailored for fragile proteins."
  },
  {
    "id": "bench_scraper",
    "nameEn": "Bench Scraper / Dough Cutter",
    "nameEs": "Rasqueta de Panadero / Cortador de Masa",
    "ipa": "/bɛntʃ ˈskreɪ.pɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Rectangular stainless blade with a top handle for dividing dough and transferring diced vegetables.",
    "definitionEs": "Hoja rectangular plana con mango para porcionar masas de pan y trasladar verduras picadas.",
    "usageTipsEn": "Never scrape your knife edge across the cutting board; use the bench scraper instead to preserve blades.",
    "usageTipsEs": "Nunca arrastres el filo del cuchillo para recoger alimentos; usa siempre la rasqueta.",
    "audioPrompt": "Bench Scraper, rectangular blade for dough handling and board clearing."
  },
  {
    "id": "culinary_tongs",
    "nameEn": "Locking Spring Tongs",
    "nameEs": "Pinzas de Cocina con Cierre",
    "ipa": "/ˈkʌl.ɪˌnɛr.i tɑːŋz/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Stainless steel spring-loaded tongs with scalloped clasping edges for turning hot proteins and pasta.",
    "definitionEs": "Pinzas de resorte con bloqueo para sujetar, voltear filetes en la parrilla y emplatar tallarines.",
    "usageTipsEn": "Test-click them twice like a true chef before reaching for hot pan items.",
    "usageTipsEs": "Doble 'clic' instintivo en el aire para comprobar el muelle antes de agarrar alimentos calientes.",
    "audioPrompt": "Culinary Tongs, stainless spring-loaded extension of the chef's hands."
  },
  {
    "id": "precision_tweezers",
    "nameEn": "Offset Precision Plating Tweezers",
    "nameEs": "Pinzas de Emplatado de Precisión",
    "ipa": "/prəˈsɪʒ.ən ˈtwiː.zɚz/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Surgical-grade angled tweezers for placing microgreens, edible flowers, and gold leaf onto plates.",
    "definitionEs": "Pinzas largas de punta fina acodada para colocar brotes, flores y guarniciones milimétricas.",
    "usageTipsEn": "Grip near the midpoint to dampen hand micro-tremors when placing delicate botanical garnishes.",
    "usageTipsEs": "Sujeta por el centro para amortiguar el pulso al colocar pétalos delicados en alta cocina.",
    "audioPrompt": "Precision Tweezers, fine-tipped plating tongs for microgreens and garnishes."
  },
  {
    "id": "box_grater",
    "nameEn": "Four-Sided Box Grater",
    "nameEs": "Rallador de Cuatro Caras",
    "ipa": "/bɑːks ˈɡreɪ.tɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Freestanding steel tower providing coarse shredding, fine grating, shaving, and julienne on four faces.",
    "definitionEs": "Rallador de torre con 4 paneles para rallado grueso de queso, fino, hebras y láminas de vegetales.",
    "usageTipsEn": "Freeze blocks of butter for 20 minutes before shredding on the large holes for flakey biscuits.",
    "usageTipsEs": "Congela mantequilla 20 minutos antes de rallarla en los agujeros grandes para hojaldrados perfectos.",
    "audioPrompt": "Box Grater, four-sided grating tower for cheeses and root vegetables."
  },
  {
    "id": "rotary_food_mill",
    "nameEn": "Food Mill / Moulin à Légumes",
    "nameEs": "Pasa-Purés Manual / Molinillo",
    "ipa": "/fuːd mɪl/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Hand-cranked device that mashes soft vegetables through perforated discs while filtering skins and seeds.",
    "definitionEs": "Mecanismo con manivela giratoria que prensa tomates y patatas reteniendo semillas y pieles duras.",
    "usageTipsEn": "The undisputed gold standard for ultra-velvety pomme purée without gumminess from broken starch.",
    "usageTipsEs": "Incomparable para purés de patata sedosos porque no sobre-bate los almidones como la batidora.",
    "audioPrompt": "Food Mill, hand-cranked purée press that screens seeds and peels."
  },
  {
    "id": "potato_ricer",
    "nameEn": "Potato Ricer",
    "nameEs": "Prensa-Patatas de Émbolo",
    "ipa": "/pəˈteɪ.toʊ ˈraɪ.sɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Leveraged piston press that extrudes cooked potatoes into rice-like strands for cloud-light gnocchi.",
    "definitionEs": "Prensa de palanca que extruye tubérculos cocidos en finos filamentos para purés etéreos y ñoquis.",
    "usageTipsEn": "Rice potatoes while steaming hot so steam escapes, preventing excess moisture absorption.",
    "usageTipsEs": "Prensa las patatas recién salidas de la olla humeando para que evaporen agua y no absorban exceso.",
    "audioPrompt": "Potato Ricer, lever press for lump-free mashed potatoes and light gnocchi dough."
  },
  {
    "id": "spider_strainer",
    "nameEn": "Spider Skimmer / Wire Strainer",
    "nameEs": "Espumadera de Alambre de Araña",
    "ipa": "/ˈspaɪ.dɚ ˈskɪm.ɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Wide open-basket woven brass or steel mesh tool on a long handle for fishing food from deep oil and broth.",
    "definitionEs": "Cesta de alambre tejido en telaraña con mango largo para rescatar alimentos de frituras y caldos.",
    "usageTipsEn": "Open wire mesh allows boiling oil or broth to drain instantly without disturbing delicate fried coatings.",
    "usageTipsEs": "Su trenzado abierto deja caer el aceite en un segundo sin abollar los rebozados crujientes.",
    "audioPrompt": "Spider Skimmer, open wire mesh basket for frying and blanching."
  },
  {
    "id": "conical_chinois",
    "nameEn": "Chinois / Conical Sieve",
    "nameEs": "Chino / Colador Cónico Fino",
    "ipa": "/ʃɪnˈwɑː/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Steep conical fine-mesh strainer utilized to clarify consommé, velouté, and velvety smooth sauces.",
    "definitionEs": "Colador cónico metálico de malla tupida para colar fondos, caldos y salsas de alta gastronomía.",
    "usageTipsEn": "Use a small conical pestle or ladle bottom in circles to press liquid through without forcing grit.",
    "usageTipsEs": "Pasa una mano de mortero cónica en círculos para exprimir los jugos sin desgarrar impurezas.",
    "audioPrompt": "Chinois, conical fine-mesh sieve for silk-smooth sauce refinement."
  },
  {
    "id": "colander",
    "nameEn": "Footed Colander",
    "nameEs": "Escurridor de Pie con Asas",
    "ipa": "/ˈkɑː.lən.dɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Perforated metal bowl with base ring and side handles used for draining pasta, greens, and beans.",
    "definitionEs": "Recipiente perforado con patas y asas laterales para escurrir pasta y lavar verduras en el fregadero.",
    "usageTipsEn": "Elevated ring base keeps drained pasta well above draining water in the sink basin.",
    "usageTipsEs": "Su base elevada mantiene los alimentos por encima de los residuos que caen al desagüe.",
    "audioPrompt": "Footed Colander, perforated basin for draining pasta and washing produce."
  },
  {
    "id": "pastry_brush",
    "nameEn": "Silicone & Bristle Pastry Brush",
    "nameEs": "Brocha de Repostería",
    "ipa": "/ˈpeɪ.stri brʌʃ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Bristle brush designed for glazing pastries with egg wash, buttering hot molds, and basting roasts.",
    "definitionEs": "Pincel de cerdas naturales o silicona para barnizar masas con huevo y bañar carnes con adobo.",
    "usageTipsEn": "Natural boar bristle provides superior liquid retention for delicate laminated croissants.",
    "usageTipsEs": "Las cerdas naturales absorben más yate para dorar la masa hojaldrada sin dejar vetas disparejas.",
    "audioPrompt": "Pastry Brush, applicator for egg washes, melted butter, and marinades."
  },
  {
    "id": "piping_bag",
    "nameEn": "Piping Bag & Nozzle Set",
    "nameEs": "Manga Pastelera con Boquillas",
    "ipa": "/ˈpaɪ.pɪŋ bæɡ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Cone-shaped fabric or plastic pouch fitted with metal tips to extrude frosting, churros, and purees.",
    "definitionEs": "Bolsa cónica con boquillas metálicas intercambiables para decorar tartas y dosificar masas.",
    "usageTipsEn": "Fold the top collar over your hand when filling with spatula to keep outer bag immaculate.",
    "usageTipsEs": "Dobla la boca de la manga hacia afuera sobre tu mano al cargar crema para no manchar el exterior.",
    "audioPrompt": "Piping Bag, pastry cone with interchangeable tips for precise piping."
  },
  {
    "id": "instant_read_thermometer",
    "nameEn": "Digital Instant-Read Thermometer",
    "nameEs": "Termómetro Digital de Lectura Instantánea",
    "ipa": "/ˈɪn.stənt riːd θɚˈmɑː.mə.t̬ɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Fast digital probe displaying internal core temperature within 2 seconds with decimal precision.",
    "definitionEs": "Sonda digital de aguja que registra la temperatura interna de carnes en 2 segundos.",
    "usageTipsEn": "Insert into deepest center of the meat muscle, making sure tip does not touch bone or fat pockets.",
    "usageTipsEs": "Inserta en el corazón del músculo cuidando que la punta no toque hueso ni bolsas de grasa.",
    "audioPrompt": "Digital Instant-Read Thermometer, precision probe for meat internal temperature."
  },
  {
    "id": "candy_thermometer",
    "nameEn": "Candy & Deep-Fry Thermometer",
    "nameEs": "Termómetro para Azúcar y Fritura",
    "ipa": "/ˈkæn.di θɚˈmɑː.mə.t̬ɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Metal-shielded thermometer with pan clip reading temperatures from 100°F to 500°F (40°C to 260°C).",
    "definitionEs": "Termómetro con clip de sujeción para medir almíbares de azúcar y aceite de fritura profunda.",
    "usageTipsEn": "Clip bulb so it is submerged 2 inches without resting on hot pan metal base.",
    "usageTipsEs": "Engancha el clip para que el bulbo flote en el líquido sin tocar el fondo de metal ardiente.",
    "audioPrompt": "Candy Thermometer, high-temp clipped gauge for caramel stages and frying oil."
  },
  {
    "id": "mortar_pestle",
    "nameEn": "Granite Mortar and Pestle / Molcajete",
    "nameEs": "Mortero de Granito / Molcajete",
    "ipa": "/ˈmɔːr.tɚ ənd ˈpɛs.əl/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Heavy stone bowl and club used to crush whole spices, pesto pastes, and aromatics releasing volatile oils.",
    "definitionEs": "Cuenco y mazo de piedra volcánica o granito para triturar especias y emulsionar salsas como el pesto.",
    "usageTipsEn": "Use a grinding, shearing twist rather than brute downward pounding to crush cellular walls.",
    "usageTipsEs": "Gira la mano en movimientos de cizalla circular contra las paredes en vez de golpear a lo bruto.",
    "audioPrompt": "Mortar and Pestle, heavy stone tools for crushing spices and making pastes."
  },
  {
    "id": "salad_spinner",
    "nameEn": "Salad Spinner",
    "nameEs": "Centrifugadora de Ensalada",
    "ipa": "/ˈsæl.əd ˈspɪn.ɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Centrifugal crank basket that spins washed greens bone-dry so vinaigrettes adhere without diluting.",
    "definitionEs": "Cesta perforada con manivela centrífuga para secar hojas verdes y que el aliño no resbale.",
    "usageTipsEn": "Dry leaves thoroughly; residual water creates a barrier that prevents oil and dressing from coating.",
    "usageTipsEs": "Seca las hojas a fondo; el agua residual repele las vinagretas aguando la textura.",
    "audioPrompt": "Salad Spinner, centrifugal drying basket for crisp leafy greens."
  },
  {
    "id": "citrus_press",
    "nameEn": "Cast Aluminum Citrus Squeezer",
    "nameEs": "Exprimidor Manual de Palanca para Cítricos",
    "ipa": "/ˈsɪt.rəs skwiː.zɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Hinged press that turns halved lemons and limes inside-out, extracting seed-free fresh juice.",
    "definitionEs": "Prensa articulada que invierte mitades de limón extrayendo el zumo sin semillas ni amargor de cáscara.",
    "usageTipsEn": "Place halved fruit cut-side down facing the drainage holes, not against the pushing dome.",
    "usageTipsEs": "Coloca la fruta con la cara cortada hacia abajo mirando los orificios para que expulse el jugo.",
    "audioPrompt": "Citrus Squeezer, hinged lever press for lemons and limes."
  },
  {
    "id": "garlic_press",
    "nameEn": "Garlic Press",
    "nameEs": "Prensa de Ajos",
    "ipa": "/ˈɡɑːr.lɪk prɛs/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Hand tool that crushes garlic cloves through fine perforated grid for immediate aromatic dispersion.",
    "definitionEs": "Utensilio de palanca que machaca dientes de ajo a través de una rejilla para salsas y marinadas.",
    "usageTipsEn": "Unpeeled cloves can be inserted directly; skins will remain behind in the chamber.",
    "usageTipsEs": "Puedes introducir dientes enteros con su piel fina; la piel quedará atrapada en el émbolo.",
    "audioPrompt": "Garlic Press, chamber press that extrudes garlic paste without chopping."
  },
  {
    "id": "kitchen_blowtorch",
    "nameEn": "Culinary Butane Torch",
    "nameEs": "Soplete de Cocina de Butano",
    "ipa": "/ˈbjoʊ.teɪn tɔːrtʃ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "High-intensity butane flame generator utilized to caramelize sugar crusts and blister peppers.",
    "definitionEs": "Antorcha de llama regulable de alta temperatura para caramelizar el azúcar de la crème brûlée.",
    "usageTipsEn": "Keep flame in constant circular motion 3 inches away to avoid burning black bitter spots.",
    "usageTipsEs": "Mueve la llama en círculos constantes a 7 cm de distancia para un dorado ámbar parejo.",
    "audioPrompt": "Culinary Torch, concentrated butane flame for crème brûlée and charring."
  },
  {
    "id": "fat_separator",
    "nameEn": "Gravy & Fat Separator Pitcher",
    "nameEs": "Jarra Desgrasadora con Pico Inferior",
    "ipa": "/fæt ˈsɛp.əˌreɪ.t̬ɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Pouring pitcher with a bottom-fed spout allowing flavorful stock to pour out beneath rising fat layer.",
    "definitionEs": "Jarra dosificadora con conducto inferior que vierte el caldo limpio reteniendo la grasa en superficie.",
    "usageTipsEn": "Let hot broth rest for 5 minutes so oil buoyant rise forms a distinct upper layer before pouring.",
    "usageTipsEs": "Deja reposar el caldo 5 minutos para que la grasa flote antes de verter el jugo magro.",
    "audioPrompt": "Fat Separator, bottom-spout pitcher decanting lean sauces from buoyant grease."
  },
  {
    "id": "cream_whipper",
    "nameEn": "Culinary Siphon / Cream Whipper",
    "nameEs": "Sifón de Cocina para Espumas y N2O",
    "ipa": "/kriːm ˈwɪp.ɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Pressurized canister charged with nitrous oxide (N2O) cartridges to create instant airy culinary foams.",
    "definitionEs": "Recipiente presurizado con cápsulas de N2O para elaborar espumas calientes, cremas montadas y aires.",
    "usageTipsEn": "Strain every puree through a fine chinois before charging to prevent nozzle clogging.",
    "usageTipsEs": "Cuela cualquier puré por un chino fino antes de llenar el sifón para no obstruir la válvula.",
    "audioPrompt": "Cream Whipper, pressurized nitrous siphon for molecular gastronomy foams."
  },
  {
    "id": "rolling_pin",
    "nameEn": "French Tapered Rolling Pin",
    "nameEs": "Rodillo Francés Cónico sin Asas",
    "ipa": "/ˈroʊ.lɪŋ pɪn/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Solid hardwood dowel with tapered ends that pivots easily under the palms to roll round dough circles.",
    "definitionEs": "Rodillo de madera maciza sin mangos que pivota bajo las palmas para estirar masas circulares.",
    "usageTipsEn": "Roll outward from center and rotate dough 45 degrees between each stroke for uniform thickness.",
    "usageTipsEs": "Rueda del centro hacia afuera girando la masa un cuarto de vuelta para espesor homogéneo.",
    "audioPrompt": "French Rolling Pin, tapered wooden dowel providing tactile feedback on dough."
  },
  {
    "id": "pastry_blender",
    "nameEn": "Pastry Cutter / Dough Blender",
    "nameEs": "Cortador de Pastelería para Mantequilla",
    "ipa": "/ˈpeɪ.stri ˈblɛn.dɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Tool with parallel curved steel blades on a handle used to cut cold butter into flour for flaky pastry.",
    "definitionEs": "Utensilio con cuchillas de arco paralelas para integrar mantequilla fría en harina sin derretirla.",
    "usageTipsEn": "Rock and press down until butter forms pea-sized gravel crumbs coated in flour.",
    "usageTipsEs": "Presiona hacia abajo meciendo hasta que la grasa forme granos del tamaño de arvejas.",
    "audioPrompt": "Pastry Blender, curved parallel blades cutting cold fat into flour."
  },
  {
    "id": "apple_corer",
    "nameEn": "Apple Corer",
    "nameEs": "Descorazonador de Manzanas",
    "ipa": "/ˈæp.əl ˈkɔːr.ɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Cylindrical stainless tube with serrated teeth that plunges through apples to excise core and seeds.",
    "definitionEs": "Tubo de acero afilado con borde dentado para perforar y extraer el corazón leñoso de frutas.",
    "usageTipsEn": "Align with the stem and push straight through with gentle twisting down to cutting board.",
    "usageTipsEs": "Alinea con el tallo y presiona girando levemente hacia abajo hasta atravesar la fruta.",
    "audioPrompt": "Apple Corer, serrated tube cutting whole fruit cores in one plunge."
  },
  {
    "id": "rotary_peeler",
    "nameEn": "Julienne Peeler",
    "nameEs": "Pelador para Juliana / Spaghetti Vegetal",
    "ipa": "/ˌdʒuː.liˈɛn ˈpiː.lɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Peeler fitted with serrated teeth that slices carrots and zucchini into matchstick noodles instantaneously.",
    "definitionEs": "Pelador con dientes de sierra transversales que corta verduras en finos fideos de juliana al vuelo.",
    "usageTipsEn": "Rest the vegetable flat on a cutting board and drag peeler toward you with steady downforce.",
    "usageTipsEs": "Apoya la zanahoria plana sobre la tabla y arrastra el pelador hacia ti con presión constante.",
    "audioPrompt": "Julienne Peeler, toothed blade cutting vegetables into matchsticks."
  },
  {
    "id": "basting_bulb",
    "nameEn": "Basting Bulb / Turkey Baster",
    "nameEs": "Pera para Hilvanar Asados",
    "ipa": "/ˈbeɪ.stɪŋ bʌlb/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Heatproof tube with a suction rubber bulb used to draw hot roasting pan juices and bathe poultry skin.",
    "definitionEs": "Tubo térmico con fuelle de goma para succionar jugos calientes del fondo y humectar aves en el horno.",
    "usageTipsEn": "Squeeze bulb prior to insertion, submerge tip in pan drippings, then slowly release suction.",
    "usageTipsEs": "Aprieta la pera antes de sumergirla en la grasa y suelta poco a poco para aspirar el jugo.",
    "audioPrompt": "Basting Bulb, suction pipette for recycling pan drippings over roasting meats."
  },
  {
    "id": "can_opener",
    "nameEn": "Heavy-Duty Manual Can Opener",
    "nameEs": "Abrelatas Manual de Manivela",
    "ipa": "/kæn ˈoʊ.pən.ɚ/",
    "category": "Hand Tools & Gadgets",
    "categoryEs": "Utensilios y Gadgets",
    "definitionEn": "Geared cutting wheel that clamps and rolls around metal can edges without leaving jagged burrs.",
    "definitionEs": "Abrelatas de engranajes que cercena el borde metálico de latas de conservas con corte limpio.",
    "usageTipsEn": "Turn the butterfly knob smoothly without forcing to prevent metal slivers from falling into food.",
    "usageTipsEs": "Gira la manivela con ritmo constante para evitar que se desprendan rebabas metálicas.",
    "audioPrompt": "Can Opener, geared mechanical tool cleanly unsealing preserved goods."
  },
  {
    "id": "stand_mixer",
    "nameEn": "Commercial Stand Mixer",
    "nameEs": "Batidora de Pedestal / Amasadora",
    "ipa": "/stænd ˈmɪk.sɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Planetary gear electric mixer with interchangeable flat paddle, wire whip, and dough spiral attachments.",
    "definitionEs": "Aparato de movimiento planetario con accesorios intercambiables para amasar, batir y montar cremas.",
    "usageTipsEn": "Never exceed speed 2 when kneading dense bread doughs to protect internal brass motor gears.",
    "usageTipsEs": "Nunca superes la velocidad 2 al amasar masas de pan para no quemar los engranajes del motor.",
    "audioPrompt": "Commercial Stand Mixer, planetary mixer for heavy doughs and batters."
  },
  {
    "id": "food_processor",
    "nameEn": "Food Processor / Robot-Coupe",
    "nameEs": "Procesador de Alimentos / Robot de Cocina",
    "ipa": "/fuːd ˈprɑː.sɛs.ɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Motorized bowl fitted with an S-shaped chopping blade and slicing discs for rapid shredding and emulsions.",
    "definitionEs": "Aparato con cuchillas en S giratorias a alta velocidad para triturar, emulsionar y rallar en segundos.",
    "usageTipsEn": "Pulse in short 1-second bursts when chopping nuts or vegetables to prevent turning ingredients into paste.",
    "usageTipsEs": "Usa toques cortos de 'pulse' para picar verduras sin convertirlas en papilla aguada.",
    "audioPrompt": "Food Processor, motorized S-blade machine for fast chopping and emulsions."
  },
  {
    "id": "immersion_blender",
    "nameEn": "Immersion Blender / Stick Blender",
    "nameEs": "Batidora de Inmersión / Turmix",
    "ipa": "/ɪˈmɝː.ʃən ˈblɛn.dɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Handheld motorized stick with a hooded blade, puréeing soups and emulsifying mayonnaise directly in the pot.",
    "definitionEs": "Batidora de brazo metálico con cuchilla encapsulada para triturar cremas y sopas directamente en la olla.",
    "usageTipsEn": "Keep blade head completely submerged below liquid level before engaging power to prevent scorching splatters.",
    "usageTipsEs": "Mantén la campana sumergida en el fondo antes de pulsar el botón para no salpicar caldo caliente.",
    "audioPrompt": "Immersion Blender, handheld stick blender for directly puréeing hot soups in pot."
  },
  {
    "id": "high_speed_blender",
    "nameEn": "High-Speed Vortex Blender (Vitamix)",
    "nameEs": "Batidora de Vaso de Alta Potencia",
    "ipa": "/ˈhaɪ spiːd ˈblɛn.dɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "2-horsepower motor that spins hardened blades over 20,000 RPM, pulverizing seeds for mirror-gloss purees.",
    "definitionEs": "Vaso de alta velocidad que licúa semillas y fibras celulares logrando texturas de terciopelo sedoso.",
    "usageTipsEn": "Start on lowest speed 1 to establish the vortex, then ramp up to high speed 10 within 3 seconds.",
    "usageTipsEs": "Empieza en velocidad mínima para formar el remolino y sube al máximo en 3 segundos.",
    "audioPrompt": "High-Speed Blender, heavy-duty vortex blender pulverizing cellular textures."
  },
  {
    "id": "sous_vide_circulator",
    "nameEn": "Sous-Vide Immersion Circulator",
    "nameEs": "Circulador de Inmersión Sous-Vide (Roner)",
    "ipa": "/suːˈviːd sɝː.kjəˌleɪ.t̬ɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Heating and pump rod that circulates water at exact temperatures with 0.1°C precision for vacuum cooking.",
    "definitionEs": "Dispositivo con resistencia y bomba que mantiene el baño de agua a temperatura constante milimétrica.",
    "usageTipsEn": "Ensure vacuum pouch is completely submerged and unobstructed from circulation impeller jets.",
    "usageTipsEs": "Comprueba que la bolsa al vacío esté bien sumergida y no tape las hélices de circulación de agua.",
    "audioPrompt": "Sous-Vide Immersion Circulator, precision thermal water pump for vacuum cooking."
  },
  {
    "id": "chamber_vacuum_sealer",
    "nameEn": "Chamber Vacuum Sealer",
    "nameEs": "Empacadora al Vacío de Campana",
    "ipa": "/ˈtʃeɪm.bɚ ˈvæk.juːm ˈsiː.lɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Enclosed vacuum machine that evacuates air from the entire chamber, sealing liquid broths without boiling over.",
    "definitionEs": "Máquina profesional con campana hermética que permite envasar sopas y marinadas líquidas al 99.9% de vacío.",
    "usageTipsEn": "Chill stocks down to 38°F (3°C) before sealing; warm liquids boil violently under low chamber pressure.",
    "usageTipsEs": "Enfría bien los caldos antes de envasar; los líquidos tibios hierven en frío desbordando la bolsa.",
    "audioPrompt": "Chamber Vacuum Sealer, commercial vacuum packaging chamber for liquids and proteins."
  },
  {
    "id": "meat_slicer",
    "nameEn": "Gravity Commercial Meat Slicer",
    "nameEs": "Cortadora de Fiambres por Gravedad",
    "ipa": "/miːt ˈslaɪ.sɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Motorized angled circular blade that shaves prosciutto, roast beef, and mortadella to translucent thinness.",
    "definitionEs": "Máquina con disco giratorio afilado y carro deslizante para cortar embutidos en lonchas milimétricas.",
    "usageTipsEn": "Set blade thickness gauge strictly to zero '0' immediately after completing every slicing task.",
    "usageTipsEs": "Regresa la perilla de grosor a '0' nada más terminar para que el filo quede protegido y seguro.",
    "audioPrompt": "Commercial Meat Slicer, motorized spinning disc slicing charcuterie wafer-thin."
  },
  {
    "id": "meat_grinder",
    "nameEn": "Electric Meat Grinder",
    "nameEs": "Picadora de Carne Eléctrica",
    "ipa": "/miːt ˈɡraɪn.dɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Heavy auger feeding meat chunks against a rotating star knife and extrusion plate for burgers and sausages.",
    "definitionEs": "Picadora mecánica de tornillo sin fin con cuchilla en cruz para moler carne fresca y embutir salchichas.",
    "usageTipsEn": "Chill meat, fatback, and all metal grinder parts in freezer for 30 minutes before grinding to prevent smearing.",
    "usageTipsEs": "Congela piezas de carne y partes metálicas 30 minutos antes para que la grasa no se funda en pasta.",
    "audioPrompt": "Meat Grinder, motorized auger and cross-blade system for fresh sausage and mince."
  },
  {
    "id": "pasta_machine",
    "nameEn": "Pasta Sheeter & Cutter (Atlas)",
    "nameEs": "Máquina de Pasta Manual o Eléctrica",
    "ipa": "/ˈpɑː.stə məˈʃiːn/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Adjustable parallel steel rollers that compress dough into thin sheets and slice into tagliatelle.",
    "definitionEs": "Rodillos paralelos de acero para laminar masa fresca y cortarla en tagliolini o fetuccini.",
    "usageTipsEn": "Laminate dough by folding in thirds and rolling through wide settings 4 times to develop gluten structure.",
    "usageTipsEs": "Pliega la masa en tres y pásala por el grosor más ancho 4 veces para desarrollar tensión y elasticidad.",
    "audioPrompt": "Pasta Machine, calibrated rollers laminating sheets for ravioli and ribbons."
  },
  {
    "id": "ice_cream_maker",
    "nameEn": "Compressor Ice Cream Maker",
    "nameEs": "Heladera con Compresor Auto-Refrigerante",
    "ipa": "/aɪs kriːm ˈmeɪ.kɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Self-freezing churner that freezes cream bases while paddling to limit ice crystal size for silky gelato.",
    "definitionEs": "Máquina con motor de frío incorporado que congela y bate la crema evitando cristales de hielo grandes.",
    "usageTipsEn": "Chill your custard base overnight to 35°F (2°C) prior to churning for shortest freeze and microscopic crystals.",
    "usageTipsEs": "Madura la base de crema en nevera toda la noche para cristales diminutos y textura de heladería.",
    "audioPrompt": "Ice Cream Maker, compressor freezer churning velvety gelatos and sorbets."
  },
  {
    "id": "combi_oven",
    "nameEn": "Commercial Combi-Steam Oven",
    "nameEs": "Horno Mixto Convector a Vapor",
    "ipa": "/ˈkɑːm.bi ˈʌv.ən/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Professional kitchen oven that combines convection heat with precise steam injections for optimal roast crusts.",
    "definitionEs": "Horno profesional que combina aire forzado y vapor controlado para asados jugosos y corteza de pan crujiente.",
    "usageTipsEn": "Steam inject at start of sourdough cycle to gelatinize starch and delay crust hardening for massive oven spring.",
    "usageTipsEs": "Inyecta vapor al inicio del horneado de pan para gelificar la corteza y permitir máxima expansión.",
    "audioPrompt": "Combi Oven, commercial oven blending convection heat with live steam."
  },
  {
    "id": "salamander_broiler",
    "nameEn": "Overhead Salamander Broiler",
    "nameEs": "Salamandra de Cocina / Gratinador",
    "ipa": "/ˈsæl.əˌmæn.dɚ ˈbrɔɪ.lɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Open-front overhead radiant broiler producing intense direct top heat to melt cheese and caramelize glazes.",
    "definitionEs": "Aparato de calor superior radiante de alta potencia para gratinar quesos y dorar salsas al pase.",
    "usageTipsEn": "Adjust the height platform so food sits 2 inches from heating elements for flash gratin without burning.",
    "usageTipsEs": "Ajusta la altura del plato a 5 cm de la resistencia para fundir queso rápidamente antes del servicio.",
    "audioPrompt": "Salamander Broiler, intense top radiant heat source for finishing gratins."
  },
  {
    "id": "deep_fryer",
    "nameEn": "Commercial Dual-Well Deep Fryer",
    "nameEs": "Freidora Profesional de Dos Cubas",
    "ipa": "/diːp ˈfraɪ.ɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Thermostatically controlled deep vat of cooking oil with a sediment cold zone beneath heating elements.",
    "definitionEs": "Freidora industrial con cubas de aceite controladas por termostato y zona fría decantadora de impurezas.",
    "usageTipsEn": "Never overload the fry basket; drop food in batches to prevent oil temperature plunging and greasy results.",
    "usageTipsEs": "No satures la cesta; freír en tandas pequeñas mantiene el aceite caliente y el rebozado seco y crujiente.",
    "audioPrompt": "Commercial Deep Fryer, high-capacity temperature-controlled frying vat."
  },
  {
    "id": "blast_chiller",
    "nameEn": "Blast Chiller & Shock Freezer",
    "nameEs": "Abatidor de Temperatura Rápido",
    "ipa": "/blæst ˈtʃɪl.ɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Rapid refrigeration chamber pulling hot food from 160°F down to 38°F (70°C to 3°C) in under 90 minutes.",
    "definitionEs": "Cámara de frío por aire forzado que baja la temperatura de alimentos calientes a 3°C en menos de 90 minutos.",
    "usageTipsEn": "Essential for food safety regulations to traverse bacterial danger zones (40°F–140°F / 4°C–60°C) safely.",
    "usageTipsEs": "Clave para la seguridad alimentaria al cruzar la zona de riesgo bacteriano en tiempo récord sin mermas.",
    "audioPrompt": "Blast Chiller, rapid-chilling chamber locking in freshness and meeting HACCP standards."
  },
  {
    "id": "induction_cooktop",
    "nameEn": "Commercial Induction Cooktop",
    "nameEs": "Placa de Inducción Profesional",
    "ipa": "/ɪnˈdʌk.ʃən ˈkʊk.tɑːp/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Electromagnetic stove that excites ferrous molecules inside pans directly, wasting zero ambient heat.",
    "definitionEs": "Placa electromagnética que calienta directamente el fondo metálico de la sartén con máxima eficiencia.",
    "usageTipsEn": "Only use pots with magnetic ferrous bases (cast iron, carbon steel, or induction-ready stainless).",
    "usageTipsEs": "Usa recipientes con fondo ferromagnético para que el campo electromagnético transmita el calor.",
    "audioPrompt": "Induction Cooktop, electromagnetic precision burner with instant response."
  },
  {
    "id": "dehydrator",
    "nameEn": "Electric Food Dehydrator",
    "nameEs": "Deshidratador de Alimentos con Bandejas",
    "ipa": "/diːˈhaɪ.dreɪ.t̬ɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Cabinet with temperature-controlled fan blowing low warmth (95°F–165°F) over trays to remove water content.",
    "definitionEs": "Armario ventilado con calor controlado a baja temperatura para deshidratar frutas, hongos y polvos.",
    "usageTipsEn": "Slice produce into uniform 1/8-inch slices so all pieces on a single tray dry simultaneously.",
    "usageTipsEs": "Corta los vegetales en láminas idénticas de 3 mm para que se sequen al mismo ritmo.",
    "audioPrompt": "Food Dehydrator, fan-circulated warm cabinet making fruit leathers and jerky."
  },
  {
    "id": "waffle_maker",
    "nameEn": "Commercial Belgian Waffle Iron",
    "nameEs": "Gofrera Belga Giratoria",
    "ipa": "/ˈwɑː.fəl ˈmeɪ.kɚ/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Heavy dual-sided cast iron rotating plates with deep grid pockets that bake crisp yeast-risen waffles.",
    "definitionEs": "Placas pesadas de hierro fundido con celdas profundas que giran 180° para distribuir la masa de gofres.",
    "usageTipsEn": "Flip iron 180 degrees immediately upon closing to force batter into top grid grooves by gravity.",
    "usageTipsEs": "Gira la plancha 180 grados en cuanto cierres para que la masa fluya a todas las hendiduras.",
    "audioPrompt": "Belgian Waffle Iron, rotating deep-pocket iron for airy waffles."
  },
  {
    "id": "grain_mill",
    "nameEn": "Electric Grain Mill / Flour Grinder",
    "nameEs": "Molino Eléctrico de Granos y Harinas",
    "ipa": "/ɡreɪn mɪl/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Stone or ceramic burr mill that grinds whole wheat berries and ancient grains into ultra-fresh flour.",
    "definitionEs": "Molino de muelas de piedra para moler trigo, centeno y cereales enteros en harina fresca al momento.",
    "usageTipsEn": "Freshly milled flour retains living wheat germ oils; use within 48 hours or store in freezer.",
    "usageTipsEs": "La harina recién molida conserva el germen vivo y sus aceites; úsala rápido o congela.",
    "audioPrompt": "Grain Mill, stone burr mill grinding whole grain berries into fragrant artisan flour."
  },
  {
    "id": "microwave_oven",
    "nameEn": "Commercial Microwave Oven",
    "nameEs": "Horno Microondas Profesional",
    "ipa": "/ˈmaɪ.kroʊ.weɪv ˈʌv.ən/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "High-wattage cavity emitting electromagnetic waves that vibrate water molecules for rapid melting and par-cooking.",
    "definitionEs": "Horno electromagnético de alta potencia para derretir chocolates, atemperar mantequilla y calentar bases.",
    "usageTipsEn": "Cover liquids with damp paper towel to prevent steam drying and contain splatter.",
    "usageTipsEs": "Cubre con papel absorbente húmedo para mantener la humedad y evitar salpicaduras internas.",
    "audioPrompt": "Commercial Microwave, high-wattage speed cooker for melting and fast defrosting."
  },
  {
    "id": "panini_press",
    "nameEn": "Commercial Panini Press & Contact Grill",
    "nameEs": "Prensa para Paninis y Grill de Contacto",
    "ipa": "/pəˈniː.ni prɛs/",
    "category": "Heavy Appliances & Machinery",
    "categoryEs": "Maquinaria y Electrodomésticos",
    "definitionEn": "Spring-counterbalanced heavy cast-iron dual heating plates that crush and toast sandwiches under high heat.",
    "definitionEs": "Prensa de doble placa caliente con bisagra autoajustable para tostar bocadillos y derretir rellenos.",
    "usageTipsEn": "Brush outside of bread with clarified butter or olive oil for golden, crackling crunch.",
    "usageTipsEs": "Pinta el exterior del pan con mantequilla clarificada o aceite para un dorado dorado y crujiente.",
    "audioPrompt": "Panini Press, heavy-weight contact grill toasting stuffed sandwiches."
  }
];

  const ingredients = [
  {
    "id": "beef_tenderloin",
    "nameEn": "Beef Tenderloin / Filet Mignon",
    "nameEs": "Filete de res / Solomillo",
    "ipa": "/biːf ˈtɛndərˌlɔɪn/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "The most tender muscle (psoas major); virtually no connective tissue, lean with delicate flavor. Best served rare to medium-rare.",
    "culinaryNotesEs": "El corte más suave de la res; casi sin tejido conectivo, magro y de sabor delicado. Se disfruta mejor término medio o rojo.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M9 10c1-1 3-1 4 0s2 3 4 2\"/></svg>",
    "audioPrompt": "Beef tenderloin. Unmatched tenderness from the non-weight-bearing psoas muscle."
  },
  {
    "id": "ribeye_steak",
    "nameEn": "Ribeye Steak (Entrecôte)",
    "nameEs": "Ribeye / Ojo de bife",
    "ipa": "/ˈrɪb.aɪ steɪk/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Cut from the beef rib primal. Abundantly marbled with intramuscular fat, yielding intense beefy richness and juiciness under high heat.",
    "culinaryNotesEs": "Corte del costillar con abundante marmoleo intramuscular; la grasa fundida aporta jugosidad y sabor profundo a la brasa.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><ellipse cx=\"12\" cy=\"12\" rx=\"9\" ry=\"6\"/><circle cx=\"10\" cy=\"12\" r=\"2\"/></svg>",
    "audioPrompt": "Ribeye steak. Intramuscularly marbled cut delivering premier beef flavor."
  },
  {
    "id": "sirloin_steak",
    "nameEn": "Sirloin Steak / Striploin",
    "nameEs": "Sirloin / New York Strip",
    "ipa": "/ˈsɜːrlɔɪn steɪk/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "A versatile, robust cut with a firm texture and pronounced beefy savoriness, bordered by a strip of flavorful outer fat.",
    "culinaryNotesEs": "Corte noble y firme con borde exterior de grasa que carameliza a la perfección en la plancha o parrilla.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 8c2-2 14-2 16 0s1 10-2 11-12 0-14-3 0-8 0-8z\"/></svg>",
    "audioPrompt": "Sirloin steak. Firm texture with a savory exterior fat ribbon."
  },
  {
    "id": "ground_beef",
    "nameEn": "Ground Beef (80/20 Chuck Blend)",
    "nameEs": "Carne molida de res (80/20)",
    "ipa": "/ɡraʊnd biːf/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "The optimal 80% lean to 20% fat ratio for smash burgers, meatballs, and Bolognese sauce without becoming dry.",
    "culinaryNotesEs": "Equilibrio ideal de 80% carne magra y 20% grasa para hamburguesas jugosas y albóndigas sedosas.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"8\" cy=\"9\" r=\"2\"/><circle cx=\"14\" cy=\"8\" r=\"2\"/><circle cx=\"11\" cy=\"14\" r=\"2\"/><circle cx=\"16\" cy=\"15\" r=\"2\"/></svg>",
    "audioPrompt": "Ground beef. Eighty-twenty chuck ratio for juicy burgers and rich ragùs."
  },
  {
    "id": "pork_chop",
    "nameEn": "Bone-in Pork Chop (Côte de Porc)",
    "nameEs": "Chuleta de cerdo con hueso",
    "ipa": "/pɔːrk tʃɒp/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Cut perpendicular to the spine, containing a rib bone and tender loin eye. Cook to 63°C (145°F) with a slight blush of pink.",
    "culinaryNotesEs": "Corte del lomo con costilla; cocínala hasta 63°C para mantener el centro tierno con un sutil tono rosado.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"14\" cy=\"9\" r=\"6\"/><line x1=\"8\" y1=\"15\" x2=\"3\" y2=\"20\"/></svg>",
    "audioPrompt": "Bone-in pork chop. Tender loin medallion with bone-insulation for moisture retention."
  },
  {
    "id": "pork_belly",
    "nameEn": "Fresh Pork Belly",
    "nameEs": "Panceta de cerdo / Pork Belly",
    "ipa": "/pɔːrk ˈbɛli/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Layers of succulent fat and meat from the underside of the hog. Perfect for long braises followed by blistering high-heat skin crackling.",
    "culinaryNotesEs": "Capas alternadas de carne y grasa; perfecta para cocciones lentas al vacío o confitado que culminan en piel crujiente.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\"/><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"/><line x1=\"3\" y1=\"14\" x2=\"21\" y2=\"14\"/></svg>",
    "audioPrompt": "Pork belly. Decadent striated cut for melt-in-the-mouth braises and crackling chicharrones."
  },
  {
    "id": "smoked_bacon",
    "nameEn": "Thick-Cut Smoked Bacon",
    "nameEs": "Tocino ahumado grueso",
    "ipa": "/sməʊkt ˈbeɪkən/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "1°C - 4°C (34°F - 39°F)",
    "culinaryNotesEn": "Cured and hardwood-smoked pork belly strips. Render slowly to release savory cooking drippings for sauces and lardons.",
    "culinaryNotesEs": "Tiras de panceta curada y ahumada; cocínalo a fuego lento para extraer su grasa y preparar 'lardons' crujientes.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 8c4-2 6 2 9 0s5-2 9 0M3 16c4-2 6 2 9 0s5-2 9 0\"/></svg>",
    "audioPrompt": "Smoked bacon. Hardwood-cured lardons providing smokiness and rendered fat bases."
  },
  {
    "id": "lamb_rack",
    "nameEn": "Frenched Rack of Lamb",
    "nameEs": "Costillar de cordero francés (Frenched Rack)",
    "ipa": "/ræk ɒv læm/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "An eight-rib prime cut with the rib bones scraped clean of meat and fat ('Frenched') for refined fine-dining presentation.",
    "culinaryNotesEs": "Corte de ocho costillas con los huesos pulidos y limpios de grasa, ideal para asar con costra de hierbas y mostaza.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 14h16v6H4z\"/><line x1=\"6\" y1=\"14\" x2=\"6\" y2=\"4\"/><line x1=\"10\" y1=\"14\" x2=\"10\" y2=\"4\"/><line x1=\"14\" y1=\"14\" x2=\"14\" y2=\"4\"/><line x1=\"18\" y1=\"14\" x2=\"18\" y2=\"4\"/></svg>",
    "audioPrompt": "Rack of lamb. Frenched eight-rib roast for delicate herb-crusted carving."
  },
  {
    "id": "chicken_breast",
    "nameEn": "Boneless Skinless Chicken Breast",
    "nameEs": "Pechuga de pollo sin hueso",
    "ipa": "/ˈtʃɪk.ɪn brɛst/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Lean white meat requiring careful moisture control. Cook to an internal temp of 74°C (165°F) or sous-vide at 63°C (145°F) for tenderness.",
    "culinaryNotesEs": "Carne blanca magra; cocínala con cuidado para no secarla o salmuera previamente para retener humedad.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 12c1-6 8-8 13-5s4 9-2 11-12 0-11-6z\"/></svg>",
    "audioPrompt": "Chicken breast. Versatile lean poultry requiring moisture management."
  },
  {
    "id": "chicken_thigh",
    "nameEn": "Bone-in Chicken Thighs",
    "nameEs": "Muslos de pollo con piel",
    "ipa": "/ˈtʃɪk.ɪn θaɪ/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Dark poultry meat rich in collagen and connective tissue; remains succulent throughout long braises, roasts, and stews.",
    "culinaryNotesEs": "Carne oscura rica en mioglobina y colágeno; resiste cocciones prolongadas permaneciendo jugosa y llena de sabor.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><ellipse cx=\"14\" cy=\"10\" rx=\"7\" ry=\"5\"/><path d=\"M8 13l-5 6\"/></svg>",
    "audioPrompt": "Chicken thighs. Collagen-rich dark meat built for braises and crispy skin pan-roasts."
  },
  {
    "id": "duck_breast",
    "nameEn": "Duck Breast (Magret de Canard)",
    "nameEs": "Magret de pato",
    "ipa": "/dʌk brɛst/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Rich, red poultry breast meat capped with a thick fat layer. Score diamond patterns in the skin and render slowly in a cold pan to medium-rare.",
    "culinaryNotesEs": "Pechuga de pato de carne roja con gruesa capa de grasa; se marca en rombos y se cocina en sartén fría para derretir la grasa.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><ellipse cx=\"13\" cy=\"12\" rx=\"8\" ry=\"5\"/><line x1=\"9\" y1=\"9\" x2=\"17\" y2=\"15\"/><line x1=\"9\" y1=\"15\" x2=\"17\" y2=\"9\"/></svg>",
    "audioPrompt": "Duck breast. Red poultry meat rendered from cold pan for crispy skin and rosy core."
  },
  {
    "id": "beef_short_ribs",
    "nameEn": "Bone-in Beef Short Ribs",
    "nameEs": "Costillas cortas de res (Short Ribs)",
    "ipa": "/biːf ʃɔːrt rɪbz/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Intensely marbled cut packed with tough collagen that transforms into gelatin over 3 to 4 hours of low-and-slow wine braising.",
    "culinaryNotesEs": "Corte con denso tejido conectivo que se funde en gelatina untuosa tras 3 a 4 horas de braseado lento con vino tinto.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"4\" y=\"6\" width=\"16\" height=\"12\" rx=\"1\"/><line x1=\"8\" y1=\"6\" x2=\"8\" y2=\"18\"/><line x1=\"12\" y1=\"6\" x2=\"12\" y2=\"18\"/><line x1=\"16\" y1=\"6\" x2=\"16\" y2=\"18\"/></svg>",
    "audioPrompt": "Beef short ribs. Collagen-dense bone-in cuts for luxurious gelatinous braises."
  },
  {
    "id": "veal_shank_ossobuco",
    "nameEn": "Veal Shank (Osso Buco)",
    "nameEs": "Osobuco de ternera",
    "ipa": "/viːl ʃæŋk/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Cross-cut veal shank containing a marrow-filled central bone, traditionally braised with white wine, tomatoes, and finished with gremolata.",
    "culinaryNotesEs": "Rodaja de jarrete de ternera con su hueso central y tuétano mantecoso, clásico de la cocina milanesa con gremolata.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>",
    "audioPrompt": "Veal shank. Marrow-centered braising classic yielding luxurious natural body."
  },
  {
    "id": "pork_tenderloin",
    "nameEn": "Pork Tenderloin",
    "nameEs": "Solomillo de cerdo",
    "ipa": "/pɔːrk ˈtɛndərˌlɔɪn/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "A delicate, cylindrical lean muscle that cooks in minutes. Trim away the silvery tendon (silverskin) before roasting or pan-searing.",
    "culinaryNotesEs": "Músculo cilíndrico magro y tierno que se cocina con rapidez; retira siempre la membrana plateada antes de saltear.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 13c3-3 14-3 18 0s-3 3-9 3-8-1-9-3z\"/></svg>",
    "audioPrompt": "Pork tenderloin. Fast-cooking lean tender cylinder requiring silverskin removal."
  },
  {
    "id": "prosciutto_di_parma",
    "nameEn": "Prosciutto di Parma (Aged Dry-Cured Ham)",
    "nameEs": "Jamón serrano / Prosciutto di Parma",
    "ipa": "/prəˈʃuːtoʊ/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "2°C - 5°C (35°F - 41°F)",
    "culinaryNotesEn": "Italian air-dried ham cured exclusively with sea salt for 14 to 36 months, featuring sweet nutty nuance and translucent ribbons.",
    "culinaryNotesEs": "Jamón curado al aire con sal marina durante más de un año; de textura sedosa y notas dulces que se funden al paladar.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 14c3-6 12-6 16 0s-4 6-8 6-6-2-8-6z\"/></svg>",
    "audioPrompt": "Prosciutto di Parma. Delicately cured ham shaved into whisper-thin ribbons."
  },
  {
    "id": "spanish_chorizo",
    "nameEn": "Cured Spanish Chorizo",
    "nameEs": "Chorizo español curado",
    "ipa": "/tʃəˈriːzoʊ/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "2°C - 5°C (35°F - 41°F)",
    "culinaryNotesEn": "Coarsely ground pork sausage seasoned with smoky pimentón (Spanish paprika) and garlic, air-cured to slice firm without cooking.",
    "culinaryNotesEs": "Embutido de cerdo picado y adobado con pimentón de la Vera ahumado y ajo, curado para rebanar directamente en tapas.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 12c2-4 14-4 16 0s-2 4-8 4-6-1-8-4z\"/><circle cx=\"8\" cy=\"12\" r=\"1\"/><circle cx=\"16\" cy=\"12\" r=\"1\"/></svg>",
    "audioPrompt": "Spanish chorizo. Paprika-rich cured sausage infusing oils with crimson smokiness."
  },
  {
    "id": "quail_whole",
    "nameEn": "Semi-Boneless Whole Quail",
    "nameEs": "Codorniz entera semideshuesada",
    "ipa": "/kweɪl/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Delicate game bird with lean, sweet dark meat. Best quick-roasted or pan-seared with butter and thyme in 8 to 10 minutes.",
    "culinaryNotesEs": "Ave de caza pequeña de carne tierna y sabor ligeramente dulce; se asa en sartén con mantequilla en menos de 10 minutos.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><ellipse cx=\"12\" cy=\"13\" rx=\"7\" ry=\"5\"/><path d=\"M16 8l3-3m-3 3c0-3-3-4-5-4\"/></svg>",
    "audioPrompt": "Whole quail. Delicate game fowl for high-heat rapid butter basting."
  },
  {
    "id": "lamb_shank",
    "nameEn": "Lamb Shank",
    "nameEs": "Jarrete de cordero / Chamorro",
    "ipa": "/læm ʃæŋk/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Lower section of the leg loaded with connective tissue and bone marrow, yielding fall-off-the-bone tenderness in braised red wine gravies.",
    "culinaryNotesEs": "Porción inferior de la pierna rica en tendones que se desprende sola del hueso tras un estofado prolongado con romero.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"15\" cy=\"9\" r=\"5\"/><line x1=\"11\" y1=\"13\" x2=\"4\" y2=\"20\"/></svg>",
    "audioPrompt": "Lamb shank. Tough collagen leg cut that surrenders to velvety braised tenderness."
  },
  {
    "id": "flank_steak",
    "nameEn": "Beef Flank Steak (Bavette)",
    "nameEs": "Falda de res / Arrachera",
    "ipa": "/flæŋk steɪk/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "A flat abdominal cut with distinct longitudinal grain. Must be marinated, flash-seared, and sliced thinly across the grain to be tender.",
    "culinaryNotesEs": "Corte plano de grano marcado; debe marinarse, sellarse rápido y cortarse siempre a contrahilo en láminas delgadas.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 9c3-2 15-2 18 0s-2 7-6 8-10 0-12-3z\"/><line x1=\"6\" y1=\"11\" x2=\"18\" y2=\"11\"/></svg>",
    "audioPrompt": "Flank steak. Distinct directional grain cut requiring across-the-grain slicing."
  },
  {
    "id": "turkey_breast",
    "nameEn": "Boneless Turkey Breast",
    "nameEs": "Pechuga de pavo sin hueso",
    "ipa": "/ˈtɜːrki brɛst/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Large lean white poultry muscle ideal for brining and slow-roasting or slicing thin for cold deli platters.",
    "culinaryNotesEs": "Pieza magra y voluminosa ideal para salmueras aromáticas y asado suave con mantequilla clarificada.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 14c2-7 10-8 15-5s3 8-1 10-12 1-14-5z\"/></svg>",
    "audioPrompt": "Turkey breast. Substantial lean bird cut benefiting from aromatic brine saturation."
  },
  {
    "id": "pork_ribs_baby_back",
    "nameEn": "Baby Back Pork Ribs",
    "nameEs": "Costillas de cerdo Baby Back",
    "ipa": "/ˈbeɪbi bæk rɪbz/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Taken from the top of the rib cage near the spine. Lean and tender with curvature. Remove the membrane (pleura) before smoking.",
    "culinaryNotesEs": "Costillitas tiernas del lomo; retira la membrana del envés antes de ahumar o hornear con salsa barbecue.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 6c2 4 16 4 18 0M3 12c2 4 16 4 18 0M3 18c2 4 16 4 18 0\"/></svg>",
    "audioPrompt": "Baby back ribs. Upper loin ribs requiring back membrane peeling before dry rub."
  },
  {
    "id": "beef_brisket",
    "nameEn": "Whole Packer Beef Brisket",
    "nameEs": "Pecho de res / Brisket",
    "ipa": "/biːf ˈbrɪskɪt/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Comprising the lean 'flat' and fatty 'point' pectoral muscles. Requires 12+ hours of slow wood smoking to tenderize collagen.",
    "culinaryNotesEs": "Corte del pecho compuesto por el 'flat' magro y el 'point' graso; requiere 12 horas de ahumado para derretir el colágeno.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 10c2-3 14-3 18 0s-2 8-8 8-9-3-10-8z\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"17\"/></svg>",
    "audioPrompt": "Beef brisket. Dual-muscle pectoral cut transformed by overnight low-temp smoking."
  },
  {
    "id": "pancetta",
    "nameEn": "Italian Rolled Pancetta",
    "nameEs": "Panceta curada italiana (Pancetta)",
    "ipa": "/pænˈtʃɛtə/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "2°C - 5°C (35°F - 41°F)",
    "culinaryNotesEn": "Pork belly cured with peppercorns, juniper, and nutmeg, then rolled tightly into a cylinder. The authentic backbone for carbonara and all'Amatriciana.",
    "culinaryNotesEs": "Panceta enrollada y curada con pimienta negra, enebro y nuez moscada; base fundamental de la carbonara y salsas italianas.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/></svg>",
    "audioPrompt": "Italian pancetta. Peppercorn-cured rolled belly imparting savory richness to pasta."
  },
  {
    "id": "guanciale",
    "nameEn": "Cured Pork Jowl (Guanciale)",
    "nameEs": "Guanciale / Papada de cerdo curada",
    "ipa": "/ɡwɑːnˈtʃɑːleɪ/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "2°C - 5°C (35°F - 41°F)",
    "culinaryNotesEn": "Cured pork jowl boasting delicate, silky fat and distinct herb flavor. Releases exquisite rendered grease vital for Roman pasta classics.",
    "culinaryNotesEs": "Papada de cerdo curada con sal y pimienta; su grasa sedosa se funde aportando la autenticidad culinaria de Roma.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M5 8c3-2 11-2 14 0s1 10-3 11-9 1-11-2-1-8 0-9z\"/></svg>",
    "audioPrompt": "Guanciale. Cured pork cheek yielding unparalleled silky fat for authentic Roman pasta."
  },
  {
    "id": "beef_marrow_bones",
    "nameEn": "Canoe-Cut Beef Marrow Bones",
    "nameEs": "Huesos con tuétano en corte canoa",
    "ipa": "/biːf ˈmæroʊ/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Carnes",
    "category": "proteins_butchery",
    "categoryEs": "Carnes y Aves",
    "storageTemp": "0°C - 2°C (32°F - 36°F)",
    "culinaryNotesEn": "Femur bones split lengthwise to expose the rich, buttery marrow. Roasted at high heat and served with sea salt and parsley salad.",
    "culinaryNotesEs": "Huesos de fémur partidos a lo largo para asar a fuego alto y untar el tuétano cremoso sobre pan rústico.",
    "allergens": [],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 10h16v4H4z\"/><circle cx=\"7\" cy=\"12\" r=\"1.5\"/><circle cx=\"17\" cy=\"12\" r=\"1.5\"/></svg>",
    "audioPrompt": "Beef marrow bones. Split femur bones providing roasted culinary butter."
  },
  {
    "id": "salmon_fillet",
    "nameEn": "Atlantic Salmon Fillet (Skin-on)",
    "nameEs": "Filete de salmón del Atlántico con piel",
    "ipa": "/ˈsæmən ˈfɪlɪt/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F on flaked ice)",
    "culinaryNotesEn": "Rich in omega-3 oils with vibrant orange-pink flesh. Crisp the skin in a hot pan while basting flesh gently to medium (50°C / 122°F).",
    "culinaryNotesEs": "Rico en grasas saludables; seca bien la piel para dorarla crujiente en sartén y mantén el centro jugoso a término medio.",
    "allergens": [
      "Fish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M2 12c4-5 12-5 18 0-6 5-14 5-18 0z\"/><circle cx=\"16\" cy=\"11\" r=\"1\"/></svg>",
    "audioPrompt": "Salmon fillet. Fatty anadromous fish prized for crispy skin pan-roasting."
  },
  {
    "id": "chilean_sea_bass",
    "nameEn": "Chilean Sea Bass (Patagonian Toothfish)",
    "nameEs": "Róbalo chileno / Merluza negra",
    "ipa": "/ˈtʃɪliən siː bæs/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F on flaked ice)",
    "culinaryNotesEn": "Pristine white fish with large, tender flakes and high lipid content that resists drying even under intense caramelizing sears.",
    "culinaryNotesEs": "Pescado blanco de las profundidades antárticas con láminas carnosas y alto contenido de aceite natural que jamás se reseca.",
    "allergens": [
      "Fish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 13c4-4 13-4 18 0-5 4-14 4-18 0z\"/><path d=\"M19 11l3-3v8l-3-3\"/></svg>",
    "audioPrompt": "Chilean sea bass. Rich, pearly white flakes with buttery mouthfeel."
  },
  {
    "id": "yellowfin_tuna_loin",
    "nameEn": "Yellowfin Tuna Loin (Sashimi Grade)",
    "nameEs": "Lomo de atún aleta amarilla (Grado Sashimi)",
    "ipa": "/ˈtuːnə lɔɪn/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F)",
    "culinaryNotesEn": "Ruby-red dense meat resembling tender steak. Flash-sear for 30 seconds per side leaving the interior cool and ruby-rare.",
    "culinaryNotesEs": "Carne roja densa como un filete; sella 30 segundos por lado a fuego vivo manteniendo el corazón crudo y fresco.",
    "allergens": [
      "Fish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M2 12c5-6 15-6 19 0-4 6-14 6-19 0z\"/><path d=\"M21 12l2-4-1 4 1 4-2-4z\"/></svg>",
    "audioPrompt": "Yellowfin tuna loin. Ruby-red steak-like fish engineered for flash searing."
  },
  {
    "id": "atlantic_cod",
    "nameEn": "Atlantic Cod Loin",
    "nameEs": "Lomo de bacalao del Atlántico",
    "ipa": "/kɒd lɔɪn/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F on ice)",
    "culinaryNotesEn": "Mild, clean-flavored white fish that breaks into clean, translucent geometric flakes. The gold standard for fish and chips and poaching.",
    "culinaryNotesEs": "Pescado blanco de sabor suave que se separa en lajas translúcidas; clásico para rebozados y cocción en caldos cortos.",
    "allergens": [
      "Fish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 12c4-3 12-3 17 0-5 3-13 3-17 0z\"/><circle cx=\"16\" cy=\"11.5\" r=\"0.8\"/></svg>",
    "audioPrompt": "Atlantic cod. Clean, mild white fish producing thick translucent flakes."
  },
  {
    "id": "jumbo_shrimp",
    "nameEn": "Jumbo Black Tiger Shrimp (U-12)",
    "nameEs": "Camarones tigre gigantes (U-12)",
    "ipa": "/ˈdʒʌmboʊ ʃrɪmp/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F on ice)",
    "culinaryNotesEn": "Sweet, firm crustacean with an energetic snap when bitten. Devein the dorsal digestive tract before high-heat grilling.",
    "culinaryNotesEs": "Crustáceo firme y dulce; desvena el conducto dorsal antes de saltear a fuego vivo con ajo y vino blanco.",
    "allergens": [
      "Crustacean Shellfish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 4c5 0 9 3 9 7s-4 7-9 7c-4 0-7-2-8-5 2 1 5 1 7 0s3-3 1-5c-2-2-5-1-6 1\"/></svg>",
    "audioPrompt": "Jumbo shrimp. Plump crustacean requiring swift high-heat cooking to maintain crisp bite."
  },
  {
    "id": "sea_scallops",
    "nameEn": "Diver Sea Scallops (U-10 Dry Pack)",
    "nameEs": "Callo de hacha / Vieiras frescas (U-10)",
    "ipa": "/ˈskɒləps/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F)",
    "culinaryNotesEn": "Sweet adductor bivalve muscle. Use dry-packed scallops (unsoaked in chemical tripolyphosphate) to achieve a deep golden caramel crust.",
    "culinaryNotesEs": "Molusco dulce y carnoso; asegúrate de que sean 'secas' sin químicos para que doren con costra dorada sin soltar agua.",
    "allergens": [
      "Molluscan Shellfish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 4c5 0 8 4 8 8 0 5-4 8-8 8s-8-3-8-8c0-4 3-8 8-8z\"/><line x1=\"12\" y1=\"4\" x2=\"12\" y2=\"20\"/><line x1=\"6\" y1=\"8\" x2=\"18\" y2=\"16\"/></svg>",
    "audioPrompt": "Diver sea scallops. Plump adductor medallions delivering sweet caramelized sears."
  },
  {
    "id": "live_lobster",
    "nameEn": "Maine Lobster (Live / Tail & Claw)",
    "nameEs": "Langosta de Maine / Bogavante",
    "ipa": "/ˈlɒbstər/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "2°C - 4°C (35°F - 39°F with damp seaweed)",
    "culinaryNotesEn": "Sweet, rich white crustacean meat. Steam or poach in butter (beurre monté) to 57°C (135°F) for maximum tenderness.",
    "culinaryNotesEs": "Carne blanca y dulce en cola y tenazas; el pochado en mantequilla (beurre monté) conserva una textura tierna insuperable.",
    "allergens": [
      "Crustacean Shellfish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M7 12c0-4 3-7 5-7s5 3 5 7l-2 8h-6l-2-8z\"/><path d=\"M4 8c2 0 3 2 3 4M20 8c-2 0-3 2-3 4\"/></svg>",
    "audioPrompt": "Maine lobster. Sweet luxury crustacean perfected through gentle butter poaching."
  },
  {
    "id": "blue_mussels",
    "nameEn": "Prince Edward Island Blue Mussels",
    "nameEs": "Mejillones negros frescos",
    "ipa": "/ˈmʌsəlz/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "1°C - 3°C (34°F - 38°F with breathable damp cloth)",
    "culinaryNotesEn": "Bivalves with sweet, plump orange-white meat. Debeard and steam with white wine, shallots, and butter until shells spring open.",
    "culinaryNotesEs": "Moluscos de concha oscura; retira las barbas y ábrelos al vapor con vino blanco, chalota y mantequilla en 4 minutos.",
    "allergens": [
      "Molluscan Shellfish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><ellipse cx=\"12\" cy=\"12\" rx=\"5\" ry=\"8\" transform=\"rotate(-30 12 12)\"/></svg>",
    "audioPrompt": "Blue mussels. Plump ocean bivalves opening in aromatic shallot steam."
  },
  {
    "id": "littleneck_clams",
    "nameEn": "Fresh Littleneck Clams",
    "nameEs": "Almejas finas frescas",
    "ipa": "/klæmz/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "1°C - 3°C (34°F - 38°F on ice)",
    "culinaryNotesEn": "Small, tender hard-shell clams prized for pasta alle vongole and chowders. Discard any shells that remain closed after boiling.",
    "culinaryNotesEs": "Almejas pequeñas de concha dura y jugo salino; desecha sin dudar cualquiera que no abra tras la cocción.",
    "allergens": [
      "Molluscan Shellfish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M5 16c2-8 12-8 14 0-4 3-10 3-14 0z\"/></svg>",
    "audioPrompt": "Littleneck clams. Briny bivalves providing natural savory liquor to pasta and stews."
  },
  {
    "id": "squid_calamari",
    "nameEn": "Fresh Squid Tubes & Tentacles (Calamari)",
    "nameEs": "Calamar fresco (Tubos y tentáculos)",
    "ipa": "/skwɪd / ˌkæləˈmɑːri/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F on ice)",
    "culinaryNotesEn": "Must be cooked either super fast (under 90 seconds in smoking oil or wok) OR slow-braised for 45+ minutes to avoid a rubbery chew.",
    "culinaryNotesEs": "Cocínalo ultrarrápido (menos de 90 segundos a fuego vivo) O en guiso lento de 45 minutos para evitar consistencia chiclosa.",
    "allergens": [
      "Molluscan Shellfish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M9 3c3 0 6 3 6 8v5l-3 4-3-4v-5c0-5 0-8 0-8z\"/><path d=\"M9 16l-3 4m9-4l3 4\"/></svg>",
    "audioPrompt": "Fresh calamari. Cephalopod meat obeying the rule of flash-fry or slow-braise."
  },
  {
    "id": "octopus_spanish",
    "nameEn": "Spanish Octopus (Pulpo)",
    "nameEs": "Pulpo entero español",
    "ipa": "/ˈɒktəpəs/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F)",
    "culinaryNotesEn": "Dense tentacle meat containing heavy collagen. 'Scare' three times in simmering court-bouillon, then simmer 60 minutes until knife-tender.",
    "culinaryNotesEs": "Carne de tentáculo rica en colágeno; 'espanta' tres veces en agua hirviendo y cuece a fuego lento antes de dorar a la brasa.",
    "allergens": [
      "Molluscan Shellfish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"7\" r=\"4\"/><path d=\"M8 11c-2 4-2 7 0 9m4-9v9m4-9c2 4 2 7 0 9\"/></svg>",
    "audioPrompt": "Spanish octopus. Tenderized cephalopod arms finished over open charcoal embers."
  },
  {
    "id": "halibut_fillet",
    "nameEn": "Pacific Halibut Fillet",
    "nameEs": "Filete de fletán / Halibut del Pacífico",
    "ipa": "/ˈhælɪbət/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F on ice)",
    "culinaryNotesEn": "Firm, lean flatfish with gentle sweetness. Prone to drying out; baste continuously with foaming butter, garlic, and fresh thyme.",
    "culinaryNotesEs": "Pescado blanco magro y dulce; báñalo constantemente con mantequilla espumosa y tomillo para preservar su humedad.",
    "allergens": [
      "Fish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M2 13c4-6 13-6 18 0-5 5-14 5-18 0z\"/><circle cx=\"15\" cy=\"11\" r=\"1\"/></svg>",
    "audioPrompt": "Pacific halibut. Firm, sweet white flatfish requiring continuous butter spooning."
  },
  {
    "id": "rainbow_trout",
    "nameEn": "Rainbow Trout Fillet",
    "nameEs": "Filete de trucha arcoíris",
    "ipa": "/ˈreɪnboʊ traʊt/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F on ice)",
    "culinaryNotesEn": "Freshwater salmonid with tender pink-white flesh and nutty nuances. Classic preparation: pan-fried à la meunière with browned butter and almonds.",
    "culinaryNotesEs": "Pez de agua dulce de carne tierna; se prepara clásicamente 'à la meunière' con mantequilla avellanada, limón y almendras tostadas.",
    "allergens": [
      "Fish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 12c3-4 12-4 17 0-5 4-14 4-17 0z\"/><circle cx=\"16\" cy=\"11.5\" r=\"0.8\"/></svg>",
    "audioPrompt": "Rainbow trout. Delicate freshwater fish matched with brown butter and toasted almonds."
  },
  {
    "id": "dungeness_crab",
    "nameEn": "Dungeness Crab Meat (Jumbo Lump)",
    "nameEs": "Carne de cangrejo Dungeness",
    "ipa": "/ˈdʌndʒənɛs kræb/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F)",
    "culinaryNotesEn": "Distinctly sweet, delicate leg and body meat. Gently fold into crab cakes with minimal binder so sweet lump crab flavor dominates.",
    "culinaryNotesEs": "Carne dulce y aromática de patas de cangrejo; mézclala suavemente en croquetas sin romper los trozos grandes de carne.",
    "allergens": [
      "Crustacean Shellfish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><ellipse cx=\"12\" cy=\"13\" rx=\"7\" ry=\"5\"/><path d=\"M6 9L3 6m15 3l3-3M6 16l-3 3m15-3l3 3\"/></svg>",
    "audioPrompt": "Dungeness crab. Sweet maritime lump meat for elegant cakes and rolls."
  },
  {
    "id": "white_anchovies",
    "nameEn": "White Anchovy Fillets (Boquerones)",
    "nameEs": "Boquerones en vinagre / Anchoas blancas",
    "ipa": "/ˈæntʃəviz/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "2°C - 4°C (35°F - 39°F)",
    "culinaryNotesEn": "Mild fresh anchovies pickled in vinegar and olive oil, unlike salty dark canned anchovies; clean, bright, and briny.",
    "culinaryNotesEs": "Anchoas frescas marinadas en vinagre y aceite de oliva; suaves, ácidas y sin el exceso de sal de las salazones oscuras.",
    "allergens": [
      "Fish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 12c3-2 11-2 16 0-5 2-13 2-16 0z\"/><circle cx=\"16\" cy=\"12\" r=\"0.8\"/></svg>",
    "audioPrompt": "White anchovies. Vinegary boquerones providing bright coastal acidity."
  },
  {
    "id": "oysters_fresh",
    "nameEn": "Live Pacific Oysters (Kumamoto / Blue Point)",
    "nameEs": "Ostras vivas del Pacífico",
    "ipa": "/ˈɔɪstərz/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "2°C - 5°C (35°F - 41°F cup side down)",
    "culinaryNotesEn": "Bivalves bursting with crisp cucumber and mineral brine liquor. Shuck directly over crushed ice and serve raw with lemon and mignonette.",
    "culinaryNotesEs": "Moluscos con licor salino mineral y notas frescas a pepino; se abren al momento sobre hielo con salsa mignonette de chalotas.",
    "allergens": [
      "Molluscan Shellfish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><ellipse cx=\"12\" cy=\"12\" rx=\"7\" ry=\"9\" transform=\"rotate(20 12 12)\"/></svg>",
    "audioPrompt": "Live oysters. Mineral-dense bivalves served raw on crushed ice with mignonette."
  },
  {
    "id": "anchovy_paste",
    "nameEn": "Anchovy Paste / Salt-Cured Anchovies",
    "nameEs": "Pasta de anchoas / Anchoas en salazón",
    "ipa": "/ˈæntʃəvi peɪst/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "2°C - 5°C (35°F - 41°F)",
    "culinaryNotesEn": "The secret umami powerhouse of French and Italian kitchens. Dissolves seamlessly into garlic oil without tasting overtly 'fishy'.",
    "culinaryNotesEs": "La mayor fuente de umami natural en la cocina; se funde en aceite caliente aportando profundidad salina a aderezos césar y pastas.",
    "allergens": [
      "Fish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"5\" y=\"8\" width=\"14\" height=\"8\" rx=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\"/></svg>",
    "audioPrompt": "Anchovy paste. Concentrated umami paste providing invisible savory backbone."
  },
  {
    "id": "mahi_mahi",
    "nameEn": "Mahi-Mahi Fillet (Dorado)",
    "nameEs": "Filete de Dorado / Mahi-mahi",
    "ipa": "/ˈmɑːhi ˈmɑːhi/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F on ice)",
    "culinaryNotesEn": "Firm, moderately fatty subtropical fish with large moist flakes. Holds together exceptionally well on high-heat charbroilers.",
    "culinaryNotesEs": "Pescado de carne firme y semigrasa; no se desmorona en la parrilla caliente, haciéndolo ideal para tacos y asados.",
    "allergens": [
      "Fish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 13c3-5 13-5 18 0-5 5-15 5-18 0z\"/><path d=\"M18 10l3-3v6l-3-3\"/></svg>",
    "audioPrompt": "Mahi-mahi. Robust subtropical fish engineered for high-heat open grilling."
  },
  {
    "id": "monkfish_tail",
    "nameEn": "Monkfish Tail Fillet (Lotte)",
    "nameEs": "Cola de rape (Lotte)",
    "ipa": "/ˈmʌŋkfɪʃ/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F on ice)",
    "culinaryNotesEn": "Often nicknamed 'poor man's lobster' due to its firm, toothsome texture and lack of flake. Resists overcooking in curries and stews.",
    "culinaryNotesEs": "Conocido como la 'langosta del pobre' por su textura firme sin espinas; perfecto para guisos marineros y papillotes.",
    "allergens": [
      "Fish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 12c3-4 13-4 17 0-4 4-14 4-17 0z\"/><circle cx=\"16\" cy=\"11\" r=\"0.8\"/></svg>",
    "audioPrompt": "Monkfish tail. Lobster-like dense flesh for curries and bourrides."
  },
  {
    "id": "sea_urchin_uni",
    "nameEn": "Fresh Sea Urchin Roe (Uni)",
    "nameEs": "Huevas de erizo de mar (Uni)",
    "ipa": "/ˈuːni/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "0°C - 2°C (32°F - 35°F)",
    "culinaryNotesEn": "Velvety, custard-like golden roe with sweet, iodine-rich marine salinity. Melts into hot pasta creating natural oceanic emulsions.",
    "culinaryNotesEs": "Masa cremosa dorada de sabor yodado dulce y marino; se funde en pastas calientes creando emulsiones aterciopeladas.",
    "allergens": [
      "Molluscan Shellfish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"7\"/><path d=\"M12 5v14M5 12h14\"/></svg>",
    "audioPrompt": "Sea urchin uni. Golden custard roe with intense briny umami sweetness."
  },
  {
    "id": "caviar_ossetra",
    "nameEn": "Royal Ossetra Sturgeon Caviar",
    "nameEs": "Caviar de esturión Ossetra",
    "ipa": "/ˈkæviɑːr/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Pescadería",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "-2°C - 2°C (28°F - 35°F on ice)",
    "culinaryNotesEn": "Glossy beads with firm pop, releasing nutty and buttery sea minerals. Serve strictly with mother-of-pearl spoons (never metal).",
    "culinaryNotesEs": "Perlas brillantes con explosión crujiente y notas a nuez y mantequilla; sírvelo siempre con cuchara de nácar para no oxidar su sabor.",
    "allergens": [
      "Fish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><circle cx=\"9\" cy=\"10\" r=\"1.5\"/><circle cx=\"15\" cy=\"10\" r=\"1.5\"/><circle cx=\"12\" cy=\"14\" r=\"1.5\"/></svg>",
    "audioPrompt": "Royal Ossetra caviar. Luxurious cured sturgeon pearls served with mother-of-pearl spoons."
  },
  {
    "id": "canned_sardines",
    "nameEn": "Spanish Sardines in Olive Oil",
    "nameEs": "Sardinillas españolas en aceite de oliva",
    "ipa": "/sɑːrˈdiːnz/",
    "zone": "dry_pantry",
    "zoneEs": "Alacena seca / Conservas",
    "category": "seafood",
    "categoryEs": "Pescados y Mariscos",
    "storageTemp": "15°C - 20°C (59°F - 68°F)",
    "culinaryNotesEn": "Small oily pelagic fish preserved in extra virgin olive oil. High in natural glutamates; mash into toasts or whisk into vinaigrettes.",
    "culinaryNotesEs": "Pescado azul pequeño en aceite de oliva virgen extra; majado sobre pan tostado o en vinagretas aporta sabor concentrado.",
    "allergens": [
      "Fish"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"4\" y=\"7\" width=\"16\" height=\"10\" rx=\"2\"/><circle cx=\"8\" cy=\"12\" r=\"1\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/><circle cx=\"16\" cy=\"12\" r=\"1\"/></svg>",
    "audioPrompt": "Spanish sardines. Oil-packed pelagic fish for express toasts and savory dressings."
  },
  {
    "id": "whole_milk",
    "nameEn": "Pasteurized Whole Milk (3.5% Fat)",
    "nameEs": "Leche entera pasteurizada",
    "ipa": "/hoʊl mɪlk/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "1°C - 3°C (34°F - 38°F)",
    "culinaryNotesEn": "Base for Béchamel sauce, pastry creams, and custards. The 3.5% fat provides body without greasiness.",
    "culinaryNotesEs": "Base de la salsa bechamel, cremas pasteleras y flanes; el 3.5% de grasa aporta cremosidad sin pesadez.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M8 3h8v3l2 4v11H6V10l2-4V3z\"/><line x1=\"8\" y1=\"14\" x2=\"16\" y2=\"14\"/></svg>",
    "audioPrompt": "Whole milk. Foundation dairy liquid for mother béchamel and custards."
  },
  {
    "id": "heavy_cream",
    "nameEn": "Heavy Whipping Cream (36% Butterfat)",
    "nameEs": "Crema para batir / Nata líquida (36% grasa)",
    "ipa": "/ˈhɛvi kriːm/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "1°C - 3°C (34°F - 38°F)",
    "culinaryNotesEn": "High butterfat allows it to whip into stable chantilly foam and finish savory pan sauces without breaking.",
    "culinaryNotesEs": "Su 36% de materia grasa permite montar picos firmes de chantillí y ligar salsas calientes sin que se corten.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M7 21h10l1-12H6l1 12z\"/><path d=\"M6 9c0-3 3-5 6-5s6 2 6 5\"/></svg>",
    "audioPrompt": "Heavy whipping cream. Thirty-six percent butterfat dairy for lush foams and velvety reductions."
  },
  {
    "id": "unsalted_butter",
    "nameEn": "European-Style Unsalted Butter (82% Fat)",
    "nameEs": "Mantequilla sin sal europea (82% grasa)",
    "ipa": "/ʌnˈsɔːltɪd ˈbʌtər/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "1°C - 4°C (34°F - 39°F)",
    "culinaryNotesEn": "High fat, low moisture butter. Vital for laminated croissants, puff pastry, and monte au beurre sauce enrichment.",
    "culinaryNotesEs": "Mantequilla de bajo contenido de agua; clave para hojaldres crujientes y para montar salsas con brillo satinado.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"4\" y=\"8\" width=\"16\" height=\"9\" rx=\"1\"/><path d=\"M4 8l3-3h10l3 3\"/></svg>",
    "audioPrompt": "Unsalted European butter. Eighty-two percent butterfat for flakiest puff pastry lamination."
  },
  {
    "id": "clarified_butter_ghee",
    "nameEn": "Clarified Butter / Ghee",
    "nameEs": "Mantequilla clarificada / Ghee",
    "ipa": "/ˈklærɪfaɪd ˈbʌtər / ɡiː/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "Room temp or refrigerated",
    "culinaryNotesEn": "Butterfat separated from water and milk solids. Elevates smoke point from 175°C to 250°C (482°F) for clean searing without charring.",
    "culinaryNotesEs": "Grasa láctea pura sin agua ni sólidos lácteos; eleva el punto de humo a 250°C permitiendo saltear a fuego vivo sin quemarse.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M5 8h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z\"/><path d=\"M8 8V5a2 2 0 012-2h4a2 2 0 012 2v3\"/></svg>",
    "audioPrompt": "Clarified butter ghee. Purified milk fat with an elevated 250-degree smoke point."
  },
  {
    "id": "sour_cream",
    "nameEn": "Cultured Sour Cream (Crème Aigre)",
    "nameEs": "Crema ácida / Crema agria",
    "ipa": "/ˈsaʊər kriːm/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "1°C - 3°C (34°F - 38°F)",
    "culinaryNotesEn": "Cream fermented with lactic acid bacteria providing tart tanginess to borscht, beef stroganoff, and baked potato dollops.",
    "culinaryNotesEs": "Crema fermentada con cultivos lácticos; aporta acidez balanceada al stroganoff de res y complementa papas al horno.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M6 9h12v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9z\"/><path d=\"M8 5c1-1 3-1 4 0s3 1 4 0\"/></svg>",
    "audioPrompt": "Cultured sour cream. Lactic-acid tang for balancing rich beef and root soups."
  },
  {
    "id": "buttermilk",
    "nameEn": "Cultured Buttermilk",
    "nameEs": "Suero de mantequilla (Buttermilk)",
    "ipa": "/ˈbʌtərmɪlk/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "1°C - 3°C (34°F - 38°F)",
    "culinaryNotesEn": "Acidic cultured dairy liquid that tenderizes poultry enzymes in marinades and activates baking soda for fluffy pancakes and biscuits.",
    "culinaryNotesEs": "Lácteo ácido que ablanda las fibras del pollo frito en marinada y activa el bicarbonato para bizcochos esponjosos.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M7 4h10v5l-2 3v8H9v-8L7 9V4z\"/></svg>",
    "audioPrompt": "Cultured buttermilk. Acidic dairy brine that tenderizes fried chicken."
  },
  {
    "id": "parmesan_reggiano",
    "nameEn": "Parmigiano-Reggiano DOP (24-Month Aged)",
    "nameEs": "Queso Parmigiano-Reggiano DOP (24 meses)",
    "ipa": "/ˌpɑːrmɪˈdʒɑːnoʊ rɛˈdʒɑːnoʊ/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "2°C - 5°C (35°F - 41°F)",
    "culinaryNotesEn": "The 'King of Cheeses'. Hard cooked cow's milk cheese studded with crunchy tyrosine crystals and immense savory glutamates.",
    "culinaryNotesEs": "El 'Rey de los Quesos'; curado 24 meses con cristales crujientes de tirosina y profunda concentración de umami.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 18l14-12 2 4-16 12z\"/><line x1=\"8\" y1=\"15\" x2=\"8.01\" y2=\"15\"/></svg>",
    "audioPrompt": "Parmigiano-Reggiano DOP. Crystalline hard cheese bursting with natural glutamates."
  },
  {
    "id": "fresh_mozzarella",
    "nameEn": "Fresh Mozzarella di Bufala",
    "nameEs": "Mozzarella fresca de búfala",
    "ipa": "/ˌmɒtsəˈrɛlə/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "2°C - 4°C (35°F - 39°F in whey brine)",
    "culinaryNotesEn": "Spun-curd (pasta filata) cheese with milky porcelain interior and delicate elastic outer skin. Drain before placing on Neapolitan pizza.",
    "culinaryNotesEs": "Queso de pasta hilada con interior lechoso y suave elasticidad; escúrrelo bien antes de colocarlo sobre pizza napolitana.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M8 12c2-2 6-2 8 0\"/></svg>",
    "audioPrompt": "Fresh mozzarella. Spun-curd porcelain orb releasing sweet milky whey."
  },
  {
    "id": "sharp_cheddar",
    "nameEn": "Aged English Sharp White Cheddar",
    "nameEs": "Queso Cheddar blanco añejo",
    "ipa": "/ʃɑːrp ˈtʃɛdər/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "2°C - 5°C (35°F - 41°F)",
    "culinaryNotesEn": "Cheddared and aged cow's milk cheese delivering sharp hazelnut acid and smooth melting capabilities for Mornay sauce.",
    "culinaryNotesEs": "Queso madurado de sabor punzante y avellanado; funde sedoso para salsas mornay y macarrones con queso.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 17l16-8-2-4L2 13l2 4z\"/></svg>",
    "audioPrompt": "Sharp white cheddar. Aged curd offering tangy melting body to Mornay sauces."
  },
  {
    "id": "goat_cheese_chevre",
    "nameEn": "Fresh Goat Cheese (Chèvre Log)",
    "nameEs": "Queso de cabra fresco (Chèvre)",
    "ipa": "/ˈʃɛvrə/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "2°C - 4°C (35°F - 39°F)",
    "culinaryNotesEn": "Chalky white, spreadable cheese with a distinct earthy, grassy tang from caproic and caprylic fatty acids. Superb with beets and honey.",
    "culinaryNotesEs": "Queso blanco untuoso con acidez herbácea característica; armoniza con remolachas asadas, nueces y miel de abeja.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"4\" y=\"8\" width=\"16\" height=\"8\" rx=\"4\"/></svg>",
    "audioPrompt": "Chèvre goat cheese. Earthy, tangy log providing bright acidity to salads and crostini."
  },
  {
    "id": "fresh_egg_whole",
    "nameEn": "Grade AA Large Fresh Eggs",
    "nameEs": "Huevos frescos grandes (Grado AA)",
    "ipa": "/ɛɡz/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "1°C - 4°C (34°F - 39°F)",
    "culinaryNotesEn": "The master culinary transformer: provides emulsification (lecithin), structure (protein coagulation), and leavening (aeration).",
    "culinaryNotesEs": "El comodín de la cocina profesional: emulsiona salsas con lecitina, da estructura al coagular y esponja masas.",
    "allergens": [
      "Eggs"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><ellipse cx=\"12\" cy=\"13\" rx=\"7\" ry=\"9\"/></svg>",
    "audioPrompt": "Fresh eggs. The versatile structural foundation of culinary science."
  },
  {
    "id": "egg_yolk",
    "nameEn": "Fresh Egg Yolks (Pasteurized)",
    "nameEs": "Yemas de huevo frescas",
    "ipa": "/ɛɡ joʊk/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "1°C - 3°C (34°F - 38°F)",
    "culinaryNotesEn": "Concentrated with fats and phospholipid lecithin; emulsifies stable mayonnaise and adds richness to carbonara and custards.",
    "culinaryNotesEs": "Rica en lecitina fosfolípida; emulsiona mayonesas sedosas y confiere riqueza cremosa a la salsa carbonara.",
    "allergens": [
      "Eggs"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/></svg>",
    "audioPrompt": "Egg yolks. Lecithin-packed lipid centers for stable Hollandaise and mayonnaise."
  },
  {
    "id": "egg_white",
    "nameEn": "Fresh Egg Whites (Albumen)",
    "nameEs": "Claras de huevo (Albúmina)",
    "ipa": "/ɛɡ waɪt/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "1°C - 3°C (34°F - 38°F)",
    "culinaryNotesEn": "Pure albumen proteins that stretch and trap air to expand 800% in volume during whipping for soufflés and meringues.",
    "culinaryNotesEs": "Proteína pura que atrapa aire expandiendo hasta 8 veces su volumen al batir para suflés y merengues.",
    "allergens": [
      "Eggs"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 3C7 3 4 8 4 14a8 8 0 0016 0c0-6-3-11-8-11z\"/><path d=\"M12 11c-2 0-3 1-3 3\"/></svg>",
    "audioPrompt": "Egg whites. Pure albumen protein traps for billowing soufflés and mousses."
  },
  {
    "id": "cream_cheese",
    "nameEn": "Original Block Cream Cheese",
    "nameEs": "Queso crema en barra",
    "ipa": "/kriːm tʃiːz/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "2°C - 4°C (35°F - 39°F)",
    "culinaryNotesEn": "Fresh, unaged cow's milk cheese enriched with cream. Dense and velvety; always bring to room temperature before creaming for cheesecake.",
    "culinaryNotesEs": "Queso untuoso enriquecido con crema; atempéralo siempre antes de batir para evitar grumos en el pay de queso.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"4\" y=\"6\" width=\"16\" height=\"12\" rx=\"2\"/><line x1=\"4\" y1=\"12\" x2=\"20\" y2=\"12\"/></svg>",
    "audioPrompt": "Cream cheese. Velvet block dairy for dense New York style cheesecakes."
  },
  {
    "id": "ricotta_cheese",
    "nameEn": "Whole Milk Ricotta",
    "nameEs": "Queso Ricotta de leche entera",
    "ipa": "/rɪˈkɒtə/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "1°C - 3°C (34°F - 38°F)",
    "culinaryNotesEn": "Delicate sweet whey curds. Drain in cheesecloth for 2 hours to eliminate moisture before stuffing ravioli or cannoli.",
    "culinaryNotesEs": "Cuajadas suaves de suero lácteo; escúrrelas en manta de cielo para eliminar el exceso de agua antes de rellenar ravioles.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M5 10h14l-2 10H7L5 10z\"/><ellipse cx=\"12\" cy=\"10\" rx=\"7\" ry=\"3\"/></svg>",
    "audioPrompt": "Ricotta cheese. Sweet delicate whey curds for stuffed pasta and cannoli."
  },
  {
    "id": "mascarpone_cheese",
    "nameEn": "Italian Mascarpone Cheese",
    "nameEs": "Queso Mascarpone italiano",
    "ipa": "/ˌmæskərˈpoʊni/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "1°C - 4°C (34°F - 39°F)",
    "culinaryNotesEn": "Triple-cream cheese coagulated with citric or tartaric acid (up to 75% butterfat). Luscious, silky base for authentic Tiramisù.",
    "culinaryNotesEs": "Queso triple crema de hasta 75% de grasa láctea cuajado con ácido cítrico; base suntuosa del auténtico tiramisú.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"4\" y=\"7\" width=\"16\" height=\"11\" rx=\"3\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/></svg>",
    "audioPrompt": "Mascarpone cheese. High-butterfat Italian cream cheese foundational to tiramisù."
  },
  {
    "id": "gruyere_cheese",
    "nameEn": "Swiss Le Gruyère AOP",
    "nameEs": "Queso Gruyère suizo AOP",
    "ipa": "/ɡruːˈjɛər/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "2°C - 5°C (35°F - 41°F)",
    "culinaryNotesEn": "Nutty, slightly salty hard Swiss cheese that melts into a golden, stringy crown over French onion soup and croque monsieurs.",
    "culinaryNotesEs": "Queso suizo aromático con notas a avellana tostada; se derrite en hebras doradas sobre la sopa de cebolla francesa.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 18l16-6v-4L4 14v4z\"/><circle cx=\"10\" cy=\"14\" r=\"1\"/></svg>",
    "audioPrompt": "Gruyère cheese. Nutty alpine melting cheese crowning classic French onion soup."
  },
  {
    "id": "brie_de_meaux",
    "nameEn": "Brie de Meaux (Bloomy Rind)",
    "nameEs": "Queso Brie de corteza enmohecida",
    "ipa": "/briː/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "2°C - 5°C (35°F - 41°F)",
    "culinaryNotesEn": "Soft-ripened cow's milk cheese with an edible white Penicillium candidum rind and a runny, mushroomy interior. Serve at room temp.",
    "culinaryNotesEs": "Queso de pasta blanda con corteza comestible aterciopelada y corazón cremoso con aroma a bosque y champiñones.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 17l16-6v-3L4 14v3z\"/></svg>",
    "audioPrompt": "Brie cheese. Creamy bloomy-rind wheel with delicate mushroom notes."
  },
  {
    "id": "feta_cheese",
    "nameEn": "Greek Barrel-Aged Feta Cheese",
    "nameEs": "Queso Feta griego en salmuera",
    "ipa": "/ˈfɛtə/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "2°C - 4°C (35°F - 39°F submerged in brine)",
    "culinaryNotesEn": "Crumbly, brined sheep and goat's milk cheese with a bold salty-tangy bite. Does not melt when baked, making it ideal for pastries.",
    "culinaryNotesEs": "Queso desmoronadizo de oveja y cabra curado en salmuera; no se funde al calor, manteniendo su textura en ensaladas y empanadas.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"4\" y=\"8\" width=\"16\" height=\"10\" rx=\"1\"/><line x1=\"8\" y1=\"12\" x2=\"8.01\" y2=\"12\"/><line x1=\"16\" y1=\"14\" x2=\"16.01\" y2=\"14\"/></svg>",
    "audioPrompt": "Greek feta. Brine-pickled sheep cheese delivering bright salty crumbles."
  },
  {
    "id": "blue_cheese_roquefort",
    "nameEn": "Roquefort DOP (Blue Cheese)",
    "nameEs": "Queso Roquefort / Queso azul",
    "ipa": "/ˈroʊkfərt/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "2°C - 5°C (35°F - 41°F)",
    "culinaryNotesEn": "Sheep's milk cheese aged in natural Combalou caves with Penicillium roqueforti blue mold veins, offering sharp, peppery complexity.",
    "culinaryNotesEs": "Queso de oveja madurado en cuevas con vetas de moho azul; de sabor potente, picante y salino que acompaña carnes rojas.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 17l16-6v-4L4 13v4z\"/><circle cx=\"10\" cy=\"14\" r=\"0.8\"/><circle cx=\"14\" cy=\"12\" r=\"0.8\"/></svg>",
    "audioPrompt": "Roquefort blue cheese. Cave-aged sheep cheese with piercing peppery mold veins."
  },
  {
    "id": "creme_fraiche",
    "nameEn": "French Crème Fraîche (38% Fat)",
    "nameEs": "Crème Fraîche francesa",
    "ipa": "/ˌkrɛm ˈfrɛʃ/",
    "zone": "walk_in_cooler",
    "zoneEs": "Cámara frigorífica / Lácteos",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "1°C - 3°C (34°F - 38°F)",
    "culinaryNotesEn": "Cultured heavy cream with high fat and low protein. Will NOT curdle when boiled, making it the supreme choice for pan reductions and caviar garnish.",
    "culinaryNotesEs": "Crema cultivada espesa con alto porcentaje de grasa; NUNCA se corta al hervir, siendo la reina para salsas calientes y caviar.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M5 8h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z\"/><path d=\"M9 5c1-1 2-1 3 0s2 1 3 0\"/></svg>",
    "audioPrompt": "Crème fraîche. High-fat French cultured cream that never curdles under boiling heat."
  },
  {
    "id": "condensed_milk",
    "nameEn": "Sweetened Condensed Milk",
    "nameEs": "Leche condensada azucarada",
    "ipa": "/kənˈdɛnst mɪlk/",
    "zone": "dry_pantry",
    "zoneEs": "Alacena seca / Repostería",
    "category": "dairy_and_eggs",
    "categoryEs": "Lácteos y Huevos",
    "storageTemp": "15°C - 20°C (59°F - 68°F)",
    "culinaryNotesEn": "Whole milk with 60% of water removed and 40% sugar added. Dense and syrupy, foundational for Key lime pies and Dulce de leche.",
    "culinaryNotesEs": "Leche evaporada al 60% con azúcar añadida; espesa y acaramelada, base de pay de limón y dulce de leche.",
    "allergens": [
      "Milk / Dairy"
    ],
    "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"6\" y=\"5\" width=\"12\" height=\"14\" rx=\"2\"/><line x1=\"6\" y1=\"10\" x2=\"18\" y2=\"10\"/></svg>",
    "audioPrompt": "Sweetened condensed milk. Reduced sugary dairy syrup for key lime pies and caramel."
  },
  {
    "id": "yellow_onion",
    "nameEn": "Yellow Onion",
    "nameEs": "Cebolla Amarilla / Dulce",
    "ipa": "/ˈjɛl.oʊ ˈʌn.jən/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "10°C to 15°C (Cool, Dark, Well-Ventilated)",
    "culinaryNotesEn": "Foundation of western savory stocks and sauces; high sulfur compounds convert to sweetness when caramelized.",
    "culinaryNotesEs": "Pilar de sofritos y caldos occidentales; sus azúcares caramelizan aportando color dorado y sabor hondo.",
    "allergens": [],
    "audioPrompt": "Yellow Onion, quintessential base for savory mirepoix."
  },
  {
    "id": "red_onion",
    "nameEn": "Red Onion",
    "nameEs": "Cebolla Morada",
    "ipa": "/rɛd ˈʌn.jən/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "10°C to 15°C (Cool, Dark)",
    "culinaryNotesEn": "Vibrant purple color and sharp bite; outstanding pickled in lime juice for ceviche and tacos or raw in salads.",
    "culinaryNotesEs": "Color violáceo y mordida fresca; ideal encurtida con lima para cebiches o cruda en ensaladas.",
    "allergens": [],
    "audioPrompt": "Red Onion, mild and crisp, prized for pickling and raw applications."
  },
  {
    "id": "shallots",
    "nameEn": "French Shallots",
    "nameEs": "Chalotas Francesas / Echálotes",
    "ipa": "/ʃəˈlɑːts/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "10°C to 15°C (Dry, Dark)",
    "culinaryNotesEn": "Subtle onion-garlic hybrid flavor; essential foundation for béarnaise, beurre blanc, and red wine reductions.",
    "culinaryNotesEs": "Sabor aristocrático entre ajo y cebolla suave; base indispensable para la salsa bearnesa y reducciones de vino.",
    "allergens": [],
    "audioPrompt": "French Shallots, refined allium for classic French pan reductions."
  },
  {
    "id": "garlic_bulb",
    "nameEn": "Garlic (Fresh Bulbs)",
    "nameEs": "Ajo Fresco",
    "ipa": "/ˈɡɑːr.lɪk/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "10°C to 15°C (Never in Refrigerator)",
    "culinaryNotesEn": "Crushing activates allicin for pungent heat; slow roasting yields sweet, mellow, spreadable paste.",
    "culinaryNotesEs": "Al machacarlo se activa la alicina pungente; asado entero se vuelve dulce, cremoso y untable.",
    "allergens": [],
    "audioPrompt": "Fresh Garlic, crushed to unleash savory allicin pungency."
  },
  {
    "id": "leek",
    "nameEn": "Leeks",
    "nameEs": "Puerro / Porro",
    "ipa": "/liːks/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C (High Humidity)",
    "culinaryNotesEn": "Sweet, delicate allium; split lengthwise and rinse between layers to wash out trapped sandy soil before braising.",
    "culinaryNotesEs": "Sabor dulce y sedoso; córtalo a lo largo y lávalo bajo el grifo para eliminar la tierra antes de pochar.",
    "allergens": [],
    "audioPrompt": "Leeks, delicate allium starring in vichyssoise and stocks."
  },
  {
    "id": "scallions",
    "nameEn": "Scallions / Green Onions",
    "nameEs": "Cebolleta / Cebollín / Cebolla de Verdeo",
    "ipa": "/ˈskæl.jənz/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C (Bagged with paper towel)",
    "culinaryNotesEn": "Use white bases for stir-fry aromatics and raw green tops as crisp finishing garnish.",
    "culinaryNotesEs": "Usa los bulbos blancos para saltear y los tallos verdes crudos como guarnición crocante.",
    "allergens": [],
    "audioPrompt": "Scallions, crisp allium providing dual flavor profiles."
  },
  {
    "id": "celery_stalks",
    "nameEn": "Pascal Celery",
    "nameEs": "Apio Fresco",
    "ipa": "/ˈsɛl.ɚ.i/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C (Wrapped in foil)",
    "culinaryNotesEn": "Aromatic backbone of French mirepoix, Italian soffritto, and Cajun Holy Trinity; natural source of nitrates.",
    "culinaryNotesEs": "Columna aromática del mirepoix francés y el sofrito italiano; aporta frescor mineral inconfundible.",
    "allergens": [
      "Celery / Apio"
    ],
    "audioPrompt": "Celery, mineral-rich crunch forming the classic mirepoix triad."
  },
  {
    "id": "carrots",
    "nameEn": "Orange Carrots",
    "nameEs": "Zanahoria",
    "ipa": "/ˈkær.əts/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Provides sweetness and beta-carotene color in braises and mirepoix; glazed with butter for classic vichy carrots.",
    "culinaryNotesEs": "Aporta dulzor natural y color ámbar a fondos; torneada y glaseada a la manteca como guarnición Vichy.",
    "allergens": [],
    "audioPrompt": "Carrots, sweet root vegetable anchoring European stocks."
  },
  {
    "id": "bell_pepper_red",
    "nameEn": "Red Bell Pepper",
    "nameEs": "Pimiento Morrón Rojo",
    "ipa": "/rɛd bɛl ˈpɛp.ɚ/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "4°C to 7°C",
    "culinaryNotesEn": "Fully ripe, sweet pepper; roast over open flame and peel blackened blistered skin for velvety piperade and coulis.",
    "culinaryNotesEs": "Pimiento maduro dulce; ásalo a la llama viva para retirar la piel quemada y lograr coulis sedosos.",
    "allergens": [],
    "audioPrompt": "Red Bell Pepper, sweet sweet pepper perfect for charring and pureeing."
  },
  {
    "id": "roma_tomato",
    "nameEn": "Roma / Plum Tomato",
    "nameEs": "Tomate Roma / Pera / San Marzano",
    "ipa": "/ˈroʊ.mə təˈmeɪ.toʊ/",
    "zone": "Ambient Countertop",
    "zoneEs": "Encimera a Temperatura Ambiente",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "15°C to 20°C (Never Refrigerate Raw)",
    "culinaryNotesEn": "Dense meaty walls and low water content; ideal for concassé, marinara sauces, and confit.",
    "culinaryNotesEs": "Pulpa carnosa con pocas semillas y bajo contenido de agua; rey de la salsa marinara y tomates confitados.",
    "allergens": [],
    "audioPrompt": "Roma Tomato, meaty plum tomato ideal for thick reductions."
  },
  {
    "id": "cherry_tomatoes",
    "nameEn": "Cherry Tomatoes",
    "nameEs": "Tomates Cherry",
    "ipa": "/ˈtʃɛr.i təˈmeɪ.toʊz/",
    "zone": "Ambient Countertop",
    "zoneEs": "Encimera a Temperatura Ambiente",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "15°C to 20°C",
    "culinaryNotesEn": "Concentrated sugar-acid explosion; blister in hot cast-iron skillet with garlic and olive oil until skins pop.",
    "culinaryNotesEs": "Explosión de dulzura concentrada; saltea enteros a fuego vivo con aceite de oliva hasta que estallen.",
    "allergens": [],
    "audioPrompt": "Cherry Tomatoes, sweet bite-sized gems for blistered pan sauces."
  },
  {
    "id": "russet_potatoes",
    "nameEn": "Russet Burbank Potato",
    "nameEs": "Papa Russet / Almidonada",
    "ipa": "/ˈrʌs.ɪt pəˈteɪ.toʊ/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "8°C to 12°C (Dark, Cool)",
    "culinaryNotesEn": "High-starch, low-moisture tuber; yields the ultimate fluffy baked potatoes and crisp double-fried French fries.",
    "culinaryNotesEs": "Papa con alto almidón y baja humedad; ideal para papas fritas crocantes por fuera y tiernas por dentro.",
    "allergens": [],
    "audioPrompt": "Russet Potato, high-starch spud for fluffy mash and French fries."
  },
  {
    "id": "yukon_gold_potatoes",
    "nameEn": "Yukon Gold Potato",
    "nameEs": "Papa Yukon Gold / Amarilla Mantecosa",
    "ipa": "/ˈjuː.kɑːn ɡoʊld/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "8°C to 12°C (Dark, Cool)",
    "culinaryNotesEn": "Medium starch with natural buttery yellow flesh; the chef's gold standard for velvety Robuchon-style pomme purée.",
    "culinaryNotesEs": "Almidón medio con pulpa mantecosa dorada; la favorita de los chefs para purés untuosos estilo Robuchon.",
    "allergens": [],
    "audioPrompt": "Yukon Gold Potato, naturally buttery spud for luxurious purees."
  },
  {
    "id": "cremini_mushrooms",
    "nameEn": "Cremini / Baby Bella Mushrooms",
    "nameEs": "Champiñones Cremini / Portobello Bebé",
    "ipa": "/krəˈmiː.ni ˈmʌʃ.ruːmz/",
    "zone": "Refrigerator (Paper Bag)",
    "zoneEs": "Refrigerador (Bolsa de Papel)",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Brown variety of Agaricus bisporus with earthier depth than white button mushrooms; sear dry to concentrate umami.",
    "culinaryNotesEs": "Variedad parda más sabrosa que el champiñón blanco; séllalos a fuego vivo sin mover para dorar a fondo.",
    "allergens": [],
    "audioPrompt": "Cremini Mushrooms, earthy brown mushrooms rich in savory glutamates."
  },
  {
    "id": "shiitake_mushrooms",
    "nameEn": "Shiitake Mushrooms",
    "nameEs": "Setas Shiitake",
    "ipa": "/ʃiːˈtɑː.keɪ/",
    "zone": "Refrigerator (Paper Bag)",
    "zoneEs": "Refrigerador (Bolsa de Papel)",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Woody caps packed with natural guanylate umami; discard tough stems or save them for aromatic vegetarian stocks.",
    "culinaryNotesEs": "Sombrerillos leñosos cargados de umami natural; retira los tallos fibrosos para caldos aromáticos.",
    "allergens": [],
    "audioPrompt": "Shiitake Mushrooms, potent East Asian fungi delivering deep umami."
  },
  {
    "id": "fresh_ginger",
    "nameEn": "Fresh Ginger Root",
    "nameEs": "Jengibre Fresco / Kion",
    "ipa": "/frɛʃ ˈdʒɪn.dʒɚ/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "4°C to 7°C",
    "culinaryNotesEn": "Zingy, peppery, pungent rhizome; scrape off thin skin using the edge of a spoon to preserve all inner flesh.",
    "culinaryNotesEs": "Rizoma picante y cítrico; ráspalo con el borde de una cuchara para pelarlo sin desperdiciar pulpa.",
    "allergens": [],
    "audioPrompt": "Fresh Ginger, zesty warming rhizome essential in Asian stir-fries."
  },
  {
    "id": "eggplant",
    "nameEn": "Globe Eggplant / Aubergine",
    "nameEs": "Berenjena",
    "ipa": "/ˈɛɡ.plænt/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "8°C to 12°C",
    "culinaryNotesEn": "Spongy cell structure that absorbs olive oil like a sponge; salt before cooking to purge bitterness and condense flesh.",
    "culinaryNotesEs": "Pulpa esponjosa que absorbe aceite; sálala 20 minutos antes para drenar jugos amargos y sellar mejor.",
    "allergens": [],
    "audioPrompt": "Eggplant, purple nightshade starring in ratatouille and moussaka."
  },
  {
    "id": "zucchini",
    "nameEn": "Zucchini / Courgette",
    "nameEs": "Calabacín / Zucchini",
    "ipa": "/zuːˈkiː.ni/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "4°C to 7°C",
    "culinaryNotesEn": "Tender summer squash; slice on mandoline into carpaccio or sear hot and fast to avoid water release.",
    "culinaryNotesEs": "Calabacín tierno; córtalo en láminas finas para carpaccio o séllalo muy caliente para que no suelte agua.",
    "allergens": [],
    "audioPrompt": "Zucchini, versatile summer squash for ratatouille and searing."
  },
  {
    "id": "asparagus_green",
    "nameEn": "Green Asparagus",
    "nameEs": "Espárrago Verde",
    "ipa": "/əˈspær.ə.ɡəs/",
    "zone": "Refrigerator (Stands in Water)",
    "zoneEs": "Refrigerador (En Vaso de Agua)",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Bend stalk until woody base snaps off naturally at fracture point; blanch in salted water and shock in ice.",
    "culinaryNotesEs": "Dóblalo con los dedos para que se quiebre solo en el punto exacto donde empieza la parte leñosa.",
    "allergens": [],
    "audioPrompt": "Green Asparagus, tender stalks requiring quick blanching and shocking."
  },
  {
    "id": "artichoke_globe",
    "nameEn": "Globe Artichoke",
    "nameEs": "Alcachofa / Alcaucil",
    "ipa": "/ˈɑːr.t̬ə.tʃoʊk/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Edible thistle buds; rub trimmed cuts with fresh lemon halves immediately to stop rapid enzymatic browning.",
    "culinaryNotesEs": "Flor comestible; frota los cortes limpios con limón de inmediato para evitar que se oxiden en negro.",
    "allergens": [],
    "audioPrompt": "Globe Artichoke, edible flower bud with prized tender heart."
  },
  {
    "id": "spinach_fresh",
    "nameEn": "Baby Spinach",
    "nameEs": "Espinaca Baby",
    "ipa": "/ˈspɪn.ɪtʃ/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Tender leaves high in iron and oxalates; shrinks down by 90% volume in 30 seconds of gentle butter wilting.",
    "culinaryNotesEs": "Hojas tiernas que reducen su volumen en un 90% tras 30 segundos de salteado suave con mantequilla.",
    "allergens": [],
    "audioPrompt": "Baby Spinach, tender leaves that wilt into silky green side dishes."
  },
  {
    "id": "lacinato_kale",
    "nameEn": "Lacinato Kale / Tuscan Cavolo Nero",
    "nameEs": "Col Kale Lacinato / Cavolo Nero",
    "ipa": "/ˈkæv.ə.loʊ ˈnɛər.oʊ/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Dark pebbled blue-green leaves; strip fibrous central rib and braise slow with garlic, olive oil, and white beans.",
    "culinaryNotesEs": "Hojas rugosas verde azuladas; retira el nervio central leñoso y estofa con ajo, aceite y alubias blancas.",
    "allergens": [],
    "audioPrompt": "Lacinato Kale, dark Tuscan cabbage for ribollita and rustic braises."
  },
  {
    "id": "cauliflower",
    "nameEn": "White Cauliflower",
    "nameEs": "Coliflor Blanca",
    "ipa": "/ˈkɑː.ləˌflaʊ.ɚ/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Mild brassica florets; roast whole with spiced butter or purée with heavy cream into faux potato puree.",
    "culinaryNotesEs": "Hortaliza versátil; ásala entera con especias o tritúrala con nata para un puré bajo en carbohidratos.",
    "allergens": [],
    "audioPrompt": "White Cauliflower, brassica florets for silky purees and whole roasting."
  },
  {
    "id": "broccoli_crowns",
    "nameEn": "Broccoli Crowns",
    "nameEs": "Brócoli / Brécol",
    "ipa": "/ˈbrɑː.kəl.i/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Dense florets; blanch in boiling salted water for 2 minutes and plunge into ice bath to lock vibrant emerald green.",
    "culinaryNotesEs": "Escáldalo en agua hirviendo con sal durante 2 minutos y corta la cocción en hielo para fijar la clorofila.",
    "allergens": [],
    "audioPrompt": "Broccoli Crowns, emerald florets demanding rapid blanching and chilling."
  },
  {
    "id": "brussels_sprouts",
    "nameEn": "Brussels Sprouts",
    "nameEs": "Coles de Bruselas",
    "ipa": "/ˈbrʌs.əlz spraʊts/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Miniature cabbage heads; halve and roast flat-side down at 425°F (220°C) with pancetta for caramelized edges.",
    "culinaryNotesEs": "Córtalas por la mitad y dóralas con la cara plana hacia la sartén caliente con panceta crujiente.",
    "allergens": [],
    "audioPrompt": "Brussels Sprouts, miniature cabbages that turn sweet and crispy roasted."
  },
  {
    "id": "cabbage_savoy",
    "nameEn": "Savoy Cabbage",
    "nameEs": "Col de Saboya / Col Rizada",
    "ipa": "/səˈvɔɪ ˈkæb.ɪdʒ/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Crinkled, tender emerald leaves; ideal for stuffing with ground pork and braising in duck fat.",
    "culinaryNotesEs": "Hojas rizadas y tiernas; perfecta para blanquear, rellenar de farsa de carne y estofar en caldo.",
    "allergens": [],
    "audioPrompt": "Savoy Cabbage, ruffled tender leaves perfect for stuffing and braising."
  },
  {
    "id": "fennel_bulb",
    "nameEn": "Florence Fennel Bulb",
    "nameEs": "Bulbo de Hinojo Fresco",
    "ipa": "/ˈfɛn.əl bʌlb/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Crisp bulb with sweet anise-licorice aroma; shave raw with citrus or braise slowly with orange juice and fish.",
    "culinaryNotesEs": "Bulbo crujiente con aroma anisado; lamínalo fino con naranja para ensaladas o brásalo con pescado.",
    "allergens": [],
    "audioPrompt": "Florence Fennel, crisp anise-flavored bulb pairing beautifully with seafood."
  },
  {
    "id": "celeriac_root",
    "nameEn": "Celeriac / Celery Root",
    "nameEs": "Apionabo / Raíz de Apio",
    "ipa": "/səˈlɛr.i.æk/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Gnarled root vegetable with intense celery aromatics; parboil and mash with cream or shred into remoulade.",
    "culinaryNotesEs": "Raíz nudosa con perfume intenso a apio; hiérvela para purés sedosos o rállala cruda para remoulade.",
    "allergens": [
      "Celery / Apio"
    ],
    "audioPrompt": "Celeriac, knobby root providing concentrated celery flavor."
  },
  {
    "id": "beets_red",
    "nameEn": "Red Beetroot",
    "nameEs": "Remolacha Roja / Betabel",
    "ipa": "/rɛd biːts/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Deep earthy-sweet roots rich in geosmin; roast wrapped in foil with thyme and balsamic until skins slip off.",
    "culinaryNotesEs": "Raíz dulce y terrosa rica en betanina; ásala envuelta en papel aluminio hasta que la piel se deslice sola.",
    "allergens": [],
    "audioPrompt": "Red Beets, ruby roots roasting to earthy sweetness."
  },
  {
    "id": "butternut_squash",
    "nameEn": "Butternut Squash",
    "nameEs": "Calabaza Cacahuete / Butternut",
    "ipa": "/ˈbʌt̬.ɚ.nʌt skwɑːʃ/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "10°C to 15°C",
    "culinaryNotesEn": "Sweet, nutty orange flesh; roast and purée with browned butter and sage for decadent ravioli fillings.",
    "culinaryNotesEs": "Pulpa anaranjada dulce y sedosa; ásala y lúgala con mantequilla avellanada y salvia para raviolis.",
    "allergens": [],
    "audioPrompt": "Butternut Squash, sweet winter squash for velvety bisques and pasta filling."
  },
  {
    "id": "cucumber_english",
    "nameEn": "English Hothouse Cucumber",
    "nameEs": "Pepino Holandés / Cohombro",
    "ipa": "/ˈkjuː.kʌm.bɚ/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "8°C to 12°C",
    "culinaryNotesEn": "Seedless, thin-skinned variety; smash with side of cleaver to fracture cell walls for quick Asian chili oil pickles.",
    "culinaryNotesEs": "Variedad de piel fina y sin semillas; aplástalo con la hoja del cuchillo para marinarlo en aceite de chile.",
    "allergens": [],
    "audioPrompt": "English Cucumber, crisp seedless vegetable for cold gazpachos and salads."
  },
  {
    "id": "avocado_hass",
    "nameEn": "Hass Avocado",
    "nameEs": "Aguacate Hass / Palta",
    "ipa": "/ˌæv.əˈkɑː.doʊ/",
    "zone": "Ambient Countertop",
    "zoneEs": "Encimera a Temperatura Ambiente",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "18°C to 22°C (Chill only when fully ripe)",
    "culinaryNotesEn": "High monounsaturated fat fruit with rich nutty flavor; mash with lime juice immediately to halt polyphenol oxidase browning.",
    "culinaryNotesEs": "Fruta con grasas saludables y textura de mantequilla; añade zumo de lima para evitar que se oxide.",
    "allergens": [],
    "audioPrompt": "Hass Avocado, creamy rich fruit requiring immediate acid to prevent browning."
  },
  {
    "id": "radish_french",
    "nameEn": "French Breakfast Radish",
    "nameEs": "Rábano Francés de Desayuno",
    "ipa": "/ˈfrɛntʃ ˈræd.ɪʃ/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Elongated crisp root with mild peppery bite; classically served raw dipped in cultured butter and Maldon sea salt.",
    "culinaryNotesEs": "Rabanito alargado de mordida picante suave; sírvelo crudo mojado en mantequilla francesa y flor de sal.",
    "allergens": [],
    "audioPrompt": "French Radish, crunchy peppery root served with sweet butter and salt."
  },
  {
    "id": "jalapeno_pepper",
    "nameEn": "Jalapeño Pepper",
    "nameEs": "Chile Jalapeño Fresco",
    "ipa": "/ˌhɑː.ləˈpeɪ.njoʊ/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "4°C to 7°C",
    "culinaryNotesEn": "Medium heat (2,500–8,000 Scoville); heat resides primarily in internal white pith membranes, not the seeds.",
    "culinaryNotesEs": "Picor medio; la capsaicina reside en la membrana blanquecina interna, no en las semillas.",
    "allergens": [],
    "audioPrompt": "Jalapeño Pepper, versatile chili providing grassy heat."
  },
  {
    "id": "habanero_pepper",
    "nameEn": "Habanero Pepper",
    "nameEs": "Chile Habanero",
    "ipa": "/ˌhɑː.bəˈnɛər.oʊ/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "4°C to 7°C",
    "culinaryNotesEn": "Scorching tropical heat (100,000–350,000 Scoville) with floral apricot undertones; wear latex gloves when mincing.",
    "culinaryNotesEs": "Picor volcánico con notas florales y cítricas; usa siempre guantes para manipular y picar fino.",
    "allergens": [],
    "audioPrompt": "Habanero Pepper, intense tropical fire with fruity apricot aromas."
  },
  {
    "id": "parsnips",
    "nameEn": "Parsnips",
    "nameEs": "Chirivía / Pastinaca",
    "ipa": "/ˈpɑːr.snɪps/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Pale root vegetable sweet like carrots with spiced nutmeg nuances; roasts to deep golden caramel edges.",
    "culinaryNotesEs": "Raíz blanca con notas especiadas de nuez moscada; al asarla carameliza con un dulzor intenso.",
    "allergens": [],
    "audioPrompt": "Parsnips, sweet winter roots with aromatic nutmeg undertones."
  },
  {
    "id": "snap_peas",
    "nameEn": "Sugar Snap Peas",
    "nameEs": "Guisantes Dulces de Vaina / Tirabeques",
    "ipa": "/ˈʃʊɡ.ɚ snæp piːz/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Edible crunchy pod containing sweet peas; zip off the fibrous back string before flash sautéing.",
    "culinaryNotesEs": "Vaina crocante y dulce que se come entera; retira el hilo fibroso lateral antes de saltear a fuego vivo.",
    "allergens": [],
    "audioPrompt": "Sugar Snap Peas, crunchy sweet pods for fast wok stir-frying."
  },
  {
    "id": "green_beans",
    "nameEn": "Haricots Verts / French Green Beans",
    "nameEs": "Judías Verdes Finas / Haricots Verts",
    "ipa": "/ˌhær.ɪ.koʊ ˈvɛər/",
    "zone": "Vegetable Crisper (Refrigerator)",
    "zoneEs": "Cajón de Verduras",
    "category": "Vegetables & Aromatics",
    "categoryEs": "Verduras y Aromáticos",
    "storageTemp": "4°C to 7°C",
    "culinaryNotesEn": "Slender, stringless French green beans; blanch 2 minutes in salted water and toss in brown butter with toasted almonds.",
    "culinaryNotesEs": "Judías verdes muy delgadas y sin hebras; escáldalas 2 minutos y saltéalas con mantequilla y almendras.",
    "allergens": [],
    "audioPrompt": "Haricots Verts, slender tender green beans blanched and tossed with almonds."
  },
  {
    "id": "genovese_basil",
    "nameEn": "Fresh Genovese Basil",
    "nameEs": "Albahaca Genovesa Fresca",
    "ipa": "/ˈbeɪ.zəl/",
    "zone": "Ambient Herb Vase",
    "zoneEs": "Vaso de Agua en Encimera",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "15°C to 20°C (Never in Refrigerator)",
    "culinaryNotesEn": "High eugenol and sweet anise notes; tear by hand at the final second as steel knives turn cut edges black.",
    "culinaryNotesEs": "Aromas anisados y dulces; deshoja a mano al último segundo ya que el metal del cuchillo ennegrece los bordes.",
    "allergens": [],
    "audioPrompt": "Genovese Basil, tear by hand onto hot Neapolitan pizzas."
  },
  {
    "id": "rosemary_fresh",
    "nameEn": "Fresh Rosemary",
    "nameEs": "Romero Fresco",
    "ipa": "/ˈroʊz.mɛr.i/",
    "zone": "Refrigerator (Paper Towel Wrap)",
    "zoneEs": "Refrigerador (Envuelto en Papel)",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Piney, resinous perennial herb with wood-like stems; infuse whole sprigs during braising and sear with butter.",
    "culinaryNotesEs": "Hierba leñosa con aceites resinosos de pino; añade ramas enteras a asados de cordero y mantequillas de sellado.",
    "allergens": [],
    "audioPrompt": "Fresh Rosemary, resinous pine-scented sprigs for roasted meats."
  },
  {
    "id": "thyme_fresh",
    "nameEn": "Fresh French Thyme",
    "nameEs": "Tomillo Francés Fresco",
    "ipa": "/taɪm/",
    "zone": "Refrigerator (Paper Towel Wrap)",
    "zoneEs": "Refrigerador (Envuelto en Papel)",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Tiny earthy leaves with potent thymol; strip leaves by pulling backwards against stem growth direction.",
    "culinaryNotesEs": "Hojas diminutas con timol balsámico; deshoja deslizando los dedos a contrapelo del tallo.",
    "allergens": [],
    "audioPrompt": "Fresh Thyme, foundational herb for bouquet garni and roast chicken."
  },
  {
    "id": "flat_leaf_parsley",
    "nameEn": "Italian Flat-Leaf Parsley",
    "nameEs": "Perejil Italiano de Hoja Plana",
    "ipa": "/ˈpɑːr.sli/",
    "zone": "Refrigerator (Stands in Water)",
    "zoneEs": "Refrigerador (En Vaso de Agua)",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Clean, grassy, slightly peppery flavor far superior to curly parsley; chop finely for gremolata and stocks.",
    "culinaryNotesEs": "Sabor fresco y limpio muy superior al perejil rizado; pica finamente para chimichurris y gremolata.",
    "allergens": [],
    "audioPrompt": "Flat-Leaf Parsley, crisp herbal freshness brightening pan sauces."
  },
  {
    "id": "cilantro_coriander",
    "nameEn": "Fresh Cilantro / Coriander Leaves",
    "nameEs": "Cilantro Fresco",
    "ipa": "/sɪˈlæn.troʊ/",
    "zone": "Refrigerator (Stands in Water)",
    "zoneEs": "Refrigerador (En Vaso de Agua)",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Citrusy, pungent herb essential in salsas and curries; stems hold more concentrated flavor than leaves.",
    "culinaryNotesEs": "Hierba cítrica e intensa; los tallos tiernos concentran más sabor que las hojas para salsas y curris.",
    "allergens": [],
    "audioPrompt": "Fresh Cilantro, vibrant citrus-forward herb for tacos and ceviche."
  },
  {
    "id": "french_tarragon",
    "nameEn": "French Tarragon",
    "nameEs": "Estragón Francés Fresco",
    "ipa": "/ˈtær.ə.ɡɑːn/",
    "zone": "Refrigerator (Paper Towel Wrap)",
    "zoneEs": "Refrigerador (Envuelto en Papel)",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Intense bittersweet licorice-anise flavor; the signature herb defining sauce béarnaise and roast chicken.",
    "culinaryNotesEs": "Sabor anisado y agridulce inconfundible; la hierba insignia de la salsa bearnesa y el pollo a la francesa.",
    "allergens": [],
    "audioPrompt": "French Tarragon, bittersweet anise herb essential to classic béarnaise."
  },
  {
    "id": "fresh_mint",
    "nameEn": "Spearmint / Hierbabuena",
    "nameEs": "Menta Fresca / Hierbabuena",
    "ipa": "/mɪnt/",
    "zone": "Refrigerator (Stands in Water)",
    "zoneEs": "Refrigerador (En Vaso de Agua)",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "High menthol cooling herb; pairs exquisitely with roasted lamb, minted peas, mojitos, and yogurt tzatziki.",
    "culinaryNotesEs": "Aroma fresco balsámico; maridaje perfecto con cordero asado, guisantes, tabulé y tzatziki griego.",
    "allergens": [],
    "audioPrompt": "Fresh Mint, cooling herbaceous leaves for lamb and refreshing drinks."
  },
  {
    "id": "fresh_dill",
    "nameEn": "Fresh Dill Weed",
    "nameEs": "Eneldo Fresco",
    "ipa": "/dɪl/",
    "zone": "Refrigerator (Stands in Water)",
    "zoneEs": "Refrigerador (En Vaso de Agua)",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Feathery fronds with an anise-citrus profile; partner to gravlax cured salmon, pickles, and sour cream.",
    "culinaryNotesEs": "Plumero aromático con notas anisadas; compañero inseparable del salmón marinado gravlax y encurtidos.",
    "allergens": [],
    "audioPrompt": "Fresh Dill, feathery herb pairing natively with cured salmon."
  },
  {
    "id": "fresh_chives",
    "nameEn": "Fresh Chives",
    "nameEs": "Cebollino Fresco",
    "ipa": "/tʃaɪvz/",
    "zone": "Refrigerator (Paper Towel Wrap)",
    "zoneEs": "Refrigerador (Envuelto en Papel)",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Slender hollow allium straws; slice paper-thin with a razor-sharp knife without bruising for mirror-finish omelets.",
    "culinaryNotesEs": "Tallos huecos de sabor suave a cebolla; córtalos finísimos sin aplastarlos para decorar tortillas francesas.",
    "allergens": [],
    "audioPrompt": "Fresh Chives, razor-sliced allium rings crowning French omelets."
  },
  {
    "id": "fresh_sage",
    "nameEn": "Fresh Sage Leaves",
    "nameEs": "Salvia Fresca",
    "ipa": "/seɪdʒ/",
    "zone": "Refrigerator (Paper Towel Wrap)",
    "zoneEs": "Refrigerador (Envuelto en Papel)",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Velvety gray-green leaves with camphor-pine tones; crisp whole in foaming brown butter for pasta and saltimbocca.",
    "culinaryNotesEs": "Hojas aterciopeladas con notas alcanforadas; fríelas en mantequilla avellanada hasta que queden crujientes.",
    "allergens": [],
    "audioPrompt": "Fresh Sage, fried in foaming butter for saltimbocca and gnocchi."
  },
  {
    "id": "fresh_oregano",
    "nameEn": "Mediterranean Oregano",
    "nameEs": "Orégano Fresco Mediterráneo",
    "ipa": "/ɔːˈrɛɡ.ə.noʊ/",
    "zone": "Refrigerator (Paper Towel Wrap)",
    "zoneEs": "Refrigerador (Envuelto en Papel)",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Pungent, slightly bitter herb loaded with carvacrol; dry form often yields more concentrated punch than fresh.",
    "culinaryNotesEs": "Hierba aromática intensa con carvacrol; su versión seca concentra aromas ideales para pizzas y marinadas griegas.",
    "allergens": [],
    "audioPrompt": "Mediterranean Oregano, robust aromatic herb defining pizza and souvlaki."
  },
  {
    "id": "bay_leaves",
    "nameEn": "Turkish Bay Leaves",
    "nameEs": "Hojas de Laurel Secas",
    "ipa": "/beɪ liːvz/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Dried whole leaves imparting eucalyptus, tea, and herbal depth to slow braises; discard before plating.",
    "culinaryNotesEs": "Hojas enteras que liberan notas balsámicas en guisos lentos; retíralas antes de servir ya que son rígidas.",
    "allergens": [],
    "audioPrompt": "Bay Leaves, essential dried leaf infusing broths and stews."
  },
  {
    "id": "black_peppercorns",
    "nameEn": "Tellicherry Black Peppercorns",
    "nameEs": "Pimienta Negra Tellicherry",
    "ipa": "/ˈtɛl.əˌtʃɛr.i ˈpɛp.ɚ/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry (Airtight)",
    "culinaryNotesEn": "King of spices; large berries harvested fully ripe on the vine, offering citrusy complexity and piperine bite.",
    "culinaryNotesEs": "Bayas maduras cosechadas a mano; muelen con perfume floral y un picor limpio gracias a la piperina.",
    "allergens": [],
    "audioPrompt": "Tellicherry Black Pepper, whole peppercorns ground fresh for cacio e pepe."
  },
  {
    "id": "maldon_salt",
    "nameEn": "Maldon Sea Salt Flakes",
    "nameEs": "Sal en Escamas Maldon",
    "ipa": "/ˈmɔːl.dən sɔːlt/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Pyramid-shaped natural sea salt crystals from Essex; never dissolve in cooking, use solely as crunchy finishing crunch.",
    "culinaryNotesEs": "Cristales piramidales quebradizos; úsala exclusivamente como sal de remate sobre carnes y chocolates.",
    "allergens": [],
    "audioPrompt": "Maldon Sea Salt, delicate pyramid crystals for finishing texture."
  },
  {
    "id": "kosher_salt",
    "nameEn": "Diamond Crystal Kosher Salt",
    "nameEs": "Sal Kosher de Grano Hueco",
    "ipa": "/ˈkoʊ.ʃɚ sɔːlt/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Hollow flake salt with 50% lower sodium density by volume than table salt; the universal chef seasoning benchmark.",
    "culinaryNotesEs": "Sal de cristal hueco que no sobre-sala por accidente; la medida estándar en recetas profesionales.",
    "allergens": [],
    "audioPrompt": "Diamond Crystal Kosher Salt, chef's tactile seasoning benchmark."
  },
  {
    "id": "smoked_paprika",
    "nameEn": "Smoked Spanish Paprika (Pimentón de la Vera)",
    "nameEs": "Pimentón Dulce Ahumado de la Vera",
    "ipa": "/pəˈpriː.kə/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry (Airtight, Dark)",
    "culinaryNotesEn": "Oak-wood smoked peppers ground into brick-red powder; key to authentic paella, chorizo, and romesco.",
    "culinaryNotesEs": "Pimientos secados lentamente con humo de leña de roble; alma de la paella valenciana y el chorizo.",
    "allergens": [],
    "audioPrompt": "Smoked Paprika, oak-smoked Spanish spice imparting deep barbecue warmth."
  },
  {
    "id": "saffron_threads",
    "nameEn": "Spanish Saffron Threads (Azafrán Coupé)",
    "nameEs": "Hebras de Azafrán Español",
    "ipa": "/ˈsæf.rən/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dark & Dry (Airtight)",
    "culinaryNotesEn": "World's most precious spice (crocus sativus stigmas); steep in warm broth for 15 minutes to bloom golden color and metallic honey aroma.",
    "culinaryNotesEs": "La especia más valiosa del mundo; infusiona en caldo tibio antes de añadir al arroz para aroma y color dorado.",
    "allergens": [],
    "audioPrompt": "Saffron Threads, steeped in warm stock to tint risottos and paellas gold."
  },
  {
    "id": "cumin_seeds",
    "nameEn": "Whole Cumin Seeds",
    "nameEs": "Semillas de Comino Enteras",
    "ipa": "/ˈkjuː.mɪn siːdz/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Earthy, nutty, warming spice; toast whole in dry pan until fragrant before crushing into Mexican carnitas or Indian curry.",
    "culinaryNotesEs": "Tuesta las semillas enteras en seco antes de molerlas para despertar sus aceites en guisos y moles.",
    "allergens": [],
    "audioPrompt": "Whole Cumin Seeds, toasted in dry pan to unleash smoky earthy oils."
  },
  {
    "id": "coriander_seeds",
    "nameEn": "Whole Coriander Seeds",
    "nameEs": "Semillas de Cilantro Enteras",
    "ipa": "/ˈkɔːr.iˌæn.dɚ/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Citrusy, floral seeds with warm orange peel nuances; crush coarsely for duck breast crusts and pickling brines.",
    "culinaryNotesEs": "Semillas cítricas con notas de cáscara de naranja; machaca para costras de pato y salmueras de encurtidos.",
    "allergens": [],
    "audioPrompt": "Coriander Seeds, citrus-scented seeds for charcuterie and spice rubs."
  },
  {
    "id": "star_anise",
    "nameEn": "Star Anise Pods",
    "nameEs": "Anís Estrellado",
    "ipa": "/stɑːr ˈæn.ɪs/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Eight-pointed star pods rich in anethole; foundational spice in Vietnamese Phở broth and Chinese five-spice powder.",
    "culinaryNotesEs": "Estrellas aromáticas ricas en anetol; especia angular del caldo vietnamita Phở y estofados de cerdo.",
    "allergens": [],
    "audioPrompt": "Star Anise, eight-pointed aromatic spice infusing Vietnamese pho broth."
  },
  {
    "id": "cinnamon_sticks",
    "nameEn": "Ceylon Cinnamon Quills (True Cinnamon)",
    "nameEs": "Canela de Ceilán en Rama",
    "ipa": "/ˈsɪn.ə.mən/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Delicate paper-thin layered bark quills with subtle floral sweetness, far gentler and more complex than harsh cassia.",
    "culinaryNotesEs": "Corteza fina enrollada en láminas; aroma floral refinado ideal para postres y guisos marroquíes.",
    "allergens": [],
    "audioPrompt": "Ceylon Cinnamon, delicate multi-layered bark quills with sweet floral warmth."
  },
  {
    "id": "nutmeg_whole",
    "nameEn": "Whole Nutmeg with Grater",
    "nameEs": "Nuez Moscada Entera",
    "ipa": "/ˈnʌt.mɛɡ/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Hard seed of Myristica fragrans; grate freshly into dairy bechamel, ricotta fillings, and creamed spinach.",
    "culinaryNotesEs": "Semilla dura aromática; rállala fresca sobre bechamel, purés y rellenos de pasta con ricota.",
    "allergens": [],
    "audioPrompt": "Whole Nutmeg, freshly grated to elevate bechamel and potato gratins."
  },
  {
    "id": "cloves_whole",
    "nameEn": "Whole Cloves",
    "nameEs": "Clavo de Olor Entero",
    "ipa": "/kloʊvz/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Dried flower buds rich in eugenol; stud into halved onions (onion piqué) to flavor classic French béchamel.",
    "culinaryNotesEs": "Capullos secos intensos en eugenol; clávalos en una cebolla para aromatizar la leche de la bechamel.",
    "allergens": [],
    "audioPrompt": "Whole Cloves, dried flower buds spiked into onions for savory broths."
  },
  {
    "id": "cardamom_pods",
    "nameEn": "Green Cardamom Pods",
    "nameEs": "Cardamomo Verde en Vainas",
    "ipa": "/ˈkɑːr.də.məm/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Queen of spices; crack green papery pods to retrieve black seeds tasting of eucalyptus, camphor, and mint.",
    "culinaryNotesEs": "Abre la vaina verde para liberar las semillas negras con aromas de eucalipto, menta y cítricos.",
    "allergens": [],
    "audioPrompt": "Green Cardamom, cracked pods releasing resinous citrus-mint seeds."
  },
  {
    "id": "fennel_seeds",
    "nameEn": "Fennel Seeds",
    "nameEs": "Semillas de Hinojo",
    "ipa": "/ˈfɛn.əl siːdz/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Sweet licorice flavor; the essential defining spice in Italian pork sausages, porchetta, and rye breads.",
    "culinaryNotesEs": "Sabor dulce y anisado; la especia definitoria de la salchicha italiana y la porchetta toscana.",
    "allergens": [],
    "audioPrompt": "Fennel Seeds, sweet licorice notes defining Italian sausages and porchetta."
  },
  {
    "id": "sumac_powder",
    "nameEn": "Wild Sumac Spice",
    "nameEs": "Zumaque / Sumac Molido",
    "ipa": "/ˈsuː.mæk/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Tart, ruby-red ground berry providing natural astringent lemon-like acidity without adding liquid.",
    "culinaryNotesEs": "Baya roja molida de acidez cítrica astringente; ideal para espolvorear carnes a la brasa y hummus.",
    "allergens": [],
    "audioPrompt": "Sumac, tart ruby powder adding dry citrus acidity to grilled meats."
  },
  {
    "id": "zaatar_blend",
    "nameEn": "Za'atar Spice Blend",
    "nameEs": "Mezcla de Especias Za'atar",
    "ipa": "/ˈzɑː.tɑːr/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Middle Eastern blend of wild thyme, toasted sesame seeds, sumac, and sea salt; mixed with olive oil for flatbread dipping.",
    "culinaryNotesEs": "Mezcla de tomillo salvaje, sésamo tostado, sumac y sal marina; deliciosa con pan plano y aceite.",
    "allergens": [
      "Sesame / Sésamo"
    ],
    "audioPrompt": "Za'atar, Middle Eastern blend of wild thyme, toasted sesame, and sumac."
  },
  {
    "id": "curry_powder_madras",
    "nameEn": "Madras Curry Powder",
    "nameEs": "Curry Madrás en Polvo",
    "ipa": "/ˈmæd.rəs ˈkɝː.i/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Aromatic blend of turmeric, coriander, cumin, fenugreek, and chili; blooms in hot oil before liquids.",
    "culinaryNotesEs": "Mezcla con cúrcuma, cilantro, comino y fenogreco; sofríela en aceite caliente para activar aromas.",
    "allergens": [],
    "audioPrompt": "Madras Curry Powder, golden aromatic spice blend for stews."
  },
  {
    "id": "vanilla_bean_tahitian",
    "nameEn": "Whole Tahitian Vanilla Bean",
    "nameEs": "Vaina de Vainilla de Tahití",
    "ipa": "/vəˈnɪl.ə biːn/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dark (Never in Fridge)",
    "culinaryNotesEn": "Plump oily pod loaded with millions of floral caviar seeds; split lengthwise and scrape caviar with knife spine.",
    "culinaryNotesEs": "Vaina carnosa repleta de caviar aromático; ábrela a lo largo y raspa las semillas con el lomo del cuchillo.",
    "allergens": [],
    "audioPrompt": "Tahitian Vanilla Bean, floral plump pod scraped for custards."
  },
  {
    "id": "juniper_berries",
    "nameEn": "Dried Juniper Berries",
    "nameEs": "Bayas de Enebro Secas",
    "ipa": "/ˈdʒuː.nə.pɚ ˈbɛr.iz/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Fresh Herbs & Spices",
    "categoryEs": "Hierbas y Especias",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Pungent, piney gin-flavoring berry; crush with knife flat before dropping into venison and duck marinades.",
    "culinaryNotesEs": "Bayas aromáticas que dan sabor a la ginebra; aplástalas para marinadas de caza, ciervo y pato.",
    "allergens": [],
    "audioPrompt": "Juniper Berries, resinous pine berries traditional in wild game cookery."
  },
  {
    "id": "evoo_cold_pressed",
    "nameEn": "Extra Virgin Olive Oil (Cold-Pressed)",
    "nameEs": "Aceite de Oliva Virgen Extra (AOVE)",
    "ipa": "/ˈɛk.strə ˈvɝː.dʒɪn ˈɑː.lɪv ɔɪl/",
    "zone": "Dry Pantry (Cool, Dark)",
    "zoneEs": "Despensa Seca",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "14°C to 18°C (Away from light and heat)",
    "culinaryNotesEn": "First cold extraction under 27°C with acidity under 0.8%; grassy, peppery polyphenols for cold finishing dressings.",
    "culinaryNotesEs": "Extracción en frío con acidez menor al 0.8%; sabor frutado con picor en garganta para aliños crudos.",
    "allergens": [],
    "audioPrompt": "Extra Virgin Olive Oil, cold-pressed nectar for finishing and vinaigrettes."
  },
  {
    "id": "canola_avocado_oil",
    "nameEn": "Refined Avocado Oil (High-Smoke Point)",
    "nameEs": "Aceite de Aguacate Refinado (Alto Punto de Humo)",
    "ipa": "/ˌæv.əˈkɑː.doʊ ɔɪl/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Smoke point of 520°F (271°C); the ultimate neutral high-heat frying and searing medium.",
    "culinaryNotesEs": "Punto de humo de 270°C; el mejor aceite neutro para sellar carnes en sartén de hierro sin quemar grasa.",
    "allergens": [],
    "audioPrompt": "Refined Avocado Oil, 520-degree smoke point ideal for hard steak searing."
  },
  {
    "id": "toasted_sesame_oil",
    "nameEn": "Pure Toasted Sesame Oil",
    "nameEs": "Aceite de Sésamo Tostado",
    "ipa": "/ˈtoʊ.stɪd ˈsɛs.ə.mi ɔɪl/",
    "zone": "Dry Pantry / Refrigerator",
    "zoneEs": "Despensa Seca",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "Cool Dark Cupboard",
    "culinaryNotesEn": "Dark amber finishing oil with intense roasted nutty perfume; drizzle at the final second off the flame.",
    "culinaryNotesEs": "Aceite ámbar oscuro de perfume torrefacto; rocía solo unas gotas al retirar del fuego para no quemarlo.",
    "allergens": [
      "Sesame / Sésamo"
    ],
    "audioPrompt": "Toasted Sesame Oil, potent aromatic finishing oil for stir-fries."
  },
  {
    "id": "duck_fat",
    "nameEn": "Rendered Duck Fat (Graisse de Canard)",
    "nameEs": "Grasa de Pato Purificada",
    "ipa": "/dʌk fæt/",
    "zone": "Refrigerator",
    "zoneEs": "Refrigerador",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Rich, silky animal fat with low melting point; the holy grail for making confit and the world's crispiest roast potatoes.",
    "culinaryNotesEs": "Grasa sedosa y aromática; el secreto de los bistrós franceses para confitados y patatas asadas ultracrocantes.",
    "allergens": [],
    "audioPrompt": "Rendered Duck Fat, liquid gold for confiting legs and roasting potatoes."
  },
  {
    "id": "balsamic_modena",
    "nameEn": "Traditional Balsamic Vinegar of Modena DOP",
    "nameEs": "Vinagre Balsámico Tradicional de Módena DOP",
    "ipa": "/bɑːlˈsæm.ɪk ˈvɪn.ə.ɡɚ/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Aged 12 to 25 years in succession of wooden casks; syrupy, glossy reduction dripped on Parmigiano or strawberries.",
    "culinaryNotesEs": "Envejecido de 12 a 25 años en toneles de maderas nobles; néctar espeso para rematar quesos curados y fresas.",
    "allergens": [],
    "audioPrompt": "Traditional Balsamic Vinegar of Modena, aged syrupy treasure."
  },
  {
    "id": "sherry_vinegar",
    "nameEn": "Aged Sherry Vinegar (Vinagre de Jerez DOP)",
    "nameEs": "Vinagre de Jerez Reserva DOP",
    "ipa": "/ˈʃɛr.i ˈvɪn.ə.ɡɚ/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Spanish oak-aged vinegar produced via the Solera system; complex nutty acidity for authentic gazpacho.",
    "culinaryNotesEs": "Vinagre andaluz criado en barricas de roble por criaderas y soleras; alma ácida del gazpacho y escabeches.",
    "allergens": [],
    "audioPrompt": "Sherry Vinegar, Spanish solera-aged vinegar with nutty complexity."
  },
  {
    "id": "apple_cider_vinegar",
    "nameEn": "Raw Apple Cider Vinegar (with the Mother)",
    "nameEs": "Vinagre de Manzana Sin Filtrar",
    "ipa": "/ˈæp.əl ˈsaɪ.dɚ ˈvɪn.ə.ɡɚ/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Fruity, tangy unfiltered vinegar containing living bacterial mother; brightens barbecue mops and quick pickles.",
    "culinaryNotesEs": "Vinagre afrutado sin filtrar con la madre bacteriana viva; equilibra salsas barbacoa y encurtidos.",
    "allergens": [],
    "audioPrompt": "Apple Cider Vinegar, fruity unfiltered acidity with live cultures."
  },
  {
    "id": "rice_wine_vinegar",
    "nameEn": "Unseasoned Japanese Rice Vinegar",
    "nameEs": "Vinagre de Arroz Japonés Puro",
    "ipa": "/raɪs ˈvɪn.ə.ɡɚ/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Milder acidity (4.2%) with gentle sweetness; combine with sugar and salt to season sushi rice (sushizu).",
    "culinaryNotesEs": "Acidez suave del 4% con notas dulces; disuélvelo con sal y azúcar para aderezar el arroz de sushi.",
    "allergens": [],
    "audioPrompt": "Rice Vinegar, gentle mellow acidity seasoned for sushi rice."
  },
  {
    "id": "dijon_mustard",
    "nameEn": "Authentic Dijon Mustard",
    "nameEs": "Mostaza de Dijon Francesa",
    "ipa": "/diːˈʒɑːn ˈmʌs.tɚd/",
    "zone": "Refrigerator (After Opening)",
    "zoneEs": "Refrigerador (Tras Abrir)",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Prepared with brown mustard seeds and white wine verjuice; serves as a powerful natural lecithin emulsifier in vinaigrettes.",
    "culinaryNotesEs": "Elaborada con semillas pardas y agraz de uva; su lecitina natural actúa como agente emulsionante en vinagretas.",
    "allergens": [
      "Mustard / Mostaza"
    ],
    "audioPrompt": "Dijon Mustard, sharp French condiment acting as an emulsifying binder."
  },
  {
    "id": "whole_grain_mustard",
    "nameEn": "Whole Grain Mustard (Moutarde à l'Ancienne)",
    "nameEs": "Mostaza a la Antigua con Semillas Enteras",
    "ipa": "/hoʊl ɡreɪn ˈmʌs.tɚd/",
    "zone": "Refrigerator (After Opening)",
    "zoneEs": "Refrigerador (Tras Abrir)",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Uncrushed whole mustard seeds providing textural popping crunch; stir into pork glazes and potato salads.",
    "culinaryNotesEs": "Semillas enteras sin moler que estallan en boca; perfecta en glaseados de chuletas y ensaladas camperas.",
    "allergens": [
      "Mustard / Mostaza"
    ],
    "audioPrompt": "Whole Grain Mustard, rustic seeded spread providing pleasant popping texture."
  },
  {
    "id": "shoyu_soy_sauce",
    "nameEn": "Japanese Shoyu (Brewed Soy Sauce)",
    "nameEs": "Salsa de Soja Shoyu de Fermentación Natural",
    "ipa": "/ˈsɔɪ sɔːs/",
    "zone": "Dry Pantry / Refrigerator",
    "zoneEs": "Despensa Seca",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "Cool Dark Shelf (Refrigerate for Peak Flavor)",
    "culinaryNotesEn": "Brewed from equal parts fermented soybeans and roasted wheat; delivers intense savory glutamates to glazes.",
    "culinaryNotesEs": "Fermentada lentamente con soja y trigo tostado; fuente monumental de ácido glutámico para glaseados.",
    "allergens": [
      "Soy / Soja",
      "Gluten / Trigo"
    ],
    "audioPrompt": "Shoyu Soy Sauce, naturally brewed umami powerhouse."
  },
  {
    "id": "fish_sauce_viet",
    "nameEn": "Red Boat 40°N Fish Sauce",
    "nameEs": "Salsa de Pescado Pura (Nuoc Mam / Nam Pla)",
    "ipa": "/fɪʃ sɔːs/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Black anchovies fermented with sea salt for 12 months in wooden barrels; liquid umami depth for curries and dressings.",
    "culinaryNotesEs": "Anchoas fermentadas con sal marina en barricas de madera durante un año; condimento maestro del sudeste asiático.",
    "allergens": [
      "Fish / Pescado"
    ],
    "audioPrompt": "Fish Sauce, pure barrel-aged anchovy extract delivering deep savory backbone."
  },
  {
    "id": "worcestershire_sauce",
    "nameEn": "Lea & Perrins Worcestershire Sauce",
    "nameEs": "Salsa Worcestershire / Salsa Inglesa",
    "ipa": "/ˈwʊs.tɚ.ʃɚ sɔːs/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Aged blend of malt vinegar, tamarind, anchovies, and molasses; essential seasoning for steak tartare and Caesar dressing.",
    "culinaryNotesEs": "Mezcla macerada de vinagre de malta, tamarindo, anchoas y melaza; clave en el steak tartar y aderezo César.",
    "allergens": [
      "Fish / Pescado"
    ],
    "audioPrompt": "Worcestershire Sauce, barrel-matured condiment seasoning beef tartare."
  },
  {
    "id": "miso_paste_white",
    "nameEn": "Shiro Miso (Sweet White Miso Paste)",
    "nameEs": "Pasta Miso Blanco Dulce (Shiro Miso)",
    "ipa": "/ˈʃiː.roʊ ˈmiː.soʊ/",
    "zone": "Refrigerator",
    "zoneEs": "Refrigerador",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Short-fermentation soybean and rice paste with sweet, creamy, gentle salt profile; famous for miso-glazed black cod.",
    "culinaryNotesEs": "Fermentación corta de soja y arroz; sabor dulce y suave ideal para el glaseado del bacalao negro de Nobu.",
    "allergens": [
      "Soy / Soja"
    ],
    "audioPrompt": "White Shiro Miso, sweet fermented soybean paste for broths and glazes."
  },
  {
    "id": "gochujang_paste",
    "nameEn": "Korean Gochujang Fermented Chili Paste",
    "nameEs": "Pasta de Chile Fermentada Coreana Gochujang",
    "ipa": "/ˈɡoʊ.tʃuː.dʒæŋ/",
    "zone": "Refrigerator (After Opening)",
    "zoneEs": "Refrigerador (Tras Abrir)",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Thick savory paste of chili powder, fermented soybeans, and glutinous rice; sweet, savory, pungent kick for wings.",
    "culinaryNotesEs": "Pasta espesa de arroz glutinoso y soja fermentada con chiles; el secreto de las alitas y marinadas coreanas.",
    "allergens": [
      "Soy / Soja"
    ],
    "audioPrompt": "Gochujang Paste, sweet and savory Korean fermented pepper paste."
  },
  {
    "id": "capers_brine",
    "nameEn": "Nonpareil Capers in Brine",
    "nameEs": "Alcaparras Nonpareil en Salmuera",
    "ipa": "/ˈkeɪ.pɚz/",
    "zone": "Refrigerator (After Opening)",
    "zoneEs": "Refrigerador (Tras Abrir)",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Tiny unripened flower buds of Capparis spinosa; salty, briny, floral acid bursts cutting through rich butter sauces.",
    "culinaryNotesEs": "Diminutos botones florales encurtidos; aportan explosiones ácidas que equilibran salsas como piccata y meunière.",
    "allergens": [],
    "audioPrompt": "Capers in Brine, floral pickled buds cutting through rich butter sauces."
  },
  {
    "id": "cornichons",
    "nameEn": "French Baby Cornichons",
    "nameEs": "Pepinillos Franceses en Vinagre / Cornichons",
    "ipa": "/ˈkɔːr.nɪ.ʃɑːnz/",
    "zone": "Refrigerator (After Opening)",
    "zoneEs": "Refrigerador (Tras Abrir)",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "1°C to 4°C",
    "culinaryNotesEn": "Tiny gherkins pickled in vinegar with tarragon, pearl onions, and mustard seeds; classic pairing for charcuterie and raclette.",
    "culinaryNotesEs": "Pepinillos enanos avinagrados con estragón; limpian el paladar al degustar tablas de paté y quesos fundidos.",
    "allergens": [
      "Mustard / Mostaza"
    ],
    "audioPrompt": "French Cornichons, crisp sour gherkins cutting through rich charcuterie."
  },
  {
    "id": "kalamata_olives",
    "nameEn": "Kalamata Olives (Greek)",
    "nameEs": "Aceitunas Kalamata Griegas",
    "ipa": "/ˌkæl.əˈmɑː.tə ˈɑː.lɪvz/",
    "zone": "Dry Pantry / Refrigerator",
    "zoneEs": "Despensa Seca",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "1°C to 4°C (Once opened)",
    "culinaryNotesEn": "Almond-shaped dark purple Greek olives cured in red wine vinegar and olive oil; rich, fruity, winey finish.",
    "culinaryNotesEs": "Aceitunas moradas curadas en salmuera con vinagre de vino tinto; carnosas y frutadas en ensaladas griegas.",
    "allergens": [],
    "audioPrompt": "Kalamata Olives, deep purple Greek gems cured in wine vinegar."
  },
  {
    "id": "all_purpose_flour",
    "nameEn": "Unbleached All-Purpose Flour",
    "nameEs": "Harina de Trigo Todo Uso",
    "ipa": "/flɑʊ.ɚ/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Cool, Dry, Airtight Container",
    "culinaryNotesEn": "10–12% protein content blend of hard and soft wheat; balanced elasticity and tenderness for roux, cakes, and pastry.",
    "culinaryNotesEs": "Harina equilibrada con 11% de proteína; base versátil para espesar roux, masas de tarta y salsas.",
    "allergens": [
      "Gluten / Trigo"
    ],
    "audioPrompt": "All-Purpose Flour, versatile 11-percent protein flour for baking and roux."
  },
  {
    "id": "bread_flour",
    "nameEn": "High-Gluten Bread Flour (Tipo 0 / Strong)",
    "nameEs": "Harina de Fuerza para Panadería",
    "ipa": "/brɛd flɑʊ.ɚ/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Cool, Dry, Airtight",
    "culinaryNotesEn": "12.5–14% protein flour creating robust gluten networks; essential for high-hydration sourdough and chewy pizza dough.",
    "culinaryNotesEs": "Harina con 13% de proteína que desarrolla mallas de gluten tenaces para panes con grandes alvéolos y pizzas.",
    "allergens": [
      "Gluten / Trigo"
    ],
    "audioPrompt": "Bread Flour, high-protein flour for open sourdough crumb and chewy pizza."
  },
  {
    "id": "tipo_00_flour",
    "nameEn": "Italian Tipo 00 Pizza Flour (Caputo)",
    "nameEs": "Harina Italiana Tipo 00",
    "ipa": "/ˈtiː.poʊ ˈzɪə.roʊ ˈzɪə.roʊ/",
    "zone": "Dry Pantry / Cellar",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Cool, Dry",
    "culinaryNotesEn": "Super-fine talcum-like grind with high extensibility; withstands scorching 900°F (480°C) wood-fired pizza ovens without burning.",
    "culinaryNotesEs": "Molienda finísima como talco; resiste temperaturas de 450°C en hornos de leña sin quemar la masa.",
    "allergens": [
      "Gluten / Trigo"
    ],
    "audioPrompt": "Italian Tipo 00 Flour, superfine wheat flour for Neapolitan pizza."
  },
  {
    "id": "cornstarch",
    "nameEn": "Pure Cornstarch / Maizena",
    "nameEs": "Fécula de Maíz / Maicena",
    "ipa": "/ˈkɔːrn.stɑːrtʃ/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Dry, Airtight",
    "culinaryNotesEn": "Pure grain starch; must be made into a cold liquid slurry before adding to hot simmering sauces to prevent clumping.",
    "culinaryNotesEs": "Disuélvela siempre en un poco de líquido frío antes de incorporarla al caldo hirviendo para evitar grumos.",
    "allergens": [],
    "audioPrompt": "Cornstarch, neutral slurry thickener creating glossy translucent sauces."
  },
  {
    "id": "active_dry_yeast",
    "nameEn": "Instant Dry Yeast",
    "nameEs": "Levadura Seca Instantánea de Panadería",
    "ipa": "/ˈɪn.stənt jiːst/",
    "zone": "Dry Pantry / Refrigerator",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Keep refrigerated once opened",
    "culinaryNotesEn": "Microscopic Saccharomyces cerevisiae fungal cells; can be mixed directly with dry flour without prior proofing.",
    "culinaryNotesEs": "Células vivas deshidratadas; se añade directamente a la harina sin necesidad de activarla previamente en agua.",
    "allergens": [],
    "audioPrompt": "Instant Dry Yeast, live baker's yeast leavening breads and focaccias."
  },
  {
    "id": "arborio_rice",
    "nameEn": "Arborio Risotto Rice",
    "nameEs": "Arroz Arborio para Risotto",
    "ipa": "/ɑːrˈbɔːr.i.oʊ raɪs/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Italian short-grain rice with high surface amylopectin starch; releases thick creamy starch when stirred vigorously.",
    "culinaryNotesEs": "Arroz italiano de grano corto que suelta amilopectina durante el removido enérgico, creando el cremoso 'mantecato'.",
    "allergens": [],
    "audioPrompt": "Arborio Rice, starch-rich grain yielding silky Italian risotto."
  },
  {
    "id": "carnaroli_rice",
    "nameEn": "Carnaroli Risotto Rice (The King of Rice)",
    "nameEs": "Arroz Carnaroli (El Rey del Risotto)",
    "ipa": "/kɑːr.nəˈroʊ.li/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Higher amylose content and firmer grain core than Arborio; resists overcooking and absorbs maximum stock flavor.",
    "culinaryNotesEs": "Mayor porcentaje de amilosa que el Arborio; retiene un núcleo al dente impecable absorbiendo caldos densos.",
    "allergens": [],
    "audioPrompt": "Carnaroli Rice, the chef's preferred grain for al dente restaurant risotto."
  },
  {
    "id": "bomba_rice",
    "nameEn": "Spanish Bomba Paella Rice (DOP Calasparra)",
    "nameEs": "Arroz Bomba para Paella DOP",
    "ipa": "/ˈbɑːm.bə raɪs/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Absorbs 3 times its volume in broth while remaining plump and separated; never stir once paella simmer begins to form socarrat.",
    "culinaryNotesEs": "Absorbe el triple de su volumen en caldo sin romperse; jamás se remueve para permitir que se forme el socarrat crujiente.",
    "allergens": [],
    "audioPrompt": "Bomba Rice, Spanish paella grain absorbing triple liquid without bursting."
  },
  {
    "id": "panko_breadcrumbs",
    "nameEn": "Japanese Panko Breadcrumbs",
    "nameEs": "Pan Rallado Japonés Panko",
    "ipa": "/ˈpɑːŋ.koʊ/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Airtight Container",
    "culinaryNotesEn": "Coarse crustless bread flakes baked with electrical current; absorbs far less oil than traditional breadcrumbs for light crunch.",
    "culinaryNotesEs": "Copos grandes y aireados horneados sin corteza por corriente eléctrica; absorben menos aceite quedando ultracrocantes.",
    "allergens": [
      "Gluten / Trigo"
    ],
    "audioPrompt": "Panko Breadcrumbs, coarse airy flakes providing featherlight fried crusts."
  },
  {
    "id": "granulated_sugar",
    "nameEn": "Pure Cane Granulated Sugar",
    "nameEs": "Azúcar Blanco Refinado de Caña",
    "ipa": "/ˈʃʊɡ.ɚ/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Ambient Dry (Airtight)",
    "culinaryNotesEn": "Pure sucrose; not just a sweetener, but a hygroscopic tenderizer that retains moisture and promotes caramelization.",
    "culinaryNotesEs": "Sacarosa pura; además de endulzar, retiene agua en masas impidiendo que el pan se seque y dora la corteza.",
    "allergens": [],
    "audioPrompt": "Granulated Sugar, pure sucrose tenderizing crumb and caramelizing."
  },
  {
    "id": "dark_brown_sugar",
    "nameEn": "Dark Muscovado Brown Sugar",
    "nameEs": "Azúcar Moreno / Mascabado Oscuro",
    "ipa": "/brɑʊn ˈʃʊɡ.ɚ/",
    "zone": "Dry Pantry (Airtight with Clay Disc)",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Ambient Airtight",
    "culinaryNotesEn": "Refined sugar saturated with 6.5% natural cane molasses; brings deep toffee, caramel notes and chewy moisture to cookies.",
    "culinaryNotesEs": "Azúcar con alto contenido de melaza natural; aporta notas de toffee y una humedad masticable a galletas.",
    "allergens": [],
    "audioPrompt": "Dark Brown Sugar, molasses-rich sugar for chewy cookies and glazes."
  },
  {
    "id": "baking_powder",
    "nameEn": "Double-Acting Baking Powder",
    "nameEs": "Polvo para Hornear de Doble Acción (Levadura Química)",
    "ipa": "/ˈbeɪ.kɪŋ ˈpɑʊ.dɚ/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Ambient Dry (Check Expiration)",
    "culinaryNotesEn": "Releases CO2 gas twice: first upon moisture contact, and second when exposed to oven heat above 140°F (60°C).",
    "culinaryNotesEs": "Libera gas carbónico en dos fases: al hidratar la masa en frío y al recibir el calor del horno a 60°C.",
    "allergens": [],
    "audioPrompt": "Double-Acting Baking Powder, chemical leavener inflating cakes in two thermal stages."
  },
  {
    "id": "baking_soda",
    "nameEn": "Pure Sodium Bicarbonate (Baking Soda)",
    "nameEs": "Bicarbonato de Sodio Puro",
    "ipa": "/ˈbeɪ.kɪŋ ˈsoʊ.də/",
    "zone": "Dry Pantry",
    "zoneEs": "Despensa Seca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "Ambient Dry",
    "culinaryNotesEn": "Alkaline chemical leavener requiring an acid (buttermilk, lemon, cocoa) to react, release gas, and promote Maillard browning.",
    "culinaryNotesEs": "Impulsor alcalino que necesita un ácido (suero, limón, café) para reaccionar y acelerar el dorado Maillard.",
    "allergens": [],
    "audioPrompt": "Baking Soda, alkaline salt reacting with acids to leaven and brown."
  },
  {
    "id": "dark_chocolate_70",
    "nameEn": "Valrhona Guanaja 70% Dark Couverture Chocolate",
    "nameEs": "Chocolate Cobertura Negra 70% (Valrhona)",
    "ipa": "/ˈtʃɑːk.lət/",
    "zone": "Dry Pantry (Cool, 16°C–18°C)",
    "zoneEs": "Despensa Seca Fresca",
    "category": "Baking & Grains",
    "categoryEs": "Panadería y Granos",
    "storageTemp": "16°C to 18°C (Humidity < 50%)",
    "culinaryNotesEn": "High cocoa butter percentage (over 31%); temper carefully through 31°C curve for glossy snap and no bloom.",
    "culinaryNotesEs": "Alto porcentaje de manteca de cacao pura; atempera a 31°C para que cristalice con brillo de espejo y quiebre seco.",
    "allergens": [
      "May contain Milk / Puede contener Trazas de Lácteos"
    ],
    "audioPrompt": "70% Dark Couverture Chocolate, high cocoa butter for professional tempering."
  },
  {
    "id": "veal_demi_glace",
    "nameEn": "Classic Veal Demi-Glace",
    "nameEs": "Demi-Glace de Ternera Concentrado",
    "ipa": "/ˈdɛm.i ɡlɑːs/",
    "zone": "Refrigerator / Freezer",
    "zoneEs": "Refrigerador / Congelador",
    "category": "Oils, Vinegars & Condiments",
    "categoryEs": "Aceites y Condimentos",
    "storageTemp": "1°C to 4°C (Freeze in ice cubes)",
    "culinaryNotesEn": "Rich sauce made by simmering roasted veal bones, mirepoix, tomato paste, and red wine reduced by 50% into liquid silk.",
    "culinaryNotesEs": "Fondo oscuro de huesos de ternera asados reducido al 50% con vino tinto; la reina de las salsas de restaurante.",
    "allergens": [],
    "audioPrompt": "Veal Demi-Glace, gelatinous reduction forming the bedrock of steak sauces."
  }
];

  const culinaryVerbsAndSlang = [
  {
    "id": "cut_julienne",
    "termEn": "Julienne",
    "termEs": "Corte Juliana",
    "ipa": "/ˌdʒuː.liˈɛn/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Precision matchstick cut measuring exactly 1/8 inch × 1/8 inch × 2 inches (3mm × 3mm × 5cm).",
    "contextEs": "Corte fino en tiras o bastoncillos uniformes de 3 mm de grosor por 5 cm de longitud.",
    "exampleDialogueEn": "“Commis, julienne these leeks and carrots for the consommé garnish right away!”",
    "exampleDialogueEs": "“¡Ayudante, corta en juliana estos puerros y zanahorias para la guarnición del consomé de inmediato!”",
    "audioPrompt": "Julienne, classical matchstick cut measuring 3 millimeters by 5 centimeters."
  },
  {
    "id": "cut_brunoise",
    "termEn": "Brunoise",
    "termEs": "Corte Brunoise",
    "ipa": "/bruːnˈwɑːz/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Tiny cubes cut from julienne strips measuring precisely 1/8 inch × 1/8 inch × 1/8 inch (3mm × 3mm × 3mm).",
    "contextEs": "Dados diminutos obtenidos a partir de la juliana, de exactamente 3 mm por 3 mm por 3 mm.",
    "exampleDialogueEn": "“I need a fine brunoise of shallots for the mignonette sauce before service starts.”",
    "exampleDialogueEs": "“Necesito una brunoise finísima de chalotas para la salsa mignonette antes de empezar el servicio.”",
    "audioPrompt": "Brunoise, miniature 3-millimeter cubes for refined garnishes."
  },
  {
    "id": "cut_fine_brunoise",
    "termEn": "Fine Brunoise",
    "termEs": "Brunoise Fina",
    "ipa": "/faɪn bruːnˈwɑːz/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Microscopic cubes measuring 1/16 inch × 1/16 inch × 1/16 inch (1.5mm × 1.5mm × 1.5mm) cut from fine julienne.",
    "contextEs": "Cubos microscópicos de 1.5 mm de lado cortados a partir de juliana fina para consomés reales.",
    "exampleDialogueEn": "“This truffle needs to be cut in fine brunoise to float on the chilled oyster velouté.”",
    "exampleDialogueEs": "“Esta trufa debe cortarse en brunoise fina para que flote sobre el velouté de ostras.”",
    "audioPrompt": "Fine Brunoise, microscopic 1.5-millimeter cubes requiring surgical precision."
  },
  {
    "id": "cut_batonnet",
    "termEn": "Bâtonnet",
    "termEs": "Bastoncillo / Bâtonnet",
    "ipa": "/bɑː.tɔːˈneɪ/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Thick stick cut measuring 1/4 inch × 1/4 inch × 2 inches (6mm × 6mm × 5cm); foundation for medium dice.",
    "contextEs": "Bastón grueso de 6 mm de grosor por 5 cm de largo; base para el corte en dados medianos.",
    "exampleDialogueEn": "“Square off these Yukon potatoes and cut them into even bâtonnets for triple-cooked fries.”",
    "exampleDialogueEs": "“Cuadra estas papas y córtalas en bastones uniformes para hacer papas fritas de triple cocción.”",
    "audioPrompt": "Bâtonnet, thick stick cut measuring 6 millimeters by 5 centimeters."
  },
  {
    "id": "cut_small_dice",
    "termEn": "Small Dice (Macedoine)",
    "termEs": "Dado Pequeño / Macedoine",
    "ipa": "/smɔːl daɪs/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Cubes cut from bâtonnets measuring 1/4 inch × 1/4 inch × 1/4 inch (6mm × 6mm × 6mm).",
    "contextEs": "Dados regulares de 6 mm de lado para sopas campesinas y ensaladillas rusas.",
    "exampleDialogueEn": "“Small dice these root vegetables so they soften evenly during the twenty-minute simmer.”",
    "exampleDialogueEs": "“Corta en dados pequeños estas raíces para que se ablanden parejo en veinte minutos.”",
    "audioPrompt": "Small Dice, one-quarter inch cubes providing consistent cooking time."
  },
  {
    "id": "cut_medium_dice",
    "termEn": "Medium Dice (Parmentier)",
    "termEs": "Dado Mediano / Parmentier",
    "ipa": "/ˈmiː.di.əm daɪs/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Cubes measuring 1/2 inch × 1/2 inch × 1/2 inch (12mm × 12mm × 12mm); standard for hearty stews.",
    "contextEs": "Dados de 1.2 cm de lado; tamaño estándar para patatas salteadas y guisados de ternera.",
    "exampleDialogueEn": "“Cut the beef chuck and Yukon potatoes into medium dice for the Irish stew.”",
    "exampleDialogueEs": "“Corta el morcillo de ternera y las papas en dados medianos para el estofado.”",
    "audioPrompt": "Medium Dice, half-inch cubes tailored for hearty braises and stews."
  },
  {
    "id": "cut_large_dice",
    "termEn": "Large Dice (Carré)",
    "termEs": "Dado Grande / Carré",
    "ipa": "/lɑːrdʒ daɪs/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Substantial cubes measuring 3/4 inch × 3/4 inch × 3/4 inch (2cm × 2cm × 2cm) for long-braised pot roasts.",
    "contextEs": "Dados generosos de 2 cm de lado para carnes y calabazas que soportan largas horas de horno.",
    "exampleDialogueEn": "“The beef shoulder requires large dice so it holds structure after four hours in red wine.”",
    "exampleDialogueEs": "“La espaldilla de ternera requiere dados grandes para no desintegrarse tras cuatro horas en vino.”",
    "audioPrompt": "Large Dice, three-quarter inch cubes holding shape during multi-hour braising."
  },
  {
    "id": "cut_chiffonade",
    "termEn": "Chiffonade",
    "termEs": "Corte Chiffonade",
    "ipa": "/ˌʃɪf.əˈnɑːd/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Shredded ribbon cut produced by stacking and tightly rolling leaves (basil, sage, spinach) like a cigar.",
    "contextEs": "Corte en cintas o tiras finísimas enrollando las hojas tiernas como un habano antes de rebanar.",
    "audioPrompt": "Chiffonade, rolled herb ribbons cut with a single downward blade stroke.",
    "exampleDialogueEn": "“Roll the fresh basil leaves tight and slice into delicate chiffonade across the pasta.”",
    "exampleDialogueEs": "“Enrolla las hojas de albahaca bien apretadas y corta en fina chiffonade sobre la pasta.”"
  },
  {
    "id": "cut_mirepoix",
    "termEn": "Mirepoix",
    "termEs": "Corte Mirepoix",
    "ipa": "/mɪərˈpwɑː/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Rough, uniform chunks of aromatic vegetables (ratio: 2 parts onion, 1 part carrot, 1 part celery).",
    "contextEs": "Corte irregular de hortalizas aromáticas con proporción fija: 2 partes de cebolla, 1 de zanahoria y 1 de apio.",
    "exampleDialogueEn": "“Toss the mirepoix with tomato paste and roast until deeply browned for the veal stock.”",
    "exampleDialogueEs": "“Mezcla el mirepoix con concentrado de tomate y dora en el horno para el fondo oscuro de ternera.”",
    "audioPrompt": "Mirepoix, standard aromatic foundation of two parts onion, one carrot, one celery."
  },
  {
    "id": "cut_paysanne",
    "termEn": "Paysanne",
    "termEs": "Corte Paisana / Paysanne",
    "ipa": "/peɪˈzæn/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Flat, thin tiles measuring 1/2 inch × 1/2 inch × 1/8 inch (12mm × 12mm × 3mm) conforming to vegetable shape.",
    "contextEs": "Láminas finas cuadradas o triangulares de 12 mm por 3 mm de espesor para sopas tradicionales campesinas.",
    "exampleDialogueEn": "“Cut the leeks, carrots, and turnips en paysanne so they layer flat on the spoon.”",
    "exampleDialogueEs": "“Corta los puerros, zanahorias y nabos a la paisana para que quepan planos en la cuchara.”",
    "audioPrompt": "Paysanne, flat tile-shaped cuts designed for rustic European vegetable soups."
  },
  {
    "id": "cut_tourne",
    "termEn": "Tourné (Château)",
    "termEs": "Torneado Clásico Francés",
    "ipa": "/tʊərˈneɪ/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Classical French 7-sided football or barrel shape carved with curved bird's beak knife measuring 2 inches long.",
    "contextEs": "Corte clásico de alta cocina que talla vegetales en forma de barrilito de 7 caras curvas iguales.",
    "exampleDialogueEn": "“Every single potato must have seven identical facets, or the chef will send them back.”",
    "exampleDialogueEs": "“Cada patata debe tener exactamente siete facetas idénticas, o el chef las rechazará todas.”",
    "audioPrompt": "Tourné, classical French technique sculpting seven curved facets on root vegetables."
  },
  {
    "id": "cut_rondelle",
    "termEn": "Rondelle / Coin Cut",
    "termEs": "Rodajas / Rondelles",
    "ipa": "/rɑːnˈdɛl/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Round disc slices made by cutting cylindrical vegetables (carrots, cucumbers, zucchini) perpendicularly.",
    "contextEs": "Corte en rodajas transversales redondas de grosor regular a partir de vegetales cilíndricos.",
    "exampleDialogueEn": "“Slice the zucchini into 1/4-inch rondelles for the ratatouille tile presentation.”",
    "exampleDialogueEs": "“Corta el calabacín en rodajas de medio centímetro para disponerlas en espiral en el ratatouille.”",
    "audioPrompt": "Rondelle, crosswise disc slicing for cylindrical produce."
  },
  {
    "id": "cut_bias",
    "termEn": "Diagonal / Bias Cut",
    "termEs": "Corte al Bies / Oblicuo",
    "ipa": "/ˈbaɪ.əs kʌt/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Slicing cylindrical ingredients at an acute 45-degree angle to expose greater surface area for quick cooking.",
    "contextEs": "Corte oblicuo a 45 grados que expone mayor superficie interna para absorber salsas en salteados.",
    "exampleDialogueEn": "“Bias cut the scallions and lemongrass stalks to release aromatics rapidly in the wok.”",
    "exampleDialogueEs": "“Corta al bies las cebolletas y el limoncillo para que suelten sus aromas al instante en el wok.”",
    "audioPrompt": "Bias Cut, diagonal angle slicing maximizing surface exposure in stir-fries."
  },
  {
    "id": "cut_mince",
    "termEn": "Mince",
    "termEs": "Picado Fino / Minced",
    "ipa": "/mɪns/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Extremely fine, irregular chop (smaller than 1/16 inch) designed to dissolve into sauces, dressings, and marinades.",
    "contextEs": "Picado minúsculo casi imperceptible para que el ajo o chalota se funda en emulsiones y marinadas.",
    "exampleDialogueEn": "“Mince six cloves of garlic so fine that they melt without crunch in the aglio e olio.”",
    "exampleDialogueEs": "“Pica seis dientes de ajo tan fino que se fundan en el aceite sin masticarse tropezones.”",
    "audioPrompt": "Mince, very fine irregular chop designed to blend seamlessly into sauces."
  },
  {
    "id": "cut_concasse",
    "termEn": "Tomato Concassé",
    "termEs": "Tomate Concassé",
    "ipa": "/kɔːn.kəˈseɪ/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Tomatoes scored with an X, blanched 30 seconds, shocked in ice, peeled, seeded, and diced uniformly.",
    "contextEs": "Tomate escaldado 30 segundos, pelado, desprovisto de semillas y cortado en pequeños dados regulares.",
    "exampleDialogueEn": "“Fold the fresh tomato concassé into the warm butter sauce right before spooning over fish.”",
    "exampleDialogueEs": "“Añade el tomate concassé a la salsa de mantequilla justo antes de napar el pescado.”",
    "audioPrompt": "Tomato Concassé, peeled, seeded, and diced ripe tomatoes."
  },
  {
    "id": "cut_oblique",
    "termEn": "Roll-Cut / Oblique Cut",
    "termEs": "Corte Oblicuo Rodado / Roll-Cut",
    "ipa": "/oʊˈbliːk/",
    "category": "Knife Cuts",
    "categoryEs": "Cortes de Cuchillo",
    "contextEn": "Cutting long vegetables on a diagonal, rolling 90 degrees, and cutting again on a diagonal, creating two angled faces.",
    "contextEs": "Técnica donde se corta al bies, se rueda el vegetal 90 grados y se vuelve a cortar, creando piezas poliédricas.",
    "exampleDialogueEn": "“Roll-cut the carrots for the beef bourguignon so each piece has maximum braising surface.”",
    "exampleDialogueEs": "“Corta las zanahorias al bies rodado para que cada trozo absorba el vino del bourguignon por igual.”",
    "audioPrompt": "Roll-Cut, rotating diagonal cut creating faceted vegetable chunks."
  },
  {
    "id": "tech_saute",
    "termEn": "Sauté",
    "termEs": "Saltear",
    "ipa": "/soʊˈteɪ/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Cooking food rapidly in a small amount of fat over medium-high heat with constant tossing motion.",
    "contextEs": "Cocinar alimentos a fuego vivo con poca grasa manteniendo los trozos en continuo movimiento.",
    "exampleDialogueEn": "“Sauté the wild chantarelles with butter and shallots until golden and fragrant.”",
    "exampleDialogueEs": "“Saltea los rebozuelos con mantequilla y chalota hasta que doren y perfumen la cocina.”",
    "audioPrompt": "Sauté, French for to jump, cooking fast in shallow hot fat."
  },
  {
    "id": "tech_sear",
    "termEn": "Sear",
    "termEs": "Sellar / Marcar",
    "ipa": "/sɪər/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Browning the exterior of meat at intense heat (350°F+ / 175°C+) to trigger the Maillard reaction without overcooking interior.",
    "contextEs": "Dorar la superficie de la carne a muy alta temperatura para sellar y activar la reacción de Maillard.",
    "exampleDialogueEn": "“Get that cast iron smoking hot to sear the duck breast skin to a deep mahogany crackle.”",
    "exampleDialogueEs": "“Pon la sartén de hierro al punto de humo para sellar la piel del pato hasta dejarla crujiente.”",
    "audioPrompt": "Sear, high-heat browning initiating rich Maillard flavor compounds."
  },
  {
    "id": "tech_braise",
    "termEn": "Braise",
    "termEs": "Brasear / Estofar",
    "ipa": "/breɪz/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Two-step combination method: first searing at high heat, then simmering covered in liquid low and slow.",
    "contextEs": "Método mixto: sellado inicial a fuego vivo seguido de cocción lenta y tapada en medio líquido aromático.",
    "exampleDialogueEn": "“We will braise these beef short ribs in Cabernet for four hours until they melt with a spoon.”",
    "exampleDialogueEs": "“Estofaremos estas costillas de ternera en Cabernet durante cuatro horas hasta que se deshagan.”",
    "audioPrompt": "Braise, combination cooking transforming tough collagen into tender gelatin."
  },
  {
    "id": "tech_deglaze",
    "termEn": "Deglaze",
    "termEs": "Desglasar",
    "ipa": "/diːˈɡleɪz/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Pouring wine, stock, or vinegar into a hot pan to dissolve caramelized fond stuck to the bottom.",
    "contextEs": "Verter vino, caldo o vinagre en la sartén ardiente para disolver los azúcares y jugos dorados del fondo.",
    "exampleDialogueEn": "“Deglaze with a splash of Cognac to scrape up all those caramelized pan drippings for the sauce.”",
    "exampleDialogueEs": "“Desglasa con un chorro de coñac rascando el fondo con la espátula para crear la base de la salsa.”",
    "audioPrompt": "Deglaze, dissolving rich fond from pan bottom with acidic liquid."
  },
  {
    "id": "tech_blanch",
    "termEn": "Blanch & Shock",
    "termEs": "Escaldar y Cortar Cocción",
    "ipa": "/blæntʃ ənd ʃɑːk/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Submerging vegetables into boiling salted water for 60–120 seconds, then immediately shocking in ice water.",
    "contextEs": "Hervir verduras brevemente en agua salada y transferirlas de golpe a un baño de hielo para fijar clorofila.",
    "exampleDialogueEn": "“Blanch the green beans for ninety seconds, shock in ice, and drain bone-dry before service.”",
    "exampleDialogueEs": "“Escalda las judías verdes noventa segundos, pásalas al hielo y sécalas bien antes del servicio.”",
    "audioPrompt": "Blanch and Shock, brief boiling followed by ice water bath to fix color and crunch."
  },
  {
    "id": "tech_poach",
    "termEn": "Poach",
    "termEs": "Pochear / Escalfar",
    "ipa": "/poʊtʃ/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Gently cooking delicate foods (eggs, fish, pears) completely submerged in liquid kept at 160°F–180°F (71°C–82°C).",
    "contextEs": "Cocinar alimentos delicados sumergidos en líquido a temperatura suave sin hervir (70°C a 80°C).",
    "exampleDialogueEn": "“Create a vortex in the simmering vinegar water to poach the egg into a perfect round pillow.”",
    "exampleDialogueEs": "“Haz un remolino en el agua con vinagre para escalfar el huevo en una esfera perfecta y sedosa.”",
    "audioPrompt": "Poach, gentle sub-boiling water cooking for delicate eggs and seafood."
  },
  {
    "id": "tech_sous_vide",
    "termEn": "Sous-Vide",
    "termEs": "Cocción al Vacío Sous-Vide",
    "ipa": "/suːˈviːd/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Cooking vacuum-sealed food inside a precisely regulated water bath at exact target internal temperatures.",
    "contextEs": "Cocción de alimentos sellados al vacío en agua a temperatura constante y controlada con precisión decimal.",
    "exampleDialogueEn": "“Cook the wagyu tenderloin sous-vide at 54°C for two hours, then flash-sear on the plancha.”",
    "exampleDialogueEs": "“Cocina el solomillo sous-vide a 54°C durante dos horas y luego sella diez segundos por lado en la plancha.”",
    "audioPrompt": "Sous-Vide, French for under vacuum, precision temperature-controlled water cooking."
  },
  {
    "id": "tech_confit",
    "termEn": "Confit",
    "termEs": "Confitar",
    "ipa": "/kɔːnˈfiː/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Ancient preservation technique: slowly poaching meats or vegetables fully submerged in fat at low heat (90°C).",
    "contextEs": "Técnica ancestral de cocinar lentamente alimentos sumergidos en grasa a baja temperatura sin freír.",
    "exampleDialogueEn": "“Confit these duck legs in pure duck fat with thyme and garlic for three hours until succulent.”",
    "exampleDialogueEs": "“Confita estos muslos de pato en grasa con tomillo y ajos a 90°C durante tres horas hasta que queden tiernísimos.”",
    "audioPrompt": "Confit, slow low-temperature poaching in rendered animal fat."
  },
  {
    "id": "tech_monter_au_beurre",
    "termEn": "Monter au Beurre",
    "termEs": "Mantecar / Monter au Beurre",
    "ipa": "/mɔːnˈteɪ oʊ bɝː/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Swirling cold cubes of unsalted butter into a hot pan reduction off heat to create a glossy, velvet emulsion.",
    "contextEs": "Incorporar dados de mantequilla helada a una reducción caliente fuera del fuego para ligar y dar brillo.",
    "exampleDialogueEn": "“Take the pan off the flame and monter au beurre with three chilled butter cubes for that mirror shine.”",
    "exampleDialogueEs": "“Retira la cacerola del fuego y manteca con tres dados de mantequilla helada para lograr un brillo espejo.”",
    "audioPrompt": "Monter au Beurre, whisking cold butter off-heat into pan sauces for satin sheen."
  },
  {
    "id": "tech_caramelize",
    "termEn": "Caramelize",
    "termEs": "Caramelizar",
    "ipa": "/ˈkær.ə.məl.aɪz/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Thermal decomposition of carbohydrates (sugars) at 320°F+ (160°C+), creating golden color and nutty aromas.",
    "contextEs": "Transformación térmica de azúcares a más de 160°C, desarrollando tonos dorados y notas tostadas complejas.",
    "exampleDialogueEn": "“Cook these yellow onions down low and slow for forty-five minutes to caramelize their natural sugars.”",
    "exampleDialogueEs": "“Pocha las cebollas a fuego bajo cuarenta y cinco minutos hasta caramelizar sus azúcares naturales.”",
    "audioPrompt": "Caramelize, slow breakdown of natural sugars into sweet golden compounds."
  },
  {
    "id": "tech_maillard",
    "termEn": "Maillard Reaction",
    "termEs": "Reacción de Maillard",
    "ipa": "/maɪˈjɑːr/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Chemical reaction between amino acids and reducing sugars above 285°F (140°C), creating savory roasted crusts.",
    "contextEs": "Reacción química entre aminoácidos y azúcares a partir de 140°C que produce la costra sabrosa y tostada.",
    "exampleDialogueEn": "“Pat the scallops bone-dry before searing; moisture boils and ruins the Maillard crust.”",
    "exampleDialogueEs": "“Seca las vieiras con papel antes de sellar; el agua en superficie hierve e impide la reacción de Maillard.”",
    "audioPrompt": "Maillard Reaction, amino acid and sugar browning creating complex savory umami."
  },
  {
    "id": "tech_flambe",
    "termEn": "Flambé",
    "termEs": "Flambear",
    "ipa": "/flɑːmˈbeɪ/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Igniting alcohol vapor poured into a hot pan to burn off harsh ethanol while leaving concentrated liquor essence.",
    "contextEs": "Prender fuego al licor vertido en la sartén para evaporar el alcohol puro reteniendo los aromas del destilado.",
    "exampleDialogueEn": "“Pull pan back, add Cognac, tilt slightly toward the burner flame, and flambé safely!”",
    "exampleDialogueEs": "“Retira la sartén del extractor, añade coñac, inclina suavemente hacia la llama y flambea con cuidado.”",
    "audioPrompt": "Flambé, lighting spirits on fire to burn raw alcohol from pan sauces."
  },
  {
    "id": "tech_temper",
    "termEn": "Temper (Emulsion / Chocolate)",
    "termEs": "Atemperar / Templar",
    "ipa": "/ˈtɛm.pɚ/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Gradually equalizing temperatures of two liquids (whisking hot liquid into eggs) or stabilizing cocoa crystals.",
    "contextEs": "Igualar temperaturas vertiendo un hilo de líquido caliente sobre yemas sin cuajarlas, o estabilizar chocolate.",
    "exampleDialogueEn": "“Temper the egg yolks with a cup of hot cream before pouring them back into the custard base.”",
    "exampleDialogueEs": "“Atempera las yemas vertiendo un cucharón de nata caliente sin parar de batir para que no cuajen en tortilla.”",
    "audioPrompt": "Temper, slowly combining hot and cold ingredients to prevent curdling."
  },
  {
    "id": "tech_emulsify",
    "termEn": "Emulsify",
    "termEs": "Emulsionar",
    "ipa": "/ɪˈmʌl.sə.faɪ/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Forcing two unmixable liquids (oil and water) into a stable homogeneous suspension using mechanical shear and lecithin.",
    "contextEs": "Unir dos líquidos inmiscibles como agua y aceite en una mezcla homogénea mediante batido y emulsionantes.",
    "exampleDialogueEn": "“Drizzle the oil in drops at first to emulsify the mayonnaise before speeding up the pour.”",
    "exampleDialogueEs": "“Vierte el aceite gota a gota al principio para emulsionar la mayonesa antes de acelerar el chorro.”",
    "audioPrompt": "Emulsify, binding oil and water phases into creamy suspension."
  },
  {
    "id": "tech_reduce",
    "termEn": "Reduce",
    "termEs": "Reducir",
    "ipa": "/rɪˈdjuːs/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Boiling or simmering liquids to evaporate water content, concentrating flavors, thickening viscosity, and deepening color.",
    "contextEs": "Hervir líquidos para evaporar agua, concentrar sabores intensos y espesar la consistencia de salsas.",
    "exampleDialogueEn": "“Reduce this port wine by two-thirds until it coats the back of a spoon with velvety gloss.”",
    "exampleDialogueEs": "“Reduce este vino de Oporto a dos tercios de su volumen hasta que nape el dorso de la cuchara.”",
    "audioPrompt": "Reduce, boiling down liquids to concentrate flavor and thicken texture."
  },
  {
    "id": "tech_sweat",
    "termEn": "Sweat (Vegetables)",
    "termEs": "Sudar / Pochar",
    "ipa": "/swɛt/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Cooking chopped vegetables gently in fat over low heat with salt, drawing out moisture without taking on color.",
    "contextEs": "Cocinar verduras picadas a fuego muy bajo con sal para que suelten agua y se vuelvan traslúcidas sin dorar.",
    "exampleDialogueEn": "“Sweat the onions and leeks under parchment cartouche until completely soft and translucent.”",
    "exampleDialogueEs": "“Pocha las cebollas y puerros con una tapa de papel hasta que queden transparentes sin una mota dorada.”",
    "audioPrompt": "Sweat, gentle cooking with salt drawing out sweet juices with zero browning."
  },
  {
    "id": "tech_roast",
    "termEn": "Roast",
    "termEs": "Asar al Horno",
    "ipa": "/roʊst/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Cooking food uncovered with dry indirect heat in an oven or over hot coals, yielding crisp exterior and tender interior.",
    "contextEs": "Cocinar alimentos al horno con calor seco envolvente, logrando piel crujiente y carnes jugosas por dentro.",
    "exampleDialogueEn": "“Roast the heritage chicken at 400°F (200°C) until skin crackles and juices run crystal clear.”",
    "exampleDialogueEs": "“Asa el pollo campero a 200°C hasta que la piel quede crujiente y los jugos broten limpios.”",
    "audioPrompt": "Roast, dry-heat oven cooking creating golden crackling skins."
  },
  {
    "id": "tech_deep_fry",
    "termEn": "Deep-Fry",
    "termEs": "Freír en Inmersión Profunda",
    "ipa": "/diːp fraɪ/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Submerging food completely in hot oil maintained at 350°F–375°F (175°C–190°C), flash-vaporizing exterior moisture.",
    "contextEs": "Sumergir alimentos en aceite abundante caliente a 180°C para formar una costra crujiente impermeable.",
    "exampleDialogueEn": "“Fry the tempura prawns for two minutes until the batter turns into ultra-light pale gold lace.”",
    "exampleDialogueEs": "“Fríe los langostinos en tempura durante dos minutos hasta que el rebozado forme un encaje crujiente.”",
    "audioPrompt": "Deep-Fry, submerged cooking in hot oil flash-sealing a crisp outer shell."
  },
  {
    "id": "tech_steam",
    "termEn": "Steam",
    "termEs": "Cocinar al Vapor",
    "ipa": "/stiːm/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Cooking food over vaporized boiling water in a closed vessel, preserving nutrients, vibrant color, and natural sugars.",
    "contextEs": "Cocinar sobre vapores de agua hirviendo en cesta cerrada, preservando vitaminas y la firmeza del producto.",
    "exampleDialogueEn": "“Steam the wild sea bass with ginger and scallions in bamboo baskets for eight minutes.”",
    "exampleDialogueEs": "“Cocina la lubina al vapor con jengibre y cebollino en cestas de bambú durante ocho minutos.”",
    "audioPrompt": "Steam, gentle enclosed vapor cooking keeping proteins delicate and moist."
  },
  {
    "id": "tech_grill",
    "termEn": "Charcoal Grill / Barbecue",
    "termEs": "Asar a la Parrilla / Brasa",
    "ipa": "/ɡrɪl/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Cooking food directly over glowing hardwood embers or gas flame, basting with fat to induce aromatic smoke flare-ups.",
    "contextEs": "Cocinar sobre brasas de carbón vegetal, recibiendo radiación directa y aromas del goteo de grasa ahumada.",
    "exampleDialogueEn": "“Grill the ribeye over binchotan charcoal for two minutes per side to impart Japanese white smoke notes.”",
    "exampleDialogueEs": "“Asa el lomo sobre carbón binchotan dos minutos por cara para impregnar notas de humo puro.”",
    "audioPrompt": "Grill, intense direct ember cooking imparting wood-smoke complexity."
  },
  {
    "id": "tech_scald",
    "termEn": "Scald (Milk / Cream)",
    "termEs": "Escaldar Líquidos / Atemperar Leche",
    "ipa": "/skɔːld/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Heating dairy liquid to 180°F (82°C) just until tiny bubbles ring the pan perimeter before rolling boil breaks.",
    "contextEs": "Calentar leche o nata hasta que asoman pequeñas burbujas por el borde sin permitir que rompa a hervir.",
    "exampleDialogueEn": "“Scald the heavy cream with split vanilla bean, then remove from heat to infuse covered for twenty minutes.”",
    "exampleDialogueEs": "“Escalda la nata con la vaina de vainilla y retira del fuego tapado para infusionar veinte minutos.”",
    "audioPrompt": "Scald, heating dairy just below boiling point to dissolve aromatics."
  },
  {
    "id": "tech_render",
    "termEn": "Render (Fat)",
    "termEs": "Desgrasar / Fundir Grasa",
    "ipa": "/ˈrɛn.dɚ/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Melting solid animal fat out of skin or bacon slowly over gentle low heat until only crispy cracklings remain.",
    "contextEs": "Fundir lentamente la grasa sólida de la piel a fuego suave hasta obtener grasa líquida y corteza crujiente.",
    "exampleDialogueEn": "“Start the duck breast in a stone-cold pan to gently render out the thick subcutaneous fat layer.”",
    "exampleDialogueEs": "“Empieza el magret de pato en sartén fría para fundir la grasa subcutánea sin quemar la piel.”",
    "audioPrompt": "Render, slowly melting solid animal fats into clarified liquid."
  },
  {
    "id": "tech_clarify",
    "termEn": "Clarify (Butter / Consommé)",
    "termEs": "Clarificar",
    "ipa": "/ˈklær.ə.faɪ/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Purifying butter (skimming milk solids and water) or stock (using egg white raft to snare micro-particles).",
    "contextEs": "Separar impurezas: espumar suero de la mantequilla para ghee, o usar claras para un consomé transparente.",
    "exampleDialogueEn": "“Clarify this butter to raise its smoke point for frying delicate wiener schnitzels.”",
    "exampleDialogueEs": "“Clarifica la mantequilla retirando el suero para elevar su punto de humo y freír escalopes dorados.”",
    "audioPrompt": "Clarify, purifying liquids by skimming solids or rafting consommé."
  },
  {
    "id": "tech_cure",
    "termEn": "Dry & Wet Cure",
    "termEs": "Curar / Salar",
    "ipa": "/kjʊər/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Drawing moisture out of meat or fish using salt, sugar, and nitrates to inhibit bacteria and concentrate flavor.",
    "contextEs": "Extraer humedad de carnes o pescados mediante sal y azúcar para inhibir bacterias y madurar sabor.",
    "exampleDialogueEn": "“Cure the salmon belly in equal parts coarse sea salt, brown sugar, and dill for thirty-six hours.”",
    "exampleDialogueEs": "“Cura la ventresca de salmón en sal gruesa, azúcar y eneldo durante treinta y seis horas en frío.”",
    "audioPrompt": "Cure, extracting water with salt-sugar mixtures to preserve and firm proteins."
  },
  {
    "id": "tech_smoke",
    "termEn": "Hot & Cold Smoke",
    "termEs": "Ahumado en Frío y en Caliente",
    "ipa": "/smoʊk/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Exposing cured foods to wood smoke either cold (below 85°F / 30°C for salmon) or hot (225°F / 107°C for brisket).",
    "contextEs": "Exponer alimentos al humo de maderas nobles en frío para salmón o en caliente para ahumados de brisket.",
    "exampleDialogueEn": "“Cold smoke the cured gravlax over applewood sawdust for six hours without cooking the flesh.”",
    "exampleDialogueEs": "“Ahúma en frío el salmón con virutas de manzano seis horas cuidando que el humo no supere los 25°C.”",
    "audioPrompt": "Smoke, flavoring and preserving with gentle aromatic wood vapors."
  },
  {
    "id": "tech_baste",
    "termEn": "Arroser / Baste",
    "termEs": "Napar / Bañar con Grasa (Arroser)",
    "ipa": "/beɪst/",
    "category": "Cooking Techniques",
    "categoryEs": "Técnicas Culinarias",
    "contextEn": "Continuously spooning hot foaming butter, herbs, and rendered fat over the top of searing proteins.",
    "contextEs": "Bañar continua y rítmicamente la carne con mantequilla espumosa hirviendo con una cuchara sopera.",
    "exampleDialogueEn": "“Tilt the pan and arroser the steak continuously with foaming butter, thyme, and crushed garlic.”",
    "exampleDialogueEs": "“Inclina la sartén y napa el filete sin parar con la mantequilla avellanada y el tomillo.”",
    "audioPrompt": "Baste, spooning hot aromatics and foaming fat repeatedly over proteins."
  },
  {
    "id": "slang_86",
    "termEn": "86 / Eighty-Six",
    "termEs": "86 / Agotado / Cancelado",
    "ipa": "/ˌeɪ.t̬iˈsɪks/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Universal commercial kitchen code meaning an ingredient or dish is completely sold out or an order is cancelled.",
    "contextEs": "Código universal en hostelería que indica que un plato o ingrediente se ha agotado por completo.",
    "exampleDialogueEn": "“Eighty-six the Halibut! We just served the last portion to table twelve!”",
    "exampleDialogueEs": "“¡Ochenta y seis el mero! ¡Acabamos de despachar la última ración para la mesa doce!”",
    "audioPrompt": "Eighty-six, item is completely out of stock or order is cancelled."
  },
  {
    "id": "slang_behind",
    "termEn": "Behind! / Coming Behind!",
    "termEs": "¡Atrás! / ¡Paso por detrás!",
    "ipa": "/bɪˈhaɪnd/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "MANDATORY safety call vocalized when walking behind another cook holding hot pans, knives, or heavy stockpots.",
    "contextEs": "Grito de seguridad OBLIGATORIO al caminar a espaldas de un compañero para evitar colisiones con sartenes calientes.",
    "exampleDialogueEn": "“Behind with hot oil! Do not move your feet!”",
    "exampleDialogueEs": "“¡Atrás con aceite hirviendo! ¡No te muevas ni un centímetro!”",
    "audioPrompt": "Behind! Vital safety alert warned when passing behind line cooks."
  },
  {
    "id": "slang_corner",
    "termEn": "Corner!",
    "termEs": "¡Esquina!",
    "ipa": "/ˈkɔːr.nɚ/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "High-decibel safety shout called when rounding any blind hallway, door, or walk-in corner with trays.",
    "contextEs": "Grito de alerta que se emite antes de doblar una esquina ciega o cruzar puertas batientes en cocina.",
    "exampleDialogueEn": "“Corner! Sharp knife coming through!”",
    "exampleDialogueEs": "“¡Esquina! ¡Paso con cuchillo afilado en mano!”",
    "audioPrompt": "Corner! Safety shout when navigating blind kitchen turns."
  },
  {
    "id": "slang_mise_en_place",
    "termEn": "Mise en Place",
    "termEs": "Mise en Place / Puesta a Punto",
    "ipa": "/ˌmiːz ɑːn ˈplɑːs/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "French culinary philosophy meaning 'everything in its place'; complete preparation of ingredients before cooking starts.",
    "contextEs": "Filosofía culinaria que significa 'todo en su lugar'; alistar y medir cada ingrediente antes del fuego.",
    "exampleDialogueEn": "“Your mise en place is your peace of mind; if your station is messy, your food will be late.”",
    "exampleDialogueEs": "“Tu mise en place es tu tranquilidad mental; si tu estación está sucia, tu comida saldrá tarde.”",
    "audioPrompt": "Mise en place, everything organized and measured before cooking."
  },
  {
    "id": "slang_all_day",
    "termEn": "All Day",
    "termEs": "Total en Marcha / All Day",
    "ipa": "/ɔːl deɪ/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "The cumulative grand total count of a specific dish currently on order across all active kitchen tickets.",
    "contextEs": "La cantidad total acumulada de un plato que la partida debe tener cocinando en ese instante entre todas las mesas.",
    "exampleDialogueEn": "“Expediter: I need two ribeyes on ticket 4, three on ticket 6. Saucier: That is five ribeyes all day, chef!”",
    "exampleDialogueEs": "“Pase: Dos solomillos en mesa 4 y tres en mesa 6. Cocinero: ¡Son cinco solomillos en marcha, chef!”",
    "audioPrompt": "All day, total cumulative number of an item currently working on the line."
  },
  {
    "id": "slang_on_the_fly",
    "termEn": "On the Fly",
    "termEs": "¡Al vuelo! / ¡Urgente ahora mismo!",
    "ipa": "/ɑːn ðə flaɪ/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Kitchen directive demanding a dish or fix be prepared immediately at emergency speed due to error or rush.",
    "contextEs": "Orden de máxima prioridad para sacar un plato a toda prisa por error de comanda o cliente impaciente.",
    "exampleDialogueEn": "“Waiter dropped the risotto; I need one mushroom risotto on the fly right now!”",
    "exampleDialogueEs": "“Al camarero se le cayó el plato; ¡necesito un risotto de setas al vuelo ahora mismo!”",
    "audioPrompt": "On the fly, urgent emergency order demanding instant preparation."
  },
  {
    "id": "slang_fire",
    "termEn": "Fire! / Fire Ticket!",
    "termEs": "¡Fuego! / ¡Marchar comanda!",
    "ipa": "/faɪər/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Direct command from expediter telling cooks to commence cooking proteins and hot courses immediately.",
    "contextEs": "Orden tajante del jefe de pase para que las partidas empiecen a cocinar los platos principales.",
    "exampleDialogueEn": "“Fire table seven! Two sea bass, one filet mignon medium-rare, let's move!”",
    "exampleDialogueEs": "“¡Marchando mesa siete! ¡Dos lubinas y un solomillo al punto, fuego!”",
    "audioPrompt": "Fire! Expediter's order initiating hot food cookery on station."
  },
  {
    "id": "slang_pick_up",
    "termEn": "Pick Up!",
    "termEs": "¡Pase! / ¡Plato listo para servir!",
    "ipa": "/pɪk ʌp/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Shout from the line announcing a completed dish has been wiped, checked, and is ready for servers to run.",
    "contextEs": "Aviso de la partida indicando que los platos están emplatados y listos en la barra para los camareros.",
    "exampleDialogueEn": "“Pick up table four! Service, get these hot plates to the dining room now!”",
    "exampleDialogueEs": "“¡Pase para mesa cuatro! ¡Servicio, retiren estos platos calientes ya!”",
    "audioPrompt": "Pick up! Dish is plated and ready for immediate server delivery."
  },
  {
    "id": "slang_heard",
    "termEn": "Heard! / Oui, Chef!",
    "termEs": "¡Oído! / ¡Oído, Chef!",
    "ipa": "/hɝːd/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Mandatory verbal confirmation echoing orders back to confirm receipt, comprehension, and execution.",
    "contextEs": "Confirmación verbal obligatoria e instantánea de que la orden se escuchó y se está ejecutando.",
    "exampleDialogueEn": "“Chef: Drop two lobsters! Cook: Heard, two lobsters dropping now!”",
    "exampleDialogueEs": "“Chef: ¡Dos bogavantes a la plancha! Cocinero: ¡Oído, dos bogavantes marchando!”",
    "audioPrompt": "Heard! Verbal acknowledgment that an order was understood and executed."
  },
  {
    "id": "slang_in_the_weeds",
    "termEn": "In the Weeds",
    "termEs": "Estar hasta arriba / Desbordado",
    "ipa": "/ɪn ðə wiːdz/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Kitchen state of crisis where orders accumulate faster than a cook can prepare them, falling behind schedule.",
    "contextEs": "Situación de colapso en la que los pedidos se amontonan superando la capacidad del cocinero.",
    "exampleDialogueEn": "“The sauté station is in the weeds! Someone jump in and help him drop pasta!”",
    "exampleDialogueEs": "“¡El salteador está hasta arriba! ¡Que alguien le eche una mano a echar pasta!”",
    "audioPrompt": "In the weeds, hopelessly overwhelmed by incoming kitchen tickets."
  },
  {
    "id": "slang_walk_in",
    "termEn": "The Walk-In",
    "termEs": "Cámara Frigorífica / Walk-In",
    "ipa": "/ˈwɑːk.ɪn/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Room-sized commercial walk-in refrigerator or freezer storing bulk ingredients, prep pans, and stock carts.",
    "contextEs": "Cámara frigorífica industrial de gran tamaño donde se almacenan cajas y fondos en recipientes gastronorm.",
    "exampleDialogueEn": "“Go grab the fresh cream and veal stock from shelf three in the walk-in.”",
    "exampleDialogueEs": "“Ve a la cámara frigorífica y trae la nata fresca y el caldo de ternera de la balda tres.”",
    "audioPrompt": "The Walk-In, commercial walk-in cooler housing bulk kitchen stock."
  },
  {
    "id": "slang_the_pass",
    "termEn": "The Pass",
    "termEs": "El Pase de Cocina",
    "ipa": "/ðə pæs/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "The heated stainless counter dividing the kitchen from waitstaff where the Chef checks every finished plate.",
    "contextEs": "Mostrador caliente de acero donde el chef inspecciona la limpieza de bordes y da salida al servicio.",
    "exampleDialogueEn": "“Wipe that rim smudge clean! Nothing leaves my pass unless it is Michelin caliber!”",
    "exampleDialogueEs": "“¡Limpia esa mancha del borde! ¡Nada sale de mi pase que no tenga calidad de estrella Michelin!”",
    "audioPrompt": "The Pass, the inspection boundary where food transitions from cooks to servers."
  },
  {
    "id": "slang_expo",
    "termEn": "The Expediter / Expo",
    "termEs": "El Expedidor / Jefe de Pase",
    "ipa": "/ˈɛk.spoʊ/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Kitchen conductor who reads incoming tickets, paces cooking stations, calls orders, and inspects plates.",
    "contextEs": "Director del servicio que organiza las comandas, canta los tiempos a las partidas y revisa cada plato.",
    "exampleDialogueEn": "“Listen to the expo's cadence; when he calls a two-minute warning, your fish must be plated.”",
    "exampleDialogueEs": "“Atento a la voz del expedidor; cuando avise de dos minutos, el pescado tiene que estar en el plato.”",
    "audioPrompt": "The Expo, the kitchen conductor directing line synchronization and plate standards."
  },
  {
    "id": "slang_ticket",
    "termEn": "Kitchen Ticket / Chit",
    "termEs": "Comanda / Ticket de Cocina",
    "ipa": "/ˈkɪtʃ.ən ˈtɪk.ɪt/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Printed or digital slip detailing table number, guest count, course order, and allergies for a table.",
    "contextEs": "Impreso de comanda que especifica número de mesa, comensales, platos solicitados y alergias.",
    "exampleDialogueEn": "“Hang ticket forty-two on the rail! We have severe peanut and shellfish allergies on seat two!”",
    "exampleDialogueEs": "“¡Cuelga la comanda cuarenta y dos en la guía! ¡Tenemos alergia mortal a mariscos en el asiento dos!”",
    "audioPrompt": "Kitchen Ticket, printed slip detailing dining room orders and modifications."
  },
  {
    "id": "slang_hot_behind",
    "termEn": "Hot! / Hot Behind!",
    "termEs": "¡Caliente! / ¡Voy con caliente!",
    "ipa": "/hɑːt bɪˈhaɪnd/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Critical danger warning yelled when maneuvering blistering cast iron skillets or bubbling pots through the line.",
    "contextEs": "Grito de peligro para alertar que se transporta una sartén de hierro ardiente o una olla hirviendo.",
    "exampleDialogueEn": "“Hot behind! Coming through with smoking hot roasting pans!”",
    "exampleDialogueEs": "“¡Caliente atrás! ¡Paso con bandejas recién salidas del horno a 250 grados!”",
    "audioPrompt": "Hot Behind! Emergency safety call transporting blistering cookware."
  },
  {
    "id": "slang_sharp",
    "termEn": "Sharp! / Knife!",
    "termEs": "¡Filo! / ¡Cuchillo!",
    "ipa": "/ʃɑːrp/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Safety alert called out when walking through a crowded line carrying an exposed knife (blade held point down).",
    "contextEs": "Aviso de seguridad al trasladar un cuchillo, que siempre debe llevarse apuntando hacia el suelo pegado al muslo.",
    "exampleDialogueEn": "“Sharp coming through to the wash station! Keep hands clear!”",
    "exampleDialogueEs": "“¡Filo al paso hacia la bacha de lavado! ¡Manos libres y despejen!”",
    "audioPrompt": "Sharp! Safety call alerting nearby line staff of exposed moving blades."
  },
  {
    "id": "slang_drag",
    "termEn": "Dragging",
    "termEs": "Ir retrasado / Arrastrando tiempo",
    "ipa": "/ˈdræɡ.ɪŋ/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "When a cook or station is taking longer than budgeted to produce an item, holding up the entire table's service.",
    "contextEs": "Cuando una partida tarda más de la cuenta retrasando la salida de los platos del resto de la mesa.",
    "exampleDialogueEn": "“Fish station is dragging ten minutes on the sole; hold the steaks under the salamander!”",
    "exampleDialogueEs": "“El pescado va arrastrando diez minutos con el lenguado; ¡aguanten los solomillos bajo la salamandra!”",
    "audioPrompt": "Dragging, taking longer than planned and delaying whole-table service."
  },
  {
    "id": "slang_sub",
    "termEn": "Sub / Mod",
    "termEs": "Modificación / Cambio de Ingrediente",
    "ipa": "/sʌb/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "A guest-requested substitution or alteration on a standard menu dish (e.g. sub fries for salad, no butter).",
    "contextEs": "Sustitución o cambio especial en los ingredientes de un plato pedido por el comensal.",
    "exampleDialogueEn": "“Table six has a sub: gluten-free pasta and olive oil instead of butter.”",
    "exampleDialogueEs": "“Mesa seis tiene una modificación: pasta sin gluten y aceite de oliva en lugar de mantequilla.”",
    "audioPrompt": "Sub, menu substitution or dietary modification requested by diner."
  },
  {
    "id": "slang_family_meal",
    "termEn": "Family Meal / Staff Meal",
    "termEs": "Comida de Personal / Family Meal",
    "ipa": "/ˈfæm.əl.i miːl/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Communal meal cooked by the kitchen brigade and eaten together with front-of-house staff before service.",
    "contextEs": "Comida comunitaria que prepara la cocina para todo el equipo de sala y fogones antes de abrir las puertas.",
    "exampleDialogueEn": "“Family meal is ready at 4:30 PM sharp; today we have roast pork carnitas and rice.”",
    "exampleDialogueEs": "“La comida de personal está lista a las 4:30 en punto; hoy tocan carnitas de cerdo con arroz.”",
    "audioPrompt": "Family Meal, pre-service communal dinner eaten by kitchen and floor staff."
  },
  {
    "id": "slang_burn_the_ice",
    "termEn": "Burn the Ice",
    "termEs": "Derretir el Hielo",
    "ipa": "/bɝːn ði aɪs/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Pouring boiling water into an ice well to melt it all down immediately, usually when glass breaks nearby.",
    "contextEs": "Verter agua hirviendo para vaciar la hielera entera de urgencia cuando se rompe una copa o cristal cerca.",
    "exampleDialogueEn": "“A glass chipped over the service well; burn the ice immediately and sanitize!”",
    "exampleDialogueEs": "“¡Se astilló una copa sobre la barra! ¡Derritan todo el hielo con agua hirviendo ya mismo!”",
    "audioPrompt": "Burn the ice, melting ice wells with boiling water after glass breakage."
  },
  {
    "id": "slang_sandbag",
    "termEn": "Sandbagging",
    "termEs": "Cocinar de más por adelantado",
    "ipa": "/ˈsænd.bæɡ.ɪŋ/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Cooking dishes or sides in advance without tickets to survive a rush, risking loss of temperature and texture.",
    "contextEs": "Cocinar porciones con antelación sin comanda para sobrevivir a la hora punta, arriesgando frescura.",
    "exampleDialogueEn": "“Do not sandbag the duck breasts; cook them to order so the skin stays perfectly crisp.”",
    "exampleDialogueEs": "“No cocines magrets por adelantado; márcalos al momento para que la piel no pierda su crujiente.”",
    "audioPrompt": "Sandbagging, prematurely cooking food ahead of ticket demand."
  },
  {
    "id": "slang_clabbered",
    "termEn": "Turned / Clabbered",
    "termEs": "Cortado / Agrio / Pasado",
    "ipa": "/tɝːnd/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "When dairy has spoiled and separated into curds, or an ingredient has soured beyond serviceability.",
    "contextEs": "Cuando la leche o crema se ha agriado y separado en grumos bacterianos incomestibles.",
    "exampleDialogueEn": "“Smell this cream before pouring; it looks like it has turned overnight.”",
    "exampleDialogueEs": "“Huele esta nata antes de usarla; parece que se ha agriado durante la noche.”",
    "audioPrompt": "Turned, food or dairy that has soured and gone bad."
  },
  {
    "id": "slang_flash",
    "termEn": "Flash in the Oven",
    "termEs": "Dar un Golpe de Horno",
    "ipa": "/flæʃ/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Putting par-cooked or rested food into a 450°F (230°C) oven for 60 seconds to bring surface back to piping hot.",
    "contextEs": "Meter un plato o carne atemperada al horno a máxima potencia un minuto para que salga ardiendo al pase.",
    "exampleDialogueEn": "“Flash that resting ribeye in the hot oven for sixty seconds before carving!”",
    "exampleDialogueEs": "“¡Dale un golpe de horno de sesenta segundos a ese chuletón antes de trincharlo!”",
    "audioPrompt": "Flash, reheating rapidly in scorching oven right before plating."
  },
  {
    "id": "slang_nuke",
    "termEn": "Chef Mike / Nuke It",
    "termEs": "Microondas / Calentar al Micro",
    "ipa": "/nuːk/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Slang for heating or melting an ingredient inside the microwave oven (facetiously nicknamed 'Chef Mike').",
    "contextEs": "Calentar o fundir rápidamente un ingrediente en el microondas (bautizado irónicamente como 'Chef Mike').",
    "exampleDialogueEn": "“Do not nuke the chocolate ganache or you will scorch it; melt it gently in the bain-marie!”",
    "exampleDialogueEs": "“¡No metas la ganache al microondas o quemarás el cacao; fúndela suavemente al baño maría!”",
    "audioPrompt": "Nuke it, reheating or melting fast with the microwave oven."
  },
  {
    "id": "slang_kill_it",
    "termEn": "Kill It (Well Done)",
    "termEs": "Pasarlo de Cocción / Bien Hecho",
    "ipa": "/kɪl ɪt/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Order modification from customer requesting their steak be cooked completely well done with zero pink remaining.",
    "contextEs": "Petición del cliente para cocinar un filete a fondo, sin una sola traza de color rosa en el centro.",
    "exampleDialogueEn": "“Table nine wants their dry-aged ribeye killed; cook it well done, no pink.”",
    "exampleDialogueEs": "“La mesa nueve quiere su lomo bien pasado; cocínalo a fondo, sin nada de rojo ni rosa.”",
    "audioPrompt": "Kill it, cooking steak to maximum well-done doneness."
  },
  {
    "id": "slang_drop",
    "termEn": "Drop!",
    "termEs": "¡Echar! / ¡Meter a cocer!",
    "ipa": "/drɑːp/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Instruction to submerge pasta into boiling water, fries into hot oil, or burgers onto searing grill.",
    "contextEs": "Acción de sumergir pasta en agua hirviendo, papas en la freidora o carne sobre la plancha caliente.",
    "exampleDialogueEn": "“Drop two orders of fries for table twelve right now!”",
    "exampleDialogueEs": "“¡Echa dos raciones de papas a la freidora para la mesa doce ya!”",
    "audioPrompt": "Drop! Action of plunging food into boiling water or fry oil."
  },
  {
    "id": "slang_window",
    "termEn": "In the Window",
    "termEs": "En la Ventana del Pase",
    "ipa": "/ˈwɪn.doʊ/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Plates sitting under the heat lamps waiting for the waitstaff to carry them into the dining room.",
    "contextEs": "Platos terminados que reposan bajo las lámparas térmicas esperando a que los camareros los recojan.",
    "exampleDialogueEn": "“We have four hot mains dying in the window! Runners, pick up table seven!”",
    "exampleDialogueEs": "“¡Tenemos cuatro principales enfriándose en la ventana! ¡Camareros, recojan la mesa siete!”",
    "audioPrompt": "In the window, food resting under heat lamps awaiting runner pickup."
  },
  {
    "id": "slang_dead_plate",
    "termEn": "Dead Plate",
    "termEs": "Plato Muerto / Plato Desechado",
    "ipa": "/dɛd pleɪt/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "A dish that was sent back, cancelled, prepared by mistake, or sat too long in the window to serve.",
    "contextEs": "Plato que no se puede servir al cliente por error de comanda, modificación tardía o enfriamiento.",
    "exampleDialogueEn": "“Table cancelled their tartare; it is a dead plate, cooks can eat it on break.”",
    "exampleDialogueEs": "“La mesa canceló el tartar; es plato muerto, se lo puede comer la partida en el descanso.”",
    "audioPrompt": "Dead plate, food that cannot be served to guests due to mistakes."
  },
  {
    "id": "slang_stage",
    "termEn": "Stagiaire / Staging",
    "termEs": "Stagiaire / Pasante de Cocina",
    "ipa": "/stɑːʒ/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "An unpaid culinary intern or visiting cook staging at high-end restaurants to learn techniques.",
    "contextEs": "Cocinero en prácticas o voluntario que trabaja en restaurantes de prestigio para aprender alta cocina.",
    "exampleDialogueEn": "“We have a new stagiaire starting today from Lyon; teach him how we fabricate duck.”",
    "exampleDialogueEs": "“Hoy empieza un nuevo stagiaire de Lyon; enséñale cómo limpiamos y despiezamos el pato.”",
    "audioPrompt": "Stagiaire, an apprentice cook working in a professional kitchen."
  },
  {
    "id": "slang_clopen",
    "termEn": "Clopen",
    "termEs": "Cerrar y Abrir (Turno Enlazado)",
    "ipa": "/ˈkloʊ.pən/",
    "category": "Kitchen Brigade & Service Slang",
    "categoryEs": "Jerga de Brigada y Servicio",
    "contextEn": "Brutal restaurant shift schedule where a cook closes the kitchen late at night and opens it early the next morning.",
    "contextEs": "Turno pesado de hostelería donde el mismo cocinero cierra tarde por la noche y abre a primera hora de la mañana.",
    "exampleDialogueEn": "“I worked the clopen this weekend: finished scrub-down at 1 AM and prepped prep carts at 6 AM.”",
    "exampleDialogueEs": "“Me tocó el turno de cierre y apertura este fin de semana: salí a la 1 y entré a las 6 a preparar caldos.”",
    "audioPrompt": "Clopen, back-to-back closing and opening shifts with minimal rest."
  },
  {
    "id": "doneness_blue_rare",
    "termEn": "Blue Rare / Extra Rare",
    "termEs": "Azul / Casi Crudo (Bleu)",
    "ipa": "/bluː rɛər/",
    "category": "Meat Doneness",
    "categoryEs": "Punto de la Carne",
    "contextEn": "Internal temperature 115°F–120°F (46°C–49°C). Searing outside for 60 seconds; center is completely cool, raw, and red.",
    "contextEs": "Temperatura interna 46°C-49°C. Sellado exterior relámpago; centro completamente rojo, frío y tierno.",
    "exampleDialogueEn": "“The guest wants this venison blue rare: flash sear thirty seconds per side and plate immediately.”",
    "exampleDialogueEs": "“El cliente quiere el ciervo azul: sella treinta segundos por lado y emplata de inmediato.”",
    "audioPrompt": "Blue rare, seared exterior with cool, bright red raw core."
  },
  {
    "id": "doneness_rare",
    "termEn": "Rare",
    "termEs": "Poco Hecho / Rojo Inglés (Saignant)",
    "ipa": "/rɛər/",
    "category": "Meat Doneness",
    "categoryEs": "Punto de la Carne",
    "contextEn": "Internal temperature 120°F–125°F (49°C–52°C). 75% red center, warm to the touch, highly juicy and soft.",
    "contextEs": "Temperatura interna 49°C-52°C. Centro 75% rojo, tibio al tacto, jugosidad máxima y textura tierna.",
    "exampleDialogueEn": "“Pull the filet mignon at 122°F for a perfect rare; it will carry over to 125°F resting.”",
    "exampleDialogueEs": "“Saca el solomillo a 50°C para un punto poco hecho; la inercia térmica lo dejará perfecto en 52°C.”",
    "audioPrompt": "Rare, warm red center with very soft yielding texture."
  },
  {
    "id": "doneness_medium_rare",
    "termEn": "Medium Rare (Chef's Standard)",
    "termEs": "Al Punto Menos / Medium Rare",
    "ipa": "/ˈmiː.di.əm rɛər/",
    "category": "Meat Doneness",
    "categoryEs": "Punto de la Carne",
    "contextEn": "Internal temperature 130°F–135°F (54°C–57°C). Warm red-pink center; optimum balance of melted intramuscular fat and tenderness.",
    "contextEs": "Temperatura interna 54°C-57°C. Centro rosa cálido; punto óptimo donde la grasa infiltrada se funde.",
    "exampleDialogueEn": "“Every quality ribeye should be cooked medium-rare so the marbling melts into rich beef juices.”",
    "exampleDialogueEs": "“Todo buen chuletón debe servirse al punto menos para que el veteado de grasa se funda en puro jugo.”",
    "audioPrompt": "Medium rare, warm pink center with rendered marbling fat."
  },
  {
    "id": "doneness_medium",
    "termEn": "Medium",
    "termEs": "Al Punto (À Point)",
    "ipa": "/ˈmiː.di.əm/",
    "category": "Meat Doneness",
    "categoryEs": "Punto de la Carne",
    "contextEn": "Internal temperature 140°F–145°F (60°C–63°C). Warm pink center with light gray-brown outer band, firm springy texture.",
    "contextEs": "Temperatura interna 60°C-63°C. Centro de color rosa pálido rodeado de borde tostado; textura elástica.",
    "exampleDialogueEn": "“Table three ordered their strip loin medium: cook until thermometer probe hits 142°F.”",
    "exampleDialogueEs": "“Mesa tres pidió su bife al punto: cocina hasta que la sonda marque 61°C en el centro.”",
    "audioPrompt": "Medium, warm pink core with firmer resistance to touch."
  },
  {
    "id": "doneness_medium_well",
    "termEn": "Medium Well",
    "termEs": "Al Punto Más / Casi Hecho",
    "ipa": "/ˈmiː.di.əm wɛl/",
    "category": "Meat Doneness",
    "categoryEs": "Punto de la Carne",
    "contextEn": "Internal temperature 150°F–155°F (65°C–68°C). Slight hint of pink remaining in the dead center; mostly gray-brown.",
    "contextEs": "Temperatura interna 65°C-68°C. Apenas un hilo rosado en el centro; la mayor parte de la carne es marrón.",
    "exampleDialogueEn": "“A medium-well burger takes seven minutes; keep an eye so it does not dry out completely.”",
    "exampleDialogueEs": "“Una hamburguesa al punto más tarda siete minutos; vigílala para que no pierda todos sus jugos.”",
    "audioPrompt": "Medium well, faint sliver of pink remaining in center."
  },
  {
    "id": "doneness_well_done",
    "termEn": "Well Done",
    "termEs": "Bien Hecho / Muy Pasado (Bien Cuit)",
    "ipa": "/wɛl dʌn/",
    "category": "Meat Doneness",
    "categoryEs": "Punto de la Carne",
    "contextEn": "Internal temperature 160°F+ (71°C+). Solid brownish-gray throughout with no pink trace, firm and fully coagulated.",
    "contextEs": "Temperatura interna superior a 71°C. Totalmente uniforme de color pardo sin gota de rosa, carne firme.",
    "exampleDialogueEn": "“Well-done steak takes patience; cook over moderate heat so exterior does not char before center coagulates.”",
    "exampleDialogueEs": "“Un filete bien cocido requiere paciencia a fuego medio para no quemar la costra antes de que el centro se haga.”",
    "audioPrompt": "Well done, thoroughly cooked gray center with zero pink."
  },
  {
    "id": "brigade_executive_chef",
    "termEn": "Executive Chef / Chef de Cuisine",
    "termEs": "Chef Ejecutivo / Jefe de Cocina",
    "ipa": "/ɪɡˈzɛk.jə.t̬ɪv ʃɛf/",
    "category": "Brigade Hierarchy",
    "categoryEs": "Jerarquía de Brigada",
    "contextEn": "The supreme culinary commander responsible for menu development, food costing, kitchen management, and philosophy.",
    "contextEs": "El máximo responsable de la cocina: diseña la carta, controla costes de comida y lidera al equipo.",
    "exampleDialogueEn": "“The Executive Chef is tasting the new spring tasting menu with the general manager this afternoon.”",
    "exampleDialogueEs": "“El Chef Ejecutivo está catando el nuevo menú de primavera con el director del hotel esta tarde.”",
    "audioPrompt": "Executive Chef, leader and creator of the kitchen's culinary vision."
  },
  {
    "id": "brigade_sous_chef",
    "termEn": "Sous Chef (Second in Command)",
    "termEs": "Sous Chef / Segundo de Cocina",
    "ipa": "/suː ʃɛf/",
    "category": "Brigade Hierarchy",
    "categoryEs": "Jerarquía de Brigada",
    "contextEn": "The direct hands-on manager of the kitchen floor, coordinating day-to-day station prep, inventory, and expediting.",
    "contextEs": "Mano derecha del chef ejecutivo; supervisa las partidas, controla la producción diaria y el pase.",
    "exampleDialogueEn": "“Ask the Sous Chef before breaking down that fresh halibut carcass for tonight's specials.”",
    "exampleDialogueEs": "“Pregúntale al Sous Chef antes de despiezar el mero fresco para los platos sugeridos de hoy.”",
    "audioPrompt": "Sous Chef, second-in-command operational commander of the kitchen."
  },
  {
    "id": "brigade_chef_de_partie",
    "termEn": "Chef de Partie / Station Chef",
    "termEs": "Jefe de Partida / Chef de Partie",
    "ipa": "/ʃɛf də pɑːrˈtiː/",
    "category": "Brigade Hierarchy",
    "categoryEs": "Jerarquía de Brigada",
    "contextEn": "Line cook in charge of a designated station (e.g., Sauté, Grill, Fish, Roast) managing prep and execution.",
    "contextEs": "Cocinero a cargo de una sección específica (Sartén, Parrilla, Pescados) durante el servicio.",
    "exampleDialogueEn": "“The meat Chef de Partie has ten years of butchery experience and runs the busiest station on the line.”",
    "exampleDialogueEs": "“El jefe de partida de carnes tiene diez años de experiencia en carnicería y lleva la partida más exigente.”",
    "audioPrompt": "Chef de Partie, station specialist leading specific culinary line sections."
  },
  {
    "id": "brigade_saucier",
    "termEn": "Saucier",
    "termEs": "Salsero / Saucier",
    "ipa": "/soʊˈsiː.eɪ/",
    "category": "Brigade Hierarchy",
    "categoryEs": "Jerarquía de Brigada",
    "contextEn": "The highest-ranking Chef de Partie, responsible for delicate hot sauces, pan reductions, and prestigious braised dishes.",
    "contextEs": "El jefe de partida de mayor rango técnico, encargado de elaborar fondos, reducciones de salsa y estofados.",
    "exampleDialogueEn": "“Only the Saucier touches the veal bone reductions and black truffle pan sauces.”",
    "exampleDialogueEs": "“Únicamente el Salsero prepara los fondos oscuros de ternera y las reducciones de trufa negra.”",
    "audioPrompt": "Saucier, prestigious station cook mastering classical French reductions and sauces."
  },
  {
    "id": "brigade_poissonnier",
    "termEn": "Poissonnier (Fish Chef)",
    "termEs": "Pescadero / Poissonnier",
    "ipa": "/pwɑː.sɔːnˈjeɪ/",
    "category": "Brigade Hierarchy",
    "categoryEs": "Jerarquía de Brigada",
    "contextEn": "Station cook specializing exclusively in fabricating, poaching, pan-searing, and saucing all finfish and seafood.",
    "contextEs": "Cocinero especializado en limpiar pescados enteros, abrir mariscos y preparar sus cocciones delicadas.",
    "exampleDialogueEn": "“The Poissonnier is filleting sixty fresh Dover soles delivered straight from Brittany.”",
    "exampleDialogueEs": "“El pescadero está limpiando sesenta lenguados frescos llegados directamente de Bretaña.”",
    "audioPrompt": "Poissonnier, specialized fish and seafood cook."
  },
  {
    "id": "brigade_garde_manger",
    "termEn": "Garde Manger (Cold Kitchen Chef)",
    "termEs": "Chef del Cuarto Frío / Garde Manger",
    "ipa": "/ɡɑːrd mɑːnˈʒeɪ/",
    "category": "Brigade Hierarchy",
    "categoryEs": "Jerarquía de Brigada",
    "contextEn": "Station in charge of cold appetizers, salads, charcuterie boards, terrines, pates, and decorative centerpieces.",
    "contextEs": "Partida encargada de entrantes fríos, ensaladas, patés, embutidos y ensaladas de bienvenida.",
    "exampleDialogueEn": "“Garde Manger has eighty house-cured duck prosciutto salads ready for the private dining banquet.”",
    "exampleDialogueEs": "“El cuarto frío tiene ochenta ensaladas de jamón de pato listas para el banquete privado.”",
    "audioPrompt": "Garde Manger, cold food artisan managing salads, terrines, and charcuterie."
  },
  {
    "id": "brigade_patissier",
    "termEn": "Pâtissier (Pastry Chef)",
    "termEs": "Chef Pastelero / Pâtissier",
    "ipa": "/pɑː.tiːsˈjeɪ/",
    "category": "Brigade Hierarchy",
    "categoryEs": "Jerarquía de Brigada",
    "contextEn": "Master of desserts, laminated doughs, chocolate tempering, soufflés, and artisan bread baking.",
    "contextEs": "Maestro repostero a cargo de postres emplatados, bombones, masas hojaldradas y panadería artesana.",
    "exampleDialogueEn": "“The Pâtissier is piping three hundred chocolate eclairs for the afternoon tea service.”",
    "exampleDialogueEs": "“El pastelero está rellenando trescientos relámpagos de chocolate para la hora del té.”",
    "audioPrompt": "Pâtissier, pastry chef crafting breads, desserts, and tempered chocolates."
  },
  {
    "id": "brigade_commis",
    "termEn": "Commis Chef (Junior Apprentice)",
    "termEs": "Ayudante de Cocina / Commis",
    "ipa": "/kɔːˈmiː/",
    "category": "Brigade Hierarchy",
    "categoryEs": "Jerarquía de Brigada",
    "contextEn": "Junior cook assisting a Chef de Partie, performing essential bulk prep (peeling, chopping, stock straining).",
    "contextEs": "Cocinero novel o aprendiz que apoya a los jefes de partida realizando tareas de picado y pelado de mise en place.",
    "exampleDialogueEn": "“Every great executive chef started out as a humble commis peeling fifty pounds of onions every morning.”",
    "exampleDialogueEs": "“Todo gran chef ejecutivo empezó como un humilde commis pelando veinticinco kilos de cebollas cada mañana.”",
    "audioPrompt": "Commis, junior apprentice cook building foundational kitchen skills."
  }
];

  const recipes = [
  {
    "id": "filet_mignon_demi_glace",
    "nameEn": "Filet Mignon with Red Wine Demi-Glace",
    "nameEs": "Filet Mignon con Demi-Glace de Vino Tinto",
    "category": "Meat & Poultry",
    "difficulty": "Advanced",
    "prepTime": "20 mins",
    "cookTime": "18 mins",
    "servings": 2,
    "descriptionEn": "Tender center-cut beef tenderloin pan-seared in cast-iron with aromatic thyme and basted with foaming butter, served alongside a glossy reduced red wine demi-glace.",
    "descriptionEs": "Solomillo de ternera corte centro sellado en hierro fundido con tomillo fresco y bañado en mantequilla espumosa, servido con reducción brillante de demi-glace al vino tinto.",
    "requiredIngredients": [
      {
        "id": "beef_tenderloin",
        "nameEn": "Beef Tenderloin Steaks (8 oz)",
        "amount": 2,
        "unit": "portions"
      },
      {
        "id": "unsalted_butter",
        "nameEn": "French Unsalted Butter",
        "amount": 60,
        "unit": "g"
      },
      {
        "id": "fresh_thyme",
        "nameEn": "Fresh Thyme Sprigs",
        "amount": 4,
        "unit": "sprigs"
      },
      {
        "id": "garlic_head",
        "nameEn": "Crushed Garlic Cloves",
        "amount": 3,
        "unit": "cloves"
      },
      {
        "id": "red_wine_vinegar",
        "nameEn": "Cabernet Sauvignon Wine",
        "amount": 120,
        "unit": "ml"
      },
      {
        "id": "beef_stock",
        "nameEn": "Rich Veal Demi-Glace Base",
        "amount": 180,
        "unit": "ml"
      },
      {
        "id": "maldon_salt",
        "nameEn": "Maldon Sea Salt Flakes",
        "amount": 5,
        "unit": "g"
      }
    ],
    "requiredTools": [
      "cast_iron_skillet",
      "chefs_knife",
      "meat_thermometer",
      "roasting_tongs",
      "saucier_pan"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Tempering and Seasoning the Steaks",
        "titleEs": "Atemperado y Salazonado del Solomillo",
        "actionEn": "Remove tenderloin medallions from refrigeration 30 minutes prior to cooking. Pat thoroughly dry with linen towels and season aggressively with coarse sea salt and cracked black pepper.",
        "actionEs": "Retira los medallones del refrigerador 30 minutos antes de cocinar. Seca meticulosamente con paño de lino y sazona abundantemente con sal marina gruesa y pimienta recién molida.",
        "techniqueId": "seasoning",
        "toolId": "chefs_knife",
        "timerSeconds": 1800,
        "criticalRuleEn": "Never sear cold meat straight from the fridge; a cold core inhibits even heat distribution and drops pan temperature instantly.",
        "criticalRuleEs": "Nunca selles carne fría directo de la nevera; el núcleo frío frena la cocción uniforme y desploma la temperatura de la sartén."
      },
      {
        "stepNumber": 2,
        "titleEn": "High-Heat Searing for Maillard Reaction",
        "titleEs": "Sellado a Alta Temperatura para Reacción de Maillard",
        "actionEn": "Heat cast-iron skillet until smoking hot. Add high-smoke-point oil and lay steaks away from you. Sear undisturbed for 3 minutes until a mahogany crust forms.",
        "actionEs": "Calienta la sartén de hierro fundido hasta que humee ligeramente. Añade aceite de alto punto de humo y coloca los cortes hacia afuera. Sella sin mover durante 3 minutos hasta formar corteza caoba.",
        "techniqueId": "searing",
        "toolId": "cast_iron_skillet",
        "timerSeconds": 180,
        "criticalRuleEn": "Do not crowd the skillet or move the meat before the crust releases naturally from the iron surface.",
        "criticalRuleEs": "No satures la sartén ni muevas la carne antes de que la costra se despegue naturalmente del hierro."
      },
      {
        "stepNumber": 3,
        "titleEn": "Arrosé Butter Basting with Aromatics",
        "titleEs": "Arrosé: Bañado con Mantequilla Espumosa y Aromáticos",
        "actionEn": "Flip steaks, drop cold unsalted butter, crushed garlic cloves, and thyme sprigs into the pan. Tilt pan toward you and continuously spoon foaming herb butter over the top of the steaks.",
        "actionEs": "Voltea los filetes, añade mantequilla fría sin sal, dientes de ajo machacados y tomillo. Inclina la sartén y baña continuamente la superficie con la mantequilla espumosa.",
        "techniqueId": "basting_arrose",
        "toolId": "roasting_tongs",
        "timerSeconds": 150,
        "criticalRuleEn": "Control heat so milk solids foam hazelnut-brown (beurre noisette) without scorching black.",
        "criticalRuleEs": "Modera el fuego para que los sólidos lácteos doren en avellana (beurre noisette) sin quemarse."
      },
      {
        "stepNumber": 4,
        "titleEn": "Core Temperature Check and Resting",
        "titleEs": "Medición Térmica de Núcleo y Reposo",
        "actionEn": "Insert probe thermometer horizontally into thickest center until reaching 52°C (125°F) for medium-rare. Transfer steaks to wire rack and rest for 7 minutes.",
        "actionEs": "Inserta el termómetro de sonda horizontalmente en el centro más grueso hasta registrar 52°C (125°F) para término medio-rojo. Pasa a rejilla y reposa durante 7 minutos.",
        "techniqueId": "resting_meat",
        "toolId": "meat_thermometer",
        "timerSeconds": 420,
        "criticalRuleEn": "Resting allows muscle fibers to relax and capillary pressure to redistribute juices back into core tissues.",
        "criticalRuleEs": "El reposo relaja las fibras musculares y redistribuye los jugos internos reteniendo la humedad."
      },
      {
        "stepNumber": 5,
        "titleEn": "Deglazing and Finishing Demi-Glace",
        "titleEs": "Desglasado y Emulsión Final del Demi-Glace",
        "actionEn": "Drain excess fat from pan, deglaze pan fond with Cabernet Sauvignon, reduce by 75%, whisk in rich veal stock, reduce to nappe consistency, and mount with cold butter cubes.",
        "actionEs": "Desecha el exceso de grasa, desglasa el fondo con Cabernet Sauvignon, reduce un 75%, incorpora caldo oscuro de ternera, reduce a textura nappe y monta con cubos de mantequilla helada.",
        "techniqueId": "deglazing",
        "toolId": "saucier_pan",
        "timerSeconds": 300,
        "criticalRuleEn": "Monter au beurre must be executed off the flame; boiling will break the delicate fat emulsion.",
        "criticalRuleEs": "Montar con mantequilla debe hacerse fuera del fuego; hervir rompería la emulsión de grasa."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "At what internal temperature should you pull filet mignon for an ideal medium-rare finish after resting?",
        "questionEs": "¿A qué temperatura interna se debe retirar el solomillo para un término medio-rojo perfecto tras reposar?",
        "options": [
          "42°C (108°F)",
          "52°C - 54°C (125°F - 128°F)",
          "65°C (149°F)",
          "74°C (165°F)"
        ],
        "correctIndex": 1,
        "explanationEn": "Pulling at 52°C-54°C allows residual carryover heat to gently raise internal temp to 57°C (135°F) during resting.",
        "explanationEs": "Retirar a 52°C-54°C permite que el calor residual residual eleve la temperatura a 57°C (135°F) durante el reposo."
      },
      {
        "questionEn": "What is the primary objective of 'monter au beurre' in finishing a pan sauce?",
        "questionEs": "¿Cuál es el objetivo principal de 'monter au beurre' al terminar una salsa de sartén?",
        "options": [
          "To caramelize sugars",
          "To emulsify fat into liquid creating gloss, richness, and velvet body",
          "To sterilize bacteria",
          "To clarify cloudy stock"
        ],
        "correctIndex": 1,
        "explanationEn": "Whisking chilled butter into hot liquid off the heat suspends fat droplets, producing a glossy, silky texture.",
        "explanationEs": "Batir mantequilla fría fuera del fuego suspende glóbulos grasos, logrando brillo, sedosidad y textura aterciopelada."
      }
    ]
  },
  {
    "id": "chilean_sea_bass_en_papillote",
    "nameEn": "Chilean Sea Bass en Papillote",
    "nameEs": "Lubina Chilena en Papillote",
    "category": "Seafood",
    "difficulty": "Intermediate",
    "prepTime": "25 mins",
    "cookTime": "15 mins",
    "servings": 2,
    "descriptionEn": "Delicate Chilean sea bass fillet enclosed with julienned leeks, fennel, lemon wheels, and dry vermouth inside a parchment paper pouch that inflates into a steaming aromatic parcel.",
    "descriptionEs": "Delicado filete de lubina chilena envuelto con juliana de puerros, hinojo, rodajas de limón y vermú seco dentro de un paquete de papel pergamino que se infla al vapor aromatizado.",
    "requiredIngredients": [
      {
        "id": "chilean_sea_bass",
        "nameEn": "Chilean Sea Bass Fillets (6 oz)",
        "amount": 2,
        "unit": "portions"
      },
      {
        "id": "fennel_bulb",
        "nameEn": "Shaved Fennel Bulb",
        "amount": 1,
        "unit": "bulb"
      },
      {
        "id": "leek_stalk",
        "nameEn": "Julienned Leek (white part only)",
        "amount": 1,
        "unit": "stalk"
      },
      {
        "id": "extra_virgin_olive_oil",
        "nameEn": "Cold Pressed Olive Oil",
        "amount": 30,
        "unit": "ml"
      },
      {
        "id": "dry_vermouth",
        "nameEn": "French Dry Vermouth or White Wine",
        "amount": 45,
        "unit": "ml"
      },
      {
        "id": "tarragon_fresh",
        "nameEn": "Fresh Tarragon Leaves",
        "amount": 6,
        "unit": "sprigs"
      }
    ],
    "requiredTools": [
      "parchment_paper",
      "chefs_knife",
      "baking_sheet",
      "pastry_brush"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Cutting Heart-Shaped Parchment Envelopes",
        "titleEs": "Corte de Corazones de Papel Pergamino",
        "actionEn": "Fold large parchment sheets in half and cut large heart outlines with culinary shears. Brush light film of olive oil across inner surface.",
        "actionEs": "Dobla láminas grandes de papel manteca a la mitad y recorta siluetas de corazón. Pincela una película ligera de aceite de oliva en el interior.",
        "techniqueId": "en_papillote",
        "toolId": "parchment_paper",
        "timerSeconds": 300,
        "criticalRuleEn": "Ensure parchment perimeter is sufficiently wide to allow tight multi-pleat crimping without tearing.",
        "criticalRuleEs": "Deja margen suficiente en los bordes para realizar pliegues dobles herméticos sin rasgar el papel."
      },
      {
        "stepNumber": 2,
        "titleEn": "Building Aromatic Bed and Assembling",
        "titleEs": "Construcción del Lecho Aromático y Montaje",
        "actionEn": "Place julienned leeks and shaved fennel in center of parchment. Place seasoned sea bass over vegetables, garnish with lemon wheels and tarragon, splash with vermouth.",
        "actionEs": "Coloca la juliana de puerro e hinojo en el centro. Posiciona la lubina sazonada sobre las verduras, añade rodajas de limón, estragón y un chorro de vermú.",
        "techniqueId": "mise_en_place",
        "toolId": "chefs_knife",
        "timerSeconds": 360,
        "criticalRuleEn": "Do not add excessive liquid; 1.5 tablespoons generates optimal trapped steam pressure without waterlogging delicate fish.",
        "criticalRuleEs": "No excedas el líquido; 1.5 cucharadas bastan para generar vapor presurizado sin encharcar el pescado."
      },
      {
        "stepNumber": 3,
        "titleEn": "Hermetic Crimp Sealing",
        "titleEs": "Sellado Hermético por Pliegues Superpuestos",
        "actionEn": "Fold top half over fish. Starting at apex of heart, make overlapping 1/4-inch folds all along curved perimeter, twisting the pointed tail tightly underneath to lock airtight seal.",
        "actionEs": "Cubre con la mitad superior. Comenzando en el vértice, haz pequeños pliegues superpuestos a lo largo del contorno, doblando la punta firmemente hacia abajo para sellar.",
        "techniqueId": "en_papillote",
        "toolId": "parchment_paper",
        "timerSeconds": 240,
        "criticalRuleEn": "If steam escapes during baking, the papillote will fail to inflate and the fish will dry out rather than steam in its own liquor.",
        "criticalRuleEs": "Si el vapor escapa, el papillote no se inflará y el pescado se secará en vez de cocinarse en sus jugos."
      },
      {
        "stepNumber": 4,
        "titleEn": "Convection Baking and Tableside Slitting",
        "titleEs": "Horneado por Convección y Apertura en Mesa",
        "actionEn": "Bake at 200°C (400°F) for 12-14 minutes until pouch is fully puffed and golden brown. Serve immediately and slit paper tableside with shears to release aromatic vapor cloud.",
        "actionEs": "Hornea a 200°C (400°F) durante 12-14 minutos hasta que el paquete esté inflado y dorado. Sirve de inmediato y abre en mesa con tijera para liberar la nube aromática.",
        "techniqueId": "baking_convection",
        "toolId": "baking_sheet",
        "timerSeconds": 780,
        "criticalRuleEn": "Serve instantly while ballooned; condensation deflates the envelope within two minutes of removal from oven.",
        "criticalRuleEs": "Sirve de inmediato mientras esté inflado; la condensación desinfla la bolsa en menos de dos minutos al enfriar."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "What is the primary thermodynamic cooking principle inside 'en papillote'?",
        "questionEs": "¿Cuál es el principio termodinámico fundamental de la cocción 'en papillote'?",
        "options": [
          "Direct dry radiant heat",
          "Gentle enclosed steam convection in the ingredient's natural vapors",
          "Oil-submerged frying",
          "Direct conduction searing"
        ],
        "correctIndex": 1,
        "explanationEn": "En papillote traps liquids and aromatic essences which vaporize, steaming the protein under gentle, pressurized moist heat.",
        "explanationEs": "El papillote retiene líquidos y esencias aromáticas que se vaporizan, cociendo la proteína al vapor bajo calor húmedo presurizado."
      },
      {
        "questionEn": "Why is an airtight crimp fold essential for papillote success?",
        "questionEs": "¿Por qué es crucial un pliegue hermético en la técnica de papillote?",
        "options": [
          "To prevent fish from turning yellow",
          "To retain internal steam pressure allowing the pouch to balloon and cook evenly",
          "To prevent paper from catching fire",
          "To keep salt crystals outside"
        ],
        "correctIndex": 1,
        "explanationEn": "Without a tight hermetic seal, steam dissipates into the oven cavity, leaving the protein dry and un-puffed.",
        "explanationEs": "Sin un cierre hermético, el vapor se escapa al horno dejando la proteína reseca y sin inflar el paquete."
      }
    ]
  },
  {
    "id": "classic_lobster_bisque",
    "nameEn": "Classic French Lobster Bisque",
    "nameEs": "Bisque Clásica Francesa de Langosta",
    "category": "Soups & Stocks",
    "difficulty": "Advanced",
    "prepTime": "30 mins",
    "cookTime": "50 mins",
    "servings": 4,
    "descriptionEn": "Velvety, deeply savory soup crafted from roasted Maine lobster carapaces, flamed with Cognac, simmered with mirepoix and fish fumet, thickened with rice flour and finished with heavy cream.",
    "descriptionEs": "Sopa aterciopelada y profunda elaborada con caparazones tostados de langosta, flameados con Coñac, cocidos con mirepoix y fumet de pescado, ligada con crema de leche fresca.",
    "requiredIngredients": [
      {
        "id": "lobster_tail",
        "nameEn": "Maine Lobster Shells & Claws",
        "amount": 2,
        "unit": "carapaces"
      },
      {
        "id": "cognac_brandy",
        "nameEn": "French Cognac or Brandy",
        "amount": 60,
        "unit": "ml"
      },
      {
        "id": "tomato_paste",
        "nameEn": "Concentrated Tomato Paste",
        "amount": 45,
        "unit": "g"
      },
      {
        "id": "heavy_cream",
        "nameEn": "Heavy Whipping Cream (36% fat)",
        "amount": 150,
        "unit": "ml"
      },
      {
        "id": "fish_fumet",
        "nameEn": "Clarified Fish Stock (Fumet)",
        "amount": 800,
        "unit": "ml"
      },
      {
        "id": "unsalted_butter",
        "nameEn": "European Cultured Butter",
        "amount": 50,
        "unit": "g"
      },
      {
        "id": "tarragon_fresh",
        "nameEn": "Fresh Chives & Tarragon",
        "amount": 4,
        "unit": "sprigs"
      }
    ],
    "requiredTools": [
      "stockpot",
      "chinois_strainer",
      "immersion_blender",
      "mortar_and_pestle",
      "ladle"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Crushing and Roasting Crustacean Carapaces",
        "titleEs": "Triturado y Tostado de Caparazones",
        "actionEn": "Crush lobster shells with heavy pestle to expose maximum surface area. Roast in hot butter inside Dutch oven until deep orange-red and intensely fragrant.",
        "actionEs": "Tritura los caparazones con mortero para exponer la médula. Tuesta en mantequilla caliente dentro de una olla hasta que tomen tono naranja rojizo intenso.",
        "techniqueId": "roasting_shells",
        "toolId": "mortar_and_pestle",
        "timerSeconds": 480,
        "criticalRuleEn": "Caramelize shell proteins without burning; burnt chitin produces an acrid, bitter off-flavor in the final stock.",
        "criticalRuleEs": "Dora las proteínas de quitina sin quemarlas; la cáscara quemada imparte un sabor amargo irreversible."
      },
      {
        "stepNumber": 2,
        "titleEn": "Flaming with Cognac and Pincer the Tomato",
        "titleEs": "Flambeado con Coñac y Pincer de Concentrado de Tomate",
        "actionEn": "Deglaze hot shells with Cognac and ignite carefully with flame. Once alcohol burns off, add mirepoix and tomato paste, stirring constantly (pincer) to cook out raw acidity.",
        "actionEs": "Desglasa con Coñac e inclina para flambear con precaución. Al apagarse la llama, añade mirepoix y pasta de tomate, sofriendo (pincer) para eliminar la acidez cruda.",
        "techniqueId": "flambeing",
        "toolId": "stockpot",
        "timerSeconds": 300,
        "criticalRuleEn": "Ensure exhaust hoods are on and keep face back when igniting high-proof brandy.",
        "criticalRuleEs": "Enciende la campana extractora y aparta el rostro al prender fuego a licores de alta graduación."
      },
      {
        "stepNumber": 3,
        "titleEn": "Simmering with Fumet and Bouquet Garni",
        "titleEs": "Cocción a Fuego Lento con Fumet y Bouquet Garni",
        "actionEn": "Pour in hot fish fumet and add bouquet garni. Bring to gentle simmer and cook for 35 minutes, skimming grey scum from surface with skimmer spoon.",
        "actionEs": "Vierte fumet de pescado caliente y añade bouquet garni. Mantén hervor suave por 35 minutos, espumando impurezas de la superficie con espumadera.",
        "techniqueId": "simmering",
        "toolId": "stockpot",
        "timerSeconds": 2100,
        "criticalRuleEn": "Do not rapid boil; violent boiling emulsifies shell particulates into broth, destroying clarity.",
        "criticalRuleEs": "No hiervas a borbotones; el hervor violento dispersa partículas calcáreas enturbiando la sopa."
      },
      {
        "stepNumber": 4,
        "titleEn": "Fine Chinois Straining and Pressing Fond",
        "titleEs": "Colado Fino por Chinois y Prensado",
        "actionEn": "Pass broth through fine mesh chinois strainer. Use heavy ladle pestle to crush and press every drop of flavorful crustacean liquor from shells.",
        "actionEs": "Pasa el caldo por colador cónico chino fino. Presiona con la base de un cucharón para extraer hasta la última gota de esencia concentrada de los caparazones.",
        "techniqueId": "straining_chinois",
        "toolId": "chinois_strainer",
        "timerSeconds": 300,
        "criticalRuleEn": "Filter meticulously; even tiny shell shards ruin diner experience and pose safety risks.",
        "criticalRuleEs": "Cuela rigurosamente; restos de caparazón representan peligro de asfixia y arruinan la textura."
      },
      {
        "stepNumber": 5,
        "titleEn": "Finishing with Heavy Cream and Poached Lobster Morsels",
        "titleEs": "Ligazón con Crema Espesa y Tropezones de Langosta",
        "actionEn": "Return strained bisque to low heat, whisk in heavy cream and cold butter until satiny. Ladle into warm shallow bowls and top with butter-poached lobster claw meat.",
        "actionEs": "Regresa la bisque a fuego bajo, incorpora crema espesa y cubos fríos de mantequilla hasta lograr brillo satinado. Sirve con trozos de pinza de langosta escalfada.",
        "techniqueId": "emulsifying",
        "toolId": "ladle",
        "timerSeconds": 240,
        "criticalRuleEn": "Do not let cream-enriched bisque boil or fat separation will curdle the velvety emulsion.",
        "criticalRuleEs": "No permitas que la bisque enriquecida hierva o la grasa se cortará arruinando la emulsión aterciopelada."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "Why are crustacean carapaces flambéed with Cognac in bisque preparation?",
        "questionEs": "¿Por qué se flambeaban los caparazones con Coñac al preparar una bisque?",
        "options": [
          "To cool down the pot",
          "To vaporize ethanol while leaving concentrated aromatic grape esters and caramel oak notes",
          "To bleach shells white",
          "To dissolve bone calcium"
        ],
        "correctIndex": 1,
        "explanationEn": "Flaming burns off sharp alcohol vapors while concentrating rich oak and grape aromas that dissolve fat-soluble flavor compounds.",
        "explanationEs": "El flambeado evapora el alcohol agresivo dejando notas de roble y uva que disuelven los compuestos aromáticos liposolubles."
      },
      {
        "questionEn": "What culinary utensil ensures zero shell grit passes into the velvet bisque?",
        "questionEs": "¿Qué utensilio culinario garantiza que ningún residuo de cáscara pase a la bisque?",
        "options": [
          "Slotted Spoon",
          "Chinois / Fine Conical Strainer",
          "Colander",
          "Spider skimmer"
        ],
        "correctIndex": 1,
        "explanationEn": "A conical chinois strainer features ultra-fine micro-mesh specifically engineered to trap microscopic shell fragments.",
        "explanationEs": "El chino cónico posee una micro-malla ultra fina diseñada específicamente para retener fragmentos microscópicos de caparazón."
      }
    ]
  },
  {
    "id": "wild_mushroom_risotto",
    "nameEn": "Wild Mushroom Risotto alla Milanese",
    "nameEs": "Risotto con Hongos Silvestres al Estilo Milanesa",
    "category": "Pasta & Rice",
    "difficulty": "Intermediate",
    "prepTime": "20 mins",
    "cookTime": "28 mins",
    "servings": 4,
    "descriptionEn": "Creamy Carnaroli rice slowly cooked with hot stock, sautéed chanterelles and porcini mushrooms, finished with mantecatura of cold butter and aged Parmigiano-Reggiano.",
    "descriptionEs": "Arroz Carnaroli cremoso cocido gradualmente con caldo hirviendo, hongos porcini y chantarelas salteadas, terminado con mantecatura de mantequilla fría y Parmigiano-Reggiano añejo.",
    "requiredIngredients": [
      {
        "id": "carnaroli_rice",
        "nameEn": "Carnaroli or Acquerello Rice",
        "amount": 320,
        "unit": "g"
      },
      {
        "id": "porcini_mushrooms",
        "nameEn": "Rehydrated Porcini & Fresh Chanterelles",
        "amount": 250,
        "unit": "g"
      },
      {
        "id": "shallots",
        "nameEn": "Finely Minced Shallots",
        "amount": 2,
        "unit": "bulbs"
      },
      {
        "id": "dry_white_wine",
        "nameEn": "Dry Italian Pinot Grigio",
        "amount": 120,
        "unit": "ml"
      },
      {
        "id": "vegetable_stock",
        "nameEn": "Simmering Vegetable or Chicken Broth",
        "amount": 1200,
        "unit": "ml"
      },
      {
        "id": "parmigiano_reggiano",
        "nameEn": "24-Month Aged Parmigiano-Reggiano",
        "amount": 80,
        "unit": "g"
      },
      {
        "id": "unsalted_butter",
        "nameEn": "Ice-Cold Unsalted Butter",
        "amount": 60,
        "unit": "g"
      }
    ],
    "requiredTools": [
      "risotto_pan",
      "wooden_spoon",
      "chefs_knife",
      "microplane_zester",
      "ladle"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Tostatura: Toasting the Rice Grains",
        "titleEs": "Tostatura: Tostado de los Granos de Arroz",
        "actionEn": "Sweat shallots in olive oil until translucent. Add raw Carnaroli rice dry into the pan, stirring vigorously for 2 minutes until rice is hot and grains become pearl-translucent with chalky center.",
        "actionEs": "Suda las chalotas en aceite de oliva hasta traslúcidas. Añade el arroz Carnaroli crudo y remueve durante 2 minutos hasta que esté caliente y translúcido con centro perlado.",
        "techniqueId": "toasting_grains",
        "toolId": "risotto_pan",
        "timerSeconds": 150,
        "criticalRuleEn": "Tostatura seals grain surface and gelatinizes outer starch, preventing grains from bursting into mush later.",
        "criticalRuleEs": "La tostatura sella el grano y gelatiniza el almidón exterior evitando que reviente y se vuelva pastoso."
      },
      {
        "stepNumber": 2,
        "titleEn": "Sfumar: Deglazing with Dry White Wine",
        "titleEs": "Sfumar: Desglasado con Vino Blanco Seco",
        "actionEn": "Pour in cold dry white wine. Stir continuously until wine completely evaporates and the sharp alcohol acidity cooks out, leaving fruity grape essence.",
        "actionEs": "Vierte el vino blanco seco frío. Remueve hasta que se evapore por completo y se disipe la acidez punzante del alcohol, dejando solo la esencia frutal.",
        "techniqueId": "deglazing",
        "toolId": "wooden_spoon",
        "timerSeconds": 120,
        "criticalRuleEn": "Do not add broth until wine is thoroughly absorbed, or the acidity will taste raw and astringent.",
        "criticalRuleEs": "No viertas caldo hasta que el vino se absorba por completo, o la acidez cruda persistirá en el plato."
      },
      {
        "stepNumber": 3,
        "titleEn": "Gradual Stock Addition and Starch Agitation",
        "titleEs": "Incorporación Gradual de Caldo y Frotado de Almidón",
        "actionEn": "Add simmering broth one ladle at a time. Stir frequently in rhythmic circles to encourage amylose starch abrasion from grain edges, keeping broth at gentle simmer.",
        "actionEs": "Añade caldo hirviendo cucharón a cucharón. Remueve con movimientos rítmicos para desgastar el almidón amilosa de los bordes del grano, manteniendo hervor constante.",
        "techniqueId": "simmering",
        "toolId": "ladle",
        "timerSeconds": 960,
        "criticalRuleEn": "Broth MUST be kept near boiling; cold broth thermal-shocks the rice, seizing starch extraction.",
        "criticalRuleEs": "El caldo DEBE estar hirviendo; caldo frío genera choque térmico y frena la extracción cremosa del almidón."
      },
      {
        "stepNumber": 4,
        "titleEn": "Mantecatura: Beating Butter and Parmigiano",
        "titleEs": "Mantecatura: Batido con Mantequilla Helada y Parmesano",
        "actionEn": "Remove pan completely from heat when rice is al dente (slight toothsome center). Rest 1 minute, then add cubes of frozen butter and grated Parmigiano. Agitate pan vigorously to emulsify starch and fat into 'all'onda' wave wave.",
        "actionEs": "Retira la olla del fuego cuando el arroz esté al dente (firme al centro). Deja reposar 1 minuto, añade dados de mantequilla helada y parmesano rallado. Bate con fuerza hasta lograr el movimiento 'all'onda'.",
        "techniqueId": "mantecatura",
        "toolId": "risotto_pan",
        "timerSeconds": 180,
        "criticalRuleEn": "Mantecatura executed on direct fire separates dairy fats into an oily grease slick.",
        "criticalRuleEs": "Hacer la mantecatura sobre el fuego directo corta la grasa láctea formando una película aceitosa."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "What Italian term describes the signature undulating, creamy wave consistency of authentic risotto?",
        "questionEs": "¿Qué término italiano describe la consistencia ondulante y cremosa del auténtico risotto?",
        "options": [
          "Al dente",
          "All'onda",
          "Sfumare",
          "Tostatura"
        ],
        "correctIndex": 1,
        "explanationEn": "'All'onda' (wavy) describes a risotto that flows smoothly like a gentle wave when the skillet is tilted.",
        "explanationEs": "'All'onda' describe un risotto cremoso que fluye y ondea suavemente al mover el sartén sin quedar apelmazado."
      },
      {
        "questionEn": "Why must stock added to cooking risotto be boiling hot rather than room temperature?",
        "questionEs": "¿Por qué el caldo que se incorpora al risotto debe mantenerse hirviendo y no a temperatura ambiente?",
        "options": [
          "To evaporate faster",
          "To maintain constant gelatinization temperature without shocking grains",
          "To change rice color",
          "To kill salt bacteria"
        ],
        "correctIndex": 1,
        "explanationEn": "Hot broth maintains steady cooking temperatures, ensuring continual starch breakdown without shocking grains.",
        "explanationEs": "El caldo caliente mantiene la temperatura de cocción constante facilitando la liberación uniforme del almidón."
      }
    ]
  },
  {
    "id": "duck_breast_a_lorange",
    "nameEn": "Pan-Roasted Duck Breast à l'Orange",
    "nameEs": "Magret de Pato a la Naranja (Canard à l'Orange)",
    "category": "Meat & Poultry",
    "difficulty": "Advanced",
    "prepTime": "25 mins",
    "cookTime": "22 mins",
    "servings": 2,
    "descriptionEn": "Succulent Moulard duck breast scored in diamond crosshatch, slowly rendered in cold skillet until skin crisps into golden crackling, served with bittersweet orange gastrique.",
    "descriptionEs": "Pechuga magret de pato marcada en rombos, desgrasada a fuego lento en sartén fría hasta lograr piel crujiente y dorada, servida con gastrique agridulce de naranja sanguina.",
    "requiredIngredients": [
      {
        "id": "duck_breast",
        "nameEn": "Moulard Duck Magret (12 oz)",
        "amount": 2,
        "unit": "portions"
      },
      {
        "id": "orange_fresh",
        "nameEn": "Organic Oranges (Juice & Zest)",
        "amount": 3,
        "unit": "fruits"
      },
      {
        "id": "granulated_sugar",
        "nameEn": "Granulated White Sugar",
        "amount": 50,
        "unit": "g"
      },
      {
        "id": "red_wine_vinegar",
        "nameEn": "Sherry or Red Wine Vinegar",
        "amount": 60,
        "unit": "ml"
      },
      {
        "id": "duck_fat",
        "nameEn": "Rendered Duck Fat",
        "amount": 30,
        "unit": "ml"
      },
      {
        "id": "fresh_thyme",
        "nameEn": "Fresh Thyme Sprigs",
        "amount": 3,
        "unit": "sprigs"
      }
    ],
    "requiredTools": [
      "chefs_knife",
      "cast_iron_skillet",
      "meat_thermometer",
      "microplane_zester",
      "saucier_pan"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Crosshatch Scoring of Subcutaneous Fat",
        "titleEs": "Marcado en Rombo de la Capa de Grasa",
        "actionEn": "Score skin and thick fat layer in fine diagonal diamond pattern (crosshatch) spaced 1/4 inch apart. Cut through fat layer stopping just short of red meat fibers.",
        "actionEs": "Realiza cortes diagonales en forma de rombo en la piel cada 6 mm. Corta la grasa sin llegar a tocar las fibras de carne roja.",
        "techniqueId": "crosshatch_scoring",
        "toolId": "chefs_knife",
        "timerSeconds": 300,
        "criticalRuleEn": "Slicing into red muscle flesh causes precious juices to purge out during cooking, drying the breast.",
        "criticalRuleEs": "Cortar la carne magra roja provoca escape de jugos internos resecando la pechuga."
      },
      {
        "stepNumber": 2,
        "titleEn": "Cold Pan Rendering of Duck Skin",
        "titleEs": "Desgrasado en Sartén Fría a Fuego Lento",
        "actionEn": "Place duck skin-side down in a cold, un-oiled skillet over low-medium heat. Slowly render subcutaneous fat over 12-14 minutes, pouring off liquid duck fat into heatproof jar.",
        "actionEs": "Coloca el pato con la piel hacia abajo en una sartén fría sin aceite a fuego medio-bajo. Derrite la grasa lentamente durante 12-14 minutos, drenando el exceso en un frasco.",
        "techniqueId": "rendering_fat",
        "toolId": "cast_iron_skillet",
        "timerSeconds": 840,
        "criticalRuleEn": "A hot pan immediately seizes the skin, trapping rubbery un-rendered fat beneath.",
        "criticalRuleEs": "Una sartén caliente cauteriza la piel al instante, atrapando grasa gomosa sin fundir debajo."
      },
      {
        "stepNumber": 3,
        "titleEn": "Flesh Searing and Resting",
        "titleEs": "Sellado de la Carne y Reposo",
        "actionEn": "Once skin is wafer-thin and deep mahogany, flip duck to flesh side for 3 minutes. Probe to 54°C (130°F) for rosy medium-rare, then rest on cutting board for 8 minutes.",
        "actionEs": "Cuando la piel esté crocante y fina, voltea sobre la carne 3 minutos. Mide con sonda a 54°C (130°F) para término rosado medio-rojo y reposa en tabla 8 minutos.",
        "techniqueId": "resting_meat",
        "toolId": "meat_thermometer",
        "timerSeconds": 480,
        "criticalRuleEn": "Overcooked duck breast quickly turns liver-like and tough; medium-rare is essential.",
        "criticalRuleEs": "El pato sobrecocido adquiere textura gomosa y sabor a hígado; el término medio-rojo es mandatorio."
      },
      {
        "stepNumber": 4,
        "titleEn": "Crafting the Sweet-Tart Gastrique",
        "titleEs": "Elaboración de la Gastrique Agridulce",
        "actionEn": "Melt sugar in saucier until amber caramel. Deglaze with vinegar to dissolve caramel, add fresh orange juice and strips of blanched orange zest, reducing by half to glossy syrup.",
        "actionEs": "Funde azúcar en un cazo hasta formar caramelo ámbar. Desglasa con vinagre para disolver el caramelo, añade zumo de naranja y juliana de piel escalfada, reduciendo a jarabe.",
        "techniqueId": "gastrique_reduction",
        "toolId": "saucier_pan",
        "timerSeconds": 360,
        "criticalRuleEn": "Caramel burns in seconds; immediately introduce vinegar the moment rich amber color appears.",
        "criticalRuleEs": "El caramelo se quema en segundos; vierte el vinagre en cuanto adquiera un tono dorado ámbar profundo."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "Why must duck breast skin rendering begin in an entirely cold skillet?",
        "questionEs": "¿Por qué el desgrasado de la piel de pato debe iniciarse en una sartén totalmente fría?",
        "options": [
          "To prevent the pan from smoking",
          "To allow deep subcutaneous fat to melt slowly before skin burns, yielding ultra-crispy skin",
          "To tenderize the cutting board",
          "To sanitize the poultry"
        ],
        "correctIndex": 1,
        "explanationEn": "Starting cold gently liquefies the thick fat cap over time, rendering it out until skin turns paper-thin and brittle.",
        "explanationEs": "Iniciar en frío funde suavemente la grasa profunda antes de que la piel se tueste, logrando piel delgada y ultra crocante."
      },
      {
        "questionEn": "What two base components define a classic French 'gastrique' sauce foundation?",
        "questionEs": "¿Cuáles son los dos componentes básicos que definen la base de una salsa 'gastrique' francesa?",
        "options": [
          "Butter and flour roux",
          "Caramelized sugar deglazed with acid vinegar",
          "Heavy cream and egg yolk",
          "Tomato paste and beef stock"
        ],
        "correctIndex": 1,
        "explanationEn": "A gastrique is a caramelized sugar base dissolved in vinegar, creating a bittersweet counterpoint to rich game meats.",
        "explanationEs": "Una gastrique combina azúcar caramelizado con vinagre ácido, equilibrando la riqueza grasa de aves como el pato."
      }
    ]
  },
  {
    "id": "scallops_st_jacques",
    "nameEn": "Pan-Seared Sea Scallops St. Jacques",
    "nameEs": "Vieiras Salteadas San Jacques con Puré de Coliflor",
    "category": "Seafood",
    "difficulty": "Intermediate",
    "prepTime": "15 mins",
    "cookTime": "6 mins",
    "servings": 2,
    "descriptionEn": "Dry-packed jumbo sea scallops seared to golden caramel perfection in clarified butter, accompanied by silky cauliflower velouté and crispy caper butter.",
    "descriptionEs": "Vieiras gigantes secas selladas a la perfección dorada caramelizada en mantequilla clarificada, acompañadas de velouté sedoso de coliflor y mantequilla crujiente de alcaparras.",
    "requiredIngredients": [
      {
        "id": "sea_scallops",
        "nameEn": "U-10 Dry-Pack Sea Scallops",
        "amount": 6,
        "unit": "pieces"
      },
      {
        "id": "clarified_butter",
        "nameEn": "Ghee / Clarified Butter",
        "amount": 30,
        "unit": "ml"
      },
      {
        "id": "cauliflower_head",
        "nameEn": "Cauliflower Florets",
        "amount": 300,
        "unit": "g"
      },
      {
        "id": "heavy_cream",
        "nameEn": "Heavy Cream",
        "amount": 80,
        "unit": "ml"
      },
      {
        "id": "capers_brine",
        "nameEn": "Baby Non-Pareil Capers",
        "amount": 20,
        "unit": "g"
      },
      {
        "id": "lemon_fresh",
        "nameEn": "Fresh Lemon Juice",
        "amount": 15,
        "unit": "ml"
      }
    ],
    "requiredTools": [
      "stainless_steel_skillet",
      "chefs_knife",
      "high_speed_blender",
      "roasting_tongs"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "De-abductoring and Drying Scallops",
        "titleEs": "Retiro del Músculo Abductor y Secado Exquisito",
        "actionEn": "Peel away small rectangular side muscle (abductor) from each scallop. Lay scallops between double layers of lint-free paper towels, pressing gently to absorb surface moisture.",
        "actionEs": "Retira con los dedos el pequeño músculo abductor lateral fibroso. Coloca las vieiras entre toallas de papel absorbente presionando suavemente para secar la superficie.",
        "techniqueId": "mise_en_place",
        "toolId": "chefs_knife",
        "timerSeconds": 300,
        "criticalRuleEn": "Wet scallops will steam and turn rubbery grey rather than developing a deeply caramelized Maillard crust.",
        "criticalRuleEs": "Las vieiras húmedas se hierven y quedan gomosas en lugar de caramelizarse con costra dorada."
      },
      {
        "stepNumber": 2,
        "titleEn": "High-Heat Searing in Clarified Butter",
        "titleEs": "Sellado a Fuego Vivo en Mantequilla Clarificada",
        "actionEn": "Heat stainless steel skillet until smoking. Add clarified butter. Place scallops clockwise leaving 1 inch between each. Sear completely undisturbed for exactly 2 minutes.",
        "actionEs": "Calienta sartén de acero hasta humear. Añade mantequilla clarificada. Coloca las vieiras en el sentido de las agujas del reloj separadas por 2.5 cm. Sella sin tocar 2 minutos.",
        "techniqueId": "searing",
        "toolId": "stainless_steel_skillet",
        "timerSeconds": 120,
        "criticalRuleEn": "Do not flip prematurely; when caramelization is complete, the protein releases cleanly from the stainless steel pan.",
        "criticalRuleEs": "No voltees antes de tiempo; al completarse la caramelización, la proteína se despega sola del acero."
      },
      {
        "stepNumber": 3,
        "titleEn": "Butter Basting and Gentle Center Finish",
        "titleEs": "Bañado en Mantequilla y Núcleo Perlado",
        "actionEn": "Flip scallops onto second flat side. Drop fresh butter and lemon juice, basting for 45 seconds. Scallops should feel springy with translucent, warm center.",
        "actionEs": "Voltea las vieiras sobre la segunda cara. Añade mantequilla fresca y jugo de limón, bañando durante 45 segundos. El centro debe sentirse elástico y quedar perlado.",
        "techniqueId": "basting_arrose",
        "toolId": "roasting_tongs",
        "timerSeconds": 60,
        "criticalRuleEn": "Overcooked scallops turn rubbery and stringy; remove the instant internal temperature reaches 46°C (115°F).",
        "criticalRuleEs": "Las vieiras pasadas de cocción se vuelven gomosas; retíralas en cuanto el centro alcance 46°C (115°F)."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "Why must the side-foot abductor muscle be removed from sea scallops before searing?",
        "questionEs": "¿Por qué debe retirarse el pequeño músculo lateral abductor de las vieiras antes de cocinarlas?",
        "options": [
          "It contains high mercury",
          "It is tough, fibrous, and chews like gristle even after cooking",
          "It changes the butter color",
          "It is toxic"
        ],
        "correctIndex": 1,
        "explanationEn": "The abductor muscle has tight, fibrous grain that becomes hard and unpleasantly leathery during searing.",
        "explanationEs": "El músculo abductor es fibroso y correoso, endureciéndose desagradablemente al calor."
      },
      {
        "questionEn": "What type of scallops should you buy for restaurant-grade searing?",
        "questionEs": "¿Qué tipo de vieiras se debe comprar para un sellado profesional de restaurante?",
        "options": [
          "Wet-pack scallops soaked in phosphates",
          "Dry-pack scallops with no chemical treatment",
          "Frozen battered scallops",
          "Canned scallops in brine"
        ],
        "correctIndex": 1,
        "explanationEn": "Dry-pack scallops are natural and un-treated, retaining no added water that causes splattering and prevents browning.",
        "explanationEs": "Las vieiras secas (dry-pack) no tienen químicos ni exceso de agua añadida, permitiendo dorar con costra perfecta."
      }
    ]
  },
  {
    "id": "classic_creme_brulee",
    "nameEn": "Vanilla Bean Crème Brûlée",
    "nameEs": "Crème Brûlée con Vainilla Bourbon de Madagascar",
    "category": "Desserts & Pastry",
    "difficulty": "Intermediate",
    "prepTime": "20 mins",
    "cookTime": "40 mins",
    "servings": 4,
    "descriptionEn": "Silky, baked egg yolk custard infused with scraped Madagascar bourbon vanilla beans, chilled and capped with a thin, glass-like sheet of caramelized burnt turbinado sugar.",
    "descriptionEs": "Natilla sedosa de yemas de huevo horneada al baño maría e infusionada con vainilla bourbon de Madagascar, coronada con fina capa de azúcar caramelizado con soplete.",
    "requiredIngredients": [
      {
        "id": "heavy_cream",
        "nameEn": "Heavy Whipping Cream (36% fat)",
        "amount": 500,
        "unit": "ml"
      },
      {
        "id": "egg_yolks",
        "nameEn": "Large Egg Yolks (Free-Range)",
        "amount": 6,
        "unit": "yolks"
      },
      {
        "id": "granulated_sugar",
        "nameEn": "Fine Castor Sugar",
        "amount": 100,
        "unit": "g"
      },
      {
        "id": "vanilla_bean",
        "nameEn": "Madagascar Bourbon Vanilla Bean",
        "amount": 1,
        "unit": "pod"
      },
      {
        "id": "turbinado_sugar",
        "nameEn": "Raw Turbinado Sugar for Brûléeing",
        "amount": 40,
        "unit": "g"
      }
    ],
    "requiredTools": [
      "ramekins_porcelain",
      "bain_marie_pan",
      "blowtorch_culinary",
      "balloon_whisk",
      "fine_mesh_sieve"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Infusing Cream with Vanilla Pod Seeds",
        "titleEs": "Infusión de Crema con Semillas de Vaina de Vainilla",
        "actionEn": "Split vanilla bean lengthwise with paring knife and scrape caviar seeds into heavy cream in saucepan. Heat cream gently until scalding bubbles form along pan perimeter.",
        "actionEs": "Abre la vaina de vainilla a lo largo y raspa las semillas dentro de la crema en un cazo. Calienta suavemente hasta que aparezcan burbujas en el contorno sin hervir.",
        "techniqueId": "infusing_cream",
        "toolId": "saucier_pan",
        "timerSeconds": 300,
        "criticalRuleEn": "Do not boil cream violently; steep off heat for 15 minutes to fully extract complex vanillin aromatics.",
        "criticalRuleEs": "No hiervas a borbotones; deja reposar 15 minutos fuera del fuego para extraer toda la vainillina."
      },
      {
        "stepNumber": 2,
        "titleEn": "Tempering Egg Yolks with Sugar",
        "titleEs": "Temperado de Yemas con Azúcar",
        "actionEn": "Whisk egg yolks and fine sugar gently until pale without whipping air foam. Slowly stream hot cream in thin drizzle into yolks while whisking continually to temper.",
        "actionEs": "Bate suavemente las yemas y el azúcar hasta integrar sin incorporar burbujas de aire. Vierte la crema caliente en hilo continuo batiendo para temperar sin cuajar.",
        "techniqueId": "tempering_eggs",
        "toolId": "balloon_whisk",
        "timerSeconds": 180,
        "criticalRuleEn": "Do not whip vigorously; air bubbles incorporated into raw custard turn spongy and unsightly upon baking.",
        "criticalRuleEs": "No batas con fuerza; la espuma atrapada crea una textura esponjosa y rugosa al hornear."
      },
      {
        "stepNumber": 3,
        "titleEn": "Straining and Bain-Marie Water Bath Baking",
        "titleEs": "Filtrado Fino y Horneado en Baño María",
        "actionEn": "Pour custard through fine sieve into porcelain ramekins. Place ramekins in roasting pan and pour boiling water halfway up their sides. Bake at 150°C (300°F) for 35 minutes until centers gently wobble.",
        "actionEs": "Cuela la crema en moldes ramekin. Coloca los moldes en una bandeja y vierte agua hirviendo hasta media altura. Hornea a 150°C (300°F) 35 minutos hasta que el centro tiemble levemente.",
        "techniqueId": "bain_marie_baking",
        "toolId": "bain_marie_pan",
        "timerSeconds": 2100,
        "criticalRuleEn": "Never skip the hot water bath; the water acts as a thermal buffer preventing egg protein curdling around ceramic edges.",
        "criticalRuleEs": "Nunca omitas el agua caliente; actúa como amortiguador térmico impidiendo que los bordes cuajen en tortilla."
      },
      {
        "stepNumber": 4,
        "titleEn": "Culinary Torch Caramelization (Brûlée)",
        "titleEs": "Caramelizado con Soplete Culinario (Brûlée)",
        "actionEn": "Sprinkle even, thin blanket of raw turbinado sugar over chilled custard. Sweep culinary blowtorch flame in smooth circular motions until sugar melts, bubbles, and hardens into amber glass.",
        "actionEs": "Espolvorea una capa fina y uniforme de azúcar turbinado sobre la crema fría. Pasa la llama del soplete en círculos continuos hasta que el azúcar burbujee y forme un cristal ámbar.",
        "techniqueId": "caramelizing_blowtorch",
        "toolId": "blowtorch_culinary",
        "timerSeconds": 90,
        "criticalRuleEn": "Hold flame 3 inches away and keep torch moving continuously; hovering in one spot scorches bitter black carbon.",
        "criticalRuleEs": "Mantén la llama a 7 cm y muévela constantemente; dejarla fija quema el azúcar amargándolo."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "Why is baking custard in a 'bain-marie' (water bath) critical?",
        "questionEs": "¿Por qué hornear la natilla en 'baño maría' es indispensable?",
        "options": [
          "To add humidity to the oven air",
          "Water caps the temperature around ramekins at 100°C (212°F), preventing egg curdling",
          "To prevent vanilla from evaporating",
          "To dissolve sugar faster"
        ],
        "correctIndex": 1,
        "explanationEn": "Water cannot exceed 100°C under atmospheric pressure, shielding fragile egg proteins from intense oven heat.",
        "explanationEs": "El agua amortigua el calor y no supera los 100°C protegiendo a las yemas de cuajarse en grumos."
      },
      {
        "questionEn": "How long before service should the sugar crust on crème brûlée be torched?",
        "questionEs": "¿Con cuánto tiempo de anticipación debe quemarse el azúcar antes de servir?",
        "options": [
          "24 hours ahead",
          "Just minutes before serving, otherwise moisture dissolves the brittle glass crunch",
          "One day before",
          "Never chill after torching"
        ],
        "correctIndex": 1,
        "explanationEn": "Moisture in the underlying cold custard naturally migrates into the caramelized sugar crust within 20 minutes, turning it soggy.",
        "explanationEs": "La humedad de la crema disuelve la costra de caramelo en menos de 20 minutos; debe quemarse justo antes de comer."
      }
    ]
  },
  {
    "id": "classic_french_onion_soup",
    "nameEn": "Classic French Onion Soup Gratinée",
    "nameEs": "Sopa de Cebolla Francesa Gratinada",
    "category": "Soups & Stocks",
    "difficulty": "Beginner",
    "prepTime": "20 mins",
    "cookTime": "60 mins",
    "servings": 4,
    "descriptionEn": "Deeply caramelized sweet yellow onions slow-simmered in beef bone broth and dry sherry, capped with toasted baguette croutons and melted Gruyère cheese crust.",
    "descriptionEs": "Cebollas dulces caramelizadas pacientemente a fuego lento, cocidas en caldo oscuro de res y jerez seco, coronadas con hogaza de pan tostado y queso Gruyère gratinado.",
    "requiredIngredients": [
      {
        "id": "yellow_onions",
        "nameEn": "Sweet Spanish Onions",
        "amount": 1500,
        "unit": "g"
      },
      {
        "id": "beef_stock",
        "nameEn": "Rich Beef Bone Broth",
        "amount": 1200,
        "unit": "ml"
      },
      {
        "id": "gruyere_cheese",
        "nameEn": "AOP Cave-Aged Gruyère Cheese",
        "amount": 200,
        "unit": "g"
      },
      {
        "id": "french_baguette",
        "nameEn": "Crusty French Baguette Slices",
        "amount": 8,
        "unit": "slices"
      },
      {
        "id": "dry_sherry",
        "nameEn": "Dry Amontillado Sherry Wine",
        "amount": 80,
        "unit": "ml"
      },
      {
        "id": "unsalted_butter",
        "nameEn": "Unsalted Butter",
        "amount": 50,
        "unit": "g"
      }
    ],
    "requiredTools": [
      "dutch_oven",
      "mandoline_slicer",
      "cheese_grater",
      "french_onion_soup_crocks",
      "salamander_broiler"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Julienning Onions and Slow Caramelization",
        "titleEs": "Corte en Juliana y Caramelización Prolongada",
        "actionEn": "Slice onions uniformly 1/4 inch thick. Melt butter in heavy Dutch oven, add onions with pinch of salt, and cook over medium-low heat for 45 minutes, stirring every 5 minutes until deep mahogany jam.",
        "actionEs": "Corta las cebollas en juliana uniforme. Funde mantequilla en olla de hierro, añade las cebollas con una pizca de sal y cocina 45 minutos a fuego medio-bajo hasta lograr color caoba oscuro.",
        "techniqueId": "caramelizing_onions",
        "toolId": "dutch_oven",
        "timerSeconds": 2700,
        "criticalRuleEn": "Do not rush with high flame; real caramelization requires enzymatic sugar breakdown without burning bitter acrid edges.",
        "criticalRuleEs": "No apures el fuego; la caramelización genuina requiere tiempo para degradar los azúcares sin quemar los bordes."
      },
      {
        "stepNumber": 2,
        "titleEn": "Deglazing with Sherry and Simmering Stock",
        "titleEs": "Desglasado con Jerez y Cocción con Caldo Oscuro",
        "actionEn": "Deglaze pan bottom with dry sherry, scraping up all concentrated caramelized fond. Pour in hot beef stock and bundle of thyme, simmering gently for 20 minutes.",
        "actionEs": "Desglasa el fondo con jerez seco, raspando los azúcares tostados. Vierte caldo caliente de res y tomillo, cocinando a hervor suave durante 20 minutos.",
        "techniqueId": "simmering",
        "toolId": "dutch_oven",
        "timerSeconds": 1200,
        "criticalRuleEn": "Simmer uncovered to gently concentrate flavors and allow onion sweetness to balance savory beef gelatin.",
        "criticalRuleEs": "Cocina destapado para concentrar sabores y lograr balance entre dulzor y cuerpo de gelatina."
      },
      {
        "stepNumber": 3,
        "titleEn": "Broiling the Gruyère Gratinée Crust",
        "titleEs": "Gratinado de Gruyère bajo la Salamandra",
        "actionEn": "Ladle hot soup into ceramic crocks. Float toasted baguette croutons on top and blanket generously with shredded Gruyère cheese. Broil in salamander until bubbly and blistered dark golden.",
        "actionEs": "Sirve la sopa hirviendo en cuencos de cerámica refractaria. Coloca rebanadas de baguette tostada y cubre generosamente con queso Gruyère rallado. Gratina hasta dorar con costra burbujeante.",
        "techniqueId": "gratinating",
        "toolId": "french_onion_soup_crocks",
        "timerSeconds": 240,
        "criticalRuleEn": "Croutons must be bone-dry toasted prior to assembly so they float buoyant rather than disintegrating instantly to bottom.",
        "criticalRuleEs": "El pan debe estar bien tostado y seco para flotar sin hundirse ni desintegrarse en el fondo."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "What chemical transformation turns pungent onions sweet and mahogany brown during slow cooking?",
        "questionEs": "¿Qué proceso químico transforma las cebollas picantes en dulces y caobas al cocinarse lentamente?",
        "options": [
          "Fermentation",
          "Caramelization of natural sugars and Maillard reaction",
          "Acid saponification",
          "Protein denaturation"
        ],
        "correctIndex": 1,
        "explanationEn": "Slow heat breaks down onion fructans into sweet simple sugars which caramelize, producing hundreds of rich aromatic flavor compounds.",
        "explanationEs": "El calor suave degrada los fructanos en azúcares simples que caramelizan desarrollando cientos de compuestos aromáticos."
      },
      {
        "questionEn": "Why is aged Gruyère or Comté cheese the gold standard for French onion soup gratinée?",
        "questionEs": "¿Por qué el queso Gruyère o Comté añejo es el estándar de oro para gratinar esta sopa?",
        "options": [
          "It melts smoothly with high oil separation",
          "It features exceptional melting stretch, rich nutty flavor, and browns without breaking into grease",
          "It dissolves into liquid broth",
          "It adds white color"
        ],
        "correctIndex": 1,
        "explanationEn": "Alpine raw milk cheeses like Gruyère contain ideal fat-to-protein ratios, melting into a cohesive, bubbly, savory brown crust.",
        "explanationEs": "Los quesos alpinos como el Gruyère poseen la proporción grasa-proteína ideal, fundiendo en una costra elástica y aromática."
      }
    ]
  },
  {
    "id": "beef_bourguignon_traditional",
    "nameEn": "Traditional Burgundy Beef Bourguignon",
    "nameEs": "Boeuf Bourguignon Tradicional de Borgoña",
    "category": "Meat & Poultry",
    "difficulty": "Advanced",
    "prepTime": "30 mins",
    "cookTime": "180 mins",
    "servings": 6,
    "descriptionEn": "Classic French stew of marbled beef chuck braised low and slow in red Burgundy Pinot Noir with bacon lardons, pearl onions, and sautéed cremini mushrooms.",
    "descriptionEs": "Estofado clásico francés de aguja de res cocida a fuego lento en vino tinto Pinot Noir de Borgoña con lardones de tocino, cebollitas perla y champiñones salteados.",
    "requiredIngredients": [
      {
        "id": "beef_chuck",
        "nameEn": "Beef Chuck Roast (Cut into 2-inch cubes)",
        "amount": 1400,
        "unit": "g"
      },
      {
        "id": "bacon_lardons",
        "nameEn": "Smoked Pork Bacon Lardons",
        "amount": 200,
        "unit": "g"
      },
      {
        "id": "red_burgundy_wine",
        "nameEn": "French Pinot Noir (Burgundy)",
        "amount": 750,
        "unit": "ml"
      },
      {
        "id": "beef_stock",
        "nameEn": "Rich Brown Beef Stock",
        "amount": 500,
        "unit": "ml"
      },
      {
        "id": "pearl_onions",
        "nameEn": "Glazed Pearl Onions",
        "amount": 200,
        "unit": "g"
      },
      {
        "id": "cremini_mushrooms",
        "nameEn": "Quartered Cremini Mushrooms",
        "amount": 300,
        "unit": "g"
      },
      {
        "id": "tomato_paste",
        "nameEn": "Double Concentrated Tomato Paste",
        "amount": 40,
        "unit": "g"
      }
    ],
    "requiredTools": [
      "dutch_oven",
      "chefs_knife",
      "skimmer_spider",
      "wooden_spoon"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Rendering Lardons and Searing Beef Cubes",
        "titleEs": "Dorado de Lardones y Sellado de Dados de Res",
        "actionEn": "Crisp bacon lardons in heavy Dutch oven; remove bacon with slotted spoon. Sear dry beef cubes in rendered bacon fat in small uncrowded batches until deeply caramelized on all sides.",
        "actionEs": "Dora los lardones de tocino en la olla; retira con espumadera. Sella los cubos de carne secos en la grasa del tocino por tandas pequeñas hasta dorar por todos lados.",
        "techniqueId": "searing",
        "toolId": "dutch_oven",
        "timerSeconds": 900,
        "criticalRuleEn": "Never crowd the pot; crowding lowers pan temperature, releasing moisture that boils the meat instead of searing.",
        "criticalRuleEs": "Nunca amontones la carne; el hacinamiento baja la temperatura soltando líquido y cociendo en vez de dorar."
      },
      {
        "stepNumber": 2,
        "titleEn": "Singer: Dusting with Flour and Deglazing with Wine",
        "titleEs": "Singer: Espolvoreado de Harina y Desglasado con Borgoña",
        "actionEn": "Return all beef to pot. Dust with 2 tablespoons flour (singer), tossing over medium heat for 2 minutes to cook raw starch. Pour in full bottle of red Burgundy wine and beef stock, scraping up fond.",
        "actionEs": "Regresa la carne a la olla. Espolvorea 2 cucharadas de harina (singer), tostando 2 minutos. Vierte la botella entera de vino de Borgoña y el caldo, raspando el fondo caramelizado.",
        "techniqueId": "singer_flour",
        "toolId": "wooden_spoon",
        "timerSeconds": 300,
        "criticalRuleEn": "Cook flour for two full minutes before adding liquid to prevent raw paste flavor.",
        "criticalRuleEs": "Tuesta la harina dos minutos antes de verter líquidos para eliminar el sabor a engrudo crudo."
      },
      {
        "stepNumber": 3,
        "titleEn": "Low and Slow Oven Braising",
        "titleEs": "Braseado Prolongado a Baja Temperatura en Horno",
        "actionEn": "Cover tightly with heavy lid and transfer to 160°C (325°F) oven for 2.5 to 3 hours until beef collagen melts into fork-tender gelatin.",
        "actionEs": "Tapa herméticamente y lleva a horno a 160°C (325°F) de 2.5 a 3 horas hasta que el colágeno se transforme en gelatina suave al tenedor.",
        "techniqueId": "braising",
        "toolId": "dutch_oven",
        "timerSeconds": 9000,
        "criticalRuleEn": "Gentle 160°C braising prevents muscle fibers from tightening into dry, stringy leather.",
        "criticalRuleEs": "El braseado suave a 160°C evita que las fibras musculares se tensen y queden secas."
      },
      {
        "stepNumber": 4,
        "titleEn": "Finishing with Glazed Pearl Onions and Sautéed Mushrooms",
        "titleEs": "Acabado con Cebollitas Glaseadas y Champiñones Salteados",
        "actionEn": "Skim surface fat. Stir in sautéed mushrooms and butter-glazed pearl onions. Simmer sauce for 10 minutes until it coats the back of a spoon with velvety sheen.",
        "actionEs": "Desgrasa la superficie. Incorpora los champiñones salteados y las cebollitas glaseadas en mantequilla. Cocina 10 minutos hasta lograr salsa untuosa tipo nappe.",
        "techniqueId": "simmering",
        "toolId": "wooden_spoon",
        "timerSeconds": 600,
        "criticalRuleEn": "Cook mushrooms and onions separately and fold in at the end to preserve distinct textures and colors.",
        "criticalRuleEs": "Cocina champiñones y cebollitas por separado e incorpóralos al final para preservar su textura intacta."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "What is the culinary term 'singer' in the context of braises and stews?",
        "questionEs": "¿Qué significa el término culinario 'singer' en el contexto de estofados y guisos?",
        "options": [
          "Singing while cooking",
          "Dusting sautéed ingredients with flour to create internal thickening before liquid addition",
          "Straining with cheesecloth",
          "Adding red wine"
        ],
        "correctIndex": 1,
        "explanationEn": "'Singer' refers to sprinkling flour directly onto browned ingredients to coat fat and thicken the braising broth naturally.",
        "explanationEs": "'Singer' consiste en espolvorear harina sobre las carnes doradas para ligar la salsa durante la cocción posterior."
      },
      {
        "questionEn": "What cuts of beef are ideal for braising in a Bourguignon?",
        "questionEs": "¿Qué corte de res es el más adecuado para brasear en un Bourguignon?",
        "options": [
          "Tenderloin / Filet mignon",
          "Collagen-rich cuts like beef chuck, brisket, or shank",
          "Ribeye steak",
          "Sirloin carpaccio"
        ],
        "correctIndex": 1,
        "explanationEn": "Cuts rich in connective tissue and collagen (like chuck) slowly break down into succulent, tender gelatin during long braising.",
        "explanationEs": "Cortes con abundante tejido conectivo y colágeno (como la aguja) se transforman en gelatina tierna al cocinarse despacio."
      }
    ]
  },
  {
    "id": "coq_au_vin_rouge",
    "nameEn": "Traditional Coq au Vin Rouge",
    "nameEs": "Coq au Vin Clásico al Vino Tinto",
    "category": "Meat & Poultry",
    "difficulty": "Intermediate",
    "prepTime": "25 mins",
    "cookTime": "60 mins",
    "servings": 4,
    "descriptionEn": "Rustic French chicken braised in full-bodied red Burgundy with bacon lardons, button mushrooms, garlic, and thyme, finished with velvety chicken stock reduction.",
    "descriptionEs": "Guiso rústico francés de pollo de corral cocido en vino tinto de Borgoña con lardones ahumados, champiñones, ajo y tomillo, ligado con salsa de vino brillante.",
    "requiredIngredients": [
      {
        "id": "whole_chicken",
        "nameEn": "Bone-in, Skin-on Chicken Thighs & Drumsticks",
        "amount": 1200,
        "unit": "g"
      },
      {
        "id": "red_burgundy_wine",
        "nameEn": "Dry Red Wine (Pinot Noir or Syrah)",
        "amount": 600,
        "unit": "ml"
      },
      {
        "id": "bacon_lardons",
        "nameEn": "Pork Bacon Lardons",
        "amount": 150,
        "unit": "g"
      },
      {
        "id": "button_mushrooms",
        "nameEn": "White Button Mushrooms",
        "amount": 250,
        "unit": "g"
      },
      {
        "id": "garlic_head",
        "nameEn": "Whole Garlic Cloves Peeled",
        "amount": 6,
        "unit": "cloves"
      },
      {
        "id": "chicken_stock",
        "nameEn": "Rich Chicken Stock",
        "amount": 350,
        "unit": "ml"
      }
    ],
    "requiredTools": [
      "dutch_oven",
      "chefs_knife",
      "roasting_tongs",
      "wooden_spoon"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Browning Bacon and Searing Chicken Pieces",
        "titleEs": "Dorado de Tocino y Sellado de Presas de Pollo",
        "actionEn": "Render lardons in Dutch oven until crisp; transfer to plate. Season chicken pieces with salt and sear in hot bacon fat skin-side down until golden crackling, turning once.",
        "actionEs": "Dora los lardones en la cazuela; reserva en plato. Sella las piezas de pollo con piel hacia abajo en la grasa del tocino hasta dorar la piel, volteando una vez.",
        "techniqueId": "searing",
        "toolId": "dutch_oven",
        "timerSeconds": 600,
        "criticalRuleEn": "Get a deep golden sear on chicken skin; this fat render is the foundation of the braise's soul.",
        "criticalRuleEs": "Consigue un dorado intenso en la piel; este dorado aporta el sabor medular del estofado."
      },
      {
        "stepNumber": 2,
        "titleEn": "Braising in Red Wine and Stock",
        "titleEs": "Braseado con Vino Tinto y Caldo",
        "actionEn": "Remove chicken, sauté garlic and tomato paste for 1 minute. Deglaze pot with full bottle of wine, return chicken, lardons, and fresh thyme, simmering gently for 40 minutes.",
        "actionEs": "Retira el pollo, saltea ajo y pasta de tomate 1 minuto. Desglasa con vino tinto, regresa el pollo, tocino y tomillo, cocinando a fuego suave tapado durante 40 minutos.",
        "techniqueId": "braising",
        "toolId": "dutch_oven",
        "timerSeconds": 2400,
        "criticalRuleEn": "Simmer at gentle bubble; violent boiling toughens poultry muscle fibers.",
        "criticalRuleEs": "Mantén un hervor suave; hervir a borbotones tensa las fibras del pollo resecándolo."
      },
      {
        "stepNumber": 3,
        "titleEn": "Beurre Manié Sauce Finishing",
        "titleEs": "Ligado Final con Beurre Manié",
        "actionEn": "Transfer cooked chicken to warm platter. Whisk equal parts soft butter and flour (beurre manié) into simmering sauce until glossy and thickened. Reintroduce chicken and mushrooms.",
        "actionEs": "Pasa el pollo a una fuente caliente. Incorpora beurre manié (mantequilla y harina amasadas) a la salsa hirviendo batiendo hasta espesar con brillo. Regresa el pollo.",
        "techniqueId": "beurre_manie_thickening",
        "toolId": "wooden_spoon",
        "timerSeconds": 300,
        "criticalRuleEn": "Whisk beurre manié in gradually; adding too much at once produces starchy clumps.",
        "criticalRuleEs": "Incorpora el beurre manié poco a poco; añadir demasiado de golpe genera grumos de harina."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "What is 'beurre manié' and how does it differ from a roux?",
        "questionEs": "¿Qué es 'beurre manié' y en qué se diferencia de un roux?",
        "options": [
          "Cold butter and flour kneaded uncooked and whisked directly into hot sauce",
          "Cooked butter and flour",
          "Clarified butter",
          "Melted cheese"
        ],
        "correctIndex": 0,
        "explanationEn": "Beurre manié is kneaded raw butter and flour, used off-the-cuff to thicken simmering sauces without pre-cooking.",
        "explanationEs": "El beurre manié es una pasta cruda de mantequilla y harina que se disuelve en salsas calientes para espesarlas al instante."
      },
      {
        "questionEn": "Why is bone-in dark meat (thighs, drumsticks) preferred over chicken breast for Coq au Vin?",
        "questionEs": "¿Por qué se prefieren muslos y contramuslos sobre la pechuga para el Coq au Vin?",
        "options": [
          "Dark meat is cheaper",
          "Dark meat contains more collagen and fat, staying juicy during prolonged red wine braising",
          "White meat turns purple",
          "Bones add salt"
        ],
        "correctIndex": 1,
        "explanationEn": "Lean chicken breasts dry out and turn stringy in a 45-minute braise, while dark meat stays succulent and flavorful.",
        "explanationEs": "La pechuga se reseca en cocciones largas, mientras que los muslos contienen colágeno que retiene humedad y sabor."
      }
    ]
  },
  {
    "id": "ratatouille_provencale",
    "nameEn": "Classic Ratatouille Provençale (Confit Byaldi)",
    "nameEs": "Ratatouille Provenzal Tradicional (Confit Byaldi)",
    "category": "Vegetarian & Heritage",
    "difficulty": "Beginner",
    "prepTime": "30 mins",
    "cookTime": "50 mins",
    "servings": 4,
    "descriptionEn": "Layered medallions of zucchini, yellow squash, Japanese eggplant, and Roma tomatoes arranged over a rich bell pepper piperade, slow-baked with olive oil, garlic, and thyme.",
    "descriptionEs": "Rodajas finas de calabacín, berenjena japonesa y tomate Roma dispuestas en espiral sobre piperrada de pimientos asados, horneadas con aceite de oliva virgen, ajo y tomillo.",
    "requiredIngredients": [
      {
        "id": "eggplant_japanese",
        "nameEn": "Slender Japanese Eggplants",
        "amount": 2,
        "unit": "fruits"
      },
      {
        "id": "zucchini_green",
        "nameEn": "Medium Green Zucchini",
        "amount": 2,
        "unit": "fruits"
      },
      {
        "id": "yellow_squash",
        "nameEn": "Yellow Summer Squash",
        "amount": 2,
        "unit": "fruits"
      },
      {
        "id": "roma_tomatoes",
        "nameEn": "Firm Roma Tomatoes",
        "amount": 5,
        "unit": "fruits"
      },
      {
        "id": "bell_peppers",
        "nameEn": "Red & Yellow Bell Peppers (for Piperade)",
        "amount": 3,
        "unit": "peppers"
      },
      {
        "id": "extra_virgin_olive_oil",
        "nameEn": "Provençal Extra Virgin Olive Oil",
        "amount": 60,
        "unit": "ml"
      }
    ],
    "requiredTools": [
      "mandoline_slicer",
      "chefs_knife",
      "baking_dish_ceramic",
      "parchment_paper"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Preparing Bell Pepper Piperade Bed",
        "titleEs": "Elaboración del Fondo de Piperrada de Pimientos",
        "actionEn": "Roast, peel, and mince bell peppers with onions, garlic, and tomato puree. Spread this fragrant piperade across bottom of ceramic baking dish as moist bed.",
        "actionEs": "Asa, pela y pica pimientos con cebolla, ajo y tomate triturado. Extiende esta piperrada aromática en el fondo de una fuente cerámica como lecho húmedo.",
        "techniqueId": "piperade_base",
        "toolId": "chefs_knife",
        "timerSeconds": 900,
        "criticalRuleEn": "A well-seasoned, moisture-rich base prevents the delicate sliced vegetables from drying and shriveling during baking.",
        "criticalRuleEs": "Una base húmeda y sazonada evita que las rodajas finas se deshidraten y queden secas en el horno."
      },
      {
        "stepNumber": 2,
        "titleEn": "Precision Mandoline Slicing",
        "titleEs": "Corte Preciso en Mandolina",
        "actionEn": "Using a mandoline slicer with cut-resistant glove, slice zucchini, eggplant, yellow squash, and tomatoes into identical 1/16-inch (1.5mm) medallions.",
        "actionEs": "Usando mandolina con guante anticorte, lamina calabacín, berenjena, calabacita amarilla y tomates en discos idénticos de 1.5 mm.",
        "techniqueId": "mandoline_slicing",
        "toolId": "mandoline_slicer",
        "timerSeconds": 600,
        "criticalRuleEn": "Uniform slice thickness is vital so every vegetable softens at the exact same cooking rate.",
        "criticalRuleEs": "El grosor uniforme es vital para que todas las verduras alcancen cocción pareja al mismo tiempo."
      },
      {
        "stepNumber": 3,
        "titleEn": "Concentric Shingled Arrangement",
        "titleEs": "Disposición Concéntrica en Tejado",
        "actionEn": "Arrange vegetable slices in alternating repeating sequence (zucchini, eggplant, squash, tomato) shingled tightly in concentric spirals over the piperade. Drizzle herb-garlic oil.",
        "actionEs": "Ordena las rodajas alternando colores (calabacín, berenjena, calabaza, tomate) en espirales concéntricas apretadas sobre la piperrada. Rocía con aceite de ajo y tomillo.",
        "techniqueId": "mise_en_place",
        "toolId": "baking_dish_ceramic",
        "timerSeconds": 900,
        "criticalRuleEn": "Overlap slices tightly; vegetables shrink considerably as their natural moisture evaporates.",
        "criticalRuleEs": "Traslapa bien las rodajas; el volumen se reduce bastante al evaporarse el agua natural en el horno."
      },
      {
        "stepNumber": 4,
        "titleEn": "Parchment Cartouche Baking",
        "titleEs": "Horneado con Cartouche de Papel",
        "actionEn": "Cut round parchment paper cartouche with center steam vent. Place directly on vegetables and bake at 180°C (350°F) for 40 minutes, removing paper last 10 minutes to caramelize edges.",
        "actionEs": "Recorta un disco de papel manteca (cartouche) con chimenea central. Cubre las verduras y hornea a 180°C (350°F) 40 minutos, retirando el papel los últimos 10 para dorar.",
        "techniqueId": "cartouche_baking",
        "toolId": "parchment_paper",
        "timerSeconds": 2400,
        "criticalRuleEn": "The cartouche traps steam right at the vegetable surface while venting excess water vapor.",
        "criticalRuleEs": "El cartouche retiene el vapor sobre las verduras liberando el exceso para no aguarlas."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "What is a culinary 'cartouche' used in baking vegetables or braising?",
        "questionEs": "¿Qué es un 'cartouche' culinario utilizado en cocciones y horneados?",
        "options": [
          "A metal skewer",
          "A tailored parchment paper lid placed directly in contact with food to regulate evaporation",
          "A ceramic pie weight",
          "A wooden spatula"
        ],
        "correctIndex": 1,
        "explanationEn": "A cartouche is a parchment lid placed flush onto food, providing gentle braising while preventing surface skinning.",
        "explanationEs": "El cartouche es una tapa de papel manteca en contacto con la comida que regula la evaporación sin resecar."
      },
      {
        "questionEn": "What culinary modern title was given to Thomas Keller's accordion-shingled ratatouille design?",
        "questionEs": "¿Qué nombre culinario moderno recibe la versión elegante en espiral creada por Thomas Keller?",
        "options": [
          "Tian de Provence",
          "Confit Byaldi",
          "Piperade Basque",
          "Moussaka"
        ],
        "correctIndex": 1,
        "explanationEn": "Keller popularized Michel Guérard's Confit Byaldi technique, turning rustic peasant stew into geometric haute cuisine.",
        "explanationEs": "Thomas Keller popularizó la técnica Confit Byaldi de Michel Guérard transformando el estofado rústico en arte geométrico."
      }
    ]
  },
  {
    "id": "chocolate_souffle_valrhona",
    "nameEn": "Valrhona Dark Chocolate Soufflé",
    "nameEs": "Soufflé Caliente de Chocolate Oscuro Valrhona",
    "category": "Desserts & Pastry",
    "difficulty": "Advanced",
    "prepTime": "25 mins",
    "cookTime": "14 mins",
    "servings": 4,
    "descriptionEn": "Dramatic, feather-light chocolate dessert rising proudly above ceramic ramekins, featuring a velvety molten chocolate interior beneath a delicate powdered-sugar crust.",
    "descriptionEs": "Postre ligero y aireado que se eleva sobre el borde del molde cerámico, con interior fluido y fundente de chocolate amargo bajo fina costra de azúcar glas.",
    "requiredIngredients": [
      {
        "id": "dark_chocolate_70",
        "nameEn": "Valrhona Guanaja 70% Dark Chocolate",
        "amount": 200,
        "unit": "g"
      },
      {
        "id": "egg_whites",
        "nameEn": "Fresh Egg Whites (Room Temp)",
        "amount": 6,
        "unit": "whites"
      },
      {
        "id": "egg_yolks",
        "nameEn": "Egg Yolks",
        "amount": 3,
        "unit": "yolks"
      },
      {
        "id": "granulated_sugar",
        "nameEn": "Fine Castor Sugar",
        "amount": 60,
        "unit": "g"
      },
      {
        "id": "unsalted_butter",
        "nameEn": "Soft Butter for Coating Ramekins",
        "amount": 40,
        "unit": "g"
      },
      {
        "id": "cocoa_powder",
        "nameEn": "Dutch-Processed Cocoa Powder",
        "amount": 30,
        "unit": "g"
      }
    ],
    "requiredTools": [
      "ramekins_porcelain",
      "pastry_brush",
      "stand_mixer",
      "rubber_spatula",
      "powdered_sugar_duster"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Upward Buttering and Sugar Coating Ramekins",
        "titleEs": "Enmantequillado Vertical y Encamisado de Moldes",
        "actionEn": "Brush softened butter upward along ramekin interior walls in straight vertical strokes. Chill 5 minutes, apply second coat, then coat with granulated sugar, tapping out excess.",
        "actionEs": "Pinta mantequilla pomada en trazos verticales hacia arriba en las paredes del molde. Enfría 5 minutos, da segunda capa y encamisa con azúcar retirando el sobrante.",
        "techniqueId": "ramekin_prep",
        "toolId": "pastry_brush",
        "timerSeconds": 300,
        "criticalRuleEn": "Vertical brush strokes give expanding egg whites a friction-free ladder to climb straight upward without lopsided tilting.",
        "criticalRuleEs": "Los trazos verticales crean una guía sin fricción para que el soufflé suba recto y no se incline chueco."
      },
      {
        "stepNumber": 2,
        "titleEn": "Melted Chocolate Base Emulsion",
        "titleEs": "Emulsión Base de Chocolate Fundido",
        "actionEn": "Gently melt 70% dark chocolate over simmering water bath. Whisk egg yolks into warm chocolate base until silky and shiny.",
        "actionEs": "Funde suavemente el chocolate oscuro al 70% a baño maría. Incorpora las yemas al chocolate tibio batiendo hasta formar crema brillante.",
        "techniqueId": "melting_chocolate",
        "toolId": "saucier_pan",
        "timerSeconds": 300,
        "criticalRuleEn": "Keep chocolate temperature below 50°C (122°F); hotter chocolate will cook yolk proteins into scramble.",
        "criticalRuleEs": "No superes los 50°C en el chocolate; calor excesivo cuaja las yemas formando grumos."
      },
      {
        "stepNumber": 3,
        "titleEn": "Whipping Medium-Peak Meringue and Folding",
        "titleEs": "Montado de Merengue a Punto Medio y Envolvente",
        "actionEn": "Whip egg whites to soft peaks, then slowly shower in sugar until glossy medium peaks form. Fold 1/3 of meringue into chocolate to lighten, then gently fold remaining whites with spatula.",
        "actionEs": "Monta claras a picos suaves y añade azúcar en lluvia hasta picos medios brillantes. Integra 1/3 del merengue para aligerar y luego el resto con espátula en forma envolvente.",
        "techniqueId": "folding_meringue",
        "toolId": "rubber_spatula",
        "timerSeconds": 360,
        "criticalRuleEn": "Never whip to dry, stiff peaks; stiff meringue collapses and separates. Stop at glossy, flexible peaks.",
        "criticalRuleEs": "Nunca batas hasta picos duros secos; el merengue rígido se rompe y colapsa al hornear."
      },
      {
        "stepNumber": 4,
        "titleEn": "Top Smoothing, Top-Hat Rim, and Baking",
        "titleEs": "Alisado Superior, Borde Libre y Horneado",
        "actionEn": "Fill ramekins to brim. Scrape top flat with offset spatula. Run thumb around inner rim to create 2mm moat (top hat). Bake at 195°C (385°F) for 12-14 minutes undisturbed.",
        "actionEs": "Llena los moldes al ras y alisa con espátula. Pasa el pulgar por el borde interior creando un canal de 2 mm. Hornea a 195°C (385°F) 12-14 minutos sin abrir el horno.",
        "techniqueId": "souffle_baking",
        "toolId": "ramekins_porcelain",
        "timerSeconds": 780,
        "criticalRuleEn": "NEVER open the oven door during the first 10 minutes; sudden cold air draft instantly deflates rising steam cells.",
        "criticalRuleEs": "JAMÁS abras la puerta del horno en los primeros 10 minutos; una ráfaga de aire frío colapsa las celdas de vapor."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "Why should you run your thumb around the top inner rim of the filled ramekin before baking?",
        "questionEs": "¿Por qué se pasa el pulgar por el borde interior del molde antes de hornear el soufflé?",
        "options": [
          "To clean dirty fingers",
          "It detaches batter from the ceramic rim, allowing it to rise straight up into a clean 'top hat'",
          "To add extra sugar",
          "To pop air bubbles"
        ],
        "correctIndex": 1,
        "explanationEn": "Creating a small groove detaches edge batter, preventing sticking and guaranteeing a straight, towering rise.",
        "explanationEs": "Crear esa pequeña zanja despega la masa del borde garantizando que suba uniforme como sombrero de copa."
      },
      {
        "questionEn": "What primary thermodynamic force causes a soufflé to puff and rise in the oven?",
        "questionEs": "¿Qué fuerza termodinámica principal hace inflar y elevar al soufflé?",
        "options": [
          "Baking soda gas release",
          "Expansion of air bubbles trapped in the whipped meringue combined with steam pressure",
          "Yeast fermentation",
          "Melted chocolate boiling"
        ],
        "correctIndex": 1,
        "explanationEn": "Trapped air in the whipped egg whites expands with heat, while water vapor turns to steam, multiplying volume.",
        "explanationEs": "El aire atrapado en el merengue se expande con el calor mientras el agua se convierte en vapor multiplicando el volumen."
      }
    ]
  },
  {
    "id": "paella_valenciana_marisco",
    "nameEn": "Seafood Paella Valenciana with Socarrat",
    "nameEs": "Paella Valenciana de Mariscos con Socarrat",
    "category": "Pasta & Rice",
    "difficulty": "Advanced",
    "prepTime": "30 mins",
    "cookTime": "35 mins",
    "servings": 6,
    "descriptionEn": "Authentic Spanish saffron rice simmered over open flame with jumbo prawns, calamari, mussels, and rich sofrito, finished with the legendary crispy caramelized rice crust (socarrat).",
    "descriptionEs": "Auténtico arroz con azafrán español cocido a fuego vivo con gambas gigantes, calamares, mejillones y sofrito casero, terminado con la legendaria costra crujiente de socarrat.",
    "requiredIngredients": [
      {
        "id": "bomba_rice",
        "nameEn": "Bomba or Calasparra Short-Grain Rice",
        "amount": 400,
        "unit": "g"
      },
      {
        "id": "saffron_threads",
        "nameEn": "Spanish Saffron Threads (La Mancha)",
        "amount": 1,
        "unit": "g"
      },
      {
        "id": "jumbo_shrimp",
        "nameEn": "Whole Shell-on Jumbo Red Prawns",
        "amount": 8,
        "unit": "pieces"
      },
      {
        "id": "squid_calamari",
        "nameEn": "Cleaned Calamari Squid Rings",
        "amount": 250,
        "unit": "g"
      },
      {
        "id": "mussels_fresh",
        "nameEn": "Fresh Mediterranean Mussels",
        "amount": 12,
        "unit": "pieces"
      },
      {
        "id": "fish_fumet",
        "nameEn": "Rich Shellfish Broth (Caldo de Marisco)",
        "amount": 1100,
        "unit": "ml"
      },
      {
        "id": "smoked_paprika",
        "nameEn": "Pimentón de la Vera (Smoked Paprika)",
        "amount": 10,
        "unit": "g"
      }
    ],
    "requiredTools": [
      "paella_pan",
      "paella_paddle",
      "mortar_and_pestle",
      "gas_burner_paella"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Searing Shellfish and Building Sofrito",
        "titleEs": "Sellado de Mariscos y Construcción del Sofrito",
        "actionEn": "Sear prawns in generous olive oil inside wide paella pan until red; remove and reserve. In same oil, sauté calamari, grated tomatoes, garlic, and smoked paprika into sweet sofrito jam.",
        "actionEs": "Sella las gambas en aceite de oliva en la paellera hasta dorar; retira y reserva. En el mismo aceite saltea calamares, tomate rallado, ajo y pimentón dulce hasta formar sofrito.",
        "techniqueId": "sofrito_foundation",
        "toolId": "paella_pan",
        "timerSeconds": 480,
        "criticalRuleEn": "Do not burn the pimentón; smoked paprika turns acrid and bitter if fried over extreme heat without moisture.",
        "criticalRuleEs": "Cuidado con quemar el pimentón; añadirlo junto al tomate rallado evita que se amargue."
      },
      {
        "stepNumber": 2,
        "titleEn": "Toasting Bomba Rice and Infusing Saffron",
        "titleEs": "Nacarado del Arroz Bomba e Infusión de Azafrán",
        "actionEn": "Add Bomba rice in cross shape across pan, stir into sofrito for 2 minutes to coat with fat (nacarar). Pour in boiling saffron-infused seafood stock and distribute rice evenly.",
        "actionEs": "Añade el arroz Bomba en cruz, rehoga en el sofrito 2 minutos para nacarar los granos. Vierte el caldo hirviendo infusionado con azafrán y distribuye el arroz parejo.",
        "techniqueId": "rice_distribution",
        "toolId": "paella_paddle",
        "timerSeconds": 180,
        "criticalRuleEn": "DO NOT STIR after the rice is distributed! Stirring releases amylopectin, transforming paella into gluey risotto.",
        "criticalRuleEs": "¡NO REMUEVAS el arroz una vez repartido! Remover libera almidón pegajoso arruinando el grano suelto."
      },
      {
        "stepNumber": 3,
        "titleEn": "Open Flame Simmering and Arranging Seafood",
        "titleEs": "Cocción a Fuego Vivo y Colocación de Mariscos",
        "actionEn": "Cook vigorously on high heat for 8 minutes, then reduce to medium-low for 10 minutes. Press mussels and reserved prawns into surface during final 5 minutes so steam opens shells.",
        "actionEs": "Cocina a fuego vivo 8 minutos y baja a medio-bajo 10 minutos. Entierra los mejillones y gambas en la superficie los últimos 5 minutos para que abran al vapor.",
        "techniqueId": "simmering",
        "toolId": "paella_pan",
        "timerSeconds": 1080,
        "criticalRuleEn": "Discard any mussels that fail to open after steaming.",
        "criticalRuleEs": "Desecha cualquier mejillón que permanezca cerrado tras la cocción."
      },
      {
        "stepNumber": 4,
        "titleEn": "Creating the Prized Socarrat Crust",
        "titleEs": "Elaboración del Preciado Socarrat",
        "actionEn": "When liquid is fully absorbed, increase burner heat to medium-high for 90 seconds. Listen for distinct crackling sizzle and detect roasted nutty aroma. Remove from heat and rest 5 minutes.",
        "actionEs": "Al absorberse el caldo, sube el fuego medio-alto por 90 segundos. Escucha el crepitar seco y huele el aroma tostado a avellana. Retira del fuego y reposa 5 minutos con paño limpio.",
        "techniqueId": "socarrat_caramelization",
        "toolId": "paella_pan",
        "timerSeconds": 150,
        "criticalRuleEn": "Differentiate between caramelized socarrat and burnt carbon; pull off heat the instant crackling sizzle intensifies.",
        "criticalRuleEs": "Distingue entre arroz caramelizado tostado y carbón quemado; retira en cuanto el chasquido sea intenso."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "What is 'socarrat' in the context of Spanish paella?",
        "questionEs": "¿Qué es el 'socarrat' en el contexto de la paella española?",
        "options": [
          "A type of wild rabbit",
          "The crunchy, caramelized, toasted layer of rice formed on the bottom of the pan",
          "A saffron mortar",
          "A tomato sofrito"
        ],
        "correctIndex": 1,
        "explanationEn": "Socarrat is the coveted bottom crust where rice sugars and oils fry against the metal into a crisp, caramelized golden crunch.",
        "explanationEs": "El socarrat es la codiciada costra crujiente de arroz caramelizado que se forma en el fondo de la paellera."
      },
      {
        "questionEn": "Why is stirring strictly forbidden once rice is dispersed in a paella pan?",
        "questionEs": "¿Por qué está estrictamente prohibido remover el arroz una vez repartido en la paella?",
        "options": [
          "It cools the stock",
          "Stirring abrades starch off grains, making rice mushy instead of individual and dry",
          "It breaks the saffron",
          "It turns prawns blue"
        ],
        "correctIndex": 1,
        "explanationEn": "Unlike risotto, paella grains must remain separate and dry; stirring releases starch and creates an unwanted creamy paste.",
        "explanationEs": "A diferencia del risotto, el arroz de paella debe quedar seco y suelto; removerlo suelta almidón y lo vuelve pastoso."
      }
    ]
  },
  {
    "id": "tiramisu_classico_veneto",
    "nameEn": "Tiramisù Classico Tradizionale",
    "nameEs": "Tiramisú Clásico de Treviso",
    "category": "Desserts & Pastry",
    "difficulty": "Beginner",
    "prepTime": "25 mins",
    "cookTime": "0 mins",
    "servings": 8,
    "descriptionEn": "Authentic Venetian layered dessert of airy savoiardi ladyfingers flash-dipped in strong espresso and Marsala wine, blanketed in rich mascarpone zabaione cream and bitter cocoa.",
    "descriptionEs": "Auténtico postre veneciano de bizcochos savoiardi bañados brevemente en café espresso y vino Marsala, cubiertos de crema sedosa de mascarpone y cacao amargo.",
    "requiredIngredients": [
      {
        "id": "mascarpone_cheese",
        "nameEn": "Italian Triple-Cream Mascarpone",
        "amount": 500,
        "unit": "g"
      },
      {
        "id": "savoiardi_ladyfingers",
        "nameEn": "Authentic Crisp Savoiardi Ladyfingers",
        "amount": 300,
        "unit": "g"
      },
      {
        "id": "egg_yolks",
        "nameEn": "Pasteurized Egg Yolks",
        "amount": 5,
        "unit": "yolks"
      },
      {
        "id": "espresso_coffee",
        "nameEn": "Freshly Pulled Strong Espresso Coffee",
        "amount": 350,
        "unit": "ml"
      },
      {
        "id": "marsala_wine",
        "nameEn": "Dry Sicilian Marsala Superiore Wine",
        "amount": 60,
        "unit": "ml"
      },
      {
        "id": "cocoa_powder",
        "nameEn": "Dutch-Processed Dark Cocoa Powder",
        "amount": 40,
        "unit": "g"
      },
      {
        "id": "granulated_sugar",
        "nameEn": "Caster Sugar",
        "amount": 100,
        "unit": "g"
      }
    ],
    "requiredTools": [
      "stand_mixer",
      "balloon_whisk",
      "baking_dish_ceramic",
      "mesh_sifter"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Whipping Zabaglione Yolks and Sugar",
        "titleEs": "Batido de Zabaglione con Yemas y Azúcar",
        "actionEn": "Whisk egg yolks and sugar over gentle double-boiler until pale, thick, and ribbon-stage (82°C / 180°F for pasteurization). Cool slightly.",
        "actionEs": "Bate yemas y azúcar a baño maría suave hasta blanquear y lograr punto de cinta denso (pasteurizando a 82°C). Enfría brevemente.",
        "techniqueId": "zabaglione_whipping",
        "toolId": "balloon_whisk",
        "timerSeconds": 420,
        "criticalRuleEn": "Do not let bowl touch boiling water; indirect steam heat prevents scrambling egg yolks.",
        "criticalRuleEs": "No permitas que el bol toque el agua hirviendo; el vapor indirecto evita que las yemas cuajen en tortilla."
      },
      {
        "stepNumber": 2,
        "titleEn": "Folding Mascarpone Cream",
        "titleEs": "Integración Suave del Mascarpone",
        "actionEn": "Gently soften chilled mascarpone with rubber spatula. Fold gently into the cool zabaglione in three additions until smooth and cloud-like.",
        "actionEs": "Suaviza el mascarpone con espátula de goma. Intégralo suavemente al zabaglione frío en tres tandas hasta lograr una crema homogénea y sedosa.",
        "techniqueId": "folding_cream",
        "toolId": "rubber_spatula",
        "timerSeconds": 240,
        "criticalRuleEn": "Do not over-whip mascarpone with electric beaters; excess mechanical agitation curdles high-fat cheese into butter.",
        "criticalRuleEs": "No sobrebatas el mascarpone con máquina eléctrica; el exceso de fricción corta la grasa convirtiéndola en mantequilla."
      },
      {
        "stepNumber": 3,
        "titleEn": "Two-Second Savoiardi Espresso Dip",
        "titleEs": "Inmersión Relámpago de Bizcochos Savoiardi",
        "actionEn": "Combine cooled espresso and Marsala wine. Dip ladyfingers for exactly 1.5 seconds per side. Arrange in tight single layer across dish bottom.",
        "actionEs": "Combina el café espresso frío con el vino Marsala. Sumerge cada bizcocho exactamente 1.5 segundos por lado. Coloca en capa compacta en la base.",
        "techniqueId": "savoiardi_dipping",
        "toolId": "baking_dish_ceramic",
        "timerSeconds": 300,
        "criticalRuleEn": "Do not soak ladyfingers; prolonged soaking turns them to mush that releases water into the cream.",
        "criticalRuleEs": "No empapes los bizcochos de más; el exceso de líquido aguará la crema arruinando la consistencia."
      },
      {
        "stepNumber": 4,
        "titleEn": "Layering, Chilling and Cocoa Dusting",
        "titleEs": "Montaje por Capas, Reposo en Frío y Cacao",
        "actionEn": "Spread half of mascarpone cream over ladyfingers. Repeat with second dipped layer. Refrigerate minimum 6 hours. Dust heavily with Dutch cocoa powder right before slicing.",
        "actionEs": "Extiende la mitad de la crema sobre los bizcochos. Repite con segunda capa. Refrigera mínimo 6 horas. Espolvorea abundante cacao amargo justo antes de servir.",
        "techniqueId": "sifting_cocoa",
        "toolId": "mesh_sifter",
        "timerSeconds": 21600,
        "criticalRuleEn": "A 6-hour chill is mandatory for ladyfingers to absorb moisture and firm the mascarpone structure for clean plating.",
        "criticalRuleEs": "El reposo de 6 horas en frío es mandatorio para que los bizcochos humedezcan y el tiramisú corte limpio."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "Why is high-fat Italian mascarpone susceptible to splitting if over-whipped?",
        "questionEs": "¿Por qué el mascarpone italiano se corta fácilmente si se sobrebate?",
        "options": [
          "It lacks sugar",
          "With over 45-50% butterfat content, mechanical shear breaks the fat emulsion into butter and whey",
          "It has too much acid",
          "It turns sour"
        ],
        "correctIndex": 1,
        "explanationEn": "Triple-cream mascarpone has high fat density; heavy beating breaks the delicate emulsion, separating it into butterfat grains.",
        "explanationEs": "El mascarpone tiene alto contenido graso; batirlo en exceso rompe la emulsión separando suero y mantequilla."
      },
      {
        "questionEn": "Why must ladyfingers be dipped for barely 1.5 to 2 seconds in espresso?",
        "questionEs": "¿Por qué los bizcochos savoiardi solo deben sumergirse 1.5 a 2 segundos en el café?",
        "options": [
          "To save coffee",
          "They act like dry sponges; excessive dipping waterlogs them, weeping liquid into the mascarpone",
          "To keep them raw",
          "To prevent caffeine toxicity"
        ],
        "correctIndex": 1,
        "explanationEn": "Savoiardi are airy sponge biscuits that absorb liquid aggressively; a quick dip preserves structural integrity.",
        "explanationEs": "Los savoiardi son esponjosos y porosos; un baño rápido retiene la estructura sin aguar el postre."
      }
    ]
  },
  {
    "id": "veal_osso_buco_milanese",
    "nameEn": "Braised Veal Osso Buco with Gremolata",
    "nameEs": "Osso Buco de Ternera a la Milanesa con Gremolata",
    "category": "Meat & Poultry",
    "difficulty": "Advanced",
    "prepTime": "25 mins",
    "cookTime": "150 mins",
    "servings": 4,
    "descriptionEn": "Cross-cut veal shanks with marrow-filled bone braised until meltingly tender in white wine, aromatic mirepoix, and veal broth, topped with zesty fresh citrus gremolata.",
    "descriptionEs": "Jarretes de ternera con hueso de caña y tuétano estofados lentamente en vino blanco, mirepoix y caldo de ternera, coronados con gremolata cítrica de perejil y limón.",
    "requiredIngredients": [
      {
        "id": "veal_shank",
        "nameEn": "Center-Cut Veal Shanks with Marrow Bone",
        "amount": 4,
        "unit": "pieces"
      },
      {
        "id": "dry_white_wine",
        "nameEn": "Dry White Italian Wine (Pinot Grigio)",
        "amount": 250,
        "unit": "ml"
      },
      {
        "id": "veal_stock",
        "nameEn": "Brown Veal Stock",
        "amount": 600,
        "unit": "ml"
      },
      {
        "id": "lemon_fresh",
        "nameEn": "Fresh Lemon Zest (for Gremolata)",
        "amount": 2,
        "unit": "lemons"
      },
      {
        "id": "fresh_parsley",
        "nameEn": "Flat-Leaf Italian Parsley",
        "amount": 1,
        "unit": "bunch"
      },
      {
        "id": "garlic_head",
        "nameEn": "Fresh Garlic Clove Minced",
        "amount": 2,
        "unit": "cloves"
      },
      {
        "id": "butchers_twine",
        "nameEn": "Kitchen Butcher's Twine",
        "amount": 4,
        "unit": "strings"
      }
    ],
    "requiredTools": [
      "butchers_twine",
      "dutch_oven",
      "chefs_knife",
      "microplane_zester"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Trussing Shanks with Kitchen Twine",
        "titleEs": "Bridado de los Jarretes con Hilo de Cocina",
        "actionEn": "Tie butcher's twine snugly around circumference of each veal shank. Dredge shanks lightly in seasoned flour, tapping off excess.",
        "actionEs": "Ata hilo de cocina alrededor del contorno de cada corte de jarrete. Pasa ligeramente por harina sazonada y sacude el exceso.",
        "techniqueId": "trussing_meat",
        "toolId": "butchers_twine",
        "timerSeconds": 300,
        "criticalRuleEn": "Tying the shanks is crucial; otherwise the contracting outer muscle pulls away from the bone during long braising.",
        "criticalRuleEs": "Atar la carne es crucial; de lo contrario el músculo se encoge separándose del hueso al estofar."
      },
      {
        "stepNumber": 2,
        "titleEn": "Deep Searing and White Wine Deglaze",
        "titleEs": "Sellado Profundo y Desglasado con Vino Blanco",
        "actionEn": "Sear shanks in olive oil inside Dutch oven until deep golden brown on both faces. Remove shanks, sauté mirepoix, deglaze with white wine, and add veal stock.",
        "actionEs": "Sella los jarretes en aceite de oliva hasta dorar bien por ambas caras. Retira la carne, saltea el mirepoix, desglasa con vino blanco y añade caldo de ternera.",
        "techniqueId": "searing",
        "toolId": "dutch_oven",
        "timerSeconds": 600,
        "criticalRuleEn": "Do not dislodge bone marrow while searing; marrow is the premier delicacy of the dish.",
        "criticalRuleEs": "Evita que el tuétano se salga del hueso al voltear; es la joya culinaria del plato."
      },
      {
        "stepNumber": 3,
        "titleEn": "Slow Oven Braising to Spoon-Tenderness",
        "titleEs": "Braseado en Horno hasta Ternura de Cuchara",
        "actionEn": "Return shanks to pot with broth reaching 2/3 up meat sides. Cover tightly and braise at 160°C (325°F) for 2 to 2.5 hours until meat pulls effortlessly from bone.",
        "actionEs": "Regresa los jarretes con el líquido cubriendo 2/3 de la carne. Tapa y hornea a 160°C (325°F) de 2 a 2.5 horas hasta que la carne se desprenda con facilidad.",
        "techniqueId": "braising",
        "toolId": "dutch_oven",
        "timerSeconds": 7200,
        "criticalRuleEn": "The liquid should gently lap around meat rather than submerge it, braising rather than boiling.",
        "criticalRuleEs": "El líquido no debe tapar la carne por completo para que brasee al vapor y no se hierva."
      },
      {
        "stepNumber": 4,
        "titleEn": "Finishing with Zesty Fresh Gremolata",
        "titleEs": "Corona Fresca con Gremolata Cítrica",
        "actionEn": "Finely chop fresh parsley, microplane lemon zest, and mince garlic clove together on cutting board. Scatter raw gremolata over hot osso buco just before serving.",
        "actionEs": "Pica finamente perejil fresco, ralla piel de limón con microplane y pica ajo. Esparce esta gremolata cruda sobre el osso buco caliente justo antes de servir.",
        "techniqueId": "gremolata_garnish",
        "toolId": "microplane_zester",
        "timerSeconds": 180,
        "criticalRuleEn": "Always prepare gremolata fresh and raw; cooking destroys the citrus oils and parsley vibrancy that cuts the rich braise.",
        "criticalRuleEs": "Prepara la gremolata cruda al instante; cocinarla apaga los aceites cítricos que equilibran la grasa del tuétano."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "Why is butcher's twine tied around each veal shank before cooking Osso Buco?",
        "questionEs": "¿Por qué se ata hilo de cocina alrededor del jarrete antes de cocinar el Osso Buco?",
        "options": [
          "To decorate the plate",
          "To prevent muscle shrinkage from pulling away and separating from the center marrow bone",
          "To absorb fat",
          "To track cooking time"
        ],
        "correctIndex": 1,
        "explanationEn": "During braising, connective tissue contracts and pulls meat away; twine preserves the intact steak shape.",
        "explanationEs": "Al cocinarse, el tejido se contrae y desarmaría la pieza; el hilo mantiene la carne pegada al hueso."
      },
      {
        "questionEn": "What three fresh ingredients compose a traditional Italian 'gremolata'?",
        "questionEs": "¿Cuáles son los tres ingredientes frescos que componen la 'gremolata' italiana?",
        "options": [
          "Olive oil, vinegar, and oregano",
          "Finely minced flat-leaf parsley, fresh lemon zest, and minced garlic",
          "Basil, pine nuts, and parmesan",
          "Tomato, onion, and chili"
        ],
        "correctIndex": 1,
        "explanationEn": "Classic gremolata blends raw parsley, lemon zest, and garlic to deliver a bright aromatic punch that cuts heavy braise richness.",
        "explanationEs": "La gremolata clásica combina perejil, ralladura de limón y ajo crudo aportando frescura cítrica a los estofados ricos en grasa."
      }
    ]
  },
  {
    "id": "salmon_gravlax_nordic",
    "nameEn": "Cured Nordic Salmon Gravlax",
    "nameEs": "Gravlax Nórdico de Salmón Curado al Eneldo",
    "category": "Seafood",
    "difficulty": "Beginner",
    "prepTime": "20 mins",
    "cookTime": "0 mins",
    "servings": 6,
    "descriptionEn": "Sashimi-grade Atlantic salmon fillet cured for 48 hours under salt, sugar, cracked white peppercorns, crushed juniper, aquavit, and dense bunches of fresh dill.",
    "descriptionEs": "Filete de salmón atlántico curado durante 48 horas bajo costra de sal marina, azúcar, pimienta blanca, enebro machacado, aquavit y abundante eneldo fresco.",
    "requiredIngredients": [
      {
        "id": "salmon_fillet",
        "nameEn": "Center-Cut Atlantic Salmon Side (Skin-On)",
        "amount": 1000,
        "unit": "g"
      },
      {
        "id": "sea_salt_coarse",
        "nameEn": "Coarse Sea Salt",
        "amount": 100,
        "unit": "g"
      },
      {
        "id": "granulated_sugar",
        "nameEn": "Caster Sugar",
        "amount": 100,
        "unit": "g"
      },
      {
        "id": "fresh_dill",
        "nameEn": "Fresh Dill Bunches",
        "amount": 3,
        "unit": "bunches"
      },
      {
        "id": "white_peppercorns",
        "nameEn": "Cracked White Peppercorns",
        "amount": 15,
        "unit": "g"
      },
      {
        "id": "aquavit_gin",
        "nameEn": "Scandinavian Aquavit or Botanical Gin",
        "amount": 45,
        "unit": "ml"
      }
    ],
    "requiredTools": [
      "slicing_knife",
      "chefs_knife",
      "baking_dish_ceramic",
      "fish_tweezers"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "titleEn": "Pin-Boning and Surface Inspection",
        "titleEs": "Desespinado con Pinzas y Limpieza",
        "actionEn": "Run fingertips along center line of salmon fillet to locate pin bones. Extract each bone diagonally with fish tweezers without tearing the flesh.",
        "actionEs": "Pasa los dedos sobre la línea media del salmón para ubicar las espinas. Extrae cada una en diagonal con pinzas de pescado sin romper la pulpa.",
        "techniqueId": "pin_boning",
        "toolId": "fish_tweezers",
        "timerSeconds": 300,
        "criticalRuleEn": "Pulling bones vertically tears delicate salmon flesh; always pull along natural forward angle of bone growth.",
        "criticalRuleEs": "Tirar de las espinas hacia arriba rasga la pulpa; jala siempre en el ángulo natural de inserción."
      },
      {
        "stepNumber": 2,
        "titleEn": "Curing Rub Application and Dill Blanket",
        "titleEs": "Aplicación de la Salmuera Seca y Capa de Eneldo",
        "actionEn": "Mix salt, sugar, cracked pepper, and juniper. Splash salmon flesh with aquavit, pack cure mix evenly over flesh, and cover with thick blanket of chopped fresh dill.",
        "actionEs": "Mezcla sal, azúcar, pimienta machacada y enebro. Rocía el salmón con aquavit, cubre con la mezcla de curado y cubre con un colchón denso de eneldo fresco picado.",
        "techniqueId": "curing_salt",
        "toolId": "chefs_knife",
        "timerSeconds": 300,
        "criticalRuleEn": "Even 1:1 salt-to-sugar ratio draws moisture out via osmosis while seasoning and preventing hyper-saline stiffness.",
        "criticalRuleEs": "La proporción equilibrada 1:1 de sal y azúcar deshidrata por ósmosis sazonando sin endurecer en exceso."
      },
      {
        "stepNumber": 3,
        "titleEn": "Weighted Refrigerated Curing (48 Hours)",
        "titleEs": "Curado Bajo Peso en Refrigeración (48 Horas)",
        "actionEn": "Wrap tightly in plastic wrap, place in glass dish, and set 2-pound weight on top. Chill in refrigerator for 48 hours, flipping fillet every 12 hours and basting in extracted brine.",
        "actionEs": "Envuelve en plástico film, coloca en fuente con un peso de 1 kg encima. Refrigera 48 horas, volteando el filete cada 12 horas y bañándolo en los jugos liberados.",
        "techniqueId": "osmosis_curing",
        "toolId": "baking_dish_ceramic",
        "timerSeconds": 172800,
        "criticalRuleEn": "Weights compress the muscle, squeezing free water out and creating the signature dense, sliceable gravlax texture.",
        "criticalRuleEs": "El peso compacta el músculo extrayendo agua libre para lograr la textura firme ideal para cortar fino."
      },
      {
        "stepNumber": 4,
        "titleEn": "Paper-Thin Angle Slicing",
        "titleEs": "Corte Transparente al Sesgo",
        "actionEn": "Scrape off curing herbs, pat dry. Using long flexible slicing knife held at low 20-degree angle, shave paper-thin translucent ribbons away from the skin.",
        "actionEs": "Retira el exceso de hierbas y seca. Con un cuchillo fileteador largo a 20 grados, corta láminas translúcidas casi transparentes sin tocar la piel.",
        "techniqueId": "thin_slicing",
        "toolId": "slicing_knife",
        "timerSeconds": 300,
        "criticalRuleEn": "Slice paper-thin; thick gravlax feels rubbery, whereas translucent shavings melt delightfully on the palate.",
        "criticalRuleEs": "Corta ultra fino; láminas gruesas resultan gomosas, mientras que cortes finos se funden en el paladar."
      }
    ],
    "checkpointQuestions": [
      {
        "questionEn": "What chemical mechanism cures raw salmon into gravlax without heat?",
        "questionEs": "¿Qué mecanismo químico cura el salmón crudo en gravlax sin calor?",
        "options": [
          "Bacterial fermentation",
          "Osmotic dehydration and salt-denaturing of proteins",
          "Acid hydrolysis by vinegar",
          "Alcohol boiling"
        ],
        "correctIndex": 1,
        "explanationEn": "Salt draws free water out of muscle tissue via osmosis, inhibiting spoilage microbes and firming protein structure.",
        "explanationEs": "La sal extrae el agua celular por ósmosis e inhibe bacterias reafirmando la estructura proteica."
      },
      {
        "questionEn": "Why is a long, flexible slicing knife held at an acute 20-degree angle for cutting gravlax?",
        "questionEs": "¿Por qué se utiliza un cuchillo fileteador flexible a 20 grados para cortar gravlax?",
        "options": [
          "To avoid cutting bone",
          "To produce ultra-thin, wide, translucent ribbons that maximize tenderness and surface area",
          "To warm up the fish",
          "To scrape scales"
        ],
        "correctIndex": 1,
        "explanationEn": "An acute slicing angle creates wide, paper-thin ribbons that melt on the tongue without fibrous resistance.",
        "explanationEs": "Un ángulo agudo produce lonchas amplias y translúcidas que se deshacen en la boca sin resistencia fibrosa."
      }
    ]
  }
];

  const customerOrders = [
  {
    "orderId": "ORD_VIP_01",
    "guestProfile": {
      "name": "Henri de Saint-Germain",
      "persona": "The Michelin Inspector / Discerning Food Critic",
      "tableNumber": 4,
      "dietaryRestrictions": [
        "Strict No Artificial Additives",
        "No Trans Fats"
      ],
      "mood": "Demanding, analytical, formal",
      "patienceSeconds": 900
    },
    "ticket": {
      "tableNumber": 4,
      "serverName": "Jean-Paul",
      "timestamp": "19:45:00",
      "urgent": false,
      "items": [
        {
          "nameEn": "Pan-Roasted Duck Breast à l'Orange",
          "nameEs": "Magret de Pato a la Naranja",
          "modification": "Cook strictly rosy medium-rare (54°C). Ensure skin is wafer-thin and fat fully rendered without residual rubberiness.",
          "allergensToAvoid": [
            "artificial_additives"
          ],
          "station": "Entremetier & Sauté"
        },
        {
          "nameEn": "Vanilla Bean Crème Brûlée",
          "nameEs": "Crème Brûlée con Vainilla Bourbon",
          "modification": "Sugar crust must be caramelized tableside; custard must wobble gently at exact center without air bubbles.",
          "allergensToAvoid": [],
          "station": "Pâtisserie"
        }
      ]
    },
    "dialogue": [
      {
        "speaker": "Jean-Paul",
        "role": "server",
        "en": "Good evening, sir. Welcome to L'Étoile. May I present tonight's tasting selections, or do you have a specific culinary direction in mind?",
        "es": "Buenas noches, señor. Bienvenido a L'Étoile. ¿Me permite presentarle las selecciones de degustación o tiene en mente una dirección culinaria específica?"
      },
      {
        "speaker": "Henri",
        "role": "guest",
        "en": "Good evening. I shall have the roasted Moulard duck breast. However, please convey to Chef that I expect the subcutaneous fat cap to be rendered paper-thin, cooked precisely medium-rare with a bittersweet gastrique.",
        "es": "Buenas noches. Tomaré el magret de pato Moulard. No obstante, transmita al Chef que espero que la grasa subcutánea esté desgrasada como papel, a término medio-rojo exacto con gastrique agridulce."
      },
      {
        "speaker": "Jean-Paul",
        "role": "server",
        "en": "Understood with utmost precision, sir. Chef renders our magret in a cold pan over low heat for 14 minutes to guarantee brittle crackling skin. I will notify the pass immediately.",
        "es": "Entendido con absoluta precisión, señor. El Chef desgrasa el magret en sartén fría a fuego suave durante 14 minutos para garantizar piel crocante. Avisaré al pase de inmediato."
      }
    ],
    "comprehensionQuiz": {
      "questionEn": "What specific culinary requirement did the Michelin inspector emphasize regarding the duck breast?",
      "questionEs": "¿Qué exigencia culinaria específica enfatizó el inspector Michelin respecto al magret de pato?",
      "options": [
        "Well-done temperature with sweet honey sauce",
        "Subcutaneous fat fully rendered wafer-thin and cooked precisely medium-rare (54°C)",
        "Deep-fried in vegetable oil",
        "Served cold with salad"
      ],
      "correctIndex": 1,
      "explanationEn": "The critic expects technical mastery: paper-thin rendered crispy skin with rosy medium-rare tender flesh.",
      "explanationEs": "El crítico exige maestría técnica: piel desgrasada fina y crocante con carne jugosa a término medio-rojo rosado."
    }
  },
  {
    "orderId": "ORD_VIP_02",
    "guestProfile": {
      "name": "Elena Rostova",
      "persona": "The Celiac / Highly Allergic Guest",
      "tableNumber": 12,
      "dietaryRestrictions": [
        "Severe Celiac / Gluten-Free",
        "Soy Allergy"
      ],
      "mood": "Anxious, cautious, appreciative",
      "patienceSeconds": 1200
    },
    "ticket": {
      "tableNumber": 12,
      "serverName": "Sophie",
      "timestamp": "20:05:00",
      "urgent": false,
      "items": [
        {
          "nameEn": "Chilean Sea Bass en Papillote (100% Gluten-Free)",
          "nameEs": "Lubina Chilena en Papillote (Sin Gluten)",
          "modification": "CRITICAL CELIAC ALLERGY: Zero wheat, zero soy sauce, zero flour dusting. Use dedicated sanitized stainless steel cutting board and pans.",
          "allergensToAvoid": [
            "gluten",
            "wheat",
            "soy"
          ],
          "station": "Poissonier"
        }
      ]
    },
    "dialogue": [
      {
        "speaker": "Elena",
        "role": "guest",
        "en": "Excuse me, I have severe celiac disease. Even trace flour cross-contamination causes immediate hospitalization. Can you guarantee the sea bass en papillote is completely gluten-free?",
        "es": "Disculpe, tengo celiaquía severa. Incluso trazas de harina por contaminación cruzada me hospitalizan. ¿Puede garantizar que la lubina en papillote está 100% libre de gluten?"
      },
      {
        "speaker": "Sophie",
        "role": "server",
        "en": "Rest assured, Elena. Our sea bass en papillote naturally contains no flour roux or soy. I will personally supervise our Poissonier to sanitize cutting boards, knives, and prep areas before assembling your parchment pouch.",
        "es": "Pierda todo cuidado, Elena. Nuestra lubina en papillote no utiliza roux ni soya. Supervisaré personalmente al Poissonier para desinfectar tablas, cuchillos y superficies antes de armar su paquete."
      }
    ],
    "comprehensionQuiz": {
      "questionEn": "What protocol must the kitchen execute to safely serve a guest with severe celiac disease?",
      "questionEs": "¿Qué protocolo debe ejecutar la cocina para atender con seguridad a un comensal celíaco severo?",
      "options": [
        "Wipe the plate with an apron",
        "Use dedicated sanitized cutting boards, knives, and uncontaminated gluten-free ingredients to prevent cross-contact",
        "Cook the food at 300°C to burn away gluten proteins",
        "Add lemon juice to neutralize wheat"
      ],
      "correctIndex": 1,
      "explanationEn": "Celiac safety requires strict physical separation, sanitized equipment, and verified allergen-free ingredients; heat does not destroy gluten.",
      "explanationEs": "La seguridad celíaca exige separación estricta, utensilios sanitizados e ingredientes certificados; el calor no destruye el gluten."
    }
  },
  {
    "orderId": "ORD_VIP_03",
    "guestProfile": {
      "name": "Marcus Vance",
      "persona": "The Vegan Foodie Critic",
      "tableNumber": 7,
      "dietaryRestrictions": [
        "Strict Vegan (No Dairy, No Gelatin, No Honey, No Eggs)"
      ],
      "mood": "Inquisitive, passionate, sustainability-focused",
      "patienceSeconds": 1000
    },
    "ticket": {
      "tableNumber": 7,
      "serverName": "David",
      "timestamp": "20:15:00",
      "urgent": false,
      "items": [
        {
          "nameEn": "Classic Ratatouille Provençale (Confit Byaldi)",
          "nameEs": "Ratatouille Provenzal Tradicional",
          "modification": "100% plant-based: verify olive oil is cold-pressed, zero chicken stock in piperade base, zero butter finish.",
          "allergensToAvoid": [
            "dairy",
            "butter",
            "eggs",
            "meat_stocks"
          ],
          "station": "Garde Manger & Entremetier"
        }
      ]
    },
    "dialogue": [
      {
        "speaker": "Marcus",
        "role": "guest",
        "en": "Hello! I am excited to dine here tonight. Does your Ratatouille Confit Byaldi use any animal fats, bone broths, or butter in the piperade or herb dressing?",
        "es": "¡Hola! Me emociona cenar aquí esta noche. ¿Su Ratatouille Confit Byaldi contiene grasas animales, fondos de hueso o mantequilla en la piperrada o en el aderezo?"
      },
      {
        "speaker": "David",
        "role": "server",
        "en": "Not a single drop, Marcus. Our Confit Byaldi is 100% plant-forward: simmered exclusively in estate-bottled Provençal extra virgin olive oil, vine-ripened tomatoes, and fresh garden herbs.",
        "es": "Ni una sola gota, Marcus. Nuestro Confit Byaldi es 100% vegetal: cocinado exclusivamente con aceite de oliva virgen extra provenzal, tomates madurados en rama y hierbas frescas."
      }
    ],
    "comprehensionQuiz": {
      "questionEn": "What fat source is authentically used in traditional Provençal Ratatouille, making it naturally vegan?",
      "questionEs": "¿Qué fuente de grasa se utiliza auténticamente en la Ratatouille provenzal, haciéndola naturalmente vegana?",
      "options": [
        "Duck fat",
        "Cold-pressed extra virgin olive oil",
        "Clarified butter (Ghee)",
        "Beef tallow"
      ],
      "correctIndex": 1,
      "explanationEn": "Authentic Provençal cuisine relies on extra virgin olive oil rather than dairy butter or animal fats.",
      "explanationEs": "La cocina provenzal auténtica se basa en aceite de oliva virgen extra en lugar de mantequilla o grasa animal."
    }
  },
  {
    "orderId": "ORD_VIP_04",
    "guestProfile": {
      "name": "Arthur Pendelton",
      "persona": "The Rushed Corporate Executive",
      "tableNumber": 2,
      "dietaryRestrictions": [],
      "mood": "Impatient, time-pressured, direct",
      "patienceSeconds": 600
    },
    "ticket": {
      "tableNumber": 2,
      "serverName": "Claire",
      "timestamp": "12:15:00",
      "urgent": true,
      "items": [
        {
          "nameEn": "Pan-Seared Sea Scallops St. Jacques",
          "nameEs": "Vieiras Salteadas San Jacques",
          "modification": "RUSH ORDER: Guest has board meeting in 25 minutes. Fire immediately on the fly.",
          "allergensToAvoid": [],
          "station": "Poissonier"
        }
      ]
    },
    "dialogue": [
      {
        "speaker": "Arthur",
        "role": "guest",
        "en": "Listen, I have an international shareholder meeting in exactly 25 minutes. What can you fire right now that is exquisite, protein-packed, and takes under 7 minutes to cook?",
        "es": "Escuche, tengo junta de accionistas en 25 minutos exactos. ¿Qué pueden marchar de inmediato que sea exquisito, con proteína y tome menos de 7 minutos?"
      },
      {
        "speaker": "Claire",
        "role": "server",
        "en": "I strongly recommend our Pan-Seared Sea Scallops St. Jacques, Mr. Pendelton. Searing takes precisely 3 minutes in clarified butter, served over warm cauliflower velouté. I will mark your ticket 'ON THE FLY' right now.",
        "es": "Le recomiendo nuestras vieiras salteadas San Jacques, Sr. Pendelton. Toman exactamente 3 minutos de sellado en mantequilla clarificada sobre velouté de coliflor. Marcaré su comanda 'ON THE FLY' ya mismo."
      }
    ],
    "comprehensionQuiz": {
      "questionEn": "What kitchen brigade slang phrase instructs chefs to prepare an order with utmost priority and immediate speed?",
      "questionEs": "¿Qué término de la brigada de cocina instruye preparar una comanda con máxima prioridad y velocidad inmediata?",
      "options": [
        "Behind!",
        "On the fly",
        "86 Table 2",
        "In the weeds"
      ],
      "correctIndex": 1,
      "explanationEn": "'On the fly' tells the culinary line to drop everything and cook the dish immediately for a rushed guest.",
      "explanationEs": "'On the fly' (al vuelo) indica a la brigada despachar el plato con urgencia extrema e inmediata."
    }
  },
  {
    "orderId": "ORD_VIP_05",
    "guestProfile": {
      "name": "Julian & Genevieve Monet",
      "persona": "The Romantic Anniversary Couple",
      "tableNumber": 9,
      "dietaryRestrictions": [],
      "mood": "Celebratory, relaxed, romantic",
      "patienceSeconds": 1500
    },
    "ticket": {
      "tableNumber": 9,
      "serverName": "Jean-Paul",
      "timestamp": "20:30:00",
      "urgent": false,
      "items": [
        {
          "nameEn": "Filet Mignon with Red Wine Demi-Glace (x2)",
          "nameEs": "Filet Mignon con Demi-Glace al Vino Tinto (x2)",
          "modification": "One cooked medium-rare (54°C), one cooked medium (63°C). Present on heated porcelain.",
          "allergensToAvoid": [],
          "station": "Saucier & Grill"
        },
        {
          "nameEn": "Valrhona Dark Chocolate Soufflé",
          "nameEs": "Soufflé de Chocolate Valrhona",
          "modification": "Anniversary chocolate plaque: 'Happy 25th Anniversary'. Fire soufflé 14 minutes before entrees finish.",
          "allergensToAvoid": [],
          "station": "Pâtisserie"
        }
      ]
    },
    "dialogue": [
      {
        "speaker": "Julian",
        "role": "guest",
        "en": "Tonight is our 25th silver wedding anniversary. We want to savor two Filet Mignon steaks—mine medium-rare, Genevieve's medium—and finish with the legendary Valrhona soufflé.",
        "es": "Esta noche celebramos 25 años de matrimonio. Queremos degustar dos solomillos de res —el mío medio-rojo, el de Genevieve a punto medio— y terminar con el legendario soufflé Valrhona."
      },
      {
        "speaker": "Jean-Paul",
        "role": "server",
        "en": "Happy 25th Anniversary! An exceptional pairing. I will time our pastry chef to whip and bake your soufflés so they emerge towering and molten the exact moment you conclude your entrees.",
        "es": "¡Feliz 25 aniversario! Una elección maravillosa. Coordinaré con el chef pastelero para que hornee sus soufflés y salgan inflados y fundentes justo cuando terminen su corte."
      }
    ],
    "comprehensionQuiz": {
      "questionEn": "Why must a hot chocolate soufflé order be fired and timed 14 minutes in advance of dessert service?",
      "questionEs": "¿Por qué el soufflé caliente debe marcharse con 14 minutos de anticipación al servicio de postre?",
      "options": [
        "To allow chocolate to melt slowly in the fridge",
        "Soufflés must be baked to order and deflate within 3 minutes of leaving the oven, requiring split-second timing",
        "Because egg whites take 1 hour to whip",
        "To cool down the ceramic dish"
      ],
      "correctIndex": 1,
      "explanationEn": "Soufflés cannot be held under heat lamps; they rise in 14 minutes and begin collapsing within 180 seconds of oven extraction.",
      "explanationEs": "El soufflé no espera al cliente; tarda 14 minutos en hornear y colapsa a los 3 minutos de sacarlo del horno."
    }
  },
  {
    "orderId": "ORD_VIP_06",
    "guestProfile": {
      "name": "Countess Beatrice Falcone",
      "persona": "The Wine Connoisseur / Master Sommelier",
      "tableNumber": 1,
      "dietaryRestrictions": [
        "Low Sodium"
      ],
      "mood": "Sophisticated, nuanced, academic",
      "patienceSeconds": 1200
    },
    "ticket": {
      "tableNumber": 1,
      "serverName": "Jean-Paul",
      "timestamp": "19:15:00",
      "urgent": false,
      "items": [
        {
          "nameEn": "Traditional Burgundy Beef Bourguignon",
          "nameEs": "Boeuf Bourguignon Tradicional de Borgoña",
          "modification": "Pair with 2018 Domaine de la Romanée-Conti. Light touch with finishing salt to preserve delicate wine tannins.",
          "allergensToAvoid": [
            "excess_salt"
          ],
          "station": "Saucier"
        }
      ]
    },
    "dialogue": [
      {
        "speaker": "Beatrice",
        "role": "guest",
        "en": "I have ordered a Premier Cru Burgundy Pinot Noir. I require a dish with earthy forest notes, gentle acidity, and melting braised beef collagen that will marry seamlessly with the vintage's silky tannins.",
        "es": "He ordenado un Pinot Noir Premier Cru de Borgoña. Requiero un plato con notas terrosas de bosque, acidez elegante y colágeno braseado que armonice con los taninos sedosos de la cosecha."
      },
      {
        "speaker": "Jean-Paul",
        "role": "server",
        "en": "Our traditional Boeuf Bourguignon is the transcendent pairing, Countess. Braised for 3 hours in identical Burgundy Pinot Noir with sautéed cremini mushrooms, it mirrors the wine's terroir impeccably.",
        "es": "Nuestro Boeuf Bourguignon tradicional es el maridaje supremo, Condesa. Estofado durante 3 horas en vino Pinot Noir de Borgoña con champiñones cremini, refleja el terroir de forma impecable."
      }
    ],
    "comprehensionQuiz": {
      "questionEn": "Why does Beef Bourguignon pair harmoniously with Pinot Noir from the Burgundy region?",
      "questionEs": "¿Por qué el Boeuf Bourguignon marida armónicamente con un Pinot Noir de Borgoña?",
      "options": [
        "Because both are white",
        "The dish is braised directly in Burgundy red wine, sharing the exact aromatic esters, earthiness, and acidity of the grape",
        "It hides poor wine flaws",
        "Because sugar is added"
      ],
      "correctIndex": 1,
      "explanationEn": "The classical rule 'what grows together goes together' applies: cooking with the region's wine bonds dish and vintage aromatics.",
      "explanationEs": "Aplica la regla 'lo que crece junto va junto': cocinar con el mismo vino crea un puente aromático idéntico con la copa."
    }
  },
  {
    "orderId": "ORD_VIP_07",
    "guestProfile": {
      "name": "Darius Sterling",
      "persona": "The Health-Conscious Athlete",
      "tableNumber": 5,
      "dietaryRestrictions": [
        "High Protein",
        "Low Carb / Keto",
        "No Refined Seed Oils"
      ],
      "mood": "Disciplined, energetic, fitness-focused",
      "patienceSeconds": 900
    },
    "ticket": {
      "tableNumber": 5,
      "serverName": "Sophie",
      "timestamp": "13:30:00",
      "urgent": false,
      "items": [
        {
          "nameEn": "Cured Nordic Salmon Gravlax & Filet Mignon (Protein Double)",
          "nameEs": "Salmón Gravlax Nórdico y Solomillo de Res",
          "modification": "NO bread croutons, NO sugar syrup in dressing. Substitute olive oil and steamed asparagus.",
          "allergensToAvoid": [
            "refined_sugars",
            "carbohydrates"
          ],
          "station": "Garde Manger & Grill"
        }
      ]
    },
    "dialogue": [
      {
        "speaker": "Darius",
        "role": "guest",
        "en": "I am in peak training for an Ironman triathlon. I need 65 grams of clean protein, healthy omega-3 fatty acids, and zero refined sugars or flour carbohydrates.",
        "es": "Estoy en la fase cumbre de entrenamiento para un triatlón Ironman. Necesito 65 gramos de proteína limpia, ácidos omega-3 y cero azúcares refinados o harinas."
      },
      {
        "speaker": "Sophie",
        "role": "server",
        "en": "We can prepare our center-cut Gravlax salmon alongside an 8-ounce Filet Mignon seared in grass-fed butter, subbing grilled asparagus for starches. Clean, macro-dense, and delicious.",
        "es": "Podemos servir nuestro salmón Gravlax junto a un filete solomillo de 220 g sellado en mantequilla de pastoreo, cambiando los carbohidratos por espárragos a la parrilla. Limpio y perfecto para sus macros."
      }
    ],
    "comprehensionQuiz": {
      "questionEn": "What nutritional advantages does Nordic cured salmon gravlax provide for an athletic diet?",
      "questionEs": "¿Qué ventajas nutricionales aporta el salmón curado gravlax a la dieta de un atleta?",
      "options": [
        "High saturated trans fats",
        "Rich in bioavailable lean protein, natural omega-3 EPA/DHA fatty acids, and zero refined carbohydrates",
        "High refined sugar content",
        "It replaces hydration water"
      ],
      "correctIndex": 1,
      "explanationEn": "Salmon provides anti-inflammatory omega-3 fatty acids and complete essential amino acids with no starchy carbs.",
      "explanationEs": "El salmón aporta ácidos grasos omega-3 antiinflamatorios y aminoácidos completos esenciales sin carbohidratos refinados."
    }
  },
  {
    "orderId": "ORD_VIP_08",
    "guestProfile": {
      "name": "Kenji & Sakura Takahashi",
      "persona": "The Indecisive Gastronomy Tourists",
      "tableNumber": 8,
      "dietaryRestrictions": [],
      "mood": "Curious, polite, overwhelmed by choices",
      "patienceSeconds": 1400
    },
    "ticket": {
      "tableNumber": 8,
      "serverName": "David",
      "timestamp": "19:00:00",
      "urgent": false,
      "items": [
        {
          "nameEn": "Seafood Paella Valenciana with Socarrat",
          "nameEs": "Paella Valenciana de Mariscos con Socarrat",
          "modification": "Table requested Chef's demonstration of authentic socarrat bottom crust.",
          "allergensToAvoid": [],
          "station": "Rôtisseur & Paella"
        }
      ]
    },
    "dialogue": [
      {
        "speaker": "Sakura",
        "role": "guest",
        "en": "We traveled from Tokyo to experience authentic Mediterranean culinary heritage, but the menu is so grand! What is the one dish that represents legendary mastery of fire and rice?",
        "es": "Viajamos desde Tokio para conocer el patrimonio gastronómico mediterráneo, ¡pero el menú es enorme! ¿Qué plato representa el dominio legendario del fuego y el arroz?"
      },
      {
        "speaker": "David",
        "role": "server",
        "en": "Without hesitation, our Seafood Paella Valenciana. Chef cooks it over open flame in a broad steel pan, capturing the natural shellfish fumet in Bomba rice, culminating in a crunchy, caramelized 'socarrat' crust at the bottom.",
        "es": "Sin dudarlo, nuestra Paella de Mariscos. El Chef la elabora a fuego vivo en paellera de acero, absorbiendo el caldo de mariscos en arroz Bomba y logrando la costra crujiente de socarrat en el fondo."
      }
    ],
    "comprehensionQuiz": {
      "questionEn": "Why is Spanish Bomba rice specifically selected for authentic paella?",
      "questionEs": "¿Por qué el arroz Bomba español se selecciona específicamente para la paella?",
      "options": [
        "It turns into liquid soup",
        "It absorbs three times its volume in flavorful broth while remaining plump, firm, and separate without turning mushy",
        "It is the cheapest grain",
        "It has no starch"
      ],
      "correctIndex": 1,
      "explanationEn": "Bomba rice expands accordion-style to absorb triple its weight in broth while retaining individual, toothsome grain structure.",
      "explanationEs": "El arroz Bomba absorbe hasta tres veces su volumen en caldo concentrado manteniendo el grano entero y firme sin romperse."
    }
  },
  {
    "orderId": "ORD_VIP_09",
    "guestProfile": {
      "name": "Camilla Espinoza",
      "persona": "The 30th Birthday Celebration Organizer",
      "tableNumber": 15,
      "dietaryRestrictions": [
        "No Raw Seafood for Guest 3"
      ],
      "mood": "Festive, loud, energetic",
      "patienceSeconds": 1200
    },
    "ticket": {
      "tableNumber": 15,
      "serverName": "Claire",
      "timestamp": "21:00:00",
      "urgent": false,
      "items": [
        {
          "nameEn": "Wild Mushroom Risotto alla Milanese (Party Platter x4)",
          "nameEs": "Risotto con Hongos Silvestres al Estilo Milanesa (Bandeja x4)",
          "modification": "Shareable presentation in copper pan. Extra aged Parmigiano-Reggiano on side.",
          "allergensToAvoid": [],
          "station": "Entremetier"
        },
        {
          "nameEn": "Tiramisù Classico Tradizionale (Birthday Tier)",
          "nameEs": "Tiramisú Clásico de Treviso",
          "modification": "Light birthday sparkler and dust with cocoa stencil 'Happy 30th Camilla'.",
          "allergensToAvoid": [],
          "station": "Pâtisserie"
        }
      ]
    },
    "dialogue": [
      {
        "speaker": "Camilla",
        "role": "guest",
        "en": "It's my 30th birthday! We have 6 friends who love sharing comfort food. Can we get a giant copper pan of the wild mushroom risotto and finish with a celebratory tiramisù?",
        "es": "¡Es mi cumpleaños número 30! Somos 6 amigos y nos encanta compartir. ¿Podemos ordenar una sartén de cobre gigante de risotto de hongos y terminar con tiramisú de fiesta?"
      },
      {
        "speaker": "Claire",
        "role": "server",
        "en": "Happy 30th, Camilla! Absolutely. Chef will prepare your Carnaroli risotto fresh with chanterelles and porcini, serving it 'all'onda' directly in our hand-hammered French copper pan with sparklers on your tiramisù!",
        "es": "¡Feliz 30 cumpleaños, Camilla! Por supuesto. El Chef preparará su risotto Carnaroli fresco con chantarelas y porcini, sirviéndolo 'all'onda' en sartén de cobre francés con velas chispeantes en el tiramisú."
      }
    ],
    "comprehensionQuiz": {
      "questionEn": "Why is heavy copper cookware prized for high-end tableside presentations of risotto?",
      "questionEs": "¿Por qué el menaje de cobre es valorado para presentaciones de risotto en mesa?",
      "options": [
        "It is lighter than plastic",
        "Copper offers unmatched rapid thermal conductivity, keeping the delicate emulsified risotto warm and creamy throughout dinner",
        "It colors the rice green",
        "It acts as a magnet"
      ],
      "correctIndex": 1,
      "explanationEn": "Copper conducts heat five times faster than cast iron, maintaining uniform radiant heat that preserves sauce emulsion at the table.",
      "explanationEs": "El cobre posee conductividad térmica superior manteniendo el risotto caliente y cremoso en mesa sin cortarse."
    }
  },
  {
    "orderId": "ORD_VIP_10",
    "guestProfile": {
      "name": "Arthur & Martha Sterling",
      "persona": "The Traditionalist Senior Diners",
      "tableNumber": 3,
      "dietaryRestrictions": [
        "Low Sodium",
        "Easy to Chew / Tender Meat"
      ],
      "mood": "Gentle, nostalgic, appreciative of classical heritage",
      "patienceSeconds": 1500
    },
    "ticket": {
      "tableNumber": 3,
      "serverName": "Sophie",
      "timestamp": "18:00:00",
      "urgent": false,
      "items": [
        {
          "nameEn": "Classic French Onion Soup Gratinée",
          "nameEs": "Sopa de Cebolla Francesa Gratinada",
          "modification": "Moderate salt seasoning, ensure crouton is thoroughly softened under cheese.",
          "allergensToAvoid": [
            "excess_salt"
          ],
          "station": "Potager"
        },
        {
          "nameEn": "Braised Veal Osso Buco with Gremolata",
          "nameEs": "Osso Buco de Ternera a la Milanesa",
          "modification": "Slow braised until spoon-tender; provide small marrow spoon.",
          "allergensToAvoid": [],
          "station": "Saucier"
        }
      ]
    },
    "dialogue": [
      {
        "speaker": "Arthur",
        "role": "guest",
        "en": "Good evening, my dear. We celebrated our first date 50 years ago with French onion soup and braised veal. We hope your kitchen respects classical slow-cooking traditions.",
        "es": "Buenas noches, querida. Celebramos nuestra primera cita hace 50 años con sopa de cebolla francesa y ternera estofada. Esperamos que su cocina respete las tradiciones clásicas de cocción lenta."
      },
      {
        "speaker": "Sophie",
        "role": "server",
        "en": "It is an absolute honor to host you both. Our onions are caramelized for 45 painstaking minutes, and our veal osso buco braises for over two hours until it melts like butter off the marrow bone. You will have a splendid evening.",
        "es": "Es un honor recibirles. Nuestras cebollas se caramelizan pacientemente durante 45 minutos y el osso buco se brasea más de dos horas hasta derretirse como mantequilla junto al tuétano. Disfrutarán de una velada espléndida."
      }
    ],
    "comprehensionQuiz": {
      "questionEn": "What specialized culinary utensil should be provided when serving traditional Osso Buco with the bone intact?",
      "questionEs": "¿Qué utensilio especializado de cubertería debe acompañar al Osso Buco servido con su hueso?",
      "options": [
        "Lobster cracker",
        "A long, slender bone marrow spoon (curette a moelle) to scoop the rich melted marrow",
        "Fish tweezers",
        "A mandoline"
      ],
      "correctIndex": 1,
      "explanationEn": "A slender marrow spoon allows diners to extract the prized, gelatinous marrow from the center of the shank bone elegantly.",
      "explanationEs": "La cucharilla de tuétano (curette à moelle) permite extraer con elegancia el tuétano fundido del interior del hueso."
    }
  }
];

  // Internal index maps for O(1) instantaneous lookup
  const toolMap = new Map();
  equipmentAndTools.forEach(t => toolMap.set(t.id, t));

  const ingredientMap = new Map();
  ingredients.forEach(i => ingredientMap.set(i.id, i));

  const slangMap = new Map();
  culinaryVerbsAndSlang.forEach(s => slangMap.set(s.id, s));

  const recipeMap = new Map();
  recipes.forEach(r => recipeMap.set(r.id, r));

  const orderMap = new Map();
  customerOrders.forEach(o => orderMap.set(o.orderId, o));

  const CulinaryDatabank = {
    version: "2.0.0",
    metadata: {
      author: "MasterENG Culinary Academy & Technical Arts Brigade",
      lastUpdated: "2026-10-31",
      toolsCount: equipmentAndTools.length,
      ingredientsCount: ingredients.length,
      slangCount: culinaryVerbsAndSlang.length,
      recipesCount: recipes.length,
      ordersCount: customerOrders.length
    },

    // Raw datasets
    equipmentAndTools: equipmentAndTools,
    ingredients: ingredients,
    culinaryVerbsAndSlang: culinaryVerbsAndSlang,
    recipes: recipes,
    customerOrders: customerOrders,

    // Core ID Lookups
    getTool(id) {
      if (!id) return null;
      return toolMap.get(id) || null;
    },

    getIngredient(id) {
      if (!id) return null;
      return ingredientMap.get(id) || null;
    },

    getSlang(id) {
      if (!id) return null;
      return slangMap.get(id) || null;
    },

    getRecipe(id) {
      if (!id) return null;
      return recipeMap.get(id) || null;
    },

    getOrder(id) {
      if (!id) return null;
      return orderMap.get(id) || null;
    },

    // Category / Zone Filter Helpers
    getToolsByCategory(category) {
      if (!category) return equipmentAndTools;
      const catLower = category.toLowerCase();
      return equipmentAndTools.filter(t => (t.category || '').toLowerCase().includes(catLower));
    },

    getIngredientsByZone(zone) {
      if (!zone) return ingredients;
      const zoneLower = zone.toLowerCase();
      return ingredients.filter(i => (i.storageZone || '').toLowerCase().includes(zoneLower) || (i.category || '').toLowerCase().includes(zoneLower));
    },

    getRecipesByDifficulty(difficulty) {
      if (!difficulty) return recipes;
      const diffLower = difficulty.toLowerCase();
      return recipes.filter(r => (r.difficulty || '').toLowerCase() === diffLower);
    },

    getRecipesByCategory(category) {
      if (!category) return recipes;
      const catLower = category.toLowerCase();
      return recipes.filter(r => (r.category || '').toLowerCase().includes(catLower));
    },

    getSlangByCategory(category) {
      if (!category) return culinaryVerbsAndSlang;
      const catLower = category.toLowerCase();
      return culinaryVerbsAndSlang.filter(s => (s.category || '').toLowerCase().includes(catLower));
    },

    // Unified Global Search across all datasets
    search(query) {
      if (!query || typeof query !== 'string' || !query.trim()) {
        return {
          tools: [],
          ingredients: [],
          slang: [],
          recipes: []
        };
      }

      const q = query.trim().toLowerCase();

      const matchText = (val) => {
        if (!val) return false;
        if (typeof val === 'string') return val.toLowerCase().includes(q);
        if (Array.isArray(val)) return val.some(v => typeof v === 'string' && v.toLowerCase().includes(q));
        return false;
      };

      const matchedTools = equipmentAndTools.filter(t => 
        matchText(t.id) || matchText(t.nameEn) || matchText(t.nameEs) || matchText(t.category) || matchText(t.usageEn) || matchText(t.usageEs)
      );

      const matchedIngredients = ingredients.filter(i => 
        matchText(i.id) || matchText(i.nameEn) || matchText(i.nameEs) || matchText(i.category) || matchText(i.culinaryNotesEn) || matchText(i.culinaryNotesEs)
      );

      const matchedSlang = culinaryVerbsAndSlang.filter(s => 
        matchText(s.id) || matchText(s.termEn) || matchText(s.termEs) || matchText(s.category) || matchText(s.definitionEn) || matchText(s.definitionEs) || matchText(s.contextSentenceEn)
      );

      const matchedRecipes = recipes.filter(r => 
        matchText(r.id) || matchText(r.nameEn) || matchText(r.nameEs) || matchText(r.category) || matchText(r.descriptionEn) || matchText(r.descriptionEs)
      );

      return {
        query: query,
        tools: matchedTools,
        ingredients: matchedIngredients,
        slang: matchedSlang,
        recipes: matchedRecipes,
        totalMatches: matchedTools.length + matchedIngredients.length + matchedSlang.length + matchedRecipes.length
      };
    },

    // Web Speech API Bilingual TTS Audio Synthesis
    playAudio(text, lang = 'en-US') {
      if (!text || typeof window === 'undefined') return false;
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          utterance.rate = 0.92;
          utterance.pitch = 1.0;

          // Attempt to choose high quality native voice if available
          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            const preferredVoice = voices.find(v => v.lang && v.lang.startsWith(lang.slice(0, 2)) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium')));
            if (preferredVoice) utterance.voice = preferredVoice;
          }

          window.speechSynthesis.speak(utterance);
          return true;
        }
      } catch (err) {
        console.warn('[CulinaryDatabank] TTS playback warning:', err);
      }
      return false;
    },

    // Random Ticket Generator for Line Cooking Minigames
    generateKitchenTicket() {
      const randomOrder = customerOrders[Math.floor(Math.random() * customerOrders.length)];
      const ticketId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
      const randomTable = randomOrder.guestProfile.tableNumber || Math.floor(1 + Math.random() * 20);

      return {
        ticketId: ticketId,
        tableNumber: randomTable,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        guestPersona: randomOrder.guestProfile.persona,
        guestName: randomOrder.guestProfile.name,
        dietaryAlerts: randomOrder.guestProfile.dietaryRestrictions,
        items: randomOrder.ticket.items.map(it => ({
          nameEn: it.nameEn,
          nameEs: it.nameEs,
          modification: it.modification,
          station: it.station,
          allergensToAvoid: it.allergensToAvoid
        })),
        patienceSeconds: randomOrder.guestProfile.patienceSeconds || 900
      };
    }
  };

  // Expose on global window object and CommonJS for Node testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CulinaryDatabank;
  }
  if (typeof window !== 'undefined') {
    window.CulinaryDatabank = CulinaryDatabank;
    console.log('[CulinaryDatabank] Loaded successfully: ' + 
      equipmentAndTools.length + ' tools, ' + 
      ingredients.length + ' ingredients, ' + 
      culinaryVerbsAndSlang.length + ' slang terms, ' + 
      recipes.length + ' recipes, ' + 
      customerOrders.length + ' orders.'
    );
  }
})(typeof window !== 'undefined' ? window : global);

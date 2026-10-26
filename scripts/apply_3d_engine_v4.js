const fs = require('fs');

console.log('=== PREPARING WORLD_TOUR_SCENARIOS & THREE.JS ENGINE V4 ===');

let html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

// ========================================================
// 1. DATASET COMPLETO DE LOS DOS ESCENARIOS 3D
// ========================================================
const newScenariosDataset = `    const WORLD_TOUR_SCENARIOS = {
      house: {
        id: "house",
        title: "House & Rooms",
        badge: "15 Objetos Interactivos",
        roomLimits: { minX: -7.5, maxX: 7.5, minZ: -7.5, maxZ: 7.5, eyeHeight: 1.7 },
        spawnPos: { x: -2.5, y: 1.7, z: 2.5 },
        objects: [
          { id: "hammock", en: "Hammock", ipa: "/ˈhæm.ək/", es: "Hamaca tradicional tejida", category: "Mobiliario & Descanso", pos: { x: 3.2, y: 1.25, z: -3.5 }, example: "He relaxed peacefully in the woven hammock on warm afternoons." },
          { id: "sofa", en: "Sofa", ipa: "/ˈsoʊ.fə/", es: "Sofá contemporáneo de 3 plazas", category: "Sala de Estar", pos: { x: -3.6, y: 0.1, z: -1.8 }, example: "The three-seater sofa has soft fabric cushions and tapered wooden legs." },
          { id: "cushion", en: "Cushion", ipa: "/ˈkʊʃ.ən/", es: "Cojines decorativos de acento", category: "Decoración", pos: { x: -4.5, y: 0.82, z: -1.75 }, example: "Colorful throw cushions provide cozy ergonomic support on the couch." },
          { id: "bookshelf", en: "Bookshelf", ipa: "/ˈbʊk.ʃelf/", es: "Estantería alta con libros", category: "Almacenamiento", pos: { x: -7.6, y: 1.3, z: -2.0 }, example: "More than twenty-five books with colorful spines rest on the bookshelf." },
          { id: "coffee_table", en: "Coffee Table", ipa: "/ˈkɑː.fi ˌteɪ.bəl/", es: "Mesa de centro biselada con libros", category: "Mobiliario", pos: { x: -3.6, y: 0.05, z: -3.6 }, example: "He placed the English dictionary gently on the beveled coffee table." },
          { id: "coffee_mug", en: "Coffee Mug", ipa: "/ˈkɑː.fi mʌɡ/", es: "Taza de café con asa y plato", category: "Vajilla", pos: { x: -3.3, y: 0.53, z: -3.5 }, example: "Steam rises gently from the ceramic coffee mug on its matching saucer." },
          { id: "television", en: "Television", ipa: "/ˈtel.ə.vɪʒ.ən/", es: "Televisión OLED de borde fino", category: "Electrónica", pos: { x: -3.6, y: 1.85, z: -8.18 }, example: "They enjoy watching English documentaries on the wall-mounted OLED television." },
          { id: "soundbar", en: "Soundbar", ipa: "/ˈsaʊnd.bɑːr/", es: "Barra de sonido frontal", category: "Audio", pos: { x: -3.6, y: 1.05, z: -8.15 }, example: "The sleek soundbar provides crisp stereo dialogue and immersive acoustics." },
          { id: "ceiling_fan", en: "Ceiling Fan", ipa: "/ˈsiː.lɪŋ fæn/", es: "Ventilador de techo rotatorio", category: "Electrodomésticos", pos: { x: 0, y: 4.0, z: 0 }, example: "Four wooden blades rotate smoothly to keep the room cool." },
          { id: "rug", en: "Rug", ipa: "/rʌɡ/", es: "Alfombra tejida de lana", category: "Textil & Piso", pos: { x: -3.6, y: 0.02, z: -2.8 }, example: "The soft wool rug defines the seating area and warms the hardwood floor." },
          { id: "floor_lamp", en: "Floor Lamp", ipa: "/ˈflɔːr ˌlæmp/", es: "Lámpara de pie de lectura", category: "Iluminación", pos: { x: -6.4, y: 0.1, z: -5.8 }, example: "He turned on the warm floor lamp to read late into the evening." },
          { id: "curtain", en: "Curtains", ipa: "/ˈkɝː.tənz/", es: "Cortinas drapeadas con pliegues", category: "Cortinaje", pos: { x: -6.5, y: 2.3, z: -8.1 }, example: "Soft linen curtains frame the large window and diffuse bright daylight." },
          { id: "window", en: "Window", ipa: "/ˈwɪn.doʊ/", es: "Ventana panorámica con luz natural", category: "Arquitectura", pos: { x: -6.5, y: 2.4, z: -8.25 }, example: "Sunlight streams across the room through the double-pane window." },
          { id: "potted_plant", en: "Potted Plant", ipa: "/ˌɪn.dɔːr ˈplænt/", es: "Planta de interior en maceta", category: "Decoración & Naturaleza", pos: { x: 6.8, y: 0.45, z: -6.8 }, example: "A lush green potted plant brings fresh vibrant energy into the corner." },
          { id: "door_lock", en: "Door Lock", ipa: "/ˈdɔːr ˌlɑːk/", es: "Cerradura metálica de puerta", category: "Ferretería", pos: { x: 8.2, y: 1.25, z: -2.0 }, example: "Turn the brass door lock clockwise to secure the front entrance." }
        ]
      },
      garden: {
        id: "garden",
        title: "Backyard & Garden",
        badge: "12 Objetos Interactivos",
        roomLimits: { minX: -11.0, maxX: 11.0, minZ: -11.0, maxZ: 11.0, eyeHeight: 1.7 },
        spawnPos: { x: 0, y: 1.7, z: 6.5 },
        objects: [
          { id: "bbq_grill", en: "Barbecue Grill", ipa: "/ˈbɑːr.bə.kjuː ɡrɪl/", es: "Asador metálico esférico con tapa", category: "Cocina Exterior", pos: { x: -4.5, y: 0.9, z: -2.0 }, example: "We gathered around the spherical charcoal barbecue grill to cook dinner." },
          { id: "patio_table", en: "Patio Table with Umbrella", ipa: "/ˈpæt.i.oʊ ˌteɪ.bəl/", es: "Mesa de terraza con sombrilla roja", category: "Mobiliario Exterior", pos: { x: 2.5, y: 0.8, z: -1.0 }, example: "The eight-sided red umbrella shades the round patio dining table." },
          { id: "lawn_mower", en: "Lawn Mower", ipa: "/ˈlɑːn ˌmoʊ.ɚ/", es: "Cortacésped ergonómico con motor", category: "Herramientas de Jardín", pos: { x: -6.2, y: 0.45, z: 3.5 }, example: "He pushed the red lawn mower across the yard to trim the tall grass." },
          { id: "wheelbarrow", en: "Wheelbarrow", ipa: "/ˈwiːlˌber.oʊ/", es: "Carretilla de carga metálica", category: "Equipamiento", pos: { x: 5.5, y: 0.5, z: 3.2 }, example: "The sturdy wheelbarrow transported rich soil and fertilizer to the garden beds." },
          { id: "watering_can", en: "Watering Can", ipa: "/ˈwɑː.t̬ɚ.ɪŋ kæn/", es: "Regadera metálica con roseta", category: "Jardinería", pos: { x: 4.2, y: 0.35, z: -4.2 }, example: "She poured water gently over the seedlings using the metal watering can." },
          { id: "flower_pot", en: "Terracotta Flower Pot", ipa: "/ˈflaʊ.ɚ pɑːt/", es: "Maceta de barro con follaje floral", category: "Plantas & Flores", pos: { x: 3.2, y: 0.42, z: -4.5 }, example: "Bright blooming flowers thrive inside the authentic terracotta pot." },
          { id: "sprinkler", en: "Lawn Sprinkler", ipa: "/ˈlɑːn ˌsprɪŋ.klɚ/", es: "Aspersor de riego rotatorio", category: "Irrigación", pos: { x: -1.5, y: 0.2, z: 1.5 }, example: "The rotating lawn sprinkler shoots cool water droplets over the emerald lawn." },
          { id: "wooden_fence", en: "Wooden Fence", ipa: "/ˈwʊd.ən fens/", es: "Cerca perimetral de estacas", category: "Límites & Seguridad", pos: { x: 0, y: 1.0, z: -11.5 }, example: "The white wooden picket fence encloses the peaceful backyard." },
          { id: "garden_bench", en: "Garden Bench", ipa: "/ˈɡɑːr.dən bentʃ/", es: "Banco de jardín con listones de madera", category: "Asientos", pos: { x: -5.5, y: 0.55, z: -7.5 }, example: "Take a seat on the comfortable wooden bench to admire the flowers." },
          { id: "garden_hose", en: "Garden Hose", ipa: "/ˈɡɑːr.dən hoʊz/", es: "Manguera de jardín enrollada", category: "Riego", pos: { x: -7.5, y: 0.25, z: -1.0 }, example: "He coiled the green garden hose neatly after watering the vegetable patch." },
          { id: "shovel", en: "Garden Shovel", ipa: "/ˈʃʌv.əl/", es: "Pala de jardinería", category: "Herramientas Manuales", pos: { x: 6.8, y: 0.7, z: 2.2 }, example: "The steel garden shovel stood upright in the soft garden bed." },
          { id: "sun", en: "Sun & Sunlight", ipa: "/sʌn/", es: "Sol diurno y luz natural", category: "Naturaleza & Clima", pos: { x: 8.0, y: 12.0, z: -18.0 }, example: "Warm golden sunlight illuminates the entire garden on a clear summer day." }
        ]
      }
    };`;

// Reemplazar WORLD_TOUR_SCENARIOS
const rxOldScenarios = /const WORLD_TOUR_SCENARIOS = \{[\s\S]*?\r?\n    \};/;
if (rxOldScenarios.test(html)) {
  html = html.replace(rxOldScenarios, newScenariosDataset);
  console.log('✅ WORLD_TOUR_SCENARIOS actualizado con los 2 escenarios completos (House: 15, Garden: 12)');
} else {
  console.error('❌ No se encontró WORLD_TOUR_SCENARIOS para reemplazar');
}

fs.writeFileSync('app/src/main/assets/index.html', html, 'utf8');
console.log('✅ Archivo index.html actualizado con nuevos datasets.');

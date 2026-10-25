/**
 * ============================================================================
 * MasterENG - JEST / JARZ 3D (1vs1 Headbanz Table Duel & Impartial AI Referee)
 * ============================================================================
 * Archivo: js/jest_game.js
 * Descripción: Juego multijugador 1vs1 e IA en mesa 3D (Three.js) donde cada
 * jugador tiene una carta secreta en la frente visible solo para el rival,
 * realiza preguntas de Sí/No por voz (con transcripción editable y chips
 * interactivos) o texto, y un Juez IA imparcial responde a ambos.
 */

(function (global) {
  'use strict';

  // ==========================================================================
  // 1. BASE DE DATOS DE 60 CARTAS CON PROPIEDADES SEMÁNTICAS COMPLETAS
  //    (6 Tópicos x 10 Cartas = 60 Cartas)
  // ==========================================================================
  const JEST_TOPICS = [
    'Animals & Creatures',
    'Food & Kitchen',
    'Outer Space',
    'Jobs & Roles',
    'Household Objects',
    'Romantic & Couple Items'
  ];

  const JEST_CARDS_DB = [
    // --- 1. Animals & Creatures (10) ---
    {
      id: 'fox', word: 'FOX', icon: '🦊', topic: 'Animals & Creatures', es: 'Zorro',
      isAnimal: true, isAlive: true, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false, hasFur: true, isDomestic: false, isDangerous: true,
      color: ['orange', 'red', 'white'], habitat: ['forest', 'woods', 'land'],
      hints: ['clever', 'orange fur', 'bushy tail', 'wild mammal', 'forest hunter']
    },
    {
      id: 'eagle', word: 'EAGLE', icon: '🦅', topic: 'Animals & Creatures', es: 'Águila',
      isAnimal: true, isAlive: true, isTiny: false, isBig: false, canFly: true, livesInWater: false,
      isFood: false, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: true, hasFur: false, isDomestic: false, isDangerous: true,
      color: ['brown', 'white', 'gold'], habitat: ['mountains', 'sky', 'air', 'trees'],
      hints: ['bird', 'feathers', 'beak', 'sharp claws', 'flies high']
    },
    {
      id: 'shark', word: 'SHARK', icon: '🦈', topic: 'Animals & Creatures', es: 'Tiburón',
      isAnimal: true, isAlive: true, isTiny: false, isBig: true, canFly: false, livesInWater: true,
      isFood: false, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, hasFur: false, isDomestic: false, isDangerous: true,
      color: ['grey', 'gray', 'blue', 'white'], habitat: ['ocean', 'sea', 'water'],
      hints: ['fins', 'sharp teeth', 'ocean predator', 'swims', 'gills']
    },
    {
      id: 'bee', word: 'BEE', icon: '🐝', topic: 'Animals & Creatures', es: 'Abeja',
      isAnimal: true, isAlive: true, isTiny: true, isBig: false, canFly: true, livesInWater: false,
      isFood: false, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: true, hasFur: false, isDomestic: false, isDangerous: true,
      color: ['yellow', 'black'], habitat: ['garden', 'hive', 'flowers', 'air'],
      hints: ['insect', 'makes honey', 'stings', 'buzzes', 'six legs']
    },
    {
      id: 'elephant', word: 'ELEPHANT', icon: '🐘', topic: 'Animals & Creatures', es: 'Elefante',
      isAnimal: true, isAlive: true, isTiny: false, isBig: true, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false, hasFur: false, isDomestic: false, isDangerous: false,
      color: ['grey', 'gray'], habitat: ['savanna', 'jungle', 'africa', 'asia', 'land'],
      hints: ['trunk', 'big ears', 'tusks', 'heavy', 'herbivore']
    },
    {
      id: 'penguin', word: 'PENGUIN', icon: '🐧', topic: 'Animals & Creatures', es: 'Pingüino',
      isAnimal: true, isAlive: true, isTiny: false, isBig: false, canFly: false, livesInWater: true,
      isFood: false, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: true, hasFur: false, isDomestic: false, isDangerous: false,
      color: ['black', 'white'], habitat: ['antarctica', 'ice', 'snow', 'ocean', 'cold'],
      hints: ['bird that cannot fly', 'swims', 'waddles', 'eats fish', 'cold weather']
    },
    {
      id: 'frog', word: 'FROG', icon: '🐸', topic: 'Animals & Creatures', es: 'Rana',
      isAnimal: true, isAlive: true, isTiny: true, isBig: false, canFly: false, livesInWater: true,
      isFood: false, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false, hasFur: false, isDomestic: false, isDangerous: false,
      color: ['green'], habitat: ['pond', 'water', 'swamp', 'rainforest'],
      hints: ['amphibian', 'jumps', 'croaks', 'long tongue', 'eats insects']
    },
    {
      id: 'lion', word: 'LION', icon: '🦁', topic: 'Animals & Creatures', es: 'León',
      isAnimal: true, isAlive: true, isTiny: false, isBig: true, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false, hasFur: true, isDomestic: false, isDangerous: true,
      color: ['gold', 'yellow', 'brown'], habitat: ['savanna', 'africa', 'land'],
      hints: ['king of the jungle', 'mane', 'roars', 'big cat', 'carnivore']
    },
    {
      id: 'butterfly', word: 'BUTTERFLY', icon: '🦋', topic: 'Animals & Creatures', es: 'Mariposa',
      isAnimal: true, isAlive: true, isTiny: true, isBig: false, canFly: true, livesInWater: false,
      isFood: false, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: true, hasFur: false, isDomestic: false, isDangerous: false,
      color: ['colorful', 'blue', 'orange', 'yellow'], habitat: ['garden', 'flowers', 'air'],
      hints: ['insect', 'colorful wings', 'caterpillar', 'metamorphosis', 'nectar']
    },
    {
      id: 'octopus', word: 'OCTOPUS', icon: '🐙', topic: 'Animals & Creatures', es: 'Pulpo',
      isAnimal: true, isAlive: true, isTiny: false, isBig: false, canFly: false, livesInWater: true,
      isFood: true, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false, hasFur: false, isDomestic: false, isDangerous: false,
      color: ['red', 'purple', 'pink'], habitat: ['ocean', 'sea', 'water'],
      hints: ['eight tentacles', 'ink', 'sea creature', 'smart', 'no bones']
    },

    // --- 2. Food & Kitchen (10) ---
    {
      id: 'pizza', word: 'PIZZA', icon: '🍕', topic: 'Food & Kitchen', es: 'Pizza',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: true, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isSweet: false, isHot: true,
      color: ['red', 'yellow', 'brown'], habitat: ['kitchen', 'restaurant', 'oven', 'italy'],
      hints: ['cheese', 'tomato sauce', 'slices', 'italian food', 'baked in oven']
    },
    {
      id: 'strawberry', word: 'STRAWBERRY', icon: '🍓', topic: 'Food & Kitchen', es: 'Fresa',
      isAnimal: false, isAlive: false, isTiny: true, isBig: false, canFly: false, livesInWater: false,
      isFood: true, isObject: false, isPerson: false, isSpace: false, isRomantic: true,
      hasLegs: false, hasWings: false, isSweet: true, isHot: false,
      color: ['red', 'green'], habitat: ['garden', 'kitchen', 'plant'],
      hints: ['red fruit', 'sweet', 'tiny seeds outside', 'jam', 'dessert']
    },
    {
      id: 'coffee', word: 'COFFEE', icon: '☕', topic: 'Food & Kitchen', es: 'Café',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: true, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isSweet: false, isHot: true,
      color: ['brown', 'black'], habitat: ['kitchen', 'cafe', 'cup', 'mug'],
      hints: ['hot drink', 'caffeine', 'morning beverage', 'roasted beans', 'mug']
    },
    {
      id: 'ice_cream', word: 'ICE CREAM', icon: '🍦', topic: 'Food & Kitchen', es: 'Helado',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: true, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isSweet: true, isHot: false, isCold: true,
      color: ['white', 'pink', 'brown'], habitat: ['freezer', 'kitchen', 'shop'],
      hints: ['frozen dessert', 'cold', 'sweet', 'cone', 'melts in sun']
    },
    {
      id: 'frying_pan', word: 'FRYING PAN', icon: '🍳', topic: 'Food & Kitchen', es: 'Sartén',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isMetal: true, isHot: true,
      color: ['black', 'silver'], habitat: ['kitchen', 'stove'],
      hints: ['kitchen tool', 'metal', 'used to cook eggs', 'stove', 'handle']
    },
    {
      id: 'sushi', word: 'SUSHI', icon: '🍣', topic: 'Food & Kitchen', es: 'Sushi',
      isAnimal: false, isAlive: false, isTiny: true, isBig: false, canFly: false, livesInWater: false,
      isFood: true, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isSweet: false, isHot: false,
      color: ['white', 'orange', 'black'], habitat: ['kitchen', 'restaurant', 'japan'],
      hints: ['japanese food', 'rice', 'raw fish', 'seaweed', 'chopsticks']
    },
    {
      id: 'banana', word: 'BANANA', icon: '🍌', topic: 'Food & Kitchen', es: 'Plátano / Banana',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: true, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isSweet: true, isHot: false,
      color: ['yellow'], habitat: ['tree', 'jungle', 'kitchen'],
      hints: ['yellow fruit', 'peel', 'monkeys love it', 'curved', 'potassium']
    },
    {
      id: 'blender', word: 'BLENDER', icon: '🧃', topic: 'Food & Kitchen', es: 'Licuadora',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isElectronic: true, isMetal: true,
      color: ['silver', 'white', 'black'], habitat: ['kitchen', 'counter'],
      hints: ['kitchen appliance', 'blades', 'makes smoothies', 'electric', 'noisy']
    },
    {
      id: 'burger', word: 'HAMBURGER', icon: '🍔', topic: 'Food & Kitchen', es: 'Hamburguesa',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: true, isObject: false, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isSweet: false, isHot: true,
      color: ['brown', 'green', 'red', 'yellow'], habitat: ['kitchen', 'restaurant', 'grill'],
      hints: ['fast food', 'bun', 'meat patty', 'lettuce and cheese', 'grill']
    },
    {
      id: 'fork', word: 'FORK', icon: '🍴', topic: 'Food & Kitchen', es: 'Tenedor',
      isAnimal: false, isAlive: false, isTiny: true, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isMetal: true,
      color: ['silver'], habitat: ['kitchen', 'table', 'drawer'],
      hints: ['cutlery', 'silverware', 'points', 'used to eat pasta', 'next to knife']
    },

    // --- 3. Outer Space (10) ---
    {
      id: 'astronaut', word: 'ASTRONAUT', icon: '👨‍🚀', topic: 'Outer Space', es: 'Astronauta',
      isAnimal: false, isAlive: true, isTiny: false, isBig: false, canFly: true, livesInWater: false,
      isFood: false, isObject: false, isPerson: true, isSpace: true, isRomantic: false,
      hasLegs: true, hasWings: false,
      color: ['white'], habitat: ['space', 'rocket', 'moon', 'station'],
      hints: ['human', 'wears spacesuit', 'helmet', 'zero gravity', 'travels in rocket']
    },
    {
      id: 'rocket', word: 'ROCKET', icon: '🚀', topic: 'Outer Space', es: 'Cohete Espacial',
      isAnimal: false, isAlive: false, isTiny: false, isBig: true, canFly: true, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: true, isRomantic: false,
      hasLegs: false, hasWings: true, isMetal: true, isHot: true,
      color: ['white', 'red', 'silver'], habitat: ['space', 'sky', 'launchpad'],
      hints: ['spacecraft', 'launches into space', 'fire engine', 'countdown', 'fast']
    },
    {
      id: 'moon', word: 'THE MOON', icon: '🌕', topic: 'Outer Space', es: 'La Luna',
      isAnimal: false, isAlive: false, isTiny: false, isBig: true, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: true, isRomantic: true,
      hasLegs: false, hasWings: false,
      color: ['white', 'grey', 'silver', 'yellow'], habitat: ['space', 'night sky', 'orbit'],
      hints: ['orbits Earth', 'craters', 'shines at night', 'tides', 'Apollo 11']
    },
    {
      id: 'saturn', word: 'SATURN', icon: '🪐', topic: 'Outer Space', es: 'Saturno',
      isAnimal: false, isAlive: false, isTiny: false, isBig: true, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: true, isRomantic: false,
      hasLegs: false, hasWings: false,
      color: ['gold', 'yellow', 'brown'], habitat: ['space', 'solar system'],
      hints: ['giant planet', 'famous rings', 'gas giant', 'solar system', 'orbits sun']
    },
    {
      id: 'alien', word: 'ALIEN', icon: '👽', topic: 'Outer Space', es: 'Extraterrestre',
      isAnimal: false, isAlive: true, isTiny: false, isBig: false, canFly: true, livesInWater: false,
      isFood: false, isObject: false, isPerson: false, isSpace: true, isRomantic: false,
      hasLegs: true, hasWings: false,
      color: ['green', 'grey'], habitat: ['space', 'ufo', 'mars', 'another planet'],
      hints: ['extraterrestrial', 'big eyes', 'flies a UFO', 'from another planet', 'sci-fi']
    },
    {
      id: 'sun', word: 'THE SUN', icon: '☀️', topic: 'Outer Space', es: 'El Sol',
      isAnimal: false, isAlive: false, isTiny: false, isBig: true, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: true, isRomantic: false,
      hasLegs: false, hasWings: false, isHot: true,
      color: ['yellow', 'orange', 'red'], habitat: ['space', 'sky', 'solar system'],
      hints: ['giant star', 'extremely hot', 'center of solar system', 'daylight', 'fire']
    },
    {
      id: 'telescope', word: 'TELESCOPE', icon: '🔭', topic: 'Outer Space', es: 'Telescopio',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: true, isRomantic: false,
      hasLegs: true, hasWings: false, isMetal: true,
      color: ['black', 'silver', 'white'], habitat: ['observatory', 'house', 'space'],
      hints: ['lenses', 'used to see stars', 'astronomy tool', 'tripod', 'magnifying']
    },
    {
      id: 'satellite', word: 'SATELLITE', icon: '🛰️', topic: 'Outer Space', es: 'Satélite',
      isAnimal: false, isAlive: false, isTiny: false, isBig: true, canFly: true, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: true, isRomantic: false,
      hasLegs: false, hasWings: true, isMetal: true, isElectronic: true,
      color: ['silver', 'gold', 'blue'], habitat: ['space', 'orbit'],
      hints: ['orbits Earth', 'solar panels', 'GPS and TV signals', 'technology in space']
    },
    {
      id: 'comet', word: 'COMET', icon: '☄️', topic: 'Outer Space', es: 'Cometa Espacial',
      isAnimal: false, isAlive: false, isTiny: false, isBig: true, canFly: true, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: true, isRomantic: false,
      hasLegs: false, hasWings: false, isCold: true,
      color: ['blue', 'white'], habitat: ['space', 'cosmos'],
      hints: ['ice and dust', 'bright tail', 'travels through space', 'Halley']
    },
    {
      id: 'black_hole', word: 'BLACK HOLE', icon: '🕳️', topic: 'Outer Space', es: 'Agujero Negro',
      isAnimal: false, isAlive: false, isTiny: false, isBig: true, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: true, isRomantic: false,
      hasLegs: false, hasWings: false, isDangerous: true,
      color: ['black', 'orange'], habitat: ['space', 'galaxy'],
      hints: ['extreme gravity', 'light cannot escape', 'deep space', 'collapsed star']
    },

    // --- 4. Jobs & Roles (10) ---
    {
      id: 'doctor', word: 'DOCTOR', icon: '🩺', topic: 'Jobs & Roles', es: 'Médico / Doctor',
      isAnimal: false, isAlive: true, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: true, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false,
      color: ['white', 'blue'], habitat: ['hospital', 'clinic'],
      hints: ['heals sick people', 'hospital', 'stethoscope', 'white coat', 'medicine']
    },
    {
      id: 'firefighter', word: 'FIREFIGHTER', icon: '🚒', topic: 'Jobs & Roles', es: 'Bombero',
      isAnimal: false, isAlive: true, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: true, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false,
      color: ['red', 'yellow'], habitat: ['fire station', 'city'],
      hints: ['puts out fires', 'red truck', 'water hose', 'helmet', 'brave hero']
    },
    {
      id: 'chef', word: 'CHEF', icon: '👨‍🍳', topic: 'Jobs & Roles', es: 'Chef / Cocinero',
      isAnimal: false, isAlive: true, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: true, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false,
      color: ['white'], habitat: ['kitchen', 'restaurant'],
      hints: ['cooks delicious food', 'tall white hat', 'restaurant kitchen', 'recipes']
    },
    {
      id: 'pilot', word: 'PILOT', icon: '✈️', topic: 'Jobs & Roles', es: 'Piloto de Avión',
      isAnimal: false, isAlive: true, isTiny: false, isBig: false, canFly: true, livesInWater: false,
      isFood: false, isObject: false, isPerson: true, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false,
      color: ['blue', 'white', 'gold'], habitat: ['airplane', 'airport', 'sky', 'cockpit'],
      hints: ['flies airplanes', 'cockpit', 'airport', 'uniform', 'travels the world']
    },
    {
      id: 'teacher', word: 'TEACHER', icon: '👩‍🏫', topic: 'Jobs & Roles', es: 'Profesor / Maestro',
      isAnimal: false, isAlive: true, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: true, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false,
      color: ['any'], habitat: ['school', 'classroom', 'university'],
      hints: ['classroom', 'students', 'whiteboard', 'homework', 'school']
    },
    {
      id: 'detective', word: 'DETECTIVE', icon: '🕵️', topic: 'Jobs & Roles', es: 'Detective',
      isAnimal: false, isAlive: true, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: true, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false,
      color: ['brown', 'black'], habitat: ['city', 'office', 'crime scene'],
      hints: ['solves mysteries', 'magnifying glass', 'clues', 'trench coat', 'Sherlock']
    },
    {
      id: 'programmer', word: 'PROGRAMMER', icon: '💻', topic: 'Jobs & Roles', es: 'Programador',
      isAnimal: false, isAlive: true, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: true, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false,
      color: ['any'], habitat: ['office', 'home', 'computer'],
      hints: ['writes code', 'computer', 'software', 'keyboard', 'apps and websites']
    },
    {
      id: 'musician', word: 'MUSICIAN', icon: '🎸', topic: 'Jobs & Roles', es: 'Músico',
      isAnimal: false, isAlive: true, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: true, isSpace: false, isRomantic: true,
      hasLegs: true, hasWings: false,
      color: ['any'], habitat: ['stage', 'concert', 'studio'],
      hints: ['plays instruments', 'concerts', 'songs', 'guitar or piano', 'stage']
    },
    {
      id: 'dentist', word: 'DENTIST', icon: '🦷', topic: 'Jobs & Roles', es: 'Dentista',
      isAnimal: false, isAlive: true, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: true, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false,
      color: ['white', 'blue'], habitat: ['clinic', 'office'],
      hints: ['fixes teeth', 'toothbrush', 'smile', 'dental chair', 'cavities']
    },
    {
      id: 'photographer', word: 'PHOTOGRAPHER', icon: '📷', topic: 'Jobs & Roles', es: 'Fotógrafo',
      isAnimal: false, isAlive: true, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: true, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false,
      color: ['black'], habitat: ['studio', 'outdoors', 'events'],
      hints: ['takes pictures', 'camera', 'lens', 'flash', 'portraits']
    },

    // --- 5. Household Objects (10) ---
    {
      id: 'mirror', word: 'MIRROR', icon: '🪞', topic: 'Household Objects', es: 'Espejo',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false,
      color: ['silver', 'clear'], habitat: ['bathroom', 'bedroom', 'wall'],
      hints: ['glass', 'shows reflection', 'bathroom wall', 'look at yourself']
    },
    {
      id: 'pillow', word: 'PILLOW', icon: '🛌', topic: 'Household Objects', es: 'Almohada',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isSoft: true,
      color: ['white'], habitat: ['bedroom', 'bed', 'sofa'],
      hints: ['soft', 'on the bed', 'rest your head', 'sleep', 'feathers or foam']
    },
    {
      id: 'umbrella', word: 'UMBRELLA', icon: '☂️', topic: 'Household Objects', es: 'Paraguas',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false,
      color: ['black', 'blue', 'red'], habitat: ['house', 'street', 'rain'],
      hints: ['rain protection', 'opens and closes', 'handle', 'keeps you dry']
    },
    {
      id: 'clock', word: 'WALL CLOCK', icon: '🕰️', topic: 'Household Objects', es: 'Reloj de Pared',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isElectronic: true,
      color: ['white', 'black', 'gold'], habitat: ['wall', 'living room', 'house'],
      hints: ['tells the time', 'hours and minutes', 'tick tock', 'numbers 1 to 12']
    },
    {
      id: 'key', word: 'HOUSE KEY', icon: '🔑', topic: 'Household Objects', es: 'Llave',
      isAnimal: false, isAlive: false, isTiny: true, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isMetal: true,
      color: ['silver', 'gold'], habitat: ['pocket', 'door', 'keychain'],
      hints: ['tiny metal object', 'opens locked doors', 'pocket', 'lock']
    },
    {
      id: 'television', word: 'TELEVISION', icon: '📺', topic: 'Household Objects', es: 'Televisor',
      isAnimal: false, isAlive: false, isTiny: false, isBig: true, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isElectronic: true,
      color: ['black'], habitat: ['living room', 'bedroom', 'house'],
      hints: ['screen', 'remote control', 'watch movies and news', 'living room']
    },
    {
      id: 'toothbrush', word: 'TOOTHBRUSH', icon: '🪥', topic: 'Household Objects', es: 'Cepillo de Dientes',
      isAnimal: false, isAlive: false, isTiny: true, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false,
      color: ['blue', 'white', 'green'], habitat: ['bathroom', 'sink'],
      hints: ['bathroom', 'toothpaste', 'cleans teeth', 'bristles', 'morning routine']
    },
    {
      id: 'lamp', word: 'DESK LAMP', icon: '💡', topic: 'Household Objects', es: 'Lámpara',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isElectronic: true, isHot: true,
      color: ['yellow', 'white', 'silver'], habitat: ['desk', 'bedroom', 'living room'],
      hints: ['light bulb', 'gives light in the dark', 'switch', 'nightstand']
    },
    {
      id: 'chair', word: 'CHAIR', icon: '🪑', topic: 'Household Objects', es: 'Silla',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: true, hasWings: false,
      color: ['brown', 'black'], habitat: ['dining room', 'office', 'table'],
      hints: ['four legs', 'furniture', 'you sit on it', 'backrest', 'around a table']
    },
    {
      id: 'scissors', word: 'SCISSORS', icon: '✂️', topic: 'Household Objects', es: 'Tijeras',
      isAnimal: false, isAlive: false, isTiny: true, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: false,
      hasLegs: false, hasWings: false, isMetal: true, isDangerous: true,
      color: ['silver', 'red', 'black'], habitat: ['desk', 'drawer', 'school'],
      hints: ['two sharp blades', 'cuts paper', 'finger holes', 'metal']
    },

    // --- 6. Romantic & Couple Items (10) ---
    {
      id: 'red_rose', word: 'RED ROSE', icon: '🌹', topic: 'Romantic & Couple Items', es: 'Rosa Roja',
      isAnimal: false, isAlive: true, isTiny: true, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: true,
      hasLegs: false, hasWings: false,
      color: ['red', 'green'], habitat: ['garden', 'bouquet', 'vase'],
      hints: ['romantic flower', 'petals', 'thorns', 'smells nice', 'Valentine gift']
    },
    {
      id: 'diamond_ring', word: 'DIAMOND RING', icon: '💍', topic: 'Romantic & Couple Items', es: 'Anillo de Diamante',
      isAnimal: false, isAlive: false, isTiny: true, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: true,
      hasLegs: false, hasWings: false, isMetal: true,
      color: ['silver', 'gold', 'clear'], habitat: ['finger', 'jewelry box'],
      hints: ['worn on finger', 'marriage proposal', 'shiny gem', 'wedding', 'expensive']
    },
    {
      id: 'love_letter', word: 'LOVE LETTER', icon: '💌', topic: 'Romantic & Couple Items', es: 'Carta de Amor',
      isAnimal: false, isAlive: false, isTiny: true, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: true,
      hasLegs: false, hasWings: false,
      color: ['white', 'pink', 'red'], habitat: ['envelope', 'mailbox', 'desk'],
      hints: ['written on paper', 'envelope with heart', 'romantic words', 'poem']
    },
    {
      id: 'chocolate_box', word: 'CHOCOLATE BOX', icon: '🍫', topic: 'Romantic & Couple Items', es: 'Caja de Chocolates',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: true, isObject: true, isPerson: false, isSpace: false, isRomantic: true,
      hasLegs: false, hasWings: false, isSweet: true,
      color: ['brown', 'red', 'gold'], habitat: ['shop', 'gift', 'table'],
      hints: ['sweet candy', 'cocoa', 'heart-shaped box', 'romantic gift']
    },
    {
      id: 'candle', word: 'SCENTED CANDLE', icon: '🕯️', topic: 'Romantic & Couple Items', es: 'Vela Aromática',
      isAnimal: false, isAlive: false, isTiny: true, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: true,
      hasLegs: false, hasWings: false, isHot: true,
      color: ['white', 'red', 'yellow'], habitat: ['table', 'dinner', 'bedroom'],
      hints: ['wax', 'flame', 'romantic dinner light', 'melts', 'smells good']
    },
    {
      id: 'teddy_bear', word: 'TEDDY BEAR', icon: '🧸', topic: 'Romantic & Couple Items', es: 'Oso de Peluche',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: true,
      hasLegs: true, hasWings: false, isSoft: true, hasFur: true,
      color: ['brown', 'white', 'pink'], habitat: ['bed', 'gift shop', 'bedroom'],
      hints: ['plush toy', 'soft and cuddly', 'stuffed animal', 'gift for partner']
    },
    {
      id: 'champagne', word: 'CHAMPAGNE', icon: '🥂', topic: 'Romantic & Couple Items', es: 'Champaña / Brindis',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: true, isObject: true, isPerson: false, isSpace: false, isRomantic: true,
      hasLegs: false, hasWings: false, isCold: true,
      color: ['gold', 'yellow', 'green'], habitat: ['restaurant', 'party', 'wedding'],
      hints: ['bubbly drink', 'two glasses', 'celebration toast', 'anniversary']
    },
    {
      id: 'cupid_bow', word: 'CUPID ARROW', icon: '💘', topic: 'Romantic & Couple Items', es: 'Flecha de Cupido',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: true, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: true,
      hasLegs: false, hasWings: true,
      color: ['pink', 'red', 'gold'], habitat: ['sky', 'mythology', 'heart'],
      hints: ['magical arrow', 'makes people fall in love', 'heart', 'Valentine']
    },
    {
      id: 'sunset_beach', word: 'SUNSET WALK', icon: '🌅', topic: 'Romantic & Couple Items', es: 'Atardecer en la Playa',
      isAnimal: false, isAlive: false, isTiny: false, isBig: true, canFly: false, livesInWater: false,
      isFood: false, isObject: false, isPerson: false, isSpace: false, isRomantic: true,
      hasLegs: false, hasWings: false,
      color: ['orange', 'pink', 'purple', 'gold'], habitat: ['beach', 'ocean', 'sky'],
      hints: ['romantic date', 'ocean horizon', 'evening sky', 'holding hands']
    },
    {
      id: 'violin', word: 'VIOLIN', icon: '🎻', topic: 'Romantic & Couple Items', es: 'Violín',
      isAnimal: false, isAlive: false, isTiny: false, isBig: false, canFly: false, livesInWater: false,
      isFood: false, isObject: true, isPerson: false, isSpace: false, isRomantic: true,
      hasLegs: false, hasWings: false,
      color: ['brown'], habitat: ['concert', 'restaurant', 'orchestra'],
      hints: ['wooden instrument', 'four strings', 'played with a bow', 'romantic serenade']
    }
  ];

  // ==========================================================================
  // 2. DICCIONARIO DE AYUDA DE VOCABULARIO Y CORRECCIÓN FONÉTICA DE CHIPS
  // ==========================================================================
  const VOCABULARY_HELPER_ITEMS = [
    { es: '¿Soy un animal?', en: 'Am I an animal?', category: ' Categoría' },
    { es: '¿Estoy vivo?', en: 'Am I alive?', category: ' Categoría' },
    { es: '¿Soy comida o bebida?', en: 'Am I food or drink?', category: ' Categoría' },
    { es: '¿Soy un objeto de casa?', en: 'Am I a household object?', category: ' Categoría' },
    { es: '¿Soy una persona o profesión?', en: 'Am I a person or job?', category: ' Categoría' },
    { es: '¿Estoy en el espacio exterior?', en: 'Am I in outer space?', category: ' Categoría' },
    { es: '¿Soy algo romántico?', en: 'Am I something romantic?', category: ' Categoría' },
    { es: 'Pequeño / Diminuto', en: 'tiny / small', category: '📏 Tamaño' },
    { es: 'Grande / Enorme', en: 'big / huge / large', category: '📏 Tamaño' },
    { es: 'Volar / Alas', en: 'Can I fly? / Do I have wings?', category: '🦅 Habilidad' },
    { es: 'Vivir en el agua / Nadar', en: 'Do I live in water? / Can I swim?', category: '🌊 Hábitat' },
    { es: 'Tener patas / pelaje', en: 'Do I have legs? / Do I have fur?', category: '🐾 Rasgos' },
    { es: 'Peligroso / Salvaje', en: 'Am I dangerous? / Am I wild?', category: '⚡ Rasgos' },
    { es: 'Dulce / Caliente / Frío', en: 'Am I sweet? / Am I hot? / Am I cold?', category: '🍕 Comida' },
    { es: 'De metal / Eléctrico / Suave', en: 'Am I made of metal? / Am I electric? / Am I soft?', category: '🔧 Material' },
    { es: 'Rojo / Azul / Amarillo / Blanco', en: 'Am I red? / Am I yellow? / Am I white?', category: '🎨 Colores' }
  ];

  const PHONETIC_CHIP_ALTERNATIVES = {
    'teenager': ['tiny', 'teacher', 'tiger'],
    'tin': ['tiny', 'thin', 'ten'],
    'time': ['tiny', 'lime', 'mine'],
    'flyer': ['fly', 'fire', 'flower'],
    'watery': ['water', 'warm', 'white'],
    'read': ['red', 'bread', 'round'],
    'see': ['sea', 'sweet', 'seed'],
    'meat': ['metal', 'meat', 'neat'],
    'leave': ['live', 'leaf', 'alive'],
    'life': ['alive', 'light', 'large'],
    'fool': ['food', 'full', 'tool'],
    'wings': ['wings', 'rings', 'things'],
    'for': ['four', 'fur', 'fork'],
    'four': ['fur', 'four', 'fork'],
    'hair': ['fur', 'feathers', 'air'],
    'big': ['big', 'pig', 'pink'],
    'small': ['small', 'tall', 'ball']
  };

  // ==========================================================================
  // 3. ESTADO REACTIVO DEL JUEGO Y SINCRONIZACIÓN MULTIJUGADOR
  // ==========================================================================
  const jestState = {
    isOpen: false,
    mode: 'ai', // 'ai' | 'friend' | 'room'
    topic: 'Animals & Creatures',
    roomCode: '',
    friendId: null,
    friendName: 'AI Rival Nexus',
    playerCard: null,       // Secreta para el jugador (en su propia frente)
    rivalCard: null,        // Visible sobre la frente del rival 3D
    isPlayerTurn: true,
    isGameOver: false,
    winner: null,
    turnCount: 0,
    confirmedClues: [],     // [{ text: '✅ Alive', verdict: 'yes' }]
    rivalClues: [],
    chatLog: [],
    broadcastChannel: null,
    roomPollInterval: null,
    recognition: null,
    isListening: false,
    detectedWords: [],
    selectedChipIndex: -1,
    bypassOrientation: false,
    // Three.js references
    three: {
      initialized: false,
      scene: null,
      camera: null,
      renderer: null,
      animFrameId: null,
      rivalGroup: null,
      rivalHeadbandSprite: null,
      verdictSprite: null,
      judgeOrb: null,
      playerCardMesh: null,
      clock: null
    }
  };

  // ==========================================================================
  // 4. INYECCIÓN DE ESTILOS Y DOM (#view-jest-game)
  // ==========================================================================
  function ensureJestStyles() {
    if (document.getElementById('jest-game-custom-styles')) return;
    const style = document.createElement('style');
    style.id = 'jest-game-custom-styles';
    style.textContent = `
      #view-jest-game {
        position: fixed;
        top: 56px;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: calc(100dvh - 56px) !important;
        max-height: calc(100dvh - 56px) !important;
        z-index: 9500;
        background: radial-gradient(circle at 50% 25%, #172038 0%, #090d16 75%);
        color: #f8fafc;
        font-family: 'Inter', 'Outfit', system-ui, sans-serif;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      #view-jest-game.hidden {
        display: none !important;
        pointer-events: none !important;
        visibility: hidden !important;
      }
      .jest-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 18px;
        background: rgba(10, 14, 24, 0.88);
        border-bottom: 1px solid rgba(56, 189, 248, 0.25);
        backdrop-filter: blur(12px);
        z-index: 20;
        flex-wrap: wrap;
        gap: 8px;
      }
      .jest-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 800;
        font-size: 1.05rem;
        letter-spacing: 0.03em;
        color: #38bdf8;
      }
      .jest-controls-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .jest-select, .jest-room-input {
        background: rgba(15, 23, 42, 0.9);
        color: #e2e8f0;
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 0.82rem;
        font-weight: 600;
        outline: none;
      }
      .jest-select:focus, .jest-room-input:focus {
        border-color: #38bdf8;
        box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25);
      }
      .jest-btn {
        border: none;
        border-radius: 9px;
        padding: 7px 12px;
        font-size: 0.82rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.18s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .jest-btn:hover {
        transform: translateY(-1px);
        filter: brightness(1.1);
      }
      .jest-btn:active {
        transform: translateY(0);
      }
      .jest-btn-primary {
        background: linear-gradient(135deg, #0284c7, #2563eb);
        color: #fff;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
      }
      .jest-btn-amber {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #fff;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
      }
      .jest-btn-emerald {
        background: linear-gradient(135deg, #10b981, #059669);
        color: #fff;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
      }
      .jest-btn-purple {
        background: linear-gradient(135deg, #8b5cf6, #6d28d9);
        color: #fff;
      }
      .jest-btn-ghost {
        background: rgba(30, 41, 59, 0.8);
        color: #cbd5e1;
        border: 1px solid rgba(148, 163, 184, 0.3);
      }
      .jest-main-workspace {
        position: relative;
        flex: 1;
        display: flex;
        overflow: hidden;
      }
      #jest3dStage {
        position: relative;
        flex: 1;
        width: 100%;
        height: 100%;
        min-height: 320px;
        background: radial-gradient(circle at 50% 40%, #1e293b 0%, #090d16 80%);
        overflow: hidden;
      }
      #jest3dStage canvas {
        width: 100% !important;
        height: 100% !important;
        display: block;
      }
      .jest-hud-overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 12px 16px;
        z-index: 10;
      }
      .jest-hud-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        flex-wrap: wrap;
      }
      .jest-card-badge {
        pointer-events: auto;
        background: rgba(15, 23, 42, 0.86);
        border: 1px solid rgba(56, 189, 248, 0.35);
        border-radius: 12px;
        padding: 10px 14px;
        backdrop-filter: blur(10px);
        max-width: 310px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.45);
      }
      .jest-card-badge.my-secret {
        border-color: rgba(245, 158, 11, 0.5);
      }
      .jest-badge-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #94a3b8;
        margin-bottom: 4px;
        font-weight: 700;
      }
      .jest-badge-title {
        font-size: 1rem;
        font-weight: 800;
        color: #f8fafc;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .jest-clues-list {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 7px;
      }
      .jest-clue-pill {
        font-size: 0.72rem;
        padding: 3px 8px;
        border-radius: 999px;
        font-weight: 700;
        background: rgba(30, 41, 59, 0.95);
        border: 1px solid rgba(148, 163, 184, 0.3);
      }
      .jest-clue-pill.yes {
        color: #34d399;
        border-color: rgba(52, 211, 153, 0.45);
        background: rgba(6, 78, 59, 0.45);
      }
      .jest-clue-pill.no {
        color: #f87171;
        border-color: rgba(248, 113, 113, 0.45);
        background: rgba(127, 29, 29, 0.45);
      }
      .jest-clue-pill.partial {
        color: #fbbf24;
        border-color: rgba(251, 191, 36, 0.45);
        background: rgba(120, 53, 15, 0.45);
      }
      .jest-judge-banner {
        pointer-events: auto;
        align-self: center;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(30, 41, 59, 0.94));
        border: 2px solid #38bdf8;
        border-radius: 16px;
        padding: 10px 20px;
        text-align: center;
        box-shadow: 0 0 28px rgba(56, 189, 248, 0.35);
        transition: all 0.25s ease;
        max-width: 520px;
      }
      .jest-judge-verdict {
        font-size: 1.25rem;
        font-weight: 900;
        letter-spacing: 0.03em;
        margin-bottom: 3px;
      }
      .jest-judge-sub {
        font-size: 0.8rem;
        color: #cbd5e1;
      }
      .jest-log-panel {
        pointer-events: auto;
        width: 300px;
        max-height: 210px;
        overflow-y: auto;
        background: rgba(15, 23, 42, 0.82);
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 12px;
        padding: 8px 10px;
        font-size: 0.78rem;
        backdrop-filter: blur(8px);
      }
      .jest-log-entry {
        padding: 5px 6px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
        line-height: 1.35;
      }
      .jest-log-entry:last-child {
        border-bottom: none;
      }
      .jest-bottom-bar {
        background: rgba(10, 14, 24, 0.95);
        border-top: 1px solid rgba(56, 189, 248, 0.28);
        padding: 8px 16px 12px;
        padding-right: 84px !important;
        z-index: 20;
        display: flex;
        flex-direction: column;
        gap: 6px;
        box-sizing: border-box;
      }
      .jest-chips-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        min-height: 28px;
      }
      .jest-word-chip {
        background: rgba(30, 58, 138, 0.65);
        border: 1px solid #38bdf8;
        color: #f0f9ff;
        padding: 3px 10px;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .jest-word-chip:hover, .jest-word-chip.active {
        background: #f59e0b;
        border-color: #fde68a;
        color: #0f172a;
        transform: scale(1.05);
      }
      .jest-chip-alt-btn {
        background: rgba(16, 185, 129, 0.25);
        border: 1px dashed #34d399;
        color: #6ee7b7;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        cursor: pointer;
        font-weight: 600;
      }
      .jest-input-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      #jestQuestionInput {
        flex: 1;
        min-width: 200px;
        background: rgba(15, 23, 42, 0.95);
        border: 1.5px solid rgba(56, 189, 248, 0.45);
        color: #f8fafc;
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 0.92rem;
        font-weight: 600;
        outline: none;
      }
      #jestQuestionInput:focus {
        border-color: #38bdf8;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
      }
      .jest-mic-btn.recording {
        background: linear-gradient(135deg, #ef4444, #dc2626) !important;
        animation: jestPulseMic 1.2s infinite;
      }
      @keyframes jestPulseMic {
        0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
        50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      }
      .jest-modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(2, 6, 23, 0.78);
        backdrop-filter: blur(6px);
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .jest-modal-backdrop.hidden {
        display: none !important;
      }
      .jest-modal-card {
        background: #0f172a;
        border: 1px solid rgba(56, 189, 248, 0.4);
        border-radius: 16px;
        max-width: 520px;
        width: 100%;
        max-height: 82vh;
        overflow-y: auto;
        padding: 20px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
      }
      @media (max-width: 768px) {
        .jest-log-panel {
          width: 100%;
          max-height: 110px;
        }
        .jest-card-badge {
          max-width: 48%;
          padding: 8px 10px;
        }
      }
      #jestRotateDeviceOverlay {
        position: fixed;
        inset: 0;
        z-index: 100000;
        background: rgba(11, 17, 32, 0.96);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 24px;
        color: #f8fafc;
      }
      .jest-rotate-content {
        max-width: 440px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
      .jest-rotate-icon-anim {
        font-size: 3.2rem;
        animation: jestRotatePhoneAnim 2s ease-in-out infinite;
      }
      @keyframes jestRotatePhoneAnim {
        0%, 20% { transform: rotate(0deg) scale(1); }
        50%, 70% { transform: rotate(90deg) scale(1.12); }
        100% { transform: rotate(0deg) scale(1); }
      }
      .jest-rotate-title {
        font-size: 1.3rem;
        font-weight: 900;
        color: #38bdf8;
        margin: 0;
        line-height: 1.3;
      }
      .jest-rotate-subtitle {
        font-size: 0.88rem;
        color: #cbd5e1;
        margin: 0;
        line-height: 1.5;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureJestDOM() {
    ensureJestStyles();
    let container = document.getElementById('view-jest-game');
    if (container) return container;

    container = document.createElement('section');
    container.id = 'view-jest-game';
    container.className = 'hidden';
    container.innerHTML = `
      <!-- OVERLAY DETECTOR DE ORIENTACIÓN VERTICAL EN MÓVILES -->
      <div id="jestRotateDeviceOverlay" class="jest-rotate-overlay" style="display:none;">
        <div class="jest-rotate-content">
          <div class="jest-rotate-icon-anim">📱 ➔ 📲 🔄</div>
          <h3 class="jest-rotate-title">Por favor gira tu celular en horizontal</h3>
          <p class="jest-rotate-subtitle">
            Para jugar cómodamente a Jest / Jarz 3D Headbanz, ver las cartas en la frente del rival y alcanzar todos los controles, usa el modo horizontal (Landscape).
          </p>
          <div style="display:flex; flex-direction:column; gap:8px; width:100%; max-width:300px; margin:0 auto;">
            <button type="button" onclick="window.forceJestLandscapeNow ? window.forceJestLandscapeNow() : (window.toggleScreenOrientation && window.toggleScreenOrientation())" class="jest-btn jest-btn-primary" style="width:100%; justify-content:center;">
              🔄 Rotar a Horizontal Automáticamente
            </button>
            <button type="button" id="jestBypassRotateBtn" onclick="window.dismissJestRotateOverlay()" class="jest-btn jest-btn-ghost" style="width:100%; justify-content:center;">
              Continuar de todos modos
            </button>
          </div>
        </div>
      </div>

      <!-- BARRA SUPERIOR DE CONFIGURACIÓN Y SALA -->
      <div class="jest-topbar">
        <div class="jest-brand">
          <span>🃏 JEST / JARZ 3D</span>
          <span style="font-size:0.74rem; padding:2px 8px; border-radius:99px; background:rgba(56,189,248,0.18); color:#7dd3fc;">
            1vs1 Headbanz + AI Referee
          </span>
        </div>

        <div class="jest-controls-row">
          <label style="font-size:0.75rem; color:#94a3b8;">Rival:</label>
          <select id="jestRivalModeSelect" class="jest-select" aria-label="Modo de Rival">
            <option value="ai">🤖 Rival IA</option>
            <option value="friend">👥 Duelo con Amigo del Chat</option>
            <option value="room">🔑 Código de Sala</option>
          </select>

          <input type="text" id="jestRoomCodeInput" class="jest-room-input" placeholder="Sala: JEST-101" style="width:115px; display:none;" />

          <label style="font-size:0.75rem; color:#94a3b8;">Tópico:</label>
          <select id="jestTopicSelect" class="jest-select" aria-label="Tópico de Cartas">
            ${JEST_TOPICS.map(t => `<option value="${t}">${t}</option>`).join('')}
          </select>

          <button type="button" onclick="window.toggleScreenOrientation && window.toggleScreenOrientation()" class="jest-btn jest-btn-purple" title="Rotar pantalla Horizontal / Vertical">
            🔄 Rotar
          </button>
          <button type="button" id="jestNewMatchBtn" class="jest-btn jest-btn-primary">
            🔄 Nueva Partida
          </button>
          <button type="button" id="jestExitBtn" class="jest-btn jest-btn-ghost">
            ✖ Salir
          </button>
        </div>
      </div>

      <!-- ESCENARIO 3D SENTADO EN LA MESA + HUD SUPERPUESTO -->
      <div class="jest-main-workspace">
        <div id="jest3dStage"></div>

        <div class="jest-hud-overlay">
          <!-- Tarjetas Superiores: Carta del Rival (Visible) y Tu Carta (Secreta + Pistas) -->
          <div class="jest-hud-top">
            <div class="jest-card-badge">
              <div class="jest-badge-label" id="jestRivalHeaderLabel">👀 FRENTE DEL RIVAL (VISIBLE PARA TI)</div>
              <div class="jest-badge-title" id="jestRivalForeheadHud">🦊 FOX</div>
              <div style="font-size:0.73rem; color:#94a3b8; margin-top:3px;" id="jestRivalStatusSub">
                ¡No se lo reveles! El Juez IA responde por ambos.
              </div>
            </div>

            <div class="jest-judge-banner" id="jestJudgeBanner">
              <div class="jest-judge-verdict" id="jestJudgeVerdictText">⚖️ AI REFEREE READY</div>
              <div class="jest-judge-sub" id="jestJudgeSubText">
                Haz una pregunta de Sí o No en inglés (Ej: "Am I an animal?", "Can I fly?")
              </div>
            </div>

            <div class="jest-card-badge my-secret">
              <div class="jest-badge-label">❓ MY HEADBAND CARD (TU FRENTE)</div>
              <div class="jest-badge-title" id="jestMyMysteryHud">❓ MY HEADBAND CARD</div>
              <div style="font-size:0.72rem; color:#fcd34d; margin-top:2px;">Pistas confirmadas por el Juez IA:</div>
              <div class="jest-clues-list" id="jestConfirmedCluesList">
                <span class="jest-clue-pill">Esperando tu 1ª pregunta...</span>
              </div>
            </div>
          </div>

          <!-- Historial lateral inferior de preguntas y veredictos -->
          <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:12px; flex-wrap:wrap;">
            <div class="jest-log-panel" id="jestTurnLogPanel">
              <div style="font-weight:800; color:#38bdf8; margin-bottom:4px; font-size:0.75rem;">
                📜 HISTORIAL DEL JUEZ IA (1VS1)
              </div>
              <div id="jestTurnLogEntries">
                <div class="jest-log-entry" style="color:#94a3b8;">Partida lista. ¡Tu turno para preguntar!</div>
              </div>
            </div>

            <div style="pointer-events:auto; display:flex; gap:6px; flex-wrap:wrap;">
              <span style="font-size:0.75rem; background:rgba(15,23,42,0.85); padding:6px 10px; border-radius:8px; border:1px solid rgba(148,163,184,0.25);" id="jestTurnIndicatorBadge">
                🟢 Turno: TÚ (Jugador)
              </span>
            </div>
          </div>
        </div>

        <!-- MODAL DE AYUDA DE VOCABULARIO (SIN REVELAR LA CARTA) -->
        <div id="jestVocabHelperModal" class="jest-modal-backdrop hidden">
          <div class="jest-modal-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <h3 style="margin:0; font-size:1.05rem; color:#38bdf8;">🤖 Asistente de Vocabulario para Preguntas</h3>
              <button type="button" id="jestCloseVocabModalBtn" class="jest-btn jest-btn-ghost">✖</button>
            </div>
            <p style="font-size:0.8rem; color:#94a3b8; margin:0 0 10px;">
              Busca cómo decir un adjetivo, sustantivo o pregunta en inglés. Toca cualquiera para insertarlo en tu barra sin enviar:
            </p>
            <input type="text" id="jestVocabSearchInput" class="jest-room-input" placeholder="Buscar ej: pequeño, volar, animal, metal, comida..." style="width:100%; margin-bottom:10px; padding:8px 12px;" />
            <div id="jestVocabHelperList" style="display:flex; flex-direction:column; gap:6px; max-height:280px; overflow-y:auto;"></div>
          </div>
        </div>

        <!-- MODAL PARA ADIVINAR EL PERSONAJE / PALABRA SECRETA -->
        <div id="jestGuessModal" class="jest-modal-backdrop hidden">
          <div class="jest-modal-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <h3 style="margin:0; font-size:1.05rem; color:#10b981;">🎯 ¡Adivinar mi Palabra en la Frente!</h3>
              <button type="button" id="jestCloseGuessModalBtn" class="jest-btn jest-btn-ghost">✖</button>
            </div>
            <p style="font-size:0.82rem; color:#cbd5e1; margin:0 0 10px;">
              Escribe o selecciona qué carta crees que tienes en la frente. ¡Si aciertas ganas el duelo y <strong>+40 EXP</strong>!
            </p>
            <input type="text" id="jestFinalGuessInput" class="jest-room-input" placeholder="Ej: FOX, PIZZA, ASTRONAUT..." style="width:100%; margin-bottom:10px; padding:10px 12px; font-size:0.95rem;" />
            <div id="jestGuessQuickCards" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; max-height:190px; overflow-y:auto;"></div>
            <div style="display:flex; justify-content:flex-end; gap:8px;">
              <button type="button" id="jestSubmitFinalGuessBtn" class="jest-btn jest-btn-emerald">
                🏆 Confirmar Respuesta
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- BARRA INFERIOR: VOZ A TEXTO CON CHIPS EDITABLES + INPUT + BOTONES -->
      <div class="jest-bottom-bar">
        <div class="jest-chips-bar" id="jestSpeechWordChips">
          <span style="font-size:0.75rem; color:#94a3b8;">
            💡 Usa <strong>🎤 Hablar</strong> o escribe tu pregunta. Las palabras detectadas aparecerán aquí como chips clicables para corregir antes de enviar.
          </span>
        </div>

        <div class="jest-input-row">
          <button type="button" id="jestSpeakQuestionBtn" class="jest-btn jest-btn-amber jest-mic-btn">
            🎤 Hablar (Speak Question)
          </button>

          <input
            type="text"
            id="jestQuestionInput"
            value=""
            placeholder="Write or speak a Yes/No question (e.g. Am I tiny? Do I have wings?)"
            autocomplete="off"
          />

          <button type="button" id="jestWordHelperBtn" class="jest-btn jest-btn-purple">
            🤖 Ayuda de Palabra
          </button>

          <button type="button" id="jestAskJudgeBtn" class="jest-btn jest-btn-primary">
            ⚖️ Preguntar al Juez IA
          </button>

          <button type="button" id="jestGuessCharacterBtn" class="jest-btn jest-btn-emerald">
            🎯 ¡Adivinar mi Personaje!
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    bindJestEvents();
    return container;
  }

  // ==========================================================================
  // 5. ESCENA 3D EN PRIMERA PERSONA SENTADO EN LA MESA (THREE.JS)
  // ==========================================================================
  function createForeheadSpriteTexture(cardObj, isMystery) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Fondo estilo carta física de Headbanz
    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    if (isMystery) {
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(1, '#312e81');
    } else {
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e293b');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(12, 12, 488, 232, 28) : ctx.fillRect(12, 12, 488, 232);
    ctx.fill();

    // Borde brillante
    ctx.lineWidth = 8;
    ctx.strokeStyle = isMystery ? '#f59e0b' : '#38bdf8';
    ctx.stroke();

    // Banda elástica inferior
    ctx.fillStyle = isMystery ? '#d97706' : '#0284c7';
    ctx.fillRect(16, 200, 480, 36);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (isMystery || !cardObj) {
      ctx.font = 'bold 42px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('❓ MY HEADBAND CARD', 256, 105);
      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('SECRET WORD ON YOUR FOREHEAD', 256, 218);
    } else {
      ctx.font = 'bold 58px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${cardObj.icon} ${cardObj.word}`, 256, 102);

      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = '#bae6fd';
      ctx.fillText(`RIVAL'S FOREHEAD CARD • ${cardObj.topic.toUpperCase()}`, 256, 218);
    }

    return canvas;
  }

  function createVerdictSpriteTexture(verdictTitle, subtitle) {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(10, 10, 620, 160);

    let borderColor = '#38bdf8';
    if (verdictTitle.includes('YES')) borderColor = '#10b981';
    else if (verdictTitle.includes('NO')) borderColor = '#ef4444';
    else if (verdictTitle.includes('SOMETIMES') || verdictTitle.includes('⚠️')) borderColor = '#f59e0b';

    ctx.lineWidth = 6;
    ctx.strokeStyle = borderColor;
    ctx.strokeRect(10, 10, 620, 160);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(verdictTitle.slice(0, 32), 320, 75);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px sans-serif';
    ctx.fillText((subtitle || 'Impartial AI Referee').slice(0, 48), 320, 130);

    return canvas;
  }

  function initJestThreeScene() {
    const stageEl = document.getElementById('jest3dStage');
    if (!stageEl) return;

    const THREE = global.THREE;
    if (!THREE) {
      // Fallback visual enriquecido si Three.js aún no cargó
      stageEl.innerHTML = `
        <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle,#1e293b,#090d16);">
          <div style="font-size:3.5rem;margin-bottom:8px;" id="jestFallbackRivalSprite">🦊 FOX</div>
          <div style="font-size:0.9rem;color:#94a3b8;">Mesa 3D Jest / Jarz • Rival sentado frente a ti</div>
        </div>
      `;
      return;
    }

    if (jestState.three.initialized && jestState.three.renderer) {
      updateThreeForeheadSprites();
      return;
    }

    stageEl.innerHTML = '';
    const width = stageEl.clientWidth || window.innerWidth || 960;
    const height = stageEl.clientHeight || (window.innerHeight - 160) || 540;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b101e);
    scene.fog = new THREE.FogExp2(0x0b101e, 0.045);

    // Cámara en primera persona sentado a la mesa mirando al rival enfrente
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 2.35, 3.85);
    camera.lookAt(0, 1.45, -1.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (renderer.shadowMap) {
      renderer.shadowMap.enabled = true;
    }
    stageEl.appendChild(renderer.domElement);

    // Iluminación dramática de salón de duelo
    const ambientLight = new THREE.AmbientLight(0x475569, 1.25);
    scene.add(ambientLight);

    const spotTable = new THREE.SpotLight(0xfef08a, 2.4, 18, Math.PI / 3, 0.45);
    spotTable.position.set(0, 6.2, 0.5);
    scene.add(spotTable);

    const rimCyan = new THREE.PointLight(0x38bdf8, 1.6, 12);
    rimCyan.position.set(-3.2, 3.0, -1.8);
    scene.add(rimCyan);

    const rimAmber = new THREE.PointLight(0xf59e0b, 1.4, 12);
    rimAmber.position.set(3.2, 3.0, 1.5);
    scene.add(rimAmber);

    // Mesa de madera 3D
    const tableGroup = new THREE.Group();
    const tableGeo = new THREE.CylinderGeometry(2.65, 2.65, 0.18, 40);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x5c3a21,
      roughness: 0.55,
      metalness: 0.1
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = 0.85;
    tableGroup.add(tableMesh);

    // Borde dorado/madera oscura de la mesa
    const rimGeo = new THREE.TorusGeometry(2.65, 0.07, 16, 48);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.6 });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.88;
    tableGroup.add(rimMesh);

    // Pedestal central de la mesa
    const legGeo = new THREE.CylinderGeometry(0.32, 0.58, 0.85, 20);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x27170c, roughness: 0.7 });
    const legMesh = new THREE.Mesh(legGeo, legMat);
    legMesh.position.y = 0.42;
    tableGroup.add(legMesh);

    // Mazo de cartas físicas en el centro de la mesa
    for (let i = 0; i < 6; i++) {
      const cGeo = new THREE.BoxGeometry(0.55, 0.02, 0.78);
      const cMat = new THREE.MeshStandardMaterial({
        color: i === 5 ? 0x0284c7 : 0xf8fafc,
        roughness: 0.4
      });
      const cardMesh = new THREE.Mesh(cGeo, cMat);
      cardMesh.position.set(-0.55, 0.96 + i * 0.022, 0.15);
      cardMesh.rotation.y = (i * 0.05) - 0.1;
      tableGroup.add(cardMesh);
    }
    scene.add(tableGroup);

    // Orbe Holográfico del Juez IA en el centro de la mesa
    const judgeGroup = new THREE.Group();
    const orbGeo = new THREE.OctahedronGeometry(0.26, 1);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.65,
      wireframe: false,
      roughness: 0.2,
      metalness: 0.8
    });
    const judgeOrb = new THREE.Mesh(orbGeo, orbMat);
    judgeOrb.position.set(0.45, 1.38, 0.1);
    judgeGroup.add(judgeOrb);
    scene.add(judgeGroup);

    // Avatar 1: Rival sentado al otro lado de la mesa (mirando hacia el jugador)
    const rivalGroup = new THREE.Group();
    rivalGroup.position.set(0, 0, -2.15);

    const torsoGeo = new THREE.CylinderGeometry(0.42, 0.52, 1.25, 20);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 });
    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.position.y = 1.25;
    rivalGroup.add(torsoMesh);

    const headGeo = new THREE.SphereGeometry(0.38, 24, 24);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.45 });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 2.15;
    rivalGroup.add(headMesh);

    // Cinta Headband en la frente del rival
    const bandGeo = new THREE.CylinderGeometry(0.395, 0.395, 0.12, 24);
    const bandMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const bandMesh = new THREE.Mesh(bandGeo, bandMat);
    bandMesh.position.y = 2.26;
    rivalGroup.add(bandMesh);

    // Ojos del rival
    const eyeGeo = new THREE.SphereGeometry(0.055, 12, 12);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.13, 2.12, 0.33);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.13, 2.12, 0.33);
    rivalGroup.add(leftEye, rightEye);

    // THREE.Sprite (CanvasTexture) sobre la frente del avatar rival
    const foreheadCanvas = createForeheadSpriteTexture(jestState.rivalCard, false);
    const foreheadTex = new THREE.CanvasTexture(foreheadCanvas);
    const spriteMat = new THREE.SpriteMaterial({ map: foreheadTex, transparent: true });
    const rivalHeadbandSprite = new THREE.Sprite(spriteMat);
    rivalHeadbandSprite.position.set(0, 2.86, 0.15);
    rivalHeadbandSprite.scale.set(1.95, 0.98, 1);
    rivalGroup.add(rivalHeadbandSprite);

    scene.add(rivalGroup);

    // Avatar 2: Jugador en primer plano (hombros/manos y reflejo de su carta oculta)
    const playerForegroundGroup = new THREE.Group();
    playerForegroundGroup.position.set(0, 0, 2.45);
    const handGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const handMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.5 });
    const leftHand = new THREE.Mesh(handGeo, handMat);
    leftHand.position.set(-0.65, 1.02, -0.35);
    const rightHand = new THREE.Mesh(handGeo, handMat);
    rightHand.position.set(0.65, 1.02, -0.35);
    playerForegroundGroup.add(leftHand, rightHand);
    scene.add(playerForegroundGroup);

    // Sprite flotante del Veredicto del Juez IA sobre la mesa 3D
    const verdictCanvas = createVerdictSpriteTexture('⚖️ AI JUDGE READY', 'Ask a Yes/No question!');
    const verdictTex = new THREE.CanvasTexture(verdictCanvas);
    const verdictMat = new THREE.SpriteMaterial({ map: verdictTex, transparent: true });
    const verdictSprite = new THREE.Sprite(verdictMat);
    verdictSprite.position.set(0, 1.82, 0.25);
    verdictSprite.scale.set(2.3, 0.65, 1);
    scene.add(verdictSprite);

    if (typeof window !== 'undefined' && typeof window.applyNormalMapToObjectHierarchy === 'function') {
      try { window.applyNormalMapToObjectHierarchy(scene, 'jest'); } catch (_) {}
    }

    const clock = new THREE.Clock();
    jestState.three = {
      initialized: true,
      scene,
      camera,
      renderer,
      animFrameId: null,
      rivalGroup,
      rivalHeadbandSprite,
      verdictSprite,
      judgeOrb,
      clock
    };

    function animateJest3D() {
      if (!jestState.isOpen) return;
      jestState.three.animFrameId = requestAnimationFrame(animateJest3D);
      const elapsed = clock.getElapsedTime();

      if (jestState.three.rivalGroup) {
        jestState.three.rivalGroup.position.y = Math.sin(elapsed * 1.8) * 0.035;
        jestState.three.rivalGroup.rotation.y = Math.sin(elapsed * 0.7) * 0.06;
      }
      if (jestState.three.judgeOrb) {
        jestState.three.judgeOrb.rotation.y = elapsed * 1.4;
        jestState.three.judgeOrb.rotation.x = elapsed * 0.8;
        jestState.three.judgeOrb.position.y = 1.38 + Math.sin(elapsed * 2.6) * 0.06;
      }
      if (jestState.three.verdictSprite) {
        jestState.three.verdictSprite.position.y = 1.82 + Math.sin(elapsed * 2.2) * 0.03;
      }
      renderer.render(scene, camera);
    }

    animateJest3D();

    window.addEventListener('resize', () => {
      if (!jestState.isOpen || !jestState.three.renderer || !stageEl) return;
      const w = stageEl.clientWidth || window.innerWidth;
      const h = stageEl.clientHeight || (window.innerHeight - 160);
      jestState.three.camera.aspect = w / h;
      jestState.three.camera.updateProjectionMatrix();
      jestState.three.renderer.setSize(w, h);
    });
  }

  function updateThreeForeheadSprites() {
    if (typeof document !== 'undefined') {
      const rivalHud = document.getElementById('jestRivalForeheadHud');
      if (rivalHud && jestState.rivalCard) {
        rivalHud.textContent = `${jestState.rivalCard.icon} ${jestState.rivalCard.word}`;
      }
      const myHud = document.getElementById('jestMyMysteryHud');
      if (myHud) {
        myHud.textContent = jestState.isGameOver && jestState.playerCard
          ? `${jestState.playerCard.icon} ${jestState.playerCard.word} (REVEALED!)`
          : '❓ MY HEADBAND CARD';
      }
    }

    const THREE = global.THREE;
    if (THREE && jestState.three.rivalHeadbandSprite && jestState.rivalCard) {
      const canvas = createForeheadSpriteTexture(jestState.rivalCard, false);
      const tex = new THREE.CanvasTexture(canvas);
      jestState.three.rivalHeadbandSprite.material.map = tex;
      jestState.three.rivalHeadbandSprite.material.needsUpdate = true;
    }
  }

  function updateThreeVerdictFloatingBanner(verdictTitle, subtitle) {
    if (typeof document !== 'undefined') {
      const vEl = document.getElementById('jestJudgeVerdictText');
      const sEl = document.getElementById('jestJudgeSubText');
      if (vEl) vEl.textContent = verdictTitle;
      if (sEl) sEl.textContent = subtitle || '';
    }

    const THREE = global.THREE;
    if (THREE && jestState.three.verdictSprite) {
      const canvas = createVerdictSpriteTexture(verdictTitle, subtitle);
      const tex = new THREE.CanvasTexture(canvas);
      jestState.three.verdictSprite.material.map = tex;
      jestState.three.verdictSprite.material.needsUpdate = true;
    }
  }

  // ==========================================================================
  // 6. VOZ A TEXTO CON EDICIÓN MANUAL Y CHIPS CLICABLES ANTES DE ENVIAR
  // ==========================================================================
  function renderEditableWordChips(rawText) {
    const chipsContainer = document.getElementById('jestSpeechWordChips');
    const inputEl = document.getElementById('jestQuestionInput');
    if (!chipsContainer || !inputEl) return;

    const clean = String(rawText || '').trim();
    if (!clean) {
      chipsContainer.innerHTML = `
        <span style="font-size:0.75rem; color:#94a3b8;">
          💡 Toca cualquier palabra detectada para corregirla antes de enviar tu pregunta al Juez IA.
        </span>
      `;
      return;
    }

    const words = clean.split(/\s+/);
    jestState.detectedWords = words;

    let html = `<span style="font-size:0.73rem; color:#94a3b8; margin-right:4px;">✏️ Palabras (toca para editar):</span>`;
    words.forEach((w, idx) => {
      const stripped = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
      const isSelected = jestState.selectedChipIndex === idx;
      html += `<button type="button" class="jest-word-chip ${isSelected ? 'active' : ''}" data-chip-idx="${idx}">${w}</button>`;

      // Si existen sugerencias fonéticas rápidas (ej: teenager -> tiny)
      const alts = PHONETIC_CHIP_ALTERNATIVES[stripped];
      if (alts && alts.length > 0) {
        alts.slice(0, 2).forEach(alt => {
          html += `<button type="button" class="jest-chip-alt-btn" data-replace-idx="${idx}" data-replace-word="${alt}" title="Reemplazar '${w}' por '${alt}'">↪ ${alt}?</button>`;
        });
      }
    });

    chipsContainer.innerHTML = html;

    // Eventos de clic en cada chip para editar palabra específica sin enviar aún
    chipsContainer.querySelectorAll('.jest-word-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-chip-idx'), 10);
        jestState.selectedChipIndex = idx;
        const currentWord = jestState.detectedWords[idx] || '';
        const stripped = currentWord.replace(/[^a-zA-Z]/g, '').toLowerCase();
        const suggested = (PHONETIC_CHIP_ALTERNATIVES[stripped] && PHONETIC_CHIP_ALTERNATIVES[stripped][0]) || '';

        // Seleccionar directamente la palabra dentro del input para edición inmediata
        inputEl.focus();
        const currentVal = inputEl.value;
        const pos = currentVal.indexOf(currentWord);
        if (pos !== -1) {
          inputEl.setSelectionRange(pos, pos + currentWord.length);
        }
        if (suggested) {
          jestState.detectedWords[idx] = currentWord.endsWith('?') ? `${suggested}?` : suggested;
          inputEl.value = jestState.detectedWords.join(' ');
          renderEditableWordChips(inputEl.value);
          inputEl.focus();
        }
      });
    });

    // Botones de sugerencia fonética directa (ej. ↪ tiny?)
    chipsContainer.querySelectorAll('.jest-chip-alt-btn').forEach(altBtn => {
      altBtn.addEventListener('click', () => {
        const idx = parseInt(altBtn.getAttribute('data-replace-idx'), 10);
        const newW = altBtn.getAttribute('data-replace-word');
        if (jestState.detectedWords[idx]) {
          const hadQuestionMark = jestState.detectedWords[idx].endsWith('?');
          jestState.detectedWords[idx] = hadQuestionMark ? `${newW}?` : newW;
          inputEl.value = jestState.detectedWords.join(' ');
          renderEditableWordChips(inputEl.value);
          inputEl.focus();
        }
      });
    });
  }

  function startSpeechQuestionCapture() {
    const inputEl = document.getElementById('jestQuestionInput');
    const micBtn = document.getElementById('jestSpeakQuestionBtn');
    const SpeechRec = global.SpeechRecognition || global.webkitSpeechRecognition;

    if (!SpeechRec) {
      if (inputEl && !inputEl.value) {
        inputEl.value = 'Am I tiny?';
        renderEditableWordChips(inputEl.value);
        inputEl.focus();
      }
      updateThreeVerdictFloatingBanner('🎤 MIC SIMULATED', 'Edita tu pregunta en la barra inferior antes de enviar.');
      return;
    }

    if (jestState.isListening && jestState.recognition) {
      try { jestState.recognition.stop(); } catch (_) {}
      return;
    }

    const recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;

    jestState.recognition = recognition;
    jestState.isListening = true;

    if (micBtn) {
      micBtn.classList.add('recording');
      micBtn.textContent = '🛑 Escuchando... (Toca para parar)';
    }

    recognition.onresult = function (event) {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      transcript = transcript.trim();
      if (transcript && !transcript.endsWith('?')) {
        transcript += '?';
      }
      if (inputEl) {
        // IMPORTANTE: Deposita en #jestQuestionInput SIN enviarse sola
        inputEl.value = transcript;
        renderEditableWordChips(transcript);
      }
    };

    recognition.onerror = function () {
      jestState.isListening = false;
      if (micBtn) {
        micBtn.classList.remove('recording');
        micBtn.textContent = '🎤 Hablar (Speak Question)';
      }
    };

    recognition.onend = function () {
      jestState.isListening = false;
      if (micBtn) {
        micBtn.classList.remove('recording');
        micBtn.textContent = '🎤 Hablar (Speak Question)';
      }
      if (inputEl) {
        inputEl.focus();
      }
    };

    try {
      recognition.start();
    } catch (e) {
      jestState.isListening = false;
      if (micBtn) {
        micBtn.classList.remove('recording');
        micBtn.textContent = '🎤 Hablar (Speak Question)';
      }
    }
  }

  // ==========================================================================
  // 7. MOTOR DEL JUEZ IA IMPARCIAL (RESPONDE A AMBOS JUGADORES EN <300ms)
  // ==========================================================================
  const YES_NO_QUESTION_STARTERS = /^(am\s+i|do\s+i|can\s+i|is\s+it|is\s+my|are\s+my|have\s+i|has\s+it|was\s+i|would\s+i|could\s+i|should\s+i|did\s+i|does\s+it|do\s+people|can\s+people|can\s+you|are\s+you)\b/i;

  function isYesNoQuestionFormat(q) {
    const clean = String(q || '').trim();
    if (!clean || clean.length < 3) return false;
    // Rechazar preguntas abiertas con Wh- (What, Where, Who, Why, How, Which, When)
    if (/^(what|where|who|why|how|which|when)\b/i.test(clean)) return false;
    if (YES_NO_QUESTION_STARTERS.test(clean)) return true;
    // Permitir si termina en '?' y contiene algún verbo/adjetivo interrogativo válido
    return clean.endsWith('?');
  }

  function evaluateLocalSemanticReferee(questionText, card) {
    const q = String(questionText || '').toLowerCase().trim();
    if (!card) {
      return {
        verdict: '⚠️ Solo se permiten preguntas de Sí o No (Ej: Am I an animal? Do I have wings?)',
        clueTag: null
      };
    }

    if (!isYesNoQuestionFormat(q)) {
      return {
        verdict: '⚠️ Solo se permiten preguntas de Sí o No (Ej: Am I an animal? Do I have wings?)',
        clueTag: null
      };
    }

    // ¿Adivinó directamente la palabra exacta?
    const cardWordLower = card.word.toLowerCase();
    const cardIdLower = card.id.replace(/_/g, ' ').toLowerCase();
    if (q.includes(cardWordLower) || q.includes(cardIdLower)) {
      return {
        verdict: '✅ YES!',
        clueTag: `🎯 IS ${card.word}!`,
        guessedExactCard: true
      };
    }

    // Reglas semánticas instantáneas sobre las propiedades de las 60 cartas
    const checks = [
      { regex: /\b(animal|creature|beast|pet|mammal|bird|insect|fish|reptile)\b/, prop: 'isAnimal', label: 'Animal' },
      { regex: /\b(alive|living|breathe|life)\b/, prop: 'isAlive', label: 'Alive' },
      { regex: /\b(tiny|small|little|mini|short|micro)\b/, prop: 'isTiny', label: 'Tiny' },
      { regex: /\b(big|large|huge|giant|heavy|tall|enormous)\b/, prop: 'isBig', label: 'Big' },
      { regex: /\b(fly|wings|air|sky|feathers|flight)\b/, prop: 'canFly', label: 'Can Fly' },
      { regex: /\b(water|ocean|sea|swim|river|lake|aquatic|marine)\b/, prop: 'livesInWater', label: 'Water' },
      { regex: /\b(food|eat|edible|drink|delicious|taste|kitchen|meal|snack|fruit)\b/, prop: 'isFood', label: 'Food/Drink' },
      { regex: /\b(object|thing|tool|furniture|item|inanimate|house|household)\b/, prop: 'isObject', label: 'Object' },
      { regex: /\b(person|human|job|profession|worker|man|woman|people)\b/, prop: 'isPerson', label: 'Person/Job' },
      { regex: /\b(space|planet|cosmic|star|galaxy|orbit|astronomy|universe)\b/, prop: 'isSpace', label: 'Outer Space' },
      { regex: /\b(romantic|love|couple|valentine|date|wedding|heart|gift)\b/, prop: 'isRomantic', label: 'Romantic' },
      { regex: /\b(legs|feet|walk|run|jump|paws)\b/, prop: 'hasLegs', label: 'Has Legs' },
      { regex: /\b(fur|hairy|fluffy)\b/, prop: 'hasFur', label: 'Has Fur' },
      { regex: /\b(dangerous|wild|predator|sharp|bite|sting|harm)\b/, prop: 'isDangerous', label: 'Dangerous' },
      { regex: /\b(sweet|sugar|dessert|candy)\b/, prop: 'isSweet', label: 'Sweet' },
      { regex: /\b(hot|warm|fire|heat|cook|burn)\b/, prop: 'isHot', label: 'Hot' },
      { regex: /\b(cold|frozen|ice|snow|freeze)\b/, prop: 'isCold', label: 'Cold' },
      { regex: /\b(metal|steel|iron|silver|gold|metallic)\b/, prop: 'isMetal', label: 'Metal' },
      { regex: /\b(electric|electronic|battery|plug|screen|technology)\b/, prop: 'isElectronic', label: 'Electronic' },
      { regex: /\b(soft|cuddly|plush|pillow)\b/, prop: 'isSoft', label: 'Soft' }
    ];

    for (const rule of checks) {
      if (rule.regex.test(q)) {
        const val = Boolean(card[rule.prop]);
        return {
          verdict: val ? '✅ YES!' : '❌ NO.',
          clueTag: `${val ? '✅' : '❌'} ${rule.label}`
        };
      }
    }

    // Colores
    const colorList = ['red', 'blue', 'yellow', 'green', 'orange', 'white', 'black', 'brown', 'pink', 'purple', 'grey', 'gray', 'silver', 'gold'];
    for (const c of colorList) {
      if (new RegExp(`\\b${c}\\b`).test(q)) {
        const hasColor = Array.isArray(card.color) && (card.color.includes(c) || card.color.includes('any') || card.color.includes('colorful'));
        return {
          verdict: hasColor ? '✅ YES!' : '❌ NO.',
          clueTag: `${hasColor ? '✅' : '❌'} Color: ${c}`
        };
      }
    }

    // Hábitat o pistas textuales
    const allHints = []
      .concat(card.habitat || [])
      .concat(card.hints || [])
      .join(' ')
      .toLowerCase();

    const words = q.replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 3 && !['have', 'does', 'that', 'this', 'with', 'from', 'your'].includes(w));
    for (const w of words) {
      if (allHints.includes(w)) {
        return {
          verdict: '✅ YES!',
          clueTag: `✅ ${w}`
        };
      }
    }

    return {
      verdict: '⚖️ SOMETIMES / PARTIALLY.',
      clueTag: '⚖️ Partially'
    };
  }

  function speakJudgeVerdict(text) {
    try {
      if (typeof global.speechSynthesis === 'undefined') return;
      global.speechSynthesis.cancel();
      const clean = String(text || '')
        .replace(/[✅❌⚖️⚠️🎯]/g, '')
        .trim();
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = clean.includes('Solo se permiten') ? 'es-ES' : 'en-US';
      utter.rate = 0.95;
      global.speechSynthesis.speak(utter);
    } catch (_) {}
  }

  /**
   * 4. JUEZ IA IMPARCIAL (RESPONDE A AMBOS JUGADORES):
   * Evalúa la pregunta contra `secretCard` mediante la API de IA del proyecto y
   * motor semántico de respaldo local en <300ms.
   */
  async function askJestJudgeAI(questionText, secretCard = null, isPlayerTurn = true) {
    const targetCard = secretCard || (isPlayerTurn ? jestState.playerCard : jestState.rivalCard) || JEST_CARDS_DB[0];
    const cleanQuestion = String(questionText || '').trim();

    // Evaluación semántica local instantánea (<5ms)
    const localResult = evaluateLocalSemanticReferee(cleanQuestion, targetCard);

    if (!isYesNoQuestionFormat(cleanQuestion)) {
      const invalidMsg = '⚠️ Solo se permiten preguntas de Sí o No (Ej: Am I an animal? Do I have wings?)';
      updateThreeVerdictFloatingBanner(invalidMsg, 'Reformúlala empezando con Am I / Do I / Can I...');
      speakJudgeVerdict(invalidMsg);
      return invalidMsg;
    }

    // Intento opcional con API IA en carrera de máximo 260ms para garantizar respuesta <300ms
    let finalVerdict = localResult.verdict;
    try {
      if (typeof fetch === 'function' && localResult.verdict === '⚖️ SOMETIMES / PARTIALLY.') {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 240);
        const prompt = `You are an impartial referee in a Headbanz game. Secret card: "${targetCard.word}" (${targetCard.topic}). Question: "${cleanQuestion}". Reply ONLY with one exact string: "✅ YES!" or "❌ NO." or "⚖️ SOMETIMES / PARTIALLY."`;
        const res = await fetch('/api/ai-tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt, history: [] }),
          signal: controller.signal
        });
        clearTimeout(timer);
        if (res && res.ok) {
          const data = await res.json();
          const reply = String((data && data.reply) || '').toUpperCase();
          if (reply.includes('YES')) finalVerdict = '✅ YES!';
          else if (reply.includes('NO')) finalVerdict = '❌ NO.';
          else if (reply.includes('SOMETIMES') || reply.includes('PARTIALLY')) finalVerdict = '⚖️ SOMETIMES / PARTIALLY.';
        }
      }
    } catch (_) {
      // Usa el veredicto del motor semántico local instantáneo
    }

    const whoAsked = isPlayerTurn ? '🧑 TÚ' : `🤖 ${jestState.friendName || 'RIVAL'}`;
    updateThreeVerdictFloatingBanner(finalVerdict, `${whoAsked}: "${cleanQuestion}"`);
    speakJudgeVerdict(finalVerdict);

    // Registrar pista confirmada si es turno del jugador
    if (isPlayerTurn && localResult.clueTag) {
      const verdictType = finalVerdict.includes('YES') ? 'yes' : (finalVerdict.includes('NO') ? 'no' : 'partial');
      if (!jestState.confirmedClues.some(c => c.text === localResult.clueTag)) {
        jestState.confirmedClues.push({ text: localResult.clueTag, type: verdictType });
        renderConfirmedClues();
      }
    }

    appendTurnLogEntry(whoAsked, cleanQuestion, finalVerdict);

    // Sincronizar con sala multijugador si aplica
    broadcastJestRoomEvent({
      type: 'question_verdict',
      actor: whoAsked,
      question: cleanQuestion,
      verdict: finalVerdict,
      timestamp: Date.now()
    });

    // ¿Adivinó el personaje directamente en la pregunta?
    if (localResult.guessedExactCard) {
      handleMatchVictory(isPlayerTurn ? 'player' : 'rival');
    }

    return finalVerdict;
  }

  function renderConfirmedClues() {
    if (typeof document === 'undefined') return;
    const listEl = document.getElementById('jestConfirmedCluesList');
    if (!listEl) return;
    if (jestState.confirmedClues.length === 0) {
      listEl.innerHTML = `<span class="jest-clue-pill">Esperando tu 1ª pregunta...</span>`;
      return;
    }
    listEl.innerHTML = jestState.confirmedClues
      .map(c => `<span class="jest-clue-pill ${c.type}">${c.text}</span>`)
      .join('');
  }

  function appendTurnLogEntry(who, question, verdict) {
    if (typeof document === 'undefined') return;
    const logContainer = document.getElementById('jestTurnLogEntries');
    if (!logContainer) return;
    const item = document.createElement('div');
    item.className = 'jest-log-entry';
    item.innerHTML = `<strong>${who}:</strong> "${question}" <br/><span style="color:#38bdf8;font-weight:700;">Juez IA ➔ ${verdict}</span>`;
    logContainer.prepend(item);
  }

  // ==========================================================================
  // 8. TURNO DEL RIVAL IA E INTEGRACIÓN DE VICTORIA (+40 EXP Y AFINIDAD)
  // ==========================================================================
  function triggerAIRivalTurn() {
    if (jestState.isGameOver || jestState.mode !== 'ai') return;
    jestState.isPlayerTurn = false;
    const badge = document.getElementById('jestTurnIndicatorBadge');
    if (badge) badge.textContent = `🟡 Turno: ${jestState.friendName} pensando...`;

    setTimeout(async () => {
      if (jestState.isGameOver) return;
      const rCard = jestState.rivalCard || JEST_CARDS_DB[0];
      const poolQuestions = [
        'Am I an animal?',
        'Am I alive?',
        'Am I tiny?',
        'Am I big?',
        'Can I fly?',
        'Do I live in water?',
        'Am I food or drink?',
        'Am I a household object?',
        'Do I have legs?',
        'Am I in outer space?'
      ];
      const q = poolQuestions[jestState.turnCount % poolQuestions.length];
      jestState.turnCount++;

      await askJestJudgeAI(q, rCard, false);

      if (!jestState.isGameOver) {
        jestState.isPlayerTurn = true;
        if (badge) badge.textContent = '🟢 Turno: TÚ (Jugador)';
      }
    }, 1100);
  }

  function handleMatchVictory(winnerSide) {
    if (jestState.isGameOver) return;
    jestState.isGameOver = true;
    jestState.winner = winnerSide;

    updateThreeForeheadSprites();

    if (winnerSide === 'player') {
      const winMsg = `🏆 ¡ADIVINASTE! ERA ${jestState.playerCard.icon} ${jestState.playerCard.word} (+40 EXP)`;
      updateThreeVerdictFloatingBanner('✅ YES! YOU WIN (+40 EXP)', winMsg);
      speakJudgeVerdict(`Congratulations! You guessed ${jestState.playerCard.word} and won forty experience points!`);

      if (typeof global.addExp === 'function') {
        global.addExp(40, 'Victoria en Duelo 3D Jest / Jarz');
      }
      if (jestState.friendId && typeof global.registerRelationshipGamePlayed === 'function') {
        try {
          global.registerRelationshipGamePlayed(jestState.friendId, 'jest');
        } catch (_) {}
      }
    } else {
      const loseMsg = `🤖 ${jestState.friendName} adivinó su carta (${jestState.rivalCard.word}). Tu carta era ${jestState.playerCard.word}.`;
      updateThreeVerdictFloatingBanner('🏁 RIVAL WINS THE DUEL', loseMsg);
      if (jestState.friendId && typeof global.registerRelationshipGamePlayed === 'function') {
        try {
          global.registerRelationshipGamePlayed(jestState.friendId, 'jest');
        } catch (_) {}
      }
    }

    broadcastJestRoomEvent({
      type: 'match_finished',
      winner: winnerSide,
      playerCard: jestState.playerCard,
      rivalCard: jestState.rivalCard
    });
  }

  // ==========================================================================
  // 9. SINCRONIZACIÓN MULTIJUGADOR (BroadcastChannel + /api/jest/room + localStorage)
  // ==========================================================================
  function connectMultiplayerRoom(roomCode) {
    const cleanCode = String(roomCode || 'JEST-101').trim().toUpperCase();
    jestState.roomCode = cleanCode;

    if (jestState.broadcastChannel) {
      try { jestState.broadcastChannel.close(); } catch (_) {}
    }

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('mastereng_jest_' + cleanCode);
        bc.onmessage = function (ev) {
          const data = ev.data;
          if (!data) return;
          if (data.type === 'question_verdict') {
            appendTurnLogEntry(data.actor || '👥 Rival', data.question, data.verdict);
            updateThreeVerdictFloatingBanner(data.verdict, `${data.actor}: "${data.question}"`);
          } else if (data.type === 'sync_cards' && data.rivalCard) {
            jestState.rivalCard = data.rivalCard;
            updateThreeForeheadSprites();
          }
        };
        jestState.broadcastChannel = bc;
      } catch (_) {}
    }

    // Persistir en localStorage y sincronizar con /api/jest/room
    const roomPayload = {
      roomCode: cleanCode,
      topic: jestState.topic,
      friendId: jestState.friendId,
      friendName: jestState.friendName,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem('mastereng_jest_room_' + cleanCode, JSON.stringify(roomPayload));
    } catch (_) {}

    if (typeof fetch === 'function') {
      fetch('/api/jest/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomPayload)
      }).catch(() => {});
    }
  }

  function broadcastJestRoomEvent(payload) {
    if (jestState.broadcastChannel) {
      try {
        jestState.broadcastChannel.postMessage(payload);
      } catch (_) {}
    }
    if (jestState.roomCode) {
      try {
        localStorage.setItem(
          'mastereng_jest_event_' + jestState.roomCode,
          JSON.stringify(Object.assign({}, payload, { roomCode: jestState.roomCode }))
        );
      } catch (_) {}
    }
  }

  // ==========================================================================
  // 10. INICIO DE PARTIDA, SELECCIÓN DE CARTAS Y EVENTOS DE INTERFAZ
  // ==========================================================================
  function pickCardsForTopic(topicName) {
    const filtered = JEST_CARDS_DB.filter(c => c.topic === topicName);
    const pool = filtered.length >= 2 ? filtered : JEST_CARDS_DB;
    const firstIdx = Math.floor(Math.random() * pool.length);
    let secondIdx = Math.floor(Math.random() * pool.length);
    if (secondIdx === firstIdx) {
      secondIdx = (firstIdx + 1) % pool.length;
    }
    return {
      playerCard: pool[firstIdx],
      rivalCard: pool[secondIdx]
    };
  }

  function startJestMatch(options = {}) {
    if (options.topic && JEST_TOPICS.includes(options.topic)) {
      jestState.topic = options.topic;
    }
    if (options.mode) {
      jestState.mode = options.mode;
    }

    const picked = pickCardsForTopic(jestState.topic);
    jestState.playerCard = picked.playerCard;
    jestState.rivalCard = picked.rivalCard;
    jestState.isPlayerTurn = true;
    jestState.isGameOver = false;
    jestState.winner = null;
    jestState.turnCount = 0;
    jestState.confirmedClues = [];

    renderConfirmedClues();
    updateThreeForeheadSprites();
    updateThreeVerdictFloatingBanner(
      '⚖️ AI REFEREE READY',
      `Tópico: ${jestState.topic} • ¡Pregunta Sí/No sobre tu carta!`
    );

    const rivalHeader = document.getElementById('jestRivalHeaderLabel');
    if (rivalHeader) {
      rivalHeader.textContent = `👀 FRENTE DE ${(jestState.friendName || 'RIVAL').toUpperCase()} (VISIBLE PARA TI)`;
    }

    const logEntries = document.getElementById('jestTurnLogEntries');
    if (logEntries) {
      logEntries.innerHTML = `
        <div class="jest-log-entry" style="color:#94a3b8;">
          Partida iniciada en <strong>${jestState.topic}</strong> contra <strong>${jestState.friendName}</strong>.
        </div>
      `;
    }

    const badge = document.getElementById('jestTurnIndicatorBadge');
    if (badge) badge.textContent = '🟢 Turno: TÚ (Jugador)';
  }

  function renderVocabularyHelperModal(filterText = '') {
    const listEl = document.getElementById('jestVocabHelperList');
    if (!listEl) return;
    const q = String(filterText || '').toLowerCase().trim();
    const items = VOCABULARY_HELPER_ITEMS.filter(item =>
      !q || item.es.toLowerCase().includes(q) || item.en.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );

    listEl.innerHTML = items.map(item => `
      <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(30,41,59,0.75); padding:8px 12px; border-radius:8px; border:1px solid rgba(148,163,184,0.2);">
        <div>
          <div style="font-size:0.78rem; color:#94a3b8;">${item.category} • ${item.es}</div>
          <div style="font-size:0.9rem; font-weight:700; color:#38bdf8;">${item.en}</div>
        </div>
        <button type="button" class="jest-btn jest-btn-ghost jest-use-vocab-btn" data-vocab-en="${item.en}">
          Usar ✍️
        </button>
      </div>
    `).join('');

    listEl.querySelectorAll('.jest-use-vocab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const phrase = btn.getAttribute('data-vocab-en') || '';
        const inputEl = document.getElementById('jestQuestionInput');
        if (inputEl) {
          inputEl.value = phrase.includes('?') ? phrase.split('/')[0].trim() : `Am I ${phrase.split('/')[0].trim()}?`;
          renderEditableWordChips(inputEl.value);
          inputEl.focus();
        }
        const modal = document.getElementById('jestVocabHelperModal');
        if (modal) modal.classList.add('hidden');
      });
    });
  }

  function openGuessCharacterModal() {
    const modal = document.getElementById('jestGuessModal');
    const quickContainer = document.getElementById('jestGuessQuickCards');
    const guessInput = document.getElementById('jestFinalGuessInput');
    if (!modal) return;
    modal.classList.remove('hidden');

    if (guessInput) {
      guessInput.value = '';
      guessInput.focus();
    }

    if (quickContainer) {
      const topicCards = JEST_CARDS_DB.filter(c => c.topic === jestState.topic);
      quickContainer.innerHTML = topicCards.map(c => `
        <button type="button" class="jest-btn jest-btn-ghost jest-quick-guess-card" data-guess-word="${c.word}">
          ${c.icon} ${c.word}
        </button>
      `).join('');

      quickContainer.querySelectorAll('.jest-quick-guess-card').forEach(btn => {
        btn.addEventListener('click', () => {
          if (guessInput) guessInput.value = btn.getAttribute('data-guess-word') || '';
        });
      });
    }
  }

  async function submitFinalCharacterGuess() {
    const guessInput = document.getElementById('jestFinalGuessInput');
    const modal = document.getElementById('jestGuessModal');
    const rawGuess = String((guessInput && guessInput.value) || '').trim();
    if (!rawGuess) return;

    if (modal) modal.classList.add('hidden');

    const questionForm = `Am I ${rawGuess}?`;
    const target = jestState.playerCard;
    const isCorrect = target && (
      rawGuess.toLowerCase() === target.word.toLowerCase() ||
      target.word.toLowerCase().includes(rawGuess.toLowerCase()) ||
      rawGuess.toLowerCase().includes(target.word.toLowerCase())
    );

    if (isCorrect) {
      await askJestJudgeAI(questionForm, target, true);
      handleMatchVictory('player');
    } else {
      appendTurnLogEntry('🧑 TÚ (Intento de Adivinar)', `Is my card ${rawGuess.toUpperCase()}?`, '❌ NO.');
      updateThreeVerdictFloatingBanner('❌ NO. WRONG GUESS!', `No eres ${rawGuess.toUpperCase()}. ¡Sigue preguntando!`);
      speakJudgeVerdict('No! That is not your card. Keep asking questions!');
      if (jestState.mode === 'ai') {
        triggerAIRivalTurn();
      }
    }
  }

  function bindJestEvents() {
    const modeSelect = document.getElementById('jestRivalModeSelect');
    const roomInput = document.getElementById('jestRoomCodeInput');
    const topicSelect = document.getElementById('jestTopicSelect');
    const newMatchBtn = document.getElementById('jestNewMatchBtn');
    const exitBtn = document.getElementById('jestExitBtn');
    const speakBtn = document.getElementById('jestSpeakQuestionBtn');
    const questionInput = document.getElementById('jestQuestionInput');
    const wordHelperBtn = document.getElementById('jestWordHelperBtn');
    const askJudgeBtn = document.getElementById('jestAskJudgeBtn');
    const guessBtn = document.getElementById('jestGuessCharacterBtn');

    if (modeSelect) {
      modeSelect.addEventListener('change', () => {
        jestState.mode = modeSelect.value;
        if (roomInput) {
          roomInput.style.display = (jestState.mode === 'room' || jestState.mode === 'friend') ? 'inline-block' : 'none';
        }
        if (jestState.mode === 'ai') {
          jestState.friendName = 'AI Rival Nexus';
          jestState.friendId = null;
        } else if (jestState.mode === 'friend' && !jestState.friendName) {
          jestState.friendName = 'Amigo del Chat';
        } else if (jestState.mode === 'room') {
          const code = (roomInput && roomInput.value) || 'JEST-' + Math.floor(100 + Math.random() * 900);
          if (roomInput) roomInput.value = code;
          jestState.friendName = `Sala ${code}`;
          connectMultiplayerRoom(code);
        }
        startJestMatch({ mode: jestState.mode });
      });
    }

    if (roomInput) {
      roomInput.addEventListener('change', () => {
        if (roomInput.value.trim()) {
          connectMultiplayerRoom(roomInput.value.trim());
        }
      });
    }

    if (topicSelect) {
      topicSelect.addEventListener('change', () => {
        jestState.topic = topicSelect.value;
        startJestMatch({ topic: jestState.topic });
      });
    }

    if (newMatchBtn) {
      newMatchBtn.addEventListener('click', () => {
        startJestMatch();
      });
    }

    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        closeJestGameView();
      });
    }

    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        startSpeechQuestionCapture();
      });
    }

    if (questionInput) {
      questionInput.addEventListener('input', () => {
        renderEditableWordChips(questionInput.value);
      });
      questionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (askJudgeBtn) askJudgeBtn.click();
        }
      });
    }

    if (wordHelperBtn) {
      wordHelperBtn.addEventListener('click', () => {
        const modal = document.getElementById('jestVocabHelperModal');
        if (modal) {
          modal.classList.remove('hidden');
          renderVocabularyHelperModal('');
        }
      });
    }

    const closeVocabBtn = document.getElementById('jestCloseVocabModalBtn');
    if (closeVocabBtn) {
      closeVocabBtn.addEventListener('click', () => {
        const modal = document.getElementById('jestVocabHelperModal');
        if (modal) modal.classList.add('hidden');
      });
    }

    const vocabSearchInput = document.getElementById('jestVocabSearchInput');
    if (vocabSearchInput) {
      vocabSearchInput.addEventListener('input', () => {
        renderVocabularyHelperModal(vocabSearchInput.value);
      });
    }

    if (askJudgeBtn) {
      askJudgeBtn.addEventListener('click', async () => {
        if (!questionInput) return;
        const qText = questionInput.value.trim();
        if (!qText) {
          updateThreeVerdictFloatingBanner(
            '⚠️ Solo se permiten preguntas de Sí o No (Ej: Am I an animal? Do I have wings?)',
            'Escribe o dicta tu pregunta antes de enviar.'
          );
          return;
        }
        await askJestJudgeAI(qText, jestState.playerCard, true);
        if (!jestState.isGameOver && jestState.mode === 'ai' && isYesNoQuestionFormat(qText)) {
          triggerAIRivalTurn();
        }
      });
    }

    if (guessBtn) {
      guessBtn.addEventListener('click', () => {
        openGuessCharacterModal();
      });
    }

    const closeGuessBtn = document.getElementById('jestCloseGuessModalBtn');
    if (closeGuessBtn) {
      closeGuessBtn.addEventListener('click', () => {
        const modal = document.getElementById('jestGuessModal');
        if (modal) modal.classList.add('hidden');
      });
    }

    const submitGuessBtn = document.getElementById('jestSubmitFinalGuessBtn');
    if (submitGuessBtn) {
      submitGuessBtn.addEventListener('click', () => {
        submitFinalCharacterGuess();
      });
    }

    const bypassBtn = document.getElementById('jestBypassRotateBtn');
    if (bypassBtn) {
      bypassBtn.onclick = dismissJestRotateOverlay;
    }
  }

  function checkJestOrientation() {
    const overlay = document.getElementById('jestRotateDeviceOverlay');
    if (!overlay) return;
    if (!jestState.isOpen || jestState.bypassOrientation) {
      overlay.style.display = 'none';
      return;
    }
    const isPortraitMobile = (window.innerWidth < window.innerHeight && window.innerWidth < 900);
    if (isPortraitMobile) {
      overlay.style.display = 'flex';
    } else {
      overlay.style.display = 'none';
    }
  }

  function dismissJestRotateOverlay() {
    jestState.bypassOrientation = true;
    const overlay = document.getElementById('jestRotateDeviceOverlay');
    if (overlay) overlay.style.display = 'none';
  }

  window.addEventListener('resize', () => {
    if (jestState.isOpen) checkJestOrientation();
  });
  window.addEventListener('orientationchange', () => {
    if (jestState.isOpen) setTimeout(checkJestOrientation, 100);
  });

  function forceJestLandscapeNow() {
    jestState.bypassOrientation = false;
    try {
      if (typeof window !== 'undefined' && window.AndroidBridge && typeof window.AndroidBridge.setScreenOrientation === 'function') {
        window.AndroidBridge.setScreenOrientation('landscape');
      }
    } catch (_) {}
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    } catch (_) {}
    setTimeout(() => {
      if (window.innerHeight > window.innerWidth) {
        jestState.bypassOrientation = true;
      }
      checkJestOrientation();
    }, 240);
  }
  global.forceJestLandscapeNow = forceJestLandscapeNow;

  // ==========================================================================
  // 11. APERTURA Y CIERRE DE LA VISTA (#view-jest-game) + INVITACIONES DE CHAT
  // ==========================================================================
  function openJestGameView(inviteOptions = null) {
    try {
      if (typeof window !== 'undefined' && window.AndroidBridge && typeof window.AndroidBridge.setScreenOrientation === 'function') {
        window.AndroidBridge.setScreenOrientation('landscape');
      }
    } catch (_) {}
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }

    const container = ensureJestDOM();
    container.classList.remove('hidden');
    container.style.display = 'flex';
    jestState.isOpen = true;
    jestState.bypassOrientation = false;

    checkJestOrientation();
    setTimeout(checkJestOrientation, 200);

    const modeSelect = document.getElementById('jestRivalModeSelect');
    const topicSelect = document.getElementById('jestTopicSelect');
    const roomInput = document.getElementById('jestRoomCodeInput');

    if (inviteOptions && typeof inviteOptions === 'object') {
      if (inviteOptions.topic && JEST_TOPICS.includes(inviteOptions.topic)) {
        jestState.topic = inviteOptions.topic;
        if (topicSelect) topicSelect.value = inviteOptions.topic;
      }
      if (inviteOptions.friendId || inviteOptions.friendName || inviteOptions.roomCode) {
        jestState.mode = inviteOptions.friendId ? 'friend' : 'room';
        jestState.friendId = inviteOptions.friendId || null;
        jestState.friendName = inviteOptions.friendName || `Sala ${inviteOptions.roomCode || '1vs1'}`;
        jestState.roomCode = inviteOptions.roomCode || ('JEST-' + (inviteOptions.friendId || '101'));

        if (modeSelect) modeSelect.value = jestState.mode;
        if (roomInput) {
          roomInput.style.display = 'inline-block';
          roomInput.value = jestState.roomCode;
        }
        connectMultiplayerRoom(jestState.roomCode);
      }
    } else {
      jestState.mode = (modeSelect && modeSelect.value) || 'ai';
      jestState.friendName = jestState.mode === 'ai' ? 'AI Rival Nexus' : jestState.friendName;
    }

    startJestMatch({ topic: jestState.topic, mode: jestState.mode });

    setTimeout(() => {
      initJestThreeScene();
      updateThreeForeheadSprites();
    }, 40);

    return container;
  }

  function closeJestGameView() {
    jestState.isOpen = false;
    try {
      if (typeof window !== 'undefined' && window.AndroidBridge && typeof window.AndroidBridge.setScreenOrientation === 'function') {
        window.AndroidBridge.setScreenOrientation('sensor');
      }
    } catch (_) {}
    if (screen.orientation && screen.orientation.unlock) {
      try { screen.orientation.unlock(); } catch (_) {}
    }
    const overlay = document.getElementById('jestRotateDeviceOverlay');
    if (overlay) overlay.style.display = 'none';

    if (jestState.three.animFrameId) {
      cancelAnimationFrame(jestState.three.animFrameId);
      jestState.three.animFrameId = null;
    }
    if (jestState.recognition && jestState.isListening) {
      try { jestState.recognition.stop(); } catch (_) {}
      jestState.isListening = false;
    }
    const container = document.getElementById('view-jest-game');
    if (container) {
      container.classList.add('hidden');
      container.style.display = 'none';
    }
    if (typeof window !== 'undefined' && typeof window.navigateTo === 'function') {
      try { window.navigateTo('view-home'); } catch (_) {}
    }
  }

  // Exposición global en window
  global.JEST_TOPICS = JEST_TOPICS;
  global.JEST_CARDS_DB = JEST_CARDS_DB;
  global.openJestGameView = openJestGameView;
  global.closeJestGameView = closeJestGameView;
  global.askJestJudgeAI = askJestJudgeAI;
  global.startJestMatch = startJestMatch;
  global.checkJestOrientation = checkJestOrientation;
  global.dismissJestRotateOverlay = dismissJestRotateOverlay;
  global.JestGame3D = {
    open: openJestGameView,
    close: closeJestGameView,
    askJudge: askJestJudgeAI,
    startMatch: startJestMatch,
    getState: () => jestState,
    cards: JEST_CARDS_DB,
    topics: JEST_TOPICS
  };
})(typeof window !== 'undefined' ? window : globalThis);

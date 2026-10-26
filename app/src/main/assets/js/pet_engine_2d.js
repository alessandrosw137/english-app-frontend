/**
 * ============================================================================
 * MasterENG - 2D Papercraft Virtual Pet & Caretaker English Learning Engine
 * Archivo: js/pet_engine_2d.js
 *
 * Motor interactivo 2D con estética de Recortes de Cartón y Papel Texturizado
 * (estilo Yoshi's Crafted World / Paper Mario + Pou).
 * Cuidado de mascotas paso a paso mientras se aprende vocabulario real de
 * crianza, cuidado diario y etapas de crecimiento en inglés.
 * ============================================================================
 */

(function (global) {
  'use strict';

  // ============================================================================
  // 1. DICCIONARIO PEDAGÓGICO DE CRIANZA Y CUIDADO (CARE VOCABULARY)
  // ============================================================================

  const CARE_VOCABULARY = [
    // Verbos de Crianza (Care Verbs)
    {
      id: 'verb_swaddle',
      term: 'to swaddle',
      ipa: '/tə ˈswɑː.dəl/',
      es: 'envolver con una manta / arropar como recién nacido',
      category: 'Care Verb',
      example: 'Swaddle the baby newborn snugly so she feels safe and cozy.',
      quiz: {
        question: 'Your baby pet is cold and restless. What care verb means to wrap them snugly in a soft blanket?',
        options: ['to swaddle', 'to scrub', 'to tickle', 'to discard'],
        correct: 0,
        tip: 'Think of a cozy swaddle blanket wrapped around a baby.'
      }
    },
    {
      id: 'verb_burp',
      term: 'to burp',
      ipa: '/tə bɝːp/',
      es: 'hacer eructar al bebé después de comer',
      category: 'Care Verb',
      example: 'Gently pat the baby on the back to burp him after feeding.',
      quiz: {
        question: 'The baby pet just finished drinking warm milk. What action helps release trapped air from the stomach?',
        options: ['to burp', 'to freeze', 'to swallow', 'to sprint'],
        correct: 0,
        tip: 'A gentle pat on the back helps them burp!'
      }
    },
    {
      id: 'verb_feed',
      term: 'to feed',
      ipa: '/tə fiːd/',
      es: 'alimentar / dar de comer',
      category: 'Care Verb',
      example: 'It is lunchtime; let us feed the hungry crocodile fresh fruit.',
      quiz: {
        question: 'Your pet’s belly is rumbling and hunger is low. Which verb describes giving nutritious food?',
        options: ['to feed', 'to paint', 'to bathe', 'to tuck in'],
        correct: 0,
        tip: 'To feed means to provide food and nutrients.'
      }
    },
    {
      id: 'verb_bathe',
      term: 'to bathe',
      ipa: '/tə beɪð/',
      es: 'bañar / dar un baño relajante',
      category: 'Care Verb',
      example: 'Fill the cardboard tub with warm water to bathe your pet.',
      quiz: {
        question: 'Your pet has been playing all day and needs a warm soapy wash. Which verb means to give a bath?',
        options: ['to bathe', 'to starve', 'to disturb', 'to frighten'],
        correct: 0,
        tip: 'To bathe means washing in water with soap and bubbles.'
      }
    },
    {
      id: 'verb_scrub',
      term: 'to scrub',
      ipa: '/tə skrʌb/',
      es: 'tallar / frotar vigorosamente para limpiar',
      category: 'Care Verb',
      example: 'Use the soft sponge to scrub away the stubborn mud spots.',
      quiz: {
        question: 'There are sticky mud stains on your rhinoceros. What care verb describes rubbing with a sponge to clean?',
        options: ['to scrub', 'to stain', 'to drop', 'to ignore'],
        correct: 0,
        tip: 'Scrubbing removes dirt and stains.'
      }
    },
    {
      id: 'verb_soothe',
      term: 'to soothe',
      ipa: '/tə suːð/',
      es: 'calmar / tranquilizar al bebé inquieto',
      category: 'Care Verb',
      example: 'Gently stroke your pet’s head to soothe his anxiety.',
      quiz: {
        question: 'Your pet is crying from a tantrum. Which verb means to comfort and make them calm?',
        options: ['to soothe', 'to scream', 'to startle', 'to ignite'],
        correct: 0,
        tip: 'To soothe means to bring comfort and tranquility.'
      }
    },
    {
      id: 'verb_tuck_in',
      term: 'to tuck in',
      ipa: '/tə tʌk ɪn/',
      es: 'arropar en la cama / meter las cobijas con cariño',
      category: 'Care Verb',
      example: 'Tuck him into his cardboard bed and wish him sweet dreams.',
      quiz: {
        question: 'Your pet is drowsy and in bed. What phrase describes pulling the cozy blanket over them?',
        options: ['to tuck in', 'to wake up', 'to spill', 'to kick out'],
        correct: 0,
        tip: 'Tucking in keeps someone warm and secure in bed.'
      }
    },
    {
      id: 'verb_praise',
      term: 'to praise',
      ipa: '/tə preɪz/',
      es: 'elogiar / felicitar con orgullo',
      category: 'Care Verb',
      example: 'Always praise good behavior with sweet words and encouragement.',
      quiz: {
        question: 'Your pet learned a new English word! How do you express approval and admiration?',
        options: ['to praise', 'to scold', 'to tease', 'to neglect'],
        correct: 0,
        tip: 'Praise builds confidence and joy.'
      }
    },
    {
      id: 'verb_heal',
      term: 'to heal',
      ipa: '/tə hiːl/',
      es: 'curar / sanar heridas o malestares',
      category: 'Care Verb',
      example: 'Apply soothing ointment to heal the little scratch quickly.',
      quiz: {
        question: 'Your pet has a minor scrape. Which verb means restoring good health and curing?',
        options: ['to heal', 'to injure', 'to break', 'to worsen'],
        correct: 0,
        tip: 'To heal is to become healthy and sound again.'
      }
    },
    {
      id: 'verb_raise',
      term: 'to raise',
      ipa: '/tə reɪz/',
      es: 'criar / educar desde pequeño hasta la adultez',
      category: 'Care Verb',
      example: 'Raising a baby pet requires patience, responsibility, and love.',
      quiz: {
        question: 'What verb describes caring for a child or young pet until they grow into adulthood?',
        options: ['to raise', 'to abandon', 'to shrink', 'to forget'],
        correct: 0,
        tip: 'Raising someone means nurturing their growth over time.'
      }
    },
    {
      id: 'verb_nurture',
      term: 'to nurture',
      ipa: '/tə ˈnɝː.tʃɚ/',
      es: 'nutrir / fomentar el desarrollo integral con amor',
      category: 'Care Verb',
      example: 'Nurture their curiosity by reading bedtime stories in English.',
      quiz: {
        question: 'Which word means caring for and encouraging the healthy growth and development of someone?',
        options: ['to nurture', 'to harm', 'to starve', 'to ignore'],
        correct: 0,
        tip: 'Nurturing combines emotional warmth with physical care.'
      }
    },

    // Sustantivos y Estados (Nouns & States)
    {
      id: 'noun_bottle',
      term: 'baby bottle',
      ipa: '/ˈbeɪ.bi ˈbɑː.t̬əl/',
      es: 'biberón / mamila',
      category: 'Noun & Gear',
      example: 'Fill the baby bottle with warm formula milk for breakfast.',
      quiz: {
        question: 'What container with a rubber nipple is used to feed milk to baby pets?',
        options: ['baby bottle', 'frying pan', 'watering can', 'teacup'],
        correct: 0,
        tip: 'Baby bottle holds milk or formula.'
      }
    },
    {
      id: 'noun_bib',
      term: 'bib',
      ipa: '/bɪb/',
      es: 'babero de tela o papel para no mancharse',
      category: 'Noun & Gear',
      example: 'Fasten the paper bib around his neck before serving the porridge.',
      quiz: {
        question: 'What cloth or paper shield is tied around a baby’s neck to keep clothes clean while eating?',
        options: ['bib', 'scarf', 'belt', 'shoelace'],
        correct: 0,
        tip: 'A bib protects clothing from food spills.'
      }
    },
    {
      id: 'noun_pacifier',
      term: 'pacifier',
      ipa: '/ˈpæs.ə.faɪ.ɚ/',
      es: 'chupón / chupete tranquilizador',
      category: 'Noun & Gear',
      example: 'Give the crying baby her pacifier to help her calm down.',
      quiz: {
        question: 'What soothing rubber or silicone device do babies suck on for comfort?',
        options: ['pacifier', 'whistle', 'sunglasses', 'eraser'],
        correct: 0,
        tip: 'A pacifier pacifies and comforts an upset baby.'
      }
    },
    {
      id: 'noun_ointment',
      term: 'ointment',
      ipa: '/ˈɔɪnt.mənt/',
      es: 'pomada medicinal / ungüento curativo',
      category: 'Noun & Gear',
      example: 'Gently rub healing ointment over the little rash.',
      quiz: {
        question: 'What smooth medicinal cream is applied to skin to relieve irritation and heal?',
        options: ['ointment', 'vinegar', 'pepper', 'perfume'],
        correct: 0,
        tip: 'Ointment is a healing medicinal salve.'
      }
    },
    {
      id: 'noun_thermometer',
      term: 'thermometer',
      ipa: '/θɚˈmɑː.mə.t̬ɚ/',
      es: 'termómetro para medir la temperatura corporal',
      category: 'Noun & Gear',
      example: 'Check the digital thermometer to see if your pet has a fever.',
      quiz: {
        question: 'Your pet feels uncomfortably hot. Which medical tool measures body temperature?',
        options: ['thermometer', 'calculator', 'compass', 'telescope'],
        correct: 0,
        tip: 'A thermometer detects fevers.'
      }
    },
    {
      id: 'noun_lullaby',
      term: 'lullaby',
      ipa: '/ˈlʌl.ə.baɪ/',
      es: 'canción de cuna suave para dormir',
      category: 'Noun & Gear',
      example: 'Sing a gentle lullaby to help your pet drift into sweet sleep.',
      quiz: {
        question: 'What quiet, melodic song is sung to soothe children and pets to sleep?',
        options: ['lullaby', 'rock concert', 'siren', 'parade march'],
        correct: 0,
        tip: 'A lullaby is sweet, soft, and sleep-inducing.'
      }
    },
    {
      id: 'state_tantrum',
      term: 'tantrum',
      ipa: '/ˈtæn.trəm/',
      es: 'berrinche / rabieta por frustración',
      category: 'State & Mood',
      example: 'When tired, toddlers often throw a little temper tantrum.',
      quiz: {
        question: 'What word describes an emotional outburst of anger and crying when a baby is frustrated?',
        options: ['tantrum', 'celebration', 'nap', 'whisper'],
        correct: 0,
        tip: 'Tantrums happen when little ones are overwhelmed.'
      }
    },
    {
      id: 'state_famished',
      term: 'famished',
      ipa: '/ˈfæm.ɪʃt/',
      es: 'hambriento / con mucha hambre',
      category: 'State & Mood',
      example: 'After a long play session, the baby panda is completely famished.',
      quiz: {
        question: 'If your pet hasn’t eaten for hours and is extremely hungry, which advanced adjective describes them?',
        options: ['famished', 'bloated', 'satisfied', 'indifferent'],
        correct: 0,
        tip: 'Famished means intensely hungry.'
      }
    },
    {
      id: 'state_drowsy',
      term: 'drowsy',
      ipa: '/ˈdraʊ.zi/',
      es: 'soñoliento / adormilado / cabeceando de sueño',
      category: 'State & Mood',
      example: 'His heavy eyelids show he is very drowsy and ready for bed.',
      quiz: {
        question: 'Your pet is yawning and rubbing his eyes. What word means sleepy and lethargic?',
        options: ['drowsy', 'hyperactive', 'panicked', 'athletic'],
        correct: 0,
        tip: 'Drowsy means on the verge of falling asleep.'
      }
    },
    {
      id: 'state_spotless',
      term: 'spotless',
      ipa: '/ˈspɑːt.ləs/',
      es: 'impecable / completamente limpio sin una sola mancha',
      category: 'State & Mood',
      example: 'After a thorough scrub and rinse, the puppy is completely spotless.',
      quiz: {
        question: 'All the mud has been scrubbed away and your pet is shining clean. What adjective means totally clean?',
        options: ['spotless', 'filthy', 'greasy', 'muddy'],
        correct: 0,
        tip: 'Spotless means without a single dirty spot.'
      }
    },
    {
      id: 'state_well_nourished',
      term: 'well-nourished',
      ipa: '/ˌwel ˈnɝː.ɪʃt/',
      es: 'bien alimentado y nutrido',
      category: 'State & Mood',
      example: 'A diet with vitamins and fresh fruit keeps baby animals well-nourished.',
      quiz: {
        question: 'Which phrase means provided with plenty of healthy, balanced food for growth?',
        options: ['well-nourished', 'undisciplined', 'parched', 'dehydrated'],
        correct: 0,
        tip: 'Well-nourished means receiving proper nutrition.'
      }
    },
    {
      id: 'state_fretful',
      term: 'fretful',
      ipa: '/ˈfret.fəl/',
      es: 'inquieto / irritable / quejumbroso',
      category: 'State & Mood',
      example: 'Teething can make even the happiest baby feel fretful.',
      quiz: {
        question: 'What word describes feeling irritable, restless, and prone to whining?',
        options: ['fretful', 'serene', 'cheerful', 'patient'],
        correct: 0,
        tip: 'Fretful babies need extra soothing and love.'
      }
    }
  ];

  // ============================================================================
  // 2. ESPECIES Y SUS HÁBITATS DE CARTÓN RECORTADO
  // ============================================================================

  const SPECIES_DATA = {
    crocodile: {
      id: 'crocodile',
      name: 'Crocodile',
      es: 'Cocodrilo del Pantano',
      baseColor: '#65a30d',
      bellyColor: '#bef264',
      accentColor: '#365314',
      eyeColor: '#facc15',
      habitatName: 'Papercraft Marshland',
      habitatDesc: 'Pantano de cartón con juncos de papel kraft, nenúfares recortados y agua brillante.',
      favoriteFood: 'Fresh Pond Fish',
      favoriteToy: 'Rubber Duckling',
      soundType: 'hiss_purr'
    },
    rhinoceros: {
      id: 'rhinoceros',
      name: 'Rhinoceros',
      es: 'Rinoceronte de la Sabana',
      baseColor: '#78716c',
      bellyColor: '#d6d3d1',
      accentColor: '#44403c',
      eyeColor: '#38bdf8',
      habitatName: 'Cardboard Savannah',
      habitatDesc: 'Sabana de cartón con acacias recortadas, hierba de papel estraza y sol corrugado.',
      favoriteFood: 'Crisp Lettuce Leaves',
      favoriteToy: 'Heavy Rolling Rock',
      soundType: 'snort_grunt'
    },
    dog: {
      id: 'dog',
      name: 'Dog',
      es: 'Cachorrito Fiel',
      baseColor: '#d97706',
      bellyColor: '#fde68a',
      accentColor: '#92400e',
      eyeColor: '#451a03',
      habitatName: 'Cardboard Backyard',
      habitatDesc: 'Patio trasero de cartón con cerca de palitos de helado, casita y flores de botón.',
      favoriteFood: 'Chewy Dog Biscuits',
      favoriteToy: 'Bouncy Tennis Ball',
      soundType: 'bark_woof'
    },
    cat: {
      id: 'cat',
      name: 'Cat',
      es: 'Gatito Curioso',
      baseColor: '#f59e0b',
      bellyColor: '#fef3c7',
      accentColor: '#b45309',
      eyeColor: '#10b981',
      habitatName: 'Cozy Cardboard Parlor',
      habitatDesc: 'Sala de cartón con ovillo de estambre colgante, rascador corrugado y cojines.',
      favoriteFood: 'Salmon Cream Paste',
      favoriteToy: 'Yarn Ball on String',
      soundType: 'meow_purr'
    },
    axolotl: {
      id: 'axolotl',
      name: 'Axolotl',
      es: 'Ajolote Mágico',
      baseColor: '#f472b6',
      bellyColor: '#fce7f3',
      accentColor: '#db2777',
      eyeColor: '#1e1b4b',
      habitatName: 'Cellophane Lagoon',
      habitatDesc: 'Laguna submarina de cartón con algas de papel rizado y burbujas de botón.',
      favoriteFood: 'Micro Krill Jelly',
      favoriteToy: 'Floating Crystal Bubble',
      soundType: 'bubble_squeak'
    },
    red_panda: {
      id: 'red_panda',
      name: 'Red Panda',
      es: 'Panda Rojo de Montaña',
      baseColor: '#ea580c',
      bellyColor: '#ffedd5',
      accentColor: '#9a3412',
      eyeColor: '#7c2d12',
      habitatName: 'Bamboo Paper Forest',
      habitatDesc: 'Bosque de bambú de cartón con cañas plegadas, hojas verdes y farolitos colgantes.',
      favoriteFood: 'Tender Bamboo Shoots',
      favoriteToy: 'Pinecone on Cord',
      soundType: 'whistle_chirp'
    }
  };

  // ============================================================================
  // 3. ETAPAS DE MADUREZ (4 LIFE STAGES - DE CASIMERITO A ADULTO)
  // ============================================================================

  const LIFE_STAGES = [
    {
      stage: 1,
      name: 'Newborn Baby',
      es: 'Bebé Recién Nacido',
      levelMin: 1,
      levelMax: 3,
      minXp: 0,
      scale: 0.65,
      headScale: 1.28,
      voicePitch: 1.6,
      accessory: 'Baby Pacifier & Diaper',
      needs: 'Baby Bottle, Porridge & Swaddle',
      desc: 'Bebé diminuto con pañal de papel, chupón y ojitos gigantes llenos de curiosidad.'
    },
    {
      stage: 2,
      name: 'Curious Toddler',
      es: 'Pequeño Curioso',
      levelMin: 4,
      levelMax: 7,
      minXp: 300,
      scale: 0.85,
      headScale: 1.15,
      voicePitch: 1.3,
      accessory: 'Embroidered Bib & Ball',
      needs: 'First Words & Playtime',
      desc: 'Peques juguetones que gatean con su babero puesto y balbucean palabras en inglés.'
    },
    {
      stage: 3,
      name: 'Teen Explorer',
      es: 'Joven Explorador',
      levelMin: 8,
      levelMax: 12,
      minXp: 700,
      scale: 1.0,
      headScale: 1.0,
      voicePitch: 1.0,
      accessory: 'Headphones & Varsity Scarf',
      needs: 'Complex English & Outdoor Sports',
      desc: 'Joven enérgico listo para aventuras, con audífonos y preguntas de vocabulario avanzadas.'
    },
    {
      stage: 4,
      name: 'Master Adult',
      es: 'Adulto Sabio',
      levelMin: 13,
      levelMax: 99,
      minXp: 1200,
      scale: 1.18,
      headScale: 0.92,
      voicePitch: 0.85,
      accessory: 'Golden Cardboard Crown',
      needs: 'Advanced Mastery & Wisdom',
      desc: 'Mascota majestuosa con corona dorada de cartón, vocabulario fluido y porte sabio.'
    }
  ];

  // ============================================================================
  // 4. CLOSET Y TIENDA DE OUTFITS ESTILO POU (PAPERCRAFT CLOSET)
  // ============================================================================

  const CLOSET_CATALOG = {
    hats: [
      { id: 'none', name: 'Sin Sombrero', es: 'Sin accesorio', icon: '❌', price: 0 },
      { id: 'hat_baseball', name: 'Baseball Cap', es: 'Gorra deportiva roja/azul', icon: '🧢', price: 25 },
      { id: 'hat_bonnet', name: 'Baby Bonnet', es: 'Gorrito tierno de recién nacido', icon: '👶', price: 20 },
      { id: 'hat_top', name: 'Top Hat', es: 'Sombrero de copa británico', icon: '🎩', price: 40 },
      { id: 'hat_crown', name: 'Royal Crown', es: 'Corona real dorada (VIP)', icon: '👑', price: 80, isVip: true },
      { id: 'hat_helmet', name: 'Space Helmet', es: 'Casco espacial astronauta (VIP)', icon: '🪖', price: 100, isVip: true }
    ],
    glasses: [
      { id: 'none', name: 'Sin Lentes', es: 'Sin gafas', icon: '❌', price: 0 },
      { id: 'glasses_reading', name: 'Reading Glasses', es: 'Lentes redondos de estudio', icon: '👓', price: 25 },
      { id: 'glasses_cool', name: 'Cool Sunglasses', es: 'Gafas de sol oscuras retro', icon: '🕶️', price: 35 },
      { id: 'glasses_monocle', name: 'Aristocratic Monocle', es: 'Monóculo dorado con cadenita', icon: '🧐', price: 50 }
    ],
    outfits: [
      { id: 'none', name: 'Kraft Natural', es: 'Al natural (cartón kraft puro)', icon: '📦', price: 0 },
      { id: 'outfit_diaper', name: 'Baby Diaper', es: 'Pañal blanco con alfiler de seguridad', icon: '🧷', price: 15 },
      { id: 'outfit_bib', name: 'Baby Bib', es: 'Babero infantil bordado con huella', icon: '🍼', price: 20 },
      { id: 'outfit_scarf', name: 'Red Knit Scarf', es: 'Bufanda tejida roja abrigada', icon: '🧣', price: 30 },
      { id: 'outfit_bowtie', name: 'Black Bow Tie', es: 'Corbatín negro de gala', icon: '👔', price: 35 },
      { id: 'outfit_jacket', name: 'Varsity Jacket', es: 'Chaqueta universitaria deportiva', icon: '🧥', price: 60 },
      { id: 'outfit_cape', name: 'Hero Cape', es: 'Capa de superhéroe ondeante (VIP)', icon: '🦸', price: 75, isVip: true }
    ],
    skinColors: [
      { id: 'kraft', name: 'Kraft Natural', hex: '#caa778', price: 0, es: 'Cartón kraft tradicional' },
      { id: 'mint', name: 'Menta Pastel', hex: '#a7f3d0', price: 30, es: 'Tono menta suave y refrescante' },
      { id: 'pink', name: 'Rosa Bebé', hex: '#fbcfe8', price: 30, es: 'Rosa tierno estilo algodón' },
      { id: 'sky', name: 'Azul Cielo', hex: '#bae6fd', price: 30, es: 'Azul pastel brillante' },
      { id: 'lavender', name: 'Lavanda', hex: '#ddd6fe', price: 30, es: 'Púrpura suave relajante' },
      { id: 'cream', name: 'Crema Vainilla', hex: '#fef08a', price: 30, es: 'Tono pastel cálido' },
      { id: 'terracotta', name: 'Terracota', hex: '#fdba74', price: 30, es: 'Arcilla cálida y viva' },
      { id: 'emerald', name: 'Esmeralda', hex: '#65a30d', price: 30, es: 'Verde bosque vibrante' }
    ]
  };

  // ============================================================================
  // 5. TIENDA DE CARTÓN: ALIMENTOS Y POCIONES
  // ============================================================================

  const SHOP_CATALOG = {
    food: [
      { id: 'baby_formula', name: 'Baby Formula Milk', price: 10, hunger: 25, energy: 10, es: 'Fórmula Láctea Tibia', icon: '🍼', reqBurp: true },
      { id: 'apple_puree', name: 'Mashed Apple Puree', price: 15, hunger: 35, energy: 15, es: 'Puré Suave de Manzana', icon: '🍎' },
      { id: 'crisp_lettuce', name: 'Organic Green Salad', price: 18, hunger: 40, health: 10, es: 'Lechuga Fresca', icon: '🥬' },
      { id: 'bamboo_crunch', name: 'Bamboo Shoots Bowl', price: 25, hunger: 55, energy: 20, es: 'Brotes de Bambú', icon: '🎋' },
      { id: 'fish_crisps', name: 'Crispy Grilled Salmon', price: 30, hunger: 65, happiness: 15, es: 'Salmón Crujiente', icon: '🐟' },
      { id: 'golden_honey', name: 'Wild Flower Honey', price: 40, hunger: 70, energy: 35, es: 'Miel Dorada Silvestre', icon: '🍯' }
    ],
    potions: [
      { id: 'growth_elixir', name: 'Maturity Growth Elixir', price: 80, xpBonus: 120, es: 'Elixir de Crecimiento Rápido', icon: '🧪' },
      { id: 'instant_cleanse', name: 'Super Bubble Bath Bomb', price: 45, hygiene: 100, es: 'Bomba de Espuma Instantánea', icon: '🧼' },
      { id: 'energy_tonic', name: 'Vitality Energy Tonic', price: 50, energy: 100, es: 'Tónico Revitalizante', icon: '⚡' },
      { id: 'sweet_dreams', name: 'Dream Lullaby Draught', price: 60, energy: 100, happiness: 40, es: 'Poción de Dulces Sueños', icon: '🌙' }
    ],
    dressup: [
      { id: 'hat_crown', name: 'Cardboard Golden Crown', price: 0, isVip: false, slot: 'head', es: 'Corona de Cartón Dorado', icon: '👑' },
      { id: 'hat_bow', name: 'Red Felt Bow Tie', price: 30, isVip: false, slot: 'neck', es: 'Moño de Fieltro Rojo', icon: '🎀' },
      { id: 'hat_detective', name: 'Sherlock Detective Cap', price: 60, isVip: false, slot: 'head', es: 'Gorra de Detective', icon: '🕵️' },
      { id: 'hat_aviator', name: 'Vintage Aviator Goggles', price: 90, isVip: false, slot: 'head', es: 'Gafas de Aviador Antiguas', icon: '🥽' },
      { id: 'vip_tiara', name: 'Diamond Paper Tiara', price: 250, isVip: true, slot: 'head', es: 'Tiara de Diamantes de Papel [VIP]', icon: '💎' },
      { id: 'vip_cape', name: 'Royal Velvet & Gold Cape', price: 350, isVip: true, slot: 'back', es: 'Capa Real de Terciopelo y Oro [VIP]', icon: '🦸' },
      { id: 'vip_visor', name: 'Cyberpunk Neon Card Visor', price: 400, isVip: true, slot: 'head', es: 'Visor Neón Cyberpunk [VIP]', icon: '🕶️' }
    ]
  };

  // ============================================================================
  // 5. MOTOR DE AUDIO SINTETIZADO PROCEDURAL (WEB AUDIO API)
  // ============================================================================

  class PaperSfxEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
    }

    ensureContext() {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    playPaperRustle() {
      const ctx = this.ensureContext();
      if (!ctx || this.isMuted) return;

      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();
    }

    playPop() {
      const ctx = this.ensureContext();
      if (!ctx || this.isMuted) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.08);
    }

    playMunch() {
      const ctx = this.ensureContext();
      if (!ctx || this.isMuted) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';

      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.09);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.09);
    }

    playSqueak() {
      const ctx = this.ensureContext();
      if (!ctx || this.isMuted) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      osc.frequency.setValueAtTime(880, now);
      osc.frequency.linearRampToValueAtTime(1320, now + 0.06);
      osc.frequency.linearRampToValueAtTime(990, now + 0.12);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.12);
    }

    playBurp() {
      const ctx = this.ensureContext();
      if (!ctx || this.isMuted) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(95, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.28);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.28);
    }

    playChime() {
      const ctx = this.ensureContext();
      if (!ctx || this.isMuted) return;

      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((f, idx) => {
        const start = ctx.currentTime + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    }

    playLullabyNote(freq = 523.25) {
      const ctx = this.ensureContext();
      if (!ctx || this.isMuted) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    }
  }

  // ============================================================================
  // 6. MOTOR DE RENDERIZADO 2D: RECORTE DE CARTÓN Y COSTURAS
  // ============================================================================

  class CardboardRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas && typeof canvas.getContext === 'function' ? canvas.getContext('2d') : null;
      this.time = 0;
      this.particles = [];
      this.soapBubbles = [];
      this.yarnBall = { x: 380, y: 340, vx: 0, vy: 0, radius: 24, isDragging: false };
    }

    resize(width, height) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = width;
      this.height = height;
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      this.ctx.resetTransform?.();
      this.ctx.scale(dpr, dpr);
    }

    // Dibujo con estética de recorte de cartón: relleno, sombra de cartón y puntadas
    drawStitchedCardboard(pathFn, fillColor = '#c29b68', strokeColor = '#f8fafc', elevation = 4) {
      const ctx = this.ctx;
      ctx.save();

      // Sombra de recorte (Drop-shadow de cartón grueso)
      ctx.shadowColor = 'rgba(28, 18, 12, 0.38)';
      ctx.shadowBlur = elevation * 2.2;
      ctx.shadowOffsetX = elevation * 0.5;
      ctx.shadowOffsetY = elevation * 0.9;

      ctx.beginPath();
      pathFn(ctx);
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Borde de cartón cortado con tijera
      ctx.shadowColor = 'transparent';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(78, 52, 32, 0.45)';
      ctx.stroke();

      // Costuras de hilo (Dashed Stitches)
      ctx.save();
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    }

    // Dibujo de hilo colgante oscilante
    drawHangingCord(x1, y1, x2, y2, angle = 0) {
      const ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = '#f4ecd8';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([2, 2]);

      const midX = (x1 + x2) / 2 + Math.sin(angle) * 12;
      const midY = (y1 + y2) / 2;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(midX, midY, x2, y2);
      ctx.stroke();

      // Pequeño botón/remache en el extremo
      ctx.beginPath();
      ctx.arc(x1, y1, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#b45309';
      ctx.fill();

      ctx.restore();
    }

    // Nubes recortadas estilo Yoshi's Crafted World
    drawPaperCloud(x, y, scale = 1.0) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      this.drawStitchedCardboard((c) => {
        c.moveTo(-60, 0);
        c.bezierCurveTo(-70, -25, -40, -45, -20, -35);
        c.bezierCurveTo(0, -60, 35, -50, 45, -30);
        c.bezierCurveTo(70, -25, 75, 10, 50, 20);
        c.bezierCurveTo(30, 35, -45, 35, -60, 0);
        c.closePath();
      }, '#f8fafc', '#94a3b8', 3);

      ctx.restore();
    }

    // Sol de cartón corrugado
    drawCardboardSun(x, y, scale = 1.0, rot = 0) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.rotate(rot);

      // Rayos triangulares de papel
      for (let r = 0; r < 8; r++) {
        ctx.save();
        ctx.rotate((r * Math.PI) / 4);
        this.drawStitchedCardboard((c) => {
          c.moveTo(-8, -35);
          c.lineTo(0, -58);
          c.lineTo(8, -35);
          c.closePath();
        }, '#f59e0b', '#fef08a', 2);
        ctx.restore();
      }

      // Disco central de cartón amarillo
      this.drawStitchedCardboard((c) => {
        c.arc(0, 0, 35, 0, Math.PI * 2);
      }, '#fbbf24', '#ffffff', 4);

      // Carita sonriente dibujada en crayón
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(-10, -5, 3.5, 0, Math.PI * 2);
      ctx.arc(10, -5, 3.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 5, 12, 0.2, Math.PI - 0.2);
      ctx.stroke();

      ctx.restore();
    }

    // --------------------------------------------------------------------------
    // RENDERIZADO DE HABITACIONES Y HÁBITATS
    // --------------------------------------------------------------------------

    renderRoomBackground(roomKey, speciesKey, isLightsOff = false) {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const t = this.time;

      ctx.clearRect(0, 0, w, h);

      // Fondo base de cartón artesanal
      ctx.fillStyle = isLightsOff ? '#0b1329' : '#e6d5b8';
      ctx.fillRect(0, 0, w, h);

      // Piso de cartón con textura de tablones
      const floorY = h * 0.72;
      ctx.fillStyle = isLightsOff ? '#060a17' : '#caa778';
      ctx.fillRect(0, floorY, w, h - floorY);

      // Líneas de tablones de madera dibujados
      ctx.strokeStyle = isLightsOff ? 'rgba(255,255,255,0.05)' : 'rgba(78, 52, 32, 0.25)';
      ctx.lineWidth = 2;
      for (let l = floorY + 28; l < h; l += 36) {
        ctx.beginPath();
        ctx.moveTo(0, l);
        ctx.lineTo(w, l);
        ctx.stroke();
      }

      // Hilos y nubes suspendidas del techo
      const swingAngle = Math.sin(t * 1.8) * 0.12;
      this.drawHangingCord(w * 0.22, 0, w * 0.22 + Math.sin(swingAngle) * 35, 75, swingAngle);
      this.drawPaperCloud(w * 0.22 + Math.sin(swingAngle) * 35, 80, 0.75);

      this.drawHangingCord(w * 0.78, 0, w * 0.78 - Math.sin(swingAngle) * 28, 65, -swingAngle);
      this.drawPaperCloud(w * 0.78 - Math.sin(swingAngle) * 28, 70, 0.65);

      // Elementos específicos según la habitación
      if (roomKey === 'nursery') {
        // Habitación 1: Guardería / Afecto
        // Móvil de cuna con luna y estrellas
        const mobileX = w * 0.5;
        this.drawHangingCord(mobileX, 0, mobileX, 90, swingAngle);
        this.drawStitchedCardboard((c) => {
          c.arc(mobileX, 105, 18, 0, Math.PI * 2);
        }, '#fde047', '#ffffff', 2);

        // Ventana de cartón con marco de madera
        this.drawStitchedCardboard((c) => {
          c.rect(w * 0.5 - 65, 120, 130, 110);
        }, '#38bdf8', '#ffffff', 2);

        // Cortinas de papel rizado
        this.drawStitchedCardboard((c) => {
          c.rect(w * 0.5 - 75, 115, 25, 120);
        }, '#f472b6', '#ffffff', 2);
        this.drawStitchedCardboard((c) => {
          c.rect(w * 0.5 + 50, 115, 25, 120);
        }, '#f472b6', '#ffffff', 2);

      } else if (roomKey === 'kitchen') {
        // Habitación 2: Cocina & Alimentación
        // Estante de cocina con tarros
        this.drawStitchedCardboard((c) => {
          c.rect(w * 0.15, 140, w * 0.7, 18);
        }, '#92400e', '#ffffff', 3);

        // Tarros de mermelada y frutas
        [w * 0.25, w * 0.4, w * 0.55, w * 0.7].forEach((jx, idx) => {
          this.drawStitchedCardboard((c) => {
            c.rect(jx - 14, 105, 28, 35);
          }, idx % 2 === 0 ? '#ef4444' : '#10b981', '#ffffff', 2);
        });

        // Reloj de cocina de cartón
        this.drawStitchedCardboard((c) => {
          c.arc(w * 0.5, 60, 26, 0, Math.PI * 2);
        }, '#ffffff', '#b45309', 2);

      } else if (roomKey === 'bath') {
        // Habitación 3: Baño y Aseo
        // Pared con azulejos de papel menta
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < w; x += 36) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, floorY);
          ctx.stroke();
        }

        // Tina de cartón recortado
        this.drawStitchedCardboard((c) => {
          c.moveTo(w * 0.2, floorY - 35);
          c.lineTo(w * 0.8, floorY - 35);
          c.quadraticCurveTo(w * 0.82, floorY + 45, w * 0.65, floorY + 45);
          c.lineTo(w * 0.35, floorY + 45);
          c.quadraticCurveTo(w * 0.18, floorY + 45, w * 0.2, floorY - 35);
          c.closePath();
        }, '#f8fafc', '#0284c7', 4);

        // Agua de celofán brillante ondulante
        ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.beginPath();
        ctx.moveTo(w * 0.24, floorY - 15);
        for (let wx = w * 0.24; wx <= w * 0.76; wx += 20) {
          ctx.lineTo(wx, floorY - 15 + Math.sin(t * 3.5 + wx * 0.05) * 4);
        }
        ctx.lineTo(w * 0.76, floorY + 25);
        ctx.lineTo(w * 0.24, floorY + 25);
        ctx.closePath();
        ctx.fill();

      } else if (roomKey === 'bedroom') {
        // Habitación 4: Dormitorio & Sueño
        // Ventana nocturna con luna creciente
        this.drawStitchedCardboard((c) => {
          c.arc(w * 0.5, 130, 48, 0, Math.PI * 2);
        }, isLightsOff ? '#020617' : '#0369a1', '#f8fafc', 2);

        // Luna sonriente
        this.drawStitchedCardboard((c) => {
          c.arc(w * 0.5 + 8, 125, 22, 0.5, Math.PI * 1.5);
          c.quadraticCurveTo(w * 0.5 + 16, 125, w * 0.5 + 8, 147);
          c.closePath();
        }, '#fef08a', '#f59e0b', 2);

        // Lámpara colgante de noche con cadenita
        const lampX = w * 0.82;
        this.drawHangingCord(lampX, 0, lampX, 110, 0);
        this.drawStitchedCardboard((c) => {
          c.moveTo(lampX - 28, 150);
          c.lineTo(lampX + 28, 150);
          c.lineTo(lampX + 16, 115);
          c.lineTo(lampX - 16, 115);
          c.closePath();
        }, isLightsOff ? '#334155' : '#f59e0b', '#ffffff', 3);

      } else if (roomKey === 'playground') {
        // Habitación 5: Patio de Juegos y Disfraces
        // Colinas de cartón verde en capas
        this.drawStitchedCardboard((c) => {
          c.moveTo(0, floorY);
          c.quadraticCurveTo(w * 0.35, floorY - 120, w * 0.7, floorY);
          c.closePath();
        }, '#84cc16', '#ffffff', 2);

        this.drawStitchedCardboard((c) => {
          c.moveTo(w * 0.45, floorY);
          c.quadraticCurveTo(w * 0.8, floorY - 95, w, floorY);
          c.closePath();
        }, '#65a30d', '#ffffff', 2);

        // Sol radiante en el cielo
        this.drawCardboardSun(w * 0.85, 95, 0.75, t * 0.2);
      }
    }

    getLighterColor(hex, percent = 25) {
      if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return '#fef3c7';
      try {
        let num = parseInt(hex.slice(1), 16);
        let r = (num >> 16) + Math.round(255 * (percent / 100));
        let g = ((num >> 8) & 0x00FF) + Math.round(255 * (percent / 100));
        let b = (num & 0x0000FF) + Math.round(255 * (percent / 100));
        r = Math.min(255, r);
        g = Math.min(255, g);
        b = Math.min(255, b);
        return `rgb(${r},${g},${b})`;
      } catch (_) {
        return hex;
      }
    }

    // --------------------------------------------------------------------------
    // DIBUJO ARTICULADO DE LAS MASCOTAS EN CARTÓN (PAPERCRAFT POU ARCHITECTURE)
    // --------------------------------------------------------------------------

    drawPet(petState, mousePos = { x: 0, y: 0 }) {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const t = this.time;

      const spec = SPECIES_DATA[petState.species] || SPECIES_DATA.crocodile;
      const stageIdx = Math.min(3, Math.max(0, (petState.stage || 1) - 1));
      const stage = LIFE_STAGES[stageIdx] || LIFE_STAGES[0];

      // Colores de piel de cartón personalizados o naturales
      const baseColor = petState.customSkinColor || spec.baseColor;
      const accentColor = petState.customSkinColor ? petState.customSkinColor : spec.accentColor;
      const bellyColor = petState.customSkinColor ? this.getLighterColor(petState.customSkinColor, 26) : spec.bellyColor;

      const centerX = w * 0.5;
      const floorY = h * 0.72;
      const petScale = stage.scale; // 0.65 (Baby), 0.85 (Toddler), 1.0 (Teen), 1.18 (Adult)

      // Respiración sutil y rebote orgánico
      const breathing = Math.sin(t * 3.2) * 4;
      const baseY = floorY - 60 * petScale + (petState.isSleeping ? 25 : 0);

      ctx.save();
      ctx.translate(centerX, baseY + (petState.isSleeping ? 0 : breathing));
      ctx.scale(petScale, petScale);

      // Estado emocional
      const isHappy = petState.happiness >= 60;
      const isSad = petState.happiness < 30 || petState.health < 30;
      const isEating = petState.eatingTimer > 0;
      const isSleeping = petState.isSleeping;

      // 0. CAPA DE SUPERHÉROE POR DETRÁS DEL CUERPO (LAYER 0)
      if (petState.equippedOutfit === 'outfit_cape') {
        const capeWave = Math.sin(t * 3.5) * 6;
        this.drawStitchedCardboard((c) => {
          c.moveTo(-32, -18);
          c.lineTo(32, -18);
          c.quadraticCurveTo(52 + capeWave, 35, 42 + capeWave * 1.5, 75);
          c.quadraticCurveTo(0, 68, -42 + capeWave * 1.5, 75);
          c.quadraticCurveTo(-52 + capeWave, 35, -32, -18);
          c.closePath();
        }, '#dc2626', '#fef08a', 3);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-38 + capeWave * 1.5, 71);
        ctx.quadraticCurveTo(0, 64, 38 + capeWave * 1.5, 71);
        ctx.stroke();
      }

      // 1. Patitas traseras / Base
      [-42, 42].forEach((px) => {
        this.drawStitchedCardboard((c) => {
          c.ellipse(px, 48, 22, 14, 0, 0, Math.PI * 2);
        }, accentColor, '#ffffff', 3);
      });

      // 2. Pancita / Cuerpo de Cartón
      const bellyBonus = (petState.hunger / 100) * 16;
      this.drawStitchedCardboard((c) => {
        c.ellipse(0, 15, 52 + bellyBonus * 0.5, 48, 0, 0, Math.PI * 2);
      }, baseColor, '#ffffff', 5);

      // Parche ventral de color claro (Belly plate)
      this.drawStitchedCardboard((c) => {
        c.ellipse(0, 18, 32 + bellyBonus * 0.35, 34, 0, 0, Math.PI * 2);
      }, bellyColor, 'rgba(0,0,0,0.15)', 1);

      // Manchas de lodo visibles si hygiene < 40
      if (petState.hygiene < 40) {
        ctx.save();
        ctx.fillStyle = '#78350f';
        [
          [-22, 8, 12],
          [16, 22, 14],
          [-4, 32, 10],
          [24, 0, 9]
        ].forEach(([mx, my, mr]) => {
          ctx.beginPath();
          ctx.arc(mx, my, mr, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 3. Cola articulada según especie
      if (spec.id === 'crocodile') {
        this.drawStitchedCardboard((c) => {
          c.moveTo(45, 20);
          c.lineTo(95 + Math.sin(t * 4) * 8, 30);
          c.lineTo(85, 45);
          c.lineTo(40, 35);
          c.closePath();
        }, baseColor, '#ffffff', 2);
      } else if (spec.id === 'dog' || spec.id === 'cat') {
        const tailWag = Math.sin(t * (isHappy ? 12 : 3)) * 18;
        this.drawStitchedCardboard((c) => {
          c.moveTo(42, 25);
          c.quadraticCurveTo(75 + tailWag, 0, 80 + tailWag, -25);
          c.quadraticCurveTo(65 + tailWag, -25, 42, 35);
          c.closePath();
        }, accentColor, '#ffffff', 2);
      } else if (spec.id === 'red_panda') {
        this.drawStitchedCardboard((c) => {
          c.ellipse(65, 20, 36, 18, 0.35, 0, Math.PI * 2);
        }, accentColor, '#fde68a', 3);
      }

      // 4. ROPA Y PRENDAS DE CUERPO (LAYER 2)
      const currentOutfit = petState.equippedOutfit || (stage.stage === 1 ? 'outfit_diaper' : (stage.stage === 2 ? 'outfit_bib' : 'none'));

      if (currentOutfit === 'outfit_diaper') {
        // Pañal de bebé blanco de papel texturizado con alfiler de seguridad
        this.drawStitchedCardboard((c) => {
          c.moveTo(-38, 14);
          c.lineTo(38, 14);
          c.lineTo(26, 48);
          c.lineTo(-26, 48);
          c.closePath();
        }, '#f8fafc', '#94a3b8', 2);
        // Alfiler de gancho dorado
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(16, 26, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(16, 30);
        ctx.lineTo(16, 40);
        ctx.stroke();
      } else if (currentOutfit === 'outfit_bib') {
        // Babero infantil de papel con huellita bordada
        this.drawStitchedCardboard((c) => {
          c.moveTo(-24, -12);
          c.quadraticCurveTo(0, 32, 24, -12);
          c.quadraticCurveTo(0, 14, -24, -12);
          c.closePath();
        }, '#fef08a', '#e11d48', 2);
        ctx.fillStyle = '#e11d48';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🐾', 0, 16);
      } else if (currentOutfit === 'outfit_jacket') {
        // Chaqueta universitaria deportiva con botones dorados
        this.drawStitchedCardboard((c) => {
          c.ellipse(0, 14, 42, 30, 0, 0, Math.PI * 2);
        }, '#1d4ed8', '#ffffff', 3);
        ctx.fillStyle = '#fbbf24';
        [-2, 10, 22].forEach((by) => {
          ctx.beginPath();
          ctx.arc(0, by, 3, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, -10, 22, 0.2, Math.PI - 0.2);
        ctx.stroke();
      } else if (currentOutfit === 'outfit_scarf') {
        // Bufanda tejida roja abrigada con flecos
        this.drawStitchedCardboard((c) => {
          c.ellipse(0, -16, 30, 10, 0, 0, Math.PI * 2);
        }, '#dc2626', '#ffffff', 2);
        this.drawStitchedCardboard((c) => {
          c.rect(10, -16, 14, 26);
        }, '#b91c1c', '#ffffff', 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        for (let fx = 12; fx <= 22; fx += 3) {
          ctx.beginPath();
          ctx.moveTo(fx, 10);
          ctx.lineTo(fx, 15);
          ctx.stroke();
        }
      } else if (currentOutfit === 'outfit_bowtie') {
        // Corbatín negro de gala
        this.drawStitchedCardboard((c) => {
          c.moveTo(-16, -22);
          c.lineTo(0, -16);
          c.lineTo(-16, -10);
          c.closePath();
          c.moveTo(16, -22);
          c.lineTo(0, -16);
          c.lineTo(16, -10);
          c.closePath();
        }, '#1e293b', '#ffffff', 1.5);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(0, -16, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. CABEZA ARTICULADA DE CARTÓN (ESCALA POR ETAPA: 1.28 EN BEBÉ)
      const headScale = stage.headScale;
      ctx.save();
      ctx.translate(0, -38);
      ctx.scale(headScale, headScale);

      // Orejas / Branquias según especie
      if (spec.id === 'cat' || spec.id === 'dog') {
        [-38, 38].forEach((ox, idx) => {
          this.drawStitchedCardboard((c) => {
            c.moveTo(ox, -22);
            c.lineTo(ox + (idx === 0 ? -18 : 18), -62);
            c.lineTo(ox + (idx === 0 ? 12 : -12), -38);
            c.closePath();
          }, accentColor, '#ffffff', 2);
        });
      } else if (spec.id === 'axolotl') {
        [-48, 48].forEach((bx, idx) => {
          [-14, 0, 14].forEach((by) => {
            this.drawStitchedCardboard((c) => {
              c.ellipse(bx + (idx === 0 ? -12 : 12), by, 16, 7, (idx === 0 ? -0.3 : 0.3), 0, Math.PI * 2);
            }, '#ec4899', '#ffffff', 1);
          });
        });
      } else if (spec.id === 'rhinoceros') {
        this.drawStitchedCardboard((c) => {
          c.moveTo(0, -8);
          c.lineTo(-8, -42);
          c.lineTo(8, -42);
          c.closePath();
        }, '#e7e5e4', '#78716c', 3);
      }

      // Base de la cabeza
      this.drawStitchedCardboard((c) => {
        c.ellipse(0, 0, 48, 40, 0, 0, Math.PI * 2);
      }, baseColor, '#ffffff', 5);

      // Hocico extendido para cocodrilo
      if (spec.id === 'crocodile') {
        this.drawStitchedCardboard((c) => {
          c.ellipse(0, 14, 38, 20, 0, 0, Math.PI * 2);
        }, baseColor, '#ffffff', 2);
        ctx.fillStyle = '#ffffff';
        [-20, -10, 0, 10, 20].forEach((tx) => {
          ctx.beginPath();
          ctx.moveTo(tx - 3, 22);
          ctx.lineTo(tx, 29);
          ctx.lineTo(tx + 3, 22);
          ctx.fill();
        });
      }

      // Ojos expresivos de papel con pupilas que siguen el cursor
      const eyeSpacing = 22;
      const eyeY = -8;
      const eyeRadius = stage.stage === 1 ? 14 : 11;

      const globalHeadX = centerX;
      const globalHeadY = baseY + (petState.isSleeping ? 0 : breathing) - 38 * petScale;
      const angleToMouse = Math.atan2(mousePos.y - globalHeadY, mousePos.x - globalHeadX);
      const pupilOffsetDist = Math.min(eyeRadius * 0.45, Math.hypot(mousePos.x - globalHeadX, mousePos.y - globalHeadY) * 0.04);
      const px = Math.cos(angleToMouse) * pupilOffsetDist;
      const py = Math.sin(angleToMouse) * pupilOffsetDist;

      const isBlinking = petState.blinkTimer > 0;

      [-eyeSpacing, eyeSpacing].forEach((ex) => {
        if (isSleeping || isBlinking) {
          ctx.strokeStyle = '#1e1b4b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(ex, eyeY, 9, 0.1, Math.PI - 0.1);
          ctx.stroke();
        } else {
          this.drawStitchedCardboard((c) => {
            c.arc(ex, eyeY, eyeRadius, 0, Math.PI * 2);
          }, '#ffffff', 'rgba(0,0,0,0.15)', 2);

          ctx.fillStyle = spec.eyeColor;
          ctx.beginPath();
          ctx.arc(ex + px, eyeY + py, eyeRadius * 0.65, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(ex + px, eyeY + py, eyeRadius * 0.45, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(ex + px - 3, eyeY + py - 3, eyeRadius * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Cejas expresivas
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2.5;
      if (isSad) {
        ctx.beginPath();
        ctx.moveTo(-32, -22);
        ctx.lineTo(-14, -26);
        ctx.moveTo(32, -22);
        ctx.lineTo(14, -26);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-30, -26);
        ctx.lineTo(-14, -24);
        ctx.moveTo(30, -26);
        ctx.lineTo(14, -24);
        ctx.stroke();
      }

      // Sonrojo de papel en las mejillas
      if (isHappy || petState.pettingTimer > 0) {
        ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
        ctx.beginPath();
        ctx.arc(-30, 8, 8, 0, Math.PI * 2);
        ctx.arc(30, 8, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Boca expresiva
      ctx.fillStyle = '#be123c';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2.5;

      if (isEating) {
        const mouthOpen = (Math.sin(t * 18) + 1) * 6 + 6;
        ctx.beginPath();
        ctx.ellipse(0, 16, 12, mouthOpen, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (isSad) {
        ctx.beginPath();
        ctx.arc(0, 24, 11, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, 10, 12, 0.2, Math.PI - 0.2);
        ctx.stroke();
      }

      // Chupón / Pacifier si está en Etapa 1 (Newborn Baby) y no está comiendo ni con casco espacial
      const equippedHat = petState.equippedHat || (stage.stage === 4 ? 'hat_crown' : 'none');
      if (stage.stage === 1 && !isEating && equippedHat !== 'hat_helmet') {
        this.drawStitchedCardboard((c) => {
          c.arc(0, 18, 11, 0, Math.PI * 2);
        }, '#38bdf8', '#ffffff', 2);
        this.drawStitchedCardboard((c) => {
          c.arc(0, 24, 6, 0, Math.PI * 2);
        }, '#fef08a', '#ffffff', 1);
      }

      // 6. GAFAS Y LENTES EQUIPADOS (LAYER 4)
      const equippedGlasses = petState.equippedGlasses || 'none';
      if (equippedGlasses === 'glasses_reading') {
        [-eyeSpacing, eyeSpacing].forEach((gx) => {
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(gx, eyeY, eyeRadius + 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = 'rgba(186, 230, 253, 0.25)';
          ctx.beginPath();
          ctx.arc(gx, eyeY, eyeRadius + 1, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-eyeSpacing + eyeRadius + 2, eyeY);
        ctx.quadraticCurveTo(0, eyeY - 4, eyeSpacing - eyeRadius - 2, eyeY);
        ctx.stroke();
      } else if (equippedGlasses === 'glasses_cool') {
        [-eyeSpacing, eyeSpacing].forEach((gx) => {
          this.drawStitchedCardboard((c) => {
            if (c.roundRect) {
              c.roundRect(gx - eyeRadius - 3, eyeY - eyeRadius - 1, (eyeRadius + 3) * 2, (eyeRadius + 2) * 2, 6);
            } else {
              c.rect(gx - eyeRadius - 3, eyeY - eyeRadius - 1, (eyeRadius + 3) * 2, (eyeRadius + 2) * 2);
            }
          }, '#0f172a', '#38bdf8', 1.5);
          ctx.strokeStyle = 'rgba(255,255,255,0.7)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(gx - 4, eyeY - eyeRadius + 2);
          ctx.lineTo(gx + 6, eyeY + eyeRadius - 2);
          ctx.stroke();
        });
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-eyeSpacing + eyeRadius + 2, eyeY - 2);
        ctx.lineTo(eyeSpacing - eyeRadius - 2, eyeY - 2);
        ctx.stroke();
      } else if (equippedGlasses === 'glasses_monocle') {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(eyeSpacing, eyeY, eyeRadius + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(eyeSpacing + eyeRadius + 4, eyeY);
        ctx.quadraticCurveTo(eyeSpacing + 16, eyeY + 24, eyeSpacing + 8, eyeY + 45);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 7. SOMBREROS Y ACCESORIOS DE CABEZA (LAYER 5)
      const finalHat = equippedHat !== 'none' ? equippedHat : (stage.stage === 4 ? 'hat_crown' : 'none');

      if (finalHat === 'hat_crown') {
        // Corona dorada de cartón real
        this.drawStitchedCardboard((c) => {
          c.moveTo(-28, -36);
          c.lineTo(-34, -68);
          c.lineTo(-16, -52);
          c.lineTo(0, -76);
          c.lineTo(16, -52);
          c.lineTo(34, -68);
          c.lineTo(28, -36);
          c.closePath();
        }, '#f59e0b', '#fef08a', 4);
        [-18, 0, 18].forEach((jx, idx) => {
          ctx.fillStyle = idx === 1 ? '#dc2626' : '#10b981';
          ctx.beginPath();
          ctx.arc(jx, -46, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (finalHat === 'hat_bonnet') {
        // Gorrito tierno de bebé con encaje
        this.drawStitchedCardboard((c) => {
          c.arc(0, -22, 38, Math.PI * 0.9, Math.PI * 2.1);
        }, '#fbcfe8', '#ffffff', 3);
        ctx.fillStyle = '#ffffff';
        for (let a = Math.PI * 0.9; a <= Math.PI * 2.1; a += 0.22) {
          const rx = Math.cos(a) * 40;
          const ry = -22 + Math.sin(a) * 40;
          ctx.beginPath();
          ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-32, -6);
        ctx.quadraticCurveTo(0, 16, 32, -6);
        ctx.stroke();
      } else if (finalHat === 'hat_baseball') {
        // Gorra deportiva roja/azul
        this.drawStitchedCardboard((c) => {
          c.arc(0, -34, 32, Math.PI * 1.05, Math.PI * 1.95);
          c.closePath();
        }, '#dc2626', '#ffffff', 2);
        this.drawStitchedCardboard((c) => {
          c.ellipse(14, -32, 28, 8, 0.15, 0, Math.PI * 2);
        }, '#2563eb', '#ffffff', 2);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -48, 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (finalHat === 'hat_top') {
        // Sombrero de copa británico
        this.drawStitchedCardboard((c) => {
          c.ellipse(0, -36, 42, 10, 0, 0, Math.PI * 2);
        }, '#1e293b', '#64748b', 2);
        this.drawStitchedCardboard((c) => {
          c.rect(-22, -80, 44, 46);
        }, '#0f172a', '#475569', 2);
        this.drawStitchedCardboard((c) => {
          c.rect(-22, -45, 44, 9);
        }, '#dc2626', '#fef08a', 1);
      } else if (finalHat === 'hat_helmet') {
        // Casco espacial de astronauta con visera reflectante
        this.drawStitchedCardboard((c) => {
          c.arc(0, -22, 46, 0, Math.PI * 2);
        }, 'rgba(255,255,255,0.88)', '#94a3b8', 3);
        this.drawStitchedCardboard((c) => {
          c.ellipse(0, -14, 30, 20, 0, 0, Math.PI * 2);
        }, '#f59e0b', '#fef08a', 2);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -68);
        ctx.lineTo(0, -82);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, -84, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore(); // Fin de la cabeza
      ctx.restore(); // Fin del dibujo de la mascota

      // 8. Partículas activas (Corazones, estrellas, burbujas de jabón)
      this.renderParticles();
    }

    // --------------------------------------------------------------------------
    // PARTÍCULAS PROCEDURALES (CORAZONES, BURBUJAS Y CONFETI)
    // --------------------------------------------------------------------------

    spawnHearts(x, y, count = 4) {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          type: 'heart',
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2.5 - 1.5,
          scale: Math.random() * 0.5 + 0.6,
          life: 1.0,
          color: Math.random() > 0.5 ? '#f43f5e' : '#ec4899'
        });
      }
    }

    spawnBubbles(x, y, count = 6) {
      for (let i = 0; i < count; i++) {
        this.soapBubbles.push({
          x: x + (Math.random() - 0.5) * 70,
          y: y + (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 1.8 - 0.8,
          radius: Math.random() * 12 + 8,
          life: 1.0
        });
      }
    }

    spawnConfetti(x, y, count = 28) {
      const colors = ['#f59e0b', '#10b981', '#38bdf8', '#ec4899', '#a855f7'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          type: 'confetti',
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 8,
          vy: -Math.random() * 6 - 3,
          rot: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1.0
        });
      }
    }

    renderParticles() {
      const ctx = this.ctx;

      // Actualizar y dibujar partículas
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.018;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);

        if (p.type === 'heart') {
          ctx.scale(p.scale, p.scale);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-8, -10, -16, 2, 0, 14);
          ctx.bezierCurveTo(16, 2, 8, -10, 0, 0);
          ctx.fill();
        } else if (p.type === 'confetti') {
          p.rot += p.vRot;
          p.vy += 0.15; // Gravedad
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }
        ctx.restore();
      }

      // Burbujas de jabón interactivas
      for (let b = this.soapBubbles.length - 1; b >= 0; b--) {
        const bub = this.soapBubbles[b];
        bub.x += bub.vx;
        bub.y += bub.vy;
        bub.life -= 0.008;

        if (bub.life <= 0) {
          this.soapBubbles.splice(b, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.min(1, bub.life);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 1.8;
        ctx.fillStyle = 'rgba(224, 242, 254, 0.35)';

        ctx.beginPath();
        ctx.arc(bub.x, bub.y, bub.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Brillo blanco en la burbuja
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bub.x - bub.radius * 0.35, bub.y - bub.radius * 0.35, bub.radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // ============================================================================
  // 7. CONTROLADOR PRINCIPAL DEL MOTOR Y CICLO DE VIDA (PET ENGINE)
  // ============================================================================

  class PetEngine2D {
    constructor() {
      this.sfx = new PaperSfxEngine();
      this.renderer = null;
      this.canvas = null;
      this.container = null;
      this.animId = null;
      this.activeRoom = 'nursery'; // nursery, kitchen, bath, bedroom, playground
      this.isLightsOff = false;
      this.mousePos = { x: 0, y: 0 };

      this._toastTimer = null;

      // Estado persistente
      this.state = {
        petId: null,
        species: 'crocodile',
        nickname: 'Baby Chomp',
        stage: 1,
        level: 1,
        xp: 45,
        coins: 180,
        hunger: 85,
        energy: 90,
        hygiene: 80,
        happiness: 95,
        health: 100,
        equippedHat: 'none',
        equippedGlasses: 'none',
        equippedOutfit: 'outfit_diaper',
        customSkinColor: null,
        unlockedCloset: ['none', 'outfit_diaper', 'hat_bonnet'],
        inventory: ['baby_formula', 'apple_puree'],
        masteredVocabulary: ['verb_swaddle', 'verb_feed'],
        lastUpdated: Date.now(),
        // Timers transitorios de animación
        blinkTimer: 0,
        pettingTimer: 0,
        eatingTimer: 0,
        isSleeping: false
      };

      this.loadState();
      this.initBlinkLoop();
    }

    loadState() {
      try {
        const saved = localStorage.getItem('mastereng_pet_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          Object.assign(this.state, parsed);
          const elapsedMin = (Date.now() - (this.state.lastUpdated || Date.now())) / 60000;
          if (elapsedMin > 5) {
            const decay = Math.min(30, Math.floor(elapsedMin / 20));
            this.state.hunger = Math.max(10, this.state.hunger - decay);
            this.state.energy = Math.max(15, this.state.energy - decay);
            this.state.hygiene = Math.max(10, this.state.hygiene - decay);
            this.state.happiness = Math.max(15, this.state.happiness - decay);
          }
        }
        const globalCoins = localStorage.getItem('mastereng_pet_coins');
        if (globalCoins !== null) {
          this.state.coins = parseInt(globalCoins, 10);
        }
        this.computeStageFromLevel();
      } catch (e) {
        console.warn('Error loading pet state:', e);
      }
    }

    saveState() {
      try {
        this.state.lastUpdated = Date.now();
        localStorage.setItem('mastereng_pet_state', JSON.stringify(this.state));
        localStorage.setItem('mastereng_pet_coins', String(this.state.coins || 0));
      } catch (e) {
        console.warn('Error saving pet state:', e);
      }
    }

    loadPetById(petId) {
      if (!petId) return;
      try {
        const raw = localStorage.getItem('mastereng_pets');
        if (raw) {
          const pets = JSON.parse(raw);
          if (Array.isArray(pets)) {
            const pet = pets.find((p) => p && p.id === petId);
            if (pet) {
              this.state.petId = pet.id;
              this.state.nickname = pet.name || 'Pet';
              const specMap = {
                croco: 'crocodile',
                crocodile: 'crocodile',
                rhino: 'rhinoceros',
                rhinoceros: 'rhinoceros',
                puppy: 'dog',
                dog: 'dog',
                kitten: 'cat',
                cat: 'cat',
                axolotl: 'axolotl',
                redpanda: 'red_panda',
                red_panda: 'red_panda'
              };
              this.state.species = specMap[pet.speciesId] || 'crocodile';
              this.state.hunger = pet.hunger !== undefined ? pet.hunger : 85;
              this.state.energy = pet.energy !== undefined ? pet.energy : 90;
              this.state.hygiene = pet.hygiene !== undefined ? pet.hygiene : 80;
              this.state.happiness = pet.happiness !== undefined ? pet.happiness : 95;
              this.state.xp = pet.exp !== undefined ? pet.exp : (pet.xp || 45);
              this.state.level = pet.level || Math.max(1, Math.floor(this.state.xp / 100) + 1);
              this.computeStageFromLevel();
              this.state.equippedHat = pet.equippedHat || pet.hat || (this.state.stage === 1 ? 'hat_bonnet' : 'none');
              this.state.equippedGlasses = pet.equippedGlasses || pet.glasses || 'none';
              this.state.equippedOutfit = pet.equippedOutfit || pet.neck || (this.state.stage === 1 ? 'outfit_diaper' : 'none');
              this.state.customSkinColor = pet.skinColor || null;
              this.saveState();
              this.updateHUD();
            }
          }
        }
      } catch (e) {
        console.warn('Error loading pet by id:', e);
      }
    }

    syncWithStoredPets() {
      try {
        const raw = localStorage.getItem('mastereng_pets');
        if (raw) {
          let pets = JSON.parse(raw);
          if (Array.isArray(pets) && pets.length > 0) {
            let matched = false;
            pets = pets.map((p) => {
              if (p && (p.id === this.state.petId || (!this.state.petId && p.name === this.state.nickname))) {
                matched = true;
                p.name = this.state.nickname;
                p.hunger = this.state.hunger;
                p.energy = this.state.energy;
                p.hygiene = this.state.hygiene;
                p.happiness = this.state.happiness;
                p.level = this.state.level || 1;
                p.exp = this.state.xp || 0;
                p.equippedHat = this.state.equippedHat;
                p.hat = this.state.equippedHat;
                p.equippedGlasses = this.state.equippedGlasses;
                p.glasses = this.state.equippedGlasses;
                p.equippedOutfit = this.state.equippedOutfit;
                p.neck = this.state.equippedOutfit;
                p.skinColor = this.state.customSkinColor;
              }
              return p;
            });
            if (matched) {
              localStorage.setItem('mastereng_pets', JSON.stringify(pets));
            }
          }
        }
      } catch (e) {
        console.warn('Error syncing with mastereng_pets:', e);
      }
    }

    computeStageFromLevel() {
      const lvl = this.state.level || Math.max(1, Math.floor((this.state.xp || 0) / 100) + 1);
      this.state.level = lvl;
      if (lvl <= 3) {
        this.state.stage = 1;
      } else if (lvl <= 7) {
        this.state.stage = 2;
      } else if (lvl <= 12) {
        this.state.stage = 3;
      } else {
        this.state.stage = 4;
      }
    }

    initBlinkLoop() {
      setInterval(() => {
        if (!this.state.isSleeping) {
          this.state.blinkTimer = 12; // 12 frames cerrados
        }
      }, Math.random() * 3000 + 2500);
    }

    setRoom(roomKey) {
      this.activeRoom = roomKey;
      this.sfx.playPaperRustle();
      if (roomKey !== 'bedroom') {
        this.isLightsOff = false;
        this.state.isSleeping = false;
      }
      this.updateRoomTools();
      this.updateHUD();
    }

    setSpecies(speciesKey) {
      if (SPECIES_DATA[speciesKey]) {
        this.state.species = speciesKey;
        this.sfx.playPaperRustle();
        this.saveState();
        this.syncWithStoredPets();
        this.updateHUD();
      }
    }

    speakPetBabyVoice(text) {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        const stageIdx = Math.min(3, Math.max(0, (this.state.stage || 1) - 1));
        const stage = LIFE_STAGES[stageIdx] || LIFE_STAGES[0];
        utterance.pitch = stage.voicePitch || 1.6;
        utterance.rate = stage.stage === 1 ? 1.15 : 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('[PetTTS] Error:', e);
      }
    }

    addExp(amount) {
      this.state.xp += amount;
      this.state.coins += Math.floor(amount * 0.4);

      const oldLevel = this.state.level || 1;
      const oldStage = this.state.stage || 1;
      this.computeStageFromLevel();

      if (this.state.level > oldLevel) {
        this.sfx.playChime();
        if (this.renderer) {
          this.renderer.spawnConfetti(this.renderer.width * 0.5, this.renderer.height * 0.4, 30);
        }
        this.showToast(`⭐ ¡Subiste al Nivel ${this.state.level}!`);
        this.speakPetBabyVoice(`Awesome! Level ${this.state.level}!`);
      }

      if (this.state.stage > oldStage) {
        this.sfx.playChime();
        if (this.renderer) {
          this.renderer.spawnConfetti(this.renderer.width * 0.5, this.renderer.height * 0.4, 60);
        }
        const stageInfo = LIFE_STAGES[this.state.stage - 1];
        this.showToast(`🎉 ¡Tu mascota evolucionó a la Etapa ${this.state.stage}: ${stageInfo.name}!`);
        this.speakPetBabyVoice(`I am growing up! I am now a ${stageInfo.name}!`);
      }

      this.saveState();
      this.syncWithStoredPets();
      this.updateHUD();
    }

    // --------------------------------------------------------------------------
    // ACCIONES DE CUIDADO Y APRENDIZAJE
    // --------------------------------------------------------------------------

    swaddleBaby() {
      this.sfx.playChime();
      if (this.renderer) {
        this.renderer.spawnHearts(this.renderer.width * 0.5, this.renderer.height * 0.65, 8);
      }
      this.state.happiness = Math.min(100, this.state.happiness + 20);
      this.state.energy = Math.min(100, this.state.energy + 10);
      this.addExp(25);
      this.showToast('🤱 ¡Arropaste tiernamente a tu bebé con una manta suave! (To swaddle)');
      this.speakPetBabyVoice('Swaddle me warm!');
      setTimeout(() => {
        this.triggerCareQuiz('verb_swaddle');
      }, 1200);
      this.saveState();
      this.syncWithStoredPets();
      this.updateHUD();
    }

    feed(foodId) {
      const food = SHOP_CATALOG.food.find((f) => f.id === foodId) || SHOP_CATALOG.food[0];
      this.sfx.playMunch();
      this.state.eatingTimer = 60; // 60 frames de masticar
      this.state.hunger = Math.min(100, this.state.hunger + (food.hunger || 25));
      this.state.energy = Math.min(100, this.state.energy + (food.energy || 5));
      this.state.happiness = Math.min(100, this.state.happiness + 10);

      this.addExp(18);

      if (food.reqBurp) {
        setTimeout(() => {
          this.triggerCareQuiz('verb_burp');
        }, 1200);
      } else {
        this.triggerContextualQuiz('feeding');
      }

      this.saveState();
      this.updateHUD();
    }

    bathScrub() {
      this.sfx.playPop();
      if (this.renderer) {
        this.renderer.spawnBubbles(this.renderer.width * 0.5, this.renderer.height * 0.55, 6);
      }
      this.state.hygiene = Math.min(100, this.state.hygiene + 20);
      this.state.happiness = Math.min(100, this.state.happiness + 8);

      if (this.state.hygiene >= 95) {
        this.sfx.playChime();
        this.showToast('✨ Spotless! ¡Tu mascota quedó rechinando de limpia!');
      }

      this.addExp(15);
      this.saveState();
      this.updateHUD();
    }

    toggleBedtime() {
      this.isLightsOff = !this.isLightsOff;
      this.state.isSleeping = this.isLightsOff;
      this.sfx.playPaperRustle();

      if (this.state.isSleeping) {
        this.sfx.playLullabyNote(523.25);
        setTimeout(() => this.sfx.playLullabyNote(659.25), 350);
        setTimeout(() => this.sfx.playLullabyNote(783.99), 700);
        this.showToast('🌙 Sleep tight! Cantando una suave lullaby...');
        this.triggerCareQuiz('noun_lullaby');
      }

      this.saveState();
      this.updateHUD();
    }

    petAnimal(clientX, clientY) {
      this.sfx.playSqueak();
      this.state.pettingTimer = 35;
      this.state.happiness = Math.min(100, this.state.happiness + 12);

      if (this.renderer) {
        const rect = this.canvas.getBoundingClientRect();
        this.renderer.spawnHearts(clientX - rect.left, clientY - rect.top, 3);
      }

      this.addExp(8);
      this.saveState();
      this.updateHUD();
    }

    // --------------------------------------------------------------------------
    // MICRO-DESAFÍOS PEDAGÓGICOS EN INGLÉS
    // --------------------------------------------------------------------------

    triggerContextualQuiz(context) {
      const candidates = CARE_VOCABULARY.filter((v) => {
        if (context === 'feeding') return v.id === 'verb_feed' || v.id === 'noun_bib' || v.id === 'state_famished';
        return true;
      });
      const chosen = candidates[Math.floor(Math.random() * candidates.length)] || CARE_VOCABULARY[0];
      this.showQuizModal(chosen);
    }

    triggerCareQuiz(vocabId) {
      const item = CARE_VOCABULARY.find((v) => v.id === vocabId);
      if (item) this.showQuizModal(item);
    }

    showQuizModal(vocabItem) {
      const modal = document.getElementById('petQuizModal');
      if (!modal) return;

      // Pronunciación de voz
      if (typeof global.speakText === 'function') {
        global.speakText(vocabItem.term, 'en');
      } else if (typeof window.speechSynthesis !== 'undefined') {
        const u = new SpeechSynthesisUtterance(vocabItem.term);
        u.lang = 'en-US';
        window.speechSynthesis.speak(u);
      }

      const q = vocabItem.quiz;
      modal.innerHTML = `
        <div class="relative max-w-md w-full bg-[#fbf7ee] text-slate-800 p-6 rounded-3xl border-4 border-[#c29b68] shadow-2xl"
             style="box-shadow: 8px 10px 0px rgba(78, 52, 32, 0.45); background-image: radial-gradient(#d6c09a 1px, transparent 1px); background-size: 16px 16px;">
          
          <!-- Encabezado estilo Etiqueta de Cartón -->
          <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#b45309]">
            <span class="bg-[#fef3c7] text-[#92400e] text-xs font-black uppercase px-3 py-1 rounded-full border border-[#f59e0b]">
              ${vocabItem.category}
            </span>
            <button onclick="document.getElementById('petQuizModal').classList.add('hidden')"
                    class="text-slate-400 hover:text-slate-700 font-bold text-xl px-2">✕</button>
          </div>

          <!-- Término e IPA -->
          <div class="text-center my-4">
            <h3 class="text-2xl font-black text-[#78350f]">${vocabItem.term}</h3>
            <p class="text-xs font-mono text-slate-500">${vocabItem.ipa}</p>
            <p class="text-sm font-semibold text-emerald-700 mt-1">${vocabItem.es}</p>
          </div>

          <!-- Pregunta -->
          <div class="bg-white/80 p-3.5 rounded-2xl border border-[#e2d5bd] my-3">
            <p class="text-sm text-slate-700 font-medium">${q.question}</p>
          </div>

          <!-- Opciones interactivas -->
          <div class="grid grid-cols-1 gap-2.5 my-4">
            ${q.options
              .map(
                (opt, idx) => `
              <button onclick="window.PetEngine2D.answerQuiz('${vocabItem.id}', ${idx})"
                      class="w-full py-2.5 px-4 text-left font-bold text-sm bg-[#faf5ea] hover:bg-[#fed7aa] border-2 border-[#d97706] rounded-xl transition shadow-sm active:translate-y-0.5">
                <span class="inline-block w-6 text-center text-[#9a3412] font-black">${['A', 'B', 'C', 'D'][idx]}.</span>
                ${opt}
              </button>
            `
              )
              .join('')}
          </div>

          <p class="text-xs text-center text-slate-500 italic">💡 ${q.tip}</p>
        </div>
      `;

      modal.classList.remove('hidden');
    }

    answerQuiz(vocabId, selectedIdx) {
      const vocab = CARE_VOCABULARY.find((v) => v.id === vocabId);
      const modal = document.getElementById('petQuizModal');
      if (!vocab) return;

      if (selectedIdx === vocab.quiz.correct) {
        this.sfx.playChime();
        if (this.renderer) {
          this.renderer.spawnConfetti(this.renderer.width * 0.5, this.renderer.height * 0.35, 30);
        }
        this.addExp(45);
        if (!this.state.masteredVocabulary.includes(vocabId)) {
          this.state.masteredVocabulary.push(vocabId);
        }
        this.showToast(`🎯 ¡Excelente! +45 EXP & +18 Monedas. Aprendiste: "${vocab.term}"`);
      } else {
        this.sfx.playSqueak();
        this.showToast(`Inténtalo de nuevo. La respuesta correcta era: "${vocab.quiz.options[vocab.quiz.correct]}"`);
      }

      if (modal) modal.classList.add('hidden');
      this.saveState();
      this.updateHUD();
    }

    // --------------------------------------------------------------------------
    // TOAST & INTERFAZ GRÁFICA
    // --------------------------------------------------------------------------

    showToast(msg) {
      let toast = document.getElementById('petCraftToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'petCraftToast';
        toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#78350f] text-[#fef3c7] font-bold text-sm px-5 py-2.5 rounded-full shadow-2xl border-2 border-[#f59e0b] z-50 transition pointer-events-none opacity-0';
        document.body.appendChild(toast);
      }
      toast.innerText = msg;
      toast.style.opacity = '1';
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.style.opacity = '0';
      }, 3000);
    }

    updateHUD() {
      const nameEl = document.getElementById('petHudName');
      const stageEl = document.getElementById('petHudStage');
      const levelEl = document.getElementById('petHudLevel');
      const expBar = document.getElementById('petBarExp');
      const expText = document.getElementById('petHudExpText');
      const coinsNum = document.getElementById('petHudCoinsNum');

      this.computeStageFromLevel();
      const stageIdx = Math.min(3, Math.max(0, (this.state.stage || 1) - 1));
      const stage = LIFE_STAGES[stageIdx] || LIFE_STAGES[0];
      const lvl = this.state.level || 1;

      if (nameEl) nameEl.innerText = this.state.nickname || 'Baby Pet';
      if (stageEl) {
        const stageIcons = ['🍼', '🧸', '🎒', '👑'];
        stageEl.innerText = `${stageIcons[stageIdx]} ${stage.name}`;
      }
      if (levelEl) levelEl.innerText = `Lv. ${lvl}`;

      const currentLevelXp = (this.state.xp || 0) % 100;
      if (expBar) expBar.style.width = `${currentLevelXp}%`;
      if (expText) expText.innerText = `XP: ${currentLevelXp}/100`;
      if (coinsNum) coinsNum.innerText = String(this.state.coins || 0);

      // Barras de progreso y porcentajes numéricos de necesidades (100% visibles)
      const updateNeed = (barId, valId, val) => {
        const clamped = Math.min(100, Math.max(0, Math.round(val)));
        const bar = document.getElementById(barId);
        const text = document.getElementById(valId);
        if (bar) bar.style.width = `${clamped}%`;
        if (text) text.innerText = `${clamped}%`;
      };

      updateNeed('petBarHunger', 'petValHunger', this.state.hunger);
      updateNeed('petBarEnergy', 'petValEnergy', this.state.energy);
      updateNeed('petBarHygiene', 'petValHygiene', this.state.hygiene);
      updateNeed('petBarHappiness', 'petValHappiness', this.state.happiness);
    }

    // --------------------------------------------------------------------------
    // MONTAJE DEL DOM Y VISTA INTEGRADA (SIN COLISIÓN CON HEADER)
    // --------------------------------------------------------------------------

    ensureDOM() {
      let viewEl = document.getElementById('view-pet-game');
      if (!viewEl) {
        viewEl = document.createElement('div');
        viewEl.id = 'view-pet-game';
        viewEl.className = 'fixed inset-x-0 bottom-0 z-40 bg-[#1e293b] flex flex-col hidden select-none overflow-hidden';
        viewEl.style.cssText = 'margin-top: 72px; height: calc(100vh - 72px); max-height: calc(100vh - 85px); overflow-y: auto; display: none;';
        viewEl.innerHTML = `
          <!-- CABECERA DE CARTÓN SUPERIOR Y CONTROL DEL HÁBITAT -->
          <div class="min-h-[56px] py-2 bg-[#caa778] border-b-4 border-[#78350f] flex flex-wrap items-center justify-between px-3 sm:px-5 shadow-lg relative z-20 shrink-0"
               style="background-image: radial-gradient(#b45309 1px, transparent 1px); background-size: 14px 14px;">
            
            <!-- Botones de Salida y Navegación -->
            <div class="flex items-center gap-2">
              <button onclick="window.PetEngine2D.returnToSanctuary()"
                      class="px-2.5 sm:px-3 py-1.5 bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] font-black text-xs rounded-xl border-2 border-[#b45309] shadow active:scale-95 transition flex items-center gap-1.5"
                      title="Volver al Santuario de Mascotas">
                <span>⬅</span>
                <span class="hidden sm:inline">Volver a Mis Mascotas (Santuario)</span>
                <span class="sm:hidden">Santuario</span>
              </button>
              <button onclick="if (typeof window.closePetSanctuary === 'function') { window.closePetSanctuary(); } else { window.PetEngine2D.returnToPortals(); }"
                      class="px-2.5 py-1.5 bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] font-black text-xs rounded-xl border-2 border-[#0284c7] shadow active:scale-95 transition flex items-center gap-1 cursor-pointer"
                      title="Volver a los Portales">
                <span>🏠</span>
                <span>Portales</span>
              </button>
            </div>

            <!-- Identidad de Mascota, Renombrar, Etapa y Nivel -->
            <div class="flex flex-col items-center justify-center my-1 sm:my-0">
              <div class="flex items-center gap-2">
                <h2 id="petHudName" class="text-base sm:text-lg font-black text-[#451a03]">Baby Chomp</h2>
                <button onclick="window.PetEngine2D.openRenameModal()"
                        class="px-2 py-0.5 bg-white/90 hover:bg-white text-[10px] font-black text-[#92400e] rounded-lg border border-[#b45309] shadow-sm flex items-center gap-1 active:scale-95 transition"
                        title="Cambiar nombre de la mascota">
                  <span>✏️</span>
                  <span class="hidden sm:inline">Renombrar</span>
                </button>
                <span id="petHudStage" class="text-[10px] sm:text-xs font-black bg-[#fef3c7] text-[#92400e] px-2.5 py-0.5 rounded-full border border-[#f59e0b] shadow-sm">
                  🍼 Newborn Baby
                </span>
                <span id="petHudLevel" class="text-[10px] sm:text-xs font-black bg-[#ecfdf5] text-[#065f46] px-2 py-0.5 rounded-full border border-[#10b981] shadow-sm">
                  Lv. 1
                </span>
              </div>
              <!-- Barra de EXP -->
              <div class="w-40 sm:w-52 h-2.5 bg-amber-950/20 rounded-full border border-[#92400e]/30 overflow-hidden mt-1 flex items-center">
                <div id="petBarExp" class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all" style="width: 45%;"></div>
              </div>
              <span id="petHudExpText" class="text-[9px] font-extrabold text-[#78350f]">XP: 45/100</span>
            </div>

            <!-- Monedas, Closet y Tienda -->
            <div class="flex items-center gap-2">
              <span id="petHudCoins" class="bg-[#fef3c7] text-[#78350f] px-3 py-1 rounded-full text-xs font-black border-2 border-[#b45309] shadow-sm flex items-center gap-1">
                <span>🪙</span>
                <span id="petHudCoinsNum">180</span>
              </span>
              <button onclick="window.PetEngine2D.openClosetModal()"
                      class="px-3 py-1.5 bg-[#f472b6] hover:bg-[#ec4899] text-white text-xs font-black rounded-xl border-2 border-[#be185d] shadow active:scale-95 transition flex items-center gap-1"
                      title="Guardarropa y Outfits estilo Pou">
                <span>👗</span>
                <span class="hidden sm:inline">Closet & Outfits</span>
                <span class="sm:hidden">Closet</span>
              </button>
              <button onclick="window.PetEngine2D.openShopModal()"
                      class="px-3 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-black rounded-xl border-2 border-[#78350f] shadow active:scale-95 transition flex items-center gap-1"
                      title="Tienda de Alimentos">
                <span>🛒</span>
                <span class="hidden sm:inline">Tienda</span>
              </button>
            </div>
          </div>

          <!-- BARRAS DE ESTADO SUPERIORES (100% VISIBLES) -->
          <div class="bg-[#f2e7d3] px-3 sm:px-6 py-2 border-b-2 border-[#b45309] flex flex-wrap items-center justify-around gap-2 text-xs font-black text-[#451a03] shadow-sm relative z-10 shrink-0">
            <div class="flex items-center gap-1.5 min-w-[100px] sm:min-w-[120px] flex-1 max-w-[160px]">
              <span class="text-base">🍖</span>
              <div class="flex-1">
                <div class="flex justify-between text-[10px] text-amber-950 font-black mb-0.5">
                  <span>Hambre</span>
                  <span id="petValHunger">85%</span>
                </div>
                <div class="w-full h-2.5 bg-amber-950/20 rounded-full overflow-hidden border border-[#b45309]/50">
                  <div id="petBarHunger" class="h-full bg-amber-500 rounded-full transition-all" style="width: 85%;"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1.5 min-w-[100px] sm:min-w-[120px] flex-1 max-w-[160px]">
              <span class="text-base">⚡</span>
              <div class="flex-1">
                <div class="flex justify-between text-[10px] text-amber-950 font-black mb-0.5">
                  <span>Energía</span>
                  <span id="petValEnergy">90%</span>
                </div>
                <div class="w-full h-2.5 bg-amber-950/20 rounded-full overflow-hidden border border-[#b45309]/50">
                  <div id="petBarEnergy" class="h-full bg-sky-500 rounded-full transition-all" style="width: 90%;"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1.5 min-w-[100px] sm:min-w-[120px] flex-1 max-w-[160px]">
              <span class="text-base">🧼</span>
              <div class="flex-1">
                <div class="flex justify-between text-[10px] text-amber-950 font-black mb-0.5">
                  <span>Higiene</span>
                  <span id="petValHygiene">75%</span>
                </div>
                <div class="w-full h-2.5 bg-amber-950/20 rounded-full overflow-hidden border border-[#b45309]/50">
                  <div id="petBarHygiene" class="h-full bg-emerald-500 rounded-full transition-all" style="width: 75%;"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1.5 min-w-[100px] sm:min-w-[120px] flex-1 max-w-[160px]">
              <span class="text-base">❤️</span>
              <div class="flex-1">
                <div class="flex justify-between text-[10px] text-amber-950 font-black mb-0.5">
                  <span>Felicidad</span>
                  <span id="petValHappiness">95%</span>
                </div>
                <div class="w-full h-2.5 bg-amber-950/20 rounded-full overflow-hidden border border-[#b45309]/50">
                  <div id="petBarHappiness" class="h-full bg-rose-500 rounded-full transition-all" style="width: 95%;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- LIENZO PRINCIPAL DEL JUEGO -->
          <div class="flex-1 relative overflow-hidden flex items-center justify-center min-h-[300px]">
            <canvas id="petGameCanvas" class="w-full h-full block cursor-pointer"></canvas>

            <!-- Paleta lateral de herramientas según habitación -->
            <div id="petRoomTools" class="absolute right-4 top-4 flex flex-col gap-2.5 z-20">
              <!-- Se puebla dinámicamente -->
            </div>
          </div>

          <!-- BARRA INFERIOR DE HABITACIONES -->
          <div class="h-16 bg-[#caa778] border-t-4 border-[#78350f] flex items-center justify-around px-2 z-10 shadow-2xl shrink-0">
            <button onclick="window.PetEngine2D.setRoom('nursery')"
                    class="pet-room-btn flex flex-col items-center justify-center text-xs font-black text-[#451a03] p-1 rounded-xl hover:bg-[#b45309]/20 transition"
                    data-room="nursery">
              <span class="text-xl">🏠</span>
              <span class="text-[10px]">Nursery</span>
            </button>
            <button onclick="window.PetEngine2D.setRoom('kitchen')"
                    class="pet-room-btn flex flex-col items-center justify-center text-xs font-black text-[#451a03] p-1 rounded-xl hover:bg-[#b45309]/20 transition"
                    data-room="kitchen">
              <span class="text-xl">🍎</span>
              <span class="text-[10px]">Kitchen</span>
            </button>
            <button onclick="window.PetEngine2D.setRoom('bath')"
                    class="pet-room-btn flex flex-col items-center justify-center text-xs font-black text-[#451a03] p-1 rounded-xl hover:bg-[#b45309]/20 transition"
                    data-room="bath">
              <span class="text-xl">🛁</span>
              <span class="text-[10px]">Bath</span>
            </button>
            <button onclick="window.PetEngine2D.setRoom('bedroom')"
                    class="pet-room-btn flex flex-col items-center justify-center text-xs font-black text-[#451a03] p-1 rounded-xl hover:bg-[#b45309]/20 transition"
                    data-room="bedroom">
              <span class="text-xl">🌙</span>
              <span class="text-[10px]">Bedroom</span>
            </button>
            <button onclick="window.PetEngine2D.setRoom('playground')"
                    class="pet-room-btn flex flex-col items-center justify-center text-xs font-black text-[#451a03] p-1 rounded-xl hover:bg-[#b45309]/20 transition"
                    data-room="playground">
              <span class="text-xl">🎮</span>
              <span class="text-[10px]">Play</span>
            </button>
            <button onclick="window.PetEngine2D.openClosetModal()"
                    class="pet-room-btn flex flex-col items-center justify-center text-xs font-black text-[#be185d] p-1 rounded-xl hover:bg-[#f472b6]/20 transition"
                    title="Closet & Outfits">
              <span class="text-xl">👗</span>
              <span class="text-[10px]">Closet</span>
            </button>
          </div>

          <!-- MODAL DE RENOMBRAR MASCOTA -->
          <div id="petRenameModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 hidden"></div>

          <!-- MODAL DE QUIZ PEDAGÓGICO -->
          <div id="petQuizModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 hidden"></div>

          <!-- MODAL DE TIENDA Y ALIMENTOS -->
          <div id="petShopModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 hidden"></div>

          <!-- MODAL DE CLOSET Y GUARDARROPA -->
          <div id="petClosetModal" class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 hidden"></div>

          <!-- MODAL DE SELECTOR DE ESPECIE -->
          <div id="petSpeciesModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 hidden"></div>
        `;

        document.body.appendChild(viewEl);
      }

      this.container = viewEl;
      this.canvas = document.getElementById('petGameCanvas');
      if (this.canvas) {
        this.renderer = new CardboardRenderer(this.canvas);
      }

      this.bindEvents();
      this.updateRoomTools();
    }

    bindEvents() {
      const updateSize = () => {
        if (this.canvas && this.container) {
          const parent = this.canvas.parentElement;
          if (parent) {
            const rect = parent.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && this.renderer) {
              this.renderer.resize(rect.width, rect.height);
            }
          }
        }
      };
      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('resize', updateSize);
      }
      setTimeout(updateSize, 60);

      if (this.canvas) {
        this.canvas.addEventListener('mousemove', (e) => {
          const rect = this.canvas.getBoundingClientRect();
          this.mousePos.x = e.clientX - rect.left;
          this.mousePos.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('click', (e) => {
          const rect = this.canvas.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;

          const petCenterX = (this.renderer ? this.renderer.width : 400) * 0.5;
          const petCenterY = (this.renderer ? this.renderer.height : 400) * 0.72 - 60;
          const dist = Math.hypot(clickX - petCenterX, clickY - petCenterY);

          if (dist < 90) {
            this.petAnimal(e.clientX, e.clientY);
          }
        });
      }
    }

    updateRoomTools() {
      const toolBox = document.getElementById('petRoomTools');
      if (!toolBox) return;

      if (this.activeRoom === 'nursery') {
        toolBox.innerHTML = `
          <button onclick="window.PetEngine2D.feed('baby_formula')"
                  class="w-12 h-12 bg-[#fef3c7] hover:bg-[#fde68a] border-2 border-[#b45309] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Biberón (Baby Bottle Formula Milk)">🍼</button>
          <button onclick="window.PetEngine2D.feed('apple_puree')"
                  class="w-12 h-12 bg-[#fef3c7] hover:bg-[#fde68a] border-2 border-[#b45309] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Papilla de Manzana (Porridge / Puree)">🥣</button>
          <button onclick="window.PetEngine2D.swaddleBaby()"
                  class="w-12 h-12 bg-[#fbcfe8] hover:bg-[#f472b6] border-2 border-[#db2777] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Arropar con Manta (To Swaddle)">🤱</button>
        `;
      } else if (this.activeRoom === 'kitchen') {
        toolBox.innerHTML = `
          <button onclick="window.PetEngine2D.feed('baby_formula')"
                  class="w-12 h-12 bg-[#fef3c7] hover:bg-[#fde68a] border-2 border-[#b45309] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Baby Formula Milk">🍼</button>
          <button onclick="window.PetEngine2D.feed('apple_puree')"
                  class="w-12 h-12 bg-[#fef3c7] hover:bg-[#fde68a] border-2 border-[#b45309] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Apple Puree">🍎</button>
          <button onclick="window.PetEngine2D.feed('crisp_lettuce')"
                  class="w-12 h-12 bg-[#fef3c7] hover:bg-[#fde68a] border-2 border-[#b45309] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Crisp Lettuce">🥬</button>
        `;
      } else if (this.activeRoom === 'bath') {
        toolBox.innerHTML = `
          <button onclick="window.PetEngine2D.bathScrub()"
                  class="w-12 h-12 bg-[#e0f2fe] hover:bg-[#bae6fd] border-2 border-[#0284c7] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Tallar con Esponja (To scrub)">🧽</button>
          <button onclick="window.PetEngine2D.triggerCareQuiz('verb_scrub')"
                  class="w-12 h-12 bg-[#ecfdf5] hover:bg-[#a7f3d0] border-2 border-[#059669] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Aprender Verbos de Baño">🧼</button>
        `;
      } else if (this.activeRoom === 'bedroom') {
        toolBox.innerHTML = `
          <button onclick="window.PetEngine2D.toggleBedtime()"
                  class="w-12 h-12 bg-[#fef3c7] hover:bg-[#fde68a] border-2 border-[#b45309] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Interruptor de Luz / Dormir">💡</button>
          <button onclick="window.PetEngine2D.triggerCareQuiz('verb_tuck_in')"
                  class="w-12 h-12 bg-[#f3e8ff] hover:bg-[#e9d5ff] border-2 border-[#7e22ce] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Arropar en la Cama (To tuck in)">🛌</button>
        `;
      } else if (this.activeRoom === 'playground') {
        toolBox.innerHTML = `
          <button onclick="window.PetEngine2D.openMinigames()"
                  class="w-12 h-12 bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#dc2626] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="🎮 Jugar / Minijuegos Arcade (Basketball, Volleyball, Food Catch)">🎮</button>
          <button onclick="window.PetEngine2D.playBall()"
                  class="w-12 h-12 bg-[#fef08a] hover:bg-[#fde047] border-2 border-[#ca8a04] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Lanzar Pelota de Cartón">⚽</button>
          <button onclick="window.PetEngine2D.openClosetModal()"
                  class="w-12 h-12 bg-[#fbcfe8] hover:bg-[#f9a8d4] border-2 border-[#db2777] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Guardarropa y Outfits">👗</button>
        `;
      } else {
        toolBox.innerHTML = `
          <button onclick="window.PetEngine2D.triggerCareQuiz('verb_soothe')"
                  class="w-12 h-12 bg-[#fef3c7] hover:bg-[#fde68a] border-2 border-[#b45309] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Calmar y Dar Mimos">❤️</button>
          <button onclick="window.PetEngine2D.triggerCareQuiz('verb_praise')"
                  class="w-12 h-12 bg-[#ecfdf5] hover:bg-[#a7f3d0] border-2 border-[#059669] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Elogiar en Inglés">⭐</button>
        `;
      }
    }

    
    openMinigames() {
      if (typeof window !== 'undefined' && typeof window.openPetArcadeModal === 'function') {
        window.openPetArcadeModal(this.state);
        return;
      }
      if (typeof global !== 'undefined' && typeof global.openPetArcadeModal === 'function') {
        global.openPetArcadeModal(this.state);
        return;
      }
      this.playBall();
    }
  
    playBall() {
      if (typeof window !== 'undefined' && typeof window.openPetArcadeModal === 'function') {
        window.openPetArcadeModal(this.state);
        return;
      }
      if (typeof global !== 'undefined' && typeof global.openPetArcadeModal === 'function') {
        global.openPetArcadeModal(this.state);
        return;
      }
      this.sfx.playPop();
      if (this.renderer) {
        this.renderer.spawnConfetti(this.renderer.width * 0.5, this.renderer.height * 0.6, 15);
      }
      this.state.happiness = Math.min(100, this.state.happiness + 15);
      this.state.energy = Math.max(10, this.state.energy - 8);
      this.addExp(20);
      this.speakPetBabyVoice('Goal! We are playing!');
      this.showToast('⚽ ¡Golazo! Jugando con la pelota de cartón.');
      this.saveState();
      this.syncWithStoredPets();
      this.updateHUD();
    }

    // --------------------------------------------------------------------------
    // RENOMBRAR MASCOTA
    // --------------------------------------------------------------------------

    openRenameModal() {
      const modal = document.getElementById('petRenameModal') || document.getElementById('petQuizModal');
      if (!modal) return;
      this.sfx.playPaperRustle();
      modal.innerHTML = `
        <div class="relative max-w-sm w-full bg-[#fbf7ee] text-slate-800 p-6 rounded-3xl border-4 border-[#c29b68] shadow-2xl">
          <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#b45309]">
            <h3 class="text-lg font-black text-[#78350f] flex items-center gap-2">
              <span>✏️</span>
              <span>Renombrar Mascota</span>
            </h3>
            <button onclick="this.closest('.fixed').classList.add('hidden')"
                    class="text-slate-400 hover:text-slate-700 font-bold text-xl px-2">✕</button>
          </div>
          <p class="text-xs text-slate-600 mt-3 mb-2 font-medium">Elige un nombre tierno para tu compañero de cartón:</p>
          <input type="text" id="renamePetInput" value="${this.state.nickname || ''}" maxlength="24"
                 class="w-full px-3 py-2 text-sm font-bold border-2 border-[#b45309] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f59e0b] bg-white text-slate-800 shadow-inner"
                 placeholder="Ej: Crocky, Fluffy, Max...">
          <div class="flex justify-end gap-2 mt-4">
            <button onclick="this.closest('.fixed').classList.add('hidden')"
                    class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black rounded-xl">
              Cancelar
            </button>
            <button onclick="window.PetEngine2D.confirmRename()"
                    class="px-4 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-black rounded-xl shadow active:scale-95 transition">
              Guardar Nombre
            </button>
          </div>
        </div>
      `;
      modal.classList.remove('hidden');
      setTimeout(() => {
        const input = document.getElementById('renamePetInput');
        if (input) input.focus();
      }, 100);
    }

    confirmRename() {
      const input = document.getElementById('renamePetInput');
      if (input && input.value.trim()) {
        const newName = input.value.trim();
        this.state.nickname = newName;
        this.sfx.playChime();
        this.showToast(`✨ ¡Nombre actualizado a "${newName}"!`);
        this.speakPetBabyVoice(`My name is ${newName}!`);
        this.saveState();
        this.syncWithStoredPets();
        this.updateHUD();
      }
      const modal = document.getElementById('petRenameModal') || document.getElementById('petQuizModal');
      if (modal) modal.classList.add('hidden');
    }

    // --------------------------------------------------------------------------
    // CLOSET Y GUARDARROPA ESTILO POU (PAPERCRAFT DRESS-UP)
    // --------------------------------------------------------------------------

    openClosetModal(activeTab = 'hats') {
      const modal = document.getElementById('petClosetModal');
      if (!modal) return;
      this.sfx.playPaperRustle();

      const tabs = [
        { id: 'hats', label: '👒 Sombreros', count: CLOSET_CATALOG.hats.length },
        { id: 'glasses', label: '👓 Gafas', count: CLOSET_CATALOG.glasses.length },
        { id: 'outfits', label: '👕 Ropa', count: CLOSET_CATALOG.outfits.length },
        { id: 'skinColors', label: '🎨 Piel Kraft', count: CLOSET_CATALOG.skinColors.length }
      ];

      const currentItems = CLOSET_CATALOG[activeTab] || CLOSET_CATALOG.hats;

      modal.innerHTML = `
        <div class="relative max-w-xl w-full bg-[#fbf7ee] text-slate-800 p-5 sm:p-6 rounded-3xl border-4 border-[#c29b68] shadow-2xl max-h-[88vh] flex flex-col">
          
          <!-- Encabezado del Closet -->
          <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#b45309]">
            <div class="flex items-center gap-2">
              <span class="text-2xl">👗</span>
              <div>
                <h3 class="text-lg sm:text-xl font-black text-[#78350f]">Closet & Guardarropa Papercraft</h3>
                <p class="text-[11px] text-slate-600 font-medium">Personaliza a tu mascota con estilo Pou en tiempo real</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="bg-[#fef3c7] text-[#78350f] px-3 py-1 rounded-full text-xs font-black border-2 border-[#b45309] shadow-sm flex items-center gap-1">
                <span>🪙</span>
                <span>${this.state.coins || 0}</span>
              </span>
              <button onclick="document.getElementById('petClosetModal').classList.add('hidden')"
                      class="text-slate-400 hover:text-slate-700 font-bold text-2xl px-1">✕</button>
            </div>
          </div>

          <!-- Selector de Categorías / Tabs -->
          <div class="flex gap-1.5 sm:gap-2 my-3 overflow-x-auto pb-1 shrink-0">
            ${tabs
              .map(
                (tab) => `
              <button onclick="window.PetEngine2D.openClosetModal('${tab.id}')"
                      class="px-3 py-1.5 rounded-xl text-xs font-black transition border-2 ${
                        activeTab === tab.id
                          ? 'bg-[#b45309] text-white border-[#78350f] shadow'
                          : 'bg-white text-slate-700 border-[#e2d5bd] hover:bg-[#fef3c7]'
                      }">
                ${tab.label}
              </button>
            `
              )
              .join('')}
          </div>

          <!-- Grid de Ítems -->
          <div class="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            ${currentItems
              .map((item) => {
                let isEquipped = false;
                if (activeTab === 'hats') {
                  isEquipped = (this.state.equippedHat || 'none') === item.id;
                } else if (activeTab === 'glasses') {
                  isEquipped = (this.state.equippedGlasses || 'none') === item.id;
                } else if (activeTab === 'outfits') {
                  isEquipped = (this.state.equippedOutfit || 'none') === item.id;
                } else if (activeTab === 'skinColors') {
                  isEquipped = (item.id === 'kraft' && !this.state.customSkinColor) || this.state.customSkinColor === item.hex;
                }

                const isUnlocked = item.price === 0 || (this.state.unlockedCloset && this.state.unlockedCloset.includes(item.id));

                return `
                  <div class="bg-white p-3 rounded-2xl border-2 ${isEquipped ? 'border-[#10b981] bg-[#ecfdf5]/40 ring-2 ring-[#10b981]/30' : 'border-[#e2d5bd]'} flex items-center justify-between shadow-sm">
                    <div class="flex items-center gap-2.5 min-w-0">
                      ${
                        activeTab === 'skinColors'
                          ? `<div class="w-10 h-10 rounded-full border-2 border-[#78350f] shadow-md shrink-0 flex items-center justify-center font-black" style="background-color: ${item.hex};">
                              ${isEquipped ? '✓' : ''}
                            </div>`
                          : `<span class="text-3xl shrink-0">${item.icon}</span>`
                      }
                      <div class="min-w-0">
                        <p class="text-xs font-black text-slate-800 truncate">${item.name}</p>
                        <p class="text-[10px] text-slate-500 truncate">${item.es}</p>
                        ${item.isVip ? '<span class="text-[9px] bg-purple-100 text-purple-700 font-black px-1.5 py-0.2 rounded">VIP</span>' : ''}
                      </div>
                    </div>

                    <div class="shrink-0 ml-2">
                      ${
                        isEquipped
                          ? `<span class="px-2.5 py-1 bg-emerald-600 text-white font-black text-[11px] rounded-xl shadow-inner flex items-center gap-1">
                               <span>Puesto</span> <span>✅</span>
                             </span>`
                          : isUnlocked
                          ? `<button onclick="window.PetEngine2D.equipClosetItem('${activeTab}', '${item.id}')"
                                     class="px-3 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white font-black text-xs rounded-xl shadow active:scale-95 transition">
                               Equipar
                             </button>`
                          : `<button onclick="window.PetEngine2D.buyClosetItem('${activeTab}', '${item.id}')"
                                     class="px-3 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs rounded-xl shadow active:scale-95 transition flex items-center gap-1">
                               <span>${item.price}</span> <span>🪙</span>
                             </button>`
                      }
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>

          <div class="pt-3 border-t border-[#e2d5bd] mt-2 flex justify-between items-center text-xs text-slate-500">
            <span>💡 Las prendas equipadas se reflejan al instante en tu mascota de cartón.</span>
            <button onclick="document.getElementById('petClosetModal').classList.add('hidden')"
                    class="px-4 py-1.5 bg-[#78350f] text-white font-black rounded-xl">
              Listo
            </button>
          </div>
        </div>
      `;

      modal.classList.remove('hidden');
    }

    buyClosetItem(tab, itemId) {
      const item = CLOSET_CATALOG[tab]?.find((i) => i.id === itemId);
      if (!item) return;

      if ((this.state.coins || 0) >= item.price) {
        this.state.coins -= item.price;
        if (!this.state.unlockedCloset) this.state.unlockedCloset = ['none'];
        if (!this.state.unlockedCloset.includes(itemId)) {
          this.state.unlockedCloset.push(itemId);
        }
        try {
          localStorage.setItem('mastereng_pet_coins', String(this.state.coins));
        } catch (_) {}
        this.sfx.playChime();
        this.showToast(`✨ ¡Comprado: ${item.name}!`);
        this.equipClosetItem(tab, itemId);
      } else {
        this.sfx.playSqueak();
        this.showToast(`🪙 Necesitas ${item.price} PetCoins. ¡Juega y aprende inglés para ganar más!`);
      }
    }

    equipClosetItem(tab, itemId) {
      const item = CLOSET_CATALOG[tab]?.find((i) => i.id === itemId);
      if (!item) return;

      if (tab === 'hats') {
        this.state.equippedHat = itemId;
      } else if (tab === 'glasses') {
        this.state.equippedGlasses = itemId;
      } else if (tab === 'outfits') {
        this.state.equippedOutfit = itemId;
      } else if (tab === 'skinColors') {
        this.state.customSkinColor = itemId === 'kraft' ? null : item.hex;
      }

      this.sfx.playPaperRustle();
      this.showToast(`👗 ¡Equipado: ${item.name}!`);
      this.saveState();
      this.syncWithStoredPets();
      this.openClosetModal(tab);
    }

    // --------------------------------------------------------------------------
    // NAVEGACIÓN Y SALIDA
    // --------------------------------------------------------------------------

    returnToSanctuary() {
      this.saveState();
      this.syncWithStoredPets();
      this.closeView();
      if (typeof window.openPetSanctuary === 'function') {
        window.openPetSanctuary();
      } else if (typeof window.renderSanctuaryHub === 'function') {
        const sanctuaryView = document.getElementById('view-pet-sanctuary');
        if (sanctuaryView) {
          sanctuaryView.classList.remove('hidden');
          sanctuaryView.style.display = 'block';
        }
        window.renderSanctuaryHub();
      }
    }

    returnToPortals() {
      this.saveState();
      this.syncWithStoredPets();
      this.closeView();
      if (typeof window.closePetSanctuary === 'function') {
        try { window.closePetSanctuary(); } catch (_) {}
      } else if (typeof window.returnToMainPortals === 'function') {
        try { window.returnToMainPortals(); } catch (_) {}
      } else if (typeof window.navigateTo === 'function') {
        window.navigateTo('portals');
      } else if (typeof window.navigateToView === 'function') {
        window.navigateToView('portals');
      }
    }

    // --------------------------------------------------------------------------
    // MODALES AUXILIARES: TIENDA Y ESPECIES
    // --------------------------------------------------------------------------

    openShopModal() {
      const modal = document.getElementById('petShopModal');
      if (!modal) return;
      this.sfx.playPaperRustle();

      modal.innerHTML = `
        <div class="relative max-w-lg w-full bg-[#fbf7ee] text-slate-800 p-6 rounded-3xl border-4 border-[#c29b68] shadow-2xl max-h-[85vh] overflow-y-auto">
          <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#b45309]">
            <h3 class="text-xl font-black text-[#78350f]">🛒 Tienda de Cartón (Crafted Shop)</h3>
            <button onclick="document.getElementById('petShopModal').classList.add('hidden')"
                    class="text-slate-400 hover:text-slate-700 font-bold text-xl px-2">✕</button>
          </div>

          <h4 class="text-xs font-black text-[#9a3412] uppercase tracking-wider mt-4 mb-2">Comida Nutritiva</h4>
          <div class="grid grid-cols-2 gap-2.5">
            ${SHOP_CATALOG.food
              .map(
                (item) => `
              <div class="bg-white p-3 rounded-2xl border border-[#e2d5bd] flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">${item.icon}</span>
                  <div>
                    <p class="text-xs font-bold text-slate-800">${item.name}</p>
                    <p class="text-[10px] text-emerald-600 font-semibold">+${item.hunger} Hambre</p>
                  </div>
                </div>
                <button onclick="window.PetEngine2D.buyFood('${item.id}', ${item.price})"
                        class="px-2.5 py-1 bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-black rounded-lg shadow">
                  ${item.price} 🪙
                </button>
              </div>
            `
              )
              .join('')}
          </div>

          <h4 class="text-xs font-black text-[#9a3412] uppercase tracking-wider mt-6 mb-2">Pociones & Elixires</h4>
          <div class="grid grid-cols-2 gap-2.5">
            ${SHOP_CATALOG.potions
              .map(
                (item) => `
              <div class="bg-white p-3 rounded-2xl border border-[#e2d5bd] flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">${item.icon}</span>
                  <div>
                    <p class="text-xs font-bold text-slate-800">${item.name}</p>
                    <p class="text-[10px] text-sky-600 font-semibold">${item.es}</p>
                  </div>
                </div>
                <button onclick="window.PetEngine2D.buyPotion('${item.id}', ${item.price})"
                        class="px-2.5 py-1 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-black rounded-lg shadow">
                  ${item.price} 🪙
                </button>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `;
      modal.classList.remove('hidden');
    }

    buyFood(foodId, price) {
      if ((this.state.coins || 0) >= price) {
        this.state.coins -= price;
        this.feed(foodId);
        this.showToast('¡Compra exitosa! Mascota alimentada.');
      } else {
        this.showToast('🪙 Monedas insuficientes. ¡Responde trivias para ganar más!');
      }
    }

    buyPotion(potionId, price) {
      if ((this.state.coins || 0) >= price) {
        this.state.coins -= price;
        if (potionId === 'growth_elixir') {
          this.addExp(150);
          this.showToast('🧪 ¡Elixir de Crecimiento activado! +150 EXP');
        } else if (potionId === 'instant_cleanse') {
          this.state.hygiene = 100;
          this.showToast('🧼 ¡Bomba de Espuma! Higiene al 100%');
        } else if (potionId === 'energy_tonic') {
          this.state.energy = 100;
          this.showToast('⚡ ¡Tónico de Energía! Energía al 100%');
        } else if (potionId === 'sweet_dreams') {
          this.state.energy = 100;
          this.state.happiness = 100;
          this.showToast('🌙 ¡Poción de Dulces Sueños! Descanso y felicidad al máximo.');
        }
        this.sfx.playChime();
        this.saveState();
        this.syncWithStoredPets();
        this.updateHUD();
      } else {
        this.showToast('🪙 Monedas insuficientes.');
      }
    }

    openSpeciesModal() {
      const modal = document.getElementById('petSpeciesModal');
      if (!modal) return;
      this.sfx.playPaperRustle();

      modal.innerHTML = `
        <div class="relative max-w-md w-full bg-[#fbf7ee] text-slate-800 p-6 rounded-3xl border-4 border-[#c29b68] shadow-2xl">
          <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#b45309]">
            <h3 class="text-xl font-black text-[#78350f]">🐾 Elige tu Especie de Cartón</h3>
            <button onclick="document.getElementById('petSpeciesModal').classList.add('hidden')"
                    class="text-slate-400 hover:text-slate-700 font-bold text-xl px-2">✕</button>
          </div>

          <div class="grid grid-cols-2 gap-3 my-4">
            ${Object.values(SPECIES_DATA)
              .map(
                (spec) => `
              <button onclick="window.PetEngine2D.setSpecies('${spec.id}'); document.getElementById('petSpeciesModal').classList.add('hidden');"
                      class="p-3 text-left bg-white hover:bg-[#fef3c7] border-2 ${this.state.species === spec.id ? 'border-[#f59e0b] ring-2 ring-[#f59e0b]' : 'border-[#e2d5bd]'} rounded-2xl transition shadow-sm">
                <p class="font-black text-sm text-[#451a03]">${spec.name}</p>
                <p class="text-[10px] text-slate-500">${spec.es}</p>
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      `;
      modal.classList.remove('hidden');
    }

    // --------------------------------------------------------------------------
    // CICLO DE ANIMACIÓN PRINCIPAL
    // --------------------------------------------------------------------------

    startLoop() {
      if (this.animId) return;

      const raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || (typeof globalThis !== 'undefined' && globalThis.requestAnimationFrame) || ((cb) => setTimeout(cb, 16));

      const loop = (now) => {
        this.animId = raf(loop);
        if (this.renderer) {
          this.renderer.time = (now || Date.now()) * 0.001;

          if (this.state.blinkTimer > 0) this.state.blinkTimer--;
          if (this.state.pettingTimer > 0) this.state.pettingTimer--;
          if (this.state.eatingTimer > 0) this.state.eatingTimer--;

          this.renderer.renderRoomBackground(this.activeRoom, this.state.species, this.isLightsOff);
          this.renderer.drawPet(this.state, this.mousePos);
        }
      };

      this.animId = raf(loop);
    }

    stopLoop() {
      if (this.animId) {
        const caf = (typeof window !== 'undefined' && window.cancelAnimationFrame) || (typeof globalThis !== 'undefined' && globalThis.cancelAnimationFrame) || clearTimeout;
        caf(this.animId);
        this.animId = null;
      }
    }

    openView(petId) {
      if (petId) {
        this.loadPetById(petId);
      } else {
        try {
          const raw = localStorage.getItem('mastereng_pets');
          if (raw) {
            const pets = JSON.parse(raw);
            if (Array.isArray(pets) && pets.length > 0) {
              const selectedId = localStorage.getItem('mastereng_selected_pet_id');
              const pet = pets.find((p) => p && p.id === selectedId) || pets[0];
              if (pet) {
                this.loadPetById(pet.id);
              }
            }
          }
        } catch (_) {}
      }

      // Ocultar Santuario si estaba activo para que el 2D Habitat tome control
      const sanctuaryView = document.getElementById('view-pet-sanctuary');
      if (sanctuaryView) {
        sanctuaryView.classList.add('hidden');
        sanctuaryView.style.display = 'none';
      }

      this.ensureDOM();
      this.container.classList.remove('hidden');
      this.container.style.display = 'flex';
      this.startLoop();
      this.updateHUD();
      this.sfx.playPaperRustle();
    }

    closeView() {
      if (this.container) {
        this.container.classList.add('hidden');
        this.container.style.setProperty('display', 'none', 'important');
        this.container.style.setProperty('visibility', 'hidden', 'important');
        this.container.style.setProperty('pointer-events', 'none', 'important');
      }
      this.stopLoop();
      this.saveState();
      this.syncWithStoredPets();
    }
  }

  // ============================================================================
  // 8. AUTO-INSTANCIACIÓN E INTEGRACIÓN GLOBAL
  // ============================================================================

  const instance = new PetEngine2D();
  global.PetEngine2D = instance;

  // Atajos globales
  global.openPetGameView = (petId) => instance.openView(petId);
  global.closePetGameView = () => instance.closeView();
  if (typeof global.closePetSanctuary !== 'function') {
    global.closePetSanctuary = function() {
      instance.closeView();
      const s = document.getElementById('view-pet-sanctuary');
      if (s) {
        s.classList.add('hidden');
        s.style.setProperty('display', 'none', 'important');
        s.style.setProperty('visibility', 'hidden', 'important');
        s.style.setProperty('pointer-events', 'none', 'important');
      }
      if (typeof global.returnToMainPortals === 'function') {
        global.returnToMainPortals();
      }
    };
  }
  global.togglePetGameView = (petId) => {
    if (instance.container && !instance.container.classList.contains('hidden')) {
      instance.closeView();
    } else {
      instance.openView(petId);
    }
  };

  // Enlazar ventana window.openPetRoom para abrir siempre el hábitat 2D de alta interactividad
  let _roomHandler = function (petId) {
    instance.openView(petId);
  };

  try {
    Object.defineProperty(global, 'openPetRoom', {
      configurable: true,
      enumerable: true,
      get() {
        return _roomHandler;
      },
      set(fn) {
        _roomHandler = function (petId) {
          instance.openView(petId);
        };
      }
    });
  } catch (_) {
    global.openPetRoom = function (petId) {
      instance.openView(petId);
    };
  }

  // Envolver navigateTo para soportar 'pet' y 'mascota'
  if (typeof global.navigateTo === 'function') {
    const origNav = global.navigateTo;
    global.navigateTo = function (viewId) {
      if (viewId === 'pet' || viewId === 'mascota' || viewId === 'pet-game') {
        instance.openView();
        return;
      }
      return origNav.apply(this, arguments);
    };
  }

  // Eliminación estricta de botón flotante intrusivo en el Menú Principal
  function ensureFloatingPetTrigger() {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('floatingPetButton');
    if (btn) btn.remove();
    const rogue = document.getElementById('masterpet-launcher-fab');
    if (rogue) rogue.remove();
  }

  if (typeof document !== 'undefined') {
    ensureFloatingPetTrigger();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ensureFloatingPetTrigger);
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = instance;
  }
})(typeof window !== 'undefined' ? window : globalThis);

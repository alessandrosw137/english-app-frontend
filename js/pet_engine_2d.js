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
  // 3. ETAPAS DE MADUREZ (4 LIFE STAGES)
  // ============================================================================

  const LIFE_STAGES = [
    {
      stage: 1,
      name: 'Newborn Casimerito',
      es: 'Recién Nacido',
      minXp: 0,
      scale: 0.72,
      headScale: 1.25,
      accessory: 'Diaper with Safety Pin',
      desc: 'Bebé diminuto con pañal de papel, chupón y ojitos gigantes llenos de curiosidad.'
    },
    {
      stage: 2,
      name: 'Curious Toddler',
      es: 'Pequeño Travieso',
      minXp: 280,
      scale: 0.88,
      headScale: 1.12,
      accessory: 'Paper Embroidered Bib',
      desc: 'Peques juguetones que gatean con su babero puesto y balbucean palabras en inglés.'
    },
    {
      stage: 3,
      name: 'Junior Explorer',
      es: 'Joven Explorador',
      minXp: 850,
      scale: 1.05,
      headScale: 1.0,
      accessory: 'Scout Bandana & Compass',
      desc: 'Joven enérgico con su pañuelo de explorador listo para aventuras al aire libre.'
    },
    {
      stage: 4,
      name: 'Wise Adult Master',
      es: 'Adulto Sabio',
      minXp: 1950,
      scale: 1.22,
      headScale: 0.92,
      accessory: 'Golden Cardboard Crown',
      desc: 'Mascota majestuosa con corona dorada de cartón, vocabulario fluido y porte orgulloso.'
    }
  ];

  // ============================================================================
  // 4. TIENDA DE CARTÓN: ALIMENTOS, POCIONES Y DISFRACES
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
      this.ctx = canvas.getContext('2d');
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

    // --------------------------------------------------------------------------
    // DIBUJO ARTICULADO DE LAS MASCOTAS EN CARTÓN
    // --------------------------------------------------------------------------

    drawPet(petState, mousePos = { x: 0, y: 0 }) {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const t = this.time;

      const spec = SPECIES_DATA[petState.species] || SPECIES_DATA.crocodile;
      const stageIdx = Math.min(3, Math.max(0, petState.stage - 1));
      const stage = LIFE_STAGES[stageIdx] || LIFE_STAGES[0];

      const centerX = w * 0.5;
      const floorY = h * 0.72;
      const petScale = stage.scale;

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

      // 1. Patitas traseras / Base
      [-42, 42].forEach((px) => {
        this.drawStitchedCardboard((c) => {
          c.ellipse(px, 48, 22, 14, 0, 0, Math.PI * 2);
        }, spec.accentColor, '#ffffff', 3);
      });

      // 2. Pancita / Cuerpo de Cartón
      // La barriga se ensancha visiblemente si está bien alimentado
      const bellyBonus = (petState.hunger / 100) * 16;
      this.drawStitchedCardboard((c) => {
        c.ellipse(0, 15, 52 + bellyBonus * 0.5, 48, 0, 0, Math.PI * 2);
      }, spec.baseColor, '#ffffff', 5);

      // Parche ventral de color claro (Belly plate)
      this.drawStitchedCardboard((c) => {
        c.ellipse(0, 18, 32 + bellyBonus * 0.35, 34, 0, 0, Math.PI * 2);
      }, spec.bellyColor, 'rgba(0,0,0,0.15)', 1);

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
        // Cola dentada con crestas de cartón
        this.drawStitchedCardboard((c) => {
          c.moveTo(45, 20);
          c.lineTo(95 + Math.sin(t * 4) * 8, 30);
          c.lineTo(85, 45);
          c.lineTo(40, 35);
          c.closePath();
        }, spec.baseColor, '#ffffff', 2);
      } else if (spec.id === 'dog' || spec.id === 'cat') {
        // Colita que se menea alegremente si está feliz
        const tailWag = Math.sin(t * (isHappy ? 12 : 3)) * 18;
        this.drawStitchedCardboard((c) => {
          c.moveTo(42, 25);
          c.quadraticCurveTo(75 + tailWag, 0, 80 + tailWag, -25);
          c.quadraticCurveTo(65 + tailWag, -25, 42, 35);
          c.closePath();
        }, spec.accentColor, '#ffffff', 2);
      } else if (spec.id === 'red_panda') {
        // Gran cola anillada de cartón
        this.drawStitchedCardboard((c) => {
          c.ellipse(65, 20, 36, 18, 0.35, 0, Math.PI * 2);
        }, spec.accentColor, '#fde68a', 3);
      }

      // 4. Cabeza articulada de cartón (escala por etapa)
      const headScale = stage.headScale;
      ctx.save();
      ctx.translate(0, -38);
      ctx.scale(headScale, headScale);

      // Orejas / Branquias según especie
      if (spec.id === 'cat' || spec.id === 'dog') {
        // Orejitas puntiagudas o caídas
        [-38, 38].forEach((ox, idx) => {
          this.drawStitchedCardboard((c) => {
            c.moveTo(ox, -22);
            c.lineTo(ox + (idx === 0 ? -18 : 18), -62);
            c.lineTo(ox + (idx === 0 ? 12 : -12), -38);
            c.closePath();
          }, spec.accentColor, '#ffffff', 2);
        });
      } else if (spec.id === 'axolotl') {
        // Branquias rosadas ramificadas de cartón
        [-48, 48].forEach((bx, idx) => {
          [-14, 0, 14].forEach((by) => {
            this.drawStitchedCardboard((c) => {
              c.ellipse(bx + (idx === 0 ? -12 : 12), by, 16, 7, (idx === 0 ? -0.3 : 0.3), 0, Math.PI * 2);
            }, '#ec4899', '#ffffff', 1);
          });
        });
      } else if (spec.id === 'rhinoceros') {
        // Cuerno de cartón en el hocico
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
      }, spec.baseColor, '#ffffff', 5);

      // Hocico extendido para cocodrilo
      if (spec.id === 'crocodile') {
        this.drawStitchedCardboard((c) => {
          c.ellipse(0, 14, 38, 20, 0, 0, Math.PI * 2);
        }, spec.baseColor, '#ffffff', 2);
        // Dientes de papel blanco
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

      // Cálculo de seguimiento del cursor
      const globalHeadX = centerX;
      const globalHeadY = baseY + (petState.isSleeping ? 0 : breathing) - 38 * petScale;
      const angleToMouse = Math.atan2(mousePos.y - globalHeadY, mousePos.x - globalHeadX);
      const pupilOffsetDist = Math.min(eyeRadius * 0.45, Math.hypot(mousePos.x - globalHeadX, mousePos.y - globalHeadY) * 0.04);
      const px = Math.cos(angleToMouse) * pupilOffsetDist;
      const py = Math.sin(angleToMouse) * pupilOffsetDist;

      // Parpadeo espontáneo
      const isBlinking = petState.blinkTimer > 0;

      [-eyeSpacing, eyeSpacing].forEach((ex) => {
        if (isSleeping || isBlinking) {
          // Ojos cerrados durmiendo o parpadeando
          ctx.strokeStyle = '#1e1b4b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(ex, eyeY, 9, 0.1, Math.PI - 0.1);
          ctx.stroke();
        } else {
          // Globo ocular de papel blanco
          this.drawStitchedCardboard((c) => {
            c.arc(ex, eyeY, eyeRadius, 0, Math.PI * 2);
          }, '#ffffff', 'rgba(0,0,0,0.15)', 2);

          // Iris de color
          ctx.fillStyle = spec.eyeColor;
          ctx.beginPath();
          ctx.arc(ex + px, eyeY + py, eyeRadius * 0.65, 0, Math.PI * 2);
          ctx.fill();

          // Pupila negra profunda
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(ex + px, eyeY + py, eyeRadius * 0.45, 0, Math.PI * 2);
          ctx.fill();

          // Brillo de recorte de papel blanco
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
        // Cejas caídas de tristeza o desánimo
        ctx.beginPath();
        ctx.moveTo(-32, -22);
        ctx.lineTo(-14, -26);
        ctx.moveTo(32, -22);
        ctx.lineTo(14, -26);
        ctx.stroke();
      } else {
        // Cejas alegres
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

      // Boca expresiva (abierta al comer, sonriente o triste)
      ctx.fillStyle = '#be123c';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2.5;

      if (isEating) {
        // Boca abierta masticando alegremente
        const mouthOpen = (Math.sin(t * 18) + 1) * 6 + 6;
        ctx.beginPath();
        ctx.ellipse(0, 16, 12, mouthOpen, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (isSad) {
        // Boca curvada hacia abajo
        ctx.beginPath();
        ctx.arc(0, 24, 11, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();
      } else {
        // Sonrisa feliz
        ctx.beginPath();
        ctx.arc(0, 10, 12, 0.2, Math.PI - 0.2);
        ctx.stroke();
      }

      // Chupón / Pacifier si está en Etapa 1 (Newborn)
      if (stage.stage === 1 && !isEating) {
        this.drawStitchedCardboard((c) => {
          c.arc(0, 18, 11, 0, Math.PI * 2);
        }, '#38bdf8', '#ffffff', 2);
        this.drawStitchedCardboard((c) => {
          c.arc(0, 24, 6, 0, Math.PI * 2);
        }, '#fef08a', '#ffffff', 1);
      }

      // Disfraces / Sombreros equipados
      if (petState.equippedHead) {
        if (petState.equippedHead === 'hat_crown' || stage.stage === 4) {
          // Corona dorada de cartón
          this.drawStitchedCardboard((c) => {
            c.moveTo(-28, -38);
            c.lineTo(-32, -68);
            c.lineTo(-14, -52);
            c.lineTo(0, -74);
            c.lineTo(14, -52);
            c.lineTo(32, -68);
            c.lineTo(28, -38);
            c.closePath();
          }, '#f59e0b', '#fef08a', 4);
        } else if (petState.equippedHead === 'hat_detective') {
          // Gorra Sherlock
          this.drawStitchedCardboard((c) => {
            c.ellipse(0, -42, 38, 14, 0, 0, Math.PI * 2);
          }, '#78716c', '#ffffff', 3);
        } else if (petState.equippedHead === 'hat_aviator') {
          // Gafas aviador
          [-16, 16].forEach((gx) => {
            this.drawStitchedCardboard((c) => {
              c.rect(gx - 12, -22, 24, 18);
            }, '#0284c7', '#d97706', 2);
          });
        }
      }

      ctx.restore(); // Fin de la cabeza

      // Pañal de papel en Etapa 1 (Newborn)
      if (stage.stage === 1) {
        this.drawStitchedCardboard((c) => {
          c.moveTo(-36, 18);
          c.lineTo(36, 18);
          c.lineTo(24, 52);
          c.lineTo(-24, 52);
          c.closePath();
        }, '#ffffff', '#cbd5e1', 3);
        // Alfiler de gancho de papel
        this.drawStitchedCardboard((c) => {
          c.arc(14, 32, 4, 0, Math.PI * 2);
        }, '#f59e0b', '#ffffff', 1);
      }

      // Babero de papel en Etapa 2 (Toddler)
      if (stage.stage === 2) {
        this.drawStitchedCardboard((c) => {
          c.moveTo(-22, -10);
          c.quadraticCurveTo(0, 32, 22, -10);
          c.quadraticCurveTo(0, 15, -22, -10);
          c.closePath();
        }, '#fef08a', '#e11d48', 2);
      }

      ctx.restore(); // Fin del dibujo de la mascota

      // 5. Partículas activas (Corazones, estrellas, burbujas de jabón)
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

      // Estado persistente
      this.state = {
        species: 'crocodile',
        nickname: 'Chomp Chomp',
        stage: 1,
        xp: 60,
        coins: 150,
        hunger: 80,
        energy: 85,
        hygiene: 70,
        happiness: 90,
        health: 100,
        equippedHead: 'hat_crown',
        equippedBack: null,
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
          // Calcular degradación suave según el tiempo transcurrido
          const elapsedMin = (Date.now() - (this.state.lastUpdated || Date.now())) / 60000;
          if (elapsedMin > 5) {
            const decay = Math.min(30, Math.floor(elapsedMin / 20));
            this.state.hunger = Math.max(10, this.state.hunger - decay);
            this.state.energy = Math.max(15, this.state.energy - decay);
            this.state.hygiene = Math.max(10, this.state.hygiene - decay);
            this.state.happiness = Math.max(15, this.state.happiness - decay);
          }
        }
      } catch (e) {
        console.warn('Error loading pet state:', e);
      }
    }

    saveState() {
      try {
        this.state.lastUpdated = Date.now();
        localStorage.setItem('mastereng_pet_state', JSON.stringify(this.state));
      } catch (e) {
        console.warn('Error saving pet state:', e);
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
      this.updateHUD();
    }

    setSpecies(speciesKey) {
      if (SPECIES_DATA[speciesKey]) {
        this.state.species = speciesKey;
        this.sfx.playPaperRustle();
        this.saveState();
        this.updateHUD();
      }
    }

    addExp(amount) {
      this.state.xp += amount;
      this.state.coins += Math.floor(amount * 0.4);

      // Evaluar si sube de etapa
      const oldStage = this.state.stage;
      for (let i = LIFE_STAGES.length - 1; i >= 0; i--) {
        if (this.state.xp >= LIFE_STAGES[i].minXp) {
          this.state.stage = LIFE_STAGES[i].stage;
          break;
        }
      }

      if (this.state.stage > oldStage) {
        this.sfx.playChime();
        if (this.renderer) {
          this.renderer.spawnConfetti(this.renderer.width * 0.5, this.renderer.height * 0.4, 40);
        }
        this.showToast(`🎉 ¡Tu mascota evolucionó a la Etapa ${this.state.stage}: ${LIFE_STAGES[this.state.stage - 1].name}!`);
      }

      this.saveState();
      this.updateHUD();
    }

    // --------------------------------------------------------------------------
    // ACCIONES DE CUIDADO Y APRENDIZAJE
    // --------------------------------------------------------------------------

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
      const speciesEl = document.getElementById('petHudSpecies');
      const stageEl = document.getElementById('petHudStage');
      const xpEl = document.getElementById('petHudXp');
      const coinsEl = document.getElementById('petHudCoins');
      const stage = LIFE_STAGES[Math.min(3, Math.max(0, this.state.stage - 1))];

      if (nameEl) nameEl.innerText = this.state.nickname;
      if (speciesEl) speciesEl.innerText = SPECIES_DATA[this.state.species]?.name || 'Crocodile';
      if (stageEl) stageEl.innerText = `Etapa ${this.state.stage}: ${stage.name}`;
      if (xpEl) xpEl.innerText = `${this.state.xp} XP`;
      if (coinsEl) coinsEl.innerText = `${this.state.coins} 🪙`;

      // Barras de progreso de necesidades
      const updateBar = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.style.width = `${Math.min(100, Math.max(0, val))}%`;
      };
      updateBar('petBarHunger', this.state.hunger);
      updateBar('petBarEnergy', this.state.energy);
      updateBar('petBarHygiene', this.state.hygiene);
      updateBar('petBarHappiness', this.state.happiness);
    }

    // --------------------------------------------------------------------------
    // MONTAJE DEL DOM Y VISTA INTEGRADA
    // --------------------------------------------------------------------------

    ensureDOM() {
      let viewEl = document.getElementById('view-pet-game');
      if (!viewEl) {
        viewEl = document.createElement('div');
        viewEl.id = 'view-pet-game';
        viewEl.className = 'fixed inset-0 z-40 bg-[#1e293b] flex flex-col hidden select-none overflow-hidden';
        viewEl.innerHTML = `
          <!-- CABECERA DE CARTÓN -->
          <div class="h-16 bg-[#caa778] border-b-4 border-[#78350f] flex items-center justify-between px-4 shadow-lg relative z-10"
               style="background-image: radial-gradient(#b45309 1px, transparent 1px); background-size: 14px 14px;">
            
            <!-- Info Mascota -->
            <div class="flex items-center gap-3">
              <button onclick="window.PetEngine2D.openSpeciesModal()"
                      class="w-10 h-10 rounded-full bg-[#fef3c7] border-2 border-[#b45309] flex items-center justify-center text-xl shadow active:scale-95 transition"
                      title="Cambiar Especie">
                🐾
              </button>
              <div>
                <div class="flex items-center gap-2">
                  <h2 id="petHudName" class="text-base font-black text-[#451a03]">Crocodile</h2>
                  <span id="petHudStage" class="text-[10px] font-bold bg-[#fef3c7] text-[#92400e] px-2 py-0.5 rounded-full border border-[#f59e0b]">
                    Etapa 1: Newborn
                  </span>
                </div>
                <p id="petHudSpecies" class="text-xs text-slate-700 font-semibold">Crocodile del Pantano</p>
              </div>
            </div>

            <!-- Monedas y Nivel -->
            <div class="flex items-center gap-3">
              <span id="petHudCoins" class="bg-[#fef3c7] text-[#78350f] px-3 py-1 rounded-full text-xs font-black border-2 border-[#b45309] shadow-sm">
                150 🪙
              </span>
              <span id="petHudXp" class="bg-[#ecfdf5] text-[#065f46] px-3 py-1 rounded-full text-xs font-black border-2 border-[#10b981] shadow-sm">
                60 XP
              </span>
              
              <!-- Botón Tienda -->
              <button onclick="window.PetEngine2D.openShopModal()"
                      class="px-3 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-black rounded-xl border-2 border-[#78350f] shadow active:translate-y-0.5">
                🛒 Tienda
              </button>

              <!-- Botón Salir -->
              <button onclick="window.PetEngine2D.closeView()"
                      class="w-9 h-9 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl font-black text-sm border-2 border-[#78350f] shadow active:translate-y-0.5 flex items-center justify-center">
                ✕
              </button>
            </div>
          </div>

          <!-- BARRAS DE ESTADO SUPERIORES -->
          <div class="bg-[#e6d5b8] px-4 py-1.5 border-b-2 border-[#b45309] flex items-center justify-around gap-2 text-[11px] font-bold text-slate-800">
            <div class="flex items-center gap-1.5 flex-1 max-w-[120px]">
              <span>🍖</span>
              <div class="flex-1 h-3 bg-white/70 rounded-full overflow-hidden border border-[#b45309]">
                <div id="petBarHunger" class="h-full bg-amber-500 rounded-full transition-all" style="width: 80%;"></div>
              </div>
            </div>
            <div class="flex items-center gap-1.5 flex-1 max-w-[120px]">
              <span>⚡</span>
              <div class="flex-1 h-3 bg-white/70 rounded-full overflow-hidden border border-[#b45309]">
                <div id="petBarEnergy" class="h-full bg-sky-500 rounded-full transition-all" style="width: 85%;"></div>
              </div>
            </div>
            <div class="flex items-center gap-1.5 flex-1 max-w-[120px]">
              <span>🧼</span>
              <div class="flex-1 h-3 bg-white/70 rounded-full overflow-hidden border border-[#b45309]">
                <div id="petBarHygiene" class="h-full bg-emerald-500 rounded-full transition-all" style="width: 70%;"></div>
              </div>
            </div>
            <div class="flex items-center gap-1.5 flex-1 max-w-[120px]">
              <span>❤️</span>
              <div class="flex-1 h-3 bg-white/70 rounded-full overflow-hidden border border-[#b45309]">
                <div id="petBarHappiness" class="h-full bg-rose-500 rounded-full transition-all" style="width: 90%;"></div>
              </div>
            </div>
          </div>

          <!-- LIENZO PRINCIPAL DEL JUEGO -->
          <div class="flex-1 relative overflow-hidden flex items-center justify-center">
            <canvas id="petGameCanvas" class="w-full h-full block cursor-pointer"></canvas>

            <!-- Paleta lateral de herramientas según habitación -->
            <div id="petRoomTools" class="absolute right-4 top-4 flex flex-col gap-2.5 z-20">
              <!-- Se puebla dinámicamente -->
            </div>
          </div>

          <!-- BARRA INFERIOR DE HABITACIONES -->
          <div class="h-16 bg-[#caa778] border-t-4 border-[#78350f] flex items-center justify-around px-2 z-10 shadow-2xl">
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
          </div>

          <!-- MODAL DE QUIZ PEDAGÓGICO -->
          <div id="petQuizModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 hidden"></div>

          <!-- MODAL DE TIENDA Y DISFRACES -->
          <div id="petShopModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 hidden"></div>

          <!-- MODAL DE SELECTOR DE ESPECIE -->
          <div id="petSpeciesModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 hidden"></div>
        `;

        document.body.appendChild(viewEl);
      }

      this.container = viewEl;
      this.canvas = document.getElementById('petGameCanvas');
      this.renderer = new CardboardRenderer(this.canvas);

      this.bindEvents();
      this.updateRoomTools();
    }

    bindEvents() {
      // Redimensionamiento
      const updateSize = () => {
        if (this.canvas && this.container) {
          const rect = this.canvas.parentElement.getBoundingClientRect();
          this.renderer.resize(rect.width, rect.height);
        }
      };
      window.addEventListener('resize', updateSize);
      setTimeout(updateSize, 100);

      // Movimiento del cursor y caricias
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = e.clientX - rect.left;
        this.mousePos.y = e.clientY - rect.top;
      });

      this.canvas.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Comprobar si tocó la mascota para acariciarla
        const petCenterX = this.renderer.width * 0.5;
        const petCenterY = this.renderer.height * 0.72 - 60;
        const dist = Math.hypot(clickX - petCenterX, clickY - petCenterY);

        if (dist < 90) {
          this.petAnimal(e.clientX, e.clientY);
        }
      });
    }

    updateRoomTools() {
      const toolBox = document.getElementById('petRoomTools');
      if (!toolBox) return;

      if (this.activeRoom === 'kitchen') {
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
                  title="Tallar con Esponja">🧽</button>
          <button onclick="window.PetEngine2D.triggerCareQuiz('verb_scrub')"
                  class="w-12 h-12 bg-[#ecfdf5] hover:bg-[#a7f3d0] border-2 border-[#059669] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Aprender Verbos de Baño">🧼</button>
        `;
      } else if (this.activeRoom === 'bedroom') {
        toolBox.innerHTML = `
          <button onclick="window.PetEngine2D.toggleBedtime()"
                  class="w-12 h-12 bg-[#fef3c7] hover:bg-[#fde68a] border-2 border-[#b45309] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Interruptor de Luz / Nana">💡</button>
          <button onclick="window.PetEngine2D.triggerCareQuiz('verb_tuck_in')"
                  class="w-12 h-12 bg-[#f3e8ff] hover:bg-[#e9d5ff] border-2 border-[#7e22ce] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Arropar en la Cama">🛌</button>
        `;
      } else if (this.activeRoom === 'playground') {
        toolBox.innerHTML = `
          <button onclick="window.PetEngine2D.playBall()"
                  class="w-12 h-12 bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#dc2626] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Lanzar Pelota de Cartón">⚽</button>
          <button onclick="window.PetEngine2D.openShopModal()"
                  class="w-12 h-12 bg-[#fef3c7] hover:bg-[#fde68a] border-2 border-[#b45309] rounded-2xl flex items-center justify-center text-2xl shadow active:scale-95 transition"
                  title="Guardarropa y Disfraces">👗</button>
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

    playBall() {
      this.sfx.playPop();
      if (this.renderer) {
        this.renderer.spawnConfetti(this.renderer.width * 0.5, this.renderer.height * 0.6, 15);
      }
      this.state.happiness = Math.min(100, this.state.happiness + 15);
      this.state.energy = Math.max(10, this.state.energy - 8);
      this.addExp(20);
      this.showToast('⚽ ¡Golazo! Jugando con la pelota de cartón.');
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

          <!-- Sección Alimentos -->
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

          <!-- Sección Disfraces y Accesorios VIP -->
          <h4 class="text-xs font-black text-[#9a3412] uppercase tracking-wider mt-6 mb-2">Disfraces & Coronas</h4>
          <div class="grid grid-cols-2 gap-2.5">
            ${SHOP_CATALOG.dressup
              .map(
                (item) => `
              <div class="bg-white p-3 rounded-2xl border border-[#e2d5bd] flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">${item.icon}</span>
                  <div>
                    <p class="text-xs font-bold text-slate-800">${item.name}</p>
                    ${item.isVip ? '<span class="text-[9px] bg-purple-100 text-purple-700 font-black px-1.5 py-0.5 rounded">VIP</span>' : '<span class="text-[9px] text-slate-400">Gratis / Básico</span>'}
                  </div>
                </div>
                <button onclick="window.PetEngine2D.equipItem('${item.id}')"
                        class="px-2.5 py-1 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-black rounded-lg shadow">
                  Equipar
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
      if (this.state.coins >= price) {
        this.state.coins -= price;
        this.feed(foodId);
        this.showToast('¡Compra exitosa! Mascota alimentada.');
      } else {
        this.showToast('🪙 Monedas insuficientes. ¡Responde trivias para ganar más!');
      }
    }

    equipItem(itemId) {
      const item = SHOP_CATALOG.dressup.find((d) => d.id === itemId);
      if (item) {
        this.state.equippedHead = itemId;
        this.sfx.playPaperRustle();
        this.showToast(`¡Equipado: ${item.name}!`);
        this.saveState();
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

      const loop = (now) => {
        this.animId = requestAnimationFrame(loop);
        if (this.renderer) {
          this.renderer.time = now * 0.001;

          // Decrementar temporizadores
          if (this.state.blinkTimer > 0) this.state.blinkTimer--;
          if (this.state.pettingTimer > 0) this.state.pettingTimer--;
          if (this.state.eatingTimer > 0) this.state.eatingTimer--;

          // Renderizar fondo y mascota
          this.renderer.renderRoomBackground(this.activeRoom, this.state.species, this.isLightsOff);
          this.renderer.drawPet(this.state, this.mousePos);
        }
      };

      this.animId = requestAnimationFrame(loop);
    }

    stopLoop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    openView() {
      this.ensureDOM();
      this.container.classList.remove('hidden');
      this.startLoop();
      this.updateHUD();
      this.sfx.playPaperRustle();
    }

    closeView() {
      if (this.container) {
        this.container.classList.add('hidden');
      }
      this.stopLoop();
      this.saveState();
    }
  }

  // ============================================================================
  // 8. AUTO-INSTANCIACIÓN E INTEGRACIÓN GLOBAL
  // ============================================================================

  const instance = new PetEngine2D();
  global.PetEngine2D = instance;

  // Atajos globales
  global.openPetGameView = () => instance.openView();
  global.closePetGameView = () => instance.closeView();
  global.togglePetGameView = () => {
    if (instance.container && !instance.container.classList.contains('hidden')) {
      instance.closeView();
    } else {
      instance.openView();
    }
  };

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

  // Inyectar botón flotante en el Hub principal para acceso rápido
  function ensureFloatingPetTrigger() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('floatingPetButton')) return;

    const btn = document.createElement('button');
    btn.id = 'floatingPetButton';
    btn.className = 'fixed bottom-5 left-5 z-30 bg-[#f59e0b] hover:bg-[#d97706] text-white px-4 py-2.5 rounded-full font-black text-xs shadow-2xl border-2 border-[#78350f] flex items-center gap-2 active:scale-95 transition';
    btn.style.boxShadow = '3px 4px 0px rgba(78, 52, 32, 0.45)';
    btn.innerHTML = '<span>🐾</span> <span>Mascota 2D</span>';
    btn.onclick = () => instance.openView();

    document.body.appendChild(btn);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ensureFloatingPetTrigger);
    } else {
      ensureFloatingPetTrigger();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = instance;
  }
})(typeof window !== 'undefined' ? window : globalThis);

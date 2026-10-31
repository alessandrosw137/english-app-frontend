/**
 * ============================================================================
 * MASTERENG - CULINARY STUDIO 2D: CARTOON HD COOKING & ENGLISH ACADEMY
 * Archivo: js/culinary_studio_2d.js
 *
 * Videojuego de cocina profesional 2D con estética Cartoon Ilustrada HD
 * (colores vibrantes, contornos limpios estilo cómic, animaciones de vapor,
 * fuego, burbujas, cortes de cuchillo y clientes animados).
 * Consume window.CulinaryDatabank con soporte autónomo y Diccionario Culinario.
 * ============================================================================
 */

(function (global) {
  'use strict';

  // ============================================================================
  // 1. DEFAULT CULINARY DATABANK (BASE DE DATOS GASTRONÓMICA AUTÓNOMA)
  // ============================================================================

  const DEFAULT_RECIPES = [
    {
      id: 'pan_seared_salmon',
      title: 'Pan-Seared Atlantic Salmon',
      titleEs: 'Salmón del Atlántico Sellado a la Sartén',
      category: 'Seafood',
      difficulty: 'Medium',
      customerRestrictions: ['no_butter', 'sauce_on_the_side'],
      freshIngredients: ['salmon_fillet', 'lemon', 'fresh_dill', 'garlic_cloves'],
      dryIngredients: ['olive_oil', 'white_wine', 'kosher_salt', 'black_pepper'],
      tools: ['chefs_knife', 'cutting_board', 'skillet', 'kitchen_tongs'],
      knifeTask: {
        ingredient: 'lemon',
        technique: 'wedges',
        nameEn: 'Cut into wedges',
        nameEs: 'Cortar en gajos limpios',
        ipa: '/wɛdʒɪz/',
        desc: 'Slice the fresh lemon into elegant wedges to accompany the seafood.',
        slicesRequired: 4
      },
      cookingSteps: [
        {
          prompt: 'Heat the skillet and add oil. When hot, place the salmon skin-side down.',
          promptEs: 'Calienta la sartén y agrega aceite. Al estar caliente, coloca el salmón con la piel hacia abajo.',
          targetHeat: 'high',
          targetDoneness: 'medium_rare',
          actionRequired: 'sear',
          labelEn: 'High Sear (Crispy Skin)',
          timeSec: 6
        },
        {
          prompt: 'Deglaze the pan with a splash of white wine to lift the fond!',
          promptEs: '¡Desglasa la sartén con un chorro de vino blanco para levantar los jugos!',
          actionRequired: 'deglaze',
          ingredientRequired: 'white_wine',
          labelEn: 'Deglaze with White Wine',
          timeSec: 5
        }
      ],
      plating: {
        sauceStyle: 'on_the_side',
        garnish: 'fresh_dill'
      }
    },
    {
      id: 'prime_ribeye_steak',
      title: 'Prime Ribeye Steak with Herb Crust',
      titleEs: 'Bife de Ribeye Prime con Costra de Hierbas',
      category: 'Butchery',
      difficulty: 'Hard',
      customerRestrictions: ['medium_rare', 'extra_pepper'],
      freshIngredients: ['ribeye_steak', 'rosemary', 'thyme', 'garlic_cloves', 'unsalted_butter'],
      dryIngredients: ['olive_oil', 'kosher_salt', 'black_pepper'],
      tools: ['chefs_knife', 'cutting_board', 'cast_iron_pan', 'kitchen_tongs', 'meat_thermometer'],
      knifeTask: {
        ingredient: 'garlic_cloves',
        technique: 'mince',
        nameEn: 'Mince finely',
        nameEs: 'Picar muy finamente',
        ipa: '/mɪns/',
        desc: 'Crush and finely mince the garlic cloves to infuse the basting butter.',
        slicesRequired: 6
      },
      cookingSteps: [
        {
          prompt: 'Sear the ribeye on high heat until a deep golden-brown crust forms (Maillard reaction).',
          promptEs: 'Sella el ribeye a fuego vivo hasta formar una costra dorada profunda (reacción de Maillard).',
          targetHeat: 'high',
          targetDoneness: 'medium_rare',
          actionRequired: 'sear',
          labelEn: 'High Sear Crust',
          timeSec: 7
        },
        {
          prompt: 'Baste the steak with melted butter, crushed garlic, and fresh rosemary (Arroser)!',
          promptEs: '¡Baña el filete con mantequilla derretida, ajo y romero fresco!',
          actionRequired: 'baste',
          ingredientRequired: 'unsalted_butter',
          labelEn: 'Baste with Butter (Arroser)',
          timeSec: 6
        }
      ],
      plating: {
        sauceStyle: 'over_dish',
        garnish: 'rosemary'
      }
    },
    {
      id: 'chicken_fettuccine_alfredo',
      title: 'Creamy Chicken Fettuccine Alfredo',
      titleEs: 'Fettuccine Alfredo Cremoso con Pollo a la Plancha',
      category: 'Pasta & Poultry',
      difficulty: 'Medium',
      customerRestrictions: ['no_mushrooms'],
      freshIngredients: ['chicken_breast', 'heavy_cream', 'parmesan_cheese', 'unsalted_butter', 'fresh_parsley'],
      dryIngredients: ['fettuccine_pasta', 'olive_oil', 'kosher_salt', 'black_pepper'],
      tools: ['chefs_knife', 'cutting_board', 'skillet', 'tongs', 'wire_whisk'],
      knifeTask: {
        ingredient: 'chicken_breast',
        technique: 'strips',
        nameEn: 'Cut into bite-sized strips',
        nameEs: 'Cortar en tiras tamaño bocado',
        ipa: '/strɪps/',
        desc: 'Slice the tender chicken breast across the grain into uniform strips.',
        slicesRequired: 5
      },
      cookingSteps: [
        {
          prompt: 'Sauté the chicken strips over medium-high heat until golden and tender.',
          promptEs: 'Saltea las tiras de pollo a fuego medio-alto hasta dorar.',
          targetHeat: 'med',
          targetDoneness: 'well_done',
          actionRequired: 'sear',
          labelEn: 'Sauté Chicken',
          timeSec: 6
        },
        {
          prompt: 'Lower the heat, pour heavy cream and whisk in parmesan cheese until velvety!',
          promptEs: '¡Baja el fuego, vierte la crema y bate el queso parmesano hasta que quede aterciopelado!',
          actionRequired: 'emulsify',
          ingredientRequired: 'parmesan_cheese',
          labelEn: 'Emulsify Sauce',
          timeSec: 5
        }
      ],
      plating: {
        sauceStyle: 'over_dish',
        garnish: 'fresh_parsley'
      }
    },
    {
      id: 'garlic_butter_prawns',
      title: 'Garlic Butter Tiger Prawns',
      titleEs: 'Langostinos Tigre al Ajillo y Vino Blanco',
      category: 'Seafood',
      difficulty: 'Easy',
      customerRestrictions: ['no_spicy'],
      freshIngredients: ['tiger_prawns', 'garlic_cloves', 'unsalted_butter', 'lemon', 'fresh_parsley'],
      dryIngredients: ['olive_oil', 'white_wine', 'kosher_salt', 'black_pepper'],
      tools: ['chefs_knife', 'cutting_board', 'skillet', 'kitchen_tongs'],
      knifeTask: {
        ingredient: 'fresh_parsley',
        technique: 'chiffonade',
        nameEn: 'Chop finely (Chiffonade)',
        nameEs: 'Picar finamente en cintas',
        ipa: '/ˌʃɪf.əˈnɑːd/',
        desc: 'Finely chop the fresh parsley to release fragrant aromatic oils.',
        slicesRequired: 4
      },
      cookingSteps: [
        {
          prompt: 'Quickly sear the prawns on high heat for 90 seconds per side until pink and curled.',
          promptEs: 'Sella rápidamente los langostinos a fuego alto por ambos lados.',
          targetHeat: 'high',
          targetDoneness: 'medium',
          actionRequired: 'sear',
          labelEn: 'Flash Sear Prawns',
          timeSec: 5
        },
        {
          prompt: 'Deglaze with white wine, swirl cold butter to create a glossy emulsion!',
          promptEs: '¡Desglasa con vino blanco y agrega mantequilla fría para una emulsión brillante!',
          actionRequired: 'deglaze',
          ingredientRequired: 'white_wine',
          labelEn: 'Deglaze & Mount Butter',
          timeSec: 5
        }
      ],
      plating: {
        sauceStyle: 'over_dish',
        garnish: 'fresh_parsley'
      }
    },
    {
      id: 'pan_roasted_duck_breast',
      title: 'Pan-Roasted Duck Breast with Balsamic Glaze',
      titleEs: 'Magret de Pato Asado con Glaseado Balsámico',
      category: 'Gourmet Poultry',
      difficulty: 'Hard',
      customerRestrictions: ['medium_doneness'],
      freshIngredients: ['duck_breast', 'fresh_thyme', 'shallots', 'unsalted_butter'],
      dryIngredients: ['balsamic_vinegar', 'chicken_stock', 'kosher_salt', 'black_pepper'],
      tools: ['chefs_knife', 'cutting_board', 'skillet', 'kitchen_tongs', 'meat_thermometer'],
      knifeTask: {
        ingredient: 'duck_breast',
        technique: 'score',
        nameEn: 'Score the skin (Diamond pattern)',
        nameEs: 'Marcar la piel en rombos',
        ipa: '/skɔːr/',
        desc: 'Score the fatty duck skin in a crosshatch pattern without cutting into the meat.',
        slicesRequired: 5
      },
      cookingSteps: [
        {
          prompt: 'Render the duck fat on low-medium heat until the skin is razor-crisp.',
          promptEs: 'Derrite la grasa a fuego medio-bajo hasta que la piel quede crujiente.',
          targetHeat: 'med',
          targetDoneness: 'medium',
          actionRequired: 'sear',
          labelEn: 'Render Fat & Sear',
          timeSec: 7
        },
        {
          prompt: 'Reduce balsamic vinegar with chicken stock into a syrupy glaze!',
          promptEs: '¡Reduce el vinagre balsámico con caldo hasta lograr un glaseado almibarado!',
          actionRequired: 'reduce',
          ingredientRequired: 'balsamic_vinegar',
          labelEn: 'Balsamic Reduction',
          timeSec: 5
        }
      ],
      plating: {
        sauceStyle: 'over_dish',
        garnish: 'fresh_thyme'
      }
    },
    {
      id: 'wild_mushroom_risotto',
      title: 'Wild Mushroom & Truffle Risotto',
      titleEs: 'Risotto de Hongos Silvestres y Trufa',
      category: 'Vegetarian Gourmet',
      difficulty: 'Hard',
      customerRestrictions: ['no_dairy_allergies_safe'],
      freshIngredients: ['mushrooms', 'shallots', 'garlic_cloves', 'parmesan_cheese', 'fresh_parsley', 'unsalted_butter'],
      dryIngredients: ['arborio_rice', 'vegetable_stock', 'white_wine', 'olive_oil', 'kosher_salt'],
      tools: ['chefs_knife', 'cutting_board', 'stockpot', 'wooden_spoon'],
      knifeTask: {
        ingredient: 'mushrooms',
        technique: 'slice',
        nameEn: 'Uniform slices',
        nameEs: 'Láminas uniformes',
        ipa: '/slaɪs/',
        desc: 'Slice the earthy button and cremini mushrooms to saute evenly.',
        slicesRequired: 5
      },
      cookingSteps: [
        {
          prompt: 'Toast the Arborio rice in olive oil until translucent around the edges.',
          promptEs: 'Tuesta el arroz arborio en aceite hasta que los bordes queden traslúcidos.',
          targetHeat: 'med',
          targetDoneness: 'medium',
          actionRequired: 'sear',
          labelEn: 'Toast Rice (Tostatura)',
          timeSec: 6
        },
        {
          prompt: 'Simmer and ladle hot stock while stirring vigorously (Mantecatura)!',
          promptEs: '¡Hierve a fuego lento y añade caldo mientras revuelves con fuerza!',
          actionRequired: 'simmer',
          ingredientRequired: 'white_wine',
          labelEn: 'Simmer & Mantecatura',
          timeSec: 6
        }
      ],
      plating: {
        sauceStyle: 'over_dish',
        garnish: 'fresh_parsley'
      }
    }
  ];

  const DEFAULT_INGREDIENTS = {
    // Butchery
    ribeye_steak: { nameEn: 'Ribeye Steak', nameEs: 'Bife de Ribeye', cat: 'butchery', icon: '🥩', ipa: '/ˈrɪb.aɪ steɪk/', desc: 'Marbled prime beef cut, renowned for supreme tenderness and rich flavor.' },
    chicken_breast: { nameEn: 'Chicken Breast', nameEs: 'Pechuga de Pollo', cat: 'butchery', icon: '🍗', ipa: '/ˈtʃɪk.ɪn brest/', desc: 'Lean white poultry meat ideal for quick searing and tender strips.' },
    duck_breast: { nameEn: 'Duck Breast (Magret)', nameEs: 'Magret de Pato', cat: 'butchery', icon: '🦆', ipa: '/dʌk brest/', desc: 'Rich, flavorful dark meat crowned with a thick layer of savory fat.' },
    pork_tenderloin: { nameEn: 'Pork Tenderloin', nameEs: 'Solomillo de Cerdo', cat: 'butchery', icon: '🥓', ipa: '/pɔːrk ˈten.dɚ.lɔɪn/', desc: 'Extraordinarily lean and mild cut of pork that cooks quickly.' },

    // Seafood
    salmon_fillet: { nameEn: 'Atlantic Salmon', nameEs: 'Filete de Salmón', cat: 'seafood', icon: '🐟', ipa: '/ˈsæm.ən ˈfɪl.ɪt/', desc: 'Rich oily fish packed with omega-3s, requiring a hot pan for crispy skin.' },
    tiger_prawns: { nameEn: 'Tiger Prawns', nameEs: 'Langostinos Tigre', cat: 'seafood', icon: '🦐', ipa: '/ˈtaɪ.ɡɚ prɑːnz/', desc: 'Jumbo succulent crustaceans that turn vibrant coral pink when seared.' },

    // Dairy & Eggs
    unsalted_butter: { nameEn: 'Unsalted Butter', nameEs: 'Mantequilla sin Sal', cat: 'dairy', icon: '🧈', ipa: '/ʌnˈsɔːl.tɪd ˈbʌt̬.ɚ/', desc: 'Pure sweet-cream butter for finishing pan sauces and basting steaks.' },
    heavy_cream: { nameEn: 'Heavy Cream', nameEs: 'Crema para Batir', cat: 'dairy', icon: '🥛', ipa: '/ˌhev.i ˈkriːm/', desc: 'High-fat dairy cream used for velvety sauces, soups, and ganache.' },
    parmesan_cheese: { nameEn: 'Parmesan Cheese', nameEs: 'Queso Parmesano', cat: 'dairy', icon: '🧀', ipa: '/ˈpɑːr.mə.zɑːn/', desc: 'Aged hard Italian cheese lending savory umami depth to dishes.' },

    // Produce & Herbs
    garlic_cloves: { nameEn: 'Garlic Cloves', nameEs: 'Dientes de Ajo', cat: 'produce', icon: '🧄', ipa: '/ˈɡɑːr.lɪk kloʊvz/', desc: 'Aromatic pungent bulb that mellows into sweet savory notes when cooked.' },
    yellow_onion: { nameEn: 'Yellow Onion', nameEs: 'Cebolla Amarilla', cat: 'produce', icon: '🧅', ipa: '/ˈjel.oʊ ˈʌn.jən/', desc: 'Foundational aromatic for building stocks, mirepoix, and braises.' },
    shallots: { nameEn: 'French Shallots', nameEs: 'Chalotas Francesas', cat: 'produce', icon: '🧅', ipa: '/ʃəˈlɑːts/', desc: 'Delicate allium with a mild garlic-onion nuance prized in French gastronomy.' },
    mushrooms: { nameEn: 'Button Mushrooms', nameEs: 'Champiñones Frescos', cat: 'produce', icon: '🍄', ipa: '/ˈmʌʃ.ruːmz/', desc: 'Earthy fungi that caramelize gorgeously in high-heat skillet preparations.' },
    lemon: { nameEn: 'Fresh Lemon', nameEs: 'Limón Amarillo', cat: 'produce', icon: '🍋', ipa: '/ˈlem.ən/', desc: 'Citrus providing bright acidity to cut through fatty proteins and sauces.' },
    fresh_dill: { nameEn: 'Fresh Dill', nameEs: 'Eneldo Fresco', cat: 'produce', icon: '🌿', ipa: '/frɛʃ dɪl/', desc: 'Feathery herb with distinctive anise notes, classical pairing with salmon.' },
    rosemary: { nameEn: 'Fresh Rosemary', nameEs: 'Romero Fresco', cat: 'produce', icon: '🌿', ipa: '/ˈroʊz.mer.i/', desc: 'Resinous piney woody herb indispensable for basting red meats.' },
    thyme: { nameEn: 'Fresh Thyme', nameEs: 'Tomillo Fresco', cat: 'produce', icon: '🌱', ipa: '/taɪm/', desc: 'Subtle earthy herb that complements poultry, stocks, and reductions.' },
    fresh_parsley: { nameEn: 'Flat-Leaf Parsley', nameEs: 'Perejil Fresco', cat: 'produce', icon: '🌿', ipa: '/ˈpɑːrs.li/', desc: 'Clean, herbaceous finishing garnish that adds freshness and vibrant green color.' },

    // Dry Pantry & Spices
    olive_oil: { nameEn: 'Extra Virgin Olive Oil', nameEs: 'Aceite de Oliva Extra Virgen', cat: 'dry', icon: '🫒', ipa: '/ˈɑː.lɪv ɔɪl/', desc: 'Cold-pressed fruity oil for searing, dressing, and marinades.' },
    white_wine: { nameEn: 'Dry White Wine', nameEs: 'Vino Blanco Seco', cat: 'dry', icon: '🍾', ipa: '/waɪt waɪn/', desc: 'High-acid cooking wine used to deglaze fond and enrich pan sauces.' },
    balsamic_vinegar: { nameEn: 'Aged Balsamic Vinegar', nameEs: 'Vinagre Balsámico Envejecido', cat: 'dry', icon: '🏺', ipa: '/bɔːlˈsæm.ɪk/', desc: 'Sweet, acidic dark Italian vinegar suitable for syrupy pan glazes.' },
    kosher_salt: { nameEn: 'Kosher Salt', nameEs: 'Sal Kosher', cat: 'dry', icon: '🧂', ipa: '/ˈkoʊ.ʃɚ sɑːlt/', desc: 'Coarse flake salt allowing precise tactile pinch control for seasoning.' },
    black_pepper: { nameEn: 'Coarse Black Pepper', nameEs: 'Pimienta Negra Molida', cat: 'dry', icon: '🧂', ipa: '/blæk ˈpep.ɚ/', desc: 'Cracked pungent peppercorns delivering warmth and floral aroma.' },
    fettuccine_pasta: { nameEn: 'Fettuccine Pasta', nameEs: 'Pasta Fettuccine', cat: 'dry', icon: '🍝', ipa: '/ˌfet̬.əˈtʃiː.ni/', desc: 'Flat thick ribbon pasta made from durum wheat semolina.' },
    arborio_rice: { nameEn: 'Arborio Rice', nameEs: 'Arroz Arborio', cat: 'dry', icon: '🍚', ipa: '/ɑːrˈbɔːr.i.oʊ/', desc: 'High-starch short-grain Italian rice yielding creamy risotto texture.' }
  };

  const DEFAULT_TOOLS = {
    chefs_knife: { nameEn: "Chef's Knife (8-inch)", nameEs: "Cuchillo de Chef (20cm)", icon: '🔪', ipa: '/ʃɛfs naɪf/', desc: 'The quintessential kitchen workhorse for slicing, dicing, and mincing.' },
    cutting_board: { nameEn: 'End-Grain Cutting Board', nameEs: 'Tabla de Corte de Madera', icon: '🪵', ipa: '/ˈkʌt̬.ɪŋ bɔːrd/', desc: 'Durable wooden surface designed to protect sharp blade edges.' },
    skillet: { nameEn: 'Stainless Steel Skillet', nameEs: 'Sartén de Acero Inoxidable', icon: '🍳', ipa: '/ˈskɪl.ɪt/', desc: 'Heavy pan ideal for searing proteins and building flavorful pan sauces.' },
    cast_iron_pan: { nameEn: 'Cast Iron Skillet', nameEs: 'Sartén de Hierro Fundido', icon: '🍳', ipa: '/kæst ˈaɪ.ɚn/', desc: 'Incredible heat retention for intense restaurant-grade steaks and crusts.' },
    kitchen_tongs: { nameEn: 'Stainless Steel Tongs', nameEs: 'Pinzas de Cocina', icon: '🥢', ipa: '/kɪtʃ.ən tɑːŋz/', desc: 'Extension of the chef’s hand for turning hot meats and tossing pasta.' },
    wire_whisk: { nameEn: 'Balloon Wire Whisk', nameEs: 'Batidor de Alambre', icon: '🥣', ipa: '/waɪɚ wɪsk/', desc: 'Essential tool for emulsifying sauces, vinaigrettes, and whipping cream.' },
    meat_thermometer: { nameEn: 'Digital Meat Thermometer', nameEs: 'Termómetro Digital de Cocina', icon: '🌡️', ipa: '/ˈmæt θɚˈmɑː.mə.t̬ɚ/', desc: 'Instant-read probe to guarantee exact culinary doneness without cutting.' },
    stockpot: { nameEn: 'Heavy Stockpot', nameEs: 'Olla Alta de Caldo', icon: '🍲', ipa: '/ˈstɑːk.pɑːt/', desc: 'Large deep vessel for boiling pasta, simmering stocks, and making risotto.' }
  };

  const CUSTOMER_PERSONAS = [
    {
      id: 'sophia_gourmet',
      name: 'Sophia Laurent',
      title: 'Food Critic & Sommelier',
      avatarColor: '#f43f5e',
      speechGreeting: 'Good evening Chef! I have heard wonderful things about your seafood.',
      speechRequest: "I'd love the Pan-Seared Atlantic Salmon, but I have a strict dairy allergy—please no butter, sear it with olive oil, and serve the sauce on the side!",
      requestEs: '¡Me encantaría el Salmón Sellado, pero tengo alergia a lácteos: sin mantequilla, séllalo con aceite de oliva y pon la salsa al lado!',
      acceptedDialogue: 'Certainly madame! We will sear the salmon in olive oil without butter and place the sauce on the side.',
      correctDialogueIndex: 0,
      dialogueOptions: [
        'Certainly madame! We will sear the salmon in olive oil without butter and place the sauce on the side.',
        'No problem, I will boil the salmon in milk with extra butter on top.',
        'We do not have fish today, here is a beef burger.'
      ]
    },
    {
      id: 'marcus_steak',
      name: 'Marcus Vance',
      title: 'Executive Gourmet',
      avatarColor: '#3b82f6',
      speechGreeting: 'Hello Chef! I crave a proper cut of beef tonight.',
      speechRequest: 'Could I get the Prime Ribeye Steak cooked medium-rare? Please baste it with butter and plenty of crushed garlic!',
      requestEs: '¿Podrías prepararme el Bife de Ribeye en término medio-rojo? ¡Báñalo con mantequilla y abundante ajo picado!',
      acceptedDialogue: 'Right away sir! Prime Ribeye seared medium-rare, basted with butter, rosemary, and minced garlic.',
      correctDialogueIndex: 1,
      dialogueOptions: [
        'Sure! I will burn it well-done with no seasoning at all.',
        'Right away sir! Prime Ribeye seared medium-rare, basted with butter, rosemary, and minced garlic.',
        'We only serve chicken pasta tonight.'
      ]
    },
    {
      id: 'clara_italian',
      name: 'Clara Rossi',
      title: 'Pasta Enthusiast',
      avatarColor: '#10b981',
      speechGreeting: 'Buonasera Chef! Looking forward to an authentic comforting meal.',
      speechRequest: 'I will order the Chicken Fettuccine Alfredo, but please hold the mushrooms. Make sure the sauce is rich and creamy!',
      requestEs: 'Ordenaré el Fettuccine Alfredo con pollo, pero sin champiñones. ¡Asegúrate de que la salsa quede bien cremosa!',
      acceptedDialogue: 'Delighted! Fettuccine Alfredo with tender chicken strips, velvety parmesan cream, and no mushrooms.',
      correctDialogueIndex: 2,
      dialogueOptions: [
        'Coming up! Extra spicy mushrooms with cold milk.',
        'I will fry the pasta in old oil with ketchup.',
        'Delighted! Fettuccine Alfredo with tender chicken strips, velvety parmesan cream, and no mushrooms.'
      ]
    }
  ];

  const RANKS = [
    { level: 1, title: 'Dishwasher & Commis', titleEs: 'Lavaplatos y Ayudante de Cocina', minScore: 0, badge: '🧼' },
    { level: 2, title: 'Line Cook (Chef de Partie)', titleEs: 'Cocinero de Línea (Chef de Partie)', minScore: 300, badge: '🔪' },
    { level: 3, title: 'Sous-Chef de Cuisine', titleEs: 'Segundo Jefe de Cocina (Sous-Chef)', minScore: 800, badge: '🍳' },
    { level: 4, title: 'Executive Chef', titleEs: 'Chef Ejecutivo de Restaurante', minScore: 1600, badge: '👨‍🍳' },
    { level: 5, title: 'Michelin Star Master Chef', titleEs: 'Maestro Culinario Estrella Michelin', minScore: 3000, badge: '⭐' }
  ];

  // ============================================================================
  // 2. PROCEDURAL SOUND SYNTHESIZER (WEB AUDIO API) & TTS (WEB SPEECH API)
  // ============================================================================

  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'bell') {
        // Double metallic chime (880Hz + 1760Hz)
        [880, 1760].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.04);
          gain.gain.setValueAtTime(0.3, now + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + i * 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.04);
          osc.stop(now + 1.25);
        });
      } else if (type === 'chop') {
        // Knife thud on wood board
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'sizzle') {
        // White noise burst with bandpass for pan frying
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3500;
        filter.Q.value = 1.8;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } else if (type === 'deglaze') {
        // Heavy liquid hiss
        const bufferSize = ctx.sampleRate * 0.6;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } else if (type === 'bubble') {
        // Sine popping bubble
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === 'coin') {
        // Bright coin chime
        [987, 1318].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.08);
          gain.gain.setValueAtTime(0.25, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + i * 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + 0.45);
        });
      } else if (type === 'fanfare') {
        // Michelin 5-star triad (C5, E5, G5, C6)
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.09);
          gain.gain.setValueAtTime(0.25, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + i * 0.09);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + 1.2);
        });
      } else if (type === 'wrong') {
        // Low error buzz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      }
    } catch (_) {}
  }

  function speakText(text, lang = 'en-US', rate = 1.0) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  }

  // ============================================================================
  // 3. SVG CARTOON ILLUSTRATION ENGINE
  // ============================================================================

  function getIngredientSvg(id) {
    switch (id) {
      case 'salmon_fillet':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><polygon points="8,32 56,18 52,46 12,42" fill="#fb923c" stroke="#c2410c" stroke-width="2.5"/><path d="M18,28 Q30,22 46,24" stroke="#fed7aa" stroke-width="2" fill="none"/><path d="M20,38 Q34,34 48,36" stroke="#fed7aa" stroke-width="2" fill="none"/><rect x="8" y="22" width="6" height="20" rx="3" fill="#ea580c"/></svg>`;
      case 'ribeye_steak':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><ellipse cx="32" cy="32" rx="24" ry="18" fill="#dc2626" stroke="#991b1b" stroke-width="2.5"/><path d="M20,24 Q32,18 42,26 Q36,36 22,34" fill="#fecaca"/><circle cx="28" cy="30" r="3" fill="#ffffff"/></svg>`;
      case 'chicken_breast':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><path d="M12,36 Q16,16 38,20 Q54,26 50,44 Q36,50 12,36 Z" fill="#fdba74" stroke="#c2410c" stroke-width="2.5"/><path d="M22,28 Q34,26 42,34" stroke="#ffedd5" stroke-width="2" fill="none"/></svg>`;
      case 'duck_breast':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><ellipse cx="32" cy="32" rx="24" ry="16" fill="#b91c1c" stroke="#7f1d1d" stroke-width="2.5"/><rect x="14" y="20" width="36" height="6" rx="3" fill="#fef08a"/><path d="M18,22 L46,22" stroke="#ca8a04" stroke-width="1.5"/></svg>`;
      case 'tiger_prawns':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><path d="M46,20 Q54,34 38,44 Q22,48 18,34 Q28,26 46,20 Z" fill="#f97316" stroke="#c2410c" stroke-width="2.5"/><path d="M48,16 L56,12" stroke="#ea580c" stroke-width="2"/><circle cx="48" cy="24" r="2.5" fill="#000"/></svg>`;
      case 'unsalted_butter':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><polygon points="12,28 32,16 52,24 32,38" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/><polygon points="12,28 32,38 32,48 12,38" fill="#fde047" stroke="#ca8a04" stroke-width="2"/><polygon points="32,38 52,24 52,34 32,48" fill="#eab308" stroke="#ca8a04" stroke-width="2"/></svg>`;
      case 'heavy_cream':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><rect x="20" y="24" width="24" height="30" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/><polygon points="20,24 32,14 44,24" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/><text x="32" y="42" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="middle">MILK</text></svg>`;
      case 'parmesan_cheese':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><polygon points="12,46 52,46 44,22 12,46" fill="#fde047" stroke="#ca8a04" stroke-width="2.5"/><circle cx="26" cy="38" r="2" fill="#ca8a04"/><circle cx="36" cy="40" r="3" fill="#ca8a04"/><circle cx="30" cy="30" r="2.5" fill="#ca8a04"/></svg>`;
      case 'lemon':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><ellipse cx="32" cy="32" rx="22" ry="16" fill="#facc15" stroke="#a16207" stroke-width="2.5"/><polygon points="10,32 6,32 8,30" fill="#a16207"/><polygon points="54,32 58,32 56,34" fill="#a16207"/></svg>`;
      case 'garlic_cloves':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><path d="M32,14 Q44,28 38,46 Q26,48 18,44 Q14,30 32,14 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/><line x1="32" y1="14" x2="30" y2="46" stroke="#cbd5e1" stroke-width="2"/></svg>`;
      case 'yellow_onion':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><ellipse cx="32" cy="36" rx="18" ry="18" fill="#d97706" stroke="#92400e" stroke-width="2.5"/><polygon points="32,12 28,20 36,20" fill="#65a30d"/></svg>`;
      case 'mushrooms':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><path d="M14,34 Q32,12 50,34 Z" fill="#d7ba9b" stroke="#78350f" stroke-width="2.5"/><rect x="26" y="34" width="12" height="16" rx="3" fill="#f5f5f4" stroke="#78350f" stroke-width="2"/></svg>`;
      case 'fresh_dill':
      case 'fresh_parsley':
      case 'rosemary':
      case 'thyme':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><path d="M32,54 Q32,24 44,14" stroke="#15803d" stroke-width="3" fill="none"/><ellipse cx="28" cy="36" rx="8" ry="4" fill="#22c55e" transform="rotate(-30 28 36)"/><ellipse cx="38" cy="26" rx="8" ry="4" fill="#22c55e" transform="rotate(30 38 26)"/></svg>`;
      case 'olive_oil':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><rect x="24" y="22" width="16" height="32" rx="4" fill="#84cc16" stroke="#4d7c0f" stroke-width="2"/><rect x="28" y="14" width="8" height="8" rx="2" fill="#ca8a04"/><circle cx="32" cy="36" r="4" fill="#facc15"/></svg>`;
      case 'white_wine':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><rect x="24" y="24" width="16" height="30" rx="3" fill="#22c55e" stroke="#15803d" stroke-width="2"/><rect x="28" y="12" width="8" height="12" rx="1" fill="#fde047"/></svg>`;
      case 'balsamic_vinegar':
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><rect x="22" y="24" width="20" height="30" rx="4" fill="#451a03" stroke="#1c1917" stroke-width="2"/><rect x="28" y="14" width="8" height="10" rx="2" fill="#b45309"/></svg>`;
      default:
        return `<svg viewBox="0 0 64 64" class="ingredient-illustration"><circle cx="32" cy="32" r="22" fill="#38bdf8" stroke="#0284c7" stroke-width="2.5"/><text x="32" y="38" font-size="18" text-anchor="middle" fill="#fff">🍴</text></svg>`;
    }
  }

  function getToolSvg(id) {
    switch (id) {
      case 'chefs_knife':
        return `<svg viewBox="0 0 64 64" class="tool-illustration"><path d="M12,44 L24,32 L20,28 L8,40 Z" fill="#78350f"/><path d="M24,32 Q44,28 54,14 Q46,38 28,36 Z" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/></svg>`;
      case 'cutting_board':
        return `<svg viewBox="0 0 64 64" class="tool-illustration"><rect x="10" y="16" width="44" height="32" rx="5" fill="#b45309" stroke="#78350f" stroke-width="2.5"/><rect x="14" y="20" width="36" height="24" rx="3" fill="#d97706"/></svg>`;
      case 'skillet':
      case 'cast_iron_pan':
        return `<svg viewBox="0 0 64 64" class="tool-illustration"><ellipse cx="28" cy="34" rx="18" ry="12" fill="#334155" stroke="#0f172a" stroke-width="2.5"/><rect x="42" y="30" width="16" height="6" rx="3" fill="#1e293b"/></svg>`;
      case 'kitchen_tongs':
        return `<svg viewBox="0 0 64 64" class="tool-illustration"><line x1="16" y1="16" x2="48" y2="34" stroke="#94a3b8" stroke-width="3"/><line x1="16" y1="48" x2="48" y2="34" stroke="#94a3b8" stroke-width="3"/></svg>`;
      case 'wire_whisk':
        return `<svg viewBox="0 0 64 64" class="tool-illustration"><rect x="14" y="44" width="8" height="8" fill="#64748b"/><path d="M22,44 Q44,24 50,14 Q34,44 22,44" stroke="#94a3b8" stroke-width="2" fill="none"/></svg>`;
      default:
        return `<svg viewBox="0 0 64 64" class="tool-illustration"><circle cx="32" cy="32" r="22" fill="#64748b"/><text x="32" y="38" font-size="18" text-anchor="middle" fill="#fff">🛠️</text></svg>`;
    }
  }

  function getCustomerAvatarSvg(persona) {
    const color = persona.avatarColor || '#38bdf8';
    return `
      <svg viewBox="0 0 160 200" class="customer-avatar-svg">
        <!-- Body / Chef jacket or suit -->
        <path d="M35,160 Q80,140 125,160 L135,200 L25,200 Z" fill="${color}" stroke="#0f172a" stroke-width="4"/>
        <path d="M65,150 L80,180 L95,150" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
        
        <!-- Neck -->
        <rect x="68" y="115" width="24" height="25" rx="4" fill="#fed7aa" stroke="#0f172a" stroke-width="3"/>
        
        <!-- Head -->
        <ellipse cx="80" cy="85" rx="42" ry="46" fill="#fed7aa" stroke="#0f172a" stroke-width="4"/>
        
        <!-- Hair -->
        <path d="M38,70 Q80,30 122,70 Q130,40 80,35 Q30,40 38,70 Z" fill="#451a03" stroke="#0f172a" stroke-width="4"/>
        
        <!-- Eyes & Eyebrows -->
        <circle cx="65" cy="82" r="5" fill="#0f172a"/>
        <circle cx="95" cy="82" r="5" fill="#0f172a"/>
        <circle cx="67" cy="80" r="1.5" fill="#ffffff"/>
        <circle cx="97" cy="80" r="1.5" fill="#ffffff"/>
        <path d="M56,72 Q65,68 74,72" stroke="#0f172a" stroke-width="3" fill="none"/>
        <path d="M86,72 Q95,68 104,72" stroke="#0f172a" stroke-width="3" fill="none"/>
        
        <!-- Nose -->
        <path d="M80,82 Q84,92 78,94" stroke="#d97706" stroke-width="3" fill="none"/>
        
        <!-- Smiling Mouth -->
        <path d="M66,104 Q80,118 94,104" stroke="#991b1b" stroke-width="3.5" fill="#fca5a5"/>
        
        <!-- Cheeks -->
        <circle cx="52" cy="95" r="7" fill="#f43f5e" opacity="0.4"/>
        <circle cx="108" cy="95" r="7" fill="#f43f5e" opacity="0.4"/>
      </svg>
    `;
  }

  // ============================================================================
  // 4. GAME STATE & LOCAL STORAGE PROFILE
  // ============================================================================

  const STORAGE_KEY = 'culinary_studio_profile_v1';

  function getProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {
      score: 0,
      coins: 50,
      ordersCompleted: 0,
      perfectOrders: 0,
      rankLevel: 1
    };
  }

  function saveProfile(prof) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prof));
    } catch (_) {}
  }

  const state = {
    isOpen: false,
    currentStation: 1,
    activeOrder: null,
    customerPersona: null,
    orderAccepted: false,
    selectedFresh: [],
    selectedDry: [],
    selectedTools: [],
    knifeCutsDone: 0,
    stoveHeat: 'off',
    stoveDoneness: 0, // 0 to 100%
    quickActionActive: null,
    platingSauceStyle: 'over_dish',
    platingGarnishDone: false,
    orderEvaluation: null,
    schoolItem: null,
    canvasAnimationIds: {}
  };

  // ============================================================================
  // 5. CANVAS RENDERERS (KNIFE BOARD, STOVE FLAMES, PLATING PASS)
  // ============================================================================

  function initCuttingBoardCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.clientWidth || 600);
    let height = (canvas.height = canvas.clientHeight || 350);

    const particles = [];

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Render wood board grain subtle lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      for (let i = 20; i < height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(10, i);
        ctx.lineTo(width - 10, i + Math.sin(i) * 6);
        ctx.stroke();
      }

      // Render active ingredient on the center of board
      const task = state.activeOrder ? state.activeOrder.knifeTask : null;
      const progress = task ? state.knifeCutsDone / task.slicesRequired : 0;

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw item
      ctx.save();
      ctx.translate(centerX, centerY);

      // Ingredient body
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 0, 80, 50, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cut marks on ingredient
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 3;
      const cutsCount = state.knifeCutsDone;
      for (let c = 1; c <= cutsCount; c++) {
        const xOffset = -60 + c * (120 / (task ? task.slicesRequired + 1 : 5));
        ctx.beginPath();
        ctx.moveTo(xOffset, -40);
        ctx.lineTo(xOffset, 40);
        ctx.stroke();
      }

      ctx.restore();

      // Particles update & draw
      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.3; // gravity
        pt.alpha -= 0.03;
        if (pt.alpha <= 0) {
          particles.splice(p, 1);
          continue;
        }
        ctx.fillStyle = `rgba(251, 191, 36, ${pt.alpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      state.canvasAnimationIds.cutting = requestAnimationFrame(render);
    }

    render();

    // Trigger slice effect
    canvas.onCutClick = function (e) {
      playSound('chop');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < 8; i++) {
        particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 6,
          vy: -Math.random() * 5 - 2,
          size: Math.random() * 4 + 2,
          alpha: 1.0
        });
      }
    };
  }

  function initStovetopCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.clientWidth || 500);
    let height = (canvas.height = canvas.clientHeight || 280);

    const bubbles = [];
    const flames = [];

    function render() {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 30;

      // Draw gas flames underneath skillet
      if (state.stoveHeat !== 'off') {
        const flameHeight = state.stoveHeat === 'high' ? 36 : state.stoveHeat === 'med' ? 24 : 14;
        const flameColor = state.stoveHeat === 'high' ? '#ef4444' : state.stoveHeat === 'med' ? '#f97316' : '#38bdf8';

        for (let fx = cx - 90; fx <= cx + 90; fx += 18) {
          const jitter = Math.random() * 8;
          ctx.fillStyle = flameColor;
          ctx.beginPath();
          ctx.moveTo(fx - 7, cy + 30);
          ctx.quadraticCurveTo(fx, cy + 30 - flameHeight - jitter, fx + 7, cy + 30);
          ctx.fill();

          // Inner blue core
          ctx.fillStyle = '#67e8f9';
          ctx.beginPath();
          ctx.moveTo(fx - 3, cy + 30);
          ctx.quadraticCurveTo(fx, cy + 30 - flameHeight * 0.5, fx + 3, cy + 30);
          ctx.fill();
        }
      }

      // Draw Skillet body
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 110, 48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Skillet inner pan surface
      const crustColor = state.stoveDoneness > 70 ? '#78350f' : state.stoveDoneness > 40 ? '#b45309' : '#f59e0b';
      ctx.fillStyle = crustColor;
      ctx.beginPath();
      ctx.ellipse(cx, cy - 2, 95, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      // Food searing in pan
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy - 6, 50, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Sizzle / steam particles
      if (state.stoveHeat !== 'off') {
        if (Math.random() < 0.4) {
          bubbles.push({
            x: cx + (Math.random() - 0.5) * 80,
            y: cy + (Math.random() - 0.5) * 20,
            vy: -Math.random() * 2 - 1,
            size: Math.random() * 5 + 3,
            alpha: 0.8
          });
        }
      }

      for (let b = bubbles.length - 1; b >= 0; b--) {
        const bb = bubbles[b];
        bb.y += bb.vy;
        bb.alpha -= 0.02;
        if (bb.alpha <= 0) {
          bubbles.splice(b, 1);
          continue;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${bb.alpha})`;
        ctx.beginPath();
        ctx.arc(bb.x, bb.y, bb.size, 0, Math.PI * 2);
        ctx.fill();
      }

      state.canvasAnimationIds.stovetop = requestAnimationFrame(render);
    }

    render();
  }

  function initPlatingCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.clientWidth || 440);
    let height = (canvas.height = canvas.clientHeight || 300);

    function render() {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Draw elegant porcelain plate
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 140, 85, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Plate inner well
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 105, 60, 0, 0, Math.PI * 2);
      ctx.fill();

      // Seared Protein
      ctx.fillStyle = '#b45309';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 55, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Sauce
      if (state.platingSauceStyle === 'over_dish') {
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cx - 40, cy - 5);
        ctx.quadraticCurveTo(cx, cy - 20, cx + 40, cy + 5);
        ctx.stroke();
      } else {
        // Ramekin on the side
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx + 80, cy - 20, 22, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.ellipse(cx + 80, cy - 20, 16, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Garnish
      if (state.platingGarnishDone) {
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.ellipse(cx, cy - 10, 8, 4, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 10, cy - 12, 8, 4, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    render();
    state.renderPlating = render;
  }

  // ============================================================================
  // 6. CULINARY STUDIO CONTROLLER & DOM CREATION
  // ============================================================================

  const CulinaryStudio2D = {
    rootEl: null,

    init: function (containerId) {
      if (this.rootEl) return;
      let target = null;
      if (containerId) {
        target = document.getElementById(containerId);
      }
      if (!target) {
        let el = document.getElementById('culinary-studio-root');
        if (!el) {
          el = document.createElement('div');
          el.id = 'culinary-studio-root';
          el.style.display = 'none';
          document.body.appendChild(el);
        }
        target = el;
      }
      this.rootEl = target;
      this.buildDOM();
    },

    buildDOM: function () {
      this.rootEl.innerHTML = `
        <!-- TOP BAR / HEADER -->
        <header class="culinary-top-bar">
          <div class="culinary-brand-group">
            <div class="culinary-logo-badge">👨‍🍳</div>
            <div class="culinary-title-wrap">
              <span class="culinary-title">MasterChef 2D Studio</span>
              <span class="culinary-subtitle">English Gourmet Academy</span>
            </div>
          </div>

          <!-- 6 STATION TABS -->
          <nav class="culinary-station-tabs" id="culinaryStationTabs">
            <button class="culinary-station-tab active" data-station="1">
              <span class="tab-icon">🔔</span>
              <span>1. Order</span>
            </button>
            <button class="culinary-station-tab" data-station="2">
              <span class="tab-icon">❄️</span>
              <span>2. Fridge</span>
            </button>
            <button class="culinary-station-tab" data-station="3">
              <span class="tab-icon">🏺</span>
              <span>3. Pantry & Tools</span>
            </button>
            <button class="culinary-station-tab" data-station="4">
              <span class="tab-icon">🔪</span>
              <span>4. Prep & Cuts</span>
            </button>
            <button class="culinary-station-tab" data-station="5">
              <span class="tab-icon">🔥</span>
              <span>5. Stovetop & Heat</span>
            </button>
            <button class="culinary-station-tab" data-station="6">
              <span class="tab-icon">🍽️</span>
              <span>6. Plating & Pass</span>
            </button>
          </nav>

          <!-- HEADER ACTIONS -->
          <div class="culinary-header-actions">
            <button class="culinary-btn-action culinary-btn-school" id="btnOpenChefSchool">
              <span>🎓</span>
              <span>Chef Academy</span>
            </button>
            <button class="culinary-btn-action culinary-btn-close" id="btnCloseCulinaryStudio">
              <span>✕</span>
            </button>
          </div>
        </header>

        <!-- TICKET RAIL -->
        <div class="culinary-ticket-rail" id="culinaryTicketRail">
          <div class="culinary-ticket-holder" id="culinaryTicketHolder">
            <div class="culinary-ticket" id="activeOrderTicket">
              <span class="ticket-number">#101</span>
              <span class="ticket-dish-name">Pan-Seared Salmon</span>
              <div class="ticket-specs">
                <span class="ticket-spec-tag">NO BUTTER</span>
                <span class="ticket-spec-tag blue">SAUCE ON SIDE</span>
              </div>
            </div>
          </div>

          <div class="culinary-stats-summary">
            <div class="culinary-stat-item">
              <span>⭐ Rank:</span>
              <span class="val" id="statChefRank">Commis</span>
            </div>
            <div class="culinary-stat-item">
              <span>🪙 Coins:</span>
              <span class="val" id="statChefCoins">50</span>
            </div>
          </div>
        </div>

        <!-- MAIN VIEWPORT / 6 STATIONS -->
        <main class="culinary-viewport">
          <!-- STATION 1: ORDER COUNTER -->
          <section class="culinary-station-view active" id="stationView1">
            <div class="counter-stage">
              <div class="customer-diorama">
                <div class="restaurant-backdrop"></div>
                <div class="window-frame"></div>
                <div class="customer-avatar-box" id="customerAvatarContainer"></div>
                <div class="wooden-counter">
                  <svg viewBox="0 0 48 40" class="service-bell" id="serviceBellBtn">
                    <path d="M8,32 L40,32 L40,36 L8,36 Z" fill="#b45309"/>
                    <path d="M12,32 Q24,8 36,32 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
                    <rect x="22" y="4" width="4" height="6" rx="2" fill="#d97706"/>
                  </svg>
                  <span style="font-weight: 800; font-size: 0.82rem; color: #fde047;">Touch Bell to Call Next Guest</span>
                </div>
              </div>

              <div class="order-dialogue-card">
                <div class="dialogue-bubble">
                  <button class="bubble-tts-btn" id="btnCustomerTts" title="Listen to pronunciation">🔊</button>
                  <div class="bubble-text-en" id="dialogueTextEn">"Good evening Chef! ..."</div>
                  <div class="bubble-text-es" id="dialogueTextEs">"¡Buenas noches Chef! ..."</div>
                </div>

                <div class="dialogue-instruction">
                  <span>💬 Choose Brigade Confirmation Response:</span>
                </div>

                <div class="dialogue-choices" id="dialogueChoicesContainer"></div>
              </div>
            </div>
          </section>

          <!-- STATION 2: WALK-IN FRIDGE -->
          <section class="culinary-station-view" id="stationView2">
            <div class="fridge-container">
              <div class="fridge-header-shelf">
                <div class="fridge-temp-display">
                  <span>❄️ Walk-in Temp:</span>
                  <span>3.2°C (38°F)</span>
                </div>
                <div class="fridge-category-tabs">
                  <button class="fridge-cat-btn active" data-cat="all">All Fresh</button>
                  <button class="fridge-cat-btn" data-cat="butchery">🥩 Butchery</button>
                  <button class="fridge-cat-btn" data-cat="seafood">🐟 Seafood</button>
                  <button class="fridge-cat-btn" data-cat="dairy">🧀 Dairy & Eggs</button>
                  <button class="fridge-cat-btn" data-cat="produce">🥦 Produce & Herbs</button>
                </div>
              </div>

              <div class="fridge-shelves-grid" id="fridgeShelvesGrid"></div>

              <div class="mise-en-place-tray">
                <div class="tray-label-wrap">
                  <span class="tray-title">🍱 Mise en Place Tray</span>
                  <span class="tray-subtitle">Gather ingredients for the active order ticket</span>
                </div>
                <div class="tray-items-container" id="trayItemsContainer"></div>
                <button class="tray-advance-btn" id="btnAdvanceToPantry">
                  <span>Next: Pantry & Tools →</span>
                </button>
              </div>
            </div>
          </section>

          <!-- STATION 3: DRY PANTRY & TOOLS -->
          <section class="culinary-station-view" id="stationView3">
            <div class="pantry-stage">
              <div class="pantry-shelf-panel">
                <div class="panel-header-badge">
                  <span class="panel-title">🏺 Dry Pantry & Seasonings</span>
                  <span style="font-size: 0.75rem; color: #38bdf8;">Click to add to recipe</span>
                </div>
                <div class="fridge-shelves-grid" id="pantryShelvesGrid"></div>
              </div>

              <div class="tools-wall-panel">
                <div class="panel-header-badge">
                  <span class="panel-title">🔪 Magnetic Tool Wall</span>
                  <span style="font-size: 0.75rem; color: #fbbf24;">Select required utensils</span>
                </div>
                <div class="tools-grid" id="toolsWallGrid"></div>
                <button class="tray-advance-btn" style="margin-top: auto;" id="btnAdvanceToPrep">
                  <span>Next: Cutting Board →</span>
                </button>
              </div>
            </div>
          </section>

          <!-- STATION 4: PREP & KNIFE SKILLS -->
          <section class="culinary-station-view" id="stationView4">
            <div class="prep-stage">
              <div class="prep-challenge-card">
                <div>
                  <div class="prep-challenge-title" id="knifeTaskTitle">Knife Skill: Cut into wedges</div>
                  <div class="prep-challenge-desc" id="knifeTaskDesc">Slice the fresh lemon into elegant wedges.</div>
                </div>
                <button class="bubble-tts-btn" style="position: static;" id="btnKnifeTts">🔊</button>
              </div>

              <div class="cutting-board-stage" id="cuttingBoardStage">
                <canvas class="cutting-canvas" id="cuttingBoardCanvas"></canvas>
                <div class="knife-action-hint">👆 Tap or click anywhere on the cutting board to slice!</div>
              </div>

              <div class="cut-progress-bar-wrap">
                <div class="cut-progress-fill" id="cutProgressFill"></div>
                <div class="cut-progress-text" id="cutProgressText">0 / 4 Cuts Completed</div>
              </div>

              <button class="tray-advance-btn" id="btnAdvanceToStove" style="display: none;">
                <span>Ingredients Prepped! Move to Stovetop →</span>
              </button>
            </div>
          </section>

          <!-- STATION 5: STOVETOP & HEAT -->
          <section class="culinary-station-view" id="stationView5">
            <div class="cooking-stage">
              <div class="stovetop-range">
                <div class="skillet-pan-stage">
                  <canvas class="cooking-canvas" id="stovetopCanvas"></canvas>
                </div>

                <div class="stovetop-controls">
                  <span style="font-weight: 800; font-size: 0.85rem; color: #38bdf8;">🔥 Gas Burner Heat:</span>
                  <div class="heat-level-selector">
                    <button class="heat-btn" data-heat="off">OFF</button>
                    <button class="heat-btn" data-heat="low">LOW</button>
                    <button class="heat-btn" data-heat="med">MEDIUM</button>
                    <button class="heat-btn active high" data-heat="high">HIGH SEAR</button>
                  </div>
                </div>
              </div>

              <div class="cooking-dashboard">
                <div class="thermometer-card">
                  <div class="thermo-header">
                    <span class="thermo-title">🌡️ Digital Meat Thermometer</span>
                    <span class="doneness-label" id="donenessLabel">Rare (50°C)</span>
                  </div>
                  <div class="thermo-gauge-track">
                    <div class="thermo-gauge-indicator" id="thermoIndicator" style="left: 20%;"></div>
                  </div>
                  <div class="thermo-ticks">
                    <span>Rare</span>
                    <span>Med-Rare ⭐</span>
                    <span>Medium</span>
                    <span>Well Done</span>
                  </div>
                </div>

                <div class="quick-action-card" id="quickActionCard">
                  <div class="quick-action-header">
                    <span>⚡ Chef Quick-Time Event!</span>
                  </div>
                  <div class="quick-action-prompt" id="quickActionPrompt">
                    "Deglaze the pan with white wine to lift caramelized fond!"
                  </div>
                  <div class="quick-action-buttons">
                    <button class="action-trigger-btn" id="btnAction1">Deglaze with White Wine</button>
                    <button class="action-trigger-btn" id="btnAction2">Add Cold Water</button>
                  </div>
                </div>

                <button class="tray-advance-btn" id="btnAdvanceToPlating" style="margin-top: auto;">
                  <span>Cooked to Perfection! Go to Plating Pass →</span>
                </button>
              </div>
            </div>
          </section>

          <!-- STATION 6: PLATING PASS -->
          <section class="culinary-station-view" id="stationView6">
            <div class="plating-stage">
              <div class="pass-counter-stage">
                <div class="heat-lamps-rig">
                  <div class="heat-lamp"></div>
                  <div class="heat-lamp"></div>
                  <div class="heat-lamp"></div>
                </div>

                <canvas class="gourmet-plate-canvas" id="platingCanvas"></canvas>

                <div class="service-call-strip">
                  <span style="font-weight: 800; font-size: 0.9rem; color: #f8fafc;">Order Ready for Guest Delivery:</span>
                  <button class="btn-service-call" id="btnOrderUpCall">
                    <span>🔔</span>
                    <span>"Hands please! Order up!"</span>
                  </button>
                </div>
              </div>

              <div class="plating-side-panel">
                <div class="sauce-garnish-card">
                  <span style="font-weight: 800; font-size: 0.95rem; color: #fff;">1. Sauce Placement:</span>
                  <div class="sauce-option-group">
                    <button class="sauce-option-btn active" data-sauce="over_dish">Drizzle Over Dish</button>
                    <button class="sauce-option-btn" data-sauce="on_the_side">Sauce on the Side (Ramekin)</button>
                  </div>
                </div>

                <div class="sauce-garnish-card">
                  <span style="font-weight: 800; font-size: 0.95rem; color: #fff;">2. Fresh Herb Garnish:</span>
                  <div class="garnish-chips-container">
                    <button class="garnish-chip active" data-garnish="fresh_dill">🌿 Fresh Dill Sprig</button>
                    <button class="garnish-chip" data-garnish="fresh_parsley">🌿 Flat-Leaf Parsley</button>
                    <button class="garnish-chip" data-garnish="rosemary">🌿 Rosemary</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <!-- EVALUATION MODAL -->
        <div class="culinary-evaluation-overlay" id="culinaryEvaluationModal">
          <div class="michelin-eval-card">
            <span class="eval-rank-badge" id="evalRankTitle">Line Cook</span>
            <span class="eval-dish-title" id="evalDishTitle">Pan-Seared Atlantic Salmon</span>
            <div class="michelin-stars-row" id="evalStarsRow">⭐⭐⭐⭐⭐</div>

            <div class="eval-breakdown-list">
              <div class="breakdown-row">
                <span>Guest Dietary Restrictions:</span>
                <span class="score" id="scoreRestrictions">100% (No Allergens)</span>
              </div>
              <div class="breakdown-row">
                <span>Doneness & Temperature:</span>
                <span class="score" id="scoreDoneness">Medium-Rare Optimal</span>
              </div>
              <div class="breakdown-row">
                <span>Knife Technique Precision:</span>
                <span class="score" id="scoreKnife">Flawless Wedges</span>
              </div>
              <div class="breakdown-row">
                <span>Brigada English Communication:</span>
                <span class="score" id="scoreEnglish">+50 XP</span>
              </div>
            </div>

            <div class="eval-tip-box" id="evalTipText">
              "Outstanding service, Chef! The customer was thrilled with the crispy salmon skin and having the dill sauce served on the side."
            </div>

            <div class="eval-actions-group">
              <button class="btn-eval-continue" id="btnNextGuest">Next Guest Order →</button>
              <button class="btn-eval-school" id="btnVisitAcademyFromEval">Chef Academy</button>
            </div>
          </div>
        </div>

        <!-- CHEF ACADEMY (DICCIONARIO MODAL) -->
        <div class="culinary-school-modal" id="culinarySchoolModal">
          <div class="school-card">
            <div class="school-header">
              <span class="school-title">🎓 MasterChef Gastronomic Academy</span>
              <button class="culinary-btn-action culinary-btn-close" id="btnCloseChefSchool">✕</button>
            </div>

            <div class="school-item-profile">
              <div id="schoolItemImg"></div>
              <div class="school-item-texts">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="school-term-en" id="schoolTermEn">Pan-Seared</span>
                  <button class="bubble-tts-btn" style="position:static;" id="btnSchoolTts">🔊</button>
                </div>
                <span class="school-term-ipa" id="schoolTermIpa">/pæn sɪəd/</span>
                <span class="school-term-es" id="schoolTermEs">Sellado a la sartén</span>
              </div>
            </div>

            <div class="school-info-section">
              <span class="school-section-title">Professional Gastronomic Role</span>
              <div class="school-section-content" id="schoolDesc">
                Cooking technique where the surface of the food is cooked at high temperature until a caramelized browned crust forms.
              </div>
            </div>

            <div class="school-info-section">
              <span class="school-section-title">Kitchen Brigade Example</span>
              <div class="school-section-content" id="schoolExample" style="color: #38bdf8; font-style: italic;">
                "Chef, the Atlantic salmon is pan-seared to medium-rare; plate is walking!"
              </div>
            </div>
          </div>
        </div>
      `;

      this.bindEvents();
      this.initCanvases();
    },

    bindEvents: function () {
      const root = this.rootEl;

      // Close Button
      root.querySelector('#btnCloseCulinaryStudio').addEventListener('click', () => {
        this.close();
      });

      // Station Navigation Tabs
      root.querySelectorAll('.culinary-station-tab').forEach((tab) => {
        tab.addEventListener('click', (e) => {
          const st = parseInt(tab.dataset.station, 10);
          this.switchStation(st);
        });
      });

      // Service Bell
      root.querySelector('#serviceBellBtn').addEventListener('click', () => {
        playSound('bell');
        this.startNewOrder();
      });

      // Customer Dialogue TTS
      root.querySelector('#btnCustomerTts').addEventListener('click', () => {
        if (state.customerPersona) {
          speakText(state.customerPersona.speechRequest);
        }
      });

      // Advance Buttons
      root.querySelector('#btnAdvanceToPantry').addEventListener('click', () => {
        this.switchStation(3);
      });
      root.querySelector('#btnAdvanceToPrep').addEventListener('click', () => {
        this.switchStation(4);
      });
      root.querySelector('#btnAdvanceToStove').addEventListener('click', () => {
        this.switchStation(5);
      });
      root.querySelector('#btnAdvanceToPlating').addEventListener('click', () => {
        this.switchStation(6);
      });

      // Stovetop Heat Selector
      root.querySelectorAll('.heat-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          root.querySelectorAll('.heat-btn').forEach((b) => b.classList.remove('active', 'low', 'med', 'high'));
          const h = btn.dataset.heat;
          state.stoveHeat = h;
          if (h !== 'off') {
            btn.classList.add('active', h);
            playSound('sizzle');
          }
        });
      });

      // Cutting Board Click
      const cBoard = root.querySelector('#cuttingBoardCanvas');
      cBoard.addEventListener('click', (e) => {
        if (cBoard.onCutClick) cBoard.onCutClick(e);
        this.handleKnifeSlice();
      });

      // Quick Actions
      root.querySelector('#btnAction1').addEventListener('click', () => {
        playSound('deglaze');
        speakText('Deglazing with white wine!');
        root.querySelector('#quickActionCard').style.display = 'none';
        state.quickActionActive = null;
      });
      root.querySelector('#btnAction2').addEventListener('click', () => {
        playSound('wrong');
        speakText('Never add cold water to hot fond!');
      });

      // Sauce Options
      root.querySelectorAll('.sauce-option-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          root.querySelectorAll('.sauce-option-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          state.platingSauceStyle = btn.dataset.sauce;
          if (state.renderPlating) state.renderPlating();
        });
      });

      // Garnish Options
      root.querySelectorAll('.garnish-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          root.querySelectorAll('.garnish-chip').forEach((c) => c.classList.remove('active'));
          chip.classList.add('active');
          state.platingGarnishDone = true;
          if (state.renderPlating) state.renderPlating();
        });
      });

      // Order Up Call
      root.querySelector('#btnOrderUpCall').addEventListener('click', () => {
        playSound('bell');
        speakText('Hands please! Order up!', 'en-US', 1.1);
        setTimeout(() => {
          this.evaluateOrder();
        }, 1200);
      });

      // Evaluation Next Guest
      root.querySelector('#btnNextGuest').addEventListener('click', () => {
        root.querySelector('#culinaryEvaluationModal').classList.remove('open');
        this.startNewOrder();
        this.switchStation(1);
      });

      // Chef School Open/Close
      root.querySelector('#btnOpenChefSchool').addEventListener('click', () => {
        this.openChefSchool('salmon_fillet');
      });
      root.querySelector('#btnCloseChefSchool').addEventListener('click', () => {
        root.querySelector('#culinarySchoolModal').classList.remove('open');
      });
      root.querySelector('#btnVisitAcademyFromEval').addEventListener('click', () => {
        root.querySelector('#culinaryEvaluationModal').classList.remove('open');
        this.openChefSchool('salmon_fillet');
      });

      // Fridge Category Tabs
      root.querySelectorAll('.fridge-cat-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          root.querySelectorAll('.fridge-cat-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          this.renderFridgeIngredients(btn.dataset.cat);
        });
      });
    },

    initCanvases: function () {
      const c1 = this.rootEl.querySelector('#cuttingBoardCanvas');
      const c2 = this.rootEl.querySelector('#stovetopCanvas');
      const c3 = this.rootEl.querySelector('#platingCanvas');

      initCuttingBoardCanvas(c1);
      initStovetopCanvas(c2);
      initPlatingCanvas(c3);
    },

    open: function () {
      this.init();
      this.rootEl.style.display = 'flex';
      state.isOpen = true;
      this.updateHeaderStats();
      this.startNewOrder();
      this.switchStation(1);
    },

    close: function () {
      if (this.rootEl) {
        this.rootEl.style.display = 'none';
      }
      state.isOpen = false;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (typeof window.returnToMainPortals === 'function') {
        window.returnToMainPortals();
      }
    },

    switchStation: function (stationIndex) {
      state.currentStation = stationIndex;
      const root = this.rootEl;

      // Update Tabs
      root.querySelectorAll('.culinary-station-tab').forEach((tab) => {
        if (parseInt(tab.dataset.station, 10) === stationIndex) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      // Update Views
      root.querySelectorAll('.culinary-station-view').forEach((view, idx) => {
        if (idx + 1 === stationIndex) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });

      // Special station triggers
      if (stationIndex === 2) {
        this.renderFridgeIngredients('all');
      } else if (stationIndex === 3) {
        this.renderPantryAndTools();
      } else if (stationIndex === 5) {
        this.startStoveTimer();
      } else if (stationIndex === 6) {
        if (state.renderPlating) state.renderPlating();
      }
    },

    startNewOrder: function (recipeId) {
      const databank = (typeof window !== 'undefined' && window.CulinaryDatabank) || {};
      const recipes = databank.recipes || DEFAULT_RECIPES;
      const personas = databank.customers || CUSTOMER_PERSONAS;

      const recipe = recipeId ? recipes.find((r) => r.id === recipeId) || recipes[0] : recipes[Math.floor(Math.random() * recipes.length)];
      const customer = personas[Math.floor(Math.random() * personas.length)];

      state.activeOrder = recipe;
      state.customerPersona = customer;
      state.orderAccepted = false;
      state.selectedFresh = [];
      state.selectedDry = [];
      state.selectedTools = [];
      state.knifeCutsDone = 0;
      state.stoveDoneness = 20;

      // Update Ticket DOM
      const ticket = this.rootEl.querySelector('#activeOrderTicket');
      ticket.querySelector('.ticket-dish-name').textContent = recipe.title;
      const specs = ticket.querySelector('.ticket-specs');
      specs.innerHTML = '';
      (recipe.customerRestrictions || []).forEach((r) => {
        const tag = document.createElement('span');
        tag.className = 'ticket-spec-tag';
        tag.textContent = r.replace(/_/g, ' ').toUpperCase();
        specs.appendChild(tag);
      });

      // Update Customer Diorama
      const avatarBox = this.rootEl.querySelector('#customerAvatarContainer');
      avatarBox.innerHTML = `
        <div class="customer-mood-badge">😊 Satisfied</div>
        ${getCustomerAvatarSvg(customer)}
      `;

      // Update Dialogue
      this.rootEl.querySelector('#dialogueTextEn').textContent = `"${customer.speechRequest}"`;
      this.rootEl.querySelector('#dialogueTextEs').textContent = `"${customer.requestEs}"`;

      // Update Dialogue Choices
      const choicesContainer = this.rootEl.querySelector('#dialogueChoicesContainer');
      choicesContainer.innerHTML = '';
      customer.dialogueOptions.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'dialogue-choice-btn';
        btn.textContent = `${['A', 'B', 'C'][idx]}) "${opt}"`;
        btn.addEventListener('click', () => {
          if (idx === customer.correctDialogueIndex) {
            btn.classList.add('correct');
            playSound('coin');
            speakText('Order accepted! Let us gather the ingredients in the walk-in fridge!');
            setTimeout(() => {
              this.switchStation(2);
            }, 900);
          } else {
            btn.classList.add('wrong');
            playSound('wrong');
            speakText('Pardon me, that is not what I requested.');
          }
        });
        choicesContainer.appendChild(btn);
      });

      // Knife Task Texts
      this.rootEl.querySelector('#knifeTaskTitle').textContent = `Knife Technique: ${recipe.knifeTask.nameEn}`;
      this.rootEl.querySelector('#knifeTaskDesc').textContent = recipe.knifeTask.desc;
      this.updateKnifeProgressBar();
      this.updateTrayDOM();
    },

    renderFridgeIngredients: function (cat) {
      const grid = this.rootEl.querySelector('#fridgeShelvesGrid');
      grid.innerHTML = '';

      const databank = (typeof window !== 'undefined' && window.CulinaryDatabank) || {};
      const ingredients = databank.ingredients || DEFAULT_INGREDIENTS;

      Object.keys(ingredients).forEach((id) => {
        const ing = ingredients[id];
        if (cat !== 'all' && ing.cat !== cat) return;

        const isSelected = state.selectedFresh.includes(id);
        const card = document.createElement('div');
        card.className = `ingredient-card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
          <button class="ingredient-card-tts" data-word="${ing.nameEn}">🔊</button>
          ${getIngredientSvg(id)}
          <span class="ingredient-name-en">${ing.nameEn}</span>
          <span class="ingredient-name-es">${ing.nameEs}</span>
        `;

        card.querySelector('.ingredient-card-tts').addEventListener('click', (e) => {
          e.stopPropagation();
          speakText(ing.nameEn);
        });

        card.addEventListener('click', () => {
          this.toggleFreshIngredient(id);
        });

        grid.appendChild(card);
      });
    },

    toggleFreshIngredient: function (id) {
      const idx = state.selectedFresh.indexOf(id);
      if (idx >= 0) {
        state.selectedFresh.splice(idx, 1);
      } else {
        state.selectedFresh.push(id);
        playSound('coin');
        // Check forbidden allergen penalty
        if (state.activeOrder && state.activeOrder.customerRestrictions.includes('no_butter') && id === 'unsalted_butter') {
          playSound('wrong');
          speakText('Warning: Customer requested NO BUTTER due to allergy!');
        }
      }
      this.renderFridgeIngredients(this.rootEl.querySelector('.fridge-cat-btn.active').dataset.cat);
      this.updateTrayDOM();
    },

    updateTrayDOM: function () {
      const tray = this.rootEl.querySelector('#trayItemsContainer');
      tray.innerHTML = '';

      state.selectedFresh.forEach((id) => {
        const ing = DEFAULT_INGREDIENTS[id] || { nameEn: id };
        const pill = document.createElement('div');
        pill.className = 'tray-item-pill';
        pill.innerHTML = `
          <span>${ing.nameEn}</span>
          <span class="remove-btn">✕</span>
        `;
        pill.querySelector('.remove-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleFreshIngredient(id);
        });
        tray.appendChild(pill);
      });
    },

    renderPantryAndTools: function () {
      // Render Dry Goods
      const pGrid = this.rootEl.querySelector('#pantryShelvesGrid');
      pGrid.innerHTML = '';
      Object.keys(DEFAULT_INGREDIENTS).forEach((id) => {
        const ing = DEFAULT_INGREDIENTS[id];
        if (ing.cat !== 'dry') return;

        const isSelected = state.selectedDry.includes(id);
        const card = document.createElement('div');
        card.className = `ingredient-card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
          <button class="ingredient-card-tts" data-word="${ing.nameEn}">🔊</button>
          ${getIngredientSvg(id)}
          <span class="ingredient-name-en">${ing.nameEn}</span>
          <span class="ingredient-name-es">${ing.nameEs}</span>
        `;
        card.querySelector('.ingredient-card-tts').addEventListener('click', (e) => {
          e.stopPropagation();
          speakText(ing.nameEn);
        });
        card.addEventListener('click', () => {
          if (!state.selectedDry.includes(id)) {
            state.selectedDry.push(id);
            playSound('coin');
          } else {
            state.selectedDry = state.selectedDry.filter((x) => x !== id);
          }
          this.renderPantryAndTools();
        });
        pGrid.appendChild(card);
      });

      // Render Tools Wall
      const tGrid = this.rootEl.querySelector('#toolsWallGrid');
      tGrid.innerHTML = '';
      Object.keys(DEFAULT_TOOLS).forEach((id) => {
        const tool = DEFAULT_TOOLS[id];
        const isSelected = state.selectedTools.includes(id);
        const card = document.createElement('div');
        card.className = `tool-card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
          ${getToolSvg(id)}
          <span class="tool-name-en">${tool.nameEn}</span>
          <span class="tool-name-es">${tool.nameEs}</span>
        `;
        card.addEventListener('click', () => {
          if (!state.selectedTools.includes(id)) {
            state.selectedTools.push(id);
            playSound('coin');
          } else {
            state.selectedTools = state.selectedTools.filter((x) => x !== id);
          }
          this.renderPantryAndTools();
        });
        tGrid.appendChild(card);
      });
    },

    handleKnifeSlice: function () {
      if (!state.activeOrder) return;
      const task = state.activeOrder.knifeTask;
      if (state.knifeCutsDone < task.slicesRequired) {
        state.knifeCutsDone++;
        this.updateKnifeProgressBar();

        if (state.knifeCutsDone >= task.slicesRequired) {
          playSound('coin');
          speakText(`Perfect ${task.nameEn}!`);
          this.rootEl.querySelector('#btnAdvanceToStove').style.display = 'block';
        }
      }
    },

    updateKnifeProgressBar: function () {
      const task = state.activeOrder ? state.activeOrder.knifeTask : { slicesRequired: 4 };
      const pct = Math.min(100, Math.round((state.knifeCutsDone / task.slicesRequired) * 100));
      this.rootEl.querySelector('#cutProgressFill').style.width = `${pct}%`;
      this.rootEl.querySelector('#cutProgressText').textContent = `${state.knifeCutsDone} / ${task.slicesRequired} Cuts Completed`;
    },

    startStoveTimer: function () {
      state.stoveHeat = 'high';
      playSound('sizzle');

      // Update temperature indicator visually
      const interval = setInterval(() => {
        if (state.currentStation !== 5 || !state.isOpen) {
          clearInterval(interval);
          return;
        }

        if (state.stoveHeat === 'high') {
          state.stoveDoneness = Math.min(100, state.stoveDoneness + 3);
        } else if (state.stoveHeat === 'med') {
          state.stoveDoneness = Math.min(100, state.stoveDoneness + 1.5);
        }

        const indicator = this.rootEl.querySelector('#thermoIndicator');
        const donenessLabel = this.rootEl.querySelector('#donenessLabel');

        indicator.style.left = `${state.stoveDoneness}%`;

        if (state.stoveDoneness < 35) {
          donenessLabel.textContent = 'Rare (50°C)';
          donenessLabel.style.color = '#38bdf8';
        } else if (state.stoveDoneness < 65) {
          donenessLabel.textContent = 'Medium-Rare ⭐ Optimal (55°C)';
          donenessLabel.style.color = '#10b981';
        } else if (state.stoveDoneness < 85) {
          donenessLabel.textContent = 'Medium (62°C)';
          donenessLabel.style.color = '#f59e0b';
        } else {
          donenessLabel.textContent = 'Well Done (72°C+)';
          donenessLabel.style.color = '#ef4444';
        }
      }, 500);
    },

    evaluateOrder: function () {
      playSound('fanfare');
      const profile = getProfile();
      profile.ordersCompleted++;
      profile.coins += 25;
      profile.score += 150;

      // Calculate Rank Level
      for (let i = RANKS.length - 1; i >= 0; i--) {
        if (profile.score >= RANKS[i].minScore) {
          profile.rankLevel = RANKS[i].level;
          break;
        }
      }
      saveProfile(profile);
      this.updateHeaderStats();

      // Show Evaluation Modal
      const modal = this.rootEl.querySelector('#culinaryEvaluationModal');
      const rankInfo = RANKS.find((r) => r.level === profile.rankLevel) || RANKS[0];
      modal.querySelector('#evalRankTitle').textContent = rankInfo.title;
      modal.querySelector('#evalDishTitle').textContent = state.activeOrder ? state.activeOrder.title : 'Gourmet Dish';
      modal.classList.add('open');
    },

    openChefSchool: function (itemKey) {
      const item = DEFAULT_INGREDIENTS[itemKey] || DEFAULT_TOOLS[itemKey] || {
        nameEn: 'Mise en Place',
        nameEs: 'Todo en su lugar (Organización de cocina)',
        ipa: '/ˌmiːz ɑ̃ ˈplæs/',
        desc: 'Culinary philosophy of preparing and organizing all ingredients and utensils before service begins.'
      };

      const modal = this.rootEl.querySelector('#culinarySchoolModal');
      modal.querySelector('#schoolTermEn').textContent = item.nameEn;
      modal.querySelector('#schoolTermIpa').textContent = item.ipa || '/kɪtʃ.ən/';
      modal.querySelector('#schoolTermEs').textContent = item.nameEs;
      modal.querySelector('#schoolDesc').textContent = item.desc;
      modal.querySelector('#schoolItemImg').innerHTML = getIngredientSvg(itemKey) || getToolSvg(itemKey);

      modal.querySelector('#btnSchoolTts').onclick = () => {
        speakText(item.nameEn);
      };

      modal.classList.add('open');
    },

    updateHeaderStats: function () {
      const profile = getProfile();
      const rank = RANKS.find((r) => r.level === profile.rankLevel) || RANKS[0];
      this.rootEl.querySelector('#statChefRank').textContent = rank.title.split(' ')[0];
      this.rootEl.querySelector('#statChefCoins').textContent = profile.coins;
    }
  };

  // Expose to window
  global.CulinaryStudio2D = CulinaryStudio2D;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CulinaryStudio2D;
  }
})(typeof window !== 'undefined' ? window : globalThis);

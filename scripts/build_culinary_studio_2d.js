const fs = require('fs');
const path = require('path');

const jsContent = `/**
 * ============================================================================
 * MASTERENG - CULINARY STUDIO 2D: CARTOON DINER RESTAURANT MANAGEMENT
 * Archivo: js/culinary_studio_2d.js
 *
 * Videojuego de gestión de restaurante en tiempo real estilo Cooking Fever /
 * Papa's Pizzeria con estética 2D Cartoon Ilustrada HD.
 *
 * Componentes principales:
 * 1. Mitad Superior (Counter View): Mostrador, clientes animados que entran
 *    desde la izquierda, globo de diálogo con pedidos en inglés y barra de paciencia.
 * 2. Mitad Inferior (Kitchen Station): Plancha (Grill) con 4 quemadores activos,
 *    freidora de papas con aceite burbujeante, estante de ingredientes y tabla de armado.
 * 3. Botón Flotante de Diccionario Culinario (356 términos profesionales).
 * ============================================================================
 */

(function (global) {
  'use strict';

  // ============================================================================
  // 1. PROCEDURAL SOUND SYNTHESIZER (WEB AUDIO API) & TTS (KOKORO / WEB SPEECH)
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
        // Doble campana de servicio (880Hz + 1760Hz)
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
        // Golpe firme sobre madera / colocación de ingrediente
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'sizzle') {
        // Chisporroteo de carne en plancha caliente
        const bufferSize = ctx.sampleRate * 0.35;
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
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } else if (type === 'bubble') {
        // Aceite burbujeante en freidora
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'fanfare') {
        // Acorde triunfal (C5, E5, G5, C6)
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.08);
          gain.gain.setValueAtTime(0.25, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7 + i * 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + 1.0);
        });
      } else if (type === 'wrong') {
        // Zumbido de error
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.29);
      }
    } catch (_) {}
  }

  function speakText(text, lang = 'en-US', rate = 1.0, itemId) {
    if (!text && !itemId) return;
    const cleanKey = String(itemId || text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/^_+|_+$/g, '');

    // 1. Intento de reproducción de audio hiperrealista Kokoro TTS
    if (cleanKey) {
      const audioUrl = 'audio/vocab/' + cleanKey + '.wav';
      try {
        const audio = new Audio(audioUrl);
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            fallbackSpeechSynthesis(text, lang, rate);
          });
          return;
        }
      } catch (_) {
        fallbackSpeechSynthesis(text, lang, rate);
        return;
      }
    }
    fallbackSpeechSynthesis(text, lang, rate);
  }

  function fallbackSpeechSynthesis(text, lang, rate) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang || 'en-US';
      utterance.rate = rate || 1.0;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  }

  // ============================================================================
  // 2. PERFIL DE CHEF Y PERSISTENCIA (LOCALSTORAGE)
  // ============================================================================

  const STORAGE_KEY = 'culinary_studio_profile_v2';

  const RANKS = [
    { level: 1, title: 'Commis Chef', titleEs: 'Ayudante de Cocina', minScore: 0, badge: '🧼' },
    { level: 2, title: 'Line Cook', titleEs: 'Cocinero de Línea', minScore: 250, badge: '🔪' },
    { level: 3, title: 'Sous-Chef', titleEs: 'Segundo de Cocina', minScore: 700, badge: '🍳' },
    { level: 4, title: 'Executive Chef', titleEs: 'Chef Ejecutivo', minScore: 1500, badge: '👨‍🍳' },
    { level: 5, title: 'Michelin Star Chef', titleEs: 'Chef Estrella Michelin', minScore: 2800, badge: '⭐' }
  ];

  function getProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {
      score: 0,
      coins: 100,
      ordersCompleted: 0,
      perfectOrders: 0,
      stars: 1,
      rankLevel: 1
    };
  }

  function saveProfile(prof) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prof));
    } catch (_) {}
  }

  // ============================================================================
  // 3. BASE DE DATOS DE CLIENTES Y PEDIDOS DE RESTAURANTE
  // ============================================================================

  const CUSTOMER_PERSONAS = [
    {
      id: 'sophia',
      name: 'Sophia Laurent',
      title: 'Food Critic',
      avatarColor: '#f43f5e',
      hairColor: '#3b1d11',
      praiseEn: 'Magnifique! The patty is perfectly well-done and the bun is toasted just right!',
      praiseEs: '¡Magnífico! ¡La carne está en su punto perfecto y el pan bien tostado!'
    },
    {
      id: 'marcus',
      name: 'Marcus Vance',
      title: 'BBQ Pitmaster',
      avatarColor: '#ea580c',
      hairColor: '#1c1917',
      praiseEn: 'Now that is a real burger! Delicious melted cheese and hot crispy fries!',
      praiseEs: '¡Eso sí es una hamburguesa! ¡Queso derretido delicioso y papas calientitas!'
    },
    {
      id: 'clara',
      name: 'Clara Rossi',
      title: 'Gourmet Enthusiast',
      avatarColor: '#10b981',
      hairColor: '#b45309',
      praiseEn: 'Delicious Chef! The crisp lettuce and ripe tomatoes bring supreme freshness!',
      praiseEs: '¡Delicioso Chef! ¡La lechuga crujiente y los jitomates le dan gran frescura!'
    },
    {
      id: 'lucas',
      name: 'Lucas Silva',
      title: 'Soccer Striker',
      avatarColor: '#0284c7',
      hairColor: '#1e293b',
      praiseEn: 'Goal! Exactly what I needed after the match. Thanks for the quick service!',
      praiseEs: '¡Golazo! Justo lo que necesitaba después del partido. ¡Gracias por la rapidez!'
    },
    {
      id: 'elena',
      name: 'Elena Rostova',
      title: 'Food Blogger',
      avatarColor: '#8b5cf6',
      hairColor: '#ca8a04',
      praiseEn: 'Five stars on my blog! Picture-perfect stacking and fantastic flavor!',
      praiseEs: '¡Cinco estrellas en mi blog! ¡Un armado impecable y sabor fantástico!'
    }
  ];

  const RESTAURANT_ORDERS = [
    {
      id: 'classic_cheeseburger',
      nameEn: 'Classic Cheeseburger with Fries',
      nameEs: 'Hamburguesa Clásica con Queso y Papas',
      speechEn: 'I want a well-done burger with cheddar cheese, crisp lettuce, and golden fries, please!',
      speechEs: '¡Quiero una hamburguesa bien cocida con queso cheddar, lechuga y papas doradas, por favor!',
      requiredLayers: ['bottom_bun', 'cooked_patty', 'cheese', 'lettuce', 'top_bun', 'fries'],
      timeSec: 60,
      rewardCoins: 100,
      rewardExp: 50
    },
    {
      id: 'diner_deluxe',
      nameEn: 'MasterChef Deluxe Burger',
      nameEs: 'Hamburguesa Deluxe con Todo',
      speechEn: 'I would like a deluxe burger with cheese, tomato, sliced onion, lettuce, and fries!',
      speechEs: '¡Quisiera una hamburguesa deluxe con queso, jitomate, cebolla, lechuga y papas!',
      requiredLayers: ['bottom_bun', 'cooked_patty', 'cheese', 'lettuce', 'tomato', 'onion', 'top_bun', 'fries'],
      timeSec: 75,
      rewardCoins: 140,
      rewardExp: 70
    },
    {
      id: 'onion_cheddar_burger',
      nameEn: 'Double Onion & Cheddar Burger',
      nameEs: 'Hamburguesa con Queso y Cebolla Asada',
      speechEn: 'Please make me a well-done burger with melted cheddar cheese and sliced onions!',
      speechEs: '¡Por favor prepárame una hamburguesa bien cocida con queso cheddar derretido y cebolla!',
      requiredLayers: ['bottom_bun', 'cooked_patty', 'cheese', 'onion', 'top_bun'],
      timeSec: 55,
      rewardCoins: 90,
      rewardExp: 45
    },
    {
      id: 'fresh_salad_burger',
      nameEn: 'Garden Fresh Burger with Fries',
      nameEs: 'Hamburguesa Fresca de la Huerta con Papas',
      speechEn: 'I want a burger with plenty of lettuce, fresh tomato, and hot french fries!',
      speechEs: '¡Quiero una hamburguesa con bastante lechuga, jitomate fresco y papas a la francesa!',
      requiredLayers: ['bottom_bun', 'cooked_patty', 'lettuce', 'tomato', 'top_bun', 'fries'],
      timeSec: 65,
      rewardCoins: 110,
      rewardExp: 55
    },
    {
      id: 'simple_quick_burger',
      nameEn: 'Express Burger with Fries',
      nameEs: 'Hamburguesa Exprés con Papas',
      speechEn: 'Just a well-done burger with lettuce, top bun, and a large basket of crispy fries!',
      speechEs: '¡Solo una hamburguesa bien cocida con lechuga, su pan y una canasta de papas crujientes!',
      requiredLayers: ['bottom_bun', 'cooked_patty', 'lettuce', 'top_bun', 'fries'],
      timeSec: 50,
      rewardCoins: 85,
      rewardExp: 40
    }
  ];

  const INGREDIENTS_DEF = {
    bottom_bun: { id: 'bottom_bun', nameEn: 'Bottom Bun', nameEs: 'Pan Inferior', icon: '🍞', ipa: '/ˈbɑː.t̬əm bʌn/' },
    raw_patty: { id: 'raw_patty', nameEn: 'Raw Beef Patty', nameEs: 'Carne Cruda (a la plancha)', icon: '🥩', ipa: '/rɑː ˈpæt.i/' },
    cooked_patty: { id: 'cooked_patty', nameEn: 'Well-Done Patty', nameEs: 'Carne Bien Cocida', icon: '🍔', ipa: '/wɛl dʌn ˈpæt.i/' },
    cheese: { id: 'cheese', nameEn: 'Cheddar Cheese', nameEs: 'Queso Cheddar', icon: '🧀', ipa: '/ˈtʃed.ɚ tʃiːz/' },
    lettuce: { id: 'lettuce', nameEn: 'Crisp Lettuce', nameEs: 'Lechuga Fresca', icon: '🥬', ipa: '/ˈlet̬.ɪs/' },
    tomato: { id: 'tomato', nameEn: 'Sliced Tomato', nameEs: 'Jitomate en Rebanadas', icon: '🍅', ipa: '/təˈmeɪ.t̬oʊ/' },
    onion: { id: 'onion', nameEn: 'Sliced Onion', nameEs: 'Cebolla en Aros', icon: '🧅', ipa: '/ˈʌn.jən/' },
    top_bun: { id: 'top_bun', nameEn: 'Top Bun (Sesame)', nameEs: 'Pan Superior con Ajonjolí', icon: '🍞', ipa: '/tɑːp bʌn/' },
    fries: { id: 'fries', nameEn: 'Crispy French Fries', nameEs: 'Papas a la Francesa', icon: '🍟', ipa: '/krɪs.pi fraɪz/' }
  };

  // ============================================================================
  // 4. GENERADORES DE ILUSTRACIONES SVG 2D CARTOON
  // ============================================================================

  function getCustomerAvatarSvg(persona, emotion = 'happy') {
    const color = (persona && persona.avatarColor) || '#38bdf8';
    const hair = (persona && persona.hairColor) || '#451a03';

    let mouthSvg = '<path d=\"M66,104 Q80,118 94,104\" stroke=\"#991b1b\" stroke-width=\"3.5\" fill=\"#fca5a5\"/>';
    let eyeLeftSvg = '<circle cx=\"65\" cy=\"82\" r=\"5\" fill=\"#0f172a\"/><circle cx=\"67\" cy=\"80\" r=\"1.5\" fill=\"#ffffff\"/>';
    let eyeRightSvg = '<circle cx=\"95\" cy=\"82\" r=\"5\" fill=\"#0f172a\"/><circle cx=\"97\" cy=\"80\" r=\"1.5\" fill=\"#ffffff\"/>';

    if (emotion === 'impatient') {
      mouthSvg = '<path d=\"M68,110 Q80,102 92,110\" stroke=\"#991b1b\" stroke-width=\"3.5\" fill=\"none\"/>';
      eyeLeftSvg = '<path d=\"M60,84 L70,80\" stroke=\"#0f172a\" stroke-width=\"3\"/><circle cx=\"65\" cy=\"84\" r=\"4\" fill=\"#0f172a\"/>';
      eyeRightSvg = '<path d=\"M90,80 L100,84\" stroke=\"#0f172a\" stroke-width=\"3\"/><circle cx=\"95\" cy=\"84\" r=\"4\" fill=\"#0f172a\"/>';
    } else if (emotion === 'ecstatic') {
      mouthSvg = '<path d=\"M62,100 Q80,126 98,100 Z\" stroke=\"#991b1b\" stroke-width=\"3\" fill=\"#dc2626\"/><path d=\"M68,100 Q80,108 92,100\" fill=\"#ffffff\"/>';
      eyeLeftSvg = '<path d=\"M60,82 Q65,74 70,82\" stroke=\"#0f172a\" stroke-width=\"3.5\" fill=\"none\"/>';
      eyeRightSvg = '<path d=\"M90,82 Q95,74 100,82\" stroke=\"#0f172a\" stroke-width=\"3.5\" fill=\"none\"/>';
    }

    return \`
      <svg viewBox=\"0 0 160 190\" class=\"customer-avatar-svg\" style=\"width: 100%; height: 100%; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.35));\">
        <!-- Torso / Camisa -->
        <path d=\"M30,155 Q80,135 130,155 L140,190 L20,190 Z\" fill=\"\${color}\" stroke=\"#0f172a\" stroke-width=\"3.5\"/>
        <path d=\"M65,150 L80,175 L95,150\" fill=\"#ffffff\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>
        
        <!-- Cuello -->
        <rect x=\"68\" y=\"116\" width=\"24\" height=\"22\" rx=\"4\" fill=\"#fed7aa\" stroke=\"#0f172a\" stroke-width=\"3\"/>
        
        <!-- Cabeza -->
        <ellipse cx=\"80\" cy=\"85\" rx=\"42\" ry=\"46\" fill=\"#fed7aa\" stroke=\"#0f172a\" stroke-width=\"3.5\"/>
        
        <!-- Cabello Cartoon -->
        <path d=\"M38,72 Q80,28 122,72 Q132,42 80,36 Q28,42 38,72 Z\" fill=\"\${hair}\" stroke=\"#0f172a\" stroke-width=\"3.5\"/>
        
        <!-- Ojos -->
        \${eyeLeftSvg}
        \${eyeRightSvg}
        
        <!-- Cejas -->
        <path d=\"M56,72 Q65,67 74,72\" stroke=\"#0f172a\" stroke-width=\"3\" fill=\"none\"/>
        <path d=\"M86,72 Q95,67 104,72\" stroke=\"#0f172a\" stroke-width=\"3\" fill=\"none\"/>
        
        <!-- Nariz -->
        <path d=\"M80,82 Q84,91 78,93\" stroke=\"#d97706\" stroke-width=\"3\" fill=\"none\"/>
        
        <!-- Boca -->
        \${mouthSvg}
        
        <!-- Mejillas sonrosadas -->
        <circle cx=\"52\" cy=\"96\" r=\"6\" fill=\"#f43f5e\" opacity=\"0.4\"/>
        <circle cx=\"108\" cy=\"96\" r=\"6\" fill=\"#f43f5e\" opacity=\"0.4\"/>
      </svg>
    \`;
  }

  function getBurgerLayerSvg(layerId) {
    switch (layerId) {
      case 'bottom_bun':
        return \`<svg viewBox=\"0 0 160 36\" class=\"burger-layer-svg\" style=\"width: 100%; height: 32px;\">
          <ellipse cx=\"80\" cy=\"18\" rx=\"72\" ry=\"16\" fill=\"#d97706\" stroke=\"#78350f\" stroke-width=\"3\"/>
          <ellipse cx=\"80\" cy=\"15\" rx=\"68\" ry=\"12\" fill=\"#f59e0b\"/>
          <path d=\"M24,20 Q80,26 136,20\" stroke=\"#b45309\" stroke-width=\"2.5\" fill=\"none\"/>
        </svg>\`;
      case 'cooked_patty':
        return \`<svg viewBox=\"0 0 160 34\" class=\"burger-layer-svg\" style=\"width: 100%; height: 30px;\">
          <ellipse cx=\"80\" cy=\"17\" rx=\"74\" ry=\"15\" fill=\"#582512\" stroke=\"#2e1005\" stroke-width=\"3\"/>
          <!-- Marcas de plancha doradas -->
          <line x1=\"38\" y1=\"10\" x2=\"58\" y2=\"24\" stroke=\"#1c0a02\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>
          <line x1=\"64\" y1=\"8\" x2=\"86\" y2=\"25\" stroke=\"#1c0a02\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>
          <line x1=\"92\" y1=\"9\" x2=\"114\" y2=\"24\" stroke=\"#1c0a02\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>
          <!-- Jugosidad -->
          <ellipse cx=\"78\" cy=\"15\" rx=\"50\" ry=\"8\" fill=\"#78350f\" opacity=\"0.45\"/>
        </svg>\`;
      case 'cheese':
        return \`<svg viewBox=\"0 0 160 32\" class=\"burger-layer-svg\" style=\"width: 100%; height: 26px;\">
          <path d=\"M12,10 L148,10 L140,24 L110,14 L85,28 L60,14 L30,26 L12,10 Z\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"2.5\"/>
          <circle cx=\"42\" cy=\"14\" r=\"3\" fill=\"#ca8a04\" opacity=\"0.6\"/>
          <circle cx=\"120\" cy=\"16\" r=\"2.5\" fill=\"#ca8a04\" opacity=\"0.6\"/>
        </svg>\`;
      case 'lettuce':
        return \`<svg viewBox=\"0 0 160 34\" class=\"burger-layer-svg\" style=\"width: 100%; height: 28px;\">
          <path d=\"M10,16 Q25,8 40,18 Q55,6 75,18 Q95,8 115,19 Q135,7 150,18 L144,24 Q125,18 105,26 Q85,16 65,24 Q45,16 20,24 Z\" fill=\"#22c55e\" stroke=\"#15803d\" stroke-width=\"2.5\"/>
          <path d=\"M24,18 Q40,14 60,20\" stroke=\"#86efac\" stroke-width=\"2\" fill=\"none\"/>
          <path d=\"M90,18 Q110,13 130,20\" stroke=\"#86efac\" stroke-width=\"2\" fill=\"none\"/>
        </svg>\`;
      case 'tomato':
        return \`<svg viewBox=\"0 0 160 28\" class=\"burger-layer-svg\" style=\"width: 100%; height: 24px;\">
          <!-- Dos rodajas de tomate jugosas -->
          <ellipse cx=\"48\" cy=\"14\" rx=\"32\" ry=\"10\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2.5\"/>
          <ellipse cx=\"48\" cy=\"14\" rx=\"24\" ry=\"7\" fill=\"#f87171\"/>
          <ellipse cx=\"112\" cy=\"14\" rx=\"32\" ry=\"10\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2.5\"/>
          <ellipse cx=\"112\" cy=\"14\" rx=\"24\" ry=\"7\" fill=\"#f87171\"/>
          <circle cx=\"44\" cy=\"13\" r=\"2\" fill=\"#fef08a\"/>
          <circle cx=\"52\" cy=\"15\" r=\"2\" fill=\"#fef08a\"/>
          <circle cx=\"108\" cy=\"13\" r=\"2\" fill=\"#fef08a\"/>
          <circle cx=\"116\" cy=\"15\" r=\"2\" fill=\"#fef08a\"/>
        </svg>\`;
      case 'onion':
        return \`<svg viewBox=\"0 0 160 26\" class=\"burger-layer-svg\" style=\"width: 100%; height: 22px;\">
          <ellipse cx=\"50\" cy=\"13\" rx=\"30\" ry=\"9\" fill=\"none\" stroke=\"#a855f7\" stroke-width=\"4\"/>
          <ellipse cx=\"50\" cy=\"13\" rx=\"26\" ry=\"7\" fill=\"none\" stroke=\"#f3e8ff\" stroke-width=\"2\"/>
          <ellipse cx=\"110\" cy=\"13\" rx=\"30\" ry=\"9\" fill=\"none\" stroke=\"#a855f7\" stroke-width=\"4\"/>
          <ellipse cx=\"110\" cy=\"13\" rx=\"26\" ry=\"7\" fill=\"none\" stroke=\"#f3e8ff\" stroke-width=\"2\"/>
        </svg>\`;
      case 'top_bun':
        return \`<svg viewBox=\"0 0 160 52\" class=\"burger-layer-svg\" style=\"width: 100%; height: 46px;\">
          <path d=\"M12,46 Q16,8 80,8 Q144,8 148,46 Z\" fill=\"#d97706\" stroke=\"#78350f\" stroke-width=\"3\"/>
          <path d=\"M18,44 Q22,14 80,14 Q138,14 142,44 Z\" fill=\"#f59e0b\"/>
          <!-- Ajonjolí / Semillas de sésamo -->
          <ellipse cx=\"45\" cy=\"22\" rx=\"2.5\" ry=\"1.5\" fill=\"#ffffff\" transform=\"rotate(-15 45 22)\"/>
          <ellipse cx=\"65\" cy=\"16\" rx=\"2.5\" ry=\"1.5\" fill=\"#ffffff\" transform=\"rotate(10 65 16)\"/>
          <ellipse cx=\"85\" cy=\"15\" rx=\"2.5\" ry=\"1.5\" fill=\"#ffffff\" transform=\"rotate(-5 85 15)\"/>
          <ellipse cx=\"105\" cy=\"20\" rx=\"2.5\" ry=\"1.5\" fill=\"#ffffff\" transform=\"rotate(25 105 20)\"/>
          <ellipse cx=\"125\" cy=\"28\" rx=\"2.5\" ry=\"1.5\" fill=\"#ffffff\" transform=\"rotate(-20 125 28)\"/>
          <ellipse cx=\"72\" cy=\"28\" rx=\"2.5\" ry=\"1.5\" fill=\"#ffffff\" transform=\"rotate(15 72 28)\"/>
          <ellipse cx=\"95\" cy=\"27\" rx=\"2.5\" ry=\"1.5\" fill=\"#ffffff\" transform=\"rotate(-10 95 27)\"/>
        </svg>\`;
      case 'fries':
        return \`<svg viewBox=\"0 0 70 80\" class=\"fries-side-svg\" style=\"width: 64px; height: 72px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));\">
          <!-- Papas doradas saliendo del envase -->
          <rect x=\"18\" y=\"10\" width=\"6\" height=\"36\" rx=\"2\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"1.5\" transform=\"rotate(-10 21 28)\"/>
          <rect x=\"28\" y=\"6\" width=\"6\" height=\"42\" rx=\"2\" fill=\"#fde047\" stroke=\"#ca8a04\" stroke-width=\"1.5\" transform=\"rotate(-2 31 27)\"/>
          <rect x=\"38\" y=\"8\" width=\"6\" height=\"40\" rx=\"2\" fill=\"#facc15\" stroke=\"#ca8a04\" stroke-width=\"1.5\" transform=\"rotate(8 41 28)\"/>
          <rect x=\"48\" y=\"14\" width=\"6\" height=\"34\" rx=\"2\" fill=\"#fde047\" stroke=\"#ca8a04\" stroke-width=\"1.5\" transform=\"rotate(18 51 31)\"/>
          <rect x=\"23\" y=\"18\" width=\"6\" height=\"30\" rx=\"2\" fill=\"#eab308\" stroke=\"#ca8a04\" stroke-width=\"1.5\" transform=\"rotate(-18 26 33)\"/>
          <!-- Cartucho rojo clásico -->
          <path d=\"M12,38 L58,38 L52,76 L18,76 Z\" fill=\"#dc2626\" stroke=\"#991b1b\" stroke-width=\"2.5\"/>
          <circle cx=\"35\" cy=\"56\" r=\"9\" fill=\"#facc15\" stroke=\"#eab308\" stroke-width=\"1.5\"/>
          <text x=\"35\" y=\"60\" font-size=\"10\" font-weight=\"900\" fill=\"#dc2626\" text-anchor=\"middle\">M</text>
        </svg>\`;
      default:
        return '';
    }
  }

  // ============================================================================
  // 5. MOTOR DEL VIDEOJUEGO DE GESTIÓN EN TIEMPO REAL
  // ============================================================================

  const CulinaryStudio2D = {
    rootEl: null,
    isOpen: false,

    // Estado del juego
    activeOrder: null,
    activePersona: null,
    patienceTimer: null,
    patienceTotal: 60,
    patienceLeft: 60,

    // Platos e ingredientes
    currentPlateLayers: [],

    // 4 Quemadores de la plancha
    grillSlots: [
      { id: 0, state: 'empty', progress: 0 },
      { id: 1, state: 'empty', progress: 0 },
      { id: 2, state: 'empty', progress: 0 },
      { id: 3, state: 'empty', progress: 0 }
    ],
    grillInterval: null,

    // Freidora de papas
    fryer: {
      state: 'idle', // 'idle' | 'frying' | 'ready'
      timerSec: 4,
      interval: null
    },

    // Diccionario
    dictSearchTerm: '',
    dictFilterCat: 'all',

    init: function () {
      if (this.rootEl) return;
      this.ensureDOM();
      this.bindEvents();
      this.startGrillLoop();
    },

    ensureDOM: function () {
      let root = document.getElementById('culinary-studio-root');
      if (!root) {
        root = document.createElement('div');
        root.id = 'culinary-studio-root';
        document.body.appendChild(root);
      }
      this.rootEl = root;

      root.className = 'culinary-studio-root';
      root.style.cssText = 'position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100dvh !important; z-index: 99000 !important; background: #0c1222 !important; display: flex !important; flex-direction: column !important; overflow: hidden !important; font-family: Outfit, Inter, sans-serif !important; user-select: none !important;';

      root.innerHTML = \`
        <!-- TOPBAR CON BOTÓN VOLVER UNIVERSAL, TÍTULO, DICCIONARIO Y STATS -->
        <header class="culinary-topbar">
          <div class="culinary-topbar-left">
            <button type="button" id="btnBackToPortals" class="culinary-btn-back" title="Volver a los Portales Principales">
              <span>← Volver a Portales</span>
            </button>
            <div class="culinary-brand-title">
              <span class="culinary-brand-icon">👨‍🍳</span>
              <div>
                <h1 class="culinary-heading">MasterChef Diner • Kitchen Management</h1>
                <p class="culinary-subheading">Cocina en tiempo real: atiende pedidos en inglés, asa hamburguesas y gana estrellas Michelin</p>
              </div>
            </div>
          </div>

          <div class="culinary-topbar-right">
            <!-- BOTÓN FLOTANTE AL DICCIONARIO GASTRONÓMICO -->
            <button type="button" id="btnOpenChefDictionary" class="culinary-btn-dict-top" title="Abrir Diccionario Culinario (356 Términos)">
              <span>📖</span>
              <span class="hidden sm:inline">Chef Dictionary (356)</span>
            </button>

            <!-- STATS DE MONEDAS Y RANGO -->
            <div class="culinary-header-stats">
              <div class="culinary-stat-badge coins">
                <span>🪙</span>
                <span id="statChefCoins">100</span>
              </div>
              <div class="culinary-stat-badge rank">
                <span id="statChefBadgeIcon">🔪</span>
                <span id="statChefRankTitle" class="hidden md:inline">Line Cook</span>
                <span id="statChefStars">⭐ 1★</span>
              </div>
            </div>
          </div>
        </header>

        <!-- LAYOUT DE RESTAURANTE EN TIEMPO REAL (MITAD SUPERIOR: MOSTRADOR / MITAD INFERIOR: COCINA) -->
        <div class="culinary-restaurant-layout">
          
          <!-- ============================================================== -->
          <!-- MITAD SUPERIOR: BARRA DE MOSTRADOR Y CLIENTE CON GLOBO Y PACIENCIA -->
          <!-- ============================================================== -->
          <section class="culinary-counter-view" id="counterView">
            <div class="culinary-diner-backdrop">
              <div class="diner-lamp lamp-left"></div>
              <div class="diner-lamp lamp-center"></div>
              <div class="diner-lamp lamp-right"></div>
            </div>

            <!-- ESCENARIO DEL CLIENTE CON ANIMACIÓN DESDE LA IZQUIERDA -->
            <div class="culinary-customer-stage">
              <div class="customer-figure-box" id="customerFigureBox">
                <!-- Avatar SVG inyectado dinámicamente -->
              </div>
              
              <div class="customer-dialogue-wrap">
                <!-- CABECERA DEL CLIENTE Y PACIENCIA -->
                <div class="customer-info-bar">
                  <div class="customer-name-tag">
                    <span id="customerName">Sophia Laurent</span>
                    <span class="customer-title-pill" id="customerTitle">Food Critic</span>
                  </div>
                  <!-- BARRA DE PACIENCIA CON TIEMPO -->
                  <div class="patience-meter-wrap" title="Barra de paciencia del comensal">
                    <span class="patience-label">Patience:</span>
                    <div class="patience-track">
                      <div class="patience-fill" id="patienceFill" style="width: 100%;"></div>
                    </div>
                    <span class="patience-clock" id="patienceClock">60s</span>
                  </div>
                </div>

                <!-- GLOBO DE DIÁLOGO CON PEDIDO EN INGLÉS -->
                <div class="diner-speech-bubble">
                  <div class="speech-content-row">
                    <button type="button" id="btnSpeakOrder" class="btn-tts-order" title="Escuchar pronunciación del pedido en inglés">
                      <span>🔊</span>
                    </button>
                    <div class="speech-texts">
                      <div class="order-en-text" id="orderTextEn">"I want a well-done burger with cheese, lettuce and fries!"</div>
                      <div class="order-es-text" id="orderTextEs">"¡Quiero una hamburguesa bien cocida con queso, lechuga y papas fritas!"</div>
                    </div>
                  </div>

                  <!-- LISTA VISUAL DE INGREDIENTES REQUERIDOS (CHECKLIST PILLS) -->
                  <div class="order-spec-pills" id="orderSpecPills">
                    <!-- Pills generadas dinámicamente -->
                  </div>
                </div>
              </div>
            </div>

            <!-- BARRA DE MOSTRADOR DE MADERA -->
            <div class="culinary-wooden-counter-bar"></div>
          </section>

          <!-- ============================================================== -->
          <!-- MITAD INFERIOR: ESTACIÓN DE COCINA (PLANCHA, FREIDORA, ESTANTE Y ARMADO) -->
          <!-- ============================================================== -->
          <section class="culinary-kitchen-view" id="kitchenView">
            
            <!-- 1. SECCIÓN PLANCHA CALIENTE (GRILL - 4 QUEMADORES) -->
            <div class="kitchen-grill-station">
              <div class="station-header">
                <span class="station-title">🔥 Sizzling Grill (Plancha)</span>
                <span class="station-subtitle">Coloca carne cruda y espera el término "Well-Done"</span>
              </div>
              <div class="grill-slots-grid" id="grillSlotsGrid">
                <!-- 4 Slots de Quemador -->
              </div>
            </div>

            <!-- 2. SECCIÓN FREIDORA DE PAPAS (FRENCH FRIES FRYER) -->
            <div class="kitchen-fryer-station">
              <div class="station-header">
                <span class="station-title">🍟 Deep Fryer</span>
                <span class="station-subtitle">Papas crujientes</span>
              </div>
              <div class="fryer-vat" id="fryerVat">
                <div class="fryer-oil-bubbles" id="fryerOilBubbles"></div>
                <div class="fryer-basket-box" id="fryerBasketBox">
                  <span class="fryer-icon" id="fryerBasketIcon">🍟</span>
                  <div class="fryer-status-label" id="fryerStatusLabel">Canastilla Lista</div>
                </div>
                <button type="button" class="btn-action-fryer" id="btnActionFryer">
                  <span>Freír Papas (4s)</span>
                </button>
              </div>
            </div>

            <!-- 3. SECCIÓN ESTANTE DE INGREDIENTES (TRAYS) -->
            <div class="kitchen-shelf-station">
              <div class="station-header">
                <span class="station-title">🥫 Ingredient Shelf</span>
                <span class="station-subtitle">Toca para agregar a la mesa o a la plancha</span>
              </div>
              <div class="ingredients-bins-grid" id="ingredientsShelfGrid">
                <!-- 8 Bins de Ingredientes -->
              </div>
            </div>

            <!-- 4. SECCIÓN TABLA DE ARMADO Y PLATO CERÁMICO (ASSEMBLY BOARD) -->
            <div class="kitchen-assembly-station">
              <div class="station-header">
                <span class="station-title">🍽️ Assembly Board</span>
                <span class="station-subtitle">Armado del plato del comensal</span>
              </div>
              
              <div class="assembly-board-surface">
                <!-- Plato Cerámico con Apilado Visual 2D Dinámico -->
                <div class="ceramic-plate-display" id="ceramicPlateDisplay">
                  <div class="plate-base-rim">
                    <div class="plate-inner-rim">
                      <!-- Contenedor de Capas Apiladas del Burger -->
                      <div class="burger-stack-container" id="burgerStackContainer">
                        <div class="empty-plate-hint" id="emptyPlateHint">Plato Vacío: Toca los ingredientes del estante para comenzar a armar...</div>
                      </div>
                      <!-- Papas al lado del plato -->
                      <div class="plate-fries-side" id="plateFriesSide" style="display: none;"></div>
                    </div>
                  </div>
                </div>

                <!-- BOTONES DE ACCIÓN: ENTREGAR Y LIMPIAR -->
                <div class="assembly-actions-bar">
                  <button type="button" class="btn-clear-plate" id="btnClearPlate" title="Desechar ingredientes y limpiar plato">
                    <span>🗑️ Desechar</span>
                  </button>
                  <button type="button" class="btn-serve-order" id="btnServeOrder" title="Entregar pedido al comensal">
                    <span>🛎️ ¡ENTREGAR PEDIDO! (SERVE)</span>
                  </button>
                </div>
              </div>
            </div>

          </section>

        </div>

        <!-- ============================================================== -->
        <!-- MODAL DEL DICCIONARIO GASTRONÓMICO (356 TÉRMINOS) -->
        <!-- ============================================================== -->
        <div class="culinary-dictionary-modal" id="culinaryDictionaryModal" style="display: none;">
          <div class="dictionary-modal-card">
            <header class="dict-modal-header">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🎓</span>
                <div>
                  <h3 class="dict-modal-title">MasterChef Gastronomic Academy</h3>
                  <p class="dict-modal-desc">Diccionario y jerga culinaria profesional bilingüe (356 términos)</p>
                </div>
              </div>
              <button type="button" class="btn-close-dict" id="btnCloseChefDictionary">✕</button>
            </header>

            <!-- FILTROS Y BÚSQUEDA RÁPIDA -->
            <div class="dict-controls-row">
              <div class="dict-search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="dictSearchInput" placeholder="Buscar término culinario (ej: julienne, sear, sous-vide, spatula)..." class="dict-search-input">
              </div>
              <div class="dict-category-chips">
                <button type="button" class="dict-chip active" data-cat="all">Todos (356)</button>
                <button type="button" class="dict-chip" data-cat="slang">Brigade Slang (86)</button>
                <button type="button" class="dict-chip" data-cat="tools">Equipment & Tools (100)</button>
                <button type="button" class="dict-chip" data-cat="ingredients">Ingredients (170)</button>
              </div>
            </div>

            <!-- GRILLA DE TARJETAS DEL DICCIONARIO CON SCROLL -->
            <div class="dict-cards-grid" id="dictCardsGrid">
              <!-- Renderizado dinámico de tarjetas -->
            </div>
          </div>
        </div>

        <!-- TOAST / NOTIFICACIÓN DE EVALUACIÓN FLOTANTE -->
        <div class="culinary-toast-notification" id="culinaryToast" style="display: none;"></div>
      \`;
    },

    bindEvents: function () {
      const root = this.rootEl;

      // Botón volver a Portales
      const btnBack = root.querySelector('#btnBackToPortals');
      if (btnBack) {
        btnBack.onclick = (e) => {
          this.close(e);
        };
      }

      // Botón TTS para escuchar la orden
      const btnSpeak = root.querySelector('#btnSpeakOrder');
      if (btnSpeak) {
        btnSpeak.onclick = () => {
          if (this.activeOrder) {
            speakText(this.activeOrder.speechEn);
          }
        };
      }

      // Freidora de papas
      const btnFryer = root.querySelector('#btnActionFryer');
      if (btnFryer) {
        btnFryer.onclick = () => {
          this.handleFryerClick();
        };
      }
      const fryerBox = root.querySelector('#fryerBasketBox');
      if (fryerBox) {
        fryerBox.onclick = () => {
          this.handleFryerClick();
        };
      }

      // Botón entregar orden
      const btnServe = root.querySelector('#btnServeOrder');
      if (btnServe) {
        btnServe.onclick = () => {
          this.serveOrder();
        };
      }

      // Botón limpiar plato
      const btnClear = root.querySelector('#btnClearPlate');
      if (btnClear) {
        btnClear.onclick = () => {
          this.clearPlate();
        };
      }

      // Abrir / Cerrar diccionario
      const btnOpenDict = root.querySelector('#btnOpenChefDictionary');
      if (btnOpenDict) {
        btnOpenDict.onclick = () => {
          this.openDictionary();
        };
      }
      const btnCloseDict = root.querySelector('#btnCloseChefDictionary');
      if (btnCloseDict) {
        btnCloseDict.onclick = () => {
          this.closeDictionary();
        };
      }

      // Filtros de diccionario
      const chips = root.querySelectorAll('.dict-chip');
      chips.forEach((ch) => {
        ch.onclick = () => {
          chips.forEach(c => c.classList.remove('active'));
          ch.classList.add('active');
          this.dictFilterCat = ch.dataset.cat;
          this.renderDictionaryCards();
        };
      });

      const searchInput = root.querySelector('#dictSearchInput');
      if (searchInput) {
        searchInput.oninput = (e) => {
          this.dictSearchTerm = e.target.value.trim().toLowerCase();
          this.renderDictionaryCards();
        };
      }
    },

    // ============================================================================
    // 6. FLUJO DEL JUEGO: CLIENTES Y ÓRDENES
    // ============================================================================

    startNewOrder: function (orderIndex) {
      if (!this.isOpen) return;

      const pIdx = Math.floor(Math.random() * CUSTOMER_PERSONAS.length);
      this.activePersona = CUSTOMER_PERSONAS[pIdx];

      const oIdx = (typeof orderIndex === 'number' && orderIndex >= 0 && orderIndex < RESTAURANT_ORDERS.length)
        ? orderIndex
        : Math.floor(Math.random() * RESTAURANT_ORDERS.length);
      this.activeOrder = RESTAURANT_ORDERS[oIdx];

      this.patienceTotal = this.activeOrder.timeSec || 60;
      this.patienceLeft = this.patienceTotal;

      // Renderizar cliente y globo
      this.renderCustomer('happy');

      // Pronunciar orden en voz alta
      setTimeout(() => {
        if (this.isOpen && this.activeOrder) {
          speakText(this.activeOrder.speechEn);
        }
      }, 500);

      // Iniciar cuenta regresiva de paciencia
      if (this.patienceTimer) clearInterval(this.patienceTimer);
      this.patienceTimer = setInterval(() => {
        this.tickPatience();
      }, 1000);
    },

    tickPatience: function () {
      if (!this.isOpen || !this.activeOrder) return;
      this.patienceLeft--;

      const pct = Math.max(0, Math.min(100, Math.round((this.patienceLeft / this.patienceTotal) * 100)));
      const fillEl = this.rootEl.querySelector('#patienceFill');
      const clockEl = this.rootEl.querySelector('#patienceClock');

      if (fillEl) {
        fillEl.style.width = pct + '%';
        if (pct > 50) {
          fillEl.style.backgroundColor = '#10b981'; // Verde
        } else if (pct > 25) {
          fillEl.style.backgroundColor = '#f59e0b'; // Amarillo
          this.updateCustomerEmotion('waiting');
        } else {
          fillEl.style.backgroundColor = '#ef4444'; // Rojo impaciente
          this.updateCustomerEmotion('impatient');
        }
      }

      if (clockEl) {
        clockEl.textContent = this.patienceLeft + 's';
      }

      // Si se acaba el tiempo, el cliente se va enojado
      if (this.patienceLeft <= 0) {
        clearInterval(this.patienceTimer);
        this.handleCustomerWalkout();
      }
    },

    updateCustomerEmotion: function (emotion) {
      const box = this.rootEl.querySelector('#customerFigureBox');
      if (box && this.activePersona) {
        box.innerHTML = getCustomerAvatarSvg(this.activePersona, emotion);
      }
    },

    renderCustomer: function (emotion = 'happy') {
      const root = this.rootEl;
      if (!root || !this.activePersona || !this.activeOrder) return;

      const nameEl = root.querySelector('#customerName');
      const titleEl = root.querySelector('#customerTitle');
      const textEnEl = root.querySelector('#orderTextEn');
      const textEsEl = root.querySelector('#orderTextEs');
      const pillsContainer = root.querySelector('#orderSpecPills');
      const figureBox = root.querySelector('#customerFigureBox');

      if (nameEl) nameEl.textContent = this.activePersona.name;
      if (titleEl) titleEl.textContent = this.activePersona.title;
      if (textEnEl) textEnEl.textContent = '"' + this.activeOrder.speechEn + '"';
      if (textEsEl) textEsEl.textContent = '"' + this.activeOrder.speechEs + '"';

      if (figureBox) {
        figureBox.innerHTML = getCustomerAvatarSvg(this.activePersona, emotion);
        figureBox.classList.remove('entering');
        void figureBox.offsetWidth; // Forzar reflow para reiniciar animación
        figureBox.classList.add('entering');
      }

      // Renderizar pills de requerimientos
      if (pillsContainer) {
        pillsContainer.innerHTML = this.activeOrder.requiredLayers.map(layerId => {
          const item = INGREDIENTS_DEF[layerId] || { nameEn: layerId, icon: '🍴' };
          return \`<span class="spec-pill" title="\${item.nameEn} (\${item.nameEs || ''})">
            <span>\${item.icon}</span>
            <span>\${item.nameEn}</span>
          </span>\`;
        }).join('');
      }

      // Reiniciar barra de paciencia
      const fillEl = root.querySelector('#patienceFill');
      const clockEl = root.querySelector('#patienceClock');
      if (fillEl) {
        fillEl.style.width = '100%';
        fillEl.style.backgroundColor = '#10b981';
      }
      if (clockEl) {
        clockEl.textContent = this.patienceTotal + 's';
      }
    },

    handleCustomerWalkout: function () {
      playSound('wrong');
      speakText("Too slow, Chef! I'm leaving!");
      this.showToast('⚠️ ¡El comensal perdió la paciencia y se marchó!', 'error');

      const textEnEl = this.rootEl.querySelector('#orderTextEn');
      const textEsEl = this.rootEl.querySelector('#orderTextEs');
      if (textEnEl) textEnEl.textContent = '"Too slow Chef, I have to go! 0 stars!"';
      if (textEsEl) textEsEl.textContent = '"¡Tardaste demasiado Chef, me tengo que ir!"';

      setTimeout(() => {
        if (this.isOpen) {
          this.clearPlate();
          this.startNewOrder();
        }
      }, 2200);
    },

    // ============================================================================
    // 7. PLANCHA (HOT GRILL) - 4 QUEMADORES
    // ============================================================================

    startGrillLoop: function () {
      if (this.grillInterval) clearInterval(this.grillInterval);
      this.grillInterval = setInterval(() => {
        if (!this.isOpen) return;

        let needsRender = false;
        this.grillSlots.forEach((slot) => {
          if (slot.state !== 'empty') {
            slot.progress += 2.5; // Avanza cada 250ms
            needsRender = true;
          }
        });

        if (needsRender) {
          this.renderGrillSlots();
        }
      }, 250);
    },

    renderGrillSlots: function () {
      const container = this.rootEl.querySelector('#grillSlotsGrid');
      if (!container) return;

      container.innerHTML = this.grillSlots.map((slot, index) => {
        let statusBadge = '';
        let slotContent = '';
        let borderClass = '';

        if (slot.state === 'empty') {
          slotContent = \`
            <div class="grill-empty-slot" onclick="window.CulinaryStudio2D.clickGrillSlot(\${index})">
              <div class="burner-ring"></div>
              <span class="grill-slot-hint">+ Carne Cruda</span>
            </div>
          \`;
        } else {
          // doneness states:
          // 0-35%: raw
          // 35-70%: cooking
          // 70-100%: welldone (ÓPTIMO ⭐)
          // >100%: burnt (QUEMADO ⚠️)
          if (slot.progress < 35) {
            statusBadge = '<span class="slot-badge raw">Cruda (Raw)</span>';
            borderClass = 'border-amber-700/50';
          } else if (slot.progress < 70) {
            statusBadge = '<span class="slot-badge cooking">Asando...</span>';
            borderClass = 'border-amber-500';
          } else if (slot.progress <= 100) {
            statusBadge = '<span class="slot-badge welldone">¡LISTA! ⭐ (Toca)</span>';
            borderClass = 'border-emerald-400 animate-pulse';
          } else {
            statusBadge = '<span class="slot-badge burnt">QUEMADA ⚠️ (Tirar)</span>';
            borderClass = 'border-rose-600';
          }

          const fillPct = Math.min(100, slot.progress);
          const barColor = slot.progress > 100 ? '#ef4444' : slot.progress >= 70 ? '#10b981' : '#f59e0b';

          slotContent = \`
            <div class="grill-active-patty \${borderClass}" onclick="window.CulinaryStudio2D.clickGrillSlot(\${index})">
              <div class="sizzle-smoke"></div>
              <div class="patty-visual-disc \${slot.progress > 100 ? 'burnt' : slot.progress >= 70 ? 'welldone' : 'cooking'}">
                \${slot.progress > 100 ? '🥩' : '🍔'}
              </div>
              <div class="slot-progress-wrap">
                <div class="slot-progress-bar" style="width: \${fillPct}%; background-color: \${barColor};"></div>
              </div>
              \${statusBadge}
            </div>
          \`;
        }

        return \`
          <div class="grill-slot-card" data-slot="\${index}">
            <div class="slot-number-badge">#\${index + 1}</div>
            \${slotContent}
          </div>
        \`;
      }).join('');
    },

    clickGrillSlot: function (index) {
      const slot = this.grillSlots[index];
      if (!slot) return;

      if (slot.state === 'empty') {
        // Colocar carne cruda
        slot.state = 'cooking';
        slot.progress = 0;
        playSound('sizzle');
        speakText('Searing beef patty on the grill!');
        this.renderGrillSlots();
      } else if (slot.progress >= 70 && slot.progress <= 100) {
        // Carne perfectamente bien cocida: recolectar y pasar al plato
        playSound('chop');
        this.addIngredientToPlate('cooked_patty');
        slot.state = 'empty';
        slot.progress = 0;
        this.showToast('✅ ¡Carne Well-Done dorada colocada en el plato!', 'success');
        this.renderGrillSlots();
      } else if (slot.progress > 100) {
        // Carne quemada: desechar
        playSound('wrong');
        speakText('Discarding burnt patty!');
        this.showToast('⚠️ Carne quemada descartada para liberar el quemador', 'error');
        slot.state = 'empty';
        slot.progress = 0;
        this.renderGrillSlots();
      } else {
        // Aún se está cocinando
        playSound('sizzle');
        this.showToast('⏳ Espera a que termine de dorar ( Well-Done )', 'info');
      }
    },

    addRawPattyToFirstFreeSlot: function () {
      const freeIdx = this.grillSlots.findIndex(s => s.state === 'empty');
      if (freeIdx !== -1) {
        this.clickGrillSlot(freeIdx);
      } else {
        playSound('wrong');
        this.showToast('⚠️ La plancha está llena. Retira o desecha una carne.', 'error');
      }
    },

    // ============================================================================
    // 8. FREIDORA DE PAPAS FRITAS (DEEP FRYER)
    // ============================================================================

    handleFryerClick: function () {
      if (this.fryer.state === 'idle') {
        // Iniciar freído
        this.fryer.state = 'frying';
        this.fryer.timerSec = 4;
        playSound('bubble');
        speakText('Dropping french fries into hot oil!');
        this.renderFryer();

        if (this.fryer.interval) clearInterval(this.fryer.interval);
        this.fryer.interval = setInterval(() => {
          this.fryer.timerSec--;
          if (this.fryer.timerSec <= 0) {
            clearInterval(this.fryer.interval);
            this.fryer.state = 'ready';
            playSound('bell');
            speakText('French fries golden and crispy!');
            this.showToast('🍟 ¡Papas listas y crujientes! Toca la canastilla para servirlas.', 'success');
          }
          this.renderFryer();
        }, 1000);

      } else if (this.fryer.state === 'ready') {
        // Recoger papas y pasarlas al plato
        playSound('chop');
        this.addIngredientToPlate('fries');
        this.fryer.state = 'idle';
        this.showToast('🍟 ¡Canasta de papas fritas agregada al plato!', 'success');
        this.renderFryer();
      } else if (this.fryer.state === 'frying') {
        playSound('bubble');
        this.showToast('⏳ Las papas se están friendo, quedan ' + this.fryer.timerSec + 's', 'info');
      }
    },

    renderFryer: function () {
      const root = this.rootEl;
      if (!root) return;

      const basketBox = root.querySelector('#fryerBasketBox');
      const label = root.querySelector('#fryerStatusLabel');
      const btn = root.querySelector('#btnActionFryer');
      const bubbles = root.querySelector('#fryerOilBubbles');

      if (!basketBox || !label || !btn) return;

      if (this.fryer.state === 'idle') {
        basketBox.className = 'fryer-basket-box idle';
        label.textContent = 'Canastilla Lista';
        btn.textContent = '🍟 Freír Papas (4s)';
        btn.disabled = false;
        if (bubbles) bubbles.classList.remove('active');
      } else if (this.fryer.state === 'frying') {
        basketBox.className = 'fryer-basket-box frying';
        label.textContent = 'Friéndose (' + this.fryer.timerSec + 's)...';
        btn.textContent = 'Friéndose (' + this.fryer.timerSec + 's)';
        btn.disabled = true;
        if (bubbles) bubbles.classList.add('active');
      } else if (this.fryer.state === 'ready') {
        basketBox.className = 'fryer-basket-box ready animate-bounce';
        label.textContent = '¡CRUJIENTES! (Toca para servir)';
        btn.textContent = '✅ Servir al Plato';
        btn.disabled = false;
        if (bubbles) bubbles.classList.remove('active');
      }
    },

    // ============================================================================
    // 9. ESTANTE DE INGREDIENTES Y TABLA DE ARMADO (ASSEMBLY BOARD)
    // ============================================================================

    renderIngredientShelf: function () {
      const container = this.rootEl.querySelector('#ingredientsShelfGrid');
      if (!container) return;

      const items = [
        'bottom_bun',
        'raw_patty',
        'cheese',
        'lettuce',
        'tomato',
        'onion',
        'top_bun',
        'fries'
      ];

      container.innerHTML = items.map(id => {
        const item = INGREDIENTS_DEF[id];
        return \`
          <button type="button" class="ingredient-bin-btn" onclick="window.CulinaryStudio2D.handleShelfItemClick('\${id}')" title="\${item.nameEn} (\${item.nameEs})">
            <span class="bin-icon">\${item.icon}</span>
            <div class="bin-labels">
              <span class="bin-name-en">\${item.nameEn}</span>
              <span class="bin-name-es">\${item.nameEs}</span>
            </div>
          </button>
        \`;
      }).join('');
    },

    handleShelfItemClick: function (ingredientId) {
      if (ingredientId === 'raw_patty') {
        // Enviar carne cruda a la plancha
        this.addRawPattyToFirstFreeSlot();
      } else if (ingredientId === 'fries') {
        // Si la freidora está lista o para agilizar
        if (this.fryer.state === 'ready') {
          this.handleFryerClick();
        } else {
          // freír directamente o advertir
          this.handleFryerClick();
        }
      } else {
        // Agregar capa directa al plato
        this.addIngredientToPlate(ingredientId);
      }
    },

    addIngredientToPlate: function (ingredientId) {
      if (!this.isOpen) return;

      if (ingredientId === 'fries') {
        // Las papas van a un lado del plato
        if (!this.currentPlateLayers.includes('fries')) {
          this.currentPlateLayers.push('fries');
          playSound('chop');
          speakText('Crispy French Fries');
        } else {
          this.showToast('Ya tienes papas fritas en el plato', 'info');
        }
      } else {
        // Apilar capa sobre la hamburguesa
        this.currentPlateLayers.push(ingredientId);
        playSound('chop');
        const item = INGREDIENTS_DEF[ingredientId];
        if (item) speakText(item.nameEn);
      }

      this.renderPlate();
    },

    renderPlate: function () {
      const container = this.rootEl.querySelector('#burgerStackContainer');
      const friesEl = this.rootEl.querySelector('#plateFriesSide');
      if (!container || !friesEl) return;

      // Filtrar papas para mostrarlas a un costado
      const burgerLayers = this.currentPlateLayers.filter(l => l !== 'fries');
      const hasFries = this.currentPlateLayers.includes('fries');

      if (hasFries) {
        friesEl.style.display = 'block';
        friesEl.innerHTML = getBurgerLayerSvg('fries');
      } else {
        friesEl.style.display = 'none';
        friesEl.innerHTML = '';
      }

      if (burgerLayers.length === 0 && !hasFries) {
        container.innerHTML = '<div class=\"empty-plate-hint\" id=\"emptyPlateHint\">Plato Vacío: Toca los ingredientes del estante para comenzar a armar...</div>';
        return;
      }

      // Renderizar de abajo hacia arriba las capas apiladas
      container.innerHTML = burgerLayers.map((layerId, idx) => {
        const svg = getBurgerLayerSvg(layerId);
        return \`<div class="burger-stack-item" style="z-index: \${idx + 2}; margin-top: \${idx === 0 ? '0' : '-14px'};">
          \${svg}
        </div>\`;
      }).join('');
    },

    clearPlate: function () {
      if (this.currentPlateLayers.length > 0) {
        playSound('chop');
        this.currentPlateLayers = [];
        this.renderPlate();
        this.showToast('🗑️ Plato limpio y listo para volver a armar', 'info');
      }
    },

    // ============================================================================
    // 10. ENTREGA DEL PEDIDO (SERVE ORDER) Y VERIFICACIÓN
    // ============================================================================

    serveOrder: function () {
      if (!this.isOpen || !this.activeOrder) return;

      const required = this.activeOrder.requiredLayers;
      const current = this.currentPlateLayers;

      if (current.length === 0) {
        playSound('wrong');
        this.showToast('⚠️ El plato está completamente vacío. ¡Arma el pedido primero!', 'error');
        return;
      }

      // Verificar que contenga todos los requeridos
      const missing = required.filter(item => !current.includes(item));
      const hasExtra = current.filter(item => !required.includes(item));

      if (missing.length === 0 && hasExtra.length === 0) {
        // ¡ÉXITO PERFECTO!
        if (this.patienceTimer) clearInterval(this.patienceTimer);

        playSound('bell');
        playSound('fanfare');

        // Actualizar emoción del comensal
        this.updateCustomerEmotion('ecstatic');

        // Elogio en inglés con voz
        const praise = (this.activePersona && this.activePersona.praiseEn) || "Delicious! Exactly what I ordered!";
        speakText(praise);

        // Recompensas
        const profile = getProfile();
        profile.ordersCompleted++;
        profile.perfectOrders++;
        profile.coins += (this.activeOrder.rewardCoins || 100);
        profile.score += (this.activeOrder.rewardExp || 50);

        // Recalcular nivel de Chef
        for (let i = RANKS.length - 1; i >= 0; i--) {
          if (profile.score >= RANKS[i].minScore) {
            profile.rankLevel = RANKS[i].level;
            break;
          }
        }
        saveProfile(profile);
        this.updateHeaderStats();

        this.showToast('⭐ ¡ORDEN PERFECTA! +' + this.activeOrder.rewardCoins + ' Coins / +' + this.activeOrder.rewardExp + ' EXP', 'success');

        // Mensaje de éxito en el globo
        const textEnEl = this.rootEl.querySelector('#orderTextEn');
        const textEsEl = this.rootEl.querySelector('#orderTextEs');
        if (textEnEl) textEnEl.textContent = '"' + praise + '"';
        if (textEsEl) textEsEl.textContent = '"' + ((this.activePersona && this.activePersona.praiseEs) || '¡Delicioso!') + '"';

        setTimeout(() => {
          if (this.isOpen) {
            this.clearPlate();
            this.startNewOrder();
          }
        }, 2200);

      } else {
        // Falló algún ingrediente
        playSound('wrong');
        let errorMsg = '⚠️ ';
        if (missing.length > 0) {
          const missingNames = missing.map(m => (INGREDIENTS_DEF[m] ? INGREDIENTS_DEF[m].nameEn : m)).join(', ');
          errorMsg += 'Faltan ingredientes: ' + missingNames;
        } else if (hasExtra.length > 0) {
          const extraNames = hasExtra.map(e => (INGREDIENTS_DEF[e] ? INGREDIENTS_DEF[e].nameEn : e)).join(', ');
          errorMsg += 'Ingredientes de más: ' + extraNames;
        }
        this.showToast(errorMsg, 'error');
        speakText('Check the ticket order carefully, Chef!');
      }
    },

    // ============================================================================
    // 11. DICCIONARIO GASTRONÓMICO (356 TÉRMINOS)
    // ============================================================================

    openDictionary: function () {
      const modal = this.rootEl.querySelector('#culinaryDictionaryModal');
      if (!modal) return;
      modal.style.display = 'flex';
      this.dictFilterCat = 'all';
      this.dictSearchTerm = '';
      const input = this.rootEl.querySelector('#dictSearchInput');
      if (input) input.value = '';
      this.renderDictionaryCards();
    },

    closeDictionary: function () {
      const modal = this.rootEl.querySelector('#culinaryDictionaryModal');
      if (modal) modal.style.display = 'none';
    },

    renderDictionaryCards: function () {
      const container = this.rootEl.querySelector('#dictCardsGrid');
      if (!container) return;

      const databank = (typeof window !== 'undefined' && window.CulinaryDatabank) || {};
      let allItems = [];

      // 1. Kitchen Brigade Slang (86)
      (databank.culinaryVerbsAndSlang || []).forEach(s => {
        allItems.push({
          type: 'slang',
          nameEn: s.termEn || s.nameEn,
          nameEs: s.termEs || s.nameEs,
          ipa: s.ipa || '/kɪtʃ.ən/',
          category: s.category || 'Kitchen Brigade Slang',
          desc: s.contextEn || s.definitionEn || '',
          example: s.exampleDialogueEn || s.audioPrompt || ''
        });
      });

      // 2. Equipment & Tools (100)
      (databank.equipmentAndTools || []).forEach(t => {
        allItems.push({
          type: 'tools',
          nameEn: t.nameEn,
          nameEs: t.nameEs,
          ipa: t.ipa || '/tuːl/',
          category: t.category || 'Tools & Heavy Equipment',
          desc: t.definitionEn || '',
          example: t.usageTipsEn || t.audioPrompt || ''
        });
      });

      // 3. Ingredients (170)
      (databank.ingredients || []).forEach(i => {
        allItems.push({
          type: 'ingredients',
          nameEn: i.nameEn,
          nameEs: i.nameEs,
          ipa: i.ipa || '/ɪnˈɡriː.di.ənt/',
          category: i.category || 'Fresh Ingredients & Cold Storage',
          desc: i.definitionEn || (i.culinaryRole ? 'Culinary Role: ' + i.culinaryRole : ''),
          example: i.storageZone ? 'HACCP Storage: ' + i.storageZone : ''
        });
      });

      // Filtrar por categoría y término de búsqueda
      let filtered = allItems;
      if (this.dictFilterCat !== 'all') {
        filtered = filtered.filter(item => item.type === this.dictFilterCat);
      }
      if (this.dictSearchTerm) {
        const q = this.dictSearchTerm;
        filtered = filtered.filter(item =>
          (item.nameEn && item.nameEn.toLowerCase().includes(q)) ||
          (item.nameEs && item.nameEs.toLowerCase().includes(q)) ||
          (item.desc && item.desc.toLowerCase().includes(q)) ||
          (item.example && item.example.toLowerCase().includes(q))
        );
      }

      if (filtered.length === 0) {
        container.innerHTML = '<div style=\"grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8;\"><div style=\"font-size: 32px;\">🔍</div><div style=\"font-weight: 700; margin-top: 8px;\">No se encontraron términos para \"' + this.dictSearchTerm + '\"</div></div>';
        return;
      }

      container.innerHTML = filtered.map(item => {
        const safeEn = (item.nameEn || '').replace(/'/g, "\\\\'");
        return \`
          <div class="dict-item-card">
            <div class="dict-card-top">
              <div>
                <div class="dict-card-name-en">\${item.nameEn}</div>
                <div class="dict-card-ipa">\${item.ipa}</div>
                <div class="dict-card-name-es">\${item.nameEs}</div>
              </div>
              <button type="button" class="btn-dict-tts" onclick="event.stopPropagation(); window.speakText && window.speakText('\${safeEn}', 'en-US', 1.0, '\${item.id || ''}')" title="Escuchar pronunciación">
                🔊
              </button>
            </div>
            <div class="dict-card-cat">\${item.category}</div>
            <div class="dict-card-desc">\${item.desc}</div>
            \${item.example ? '<div class=\"dict-card-example\">💬 ' + item.example + '</div>' : ''}
          </div>
        \`;
      }).join('');
    },

    // ============================================================================
    // 12. UTILIDADES, TOAST Y ENCABEZADO
    // ============================================================================

    showToast: function (msg, type = 'info') {
      const toast = this.rootEl.querySelector('#culinaryToast');
      if (!toast) return;

      toast.textContent = msg;
      toast.className = 'culinary-toast-notification ' + type;
      toast.style.display = 'block';

      clearTimeout(this._toastTimeout);
      this._toastTimeout = setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
    },

    updateHeaderStats: function () {
      const profile = getProfile();
      const rank = RANKS.find(r => r.level === profile.rankLevel) || RANKS[0];

      const coinsEl = this.rootEl.querySelector('#statChefCoins');
      if (coinsEl) coinsEl.textContent = profile.coins;

      const rankTitleEl = this.rootEl.querySelector('#statChefRankTitle');
      if (rankTitleEl) rankTitleEl.textContent = rank.title;

      const badgeIconEl = this.rootEl.querySelector('#statChefBadgeIcon');
      if (badgeIconEl) badgeIconEl.textContent = rank.badge;

      const starsEl = this.rootEl.querySelector('#statChefStars');
      if (starsEl) starsEl.textContent = '⭐ ' + (profile.stars || 1) + '★';
    },

    // ============================================================================
    // 13. APERTURA Y CIERRE DEL PORTAL (INTEGRACIÓN GLOBAL)
    // ============================================================================

    open: function (opts) {
      if (typeof window !== 'undefined' && typeof window.stopAllBackgroundAudioAndLoops === 'function') {
        window.stopAllBackgroundAudioAndLoops('culinary');
      }
      if (typeof window !== 'undefined' && typeof window.hideWorld3DTopBackButton === 'function') {
        window.hideWorld3DTopBackButton();
      }

      if (typeof document !== 'undefined') {
        ['view-home', 'practice-today-hero', 'coverFlowViewport', 'world3d-selection-hub', 'world3d-container', 'view-soccer-3d', 'hedbanz-3d-modal'].forEach((id) => {
          const el = document.getElementById(id);
          if (el) {
            el.classList.add('hidden');
            el.style.setProperty('display', 'none', 'important');
          }
        });
        document.body.classList.add('culinary-studio-active', 'in-immersive-portal');
      }

      this.isOpen = true;
      this.init();

      if (this.rootEl) {
        this.rootEl.classList.remove('hidden');
        this.rootEl.style.setProperty('display', 'flex', 'important');
      }

      this.updateHeaderStats();
      this.renderGrillSlots();
      this.renderFryer();
      this.renderIngredientShelf();
      this.renderPlate();

      // Iniciar primera orden
      this.startNewOrder(opts && opts.recipeIndex);
    },

    close: function (event) {
      if (event && event.stopPropagation) event.stopPropagation();
      this.isOpen = false;

      if (this.patienceTimer) {
        clearInterval(this.patienceTimer);
        this.patienceTimer = null;
      }
      if (this.grillInterval) {
        clearInterval(this.grillInterval);
        this.grillInterval = null;
      }
      if (this.fryer.interval) {
        clearInterval(this.fryer.interval);
        this.fryer.interval = null;
      }

      if (this.rootEl) {
        this.rootEl.style.setProperty('display', 'none', 'important');
        this.rootEl.classList.add('hidden');
      }

      if (typeof document !== 'undefined') {
        document.body.classList.remove('culinary-studio-active', 'in-immersive-portal');
      }

      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch (_) {}
      }

      if (typeof window.returnToMainPortals === 'function') {
        window.returnToMainPortals(event);
      } else if (typeof window.navigateTo === 'function') {
        window.navigateTo('view-home');
      }
    }
  };

  // Exponer a window y módulos
  global.speakText = speakText;
  global.CulinaryStudio2D = CulinaryStudio2D;

  global.openCulinaryStudioPortal = function (opts) {
    if (typeof global.hideAllModules === 'function') {
      try {
        global._suppressReturnToPortals = true;
        global.hideAllModules();
        global._suppressReturnToPortals = false;
      } catch (_) {}
    }
    if (typeof document !== 'undefined') {
      document.body.classList.add('culinary-studio-active');
    }
    CulinaryStudio2D.open(opts);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CulinaryStudio2D;
  }
})(typeof window !== 'undefined' ? window : globalThis);
`;

fs.writeFileSync('js/culinary_studio_2d.js', jsContent, 'utf8');
console.log('js/culinary_studio_2d.js successfully written!');

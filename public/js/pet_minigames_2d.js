/**
 * ============================================================================
 * MasterENG - 2D Physics Minigames Engine (Pou Sports & English Arcade)
 * Archivo: js/pet_minigames_2d.js
 *
 * Motor interactivo de minijuegos 2D estilo Pou dentro del hábitat de la mascota:
 * 1. 🏀 Pou Basketball Hoops (Tiro a la canasta con físicas 2D & Golden Shot bilingüe)
 * 2. 🏐 Pou Beach Volleyball 2D (Voleibol contra bot/amigo con remates Spike! y turbo)
 * 3. 🍎 Word Food Catch (Atrapa la comida correcta según el antojo en inglés)
 *
 * Otorga PetCoins, EXP, Felicidad (Fun = 100%) y refuerza vocabulario deportivo y de alimentos.
 * ============================================================================
 */

(function (global) {
  'use strict';

  // ============================================================================
  // 1. MOTOR DE AUDIO PROCEDURAL (WEB AUDIO API) & VOCES (WEB SPEECH)
  // ============================================================================

  class ArcadeAudioEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    init() {
      if (!this.ctx && (global.AudioContext || global.webkitAudioContext)) {
        try {
          const AudioCtx = global.AudioContext || global.webkitAudioContext;
          this.ctx = new AudioCtx();
        } catch (e) {
          console.warn('ArcadeAudioEngine: Web Audio no disponible', e);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    playWhoosh() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.16);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } catch (e) {}
    }

    playBounce(isHigh = false) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const now = this.ctx.currentTime;
        const baseFreq = isHigh ? 380 : 180;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } catch (e) {}
    }

    playNetSwish() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc2.frequency.setValueAtTime(880, now);    // A5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);
      } catch (e) {}
    }

    playSpike() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) {}
    }

    playChomp() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } catch (e) {}
    }

    playSplat() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc.type = 'square';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.linearRampToValueAtTime(55, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } catch (e) {}
    }

    playCoin() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      } catch (e) {}
    }

    playFanfare() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const now = this.ctx.currentTime + idx * 0.09;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
        });
      } catch (e) {}
    }

    speak(text, lang = 'en-US') {
      if (this.muted || !('speechSynthesis' in global)) return;
      try {
        global.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        utter.rate = 1.0;
        utter.pitch = 1.1;
        global.speechSynthesis.speak(utter);
      } catch (e) {}
    }
  }

  // ============================================================================
  // 2. DICCIONARIOS EDUCATIVOS DE VOCABULARIO DEPORTIVO Y ALIMENTICIO
  // ============================================================================

  const BASKETBALL_VOCABULARY = [
    { es: 'Lanzar al aro', en: 'To Shoot', distractor: 'To Dribble', ipa: '/tuː ʃuːt/' },
    { es: 'Rebotar el balón', en: 'To Bounce', distractor: 'To Block', ipa: '/tuː baʊns/' },
    { es: 'Pasar el balón', en: 'To Pass', distractor: 'To Foul', ipa: '/tuː pæs/' },
    { es: 'Encestar / Anotar', en: 'To Score', distractor: 'To Trip', ipa: '/tuː skɔːr/' },
    { es: 'Clavar el balón', en: 'To Dunk', distractor: 'To Slip', ipa: '/tuː dʌŋk/' },
    { es: 'Aro de básquetbol', en: 'The Hoop', distractor: 'The Bench', ipa: '/ðə huːp/' },
    { es: 'Tablero de la canasta', en: 'The Backboard', distractor: 'The Whistle', ipa: '/ðə ˈbæk.bɔːrd/' },
    { es: 'Tiro libre', en: 'Free Throw', distractor: 'Half Time', ipa: '/friː θroʊ/' }
  ];

  const VOLLEYBALL_VOCABULARY = [
    { es: 'Rematar con fuerza', en: 'Spike', tip: 'Un remate fulminante sobre la red' },
    { es: 'Servir / Sacar', en: 'Serve', tip: 'El saque que inicia el punto' },
    { es: 'Bloquear en la red', en: 'Block', tip: 'Detener el balón del rival con las manos en alto' },
    { es: 'Pase de colocación', en: 'Set', tip: 'Acomodar el balón en el aire para el compañero' },
    { es: 'Recepción defensiva', en: 'Dig', tip: 'Salvar el balón justo antes de que toque el suelo' },
    { es: 'Red central', en: 'Net', tip: 'La malla que divide la cancha de voleibol' }
  ];

  const FOOD_CATCH_ITEMS = [
    // Frutas (Healthy Fruits)
    { id: 'apple', label: 'Apple', es: 'Manzana', cat: 'fruit', icon: '🍎', pts: 10, isBad: false },
    { id: 'banana', label: 'Banana', es: 'Plátano', cat: 'fruit', icon: '🍌', pts: 10, isBad: false },
    { id: 'strawberry', label: 'Strawberry', es: 'Fresa', cat: 'fruit', icon: '🍓', pts: 12, isBad: false },
    { id: 'watermelon', label: 'Watermelon', es: 'Sandía', cat: 'fruit', icon: '🍉', pts: 15, isBad: false },
    { id: 'orange', label: 'Orange', es: 'Naranja', cat: 'fruit', icon: '🍊', pts: 10, isBad: false },
    { id: 'grapes', label: 'Grapes', es: 'Uvas', cat: 'fruit', icon: '🍇', pts: 12, isBad: false },

    // Verduras (Healthy Vegetables)
    { id: 'broccoli', label: 'Broccoli', es: 'Brócoli', cat: 'vegetable', icon: '🥦', pts: 12, isBad: false },
    { id: 'carrot', label: 'Carrot', es: 'Zanahoria', cat: 'vegetable', icon: '🥕', pts: 10, isBad: false },
    { id: 'lettuce', label: 'Lettuce', es: 'Lechuga', cat: 'vegetable', icon: '🥬', pts: 10, isBad: false },
    { id: 'corn', label: 'Corn', es: 'Elote / Maíz', cat: 'vegetable', icon: '🌽', pts: 10, isBad: false },
    { id: 'tomato', label: 'Tomato', es: 'Jitomate', cat: 'vegetable', icon: '🍅', pts: 10, isBad: false },

    // Proteínas y Saludables
    { id: 'fish', label: 'Fish', es: 'Pescado', cat: 'protein', icon: '🐟', pts: 15, isBad: false },
    { id: 'egg', label: 'Boiled Egg', es: 'Huevo', cat: 'protein', icon: '🥚', pts: 10, isBad: false },
    { id: 'milk', label: 'Warm Milk', es: 'Leche', cat: 'dairy', icon: '🥛', pts: 10, isBad: false },

    // Comida Chatarra / Golosinas (Junk / Sweets)
    { id: 'donut', label: 'Donut', es: 'Dona', cat: 'junk', icon: '🍩', pts: 5, isBad: false },
    { id: 'candy', label: 'Candy', es: 'Caramelo', cat: 'junk', icon: '🍬', pts: 5, isBad: false },

    // Basura y Obstáculos (Hazards)
    { id: 'boot', label: 'Old Boot', es: 'Bota Vieja', cat: 'hazard', icon: '🥾', pts: -15, isBad: true },
    { id: 'bone', label: 'Fish Bones', es: 'Espinas', cat: 'hazard', icon: '🦴', pts: -15, isBad: true },
    { id: 'can', label: 'Rusty Can', es: 'Lata Oxidada', cat: 'hazard', icon: '🥫', pts: -15, isBad: true },
    { id: 'bomb', label: 'Cardboard Bomb', es: 'Bomba', cat: 'hazard', icon: '💣', pts: -25, isBad: true }
  ];

  // ============================================================================
  // 3. RENDERIZADOR DEL PERSONAJE DE CARTÓN PARA LOS MINIJUEGOS
  // ============================================================================

  const MASCOT_COLORS = {
    crocodile: { base: '#65a30d', belly: '#bef264', accent: '#365314', eye: '#facc15' },
    rhinoceros: { base: '#78716c', belly: '#d6d3d1', accent: '#44403c', eye: '#38bdf8' },
    dog:        { base: '#d97706', belly: '#fde68a', accent: '#92400e', eye: '#451a03' },
    cat:        { base: '#f59e0b', belly: '#fef3c7', accent: '#b45309', eye: '#10b981' },
    axolotl:    { base: '#f472b6', belly: '#fce7f3', accent: '#db2777', eye: '#1e1b4b' },
    red_panda:  { base: '#ea580c', belly: '#ffedd5', accent: '#7c2d12', eye: '#451a03' }
  };

  function drawPaperMascot(ctx, x, y, scale = 1, options = {}) {
    const species = options.species || 'crocodile';
    const colors = MASCOT_COLORS[species] || MASCOT_COLORS.crocodile;
    const mood = options.mood || 'normal';
    const mouthOpen = options.mouthOpen || false;
    const facing = options.facing || 1; // 1 = right, -1 = left
    const hat = options.hat || 'none';

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * facing, scale);

    // Sombra de recorte
    ctx.save();
    ctx.fillStyle = 'rgba(78, 52, 32, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 42, 28, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cuerpo / Silueta tipo recorte de cartón corrugado
    ctx.fillStyle = colors.base;
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.roundRect(-24, -20, 48, 56, [20, 20, 24, 24]);
    ctx.fill();
    ctx.stroke();

    // Costuras de hilo de papel discontinuas
    ctx.save();
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.roundRect(-21, -17, 42, 50, [16, 16, 20, 20]);
    ctx.stroke();
    ctx.restore();

    // Barriga texturizada
    ctx.fillStyle = colors.belly;
    ctx.beginPath();
    ctx.ellipse(0, 10, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cabeza
    ctx.fillStyle = colors.base;
    ctx.beginPath();
    ctx.ellipse(0, -30, 26, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Detalles por especie
    if (species === 'crocodile') {
      // Hocico con colmillos
      ctx.fillStyle = colors.base;
      ctx.beginPath();
      ctx.roundRect(10, -32, 18, 12, [4, 8, 8, 4]);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(14, -20); ctx.lineTo(17, -15); ctx.lineTo(20, -20);
      ctx.fill();
    } else if (species === 'rhinoceros') {
      // Cuerno de marfil de cartulina
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(18, -32); ctx.lineTo(30, -42); ctx.lineTo(22, -26);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (species === 'cat') {
      // Orejitas puntiagudas
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.moveTo(-20, -45); ctx.lineTo(-12, -60); ctx.lineTo(-4, -48);
      ctx.moveTo(4, -48); ctx.lineTo(12, -60); ctx.lineTo(20, -45);
      ctx.fill();
      ctx.stroke();
    } else if (species === 'dog') {
      // Orejas caídas suaves
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.ellipse(-22, -28, 8, 16, Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(22, -28, 8, 16, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (species === 'axolotl') {
      // Branquias rosadas rizadas
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.ellipse(-26, -34, 10, 5, -0.4, 0, Math.PI * 2);
      ctx.ellipse(-28, -25, 9, 4, -0.1, 0, Math.PI * 2);
      ctx.ellipse(26, -34, 10, 5, 0.4, 0, Math.PI * 2);
      ctx.ellipse(28, -25, 9, 4, 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ojos
    const eyeOffsetX = options.lookAtX ? Math.max(-4, Math.min(4, options.lookAtX * 4)) : 2;
    const eyeOffsetY = options.lookAtY ? Math.max(-3, Math.min(3, options.lookAtY * 3)) : 0;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-8, -32, 6, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(10, -32, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pupilas
    ctx.fillStyle = colors.eye || '#1e293b';
    ctx.beginPath();
    ctx.arc(-8 + eyeOffsetX, -32 + eyeOffsetY, 3.5, 0, Math.PI * 2);
    ctx.arc(10 + eyeOffsetX, -32 + eyeOffsetY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Reflejo blanco en las pupilas
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-9 + eyeOffsetX, -34 + eyeOffsetY, 1.2, 0, Math.PI * 2);
    ctx.arc(9 + eyeOffsetX, -34 + eyeOffsetY, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Boca
    if (mouthOpen) {
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(2, -18, 9, 0, Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (mood === 'happy') {
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(2, -22, 6, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else if (mood === 'stunned') {
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(2, -20, 5, 6, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(2, -21, 5, 0.3, Math.PI - 0.3);
      ctx.stroke();
    }

    // Sombrero / Disfraz
    if (hat === 'crown' || hat === 'royal_cape') {
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-16, -50);
      ctx.lineTo(-18, -64);
      ctx.lineTo(-8, -56);
      ctx.lineTo(0, -66);
      ctx.lineTo(8, -56);
      ctx.lineTo(18, -64);
      ctx.lineTo(16, -50);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Gema roja
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -56, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (hat === 'aviator') {
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(-20, -56, 40, 12, 4);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(-8, -50, 5, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(8, -50, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (hat === 'bow') {
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.moveTo(12, -48); ctx.lineTo(24, -58); ctx.lineTo(24, -38); ctx.closePath();
      ctx.moveTo(12, -48); ctx.lineTo(0, -58); ctx.lineTo(0, -38); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(12, -48, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ============================================================================
  // 4. JUEGO 1: 🏀 POU BASKETBALL HOOPS (FÍSICAS 2D & GOLDEN VOCABULARY SHOT)
  // ============================================================================

  class BasketballGame {
    constructor(canvas, sfx, onFinish) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.sfx = sfx;
      this.onFinish = onFinish;

      this.running = false;
      this.width = canvas.width;
      this.height = canvas.height;

      this.score = 0;
      this.streak = 0;
      this.shotsLeft = 10;
      this.coinsEarned = 0;
      this.expEarned = 0;

      // Estado de la bola
      this.ball = {
        x: 120,
        y: this.height - 130,
        radius: 17,
        vx: 0,
        vy: 0,
        rotation: 0,
        inFlight: false,
        scored: false
      };

      // Físicas
      this.gravity = 0.44;
      this.floorY = this.height - 55;

      // Aro / Canasta
      this.hoop = {
        x: this.width - 120,
        y: this.height * 0.48,
        width: 60,
        rimRadius: 4,
        backboardHeight: 90,
        swish: 0,
        offsetY: 0,
        targetY: this.height * 0.48
      };

      // Golden Shot Educativo
      this.goldenShotActive = false;
      this.goldenVocab = null;
      this.secondHoop = null; // Segundo aro para opción alternativa

      // Entrada (drag & flick)
      this.isDragging = false;
      this.dragStart = { x: 0, y: 0 };
      this.dragCurrent = { x: 0, y: 0 };

      // Partículas
      this.particles = [];

      this.bindInputs();
    }

    bindInputs() {
      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: (clientX - rect.left) * (this.canvas.width / rect.width),
          y: (clientY - rect.top) * (this.canvas.height / rect.height)
        };
      };

      this._onDown = (e) => {
        if (!this.running || this.ball.inFlight) return;
        const pos = getPos(e);
        const dist = Math.hypot(pos.x - this.ball.x, pos.y - this.ball.y);
        if (dist < 60) {
          this.isDragging = true;
          this.dragStart = { x: this.ball.x, y: this.ball.y };
          this.dragCurrent = pos;
        }
      };

      this._onMove = (e) => {
        if (!this.isDragging) return;
        this.dragCurrent = getPos(e);
      };

      this._onUp = (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;

        const dx = this.dragStart.x - this.dragCurrent.x;
        const dy = this.dragStart.y - this.dragCurrent.y;
        const force = Math.min(26, Math.hypot(dx, dy) * 0.16);

        if (force > 3) {
          const angle = Math.atan2(dy, dx);
          this.ball.vx = Math.cos(angle) * force * 1.35;
          this.ball.vy = Math.sin(angle) * force * 1.35;
          this.ball.inFlight = true;
          this.ball.scored = false;
          this.sfx.playWhoosh();
        }
      };

      this.canvas.addEventListener('mousedown', this._onDown);
      window.addEventListener('mousemove', this._onMove);
      window.addEventListener('mouseup', this._onUp);

      this.canvas.addEventListener('touchstart', this._onDown, { passive: false });
      window.addEventListener('touchmove', this._onMove, { passive: false });
      window.addEventListener('touchend', this._onUp, { passive: false });
    }

    destroy() {
      this.running = false;
      if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
      this.canvas.removeEventListener('mousedown', this._onDown);
      window.removeEventListener('mousemove', this._onMove);
      window.removeEventListener('mouseup', this._onUp);

      this.canvas.removeEventListener('touchstart', this._onDown);
      window.removeEventListener('touchmove', this._onMove);
      window.removeEventListener('touchend', this._onUp);
    }

    start() {
      this.running = true;
      this.score = 0;
      this.streak = 0;
      this.shotsLeft = 10;
      this.coinsEarned = 0;
      this.expEarned = 0;
      this.resetBall();
      this.loop();
    }

    resetBall() {
      this.ball.x = 120;
      this.ball.y = this.floorY - 60;
      this.ball.vx = 0;
      this.ball.vy = 0;
      this.ball.inFlight = false;
      this.ball.scored = false;

      // Cada 3 canastas se activa Golden Shot
      if (this.score > 0 && this.score % 3 === 0 && !this.goldenShotActive) {
        this.activateGoldenShot();
      } else {
        this.goldenShotActive = false;
        this.secondHoop = null;
      }

      // Movimiento dinámico del aro tras 3 canastas
      if (this.score >= 3) {
        this.hoop.targetY = this.height * 0.35 + Math.random() * (this.height * 0.3);
      }
    }

    activateGoldenShot() {
      this.goldenShotActive = true;
      const vocabIdx = Math.floor(Math.random() * BASKETBALL_VOCABULARY.length);
      this.goldenVocab = BASKETBALL_VOCABULARY[vocabIdx];

      // Segundo aro alternativo para la opción distractora
      this.secondHoop = {
        x: this.hoop.x - 140,
        y: this.hoop.y + 70,
        width: 60,
        rimRadius: 4,
        backboardHeight: 80,
        swish: 0,
        label: this.goldenVocab.distractor,
        isCorrect: false
      };
      this.hoop.label = this.goldenVocab.en;
      this.hoop.isCorrect = true;

      // Anunciar por voz
      this.sfx.speak(`Golden Shot! What is: ${this.goldenVocab.es}?`);
    }

    update() {
      const time = Date.now() * 0.003;

      // Movimiento suave del aro
      if (this.score >= 3) {
        this.hoop.y += (this.hoop.targetY - this.hoop.y) * 0.05;
        this.hoop.y += Math.sin(time) * 1.5;
      }

      if (this.hoop.swish > 0) this.hoop.swish -= 0.05;
      if (this.secondHoop && this.secondHoop.swish > 0) this.secondHoop.swish -= 0.05;

      // Físicas de la bola en vuelo
      if (this.ball.inFlight) {
        const prevY = this.ball.y;
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;
        this.ball.vy += this.gravity;
        this.ball.rotation += this.ball.vx * 0.04;

        // Rebote en el suelo
        if (this.ball.y + this.ball.radius >= this.floorY) {
          this.ball.y = this.floorY - this.ball.radius;
          this.ball.vy = -this.ball.vy * 0.68;
          this.ball.vx *= 0.82;
          this.sfx.playBounce();

          if (Math.abs(this.ball.vy) < 1.2) {
            this.ball.vy = 0;
            // Termina el tiro
            setTimeout(() => {
              if (this.running) {
                this.shotsLeft--;
                if (this.shotsLeft <= 0) {
                  this.finishGame();
                } else {
                  this.resetBall();
                }
              }
            }, 600);
          }
        }

        // Rebote en paredes laterales
        if (this.ball.x - this.ball.radius <= 0) {
          this.ball.x = this.ball.radius;
          this.ball.vx = -this.ball.vx * 0.7;
          this.sfx.playBounce();
        } else if (this.ball.x + this.ball.radius >= this.width) {
          this.ball.x = this.width - this.ball.radius;
          this.ball.vx = -this.ball.vx * 0.7;
          this.sfx.playBounce();
        }

        // Colisión con Aro 1 (Principal)
        this.checkHoopCollision(this.hoop, prevY);

        // Colisión con Aro 2 (Segundo aro en Golden Shot)
        if (this.secondHoop) {
          this.checkHoopCollision(this.secondHoop, prevY);
        }
      }

      // Actualizar partículas
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.alpha -= 0.02;
        if (p.alpha <= 0) this.particles.splice(i, 1);
      }
    }

    checkHoopCollision(hoop, prevY) {
      const rimLeft = hoop.x;
      const rimRight = hoop.x + hoop.width;
      const rimY = hoop.y;
      const backboardX = hoop.x + hoop.width + 6;

      // Rebote en tablero
      if (this.ball.x + this.ball.radius >= backboardX &&
          this.ball.x - this.ball.radius <= backboardX + 10 &&
          this.ball.y >= hoop.y - hoop.backboardHeight * 0.6 &&
          this.ball.y <= hoop.y + 15) {
        this.ball.x = backboardX - this.ball.radius;
        this.ball.vx = -Math.abs(this.ball.vx) * 0.7;
        this.sfx.playBounce(true);
      }

      // Rebote en los bordes del aro
      [rimLeft, rimRight].forEach(rx => {
        const dist = Math.hypot(this.ball.x - rx, this.ball.y - rimY);
        if (dist < this.ball.radius + hoop.rimRadius) {
          const angle = Math.atan2(this.ball.y - rimY, this.ball.x - rx);
          this.ball.vx = Math.cos(angle) * 6;
          this.ball.vy = Math.sin(angle) * 6;
          this.sfx.playBounce(true);
        }
      });

      // Enceste: la bola pasa de arriba a abajo entre rimLeft y rimRight
      if (!this.ball.scored &&
          prevY <= rimY &&
          this.ball.y >= rimY &&
          this.ball.x > rimLeft + 4 &&
          this.ball.x < rimRight - 4 &&
          this.ball.vy > 0) {
        
        this.ball.scored = true;
        hoop.swish = 1.0;
        this.sfx.playNetSwish();

        let pts = 1;
        let bonusCoins = 5;
        let bonusExp = 15;

        if (this.goldenShotActive) {
          if (hoop.isCorrect) {
            pts = 3;
            bonusCoins = 25;
            bonusExp = 45;
            this.sfx.playCoin();
            this.sfx.speak(`${this.goldenVocab.en}! Correct!`);
            this.spawnConfetti(hoop.x + hoop.width * 0.5, hoop.y, 35);
          } else {
            this.sfx.speak(`Oops! That was: ${hoop.label}`);
          }
        } else {
          this.spawnConfetti(hoop.x + hoop.width * 0.5, hoop.y, 15);
        }

        this.score += pts;
        this.streak++;
        this.coinsEarned += bonusCoins;
        this.expEarned += bonusExp;

        // Freno leve al pasar la red
        this.ball.vy *= 0.5;
        this.ball.vx *= 0.3;
      }
    }

    spawnConfetti(x, y, count = 20) {
      const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#ffffff'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 5,
          alpha: 1
        });
      }
    }

    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      // Fondo Cancha de Básquetbol de Cartón
      ctx.fillStyle = '#caa778';
      ctx.fillRect(0, 0, this.width, this.height);

      // Líneas de duela de madera texturizada
      ctx.save();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.2;
      for (let y = 0; y < this.height; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(this.width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Suelo de la cancha
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, this.floorY, this.width, this.height - this.floorY);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, this.floorY, this.width, 6);

      // Línea de tiro de cartón
      ctx.save();
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(this.hoop.x, this.floorY, 180, Math.PI, Math.PI * 1.5);
      ctx.stroke();
      ctx.restore();

      // Dibujar Mascota
      const petOptions = {
        species: (global.PetEngine2D && global.PetEngine2D.state.species) || 'crocodile',
        hat: (global.PetEngine2D && global.PetEngine2D.state.hat) || 'none',
        mood: this.ball.scored ? 'happy' : 'normal',
        mouthOpen: this.isDragging
      };
      drawPaperMascot(ctx, 110, this.floorY - 24, 1.1, petOptions);

      // Dibujar Trayectoria punteada si se está apuntando
      if (this.isDragging) {
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();

        let simX = this.ball.x;
        let simY = this.ball.y;
        const dx = this.dragStart.x - this.dragCurrent.x;
        const dy = this.dragStart.y - this.dragCurrent.y;
        const force = Math.min(26, Math.hypot(dx, dy) * 0.16);
        const angle = Math.atan2(dy, dx);
        let simVx = Math.cos(angle) * force * 1.35;
        let simVy = Math.sin(angle) * force * 1.35;

        ctx.moveTo(simX, simY);
        for (let t = 0; t < 28; t++) {
          simX += simVx;
          simY += simVy;
          simVy += this.gravity;
          ctx.lineTo(simX, simY);
          if (simY > this.floorY) break;
        }
        ctx.stroke();
        ctx.restore();
      }

      // Dibujar Aro(s)
      this.drawHoop(this.hoop, this.goldenShotActive);
      if (this.secondHoop) {
        this.drawHoop(this.secondHoop, true);
      }

      // Dibujar Balón de Básquetbol de Cartón
      this.drawBasketball();

      // Dibujar Partículas
      this.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.rect(p.x, p.y, p.size, p.size);
        ctx.fill();
        ctx.restore();
      });

      // HUD Superior
      this.drawHUD();
    }

    drawHoop(hoop, isGolden = false) {
      const ctx = this.ctx;
      const backboardX = hoop.x + hoop.width + 6;
      const backboardY = hoop.y - hoop.backboardHeight * 0.6;

      // Poste de soporte
      ctx.fillStyle = '#64748b';
      ctx.fillRect(backboardX + 10, backboardY + 20, 14, this.floorY - (backboardY + 20));

      // Tablero de cartón
      ctx.fillStyle = isGolden ? '#fef08a' : '#f8fafc';
      ctx.strokeStyle = isGolden ? '#b45309' : '#dc2626';
      ctx.lineWidth = 3;
      ctx.fillRect(backboardX, backboardY, 12, hoop.backboardHeight);
      ctx.strokeRect(backboardX, backboardY, 12, hoop.backboardHeight);

      // Aro
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = hoop.rimRadius * 2;
      ctx.beginPath();
      ctx.moveTo(hoop.x, hoop.y);
      ctx.lineTo(hoop.x + hoop.width, hoop.y);
      ctx.stroke();

      // Red tejida con movimiento swish
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([3, 3]);
      const swishOffset = Math.sin(hoop.swish * Math.PI) * 12;

      ctx.beginPath();
      ctx.moveTo(hoop.x + 2, hoop.y);
      ctx.quadraticCurveTo(hoop.x + hoop.width * 0.3, hoop.y + 35 + swishOffset, hoop.x + hoop.width * 0.4 + swishOffset, hoop.y + 45);
      ctx.lineTo(hoop.x + hoop.width * 0.6 + swishOffset, hoop.y + 45);
      ctx.quadraticCurveTo(hoop.x + hoop.width * 0.7, hoop.y + 35 + swishOffset, hoop.x + hoop.width - 2, hoop.y);
      ctx.stroke();
      ctx.restore();

      // Etiqueta del Aro en Golden Shot
      if (hoop.label) {
        ctx.save();
        ctx.fillStyle = hoop.isCorrect ? '#15803d' : '#991b1b';
        ctx.strokeStyle = '#fef3c7';
        ctx.lineWidth = 2;
        ctx.font = 'bold 13px system-ui, sans-serif';
        const txt = hoop.label;
        const tw = ctx.measureText(txt).width;
        ctx.beginPath();
        ctx.roundRect(hoop.x + (hoop.width - tw) * 0.5 - 8, hoop.y - 28, tw + 16, 22, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.fillText(txt, hoop.x + (hoop.width - tw) * 0.5, hoop.y - 13);
        ctx.restore();
      }
    }

    drawBasketball() {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(this.ball.x, this.ball.y);
      ctx.rotate(this.ball.rotation);

      // Balón naranja
      ctx.fillStyle = '#ea580c';
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, this.ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Costuras negras del balón
      ctx.strokeStyle = '#431407';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-this.ball.radius, 0); ctx.lineTo(this.ball.radius, 0);
      ctx.moveTo(0, -this.ball.radius); ctx.lineTo(0, this.ball.radius);
      ctx.stroke();

      // Curvas del balón
      ctx.beginPath();
      ctx.arc(-8, 0, 13, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(8, 0, 13, Math.PI * 0.6, Math.PI * 1.4);
      ctx.stroke();

      ctx.restore();
    }

    drawHUD() {
      const ctx = this.ctx;
      // Banner superior
      ctx.fillStyle = 'rgba(67, 20, 7, 0.85)';
      ctx.beginPath();
      ctx.roundRect(14, 12, this.width - 28, 44, 12);
      ctx.fill();

      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText(`🏀 Canastas: ${this.score}`, 28, 38);
      ctx.fillText(`🪙 +${this.coinsEarned}`, 160, 38);
      ctx.fillText(`⭐ +${this.expEarned} XP`, 240, 38);
      ctx.fillText(`🎯 Tiros Restantes: ${this.shotsLeft}`, this.width - 170, 38);

      // Banner Golden Shot Educativo
      if (this.goldenShotActive && this.goldenVocab) {
        ctx.save();
        ctx.fillStyle = '#b45309';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(20, 64, this.width - 40, 48, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.fillText('🌟 ¡GOLDEN ENGLISH SHOT! (Doble Recompensa)', 32, 84);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.fillText(`¿Cómo se dice en inglés: "${this.goldenVocab.es}"? ¡Encesta en el aro correcto!`, 32, 103);
        ctx.restore();
      }
    }

    loop() {
      if (!this.running) return;
      if (!document.getElementById('pet-sanctuary-root') || document.getElementById('pet-sanctuary-root').style.display === 'none') {
        const modal = typeof document !== 'undefined' ? document.getElementById('petArcadeModal') : null;
        if (!modal || modal.classList.contains('hidden') || modal.style.display === 'none') {
          this.destroy();
          return;
        }
      }
      this.update();
      this.draw();
      this.animId = requestAnimationFrame(() => this.loop());
    }

    finishGame() {
      this.running = false;
      this.sfx.playFanfare();
      if (this.onFinish) {
        this.onFinish({
          gameId: 'basketball',
          title: 'Pou Basketball Hoops',
          score: this.score,
          coins: this.coinsEarned + 10,
          exp: this.expEarned + 25,
          words: BASKETBALL_VOCABULARY.slice(0, 4)
        });
      }
    }
  }

  // ============================================================================
  // 5. JUEGO 2: 🏐 POU BEACH VOLLEYBALL 2D (VOLEIBOL CONTRA BOT CON REMATE SPIKE)
  // ============================================================================

  class VolleyballGame {
    constructor(canvas, sfx, onFinish) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.sfx = sfx;
      this.onFinish = onFinish;

      this.running = false;
      this.width = canvas.width;
      this.height = canvas.height;

      this.playerScore = 0;
      this.rivalScore = 0;
      this.coinsEarned = 0;
      this.expEarned = 0;

      this.sandY = this.height - 45;
      this.netX = this.width * 0.5;
      this.netHeight = 125;
      this.netWidth = 10;

      // Jugador
      this.player = {
        x: this.width * 0.25,
        y: this.sandY - 30,
        vx: 0,
        vy: 0,
        isJumping: false,
        speed: 5.5,
        turboTimer: 0
      };

      // Oponente Bot
      this.bot = {
        x: this.width * 0.75,
        y: this.sandY - 30,
        vx: 0,
        vy: 0,
        isJumping: false,
        speed: 4.2
      };

      // Balón
      this.ball = {
        x: this.width * 0.25,
        y: 120,
        radius: 15,
        vx: 2,
        vy: 0,
        rotation: 0
      };

      this.gravity = 0.38;
      this.spikeEffect = { text: '', timer: 0, x: 0, y: 0 };
      this.particles = [];

      this.keys = { left: false, right: false, jump: false };
      this.bindInputs();
    }

    bindInputs() {
      this._onKeyDown = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
          this.keys.jump = true;
          this.triggerPlayerJump();
        }
      };

      this._onKeyUp = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') this.keys.jump = false;
      };

      window.addEventListener('keydown', this._onKeyDown);
      window.addEventListener('keyup', this._onKeyUp);
    }

    destroy() {
      this.running = false;
      if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
      window.removeEventListener('keydown', this._onKeyDown);
      window.removeEventListener('keyup', this._onKeyUp);
    }

    start() {
      this.running = true;
      this.playerScore = 0;
      this.rivalScore = 0;
      this.coinsEarned = 0;
      this.expEarned = 0;
      this.resetRound(true);
      this.loop();
    }

    resetRound(servedByPlayer = true) {
      this.player.x = this.width * 0.25;
      this.player.y = this.sandY - 30;
      this.player.vx = 0;
      this.player.vy = 0;

      this.bot.x = this.width * 0.75;
      this.bot.y = this.sandY - 30;
      this.bot.vx = 0;
      this.bot.vy = 0;

      if (servedByPlayer) {
        this.ball.x = this.player.x;
        this.ball.y = 120;
        this.ball.vx = 2.5;
        this.ball.vy = -3;
      } else {
        this.ball.x = this.bot.x;
        this.ball.y = 120;
        this.ball.vx = -2.5;
        this.ball.vy = -3;
      }
    }

    triggerPlayerJump() {
      if (!this.player.isJumping) {
        this.player.vy = this.player.turboTimer > 0 ? -12.5 : -10.5;
        this.player.isJumping = true;
        this.sfx.playWhoosh();
      }
    }

    activateTurbo() {
      this.player.turboTimer = 180; // 3 segundos a 60 FPS
      this.sfx.playCoin();
      this.sfx.speak('Speed Turbo Active!');
    }

    update() {
      // Manejo de Turbo
      if (this.player.turboTimer > 0) this.player.turboTimer--;
      const currentSpeed = this.player.turboTimer > 0 ? this.player.speed * 1.4 : this.player.speed;

      // Movimiento del Jugador
      if (this.keys.left) this.player.vx = -currentSpeed;
      else if (this.keys.right) this.player.vx = currentSpeed;
      else this.player.vx *= 0.6;

      this.player.x += this.player.vx;
      this.player.y += this.player.vy;
      this.player.vy += this.gravity;

      // Límites Jugador (su lado de la cancha)
      if (this.player.x < 35) this.player.x = 35;
      if (this.player.x > this.netX - 25) this.player.x = this.netX - 25;
      if (this.player.y >= this.sandY - 30) {
        this.player.y = this.sandY - 30;
        this.player.vy = 0;
        this.player.isJumping = false;
      }

      // IA del Oponente Bot
      const targetBotX = Math.max(this.netX + 35, Math.min(this.width - 40, this.ball.x + 10));
      if (this.bot.x < targetBotX - 8) this.bot.vx = this.bot.speed;
      else if (this.bot.x > targetBotX + 8) this.bot.vx = -this.bot.speed;
      else this.bot.vx = 0;

      this.bot.x += this.bot.vx;
      this.bot.y += this.bot.vy;
      this.bot.vy += this.gravity;

      // Salto del Bot al alcanzar el balón
      if (!this.bot.isJumping && this.ball.x > this.netX && Math.abs(this.ball.x - this.bot.x) < 40 && this.ball.y < this.sandY - 70) {
        this.bot.vy = -10;
        this.bot.isJumping = true;
      }

      if (this.bot.y >= this.sandY - 30) {
        this.bot.y = this.sandY - 30;
        this.bot.vy = 0;
        this.bot.isJumping = false;
      }

      // Movimiento del Balón
      this.ball.x += this.ball.vx;
      this.ball.y += this.ball.vy;
      this.ball.vy += this.gravity;
      this.ball.rotation += this.ball.vx * 0.05;

      // Colisión Balón con Red Central
      const netTop = this.sandY - this.netHeight;
      if (this.ball.x + this.ball.radius >= this.netX - 5 &&
          this.ball.x - this.ball.radius <= this.netX + 5 &&
          this.ball.y + this.ball.radius >= netTop) {
        
        if (this.ball.x < this.netX) {
          this.ball.x = this.netX - 5 - this.ball.radius;
          this.ball.vx = -Math.abs(this.ball.vx) * 0.75;
        } else {
          this.ball.x = this.netX + 5 + this.ball.radius;
          this.ball.vx = Math.abs(this.ball.vx) * 0.75;
        }
        this.sfx.playBounce();
      }

      // Colisión Balón con Jugador
      const distP = Math.hypot(this.ball.x - this.player.x, this.ball.y - (this.player.y - 20));
      if (distP < this.ball.radius + 30) {
        // ¿Remate SPIKE? (en el aire, cerca de la red y cayendo con fuerza)
        if (this.player.isJumping && this.player.x > this.netX - 90 && this.ball.y < netTop + 20) {
          this.ball.vx = 11;
          this.ball.vy = 6.5;
          this.spikeEffect = { text: '💥 SPIKE!!', timer: 40, x: this.ball.x, y: this.ball.y - 20 };
          this.sfx.playSpike();
          this.sfx.speak('Spike!');
          this.spawnSpikeParticles(this.ball.x, this.ball.y);
        } else {
          const hitAngle = Math.atan2(this.ball.y - this.player.y, this.ball.x - this.player.x);
          this.ball.vx = Math.max(3, Math.abs(this.player.vx) + 4.5);
          this.ball.vy = -9.5;
          this.sfx.playBounce(true);
        }
      }

      // Colisión Balón con Bot
      const distB = Math.hypot(this.ball.x - this.bot.x, this.ball.y - (this.bot.y - 20));
      if (distB < this.ball.radius + 30) {
        this.ball.vx = -Math.max(3, Math.abs(this.bot.vx) + 4.5);
        this.ball.vy = -9.2;
        this.sfx.playBounce(true);
      }

      // Rebote en paredes
      if (this.ball.x - this.ball.radius <= 0) {
        this.ball.x = this.ball.radius;
        this.ball.vx = Math.abs(this.ball.vx);
        this.sfx.playBounce();
      } else if (this.ball.x + this.ball.radius >= this.width) {
        this.ball.x = this.width - this.ball.radius;
        this.ball.vx = -Math.abs(this.ball.vx);
        this.sfx.playBounce();
      }

      // Balón toca el suelo (PUNTO)
      if (this.ball.y + this.ball.radius >= this.sandY) {
        this.sfx.playBounce();
        if (this.ball.x < this.netX) {
          // Cayó en campo del jugador -> Punto rival
          this.rivalScore++;
          this.sfx.speak('Point for rival!');
          this.checkMatchEnd(false);
        } else {
          // Cayó en campo rival -> Punto jugador
          this.playerScore++;
          this.coinsEarned += 8;
          this.expEarned += 18;
          this.sfx.playCoin();
          this.sfx.speak('Great point!');
          this.checkMatchEnd(true);
        }
      }

      // Efecto Spike
      if (this.spikeEffect.timer > 0) this.spikeEffect.timer--;

      // Partículas
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        if (p.alpha <= 0) this.particles.splice(i, 1);
      }
    }

    checkMatchEnd(playerScored) {
      if (this.playerScore >= 5 || this.rivalScore >= 5) {
        setTimeout(() => this.finishGame(), 700);
      } else {
        setTimeout(() => this.resetRound(!playerScored), 800);
      }
    }

    spawnSpikeParticles(x, y) {
      for (let i = 0; i < 16; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 3 + Math.random() * 5;
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color: '#f59e0b',
          alpha: 1,
          size: 5
        });
      }
    }

    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      // Cielo de Cartón Playero
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(0, 0, this.width, this.height);

      // Sol de Cartón Corrugado
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(80, 70, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Nubes de Papel
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(280, 60, 40, 16, 0, 0, Math.PI * 2);
      ctx.ellipse(310, 52, 28, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Arena de Playa
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(0, this.sandY, this.width, this.height - this.sandY);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(0, this.sandY, this.width, 5);

      // Red de Voleibol Central
      const netTop = this.sandY - this.netHeight;
      ctx.fillStyle = '#475569';
      ctx.fillRect(this.netX - 4, netTop, 8, this.netHeight);

      // Malla de la red con líneas cruzadas
      ctx.save();
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.2;
      for (let y = netTop; y < this.sandY; y += 12) {
        ctx.beginPath();
        ctx.moveTo(this.netX - 18, y);
        ctx.lineTo(this.netX + 18, y);
        ctx.stroke();
      }
      ctx.restore();

      // Dibujar Mascota del Jugador (Izquierda)
      const playerPetOptions = {
        species: (global.PetEngine2D && global.PetEngine2D.state.species) || 'crocodile',
        hat: (global.PetEngine2D && global.PetEngine2D.state.hat) || 'none',
        mood: this.spikeEffect.timer > 0 ? 'happy' : 'normal',
        facing: 1
      };
      drawPaperMascot(ctx, this.player.x, this.player.y, 1.0, playerPetOptions);

      // Dibujar Oponente de Cartón (Derecha)
      const rivalOptions = {
        species: 'rhinoceros',
        hat: 'aviator',
        mood: 'normal',
        facing: -1
      };
      drawPaperMascot(ctx, this.bot.x, this.bot.y, 1.0, rivalOptions);

      // Dibujar Balón de Voleibol
      this.drawVolleyball();

      // Texto de Remate Spike!
      if (this.spikeEffect.timer > 0) {
        ctx.save();
        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 4;
        ctx.font = '900 24px system-ui, sans-serif';
        ctx.strokeText(this.spikeEffect.text, this.spikeEffect.x, this.spikeEffect.y);
        ctx.fillText(this.spikeEffect.text, this.spikeEffect.x, this.spikeEffect.y);
        ctx.restore();
      }

      // Partículas
      this.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      });

      // HUD Superior
      this.drawHUD();
    }

    drawVolleyball() {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(this.ball.x, this.ball.y);
      ctx.rotate(this.ball.rotation);

      // Balón blanco, azul y amarillo de voleibol playero
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Secciones de color
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, this.ball.radius, 0, Math.PI * 0.65);
      ctx.lineTo(0, 0);
      ctx.fill();

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, 0, this.ball.radius, Math.PI * 0.65, Math.PI * 1.35);
      ctx.lineTo(0, 0);
      ctx.fill();

      ctx.restore();
    }

    drawHUD() {
      const ctx = this.ctx;
      // Marcador
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(this.width * 0.5 - 130, 12, 260, 48, 12);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '900 18px system-ui, sans-serif';
      ctx.fillText(`TÚ: ${this.playerScore}`, this.width * 0.5 - 90, 42);

      ctx.fillStyle = '#f8fafc';
      ctx.fillText('-', this.width * 0.5 - 5, 42);

      ctx.fillStyle = '#f87171';
      ctx.fillText(`RIVAL: ${this.rivalScore}`, this.width * 0.5 + 20, 42);

      // Indicador Turbo
      if (this.player.turboTimer > 0) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillText('⚡ VELOCIDAD TURBO ACTIVA', 18, 30);
      }
    }

    loop() {
      if (!this.running) return;
      if (!document.getElementById('pet-sanctuary-root') || document.getElementById('pet-sanctuary-root').style.display === 'none') {
        const modal = typeof document !== 'undefined' ? document.getElementById('petArcadeModal') : null;
        if (!modal || modal.classList.contains('hidden') || modal.style.display === 'none') {
          this.destroy();
          return;
        }
      }
      this.update();
      this.draw();
      this.animId = requestAnimationFrame(() => this.loop());
    }

    finishGame() {
      this.running = false;
      const won = this.playerScore > this.rivalScore;
      if (won) this.sfx.playFanfare();
      if (this.onFinish) {
        this.onFinish({
          gameId: 'volleyball',
          title: 'Pou Beach Volleyball 2D',
          score: this.playerScore,
          coins: this.coinsEarned + (won ? 25 : 10),
          exp: this.expEarned + (won ? 50 : 20),
          words: VOLLEYBALL_VOCABULARY
        });
      }
    }
  }

  // ============================================================================
  // 6. JUEGO 3: 🍎 WORD FOOD CATCH (ATRAPA LA COMIDA CORRECTA)
  // ============================================================================

  class WordFoodCatchGame {
    constructor(canvas, sfx, onFinish) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.sfx = sfx;
      this.onFinish = onFinish;

      this.running = false;
      this.width = canvas.width;
      this.height = canvas.height;

      this.score = 0;
      this.lives = 3;
      this.timeLeft = 50;
      this.coinsEarned = 0;
      this.expEarned = 0;

      // Antojo / Misión actual en inglés
      this.missions = [
        { cat: 'fruit', label: 'FRUITS', es: 'Frutas Saludables', tip: 'Catch only Apples, Bananas, Strawberries!' },
        { cat: 'vegetable', label: 'VEGETABLES', es: 'Verduras Verdes', tip: 'Catch only Broccoli, Carrots, Lettuce!' },
        { cat: 'protein', label: 'PROTEIN & SEAFOOD', es: 'Pescado y Proteínas', tip: 'Catch Fresh Fish and Boiled Eggs!' }
      ];
      this.currentMissionIdx = 0;
      this.missionTimer = 0;

      // Jugador
      this.player = {
        x: this.width * 0.5,
        y: this.height - 65,
        width: 60,
        mouthOpen: false,
        chewTimer: 0,
        speed: 7
      };

      // Alimentos cayendo
      this.fallingItems = [];
      this.spawnTimer = 0;

      // Partículas y texto flotante
      this.floatingTexts = [];
      this.particles = [];

      this.keys = { left: false, right: false };
      this.bindInputs();
    }

    bindInputs() {
      this._onKeyDown = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
      };
      this._onKeyUp = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
      };

      const handleMove = (clientX) => {
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = (clientX - rect.left) * (this.canvas.width / rect.width);
        this.player.x = Math.max(35, Math.min(this.width - 35, canvasX));
      };

      this._onMouseMove = (e) => handleMove(e.clientX);
      this._onTouchMove = (e) => {
        if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX);
      };

      window.addEventListener('keydown', this._onKeyDown);
      window.addEventListener('keyup', this._onKeyUp);
      this.canvas.addEventListener('mousemove', this._onMouseMove);
      this.canvas.addEventListener('touchmove', this._onTouchMove, { passive: true });
    }

    destroy() {
      this.running = false;
      if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
      window.removeEventListener('keydown', this._onKeyDown);
      window.removeEventListener('keyup', this._onKeyUp);
      this.canvas.removeEventListener('mousemove', this._onMouseMove);
      this.canvas.removeEventListener('touchmove', this._onTouchMove);
    }

    start() {
      this.running = true;
      this.score = 0;
      this.lives = 3;
      this.timeLeft = 50;
      this.coinsEarned = 0;
      this.expEarned = 0;
      this.fallingItems = [];
      this.currentMissionIdx = 0;
      this.missionTimer = 0;

      this.announceMission();
      this.startCountdown();
      this.loop();
    }

    announceMission() {
      const mission = this.missions[this.currentMissionIdx];
      this.sfx.speak(`Catch only: ${mission.label}!`);
    }

    startCountdown() {
      this._timerInterval = setInterval(() => {
        if (!this.running) {
          clearInterval(this._timerInterval);
          return;
        }
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          clearInterval(this._timerInterval);
          this.finishGame();
        }
      }, 1000);
    }

    update() {
      // Movimiento con teclado
      if (this.keys.left) this.player.x -= this.player.speed;
      if (this.keys.right) this.player.x += this.player.speed;
      this.player.x = Math.max(35, Math.min(this.width - 35, this.player.x));

      // Rotación periódica de misiones
      this.missionTimer++;
      if (this.missionTimer > 60 * 16) { // cada 16 segundos
        this.missionTimer = 0;
        this.currentMissionIdx = (this.currentMissionIdx + 1) % this.missions.length;
        this.announceMission();
      }

      // Generación de alimentos cayendo
      this.spawnTimer++;
      if (this.spawnTimer > 35) {
        this.spawnTimer = 0;
        const randItem = FOOD_CATCH_ITEMS[Math.floor(Math.random() * FOOD_CATCH_ITEMS.length)];
        this.fallingItems.push({
          ...randItem,
          x: 40 + Math.random() * (this.width - 80),
          y: -20,
          vy: 2.2 + Math.random() * 2.5,
          rotation: Math.random() * Math.PI
        });
      }

      // Animación de masticado
      if (this.player.chewTimer > 0) this.player.chewTimer--;
      this.player.mouthOpen = this.player.chewTimer > 0;

      const currentTargetCat = this.missions[this.currentMissionIdx].cat;

      // Actualizar alimentos cayendo
      for (let i = this.fallingItems.length - 1; i >= 0; i--) {
        const item = this.fallingItems[i];
        item.y += item.vy;

        // Comprobación de colisión con la mascota
        const dist = Math.hypot(item.x - this.player.x, item.y - (this.player.y - 20));
        if (dist < 34) {
          this.player.chewTimer = 18;

          if (item.isBad) {
            // Atrapó basura / bomba
            this.sfx.playSplat();
            this.lives--;
            this.floatingTexts.push({ text: `❌ ${item.label}! -1 Vida`, x: item.x, y: item.y, color: '#ef4444', alpha: 1 });
            this.sfx.speak(`Ouch! ${item.label}!`);
            if (this.lives <= 0) {
              this.finishGame();
              return;
            }
          } else if (item.cat === currentTargetCat) {
            // Atrapó el alimento correcto de la misión
            this.sfx.playChomp();
            this.score += item.pts;
            this.coinsEarned += 3;
            this.expEarned += 8;
            this.floatingTexts.push({ text: `✅ +${item.pts} ${item.label}!`, x: item.x, y: item.y, color: '#10b981', alpha: 1 });
            this.sfx.speak(item.label);
          } else {
            // Alimento comestible pero no de la categoría solicitada
            this.sfx.playChomp();
            this.score += 2;
            this.floatingTexts.push({ text: `+2 ${item.label}`, x: item.x, y: item.y, color: '#f59e0b', alpha: 1 });
          }

          this.fallingItems.splice(i, 1);
          continue;
        }

        // Si cae al suelo
        if (item.y > this.height) {
          this.fallingItems.splice(i, 1);
        }
      }

      // Textos flotantes
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y -= 1.2;
        ft.alpha -= 0.025;
        if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
      }
    }

    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      // Fondo Prado de Cartón
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(0, 0, this.width, this.height);

      // Colinas de cartón verde en el fondo
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.arc(120, this.height, 220, Math.PI, Math.PI * 2);
      ctx.arc(this.width - 120, this.height, 240, Math.PI, Math.PI * 2);
      ctx.fill();

      // Suelo con hierba recortada
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, this.height - 35, this.width, 35);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, this.height - 35, this.width, 4);

      // Dibujar Alimentos cayendo
      this.fallingItems.forEach(item => {
        ctx.save();
        ctx.font = '28px system-ui, sans-serif';
        ctx.fillText(item.icon, item.x - 14, item.y + 10);
        ctx.restore();
      });

      // Dibujar Mascota
      const petOptions = {
        species: (global.PetEngine2D && global.PetEngine2D.state.species) || 'crocodile',
        hat: (global.PetEngine2D && global.PetEngine2D.state.hat) || 'none',
        mouthOpen: this.player.mouthOpen,
        mood: this.lives < 2 ? 'stunned' : 'happy'
      };
      drawPaperMascot(ctx, this.player.x, this.player.y, 1.1, petOptions);

      // Dibujar Textos Flotantes
      this.floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.fillText(ft.text, ft.x - 20, ft.y);
        ctx.restore();
      });

      // HUD Superior
      this.drawHUD();
    }

    drawHUD() {
      const ctx = this.ctx;
      const mission = this.missions[this.currentMissionIdx];

      // Banner Misión
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.roundRect(14, 10, this.width - 28, 54, 12);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(`🎯 ANTOJO EN INGLÉS: "CATCH ONLY ${mission.label}" (${mission.es})`, 26, 30);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText(`Puntos: ${this.score}`, 26, 52);
      ctx.fillText(`🪙 +${this.coinsEarned}`, 140, 52);
      ctx.fillText(`⏱️ ${this.timeLeft}s`, this.width - 150, 52);

      // Vidas
      let hearts = '';
      for (let i = 0; i < this.lives; i++) hearts += '❤️';
      ctx.fillText(hearts, this.width - 85, 52);
    }

    loop() {
      if (!this.running) return;
      if (!document.getElementById('pet-sanctuary-root') || document.getElementById('pet-sanctuary-root').style.display === 'none') {
        const modal = typeof document !== 'undefined' ? document.getElementById('petArcadeModal') : null;
        if (!modal || modal.classList.contains('hidden') || modal.style.display === 'none') {
          this.destroy();
          return;
        }
      }
      this.update();
      this.draw();
      this.animId = requestAnimationFrame(() => this.loop());
    }

    finishGame() {
      this.running = false;
      if (this._timerInterval) clearInterval(this._timerInterval);
      this.sfx.playFanfare();

      if (this.onFinish) {
        this.onFinish({
          gameId: 'food_catch',
          title: 'Word Food Catch',
          score: this.score,
          coins: this.coinsEarned + 15,
          exp: this.expEarned + 30,
          words: FOOD_CATCH_ITEMS.filter(item => !item.isBad).slice(0, 5).map(f => ({
            es: f.es,
            en: f.label,
            tip: `Alimento saludable (${f.cat})`
          }))
        });
      }
    }
  }

  // ============================================================================
  // 7. CONSOLA ARCADE 2D MODAL (SELECTOR & CONTENEDOR MULTI-JUEGOS)
  // ============================================================================

  class PetArcadeManager {
    constructor() {
      this.sfx = new ArcadeAudioEngine();
      this.activeGame = null;
      this.currentGameId = null;
      this.modal = null;
      this.canvas = null;
    }

    initDOM() {
      if (this.modal) return;

      const modalEl = document.createElement('div');
      modalEl.id = 'petArcadeModal';
      modalEl.className = 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col hidden select-none overflow-hidden';
      modalEl.innerHTML = `
        <!-- CABECERA DE LA MÁQUINA ARCADE DE CARTÓN -->
        <div class="h-16 bg-[#b45309] border-b-4 border-[#78350f] flex items-center justify-between px-4 shadow-xl z-20">
          <div class="flex items-center gap-3">
            <span class="text-3xl animate-bounce">🕹️</span>
            <div>
              <h2 class="text-lg font-black text-[#fef3c7] tracking-wider uppercase drop-shadow">POU SPORTS & ENGLISH ARCADE</h2>
              <p class="text-[11px] font-bold text-[#fde68a]">Físicas 2D a 60 FPS • Gana PetCoins & EXP</p>
            </div>
          </div>
          <button id="btnExitArcade"
                  class="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-black px-4 py-2 rounded-xl border-2 border-[#991b1b] shadow-lg active:scale-95 transition flex items-center gap-1.5">
            <span>✖</span> <span>Salir al Hábitat</span>
          </button>
        </div>

        <!-- CONTENEDOR CENTRAL: SELECTOR DE JUEGOS O PANTALLA DE JUEGO -->
        <div class="flex-1 relative flex items-center justify-center p-3 overflow-hidden" id="arcadeContentArea">
          
          <!-- VISTA 1: MENÚ SELECTOR DE LOS 4 MINIJUEGOS -->
          <div id="arcadeHubMenu" class="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            <!-- TARJETA JUEGO 1: POU BASKETBALL HOOPS -->
            <div class="bg-[#caa778] border-4 border-[#78350f] rounded-3xl p-4 shadow-2xl flex flex-col justify-between hover:scale-[1.02] transition cursor-pointer relative overflow-hidden"
                 onclick="window.startArcadeGame('basketball')">
              <div class="absolute -right-4 -top-4 w-20 h-20 bg-[#ea580c]/20 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <div class="w-14 h-14 bg-[#ea580c] rounded-2xl border-2 border-[#7c2d12] flex items-center justify-center text-3xl shadow-md mb-2">
                  🏀
                </div>
                <h3 class="text-sm font-black text-[#451a03]">Pou Basketball Hoops</h3>
                <p class="text-[11px] text-[#78350f] font-semibold mt-1">
                  Lanza a la canasta con físicas parabólicas 2D. Encesta en tiros <b>Golden Shot</b> bilingües para duplicar monedas.
                </p>
                <div class="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span class="bg-[#ea580c] text-white text-[9px] font-black px-2 py-0.5 rounded-full">Deportes & Físicas</span>
                  <span class="bg-[#15803d] text-white text-[9px] font-black px-2 py-0.5 rounded-full">Tiro Parabólico</span>
                </div>
              </div>
              <button class="mt-3 w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-black py-2 rounded-xl border-2 border-[#7c2d12] text-xs shadow active:scale-95 transition">
                ¡JUGAR BÁSQUETBOL!
              </button>
            </div>

            <!-- TARJETA JUEGO 2: POU BEACH VOLLEYBALL 2D -->
            <div class="bg-[#caa778] border-4 border-[#78350f] rounded-3xl p-4 shadow-2xl flex flex-col justify-between hover:scale-[1.02] transition cursor-pointer relative overflow-hidden"
                 onclick="window.startArcadeGame('volleyball')">
              <div class="absolute -right-4 -top-4 w-20 h-20 bg-[#38bdf8]/20 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <div class="w-14 h-14 bg-[#38bdf8] rounded-2xl border-2 border-[#0284c7] flex items-center justify-center text-3xl shadow-md mb-2">
                  🏐
                </div>
                <h3 class="text-sm font-black text-[#451a03]">Pou Beach Volleyball 2D</h3>
                <p class="text-[11px] text-[#78350f] font-semibold mt-1">
                  Enfréntate al bot de cartón en la playa. Cabecea, salta y realiza <b>Remates Spike!</b> fulminantes sobre la red.
                </p>
                <div class="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span class="bg-[#0284c7] text-white text-[9px] font-black px-2 py-0.5 rounded-full">1 vs 1 Bot</span>
                  <span class="bg-[#eab308] text-slate-900 text-[9px] font-black px-2 py-0.5 rounded-full">Remate Spike</span>
                </div>
              </div>
              <button class="mt-3 w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-black py-2 rounded-xl border-2 border-[#075985] text-xs shadow active:scale-95 transition">
                ¡JUGAR VOLEIBOL!
              </button>
            </div>

            <!-- TARJETA JUEGO 3: WORD FOOD CATCH -->
            <div class="bg-[#caa778] border-4 border-[#78350f] rounded-3xl p-4 shadow-2xl flex flex-col justify-between hover:scale-[1.02] transition cursor-pointer relative overflow-hidden"
                 onclick="window.startArcadeGame('food_catch')">
              <div class="absolute -right-4 -top-4 w-20 h-20 bg-[#16a34a]/20 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <div class="w-14 h-14 bg-[#16a34a] rounded-2xl border-2 border-[#14532d] flex items-center justify-center text-3xl shadow-md mb-2">
                  🍎
                </div>
                <h3 class="text-sm font-black text-[#451a03]">Word Food Catch</h3>
                <p class="text-[11px] text-[#78350f] font-semibold mt-1">
                  Atrapa la comida que cae según la orden en inglés emitida por el narrador nativo. ¡Evita los ítems no comestibles!
                </p>
                <div class="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span class="bg-[#16a34a] text-white text-[9px] font-black px-2 py-0.5 rounded-full">Listening Activo</span>
                  <span class="bg-[#d97706] text-white text-[9px] font-black px-2 py-0.5 rounded-full">Alimentos</span>
                </div>
              </div>
              <button class="mt-3 w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black py-2 rounded-xl border-2 border-[#14532d] text-xs shadow active:scale-95 transition">
                ¡ATRAPAR COMIDA!
              </button>
            </div>

            <!-- TARJETA JUEGO 4: HEDBANZ 3D PARTY -->
            <div class="bg-[#caa778] border-4 border-[#78350f] rounded-3xl p-4 shadow-2xl flex flex-col justify-between hover:scale-[1.02] transition cursor-pointer relative overflow-hidden"
                 onclick="window.openHedbanz3DGame()">
              <div class="absolute -right-4 -top-4 w-20 h-20 bg-[#a855f7]/20 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <div class="w-14 h-14 bg-[#a855f7] rounded-2xl border-2 border-[#6b21a8] flex items-center justify-center text-3xl shadow-md mb-2">
                  🎴
                </div>
                <h3 class="text-sm font-black text-[#451a03]">Hedbanz 3D • Guess What I Am</h3>
                <p class="text-[11px] text-[#78350f] font-semibold mt-1">
                  Visor 3D con vincha y carta en la frente. Haz preguntas en inglés al árbitro IA y adivina tu palabra antes de que acabe el reloj de arena.
                </p>
                <div class="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span class="bg-[#9333ea] text-white text-[9px] font-black px-2 py-0.5 rounded-full">Blender 3D</span>
                  <span class="bg-[#eab308] text-slate-900 text-[9px] font-black px-2 py-0.5 rounded-full">Árbitro IA</span>
                </div>
              </div>
              <button class="mt-3 w-full bg-[#9333ea] hover:bg-[#7e22ce] text-white font-black py-2 rounded-xl border-2 border-[#581c87] text-xs shadow active:scale-95 transition">
                ¡JUGAR HEDBANZ 3D!
              </button>
            </div>
                <p class="text-xs text-[#78350f] font-semibold mt-1">
                  Atrapa únicamente los alimentos que tu mascota desea según la instrucción en inglés. ¡Esquiva botas y bombas!
                </p>
                <div class="mt-3 flex items-center gap-2">
                  <span class="bg-[#16a34a] text-white text-[10px] font-black px-2 py-0.5 rounded-full">Vocabulario Food</span>
                  <span class="bg-[#9333ea] text-white text-[10px] font-black px-2 py-0.5 rounded-full">Reflejos 60 FPS</span>
                </div>
              </div>
              <button class="mt-4 w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black py-2.5 rounded-xl border-2 border-[#14532d] shadow active:scale-95 transition">
                ¡ATRAPAR COMIDA!
              </button>
            </div>

          </div>

          <!-- VISTA 2: CONTENEDOR DEL CANVAS DE JUEGO ACTIVO -->
          <div id="arcadeGameStage" class="w-full h-full max-w-4xl max-h-[580px] bg-slate-900 rounded-3xl border-4 border-[#78350f] shadow-2xl flex flex-col relative hidden overflow-hidden">
            <canvas id="arcadeActiveCanvas" class="w-full h-full block touch-none"></canvas>
            
            <!-- Barra flotante de controles táctiles para móviles en voleibol -->
            <div id="volleyballMobileControls" class="absolute bottom-3 left-4 right-4 flex justify-between pointer-events-none hidden">
              <div class="flex gap-2 pointer-events-auto">
                <button id="btnVolleyLeft" class="w-14 h-14 bg-white/80 rounded-2xl text-2xl font-black border-2 border-slate-700 shadow active:scale-90">⬅</button>
                <button id="btnVolleyRight" class="w-14 h-14 bg-white/80 rounded-2xl text-2xl font-black border-2 border-slate-700 shadow active:scale-90">➡</button>
              </div>
              <button id="btnVolleyJump" class="w-16 h-14 bg-amber-400/90 rounded-2xl text-lg font-black border-2 border-amber-700 shadow active:scale-90 pointer-events-auto">⬆ SALTO</button>
            </div>

            <!-- Botón Volver al Menú de Minijuegos -->
            <button id="btnBackToArcadeHub"
                    class="absolute top-3 left-3 bg-[#78350f]/80 hover:bg-[#78350f] text-[#fef3c7] text-xs font-black px-3 py-1.5 rounded-xl border border-[#f59e0b] shadow transition">
              🔙 Menú Arcade
            </button>
          </div>

        </div>

        <!-- MODAL DE RESULTADOS & RECOMPENSAS -->
        <div id="arcadeResultsModal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 hidden">
          <div class="bg-[#caa778] border-4 border-[#78350f] rounded-3xl p-6 max-w-md w-full shadow-2xl text-center relative">
            <span class="text-5xl block animate-bounce">🏆</span>
            <h3 class="text-xl font-black text-[#451a03] mt-2" id="resTitle">¡Partida Completada!</h3>
            
            <div class="my-4 bg-[#fef3c7] border-2 border-[#b45309] rounded-2xl p-4">
              <div class="flex justify-around items-center text-sm font-black text-[#78350f]">
                <div>
                  <span class="block text-2xl" id="resCoins">+35</span>
                  <span>🪙 PetCoins</span>
                </div>
                <div class="border-l-2 border-[#b45309] h-8"></div>
                <div>
                  <span class="block text-2xl" id="resExp">+60</span>
                  <span>⭐ EXP</span>
                </div>
                <div class="border-l-2 border-[#b45309] h-8"></div>
                <div>
                  <span class="block text-2xl text-[#16a34a]">100%</span>
                  <span>❤️ Felicidad</span>
                </div>
              </div>
            </div>

            <!-- Vocabulario Aprendido -->
            <div class="text-left bg-[#faebd7] border-2 border-[#b45309] rounded-xl p-3 mb-4 max-h-36 overflow-y-auto" id="resVocabBox">
              <h4 class="text-xs font-black text-[#78350f] uppercase mb-1.5">Vocabulario Practicado:</h4>
              <div id="resVocabList" class="space-y-1 text-xs"></div>
            </div>

            <div class="flex gap-2">
              <button id="btnPlayAgain" class="flex-1 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black py-2.5 rounded-xl border-2 border-[#7c2d12] shadow active:scale-95 transition text-sm">
                🔄 Jugar Otra Vez
              </button>
              <button id="btnReturnHub" class="flex-1 bg-[#15803d] hover:bg-[#166534] text-white font-black py-2.5 rounded-xl border-2 border-[#14532d] shadow active:scale-95 transition text-sm">
                🕹️ Otro Minijuego
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modalEl);
      this.modal = modalEl;
      this.canvas = document.getElementById('arcadeActiveCanvas');

      // Botón Salir
      document.getElementById('btnExitArcade').onclick = () => this.close();
      document.getElementById('btnBackToArcadeHub').onclick = () => this.showHub();

      // Botones de Resultados
      document.getElementById('btnPlayAgain').onclick = () => {
        document.getElementById('arcadeResultsModal').classList.add('hidden');
        if (this.currentGameId) this.launchGame(this.currentGameId);
      };
      document.getElementById('btnReturnHub').onclick = () => {
        document.getElementById('arcadeResultsModal').classList.add('hidden');
        this.showHub();
      };
    }

    open(petState = null) {
      this.initDOM();
      this.modal.classList.remove('hidden');
      this.showHub();
      this.sfx.playWhoosh();
    }

    close() {
      this.stopGame();
      // Actualizar PetEngine2D si existe
      if (global.PetEngine2D) {
        global.PetEngine2D.updateHUD();
      }
    }

    stopGame() {
      if (this.activeGame) {
        this.activeGame.destroy();
        this.activeGame = null;
      }
      if (this.modal) {
        this.modal.classList.add('hidden');
      }
    }

    pauseLoop() {
      this.stopGame();
    }

    showHub() {
      if (this.activeGame) {
        this.activeGame.destroy();
        this.activeGame = null;
      }
      document.getElementById('arcadeHubMenu').classList.remove('hidden');
      document.getElementById('arcadeGameStage').classList.add('hidden');
      document.getElementById('volleyballMobileControls').classList.add('hidden');
    }

    launchGame(gameId) {
      this.initDOM();
      this.currentGameId = gameId;

      document.getElementById('arcadeHubMenu').classList.add('hidden');
      const stage = document.getElementById('arcadeGameStage');
      stage.classList.remove('hidden');

      // Redimensionar canvas a resolución óptima
      const rect = stage.getBoundingClientRect();
      this.canvas.width = rect.width || 800;
      this.canvas.height = rect.height || 520;

      const onFinishCallback = (results) => this.handleGameFinish(results);

      if (this.activeGame) {
        this.activeGame.destroy();
      }

      if (gameId === 'basketball') {
        document.getElementById('volleyballMobileControls').classList.add('hidden');
        this.activeGame = new BasketballGame(this.canvas, this.sfx, onFinishCallback);
      } else if (gameId === 'volleyball') {
        document.getElementById('volleyballMobileControls').classList.remove('hidden');
        this.activeGame = new VolleyballGame(this.canvas, this.sfx, onFinishCallback);
        this.bindVolleyballMobileControls(this.activeGame);
      } else if (gameId === 'food_catch') {
        document.getElementById('volleyballMobileControls').classList.add('hidden');
        this.activeGame = new WordFoodCatchGame(this.canvas, this.sfx, onFinishCallback);
      }

      if (this.activeGame) {
        this.activeGame.start();
      }
    }

    bindVolleyballMobileControls(game) {
      const btnL = document.getElementById('btnVolleyLeft');
      const btnR = document.getElementById('btnVolleyRight');
      const btnJ = document.getElementById('btnVolleyJump');

      if (btnL && btnR && btnJ) {
        btnL.onpointerdown = () => { game.keys.left = true; };
        btnL.onpointerup = () => { game.keys.left = false; };
        btnR.onpointerdown = () => { game.keys.right = true; };
        btnR.onpointerup = () => { game.keys.right = false; };
        btnJ.onpointerdown = () => { game.triggerPlayerJump(); };
      }
    }

    handleGameFinish(results) {
      // 1. Recompensas a la mascota
      if (global.PetEngine2D) {
        global.PetEngine2D.state.happiness = 100; // ¡Felicidad al 100%!
        global.PetEngine2D.state.energy = Math.max(10, global.PetEngine2D.state.energy - 8);
        global.PetEngine2D.addCoins(results.coins);
        global.PetEngine2D.addExp(results.exp);
        global.PetEngine2D.saveState();
        global.PetEngine2D.updateHUD();
      } else {
        try {
          const raw = localStorage.getItem('mastereng_pet_state');
          if (raw) {
            const st = JSON.parse(raw);
            st.happiness = 100;
            st.coins = (st.coins || 0) + results.coins;
            st.xp = (st.xp || 0) + results.exp;
            localStorage.setItem('mastereng_pet_state', JSON.stringify(st));
          }
        } catch (e) {}
      }

      // 2. Mostrar Modal de Resultados
      document.getElementById('resTitle').innerText = results.title;
      document.getElementById('resCoins').innerText = `+${results.coins}`;
      document.getElementById('resExp').innerText = `+${results.exp}`;

      const vocabListEl = document.getElementById('resVocabList');
      vocabListEl.innerHTML = '';
      if (results.words && results.words.length) {
        results.words.forEach(w => {
          const row = document.createElement('div');
          row.className = 'flex items-center justify-between text-slate-800 bg-white/70 px-2 py-1 rounded';
          row.innerHTML = `
            <span><b>${w.en}</b> (${w.es})</span>
            <button class="text-sm hover:scale-110 active:scale-95 transition" title="Escuchar">🔊</button>
          `;
          row.querySelector('button').onclick = () => this.sfx.speak(w.en);
          vocabListEl.appendChild(row);
        });
      }

      document.getElementById('arcadeResultsModal').classList.remove('hidden');
    }
  }

  // ============================================================================
  // 7B. MOTOR 3D HEDBANZ CON ASSETS DE BLENDER Y ÁRBITRO IA EN INGLÉS
  // ============================================================================

  const HEDBANZ_VOCAB_DB = [
    { word: 'Elephant', es: 'Elefante', isLiving: true, isSupermarket: false, isEatable: false, isAppliance: false, isWearable: false, isAnimal: true, canFly: false, isHouse: false, hint: 'A large gray mammal with a long trunk.' },
    { word: 'Apple', es: 'Manzana', isLiving: true, isSupermarket: true, isEatable: true, isAppliance: false, isWearable: false, isAnimal: false, canFly: false, isHouse: true, hint: 'A sweet red or green fruit that keeps the doctor away.' },
    { word: 'Microwave', es: 'Microondas', isLiving: false, isSupermarket: false, isEatable: false, isAppliance: true, isWearable: false, isAnimal: false, canFly: false, isHouse: true, hint: 'A kitchen appliance that heats food quickly with radiation.' },
    { word: 'T-Shirt', es: 'Camiseta', isLiving: false, isSupermarket: true, isEatable: false, isAppliance: false, isWearable: true, isAnimal: false, canFly: false, isHouse: true, hint: 'Cotton clothing item you wear on your torso.' },
    { word: 'Eagle', es: 'Águila', isLiving: true, isSupermarket: false, isEatable: false, isAppliance: false, isWearable: false, isAnimal: true, canFly: true, isHouse: false, hint: 'A majestic bird of prey with keen eyesight.' },
    { word: 'Milk', es: 'Leche', isLiving: false, isSupermarket: true, isEatable: true, isAppliance: false, isWearable: false, isAnimal: false, canFly: false, isHouse: true, hint: 'A white liquid rich in calcium, often from dairy cows.' },
    { word: 'Blender', es: 'Licuadora', isLiving: false, isSupermarket: false, isEatable: false, isAppliance: true, isWearable: false, isAnimal: false, canFly: false, isHouse: true, hint: 'An appliance with sharp spinning blades to make smoothies.' },
    { word: 'Dog', es: 'Perro', isLiving: true, isSupermarket: false, isEatable: false, isAppliance: false, isWearable: false, isAnimal: true, canFly: false, isHouse: true, hint: 'Loyal four-legged domestic animal known as man\'s best friend.' },
    { word: 'Sunglasses', es: 'Gafas de sol', isLiving: false, isSupermarket: true, isEatable: false, isAppliance: false, isWearable: true, isAnimal: false, canFly: false, isHouse: true, hint: 'Eyewear designed to protect your eyes from bright sunlight.' },
    { word: 'Refrigerator', es: 'Refrigerador', isLiving: false, isSupermarket: false, isEatable: false, isAppliance: true, isWearable: false, isAnimal: false, canFly: false, isHouse: true, hint: 'Large cold appliance that preserves perishables and drinks.' },
    { word: 'Pizza', es: 'Pizza', isLiving: false, isSupermarket: true, isEatable: true, isAppliance: false, isWearable: false, isAnimal: false, canFly: false, isHouse: true, hint: 'Baked flat bread topped with tomato sauce and melted cheese.' },
    { word: 'Laptop', es: 'Computadora portátil', isLiving: false, isSupermarket: false, isEatable: false, isAppliance: true, isWearable: false, isAnimal: false, canFly: false, isHouse: true, hint: 'Portable personal computer with a foldable screen and keyboard.' }
  ];

  class Hedbanz3DEngine {
    constructor() {
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.rafId = null;
      this.isRunning = false;
      this.currentCard = null;
      this.timeLeft = 90;
      this.timerInterval = null;
      this.strikes = 0;
      this.isSolved = false;
      this.askedQuestions = [];
      this.hourglassMesh = null;
      this.cardMesh = null;
      this.headbandMesh = null;
      this.avatarGroup = null;
      this.sfx = new ArcadeAudioEngine();
    }

    open(options) {
      if (typeof window !== 'undefined' && typeof window.hideAllModules === 'function') {
        window.hideAllModules();
      }

      if (typeof window !== 'undefined' && window.AssetDownloadManager && typeof window.AssetDownloadManager.requireAssetPack === 'function') {
        window.AssetDownloadManager.requireAssetPack({
          packId: 'hedbanz',
          glbUrl: 'assets/models/hedbanz/hedbanz_pack.glb',
          title: 'Hedbanz 3D: Party Game',
          category: 'minigames',
          estimatedMB: 0.25,
          onReady: (blobUrl) => {
            this.initStageAndStart(blobUrl || 'assets/models/hedbanz/hedbanz_pack.glb');
          },
          onCancel: () => {
            console.log('[Hedbanz3D] Descarga cancelada. Regresando a Portales.');
            if (typeof window.returnToMainPortals === 'function') {
              window.returnToMainPortals();
            } else if (typeof window.navigateTo === 'function') {
              window.navigateTo('view-home');
            }
          }
        });
      } else {
        this.initStageAndStart('assets/models/hedbanz/hedbanz_pack.glb');
      }
    }

    initStageAndStart(glbUrl) {
      this.ensureDOM();
      const container = document.getElementById('view-jest-game') || document.getElementById('hedbanz-main-container');
      if (container) {
        container.classList.remove('hidden');
        container.style.setProperty('display', 'flex', 'important');
        container.style.setProperty('visibility', 'visible', 'important');
        container.style.setProperty('opacity', '1', 'important');
      }

      this.pickNewMysteryCard();
      this.initThreeViewer(glbUrl);
      this.startCountdownTimer();
    }

    ensureDOM() {
      let host = document.getElementById('view-jest-game');
      if (!host) {
        host = document.createElement('div');
        host.id = 'view-jest-game';
        host.className = 'flex-1 w-full hidden';
        document.body.appendChild(host);
      }

      host.innerHTML = `
        <div id="hedbanz-main-container" class="relative w-full h-[calc(100dvh-56px)] min-h-[520px] bg-gradient-to-b from-[#1e112a] via-[#0d0714] to-[#05020a] flex flex-col select-none overflow-hidden font-sans">
          
          <!-- TOPBAR CON BOTÓN VOLVER UNIVERSAL -->
          <header class="h-14 bg-slate-900/90 border-b border-purple-500/30 flex items-center justify-between px-4 z-20 backdrop-blur-md">
            <div class="flex items-center gap-3">
              <button type="button" onclick="window.Hedbanz3D.handleBack(event)"
                      class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-sky-500/50 text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer active:scale-95">
                <span>← Volver a Portales</span>
              </button>
              <div>
                <h1 class="text-sm font-black text-purple-200 tracking-wide flex items-center gap-1.5">
                  <span>🎴 Hedbanz 3D • Guess What I Am</span>
                </h1>
                <p class="text-[10px] text-purple-300/70 font-semibold hidden sm:block">Adivina tu carta en inglés haciendo preguntas estratégicas al árbitro IA</p>
              </div>
            </div>

            <div class="flex items-center gap-2.5">
              <div class="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40 text-amber-300 font-mono text-xs font-black flex items-center gap-1.5 shadow">
                <span>⏳</span>
                <span id="hedbanzClockDisplay">90s</span>
              </div>
              <div class="px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-rose-300 text-xs font-black flex items-center gap-1" id="hedbanzStrikesBadge">
                <span>❌</span>
                <span id="hedbanzStrikesCount">0/3</span>
              </div>
            </div>
          </header>

          <!-- ÁREA CENTRAL: VISOR THREE.JS + PANEL DE CONTROL DEL JUGADOR -->
          <div class="flex-1 relative flex flex-col md:flex-row overflow-hidden w-full h-[calc(100vh-70px)] min-h-[520px]">
            
            <!-- STAGE THREE.JS 3D -->
            <div id="hedbanzCanvasMount"
                 style="width: 100% !important; height: calc(100vh - 70px) !important; min-height: 520px !important; position: relative !important; display: flex !important; align-items: center !important; justify-content: center !important; overflow: hidden !important;">
              <div id="hedbanzLoadingOverlay" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-10 transition-opacity">
                <div class="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <span class="text-xs font-extrabold text-purple-300">Cargando paquetes 3D de Blender...</span>
              </div>

              <!-- HUD DEL ÁRBITRO IA FLOTANTE EN EL ESCENARIO 3D -->
              <div id="hedbanzRefereeHUD" class="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-slate-900/90 border border-purple-400/40 shadow-2xl backdrop-blur-md flex items-center gap-2.5 pointer-events-none transition-all duration-300 opacity-90">
                <span class="text-xl">🤖</span>
                <div>
                  <div class="text-[10px] font-extrabold text-purple-300 uppercase tracking-wider">AI Referee</div>
                  <div id="hedbanzRefereeVerdict" class="text-sm font-black text-amber-300">Ask me a question!</div>
                </div>
              </div>
            </div>

            <!-- PANEL DERECHO: PREGUNTAS ESTRATÉGICAS Y ACCIONES -->
            <div class="w-full md:w-96 bg-slate-900/95 border-t md:border-t-0 md:border-l border-purple-500/30 flex flex-col p-3.5 gap-2.5 z-10 backdrop-blur-md overflow-y-auto max-h-[50vh] md:max-h-full">
              
              <!-- CATEGORÍAS ESTRATÉGICAS EN INGLÉS -->
              <div>
                <span class="text-[10px] font-extrabold text-purple-300 uppercase tracking-wider block mb-1.5">
                  Preguntas Estratégicas por Categoría:
                </span>
                <div class="grid grid-cols-2 gap-1.5" id="hedbanzQuestionsGrid">
                  <button type="button" onclick="window.Hedbanz3D.askQuestion('isLiving')"
                          class="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-100 text-[11px] font-extrabold text-left transition shadow cursor-pointer active:scale-95">
                    🌱 Is it a living thing?
                  </button>
                  <button type="button" onclick="window.Hedbanz3D.askQuestion('isSupermarket')"
                          class="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-100 text-[11px] font-extrabold text-left transition shadow cursor-pointer active:scale-95">
                    🛒 Is it in a supermarket?
                  </button>
                  <button type="button" onclick="window.Hedbanz3D.askQuestion('isEatable')"
                          class="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-100 text-[11px] font-extrabold text-left transition shadow cursor-pointer active:scale-95">
                    🍎 Can you eat it?
                  </button>
                  <button type="button" onclick="window.Hedbanz3D.askQuestion('isAppliance')"
                          class="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-100 text-[11px] font-extrabold text-left transition shadow cursor-pointer active:scale-95">
                    🔌 Is it an appliance?
                  </button>
                  <button type="button" onclick="window.Hedbanz3D.askQuestion('isWearable')"
                          class="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-100 text-[11px] font-extrabold text-left transition shadow cursor-pointer active:scale-95">
                    👕 Can you wear it?
                  </button>
                  <button type="button" onclick="window.Hedbanz3D.askQuestion('isAnimal')"
                          class="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-100 text-[11px] font-extrabold text-left transition shadow cursor-pointer active:scale-95">
                    🐾 Is it an animal?
                  </button>
                  <button type="button" onclick="window.Hedbanz3D.askQuestion('canFly')"
                          class="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-100 text-[11px] font-extrabold text-left transition shadow cursor-pointer active:scale-95">
                    🦅 Can it fly?
                  </button>
                  <button type="button" onclick="window.Hedbanz3D.askQuestion('isHouse')"
                          class="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-100 text-[11px] font-extrabold text-left transition shadow cursor-pointer active:scale-95">
                    🏠 Is it found in a house?
                  </button>
                </div>
              </div>

              <!-- PREGUNTA PERSONALIZADA EN INGLÉS -->
              <div class="mt-1 flex gap-1.5">
                <input type="text" id="hedbanzCustomQuestionInput" placeholder="Ask custom question in English..."
                       class="flex-1 bg-slate-950 border border-purple-500/40 rounded-xl px-2.5 py-1.5 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400 font-semibold"
                       onkeydown="if(event.key==='Enter') window.Hedbanz3D.askCustomQuestion();">
                <button type="button" onclick="window.Hedbanz3D.askCustomQuestion()"
                        class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow cursor-pointer active:scale-95">
                  Ask
                </button>
              </div>

              <!-- HISTORIAL DE PREGUNTAS Y VEREDICTOS -->
              <div class="flex-1 min-h-[90px] max-h-36 bg-slate-950/60 border border-purple-500/20 rounded-2xl p-2 overflow-y-auto flex flex-col gap-1 text-[11px]" id="hedbanzHistoryList">
                <div class="text-slate-500 italic text-[10px]">Tus pistas acumuladas aparecerán aquí...</div>
              </div>

              <!-- BOTÓN PRINCIPAL DE ADIVINANZA FINAL -->
              <div class="pt-1">
                <button type="button" onclick="window.Hedbanz3D.openGuessModal()"
                        class="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5">
                  <span>🎯 Adivinar Palabra / Make Final Guess</span>
                </button>
              </div>
            </div>
          </div>

          <!-- MODAL DE ADIVINANZA FINAL -->
          <div id="hedbanzGuessModal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 hidden">
            <div class="bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 max-w-sm w-full shadow-2xl text-center">
              <span class="text-4xl block mb-2">🤔</span>
              <h3 class="text-base font-black text-white">¿Qué o quién soy?</h3>
              <p class="text-xs text-slate-300 mt-1 mb-3">Escribe tu respuesta en inglés o elige una de las opciones:</p>
              
              <input type="text" id="hedbanzGuessInput" placeholder="Escribe tu palabra en inglés..."
                     class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 text-center font-bold mb-3 focus:outline-none focus:border-amber-400 uppercase"
                     onkeydown="if(event.key==='Enter') window.Hedbanz3D.submitGuess();">

              <div id="hedbanzGuessOptions" class="grid grid-cols-2 gap-1.5 mb-3.5"></div>

              <div class="flex items-center gap-2">
                <button type="button" onclick="window.Hedbanz3D.closeGuessModal()"
                        class="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700">
                  Volver a preguntar
                </button>
                <button type="button" onclick="window.Hedbanz3D.submitGuess()"
                        class="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs">
                  ¡Adivinar!
                </button>
              </div>
            </div>
          </div>

          <!-- MODAL DE VICTORIA & CELEBRACIÓN -->
          <div id="hedbanzVictoryModal" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-lg flex items-center justify-center p-4 hidden">
            <div class="bg-slate-900 border-2 border-emerald-400 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center relative overflow-hidden animate-bounce-short">
              <div class="text-5xl mb-2">🎉</div>
              <h2 class="text-xl font-black text-emerald-300 uppercase">¡EXCELLENT! YOU GOT IT!</h2>
              <p class="text-sm font-extrabold text-white mt-1" id="hedbanzRevealedWord">It is a: Dog</p>
              <p class="text-xs text-emerald-200/80 mt-1" id="hedbanzRevealedHint">Loyal four-legged domestic animal.</p>

              <div class="my-4 py-3 px-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center justify-around">
                <div class="flex items-center gap-1.5">
                  <span class="text-xl">💰</span>
                  <span class="text-sm font-black text-amber-300">+100 PetCoins</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-xl">⚡</span>
                  <span class="text-sm font-black text-sky-300">+50 EXP</span>
                </div>
              </div>

              <div class="flex gap-2">
                <button type="button" onclick="window.Hedbanz3D.handleBack(event)"
                        class="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs">
                  Salir a Portales
                </button>
                <button type="button" onclick="window.Hedbanz3D.nextRound()"
                        class="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg">
                  Siguiente Carta ➔
                </button>
              </div>
            </div>
          </div>

        </div>
      `;
    }

    pickNewMysteryCard() {
      const idx = Math.floor(Math.random() * HEDBANZ_VOCAB_DB.length);
      this.currentCard = HEDBANZ_VOCAB_DB[idx];
      this.timeLeft = 90;
      this.strikes = 0;
      this.isSolved = false;
      this.askedQuestions = [];

      const strikesCount = document.getElementById('hedbanzStrikesCount');
      if (strikesCount) strikesCount.textContent = '0/3';
      const historyList = document.getElementById('hedbanzHistoryList');
      if (historyList) historyList.innerHTML = '<div class="text-slate-500 italic text-[10px]">Tus pistas acumuladas aparecerán aquí...</div>';
      const verdictEl = document.getElementById('hedbanzRefereeVerdict');
      if (verdictEl) verdictEl.textContent = 'Ask me a question!';
    }

    initThreeViewer(glbUrl) {
      this.disposeThree();
      const mount = document.getElementById('hedbanzCanvasMount');
      if (!mount || typeof THREE === 'undefined') return;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      this.camera.position.set(0, 0.3, 4.2);
      this.camera.lookAt(0, 0.2, 0);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      this.renderer.shadowMap.enabled = false;
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';
      this.renderer.domElement.style.display = 'block';
      mount.appendChild(this.renderer.domElement);

      const resizeViewer = () => {
        if (!this.renderer || !this.camera || !mount) return;
        const rect = mount.getBoundingClientRect();
        const w = rect.width || (window.innerWidth - 380);
        const h = rect.height || (window.innerHeight - 80);
        this.renderer.setSize(w, h, false);
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.display = 'block';
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
      };

      resizeViewer();
      requestAnimationFrame(() => {
        setTimeout(resizeViewer, 50);
      });

      this._resizeListener = resizeViewer;
      window.addEventListener('resize', this._resizeListener);

      const hemi = new THREE.HemisphereLight(0xffffff, 0x443355, 1.3);
      this.scene.add(hemi);
      const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2);
      dirLight.position.set(2, 4, 3);
      this.scene.add(dirLight);

      this.avatarGroup = new THREE.Group();
      this.avatarGroup.position.set(0, -0.2, 0);
      this.scene.add(this.avatarGroup);

      // Cabeza estilizada
      const headMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.55 });
      const headGeo = new THREE.SphereGeometry(0.26, 32, 32);
      headGeo.scale(1, 1.15, 1);
      const headMesh = new THREE.Mesh(headGeo, headMat);
      headMesh.position.set(0, 0.48, 0);
      this.avatarGroup.add(headMesh);

      // Cargar paquete Blender GLB
      const LoaderClass = THREE.GLTFLoader || (typeof window !== 'undefined' && window.GLTFLoader) || (typeof window !== 'undefined' && window.StandardGLTFLoader);
      if (LoaderClass) {
        const loader = new LoaderClass();
        loader.load(glbUrl, (gltf) => {
          const loadingOverlay = document.getElementById('hedbanzLoadingOverlay');
          if (loadingOverlay) loadingOverlay.style.opacity = '0';
          setTimeout(() => { if (loadingOverlay) loadingOverlay.style.display = 'none'; }, 200);

          if (gltf && gltf.scene) {
            const headband = gltf.scene.getObjectByName('Avatar_Headband_Pro');
            const card = gltf.scene.getObjectByName('Mystery_Card_3D');
            const hourglass = gltf.scene.getObjectByName('Game_Timer_Hourglass');

            if (headband) {
              this.headbandMesh = headband.clone();
              this.avatarGroup.add(this.headbandMesh);
            }
            if (card) {
              this.cardMesh = card.clone();
              this.avatarGroup.add(this.cardMesh);
            }
            if (hourglass) {
              this.hourglassMesh = hourglass.clone();
              this.hourglassMesh.position.set(1.8, -0.2, 0);
              this.hourglassMesh.scale.set(1.8, 1.8, 1.8);
              this.scene.add(this.hourglassMesh);
            }
          }
          resizeViewer();
        }, undefined, (err) => {
          console.warn('[Hedbanz3D] Usando modelos procedurales de respaldo:', err);
          const loadingOverlay = document.getElementById('hedbanzLoadingOverlay');
          if (loadingOverlay) loadingOverlay.style.display = 'none';
          resizeViewer();
        });
      }

      this.isRunning = true;
      const tick = () => {
        if (!this.isRunning) return;
        this.rafId = requestAnimationFrame(tick);
        const t = performance.now() * 0.0015;
        if (this.avatarGroup) {
          this.avatarGroup.position.y = -0.2 + Math.sin(t * 1.5) * 0.03;
          this.avatarGroup.rotation.y = Math.sin(t * 0.8) * 0.12;
        }
        if (this.hourglassMesh) {
          this.hourglassMesh.rotation.y += 0.015;
        }
        this.renderer.render(this.scene, this.camera);
      };
      this.rafId = requestAnimationFrame(tick);
    }

    startCountdownTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.isSolved) return;
        this.timeLeft--;
        const clockEl = document.getElementById('hedbanzClockDisplay');
        if (clockEl) clockEl.textContent = `${this.timeLeft}s`;

        if (this.timeLeft <= 0) {
          clearInterval(this.timerInterval);
          this.handleTimeout();
        }
      }, 1000);
    }

    askQuestion(categoryKey) {
      if (!this.currentCard || this.isSolved) return;

      const questionsMap = {
        isLiving: 'Is it a living thing?',
        isSupermarket: 'Is it in a supermarket?',
        isEatable: 'Can you eat it?',
        isAppliance: 'Is it an appliance?',
        isWearable: 'Can you wear it?',
        isAnimal: 'Is it an animal?',
        canFly: 'Can it fly?',
        isHouse: 'Is it found in a house?'
      };

      const qText = questionsMap[categoryKey] || 'Custom question';
      const isYes = !!this.currentCard[categoryKey];
      const verdict = isYes ? 'YES!' : 'NO!';

      this.recordVerdict(qText, verdict, isYes);
    }

    askCustomQuestion() {
      const input = document.getElementById('hedbanzCustomQuestionInput');
      if (!input || !input.value.trim() || !this.currentCard || this.isSolved) return;
      const q = input.value.trim();
      input.value = '';

      const lower = q.toLowerCase();
      let verdict = 'SOMETIMES!';
      let isYes = true;

      if (lower.includes('eat') || lower.includes('food') || lower.includes('delicious')) {
        verdict = this.currentCard.isEatable ? 'YES!' : 'NO!';
        isYes = this.currentCard.isEatable;
      } else if (lower.includes('animal') || lower.includes('pet')) {
        verdict = this.currentCard.isAnimal ? 'YES!' : 'NO!';
        isYes = this.currentCard.isAnimal;
      } else if (lower.includes('live') || lower.includes('alive')) {
        verdict = this.currentCard.isLiving ? 'YES!' : 'NO!';
        isYes = this.currentCard.isLiving;
      } else if (lower.includes('electric') || lower.includes('plug') || lower.includes('appliance')) {
        verdict = this.currentCard.isAppliance ? 'YES!' : 'NO!';
        isYes = this.currentCard.isAppliance;
      } else if (lower.includes('wear') || lower.includes('cloth')) {
        verdict = this.currentCard.isWearable ? 'YES!' : 'NO!';
        isYes = this.currentCard.isWearable;
      } else if (lower.includes('fly') || lower.includes('wing')) {
        verdict = this.currentCard.canFly ? 'YES!' : 'NO!';
        isYes = this.currentCard.canFly;
      }

      this.recordVerdict(q, verdict, isYes);
    }

    recordVerdict(questionText, verdict, isYes) {
      this.askedQuestions.push({ questionText, verdict, isYes });
      const verdictEl = document.getElementById('hedbanzRefereeVerdict');
      if (verdictEl) {
        verdictEl.textContent = `${verdict} • "${questionText}"`;
        verdictEl.className = isYes ? 'text-sm font-black text-emerald-400' : (verdict === 'NO!' ? 'text-sm font-black text-rose-400' : 'text-sm font-black text-amber-300');
      }

      // TTS Árbitro IA
      this.sfx.speak(verdict);

      const historyList = document.getElementById('hedbanzHistoryList');
      if (historyList) {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between py-1 border-b border-purple-500/20';
        item.innerHTML = `
          <span class="text-purple-200">${questionText}</span>
          <span class="font-black px-1.5 py-0.5 rounded text-[10px] ${isYes ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'}">${verdict}</span>
        `;
        historyList.prepend(item);
      }
    }

    openGuessModal() {
      const modal = document.getElementById('hedbanzGuessModal');
      if (!modal) return;
      const optsContainer = document.getElementById('hedbanzGuessOptions');
      if (optsContainer) {
        optsContainer.innerHTML = '';
        const candidates = [this.currentCard.word];
        const pool = HEDBANZ_VOCAB_DB.filter(c => c.word !== this.currentCard.word);
        while (candidates.length < 4 && pool.length > 0) {
          const rand = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
          candidates.push(rand.word);
        }
        candidates.sort(() => Math.random() - 0.5);

        candidates.forEach(cand => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs border border-slate-600 transition';
          btn.textContent = cand;
          btn.onclick = () => {
            const input = document.getElementById('hedbanzGuessInput');
            if (input) input.value = cand;
            this.submitGuess();
          };
          optsContainer.appendChild(btn);
        });
      }

      modal.classList.remove('hidden');
    }

    closeGuessModal() {
      const modal = document.getElementById('hedbanzGuessModal');
      if (modal) modal.classList.add('hidden');
    }

    submitGuess() {
      const input = document.getElementById('hedbanzGuessInput');
      if (!input || !input.value.trim() || !this.currentCard) return;
      const guess = input.value.trim().toLowerCase();
      this.closeGuessModal();

      if (guess === this.currentCard.word.toLowerCase()) {
        this.handleVictory();
      } else {
        this.strikes++;
        const strikesCount = document.getElementById('hedbanzStrikesCount');
        if (strikesCount) strikesCount.textContent = `${this.strikes}/3`;
        this.sfx.play('buzzer');
        this.sfx.speak("Not quite! Keep asking questions!");

        if (this.strikes >= 3) {
          this.handleTimeout();
        }
      }
    }

    handleVictory() {
      this.isSolved = true;
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.sfx.play('cheer');
      this.sfx.speak(`Correct! You are a ${this.currentCard.word}!`);

      if (typeof global.addExp === 'function') {
        global.addExp(50, 'Hedbanz 3D Victory');
      }
      try {
        const storedCoins = Number(localStorage.getItem('mastereng_pet_coins') || 100);
        localStorage.setItem('mastereng_pet_coins', String(storedCoins + 100));
      } catch (_) {}

      const victoryModal = document.getElementById('hedbanzVictoryModal');
      const revealedWord = document.getElementById('hedbanzRevealedWord');
      const revealedHint = document.getElementById('hedbanzRevealedHint');
      if (revealedWord) revealedWord.textContent = `You are a: ${this.currentCard.word} (${this.currentCard.es})`;
      if (revealedHint) revealedHint.textContent = this.currentCard.hint;
      if (victoryModal) victoryModal.classList.remove('hidden');
    }

    handleTimeout() {
      this.isSolved = true;
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.sfx.play('buzzer');
      this.sfx.speak(`Time is up! The mystery card was ${this.currentCard.word}.`);
      alert(`⏰ ¡Tiempo agotado!\nTu palabra secreta era: ${this.currentCard.word} (${this.currentCard.es}).\n${this.currentCard.hint}`);
      this.nextRound();
    }

    nextRound() {
      const victoryModal = document.getElementById('hedbanzVictoryModal');
      if (victoryModal) victoryModal.classList.add('hidden');
      this.pickNewMysteryCard();
      this.startCountdownTimer();
    }

    handleBack(event) {
      if (event && event.stopPropagation) event.stopPropagation();
      this.dispose();
      if (typeof window.returnToMainPortals === 'function') {
        window.returnToMainPortals(event);
      } else if (typeof window.navigateTo === 'function') {
        window.navigateTo('view-home');
      }
    }

    dispose() {
      this.isRunning = false;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.disposeThree();
      const container = document.getElementById('view-jest-game');
      if (container) {
        container.classList.add('hidden');
        container.style.display = 'none';
      }
    }

    disposeThree() {
      if (this._resizeListener) {
        window.removeEventListener('resize', this._resizeListener);
        this._resizeListener = null;
      }
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.scene) {
        try {
          this.scene.traverse((obj) => {
            if (obj.isMesh) {
              if (obj.geometry && typeof obj.geometry.dispose === 'function') obj.geometry.dispose();
              if (obj.material) {
                if (Array.isArray(obj.material)) {
                  obj.material.forEach(m => { if (m && typeof m.dispose === 'function') m.dispose(); });
                } else if (typeof obj.material.dispose === 'function') {
                  obj.material.dispose();
                }
              }
            }
          });
        } catch (_) {}
      }
      if (this.renderer) {
        try {
          if (typeof this.renderer.dispose === 'function') this.renderer.dispose();
          if (this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
          }
        } catch (_) {}
      }
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.hourglassMesh = null;
      this.cardMesh = null;
      this.headbandMesh = null;
      this.avatarGroup = null;
    }
  }

  const hedbanz3DInstance = new Hedbanz3DEngine();
  global.Hedbanz3D = hedbanz3DInstance;
  global.openHedbanz3DGame = (opts) => hedbanz3DInstance.open(opts);
  global.openJestGameView = (opts) => hedbanz3DInstance.open(opts);
  global.JestGame3D = hedbanz3DInstance;

  // ============================================================================
  // 8. EXPOSICIÓN GLOBAL E INTEGRACIÓN CON PET ENGINE 2D
  // ============================================================================

  const arcadeManager = new PetArcadeManager();
  global.PetArcadeManager = arcadeManager;

  // Funciones solicitadas en los requerimientos
  global.openPetArcadeModal = (petState) => arcadeManager.open(petState);
  global.closePetArcadeModal = () => arcadeManager.close();
  global.startArcadeGame = (gameId) => arcadeManager.launchGame(gameId);

  // Global PetMinigames2D API para congelación de loops en hideAllModules
  global.PetMinigames2D = global.PetMinigames2D || {};
  global.PetMinigames2D.stopGame = function() { arcadeManager.stopGame(); };
  global.PetMinigames2D.pauseLoop = function() { arcadeManager.pauseLoop(); };
  global.PetMinigames2D.manager = arcadeManager;

  // Enganchar en PetEngine2D.playBall si ya está presente o al cargar
  function hookIntoPetEngine() {
    if (global.PetEngine2D && !global.PetEngine2D._arcadeHooked) {
      global.PetEngine2D._arcadeHooked = true;
      const origPlayBall = global.PetEngine2D.playBall;
      
      // Cuando el usuario juega con la mascota en playground, abre la consola Arcade
      global.PetEngine2D.playBall = function () {
        global.openPetArcadeModal(this.state);
      };
    }
  }

  hookIntoPetEngine();
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hookIntoPetEngine);
    } else {
      hookIntoPetEngine();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = arcadeManager;
  }
})(typeof window !== 'undefined' ? window : globalThis);

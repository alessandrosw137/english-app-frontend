/**
 * MASTERGOAL 3D: TACTICAL SOCCER & DIVISION RIVALS ENGINE
 * WebGL Three.js 60FPS Tactical Football Simulator + Real-Time English Challenge
 */
(function () {
  'use strict';

  const PROFILE_STORAGE_KEY = 'mastereng_soccer_profile';

  // =========================================================================
  // 2.3. BANCO COMPLETO DE IDIOMA FUTBOLÍSTICO REAL (66 TÉRMINOS Y FRASES)
  // =========================================================================
  const SOCCER_VOCABULARY_BANK = [
    // NIVEL 1: FUNDAMENTOS Y POSICIONES (Basic - Divisiones Bajas)
    { id: 'b01', level: 'basic', en: 'Kick the ball', es: 'Patear el balón', category: 'action' },
    { id: 'b02', level: 'basic', en: 'Pass the ball', es: 'Pasar el balón', category: 'pass' },
    { id: 'b03', level: 'basic', en: 'Shoot at goal', es: 'Disparar a portería', category: 'shot' },
    { id: 'b04', level: 'basic', en: 'Run with the ball', es: 'Correr con el balón', category: 'dribble' },
    { id: 'b05', level: 'basic', en: 'Score a goal', es: 'Anotar un gol', category: 'shot' },
    { id: 'b06', level: 'basic', en: 'Goalkeeper', es: 'Portero / Guardameta', category: 'position' },
    { id: 'b07', level: 'basic', en: 'Defender', es: 'Defensa', category: 'position' },
    { id: 'b08', level: 'basic', en: 'Midfielder', es: 'Mediocampista', category: 'position' },
    { id: 'b09', level: 'basic', en: 'Striker / Forward', es: 'Delantero', category: 'position' },
    { id: 'b10', level: 'basic', en: 'Referee', es: 'Árbitro', category: 'match' },
    { id: 'b11', level: 'basic', en: 'Pitch / Field', es: 'Cancha / Terreno de juego', category: 'match' },
    { id: 'b12', level: 'basic', en: 'Halftime', es: 'Medio tiempo', category: 'match' },
    { id: 'b13', level: 'basic', en: 'Short pass', es: 'Pase corto', category: 'pass' },
    { id: 'b14', level: 'basic', en: 'Long ball', es: 'Pase largo', category: 'pass' },
    { id: 'b15', level: 'basic', en: 'Kick-off', es: 'Saque inicial', category: 'match' },
    { id: 'b16', level: 'basic', en: 'Goalpost', es: 'Poste de la portería', category: 'match' },
    { id: 'b17', level: 'basic', en: 'Team captain', es: 'Capitán del equipo', category: 'position' },
    { id: 'b18', level: 'basic', en: 'Left wing', es: 'Banda izquierda', category: 'tactics' },
    { id: 'b19', level: 'basic', en: 'Right wing', es: 'Banda derecha', category: 'tactics' },
    { id: 'b20', level: 'basic', en: 'Clear the ball', es: 'Despejar el balón', category: 'defense' },
    { id: 'b21', level: 'basic', en: 'Block the shot', es: 'Bloquear el disparo', category: 'defense' },
    { id: 'b22', level: 'basic', en: 'Final whistle', es: 'Silbatazo final', category: 'match' },

    // NIVEL 2: JUGADAS TÉCNICAS Y REGLAS (Intermediate - Divisiones Medias)
    { id: 'i01', level: 'intermediate', en: 'Through ball', es: 'Pase filtrado al hueco', category: 'pass' },
    { id: 'i02', level: 'intermediate', en: 'Cross the ball', es: 'Tirar un centro al área', category: 'pass' },
    { id: 'i03', level: 'intermediate', en: 'Header', es: 'Remate de cabeza', category: 'shot' },
    { id: 'i04', level: 'intermediate', en: 'Slide tackle', es: 'Barrida defensiva', category: 'defense' },
    { id: 'i05', level: 'intermediate', en: 'Free kick', es: 'Tiro libre', category: 'setpiece' },
    { id: 'i06', level: 'intermediate', en: 'Penalty kick', es: 'Tiro penal', category: 'setpiece' },
    { id: 'i07', level: 'intermediate', en: 'Corner kick', es: 'Tiro de esquina', category: 'setpiece' },
    { id: 'i08', level: 'intermediate', en: 'Throw-in', es: 'Saque de banda', category: 'setpiece' },
    { id: 'i09', level: 'intermediate', en: 'Goal kick', es: 'Saque de meta', category: 'setpiece' },
    { id: 'i10', level: 'intermediate', en: 'Offside', es: 'Fuera de lugar', category: 'rule' },
    { id: 'i11', level: 'intermediate', en: 'Yellow card', es: 'Tarjeta amarilla (Amonestación)', category: 'rule' },
    { id: 'i12', level: 'intermediate', en: 'Red card', es: 'Tarjeta roja (Expulsión)', category: 'rule' },
    { id: 'i13', level: 'intermediate', en: 'Foul', es: 'Falta', category: 'rule' },
    { id: 'i14', level: 'intermediate', en: 'Dribble past the defender', es: 'Regatear al defensa', category: 'dribble' },
    { id: 'i15', level: 'intermediate', en: 'Intercept the pass', es: 'Cortar el pase', category: 'defense' },
    { id: 'i16', level: 'intermediate', en: 'First-time volley', es: 'Volea de primera intención', category: 'shot' },
    { id: 'i17', level: 'intermediate', en: 'Penalty box', es: 'Área grande / Área penal', category: 'match' },
    { id: 'i18', level: 'intermediate', en: 'Mark the striker', es: 'Marcar al delantero', category: 'defense' },
    { id: 'i19', level: 'intermediate', en: 'Diving save', es: 'Atajada con estirada', category: 'defense' },
    { id: 'i20', level: 'intermediate', en: 'Keep possession', es: 'Mantener la posesión', category: 'tactics' },
    { id: 'i21', level: 'intermediate', en: 'Low driven shot', es: 'Disparo raso y potente', category: 'shot' },
    { id: 'i22', level: 'intermediate', en: 'Curled shot', es: 'Tiro con efecto / colocado', category: 'shot' },

    // NIVEL 3: TÁCTICA AVANZADA, JERGA Y EXPRESIONES DE ESTADIO (Advanced - Divisiones Altas)
    { id: 'a01', level: 'advanced', en: 'Top corner / Top bins', es: 'Al ángulo superior (Donde duermen las arañas)', category: 'shot' },
    { id: 'a02', level: 'advanced', en: 'Nutmeg', es: 'Hacer un túnel / caño entre las piernas', category: 'dribble' },
    { id: 'a03', level: 'advanced', en: 'One-two / Wall pass', es: 'Hacer una pared con el compañero', category: 'pass' },
    { id: 'a04', level: 'advanced', en: 'Counter-attack', es: 'Contraataque rápido', category: 'tactics' },
    { id: 'a05', level: 'advanced', en: 'Clean sheet', es: 'Portería imbatida (Cero goles recibidos)', category: 'defense' },
    { id: 'a06', level: 'advanced', en: 'Stoppage time / Injury time', es: 'Tiempo de compensación / descuento', category: 'match' },
    { id: 'a07', level: 'advanced', en: 'Man on!', es: '¡Llevas marca! / ¡Cuidado por la espalda!', category: 'tactics' },
    { id: 'a08', level: 'advanced', en: 'Switch the play', es: 'Cambiar de juego a la otra banda', category: 'pass' },
    { id: 'a09', level: 'advanced', en: 'Bicycle kick', es: 'Remate de chilena', category: 'shot' },
    { id: 'a10', level: 'advanced', en: 'Chip the keeper', es: 'Picar el balón por encima del portero (Vaselina)', category: 'shot' },
    { id: 'a11', level: 'advanced', en: 'Hit the crossbar', es: 'Estrellar el balón en el travesaño', category: 'shot' },
    { id: 'a12', level: 'advanced', en: 'Parking the bus', es: 'Encerrarse atrás a defender', category: 'tactics' },
    { id: 'a13', level: 'advanced', en: 'High pressing', es: 'Presión alta sobre la salida rival', category: 'defense' },
    { id: 'a14', level: 'advanced', en: 'Overlap on the wing', es: 'Hacer la pasada por la banda', category: 'tactics' },
    { id: 'a15', level: 'advanced', en: 'Clinical finish', es: 'Definición letal frente al arco', category: 'shot' },
    { id: 'a16', level: 'advanced', en: 'Thread the needle', es: 'Filtrar un pase milimétrico entre líneas', category: 'pass' },
    { id: 'a17', level: 'advanced', en: 'Break the offside trap', es: 'Romper la línea del fuera de juego', category: 'tactics' },
    { id: 'a18', level: 'advanced', en: 'Box-to-box midfielder', es: 'Mediocampista todoterreno de área a área', category: 'position' },
    { id: 'a19', level: 'advanced', en: 'Last-ditch tackle', es: 'Barrida salvadora en el último segundo', category: 'defense' },
    { id: 'a20', level: 'advanced', en: 'Finesse shot into the far post', es: 'Tiro colocado al segundo palo', category: 'shot' },
    { id: 'a21', level: 'advanced', en: 'Hold up the ball', es: 'Aguantar el balón de espaldas al arco', category: 'tactics' },
    { id: 'a22', level: 'advanced', en: 'Catch the keeper off his line', es: 'Sorprender al portero adelantado', category: 'shot' }
  ];

  // =========================================================================
  // 2.5. SISTEMA DE DIVISION RIVALS (10 DIVISIONES OFICIALES)
  // =========================================================================
  const DIVISION_RIVALS_TIERS = [
    { div: 10, minRP: 0,    maxRP: 99,   title: 'Sunday League / Amateur I',      tierGroup: 'Bronze',  icon: '🥉', gradient: 'linear-gradient(135deg, #78350f, #b45309)' },
    { div: 9,  minRP: 100,  maxRP: 199,  title: 'Sunday League / Amateur II',     tierGroup: 'Bronze',  icon: '🥉', gradient: 'linear-gradient(135deg, #92400e, #d97706)' },
    { div: 8,  minRP: 200,  maxRP: 299,  title: 'Sunday League / Amateur Elite',  tierGroup: 'Bronze',  icon: '🥉', gradient: 'linear-gradient(135deg, #b45309, #f59e0b)' },
    { div: 7,  minRP: 300,  maxRP: 419,  title: 'Academy Prospect / Semi-Pro I',  tierGroup: 'Silver',  icon: '🥈', gradient: 'linear-gradient(135deg, #334155, #64748b)' },
    { div: 6,  minRP: 420,  maxRP: 549,  title: 'Academy Prospect / Semi-Pro II', tierGroup: 'Silver',  icon: '🥈', gradient: 'linear-gradient(135deg, #475569, #94a3b8)' },
    { div: 5,  minRP: 550,  maxRP: 699,  title: 'Academy Prospect / Semi-Pro Pro',tierGroup: 'Silver',  icon: '🥈', gradient: 'linear-gradient(135deg, #64748b, #cbd5e1)' },
    { div: 4,  minRP: 700,  maxRP: 859,  title: 'Premier Tactician / Pro I',      tierGroup: 'Gold',    icon: '🥇', gradient: 'linear-gradient(135deg, #b45309, #fbbf24)' },
    { div: 3,  minRP: 860,  maxRP: 1049, title: 'Premier Tactician / Pro Elite',  tierGroup: 'Gold',    icon: '🥇', gradient: 'linear-gradient(135deg, #d97706, #fde047)' },
    { div: 2,  minRP: 1050, maxRP: 1299, title: 'Champions League Contender',     tierGroup: 'Emerald', icon: '💎', gradient: 'linear-gradient(135deg, #047857, #10b981, #38bdf8)' },
    { div: 1,  minRP: 1300, maxRP: 9999, title: "Ballon d'Or World Class Elite",  tierGroup: 'Icon',    icon: '👑', gradient: 'linear-gradient(135deg, #fbbf24, #a855f7, #ec4899)' }
  ];

  // =========================================================================
  // 2.1. MATRIZ DE 15 NODOS TÁCTICOS EN CANCHA (5 ZONAS × 3 CARRILES)
  // =========================================================================
  const TACTICAL_ZONES_META = {
    '-2': { nameEn: 'Zone -2: Your Defensive Box', nameEs: 'Zona -2: Tu Área Defensiva', x: -32 },
    '-1': { nameEn: 'Zone -1: Your Midfield',      nameEs: 'Zona -1: Tu Mediocampo',     x: -16 },
    '0':  { nameEn: 'Zone 0: Center Circle',       nameEs: 'Zona 0: Círculo Central',    x: 0 },
    '1':  { nameEn: 'Zone +1: Attacking Third',    nameEs: 'Zona +1: Tres Cuartos',      x: 16 },
    '2':  { nameEn: 'Zone +2: Shooting Box',       nameEs: 'Zona +2: Área de Disparo',   x: 32 }
  };

  const TACTICAL_LANES_META = {
    left:   { id: 'left',   nameEn: 'Left Wing',   nameEs: 'Banda Izquierda', z: -15 },
    center: { id: 'center', nameEn: 'Center Lane', nameEs: 'Carril Central',  z: 0 },
    right:  { id: 'right',  nameEn: 'Right Wing',  nameEs: 'Banda Derecha',   z: 15 }
  };

  const KIT_PRESETS = {
    classic_blue:  { name: 'Royal Blue & Gold', primary: 0x1d4ed8, secondary: 0xfbbf24, shorts: 0x0f172a },
    emerald_elite: { name: 'Emerald Champions', primary: 0x059669, secondary: 0x34d399, shorts: 0x064e3b },
    crimson_flame: { name: 'Crimson Striker',   primary: 0xdc2626, secondary: 0xfde047, shorts: 0x1e293b },
    galaxy_icon:   { name: 'Ballon dOr Icon',   primary: 0x7e22ce, secondary: 0xfbbf24, shorts: 0x090d1a }
  };

  const BOOTS_PRESETS = {
    standard:   { name: 'Predator Carbon', color: 0x111827 },
    neon_volt:  { name: 'Mercurial Volt',  color: 0x84cc16 },
    gold_elite: { name: 'Phantom Gold',    color: 0xfbbf24 }
  };

  const BALL_PRESETS = {
    pro_white:      { name: 'Champions Pro White', color: 0xffffff, accent: 0x1d4ed8 },
    winter_hi_vis:  { name: 'Premier Hi-Vis Yellow', color: 0xfacc15, accent: 0xdc2626 },
    finale_emerald: { name: 'Finale Emerald Star', color: 0xecfdf5, accent: 0x10b981 }
  };

  function getDefaultProfile() {
    return {
      rp: 120,
      division: 9,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsScored: 0,
      goalsConceded: 0,
      currentStreak: 0,
      bestStreak: 0,
      questionsAnswered: 0,
      questionsCorrect: 0,
      playerCustomization: {
        kitId: 'classic_blue',
        bootsId: 'standard',
        ballId: 'pro_white',
        stadiumTheme: 'night_arena',
        unlockedItems: ['classic_blue', 'emerald_elite', 'crimson_flame', 'galaxy_icon', 'standard', 'neon_volt', 'gold_elite', 'pro_white', 'winter_hi_vis', 'finale_emerald']
      }
    };
  }

  function loadProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      const base = getDefaultProfile();
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      const merged = Object.assign({}, base, parsed);
      merged.playerCustomization = Object.assign({}, base.playerCustomization, parsed.playerCustomization || {});
      merged.division = computeDivisionFromRP(merged.rp).div;
      return merged;
    } catch (e) {
      return getDefaultProfile();
    }
  }

  function saveProfile(profile) {
    try {
      profile.rp = Math.max(0, Math.round(profile.rp || 0));
      profile.division = computeDivisionFromRP(profile.rp).div;
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      if (window.userProfile && typeof window. userProfile === 'object') {
        window.userProfile.soccerProfile = profile;
      }
      if (typeof window.saveUserProgress === 'function') {
        try { window.saveUserProgress(); } catch (err) {}
      }
    } catch (e) {}
  }

  function computeDivisionFromRP(rp) {
    const safeRP = Math.max(0, Number(rp) || 0);
    for (let i = DIVISION_RIVALS_TIERS.length - 1; i >= 0; i--) {
      if (safeRP >= DIVISION_RIVALS_TIERS[i].minRP) {
        return DIVISION_RIVALS_TIERS[i];
      }
    }
    return DIVISION_RIVALS_TIERS[0];
  }

  // =========================================================================
  // MOTOR PRINCIPAL SOCCER TACTICS 3D
  // =========================================================================
  const SoccerTactics3D = {
    profile: loadProfile(),
    activeTab: 'lobby', // 'lobby' | 'locker' | 'match'
    isRunning: false,
    rafId: null,
    scene: null,
    camera: null,
    renderer: null,
    raycaster: null,
    pointer: null,
    clock: null,

    // Objetos 3D de cancha
    pitchGroup: null,
    nodesMap: {},       // key: `${zone}_${lane}` -> Mesh ring
    interactiveMeshes: [],
    homePlayers: [],    // 5 jugadores articulados (0 = GK, 1..4 = campo)
    awayPlayers: [],    // 5 jugadores articulados (0 = GK, 1..4 = campo)
    ballMesh: null,
    tacticalArrowMesh: null,
    lockerPreviewMesh: null,

    // Animaciones 3D en curso
    ballAnim: null,
    cameraTargetPos: { x: 0, y: 28, z: 38 },
    cameraLookAtPos: { x: 0, y: 1, z: 0 },

    // Estado del partido
    match: {
      active: false,
      mode: '1p_ai', // '1p_ai' | '2p_local'
      homeScore: 0,
      awayScore: 0,
      playsElapsed: 0,
      maxPlays: 10, // 90 minutos simulados (9 min por jugada)
      possession: 'home', // 'home' (Player 1) | 'away' (AI or Player 2)
      ballZone: 0,        // -2, -1, 0, +1, +2
      ballLane: 'center', // 'left', 'center', 'right'
      currentOptions: [],
      selectedOption: null,
      matchCorrectAnswers: 0,
      matchTotalQuestions: 0,
      quizTimerInterval: null,
      quizStartTime: 0,
      quizTimeLeft: 8.0,
      currentQuiz: null
    },

    openPortal: function () {
      this.profile = loadProfile();
      this.ensureDOM();
      this.switchTab('lobby');
      if (typeof window.forceLandscapeOrientation === 'function') {
        try { window.forceLandscapeOrientation(); } catch (e) {}
      }
    },

    ensureDOM: function () {
      const container = document.getElementById('view-soccer-3d');
      if (!container) return;
      if (container.dataset.initialized === 'true') {
        this.renderLobbyStats();
        return;
      }
      container.dataset.initialized = 'true';

      container.innerHTML = `
        <!-- HUB PRINCIPAL (LOBBY & VESTIDOR) -->
        <div id="soccer-hub-view" class="soccer-hub-container">
          <div class="soccer-hub-topbar">
            <div class="soccer-brand-block">
              <div class="soccer-brand-emblem">⚽</div>
              <div>
                <h1 class="soccer-brand-title">MasterGoal 3D: Tactical Soccer</h1>
                <p class="soccer-brand-subtitle">FIFA Division Rivals &bull; Score! Hero 15-Zone Tactical Engine</p>
              </div>
            </div>
            <div class="soccer-nav-tabs">
              <button type="button" id="soccerTabLobbyBtn" class="soccer-tab-btn active" onclick="window.SoccerTactics3D.switchTab('lobby')">
                🏆 Division Rivals Lobby
              </button>
              <button type="button" id="soccerTabLockerBtn" class="soccer-tab-btn" onclick="window.SoccerTactics3D.switchTab('locker')">
                👕 Vestidor &amp; Pase de Temporada (Próximamente)
              </button>
              <button type="button" class="soccer-exit-btn" onclick="window.backToPortalsMenu()">
                ← Salir a Portales
              </button>
            </div>
          </div>

          <!-- TAB 1: DIVISION RIVALS & MODOS DE JUEGO -->
          <div id="soccer-tab-lobby-content" class="soccer-lobby-grid">
            <div class="soccer-rivals-card">
              <div class="soccer-division-header">
                <div id="soccerDivCrest" class="soccer-division-crest">
                  <span id="soccerDivIcon" class="soccer-division-crest-icon">🥉</span>
                  <span id="soccerDivNum" class="soccer-division-crest-num">DIV 9</span>
                </div>
                <div class="soccer-division-info">
                  <div id="soccerDivTierGroup" class="soccer-division-kicker">BRONZE TIER</div>
                  <h2 id="soccerDivTitle" class="soccer-division-name">Sunday League / Amateur II</h2>
                  <div class="soccer-rp-row">
                    <span id="soccerRpLabel">120 RP</span>
                    <span id="soccerNextDivLabel">Siguiente División: 200 RP</span>
                  </div>
                  <div class="soccer-rp-bar-outer">
                    <div id="soccerRpBarFill" class="soccer-rp-bar-inner" style="width: 45%;"></div>
                  </div>
                </div>
              </div>

              <div class="soccer-stats-grid">
                <div class="soccer-stat-box">
                  <span class="soccer-stat-label">Partidos</span>
                  <span id="soccerStatMatches" class="soccer-stat-value">0</span>
                </div>
                <div class="soccer-stat-box">
                  <span class="soccer-stat-label">Victorias</span>
                  <span id="soccerStatWins" class="soccer-stat-value">0</span>
                </div>
                <div class="soccer-stat-box">
                  <span class="soccer-stat-label">Goles Anotados</span>
                  <span id="soccerStatGoals" class="soccer-stat-value">0</span>
                </div>
                <div class="soccer-stat-box">
                  <span class="soccer-stat-label">Precisión Inglés</span>
                  <span id="soccerStatAccuracy" class="soccer-stat-value">100%</span>
                </div>
                <div class="soccer-stat-box">
                  <span class="soccer-stat-label">Racha Actual</span>
                  <span id="soccerStatStreak" class="soccer-stat-value">🔥 0</span>
                </div>
              </div>
            </div>

            <div class="soccer-modes-card">
              <h3 style="margin:0 0 12px;font-size:17px;font-weight:900;color:#fff;">Selecciona Modo de Partido</h3>
              <div class="soccer-mode-list">
                <div class="soccer-mode-option">
                  <h4 class="soccer-mode-title">
                    <span>🤖 Modo 1: Division Rivals vs IA Táctica</span>
                    <span style="font-size:11px;color:#34d399;">RANKED RP</span>
                  </h4>
                  <p class="soccer-mode-desc">
                    Partidos rápidos a <strong>2 goles o 90 Minutos Simulados (10 jugadas tácticas)</strong>. La IA escala su presión y velocidad según tu División actual (Div 10 a Div 1).
                  </p>
                  <button type="button" class="soccer-play-btn" onclick="window.SoccerTactics3D.startMatch('1p_ai')">
                    ⚽ Jugar Partido Division Rivals (1 Jugador)
                  </button>
                </div>

                <div class="soccer-mode-option">
                  <h4 class="soccer-mode-title">
                    <span>⚔️ Modo 2: Duelo 1v1 (2 Jugadores Local / Sala PvP)</span>
                    <span style="font-size:11px;color:#60a5fa;">2 JUGADORES</span>
                  </h4>
                  <p class="soccer-mode-desc">
                    Duelo táctico competitivo por turnos: el jugador con posesión elige nodo táctico y responde para avanzar o disparar; el rival responde para interceptar o atajar.
                  </p>
                  <button type="button" class="soccer-play-btn secondary" onclick="window.SoccerTactics3D.startMatch('2p_local')">
                    🎮 Iniciar Duelo Táctico 1v1 (2 Jugadores)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: VESTIDOR & PASE DE TEMPORADA -->
          <div id="soccer-tab-locker-content" class="soccer-locker-card" style="display:none;">
            <div class="soccer-locker-layout">
              <div class="soccer-locker-preview-box">
                <div style="font-size:68px;line-height:1;margin-bottom:14px;filter:drop-shadow(0 10px 20px rgba(0,0,0,0.6));">🏃‍♂️⚽</div>
                <div id="soccerLockerPreviewLabel" style="font-size:13px;font-weight:900;color:#38bdf8;text-align:center;">
                  Equipación Activa: Royal Blue &amp; Gold
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-top:4px;text-align:center;">
                  Modelo 3D articulado sincronizado en tiempo real con el estadio
                </div>
              </div>
              <div>
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
                  <h3 style="margin:0;font-size:18px;font-weight:900;color:#fff;">👕 Vestidor &amp; Pase de Temporada</h3>
                  <span style="padding:4px 10px;border-radius:999px;font-size:11px;font-weight:800;background:rgba(168,85,247,0.2);color:#d8b4fe;border:1px solid rgba(168,85,247,0.45);">
                    Temporada 1: Road to Wembley (Próximamente)
                  </span>
                </div>
                <div class="soccer-custom-group">
                  <div class="soccer-custom-group-title">Uniforme del Equipo (Kit ID)</div>
                  <div id="soccerKitPills" class="soccer-custom-pills"></div>
                </div>
                <div class="soccer-custom-group">
                  <div class="soccer-custom-group-title">Botines Profesionales (Boots ID)</div>
                  <div id="soccerBootsPills" class="soccer-custom-pills"></div>
                </div>
                <div class="soccer-custom-group">
                  <div class="soccer-custom-group-title">Balón Oficial (Ball ID)</div>
                  <div id="soccerBallPills" class="soccer-custom-pills"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ESCENARIO 3D DEL ESTADIO -->
        <div id="soccer-stadium-stage">
          <div id="soccer-canvas-mount"></div>

          <!-- MARCADOR DE TV BROADCAST + BOTONES DE RETORNO -->
          <div class="soccer-broadcast-hud">
            <div class="soccer-tv-scoreboard">
              <div class="soccer-tv-team home">🔵 YOU</div>
              <div id="soccerTvScore" class="soccer-tv-score">0 - 0</div>
              <div id="soccerTvAwayLabel" class="soccer-tv-team away">🔴 RIVAL AI</div>
              <div id="soccerTvClock" class="soccer-tv-clock">00' (Jugada 1/10)</div>
            </div>

            <div class="soccer-hud-controls">
              <button type="button" class="soccer-hud-btn" onclick="window.SoccerTactics3D.backToLobby()">
                ← Volver al Lobby de Fútbol
              </button>
              <button type="button" class="soccer-hud-btn" onclick="window.backToPortalsMenu()">
                ← Salir a Portales
              </button>
            </div>
          </div>

          <!-- BANNER CENTRAL DE EVENTO (¡GOL! / ¡ATAJADA! / ¡INTERCEPCIÓN!) -->
          <div id="soccer-event-banner">⚽ GOAL! TOP BINS!</div>

          <!-- DOCK TÁCTICO INFERIOR (SELECCIÓN DE NODO EN CANCHA) -->
          <div id="soccer-tactical-dock" class="soccer-tactical-dock">
            <div class="soccer-tactical-status-row">
              <span id="soccerZoneBadge" class="soccer-zone-pill">Zone 0: Center Circle</span>
              <span id="soccerPossessionPrompt" class="soccer-tactical-prompt">
                🎯 Toca un anillo táctico en el césped 3D o elige tu jugada:
              </span>
            </div>
            <div id="soccerNodeButtons" class="soccer-node-buttons"></div>
          </div>

          <!-- MODAL DE EJECUCIÓN TÁCTICA (8 SEGUNDOS) -->
          <div id="soccer-quiz-modal">
            <div id="soccerQuizCard" class="soccer-quiz-card">
              <div class="soccer-quiz-top">
                <span id="soccerQuizBadge" class="soccer-quiz-badge">⚡ EJECUCIÓN TÁCTICA</span>
                <span id="soccerQuizTimerText" class="soccer-quiz-timer-text">8.0s</span>
              </div>
              <div class="soccer-quiz-timer-track">
                <div id="soccerQuizTimerFill" class="soccer-quiz-timer-fill"></div>
              </div>
              <div class="soccer-quiz-phrase-box">
                <div id="soccerQuizDirection" class="soccer-quiz-direction">TRADUCE AL INGLÉS (&lt;3.5s = 🔥 TOP BINS!)</div>
                <div id="soccerQuizPromptMain" class="soccer-quiz-prompt-main">"Pase filtrado al hueco"</div>
              </div>
              <div id="soccerQuizOptions" class="soccer-quiz-options"></div>
            </div>
          </div>

          <!-- MODAL DE RESUMEN FINAL DE PARTIDO + RP -->
          <div id="soccer-postmatch-modal">
            <div class="soccer-postmatch-card">
              <div id="soccerPostResultIcon" style="font-size:48px;line-height:1;">🏆</div>
              <h2 id="soccerPostTitle" style="margin:0;font-size:24px;font-weight:900;color:#fff;">¡VICTORIA TÁCTICA!</h2>
              <div id="soccerPostScore" style="font-size:20px;font-weight:900;color:#fbbf24;">2 - 0</div>
              <div id="soccerPostRpDelta" style="font-size:15px;font-weight:800;color:#34d399;">+38 RP &bull; Division Rivals</div>
              <div id="soccerPostStats" style="font-size:13px;color:#cbd5e1;line-height:1.5;"></div>
              <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:8px;">
                <button type="button" class="soccer-play-btn" onclick="window.SoccerTactics3D.startMatch(window.SoccerTactics3D.match.mode)">
                  🔄 Jugar Revancha
                </button>
                <button type="button" class="soccer-hud-btn" style="padding:12px 18px;" onclick="window.SoccerTactics3D.backToLobby()">
                  🏆 Volver al Lobby
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      this.renderLobbyStats();
      this.renderLockerCustomization();
    },

    switchTab: function (tabName) {
      this.activeTab = tabName;
      const hubView = document.getElementById('soccer-hub-view');
      const stadiumStage = document.getElementById('soccer-stadium-stage');
      const lobbyContent = document.getElementById('soccer-tab-lobby-content');
      const lockerContent = document.getElementById('soccer-tab-locker-content');
      const tabLobbyBtn = document.getElementById('soccerTabLobbyBtn');
      const tabLockerBtn = document.getElementById('soccerTabLockerBtn');

      if (tabName === 'match') {
        if (hubView) hubView.style.display = 'none';
        if (stadiumStage) stadiumStage.style.display = 'block';
        this.resumeLoop();
      } else {
        this.pauseLoop();
        if (stadiumStage) stadiumStage.style.display = 'none';
        if (hubView) hubView.style.display = 'flex';
        if (lobbyContent) lobbyContent.style.display = tabName === 'lobby' ? 'grid' : 'none';
        if (lockerContent) lockerContent.style.display = tabName === 'locker' ? 'block' : 'none';
        if (tabLobbyBtn) tabLobbyBtn.classList.toggle('active', tabName === 'lobby');
        if (tabLockerBtn) tabLockerBtn.classList.toggle('active', tabName === 'locker');
        this.renderLobbyStats();
        this.renderLockerCustomization();
      }
    },

    backToLobby: function () {
      this.clearQuizTimer();
      const quizModal = document.getElementById('soccer-quiz-modal');
      const postModal = document.getElementById('soccer-postmatch-modal');
      if (quizModal) quizModal.style.display = 'none';
      if (postModal) postModal.style.display = 'none';
      this.match.active = false;
      this.switchTab('lobby');
    },

    renderLobbyStats: function () {
      const p = this.profile;
      const tier = computeDivisionFromRP(p.rp);
      const crest = document.getElementById('soccerDivCrest');
      const icon = document.getElementById('soccerDivIcon');
      const num = document.getElementById('soccerDivNum');
      const group = document.getElementById('soccerDivTierGroup');
      const title = document.getElementById('soccerDivTitle');
      const rpLabel = document.getElementById('soccerRpLabel');
      const nextLabel = document.getElementById('soccerNextDivLabel');
      const rpFill = document.getElementById('soccerRpBarFill');

      if (crest) crest.style.background = tier.gradient;
      if (icon) icon.textContent = tier.icon;
      if (num) num.textContent = 'DIV ' + tier.div;
      if (group) group.textContent = tier.tierGroup.toUpperCase() + ' DIVISION';
      if (title) title.textContent = tier.title;
      if (rpLabel) rpLabel.textContent = p.rp + ' RP';

      if (tier.div === 1) {
        if (nextLabel) nextLabel.textContent = 'Rango Máximo: World Class Elite';
        if (rpFill) rpFill.style.width = '100%';
      } else {
        const span = Math.max(1, tier.maxRP - tier.minRP + 1);
        const pct = Math.min(100, Math.max(4, Math.round(((p.rp - tier.minRP) / span) * 100)));
        if (nextLabel) nextLabel.textContent = 'Ascenso a Div ' + (tier.div - 1) + ': ' + (tier.maxRP + 1) + ' RP';
        if (rpFill) rpFill.style.width = pct + '%';
      }

      const acc = p.questionsAnswered > 0
        ? Math.round((p.questionsCorrect / p.questionsAnswered) * 100)
        : 100;

      const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(val);
      };
      setTxt('soccerStatMatches', p.matchesPlayed);
      setTxt('soccerStatWins', p.wins);
      setTxt('soccerStatGoals', p.goalsScored);
      setTxt('soccerStatAccuracy', acc + '%');
      setTxt('soccerStatStreak', '🔥 ' + p.currentStreak);
    },

    renderLockerCustomization: function () {
      const cust = this.profile.playerCustomization;
      const kitContainer = document.getElementById('soccerKitPills');
      const bootsContainer = document.getElementById('soccerBootsPills');
      const ballContainer = document.getElementById('soccerBallPills');
      const previewLabel = document.getElementById('soccerLockerPreviewLabel');

      if (kitContainer) {
        kitContainer.innerHTML = Object.keys(KIT_PRESETS).map((k) => {
          const item = KIT_PRESETS[k];
          const active = cust.kitId === k ? 'active' : '';
          return `<button type="button" class="soccer-custom-pill ${active}" onclick="window.SoccerTactics3D.setCustomization('kitId','${k}')">${item.name}</button>`;
        }).join('');
      }

      if (bootsContainer) {
        bootsContainer.innerHTML = Object.keys(BOOTS_PRESETS).map((k) => {
          const item = BOOTS_PRESETS[k];
          const active = cust.bootsId === k ? 'active' : '';
          return `<button type="button" class="soccer-custom-pill ${active}" onclick="window.SoccerTactics3D.setCustomization('bootsId','${k}')">${item.name}</button>`;
        }).join('');
      }

      if (ballContainer) {
        ballContainer.innerHTML = Object.keys(BALL_PRESETS).map((k) => {
          const item = BALL_PRESETS[k];
          const active = cust.ballId === k ? 'active' : '';
          return `<button type="button" class="soccer-custom-pill ${active}" onclick="window.SoccerTactics3D.setCustomization('ballId','${k}')">${item.name}</button>`;
        }).join('');
      }

      if (previewLabel) {
        const kitName = (KIT_PRESETS[cust.kitId] || KIT_PRESETS.classic_blue).name;
        const ballName = (BALL_PRESETS[cust.ballId] || BALL_PRESETS.pro_white).name;
        previewLabel.textContent = `Equipación: ${kitName} • Balón: ${ballName}`;
      }
    },

    setCustomization: function (field, value) {
      this.profile.playerCustomization[field] = value;
      saveProfile(this.profile);
      this.renderLockerCustomization();
      this.applyCustomizationTo3DEntities();
    },

    // =========================================================================
    // CONSTRUCCIÓN DEL ESTADIO 3D Y JUGADORES ARTICULADOS (THREE.JS)
    // =========================================================================
    init3DStadiumIfNeeded: function () {
      if (this.renderer && this.scene && this.camera) {
        this.handleResize();
        this.applyCustomizationTo3DEntities();
        return;
      }
      if (typeof THREE === 'undefined') return;

      const mount = document.getElementById('soccer-canvas-mount');
      if (!mount) return;

      const w = Math.max(320, mount.clientWidth || window.innerWidth);
      const h = Math.max(320, mount.clientHeight || (window.innerHeight - 70));

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x040914);
      this.scene.fog = new THREE.FogExp2(0x040914, 0.0065);

      this.camera = new THREE.PerspectiveCamera(46, w / h, 0.5, 300);
      this.camera.position.set(0, 30, 42);
      this.camera.lookAt(0, 0, 0);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      if (THREE.ACESFilmicToneMapping !== undefined) {
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
      }
      if (THREE.SRGBColorSpace !== undefined) {
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      }
      this.renderer.shadowMap.enabled = false;

      mount.innerHTML = '';
      mount.appendChild(this.renderer.domElement);

      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2();
      this.clock = new THREE.Clock();

      // Iluminación de Estadio Nocturno Champions
      const hemi = new THREE.HemisphereLight(0xdbeafe, 0x064e3b, 0.95);
      this.scene.add(hemi);

      const floodPositions = [
        [-45, 38, -28],
        [45, 38, -28],
        [-45, 38, 28],
        [45, 38, 28]
      ];
      floodPositions.forEach((pos) => {
        const dir = new THREE.DirectionalLight(0xf8fafc, 0.55);
        dir.position.set(pos[0], pos[1], pos[2]);
        this.scene.add(dir);
      });

      this.buildStadiumGeometry();
      this.build15TacticalNodes();
      this.buildTeamsAndBall();

      this.renderer.domElement.addEventListener('pointerdown', (ev) => this.onCanvasPointerDown(ev));
      window.addEventListener('resize', () => this.handleResize());

      if (typeof this.renderer.compile === 'function') {
        try { this.renderer.compile(this.scene, this.camera); } catch (e) {}
      }
    },

    buildStadiumGeometry: function () {
      this.pitchGroup = new THREE.Group();
      this.scene.add(this.pitchGroup);

      // Césped con franjas de corte bicolor (10 franjas transversales)
      const pitchWidth = 84;
      const pitchDepth = 50;
      const stripeCount = 10;
      const stripeW = pitchWidth / stripeCount;

      for (let i = 0; i < stripeCount; i++) {
        const color = i % 2 === 0 ? 0x15803d : 0x166534;
        const stripeGeo = new THREE.PlaneGeometry(stripeW, pitchDepth);
        const stripeMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.85, metalness: 0.05 });
        const mesh = new THREE.Mesh(stripeGeo, stripeMat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(-pitchWidth / 2 + stripeW * (i + 0.5), 0, 0);
        this.pitchGroup.add(mesh);
      }

      // Contorno exterior del estadio (tartán oscuro)
      const surroundGeo = new THREE.PlaneGeometry(110, 74);
      const surroundMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
      const surround = new THREE.Mesh(surroundGeo, surroundMat);
      surround.rotation.x = -Math.PI / 2;
      surround.position.y = -0.04;
      this.pitchGroup.add(surround);

      // Líneas blancas reglamentarias
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
      const addLine = (w, d, x, z) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), lineMat);
        m.rotation.x = -Math.PI / 2;
        m.position.set(x, 0.02, z);
        this.pitchGroup.add(m);
      };

      // Líneas de banda y fondo
      addLine(pitchWidth, 0.35, 0, -pitchDepth / 2);
      addLine(pitchWidth, 0.35, 0, pitchDepth / 2);
      addLine(0.35, pitchDepth, -pitchWidth / 2, 0);
      addLine(0.35, pitchDepth, pitchWidth / 2, 0);
      // Línea de medio campo
      addLine(0.35, pitchDepth, 0, 0);

      // Círculo central
      const centerRing = new THREE.Mesh(new THREE.RingGeometry(6.8, 7.15, 48), lineMat);
      centerRing.rotation.x = -Math.PI / 2;
      centerRing.position.set(0, 0.02, 0);
      this.pitchGroup.add(centerRing);

      // Áreas grandes y chicas (Izquierda = -42, Derecha = +42)
      [-1, 1].forEach((dir) => {
        const edgeX = dir * (pitchWidth / 2);
        // Área grande (14x26)
        addLine(14, 0.3, edgeX - dir * 7, -13);
        addLine(14, 0.3, edgeX - dir * 7, 13);
        addLine(0.3, 26, edgeX - dir * 14, 0);
        // Área chica (5.5x12)
        addLine(5.5, 0.28, edgeX - dir * 2.75, -6);
        addLine(5.5, 0.28, edgeX - dir * 2.75, 6);
        addLine(0.28, 12, edgeX - dir * 5.5, 0);
        // Punto penal
        const spot = new THREE.Mesh(new THREE.CircleGeometry(0.42, 16), lineMat);
        spot.rotation.x = -Math.PI / 2;
        spot.position.set(edgeX - dir * 10, 0.025, 0);
        this.pitchGroup.add(spot);

        // Portería 3D con postes, travesaño y red
        const goalGroup = new THREE.Group();
        const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.6 });
        const goalZSpan = 8.4;
        const goalHeight = 3.6;
        const goalDepth = 2.4;

        const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, goalHeight, 12), postMat);
        leftPost.position.set(0, goalHeight / 2, -goalZSpan / 2);
        const rightPost = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, goalHeight, 12), postMat);
        rightPost.position.set(0, goalHeight / 2, goalZSpan / 2);
        const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, goalZSpan + 0.28, 12), postMat);
        crossbar.rotation.x = Math.PI / 2;
        crossbar.position.set(0, goalHeight, 0);

        const netMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, wireframe: true, transparent: true, opacity: 0.38 });
        const netBox = new THREE.Mesh(new THREE.BoxGeometry(goalDepth, goalHeight, goalZSpan), netMat);
        netBox.position.set(dir * (goalDepth / 2), goalHeight / 2, 0);

        goalGroup.add(leftPost, rightPost, crossbar, netBox);
        goalGroup.position.set(edgeX, 0, 0);
        this.pitchGroup.add(goalGroup);
      });

      // Banderines de córner
      const flagPoleMat = new THREE.MeshStandardMaterial({ color: 0xfef08a });
      const flagClothMat = new THREE.MeshStandardMaterial({ color: 0xef4444, side: THREE.DoubleSide });
      [
        [-pitchWidth / 2, -pitchDepth / 2],
        [-pitchWidth / 2, pitchDepth / 2],
        [pitchWidth / 2, -pitchDepth / 2],
        [pitchWidth / 2, pitchDepth / 2]
      ].forEach(([cx, cz]) => {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8), flagPoleMat);
        pole.position.set(cx, 0.9, cz);
        const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), flagClothMat);
        flag.position.set(cx + 0.3, 1.6, cz);
        this.pitchGroup.add(pole, flag);
      });

      // Gradas perimetrales y torres de iluminación LED
      const standMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.75 });
      const northStand = new THREE.Mesh(new THREE.BoxGeometry(96, 8, 8), standMat);
      northStand.position.set(0, 4, -34);
      const southStand = new THREE.Mesh(new THREE.BoxGeometry(96, 8, 8), standMat);
      southStand.position.set(0, 4, 34);
      const westStand = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 64), standMat);
      westStand.position.set(-51, 4, 0);
      const eastStand = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 64), standMat);
      eastStand.position.set(51, 4, 0);
      this.pitchGroup.add(northStand, southStand, westStand, eastStand);

      // Paneles LED publicitarios
      const adMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0369a1,
        emissiveIntensity: 0.55,
        roughness: 0.3
      });
      const northAd = new THREE.Mesh(new THREE.BoxGeometry(86, 1.1, 0.3), adMat);
      northAd.position.set(0, 0.55, -27.2);
      this.pitchGroup.add(northAd);
    },

    build15TacticalNodes: function () {
      this.nodesMap = {};
      this.interactiveMeshes = [];
      const zones = ['-2', '-1', '0', '1', '2'];
      const lanes = ['left', 'center', 'right'];

      zones.forEach((zKey) => {
        lanes.forEach((lKey) => {
          const x = TACTICAL_ZONES_META[zKey].x;
          const z = TACTICAL_LANES_META[lKey].z;
          const nodeGroup = new THREE.Group();
          nodeGroup.position.set(x, 0.05, z);

          const outerRing = new THREE.Mesh(
            new THREE.RingGeometry(1.7, 2.25, 32),
            new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.25 })
          );
          outerRing.rotation.x = -Math.PI / 2;

          const innerDisc = new THREE.Mesh(
            new THREE.CircleGeometry(1.65, 28),
            new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide, transparent: true, opacity: 0.12 })
          );
          innerDisc.rotation.x = -Math.PI / 2;

          nodeGroup.add(outerRing, innerDisc);
          nodeGroup.userData = {
            isTacticalNode: true,
            zone: Number(zKey),
            lane: lKey,
            outerRing: outerRing,
            innerDisc: innerDisc
          };
          outerRing.userData = nodeGroup.userData;
          innerDisc.userData = nodeGroup.userData;

          this.pitchGroup.add(nodeGroup);
          this.nodesMap[`${zKey}_${lKey}`] = nodeGroup;
          this.interactiveMeshes.push(outerRing, innerDisc);
        });
      });
    },

    createArticulatedPlayer: function (team, roleIndex) {
      const group = new THREE.Group();
      const isHome = team === 'home';
      const isGK = roleIndex === 0;

      const kit = KIT_PRESETS[this.profile.playerCustomization.kitId] || KIT_PRESETS.classic_blue;
      const boots = BOOTS_PRESETS[this.profile.playerCustomization.bootsId] || BOOTS_PRESETS.standard;

      const jerseyColor = isGK
        ? (isHome ? 0xf59e0b : 0x10b981)
        : (isHome ? kit.primary : 0xdc2626);
      const shortsColor = isHome ? kit.shorts : 0x111827;
      const bootColor = isHome ? boots.color : 0x1f2937;

      const skinMat = new THREE.MeshStandardMaterial({ color: 0xf1c27d, roughness: 0.6 });
      const jerseyMat = new THREE.MeshStandardMaterial({ color: jerseyColor, roughness: 0.5 });
      const shortsMat = new THREE.MeshStandardMaterial({ color: shortsColor, roughness: 0.65 });
      const bootMat = new THREE.MeshStandardMaterial({ color: bootColor, roughness: 0.35, metalness: 0.25 });

      // Sombra de contacto en césped
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.95, 20),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.38 })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.02;
      group.add(shadow);

      // Torso (camiseta)
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.25, 0.52), jerseyMat);
      torso.position.y = 1.65;
      group.add(torso);

      // Short
      const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.5, 0.5), shortsMat);
      shorts.position.y = 0.95;
      group.add(shorts);

      // Cabeza + Cabello
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 18), skinMat);
      head.position.y = 2.58;
      const hair = new THREE.Mesh(
        new THREE.SphereGeometry(0.39, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
        new THREE.MeshStandardMaterial({ color: 0x1e1b18, roughness: 0.8 })
      );
      hair.position.y = 2.62;
      group.add(head, hair);

      // Brazos (con guantes si es portero)
      const armMat = isGK
        ? new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
        : skinMat;
      const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.95, 10), armMat);
      leftArm.position.set(-0.62, 1.6, 0);
      const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.95, 10), armMat);
      rightArm.position.set(0.62, 1.6, 0);
      group.add(leftArm, rightArm);

      // Piernas + Botines
      const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.78, 10), skinMat);
      leftLeg.position.set(-0.24, 0.48, 0);
      const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.78, 10), skinMat);
      rightLeg.position.set(0.24, 0.48, 0);

      const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.48), bootMat);
      leftBoot.position.set(-0.24, 0.09, 0.08);
      const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.48), bootMat);
      rightBoot.position.set(0.24, 0.09, 0.08);
      group.add(leftLeg, rightLeg, leftBoot, rightBoot);

      group.userData = {
        team: team,
        roleIndex: roleIndex,
        isGK: isGK,
        torsoMesh: torso,
        shortsMesh: shorts,
        leftBootMesh: leftBoot,
        rightBootMesh: rightBoot,
        leftLegMesh: leftLeg,
        rightLegMesh: rightLeg,
        targetPos: new THREE.Vector3(),
        diveAnim: 0
      };

      return group;
    },

    buildTeamsAndBall: function () {
      this.homePlayers = [];
      this.awayPlayers = [];

      for (let i = 0; i < 5; i++) {
        const hp = this.createArticulatedPlayer('home', i);
        this.scene.add(hp);
        this.homePlayers.push(hp);

        const ap = this.createArticulatedPlayer('away', i);
        this.scene.add(ap);
        this.awayPlayers.push(ap);
      }

      // Balón 3D con paneles
      const ballPreset = BALL_PRESETS[this.profile.playerCustomization.ballId] || BALL_PRESETS.pro_white;
      const ballGeo = new THREE.IcosahedronGeometry(0.48, 2);
      const ballMat = new THREE.MeshStandardMaterial({
        color: ballPreset.color,
        roughness: 0.3,
        metalness: 0.15
      });
      this.ballMesh = new THREE.Mesh(ballGeo, ballMat);
      this.ballMesh.position.set(0, 0.48, 0);
      this.scene.add(this.ballMesh);

      this.positionPlayersForTacticalState(true);
    },

    applyCustomizationTo3DEntities: function () {
      if (!this.homePlayers || !this.homePlayers.length) return;
      const kit = KIT_PRESETS[this.profile.playerCustomization.kitId] || KIT_PRESETS.classic_blue;
      const boots = BOOTS_PRESETS[this.profile.playerCustomization.bootsId] || BOOTS_PRESETS.standard;
      const ballPreset = BALL_PRESETS[this.profile.playerCustomization.ballId] || BALL_PRESETS.pro_white;

      this.homePlayers.forEach((p, idx) => {
        if (idx > 0 && p.userData.torsoMesh) {
          p.userData.torsoMesh.material.color.setHex(kit.primary);
        }
        if (p.userData.shortsMesh) {
          p.userData.shortsMesh.material.color.setHex(kit.shorts);
        }
        if (p.userData.leftBootMesh && p.userData.rightBootMesh) {
          p.userData.leftBootMesh.material.color.setHex(boots.color);
          p.userData.rightBootMesh.material.color.setHex(boots.color);
        }
      });

      if (this.ballMesh) {
        this.ballMesh.material.color.setHex(ballPreset.color);
      }
    },

    // =========================================================================
    // POSICIONAMIENTO DINÁMICO 5v5 Y FLECHAS CURVAS (CatmullRomCurve3)
    // =========================================================================
    positionPlayersForTacticalState: function (instant) {
      const bz = this.match.ballZone;
      const bl = this.match.ballLane;
      const ballX = (TACTICAL_ZONES_META[String(bz)] || TACTICAL_ZONES_META['0']).x;
      const ballZ = (TACTICAL_LANES_META[bl] || TACTICAL_LANES_META.center).z;

      // Home Team (ataca de izquierda -42 hacia derecha +42)
      const homeCoords = [
        new THREE.Vector3(-39.5, 0, 0), // GK
        new THREE.Vector3(Math.max(-34, ballX - 12), 0, -13), // Def / Wing Left
        new THREE.Vector3(Math.max(-34, ballX - 10), 0, 11),  // Def / Wing Right
        new THREE.Vector3(ballX, 0, ballZ),                   // Portador o mediocentro activo
        new THREE.Vector3(Math.min(34, ballX + 15), 0, bl === 'left' ? 12 : -12) // Delantero desmarcándose
      ];

      // Away Team (defiende portería derecha +42 y ataca hacia -42)
      const awayCoords = [
        new THREE.Vector3(39.5, 0, 0), // GK
        new THREE.Vector3(Math.min(35, ballX + 8), 0, -12),
        new THREE.Vector3(Math.min(35, ballX + 6), 0, 0),
        new THREE.Vector3(Math.min(35, ballX + 8), 0, 12),
        new THREE.Vector3(Math.max(-32, ballX - 6), 0, bl === 'right' ? -10 : 10)
      ];

      if (this.match.possession === 'away') {
        // El rival porta el balón en (ballX, ballZ)
        awayCoords[2].set(ballX, 0, ballZ);
        homeCoords[3].set(Math.max(-35, ballX - 4.5), 0, ballZ * 0.85);
      }

      this.homePlayers.forEach((p, i) => {
        p.userData.targetPos.copy(homeCoords[i]);
        if (instant) p.position.copy(homeCoords[i]);
      });

      this.awayPlayers.forEach((p, i) => {
        p.userData.targetPos.copy(awayCoords[i]);
        if (instant) p.position.copy(awayCoords[i]);
      });

      if (instant && this.ballMesh) {
        this.ballMesh.position.set(ballX, 0.48, ballZ);
      }

      // Cámara dinámica enfocando la zona de acción
      this.cameraTargetPos.x = ballX * 0.55;
      this.cameraTargetPos.y = 26;
      this.cameraTargetPos.z = 36 + ballZ * 0.25;
      this.cameraLookAtPos.x = ballX * 0.75;
      this.cameraLookAtPos.y = 0.8;
      this.cameraLookAtPos.z = ballZ * 0.4;
    },

    drawTacticalCurveArrow: function (startVec, endVec, colorHex) {
      if (!this.scene) return;
      if (this.tacticalArrowMesh) {
        this.scene.remove(this.tacticalArrowMesh);
        if (this.tacticalArrowMesh.geometry) this.tacticalArrowMesh.geometry.dispose();
        if (this.tacticalArrowMesh.material) this.tacticalArrowMesh.material.dispose();
        this.tacticalArrowMesh = null;
      }

      const mid = startVec.clone().lerp(endVec, 0.5);
      mid.y = 2.6;
      mid.z += (endVec.z - startVec.z) * 0.18;

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startVec.x, 0.35, startVec.z),
        mid,
        new THREE.Vector3(endVec.x, 0.45, endVec.z)
      ]);

      const tubeGeo = new THREE.TubeGeometry(curve, 28, 0.18, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: colorHex || 0xfbbf24,
        transparent: true,
        opacity: 0.88
      });
      this.tacticalArrowMesh = new THREE.Mesh(tubeGeo, tubeMat);
      this.scene.add(this.tacticalArrowMesh);
    },

    // =========================================================================
    // FLUJO DE PARTIDO, OPCIONES TÁCTICAS Y RETO DE INGLÉS (8 SEGUNDOS)
    // =========================================================================
    startMatch: function (mode) {
      this.match.mode = mode || '1p_ai';
      this.match.active = true;
      this.match.homeScore = 0;
      this.match.awayScore = 0;
      this.match.playsElapsed = 0;
      this.match.maxPlays = 10;
      this.match.possession = 'home';
      this.match.ballZone = 0;
      this.match.ballLane = 'center';
      this.match.matchCorrectAnswers = 0;
      this.match.matchTotalQuestions = 0;

      const postModal = document.getElementById('soccer-postmatch-modal');
      if (postModal) postModal.style.display = 'none';
      const quizModal = document.getElementById('soccer-quiz-modal');
      if (quizModal) quizModal.style.display = 'none';

      this.switchTab('match');
      this.init3DStadiumIfNeeded();
      this.positionPlayersForTacticalState(true);
      this.updateScoreboardHUD();
      this.prepareNextTacticalPlay();
    },

    updateScoreboardHUD: function () {
      const scoreEl = document.getElementById('soccerTvScore');
      const awayLabel = document.getElementById('soccerTvAwayLabel');
      const clockEl = document.getElementById('soccerTvClock');
      const zoneBadge = document.getElementById('soccerZoneBadge');

      if (scoreEl) scoreEl.textContent = `${this.match.homeScore} - ${this.match.awayScore}`;
      if (awayLabel) {
        awayLabel.textContent = this.match.mode === '2p_local' ? '🔴 PLAYER 2' : `🔴 AI (DIV ${this.profile.division})`;
      }
      const simMinute = Math.min(90, this.match.playsElapsed * 9);
      if (clockEl) {
        clockEl.textContent = `${String(simMinute).padStart(2, '0')}' (Jugada ${Math.min(this.match.maxPlays, this.match.playsElapsed + 1)}/${this.match.maxPlays})`;
      }
      if (zoneBadge) {
        const zm = TACTICAL_ZONES_META[String(this.match.ballZone)] || TACTICAL_ZONES_META['0'];
        zoneBadge.textContent = zm.nameEn;
      }
    },

    prepareNextTacticalPlay: function () {
      if (!this.match.active) return;

      // Verificar fin de partido (2 goles o 10 jugadas = 90')
      if (this.match.homeScore >= 2 || this.match.awayScore >= 2 || this.match.playsElapsed >= this.match.maxPlays) {
        this.finishMatch();
        return;
      }

      this.updateScoreboardHUD();
      this.positionPlayersForTacticalState(false);

      // Si el rival tiene el balón en modo 1P vs IA, lanzar Fase Defensiva Interactiva
      if (this.match.possession === 'away' && this.match.mode === '1p_ai') {
        this.prepareDefensivePhase();
        return;
      }

      // Calcular las 3 opciones tácticas hacia adelante (máx +1 zona por jugada)
      const curZone = this.match.ballZone;
      const dir = this.match.possession === 'home' ? 1 : -1;
      const nextZone = Math.max(-2, Math.min(2, curZone + dir));
      const inShootingRange = (this.match.possession === 'home' && curZone >= 1) ||
                              (this.match.possession === 'away' && curZone <= -1);

      const options = [
        {
          id: 'opt_short',
          type: 'pass',
          zone: nextZone,
          lane: 'center',
          titleEn: 'Option A: Short Pass (Center)',
          titleEs: 'Pase Corto Seguro por el Centro',
          vocabCategory: 'pass'
        },
        {
          id: 'opt_wing',
          type: 'through',
          zone: nextZone,
          lane: this.match.ballLane === 'left' ? 'right' : 'left',
          titleEn: 'Option B: Through Ball / Cross to Wing',
          titleEs: 'Pase Filtrado / Cambio de Banda',
          vocabCategory: 'pass'
        }
      ];

      if (inShootingRange) {
        options.push({
          id: 'opt_shoot',
          type: 'shot',
          zone: this.match.possession === 'home' ? 2 : -2,
          lane: 'center',
          titleEn: 'Option C: Curled Shot / Top Corner! 🥅',
          titleEs: '¡Disparo a Portería (Top Bins)!',
          vocabCategory: 'shot'
        });
      } else {
        options.push({
          id: 'opt_dribble',
          type: 'dribble',
          zone: nextZone,
          lane: this.match.ballLane,
          titleEn: 'Option C: Dribble Past Defender',
          titleEs: 'Conducir y Regatear en tu Carril',
          vocabCategory: 'dribble'
        });
      }

      this.match.currentOptions = options;
      this.highlightValidTacticalNodes(options);
      this.renderTacticalOptionButtons(options);
    },

    highlightValidTacticalNodes: function (options) {
      Object.keys(this.nodesMap).forEach((key) => {
        const node = this.nodesMap[key];
        node.userData.isSelectableOption = null;
        node.userData.outerRing.material.color.setHex(0x10b981);
        node.userData.outerRing.material.opacity = 0.16;
        node.userData.innerDisc.material.opacity = 0.06;
      });

      options.forEach((opt) => {
        const key = `${opt.zone}_${opt.lane}`;
        const node = this.nodesMap[key];
        if (node) {
          node.userData.isSelectableOption = opt;
          const color = opt.type === 'shot' ? 0xfbbf24 : 0x38bdf8;
          node.userData.outerRing.material.color.setHex(color);
          node.userData.outerRing.material.opacity = 0.92;
          node.userData.innerDisc.material.color.setHex(color);
          node.userData.innerDisc.material.opacity = 0.35;
        }
      });
    },

    renderTacticalOptionButtons: function (options) {
      const promptEl = document.getElementById('soccerPossessionPrompt');
      const btnContainer = document.getElementById('soccerNodeButtons');
      if (promptEl) {
        const actor = this.match.possession === 'home' ? '🔵 TU POSESIÓN' : '🔴 POSESIÓN JUGADOR 2';
        promptEl.textContent = `${actor}: Toca un nodo iluminado en la cancha 3D o selecciona tu jugada:`;
      }
      if (!btnContainer) return;

      btnContainer.innerHTML = options.map((opt, idx) => {
        const shootClass = opt.type === 'shot' ? 'shoot' : '';
        return `
          <button type="button" class="soccer-node-btn ${shootClass}" onclick="window.SoccerTactics3D.selectTacticalOption(${idx})">
            <span>${opt.titleEn}</span>
            <span style="font-size:11px;color:#94a3b8;font-weight:700;">${opt.titleEs}</span>
          </button>
        `;
      }).join('');
    },

    selectTacticalOption: function (optionIndex) {
      const opt = this.match.currentOptions[optionIndex];
      if (!opt) return;
      this.match.selectedOption = opt;

      // Dibujar curva táctica 3D (CatmullRomCurve3) hacia el nodo objetivo o ángulo de portería
      const startVec = this.ballMesh ? this.ballMesh.position.clone() : new THREE.Vector3(0, 0.5, 0);
      let targetVec;
      if (opt.type === 'shot') {
        const goalX = this.match.possession === 'home' ? 41.5 : -41.5;
        targetVec = new THREE.Vector3(goalX, 2.5, 3.1);
      } else {
        const x = (TACTICAL_ZONES_META[String(opt.zone)] || TACTICAL_ZONES_META['0']).x;
        const z = (TACTICAL_LANES_META[opt.lane] || TACTICAL_LANES_META.center).z;
        targetVec = new THREE.Vector3(x, 0.48, z);
      }
      this.drawTacticalCurveArrow(startVec, targetVec, opt.type === 'shot' ? 0xfbbf24 : 0x38bdf8);

      // Abrir reto de inglés de 8 segundos
      this.launchTacticalQuiz(false, opt);
    },

    prepareDefensivePhase: function () {
      const promptEl = document.getElementById('soccerPossessionPrompt');
      const btnContainer = document.getElementById('soccerNodeButtons');
      if (promptEl) {
        promptEl.textContent = '🛡️ ¡CONTRAATAQUE RIVAL! Responde rápido para cortar el avance o atajar el disparo:';
      }
      if (btnContainer) {
        btnContainer.innerHTML = `
          <button type="button" class="soccer-node-btn shoot" onclick="window.SoccerTactics3D.launchTacticalQuiz(true, null)">
            <span>🛡️ Press &amp; Intercept Now! (Defender / Atajar)</span>
            <span style="font-size:11px;color:#fca5a5;font-weight:700;">Ejecutar Barrida Defensiva o Atajada del Portero</span>
          </button>
        `;
      }
      // Lanzar automáticamente el reto defensivo tras una breve transición visual
      setTimeout(() => {
        if (this.match.active && this.match.possession === 'away' && this.match.mode === '1p_ai') {
          this.launchTacticalQuiz(true, null);
        }
      }, 650);
    },

    pickQuestionForContext: function (isDefense, option) {
      const div = this.profile.division;
      let allowedLevels = ['basic', 'intermediate', 'advanced'];
      if (div >= 8) allowedLevels = ['basic', 'intermediate'];
      else if (div <= 3) allowedLevels = ['intermediate', 'advanced'];

      let pool = SOCCER_VOCABULARY_BANK.filter((item) => allowedLevels.includes(item.level));
      if (isDefense) {
        const defPool = pool.filter((item) => item.category === 'defense' || item.category === 'rule');
        if (defPool.length >= 4) pool = defPool;
      } else if (option && option.vocabCategory) {
        const catPool = pool.filter((item) => item.category === option.vocabCategory);
        if (catPool.length >= 4) pool = catPool;
      }

      const target = pool[Math.floor(Math.random() * pool.length)] || SOCCER_VOCABULARY_BANK[0];
      const distractors = SOCCER_VOCABULARY_BANK
        .filter((item) => item.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      // Dirección bidireccional aleatoria: 'ES_TO_EN' o 'EN_TO_ES'
      const direction = Math.random() < 0.5 ? 'ES_TO_EN' : 'EN_TO_ES';
      const choices = [target, distractors[0], distractors[1]].sort(() => Math.random() - 0.5);

      return {
        target: target,
        direction: direction,
        choices: choices,
        isDefense: Boolean(isDefense)
      };
    },

    speakEnglishTerm: function (text) {
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'en-US';
          u.rate = 0.98;
          window.speechSynthesis.speak(u);
        }
      } catch (e) {}
    },

    launchTacticalQuiz: function (isDefense, option) {
      this.clearQuizTimer();
      const quiz = this.pickQuestionForContext(isDefense, option);
      this.match.currentQuiz = quiz;
      this.match.quizStartTime = performance.now();
      this.match.quizTimeLeft = 8.0;

      const modal = document.getElementById('soccer-quiz-modal');
      const card = document.getElementById('soccerQuizCard');
      const badge = document.getElementById('soccerQuizBadge');
      const dirEl = document.getElementById('soccerQuizDirection');
      const mainEl = document.getElementById('soccerQuizPromptMain');
      const optsEl = document.getElementById('soccerQuizOptions');
      const timerTxt = document.getElementById('soccerQuizTimerText');
      const timerFill = document.getElementById('soccerQuizTimerFill');

      if (!modal || !mainEl || !optsEl) return;

      if (card) card.classList.toggle('defense-mode', isDefense);
      if (badge) {
        badge.textContent = isDefense
          ? (this.match.ballZone <= -1 ? '🧤 ¡ATAJADA DEL PORTERO! / GOALKEEPER SAVE!' : '🛡️ ¡CORTA EL PASE! / INTERCEPT THE PASS!')
          : (option && option.type === 'shot' ? '🔥 DEFINICIÓN A PORTERÍA (<3.5s = TOP BINS!)' : '⚡ EJECUCIÓN TÁCTICA EN TIEMPO REAL');
      }

      if (quiz.direction === 'ES_TO_EN') {
        if (dirEl) dirEl.textContent = 'ESPAÑOL ➔ INGLÉS: ELIGE EL TÉRMINO FUTBOLÍSTICO CORRECTO';
        mainEl.textContent = `"${quiz.target.es}"`;
      } else {
        if (dirEl) dirEl.textContent = '🔊 INGLÉS ➔ ESPAÑOL: IDENTIFICA LA JUGADA EN LA CANCHA';
        mainEl.textContent = `"${quiz.target.en}"`;
        this.speakEnglishTerm(quiz.target.en);
      }

      optsEl.innerHTML = quiz.choices.map((c, idx) => {
        const label = quiz.direction === 'ES_TO_EN' ? c.en : c.es;
        return `
          <button type="button" class="soccer-quiz-opt-btn" onclick="window.SoccerTactics3D.submitQuizAnswer('${c.id}')">
            ${idx + 1}. ${label}
          </button>
        `;
      }).join('');

      if (timerTxt) timerTxt.textContent = '8.0s';
      if (timerFill) timerFill.style.width = '100%';
      modal.style.display = 'flex';

      this.match.quizTimerInterval = setInterval(() => {
        const elapsed = (performance.now() - this.match.quizStartTime) / 1000;
        const remain = Math.max(0, 8.0 - elapsed);
        this.match.quizTimeLeft = remain;
        if (timerTxt) timerTxt.textContent = remain.toFixed(1) + 's';
        if (timerFill) timerFill.style.width = Math.round((remain / 8.0) * 100) + '%';
        if (remain <= 0) {
          this.clearQuizTimer();
          this.resolveQuizOutcome(false, 8.0);
        }
      }, 80);
    },

    clearQuizTimer: function () {
      if (this.match.quizTimerInterval) {
        clearInterval(this.match.quizTimerInterval);
        this.match.quizTimerInterval = null;
      }
    },

    submitQuizAnswer: function (choiceId) {
      if (!this.match.currentQuiz) return;
      const elapsed = (performance.now() - this.match.quizStartTime) / 1000;
      this.clearQuizTimer();
      const isCorrect = choiceId === this.match.currentQuiz.target.id;
      this.speakEnglishTerm(this.match.currentQuiz.target.en);
      this.resolveQuizOutcome(isCorrect, elapsed);
    },

    resolveQuizOutcome: function (isCorrect, responseSeconds) {
      const modal = document.getElementById('soccer-quiz-modal');
      if (modal) modal.style.display = 'none';

      this.match.playsElapsed += 1;
      this.match.matchTotalQuestions += 1;
      this.profile.questionsAnswered += 1;
      if (isCorrect) {
        this.match.matchCorrectAnswers += 1;
        this.profile.questionsCorrect += 1;
      }
      saveProfile(this.profile);

      const quiz = this.match.currentQuiz;
      this.match.currentQuiz = null;

      if (quiz && quiz.isDefense) {
        // Resolución de Fase Defensiva
        if (isCorrect) {
          this.showEventBanner('🛡️ INTERCEPTED! ¡Recuperas la posesión!', '#10b981');
          this.triggerGoalkeeperOrDefenderAnimation('home');
          this.match.possession = 'home';
        } else {
          // El rival avanza o anota si está en zona de tiro
          if (this.match.ballZone <= -1) {
            this.match.awayScore += 1;
            this.profile.goalsConceded += 1;
            this.animateBallToGoal('away');
            this.showEventBanner('⚽ RIVAL GOAL! El rival definió frente al arco', '#ef4444');
            this.match.ballZone = 0;
            this.match.ballLane = 'center';
            this.match.possession = 'home';
          } else {
            this.match.ballZone = Math.max(-2, this.match.ballZone - 1);
            this.showEventBanner('⚠️ ¡El rival supera tu línea y avanza!', '#f59e0b');
          }
        }
      } else {
        // Resolución de Fase Ofensiva
        const opt = this.match.selectedOption || { type: 'pass', zone: 0, lane: 'center' };
        if (isCorrect) {
          if (opt.type === 'shot') {
            const isTopBins = responseSeconds < 3.5;
            this.animateBallToGoal(this.match.possession);
            if (this.match.possession === 'home') {
              this.match.homeScore += 1;
              this.profile.goalsScored += 1;
            } else {
              this.match.awayScore += 1;
            }
            this.showEventBanner(
              isTopBins ? '🔥 GOLAZO IMPARABLE! TOP BINS! (<3.5s)' : '⚽ GOAL! ¡Definición al fondo de la red!',
              '#fbbf24'
            );
            this.match.ballZone = 0;
            this.match.ballLane = 'center';
            this.match.possession = this.match.possession === 'home' ? 'away' : 'home';
          } else {
            this.animateBallPassToNode(opt.zone, opt.lane);
            this.match.ballZone = opt.zone;
            this.match.ballLane = opt.lane;
            this.showEventBanner(`✅ ${quiz.target.en}! Avanzas a ${TACTICAL_ZONES_META[String(opt.zone)].nameEn}`, '#38bdf8');
          }
        } else {
          // Fallo o Timeout (Turnover)
          this.showEventBanner('❌ TURNOVER! Mal pase, el rival intercepta el balón', '#ef4444');
          this.match.possession = this.match.possession === 'home' ? 'away' : 'home';
        }
      }

      saveProfile(this.profile);
      this.updateScoreboardHUD();

      setTimeout(() => {
        this.prepareNextTacticalPlay();
      }, 1150);
    },

    animateBallPassToNode: function (zone, lane) {
      if (!this.ballMesh) return;
      const targetX = (TACTICAL_ZONES_META[String(zone)] || TACTICAL_ZONES_META['0']).x;
      const targetZ = (TACTICAL_LANES_META[lane] || TACTICAL_LANES_META.center).z;
      const start = this.ballMesh.position.clone();
      const end = new THREE.Vector3(targetX, 0.48, targetZ);
      const mid = start.clone().lerp(end, 0.5);
      mid.y = 3.2;

      this.ballAnim = {
        curve: new THREE.CatmullRomCurve3([start, mid, end]),
        startTime: performance.now(),
        duration: 680
      };
    },

    animateBallToGoal: function (scoringSide) {
      if (!this.ballMesh) return;
      const goalX = scoringSide === 'home' ? 41.6 : -41.6;
      const start = this.ballMesh.position.clone();
      const end = new THREE.Vector3(goalX, 2.75, (Math.random() > 0.5 ? 1 : -1) * 3.1);
      const mid = start.clone().lerp(end, 0.55);
      mid.y = 4.2;

      this.ballAnim = {
        curve: new THREE.CatmullRomCurve3([start, mid, end]),
        startTime: performance.now(),
        duration: 750
      };

      // Estirada del portero rival
      this.triggerGoalkeeperOrDefenderAnimation(scoringSide === 'home' ? 'away' : 'home');
    },

    triggerGoalkeeperOrDefenderAnimation: function (side) {
      const gk = side === 'home' ? this.homePlayers[0] : this.awayPlayers[0];
      if (gk) {
        gk.userData.diveAnim = 1.0;
      }
    },

    showEventBanner: function (msg, borderColor) {
      const banner = document.getElementById('soccer-event-banner');
      if (!banner) return;
      banner.textContent = msg;
      banner.style.borderColor = borderColor || '#fbbf24';
      banner.style.display = 'block';
      clearTimeout(this._bannerTimeout);
      this._bannerTimeout = setTimeout(() => {
        banner.style.display = 'none';
      }, 2200);
    },

    finishMatch: function () {
      this.match.active = false;
      this.clearQuizTimer();

      const hs = this.match.homeScore;
      const as = this.match.awayScore;
      const acc = this.match.matchTotalQuestions > 0
        ? Math.round((this.match.matchCorrectAnswers / this.match.matchTotalQuestions) * 100)
        : 100;

      this.profile.matchesPlayed += 1;
      let rpDelta = 0;
      let resultTitle = 'EMPATE TÁCTICO';
      let resultIcon = '🤝';

      if (hs > as) {
        this.profile.wins += 1;
        this.profile.currentStreak += 1;
        this.profile.bestStreak = Math.max(this.profile.bestStreak, this.profile.currentStreak);
        const accBonus = acc >= 80 ? 8 : (acc >= 60 ? 4 : 0);
        const streakBonus = Math.min(7, this.profile.currentStreak * 2);
        rpDelta = Math.min(45, 30 + accBonus + streakBonus);
        resultTitle = '¡VICTORIA EN DIVISION RIVALS!';
        resultIcon = '🏆';
      } else if (hs < as) {
        this.profile.losses += 1;
        this.profile.currentStreak = 0;
        rpDelta = -15;
        resultTitle = 'DERROTA TÁCTICA';
        resultIcon = '⚡';
      } else {
        this.profile.draws += 1;
        rpDelta = 5;
      }

      this.profile.rp = Math.max(0, this.profile.rp + rpDelta);
      const newTier = computeDivisionFromRP(this.profile.rp);
      this.profile.division = newTier.div;
      saveProfile(this.profile);

      const postModal = document.getElementById('soccer-postmatch-modal');
      const iconEl = document.getElementById('soccerPostResultIcon');
      const titleEl = document.getElementById('soccerPostTitle');
      const scoreEl = document.getElementById('soccerPostScore');
      const rpEl = document.getElementById('soccerPostRpDelta');
      const statsEl = document.getElementById('soccerPostStats');

      if (iconEl) iconEl.textContent = resultIcon;
      if (titleEl) titleEl.textContent = resultTitle;
      if (scoreEl) scoreEl.textContent = `MARCADOR FINAL: ${hs} - ${as}`;
      if (rpEl) {
        const sign = rpDelta >= 0 ? '+' : '';
        rpEl.textContent = `${sign}${rpDelta} RP • División ${newTier.div} (${newTier.title}) • Total: ${this.profile.rp} RP`;
        rpEl.style.color = rpDelta >= 0 ? '#34d399' : '#f87171';
      }
      if (statsEl) {
        statsEl.innerHTML = `Precisión de Inglés en el Partido: <strong>${acc}%</strong> (${this.match.matchCorrectAnswers}/${this.match.matchTotalQuestions})<br>Racha de Victorias: <strong>🔥 ${this.profile.currentStreak}</strong>`;
      }
      if (postModal) postModal.style.display = 'flex';
    },

    onCanvasPointerDown: function (ev) {
      if (!this.renderer || !this.camera || !this.match.active) return;
      const modal = document.getElementById('soccer-quiz-modal');
      if (modal && modal.style.display === 'flex') return;

      const rect = this.renderer.domElement.getBoundingClientRect();
      this.pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hits = this.raycaster.intersectObjects(this.interactiveMeshes, false);
      if (hits.length > 0) {
        const data = hits[0].object.userData;
        if (data && data.isSelectableOption) {
          const idx = this.match.currentOptions.indexOf(data.isSelectableOption);
          if (idx !== -1) {
            this.selectTacticalOption(idx);
          }
        }
      }
    },

    handleResize: function () {
      if (!this.renderer || !this.camera) return;
      const mount = document.getElementById('soccer-canvas-mount');
      if (!mount) return;
      const w = Math.max(320, mount.clientWidth || window.innerWidth);
      const h = Math.max(320, mount.clientHeight || (window.innerHeight - 70));
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    },

    // =========================================================================
    // LOOP DE RENDERIZADO WEBGL A 60 FPS + PAUSE / RESUME
    // =========================================================================
    resumeLoop: function () {
      if (this.isRunning) return;
      this.isRunning = true;
      const tick = () => {
        if (!this.isRunning) return;
        this.rafId = requestAnimationFrame(tick);
        this.updateFrame();
      };
      this.rafId = requestAnimationFrame(tick);
    },

    pauseLoop: function () {
      this.isRunning = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.clearQuizTimer();
    },

    updateFrame: function () {
      if (!this.renderer || !this.scene || !this.camera) return;
      const now = performance.now();

      // Animación suave de trayectoria curva del balón (CatmullRomCurve3)
      if (this.ballAnim && this.ballMesh) {
        const t = Math.min(1, (now - this.ballAnim.startTime) / this.ballAnim.duration);
        const pos = this.ballAnim.curve.getPoint(t);
        this.ballMesh.position.copy(pos);
        this.ballMesh.rotation.x += 0.28;
        this.ballMesh.rotation.z += 0.22;
        if (t >= 1) {
          this.ballAnim = null;
        }
      }

      // Lerp fluido de los 10 jugadores en cancha + animación de piernas y portero
      const allPlayers = this.homePlayers.concat(this.awayPlayers);
      allPlayers.forEach((p, idx) => {
        p.position.lerp(p.userData.targetPos, 0.08);
        const dist = p.position.distanceTo(p.userData.targetPos);
        if (dist > 0.25 && p.userData.leftLegMesh && p.userData.rightLegMesh) {
          const swing = Math.sin(now * 0.014 + idx) * 0.45;
          p.userData.leftLegMesh.rotation.x = swing;
          p.userData.rightLegMesh.rotation.x = -swing;
        } else if (p.userData.leftLegMesh && p.userData.rightLegMesh) {
          p.userData.leftLegMesh.rotation.x = 0;
          p.userData.rightLegMesh.rotation.x = 0;
        }

        if (p.userData.diveAnim > 0) {
          p.userData.diveAnim = Math.max(0, p.userData.diveAnim - 0.03);
          p.rotation.z = Math.sin(p.userData.diveAnim * Math.PI) * 1.1;
        } else {
          p.rotation.z = 0;
        }
      });

      // Pulso visual en anillos tácticos activos
      const pulse = 1 + Math.sin(now * 0.006) * 0.07;
      Object.keys(this.nodesMap).forEach((key) => {
        const n = this.nodesMap[key];
        if (n.userData.isSelectableOption) {
          n.scale.set(pulse, 1, pulse);
        } else {
          n.scale.set(1, 1, 1);
        }
      });

      // Seguimiento cinematográfico de cámara
      this.camera.position.x += (this.cameraTargetPos.x - this.camera.position.x) * 0.06;
      this.camera.position.y += (this.cameraTargetPos.y - this.camera.position.y) * 0.06;
      this.camera.position.z += (this.cameraTargetPos.z - this.camera.position.z) * 0.06;
      this.camera.lookAt(this.cameraLookAtPos.x, this.cameraLookAtPos.y, this.cameraLookAtPos.z);

      this.renderer.render(this.scene, this.camera);
    }
  };

  window.SoccerTactics3D = SoccerTactics3D;
  window.openSoccerTacticsPortal = function () {
    SoccerTactics3D.openPortal();
  };
})();

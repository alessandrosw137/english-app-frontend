/**
 * MASTERGOAL 3D: TACTICAL SOCCER ENGINE
 * WebGL Three.js 60FPS Tactical Football Simulator + Real-Time English Speed Duel
 */
(function () {
  'use strict';

  const PROFILE_STORAGE_KEY = 'mastergoal_profile_v3';

  // Purgar claves antiguas con datos pre-cargados falsos (120 RP / Div 9 / 100%)
  try {
    localStorage.removeItem('mastereng_soccer_profile');
    localStorage.removeItem('mastergoal_stats_v2');
  } catch (e) {}

  // =========================================================================
  // BANCO DE VOCABULARIO COTIDIANO Y FUTBOLÍSTICO CLARO (66 TÉRMINOS)
  // =========================================================================
  const SOCCER_VOCABULARY_BANK = [
    // NIVEL BÁSICO (Uso diario y fundamentos claros)
    { id: 'b01', level: 'basic', en: 'Pass the ball', es: 'Pasar el balón', category: 'pass' },
    { id: 'b02', level: 'basic', en: 'Shoot at goal', es: 'Tirar a portería', category: 'shot' },
    { id: 'b03', level: 'basic', en: 'Run fast', es: 'Correr rápido', category: 'dribble' },
    { id: 'b04', level: 'basic', en: 'Score a goal', es: 'Anotar un gol', category: 'shot' },
    { id: 'b05', level: 'basic', en: 'Goalkeeper', es: 'Portero', category: 'position' },
    { id: 'b06', level: 'basic', en: 'Defender', es: 'Defensa', category: 'defense' },
    { id: 'b07', level: 'basic', en: 'Midfielder', es: 'Mediocampista', category: 'position' },
    { id: 'b08', level: 'basic', en: 'Striker', es: 'Delantero', category: 'shot' },
    { id: 'b09', level: 'basic', en: 'Referee', es: 'Árbitro', category: 'rule' },
    { id: 'b10', level: 'basic', en: 'Soccer field', es: 'Cancha de fútbol', category: 'match' },
    { id: 'b11', level: 'basic', en: 'First half', es: 'Primer tiempo', category: 'match' },
    { id: 'b12', level: 'basic', en: 'Halftime break', es: 'Descanso de medio tiempo', category: 'match' },
    { id: 'b13', level: 'basic', en: 'Short pass', es: 'Pase corto', category: 'pass' },
    { id: 'b14', level: 'basic', en: 'Long pass', es: 'Pase largo', category: 'pass' },
    { id: 'b15', level: 'basic', en: 'Kick-off', es: 'Saque inicial', category: 'match' },
    { id: 'b16', level: 'basic', en: 'Goalpost', es: 'Poste de la portería', category: 'shot' },
    { id: 'b17', level: 'basic', en: 'Team captain', es: 'Capitán del equipo', category: 'position' },
    { id: 'b18', level: 'basic', en: 'Left side', es: 'Lado izquierdo', category: 'dribble' },
    { id: 'b19', level: 'basic', en: 'Right side', es: 'Lado derecho', category: 'dribble' },
    { id: 'b20', level: 'basic', en: 'Clear the ball', es: 'Despejar el balón', category: 'defense' },
    { id: 'b21', level: 'basic', en: 'Block the shot', es: 'Bloquear el disparo', category: 'defense' },
    { id: 'b22', level: 'basic', en: 'Win the match', es: 'Ganar el partido', category: 'match' },

    // NIVEL INTERMEDIO (Jugadas, comunicación y reglas)
    { id: 'i01', level: 'intermediate', en: 'Through ball', es: 'Pase filtrado al hueco', category: 'pass' },
    { id: 'i02', level: 'intermediate', en: 'Cross to the center', es: 'Tirar un centro al área', category: 'pass' },
    { id: 'i03', level: 'intermediate', en: 'Header', es: 'Remate de cabeza', category: 'shot' },
    { id: 'i04', level: 'intermediate', en: 'Slide tackle', es: 'Barrida defensiva', category: 'defense' },
    { id: 'i05', level: 'intermediate', en: 'Free kick', es: 'Tiro libre', category: 'shot' },
    { id: 'i06', level: 'intermediate', en: 'Penalty kick', es: 'Tiro penal', category: 'shot' },
    { id: 'i07', level: 'intermediate', en: 'Corner kick', es: 'Tiro de esquina', category: 'pass' },
    { id: 'i08', level: 'intermediate', en: 'Throw-in', es: 'Saque de banda', category: 'pass' },
    { id: 'i09', level: 'intermediate', en: 'Goal kick', es: 'Saque de meta', category: 'defense' },
    { id: 'i10', level: 'intermediate', en: 'Offside position', es: 'Posición en fuera de lugar', category: 'rule' },
    { id: 'i11', level: 'intermediate', en: 'Yellow card', es: 'Tarjeta amarilla', category: 'rule' },
    { id: 'i12', level: 'intermediate', en: 'Red card', es: 'Tarjeta roja', category: 'rule' },
    { id: 'i13', level: 'intermediate', en: 'Commit a foul', es: 'Cometer una falta', category: 'rule' },
    { id: 'i14', level: 'intermediate', en: 'Dribble past the rival', es: 'Regatear al rival', category: 'dribble' },
    { id: 'i15', level: 'intermediate', en: 'Intercept the pass', es: 'Interceptar el pase', category: 'defense' },
    { id: 'i16', level: 'intermediate', en: 'Volley shot', es: 'Disparo de volea', category: 'shot' },
    { id: 'i17', level: 'intermediate', en: 'Penalty box', es: 'Área penal', category: 'match' },
    { id: 'i18', level: 'intermediate', en: 'Mark the player', es: 'Cubrir al jugador', category: 'defense' },
    { id: 'i19', level: 'intermediate', en: 'Diving save', es: 'Atajada con estirada', category: 'defense' },
    { id: 'i20', level: 'intermediate', en: 'Keep ball possession', es: 'Mantener la posesión del balón', category: 'pass' },
    { id: 'i21', level: 'intermediate', en: 'Powerful low shot', es: 'Disparo raso y potente', category: 'shot' },
    { id: 'i22', level: 'intermediate', en: 'Curved shot', es: 'Tiro con efecto', category: 'shot' },

    // NIVEL AVANZADO (Táctica y expresiones reales)
    { id: 'a01', level: 'advanced', en: 'Top corner shot', es: 'Disparo al ángulo superior', category: 'shot' },
    { id: 'a02', level: 'advanced', en: 'Nutmeg the defender', es: 'Hacer un túnel al defensa', category: 'dribble' },
    { id: 'a03', level: 'advanced', en: 'One-two wall pass', es: 'Hacer una pared en corto', category: 'pass' },
    { id: 'a04', level: 'advanced', en: 'Fast counter-attack', es: 'Contraataque rápido', category: 'dribble' },
    { id: 'a05', level: 'advanced', en: 'Keep a clean sheet', es: 'Dejar la portería en cero', category: 'defense' },
    { id: 'a06', level: 'advanced', en: 'Injury time', es: 'Tiempo de compensación', category: 'match' },
    { id: 'a07', level: 'advanced', en: 'Watch your back!', es: '¡Cuidado por la espalda!', category: 'defense' },
    { id: 'a08', level: 'advanced', en: 'Switch the play', es: 'Cambiar de juego a la otra banda', category: 'pass' },
    { id: 'a09', level: 'advanced', en: 'Bicycle kick', es: 'Remate de chilena', category: 'shot' },
    { id: 'a10', level: 'advanced', en: 'Chip the goalkeeper', es: 'Bombeo por encima del portero', category: 'shot' },
    { id: 'a11', level: 'advanced', en: 'Hit the crossbar', es: 'Pegar en el travesaño', category: 'shot' },
    { id: 'a12', level: 'advanced', en: 'Defend deep in the box', es: 'Defender atrás en el área', category: 'defense' },
    { id: 'a13', level: 'advanced', en: 'High pressing', es: 'Presión alta al rival', category: 'defense' },
    { id: 'a14', level: 'advanced', en: 'Overlap on the wing', es: 'Pasar al ataque por la banda', category: 'dribble' },
    { id: 'a15', level: 'advanced', en: 'Clinical finish', es: 'Definición precisa frente al arco', category: 'shot' },
    { id: 'a16', level: 'advanced', en: 'Split the defense', es: 'Romper la línea defensiva', category: 'pass' },
    { id: 'a17', level: 'advanced', en: 'Beat the offside trap', es: 'Romper la trampa del fuera de lugar', category: 'dribble' },
    { id: 'a18', level: 'advanced', en: 'Box-to-box midfielder', es: 'Mediocampista de área a área', category: 'position' },
    { id: 'a19', level: 'advanced', en: 'Last-second tackle', es: 'Barrida salvadora al límite', category: 'defense' },
    { id: 'a20', level: 'advanced', en: 'Shot to the far post', es: 'Disparo al segundo poste', category: 'shot' },
    { id: 'a21', level: 'advanced', en: 'Hold up the ball', es: 'Aguantar el balón de espaldas', category: 'dribble' },
    { id: 'a22', level: 'advanced', en: 'Catch the keeper off guard', es: 'Sorprender al portero adelantado', category: 'shot' }
  ];

  // =========================================================================
  // 10 DIVISIONES COMPETITIVAS (EMPIEZA EN DIVISIÓN 10 CON 0 RP)
  // =========================================================================
  const DIVISION_RIVALS_TIERS = [
    { div: 10, minRP: 0,    maxRP: 99,   title: 'División 10 • Inicio',         tierGroup: 'Bronce I',   icon: '10', gradient: 'linear-gradient(135deg, #475569, #1e293b)' },
    { div: 9,  minRP: 100,  maxRP: 199,  title: 'División 9 • Amateur',         tierGroup: 'Bronce II',  icon: '9',  gradient: 'linear-gradient(135deg, #78350f, #b45309)' },
    { div: 8,  minRP: 200,  maxRP: 299,  title: 'División 8 • Juvenil',         tierGroup: 'Bronce III', icon: '8',  gradient: 'linear-gradient(135deg, #92400e, #d97706)' },
    { div: 7,  minRP: 300,  maxRP: 419,  title: 'División 7 • Reserva',         tierGroup: 'Plata I',    icon: '7',  gradient: 'linear-gradient(135deg, #334155, #64748b)' },
    { div: 6,  minRP: 420,  maxRP: 549,  title: 'División 6 • Semi-Pro',        tierGroup: 'Plata II',   icon: '6',  gradient: 'linear-gradient(135deg, #475569, #94a3b8)' },
    { div: 5,  minRP: 550,  maxRP: 699,  title: 'División 5 • Titular',         tierGroup: 'Plata III',  icon: '5',  gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)' },
    { div: 4,  minRP: 700,  maxRP: 859,  title: 'División 4 • Profesional',     tierGroup: 'Oro I',      icon: '4',  gradient: 'linear-gradient(135deg, #b45309, #fbbf24)' },
    { div: 3,  minRP: 860,  maxRP: 1049, title: 'División 3 • Primera Liga',    tierGroup: 'Oro II',     icon: '3',  gradient: 'linear-gradient(135deg, #d97706, #fde047)' },
    { div: 2,  minRP: 1050, maxRP: 1299, title: 'División 2 • Club Élite',      tierGroup: 'Esmeralda',  icon: '2',  gradient: 'linear-gradient(135deg, #047857, #10b981)' },
    { div: 1,  minRP: 1300, maxRP: 9999, title: 'División 1 • Campeón Mundial', tierGroup: 'Leyenda',    icon: '1',  gradient: 'linear-gradient(135deg, #fbbf24, #a855f7)' }
  ];

  // =========================================================================
  // MATRIZ DE 15 NODOS TÁCTICOS EN CANCHA (5 ZONAS × 3 CARRILES)
  // =========================================================================
  const TACTICAL_ZONES_META = {
    '-2': { nameEn: 'Zone -2: Defensive Box', nameEs: 'Tu Área Defensiva', x: -32 },
    '-1': { nameEn: 'Zone -1: Defensive Mid', nameEs: 'Tu Mediocampo',     x: -16 },
    '0':  { nameEn: 'Zone 0: Center Circle',  nameEs: 'Círculo Central',   x: 0 },
    '1':  { nameEn: 'Zone +1: Attacking Zone',nameEs: 'Zona de Ataque',    x: 16 },
    '2':  { nameEn: 'Zone +2: Goal Area',     nameEs: 'Área de Disparo',   x: 32 }
  };

  const TACTICAL_LANES_META = {
    left:   { id: 'left',   nameEn: 'Left Wing',   nameEs: 'Banda Izquierda', z: -15 },
    center: { id: 'center', nameEn: 'Center Lane', nameEs: 'Carril Central',  z: 0 },
    right:  { id: 'right',  nameEn: 'Right Wing',  nameEs: 'Banda Derecha',   z: 15 }
  };

  const KIT_PRESETS = {
    classic_blue:  { name: 'Royal Blue',      primary: 0x1d4ed8, secondary: 0xfbbf24, shorts: 0x0f172a },
    emerald_elite: { name: 'Emerald United',  primary: 0x059669, secondary: 0x34d399, shorts: 0x064e3b },
    crimson_flame: { name: 'Crimson Athletic',primary: 0xdc2626, secondary: 0xfde047, shorts: 0x1e293b },
    galaxy_icon:   { name: 'Imperial Purple', primary: 0x7e22ce, secondary: 0xfbbf24, shorts: 0x090d1a }
  };

  const BOOTS_PRESETS = {
    standard:   { name: 'Carbon Black', color: 0x111827 },
    neon_volt:  { name: 'Volt Green',   color: 0x84cc16 },
    gold_elite: { name: 'Gold Pro',     color: 0xfbbf24 }
  };

  const BALL_PRESETS = {
    pro_white:      { name: 'Classic White', color: 0xffffff, accent: 0x1d4ed8 },
    winter_hi_vis:  { name: 'Hi-Vis Yellow', color: 0xfacc15, accent: 0xdc2626 },
    finale_emerald: { name: 'Emerald Star',  color: 0xecfdf5, accent: 0x10b981 }
  };

  const ONLINE_RIVAL_PROFILES = [
    { name: 'Alex_Striker', code: 'MENG-4109', ping: 28 },
    { name: 'Sofia_Tactics', code: 'MENG-7832', ping: 34 },
    { name: 'Mateo_FC', code: 'MENG-2951', ping: 42 },
    { name: 'Valeria_10', code: 'MENG-6418', ping: 31 },
    { name: 'Lucas_Mid', code: 'MENG-9045', ping: 39 },
    { name: 'Camila_Goal', code: 'MENG-5320', ping: 25 }
  ];

  // Estado inicial limpio: División 10, 0 RP, 0 Partidos, 0 Victorias, 0 Goles, 0% Precisión
  function getDefaultProfile() {
    return {
      rp: 0,
      division: 10,
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
      offlineDifficulty: 'medium',
      playerCustomization: {
        kitId: 'classic_blue',
        bootsId: 'standard',
        ballId: 'pro_white',
        stadiumTheme: 'night_arena'
      }
    };
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

  function loadProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      const base = getDefaultProfile();
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return base;
      const merged = Object.assign({}, base, parsed);
      merged.playerCustomization = Object.assign({}, base.playerCustomization, parsed.playerCustomization || {});
      // Si nunca ha jugado un partido real, forzar estadísticas en 0 y División 10
      if (!merged.matchesPlayed || merged.matchesPlayed <= 0) {
        merged.rp = 0;
        merged.division = 10;
        merged.wins = 0;
        merged.draws = 0;
        merged.losses = 0;
        merged.goalsScored = 0;
        merged.goalsConceded = 0;
        merged.currentStreak = 0;
        merged.questionsAnswered = 0;
        merged.questionsCorrect = 0;
      } else {
        merged.division = computeDivisionFromRP(merged.rp).div;
      }
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
      if (window.userProfile && typeof window.userProfile === 'object') {
        window.userProfile.soccerProfile = profile;
      }
      if (typeof window.saveUserProgress === 'function') {
        try { window.saveUserProgress(); } catch (err) {}
      }
    } catch (e) {}
  }

  function getStoredContactsForSoccer() {
    const list = [];
    const seen = new Set();
    try {
      const keys = ['mastereng_social_contacts', 'mastereng_friends', 'mastereng_friends_list', 'english_app_friends', 'mastereng_contacts'];
      keys.forEach((k) => {
        const raw = localStorage.getItem(k);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            if (!item) return;
            const id = item.friendCode || item.gameId || item.id || item.code || '';
            const name = item.name || item.username || '';
            if (name && !seen.has(name + id)) {
              seen.add(name + id);
              list.push({
                id: id || ('MENG-' + Math.floor(1000 + Math.random() * 9000)),
                contactInternalId: item.id || id,
                name: name,
                avatar: item.avatar || '⚽'
              });
            }
          });
        }
      });
    } catch (e) {}
    return list;
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
    nodesMap: {},
    interactiveMeshes: [],
    homePlayers: [],
    awayPlayers: [],
    ballMesh: null,
    tacticalArrowMesh: null,

    // Animaciones 3D en curso
    ballAnim: null,
    cameraTargetPos: { x: 0, y: 28, z: 38 },
    cameraLookAtPos: { x: 0, y: 1, z: 0 },

    // Turnos fijos: 12 turnos en total (6 por jugador: 15', 30', 45', 60', 75', 90')
    TURN_MINUTES: [8, 15, 23, 30, 38, 45, 53, 60, 68, 75, 83, 90],

    // Estado del partido
    match: {
      active: false,
      mode: 'ranked_online', // 'ranked_online' | 'friend_duel' | 'offline_ai'
      offlineDifficulty: 'medium', // 'basic' | 'medium' | 'hard'
      rivalName: 'Rival Online',
      rivalCode: 'MENG-4109',
      roomCode: '',
      homeScore: 0,
      awayScore: 0,
      playsElapsed: 0,
      maxPlays: 12,          // 12 turnos exactos (6 tú, 6 rival alternados 1 a 1)
      possession: 'home',    // Alternancia estricta: Turno par = 'home' (Tú), Turno impar = 'away' (Rival)
      ballZone: 0,           // -2, -1, 0, +1, +2
      ballLane: 'center',    // 'left', 'center', 'right'
      homeMomentum: 0,       // 0..2 (+1 por cada acierto; con 2 se desbloquea Pase Largo / Disparo Directo)
      awayMomentum: 0,
      isSuddenDeath: false,
      suddenDeathRound: 0,
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
        <!-- HUB PRINCIPAL -->
        <div id="soccer-hub-view" class="soccer-hub-container">
          <div class="soccer-hub-topbar">
            <div class="soccer-brand-block">
              <div class="soccer-brand-emblem">⚽</div>
              <div>
                <h1 class="soccer-brand-title">MasterGoal 3D</h1>
                <p class="soccer-brand-subtitle">Fútbol Táctico por Turnos y Duelos de Inglés</p>
              </div>
            </div>
            <div class="soccer-nav-tabs">
              <button type="button" id="soccerTabLobbyBtn" class="soccer-tab-btn active" onclick="window.SoccerTactics3D.switchTab('lobby')">
                Modos de Juego
              </button>
              <button type="button" id="soccerTabLockerBtn" class="soccer-tab-btn" onclick="window.SoccerTactics3D.switchTab('locker')">
                Vestidor 3D
              </button>
              <button type="button" class="soccer-exit-btn" onclick="window.backToPortalsMenu()">
                ← Salir a Portales
              </button>
            </div>
          </div>

          <!-- TAB 1: MI PROGRESO REAL & 3 MODOS DE JUEGO -->
          <div id="soccer-tab-lobby-content" class="soccer-lobby-grid">
            <div class="soccer-rivals-card">
              <div class="soccer-division-header">
                <div id="soccerDivCrest" class="soccer-division-crest">
                  <span id="soccerDivIcon" class="soccer-division-crest-icon">10</span>
                  <span id="soccerDivNum" class="soccer-division-crest-num">DIV 10</span>
                </div>
                <div class="soccer-division-info">
                  <div id="soccerDivTierGroup" class="soccer-division-kicker">BRONCE I</div>
                  <h2 id="soccerDivTitle" class="soccer-division-name">División 10 • Inicio</h2>
                  <div class="soccer-rp-row">
                    <span id="soccerRpLabel">0 RP</span>
                    <span id="soccerNextDivLabel">Ascenso a Div 9: 100 RP</span>
                  </div>
                  <div class="soccer-rp-bar-outer">
                    <div id="soccerRpBarFill" class="soccer-rp-bar-inner" style="width: 0%;"></div>
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
                  <span class="soccer-stat-label">Goles</span>
                  <span id="soccerStatGoals" class="soccer-stat-value">0</span>
                </div>
                <div class="soccer-stat-box">
                  <span class="soccer-stat-label">Precisión</span>
                  <span id="soccerStatAccuracy" class="soccer-stat-value">0%</span>
                </div>
                <div class="soccer-stat-box">
                  <span class="soccer-stat-label">Racha</span>
                  <span id="soccerStatStreak" class="soccer-stat-value">0</span>
                </div>
              </div>

              <div class="soccer-rules-summary">
                <div class="soccer-rule-item">
                  <strong>Turnos 1 a 1:</strong> 1 jugada tú y 1 jugada el rival (6 turnos por jugador).
                </div>
                <div class="soccer-rule-item">
                  <strong>Velocidad y Momentum:</strong> Si ambos aciertan, avanza quien responda más rápido. Con 2 aciertos desbloqueas tiro o pase largo directo.
                </div>
                <div class="soccer-rule-item">
                  <strong>Desempate 90':</strong> Tanda relámpago de muerte súbita si el partido termina empatado.
                </div>
              </div>
            </div>

            <div class="soccer-modes-card">
              <h3 style="margin:0 0 12px;font-size:17px;font-weight:900;color:#fff;">Modos de Partido</h3>
              <div class="soccer-mode-list">
                <!-- MODO 1: 1v1 RANKED ONLINE -->
                <div class="soccer-mode-option">
                  <h4 class="soccer-mode-title">
                    <span>1v1 Ranked Online</span>
                    <span class="soccer-mode-badge ranked">PUNTOS RP</span>
                  </h4>
                  <p class="soccer-mode-desc">
                    Emparejamiento competitivo para ganar RP y subir de División.
                  </p>
                  <button type="button" class="soccer-play-btn" onclick="window.SoccerTactics3D.openRankedMatchmaking()">
                    Buscar Rival Ranked
                  </button>
                </div>

                <!-- MODO 2: 1v1 CON AMIGOS (INVITACIÓN AL BUZÓN) -->
                <div class="soccer-mode-option">
                  <h4 class="soccer-mode-title">
                    <span>1v1 con Amigos</span>
                    <span class="soccer-mode-badge friend">INVITACIÓN BUZÓN</span>
                  </h4>
                  <p class="soccer-mode-desc">
                    Envía una invitación directa al Buzón de un amigo o comparte código de sala.
                  </p>
                  <button type="button" class="soccer-play-btn secondary" onclick="window.SoccerTactics3D.openFriendInviteModal()">
                    Invitar Amigo al Partido
                  </button>
                </div>

                <!-- MODO 3: PRÁCTICA OFFLINE (VS IA) -->
                <div class="soccer-mode-option">
                  <div class="soccer-mode-title">
                    <span>Práctica Offline (vs IA)</span>
                    <span class="soccer-mode-badge practice">SIN RIESGO RP</span>
                  </div>
                  <p class="soccer-mode-desc">
                    Entrenamiento libre contra la máquina sin perder puntos RP.
                  </p>
                  <div class="soccer-difficulty-row">
                    <span style="font-size:11px;font-weight:800;color:#94a3b8;">Dificultad IA:</span>
                    <div class="soccer-diff-pills">
                      <button type="button" id="soccerDiffBasic" class="soccer-diff-pill" onclick="window.SoccerTactics3D.setOfflineDifficulty('basic')">Básica</button>
                      <button type="button" id="soccerDiffMedium" class="soccer-diff-pill active" onclick="window.SoccerTactics3D.setOfflineDifficulty('medium')">Media</button>
                      <button type="button" id="soccerDiffHard" class="soccer-diff-pill" onclick="window.SoccerTactics3D.setOfflineDifficulty('hard')">Difícil</button>
                    </div>
                  </div>
                  <button type="button" class="soccer-play-btn practice-btn" onclick="window.SoccerTactics3D.startOfflinePractice()">
                    Iniciar Práctica Offline
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: VESTIDOR 3D -->
          <div id="soccer-tab-locker-content" class="soccer-locker-card" style="display:none;">
            <div class="soccer-locker-layout">
              <div class="soccer-locker-preview-box">
                <div style="font-size:56px;line-height:1;margin-bottom:12px;">⚽</div>
                <div id="soccerLockerPreviewLabel" style="font-size:13px;font-weight:900;color:#38bdf8;text-align:center;">
                  Equipación: Royal Blue
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-top:4px;text-align:center;">
                  Se aplica directamente a tu equipo en la cancha 3D.
                </div>
              </div>
              <div>
                <h3 style="margin:0 0 14px;font-size:18px;font-weight:900;color:#fff;">Personalización del Equipo</h3>
                <div class="soccer-custom-group">
                  <div class="soccer-custom-group-title">Uniforme del Equipo</div>
                  <div id="soccerKitPills" class="soccer-custom-pills"></div>
                </div>
                <div class="soccer-custom-group">
                  <div class="soccer-custom-group-title">Botines</div>
                  <div id="soccerBootsPills" class="soccer-custom-pills"></div>
                </div>
                <div class="soccer-custom-group">
                  <div class="soccer-custom-group-title">Balón del Partido</div>
                  <div id="soccerBallPills" class="soccer-custom-pills"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL DE EMPAREJAMIENTO RANKED ONLINE -->
        <div id="soccer-matchmaking-modal" class="soccer-overlay-modal" style="display:none;">
          <div class="soccer-modal-box">
            <div class="soccer-spinner-ring"></div>
            <h3 id="soccerMatchmakingTitle" style="margin:0;font-size:18px;font-weight:900;color:#fff;">Buscando rival en tu División...</h3>
            <p id="soccerMatchmakingSub" style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Verificando latencia y nivel de inglés</p>
            <button type="button" class="soccer-exit-btn" style="margin-top:14px;" onclick="window.SoccerTactics3D.cancelRankedMatchmaking()">
              Cancelar búsqueda
            </button>
          </div>
        </div>

        <!-- MODAL DE INVITACIÓN A AMIGOS (BUZÓN / ID MENG-XXXX) -->
        <div id="soccer-friend-modal" class="soccer-overlay-modal" style="display:none;">
          <div class="soccer-modal-box" style="max-width:460px;text-align:left;align-items:stretch;">
            <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(148,163,184,0.2);padding-bottom:10px;">
              <div>
                <h3 style="margin:0;font-size:16px;font-weight:900;color:#fff;">Invitar Amigo a Duelo 1v1</h3>
                <p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">Envía invitación al Buzón o comparte el código de sala</p>
              </div>
              <button type="button" class="soccer-hud-btn" onclick="window.SoccerTactics3D.closeFriendInviteModal()">✕</button>
            </div>

            <div style="margin-top:12px;">
              <div style="font-size:11px;font-weight:800;color:#38bdf8;text-transform:uppercase;margin-bottom:6px;">Tus Amigos Agregados</div>
              <div id="soccerFriendsListContainer" style="max-height:150px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;"></div>
            </div>

            <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(148,163,184,0.18);">
              <label style="display:block;font-size:11px;font-weight:800;color:#fbbf24;text-transform:uppercase;margin-bottom:6px;">
                Invitar por ID Único (MENG-XXXX) o Nombre
              </label>
              <div style="display:flex;gap:8px;">
                <input id="soccerFriendCodeInput" type="text" placeholder="Ej: MENG-4821 o Nombre"
                  style="flex:1;padding:9px 12px;border-radius:10px;background:#0f172a;border:1px solid rgba(148,163,184,0.35);color:#fff;font-size:12px;" />
                <button type="button" class="soccer-play-btn secondary" style="padding:9px 14px;font-size:12px;" onclick="window.SoccerTactics3D.sendCustomFriendSoccerInvite()">
                  Enviar al Buzón
                </button>
              </div>
            </div>

            <div style="margin-top:12px;padding:10px 12px;border-radius:12px;background:rgba(15,23,42,0.9);border:1px solid rgba(56,189,248,0.3);display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <div>
                <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;">Código de Sala Directa</div>
                <div id="soccerRoomCodeDisplay" style="font-size:14px;font-weight:900;color:#38bdf8;font-family:monospace;">GOAL-1024</div>
              </div>
              <button type="button" class="soccer-hud-btn" onclick="window.SoccerTactics3D.copySoccerRoomLink()">
                Copiar Enlace
              </button>
            </div>
          </div>
        </div>

        <!-- ESCENARIO 3D DEL ESTADIO -->
        <div id="soccer-stadium-stage">
          <div id="soccer-canvas-mount"></div>

          <!-- MARCADOR DE TV + BARRA DE MOMENTUM + CONTROLES -->
          <div class="soccer-broadcast-hud">
            <div class="soccer-tv-scoreboard">
              <div class="soccer-tv-team home">TÚ</div>
              <div id="soccerTvScore" class="soccer-tv-score">0 - 0</div>
              <div id="soccerTvAwayLabel" class="soccer-tv-team away">RIVAL</div>
              <div id="soccerTvClock" class="soccer-tv-clock">08' (Turno 1/12)</div>
              <div id="soccerMomentumPill" class="soccer-momentum-pill">Momentum: 0/2</div>
            </div>

            <div class="soccer-hud-controls">
              <button type="button" class="soccer-hud-btn" onclick="window.SoccerTactics3D.backToLobby()">
                ← Abandonar Partido
              </button>
              <button type="button" class="soccer-hud-btn" onclick="window.backToPortalsMenu()">
                ← Salir a Portales
              </button>
            </div>
          </div>

          <!-- BANNER CENTRAL DE EVENTO -->
          <div id="soccer-event-banner">¡GOL!</div>

          <!-- DOCK TÁCTICO INFERIOR -->
          <div id="soccer-tactical-dock" class="soccer-tactical-dock">
            <div class="soccer-tactical-status-row">
              <span id="soccerZoneBadge" class="soccer-zone-pill">Zona 0: Círculo Central</span>
              <span id="soccerPossessionPrompt" class="soccer-tactical-prompt">
                Tu turno (Jugada 1/12): Elige a qué zona avanzar o disparar
              </span>
            </div>
            <div id="soccerNodeButtons" class="soccer-node-buttons"></div>
          </div>

          <!-- MODAL DE DUELO DE VELOCIDAD / RETO DE INGLÉS -->
          <div id="soccer-quiz-modal">
            <div id="soccerQuizCard" class="soccer-quiz-card">
              <div class="soccer-quiz-top">
                <span id="soccerQuizBadge" class="soccer-quiz-badge">TURNO DE ATAQUE</span>
                <div style="display:flex;align-items:center;gap:8px;">
                  <span id="soccerQuizTimerText" class="soccer-quiz-timer-text">8.0s</span>
                  <button type="button" onclick="window.SoccerTactics3D.exitMatchToLobby()" style="padding:4px 10px;border-radius:8px;background:rgba(244,63,94,0.18);border:1px solid rgba(244,63,94,0.45);color:#fda4af;font-size:11px;font-weight:800;cursor:pointer;" title="Retroceder al Lobby de Fútbol">
                    ← Salir al Lobby
                  </button>
                </div>
              </div>
              <div class="soccer-quiz-timer-track">
                <div id="soccerQuizTimerFill" class="soccer-quiz-timer-fill"></div>
              </div>
              <div id="soccerSpeedDuelSub" style="font-size:11px;color:#cbd5e1;text-align:center;font-weight:700;">
                Si ambos aciertan, gana la dividida quien responda en menos segundos.
              </div>
              <div class="soccer-quiz-phrase-box">
                <div id="soccerQuizDirection" class="soccer-quiz-direction">TRADUCE AL INGLÉS</div>
                <div id="soccerQuizPromptMain" class="soccer-quiz-prompt-main">"Pasar el balón"</div>
              </div>
              <div id="soccerQuizOptions" class="soccer-quiz-options"></div>
            </div>
          </div>

          <!-- MODAL DE RESUMEN FINAL DE PARTIDO -->
          <div id="soccer-postmatch-modal">
            <div class="soccer-postmatch-card">
              <div id="soccerPostResultIcon" style="font-size:44px;line-height:1;">🏆</div>
              <h2 id="soccerPostTitle" style="margin:0;font-size:22px;font-weight:900;color:#fff;">FINAL DEL PARTIDO</h2>
              <div id="soccerPostScore" style="font-size:20px;font-weight:900;color:#fbbf24;">1 - 0</div>
              <div id="soccerPostRpDelta" style="font-size:14px;font-weight:800;color:#34d399;">+30 RP</div>
              <div id="soccerPostStats" style="font-size:13px;color:#cbd5e1;line-height:1.5;"></div>
              <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:8px;">
                <button type="button" class="soccer-play-btn" onclick="window.SoccerTactics3D.rematchCurrentMode()">
                  Jugar Revancha
                </button>
                <button type="button" class="soccer-hud-btn" style="padding:12px 18px;" onclick="window.SoccerTactics3D.backToLobby()">
                  Volver al Lobby
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      this.renderLobbyStats();
      this.renderLockerCustomization();
      this.updateDifficultyPillsUI();
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
      if (group) group.textContent = tier.tierGroup.toUpperCase();
      if (title) title.textContent = tier.title;
      if (rpLabel) rpLabel.textContent = p.rp + ' RP';

      if (tier.div === 1) {
        if (nextLabel) nextLabel.textContent = 'División Máxima Alcanzada';
        if (rpFill) rpFill.style.width = '100%';
      } else {
        const span = Math.max(1, tier.maxRP - tier.minRP + 1);
        const pct = p.rp <= 0 ? 0 : Math.min(100, Math.max(0, Math.round(((p.rp - tier.minRP) / span) * 100)));
        if (nextLabel) nextLabel.textContent = 'Ascenso a Div ' + (tier.div - 1) + ': ' + (tier.maxRP + 1) + ' RP';
        if (rpFill) rpFill.style.width = pct + '%';
      }

      // Cero estadísticas falsas: si no ha respondido preguntas, precisión es 0%
      const acc = p.questionsAnswered > 0
        ? Math.round((p.questionsCorrect / p.questionsAnswered) * 100)
        : 0;

      const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(val);
      };
      setTxt('soccerStatMatches', p.matchesPlayed || 0);
      setTxt('soccerStatWins', p.wins || 0);
      setTxt('soccerStatGoals', p.goalsScored || 0);
      setTxt('soccerStatAccuracy', acc + '%');
      setTxt('soccerStatStreak', p.currentStreak || 0);
    },

    setOfflineDifficulty: function (diff) {
      this.profile.offlineDifficulty = diff || 'medium';
      this.updateDifficultyPillsUI();
    },

    updateDifficultyPillsUI: function () {
      const d = this.profile.offlineDifficulty || 'medium';
      const b = document.getElementById('soccerDiffBasic');
      const m = document.getElementById('soccerDiffMedium');
      const h = document.getElementById('soccerDiffHard');
      if (b) b.classList.toggle('active', d === 'basic');
      if (m) m.classList.toggle('active', d === 'medium');
      if (h) h.classList.toggle('active', d === 'hard');
    },

    // =========================================================================
    // LOS 3 MODOS DE ENTRADA (1v1 RANKED, 1v1 AMIGOS BUZÓN, PRÁCTICA OFFLINE)
    // =========================================================================
    openRankedMatchmaking: function () {
      const modal = document.getElementById('soccer-matchmaking-modal');
      const title = document.getElementById('soccerMatchmakingTitle');
      const sub = document.getElementById('soccerMatchmakingSub');
      if (modal) modal.style.display = 'flex';
      if (title) title.textContent = `Buscando rival en División ${this.profile.division}...`;
      if (sub) sub.textContent = 'Conectando sala competitiva 1v1 Ranked Online';

      clearTimeout(this._mmTimer);
      this._mmTimer = setTimeout(() => {
        const pick = ONLINE_RIVAL_PROFILES[Math.floor(Math.random() * ONLINE_RIVAL_PROFILES.length)];
        if (title) title.textContent = `Rival encontrado: ${pick.name} (${pick.code})`;
        if (sub) sub.textContent = `Latencia: ${pick.ping}ms • Iniciando partido a 12 turnos...`;
        this._mmTimer = setTimeout(() => {
          if (modal) modal.style.display = 'none';
          this.startMatch('ranked_online', {
            rivalName: pick.name,
            rivalCode: pick.code
          });
        }, 700);
      }, 950);
    },

    cancelRankedMatchmaking: function () {
      clearTimeout(this._mmTimer);
      const modal = document.getElementById('soccer-matchmaking-modal');
      if (modal) modal.style.display = 'none';
    },

    openFriendInviteModal: function () {
      const modal = document.getElementById('soccer-friend-modal');
      const listEl = document.getElementById('soccerFriendsListContainer');
      const codeEl = document.getElementById('soccerRoomCodeDisplay');
      if (!this._activeRoomCode) {
        this._activeRoomCode = 'GOAL-' + Math.floor(1000 + Math.random() * 9000);
      }
      if (codeEl) codeEl.textContent = this._activeRoomCode;

      const friends = getStoredContactsForSoccer();
      if (listEl) {
        if (friends.length === 0) {
          listEl.innerHTML = `
            <div style="padding:10px;border-radius:10px;background:rgba(15,23,42,0.7);border:1px dashed rgba(148,163,184,0.3);font-size:11px;color:#94a3b8;text-align:center;">
              Aún no tienes contactos en tu lista. Ingresa el ID Único (MENG-XXXX) o nombre abajo para enviarle invitación a su Buzón.
            </div>
          `;
        } else {
          listEl.innerHTML = friends.map((f) => {
            const safeName = String(f.name).replace(/'/g, '');
            const safeId = String(f.id).replace(/'/g, '');
            return `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:10px;background:rgba(15,23,42,0.85);border:1px solid rgba(148,163,184,0.2);">
                <div>
                  <div style="font-size:12px;font-weight:800;color:#fff;">${f.name}</div>
                  <div style="font-size:10px;color:#38bdf8;font-family:monospace;">${f.id}</div>
                </div>
                <button type="button" class="soccer-play-btn secondary" style="padding:6px 12px;font-size:11px;"
                  onclick="window.SoccerTactics3D.sendSoccerInviteToFriend('${safeId}', '${safeName}')">
                  Invitar al Buzón
                </button>
              </div>
            `;
          }).join('');
        }
      }

      if (modal) modal.style.display = 'flex';
    },

    closeFriendInviteModal: function () {
      const modal = document.getElementById('soccer-friend-modal');
      if (modal) modal.style.display = 'none';
    },

    sendCustomFriendSoccerInvite: function () {
      const input = document.getElementById('soccerFriendCodeInput');
      const raw = input ? input.value.trim() : '';
      if (!raw) return;
      const isCode = /^MENG-/i.test(raw);
      const code = isCode ? raw.toUpperCase() : ('MENG-' + Math.floor(1000 + Math.random() * 9000));
      const name = isCode ? ('Amigo ' + code) : raw;
      this.sendSoccerInviteToFriend(code, name);
    },

    sendSoccerInviteToFriend: function (friendCode, friendName) {
      const roomCode = this._activeRoomCode || ('GOAL-' + Math.floor(1000 + Math.random() * 9000));
      const cleanName = (friendName || friendCode || 'Amigo').trim();
      const cleanCode = (friendCode || 'MENG-1024').trim();

      // Registrar invitación real en mastereng_inbox_invites (Bandeja / Buzón)
      try {
        const rawInbox = localStorage.getItem('mastereng_inbox_invites');
        let inboxList = rawInbox ? JSON.parse(rawInbox) : [];
        if (!Array.isArray(inboxList)) inboxList = [];
        const inviteItem = {
          id: 'soccer_' + Date.now(),
          fromId: cleanCode,
          fromName: cleanName,
          avatar: '⚽',
          friendCode: cleanCode,
          type: 'soccer_duel',
          roomCode: roomCode,
          title: '⚽ Duelo 1v1 en MasterGoal 3D',
          description: `Invitación a partido 1v1 de MasterGoal 3D (Sala ${roomCode}).`,
          status: 'pending',
          createdAt: new Date().toISOString(),
          timeStr: 'Ahora'
        };
        inboxList.unshift(inviteItem);
        localStorage.setItem('mastereng_inbox_invites', JSON.stringify(inboxList));
        if (typeof window.updateInboxBadgeCount === 'function') {
          window.updateInboxBadgeCount();
        }
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('mastereng_global_invites');
          bc.postMessage({ type: 'NEW_INVITE', invite: inviteItem });
          bc.close();
        }
      } catch (e) {}

      if (typeof window.showFloatingToast === 'function') {
        window.showFloatingToast(`Invitación enviada al Buzón de ${cleanName} (${roomCode})`, '⚽');
      }

      this.closeFriendInviteModal();
      this.startMatch('friend_duel', {
        rivalName: cleanName,
        rivalCode: cleanCode,
        roomCode: roomCode
      });
    },

    copySoccerRoomLink: function () {
      const roomCode = this._activeRoomCode || 'GOAL-1024';
      const url = `${window.location.origin}${window.location.pathname}?soccer_duel=${encodeURIComponent(roomCode)}`;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url);
        }
      } catch (e) {}
      if (typeof window.showFloatingToast === 'function') {
        window.showFloatingToast(`Enlace de sala copiado (${roomCode})`, '🔗');
      }
    },

    startOfflinePractice: function () {
      this.startMatch('offline_ai', {
        offlineDifficulty: this.profile.offlineDifficulty || 'medium',
        rivalName: this.profile.offlineDifficulty === 'hard'
          ? 'IA Difícil'
          : (this.profile.offlineDifficulty === 'basic' ? 'IA Básica' : 'IA Media')
      });
    },

    rematchCurrentMode: function () {
      this.startMatch(this.match.mode, {
        offlineDifficulty: this.match.offlineDifficulty,
        rivalName: this.match.rivalName,
        rivalCode: this.match.rivalCode,
        roomCode: this.match.roomCode
      });
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

      const hemi = new THREE.HemisphereLight(0xdbeafe, 0x064e3b, 0.95);
      this.scene.add(hemi);

      [
        [-45, 38, -28],
        [45, 38, -28],
        [-45, 38, 28],
        [45, 38, 28]
      ].forEach((pos) => {
        const dir = new THREE.DirectionalLight(0xf8fafc, 0.55);
        dir.position.set(pos[0], pos[1], pos[2]);
        this.scene.add(dir);
      });

      this.buildStadiumGeometry();
      this.build15TacticalNodes();
      this.buildTeamsAndBall();
      this.loadBlenderSoccerPack();

      this.renderer.domElement.addEventListener('pointerdown', (ev) => this.onCanvasPointerDown(ev));
      window.addEventListener('resize', () => this.handleResize());

      if (typeof this.renderer.compile === 'function') {
        try { this.renderer.compile(this.scene, this.camera); } catch (e) {}
      }
    },

    loadBlenderSoccerPack: function (onComplete) {
      if (this.blenderSoccerPack) {
        this.integrateBlenderModelsIntoStadium();
        if (typeof onComplete === 'function') onComplete(this.blenderSoccerPack);
        return;
      }
      const gltfUrl = this.soccerGlbUrl || 'assets/models/soccer/soccer_pack.glb';
      const LoaderClass = (typeof THREE !== 'undefined' && THREE.GLTFLoader) || (typeof window !== 'undefined' && window.GLTFLoader);
      if (!LoaderClass) {
        if (typeof onComplete === 'function') onComplete(null);
        return;
      }
      try {
        const loader = new LoaderClass();
        loader.load(gltfUrl, (gltf) => {
          if (gltf && gltf.scene) {
            this.blenderSoccerPack = gltf.scene;
            this.integrateBlenderModelsIntoStadium();
          }
          if (typeof onComplete === 'function') onComplete(this.blenderSoccerPack);
        }, undefined, (err) => {
          console.warn('[SoccerTactics3D] Using procedural pitch and players:', err);
          if (typeof onComplete === 'function') onComplete(null);
        });
      } catch (e) {
        if (typeof onComplete === 'function') onComplete(null);
      }
    },

    integrateBlenderModelsIntoStadium: function () {
      if (!this.blenderSoccerPack || !this.scene) return;
      try {
        const pitchBlender = this.blenderSoccerPack.getObjectByName('Soccer_Stadium_Pitch');
        if (pitchBlender && this.pitchGroup && !this.pitchGroup._hasBlenderPitch) {
          this.pitchGroup._hasBlenderPitch = true;
          const pbClone = pitchBlender.clone();
          pbClone.scale.set(6.0, 1.0, 2.5);
          pbClone.position.set(0, -0.02, 0);
          this.pitchGroup.add(pbClone);
        }

        const ballBlender = this.blenderSoccerPack.getObjectByName('Soccer_Ball_Pro');
        if (ballBlender && this.ballMesh && !this.ballMesh._hasBlenderBall) {
          this.ballMesh._hasBlenderBall = true;
          const ballModel = ballBlender.clone();
          ballModel.scale.set(2.2, 2.2, 2.2);
          if (this.ballMesh.material) this.ballMesh.material.visible = false;
          this.ballMesh.add(ballModel);
        }

        const homeModel = this.blenderSoccerPack.getObjectByName('Player_Home');
        const awayModel = this.blenderSoccerPack.getObjectByName('Player_Away');
        const gkModel = this.blenderSoccerPack.getObjectByName('Goalkeeper_Pro');

        if (homeModel && this.homePlayers) {
          this.homePlayers.forEach((p, idx) => {
            if (!p._hasBlenderPlayer) {
              p._hasBlenderPlayer = true;
              const m = (idx === 0 && gkModel) ? gkModel.clone() : homeModel.clone();
              m.scale.set(1.4, 1.4, 1.4);
              m.position.set(0, 0, 0);
              p.add(m);
            }
          });
        }
        if (awayModel && this.awayPlayers) {
          this.awayPlayers.forEach((p, idx) => {
            if (!p._hasBlenderPlayer) {
              p._hasBlenderPlayer = true;
              const m = (idx === 0 && gkModel) ? gkModel.clone() : awayModel.clone();
              m.scale.set(1.4, 1.4, 1.4);
              m.position.set(0, 0, 0);
              p.add(m);
            }
          });
        }
      } catch (err) {
        console.warn('[SoccerTactics3D] integrateBlenderModels error:', err);
      }
    },

    buildStadiumGeometry: function () {
      this.pitchGroup = new THREE.Group();
      this.scene.add(this.pitchGroup);

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

      const surroundGeo = new THREE.PlaneGeometry(110, 74);
      const surroundMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
      const surround = new THREE.Mesh(surroundGeo, surroundMat);
      surround.rotation.x = -Math.PI / 2;
      surround.position.y = -0.04;
      this.pitchGroup.add(surround);

      const lineMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
      const addLine = (w, d, x, z) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), lineMat);
        m.rotation.x = -Math.PI / 2;
        m.position.set(x, 0.02, z);
        this.pitchGroup.add(m);
      };

      addLine(pitchWidth, 0.35, 0, -pitchDepth / 2);
      addLine(pitchWidth, 0.35, 0, pitchDepth / 2);
      addLine(0.35, pitchDepth, -pitchWidth / 2, 0);
      addLine(0.35, pitchDepth, pitchWidth / 2, 0);
      addLine(0.35, pitchDepth, 0, 0);

      const centerRing = new THREE.Mesh(new THREE.RingGeometry(6.8, 7.15, 48), lineMat);
      centerRing.rotation.x = -Math.PI / 2;
      centerRing.position.set(0, 0.02, 0);
      this.pitchGroup.add(centerRing);

      [-1, 1].forEach((dir) => {
        const edgeX = dir * (pitchWidth / 2);
        addLine(14, 0.3, edgeX - dir * 7, -13);
        addLine(14, 0.3, edgeX - dir * 7, 13);
        addLine(0.3, 26, edgeX - dir * 14, 0);
        addLine(5.5, 0.28, edgeX - dir * 2.75, -6);
        addLine(5.5, 0.28, edgeX - dir * 2.75, 6);
        addLine(0.28, 12, edgeX - dir * 5.5, 0);

        const spot = new THREE.Mesh(new THREE.CircleGeometry(0.42, 16), lineMat);
        spot.rotation.x = -Math.PI / 2;
        spot.position.set(edgeX - dir * 10, 0.025, 0);
        this.pitchGroup.add(spot);

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

      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.95, 20),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.38 })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.02;
      group.add(shadow);

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.25, 0.52), jerseyMat);
      torso.position.y = 1.65;
      group.add(torso);

      const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.5, 0.5), shortsMat);
      shorts.position.y = 0.95;
      group.add(shorts);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 18), skinMat);
      head.position.y = 2.58;
      const hair = new THREE.Mesh(
        new THREE.SphereGeometry(0.39, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
        new THREE.MeshStandardMaterial({ color: 0x1e1b18, roughness: 0.8 })
      );
      hair.position.y = 2.62;
      group.add(head, hair);

      const armMat = isGK
        ? new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
        : skinMat;
      const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.95, 10), armMat);
      leftArm.position.set(-0.62, 1.6, 0);
      const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.95, 10), armMat);
      rightArm.position.set(0.62, 1.6, 0);
      group.add(leftArm, rightArm);

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

    positionPlayersForTacticalState: function (instant) {
      const bz = this.match.ballZone;
      const bl = this.match.ballLane;
      const ballX = (TACTICAL_ZONES_META[String(bz)] || TACTICAL_ZONES_META['0']).x;
      const ballZ = (TACTICAL_LANES_META[bl] || TACTICAL_LANES_META.center).z;

      const homeCoords = [
        new THREE.Vector3(-39.5, 0, 0),
        new THREE.Vector3(Math.max(-34, ballX - 12), 0, -13),
        new THREE.Vector3(Math.max(-34, ballX - 10), 0, 11),
        new THREE.Vector3(ballX, 0, ballZ),
        new THREE.Vector3(Math.min(34, ballX + 15), 0, bl === 'left' ? 12 : -12)
      ];

      const awayCoords = [
        new THREE.Vector3(39.5, 0, 0),
        new THREE.Vector3(Math.min(35, ballX + 8), 0, -12),
        new THREE.Vector3(Math.min(35, ballX + 6), 0, 0),
        new THREE.Vector3(Math.min(35, ballX + 8), 0, 12),
        new THREE.Vector3(Math.max(-32, ballX - 6), 0, bl === 'right' ? -10 : 10)
      ];

      if (this.match.possession === 'away') {
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
    // FLUJO DE PARTIDO: ALTERNANCIA ESTRICTA 1 A 1, MOMENTUM Y MUERTE SÚBITA
    // =========================================================================
    startMatch: function (mode, options) {
      const startMatchCore = () => {
        const opts = options || {};
        this.match.mode = mode || 'ranked_online';
        this.match.offlineDifficulty = opts.offlineDifficulty || this.profile.offlineDifficulty || 'medium';
        this.match.rivalName = opts.rivalName || (mode === 'offline_ai' ? 'IA Táctica' : 'Rival Online');
        this.match.rivalCode = opts.rivalCode || 'MENG-4109';
        this.match.roomCode = opts.roomCode || '';

        this.match.active = true;
        this.match.homeScore = 0;
        this.match.awayScore = 0;
        this.match.playsElapsed = 0;
        this.match.maxPlays = 12; // 12 turnos fijos (6 por jugador)
        this.match.possession = 'home'; // Turno 1 siempre inicia el jugador ('home')
        this.match.ballZone = 0;
        this.match.ballLane = 'center';
        this.match.homeMomentum = 0;
        this.match.awayMomentum = 0;
        this.match.isSuddenDeath = false;
        this.match.suddenDeathRound = 0;
        this.match.matchCorrectAnswers = 0;
        this.match.matchTotalQuestions = 0;

        const postModal = document.getElementById('soccer-postmatch-modal');
        if (postModal) postModal.style.display = 'none';
        const quizModal = document.getElementById('soccer-quiz-modal');
        if (quizModal) quizModal.style.display = 'none';

        this.switchTab('match');
        this.init3DStadiumIfNeeded();
        this.startLoop();
        this.positionPlayersForTacticalState(true);
        this.updateScoreboardHUD();
        this.prepareNextTacticalPlay();
      };

      if (typeof window !== 'undefined' && window.AssetDownloadManager && typeof window.AssetDownloadManager.requireAssetPack === 'function') {
        window.AssetDownloadManager.requireAssetPack({
          packId: 'soccer',
          glbUrl: 'assets/models/soccer/soccer_pack.glb',
          title: 'MasterGoal 3D: Estadio Táctico',
          category: 'sports',
          estimatedMB: 1.02,
          onReady: (blobUrl) => {
            this.soccerGlbUrl = blobUrl || 'assets/models/soccer/soccer_pack.glb';
            startMatchCore();
          },
          onCancel: () => {
            console.log('[SoccerTactics3D] Entrada a partido cancelada por el usuario.');
            this.switchTab('lobby');
          }
        });
      } else {
        startMatchCore();
      }
    },

    updateScoreboardHUD: function () {
      const scoreEl = document.getElementById('soccerTvScore');
      const awayLabel = document.getElementById('soccerTvAwayLabel');
      const clockEl = document.getElementById('soccerTvClock');
      const zoneBadge = document.getElementById('soccerZoneBadge');
      const momPill = document.getElementById('soccerMomentumPill');

      if (scoreEl) scoreEl.textContent = `${this.match.homeScore} - ${this.match.awayScore}`;
      if (awayLabel) {
        awayLabel.textContent = this.match.rivalName.toUpperCase();
      }

      if (this.match.isSuddenDeath) {
        if (clockEl) clockEl.textContent = `90+' PENALES MUERTE SÚBITA`;
      } else {
        const turnIdx = Math.min(this.match.maxPlays - 1, this.match.playsElapsed);
        const minute = this.TURN_MINUTES[turnIdx] || 90;
        if (clockEl) {
          clockEl.textContent = `${String(minute).padStart(2, '0')}' (Turno ${Math.min(this.match.maxPlays, this.match.playsElapsed + 1)}/${this.match.maxPlays})`;
        }
      }

      if (zoneBadge) {
        const zm = TACTICAL_ZONES_META[String(this.match.ballZone)] || TACTICAL_ZONES_META['0'];
        zoneBadge.textContent = zm.nameEs;
      }

      if (momPill) {
        const charges = Math.min(2, this.match.homeMomentum || 0);
        momPill.textContent = charges >= 2 ? 'Momentum: 2/2 (¡TIRO DIRECTO LISTO!)' : `Momentum: ${charges}/2`;
        momPill.classList.toggle('ready', charges >= 2);
      }
    },

    // Determina el tiempo de respuesta simulado del rival (para Duelo de Velocidad)
    getSimulatedRivalPerformance: function () {
      let accProb = 0.72;
      let minSec = 2.6;
      let maxSec = 5.4;

      if (this.match.mode === 'offline_ai') {
        if (this.match.offlineDifficulty === 'basic') {
          accProb = 0.55;
          minSec = 3.8;
          maxSec = 6.8;
        } else if (this.match.offlineDifficulty === 'hard') {
          accProb = 0.85;
          minSec = 1.9;
          maxSec = 4.1;
        }
      } else if (this.match.mode === 'ranked_online') {
        const div = this.profile.division || 10;
        accProb = Math.min(0.88, 0.62 + (10 - div) * 0.025);
        minSec = Math.max(1.8, 3.2 - (10 - div) * 0.12);
        maxSec = Math.max(3.6, 5.6 - (10 - div) * 0.15);
      } else {
        // 1v1 con Amigo
        accProb = 0.75;
        minSec = 2.4;
        maxSec = 5.2;
      }

      const rivalCorrect = Math.random() < accProb;
      const rivalTime = Number((minSec + Math.random() * (maxSec - minSec)).toFixed(2));
      return { correct: rivalCorrect, timeSec: rivalTime };
    },

    prepareNextTacticalPlay: function () {
      if (!this.match.active) return;

      // Verificar si se completaron los 12 turnos reglamentarios (90')
      if (this.match.playsElapsed >= this.match.maxPlays) {
        if (this.match.homeScore === this.match.awayScore) {
          this.launchSuddenDeathPenalty();
          return;
        }
        this.finishMatch();
        return;
      }

      // Regla de Alternancia Estricta 1 a 1:
      // Turno par (0, 2, 4, 6, 8, 10) -> Juega 'home' (Tú)
      // Turno impar (1, 3, 5, 7, 9, 11) -> Juega 'away' (Rival)
      this.match.possession = (this.match.playsElapsed % 2 === 0) ? 'home' : 'away';

      this.updateScoreboardHUD();
      this.positionPlayersForTacticalState(false);

      // Si es el turno del Rival (Turno impar), mostrar fase de defensa interactiva
      if (this.match.possession === 'away') {
        this.prepareDefensivePhase();
        return;
      }

      // Turno del jugador ('home'): calcular opciones de avance y disparo
      const curZone = this.match.ballZone;
      const hasMaxMomentum = this.match.homeMomentum >= 2;
      const nextZone = Math.min(2, curZone + (hasMaxMomentum ? 2 : 1));
      const inShootingRange = (curZone >= 1) || hasMaxMomentum;

      const options = [
        {
          id: 'opt_short',
          type: 'pass',
          zone: Math.min(2, curZone + 1),
          lane: 'center',
          titleEn: 'Short Pass (Center)',
          titleEs: 'Pase Corto por el Centro (+1 Zona)',
          vocabCategory: 'pass'
        },
        {
          id: 'opt_wing',
          type: 'through',
          zone: nextZone,
          lane: this.match.ballLane === 'left' ? 'right' : 'left',
          titleEn: hasMaxMomentum ? 'Momentum Long Pass (+2 Zones)' : 'Through Ball to Wing',
          titleEs: hasMaxMomentum ? 'Pase Largo con Momentum (+2 Zonas)' : 'Pase Filtrado a la Banda (+1 Zona)',
          vocabCategory: 'pass'
        }
      ];

      if (inShootingRange) {
        options.push({
          id: 'opt_shoot',
          type: 'shot',
          zone: 2,
          lane: 'center',
          titleEn: hasMaxMomentum && curZone < 1 ? 'Momentum Long-Range Shot!' : 'Shoot at Goal!',
          titleEs: hasMaxMomentum && curZone < 1 ? '¡Disparo Directo con Momentum!' : '¡Disparo Directo a Portería!',
          vocabCategory: 'shot'
        });
      } else {
        options.push({
          id: 'opt_dribble',
          type: 'dribble',
          zone: Math.min(2, curZone + 1),
          lane: this.match.ballLane,
          titleEn: 'Fast Dribble Forward',
          titleEs: 'Regatear y Avanzar en tu Carril',
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
        const turnNum = Math.min(this.match.maxPlays, this.match.playsElapsed + 1);
        promptEl.textContent = `Tu Turno (Jugada ${turnNum}/${this.match.maxPlays}): Elige tu jugada en cancha`;
      }
      if (!btnContainer) return;

      btnContainer.innerHTML = options.map((opt, idx) => {
        const shootClass = opt.type === 'shot' ? 'shoot' : '';
        return `
          <button type="button" class="soccer-node-btn ${shootClass}" onclick="window.SoccerTactics3D.selectTacticalOption(${idx})">
            <span>${opt.titleEn}</span>
            <span style="font-size:11px;color:#cbd5e1;font-weight:700;">${opt.titleEs}</span>
          </button>
        `;
      }).join('');
    },

    selectTacticalOption: function (optionIndex) {
      const opt = this.match.currentOptions[optionIndex];
      if (!opt) return;
      this.match.selectedOption = opt;

      const startVec = this.ballMesh ? this.ballMesh.position.clone() : new THREE.Vector3(0, 0.5, 0);
      let targetVec;
      if (opt.type === 'shot') {
        targetVec = new THREE.Vector3(41.5, 2.5, 3.1);
      } else {
        const x = (TACTICAL_ZONES_META[String(opt.zone)] || TACTICAL_ZONES_META['0']).x;
        const z = (TACTICAL_LANES_META[opt.lane] || TACTICAL_LANES_META.center).z;
        targetVec = new THREE.Vector3(x, 0.48, z);
      }
      this.drawTacticalCurveArrow(startVec, targetVec, opt.type === 'shot' ? 0xfbbf24 : 0x38bdf8);

      this.launchTacticalQuiz(false, opt);
    },

    prepareDefensivePhase: function () {
      const promptEl = document.getElementById('soccerPossessionPrompt');
      const btnContainer = document.getElementById('soccerNodeButtons');
      const turnNum = Math.min(this.match.maxPlays, this.match.playsElapsed + 1);
      if (promptEl) {
        promptEl.textContent = `Turno del Rival (Jugada ${turnNum}/${this.match.maxPlays}): Responde más rápido para robar el balón`;
      }
      if (btnContainer) {
        btnContainer.innerHTML = `
          <button type="button" class="soccer-node-btn shoot" onclick="window.SoccerTactics3D.launchTacticalQuiz(true, null)">
            <span>Defender Jugada Rival</span>
            <span style="font-size:11px;color:#fca5a5;font-weight:700;">Si respondes más rápido que el rival, cortas su avance</span>
          </button>
        `;
      }
      setTimeout(() => {
        if (this.match.active && this.match.possession === 'away' && !this.match.isSuddenDeath) {
          this.launchTacticalQuiz(true, null);
        }
      }, 600);
    },

    pickQuestionForContext: function (isDefense, option) {
      let allowedLevels = ['basic', 'intermediate', 'advanced'];
      if (this.match.mode === 'offline_ai') {
        if (this.match.offlineDifficulty === 'basic') allowedLevels = ['basic'];
        else if (this.match.offlineDifficulty === 'medium') allowedLevels = ['basic', 'intermediate'];
      } else {
        const div = this.profile.division || 10;
        if (div >= 8) allowedLevels = ['basic', 'intermediate'];
        else if (div <= 3) allowedLevels = ['intermediate', 'advanced'];
      }

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

      const direction = Math.random() < 0.5 ? 'ES_TO_EN' : 'EN_TO_ES';
      const choices = [target, distractors[0], distractors[1]].sort(() => Math.random() - 0.5);

      return {
        target: target,
        direction: direction,
        choices: choices,
        isDefense: Boolean(isDefense),
        isSuddenDeath: Boolean(this.match.isSuddenDeath)
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
      const subEl = document.getElementById('soccerSpeedDuelSub');
      const dirEl = document.getElementById('soccerQuizDirection');
      const mainEl = document.getElementById('soccerQuizPromptMain');
      const optsEl = document.getElementById('soccerQuizOptions');
      const timerTxt = document.getElementById('soccerQuizTimerText');
      const timerFill = document.getElementById('soccerQuizTimerFill');

      if (!modal || !mainEl || !optsEl) return;

      if (card) card.classList.toggle('defense-mode', isDefense);
      if (badge) {
        if (this.match.isSuddenDeath) {
          badge.textContent = 'PENAL DE MUERTE SÚBITA POR VELOCIDAD';
        } else if (isDefense) {
          badge.textContent = `TURNO RIVAL (${this.match.playsElapsed + 1}/12) • DEFENSA`;
        } else {
          badge.textContent = `TU TURNO (${this.match.playsElapsed + 1}/12) • ${option && option.type === 'shot' ? 'DISPARO A GOL' : 'AVANCE'}`;
        }
      }

      if (subEl) {
        subEl.textContent = this.match.isSuddenDeath
          ? '¡Muerte Súbita! Quien toque la respuesta correcta en menos segundos anota el gol de la victoria.'
          : 'Duelo de Velocidad: si ambos aciertan, gana la jugada quien responda en menos segundos.';
      }

      if (quiz.direction === 'ES_TO_EN') {
        if (dirEl) dirEl.textContent = 'TRADUCE AL INGLÉS';
        mainEl.textContent = `"${quiz.target.es}"`;
      } else {
        if (dirEl) dirEl.textContent = 'SELECCIONA EL SIGNIFICADO EN ESPAÑOL';
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
      const elapsed = Number(((performance.now() - this.match.quizStartTime) / 1000).toFixed(2));
      this.clearQuizTimer();
      const isCorrect = choiceId === this.match.currentQuiz.target.id;
      this.speakEnglishTerm(this.match.currentQuiz.target.en);
      this.resolveQuizOutcome(isCorrect, elapsed);
    },

    // =========================================================================
    // RESOLUCIÓN CON DUELO DE VELOCIDAD, MOMENTUM Y ALTERNANCIA 1 A 1
    // =========================================================================
    resolveQuizOutcome: function (isCorrect, playerSeconds) {
      const modal = document.getElementById('soccer-quiz-modal');
      if (modal) modal.style.display = 'none';

      this.match.matchTotalQuestions += 1;
      this.profile.questionsAnswered += 1;
      if (isCorrect) {
        this.match.matchCorrectAnswers += 1;
        this.profile.questionsCorrect += 1;
        this.match.homeMomentum = Math.min(2, (this.match.homeMomentum || 0) + 1);
      } else {
        this.match.homeMomentum = 0;
      }

      const rivalPerf = this.getSimulatedRivalPerformance();
      const quiz = this.match.currentQuiz;
      this.match.currentQuiz = null;

      // Caso 1: Muerte Súbita (Tanda Relámpago de Penales por Velocidad tras empate 90')
      if (this.match.isSuddenDeath) {
        const playerWonPenalty = isCorrect && (!rivalPerf.correct || playerSeconds <= rivalPerf.timeSec);
        if (playerWonPenalty) {
          this.match.homeScore += 1;
          this.profile.goalsScored += 1;
          this.animateBallToGoal('home');
          this.showEventBanner(`¡GOL DE ORO! (${playerSeconds}s vs ${rivalPerf.timeSec}s del rival)`, '#10b981');
        } else {
          this.match.awayScore += 1;
          this.profile.goalsConceded += 1;
          this.animateBallToGoal('away');
          this.showEventBanner(`Gol Rival en Muerte Súbita (${rivalPerf.timeSec}s)`, '#ef4444');
        }
        this.updateScoreboardHUD();
        setTimeout(() => this.finishMatch(), 1250);
        return;
      }

      // Incrementar contador de turnos (avanza de Turno par -> Turno impar o viceversa)
      this.match.playsElapsed += 1;

      if (quiz && quiz.isDefense) {
        // TURNO DEL RIVAL (Tú defiendes):
        // Si ambos aciertan, comparamos velocidad (playerSeconds vs rivalPerf.timeSec)
        const playerStopsRival = isCorrect && (!rivalPerf.correct || playerSeconds <= rivalPerf.timeSec);

        if (playerStopsRival) {
          this.triggerGoalkeeperOrDefenderAnimation('home');
          // Al robar con éxito, empujas el balón 1 zona hacia campo rival
          this.match.ballZone = Math.min(1, this.match.ballZone + 1);
          this.animateBallPassToNode(this.match.ballZone, 'center');
          const speedMsg = rivalPerf.correct
            ? `¡Más rápido! (${playerSeconds}s vs ${rivalPerf.timeSec}s) Recuperas y avanzas`
            : `¡Intercepción limpia! (${playerSeconds}s) Recuperas el balón`;
          this.showEventBanner(speedMsg, '#10b981');
        } else {
          // El rival gana la jugada ofensiva
          if (this.match.ballZone <= -1) {
            this.match.awayScore += 1;
            this.profile.goalsConceded += 1;
            this.animateBallToGoal('away');
            this.showEventBanner(`Gol del Rival (${rivalPerf.timeSec}s)`, '#ef4444');
            this.match.ballZone = 0;
            this.match.ballLane = 'center';
          } else {
            // El rival empuja el balón hacia tu arco
            const step = rivalPerf.timeSec < 2.8 ? 2 : 1;
            this.match.ballZone = Math.max(-2, this.match.ballZone - step);
            this.animateBallPassToNode(this.match.ballZone, this.match.ballLane);
            const reason = isCorrect
              ? `El rival respondió más rápido (${rivalPerf.timeSec}s vs ${playerSeconds}s)`
              : `El rival supera tu línea defensiva`;
            this.showEventBanner(reason, '#f59e0b');
          }
        }
      } else {
        // TU TURNO DE ATAQUE:
        const opt = this.match.selectedOption || { type: 'pass', zone: Math.min(2, this.match.ballZone + 1), lane: 'center' };
        const playerWinsDuel = isCorrect && (!rivalPerf.correct || playerSeconds <= rivalPerf.timeSec);

        if (playerWinsDuel) {
          if (opt.type === 'shot') {
            this.animateBallToGoal('home');
            this.match.homeScore += 1;
            this.profile.goalsScored += 1;
            this.match.homeMomentum = 0;
            const shotMsg = rivalPerf.correct
              ? `¡GOL POR VELOCIDAD! (${playerSeconds}s vs ${rivalPerf.timeSec}s)`
              : `¡GOLAZO! Definición perfecta (${playerSeconds}s)`;
            this.showEventBanner(shotMsg, '#fbbf24');
            this.match.ballZone = 0;
            this.match.ballLane = 'center';
          } else {
            // Si respondió muy rápido (<3.0s) o usó Momentum, empuja hasta Zona +1/+2 para garantizar tiro en el siguiente turno propio
            let targetZone = opt.zone;
            if (playerSeconds < 3.0 && targetZone < 1) {
              targetZone = Math.min(2, targetZone + 1);
            }
            if (targetZone > this.match.ballZone + 1) {
              this.match.homeMomentum = 0; // Consumió carga de pase largo
            }
            this.animateBallPassToNode(targetZone, opt.lane);
            this.match.ballZone = targetZone;
            this.match.ballLane = opt.lane;
            const winMsg = rivalPerf.correct
              ? `¡Ganaste por velocidad (${playerSeconds}s vs ${rivalPerf.timeSec}s)! Avanzas a ${TACTICAL_ZONES_META[String(targetZone)].nameEs}`
              : `¡Pase completado (${playerSeconds}s)! Avanzas a ${TACTICAL_ZONES_META[String(targetZone)].nameEs}`;
            this.showEventBanner(winMsg, '#38bdf8');
          }
        } else if (isCorrect && rivalPerf.correct && playerSeconds > rivalPerf.timeSec) {
          // Ambos acertaron pero el defensor rival fue más rápido: aun así avanzas 1 zona por contestar bien si tenías Momentum, o se disputa en mediocampo
          if (this.match.homeMomentum >= 2) {
            const forcedZone = Math.min(2, this.match.ballZone + 1);
            this.match.homeMomentum = 0;
            this.animateBallPassToNode(forcedZone, opt.lane);
            this.match.ballZone = forcedZone;
            this.showEventBanner(`Momentum rompe el bloqueo rival (${playerSeconds}s). Avanzas a ${TACTICAL_ZONES_META[String(forcedZone)].nameEs}`, '#38bdf8');
          } else {
            this.showEventBanner(`Ambos acertaron, pero el rival cerró antes (${rivalPerf.timeSec}s vs ${playerSeconds}s). Turno rival`, '#f59e0b');
          }
        } else {
          // Respuesta incorrecta o tiempo agotado
          this.showEventBanner('Pase interceptado por el rival. Ahora te toca defender', '#ef4444');
        }
      }

      this.updateScoreboardHUD();

      setTimeout(() => {
        this.prepareNextTacticalPlay();
      }, 1150);
    },

    launchSuddenDeathPenalty: function () {
      this.match.isSuddenDeath = true;
      this.match.suddenDeathRound += 1;
      this.match.ballZone = 2;
      this.match.ballLane = 'center';
      this.positionPlayersForTacticalState(false);
      this.updateScoreboardHUD();
      this.showEventBanner('90\' EMPATE • ¡PENAL DE MUERTE SÚBITA POR VELOCIDAD!', '#fbbf24');

      setTimeout(() => {
        if (this.match.active) {
          this.launchTacticalQuiz(false, { type: 'shot', zone: 2, lane: 'center', vocabCategory: 'shot' });
        }
      }, 900);
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
        duration: 650
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
        duration: 720
      };

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
        : 0;

      const isRanked = this.match.mode === 'ranked_online';
      const isPractice = this.match.mode === 'offline_ai';

      this.profile.matchesPlayed += 1;
      let rpDelta = 0;
      let resultTitle = 'PARTIDO FINALIZADO';
      let resultIcon = '⚽';

      if (hs > as) {
        this.profile.wins += 1;
        this.profile.currentStreak += 1;
        this.profile.bestStreak = Math.max(this.profile.bestStreak, this.profile.currentStreak);
        if (isRanked) {
          const accBonus = acc >= 80 ? 8 : (acc >= 60 ? 4 : 0);
          rpDelta = 30 + accBonus;
        }
        resultTitle = '¡VICTORIA!';
        resultIcon = '🏆';
      } else if (hs < as) {
        this.profile.losses += 1;
        this.profile.currentStreak = 0;
        if (isRanked) {
          rpDelta = -12;
        }
        resultTitle = 'DERROTA';
        resultIcon = '⚡';
      } else {
        this.profile.draws += 1;
        if (isRanked) rpDelta = 5;
      }

      if (isRanked) {
        this.profile.rp = Math.max(0, this.profile.rp + rpDelta);
      }
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
        if (isPractice) {
          rpEl.textContent = `Modo Práctica Offline (Sin cambios de RP • Total: ${this.profile.rp} RP)`;
          rpEl.style.color = '#38bdf8';
        } else if (this.match.mode === 'friend_duel') {
          rpEl.textContent = `Duelo Amistoso 1v1 vs ${this.match.rivalName} (Total: ${this.profile.rp} RP)`;
          rpEl.style.color = '#60a5fa';
        } else {
          const sign = rpDelta >= 0 ? '+' : '';
          rpEl.textContent = `${sign}${rpDelta} RP • ${newTier.title} • Total: ${this.profile.rp} RP`;
          rpEl.style.color = rpDelta >= 0 ? '#34d399' : '#f87171';
        }
      }
      if (statsEl) {
        statsEl.innerHTML = `Precisión en el partido: <strong>${acc}%</strong> (${this.match.matchCorrectAnswers}/${this.match.matchTotalQuestions})<br>Racha actual: <strong>${this.profile.currentStreak}</strong>`;
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

      const pulse = 1 + Math.sin(now * 0.006) * 0.07;
      Object.keys(this.nodesMap).forEach((key) => {
        const n = this.nodesMap[key];
        if (n.userData.isSelectableOption) {
          n.scale.set(pulse, 1, pulse);
        } else {
          n.scale.set(1, 1, 1);
        }
      });

      this.camera.position.x += (this.cameraTargetPos.x - this.camera.position.x) * 0.06;
      this.camera.position.y += (this.cameraTargetPos.y - this.camera.position.y) * 0.06;
      this.camera.position.z += (this.cameraTargetPos.z - this.camera.position.z) * 0.06;
      this.camera.lookAt(this.cameraLookAtPos.x, this.cameraLookAtPos.y, this.cameraLookAtPos.z);

      this.renderer.render(this.scene, this.camera);
    },

    handleUniversalBack: function (event) {
      if (event && event.stopPropagation) event.stopPropagation();
      if (this.activeTab === 'match') {
        this.pauseLoop();
        this.switchTab('lobby');
      } else {
        this.dispose();
        if (typeof window.returnToMainPortals === 'function') {
          window.returnToMainPortals(event);
        } else if (typeof window.navigateTo === 'function') {
          window.navigateTo('view-home');
        }
      }
    },

    dispose: function () {
      this.pauseLoop();
      if (this.scene) {
        try {
          this.scene.traverse((obj) => {
            if (obj.isMesh) {
              if (obj.geometry && typeof obj.geometry.dispose === 'function') obj.geometry.dispose();
              if (obj.material) {
                if (Array.isArray(obj.material)) {
                  obj.material.forEach((m) => { if (m && typeof m.dispose === 'function') m.dispose(); });
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
      this.pitchGroup = null;
      this.ballMesh = null;
      this.homePlayers = [];
      this.awayPlayers = [];
      this.nodesMap = {};
      this.blenderSoccerPack = null;
    }
  };

  window.SoccerTactics3D = SoccerTactics3D;
  window.openSoccerTacticsPortal = function () {
    SoccerTactics3D.openPortal();
  };
  window.backToPortalsMenu = function (e) {
    if (window.SoccerTactics3D && typeof window.SoccerTactics3D.handleUniversalBack === 'function') {
      window.SoccerTactics3D.handleUniversalBack(e);
    } else if (typeof window.returnToMainPortals === 'function') {
      window.returnToMainPortals(e);
    }
  };
})();

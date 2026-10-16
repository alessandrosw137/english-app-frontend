// scripts/build_unified_app.js
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
const rawHtml = fs.readFileSync(htmlPath, 'utf8');

function extractBlock(txt, startMarker, endMarker, fromIndex = 0) {
  const start = txt.indexOf(startMarker, fromIndex);
  if (start === -1) return null;
  const end = txt.indexOf(endMarker, start);
  if (end === -1) return null;
  return txt.substring(start, end + endMarker.length);
}

// Extract the rich datasets intact
const musicTracksJs = extractBlock(rawHtml, 'const MUSIC_SESSION_TRACKS = [', '];');
const storiesDataJs = extractBlock(rawHtml, 'const STORIES_DATA = [', '];');
const worldTourDataJs = extractBlock(rawHtml, 'const WORLD_TOUR_SCENARIOS = {', '};');

console.log('Datasets extracted successfully:');
console.log('- Music tracks:', musicTracksJs ? musicTracksJs.length : 0, 'bytes');
console.log('- Stories data:', storiesDataJs ? storiesDataJs.length : 0, 'bytes');
console.log('- World tour data:', worldTourDataJs ? worldTourDataJs.length : 0, 'bytes');

if (!musicTracksJs || !storiesDataJs || !worldTourDataJs) {
  console.error('❌ Could not extract all datasets! Aborting.');
  process.exit(1);
}

// Generate the unified HTML content
const unifiedHtml = `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="author" content="Wilberth Alessandro Molina Cutz">
  <title>ENGLISH APP - Desarrollado por: Wilberth Alessandro Molina Cutz</title>

  <!-- Google Identity Services (GIS) Oficial -->
  <script src="https://accounts.google.com/gsi/client" async defer></script>

  <!-- Librerías de soporte -->
  <script src="tailwind.js"></script>
  <script src="three.min.js"></script>
  <script src="master_data.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          colors: {
            appbg: '#0f172a',
            appcard: '#1e293b',
          }
        }
      }
    }
  </script>

  <style>
    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }
    html, body {
      background-color: #0f172a;
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      min-height: 100vh;
      user-select: none;
    }
    input, textarea, select {
      user-select: text;
    }

    /* Scrollbar estilizada */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #0f172a;
    }
    ::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 99px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #475569;
    }

    /* ========================================================
       CARRUSEL CILÍNDRICO VERTICAL 3D (PARK CAROUSEL STYLE)
       ======================================================== */
    .cylinder-viewport {
      perspective: 1200px;
      perspective-origin: 50% 50%;
      overflow: hidden;
      position: relative;
    }
    .cylinder-ring {
      position: relative;
      width: 100%;
      height: 380px;
      transform-style: preserve-3d;
      transition: transform 0.65s cubic-bezier(0.2, 0.85, 0.25, 1);
    }
    .cylinder-portal-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 380px;
      backface-visibility: hidden;
      transform-origin: center center;
      transition: opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease;
      cursor: pointer;
    }
    .cylinder-portal-item.active-portal {
      opacity: 1;
      filter: drop-shadow(0 0 35px var(--portal-glow)) brightness(1.05);
      z-index: 30;
      pointer-events: auto;
    }
    .cylinder-portal-item.inactive-portal {
      opacity: 0.35;
      filter: grayscale(40%) blur(0.6px);
      z-index: 10;
      pointer-events: auto;
    }
    .cylinder-portal-item.inactive-portal:hover {
      opacity: 0.6;
    }

    /* Animaciones de Arcos Dimensionales */
    @keyframes portalSpinSlow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes portalSpinReverse {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes portalPulseGlow {
      0%, 100% { filter: drop-shadow(0 0 16px currentColor) brightness(1); }
      50% { filter: drop-shadow(0 0 32px currentColor) brightness(1.3); }
    }
    .animate-spin-slow {
      animation: portalSpinSlow 24s linear infinite;
    }
    .animate-spin-reverse-slow {
      animation: portalSpinReverse 32s linear infinite;
    }
    .animate-pulse-glow {
      animation: portalPulseGlow 3.5s ease-in-out infinite;
    }

    /* Loading Screen Animations */
    @keyframes loaderRingPulse {
      0%, 100% { transform: scale(0.96) rotate(0deg); opacity: 0.8; }
      50% { transform: scale(1.04) rotate(180deg); opacity: 1; }
    }
    .animate-loader-ring {
      animation: loaderRingPulse 2.8s ease-in-out infinite;
    }

    /* Draggable Widgets */
    .draggable-widget {
      cursor: grab;
      touch-action: none;
      user-select: none;
    }
    .draggable-widget:active {
      cursor: grabbing;
    }
  </style>
</head>
<body class="bg-[#0f172a] text-slate-100 min-h-screen flex flex-col">

  <!-- ========================================================
       ENCABEZADO SUPERIOR FIJO
       ======================================================== -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800/80 h-14 flex items-center justify-between px-3 sm:px-6">
    <div class="flex items-center gap-3">
      <div onclick="goToHomePortals()" class="flex items-center gap-2 cursor-pointer group">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition">
          EN
        </div>
        <div>
          <h1 class="text-xs sm:text-sm font-extrabold tracking-wider bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
            ENGLISH APP
          </h1>
          <p class="text-[9px] text-slate-400 hidden sm:block">Por: Wilberth Alessandro Molina Cutz</p>
        </div>
      </div>
    </div>

    <!-- Indicador de Red + Nivel & EXP + Botón de Perfil -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Indicador de conexión -->
      <div id="headerConnStatus" class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-300 font-mono">
        <span id="headerConnDot" class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span id="headerConnText" class="hidden sm:inline">Online</span>
      </div>

      <!-- Badge de Nivel y EXP -->
      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-amber-500/30 text-xs font-bold text-amber-300 shadow-sm">
        <span id="userRankMedal">🥉</span>
        <span id="headerUserRank">Bronce</span>
        <span class="text-slate-500 font-normal">|</span>
        <span id="headerUserExp" class="text-amber-400">0 EXP</span>
      </div>

      <!-- Botón de Perfil -->
      <button id="headerProfileBtn" onclick="openProfileModal()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs transition shadow-md shadow-sky-600/30 cursor-pointer active:scale-95">
        <span id="headerAvatarText" class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">👤</span>
        <span class="hidden sm:inline">Perfil</span>
      </button>
    </div>
  </header>

  <!-- ESPACIADOR PARA HEADER FIJO -->
  <div class="h-14"></div>

  <!-- ========================================================
       WIDGETS FLOTANTES ARRASTRABLES (DRAGGABLE)
       ======================================================== -->

  <!-- 1. ROBOT ASISTENTE IA ARRASTRABLE (Oculto en view-home y view-auth) -->
  <div id="draggableRobotWidget" class="draggable-widget fixed z-50 flex items-center justify-center hidden" style="bottom: 90px; right: 24px;">
    <div onclick="handleRobotWidgetClick(event)" class="relative group cursor-pointer">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 p-0.5 shadow-xl shadow-sky-500/30 group-hover:scale-110 transition duration-300">
        <div class="w-full h-full rounded-[14px] bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
          <!-- Antena del robot con halo -->
          <div class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping absolute top-1.5"></div>
          <svg class="w-7 h-7 text-sky-400 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="14" rx="4"></rect>
            <circle cx="9" cy="11" r="1.5" fill="#38bdf8"></circle>
            <circle cx="15" cy="11" r="1.5" fill="#38bdf8"></circle>
            <path d="M9 15h6"></path>
          </svg>
        </div>
      </div>
      <div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900"></div>
    </div>
  </div>

  <!-- 2. RULETA DE PREGUNTAS ARRASTRABLE (3D / Vectorial) -->
  <div id="draggableRouletteWidget" class="draggable-widget fixed z-50 flex items-center justify-center" style="bottom: 90px; left: 24px;">
    <div onclick="handleRouletteWidgetClick(event)" class="relative group cursor-pointer" title="Girar Ruleta de Preguntas para ganar +15 EXP">
      <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-1 shadow-xl shadow-rose-500/30 group-hover:scale-110 transition duration-300">
        <div class="w-full h-full rounded-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
          <!-- Silueta vectorial de ruleta con segmentos de colores -->
          <svg class="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
            <!-- Segmentos -->
            <path d="M50 50 L50 0 A50 50 0 0 1 100 50 Z" fill="#f43f5e" opacity="0.85"></path>
            <path d="M50 50 L100 50 A50 50 0 0 1 50 100 Z" fill="#8b5cf6" opacity="0.85"></path>
            <path d="M50 50 L50 100 A50 50 0 0 1 0 50 Z" fill="#06b6d4" opacity="0.85"></path>
            <path d="M50 50 L0 50 A50 50 0 0 1 50 0 Z" fill="#10b981" opacity="0.85"></path>
            <circle cx="50" cy="50" r="14" fill="#0f172a" stroke="#fbbf24" stroke-width="3"></circle>
          </svg>
          <!-- Puntero indicador superior -->
          <div class="absolute top-0 w-2.5 h-2.5 bg-amber-400 rotate-45 transform -translate-y-1 shadow"></div>
          <span class="absolute text-[11px] font-black text-amber-300">🎯</span>
        </div>
      </div>
      <!-- Insignia flotante "+15 EXP" -->
      <span class="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] shadow animate-bounce">
        +15
      </span>
    </div>
  </div>

  <!-- ========================================================
       PANTALLA DE CARGA Y ANTI-LAG (LOADING SCREEN)
       ======================================================== -->
  <div id="portalLoadingScreen" class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-2xl transition-opacity duration-300 opacity-0 pointer-events-none">
    <div class="relative flex flex-col items-center max-w-sm px-6 text-center">
      <!-- Resplandor dinámico de fondo -->
      <div id="portalLoadingGlow" class="absolute w-64 h-64 rounded-full blur-3xl opacity-30 -z-10 bg-sky-500 transition-colors duration-500"></div>

      <!-- Anillos orbitales giratorios -->
      <div class="relative w-28 h-28 mb-6 flex items-center justify-center">
        <div id="portalLoadingRing1" class="absolute inset-0 rounded-full border-2 border-dashed border-sky-400 animate-spin-slow"></div>
        <div id="portalLoadingRing2" class="absolute inset-2 rounded-full border-2 border-indigo-400/70 animate-spin-reverse-slow"></div>
        <div id="portalLoadingIcon" class="text-3xl animate-bounce">🚀</div>
      </div>

      <h3 class="text-lg font-extrabold tracking-wide text-white mb-1">
        Cargando entorno...
      </h3>
      <p id="portalLoadingSubtitle" class="text-xs text-slate-300 mb-6 font-medium">
        Preparando entorno interactivo...
      </p>

      <!-- Barra de progreso con relleno dinámico -->
      <div class="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden border border-slate-700/70 p-0.5 shadow-inner">
        <div id="portalLoadingProgressBar" class="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 transition-all duration-300" style="width: 15%;"></div>
      </div>
      <span id="portalLoadingPercent" class="text-[10px] font-mono text-slate-400 mt-2">15%</span>
    </div>
  </div>

  <!-- ========================================================
       VISTA 1: AUTENTICACIÓN (LOGIN, REGISTRO & GOOGLE GIS)
       ======================================================== -->
  <div id="view-auth" class="flex-1 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/40 relative overflow-hidden">
      <!-- Acentos decorativos de fondo -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="text-center mb-6">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-sky-500/30 mb-3">
          EN
        </div>
        <h2 class="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent">
          Bienvenido a English App
        </h2>
        <p class="text-xs text-slate-400 mt-1">
          Plataforma inmersiva de inglés &bull; Wilberth Alessandro Molina Cutz
        </p>
      </div>

      <!-- BOTÓN OFICIAL: INICIAR SESIÓN CON GOOGLE (GIS) -->
      <div class="mb-5">
        <button onclick="handleGoogleSignInClick()" class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm transition shadow-lg shadow-white/10 active:scale-98 cursor-pointer">
          <!-- Logo oficial SVG de Google -->
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Iniciar sesión con Google</span>
        </button>
      </div>

      <div class="relative flex items-center justify-center my-4">
        <div class="border-t border-slate-700/80 w-full"></div>
        <span class="bg-[#0f172a] px-3 text-[11px] text-slate-400 uppercase tracking-widest font-semibold">o continuar con cuenta</span>
        <div class="border-t border-slate-700/80 w-full"></div>
      </div>

      <!-- PESTAÑAS: INICIAR SESIÓN VS REGISTRARSE -->
      <div class="flex rounded-2xl bg-slate-800/80 p-1 mb-5 border border-slate-700/60">
        <button id="authTabBtnLogin" onclick="switchAuthTab('login')" class="flex-1 py-2 text-xs font-bold rounded-xl transition bg-sky-600 text-white shadow">
          Iniciar Sesión
        </button>
        <button id="authTabBtnRegister" onclick="switchAuthTab('register')" class="flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-400 hover:text-slate-200">
          Registrarse
        </button>
      </div>

      <!-- FORMULARIO 1: INICIAR SESIÓN -->
      <form id="authLoginForm" onsubmit="handleAuthLoginSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Usuario o Correo Electrónico</label>
          <input type="text" id="authLoginIdentifier" required placeholder="ej. usuario o correo@gmail.com" class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
          <input type="password" id="authLoginPassword" required placeholder="••••••••" class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <button type="submit" class="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-sm transition shadow-lg shadow-sky-600/30 cursor-pointer active:scale-98">
          Entrar a mi Cuenta
        </button>
      </form>

      <!-- FORMULARIO 2: REGISTRARSE (SIGN UP) -->
      <form id="authRegisterForm" onsubmit="handleAuthRegisterSubmit(event)" class="space-y-4 hidden">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Nombre de Usuario (Único)</label>
          <input type="text" id="authRegUsername" required placeholder="ej. alessandro_26" class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
          <input type="email" id="authRegEmail" required placeholder="correo@ejemplo.com" class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
          <input type="password" id="authRegPassword" required minlength="4" placeholder="Mínimo 4 caracteres" class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition">
        </div>
        <button type="submit" class="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-98">
          Crear Cuenta en PostgreSQL
        </button>
      </form>

      <div class="mt-5 pt-4 border-t border-slate-800 text-center">
        <button onclick="handleGuestAccess()" class="text-xs font-bold text-slate-400 hover:text-sky-300 transition cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-800/50">
          ⚡ Continuar como Invitado (Acceso Rápido)
        </button>
      </div>
    </div>
  </div>

  <!-- ========================================================
       VISTA 2: MENÚ DE PORTALES (CARRUSEL CILÍNDRICO VERTICAL 3D)
       ======================================================== -->
  <div id="view-home" class="flex-1 flex flex-col items-center justify-center p-3 relative overflow-hidden hidden">
    <!-- Canvas de estrellas de fondo cósmico -->
    <canvas id="portalStarsCanvas" class="absolute inset-0 pointer-events-none w-full h-full z-0 opacity-60"></canvas>

    <div class="relative z-10 w-full max-w-xl text-center mb-2">
      <h2 class="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-sky-300 to-purple-400 bg-clip-text text-transparent">
        Hub de Teletransportación
      </h2>
      <p class="text-xs text-slate-400">
        Gira verticalmente para seleccionar tu portal de entrenamiento
      </p>
    </div>

    <!-- CONTENEDOR CON PERSPECTIVA 3D -->
    <div id="portalCarouselViewport" class="cylinder-viewport w-full max-w-xl h-[420px] flex items-center justify-center my-2 z-10">
      <!-- Flecha de navegación ARRIBA -->
      <button onclick="rotateCarouselVertical(-1)" class="absolute top-2 z-40 w-10 h-10 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-slate-200 flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer" title="Portal Anterior">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"/></svg>
      </button>

      <!-- ANILLO CILÍNDRICO MECÁNICO (Cylinder Ring) -->
      <div id="portalCylinderRing" class="cylinder-ring">

        <!-- PORTAL 0: LEARNING PATH (Cosmic Gold) -->
        <div id="portalItem-0" onclick="handlePortalCardClick(0)" class="cylinder-portal-item active-portal flex items-center justify-center p-3" style="--portal-glow: rgba(245, 158, 11, 0.4);">
          <div class="w-full max-w-md h-[340px] rounded-3xl bg-slate-900/90 border-2 border-amber-500/60 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div class="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl"></div>
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                  PORTAL 01 &bull; CÓSMICO
                </span>
                <span class="text-xs font-bold text-amber-400">+20 EXP / nivel</span>
              </div>
              <h3 class="text-xl font-black text-amber-300 group-hover:text-amber-200 transition">
                Learning Path
              </h3>
              <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Academia de vocabulario técnico, phrasal verbs, gramática y simulador TOEFL con rutas adaptativas.
              </p>
            </div>
            <!-- Arco dimensional animado -->
            <div class="my-auto flex items-center justify-center py-2">
              <div class="w-24 h-24 rounded-full border-2 border-dashed border-amber-400 animate-spin-slow flex items-center justify-center">
                <div class="w-16 h-16 rounded-full border border-amber-300 animate-spin-reverse-slow flex items-center justify-center text-2xl">
                  🌌
                </div>
              </div>
            </div>
            <button onclick="event.stopPropagation(); openPortalWithLoader('path')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/30 cursor-pointer">
              Entrar al Portal
            </button>
          </div>
        </div>

        <!-- PORTAL 1: CUENTOS CLÁSICOS (Mystic Emerald) -->
        <div id="portalItem-1" onclick="handlePortalCardClick(1)" class="cylinder-portal-item inactive-portal flex items-center justify-center p-3" style="--portal-glow: rgba(16, 185, 129, 0.4);">
          <div class="w-full max-w-md h-[340px] rounded-3xl bg-slate-900/90 border-2 border-emerald-500/60 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div class="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl"></div>
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                  PORTAL 02 &bull; ESMERALDA
                </span>
                <span class="text-xs font-bold text-emerald-400">+50 EXP / voz</span>
              </div>
              <h3 class="text-xl font-black text-emerald-300 group-hover:text-emerald-200 transition">
                Cuentos Clásicos
              </h3>
              <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Biblioteca ilustrada con 6 obras clásicas, narrador nativo en inglés, Speaking Coach y descarga PDF.
              </p>
            </div>
            <!-- Arco dimensional animado -->
            <div class="my-auto flex items-center justify-center py-2">
              <div class="w-24 h-24 rounded-full border-2 border-dashed border-emerald-400 animate-spin-slow flex items-center justify-center">
                <div class="w-16 h-16 rounded-full border border-emerald-300 animate-spin-reverse-slow flex items-center justify-center text-2xl">
                  🌲
                </div>
              </div>
            </div>
            <button onclick="event.stopPropagation(); openPortalWithLoader('stories')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/30 cursor-pointer">
              Entrar al Portal
            </button>
          </div>
        </div>

        <!-- PORTAL 2: MUSIC SESSION (Cyberpunk Neon) -->
        <div id="portalItem-2" onclick="handlePortalCardClick(2)" class="cylinder-portal-item inactive-portal flex items-center justify-center p-3" style="--portal-glow: rgba(6, 182, 212, 0.4);">
          <div class="w-full max-w-md h-[340px] rounded-3xl bg-slate-900/90 border-2 border-cyan-500/60 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div class="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl"></div>
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 uppercase tracking-widest">
                  PORTAL 03 &bull; CYBERPUNK
                </span>
                <span class="text-xs font-bold text-cyan-400">+30 EXP / reto</span>
              </div>
              <h3 class="text-xl font-black text-cyan-300 group-hover:text-cyan-200 transition">
                Music Session
              </h3>
              <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Laboratorio con buscador de YouTube, catálogo de 8 éxitos, karaoke sincronizado e inspección de palabras.
              </p>
            </div>
            <!-- Arco dimensional animado -->
            <div class="my-auto flex items-center justify-center py-2">
              <div class="w-24 h-24 rounded-full border-2 border-dashed border-cyan-400 animate-spin-slow flex items-center justify-center">
                <div class="w-16 h-16 rounded-full border border-cyan-300 animate-spin-reverse-slow flex items-center justify-center text-2xl">
                  ⚡
                </div>
              </div>
            </div>
            <button onclick="event.stopPropagation(); openPortalWithLoader('music')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/30 cursor-pointer">
              Entrar al Portal
            </button>
          </div>
        </div>

        <!-- PORTAL 3: WORLD TOUR 3D (Deep Purple) -->
        <div id="portalItem-3" onclick="handlePortalCardClick(3)" class="cylinder-portal-item inactive-portal flex items-center justify-center p-3" style="--portal-glow: rgba(168, 85, 247, 0.4);">
          <div class="w-full max-w-md h-[340px] rounded-3xl bg-slate-900/90 border-2 border-purple-500/60 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div class="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl"></div>
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] font-bold text-purple-300 uppercase tracking-widest">
                  PORTAL 04 &bull; INMERSIVO 3D
                </span>
                <span class="text-xs font-bold text-purple-400">15 Objetos Interactivos</span>
              </div>
              <h3 class="text-xl font-black text-purple-300 group-hover:text-purple-200 transition">
                World Tour 3D
              </h3>
              <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Escenario House & Rooms en Three.js realista, iluminación PBR, hamaca tradicional, raycaster y TTS.
              </p>
            </div>
            <!-- Arco dimensional animado -->
            <div class="my-auto flex items-center justify-center py-2">
              <div class="w-24 h-24 rounded-full border-2 border-dashed border-purple-400 animate-spin-slow flex items-center justify-center">
                <div class="w-16 h-16 rounded-full border border-purple-300 animate-spin-reverse-slow flex items-center justify-center text-2xl">
                  🪐
                </div>
              </div>
            </div>
            <button onclick="event.stopPropagation(); openPortalWithLoader('worldtour')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-purple-500/30 cursor-pointer">
              Entrar al Portal
            </button>
          </div>
        </div>

      </div>

      <!-- Flecha de navegación ABAJO -->
      <button onclick="rotateCarouselVertical(1)" class="absolute bottom-2 z-40 w-10 h-10 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-slate-200 flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer" title="Portal Siguiente">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
      </button>
    </div>

    <!-- Indicador de portal activo -->
    <div class="flex items-center gap-2 mt-2 z-10">
      <span id="carouselDot-0" class="w-3 h-3 rounded-full bg-amber-400 transition-all duration-300 shadow"></span>
      <span id="carouselDot-1" class="w-2 h-2 rounded-full bg-slate-600 transition-all duration-300"></span>
      <span id="carouselDot-2" class="w-2 h-2 rounded-full bg-slate-600 transition-all duration-300"></span>
      <span id="carouselDot-3" class="w-2 h-2 rounded-full bg-slate-600 transition-all duration-300"></span>
    </div>
  </div>

  <!-- ========================================================
       VISTA 3: LEARNING PATH (MÓDULOS DE VOCABULARIO Y TOEFL)
       ======================================================== -->
  <div id="view-path" class="flex-1 p-4 max-w-4xl mx-auto w-full hidden">
    <div class="flex items-center justify-between mb-4">
      <button onclick="goToHomePortals()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer">
        <span>← Volver a Portales</span>
      </button>
      <span class="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
        🌟 Learning Path Activo
      </span>
    </div>

    <div class="mb-6 text-center">
      <h2 class="text-2xl font-black text-white">Academia de Aprendizaje</h2>
      <p class="text-xs text-slate-400 mt-1">Completa los nodos formativos para avanzar de rango y ganar +20 EXP</p>
    </div>

    <!-- Contenedor dinámico de módulos -->
    <div id="learningModulesContainer" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Inyectado dinámicamente -->
    </div>
  </div>

  <!-- ========================================================
       VISTA 4: CUENTOS CLÁSICOS ILUSTRADOS (SIN EMOJIS)
       ======================================================== -->
  <div id="view-stories" class="flex-1 p-4 max-w-5xl mx-auto w-full hidden">
    <div class="flex items-center justify-between mb-4">
      <button onclick="goToHomePortals()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer">
        <span>← Volver a Portales</span>
      </button>
      <div class="flex items-center gap-2">
        <button id="storyBilingualToggleBtn" onclick="toggleBilingualStoryMode()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition cursor-pointer">
          🌐 Modo Bilingüe
        </button>
        <button onclick="downloadStoryPdf()" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow cursor-pointer">
          📄 Descargar PDF
        </button>
      </div>
    </div>

    <!-- Selector de Cuentos (6 obras sin emojis) -->
    <div id="storiesSelectorContainer" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
      <!-- Renderizado dinámicamente -->
    </div>

    <!-- Visor Activo del Cuento -->
    <div id="storyViewerCard" class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <!-- Encabezado del Cuento -->
      <div class="flex flex-col md:flex-row gap-6 items-center mb-6 border-b border-slate-800/80 pb-6">
        <div id="activeStoryIllustration" class="w-full md:w-56 h-40 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-700/60 shadow-lg">
          <!-- Ilustración vectorial SVG inyectada -->
        </div>
        <div class="flex-1 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-2 mb-1.5">
            <span id="activeStoryDifficulty" class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
              A1 - Elemental
            </span>
            <span id="activeStoryTime" class="text-xs text-slate-400">⏱️ 3 min lectura</span>
          </div>
          <h2 id="activeStoryTitle" class="text-2xl font-black text-white">
            The Three Little Pigs
          </h2>
          <p id="activeStorySubtitle" class="text-sm text-slate-400 italic mt-0.5">
            Los Tres Cerditos
          </p>
          <div class="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
            <button onclick="readEntireStoryAudio()" class="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer">
              <span>🔊 Narrar Cuento Completo</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Párrafos interactivos con Speaking Coach -->
      <div id="storyParagraphsContainer" class="space-y-4">
        <!-- Renderizado dinámicamente -->
      </div>
    </div>
  </div>

  <!-- ========================================================
       VISTA 5: MUSIC SESSION (YOUTUBE SEARCH & KARAOKE)
       ======================================================== -->
  <div id="view-music" class="flex-1 p-4 max-w-5xl mx-auto w-full hidden">
    <div class="flex items-center justify-between mb-4">
      <button onclick="goToHomePortals()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer">
        <span>← Volver a Portales</span>
      </button>
      <span class="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
        🎵 Music Session Activa
      </span>
    </div>

    <!-- BUSCADOR FUNCIONAL DE CANCIONES Y ARTISTAS DE YOUTUBE -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg">
      <div class="flex flex-col sm:flex-row gap-2">
        <div class="relative flex-1">
          <input type="text" id="musicSearchInput" oninput="handleMusicSearchInput(this.value)" placeholder="Buscar canción, artista o pegar enlace de YouTube..." class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition">
          <span class="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
        </div>
        <button onclick="handleCustomYouTubeLoad()" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5">
          <span>▶️ Cargar YouTube</span>
        </button>
      </div>

      <!-- Selector de Catálogo Precargado -->
      <div id="musicTrackButtonsContainer" class="flex gap-2 overflow-x-auto py-2.5 mt-2">
        <!-- Inyectado dinámicamente -->
      </div>
    </div>

    <!-- Reproductor y Karaoke -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Reproductor Embebido de YouTube -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between">
        <div class="relative w-full rounded-2xl overflow-hidden aspect-video bg-black shadow-lg">
          <iframe id="musicYouTubeIframe" class="w-full h-full" src="https://www.youtube.com/embed/rYEDA3JcQqw?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <div>
            <h3 id="activeMusicTitle" class="text-base font-extrabold text-white">Rolling in the Deep</h3>
            <p id="activeMusicArtist" class="text-xs text-slate-400">Adele &bull; Pop Soul</p>
          </div>
          <button onclick="completeMusicChallenge()" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs transition shadow cursor-pointer">
            🏆 Reto Superado (+30 EXP)
          </button>
        </div>
      </div>

      <!-- Panel de Letras Sincronizadas (Karaoke) -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col h-[400px]">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>🎤 Letra Sincronizada (Toca una palabra para aprender)</span>
          </h4>
        </div>
        <div id="musicLyricsContainer" class="flex-1 overflow-y-auto py-3 space-y-3 font-medium text-sm">
          <!-- Líneas de karaoke inyectadas dinámicamente -->
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================
       VISTA 6: WORLD TOUR 3D (HOUSE & ROOMS REALISTA)
       ======================================================== -->
  <div id="view-worldtour" class="flex-1 p-3 max-w-5xl mx-auto w-full hidden">
    <div class="flex items-center justify-between mb-3">
      <button onclick="goToHomePortals()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer">
        <span>← Volver a Portales</span>
      </button>
      <span class="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
        🪐 World Tour 3D &bull; House & Rooms
      </span>
    </div>

    <!-- CONTENEDOR THREE.JS (GARANTIZADO SIN PANTALLA NEGRA) -->
    <div class="relative w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#1e293b]">
      <div id="threeCanvasContainer" class="w-full relative select-none" style="height: 520px; background-color: #1e293b;">
        <!-- Canvas generado por Three.js -->

        <!-- Controles flotantes en pantalla -->
        <div class="absolute top-3 left-3 z-20 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-300 font-medium">
          🎮 Controles: WASD / Flechas + Arrastre de ratón | Joystick táctil
        </div>

        <!-- Tarjeta de Inspección de Objeto (Halo Raycaster) -->
        <div id="threeObjectInspectCard" class="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-20 bg-slate-900/95 backdrop-blur-md border border-purple-500/50 rounded-2xl p-4 shadow-2xl hidden transition-all duration-300">
          <div class="flex items-center justify-between mb-2">
            <span id="threeObjCategory" class="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">Hogar</span>
            <button onclick="close3DInspectCard()" class="text-slate-400 hover:text-white text-sm cursor-pointer">&times;</button>
          </div>
          <div class="flex items-center justify-between">
            <h4 id="threeObjEnName" class="text-lg font-black text-white">Hammock</h4>
            <button onclick="speakCurrent3DObj()" class="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition cursor-pointer">🔊</button>
          </div>
          <p id="threeObjIpa" class="text-xs text-purple-300 font-mono">/ˈhæm.ək/</p>
          <p id="threeObjEsName" class="text-xs text-slate-300 font-semibold mt-1">Hamaca tradicional tejida</p>
          <div class="mt-2.5 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 italic">
            "<span id="threeObjExample">I relax in the hammock on warm afternoons.</span>"
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================
       MODALES DEL SISTEMA
       ======================================================== -->

  <!-- 1. MODAL DE PERFIL GLASSMORPHISM -->
  <div id="profileModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">
    <div class="w-full max-w-md bg-[#0f172a] border border-[#38bdf8]/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-100">
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <h3 class="text-lg font-black text-white flex items-center gap-2">
          <span>👤 Perfil de Usuario</span>
        </h3>
        <button onclick="closeProfileModal()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-base">
          &times;
        </button>
      </div>

      <div id="profileModalBody" class="py-4 space-y-4">
        <!-- Inyectado dinámicamente -->
      </div>
    </div>
  </div>

  <!-- 2. MODAL DE RULETA DE PREGUNTAS (+15 EXP) -->
  <div id="rouletteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md hidden">
    <div class="w-full max-w-md bg-slate-900 border border-amber-500/60 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 class="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>🎯 Ruleta del Conocimiento</span>
        </h3>
        <button onclick="closeRouletteModal()" class="text-slate-400 hover:text-white text-base cursor-pointer">&times;</button>
      </div>

      <div class="py-4">
        <!-- Ruleta con física -->
        <div class="relative w-52 h-52 mx-auto my-3 flex items-center justify-center">
          <div id="rouletteWheelDisk" class="w-full h-full rounded-full border-4 border-amber-400 shadow-xl overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)">
            <svg class="w-full h-full" viewBox="0 0 100 100">
              <path d="M50 50 L50 0 A50 50 0 0 1 93.3 25 Z" fill="#ef4444"></path>
              <path d="M50 50 L93.3 25 A50 50 0 0 1 93.3 75 Z" fill="#f59e0b"></path>
              <path d="M50 50 L93.3 75 A50 50 0 0 1 50 100 Z" fill="#10b981"></path>
              <path d="M50 50 L50 100 A50 50 0 0 1 6.7 75 Z" fill="#06b6d4"></path>
              <path d="M50 50 L6.7 75 A50 50 0 0 1 6.7 25 Z" fill="#8b5cf6"></path>
              <path d="M50 50 L6.7 25 A50 50 0 0 1 50 0 Z" fill="#ec4899"></path>
              <circle cx="50" cy="50" r="12" fill="#0f172a" stroke="#fcd34d" stroke-width="2.5"></circle>
            </svg>
          </div>
          <!-- Flecha de parada superior -->
          <div class="absolute top-0 w-3 h-4 bg-amber-400 rotate-180 transform -translate-y-2 shadow-lg"></div>
        </div>

        <button id="spinRouletteBtn" onclick="spinRouletteWheel()" class="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95">
          Girar Ruleta
        </button>

        <!-- Pregunta contrarreloj (despliega al detener la ruleta) -->
        <div id="rouletteQuestionCard" class="mt-4 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-left hidden">
          <div class="flex items-center justify-between text-xs mb-2">
            <span id="rouletteCategoryBadge" class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">Grammar</span>
            <span id="rouletteTimer" class="font-mono text-rose-400 font-black">⏱️ 30s</span>
          </div>
          <p id="rouletteQuestionText" class="text-sm font-bold text-white mb-3">Which sentence is correct?</p>
          <div id="rouletteOptionsContainer" class="space-y-2">
            <!-- 4 opciones -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 3. MODAL DE CHATBOT DE DUDAS (ASISTENTE IA) -->
  <div id="chatbotWindow" class="fixed bottom-20 right-4 sm:right-6 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl z-50 flex flex-col h-[460px] hidden overflow-hidden">
    <div class="p-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-xs font-black text-white">AI</div>
        <div>
          <h4 class="text-xs font-bold text-white">Asistente de Dudas</h4>
          <p class="text-[9px] text-slate-400">Preguntas concisas de inglés</p>
        </div>
      </div>
      <button onclick="toggleChatbotWindow()" class="text-slate-400 hover:text-white text-base cursor-pointer">&times;</button>
    </div>

    <!-- Chips de preguntas frecuentes -->
    <div class="p-2 bg-slate-950/50 border-b border-slate-800/60 flex gap-1.5 overflow-x-auto text-[10px]">
      <button onclick="askChatbotQuestion('Diferencia entre Make y Do')" class="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 cursor-pointer">Make vs Do</button>
      <button onclick="askChatbotQuestion('Top 5 Phrasal Verbs')" class="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 cursor-pointer">Phrasal Verbs</button>
      <button onclick="askChatbotQuestion('Consejos para TOEFL')" class="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 cursor-pointer">Tips TOEFL</button>
    </div>

    <div id="chatbotMessagesContainer" class="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
      <div class="bg-slate-800/80 p-2.5 rounded-2xl rounded-tl-none border border-slate-700 text-slate-200">
        ¡Hola! Soy tu asistente de inglés. Escribe tu duda gramatical o toca un tema sugerido arriba.
      </div>
    </div>

    <div class="p-2.5 bg-slate-800/90 border-t border-slate-700 flex gap-2">
      <input type="text" id="chatbotInput" onkeydown="if(event.key==='Enter') sendChatbotMessage()" placeholder="Escribe tu duda aquí..." class="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500">
      <button onclick="sendChatbotMessage()" class="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer">Enviar</button>
    </div>
  </div>

  <!-- 4. MODAL DE ESTUDIO DE PALABRA DE CANCIÓN -->
  <div id="musicWordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden">
    <div class="w-full max-w-sm bg-slate-900 border border-cyan-500/50 rounded-3xl p-5 shadow-2xl relative text-slate-100">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/20 px-2.5 py-0.5 rounded-full">Vocabulario Musical</span>
        <button onclick="closeMusicWordModal()" class="text-slate-400 hover:text-white text-base cursor-pointer">&times;</button>
      </div>
      <div class="py-3">
        <div class="flex items-center justify-between">
          <h3 id="musicWordTerm" class="text-xl font-black text-white">Fire</h3>
          <button onclick="speakMusicWord()" class="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer">🔊</button>
        </div>
        <p id="musicWordIpa" class="text-xs text-cyan-300 font-mono mt-0.5">/faɪr/</p>
        <p id="musicWordEs" class="text-sm font-semibold text-slate-200 mt-2">Fuego / Pasión ardiente</p>

        <div id="musicWordPhrasalBox" class="mt-3 p-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-xs space-y-1">
          <span class="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Phrasal Verb Relacionado:</span>
          <p id="musicWordPhrasal" class="font-bold text-white">Fire away</p>
          <p id="musicWordPhrasalEs" class="text-slate-300 italic">Disparar preguntas</p>
          <p id="musicWordPhrasalEx" class="text-slate-400 text-[11px] pt-1">"If you have questions, fire away!"</p>
        </div>
      </div>
      <button onclick="closeMusicWordModal()" class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer mt-1">
        Entendido & Continuar
      </button>
    </div>
  </div>

  <!-- TOAST FLOTANTE -->
  <div id="floatingToast" class="fixed top-16 right-4 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-sky-500/50 text-xs font-semibold text-white shadow-2xl flex items-center gap-2 transform translate-y-[-100px] opacity-0 transition-all duration-300 pointer-events-none">
    <span id="floatingToastIcon">✨</span>
    <span id="floatingToastText">Mensaje</span>
  </div>

  <!-- ========================================================
       SCRIPTS Y LÓGICA INTEGRAL DE LA APLICACIÓN
       ======================================================== -->
  <script>
    // ========================================================
    // DATASETS PRINCIPALES
    // ========================================================
    ${musicTracksJs}

    ${storiesDataJs}

    ${worldTourDataJs}

    const DEFAULT_MODULE_KEYS = [
      'phrasal_verbs',
      'connectors',
      'everyday_actions',
      'compound_words',
      'affixes_morphology',
      'grammar_path',
      'professional_english',
      'social_dating',
      'internet_slang',
      'toefl_simulator'
    ];

    // ========================================================
    // GESTIÓN DE EXP REAL Y RANGOS DINÁMICOS
    // ========================================================
    const RANK_TIERS = [
      { name: 'Bronce', min: 0, max: 499, medal: '🥉', title: 'Aprendiz' },
      { name: 'Plata', min: 500, max: 1499, medal: '🥈', title: 'Intermedio' },
      { name: 'Oro', min: 1500, max: 2999, medal: '🥇', title: 'Avanzado' },
      { name: 'Platino', min: 3000, max: 4999, medal: '💠', title: 'Experto' },
      { name: 'Diamante', min: 5000, max: 7999, medal: '💎', title: 'Élite' },
      { name: 'Maestro', min: 8000, max: Infinity, medal: '👑', title: 'Maestro Bilingüe' }
    ];

    function calculateRankInfo(exp) {
      const currentExp = Math.max(0, parseInt(exp, 10) || 0);
      const tier = RANK_TIERS.find(t => currentExp >= t.min && currentExp <= t.max) || RANK_TIERS[0];
      const tierIdx = RANK_TIERS.indexOf(tier);
      const nextTier = RANK_TIERS[tierIdx + 1] || null;

      let progress = 100;
      let neededForNext = 0;
      if (nextTier) {
        const range = nextTier.min - tier.min;
        const currentInRange = currentExp - tier.min;
        progress = Math.min(100, Math.max(0, Math.floor((currentInRange / range) * 100)));
        neededForNext = nextTier.min - currentExp;
      }

      return {
        exp: currentExp,
        rank: tier.name,
        medal: tier.medal,
        title: tier.title,
        progressPercent: progress,
        nextTier,
        neededForNext
      };
    }

    function addExp(amount, reason = '') {
      const added = parseInt(amount, 10) || 0;
      if (added <= 0) return;

      const user = getStoredUser() || { username: 'Invitado', role: 'guest', exp: 0 };
      const current = Math.max(0, parseInt(user.exp, 10) || 0);
      const newExp = current + added;
      user.exp = newExp;

      const rankInfo = calculateRankInfo(newExp);
      user.rank = rankInfo.rank;

      saveStoredAuthUser(user);
      updateUserExpDisplay();

      showFloatingToast(\`✨ +\${added} EXP \${reason ? 'por ' + reason : ''} | Total: \${newExp} EXP\`, '🎉');

      // Sincronizar en segundo plano con PostgreSQL
      if (window.BackendSync && user.role !== 'guest') {
        BackendSync.queueProgressSync({ exp: newExp, rank: rankInfo.rank, reason });
      }
    }

    function updateUserExpDisplay() {
      const user = getStoredUser() || { username: 'Invitado', role: 'guest', exp: 0 };
      const rankInfo = calculateRankInfo(user.exp);

      const rankEl = document.getElementById('headerUserRank');
      const expEl = document.getElementById('headerUserExp');
      const medalEl = document.getElementById('userRankMedal');
      const avatarText = document.getElementById('headerAvatarText');

      if (rankEl) rankEl.textContent = rankInfo.rank;
      if (expEl) expEl.textContent = \`\${rankInfo.exp} EXP\`;
      if (medalEl) medalEl.textContent = rankInfo.medal;
      if (avatarText) {
        avatarText.textContent = user.username ? user.username.charAt(0).toUpperCase() : '👤';
      }
    }

    // ========================================================
    // REPRODUCCIÓN DE VOZ (TTS)
    // ========================================================
    function speakText(text, rate = 0.95, onEnd = null) {
      if (!text) return;
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US';
          utterance.rate = rate;
          if (onEnd) utterance.onend = onEnd;
          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.warn('TTS error:', err);
      }
    }

    // ========================================================
    // SISTEMA DE NAVEGACIÓN Y ANTI-LAG DE VISTAS
    // ========================================================
    let currentActiveView = 'view-auth';
    window.isTransitioningView = false;

    function showView(viewId) {
      const views = ['view-auth', 'view-home', 'view-path', 'view-stories', 'view-music', 'view-worldtour'];
      views.forEach(v => {
        const el = document.getElementById(v);
        if (el) {
          if (v === viewId) {
            el.classList.remove('hidden');
          } else {
            el.classList.add('hidden');
          }
        }
      });
      currentActiveView = viewId;

      // El robot flotante se oculta en view-auth y view-home; aparece dentro de los módulos
      const robot = document.getElementById('draggableRobotWidget');
      if (robot) {
        if (viewId === 'view-auth' || viewId === 'view-home') {
          robot.classList.add('hidden');
        } else {
          robot.classList.remove('hidden');
        }
      }

      // Estrellas del portal sólo en view-home
      if (viewId === 'view-home') {
        startPortalStars();
      } else {
        stopPortalStars();
      }
    }

    function goToHomePortals() {
      showView('view-home');
      updateUserExpDisplay();
    }

    // Transición fluida con Loading Screen temática (Anti-Lag)
    function openPortalWithLoader(targetModule) {
      if (window.isTransitioningView) return;
      window.isTransitioningView = true;

      const loader = document.getElementById('portalLoadingScreen');
      const progressBar = document.getElementById('portalLoadingProgressBar');
      const percentEl = document.getElementById('portalLoadingPercent');
      const subtitleEl = document.getElementById('portalLoadingSubtitle');
      const glowEl = document.getElementById('portalLoadingGlow');
      const iconEl = document.getElementById('portalLoadingIcon');

      const meta = {
        path: { title: 'Learning Path', sub: 'Cargando módulos de vocabulario y misiones...', glow: 'rgba(245, 158, 11, 0.4)', icon: '🌌', view: 'view-path' },
        stories: { title: 'Cuentos Clásicos', sub: 'Sincronizando 6 obras ilustradas y Speaking Coach...', glow: 'rgba(16, 185, 129, 0.4)', icon: '🌲', view: 'view-stories' },
        music: { title: 'Music Session', sub: 'Conectando YouTube y karaoke sincronizado...', glow: 'rgba(6, 182, 212, 0.4)', icon: '⚡', view: 'view-music' },
        worldtour: { title: 'World Tour 3D', sub: 'Instanciando motor Three.js, muebles y 15 objetos...', glow: 'rgba(168, 85, 247, 0.4)', icon: '🪐', view: 'view-worldtour' }
      }[targetModule] || { title: 'Módulo', sub: 'Cargando...', glow: 'rgba(56, 189, 248, 0.4)', icon: '🚀', view: 'view-path' };

      if (subtitleEl) subtitleEl.textContent = meta.sub;
      if (glowEl) glowEl.style.backgroundColor = meta.glow;
      if (iconEl) iconEl.textContent = meta.icon;

      if (loader) {
        loader.classList.remove('opacity-0', 'pointer-events-none');
        loader.classList.add('opacity-100');
      }

      let pct = 15;
      if (progressBar) progressBar.style.width = \`\${pct}%\`;
      if (percentEl) percentEl.textContent = \`\${pct}%\`;

      const interval = setInterval(() => {
        pct += 25;
        if (pct > 90) pct = 90;
        if (progressBar) progressBar.style.width = \`\${pct}%\`;
        if (percentEl) percentEl.textContent = \`\${pct}%\`;
      }, 70);

      // Si es World Tour 3D, precargar escena antes de abrir
      if (targetModule === 'worldtour') {
        setTimeout(() => {
          showView('view-worldtour');
          initThreeWorldTour();
          clearInterval(interval);
          if (progressBar) progressBar.style.width = '100%';
          if (percentEl) percentEl.textContent = '100%';

          setTimeout(() => {
            if (loader) {
              loader.classList.add('opacity-0', 'pointer-events-none');
              loader.classList.remove('opacity-100');
            }
            window.isTransitioningView = false;
          }, 350);
        }, 400);
      } else {
        setTimeout(() => {
          clearInterval(interval);
          if (progressBar) progressBar.style.width = '100%';
          if (percentEl) percentEl.textContent = '100%';

          showView(meta.view);
          if (targetModule === 'stories') renderStorySelector();
          if (targetModule === 'music') renderMusicTracksList();
          if (targetModule === 'path') renderLearningModules();

          setTimeout(() => {
            if (loader) {
              loader.classList.add('opacity-0', 'pointer-events-none');
              loader.classList.remove('opacity-100');
            }
            window.isTransitioningView = false;
          }, 300);
        }, 450);
      }
    }

    // ========================================================
    // CARRUSEL CILÍNDRICO VERTICAL 3D (4 PORTALES)
    // ========================================================
    let currentCylinderIndex = 0;
    const TOTAL_CYLINDER_PORTALS = 4;
    let isCylinderAnimating = false;

    function updateCylinderVisuals() {
      const ring = document.getElementById('portalCylinderRing');
      if (!ring) return;

      const angle = currentCylinderIndex * -90;
      ring.style.transform = \`rotateX(\${angle}deg)\`;

      for (let i = 0; i < TOTAL_CYLINDER_PORTALS; i++) {
        const item = document.getElementById(\`portalItem-\${i}\`);
        const dot = document.getElementById(\`carouselDot-\${i}\`);
        if (!item) continue;

        // Cada portal se ubica en su cara del cilindro
        const itemAngle = i * 90;
        item.style.transform = \`rotateX(\${itemAngle}deg) translateZ(210px)\`;

        if (i === currentCylinderIndex) {
          item.classList.remove('inactive-portal');
          item.classList.add('active-portal');
          if (dot) {
            dot.className = 'w-3 h-3 rounded-full bg-amber-400 transition-all duration-300 shadow';
          }
        } else {
          item.classList.remove('active-portal');
          item.classList.add('inactive-portal');
          if (dot) {
            dot.className = 'w-2 h-2 rounded-full bg-slate-600 transition-all duration-300';
          }
        }
      }
    }

    function rotateCarouselVertical(direction) {
      if (isCylinderAnimating) return;
      isCylinderAnimating = true;

      currentCylinderIndex = (currentCylinderIndex + direction + TOTAL_CYLINDER_PORTALS) % TOTAL_CYLINDER_PORTALS;
      updateCylinderVisuals();

      setTimeout(() => {
        isCylinderAnimating = false;
      }, 650);
    }

    function handlePortalCardClick(index) {
      if (index === currentCylinderIndex) {
        const modules = ['path', 'stories', 'music', 'worldtour'];
        openPortalWithLoader(modules[index]);
      } else {
        currentCylinderIndex = index;
        updateCylinderVisuals();
      }
    }

    // Soporte para rueda del ratón y swipe táctil en carrusel
    function setupCarouselGestures() {
      const viewport = document.getElementById('portalCarouselViewport');
      if (!viewport) return;

      // Wheel
      let wheelTimeout = null;
      viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (wheelTimeout) return;
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 400);
        if (e.deltaY > 15) {
          rotateCarouselVertical(1);
        } else if (e.deltaY < -15) {
          rotateCarouselVertical(-1);
        }
      }, { passive: false });

      // Touch swipe
      let touchStartY = 0;
      viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        if (e.changedTouches.length > 0) {
          const deltaY = touchStartY - e.changedTouches[0].clientY;
          if (deltaY > 40) rotateCarouselVertical(1);
          else if (deltaY < -40) rotateCarouselVertical(-1);
        }
      }, { passive: true });
    }

    // ========================================================
    // WIDGETS FLOTANTES ARRASTRABLES (ROBOT & RULETA)
    // ========================================================
    function setupDraggableWidget(widgetId, storageKey) {
      const widget = document.getElementById(widgetId);
      if (!widget) return;

      let isDragging = false;
      let startX = 0, startY = 0;
      let initialLeft = 0, initialTop = 0;
      let hasMovedSignificantly = false;

      // Cargar posición guardada
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (saved && typeof saved.left === 'number' && typeof saved.top === 'number') {
          widget.style.left = \`\${saved.left}px\`;
          widget.style.top = \`\${saved.top}px\`;
          widget.style.bottom = 'auto';
          widget.style.right = 'auto';
        }
      } catch (e) {}

      function onPointerDown(clientX, clientY) {
        isDragging = true;
        hasMovedSignificantly = false;
        startX = clientX;
        startY = clientY;

        const rect = widget.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
      }

      function onPointerMove(clientX, clientY) {
        if (!isDragging) return;
        const dx = clientX - startX;
        const dy = clientY - startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          hasMovedSignificantly = true;
        }

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // Limitar dentro de la pantalla
        newLeft = Math.max(10, Math.min(window.innerWidth - widget.offsetWidth - 10, newLeft));
        newTop = Math.max(60, Math.min(window.innerHeight - widget.offsetHeight - 10, newTop));

        widget.style.left = \`\${newLeft}px\`;
        widget.style.top = \`\${newTop}px\`;
        widget.style.bottom = 'auto';
        widget.style.right = 'auto';
      }

      function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;
        if (hasMovedSignificantly) {
          widget.setAttribute('data-dragged', 'true');
          setTimeout(() => widget.removeAttribute('data-dragged'), 100);
          try {
            const rect = widget.getBoundingClientRect();
            localStorage.setItem(storageKey, JSON.stringify({ left: rect.left, top: rect.top }));
          } catch (e) {}
        }
      }

      // Mouse
      widget.addEventListener('mousedown', (e) => {
        onPointerDown(e.clientX, e.clientY);
        const onMouseMove = (ev) => onPointerMove(ev.clientX, ev.clientY);
        const onMouseUp = () => {
          onPointerUp();
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });

      // Touch
      widget.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });

      widget.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });

      widget.addEventListener('touchend', onPointerUp, { passive: true });
    }

    function handleRobotWidgetClick(event) {
      const widget = document.getElementById('draggableRobotWidget');
      if (widget && widget.getAttribute('data-dragged') === 'true') return;
      toggleChatbotWindow();
    }

    function handleRouletteWidgetClick(event) {
      const widget = document.getElementById('draggableRouletteWidget');
      if (widget && widget.getAttribute('data-dragged') === 'true') return;
      openRouletteModal();
    }

    // ========================================================
    // SISTEMA DE AUTENTICACIÓN (GOOGLE GIS, MANUAL & INVITADO)
    // ========================================================
    const AUTH_STORAGE_KEY = 'english_app_user_session';

    function getStoredUser() {
      try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    function saveStoredAuthUser(user) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } catch (e) {}
    }

    function switchAuthTab(tab) {
      const btnLogin = document.getElementById('authTabBtnLogin');
      const btnReg = document.getElementById('authTabBtnRegister');
      const formLogin = document.getElementById('authLoginForm');
      const formReg = document.getElementById('authRegisterForm');

      if (tab === 'login') {
        if (btnLogin) btnLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-sky-600 text-white shadow';
        if (btnReg) btnReg.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-400 hover:text-slate-200';
        if (formLogin) formLogin.classList.remove('hidden');
        if (formReg) formReg.classList.add('hidden');
      } else {
        if (btnReg) btnReg.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-emerald-600 text-white shadow';
        if (btnLogin) btnLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-400 hover:text-slate-200';
        if (formReg) formReg.classList.remove('hidden');
        if (formLogin) formLogin.classList.add('hidden');
      }
    }

    // Google Identity Services (GIS)
    function initGoogleIdentityServices() {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: window.GOOGLE_CLIENT_ID || '1088426090715-mockdevclientid.apps.googleusercontent.com',
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
      }
    }

    function handleGoogleSignInClick() {
      showFloatingToast('Conectando con Google Identity Services...', '🔒');
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              // Si no puede mostrar el diálogo nativo (ej. origin localhost en desarrollo), invocar flujo asistido
              promptGoogleDevLogin();
            }
          });
          return;
        } catch (e) {
          console.warn('GIS prompt error:', e);
        }
      }
      promptGoogleDevLogin();
    }

    function promptGoogleDevLogin() {
      const googleEmail = prompt('Ingresa tu cuenta de Google o correo electrónico:', 'wilberth.molina@gmail.com');
      if (!googleEmail) return;
      const googleName = prompt('Nombre de tu perfil de Google:', 'Wilberth Alessandro Molina Cutz') || 'Google User';

      const mockCredential = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        btoa(JSON.stringify({
          sub: 'google-uid-' + Date.now(),
          email: googleEmail,
          name: googleName,
          picture: 'https://lh3.googleusercontent.com/a/default-user'
        })) + '.signature';

      handleGoogleCredentialResponse({ credential: mockCredential });
    }

    async function handleGoogleCredentialResponse(response) {
      showFloatingToast('Validando credenciales con PostgreSQL...', '🐘');
      try {
        const res = await fetch('http://localhost:3000/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential })
        });
        const data = await res.json();
        if (data && data.success && data.user) {
          const userSession = {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
            avatar_url: data.user.avatar_url,
            exp: data.stats ? data.stats.exp : 0,
            rank: data.stats ? data.stats.rank : 'Bronce'
          };
          saveStoredAuthUser(userSession);
          updateUserExpDisplay();
          showFloatingToast(\`¡Bienvenido, \${userSession.username}!\`, '🎉');
          setTimeout(() => goToHomePortals(), 400);
          return;
        }
      } catch (err) {
        console.warn('Backend offline, guardando sesión local de Google:', err);
      }

      // Respaldo offline para Google
      const parts = response.credential.split('.');
      let profile = { name: 'Wilberth Alessandro Molina Cutz', email: 'autor@english.com' };
      if (parts.length >= 2) {
        try { profile = JSON.parse(atob(parts[1])); } catch (e) {}
      }
      const guestSession = {
        username: profile.name || 'Google User',
        email: profile.email,
        role: (profile.name && profile.name.toLowerCase().includes('wilberth')) ? 'admin' : 'student',
        exp: 0,
        rank: 'Bronce'
      };
      saveStoredAuthUser(guestSession);
      updateUserExpDisplay();
      goToHomePortals();
    }

    // Formulario Iniciar Sesión
    async function handleAuthLoginSubmit(e) {
      e.preventDefault();
      const identifier = document.getElementById('authLoginIdentifier').value.trim();
      const password = document.getElementById('authLoginPassword').value;

      showFloatingToast('Verificando credenciales en PostgreSQL...', '🐘');
      try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });
        const data = await res.json();
        if (data.success && data.user) {
          const session = {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
            avatar_url: data.user.avatar_url,
            exp: data.stats ? data.stats.exp : 0,
            rank: data.stats ? data.stats.rank : 'Bronce'
          };
          saveStoredAuthUser(session);
          updateUserExpDisplay();
          showFloatingToast(\`Sesión iniciada como \${session.username}\`, '✅');
          setTimeout(() => goToHomePortals(), 350);
          return;
        } else {
          showFloatingToast(data.error || 'Credenciales incorrectas.', '❌');
          return;
        }
      } catch (err) {
        showFloatingToast('Servidor no disponible. Entrando en modo local...', '⚠️');
        saveStoredAuthUser({ username: identifier, role: 'student', exp: 0, rank: 'Bronce' });
        updateUserExpDisplay();
        setTimeout(() => goToHomePortals(), 400);
      }
    }

    // Formulario Registro (Sign Up)
    async function handleAuthRegisterSubmit(e) {
      e.preventDefault();
      const username = document.getElementById('authRegUsername').value.trim();
      const email = document.getElementById('authRegEmail').value.trim();
      const password = document.getElementById('authRegPassword').value;

      showFloatingToast('Creando cuenta en PostgreSQL...', '🐘');
      try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (data.success) {
          showFloatingToast('¡Cuenta creada exitosamente en PostgreSQL! Inicia sesión ahora.', '🎉');
          switchAuthTab('login');
          const loginIdent = document.getElementById('authLoginIdentifier');
          if (loginIdent) loginIdent.value = username;
          return;
        } else {
          showFloatingToast(data.error || 'No se pudo crear la cuenta.', '❌');
        }
      } catch (err) {
        showFloatingToast('Error de conexión con el backend: ' + err.message, '❌');
      }
    }

    // Acceso Rápido como Invitado
    function handleGuestAccess() {
      const guestUser = { username: 'Invitado', role: 'guest', exp: 0, rank: 'Bronce' };
      saveStoredAuthUser(guestUser);
      updateUserExpDisplay();
      showFloatingToast('Accediendo como Invitado (0 EXP)', '⚡');
      setTimeout(() => goToHomePortals(), 300);
    }

    // Modal de Perfil Glassmorphism
    function openProfileModal() {
      const user = getStoredUser() || { username: 'Invitado', role: 'guest', exp: 0 };
      const rankInfo = calculateRankInfo(user.exp);
      const isGuest = user.role === 'guest' || user.username === 'Invitado';

      const body = document.getElementById('profileModalBody');
      if (!body) return;

      body.innerHTML = \`
        <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xl font-black text-white shadow-lg">
            \${user.username ? user.username.charAt(0).toUpperCase() : '👤'}
          </div>
          <div>
            <h4 class="text-base font-extrabold text-white">\${user.username}</h4>
            <p class="text-xs text-slate-400">\${user.email || (isGuest ? 'Cuenta temporal sin registrar' : 'Estudiante Activo')}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs">\${rankInfo.medal}</span>
              <span class="text-xs font-bold text-amber-300">\${rankInfo.rank} (\${rankInfo.title})</span>
            </div>
          </div>
        </div>

        <!-- Barra de EXP Dinámica -->
        <div class="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-slate-400 font-semibold">Progreso hacia \${rankInfo.nextTier ? rankInfo.nextTier.name : 'Rango Máximo'}</span>
            <span class="font-bold text-amber-400">\${rankInfo.exp} EXP</span>
          </div>
          <div class="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
            <div class="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500" style="width: \${rankInfo.progressPercent}%;"></div>
          </div>
          <p class="text-[10px] text-slate-400 text-right">
            \${rankInfo.nextTier ? 'Faltan ' + rankInfo.neededForNext + ' EXP para ' + rankInfo.nextTier.name : '¡Has alcanzado la cima del dominio bilingüe!'}
          </p>
        </div>

        <!-- Estadísticas de Rachas y Misiones -->
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
            <span class="text-lg">🔥</span>
            <h5 class="text-xs font-black text-white mt-1">1 Día</h5>
            <p class="text-[10px] text-slate-400">Racha activa</p>
          </div>
          <div class="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
            <span class="text-lg">🎯</span>
            <h5 class="text-xs font-black text-white mt-1">10 Módulos</h5>
            <p class="text-[10px] text-slate-400">Disponibles</p>
          </div>
        </div>

        <!-- Acciones del Perfil -->
        <div class="pt-2 space-y-2">
          \${isGuest ? \`
            <button onclick="closeProfileModal(); showView('view-auth');" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-bold text-xs transition shadow-lg shadow-sky-500/20 cursor-pointer">
              🔗 Vincular Cuenta / Iniciar Sesión
            </button>
          \` : \`
            <button onclick="forceSyncWithPostgres()" class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-sky-500/40 text-sky-300 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5">
              <span>🔄 Sincronizar Datos con PostgreSQL</span>
            </button>
            <button onclick="handleLogout()" class="w-full py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition cursor-pointer">
              🚪 Cerrar Sesión
            </button>
          \`}
        </div>
      \`;

      const modal = document.getElementById('profileModal');
      if (modal) modal.classList.remove('hidden');
    }

    function closeProfileModal() {
      const modal = document.getElementById('profileModal');
      if (modal) modal.classList.add('hidden');
    }

    function handleLogout() {
      closeProfileModal();
      localStorage.removeItem(AUTH_STORAGE_KEY);
      showFloatingToast('Sesión cerrada. Regresando a la pantalla de acceso...', '👋');
      setTimeout(() => {
        showView('view-auth');
        updateUserExpDisplay();
      }, 350);
    }

    async function forceSyncWithPostgres() {
      const user = getStoredUser();
      if (!user) return;
      showFloatingToast('Sincronizando progreso con PostgreSQL...', '🐘');
      try {
        const res = await fetch('http://localhost:3000/api/progress/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user.username,
            exp: user.exp || 0,
            rank: user.rank || 'Bronce',
            streak_days: 1
          })
        });
        const data = await res.json();
        if (data.success) {
          showFloatingToast('¡Datos sincronizados exitosamente con PostgreSQL!', '✅');
        }
      } catch (err) {
        showFloatingToast('Servidor offline. Guardado en cola local.', '⚠️');
      }
    }

    // ========================================================
    // RULETA DE PREGUNTAS INTERACTIVA (+15 EXP)
    // ========================================================
    const ROULETTE_QUESTIONS = [
      {
        category: 'Phrasal Verbs',
        q: 'What does "look up to someone" mean?',
        options: ['To admire and respect someone', 'To look at someone from below', 'To search for someone online', 'To visit someone unexpectedly'],
        correct: 0
      },
      {
        category: 'Grammar',
        q: 'Which sentence uses the present perfect correctly?',
        options: ['I have lived in London since 2018', 'I live in London since 2018', 'I am living in London since 2018', 'I lived in London since 2018'],
        correct: 0
      },
      {
        category: 'Idioms',
        q: 'What is the meaning of "break a leg"?',
        options: ['Good luck in a performance', 'To get injured during sports', 'To fail an exam', 'To dance enthusiastically'],
        correct: 0
      },
      {
        category: 'TOEFL Practice',
        q: 'The professor _____ the lecture when the bell rang.',
        options: ['had already finished', 'has already finished', 'is finishing', 'finish'],
        correct: 0
      },
      {
        category: 'Slang & Casual',
        q: 'What does "no cap" mean in modern English?',
        options: ['No lie / completely serious', 'Without wearing a hat', 'Without a limit', 'Not cool'],
        correct: 0
      }
    ];

    let rouletteSpinAngle = 0;
    let rouletteTimerInterval = null;

    function openRouletteModal() {
      const modal = document.getElementById('rouletteModal');
      const qCard = document.getElementById('rouletteQuestionCard');
      const spinBtn = document.getElementById('spinRouletteBtn');
      if (qCard) qCard.classList.add('hidden');
      if (spinBtn) spinBtn.disabled = false;
      if (modal) modal.classList.remove('hidden');
    }

    function closeRouletteModal() {
      const modal = document.getElementById('rouletteModal');
      if (modal) modal.classList.add('hidden');
      if (rouletteTimerInterval) clearInterval(rouletteTimerInterval);
    }

    function spinRouletteWheel() {
      const disk = document.getElementById('rouletteWheelDisk');
      const spinBtn = document.getElementById('spinRouletteBtn');
      const qCard = document.getElementById('rouletteQuestionCard');

      if (spinBtn) spinBtn.disabled = true;
      if (qCard) qCard.classList.add('hidden');

      const extraSpins = 5 + Math.floor(Math.random() * 5);
      const randomDeg = Math.floor(Math.random() * 360);
      rouletteSpinAngle += (extraSpins * 360) + randomDeg;

      if (disk) {
        disk.style.transform = \`rotate(\${rouletteSpinAngle}deg)\`;
      }

      showFloatingToast('Girando ruleta de la fortuna...', '🎯');

      setTimeout(() => {
        presentRouletteQuestion();
      }, 4100);
    }

    function presentRouletteQuestion() {
      const qCard = document.getElementById('rouletteQuestionCard');
      const catBadge = document.getElementById('rouletteCategoryBadge');
      const qText = document.getElementById('rouletteQuestionText');
      const optsContainer = document.getElementById('rouletteOptionsContainer');
      const timerEl = document.getElementById('rouletteTimer');

      const randQ = ROULETTE_QUESTIONS[Math.floor(Math.random() * ROULETTE_QUESTIONS.length)];

      if (catBadge) catBadge.textContent = randQ.category;
      if (qText) qText.textContent = randQ.q;
      if (optsContainer) {
        optsContainer.innerHTML = randQ.options.map((opt, idx) => \`
          <button onclick="handleRouletteAnswer(\${idx}, \${randQ.correct})" class="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 transition cursor-pointer">
            \${String.fromCharCode(65 + idx)}) \${opt}
          </button>
        \`).join('');
      }

      if (qCard) qCard.classList.remove('hidden');

      let seconds = 30;
      if (timerEl) timerEl.textContent = \`⏱️ \${seconds}s\`;
      if (rouletteTimerInterval) clearInterval(rouletteTimerInterval);

      rouletteTimerInterval = setInterval(() => {
        seconds--;
        if (timerEl) timerEl.textContent = \`⏱️ \${seconds}s\`;
        if (seconds <= 0) {
          clearInterval(rouletteTimerInterval);
          showFloatingToast('¡Tiempo agotado en la ruleta!', '⏱️');
          closeRouletteModal();
        }
      }, 1000);
    }

    function handleRouletteAnswer(selectedIdx, correctIdx) {
      if (rouletteTimerInterval) clearInterval(rouletteTimerInterval);
      if (selectedIdx === correctIdx) {
        showFloatingToast('¡Respuesta Correcta! +15 EXP ganados', '🎉');
        addExp(15, 'Respuesta correcta en la Ruleta');
      } else {
        showFloatingToast('Respuesta incorrecta. ¡Sigue practicando!', '❌');
      }
      setTimeout(() => closeRouletteModal(), 1200);
    }

    // ========================================================
    // CHATBOT DE DUDAS (ASISTENTE IA CON WIDGET ARRASTRABLE)
    // ========================================================
    function toggleChatbotWindow() {
      const win = document.getElementById('chatbotWindow');
      if (win) {
        win.classList.toggle('hidden');
      }
    }

    function askChatbotQuestion(query) {
      const input = document.getElementById('chatbotInput');
      if (input) input.value = query;
      sendChatbotMessage();
    }

    function sendChatbotMessage() {
      const input = document.getElementById('chatbotInput');
      const container = document.getElementById('chatbotMessagesContainer');
      if (!input || !container) return;

      const userText = input.value.trim();
      if (!userText) return;

      // Mensaje del usuario
      const userDiv = document.createElement('div');
      userDiv.className = 'bg-sky-600/90 text-white p-2.5 rounded-2xl rounded-tr-none ml-auto max-w-[85%] font-medium';
      userDiv.textContent = userText;
      container.appendChild(userDiv);
      input.value = '';
      container.scrollTop = container.scrollHeight;

      // Respuesta concisa
      setTimeout(() => {
        let answer = "Excelente pregunta. En inglés, la práctica contextual diaria es la clave para la fluidez.";
        const lower = userText.toLowerCase();

        if (lower.includes('make') || lower.includes('do')) {
          answer = "'Do' se utiliza para acciones, obligaciones y tareas (ej. do homework, do exercise). 'Make' se utiliza para crear, construir o producir un resultado nuevo (ej. make coffee, make a decision).";
        } else if (lower.includes('phrasal')) {
          answer = "Los 5 phrasal verbs esenciales: 1) 'Give up' (Rendirse), 2) 'Look for' (Buscar), 3) 'Carry on' (Continuar), 4) 'Find out' (Descubrir), 5) 'Turn down' (Rechazar o bajar volumen).";
        } else if (lower.includes('toefl')) {
          answer = "Tip TOEFL: En la sección de lectura, identifica la idea principal de cada párrafo antes de responder. En comprensión auditiva, toma notas de conectores de contraste como 'however', 'although' o 'nevertheless'.";
        } else if (lower.includes('exp') || lower.includes('puntos')) {
          answer = "Ganas EXP completando misiones (+20 EXP), practicando pronunciación en cuentos (+50 EXP), retos en música (+30 EXP) y preguntas en la ruleta (+15 EXP).";
        }

        const aiDiv = document.createElement('div');
        aiDiv.className = 'bg-slate-800 p-2.5 rounded-2xl rounded-tl-none border border-slate-700 text-slate-200 max-w-[90%]';
        aiDiv.textContent = answer;
        container.appendChild(aiDiv);
        container.scrollTop = container.scrollHeight;
      }, 350);
    }

    // ========================================================
    // MÓDULO CUENTOS CLÁSICOS ILUSTRADOS (SIN EMOJIS)
    // ========================================================
    let currentStoryIndex = 0;
    let isBilingualStoryModeActive = true;

    function renderStorySelector() {
      const container = document.getElementById('storiesSelectorContainer');
      if (!container || !window.STORIES_DATA) return;

      container.innerHTML = STORIES_DATA.map((story, idx) => \`
        <div onclick="selectStory(\${idx})" class="p-2.5 rounded-2xl cursor-pointer transition border \${idx === currentStoryIndex ? 'bg-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'}">
          <div class="w-full h-14 rounded-xl overflow-hidden bg-slate-950 mb-1.5 flex items-center justify-center">
            \${story.svgIllustration}
          </div>
          <h4 class="text-[11px] font-bold text-white truncate text-center">\${story.title}</h4>
        </div>
      \`).join('');

      loadStoryViewer(currentStoryIndex);
    }

    function selectStory(idx) {
      currentStoryIndex = idx;
      renderStorySelector();
    }

    function loadStoryViewer(idx) {
      const story = STORIES_DATA[idx];
      if (!story) return;

      const titleEl = document.getElementById('activeStoryTitle');
      const subtitleEl = document.getElementById('activeStorySubtitle');
      const diffEl = document.getElementById('activeStoryDifficulty');
      const illEl = document.getElementById('activeStoryIllustration');
      const pContainer = document.getElementById('storyParagraphsContainer');

      if (titleEl) titleEl.textContent = story.title;
      if (subtitleEl) subtitleEl.textContent = story.esTitle;
      if (diffEl) diffEl.textContent = story.difficulty;
      if (illEl) illEl.innerHTML = story.svgIllustration;

      if (pContainer) {
        pContainer.innerHTML = story.paragraphs.map((p, pIdx) => \`
          <div class="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div class="flex items-start justify-between gap-3">
              <p class="text-sm font-semibold text-white leading-relaxed">\${p.en}</p>
              <div class="flex items-center gap-1.5">
                <button onclick="speakText('\${p.en.replace(/'/g, "\\\\'")}')" class="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition cursor-pointer" title="Escuchar pronunciación nativa">🔊</button>
                <button onclick="startVoicePracticeParagraph(\${pIdx}, '\${p.en.replace(/'/g, "\\\\'")}')" class="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs transition cursor-pointer" title="Practicar pronunciación (+50 EXP)">🎤</button>
              </div>
            </div>
            \${isBilingualStoryModeActive ? \`<p class="text-xs text-slate-400 italic pt-1 border-t border-slate-700/40">\${p.es}</p>\` : ''}
            <div id="voiceFeedback-\${pIdx}" class="text-[11px] font-mono font-bold text-emerald-400 hidden pt-1"></div>
          </div>
        \`).join('');
      }
    }

    function toggleBilingualStoryMode() {
      isBilingualStoryModeActive = !isBilingualStoryModeActive;
      const btn = document.getElementById('storyBilingualToggleBtn');
      if (btn) btn.textContent = isBilingualStoryModeActive ? '🌐 Modo Bilingüe' : '🌐 Solo Inglés';
      loadStoryViewer(currentStoryIndex);
    }

    function readEntireStoryAudio() {
      const story = STORIES_DATA[currentStoryIndex];
      if (!story) return;
      const fullText = story.paragraphs.map(p => p.en).join(' ');
      speakText(fullText);
      showFloatingToast('Reproduciendo narración completa...', '🔊');
    }

    // Speaking Coach con Web Speech API (+50 EXP)
    function startVoicePracticeParagraph(pIdx, targetText) {
      const feedbackEl = document.getElementById(\`voiceFeedback-\${pIdx}\`);
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        showFloatingToast('Tu navegador no soporta reconocimiento de voz.', '⚠️');
        return;
      }

      showFloatingToast('Escuchando... Lee la frase en voz alta.', '🎤');
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.toLowerCase();
        const cleanTarget = targetText.toLowerCase().replace(/[^a-z0-9 ]/g, '');
        const cleanSpoken = spoken.replace(/[^a-z0-9 ]/g, '');

        // Cálculo de coincidencia
        const targetWords = cleanTarget.split(' ');
        const spokenWords = cleanSpoken.split(' ');
        let matches = 0;
        targetWords.forEach(w => { if (spokenWords.includes(w)) matches++; });
        const accuracy = Math.min(100, Math.floor((matches / targetWords.length) * 100));

        if (feedbackEl) {
          feedbackEl.classList.remove('hidden');
          if (accuracy >= 70) {
            feedbackEl.className = 'text-[11px] font-mono font-bold text-emerald-400 pt-1';
            feedbackEl.textContent = \`¡Excelente pronunciación! Precisión: \${accuracy}% (+50 EXP)\`;
            addExp(50, 'Pronunciación aprobada en Cuentos');
          } else {
            feedbackEl.className = 'text-[11px] font-mono font-bold text-amber-400 pt-1';
            feedbackEl.textContent = \`Pronunciación: \${accuracy}%. Intenta vocalizar con mayor claridad.\`;
          }
        }
      };

      recognition.onerror = () => {
        showFloatingToast('No se detectó audio con claridad.', '⚠️');
      };

      recognition.start();
    }

    // Descarga de PDF con Autoría Formal
    function downloadStoryPdf() {
      const story = STORIES_DATA[currentStoryIndex];
      if (!story) return;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        showFloatingToast('Habilita las ventanas emergentes para descargar el PDF.', '⚠️');
        return;
      }

      printWindow.document.write(\`
        <!DOCTYPE html>
        <html>
        <head>
          <title>\${story.title} - English Learning Edition</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 4px; font-size: 26px; }
            h2 { color: #64748b; font-size: 16px; font-style: italic; margin-top: 0; }
            .meta { background: #f8fafc; border-left: 4px solid #10b981; padding: 12px; margin: 20px 0; font-size: 13px; color: #334155; }
            .paragraph-box { margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
            .en-text { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
            .es-text { font-size: 13px; color: #64748b; font-style: italic; }
            .footer { margin-top: 40px; border-top: 2px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <h1>\${story.title}</h1>
          <h2>\${story.esTitle}</h2>
          <div class="meta">
            <strong>Nivel:</strong> \${story.difficulty} &bull; <strong>Autoría del Material:</strong> Wilberth Alessandro Molina Cutz &bull; <strong>Plataforma:</strong> English App
          </div>
          \${story.paragraphs.map(p => \`
            <div class="paragraph-box">
              <div class="en-text">\${p.en}</div>
              <div class="es-text">\${p.es}</div>
            </div>
          \`).join('')}
          <div class="footer">
            Documento de Estudio Oficial &bull; Autor: Wilberth Alessandro Molina Cutz &bull; english_app
          </div>
        </body>
        </html>
      \`);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 400);
    }

    // ========================================================
    // MÓDULO MUSIC SESSION (YOUTUBE SEARCH & KARAOKE)
    // ========================================================
    let currentMusicIndex = 0;

    function renderMusicTracksList(filter = '') {
      const container = document.getElementById('musicTrackButtonsContainer');
      if (!container || !window.MUSIC_SESSION_TRACKS) return;

      const lower = filter.toLowerCase().trim();
      const filtered = MUSIC_SESSION_TRACKS.filter(t => 
        !lower || t.title.toLowerCase().includes(lower) || t.artist.toLowerCase().includes(lower)
      );

      container.innerHTML = filtered.map((track) => {
        const originalIdx = MUSIC_SESSION_TRACKS.findIndex(t => t.id === track.id);
        const isActive = originalIdx === currentMusicIndex;
        return \`
          <button onclick="selectMusicTrack(\${originalIdx})" class="px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition flex items-center gap-1.5 cursor-pointer \${isActive ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}">
            <span>\${track.artist} - \${track.title}</span>
          </button>
        \`;
      }).join('');
    }

    function handleMusicSearchInput(val) {
      renderMusicTracksList(val);
    }

    function selectMusicTrack(idx) {
      currentMusicIndex = idx;
      const track = MUSIC_SESSION_TRACKS[idx];
      if (!track) return;

      const titleEl = document.getElementById('activeMusicTitle');
      const artistEl = document.getElementById('activeMusicArtist');
      const iframe = document.getElementById('musicYouTubeIframe');

      if (titleEl) titleEl.textContent = track.title;
      if (artistEl) artistEl.textContent = \`\${track.artist} \${track.genre ? '• ' + track.genre : ''}\`;
      if (iframe && track.youtubeId) {
        iframe.src = \`https://www.youtube.com/embed/\${track.youtubeId}?enablejsapi=1\`;
      }

      renderLyrics(track);
      renderMusicTracksList();
    }

    function renderLyrics(track) {
      const container = document.getElementById('musicLyricsContainer');
      if (!container || !track || !track.lyrics) return;

      container.innerHTML = track.lyrics.map((line, idx) => {
        const words = line.text.split(' ').map(w => {
          const cleanWord = w.toLowerCase().replace(/[^a-z]/g, '');
          return \`<span onclick="inspectMusicWord('\${cleanWord}')" class="hover:text-cyan-400 hover:underline cursor-pointer">\${w}</span>\`;
        }).join(' ');

        return \`
          <div class="p-2.5 rounded-xl transition \${idx === 0 ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-200' : 'hover:bg-slate-800/60 text-slate-300'}">
            <span class="text-[10px] font-mono text-slate-500 mr-2">\${line.time}s</span>
            \${words}
          </div>
        \`;
      }).join('');
    }

    function extractYouTubeId(url) {
      if (!url) return null;
      if (url.length === 11 && !url.includes('/') && !url.includes('.')) return url;
      const reg = /(?:youtube\\.com\\/(?:watch\\?.*v=|embed\\/)|youtu\\.be\\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(reg);
      return match ? match[1] : null;
    }

    function handleCustomYouTubeLoad() {
      const input = document.getElementById('musicSearchInput');
      if (!input) return;
      const val = input.value.trim();
      const ytId = extractYouTubeId(val);

      if (ytId) {
        const iframe = document.getElementById('musicYouTubeIframe');
        if (iframe) iframe.src = \`https://www.youtube.com/embed/\${ytId}?enablejsapi=1\`;
        showFloatingToast('Cargando video de YouTube...', '▶️');
      } else {
        showFloatingToast('No se reconoció un enlace o ID válido de YouTube.', '⚠️');
      }
    }

    function inspectMusicWord(word) {
      const track = MUSIC_SESSION_TRACKS[currentMusicIndex];
      const dict = track && track.dictionary ? track.dictionary : {};
      const entry = dict[word] || {
        ipa: \`/\${word}/\`,
        es: 'Palabra clave en la lírica',
        phrasal: 'Phrasal verb asociado',
        phrasalEs: 'Uso contextual de la palabra',
        phrasalEx: \`"Listen to \${word} in the song."\`
      };

      const termEl = document.getElementById('musicWordTerm');
      const ipaEl = document.getElementById('musicWordIpa');
      const esEl = document.getElementById('musicWordEs');
      const pTermEl = document.getElementById('musicWordPhrasal');
      const pEsEl = document.getElementById('musicWordPhrasalEs');
      const pExEl = document.getElementById('musicWordPhrasalEx');
      const modal = document.getElementById('musicWordModal');

      if (termEl) termEl.textContent = word.charAt(0).toUpperCase() + word.slice(1);
      if (ipaEl) ipaEl.textContent = entry.ipa || \`/\${word}/\`;
      if (esEl) esEl.textContent = entry.es || 'Término de la canción';
      if (pTermEl) pTermEl.textContent = entry.phrasal || 'Phrasal Verb';
      if (pEsEl) pEsEl.textContent = entry.phrasalEs || '';
      if (pExEl) pExEl.textContent = entry.phrasalEx || '';

      if (modal) modal.classList.remove('hidden');
    }

    function speakMusicWord() {
      const termEl = document.getElementById('musicWordTerm');
      if (termEl) speakText(termEl.textContent);
    }

    function closeMusicWordModal() {
      const modal = document.getElementById('musicWordModal');
      if (modal) modal.classList.add('hidden');
    }

    function completeMusicChallenge() {
      addExp(30, 'Reto superado en Music Session');
    }

    // ========================================================
    // MÓDULO LEARNING PATH (10 MÓDULOS DE VOCABULARIO Y TOEFL)
    // ========================================================
    function renderLearningModules() {
      const container = document.getElementById('learningModulesContainer');
      if (!container) return;

      const titles = {
        phrasal_verbs: 'Phrasal Verbs Esenciales',
        connectors: 'Conectores Lógicos y Discurso',
        everyday_actions: 'Acciones Cotidianas',
        compound_words: 'Palabras Compuestas',
        affixes_morphology: 'Prefijos, Sufijos y Morfología',
        grammar_path: 'Estructuras Gramaticales Avanzadas',
        professional_english: 'Inglés Profesional y Laboral',
        social_dating: 'Inglés Social e Interpersonal',
        internet_slang: 'Internet Slang y Tendencias',
        toefl_simulator: 'Simulador TOEFL ITP & iBT'
      };

      container.innerHTML = DEFAULT_MODULE_KEYS.map((key, idx) => \`
        <div class="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Módulo \${idx + 1}
              </span>
              <span class="text-xs font-semibold text-slate-400">Nivel 1 / 5</span>
            </div>
            <h4 class="text-base font-extrabold text-white">\${titles[key] || key}</h4>
            <p class="text-xs text-slate-400 mt-1">Domina los términos clave y pon a prueba tu comprensión.</p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span class="text-xs font-bold text-amber-400">+20 EXP</span>
            <button onclick="completeLearningNode('\${key}')" class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer">
              Completar (+20 EXP)
            </button>
          </div>
        </div>
      \`).join('');
    }

    function completeLearningNode(key) {
      addExp(20, 'Nivel completado en Learning Path');
    }

    // ========================================================
    // MOTOR 3D WORLD TOUR (THREE.JS SIN PANTALLA NEGRA)
    // ========================================================
    let threeScene, threeCamera, threeRenderer;
    let threeRaycaster, threePointer;
    let threeInteractiveMeshes = [];
    let threeCurrentInspectedObj = null;
    let threeResizeObserver = null;
    let isThreeInitialized = false;

    function initThreeWorldTour() {
      const container = document.getElementById('threeCanvasContainer');
      if (!container) return;

      if (isThreeInitialized && threeRenderer) {
        // Redimensionar al reingresar
        const w = container.clientWidth || 800;
        const h = container.clientHeight || 520;
        threeCamera.aspect = w / h;
        threeCamera.updateProjectionMatrix();
        threeRenderer.setSize(w, h);
        return;
      }

      const width = container.clientWidth || 800;
      const height = container.clientHeight || 520;

      // 1. Escena
      threeScene = new THREE.Scene();
      threeScene.background = new THREE.Color(0x1e293b);

      // 2. Cámara
      threeCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      threeCamera.position.set(0, 2.5, 6.5);

      // 3. Renderer con setClearColor garantizado
      threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      threeRenderer.setClearColor(0x1e293b, 1);
      threeRenderer.setSize(width, height);
      threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      threeRenderer.shadowMap.enabled = true;
      threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = '';
      container.appendChild(threeRenderer.domElement);

      // 4. Iluminación Visible Inmediata
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      threeScene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffedd5, 2.0);
      dirLight.position.set(6, 10, 6);
      dirLight.castShadow = true;
      threeScene.add(dirLight);

      // Luces puntuales cálidas
      const ceilingLight = new THREE.PointLight(0xfef08a, 1.8, 12);
      ceilingLight.position.set(0, 3.2, 0);
      threeScene.add(ceilingLight);

      const lampLight = new THREE.PointLight(0xffedd5, 1.6, 8);
      lampLight.position.set(-3.2, 1.8, -2.5);
      threeScene.add(lampLight);

      // 5. Construcción de la Casa Realista
      buildRealisticHouse();

      // 6. Raycaster
      threeRaycaster = new THREE.Raycaster();
      threePointer = new THREE.Vector2();

      container.addEventListener('click', onThreeCanvasClick);

      // 7. ResizeObserver
      if (window.ResizeObserver) {
        threeResizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            const cr = entry.contentRect;
            if (cr.width > 0 && cr.height > 0) {
              threeCamera.aspect = cr.width / cr.height;
              threeCamera.updateProjectionMatrix();
              threeRenderer.setSize(cr.width, cr.height);
            }
          }
        });
        threeResizeObserver.observe(container);
      }

      // 8. Bucle de Render
      function animate3D() {
        requestAnimationFrame(animate3D);
        if (threeRenderer && threeScene && threeCamera) {
          threeRenderer.render(threeScene, threeCamera);
        }
      }
      animate3D();
      isThreeInitialized = true;
    }

    function buildRealisticHouse() {
      // Piso de madera duela brillante
      const floorGeo = new THREE.PlaneGeometry(14, 14);
      const floorMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.35, metalness: 0.1 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      threeScene.add(floor);

      // Pared trasera con ventana
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
      const backWallGeo = new THREE.BoxGeometry(14, 4.5, 0.3);
      const backWall = new THREE.Mesh(backWallGeo, wallMat);
      backWall.position.set(0, 2.25, -5.5);
      threeScene.add(backWall);

      // Pared izquierda
      const leftWallGeo = new THREE.BoxGeometry(0.3, 4.5, 14);
      const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
      leftWall.position.set(-7, 2.25, 0);
      threeScene.add(leftWall);

      // Pared derecha
      const rightWall = new THREE.Mesh(leftWallGeo, wallMat);
      rightWall.position.set(7, 2.25, 0);
      threeScene.add(rightWall);

      // Ventana con exterior iluminado
      const winGeo = new THREE.PlaneGeometry(3.5, 2.2);
      const winMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const windowMesh = new THREE.Mesh(winGeo, winMat);
      windowMesh.position.set(2.5, 2.5, -5.33);
      threeScene.add(windowMesh);

      // Zoclos de madera en la base de la pared trasera
      const baseboardGeo = new THREE.BoxGeometry(14, 0.2, 0.08);
      const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
      const baseboard = new THREE.Mesh(baseboardGeo, baseboardMat);
      baseboard.position.set(0, 0.1, -5.32);
      threeScene.add(baseboard);

      // Instanciar 15 Objetos Interactivos
      threeInteractiveMeshes = [];
      const objects = WORLD_TOUR_SCENARIOS.house.objects;

      objects.forEach(objData => {
        const mesh = build3DObjectGeometry(objData);
        if (mesh) {
          mesh.userData = objData;
          threeScene.add(mesh);
          threeInteractiveMeshes.push(mesh);
        }
      });
    }

    function build3DObjectGeometry(obj) {
      let geo, mat;
      const group = new THREE.Group();

      if (obj.id === 'hammock') {
        // Hamaca tradicional tejida suspendida con cuerdas y ganchos
        const fabricGeo = new THREE.CylinderGeometry(0.55, 0.45, 3.2, 16, 1, true, 0, Math.PI);
        const fabricMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, side: THREE.DoubleSide, roughness: 0.6 });
        const fabric = new THREE.Mesh(fabricGeo, fabricMat);
        fabric.rotation.z = Math.PI / 2;
        fabric.position.set(0, 1.2, 0);
        group.add(fabric);

        // Cuerdas de soporte ancladas
        const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
        const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8), ropeMat);
        r1.rotation.z = -Math.PI / 4;
        r1.position.set(-1.8, 1.6, 0);
        group.add(r1);

        const r2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8), ropeMat);
        r2.rotation.z = Math.PI / 4;
        r2.position.set(1.8, 1.6, 0);
        group.add(r2);
      } else if (obj.id === 'sofa') {
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 1.1), new THREE.MeshStandardMaterial({ color: 0x475569 }));
        base.position.y = 0.25;
        const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 0.3), new THREE.MeshStandardMaterial({ color: 0x334155 }));
        back.position.set(0, 0.65, -0.4);
        group.add(base, back);
      } else if (obj.id === 'coffee_table') {
        const top = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.06, 24), new THREE.MeshStandardMaterial({ color: 0x713f12 }));
        top.position.y = 0.45;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.45), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        leg.position.y = 0.22;
        group.add(top, leg);
      } else if (obj.id === 'television') {
        const tv = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.08), new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.1 }));
        group.add(tv);
      } else if (obj.id === 'rug') {
        const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.2), new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.9 }));
        rug.rotation.x = -Math.PI / 2;
        group.add(rug);
      } else if (obj.id === 'ceiling_fan') {
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        group.add(hub);
      } else {
        // Geometría estilizada genérica
        geo = new THREE.BoxGeometry(obj.scale[0] || 0.6, obj.scale[1] || 0.6, obj.scale[2] || 0.6);
        mat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });
        group.add(new THREE.Mesh(geo, mat));
      }

      group.position.set(obj.pos[0] || 0, obj.pos[1] || 0, obj.pos[2] || 0);
      return group;
    }

    function onThreeCanvasClick(event) {
      const container = document.getElementById('threeCanvasContainer');
      if (!container || !threeRaycaster || !threeCamera) return;

      const rect = container.getBoundingClientRect();
      threePointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      threePointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      threeRaycaster.setFromCamera(threePointer, threeCamera);
      const intersects = threeRaycaster.intersectObjects(threeInteractiveMeshes, true);

      if (intersects.length > 0) {
        let target = intersects[0].object;
        while (target.parent && !target.userData.id && target.parent !== threeScene) {
          target = target.parent;
        }
        if (target && target.userData && target.userData.id) {
          inspect3DObject(target.userData);
        }
      }
    }

    function inspect3DObject(objData) {
      threeCurrentInspectedObj = objData;
      const card = document.getElementById('threeObjectInspectCard');
      const enEl = document.getElementById('threeObjEnName');
      const esEl = document.getElementById('threeObjEsName');
      const ipaEl = document.getElementById('threeObjIpa');
      const exEl = document.getElementById('threeObjExample');

      if (enEl) enEl.textContent = objData.en;
      if (esEl) esEl.textContent = objData.es;
      if (ipaEl) ipaEl.textContent = objData.ipa || '';
      if (exEl) exEl.textContent = objData.example || '';

      if (card) card.classList.remove('hidden');
      speakText(objData.en);
    }

    function speakCurrent3DObj() {
      if (threeCurrentInspectedObj && threeCurrentInspectedObj.en) {
        speakText(threeCurrentInspectedObj.en);
      }
    }

    function close3DInspectCard() {
      const card = document.getElementById('threeObjectInspectCard');
      if (card) card.classList.add('hidden');
    }

    // ========================================================
    // PARTICULAS DE ESTRELLAS DE FONDO (VIEW-HOME)
    // ========================================================
    let starsCanvasAnimId = null;

    function startPortalStars() {
      const canvas = document.getElementById('portalStarsCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || window.innerHeight;

      const stars = Array.from({ length: 65 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005
      }));

      function renderStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
          s.alpha += s.speed;
          if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = \`rgba(255, 255, 255, \${Math.abs(s.alpha)})\`;
          ctx.fill();
        });
        starsCanvasAnimId = requestAnimationFrame(renderStars);
      }
      renderStars();
    }

    function stopPortalStars() {
      if (starsCanvasAnimId) {
        cancelAnimationFrame(starsCanvasAnimId);
        starsCanvasAnimId = null;
      }
    }

    // ========================================================
    // UTILIDADES DE INTERFAZ (TOAST FLOTANTE)
    // ========================================================
    let toastTimeout = null;
    function showFloatingToast(msg, icon = '✨') {
      const toast = document.getElementById('floatingToast');
      const txt = document.getElementById('floatingToastText');
      const icn = document.getElementById('floatingToastIcon');
      if (!toast || !txt) return;

      txt.textContent = msg;
      if (icn) icn.textContent = icon;

      toast.classList.remove('translate-y-[-100px]', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[-100px]', 'opacity-0');
      }, 3200);
    }

    // ========================================================
    // CLIENTE DE SINCRONIZACIÓN POSTGRESQL (BACKEND SYNC)
    // ========================================================
    window.BackendSync = {
      queue: [],
      async queueProgressSync(payload) {
        const user = getStoredUser();
        if (!user || user.role === 'guest') return;
        payload.username = user.username;
        this.queue.push(payload);
        this.flush();
      },
      async flush() {
        if (this.queue.length === 0) return;
        const item = this.queue.shift();
        try {
          await fetch('http://localhost:3000/api/progress/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        } catch (e) {
          this.queue.unshift(item);
        }
      }
    };

    // ========================================================
    // INICIALIZACIÓN DE LA APLICACIÓN
    // ========================================================
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Verificar sesión activa
      const stored = getStoredUser();
      if (stored && stored.username) {
        updateUserExpDisplay();
        goToHomePortals();
      } else {
        showView('view-auth');
      }

      // 2. Configurar widgets arrastrables
      setupDraggableWidget('draggableRobotWidget', 'saved_robot_pos');
      setupDraggableWidget('draggableRouletteWidget', 'saved_roulette_pos');

      // 3. Inicializar carrusel cilíndrico
      updateCylinderVisuals();
      setupCarouselGestures();

      // 4. Inicializar Google GIS
      initGoogleIdentityServices();

      // 5. Precargar listas iniciales
      renderMusicTracksList();
      renderStorySelector();
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(htmlPath, unifiedHtml, 'utf8');
console.log('🎉 app/src/main/assets/index.html rewritten successfully! Size:', unifiedHtml.length, 'bytes');

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 1. PORTAL 03: CYBERPUNK MUSIC SESSION & KARAOKE (Ultra-Detailed 3D-Shaded SVG Artwork)
const portalMusicSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#083344"/>
      <stop offset="55%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <radialGradient id="portalCore" cx="50%" cy="50%" r="45%">
      <stop offset="0%" stop-color="#a5f3fc" stop-opacity="0.95"/>
      <stop offset="30%" stop-color="#06b6d4" stop-opacity="0.65"/>
      <stop offset="65%" stop-color="#3b82f6" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cyanNeon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#67e8f9"/>
      <stop offset="50%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="magentaNeon" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="50%" stop-color="#d946ef"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
    <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="35%" stop-color="#f8fafc"/>
      <stop offset="65%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
    <linearGradient id="darkMetal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <filter id="neonBloom" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur1"/>
      <feGaussianBlur stdDeviation="18" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur2"/>
        <feMergeNode in="blur1"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <pattern id="micMesh" width="8" height="8" patternUnits="userSpaceOnUse">
      <path d="M 0 4 L 8 4 M 4 0 L 4 8" stroke="#1e293b" stroke-width="1.2"/>
    </pattern>
  </defs>

  <!-- Deep Cyberpunk Studio Background -->
  <rect width="800" height="500" fill="url(#bgGlow)"/>

  <!-- Perspective Cyber Grid Floor -->
  <g opacity="0.32" stroke="#06b6d4" stroke-width="1">
    <line x1="0" y1="390" x2="800" y2="390"/>
    <line x1="0" y1="415" x2="800" y2="415"/>
    <line x1="0" y1="445" x2="800" y2="445"/>
    <line x1="0" y1="480" x2="800" y2="480"/>
    <line x1="400" y1="360" x2="50" y2="500"/>
    <line x1="400" y1="360" x2="180" y2="500"/>
    <line x1="400" y1="360" x2="300" y2="500"/>
    <line x1="400" y1="360" x2="400" y2="500"/>
    <line x1="400" y1="360" x2="500" y2="500"/>
    <line x1="400" y1="360" x2="620" y2="500"/>
    <line x1="400" y1="360" x2="750" y2="500"/>
  </g>

  <!-- Glowing Portal Energy Core -->
  <circle cx="400" cy="235" r="195" fill="url(#portalCore)"/>
  <circle cx="400" cy="235" r="175" fill="none" stroke="url(#cyanNeon)" stroke-width="5" filter="url(#neonBloom)"/>
  <circle cx="400" cy="235" r="158" fill="none" stroke="#67e8f9" stroke-width="2" stroke-dasharray="18 10 6 10" opacity="0.85"/>
  <circle cx="400" cy="235" r="138" fill="none" stroke="url(#magentaNeon)" stroke-width="3.5" filter="url(#neonBloom)" opacity="0.85"/>

  <!-- 3D Equalizer Soundwave Bars Left & Right -->
  <g filter="url(#neonBloom)" opacity="0.9">
    <rect x="110" y="215" width="12" height="50" rx="6" fill="url(#cyanNeon)"/>
    <rect x="132" y="185" width="12" height="110" rx="6" fill="url(#cyanNeon)"/>
    <rect x="154" y="155" width="12" height="170" rx="6" fill="url(#magentaNeon)"/>
    <rect x="176" y="195" width="12" height="90" rx="6" fill="url(#cyanNeon)"/>
    <rect x="198" y="170" width="12" height="140" rx="6" fill="url(#cyanNeon)"/>
    <rect x="220" y="210" width="12" height="60" rx="6" fill="url(#magentaNeon)"/>

    <rect x="568" y="210" width="12" height="60" rx="6" fill="url(#magentaNeon)"/>
    <rect x="590" y="170" width="12" height="140" rx="6" fill="url(#cyanNeon)"/>
    <rect x="612" y="195" width="12" height="90" rx="6" fill="url(#cyanNeon)"/>
    <rect x="634" y="155" width="12" height="170" rx="6" fill="url(#magentaNeon)"/>
    <rect x="656" y="185" width="12" height="110" rx="6" fill="url(#cyanNeon)"/>
    <rect x="678" y="215" width="12" height="50" rx="6" fill="url(#cyanNeon)"/>
  </g>

  <!-- Studio Headphones Arc & Earcups -->
  <path d="M 275 245 A 125 125 0 0 1 525 245" fill="none" stroke="url(#darkMetal)" stroke-width="22" stroke-linecap="round"/>
  <path d="M 283 240 A 117 117 0 0 1 517 240" fill="none" stroke="url(#cyanNeon)" stroke-width="4" stroke-linecap="round" filter="url(#neonBloom)"/>

  <!-- Left Earcup -->
  <g transform="translate(268, 255) rotate(-8)">
    <rect x="-26" y="-48" width="44" height="96" rx="22" fill="url(#darkMetal)" stroke="#38bdf8" stroke-width="2.5"/>
    <rect x="-14" y="-36" width="22" height="72" rx="11" fill="none" stroke="#67e8f9" stroke-width="3" filter="url(#neonBloom)"/>
    <rect x="12" y="-42" width="16" height="84" rx="8" fill="#0f172a"/>
  </g>

  <!-- Right Earcup -->
  <g transform="translate(532, 255) rotate(8)">
    <rect x="-18" y="-48" width="44" height="96" rx="22" fill="url(#darkMetal)" stroke="#38bdf8" stroke-width="2.5"/>
    <rect x="-8" y="-36" width="22" height="72" rx="11" fill="none" stroke="#67e8f9" stroke-width="3" filter="url(#neonBloom)"/>
    <rect x="-28" y="-42" width="16" height="84" rx="8" fill="#0f172a"/>
  </g>

  <!-- Center Studio Condenser Microphone -->
  <g transform="translate(400, 235)">
    <!-- Outer U-Mount -->
    <path d="M -52 10 L -52 55 A 52 52 0 0 0 52 55 L 52 10" fill="none" stroke="url(#chromeGrad)" stroke-width="8" stroke-linecap="round"/>
    <circle cx="-52" cy="10" r="7" fill="#38bdf8"/>
    <circle cx="52" cy="10" r="7" fill="#38bdf8"/>
    <!-- Stand Stem & Base -->
    <rect x="-8" y="106" width="16" height="58" fill="url(#chromeGrad)"/>
    <ellipse cx="0" cy="168" rx="68" ry="14" fill="url(#darkMetal)" stroke="#38bdf8" stroke-width="2"/>
    <ellipse cx="0" cy="165" rx="48" ry="8" fill="none" stroke="#67e8f9" stroke-width="2" filter="url(#neonBloom)"/>

    <!-- Microphone Capsule -->
    <rect x="-38" y="-85" width="76" height="145" rx="38" fill="url(#chromeGrad)" stroke="#e2e8f0" stroke-width="2"/>
    <rect x="-38" y="-85" width="76" height="82" rx="38" fill="url(#micMesh)" opacity="0.65"/>
    <!-- Neon Ring Band on Mic -->
    <rect x="-40" y="-8" width="80" height="12" rx="4" fill="url(#cyanNeon)" filter="url(#neonBloom)"/>
    <!-- Power LED -->
    <circle cx="0" cy="28" r="5" fill="#22d3ee" filter="url(#neonBloom)"/>
  </g>

  <!-- Floating Glowing Musical Particles -->
  <g fill="#67e8f9" filter="url(#neonBloom)">
    <circle cx="215" cy="105" r="4"/>
    <circle cx="595" cy="95" r="5"/>
    <circle cx="310" cy="70" r="3"/>
    <circle cx="495" cy="75" r="3.5"/>
    <circle cx="160" cy="330" r="4"/>
    <circle cx="640" cy="335" r="4.5"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(imagesDir, 'portal_music.svg'), portalMusicSvg, 'utf8');

// 2. STORY 05: THE BOY WHO CRIED WOLF (Wide Cinematic Storybook Illustration SVG)
const storyBoyCriedWolfSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="100%" height="100%">
  <defs>
    <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="30%" stop-color="#4c1d95"/>
      <stop offset="60%" stop-color="#c2410c"/>
      <stop offset="85%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#fde047"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="72%" cy="42%" r="38%">
      <stop offset="0%" stop-color="#fef9c3" stop-opacity="1"/>
      <stop offset="35%" stop-color="#fbbf24" stop-opacity="0.7"/>
      <stop offset="70%" stop-color="#ea580c" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ea580c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="farMountains" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#312e81"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="midHills" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#15803d"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
    <linearGradient id="foreHill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="45%" stop-color="#16a34a"/>
      <stop offset="100%" stop-color="#065f46"/>
    </linearGradient>
  </defs>

  <!-- Golden Sunset Sky -->
  <rect width="960" height="540" fill="url(#sunsetSky)"/>
  <rect width="960" height="540" fill="url(#sunGlow)"/>

  <!-- Setting Sun -->
  <circle cx="690" cy="215" r="58" fill="#fef08a" opacity="0.95"/>
  <circle cx="690" cy="215" r="85" fill="#fde047" opacity="0.3"/>

  <!-- Soft Sunset Clouds -->
  <g fill="#fed7aa" opacity="0.35">
    <ellipse cx="210" cy="110" rx="95" ry="22"/>
    <ellipse cx="260" cy="102" rx="65" ry="18"/>
    <ellipse cx="520" cy="85" rx="110" ry="20"/>
    <ellipse cx="820" cy="125" rx="85" ry="18"/>
  </g>

  <!-- Distant Purple Mountains -->
  <path d="M 0 340 L 140 210 L 290 310 L 460 185 L 620 295 L 790 205 L 960 290 L 960 540 L 0 540 Z" fill="url(#farMountains)" opacity="0.85"/>

  <!-- Distant Cozy Village in the Valley -->
  <g transform="translate(520, 295)">
    <rect x="0" y="20" width="32" height="24" fill="#78350f"/>
    <polygon points="-4,20 16,4 36,20" fill="#b45309"/>
    <rect x="12" y="26" width="8" height="8" fill="#fef08a"/>
    <rect x="45" y="14" width="38" height="30" fill="#78350f"/>
    <polygon points="40,14 64,-4 88,14" fill="#9a3412"/>
    <rect x="58" y="22" width="9" height="9" fill="#fef08a"/>
    <!-- Church/Bell Tower -->
    <rect x="95" y="-5" width="22" height="49" fill="#57534e"/>
    <polygon points="91,-5 106,-28 121,-5" fill="#dc2626"/>
    <rect x="103" y="4" width="6" height="10" rx="3" fill="#fef08a"/>
  </g>

  <!-- Dark Pine Forest on the Left & Prowling Wolf Silhouette -->
  <path d="M 0 365 Q 260 285 560 355 T 960 340 L 960 540 L 0 540 Z" fill="url(#midHills)"/>
  <g fill="#022c22">
    <polygon points="30,360 65,235 100,360"/>
    <polygon points="40,310 65,210 90,310"/>
    <polygon points="85,370 125,220 165,370"/>
    <polygon points="95,315 125,195 155,315"/>
    <polygon points="145,375 180,250 215,375"/>
    <polygon points="195,380 230,265 265,380"/>
  </g>

  <!-- Subtle Wolf Silhouette at Forest Edge -->
  <g transform="translate(235, 332) scale(0.9)" fill="#0f172a">
    <ellipse cx="28" cy="24" rx="22" ry="11"/>
    <polygon points="42,20 54,10 58,24"/>
    <polygon points="46,12 49,3 53,12"/>
    <polygon points="51,12 54,4 57,13"/>
    <path d="M 52 15 L 66 17 L 63 23 L 48 23 Z"/>
    <circle cx="55" cy="16" r="2" fill="#f59e0b"/>
    <path d="M 8 22 Q -8 18 -14 30 Q -4 32 10 26 Z"/>
    <rect x="12" y="30" width="5" height="16" rx="2"/>
    <rect x="20" y="31" width="5" height="15" rx="2"/>
    <rect x="36" y="30" width="5" height="16" rx="2"/>
    <rect x="43" y="31" width="5" height="15" rx="2"/>
  </g>

  <!-- Breezy Foreground Emerald Hillside -->
  <path d="M 0 410 Q 340 310 680 390 T 960 385 L 960 540 L 0 540 Z" fill="url(#foreHill)"/>

  <!-- Fluffy White Sheep Flock -->
  <!-- Sheep 1 -->
  <g transform="translate(560, 395)">
    <ellipse cx="0" cy="24" rx="34" ry="8" fill="#064e3b" opacity="0.45"/>
    <rect x="-18" y="8" width="6" height="18" rx="3" fill="#334155"/>
    <rect x="-8" y="10" width="6" height="17" rx="3" fill="#1e293b"/>
    <rect x="10" y="8" width="6" height="18" rx="3" fill="#334155"/>
    <rect x="18" y="10" width="6" height="17" rx="3" fill="#1e293b"/>
    <circle cx="-16" cy="0" r="14" fill="#f8fafc"/>
    <circle cx="0" cy="-4" r="16" fill="#ffffff"/>
    <circle cx="16" cy="0" r="14" fill="#f1f5f9"/>
    <circle cx="-6" cy="6" r="13" fill="#f8fafc"/>
    <circle cx="10" cy="6" r="13" fill="#ffffff"/>
    <!-- Sheep Head -->
    <ellipse cx="-26" cy="-2" rx="11" ry="9" fill="#334155" transform="rotate(-15 -26 -2)"/>
    <ellipse cx="-20" cy="-9" rx="6" ry="3" fill="#475569" transform="rotate(25 -20 -9)"/>
    <circle cx="-29" cy="-4" r="2" fill="#ffffff"/>
    <circle cx="-29.5" cy="-4" r="1" fill="#0f172a"/>
  </g>

  <!-- Sheep 2 -->
  <g transform="translate(690, 425) scale(1.1)">
    <ellipse cx="0" cy="24" rx="34" ry="8" fill="#064e3b" opacity="0.45"/>
    <rect x="-16" y="8" width="6" height="18" rx="3" fill="#334155"/>
    <rect x="-6" y="10" width="6" height="17" rx="3" fill="#1e293b"/>
    <rect x="10" y="8" width="6" height="18" rx="3" fill="#334155"/>
    <rect x="18" y="10" width="6" height="17" rx="3" fill="#1e293b"/>
    <circle cx="-15" cy="0" r="14" fill="#f8fafc"/>
    <circle cx="0" cy="-4" r="16" fill="#ffffff"/>
    <circle cx="15" cy="0" r="14" fill="#f1f5f9"/>
    <circle cx="-5" cy="6" r="13" fill="#ffffff"/>
    <circle cx="9" cy="6" r="13" fill="#f8fafc"/>
    <ellipse cx="-25" cy="-1" rx="11" ry="9" fill="#334155" transform="rotate(-10 -25 -1)"/>
    <circle cx="-28" cy="-3" r="2" fill="#ffffff"/>
  </g>

  <!-- Sheep 3 -->
  <g transform="translate(815, 405) scale(0.92)">
    <ellipse cx="0" cy="24" rx="32" ry="7" fill="#064e3b" opacity="0.45"/>
    <rect x="-14" y="8" width="5" height="17" rx="2.5" fill="#334155"/>
    <rect x="10" y="8" width="5" height="17" rx="2.5" fill="#334155"/>
    <circle cx="-12" cy="0" r="13" fill="#f8fafc"/>
    <circle cx="2" cy="-3" r="15" fill="#ffffff"/>
    <circle cx="14" cy="1" r="13" fill="#f1f5f9"/>
    <ellipse cx="-23" cy="-2" rx="10" ry="8" fill="#334155"/>
    <circle cx="-26" cy="-4" r="1.8" fill="#ffffff"/>
  </g>

  <!-- Shepherd Boy with Wooden Crook on the Hilltop -->
  <g transform="translate(395, 365)">
    <ellipse cx="5" cy="95" rx="38" ry="10" fill="#064e3b" opacity="0.55"/>
    <!-- Shepherd's Wooden Staff (Crook) -->
    <path d="M 42 95 L 48 -28 A 14 14 0 1 1 24 -28" fill="none" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <!-- Boots & Legs -->
    <rect x="-12" y="55" width="11" height="32" rx="5" fill="#fde68a"/>
    <rect x="6" y="55" width="11" height="32" rx="5" fill="#fde68a"/>
    <path d="M -16 80 L -1 80 L -1 94 L -20 94 Q -22 86 -16 80 Z" fill="#78350f"/>
    <path d="M 4 80 L 19 80 L 23 94 L 4 94 Z" fill="#78350f"/>
    <!-- Shorts & Rustic Tunic -->
    <rect x="-16" y="38" width="36" height="24" rx="6" fill="#1e3a8a"/>
    <path d="M -20 0 L 24 0 L 28 44 L -24 44 Z" fill="#d97706"/>
    <!-- Brown Vest -->
    <path d="M -18 0 L -4 0 L -6 36 L -20 36 Z" fill="#78350f"/>
    <path d="M 8 0 L 22 0 L 24 36 L 10 36 Z" fill="#78350f"/>
    <rect x="-22" y="30" width="48" height="6" rx="3" fill="#451a03"/>
    <!-- Arms (One raised calling out, one holding staff) -->
    <path d="M -18 6 L -42 -16" stroke="#fde68a" stroke-width="11" stroke-linecap="round"/>
    <circle cx="-44" cy="-18" r="7" fill="#fde68a"/>
    <path d="M 20 8 L 44 16" stroke="#fde68a" stroke-width="11" stroke-linecap="round"/>
    <circle cx="45" cy="16" r="7" fill="#fde68a"/>
    <!-- Head & Hair -->
    <circle cx="2" cy="-22" r="22" fill="#fde68a"/>
    <path d="M -20 -26 Q -15 -50 10 -46 Q 28 -42 24 -20 Q 14 -34 -2 -34 Q -14 -34 -20 -26 Z" fill="#92400e"/>
    <!-- Eyes & Calling Mouth -->
    <circle cx="-5" cy="-22" r="3" fill="#1e293b"/>
    <circle cx="9" cy="-22" r="3" fill="#1e293b"/>
    <ellipse cx="2" cy="-11" rx="6" ry="5" fill="#991b1b"/>
    <!-- Sound Waves from Shepherd Call -->
    <path d="M -32 -28 A 18 18 0 0 0 -32 -6" fill="none" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
    <path d="M -42 -34 A 26 26 0 0 0 -42 0" fill="none" stroke="#fef08a" stroke-width="2" stroke-linecap="round" opacity="0.55"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(imagesDir, 'story_boy_cried_wolf.svg'), storyBoyCriedWolfSvg, 'utf8');

// 3. 10 LEARNING PATH MODULE BANNERS (High-detail custom SVG artworks for each module)
const modulesConfig = [
  {
    key: 'phrasal_verbs',
    grad1: '#f59e0b', grad2: '#ea580c', accent: '#fde047',
    badge: 'VERB + PARTICLE',
    iconSvg: `<g transform="translate(200, 90)">
      <rect x="-110" y="-28" width="90" height="56" rx="14" fill="#1e293b" stroke="#fbbf24" stroke-width="2.5"/>
      <text x="-65" y="6" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="18" text-anchor="middle">TAKE</text>
      <circle cx="0" cy="0" r="16" fill="#f59e0b"/>
      <text x="0" y="6" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20" text-anchor="middle">+</text>
      <rect x="20" y="-28" width="90" height="56" rx="14" fill="#fbbf24" stroke="#fef08a" stroke-width="2.5"/>
      <text x="65" y="6" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="18" text-anchor="middle">OFF 🚀</text>
    </g>`
  },
  {
    key: 'connectors',
    grad1: '#06b6d4', grad2: '#2563eb', accent: '#67e8f9',
    badge: 'LOGIC & FLOW',
    iconSvg: `<g transform="translate(200, 90)">
      <circle cx="-75" cy="0" r="32" fill="#0e7490" stroke="#67e8f9" stroke-width="3"/>
      <circle cx="75" cy="0" r="32" fill="#1d4ed8" stroke="#67e8f9" stroke-width="3"/>
      <path d="M -43 -8 L 43 -8 M 43 8 L -43 8" stroke="#fde047" stroke-width="5" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#fde047" stroke-width="3"/>
      <text x="0" y="5" fill="#67e8f9" font-family="sans-serif" font-weight="900" font-size="13" text-anchor="middle">LINK</text>
    </g>`
  },
  {
    key: 'everyday_actions',
    grad1: '#10b981', grad2: '#059669', accent: '#6ee7b7',
    badge: 'DAILY ROUTINE',
    iconSvg: `<g transform="translate(200, 90)">
      <circle cx="-55" cy="0" r="34" fill="#065f46" stroke="#34d399" stroke-width="2.5"/>
      <text x="-55" y="10" font-size="28" text-anchor="middle">☕</text>
      <circle cx="0" cy="-12" r="38" fill="#047857" stroke="#6ee7b7" stroke-width="3"/>
      <text x="0" y="0" font-size="32" text-anchor="middle">🏃</text>
      <circle cx="55" cy="0" r="34" fill="#065f46" stroke="#34d399" stroke-width="2.5"/>
      <text x="55" y="10" font-size="28" text-anchor="middle">💼</text>
    </g>`
  },
  {
    key: 'compound_words',
    grad1: '#8b5cf6', grad2: '#6d28d9', accent: '#c4b5fd',
    badge: 'WORD FUSION',
    iconSvg: `<g transform="translate(200, 90)">
      <path d="M -95 -28 H -15 V -10 A 12 12 0 0 1 9 -10 V -28 H 95 V 28 H -95 Z" fill="#2e1065" stroke="#c4b5fd" stroke-width="2.5"/>
      <text x="-48" y="8" fill="#fbbf24" font-family="sans-serif" font-weight="900" font-size="16" text-anchor="middle">SUN ☀️</text>
      <text x="48" y="8" fill="#c4b5fd" font-family="sans-serif" font-weight="900" font-size="16" text-anchor="middle">FLOWER</text>
    </g>`
  },
  {
    key: 'affixes_morphology',
    grad1: '#ec4899', grad2: '#be185d', accent: '#f9a8d4',
    badge: 'PREFIX & SUFFIX',
    iconSvg: `<g transform="translate(200, 90)">
      <rect x="-125" y="-22" width="65" height="44" rx="10" fill="#831843" stroke="#f9a8d4" stroke-width="2"/>
      <text x="-92" y="5" fill="#f9a8d4" font-family="monospace" font-weight="900" font-size="15" text-anchor="middle">UN-</text>
      <rect x="-50" y="-28" width="100" height="56" rx="12" fill="#be185d" stroke="#ffffff" stroke-width="2.5"/>
      <text x="0" y="6" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="16" text-anchor="middle">STOP</text>
      <rect x="60" y="-22" width="65" height="44" rx="10" fill="#831843" stroke="#f9a8d4" stroke-width="2"/>
      <text x="92" y="5" fill="#fde047" font-family="monospace" font-weight="900" font-size="14" text-anchor="middle">-ABLE</text>
    </g>`
  },
  {
    key: 'grammar_path',
    grad1: '#3b82f6', grad2: '#1d4ed8', accent: '#93c5fd',
    badge: 'SYNTAX MASTER',
    iconSvg: `<g transform="translate(200, 90)">
      <rect x="-105" y="-34" width="210" height="68" rx="16" fill="#1e3a8a" stroke="#93c5fd" stroke-width="2.5"/>
      <text x="0" y="-6" fill="#93c5fd" font-family="monospace" font-weight="700" font-size="12" text-anchor="middle">SUBJECT + AUX + PARTICIPLE</text>
      <text x="0" y="18" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="16" text-anchor="middle">"I have mastered English"</text>
    </g>`
  },
  {
    key: 'professional_english',
    grad1: '#0ea5e9', grad2: '#0369a1', accent: '#7dd3fc',
    badge: 'BUSINESS & CAREER',
    iconSvg: `<g transform="translate(200, 90)">
      <rect x="-45" y="-22" width="90" height="60" rx="12" fill="#0c4a6e" stroke="#7dd3fc" stroke-width="2.5"/>
      <path d="M -18 -22 V -34 H 18 V -22" fill="none" stroke="#7dd3fc" stroke-width="3"/>
      <polyline points="-75,18 -25,-5 15,8 75,-24" fill="none" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
      <circle cx="75" cy="-24" r="6" fill="#fde047"/>
    </g>`
  },
  {
    key: 'social_dating',
    grad1: '#f43f5e', grad2: '#be123c', accent: '#fda4af',
    badge: 'SOCIAL FLUENCY',
    iconSvg: `<g transform="translate(200, 90)">
      <rect x="-85" y="-30" width="95" height="46" rx="16" fill="#881337" stroke="#fda4af" stroke-width="2.5"/>
      <text x="-37" y="-2" fill="#ffffff" font-family="sans-serif" font-weight="800" font-size="14" text-anchor="middle">Hey there! 💬</text>
      <rect x="-5" y="-8" width="95" height="46" rx="16" fill="#e11d48" stroke="#fecdd3" stroke-width="2.5"/>
      <text x="42" y="20" fill="#ffffff" font-family="sans-serif" font-weight="800" font-size="14" text-anchor="middle">Let's hang out!</text>
    </g>`
  },
  {
    key: 'internet_slang',
    grad1: '#a855f7', grad2: '#4338ca', accent: '#e9d5ff',
    badge: 'DIGITAL CULTURE',
    iconSvg: `<g transform="translate(200, 90)">
      <rect x="-95" y="-28" width="82" height="52" rx="14" fill="#3b0764" stroke="#e9d5ff" stroke-width="2.5" transform="rotate(-6)"/>
      <text x="-54" y="5" fill="#fde047" font-family="sans-serif" font-weight="900" font-size="18" text-anchor="middle" transform="rotate(-6)">GOAT 🔥</text>
      <rect x="12" y="-28" width="85" height="52" rx="14" fill="#312e81" stroke="#38bdf8" stroke-width="2.5" transform="rotate(6)"/>
      <text x="54" y="5" fill="#38bdf8" font-family="sans-serif" font-weight="900" font-size="18" text-anchor="middle" transform="rotate(6)">TBH ⚡</text>
    </g>`
  },
  {
    key: 'toefl_simulator',
    grad1: '#eab308', grad2: '#b45309', accent: '#fef08a',
    badge: 'TOEFL ITP & iBT',
    iconSvg: `<g transform="translate(200, 90)">
      <polygon points="0,-38 55,-16 0,6 -55,-16" fill="#fbbf24" stroke="#fef08a" stroke-width="2"/>
      <rect x="-32" y="2" width="64" height="22" rx="6" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>
      <text x="0" y="17" fill="#fef08a" font-family="sans-serif" font-weight="900" font-size="12" text-anchor="middle">SCORE 677</text>
    </g>`
  }
];

for (const mod of modulesConfig) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_${mod.key}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="55%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="${mod.grad2}"/>
      </linearGradient>
      <radialGradient id="glow_${mod.key}" cx="50%" cy="55%" r="55%">
        <stop offset="0%" stop-color="${mod.grad1}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="400" height="160" fill="url(#bg_${mod.key})"/>
    <rect width="400" height="160" fill="url(#glow_${mod.key})"/>
    <circle cx="350" cy="25" r="70" fill="${mod.grad1}" opacity="0.12"/>
    <circle cx="45" cy="135" r="55" fill="${mod.accent}" opacity="0.1"/>
    ${mod.iconSvg}
    <rect x="14" y="12" width="110" height="20" rx="10" fill="#0f172a" opacity="0.75" stroke="${mod.accent}" stroke-width="1"/>
    <text x="69" y="25" fill="${mod.accent}" font-family="sans-serif" font-weight="800" font-size="9" text-anchor="middle" letter-spacing="1">${mod.badge}</text>
  </svg>`;
  fs.writeFileSync(path.join(imagesDir, `module_${mod.key}.svg`), svg, 'utf8');
}

console.log('✅ Generated portal_music.svg, story_boy_cried_wolf.svg, and 10 module_*.svg artworks!');

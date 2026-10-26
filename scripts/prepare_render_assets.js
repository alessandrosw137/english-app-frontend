const fs = require('fs');
const path = require('path');

const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#eab308"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#bgGrad)"/>
  <circle cx="60" cy="60" r="44" fill="none" stroke="url(#glowGrad)" stroke-width="3" opacity="0.4"/>
  <circle cx="60" cy="60" r="36" fill="#1e293b" stroke="url(#glowGrad)" stroke-width="2.5"/>
  <path d="M60 28 L82 42 L82 66 C82 80 60 92 60 92 C60 92 38 80 38 66 L38 42 Z" fill="url(#glowGrad)" opacity="0.25"/>
  <path d="M60 32 L78 44 L78 64 C78 76 60 86 60 86 C60 86 42 76 42 64 L42 44 Z" fill="none" stroke="url(#glowGrad)" stroke-width="2"/>
  <text x="60" y="66" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle" dominant-baseline="central">EN</text>
  <polygon points="60,22 63,29 70,30 65,35 66,42 60,38 54,42 55,35 50,30 57,29" fill="url(#goldGrad)"/>
</svg>`;

const svgMascot = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <linearGradient id="mBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="mHead" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <linearGradient id="mVisor" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#mBg)"/>
  <line x1="60" y1="26" x2="60" y2="14" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <circle cx="60" cy="12" r="4.5" fill="#38bdf8"/>
  <rect x="26" y="26" width="68" height="56" rx="20" fill="url(#mHead)" stroke="#38bdf8" stroke-width="2"/>
  <rect x="36" y="38" width="48" height="26" rx="10" fill="#0f172a"/>
  <circle cx="48" cy="51" r="5" fill="#38bdf8"/>
  <circle cx="72" cy="51" r="5" fill="#38bdf8"/>
  <circle cx="49.5" cy="49.5" r="1.5" fill="#ffffff"/>
  <circle cx="73.5" cy="49.5" r="1.5" fill="#ffffff"/>
  <path d="M54 70 Q60 74 66 70" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="18" y="42" width="10" height="24" rx="5" fill="#0284c7"/>
  <rect x="92" y="42" width="10" height="24" rx="5" fill="#0284c7"/>
  <path d="M26 44 C26 24 94 24 94 44" fill="none" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M23 60 Q23 76 38 78" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="39" cy="78" r="3" fill="#38bdf8"/>
  <rect x="36" y="88" width="48" height="24" rx="10" fill="#e2e8f0"/>
  <circle cx="60" cy="98" r="4" fill="#38bdf8"/>
</svg>`;

const svgPortalLearning = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="pBg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/><stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <radialGradient id="pGlow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.8"/><stop offset="60%" stop-color="#d97706" stop-opacity="0.3"/><stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#pBg1)"/>
  <circle cx="200" cy="150" r="110" fill="url(#pGlow1)"/>
  <ellipse cx="200" cy="150" rx="90" ry="90" fill="none" stroke="#fbbf24" stroke-width="3" stroke-dasharray="10 5" opacity="0.8"/>
  <ellipse cx="200" cy="150" rx="70" ry="70" fill="none" stroke="#f59e0b" stroke-width="4"/>
  <polygon points="200,80 230,140 200,200 170,140" fill="#fde68a" opacity="0.3"/>
  <text x="200" y="155" font-size="52" text-anchor="middle" dominant-baseline="central">📚</text>
  <text x="200" y="240" font-family="system-ui, sans-serif" font-weight="800" font-size="16" fill="#fef3c7" text-anchor="middle">LEARNING PATH</text>
</svg>`;

const svgPortalStories = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="pBg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#061c16"/><stop offset="100%" stop-color="#0f291e"/>
    </linearGradient>
    <radialGradient id="pGlow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.8"/><stop offset="60%" stop-color="#059669" stop-opacity="0.3"/><stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#pBg2)"/>
  <circle cx="200" cy="150" r="110" fill="url(#pGlow2)"/>
  <ellipse cx="200" cy="150" rx="85" ry="85" fill="none" stroke="#34d399" stroke-width="3" stroke-dasharray="8 6" opacity="0.8"/>
  <ellipse cx="200" cy="150" rx="68" ry="68" fill="none" stroke="#10b981" stroke-width="4"/>
  <text x="200" y="155" font-size="52" text-anchor="middle" dominant-baseline="central">📖</text>
  <text x="200" y="240" font-family="system-ui, sans-serif" font-weight="800" font-size="16" fill="#d1fae5" text-anchor="middle">STORIES &amp; VOICE</text>
</svg>`;

const svgPortalWorldtour = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="pBg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#31104b"/>
    </linearGradient>
    <radialGradient id="pGlow4" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.8"/><stop offset="60%" stop-color="#7c3aed" stop-opacity="0.3"/><stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#pBg4)"/>
  <circle cx="200" cy="150" r="110" fill="url(#pGlow4)"/>
  <ellipse cx="200" cy="150" rx="85" ry="85" fill="none" stroke="#c084fc" stroke-width="3" stroke-dasharray="10 5" opacity="0.8"/>
  <ellipse cx="200" cy="150" rx="68" ry="68" fill="none" stroke="#9333ea" stroke-width="4"/>
  <text x="200" y="155" font-size="52" text-anchor="middle" dominant-baseline="central">🏛️</text>
  <text x="200" y="240" font-family="system-ui, sans-serif" font-weight="800" font-size="16" fill="#f3e8ff" text-anchor="middle">WORLD TOUR 3D</text>
</svg>`;

const targets = ['images', path.join('app', 'src', 'main', 'assets', 'images')];
targets.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'app_hero_logo.svg'), svgLogo, 'utf8');
  fs.writeFileSync(path.join(dir, 'ai_tutor_mascot.svg'), svgMascot, 'utf8');
  fs.writeFileSync(path.join(dir, 'portal_learning_path.svg'), svgPortalLearning, 'utf8');
  fs.writeFileSync(path.join(dir, 'portal_stories.svg'), svgPortalStories, 'utf8');
  fs.writeFileSync(path.join(dir, 'portal_worldtour.svg'), svgPortalWorldtour, 'utf8');
});

console.log('✅ Fallback SVGs written successfully to both images folders.');

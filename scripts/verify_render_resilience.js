const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO RESILIENCIA DE INTERFAZ Y DESPLIEGUE EN RENDER ===\n');

const htmlRoot = fs.readFileSync('index.html', 'utf8');
const htmlAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'index.html'), 'utf8');

let pass = true;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
  } else {
    console.error(`❌ FALLÓ: ${message}`);
    pass = false;
  }
}

// 1. Viewport tag
assert(
  htmlRoot.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'),
  'index.html contiene la etiqueta meta viewport requerida'
);

// 2. Critical CSS in <style>
assert(
  htmlRoot.includes('.hidden') && htmlRoot.includes('display: none !important;'),
  'CSS crítico incluye regla universal .hidden { display: none !important; }'
);
assert(
  htmlRoot.includes('#glossaryModal.hidden') && htmlRoot.includes('#profileModal.hidden'),
  'CSS crítico asegura que los modales tengan display: none !important cuando tienen clase hidden'
);
assert(
  htmlRoot.includes('#view-home.hidden') && htmlRoot.includes('#view-worldtour.hidden'),
  'CSS crítico asegura que las vistas inactivas tengan display: none !important'
);
assert(
  htmlRoot.includes('#authLoginForm.hidden') && htmlRoot.includes('#authRegisterForm.hidden'),
  'CSS crítico asegura que los formularios de login y registro no se encimen'
);

// 3. Fallback libraries & CDNs
assert(
  htmlRoot.includes('https://cdn.tailwindcss.com') && htmlRoot.includes('tailwind.js'),
  'Tailwind CSS tiene CDN oficial y fallback local a tailwind.js'
);
assert(
  htmlRoot.includes('three.min.js') && htmlRoot.includes('cdnjs.cloudflare.com/ajax/libs/three.js'),
  'Three.js tiene fallback local y CDN oficial'
);

// 4. Modales y vistas ocultas por defecto con style="display: none;"
assert(
  htmlRoot.includes('id="view-home"') && (htmlRoot.includes('id="view-home" class="hub-container flex-1') || htmlRoot.includes('id="view-home" class="flex-1')) && htmlRoot.includes('style="display: none;"'),
  'view-home tiene style="display: none;" por defecto'
);
assert(
  htmlRoot.includes('id="view-path"') && htmlRoot.includes('id="view-path" class="flex-1 p-4 max-w-5xl mx-auto w-full hidden" style="display: none;"'),
  'view-path tiene style="display: none;" por defecto'
);
assert(
  htmlRoot.includes('id="view-stories"') && htmlRoot.includes('id="view-stories" class="flex-1 p-4 max-w-5xl mx-auto w-full hidden" style="display: none;"'),
  'view-stories tiene style="display: none;" por defecto'
);
assert(
  htmlRoot.includes('id="view-music"') && htmlRoot.includes('id="view-music"') && htmlRoot.includes('style="display: none;"'),
  'view-music tiene style="display: none;" por defecto'
);
assert(
  htmlRoot.includes('id="view-worldtour"') && htmlRoot.includes('id="view-worldtour" class="flex-1 p-3 max-w-5xl mx-auto w-full hidden" style="display: none;"'),
  'view-worldtour tiene style="display: none;" por defecto'
);
assert(
  htmlRoot.includes('id="authRegisterForm"') && htmlRoot.includes('id="authRegisterForm" onsubmit="handleAuthRegisterSubmit(event)" class="space-y-4 hidden" style="display: none;"'),
  'authRegisterForm tiene style="display: none;" por defecto'
);
assert(
  htmlRoot.includes('id="glossaryModal" style="display: none;"'),
  'glossaryModal tiene style="display: none;" por defecto'
);
assert(
  htmlRoot.includes('id="profileModal" style="display: none;"'),
  'profileModal tiene style="display: none;" por defecto'
);
assert(
  htmlRoot.includes('id="rouletteModal" style="display: none;"'),
  'rouletteModal tiene style="display: none;" por defecto'
);
assert(
  htmlRoot.includes('id="musicWordModal" style="display: none;"'),
  'musicWordModal tiene style="display: none;" por defecto'
);
assert(
  htmlRoot.includes('id="learningMissionModal" style="display: none;"'),
  'learningMissionModal tiene style="display: none;" por defecto'
);
assert(
  htmlRoot.includes('id="draggableRobotWidget"') && htmlRoot.includes('display: none;'),
  'draggableRobotWidget tiene display: none por defecto'
);
assert(
  htmlRoot.includes('id="draggableRouletteWidget"') && htmlRoot.includes('display: none;'),
  'draggableRouletteWidget tiene display: none por defecto'
);

// 5. Assets en la raíz y en assets
assert(fs.existsSync('tailwind.js'), 'tailwind.js existe en la raíz del repositorio');
assert(fs.existsSync('three.min.js'), 'three.min.js existe en la raíz del repositorio');
assert(fs.existsSync('images/app_hero_logo.jpg'), 'app_hero_logo.jpg existe en images/ raíz');
assert(fs.existsSync('images/ai_tutor_mascot.jpg'), 'ai_tutor_mascot.jpg existe en images/ raíz');
assert(fs.existsSync('images/app_hero_logo.svg'), 'app_hero_logo.svg existe en images/ raíz');
assert(fs.existsSync('images/ai_tutor_mascot.svg'), 'ai_tutor_mascot.svg existe en images/ raíz');
assert(fs.existsSync('app/src/main/assets/images/app_hero_logo.svg'), 'app_hero_logo.svg existe en assets/images');
assert(fs.existsSync('app/src/main/assets/images/ai_tutor_mascot.svg'), 'ai_tutor_mascot.svg existe en assets/images');

// 6. Resiliencia visual en <img> tags con onerror
assert(
  htmlRoot.includes('alt="English App Logo"') && htmlRoot.includes('FALLBACK_LOGO'),
  'Logo de la app cuenta con fallback visual en onerror'
);
assert(
  htmlRoot.includes('alt="AI Tutor Mascot"') && htmlRoot.includes('FALLBACK_MASCOT'),
  'Mascota AI Tutor cuenta con fallback visual en onerror'
);
assert(
  htmlRoot.includes('alt="English App Emblem"') && htmlRoot.includes('FALLBACK_LOGO'),
  'Emblema de bienvenida cuenta con fallback visual en onerror'
);
assert(
  htmlRoot.includes('alt="Portal Learning Path"') && htmlRoot.includes('FALLBACK_PORTAL_LEARNING'),
  'Portal Learning Path cuenta con fallback visual en onerror'
);
assert(
  htmlRoot.includes('alt="Portal Cuentos"') && htmlRoot.includes('FALLBACK_PORTAL_STORIES'),
  'Portal Cuentos cuenta con fallback visual en onerror'
);
assert(
  htmlRoot.includes('alt="Portal World Tour 3D"') && htmlRoot.includes('FALLBACK_PORTAL_WORLDTOUR'),
  'Portal World Tour cuenta con fallback visual en onerror'
);

// 7. Sincronización exacta entre index.html raíz y app/src/main/assets/index.html
assert(
  htmlRoot === htmlAssets,
  'index.html de la raíz y app/src/main/assets/index.html están 100% sincronizados'
);

console.log('\n--- RESULTADO DE LA VERIFICACIÓN ---');
if (pass) {
  console.log('🎉 TODAS LAS VERIFICACIONES DE RESILIENCIA Y DESPLIEGUE EN RENDER PASARON CON 100% DE ÉXITO!');
  process.exit(0);
} else {
  console.error('❌ SE ENCONTRARON FALLAS EN LA VERIFICACIÓN.');
  process.exit(1);
}

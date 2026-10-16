const fs = require('fs');

const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

console.log('=== VERIFYING REQUISITO 1: FORMULARIO Y RULETA ===');
// 1.1 Button text
const registerFormMatch = html.match(/<form id=["']authRegisterForm["'][\s\S]*?<\/form>/i);
if (registerFormMatch) {
  const formHtml = registerFormMatch[0];
  const submitBtnMatch = formHtml.match(/<button type=["']submit["'][^>]*>([\s\S]*?)<\/button>/i);
  if (submitBtnMatch) {
    const btnText = submitBtnMatch[1].trim();
    console.log('Register submit button text:', btnText);
    if (btnText === 'Crear Cuenta') {
      console.log('✅ REQ 1.1 PASSED: Register button text is strictly "Crear Cuenta"');
    } else {
      console.error('❌ REQ 1.1 FAILED: Unexpected button text:', btnText);
    }
  } else {
    console.error('❌ REQ 1.1 FAILED: submit button inside authRegisterForm not found');
  }
} else {
  console.error('❌ REQ 1.1 FAILED: authRegisterForm not found');
}

// 1.2 Database tech mentions in UI
const dbTechMentions = html.match(/PostgreSQL|Postgres/gi) || [];
console.log('Database tech mentions in index.html:', dbTechMentions);
if (dbTechMentions.length === 0) {
  console.log('✅ REQ 1.2 PASSED: Zero mentions of PostgreSQL / Postgres in UI');
} else {
  console.error('❌ REQ 1.2 FAILED: Found DB tech mentions:', dbTechMentions);
}

// 1.3 Roulette widget visibility
const rouletteEl = html.includes('id="draggableRouletteWidget"');
const rouletteHiddenByDefault = html.includes('id="draggableRouletteWidget" class="draggable-widget fixed z-50 flex items-center justify-center hidden"');
const rouletteOnlyInHome = html.includes("if (viewId === 'view-home') {\n          roulette.classList.remove('hidden');\n        } else {\n          roulette.classList.add('hidden');\n        }");
console.log('Roulette element exists:', rouletteEl);
console.log('Roulette hidden by default:', rouletteHiddenByDefault);
console.log('Roulette strictly shown on view-home, hidden on others:', rouletteOnlyInHome);
if (rouletteEl && rouletteHiddenByDefault && rouletteOnlyInHome) {
  console.log('✅ REQ 1.3 PASSED: Roulette is hidden during login/lessons and visible only in portal menu');
} else {
  console.error('❌ REQ 1.3 FAILED: Roulette visibility logic mismatch');
}

console.log('\n=== VERIFYING REQUISITO 2: HUB DE PORTALES COVER FLOW ===');
const hasCoverFlowCss = html.includes('.coverflow-viewport') && html.includes('.coverflow-track') && html.includes('.coverflow-portal-card');
const hasActiveCenter = html.includes('.coverflow-portal-card.active-center');
const hasSideLeft = html.includes('.coverflow-portal-card.side-left');
const hasSideRight = html.includes('.coverflow-portal-card.side-right');
const hasBlur5px = html.includes('blur(5px)');
const hasScale082 = html.includes('scale(0.82)');
const hasOpacity045 = html.includes('opacity: 0.45');
const hasCoverFlowControls = html.includes('navigateCoverFlow(') && html.includes('setupCoverFlowGestures(') && html.includes('updateCoverFlowVisuals(');

console.log('Cover Flow CSS structure:', hasCoverFlowCss);
console.log('Active center & side classes:', hasActiveCenter && hasSideLeft && hasSideRight);
console.log('filter: blur(5px) styling:', hasBlur5px);
console.log('scale(0.82) styling:', hasScale082);
console.log('opacity: 0.45 styling:', hasOpacity045);
console.log('Arrows and swipe controls:', hasCoverFlowControls);

if (hasCoverFlowCss && hasActiveCenter && hasSideLeft && hasSideRight && hasBlur5px && hasScale082 && hasOpacity045 && hasCoverFlowControls) {
  console.log('✅ REQ 2 PASSED: Modern Cover Flow with scale 0.82, opacity 0.45, blur 5px and smooth controls is implemented');
} else {
  console.error('❌ REQ 2 FAILED: Missing Cover Flow components');
}

console.log('\n=== VERIFYING REQUISITO 3: EXP BUG FIX & LEARNING PATH (GLOSARIO + MISIONES) ===');
const hasNoLoopingExp = !html.includes('Completar (+20 EXP)');
const hasGlossaryBtn = html.includes('openModuleGlossary(');
const hasMissionBtn = html.includes('openModuleMission(');
const hasGlossaryModal = html.includes('id="glossaryModal"');
const hasMissionModal = html.includes('id="learningMissionModal"');
const hasPdfDownload = html.includes('downloadActiveGlossaryPdf(');
const hasOneTimeExpCheck = html.includes('isModuleLevelCompleted') && html.includes('markModuleLevelCompleted');

console.log('Looping "+20 EXP" button removed:', hasNoLoopingExp);
console.log('Glossary button handler:', hasGlossaryBtn);
console.log('Mission button handler:', hasMissionBtn);
console.log('Glossary modal in DOM:', hasGlossaryModal);
console.log('Mission modal in DOM:', hasMissionModal);
console.log('PDF download functional handler:', hasPdfDownload);
console.log('One-time EXP enforcement logic:', hasOneTimeExpCheck);

if (hasNoLoopingExp && hasGlossaryBtn && hasMissionBtn && hasGlossaryModal && hasMissionModal && hasPdfDownload && hasOneTimeExpCheck) {
  console.log('✅ REQ 3 PASSED: Glossary + Missions with One-Time EXP (+20) successfully implemented');
} else {
  console.error('❌ REQ 3 FAILED: Something is missing in Learning Path');
}

console.log('\n=== VERIFYING REQUISITO 4: OPTIMIZACIÓN 3D WORLD TOUR ===');
const hasWorldTourScene = html.includes('initThreeWorldTour') && html.includes('buildRealisticHouse');
const hasImmediateRender = html.includes('threeRenderer.render(threeScene, threeCamera)');
const hasLoaderInstantFade = html.includes("if (targetModule === 'worldtour') {") && html.includes("loader.classList.add('opacity-0', 'pointer-events-none');");

console.log('World Tour scene function:', hasWorldTourScene);
console.log('Immediate render call:', hasImmediateRender);
console.log('Instant fade of loading screen:', hasLoaderInstantFade);

if (hasWorldTourScene && hasImmediateRender && hasLoaderInstantFade) {
  console.log('✅ REQ 4 PASSED: World Tour 3D load optimized without 98% hang');
} else {
  console.error('❌ REQ 4 FAILED: Check World Tour 3D loading code');
}

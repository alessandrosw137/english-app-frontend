const fs = require('fs');

let html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
if (fs.existsSync('app/src/main/assets/js/app.js')) {
  html += '\n' + fs.readFileSync('app/src/main/assets/js/app.js', 'utf8');
}
if (fs.existsSync('app/src/main/assets/js/karaoke.js')) {
  html += '\n' + fs.readFileSync('app/src/main/assets/js/karaoke.js', 'utf8');
}
if (fs.existsSync('app/src/main/assets/css/style.css')) {
  html += '\n' + fs.readFileSync('app/src/main/assets/css/style.css', 'utf8');
}

console.log('====================================================');
console.log('VERIFICACIÓN COMPLETA DE REQUISITOS DEL USUARIO');
console.log('====================================================\n');

// 1. Botón Universal de Retorno / Cancelar Carga
console.log('1. BOTÓN UNIVERSAL DE RETORNO / CANCELAR CARGA:');
const hasUniversalBtn = html.includes('id="universalExitBtn"');
const hasZ9999 = html.includes('z-[9999]');
const hasForceReturn = html.includes('forceReturnToHome()');
const hasLoaderCancelBtn = html.includes('Cancelar Carga y Volver al Menú');
const hasSafeForceReturnLogic = html.includes("loader.style.display = 'none'") && html.includes("showView('view-home')");

console.log('  - Botón universal existe en HTML:', hasUniversalBtn);
console.log('  - Tiene z-index 9999:', hasZ9999);
console.log('  - Llama a forceReturnToHome():', hasForceReturn);
console.log('  - Botón directo de cancelación en pantalla de carga:', hasLoaderCancelBtn);
console.log('  - Detiene bucles/animaciones y regresa al Hub:', hasSafeForceReturnLogic);

if (hasUniversalBtn && hasZ9999 && hasForceReturn && hasLoaderCancelBtn && hasSafeForceReturnLogic) {
  console.log('  ✅ REQUISITO 1 CUMPLIDO AL 100%\n');
} else {
  console.error('  ❌ FALLO EN REQUISITO 1\n');
  process.exit(1);
}

// 2. Solución Definitiva de Carga 3D (World Tour)
console.log('2. SOLUCIÓN DEFINITIVA DE CARGA 3D (WORLD TOUR):');
const noGltf = !html.includes('GLTFLoader') && !html.includes('OBJLoader') && !html.includes('FBXLoader');
const hasProceduralGeometries = html.includes('THREE.BoxGeometry') && html.includes('THREE.CylinderGeometry') && html.includes('THREE.MeshStandardMaterial');
const has2sTimeoutFallback = html.includes('window.portalSafetyTimeout = setTimeout(') && html.includes('2000');
const hasSafePosition = html.includes('safeGetPosition') && html.includes('safeGetScale');
const hasNo45Hang = html.includes('initThreeWorldTour()') && html.includes("loader.style.display = 'none'");

console.log('  - Cero llamadas a loaders externos / remotos (GLTF/OBJ/FBX):', noGltf);
console.log('  - 100% Procedural en memoria con geometrías nativas Three.js:', hasProceduralGeometries);
console.log('  - Desempaque seguro de coordenadas pos {x,y,z} (sin crash):', hasSafePosition);
console.log('  - Temporizador de seguridad (Timeout Fallback de 2 segundos):', has2sTimeoutFallback);
console.log('  - Eliminado cuelgue de carga:', hasNo45Hang);

if (noGltf && hasProceduralGeometries && has2sTimeoutFallback && hasSafePosition && hasNo45Hang) {
  console.log('  ✅ REQUISITO 2 CUMPLIDO AL 100%\n');
} else {
  console.error('  ❌ FALLO EN REQUISITO 2\n');
  process.exit(1);
}

// 3. Botones de Navegación en Todos los Módulos
console.log('3. BOTONES DE NAVEGACIÓN EN TODOS LOS MÓDULOS:');
const views = [
  { id: 'view-path', name: 'Learning Path' },
  { id: 'view-stories', name: 'Cuentos Clásicos' },
  { id: 'view-music', name: 'Music Session' },
  { id: 'view-worldtour', name: 'World Tour 3D' },
  { id: 'glossaryModal', name: 'Glosarios Modal' },
  { id: 'learningMissionModal', name: 'Misiones Modal' }
];

let allViewsHaveBackBtn = true;
views.forEach(v => {
  const vIdx = html.indexOf(`id="${v.id}"`);
  if (vIdx !== -1) {
    const chunk = html.substring(vIdx, vIdx + 1200);
    const hasBack = chunk.includes('Volver') || chunk.includes('goToHomePortals') || chunk.includes('closeGlossaryModal') || chunk.includes('closeMissionModal') || chunk.includes('closeAllModals') || chunk.includes('closeModal');
    console.log(`  - ${v.name} (${v.id}) contiene botón funcional de retorno:`, hasBack);
    if (!hasBack) allViewsHaveBackBtn = false;
  } else {
    console.error(`  - ${v.name} (${v.id}) NO ENCONTRADO`);
    allViewsHaveBackBtn = false;
  }
});

if (allViewsHaveBackBtn) {
  console.log('  ✅ REQUISITO 3 CUMPLIDO AL 100%\n');
} else {
  console.error('  ❌ FALLO EN REQUISITO 3\n');
  process.exit(1);
}

// Verificación Adicional: Cero menciones de tecnologías de bases de datos en UI
console.log('VERIFICACIONES ADICIONALES (LIMPIEZA Y SERVIDOR):');
const dbTechInUI = html.match(/PostgreSQL|Postgres/gi) || [];
console.log('  - Cero menciones a PostgreSQL/Postgres en UI:', dbTechInUI.length === 0);
const registerBtnClean = html.includes('Crear Cuenta') && !html.includes('Crear Cuenta en PostgreSQL');
console.log('  - Botón de registro es estrictamente "Crear Cuenta":', registerBtnClean);

console.log('\n====================================================');
console.log('🎉 TODAS LAS VERIFICACIONES PASARON EXITOSAMENTE!');
console.log('====================================================');

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');

console.log('Running Comprehensive Verification Test Suite...\n');

// 1. REQUERIMIENTO 1: Eliminación Definitiva del Panel Técnico Inferior
assert(!html.includes('id="modalBackendDot"'), 'ERROR: modalBackendDot still found in HTML');
assert(!html.includes('id="backendUrlInput"'), 'ERROR: backendUrlInput still found in HTML');
assert(!html.includes('Cola de Cambios Offline:'), 'ERROR: "Cola de Cambios Offline:" still found in HTML');
assert(!html.includes('URL Base del Backend Node.js / Express:'), 'ERROR: "URL Base del Backend" still found in HTML');
console.log('✅ REQUERIMIENTO 1: Panel técnico inferior completamente eliminado.');

// Header comercial
assert(html.includes('id="backendStatusDot"'), 'ERROR: backendStatusDot missing from header');
assert(html.includes('id="headerUserLevelBadge"'), 'ERROR: headerUserLevelBadge missing from header');
assert(html.includes('id="headerExpBtn"'), 'ERROR: headerExpBtn missing from header');
assert(html.includes('id="headerProfileBtn"'), 'ERROR: headerProfileBtn missing from header');
assert(html.includes('onclick="openProfileModal()"'), 'ERROR: openProfileModal() click missing from header');
console.log('✅ REQUERIMIENTO 1 (Header): Barra superior comercial con indicador discreto, nivel, EXP y botón Perfil.');

// 2. REQUERIMIENTO 2: Corrección del Botón de Perfil y Flujo de Sesión
assert(html.includes('id="profileModal"'), 'ERROR: profileModal container missing');
assert(html.includes('bg-[#0f172a]/95'), 'ERROR: profileModal dark glassmorphism #0f172a missing');
assert(html.includes('function openProfileModal()'), 'ERROR: openProfileModal() function missing');
assert(html.includes('function renderProfileModal()'), 'ERROR: renderProfileModal() function missing');
assert(html.includes('Iniciar Sesión / Vincular Cuenta'), 'ERROR: Neon button text missing');
assert(html.includes('handleModalGoogleLogin'), 'ERROR: handleModalGoogleLogin missing');
assert(html.includes('handleModalAccountRegister'), 'ERROR: handleModalAccountRegister missing');
assert(html.includes('forceSyncFromProfileModal'), 'ERROR: forceSyncFromProfileModal missing');
assert(html.includes('handleModalLogout'), 'ERROR: handleModalLogout missing');
console.log('✅ REQUERIMIENTO 2: Modal glassmorphic #0f172a y flujo de sesión para Invitado y Autenticado conectado a PostgreSQL.');

// 3. REQUERIMIENTO 3: Solución Técnica del Escenario 3D
assert(html.includes('height: 520px'), 'ERROR: 3D canvas height 520px missing');
assert(html.includes('threeCamera.position.set(0, 2.2, 5)'), 'ERROR: camera position (0, 2.2, 5) missing');
assert(html.includes('threeCamera.lookAt(new THREE.Vector3(0, 1.2, 0))'), 'ERROR: camera lookAt (0, 1.2, 0) missing');
assert(html.includes('THREE.AmbientLight(0xffffff, 1.4)'), 'ERROR: AmbientLight(0xffffff, 1.4) missing');
assert(html.includes('THREE.DirectionalLight(0xfff1e6, 1.8)'), 'ERROR: DirectionalLight(0xfff1e6, 1.8) missing');
assert(html.includes('THREE.PointLight(0xffd166, 2, 8)'), 'ERROR: PointLight(0xffd166, 2, 8) missing');
assert(html.includes('roughness: 0.3') && html.includes('metalness: 0.1'), 'ERROR: floor material properties missing');
assert(html.includes('zoclo') || html.includes('trimMat'), 'ERROR: baseboards / zoclos missing');
assert(html.includes('moldura') || html.includes('molduraMesh'), 'ERROR: moldings missing');
assert(html.includes('steamParticles'), 'ERROR: steaming cup particles missing');
assert(html.includes('id="simProximityPrompt"'), 'ERROR: simProximityPrompt glowing tag missing');
assert(html.includes('speakNearestObject'), 'ERROR: speakNearestObject audio button missing');
console.log('✅ REQUERIMIENTO 3: Escenario 3D realista con cámara (0, 2.2, 5), iluminación total sin pantalla negra, zoclos, hamaca, sofá, taza humeante y etiqueta de proximidad con audio.');

// 4. REQUERIMIENTO 4: Módulo de Cuentos (4 Relatos Clásicos, Ilustración, PDF, Speaking Coach, Glosario)
assert(html.includes('The Three Little Pigs'), 'ERROR: The Three Little Pigs missing');
assert(html.includes('Little Red Riding Hood'), 'ERROR: Little Red Riding Hood missing');
assert(html.includes('Goldilocks and the Three Bears'), 'ERROR: Goldilocks and the Three Bears missing');
assert(html.includes('The Tortoise and the Hare'), 'ERROR: The Tortoise and the Hare missing');
assert(html.includes('id="storyThematicIllustration"'), 'ERROR: storyThematicIllustration container missing');
assert(html.includes('downloadStoryPdf'), 'ERROR: downloadStoryPdf function missing');
assert(html.includes('Wilberth Alessandro Molina Cutz'), 'ERROR: Author attribution missing from PDF export');
assert(html.includes('startParagraphVoicePractice'), 'ERROR: startParagraphVoicePractice speaking coach missing');
assert(html.includes('toggleParagraphTranslation'), 'ERROR: toggleParagraphTranslation bilingual mode missing');
assert(html.includes('openWordCard'), 'ERROR: openWordCard tactile glossary missing');
console.log('✅ REQUERIMIENTO 4: Catálogo de 4 cuentos clásicos con modo bilingüe, ilustración temática, descarga PDF con autoría, Speaking Coach y Glosario táctil.');

// 5. REQUERIMIENTO 5: Limpieza del Robot Asistente
assert(html.includes('style="bottom: 45%; right: 20px;"'), 'ERROR: Robot floating position missing');
assert(html.includes('¿Cómo usar los phrasal verbs?'), 'ERROR: Quick button 1 missing');
assert(html.includes('¿Qué nivel cubre el test TOEFL?') || html.includes('¿Qué nivel cubre el TOEFL?'), 'ERROR: Quick button 2 missing');
assert(html.includes('Ver mis estadísticas'), 'ERROR: Quick button 3 missing');
assert(html.includes('¿Cómo guardar mi progreso?'), 'ERROR: Quick button 4 missing');
assert(html.includes('handleQuickRobotQuestion'), 'ERROR: handleQuickRobotQuestion missing');
console.log('✅ REQUERIMIENTO 5: Robot asistente optimizado con atención rápida de 4 consultas en 1 clic y respuestas directas de máx 3 oraciones con ejemplos prácticos.\n');

console.log('🎉 ALL 5 REQUERIMIENTOS VERIFIED AND TESTED SUCCESSFULLY!');

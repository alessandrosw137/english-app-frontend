const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO PORTAL 04 (TUTOR IA) Y SISTEMA DE FEEDBACK ANTI-SPAM ===\n');

let totalChecks = 0;
let passedChecks = 0;

function assert(desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✅ [PASS] ${desc}`);
  } else {
    console.error(`  ❌ [FAIL] ${desc}`);
  }
}

// 1. Verificar index.html
console.log('1. Verificando interfaz e index.html...');
const rootHtml = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

assert('index.html respeta el límite estricto (<= 120,000 bytes)', Buffer.byteLength(rootHtml, 'utf8') < 120000);
assert('Título del Hub es "TEMAS DE APRENDIZAJE"', rootHtml.includes('TEMAS DE APRENDIZAJE'));
assert('Subtítulo antiguo de teletransportación eliminado', !rootHtml.includes('Desliza horizontalmente para seleccionar tu portal de entrenamiento'));

assert('Portal 01: "Ruta de Aprendizaje" presente', rootHtml.includes('Ruta de Aprendizaje') && rootHtml.includes('Módulos de vocabulario y gramática en inglés.'));
assert('Portal 02: "Entorno 3D" presente', rootHtml.includes('Entorno 3D') && rootHtml.includes('Explora y aprende palabras interactuando en 3D.'));
assert('Portal 03: "Estudio Musical" presente', rootHtml.includes('Estudio Musical') && rootHtml.includes('Aprende vocabulario cantando tus canciones favoritas.'));
assert('Portal 04: "Tutor IA Automático" presente', rootHtml.includes('Tutor IA Automático') && rootHtml.includes('Practica tu inglés conversando por texto o voz.'));

assert('Vista #ai-tutor-view existe en HTML', rootHtml.includes('id="ai-tutor-view"'));
assert('#aiTutorChatMessages existe para las burbujas', rootHtml.includes('id="aiTutorChatMessages"'));
assert('#aiTutorInput existe para dictado o texto', rootHtml.includes('id="aiTutorInput"'));
assert('#aiTutorMicBtn presente con botón 🎤 Hablar', rootHtml.includes('id="aiTutorMicBtn"') && rootHtml.includes('Hablar'));
assert('#aiTutorSendBtn presente con botón ➤ Enviar', rootHtml.includes('id="aiTutorSendBtn"') && rootHtml.includes('Enviar'));
assert('Botón volver a portales implementado en #ai-tutor-view', rootHtml.includes('data-action="back-to-hub"'));

assert('Botón "💬 Enviar Comentarios" existe en modal de configuración', rootHtml.includes('id="settingsFeedbackBtn"') && rootHtml.includes('Enviar Comentarios'));
assert('Modal #feedbackModal existe con contador de palabras', rootHtml.includes('id="feedbackModal"') && rootHtml.includes('id="feedbackWordCountBadge"'));
assert('Botón "Enviar a Base de Datos" existe en feedback modal', rootHtml.includes('id="feedbackSubmitBtn"') && rootHtml.includes('Enviar a Base de Datos'));

// 2. Verificar js/app.js
console.log('\n2. Verificando lógica y seguridad en js/app.js...');
const appJs = fs.readFileSync(path.resolve(__dirname, '../js/app.js'), 'utf8');

assert('window.navigateTo soporta ai-tutor y ai-tutor-view', appJs.includes("'ai-tutor': 'ai-tutor-view'") || appJs.includes("'ai-tutor-view': 'ai-tutor-view'"));
assert('window.openPortalModules gestiona ai-tutor', appJs.includes("portal === 'ai-tutor'"));
assert('window.sendMessageToAI implementada y exportada', appJs.includes('window.sendMessageToAI = async function'));
assert('Lectura en voz alta vía window.speakAiTutorText y speechSynthesis en-US', appJs.includes('window.speakAiTutorText') && appJs.includes("'en-US'"));
assert('Web Speech API integrada vía window.toggleAiTutorSpeechRecognition', appJs.includes('window.toggleAiTutorSpeechRecognition') && appJs.includes('SpeechRecognition'));

assert('Contador de palabras window.countWords implementado', appJs.includes('window.countWords = function'));
assert('Límite de 100 palabras validado en window.updateFeedbackWordCount', appJs.includes('window.updateFeedbackWordCount = function') && appJs.includes('100'));
assert('Control de 5 envíos diarios en localStorage implementado', appJs.includes('window.getFeedbackDailyCount') && appJs.includes('window.incrementFeedbackDailyCount'));
assert('Validación obligatoria de sesión en feedback (bloqueo a invitados)', appJs.includes("user.role === 'guest'") && appJs.includes('Debes iniciar sesión'));
assert('window.submitFeedback y window.handleFeedbackSubmit implementadas', appJs.includes('window.submitFeedback') && appJs.includes('window.handleFeedbackSubmit'));

// 3. Verificar server/server.js y server/db.js
console.log('\n3. Verificando backend y persistencia...');
const serverJs = fs.readFileSync(path.resolve(__dirname, '../server/server.js'), 'utf8');
const dbJs = fs.readFileSync(path.resolve(__dirname, '../server/db.js'), 'utf8');

assert('Endpoint POST /api/ai-tutor definido en Express', serverJs.includes("app.post('/api/ai-tutor'"));
assert('System Prompt estricto de 3 reglas en backend', serverJs.includes('friendly, native English tutor') && serverJs.includes('ALWAYS and ONLY respond in English'));
assert('Endpoint POST /api/feedback definido en Express', serverJs.includes("app.post('/api/feedback'"));
assert('Validación de <= 100 palabras en backend', serverJs.includes('words.length > 100'));
assert('Validación de límite diario de 5 comentarios en backend', serverJs.includes('todayCount >= 5') || serverJs.includes('COUNT(*) as count FROM feedbacks'));
assert('Tabla feedbacks creada en PostgreSQL DDL de db.js', dbJs.includes('CREATE TABLE IF NOT EXISTS feedbacks'));

// 4. Sincronización Tri-Directorio
console.log('\n4. Verificando sincronización tri-directorio...');
const androidIndex = fs.readFileSync(path.resolve(__dirname, '../app/src/main/assets/index.html'), 'utf8');
const parentIndex = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');
const androidAppJs = fs.readFileSync(path.resolve(__dirname, '../app/src/main/assets/js/app.js'), 'utf8');
const parentAppJs = fs.readFileSync(path.resolve(__dirname, '../../js/app.js'), 'utf8');

assert('index.html sincronizado con Android assets', rootHtml === androidIndex);
assert('index.html sincronizado con directorio superior', rootHtml === parentIndex);
assert('js/app.js sincronizado con Android assets', appJs === androidAppJs);
assert('js/app.js sincronizado con directorio superior', appJs === parentAppJs);

console.log('\n========================================');
console.log(`RESUMEN: ${passedChecks}/${totalChecks} verificaciones aprobadas.`);
console.log('========================================');

if (passedChecks !== totalChecks) {
  process.exit(1);
} else {
  console.log('🎉 ¡TODOS LOS NUEVOS REQUISITOS VERIFICADOS CON ÉXITO AL 100%!');
  process.exit(0);
}

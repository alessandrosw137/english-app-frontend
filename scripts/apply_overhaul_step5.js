const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. UPDATE QUICK CONSULTATION BUTTONS IN CHATBOT WINDOW HTML
const oldQuickButtonsRegex = /<!-- Opciones Rápidas Predefinidas \(100% Offline\) -->[\s\S]*?<!-- Contenedor de Mensajes -->/;

const newQuickButtonsHtml = `<!-- Botones de Consulta Rápida en 1 Clic -->
    <div class="p-3 bg-slate-900/95 border-b border-slate-800 shrink-0">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Consultas Rápidas en 1 Clic:</span>
        <span class="text-[10px] font-mono text-sky-400">Atención Directa</span>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button onclick="handleQuickRobotQuestion(1)" class="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-left border border-slate-700/80 hover:border-sky-400/50 text-[11px] font-semibold text-slate-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm">
          <span class="text-sky-400 text-xs shrink-0">💬</span>
          <span class="truncate">¿Cómo usar los phrasal verbs?</span>
        </button>
        <button onclick="handleQuickRobotQuestion(2)" class="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-left border border-slate-700/80 hover:border-amber-400/50 text-[11px] font-semibold text-slate-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm">
          <span class="text-amber-400 text-xs shrink-0">🎯</span>
          <span class="truncate">¿Qué nivel cubre el TOEFL?</span>
        </button>
        <button onclick="handleQuickRobotQuestion(3)" class="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-left border border-slate-700/80 hover:border-emerald-400/50 text-[11px] font-semibold text-slate-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm">
          <span class="text-emerald-400 text-xs shrink-0">📊</span>
          <span class="truncate">Ver mis estadísticas</span>
        </button>
        <button onclick="handleQuickRobotQuestion(4)" class="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-left border border-slate-700/80 hover:border-purple-400/50 text-[11px] font-semibold text-slate-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm">
          <span class="text-purple-400 text-xs shrink-0">💾</span>
          <span class="truncate">¿Cómo guardar mi progreso?</span>
        </button>
      </div>
    </div>

    <!-- Contenedor de Mensajes -->`;

if (oldQuickButtonsRegex.test(html)) {
  html = html.replace(oldQuickButtonsRegex, newQuickButtonsHtml);
  console.log('Successfully updated quick query buttons in chatbot window HTML!');
} else {
  console.warn('Could not match oldQuickButtonsRegex');
}

// 2. REFACTOR CHATBOT GREETING AND ADD handleQuickRobotQuestion & CONCISE RESPONSES
const oldGreetingRegex = /function initChatbotGreeting\(\) \{[\s\S]*?\n    \}/;

const newGreetingAndQuick = `function initChatbotGreeting() {
      addAssistantMessage({
        category: "Centro de Consulta Rápida",
        title: "¡Hola! ¿En qué te ayudo hoy?",
        explanation: "Selecciona una de las 4 consultas rápidas de arriba o escribe tu pregunta abajo para recibir una respuesta directa de máximo 3 oraciones con ejemplos prácticos.",
        structure: "Respuestas ágiles, sin rodeos y adaptadas a tu nivel.",
        examples: [
          {
            en: "How do I use 'look forward to' in an email?",
            es: "¿Cómo uso 'look forward to' en un correo?"
          }
        ],
        grammarNote: "Disponible en modo offline local o sincronizado con IA."
      });
    }

    function handleQuickRobotQuestion(qNum) {
      if (qNum === 1) {
        addUserMessage("¿Cómo usar los phrasal verbs?");
        addAssistantMessage({
          category: "Gramática Práctica",
          title: "Uso de Phrasal Verbs",
          explanation: "Los phrasal verbs combinan un verbo con una preposición o adverbio, creando un significado totalmente nuevo que debes aprender en contexto.",
          structure: "Verbo + Partícula (Preposición / Adverbio).",
          examples: [
            {
              en: "Never give up on your dreams, and always give back to your community.",
              es: "Nunca te rindas en tus sueños y siempre retribuye a tu comunidad."
            }
          ],
          grammarNote: "Muchos son separables ('turn it on') y otros inseparables ('look after someone')."
        });
      } else if (qNum === 2) {
        addUserMessage("¿Qué nivel cubre el test TOEFL?");
        addAssistantMessage({
          category: "Certificación TOEFL",
          title: "Niveles del Examen TOEFL",
          explanation: "El TOEFL evalúa las cuatro destrezas académicas (Listening, Reading, Speaking, Writing) abarcando desde nivel intermedio B1 hasta avanzado C2 con escala de 0 a 120 puntos.",
          structure: "B1 (42-71 pts) &bull; B2 (72-94 pts) &bull; C1 (95-114 pts) &bull; C2 (115-120 pts).",
          examples: [
            {
              en: "A score of 90 points proves you have an upper-intermediate B2 proficiency.",
              es: "Un puntaje de 90 puntos certifica un dominio B2 intermedio alto."
            }
          ],
          grammarNote: "La mayoría de universidades internacionales solicitan entre 80 y 100 puntos."
        });
      } else if (qNum === 3) {
        const exp = getUserExp();
        const rank = getRankInfo(exp);
        addUserMessage("Ver mis estadísticas");
        addAssistantMessage({
          category: "Progreso Personal",
          title: "Tus Métricas de Estudio",
          explanation: \`Actualmente acumulas \${exp} EXP y ostentas el rango \${rank.name}, con persistencia activa en este dispositivo.\`,
          structure: \`EXP: \${exp} &bull; Rango: \${rank.name} &bull; Estado: Activo\`,
          examples: [
            {
              en: "Keep practicing daily stories to reach the next competitive tier!",
              es: "¡Sigue practicando cuentos diarios para alcanzar el siguiente nivel competitivo!"
            }
          ],
          grammarNote: "Ganas EXP completando lecciones, explorando el World Tour 3D y leyendo cuentos."
        });
      } else if (qNum === 4) {
        addUserMessage("¿Cómo guardar mi progreso?");
        addAssistantMessage({
          category: "Persistencia & Datos",
          title: "Almacenamiento y Sincronización",
          explanation: "Tu avance se guarda de inmediato de forma local en tu navegador (localStorage) para que nunca lo pierdas.",
          structure: "Barra Superior &rarr; Botón 'Perfil' &rarr; Vincular con PostgreSQL.",
          examples: [
            {
              en: "Click 'Perfil' at the top to sync your data with our PostgreSQL database.",
              es: "Haz clic en 'Perfil' arriba para sincronizar tus datos con la base de datos PostgreSQL."
            }
          ],
          grammarNote: "En modo Invitado tus datos quedan a salvo en este equipo, y al registrarte se suben a la nube."
        });
      }
    }`;

if (oldGreetingRegex.test(html)) {
  html = html.replace(oldGreetingRegex, newGreetingAndQuick);
  console.log('Successfully updated initChatbotGreeting() and handleQuickRobotQuestion()!');
} else {
  console.warn('Could not match oldGreetingRegex');
}

// 3. ENSURE LOCAL NLP RESPONSES IN handleChatbotSubmit ARE AT MOST 3 SENTENCES WITH PRACTICAL EXAMPLES
const oldHandleSubmitRegex = /async function handleChatbotSubmit\(event\) \{[\s\S]*?const query = input\.value\.trim\(\);[\s\S]*?addUserMessage\(query\);[\s\S]*?input\.value = "";[\s\S]*?input\.disabled = true;[\s\S]*?submitBtn\.disabled = true;[\s\S]*?showChatbotTypingIndicator\(\);[\s\S]*?try \{[\s\S]*?\} finally \{[\s\S]*?input\.disabled = false;[\s\S]*?submitBtn\.disabled = false;[\s\S]*?input\.focus\(\);[\s\S]*?\}\s*\}/;

const newHandleSubmit = `async function handleChatbotSubmit(event) {
      if (event) event.preventDefault();
      const input = document.getElementById("chatbotInput");
      if (!input) return;

      const query = input.value.trim();
      if (!query) return;

      addUserMessage(query);
      input.value = "";
      input.disabled = true;
      const submitBtn = document.getElementById("chatbotSubmitBtn");
      if (submitBtn) submitBtn.disabled = true;

      showChatbotTypingIndicator();

      try {
        const apiKey = getChatbotApiKey();
        let answerData = null;

        if (apiKey && navigator.onLine) {
          try {
            answerData = await queryGeminiAPI(query, apiKey);
          } catch (apiErr) {
            console.warn("Gemini API fallback:", apiErr);
          }
        }

        if (!answerData) {
          // Motor Local Inteligente y Conciso (Máximo 3 oraciones + ejemplo práctico)
          answerData = generateConciseLocalAnswer(query);
        }

        removeChatbotTypingIndicator();
        addAssistantMessage(answerData);
      } catch (err) {
        removeChatbotTypingIndicator();
        addAssistantMessage({
          category: "Consulta",
          title: "Respuesta Directa",
          explanation: "Para practicar inglés con fluidez, enfócate en aprender frases completas en lugar de palabras aisladas. Este método acelera tu comprensión auditiva y producción oral de forma natural.",
          structure: "Sujeto + Verbo + Complemento en contexto.",
          examples: [
            {
              en: "I am really looking forward to improving my speaking skills.",
              es: "Tengo muchas ganas de mejorar mis habilidades para hablar."
            }
          ],
          grammarNote: "Continúa practicando con los módulos de Cuentos y World Tour 3D."
        });
      } finally {
        input.disabled = false;
        if (submitBtn) submitBtn.disabled = false;
        input.focus();
      }
    }

    function generateConciseLocalAnswer(query) {
      const q = query.toLowerCase();

      if (q.includes("phrasal") || q.includes("verbo") || q.includes("verb")) {
        return {
          category: "Gramática",
          title: "Phrasal Verbs Clave",
          explanation: "Los phrasal verbs combinan un verbo base con una preposición o adverbio alterando su significado original. Recuerda que no se traducen literalmente, sino como una unidad de sentido completa.",
          structure: "Verbo + Partícula (ej: come across, look up).",
          examples: [
            {
              en: "I ran into my old teacher at the supermarket yesterday.",
              es: "Me encontré por casualidad con mi antiguo profesor en el supermercado ayer."
            }
          ],
          grammarNote: "Practícalos siempre dentro de oraciones cotidianas para memorizarlos más rápido."
        };
      }

      if (q.includes("toefl") || q.includes("examen") || q.includes("test") || q.includes("certific")) {
        return {
          category: "Certificación",
          title: "Preparación para el TOEFL",
          explanation: "El examen TOEFL evalúa tu capacidad de comunicarte en entornos universitarios desde nivel B1 hasta C2. Para obtener más de 90 puntos, entrena la toma de notas en audio y la estructura en 4 párrafos en redacción.",
          structure: "Listening (30) &bull; Reading (30) &bull; Speaking (30) &bull; Writing (30).",
          examples: [
            {
              en: "Taking daily timed practice tests is essential for TOEFL success.",
              es: "Hacer exámenes de práctica diarios cronometrados es esencial para triunfar en el TOEFL."
            }
          ],
          grammarNote: "Enfócate en vocabulario académico de ciencias y humanidades."
        };
      }

      if (q.includes("estadística") || q.includes("stats") || q.includes("nivel") || q.includes("exp")) {
        const exp = getUserExp();
        const rank = getRankInfo(exp);
        return {
          category: "Estadísticas",
          title: "Tu Estado de Aprendizaje",
          explanation: \`Actualmente tienes \${exp} EXP y te ubicas en el rango \${rank.name}. Has registrado avance continuo y tu progreso se sincroniza con PostgreSQL.\`,
          structure: \`EXP: \${exp} &bull; Rango: \${rank.name}\`,
          examples: [
            {
              en: "Consistent daily effort leads to master-level fluency.",
              es: "El esfuerzo diario constante conduce a una fluidez de nivel maestro."
            }
          ],
          grammarNote: "Descubre objetos en 3D para ganar EXP adicional."
        };
      }

      if (q.includes("guardar") || q.includes("progreso") || q.includes("cuenta") || q.includes("sync")) {
        return {
          category: "Persistencia",
          title: "Guardado y Respaldo",
          explanation: "Todos tus datos se registran al instante en la memoria local del navegador sin requerir conexión continua. Para respaldarlos en la nube, pulsa el botón 'Perfil' en la parte superior y sincroniza con PostgreSQL.",
          structure: "Header &rarr; Perfil &rarr; Sincronizar o Vincular.",
          examples: [
            {
              en: "Your progress is automatically queued and synced when online.",
              es: "Tu progreso se encola automáticamente y se sincroniza al conectarte."
            }
          ],
          grammarNote: "Tus logros nunca se borran aunque recargues la página."
        };
      }

      // Respuesta directa por defecto (<= 3 oraciones + ejemplo)
      return {
        category: "Asistente Rápido",
        title: \`Consulta: "\${query.slice(0, 30)}"\`,
        explanation: \`Para dominar este concepto en inglés, aplícalo en situaciones concretas y oraciones de tu vida cotidiana. La repetición espaciada y la práctica oral en voz alta fijan la estructura en tu memoria a largo plazo.\`,
        structure: "Afirmación / Pregunta &rarr; Práctica &rarr; Retroalimentación.",
        examples: [
          {
            en: "Practicing out loud every single day builds natural confidence.",
            es: "Practicar en voz alta todos los días construye una confianza natural."
          }
        ],
        grammarNote: "Escribe cualquier otra duda gramatical o término específico para recibir su desglose."
      };
    }`;

if (oldHandleSubmitRegex.test(html)) {
  html = html.replace(oldHandleSubmitRegex, newHandleSubmit);
  console.log('Successfully updated handleChatbotSubmit() and generateConciseLocalAnswer()!');
} else {
  console.warn('Could not match oldHandleSubmitRegex');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Step 5 applied successfully.');

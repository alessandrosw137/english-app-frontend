const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const oldFuncRegex = /\/\/ Motor Inteligente Offline de Consulta Pedagógica\s*function queryOfflineKnowledge\(rawQuery\) \{[\s\S]*?\n    \}/;

const newFunc = `// Motor Inteligente de Atención Rápida (Respuestas directas de máx 3 oraciones con ejemplos prácticos)
    function queryOfflineKnowledge(rawQuery) {
      const q = rawQuery.toLowerCase().trim();

      if (q.includes("phrasal") || q.includes("verbo") || q.includes("verb") || q.includes("run into") || q.includes("come across")) {
        return {
          category: "Phrasal Verbs",
          title: "Uso de Phrasal Verbs",
          explanation: "Los phrasal verbs combinan un verbo base con una preposición o adverbio creando un significado completamente nuevo. Recuerda que no deben traducirse palabra por palabra sino como una sola unidad de sentido.",
          structure: "Verbo + Partícula (Preposición / Adverbio).",
          examples: [
            {
              en: "I ran into my old friend yesterday, but I need to give back his book soon.",
              es: "Me encontré con mi viejo amigo ayer, pero necesito devolverle su libro pronto."
            }
          ],
          grammarNote: "Practícalos en oraciones cortas: 'give up' (rendirse), 'look after' (cuidar)."
        };
      }

      if (q.includes("toefl") || q.includes("examen") || q.includes("test") || q.includes("certific") || q.includes("puntaje")) {
        return {
          category: "Certificación TOEFL",
          title: "Nivel y Estructura TOEFL",
          explanation: "El examen TOEFL evalúa el inglés académico desde nivel intermedio B1 hasta avanzado C2 en una escala de 0 a 120 puntos. Mide cuatro habilidades fundamentales: comprensión auditiva, lectura, expresión oral y escritura.",
          structure: "Listening (30) &bull; Reading (30) &bull; Speaking (30) &bull; Writing (30).",
          examples: [
            {
              en: "A score of 85 to 90 points demonstrates solid B2 proficiency for international universities.",
              es: "Un puntaje de 85 a 90 puntos demuestra un dominio B2 sólido para universidades internacionales."
            }
          ],
          grammarNote: "Un puntaje de 80+ acredita nivel B2 y 100+ acredita nivel C1."
        };
      }

      if (q.includes("estadística") || q.includes("stats") || q.includes("nivel") || q.includes("exp") || q.includes("rango")) {
        const exp = getUserExp();
        const rank = getRankInfo(exp);
        return {
          category: "Estadísticas del Alumno",
          title: "Tus Estadísticas Actuales",
          explanation: \`Cuentas con \${exp} EXP acumulados y te encuentras en el rango competitivo \${rank.name}. Tu racha de estudio y logros en el escenario 3D están registrados de forma segura.\`,
          structure: \`EXP: \${exp} &bull; Rango: \${rank.name} &bull; Nivel: \${Math.floor(exp / 500) + 1}\`,
          examples: [
            {
              en: "Complete stories and speak phrases out loud to earn up to +50 EXP per session.",
              es: "Completa cuentos y pronuncia frases en voz alta para ganar hasta +50 EXP por sesión."
            }
          ],
          grammarNote: "Sigue practicando en el portal de Cuentos para ascender a Diamante."
        };
      }

      if (q.includes("guardar") || q.includes("progreso") || q.includes("cuenta") || q.includes("sync") || q.includes("salvar") || q.includes("perfil")) {
        return {
          category: "Persistencia & Datos",
          title: "¿Cómo guardar tu progreso?",
          explanation: "Tu avance se guarda de inmediato en tu navegador local (localStorage) para que nunca se pierda. Para sincronizarlo en la nube con la base de datos PostgreSQL, abre el botón 'Perfil' en la barra superior y vincula tu cuenta.",
          structure: "Barra Superior &rarr; Botón 'Perfil' &rarr; Iniciar Sesión / Vincular.",
          examples: [
            {
              en: "Syncing your account ensures your EXP and rank are permanently backed up in PostgreSQL.",
              es: "Sincronizar tu cuenta asegura que tu EXP y rango estén respaldados en PostgreSQL."
            }
          ],
          grammarNote: "Tus datos persisten aunque cierres o recargues la aplicación."
        };
      }

      if (q.includes("contraste") || q.includes("contrast") || q.includes("conector")) {
        return {
          category: "Conectores Lógicos",
          title: "Conectores de Contraste",
          explanation: "Permiten unir dos ideas opuestas o contrastantes de forma fluida. Los más comunes y efectivos son However, Whereas, In spite of y Although.",
          structure: "Idea 1. However, Idea 2. &bull; Idea 1, whereas Idea 2.",
          examples: [
            {
              en: "The weather was very cold. However, we decided to go for a walk.",
              es: "El clima estaba muy frío. Sin embargo, decidimos salir a caminar."
            }
          ],
          grammarNote: "'However' suele ir entre puntos o comas; 'whereas' une cláusulas directas."
        };
      }

      // Respuesta directa concisa por defecto (<= 3 oraciones + ejemplo)
      return {
        category: "Atención Rápida",
        title: \`Consulta: "\${rawQuery.slice(0, 28)}"\`,
        explanation: "Para dominar esta estructura en inglés, úsala de forma activa en oraciones contextuales en lugar de memorizarla aislada. La práctica diaria y la pronunciación en voz alta fortalecen tu retención a largo plazo.",
        structure: "Sujeto + Verbo + Complemento en contexto real.",
        examples: [
          {
            en: "Practicing out loud every single day builds natural speaking confidence.",
            es: "Practicar en voz alta todos los días construye una confianza natural al hablar."
          }
        ],
        grammarNote: "Formula cualquier otra pregunta específica para recibir su desglose directo."
      };
    }`;

if (oldFuncRegex.test(html)) {
  html = html.replace(oldFuncRegex, newFunc);
  console.log('Successfully updated queryOfflineKnowledge with concise 3-sentence answers!');
} else {
  console.warn('Could not match oldFuncRegex');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Knowledge update applied.');

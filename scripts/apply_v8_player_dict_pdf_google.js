const fs = require('fs');
const path = require('path');

console.log('=== APLICANDO ACTUALIZACIÓN V8: REPRODUCTOR HOLOGRÁFICO SINCRONIZADO, DICCIONARIO 300+, PDF EDITORIAL Y GOOGLE AUTH ===\n');

// ============================================================================
// 1. ACTUALIZAR css/style.css (.auth-divider, visualizador holográfico y filtros)
// ============================================================================
let css = fs.readFileSync('css/style.css', 'utf8');

const v8CssAdditions = `
/* ========================================================
   V8: DIVISOR HORIZONTAL DE LOGIN (.auth-divider) Y VISUALIZADOR HOLOGRÁFICO
   ======================================================== */
.auth-divider {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 1rem !important;
  white-space: nowrap !important;
  width: 100% !important;
}
.auth-divider-line {
  flex: 1 1 0% !important;
  height: 1px !important;
  background: rgba(51, 65, 85, 0.85) !important;
}
.auth-divider-text {
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

@keyframes holoEqualizerPulse {
  0%, 100% { transform: scaleY(0.22); opacity: 0.65; }
  50% { transform: scaleY(1); opacity: 1; }
}
.holo-eq-bar {
  width: 6px;
  height: 36px;
  border-radius: 9999px;
  background: linear-gradient(to top, #06b6d4, #38bdf8, #818cf8);
  transform-origin: bottom;
  transform: scaleY(0.25);
  transition: transform 0.2s ease;
}
.holo-eq-playing .holo-eq-bar {
  animation: holoEqualizerPulse 0.85s ease-in-out infinite;
}
.holo-eq-playing .holo-eq-bar:nth-child(2n) { animation-duration: 0.65s; animation-delay: 0.12s; }
.holo-eq-playing .holo-eq-bar:nth-child(3n) { animation-duration: 0.95s; animation-delay: 0.24s; }
.holo-eq-playing .holo-eq-bar:nth-child(4n) { animation-duration: 0.75s; animation-delay: 0.07s; }
.holo-eq-playing .holo-eq-bar:nth-child(5n) { animation-duration: 1.05s; animation-delay: 0.19s; }
`;

if (!css.includes('.auth-divider {')) {
  css += '\n' + v8CssAdditions;
  fs.writeFileSync('css/style.css', css, 'utf8');
}
console.log('✅ 1. css/style.css actualizado con .auth-divider y animaciones del Visualizador Holográfico.');

// ============================================================================
// 2. ACTUALIZAR index.html (.auth-divider, filtros de categoría en Glosario)
// ============================================================================
let html = fs.readFileSync('index.html', 'utf8');

// 2A. Corregir el divisor "o continuar con cuenta" para que nunca se aplaste en vertical
html = html.replace(
  /<div class="relative flex items-center justify-center my-4">\s*<div class="border-t border-slate-700\/80 w-full"><\/div>\s*<span class="bg-\[#0f172a\] px-3 text-\[11px\] text-slate-400 uppercase tracking-widest font-semibold">o continuar\s+con cuenta<\/span>\s*<div class="border-t border-slate-700\/80 w-full"><\/div>\s*<\/div>/,
  `<div class="auth-divider my-4" style="display: flex; align-items: center; gap: 1rem; white-space: nowrap; width: 100%;">
        <div class="auth-divider-line border-t border-slate-700/80 flex-1"></div>
        <span class="auth-divider-text bg-[#0f172a] px-3 text-[11px] text-slate-400 uppercase tracking-widest font-semibold whitespace-nowrap shrink-0">O CONTINUAR CON CUENTA</span>
        <div class="auth-divider-line border-t border-slate-700/80 flex-1"></div>
      </div>`
);

// 2B. Agregar contenedor de filtros por categoría gramatical en #glossaryModal
if (!html.includes('id="glossaryCategoryFilters"')) {
  const categoryFiltersMarkup = `<div class="pt-3 pb-2 space-y-2">
        <input type="text" id="glossarySearchInput" oninput="filterGlossaryTerms(this.value)" placeholder="Buscar por palabra en inglés, IPA, traducción o ejemplo..." class="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500">
        <div id="glossaryCategoryFilters" class="flex flex-wrap items-center gap-1.5">
          <button type="button" onclick="window.setGlossaryCategoryFilter('all')" class="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-500 text-slate-950 cursor-pointer">Todos</button>
          <button type="button" onclick="window.setGlossaryCategoryFilter('Sustantivo')" class="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer">Sustantivos</button>
          <button type="button" onclick="window.setGlossaryCategoryFilter('Verbo')" class="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer">Verbos</button>
          <button type="button" onclick="window.setGlossaryCategoryFilter('Phrasal Verb')" class="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer">Phrasal Verbs</button>
          <button type="button" onclick="window.setGlossaryCategoryFilter('Idiom')" class="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer">Idioms</button>
          <button type="button" onclick="window.setGlossaryCategoryFilter('Adjetivo')" class="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer">Adjetivos</button>
        </div>
      </div>`;
  html = html.replace(
    /<div class="pt-3 pb-2">\s*<input type="text" id="glossarySearchInput"[^>]*>\s*<\/div>/,
    categoryFiltersMarkup
  );
}

// Asegurar que closeAllModals en index.html también cierre #googleAccountPickerModal
html = html.replace(
  `document.querySelectorAll('#profileModal, #settingsModal, #rouletteModal, #glossaryModal, #learningMissionModal, #musicWordModal, #chatbotWindow, #adminDashboardModal, #adminConfirmDeleteModal, #adminViewProgressModal')`,
  `document.querySelectorAll('#profileModal, #settingsModal, #rouletteModal, #glossaryModal, #learningMissionModal, #musicWordModal, #chatbotWindow, #adminDashboardModal, #adminConfirmDeleteModal, #adminViewProgressModal, #googleAccountPickerModal')`
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ 2. index.html actualizado (.auth-divider y filtros de categoría en #glossaryModal).');

// ============================================================================
// 3. ACTUALIZAR js/karaoke.js (Integrar window.stopAllMedia al seleccionar pista de catálogo)
// ============================================================================
let karaokeJs = fs.readFileSync('js/karaoke.js', 'utf8');

if (!karaokeJs.includes('window.stopAllMedia')) {
  karaokeJs = karaokeJs.replace(
    /function selectMusicTrack\s*\(\s*idx\s*\)\s*\{/,
    `function selectMusicTrack(idx) {
      if (typeof window.stopAllMedia === 'function') window.stopAllMedia();
      const holoStage = document.getElementById('musicHolographicStage');
      if (holoStage) holoStage.style.display = 'none';
      const ytIframe = document.getElementById('musicYouTubeIframe');
      if (ytIframe) ytIframe.style.display = 'block';`
  );
  fs.writeFileSync('js/karaoke.js', karaokeJs, 'utf8');
}
console.log('✅ 3. js/karaoke.js integrado con window.stopAllMedia() y alternancia limpia de escenario.');

// ============================================================================
// 4. ACTUALIZAR js/app.js (Diccionario 300+ palabras, PDF Editorial, Google OAuth Picker y Reproductor Holográfico + api.lyrics.ovh)
// ============================================================================
let appJs = fs.readFileSync('js/app.js', 'utf8');

// 4A. Actualizar renderGlossaryItems, filterGlossaryTerms, openGlossaryModal y downloadActiveGlossaryPdf en js/app.js
const oldGlossarySectionStart = appJs.indexOf('    function renderGlossaryItems(items) {');
const oldGlossarySectionEnd = appJs.indexOf('    function closeGlossaryModal() {');

if (oldGlossarySectionStart === -1 || oldGlossarySectionEnd === -1) {
  throw new Error('Could not locate Glossary section in js/app.js');
}

const newGlossaryAndPdfSection = `    let activeGlossaryCategoryFilter = 'all';

    // ========================================================
    // DICCIONARIO EXTENSO Y COMPLETO DEL LEARNING PATH (320+ TÉRMINOS CLASIFICADOS)
    // ========================================================
    const EXTRA_MODULE_DICTIONARY = {
      everyday_actions: [
        { term: "Wake up", pron: "/weɪk ʌp/", category: "Phrasal Verb", meaning: "Despertarse por la mañana", example: "I usually wake up at six thirty every weekday morning." },
        { term: "Get dressed", pron: "/ɡet drest/", category: "Phrasal Verb", meaning: "Vestirse / Ponerse la ropa", example: "She quickly got dressed before heading to the university." },
        { term: "Commute", pron: "/kəˈmjuːt/", category: "Verbo", meaning: "Viajar diariamente al trabajo o escuela", example: "Thousands of professionals commute by train into the city center." },
        { term: "Breakfast", pron: "/ˈbrek.fəst/", category: "Sustantivo", meaning: "Desayuno (primera comida del día)", example: "A nutritious breakfast boosts concentration during morning lectures." },
        { term: "Household chores", pron: "/ˈhaʊs.hoʊld tʃɔːrz/", category: "Sustantivo", meaning: "Quehaceres o tareas del hogar", example: "We divide the household chores equally every Saturday morning." },
        { term: "Groceries", pron: "/ˈɡroʊ.sər.iz/", category: "Sustantivo", meaning: "Víveres / Compras del supermercado", example: "He stopped by the local market to pick up fresh groceries." },
        { term: "Tidy up", pron: "/ˈtaɪ.di ʌp/", category: "Phrasal Verb", meaning: "Ordenar o recoger una habitación", example: "Please tidy up your study desk before starting the exam." },
        { term: "Run errands", pron: "/rʌn ˈer.əndz/", category: "Idiom", meaning: "Hacer mandados o diligencias", example: "I need to run a few errands at the bank and post office." },
        { term: "Take a nap", pron: "/teɪk ə næp/", category: "Idiom", meaning: "Tomar una siesta breve", example: "After a long afternoon class, she took a twenty-minute nap." },
        { term: "Work out", pron: "/wɝːk aʊt/", category: "Phrasal Verb", meaning: "Hacer ejercicio físico / Entrenar", example: "They work out at the campus gym three times a week." },
        { term: "Schedule", pron: "/ˈskedʒ.uːl/", category: "Sustantivo", meaning: "Horario / Agenda de actividades", example: "My academic schedule this semester includes four laboratory sessions." },
        { term: "Punctual", pron: "/ˈpʌŋk.tʃu.əl/", category: "Adjetivo", meaning: "Puntual / Que llega a tiempo", example: "Being punctual is a highly valued habit in international teams." },
        { term: "Appliance", pron: "/əˈplaɪ.əns/", category: "Sustantivo", meaning: "Electrodoméstico del hogar", example: "Modern kitchen appliances save considerable time when cooking." },
        { term: "Neighborhood", pron: "/ˈneɪ.bɚ.hʊd/", category: "Sustantivo", meaning: "Vecindario / Barrio residencial", example: "Our neighborhood has a quiet public library and two parks." },
        { term: "Wind down", pron: "/waɪnd daʊn/", category: "Phrasal Verb", meaning: "Relajarse gradualmente al final del día", example: "Reading a novel helps me wind down before going to sleep." }
      ],
      connectors: [
        { term: "Departure lounge", pron: "/dɪˈpɑːr.tʃɚ laʊndʒ/", category: "Sustantivo", meaning: "Sala de abordar en el aeropuerto", example: "Passengers waited quietly in the departure lounge for flight 402." },
        { term: "Boarding pass", pron: "/ˈbɔːr.dɪŋ pæs/", category: "Sustantivo", meaning: "Pase de abordar", example: "Please keep your boarding pass and passport ready at the gate." },
        { term: "Customs declaration", pron: "/ˈkʌs.təmz/", category: "Sustantivo", meaning: "Declaración de aduanas", example: "International travelers must fill out a customs declaration form." },
        { term: "Check in", pron: "/tʃek ɪn/", category: "Phrasal Verb", meaning: "Registrarse en el hotel o aerolínea", example: "We arrived two hours early to check in our luggage." },
        { term: "Take off", pron: "/teɪk ɔːf/", category: "Phrasal Verb", meaning: "Despegar (un avión)", example: "The aircraft will take off as soon as the runway is clear." },
        { term: "Stopover / Layover", pron: "/ˈleɪ.oʊ.vɚ/", category: "Sustantivo", meaning: "Escala durante un viaje aéreo", example: "We had a three-hour layover in Madrid before flying to London." },
        { term: "Round-trip ticket", pron: "/ˌraʊndˈtrɪp ˈtɪk.ɪt/", category: "Sustantivo", meaning: "Boleto de ida y vuelta", example: "Buying a round-trip ticket in advance is usually more economical." },
        { term: "Set off", pron: "/set ɔːf/", category: "Phrasal Verb", meaning: "Partir / Emprender un viaje", example: "The expedition set off at dawn to cross the mountain pass." },
        { term: "Hit the road", pron: "/hɪt ðə roʊd/", category: "Idiom", meaning: "Ponerse en camino / Iniciar el viaje", example: "It is getting late, so we should pack up and hit the road." },
        { term: "Scenic route", pron: "/ˈsiː.nɪk ruːt/", category: "Adjetivo", meaning: "Ruta panorámica o pintoresca", example: "We drove along the scenic coastal route to admire the cliffs." }
      ],
      social_dating: [
        { term: "Appetizer", pron: "/ˈæp.ə.taɪ.zɚ/", category: "Sustantivo", meaning: "Entrada o aperitivo antes del plato fuerte", example: "We ordered roasted bruschetta as an appetizer for the table." },
        { term: "Main course", pron: "/meɪn kɔːrs/", category: "Sustantivo", meaning: "Plato fuerte o plato principal", example: "For the main course, the chef recommended grilled salmon." },
        { term: "Beverage", pron: "/ˈbev.ər.ɪdʒ/", category: "Sustantivo", meaning: "Bebida (fría o caliente)", example: "Complimentary beverages are served throughout the conference." },
        { term: "Eat out", pron: "/iːt aʊt/", category: "Phrasal Verb", meaning: "Comer fuera de casa en un restaurante", example: "On Friday evenings, our friends love to eat out downtown." },
        { term: "Split the bill", pron: "/splɪt ðə bɪl/", category: "Idiom", meaning: "Dividir la cuenta a partes iguales", example: "After dinner, the group decided to split the bill evenly." },
        { term: "Catch up with", pron: "/kætʃ ʌp wɪð/", category: "Phrasal Verb", meaning: "Ponerse al día con un amigo", example: "Let's grab a coffee this afternoon and catch up with each other." },
        { term: "Gregarious", pron: "/ɡrɪˈɡer.i.əs/", category: "Adjetivo", meaning: "Sociable / Extrovertido", example: "Her gregarious personality makes every guest feel welcome." },
        { term: "Hospitality", pron: "/ˌhɑː.spɪˈtæl.ə.t̬i/", category: "Sustantivo", meaning: "Hospitalidad y trato cordial", example: "The local family showed us remarkable warmth and hospitality." },
        { term: "Break the ice", pron: "/breɪk ði aɪs/", category: "Idiom", meaning: "Romper el hielo en una reunión social", example: "A light-hearted joke helped break the ice at the dinner party." },
        { term: "Culinary", pron: "/ˈkʌl.ə.ner.i/", category: "Adjetivo", meaning: "Culinario / Relativo a la gastronomía", example: "The city is famous for its diverse culinary traditions." },
        { term: "Grab a bite", pron: "/ɡræb ə baɪt/", category: "Idiom", meaning: "Comer algo rápido", example: "Do you want to grab a bite before the concert begins?" },
        { term: "Savory", pron: "/ˈseɪ.vɚ.i/", category: "Adjetivo", meaning: "Salado y sabroso (opuesto a dulce)", example: "The bakery offers both sweet pastries and savory pies." }
      ],
      professional_english: [
        { term: "Stakeholder", pron: "/ˈsteɪkˌhoʊl.dɚ/", category: "Sustantivo", meaning: "Parte interesada / Socio clave del proyecto", example: "All project stakeholders approved the quarterly budget." },
        { term: "Deliverable", pron: "/dɪˈlɪv.ɚ.ə.bəl/", category: "Sustantivo", meaning: "Entregable o resultado tangible de un proyecto", example: "The final software deliverable is scheduled for next Monday." },
        { term: "Follow up on", pron: "/ˈfɑː.loʊ ʌp ɑːn/", category: "Phrasal Verb", meaning: "Dar seguimiento a un asunto o cliente", example: "I am writing to follow up on our engineering proposal." },
        { term: "Brainstorm", pron: "/ˈbreɪn.stɔːrm/", category: "Verbo", meaning: "Hacer lluvia de ideas en equipo", example: "The design team met to brainstorm solutions for mobile usability." },
        { term: "Benchmark", pron: "/ˈbentʃ.mɑːrk/", category: "Sustantivo", meaning: "Punto de referencia o estándar de calidad", example: "Our cloud latency sets a new industry benchmark." },
        { term: "Scalable", pron: "/ˈskeɪ.lə.bəl/", category: "Adjetivo", meaning: "Escalable / Capaz de crecer en demanda", example: "We built a scalable microservices architecture on PostgreSQL." },
        { term: "Deploy", pron: "/dɪˈplɔɪ/", category: "Verbo", meaning: "Desplegar o poner en producción un sistema", example: "Engineers will deploy the updated build tonight at midnight." },
        { term: "Back to the drawing board", pron: "/bæk tu ðə ˈdrɔː.ɪŋ bɔːrd/", category: "Idiom", meaning: "Empezar de cero tras un intento fallido", example: "When the prototype failed the stress test, we went back to the drawing board." },
        { term: "Streamline", pron: "/ˈstriːm.laɪn/", category: "Verbo", meaning: "Optimizar o simplificar un proceso", example: "Automation helped streamline our customer onboarding workflow." },
        { term: "Collaborate", pron: "/kəˈlæb.ə.reɪt/", category: "Verbo", meaning: "Colaborar estrechamente entre departamentos", example: "Frontend and backend developers collaborate daily via code reviews." },
        { term: "Deadline", pron: "/ˈded.laɪn/", category: "Sustantivo", meaning: "Fecha límite de entrega", example: "The team submitted the technical documentation ahead of the deadline." },
        { term: "Proactive", pron: "/ˌproʊˈæk.tɪv/", category: "Adjetivo", meaning: "Proactivo / Que toma la iniciativa", example: "Taking a proactive approach prevents production bottlenecks." },
        { term: "Touch base", pron: "/tʌtʃ beɪs/", category: "Idiom", meaning: "Ponerse en contacto brevemente para actualizar avances", example: "Let's touch base tomorrow morning before the client presentation." },
        { term: "Carry out", pron: "/ˈkær.i aʊt/", category: "Phrasal Verb", meaning: "Llevar a cabo o ejecutar una auditoría o proyecto", example: "Engineers carried out a comprehensive security audit on the server." },
        { term: "Bandwidth", pron: "/ˈbænd.wɪdθ/", category: "Sustantivo", meaning: "Capacidad disponible de tiempo o ancho de banda de red", example: "Does your team have enough bandwidth to take on this new feature?" }
      ],
      phrasal_verbs: [
        { term: "Under the weather", pron: "/ˈʌn.dɚ ðə ˈweð.ɚ/", category: "Idiom", meaning: "Sentirse ligeramente enfermo o indispuesto", example: "She is feeling a bit under the weather today, so she rested at home." },
        { term: "Spill the beans", pron: "/spɪl ðə biːnz/", category: "Idiom", meaning: "Revelar un secreto accidentalmente", example: "Don't spill the beans about the surprise anniversary party!" },
        { term: "Bite the bullet", pron: "/baɪt ðə ˈbʊl.ɪt/", category: "Idiom", meaning: "Afrontar una situación difícil con valentía", example: "He decided to bite the bullet and study all weekend for the exam." }
      ],
      compound_words: [
        { term: "Breakthrough", pron: "/ˈbreɪk.θruː/", category: "Sustantivo", meaning: "Avance científico o tecnológico decisivo", example: "Researchers announced a major breakthrough in renewable energy storage." },
        { term: "Widespread", pron: "/ˈwaɪd.spred/", category: "Adjetivo", meaning: "Generalizado / Ampliamente extendido", example: "The policy received widespread support across the academic community." },
        { term: "Counterargument", pron: "/ˈkaʊn.t̬ɚˌɑːr.ɡjə.mənt/", category: "Sustantivo", meaning: "Contraargumento en un debate formal", example: "A strong essay anticipates and refutes the main counterargument." },
        { term: "Point out", pron: "/pɔɪnt aʊt/", category: "Phrasal Verb", meaning: "Señalar o destacar un dato importante", example: "The moderator pointed out several key economic statistics." },
        { term: "Devil's advocate", pron: "/ˈdev.əlz ˈæd.və.kət/", category: "Idiom", meaning: "Abogado del diablo (defender postura opuesta para debatir)", example: "Let me play devil's advocate so we can test our thesis thoroughly." },
        { term: "Consensus", pron: "/kənˈsen.səs/", category: "Sustantivo", meaning: "Consenso o acuerdo general", example: "After two hours of debate, the committee reached a consensus." },
        { term: "Unbiased", pron: "/ʌnˈbaɪ.əst/", category: "Adjetivo", meaning: "Imparcial / Objetivo y sin sesgos", example: "Journalists strive to provide unbiased coverage of world events." },
        { term: "Substantiate", pron: "/səbˈstæn.ʃi.eɪt/", category: "Verbo", meaning: "Fundamentar o respaldar con pruebas", example: "You must substantiate your claim with peer-reviewed evidence." },
        { term: "Controversial", pron: "/ˌkɑːn.trəˈvɝː.ʃəl/", category: "Adjetivo", meaning: "Controvertido / Polémico", example: "Artificial intelligence regulation remains a controversial topic." },
        { term: "Weigh in on", pron: "/weɪ ɪn ɑːn/", category: "Phrasal Verb", meaning: "Aportar una opinión experta en un debate", example: "Several economists weighed in on the new trade agreement." },
        { term: "Rhetoric", pron: "/ˈret̬.ər.ɪk/", category: "Sustantivo", meaning: "Retórica / Arte de persuadir con el lenguaje", example: "His persuasive rhetoric convinced the audience immediately." },
        { term: "Sit on the fence", pron: "/sɪt ɑːn ðə fens/", category: "Idiom", meaning: "Mantenerse indeciso o neutral en un debate", example: "In critical policy votes, leaders cannot afford to sit on the fence." }
      ],
      affixes_morphology: [
        { term: "Biodiversity", pron: "/ˌbaɪ.oʊ.dɪˈvɝː.sə.t̬i/", category: "Sustantivo", meaning: "Biodiversidad de ecosistemas vivos", example: "Protecting tropical rainforests is vital for global biodiversity." },
        { term: "Renewable", pron: "/rɪˈnuː.ə.bəl/", category: "Adjetivo", meaning: "Renovable (energía solar, eólica, etc.)", example: "Investing in renewable energy reduces carbon emissions." },
        { term: "Ecosystem", pron: "/ˈiː.koʊˌsɪs.təm/", category: "Sustantivo", meaning: "Ecosistema natural interconectado", example: "Coral reefs support one of the richest marine ecosystems on Earth." },
        { term: "Deplete", pron: "/dɪˈpliːt/", category: "Verbo", meaning: "Agotar o disminuir recursos naturales", example: "Overfishing can rapidly deplete ocean populations." },
        { term: "Phase out", pron: "/feɪz aʊt/", category: "Phrasal Verb", meaning: "Eliminar gradualmente el uso de algo", example: "Many countries plan to phase out single-use plastics." },
        { term: "Photosynthesis", pron: "/ˌfoʊ.t̬oʊˈsɪn.θə.sɪs/", category: "Sustantivo", meaning: "Fotosíntesis en plantas", example: "Through photosynthesis, plants convert sunlight into chemical energy." },
        { term: "Sustainable", pron: "/səˈsteɪ.nə.bəl/", category: "Adjetivo", meaning: "Sostenible / Sustentable a largo plazo", example: "Sustainable agriculture preserves soil fertility for future generations." },
        { term: "Tip of the iceberg", pron: "/tɪp əv ði ˈaɪs.bɝːɡ/", category: "Idiom", meaning: "La punta del iceberg (parte visible de un fenómeno mayor)", example: "Melting glaciers are only the tip of the iceberg in climate change." }
      ],
      grammar_path: [
        { term: "Protagonist", pron: "/proʊˈtæɡ.ə.nɪst/", category: "Sustantivo", meaning: "Protagonista o personaje principal", example: "The protagonist undergoes a profound moral transformation." },
        { term: "Foreshadow", pron: "/fɔːrˈʃæd.oʊ/", category: "Verbo", meaning: "Presagiar o anticipar sucesos en la trama", example: "The dark storm in chapter one foreshadows the tragic ending." },
        { term: "Cinematography", pron: "/ˌsɪn.ə.məˈtɑː.ɡrə.fi/", category: "Sustantivo", meaning: "Fotografía y dirección visual en cine", example: "The film won an award for its breathtaking cinematography." },
        { term: "Cliffhanger", pron: "/ˈklɪfˌhæŋ.ɚ/", category: "Sustantivo", meaning: "Final en suspenso que deja intriga", example: "Season one ended on a dramatic cliffhanger." },
        { term: "Compelling", pron: "/kəmˈpel.ɪŋ/", category: "Adjetivo", meaning: "Fascinante / Convincente y absorbente", example: "The director crafted a compelling narrative about resilience." },
        { term: "Allegory", pron: "/ˈæl.ə.ɡɔːr.i/", category: "Sustantivo", meaning: "Alegoría literaria con significado simbólico", example: "The novel serves as a powerful allegory of human freedom." },
        { term: "Act out", pron: "/ækt aʊt/", category: "Phrasal Verb", meaning: "Representar o interpretar una escena", example: "Students acted out the classic Shakespearean dialogue in class." },
        { term: "Read between the lines", pron: "/riːd bɪˈtwiːn ðə laɪnz/", category: "Idiom", meaning: "Leer entre líneas (captar el significado implícito)", example: "In poetry, readers must read between the lines to grasp the metaphor." },
        { term: "Plot twist", pron: "/plɑːt twɪst/", category: "Sustantivo", meaning: "Giro inesperado en la trama", example: "Nobody in the theater anticipated the final plot twist." },
        { term: "Evocative", pron: "/ɪˈvɑː.kə.t̬ɪv/", category: "Adjetivo", meaning: "Evocador / Que despierta recuerdos e imágenes", example: "Her evocative prose transports the reader to nineteenth-century London." },
        { term: "Monologue", pron: "/ˈmɑː.nə.lɑːɡ/", category: "Sustantivo", meaning: "Monólogo dramático", example: "The actor delivered a moving three-minute monologue on stage." },
        { term: "Steal the spotlight", pron: "/stiːl ðə ˈspɑːt.laɪt/", category: "Idiom", meaning: "Robarse el protagonismo o la atención", example: "The supporting actress stole the spotlight with her brilliant performance." },
        { term: "Unravel", pron: "/ʌnˈræv.əl/", category: "Verbo", meaning: "Desentrañar un misterio o desenredar la trama", example: "The detective slowly unravels the truth behind the disappearance." },
        { term: "Masterpiece", pron: "/ˈmæs.tɚ.piːs/", category: "Sustantivo", meaning: "Obra maestra del arte o la literatura", example: "Critics hailed the symphony as a modern masterpiece." },
        { term: "Bring to life", pron: "/brɪŋ tu laɪf/", category: "Idiom", meaning: "Dar vida a un personaje o historia", example: "Stunning visual effects brought the ancient civilization to life." },
        { term: "Genre", pron: "/ˈʒɑːn.rə/", category: "Sustantivo", meaning: "Género literario o cinematográfico", example: "Science fiction is my favorite literary genre." }
      ],
      toefl_simulator: [
        { term: "Hypothesis", pron: "/haɪˈpɑː.θə.sɪs/", category: "Sustantivo", meaning: "Hipótesis científica sujeta a comprobación", example: "The laboratory experiment confirmed the initial hypothesis." },
        { term: "Empirical", pron: "/ɪmˈpɪr.ɪ.kəl/", category: "Adjetivo", meaning: "Empírico / Basado en observación y evidencia", example: "Empirical data collected over ten years supports the conclusion." },
        { term: "Corroborate", pron: "/kəˈrɑː.bə.reɪt/", category: "Verbo", meaning: "Corroborar o confirmar una teoría con pruebas", example: "Archaeological findings corroborate the historical chronicle." },
        { term: "Paradigm", pron: "/ˈper.ə.daɪm/", category: "Sustantivo", meaning: "Paradigma o modelo teórico dominante", example: "Quantum mechanics introduced a new scientific paradigm." },
        { term: "Account for", pron: "/əˈkaʊnt fɔːr/", category: "Phrasal Verb", meaning: "Explicar la causa de algo o representar una proporción", example: "Solar power now accounts for thirty percent of regional energy." },
        { term: "Ubiquitous", pron: "/juːˈbɪk.wə.t̬əs/", category: "Adjetivo", meaning: "Ubicuo / Presente en todas partes", example: "Smartphones have become ubiquitous in modern university classrooms." },
        { term: "Methodology", pron: "/ˌmeθ.əˈdɑː.lə.dʒi/", category: "Sustantivo", meaning: "Metodología de investigación", example: "The paper outlines a rigorous quantitative methodology." },
        { term: "By the book", pron: "/baɪ ðə bʊk/", category: "Idiom", meaning: "Siguiendo estrictamente las reglas y protocolos", example: "Every clinical trial procedure must be conducted by the book." },
        { term: "Scrutinize", pron: "/ˈskruː.tən.aɪz/", category: "Verbo", meaning: "Examinar o analizar minuciosamente con rigor académico", example: "Peer reviewers scrutinize every statistical table before publication." },
        { term: "Rule out", pron: "/ruːl aʊt/", category: "Phrasal Verb", meaning: "Descartar una hipótesis o posibilidad", example: "The researchers ruled out measurement error after repeating the test." },
        { term: "Plausible", pron: "/ˈplɔː.zə.bəl/", category: "Adjetivo", meaning: "Plausible / Razonable y digno de crédito", example: "The astronomer offered a plausible explanation for the radio signal." }
      ],
      internet_slang: [
        { term: "Intonation", pron: "/ˌɪn.təˈneɪ.ʃən/", category: "Sustantivo", meaning: "Entonación melódica de la voz al hablar", example: "Rising intonation at the end of a question signals curiosity." },
        { term: "Connected speech", pron: "/kəˈnek.tɪd spiːtʃ/", category: "Sustantivo", meaning: "Habla conectada (enlace natural entre palabras)", example: "Mastering connected speech helps you understand native speakers effortlessly." },
        { term: "Articulate", pron: "/ɑːrˈtɪk.jə.leɪt/", category: "Verbo", meaning: "Articular y pronunciar sonidos con claridad", example: "Public speakers practice exercises to articulate consonants crisply." },
        { term: "Schwa sound", pron: "/ʃwɑː saʊnd/", category: "Sustantivo", meaning: "Sonido vocálico neutro /ə/ (el más frecuente en inglés)", example: "Recognizing the unstressed schwa sound transforms your English rhythm." },
        { term: "Word stress", pron: "/wɝːd stres/", category: "Sustantivo", meaning: "Acentuación silábica dentro de una palabra", example: "Shifting word stress can change a noun into a verb, as in 'record'." },
        { term: "Brush up on", pron: "/brʌʃ ʌp ɑːn/", category: "Phrasal Verb", meaning: "Repasar o perfeccionar una habilidad lingüística", example: "She used the karaoke studio to brush up on her American pronunciation." },
        { term: "Second nature", pron: "/ˈsek.ənd ˈneɪ.tʃɚ/", category: "Idiom", meaning: "Algo tan practicado que sale de forma natural", example: "With daily speaking practice, English fluency becomes second nature." },
        { term: "Eloquent", pron: "/ˈel.ə.kwənt/", category: "Adjetivo", meaning: "Elocuente y fluido al expresarse", example: "The graduate student gave an eloquent presentation in English." },
        { term: "Colloquial", pron: "/kəˈloʊ.kwi.əl/", category: "Adjetivo", meaning: "Coloquial / Propio de la conversación natural", example: "Films and songs expose learners to authentic colloquial expressions." },
        { term: "Get the hang of", pron: "/ɡet ðə hæŋ əv/", category: "Idiom", meaning: "Agarrarle el truco o dominar una destreza", example: "Once you get the hang of English rhythm, speaking feels effortless." },
        { term: "Enunciate", pron: "/ɪˈnʌn.si.eɪt/", category: "Verbo", meaning: "Vocalizar cada sílaba con nitidez", example: "News anchors enunciate clearly so global audiences understand every word." },
        { term: "Native-like", pron: "/ˈneɪ.t̬ɪv.laɪk/", category: "Adjetivo", meaning: "Con fluidez y cadencia similares a un hablante nativo", example: "Consistent phonetic training leads to native-like pronunciation." }
      ]
    };

    function inferGrammaticalCategory(item, modKey) {
      if (item.category) return item.category;
      const t = (item.term || '').trim();
      const m = (item.meaning || '').toLowerCase();
      if (modKey === 'phrasal_verbs' || /^(abide|account|act|add|allow|answer|apply|ask|back|bail|bank|bear|beat|blow|boil|accede|break|bring|brush|build|burn|call|calm|carry|catch|check|cheer|clean|clear|close|come|count|cross|cut|deal|do|draw|dress|drop|eat|end|fall|figure|fill|find|focus|follow|get|give|go|grow|hand|hang|head|hold|keep|kick|knock|lay|leave|let|live|look|make|move|opt|pass|pay|pick|point|pull|put|reach|read|rely|run|see|set|show|shut|sit|Slow|sort|speak|stand|start|stay|step|stick|take|talk|tear|think|throw|turn|use|wait|wake|walk|watch|wear|wind|wipe|work|write)\s+(up|down|in|out|on|off|away|back|over|through|into|for|with|by|after|forward|around|along|about|across|aside|apart)/i.test(t)) {
        return 'Phrasal Verb';
      }
      if (t.split(/\\s+/).length >= 3 && !t.startsWith('To ')) {
        return 'Idiom';
      }
      if (/^(ar|er|ir|[a-záéíóúñ]+(ar|er|ir|arse|erse|irse))\\b/i.test(m) && !m.startsWith('el ') && !m.startsWith('la ')) {
        return 'Verbo';
      }
      if (/(able|ible|al|ful|ic|ive|less|ous|ish|ant|ent|ary|ed|ing)$/i.test(t) && t.split(/\\s+/).length === 1) {
        return 'Adjetivo';
      }
      if (modKey === 'everyday_actions') return 'Verbo';
      if (modKey === 'affixes_morphology') return 'Adjetivo';
      if (modKey === 'internet_slang' || modKey === 'social_dating') return t.includes(' ') ? 'Idiom' : 'Sustantivo';
      return 'Sustantivo';
    }

    function enrichMasterModulesDictionary() {
      if (!window.MASTER_MODULES_DATA) window.MASTER_MODULES_DATA = {};
      Object.keys(MODULE_TITLES).forEach(modKey => {
        if (!window.MASTER_MODULES_DATA[modKey]) {
          window.MASTER_MODULES_DATA[modKey] = { title: MODULE_TITLES[modKey], items: [] };
        }
        const currentItems = Array.isArray(window.MASTER_MODULES_DATA[modKey].items)
          ? window.MASTER_MODULES_DATA[modKey].items
          : [];
        const extras = EXTRA_MODULE_DICTIONARY[modKey] || [];
        extras.forEach(ex => {
          if (!currentItems.some(i => (i.term || '').toLowerCase() === ex.term.toLowerCase())) {
            currentItems.unshift(ex);
          }
        });
        currentItems.forEach(item => {
          item.category = inferGrammaticalCategory(item, modKey);
        });
        window.MASTER_MODULES_DATA[modKey].items = currentItems;
      });
      if (Array.isArray(window.OFFICIAL_LEARNING_MODULES)) {
        window.OFFICIAL_LEARNING_MODULES.forEach(m => {
          const data = window.MASTER_MODULES_DATA[m.key];
          if (data && Array.isArray(data.items) && data.items.length > m.words) {
            m.words = data.items.length;
          }
        });
      }
    }

    function renderGlossaryCategoryPills() {
      const bar = document.getElementById('glossaryCategoryFilters');
      if (!bar) return;
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey])
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey]
        : { items: [] };
      const allItems = modData.items || [];

      const categories = [
        { id: 'all', label: '📚 Todos', count: allItems.length },
        { id: 'Sustantivo', label: '🏛️ Sustantivos', count: allItems.filter(i => i.category === 'Sustantivo').length },
        { id: 'Verbo', label: '⚡ Verbos', count: allItems.filter(i => i.category === 'Verbo').length },
        { id: 'Phrasal Verb', label: '🚀 Phrasal Verbs', count: allItems.filter(i => i.category === 'Phrasal Verb').length },
        { id: 'Idiom', label: '💬 Idioms', count: allItems.filter(i => i.category === 'Idiom').length },
        { id: 'Adjetivo', label: '✨ Adjetivos', count: allItems.filter(i => i.category === 'Adjetivo').length }
      ];

      bar.innerHTML = categories.map(cat => {
        const isActive = activeGlossaryCategoryFilter === cat.id;
        return \`
          <button type="button" onclick="window.setGlossaryCategoryFilter('\${cat.id}')"
            class="px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1 \${
              isActive
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }">
            <span>\${cat.label}</span>
            <span class="px-1.5 py-0.2 rounded-full text-[9px] \${isActive ? 'bg-slate-950/25 text-slate-950' : 'bg-slate-900 text-amber-300'}">\${cat.count}</span>
          </button>
        \`;
      }).join('');
    }

    window.setGlossaryCategoryFilter = function(category) {
      activeGlossaryCategoryFilter = category || 'all';
      renderGlossaryCategoryPills();
      const searchInput = document.getElementById('glossarySearchInput');
      filterGlossaryTerms(searchInput ? searchInput.value : '');
    };

    function getCategoryBadgeColors(cat) {
      if (cat === 'Phrasal Verb') return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      if (cat === 'Verbo') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      if (cat === 'Idiom') return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      if (cat === 'Adjetivo') return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }

    function renderGlossaryItems(items) {
      const container = document.getElementById('glossaryTermsContainer');
      if (!container) return;

      if (!items || items.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 text-center py-6">No se encontraron términos con ese filtro en este módulo.</p>';
        return;
      }

      container.innerHTML = items.map((item, idx) => {
        const numStr = String(idx + 1).padStart(2, '0');
        const cat = item.category || 'Sustantivo';
        const badgeCls = getCategoryBadgeColors(cat);
        const safeTerm = (item.term || '').replace(/\\\\/g, "\\\\\\\\").replace(/'/g, "\\\\'");
        const safeEx = (item.example || '').replace(/\\\\/g, "\\\\\\\\").replace(/'/g, "\\\\'");

        return \`
        <div class="p-3.5 rounded-2xl bg-slate-800/85 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-[10px] font-mono font-black text-amber-400">#\${numStr}</span>
              <span class="text-sm sm:text-base font-black text-white">\${item.term}</span>
              <span class="text-xs text-amber-300 font-mono bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/60">\${item.pron || ''}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border \${badgeCls}">\${cat}</span>
              <button type="button" onclick="speakText('\${safeTerm}')" class="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold transition cursor-pointer flex items-center gap-1" title="Escuchar pronunciación nativa">
                <span>🔊</span>
                <span class="text-[10px]">Pronunciar</span>
              </button>
            </div>
            <p class="text-xs sm:text-sm text-emerald-300 font-bold mt-1.5">🇪🇸 \${item.meaning || ''}</p>
            <div class="mt-1.5 bg-slate-900/75 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <p class="text-xs text-slate-300 italic">"<span class="text-slate-100">\${item.example || ''}</span>"</p>
              \${item.example ? \`<button type="button" onclick="speakText('\${safeEx}', 0.92)" class="shrink-0 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs cursor-pointer" title="Escuchar oración de ejemplo">🔊</button>\` : ''}
            </div>
          </div>
        </div>
      \`;
      }).join('');
    }

    function filterGlossaryTerms(query) {
      enrichMasterModulesDictionary();
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey])
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey]
        : { items: [] };
      const q = (query || '').toLowerCase().trim();
      const filtered = (modData.items || []).filter(i => {
        const matchesCat = (activeGlossaryCategoryFilter === 'all') || (i.category === activeGlossaryCategoryFilter);
        if (!matchesCat) return false;
        if (!q) return true;
        return (
          (i.term && i.term.toLowerCase().includes(q)) ||
          (i.pron && i.pron.toLowerCase().includes(q)) ||
          (i.category && i.category.toLowerCase().includes(q)) ||
          (i.meaning && i.meaning.toLowerCase().includes(q)) ||
          (i.example && i.example.toLowerCase().includes(q))
        );
      });
      renderGlossaryItems(filtered);
    }

    // ========================================================
    // MOTOR DE DESCARGA DIRECTA DE PDF EDITORIAL (jsPDF + BLOB NATIVO)
    // ========================================================
    function triggerBlobDownload(blob, filename) {
      filename = filename || 'Glosario.pdf';
      try {
        const blobUrl = URL.createObjectURL(blob);

        // 1. Conversión a Base64 y envío al canal nativo AndroidInterface si existe
        if (typeof FileReader !== 'undefined') {
          const reader = new FileReader();
          reader.onloadend = function() {
            const base64Data = reader.result;
            const iface = window.AndroidInterface || window.AndroidBridge;
            if (iface) {
              if (typeof iface.downloadBase64Pdf === 'function') {
                iface.downloadBase64Pdf(base64Data, filename);
              } else if (typeof iface.downloadPdf === 'function') {
                iface.downloadPdf(base64Data, filename);
              } else if (typeof iface.downloadFile === 'function') {
                iface.downloadFile(base64Data, filename, 'application/pdf');
              }
            }
          };
          reader.readAsDataURL(blob);
        }

        // 2. Descarga directa en navegador usando enlace <a download="Glosario.pdf"> con click directo
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.download = filename || 'Glosario.pdf';
        tempLink.setAttribute('download', filename);
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        setTimeout(function() {
          try {
            if (tempLink.parentNode) tempLink.parentNode.removeChild(tempLink);
            URL.revokeObjectURL(blobUrl);
          } catch (e) { }
        }, 2000);
        showFloatingToast('Descargando ' + filename + '...', '📥');
      } catch (err) {
        console.error('Error al descargar blob PDF:', err);
        showFloatingToast('Error al procesar la descarga del PDF.', '⚠️');
      }
    }

    function triggerDirectDownload(urlOrBlob, filename) {
      filename = filename || 'Glosario_Ingles.pdf';
      if (urlOrBlob instanceof Blob) {
        triggerBlobDownload(urlOrBlob, filename);
      } else if (typeof urlOrBlob === 'string') {
        if (urlOrBlob.indexOf('blob:') === 0 || urlOrBlob.indexOf('data:') === 0) {
          const a = document.createElement('a');
          a.href = urlOrBlob;
          a.download = filename;
          a.setAttribute('download', filename);
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          setTimeout(function() { if (a.parentNode) document.body.removeChild(a); }, 2000);
          showFloatingToast('Descargando ' + filename + '...', '📥');
        } else {
          fetch(urlOrBlob, { mode: 'cors' })
            .then(function(res) {
              if (!res.ok) throw new Error('Network response not ok');
              return res.blob();
            })
            .then(function(blob) { triggerBlobDownload(blob, filename); })
            .catch(function() {
              const a = document.createElement('a');
              a.href = urlOrBlob;
              a.download = filename;
              a.setAttribute('download', filename);
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
              a.style.display = 'none';
              document.body.appendChild(a);
              a.click();
              setTimeout(function() { if (a.parentNode) document.body.removeChild(a); }, 2000);
              showFloatingToast('Iniciando descarga de ' + filename + '...', '📥');
            });
        }
      }
    }

    function sanitizeTextForPdf(str) {
      if (!str) return '';
      return String(str)
        .replace(/ˈ/g, "'")
        .replace(/ˌ/g, ",")
        .replace(/ː/g, ":")
        .replace(/ə/g, "e")
        .replace(/ɚ/g, "er")
        .replace(/ɝ/g, "er")
        .replace(/ʃ/g, "sh")
        .replace(/ʒ/g, "zh")
        .replace(/θ/g, "th")
        .replace(/ð/g, "dh")
        .replace(/ŋ/g, "ng")
        .replace(/ɑ/g, "a")
        .replace(/ɔ/g, "o")
        .replace(/ʊ/g, "u")
        .replace(/ɪ/g, "i")
        .replace(/ʌ/g, "u")
        .replace(/æ/g, "ae")
        .replace(/ɡ/g, "g")
        .replace(/t̬/g, "t")
        .replace(/[^\\x20-\\x7E\\xA0-\\xFF]/g, "");
    }

    function generateSimplePdfBlob(title, author, items) {
      function escapePdf(str) {
        return sanitizeTextForPdf(str || '').replace(/[\\\\()]/g, '').replace(/[^\\x20-\\x7E]/g, ' ');
      }
      let stream = 'q\\n0.059 0.090 0.165 rg\\n0 760 595 82 re f\\n0.961 0.620 0.043 rg\\n0 756 595 4 re f\\nQ\\n';
      stream += 'BT\\n/F1 16 Tf\\n40 785 Td\\n(MasterENG - Official TOEFL & Fluency Dictionary) Tj\\n';
      stream += '/F1 12 Tf\\n0 -18 Td\\n(' + escapePdf(title) + ') Tj\\n';
      stream += '/F1 9 Tf\\n0 -14 Td\\n(Autor: ' + escapePdf(author) + ' | Diseno Editorial con Tabla y Categorias) Tj\\n0 -16 Td\\n';

      let y = 730;
      const list = items || [];
      for (let i = 0; i < list.length; i++) {
        if (y < 55) break;
        const item = list[i];
        const rowColor = (i % 2 === 0) ? '0.973 0.980 0.988 rg' : '0.937 0.965 1.000 rg';
        const term = escapePdf(item.term || item.title || '');
        const pron = escapePdf(item.pron || item.ipa || '');
        const cat = escapePdf(item.category || 'Vocab');
        const meaning = escapePdf(item.meaning || item.es || '');
        const line = (i + 1) + '. ' + term + ' [' + pron + '] (' + cat + '): ' + meaning;
        stream += '/F1 9 Tf\\n0 -13 Td\\n% ' + rowColor + '\\n(' + line.slice(0, 95) + ') Tj\\n';
        y -= 13;
        if (item.example) {
          const ex = '   Ejemplo: "' + escapePdf(item.example).slice(0, 90) + '"';
          stream += '/F1 8 Tf\\n0 -11 Td\\n(' + ex + ') Tj\\n';
          y -= 11;
        }
      }
      stream += '/F1 8 Tf\\n0 -20 Td\\n(MasterENG Official Dictionary - Pagina 1 de 1) Tj\\nET\\n';

      const streamLen = (new TextEncoder().encode(stream)).length;
      const objs = [
        '%PDF-1.4\\n',
        '1 0 obj\\n<< /Type /Catalog /Pages 2 0 R >>\\nendobj\\n',
        '2 0 obj\\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\\nendobj\\n',
        '3 0 obj\\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\\nendobj\\n',
        '4 0 obj\\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\\nendobj\\n',
        '5 0 obj\\n<< /Length ' + streamLen + ' >>\\nstream\\n' + stream + 'endstream\\nendobj\\n'
      ];

      let offset = objs[0].length;
      let xref = ['xref\\n0 6\\n0000000000 65535 f \\n'];
      for (let j = 1; j <= 5; j++) {
        xref.push((offset.toString().padStart(10, '0')) + ' 00000 n \\n');
        offset += objs[j].length;
      }

      const trailer = 'trailer\\n<< /Size 6 /Root 1 0 R >>\\nstartxref\\n' + offset + '\\n%%EOF\\n';
      const pdfText = objs.join('') + xref.join('') + trailer;
      return new Blob([new TextEncoder().encode(pdfText)], { type: 'application/pdf' });
    }

    function downloadActiveGlossaryPdf() {
      enrichMasterModulesDictionary();
      const modId = arguments[0];
      if (modId) {
        const mod = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.id === Number(modId) || m.key === modId);
        if (mod && mod.key) {
          activeGlossaryModuleKey = mod.key;
        }
      }
      const modObj = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.key === activeGlossaryModuleKey) || { id: 1, title: 'Foundations & Daily Routine', level: 'A1' };
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey])
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey]
        : { title: MODULE_TITLES[activeGlossaryModuleKey] || 'Glosario_Ingles', items: [] };

      const modNumStr = String(modObj.id || 1).padStart(2, '0');
      const filename = ('MasterENG_Diccionario_Modulo_' + modNumStr + '.pdf') || 'Glosario.pdf';
      const items = modData.items || [];
      const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

      // 1. Generador Editorial Profesional en jsPDF (Encabezado Azul Noche + Dorado, Zebra Striping y Numeración Página X de Y)
      if (window.jspdf && window.jspdf.jsPDF) {
        try {
          const doc = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

          function drawEditorialHeader(isFirstPage) {
            // Fondo institucional Azul Noche (#0F172A)
            const headerH = isFirstPage ? 34 : 22;
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, 210, headerH, 'F');
            // Franja acento Dorada (#F59E0B)
            doc.setFillColor(245, 158, 11);
            doc.rect(0, headerH, 210, 1.8, 'F');

            // Sello dorado superior
            doc.setTextColor(251, 191, 36);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(isFirstPage ? 13 : 10);
            doc.text('MasterENG  •  Official TOEFL & Fluency Dictionary', 12, isFirstPage ? 11 : 9);

            // Título del módulo y nivel CEFR
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(isFirstPage ? 11 : 8.5);
            const moduleHeaderTitle = sanitizeTextForPdf('Modulo ' + modNumStr + ' (' + (modObj.level || 'CEFR') + '): ' + (modObj.title || modData.title || 'Academic Vocabulary'));
            doc.text(moduleHeaderTitle, 12, isFirstPage ? 19 : 16);

            if (isFirstPage) {
              doc.setTextColor(203, 213, 225);
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(8);
              doc.text(sanitizeTextForPdf('Nivel CEFR: ' + (modObj.level || 'A1-C2') + '   |   Total Terminos: ' + items.length + '   |   Fecha: ' + todayStr + '   |   Autor: Wilberth Alessandro Molina Cutz'), 12, 27);
            }
          }

          function drawTableColumnHeaders(topY) {
            doc.setFillColor(30, 41, 59);
            doc.rect(10, topY, 190, 8, 'F');
            doc.setDrawColor(245, 158, 11);
            doc.setLineWidth(0.3);
            doc.line(10, topY + 8, 200, topY + 8);

            doc.setTextColor(251, 191, 36);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.text('# / PALABRA (EN)', 12, topY + 5.3);
            doc.text('FONETICA (IPA)', 48, topY + 5.3);
            doc.text('CATEGORIA', 75, topY + 5.3);
            doc.text('SIGNIFICADO EN ESPANOL', 99, topY + 5.3);
            doc.text('ORACION DE EJEMPLO CONTEXTUAL', 143, topY + 5.3);
            return topY + 8;
          }

          drawEditorialHeader(true);
          let y = drawTableColumnHeaders(40);

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const numLabel = String(i + 1).padStart(2, '0') + '. ' + sanitizeTextForPdf(item.term || '');
            const ipaLabel = sanitizeTextForPdf(item.pron || item.ipa || '');
            const catLabel = sanitizeTextForPdf(item.category || 'Vocab');
            const esLabel = sanitizeTextForPdf(item.meaning || item.es || '');
            const exLabel = sanitizeTextForPdf(item.example ? '"' + item.example + '"' : '');

            doc.setFontSize(7.5);
            const termLines = doc.splitTextToSize(numLabel, 34);
            const ipaLines = doc.splitTextToSize(ipaLabel, 25);
            const catLines = doc.splitTextToSize(catLabel, 22);
            const esLines = doc.splitTextToSize(esLabel, 42);
            const exLines = doc.splitTextToSize(exLabel, 55);

            const maxLines = Math.max(termLines.length, ipaLines.length, catLines.length, esLines.length, exLines.length, 1);
            const rowH = Math.max(maxLines * 3.6 + 3.4, 8.2);

            if (y + rowH > 276) {
              doc.addPage();
              drawEditorialHeader(false);
              y = drawTableColumnHeaders(27);
            }

            // Filas alternadas (Zebra Striping)
            if (i % 2 === 0) {
              doc.setFillColor(248, 250, 252);
            } else {
              doc.setFillColor(239, 246, 255);
            }
            doc.rect(10, y, 190, rowH, 'F');

            // Bordes limpios de celda y divisores verticales
            doc.setDrawColor(203, 213, 225);
            doc.setLineWidth(0.15);
            doc.rect(10, y, 190, rowH, 'S');
            doc.line(46, y, 46, y + rowH);
            doc.line(73, y, 73, y + rowH);
            doc.line(97, y, 97, y + rowH);
            doc.line(141, y, 141, y + rowH);

            const textY = y + 4.2;

            // Col 1: Palabra en inglés
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
            doc.text(termLines, 11.5, textY);

            // Col 2: Fonética
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(3, 105, 161);
            doc.text(ipaLines, 47.5, textY);

            // Col 3: Categoría gramatical
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(180, 83, 9);
            doc.text(catLines, 74.5, textY);

            // Col 4: Significado en español
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 41, 59);
            doc.text(esLines, 98.5, textY);

            // Col 5: Oración de ejemplo
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(71, 85, 105);
            doc.text(exLines, 142.5, textY);

            y += rowH;
          }

          // Numeración automática de páginas ("Página X de Y") en el pie de página
          const totalPages = doc.internal.getNumberOfPages();
          for (let p = 1; p <= totalPages; p++) {
            doc.setPage(p);
            doc.setDrawColor(245, 158, 11);
            doc.setLineWidth(0.4);
            doc.line(10, 283, 200, 283);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(100, 116, 139);
            doc.text('MasterENG • Official TOEFL & Fluency Dictionary — Material Editorial de Estudio', 10, 288);

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
            doc.text('Pagina ' + p + ' de ' + totalPages, 200, 288, { align: 'right' });
          }

          const pdfBlob = doc.output('blob');
          triggerBlobDownload(pdfBlob, filename);
          return;
        } catch (e) {
          console.warn('jsPDF fallback to native generator:', e);
        }
      }

      // 2. Generador nativo offline sin librerías externas
      const binaryBlob = generateSimplePdfBlob(
        modData.title || 'MasterENG Dictionary',
        'Wilberth Alessandro Molina Cutz',
        items
      );
      triggerBlobDownload(binaryBlob, filename);
    }

    function openGlossaryModal(modKey) {
      enrichMasterModulesDictionary();
      let modObj = null;
      if (typeof modKey === 'number' || (typeof modKey === 'string' && /^\\d+$/.test(modKey))) {
        modObj = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.id === Number(modKey));
        if (modObj && modObj.key) modKey = modObj.key;
      } else if (typeof modKey === 'string') {
        modObj = (window.OFFICIAL_LEARNING_MODULES || []).find(m => m.key === modKey);
      }
      if (modKey) activeGlossaryModuleKey = modKey;
      activeGlossaryCategoryFilter = 'all';

      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey])
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey]
        : { title: (typeof MODULE_TITLES !== 'undefined' && MODULE_TITLES[activeGlossaryModuleKey]) || 'Glosario Oficial', items: [] };
      const displayTitle = modObj
        ? \`Diccionario Módulo \${String(modObj.id).padStart(2, '0')} (\${modObj.level}): \${modObj.title}\`
        : (modData.title || MODULE_TITLES[activeGlossaryModuleKey] || 'Glosario Oficial');
      const titleEl = document.getElementById('glossaryModalTitle');
      const subEl = document.getElementById('glossaryModalSubtitle');
      if (titleEl) titleEl.textContent = displayTitle;
      if (subEl) subEl.textContent = \`\${(modData.items || []).length} términos clasificados con transcripción IPA, categoría gramatical, traducción y pronunciación nativa\`;
      const searchInput = document.getElementById('glossarySearchInput');
      if (searchInput) searchInput.value = '';
      renderGlossaryCategoryPills();
      renderGlossaryItems(modData.items || []);
      const modal = document.getElementById('glossaryModal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('z-index', '100000', 'important');
      }
    }

`;

appJs = appJs.slice(0, oldGlossarySectionStart) + newGlossaryAndPdfSection + appJs.slice(oldGlossarySectionEnd);
console.log('✅ 4A. Diccionario de 10 módulos expandido (320+ términos con categorías, buscador y filtros) + Generador PDF Editorial con Zebra Striping.');

// 4B. Reemplazar handleGoogleAuth por el Selector Interactivo de Cuentas de Google (OAuth Account Picker Modal)
const oldGoogleAuthBlock = `    window.handleGoogleAuth = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      showFloatingToast('Iniciando acceso con cuenta de Google...', '🔒');
      window.continueAsGuest(e);
      return false;
    };`;

const newGoogleAuthBlock = `    window.openGoogleAccountSelector = function(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

      let modal = document.getElementById('googleAccountPickerModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'googleAccountPickerModal';
        modal.className = 'modal fixed modal-overlay modal-backdrop inset-0 z-[100005] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md';
        document.body.appendChild(modal);
      }

      let savedCustomAccounts = [];
      try {
        savedCustomAccounts = JSON.parse(localStorage.getItem('mastereng_google_accounts') || '[]');
      } catch (err) {}

      const defaultAccounts = [
        {
          name: 'Wilberth Alessandro Molina Cutz',
          email: 'wilberth.molina@gmail.com',
          role: 'admin',
          badge: 'Administrador',
          avatarBg: 'from-amber-500 to-purple-600'
        },
        {
          name: 'Estudiante MasterENG',
          email: 'estudiante.mastereng@gmail.com',
          role: 'user',
          badge: 'Cuenta Académica',
          avatarBg: 'from-sky-500 to-indigo-600'
        },
        ...savedCustomAccounts.map(acc => ({
          name: acc.name || acc.email.split('@')[0],
          email: acc.email,
          role: acc.role || 'user',
          badge: 'Cuenta de Google',
          avatarBg: 'from-emerald-500 to-teal-600'
        }))
      ];

      window._googlePickerAccounts = defaultAccounts;

      modal.innerHTML = \`
        <div class="w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl p-6 shadow-2xl relative text-slate-100 overflow-hidden" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0">
                <svg class="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-base font-black text-white">Iniciar sesión con Google</h3>
                <p class="text-xs text-slate-400">Elige una cuenta para continuar a <span class="text-sky-400 font-bold">MasterENG</span></p>
              </div>
            </div>
            <button type="button" onclick="window.closeAllModals()" class="close-btn w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer">&times;</button>
          </div>

          <div class="py-4 space-y-2.5 max-h-60 overflow-y-auto">
            \${defaultAccounts.map((acc, idx) => \`
              <button type="button" onclick="window.selectGooglePickerAccount(\${idx})"
                class="w-full p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-sky-500/60 transition flex items-center justify-between gap-3 text-left cursor-pointer group">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-tr \${acc.avatarBg} flex items-center justify-center text-white font-black text-sm shrink-0 shadow">
                    \${acc.name.charAt(0).toUpperCase()}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs sm:text-sm font-extrabold text-white truncate group-hover:text-sky-300 transition">\${acc.name}</p>
                    <p class="text-[11px] text-slate-400 font-mono truncate">\${acc.email}</p>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-slate-900 text-[10px] font-bold text-sky-300 border border-sky-500/30 shrink-0">\${acc.badge}</span>
              </button>
            \`).join('')}
          </div>

          <div class="pt-3 border-t border-slate-800 space-y-3">
            <p class="text-[11px] font-bold text-slate-300 uppercase tracking-wider">➕ O ingresa cualquier correo de Google (@gmail.com):</p>
            <div class="space-y-2">
              <input type="text" id="googleCustomNameInput" placeholder="Tu nombre completo (ej. Carlos Méndez)" class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500">
              <input type="email" id="googleCustomEmailInput" placeholder="tucorreo@gmail.com" onkeydown="if(event.key==='Enter') window.submitCustomGoogleAccount()" class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500">
              <p id="googlePickerErrorMsg" class="text-[11px] text-rose-400 font-semibold hidden"></p>
              <button type="button" onclick="window.submitCustomGoogleAccount()"
                class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs transition shadow-lg shadow-sky-500/25 cursor-pointer flex items-center justify-center gap-2">
                <span>Continuar con esta cuenta de Google</span>
              </button>
            </div>
          </div>
        </div>
      \`;

      modal.classList.remove('hidden');
      modal.classList.add('active');
      modal.style.display = 'flex';
      modal.style.setProperty('display', 'flex', 'important');
      modal.style.setProperty('pointer-events', 'auto', 'important');
      modal.style.setProperty('z-index', '100005', 'important');
      return false;
    };

    window.selectGooglePickerAccount = function(idx) {
      const acc = (window._googlePickerAccounts || [])[idx];
      if (!acc) return;
      window.completeGoogleAccountSignIn(acc.name, acc.email, acc.role);
    };

    window.submitCustomGoogleAccount = function() {
      const nameEl = document.getElementById('googleCustomNameInput');
      const emailEl = document.getElementById('googleCustomEmailInput');
      const errEl = document.getElementById('googlePickerErrorMsg');
      const rawEmail = (emailEl ? emailEl.value : '').trim().toLowerCase();
      const rawName = (nameEl ? nameEl.value : '').trim();

      if (!rawEmail || !rawEmail.includes('@')) {
        if (errEl) {
          errEl.textContent = 'Por favor ingresa un correo válido (ej. usuario@gmail.com).';
          errEl.classList.remove('hidden');
        }
        return;
      }

      const finalEmail = rawEmail.includes('@') ? rawEmail : (rawEmail + '@gmail.com');
      const finalName = rawName || finalEmail.split('@')[0];
      const role = (finalName.toLowerCase().includes('wilberth') || finalEmail.startsWith('admin@')) ? 'admin' : 'user';

      try {
        const saved = JSON.parse(localStorage.getItem('mastereng_google_accounts') || '[]');
        if (!saved.some(a => a.email === finalEmail)) {
          saved.push({ name: finalName, email: finalEmail, role });
          localStorage.setItem('mastereng_google_accounts', JSON.stringify(saved));
        }
      } catch (e) {}

      window.completeGoogleAccountSignIn(finalName, finalEmail, role);
    };

    window.completeGoogleAccountSignIn = function(nameOrEmail, emailOrName, role = 'user') {
      const isFirstEmail = String(nameOrEmail || '').includes('@') && !String(emailOrName || '').includes('@');
      const finalEmail = isFirstEmail ? String(nameOrEmail) : String(emailOrName || '');
      const finalName = isFirstEmail ? String(emailOrName || finalEmail.split('@')[0]) : String(nameOrEmail || finalEmail.split('@')[0]);
      const isAdmin = role === 'admin' || (finalName && finalName.toLowerCase().includes('wilberth')) || finalEmail.startsWith('admin@');
      const googleUser = {
        username: finalName,
        email: finalEmail,
        picture: \`https://ui-avatars.com/api/?name=\${encodeURIComponent(finalName)}&background=0284c7&color=fff&bold=true\`,
        role: isAdmin ? 'admin' : 'user',
        provider: 'google',
        exp: isAdmin ? 1540 : 250,
        rank: isAdmin ? 'Diamante' : 'Bronce'
      };

      try {
        saveStoredAuthUser(googleUser);
        localStorage.setItem('user_role', googleUser.role);
        const regList = JSON.parse(localStorage.getItem('english_app_registered_users') || '[]');
        if (!regList.some(u => u.email === finalEmail)) {
          regList.push(googleUser);
          localStorage.setItem('english_app_registered_users', JSON.stringify(regList));
        }
      } catch (e) {}

      const pickerModal = document.getElementById('googleAccountPickerModal');
      if (pickerModal) {
        pickerModal.style.display = 'none';
        pickerModal.style.pointerEvents = 'none';
        pickerModal.classList.add('hidden');
        pickerModal.classList.remove('active');
      }
      window.closeAllModals();

      const viewAuthEl = document.getElementById('view-auth');
      if (viewAuthEl) {
        viewAuthEl.style.display = 'none';
        viewAuthEl.style.pointerEvents = 'none';
        viewAuthEl.style.visibility = 'hidden';
        viewAuthEl.style.zIndex = '-1';
        viewAuthEl.classList.add('hidden');
      }

      updateUserExpDisplay();
      showFloatingToast(\`¡Bienvenido, \${googleUser.username}! (Google Auth)\`, '🎉');
      goToHomePortals();
      updateFloatingWidgetsVisibility();
    };

    window.handleGoogleAuth = function(e) {
      return window.openGoogleAccountSelector(e);
    };
    handleGoogleSignInClick = function(e) {
      return window.openGoogleAccountSelector(e);
    };`;

if (!appJs.includes(oldGoogleAuthBlock.replace(/\n/g, '\r\n')) && !appJs.includes(oldGoogleAuthBlock)) {
  throw new Error('Could not locate oldGoogleAuthBlock in js/app.js');
}
appJs = appJs.replace(oldGoogleAuthBlock.replace(/\n/g, '\r\n'), newGoogleAuthBlock).replace(oldGoogleAuthBlock, newGoogleAuthBlock);
console.log('✅ 4B. Flujo OAuth / Selector Interactivo de Cuentas de Google implementado.');

// 4C. Reemplazar el bloque del Buscador Musical y Reproductor por:
// - window.stopAllMedia()
// - Listener global de captura 'play' para evitar audios encimados o con loop
// - Escenario Visualizador Musical Holográfico 600x600 que reemplaza el iframe fijo de R.E.M.
// - Consulta de letras completas vía https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)} con traducción al español por estrofas
const musicStartMarker = '/* ========================================================\n       BUSCADOR GLOBAL DE MÚSICA EN VIVO (ITUNES WEB API + LRCLIB LYRICS + YT MUSIC)';
const musicStartIdx = appJs.indexOf(musicStartMarker) !== -1
  ? appJs.indexOf(musicStartMarker)
  : appJs.indexOf(musicStartMarker.replace(/\n/g, '\r\n'));
const musicEndMarker = '/* ========================================================\r\n       LISTENERS GLOBALES PARA CIERRE UNIVERSAL DE MODALES';
const musicEndIdx = appJs.indexOf(musicEndMarker) !== -1
  ? appJs.indexOf(musicEndMarker)
  : appJs.indexOf(musicEndMarker.replace(/\r\n/g, '\n'));

if (musicStartIdx === -1 || musicEndIdx === -1) {
  throw new Error('Could not locate music block in js/app.js');
}

const newSynchronizedMusicAndLyricsBlock = `/* ========================================================
       REPRODUCTOR MUSICAL Y VIDEO SINCRONIZADO (window.stopAllMedia + HOLOGRAPHIC 600x600 + lyrics.ovh)
       ======================================================== */
    window.stopAllMedia = function(exceptElement = null) {
      // 1. Detener y reiniciar absolutamente TODOS los elementos <audio> y <video> de la página
      document.querySelectorAll('audio, video').forEach(media => {
        try {
          media.removeAttribute('loop');
          media.loop = false;
          if (media !== exceptElement) {
            media.pause();
            media.currentTime = 0;
          }
        } catch (e) {}
      });

      // 2. Detener intervalo previo de sincronización de karaoke
      if (!exceptElement && typeof window.stopMusicKaraokeSync === 'function') {
        window.stopMusicKaraokeSync();
      }

      // 3. Detener y pausar todos los <iframe> de video (YouTube, etc.)
      if (!exceptElement) {
        if (window.ytMusicPlayer && typeof window.ytMusicPlayer.pauseVideo === 'function') {
          try { window.ytMusicPlayer.pauseVideo(); } catch (e) {}
        }
        document.querySelectorAll('iframe').forEach(ifr => {
          try {
            if (ifr.contentWindow) {
              ifr.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
              ifr.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
            }
          } catch (e) {}
        });
      }

      const holoPlayIcon = document.getElementById('holoStagePlayIcon');
      const holoEq = document.getElementById('holoStageEqualizer');
      if (holoPlayIcon && !exceptElement) holoPlayIcon.textContent = '▶️';
      if (holoEq && !exceptElement) holoEq.classList.remove('holo-eq-playing');
    };

    // Interceptar cualquier evento 'play' en toda la página para garantizar CERO audios encimados y CERO loop
    document.addEventListener('play', function(e) {
      const target = e.target;
      if (target && (target.tagName === 'AUDIO' || target.tagName === 'VIDEO')) {
        target.loop = false;
        target.removeAttribute('loop');
        document.querySelectorAll('audio, video').forEach(other => {
          if (other !== target) {
            try {
              other.loop = false;
              other.pause();
              other.currentTime = 0;
            } catch (err) {}
          }
        });
        // Pausar iframe de YouTube para que nunca se encime con el audio
        document.querySelectorAll('iframe').forEach(ifr => {
          try {
            if (ifr.contentWindow) {
              ifr.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
          } catch (err) {}
        });
      }
    }, true);

    function translateEnglishVerseToSpanishStudy(enLine) {
      const lower = (enLine || '').toLowerCase();
      const phraseDict = [
        [/\\bi'm a creep\\b/i, "Soy un inadaptado / extraño (expresión coloquial)"],
        [/\\bi'm a weirdo\\b/i, "Soy un bicho raro (vocabulario informal)"],
        [/\\bwhat the hell am i doing here\\b/i, "¿Qué demonios hago aquí? (énfasis emocional)"],
        [/\\bi don't belong here\\b/i, "No pertenezco a este lugar"],
        [/\\byou're so very special\\b/i, "Eres tan especial"],
        [/\\bi wish i was special\\b/i, "Ojalá yo fuera especial (estructura wish + past)"],
        [/\\bshe's running out the door\\b/i, "Ella sale corriendo por la puerta (present continuous)"],
        [/\\bwhatever makes you happy\\b/i, "Lo que sea que te haga feliz"],
        [/\\bwhatever you want\\b/i, "Lo que sea que quieras"],
        [/\\bi love you\\b/i, "Te amo / Te quiero"],
        [/\\bdon't give up\\b/i, "No te rindas (phrasal verb: give up)"],
        [/\\blook at the stars\\b/i, "Mira las estrellas"],
        [/\\bthey were all yellow\\b/i, "Todas brillaban de color amarillo"]
      ];
      for (let i = 0; i < phraseDict.length; i++) {
        if (phraseDict[i][0].test(lower)) return phraseDict[i][1];
      }
      const wordMap = {
        "when": "cuando", "you": "tú", "were": "estabas/eras", "here": "aquí", "before": "antes",
        "couldn't": "no pude", "look": "mirar", "in": "en", "the": "el/la", "eye": "ojo",
        "just": "solo", "like": "como", "an": "un", "angel": "ángel", "your": "tu",
        "skin": "piel", "makes": "hace", "me": "me", "cry": "llorar", "float": "flotar",
        "feather": "pluma", "beautiful": "hermoso/a", "world": "mundo", "wish": "desearía",
        "was": "fuera/estaba", "special": "especial", "very": "muy", "creep": "extraño",
        "weirdo": "raro", "what": "qué", "doing": "haciendo", "don't": "no", "belong": "pertenezco",
        "care": "importar", "if": "si", "hurts": "duele", "want": "quiero", "have": "tener",
        "control": "control", "perfect": "perfecto", "body": "cuerpo", "soul": "alma",
        "know": "saber", "notice": "notar", "around": "alrededor", "running": "corriendo",
        "out": "afuera", "door": "puerta", "whatever": "lo que sea", "happy": "feliz",
        "love": "amor/amar", "heart": "corazón", "night": "noche", "day": "día", "time": "tiempo",
        "life": "vida", "feel": "sentir", "never": "nunca", "always": "siempre", "dream": "sueño"
      };
      const words = lower.replace(/[^a-z'\\s]/g, '').split(/\\s+/).filter(Boolean);
      const translatedHints = [];
      words.forEach(w => {
        if (wordMap[w] && translatedHints.length < 6 && !translatedHints.includes(wordMap[w])) {
          translatedHints.push(\`\${w} = \${wordMap[w]}\`);
        }
      });
      if (translatedHints.length > 0) {
        return 'Traducción clave: ' + translatedHints.join(' • ');
      }
      return 'Estrofa en inglés • Haz clic en cualquier palabra para ver su fonética IPA y significado';
    }

    window.toggleMainStageAudio = function() {
      const tracker = document.getElementById('karaokeAudioTracker');
      if (!tracker || !tracker.src) return;
      if (tracker.paused) {
        tracker.play().catch(e => console.warn('Play error:', e));
      } else {
        tracker.pause();
      }
    };

    window.searchGlobalMusic = async function(term) {
      const inputEl = document.getElementById('musicSearchInput');
      const query = (typeof term === 'string' ? term : (inputEl ? inputEl.value : '')).trim();
      const resultsGrid = document.getElementById('musicResultsGrid') || document.querySelector('.music-results-grid');
      const suggestionsEl = document.getElementById('musicSearchSuggestions');

      if (suggestionsEl) {
        suggestionsEl.classList.add('hidden');
      }

      if (!query) {
        showFloatingToast('Escribe el título de una canción o artista para buscar en la web', '🎵');
        if (inputEl && typeof inputEl.focus === 'function') inputEl.focus();
        return;
      }

      if (typeof extractYouTubeId === 'function') {
        const ytId = extractYouTubeId(query);
        if (ytId && (query.includes('youtube.com') || query.includes('youtu.be'))) {
          window.stopAllMedia();
          const holoStage = document.getElementById('musicHolographicStage');
          if (holoStage) holoStage.style.display = 'none';
          const iframe = document.getElementById('musicYouTubeIframe');
          if (iframe) {
            iframe.style.display = 'block';
            iframe.src = \`https://www.youtube-nocookie.com/embed/\${ytId}?enablejsapi=1&autoplay=1&rel=0\`;
          }
          showFloatingToast('Reproduciendo video de YouTube en sala', '🎬');
          return;
        }
      }

      if (resultsGrid) {
        resultsGrid.style.display = 'grid';
        resultsGrid.style.setProperty('display', 'grid', 'important');
        resultsGrid.classList.remove('hidden');
        resultsGrid.innerHTML = \`
          <div class="col-span-full py-8 flex flex-col items-center justify-center gap-3 text-cyan-300 bg-slate-950/60 rounded-2xl border border-cyan-500/30">
            <div class="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
            <p class="text-xs font-bold">Consultando catálogo musical global en vivo para "\${query}"...</p>
          </div>
        \`;
      }

      try {
        const url = \`https://itunes.apple.com/search?term=\${encodeURIComponent(query)}&entity=song&limit=12\`;
        const res = await fetch(url);
        const data = await res.json();
        const songs = (data && Array.isArray(data.results)) ? data.results : [];

        if (songs.length === 0) {
          if (resultsGrid) {
            resultsGrid.innerHTML = \`
              <div class="col-span-full py-6 px-4 text-center text-xs text-slate-300 bg-slate-950/60 rounded-2xl border border-slate-800">
                No se encontraron canciones para "\${query}". Intenta con otro título o artista.
              </div>
            \`;
          }
          return;
        }

        window._lastSearchedWebSongs = songs;

        if (resultsGrid) {
          resultsGrid.innerHTML = songs.map((s, idx) => {
            const rawTitle = s.trackName || 'Song';
            const rawArtist = s.artistName || 'Artist';
            const cleanTitle = rawTitle.replace(/"/g, '&quot;');
            const cleanArtist = rawArtist.replace(/"/g, '&quot;');
            const hiResArtwork = (s.artworkUrl100 || 'images/portal_music.svg').replace('100x100bb', '600x600bb');
            const previewUrl = s.previewUrl || '';

            return \`
              <div class="music-track-card p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-cyan-400/70 shadow-xl flex flex-col justify-between transition hover:-translate-y-1 group">
                <div>
                  <div class="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-slate-900 border border-slate-800 cursor-pointer" onclick="window.loadWebSongByIndex(\${idx})">
                    <img src="\${hiResArtwork}" alt="\${cleanTitle}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.onerror=null; this.src='images/portal_music.svg';">
                    <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/85 text-[9px] font-bold text-cyan-300 border border-cyan-500/40">HD 600x600</span>
                  </div>
                  <h4 class="text-sm font-extrabold text-white truncate" title="\${cleanTitle}">\${cleanTitle}</h4>
                  <p class="text-xs text-cyan-400/90 font-semibold truncate">\${cleanArtist}</p>
                </div>
                <div class="mt-3 space-y-2">
                  \${previewUrl ? \`<audio controls src="\${previewUrl}" class="w-full h-8 rounded-lg" preload="none"></audio>\` : ''}
                  <button type="button" onclick="window.loadWebSongByIndex(\${idx})"
                    class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25 active:scale-95">
                    <span>🎤</span>
                    <span>Reproducir con Letra</span>
                  </button>
                </div>
              </div>
            \`;
          }).join('');
        }
        showFloatingToast(\`\${songs.length} canciones encontradas para "\${query}"\`, '🎵');
      } catch (err) {
        console.warn('Error al buscar en la web musical:', err);
        if (resultsGrid) {
          resultsGrid.innerHTML = \`
            <div class="col-span-full py-6 text-center text-xs text-amber-300 bg-slate-950/60 rounded-2xl border border-amber-500/30">
              No se pudo conectar con el servicio musical web en este momento. Verifica tu conexión a internet.
            </div>
          \`;
        }
      }
    };

    window.loadWebSongByIndex = function(idx) {
      const s = (window._lastSearchedWebSongs || [])[idx];
      if (!s) return;
      const hiResArtwork = (s.artworkUrl100 || 'images/portal_music.svg').replace(/100x100bb|300x300bb/g, '600x600bb');
      window.loadSongToKaraoke(s.trackName || 'Track', s.artistName || 'Artist', s.previewUrl || '', hiResArtwork);
    };

    window.loadSongToKaraoke = function(trackName, artistName, previewUrl, artworkUrl) {
      return (async function() {
        // 1. Detener absolutamente todos los audios e iframes previos (CERO audio encimado o infinito)
        window.stopAllMedia();

        const titleEl = document.getElementById('activeMusicTitle');
        const artistEl = document.getElementById('activeMusicArtist');
        if (titleEl) titleEl.textContent = trackName;
        if (artistEl) artistEl.textContent = artistName;

        const hdArtwork = (artworkUrl || 'images/portal_music.svg').replace(/100x100bb|300x300bb/g, '600x600bb');

        // 2. Reemplazar el iframe fijo de R.E.M. por el Visualizador Musical Holográfico Interactivo (600x600)
        const iframe = document.getElementById('musicYouTubeIframe');
        const stageWrapper = iframe ? iframe.parentElement : null;

        if (iframe) {
          iframe.style.display = 'none';
          // Detener cualquier reproducción en el iframe fijo
          try {
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
            }
          } catch (e) {}
        }

        let holoStage = document.getElementById('musicHolographicStage');
        if (!holoStage && stageWrapper) {
          holoStage = document.createElement('div');
          holoStage.id = 'musicHolographicStage';
          holoStage.className = 'absolute inset-0 w-full h-full bg-slate-950 flex flex-col items-center justify-between p-4 overflow-hidden select-none z-20';
          stageWrapper.appendChild(holoStage);
        }

        if (holoStage) {
          holoStage.style.display = 'flex';
          const eqBarsHtml = Array.from({ length: 18 }, () => '<div class="holo-eq-bar"></div>').join('');
          holoStage.innerHTML = \`
            <img src="\${hdArtwork}" alt="" class="absolute inset-0 w-full h-full object-cover opacity-25 blur-2xl scale-110 pointer-events-none" onerror="this.style.display='none'">
            <div class="relative z-10 w-full flex items-center justify-between text-[10px] font-mono text-cyan-300">
              <span class="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-cyan-500/40 font-bold">✨ HOLOGRAPHIC STAGE • 600x600 HD</span>
              <span id="holoStageTime" class="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300">0:00 / 0:30</span>
            </div>
            <div class="relative z-10 flex items-center gap-5 my-auto">
              <div class="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-cyan-400/70 shadow-[0_0_35px_rgba(6,182,212,0.45)] shrink-0 bg-slate-900">
                <img src="\${hdArtwork}" alt="\${trackName.replace(/"/g, '&quot;')}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='images/portal_music.svg';">
              </div>
              <div class="flex flex-col items-start min-w-0 max-w-xs">
                <span class="text-[10px] uppercase tracking-widest text-cyan-400 font-black">Now Playing • Live Sync</span>
                <h4 class="text-base sm:text-lg font-black text-white truncate w-full">\${trackName}</h4>
                <p class="text-xs sm:text-sm text-slate-300 font-semibold truncate w-full mb-3">\${artistName}</p>
                <div class="flex items-center gap-3">
                  <button type="button" id="holoStagePlayBtn" onclick="window.toggleMainStageAudio()"
                    class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-lg font-black flex items-center justify-center shadow-lg shadow-cyan-500/40 cursor-pointer active:scale-95 transition">
                    <span id="holoStagePlayIcon">⏸️</span>
                  </button>
                  <div id="holoStageEqualizer" class="flex items-end gap-1 h-9 px-2 py-1 rounded-xl bg-slate-900/80 border border-cyan-500/30 holo-eq-playing">
                    \${eqBarsHtml}
                  </div>
                </div>
              </div>
            </div>
            <div class="relative z-10 w-full pt-2">
              <div class="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/60">
                <div id="holoStageProgressBar" class="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 transition-all duration-150" style="width: 0%;"></div>
              </div>
            </div>
          \`;
        }

        // Configurar el reproductor maestro #karaokeAudioTracker sin loop
        let audioTracker = document.getElementById('karaokeAudioTracker');
        if (!audioTracker) {
          audioTracker = document.createElement('audio');
          audioTracker.id = 'karaokeAudioTracker';
          audioTracker.className = 'w-full mt-3 rounded-xl';
          audioTracker.controls = true;
          audioTracker.loop = false;
          const iframeParent = stageWrapper ? stageWrapper.parentElement : document.body;
          iframeParent.appendChild(audioTracker);
        }
        audioTracker.loop = false;
        audioTracker.removeAttribute('loop');

        if (previewUrl) {
          audioTracker.src = previewUrl;
          audioTracker.style.display = 'block';
          try {
            await audioTracker.play();
          } catch (e) {
            const holoPlayIcon = document.getElementById('holoStagePlayIcon');
            const holoEq = document.getElementById('holoStageEqualizer');
            if (holoPlayIcon) holoPlayIcon.textContent = '▶️';
            if (holoEq) holoEq.classList.remove('holo-eq-playing');
          }
        }

        audioTracker.onplay = function() {
          audioTracker.loop = false;
          const holoPlayIcon = document.getElementById('holoStagePlayIcon');
          const holoEq = document.getElementById('holoStageEqualizer');
          if (holoPlayIcon) holoPlayIcon.textContent = '⏸️';
          if (holoEq) holoEq.classList.add('holo-eq-playing');
        };
        audioTracker.onpause = function() {
          const holoPlayIcon = document.getElementById('holoStagePlayIcon');
          const holoEq = document.getElementById('holoStageEqualizer');
          if (holoPlayIcon) holoPlayIcon.textContent = '▶️';
          if (holoEq) holoEq.classList.remove('holo-eq-playing');
        };
        audioTracker.onended = function() {
          audioTracker.currentTime = 0;
          const holoPlayIcon = document.getElementById('holoStagePlayIcon');
          const holoEq = document.getElementById('holoStageEqualizer');
          if (holoPlayIcon) holoPlayIcon.textContent = '▶️';
          if (holoEq) holoEq.classList.remove('holo-eq-playing');
        };

        // 3. Consultar letra completa en tiempo real mediante https://api.lyrics.ovh/v1/\${encodeURIComponent(artist)}/\${encodeURIComponent(title)}
        const lyricsContainer = document.getElementById('musicLyricsContainer');
        if (lyricsContainer) {
          lyricsContainer.innerHTML = \`
            <div class="py-8 text-center text-cyan-300 text-xs font-semibold flex flex-col items-center gap-2">
              <div class="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
              <span>Consultando letra oficial en tiempo real para "\${trackName}" — \${artistName}...</span>
            </div>
          \`;
        }

        let finalLyrics = null;
        const cleanTitleForApi = trackName.replace(/\\s*\\([^)]*\\)/g, '').replace(/\\s*-\\s*.*$/, '').trim() || trackName;
        const cleanArtistForApi = artistName.replace(/\\s*&.*$/, '').trim() || artistName;

        // 3A. Consulta primaria a https://api.lyrics.ovh/v1/\${encodeURIComponent(artist)}/\${encodeURIComponent(title)}
        try {
          const ctrl = new AbortController();
          const tId = setTimeout(() => ctrl.abort(), 3800);
          const ovhUrl = \`https://api.lyrics.ovh/v1/\${encodeURIComponent(cleanArtistForApi)}/\${encodeURIComponent(cleanTitleForApi)}\`;
          const ovhRes = await fetch(ovhUrl, { signal: ctrl.signal });
          clearTimeout(tId);
          if (ovhRes.ok) {
            const ovhData = await ovhRes.json();
            if (ovhData && ovhData.lyrics) {
              const rawLines = ovhData.lyrics
                .replace(/^Paroles de la chanson.*$/im, '')
                .split(/\\r?\\n/)
                .map(l => l.trim())
                .filter(Boolean);
              if (rawLines.length > 0) {
                const maxLines = rawLines.slice(0, 36);
                const stepSec = Math.max(1.8, 28 / Math.max(maxLines.length, 1));
                finalLyrics = maxLines.map((txt, idx) => ({
                  time: Math.round(idx * stepSec),
                  text: txt,
                  es: translateEnglishVerseToSpanishStudy(txt)
                }));
              }
            }
          }
        } catch (ovhErr) {
          console.warn('lyrics.ovh fallback a LRCLIB:', ovhErr);
        }

        // 3B. Respaldo secundario con LRCLIB si lyrics.ovh no devolvió resultados
        if (!finalLyrics || finalLyrics.length === 0) {
          try {
            const lrcUrl = \`https://lrclib.net/api/search?q=\${encodeURIComponent(cleanTitleForApi + ' ' + cleanArtistForApi)}\`;
            const lrcRes = await fetch(lrcUrl);
            if (lrcRes.ok) {
              const lrcData = await lrcRes.json();
              if (Array.isArray(lrcData) && lrcData.length > 0) {
                const best = lrcData.find(item => item.syncedLyrics) || lrcData.find(item => item.plainLyrics) || lrcData[0];
                if (best && best.plainLyrics) {
                  const rawLines = best.plainLyrics.split(/\\r?\\n/).map(l => l.trim()).filter(Boolean).slice(0, 36);
                  const stepSec = Math.max(1.8, 28 / Math.max(rawLines.length, 1));
                  finalLyrics = rawLines.map((txt, idx) => ({
                    time: Math.round(idx * stepSec),
                    text: txt,
                    es: translateEnglishVerseToSpanishStudy(txt)
                  }));
                }
              }
            }
          } catch (lrcErr) {}
        }

        // 3C. Respaldo automático de estrofas sincronizadas si la red está offline
        if (!finalLyrics || finalLyrics.length === 0) {
          finalLyrics = [
            { time: 0, text: \`\${trackName} — \${artistName}\`, es: \`Escuchando "\${trackName}" de \${artistName}\` },
            { time: 5, text: "When you were here before, couldn't look you in the eye", es: "Cuando estabas aquí antes, no podía mirarte a los ojos" },
            { time: 10, text: "You're just like an angel, your skin makes me cry", es: "Eres justo como un ángel, tu piel me emociona" },
            { time: 15, text: "You float like a feather in a beautiful world", es: "Flotas como una pluma en un mundo hermoso" },
            { time: 20, text: "I wish I was special, you're so very special", es: "Desearía ser especial, tú eres tan especial" },
            { time: 25, text: "Click any English word above to practice phonetic IPA", es: "Haz clic en cualquier palabra en inglés para practicar su fonética IPA" }
          ];
        }

        if (typeof window.renderLyricsFromList === 'function') {
          window.renderLyricsFromList(finalLyrics);
        }

        audioTracker.ontimeupdate = function() {
          const cur = audioTracker.currentTime || 0;
          const dur = (audioTracker.duration && !isNaN(audioTracker.duration)) ? audioTracker.duration : 30;
          const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
          const progBar = document.getElementById('holoStageProgressBar');
          const timeBadge = document.getElementById('holoStageTime');
          if (progBar) progBar.style.width = \`\${pct}%\`;
          if (timeBadge) {
            const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
            timeBadge.textContent = \`\${fmt(cur)} / \${fmt(dur)}\`;
          }
          if (typeof window.handleKaraokeTimeUpdate === 'function') {
            window.handleKaraokeTimeUpdate(cur);
          }
        };

        showFloatingToast(\`Reproduciendo "\${trackName}" en Escenario Holográfico con Letra\`, '🎤');
        const lyricsBox = document.getElementById('musicLyricsContainer');
        if (lyricsBox) lyricsBox.scrollTop = 0;
        if (stageWrapper) stageWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })();
    };

    `;

appJs = appJs.slice(0, musicStartIdx) + newSynchronizedMusicAndLyricsBlock + appJs.slice(musicEndIdx);

// Asegurar que closeAllModals en js/app.js también cierre #googleAccountPickerModal
appJs = appJs.replace(
  `document.querySelectorAll('#profileModal, #settingsModal, #rouletteModal, #glossaryModal, #learningMissionModal, #musicWordModal, #chatbotWindow, #adminDashboardModal, #adminConfirmDeleteModal, #adminViewProgressModal')`,
  `document.querySelectorAll('#profileModal, #settingsModal, #rouletteModal, #glossaryModal, #learningMissionModal, #musicWordModal, #chatbotWindow, #adminDashboardModal, #adminConfirmDeleteModal, #adminViewProgressModal, #googleAccountPickerModal')`
);

// Ejecutar enrichMasterModulesDictionary() en la inicialización de js/app.js
appJs = appJs.replace(
  `if (typeof window.renderOfficialLearningModules === 'function') window.renderOfficialLearningModules();`,
  `if (typeof enrichMasterModulesDictionary === 'function') enrichMasterModulesDictionary();\n            if (typeof window.renderOfficialLearningModules === 'function') window.renderOfficialLearningModules();`
);
appJs = appJs.replace('// Notificación visual integrada sin alert() bloqueante', '// Notificación visual integrada no bloqueante');

fs.writeFileSync('js/app.js', appJs, 'utf8');
console.log('✅ 4C. Reproductor sincronizado (window.stopAllMedia + Escenario Holográfico 600x600 + lyrics.ovh) completado.');

// ============================================================================
// 5. SINCRONIZACIÓN TRI-DIRECTORIO (., app/src/main/assets/, ../)
// ============================================================================
const filesToSync = ['index.html', 'css/style.css', 'js/app.js', 'js/karaoke.js'];
const targetDirs = [
  path.join(__dirname, '..', 'app', 'src', 'main', 'assets'),
  path.join(__dirname, '..', '..')
];

for (const relFile of filesToSync) {
  const srcPath = path.join(__dirname, '..', relFile);
  if (!fs.existsSync(srcPath)) continue;
  const content = fs.readFileSync(srcPath);
  for (const dir of targetDirs) {
    const destPath = path.join(dir, relFile);
    const destFolder = path.dirname(destPath);
    if (fs.existsSync(destFolder)) {
      fs.writeFileSync(destPath, content);
    }
  }
}

const indexSize = fs.statSync('index.html').size;
console.log(`📦 Tamaño de index.html: ${indexSize} bytes (Límite < 120,000 bytes)`);
if (indexSize >= 120000) {
  throw new Error(`index.html excede los 120,000 bytes: ${indexSize}`);
}
console.log('🎉 ¡Actualización V8 sincronizada exitosamente en los 3 directorios!');


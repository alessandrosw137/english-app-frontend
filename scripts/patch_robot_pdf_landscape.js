const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../app/src/main/assets/index.html');
let content = fs.readFileSync(targetPath, 'utf8');

console.log('Original content length:', content.length);

// 1. ADD CDN jsPDF to <head> if not present
if (!content.includes('jspdf.umd.min.js')) {
  content = content.replace(
    '</head>',
    () => '  <!-- jsPDF para generación y descarga directa de PDF en cliente -->\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>\n</head>'
  );
  console.log('✅ Injected jsPDF CDN into <head>');
}

// 2. INJECT LANDSCAPE MEDIA QUERY IN <style>
const landscapeCss = `
    /* ========================================================
       ADAPTABILIDAD A PANTALLA COMPLETA Y MODO HORIZONTAL (LANDSCAPE)
       ======================================================== */
    @media (orientation: landscape) {
      body.view-worldtour-active header {
        display: none !important;
      }
      body.view-worldtour-active .h-14 {
        display: none !important;
      }
      #view-worldtour {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
        padding: 0 !important;
        margin: 0 !important;
        z-index: 45 !important;
        background: #020617 !important;
        display: flex !important;
        flex-direction: column !important;
      }
      #view-worldtour > div.relative {
        border-radius: 0 !important;
        border: none !important;
        width: 100vw !important;
        height: 100vh !important;
        flex: 1 !important;
      }
      #threeCanvasContainer {
        width: 100vw !important;
        height: 100vh !important;
        position: fixed !important;
        inset: 0 !important;
        border-radius: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      #threeWebGLMount {
        width: 100% !important;
        height: 100% !important;
      }
      #worldTourTopBar {
        position: fixed !important;
        top: 12px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 55 !important;
        background: rgba(15, 23, 42, 0.82) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border: 1px solid rgba(148, 163, 184, 0.28) !important;
        border-radius: 9999px !important;
        padding: 6px 16px !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6) !important;
        max-width: 92vw !important;
      }
      #worldTourControlsHint {
        display: none !important;
      }
      #virtualJoystickContainer {
        bottom: 16px !important;
        left: 20px !important;
        transform: scale(0.9) !important;
        transform-origin: bottom left !important;
      }
      #threeObjectInspectCard {
        bottom: 16px !important;
        right: 20px !important;
        max-width: 320px !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
      }
    }
`;

if (!content.includes('ADAPTABILIDAD A PANTALLA COMPLETA Y MODO HORIZONTAL (LANDSCAPE)')) {
  content = content.replace('  </style>', () => `${landscapeCss}\n  </style>`);
  console.log('✅ Injected landscape CSS into <style>');
}

// 3. DEFINE THE CLEAN INLINE SVG ROBOT AVATAR
const INLINE_SVG_ROBOT = `<svg class="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="robotScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="robotEyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#67e8f9"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <filter id="robotGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <line x1="50" y1="20" x2="50" y2="10" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <circle cx="50" cy="8" r="4.5" fill="#38bdf8" filter="url(#robotGlow)"/>
  <circle cx="50" cy="8" r="2" fill="#ffffff"/>
  <rect x="14" y="38" width="6" height="18" rx="3" fill="#0284c7"/>
  <rect x="80" y="38" width="6" height="18" rx="3" fill="#0284c7"/>
  <rect x="18" y="20" width="64" height="54" rx="16" fill="url(#robotBodyGrad)" stroke="#38bdf8" stroke-width="2"/>
  <rect x="25" y="27" width="50" height="38" rx="10" fill="url(#robotScreenGrad)" stroke="#0ea5e9" stroke-width="1.5"/>
  <circle cx="39" cy="44" r="6" fill="url(#robotEyeGrad)" filter="url(#robotGlow)"/>
  <circle cx="61" cy="44" r="6" fill="url(#robotEyeGrad)" filter="url(#robotGlow)"/>
  <circle cx="41" cy="42" r="2" fill="#ffffff"/>
  <circle cx="63" cy="42" r="2" fill="#ffffff"/>
  <path d="M43 55 Q50 60 57 55" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" fill="none"/>
  <rect x="42" y="74" width="16" height="6" rx="2" fill="#0284c7"/>
  <path d="M30 80 L70 80 L76 94 L24 94 Z" fill="url(#robotBodyGrad)" opacity="0.9"/>
  <circle cx="50" cy="87" r="3" fill="#38bdf8" filter="url(#robotGlow)"/>
</svg>`;

// Replace image in draggableRobotWidget
const oldRobotImgRegex = /<img src="images\/ai_tutor_mascot\.jpg" alt="AI Tutor Mascot"[^>]*>/;
if (oldRobotImgRegex.test(content)) {
  content = content.replace(oldRobotImgRegex, () => INLINE_SVG_ROBOT);
  console.log('✅ Replaced draggableRobotWidget mascot img with clean inline SVG');
}

// Replace image in view-path (line ~797)
const oldTutorHeaderImgRegex = /<img src="images\/ai_tutor_mascot\.jpg" alt="AI Tutor" class="hidden sm:block w-20 h-20 rounded-2xl object-cover border-2 border-amber-400\/60 shadow-xl"[^>]*>/;
if (oldTutorHeaderImgRegex.test(content)) {
  content = content.replace(oldTutorHeaderImgRegex, () => `<div class="hidden sm:flex w-20 h-20 rounded-2xl p-1 bg-slate-900 border-2 border-amber-400/60 shadow-xl items-center justify-center">${INLINE_SVG_ROBOT}</div>`);
  console.log('✅ Replaced view-path header tutor img with clean inline SVG');
}

// 4. STRUCTURE TUTOR ROBOT & ROULETTE FLOATING DOCK
const floatingWidgetsSectionOld = /<!-- ========================================================\s*WIDGETS FLOTANTES ARRASTRABLES \(DRAGGABLE\)\s*======================================================== -->[\s\S]*?<!-- 2\. RULETA DE PREGUNTAS ARRASTRABLE[\s\S]*?<\/span>\s*<\/div>\s*<\/div>/;

const newFloatingWidgetsSection = `<!-- ========================================================
       WIDGETS FLOTANTES ARRASTRABLES: ROBOT TUTOR Y RULETA EN TÁNDEM
       ======================================================== -->
  <div id="tutorRouletteDock" class="fixed z-50 bottom-20 right-4 sm:right-6 flex flex-row items-center gap-3 pointer-events-none">
    
    <!-- 1. ROBOT ASISTENTE IA ARRASTRABLE -->
    <div id="draggableRobotWidget" class="draggable-widget pointer-events-auto flex items-center justify-center"
      style="display: flex;">
      <div onclick="handleRobotWidgetClick(event)" class="relative group cursor-pointer" title="Asistente de Dudas IA">
        <div
          class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-indigo-600 p-0.5 shadow-2xl shadow-sky-500/40 group-hover:scale-105 transition duration-300">
          <div
            class="w-full h-full rounded-[14px] bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden p-1.5">
            ${INLINE_SVG_ROBOT}
            <div class="w-2 h-2 rounded-full bg-sky-400 animate-ping absolute top-1.5 right-1.5"></div>
          </div>
        </div>
        <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 shadow"></div>
      </div>
    </div>

    <!-- 2. RULETA DE PREGUNTAS ARRASTRABLE (POSICIONADA DIRECTAMENTE AL LADO DEL ROBOT) -->
    <div id="draggableRouletteWidget" class="draggable-widget pointer-events-auto flex items-center justify-center"
      style="display: flex;">
      <div onclick="handleRouletteWidgetClick(event)" class="relative group cursor-pointer"
        title="Girar Ruleta de Preguntas para ganar +15 EXP">
        <div
          class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-1 shadow-xl shadow-rose-500/30 group-hover:scale-105 transition duration-300">
          <div class="w-full h-full rounded-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
            <svg class="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
              <path d="M50 50 L50 0 A50 50 0 0 1 100 50 Z" fill="#f43f5e" opacity="0.85"></path>
              <path d="M50 50 L100 50 A50 50 0 0 1 50 100 Z" fill="#8b5cf6" opacity="0.85"></path>
              <path d="M50 50 L50 100 A50 50 0 0 1 0 50 Z" fill="#06b6d4" opacity="0.85"></path>
              <path d="M50 50 L0 50 A50 50 0 0 1 50 0 Z" fill="#10b981" opacity="0.85"></path>
              <circle cx="50" cy="50" r="14" fill="#0f172a" stroke="#fbbf24" stroke-width="3"></circle>
            </svg>
            <div class="absolute top-0 w-2.5 h-2.5 bg-amber-400 rotate-45 transform -translate-y-1 shadow"></div>
            <span class="absolute text-[11px] font-black text-amber-300">🎯</span>
          </div>
        </div>
        <span
          class="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] shadow animate-bounce">
          +15
        </span>
      </div>
    </div>

  </div>`;

if (floatingWidgetsSectionOld.test(content)) {
  content = content.replace(floatingWidgetsSectionOld, () => newFloatingWidgetsSection);
  console.log('✅ Replaced floating widgets with tandem dock (Robot Tutor + Roulette)');
}

// 5. UPDATE ROULETTE MODAL TO INTEGRATE ROBOT TUTOR IN FLEX-ROW RESPONSIVE LAYOUT
const rouletteModalOld = /<!-- 4\. MODAL DE RULETA DE PREGUNTAS \(\+15 EXP\) -->[\s\S]*?<div id="rouletteModal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

const newRouletteModal = `<!-- 4. MODAL DE RULETA DE PREGUNTAS (+15 EXP) CON ROBOT TUTOR INTEGRADO -->
  <div id="rouletteModal" style="display: none;"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md hidden">
    <div
      class="w-full max-w-2xl bg-slate-900 border border-amber-500/60 rounded-3xl p-4 sm:p-6 shadow-2xl text-center relative overflow-hidden max-h-[92vh] flex flex-col">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <h3 class="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
          <span>🎯 Ruleta del Conocimiento</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">+15 EXP</span>
        </h3>
        <button onclick="closeRouletteModal()"
          class="text-slate-400 hover:text-white text-base cursor-pointer">&times;</button>
      </div>

      <div class="py-4 overflow-y-auto flex-1 flex flex-col md:flex-row items-center justify-center gap-6">
        <!-- ROBOT TUTOR INTEGRADO AL LADO DE LA RULETA -->
        <div class="flex flex-col items-center justify-center bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 w-full md:w-56 shrink-0 text-center shadow-lg">
          <div class="w-16 h-16 sm:w-20 sm:h-20 mb-2 relative">
            ${INLINE_SVG_ROBOT}
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute top-1 right-1"></div>
          </div>
          <span class="text-xs font-black text-sky-400 uppercase tracking-wider">Robot Tutor IA</span>
          <p id="rouletteTutorSpeech" class="text-[11px] text-slate-300 mt-1.5 leading-snug">
            "¡Gira la ruleta y pon a prueba tus conocimientos para ganar +15 de experiencia!"
          </p>
        </div>

        <!-- SECCIÓN DE LA RULETA Y PREGUNTAS -->
        <div class="flex-1 flex flex-col items-center justify-center w-full">
          <div class="relative w-48 h-48 sm:w-52 sm:h-52 mx-auto my-2 flex items-center justify-center">
            <div id="rouletteWheelDisk"
              class="w-full h-full rounded-full border-4 border-amber-400 shadow-xl overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)">
              <svg class="w-full h-full" viewBox="0 0 100 100">
                <path d="M50 50 L50 0 A50 50 0 0 1 93.3 25 Z" fill="#ef4444"></path>
                <path d="M50 50 L93.3 25 A50 50 0 0 1 93.3 75 Z" fill="#f59e0b"></path>
                <path d="M50 50 L93.3 75 A50 50 0 0 1 50 100 Z" fill="#10b981"></path>
                <path d="M50 50 L50 100 A50 50 0 0 1 6.7 75 Z" fill="#06b6d4"></path>
                <path d="M50 50 L6.7 75 A50 50 0 0 1 6.7 25 Z" fill="#8b5cf6"></path>
                <path d="M50 50 L6.7 25 A50 50 0 0 1 50 0 Z" fill="#ec4899"></path>
                <circle cx="50" cy="50" r="12" fill="#0f172a" stroke="#fcd34d" stroke-width="2.5"></circle>
              </svg>
            </div>
            <div class="absolute top-0 w-3 h-4 bg-amber-400 rotate-180 transform -translate-y-2 shadow-lg"></div>
          </div>

          <button id="spinRouletteBtn" onclick="spinRouletteWheel()"
            class="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95">
            Girar Ruleta
          </button>

          <div id="rouletteQuestionCard"
            class="mt-4 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-left w-full hidden">
            <div class="flex items-center justify-between text-xs mb-2">
              <span id="rouletteCategoryBadge"
                class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">Grammar</span>
              <span id="rouletteTimer" class="font-mono text-rose-400 font-black">⏱️ 30s</span>
            </div>
            <p id="rouletteQuestionText" class="text-sm font-bold text-white mb-3">Which sentence is correct?</p>
            <div id="rouletteOptionsContainer" class="space-y-2"></div>
          </div>
        </div>

      </div>
    </div>
  </div>`;

if (rouletteModalOld.test(content)) {
  content = content.replace(rouletteModalOld, () => newRouletteModal);
  console.log('✅ Integrated Robot Tutor alongside Roulette in rouletteModal with flex-row responsive');
}

// 6. UPDATE VIEW-WORLDTOUR HTML TO INCLUDE ID #worldTourTopBar AND #worldTourControlsHint
content = content.replace(
  '<div class="flex items-center justify-between mb-3">',
  () => '<div id="worldTourTopBar" class="flex items-center justify-between mb-3">'
);

content = content.replace(
  '<!-- Indicador de controles -->\n        <div\n          class="absolute top-3 left-3 z-20',
  () => '<!-- Indicador de controles -->\n        <div id="worldTourControlsHint"\n          class="absolute top-3 left-3 z-20'
);

// 7. IMPLEMENT AUTOMATIC PDF BLOB DOWNLOAD LOGIC AND FUNCTIONS
const pdfDownloadEngine = `
    // ========================================================
    // MOTOR DE DESCARGA DIRECTA DE PDF (BLOB URL / NATIVO / jsPDF)
    // ========================================================
    function triggerBlobDownload(blob, filename) {
      filename = filename || 'Glosario_Ingles.pdf';
      try {
        const blobUrl = URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.download = filename;
        tempLink.setAttribute('download', filename);
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        setTimeout(function() {
          try {
            if (tempLink.parentNode) document.body.removeChild(tempLink);
            URL.revokeObjectURL(blobUrl);
          } catch (e) { }
        }, 2000);
        showFloatingToast('Descargando ' + filename + '...', '📄');
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
          showFloatingToast('Descargando ' + filename + '...', '📄');
        } else {
          // Si es una URL externa, garantizar descarga directa vía fetch Blob o atributo download con cabeceras
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
              showFloatingToast('Iniciando descarga de ' + filename + '...', '📄');
            });
        }
      }
    }

    function generateSimplePdfBlob(title, author, items) {
      function escapePdf(str) {
        return (str || '').replace(/[\\\\()]/g, '').replace(/[^\\x20-\\x7E]/g, ' ');
      }
      let stream = 'BT\\n/F1 18 Tf\\n50 770 Td\\n(' + escapePdf(title) + ') Tj\\n';
      stream += '/F1 10 Tf\\n0 -22 Td\\n(Autor: ' + escapePdf(author) + ' - English Learning App) Tj\\n0 -20 Td\\n';
      stream += '/F1 12 Tf\\n(Glosario Oficial y Vocabulario) Tj\\n0 -16 Td\\n';
      
      let y = 712;
      const list = items || [];
      for (let i = 0; i < list.length; i++) {
        if (y < 60) break;
        const item = list[i];
        const term = escapePdf(item.term || item.title || '');
        const pron = escapePdf(item.pron || item.ipa || '');
        const meaning = escapePdf(item.meaning || item.es || '');
        const line = term + (pron ? ' [' + pron + ']' : '') + ': ' + meaning;
        stream += '/F1 9 Tf\\n0 -14 Td\\n(' + line + ') Tj\\n';
        y -= 14;
        if (item.example) {
          const ex = '   Ej: ' + escapePdf(item.example);
          stream += '/F1 8 Tf\\n0 -12 Td\\n(' + ex + ') Tj\\n';
          y -= 12;
        }
      }
      stream += 'ET\\n';
      
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
`;

// Replace downloadActiveGlossaryPdf function
const oldDownloadGlossaryRegex = /function downloadActiveGlossaryPdf\(\)\s*\{[\s\S]*?setTimeout\(\(\) => printWindow\.print\(\), 350\);\s*\}/;

const newDownloadGlossaryCode = `function downloadActiveGlossaryPdf() {
      const modData = (window.MASTER_MODULES_DATA && window.MASTER_MODULES_DATA[activeGlossaryModuleKey]) 
        ? window.MASTER_MODULES_DATA[activeGlossaryModuleKey] 
        : { title: MODULE_TITLES[activeGlossaryModuleKey] || 'Glosario_Ingles', items: [] };

      const safeTitle = (modData.title || 'Glosario_Ingles').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = safeTitle + '.pdf';

      // 1. Si jsPDF está disponible en el entorno, generar documento visual de alta fidelidad
      if (window.jspdf && window.jspdf.jsPDF) {
        try {
          const doc = new window.jspdf.jsPDF();
          doc.setFontSize(18);
          doc.text(modData.title || 'Glosario de Inglés', 14, 20);
          doc.setFontSize(10);
          doc.text('Autor: Wilberth Alessandro Molina Cutz - English App', 14, 27);
          doc.setLineWidth(0.5);
          doc.line(14, 30, 196, 30);

          let y = 38;
          const items = (modData.items || []).slice(0, 120);
          for (let i = 0; i < items.length; i++) {
            if (y > 275) {
              doc.addPage();
              y = 20;
            }
            const item = items[i];
            doc.setFont(undefined, 'bold');
            doc.text((i + 1) + '. ' + (item.term || '') + ' (' + (item.pron || '') + ')', 14, y);
            y += 5;
            doc.setFont(undefined, 'normal');
            doc.text('   Significado: ' + (item.meaning || ''), 14, y);
            y += 5;
            if (item.example) {
              doc.setFont(undefined, 'italic');
              doc.text('   Ejemplo: "' + item.example + '"', 14, y);
              y += 6;
            } else {
              y += 2;
            }
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
        modData.title || 'Glosario de Inglés',
        'Wilberth Alessandro Molina Cutz',
        modData.items || []
      );
      triggerBlobDownload(binaryBlob, filename);
    }`;

if (oldDownloadGlossaryRegex.test(content)) {
  content = content.replace(oldDownloadGlossaryRegex, () => `${pdfDownloadEngine}\n    ${newDownloadGlossaryCode}`);
  console.log('✅ Replaced downloadActiveGlossaryPdf with Blob URL automatic download engine');
}

// Replace downloadStoryPdf function
const oldDownloadStoryRegex = /function downloadStoryPdf\(\)\s*\{[\s\S]*?printWindow\.document\.close\(\);\s*printWindow\.focus\(\);\s*setTimeout\(\(\) => printWindow\.print\(\), 350\);\s*\}/;

const newDownloadStoryCode = `function downloadStoryPdf() {
      const story = STORIES_DATA[currentStoryIndex];
      if (!story) return;

      const safeTitle = (story.title || 'Historia_Ingles').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = safeTitle + '.pdf';

      // 1. Usar jsPDF para maquetar la lectura y vocabulario
      if (window.jspdf && window.jspdf.jsPDF) {
        try {
          const doc = new window.jspdf.jsPDF();
          doc.setFontSize(18);
          doc.text(story.title || 'Lectura de Inglés', 14, 20);
          doc.setFontSize(10);
          doc.text('Nivel: ' + (story.level || 'Básico') + ' | Autor: Wilberth Alessandro Molina Cutz', 14, 27);
          doc.setLineWidth(0.5);
          doc.line(14, 30, 196, 30);

          let y = 38;
          doc.setFontSize(10);
          const paragraphs = story.paragraphs || [];
          for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
            const p = paragraphs[pIdx];
            if (y > 260) { doc.addPage(); y = 20; }
            const splitText = doc.splitTextToSize(p.en, 180);
            doc.text(splitText, 14, y);
            y += (splitText.length * 5) + 4;
          }

          if (story.vocab && story.vocab.length) {
            if (y > 240) { doc.addPage(); y = 20; }
            y += 6;
            doc.setFont(undefined, 'bold');
            doc.text('Vocabulario Clave de Estudio:', 14, y);
            y += 6;
            doc.setFont(undefined, 'normal');
            for (let vIdx = 0; vIdx < story.vocab.length; vIdx++) {
              const v = story.vocab[vIdx];
              if (y > 275) { doc.addPage(); y = 20; }
              doc.text('• ' + v.term + ' (' + (v.ipa || '') + '): ' + (v.es || ''), 14, y);
              y += 5;
            }
          }
          const pdfBlob = doc.output('blob');
          triggerBlobDownload(pdfBlob, filename);
          return;
        } catch (e) {
          console.warn('jsPDF story fallback to binary generator:', e);
        }
      }

      // 2. Generador binario offline
      const items = (story.vocab || []).map(function(v) {
        return {
          term: v.term,
          pron: v.ipa,
          meaning: v.es,
          example: ''
        };
      });
      const binaryBlob = generateSimplePdfBlob(
        story.title,
        'Wilberth Alessandro Molina Cutz',
        items
      );
      triggerBlobDownload(binaryBlob, filename);
    }`;

if (oldDownloadStoryRegex.test(content)) {
  content = content.replace(oldDownloadStoryRegex, () => newDownloadStoryCode);
  console.log('✅ Replaced downloadStoryPdf with Blob URL automatic download engine');
}

// 8. UPDATE showView TO MANAGE DOCK AND BODY LANDSCAPE CLASS
const showViewVisibilityOld = /const robot = document\.getElementById\('draggableRobotWidget'\);[\s\S]*?const roulette = document\.getElementById\('draggableRouletteWidget'\);[\s\S]*?roulette\.style\.display = 'none';\s*\}/;

const newShowViewVisibility = `const dock = document.getElementById('tutorRouletteDock');
      const robot = document.getElementById('draggableRobotWidget');
      const roulette = document.getElementById('draggableRouletteWidget');

      if (dock) {
        if (viewId === 'view-auth') {
          dock.classList.add('hidden');
          dock.style.display = 'none';
        } else {
          dock.classList.remove('hidden');
          dock.style.display = 'flex';
        }
      }

      if (robot) {
        if (viewId === 'view-auth') {
          robot.classList.add('hidden');
          robot.style.display = 'none';
        } else {
          robot.classList.remove('hidden');
          robot.style.display = 'flex';
        }
      }

      if (roulette) {
        if (viewId === 'view-home') {
          roulette.classList.remove('hidden');
          roulette.style.display = 'flex';
        } else {
          roulette.classList.add('hidden');
          roulette.style.display = 'none';
        }
      }

      if (viewId === 'view-worldtour') {
        document.body.classList.add('view-worldtour-active');
        if (typeof initThreeWorldTour === 'function') {
          initThreeWorldTour();
        }
      } else {
        document.body.classList.remove('view-worldtour-active');
      }`;

if (showViewVisibilityOld.test(content)) {
  content = content.replace(showViewVisibilityOld, () => newShowViewVisibility);
  console.log('✅ Updated showView with dock visibility and view-worldtour-active body class');
}

// 9. UPDATE spinRouletteWheel & checkRouletteAnswer TO ANIMATE TUTOR SPEECH
content = content.replace(
  'function spinRouletteWheel() {',
  () => `function spinRouletteWheel() {
      const tutorSpeech = document.getElementById('rouletteTutorSpeech');
      if (tutorSpeech) tutorSpeech.textContent = "¡Mucha suerte! Girando la ruleta para tu nuevo desafío...";`
);

content = content.replace(
  `showFloatingToast('¡Excelente! +15 EXP ganados', '🎯');`,
  () => `showFloatingToast('¡Excelente! +15 EXP ganados', '🎯');
      const tutorSpeech = document.getElementById('rouletteTutorSpeech');
      if (tutorSpeech) tutorSpeech.textContent = "¡Brillante! Has respondido correctamente y sumaste +15 EXP.";`
);

content = content.replace(
  `showFloatingToast('Respuesta incorrecta. ¡Sigue intentando!', '❌');`,
  () => `showFloatingToast('Respuesta incorrecta. ¡Sigue intentando!', '❌');
      const tutorSpeech = document.getElementById('rouletteTutorSpeech');
      if (tutorSpeech) tutorSpeech.textContent = "¡Casi! No te desanimes, cada intento refuerza tu memoria.";`
);

// SAVE TO app/src/main/assets/index.html
fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully written to app/src/main/assets/index.html. New length:', content.length);

// Also copy to root index.html in ENGLISH-
const rootIndexPath = path.resolve(__dirname, '../index.html');
fs.writeFileSync(rootIndexPath, content, 'utf8');
console.log('Successfully synced to root index.html');

// Also copy to parent ENGLISH/index.html if exists
const parentIndexPath = path.resolve(__dirname, '../../index.html');
if (fs.existsSync(parentIndexPath)) {
  fs.writeFileSync(parentIndexPath, content, 'utf8');
  console.log('Successfully synced to parent ENGLISH/index.html');
}

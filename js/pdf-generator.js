/**
 * MasterENG • Motor Editorial Profesional de Generación de PDF & Gestión de Diccionario
 * Utiliza jsPDF + AutoTable con diseño corporativo:
 * - Encabezado en Azul Noche (#0D1424) con detalles dorados (#F5A623)
 * - Título oficial: "MasterENG • Diccionario Oficial de Inmersión y Certificación TOEFL"
 * - Metadatos: Nombre de Módulo, Nivel CEFR, Total de Entradas (100 términos) y Fecha
 * - Tabla con zebra striping: #, Término en Inglés, Fonética (IPA), Categoría, Traducción al Español, Ejemplo de Uso
 * - Paginación al pie: "Página X de Y • MasterENG Academy"
 * - Descarga directa: "MasterENG_Diccionario_Modulo_[XX].pdf"
 */

(function(window) {
  'use strict';

  // ========================================================
  // 1. GESTIÓN Y CACHÉ LOCAL EN MEMORIA DEL DICCIONARIO
  // ========================================================
  let dictionaryCache = null;
  let dictionaryLoadPromise = null;

  function loadDictionaryAsync() {
    if (dictionaryCache) {
      return Promise.resolve(dictionaryCache);
    }
    if (dictionaryLoadPromise) {
      return dictionaryLoadPromise;
    }

    dictionaryLoadPromise = fetch('data/dictionary.json')
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data) {
        dictionaryCache = data;
        syncWithMasterData(data);
        return data;
      })
      .catch(function(err) {
        console.warn('[PDF-GENERATOR] No se pudo cargar data/dictionary.json vía fetch, usando MASTER_MODULES_DATA:', err);
        dictionaryCache = buildDictionaryFallback();
        return dictionaryCache;
      });

    return dictionaryLoadPromise;
  }

  function getDictionarySync() {
    if (dictionaryCache) return dictionaryCache;
    return buildDictionaryFallback();
  }

  function buildDictionaryFallback() {
    const modules = [];
    if (window.MASTER_MODULES_DATA) {
      const keys = [
        'phrasal_verbs', 'difficult_verbs', 'power_adjectives', 'native_idioms',
        'connectors_linking', 'false_friends', 'collocations', 'business_tech',
        'travel_survival', 'toefl_academic'
      ];
      keys.forEach(function(k, idx) {
        const m = window.MASTER_MODULES_DATA[k] || { title: k, items: [] };
        const items = (m.items || []).map(function(item, i) {
          return {
            id: i + 1,
            word: item.term || item.word || '',
            ipa: item.pron || item.ipa || '',
            category: item.category || m.category || 'Vocab',
            translation: item.meaning || item.translation || '',
            example: item.example || ''
          };
        });
        const modObj = {
          id: idx + 1,
          key: k,
          title: m.title || `Módulo ${String(idx + 1).padStart(2, '0')}`,
          level: m.level || 'A1-C2',
          category: m.category || 'General',
          total: items.length,
          words: items
        };
        modules.push(modObj);
      });
    }
    const dict = {
      metadata: {
        title: 'MasterENG • Diccionario Oficial de Inmersión y Certificación TOEFL',
        total_modules: modules.length,
        total_terms: modules.reduce(function(acc, m) { return acc + m.total; }, 0)
      },
      modules: modules
    };
    modules.forEach(function(m) {
      dict[m.key] = m.words;
      dict[String(m.id)] = m.words;
    });
    return dict;
  }

  function syncWithMasterData(dictData) {
    if (!dictData || !dictData.modules) return;
    if (!window.MASTER_MODULES_DATA) window.MASTER_MODULES_DATA = {};

    dictData.modules.forEach(function(m) {
      const formattedItems = m.words.map(function(w) {
        return {
          id: w.id,
          word: w.word,
          term: w.word,
          ipa: w.ipa,
          pron: w.ipa,
          category: w.category,
          translation: w.translation,
          meaning: w.translation,
          example: w.example
        };
      });

      window.MASTER_MODULES_DATA[m.key] = {
        id: m.id,
        key: m.key,
        title: m.title,
        name: m.name || m.title,
        level: m.level,
        category: m.category,
        total: formattedItems.length,
        items: formattedItems
      };
    });
  }

  // Precargar inmediatamente al cargar el script
  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(loadDictionaryAsync, 50);
    } else {
      window.addEventListener('DOMContentLoaded', loadDictionaryAsync);
    }
  }

  // ========================================================
  // 2. SÍNTESIS DE VOZ LIMPIA (Web Speech API - en-US, 0.9x)
  // ========================================================
  function speakGlossaryWord(text, customRate) {
    if (!text) return;
    const rate = (typeof customRate === 'number') ? customRate : 0.9;
    try {
      const iface = window.AndroidInterface || window.AndroidBridge;
      if (iface && typeof iface.speak === 'function') {
        iface.speak(text);
        return;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
        if (voices && voices.length > 0) {
          const enUs = voices.find(function(v) { return v.lang === 'en-US'; }) ||
                       voices.find(function(v) { return v.lang && v.lang.startsWith('en'); });
          if (enUs) utterance.voice = enUs;
        }
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('[SPEECH] Error en síntesis de voz:', e);
    }
  }

  // ========================================================
  // 3. DESCARGA DIRECTA DE ARCHIVO BLOB PDF
  // ========================================================
  function triggerBlobDownload(blob, filename) {
    filename = filename || 'MasterENG_Diccionario.pdf';
    try {
      const blobUrl = URL.createObjectURL(blob);

      // Compatibilidad con Android WebView Bridge
      const iface = window.AndroidInterface || window.AndroidBridge;
      if (iface && typeof FileReader !== 'undefined') {
        const reader = new FileReader();
        reader.onloadend = function() {
          const base64 = reader.result;
          if (typeof iface.downloadBase64Pdf === 'function') {
            iface.downloadBase64Pdf(base64, filename);
          } else if (typeof iface.downloadPdf === 'function') {
            iface.downloadPdf(base64, filename);
          } else if (typeof iface.downloadFile === 'function') {
            iface.downloadFile(base64, filename, 'application/pdf');
          }
        };
        reader.readAsDataURL(blob);
      }

      // Descarga directa y automática en el navegador
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = filename;
      tempLink.setAttribute('download', filename);
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();

      setTimeout(function() {
        try {
          if (tempLink.parentNode) tempLink.parentNode.removeChild(tempLink);
          URL.revokeObjectURL(blobUrl);
        } catch (e) { }
      }, 2500);

      if (typeof window.showFloatingToast === 'function') {
        window.showFloatingToast('Descargando ' + filename + '...', '📥');
      }
    } catch (err) {
      console.error('[PDF-DOWNLOAD] Error descargando blob PDF:', err);
      if (typeof window.showFloatingToast === 'function') {
        window.showFloatingToast('Error al procesar descarga de PDF.', '⚠️');
      }
    }
  }

  // ========================================================
  // 4. SANITIZACIÓN LIMPIA PARA HELVETICA EN JSPDF
  // ========================================================
  function sanitizeIpaForPdf(str) {
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
      .replace(/t̬/g, "t");
  }

  function sanitizeTextForPdf(str) {
    if (!str) return '';
    return String(str)
      .replace(/“|”/g, '"')
      .replace(/‘|’/g, "'")
      .replace(/–|—/g, '-');
  }

  // ========================================================
  // 5. MOTOR EDITORIAL JSPDF + AUTO-TABLE
  // ========================================================
  function generateModulePdf(moduleIdOrKey) {
    const dict = getDictionarySync();
    let modObj = null;

    if (typeof moduleIdOrKey === 'number' || (typeof moduleIdOrKey === 'string' && /^\d+$/.test(moduleIdOrKey))) {
      const numId = Number(moduleIdOrKey);
      modObj = (dict.modules || []).find(function(m) { return m.id === numId; });
    } else if (typeof moduleIdOrKey === 'string') {
      modObj = (dict.modules || []).find(function(m) { return m.key === moduleIdOrKey; });
    }

    if (!modObj && dict.modules && dict.modules.length > 0) {
      modObj = dict.modules[0];
    }

    const modNum = modObj ? modObj.id : 1;
    const modNumStr = String(modNum).padStart(2, '0');
    const filename = 'MasterENG_Diccionario_Modulo_' + modNumStr + '.pdf';

    const words = (modObj && Array.isArray(modObj.words)) ? modObj.words : [];
    // Orden estricto A-Z
    const sortedWords = words.slice().sort(function(a, b) {
      const wA = (a.word || a.term || '').trim();
      const wB = (b.word || b.term || '').trim();
      return wA.localeCompare(wB, 'en', { sensitivity: 'base' });
    });

    const todayStr = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    // 1. GENERACIÓN CON JSPDF + AUTO-TABLE
    if (window.jspdf && window.jspdf.jsPDF) {
      try {
        const doc = new window.jspdf.jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const hasAutoTable = typeof doc.autoTable === 'function';

        if (hasAutoTable) {
          // Filas preparadas para AutoTable
          const tableRows = sortedWords.map(function(item, index) {
            const numStr = '#' + String(index + 1).padStart(2, '0');
            const wordStr = sanitizeTextForPdf(item.word || item.term || '');
            const ipaStr = sanitizeIpaForPdf(item.ipa || item.pron || '');
            const catStr = sanitizeTextForPdf(item.category || modObj.category || 'Vocab');
            const transStr = sanitizeTextForPdf(item.translation || item.meaning || '');
            const exStr = sanitizeTextForPdf(item.example ? '"' + item.example + '"' : '');
            return [numStr, wordStr, ipaStr, catStr, transStr, exStr];
          });

          doc.autoTable({
            head: [['#', 'Término en Inglés', 'Fonética (IPA)', 'Categoría', 'Traducción al Español', 'Ejemplo de Uso']],
            body: tableRows,
            startY: 38,
            margin: { top: 38, bottom: 20, left: 10, right: 10 },
            theme: 'striped',
            styles: {
              font: 'helvetica',
              fontSize: 7.5,
              cellPadding: 2.2,
              overflow: 'linebreak',
              textColor: [30, 41, 59],
              valign: 'middle'
            },
            headStyles: {
              fillColor: [13, 20, 36], // Azul Noche corporativo (#0D1424)
              textColor: [245, 166, 35], // Detalles dorados (#F5A623)
              fontStyle: 'bold',
              fontSize: 8,
              halign: 'left'
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252] // Zebra striping
            },
            columnStyles: {
              0: { cellWidth: 10, halign: 'center', fontStyle: 'bold', textColor: [245, 166, 35] },
              1: { cellWidth: 32, fontStyle: 'bold', textColor: [13, 20, 36] },
              2: { cellWidth: 26, textColor: [3, 105, 161] },
              3: { cellWidth: 24, fontStyle: 'bold', textColor: [180, 83, 9] },
              4: { cellWidth: 44, textColor: [15, 23, 42] },
              5: { cellWidth: 54, fontStyle: 'italic', textColor: [71, 85, 105] }
            },
            didDrawPage: function(data) {
              const pageNumber = data.pageNumber;
              const isFirst = (pageNumber === 1);

              // 1. ENCABEZADO CORPORATIVO EDITORIAL (Azul Noche #0D1424 + Dorado #F5A623)
              const headerHeight = isFirst ? 32 : 20;
              doc.setFillColor(13, 20, 36); // #0D1424
              doc.rect(0, 0, 210, headerHeight, 'F');

              // Barra acento dorada (#F5A623)
              doc.setFillColor(245, 166, 35); // #F5A623
              doc.rect(0, headerHeight, 210, 1.8, 'F');

              // Título oficial institucional
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(isFirst ? 12 : 9.5);
              doc.setTextColor(245, 166, 35); // #F5A623
              doc.text('MasterENG • Diccionario Oficial de Inmersión y Certificación TOEFL', 10, isFirst ? 10 : 8);

              // Metadatos: Módulo y Nivel CEFR
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(isFirst ? 10 : 8);
              doc.setTextColor(255, 255, 255);
              const modTitle = sanitizeTextForPdf((modObj.title || 'Módulo ' + modNumStr) + '  •  Nivel CEFR: ' + (modObj.level || 'A1-C2'));
              doc.text(modTitle, 10, isFirst ? 18 : 14.5);

              // Metadatos extendidos (solo primera página)
              if (isFirst) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(7.5);
                doc.setTextColor(203, 213, 225);
                const metaStr = sanitizeTextForPdf('Total de Entradas: ' + sortedWords.length + ' términos   |   Fecha: ' + todayStr + '   |   Autor: Wilberth Alessandro Molina Cutz');
                doc.text(metaStr, 10, 26);
              }

              // 2. PIE DE PÁGINA FORMAL CON NUMERACIÓN AUTOMÁTICA
              const pageY = 286;
              doc.setDrawColor(245, 166, 35);
              doc.setLineWidth(0.3);
              doc.line(10, pageY, 200, pageY);

              doc.setFont('helvetica', 'normal');
              doc.setFontSize(7.5);
              doc.setTextColor(100, 116, 139);
              // Paginación al pie: "Página X de Y • MasterENG Academy"
              // Nota: El número total de páginas se imprime en bucle posterior o con marcador
            }
          });

          // Paginación al pie final "Página X de Y • MasterENG Academy"
          const totalPages = doc.internal.getNumberOfPages();
          for (let p = 1; p <= totalPages; p++) {
            doc.setPage(p);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(100, 116, 139);
            const footerText = 'Página ' + p + ' de ' + totalPages + ' • MasterENG Academy';
            doc.text(footerText, 105, 291, { align: 'center' });
          }

          const pdfBlob = doc.output('blob');
          triggerBlobDownload(pdfBlob, filename);
          return pdfBlob;
        } else {
          // Fallback manual con cálculo de renglones si autotable no está cargado
          return generateManualJsPdf(doc, modObj, sortedWords, filename, todayStr);
        }
      } catch (err) {
        console.warn('[PDF-GENERATOR] jsPDF falló, usando generador nativo binario:', err);
      }
    }

    // 2. FALLBACK BINARIO NATIVO (%PDF-1.4 sin librerías)
    const binaryBlob = generateSimpleBinaryPdf(modObj, sortedWords, filename, todayStr);
    triggerBlobDownload(binaryBlob, filename);
    return binaryBlob;
  }

  // Generador manual con cálculo exacto de altura para evitar truncamiento
  function generateManualJsPdf(doc, modObj, sortedWords, filename, todayStr) {
    const modNumStr = String(modObj.id).padStart(2, '0');

    function drawHeader(isFirst) {
      const hH = isFirst ? 32 : 20;
      doc.setFillColor(13, 20, 36);
      doc.rect(0, 0, 210, hH, 'F');
      doc.setFillColor(245, 166, 35);
      doc.rect(0, hH, 210, 1.8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(isFirst ? 12 : 9.5);
      doc.setTextColor(245, 166, 35);
      doc.text('MasterENG • Diccionario Oficial de Inmersión y Certificación TOEFL', 10, isFirst ? 10 : 8);
      doc.setFontSize(isFirst ? 10 : 8);
      doc.setTextColor(255, 255, 255);
      doc.text(sanitizeTextForPdf((modObj.title || 'Módulo ' + modNumStr) + '  •  Nivel CEFR: ' + (modObj.level || 'A1-C2')), 10, isFirst ? 18 : 14.5);
      if (isFirst) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(203, 213, 225);
        doc.text(sanitizeTextForPdf('Total de Entradas: ' + sortedWords.length + ' términos   |   Fecha: ' + todayStr), 10, 26);
      }
    }

    function drawTableHead(topY) {
      doc.setFillColor(13, 20, 36);
      doc.rect(10, topY, 190, 7.5, 'F');
      doc.setFillColor(245, 166, 35);
      doc.rect(10, topY + 7.5, 190, 0.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(245, 166, 35);
      doc.text('#', 12, topY + 5);
      doc.text('Término en Inglés', 22, topY + 5);
      doc.text('Fonética (IPA)', 54, topY + 5);
      doc.text('Categoría', 80, topY + 5);
      doc.text('Traducción al Español', 104, topY + 5);
      doc.text('Ejemplo de Uso', 148, topY + 5);
      return topY + 8;
    }

    drawHeader(true);
    let y = drawTableHead(38);

    for (let i = 0; i < sortedWords.length; i++) {
      const item = sortedWords[i];
      const numStr = '#' + String(i + 1).padStart(2, '0');
      const wStr = sanitizeTextForPdf(item.word || item.term || '');
      const ipaStr = sanitizeIpaForPdf(item.ipa || item.pron || '');
      const catStr = sanitizeTextForPdf(item.category || 'Vocab');
      const transStr = sanitizeTextForPdf(item.translation || item.meaning || '');
      const exStr = sanitizeTextForPdf(item.example ? '"' + item.example + '"' : '');

      doc.setFontSize(7.2);
      const wLines = doc.splitTextToSize(wStr, 30);
      const ipaLines = doc.splitTextToSize(ipaStr, 24);
      const catLines = doc.splitTextToSize(catStr, 22);
      const transLines = doc.splitTextToSize(transStr, 42);
      const exLines = doc.splitTextToSize(exStr, 50);

      const maxLines = Math.max(wLines.length, ipaLines.length, catLines.length, transLines.length, exLines.length, 1);
      const rowH = Math.max(maxLines * 3.4 + 3.2, 7.5);

      if (y + rowH > 275) {
        doc.addPage();
        drawHeader(false);
        y = drawTableHead(24);
      }

      // Zebra striping
      if (i % 2 === 0) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(248, 250, 252);
      }
      doc.rect(10, y, 190, rowH, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.15);
      doc.rect(10, y, 190, rowH, 'S');

      const textY = y + 4.2;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 166, 35);
      doc.text(numStr, 12, textY);

      doc.setTextColor(13, 20, 36);
      doc.text(wLines, 22, textY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(3, 105, 161);
      doc.text(ipaLines, 54, textY);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(180, 83, 9);
      doc.text(catLines, 80, textY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(transLines, 104, textY);

      doc.setFont('helvetica', 'italic');
      doc.setTextColor(71, 85, 105);
      doc.text(exLines, 148, textY);

      y += rowH;
    }

    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setDrawColor(245, 166, 35);
      doc.setLineWidth(0.3);
      doc.line(10, 286, 200, 286);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Página ' + p + ' de ' + totalPages + ' • MasterENG Academy', 105, 291, { align: 'center' });
    }

    const pdfBlob = doc.output('blob');
    triggerBlobDownload(pdfBlob, filename);
    return pdfBlob;
  }

  // Generador binario nativo %PDF-1.4
  function generateSimpleBinaryPdf(modObj, sortedWords, filename, todayStr) {
    function escapePdf(str) {
      return sanitizeIpaForPdf(str || '').replace(/[\\()]/g, '').replace(/[^\x20-\x7E]/g, ' ');
    }
    let stream = 'q\n0.051 0.078 0.141 rg\n0 760 595 82 re f\n0.961 0.651 0.137 rg\n0 756 595 4 re f\nQ\n';
    stream += 'BT\n/F1 14 Tf\n1 1 1 rg\n30 790 Td\n(MasterENG - Diccionario Oficial de Inmersión y Certificación TOEFL) Tj\n';
    stream += '/F1 11 Tf\n0 -18 Td\n(' + escapePdf(modObj.title || 'Módulo Oficial') + ' - Nivel ' + escapePdf(modObj.level || 'CEFR') + ') Tj\n';
    stream += '/F1 8.5 Tf\n0 -14 Td\n(Total de Entradas: ' + sortedWords.length + ' términos | Fecha: ' + escapePdf(todayStr) + ') Tj\n0 -16 Td\n';

    let y = 730;
    for (let i = 0; i < sortedWords.length; i++) {
      if (y < 55) break;
      const item = sortedWords[i];
      const num = '#' + String(i + 1).padStart(2, '0');
      const w = escapePdf(item.word || item.term);
      const ipa = escapePdf(item.ipa || item.pron);
      const cat = escapePdf(item.category || 'Vocab');
      const trans = escapePdf(item.translation || item.meaning);
      const line = num + ' ' + w + ' [' + ipa + '] (' + cat + '): ' + trans;
      stream += '/F1 8.5 Tf\n0 0 0 rg\n0 -12 Td\n(' + line.slice(0, 95) + ') Tj\n';
      y -= 12;
      if (item.example) {
        const ex = '   Ejemplo: "' + escapePdf(item.example).slice(0, 90) + '"';
        stream += '/F1 7.5 Tf\n0.28 0.33 0.41 rg\n0 -10 Td\n(' + ex + ') Tj\n';
        y -= 10;
      }
    }
    stream += '/F1 8 Tf\n0.39 0.45 0.55 rg\n0 -18 Td\n(Página 1 de 1 • MasterENG Academy) Tj\nET\n';

    const streamLen = (new TextEncoder().encode(stream)).length;
    const objs = [
      '%PDF-1.4\n',
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
      '5 0 obj\n<< /Length ' + streamLen + ' >>\nstream\n' + stream + 'endstream\nendobj\n'
    ];

    let offset = objs[0].length;
    const xref = ['xref\n0 6\n0000000000 65535 f \n'];
    for (let j = 1; j <= 5; j++) {
      xref.push((offset.toString().padStart(10, '0')) + ' 00000 n \n');
      offset += objs[j].length;
    }
    const trailer = 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + offset + '\n%%EOF\n';
    const pdfText = objs.join('') + xref.join('') + trailer;
    return new Blob([new TextEncoder().encode(pdfText)], { type: 'application/pdf' });
  }

  // ========================================================
  // 6. EXPORTACIONES GLOBALES
  // ========================================================
  window.PDF_GENERATOR = {
    loadDictionaryAsync: loadDictionaryAsync,
    getDictionarySync: getDictionarySync,
    generateModulePdf: generateModulePdf,
    speakGlossaryWord: speakGlossaryWord,
    triggerBlobDownload: triggerBlobDownload
  };

  window.downloadActiveGlossaryPdf = function(modIdOrKey) {
    const key = modIdOrKey || window.activeGlossaryModuleKey || 1;
    return generateModulePdf(key);
  };

  window.downloadModuleGlossaryPdf = window.downloadActiveGlossaryPdf;
  window.speakGlossaryWord = speakGlossaryWord;

})(typeof window !== 'undefined' ? window : global);

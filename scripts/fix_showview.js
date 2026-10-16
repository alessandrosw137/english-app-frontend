const fs = require('fs');

let html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const targetSection = `      // El botón superior universal se oculta por completo al mostrar cualquier vista
      const universalBtn = document.getElementById('universalExitBtn');
      if (universalBtn) {
        universalBtn.style.display = 'none';
        universalBtn.classList.add('hidden');
      }
      }

      // Estrellas del portal sólo en view-home`;

const correctedSection = `      // El botón superior universal se oculta por completo al mostrar cualquier vista
      const universalBtn = document.getElementById('universalExitBtn');
      if (universalBtn) {
        universalBtn.style.display = 'none';
        universalBtn.classList.add('hidden');
      }

      // Estrellas del portal sólo en view-home`;

if (html.includes(targetSection)) {
  html = html.replace(targetSection, correctedSection);
  fs.writeFileSync('app/src/main/assets/index.html', html, 'utf8');
  console.log('✅ Extra brace fixed in index.html');
} else {
  console.log('Target section not found with exact match, using regex...');
  const rx = /const universalBtn = document\.getElementById\('universalExitBtn'\);[\s\S]*?universalBtn\.classList\.add\('hidden'\);\s*\}\s*\}\s*\/\/ Estrellas/;
  if (rx.test(html)) {
    html = html.replace(rx, `const universalBtn = document.getElementById('universalExitBtn');\n      if (universalBtn) {\n        universalBtn.style.display = 'none';\n        universalBtn.classList.add('hidden');\n      }\n\n      // Estrellas`);
    fs.writeFileSync('app/src/main/assets/index.html', html, 'utf8');
    console.log('✅ Extra brace fixed via regex in index.html');
  } else {
    console.error('❌ Could not locate the section to fix');
  }
}

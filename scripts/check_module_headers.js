const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const modules = [
  { id: 'view-path', name: 'Learning Path' },
  { id: 'view-stories', name: 'Cuentos' },
  { id: 'view-music', name: 'Music Session' },
  { id: 'view-worldtour', name: 'World Tour 3D' },
  { id: 'glossaryModal', name: 'Glosario Modal' },
  { id: 'learningMissionModal', name: 'Misiones Modal' }
];

modules.forEach(m => {
  const idx = html.indexOf(`id="${m.id}"`);
  if (idx !== -1) {
    const chunk = html.substring(idx, idx + 1200);
    const buttons = chunk.match(/<button[\s\S]*?<\/button>/gi) || [];
    console.log(`\n=== ${m.name} (${m.id}) ===`);
    buttons.forEach((b, i) => {
      if (b.includes('Volver') || b.includes('goToHome') || b.includes('close') || b.includes('←')) {
        console.log(`Button #${i}: ${b.replace(/\s+/g, ' ')}`);
      }
    });
  } else {
    console.log(`Module ${m.id} NOT found in HTML`);
  }
});

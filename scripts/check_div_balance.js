const fs = require('fs');

const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const start = html.indexOf('<div id="view-music"');
const end = html.indexOf('<div id="view-worldtour"');

const musicHtml = html.substring(start, end);
const opens = (musicHtml.match(/<div(\s|>)/gi) || []).length;
const closes = (musicHtml.match(/<\/div>/gi) || []).length;

console.log('view-music opens:', opens, 'closes:', closes);

// Now let's check between view-worldtour and the modales
const tourStart = html.indexOf('<div id="view-worldtour"');
const tourEnd = html.indexOf('<!-- ========================================================\n       MODALES DEL SISTEMA');
const tourHtml = html.substring(tourStart, tourEnd);
const tourOpens = (tourHtml.match(/<div(\s|>)/gi) || []).length;
const tourCloses = (tourHtml.match(/<\/div>/gi) || []).length;

console.log('view-worldtour opens:', tourOpens, 'closes:', tourCloses);

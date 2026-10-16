const fs = require('fs');

const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

function printRange(startPattern, endPattern) {
  const start = html.indexOf(startPattern);
  const end = html.indexOf(endPattern, start);
  console.log(`=== RANGE: ${startPattern} -> ${endPattern} ===`);
  if (start !== -1 && end !== -1) {
    console.log(html.substring(start, end + endPattern.length));
  } else {
    console.log('Not found:', start, end);
  }
}

printRange('<div id="view-music"', '<div id="view-worldtour"');

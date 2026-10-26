const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

const sIdx = html.indexOf('const illContainer = document.getElementById("storyThematicIllustration");');
console.log(html.substring(sIdx - 1500, sIdx - 600));

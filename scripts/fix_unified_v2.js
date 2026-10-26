const fs = require('fs');
let s = fs.readFileSync('scripts/build_unified_app_v2.js', 'utf8');
s = s.replace('return `\n          <button onclick="selectMusicTrack(${originalIdx})"', "return '<button onclick=\"selectMusicTrack(' + originalIdx + ')\'");
s = s.replace('return `\r\n          <button onclick="selectMusicTrack(${originalIdx})"', "return '<button onclick=\"selectMusicTrack(' + originalIdx + ')\'");
s = s.replace("          </button>\n        `;", "          </button>';");
s = s.replace("          </button>\r\n        `;", "          </button>';");
fs.writeFileSync('scripts/build_unified_app_v2.js', s, 'utf8');
console.log('Fixed build_unified_app_v2.js');

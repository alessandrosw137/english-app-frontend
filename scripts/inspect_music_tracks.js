const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html'), 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.includes('MUSIC_TRACKS') || l.includes('function selectMusicTrack')) {
    console.log((i + 1) + ': ' + l.trim());
  }
});

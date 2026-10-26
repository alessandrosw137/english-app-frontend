const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
const txt = fs.readFileSync(htmlPath, 'utf8');

function extractBlock(startMarker, endMarker, fromIndex = 0) {
  const start = txt.indexOf(startMarker, fromIndex);
  if (start === -1) return null;
  const end = txt.indexOf(endMarker, start);
  if (end === -1) return null;
  return txt.substring(start, end + endMarker.length);
}

// 1. MUSIC_SESSION_TRACKS
const musicTracks = extractBlock('const MUSIC_SESSION_TRACKS = [', '];');
console.log('MUSIC_SESSION_TRACKS length:', musicTracks ? musicTracks.length : 'NULL');

// 2. STORIES_DATA
const storiesData = extractBlock('const STORIES_DATA = [', '];');
console.log('STORIES_DATA length:', storiesData ? storiesData.length : 'NULL');

// 3. WORLD_TOUR_SCENARIOS
const worldTourData = extractBlock('const WORLD_TOUR_SCENARIOS = {', '};');
console.log('WORLD_TOUR_SCENARIOS length:', worldTourData ? worldTourData.length : 'NULL');

// 4. Check if they parse as valid JS
try {
  eval(musicTracks);
  console.log('✅ MUSIC_SESSION_TRACKS is valid JS, count:', MUSIC_SESSION_TRACKS.length);
} catch (e) {
  console.error('❌ MUSIC_SESSION_TRACKS eval error:', e.message);
}

try {
  eval(storiesData);
  console.log('✅ STORIES_DATA is valid JS, count:', STORIES_DATA.length);
} catch (e) {
  console.error('❌ STORIES_DATA eval error:', e.message);
}

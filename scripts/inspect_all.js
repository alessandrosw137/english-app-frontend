const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
console.log('HTML size:', html.length);

console.log('\n=== AUTH FORMS IN HTML ===');
const authIdx = html.indexOf('id="view-auth"');
const authEnd = html.indexOf('<!-- VIEW: HOME', authIdx);
console.log(html.slice(authIdx, authEnd !== -1 ? authEnd : authIdx + 3000));

console.log('\n=== HUB CAROUSEL IN HTML ===');
const hubIdx = html.indexOf('id="view-home"');
const hubEnd = html.indexOf('<!-- VIEW: LEARNING PATH', hubIdx);
console.log(html.slice(hubIdx, hubEnd !== -1 ? hubEnd : hubIdx + 3000));

console.log('\n=== LEARNING PATH IN HTML ===');
const pathIdx = html.indexOf('id="view-path"');
const pathEnd = html.indexOf('<!-- VIEW: STORIES', pathIdx);
console.log(html.slice(pathIdx, pathEnd !== -1 ? pathEnd : pathIdx + 2000));

console.log('\n=== MUSIC VIEW IN HTML ===');
const musicIdx = html.indexOf('id="view-music"');
const musicEnd = html.indexOf('<!-- VIEW: WORLD TOUR', musicIdx);
console.log(html.slice(musicIdx, musicEnd !== -1 ? musicEnd : musicIdx + 2500));

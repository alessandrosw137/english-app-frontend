const fs = require('fs');

const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const sIdx = html.indexOf('const STORIES_DATA = [');
const eIdx = html.indexOf('    const MUSIC_SESSION_TRACKS', sIdx);
const code = html.substring(sIdx, eIdx);

const vm = require('vm');
const context = {};
vm.createContext(context);
vm.runInContext(code, context);

console.log('Total stories:', context.STORIES_DATA.length);
context.STORIES_DATA.forEach((s, i) => {
  console.log(i, s.title, {
    hasIll: !!s.illustrationSvg,
    hasTitleEs: !!s.titleEs,
    hasLevel: !!s.level
  });
});

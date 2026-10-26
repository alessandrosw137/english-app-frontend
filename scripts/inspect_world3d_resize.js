const fs = require('fs');
const path = require('path');

const world3dPath = path.join(__dirname, '..', 'ENGLISH-', 'js', 'world3d.js');
const worldJs = fs.readFileSync(world3dPath, 'utf8');

const idxResize = worldJs.indexOf('function onWindowResize');
console.log(worldJs.slice(idxResize - 50, idxResize + 800));

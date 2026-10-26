const fs = require('fs');
const path = require('path');

const world3dPath = path.join(__dirname, '..', 'ENGLISH-', 'js', 'world3d.js');
const worldJs = fs.readFileSync(world3dPath, 'utf8');

console.log('world3d.js length:', worldJs.length);
const idxResize = worldJs.indexOf('onWindowResize');
console.log('onWindowResize snippet:');
console.log(worldJs.slice(idxResize - 50, idxResize + 500));

const idxExpose = worldJs.indexOf('global.World3D');
console.log('global.World3D snippet:');
console.log(worldJs.slice(idxExpose - 50, idxExpose + 500));

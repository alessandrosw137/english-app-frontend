const fs = require('fs');
const path = require('path');

function readGlbNodes(glbPath) {
  const buf = fs.readFileSync(glbPath);
  // GLB header: magic (4), version (4), length (4)
  // Chunk 0: length (4), type (4 = 0x4E4F534A 'JSON')
  const chunk0Length = buf.readUInt32LE(12);
  const jsonStr = buf.toString('utf8', 20, 20 + chunk0Length);
  const gltf = JSON.parse(jsonStr);
  return (gltf.nodes || []).map(n => n.name).filter(Boolean);
}

const models = [
  'worlds/house.glb',
  'worlds/supermarket.glb',
  'worlds/restaurant.glb',
  'worlds/hotel.glb',
  'worlds/dating.glb',
  'worlds/garden.glb',
  'worlds/space.glb',
  'soccer/soccer_pack.glb',
  'hedbanz/hedbanz_pack.glb'
];

const basePath = path.join(__dirname, '..', 'assets', 'models');

console.log('=== GLB OBJECT NAMES AUDIT ===');
models.forEach(m => {
  const fullPath = path.join(basePath, m);
  const nodes = readGlbNodes(fullPath);
  console.log(`\n[${m}]:`);
  console.log(nodes.join(', '));
});

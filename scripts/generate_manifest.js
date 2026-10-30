const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'assets', 'models');

function readGlbNodes(glbPath) {
  try {
    const buf = fs.readFileSync(glbPath);
    const chunk0Length = buf.readUInt32LE(12);
    const jsonStr = buf.toString('utf8', 20, 20 + chunk0Length);
    const gltf = JSON.parse(jsonStr);
    return (gltf.nodes || []).map(n => n.name).filter(Boolean);
  } catch (e) {
    return [];
  }
}

const modelEntries = [
  { id: 'world_house', alias: 'house', path: 'worlds/house.glb', category: 'world', title: 'Modern Living & Kitchen' },
  { id: 'world_supermarket', alias: 'supermarket', path: 'worlds/supermarket.glb', category: 'world', title: 'Supermarket & Groceries' },
  { id: 'world_restaurant', alias: 'restaurant', path: 'worlds/restaurant.glb', category: 'world', title: 'Gourmet Bistro & Restaurant' },
  { id: 'world_hotel', alias: 'hotel', path: 'worlds/hotel.glb', category: 'world', title: 'Luxury Hotel Lobby & Suite' },
  { id: 'world_dating', alias: 'dating', path: 'worlds/dating.glb', category: 'world', title: 'Romantic Date & Terrace' },
  { id: 'world_garden', alias: 'nature', path: 'worlds/garden.glb', category: 'world', title: 'Botanical Garden & Park' },
  { id: 'world_space', alias: 'space', path: 'worlds/space.glb', category: 'world', title: 'Orbital Space Station' },
  { id: 'game_soccer_pack', alias: 'soccer', path: 'soccer/soccer_pack.glb', category: 'soccer', title: 'MasterGoal 3D Tactical Pack' },
  { id: 'game_hedbanz_pack', alias: 'hedbanz', path: 'hedbanz/hedbanz_pack.glb', category: 'hedbanz', title: 'Hedbanz 3D Guessing Pack' }
];

const manifest = {
  version: '2.0.0',
  engine: 'Blender 5.2.3 LTS Automation PBR',
  generatedAt: new Date().toISOString(),
  totalSizeMB: 0,
  totalSizeBytes: 0,
  models: {}
};

let totalBytes = 0;

modelEntries.forEach(entry => {
  const fullPath = path.join(modelsDir, entry.path);
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    const bytes = stat.size;
    const sizeKB = +(bytes / 1024).toFixed(1);
    const sizeMB = +(bytes / (1024 * 1024)).toFixed(2);
    const nodes = readGlbNodes(fullPath);
    totalBytes += bytes;

    const data = {
      id: entry.id,
      alias: entry.alias,
      title: entry.title,
      category: entry.category,
      relativePath: `assets/models/${entry.path}`,
      bytes: bytes,
      sizeKB: sizeKB,
      sizeMB: sizeMB,
      interactiveObjects: nodes,
      pbr: true,
      bevel: true
    };

    manifest.models[entry.id] = data;
    if (entry.alias) {
      manifest.models[entry.alias] = data;
      manifest[entry.alias] = data;
    }
    manifest[entry.id] = data;
  }
});

manifest.totalSizeMB = +(totalBytes / (1024 * 1024)).toFixed(2);
manifest.totalSizeBytes = totalBytes;

const manifestPath = path.join(modelsDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log('=== REAL WEIGHTS MANIFEST GENERATED ===');
console.log(`Saved to: ${manifestPath}`);
console.log(`Total Unique 3D Assets: ${modelEntries.length}`);
console.log(`Total Payload: ${manifest.totalSizeMB} MB (${manifest.totalSizeBytes} bytes)\n`);

modelEntries.forEach(m => {
  const data = manifest.models[m.id];
  if (data) {
    console.log(`- ${data.title} [${data.relativePath}]: ${data.sizeMB} MB (${data.bytes} bytes, ${data.interactiveObjects.length} objects)`);
  }
});

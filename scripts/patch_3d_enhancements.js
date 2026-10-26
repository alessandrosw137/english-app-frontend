const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

console.log('1. Adding steam curls to coffee_mug...');
const mugTargetRegex = /handle\.rotation\.y = Math\.PI \/ 2;\s*group\.add\(plate, cup, handle\);/;
if (mugTargetRegex.test(content) && !content.includes('// Vapor humeante estilizado (steam)')) {
  const mugReplacement = `handle.rotation.y = Math.PI / 2;

          // Vapor humeante estilizado (steam)
          const steamMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9, transparent: true, opacity: 0.35 });
          [0.06, 0.12, 0.18].forEach((sy, idx) => {
            const steam = new THREE.Mesh(new THREE.TorusGeometry(0.022 + idx * 0.008, 0.006, 6, 12, Math.PI * 1.2), steamMat);
            steam.rotation.x = Math.PI / 2 + (idx % 2 === 0 ? 0.35 : -0.35);
            steam.position.set((idx % 2 === 0 ? 0.01 : -0.01), 0.14 + sy, 0);
            group.add(steam);
          });

          group.add(plate, cup, handle);`;
  content = content.replace(mugTargetRegex, mugReplacement);
  console.log('  -> Added steam to coffee_mug successfully!');
} else {
  console.log('  -> Steam already present or regex did not match.');
}

console.log('2. Adding monitor on slim stand with soft emissive glow to desk...');
if (!content.includes('// Monitor estilizado sobre soporte delgado') && content.includes('group.add(laptopGroup);')) {
  const deskReplacement = `group.add(laptopGroup);

          // Monitor estilizado sobre soporte delgado con luz emisiva suave
          const monitorBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.01, 16), legMetal);
          monitorBase.position.set(0.35, 0.775, -0.16);
          const monitorStand = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.26, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 }));
          monitorStand.position.set(0.35, 0.90, -0.16);
          const monitorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.35, 0.018), legMetal);
          monitorFrame.position.set(0.35, 1.05, -0.15);
          const monitorDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.53, 0.32), screenMat);
          monitorDisplay.position.set(0.35, 1.05, -0.14);
          group.add(monitorBase, monitorStand, monitorFrame, monitorDisplay);`;
  content = content.replace('group.add(laptopGroup);', deskReplacement);
  console.log('  -> Added monitor on slim stand to desk successfully!');
} else {
  console.log('  -> Monitor on stand already present.');
}

console.log('3. Updating disposeThreeMaterial to protect all cached procedural textures...');
const oldDispose = `if (mat.map && mat.map !== cachedBlackboardTexture && mat.map !== cachedLaptopScreenTexture) {`;
const newDispose = `if (mat.map && mat.map !== cachedBlackboardTexture && mat.map !== cachedLaptopScreenTexture && mat.map !== cachedPaintingTexture && mat.map !== cachedClockTexture && mat.map !== cachedRugTexture) {`;
if (content.includes(oldDispose)) {
  content = content.replace(oldDispose, newDispose);
  console.log('  -> Updated disposeThreeMaterial to include all cached procedural textures.');
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Finished updating app/src/main/assets/index.html');

const fs = require('fs');
let code = fs.readFileSync('js/world3d.js', 'utf8');

// 1. Clock
code = code.replace(
  'let clock = new THREE.Clock();',
  'let clock = typeof THREE !== \'undefined\' ? new THREE.Clock() : null;'
);

// 2. OrbitControls
code = code.replace(
  "if (typeof THREE.OrbitControls === 'undefined') {",
  "if (typeof THREE !== 'undefined' && typeof THREE.OrbitControls === 'undefined') {"
);

// 3. Materials
const targetMatStr = '  const SHARED_MATERIALS = {\n    // Suelos y Arquitectura';
const targetMatStrCRLF = '  const SHARED_MATERIALS = {\r\n    // Suelos y Arquitectura';

if (code.includes('const SHARED_MATERIALS = {')) {
  const startIdx = code.indexOf('const SHARED_MATERIALS = {');
  const endIdx = code.indexOf('};\n\n  // ===', startIdx);
  const endIdxCRLF = code.indexOf('};\r\n\r\n  // ===', startIdx);
  const actualEndIdx = endIdx !== -1 ? endIdx + 2 : (endIdxCRLF !== -1 ? endIdxCRLF + 2 : -1);

  if (startIdx !== -1 && actualEndIdx !== -1) {
    const originalBlock = code.substring(startIdx, actualEndIdx);
    const innerEntries = originalBlock
      .replace('const SHARED_MATERIALS = {', '')
      .replace(/};$/, '')
      .trim();

    const replacement = `const SHARED_MATERIALS = {};
  function initSharedMaterials() {
    if (typeof THREE === 'undefined' || Object.keys(SHARED_MATERIALS).length > 0) return SHARED_MATERIALS;
    const defs = {
      ${innerEntries}
    };
    Object.assign(SHARED_MATERIALS, defs);
    return SHARED_MATERIALS;
  }
  if (typeof THREE !== 'undefined') initSharedMaterials();`;

    code = code.substring(0, startIdx) + replacement + code.substring(actualEndIdx);
    console.log('Replaced SHARED_MATERIALS successfully.');
  }
}

code = code.replace('const M = SHARED_MATERIALS;', 'const M = initSharedMaterials();');

// Also in initOrResumeWorld3D:
code = code.replace(
  'function initOrResumeWorld3D() {',
  'function initOrResumeWorld3D() {\r\n    if (typeof THREE === \'undefined\') return;\r\n    if (!clock) clock = new THREE.Clock();\r\n    initSharedMaterials();'
);

fs.writeFileSync('js/world3d.js', code, 'utf8');
console.log('Successfully added guards to js/world3d.js');

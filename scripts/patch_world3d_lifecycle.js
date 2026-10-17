const fs = require('fs');
const path = require('path');

const indexAssetPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let indexContent = fs.readFileSync(indexAssetPath, 'utf8');

console.log('1. Patching ENTRAR AL PORTAL button to invoke window.initOrResumeWorld3D()...');
const oldBtn = `<button onclick="event.stopPropagation(); openPortalWithLoader('worldtour')" class="portal-btn w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-purple-500/30 cursor-pointer" data-action="enter-portal" data-portal="worldtour">ENTRAR AL PORTAL</button>`;
const newBtn = `<button onclick="event.stopPropagation(); openPortalWithLoader('worldtour'); if (typeof window.initOrResumeWorld3D === 'function') { window.initOrResumeWorld3D(); }" class="portal-btn w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-purple-500/30 cursor-pointer" data-action="enter-portal" data-portal="worldtour">ENTRAR AL PORTAL</button>`;

if (indexContent.includes(oldBtn)) {
  indexContent = indexContent.replace(oldBtn, newBtn);
  console.log('  -> Patched ENTRAR AL PORTAL button successfully.');
} else {
  console.log('  -> Button already updated or not found.');
}

console.log('2. Adding #canvas-container alias in index.html...');
const mountDiv = `<div id="threeWebGLMount" class="canvas-container canvas-container canvas-container absolute inset-0 w-full h-full z-10"></div>`;
const mountWithAlias = `<div id="threeWebGLMount" class="canvas-container canvas-container canvas-container absolute inset-0 w-full h-full z-10"></div>\r\n        <div id="canvas-container" class="canvas-container absolute inset-0 w-full h-full pointer-events-none"></div>`;

if (!indexContent.includes('id="canvas-container"') && indexContent.includes(mountDiv)) {
  indexContent = indexContent.replace(mountDiv, mountWithAlias);
  console.log('  -> Added #canvas-container alias successfully.');
} else {
  console.log('  -> #canvas-container alias already present.');
}

fs.writeFileSync(indexAssetPath, indexContent, 'utf8');

console.log('3. Updating js/app.js to invoke window.initOrResumeWorld3D()...');
const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let appJsContent = fs.readFileSync(appJsPath, 'utf8');

appJsContent = appJsContent.replace(
  `      if (viewId === 'view-worldtour') {\r\n        initThreeWorldTour();\r\n      }`,
  `      if (viewId === 'view-worldtour') {\r\n        if (typeof window.initOrResumeWorld3D === 'function') {\r\n          window.initOrResumeWorld3D();\r\n        } else {\r\n          initThreeWorldTour();\r\n        }\r\n      }`
);

appJsContent = appJsContent.replace(
  `        if (targetModule === 'worldtour') {\r\n          try { initThreeWorldTour(); } catch (err) { console.error(err); }\r\n        }`,
  `        if (targetModule === 'worldtour') {\r\n          try {\r\n            if (typeof window.initOrResumeWorld3D === 'function') {\r\n              window.initOrResumeWorld3D();\r\n            } else {\r\n              initThreeWorldTour();\r\n            }\r\n          } catch (err) { console.error(err); }\r\n        }`
);

appJsContent = appJsContent.replace(
  `          try { initThreeWorldTour(); } catch (e) { console.error(e); }`,
  `          try {\r\n            if (typeof window.initOrResumeWorld3D === 'function') {\r\n              window.initOrResumeWorld3D();\r\n            } else {\r\n              initThreeWorldTour();\r\n            }\r\n          } catch (e) { console.error(e); }`
);

fs.writeFileSync(appJsPath, appJsContent, 'utf8');

console.log('All files updated successfully!');

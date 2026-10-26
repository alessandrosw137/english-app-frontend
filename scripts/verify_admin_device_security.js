const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO FIRMA DE DISPOSITIVO Y CABECERAS DE SEGURIDAD ADMIN ===\n');

let pass = true;
let total = 0;
let passed = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`✅ ${message}`);
    passed++;
  } else {
    console.error(`❌ FALLÓ: ${message}`);
    pass = false;
  }
}

const appJs = fs.readFileSync('js/app.js', 'utf8');
const appJsAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'js', 'app.js'), 'utf8');
const appJsParent = fs.readFileSync(path.join('..', 'js', 'app.js'), 'utf8');

// 1. Inyección de Cabecera de Dispositivo Seguro
assert(
  appJs.includes("'x-admin-device-key': 'MasterENG-Admin-Secure-2026-DeviceKey'"),
  "Cabecera 'x-admin-device-key': 'MasterENG-Admin-Secure-2026-DeviceKey' presente en js/app.js"
);

assert(
  appJs.includes("'Authorization': `Bearer ${userToken}`") || appJs.includes("'Authorization': `Bearer ${authUser.token}`"),
  "Cabecera 'Authorization': `Bearer ${userToken}` configurada para autenticación de administrador"
);

assert(
  appJs.includes("'Content-Type': 'application/json'"),
  "Cabecera 'Content-Type': 'application/json' incluida en peticiones"
);

// 2. Notificación Clara de Bloqueo 403
const expectedBlockedMsg = 'Acceso restringido: Esta cuenta solo puede gestionarse desde la terminal autorizada.';
assert(
  appJs.includes(expectedBlockedMsg),
  `Mensaje explícito de bloqueo presente: "${expectedBlockedMsg}"`
);

assert(
  appJs.includes('res.status === 403') && appJs.includes(expectedBlockedMsg),
  'Condición res.status === 403 vinculada a la notificación explícita de bloqueo'
);

// 3. Sincronización exacta en los 3 directorios
assert(
  appJs === appJsAssets && appJs === appJsParent,
  'js/app.js sincronizado al 100% en raíz, Android assets y directorio superior'
);

console.log(`\n--- RESUMEN DE PRUEBAS ---`);
console.log(`Total pruebas: ${total} | Aprobadas: ${passed} | Fallidas: ${total - passed}`);

if (pass) {
  console.log('\n🎉 TODAS LAS VERIFICACIONES DE SEGURIDAD ADMIN Y FIRMA DE DISPOSITIVO PASARON CON 100% DE ÉXITO!');
  process.exit(0);
} else {
  console.error('\n❌ SE ENCONTRARON FALLOS EN LA VERIFICACIÓN.');
  process.exit(1);
}

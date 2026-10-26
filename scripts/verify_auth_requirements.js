const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('====================================================');
console.log('VERIFICACIÓN ESPECÍFICA DE AUTENTICACIÓN ESTRICTA (#view-auth)');
console.log('====================================================\n');

let allPassed = true;

function check(title, condition) {
  if (condition) {
    console.log(`✅ PASÓ: ${title}`);
  } else {
    console.error(`❌ FALLÓ: ${title}`);
    allPassed = false;
  }
}

// 1. Elementos UI de la vista de autenticación
check('Existe el elemento #authAlertBanner en #view-auth', html.includes('id="authAlertBanner"'));
check('Existe el elemento #authAlertText', html.includes('id="authAlertText"'));
check('Existe el input #authLoginIdentifier', html.includes('id="authLoginIdentifier"'));
check('Existe el input #authLoginPassword', html.includes('id="authLoginPassword"'));
check('Existe el input #authRegUsername', html.includes('id="authRegUsername"'));
check('Existe el input #authRegEmail', html.includes('id="authRegEmail"'));
check('Existe el input #authRegPassword', html.includes('id="authRegPassword"'));
check('El formulario de registro mantiene el botón "Crear Cuenta"', html.includes('Crear Cuenta'));

// 2. Eliminación de bypass y sesiones temporales locales
const hasOldFakeSession = html.includes("saveStoredAuthUser({ username: identifier, role: 'student', exp: 0, rank: 'Bronce' });");
check('Eliminado mecanismo de sesión falsa por defecto al fallar login', !hasOldFakeSession);

// 3. handleAuthLoginSubmit
check('handleAuthLoginSubmit envía petición a /api/auth/login', html.includes('/auth/login') && html.includes('fetch(loginUrl'));
check('Muestra alerta exacta "Usuario o contraseña incorrectos. Regístrate primero"', html.includes('Usuario o contraseña incorrectos. Regístrate primero'));
check('switchAuthTab oculta la alerta previa', html.includes("if (banner) banner.classList.add('hidden');"));

// 4. handleAuthRegisterSubmit
check('handleAuthRegisterSubmit exige formato estricto de email con regex', html.includes('emailStrictRegex') && html.includes('test(email)'));
check('Al completar registro cambia automáticamente a pestaña login', html.includes("switchAuthTab('login')"));
check('Pre-llena el identificador con el nuevo usuario', html.includes('loginIdent.value = username'));

console.log('\n====================================================');
if (allPassed) {
  console.log('🎉 TODOS LOS REQUISITOS DE AUTENTICACIÓN CUMPLIDOS AL 100%');
  process.exit(0);
} else {
  console.error('❌ HUBO ERRORES EN LA VERIFICACIÓN');
  process.exit(1);
}

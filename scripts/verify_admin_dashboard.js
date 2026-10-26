const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO REQUISITOS DEL PANEL ADMINISTRADOR Y DASHBOARD WEB ===\n');

const rawRoot = fs.readFileSync('index.html', 'utf8');
const rawAssets = fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'index.html'), 'utf8');
const htmlRoot = rawRoot + (fs.existsSync('js/app.js') ? fs.readFileSync('js/app.js', 'utf8') : '');
const htmlAssets = rawAssets + (fs.existsSync(path.join('app', 'src', 'main', 'assets', 'js', 'app.js')) ? fs.readFileSync(path.join('app', 'src', 'main', 'assets', 'js', 'app.js'), 'utf8') : '');

let pass = true;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
  } else {
    console.error(`❌ FALLÓ: ${message}`);
    pass = false;
  }
}

// 1. Botón de Administrador Condicional
assert(
  htmlRoot.includes('id="headerAdminBtn"') &&
  htmlRoot.includes('onclick="openAdminDashboardModal()"') &&
  htmlRoot.includes('Panel Admin'),
  'Botón "⚙️ Panel Admin" (#headerAdminBtn) existe en el menú superior con onclick'
);

assert(
  htmlRoot.includes('id="headerAdminBtn"') &&
  htmlRoot.includes('style="display: none;"'),
  'Botón #headerAdminBtn tiene style="display: none;" por defecto'
);

assert(
  htmlRoot.includes('#headerAdminBtn.hidden') &&
  htmlRoot.includes('display: none !important;'),
  'CSS crítico incluye regla universal #headerAdminBtn.hidden { display: none !important; }'
);

// 2. Reactividad en updateUserExpDisplay()
assert(
  htmlRoot.includes('const adminBtn = document.getElementById(\'headerAdminBtn\');') &&
  htmlRoot.includes("user.role === 'admin'") &&
  htmlRoot.includes("adminBtn.style.display = 'inline-flex'") &&
  htmlRoot.includes("adminBtn.style.display = 'none'"),
  'updateUserExpDisplay() muestra el botón solo si user.role === "admin" y lo oculta en caso contrario'
);

// 3. Modal Consola de Administración (Admin Dashboard)
assert(
  htmlRoot.includes('id="adminDashboardModal"') &&
  htmlRoot.includes('style="display: none;"') &&
  htmlRoot.includes('Consola de Administración'),
  'Modal #adminDashboardModal existe con display: none por defecto y título profesional'
);

assert(
  htmlRoot.includes('id="adminMetricTotalUsers"') &&
  htmlRoot.includes('id="adminMetricActiveUsers"') &&
  htmlRoot.includes('id="adminMetricGlobalExp"'),
  'Métricas rápidas arriba presentes: Total Usuarios, Usuarios Activos y EXP Global'
);

assert(
  htmlRoot.includes('id="adminUserSearchInput"') &&
  htmlRoot.includes('handleAdminUserSearch(this.value)'),
  'Barra de búsqueda en tiempo real presente para filtrar por ID, username o correo'
);

// 4. Tabla Responsiva Interactiva
assert(
  htmlRoot.includes('id="adminUsersTableBody"') &&
  htmlRoot.includes('<th class="py-2.5 px-3 font-semibold">ID</th>') &&
  htmlRoot.includes('<th class="py-2.5 px-3 font-semibold">Usuario</th>') &&
  htmlRoot.includes('<th class="py-2.5 px-3 font-semibold">Correo</th>') &&
  htmlRoot.includes('<th class="py-2.5 px-3 font-semibold">Rango</th>') &&
  htmlRoot.includes('<th class="py-2.5 px-3 font-semibold">EXP</th>') &&
  htmlRoot.includes('<th class="py-2.5 px-3 font-semibold">Fecha de Registro</th>') &&
  htmlRoot.includes('Acciones</th>'),
  'Tabla interactiva contiene las 7 columnas requeridas (ID, Usuario, Correo, Rango, EXP, Fecha de Registro, Acciones)'
);

assert(
  htmlRoot.includes('openAdminUserProgress(') &&
  htmlRoot.includes('openAdminConfirmDelete('),
  'Acciones por fila incluyen botones para "Ver Progreso" y "Eliminar"'
);

// 5. Botones de Control del Panel
assert(
  htmlRoot.includes('onclick="closeAdminDashboardModal()"') &&
  htmlRoot.includes('onclick="refreshAdminUsersData()"'),
  'Botones de "Cerrar Panel" y "Refrescar Datos" implementados'
);

// 6. Modal de Confirmación de Seguridad y Modal de Progreso
assert(
  htmlRoot.includes('id="adminConfirmDeleteModal"') &&
  htmlRoot.includes('id="adminConfirmDeleteBtn"') &&
  htmlRoot.includes('executeAdminDeleteUser()'),
  'Modal de confirmación segura de eliminación (#adminConfirmDeleteModal) con eliminación en cascada'
);

assert(
  htmlRoot.includes('id="adminViewProgressModal"') &&
  htmlRoot.includes('id="adminProgressUserName"') &&
  htmlRoot.includes('id="adminProgressExp"'),
  'Modal de inspección de progreso académico (#adminViewProgressModal)'
);

// 7. Sincronización de Archivos
assert(
  rawRoot === rawAssets,
  'index.html de la raíz y app/src/main/assets/index.html están 100% sincronizados'
);

console.log('\n--- RESUMEN FINAL ---');
if (pass) {
  console.log('🎉 TODOS LOS REQUISITOS DEL PANEL DE ADMINISTRACIÓN FUERON VERIFICADOS AL 100%!');
  process.exit(0);
} else {
  console.error('❌ SE DETECTARON FALLOS EN LA VERIFICACIÓN.');
  process.exit(1);
}

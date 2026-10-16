const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const serverDir = path.join(rootDir, 'server');

console.log('========================================================');
console.log('🚀 [START-SERVER] INICIANDO ENTORNO POSTGRESQL & BACKEND');
console.log('========================================================');

// 1. Verificar dependencias requeridas
const requiredDeps = ['pg', 'express', 'cors', 'ws', 'bcryptjs', 'dotenv'];
let needsInstall = false;

for (const dep of requiredDeps) {
  try {
    require.resolve(dep, { paths: [serverDir, rootDir] });
  } catch (e) {
    needsInstall = true;
    console.log(`📦 Dependencia faltante detectada: ${dep}`);
    break;
  }
}

if (needsInstall) {
  console.log('📦 Instalando dependencias de producción (pg, express, cors, ws, bcryptjs, dotenv)...');
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  try {
    execSync(`${npmCmd} install pg express cors ws bcryptjs dotenv --prefix "${serverDir}"`, {
      stdio: 'inherit',
      cwd: serverDir
    });
    console.log('✅ Dependencias instaladas exitosamente.');
  } catch (err) {
    console.warn('⚠️ Intento de instalación en carpeta server falló, instalando en raíz...');
    execSync(`${npmCmd} install pg express cors ws bcryptjs dotenv`, {
      stdio: 'inherit',
      cwd: rootDir
    });
  }
} else {
  console.log('✅ Todas las dependencias (pg, express, cors, ws, bcryptjs) ya están instaladas.');
}

// 2. Ejecutar script de migraciones SQL
console.log('🐘 Ejecutando migraciones e inicialización de PostgreSQL (database/schema.sql)...');
try {
  const { initializeDatabase } = require(path.join(serverDir, 'init-db.js'));
  initializeDatabase()
    .then(() => {
      console.log('✅ Migraciones completadas.');
      startServerProcess();
    })
    .catch((err) => {
      console.warn('⚠️ Advertencia en migraciones:', err.message);
      startServerProcess();
    });
} catch (e) {
  console.warn('⚠️ No se pudo cargar init-db directamente, iniciando server directamente:', e.message);
  startServerProcess();
}

function startServerProcess() {
  console.log('🌐 Iniciando Servidor Backend en puerto 3000...');
  const serverJsPath = path.join(serverDir, 'server.js');
  const serverProc = spawn(process.execPath, [serverJsPath], {
    stdio: 'inherit',
    cwd: serverDir
  });

  serverProc.on('close', (code) => {
    console.log(`🛑 Servidor detenido con código: ${code}`);
    process.exit(code);
  });
}

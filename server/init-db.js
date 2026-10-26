const { initializeDatabase, pool, getDatabaseUrl } = require('./db');

if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🚀 [init-db] Base de datos en Render verificada e inicializada.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ [init-db] Fallo en inicialización:', err.message);
      process.exit(1);
    });
}

module.exports = { initializeDatabase, pool, getDatabaseUrl };

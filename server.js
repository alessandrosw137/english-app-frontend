// Entrypoint para Render y entornos de despliegue
// Servidor Express con endpoints limpios para /api/pets, /api/pets/co-parent, /api/profile/update, /api/profile/:username, /api/pets/coop
const backend = require('./server/server.js');

module.exports = backend;

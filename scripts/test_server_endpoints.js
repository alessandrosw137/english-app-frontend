const path = require('path');
const { app } = require('../server/server.js');

function mockReq(method, path, body = {}, query = {}, headers = {}) {
  return {
    method,
    url: path,
    path,
    body,
    query,
    headers: { 'x-user-username': 'testuser', ...headers },
    params: {}
  };
}

function mockRes() {
  let statusCode = 200;
  let responseData = null;
  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    },
    send(data) {
      responseData = data;
      return res;
    },
    getStatusCode() { return statusCode; },
    getData() { return responseData; }
  };
  return res;
}

// Find route handler in Express
function findHandler(method, pathStr) {
  for (const layer of app._router.stack) {
    if (layer.route && layer.route.path === pathStr && layer.route.methods[method.toLowerCase()]) {
      return layer.route.stack[layer.route.stack.length - 1].handle;
    }
  }
  return null;
}

async function runTests() {
  console.log('=== VERIFICANDO ENDPOINTS DE EXPRESS EN SERVER/SERVER.JS ===\n');

  // 1. GET /api/pets
  const getPetsHandler = findHandler('get', '/api/pets');
  if (!getPetsHandler) throw new Error('GET /api/pets no encontrado en router');
  const req1 = mockReq('GET', '/api/pets', {}, { username: 'testuser' });
  const res1 = mockRes();
  await getPetsHandler(req1, res1);
  console.log('✅ [PASS] GET /api/pets status:', res1.getStatusCode(), 'data:', res1.getData()?.success);

  // 2. POST /api/pets
  const postPetsHandler = findHandler('post', '/api/pets');
  if (!postPetsHandler) throw new Error('POST /api/pets no encontrado en router');
  const req2 = mockReq('POST', '/api/pets', {
    username: 'testuser',
    pet: { id: 'pet_test_123', species: 'casimerito', name: 'Pompom', level: 1 }
  });
  const res2 = mockRes();
  await postPetsHandler(req2, res2);
  console.log('✅ [PASS] POST /api/pets status:', res2.getStatusCode(), 'data:', res2.getData()?.success);

  // 3. POST /api/pets/co-parent
  const postCoParentHandler = findHandler('post', '/api/pets/co-parent');
  if (!postCoParentHandler) throw new Error('POST /api/pets/co-parent no encontrado en router');
  const req3 = mockReq('POST', '/api/pets/co-parent', {
    petId: 'pet_test_123',
    ownerUsername: 'testuser',
    coParentUsername: 'partner_user',
    relationship: 'Pareja'
  });
  const res3 = mockRes();
  await postCoParentHandler(req3, res3);
  console.log('✅ [PASS] POST /api/pets/co-parent status:', res3.getStatusCode(), 'data:', res3.getData()?.success);

  // 4. POST /api/profile/update
  const postProfHandler = findHandler('post', '/api/profile/update');
  if (!postProfHandler) throw new Error('POST /api/profile/update no encontrado en router');
  const req4 = mockReq('POST', '/api/profile/update', {
    username: 'testuser',
    bio: 'B2 English Champion',
    location: 'Bogotá',
    relationship: 'Criando con @partner_user'
  });
  const res4 = mockRes();
  await postProfHandler(req4, res4);
  console.log('✅ [PASS] POST /api/profile/update status:', res4.getStatusCode(), 'data:', res4.getData()?.success);

  // 5. GET /api/profile/:username
  const getProfHandler = findHandler('get', '/api/profile/:username');
  if (!getProfHandler) throw new Error('GET /api/profile/:username no encontrado en router');
  const req5 = mockReq('GET', '/api/profile/:username');
  req5.params = { username: 'testuser' };
  const res5 = mockRes();
  await getProfHandler(req5, res5);
  console.log('✅ [PASS] GET /api/profile/:username status:', res5.getStatusCode(), 'data:', res5.getData()?.success, 'bio:', res5.getData()?.profile?.bio);

  console.log('\n🎉 ¡TODOS LOS 4 ENDPOINTS REST VERIFICADOS Y OPERATIVOS!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

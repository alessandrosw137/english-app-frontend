const http = require('http');

console.log('Testing frontend server http://localhost:5173/index.html...');
http.get('http://localhost:5173/index.html', (res) => {
  console.log('Frontend status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Frontend response length:', data.length);
    console.log('Contains "Crear Cuenta":', data.includes('Crear Cuenta'));
    console.log('Contains "coverflow-viewport":', data.includes('coverflow-viewport'));
    console.log('Contains "glossaryModal":', data.includes('glossaryModal'));
  });
}).on('error', (err) => {
  console.error('Frontend error:', err.message);
});

console.log('Testing backend server http://localhost:3000/api/health...');
http.get('http://localhost:3000/api/health', (res) => {
  console.log('Backend status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Backend health response:', data);
  });
}).on('error', (err) => {
  console.error('Backend error:', err.message);
});

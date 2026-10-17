const fs = require('fs');

const r = fs.readFileSync('js/app.js');
const a = fs.readFileSync('app/src/main/assets/js/app.js');
const p = fs.readFileSync('../js/app.js');

console.log('Root size:', r.length);
console.log('Assets size:', a.length);
console.log('Parent size:', p.length);

console.log('Root === Assets:', r.equals(a));
console.log('Root === Parent:', r.equals(p));

if (!r.equals(a)) {
  fs.writeFileSync('app/src/main/assets/js/app.js', r);
  console.log('Updated assets js/app.js with exact buffer');
}
if (!r.equals(p)) {
  fs.writeFileSync('../js/app.js', r);
  console.log('Updated parent js/app.js with exact buffer');
}

const cr = fs.readFileSync('css/style.css');
const ca = fs.readFileSync('app/src/main/assets/css/style.css');
const cp = fs.readFileSync('../css/style.css');
console.log('CSS Root === Assets:', cr.equals(ca));
if (!cr.equals(ca)) fs.writeFileSync('app/src/main/assets/css/style.css', cr);
if (!cr.equals(cp)) fs.writeFileSync('../css/style.css', cr);

const hr = fs.readFileSync('index.html');
const ha = fs.readFileSync('app/src/main/assets/index.html');
const hp = fs.readFileSync('../index.html');
console.log('HTML Root === Assets:', hr.equals(ha));
if (!hr.equals(ha)) fs.writeFileSync('app/src/main/assets/index.html', hr);
if (!hr.equals(hp)) fs.writeFileSync('../index.html', hr);

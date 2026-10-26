const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

function findSnippet(query, len = 500) {
  const idx = html.indexOf(query);
  if (idx === -1) return 'NOT FOUND: ' + query;
  return html.substring(idx - 100, idx + len);
}

console.log('--- view-auth ---');
console.log(findSnippet('id="view-auth"', 800));

console.log('--- initAuthSystem ---');
console.log(findSnippet('function initAuthSystem', 800));

console.log('--- renderProfileModal ---');
console.log(findSnippet('function renderProfileModal', 800));

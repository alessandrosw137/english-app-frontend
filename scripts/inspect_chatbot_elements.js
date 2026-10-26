const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');

function searchAll(term) {
  const lines = html.split('\n');
  const results = [];
  lines.forEach((line, idx) => {
    if (line.includes(term)) {
      results.push(`${idx + 1}: ${line.trim()}`);
    }
  });
  return results;
}

console.log('chatbotAvatarContainer:', searchAll('chatbotAvatarContainer'));
console.log('chatbotModalWindow:', searchAll('chatbotModalWindow'));

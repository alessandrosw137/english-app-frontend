const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the double closing brace in initAuthSystem
const isCRLF = content.includes('\r\n');
let normalized = content.replace(/\r\n/g, '\n');

const search = `      } catch (err) {
        console.error('Error en initAuthSystem, mostrando pantalla principal como respaldo:', err);
        goToHomePortals();
      }
    }
    }`;

const replaceWith = `      } catch (err) {
        console.error('Error en initAuthSystem, mostrando pantalla principal como respaldo:', err);
        goToHomePortals();
      }
    }`;

if (normalized.includes(search)) {
  normalized = normalized.replace(search, replaceWith);
  if (isCRLF) {
    normalized = normalized.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync(filePath, normalized, 'utf8');
  console.log('✅ Extra brace fixed successfully.');
} else {
  console.warn('⚠️ Search block not found, check exact lines.');
}

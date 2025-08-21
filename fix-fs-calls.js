const fs = require('fs');

// Read the file
let content = fs.readFileSync('aws-sync-server.js', 'utf8');

// Replace all fs. calls with fsPromises.
content = content.replace(/await fs\./g, 'await fsPromises.');

// Write back
fs.writeFileSync('aws-sync-server.js', content);

console.log('✅ Fixed all fs calls in aws-sync-server.js');
console.log('Now restart your server with: pm2 restart punjabiecom');

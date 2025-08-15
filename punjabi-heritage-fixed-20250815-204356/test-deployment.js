// Quick deployment test script
const http = require('http');

const testUrl = process.env.TEST_URL || 'http://localhost:3000';

console.log(`Testing deployment at: ${testUrl}`);

http.get(testUrl, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Deployment test successful!');
      if (data.includes('Punjab Heritage')) {
        console.log('✅ Page content loaded correctly');
      } else {
        console.log('⚠️  Page content may have issues');
      }
    } else {
      console.log('❌ Deployment test failed');
    }
  });
}).on('error', (err) => {
  console.log('❌ Connection error:', err.message);
});

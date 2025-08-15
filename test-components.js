// Simple test to check if the main page loads without errors
const http = require('http');

const testUrl = 'http://localhost:3000';

console.log('🧪 Testing local development server...');
console.log(`Testing URL: ${testUrl}`);

http.get(testUrl, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Server is responding successfully!');
      
      // Check for key content
      const checks = [
        { name: 'Punjab Heritage title', test: data.includes('Punjab Heritage') },
        { name: 'Punjabi text', test: data.includes('ਪੰਜਾਬ') },
        { name: 'React app', test: data.includes('__next') },
        { name: 'No obvious errors', test: !data.includes('Application error') }
      ];
      
      console.log('\n📋 Content checks:');
      checks.forEach(check => {
        console.log(`${check.test ? '✅' : '❌'} ${check.name}`);
      });
      
      const allPassed = checks.every(check => check.test);
      console.log(`\n${allPassed ? '🎉' : '⚠️'} Overall: ${allPassed ? 'All checks passed!' : 'Some checks failed'}`);
      
    } else {
      console.log('❌ Server returned error status');
    }
  });
}).on('error', (err) => {
  console.log('❌ Connection error:', err.message);
  console.log('Make sure the development server is running with: npm run dev');
});
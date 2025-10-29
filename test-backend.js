const http = require('http');

// Test the health endpoint
function testHealth() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('✓ Health Check Response:', data);
    });
  });

  req.on('error', (error) => {
    console.error('✗ Health Check Error:', error.message);
    console.error('Full error:', error);
  });

  req.end();
}

// Wait a bit for server to start, then test
setTimeout(() => {
  console.log('Testing backend endpoints...\n');
  testHealth();
}, 1000);

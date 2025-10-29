// Test script to verify backend API
const http = require('http');

// Test 1: Health Check
function testHealth() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('✅ Health Check Response:', data);
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (error) => {
      console.error('❌ Health Check Error:', error.message);
      reject(error);
    });

    req.end();
  });
}

// Test 2: Registration
function testRegistration() {
  return new Promise((resolve, reject) => {
    const userData = JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': userData.length
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`\n✅ Registration Response (Status: ${res.statusCode}):`, data);
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (error) => {
      console.error('❌ Registration Error:', error.message);
      reject(error);
    });

    req.write(userData);
    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('🧪 Testing OweSmart Backend API\n');
  console.log('=' .repeat(50));
  
  try {
    console.log('\n📍 Test 1: Health Check');
    await testHealth();
    
    console.log('\n📍 Test 2: User Registration');
    await testRegistration();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.log('\n' + '='.repeat(50));
    console.error('❌ Tests failed:', error.message);
    process.exit(1);
  }
}

runTests();

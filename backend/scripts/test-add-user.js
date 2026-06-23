const fetch = require('node-fetch');

async function test() {
  // Try logging in to get a token
  const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aat@gmail.com', password: 'password' }) // Just a guess for an existing user or maybe the one in the screenshot? No, the screenshot shows the admin is logged in. Let's create an admin user or use a known one.
  });
  
  // Let's use the DB to find Jubeda Khatun's email and token
}
test();

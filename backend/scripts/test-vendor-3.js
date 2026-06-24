const http = require('http');

const data = JSON.stringify({
  name: 'Test Vendor 3',
  contactName: 'John Doe',
  category: 'Food'
});

const req = http.request({
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const parsed = JSON.parse(body);
    console.log("Login:", parsed);
    
    if (parsed.data && parsed.data.token) {
      const token = parsed.data.token;
      const req2 = http.request({
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/v1/vendors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }, (res2) => {
        let body2 = '';
        res2.on('data', chunk => body2 += chunk);
        res2.on('end', () => {
          console.log("Create Vendor:", body2);
        });
      });
      req2.write(data);
      req2.end();
    }
  });
});

req.write(JSON.stringify({ email: 'manager@starlodge.com', password: 'password123' })); // Login as Faisal Ahmed (Manager)
req.end();

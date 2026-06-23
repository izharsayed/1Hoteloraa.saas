const http = require('http');

const data = JSON.stringify({
  name: 'Test Staff',
  email: 'teststaf6f2@royalpalace.com',
  phone: '', 
  userRole: 'HOUSEKEEPING',
  password: 'password123'
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
        path: '/api/v1/users',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }, (res2) => {
        let body2 = '';
        res2.on('data', chunk => body2 += chunk);
        res2.on('end', () => {
          console.log("Create User:", body2);
        });
      });
      req2.write(data);
      req2.end();
    }
  });
});

req.write(JSON.stringify({ email: 'admin@royalpalace.com', password: 'password123' }));
req.end();

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

async function run() {
  try {
    const login = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@royalpalace.com', password: 'password123' })
    });
    const data = await login.json();
    console.log('Login:', data);
    if (data.data?.token) {
      console.log('Token payload:', parseJwt(data.data.token));
      
      console.log('--- Testing POST /users ---');
      const createUser = await fetch('http://127.0.0.1:5000/api/v1/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.data.token}`
        },
        body: JSON.stringify({
          name: 'Test Staff',
          email: 'teststaff2@royalpalace.com',
          phone: '', 
          userRole: 'HOUSEKEEPING',
          password: 'password123'
        })
      });
      console.log('Create User Status:', createUser.status);
      const createData = await createUser.json();
      console.log('Create User Response:', createData);
      
      console.log('--- Testing GET /users ---');
      const getUsers = await fetch('http://127.0.0.1:5000/api/v1/users', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${data.data.token}`
        }
      });
      console.log('Get Users Status:', getUsers.status);
      const getData = await getUsers.json();
      if (!getUsers.ok) {
        console.log('Get Users Error:', getData);
      } else {
        console.log('Get Users Success. Count:', getData.data.length);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
run();

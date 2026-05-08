const axios = require('axios');

async function testLogin() {
  try {
    console.log('Attempting login with admin@wdu.co.id / admin123...');
    const response = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'admin@wdu.co.id',
      password: 'admin123'
    });
    console.log('Login SUCCESS:', response.data.user.name);
  } catch (error) {
    if (error.response) {
      console.error('Login FAILED:', error.response.status, error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
  }
}

testLogin();

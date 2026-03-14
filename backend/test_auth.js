const axios = require('axios');

async function testCompleteFlow() {
    const email = 'testuser_' + Date.now() + '@example.com';
    const password = 'password123';
    
    try {
        console.log('--- 1. Testing Registration ---');
        const regRes = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test user',
            email,
            password,
            role: 'Author'
        });
        console.log('Registration Success:', regRes.data.message);

        console.log('\n--- 2. Testing Login (Unapproved) ---');
        try {
            await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
                role: 'Author'
            });
        } catch (error) {
            console.log('Login (Unapproved) Status:', error.response?.status);
            console.log('Login (Unapproved) Message:', error.response?.data?.message);
        }

        console.log('\n--- 3. Testing Login (Wrong Role) ---');
        try {
            await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
                role: 'Reviewer'
            });
        } catch (error) {
            console.log('Login (Wrong Role) Status:', error.response?.status);
            console.log('Login (Wrong Role) Message:', error.response?.data?.message);
        }

        console.log('\n--- 4. Testing Login (Wrong Password) ---');
        try {
            await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password: 'wrongpassword',
                role: 'Author'
            });
        } catch (error) {
            console.log('Login (Wrong Password) Status:', error.response?.status);
            console.log('Login (Wrong Password) Message:', error.response?.data?.message);
        }

        console.log('\n--- 5. Testing Login (Non-existent) ---');
        try {
            await axios.post('http://localhost:5000/api/auth/login', {
                email: 'nonexistent@example.com',
                password,
                role: 'Author'
            });
        } catch (error) {
            console.log('Login (Non-existent) Status:', error.response?.status);
            console.log('Login (Non-existent) Message:', error.response?.data?.message);
        }

    } catch (error) {
        console.error('Flow failed:', error.message);
        if (error.response) console.log(error.response.data);
    }
}

testCompleteFlow();

const axios = require('axios');

const API_URL = 'http://127.0.0.1:5000/api/admin';

const testAdmin = async () => {
    try {
        console.log('Testing Admin Login...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: 'admin@karigar.com',
            password: 'adminpassword123',
        });

        const token = loginRes.data.token;
        console.log('Login Successful! Token received.');

        console.log('Testing Protected Route (Get Metrics)...');
        const metricsRes = await axios.get(`${API_URL}/metrics`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Metrics received:', JSON.stringify(metricsRes.data, null, 2));
        console.log('Verification Successful!');
    } catch (error) {
        console.error('Verification Failed:', error.response ? error.response.data : error.message);
    }
};

testAdmin();

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const test = async () => {
    try {
        console.log('--- Starting API Tests ---');

        // 1. Register a customer
        console.log('\n1. Registering customer...');
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Customer',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'customer'
        });
        const token = regRes.data.token;
        console.log('Customer registered successfully.');

        // 2. Login
        console.log('\n2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: regRes.data.user.email,
            password: 'password123'
        });
        console.log('Logged in successfully.');

        // 3. Get Services (should be empty initially)
        console.log('\n3. Fetching services...');
        const servicesRes = await axios.get(`${API_URL}/customer/services`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`Found ${servicesRes.data.count} services.`);

        // 4. Get Bookings
        console.log('\n4. Fetching bookings...');
        const bookingsRes = await axios.get(`${API_URL}/customer/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`Found ${bookingsRes.data.count} bookings.`);

        console.log('\n--- API Tests Completed Successfully ---');
    } catch (err) {
        console.error('\n--- API Test Failed ---');
        console.error(err.response ? err.response.data : err.message);
    }
};

// Note: This script requires the server to be running.
// test();
console.log('Verification script created. Run the server with "node index.js" and then run this script.');

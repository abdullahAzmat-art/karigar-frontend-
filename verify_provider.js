const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testProvider = async () => {
    try {
        console.log('--- Starting Provider API Tests ---');

        // 1. Register a provider
        console.log('\n1. Registering provider...');
        const email = `provider${Date.now()}@example.com`;
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Provider',
            email: email,
            password: 'password123',
            role: 'provider'
        });
        let token = regRes.data.token;
        console.log('Provider registered successfully.');

        // 2. Create Service Profile
        console.log('\n2. Creating service profile...');
        const serviceRes = await axios.post(`${API_URL}/provider/service`, {
            title: 'Expert Plumbing',
            description: 'All kinds of plumbing services',
            category: 'Plumber',
            price: 50,
            availability: ['Monday', 'Wednesday', 'Friday']
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Service profile created:', serviceRes.data.data.title);

        // 3. Get Service Profile
        console.log('\n3. Fetching service profile...');
        const getServiceRes = await axios.get(`${API_URL}/provider/service`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched service profile:', getServiceRes.data.data.title);

        // 4. Get Bookings (should be empty)
        console.log('\n4. Fetching bookings...');
        const bookingsRes = await axios.get(`${API_URL}/provider/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`Found ${bookingsRes.data.count} bookings.`);

        console.log('\n--- Provider API Tests Completed Successfully ---');
    } catch (err) {
        console.error('\n--- Provider API Test Failed ---');
        console.error(err.response ? err.response.data : err.message);
    }
};

testProvider();

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = async () => {
    const mongoose = require('mongoose');
    try {
        const conn = await mongoose.connect('mongodb+srv://abdullahdevlife:31aug2007@cluster0.xqlt8.mongodb.net/karigar?retryWrites=true&w=majority');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Route files
const auth = require('./routes/authRoutes');
const customer = require('./routes/customerRoutes');
const provider = require('./routes/providerRoutes');
const admin = require('./routes/adminRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/customer', customer);
app.use('/api/provider', provider);
app.use('/api/admin', admin);

app.get('/', (req, res) => {
    res.send('Karigar API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

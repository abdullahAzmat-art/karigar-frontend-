const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    availability: {
        type: [String], // e.g., ['Monday', 'Tuesday', '10:00-18:00']
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reportedEntity: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'entityType',
        required: true,
    },
    entityType: {
        type: String,
        required: true,
        enum: ['User', 'Service'],
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'resolved', 'dismissed'],
        default: 'open',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;

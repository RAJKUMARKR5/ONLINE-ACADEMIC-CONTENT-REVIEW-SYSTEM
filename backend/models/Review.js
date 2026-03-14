const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    submission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    technicalQuality: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    clarity: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    novelty: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    recommendation: {
        type: String,
        enum: ['Accept', 'Reject'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);

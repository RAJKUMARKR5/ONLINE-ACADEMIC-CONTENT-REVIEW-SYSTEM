const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Author', 'Reviewer', 'Admin'],
        default: 'Author'
    },
    expertise: {
        type: [String], // Array of strings for expertise tags (e.g., "Computer Science", "Physics")
        default: []
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined'],
        default: 'Pending'
    }
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);

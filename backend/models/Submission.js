const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    abstract: {
        type: String,
        required: true
    },
    keywords: {
        type: [String],
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String, // URL to the file stored in Cloudinary/S3/Local
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Under Review', 'Reviewed', 'Accepted', 'Rejected', 'Published'],
        default: 'Pending'
    },
    publishedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);

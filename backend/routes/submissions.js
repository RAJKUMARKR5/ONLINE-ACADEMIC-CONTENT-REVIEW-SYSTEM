const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Submission = require('../models/Submission');
const Review = require('../models/Review');
const User = require('../models/User'); // Import User for emails
const { protect, authorize } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: PDF and DOC/DOCX only!');
        }
    }
});

// @desc    Create a new submission
// @route   POST /api/submissions
// @access  Private (Author only)
router.post('/', protect, authorize('Author'), upload.single('file'), async (req, res) => {
    const { title, abstract, keywords, domain } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'File is required' });
    }

    try {
        const submission = await Submission.create({
            author: req.user.id,
            title,
            abstract,
            keywords: keywords.split(',').map(k => k.trim()), // Assuming comma-separated
            domain,
            fileUrl: req.file.path,
        });

        res.status(201).json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all submissions for the logged-in author
// @route   GET /api/submissions/my
// @access  Private (Author)
router.get('/my', protect, authorize('Author'), async (req, res) => {
    try {
        const submissions = await Submission.find({ author: req.user.id });
        res.status(200).json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get ALL submissions
// @route   GET /api/submissions/all
// @access  Private (Admin)
router.get('/all', protect, authorize('Admin'), async (req, res) => {
    try {
        const submissions = await Submission.find().populate('author', 'name email');
        res.status(200).json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get Published submissions
// @route   GET /api/submissions/published
// @access  Public
router.get('/published', async (req, res) => {
    try {
        const publishedSubmissions = await Submission.find({ 
            status: { $in: ['Accepted', 'Published'] } 
        }).populate('author', 'name');
        res.status(200).json(publishedSubmissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get a single submission by ID
// @route   GET /api/submissions/:id
// @access  Private (Author, Reviewer, Admin)
router.get('/:id', protect, authorize('Author', 'Reviewer', 'Admin'), async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id).populate('author', 'name email');
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(200).json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get reviews for a specific submission
// @route   GET /api/submissions/:id/reviews
// @access  Private (Author, Admin)
router.get('/:id/reviews', protect, authorize('Author', 'Admin'), async (req, res) => {
    try {
        // Fetch submission to verify ownership (if Author)
        const submission = await Submission.findById(req.params.id);
        
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Optional: Ensure only the author or an admin can see these reviews
        if (submission.author.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized to view these reviews' });
        }

        const reviews = await Review.find({ submission: req.params.id }).populate('reviewer', 'name');
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update submission status (Final Decision)
// @route   PUT /api/submissions/:id/decision
// @access  Private (Admin)
router.put('/:id/decision', protect, authorize('Admin'), async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['Accepted', 'Rejected', 'Published'].includes(status)) {
            return res.status(400).json({ message: 'DEBUG: Invalid decision status. Must be Accepted, Rejected, or Published.' });
        }

        const updateData = { status };
        if (status === 'Accepted' || status === 'Published') {
            updateData.publishedAt = Date.now();
        }

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('author', 'name email');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Send email to author
        if (submission.author) {
            const author = submission.author; // Already populated now
            if (author && author.email) {
                const actionText = (status === 'Accepted' || status === 'Published') ? 'published' : 'rejected';
                const message = `Dear ${author.name},\n\nAn admin has made a final decision on your paper titled "${submission.title}".\n\nWe are pleased/sorry to inform you that your paper has been ${actionText} by the review committee.\n\nPlease log in to the OACRS dashboard for more details.\n\nBest regards,\nOACRS Admin Team`;
                await sendEmail({
                    email: author.email,
                    subject: `Final Decision on Your Paper (${status}) - OACRS`,
                    message
                });
            }
        }

        res.status(200).json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a submission
// @route   DELETE /api/submissions/:id
// @access  Private (Author, Admin)
router.delete('/:id', protect, authorize('Author', 'Admin'), async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Make sure user is submission author OR admin
        if (submission.author.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized to delete this submission' });
        }

        await Submission.findByIdAndDelete(req.params.id);
        
        // Delete associated reviews
        await Review.deleteMany({ submission: req.params.id });

        // Delete associated assignments
        const Assignment = require('../models/Assignment');
        await Assignment.deleteMany({ submission: req.params.id });

        res.status(200).json({ id: req.params.id, message: 'Submission deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

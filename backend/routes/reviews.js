const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Submission = require('../models/Submission');
const User = require('../models/User'); // Need User to get author's email
const { protect, authorize } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

// @desc    Get assignments for a reviewer
// @route   GET /api/reviews/assignments
// @access  Private (Reviewer)
router.get('/assignments', protect, authorize('Reviewer'), async (req, res) => {
    try {
        const assignments = await require('../models/Assignment').find({ reviewer: req.user.id })
            .populate('submission')
            .sort({ createdAt: -1 });
        res.status(200).json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Submit a review
// @route   POST /api/reviews
// @access  Private (Reviewer)
router.post('/', protect, authorize('Reviewer'), async (req, res) => {
    const { submissionId, assignmentId, technicalQuality, clarity, novelty, comments, recommendation } = req.body;

    try {
        // Check if already reviewed (optional but good)
        const existingReview = await Review.findOne({ submission: submissionId, reviewer: req.user.id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this submission' });
        }

        const review = await Review.create({
            submission: submissionId,
            reviewer: req.user.id,
            technicalQuality,
            clarity,
            novelty,
            comments,
            recommendation
        });

        // Update assignment status to 'Completed'
        if (assignmentId) {
            await require('../models/Assignment').findByIdAndUpdate(assignmentId, { status: 'Completed' });
        }

        // Update Submission status 
        // For simplicity in this flow, assuming one review marks it as 'Reviewed'.
        // More complex logic could check if all assignments for this submission are 'Completed'.
        const submission = await Submission.findByIdAndUpdate(submissionId, { status: 'Reviewed' });

        // Notify Author about the review
        if (submission && submission.author) {
            const author = await User.findById(submission.author);
            if (author && author.email) {
                const message = `Dear ${author.name},\n\nA reviewer has just submitted feedback for your paper titled "${submission.title}".\n\nPlease log in to the OACRS dashboard to view the feedback and current status of your submission.\n\nBest regards,\nOACRS Admin Team`;
                await sendEmail({
                    email: author.email,
                    subject: 'New Review on Your Paper - OACRS',
                    message
                });
            }
        }

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const User = require('../models/User'); // Need User model to get email
const Submission = require('../models/Submission'); // Need Submission to get title
const { protect, authorize } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

// @desc    Assign a reviewer to a submission
// @route   POST /api/assignments
// @access  Private (Admin)
router.post('/', protect, authorize('Admin'), async (req, res) => {
    const { submissionId, reviewerId } = req.body;

    try {
        // Check if already assigned
        const existingAssignment = await Assignment.findOne({ submission: submissionId, reviewer: reviewerId });
        if (existingAssignment) {
            return res.status(400).json({ message: 'Reviewer already assigned to this submission' });
        }

        const assignment = await Assignment.create({
            submission: submissionId,
            reviewer: reviewerId,
            status: 'Pending'
        });

        // Update submission status to 'Under Review'
        const submission = await Submission.findByIdAndUpdate(submissionId, { status: 'Under Review' });

        if (!submission) {
             return res.status(404).json({ message: 'Submission not found' });
        }

        // Fetch User details for email
        const reviewer = await User.findById(reviewerId);

        // Send Email Notification
        if (reviewer && reviewer.email) {
            const message = `Dear ${reviewer.name},\n\nYou have been assigned a new paper to review on the OACRS platform. \n\nPaper Title: ${submission.title || 'Unknown Title'}\n\nPlease login to your account to review the assignment and provide your feedback.\n\nBest regards,\nOACRS Admin Team`;
            try {
                await sendEmail({
                    email: reviewer.email,
                    subject: 'New Review Assignment - OACRS',
                    message
                });
            } catch (emailError) {
                console.error("Failed to send assignment email to reviewer:", emailError);
            }
        }

        res.status(201).json(assignment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

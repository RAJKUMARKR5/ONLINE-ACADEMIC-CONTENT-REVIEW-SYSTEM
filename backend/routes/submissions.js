const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Review = require('../models/Review');
const User = require('../models/User'); // Import User for emails
const Assignment = require('../models/Assignment');
const { protect, authorize } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');
const { uploadCloud, cloudinary } = require('../config/cloudinaryConfig');

// @desc    Create a new submission
// @route   POST /api/submissions
// @access  Private (Author only)
router.post('/', protect, authorize('Author'), (req, res) => {
    uploadCloud.single('file')(req, res, async function (err) {
        if (err) {
            console.error('[Cloudinary Upload Error]', err);
            return res.status(500).json({ message: 'File upload failed: ' + (err.message || err.toString()) });
        }
        
        const { title, abstract, keywords, domain } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'File is required' });
        }

        try {
            const submission = await Submission.create({
                author: req.user.id,
                title,
                abstract,
                keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
                domain,
                fileUrl: req.file.path,
            });

            res.status(201).json(submission);
        } catch (error) {
            console.error('[Submission DB Error]', error);
            res.status(500).json({ message: 'Server Error: Could not save submission to database' });
        }
    });
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
        
        // Attach reviews and assignments to each submission
        const submissionsWithData = await Promise.all(
            submissions.map(async (sub) => {
                const reviews = await Review.find({ submission: sub._id })
                    .populate('reviewer', 'name')
                    .select('reviewer recommendation comments technicalQuality clarity novelty createdAt');
                
                const assignment = await Assignment.findOne({ submission: sub._id, status: 'Pending' })
                    .populate('reviewer', 'name');

                const subObj = sub.toObject();
                subObj.reviews = reviews;
                subObj.assignedReviewer = assignment ? assignment.reviewer : null;
                return subObj;
            })
        );
        
        res.status(200).json(submissionsWithData);
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

        // Attach reviews to published submissions so public viewers can see ratings & feedback
        const submissionsWithReviews = await Promise.all(
            publishedSubmissions.map(async (sub) => {
                const reviews = await Review.find({ submission: sub._id })
                    .populate('reviewer', 'name')
                    .select('reviewer recommendation comments technicalQuality clarity novelty createdAt');
                
                const subObj = sub.toObject();
                subObj.reviews = reviews;
                return subObj;
            })
        );

        res.status(200).json(submissionsWithReviews);
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
        console.log(`[Decision] Received decision for submission ${req.params.id}: ${status}`);
        
        if (!['Accepted', 'Rejected', 'Published'].includes(status)) {
            console.warn(`[Decision] Invalid status received: ${status}`);
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

        // Send email to author (Non-blocking)
        if (submission.author) {
            const author = submission.author;
            if (author && author.email) {
                const actionText = (status === 'Accepted' || status === 'Published') ? 'published' : 'rejected';
                const message = `Dear ${author.name},\n\nAn admin has made a final decision on your paper titled "${submission.title}".\n\nWe are pleased/sorry to inform you that your paper has been ${actionText} by the review committee.\n\nPlease log in to the OACRS dashboard for more details.\n\nBest regards,\nOACRS Admin Team`;
                
                // Do not await email sending to avoid blocking the API response
                sendEmail({
                    email: author.email,
                    subject: `Final Decision on Your Paper (${status}) - OACRS`,
                    message
                }).catch(err => console.error('[Decision] Deferred email error:', err.message));
            }
        }

        const reviews = await Review.find({ submission: submission._id })
            .populate('reviewer', 'name')
            .select('reviewer recommendation comments technicalQuality clarity novelty createdAt');
        
        const assignment = await Assignment.findOne({ submission: submission._id, status: 'Pending' })
            .populate('reviewer', 'name');

        const populatedSubmission = submission.toObject();
        populatedSubmission.reviews = reviews;
        populatedSubmission.assignedReviewer = assignment ? assignment.reviewer : null;

        console.log(`[Decision] Successfully updated status to ${status} for ${req.params.id}`);
        res.status(200).json(populatedSubmission);
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

        // Delete file from Cloudinary
        if (submission.fileUrl && submission.fileUrl.includes('cloudinary.com')) {
            try {
                // Extract public_id from secure_url
                // Format: https://res.cloudinary.com/.../raw/upload/v.../oacrs_submissions/filename.pdf
                const urlParts = submission.fileUrl.split('/');
                const folderIndex = urlParts.indexOf('oacrs_submissions');
                if (folderIndex !== -1) {
                    const publicIdPath = urlParts.slice(folderIndex).join('/');
                    // Extract public_id (without extension if image, but for raw files like PDF/DOC we might need the exact ID)
                    // CloudinaryStorage with 'raw' resource_type often keeps the extension in public_id
                    const publicId = publicIdPath; // For raw files, the full path is usually the public ID
                    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
                    console.log(`[Cloudinary] Deleted file: ${publicId}`);
                }
            } catch (cloudErr) {
                console.error('[Cloudinary] Failed to delete file:', cloudErr);
            }
        }

        await Submission.findByIdAndDelete(req.params.id);
        
        // Delete associated reviews
        await Review.deleteMany({ submission: req.params.id });

        // Delete associated assignments
        await Assignment.deleteMany({ submission: req.params.id });

        res.status(200).json({ id: req.params.id, message: 'Submission deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'oacrs_submissions', // Folder in your Cloudinary account
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw', // Important for non-image files like PDF, DOC
  },
});

const uploadCloud = multer({ storage: storage });

module.exports = { cloudinary, uploadCloud };

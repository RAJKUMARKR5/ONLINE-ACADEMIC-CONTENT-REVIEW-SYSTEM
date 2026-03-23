const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with environment variables (with fool-proof fallbacks)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dahkkqw1d',
  api_key: process.env.CLOUDINARY_API_KEY || '695373442541355',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'fd0FjBcu0KX2vFh5W158nzSKGzM'
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'oacrs_submissions', // Folder in your Cloudinary account
    resource_type: 'raw', // Important for non-image files like PDF, DOC
  },
});

const uploadCloud = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/i;
    // Check extension
    const extname = filetypes.test(file.originalname.split('.').pop());
    
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: PDF and DOC/DOCX only!'));
    }
  }
});

module.exports = { cloudinary, uploadCloud };

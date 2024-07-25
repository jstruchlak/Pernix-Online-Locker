const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

const allowedFileTypes = /jpeg|jpg|png/;

const fileSizeLimit = 1 * 1024 * 1024; // 10 MB


// Storage configuration with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_pics',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    }
});

// Define the multer upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: fileSizeLimit }, // Set file size limit
    fileFilter: (req, file, cb) => {
        // Check if the file type is allowed
        const extname = allowedFileTypes.test(file.mimetype);
        const mimetype = allowedFileTypes.test(file.originalname.split('.').pop().toLowerCase());
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, JPG, and PNG files are allowed.'));
        }
    }
});
module.exports = upload;

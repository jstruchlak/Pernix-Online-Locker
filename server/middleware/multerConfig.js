const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');


const allowedFileTypes = /jpeg|jpg|png/;
const fileSizeLimit = 5 * 1024 * 1024; // 5 MB



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        // Cloudinary folder name 
        folder: 'profile_pics', 
        allowedFormats: ['jpeg', 'png', 'jpg'] 
    }
});


const upload = multer({
    storage: storage,
    limits: { fileSize: fileSizeLimit },
    fileFilter: (req, file, cb) => {
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


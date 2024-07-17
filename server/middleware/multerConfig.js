const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        // Cloudinary folder name 

        folder: 'profile_pics', 
        allowedFormats: ['jpeg', 'png', 'jpg']
        
    }
});


const upload = multer({ storage: storage });

module.exports = upload;


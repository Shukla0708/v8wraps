// cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',         // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Optional
  },
});

module.exports = { cloudinary, storage };

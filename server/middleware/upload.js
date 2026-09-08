const multer = require('multer');

/**
 * Files are held in memory and streamed straight to storage
 * (Cloudinary when configured, local disk otherwise).
 */
const storage = multer.memoryStorage();

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const PDF_TYPE = 'application/pdf';

const imageUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (IMAGE_TYPES.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG and WEBP images are allowed'));
    }
  },
});

const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.toLowerCase() === PDF_TYPE) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

module.exports = { imageUpload, resumeUpload };

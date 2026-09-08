const router = require('express').Router();
const {
  uploadPhoto,
  deletePhoto,
  uploadResume,
  deleteResume,
} = require('../controllers/uploadController');
const { adminOnly } = require('../middleware/auth');
const { imageUpload, resumeUpload } = require('../middleware/upload');

router.post('/photo', adminOnly, imageUpload.single('photo'), uploadPhoto);
router.delete('/photo', adminOnly, deletePhoto);
router.post('/resume', adminOnly, resumeUpload.single('resume'), uploadResume);
router.delete('/resume', adminOnly, deleteResume);

module.exports = router;

const router = require('express').Router();
const { downloadResume, resumeMeta } = require('../controllers/uploadController');

// Public: the current resume is downloadable by anyone (as intended for a portfolio)
router.get('/download', downloadResume);
router.get('/', resumeMeta);

module.exports = router;

const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { adminOnly } = require('../middleware/auth');

router.route('/').get(getProfile).put(adminOnly, updateProfile);

module.exports = router;

const router = require('express').Router();
const {
  getPublicSettings,
  updateSettings,
} = require('../controllers/settingsController');
const { adminOnly } = require('../middleware/auth');

router.route('/').get(getPublicSettings).put(adminOnly, updateSettings);

module.exports = router;

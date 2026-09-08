const router = require('express').Router();
const { getOverview } = require('../controllers/overviewController');
const { adminOnly } = require('../middleware/auth');

router.get('/', adminOnly, getOverview);

module.exports = router;

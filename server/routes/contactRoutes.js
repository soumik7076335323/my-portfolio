const router = require('express').Router();
const { body } = require('express-validator');
const {
  sendMessage,
  listMessages,
  updateStatus,
  deleteMessage,
} = require('../controllers/contactController');
const { adminOnly } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { rateLimit } = require('../middleware/rateLimit');

router.post(
  '/',
  rateLimit({ windowMs: 10 * 60 * 1000, max: 5, key: 'contact' }),
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('subject').trim().isLength({ min: 2, max: 200 }).withMessage('Subject is required'),
    body('message')
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage('Message must be between 10 and 5000 characters'),
  ],
  validate,
  sendMessage
);

router.get('/', adminOnly, listMessages);
router.put('/:id/status', adminOnly, updateStatus);
router.delete('/:id', adminOnly, deleteMessage);

module.exports = router;

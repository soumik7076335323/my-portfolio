const router = require('express').Router();
const { body } = require('express-validator');
const { login, me, changePassword } = require('../controllers/authController');
const { adminOnly } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { rateLimit } = require('../middleware/rateLimit');

router.post(
  '/login',
  rateLimit({ windowMs: 10 * 60 * 1000, max: 10, key: 'login' }),
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/me', adminOnly, me);
router.put(
  '/change-password',
  adminOnly,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters'),
  ],
  validate,
  changePassword
);

module.exports = router;

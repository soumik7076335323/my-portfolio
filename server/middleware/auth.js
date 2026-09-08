const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Verifies the Bearer JWT and attaches the admin document to req.admin.
 */
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const token = header.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: 'Session expired. Please log in again.' });
    }
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Account no longer exists' });
    }
    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization. Roles beyond 'admin' can be added later.
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  next();
};

const adminOnly = [protect, authorize('admin')];

module.exports = { protect, authorize, adminOnly };

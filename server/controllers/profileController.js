const Profile = require('../models/Profile');

const PUBLIC_FIELDS =
  'name title tagline summary email phone location github linkedin website photoUrl photoUpdatedAt resumeFileName resumeUrl resumeUpdatedAt';

// GET /api/profile (public)
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.getSingleton();
    const { _id, createdAt, updatedAt, ...publicProfile } = profile.toObject();
    // Public route exposes only what the portfolio needs
    const safe = {};
    PUBLIC_FIELDS.split(' ').forEach((f) => {
      if (publicProfile[f] !== undefined) safe[f] = publicProfile[f];
    });
    res.json({ success: true, data: safe });
  } catch (err) {
    next(err);
  }
};

// PUT /api/profile (admin)
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = [
      'name',
      'title',
      'tagline',
      'summary',
      'email',
      'phone',
      'location',
      'github',
      'linkedin',
      'website',
    ];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const profile = await Profile.getSingleton();
    Object.assign(profile, updates);
    await profile.save();
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

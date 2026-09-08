const mongoose = require('mongoose');

/**
 * Singleton document holding the portfolio owner's profile.
 * Resume + profile photo are stored as URLs + metadata (files live in
 * Cloudinary or on disk) — never as binary blobs in MongoDB.
 */
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: '', trim: true, maxlength: 100 },
    title: { type: String, default: '', trim: true, maxlength: 120 },
    tagline: { type: String, default: '', trim: true, maxlength: 300 },
    summary: { type: String, default: '', trim: true, maxlength: 4000 },
    email: { type: String, default: '', trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true, maxlength: 30 },
    location: { type: String, default: '', trim: true, maxlength: 120 },
    github: { type: String, default: '', trim: true },
    linkedin: { type: String, default: '', trim: true },
    website: { type: String, default: '', trim: true },

    // Profile photo (URL reference + metadata)
    photoUrl: { type: String, default: '' },
    photoPublicId: { type: String, default: '' },
    photoProvider: { type: String, enum: ['', 'cloudinary', 'local'], default: '' },
    photoUpdatedAt: { type: Date },

    // Resume (URL reference + metadata)
    resumeFileName: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    resumePublicId: { type: String, default: '' },
    resumeProvider: { type: String, enum: ['', 'cloudinary', 'local'], default: '' },
    resumeFileSize: { type: Number, default: 0 },
    resumeUpdatedAt: { type: Date },
  },
  { timestamps: true }
);

profileSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('Profile', profileSchema);

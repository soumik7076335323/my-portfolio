const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: 120,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: 300,
    },
    detailedDescription: {
      type: String,
      default: '',
      trim: true,
      maxlength: 6000,
    },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    features: { type: [String], default: [] },
    links: {
      live: { type: String, default: '' },
      github: { type: String, default: '' },
      admin: { type: String, default: '' },
      backend: { type: String, default: '' },
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);

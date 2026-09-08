const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      maxlength: 120,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
      maxlength: 120,
    },
    employmentType: {
      type: String,
      trim: true,
      maxlength: 60,
      default: 'Full-time',
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
      trim: true,
      maxlength: 20,
    },
    endDate: {
      type: String,
      trim: true,
      maxlength: 20,
      default: '',
    },
    description: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);

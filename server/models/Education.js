const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
      maxlength: 140,
    },
    field: { type: String, default: '', trim: true, maxlength: 140 },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true,
      maxlength: 160,
    },
    cgpa: { type: String, default: '', trim: true, maxlength: 20 },
    startYear: { type: String, default: '', trim: true, maxlength: 10 },
    endYear: { type: String, default: '', trim: true, maxlength: 10 },
    description: { type: String, default: '', trim: true, maxlength: 2000 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);

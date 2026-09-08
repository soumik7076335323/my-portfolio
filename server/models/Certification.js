const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Certification name is required'],
      trim: true,
      maxlength: 160,
    },
    issuer: { type: String, default: '', trim: true, maxlength: 120 },
    year: { type: String, default: '', trim: true, maxlength: 10 },
    url: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certification', certificationSchema);

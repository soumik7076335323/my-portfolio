const mongoose = require('mongoose');

/**
 * Singleton document for site-wide settings (SEO, hero strip, footer note).
 */
const siteSettingsSchema = new mongoose.Schema(
  {
    seoTitle: { type: String, default: 'Soumik Adhikary | Full Stack MERN Developer' },
    seoDescription: {
      type: String,
      default:
        'Portfolio of Soumik Adhikary, a Full Stack MERN Developer building scalable, secure and data-driven web applications with React, Node.js, Express and MongoDB.',
    },
    showBuildShipScale: { type: Boolean, default: true },
    buildShipScale: {
      type: [
        {
          label: { type: String, default: '', maxlength: 40 },
          detail: { type: String, default: '', maxlength: 120 },
        },
      ],
      default: [
        { label: 'BUILD', detail: 'React UIs & REST APIs' },
        { label: 'SHIP', detail: 'Tested & integrated releases' },
        { label: 'SCALE', detail: 'Cloud-deployed & data-driven' },
      ],
    },
    footerNote: {
      type: String,
      default: 'Designed & built with the MERN stack.',
      maxlength: 200,
    },
    resumeOpenToWork: { type: Boolean, default: false },
  },
  { timestamps: true }
);

siteSettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

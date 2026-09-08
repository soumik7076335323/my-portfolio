const SiteSettings = require('../models/SiteSettings');

// GET /api/settings (public — only SEO/public presentation fields)
exports.getPublicSettings = async (req, res, next) => {
  try {
    const settings = await SiteSettings.getSingleton();
    res.json({
      success: true,
      data: {
        seoTitle: settings.seoTitle,
        seoDescription: settings.seoDescription,
        showBuildShipScale: settings.showBuildShipScale,
        buildShipScale: settings.buildShipScale,
        footerNote: settings.footerNote,
        resumeOpenToWork: settings.resumeOpenToWork,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/settings (admin)
exports.updateSettings = async (req, res, next) => {
  try {
    const allowed = [
      'seoTitle',
      'seoDescription',
      'showBuildShipScale',
      'buildShipScale',
      'footerNote',
      'resumeOpenToWork',
    ];
    const settings = await SiteSettings.getSingleton();
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) settings[key] = req.body[key];
    });
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

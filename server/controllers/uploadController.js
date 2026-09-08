const Profile = require('../models/Profile');
const { uploadBuffer, deleteAsset, readLocalFile } = require('../services/storageService');

const sanitize = (profile) => {
  const {
    photoUrl,
    photoPublicId,
    photoProvider,
    photoUpdatedAt,
    resumeFileName,
    resumeUrl,
    resumePublicId,
    resumeProvider,
    resumeFileSize,
    resumeUpdatedAt,
    ...rest
  } = profile.toObject();
  return {
    profile: rest,
    photo: { url: photoUrl, publicId: photoPublicId, provider: photoProvider, updatedAt: photoUpdatedAt },
    resume: {
      fileName: resumeFileName,
      url: resumeUrl,
      publicId: resumePublicId,
      provider: resumeProvider,
      fileSize: resumeFileSize,
      updatedAt: resumeUpdatedAt,
    },
  };
};

// POST /api/upload/photo (admin) — multipart field "photo"
exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file received' });
    }
    const profile = await Profile.getSingleton();

    // Delete the previous photo from storage
    await deleteAsset(profile.photoPublicId, profile.photoProvider);

    const result = await uploadBuffer(req.file.buffer, req.file.originalname, 'image');
    profile.photoUrl = result.url;
    profile.photoPublicId = result.publicId;
    profile.photoProvider = result.provider;
    profile.photoUpdatedAt = new Date();
    await profile.save();

    res.json({ success: true, message: 'Profile photo updated', ...sanitize(profile) });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/upload/photo (admin)
exports.deletePhoto = async (req, res, next) => {
  try {
    const profile = await Profile.getSingleton();
    await deleteAsset(profile.photoPublicId, profile.photoProvider);
    profile.photoUrl = '';
    profile.photoPublicId = '';
    profile.photoProvider = '';
    profile.photoUpdatedAt = new Date();
    await profile.save();
    res.json({ success: true, message: 'Profile photo removed', ...sanitize(profile) });
  } catch (err) {
    next(err);
  }
};

// POST /api/upload/resume (admin) — multipart field "resume"
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file received' });
    }
    const profile = await Profile.getSingleton();

    await deleteAsset(profile.resumePublicId, profile.resumeProvider);

    const result = await uploadBuffer(req.file.buffer, req.file.originalname, 'raw');
    profile.resumeFileName = req.file.originalname;
    profile.resumeUrl = '/api/resume/download';
    profile.resumePublicId = result.publicId;
    profile.resumeProvider = result.provider;
    profile.resumeFileSize = result.bytes;
    profile.resumeUpdatedAt = new Date();
    await profile.save();

    res.json({ success: true, message: 'Resume updated', ...sanitize(profile) });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/upload/resume (admin)
exports.deleteResume = async (req, res, next) => {
  try {
    const profile = await Profile.getSingleton();
    await deleteAsset(profile.resumePublicId, profile.resumeProvider);
    profile.resumeFileName = '';
    profile.resumeUrl = '';
    profile.resumePublicId = '';
    profile.resumeProvider = '';
    profile.resumeFileSize = 0;
    profile.resumeUpdatedAt = new Date();
    await profile.save();
    res.json({ success: true, message: 'Resume removed', ...sanitize(profile) });
  } catch (err) {
    next(err);
  }
};

// GET /api/resume/download (public) — streams the current resume PDF
exports.downloadResume = async (req, res, next) => {
  try {
    const profile = await Profile.getSingleton();
    if (!profile.resumePublicId) {
      return res.status(404).json({ success: false, message: 'Resume not available yet' });
    }
    const fileName = profile.resumeFileName || 'resume.pdf';

    if (profile.resumeProvider === 'local') {
      const filePath = readLocalFile(profile.resumePublicId);
      if (!filePath) {
        return res.status(404).json({ success: false, message: 'Resume file is missing on the server' });
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName.replace(/"/g, '')}"`
      );
      return res.sendFile(filePath);
    }

    if (profile.resumeProvider === 'cloudinary') {
      // Cloudinary stores raw PDFs; redirect to the secure CDN URL
      return res.redirect(profile.resumePublicId.includes('http') ? profile.resumePublicId : profile.resumeUrl);
    }

    return res.status(404).json({ success: false, message: 'Resume not configured' });
  } catch (err) {
    next(err);
  }
};

// GET /api/resume (public metadata)
exports.resumeMeta = async (req, res, next) => {
  try {
    const profile = await Profile.getSingleton();
    res.json({
      success: true,
      data: {
        fileName: profile.resumeFileName,
        url: profile.resumeUrl,
        fileSize: profile.resumeFileSize,
        updatedAt: profile.resumeUpdatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

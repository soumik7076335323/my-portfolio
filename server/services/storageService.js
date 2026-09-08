const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { cloudinary, isCloudinaryEnabled } = require('../config/cloudinary');

/**
 * Storage abstraction.
 *  - Cloudinary (production) when CLOUDINARY_* env vars are set.
 *  - Local disk under server/uploads (zero-config fallback for local dev).
 *
 * Public URLs are always root-relative for local files (e.g. /uploads/x.jpg)
 * so the React app can resolve them against its configured API origin.
 */

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

const ensureUploadDir = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

const safeName = (originalName) => {
  const ext = path.extname(originalName || '').toLowerCase();
  const base = path
    .basename(originalName || 'file', ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  const unique = crypto.randomBytes(6).toString('hex');
  return `${Date.now()}-${unique}-${base || 'file'}${ext}`;
};

const uploadBuffer = async (buffer, originalName, resourceType = 'image') => {
  if (isCloudinaryEnabled) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType === 'raw' ? 'raw' : 'image',
          folder: resourceType === 'raw' ? 'portfolio/resume' : 'portfolio/profile',
          public_id: path.basename(originalName, path.extname(originalName))
            .toLowerCase()
            .replace(/[^a-z0-9-_]+/g, '-')
            .slice(0, 60),
          overwrite: false,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            provider: 'cloudinary',
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
          });
        }
      );
      stream.end(buffer);
    });
  }

  // Local disk fallback
  ensureUploadDir();
  const fileName = safeName(originalName);
  const filePath = path.join(UPLOAD_DIR, fileName);
  fs.writeFileSync(filePath, buffer);
  return {
    provider: 'local',
    url: `/uploads/${fileName}`,
    publicId: fileName,
    bytes: buffer.length,
  };
};

const deleteAsset = async (publicId, provider) => {
  if (!publicId) return;
  try {
    if (provider === 'cloudinary' && isCloudinaryEnabled) {
      await cloudinary.uploader.destroy(publicId);
    } else if (provider === 'local') {
      const filePath = path.join(UPLOAD_DIR, path.basename(publicId));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Storage delete failed (${provider}:${publicId}):`, err.message);
  }
};

const readLocalFile = (publicId) => {
  const filePath = path.join(UPLOAD_DIR, path.basename(publicId));
  if (!fs.existsSync(filePath)) return null;
  return filePath;
};

module.exports = { uploadBuffer, deleteAsset, readLocalFile, UPLOAD_DIR };

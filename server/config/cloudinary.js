const cloudinary = require('cloudinary').v2;

/**
 * Cloudinary is optional. When credentials are present, uploads are stored in
 * Cloudinary (recommended for production). Otherwise the API falls back to
 * durable local disk storage under server/uploads.
 */
const isCloudinaryEnabled = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryEnabled) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

module.exports = { cloudinary, isCloudinaryEnabled };

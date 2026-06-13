const cloudinary = require('../config/cloudinary');
const { AppError } = require('../middleware/errorHandler');

const uploadToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `jobportal/${folder}`, resource_type: resourceType },
      (error, result) => {
        if (error) reject(new AppError(error.message, 500));
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };

const multer = require('multer');
const { AppError } = require('./errorHandler');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const allowedDocTypes = ['application/pdf'];

  if (file.fieldname === 'resume' && allowedDocTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (
    ['logo', 'avatar'].includes(file.fieldname) &&
    allowedImageTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new AppError(`Invalid file type for ${file.fieldname}`, 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;

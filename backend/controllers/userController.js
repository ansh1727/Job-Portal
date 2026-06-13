const User = require('../models/User');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const { AppError } = require('../middleware/errorHandler');
const { calculateProfileCompletion } = require('../utils/profileCompletion');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'phone',
      'skills',
      'education',
      'experience',
      'linkedin',
      'github',
      'portfolio',
    ];

    const user = await User.findById(req.user._id);

    if (!user.profile) {
      user.profile = {};
    }

    if (req.body.name) user.name = req.body.name;

    allowedFields.forEach((field) => {
      if (field === 'name') return;
      if (req.body[field] !== undefined) {
        if (['skills', 'education', 'experience'].includes(field)) {
          user.profile[field] =
            typeof req.body[field] === 'string'
              ? JSON.parse(req.body[field])
              : req.body[field];
        } else {
          user.profile[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      if (user.profile.resume?.publicId) {
        await deleteFromCloudinary(user.profile.resume.publicId, 'raw');
      }
      const result = await uploadToCloudinary(req.file.buffer, 'resumes', 'raw');
      user.profile.resume = {
        url: result.secure_url,
        publicId: result.public_id,
        filename: req.file.originalname,
      };
    }

    if (req.files?.avatar?.[0]) {
      if (user.profile.avatar?.publicId) {
        await deleteFromCloudinary(user.profile.avatar.publicId);
      }
      const result = await uploadToCloudinary(req.files.avatar[0].buffer, 'avatars');
      user.profile.avatar = { url: result.secure_url, publicId: result.public_id };
    }

    user.markModified('profile');
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const [totalApplications, savedJobs] = await Promise.all([
      Application.countDocuments({ candidate: req.user._id }),
      SavedJob.countDocuments({ candidate: req.user._id }),
    ]);

    const profileCompletion = calculateProfileCompletion(req.user.profile);

    res.json({
      success: true,
      data: {
        totalApplications,
        savedJobs,
        profileCompletion,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return next(new AppError('User not found', 404));
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

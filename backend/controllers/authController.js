const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { AppError } = require('../middleware/errorHandler');
const { sendTokenResponse, generateAccessToken } = require('../utils/generateToken');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    const allowedRoles = ['candidate', 'recruiter'];
    const userRole = allowedRoles.includes(role) ? role : 'candidate';

    const user = await User.create({ name, email, password, role: userRole });

    await sendEmail({
      to: email,
      subject: 'Welcome to Job Portal',
      html: emailTemplates.welcome(name),
    });

    await sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Account has been deactivated', 403));
    }

    await sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const token = refreshToken || req.cookies?.refreshToken;

    if (!token) {
      return next(new AppError('Refresh token required', 401));
    }

    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) {
      return next(new AppError('Invalid refresh token', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return next(new AppError('User not found', 401));
    }

    const accessToken = generateAccessToken(user._id);

    res.json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    next(new AppError('Invalid or expired refresh token', 401));
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const token = refreshToken || req.cookies?.refreshToken;

    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { AppError } = require('../middleware/errorHandler');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalJobs,
      totalApplications,
      totalCompanies,
      activeJobs,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),
      Job.countDocuments(),
      Application.countDocuments(),
      Company.countDocuments(),
      Job.countDocuments({ isActive: true }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalApplications,
        totalCompanies,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getApplicationTrends = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trends = await Application.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const formatted = trends.map((t) => ({
      month: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
      applications: t.count,
    }));

    res.json({ success: true, trends: formatted });
  } catch (error) {
    next(error);
  }
};

exports.getRecruiterActivity = async (req, res, next) => {
  try {
    const activity = await Job.aggregate([
      {
        $group: {
          _id: '$postedBy',
          jobsPosted: { $sum: 1 },
          totalApplications: { $sum: '$applicationsCount' },
        },
      },
      { $sort: { jobsPosted: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'recruiter',
        },
      },
      { $unwind: '$recruiter' },
      {
        $project: {
          name: '$recruiter.name',
          email: '$recruiter.email',
          jobsPosted: 1,
          totalApplications: 1,
        },
      },
    ]);

    res.json({ success: true, activity });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).select('-password').skip(skip).limit(limit).sort('-createdAt'),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      users,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    if (user.role === 'admin') return next(new AppError('Cannot deactivate admin', 403));

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.manageJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('company', 'companyName')
        .populate('postedBy', 'name email')
        .skip(skip)
        .limit(limit)
        .sort('-createdAt'),
      Job.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

exports.manageCompanies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      Company.find()
        .populate('recruiter', 'name email')
        .skip(skip)
        .limit(limit)
        .sort('-createdAt'),
      Company.countDocuments(),
    ]);

    res.json({
      success: true,
      count: companies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      companies,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleCompanyStatus = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return next(new AppError('Company not found', 404));

    company.isActive = !company.isActive;
    await company.save();

    res.json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

exports.toggleJobStatus = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new AppError('Job not found', 404));

    job.isActive = !job.isActive;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

exports.getUserGrowth = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const growth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            role: '$role',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({ success: true, growth });
  } catch (error) {
    next(error);
  }
};

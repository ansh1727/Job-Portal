const Job = require('../models/Job');
const Company = require('../models/Company');
const { AppError } = require('../middleware/errorHandler');

exports.createJob = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiter: req.user._id });
    if (!company) {
      return next(new AppError('Create a company profile before posting jobs', 400));
    }

    const job = await Job.create({
      ...req.body,
      company: company._id,
      postedBy: req.user._id,
      skills: typeof req.body.skills === 'string' ? JSON.parse(req.body.skills) : req.body.skills,
    });

    const populatedJob = await Job.findById(job._id).populate('company');
    res.status(201).json({ success: true, job: populatedJob });
  } catch (error) {
    next(error);
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    let query = Job.find({ isActive: true }).populate('company', 'companyName logo location industry');

    if (req.query.keyword) {
      query = query.find({
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { skills: { $regex: req.query.keyword, $options: 'i' } },
        ],
      });
    }

    const filter = { isActive: true };
    if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };
    if (req.query.jobType) filter.jobType = req.query.jobType;
    if (req.query['salary.min']) filter['salary.min'] = { $gte: parseInt(req.query['salary.min']) };
    if (req.query['salary.max']) filter['salary.max'] = { $lte: parseInt(req.query['salary.max']) };
    if (req.query['experienceRequired.min']) {
      filter['experienceRequired.min'] = { $lte: parseInt(req.query['experienceRequired.min']) };
    }

    query = Job.find(filter).populate('company', 'companyName logo location industry');

    if (req.query.keyword) {
      query = query.find({
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { skills: { $regex: req.query.keyword, $options: 'i' } },
        ],
      });
    }

    if (req.query.company) {
      const companies = await Company.find({
        companyName: { $regex: req.query.company, $options: 'i' },
      }).select('_id');
      query = query.find({ company: { $in: companies.map((c) => c._id) } });
    }

    const total = await Job.countDocuments(query.getFilter());

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || '-createdAt';
    const jobs = await query.sort(sort).skip(skip).limit(limit);

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

exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('postedBy', 'name email');
    if (!job) return next(new AppError('Job not found', 404));
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

exports.getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate('company')
      .sort('-createdAt');
    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return next(new AppError('Job not found', 404));

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this job', 403));
    }

    if (req.body.skills && typeof req.body.skills === 'string') {
      req.body.skills = JSON.parse(req.body.skills);
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('company');

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new AppError('Job not found', 404));

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this job', 403));
    }

    job.isActive = false;
    await job.save();

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

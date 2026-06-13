const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const { AppError } = require('../middleware/errorHandler');

exports.saveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || !job.isActive) return next(new AppError('Job not found', 404));

    const existing = await SavedJob.findOne({
      candidate: req.user._id,
      job: job._id,
    });
    if (existing) return next(new AppError('Job already saved', 400));

    const savedJob = await SavedJob.create({
      candidate: req.user._id,
      job: job._id,
    });

    const populated = await SavedJob.findById(savedJob._id).populate({
      path: 'job',
      populate: { path: 'company', select: 'companyName logo location' },
    });

    res.status(201).json({ success: true, savedJob: populated });
  } catch (error) {
    next(error);
  }
};

exports.getSavedJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [savedJobs, total] = await Promise.all([
      SavedJob.find({ candidate: req.user._id })
        .populate({
          path: 'job',
          populate: { path: 'company', select: 'companyName logo location industry' },
        })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      SavedJob.countDocuments({ candidate: req.user._id }),
    ]);

    res.json({
      success: true,
      count: savedJobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeSavedJob = async (req, res, next) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({
      candidate: req.user._id,
      job: req.params.jobId,
    });

    if (!savedJob) return next(new AppError('Saved job not found', 404));

    res.json({ success: true, message: 'Job removed from saved list' });
  } catch (error) {
    next(error);
  }
};

exports.checkSaved = async (req, res, next) => {
  try {
    const saved = await SavedJob.findOne({
      candidate: req.user._id,
      job: req.params.jobId,
    });

    res.json({ success: true, isSaved: !!saved });
  } catch (error) {
    next(error);
  }
};

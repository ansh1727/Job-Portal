const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

exports.applyForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('company');
    if (!job || !job.isActive) return next(new AppError('Job not found', 404));

    const existing = await Application.findOne({
      candidate: req.user._id,
      job: job._id,
    });
    if (existing) return next(new AppError('You have already applied for this job', 400));

    let resume = req.user.profile?.resume;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'resumes', 'raw');
      resume = {
        url: result.secure_url,
        publicId: result.public_id,
        filename: req.file.originalname,
      };
    }

    if (!resume?.url) {
      return next(new AppError('Please upload a resume before applying', 400));
    }

    const application = await Application.create({
      candidate: req.user._id,
      job: job._id,
      resume,
      coverLetter: req.body.coverLetter,
      statusHistory: [{ status: 'applied', updatedBy: req.user._id }],
    });

    await Job.findByIdAndUpdate(job._id, { $inc: { applicationsCount: 1 } });

    const recruiter = await User.findById(job.postedBy);

    await Promise.all([
      sendEmail({
        to: req.user.email,
        subject: 'Application Submitted',
        html: emailTemplates.applicationSubmitted(req.user.name, job.title),
      }),
      recruiter &&
        sendEmail({
          to: recruiter.email,
          subject: 'New Application Received',
          html: emailTemplates.newApplication(recruiter.name, req.user.name, job.title),
        }),
    ]);

    const populated = await Application.findById(application._id)
      .populate('job')
      .populate('candidate', 'name email profile');

    res.status(201).json({ success: true, application: populated });
  } catch (error) {
    next(error);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { candidate: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate({
          path: 'job',
          populate: { path: 'company', select: 'companyName logo' },
        })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Application.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: applications.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return next(new AppError('Job not found', 404));

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }

    const filter = { job: job._id };
    if (req.query.status) filter.status = req.query.status;

    const applications = await Application.find(filter)
      .populate('candidate', 'name email profile')
      .sort('-createdAt');

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = [
      'applied',
      'under_review',
      'shortlisted',
      'interview_scheduled',
      'rejected',
      'hired',
    ];

    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('candidate', 'name email');

    if (!application) return next(new AppError('Application not found', 404));

    const job = await Job.findById(application.job._id);
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }

    application.status = status;
    application.statusHistory.push({
      status,
      note,
      updatedBy: req.user._id,
    });

    await application.save();

    await sendEmail({
      to: application.candidate.email,
      subject: 'Application Status Update',
      html: emailTemplates.statusUpdate(
        application.candidate.name,
        application.job.title,
        status
      ),
    });

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email profile')
      .populate({ path: 'job', populate: { path: 'company' } });

    if (!application) return next(new AppError('Application not found', 404));

    const isOwner = application.candidate._id.toString() === req.user._id.toString();
    const job = await Job.findById(application.job._id);
    const isRecruiter = job.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isRecruiter && !isAdmin) {
      return next(new AppError('Not authorized', 403));
    }

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

const Company = require('../models/Company');
const Job = require('../models/Job');
const { AppError } = require('../middleware/errorHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

exports.createCompany = async (req, res, next) => {
  try {
    const existing = await Company.findOne({ recruiter: req.user._id });
    if (existing) {
      return next(new AppError('You already have a company profile', 400));
    }

    const companyData = {
      recruiter: req.user._id,
      companyName: req.body.companyName,
      website: req.body.website,
      description: req.body.description,
      industry: req.body.industry,
      location: req.body.location,
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'logos');
      companyData.logo = { url: result.secure_url, publicId: result.public_id };
    }

    const company = await Company.create(companyData);
    res.status(201).json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

exports.getMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiter: req.user._id });
    if (!company) return next(new AppError('Company profile not found', 404));
    res.json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiter: req.user._id });
    if (!company) return next(new AppError('Company profile not found', 404));

    ['companyName', 'website', 'description', 'industry', 'location'].forEach((field) => {
      if (req.body[field] !== undefined) company[field] = req.body[field];
    });

    if (req.file) {
      if (company.logo?.publicId) {
        await deleteFromCloudinary(company.logo.publicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'logos');
      company.logo = { url: result.secure_url, publicId: result.public_id };
    }

    await company.save();
    res.json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('recruiter', 'name email');
    if (!company) return next(new AppError('Company not found', 404));
    res.json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

exports.getAllCompanies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };
    if (req.query.industry) filter.industry = { $regex: req.query.industry, $options: 'i' };
    if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };

    const [companies, total] = await Promise.all([
      Company.find(filter).skip(skip).limit(limit).sort('-createdAt'),
      Company.countDocuments(filter),
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

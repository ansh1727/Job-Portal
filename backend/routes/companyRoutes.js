const express = require('express');
const upload = require('../middleware/upload');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  createCompany,
  getMyCompany,
  updateCompany,
  getCompany,
  getAllCompanies,
} = require('../controllers/companyController');

const router = express.Router();

router.get('/', getAllCompanies);
router.get('/my/company', protect, authorize('recruiter'), getMyCompany);

router.put(
  '/my/company',
  protect,
  authorize('recruiter'),
  upload.single('logo'),
  updateCompany
);

router.post(
  '/',
  protect,
  authorize('recruiter'),
  upload.single('logo'),
  [
    body('companyName').trim().notEmpty().withMessage('Company name is required'),
  ],
  validate,
  createCompany
);

router.get('/:id', getCompany);

module.exports = router;

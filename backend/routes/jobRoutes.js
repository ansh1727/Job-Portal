const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  createJob,
  getJobs,
  getJob,
  getMyJobs,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');

const router = express.Router();

router.get('/', getJobs);
router.get('/my/jobs', protect, authorize('recruiter'), getMyJobs);
router.get('/:id', getJob);

router.post(
  '/',
  protect,
  authorize('recruiter'),
  [
    body('title').trim().notEmpty().withMessage('Job title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  validate,
  createJob
);

router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;

const express = require('express');
const upload = require('../middleware/upload');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getApplication,
} = require('../controllers/applicationController');

const router = express.Router();

router.post(
  '/jobs/:jobId/apply',
  protect,
  authorize('candidate'),
  upload.single('resume'),
  applyForJob
);

router.get('/my', protect, authorize('candidate'), getMyApplications);
router.get('/jobs/:jobId/applicants', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.get('/:id', protect, getApplication);

router.put(
  '/:id/status',
  protect,
  authorize('recruiter', 'admin'),
  [
    body('status')
      .isIn([
        'applied',
        'under_review',
        'shortlisted',
        'interview_scheduled',
        'rejected',
        'hired',
      ])
      .withMessage('Invalid status'),
  ],
  validate,
  updateApplicationStatus
);

module.exports = router;

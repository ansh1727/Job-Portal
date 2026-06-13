const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  saveJob,
  getSavedJobs,
  removeSavedJob,
  checkSaved,
} = require('../controllers/savedJobController');

const router = express.Router();

router.get('/', protect, authorize('candidate'), getSavedJobs);
router.get('/:jobId/check', protect, authorize('candidate'), checkSaved);
router.post('/:jobId', protect, authorize('candidate'), saveJob);
router.delete('/:jobId', protect, authorize('candidate'), removeSavedJob);

module.exports = router;

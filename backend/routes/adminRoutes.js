const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getApplicationTrends,
  getRecruiterActivity,
  getUsers,
  toggleUserStatus,
  manageJobs,
  manageCompanies,
  toggleCompanyStatus,
  toggleJobStatus,
  getUserGrowth,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/analytics/applications', getApplicationTrends);
router.get('/analytics/recruiters', getRecruiterActivity);
router.get('/analytics/users', getUserGrowth);
router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/jobs', manageJobs);
router.put('/jobs/:id/toggle-status', toggleJobStatus);
router.get('/companies', manageCompanies);
router.put('/companies/:id/toggle-status', toggleCompanyStatus);

module.exports = router;

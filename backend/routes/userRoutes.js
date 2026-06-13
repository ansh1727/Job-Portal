const express = require('express');
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const {
  updateProfile,
  getDashboard,
  getUserById,
} = require('../controllers/userController');

const router = express.Router();

router.put(
  '/profile',
  protect,
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
  ]),
  updateProfile
);

router.get('/dashboard', protect, authorize('candidate'), getDashboard);
router.get('/:id', protect, getUserById);

module.exports = router;

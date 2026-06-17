const express = require('express');
const router = express.Router();
const {
  getNotices, getAllNotices, getNotice,
  createNotice, updateNotice, deleteNotice,
} = require('../controllers/notices.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public
router.get('/', getNotices);

// Admin
router.get('/admin/all', protect, authorize('admin', 'superadmin'), getAllNotices);
router.get('/:id', protect, authorize('admin', 'superadmin'), getNotice);
router.post('/', protect, authorize('admin', 'superadmin'), createNotice);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateNotice);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteNotice);

module.exports = router;

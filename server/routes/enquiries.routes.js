const express = require('express');
const router = express.Router();
const {
  createEnquiry, getEnquiries, getEnquiry, updateEnquiry, deleteEnquiry, exportCSV,
} = require('../controllers/enquiries.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public
router.post('/', createEnquiry);

// Admin
router.get('/', protect, authorize('admin', 'superadmin'), getEnquiries);
router.get('/export/csv', protect, authorize('admin', 'superadmin'), exportCSV);
router.get('/:id', protect, authorize('admin', 'superadmin'), getEnquiry);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateEnquiry);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteEnquiry);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAll, getAllAdmin, getOne, create, update, remove,
} = require('../controllers/universities.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadLogo } = require('../config/cloudinary');

// Public
router.get('/', getAll);

// Admin
router.get('/admin/all', protect, authorize('admin', 'superadmin'), getAllAdmin);
router.get('/:id', getOne);
router.post('/', protect, authorize('admin', 'superadmin'), uploadLogo.single('logo'), create);
router.put('/:id', protect, authorize('admin', 'superadmin'), uploadLogo.single('logo'), update);
router.delete('/:id', protect, authorize('admin', 'superadmin'), remove);

module.exports = router;

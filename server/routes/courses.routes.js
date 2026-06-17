const express = require('express');
const router = express.Router();
const {
  getAll, getAllAdmin, getOne, create, update, remove, getCategories,
} = require('../controllers/courses.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public
router.get('/', getAll);
router.get('/categories', getCategories);

// Admin
router.get('/admin/all', protect, authorize('admin', 'superadmin'), getAllAdmin);
router.get('/:id', getOne);
router.post('/', protect, authorize('admin', 'superadmin'), create);
router.put('/:id', protect, authorize('admin', 'superadmin'), update);
router.delete('/:id', protect, authorize('admin', 'superadmin'), remove);

module.exports = router;

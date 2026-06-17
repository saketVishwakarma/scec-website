const express = require('express');
const router = express.Router();
const {
  getSlides, getAllSlides, createSlide, updateSlide, reorderSlides, deleteSlide,
} = require('../controllers/slides.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadImage } = require('../config/cloudinary');

// Public
router.get('/', getSlides);

// Admin
router.get('/admin/all', protect, authorize('admin', 'superadmin'), getAllSlides);
router.post('/', protect, authorize('admin', 'superadmin'), uploadImage.single('image'), createSlide);
router.put('/reorder', protect, authorize('admin', 'superadmin'), reorderSlides);
router.put('/:id', protect, authorize('admin', 'superadmin'), uploadImage.single('image'), updateSlide);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteSlide);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getGallery, getCategories, uploadImages, updateImage, deleteImage, bulkDelete,
} = require('../controllers/gallery.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadImage } = require('../config/cloudinary');

// Public
router.get('/', getGallery);
router.get('/categories', getCategories);

// Admin
router.post('/', protect, authorize('admin', 'superadmin'), uploadImage.array('images', 10), uploadImages);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateImage);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteImage);
router.post('/bulk-delete', protect, authorize('admin', 'superadmin'), bulkDelete);

module.exports = router;

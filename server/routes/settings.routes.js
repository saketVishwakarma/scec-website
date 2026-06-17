const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadLogo } = require('../config/cloudinary');

// Public
router.get('/', getSettings);

// Admin
router.put('/', protect, authorize('admin', 'superadmin'), uploadLogo.single('logo'), updateSettings);

module.exports = router;

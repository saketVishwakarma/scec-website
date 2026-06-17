const SiteSettings = require('../models/SiteSettings');
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get site settings (public)
exports.getSettings = async (req, res) => {
  const settings = await SiteSettings.getSettings();
  res.status(200).json({ success: true, data: settings });
};

// @desc    Update site settings
exports.updateSettings = async (req, res) => {
  const settings = await SiteSettings.getSettings();

  if (req.file) {
    if (settings.logoCloudinaryId) {
      await cloudinary.uploader.destroy(settings.logoCloudinaryId).catch(() => {});
    }
    const { url, public_id } = await uploadToCloudinary(req.file.buffer, 'scec/logos', {
      transformation: [{ width: 400, crop: 'limit', quality: 'auto' }],
    });
    settings.logoUrl          = url;
    settings.logoCloudinaryId = public_id;
  }

  const allowedFields = [
    'siteName', 'tagline', 'established', 'cinNumber', 'companyAct',
    'phone', 'email', 'address',
    'facebook', 'instagram', 'youtube', 'twitter',
    'admissionBanner', 'directorName', 'directorRole', 'directorMessage',
    'mission', 'vision',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) settings[field] = req.body[field];
  });

  await settings.save();
  res.status(200).json({ success: true, data: settings });
};

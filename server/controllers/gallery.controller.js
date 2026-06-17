const Gallery = require('../models/Gallery');
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get all gallery images (public)
exports.getGallery = async (req, res) => {
  const query = {};
  if (req.query.category) query.category = req.query.category;
  const images = await Gallery.find(query).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: images.length, data: images });
};

// @desc    Get distinct categories
exports.getCategories = async (req, res) => {
  const categories = await Gallery.distinct('category');
  res.status(200).json({ success: true, data: categories });
};

// @desc    Upload one or more images
exports.uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Please upload at least one image' });
  }

  const uploads = await Promise.all(
    req.files.map((file) => uploadToCloudinary(file.buffer, 'scec/gallery'))
  );

  const docs = uploads.map(({ url, public_id }) => ({
    imageUrl:     url,
    cloudinaryId: public_id,
    caption:      req.body.caption  || '',
    category:     req.body.category || 'General',
  }));

  const created = await Gallery.insertMany(docs);
  res.status(201).json({ success: true, count: created.length, data: created });
};

// @desc    Update image caption/category
exports.updateImage = async (req, res) => {
  const image = await Gallery.findByIdAndUpdate(
    req.params.id,
    { caption: req.body.caption, category: req.body.category },
    { new: true, runValidators: true }
  );
  if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
  res.status(200).json({ success: true, data: image });
};

// @desc    Delete single image
exports.deleteImage = async (req, res) => {
  const image = await Gallery.findById(req.params.id);
  if (!image) return res.status(404).json({ success: false, message: 'Image not found' });

  await cloudinary.uploader.destroy(image.cloudinaryId).catch(() => {});
  await image.deleteOne();
  res.status(200).json({ success: true, message: 'Image deleted', data: {} });
};

// @desc    Bulk delete
exports.bulkDelete = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'ids array is required' });
  }
  const images = await Gallery.find({ _id: { $in: ids } });
  await Promise.all(images.map((img) => cloudinary.uploader.destroy(img.cloudinaryId).catch(() => {})));
  await Gallery.deleteMany({ _id: { $in: ids } });
  res.status(200).json({ success: true, message: `${images.length} images deleted`, data: {} });
};

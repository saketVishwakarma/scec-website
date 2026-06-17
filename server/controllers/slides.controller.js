const Slide = require('../models/Slide');
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get active slides (public)
exports.getSlides = async (req, res) => {
  const slides = await Slide.getActive();
  res.status(200).json({ success: true, count: slides.length, data: slides });
};

// @desc    Get all slides (admin)
exports.getAllSlides = async (req, res) => {
  const slides = await Slide.find().sort({ order: 1 });
  res.status(200).json({ success: true, count: slides.length, data: slides });
};

// @desc    Create slide
exports.createSlide = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Slide image is required' });
  }

  const { url, public_id } = await uploadToCloudinary(req.file.buffer, 'scec/slides');

  const lastSlide = await Slide.findOne().sort({ order: -1 });
  const order = lastSlide ? lastSlide.order + 1 : 0;

  const slide = await Slide.create({
    imageUrl:     url,
    cloudinaryId: public_id,
    title:        req.body.title    || '',
    subtitle:     req.body.subtitle || '',
    linkUrl:      req.body.linkUrl  || '',
    isActive:     req.body.isActive !== 'false',
    order,
  });

  res.status(201).json({ success: true, data: slide });
};

// @desc    Update slide
exports.updateSlide = async (req, res) => {
  const slide = await Slide.findById(req.params.id);
  if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });

  if (req.file) {
    await cloudinary.uploader.destroy(slide.cloudinaryId).catch(() => {});
    const { url, public_id } = await uploadToCloudinary(req.file.buffer, 'scec/slides');
    slide.imageUrl     = url;
    slide.cloudinaryId = public_id;
  }

  slide.title    = req.body.title    ?? slide.title;
  slide.subtitle = req.body.subtitle ?? slide.subtitle;
  slide.linkUrl  = req.body.linkUrl  ?? slide.linkUrl;
  if (req.body.isActive !== undefined) {
    slide.isActive = req.body.isActive === 'true' || req.body.isActive === true;
  }

  await slide.save();
  res.status(200).json({ success: true, data: slide });
};

// @desc    Reorder slides
exports.reorderSlides = async (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).json({ success: false, message: 'order must be an array' });
  }
  await Promise.all(
    order.map(({ id, order: pos }) => Slide.findByIdAndUpdate(id, { order: pos }))
  );
  const slides = await Slide.find().sort({ order: 1 });
  res.status(200).json({ success: true, data: slides });
};

// @desc    Delete slide
exports.deleteSlide = async (req, res) => {
  const slide = await Slide.findById(req.params.id);
  if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });

  await cloudinary.uploader.destroy(slide.cloudinaryId).catch(() => {});
  await slide.deleteOne();
  res.status(200).json({ success: true, message: 'Slide deleted', data: {} });
};

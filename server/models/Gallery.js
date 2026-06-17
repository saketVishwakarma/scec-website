const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  imageUrl:     { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  caption:      { type: String, trim: true, default: '' },
  category:     { type: String, trim: true, default: 'General' }, // Events, Campus, Convocation...
}, { timestamps: true });

gallerySchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Gallery', gallerySchema);

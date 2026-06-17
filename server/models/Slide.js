const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  imageUrl:     { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  title:        { type: String, trim: true, maxlength: 150 },
  subtitle:     { type: String, trim: true, maxlength: 300 },
  linkUrl:      { type: String, trim: true, default: '' },
  order:        { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

slideSchema.statics.getActive = function () {
  return this.find({ isActive: true }).sort({ order: 1 });
};

module.exports = mongoose.model('Slide', slideSchema);

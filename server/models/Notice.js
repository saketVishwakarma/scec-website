const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true, maxlength: 200 },
  body:     { type: String, required: true, trim: true },
  category: { type: String, trim: true, default: 'General' },
  isActive: { type: Boolean, default: true },
  pinned:   { type: Boolean, default: false },
  expiresAt:{ type: Date },
}, { timestamps: true });

// Auto-deactivate expired notices
noticeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Only return active & non-expired notices by default
noticeSchema.statics.getActive = function () {
  return this.find({
    isActive: true,
    $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
  }).sort({ pinned: -1, createdAt: -1 });
};

module.exports = mongoose.model('Notice', noticeSchema);

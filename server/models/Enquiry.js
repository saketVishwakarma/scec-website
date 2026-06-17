const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true, maxlength: 100 },
  email:   { type: String, required: true, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  phone:   { type: String, required: true, trim: true, maxlength: 20 },
  course:  { type: String, trim: true, default: '' },
  message: { type: String, trim: true, maxlength: 2000, default: '' },
  status:  { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' },
  reply:   { type: String, trim: true, default: '' },
  repliedAt: { type: Date },
}, { timestamps: { createdAt: 'submittedAt', updatedAt: true } });

enquirySchema.index({ status: 1, submittedAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);

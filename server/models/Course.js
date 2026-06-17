const mongoose = require('mongoose');

const COURSE_CATEGORIES = [
  'Management', 'Computer', 'Science', 'Commerce',
  'Law', 'Medical', 'Education', 'Agriculture', 'Industrial', 'Other',
];

const courseSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 150 },
  category:    { type: String, enum: COURSE_CATEGORIES, default: 'Other' },
  duration:    { type: String, trim: true, default: '' },     // e.g. "3 Years"
  level:       { type: String, trim: true, default: '' },     // e.g. "Bachelor", "Diploma"
  university:  { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

courseSchema.index({ name: 'text', description: 'text' });

courseSchema.statics.CATEGORIES = COURSE_CATEGORIES;

module.exports = mongoose.model('Course', courseSchema);

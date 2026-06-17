const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true, maxlength: 200 },
  shortName:       { type: String, trim: true, maxlength: 20 },
  logoUrl:         { type: String, default: '' },
  cloudinaryId:    { type: String, default: '' },
  location:        { type: String, trim: true, default: '' },
  website:         { type: String, trim: true, default: '' },
  affiliationType: { type: String, enum: ['Private', 'State', 'Central', 'Deemed', 'Autonomous'], default: 'Private' },
  programs:        [{ type: String, trim: true }],
  isActive:        { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('University', universitySchema);

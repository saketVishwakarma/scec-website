const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true, maxlength: 200 },
  address:      { type: String, required: true, trim: true },
  city:         { type: String, trim: true, default: '' },
  phone:        { type: String, trim: true, default: '' },
  email:        { type: String, trim: true, lowercase: true, default: '' },
  mapEmbedUrl:  { type: String, trim: true, default: '' },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Center', centerSchema);

const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  key:             { type: String, default: 'global', unique: true },

  // General
  siteName:        { type: String, default: 'SCEC Allahabad' },
  tagline:         { type: String, default: 'SCEC Allahabad' },
  logoUrl:         { type: String, default: '' },
  established:     { type: String, default: '08-May-2009' },
  cinNumber:       { type: String, default: '' },
  companyAct:      { type: String, default: 'Companies Act 1956, Government of India' },

  // Contact
  phone:           { type: String, default: '' },
  email:           { type: String, default: '' },
  address:         { type: String, default: '' },

  // Social
  facebook:        { type: String, default: '' },
  instagram:       { type: String, default: '' },
  youtube:         { type: String, default: '' },
  twitter:         { type: String, default: '' },

  // Content blocks
  admissionBanner: { type: String, default: 'Admissions Open 2025–26' },
  directorName:    { type: String, default: '' },
  directorRole:    { type: String, default: 'Director' },
  directorMessage: { type: String, default: '' },
  mission:         { type: String, default: '' },
  vision:          { type: String, default: '' },
}, { timestamps: true });

// Singleton getter — creates default doc if none exists
siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne({ key: 'global' });
  if (!settings) {
    settings = await this.create({ key: 'global' });
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

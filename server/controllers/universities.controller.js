const University = require('../models/University');
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary');
const createCrudController = require('./crudFactory');

const base = createCrudController(University, {
  searchFields: ['name', 'shortName', 'location'],
  filterFields: ['affiliationType'],
  defaultSort: { name: 1 },
});

module.exports = {
  ...base,

  create: async (req, res) => {
    const data = { ...req.body };
    if (req.file) {
      const { url, public_id } = await uploadToCloudinary(req.file.buffer, 'scec/logos', {
        transformation: [{ width: 400, crop: 'limit', quality: 'auto' }],
      });
      data.logoUrl      = url;
      data.cloudinaryId = public_id;
    }
    if (typeof data.programs === 'string') {
      data.programs = data.programs.split(',').map((p) => p.trim()).filter(Boolean);
    }
    const university = await University.create(data);
    res.status(201).json({ success: true, data: university });
  },

  update: async (req, res) => {
    const university = await University.findById(req.params.id);
    if (!university) return res.status(404).json({ success: false, message: 'University not found' });

    if (req.file) {
      if (university.cloudinaryId) {
        await cloudinary.uploader.destroy(university.cloudinaryId).catch(() => {});
      }
      const { url, public_id } = await uploadToCloudinary(req.file.buffer, 'scec/logos', {
        transformation: [{ width: 400, crop: 'limit', quality: 'auto' }],
      });
      university.logoUrl      = url;
      university.cloudinaryId = public_id;
    }

    const data = { ...req.body };
    if (typeof data.programs === 'string') {
      data.programs = data.programs.split(',').map((p) => p.trim()).filter(Boolean);
    }
    Object.assign(university, data);
    await university.save();
    res.status(200).json({ success: true, data: university });
  },

  remove: async (req, res) => {
    const university = await University.findById(req.params.id);
    if (!university) return res.status(404).json({ success: false, message: 'University not found' });

    if (university.cloudinaryId) {
      await cloudinary.uploader.destroy(university.cloudinaryId).catch(() => {});
    }
    await university.deleteOne();
    res.status(200).json({ success: true, message: 'Deleted successfully', data: {} });
  },
};

const Notice = require('../models/Notice');

// @desc    Get all active notices (public)
// @route   GET /api/notices
// @access  Public
exports.getNotices = async (req, res) => {
  const notices = await Notice.getActive();
  res.status(200).json({ success: true, count: notices.length, data: notices });
};

// @desc    Get ALL notices including inactive/expired (admin)
// @route   GET /api/notices/admin/all
// @access  Private
exports.getAllNotices = async (req, res) => {
  const notices = await Notice.find().sort({ pinned: -1, createdAt: -1 });
  res.status(200).json({ success: true, count: notices.length, data: notices });
};

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Private
exports.getNotice = async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    return res.status(404).json({ success: false, message: 'Notice not found' });
  }
  res.status(200).json({ success: true, data: notice });
};

// @desc    Create notice
// @route   POST /api/notices
// @access  Private (admin)
exports.createNotice = async (req, res) => {
  const notice = await Notice.create(req.body);
  res.status(201).json({ success: true, data: notice });
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private (admin)
exports.updateNotice = async (req, res) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!notice) {
    return res.status(404).json({ success: false, message: 'Notice not found' });
  }
  res.status(200).json({ success: true, data: notice });
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private (admin)
exports.deleteNotice = async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) {
    return res.status(404).json({ success: false, message: 'Notice not found' });
  }
  res.status(200).json({ success: true, message: 'Notice deleted', data: {} });
};

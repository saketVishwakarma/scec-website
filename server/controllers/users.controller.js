const User = require('../models/User');

// @desc    Get all admin users
// @route   GET /api/users
// @access  Private (superadmin)
exports.getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, data: users });
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (superadmin)
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(200).json({ success: true, data: user });
};

// @desc    Create admin user
// @route   POST /api/users
// @access  Private (superadmin)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'A user with this email already exists' });
  }

  const user = await User.create({
    name, email, password,
    role: role === 'superadmin' ? 'superadmin' : 'admin',
  });

  res.status(201).json({ success: true, data: user });
};

// @desc    Update user (name, role, isActive — not password)
// @route   PUT /api/users/:id
// @access  Private (superadmin)
exports.updateUser = async (req, res) => {
  const { name, role, isActive, avatar } = req.body;

  // Prevent superadmin from demoting/deactivating themselves
  if (req.params.id === req.user.id.toString() && (isActive === false || role === 'admin')) {
    return res.status(400).json({ success: false, message: 'You cannot deactivate or demote your own account' });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { ...(name && { name }), ...(role && { role }), ...(isActive !== undefined && { isActive }), ...(avatar && { avatar }) },
    { new: true, runValidators: true }
  );

  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(200).json({ success: true, data: user });
};

// @desc    Reset another user's password (superadmin only)
// @route   PUT /api/users/:id/reset-password
// @access  Private (superadmin)
exports.resetUserPassword = async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password reset successfully' });
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (superadmin)
exports.deleteUser = async (req, res) => {
  if (req.params.id === req.user.id.toString()) {
    return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  res.status(200).json({ success: true, message: 'User deleted', data: {} });
};

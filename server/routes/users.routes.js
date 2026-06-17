const express = require('express');
const router = express.Router();
const {
  getUsers, getUser, createUser, updateUser, resetUserPassword, deleteUser,
} = require('../controllers/users.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require superadmin
router.use(protect, authorize('superadmin'));

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.put('/:id/reset-password', resetUserPassword);
router.delete('/:id', deleteUser);

module.exports = router;

const jwt = require('jsonwebtoken');

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const isProd = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    expires:  new Date(Date.now() + (Number(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure:   isProd,           // true in production (HTTPS only)
    sameSite: isProd ? 'none' : 'lax',  // 'none' required for cross-domain cookies
  };

  res.status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id:     user._id,
        name:   user.name,
        email:  user.email,
        role:   user.role,
        avatar: user.avatar,
      },
    });
};

module.exports = sendTokenResponse;
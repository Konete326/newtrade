const { asyncHandler } = require('../utils/asyncHandler');
const authBusiness = require('../services/authBusinessService');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authBusiness.login(email, password);
  res.json({ success: true, message: 'Login successful', data: result });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authBusiness.refresh(refreshToken);
  res.json({ success: true, message: 'Token refreshed', data: result });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  await authBusiness.logout(req.user.userId, token);
  res.json({ success: true, message: 'Logged out successfully', data: null });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authBusiness.getProfile(req.user.userId);
  res.json({ success: true, message: 'Profile fetched', data: user });
});

module.exports = { login, refresh, logout, getMe };

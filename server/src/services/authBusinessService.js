const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getUserModel } = require('../services/authService');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('./DatabaseManager');
const notificationService = require('./notificationService');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, companyId: user.companyId, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
  const refreshToken = crypto.randomBytes(64).toString('hex');
  return { accessToken, refreshToken };
};

const login = async (email, password) => {
  const User = await getUserModel();
  const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false, isActive: true });
  if (!user) throw new AppError('Invalid email or password.', 401);
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid email or password.', 401);
  const tokens = generateTokens(user);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  user.refreshTokens = user.refreshTokens.filter((t) => t.expiresAt > new Date());
  user.refreshTokens.push({ token: tokens.refreshToken, expiresAt });
  user.lastLogin = new Date();
  await user.save();
  // Fire-and-forget login notification (don't block auth)
  DatabaseManager.getConnection(user.companyId).then(() => {
    notificationService.notifyLogin(user).catch(() => {});
  }).catch(() => {});
  return { user: user.toJSON(), ...tokens };
};

const refresh = async (token) => {
  const User = await getUserModel();
  const user = await User.findOne({ 'refreshTokens.token': token, isDeleted: false, isActive: true });
  if (!user) throw new AppError('Invalid refresh token.', 401);
  const stored = user.refreshTokens.find((t) => t.token === token);
  if (!stored || stored.expiresAt < new Date()) throw new AppError('Refresh token expired.', 401);
  user.refreshTokens = user.refreshTokens.filter((t) => t.token !== token);
  const tokens = generateTokens(user);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  user.refreshTokens.push({ token: tokens.refreshToken, expiresAt });
  await user.save();
  return { user: user.toJSON(), ...tokens };
};

const logout = async (userId, token) => {
  const User = await getUserModel();
  const user = await User.findById(userId);
  await User.findByIdAndUpdate(userId, { $pull: { refreshTokens: { token } } });
  // Fire-and-forget logout notification
  if (user) {
    DatabaseManager.getConnection(user.companyId).then(() => {
      notificationService.notifyLogout(user).catch(() => {});
    }).catch(() => {});
  }
};

const getProfile = async (userId) => {
  const User = await getUserModel();
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found.', 404);
  return user.toJSON();
};

module.exports = { login, refresh, logout, getProfile };


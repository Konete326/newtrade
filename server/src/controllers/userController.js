const { getUserModel, getTenantModel } = require('../services/authService');
const { AppError } = require('../middleware/errorHandler');
const { asyncHandler } = require('../utils/asyncHandler');

const getUsers = asyncHandler(async (req, res) => {
  const User = await getUserModel();
  const { page = 1, limit = 20, search } = req.query;
  const query = { companyId: req.companyId, isDeleted: false };
  if (search) query.name = { $regex: search, $options: 'i' };
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({
    success: true, message: 'Users fetched', data: users,
    meta: { page: Number(page), limit: Number(limit), total }
  });
});

const createUser = asyncHandler(async (req, res) => {
  const User = await getUserModel();
  const existing = await User.findOne({ email: req.body.email.toLowerCase(), isDeleted: false });
  if (existing) throw new AppError('Email already exists.', 400);
  const user = await User.create({ ...req.body, companyId: req.companyId });
  res.status(201).json({ success: true, message: 'User created', data: user.toJSON() });
});

const updateUser = asyncHandler(async (req, res) => {
  const User = await getUserModel();
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false },
    { ...req.body, lastModifiedAt: new Date(), v: user?.v ? user.v + 1 : 1 },
    { new: true, runValidators: true }
  );
  if (!user) throw new AppError('User not found.', 404);
  res.json({ success: true, message: 'User updated', data: user.toJSON() });
});

const deleteUser = asyncHandler(async (req, res) => {
  const User = await getUserModel();
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false },
    { isDeleted: true, lastModifiedAt: new Date() },
    { new: true }
  );
  if (!user) throw new AppError('User not found.', 404);
  res.json({ success: true, message: 'User deleted', data: null });
});

module.exports = { getUsers, createUser, updateUser, deleteUser };


const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { getControlConnection } = require('../config/db');
const DatabaseManager = require('../services/DatabaseManager');
const tenantSchema = require('../models/TenantModel');
const userSchema = require('../models/UserModel');

const getControlDb = () => {
  const conn = getControlConnection();
  if (!conn || conn.readyState !== 1) throw new AppError('Control DB not connected.', 500);
  return conn;
};

const getAllTenants = asyncHandler(async (req, res) => {
  const db = getControlDb();
  const Tenant = db.models.Tenant || db.model('Tenant', tenantSchema);
  const { page = 1, limit = 20, search, status } = req.query;
  const query = {};
  if (status) query.status = status;
  if (search) query.name = { $regex: search, $options: 'i' };
  const total = await Tenant.countDocuments(query);
  const tenants = await Tenant.find(query).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ success: true, message: 'Tenants fetched', data: tenants, meta: { page: Number(page), limit: Number(limit), total } });
});

const getTenantById = asyncHandler(async (req, res) => {
  const db = getControlDb();
  const Tenant = db.models.Tenant || db.model('Tenant', tenantSchema);
  const tenant = await Tenant.findById(req.params.id);
  if (!tenant) throw new AppError('Tenant not found.', 404);
  res.json({ success: true, message: 'Tenant fetched', data: tenant });
});

const createTenant = asyncHandler(async (req, res) => {
  const db = getControlDb();
  const Tenant = db.models.Tenant || db.model('Tenant', tenantSchema);
  const exists = await Tenant.findOne({ email: req.body.email });
  if (exists) throw new AppError('Tenant with this email already exists.', 400);
  const tenant = await Tenant.create({
    name: req.body.companyName || req.body.name,
    email: req.body.email,
    phone: req.body.phone || '',
    address: req.body.address || {},
    subscriptionPlan: req.body.subscriptionPlan || 'BASIC',
    maxUsers: req.body.maxUsers || 5,
    status: 'ACTIVE'
  });
  const conn = await DatabaseManager.getConnection(tenant._id.toString());
  const User = conn.model('UserModel', userSchema);
  await User.create({
    name: req.body.companyName || req.body.name || 'Admin',
    email: req.body.email,
    password: req.body.adminPassword || 'Admin@123',
    role: 'ADMIN',
    companyId: tenant._id.toString(),
    isActive: true
  });
  res.status(201).json({ success: true, message: 'Tenant created with admin user', data: tenant });
});

const updateTenant = asyncHandler(async (req, res) => {
  const db = getControlDb();
  const Tenant = db.models.Tenant || db.model('Tenant', tenantSchema);
  const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!tenant) throw new AppError('Tenant not found.', 404);
  res.json({ success: true, message: 'Tenant updated', data: tenant });
});

const suspendTenant = asyncHandler(async (req, res) => {
  const db = getControlDb();
  const Tenant = db.models.Tenant || db.model('Tenant', tenantSchema);
  const tenant = await Tenant.findByIdAndUpdate(req.params.id, { status: 'SUSPENDED' }, { new: true });
  if (!tenant) throw new AppError('Tenant not found.', 404);
  res.json({ success: true, message: 'Tenant suspended', data: tenant });
});

const activateTenant = asyncHandler(async (req, res) => {
  const db = getControlDb();
  const Tenant = db.models.Tenant || db.model('Tenant', tenantSchema);
  const tenant = await Tenant.findByIdAndUpdate(req.params.id, { status: 'ACTIVE' }, { new: true });
  if (!tenant) throw new AppError('Tenant not found.', 404);
  res.json({ success: true, message: 'Tenant activated', data: tenant });
});

const getSystemHealth = asyncHandler(async (req, res) => {
  const conn = getControlConnection();
  const Tenant = conn.models.Tenant || conn.model('Tenant', tenantSchema);
  const totalTenants = await Tenant.countDocuments({});
  const activeTenants = await Tenant.countDocuments({ status: 'ACTIVE' });
  const suspendedTenants = await Tenant.countDocuments({ status: 'SUSPENDED' });
  res.json({
    success: true, message: 'System health',
    data: { totalTenants, activeTenants, suspendedTenants, dbReady: conn.readyState === 1, uptime: process.uptime() }
  });
});

module.exports = { getAllTenants, getTenantById, createTenant, updateTenant, suspendTenant, activateTenant, getSystemHealth };

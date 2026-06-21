const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('../services/DatabaseManager');
const { getLedger } = require('../services/ledgerService');

const getVendors = asyncHandler(async (req, res) => {
  const Vendor = DatabaseManager.getModel(req.companyId, 'VendorModel');
  const { page = 1, limit = 20, search } = req.query;
  const query = { companyId: req.companyId, isDeleted: false };
  if (search) query.name = { $regex: search, $options: 'i' };
  const total = await Vendor.countDocuments(query);
  const vendors = await Vendor.find(query).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ success: true, message: 'Vendors fetched', data: vendors, meta: { page: Number(page), limit: Number(limit), total } });
});

const getVendorById = asyncHandler(async (req, res) => {
  const Vendor = DatabaseManager.getModel(req.companyId, 'VendorModel');
  const vendor = await Vendor.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false });
  if (!vendor) throw new AppError('Vendor not found.', 404);
  res.json({ success: true, message: 'Vendor fetched', data: vendor });
});

const createVendor = asyncHandler(async (req, res) => {
  const Vendor = DatabaseManager.getModel(req.companyId, 'VendorModel');
  const vendor = await Vendor.create({ ...req.body, companyId: req.companyId });
  res.status(201).json({ success: true, message: 'Vendor created', data: vendor });
});

const updateVendor = asyncHandler(async (req, res) => {
  const Vendor = DatabaseManager.getModel(req.companyId, 'VendorModel');
  const vendor = await Vendor.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false },
    { ...req.body, lastModifiedAt: new Date() }, { new: true, runValidators: true }
  );
  if (!vendor) throw new AppError('Vendor not found.', 404);
  res.json({ success: true, message: 'Vendor updated', data: vendor });
});

const deleteVendor = asyncHandler(async (req, res) => {
  const Vendor = DatabaseManager.getModel(req.companyId, 'VendorModel');
  const vendor = await Vendor.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false },
    { isDeleted: true, lastModifiedAt: new Date() }, { new: true }
  );
  if (!vendor) throw new AppError('Vendor not found.', 404);
  res.json({ success: true, message: 'Vendor deleted', data: null });
});

const getVendorLedger = asyncHandler(async (req, res) => {
  const { startDate, endDate, page, limit } = req.query;
  const result = await getLedger(req.companyId, 'VENDOR', req.params.id, { startDate, endDate, page, limit });
  res.json({ success: true, message: 'Ledger fetched', data: result.transactions, meta: { page: result.page, limit: result.limit, total: result.total } });
});

module.exports = { getVendors, getVendorById, createVendor, updateVendor, deleteVendor, getVendorLedger };


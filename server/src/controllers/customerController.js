const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('../services/DatabaseManager');
const { getLedger } = require('../services/ledgerService');

const getCustomers = asyncHandler(async (req, res) => {
  const Customer = DatabaseManager.getModel(req.companyId, 'CustomerModel');
  const { page = 1, limit = 20, search, type } = req.query;
  const query = { companyId: req.companyId, isDeleted: false };
  if (type) query.type = type;
  if (search) query.name = { $regex: search, $options: 'i' };
  const total = await Customer.countDocuments(query);
  const customers = await Customer.find(query).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ success: true, message: 'Customers fetched', data: customers, meta: { page: Number(page), limit: Number(limit), total } });
});

const getCustomerById = asyncHandler(async (req, res) => {
  const Customer = DatabaseManager.getModel(req.companyId, 'CustomerModel');
  const customer = await Customer.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false });
  if (!customer) throw new AppError('Customer not found.', 404);
  res.json({ success: true, message: 'Customer fetched', data: customer });
});

const createCustomer = asyncHandler(async (req, res) => {
  const Customer = DatabaseManager.getModel(req.companyId, 'CustomerModel');
  const customer = await Customer.create({ ...req.body, companyId: req.companyId });
  res.status(201).json({ success: true, message: 'Customer created', data: customer });
});

const updateCustomer = asyncHandler(async (req, res) => {
  const Customer = DatabaseManager.getModel(req.companyId, 'CustomerModel');
  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false },
    { ...req.body, lastModifiedAt: new Date() }, { new: true, runValidators: true }
  );
  if (!customer) throw new AppError('Customer not found.', 404);
  res.json({ success: true, message: 'Customer updated', data: customer });
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const Customer = DatabaseManager.getModel(req.companyId, 'CustomerModel');
  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false },
    { isDeleted: true, lastModifiedAt: new Date() }, { new: true }
  );
  if (!customer) throw new AppError('Customer not found.', 404);
  res.json({ success: true, message: 'Customer deleted', data: null });
});

const getCustomerLedger = asyncHandler(async (req, res) => {
  const { startDate, endDate, page, limit } = req.query;
  const result = await getLedger(req.companyId, 'CUSTOMER', req.params.id, { startDate, endDate, page, limit });
  res.json({ success: true, message: 'Ledger fetched', data: result.transactions, meta: { page: result.page, limit: result.limit, total: result.total } });
});

module.exports = { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getCustomerLedger };


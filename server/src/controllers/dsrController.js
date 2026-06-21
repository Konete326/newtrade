const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('../services/DatabaseManager');

const getDsrList = asyncHandler(async (req, res) => {
  const DSR = DatabaseManager.getModel(req.companyId, 'DsrModel');
  const { page = 1, limit = 20, status, salesmanId } = req.query;
  const query = { companyId: req.companyId, isDeleted: false };
  if (status) query.status = status;
  if (salesmanId) query.salesmanId = salesmanId;
  const total = await DSR.countDocuments(query);
  const dsrs = await DSR.find(query).populate('salesmanId', 'name')
    .skip((page - 1) * limit).limit(Number(limit)).sort({ date: -1 });
  res.json({ success: true, message: 'DSRs fetched', data: dsrs, meta: { page: Number(page), limit: Number(limit), total } });
});

const getDsrById = asyncHandler(async (req, res) => {
  const DSR = DatabaseManager.getModel(req.companyId, 'DsrModel');
  const dsr = await DSR.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false })
    .populate('salesmanId', 'name email').populate('linkedSales').populate('linkedReturns');
  if (!dsr) throw new AppError('DSR not found.', 404);
  res.json({ success: true, message: 'DSR fetched', data: dsr });
});

const createDsr = asyncHandler(async (req, res) => {
  const DSR = DatabaseManager.getModel(req.companyId, 'DsrModel');
  const count = await DSR.countDocuments({ companyId: req.companyId });
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const dsrNumber = `DSR-${dateStr}-${(count + 1).toString().padStart(3, '0')}`;
  const dsr = await DSR.create({ ...req.body, companyId: req.companyId, dsrNumber });
  res.status(201).json({ success: true, message: 'DSR created', data: dsr });
});

const settleDsr = asyncHandler(async (req, res) => {
  const DSR = DatabaseManager.getModel(req.companyId, 'DsrModel');
  const dsr = await DSR.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false });
  if (!dsr) throw new AppError('DSR not found.', 404);
  const { currencyBreakdown, expenses } = req.body;
  dsr.currencyBreakdown = currencyBreakdown || dsr.currencyBreakdown;
  dsr.expenses = expenses || dsr.expenses;
  const counted = Object.entries(dsr.currencyBreakdown).reduce((sum, [key, val]) => {
    const denom = Number(key.replace('n', ''));
    return sum + (denom * val);
  }, 0);
  dsr.totalCashCounted = counted;
  dsr.totalExpenses = dsr.expenses.reduce((sum, e) => sum + e.amount, 0);
  dsr.netDeposit = dsr.totalCashCollected - dsr.totalExpenses;
  dsr.cashVariance = counted - dsr.totalCashCollected;
  dsr.status = 'SETTLED';
  dsr.settledAt = new Date();
  dsr.settledBy = req.user.userId;
  dsr.lastModifiedAt = new Date();
  await dsr.save();
  res.json({ success: true, message: 'DSR settled', data: dsr });
});

const getDsrSheet = asyncHandler(async (req, res) => {
  const DSR = DatabaseManager.getModel(req.companyId, 'DsrModel');
  const dsr = await DSR.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false })
    .populate('salesmanId', 'name').populate('linkedSales').populate('linkedReturns');
  if (!dsr) throw new AppError('DSR not found.', 404);
  res.json({ success: true, message: 'DSR sheet generated', data: dsr });
});

module.exports = { getDsrList, getDsrById, createDsr, settleDsr, getDsrSheet };


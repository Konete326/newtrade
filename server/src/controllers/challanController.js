const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('../services/DatabaseManager');

const getChallans = asyncHandler(async (req, res) => {
  const Challan = DatabaseManager.getModel(req.companyId, 'ChallanModel');
  const { page = 1, limit = 20, status } = req.query;
  const query = { companyId: req.companyId, isDeleted: false };
  if (status) query.status = status;
  const total = await Challan.countDocuments(query);
  const challans = await Challan.find(query)
    .skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ success: true, message: 'Challans fetched', data: challans, meta: { page: Number(page), limit: Number(limit), total } });
});

const getChallanById = asyncHandler(async (req, res) => {
  const Challan = DatabaseManager.getModel(req.companyId, 'ChallanModel');
  const challan = await Challan.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false });
  if (!challan) throw new AppError('Challan not found.', 404);
  res.json({ success: true, message: 'Challan fetched', data: challan });
});

const createChallan = asyncHandler(async (req, res) => {
  const Challan = DatabaseManager.getModel(req.companyId, 'ChallanModel');
  const count = await Challan.countDocuments({ companyId: req.companyId });
  const challanNumber = `CHL-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  const items = req.body.items.map((item) => ({
    ...item,
    shortageQty: Math.max(0, item.requiredQty - (item.suppliedQty || 0))
  }));
  const challan = await Challan.create({ ...req.body, companyId: req.companyId, challanNumber, items });
  res.status(201).json({ success: true, message: 'Challan created', data: challan });
});

const updateStatus = asyncHandler(async (req, res) => {
  const Challan = DatabaseManager.getModel(req.companyId, 'ChallanModel');
  const { status, note } = req.body;
  const challan = await Challan.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false });
  if (!challan) throw new AppError('Challan not found.', 404);
  challan.status = status;
  challan.statusHistory.push({ status, changedBy: req.user.userId, timestamp: new Date(), note: note || '' });
  challan.lastModifiedAt = new Date();
  await challan.save();
  res.json({ success: true, message: 'Status updated', data: challan });
});

module.exports = { getChallans, getChallanById, createChallan, updateStatus };


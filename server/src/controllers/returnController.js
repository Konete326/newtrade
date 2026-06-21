const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('../services/DatabaseManager');

const getReturns = asyncHandler(async (req, res) => {
  const Return = DatabaseManager.getModel(req.companyId, 'ReturnModel');
  const { page = 1, limit = 20 } = req.query;
  const query = { companyId: req.companyId, isDeleted: false };
  const total = await Return.countDocuments(query);
  const returns = await Return.find(query).populate('customerId', 'name')
    .skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ success: true, message: 'Returns fetched', data: returns, meta: { page: Number(page), limit: Number(limit), total } });
});

const createReturn = asyncHandler(async (req, res) => {
  const Return = DatabaseManager.getModel(req.companyId, 'ReturnModel');
  const Sale = DatabaseManager.getModel(req.companyId, 'SaleModel');
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const Customer = DatabaseManager.getModel(req.companyId, 'CustomerModel');
  const sale = await Sale.findById(req.body.saleId);
  if (!sale) throw new AppError('Original sale not found.', 404);
  let totalRefund = 0;
  for (const item of req.body.items) {
    item.total = item.quantity * item.unitPrice;
    totalRefund += item.total;
    await Product.findByIdAndUpdate(item.productId, { $inc: { currentStock: item.quantity } });
  }
  if (sale.customerId && sale.saleType === 'CREDIT') {
    await Customer.findByIdAndUpdate(sale.customerId, { $inc: { currentBalance: -totalRefund } });
  }
  const returnDoc = await Return.create({
    ...req.body, companyId: req.companyId,
    invoiceNumber: sale.invoiceNumber, customerId: sale.customerId, totalRefund
  });
  res.status(201).json({ success: true, message: 'Return created', data: returnDoc });
});

const getReturnById = asyncHandler(async (req, res) => {
  const Return = DatabaseManager.getModel(req.companyId, 'ReturnModel');
  const returnDoc = await Return.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false })
    .populate('customerId', 'name phone');
  if (!returnDoc) throw new AppError('Return not found.', 404);
  res.json({ success: true, message: 'Return fetched', data: returnDoc });
});

module.exports = { getReturns, createReturn, getReturnById };


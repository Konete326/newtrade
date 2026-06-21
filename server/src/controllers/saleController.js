const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('../services/DatabaseManager');
const { checkCreditLimit } = require('../services/creditCheckService');

const generateInvoiceNumber = async (Sale, companyId) => {
  const count = await Sale.countDocuments({ companyId });
  return `INV-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
};

const getSales = asyncHandler(async (req, res) => {
  const Sale = DatabaseManager.getModel(req.companyId, 'SaleModel');
  const { page = 1, limit = 20, search, saleType, status } = req.query;
  const query = { companyId: req.companyId, isDeleted: false };
  if (saleType) query.saleType = saleType;
  if (status) query.status = status;
  const total = await Sale.countDocuments(query);
  const sales = await Sale.find(query).populate('customerId', 'name phone')
    .skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ success: true, message: 'Sales fetched', data: sales, meta: { page: Number(page), limit: Number(limit), total } });
});

const getSaleById = asyncHandler(async (req, res) => {
  const Sale = DatabaseManager.getModel(req.companyId, 'SaleModel');
  const sale = await Sale.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false }).populate('customerId', 'name phone address');
  if (!sale) throw new AppError('Sale not found.', 404);
  res.json({ success: true, message: 'Sale fetched', data: sale });
});

const createSale = asyncHandler(async (req, res) => {
  const Sale = DatabaseManager.getModel(req.companyId, 'SaleModel');
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const Customer = DatabaseManager.getModel(req.companyId, 'CustomerModel');
  const invoiceNumber = await generateInvoiceNumber(Sale, req.companyId);
  let subtotal = 0;
  for (const item of req.body.items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new AppError(`Product ${item.productId} not found.`, 404);
    item.total = (item.quantity * item.unitPrice) - (item.discount || 0);
    subtotal += item.total;
    product.currentStock -= item.quantity;
    await product.save();
  }
  const totalAmount = subtotal - (req.body.totalDiscount || 0);
  if (req.body.saleType === 'CREDIT' && req.body.customerId) {
    const creditResult = await checkCreditLimit(req.companyId, req.body.customerId, totalAmount);
    if (!creditResult.allowed && !req.body.creditLimitOverride?.overridden) {
      return res.status(400).json({ success: false, message: 'Credit limit exceeded', errors: [creditResult] });
    }
    if (req.body.creditLimitOverride?.overridden) {
      req.body.creditLimitOverride.authorizedBy = req.user.userId;
    }
    await Customer.findByIdAndUpdate(req.body.customerId, { $inc: { currentBalance: totalAmount } });
  }
  const sale = await Sale.create({ ...req.body, companyId: req.companyId, invoiceNumber, subtotal, totalAmount });
  res.status(201).json({ success: true, message: 'Sale created', data: sale });
});

const deleteSale = asyncHandler(async (req, res) => {
  const Sale = DatabaseManager.getModel(req.companyId, 'SaleModel');
  const sale = await Sale.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false },
    { isDeleted: true, lastModifiedAt: new Date() }, { new: true }
  );
  if (!sale) throw new AppError('Sale not found.', 404);
  res.json({ success: true, message: 'Sale deleted', data: null });
});

module.exports = { getSales, getSaleById, createSale, deleteSale };


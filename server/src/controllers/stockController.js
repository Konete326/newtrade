const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('../services/DatabaseManager');
const { formatStock } = require('../services/unitConverter');

const getStockOverview = asyncHandler(async (req, res) => {
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const { page = 1, limit = 20, search, lowStock } = req.query;
  const query = { companyId: req.companyId, isDeleted: false };
  if (search) query.name = { $regex: search, $options: 'i' };
  if (lowStock === 'true') query.$expr = { $lt: ['$currentStock', '$minStockThreshold'] };
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .skip((page - 1) * limit).limit(Number(limit)).sort({ name: 1 });
  const data = products.map((p) => ({
    ...p.toObject(),
    stockDisplay: formatStock(p.currentStock, p.unitHierarchy),
    isLowStock: p.currentStock < p.minStockThreshold
  }));
  res.json({
    success: true, message: 'Stock overview', data,
    meta: { page: Number(page), limit: Number(limit), total }
  });
});

const adjustStock = asyncHandler(async (req, res) => {
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const { productId, quantity, reason, type } = req.body;
  const product = await Product.findOne({ _id: productId, companyId: req.companyId, isDeleted: false });
  if (!product) throw new AppError('Product not found.', 404);
  if (type === 'WASTAGE' || type === 'DAMAGE') {
    product.currentStock -= quantity;
    if (product.currentStock < 0) product.currentStock = 0;
  } else {
    product.currentStock += quantity;
  }
  product.statusHistory.push({
    action: `STOCK_${type}`, userId: req.user.userId,
    timestamp: new Date(), note: reason
  });
  product.lastModifiedAt = new Date();
  await product.save();
  res.json({ success: true, message: 'Stock adjusted', data: product });
});

const transferStock = asyncHandler(async (req, res) => {
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const { productId, quantity, fromLocation, toLocation } = req.body;
  const product = await Product.findOne({ _id: productId, companyId: req.companyId, isDeleted: false });
  if (!product) throw new AppError('Product not found.', 404);
  product.statusHistory.push({
    action: 'STOCK_TRANSFER', userId: req.user.userId,
    timestamp: new Date(), note: `Transferred ${quantity} from ${fromLocation} to ${toLocation}`
  });
  product.lastModifiedAt = new Date();
  await product.save();
  res.json({ success: true, message: 'Stock transferred', data: product });
});

module.exports = { getStockOverview, adjustStock, transferStock };


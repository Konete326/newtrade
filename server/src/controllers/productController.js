const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('../services/DatabaseManager');
const { formatStock } = require('../services/unitConverter');

const getProducts = asyncHandler(async (req, res) => {
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const { page = 1, limit = 20, search, category } = req.query;
  const query = { companyId: req.companyId, isDeleted: false };
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  const total = await Product.countDocuments(query);
  let products = await Product.find(query)
    .skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  if (req.user.role === 'SALES' || req.user.role === 'VIEWER') {
    products = products.map((p) => {
      const obj = p.toObject();
      obj.purchasePrice = null;
      obj.landedCost = null;
      return obj;
    });
  }
  res.json({
    success: true, message: 'Products fetched', data: products,
    meta: { page: Number(page), limit: Number(limit), total }
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const product = await Product.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false });
  if (!product) throw new AppError('Product not found.', 404);
  const data = product.toObject();
  data.stockDisplay = formatStock(data.currentStock, data.unitHierarchy);
  if (req.user.role === 'SALES' || req.user.role === 'VIEWER') {
    data.purchasePrice = null;
    data.landedCost = null;
  }
  res.json({ success: true, message: 'Product fetched', data });
});

const createProduct = asyncHandler(async (req, res) => {
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const product = await Product.create({ ...req.body, companyId: req.companyId });
  res.status(201).json({ success: true, message: 'Product created', data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false },
    { ...req.body, lastModifiedAt: new Date() },
    { new: true, runValidators: true }
  );
  if (!product) throw new AppError('Product not found.', 404);
  res.json({ success: true, message: 'Product updated', data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false },
    { isDeleted: true, lastModifiedAt: new Date() },
    { new: true }
  );
  if (!product) throw new AppError('Product not found.', 404);
  res.json({ success: true, message: 'Product deleted', data: null });
});

const findByBarcode = asyncHandler(async (req, res) => {
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const product = await Product.findOne({ barcode: req.params.code, companyId: req.companyId, isDeleted: false });
  if (!product) throw new AppError('Product not found.', 404);
  res.json({ success: true, message: 'Product found', data: product });
});

const generateNextBarcode = asyncHandler(async (req, res) => {
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const prefix = '890';
  const digits = 10;
  const lastProduct = await Product.findOne({ companyId: req.companyId, isDeleted: false, barcode: { $regex: `^${prefix}` } })
    .sort({ barcode: -1 }).select('barcode').lean();
  let next = 1;
  if (lastProduct?.barcode) {
    const num = parseInt(lastProduct.barcode.slice(prefix.length), 10);
    if (!isNaN(num)) next = num + 1;
  }
  const barcode = prefix + String(next).padStart(digits, '0');
  res.json({ success: true, data: barcode });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, findByBarcode, generateNextBarcode };


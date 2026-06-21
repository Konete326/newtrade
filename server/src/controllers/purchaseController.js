const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('../services/DatabaseManager');
const { createLedgerEntry } = require('../services/ledgerService');

const generatePurchaseNumber = async (Purchase, companyId) => {
  const count = await Purchase.countDocuments({ companyId });
  return `PO-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
};

const calculateLandedCost = (items, landedCosts) => {
  const totalLanded = (landedCosts.freight || 0) + (landedCosts.palledari || 0) + (landedCosts.hamali || 0) + (landedCosts.tulai || 0);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  return items.map(item => ({
    ...item.toObject ? item.toObject() : item,
    landedCostPerUnit: totalQty > 0 ? (totalLanded * item.quantity / totalQty) / item.quantity : 0,
    totalCost: item.total + (totalQty > 0 ? totalLanded * item.quantity / totalQty : 0)
  }));
};

const getPurchases = asyncHandler(async (req, res) => {
  const Purchase = DatabaseManager.getModel(req.companyId, 'PurchaseModel');
  const { page = 1, limit = 20, status } = req.query;
  const query = { companyId: req.companyId, isDeleted: false };
  if (status) query.status = status;
  const total = await Purchase.countDocuments(query);
  const purchases = await Purchase.find(query).populate('vendorId', 'name phone')
    .skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ success: true, message: 'Purchases fetched', data: purchases, meta: { page: Number(page), limit: Number(limit), total } });
});

const getPurchaseById = asyncHandler(async (req, res) => {
  const Purchase = DatabaseManager.getModel(req.companyId, 'PurchaseModel');
  const purchase = await Purchase.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false }).populate('vendorId', 'name phone address');
  if (!purchase) throw new AppError('Purchase not found.', 404);
  res.json({ success: true, message: 'Purchase fetched', data: purchase });
});

const createPurchase = asyncHandler(async (req, res) => {
  const Purchase = DatabaseManager.getModel(req.companyId, 'PurchaseModel');
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const Vendor = DatabaseManager.getModel(req.companyId, 'VendorModel');
  const purchaseNumber = await generatePurchaseNumber(Purchase, req.companyId);
  let subtotal = 0;
  for (const item of req.body.items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new AppError(`Product ${item.productId} not found.`, 404);
    item.total = item.quantity * item.unitCost;
    subtotal += item.total;
    product.currentStock += item.quantity;
    product.purchasePrice = item.unitCost;
    await product.save();
  }
  const landedCosts = req.body.landedCosts || { freight: 0, palledari: 0, hamali: 0, tulai: 0 };
  const totalLanded = (landedCosts.freight || 0) + (landedCosts.palledari || 0) + (landedCosts.hamali || 0) + (landedCosts.tulai || 0);
  landedCosts.totalLanded = totalLanded;
  const totalAmount = subtotal + totalLanded;
  if (req.body.paymentType === 'CREDIT' && req.body.vendorId) {
    await Vendor.findByIdAndUpdate(req.body.vendorId, { $inc: { currentBalance: totalAmount } });
    await createLedgerEntry({
      companyId: req.companyId, partyType: 'VENDOR', partyId: req.body.vendorId,
      type: 'PURCHASE', debit: totalAmount, narration: `Purchase ${purchaseNumber}`, createdBy: req.user.userId
    });
  }
  const purchase = await Purchase.create({ ...req.body, companyId: req.companyId, purchaseNumber, subtotal, landedCosts, totalAmount });
  res.status(201).json({ success: true, message: 'Purchase created', data: purchase });
});

const deletePurchase = asyncHandler(async (req, res) => {
  const Purchase = DatabaseManager.getModel(req.companyId, 'PurchaseModel');
  const purchase = await Purchase.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false },
    { isDeleted: true, lastModifiedAt: new Date() }, { new: true }
  );
  if (!purchase) throw new AppError('Purchase not found.', 404);
  res.json({ success: true, message: 'Purchase deleted', data: null });
});

module.exports = { getPurchases, getPurchaseById, createPurchase, deletePurchase, calculateLandedCost };


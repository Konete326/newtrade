const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('../services/DatabaseManager');
const { createLedgerEntry } = require('../services/ledgerService');

const generatePaymentNumber = async (Payment, companyId, type) => {
  const prefix = type === 'RECEIPT' ? 'RCP' : 'PMT';
  const count = await Payment.countDocuments({ companyId, type });
  return `${prefix}-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
};

const getPayments = asyncHandler(async (req, res) => {
  const Payment = DatabaseManager.getModel(req.companyId, 'PaymentModel');
  const { page = 1, limit = 20, type, partyType } = req.query;
  const query = { companyId: req.companyId, isDeleted: false };
  if (type) query.type = type;
  if (partyType) query.partyType = partyType;
  const total = await Payment.countDocuments(query);
  const payments = await Payment.find(query).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ success: true, message: 'Payments fetched', data: payments, meta: { page: Number(page), limit: Number(limit), total } });
});

const getPaymentById = asyncHandler(async (req, res) => {
  const Payment = DatabaseManager.getModel(req.companyId, 'PaymentModel');
  const payment = await Payment.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false });
  if (!payment) throw new AppError('Payment not found.', 404);
  res.json({ success: true, message: 'Payment fetched', data: payment });
});

const createPayment = asyncHandler(async (req, res) => {
  const Payment = DatabaseManager.getModel(req.companyId, 'PaymentModel');
  const Customer = DatabaseManager.getModel(req.companyId, 'CustomerModel');
  const Vendor = DatabaseManager.getModel(req.companyId, 'VendorModel');
  const paymentNumber = await generatePaymentNumber(Payment, req.companyId, req.body.type);
  const payment = await Payment.create({ ...req.body, companyId: req.companyId, paymentNumber, createdBy: req.user.userId });
  if (req.body.partyType === 'CUSTOMER') {
    const adjustment = req.body.type === 'RECEIPT' ? -req.body.amount : req.body.amount;
    await Customer.findByIdAndUpdate(req.body.partyId, { $inc: { currentBalance: adjustment } });
    await createLedgerEntry({
      companyId: req.companyId, partyType: 'CUSTOMER', partyId: req.body.partyId,
      type: req.body.type === 'RECEIPT' ? 'RECEIPT' : 'PAYMENT', referenceId: payment._id,
      referenceModel: 'Payment', credit: req.body.type === 'RECEIPT' ? req.body.amount : 0,
      debit: req.body.type === 'PAYMENT' ? req.body.amount : 0,
      narration: `${req.body.type} ${paymentNumber}`, createdBy: req.user.userId
    });
  } else if (req.body.partyType === 'VENDOR') {
    const adjustment = req.body.type === 'PAYMENT' ? -req.body.amount : req.body.amount;
    await Vendor.findByIdAndUpdate(req.body.partyId, { $inc: { currentBalance: adjustment } });
    await createLedgerEntry({
      companyId: req.companyId, partyType: 'VENDOR', partyId: req.body.partyId,
      type: req.body.type === 'PAYMENT' ? 'PAYMENT' : 'RECEIPT', referenceId: payment._id,
      referenceModel: 'Payment', credit: req.body.type === 'PAYMENT' ? req.body.amount : 0,
      debit: req.body.type === 'RECEIPT' ? req.body.amount : 0,
      narration: `${req.body.type} ${paymentNumber}`, createdBy: req.user.userId
    });
  }
  res.status(201).json({ success: true, message: 'Payment recorded', data: payment });
});

const deletePayment = asyncHandler(async (req, res) => {
  const Payment = DatabaseManager.getModel(req.companyId, 'PaymentModel');
  const payment = await Payment.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false },
    { isDeleted: true, lastModifiedAt: new Date() }, { new: true }
  );
  if (!payment) throw new AppError('Payment not found.', 404);
  res.json({ success: true, message: 'Payment deleted', data: null });
});

module.exports = { getPayments, getPaymentById, createPayment, deletePayment };


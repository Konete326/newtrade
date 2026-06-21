const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('../services/DatabaseManager');
const whatsappService = require('../services/whatsappService');

const getInvoiceData = asyncHandler(async (req, res) => {
  const Sale = DatabaseManager.getModel(req.companyId, 'SaleModel');
  const sale = await Sale.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false })
    .populate('customerId', 'name phone address whatsapp');
  if (!sale) throw new AppError('Invoice not found.', 404);
  sale.printedAt = new Date();
  await sale.save();
  res.json({ success: true, message: 'Invoice data fetched', data: sale });
});

const getChallanData = asyncHandler(async (req, res) => {
  const Challan = DatabaseManager.getModel(req.companyId, 'ChallanModel');
  const challan = await Challan.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false })
    .populate('saleId', 'invoiceNumber customerId');
  if (!challan) throw new AppError('Challan not found.', 404);
  res.json({ success: true, message: 'Challan data fetched', data: challan });
});

const sendInvoiceWhatsApp = asyncHandler(async (req, res) => {
  const Sale = DatabaseManager.getModel(req.companyId, 'SaleModel');
  const sale = await Sale.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false })
    .populate('customerId', 'name phone whatsapp');
  if (!sale) throw new AppError('Invoice not found.', 404);
  const phone = sale.customerId?.whatsapp || sale.customerId?.phone;
  if (!phone) throw new AppError('Customer has no WhatsApp/phone number.', 400);
  const result = await whatsappService.sendInvoice(phone, sale);
  res.json({ success: true, message: 'Invoice sent via WhatsApp', data: result });
});

const sendReminder = asyncHandler(async (req, res) => {
  const Customer = DatabaseManager.getModel(req.companyId, 'CustomerModel');
  const customer = await Customer.findOne({ _id: req.params.customerId, companyId: req.companyId, isDeleted: false });
  if (!customer) throw new AppError('Customer not found.', 404);
  const phone = customer.whatsapp || customer.phone;
  if (!phone) throw new AppError('Customer has no WhatsApp/phone number.', 400);
  const result = await whatsappService.sendPaymentReminder(phone, customer.name, customer.currentBalance);
  res.json({ success: true, message: 'Payment reminder sent', data: result });
});

const sendCustomMessage = asyncHandler(async (req, res) => {
  const { to, message } = req.body;
  if (!to || !message) throw new AppError('Recipient and message are required.', 400);
  const result = await whatsappService.sendMessage(to, message);
  res.json({ success: true, message: 'Message sent', data: result });
});

module.exports = { getInvoiceData, getChallanData, sendInvoiceWhatsApp, sendReminder, sendCustomMessage };


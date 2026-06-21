const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
  invoiceNumber: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  totalRefund: { type: Number, default: 0 },
  reason: { type: String, default: '' },
  statusHistory: [{ action: String, userId: mongoose.Schema.Types.ObjectId, timestamp: { type: Date, default: Date.now }, note: String }],
  isDeleted: { type: Boolean, default: false },
  isSynced: { type: Boolean, default: true },
  v: { type: Number, default: 1 },
  lastModifiedAt: { type: Date, default: Date.now },
  deviceId: { type: String, default: '' },
  syncedAt: { type: Date, default: null }
}, { timestamps: true });

returnSchema.index({ companyId: 1, isDeleted: 1, saleId: 1 });

module.exports = returnSchema;


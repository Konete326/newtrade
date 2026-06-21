const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  dsrId: { type: mongoose.Schema.Types.ObjectId, ref: 'DSR', default: null },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
  saleType: { type: String, enum: ['CASH', 'CREDIT'], default: 'CASH' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  }],
  subtotal: { type: Number, default: 0 },
  totalDiscount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  paymentTerms: { type: String, enum: ['CASH', 'CREDIT'], default: 'CASH' },
  status: { type: String, enum: ['COMPLETED', 'RETURNED', 'PARTIALLY_RETURNED'], default: 'COMPLETED' },
  printedAt: { type: Date, default: null },
  creditLimitOverride: { overridden: { type: Boolean, default: false }, authorizedBy: { type: mongoose.Schema.Types.ObjectId, default: null } },
  statusHistory: [{ action: String, userId: mongoose.Schema.Types.ObjectId, timestamp: { type: Date, default: Date.now }, note: String }],
  isDeleted: { type: Boolean, default: false },
  isSynced: { type: Boolean, default: true },
  v: { type: Number, default: 1 },
  lastModifiedAt: { type: Date, default: Date.now },
  deviceId: { type: String, default: '' },
  syncedAt: { type: Date, default: null }
}, { timestamps: true });

saleSchema.index({ companyId: 1, isDeleted: 1, createdAt: -1 });
saleSchema.index({ companyId: 1, customerId: 1, isDeleted: 1 });
saleSchema.index({ companyId: 1, invoiceNumber: 1 }, { unique: true });

module.exports = saleSchema;


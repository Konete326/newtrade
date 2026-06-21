const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  purchaseNumber: { type: String, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitCost: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  subtotal: { type: Number, default: 0 },
  landedCosts: {
    freight: { type: Number, default: 0 },
    palledari: { type: Number, default: 0 },
    hamali: { type: Number, default: 0 },
    tulai: { type: Number, default: 0 },
    totalLanded: { type: Number, default: 0 }
  },
  totalAmount: { type: Number, default: 0 },
  paymentType: { type: String, enum: ['CASH', 'CREDIT'], default: 'CASH' },
  status: { type: String, enum: ['COMPLETED', 'RETURNED', 'PARTIALLY_RETURNED'], default: 'COMPLETED' },
  statusHistory: [{ action: String, userId: mongoose.Schema.Types.ObjectId, timestamp: { type: Date, default: Date.now }, note: String }],
  isDeleted: { type: Boolean, default: false },
  isSynced: { type: Boolean, default: true },
  v: { type: Number, default: 1 },
  lastModifiedAt: { type: Date, default: Date.now },
  deviceId: { type: String, default: '' },
  syncedAt: { type: Date, default: null }
}, { timestamps: true });

purchaseSchema.index({ companyId: 1, isDeleted: 1, createdAt: -1 });
purchaseSchema.index({ companyId: 1, vendorId: 1, isDeleted: 1 });
purchaseSchema.index({ companyId: 1, purchaseNumber: 1 }, { unique: true });

module.exports = purchaseSchema;


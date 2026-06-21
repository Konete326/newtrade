const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['WHOLESALER', 'RETAILER', 'CUSTOM'], default: 'WHOLESALER' },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { line1: String, city: String, province: String },
  creditLimit: { type: Number, default: 0 },
  openingBalance: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  pricingTier: { type: String, default: 'wholesale' },
  isActive: { type: Boolean, default: true },
  statusHistory: [{ action: String, userId: mongoose.Schema.Types.ObjectId, timestamp: { type: Date, default: Date.now }, note: String }],
  isDeleted: { type: Boolean, default: false },
  isSynced: { type: Boolean, default: true },
  v: { type: Number, default: 1 },
  lastModifiedAt: { type: Date, default: Date.now },
  deviceId: { type: String, default: '' },
  syncedAt: { type: Date, default: null }
}, { timestamps: true });

customerSchema.index({ companyId: 1, isDeleted: 1, name: 1 });

module.exports = customerSchema;


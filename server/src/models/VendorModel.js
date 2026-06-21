const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { line1: String, city: String, province: String },
  openingBalance: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  isSynced: { type: Boolean, default: true },
  v: { type: Number, default: 1 },
  lastModifiedAt: { type: Date, default: Date.now },
  deviceId: { type: String, default: '' },
  syncedAt: { type: Date, default: null }
}, { timestamps: true });

vendorSchema.index({ companyId: 1, isDeleted: 1, name: 1 });

module.exports = vendorSchema;


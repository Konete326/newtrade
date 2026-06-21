const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: '' },
  address: { line1: String, city: String, province: String },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'CANCELLED'], default: 'ACTIVE' },
  subscriptionPlan: { type: String, enum: ['FREE', 'BASIC', 'PRO', 'ENTERPRISE'], default: 'FREE' },
  maxUsers: { type: Number, default: 5 },
  storageUsed: { type: Number, default: 0 },
  lastSyncAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false },
  statusHistory: [{
    action: String,
    userId: mongoose.Schema.Types.ObjectId,
    timestamp: { type: Date, default: Date.now },
    note: String
  }]
}, { timestamps: true });

tenantSchema.index({ status: 1, isDeleted: 1 });

module.exports = tenantSchema;


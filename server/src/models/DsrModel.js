const mongoose = require('mongoose');

const dsrSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  dsrNumber: { type: String, required: true },
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  route: { type: String, default: '' },
  status: { type: String, enum: ['ACTIVE', 'SETTLED'], default: 'ACTIVE' },
  linkedSales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }],
  linkedReturns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Return' }],
  currencyBreakdown: {
    n5000: { type: Number, default: 0 }, n1000: { type: Number, default: 0 },
    n500: { type: Number, default: 0 }, n100: { type: Number, default: 0 },
    n50: { type: Number, default: 0 }, n20: { type: Number, default: 0 }, n10: { type: Number, default: 0 }
  },
  totalCashCounted: { type: Number, default: 0 },
  totalCashCollected: { type: Number, default: 0 },
  cashVariance: { type: Number, default: 0 },
  expenses: [{ type: { type: String, enum: ['FUEL', 'FOOD', 'PARKING', 'LABOR', 'OTHER'] }, amount: { type: Number, default: 0 }, note: { type: String, default: '' } }],
  totalExpenses: { type: Number, default: 0 },
  netDeposit: { type: Number, default: 0 },
  settledAt: { type: Date, default: null },
  settledBy: { type: mongoose.Schema.Types.ObjectId, default: null },
  statusHistory: [{ action: String, userId: mongoose.Schema.Types.ObjectId, timestamp: { type: Date, default: Date.now }, note: String }],
  isDeleted: { type: Boolean, default: false },
  isSynced: { type: Boolean, default: true },
  v: { type: Number, default: 1 },
  lastModifiedAt: { type: Date, default: Date.now },
  deviceId: { type: String, default: '' },
  syncedAt: { type: Date, default: null }
}, { timestamps: true });

dsrSchema.index({ companyId: 1, salesmanId: 1, date: 1 });
dsrSchema.index({ companyId: 1, dsrNumber: 1 }, { unique: true });

module.exports = dsrSchema;


const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  paymentNumber: { type: String, required: true },
  type: { type: String, enum: ['RECEIPT', 'PAYMENT'], required: true },
  partyType: { type: String, enum: ['CUSTOMER', 'VENDOR'], required: true },
  partyId: { type: mongoose.Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true, min: 0 },
  method: { type: String, enum: ['CASH', 'BANK_TRANSFER', 'CHEQUE', 'ONLINE'], default: 'CASH' },
  reference: { type: String, default: '' },
  note: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  isSynced: { type: Boolean, default: true },
  v: { type: Number, default: 1 },
  lastModifiedAt: { type: Date, default: Date.now },
  deviceId: { type: String, default: '' },
  syncedAt: { type: Date, default: null }
}, { timestamps: true });

paymentSchema.index({ companyId: 1, isDeleted: 1, createdAt: -1 });
paymentSchema.index({ companyId: 1, partyId: 1, isDeleted: 1 });
paymentSchema.index({ companyId: 1, paymentNumber: 1 }, { unique: true });

module.exports = paymentSchema;


const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  partyType: { type: String, enum: ['CUSTOMER', 'VENDOR'], required: true },
  partyId: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ['SALE', 'PURCHASE', 'PAYMENT', 'RECEIPT', 'RETURN', 'EXPENSE', 'ADJUSTMENT'], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId, default: null },
  referenceModel: { type: String, default: '' },
  debit: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  narration: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  isSynced: { type: Boolean, default: true },
  v: { type: Number, default: 1 },
  lastModifiedAt: { type: Date, default: Date.now },
  syncedAt: { type: Date, default: null }
}, { timestamps: true });

transactionSchema.index({ companyId: 1, partyId: 1, isDeleted: 1, date: -1 });
transactionSchema.index({ companyId: 1, partyType: 1, isDeleted: 1 });

module.exports = transactionSchema;


const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  expenseNumber: { type: String, required: true },
  category: { type: String, enum: ['FREIGHT', 'PALLEDARI', 'HAMALI', 'TULAI', 'RENT', 'UTILITIES', 'SALARY', 'MARKETING', 'MISCELLANEOUS'], required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  incurredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvalStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  approvedAt: { type: Date, default: null },
  rejectionNote: { type: String, default: '' },
  attachments: [{ url: String, publicId: String, name: String }],
  isDeleted: { type: Boolean, default: false },
  isSynced: { type: Boolean, default: true },
  v: { type: Number, default: 1 },
  lastModifiedAt: { type: Date, default: Date.now },
  deviceId: { type: String, default: '' },
  syncedAt: { type: Date, default: null }
}, { timestamps: true });

expenseSchema.index({ companyId: 1, isDeleted: 1, createdAt: -1 });
expenseSchema.index({ companyId: 1, approvalStatus: 1, isDeleted: 1 });
expenseSchema.index({ companyId: 1, expenseNumber: 1 }, { unique: true });

module.exports = expenseSchema;


const mongoose = require('mongoose');

const challanSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  challanNumber: { type: String, required: true },
  dsrId: { type: mongoose.Schema.Types.ObjectId, ref: 'DSR', default: null },
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', default: null },
  logistics: { vehicleNumber: { type: String, default: '' }, driverName: { type: String, default: '' }, route: { type: String, default: '' } },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    requiredQty: { type: Number, required: true },
    suppliedQty: { type: Number, default: 0 },
    shortageQty: { type: Number, default: 0 }
  }],
  status: { type: String, enum: ['PENDING', 'DISPATCHED', 'DELIVERED', 'PARTIALLY_DELIVERED', 'RETURNED'], default: 'PENDING' },
  statusHistory: [{ status: String, changedBy: mongoose.Schema.Types.ObjectId, timestamp: { type: Date, default: Date.now }, note: String }],
  isDeleted: { type: Boolean, default: false },
  isSynced: { type: Boolean, default: true },
  v: { type: Number, default: 1 },
  lastModifiedAt: { type: Date, default: Date.now },
  deviceId: { type: String, default: '' },
  syncedAt: { type: Date, default: null }
}, { timestamps: true });

challanSchema.index({ companyId: 1, status: 1, isDeleted: 1 });
challanSchema.index({ companyId: 1, challanNumber: 1 }, { unique: true });

module.exports = challanSchema;


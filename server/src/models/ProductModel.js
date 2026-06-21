const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, trim: true },
  barcode: { type: String, default: '' },
  category: { type: String, default: '' },
  unitHierarchy: {
    baseUnit: { name: { type: String, default: 'Piece' }, factor: { type: Number, default: 1 } },
    secondaryUnit: { name: { type: String, default: '' }, factor: { type: Number, default: 1 } },
    tertiaryUnit: { name: { type: String, default: '' }, factor: { type: Number, default: 1 } }
  },
  purchasePrice: { type: Number, default: 0 },
  landedCost: { type: Number, default: 0 },
  salePrices: {
    wholesale: { type: Number, default: 0 },
    retailer: { type: Number, default: 0 },
    custom: { type: Number, default: 0 }
  },
  minStockThreshold: { type: Number, default: 0 },
  currentStock: { type: Number, default: 0 },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  statusHistory: [{
    action: String,
    userId: mongoose.Schema.Types.ObjectId,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  isDeleted: { type: Boolean, default: false },
  isSynced: { type: Boolean, default: true },
  v: { type: Number, default: 1 },
  lastModifiedAt: { type: Date, default: Date.now },
  deviceId: { type: String, default: '' },
  syncedAt: { type: Date, default: null }
}, { timestamps: true });

productSchema.index({ companyId: 1, isDeleted: 1, name: 1 });
productSchema.index({ companyId: 1, isDeleted: 1, barcode: 1 });
productSchema.index({ companyId: 1, sku: 1 }, { unique: true });

module.exports = productSchema;


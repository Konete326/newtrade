const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ['LOGIN', 'LOGOUT', 'ACTIVITY'],
    required: true
  },
  actorId: { type: String, required: true },
  actorName: { type: String, required: true },
  actorRole: {
    type: String,
    enum: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES', 'VIEWER'],
    required: true
  },
  // Which role levels should see this notification
  // e.g. ['SUPER_ADMIN', 'ADMIN'] means only those roles see it
  visibleTo: [{ type: String }],
  title: { type: String, required: true },
  message: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

// Compound index for fast queries
notificationSchema.index({ companyId: 1, visibleTo: 1, isRead: 1, createdAt: -1 });

module.exports = notificationSchema;

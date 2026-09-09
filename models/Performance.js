const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  subtitle: { type: String, trim: true, maxlength: 120, default: '' },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  imageUrl: { type: String, trim: true, default: '' },
  alt: { type: String, trim: true, maxlength: 500, default: '' },
  price: { type: Number, min: 0, default: null },
  status: { type: String, trim: true, maxlength: 40, default: 'available' },
  purchaseUrl: { type: String, trim: true, default: '' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

performanceSchema.index({ isActive: 1, sortOrder: 1, title: 1 });

module.exports = mongoose.model('Performance', performanceSchema);

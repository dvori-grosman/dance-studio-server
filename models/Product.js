const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 1200, default: '' },
  price: { type: Number, min: 0, default: null },
  imageUrl: { type: String, trim: true, default: '' },
  purchaseUrl: { type: String, trim: true, default: '' },
  category: { type: String, trim: true, maxlength: 80, default: '' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ isActive: 1, sortOrder: 1, name: 1 });

module.exports = mongoose.model('Product', productSchema);

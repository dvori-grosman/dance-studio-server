const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  subtitle: { type: String, trim: true, maxlength: 220, default: '' },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  features: [{ type: String, trim: true, maxlength: 160 }],
  duration: { type: String, trim: true, maxlength: 80, default: '' },
  ages: { type: String, trim: true, maxlength: 120, default: '' },
  levels: [{ type: String, trim: true, maxlength: 80 }],
  imageUrl: { type: String, trim: true, default: '' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

lessonSchema.index({ isActive: 1, sortOrder: 1, title: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);

const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Teacher name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9\-\+\s\(\)]+$/, 'Please enter a valid phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  specialties: [{
    type: String,
    trim: true,
    maxlength: [50, 'Specialty cannot be more than 50 characters']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster searches
teacherSchema.index({ name: 1 });
teacherSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Teacher', teacherSchema);

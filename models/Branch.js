const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Branch name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9\-\+\s\(\)]+$/, 'Please enter a valid phone number']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  scheduleFileUrl: {
    type: String,
    trim: true,
    default: ''
  },
  scheduleFileKey: {
    type: String,
    trim: true,
    default: ''
  },
  scheduleFileType: {
    type: String,
    trim: true,
    default: ''
  },
  scheduleFileName: {
    type: String,
    trim: true,
    default: ''
  },
  scheduleYear: {
    type: String,
    trim: true,
    default: ''
  },
  scheduleUpdatedAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

branchSchema.index({ name: 1 });

module.exports = mongoose.model('Branch', branchSchema);

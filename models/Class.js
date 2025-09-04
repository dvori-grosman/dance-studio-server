const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  day: {
    type: String,
    required: [true, 'Day is required'],
    enum: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
    trim: true
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    trim: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: [true, 'Branch is required']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Teacher is required']
  },
  description: {
    type: String,
    required: [true, 'Class description is required'],
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  level: {
    type: String,
    enum: ['מתחילות', 'ממשיכות', 'מתקדמות', 'גיל הרך', 'בסיס', 'נבחרת'],
    trim: true
  },
  maxStudents: {
    type: Number,
    min: [1, 'Maximum students must be at least 1'],
    max: [50, 'Maximum students cannot exceed 50'],
    default: 20
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required'],
    min: [30, 'Duration must be at least 30 minutes'],
    max: [180, 'Duration cannot exceed 180 minutes'],
    default: 60
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for unique class scheduling (same day, time, branch)
classSchema.index({ day: 1, time: 1, branch: 1 }, { unique: true });

// Index for faster searches
classSchema.index({ day: 1 });
classSchema.index({ branch: 1 });
classSchema.index({ teacher: 1 });

// Virtual for formatted time display
classSchema.virtual('formattedSchedule').get(function() {
  return `${this.day} ${this.time}`;
});

// Populate teacher and branch info by default
classSchema.pre(/^find/, function(next) {
  this.populate('teacher', 'name specialties')
      .populate('branch', 'name address');
  next();
});

module.exports = mongoose.model('Class', classSchema);

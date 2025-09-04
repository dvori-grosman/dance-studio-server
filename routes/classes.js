const express = require('express');
const Class = require('../models/Class');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all classes (public route for schedule display)
router.get('/', async (req, res) => {
  try {
    const { branch, day } = req.query;
    
    let filter = { isActive: true };
    if (branch) filter.branch = branch;
    if (day) filter.day = day;
    
    const classes = await Class.find(filter)
      .sort({ day: 1, time: 1 });
    
    res.json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching classes' 
    });
  }
});

// Get classes grouped by day (for schedule display)
router.get('/schedule', async (req, res) => {
  try {
    const { branch } = req.query;
    
    let filter = { isActive: true };
    if (branch) filter.branch = branch;
    
    const classes = await Class.find(filter)
      .sort({ day: 1, time: 1 });
    
    // Group classes by day
    const schedule = {};
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    
    days.forEach(day => {
      schedule[day] = classes.filter(cls => cls.day === day);
    });
    
    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching schedule' 
    });
  }
});

// Get all classes for admin (includes all fields)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const classes = await Class.find()
      .sort({ day: 1, time: 1 });
    
    res.json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    console.error('Get classes admin error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching classes' 
    });
  }
});

// Get single class
router.get('/:id', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    
    if (!classItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }
    
    res.json({
      success: true,
      data: classItem
    });
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching class' 
    });
  }
});

// Create new class (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { day, time, branch, teacher, description, level, maxStudents, duration } = req.body;
    
    // Check for scheduling conflicts (same day, time, branch)
    const existingClass = await Class.findOne({
      day,
      time,
      branch,
      isActive: true
    });
    
    if (existingClass) {
      return res.status(400).json({ 
        success: false, 
        message: 'A class is already scheduled at this time and branch' 
      });
    }
    
    const classItem = new Class({
      day,
      time,
      branch,
      teacher,
      description,
      level,
      maxStudents,
      duration
    });
    
    await classItem.save();
    
    // Populate the saved class for response
    await classItem.populate('teacher', 'name specialties');
    await classItem.populate('branch', 'name address');
    
    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: classItem
    });
  } catch (error) {
    console.error('Create class error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error creating class' 
    });
  }
});

// Update class (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { day, time, branch, teacher, description, level, maxStudents, duration, isActive } = req.body;
    
    // Check for scheduling conflicts (excluding current class)
    const existingClass = await Class.findOne({
      day,
      time,
      branch,
      isActive: true,
      _id: { $ne: req.params.id }
    });
    
    if (existingClass) {
      return res.status(400).json({ 
        success: false, 
        message: 'Another class is already scheduled at this time and branch' 
      });
    }
    
    const classItem = await Class.findByIdAndUpdate(
      req.params.id,
      {
        day,
        time,
        branch,
        teacher,
        description,
        level,
        maxStudents,
        duration,
        isActive
      },
      { new: true, runValidators: true }
    );
    
    if (!classItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Class updated successfully',
      data: classItem
    });
  } catch (error) {
    console.error('Update class error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error updating class' 
    });
  }
});

// Delete class (admin only) - soft delete
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const classItem = await Class.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!classItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Class deactivated successfully'
    });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting class' 
    });
  }
});

// Get statistics (admin only)
router.get('/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalClasses = await Class.countDocuments({ isActive: true });
    const classesByDay = await Class.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$day', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    const classesByBranch = await Class.aggregate([
      { $match: { isActive: true } },
      { $lookup: { from: 'branches', localField: 'branch', foreignField: '_id', as: 'branchInfo' } },
      { $unwind: '$branchInfo' },
      { $group: { _id: '$branchInfo.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalClasses,
        classesByDay,
        classesByBranch
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching statistics' 
    });
  }
});

module.exports = router;

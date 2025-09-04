const express = require('express');
const Teacher = require('../models/Teacher');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all teachers (public route for displaying in frontend)
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find({ isActive: true })
      .select('name specialties')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching teachers' 
    });
  }
});

// Get all teachers for admin (includes all fields)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .sort({ name: 1 });
    
    res.json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    console.error('Get teachers admin error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching teachers' 
    });
  }
});

// Get single teacher
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }
    
    res.json({
      success: true,
      data: teacher
    });
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching teacher' 
    });
  }
});

// Create new teacher (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, phone, email, specialties } = req.body;
    
    // Check if teacher with this email already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ 
        success: false, 
        message: 'Teacher with this email already exists' 
      });
    }
    
    const teacher = new Teacher({
      name,
      phone,
      email,
      specialties: Array.isArray(specialties) ? specialties : [specialties].filter(Boolean)
    });
    
    await teacher.save();
    
    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    
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
      message: 'Error creating teacher' 
    });
  }
});

// Update teacher (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, phone, email, specialties, isActive } = req.body;
    
    // Check if another teacher with this email exists
    const existingTeacher = await Teacher.findOne({ 
      email, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingTeacher) {
      return res.status(400).json({ 
        success: false, 
        message: 'Another teacher with this email already exists' 
      });
    }
    
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
        email,
        specialties: Array.isArray(specialties) ? specialties : [specialties].filter(Boolean),
        isActive
      },
      { new: true, runValidators: true }
    );
    
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    
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
      message: 'Error updating teacher' 
    });
  }
});

// Delete teacher (admin only) - soft delete
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Teacher deactivated successfully'
    });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting teacher' 
    });
  }
});

module.exports = router;

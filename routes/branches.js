const express = require('express');
const Branch = require('../models/Branch');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all branches (public route)
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true })
      .select('name address')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      count: branches.length,
      data: branches
    });
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching branches' 
    });
  }
});

// Get all branches for admin (includes all fields)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const branches = await Branch.find()
      .sort({ name: 1 });
    
    res.json({
      success: true,
      count: branches.length,
      data: branches
    });
  } catch (error) {
    console.error('Get branches admin error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching branches' 
    });
  }
});

// Get single branch
router.get('/:id', async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    
    if (!branch) {
      return res.status(404).json({ 
        success: false, 
        message: 'Branch not found' 
      });
    }
    
    res.json({
      success: true,
      data: branch
    });
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching branch' 
    });
  }
});

// Create new branch (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, address, phone, email, description } = req.body;
    
    const branch = new Branch({
      name,
      address,
      phone,
      email,
      description
    });
    
    await branch.save();
    
    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: branch
    });
  } catch (error) {
    console.error('Create branch error:', error);
    
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
      message: 'Error creating branch' 
    });
  }
});

// Update branch (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, address, phone, email, description, isActive } = req.body;
    
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      {
        name,
        address,
        phone,
        email,
        description,
        isActive
      },
      { new: true, runValidators: true }
    );
    
    if (!branch) {
      return res.status(404).json({ 
        success: false, 
        message: 'Branch not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Branch updated successfully',
      data: branch
    });
  } catch (error) {
    console.error('Update branch error:', error);
    
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
      message: 'Error updating branch' 
    });
  }
});

// Delete branch (admin only) - soft delete
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!branch) {
      return res.status(404).json({ 
        success: false, 
        message: 'Branch not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Branch deactivated successfully'
    });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting branch' 
    });
  }
});

module.exports = router;

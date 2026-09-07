const express = require('express');
const multer = require('multer');
const Branch = require('../models/Branch');
const { authenticateAdmin } = require('../middleware/auth');
const { uploadScheduleFile, deleteScheduleFile } = require('../utils/r2');

const router = express.Router();

const allowedScheduleTypes = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
  ['application/pdf', 'pdf']
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedScheduleTypes.has(file.mimetype)) {
      return cb(new Error('Unsupported file type. Use PNG, JPG, WEBP or PDF.'));
    }
    cb(null, true);
  }
});

// Get all branches (public route)
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true })
      .select('name address phone description scheduleFileUrl scheduleFileType scheduleFileName scheduleYear scheduleUpdatedAt')
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
    const branches = await Branch.find().sort({ name: 1 });

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

// Upload/replace a branch schedule file (admin only)
router.put('/:id/schedule', authenticateAdmin, upload.single('schedule'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Schedule file is required' });
    }

    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    const extension = allowedScheduleTypes.get(req.file.mimetype);
    const fileKey = `schedules/${branch._id}/${Date.now()}.${extension}`;
    const fileUrl = await uploadScheduleFile({
      key: fileKey,
      buffer: req.file.buffer,
      contentType: req.file.mimetype
    });

    const oldKey = branch.scheduleFileKey;
    branch.scheduleFileUrl = fileUrl;
    branch.scheduleFileKey = fileKey;
    branch.scheduleFileType = req.file.mimetype;
    branch.scheduleFileName = req.file.originalname;
    branch.scheduleYear = (req.body.scheduleYear || '').trim();
    branch.scheduleUpdatedAt = new Date();
    await branch.save();

    if (oldKey && oldKey !== fileKey) {
      deleteScheduleFile(oldKey).catch(error => {
        console.error('Failed to delete previous schedule file:', error);
      });
    }

    res.json({
      success: true,
      message: 'Schedule uploaded successfully',
      data: branch
    });
  } catch (error) {
    console.error('Upload schedule error:', error);

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File is too large. Maximum size is 10MB.' });
    }

    if (error.message?.startsWith('Unsupported file type')) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: 'Error uploading schedule file' });
  }
});

// Delete a branch schedule file (admin only)
router.delete('/:id/schedule', authenticateAdmin, async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    const oldKey = branch.scheduleFileKey;
    branch.scheduleFileUrl = '';
    branch.scheduleFileKey = '';
    branch.scheduleFileType = '';
    branch.scheduleFileName = '';
    branch.scheduleYear = '';
    branch.scheduleUpdatedAt = null;
    await branch.save();

    if (oldKey) {
      await deleteScheduleFile(oldKey);
    }

    res.json({ success: true, message: 'Schedule removed successfully', data: branch });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ success: false, message: 'Error deleting schedule file' });
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

    const branch = new Branch({ name, address, phone, email, description });
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

    res.status(500).json({ success: false, message: 'Error creating branch' });
  }
});

// Update branch (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, address, phone, email, description, isActive } = req.body;

    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { name, address, phone, email, description, isActive },
      { new: true, runValidators: true }
    );

    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    res.json({ success: true, message: 'Branch updated successfully', data: branch });
  } catch (error) {
    console.error('Update branch error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: 'Validation error', errors });
    }

    res.status(500).json({ success: false, message: 'Error updating branch' });
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
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    res.json({ success: true, message: 'Branch deactivated successfully' });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ success: false, message: 'Error deleting branch' });
  }
});

module.exports = router;

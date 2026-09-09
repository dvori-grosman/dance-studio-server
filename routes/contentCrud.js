const express = require('express');
const { authenticateAdmin } = require('../middleware/auth');

function pickAllowedFields(source, allowedFields) {
  return allowedFields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) result[field] = source[field];
    return result;
  }, {});
}

function createContentRouter({ Model, allowedFields, label }) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const data = await Model.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
      res.json({ success: true, count: data.length, data });
    } catch (error) {
      console.error(`Get ${label} error:`, error);
      res.status(500).json({ success: false, message: `Error fetching ${label}` });
    }
  });

  router.get('/admin', authenticateAdmin, async (req, res) => {
    try {
      const data = await Model.find().sort({ sortOrder: 1, createdAt: 1 });
      res.json({ success: true, count: data.length, data });
    } catch (error) {
      console.error(`Get ${label} admin error:`, error);
      res.status(500).json({ success: false, message: `Error fetching ${label}` });
    }
  });

  router.post('/', authenticateAdmin, async (req, res) => {
    try {
      const item = new Model(pickAllowedFields(req.body, allowedFields));
      await item.save();
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      console.error(`Create ${label} error:`, error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }
      res.status(500).json({ success: false, message: `Error creating ${label}` });
    }
  });

  router.put('/:id', authenticateAdmin, async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(
        req.params.id,
        pickAllowedFields(req.body, allowedFields),
        { new: true, runValidators: true }
      );
      if (!item) return res.status(404).json({ success: false, message: `${label} not found` });
      res.json({ success: true, data: item });
    } catch (error) {
      console.error(`Update ${label} error:`, error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }
      res.status(500).json({ success: false, message: `Error updating ${label}` });
    }
  });

  router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
      if (!item) return res.status(404).json({ success: false, message: `${label} not found` });
      res.json({ success: true });
    } catch (error) {
      console.error(`Delete ${label} error:`, error);
      res.status(500).json({ success: false, message: `Error deleting ${label}` });
    }
  });

  return router;
}

module.exports = { createContentRouter };

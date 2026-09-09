const Lesson = require('../models/Lesson');
const { createContentRouter } = require('./contentCrud');

module.exports = createContentRouter({
  Model: Lesson,
  label: 'lesson',
  allowedFields: ['title', 'subtitle', 'description', 'features', 'duration', 'ages', 'levels', 'imageUrl', 'sortOrder', 'isActive']
});

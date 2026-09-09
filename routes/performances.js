const Performance = require('../models/Performance');
const { createContentRouter } = require('./contentCrud');

module.exports = createContentRouter({
  Model: Performance,
  label: 'performance',
  allowedFields: ['title', 'subtitle', 'description', 'imageUrl', 'alt', 'price', 'status', 'purchaseUrl', 'sortOrder', 'isActive']
});

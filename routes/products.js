const Product = require('../models/Product');
const { createContentRouter } = require('./contentCrud');

module.exports = createContentRouter({
  Model: Product,
  label: 'product',
  allowedFields: ['name', 'description', 'price', 'imageUrl', 'purchaseUrl', 'category', 'sortOrder', 'isActive']
});

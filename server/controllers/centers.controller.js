const Center = require('../models/Center');
const createCrudController = require('./crudFactory');

module.exports = createCrudController(Center, {
  searchFields: ['name', 'address', 'city'],
  filterFields: ['city'],
  defaultSort: { name: 1 },
});

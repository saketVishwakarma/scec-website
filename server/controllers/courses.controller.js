const Course = require('../models/Course');
const createCrudController = require('./crudFactory');

const base = createCrudController(Course, {
  searchFields: ['name', 'description', 'university'],
  filterFields: ['category', 'university'],
  defaultSort: { category: 1, name: 1 },
});

module.exports = {
  ...base,
  // expose course categories for frontend dropdowns
  getCategories: async (req, res) => {
    res.status(200).json({ success: true, data: Course.CATEGORIES });
  },
};

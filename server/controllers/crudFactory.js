/**
 * Generic CRUD controller factory.
 * Generates standard list/get/create/update/delete handlers for a Mongoose model.
 *
 * @param {mongoose.Model} Model
 * @param {Object} options
 *   - searchFields: array of field names to support ?search= text query
 *   - filterFields: array of field names allowed as exact-match query filters (e.g. ['category'])
 *   - defaultSort: sort object, default { createdAt: -1 }
 *   - publicFilter: extra filter applied for public (non-admin) GET requests, e.g. { isActive: true }
 */
const createCrudController = (Model, options = {}) => {
  const {
    searchFields = [],
    filterFields = [],
    defaultSort = { createdAt: -1 },
    publicFilter = { isActive: true },
  } = options;

  const buildQuery = (reqQuery, isPublic) => {
    const query = isPublic ? { ...publicFilter } : {};

    filterFields.forEach((field) => {
      if (reqQuery[field]) query[field] = reqQuery[field];
    });

    if (reqQuery.search && searchFields.length) {
      query.$or = searchFields.map((field) => ({
        [field]: { $regex: reqQuery.search, $options: 'i' },
      }));
    }

    return query;
  };

  return {
    // GET / (public — only active items, supports filters)
    getAll: async (req, res) => {
      const query = buildQuery(req.query, true);
      const items = await Model.find(query).sort(defaultSort);
      res.status(200).json({ success: true, count: items.length, data: items });
    },

    // GET /admin/all (admin — everything, supports filters)
    getAllAdmin: async (req, res) => {
      const query = buildQuery(req.query, false);
      const items = await Model.find(query).sort(defaultSort);
      res.status(200).json({ success: true, count: items.length, data: items });
    },

    // GET /:id
    getOne: async (req, res) => {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
      res.status(200).json({ success: true, data: item });
    },

    // POST /
    create: async (req, res) => {
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item });
    },

    // PUT /:id
    update: async (req, res) => {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
      res.status(200).json({ success: true, data: item });
    },

    // DELETE /:id
    remove: async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
      res.status(200).json({ success: true, message: 'Deleted successfully', data: {} });
    },
  };
};

module.exports = createCrudController;

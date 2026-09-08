/**
 * Reusable controller factory for simple CRUD resources
 * (skills, experience, education, certifications, projects).
 * GET routes are public; write routes are admin-only.
 */
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const parseOrder = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const crudFactory = (Model, { label = 'Resource', sortable = true } = {}) => {
  const getAll = async (req, res, next) => {
    try {
      const query = Model.find();
      if (sortable) query.sort({ order: 1, createdAt: 1 });
      const items = await query.lean();
      res.json({ success: true, count: items.length, data: items });
    } catch (err) {
      next(err);
    }
  };

  const getById = async (req, res, next) => {
    try {
      const item = await Model.findById(req.params.id).lean();
      if (!item) throw new HttpError(404, `${label} not found`);
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  };

  const create = async (req, res, next) => {
    try {
      if (req.body.order === undefined) {
        const last = await Model.findOne().sort({ order: -1 }).select('order').lean();
        req.body.order = last ? last.order + 1 : 0;
      }
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  };

  const update = async (req, res, next) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) throw new HttpError(404, `${label} not found`);
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  };

  const remove = async (req, res, next) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) throw new HttpError(404, `${label} not found`);
      res.json({ success: true, message: `${label} deleted` });
    } catch (err) {
      next(err);
    }
  };

  const reorder = async (req, res, next) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new HttpError(400, 'ids array is required');
      }
      const ops = ids.map((id, index) => ({
        updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
      }));
      await Model.bulkWrite(ops);
      const items = await Model.find().sort({ order: 1, createdAt: 1 }).lean();
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  };

  return { getAll, getById, create, update, remove, reorder };
};

module.exports = { crudFactory, HttpError };

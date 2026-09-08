const { crudFactory } = require('../utils/crudFactory');
const { adminOnly } = require('../middleware/auth');

/**
 * Builds a standard public-GET / admin-write CRUD router for a model.
 * Routes: GET /, GET /:id, POST /, PUT /:id, DELETE /:id, PUT /reorder
 * NOTE: a fresh router instance is created per call.
 */
const crudRouter = (Model, options) => {
  const router = require('express').Router();
  const c = crudFactory(Model, options);

  router.get('/', c.getAll);
  router.get('/:id', c.getById);
  router.post('/', adminOnly, c.create);
  router.put('/reorder', adminOnly, c.reorder);
  router.put('/:id', adminOnly, c.update);
  router.delete('/:id', adminOnly, c.remove);

  return router;
};

module.exports = crudRouter;

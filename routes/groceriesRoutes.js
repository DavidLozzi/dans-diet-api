module.exports = (app, router) => {
  var groceries = require('../controllers/groceriesController'),
    authMiddleware = require('../middlewares/auth.validation.middleware'),
    path = '/groceries/:keyword';

  router.use(path, authMiddleware.validJWTNeeded);

  router.get(path, groceries.search);

  app.use('/', router);
};
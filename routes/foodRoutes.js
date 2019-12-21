module.exports = (app, router) => {
  var food = require('../controllers/foodController'),
    authMiddleware = require('../middlewares/auth.validation.middleware'),
    perms = require('../common/perms'),
    path = '/food',
    pathWithId = `${path}/:foodId`;

  router.use(path, authMiddleware.validJWTNeeded);

  router.get(path, food.list);
  router.get(pathWithId, food.one);
  router.post(path, food.create);
  router.put(pathWithId, food.update);
  router.delete(pathWithId, food.delete);

  app.use('/', router);
};
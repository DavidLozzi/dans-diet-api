module.exports = (app, router) => {
  var diet = require('../controllers/dietController'),
    authMiddleware = require('../middlewares/auth.validation.middleware'),
    perms = require('../common/perms'),
    path = '/diet',
    pathWithId = `${path}/:dietId`;

  router.use(path, authMiddleware.validJWTNeeded);

  router.get(path, diet.list);
  router.post(path, diet.create);

  // router.get(pathWithId, user.read);
  // router.put(pathWithId, user.update);
  // router.delete(pathWithId,
  //   authMiddleware.minimumPermissionLevelRequired(perms.ADMIN),
  //   user.delete
  // );

  app.use('/', router);
};
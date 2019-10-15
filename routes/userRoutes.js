'use strict';

module.exports = (app, router) => {
  var user = require('../controllers/userController'),
    authMiddleware = require('../middlewares/auth.validation.middleware'),
    perms = require('../common/perms'),
    path = '/users',
    pathWithId = `${path}/:userId`;

  router.use(path, authMiddleware.validJWTNeeded);

  router.get(path, user.list);
  router.post(path, user.create);

  router.get(pathWithId, user.read);
  router.put(pathWithId, user.update);
  router.delete(pathWithId,
    authMiddleware.minimumPermissionLevelRequired(perms.ADMIN),
    user.delete
  );

  app.use('/', router);
};
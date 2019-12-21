module.exports = (app, router) => {
  var diet = require('../controllers/dietController'),
    authMiddleware = require('../middlewares/auth.validation.middleware'),
    perms = require('../common/perms'),
    path = '/diet',
    pathWithId = `${path}/:dietId`;

  router.use(path, authMiddleware.validJWTNeeded);

  router.get(path, diet.list);
  router.get(pathWithId, diet.one);
  router.post(path, diet.create);
  router.post(`${pathWithId}/share`, diet.share);
  router.post(`${pathWithId}/unshare`, diet.unshare);
  router.put(pathWithId, diet.update);
  router.delete(pathWithId, diet.delete);

  app.use('/', router);
};
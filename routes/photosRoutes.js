module.exports = (app, router) => {
  var photos = require('../controllers/photosController'),
    authMiddleware = require('../middlewares/auth.validation.middleware'),
    path = '/photos/:keyword';

  router.use(path, authMiddleware.validJWTNeeded);

  router.get(path, photos.search);

  app.use('/', router);
};
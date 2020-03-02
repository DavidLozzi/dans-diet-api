'use strict';

module.exports = (app, router) => {
  var user = require('../controllers/userController'),
    path = '/signup';

  router.post(path, user.create);

  app.use('/', router);

  console.log('signup routes set');
};
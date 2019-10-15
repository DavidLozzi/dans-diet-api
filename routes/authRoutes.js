module.exports = (app) => {
  var auth = require('../controllers/authController'),
    path = '/auth';

  app.route(path)
    .post(auth.auth);
};
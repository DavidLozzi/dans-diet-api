module.exports = (app) => {
  var diet = require('../controllers/dietController'),
    path = '/view/:shareId';

  app.route(path)
    .get(diet.viewShared);
};
var mongoose = require('mongoose'),
  pick = require('lodash.pick'),
  perms = require('../common/perms'),
  User = mongoose.model('Users'),
  utils = require('../common/utils');


exports.list = (req, res) => {
  User.find({}, 'email first_name last_name created permissions _id', (err, user) => {
    if (err)
      res.send(err);
    
    res.json(user);
  });
};


exports.create = (req, res) => {
  console.log('creating user ', req.body.email);
  req.body.password = utils.hashPassword(req.body.password);

  var new_user = new User(req.body);
  if(req.path = '/signup') {
    new_user.permissions = perms.NORMAL;
  }

  new_user.save((err, user) => {
    if (err)
      res.send(err);
    res.json(pick(user,['_id', 'last_name', 'first_name', 'email', 'created']));
  });
};


exports.read = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.update = (req, res) => {
  req.body.password = hashPassword(req.body.password);

  User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true},
    (err, user) => {
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.delete = (req, res) => {
  console.log(`deleting ${req.params.userId}`);
  User.remove({
    _id: req.params.userId
  }, (err, user) => {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted' });
  });
};

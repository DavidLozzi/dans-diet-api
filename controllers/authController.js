var mongoose = require('mongoose'),
  User = mongoose.model('Users'),
  crypto = require('crypto'),
  config = require('../common/config'),
  jwt = require('jsonwebtoken');

exports.auth = (req, res) => {
  console.log(`AUTH: attempting auth for ${req.body.email}`);
  if(req.body.email && req.body.password) {
    User.find({ 'email': req.body.email }, (err, user) => {
      if(user.length === 0) {
        res.status(403).send({ message: 'Invalid account.' });
        console.log(`AUTH: ${req.body.email} is invalid`);
      } else {
        var passwordFields = user[0].password.split('$');
        var salt = passwordFields[0];
        var savedPwd = passwordFields[1];

        var hashPwd = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');

        if(savedPwd === hashPwd){
          var token = jwt.sign({ uid: user[0]._id, email: user[0].email, perms: user[0].permissions }, config.secret, { expiresIn: 86400 });
          res.status(200).send({auth: true, token: token });
          console.log(`AUTH: successful for ${req.body.email}`)
        } else {
          res.status(401).send({ message: 'Invalid account / password.' });
          console.log(`AUTH: wrong username/password for ${req.body.email}`)
        }
      }
    });
  } else {
    res.status(404).send({message: 'Email and Password are required'});
    console.log('AUTH: user name and password required');
  }
};

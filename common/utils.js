var crypto = require('crypto');

exports.hashPassword = (password) => {
  var salt = crypto.randomBytes(16).toString('base64');
  var hash = crypto.createHmac('sha512', salt).update(password).digest('base64');
  return salt + '$' + hash;
};
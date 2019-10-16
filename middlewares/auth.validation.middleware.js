var jwt = require('jsonwebtoken'),
  config = require('../common/config');

exports.validJWTNeeded = (req, res, next) => {
  if (req.headers['authorization']) {
    try {
      let authorization = req.headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        return res.status(401).send();
      } else {
        req.jwt = jwt.verify(authorization[1], config.secret);
        return next();
      }
    } catch (err) {
      return res.status(403).send();
    }
  } else {
    return res.status(401).send();
  }
};

exports.minimumPermissionLevelRequired = (required_permission_level) => {
  return (req, res, next) => {
    let user_permission_level = parseInt(req.jwt.perms);
    if (user_permission_level & required_permission_level) {
      return next();
    } else {
      return res.status(403).send();
    }
  };
};

exports.requestingUser = async (headers) => {
  if (headers['authorization']) {
    try {
      let authorization = headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        throw new Error('401');
      } else {
        let user;
        await jwt.verify(authorization[1], config.secret, (err, decoded) => {
          user = decoded;
        });
        return user;
      }
    } catch (err) {
      throw new Error('403');
    }
  } else {
    throw new Error('401');
  }
}
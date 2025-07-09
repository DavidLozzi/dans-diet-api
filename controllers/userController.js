const pick = require('lodash.pick');
const perms = require('../common/perms');
const User = require('../models/userModel');
const utils = require('../common/utils');

exports.list = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users.map(user => pick(user, ['id', 'email', 'first_name', 'last_name', 'created', 'permissions'])));
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.create = async (req, res) => {
  try {
    console.log('creating user ', req.body.email);
    req.body.password = utils.hashPassword(req.body.password);

    if (req.path === '/signup') {
      req.body.permissions = perms.NORMAL;
    }

    const user = await User.create(req.body);
    res.json(pick(user, ['id', 'last_name', 'first_name', 'email', 'created']));
  } catch (err) {
    if (err.message === 'User with this email already exists') {
      res.status(409).send({ error: err.message });
    } else {
      res.status(500).send(err);
    }
  }
};

exports.read = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = utils.hashPassword(req.body.password);
    }

    const user = await User.updateById(req.params.userId, req.body);
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.delete = async (req, res) => {
  try {
    console.log(`deleting ${req.params.userId}`);
    const result = await User.deleteById(req.params.userId);
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

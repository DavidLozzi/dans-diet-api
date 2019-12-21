var mongoose = require('mongoose'),
  pick = require('lodash.pick'),
  Food = mongoose.model('Foods'),
  ObjectId = mongoose.Types.ObjectId,
  utils = require('../common/utils'),
  authMiddleware = require('../middlewares/auth.validation.middleware');


exports.list = async (req, res) => {
  const userFromReq = await authMiddleware.requestingUser(req.headers);
  Food.find({userId: userFromReq.uid}, (err, food) => {
    if (err)
      res.send(err);

    res.json(food);
  });
};

exports.one = async (req, res) => {
  const userFromReq = await authMiddleware.requestingUser(req.headers);
  Food.find({userId: userFromReq.uid, _id: req.params.foodId}, (err, food) => {
    if (err)
      res.send(err);

    res.json(food[0]);
  });
};

exports.create = async (req, res) => {
  console.log('creating food');

  const userFromReq = await authMiddleware.requestingUser(req.headers);
  const userFood = { ...req.body, userId: ObjectId(userFromReq.uid), dietId: ObjectId(req.body.dietId) };
  console.log(userFood);
  var newFood = new Food(userFood);
  newFood.save((err, food) => {
    if (err)
      res.send(err);

    this.list(req, res);
  })
};

exports.update = async (req, res) => {
  console.log('updating food');

  const userFromReq = await authMiddleware.requestingUser(req.headers);
  const userFood = { ...req.body, userId: userFromReq.uid };
  console.log(userFood);
  Food.findOneAndUpdate({_id: req.params.foodId, userId: userFromReq.uid}, userFood,
    (err, food) => {
      if (err)
        res.send(err);

      this.list(req, res);
    });
};

exports.delete = async (req, res) => {
  console.log('deleting food');

  const userFromReq = await authMiddleware.requestingUser(req.headers);
  Food.remove({ _id: req.params.foodId, userId: userFromReq.uid },
    (err) => {
      if (err)
        res.send(err);
      
        this.list(req, res);
    });
};

// exports.read = (req, res) => {
//   User.findById(req.params.userId, (err, user) => {
//     if (err)
//       res.send(err);
//     res.json(user);
//   });
// };


// exports.update = (req, res) => {
//   req.body.password = hashPassword(req.body.password);

//   User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true},
//     (err, user) => {
//     if (err)
//       res.send(err);
//     res.json(user);
//   });
// };


// exports.delete = (req, res) => {
//   console.log(`deleting ${req.params.userId}`);
//   User.remove({
//     _id: req.params.userId
//   }, (err, user) => {
//     if (err)
//       res.send(err);
//     res.json({ message: 'User successfully deleted' });
//   });
// };

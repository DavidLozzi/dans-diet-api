var mongoose = require('mongoose'),
  pick = require('lodash.pick'),
  Diet = mongoose.model('Diets'),
  ObjectId = mongoose.Types.ObjectId,
  Food = mongoose.model('Foods'),
  utils = require('../common/utils'),
  foodUtils = require('../common/foodUtils'),
  authMiddleware = require('../middlewares/auth.validation.middleware');


exports.list = async (req, res) => {
  const userFromReq = await authMiddleware.requestingUser(req.headers);
  
  // db.diets.aggregate([{$lookup: {from: 'foods', localField: '_id', foreignField: 'dietId', as: 'foods'}},{$project: {_id:'$_id',name:'$name',category:'$category',numOfFood:{$size:'$foods'}}}]).pretty()

  Diet.find({ userId: ObjectId(userFromReq.uid) }, (err, diet) => {
    if (err)
      res.send(err);

    res.json(diet);
  });
};

exports.one = async (req, res) => {
  const userFromReq = await authMiddleware.requestingUser(req.headers);
  Diet.aggregate([
    {
      $match: {
        userId: ObjectId(userFromReq.uid),
        _id: ObjectId(req.params.dietId)
      }
    },
    {
      $lookup: {
        from: 'foods',
        localField: '_id',
        foreignField: 'dietId',
        as: 'foods'
      }
    }
  ])
    .then((diet) => {
      res.json(diet.length > 0 ? diet[0] : {});
    });
};

exports.viewShared = (req, res) => {
  const shareId = req.params.shareId;
  console.log(`viewing shared diet ${shareId}`);

  Diet.aggregate([
    {
      $match: {
        shareId,
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $addFields: {
        user: {
          $map: {
            input:'$user',
            in:{
              first_name:'$$this.first_name'
            }
          }
        }
      }
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'foods',
        localField: '_id',
        foreignField: 'dietId',
        as: 'foods'
      }
    }
  ])
    .then((diet) => {
      if (diet && diet.length === 1)
        res.json(diet[0]);
      else
        res.status(404).send({ message: `${shareId} not found` });
    });

};

exports.create = async (req, res) => {
  console.log('creating diet');

  const userFromReq = await authMiddleware.requestingUser(req.headers);
  const userDiet = { ...req.body, userId: ObjectId(userFromReq.uid) };
  console.log(userDiet);
  var newDiet = new Diet(userDiet);
  newDiet.save((err, diet) => {
    if (err)
      res.send(err);

    this.list(req, res);
  })
};

exports.share = async (req, res) => {
  console.log('sharing diet');

  const userFromReq = await authMiddleware.requestingUser(req.headers);
  const shareId = await utils.getUniqueShareId();
  const isShared = true;
  const userDiet = { ...req.body, userId: ObjectId(userFromReq.uid), shareId, isShared };
  console.log(userDiet);
  Diet.findOneAndUpdate({ _id: req.params.dietId, userId: userFromReq.uid }, userDiet,
    (err, diet) => {
      if (err)
        res.send(err);

    })
    .then((diet) => {
      this.one(req, res);
    });
};

exports.unshare = async (req, res) => {
  console.log('unsharing diet');

  const userFromReq = await authMiddleware.requestingUser(req.headers);
  const shareId = undefined;
  const isShared = false;
  const userDiet = { ...req.body, userId: ObjectId(userFromReq.uid), shareId, isShared };
  console.log(userDiet);
  Diet.findOneAndUpdate({ _id: req.params.dietId, userId: userFromReq.uid }, userDiet,
    (err, diet) => {
      if (err)
        res.send(err);
    })
    .then((diet) => {
      this.one(req, res);
    });
};

exports.update = async (req, res) => {
  console.log('updating diet');

  const userFromReq = await authMiddleware.requestingUser(req.headers);
  const userDiet = { ...req.body, userId: ObjectId(userFromReq.uid) };
  console.log(userDiet);
  Diet.findOneAndUpdate({ _id: req.params.dietId, userId: userFromReq.uid }, userDiet,
    (err, diet) => {
      if (err)
        res.send(err);

      this.list(req, res);
    });
};

exports.delete = async (req, res) => {
  console.log('deleting diet');

  const userFromReq = await authMiddleware.requestingUser(req.headers);
  Diet.remove({ _id: req.params.dietId, userId: ObjectId(userFromReq.uid) },
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

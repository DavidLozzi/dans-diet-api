var mongoose = require('mongoose'),
  Food = mongoose.model('Foods');

exports.getFoodForDiet = async (userId, dietId) => {
  Food.find({userId, dietId}, (err, food) => {
    if (err)
      throw err;

    return food;
  });
};
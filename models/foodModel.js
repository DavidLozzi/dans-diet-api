var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FoodSchema = new Schema({
  userId: String,
  dietId: String,
  name: String,
  category: String,
  notes: String,
  restriction: String,
  alternativeId: String, // food id
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Foods', FoodSchema);
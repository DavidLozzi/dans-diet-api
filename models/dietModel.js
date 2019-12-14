var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DietSchema = new Schema({
  title: String,
  description: String,
  shareId: String,
  userId: mongoose.Schema.Types.ObjectId,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Diets', DietSchema);
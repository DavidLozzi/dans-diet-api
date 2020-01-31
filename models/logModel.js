var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LogSchema = new Schema({
  userId: mongoose.Schema.Types.ObjectId,
  dietId: mongoose.Schema.Types.ObjectId,
  date: {
    type: Date,
    default: Date.now
  },
  code: String,
  details: String
});

module.exports = mongoose.model('Log', LogSchema);
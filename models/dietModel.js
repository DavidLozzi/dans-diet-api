var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DietSchema = new Schema({
  title: String,
  description: String,
  shareId: String,
  isShared: Boolean,
  userId: Schema.Types.ObjectId,
  created: {
    type: Date,
    default: Date.now
  },
  photo: {
    id: String,
    color: String,
    imageUrl: String,
    thumbnailUrl: String,
    sourceUrl: String,
    user: {
      id: String,
      username: String,
      name: String
    }
  }
});

module.exports = mongoose.model('Diets', DietSchema);
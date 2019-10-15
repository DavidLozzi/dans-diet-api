var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  perms = '../common/perms';

var UserSchema = new Schema({
  email: String,
  first_name: String,
  last_name: String,
  password: String,
  created: {
    type: Date,
    default: Date.now
  },
  permissions: {
    type: Number,
    default: perms.NORMAL
  }
});

module.exports = mongoose.model('Users', UserSchema);
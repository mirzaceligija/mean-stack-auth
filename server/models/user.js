const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, select: false },
  password: { type: String, required: true, select: false },
  isActivated: { type: Boolean, required: true, default: false },
  temporaryToken: { type: String, required: true }
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);

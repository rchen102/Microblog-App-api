const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },  // unique is not a validator, it just allow mongo do some optimization
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // use to work as a validator

module.exports = mongoose.model('User', userSchema);

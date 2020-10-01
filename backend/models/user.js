const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// mongoose needs a model to work with it
// 1. name of the model, 2. schema
module.exports = mongoose.model('User', userSchema);

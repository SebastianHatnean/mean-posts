const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postCreator: { type: String }
});

// mongoose needs a model to work with it

// 1. name of the model, 2. schema
module.exports = mongoose.model('Post', postSchema);

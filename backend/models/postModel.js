const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  post_content: { type: String, required: true },
  time_stamp: { type: Date, default: Date.now()},
  post_author: { type: Schema.Types.ObjectId, ref: "User" },
  post_comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  post_likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
})

module.exports = mongoose.model("Post", PostSchema);
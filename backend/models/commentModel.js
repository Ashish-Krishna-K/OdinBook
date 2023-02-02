const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment_content: { type: String, required: true },
  time_stamp: { type: Date, default: Date.now() },
  comment_author: { type: Schema.Types.ObjectId, ref: "User" },
  parent_post: { type: Schema.Types.ObjectId, ref: "Post" },
  comment_likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
})

module.exports = mongoose.model("Comment", CommentSchema);
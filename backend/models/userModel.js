const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  uid: { type: String },
  email: { type: String },
  display_name: { type: String },
  display_picture: { type: String },
  friends_list: [{ type: Schema.Types.ObjectId, ref: "User" }],
  friend_requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  posts_list: [{ type: Schema.Types.ObjectId, ref: "Post" }]
})

module.exports = mongoose.model("User", UserSchema);
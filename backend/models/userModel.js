const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    uid: { type: String },
    email: { type: String },
    display_name: { type: String },
    friends_list: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friend_requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    posts_list: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
    status_online: { type: Boolean }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

// eslint-disable-next-line func-names
UserSchema.virtual('display_picture').get(function () {
  return `https://graph.facebook.com/${this.uid}/picture?width=200&height=200&access_token=${process.env.FACEBOOK_CLIENT_TOKEN}`;
});

module.exports = mongoose.model('User', UserSchema);

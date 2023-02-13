const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    type: { type: String },
    message: { type: String },
    for: { type: Schema.Types.ObjectId, ref: 'User' },
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    time_stamp: { type: Date, default: Date.now() },
    is_read: { type: Boolean, default: false }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

module.exports = mongoose.model('Notification', NotificationSchema);

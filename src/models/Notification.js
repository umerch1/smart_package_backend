const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: [true, 'Subscription is required']
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: ['Renewal', 'Expiry']
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true
    },
    notificationDate: {
      type: Date,
      required: [true, 'Notification date is required']
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

notificationSchema.index(
  { userId: 1, subscriptionId: 1, type: 1, notificationDate: 1 },
  { unique: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
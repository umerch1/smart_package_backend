const mongoose = require('mongoose');

const subscriptionHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: [true, 'Subscription is required'],
    index: true
  },
  packageName: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
    maxlength: [150, 'Package name must be 150 characters or fewer']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  renewalDate: {
    type: Date,
    required: [true, 'Renewal date is required']
  },
  expiryDate: {
    type: Date
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    trim: true
  },
  recordedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('SubscriptionHistory', subscriptionHistorySchema);
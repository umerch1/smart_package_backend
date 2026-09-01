const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
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
      required: [true, 'Category is required'],
      enum: ['Entertainment', 'Bills', 'Health', 'Education', 'Finance', 'Mobile Package', 'Streaming', 'Gym', 'Utility', 'Software', 'Other']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    amount: {
      type: Number,
      min: [0, 'Amount cannot be negative']
    },
    renewalDate: {
      type: Date,
      required: [true, 'Renewal date is required']
    },
    expiryDate: {
      type: Date
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes must be 500 characters or fewer']
    },
    usagePattern: {
      type: String,
      trim: true,
      maxlength: [100, 'Usage pattern must be 100 characters or fewer']
    },
    status: {
      type: String,
      enum: ['Active', 'Upcoming', 'Expired'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
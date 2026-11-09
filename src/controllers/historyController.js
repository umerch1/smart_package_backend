const SubscriptionHistory = require('../models/SubscriptionHistory');
const PaymentHistory = require('../models/PaymentHistory');

const getSubscriptionHistory = async (req, res, next) => {
  try {
    const subscriptionHistory = await SubscriptionHistory.find({
      userId: req.user._id
    }).sort({ recordedAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Subscription history retrieved successfully',
      data: { subscriptionHistory }
    });
  } catch (error) {
    return next(error);
  }
};

const getPaymentHistory = async (req, res, next) => {
  try {
    const paymentHistory = await PaymentHistory.find({
      userId: req.user._id
    }).sort({ paymentDate: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Payment history retrieved successfully',
      data: { paymentHistory }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getSubscriptionHistory, getPaymentHistory };
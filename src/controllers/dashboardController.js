const Subscription = require('../models/Subscription');
const { getSubscriptionStatus } = require('../utils/subscriptionStatus');

const getDashboard = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user._id })
      .select('renewalDate status')
      .lean();
    const counts = subscriptions.reduce((result, subscription) => {
      result[getSubscriptionStatus(subscription)] += 1;
      return result;
    }, { Active: 0, Upcoming: 0, Expired: 0 });
    const activeSubscriptions = counts.Active;
    const upcomingSubscriptions = counts.Upcoming;
    const expiredSubscriptions = counts.Expired;

    return res.status(200).json({
      success: true,
      message: 'Dashboard retrieved successfully',
      data: {
        totalActiveSubscriptions: activeSubscriptions,
        activeSubscriptions,
        upcomingSubscriptions,
        expiredSubscriptions
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getDashboard };
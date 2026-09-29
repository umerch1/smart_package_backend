const Subscription = require('../models/Subscription');

const getDashboard = async (req, res, next) => {
  try {
    const [activeSubscriptions, upcomingSubscriptions, expiredSubscriptions] = await Promise.all([
      Subscription.countDocuments({ userId: req.user._id, status: 'Active' }),
      Subscription.countDocuments({ userId: req.user._id, status: 'Upcoming' }),
      Subscription.countDocuments({ userId: req.user._id, status: 'Expired' })
    ]);

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
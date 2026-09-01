const Subscription = require('../models/Subscription');
const { generateRecommendations } = require('../services/recommendationService');

const getRecommendations = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({
      userId: req.user._id
    }).sort({ renewalDate: 1 });

    return res.status(200).json({
      success: true,
      message: 'Recommendations retrieved successfully',
      data: { recommendations: generateRecommendations(subscriptions) }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getRecommendations };
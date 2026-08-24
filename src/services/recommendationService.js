const RENEWAL_WINDOW_DAYS = 7;

const startOfDay = (date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
};

const daysUntil = (date, today) => {
  const renewalDate = startOfDay(date);
  const currentDate = startOfDay(today);
  return Math.ceil((renewalDate - currentDate) / (24 * 60 * 60 * 1000));
};

const recommendationFor = (subscription, suffix, explanation) => ({
  id: `${subscription._id}-${suffix}`,
  title: 'Subscription Recommendation',
  explanation,
  relatedSubscription: subscription.packageName
});

const generateRecommendations = (subscriptions, today = new Date()) => {
  const recommendations = [];

  subscriptions.forEach((subscription) => {
    if (subscription.usagePattern?.trim().toLowerCase() === 'rarely used') {
      recommendations.push(
        recommendationFor(
          subscription,
          'low-usage',
          'Consider reviewing this subscription because it has low usage.'
        )
      );
    }

    if (subscription.status === 'Expired') {
      recommendations.push(
        recommendationFor(
          subscription,
          'expired',
          'This subscription has expired. Review its status to keep your subscription list current.'
        )
      );
    }

    if (
      subscription.renewalDate &&
      daysUntil(subscription.renewalDate, today) >= 0 &&
      daysUntil(subscription.renewalDate, today) <= RENEWAL_WINDOW_DAYS
    ) {
      recommendations.push(
        recommendationFor(
          subscription,
          'renewal',
          'Review this subscription before its next renewal.'
        )
      );
    }
  });

  return recommendations;
};

module.exports = { generateRecommendations };
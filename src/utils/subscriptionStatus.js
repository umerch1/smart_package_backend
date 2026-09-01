const UPCOMING_WINDOW_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const startOfUtcDay = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

const getSubscriptionStatus = (subscription, today = new Date()) => {
  const startDay = startOfUtcDay(subscription.startDate);
  const renewalDay = startOfUtcDay(subscription.renewalDate);
  const todayDay = startOfUtcDay(today);

  if (renewalDay === null || todayDay === null) return subscription.status || 'Active';
  if (startDay !== null && startDay > todayDay) return 'Upcoming';
  if (renewalDay < todayDay) return 'Expired';
  if (renewalDay <= todayDay + UPCOMING_WINDOW_DAYS * MS_PER_DAY) return 'Upcoming';
  return 'Active';
};

module.exports = { getSubscriptionStatus, UPCOMING_WINDOW_DAYS };

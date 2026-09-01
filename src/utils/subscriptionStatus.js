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
  if (renewalDay < todayDay) return 'Expired';
  if (startDay !== null && startDay > todayDay) return 'Upcoming';
  return 'Active';
};

module.exports = { getSubscriptionStatus };



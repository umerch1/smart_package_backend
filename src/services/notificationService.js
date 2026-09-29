const Notification = require('../models/Notification');
const Subscription = require('../models/Subscription');

const REMINDER_WINDOW_DAYS = 7;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const startOfToday = () => {
  const today = new Date();
  return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
};

const getNotificationDetails = (subscription, type, notificationDate) => {
  const isRenewal = type === 'Renewal';
  return {
    userId: subscription.userId,
    subscriptionId: subscription._id,
    type,
    title: isRenewal ? 'Subscription renewal approaching' : 'Subscription expiry approaching',
    message: isRenewal
      ? `${subscription.packageName} renews soon.`
      : `${subscription.packageName} expires soon.`,
    notificationDate
  };
};

const createNotificationsForUser = async (userId) => {
  const today = startOfToday();
  const reminderLimit = new Date(today.getTime() + REMINDER_WINDOW_DAYS * DAY_IN_MILLISECONDS);
  const subscriptions = await Subscription.find({
    userId,
    $or: [
      { renewalDate: { $gte: today, $lte: reminderLimit } },
      { expiryDate: { $gte: today, $lte: reminderLimit } }
    ]
  });

  const notifications = [];
  for (const subscription of subscriptions) {
    const dates = [
      ['Renewal', subscription.renewalDate],
      ['Expiry', subscription.expiryDate]
    ];

    for (const [type, date] of dates) {
      if (!date) {
        continue;
      }

      const notificationDate = new Date(date);
      notificationDate.setUTCHours(0, 0, 0, 0);
      if (notificationDate < today || notificationDate > reminderLimit) {
        continue;
      }

      const notification = await Notification.findOneAndUpdate(
        { userId, subscriptionId: subscription._id, type, notificationDate },
        { $setOnInsert: getNotificationDetails(subscription, type, notificationDate) },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      notifications.push(notification);
    }
  }

  return notifications;
};

module.exports = { createNotificationsForUser };
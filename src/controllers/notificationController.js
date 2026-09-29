const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const { createNotificationsForUser } = require('../services/notificationService');

const getNotifications = async (req, res, next) => {
  try {
    await createNotificationsForUser(req.user._id);
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ notificationDate: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: { notifications }
    });
  } catch (error) {
    return next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { isRead: true } },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: { notification }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getNotifications, markNotificationAsRead };
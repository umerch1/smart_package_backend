const mongoose = require("mongoose");
const Subscription = require("../models/Subscription");
const { getSubscriptionStatus } = require("../utils/subscriptionStatus");

const subscriptionFields = [
  "packageName",
  "category",
  "startDate",
  "amount",
  "renewalDate",
  "expiryDate",
  "notes",
  "usagePattern",
];

const getSubscriptionData = (body) =>
  subscriptionFields.reduce((data, field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
    return data;
  }, {});

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const serializeSubscription = (subscription) => ({
  ...subscription.toObject(),
  status: getSubscriptionStatus(subscription),
});
const refreshStatuses = async (subscriptions) => {
  const operations = subscriptions
    .map((subscription) => ({
      subscription,
      status: getSubscriptionStatus(subscription),
    }))
    .filter(({ subscription, status }) => subscription.status !== status)
    .map(({ subscription, status }) => ({
      updateOne: {
        filter: { _id: subscription._id },
        update: { $set: { status } },
      },
    }));

  if (operations.length > 0) await Subscription.bulkWrite(operations);
};

const createSubscription = async (req, res, next) => {
  try {
    const subscriptionData = getSubscriptionData(req.body);
    const subscription = await Subscription.create({
      ...subscriptionData,
      status: getSubscriptionStatus(subscriptionData),
      userId: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: { subscription: serializeSubscription(subscription) },
    });
  } catch (error) {
    return next(error);
  }
};

const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({
      userId: req.user._id,
    }).sort({ renewalDate: 1 });
    await refreshStatuses(subscriptions);

    return res.status(200).json({
      success: true,
      message: "Subscriptions retrieved successfully",
      data: { subscriptions: subscriptions.map(serializeSubscription) },
    });
  } catch (error) {
    return next(error);
  }
};

const getSubscription = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }

    const subscription = await Subscription.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }
    await refreshStatuses([subscription]);

    return res.status(200).json({
      success: true,
      message: "Subscription retrieved successfully",
      data: { subscription: serializeSubscription(subscription) },
    });
  } catch (error) {
    return next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }

    const currentSubscription = await Subscription.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!currentSubscription) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }

    const updates = getSubscriptionData(req.body);
    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { ...updates, status: getSubscriptionStatus({ ...currentSubscription.toObject(), ...updates }) } },
      { new: true, runValidators: true },
    );
    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: { subscription: serializeSubscription(subscription) },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteSubscription = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }

    const subscription = await Subscription.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
      data: { subscription },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
};

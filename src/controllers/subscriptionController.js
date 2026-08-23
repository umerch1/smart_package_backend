const mongoose = require("mongoose");
const Subscription = require("../models/Subscription");

const subscriptionFields = [
  "packageName",
  "category",
  "price",
  "renewalDate",
  "expiryDate",
  "usagePattern",
  "status",
];

const getSubscriptionData = (body) =>
  subscriptionFields.reduce((data, field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
    return data;
  }, {});

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...getSubscriptionData(req.body),
      userId: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: { subscription },
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

    return res.status(200).json({
      success: true,
      message: "Subscriptions retrieved successfully",
      data: { subscriptions },
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

    return res.status(200).json({
      success: true,
      message: "Subscription retrieved successfully",
      data: { subscription },
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

    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: getSubscriptionData(req.body) },
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
      data: { subscription },
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

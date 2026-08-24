const express = require('express');
const {
  getSubscriptionHistory,
  getPaymentHistory
} = require('../controllers/historyController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/subscriptions', getSubscriptionHistory);
router.get('/payments', getPaymentHistory);

module.exports = router;
const express = require('express');
const {
  createSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
  deactivateSubscription,
  reactivateSubscription
} = require('../controllers/subscriptionController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').post(createSubscription).get(getSubscriptions);
router.route('/:id/deactivate').put(deactivateSubscription);
router.route('/:id/reactivate').put(reactivateSubscription);
router.route('/:id').get(getSubscription).put(updateSubscription).delete(deleteSubscription);

module.exports = router;
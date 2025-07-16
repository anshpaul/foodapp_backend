const express = require('express');
const router = express.Router();
const {
  createOrUpdateRestaurant,
  getPendingRestaurants,
  approveRestaurant,
  deleteRestaurant,
  getApprovedRestaurants
} = require('../controllers/restaurantController');

const { protect, isAdmin } = require('../middleware/auth');

// ✅ Restaurant creates or updates their profile
router.post('/', protect, createOrUpdateRestaurant);

// ✅ Admin actions
router.get('/pending', protect, isAdmin, getPendingRestaurants);
router.patch('/approve/:id', protect, isAdmin, approveRestaurant);
router.delete('/:id', protect, isAdmin, deleteRestaurant);

// ✅ Public route (frontend shows only approved)
router.get('/approved', getApprovedRestaurants);

module.exports = router;

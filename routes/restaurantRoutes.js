const express = require('express');
const router = express.Router();

const {
  createOrUpdateRestaurant,
  getPendingRestaurants,
  approveRestaurant,
  deleteRestaurant,
  getApprovedRestaurants,
  getMyRestaurant // ✅ Added here
} = require('../controllers/restaurantController');

const { protect, isAdmin } = require('../middleware/auth');

// ✅ Restaurant creates or updates their profile
router.post('/', protect, createOrUpdateRestaurant);

// ✅ Check if restaurant already exists (for logged-in restaurant)
router.get('/me', protect, getMyRestaurant);

// ✅ Admin actions
router.get('/pending', protect, isAdmin, getPendingRestaurants);
router.patch('/approve/:id', protect, isAdmin, approveRestaurant);
router.delete('/:id', protect, isAdmin, deleteRestaurant);

// ✅ Public route for frontend (show approved restaurants only)
router.get('/approved', getApprovedRestaurants);

module.exports = router;

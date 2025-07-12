// routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const { createRestaurant, getAllRestaurants, deleteRestaurant } = require('../controllers/restaurantController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/', protect, isAdmin, createRestaurant);
router.get('/', getAllRestaurants);
router.delete('/:id', protect, isAdmin, deleteRestaurant);

module.exports = router;

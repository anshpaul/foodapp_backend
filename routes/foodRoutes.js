// routes/foodRoutes.js
const express = require('express');
const router = express.Router();
const { addFood, getFoodsByRestaurant, deleteFood } = require('../controllers/foodController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/', protect, isAdmin, addFood);
router.get('/:restaurantId', getFoodsByRestaurant);
router.delete('/:id', protect, isAdmin, deleteFood);

module.exports = router;

// routes/foodRoutes.js
const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { protect, isAdmin } = require('../middleware/auth');

// ✅ Add new food
router.post('/', protect, isAdmin, async (req, res) => {
  const { restaurantId, name, imageUrl, price, description } = req.body;
  try {
    const food = new Food({ restaurantId, name, imageUrl, price, description });
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all foods for restaurant using query param ?restaurantId=xxx
router.get('/', async (req, res) => {
  const { restaurantId } = req.query;
  try {
    let foods;
    if (restaurantId) {
      foods = await Food.find({ restaurantId });
    } else {
      foods = await Food.find();
    }
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete food
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

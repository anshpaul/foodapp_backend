// routes/foodRoutes.js
const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const multer = require('multer');
const { protect } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure 'uploads' folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ✅ Add new food (only for restaurant owners)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, restaurantId } = req.body;

    // Validate restaurant ownership
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    if (restaurant.ownerId.toString() !== req.user.userId || req.user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Access denied: Only the restaurant owner can add food items' });
    }

    const imagePath = req.file ? req.file.path : null;
    const food = new Food({
      name,
      description,
      price: parseFloat(price),
      restaurantId,
      image: imagePath,
      inStock: true
    });
    await food.save();

    res.status(201).json({ message: 'Food item added', food });
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

// ✅ Delete food (only for admins)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
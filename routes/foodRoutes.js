// routes/foodRoutes.js
const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant'); // Make sure to import Restaurant model
const multer = require('multer');
const { protect, isAdmin, isRestaurantOwnerOrAdmin, canAccessFoodItem } = require('../middleware/auth');

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

// ✅ Add new food (for restaurant owners and admins)
router.post('/', protect, isRestaurantOwnerOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    
    // For restaurant owners, use the restaurantId from middleware
    // For admins, they should provide restaurantId in request body
    let restaurantId;
    
    if (req.user.role === 'admin') {
      restaurantId = req.body.restaurantId;
      if (!restaurantId) {
        return res.status(400).json({ message: 'Restaurant ID is required for admin' });
      }
    } else {
      // For restaurant owners, use the ID set by middleware
      restaurantId = req.restaurantId;
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

    res.status(201).json({ message: 'Food item added successfully', food });
  } catch (err) {
    console.error('Add food error:', err);
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

// ✅ Get foods for the authenticated restaurant owner
router.get('/my-foods', protect, isRestaurantOwnerOrAdmin, async (req, res) => {
  try {
    let foods;
    if (req.user.role === 'admin') {
      // Admins can see all foods
      foods = await Food.find().populate('restaurantId', 'name');
    } else {
      // Restaurant owners see only their foods
      foods = await Food.find({ restaurantId: req.restaurantId });
    }
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update food item (for restaurant owners and admins)
router.put('/:id', protect, canAccessFoodItem, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, inStock } = req.body;
    
    const updateData = {
      name,
      description,
      price: parseFloat(price),
      inStock: inStock !== undefined ? inStock : true
    };

    // If new image uploaded, update image path
    if (req.file) {
      updateData.image = req.file.path;
    }

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ message: 'Food item updated successfully', food });
  } catch (err) {
    console.error('Update food error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete food (for restaurant owners and admins)
router.delete('/:id', protect, canAccessFoodItem, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ message: 'Food item deleted successfully' });
  } catch (err) {
    console.error('Delete food error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Toggle food stock status
router.patch('/:id/toggle-stock', protect, canAccessFoodItem, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    food.inStock = !food.inStock;
    await food.save();

    res.json({ 
      message: `Food item ${food.inStock ? 'marked as in stock' : 'marked as out of stock'}`, 
      food 
    });
  } catch (err) {
    console.error('Toggle stock error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
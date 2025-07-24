// controllers/foodController.js
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');

const createFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // For restaurant owners, use their restaurant ID
    let restaurantId = req.restaurantId;

    // For admins, they might specify a restaurant ID in the request
    if (req.user.role === 'admin' && req.body.restaurantId) {
      restaurantId = req.body.restaurantId;
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
    }

    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' });
    }

    // Handle image upload from multer
    const imageUrl = req.file ? req.file.path : null;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Verify restaurant owner
    if (req.user.role === 'restaurant' && restaurant.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied: Only the restaurant owner can add food items' });
    }

    const food = new Food({
      name,
      description,
      price: parseFloat(price),
      category,
      imageUrl,
      restaurantId,
      createdBy: req.user.userId,
      inStock: true
    });

    await food.save();

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      food
    });

  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({ 
      message: 'Error creating food item',
      error: error.message 
    });
  }
};

// [Other existing methods remain unchanged: getMyFoods, getAllFoods, getFoodById, updateFood, deleteFood, updateFoodStock, getAllFoodsForAdmin]

module.exports = {
  createFood,
  getAllFoods,
  getMyFoods,
  getFoodById,
  updateFood,
  deleteFood,
  updateFoodStock,
  getAllFoodsForAdmin
};
// controllers/foodController.js
const Food = require('../models/Food'); // Adjust path as needed
const Restaurant = require('../models/Restaurant'); // Adjust path as needed

// Create new food item
const createFood = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    // For restaurant owners, use their restaurant ID
    let restaurantId = req.restaurantId;
    
    // For admins, they might specify a restaurant ID in the request
    if (req.user.role === 'admin' && req.body.restaurantId) {
      restaurantId = req.body.restaurantId;
    }

    if (!restaurantId) {
      return res.status(400).json({ 
        message: 'Restaurant ID is required' 
      });
    }

    const food = new Food({
      name,
      description,
      price,
      category,
      imageUrl,
      restaurantId,
      createdBy: req.user.userId
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

// Get foods for the current restaurant owner
const getMyFoods = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'restaurant') {
      // Restaurant owners see only their own food items
      query.restaurantId = req.restaurantId;
    } else if (req.user.role === 'admin') {
      // Admins can see all food items, or filter by restaurant if specified
      if (req.query.restaurantId) {
        query.restaurantId = req.query.restaurantId;
      }
    }

    const foods = await Food.find(query)
      .populate('restaurantId', 'name address')
      .sort({ createdAt: -1 });

    res.json(foods);

  } catch (error) {
    console.error('Get my foods error:', error);
    res.status(500).json({ 
      message: 'Error fetching food items',
      error: error.message 
    });
  }
};

// Get all foods (public route for customers)
const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({ inStock: true })
      .populate('restaurantId', 'name address phone')
      .sort({ createdAt: -1 });

    res.json(foods);

  } catch (error) {
    console.error('Get all foods error:', error);
    res.status(500).json({ 
      message: 'Error fetching food items',
      error: error.message 
    });
  }
};

// Get single food item
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('restaurantId', 'name address phone');

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json(food);

  } catch (error) {
    console.error('Get food by ID error:', error);
    res.status(500).json({ 
      message: 'Error fetching food item',
      error: error.message 
    });
  }
};

// Update food item
const updateFood = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, inStock } = req.body;

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        imageUrl,
        inStock,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({
      success: true,
      message: 'Food item updated successfully',
      food
    });

  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({ 
      message: 'Error updating food item',
      error: error.message 
    });
  }
};

// Delete food item
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({
      success: true,
      message: 'Food item deleted successfully'
    });

  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({ 
      message: 'Error deleting food item',
      error: error.message 
    });
  }
};

// Update food stock status
const updateFoodStock = async (req, res) => {
  try {
    const { inStock } = req.body;

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { inStock, updatedAt: Date.now() },
      { new: true }
    );

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({
      success: true,
      message: `Food item marked as ${inStock ? 'in stock' : 'out of stock'}`,
      food
    });

  } catch (error) {
    console.error('Update food stock error:', error);
    res.status(500).json({ 
      message: 'Error updating food stock status',
      error: error.message 
    });
  }
};

// Admin-only: Get all foods for admin dashboard
const getAllFoodsForAdmin = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate('restaurantId', 'name address phone')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(foods);

  } catch (error) {
    console.error('Get all foods for admin error:', error);
    res.status(500).json({ 
      message: 'Error fetching food items',
      error: error.message 
    });
  }
};

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
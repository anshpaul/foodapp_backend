const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');

// ✅ Create a new food item
const createFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    let restaurantId = req.restaurantId || req.body.restaurantId;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (req.user.role === 'restaurant' && restaurant.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied: Only the restaurant owner can add food items' });
    }

    const imageUrl = req.file ? req.file.path : null; // ✅ this will now be a Cloudinary URL

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

// ✅ Get all food items (public)
const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({ inStock: true });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching foods', error: error.message });
  }
};

// ✅ Get food items created by logged-in restaurant
const getMyFoods = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'restaurant') {
      filter = { createdBy: req.user.userId };
    }
    const foods = await Food.find(filter);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your foods', error: error.message });
  }
};

// ✅ Get a food item by ID
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching food by ID', error: error.message });
  }
};

// ✅ Update food item
const updateFood = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.imageUrl = req.file.path; // ✅ new Cloudinary URL
    }

    const updatedFood = await Food.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedFood) return res.status(404).json({ message: 'Food not found' });

    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: 'Error updating food', error: error.message });
  }
};


// ✅ Delete food item
const deleteFood = async (req, res) => {
  try {
    const deleted = await Food.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Food not found' });
    res.status(200).json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting food', error: error.message });
  }
};

// ✅ Toggle food stock status
const updateFoodStock = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    food.inStock = req.body.inStock;
    await food.save();

    res.status(200).json({ message: 'Stock updated successfully', food });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error: error.message });
  }
};

// ✅ Admin: Get all food items
const getAllFoodsForAdmin = async (req, res) => {
  try {
    const foods = await Food.find({}).populate('restaurantId');
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin foods', error: error.message });
  }
};

// ✅ Export all
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
